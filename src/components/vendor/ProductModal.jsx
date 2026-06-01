import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { createProduct, updateProduct, deleteProductVariant, getProductDetails } from '../../api/vendorService';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ProductModal = ({ isOpen, onClose, isEditing, isViewing, productId, categories, onSuccess, getImageUrl }) => {
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    metaTitle: '',
    metaDescription: '',
    status: 'ACTIVE',
    hasVariants: false,
    isShippingApply: true,
    tags: '',
    variants: [
      {
        sku: '',
        salesPrice: '',
        costPrice: '',
        offeredPrice: '',
        stock: '',
        weight: '',
        length: '',
        width: '',
        height: '',
        attributes: { color: '', size: '' },
        thumbnail: null,
        images: []
      }
    ]
  });
  const [productLoading, setProductLoading] = useState(false);
  const [originalProductForm, setOriginalProductForm] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        const freshForm = {
          name: '', slug: '', description: '', categoryId: '', metaTitle: '', metaDescription: '', status: 'ACTIVE', hasVariants: false, isShippingApply: true, tags: '',
          variants: [{ sku: '', salesPrice: '', costPrice: '', offeredPrice: '', stock: '', weight: '', length: '', width: '', height: '', attributes: { color: '', size: '' }, thumbnail: null, images: [] }]
        };
        setProductForm(freshForm);
        setOriginalProductForm(freshForm);
        return;
      }

      Swal.fire({ title: 'Fetching full details...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const res = await getProductDetails(productId);
        Swal.close();

        if (res.success) {
          const fullProduct = res.data?.data || res.data;
          const initialData = {
            name: fullProduct.name,
            slug: fullProduct.slug,
            description: fullProduct.description,
            categoryId: fullProduct.categoryId?._id || fullProduct.categoryId,
            metaTitle: fullProduct.metaTitle || '',
            metaDescription: fullProduct.metaDescription || '',
            status: fullProduct.status || 'ACTIVE',
            hasVariants: fullProduct.hasVariants || false,
            isShippingApply: fullProduct.isShippingApply !== undefined ? fullProduct.isShippingApply : true,
            tags: (fullProduct.tags || []).join(', '),
            variants: (fullProduct.variants || []).map(v => ({
              _id: v._id,
              sku: v.sku,
              salesPrice: v.salesPrice,
              costPrice: v.costPrice || '',
              offeredPrice: v.offeredPrice || '',
              stock: v.stock,
              weight: v.weight || '',
              length: v.length || '',
              width: v.width || '',
              height: v.height || '',
              attributes: v.attributes || { color: '', size: '' },
              thumbnail: v.thumbnail,
              images: v.images || []
            }))
          };

          if (initialData.variants.length === 0) {
            initialData.variants = [{ sku: '', salesPrice: '', costPrice: '', offeredPrice: '', stock: '', weight: '', length: '', width: '', height: '', attributes: { color: '', size: '' }, thumbnail: null, images: [] }];
          }

          setProductForm(initialData);
          setOriginalProductForm(JSON.parse(JSON.stringify(initialData)));
        } else {
          Toast.fire({ icon: 'error', title: 'Failed to fetch product details' });
          onClose();
        }
      } catch (error) {
        Swal.close();
        console.error(error);
        Toast.fire({ icon: 'error', title: 'Error fetching details' });
        onClose();
      }
    };

    if (isOpen) {
      fetchProductDetails();
    }
  }, [isOpen, productId]);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation: Duplicate variants are not allowed
    if (productForm.hasVariants && productForm.variants?.length > 1) {
      const attrKeys = productForm.variants.map(v => {
        const color = (v.attributes?.color || '').trim().toLowerCase();
        const size = (v.attributes?.size || '').trim().toLowerCase();
        return `${color}-${size}`;
      });
      
      const duplicateCombinations = [];
      attrKeys.forEach((key, index) => {
        if (attrKeys.indexOf(key) !== index && !duplicateCombinations.includes(key)) {
          duplicateCombinations.push(key);
        }
      });

      if (duplicateCombinations.length > 0) {
        Toast.fire({
          icon: 'warning',
          title: 'Duplicate variants are not allowed. Please ensure each variant has a unique color and size combination.'
        });
        return;
      }
    }

    setProductLoading(true);
    try {
      // Map tags input from comma-separated string to tag arrays
      const processedTags = productForm.tags
        ? productForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];
      
      const payload = {
        ...productForm,
        tags: processedTags
      };

      const response = isEditing
        ? await updateProduct(productId, payload)
        : await createProduct(payload);

      if (response.success) {
        Toast.fire({ icon: 'success', title: response.data?.message || `Product ${isEditing ? 'updated' : 'created'} successfully!` });
        onSuccess();
        onClose();
      } else {
        Toast.fire({ icon: 'error', title: response.data?.message || response.message || 'Action failed' });
      }
    } catch (error) {
      console.error(error);
      Toast.fire({ icon: 'error', title: 'System error' });
    } finally {
      setProductLoading(false);
    }
  };

  const handleAddVariant = () => {
    setProductForm({
      ...productForm,
      variants: [...productForm.variants, { sku: '', salesPrice: '', costPrice: '', offeredPrice: '', stock: '', weight: '', length: '', width: '', height: '', attributes: { color: '', size: '' }, thumbnail: null, images: [] }]
    });
  };

  const updateVariant = (idx, field, value) => {
    const newVariants = [...productForm.variants];
    newVariants[idx][field] = value;
    setProductForm({ ...productForm, variants: newVariants });
  };

  const updateVariantAttr = (vIdx, key, value) => {
    const newVariants = [...productForm.variants];
    newVariants[vIdx].attributes[key] = value;
    setProductForm({ ...productForm, variants: newVariants });
  };

  const closeProductModal = async () => {
    if (isViewing) {
      onClose();
      return;
    }

    const hasChanges = JSON.stringify(productForm) !== JSON.stringify(originalProductForm);
    
    if (hasChanges) {
      const result = await Swal.fire({
        title: 'Unsaved Changes',
        text: 'You have modified some fields. Are you sure you want to close without saving?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Discard Changes',
        cancelButtonText: 'Keep Editing',
        background: '#fff',
        customClass: {
          confirmButton: 'bg-red-500 px-6 py-2.5 rounded-xl font-bold uppercase text-xs text-white',
          cancelButton: 'bg-gray-100 text-gray-800 px-6 py-2.5 rounded-xl font-bold uppercase text-xs'
        }
      });
      if (!result.isConfirmed) return;
    }

    onClose();
  };

  const handleDeleteVariant = async (vIdx) => {
    const variant = productForm.variants[vIdx];

    if (!variant._id) {
      setProductForm({
        ...productForm,
        variants: productForm.variants.filter((_, i) => i !== vIdx)
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Delete Variant?',
      text: "This will permanently remove this variant from the database.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      background: '#fff',
      customClass: {
        title: 'text-sm font-bold uppercase',
        htmlContainer: 'text-xs font-bold text-gray-500 uppercase',
        confirmButton: 'bg-red-500 px-6 py-2.5 rounded-xl font-bold uppercase text-xs text-white',
        cancelButton: 'bg-gray-100 text-gray-800 px-6 py-2.5 rounded-xl font-bold uppercase text-xs'
      }
    });

    if (result.isConfirmed) {
      Swal.fire({ title: 'Deleting variant...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const response = await deleteProductVariant(variant._id);
        Swal.close();
        if (response.success) {
          Toast.fire({ icon: 'success', title: 'Variant deleted successfully!' });
          setProductForm({
            ...productForm,
            variants: productForm.variants.filter((_, i) => i !== vIdx)
          });
        } else {
          Toast.fire({ icon: 'error', title: response.data?.message || 'Failed to delete variant' });
        }
      } catch (error) {
        Swal.close();
        Toast.fire({ icon: 'error', title: 'System error' });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold uppercase ">
            {isViewing ? 'Product Details' : (isEditing ? 'Update Product' : 'Add New Product')}
          </h2>
          <button onClick={closeProductModal} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-10 overflow-y-auto flex-1">
          {isViewing ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 uppercase">{productForm.name}</h1>
                  <p className="text-xs font-bold text-gray-400 mt-1 uppercase">{categories.find(c => c._id === productForm.categoryId)?.name || 'Uncategorized'}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${productForm.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {productForm.status}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase border-b border-gray-100 pb-2">Description</h3>
                <p className="text-sm font-medium text-gray-600 leading-relaxed">{productForm.description || 'No description provided.'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-5 bg-gray-50 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase">SEO Title</h3>
                  <p className="text-xs font-bold text-gray-800">{productForm.metaTitle || '—'}</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase">SEO Description</h3>
                  <p className="text-xs font-bold text-gray-800">{productForm.metaDescription || '—'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-5 bg-gray-50 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase">Tags</h3>
                  <div className="flex gap-2 flex-wrap">
                    {productForm.tags ? productForm.tags.split(',').map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-primary/10 text-primary font-bold text-xs rounded-lg uppercase">
                        {tag.trim()}
                      </span>
                    )) : '—'}
                  </div>
                </div>
                <div className="p-5 bg-gray-50 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase">Shipping Status</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${productForm.isShippingApply ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                    {productForm.isShippingApply ? 'Shipping Applied' : 'No Shipping'}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-l-4 border-primary pl-3">
                  <h3 className="text-sm font-bold text-gray-900 uppercase">Inventory & Variants ({productForm.variants.length})</h3>
                  {isViewing && productForm.variants.length > 1 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Remove Variant:</span>
                      <select
                        onChange={async (e) => {
                          const idx = parseInt(e.target.value);
                          if (!isNaN(idx)) {
                            await handleDeleteVariant(idx);
                            e.target.value = ""; // reset select
                          }
                        }}
                        className="bg-gray-100 border-none rounded-lg px-2.5 py-1 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none text-red-500 cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled>Select to delete</option>
                        {productForm.variants.map((v, i) => (
                          <option key={i} value={i} className="text-gray-700">
                            {v.sku || `Variant ${i + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {productForm.variants.map((v, idx) => (
                    <div key={idx} className="group border border-gray-100 rounded-3xl p-6 hover:border-primary/20 hover:bg-primary/[0.01] transition-all">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex gap-3 overflow-x-auto pb-2 min-w-[200px]">
                          <div className="w-24 h-24 rounded-2xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                            <img src={getImageUrl(v.thumbnail)} alt="thumb" className="w-full h-full object-cover" />
                          </div>
                          {(v.images || []).map((img, i) => (
                            <div key={i} className="w-24 h-24 rounded-2xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                              <img src={getImageUrl(img)} alt="gal" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>

                        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6 content-center">
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-gray-400 uppercase">SKU</p>
                            <p className="text-sm font-bold text-gray-900">{v.sku}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Sales Price</p>
                            <p className="text-sm font-bold text-primary">₹{v.salesPrice}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Stock</p>
                            <p className={`text-sm font-bold ${v.stock < 10 ? 'text-orange-500' : 'text-gray-900'}`}>{v.stock} Units</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Attributes</p>
                            <p className="text-xs font-bold text-gray-600 uppercase">
                              {v.attributes.color || 'N/A'} • {v.attributes.size || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Advanced details in view panel */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-4 pt-4 border-t border-gray-100">
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-gray-400 uppercase">Cost Price</p>
                          <p className="text-sm font-bold text-gray-800">₹{v.costPrice || '—'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-gray-400 uppercase">Offered Price</p>
                          <p className="text-sm font-bold text-green-600">₹{v.offeredPrice || '—'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-gray-400 uppercase">Weight</p>
                          <p className="text-sm font-bold text-gray-800">{v.weight ? `${v.weight} kg` : '—'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-gray-400 uppercase">Dimensions (L x W x H)</p>
                          <p className="text-xs font-bold text-gray-800">
                            {v.length || '0'} x {v.width || '0'} x {v.height || '0'} cm
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProductSubmit} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase border-l-4 border-primary pl-3">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Product Name</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Premium Silk Saree"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                    <select
                      required
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none appearance-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                  <textarea
                    rows="3"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Tell customers about your product..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none"
                  ></textarea>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={productForm.tags}
                    onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                    placeholder="e.g. Saree, Silk, Festive"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase border-l-4 border-gray-200 pl-3">SEO Metadata (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Meta Title</label>
                    <input
                      type="text"
                      value={productForm.metaTitle}
                      onChange={(e) => setProductForm({ ...productForm, metaTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Meta Description</label>
                    <input
                      type="text"
                      value={productForm.metaDescription}
                      onChange={(e) => setProductForm({ ...productForm, metaDescription: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 uppercase border-l-4 border-primary pl-3">Pricing & Variants</h3>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-xs font-bold text-primary uppercase hover:underline"
                  >
                    + Add Another Variant
                  </button>
                </div>

                <div className="space-y-6">
                  {productForm.variants.map((variant, vIdx) => (
                    <div key={vIdx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-6 relative">
                      {productForm.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteVariant(vIdx)}
                          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">SKU</label>
                          <input
                            type="text" required
                            value={variant.sku}
                            onChange={(e) => updateVariant(vIdx, 'sku', e.target.value)}
                            placeholder="BLK-MED"
                            className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">Sales Price</label>
                          <input
                            type="number" required
                            value={variant.salesPrice}
                            onChange={(e) => updateVariant(vIdx, 'salesPrice', e.target.value)}
                            className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">Stock</label>
                          <input
                            type="number" required
                            value={variant.stock}
                            onChange={(e) => updateVariant(vIdx, 'stock', e.target.value)}
                            className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">Cost Price</label>
                          <input
                            type="number"
                            value={variant.costPrice}
                            onChange={(e) => updateVariant(vIdx, 'costPrice', e.target.value)}
                            className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">Offered Price</label>
                          <input
                            type="number"
                            value={variant.offeredPrice}
                            onChange={(e) => updateVariant(vIdx, 'offeredPrice', e.target.value)}
                            className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">Weight (kg)</label>
                          <input
                            type="number" step="0.01"
                            value={variant.weight}
                            onChange={(e) => updateVariant(vIdx, 'weight', e.target.value)}
                            className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">Length (cm)</label>
                          <input
                            type="number"
                            value={variant.length}
                            onChange={(e) => updateVariant(vIdx, 'length', e.target.value)}
                            className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">Width (cm)</label>
                          <input
                            type="number"
                            value={variant.width}
                            onChange={(e) => updateVariant(vIdx, 'width', e.target.value)}
                            className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">Height (cm)</label>
                          <input
                            type="number"
                            value={variant.height}
                            onChange={(e) => updateVariant(vIdx, 'height', e.target.value)}
                            className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">Color</label>
                          <input
                            type="text"
                            value={variant.attributes.color}
                            onChange={(e) => updateVariantAttr(vIdx, 'color', e.target.value)}
                            placeholder="e.g. Black"
                            className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">Size</label>
                          <input
                            type="text"
                            value={variant.attributes.size}
                            onChange={(e) => updateVariantAttr(vIdx, 'size', e.target.value)}
                            placeholder="e.g. Medium"
                            className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">Thumbnail (Featured Image)</label>
                          <div className="relative h-24 bg-white rounded-xl border-2 border-dashed border-gray-200 overflow-hidden group">
                            {variant.thumbnail ? (
                              <div className="w-full h-full relative">
                                <img 
                                  src={getImageUrl(variant.thumbnail)} 
                                  alt="preview" 
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-[10px] font-bold text-white uppercase bg-primary px-3 py-1.5 rounded-lg">Change</span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                <Upload size={16} className="text-gray-400" />
                                <span className="text-[8px] font-bold text-gray-400 uppercase">Pick Main</span>
                              </div>
                            )}
                            <input 
                              type="file" 
                              onChange={(e) => updateVariant(vIdx, 'thumbnail', e.target.files[0])}
                              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">Gallery (Multiple Images)</label>
                          <div className="relative min-h-[96px] bg-white rounded-xl border-2 border-dashed border-gray-200 p-2 group">
                            {variant.images && variant.images.length > 0 ? (
                              <div className="grid grid-cols-4 gap-2">
                                {variant.images.map((img, i) => (
                                  <div key={i} className="aspect-square rounded-lg bg-gray-50 overflow-hidden border border-gray-100 relative group/img">
                                    <img src={getImageUrl(img)} alt="gal" className="w-full h-full object-cover" />
                                  </div>
                                ))}
                                <div className="aspect-square rounded-lg bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 relative">
                                   <Plus size={14} className="text-gray-400" />
                                   <input 
                                    type="file" multiple
                                    onChange={(e) => updateVariant(vIdx, 'images', [...variant.images, ...Array.from(e.target.files)])}
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-20 flex flex-col items-center justify-center gap-1">
                                <Plus size={16} className="text-gray-400" />
                                <span className="text-[8px] font-bold text-gray-400 uppercase">Add Gallery</span>
                                <input 
                                  type="file" multiple
                                  onChange={(e) => updateVariant(vIdx, 'images', Array.from(e.target.files))}
                                  className="absolute inset-0 opacity-0 cursor-pointer" 
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6 sticky bottom-0 bg-white py-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={closeProductModal}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={productLoading}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold uppercase text-sm shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {productLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Product' : 'Save Product')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
