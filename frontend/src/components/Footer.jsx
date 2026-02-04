import { Github, Mail } from "lucide-react";
const Footer = () => {
  return (
    <footer className="bg-slate-900/60 backdrop-blur-xl border-t border-slate-800/50 mt-16 py-8">
      <div className="max-w-[1600px] mx-auto px-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-white font-bold text-base mb-1">
              PneumoAI Diagnostic Suite
            </p>
            <p className="text-sm text-slate-400">
              Powered by Deep Learning • Trained on 12,047+ Medical Images
            </p>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/username/pneumoai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
