import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Filter, CircleCheckBig, CircleAlert, CircleX, 
  ChevronLeft, ChevronRight, Loader2, RefreshCw, Paperclip, 
  Eye, Mail, User, Clock, CheckCircle, AlertCircle, AlertTriangle, Trash2 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { getAllTickets, updateTicketStatus, deleteTicket } from '../../../api/adminService';
import { toast } from '../../../utils/toast';
import DataTable from '../../../components/shared/DataTable';

const SupportTickets = ({ isDarkMode }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Pagination & Filters State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PENDING, IN_PROGRESS, CLOSED
  const [typeFilter, setTypeFilter] = useState('ALL'); // ALL, OTHER, TECHNICAL, etc.

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search: search.trim() || undefined,
        ticketStatus: statusFilter === 'ALL' ? undefined : statusFilter,
        ticketType: typeFilter === 'ALL' ? undefined : typeFilter
      };

      const res = await getAllTickets(params);
      if (res && res.success) {
        const ticketList = res.data?.data || res.data || [];
        setTickets(ticketList);
        setTotal(res.data?.total || ticketList.length);
      } else {
        toast.error(res.message || 'Failed to fetch tickets.');
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      toast.error('Something went wrong while fetching tickets.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter, typeFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleStatusChange = async (ticketId, newStatus) => {
    Swal.fire({
      title: 'Update Ticket Status?',
      text: `Are you sure you want to change this ticket's status to "${newStatus}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#da016a',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Update',
      cancelButtonText: 'Cancel',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1f2937',
      borderRadius: '20px',
      customClass: {
        popup: 'rounded-3xl border-none',
        confirmButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 text-white cursor-pointer',
        cancelButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 cursor-pointer'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setUpdatingId(ticketId);
        const loadingToast = toast.loading('Updating ticket status...');
        try {
          const res = await updateTicketStatus(ticketId, { ticketStatus: newStatus });
          toast.dismiss(loadingToast);
          if (res.success) {
            toast.success(res.message || 'Ticket status updated successfully!');
            fetchTickets();
          } else {
            toast.error(res.message || 'Failed to update ticket status.');
          }
        } catch (err) {
          toast.dismiss(loadingToast);
          toast.error('Something went wrong during status update.');
        } finally {
          setUpdatingId(null);
        }
      }
    });
  };

  const handleDeleteTicket = async (ticketId) => {
    Swal.fire({
      title: 'Delete Support Ticket?',
      text: 'Are you sure you want to permanently delete this support ticket? This action is irreversible!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1f2937',
      borderRadius: '20px',
      customClass: {
        popup: 'rounded-3xl border-none',
        confirmButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 text-white cursor-pointer',
        cancelButton: 'rounded-xl font-bold uppercase text-xs px-5 py-2.5 cursor-pointer'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const loadingToast = toast.loading('Deleting ticket...');
        try {
          const res = await deleteTicket(ticketId);
          toast.dismiss(loadingToast);
          if (res.success) {
            toast.success(res.message || 'Ticket deleted successfully!');
            fetchTickets();
          } else {
            toast.error(res.message || 'Failed to delete ticket.');
          }
        } catch (err) {
          toast.dismiss(loadingToast);
          toast.error('Something went wrong during deletion.');
        }
      }
    });
  };

  const viewFullDescription = (ticket) => {
    const mediaList = getMediaFilesList(ticket.mediaFiles);
    const textColor = isDarkMode ? '#f3f4f6' : '#1f2937';
    const labelColor = isDarkMode ? '#9ca3af' : '#6b7280';
    const boxBg = isDarkMode ? '#111827' : '#f9fafb';
    const boxBorder = isDarkMode ? 'rgba(255,255,255,0.08)' : '#e5e7eb';

    Swal.fire({
      title: `Support Ticket Details`,
      html: `
        <div style="text-align: left; font-size: 13px; line-height: 1.6; color: ${textColor}; font-family: 'Outfit', sans-serif; margin-top: 16px;">
          <div style="margin-bottom: 14px;">
            <strong style="text-transform: uppercase; font-size: 10px; color: ${labelColor}; display: block; margin-bottom: 4px; font-weight: 700; letter-spacing: 0.05em;">User Details</strong>
            <p style="font-weight: 700; margin: 0; color: ${textColor};">${ticket.userId?.name || 'N/A'} (${ticket.userId?.email || 'N/A'})</p>
          </div>
          <div style="margin-bottom: 14px;">
            <strong style="text-transform: uppercase; font-size: 10px; color: ${labelColor}; display: block; margin-bottom: 4px; font-weight: 700; letter-spacing: 0.05em;">Type</strong>
            <p style="font-weight: 700; margin: 0; color: ${textColor};">${ticket.ticketType || 'OTHER'}</p>
          </div>
          <div style="margin-bottom: 14px;">
            <strong style="text-transform: uppercase; font-size: 10px; color: ${labelColor}; display: block; margin-bottom: 4px; font-weight: 700; letter-spacing: 0.05em;">Query Description</strong>
            <div style="background-color: ${boxBg}; padding: 16px; border-radius: 16px; border: 1px solid ${boxBorder}; word-break: break-all; white-space: pre-wrap; color: ${textColor}; font-weight: 600; max-height: 180px; overflow-y: auto;">${ticket.description || 'No description provided.'}</div>
          </div>
          <div style="margin-bottom: 14px;">
            <strong style="text-transform: uppercase; font-size: 10px; color: ${labelColor}; display: block; margin-bottom: 4px; font-weight: 700; letter-spacing: 0.05em;">Raised On</strong>
            <p style="font-weight: 700; margin: 0; color: ${textColor};">${new Date(ticket.createdAt).toLocaleString('en-IN')}</p>
          </div>
          ${mediaList.length > 0 ? `
            <div style="margin-bottom: 14px;">
              <strong style="text-transform: uppercase; font-size: 10px; color: ${labelColor}; display: block; margin-bottom: 6px; font-weight: 700; letter-spacing: 0.05em;">Attachments (${mediaList.length})</strong>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${mediaList.map((m, idx) => `
                  <a href="${m.url}" target="_blank" rel="noopener noreferrer" style="color: #da016a; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
                    <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #da016a;"></span>
                    Attachment #${idx + 1} (${m.publicId?.split('/').pop() || 'File'})
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `,
      confirmButtonColor: '#da016a',
      confirmButtonText: 'Close Window',
      background: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1f2937',
      borderRadius: '20px',
      customClass: {
        popup: 'rounded-3xl border-none p-6 md:p-8',
        confirmButton: 'w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer'
      }
    });
  };

  const getMediaFilesList = (mediaFiles) => {
    if (!mediaFiles) return [];
    if (Array.isArray(mediaFiles)) {
      return mediaFiles.filter(item => item && item.url);
    }
    if (typeof mediaFiles === 'object' && mediaFiles.url) {
      return [mediaFiles];
    }
    return [];
  };

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'IN_PROGRESS':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'CLOSED':
        return 'bg-green-500/10 text-green-500 border border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border border-gray-500/20';
    }
  };

  const getTypeBadgeStyles = (type) => {
    switch (type) {
      case 'TECHNICAL':
        return 'bg-purple-500/10 text-purple-500';
      case 'PAYMENT':
        return 'bg-emerald-500/10 text-emerald-500';
      case 'DELIVERY':
        return 'bg-sky-500/10 text-sky-500';
      default:
        return 'bg-pink-500/10 text-pink-500';
    }
  };

  const columns = [
    {
      header: 'Raised By',
      render: (ticket) => {
        const userDetails = ticket.userId || {};
        return (
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-md flex-shrink-0 bg-primary/20 text-primary border border-primary/10`}>
              {userDetails.name?.charAt(0).toUpperCase() || <User size={16} />}
            </div>
            <div className="flex flex-col min-w-0 max-w-[160px]">
              <span className={`text-xs font-bold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {userDetails.name || 'System User'}
              </span>
              <span className="text-sm font-bold text-gray-400 truncate">
                {userDetails.email || 'N/A'}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Type',
      render: (ticket) => (
        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${getTypeBadgeStyles(ticket.ticketType)}`}>
          {ticket.ticketType || 'OTHER'}
        </span>
      )
    },
    {
      header: 'Query Description',
      render: (ticket) => (
        <div className="max-w-xs">
          <p className={`text-xs font-medium line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {ticket.description || 'No description provided.'}
          </p>
        </div>
      )
    },
    {
      header: 'Attachments',
      render: (ticket) => {
        const mediaList = getMediaFilesList(ticket.mediaFiles);
        if (mediaList.length === 0) {
          return <span className="text-sm font-bold uppercase text-gray-400">None</span>;
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-[120px]">
            {mediaList.map((media, index) => (
              <a
                key={media._id || index}
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`p-2 rounded-lg border flex items-center justify-center hover:scale-105 transition-transform ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/5 text-gray-400 hover:text-white' 
                    : 'bg-gray-50 border-gray-150 text-gray-550 hover:bg-gray-100 shadow-sm'
                }`}
                title={media.publicId?.split('/').pop() || 'Attachment'}
              >
                <Paperclip size={12} className="text-primary" />
              </a>
            ))}
          </div>
        );
      }
    },
    {
      header: 'Date Created',
      render: (ticket) => (
        <span className={`text-[11px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      )
    },
    {
      header: 'Status',
      render: (ticket) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase ${getStatusBadgeStyles(ticket.ticketStatus)}`}>
          {ticket.ticketStatus || 'PENDING'}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (ticket) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            title="View Details"
            onClick={() => viewFullDescription(ticket)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-450 hover:text-primary'}`}
          >
            <Eye size={16} />
          </button>
          
          {ticket.ticketStatus !== 'CLOSED' ? (
            <div className="flex items-center gap-1.5">
              {ticket.ticketStatus === 'PENDING' && (
                <button
                  title="Start Progress"
                  onClick={() => handleStatusChange(ticket._id, 'IN_PROGRESS')}
                  disabled={updatingId === ticket._id}
                  className="px-3.5 py-2 bg-blue-500 hover:bg-blue-650 text-white rounded-xl text-sm font-black uppercase tracking-wider shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  Start
                </button>
              )}
              <button
                title="Close Ticket"
                onClick={() => handleStatusChange(ticket._id, 'CLOSED')}
                disabled={updatingId === ticket._id}
                className="px-3.5 py-2 bg-green-500 hover:bg-green-650 text-white rounded-xl text-sm font-black uppercase tracking-wider shadow-lg shadow-green-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <span className="text-[9px] font-bold uppercase text-green-500 bg-green-500/5 px-2.5 py-1.5 rounded-xl border border-green-500/10">
              Closed
            </span>
          )}

          <button
            title="Delete Ticket"
            onClick={() => handleDeleteTicket(ticket._id)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-400 hover:text-red-500' : 'bg-gray-50 text-gray-450 hover:text-red-500'}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-300">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-lg lg:text-3xl font-bold uppercase transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Support Tickets
          </h2>
          <p className="text-sm font-semibold uppercase text-gray-400 mt-1">
            Resolve system queries and customer requests
          </p>
        </div>
        <div className={`px-4 lg:px-6 py-3 lg:py-4 rounded-2xl lg:rounded-[24px] border shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-white border-gray-100'}`}>
          <p className="text-sm font-bold uppercase text-gray-400 mb-0.5">Total Tickets</p>
          <p className="text-xl lg:text-2xl font-bold">{total}</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className={`p-4 lg:p-6 rounded-3xl border shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/50 border-white/5' : 'bg-white border-gray-100'} space-y-4`}>
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Search bar */}
          <div className="relative flex-grow max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search user, email or description..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className={`w-full pl-12 pr-4 py-3 border-none rounded-2xl text-sm outline-none font-medium placeholder:text-gray-400 placeholder:font-normal placeholder:text-xs transition-all ${isDarkMode ? 'bg-white/5 text-gray-200' : 'bg-gray-50 text-gray-800 focus:bg-gray-100'}`} 
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-[11px] font-bold uppercase text-gray-400">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className={`px-3 py-2 border-none rounded-xl text-xs font-bold outline-none cursor-pointer ${isDarkMode ? 'bg-white/5 text-gray-200' : 'bg-gray-50 text-gray-850'}`}
            >
              <option value="ALL">All Types</option>
              <option value="OTHER">Other</option>
              <option value="TECHNICAL">Technical</option>
              <option value="PAYMENT">Payment</option>
              <option value="DELIVERY">Delivery</option>
              <option value="ACCOUNT">Account</option>
            </select>
          </div>

          <button 
            onClick={() => { setSearch(''); setStatusFilter('ALL'); setTypeFilter('ALL'); setPage(1); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border self-start lg:self-center cursor-pointer ${isDarkMode ? 'bg-white/5 border-white/5 text-gray-400 hover:text-white' : 'bg-gray-50 border-gray-150 text-gray-550 hover:bg-gray-100'}`}
          >
            Reset Filters
          </button>
        </div>

        {/* Status Filters Pill Row */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'CLOSED'].map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : isDarkMode
                  ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <DataTable 
        columns={columns}
        data={tickets}
        loading={loading}
        onRowClick={viewFullDescription}
      />

      {/* Pagination Footer */}
      {!loading && tickets.length > 0 && (
        <div className="flex justify-center items-center gap-3 pt-4">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1}
            className={`p-4 rounded-2xl disabled:opacity-30 shadow-sm transition-all cursor-pointer ${
              isDarkMode 
                ? 'bg-gray-800 text-white hover:bg-primary' 
                : 'bg-white text-gray-600 hover:bg-primary hover:text-white border border-gray-100'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="w-14 h-14 flex items-center justify-center bg-primary text-white rounded-2xl font-bold shadow-2xl shadow-primary/30 ring-4 ring-primary/10">
            {page}
          </div>
          
          <button 
            onClick={() => setPage(p => p + 1)} 
            disabled={tickets.length < limit}
            className={`p-4 rounded-2xl disabled:opacity-30 shadow-sm transition-all cursor-pointer ${
              isDarkMode 
                ? 'bg-gray-800 text-white hover:bg-primary' 
                : 'bg-white text-gray-600 hover:bg-primary hover:text-white border border-gray-100'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

    </div>
  );
};

export default SupportTickets;
