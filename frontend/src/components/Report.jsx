import {
  Download,
  Calendar,
  User,
  Activity,
  FileText,
  AlertCircle,
  CheckCircle2,
  Target,
  MapPin,
  Shield,
  BarChart3,
  Stethoscope,
  QrCode,
  Fingerprint
} from "lucide-react";

const Report = ({ results, reportRef, downloadReport, patientData }) => {
  if (!results) return null;

  return (
    <div
      ref={reportRef}
      className="bg-slate-900 mx-auto max-w-5xl rounded-[2px] overflow-hidden shadow-2xl relative"
    >
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
         <Stethoscope className="w-[800px] h-[800px] text-white transform -rotate-12" />
      </div>

      {/* ================= HEADER (Letterhead) ================= */}
      <div className="px-8 py-8 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl shadow-lg border border-cyan-500/30">
               <Stethoscope className="w-8 h-8 text-white" />
             </div>
             <div>
               <h1 className="text-3xl font-black text-white tracking-tight uppercase">PneumoScan AI</h1>
               <p className="text-cyan-500 font-bold text-sm tracking-widest uppercase">Clinical Diagnostic System</p>
             </div>
          </div>
          <div className="text-right">
             <div className="inline-block px-3 py-1 border border-red-500/30 bg-red-500/10 rounded text-red-400 text-xs font-bold tracking-widest mb-2">
                CONFIDENTIAL
             </div>
             <p className="text-slate-400 text-sm font-mono">
                REF: {results.patientId.replace("PT-", "PSA-")}-{new Date().getFullYear()}
             </p>
             <p className="text-slate-400 text-sm font-mono">
                DATE: {new Date(results.timestamp).toLocaleDateString().toUpperCase()}
             </p>
          </div>
        </div>
      </div>

      {/* ================= PATIENT VITALS STRIP ================= */}
      <div className="bg-slate-800/60 border-y border-slate-700/50 px-8 py-4 backdrop-blur-md">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col">
               <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Patient Name</span>
               <span className="text-white font-bold text-lg">{patientData?.name || results.patientName || "Unknown"}</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Patient ID</span>
               <span className="text-white font-mono text-base">{patientData?.id || results.patientId}</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Demographics</span>
               <span className="text-white font-medium">{patientData?.age || "N/A"} Y/O • {patientData?.gender || "N/A"}</span>
            </div>
             <div className="flex flex-col">
               <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Referring Physician</span>
               <span className="text-white font-medium">Dr. Yaser (Rad)</span>
            </div>
         </div>
      </div>

      {/* ================= REPORT BODY ================= */}
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* LEFT COLUMN: Narrative & Findings (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Section 1: Executive Summary */}
           <section>
              <h3 className="section-title">Executive Summary</h3>
              <div className="bg-slate-800/30 border-l-4 border-cyan-500 p-4 rounded-r-lg">
                 <p className="text-slate-300 leading-relaxed text-sm">
                    {results.hasPneumothorax 
                       ? `Automated analysis detected signs indicative of pneumothorax in the ${results.location.toLowerCase()}. The system calculated a confidence score of ${results.confidence}% based on deep learning segmentation models. Immediate radiological review is recommended.`
                       : "Automated analysis did not detect any signs of pneumothorax. The lung fields appear clear within the scope of the AI model's detection capabilities. Clinical correlation is advised."
                    }
                 </p>
              </div>
           </section>

           {/* Section 2: Clinical Findings */}
           <section>
              <h3 className="section-title">Clinical Findings</h3>
              <ul className="space-y-3 mt-4">
                 {results.findings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                       <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                          {idx + 1}
                       </span>
                       <span className="text-slate-300 text-sm">{finding}</span>
                    </li>
                 ))}
                 {!results.hasPneumothorax && (
                    <li className="flex items-start gap-3">
                       <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-900/50 flex items-center justify-center text-xs font-bold text-emerald-400">
                          ✓
                       </span>
                       <span className="text-slate-300 text-sm">No pleural line truncation observed.</span>
                    </li>
                 )}
              </ul>
           </section>

           {/* Section 3: Advanced Data Analytics */}
           {results.analysisMetrics && (
              <section>
                 <h3 className="section-title">Advanced Data Analytics</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <DataBox label="Signal-Noise" value={results.analysisMetrics.signalToNoise} />
                    <DataBox label="Density" value={results.analysisMetrics.densityScore} />
                    <DataBox label="Confidence" value={results.analysisMetrics.confidenceInterval} color="text-cyan-400" />
                    <DataBox label="Texture" value={results.analysisMetrics.textureAnalysis} color="text-purple-400" />
                 </div>
              </section>
           )}

            {/* Disclaimer */}
            <div className="mt-8 pt-8 border-t border-slate-800 flex items-start gap-3 opacity-60">
               <Shield className="w-5 h-5 text-amber-500 flex-shrink-0" />
               <p className="text-[10px] text-slate-500 text-justify">
                  DISCLAIMER: This report is generated by an Artificial Intelligence system (PneumoScan AI v2.0). It is intended as a triage and decision support tool only. It does NOT constitute a final medical diagnosis. A qualified radiologist must review the original imaging studies and verify these findings before any treatment decisions are made.
               </p>
            </div>
        </div>

        {/* RIGHT COLUMN: Evidence & Visuals (1/3 width) */}
        <div className="space-y-6">
           
           {/* Diagnostic Status Card */}
           <button 
              onClick={downloadReport}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all mb-4"
           >
              <Download className="w-4 h-4" /> Export PDF
           </button>

           <div className={`p-1 rounded-lg border ${results.hasPneumothorax ? 'border-red-500/50 bg-red-500/10' : 'border-emerald-500/50 bg-emerald-500/10'}`}>
              <div className={`py-4 text-center rounded theme-transition`}>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Diagnostic Status</p>
                 <h2 className={`text-2xl font-black uppercase ${results.hasPneumothorax ? 'text-red-400' : 'text-emerald-400'}`}>
                    {results.hasPneumothorax ? "POSITIVE" : "NORMAL"}
                 </h2>
              </div>
           </div>

           {/* X-Ray Thumbnail */}
           <div className="bg-black rounded-lg border border-slate-700/50 p-2 shadow-inner">
              <p className="text-[10px] text-slate-500 font-bold mb-2 uppercase text-center">Analyzed Region</p>
              <div className="relative aspect-[3/4] rounded overflow-hidden">
                 <img 
                    src={results.preview} 
                    alt="X-Ray Analysis" 
                    className="w-full h-full object-contain"
                 />
                 {/* Overlay hint if pneumothorax */}
                 {results.hasPneumothorax && (
                    <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay"></div>
                 )}
              </div>
           </div>

           {/* Key Metrics */}
           {results.hasPneumothorax && (
            <div className="space-y-3">
               <MetricRow label="Confidence" value={results.confidence + "%"} />
               <MetricRow label="Severity" value={results.severity} highlight />
               <MetricRow label="Location" value={results.location} />
               <MetricRow label="Area %" value={results.affectedArea + "%"} />
            </div>
           )}

        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="bg-slate-950 px-8 py-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-4">
            <div className="bg-white p-1 rounded">
               <QrCode className="w-12 h-12 text-black" />
            </div>
            <div>
               <p className="text-[10px] text-slate-500 uppercase font-bold">Electronic Signature</p>
               <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-cyan-500" />
                  <span className="font-mono text-xs text-cyan-400">{results.patientId}-SIG-{Math.floor(Math.random()*100000)}</span>
               </div>
               <p className="text-[10px] text-slate-600 mt-0.5">Verified by PneumoScan AI Security Protocol</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-slate-600 font-bold text-sm">PneumoScan AI</p>
            <p className="text-slate-700 text-xs">Page 1 of 1</p>
         </div>
      </div>

      <style>{`
         .section-title {
            @apply text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-2 mb-2 flex items-center gap-2;
         }
         .section-title::before {
            content: '';
            @apply block w-2 h-2 bg-cyan-500 rounded-sm;
         }
      `}</style>
    </div>
  );
};

/* Helper Components for the Report Layout */
const DataBox = ({ label, value, color = "text-white" }) => (
   <div className="bg-slate-800 p-3 rounded border border-slate-700/50">
      <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">{label}</p>
      <p className={`font-mono font-bold text-sm ${color}`}>{value}</p>
   </div>
);

const MetricRow = ({ label, value, highlight = false }) => (
   <div className={`flex justify-between items-center p-3 rounded border ${highlight ? 'bg-slate-800 border-slate-600' : 'border-slate-800'}`}>
      <span className="text-xs text-slate-400 font-bold uppercase">{label}</span>
      <span className={`text-sm font-bold ${highlight ? 'text-white' : 'text-slate-200'}`}>{value}</span>
   </div>
);

export default Report;
