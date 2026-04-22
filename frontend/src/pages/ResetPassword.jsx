import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();
  const API_URL = 'http://localhost:5002';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setStatus({ type: 'error', message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return setStatus({ type: 'error', message: 'Password must be at least 6 characters' });
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.put(`${API_URL}/api/users/resetpassword/${token}`, { password });
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
        message: err.response?.data?.message || 'Failed to reset password. Link may be expired.' 
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
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h1>
            <p className="text-gray-500">Please enter your new password below.</p>
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

        {status.type !== 'success' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-blue-200"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="text-sm text-gray-500 hover:text-blue-600 font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
