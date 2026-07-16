import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Store, 
  ShoppingBag, 
  TicketPercent, 
  Loader2, 
  Sparkles,
  BarChart3
} from 'lucide-react';

const AdminDashboard = ({
  isOverviewLoading,
  overviewData,
  revenueTrend,
  topCategories,
  orderStatusAnalytics,
  categoryDistribution,
  orderStatusGraph,
  monthlyAnalytics,
  yearlyAnalytics,
  analyticsGraph,
  topVendorsGraph,
  isDarkMode,
  setActiveTab,
  selectedYear,
  setSelectedYear,
  activeMonthlyMetric,
  setActiveMonthlyMetric,
  fetchMonthlyData
}) => {

  const stats = [
    { 
      id: 'revenue', 
      label: 'Total Revenue', 
      value: overviewData?.totalRevenue !== undefined ? '₹' + (overviewData.totalRevenue).toLocaleString('en-IN') : '₹0', 
      icon: <TrendingUp size={20} />, 
      trend: 'Net', 
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/10',
      iconColor: 'text-emerald-400',
      glow: 'hover:shadow-emerald-500/10 hover:border-emerald-500/30',
      badge: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20'
    },
    { 
      id: 'users', 
      label: 'Total Users', 
      value: overviewData?.totalUser !== undefined ? (overviewData.totalUser).toLocaleString() : '0', 
      icon: <Users size={20} />, 
      trend: 'Directory', 
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20 dark:border-blue-500/10',
      iconColor: 'text-blue-400',
      glow: 'hover:shadow-blue-500/10 hover:border-blue-500/30',
      badge: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20'
    },
    { 
      id: 'vendors', 
      label: 'Vendor Partners', 
      value: overviewData?.totalVendors !== undefined ? (overviewData.totalVendors).toLocaleString() : '0', 
      icon: <Store size={20} />, 
      trend: 'Approved Shops', 
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20 dark:border-purple-500/10',
      iconColor: 'text-purple-400',
      glow: 'hover:shadow-purple-500/10 hover:border-purple-500/30',
      badge: 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20'
    },
    { 
      id: 'influencers', 
      label: 'Influencer Partners', 
      value: overviewData?.totalInfluencers !== undefined ? (overviewData.totalInfluencers).toLocaleString() : '0', 
      icon: <TrendingUp size={20} />, 
      trend: 'Creators Network', 
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/20 dark:border-pink-500/10',
      iconColor: 'text-pink-400',
      glow: 'hover:shadow-pink-500/10 hover:border-pink-500/30',
      badge: 'bg-pink-500/10 text-pink-500 dark:text-pink-400 border border-pink-500/20'
    },
    { 
      id: 'orders', 
      label: 'Total Orders', 
      value: overviewData?.totalOrders !== undefined ? (overviewData.totalOrders).toLocaleString() : '0', 
      icon: <ShoppingBag size={20} />, 
      trend: 'Order Pipeline', 
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/20 dark:border-orange-500/10',
      iconColor: 'text-orange-400',
      glow: 'hover:shadow-orange-500/10 hover:border-orange-500/30',
      badge: 'bg-orange-500/10 text-orange-500 dark:text-orange-400 border border-orange-500/20'
    },
    { 
      id: 'pending-commission', 
      label: 'Pending Commission', 
      value: overviewData?.pendingInfluencerCommissions !== undefined ? '₹' + (overviewData.pendingInfluencerCommissions).toLocaleString('en-IN') : '₹0', 
      icon: <TicketPercent size={20} />, 
      trend: 'Due', 
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20 dark:border-rose-500/10',
      iconColor: 'text-rose-400',
      glow: 'hover:shadow-rose-500/10 hover:border-rose-500/30',
      badge: 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20'
    }
  ];

  const getStatusColors = (status) => {
    const s = String(status).toLowerCase();
    if (s.includes('deliver')) {
      return {
        text: 'text-emerald-500',
        bar: 'bg-emerald-500',
        stroke: 'stroke-emerald-500',
        dotBg: 'bg-emerald-500'
      };
    } else if (s.includes('pending') || s.includes('process')) {
      return {
        text: 'text-amber-500',
        bar: 'bg-amber-500',
        stroke: 'stroke-amber-500',
        dotBg: 'bg-amber-500'
      };
    } else if (s.includes('ship')) {
      return {
        text: 'text-blue-500',
        bar: 'bg-blue-500',
        stroke: 'stroke-blue-500',
        dotBg: 'bg-blue-500'
      };
    } else if (s.includes('cancel') || s.includes('reject') || s.includes('fail')) {
      return {
        text: 'text-rose-500',
        bar: 'bg-rose-500',
        stroke: 'stroke-rose-500',
        dotBg: 'bg-rose-500'
      };
    } else {
      return {
        text: 'text-purple-500',
        bar: 'bg-purple-500',
        stroke: 'stroke-purple-500',
        dotBg: 'bg-purple-500'
      };
    }
  };

  const getCurvePath = (points) => {
    if (!points || points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 3;
      const cpY1 = curr.y;
      const cpX2 = curr.x + 2 * (next.x - curr.x) / 3;
      const cpY2 = next.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const getSvgChartPaths = () => {
    if (!revenueTrend || revenueTrend.length === 0) return { linePath: '', areaPath: '', points: [] };
    
    const maxVal = Math.max(...revenueTrend.map(item => item.revenue || 0), 10000);
    const chartHeight = 160;
    const chartWidth = 500;
    const paddingLeft = 60;
    const paddingRight = 40;
    const paddingTop = 20;
    const paddingBottom = 40;
    
    const usableWidth = chartWidth - paddingLeft - paddingRight;
    const usableHeight = chartHeight - paddingTop - paddingBottom;
    
    const points = revenueTrend.map((item, idx) => {
      const x = paddingLeft + (idx / Math.max(revenueTrend.length - 1, 1)) * usableWidth;
      const y = chartHeight - paddingBottom - ((item.revenue || 0) / maxVal) * usableHeight;
      const date = item._id || 'N/A';
      return { x, y, revenue: item.revenue || 0, date };
    });
    
    const linePath = getCurvePath(points);
    
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const bottomY = chartHeight - paddingBottom;
    const areaPath = points.length > 0 ? `${linePath} L ${lastPoint.x} ${bottomY} L ${firstPoint.x} ${bottomY} Z` : '';
    
    return { linePath, areaPath, points, maxVal, chartHeight };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {isOverviewLoading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/30">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Hydrating Administrative Pipeline...</p>
        </div>
      ) : (
        <>
          {/* Grid layout of the 6 stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 text-left">
            {stats.map((stat, i) => {
              const clickable = ['users', 'vendors', 'influencers', 'orders'].includes(stat.id);
              return (
                <div 
                  key={i} 
                  onClick={() => clickable && setActiveTab(stat.id)} 
                  className={`p-5 lg:p-6 rounded-[28px] border transition-all duration-500 group relative overflow-hidden backdrop-blur-xl ${
                    stat.glow
                  } ${
                    clickable ? 'cursor-pointer hover:-translate-y-1.5' : 'cursor-default'
                  } ${
                    isDarkMode 
                      ? 'bg-gray-900/60 border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]' 
                      : 'bg-white/60 border-gray-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
                  }`}
                >
                  {/* Radial ambient glow element on cards */}
                  <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-2xl opacity-10 transition-opacity duration-500 group-hover:opacity-20 ${
                    stat.id === 'revenue' ? 'bg-emerald-500' :
                    stat.id === 'users' ? 'bg-blue-500' :
                    stat.id === 'vendors' ? 'bg-purple-500' :
                    stat.id === 'influencers' ? 'bg-pink-500' :
                    stat.id === 'orders' ? 'bg-orange-500' : 'bg-rose-500'
                  }`} />

                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className={`p-3 rounded-2xl transition-all duration-500 ${
                      isDarkMode ? 'bg-gray-900/60' : 'bg-gray-50'
                    } ${stat.color} border shadow-inner flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                    <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-lg border transition-all duration-300 ${stat.badge}`}>
                      {stat.trend}
                    </span>
                  </div>
                  <h3 className={`text-sm font-bold uppercase tracking-wider mb-1 relative z-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {stat.label}
                  </h3>
                  <p className={`text-base lg:text-xl font-extrabold tracking-tight relative z-10 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-left">
            {/* Left Chart: Revenue Growth Trend */}
            {revenueTrend.length > 0 && (() => {
              const { linePath, areaPath, points, maxVal } = getSvgChartPaths();
              return (
                <div className={`p-6 lg:p-8 rounded-[32px] border text-left flex flex-col justify-between transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-900 border-white/5 shadow-none' : 'bg-white border-gray-100 shadow-xl shadow-gray-100/30'
                }`}>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-[9px] font-black text-primary uppercase block mb-1">Financial Metrics</span>
                      <h3 className={`text-base font-black uppercase ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Revenue Growth Trend (Last 10 Days)
                      </h3>
                    </div>
                    <div className="flex gap-2 items-center text-[9px] font-black uppercase text-gray-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary block shadow-sm shadow-primary/20"></span>
                      <span>Daily Growth</span>
                    </div>
                  </div>

                  <div className="w-full relative overflow-hidden">
                    <svg className="w-full h-auto max-h-[220px]" viewBox="0 0 500 160" preserveAspectRatio="xMidYMid meet">
                      <defs>
                        <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fe3e6a" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#fe3e6a" stopOpacity="0.0" />
                        </linearGradient>
                        <filter id="svg-neon-glow-primary" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3.5" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                        const chartHeight = 160;
                        const paddingBottom = 40;
                        const usableHeight = 100;
                        const y = chartHeight - paddingBottom - ratio * usableHeight;
                        const val = Math.round(maxVal * ratio);
                        return (
                          <g key={idx}>
                            <line x1="50" y1={y} x2="480" y2={y} stroke={isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} strokeWidth="1" />
                            <text x="45" y={y + 3} textAnchor="end" className={`text-[7.5px] font-black fill-current ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              â‚¹{val >= 1000 ? (val / 1000) + 'K' : val}
                            </text>
                          </g>
                        );
                      })}
                      
                      {areaPath && (
                        <path d={areaPath} fill="url(#chart-area-grad)" />
                      )}
                      
                      {linePath && (
                        <path d={linePath} fill="none" stroke="#fe3e6a" strokeWidth="2.5" strokeLinecap="round" filter="url(#svg-neon-glow-primary)" />
                      )}
                      
                      {points.map((p, idx) => (
                        <g key={idx} className="group/dot cursor-pointer">
                          <circle cx={p.x} cy={p.y} r="3.5" className="fill-primary stroke-white dark:stroke-gray-800 transition-all duration-300 group-hover/dot:r-5" strokeWidth="1.5" />
                          <title>
                            Date: {p.date}&#13;
                            Revenue: â‚¹{p.revenue.toLocaleString('en-IN')}
                          </title>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              );
            })()}

            {/* Middle Chart: Category Distribution */}
            {categoryDistribution.length > 0 && (() => {
              const totalItems = categoryDistribution.reduce((sum, item) => sum + (item.productCount ?? item.count ?? 0), 0);
              let cumulativePercent = 0;
              return (
                <div className={`p-6 lg:p-8 rounded-[32px] border text-left flex flex-col justify-between ${
                  isDarkMode ? 'bg-gray-900 border-white/5 shadow-none' : 'bg-white border-gray-100 shadow-xl shadow-gray-100/30'
                }`}>
                  <div>
                    <span className="text-[9px] font-black text-primary uppercase block mb-1">Catalog Segment</span>
                    <h3 className={`text-base font-black uppercase mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Category Distribution
                    </h3>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
                    <div className="w-40 h-40 relative flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        {categoryDistribution.map((item, idx) => {
                          const count = item.productCount ?? item.count ?? 0;
                          const percent = item.percentage ?? (totalItems > 0 ? (count / totalItems) * 100 : 0);
                          const strokeDasharray = `${percent} ${100 - percent}`;
                          const strokeDashoffset = 100 - cumulativePercent;
                          cumulativePercent += percent;

                          const colors = ['stroke-pink-500', 'stroke-purple-500', 'stroke-blue-500', 'stroke-emerald-500', 'stroke-orange-500'];
                          const colorClass = colors[idx % colors.length];

                          return (
                            <circle 
                              key={idx} 
                              cx="18" 
                              cy="18" 
                              r="15.915" 
                              fill="none" 
                              className={`transition-all duration-1000 ${colorClass}`} 
                              strokeWidth="3.2" 
                              strokeDasharray={strokeDasharray} 
                              strokeDashoffset={strokeDashoffset} 
                            />
                          );
                        })}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className={`text-sm font-bold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Catalog</span>
                        <span className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{totalItems}</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3.5 w-full">
                      {categoryDistribution.map((item, idx) => {
                        const count = item.productCount ?? item.count ?? 0;
                        const percent = Math.round(item.percentage ?? (totalItems > 0 ? (count / totalItems) * 100 : 0));
                        const colors = [
                          { text: 'text-pink-500', bar: 'bg-pink-500' },
                          { text: 'text-purple-500', bar: 'bg-purple-500' },
                          { text: 'text-blue-500', bar: 'bg-blue-500' },
                          { text: 'text-emerald-500', bar: 'bg-emerald-500' },
                          { text: 'text-orange-500', bar: 'bg-orange-500' }
                        ];
                        const design = colors[idx % colors.length];

                        return (
                          <div key={idx} className="space-y-1.5 w-full">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className={`capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.categoryName || item.category || item._id}</span>
                              <span className={design.text}>{percent}% ({count})</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
                              <div className={`h-full ${design.bar} rounded-full`} style={{ width: `${percent}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Right Chart: Order Status Distribution â€” smart merged source */}
            {(() => {
              // Smart merge: use orderStatusGraph as primary; fall back to orderStatusAnalytics.
              // Merge both by status key so duplicates are deduplicated with summed counts.
              const mergeByStatus = (primary = [], fallback = []) => {
                const map = {};
                [...fallback, ...primary].forEach(item => {
                  const key = String(item.status).toLowerCase();
                  if (map[key]) {
                    map[key] = { ...map[key], count: item.count ?? map[key].count, percentage: item.percentage ?? map[key].percentage };
                  } else {
                    map[key] = { status: key, count: item.count || 0, percentage: item.percentage ?? null };
                  }
                });
                return Object.values(map);
              };

              const activeData = mergeByStatus(
                orderStatusGraph || [],
                orderStatusAnalytics || []
              );
              const totalOrders = activeData.reduce((sum, item) => sum + (item.count || 0), 0);
              let cumulativePercent = 0;

              return (
                <div className={`p-6 lg:p-8 rounded-[32px] border text-left flex flex-col gap-6 ${
                  isDarkMode ? 'bg-gray-900 border-white/5 shadow-none' : 'bg-white border-gray-100 shadow-xl shadow-gray-100/30'
                }`}>
                  <div>
                    <span className="text-[9px] font-black text-primary uppercase block mb-1">Operational Metrics</span>
                    <h3 className={`text-base font-black uppercase ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Order Status Distribution
                    </h3>
                  </div>

                  {activeData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">No Order Data Found</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
                        {/* Donut chart */}
                        <div className="w-36 h-36 relative flex-shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            {activeData.map((item, idx) => {
                              const pct = totalOrders > 0 ? ((item.count || 0) / totalOrders) * 100 : 0;
                              const strokeDasharray = `${pct} ${100 - pct}`;
                              const strokeDashoffset = 100 - cumulativePercent;
                              cumulativePercent += pct;
                              const design = getStatusColors(item.status);
                              return (
                                <circle
                                  key={idx}
                                  cx="18" cy="18" r="15.915"
                                  fill="none"
                                  className={`transition-all duration-1000 ${design.stroke}`}
                                  strokeWidth="3.2"
                                  strokeDasharray={strokeDasharray}
                                  strokeDashoffset={strokeDashoffset}
                                />
                              );
                            })}
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className={`text-sm font-bold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total</span>
                            <span className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{totalOrders}</span>
                          </div>
                        </div>

                        {/* Progress list */}
                        <div className="flex-1 space-y-3 w-full">
                          {activeData.map((item, idx) => {
                            const pct = Math.round(item.percentage ?? (totalOrders > 0 ? ((item.count || 0) / totalOrders) * 100 : 0));
                            const design = getStatusColors(item.status);
                            return (
                              <div key={idx} className="space-y-1.5 w-full">
                                <div className="flex justify-between items-center text-xs font-bold">
                                  <span className={`capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.status}</span>
                                  <span className={design.text}>{pct}% ({item.count})</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
                                  <div className={`h-full ${design.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Mini stat badges row */}
                      <div className={`grid grid-cols-${Math.min(activeData.length, 3)} gap-2 pt-2 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                        {activeData.map((item, idx) => {
                          const design = getStatusColors(item.status);
                          return (
                            <div key={idx} className={`rounded-2xl px-3 py-2.5 text-center ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                              <p className={`text-base font-extrabold ${design.text}`}>{item.count}</p>
                              <p className={`text-[9px] font-black uppercase capitalize ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.status}</p>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Third Row: Monthly Analytics & Top Vendors */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-left">
            {/* YoY Performance Card */}
            <div className={`p-6 lg:p-8 rounded-[32px] border text-left flex flex-col justify-between transition-all duration-300 ${
              isDarkMode ? 'bg-gray-900 border-white/5 shadow-none' : 'bg-white border-gray-100 shadow-xl shadow-gray-100/30'
            }`}>
              <div>
                <span className="text-[9px] font-black text-primary uppercase block mb-1">Enterprise Performance</span>
                <h3 className={`text-base font-black uppercase mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Year-over-Year Performance
                </h3>
              </div>
              
              <div className="space-y-6">
                {yearlyAnalytics.length === 0 ? (
                  <div className="text-center py-12 text-xs font-bold text-gray-400 uppercase">
                    No annual data available
                  </div>
                ) : (() => {
                  const maxRevenue = Math.max(...yearlyAnalytics.map(y => y.revenue || 0), 1);
                  return (
                    <div className="flex flex-col gap-6">
                      {/* YoY list cards */}
                      <div className="space-y-4">
                        {yearlyAnalytics.map((item, idx) => {
                          const year = item.year || 2026;
                          const rev = item.revenue || 0;
                          const ord = item.orders || 0;
                          
                          const designs = [
                            { text: 'text-emerald-500', bar: 'from-emerald-400 to-emerald-600 shadow-emerald-500/20', bg: 'bg-emerald-500/10 text-emerald-500' },
                            { text: 'text-primary', bar: 'from-pink-400 to-pink-600 shadow-pink-500/20', bg: 'bg-primary/10 text-primary' }
                          ];
                          const design = designs[idx % designs.length];

                          return (
                            <div key={year} className="p-4 rounded-2xl border border-gray-50 dark:border-white/5 bg-gray-50/30 dark:bg-white/5 flex justify-between items-center transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
                              <div className="space-y-1">
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${design.bg}`}>
                                  Year {year}
                                </span>
                                <p className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-gray-800'} pt-1`}>
                                  â‚¹{rev.toLocaleString('en-IN')}
                                </p>
                                <p className="text-[9px] font-black uppercase text-gray-400">
                                  Total Annual Revenue
                                </p>
                              </div>
                              
                              <div className="text-right space-y-1">
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-500">
                                  {ord} {ord === 1 ? 'order' : 'orders'}
                                </span>
                                <p className={`text-xs font-black ${design.text} pt-1`}>
                                  {((rev / maxRevenue) * 100).toFixed(0)}% Scale
                                </p>
                                <p className="text-[9px] font-black uppercase text-gray-400">
                                  Performance Scale
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Simple Bar Comparison graph */}
                      <div className="pt-4 border-t border-gray-100 dark:border-white/5 space-y-3">
                        <p className="text-[9px] font-black text-gray-400 uppercase">YoY Revenue Share comparison</p>
                        <div className="space-y-2">
                          {yearlyAnalytics.map((item, idx) => {
                            const year = item.year || 2026;
                            const rev = item.revenue || 0;
                            const pct = Math.min(Math.round((rev / maxRevenue) * 100), 100);

                            const colors = [
                              'from-emerald-400 to-emerald-600 shadow-emerald-500/20',
                              'from-pink-400 to-pink-600 shadow-pink-500/20'
                            ];
                            const barColor = colors[idx % colors.length];

                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between items-center text-sm font-bold uppercase text-gray-400">
                                  <span>{year} Sales</span>
                                  <span className="font-extrabold">{pct}%</span>
                                </div>
                                <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                  <div 
                                    style={{ width: `${pct}%` }} 
                                    className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-1000 shadow-md`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Middle Box: Annual Performance Charts */}
            <div className={`p-6 lg:p-8 rounded-[32px] border text-left flex flex-col justify-between transition-all duration-300 ${
              isDarkMode ? 'bg-gray-900 border-white/5 shadow-none' : 'bg-white border-gray-100 shadow-xl shadow-gray-100/30'
            }`}>
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[9px] font-black text-primary uppercase block mb-1">Fiscal Performance</span>
                    <h3 className={`text-base font-black uppercase ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Annual Performance & Trends
                    </h3>
                  </div>

                  {/* Year selector & Metric Selectors */}
                  <div className="flex items-center gap-2">
                    <select 
                      value={selectedYear} 
                      onChange={(e) => {
                        const yr = Number(e.target.value);
                        setSelectedYear(yr);
                        fetchMonthlyData(yr);
                      }} 
                      className={`text-sm font-bold uppercase px-3 py-1.5 rounded-xl border outline-none cursor-pointer transition-colors ${
                        isDarkMode ? 'bg-gray-900 border-white/5 text-white' : 'bg-gray-50 border-gray-100 text-gray-700'
                      }`}
                    >
                      {[2024, 2025, 2026, 2027].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  {['revenue', 'orders', 'users'].map((m) => (
                    <button 
                      key={m} 
                      onClick={() => setActiveMonthlyMetric(m)} 
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border transition-all ${
                        activeMonthlyMetric === m 
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                          : isDarkMode ? 'bg-white/5 border-white/5 text-gray-400 hover:text-white' : 'bg-gray-50 border-gray-100 text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full relative overflow-hidden">
                {monthlyAnalytics.length === 0 ? (
                  <div className="text-center py-20 text-xs font-bold text-gray-400 uppercase">
                    No monthly performance metrics available
                  </div>
                ) : (() => {
                  const revMax = Math.max(...monthlyAnalytics.map(item => item.revenue || 0), 10000);
                  const ordMax = Math.max(...monthlyAnalytics.map(item => item.orders || 0), 100);
                  const userMax = Math.max(...monthlyAnalytics.map(item => (item.users || 0) + (item.vendors || 0) + (item.influencers || 0)), 100);
                  
                  const chartHeight = 160;
                  const chartWidth = 500;
                  const paddingLeft = 45;
                  const paddingRight = 15;
                  const paddingTop = 20;
                  const paddingBottom = 40;
                  
                  const usableWidth = chartWidth - paddingLeft - paddingRight;
                  const usableHeight = chartHeight - paddingTop - paddingBottom;
                  
                  const revPoints = monthlyAnalytics.map((item, idx) => {
                    const x = paddingLeft + (idx / Math.max(monthlyAnalytics.length - 1, 1)) * usableWidth;
                    const y = chartHeight - paddingBottom - ((item.revenue || 0) / revMax) * usableHeight;
                    const label = item.month || 'N/A';
                    return { x, y, val: item.revenue || 0, label };
                  });

                  const ordPoints = monthlyAnalytics.map((item, idx) => {
                    const x = paddingLeft + (idx / Math.max(monthlyAnalytics.length - 1, 1)) * usableWidth;
                    const y = chartHeight - paddingBottom - ((item.orders || 0) / ordMax) * usableHeight;
                    const label = item.month || 'N/A';
                    return { x, y, val: item.orders || 0, label };
                  });

                  const userPoints = monthlyAnalytics.map((item, idx) => {
                    const totalUsers = (item.users || 0) + (item.vendors || 0) + (item.influencers || 0);
                    const x = paddingLeft + (idx / Math.max(monthlyAnalytics.length - 1, 1)) * usableWidth;
                    const y = chartHeight - paddingBottom - (totalUsers / userMax) * usableHeight;
                    const label = item.month || 'N/A';
                    return { x, y, val: totalUsers, label };
                  });

                  const revLine = getCurvePath(revPoints);
                  const ordLine = getCurvePath(ordPoints);
                  const userLine = getCurvePath(userPoints);

                  const revArea = revPoints.length > 0 ? `${revLine} L ${revPoints[revPoints.length - 1].x} ${chartHeight - paddingBottom} L ${revPoints[0].x} ${chartHeight - paddingBottom} Z` : '';
                  const ordArea = ordPoints.length > 0 ? `${ordLine} L ${ordPoints[ordPoints.length - 1].x} ${chartHeight - paddingBottom} L ${ordPoints[0].x} ${chartHeight - paddingBottom} Z` : '';
                  const userArea = userPoints.length > 0 ? `${userLine} L ${userPoints[userPoints.length - 1].x} ${chartHeight - paddingBottom} L ${userPoints[0].x} ${chartHeight - paddingBottom} Z` : '';

                  const selectedPoints = activeMonthlyMetric === 'revenue' ? revPoints : activeMonthlyMetric === 'orders' ? ordPoints : userPoints;
                  const selectedMax = activeMonthlyMetric === 'revenue' ? revMax : activeMonthlyMetric === 'orders' ? ordMax : userMax;

                  return (
                    <div className="w-full">
                      <svg className="w-full h-auto max-h-[220px]" viewBox="0 0 500 160" preserveAspectRatio="xMidYMid meet">
                        <defs>
                          <linearGradient id="multi-rev-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="multi-ord-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="multi-user-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                          </linearGradient>
                          <filter id="svg-neon-glow-annual" x="-10%" y="-10%" width="120%" height="120%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                          const y = chartHeight - paddingBottom - ratio * usableHeight;
                          const gridVal = Math.round(selectedMax * ratio);
                          let formattedVal = gridVal;
                          if (activeMonthlyMetric === 'revenue') {
                            formattedVal = gridVal >= 100000 ? (gridVal / 100000).toFixed(1) + 'L' : gridVal >= 1000 ? (gridVal / 1000).toFixed(0) + 'K' : gridVal;
                          } else {
                            formattedVal = gridVal >= 1000 ? (gridVal / 1000).toFixed(0) + 'K' : gridVal;
                          }
                          return (
                            <g key={idx}>
                              <line x1={paddingLeft} y1={y} x2="480" y2={y} stroke={isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} strokeWidth="1" />
                              <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className={`text-[7px] font-black fill-current ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {activeMonthlyMetric === 'revenue' ? 'â‚¹' : ''}{formattedVal}
                              </text>
                            </g>
                          );
                        })}

                        {/* X Labels */}
                        {selectedPoints.map((p, idx) => (
                          <text key={idx} x={p.x} y="148" textAnchor="middle" className={`text-[8px] font-black opacity-75 fill-current ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {p.label}
                          </text>
                        ))}

                        {activeMonthlyMetric === 'revenue' && revArea && <path d={revArea} fill="url(#multi-rev-grad)" />}
                        {activeMonthlyMetric === 'orders' && ordArea && <path d={ordArea} fill="url(#multi-ord-grad)" />}
                        {activeMonthlyMetric === 'users' && userArea && <path d={userArea} fill="url(#multi-user-grad)" />}

                        {activeMonthlyMetric === 'revenue' && revLine && <path d={revLine} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#svg-neon-glow-annual)" />}
                        {activeMonthlyMetric === 'orders' && ordLine && <path d={ordLine} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2,2" strokeLinecap="round" strokeLinejoin="round" filter="url(#svg-neon-glow-annual)" />}
                        {activeMonthlyMetric === 'users' && userLine && <path d={userLine} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#svg-neon-glow-annual)" />}

                        {selectedPoints.map((p, idx) => (
                          <g key={idx} className="group/dot cursor-pointer">
                            <circle 
                              cx={p.x} 
                              cy={p.y} 
                              r="4" 
                              className={`stroke-white dark:stroke-gray-800 transition-all duration-300 group-hover/dot:r-5.5 ${
                                activeMonthlyMetric === 'revenue' ? 'fill-emerald-500' :
                                activeMonthlyMetric === 'orders' ? 'fill-orange-500' : 'fill-blue-500'
                              }`} 
                              strokeWidth="1.5" 
                            />
                            <title>
                              {p.label} Analysis:&#13;
                              Revenue: â‚¹{revPoints[idx].val.toLocaleString('en-IN')}&#13;
                              Orders: {ordPoints[idx].val}&#13;
                              Accounts: {userPoints[idx].val}
                            </title>
                          </g>
                        ))}
                      </svg>

                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-white/5 text-center text-xs font-bold uppercase mt-4">
                        <div>
                          <span className="block text-[8px] font-black text-gray-400 mb-0.5">Annual Total Revenue</span>
                          <span className="text-sm font-black text-emerald-500">
                            â‚¹{monthlyAnalytics.reduce((sum, item) => sum + (item.revenue || 0), 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[8px] font-black text-gray-400 mb-0.5">Annual Total Orders</span>
                          <span className="text-sm font-black text-orange-500">
                            {monthlyAnalytics.reduce((sum, item) => sum + (item.orders || 0), 0).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[8px] font-black text-gray-400 mb-0.5">Annual Total Registrations</span>
                          <span className="text-sm font-black text-blue-500">
                            {monthlyAnalytics.reduce((sum, item) => sum + (item.users || 0) + (item.vendors || 0) + (item.influencers || 0), 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Right Box: Top Performing Vendors Card */}
            <div className={`p-6 lg:p-8 rounded-[32px] border text-left flex flex-col justify-between ${
              isDarkMode ? 'bg-gray-900 border-white/5 shadow-none' : 'bg-white border-gray-100 shadow-xl shadow-gray-100/30'
            }`}>
              <div>
                <span className="text-[9px] font-black text-primary uppercase block mb-1">Partner Networks</span>
                <h3 className={`text-base font-black uppercase mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Top Performing Vendors
                </h3>
              </div>
              
              <div className="space-y-6">
                {topVendorsGraph.length === 0 ? (
                  <div className="text-center py-12 text-xs font-bold text-gray-400 uppercase">
                    No top vendor data available
                  </div>
                ) : (() => {
                  const maxRevenue = Math.max(...topVendorsGraph.map(v => v.totalRevenue || 0), 1);
                  return (
                    <div className="space-y-5">
                      {topVendorsGraph.map((item, idx) => {
                        const vendor = item.vendor || {};
                        const rev = item.totalRevenue || 0;
                        const ord = item.totalOrders || 0;
                        const percent = Math.min(Math.round((rev / maxRevenue) * 100), 100);

                        const colors = [
                          { text: 'text-pink-500', bar: 'from-pink-400 to-pink-600 shadow-pink-500/20', bg: 'bg-pink-500 text-white' },
                          { text: 'text-purple-500', bar: 'from-purple-400 to-purple-600 shadow-purple-500/20', bg: 'bg-purple-500 text-white' },
                          { text: 'text-blue-500', bar: 'from-blue-400 to-blue-600 shadow-blue-500/20', bg: 'bg-blue-500 text-white' }
                        ];
                        const design = colors[idx % colors.length];

                        return (
                          <div key={vendor._id || idx} className="space-y-3 p-4 rounded-2xl border border-gray-50 dark:border-white/5 bg-gray-50/30 dark:bg-white/5 transition-all duration-300 hover:scale-[1.01] hover:shadow-md">
                            <div className="flex justify-between items-center gap-3">
                              <div className="flex items-center gap-3">
                                {vendor.logo?.url ? (
                                  <img 
                                    src={vendor.logo.url} 
                                    alt={vendor.businessName} 
                                    className="w-10 h-10 rounded-xl object-cover border border-gray-100 dark:border-white/10 shadow-sm"
                                  />
                                ) : (
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${design.bg}`}>
                                    {vendor.businessName?.charAt(0).toUpperCase() || 'V'}
                                  </div>
                                )}
                                
                                <div className="space-y-0.5">
                                  <p className={`text-xs font-black tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {vendor.businessName || 'Vendor Shop'}
                                  </p>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase">
                                    {vendor.city || 'Gorakhpur'}, {vendor.state || 'UP'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="text-right space-y-0.5">
                                <p className="text-xs font-black text-emerald-500">
                                  â‚¹{rev.toLocaleString('en-IN')}
                                </p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase">
                                  {ord} {ord === 1 ? 'order' : 'orders'}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="w-full h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                                <div 
                                  style={{ width: `${percent}%` }} 
                                  className={`h-full bg-gradient-to-r ${design.bar} rounded-full transition-all duration-1000 shadow-md`}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

