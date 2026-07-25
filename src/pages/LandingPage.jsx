import { motion } from 'framer-motion';
import { ArrowRight, HeartPulse, Activity, UserPlus, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-premium overflow-hidden">
      <nav className="fixed w-full z-50 glass-panel border-x-0 border-t-0 rounded-none bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-brand-600 p-2.5 rounded-xl">
                <HeartPulse className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-display font-bold text-gray-900 tracking-tight">
                Jarurat<span className="text-brand-600">AI</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#about" className="text-gray-600 hover:text-brand-600 transition-colors">About Us</a>
              <a href="#features" className="text-gray-600 hover:text-brand-600 transition-colors">How it Works</a>
              <Link to="/chat" className="btn-premium py-2.5 px-5">
                Try the AI Matchmaker
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute top-20 left-0 w-72 h-72 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        
        <div className="text-center max-w-4xl mx-auto relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-brand-50 border border-brand-100 text-brand-700 px-4 py-2 rounded-full text-sm font-semibold mb-8">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              <span>AI Healthcare Product</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 leading-tight mb-8">
              Hope begins with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">
                advanced research.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Jarurat Care's AI Clinical Trial Matchmaker connects patients and caregivers with life-saving oncology trials in seconds, not months.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/chat" className="w-full sm:w-auto btn-premium flex items-center justify-center space-x-2 text-lg px-8 py-4">
                <span>Start AI Matching</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#learn-more" className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center shadow-sm">
                Learn More
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
        >
          {[
            { icon: Activity, title: 'Smart Matching', desc: 'Our AI analyzes complex oncology medical records to find the most relevant trials.' },
            { icon: Shield, title: 'Data Privacy', desc: 'Your health data is completely secure and never shared without explicit consent.' },
            { icon: UserPlus, title: 'Caregiver Support', desc: 'Designed with empathy, providing a support network for caregivers and families.' }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-8 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="inline-flex bg-brand-50 p-4 rounded-2xl mb-6">
                <feature.icon className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
