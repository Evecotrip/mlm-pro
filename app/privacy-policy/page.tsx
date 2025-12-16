'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Globe, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Personal identification information (Name, email address, phone number, etc.)',
        'Financial information required for transactions and KYC verification',
        'Device and browser information for security purposes',
        'Usage data and analytics to improve our services',
        'Communication records for customer support'
      ]
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'To process transactions and manage your account',
        'To verify your identity and comply with KYC/AML regulations',
        'To communicate important updates and notifications',
        'To improve our platform and user experience',
        'To detect and prevent fraudulent activities'
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        'Industry-standard encryption for all data transmissions',
        'Secure servers with regular security audits',
        'Two-factor authentication for account access',
        'Regular backups and disaster recovery procedures',
        'Strict access controls for employee data access'
      ]
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: [
        'Right to access your personal data',
        'Right to correct inaccurate information',
        'Right to request deletion of your data',
        'Right to data portability',
        'Right to withdraw consent at any time'
      ]
    },
    {
      icon: Globe,
      title: 'Data Sharing',
      content: [
        'We do not sell your personal information to third parties',
        'Data may be shared with regulatory authorities when required by law',
        'Third-party service providers are bound by strict confidentiality agreements',
        'Analytics data is anonymized and aggregated'
      ]
    }
  ];

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
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-slate-500 mt-4">Last updated: December 2024</p>
        </div>

        {/* Introduction */}
        <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Introduction</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            AuramX ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this privacy policy carefully. By using AuramX, you consent to the data practices described in this policy.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 mt-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Mail className="w-6 h-6" />
            <h2 className="text-xl font-bold">Questions About Privacy?</h2>
          </div>
          <p className="text-blue-100 mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us.
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
