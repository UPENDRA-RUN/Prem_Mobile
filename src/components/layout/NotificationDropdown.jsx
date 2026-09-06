import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Truck, Flame, Tag, CheckCircle2, Trash2, X, Sparkles, AlertCircle } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotification();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type) => {
    switch (type) {
      case 'ORDER_STATUS':
        return <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'SALE':
        return <Flame className="w-5 h-5 text-red-500 animate-pulse" />;
      case 'PROMO':
        return <Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'WELCOME':
        return <Sparkles className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className={`w-5 h-5 transition-transform ${unreadCount > 0 ? 'animate-bounce text-amber-600 dark:text-amber-400' : ''}`} />
        
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 z-50 overflow-hidden border border-slate-100 dark:border-slate-800 transition-all transform origin-top-right">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                  {unreadCount} new
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Read all
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of notifications */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2 opacity-50" />
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No notifications yet</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">We'll alert you on order updates and Sunday sales!</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 transition-colors relative group flex items-start space-x-3 ${
                    notif.read
                      ? 'bg-white dark:bg-slate-900 opacity-75'
                      : 'bg-amber-50/40 dark:bg-amber-950/20 font-medium'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 mt-0.5">
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <Link
                        to={notif.link || '#'}
                        onClick={() => handleNotificationClick(notif)}
                        className="text-xs font-bold text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 truncate block"
                      >
                        {notif.title}
                      </Link>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                      {notif.message}
                    </p>

                    {notif.link && (
                      <Link
                        to={notif.link}
                        onClick={() => handleNotificationClick(notif)}
                        className="inline-block mt-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        View details &rarr;
                      </Link>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                    title="Remove notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 dark:text-slate-500">Real-time Gwalior store alerts</span>
              <button
                type="button"
                onClick={clearAllNotifications}
                className="text-red-500 dark:text-red-400 hover:underline font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
