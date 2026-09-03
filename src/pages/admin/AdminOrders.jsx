import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { formatCurrency } from '../../utils/formatters';
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
  RefreshCw
} from 'lucide-react';

export default function AdminOrders() {
  const { adminToken } = useAdminAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders/admin', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [adminToken]);

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
      const data = await res.json();
      if (data.success) {
        setFeedback(`Order #${orderId} status updated to ${newStatus}.`);
        fetchOrders();
      }
    } catch (e) {
      alert('Error updating order: ' + e.message);
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

        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm self-start sm:self-auto"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
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

              {/* ITEMS SNAPSHOT */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Ordered Items</span>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                  {order.items?.map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between text-xs bg-white">
                      <div className="flex-1">
                        <span className="font-bold text-slate-800">{item.productNameSnapshot}</span>
                        <span className="text-slate-400 ml-2">× {item.quantity}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-900">
                          {formatCurrency(item.finalPrice * item.quantity)}
                        </span>
                        {item.salePrice && item.salePrice < item.regularPrice && (
                          <span className="text-[10px] text-emerald-600 block">
                            Sunday Deal (Reg: {formatCurrency(item.regularPrice)})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOTALS */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-sm">
                <div className="text-xs text-slate-500">
                  Subtotal: <span className="font-bold text-slate-700">{formatCurrency(order.subtotal)}</span>
                  {order.discount > 0 && (
                    <span className="text-emerald-600 font-bold ml-2">
                      (Discount: -{formatCurrency(order.discount)})
                    </span>
                  )}
                </div>
                <div className="font-display font-black text-lg text-slate-900">
                  Total: <span className="text-[#e51b23]">{formatCurrency(order.total)}</span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
