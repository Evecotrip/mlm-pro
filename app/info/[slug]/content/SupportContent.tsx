'use client';

import { useRouter } from 'next/navigation';
import { Mail, Phone, MessageCircle, Clock, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function SupportContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      value: 'support@AurumX.com',
      color: 'blue'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us directly',
      value: '+91 1800-XXX-XXXX',
      color: 'emerald'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our team',
      value: 'Available 9 AM - 9 PM',
      color: 'purple'
    }
  ];

  return (
    <>
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
          How Can We Help?
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Our support team is here to assist you. Choose your preferred method of contact or send us a message.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {contactMethods.map((method, index) => (
          <div
            key={index}
            className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:-translate-y-1"
          >
            <div className={`w-16 h-16 bg-${method.color}-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
              <method.icon className={`w-8 h-8 text-${method.color}-600 dark:text-${method.color}-400`} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{method.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{method.description}</p>
            <p className="text-slate-900 dark:text-white font-medium">{method.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send us a Message</h2>
          
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white resize-none"
                  placeholder="Describe your issue or question..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Support Hours</h3>
            </div>
            <div className="space-y-3 text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="font-medium text-slate-900 dark:text-white">9:00 AM - 9:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="font-medium text-slate-900 dark:text-white">10:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="font-medium text-slate-900 dark:text-white">Closed</span>
              </div>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Office Location</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              AurumX Headquarters<br />
              Nizhneilimsky District <br />
              Irkutsk Oblast 665699 <br/>
              Russia
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/info/faq')}
                className="block w-full text-left text-blue-100 hover:text-white transition-colors"
              >
                → Frequently Asked Questions
              </button>
              <button
                onClick={() => router.push('/info/rules')}
                className="block w-full text-left text-blue-100 hover:text-white transition-colors"
              >
                → Platform Rules & Guidelines
              </button>
              <button
                onClick={() => router.push('/info/about')}
                className="block w-full text-left text-blue-100 hover:text-white transition-colors"
              >
                → About AurumX
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">Find Us</h2>
        <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8676.46107200948!2d103.62303327896093!3d57.06667774335652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5cfa4fecbe9c536b%3A0xf9c0cc1b0ca8df4f!2sYangel&#39;%2C%20Irkutsk%20Oblast%2C%20Russia%2C%20665699!5e0!3m2!1sen!2sin!4v1765878224642!5m2!1sen!2sin" 
            width="100%" 
            height="450" 
            style={{ border: 0, borderRadius: '1rem' }}
            allowFullScreen
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </div>
      </div>
    </>
  );
}
