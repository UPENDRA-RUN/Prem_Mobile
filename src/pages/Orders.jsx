import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { formatCurrency } from '../utils/formatters';
import {
  Package,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

export default function Orders() {
  const { customerUser, customerToken } = useCustomerAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${customerToken}` }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch orders');
      }
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (customerToken) {
      fetchOrders();
    }
  }, [customerToken]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black">
            <Truck className="w-3.5 h-3.5" />
            <span>Confirmed / Shipping</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
            <Clock className="w-3.5 h-3.5" />
            <span>Processing / Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#e51b23]">
            Order Tracking & History
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            My Orders
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Logged in as <span className="font-bold text-slate-800">{customerUser?.name}</span> ({customerUser?.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/shop"
            className="px-4 py-2.5 rounded-xl bg-[#ffd000] hover:bg-yellow-400 text-[#050505] font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop More Accessories</span>
          </Link>
        </div>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* LOADING STATE */}
      {isLoading && (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#ffd000] border-t-[#e51b23] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Loading your orders...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && orders.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-black text-lg text-slate-900">No orders placed yet</h3>
            <p className="text-xs text-slate-500">
              Explore our mobile accessories, smartwatches and Sunday deals to place your first order.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#e51b23] hover:bg-[#b91017] text-white font-black text-xs uppercase tracking-wider shadow-md transition-all"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* ORDERS LIST */}
      {!isLoading && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
            >
              {/* TOP ROW: ORDER NUMBER, DATE, STATUS */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-slate-900">{order.orderNumber}</span>
                    {order.isSundaySaleOrder === 1 && (
                      <span className="px-2 py-0.5 rounded-md bg-[#e51b23] text-white text-[10px] font-black uppercase tracking-wider">
                        Sunday Deal
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* ITEMS LIST */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Order Items</h4>
                <div className="divide-y divide-slate-100">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-4 text-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {item.quantity}x
                        </div>
                        <span className="font-bold text-slate-800 truncate">{item.productNameSnapshot}</span>
                      </div>
                      <span className="font-display font-black text-slate-900 flex-shrink-0">
                        {formatCurrency(item.finalPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM: ADDRESS & TOTAL */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
                <div className="flex items-start gap-2 text-slate-500">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-700">Delivery Address: </span>
                    <span>{order.address}, {order.city}, {order.state} - {order.pincode}</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 sm:text-right">
                  <span className="text-slate-500 font-bold">Total Paid:</span>
                  <span className="font-display font-black text-xl text-[#050505]">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
