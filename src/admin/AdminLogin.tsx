import React, { useState } from 'react';
import { api, AdminUser } from '../services/api';
import { Flame, Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const { language, isRtl } = useLanguage();
  const [email, setEmail] = useState('admin@sizzlesmoke.com');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login(email, password);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || (language === 'ar' ? 'فشل تسجيل الدخول. تحقق من البريد وكلمة المرور.' : 'Login failed. Invalid email or password.'));
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@sizzlesmoke.com');
    setPassword('admin123456');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <Flame className="w-8 h-8 fill-white" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-black text-stone-900 font-display tracking-tight">
          {language === 'ar' ? 'لوحة تحكم المشرف' : 'Admin Control Panel'}
        </h2>
        <p className="mt-1 text-center text-xs text-stone-500">
          {language === 'ar' ? 'تسجيل دخول آمن لإدارة وجبات وتصنيفات وإعدادات المطعم' : 'Secure authentication to manage restaurant menu, categories & settings'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 border border-stone-200 rounded-3xl shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute top-1/2 -translate-y-1/2 left-3.5 rtl:left-auto rtl:right-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@sizzlesmoke.com"
                  className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 transition-colors shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {language === 'ar' ? 'كلمة المرور المشفرة' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute top-1/2 -translate-y-1/2 left-3.5 rtl:left-auto rtl:right-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 transition-colors shadow-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In as Admin'}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleFillDemo}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium border border-amber-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {language === 'ar'
                  ? 'ملء بيانات الدخول التجريبية (admin@sizzlesmoke.com / admin123456)'
                  : 'Autofill Demo Credentials (admin@sizzlesmoke.com / admin123456)'}
              </span>
            </button>

            <button
              type="button"
              onClick={onBackToSite}
              className="text-center text-xs text-stone-500 hover:text-stone-800 py-1 transition-colors cursor-pointer"
            >
              ← {language === 'ar' ? 'العودة للموقع الاستعراضي العام' : 'Return to Public Restaurant Website'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
