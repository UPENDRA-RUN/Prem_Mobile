import React, { useState } from 'react';

export default function Tabs({
  tabs = [], // Array of tab objects: { id, label, icon, content }
  defaultTab,
  variant = "pills", // "pills" | "underline"
  orientation = "horizontal", // "horizontal" | "vertical"
  onChange,
  className = ""
}) {
  const [activeTabId, setActiveTabId] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId) => {
    setActiveTabId(tabId);
    if (onChange) onChange(tabId);
  };

  const activeTabObj = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div className={`space-y-6 ${orientation === 'vertical' ? 'sm:space-y-0 sm:flex sm:gap-8' : ''} ${className}`}>
      
      {/* 4. ITEM ORDER & TAB BAR HEADER */}
      <div className={`flex flex-wrap gap-2 ${
        orientation === 'vertical' ? 'sm:flex-col sm:w-64 sm:flex-shrink-0' : ''
      } ${
        variant === 'underline' ? 'border-b border-slate-200' : 'p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200'
      }`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              /* 
                3. STYLE: Active vs inactive tab differentiation
                5. STATES: Default, active, hover
              */
              className={`transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer ${
                variant === 'pills'
                  ? `px-4 py-2.5 rounded-xl ${
                      isActive
                        ? 'bg-[#050505] text-[#FFD400] shadow-md font-black'
                        : 'text-slate-600 hover:text-[#050505] hover:bg-white/60'
                    }`
                  : `px-4 py-3 border-b-2 -mb-px ${
                      isActive
                        ? 'border-[#FFD400] text-[#050505] font-black'
                        : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                    }`
              }`}
            >
              {TabIcon && <TabIcon className={`w-4 h-4 ${isActive ? 'text-[#FFD400]' : 'text-slate-400'}`} />}
              
              {/* 1. LABELS: Concise single-word/short names */}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. CONTENT AREA: Dedicated area displaying active tab content */}
      <div className="flex-1 min-w-0">
        {activeTabObj?.content}
      </div>

    </div>
  );
}
