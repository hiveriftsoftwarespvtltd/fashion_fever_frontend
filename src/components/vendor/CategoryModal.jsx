import React, { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import { createCategory, updateCategory } from '../../api/vendorService';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const CategoryModal = ({ isOpen, onClose, isEditing, currentCategory, onSuccess, getImageUrl }) => {
  const [catForm, setCatForm] = useState({
    name: currentCategory?.name || '',
    slug: currentCategory?.slug || '',
    description: currentCategory?.description || '',
    attributes: currentCategory?.attributes || [
      { name: 'Brand', isVariant: false, values: [] },
      { name: 'Color', isVariant: true, values: [] }
    ],
    image: currentCategory?.image || null
  });
  const [catLoading, setCatLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setCatForm({
        name: currentCategory?.name || '',
        slug: currentCategory?.slug || '',
        description: currentCategory?.description || '',
        attributes: currentCategory?.attributes || [
          { name: 'Brand', isVariant: false, values: [] },
          { name: 'Color', isVariant: true, values: [] }
        ],
        image: currentCategory?.image || null
      });
    }
  }, [isOpen, currentCategory]);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCatLoading(true);

    const categoryData = {
      ...catForm,
      slug: catForm.slug || catForm.name.toLowerCase().replace(/\s+/g, '-'),
      attributes: catForm.attributes.map(attr => ({
        ...attr,
        values: Array.isArray(attr.values) ? attr.values : attr.values.split(',').map(v => v.trim()).filter(v => v)
      }))
    };

    try {
      let response;
      if (isEditing && currentCategory?._id) {
        response = await updateCategory(currentCategory._id, categoryData);
      } else {
        response = await createCategory(categoryData);
      }

      if (response.success) {
        const msg = response.data?.message || response.message || (isEditing ? 'Category updated!' : 'Category created!');
        Toast.fire({ icon: 'success', title: msg });
        onSuccess();
        onClose();
      } else {
        Toast.fire({ icon: 'error', title: response.data?.message || response.message || 'Action failed' });
      }
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'System error' });
    } finally {
      setCatLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
          <button
            onClick={onClose}
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
                onChange={(e) => setCatForm({ ...catForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
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
                onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
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
              onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
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
                    <span className="text-white text-xs font-bold uppercase bg-primary px-3 py-1.5 rounded-lg shadow-lg">Change Image</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatForm({ ...catForm, image: null }); }}
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
                required={!isEditing}
                onChange={(e) => setCatForm({ ...catForm, image: e.target.files[0] })}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-400 uppercase">Attributes & Variants</label>
              <button
                type="button"
                onClick={() => setCatForm({ ...catForm, attributes: [...catForm.attributes, { name: '', isVariant: false, values: [] }] })}
                className="text-xs font-bold text-primary uppercase hover:underline"
              >
                + Add Attribute
              </button>
            </div>

            {catForm.attributes.map((attr, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 relative group">
                <button
                  type="button"
                  onClick={() => setCatForm({ ...catForm, attributes: catForm.attributes.filter((_, i) => i !== idx) })}
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
                        setCatForm({ ...catForm, attributes: newAttrs });
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
                          setCatForm({ ...catForm, attributes: newAttrs });
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
                    value={Array.isArray(attr.values) ? attr.values.join(', ') : (attr.values || '')}
                    onChange={(e) => {
                      const newAttrs = [...catForm.attributes];
                      newAttrs[idx].values = e.target.value;
                      setCatForm({ ...catForm, attributes: newAttrs });
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
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={catLoading}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold uppercase text-sm shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {catLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Category' : 'Create Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
