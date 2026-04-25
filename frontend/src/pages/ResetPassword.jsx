import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, ArrowLeft, CheckCircle, ShieldCheck, ShieldAlert, KeyRound } from 'lucide-react';
import { API_URL } from '../apiConfig';

const ResetPassword = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      setStatus({ type: 'info', message: 'Please enter your email and the OTP you received.' });
    }
  }, []);

  const getPasswordErrorMessage = (pass) => {
    if (!pass) return '';
    if (pass.length < 8) return 'Min 8 chars required';
    if (!/[A-Z]/.test(pass)) return 'Need uppercase letter';
    if (!/[a-z]/.test(pass)) return 'Need lowercase letter';
    if (!/[0-9]/.test(pass)) return 'Need a number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return 'Need special symbol';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      return setStatus({ type: 'error', message: 'Please enter a valid 6-digit OTP' });
    }

    if (password !== confirmPassword) {
      return setStatus({ type: 'error', message: 'Passwords do not match' });
    }

    const passwordError = getPasswordErrorMessage(password);
    if (passwordError) {
      return setStatus({ 
        type: 'error', 
        message: `Password: ${passwordError}` 
      });
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.put(`${API_URL}/api/users/resetpassword`, { email, otp, password });
      setStatus({ 
        type: 'success', 
        message: 'Password has been reset successfully! Redirecting to login...' 
      });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to reset password. OTP may be invalid or expired.' 
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
          <Link to="/forgot-password" title="Back to Forgot Password" className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition group mb-6">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-500">Enter the OTP sent to <b>{email || 'your email'}</b> and set your new password.</p>
          </div>
        </div>

        {status.message && (
          <div className={`p-4 rounded-xl mb-6 text-sm border flex items-start gap-3 ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 
            status.type === 'info' ? 'bg-blue-50 text-blue-700 border-blue-100' :
            'bg-red-50 text-red-700 border-red-100'
          }`}>
            {status.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
            {status.message}
          </div>
        )}

        {status.type !== 'success' && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {!location.state?.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="name@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">6-Digit OTP</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength="6"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-mono tracking-widest text-center text-xl"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
                <KeyRound className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:border-transparent outline-none transition ${
                    password && getPasswordErrorMessage(password)
                      ? 'border-amber-200 focus:ring-amber-500'
                      : 'border-gray-200 focus:ring-blue-500'
                  }`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getPasswordErrorMessage(password) ? (
                      <ShieldAlert className="w-5 h-5 text-amber-500" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {password && getPasswordErrorMessage(password) && (
                <p className="mt-1 text-xs text-amber-600 font-medium">{getPasswordErrorMessage(password)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-blue-200 mt-4"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
