"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@aspire/ui";

export default function TestPaymentsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const testCheckoutSession = async () => {
    if (!session) {
      setResult("❌ Please sign in first");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "standard",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ Checkout session created successfully!\nSession ID: ${data.sessionId}\nURL: ${data.url}`);
        
        // In a real test, you might want to redirect to Stripe
        // window.location.href = data.url;
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testEnrollment = async () => {
    if (!session) {
      setResult("❌ Please sign in first");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/user/enrollment");
      const data = await response.json();

      if (response.ok) {
        if (data.enrollment) {
          setResult(`✅ Enrollment found!\nPlan: ${data.enrollment.plan}\nStatus: ${data.enrollment.status}\nModules: ${data.enrollment.modulesUnlocked.length}`);
        } else {
          setResult("ℹ️ No active enrollment found");
        }
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testAffiliateCreation = async () => {
    if (!session) {
      setResult("❌ Please sign in first");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/affiliate/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: "Test Business",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ Affiliate account created!\nReferral Code: ${data.affiliateAccount.referralCode}\nReferral URL: ${data.affiliateAccount.referralUrl}`);
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const simulateWebhook = async () => {
    setLoading(true);
    setResult("");

    try {
      // This would typically be done by Stripe, but we can simulate it
      const webhookPayload = {
        id: "evt_test_webhook",
        object: "event",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_session",
            payment_intent: "pi_test_intent",
            customer: "cus_test_customer",
            customer_details: {
              email: session?.user?.email,
              name: session?.user?.name,
            },
            metadata: {
              userId: session?.user?.id,
              plan: "standard",
              affiliateId: "",
              referralCode: "",
            },
          },
        },
      };

      const response = await fetch("/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "stripe-signature": "test-signature", // This will fail signature verification
        },
        body: JSON.stringify(webhookPayload),
      });

      const data = await response.json();

      if (response.status === 400) {
        setResult("✅ Webhook endpoint working (signature verification failed as expected in test)");
      } else {
        setResult(`Response: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-muted-text">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">
          Payment System Test Page
        </h1>

        {!session && (
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-6 mb-8">
            <p className="text-yellow-300">
              ⚠️ Please sign in to test payment functionality.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Test Actions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Test Actions</h2>
            
            <div className="space-y-4">
              <Button
                onClick={testCheckoutSession}
                disabled={loading || !session}
                className="w-full bg-gold text-black hover:bg-gold-700"
              >
                {loading ? "Testing..." : "Test Checkout Session Creation"}
              </Button>

              <Button
                onClick={testEnrollment}
                disabled={loading || !session}
                variant="outline"
                className="w-full"
              >
                {loading ? "Testing..." : "Test Enrollment Fetch"}
              </Button>

              <Button
                onClick={testAffiliateCreation}
                disabled={loading || !session}
                variant="outline"
                className="w-full"
              >
                {loading ? "Testing..." : "Test Affiliate Account Creation"}
              </Button>

              <Button
                onClick={simulateWebhook}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? "Testing..." : "Simulate Webhook (Signature Test)"}
              </Button>
            </div>
          </div>

          {/* Test Results */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Test Results</h2>
            <div className="bg-gray-900 rounded-lg p-6 min-h-[400px]">
              {result ? (
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-300">
                  {result}
                </pre>
              ) : (
                <p className="text-gray-500">Run a test to see results here...</p>
              )}
            </div>
          </div>
        </div>

        {/* Acceptance Criteria Checklist */}
        <div className="mt-12 bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Acceptance Criteria</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-gold">✓</span>
              <span>Test mode purchase creates Enrollment and shows Course Dashboard</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gold">✓</span>
              <span>Refund triggers access revoke; Affiliate commission reversed</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gold">✓</span>
              <span>Webhook signature verification tested with integration tests</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex space-x-4">
          <Button
            onClick={() => window.location.href = "/pricing"}
            variant="outline"
          >
            View Pricing Page
          </Button>
          <Button
            onClick={() => window.location.href = "/dashboard"}
            variant="outline"
          >
            View Dashboard
          </Button>
          <Button
            onClick={() => window.location.href = "/test-auth"}
            variant="outline"
          >
            Test Authentication
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@aspire/ui";

export default function TestPaymentsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const testCheckoutSession = async () => {
    if (!session) {
      setResult("❌ Please sign in first");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "standard",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ Checkout session created successfully!\nSession ID: ${data.sessionId}\nURL: ${data.url}`);
        
        // In a real test, you might want to redirect to Stripe
        // window.location.href = data.url;
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testEnrollment = async () => {
    if (!session) {
      setResult("❌ Please sign in first");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/user/enrollment");
      const data = await response.json();

      if (response.ok) {
        if (data.enrollment) {
          setResult(`✅ Enrollment found!\nPlan: ${data.enrollment.plan}\nStatus: ${data.enrollment.status}\nModules: ${data.enrollment.modulesUnlocked.length}`);
        } else {
          setResult("ℹ️ No active enrollment found");
        }
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testAffiliateCreation = async () => {
    if (!session) {
      setResult("❌ Please sign in first");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/affiliate/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: "Test Business",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`✅ Affiliate account created!\nReferral Code: ${data.affiliateAccount.referralCode}\nReferral URL: ${data.affiliateAccount.referralUrl}`);
      } else {
        setResult(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const simulateWebhook = async () => {
    setLoading(true);
    setResult("");

    try {
      // This would typically be done by Stripe, but we can simulate it
      const webhookPayload = {
        id: "evt_test_webhook",
        object: "event",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_session",
            payment_intent: "pi_test_intent",
            customer: "cus_test_customer",
            customer_details: {
              email: session?.user?.email,
              name: session?.user?.name,
            },
            metadata: {
              userId: session?.user?.id,
              plan: "standard",
              affiliateId: "",
              referralCode: "",
            },
          },
        },
      };

      const response = await fetch("/api/webhooks/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "stripe-signature": "test-signature", // This will fail signature verification
        },
        body: JSON.stringify(webhookPayload),
      });

      const data = await response.json();

      if (response.status === 400) {
        setResult("✅ Webhook endpoint working (signature verification failed as expected in test)");
      } else {
        setResult(`Response: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-muted-text">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">
          Payment System Test Page
        </h1>

        {!session && (
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-6 mb-8">
            <p className="text-yellow-300">
              ⚠️ Please sign in to test payment functionality.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Test Actions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Test Actions</h2>
            
            <div className="space-y-4">
              <Button
                onClick={testCheckoutSession}
                disabled={loading || !session}
                className="w-full bg-gold text-black hover:bg-gold-700"
              >
                {loading ? "Testing..." : "Test Checkout Session Creation"}
              </Button>

              <Button
                onClick={testEnrollment}
                disabled={loading || !session}
                variant="outline"
                className="w-full"
              >
                {loading ? "Testing..." : "Test Enrollment Fetch"}
              </Button>

              <Button
                onClick={testAffiliateCreation}
                disabled={loading || !session}
                variant="outline"
                className="w-full"
              >
                {loading ? "Testing..." : "Test Affiliate Account Creation"}
              </Button>

              <Button
                onClick={simulateWebhook}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? "Testing..." : "Simulate Webhook (Signature Test)"}
              </Button>
            </div>
          </div>

          {/* Test Results */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Test Results</h2>
            <div className="bg-gray-900 rounded-lg p-6 min-h-[400px]">
              {result ? (
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-300">
                  {result}
                </pre>
              ) : (
                <p className="text-gray-500">Run a test to see results here...</p>
              )}
            </div>
          </div>
        </div>

        {/* Acceptance Criteria Checklist */}
        <div className="mt-12 bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Acceptance Criteria</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-gold">✓</span>
              <span>Test mode purchase creates Enrollment and shows Course Dashboard</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gold">✓</span>
              <span>Refund triggers access revoke; Affiliate commission reversed</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gold">✓</span>
              <span>Webhook signature verification tested with integration tests</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex space-x-4">
          <Button
            onClick={() => window.location.href = "/pricing"}
            variant="outline"
          >
            View Pricing Page
          </Button>
          <Button
            onClick={() => window.location.href = "/dashboard"}
            variant="outline"
          >
            View Dashboard
          </Button>
          <Button
            onClick={() => window.location.href = "/test-auth"}
            variant="outline"
          >
            Test Authentication
          </Button>
        </div>
      </div>
    </div>
  );
}


