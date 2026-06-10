import React from 'react';
import { Eye, Download } from 'lucide-react';

const VendorOrders = ({
  isDarkMode,
  orders,
  ordersLoading,
  onViewOrder,
  onExportOrders
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold">Customer Orders</h2>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase">
            {orders.length} Total Orders
          </span>
        </div>
        
        {orders.length > 0 && (
          <button
            onClick={onExportOrders}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-md shadow-primary/10 cursor-pointer"
          >
            <Download size={14} />
            Export CSV
          </button>
        )}
      </div>

      <div className={`rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-gray-900 border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.2)]' : 'bg-white border-gray-100'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`${isDarkMode ? 'bg-gray-950/40 border-b border-white/5' : 'bg-gray-50 border-b border-gray-100'}`}>
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Order Number</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Items</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Grand Total</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Payout Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
              {ordersLoading ? (
                <tr><td colSpan="8" className="p-10 text-center font-bold text-gray-400">Loading orders...</td></tr>
              ) : orders.map((order) => {
                const itemsCount = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
                const orderDate = order.createdAt ? new Date(order.createdAt) : null;
                const isDateValid = orderDate && !isNaN(orderDate.getTime());
                
                let statusColor = isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-655';
                if (order.orderStatus === 'delivered') statusColor = isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600';
                else if (order.orderStatus === 'cancelled') statusColor = isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-655';
                
                return (
                  <tr key={order._id} className={`${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'} transition-colors`}>
                    <td className="px-6 py-4">
                      <span className={`font-bold text-sm ${isDarkMode ? 'text-gray-250' : 'text-gray-800'}`}>{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`font-bold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{order.userId?.name || 'User'}</span>
                        <span className={`text-[10px] font-mono ${isDarkMode ? 'text-gray-550' : 'text-gray-400'}`}>{order.userId?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-250' : 'text-gray-800'}`}>
                          {isDateValid ? orderDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                        </span>
                        <span className={`text-[10px] uppercase font-bold ${isDarkMode ? 'text-gray-550' : 'text-gray-400'}`}>
                          {isDateValid ? orderDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold ${isDarkMode ? 'text-gray-450' : 'text-gray-600'}`}>{itemsCount} units</td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">₹{(order.grandTotal || 0).toLocaleString()}</td>
                    <td className={`px-6 py-4 text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>₹{(order.payoutAmount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${statusColor}`}>
                        {order.orderStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onViewOrder(order)}
                        className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-500 hover:text-blue-400 hover:bg-blue-500/10' : 'text-gray-300 hover:text-blue-500 hover:bg-blue-50'} cursor-pointer`}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && !ordersLoading && (
                <tr><td colSpan="8" className="p-10 text-center font-bold text-gray-400">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorOrders;
