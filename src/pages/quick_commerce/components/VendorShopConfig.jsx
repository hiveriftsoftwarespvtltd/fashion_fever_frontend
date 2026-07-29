import React from 'react';
import { Settings, ToggleLeft, ToggleRight } from 'lucide-react';
import { updateQuickVendorConfig } from '../../../api/quickECommerceService';
import { toast } from '../../../utils/toast';

const VendorShopConfig = ({
  enabled,
  setEnabled,
  acceptingOrders,
  setAcceptingOrders,
  serviceRadius,
  setServiceRadius,
  maxConcurrentOrders,
  defaultPreparationTime,
  setDefaultPreparationTime,
  handleSaveConfig
}) => {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
        <Settings size={16} className="text-primary" />
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Shop Config</h3>
      </div>

      <div className="space-y-5 text-xs font-semibold text-slate-600">
        {/* Enabled Toggles */}
        <div className="flex justify-between items-center">
          <span>Quick E-Commerce Enabled</span>
          <button
            onClick={async () => {
              const nextVal = !enabled;
              setEnabled(nextVal);
              try {
                const res = await updateQuickVendorConfig({
                  enabled: nextVal,
                  acceptingOrders,
                  serviceRadius,
                  maxConcurrentOrders,
                  defaultPreparationTime
                });
                if (res?.success) {
                  toast.success(`Quick Commerce ${nextVal ? 'ENABLED' : 'DISABLED'}`);
                } else {
                  setEnabled(!nextVal);
                  toast.error(res?.message || 'Failed to update setting');
                }
              } catch (err) {
                setEnabled(!nextVal);
                toast.error('Network error saving setting');
              }
            }}
            className="text-slate-500 hover:text-primary transition-colors cursor-pointer"
          >
            {enabled ? (
              <ToggleRight size={38} className="text-emerald-500" />
            ) : (
              <ToggleLeft size={38} className="text-slate-400" />
            )}
          </button>
        </div>

        <div className="flex justify-between items-center">
          <span>Accepting New Orders</span>
          <button
            onClick={async () => {
              const nextVal = !acceptingOrders;
              setAcceptingOrders(nextVal);
              try {
                const res = await updateQuickVendorConfig({
                  enabled,
                  acceptingOrders: nextVal,
                  serviceRadius,
                  maxConcurrentOrders,
                  defaultPreparationTime
                });
                if (res?.success) {
                  toast.success(`Store status: ${nextVal ? 'ACCEPTING ORDERS' : 'PAUSED'}`);
                } else {
                  setAcceptingOrders(!nextVal);
                  toast.error(res?.message || 'Failed to update status');
                }
              } catch (err) {
                setAcceptingOrders(!nextVal);
                toast.error('Network error saving setting');
              }
            }}
            className="text-slate-500 hover:text-primary transition-colors cursor-pointer"
          >
            {acceptingOrders ? (
              <ToggleRight size={38} className="text-emerald-500" />
            ) : (
              <ToggleLeft size={38} className="text-slate-400" />
            )}
          </button>
        </div>

        {/* Service Radius Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Delivery Radius Limit</span>
            <span className="text-primary font-bold">{serviceRadius} KM</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={serviceRadius}
            onChange={(e) => setServiceRadius(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Default Prep time Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Avg Preparation Time</span>
            <span className="text-primary font-bold">{defaultPreparationTime} Mins</span>
          </div>
          <input
            type="range"
            min="5"
            max="60"
            step="5"
            value={defaultPreparationTime}
            onChange={(e) => setDefaultPreparationTime(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <button
          onClick={handleSaveConfig}
          className="w-full bg-slate-900 hover:bg-primary text-white py-3 rounded-2xl font-bold uppercase tracking-wider cursor-pointer transition-colors text-center mt-3 shadow-md"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default VendorShopConfig;
