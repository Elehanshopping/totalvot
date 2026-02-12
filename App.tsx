
import React, { useState, useEffect, useCallback } from 'react';
import { fetchElectionUpdates } from './services/geminiService';
import { ConstituencyResult } from './types';
import ResultCard from './components/ResultCard';
import PrivacyPolicy from './components/PrivacyPolicy';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const App: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString('bn-BD'));

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchElectionUpdates();
      setData(result);
      setLastUpdate(new Date().toLocaleTimeString('bn-BD'));
    } catch (err) {
      setError("সারাদেশের ত্রয়োদশ সংসদ নির্বাচনের সঠিক তথ্য সংগ্রহ করতে সমস্যা হচ্ছে। অনুগ্রহ করে ইন্টারনেট কানেকশন চেক করুন।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 180000); // 3 minutes for stability
    return () => clearInterval(interval);
  }, [loadData]);

  const filteredResults = data?.featuredResults.filter((r: ConstituencyResult) => 
    r.constituencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.constituencyNo.includes(searchQuery)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}

      {/* Modern Branded Header */}
      <header className="header-gradient text-white shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="relative group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="absolute -inset-1 bg-white/30 rounded-full blur group-hover:blur-md transition-all"></div>
              <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center text-bd-green shadow-xl border-2 border-white/40 overflow-hidden">
                 <i className="fa-solid fa-flag-checkered text-2xl"></i>
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black tracking-tight leading-none uppercase">ত্রয়োদশ জাতীয় সংসদ নির্বাচন ২০২৬</h1>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="bg-bd-red text-white text-[10px] px-2.5 py-1 rounded-md font-black animate-pulse shadow-md uppercase">National Live Reports</span>
                <span className="text-xs font-semibold text-white/90 border-l border-white/20 pl-3 tracking-wide">
                  Developed by <span className="text-white font-black underline decoration-white/30">DevSparkSoft IT</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 md:mt-0 flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 group">
              <input 
                type="text" 
                placeholder="যে কোন আসন খুঁজুন (উদা: ঢাকা-১০)..." 
                className="w-full md:w-80 pl-11 pr-5 py-3 rounded-2xl bg-white/15 border border-white/20 focus:bg-white focus:text-slate-800 transition-all outline-none text-white placeholder-white/40 text-sm shadow-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:text-bd-green"></i>
            </div>
          </div>
        </div>
      </header>

      {/* Real-time Ticker */}
      <div className="news-ticker-container text-white py-2 flex items-center border-b border-bd-red/30 shadow-lg">
        <div className="bg-bd-red px-6 py-1.5 text-xs font-black uppercase skew-x-[-12deg] ml-5 z-10 shadow-[5px_0_15px_rgba(244,42,65,0.4)] whitespace-nowrap">সর্বশেষ আপডেট</div>
        <div className="flex-1 overflow-hidden whitespace-nowrap relative">
          <div className="animate-marquee inline-block text-sm font-semibold tracking-wide">
            <span className="mx-10"><i className="fa-solid fa-bolt text-yellow-400 mr-2"></i> {data?.newsFlash || '১২ ফেব্রুয়ারি অনুষ্ঠিত নির্বাচনের সকল আসনের সঠিক রিপোর্ট সংগ্রহ করা হচ্ছে...'}</span>
            <span className="mx-10"><i className="fa-solid fa-circle-check text-green-400 mr-2"></i> সারাদেশের ৩০০ আসনের ডাটা এখন এই পোর্টালে অটোমেটিক আপডেট হচ্ছে।</span>
            <span className="mx-10"><i className="fa-solid fa-shield text-bd-red mr-2"></i> সঠিক এবং তথ্যনির্ভর নির্বাচনের ফলাফলের জন্য আমাদের সঙ্গেই থাকুন।</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 md:py-12 flex-1">
        {loading && !data ? (
          <div className="flex flex-col items-center justify-center min-h-[55vh] space-y-8">
             <div className="relative w-32 h-32">
               <div className="absolute inset-0 border-8 border-bd-green/10 rounded-full"></div>
               <div className="absolute inset-0 border-8 border-t-bd-green border-r-bd-red rounded-full animate-spin"></div>
               <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center shadow-inner">
                 <i className="fa-solid fa-earth-asia text-bd-green text-3xl animate-pulse"></i>
               </div>
             </div>
             <div className="text-center">
               <h2 className="text-2xl font-black text-slate-800 tracking-tight">সারাদেশের সঠিক নির্বাচনী তথ্য লোড হচ্ছে...</h2>
               <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">National Level Real-time Data Grounding System</p>
             </div>
          </div>
        ) : error ? (
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 p-10 rounded-[40px] text-center shadow-2xl">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-bd-red">
              <i className="fa-solid fa-triangle-exclamation text-4xl"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3 uppercase">তথ্য সংগ্রহে ত্রুটি</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">{error}</p>
            <button onClick={loadData} className="bg-bd-red text-white px-10 py-3.5 rounded-2xl font-black hover:bg-red-700 transition-all shadow-xl shadow-red-500/20">আবার চেষ্টা করুন</button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Analysis Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 flex flex-col gap-8">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden group">
                  <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-5">জাতীয় ফলাফল একনজরে</h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-7xl font-black text-slate-900 tracking-tighter">{data?.summary.resultsPublished || 0}</span>
                    <span className="text-slate-400 font-bold uppercase text-lg">আসন ঘোষিত</span>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <div className="text-xs font-black text-bd-green bg-green-50 px-4 py-1.5 rounded-full border border-green-100 uppercase">মোট আসন: {data?.summary.totalSeats || 300}</div>
                  </div>
                  <div className="mt-4 w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200 p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-bd-green transition-all duration-1000 ease-out rounded-full shadow-lg"
                      style={{ width: `${((data?.summary.resultsPublished || 0) / (data?.summary.totalSeats || 300)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[32px] shadow-2xl border border-slate-800 text-white flex-1 relative">
                  <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-8 flex justify-between items-center relative z-10">
                    <span>জাতীয় দলভিত্তিক অবস্থান</span>
                    <i className="fa-solid fa-chart-simple text-bd-red"></i>
                  </h3>
                  <div className="space-y-6 relative z-10">
                    {data?.summary.partyStandings.map((party: any, i: number) => (
                      <div key={i} className="group">
                        <div className="flex justify-between items-end mb-2.5">
                          <div className="flex items-center gap-4">
                             <div className="w-3.5 h-3.5 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.2)]" style={{ backgroundColor: party.color }}></div>
                             <span className="font-bold text-base tracking-tight">{party.party}</span>
                          </div>
                          <div className="text-right">
                             <span className="text-2xl font-black">{party.seatsWon + party.seatsLeading}</span>
                             <span className="text-[10px] text-slate-500 font-black ml-1.5 uppercase">আসন</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-1000 shadow-lg"
                            style={{ 
                              backgroundColor: party.color,
                              width: `${((party.seatsWon + party.seatsLeading) / (data.summary.totalSeats || 300)) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Visualization */}
              <div className="lg:col-span-8 bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col min-h-[500px]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">জাতীয় সংসদ নির্বাচন গ্রাফ ২০২৬</h2>
                    <p className="text-sm text-slate-400 font-bold mt-1">১২ ফেব্রুয়ারি ২০২৬: সারাদেশের দলভিত্তিক প্রজেকশন</p>
                  </div>
                </div>
                
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.summary.partyStandings} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="party" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 13, fontWeight: 800 }} 
                        dy={15}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc', radius: 10 }}
                        contentStyle={{ 
                          borderRadius: '24px', 
                          border: 'none', 
                          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                          padding: '16px'
                        }}
                      />
                      <Bar dataKey="seatsWon" name="নিশ্চিত" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="seatsLeading" name="এগিয়ে" stackId="a" radius={[12, 12, 0, 0]}>
                        {data?.summary.partyStandings.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Verification Sources */}
            {data?.groundingSources?.length > 0 && (
              <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl">
                <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-link"></i> ভেরিফাইড ডাটা সোর্স (স্বয়ংক্রিয়ভাবে সংগৃহীত)
                </h4>
                <div className="flex flex-wrap gap-4">
                  {data.groundingSources.map((source: any, idx: number) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-blue-200 transition-all hover:scale-105"
                    >
                      <i className="fa-solid fa-earth-americas opacity-70"></i> {source.title || 'Source ' + (idx + 1)}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Results Grid - National Scale */}
            <section className="relative pt-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-5 border-l-[6px] border-bd-red pl-8">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">আসন ভিত্তিক জাতীয় ফলাফল</h2>
                  <p className="text-slate-500 font-bold mt-2">ঢাকা, চট্টগ্রাম, খুলনা, সিলেট সহ সারাদেশের গুরুত্বপূর্ণ আসনের সঠিক রিপোর্ট</p>
                </div>
                <div className="px-6 py-2 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                   {filteredResults?.length || 0} টি আসন প্রদর্শিত
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredResults?.length > 0 ? (
                  filteredResults.map((result: any, i: number) => (
                    <ResultCard key={i} result={result} />
                  ))
                ) : (
                  <div className="col-span-full py-28 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                    <i className="fa-solid fa-magnifying-glass-location text-5xl text-slate-200 mb-6 block"></i>
                    <p className="text-slate-400 font-black italic text-lg uppercase tracking-tight">উক্ত আসনটির সঠিক রিপোর্ট পাওয়া যায়নি</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Developer Footer - Branded & Professional */}
      <footer className="bg-slate-950 text-white pt-24 pb-12 border-t-8 border-bd-green relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-bd-green via-bd-red to-bd-green"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-5 space-y-8">
              <div className="flex items-center gap-4 group">
                <div className="w-14 h-14 bg-bd-green rounded-[20px] flex items-center justify-center text-white shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <i className="fa-solid fa-shield-heart text-2xl"></i>
                </div>
                <div>
                   <h3 className="text-3xl font-black tracking-tighter">ত্রয়োদশ সংসদ নির্বাচন</h3>
                   <p className="text-bd-red text-[11px] font-black uppercase tracking-[0.3em]">১২ ফেব্রুয়ারি ২০২৬ রিপোর্ট</p>
                </div>
              </div>
              <p className="text-slate-500 text-base leading-relaxed font-bold max-w-md">
                সঠিক নির্বাচনী রিপোর্ট এবং রিয়েল-টাইম ডাটা জনস্বার্থে প্রচারের জন্য এই প্ল্যাটফর্মটি ডেভলপ করা হয়েছে। আমরা ফেইক নিউজ মুক্ত বাংলাদেশ গড়ার লক্ষ্যে কাজ করছি।
              </p>
              <div className="flex gap-5">
                <a 
                  href="https://web.facebook.com/walid.taksid/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-bd-green transition-all hover:scale-110 shadow-lg"
                >
                  <i className="fa-brands fa-facebook-f text-lg"></i>
                </a>
                <a 
                  href="https://wa.me/8801979983155" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-bd-green transition-all hover:scale-110 shadow-lg"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                </a>
              </div>
            </div>

            <div className="md:col-span-3 space-y-8">
              <h4 className="text-xl font-black text-white relative inline-block">
                দ্রুত লিংক
                <span className="absolute -bottom-2 left-0 w-3/4 h-1 bg-bd-red rounded-full"></span>
              </h4>
              <ul className="space-y-4 text-slate-400 text-sm font-black">
                <li><button onClick={() => setShowPrivacy(true)} className="hover:text-bd-green flex items-center gap-3 transition-all hover:translate-x-2"><i className="fa-solid fa-lock text-[10px]"></i> প্রাইভেসি পলিসি</button></li>
                <li><button onClick={loadData} className="hover:text-bd-green flex items-center gap-3 transition-all hover:translate-x-2"><i className="fa-solid fa-arrows-rotate text-[10px]"></i> ডাটা রিফ্রেশ করুন</button></li>
                <li><a href="#" className="hover:text-bd-green flex items-center gap-3 transition-all hover:translate-x-2"><i className="fa-solid fa-arrow-right-long text-[10px]"></i> নির্বাচনী নিউজ রিপোর্ট</a></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <div className="bg-slate-900/80 backdrop-blur-xl p-10 rounded-[40px] border border-slate-800 shadow-2xl relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-bd-red/10 rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="flex items-center gap-6 mb-8 relative z-10">
                   <div className="relative">
                     <div className="w-20 h-20 rounded-[24px] overflow-hidden border-2 border-bd-green shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500 bg-slate-800">
                        <img 
                          src="https://i.ibb.co.com/WW3588H1/IMG-6857.jpg" 
                          alt="Walid Hasan Taksid" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                     </div>
                     <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-900 rounded-full shadow-lg"></div>
                   </div>
                   <div>
                     <p className="text-[10px] text-bd-green font-black uppercase tracking-[0.2em] mb-1">Power By</p>
                     <p className="text-xl font-black text-white group-hover:text-bd-red transition-colors">Walid Hasan Taksid</p>
                     <p className="text-[10px] text-slate-500 font-bold">CEO: DevSparkSoft IT</p>
                   </div>
                </div>
                
                <div className="space-y-4 text-[13px] font-bold text-slate-400 relative z-10">
                  <p className="flex items-center gap-4 transition-colors hover:text-white"><i className="fa-solid fa-location-dot text-bd-red w-4"></i> Mohakhali, Dhaka, 1212</p>
                  <p className="flex items-center gap-4 transition-colors hover:text-white"><i className="fa-solid fa-envelope text-bd-red w-4"></i> Walid@Taksid.com</p>
                  <div className="pt-5 border-t border-slate-800 mt-4">
                    <div className="bg-bd-green/10 p-4 rounded-2xl border border-bd-green/20 group-hover:bg-bd-green/20 transition-all">
                      <p className="text-xs text-bd-green uppercase tracking-widest mb-1">Helpline Support</p>
                      <p className="text-lg font-black text-white flex items-center gap-3">
                        <i className="fa-solid fa-phone-volume animate-bounce text-bd-green"></i> +8809649999143
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-900 mt-20 pt-10 text-center">
            <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.4em]">
              &copy; {new Date().getFullYear()} <span className="text-slate-400">DevSparkSoft IT</span> | Bangladesh 13th Election Analytics Portal
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
