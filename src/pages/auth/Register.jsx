import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, Mail, Lock, User, Phone, Eye, EyeOff, Check, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { SEOHead } from '../../components/common/SEOHead';
import { motion } from 'framer-motion';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (!formData.agreeTerms) {
      toast.error('Please accept the Terms of Rental and Privacy Policy.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (res.data.success) {
        toast.success('Registration successful! Please verify your email.');
        navigate(`/verification-pending?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 relative bg-zinc-50 dark:bg-black transition-colors">
      <SEOHead title="Member Registration — Car Rental" description="Join Car Rental for luxury mobility and privileged automotive access." />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 relative shadow-2xl z-10 transition-colors"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center mx-auto mb-3 text-zinc-950 dark:text-white">
            <Crown className="w-6 h-6 text-zinc-950 dark:text-white" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white tracking-wide">
            Register Account
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Experience white-glove automotive privileges & reservations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400 mb-1.5">
              Full Legal Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Lord / Lady / Mr. John Doe"
                id="reg-name-input"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  id="reg-email-input"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  id="reg-phone-input"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  id="reg-password-input"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-11 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-400 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  id="reg-confirm-password-input"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-1 pt-1">
              <div className="flex gap-1 h-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div
                    key={lvl}
                    className={`flex-1 rounded-full transition-colors ${
                      strength >= lvl
                        ? strength > 3
                          ? 'bg-emerald-500'
                          : strength > 2
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                        : 'bg-zinc-200 dark:bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 text-right">
                {strength > 3 ? 'Strong' : strength > 2 ? 'Medium' : 'Weak'}
              </p>
            </div>
          )}

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="mt-1 rounded bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-black focus:ring-0 cursor-pointer"
            />
            <label htmlFor="agreeTerms" className="text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer">
              I accept the Car Rental Terms of Service, rental security guidelines, and confirm that all submitted details are authentic.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            id="reg-submit-btn"
            className="w-full mt-4 py-3.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                Registering Account...
              </span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-900 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Already registered?{' '}
          <Link to="/login" className="text-zinc-950 dark:text-white font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
