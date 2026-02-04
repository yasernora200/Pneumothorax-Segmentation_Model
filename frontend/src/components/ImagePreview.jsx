import { CheckCircle2, Loader2, Brain, ChevronRight } from "lucide-react";

const ImagePreview = ({
  imagePreview,
  setImagePreview,
  setSelectedImage,
  setResults,
  analyzeImage,
  isAnalyzing,
}) => {
  if (!imagePreview) return null;

  return (
    <div className="mt-8 space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Image Ready for Analysis
        </p>

        <button
          onClick={() => {
            setImagePreview(null);
            setSelectedImage(null);
            setResults(null);
          }}
          className="text-sm text-red-400 hover:text-red-300 font-bold transition-colors"
        >
          Remove
        </button>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
        <img
          src={imagePreview}
          alt="Preview"
          className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl border-2 border-slate-700"
        />
      </div>

      <button
        onClick={analyzeImage}
        disabled={isAnalyzing}
        className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/80 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative flex items-center justify-center gap-3">
          {isAnalyzing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Brain className="w-6 h-6" />
              Start AI Analysis
              <ChevronRight className="w-6 h-6" />
            </>
          )}
        </span>
      </button>
    </div>
  );
};

export default ImagePreview;
