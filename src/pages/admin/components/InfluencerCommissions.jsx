import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Percent, 
  IndianRupee, 
  Loader2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Eye
} from 'lucide-react';
import { getInfluencerCommissions } from '../../../api/adminService';
import { toast } from '../../../utils/toast';
import InfluencerCommissionDetailsModal from './InfluencerCommissionDetailsModal';

const InfluencerCommissions = ({ isDarkMode }) => {
  const [loading, setLoading] = useState(false);
  const [commissions, setCommissions] = useState([]);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState(null);
  const [summary, setSummary] = useState({
    totalInfluencers: 0,
    totalSales: 0,
    totalProfit: 0,
    totalPayout: 0
  });

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: 'approved',
    month: new Date().getMonth() + 1, // Current month (1-12)
    year: new Date().getFullYear()
  });

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1
  });

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const res = await getInfluencerCommissions({
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
        month: filters.month,
        year: filters.year
      });

      if (res.success) {
        // Safe unpacking of nested response: { success, statusCode, data: { success, data: { filters, summary, pagination, data } } }
        const outerData = res.data?.data || res.data || {};
        const list = outerData.data || [];
        
        setCommissions(list);
        setSummary({
          totalInfluencers: outerData.summary?.totalInfluencers || 0,
          totalSales: outerData.summary?.totalSales || 0,
          totalProfit: outerData.summary?.totalProfit || 0,
          totalPayout: outerData.summary?.totalPayout || 0
        });
        
        setPagination({
          total: outerData.pagination?.total || list.length,
          totalPages: outerData.pagination?.totalPages || 1
        });
      } else {
        toast.error(res.message || 'Failed to fetch commissions.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while fetching commissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, [filters.page, filters.limit, filters.status, filters.month, filters.year]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to page 1 on filter changes
    }));
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const years = Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - 1 + i); // prev year to next 2 years

  const summaryCards = [
    {
      label: 'Influencers Active',
      value: summary.totalInfluencers,
      icon: <Users size={20} className="text-blue-500 dark:text-blue-400" />,
      color: 'border-blue-500/20 bg-blue-500/5 text-blue-500'
    },
    {
      label: 'Total Sales generated',
      value: `₹${summary.totalSales?.toLocaleString('en-IN')}`,
      icon: <TrendingUp size={20} className="text-emerald-500 dark:text-emerald-400" />,
      color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500'
    },
    {
      label: 'Total Platform Profit',
      value: `₹${summary.totalProfit?.toLocaleString('en-IN')}`,
      icon: <Percent size={20} className="text-purple-500 dark:text-purple-400" />,
      color: 'border-purple-500/20 bg-purple-500/5 text-purple-500'
    },
    {
      label: 'Total Commission Payout',
      value: summary.totalPayout ? `₹${summary.totalPayout?.toLocaleString('en-IN')}` : '₹0',
      icon: <IndianRupee size={20} className="text-rose-500 dark:text-rose-400" />,
      color: 'border-rose-500/20 bg-rose-500/5 text-rose-500'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-lg lg:text-3xl font-bold uppercase transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Influencer Commissions
          </h2>
          <p className="text-sm font-semibold uppercase text-gray-400 mt-1">
            Track influencer target achievements, platform profit, and commission payouts
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, i) => (
          <div 
            key={i} 
            className={`p-6 rounded-2xl border transition-all duration-300 shadow-sm ${
              isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-black uppercase text-gray-400 tracking-wider">
                {card.label}
              </span>
              <div className={`p-3 rounded-2xl ${card.color.split(' ')[1]} ${card.color.split(' ')[0]}`}>
                {card.icon}
              </div>
            </div>
            <p className={`text-xl lg:text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Options */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-white border-gray-100 shadow-sm'
      }`}>
        <div className="flex items-center gap-2 mb-6 text-left">
          <SlidersHorizontal size={16} className="text-primary" />
          <span className="text-xs font-black uppercase tracking-wider">Filters & Controls</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Month Filter */}
          <div className="space-y-2 text-left">
            <label className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Calendar size={11} className="text-primary" /> Select Month
            </label>
            <select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700 focus:border-primary/50 text-white' 
                  : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
              }`}
            >
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="space-y-2 text-left">
            <label className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Calendar size={11} className="text-primary" /> Select Year
            </label>
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700 focus:border-primary/50 text-white' 
                  : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
              }`}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2 text-left">
            <label className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Clock size={11} className="text-primary" /> Payout Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700 focus:border-primary/50 text-white' 
                  : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
              }`}
            >
              <option value="approved">Approved Slabs</option>
              <option value="pending">Pending Slabs</option>
              <option value="settled">Settled Slabs</option>
            </select>
          </div>

          {/* Page Limit */}
          <div className="space-y-2 text-left">
            <label className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <SlidersHorizontal size={11} className="text-primary" /> Slabs per page
            </label>
            <select
              name="limit"
              value={filters.limit}
              onChange={handleFilterChange}
              className={`w-full px-4 py-3 rounded-xl text-xs font-bold outline-none border transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700 focus:border-primary/50 text-white' 
                  : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary/30 text-gray-800'
              }`}
            >
              <option value="5">5 Slabs</option>
              <option value="10">10 Slabs</option>
              <option value="20">20 Slabs</option>
              <option value="50">50 Slabs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Slabs Table Card */}
      <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800 border-white/5' : 'bg-white border-gray-100 shadow-sm'
      }`}>
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-primary mb-3" size={32} />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Calculating Commissions...</span>
          </div>
        ) : commissions.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <ShoppingBag size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className={`text-sm font-black uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>No Commission Records Found</p>
            <p className="text-sm text-gray-400 font-bold uppercase mt-1">No target sales exist for this month/year range</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr className={`border-b text-left text-sm font-black uppercase tracking-wider ${
                  isDarkMode ? 'bg-gray-900/30 border-white/5 text-gray-400' : 'bg-gray-50/50 border-gray-100 text-gray-500'
                }`}>
                  <th className="py-5 px-6">Influencer</th>
                  <th className="py-5 px-6">Orders</th>
                  <th className="py-5 px-6 text-right">Total Sales</th>
                  <th className="py-5 px-6 text-right">Platform Profit</th>
                  <th className="py-5 px-6 text-center">Active Slab</th>
                  <th className="py-5 px-6 text-right">Calculated Payout</th>
                  <th className="py-5 px-6 text-center">Settlement Status</th>
                  <th className="py-5 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {commissions.map((item, i) => (
                  <tr 
                    key={i} 
                    className={`transition-colors text-left hover:bg-gray-50/50 dark:hover:bg-white/[0.01]`}
                  >
                    {/* Influencer Name & ID */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {item.influencerName?.charAt(0).toUpperCase() || 'I'}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            {item.influencerName}
                          </span>
                          <span className="text-[9px] font-mono text-gray-400">
                            ID: {item.influencerId?.substring(18)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Total Orders */}
                    <td className="py-4 px-6">
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {item.totalOrders}
                      </span>
                    </td>

                    {/* Total Sales */}
                    <td className="py-4 px-6 text-right">
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        ₹{item.totalSales?.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Total Profit */}
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm font-bold text-primary">
                        ₹{item.totalProfit?.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Active Slab Details */}
                    <td className="py-4 px-6 text-center">
                      {item.slab ? (
                        <div className="inline-flex flex-col items-center justify-center p-2 rounded-xl bg-pink-500/10 text-pink-500 text-center">
                          <span className="text-xs font-black">{item.commissionRate}% Rate</span>
                          <span className="text-[8px] font-bold uppercase tracking-wide mt-0.5 opacity-80">
                            ₹{item.slab.minSales?.toLocaleString('en-IN')} - ₹{item.slab.maxSales?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold uppercase text-gray-400">No Slab Reached</span>
                      )}
                    </td>

                    {/* Calculated Payout */}
                    <td className="py-4 px-6 text-right">
                      {item.calculatedPayout !== null ? (
                        <span className="text-sm font-black text-emerald-500 dark:text-emerald-400">
                          ₹{item.calculatedPayout?.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-sm font-bold uppercase text-gray-400">Not Processed</span>
                      )}
                    </td>

                    {/* Payout & Orders Settle Count */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-center gap-1.5">
                        {/* Status Badge */}
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            item.payoutStatus === 'settled' || item.payoutStatus === 'approved'
                              ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                              : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                          }`} />
                          <span className="text-sm font-black uppercase text-gray-400 tracking-wider">
                            {item.payoutStatus}
                          </span>
                        </div>
                        {/* Settled / Unsettled Counts */}
                        <span className="text-[8px] font-bold text-gray-400 uppercase">
                          S: {item.settledCount || 0} / U: {item.unsettledCount || 0} Orders
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        title="View Details"
                        onClick={() => setSelectedInfluencerId(item.influencerId)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          isDarkMode ? 'bg-white/5 text-gray-400 hover:text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary'
                        }`}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && !loading && (
        <div className="flex justify-center gap-3">
          <button 
            onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))} 
            disabled={filters.page === 1} 
            className={`p-4 rounded-2xl disabled:opacity-30 shadow-sm transition-all cursor-pointer ${
              isDarkMode 
                ? 'bg-gray-800 text-white hover:bg-primary' 
                : 'bg-white text-gray-600 hover:bg-primary hover:text-white border border-gray-100'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="w-14 h-14 flex items-center justify-center bg-primary text-white rounded-2xl font-bold shadow-2xl shadow-primary/30 ring-4 ring-primary/10">
            {filters.page}
          </div>
          <button 
            onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))} 
            disabled={filters.page >= pagination.totalPages} 
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

      {/* ── Influencer Commission Details Modal ── */}
      {selectedInfluencerId && (
        <InfluencerCommissionDetailsModal
          influencerId={selectedInfluencerId}
          onClose={() => setSelectedInfluencerId(null)}
          initialMonth={Number(filters.month)}
          initialYear={Number(filters.year)}
        />
      )}
    </div>
  );
};

export default InfluencerCommissions;
