import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import Swal from 'sweetalert2';
import { editVendorDetails } from '../../api/vendorService';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const EditProfileModal = ({ isOpen, onClose, initialData, onSuccess }) => {
  const [editForm, setEditForm] = useState({
    businessName: initialData?.businessName || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    logo: null,
    banner: null
  });
  const [editLoading, setEditLoading] = useState(false);

  // Sync form when initialData changes (re-open scenario)
  React.useEffect(() => {
    if (isOpen && initialData) {
      setEditForm({
        businessName: initialData.businessName || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        address: initialData.address || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        logo: null,
        banner: null
      });
    }
  }, [isOpen, initialData]);

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
        Toast.fire({ icon: 'success', title: 'Profile updated successfully!' });
        onSuccess();
        onClose();
      } else {
        Toast.fire({ icon: 'error', title: response.message || 'Update failed' });
      }
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Something went wrong' });
    } finally {
      setEditLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">Edit Store Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
                onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Slug</label>
              <input
                type="text"
                value={editForm.slug}
                onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
            <textarea
              rows="3"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Address</label>
            <input
              type="text"
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
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
                  onChange={(e) => setEditForm({ ...editForm, logo: e.target.files[0] })}
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
                  onChange={(e) => setEditForm({ ...editForm, banner: e.target.files[0] })}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {editForm.banner && <span className="text-xs text-primary font-bold">{editForm.banner.name}</span>}
              </div>
            </div>
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
              disabled={editLoading}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold uppercase text-sm disabled:opacity-50"
            >
              {editLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
