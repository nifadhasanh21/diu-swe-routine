import React from 'react';
import { Download, Image, Printer } from 'lucide-react';
import { downloadAsPDF, downloadAsPNG, printRoutine } from '../lib/download';

export default function DownloadButtons({ elementId, filename }) {
  return (
    <div className="flex flex-wrap gap-2 no-print">
      <button
        onClick={() => downloadAsPDF(elementId, filename)}
        className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold shadow transition"
      >
        <Download className="w-3.5 h-3.5 text-emerald-400" />
        <span>Download PDF</span>
      </button>
      <button
        onClick={() => downloadAsPNG(elementId, filename)}
        className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold shadow transition"
      >
        <Image className="w-3.5 h-3.5 text-emerald-400" />
        <span>Download PNG</span>
      </button>
      <button
        onClick={printRoutine}
        className="flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-sm transition"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>Print</span>
      </button>
    </div>
  );
}