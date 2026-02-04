import { Info } from "lucide-react";

const InfoCard = () => {
  return (
    <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-4">
        <Info className="w-6 h-6 text-cyan-400" />
        <h3 className="text-lg font-bold text-white">
          About Pneumothorax
        </h3>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed mb-4">
        Collapsed lung caused by air leakage between lung and chest wall.
        AI detection enables early intervention and better patient outcomes.
      </p>

      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-4 border border-cyan-500/40">
        <h4 className="font-bold text-cyan-400 mb-3 text-sm">
          Common Symptoms:
        </h4>

        <ul className="text-sm text-slate-300 space-y-2">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
            Sudden chest pain
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
            Shortness of breath
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
            Rapid heart rate
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InfoCard;
