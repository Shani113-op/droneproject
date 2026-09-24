import { useState } from "react";
import { Mail, Loader2, CheckCircle, XCircle } from "lucide-react";
import { sendEmailReport } from "../../services/api";

export default function EmailForm({ reportData }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, sending, success, error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    if (!reportData || !reportData.roi5YearCost) {
      setErrorMsg("Please calculate ROI first before sending the report.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      await sendEmailReport({ email, reportData });
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 rounded-xl bg-slate-900 p-6 text-white shadow-sm mt-8">
      <div className="flex items-center gap-4 flex-1">
        <Mail className="text-blue-400 h-8 w-8" />
        <div>
          <h3 className="font-bold text-lg">Email Analysis Report</h3>
          <p className="text-sm text-slate-400 mt-1">Receive a complete breakdown of the theoretical analysis straight to your inbox.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-2">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="police.chief@city.gov" 
          required
          disabled={status === 'sending' || status === 'success'}
          className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 flex-1 md:w-64"
        />
        <button 
          type="submit" 
          disabled={status === 'sending' || status === 'success'}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
        >
          {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : 
           status === 'success' ? <CheckCircle className="h-5 w-5 text-green-300" /> : 
           'Send'}
        </button>
      </form>
      {status === 'error' && <p className="w-full text-red-400 text-sm mt-2">{errorMsg}</p>}
      {status === 'idle' && errorMsg && <p className="w-full text-amber-400 text-sm mt-2">{errorMsg}</p>}
      {status === 'success' && <p className="w-full text-green-400 text-sm mt-2">Report sent successfully!</p>}
    </div>
  );
}
