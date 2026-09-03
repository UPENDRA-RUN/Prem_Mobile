import React from 'react';
import ContextMenu from '../components/common/ContextMenu';
import { useCart } from '../context/CartContext';
import {
  MoreVertical,
  ChevronDown,
  Edit,
  Trash2,
  Share2,
  Copy,
  ShieldAlert,
  User,
  Heart,
  CheckCircle2,
  Sliders,
  Settings
} from 'lucide-react';

export default function ContextMenuGuide() {
  const { showToast } = useCart();

  const checklist = [
    { title: "1. Trigger Affordance", desc: "Clear overflow icon (MoreVertical), chevron, or right-click target." },
    { title: "2. Menu Item Anatomy", desc: "Label, leading icon, trailing keyboard shortcut, consistent alignment." },
    { title: "3. Section Dividers & Groups", desc: "Visual dividers and header labels grouping related actions." },
    { title: "4. Destructive Item Styling", desc: "Red danger color for irreversible actions, placed at the end after a divider." },
    { title: "5. Nested Submenus (1 Level)", desc: "Secondary dropdown for grouped actions, strictly limited to 1 level." },
    { title: "6. Disabled Items & Tooltips", desc: "Opacity-reduced disabled items with tooltip explanation." },
    { title: "7. Viewport Positioning", desc: "Auto-repositioning relative to trigger so menu stays within screen." },
    { title: "8. Keyboard Shortcuts", desc: "Trailing edge keyboard hints (⌘+E, ⌘+D, Shift+P)." }
  ];

  const sampleSections = [
    {
      label: "ACCOUNT & STORE PREFERENCES",
      items: [
        {
          id: "edit",
          label: "Edit Profile Details",
          icon: Edit,
          shortcut: "⌘+E",
          onClick: () => showToast("Clicked: Edit Profile Details")
        },
        {
          id: "wishlist",
          label: "View Stored Wishlist",
          icon: Heart,
          shortcut: "⌘+W",
          onClick: () => showToast("Clicked: View Stored Wishlist")
        },
        {
          id: "share",
          label: "Share Product Deal",
          icon: Share2,
          submenu: [
            { label: "Share via WhatsApp", onClick: () => showToast("Shared via WhatsApp") },
            { label: "Copy Direct Link", onClick: () => showToast("Copied Direct Link") }
          ]
        }
      ]
    },
    {
      label: "ADMIN ACCESS CONTROL",
      items: [
        {
          id: "inventory",
          label: "Edit Store Inventory Rates",
          icon: Settings,
          disabled: true,
          disabledTooltip: "Requires Store Admin Privilege",
          onClick: () => {}
        }
      ]
    },
    {
      label: "DANGER ZONE",
      items: [
        {
          id: "delete",
          label: "Delete Account & Data",
          icon: Trash2,
          destructive: true,
          shortcut: "⌘+D",
          onClick: () => showToast("Clicked: Delete Account & Data")
        }
      ]
    }
  ];

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER */}
        <div className="bg-[#050505] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#FFD400]/40 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-[#050505]" />
            <span>NAVIGATION ACTION ENGINE</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            CONTEXT & DROPDOWN MENU DESIGN SYSTEM
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Floating menu overlays presenting contextual actions, grouped sections, keyboard shortcuts, submenus, and destructive item safeguards.
          </p>
        </div>

        {/* 8 CHECKLIST CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {checklist.map((c, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs font-black text-[#050505]">
                <span>{c.title}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* INTERACTIVE MENU SHOWCASE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black text-[#E31B23] uppercase tracking-wider block">INTERACTIVE SHOWCASE</span>
            <h3 className="font-display font-black text-xl text-[#050505]">
              PRODUCT & PROFILE CONTEXT MENU DEMO
            </h3>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#050505]">Customer Profile Options Menu</h4>
              <p className="text-xs text-slate-500">
                Click the overflow trigger button to open the full context menu.
              </p>
            </div>

            {/* CONTEXT MENU TRIGGER */}
            <ContextMenu
              trigger={
                <button className="py-3 px-5 rounded-2xl bg-[#050505] text-[#FFD400] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md">
                  <span>OPTIONS MENU</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              }
              sections={sampleSections}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
