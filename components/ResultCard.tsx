
import React from 'react';
import { ConstituencyResult } from '../types';

interface ResultCardProps {
  result: ConstituencyResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col h-full group">
      <div className="bg-slate-50/80 p-6 border-b border-slate-100 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-bd-green transition-colors">{result.constituencyName}</h3>
          <span className="text-[11px] font-black text-bd-green bg-green-100 px-3 py-1 rounded-full uppercase tracking-tighter mt-1 inline-block">
            {result.constituencyNo}
          </span>
        </div>
        <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-sm ${
          result.status === 'Published' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white animate-pulse'
        }`}>
          {result.status === 'Published' ? 'চূড়ান্ত' : 'চলমান'}
        </div>
      </div>
      
      <div className="p-6 space-y-4 flex-1">
        {result.candidates?.map((candidate, idx) => (
          <div key={idx} className={`relative p-4 rounded-2xl border transition-all ${
            candidate.isLeading 
              ? 'border-bd-green bg-green-50/30 ring-1 ring-bd-green/20' 
              : 'border-slate-100 bg-white'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-lg font-black leading-tight ${candidate.isLeading ? 'text-bd-green' : 'text-slate-800'}`}>
                  {candidate.name}
                </span>
                {candidate.isLeading && (
                  <i className="fa-solid fa-circle-check text-bd-green text-sm"></i>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">{candidate.symbol}</span>
            </div>
            
            <div className="flex justify-between items-end">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wide">
                {candidate.party}
              </span>
              <div className="text-right">
                <div className={`text-2xl font-black tracking-tighter ${candidate.isLeading ? 'text-bd-green' : 'text-slate-800'}`}>
                  {candidate.votes.toLocaleString('bn-BD')}
                </div>
              </div>
            </div>

            {candidate.isLeading && (
              <div className="absolute -top-3 -right-2">
                 <span className="bg-bd-red text-white text-[10px] px-3 py-1 rounded-full font-black shadow-lg ring-4 ring-white">এগিয়ে</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-slate-50/50 px-6 py-4 text-[10px] text-slate-400 font-bold border-t border-slate-100 italic flex items-center justify-between">
        <span><i className="fa-solid fa-clock-rotate-left mr-1"></i> লাইভ আপডেট</span>
        <span>{new Date().toLocaleTimeString('bn-BD')}</span>
      </div>
    </div>
  );
};

export default ResultCard;
