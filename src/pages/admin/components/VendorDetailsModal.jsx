import React, { useState, useEffect } from 'react';
import { Store, X, Loader2 } from 'lucide-react';
import { 
  getVendorById, 
  getVendorWalletBalance,
  getVendorWalletTransactions
} from '../../../api/adminService';
import { useTheme } from '../../../context/ThemeContext';

/**
 * Vendor Details Modal with integrated Wallet Balance and Transactions details
 */
const VendorDetailsModal = ({ vendorId, onClose }) => {
  const { isDarkMode } = useTheme();
  const [details, setDetails] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const vendor = details?.vendor || details;
  const productsCount = details?.vendorProducts?.length || 0;
  const categoriesCount = details?.vendorCategories?.length || 0;

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const [vendorRes, walletRes, txRes] = await Promise.all([
          getVendorById(vendorId),
          getVendorWalletBalance(vendorId),
          getVendorWalletTransactions(vendorId)
        ]);
        if (vendorRes.success) setDetails(vendorRes.data);
        if (walletRes.success) setWallet(walletRes.data);
        if (txRes.success) {
          const list = txRes.data?.data ?? txRes.data ?? [];
          setTransactions(Array.isArray(list) ? list : []);
        }
      } catch (err) { 
        console.error(err); 
      }
      setLoading(false);
    };
    if (vendorId) fetchDetail();
  }, [vendorId]);

  if (!vendorId) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm text-left">
      <div className={`w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-primary mb-3" size={32} />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading Shop...</span>
          </div>
        ) : vendor ? (
          <div className="flex flex-col max-h-[85vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5 bg-gray-900/10' : 'border-gray-100 bg-gray-50/50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${isDarkMode ? 'bg-gray-900 text-gray-500' : 'bg-gray-50 text-primary'}`}>
                  <Store size={20} />
                </div>
                <div className="text-left">
                  <h2 className={`text-sm font-black leading-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{vendor.businessName || 'No Name'}</h2>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">@{vendor.slug || 'no-slug'}</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-50 text-gray-400'}`}>
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow scrollbar-thin">
              
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 text-left">
                {[
                  { label: 'Shop Status', value: vendor.status || 'PENDING', isTag: true, color: vendor.status === 'APPROVED' ? 'text-green-500 bg-green-500/10' : 'text-orange-500 bg-orange-500/10' },
                  { label: 'Commission', value: `${vendor.commissionRate || 0}%` },
                  { label: 'Products Listed', value: `${productsCount} Items` },
                  { label: 'Categories Supported', value: `${categoriesCount} Items` },
                  { label: 'Onboarding Date', value: vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'N/A' },
                  { label: 'Shop ID', value: vendor._id, isMono: true }
                ].map((item, i) => (
                  <div key={i} className={`flex flex-col justify-center p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider mb-1">{item.label}</span>
                    {item.isTag ? (
                      <span className={`inline-block w-fit px-2.5 py-0.5 rounded-lg text-sm font-bold uppercase ${item.color}`}>{item.value}</span>
                    ) : (
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} ${item.isMono ? 'font-mono opacity-50' : 'uppercase'}`}>
                        {item.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Vendor Wallet Balance Summary */}
              {wallet && (
                <div className={`p-5 rounded-2xl border text-left transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-900/40 border-white/5' : 'bg-emerald-50/10 border-emerald-100/50'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-black uppercase text-gray-400 tracking-wider">
                      Merchant Wallet Ledger
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Payout Ready
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-gray-400 uppercase">Liquid Balance</span>
                      <span className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        ₹{(wallet.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex flex-col border-l border-gray-100 dark:border-white/5 pl-3">
                      <span className="text-[8px] font-black text-gray-400 uppercase">Pending Escrow</span>
                      <span className="text-sm font-bold text-amber-500">
                        ₹{(wallet.pendingBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex flex-col border-l border-gray-100 dark:border-white/5 pl-3">
                      <span className="text-[8px] font-black text-gray-400 uppercase">Total Earnings</span>
                      <span className="text-sm font-bold text-emerald-500">
                        ₹{(wallet.totalEarnings || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Transactions History Ledger */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2 border-gray-100 dark:border-white/5">
                  <span className="text-sm font-black uppercase text-gray-400 tracking-wider">
                    Transaction Audit Ledger
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase">
                    {(transactions || []).length} Records
                  </span>
                </div>
                
                {(!transactions || transactions.length === 0) ? (
                  <div className="py-6 text-center text-xs font-bold text-gray-400 uppercase italic">
                    No transactions recorded for this merchant wallet.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                    {transactions.map((tx) => (
                      <div 
                        key={tx._id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                          isDarkMode 
                            ? 'bg-gray-900/20 border-white/5 hover:border-white/10' 
                            : 'bg-gray-50/50 border-gray-100 hover:border-gray-200 shadow-sm'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5 max-w-[70%] text-left">
                          <span className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            {tx.description || tx.reason || 'Transaction'}
                          </span>
                          <span className="text-[8px] text-gray-400 font-bold uppercase">
                            {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <div className="text-right flex flex-col items-end gap-0.5 flex-shrink-0">
                          <span className={`font-black text-xs ${
                            tx.type === 'CREDIT' ? 'text-emerald-500' : 'text-rose-500'
                          }`}>
                            {tx.type === 'CREDIT' ? '+' : '-'}₹{(tx.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="text-[8px] text-gray-400 font-mono font-bold uppercase">
                            Bal: ₹{(tx.balanceAfterTransaction || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex justify-end ${isDarkMode ? 'border-white/5 bg-gray-900/10' : 'border-gray-100 bg-gray-50/50'}`}>
              <button onClick={onClose} className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
                Close Review
              </button>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VendorDetailsModal;
