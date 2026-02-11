import { Link } from 'react-router-dom';
import { Activity, PhoneCall, ShieldCheck, Clock, MapPin, ArrowRight } from 'lucide-react';

function EmergencyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-secondary-50/20">
      <header className="bg-white/95 border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CP</span>
            </div>
            <div>
              <p className="text-slate-900 font-bold text-lg">CarePoint Hospital</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-primary-600 font-semibold">Emergency Services</p>
            </div>
          </Link>
          <Link to="/" className="text-sm font-semibold text-primary-700 hover:text-primary-800">Back to Home</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-error-50 rounded-full border border-error-200">
              <div className="w-2 h-2 rounded-full bg-error-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-error-700">Emergency Response Team On Call</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">24/7 Emergency Care You Can Trust</h1>
            <p className="text-lg text-slate-600">Immediate triage, trauma-ready facilities, and specialized critical care teams. We are prepared for cardiac, stroke, trauma, and pediatric emergencies.</p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:911" className="px-8 py-4 bg-gradient-to-r from-error-600 to-error-700 text-white font-semibold rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center gap-2">
                Call Emergency: 911
                <PhoneCall className="w-5 h-5" />
              </a>
              <Link to="/book-appointment" className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl border-2 border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200">
                Schedule Non-Emergency Visit
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-ambient p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-error-50 text-error-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Immediate Help</p>
                <p className="text-xl font-bold text-slate-900">Emergency Entrance</p>
              </div>
            </div>
            <div className="space-y-3 text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-600 mt-1" />
                <span>123 Medical Center Drive, Healthcare City</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary-600 mt-1" />
                <span>Open 24/7 with rapid triage within 5 minutes</span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary-600 mt-1" />
                <span>Board-certified emergency physicians on site</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Rapid Triage', detail: 'Immediate assessment and prioritization for critical care.' },
            { title: 'Trauma Ready', detail: 'Level-1 trauma response with surgical teams on standby.' },
            { title: 'Cardiac & Stroke', detail: 'Dedicated pathways for cardiac arrest and stroke emergencies.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-slate-200/60 shadow-ambient p-6">
              <p className="text-lg font-semibold text-slate-900 mb-2">{item.title}</p>
              <p className="text-slate-600">{item.detail}</p>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-3xl border border-slate-200/60 shadow-ambient p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary-600 font-semibold">Emergency Guidance</p>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">When to call emergency services</h2>
            </div>
            <a href="tel:911" className="px-5 py-2.5 bg-error-600 text-white rounded-xl font-semibold hover:bg-error-700 transition-colors">
              Call 911 Now
            </a>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6 text-slate-600">
            <div className="space-y-3">
              <p>• Severe chest pain or difficulty breathing</p>
              <p>• Sudden weakness, confusion, or stroke symptoms</p>
              <p>• Major trauma, bleeding, or loss of consciousness</p>
            </div>
            <div className="space-y-3">
              <p>• Seizures lasting longer than 5 minutes</p>
              <p>• Severe allergic reaction or anaphylaxis</p>
              <p>• High fever with stiff neck or severe headache</p>
            </div>
          </div>
          <Link to="/book-appointment" className="mt-6 inline-flex items-center gap-2 text-primary-700 font-semibold">
            Schedule a non-emergency visit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}

export default EmergencyPage;
