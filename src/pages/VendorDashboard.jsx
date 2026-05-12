import React, { useState, useEffect } from 'react';
import { getVendorDetails, getVendorProducts, getVendorCategories, editVendorDetails, createCategory, deleteCategory, updateCategory, createProduct, updateProduct, deleteProduct, getProductDetails } from '../api/vendorService';
import { 
 LayoutDashboard, 
 Package, 
 ShoppingCart, 
 IndianRupee, 
 Plus, 
 Search, 
 TrendingUp, 
 MoreVertical,
 Image as ImageIcon,
 LogOut,
 Store,
 Mail,
 Phone,
 MapPin,
 Calendar,
 List,
 Edit,
 X,
 Upload,
 Trash2,
 Menu,
 Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import config from '../config/config';

const VendorDashboard = () => {
 const [activeTab, setActiveTab] = useState(() => {
   return localStorage.getItem('vendorActiveTab') || 'overview';
 });
 const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 
 useEffect(() => {
   localStorage.setItem('vendorActiveTab', activeTab);
 }, [activeTab]);

 const [showProductModal, setShowProductModal] = useState(false);
 const [showCategoryModal, setShowCategoryModal] = useState(false);
 const [showEditModal, setShowEditModal] = useState(false);
 const [vendorData, setVendorData] = useState(null);
 const [products, setProducts] = useState([]);
 const [categories, setCategories] = useState([]);
 const [loading, setLoading] = useState(true);
 const [productsLoading, setProductsLoading] = useState(false);
 const [categoriesLoading, setCategoriesLoading] = useState(false);

 // Edit Form State
 const [editForm, setEditForm] = useState({
    businessName: '',
    slug: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    logo: null,
    banner: null
 });
 const [editLoading, setEditLoading] = useState(false);

  // Category Form State
  const [catForm, setCatForm] = useState({
    name: '',
    slug: '',
    description: '',
    attributes: [
      { name: 'Brand', isVariant: false, values: [] },
      { name: 'Color', isVariant: true, values: [] }
    ],
    image: null
  });
  const [catLoading, setCatLoading] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    metaTitle: '',
    metaDescription: '',
    status: 'ACTIVE',
    hasVariants: false,
    variants: [
      {
        sku: '',
        price: '',
        salesPrice: '',
        stock: '',
        attributes: { color: '', size: '' },
        thumbnail: null,
        images: []
      }
    ]
  });
  const [productLoading, setProductLoading] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isViewingProduct, setIsViewingProduct] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

 // Fetch Vendor Details
 const fetchVendorData = async () => {
  try {
   const response = await getVendorDetails();
   if (response.success) {
    setVendorData(response.data);
    // Sync edit form with current data
    setEditForm({
      businessName: response.data.businessName || '',
      slug: response.data.slug || '',
      description: response.data.description || '',
      address: response.data.address || '',
      phone: response.data.phone || '',
      email: response.data.email || '',
      logo: null,
      banner: null
    });
   }
  } catch (error) {
   console.error("Failed to fetch vendor details:", error);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  fetchVendorData();
 }, []);

 // Fetch Vendor Products & Categories
 useEffect(() => {
   const fetchData = async () => {
     if (activeTab === 'products') {
       setProductsLoading(true);
       try {
         const response = await getVendorProducts();
         if (response.success) {
           // Handle nested data from /product/fetch-products
           const productList = response.data?.data || response.data || [];
           setProducts(productList);
         }
       } catch (error) { console.error(error); }
       finally { setProductsLoading(false); }
     }

     if (activeTab === 'categories' || showProductModal) {
       setCategoriesLoading(true);
       try {
         const response = await getVendorCategories();
         if (response.success) setCategories(response.data);
       } catch (error) { console.error(error); }
       finally { setCategoriesLoading(false); }
     }
   };
   
   fetchData();
 }, [activeTab, showProductModal]);

 const handleLogout = () => {
    localStorage.removeItem('user_session');
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

 const stats = [
 { label: 'Total Products', value: products.length || '0', icon: <Package className="text-blue-600" />, change: 'Live' },
 { label: 'Total Categories', value: categories.length || '0', icon: <List className="text-orange-600" />, change: 'Active' },
 { label: 'Total Earnings', value: '₹0', icon: <IndianRupee className="text-purple-600" />, change: '₹0 today' },
 { label: 'Store Status', value: vendorData?.status || 'PENDING', icon: <Store className="text-green-600" />, change: 'Status' },
 ];

 const getImageUrl = (image) => {
   if (!image) return null;
   if (typeof image === 'object' && image.url) return image.url;
   if (typeof image === 'string' && image.startsWith('http')) return image;
   return `${config.API_URL}/upload/${image}`;
 };

 // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    const formData = new FormData();
    Object.keys(editForm).forEach(key => {
      if (editForm[key]) formData.append(key, editForm[key]);
    });

    try {
      const response = await editVendorDetails(formData);
      if (response.success) {
        toast.success('Profile updated successfully!');
        fetchVendorData();
        setShowEditModal(false);
      } else {
        toast.error(response.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCatLoading(true);
    
    // Auto-generate slug if empty
    const categoryData = {
      ...catForm,
      slug: catForm.slug || catForm.name.toLowerCase().replace(/\s+/g, '-'),
      // Ensure values are arrays (split by comma if input as string)
      attributes: catForm.attributes.map(attr => ({
        ...attr,
        values: Array.isArray(attr.values) ? attr.values : attr.values.split(',').map(v => v.trim()).filter(v => v)
      }))
    };

    try {
      let response;
      if (isEditingCategory) {
        response = await updateCategory(currentCategoryId, categoryData);
      } else {
        response = await createCategory(categoryData);
      }

      if (response.success) {
        const msg = response.data?.message || response.message || (isEditingCategory ? 'Category updated!' : 'Category created!');
        toast.success(msg);
        const res = await getVendorCategories();
        if (res.success) setCategories(res.data);
        setShowCategoryModal(false);
        setIsEditingCategory(false);
        setCatForm({ name: '', slug: '', description: '', attributes: [{ name: '', isVariant: false, values: [] }], image: null });
      } else {
        toast.error(response.data?.message || response.message || 'Action failed');
      }
    } catch (error) {
      toast.error('System error');
    } finally {
      setCatLoading(false);
    }
  };

  const handleEditCategory = (cat) => {
    setIsEditingCategory(true);
    setCurrentCategoryId(cat._id);
    setCatForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      attributes: cat.attributes || [{ name: '', isVariant: false, values: [] }],
      image: cat.image // Keep the existing image ID
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff2c61',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, delete it!',
      background: '#ffffff',
      borderRadius: '20px',
      customClass: {
        popup: 'rounded-3xl border-none',
        confirmButton: 'rounded-xl font-bold uppercase text-xs px-6 py-3',
        cancelButton: 'rounded-xl font-bold uppercase text-xs px-6 py-3'
      }
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteCategory(id);
        if (response.success) {
          const msg = response.data?.message || response.message || 'Category deleted';
          Swal.fire({
            title: 'Deleted!',
            text: msg,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            background: '#ffffff',
            borderRadius: '20px'
          });
          setCategories(categories.filter(c => c._id !== id));
        } else {
          Swal.fire('Error!', response.data?.message || response.message || 'Delete failed', 'error');
        }
      } catch (error) {
        Swal.fire('Error!', 'System error occurred', 'error');
      }
    }
  };
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductLoading(true);
    try {
      const response = isEditingProduct 
        ? await updateProduct(currentProductId, productForm)
        : await createProduct(productForm);

      if (response.success) {
        toast.success(response.data?.message || `Product ${isEditingProduct ? 'updated' : 'created'} successfully!`);
        const res = await getVendorProducts();
        if (res.success) {
          const productList = res.data?.data || res.data || [];
          setProducts(productList);
        }
        setShowProductModal(false);
        setProductForm({
          name: '', slug: '', description: '', categoryId: '', metaTitle: '', metaDescription: '', status: 'ACTIVE', hasVariants: false,
          variants: [{ sku: '', price: '', salesPrice: '', stock: '', attributes: { color: '', size: '' }, thumbnail: null, images: [] }]
        });
      } else {
        toast.error(response.data?.message || response.message || 'Action failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('System error');
    } finally {
      setProductLoading(false);
    }
  };

  const handleEditProduct = async (product) => {
    const loadingToast = toast.loading('Fetching full details...');
    try {
      const res = await getProductDetails(product._id);
      toast.dismiss(loadingToast);
      
      if (res.success) {
        const fullProduct = res.data?.data || res.data;
        setIsEditingProduct(true);
        setCurrentProductId(fullProduct._id);
        setProductForm({
          name: fullProduct.name,
          slug: fullProduct.slug,
          description: fullProduct.description,
          categoryId: fullProduct.categoryId?._id || fullProduct.categoryId,
          metaTitle: fullProduct.metaTitle || '',
          metaDescription: fullProduct.metaDescription || '',
          status: fullProduct.status || 'ACTIVE',
          hasVariants: fullProduct.hasVariants || false,
          variants: (fullProduct.variants || []).map(v => ({
            sku: v.sku,
            price: v.price,
            salesPrice: v.salesPrice,
            stock: v.stock,
            attributes: v.attributes || { color: '', size: '' },
            thumbnail: v.thumbnail,
            images: v.images || []
          }))
        });
        
        // Ensure at least one variant exists if empty
        if ((fullProduct.variants || []).length === 0) {
          setProductForm(prev => ({
            ...prev,
            variants: [{ sku: '', price: '', salesPrice: '', stock: '', attributes: { color: '', size: '' }, thumbnail: null, images: [] }]
          }));
        }

        setShowProductModal(true);
      } else {
        toast.error('Failed to fetch product details');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(error);
      toast.error('Error fetching details');
    }
  };

  const handleViewProduct = async (product) => {
    await handleEditProduct(product);
    setIsViewingProduct(true);
    setIsEditingProduct(false);
  };

  const handleDeleteProduct = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#fff',
      customClass: {
        title: 'text-lg font-bold font-outfit uppercase',
        htmlContainer: 'text-xs font-bold font-outfit text-gray-500 uppercase',
        confirmButton: 'bg-primary px-6 py-2.5 rounded-xl font-bold uppercase text-xs',
        cancelButton: 'bg-gray-100 text-gray-800 px-6 py-2.5 rounded-xl font-bold uppercase text-xs'
      }
    });

    if (result.isConfirmed) {
      const loadingToast = toast.loading('Deleting product...');
      try {
        const response = await deleteProduct(id);
        toast.dismiss(loadingToast);
        if (response.success) {
          toast.success(response.data?.message || 'Product deleted successfully!');
          const res = await getVendorProducts();
          if (res.success) {
            const productList = res.data?.data || res.data || [];
            setProducts(productList);
          }
        } else {
          toast.error(response.data?.message || 'Failed to delete product');
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error('System error');
      }
    }
  };

  const handleAddVariant = () => {
    setProductForm({
      ...productForm,
      variants: [...productForm.variants, { sku: '', price: '', salesPrice: '', stock: '', attributes: { color: '', size: '' }, thumbnail: null, images: [] }]
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


 if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 font-outfit uppercase font-bold text-gray-400">Loading Dashboard...</div>;

 return (
 <div className="flex min-h-screen bg-gray-50 font-outfit">
   {/* Sidebar Overlay for Mobile */}
   {isSidebarOpen && (
     <div 
       className="fixed inset-0 bg-black/60 z-[100] lg:hidden backdrop-blur-sm"
       onClick={() => setIsSidebarOpen(false)}
     ></div>
   )}

   {/* Sidebar */}
   <div className={`
     fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-[101] 
     flex flex-col transition-transform duration-300 transform
     ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
   `}>
   <div className="p-6 border-b border-gray-100 flex items-center justify-between">
    <span className="text-2xl font-bold text-primary uppercase truncate block">
     {vendorData?.businessName || 'V-DASH'}
    </span>
    <button className="lg:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
      <X size={20} />
    </button>
   </div>
   <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
    {[
      { id: 'overview', icon: <LayoutDashboard size={18} />, label: 'Overview' },
      { id: 'products', icon: <Package size={18} />, label: 'Products' },
      { id: 'categories', icon: <List size={18} />, label: 'Categories' },
      { id: 'orders', icon: <ShoppingCart size={18} />, label: 'Orders' },
      { id: 'earnings', icon: <IndianRupee size={18} />, label: 'Earnings' },
      { id: 'profile', icon: <Store size={18} />, label: 'Store Profile' }
    ].map((item) => (
      <button 
        key={item.id}
        onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-100'}`}
      >
        {item.icon} {item.label}
      </button>
    ))}
   </nav>
   <div className="p-4 border-t border-gray-100">
     <button 
       onClick={handleLogout}
       className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-all"
     >
       <LogOut size={18} /> Logout
     </button>
   </div>
   </div>

   {/* Main Content */}
   <div className="flex-1 flex flex-col h-screen overflow-y-auto">
     <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
       <div className="flex items-center gap-4">
         <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
           <Menu size={24} />
         </button>
         <h1 className="text-lg lg:text-xl font-bold text-gray-800 capitalize">{activeTab}</h1>
       </div>
       
       <div className="flex items-center gap-4">
         <div className="relative hidden md:block">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
           <input 
             type="text" 
             placeholder="Search..." 
             className="pl-9 pr-4 py-1.5 bg-gray-100 border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary/10 outline-none w-48 lg:w-64"
           />
         </div>
         <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase border border-primary/20">
           {vendorData?.businessName?.charAt(0) || 'V'}
         </div>
       </div>
     </header>

     <main className="p-4 lg:p-8">
   {activeTab === 'overview' && (
   <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    {stats.map((stat, i) => (
     <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
     <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gray-50 rounded-xl">{stat.icon}</div>
      <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full uppercase ">{stat.change}</span>
     </div>
     <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
     <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
     </div>
    ))}
    </div>
   </div>
   )}

   {activeTab === 'products' && (
   <div className="space-y-6">
    <div className="flex justify-between items-center">
    <h2 className="text-lg font-bold">Product Catalog</h2>
    <button 
      onClick={() => { 
        setIsEditingProduct(false); 
        setIsViewingProduct(false);
        setProductForm({
          name: '', slug: '', description: '', categoryId: '', metaTitle: '', metaDescription: '', status: 'ACTIVE', hasVariants: false,
          variants: [{ sku: '', price: '', salesPrice: '', stock: '', attributes: { color: '', size: '' }, thumbnail: null, images: [] }]
        });
        setShowProductModal(true); 
      }} 
      className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
     >
      <Plus size={18} /> Add Product
     </button>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <table className="w-full text-left">
     <thead className="bg-gray-50 border-b border-gray-100">
     <tr>
      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Product</th>
      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Price</th>
      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Stock</th>
      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
     </tr>
     </thead>
     <tbody className="divide-y divide-gray-50">
     {productsLoading ? (
       <tr><td colSpan="5" className="p-10 text-center font-bold text-gray-400">Loading products...</td></tr>
     ) : products.map((product) => (
      <tr key={product._id} className="hover:bg-gray-50/50">
      <td className="px-6 py-4">
       <div className="flex items-center gap-3">
        <img src={getImageUrl(product.variants?.[0]?.thumbnail) || `https://ui-avatars.com/api/?name=${product.name}&background=random`} alt="" className="w-10 h-10 rounded-lg object-cover" />
        <span className="font-bold text-gray-800 text-sm">{product.name}</span>
       </div>
      </td>
      <td className="px-6 py-4 text-sm font-bold text-gray-800">₹{product.variants?.[0]?.salesPrice || 0}</td>
      <td className="px-6 py-4 text-sm font-bold text-gray-600">{product.variants?.[0]?.stock || 0} units</td>
      <td className="px-6 py-4">
       <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${product.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {product.status}
       </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => handleViewProduct(product)}
            className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => { setIsViewingProduct(false); handleEditProduct(product); }}
            className="p-2 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
            title="Edit Product"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => handleDeleteProduct(product._id)}
            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Delete Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
      </tr>
     ))}
     {products.length === 0 && !productsLoading && (
       <tr><td colSpan="5" className="p-10 text-center font-bold text-gray-400">No products found.</td></tr>
     )}
     </tbody>
    </table>
    </div>
   </div>
   )}

   {activeTab === 'categories' && (
   <div className="space-y-6">
     <div className="flex justify-between items-center">
     <h2 className="text-lg font-bold">Manage Categories</h2>
      <button 
       onClick={() => { setIsEditingCategory(false); setCatForm({ name: '', slug: '', description: '', attributes: [{ name: '', isVariant: false, values: [] }], image: null }); setShowCategoryModal(true); }}
       className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary-hover shadow-lg shadow-primary/20"
      >
       <Plus size={18} /> New Category
      </button>
     </div>

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categoriesLoading ? (
              <tr><td colSpan="5" className="p-10 text-center font-bold text-gray-400">Loading categories...</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                      <img 
                        src={getImageUrl(cat.image) || `https://ui-avatars.com/api/?name=${cat.name}&background=random`} 
                        alt="" 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${cat.name}&background=random`; }}
                      />
                    </div>
                    <span className="font-bold text-gray-800 text-sm">{cat.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{cat.slug}</td>
                <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">{cat.description}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${cat.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {cat.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEditCategory(cat)}
                      className="p-2 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      title="Edit Category"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && !categoriesLoading && (
              <tr><td colSpan="5" className="p-10 text-center font-bold text-gray-400">No categories found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
   </div>
   )}

   {activeTab === 'profile' && vendorData && (
   <div className="max-w-4xl space-y-8">
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
     <div className="h-48 bg-gray-100 relative">
      <img 
        src={getImageUrl(vendorData.banner)} 
        alt="Banner" 
        className="w-full h-full object-cover" 
        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80'; }}
      />
      <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-2xl bg-white shadow-xl border-4 border-white flex items-center justify-center overflow-hidden">
        <img 
          src={getImageUrl(vendorData.logo)} 
          alt="Logo" 
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${vendorData.businessName}&background=random&size=128`; }}
        />
      </div>
      <button 
        onClick={() => setShowEditModal(true)}
        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur shadow-lg p-3 rounded-xl text-primary hover:scale-110 transition-all flex items-center gap-2 font-bold text-xs"
      >
        <Edit size={16} /> Edit Profile
      </button>
     </div>
     <div className="pt-16 p-8">
      <div className="flex justify-between items-start">
       <div>
        <h2 className="text-2xl font-bold text-gray-900">{vendorData.businessName}</h2>
        <p className="text-gray-500 font-medium">@{vendorData.slug}</p>
       </div>
       <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${vendorData.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
        {vendorData.status}
       </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
       <div className="space-y-6">
        <div>
         <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Email Address</label>
         <p className="text-sm font-bold text-gray-800">{vendorData.email || 'N/A'}</p>
        </div>
        <div>
         <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Phone Number</label>
         <p className="text-sm font-bold text-gray-800">{vendorData.phone || 'N/A'}</p>
        </div>
        <div>
         <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Commission Rate</label>
         <p className="text-sm font-bold text-gray-800">{vendorData.commissionRate || 0}%</p>
        </div>
       </div>
       <div className="space-y-6">
        <div>
         <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Business Address</label>
         <p className="text-sm font-bold text-gray-800">{vendorData.address || 'N/A'}</p>
        </div>
        <div>
         <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Description</label>
         <p className="text-sm font-bold text-gray-800">{vendorData.description || 'N/A'}</p>
        </div>
        <div>
         <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Member Since</label>
         <p className="text-sm font-bold text-gray-800">{new Date(vendorData.createdAt).toLocaleDateString()}</p>
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>
   )}
  </main>
  </div>

  {/* Edit Profile Modal */}
  {showEditModal && (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">Edit Store Profile</h2>
          <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Business Name</label>
              <input 
                type="text" 
                value={editForm.businessName}
                onChange={(e) => setEditForm({...editForm, businessName: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Slug</label>
              <input 
                type="text" 
                value={editForm.slug}
                onChange={(e) => setEditForm({...editForm, slug: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
            <textarea 
              rows="3"
              value={editForm.description}
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
              <input 
                type="email" 
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
              <input 
                type="text" 
                value={editForm.phone}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Address</label>
            <input 
              type="text" 
              value={editForm.address}
              onChange={(e) => setEditForm({...editForm, address: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" 
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Update Logo</label>
              <div className="relative group cursor-pointer h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-all">
                <Upload size={20} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-400 uppercase">Upload New Logo</span>
                <input 
                  type="file" 
                  onChange={(e) => setEditForm({...editForm, logo: e.target.files[0]})}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
                {editForm.logo && <span className="text-xs text-primary font-bold">{editForm.logo.name}</span>}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Update Banner</label>
              <div className="relative group cursor-pointer h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-all">
                <Upload size={20} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-400 uppercase">Upload New Banner</span>
                <input 
                  type="file" 
                  onChange={(e) => setEditForm({...editForm, banner: e.target.files[0]})}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
                {editForm.banner && <span className="text-xs text-primary font-bold">{editForm.banner.name}</span>}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
            <button 
              type="button" 
              onClick={() => setShowEditModal(false)} 
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={editLoading}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold uppercase text-sm disabled:opacity-50"
            >
              {editLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* Category Modal */}
  {showCategoryModal && (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold">{isEditingCategory ? 'Edit Category' : 'Add New Category'}</h2>
          <button 
            onClick={() => { setShowCategoryModal(false); setIsEditingCategory(false); }} 
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleCategorySubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Category Name</label>
              <input 
                type="text" 
                required
                value={catForm.name}
                onChange={(e) => setCatForm({...catForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                placeholder="e.g. Electronics" 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Slug</label>
              <input 
                type="text" 
                required
                value={catForm.slug}
                onChange={(e) => setCatForm({...catForm, slug: e.target.value})}
                placeholder="electronics" 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
            <textarea 
              rows="2"
              value={catForm.description}
              onChange={(e) => setCatForm({...catForm, description: e.target.value})}
              placeholder="Describe this category..."
              className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Category Image</label>
            <div className="relative h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-all cursor-pointer overflow-hidden group">
              {catForm.image ? (
                <>
                  <img 
                    src={catForm.image instanceof File ? URL.createObjectURL(catForm.image) : getImageUrl(catForm.image)} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold uppercase bg-primary px-3 py-1.5 rounded-lg shadow-lg">Change Image</span>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatForm({...catForm, image: null}); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-lg shadow-lg flex items-center justify-center text-red-500 hover:scale-110 transition-all z-20"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <ImageIcon size={24} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-400 uppercase">Upload Image</span>
                </>
              )}
              <input 
                type="file" 
                required={!isEditingCategory}
                onChange={(e) => setCatForm({...catForm, image: e.target.files[0]})}
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-400 uppercase">Attributes & Variants</label>
              <button 
                type="button" 
                onClick={() => setCatForm({...catForm, attributes: [...catForm.attributes, { name: '', isVariant: false, values: [] }]})}
                className="text-xs font-bold text-primary uppercase hover:underline"
              >
                + Add Attribute
              </button>
            </div>
            
            {catForm.attributes.map((attr, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 relative group">
                <button 
                  type="button"
                  onClick={() => setCatForm({...catForm, attributes: catForm.attributes.filter((_, i) => i !== idx)})}
                  className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Attr Name</label>
                    <input 
                      type="text"
                      value={attr.name}
                      onChange={(e) => {
                        const newAttrs = [...catForm.attributes];
                        newAttrs[idx].name = e.target.value;
                        setCatForm({...catForm, attributes: newAttrs});
                      }}
                      placeholder="e.g. Color"
                      className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none"
                    />
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={attr.isVariant}
                        onChange={(e) => {
                          const newAttrs = [...catForm.attributes];
                          newAttrs[idx].isVariant = e.target.checked;
                          setCatForm({...catForm, attributes: newAttrs});
                        }}
                        className="accent-primary"
                      />
                      <span className="text-xs font-bold text-gray-500 uppercase">Is Variant</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Values (Comma Separated)</label>
                  <input 
                    type="text"
                    value={Array.isArray(attr.values) ? attr.values.join(', ') : attr.values}
                    onChange={(e) => {
                      const newAttrs = [...catForm.attributes];
                      newAttrs[idx].values = e.target.value;
                      setCatForm({...catForm, attributes: newAttrs});
                    }}
                    placeholder="Red, Blue, Green"
                    className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
            <button 
              type="button" 
              onClick={() => { setShowCategoryModal(false); setIsEditingCategory(false); }} 
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={catLoading}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold uppercase text-sm shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {catLoading ? (isEditingCategory ? 'Updating...' : 'Creating...') : (isEditingCategory ? 'Update Category' : 'Create Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* Product Modal */}
  {showProductModal && (
  <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4">
   <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
    <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
      <h2 className="text-xl font-bold uppercase ">
        {isViewingProduct ? 'Product Details' : (isEditingProduct ? 'Update Product' : 'Add New Product')}
      </h2>
      <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
        <X size={20} />
      </button>
    </div>
    
    <div className="p-8 space-y-10 overflow-y-auto flex-1">
      {isViewingProduct ? (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900 uppercase">{productForm.name}</h1>
              <p className="text-xs font-bold text-gray-400 mt-1 uppercase">{categories.find(c => c._id === productForm.categoryId)?.name || 'Uncategorized'}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${productForm.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {productForm.status}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase border-b border-gray-100 pb-2">Description</h3>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">{productForm.description || 'No description provided.'}</p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-5 bg-gray-50 rounded-2xl space-y-3">
              <h3 className="text-[10px] font-black text-gray-400 uppercase">SEO Title</h3>
              <p className="text-xs font-bold text-gray-800">{productForm.metaTitle || '—'}</p>
            </div>
            <div className="p-5 bg-gray-50 rounded-2xl space-y-3">
              <h3 className="text-[10px] font-black text-gray-400 uppercase">SEO Description</h3>
              <p className="text-xs font-bold text-gray-800">{productForm.metaDescription || '—'}</p>
            </div>
          </div>

          {/* Variants Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-gray-900 uppercase  border-l-4 border-primary pl-3">Inventory & Variants ({productForm.variants.length})</h3>
            <div className="grid grid-cols-1 gap-6">
              {productForm.variants.map((v, idx) => (
                <div key={idx} className="group border border-gray-100 rounded-3xl p-6 hover:border-primary/20 hover:bg-primary/[0.01] transition-all">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Media Display */}
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
                    
                    {/* Details Table-like info */}
                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6 content-center">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase">SKU</p>
                        <p className="text-sm font-black text-gray-900">{v.sku}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase">Price</p>
                        <p className="text-sm font-black text-primary">₹{v.salesPrice} <span className="text-[10px] text-gray-300 line-through ml-1">₹{v.price}</span></p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase">Stock</p>
                        <p className={`text-sm font-black ${v.stock < 10 ? 'text-orange-500' : 'text-gray-900'}`}>{v.stock} Units</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase">Attributes</p>
                        <p className="text-[10px] font-bold text-gray-600 uppercase">
                          {v.attributes.color || 'N/A'} • {v.attributes.size || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleProductSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase border-l-4 border-primary pl-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  placeholder="e.g. Premium Silk Saree" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Category</label>
                <select 
                  required
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({...productForm, categoryId: e.target.value})}
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
              <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
              <textarea 
                rows="3"
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                placeholder="Tell customers about your product..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none"
              ></textarea>
            </div>
          </div>

          {/* SEO Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase border-l-4 border-gray-200 pl-3">SEO Metadata (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Meta Title</label>
                <input 
                  type="text" 
                  value={productForm.metaTitle}
                  onChange={(e) => setProductForm({...productForm, metaTitle: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Meta Description</label>
                <input 
                  type="text" 
                  value={productForm.metaDescription}
                  onChange={(e) => setProductForm({...productForm, metaDescription: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none" 
                />
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 uppercase border-l-4 border-primary pl-3">Pricing & Variants</h3>
              <button 
                type="button" 
                onClick={handleAddVariant}
                className="text-[10px] font-bold text-primary uppercase hover:underline"
              >
                + Add Another Variant
              </button>
            </div>

            <div className="space-y-6">
              {productForm.variants.map((variant, vIdx) => (
                <div key={vIdx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-6 relative">
                  {vIdx > 0 && (
                    <button 
                      type="button"
                      onClick={() => setProductForm({...productForm, variants: productForm.variants.filter((_, i) => i !== vIdx)})}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  )}
                  
                  {/* Variant Basic Fields */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">SKU</label>
                      <input 
                        type="text" required
                        value={variant.sku}
                        onChange={(e) => updateVariant(vIdx, 'sku', e.target.value)}
                        placeholder="BLK-MED"
                        className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Price</label>
                      <input 
                        type="number" required
                        value={variant.price}
                        onChange={(e) => updateVariant(vIdx, 'price', e.target.value)}
                        className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Sales Price</label>
                      <input 
                        type="number" required
                        value={variant.salesPrice}
                        onChange={(e) => updateVariant(vIdx, 'salesPrice', e.target.value)}
                        className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Stock</label>
                      <input 
                        type="number" required
                        value={variant.stock}
                        onChange={(e) => updateVariant(vIdx, 'stock', e.target.value)}
                        className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none" 
                      />
                    </div>
                  </div>

                  {/* Variant Attributes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Color</label>
                      <input 
                        type="text"
                        value={variant.attributes.color}
                        onChange={(e) => updateVariantAttr(vIdx, 'color', e.target.value)}
                        placeholder="e.g. Black"
                        className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Size</label>
                      <input 
                        type="text"
                        value={variant.attributes.size}
                        onChange={(e) => updateVariantAttr(vIdx, 'size', e.target.value)}
                        placeholder="e.g. Medium"
                        className="w-full px-3 py-2 bg-white border-none rounded-lg text-xs font-bold outline-none" 
                      />
                    </div>
                  </div>

                  {/* Variant Media */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Thumbnail (Featured Image)</label>
                      <div className="relative h-20 bg-white rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 cursor-pointer group">
                        {variant.thumbnail ? (
                          <span className="text-[10px] font-bold text-primary truncate px-4">
                            {variant.thumbnail instanceof File ? variant.thumbnail.name : 'Current Image'}
                          </span>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload size={14} className="text-gray-400" />
                            <span className="text-[8px] font-bold text-gray-400 uppercase">Pick Main</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          onChange={(e) => updateVariant(vIdx, 'thumbnail', e.target.files[0])}
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Gallery (Multiple Images)</label>
                      <div className="relative h-20 bg-white rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 cursor-pointer">
                        {variant.images.length > 0 ? (
                          <span className="text-[10px] font-bold text-primary">{variant.images.length} files selected</span>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Plus size={14} className="text-gray-400" />
                            <span className="text-[8px] font-bold text-gray-400 uppercase">Add Gallery</span>
                          </div>
                        )}
                        <input 
                          type="file" multiple
                          onChange={(e) => updateVariant(vIdx, 'images', Array.from(e.target.files))}
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions - In View mode these are hidden or replaced */}
          <div className="flex gap-4 pt-6 sticky bottom-0 bg-white py-4 border-t border-gray-50">
            <button 
              type="button" 
              onClick={() => setShowProductModal(false)} 
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={productLoading}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold uppercase text-sm shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {productLoading ? (isEditingProduct ? 'Updating...' : 'Creating...') : (isEditingProduct ? 'Update Product' : 'Save Product')}
            </button>
          </div>
        </form>
      )}
    </div>
   </div>
  </div>
  )}
 </div>
 );
};

export default VendorDashboard;
