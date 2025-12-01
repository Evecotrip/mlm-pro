'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Shield, TrendingUp, Users, Globe, Play } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const animationContainer = useRef<HTMLDivElement>(null);
  const animationInstance = useRef<AnimationItem | null>(null);

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  };

  useEffect(() => {
    if (animationContainer.current && !animationInstance.current) {
      // Load animation data
      fetch('/diamond.json')
        .then(response => response.json())
        .then(animationData => {
          if (animationContainer.current) {
            animationInstance.current = lottie.loadAnimation({
              container: animationContainer.current,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              animationData: animationData,
            });
          }
        })
        .catch(error => {
          console.error('Failed to load Lottie animation:', error);
        });
    }

    return () => {
      if (animationInstance.current) {
        animationInstance.current.destroy();
        animationInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-x-hidden selection:bg-blue-500/30 transition-colors duration-300">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[40%] w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar Placeholder */}
      <nav className="relative z-50 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">AuramX</span>
          <div className="relative w-12 h-12 flex items-center justify-center ml-[-7px]">
            <div ref={animationContainer} className="absolute inset-0" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/login')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            Login
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 dark:hover:bg-blue-50 transition-all hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-md mb-8 animate-fadeIn shadow-sm dark:shadow-none">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">Next Gen Investment Platform</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-500 bg-clip-text text-transparent max-w-4xl mx-auto leading-[1.1]">
          The Future of <br />
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400 bg-clip-text text-transparent animate-shine">Decentralized Wealth</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Experience a new era of financial growth with AuramX. Secure, transparent, and built for the modern investor. Join the revolution today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleGetStarted}
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]"
          >
            <span className="flex items-center gap-2">
              Start Investing Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button className="group px-8 py-4 bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold text-lg transition-all backdrop-blur-md shadow-sm dark:shadow-none">
            <span className="flex items-center gap-2">
              <Play className="w-5 h-5 fill-current" /> Watch Demo
            </span>
          </button>
        </div>

        {/* Hero Visual */}
        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-3xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-900/10 dark:via-white/20 to-transparent"></div>
            {/* Mock Dashboard Preview */}
            <div className="p-4 md:p-8 grid grid-cols-3 gap-4 md:gap-8 opacity-90">
              <div className="col-span-2 space-y-4">
                <div className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse"></div>
                <div className="h-48 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse"></div>
                <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse"></div>
                <div className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse"></div>
              </div>
            </div>
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent dark:from-slate-950 dark:via-transparent dark:to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Trusted by 10,000+ Investors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why Choose AuramX?</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Built on advanced technology to ensure your assets are safe, growing, and always accessible.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Bank-Grade Security",
              desc: "Your assets are protected by state-of-the-art encryption and multi-layer security protocols.",
              color: "text-emerald-600 dark:text-emerald-400",
              bg: "bg-emerald-500/10"
            },
            {
              icon: TrendingUp,
              title: "High Yield Returns",
              desc: "Access exclusive investment strategies designed to maximize your portfolio growth.",
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-500/10"
            },
            {
              icon: Globe,
              title: "Global Access",
              desc: "Invest from anywhere in the world with our borderless, decentralized platform.",
              color: "text-purple-600 dark:text-purple-400",
              bg: "bg-purple-500/10"
            }
          ].map((feature, i) => (
            <div key={i} className="group p-8 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:bg-white dark:hover:bg-slate-900 hover:-translate-y-1 shadow-sm dark:shadow-none hover:shadow-md">
              <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-24">
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-600 to-slate-800 dark:from-blue-900 dark:to-slate-900 border border-slate-200 dark:border-slate-800 text-center px-6 py-20 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-slate-900/50 dark:to-slate-950/80"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to start your journey?</h2>
            <p className="text-xl text-blue-100 dark:text-slate-300 mb-10">Join thousands of investors who are already building their future with AuramX.</p>
            <button
              onClick={handleGetStarted}
              className="px-10 py-5 bg-white text-blue-600 dark:text-blue-900 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-md flex items-center justify-center">
              <span className="font-bold text-xs text-slate-900 dark:text-white">A</span>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">AuramX</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Support</a>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-600">© 2024 AuramX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
