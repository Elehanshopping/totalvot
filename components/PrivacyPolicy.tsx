
import React from 'react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500">
        <div className="bg-bd-green p-10 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <i className="fa-solid fa-shield-check text-9xl"></i>
          </div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
               <i className="fa-solid fa-lock-keyhole text-2xl"></i>
            </div>
            <div>
               <h2 className="text-3xl font-black tracking-tighter">প্রাইভেসি পলিসি</h2>
               <p className="text-xs font-bold text-white/70 uppercase tracking-widest mt-1">ত্রয়োদশ জাতীয় সংসদ নির্বাচন ২০২৬</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110 active:scale-90 relative z-10">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <div className="p-10 md:p-14 space-y-10 text-slate-700 max-h-[65vh] overflow-y-auto scroll-smooth custom-scrollbar">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="w-8 h-8 bg-bd-green/10 text-bd-green rounded-lg flex items-center justify-center font-black">১</span>
               <h3 className="text-xl font-black text-slate-800">অটোমেটিক ডাটা কালেকশন</h3>
            </div>
            <p className="text-base leading-relaxed font-medium pl-11">
              এই পোর্টালটি ১২ ফেব্রুয়ারি ২০২৬ অনুষ্ঠিত ত্রয়োদশ জাতীয় সংসদ নির্বাচনের ফলাফল এবং রিপোর্টগুলো এআই (Gemini AI) প্রযুক্তির মাধ্যমে অটোমেটিক ভাবে সংগ্রহ এবং আপডেট করে। আমরা কোনো ব্যবহারকারীর ব্যক্তিগত তথ্য ম্যানুয়ালি সংগ্রহ করি না।
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="w-8 h-8 bg-bd-green/10 text-bd-green rounded-lg flex items-center justify-center font-black">২</span>
               <h3 className="text-xl font-black text-slate-800">তথ্যের নির্ভুলতা</h3>
            </div>
            <p className="text-base leading-relaxed font-medium pl-11">
              আমাদের সিস্টেমটি ১২ ফেব্রুয়ারি ২০২৬ এর সকল রিপোর্ট এবং ফলাফল রিয়েল-টাইম ডাটা গ্রাউন্ডিংয়ের মাধ্যমে সরবরাহ করে। তথ্যের যেকোনো সূক্ষ্ম পরিবর্তনের জন্য আমরা নির্বাচন কমিশনের অফিশিয়াল তথ্যের সাথে মিলিয়ে দেখার পরামর্শ দিচ্ছি।
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="w-8 h-8 bg-bd-green/10 text-bd-green rounded-lg flex items-center justify-center font-black">৩</span>
               <h3 className="text-xl font-black text-slate-800">ডেভলপার এবং সিকিউরিটি</h3>
            </div>
            <p className="text-base leading-relaxed font-medium pl-11">
              সিস্টেমটি <strong>DevSparkSoft IT</strong> দ্বারা পরিচালিত এবং এর সকল ডাটা সিকিউরিটি Walid Hasan Taksid নিশ্চিত করেন। কোনো অননুমোদিত ব্যবহারের ক্ষেত্রে কঠোর ব্যবস্থা নেওয়া হবে।
            </p>
          </section>

          <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-3">
            <h4 className="text-lg font-black text-bd-red">জরুরি যোগাযোগ:</h4>
            <div className="grid md:grid-cols-2 gap-4">
               <div className="flex items-center gap-3 font-bold text-sm">
                  <i className="fa-solid fa-envelope text-bd-red"></i> Walid@Taksid.com
               </div>
               <div className="flex items-center gap-3 font-bold text-sm">
                  <i className="fa-solid fa-phone text-bd-red"></i> +8809649999143
               </div>
            </div>
          </section>
        </div>
        <div className="p-8 border-t border-slate-100 bg-white flex justify-end">
          <button 
            onClick={onClose}
            className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black shadow-2xl hover:bg-bd-green transition-all hover:scale-105 active:scale-95"
          >
            আমি সম্মত হয়েছি
          </button>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #006a4e;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
