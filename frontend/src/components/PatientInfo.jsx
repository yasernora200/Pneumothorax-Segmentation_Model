import { User } from "lucide-react";

const PatientInfo = ({ patientData, setPatientData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl shadow-2xl p-5 sm:p-7 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2.5 sm:p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg">
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white">
          Patient Information
        </h3>
      </div>

      <div className="space-y-5">
        {/* Patient ID */}
        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">
            Patient ID
          </label>
          <input
            type="text"
            name="id"
            value={patientData.id}
            onChange={handleChange}
            placeholder="e.g. PT-00123"
            className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Patient Name */}
        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">
            Patient Name
          </label>
          <input
            type="text"
            name="name"
            value={patientData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={patientData.age}
              onChange={handleChange}
              placeholder="Years"
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={patientData.gender}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;
