"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { Button } from "@aspire/ui";
import { STRIPE_PLANS } from "@/lib/stripe";
import { Check, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const plans = ["standard", "mastery", "mastermind"] as const;

const planBackgrounds = {
  standard: "/pricing-standard.png",
  mastery: "/pricing-mastery.png",
  mastermind: "/pricing-mastermind.png",
};

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [userSubscription, setUserSubscription] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetch("/api/user/subscription")
        .then((res) => res.json())
        .then((data) => {
          if (data.subscription?.plan) {
            setUserSubscription(data.subscription.plan);
          }
        })
        .catch(() => {
          // Silently fail if subscription endpoint doesn't exist
        });
    }
  }, [user]);

  const handlePurchase = async (plan: typeof plans[number]) => {
    if (!user) {
      router.push("/auth/signin?callbackUrl=/pricing");
      return;
    }

    setLoading(plan);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          referralCode: referralCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to start checkout process. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-32">
      <div className="container-width">
        <div className="text-center mb-20">
          <span className="text-brand-gold uppercase tracking-widest text-sm font-semibold mb-4 block">Investment</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 text-white">
            Choose Your <span className="text-gradient-gold">Trajectory</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-3xl mx-auto">
            Transform your career with comprehensive AI education. All plans include lifetime access.
          </p>
        </div>

        {/* Referral Code Input */}
        {!user && (
          <div className="max-w-md mx-auto mb-12">
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Have a referral code?
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent focus:outline-none"
                />
                <Button
                  onClick={() => router.push("/auth/signin?callbackUrl=/pricing")}
                  variant="outline"
                  className="rounded-lg"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
          {plans.map((plan) => {
            return (
              <div
                key={plan}
                className="glass-card relative p-8 md:p-10 transition-all duration-300 hover:-translate-y-2 overflow-hidden h-[600px] flex flex-col"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={planBackgrounds[plan]}
                    alt={`${plan} plan background`}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col flex-grow pt-16">
                  <div className="mb-8">
                    <p className="text-muted-foreground text-sm h-10">
                      {plan === "standard" && "The essential toolkit for AI literacy and application."}
                      {plan === "mastery" && "For professionals demanding elite-level capability."}
                      {plan === "mastermind" && "Continuous evolution with the bleeding edge of AI."}
                    </p>
                  </div>

                  <div className="mb-8 p-4 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white tracking-tight">
                        ${STRIPE_PLANS[plan].amount / 100}
                      </span>
                      {plan === "mastermind" && (
                        <span className="text-muted-foreground text-sm">/month</span>
                      )}
                    </div>
                  </div>

                  <ul className={`space-y-4 text-sm ${plan === "mastermind" ? "mb-4" : "mb-4 flex-grow"}`}>
                    {STRIPE_PLANS[plan].features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-brand-gold" />
                        </div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    {(() => {
                      // Determine button text and action based on current subscription
                      const planOrder = { standard: 1, mastery: 2, mastermind: 3 };
                      const currentPlanOrder = userSubscription ? planOrder[userSubscription as keyof typeof planOrder] : 0;
                      const targetPlanOrder = planOrder[plan as keyof typeof planOrder];
                      
                      if (userSubscription === plan) {
                        // Current plan
                        return (
                          <button
                            disabled
                            className="w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-brand-gold/20 text-brand-gold border border-brand-gold/30 cursor-not-allowed"
                          >
                            Current Plan
                          </button>
                        );
                      } else if (!userSubscription) {
                        // No subscription - show Get Started
                        return (
                          <>
                            <button
                              onClick={() => handlePurchase(plan)}
                              disabled={loading === plan}
                              className="w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-white text-brand-black hover:bg-brand-gold hover:shadow-[0_0_20px_rgba(245,215,110,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loading === plan ? "Processing..." : "Get Started"}
                              {!loading && <ArrowRight className="w-4 h-4" />}
                            </button>
                            {!user && (
                              <p className="text-xs text-muted-foreground text-center mt-4">
                                Sign in required to purchase
                              </p>
                            )}
                          </>
                        );
                      } else if (targetPlanOrder > currentPlanOrder) {
                        // Upgrade
                        return (
                          <button
                            onClick={() => handlePurchase(plan)}
                            disabled={loading === plan}
                            className="w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-white text-brand-black hover:bg-brand-gold hover:shadow-[0_0_20px_rgba(245,215,110,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading === plan ? "Processing..." : "Upgrade"}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                          </button>
                        );
                      } else {
                        // Downgrade
                        return (
                          <button
                            onClick={() => handlePurchase(plan)}
                            disabled={loading === plan}
                            className="w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading === plan ? "Processing..." : "Downgrade"}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                          </button>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Seal */}
        <div className="mt-20 flex justify-center">
          <div className="glass-panel px-8 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">Risk-Free Guarantee</p>
              <p className="text-muted-foreground text-xs">30-day money-back guarantee on all plans.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-brand-gold uppercase tracking-widest text-sm font-semibold mb-4 block">Support</span>
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Frequently Asked <span className="text-gradient-gold">Questions</span>
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-panel p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const faqs = [
  {
    question: "What's included in each plan?",
    answer: "All plans include the complete AI mastery curriculum with video lessons, assignments, and community access. Mastery adds 1-on-1 coaching, and Mastermind provides ongoing live sessions and exclusive content updates.",
  },
  {
    question: "Do I get lifetime access?",
    answer: "Standard and Mastery plans include lifetime access to all course materials. Mastermind is a monthly subscription that includes ongoing content updates and live sessions.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer: "Yes! You can upgrade from Standard to Mastery or Mastermind at any time. Contact support for upgrade options and pricing.",
  },
  {
    question: "What if I'm not satisfied?",
    answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with your purchase, contact us for a full refund.",
  },
  {
    question: "Are there any prerequisites?",
    answer: "No technical prerequisites required! Our course is designed for complete beginners, though some coding experience helps with advanced modules.",
  },
];
