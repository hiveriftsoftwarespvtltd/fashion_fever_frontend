import React from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

const VendorProducts = ({
  isDarkMode,
  products,
  productsLoading,
  getImageUrl,
  onAddProduct,
  onViewProduct,
  onEditProduct,
  onDeleteProduct
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Product Catalog</h2>
        <button
          onClick={onAddProduct}
          className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 cursor-pointer"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className={`rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-gray-900 border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.2)]' : 'bg-white border-gray-100'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`${isDarkMode ? 'bg-gray-950/40 border-b border-white/5' : 'bg-gray-50 border-b border-gray-100'}`}>
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
              {productsLoading ? (
                <tr><td colSpan="5" className="p-10 text-center font-bold text-gray-400">Loading products...</td></tr>
              ) : products.map((product) => (
                <tr key={product._id} className={`${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50/50'} transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={getImageUrl(product.variants?.[0]?.thumbnail) || `https://ui-avatars.com/api/?name=${product.name}&background=random`} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <span className={`font-bold text-sm ${isDarkMode ? 'text-gray-250' : 'text-gray-800'}`}>{product.name}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>₹{product.variants?.[0]?.salesPrice || 0}</td>
                  <td className={`px-6 py-4 text-sm font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-650'}`}>{product.variants?.[0]?.stock || 0} units</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                      product.status === 'ACTIVE'
                        ? (isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600')
                        : (isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600')
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onViewProduct(product)}
                        className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-500 hover:text-blue-400 hover:bg-blue-500/10' : 'text-gray-300 hover:text-blue-500 hover:bg-blue-50'} cursor-pointer`}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEditProduct(product)}
                        className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-500 hover:text-primary hover:bg-primary/10' : 'text-gray-300 hover:text-primary hover:bg-primary/5'} cursor-pointer`}
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product._id)}
                        className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'} cursor-pointer`}
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
    </div>
  );
};

export default VendorProducts;
