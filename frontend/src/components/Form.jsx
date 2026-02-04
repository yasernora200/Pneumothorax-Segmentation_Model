const Form = ({authMode,authForm,setAuthForm,handleAuthSubmit,}) => {
  return (
    <form onSubmit={handleAuthSubmit} className="space-y-2">
      {authMode === "signup" && (
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={authForm.name}
            onChange={(e) =>
              setAuthForm({ ...authForm, name: e.target.value })
            }
            className="w-full px-4 py-2 text-sm bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
            placeholder="Dr. John Smith"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1">
          Email
        </label>
        <input
          type="email"
          required
          value={authForm.email}
          onChange={(e) =>
            setAuthForm({ ...authForm, email: e.target.value })
          }
          className="w-full px-4 py-2 text-sm bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
          placeholder="doctor@hospital.com"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1">
          Password
        </label>
        <input
          type="password"
          required
          value={authForm.password}
          onChange={(e) =>
            setAuthForm({ ...authForm, password: e.target.value })
          }
          className="w-full px-4 py-2 text-sm bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
          placeholder="••••••••"
        />
      </div>

      {authMode === "signup" && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Specialty
            </label>
            <select
              required
              value={authForm.specialty}
              onChange={(e) =>
                setAuthForm({
                  ...authForm,
                  specialty: e.target.value,
                })
              }
              className="w-full px-4 py-2 text-sm bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-colors"
            >
              <option value="">Select</option>
              <option value="Radiology">Radiology</option>
              <option value="Emergency Medicine">Emergency</option>
              <option value="Pulmonology">Pulmonology</option>
              <option value="Internal Medicine">Internal</option>
              <option value="Surgery">Surgery</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Hospital ID
            </label>
            <input
              type="text"
              value={authForm.hospitalId}
              onChange={(e) =>
                setAuthForm({
                  ...authForm,
                  hospitalId: e.target.value,
                })
              }
              className="w-full px-4 py-2 text-sm bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="HOS-12345"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 transition-all mt-4"
      >
        {authMode === "login" ? "Login" : "Create Account"}
      </button>
    </form>
  );
};

export default Form;
