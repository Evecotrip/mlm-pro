'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle, TrendingUp, Scale, FileWarning, Info, Mail } from 'lucide-react';

export default function DisclaimerPage() {
  const router = useRouter();

  const disclaimers = [
    {
      icon: TrendingUp,
      title: 'Investment Risks',
      content: [
        'All investments carry risk, including the potential loss of principal',
        'Past performance is not indicative of future results',
        'The value of investments can go down as well as up',
        'Returns are not guaranteed and may vary significantly',
        'You should only invest money you can afford to lose'
      ]
    },
    {
      icon: Info,
      title: 'No Financial Advice',
      content: [
        'Information on this platform is for educational purposes only',
        'We do not provide personalized financial advice',
        'Content should not be construed as investment recommendations',
        'Always consult a qualified financial advisor before investing',
        'We are not responsible for decisions made based on our content'
      ]
    },
    {
      icon: Scale,
      title: 'Regulatory Compliance',
      content: [
        'AuramX operates in compliance with applicable laws',
        'Regulatory requirements may vary by jurisdiction',
        'Users are responsible for understanding local regulations',
        'Some features may not be available in all regions',
        'We reserve the right to restrict access based on location'
      ]
    },
    {
      icon: FileWarning,
      title: 'Platform Limitations',
      content: [
        'The platform is provided "as is" without warranties',
        'We do not guarantee uninterrupted or error-free service',
        'Technical issues may occasionally affect functionality',
        'We are not liable for losses due to system failures',
        'Third-party integrations are subject to their own terms'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px]"></div>
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
          <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Disclaimer
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Important information about the risks and limitations of using AuramX.
          </p>
          <p className="text-sm text-slate-500 mt-4">Last updated: December 2024</p>
        </div>

        {/* Important Notice */}
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Important Notice</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            By using AuramX, you acknowledge that you have read, understood, and agree to be bound by this disclaimer. If you do not agree with any part of this disclaimer, please do not use our platform. Investment in financial products involves substantial risk and is not suitable for all investors.
          </p>
        </div>

        {/* Disclaimer Sections */}
        <div className="space-y-6">
          {disclaimers.map((section, index) => (
            <div
              key={index}
              className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Acknowledgment */}
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 mt-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Acknowledgment</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            By continuing to use AuramX, you acknowledge and agree that:
          </p>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>You have read and understood this disclaimer in its entirety</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>You accept the risks associated with using the platform</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>You will seek professional advice before making investment decisions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <span>You release AuramX from liability for any losses incurred</span>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl p-8 mt-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Mail className="w-6 h-6" />
            <h2 className="text-xl font-bold">Questions?</h2>
          </div>
          <p className="text-slate-300 mb-4">
            If you have any questions about this disclaimer, please contact our support team.
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
