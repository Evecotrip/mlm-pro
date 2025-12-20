'use client';

import { useRouter } from 'next/navigation';
import { FileText, Users, AlertTriangle, Scale, Ban, RefreshCw, Mail } from 'lucide-react';

export default function TermsContent() {
  const router = useRouter();

  const sections = [
    {
      icon: Users,
      title: 'Account Terms',
      content: [
        'You must be at least 18 years old to use this platform',
        'You must provide accurate and complete registration information',
        'You are responsible for maintaining the security of your account',
        'One person may not maintain more than one account',
        'You must complete KYC verification to access all features'
      ]
    },
    {
      icon: Scale,
      title: 'User Responsibilities',
      content: [
        'Comply with all applicable laws and regulations',
        'Not engage in any fraudulent or illegal activities',
        'Not attempt to manipulate or exploit the platform',
        'Report any suspicious activities or security vulnerabilities',
        'Maintain accurate records of your transactions'
      ]
    },
    {
      icon: Ban,
      title: 'Prohibited Activities',
      content: [
        'Money laundering or terrorist financing',
        'Using the platform for illegal purposes',
        'Attempting to hack or disrupt the platform',
        'Creating fake accounts or impersonating others',
        'Manipulating referral systems or rewards'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Risk Disclosure',
      content: [
        'Investments carry inherent risks including potential loss of capital',
        'Past performance does not guarantee future results',
        'Market conditions can affect investment returns',
        'You should only invest what you can afford to lose',
        'We recommend seeking independent financial advice'
      ]
    },
    {
      icon: RefreshCw,
      title: 'Modifications',
      content: [
        'We reserve the right to modify these terms at any time',
        'Changes will be communicated via email or platform notifications',
        'Continued use of the platform constitutes acceptance of changes',
        'Major changes will be announced at least 30 days in advance'
      ]
    }
  ];

  return (
    <>
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Please read these terms carefully before using the AurumX platform.
        </p>
        <p className="text-sm text-slate-500 mt-4">Last updated: December 2024</p>
      </div>

      <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Agreement to Terms</h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          By accessing or using AurumX, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform. The materials contained in this platform are protected by applicable copyright and trademark law.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                <section.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
            </div>
            <ul className="space-y-3">
              {section.content.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-3xl p-8 mt-8">
        <div className="flex items-center gap-4 mb-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Limitation of Liability</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          In no event shall AurumX or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AurumX's platform, even if AurumX or an authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 mt-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Mail className="w-6 h-6" />
          <h2 className="text-xl font-bold">Questions About Terms?</h2>
        </div>
        <p className="text-indigo-100 mb-4">
          If you have any questions about these Terms of Service, please contact our support team.
        </p>
        <button
          onClick={() => router.push('/info/support')}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors"
        >
          Contact Support
        </button>
      </div>
    </>
  );
}
