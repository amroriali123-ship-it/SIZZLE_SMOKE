import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_BRANCHES, MOCK_TABLES } from '../data/mockData';
import { TableSlot, Reservation } from '../types';
import { Calendar, Clock, Users, CheckCircle2, QrCode, MapPin, Sparkles, AlertCircle, Printer, RotateCcw } from 'lucide-react';

export const ReservationSection: React.FC = () => {
  const { language, t, isRtl } = useLanguage();

  const [selectedBranchId, setSelectedBranchId] = useState<string>(MOCK_BRANCHES[0].id);
  const [selectedZone, setSelectedZone] = useState<'indoor' | 'terrace' | 'vip' | 'counter'>('indoor');
  const [partySize, setPartySize] = useState<number>(4);
  const [selectedTableNumber, setSelectedTableNumber] = useState<string>('T-02');
  const [reservationDate, setReservationDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('20:30');
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [occasion, setOccasion] = useState<string>('casual');
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const selectedBranch = MOCK_BRANCHES.find(b => b.id === selectedBranchId) || MOCK_BRANCHES[0];

  const timeSlots = [
    '13:00', '14:30', '16:00', '18:30', '20:00', '20:30', '21:30', '22:30', '00:00'
  ];

  const filteredTables = MOCK_TABLES.filter(tbl => tbl.zone === selectedZone);

  const handleTableSelect = (tbl: TableSlot) => {
    if (tbl.status === 'reserved') return;
    setSelectedTableNumber(tbl.number);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) {
      setFormError(language === 'ar' ? 'يرجى إدخال الاسم ورقم الهاتف لإتمام الحجز.' : 'Please enter your name and phone number to complete the booking.');
      return;
    }
    setFormError(null);

    const newBooking: Reservation = {
      id: `res-${Date.now()}`,
      referenceNumber: `SZ-TB${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: guestName,
      phone: guestPhone,
      email: guestEmail || 'customer@example.com',
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      date: reservationDate,
      timeSlot: selectedTimeSlot,
      partySize,
      zone: selectedZone,
      tableNumber: selectedTableNumber,
      specialRequests: occasion,
      createdAt: new Date().toISOString(),
    };

    setConfirmedReservation(newBooking);
  };

  const handleResetForm = () => {
    setConfirmedReservation(null);
    setGuestName('');
    setGuestPhone('');
    setGuestEmail('');
  };

  return (
    <section id="reservation" className="py-24 bg-stone-950 relative border-t border-stone-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold tracking-widest text-amber-500 uppercase block mb-2">
            {t.reservation.subtitle}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-100 font-display tracking-tight">
            {t.reservation.title}
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            {language === 'ar'
              ? 'اختر فرعك المفضل وموقع الجلوس واستمتع بأشهى وجبات البرجر الطازجة بدون انتظار في الطوابير.'
              : 'Select your preferred branch and seat to enjoy fresh artisan burgers with zero queue wait times.'}
          </p>
        </div>

        {confirmedReservation ? (
          /* Confirmation Ticket Card */
          <div className="max-w-2xl mx-auto bg-stone-900 border border-stone-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden animate-fade-in">
            {/* Top decorative badge */}
            <div className="flex items-center justify-between pb-6 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-100 font-display">
                    {t.reservation.ticketSuccess}
                  </h3>
                  <div className="text-xs text-stone-400 mt-0.5">
                    {t.reservation.bookingRef}{' '}
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {confirmedReservation.referenceNumber}
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end text-right rtl:text-left">
                <span className="text-[10px] uppercase tracking-wider text-stone-500">
                  {isRtl ? 'حالة الحجز' : 'Status'}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {isRtl ? 'مؤكد فورياً' : 'Confirmed'}
                </span>
              </div>
            </div>

            {/* Ticket Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-stone-800/80">
              <div>
                <span className="text-[10px] uppercase text-stone-500 block mb-1">
                  {isRtl ? 'الفرع' : 'Branch'}
                </span>
                <span className="text-xs font-bold text-stone-200">
                  {confirmedReservation.branchName[language]}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-stone-500 block mb-1">
                  {isRtl ? 'التاريخ والوقت' : 'Date & Time'}
                </span>
                <span className="text-xs font-bold text-stone-200 font-mono">
                  {confirmedReservation.date} · {confirmedReservation.timeSlot}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-stone-500 block mb-1">
                  {isRtl ? 'الضيوف والطاولة' : 'Guests & Table'}
                </span>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  {confirmedReservation.partySize} {t.reservation.guests} ({confirmedReservation.tableNumber})
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-stone-500 block mb-1">
                  {isRtl ? 'باسم' : 'Name'}
                </span>
                <span className="text-xs font-bold text-stone-200">
                  {confirmedReservation.customerName}
                </span>
              </div>
            </div>

            {/* Simulated QR Code & Barcode */}
            <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-stone-950/60 p-4 rounded-2xl border border-stone-850 mt-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-stone-100 rounded-xl text-stone-950">
                  <QrCode className="w-12 h-12" />
                </div>
                <div className="text-xs text-stone-400 leading-relaxed max-w-xs">
                  {t.reservation.savedAlert}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-800 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.reservation.printTicket}</span>
                </button>
              </div>
            </div>

            {/* Action to book another */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleResetForm}
                className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.reservation.bookAnother}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Reservation Studio */
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Columns: Interactive Floor & Seating Selection */}
            <div className="lg:col-span-7 space-y-6 bg-stone-900/60 border border-stone-850 p-6 sm:p-8 rounded-3xl">
              
              {/* Branch Selector */}
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2.5">
                  {t.reservation.selectBranch}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {MOCK_BRANCHES.map(branch => {
                    const isSelected = selectedBranchId === branch.id;
                    return (
                      <button
                        key={branch.id}
                        type="button"
                        onClick={() => setSelectedBranchId(branch.id)}
                        className={`p-3 rounded-xl border text-xs text-start transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-stone-100 font-bold'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-amber-400 font-semibold">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{branch.city[language]}</span>
                        </div>
                        <div className="line-clamp-1 text-[11px] font-normal text-stone-400">
                          {branch.name[language]}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seating Zone Selector */}
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2.5">
                  {t.reservation.selectZone}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'indoor', label: t.reservation.zoneIndoor },
                    { key: 'terrace', label: t.reservation.zoneTerrace },
                    { key: 'vip', label: t.reservation.zoneVip },
                    { key: 'counter', label: t.reservation.zoneCounter },
                  ].map(z => {
                    const isSelected = selectedZone === z.key;
                    return (
                      <button
                        key={z.key}
                        type="button"
                        onClick={() => {
                          setSelectedZone(z.key as any);
                          const firstAvailable = MOCK_TABLES.find(t => t.zone === z.key && t.status === 'available');
                          if (firstAvailable) setSelectedTableNumber(firstAvailable.number);
                        }}
                        className={`p-3 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 font-black shadow-md shadow-amber-500/20'
                            : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-850'
                        }`}
                      >
                        {z.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Floor Plan Grid */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-stone-300">
                    {t.reservation.interactiveLayoutTitle}
                  </span>
                  
                  {/* Legend */}
                  <div className="flex items-center gap-3 text-[11px] text-stone-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>{t.reservation.tableAvailable}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>{t.reservation.tableSelected}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-stone-700" />
                      <span>{t.reservation.tableReserved}</span>
                    </div>
                  </div>
                </div>

                {/* Table Slots */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {filteredTables.map(tbl => {
                    const isSelected = selectedTableNumber === tbl.number;
                    const isReserved = tbl.status === 'reserved';
                    return (
                      <button
                        key={tbl.id}
                        type="button"
                        disabled={isReserved}
                        onClick={() => handleTableSelect(tbl)}
                        className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 scale-105 shadow-md shadow-amber-500/20'
                            : isReserved
                            ? 'bg-stone-900/40 border-stone-850 text-stone-600 cursor-not-allowed opacity-50'
                            : 'bg-stone-900 border-stone-800 text-stone-200 hover:border-emerald-500/50 hover:bg-stone-850'
                        }`}
                      >
                        <span className="font-mono text-sm font-bold">{tbl.number}</span>
                        <span className="text-[10px] text-stone-400 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{tbl.capacity} {t.reservation.guests}</span>
                        </span>
                        {isReserved ? (
                          <span className="text-[9px] text-red-400 font-medium">{t.reservation.tableReserved}</span>
                        ) : isSelected ? (
                          <span className="text-[9px] text-amber-400 font-bold">{t.reservation.tableSelected}</span>
                        ) : (
                          <span className="text-[9px] text-emerald-400 font-medium">{t.reservation.tableAvailable}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Party Size Stepper */}
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2.5">
                  {t.reservation.partySize} ({partySize} {t.reservation.guests})
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPartySize(num)}
                      className={`w-10 h-10 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        partySize === num
                          ? 'bg-amber-500 text-stone-950 shadow-md'
                          : 'bg-stone-950 border border-stone-800 text-stone-300 hover:bg-stone-850'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Date, Time & Contact Info */}
            <div className="lg:col-span-5 space-y-6 bg-stone-900/60 border border-stone-850 p-6 sm:p-8 rounded-3xl">
              
              {/* Date Input */}
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2">
                  {t.reservation.selectDate}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-amber-400 absolute top-1/2 -translate-y-1/2 left-3.5 rtl:left-auto rtl:right-3.5" />
                  <input
                    type="date"
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2">
                  {t.reservation.selectTime}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(time => {
                    const isSelected = selectedTimeSlot === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTimeSlot(time)}
                        className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                            : 'bg-stone-950 border border-stone-800 text-stone-300 hover:bg-stone-850'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guest Details */}
              <div className="space-y-3 pt-2 border-t border-stone-800/80">
                <div>
                  <label className="text-xs font-bold text-stone-400 block mb-1">
                    {t.reservation.customerName}
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder={language === 'ar' ? 'سلطان فهد' : 'Alex Mercer'}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-400 block mb-1">
                      {t.reservation.phone}
                    </label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+966 50 123 4567"
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-400 block mb-1">
                      {t.reservation.email}
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Special Occasion */}
                <div>
                  <label className="text-xs font-bold text-stone-400 block mb-1">
                    {t.reservation.occasion}
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="casual">{t.reservation.occasionCasual}</option>
                    <option value="birthday">{t.reservation.occasionBirthday}</option>
                    <option value="anniversary">{t.reservation.occasionAnniversary}</option>
                    <option value="business">{t.reservation.occasionBusiness}</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-red-950/30 border border-red-800/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition-all cursor-pointer"
              >
                {t.reservation.confirmBooking}
              </button>

            </div>

          </form>
        )}

      </div>
    </section>
  );
};
