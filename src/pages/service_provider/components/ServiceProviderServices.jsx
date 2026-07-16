import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  ImageOff, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Clock, 
  Tag, 
  IndianRupee, 
  SlidersHorizontal,
  X,
  Upload,
  Briefcase,
  Pencil,
  Eye,
  Trash2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from '../../../utils/toast';
import { createService, updateService, deleteService, getServicesList, getServiceDetails } from '../../../api/serviceProviderService';
import { getAllServiceCategories } from '../../../api/adminService';

const ServiceProviderServices = ({ isDarkMode, services = [], setServices }) => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [viewingService, setViewingService] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    description: '',
    durationMinutes: '',
    costPrice: '',
    sellingPrice: '',
    offeredPrice: '',
    serviceType: 'BOTH',
    serviceGender: 'BOTH',
    isActive: true
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Load profile data from localStorage
  const profileData = JSON.parse(localStorage.getItem('sp_profile') || '{}');
  const providerId = profileData._id;

  // Fetch Service Categories
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const res = await getAllServiceCategories();
      if (res?.success) {
        const data = res.data?.data ?? res.data ?? [];
        setCategories(Array.isArray(data) ? data : []);
      } else {
        toast.error(res?.message || 'Failed to load service categories.');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Failed to load categories.');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Fetch and refresh services list
  const refreshServicesList = async () => {
    if (!providerId) return;
    setTableLoading(true);
    try {
      const res = await getServicesList();
      let list = [];
      if (res?.data) {
        if (Array.isArray(res.data)) {
          list = res.data;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          list = res.data.data;
        }
      } else if (Array.isArray(res)) {
        list = res;
      }
      
      const filtered = list.filter(service => {
        const provId = service.providerId?._id || service.providerId;
        return provId === providerId;
      });
      setServices(filtered);
    } catch (err) {
      console.error('Failed to reload services list:', err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle File Input
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = [...selectedFiles, ...files];
      setSelectedFiles(newFiles);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // Remove selected file
  const removeFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    
    // Revoke object URL to prevent memory leaks
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
    }
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
  };

  // Open modal in create mode
  const handleAddClick = () => {
    setEditingService(null);
    setFormData({
      categoryId: '',
      title: '',
      description: '',
      durationMinutes: '',
      costPrice: '',
      sellingPrice: '',
      offeredPrice: '',
      serviceType: 'BOTH',
      serviceGender: 'BOTH',
      isActive: true
    });
    setSelectedFiles([]);
    setPreviews([]);
    setExistingImages([]);
    setIsModalOpen(true);
  };

  // Open modal in edit mode after fetching details from the details API
  const handleEditClick = async (service) => {
    const serviceId = service._id;
    if (!serviceId) return;

    setTableLoading(true);
    try {
      const res = await getServiceDetails(serviceId);
      if (res?.success) {
        // Safe unpacking of nested response: { success, statusCode, data: { success, statusCode, data: { ... } } }
        const outerData = res.data?.data || res.data || {};
        const freshService = outerData.data ?? outerData ?? service;
        
        setEditingService(freshService);
        setFormData({
          categoryId: freshService.categoryId?._id || freshService.categoryId || '',
          title: freshService.title || '',
          description: freshService.description || '',
          durationMinutes: freshService.durationMinutes || '',
          costPrice: freshService.costPrice || '',
          sellingPrice: freshService.sellingPrice || '',
          offeredPrice: freshService.offeredPrice || '',
          serviceType: freshService.serviceType || 'BOTH',
          serviceGender: freshService.serviceGender || 'BOTH',
          isActive: freshService.isActive ?? true
        });
        setSelectedFiles([]);
        setPreviews([]);
        setExistingImages(freshService.images || []);
        setIsModalOpen(true);
      } else {
        toast.error(res?.message || 'Failed to fetch fresh service details.');
      }
    } catch (err) {
      console.error('Error fetching service details:', err);
      toast.error('Failed to load service details.');
    } finally {
      setTableLoading(false);
    }
  };

  // Fetch and show details in read-only modal
  const handleViewDetailsClick = async (service) => {
    const serviceId = service._id;
    if (!serviceId) return;

    setTableLoading(true);
    try {
      const res = await getServiceDetails(serviceId);
      if (res?.success) {
        const outerData = res.data?.data || res.data || {};
        const freshService = outerData.data ?? outerData ?? service;
        
        setViewingService(freshService);
        setIsDetailsModalOpen(true);
      } else {
        toast.error(res?.message || 'Failed to fetch service details.');
      }
    } catch (err) {
      console.error('Error fetching service details:', err);
      toast.error('Failed to load service details.');
    } finally {
      setTableLoading(false);
    }
  };

  // Delete a service with dynamic confirmation popup
  const handleDeleteClick = async (service) => {
    const serviceId = service._id;
    if (!serviceId) return;

    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete the service: ${service.title}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#EF4444', // red-500
      cancelButtonColor: '#6B7280', // gray-500
      background: isDarkMode ? '#1F2937' : '#FFFFFF',
      color: isDarkMode ? '#FFFFFF' : '#1F2937'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setTableLoading(true);
        try {
          const res = await deleteService(serviceId);
          if (res?.success) {
            Swal.fire({
              title: 'Deleted!',
              text: res.message || 'Service has been deleted successfully.',
              icon: 'success',
              confirmButtonColor: '#EC4899',
              background: isDarkMode ? '#1F2937' : '#FFFFFF',
              color: isDarkMode ? '#FFFFFF' : '#1F2937'
            });
            await refreshServicesList();
          } else {
            toast.error(res?.message || 'Failed to delete service.');
          }
        } catch (err) {
          console.error('Error deleting service:', err);
          toast.error('Something went wrong while deleting service.');
        } finally {
          setTableLoading(false);
        }
      }
    });
  };

  // Clean previews on unmount
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoryId) {
      toast.error('Please select a service category.');
      return;
    }
    if (!formData.title.trim()) {
      toast.error('Please enter a service title.');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a service description.');
      return;
    }
    if (!formData.durationMinutes || formData.durationMinutes <= 0) {
      toast.error('Please enter a valid duration in minutes.');
      return;
    }
    if (!formData.costPrice || formData.costPrice < 0) {
      toast.error('Please enter a valid cost price.');
      return;
    }
    if (!formData.sellingPrice || formData.sellingPrice < 0) {
      toast.error('Please enter a valid selling price.');
      return;
    }
    if (!formData.offeredPrice || formData.offeredPrice < 0) {
      toast.error('Please enter a valid offered price.');
      return;
    }

    setSubmitLoading(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append('categoryId', formData.categoryId);
      dataToSend.append('title', formData.title.trim());
      dataToSend.append('description', formData.description.trim());
      dataToSend.append('durationMinutes', Number(formData.durationMinutes));
      dataToSend.append('costPrice', Number(formData.costPrice));
      dataToSend.append('sellingPrice', Number(formData.sellingPrice));
      dataToSend.append('offeredPrice', Number(formData.offeredPrice));
      dataToSend.append('serviceType', formData.serviceType);
      dataToSend.append('serviceGender', formData.serviceGender);
      if (editingService) {
        dataToSend.append('isActive', formData.isActive);
      }

      // Append files
      selectedFiles.forEach(file => {
        dataToSend.append('file', file);
      });

      let res;
      if (editingService) {
        res = await updateService(editingService._id, dataToSend);
      } else {
        res = await createService(dataToSend);
      }

      if (res?.success) {
        Swal.fire({
          title: 'Success!',
          text: res.message || (editingService ? 'Service updated successfully.' : 'Service created successfully.'),
          icon: 'success',
          confirmButtonColor: '#EC4899', // pink-500
          background: isDarkMode ? '#1F2937' : '#FFFFFF',
          color: isDarkMode ? '#FFFFFF' : '#1F2937'
        });
        
        setIsModalOpen(false);
        // Refresh lists
        await refreshServicesList();
      } else {
        toast.error(res?.message || 'Failed to process request.');
      }
    } catch (err) {
      console.error('Error submitting service:', err);
      toast.error('Something went wrong while saving service.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Filter Services by Search Term
  const filteredServices = services.filter(service => {
    const titleMatch = service.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || descMatch;
  });

  // Get category label by ID
  const getCategoryName = (service) => {
    if (!service.categoryId) return 'Uncategorized';
    if (typeof service.categoryId === 'object') {
      return service.categoryId.label || service.categoryId.name || 'Uncategorized';
    }
    const matched = categories.find(c => c._id === service.categoryId);
    return matched ? (matched.label || matched.name) : 'Uncategorized';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-lg lg:text-3xl font-bold uppercase transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            My Services
          </h2>
          <p className="text-sm font-semibold uppercase text-gray-400 mt-1">
            Manage your treatments catalogue, pricing lists, duration, and promotional media
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-md shadow-primary/20 hover:scale-[1.01] active:scale-95 self-start sm:self-center"
        >
          <Plus size={15} />
          <span>Add Service</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-white border-gray-100 shadow-sm'
      }`}>
        <div className="flex items-center gap-2 mb-4 text-left">
          <SlidersHorizontal size={16} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-wider">Search Catalogue</span>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by service name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all ${
              isDarkMode 
                ? 'bg-gray-900 border-gray-700 focus:border-primary/50 text-white' 
                : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
            }`}
          />
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Services Table Card */}
      <div className={`rounded-3xl border overflow-hidden transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-white border-gray-100 shadow-sm'
      }`}>
        {tableLoading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-primary mb-3" size={32} />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Syncing services...</span>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Briefcase size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className={`text-sm font-black uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>No Services Found</p>
            <p className="text-sm text-gray-400 font-bold uppercase mt-1">Add a service to make it visible to clients</p>
            <button
              onClick={handleAddClick}
              className="mt-6 px-4 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-primary hover:text-white transition-all cursor-pointer"
            >
              Create Service Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr className={`border-b text-left text-sm font-black uppercase tracking-wider ${
                  isDarkMode ? 'bg-gray-900/30 border-white/5 text-gray-400' : 'bg-gray-50/50 border-gray-100 text-gray-500'
                }`}>
                  <th className="py-5 px-6">Service details</th>
                  <th className="py-5 px-6">Category</th>
                  <th className="py-5 px-6"><div className="flex items-center gap-1"><Clock size={11} /> Duration</div></th>
                  <th className="py-5 px-6 text-right">Cost Price</th>
                  <th className="py-5 px-6 text-right">Selling Price</th>
                  <th className="py-5 px-6 text-right">Offered Price</th>
                  <th className="py-5 px-6 text-center">Type</th>
                  <th className="py-5 px-6 text-center">Gender</th>
                  <th className="py-5 px-6 text-center">Status</th>
                  <th className="py-5 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredServices.map((item) => (
                  <tr 
                    key={item._id} 
                    className={`transition-colors text-left hover:bg-primary/5 dark:hover:bg-primary/10`}
                  >
                    {/* Title & Preview Image */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-xs overflow-hidden flex-shrink-0 ${
                          isDarkMode ? 'bg-gray-700 border-white/5' : 'bg-gray-100 border-gray-100 shadow-sm'
                        }`}>
                          {item.images && item.images.length > 0 ? (
                            <img 
                              src={item.images[0]?.url || item.images[0]} 
                              alt={item.title} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <span 
                            style={{ display: item.images && item.images.length > 0 ? 'none' : 'flex' }}
                            className="text-primary font-black uppercase"
                          >
                            {item.title?.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col max-w-xs">
                          <span className={`text-sm font-bold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            {item.title}
                          </span>
                          <span className="text-sm text-gray-400 font-medium line-clamp-1">
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <Tag size={12} className="text-primary/70" />
                        <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {getCategoryName(item)}
                        </span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-6">
                      <span className={`text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {item.durationMinutes} Min
                      </span>
                    </td>

                    {/* Cost Price */}
                    <td className="py-4 px-6 text-right">
                      <span className={`text-xs font-bold text-gray-400 line-through`}>
                        ₹{item.costPrice?.toLocaleString('en-IN') || 0}
                      </span>
                    </td>

                    {/* Selling Price */}
                    <td className="py-4 px-6 text-right">
                      <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        ₹{item.sellingPrice?.toLocaleString('en-IN') || 0}
                      </span>
                    </td>

                    {/* Offered Price */}
                    <td className="py-4 px-6 text-right">
                      <span className="text-xs font-extrabold text-emerald-500 dark:text-emerald-400">
                        ₹{item.offeredPrice?.toLocaleString('en-IN') || 0}
                      </span>
                    </td>

                    {/* Service Type */}
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        item.serviceType === 'BOTH' 
                          ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                          : item.serviceType === 'MALE'
                          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          : 'bg-pink-500/10 text-pink-500 border border-pink-500/20'
                      }`}>
                        {item.serviceType || 'BOTH'}
                      </span>
                    </td>

                    {/* Service Gender */}
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        item.serviceGender === 'BOTH' 
                          ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                          : item.serviceGender === 'ONLY_MEN'
                          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          : 'bg-pink-500/10 text-pink-500 border border-pink-500/20'
                      }`}>
                        {item.serviceGender === 'ONLY_MEN' ? 'Men Only' : item.serviceGender === 'ONLY_WOMEN' ? 'Women Only' : 'Both'}
                      </span>
                    </td>

                    {/* Status Toggle or Badge */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          item.isActive 
                            ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                            : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                        }`} />
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">
                          {item.isActive ? 'Active' : 'Draft'}
                        </span>
                      </div>
                    </td>

                    {/* Action controls */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          title="View Details"
                          onClick={() => handleViewDetailsClick(item)}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'
                          }`}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          title="Edit Service"
                          onClick={() => handleEditClick(item)}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'
                          }`}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          title="Delete Service"
                          onClick={() => handleDeleteClick(item)}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            isDarkMode ? 'bg-red-500/5 text-red-400 hover:bg-red-500/10' : 'bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600'
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto font-outfit">
          <div className={`w-full max-w-2xl my-auto rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className="p-6 md:p-8 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Plus size={20} />
                  </div>
                  <div className="text-left">
                    <h2 className={`text-lg font-bold uppercase ${isDarkMode ? 'text-white' : 'text-gray-850'}`}>
                      {editingService ? 'Update Service Details' : 'Create New Service'}
                    </h2>
                    <p className="text-sm font-bold text-gray-400 uppercase mt-0.5">
                      {editingService ? `Modify specifications for: ${editingService.title}` : 'Publish a new beauty or hair treatment to your catalogue'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    isDarkMode ? 'hover:bg-white/5 text-gray-500 hover:text-white' : 'hover:bg-gray-50 text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Tag size={11} className="text-primary" /> Service Category *
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all cursor-pointer ${
                        isDarkMode 
                          ? 'bg-gray-900 border-gray-700 focus:border-primary/50 text-white' 
                          : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                      }`}
                    >
                      <option value="">Select a Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                          {cat.label || cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Service Title */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-black uppercase tracking-wider text-gray-400">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Bridal HD Makeup"
                      required
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all ${
                        isDarkMode 
                          ? 'bg-gray-900 border-gray-700 focus:border-primary/50 text-white' 
                          : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                      }`}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-sm font-black uppercase tracking-wider text-gray-400">
                    Service Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a comprehensive breakdown of what this treatment includes, products used, styling techniques, and prep details..."
                    required
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all resize-none ${
                      isDarkMode 
                        ? 'bg-gray-900 border-gray-700 focus:border-primary/50 text-white' 
                        : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Duration */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <Clock size={11} /> Duration (Mins) *
                    </label>
                    <input
                      type="number"
                      name="durationMinutes"
                      value={formData.durationMinutes}
                      onChange={handleInputChange}
                      placeholder="60"
                      required
                      min="1"
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                        isDarkMode 
                          ? 'bg-gray-900 border-gray-700 focus:border-primary/50 text-white' 
                          : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                      }`}
                    />
                  </div>

                  {/* Cost Price */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <IndianRupee size={11} /> Cost Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="costPrice"
                      value={formData.costPrice}
                      onChange={handleInputChange}
                      placeholder="1000"
                      required
                      min="0"
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                        isDarkMode 
                          ? 'bg-gray-900 border-gray-700 focus:border-primary/50 text-white' 
                          : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                      }`}
                    />
                  </div>

                  {/* Selling Price */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <IndianRupee size={11} /> Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleInputChange}
                      placeholder="600"
                      required
                      min="0"
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                        isDarkMode 
                          ? 'bg-gray-900 border-gray-700 focus:border-primary/50 text-white' 
                          : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                      }`}
                    />
                  </div>

                  {/* Offered Price */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <IndianRupee size={11} /> Offered Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="offeredPrice"
                      value={formData.offeredPrice}
                      onChange={handleInputChange}
                      placeholder="600"
                      required
                      min="0"
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                        isDarkMode 
                          ? 'bg-gray-900 border-gray-700 focus:border-primary/50 text-white' 
                          : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Service Type */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-black uppercase tracking-wider text-gray-400">
                      Service Type *
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all cursor-pointer ${
                        isDarkMode 
                          ? 'bg-gray-900 border-gray-700 focus:border-primary/50 text-white' 
                          : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                      }`}
                    >
                      <option value="BOTH">BOTH (MALE & FEMALE)</option>
                      <option value="MALE">MALE ONLY</option>
                      <option value="FEMALE">FEMALE ONLY</option>
                    </select>
                  </div>

                  {/* Service Gender */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-black uppercase tracking-wider text-gray-400">
                      Service Gender *
                    </label>
                    <select
                      name="serviceGender"
                      value={formData.serviceGender}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all cursor-pointer ${
                        isDarkMode 
                          ? 'bg-gray-900 border-gray-700 focus:border-primary/50 text-white' 
                          : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
                      }`}
                    >
                      <option value="BOTH">BOTH (MEN & WOMEN)</option>
                      <option value="ONLY_MEN">ONLY MEN</option>
                      <option value="ONLY_WOMEN">ONLY WOMEN</option>
                    </select>
                  </div>

                  {/* Status Toggle (only in Edit mode) */}
                  {editingService ? (
                    <div className="space-y-1.5">
                      <label className="text-sm font-black uppercase tracking-wider text-gray-400">
                        Service Status *
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                            formData.isActive
                              ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}
                        >
                          {formData.isActive ? 'Active' : 'Draft / Inactive'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Multiple Images Upload */
                    <div className="space-y-1.5">
                      <label className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                        <Upload size={11} /> Service Images
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="image-upload-input"
                        />
                        <label
                          htmlFor="image-upload-input"
                          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed text-xs font-bold cursor-pointer transition-all hover:bg-primary/5 hover:border-primary/40 ${
                            isDarkMode 
                              ? 'bg-gray-900 border-gray-700 text-gray-300' 
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          <Upload size={14} className="text-primary" />
                          Choose image files...
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Edit Mode: Upload new images option */}
                {editingService && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <Upload size={11} /> Add New Images
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload-input"
                      />
                      <label
                        htmlFor="image-upload-input"
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed text-xs font-bold cursor-pointer transition-all hover:bg-primary/5 hover:border-primary/40 ${
                          isDarkMode 
                            ? 'bg-gray-900 border-gray-700 text-gray-300' 
                            : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                      >
                        <Upload size={14} className="text-primary" />
                        Choose new files to append...
                      </label>
                    </div>
                  </div>
                )}

                {/* Existing Catalogue Images (edit mode only) */}
                {editingService && existingImages.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-primary">
                      Existing Catalogue Images ({existingImages.length})
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {existingImages.map((img, index) => {
                        const url = img?.url || img;
                        return (
                          <div 
                            key={index}
                            className="relative aspect-square rounded-xl border border-gray-150 dark:border-white/5 overflow-hidden group shadow-sm"
                          >
                            <img src={url} alt="Catalogue" className="w-full h-full object-cover" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Selected Image Previews (newly uploaded) */}
                {previews.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-primary">
                      {editingService ? 'New Uploads to Add' : 'Selected Images'} ({previews.length})
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {previews.map((src, index) => (
                        <div 
                          key={index}
                          className="relative aspect-square rounded-xl border border-gray-150 dark:border-white/5 overflow-hidden group shadow-sm"
                        >
                          <img src={src} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-1 -right-1 p-1 bg-red-500 hover:bg-red-650 text-white rounded-full transition-all shadow-md"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitLoading}
                    className={`px-5 py-3 rounded-xl text-xs font-bold uppercase border transition-all cursor-pointer ${
                      isDarkMode 
                        ? 'border-gray-700 text-gray-300 hover:bg-white/5' 
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-md shadow-primary/20"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingService ? 'Save Changes' : 'Publish Service'}</span>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* Read-Only Service Details Modal */}
      {isDetailsModalOpen && viewingService && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto font-outfit">
          <div className={`w-full max-w-xl my-auto rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            {/* Image Gallery Header */}
            <div className="relative h-60 bg-gray-900 flex items-center justify-center">
              {viewingService.images && viewingService.images.length > 0 ? (
                <div className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory scrollbar-none">
                  {viewingService.images.map((img, i) => (
                    <img 
                      key={i} 
                      src={img.url || img} 
                      alt={`Gallery ${i}`} 
                      className="w-full h-full object-cover flex-shrink-0 snap-center" 
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 gap-2">
                  <ImageOff size={40} className="text-gray-600" />
                  <span className="text-sm font-black uppercase tracking-wider">No Images Available</span>
                </div>
              )}
              {/* Close Button on top of Image */}
              <button 
                onClick={() => setIsDetailsModalOpen(false)} 
                className="absolute top-4 right-4 p-2 bg-black/55 hover:bg-black/85 text-white rounded-full transition-all shadow-md cursor-pointer z-10"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6 text-left">
              {/* Header Info */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full">
                    {getCategoryName(viewingService)}
                  </span>
                  <h3 className={`text-xl font-black uppercase mt-3 ${isDarkMode ? 'text-white' : 'text-gray-850'}`}>
                    {viewingService.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${viewingService.isActive ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <span className={`text-sm font-black uppercase ${viewingService.isActive ? 'text-green-500' : 'text-amber-500'}`}>
                    {viewingService.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Grid Specifications */}
              <div className="grid grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900/50 border-white/5' : 'bg-gray-50 border-gray-100/50'}`}>
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1">
                    <Clock size={10} /> Duration
                  </p>
                  <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {viewingService.durationMinutes} Min
                  </p>
                </div>
                
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900/50 border-white/5' : 'bg-gray-50 border-gray-100/50'}`}>
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Type</p>
                  <p className={`text-xs font-black uppercase ${
                    viewingService.serviceType === 'BOTH' ? 'text-purple-500' : viewingService.serviceType === 'MALE' ? 'text-blue-500' : 'text-pink-500'
                  }`}>
                    {viewingService.serviceType || 'BOTH'}
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900/50 border-white/5' : 'bg-gray-50 border-gray-100/50'}`}>
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Gender</p>
                  <p className={`text-xs font-black uppercase ${
                    viewingService.serviceGender === 'BOTH' ? 'text-purple-500' : viewingService.serviceGender === 'ONLY_MEN' ? 'text-blue-500' : 'text-pink-500'
                  }`}>
                    {viewingService.serviceGender === 'ONLY_MEN' ? 'Men Only' : viewingService.serviceGender === 'ONLY_WOMEN' ? 'Women Only' : 'Both'}
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-gray-900/50 border-white/5' : 'bg-gray-50 border-gray-100/50'}`}>
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Rating</p>
                  <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {viewingService.providerId?.rating || 0} ★
                  </p>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className={`p-5 rounded-3xl border flex items-center justify-between ${
                isDarkMode ? 'bg-gray-900/30 border-white/5' : 'bg-gray-50 border-gray-100'
              }`}>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase">Cost Price</p>
                  <p className="text-sm font-bold text-gray-400 line-through">₹{viewingService.costPrice?.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase">Selling Price</p>
                  <p className={`text-sm font-extrabold ${isDarkMode ? 'text-gray-350' : 'text-gray-755'}`}>₹{viewingService.sellingPrice?.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-emerald-500 uppercase">Offered Price</p>
                  <p className="text-xl font-black text-emerald-500 dark:text-emerald-400">₹{viewingService.offeredPrice?.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <p className="text-sm font-black text-gray-400 uppercase">Service Description</p>
                <p className={`p-4 rounded-2xl text-xs leading-relaxed border ${
                  isDarkMode ? 'bg-gray-900/20 border-white/5 text-gray-450' : 'bg-gray-50 border-gray-100 text-gray-650'
                }`}>
                  {viewingService.description || 'No description provided.'}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsDetailsModalOpen(false)}
                  className={`w-full py-3.5 rounded-2xl font-bold uppercase text-xs transition-all border cursor-pointer ${
                    isDarkMode 
                      ? 'bg-white/5 text-white border-white/5 hover:bg-white/10' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent'
                  }`}
                >
                  Close Panel
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ServiceProviderServices;
