'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: "What's included in the course?",
    answer: "The course includes 9 comprehensive modules covering AI foundations, business applications, coding, design, finance, security, and personal productivity. You'll get 50+ video lessons, downloadable code assets, quizzes, assignments, and a certificate of completion."
  },
  {
    question: "Do I need any prior experience with AI?",
    answer: "No prior experience required! The course starts from absolute basics and takes you to advanced levels. We cover everything from understanding how AI works to building production-ready applications."
  },
  {
    question: "How long does it take to complete?",
    answer: "The course is self-paced, but most students complete it in 4-6 weeks with 5-10 hours per week. The total content is approximately 30+ hours of video lessons plus hands-on projects."
  },
  {
    question: "What if I'm not satisfied with the course?",
    answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied, contact us within 30 days for a full refund, no questions asked."
  },
  {
    question: "Do I get lifetime access?",
    answer: "Yes! With the Standard and Mastery plans, you get lifetime access to all course materials, including future updates and new content we add."
  },
  {
    question: "What's the difference between the plans?",
    answer: "Standard includes all course content and lifetime access. Mastery adds live calls, exclusive capstone projects, and 1-on-1 office hours. Subscription gives you monthly access with ongoing updates."
  },
  {
    question: "Are there any prerequisites?",
    answer: "Basic computer skills and a willingness to learn are all you need. We provide setup guides for all tools and environments. No coding experience required for most modules."
  },
  {
    question: "Can I get a certificate?",
    answer: "Yes! Upon completion of all modules and assignments, you'll receive a certificate of completion that you can share on LinkedIn and your resume."
  },
  {
    question: "Is the course updated regularly?",
    answer: "Absolutely! AI moves fast, so we update the course monthly with new tools, techniques, and real-world applications. Subscribers get immediate access to all updates."
  },
  {
    question: "What support do you provide?",
    answer: "We provide email support for all students, priority support for Mastery students, and community access where you can ask questions and get help from instructors and fellow students."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-32 bg-background relative">
      <div className="container-width relative z-10">
        <div className="text-center mb-20">
            <span className="text-brand-gold uppercase tracking-widest text-sm font-semibold mb-4 block">Support</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Everything you need to know about your journey to mastery.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`glass-panel overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-brand-gold/30 bg-white/5' : 'hover:border-white/20'}`}
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className={`text-lg font-medium transition-colors ${openIndex === index ? 'text-brand-gold' : 'text-white'}`}>
                    {faq.question}
                  </span>
                  <div className={`p-1 rounded-full border transition-all duration-300 ${openIndex === index ? 'bg-brand-gold border-brand-gold rotate-180' : 'border-white/20 text-muted-foreground'}`}>
                     <ChevronDown className={`w-4 h-4 ${openIndex === index ? 'text-black' : 'text-white'}`} />
                  </div>
                </button>
                
                <div 
                    className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed">
                        {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="text-center mt-20">
          <div className="glass-panel inline-flex flex-col md:flex-row items-center gap-6 px-10 py-8 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <HelpCircle className="w-6 h-6 text-brand-gold" />
            </div>
            <div className="text-left">
                <h3 className="text-lg font-bold text-white mb-1">Still have questions?</h3>
                <p className="text-muted-foreground text-sm">Our support team is available 24/7 to assist you.</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
                <a href="mailto:support@aspire.com" className="btn-luxury text-xs px-6 py-3">
                    Contact Support
                </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
