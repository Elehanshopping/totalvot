
import React from 'react';
import { ConstituencyResult } from '../types';

interface ResultCardProps {
  result: ConstituencyResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden result-card-hover flex flex-col h-full">
      <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-800 leading-tight">{result.constituencyName}</h3>
          <span className="text-xs font-semibold text-bd-green bg-green-50 px-2 py-0.5 rounded uppercase tracking-tighter">
            {result.constituencyNo}
          </span>
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
          result.status === 'Published' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white animate-pulse'
        }`}>
          {result.status === 'Published' ? 'ঘোষিত' : 'গণনা'}
        </div>
      </div>
      
      <div className="p-4 space-y-3 flex-1">
        {result.candidates.map((candidate, idx) => (
          <div key={idx} className={`relative group p-3 rounded-xl border transition-all ${
            candidate.isLeading 
              ? 'border-bd-green bg-green-50/50 shadow-sm' 
              : 'border-slate-100 bg-white hover:border-slate-300'
          }`}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${candidate.isLeading ? 'text-bd-green' : 'text-slate-700'}`}>
                  {candidate.name}
                </span>
                {candidate.isLeading && (
                  <i className="fa-solid fa-circle-check text-bd-green text-xs"></i>
                )}
              </div>
              <span className="text-xs font-medium text-slate-400">{candidate.symbol}</span>
            </div>
            
            <div className="flex justify-between items-end">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                {candidate.party}
              </span>
              <div className="text-right">
                <div className={`text-lg font-black ${candidate.isLeading ? 'text-bd-green' : 'text-slate-800'}`}>
                  {candidate.votes.toLocaleString()}
                </div>
              </div>
            </div>

            {candidate.isLeading && (
              <div className="absolute -top-2 -right-1">
                 <span className="bg-bd-red text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm">এগিয়ে</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-slate-50 px-4 py-2 text-[10px] text-slate-400 font-medium border-t border-slate-100 italic">
        সর্বশেষ আপডেট: {new Date().toLocaleTimeString('bn-BD')}
      </div>
    </div>
  );
};

export default ResultCard;
