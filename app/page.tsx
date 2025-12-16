'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Shield, TrendingUp, Users, Globe, Play } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { ThemeToggle } from '@/components/ThemeToggle';

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

      {/* Floating Pill Navbar */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <nav className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-full shadow-lg shadow-slate-900/5 dark:shadow-black/20">
          <div className="flex items-center">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 pl-2">AuramX</span>
            <div className="relative w-10 h-10 flex items-center justify-center ml-[-5px]">
              <div ref={animationContainer} className="absolute inset-0" />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => router.push('/about')} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
              About Us
            </button>
            <button onClick={() => router.push('/faq')} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
              FAQ
            </button>
            <button onClick={() => router.push('/rules')} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
              Rules
            </button>
            <button onClick={() => router.push('/support')} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
              Support
            </button>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => router.push('/login')} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
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
      </div>

      {/* Hero Section - Video */}
      <section className="relative z-10 w-full h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video-1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white max-w-4xl mx-auto leading-[1.1]">
            The Future of <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Decentralized Wealth</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            Experience a new era of financial growth with AuramX. Secure, transparent, and built for the modern investor.
          </p>
          <button
            onClick={handleGetStarted}
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]"
          >
            <span className="flex items-center gap-2">
              Start Investing Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* Old Hero Section - Commented Out */}
      {/* <section className="relative z-10 container mx-auto px-6 pt-20 pb-32 text-center">
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

        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-3xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-900/10 dark:via-white/20 to-transparent"></div>
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
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent dark:from-slate-950 dark:via-transparent dark:to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Trusted by 10,000+ Investors</p>
            </div>
          </div>
        </div>
      </section> */}

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
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-sm text-white">A</span>
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">AuramX</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                The future of decentralized wealth. Secure, transparent, and built for the modern investor.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><button onClick={() => router.push('/about')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">About Us</button></li>
                <li><button onClick={() => router.push('/faq')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">FAQ</button></li>
                <li><button onClick={() => router.push('/rules')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">Rules & Guidelines</button></li>
                <li><button onClick={() => router.push('/support')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">Support</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><button onClick={() => router.push('/privacy-policy')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">Privacy Policy</button></li>
                <li><button onClick={() => router.push('/terms')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">Terms of Service</button></li>
                <li><button onClick={() => router.push('/cookies')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">Cookie Policy</button></li>
                <li><button onClick={() => router.push('/disclaimer')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">Disclaimer</button></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>Nizhneilimsky District<br />Irkutsk Oblast 665699, Russia</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span>support@auramx.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-500">© {new Date().getFullYear()} AuramX. All rights reserved.</p>
            <p className="text-xs text-slate-400 dark:text-slate-600">Built with trust, transparency, and security in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
