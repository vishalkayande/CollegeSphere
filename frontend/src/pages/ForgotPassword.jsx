import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [developmentOTP, setDevelopmentOTP] = useState(''); // For development mode
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5002';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await axios.post(`${API_URL}/api/users/forgotpassword`, { email });
      setStatus({ 
        type: 'success', 
        message: 'A 6-digit OTP has been sent to your email.' 
      });
      
      // For development: Show the OTP if returned by backend
      if (res.data.developmentOTP) {
        setDevelopmentOTP(res.data.developmentOTP);
      }

      // After a short delay, redirect to reset password page
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 3000);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Something went wrong. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 relative" style={{ backgroundImage: 'url("/background.jpg")' }}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
        <div className="mb-8">
          <Link to="/login" className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition group mb-6">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
            <p className="text-gray-500">Enter your email and we'll send you a 6-digit OTP to reset your password.</p>
          </div>
        </div>

        {status.message && (
          <div className={`p-4 rounded-xl mb-6 text-sm border flex items-start gap-3 ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {status.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
            {status.message}
          </div>
        )}

        {status.type === 'success' && developmentOTP && (
          <div className="bg-yellow-50 p-4 rounded-xl mb-6 border border-yellow-100">
            <p className="text-xs font-bold text-yellow-800 uppercase mb-2">Development OTP (Email not configured):</p>
            <p className="text-2xl font-mono font-bold text-blue-600 tracking-widest text-center">
              {developmentOTP}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="name@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || status.type === 'success'}
            />
          </div>

          <button
            type="submit"
            disabled={loading || status.type === 'success'}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-blue-200"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
