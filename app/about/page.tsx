'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Target, Shield, Globe } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 py-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>
      </header>

      {/* Content */}
      <main className="relative z-10 container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          About AurumX
        </h1>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
          AurumX is a next-generation decentralized investment platform designed to empower individuals 
          to build wealth through strategic investments and network growth.
        </p>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To democratize wealth creation by providing accessible, transparent, and secure investment 
              opportunities for everyone, regardless of their financial background.
            </p>
          </div>

          <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To become the world's most trusted platform for decentralized wealth building, 
              fostering a global community of financially empowered individuals.
            </p>
          </div>
        </div>

        {/* Values */}
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Our Core Values</h2>
        <div className="space-y-6 mb-16">
          {[
            {
              icon: Shield,
              title: 'Security First',
              description: 'Your assets are protected by state-of-the-art encryption and multi-layer security protocols.',
              color: 'emerald'
            },
            {
              icon: Users,
              title: 'Community Driven',
              description: 'We believe in the power of community. Our network-based model ensures everyone grows together.',
              color: 'blue'
            },
            {
              icon: Target,
              title: 'Transparency',
              description: 'Every transaction, every return, every fee is visible and verifiable. No hidden charges, no surprises.',
              color: 'purple'
            }
          ].map((value, i) => (
            <div key={i} className="flex gap-6 items-start bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <div className={`w-12 h-12 bg-${value.color}-500/10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <value.icon className={`w-6 h-6 text-${value.color}-600 dark:text-${value.color}-400`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{value.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 mb-8">Join thousands of investors building their future with AurumX.</p>
          <button
            onClick={() => router.push('/signup')}
            className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all hover:scale-105"
          >
            Get Started Today
          </button>
        </div>
      </main>
    </div>
  );
}
