import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { faqCategories, faqQuestions } from '../data/faq';
import { storeConfig } from '../config/store';
import { openGeneralWhatsApp } from '../utils/whatsapp';
import {
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  MapPin,
  Mail,
  X,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Truck,
  Flame,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openQuestionIds, setOpenQuestionIds] = useState([1, 2, 4, 7, 10]); // Default open popular questions

  const categoryIconMap = {
    MapPin: MapPin,
    ShieldCheck: ShieldCheck,
    CreditCard: CreditCard,
    Truck: Truck,
    Flame: Flame
  };

  // Toggle single accordion question
  const toggleQuestion = (id) => {
    setOpenQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    );
  };

  // Filter questions based on search query & category selection
  const filteredQuestions = useMemo(() => {
    return faqQuestions.filter((q) => {
      const matchesCategory =
        selectedCategory === 'all' || q.categoryId === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const qText = q.question.toLowerCase();
      const aText = q.answer.toLowerCase();
      const kWords = q.keywords.join(' ').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      return (
        qText.includes(query) || aText.includes(query) || kWords.includes(query)
      );
    });
  }, [searchQuery, selectedCategory]);

  const scrollToCategory = (catId) => {
    setSelectedCategory(catId);
    const element = document.getElementById(`cat-${catId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F6F6F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HERO BANNER & SEARCH */}
        <div className="rounded-3xl bg-[#050505] text-white p-8 sm:p-12 shadow-2xl border-2 border-[#FFD400]/40 relative overflow-hidden text-center space-y-6">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E31B23] text-white text-xs font-black uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 fill-white" />
              <span>PREM MOBILE HELP & FAQ CENTER</span>
            </div>
            
            <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              How Can We Help You Today?
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Find answers about store pickup at Pinto Park, live audio tests, payment options, original warranty, and Sunday Sale deals.
            </p>

            {/* KEYWORD SEARCH INPUT BAR */}
            <div className="pt-2 max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search questions by keyword (e.g. 'pickup', 'payment', 'warranty', 'return')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white text-[#050505] placeholder-slate-400 text-xs sm:text-sm font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-[#FFD400]/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 p-1 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition-colors"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {searchQuery && (
                <div className="text-xs text-[#FFD400] font-bold text-left pt-2 px-2 flex justify-between items-center">
                  <span>Found {filteredQuestions.length} matching result(s) for "{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="underline hover:text-white">
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Decorative Background Accent */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#FFD400]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* TABLE OF CONTENTS INDEX BAR */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bookmark className="w-4 h-4 text-[#E31B23]" />
            <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#050505]">
              TABLE OF CONTENTS — QUICK JUMP TO AREA
            </h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {faqCategories.map((cat, idx) => {
              const IconComp = categoryIconMap[cat.icon] || HelpCircle;
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-[#FFD400] transition-all text-left group flex items-start gap-2.5"
                >
                  <div className="w-7 h-7 rounded-xl bg-white text-[#050505] flex items-center justify-center flex-shrink-0 border border-slate-200 group-hover:bg-[#FFD400]">
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 block uppercase">
                      0{idx + 1}. TOPIC
                    </span>
                    <span className="text-xs font-bold text-[#050505] group-hover:text-[#E31B23] line-clamp-1 transition-colors">
                      {cat.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* NAVIGATE BY TOPIC CHIPS / CATEGORY TABS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-lg text-[#050505] uppercase tracking-wider">
              Browse Questions by Topic
            </h2>
            <span className="text-xs font-bold text-slate-500">
              Showing {filteredQuestions.length} Questions
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                selectedCategory === 'all'
                  ? 'bg-[#050505] text-[#FFD400] border-[#050505] shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              All Topics ({faqQuestions.length})
            </button>

            {faqCategories.map((cat) => {
              const count = faqQuestions.filter((q) => q.categoryId === cat.id).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-[#050505] text-[#FFD400] border-[#050505] shadow-md font-black'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.title}</span>
                  <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-[#FFD400] text-[#050505]' : 'bg-slate-100 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ACCORDION FAQ QUESTIONS LIST */}
        <div className="space-y-8">
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-[#050505]">
                  No Questions Found Matching Your Criteria
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try searching for keywords like "pickup", "delivery", "payment", or "warranty".
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#FFD400] text-[#050505] font-black text-xs uppercase tracking-wider"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            faqCategories
              .filter(
                (cat) =>
                  selectedCategory === 'all' || selectedCategory === cat.id
              )
              .map((cat) => {
                const catQuestions = filteredQuestions.filter(
                  (q) => q.categoryId === cat.id
                );

                if (catQuestions.length === 0) return null;

                const IconComp = categoryIconMap[cat.icon] || HelpCircle;

                return (
                  <div key={cat.id} id={`cat-${cat.id}`} className="space-y-4 scroll-mt-24">
                    {/* Category Header */}
                    <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                      <div className="w-9 h-9 rounded-2xl bg-[#050505] text-[#FFD400] flex items-center justify-center">
                        <IconComp className="w-4 h-4 text-[#FFD400]" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-lg text-[#050505] uppercase tracking-wide">
                          {cat.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{cat.description}</p>
                      </div>
                    </div>

                    {/* Category Q&A Items */}
                    <div className="space-y-3">
                      {catQuestions.map((q) => {
                        const isOpen = openQuestionIds.includes(q.id);

                        return (
                          <div
                            key={q.id}
                            className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                              isOpen
                                ? 'border-[#FFD400] shadow-sm'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <button
                              onClick={() => toggleQuestion(q.id)}
                              className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-lg bg-amber-50 text-[#050505] font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-200">
                                  Q
                                </span>
                                <div>
                                  <h4 className="font-bold text-sm sm:text-base text-[#050505]">
                                    {q.question}
                                  </h4>
                                  {q.isPopular && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#E31B23] uppercase tracking-wider mt-1">
                                      <Sparkles className="w-3 h-3 fill-[#E31B23]" />
                                      <span>Frequently Asked</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className={`p-1.5 rounded-lg text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-black' : ''}`}>
                                <ChevronDown className="w-5 h-5" />
                              </div>
                            </button>

                            {/* Answer Container */}
                            {isOpen && (
                              <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/40 space-y-3">
                                <p className="pl-9">{q.answer}</p>
                                
                                <div className="pl-9 flex flex-wrap items-center gap-1.5 pt-2">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Tags:</span>
                                  {q.keywords.slice(0, 4).map((kw) => (
                                    <span key={kw} className="px-2 py-0.5 rounded-md bg-slate-200/60 text-slate-700 text-[10px] font-medium">
                                      #{kw}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
          )}
        </div>

        {/* DIRECT CONTACT OPTIONS (ORDERED STRICTLY BY ACCESSIBILITY / LEVEL OF EFFORT) */}
        <div className="bg-white rounded-3xl border-2 border-[#FFD400]/40 p-6 sm:p-10 shadow-xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#050505] text-[#FFD400] font-black text-xs uppercase tracking-wider">
              STILL HAVE QUESTIONS?
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#050505]">
              Contact Us Directly (Ordered by Ease of Reach)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              If your question isn't answered above, pick the contact option that best fits your convenience below — arranged from instant 1-click messaging to in-person visit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            
            {/* OPTION 1: WHATSAPP CHAT (EASIEST / LOWEST EFFORT - 1 CLICK) */}
            <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-300 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative">
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#25D366] text-white font-black text-[9px] uppercase tracking-wider">
                OPTION 1 • EASIEST
              </span>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md">
                  <MessageCircle className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base text-[#050505]">
                    WhatsApp Chat
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Instant 1-click text chat. Ask about stock, reserve products, or send custom orders.
                  </p>
                </div>
              </div>

              <button
                onClick={() => openGeneralWhatsApp('FAQ Direct Assistance')}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-102"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>CHAT ON WHATSAPP</span>
              </button>
            </div>

            {/* OPTION 2: DIRECT PHONE CALL (LOW EFFORT - INSTANT VOICE) */}
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative">
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#050505] text-[#FFD400] font-black text-[9px] uppercase tracking-wider">
                OPTION 2 • LOW EFFORT
              </span>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#050505] text-[#FFD400] flex items-center justify-center shadow-md">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base text-[#050505]">
                    Phone Call
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Speak directly with store staff at Pinto Park for immediate voice assistance.
                  </p>
                </div>
              </div>

              <a
                href={`tel:${storeConfig.phone}`}
                className="w-full py-3 px-4 rounded-xl bg-[#050505] hover:bg-[#1a1a1a] text-[#FFD400] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#FFD400]/40 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>CALL: {storeConfig.displayPhone}</span>
              </a>
            </div>

            {/* OPTION 3: STORE VISIT & GOOGLE MAPS (MEDIUM EFFORT - IN PERSON) */}
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative">
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold text-[9px] uppercase tracking-wider">
                OPTION 3 • MEDIUM EFFORT
              </span>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                  <MapPin className="w-6 h-6 text-[#E31B23]" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base text-[#050505]">
                    Visit Store in Gwalior
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Pinto Park, Jaderua Gate Ke Samne, Gwalior. Genuine products & live demo.
                  </p>
                </div>
              </div>

              <a
                href={storeConfig.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#FFD400]" />
                <span>GET MAP DIRECTIONS</span>
              </a>
            </div>

            {/* OPTION 4: CONTACT FORM / INQUIRY PAGE (HIGHER EFFORT - WRITTEN SUBMISSION) */}
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative">
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold text-[9px] uppercase tracking-wider">
                OPTION 4 • HIGHER EFFORT
              </span>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-800 flex items-center justify-center shadow-xs">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base text-[#050505]">
                    Contact Form Page
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Send a detailed inquiry or feedback through our full contact form page.
                  </p>
                </div>
              </div>

              <Link
                to="/contact"
                className="w-full py-3 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>OPEN CONTACT FORM</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
