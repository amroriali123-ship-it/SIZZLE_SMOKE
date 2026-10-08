import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, PartyPopper, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { language, t, isRtl } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError(language === 'ar' ? 'يرجى تعبئة كافة الحقول المطلوبة.' : 'Please fill in all required fields.');
      return;
    }
    setError(null);
    setSubmitted(true);
    setName('');
    setPhone('');
    setMessage('');
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <section id="contact" className="py-24 bg-stone-900/60 border-t border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold tracking-widest text-amber-500 uppercase block mb-2">
            {t.contact.subtitle}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-100 font-display tracking-tight">
            {t.contact.title}
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            {t.contact.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 5 Columns: Contact Channels Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Unified Hotline */}
            <div className="p-6 bg-stone-950 border border-stone-850 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                  {t.contact.hotline}
                </span>
                <span className="text-lg font-mono font-bold text-stone-100 block mt-1">
                  9200 44889
                </span>
                <span className="text-xs text-stone-500 block mt-0.5">
                  +966 11 800 4455 ({isRtl ? 'دولي' : 'International'})
                </span>
              </div>
            </div>

            {/* Email Support */}
            <div className="p-6 bg-stone-950 border border-stone-850 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                  {t.contact.email}
                </span>
                <span className="text-sm font-mono font-bold text-stone-200 block mt-1">
                  care@sizzleandsmoke-grill.com
                </span>
                <span className="text-xs text-stone-500 block mt-0.5">
                  {isRtl ? 'الرد خلال أقل من ساعتين' : 'Response within 2 hours'}
                </span>
              </div>
            </div>

            {/* Catering & Events */}
            <div className="p-6 bg-stone-950 border border-stone-850 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-600/30 flex items-center justify-center text-amber-300 shrink-0">
                <PartyPopper className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
                  {t.contact.catering}
                </span>
                <span className="text-sm font-mono font-bold text-stone-200 block mt-1">
                  catering@sizzleandsmoke-grill.com
                </span>
                <span className="text-xs text-stone-500 block mt-0.5">
                  {isRtl ? 'شاحنات برجر متنقلة وبوفيهات مفتوحة' : 'Food trucks & bespoke event sliders'}
                </span>
              </div>
            </div>

            {/* Mock Data Disclaimer */}
            <p className="text-xs text-stone-500 italic px-2">
              {t.contact.mockNote}
            </p>

          </div>

          {/* Right 7 Columns: Message Form */}
          <div className="lg:col-span-7 bg-stone-950 border border-stone-850 rounded-3xl p-6 sm:p-8">
            {submitted && (
              <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-emerald-200 text-xs flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{t.contact.messageSent}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-400 block mb-1.5">
                    {t.contact.formName}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'ar' ? 'محمد العلي' : 'Fahad Al-Ali'}
                    className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-400 block mb-1.5">
                    {t.contact.formPhone}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966 5x xxx xxxx"
                    className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 block mb-1.5">
                  {t.contact.formSubject}
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="general">{t.contact.formSubjectGeneral}</option>
                  <option value="catering">{t.contact.formSubjectCatering}</option>
                  <option value="suggestion">{t.contact.formSubjectSuggestion}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 block mb-1.5">
                  {t.contact.formMessage}
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'ar' ? 'اكتب رسالتك أو استفسارك هنا...' : 'Write your inquiry or request here...'}
                  className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500 resize-none"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Send className="w-4 h-4" />
                <span>{t.contact.sendMessage}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
