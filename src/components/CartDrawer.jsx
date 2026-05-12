import { X, ArrowLeft, Heart, ShoppingBag, Trash2, Plus, Minus, Info } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose }) => {
  const staticItems = [
    {
      id: 1,
      name: "La Roche-Posay Anthelios UV MUNE 400",
      variant: "50ml",
      price: 1499,
      salesPrice: 1424,
      image: "https://res.cloudinary.com/dn2rvjcpu/raw/upload/v1778569233/product/ixrnc6vglqfi4wo2cisg",
      qty: 1
    },
    {
      id: 2,
      name: "Nykaa Skin Potion Facial Oil",
      variant: "30ml",
      price: 999,
      salesPrice: 799,
      image: "https://res.cloudinary.com/dn2rvjcpu/raw/upload/v1778569234/product/ldxxsamuvef34r7mcxge",
      qty: 2
    }
  ];

  const totalOriginal = staticItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalSales = staticItems.reduce((acc, item) => acc + (item.salesPrice * item.qty), 0);
  const discount = totalOriginal - totalSales;
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[1000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[1001] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-1 hover:bg-gray-50 rounded-full transition-colors text-gray-800">
                <ArrowLeft size={22} />
              </button>
              <h2 className="text-xl font-bold text-gray-900 uppercase">Bag</h2>
            </div>
            <button className="text-xs font-bold text-primary uppercase hover:underline">
              View Wishlist
            </button>
          </div>

          {/* Content */}
          <div className="flex-grow overflow-y-auto bg-gray-50/30">
            {staticItems.length > 0 ? (
              <div className="p-4 space-y-4">
                {staticItems.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 relative group">
                    <div className="w-20 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-2 uppercase">{item.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Size: {item.variant}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-gray-900">₹{item.salesPrice}</span>
                          <span className="text-[11px] font-bold text-gray-400 line-through">₹{item.price}</span>
                        </div>
                        
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8">
                          <button className="px-2 hover:bg-gray-50 text-gray-500 transition-colors"><Minus size={12} /></button>
                          <span className="px-3 text-xs font-bold text-gray-800 border-x border-gray-200 h-full flex items-center">{item.qty}</span>
                          <button className="px-2 hover:bg-gray-50 text-gray-500 transition-colors"><Plus size={12} /></button>
                        </div>
                      </div>
                    </div>
                    
                    <button className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                
                {/* Bill Details */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mt-6">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
                    <Info size={16} className="text-primary" />
                    <h5 className="text-[12px] font-bold text-gray-800 uppercase">Bill Details</h5>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span className="text-gray-500">Bag Total</span>
                      <span className="text-gray-800">₹{totalOriginal}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span className="text-gray-500">Bag Discount</span>
                      <span className="text-green-600">- ₹{discount}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-gray-800">Free</span>
                    </div>
                    <div className="h-[1px] bg-gray-50 my-2"></div>
                    <div className="flex justify-between text-sm font-bold uppercase">
                      <span className="text-gray-900">Total Payable</span>
                      <span className="text-primary">₹{totalSales}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-48 h-48 mb-8 relative">
                  <img 
                    src="/empty_cart_illustration_1778583793297.png" 
                    alt="Empty Cart" 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Shopping Bag is Empty</h3>
                <p className="text-sm font-bold text-gray-400 uppercase leading-relaxed max-w-[240px]">
                  This feels too light! Go on, add all your favourites
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {staticItems.length > 0 && (
            <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] sticky bottom-0 z-20">
              <div className="flex items-center justify-between mb-4 px-2">
                 <div className="flex flex-col">
                   <span className="text-[14px] font-bold text-gray-900">₹{totalSales}</span>
                   <span className="text-[10px] font-bold text-primary uppercase">View Details</span>
                 </div>
                 <button className="bg-primary text-white px-10 py-3.5 rounded-xl font-bold uppercase text-xs shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all flex items-center gap-2">
                   Proceed <ArrowLeft size={16} className="rotate-180" />
                 </button>
              </div>
            </div>
          )}
          
          {!staticItems.length && (
             <div className="p-6">
                <button 
                  onClick={onClose}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all"
                >
                  Start Shopping
                </button>
             </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
