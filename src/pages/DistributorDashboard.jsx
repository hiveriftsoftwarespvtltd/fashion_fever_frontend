import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  FileText, 
  AlertCircle, 
  ChevronRight,
  PlusCircle,
  Download,
  History
} from 'lucide-react';

const DistributorDashboard = () => {
  const [activeTab, setActiveTab] = useState('bulk');

  const pricingTiers = [
    { qty: '50-100 units', discount: '15% OFF' },
    { qty: '101-500 units', discount: '25% OFF' },
    { qty: '500+ units', discount: '40% OFF' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <span className="text-2xl font-bold text-primary uppercase">WAKEUP DISTRO</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('bulk')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'bulk' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Package size={20} /> Bulk Orders
          </button>
          <button onClick={() => setActiveTab('preorder')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'preorder' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Clock size={20} /> Pre-orders
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">
            <History size={20} /> Order History
          </button>
        </nav>
      </div>

      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
           <h1 className="text-3xl font-bold uppercase text-gray-900">
             {activeTab === 'bulk' ? 'Bulk Order Management' : 'Pre-Order System'}
           </h1>
           <div className="flex gap-4">
              <button className="bg-gray-900 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-2">
                 <Download size={14} /> Catalog
              </button>
           </div>
        </header>

        {activeTab === 'bulk' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Bulk Form */}
            <div className="xl:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
               <h2 className="text-lg font-bold uppercase mb-6">Create New Bulk Request</h2>
               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Select Product</label>
                        <select className="w-full p-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none">
                           <option>Velvet Matte Lipstick (Pack of 50)</option>
                           <option>Hydrating Serum (Pack of 100)</option>
                           <option>Moisturizer Bulk Kit</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Quantity</label>
                        <input type="number" placeholder="Min 50 units" className="w-full p-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none" />
                     </div>
                  </div>
                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                     <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold text-gray-600">Applied Discount:</span>
                        <span className="text-sm font-bold text-primary">25% (Bulk Tier 2)</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-sm font-bold text-gray-600">Estimated Total:</span>
                        <span className="text-xl font-bold text-gray-900">₹42,500</span>
                     </div>
                  </div>
                  <button className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                     Submit Bulk Order <ChevronRight size={18} />
                  </button>
               </div>
            </div>

            {/* Tiers & Info */}
            <div className="space-y-6">
               <div className="bg-gray-900 text-white p-8 rounded-3xl">
                  <h3 className="text-sm font-bold uppercase mb-6">Distributor Pricing Tiers</h3>
                  <div className="space-y-4">
                     {pricingTiers.map((tier, i) => (
                       <div key={i} className="flex justify-between items-center p-3 border-b border-white/10 last:border-0">
                          <span className="text-xs font-bold text-white/60">{tier.qty}</span>
                          <span className="text-sm font-bold text-primary">{tier.discount}</span>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Truck size={24} /></div>
                  <div>
                     <p className="text-xs font-bold text-gray-900 uppercase">Priority Shipping</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase">Distributors get 48h delivery</p>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-gray-50">
                <div className="flex items-center gap-2 text-orange-500 mb-2">
                   <AlertCircle size={18} />
                   <span className="text-[10px] font-bold uppercase">Low Stock Notifications</span>
                </div>
                <h2 className="text-lg font-bold uppercase">Pre-Order Status</h2>
             </div>
             <table className="w-full text-left">
                <thead className="bg-gray-50">
                   <tr>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Product</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Estimated Restock</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">My Pre-orders</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {[1,2].map((i) => (
                     <tr key={i}>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                              <span className="text-sm font-bold text-gray-800">Skin Glow Kit</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-gray-900">15 May 2024</td>
                        <td className="px-8 py-6 text-sm font-bold text-primary">250 Units</td>
                        <td className="px-8 py-6">
                           <button className="text-[10px] font-bold uppercase text-primary hover:underline">Update Qty</button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};

const Clock = ({ size }) => <AlertCircle size={size} />;

export default DistributorDashboard;
