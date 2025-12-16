'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is AuramX?',
    answer: 'AuramX is a decentralized investment platform that allows users to invest in various profiles (Diamond, Gold, Silver, Bronze) and earn returns based on their investment amount and lock-in period. Users can also grow their network through referrals and earn additional commissions.'
  },
  {
    question: 'How do I get started?',
    answer: 'To get started, you need a referral code from an existing member. Sign up using the referral code, complete your KYC verification, add funds to your wallet, and start investing in your preferred investment profile.'
  },
  {
    question: 'What are the different investment profiles?',
    answer: 'We offer four investment profiles: Diamond (highest returns, higher minimum), Gold, Silver, and Bronze (lowest minimum investment). Each profile has different return rates and lock-in periods. Choose based on your investment capacity and risk appetite.'
  },
  {
    question: 'How do referral commissions work?',
    answer: 'When someone joins using your referral code and makes an investment, you earn a commission based on their investment amount. The commission structure varies by level - you earn more from direct referrals and decreasing percentages from deeper levels in your network.'
  },
  {
    question: 'What is the lock-in period?',
    answer: 'Lock-in period is the minimum duration your investment must remain active. Options range from 1 month to 12 months. Longer lock-in periods offer higher bonus returns. You cannot withdraw the invested amount during this period.'
  },
  {
    question: 'How do withdrawals work?',
    answer: 'Withdrawals can be requested once your investment matures. The withdrawal request goes to your referrer for approval. You can choose between online transfer (to your bank account) or physical cash collection. Withdrawal limits may apply based on your account age.'
  },
  {
    question: 'Is my investment secure?',
    answer: 'Yes, we employ bank-grade security measures including end-to-end encryption, two-factor authentication, and regular security audits. Your funds are protected by multiple layers of security protocols.'
  },
  {
    question: 'What is KYC and why is it required?',
    answer: 'KYC (Know Your Customer) is a verification process required by regulations. It involves submitting your identity documents (Aadhaar, PAN) to verify your identity. This helps prevent fraud and ensures the security of all users on the platform.'
  },
  {
    question: 'Can I have multiple investments?',
    answer: 'Yes, you can have multiple active investments across different profiles. Each investment is tracked separately with its own maturity date and returns.'
  },
  {
    question: 'How do I contact support?',
    answer: 'You can reach our support team through the Support page, email us at support@auramx.com, or contact your referrer for immediate assistance. We typically respond within 24 hours.'
  }
];

export default function FAQPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
      <main className="relative z-10 container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">
          Find answers to common questions about AuramX platform.
        </p>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-slate-900 dark:text-white pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-16 text-center bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Still have questions?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <button
            onClick={() => router.push('/support')}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all hover:scale-105"
          >
            Contact Support
          </button>
        </div>
      </main>
    </div>
  );
}
