import React from 'react';
import { Zap, MapPin, Search, ShoppingBag, Check, ChevronRight, Star, Heart, Plus, Minus } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUrl';

const CustomerShopView = ({
  category,
  setCategory,
  dynamicCategories = [],
  search,
  setSearch,
  fetchProducts,
  locationMode,
  gpsLocationLabel,
  pincode,
  isAuthenticated,
  addresses = [],
  selectedAddressId,
  setSelectedAddressId,
  setPincode,
  setLocationMode,
  setGpsLocationLabel,
  setShowLocationPromptModal,
  loading,
  products = [],
  quickCart = [],
  handleAddToCart,
  handleDecreaseQuantity,
  handleIncreaseQuantity,
  setActiveSubTab,
  navigate
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 text-left">
      {/* 1. Sticky Category Sidebar with Checkboxes */}
      <div className="md:col-span-3 md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-8rem)] md:overflow-y-auto flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none shrink-0 pr-1">
        <h3 className="hidden md:block text-xs font-extrabold text-gray-900 mb-2 px-2 text-left">
          Categories
        </h3>

        {/* All Categories button */}
        <button
          onClick={() => setCategory('')}
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer hover:bg-rose-50/50 text-left shrink-0 border ${category === ''
              ? 'bg-rose-50/80 text-[#ff4d6d] border-rose-200 font-extrabold'
              : 'bg-white text-gray-700 border-transparent hover:border-gray-200'
            }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${category === '' ? 'bg-[#ff4d6d] border-[#ff4d6d] text-white' : 'border-gray-300 bg-white'
              }`}>
              {category === '' && <Check size={11} className="stroke-[3]" />}
            </div>
            <span className="truncate">All Cosmetics</span>
          </div>
          <ChevronRight size={14} className={category === '' ? 'text-[#ff4d6d]' : 'text-gray-300'} />
        </button>

        {/* Dynamic categories from API */}
        {dynamicCategories.map((cat) => {
          const catId = cat._id || cat.id || cat.name;
          const isSelected = category === catId;
          return (
            <button
              key={catId}
              onClick={() => setCategory(catId)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer hover:bg-rose-50/50 text-left capitalize shrink-0 border ${isSelected
                  ? 'bg-rose-50/80 text-[#ff4d6d] border-rose-200 font-extrabold'
                  : 'bg-white text-gray-700 border-transparent hover:border-gray-200'
                }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${isSelected ? 'bg-[#ff4d6d] border-[#ff4d6d] text-white' : 'border-gray-300 bg-white'
                  }`}>
                  {isSelected && <Check size={11} className="stroke-[3]" />}
                </div>
                <span className="truncate">{cat.name}</span>
              </div>
              <ChevronRight size={14} className={isSelected ? 'text-[#ff4d6d]' : 'text-gray-300'} />
            </button>
          );
        })}
      </div>

      {/* 2. Products Grid Content (9 cols) */}
      <div className="md:col-span-9 flex flex-col gap-4 sm:gap-5">
        {/* Premium speed banner, location bar & search */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 flex flex-col gap-3 sm:gap-4 shadow-sm text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3 sm:h-3.5 sm:w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-black tracking-wider text-emerald-600 uppercase flex items-center gap-1">
                <Zap size={13} className="fill-emerald-500 text-emerald-500 animate-bounce" />
                <span>Express Mode Active: 10 Min Delivery</span>
              </span>
            </div>

            {/* Location Bar */}
            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto bg-white border border-slate-200 rounded-xl sm:rounded-2xl px-3 py-1.5 shadow-sm text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin size={13} className="text-primary shrink-0" />
                <span className="text-[10px] font-black uppercase text-slate-400">Deliver To:</span>
                {locationMode === 'gps' && gpsLocationLabel ? (
                  <span className="text-[11px] font-extrabold text-slate-800 truncate max-w-[140px] sm:max-w-[180px]">{gpsLocationLabel}</span>
                ) : locationMode === 'manual' && pincode ? (
                  <span className="text-[11px] font-extrabold text-slate-800">Pincode: {pincode}</span>
                ) : locationMode === 'address' && isAuthenticated && addresses.length > 0 ? (
                  <select
                    value={selectedAddressId}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setSelectedAddressId(newId);
                      const addr = addresses.find(a => a._id === newId);
                      if (addr && addr.pincode) {
                        setPincode(addr.pincode.toString());
                        setLocationMode('address');
                        setGpsLocationLabel('');
                        localStorage.setItem('quick_delivery_pincode', addr.pincode.toString());
                        localStorage.setItem('quick_delivery_location_mode', 'address');
                        localStorage.removeItem('quick_delivery_location_label');
                      }
                    }}
                    className="bg-transparent text-[11px] font-extrabold text-slate-800 outline-none cursor-pointer max-w-[130px] truncate"
                  >
                    {addresses.map((addr) => (
                      <option key={addr._id} value={addr._id}>
                        {addr.city} ({addr.pincode})
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-[11px] font-extrabold text-slate-800">{pincode ? `Pincode: ${pincode}` : 'Select Location'}</span>
                )}
              </div>
              <button
                onClick={() => setShowLocationPromptModal(true)}
                className="text-[9px] font-black uppercase text-primary hover:underline ml-2 cursor-pointer shrink-0 inline-flex items-center gap-0.5"
              >
                <span>Change</span>
                <MapPin size={10} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
              placeholder="Search cosmetics, eyeliner, hair oil..."
              className="w-full bg-white border border-slate-200 rounded-xl sm:rounded-2xl h-[42px] sm:h-[48px] pl-4 pr-11 text-xs outline-none focus:border-primary font-medium shadow-sm transition-all"
            />
            <button
              onClick={fetchProducts}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary cursor-pointer p-1"
            >
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Products List Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 py-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border border-slate-100 rounded-2xl p-3 animate-pulse space-y-3">
                <div className="bg-slate-200 h-32 sm:h-40 w-full rounded-xl" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-slate-50/50 rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 p-4">
            <ShoppingBag className="mx-auto mb-3 text-slate-350 stroke-[1.5]" size={40} />
            <h4 className="text-xs sm:text-sm font-black uppercase text-slate-700 tracking-wider">No Products Near You</h4>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium max-w-sm mx-auto mt-1.5">
              There are no products enabled for quick commerce delivery near your chosen coordinates. Change address or query filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((prod) => {
              const firstVariant = prod.variants?.[0] || {};
              const variantId = firstVariant._id || prod._id;
              const offeredPrice = firstVariant.offeredPrice !== undefined ? firstVariant.offeredPrice : (prod.offeredPrice || prod.price || 0);
              const salesPrice = firstVariant.salesPrice !== undefined ? firstVariant.salesPrice : (prod.price || offeredPrice);
              const discountPercent = salesPrice > offeredPrice ? Math.round(((salesPrice - offeredPrice) / salesPrice) * 100) : 0;

              const rawImage =
                firstVariant.thumbnail?.url ||
                (typeof firstVariant.thumbnail === 'string' ? firstVariant.thumbnail : '') ||
                firstVariant.images?.[0]?.url ||
                (typeof firstVariant.images?.[0] === 'string' ? firstVariant.images[0] : '') ||
                prod.images?.[0]?.url ||
                (typeof prod.images?.[0] === 'string' ? prod.images[0] : '') ||
                prod.image || '';

              const productImage = getImageUrl(rawImage);

              const categoryName = prod.categoryId?.name || prod.categoryId?.label || prod.category || 'COSMETICS';
              const vendorName = prod.vendorId?.businessName || prod.vendor?.businessName || prod.brand || 'Fashion Fever';
              const stock = firstVariant.stock !== undefined ? firstVariant.stock : 10;
              const cartItem = quickCart.find(item => item.id === variantId || item.variantId === variantId);

              return (
                <div
                  key={prod._id}
                  onClick={() => navigate(`/product/${prod._id}`)}
                  className="group relative flex flex-col bg-white rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-md hover:border-gray-300 transition-all duration-300 w-full cursor-pointer h-full text-left p-3 font-sans"
                >
                  {/* Image Box */}
                  <div className="relative w-full h-[150px] sm:h-[180px] bg-white rounded-xl overflow-hidden flex items-center justify-center p-2 mb-2 shrink-0 border border-gray-100">
                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                      <span className="absolute top-1.5 left-1.5 z-10 bg-[#ff4d6d] text-white text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-2xs tracking-wider">
                        {discountPercent}% OFF
                      </span>
                    )}

                    {/* 10 MIN Speed Badge */}
                    <span className="absolute top-1.5 right-1.5 z-10 bg-amber-50 border border-amber-200 text-amber-700 text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Zap size={10} className="fill-amber-500 text-amber-500" />
                      <span>10 MINS</span>
                    </span>

                    {productImage ? (
                      <img
                        src={productImage}
                        alt={prod.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.style.opacity = '0.3'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 font-bold uppercase text-[9px]">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info Section */}
                  <div className="flex flex-col flex-grow text-left min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase text-gray-400 tracking-wider truncate mb-0.5">
                      {String(categoryName)}
                    </span>

                    <p className="text-[10px] sm:text-xs text-gray-700 font-bold truncate mb-0.5">
                      {String(vendorName)}
                    </p>

                    <h3 className="text-gray-900 font-extrabold text-[12px] sm:text-sm tracking-tight truncate leading-tight group-hover:text-[#ff4d6d] transition-colors mb-1" title={prod.name}>
                      {prod.name}
                    </h3>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-gray-400 mb-1">
                      <div className="flex items-center text-amber-400">
                        <Star size={10} className="fill-amber-400" />
                        <Star size={10} className="fill-amber-400" />
                        <Star size={10} className="fill-amber-400" />
                        <Star size={10} className="fill-amber-400" />
                        <Star size={10} className="fill-gray-200 text-gray-200" />
                      </div>
                      <span>4.8 (12)</span>
                    </div>

                    {/* Express Delivery Note */}
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-600 font-bold mb-2">
                      <Zap size={12} className="shrink-0 fill-emerald-500" />
                      <span>10-Min Express Delivery</span>
                    </div>

                    {/* Price & Stock Status Row */}
                    <div className="flex items-baseline justify-between gap-1 mb-2.5 mt-auto min-w-0">
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="text-sm sm:text-base font-black text-gray-900">₹{offeredPrice}</span>
                        {salesPrice > offeredPrice && (
                          <span className="text-[10px] sm:text-xs text-gray-400 line-through font-medium truncate">₹{salesPrice}</span>
                        )}
                      </div>

                      <span className={`text-[9px] sm:text-[10px] font-extrabold shrink-0 ${stock > 0 ? (stock < 10 ? 'text-[#ff4d6d]' : 'text-emerald-600') : 'text-rose-600'}`}>
                        {stock > 10 ? 'In Stock' : stock > 0 ? 'Few Left' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Action Buttons Row (Add & Buy) */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                      {/* Add Button */}
                      {cartItem ? (
                        <div className="flex-1 h-8 sm:h-9 border border-[#ff4d6d] rounded-xl flex items-center justify-between px-2 bg-rose-50 text-[#ff4d6d] text-xs font-extrabold shadow-2xs">
                          <button
                            onClick={() => handleDecreaseQuantity(cartItem)}
                            className="hover:bg-rose-100 rounded p-0.5 cursor-pointer"
                          >
                            <Minus size={11} />
                          </button>
                          <span>{cartItem.qty}</span>
                          <button
                            onClick={() => handleIncreaseQuantity(cartItem)}
                            className="hover:bg-rose-100 rounded p-0.5 cursor-pointer"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled={stock === 0}
                          onClick={() => handleAddToCart(prod, firstVariant)}
                          className="flex-1 bg-pink-50 hover:bg-pink-100 text-[#ff4d6d] border border-pink-200 rounded-xl font-bold text-xs sm:text-sm h-8 sm:h-9 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
                        >
                          Add
                        </button>
                      )}

                      {/* Buy Button */}
                      <button
                        disabled={stock === 0}
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!cartItem) {
                            await handleAddToCart(prod, firstVariant);
                          }
                          if (typeof setActiveSubTab === 'function') {
                            setActiveSubTab('cart');
                          }
                        }}
                        className="flex-1 bg-[#ff4d6d] hover:bg-[#e63956] text-white rounded-xl font-extrabold text-xs sm:text-sm h-8 sm:h-9 flex items-center justify-center transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        Buy
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerShopView;
