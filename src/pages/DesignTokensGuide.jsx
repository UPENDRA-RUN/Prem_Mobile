import React, { useState } from 'react';
import {
  designTokensMeta,
  primitiveTokens,
  semanticTokens,
  componentTokens
} from '../tokens/tokens';
import {
  Layers,
  FileCode,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Sparkles,
  Flame,
  Tag,
  Palette
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function DesignTokensGuide() {
  const [copiedToken, setCopiedToken] = useState('');
  const { showToast } = useCart();

  const handleCopy = (tokenName, value) => {
    navigator.clipboard.writeText(tokenName);
    setCopiedToken(tokenName);
    showToast(`Copied token: ${tokenName}`);
    setTimeout(() => setCopiedToken(''), 2000);
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER & VERSION BADGE */}
        <div className="bg-[#050505] text-white rounded-3xl p-6 sm:p-10 border-2 border-[#FFD400]/40 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD400] text-[#050505] text-xs font-black uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>DESIGN SYSTEM ENGINE</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                {designTokensMeta.systemName} {designTokensMeta.version}
              </span>
              <span className="text-xs text-slate-400 font-medium">Updated: {designTokensMeta.lastUpdated}</span>
            </div>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            TOKENS DESIGN SYSTEM
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            The foundational layer of Prem Mobile's design system. Variable architecture ensuring 1:1 consistency between design decisions and production code across primitive, semantic, and component tiers.
          </p>
        </div>

        {/* 6 DESIGN SYSTEM CRITERIA SHOWCASE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-[#050505] font-black text-xs uppercase">
              <Layers className="w-4 h-4 text-[#E31B23]" />
              <span>1. Three-Tier Architecture</span>
            </div>
            <p className="text-xs text-slate-600">
              Organized into Primitive (raw values), Semantic (purpose-describing), and Component (element-scoped) tiers.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-[#050505] font-black text-xs uppercase">
              <Tag className="w-4 h-4 text-[#FFD400]" />
              <span>2. Predictable Naming</span>
            </div>
            <p className="text-xs text-slate-600">
              Structured pattern: <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-bold">[tier]-[category]-[purpose]-[state]</code>.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-[#050505] font-black text-xs uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>3. Token Governance</span>
            </div>
            <p className="text-xs text-slate-600">
              Strict policy prohibiting hardcoded hex values and magic numbers in production code.
            </p>
          </div>
        </div>

        {/* TIER 1: PRIMITIVE TOKENS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-[#E31B23] uppercase tracking-wider block">TIER 01</span>
              <h2 className="font-display font-black text-xl text-[#050505]">
                PRIMITIVE TOKENS (RAW VALUES)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Raw color palettes, spacing & radii</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(primitiveTokens.color).flatMap(([family, shades]) =>
              Object.entries(shades).map(([shade, hex]) => {
                const tokenVar = `--primitive-color-${family}-${shade}`;
                return (
                  <div
                    key={tokenVar}
                    onClick={() => handleCopy(tokenVar, hex)}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#050505] transition-all cursor-pointer space-y-2 group"
                  >
                    <div
                      className="w-full h-12 rounded-xl border border-black/10 shadow-xs flex items-center justify-end p-2"
                      style={{ backgroundColor: hex }}
                    >
                      <button className="p-1 rounded-lg bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#050505] block truncate">
                        {family}-{shade}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 uppercase">{hex}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* TIER 2: SEMANTIC TOKENS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-[#FFD400] uppercase tracking-wider block">TIER 02</span>
              <h2 className="font-display font-black text-xl text-[#050505]">
                SEMANTIC TOKENS (PURPOSE & INTENT)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Describes when & where to use token decisions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#050505] uppercase">Interactive Primary CTA Token</span>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200">
                <div
                  className="w-8 h-8 rounded-lg shadow-xs flex-shrink-0"
                  style={{ backgroundColor: semanticTokens.color.interactive.primary.default }}
                />
                <div className="space-y-0.5">
                  <code className="font-mono font-bold text-[#050505]">
                    --semantic-color-interactive-primary-default
                  </code>
                  <p className="text-[11px] text-slate-500">
                    Intended Use: Add to Cart buttons, Checkout CTAs, active filters
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#050505] uppercase">Interactive Danger Token</span>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200">
                <div
                  className="w-8 h-8 rounded-lg shadow-xs flex-shrink-0"
                  style={{ backgroundColor: semanticTokens.color.interactive.danger.default }}
                />
                <div className="space-y-0.5">
                  <code className="font-mono font-bold text-[#050505]">
                    --semantic-color-interactive-danger-default
                  </code>
                  <p className="text-[11px] text-slate-500">
                    Intended Use: Delete account actions, discount badges, high alerts
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* TIER 3: COMPONENT TOKENS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">TIER 03</span>
              <h2 className="font-display font-black text-xl text-[#050505]">
                COMPONENT TOKENS (ELEMENT SCOPED)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Scoped decisions to specific components</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#050505] uppercase">Primary Button Token</span>
              <button
                className="w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md"
                style={{
                  backgroundColor: componentTokens.button.primaryBg,
                  color: componentTokens.button.primaryText
                }}
              >
                Button Component Token
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#050505] uppercase">Discount Badge Token</span>
              <span
                className="inline-block px-3 py-1 rounded-lg font-black text-xs uppercase shadow-xs"
                style={{
                  backgroundColor: componentTokens.badge.discountBg,
                  color: componentTokens.badge.discountText
                }}
              >
                -25% OFF DISCOUNT
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#050505] uppercase">Brand Tag Token</span>
              <span
                className="inline-block px-3 py-1 rounded-lg font-black text-xs uppercase shadow-xs"
                style={{
                  backgroundColor: componentTokens.badge.tagBg,
                  color: componentTokens.badge.tagText
                }}
              >
                boAt OFFICIAL PARTNER
              </span>
            </div>
          </div>
        </div>

        {/* GOVERNANCE & CHANGELOG */}
        <div className="bg-[#050505] text-white rounded-3xl p-6 sm:p-8 border-2 border-[#FFD400]/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-[#FFD400] font-black text-sm uppercase">
            <BookOpen className="w-5 h-5 text-[#FFD400]" />
            <span>Token Governance & Version History</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            {designTokensMeta.governancePolicy}
          </p>

          <div className="pt-2 border-t border-[#222222] space-y-2 text-xs text-slate-400">
            {designTokensMeta.changelog.map((log) => (
              <div key={log.version} className="flex items-center justify-between">
                <span>Version <strong>{log.version}</strong> — {log.description}</span>
                <span className="text-[11px] font-mono text-slate-500">{log.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
