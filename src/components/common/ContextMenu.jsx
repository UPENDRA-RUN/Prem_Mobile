import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, MoreVertical, ShieldAlert } from 'lucide-react';

export default function ContextMenu({
  trigger,
  sections = [], // Array of section objects: { label, items }
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      {/* 1. TRIGGER AFFORDANCE */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer inline-flex items-center">
        {trigger || (
          <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 py-2 text-xs divide-y divide-slate-100 animate-scale-in">
          {sections.map((section, secIdx) => (
            <div key={secIdx} className="py-1">
              {/* 3. SECTION DIVIDERS & HEADER LABELS */}
              {section.label && (
                <div className="px-3 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  {section.label}
                </div>
              )}

              {section.items.map((item, itemIdx) => {
                const ItemIcon = item.icon;
                const isSubmenuOpen = activeSubmenu === item.id;

                return (
                  <div key={itemIdx} className="relative">
                    {/* 2. MENU ITEM ANATOMY: Icon, Label, Trailing Shortcut, Destructive Styling */}
                    <button
                      disabled={item.disabled}
                      onClick={() => {
                        if (item.submenu) {
                          // 5. NESTED SUBMENU (LIMITED TO 1 LEVEL)
                          setActiveSubmenu(isSubmenuOpen ? null : item.id);
                        } else if (!item.disabled && item.onClick) {
                          item.onClick();
                          setIsOpen(false);
                        }
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                        item.destructive
                          ? 'text-[#E31B23] hover:bg-red-50 font-bold' // 4. DESTRUCTIVE ITEM STYLING
                          : item.disabled
                          ? 'text-slate-400 opacity-50 cursor-not-allowed' // 6. DISABLED ITEMS
                          : 'text-slate-800 hover:bg-slate-100 font-medium'
                      }`}
                      title={item.disabled ? item.disabledTooltip : undefined}
                    >
                      <div className="flex items-center gap-2.5">
                        {ItemIcon && (
                          <ItemIcon className={`w-4 h-4 flex-shrink-0 ${
                            item.destructive ? 'text-[#E31B23]' : item.disabled ? 'text-slate-400' : 'text-slate-500'
                          }`} />
                        )}
                        <span>{item.label}</span>
                      </div>

                      {/* 8. KEYBOARD SHORTCUT DISPLAY */}
                      {item.shortcut ? (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {item.shortcut}
                        </span>
                      ) : item.submenu ? (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      ) : null}
                    </button>

                    {/* 5. NESTED SUBMENU CONTAINER (1 LEVEL LIMIT) */}
                    {item.submenu && isSubmenuOpen && (
                      <div className="absolute left-full top-0 ml-1 w-48 rounded-2xl bg-white border border-slate-200 shadow-xl py-1 z-50 animate-fade-in">
                        {item.submenu.map((sub, subIdx) => (
                          <button
                            key={subIdx}
                            onClick={() => {
                              if (sub.onClick) sub.onClick();
                              setIsOpen(false);
                              setActiveSubmenu(null);
                            }}
                            className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-100 font-medium flex items-center justify-between"
                          >
                            <span>{sub.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
