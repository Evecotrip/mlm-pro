'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Target, Shield, Globe, ChevronDown, AlertCircle, CheckCircle, XCircle, FileText, Scale, Ban, RefreshCw, Mail, Cookie, Settings, BarChart3, ToggleLeft, AlertTriangle, TrendingUp, Info, FileWarning, Eye, Lock, Database, UserCheck, Phone, MessageCircle, Clock, MapPin, Send } from 'lucide-react';
import { useState, use } from 'react';
import { notFound } from 'next/navigation';

// Import content components
import AboutContent from './content/AboutContent';
import FAQContent from './content/FAQContent';
import RulesContent from './content/RulesContent';
import TermsContent from './content/TermsContent';
import CookiesContent from './content/CookiesContent';
import DisclaimerContent from './content/DisclaimerContent';
import PrivacyContent from './content/PrivacyContent';
import SupportContent from './content/SupportContent';

interface PageConfig {
  title: string;
  description: string;
  component: React.ComponentType;
}

const pages: Record<string, PageConfig> = {
  'about': {
    title: 'About AurumX',
    description: 'Learn about our mission, vision, and values',
    component: AboutContent
  },
  'faq': {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about AurumX platform',
    component: FAQContent
  },
  'rules': {
    title: 'Platform Rules & Guidelines',
    description: 'Please read and understand these rules before using the AurumX platform',
    component: RulesContent
  },
  'terms': {
    title: 'Terms of Service',
    description: 'Please read these terms carefully before using the AurumX platform',
    component: TermsContent
  },
  'cookies': {
    title: 'Cookie Policy',
    description: 'Learn how we use cookies to improve your experience on AurumX',
    component: CookiesContent
  },
  'disclaimer': {
    title: 'Disclaimer',
    description: 'Important information about the risks and limitations of using AurumX',
    component: DisclaimerContent
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    description: 'Your privacy is important to us. This policy explains how we collect, use, and protect your personal information',
    component: PrivacyContent
  },
  'support': {
    title: 'How Can We Help?',
    description: 'Our support team is here to assist you. Choose your preferred method of contact or send us a message',
    component: SupportContent
  }
};

export default function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  const pageConfig = pages[slug];

  if (!pageConfig) {
    notFound();
  }

  const ContentComponent = pageConfig.component;

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
        <ContentComponent />
      </main>
    </div>
  );
}
