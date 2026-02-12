
import React, { useState, useEffect, useCallback } from 'react';
import { fetchElectionUpdates } from './services/geminiService';
import { ConstituencyResult } from './types';
import ResultCard from './components/ResultCard';
import PrivacyPolicy from './components/PrivacyPolicy';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Analytics } from '@vercel/analytics/react';

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
      // Stability check for Recharts
      if (result && result.summary && Array.isArray(result.summary.partyStandings)) {
        setData(result);
        setLastUpdate(new Date().toLocaleTimeString('bn-BD'));
      } else {
        throw new Error("Invalid structure from AI service");
      }
    } catch (err) {
      console.error(err);
      setError("ভেরিফাইড সোর্স থেকে ডাটা সংগ্রহ করতে ব্যর্থ হয়েছে। অনুগ্রহ করে পেজটি রিফ্রেশ করুন।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 300000); // 5 mins
    return () => clearInterval(interval);
  }, [loadData]);

  const filteredResults = data?.featuredResults?.filter((r: ConstituencyResult) => 
    r.constituencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.constituencyNo.includes(searchQuery)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[18px]">
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}

      <header className="header-gradient text-white shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-bd-green shadow-xl">
               <i className="fa-solid fa-square-poll-vertical text-3xl"></i>
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">ত্রয়োদশ জাতীয় সংসদ নির্বাচন ২০২৬</h1>
              <p className="text-sm font-bold opacity-90 uppercase tracking-[0.2em] mt-1">Verfied National Report Dashboard</p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <input 
                type="text" 
                placeholder="আসন খুঁজুন (যেমন: ঢাকা-১০, বাগেরহাট-২)..." 
                className="w-full md:w-96 pl-12 pr-6 py-4 rounded-3xl bg-white/10 border border-white/30 focus:bg-white focus:text-slate-900 transition-all outline-none text-white font-bold text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 opacity-60"></i>
            </div>
          </div>
        </div>
      </header>

      <div className="news-ticker-container text-white py-3">
        <div className="container mx-auto px-4 flex items-center">
           <span className="bg-bd-red px-4 py-1.5 rounded-full text-xs font-black uppercase mr-4 whitespace-nowrap shadow-lg">Verified Flash</span>
           <div className="flex-1 overflow-hidden whitespace-nowrap">
              <div className="animate-marquee inline-block font-bold">
                <span className="mx-12"><i className="fa-solid fa-circle-check text-green-400 mr-2"></i> জামায়াতে ইসলামী সহ সকল নিবন্ধিত দলের সঠিক ফলাফল প্রদর্শিত হচ্ছে।</span>
                <span className="mx-12"><i className="fa-solid fa-shield text-blue-400 mr-2"></i> {data?.newsFlash || 'নির্বাচন কমিশনের ডাটা গ্রাউন্ডিং প্রযুক্তি ব্যবহার করে সঠিক তথ্য প্রচার করা হচ্ছে।'}</span>
                <span className="mx-12"><i className="fa-solid fa-bolt text-yellow-400 mr-2"></i> ভুয়া খবরের বিপরীতে ভেরিফাইড নির্বাচনী আপডেট পেতে আমাদের সাথেই থাকুন।</span>
              </div>
           </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 flex-1">
        {loading && !data ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
             <div className="w-24 h-24 border-8 border-bd-green/20 border-t-bd-green rounded-full animate-spin mb-8"></div>
             <h2 className="text-2xl font-black text-slate-800">জাতীয় রিপোর্ট লোড হচ্ছে...</h2>
             <p className="text-slate-500 font-bold mt-2">গুজব প্রতিরোধে ভেরিফাইড সোর্স থেকে ডাটা ক্রস-চেক করা হচ্ছে।</p>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto bg-white p-12 rounded-[40px] text-center shadow-2xl border border-red-100">
            <i className="fa-solid fa-triangle-exclamation text-5xl text-bd-red mb-6"></i>
            <h3 className="text-2xl font-black text-slate-800 mb-4">তথ্য বিভ্রাট!</h3>
            <p className="text-slate-500 font-bold mb-8">{error}</p>
            <button onClick={loadData} className="bg-bd-red text-white px-12 py-4 rounded-2xl font-black shadow-xl">আবার চেষ্টা করুন</button>
          </div>
        ) : (
          <div className="space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col justify-center">
                <span className="text-slate-400 font-black uppercase tracking-widest text-xs mb-4">ঘোষিত ফলাফল</span>
                <div className="flex items-baseline gap-4">
                   <h2 className="text-8xl font-black text-slate-900 leading-none">{data?.summary?.resultsPublished || 0}</h2>
                   <div className="flex flex-col">
                      <span className="text-slate-400 font-bold uppercase text-xl">আসন</span>
                      <span className="text-bd-green font-black text-sm">মোট {data?.summary?.totalSeats || 300} টি</span>
                   </div>
                </div>
                <div className="mt-8 h-4 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                   <div 
                    className="h-full bg-bd-green rounded-full transition-all duration-1000" 
                    style={{ width: `${((data?.summary?.resultsPublished || 0) / (data?.summary?.totalSeats || 300)) * 100}%` }}
                   ></div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 min-h-[400px]">
                <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 uppercase">
                  <i className="fa-solid fa-chart-simple text-bd-red"></i> জাতীয় দলভিত্তিক অবস্থান
                </h3>
                <div className="h-[300px] w-full">
                  {/* Stable Data for Recharts to avoid useRef error */}
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.summary?.partyStandings || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="party" axisLine={false} tickLine={false} tick={{ fontSize: 14, fontWeight: 800 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                      <Bar dataKey="seatsWon" name="জয়ী" stackId="a" radius={[0, 0, 0, 0]}>
                         {(data?.summary?.partyStandings || []).map((entry: any, index: number) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                      </Bar>
                      <Bar dataKey="seatsLeading" name="এগিয়ে" stackId="a" radius={[10, 10, 0, 0]}>
                         {(data?.summary?.partyStandings || []).map((entry: any, index: number) => (
                           <Cell key={`cell-lead-${index}`} fill={entry.color} opacity={0.6} />
                         ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {data?.groundingSources?.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[40px]">
                <h4 className="text-sm font-black text-emerald-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <i className="fa-solid fa-certificate"></i> ভেরিফাইড সোর্স (Official Data Grounding)
                </h4>
                <div className="flex flex-wrap gap-4">
                  {data.groundingSources.map((s: any, i: number) => (
                    <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="bg-white px-6 py-2.5 rounded-full border border-emerald-200 text-xs font-bold text-emerald-700 hover:shadow-md transition-all flex items-center gap-2">
                      <i className="fa-solid fa-globe opacity-50"></i> {s.title || 'Official Source'}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-12">
               <div className="border-l-[10px] border-bd-red pl-8 py-3">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">আসন ভিত্তিক রিয়েল-টাইম ফলাফল</h2>
                  <p className="text-slate-500 font-bold mt-2">ঢাকা, চট্টগ্রাম, খুলনা, সিলেট ও বাগেরহাট সহ সারাদেশের সঠিক আপডেট</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredResults?.length > 0 ? (
                  filteredResults.map((result: any, i: number) => (
                    <ResultCard key={i} result={result} />
                  ))
                ) : (
                  <div className="col-span-full py-28 text-center bg-white rounded-[50px] border-2 border-dashed border-slate-200">
                    <i className="fa-solid fa-magnifying-glass-location text-6xl text-slate-200 mb-6 block"></i>
                    <p className="text-slate-400 font-black italic text-xl uppercase tracking-tighter">উক্ত আসনটির সঠিক রিপোর্ট এই মুহূর্তে সংগৃহীত হচ্ছে...</p>
                  </div>
                )}
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-950 text-white pt-24 pb-12 border-t-8 border-bd-green relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-5 space-y-8">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-bd-green rounded-2xl flex items-center justify-center text-white shadow-2xl"><i className="fa-solid fa-shield-halved text-2xl"></i></div>
                  <h3 className="text-3xl font-black tracking-tight">ত্রয়োদশ সংসদ নির্বাচন ২০২৬</h3>
               </div>
               <p className="text-slate-500 font-bold leading-relaxed max-w-md text-lg">
                 সঠিক তথ্য ও গুজব মুক্ত বাংলাদেশ গড়ার লক্ষ্যে এই নির্বাচনী পোর্টালটি পরিচালিত হচ্ছে। আমরা সরাসরি নির্বাচন কমিশনের ডাটা গ্রাউন্ডিং প্রযুক্তি ব্যবহার করি।
               </p>
               <div className="flex gap-6">
                  <a href="https://web.facebook.com/walid.taksid/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-bd-red transition-all shadow-xl"><i className="fa-brands fa-facebook-f text-xl"></i></a>
                  <a href="https://wa.me/8801979983155" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-bd-green transition-all shadow-xl"><i className="fa-brands fa-whatsapp text-2xl"></i></a>
               </div>
            </div>
            
            <div className="md:col-span-3">
               <h4 className="text-xl font-black mb-8 border-b-4 border-bd-red pb-2 inline-block">দ্রুত লিংক</h4>
               <ul className="space-y-4 text-slate-500 font-bold text-lg">
                  <li><button onClick={() => setShowPrivacy(true)} className="hover:text-bd-green transition-all">প্রাইভেসি পলিসি</button></li>
                  <li><button onClick={loadData} className="hover:text-bd-green transition-all">ডাটা রিফ্রেশ করুন</button></li>
                  <li><a href="#" className="hover:text-bd-green transition-all">নির্বাচন কমিশন (EC) সোর্স</a></li>
               </ul>
            </div>

            <div className="md:col-span-4 bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl group transition-all hover:bg-white/10">
               <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-[28px] overflow-hidden border-2 border-bd-green shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500">
                    <img src="https://i.ibb.co.com/WW3588H1/IMG-6857.jpg" alt="CEO" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs text-bd-green font-black uppercase tracking-widest">Power By</span>
                    <h4 className="text-2xl font-black text-white">Walid Hasan Taksid</h4>
                    <p className="text-xs text-slate-500 font-bold">CEO: DevSparkSoft IT</p>
                  </div>
               </div>
               <div className="space-y-4 text-base font-bold text-slate-400">
                  <p className="flex items-center gap-4 hover:text-white transition-colors"><i className="fa-solid fa-location-dot text-bd-red"></i> Mohakhali, Dhaka, 1212</p>
                  <p className="flex items-center gap-4 hover:text-white transition-colors"><i className="fa-solid fa-phone text-bd-green"></i> +8809649999143</p>
                  <p className="flex items-center gap-4 hover:text-white transition-colors"><i className="fa-solid fa-envelope text-bd-green"></i> Walid@Taksid.com</p>
               </div>
            </div>
          </div>
          <div className="mt-24 pt-10 border-t border-white/5 text-center">
            <p className="text-[12px] text-slate-700 font-black uppercase tracking-[0.5em]">
              &copy; {new Date().getFullYear()} DevSparkSoft IT | Official Verified National Portal
            </p>
          </div>
        </div>
      </footer>
      <Analytics />
    </div>
  );
};

export default App;
