/**
 * Formats an order object or ID string into a clean, professional, human-readable order number.
 * 
 * Examples:
 * - If order.orderNumber is "FFQ-260808-3914" -> "FFQ-260808-3914"
 * - If order._id is "6a76d5923436b12a2f4df21c" -> "FF-#6A76D592"
 */
export const formatOrderId = (order) => {
  if (!order) return '';

  if (typeof order === 'string') {
    if (order.startsWith('FF') || order.startsWith('ORD') || order.startsWith('QORD')) {
      return order;
    }
    const cleanStr = order.trim();
    if (/^[0-9a-fA-F]{24}$/.test(cleanStr)) {
      return `FF-#${cleanStr.slice(-8).toUpperCase()}`;
    }
    return cleanStr.startsWith('#') ? cleanStr : `#${cleanStr}`;
  }

  if (order.orderNumber) {
    return order.orderNumber.startsWith('#') ? order.orderNumber : order.orderNumber;
  }

  if (order._id) {
    const idStr = String(order._id);
    if (/^[0-9a-fA-F]{24}$/.test(idStr)) {
      return `FF-#${idStr.slice(-8).toUpperCase()}`;
    }
    return `#${idStr}`;
  }

  return '';
};
