import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { authApi } from '../api/queries';
import { useAuthStore } from '../store/authStore';
import Card from '../components/Card';
import Button from '../components/Button';
import Field from '../components/Field';
import ErrorBanner from '../components/ErrorBanner';
import { cx } from '../utils/format';

export default function Register() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setSession } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const registerMutation = useMutation({
    mutationFn: (data) => authApi.register(data),
    onSuccess: (data) => {
      setSession(data.token, data.user);
      queryClient.invalidateQueries();
      navigate('/', { replace: true });
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Registration failed');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Valid email is required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-moss text-white text-2xl font-black mb-4">
            CP
          </div>
          <h1 className="text-3xl font-black text-ink mb-2">CareerPilot</h1>
          <p className="text-ink/60">Join our AI-powered internship platform</p>
        </div>

        {error && <ErrorBanner message={error} onClose={() => setError('')} variant="error" />}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <Field
              label="Full Name"
              placeholder="John Doe"
              icon={User}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            {/* Email */}
            <Field
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-ink mb-2">
                Password
                <span className="text-coral ml-1">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-ink/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss bg-white text-ink"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-ink/50 hover:text-ink transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-ink/50 mt-1">Must be at least 6 characters</p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-ink/60">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-moss font-bold hover:text-moss/80 transition"
              >
                Sign in
              </button>
            </p>
          </div>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-4 bg-blue-50 border-blue-200">
          <p className="text-xs font-bold uppercase text-blue-700 mb-2">Try Demo First</p>
          <p className="text-sm text-blue-700">
            Email: <span className="font-mono font-bold">demo@careerpilot.ai</span>
          </p>
          <p className="text-sm text-blue-700">
            Password: <span className="font-mono font-bold">Password@123</span>
          </p>
          <Button
            onClick={() => {
              setFormData({
                name: 'Demo User',
                email: 'demo@careerpilot.ai',
                password: 'Password@123'
              });
              navigate('/login');
            }}
            variant="secondary"
            size="sm"
            className="w-full mt-3"
          >
            Use Demo Account
          </Button>
        </Card>
      </div>
    </div>
  );
}
