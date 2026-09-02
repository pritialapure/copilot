import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { authApi } from '../api/queries';
import { useAuthStore } from '../store/authStore';
import Card from '../components/Card';
import Button from '../components/Button';
import Field from '../components/Field';
import ErrorBanner from '../components/ErrorBanner';

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setSession } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const loginMutation = useMutation({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (data) => {
      setSession(data.token, data.user);
      queryClient.invalidateQueries();
      navigate('/', { replace: true });
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Login failed');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.includes('@')) {
      setError('Valid email is required');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    loginMutation.mutate(formData);
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
          <p className="text-ink/60">Your AI-powered internship companion</p>
        </div>

        {error && <ErrorBanner message={error} onClose={() => setError('')} variant="error" />}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <Field
              label="Email Address"
              type="email"
              placeholder="demo@careerpilot.ai"
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
                  placeholder="Enter your password"
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
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-ink/60">
              New to CareerPilot?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-moss font-bold hover:text-moss/80 transition"
              >
                Create an account
              </button>
            </p>
          </div>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-4 bg-emerald-50 border-emerald-200">
          <p className="text-xs font-bold uppercase text-emerald-700 mb-2">Demo Credentials</p>
          <p className="text-sm text-emerald-700">
            Email: <span className="font-mono font-bold">demo@careerpilot.ai</span>
          </p>
          <p className="text-sm text-emerald-700">
            Password: <span className="font-mono font-bold">Password@123</span>
          </p>
          <Button
            onClick={() => {
              setFormData({
                email: 'demo@careerpilot.ai',
                password: 'Password@123'
              });
            }}
            variant="secondary"
            size="sm"
            className="w-full mt-3"
          >
            Fill Demo Credentials
          </Button>
        </Card>

        {/* Features */}
        <div className="mt-8 space-y-3">
          <div className="flex gap-3 text-sm">
            <span className="text-moss font-black text-lg">✓</span>
            <p className="text-ink/70"><span className="font-bold">Smart Matching:</span> AI-powered internship discovery</p>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="text-moss font-black text-lg">✓</span>
            <p className="text-ink/70"><span className="font-bold">Skill Analysis:</span> Identify gaps and grow</p>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="text-moss font-black text-lg">✓</span>
            <p className="text-ink/70"><span className="font-bold">Track Progress:</span> Manage your journey</p>
          </div>
        </div>
      </div>
    </div>
  );
}
