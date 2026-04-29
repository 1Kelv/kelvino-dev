import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Droplets, Moon, TrendingUp, Pill, Calendar, Baby, Activity, FileText } from 'lucide-react';

const features = [
  { icon: Droplets, label: 'Feeds', desc: 'Log every feed with amount, type, and duration', colour: 'bg-brand-light text-brand-dark' },
  { icon: Baby, label: 'Nappies', desc: 'Track wet, dirty, and dry nappies throughout the day', colour: 'bg-blue-50 text-blue-600' },
  { icon: Pill, label: 'Medications', desc: 'Record doses, routes, and who administered each medication', colour: 'bg-purple-50 text-purple-600' },
  { icon: TrendingUp, label: 'Growth', desc: 'Plot weight and length over time with visual charts', colour: 'bg-green-50 text-green-600' },
  { icon: Activity, label: 'Symptoms', desc: 'Note how your baby is feeling day to day', colour: 'bg-red-50 text-red-600' },
  { icon: Moon, label: 'Sleep', desc: 'Track sleep sessions, wake counts, and patterns', colour: 'bg-indigo-50 text-indigo-600' },
  { icon: Calendar, label: 'Appointments', desc: 'Keep all hospital and clinic visits in one place', colour: 'bg-orange-50 text-orange-600' },
  { icon: FileText, label: 'Notes', desc: 'Save consultant summaries, discharge notes, and more', colour: 'bg-yellow-50 text-yellow-600' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-mint via-brand-sky to-brand-dark px-6 pt-16 pb-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5 shadow-lg">
          <Heart size={32} className="text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 font-heading">Mylestone</h1>
        <p className="text-xl text-white/90 font-medium mb-2">Every milestone, remembered.</p>
        <p className="text-white/75 text-sm max-w-xs mx-auto mb-10">
          The simple, beautiful way to track your baby's feeds, sleep, growth, and every precious moment.
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Link
            to="/register"
            className="w-full bg-white text-brand-dark font-bold py-3.5 px-6 rounded-2xl text-base shadow-md hover:bg-brand-light transition-colors"
          >
            Get started free
          </Link>
          <Link
            to="/login"
            className="w-full bg-white/20 text-white font-semibold py-3.5 px-6 rounded-2xl text-base hover:bg-white/30 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="px-5 py-12 max-w-lg mx-auto">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-2 font-heading">Everything in one place</h2>
        <p className="text-gray-500 text-sm text-center mb-8">8 tracking modules designed around your baby's daily routine.</p>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f) => (
            <div key={f.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${f.colour}`}>
                <f.icon size={18} />
              </div>
              <p className="font-bold text-gray-900 text-sm mb-1">{f.label}</p>
              <p className="text-xs text-gray-500 leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-baby callout */}
      <div className="mx-5 mb-12 bg-brand-light rounded-3xl p-6 text-center max-w-lg mx-auto">
        <p className="text-2xl mb-3">👶</p>
        <h3 className="font-extrabold text-brand-dark text-lg mb-2 font-heading">Multi-baby support</h3>
        <p className="text-sm text-brand-dark/80">Add multiple baby profiles and switch between them instantly. Perfect for families with more than one little one.</p>
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pb-16 text-center max-w-xs mx-auto">
        <Link
          to="/register"
          className="block w-full bg-brand-mint text-white font-bold py-4 rounded-2xl text-base shadow-lg hover:bg-brand-dark transition-colors"
        >
          Start tracking today
        </Link>
        <p className="text-xs text-gray-400 mt-3">Free to use. No credit card required.</p>
      </div>
    </div>
  );
}
