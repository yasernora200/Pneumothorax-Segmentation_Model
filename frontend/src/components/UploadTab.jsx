import { useRef } from "react";
import { Upload, Image, FolderOpen } from "lucide-react";
import ImagePreview from "./ImagePreview";
import InfoCard from "./InfoCard";
import PatientInfo from "./PatientInfo";

const UploadTab = ({
  handleDragOver,
  handleDrop,
  handleImageUpload,
  fileInputRef,
  imagePreview,
  setImagePreview,
  setSelectedImage,
  setResults,
  analyzeImage,
  isAnalyzing,
  patientData,
  setPatientData,
}) => {
  const internalFileRef = fileInputRef || useRef(null);

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-stretch pt-4">
      {/* Left Column: Upload Area */}
      <div className="h-full">
        <div className="bg-slate-800/40 backdrop-blur-2xl rounded-[2rem] shadow-2xl p-8 border border-slate-700/50 h-full flex flex-col relative overflow-hidden group">
          
          {/* Ambient Background Glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/20">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Upload Medical Image
            </h2>
          </div>

          {/* Main Dropzone Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => internalFileRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center relative cursor-pointer"
          >
            <input
              ref={internalFileRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {/* Glowing Circular Drop Zone */}
            <div className="relative w-64 h-64 flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500">
               {/* Animated Rings */}
               <div className="absolute inset-0 border-2 border-dashed border-slate-600 rounded-full animate-[spin_10s_linear_infinite] group-hover:border-cyan-500/50 transition-colors"></div>
               <div className="absolute inset-4 border border-slate-700 rounded-full"></div>
               
               {/* Glow Effect */}
               <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

               {/* Central Icon */}
               <div className="bg-slate-900/80 p-6 rounded-3xl backdrop-blur-sm border border-slate-700 shadow-2xl relative z-10 group-hover:border-cyan-500/50 transition-colors">
                  <Image className="w-16 h-16 text-cyan-400" />
               </div>
               
               {/* Particles (CSS dots) */}
               <div className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]"></div>
               <div className="absolute bottom-10 right-10 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_10px_blue]"></div>
               <div className="absolute top-10 left-10 w-1 h-1 bg-purple-400 rounded-full shadow-[0_0_10px_purple]"></div>
            </div>

            {/* Text Content */}
            <div className="text-center z-10 mb-8">
              <h3 className="text-xl font-bold text-white mb-2">
                Drag & Drop <br/> Chest X-Ray or Click
              </h3>
              <p className="text-sm text-slate-400 font-medium">
                PNG, JPG, DICOM format • Max 10MB
              </p>
            </div>

            {/* Browse Button */}
            <button 
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2 z-10"
              onClick={(e) => {
                e.stopPropagation();
                internalFileRef.current?.click();
              }}
            >
              <FolderOpen className="w-5 h-5" />
              Browse Files
            </button>

          </div>

          {/* Image Preview Overlay (if image selected) */}
          {imagePreview && (
             <div className="absolute inset-0 z-20 bg-slate-900/95 backdrop-blur-md flex flex-col p-6 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Selected Image</h3>
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setSelectedImage(null);
                        setResults(null); 
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    Change
                  </button>
                </div>
                <ImagePreview
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                  setSelectedImage={setSelectedImage}
                  setResults={setResults}
                  analyzeImage={analyzeImage}
                  isAnalyzing={isAnalyzing}
                />
             </div>
          )}

        </div>
      </div>

      {/* Right Column: Info & Details */}
      <div className="space-y-6 flex flex-col">
        <PatientInfo
          patientData={patientData}
          setPatientData={setPatientData}
        />
        <div className="flex-1">
           <InfoCard />
        </div>
      </div>
    </div>
  );
};

export default UploadTab;
