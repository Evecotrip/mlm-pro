'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Cookie, Settings, BarChart3, Shield, ToggleLeft, Mail } from 'lucide-react';

export default function CookiePolicyPage() {
  const router = useRouter();

  const cookieTypes = [
    {
      icon: Shield,
      title: 'Essential Cookies',
      description: 'Required for the platform to function properly',
      examples: ['Authentication tokens', 'Session management', 'Security features'],
      required: true
    },
    {
      icon: Settings,
      title: 'Functional Cookies',
      description: 'Remember your preferences and settings',
      examples: ['Language preferences', 'Theme settings', 'Dashboard layout'],
      required: false
    },
    {
      icon: BarChart3,
      title: 'Analytics Cookies',
      description: 'Help us understand how you use the platform',
      examples: ['Page views', 'Feature usage', 'Performance metrics'],
      required: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-amber-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[120px]"></div>
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
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Cookie className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Cookie Policy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Learn how we use cookies to improve your experience on AuramX.
          </p>
          <p className="text-sm text-slate-500 mt-4">Last updated: December 2024</p>
        </div>

        {/* What are Cookies */}
        <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">What Are Cookies?</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Cookies are small text files that are stored on your device when you visit a website. They help us remember your preferences, understand how you use our platform, and improve your overall experience. Cookies are widely used across the internet and are essential for many website features to work properly.
          </p>
        </div>

        {/* Cookie Types */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Types of Cookies We Use</h2>
          {cookieTypes.map((cookie, index) => (
            <div
              key={index}
              className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <cookie.icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cookie.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{cookie.description}</p>
                  </div>
                </div>
                {cookie.required ? (
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">
                    Required
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-full">
                    Optional
                  </span>
                )}
              </div>
              <div className="pl-16">
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-2">Examples:</p>
                <div className="flex flex-wrap gap-2">
                  {cookie.examples.map((example, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm rounded-lg"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Managing Cookies */}
        <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <ToggleLeft className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Managing Your Cookie Preferences</h2>
          </div>
          <div className="space-y-4 text-slate-600 dark:text-slate-400">
            <p>You can control and manage cookies in several ways:</p>
            <ul className="space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0"></span>
                <span><strong>Browser Settings:</strong> Most browsers allow you to refuse or accept cookies through their settings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0"></span>
                <span><strong>Platform Settings:</strong> Use our cookie consent banner to manage your preferences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 shrink-0"></span>
                <span><strong>Delete Cookies:</strong> You can delete cookies that have already been set</span>
              </li>
            </ul>
            <p className="text-sm text-slate-500 mt-4">
              Note: Disabling essential cookies may affect the functionality of the platform.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Mail className="w-6 h-6" />
            <h2 className="text-xl font-bold">Questions About Cookies?</h2>
          </div>
          <p className="text-amber-100 mb-4">
            If you have any questions about our use of cookies, please contact our support team.
          </p>
          <button
            onClick={() => router.push('/support')}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors"
          >
            Contact Support
          </button>
        </div>
      </main>
    </div>
  );
}
