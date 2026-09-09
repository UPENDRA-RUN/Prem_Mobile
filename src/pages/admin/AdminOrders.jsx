import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useRealtimeSync } from '../../hooks/useRealtimeSync';
import { formatCurrency } from '../../utils/formatters';
import { parseResponseJson } from '../../utils/apiHelper';
import {
  ShoppingCart,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Flame,
  Search,
  RefreshCw,
  Trash2,
  FileText,
  Download,
  Lock
} from 'lucide-react';
import { generateGSTInvoicePDF } from '../../utils/pdfInvoiceGenerator';

export default function AdminOrders() {
  const { adminToken } = useAdminAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState(null);

  const fetchOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const res = await fetch('/api/orders/admin', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await parseResponseJson(res);
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useRealtimeSync(fetchOrders, ['ORDERS_UPDATED'], 15000);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/admin/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await parseResponseJson(res);
      if (data.success) {
        setFeedback(`Order #${orderId} status updated to ${newStatus}.`);
        fetchOrders();
      }
    } catch (e) {
      alert('Error updating order: ' + e.message);
    }
  };

  const handlePurgeAllOrders = async () => {
    if (!window.confirm('Are you sure you want to purge all store orders? This action cannot be undone.')) {
      return;
    }
    try {
      const res = await fetch('/api/orders/admin/purge-all', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await parseResponseJson(res);
      if (data.success) {
        setFeedback('All store orders have been purged successfully.');
        fetchOrders();
      }
    } catch (e) {
      alert('Error purging orders: ' + e.message);
    }
  };

  const filteredOrders = orders.filter(o => {
    const term = search.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(term) ||
      o.customerName?.toLowerCase().includes(term) ||
      o.mobile?.includes(term) ||
      o.city?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#e51b23]">
            Customer Fulfillment
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Orders ({orders.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View orders, verified item pricing snapshots, and fulfill customer requests.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {orders.length > 0 && (
            <button
              onClick={handlePurgeAllOrders}
              className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-200 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              title="Purge All Orders"
            >
              <Trash2 className="w-4 h-4" />
              <span>Purge All Orders</span>
            </button>
          )}

          <button
            onClick={fetchOrders}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm transition-all cursor-pointer"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by order number, customer name, mobile, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#050505]"
          />
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 font-bold">
            No customer orders found.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-base text-slate-900">
                      {order.orderNumber}
                    </span>
                    {Boolean(order.isSundaySaleOrder) && (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#e51b23] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-[#e51b23]" />
                        Sunday Sale
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500">Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-black uppercase tracking-wider bg-slate-50 focus:outline-none focus:border-[#050505]"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* CUSTOMER & ADDRESS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 bg-slate-50 rounded-2xl p-4">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Customer Info</span>
                  <p className="font-black text-slate-900 text-sm">{order.customerName}</p>
                  <p className="flex items-center gap-1 text-slate-700 mt-1 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {order.mobile}
                  </p>
                  {order.email && <p className="text-slate-500">{order.email}</p>}
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Delivery Address</span>
                  <p className="font-medium text-slate-800">{order.address}</p>
                  <p className="text-slate-600">{order.city}, {order.state} - {order.pincode}</p>
                </div>
              </div>

              {/* ITEMS SNAPSHOT & PACKAGING CHECKLIST */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Ordered Items</span>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {order.items?.map((item) => {
                    const isCombo = Boolean(item.isCombo || String(item.productNameSnapshot || '').includes('COMBO'));
                    let bundleList = [];
                    if (item.bundledItems) {
                      try {
                        bundleList = typeof item.bundledItems === 'string' ? JSON.parse(item.bundledItems) : item.bundledItems;
                      } catch (e) {}
                    }

                    return (
                      <div key={item.id || item.productNameSnapshot} className="p-3 sm:p-4 bg-white space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                            {isCombo && (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#FFD400] text-[#050505] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 shadow-xs border border-amber-400">
                                🎁 ORDERED COMBO
                              </span>
                            )}
                            <span className="font-black text-slate-900">{item.productNameSnapshot}</span>
                            <span className="text-slate-500 font-bold">× {item.quantity}</span>
                          </div>
                          {(() => {
                            const unitPrice = (item.finalPrice !== null && item.finalPrice !== undefined && Number(item.finalPrice) > 0)
                              ? Number(item.finalPrice)
                              : ((item.salePrice !== null && item.salePrice !== undefined && Number(item.salePrice) > 0)
                                  ? Number(item.salePrice)
                                  : Number(item.regularPrice || 0));
                            const lineTotal = unitPrice * (item.quantity || 1);
                            const isDiscounted = item.regularPrice > unitPrice && item.regularPrice > 0;

                            return (
                              <div className="text-right shrink-0 ml-2">
                                <span className="font-black text-slate-900 text-sm block">
                                  {formatCurrency(lineTotal)}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium block">
                                  ({formatCurrency(unitPrice)} × {item.quantity})
                                </span>
                                {isDiscounted && (
                                  <span className="text-[10px] text-emerald-600 block font-bold">
                                    Special Deal (MRP: {formatCurrency(item.regularPrice)})
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </div>

                        {/* COMBO PACKAGING CHECKLIST FOR ADMIN FULFILLMENT */}
                        {isCombo && (
                          <div className="p-3.5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 text-xs text-amber-950 space-y-2 shadow-2xs my-1">
                            <div className="flex items-center justify-between border-b border-amber-200/80 pb-1.5">
                              <span className="font-black uppercase tracking-wider text-[11px] text-amber-900 flex items-center gap-1.5">
                                📦 PACKAGING CHECKLIST (Items to include in parcel):
                              </span>
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                                Combo Pack
                              </span>
                            </div>

                            {Array.isArray(bundleList) && bundleList.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                                {bundleList.map((bItem, bIdx) => (
                                  <div key={bIdx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-amber-200/90 font-bold text-slate-900 text-xs shadow-2xs">
                                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">✓</span>
                                    <span>Add {bItem.quantity || 1}× {bItem.name || bItem.customItemName} to package</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-amber-800 font-medium italic">
                                Bundled items specified for this combo package. Check combo item details in catalog.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TOTALS BREAKDOWN */}
              {(() => {
                const itemsSubtotal = order.items?.reduce((acc, it) => acc + ((it.finalPrice || 0) * (it.quantity || 1)), 0) || order.subtotal || order.total;
                const netAmountPaid = order.total !== undefined && order.total !== null ? order.total : itemsSubtotal;
                const isDelivered = order.status === 'DELIVERED';

                return (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-200 text-xs sm:text-sm gap-3 bg-slate-50/80 p-4 rounded-2xl">
                    <div className="flex flex-wrap items-center gap-3 text-slate-600 font-medium">
                      <span>Items Subtotal: <strong className="text-slate-900 font-black">{formatCurrency(itemsSubtotal)}</strong></span>
                      {order.discount > 0 && (
                        <span className="text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2.5 py-1 rounded-xl font-bold text-xs inline-flex items-center gap-1">
                          🏷️ Coupon Savings: -{formatCurrency(order.discount)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl font-display font-black text-sm sm:text-base shadow-sm flex items-center gap-1.5">
                        <span className="text-emerald-100 text-xs uppercase tracking-wider font-extrabold">Net Paid:</span>
                        <span>{formatCurrency(netAmountPaid)}</span>
                      </div>

                      {isDelivered ? (
                        <button
                          onClick={() => generateGSTInvoicePDF(order)}
                          className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-transform hover:scale-102 cursor-pointer"
                          title="Download Official GST Tax Invoice PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>GST INVOICE PDF</span>
                        </button>
                      ) : (
                        <div
                          className="py-1.5 px-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 border border-slate-200 cursor-not-allowed"
                          title="GST Invoice available only when order status is DELIVERED"
                        >
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>INVOICE AT DELIVERY</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

            </div>
          ))
        )}
      </div>

    </div>
  );
}
