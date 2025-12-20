'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function RulesContent() {
  const router = useRouter();

  const rules = [
    {
      category: 'Account & Registration',
      items: [
        'Users must be 18 years or older to register',
        'A valid referral code is required for registration',
        'KYC verification is mandatory before making investments',
        'One account per person - multiple accounts are strictly prohibited',
        'Accurate personal information must be provided during registration'
      ]
    },
    {
      category: 'Investments',
      items: [
        'Minimum investment amounts vary by profile (Bronze: ₹500, Silver: ₹5,000, Gold: ₹10,000, Diamond: ₹25,000)',
        'Investments are locked for the selected lock-in period',
        'Early withdrawal is not permitted during the lock-in period',
        'Returns are calculated based on the investment profile and lock-in duration',
        'All investments require approval from your referrer'
      ]
    },
    {
      category: 'Withdrawals',
      items: [
        'Withdrawals are available only after investment maturity',
        'New users can withdraw 50% after 3 months, 100% after 6 months',
        'All withdrawal requests require referrer approval',
        'Bank details must be verified before online withdrawals',
        'Processing time: 24-48 hours for online, immediate for physical'
      ]
    },
    {
      category: 'Referral Program',
      items: [
        'Share your unique referral code to invite new members',
        'Earn commissions on investments made by your network',
        'Commission rates decrease with network depth (Level 1: 5%, Level 2: 3%, Level 3: 1%)',
        'Referral bonuses are credited after the referred user\'s investment is approved',
        'Inactive referrals (no investment in 90 days) do not count towards your network'
      ]
    },
    {
      category: 'Prohibited Activities',
      items: [
        'Creating fake or duplicate accounts',
        'Sharing login credentials with others',
        'Using automated bots or scripts',
        'Money laundering or fraudulent activities',
        'Harassment of other users or support staff'
      ]
    }
  ];

  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
        Platform Rules & Guidelines
      </h1>
      
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
        Please read and understand these rules before using the AurumX platform. 
        Violation of these rules may result in account suspension or termination.
      </p>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-12 flex gap-4">
        <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-amber-700 dark:text-amber-300 mb-2">Important Notice</h3>
          <p className="text-amber-700/80 dark:text-amber-300/80 text-sm">
            By using AurumX, you agree to abide by all rules and guidelines. We reserve the right to 
            modify these rules at any time. Users will be notified of significant changes via email.
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {rules.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                {sectionIndex + 1}
              </span>
              {section.category}
            </h2>
            <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <ul className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    {section.category === 'Prohibited Activities' ? (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Ready to Join?</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          By creating an account, you acknowledge that you have read and agree to these rules.
        </p>
        <button
          onClick={() => router.push('/signup')}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all hover:scale-105"
        >
          Create Account
        </button>
      </div>
    </>
  );
}
