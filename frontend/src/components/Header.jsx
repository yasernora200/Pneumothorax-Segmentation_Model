import { Stethoscope } from "lucide-react";

const Header = ({ isLoggedIn, userData, handleLogout, setAuthMode, setShowAuthModal }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-2xl border-b border-cyan-500/30 shadow-lg shadow-cyan-500/5">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
               <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-all"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-2 rounded-xl">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent tracking-tight">
                  PneumoScan AI
                </h1>
                <p className="text-[10px] text-slate-400 font-semibold hidden sm:block">
                  Clinical Diagnostic System
                </p>
              </div>
            </div>
            
            {/* Mobile-only toggle or menu could go here */}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block bg-slate-800/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-cyan-500/30">
                  <p className="text-[10px] text-slate-400">Welcome</p>
                  <p className="text-xs font-bold text-white">
                    {userData?.name}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-lg border border-red-500/30 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 text-white font-bold text-xs rounded-lg border border-slate-600 transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setShowAuthModal(true);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-xs rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
