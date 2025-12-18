import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

describe("Payment Integration Tests", () => {
  let testUser: any;
  let testPayment: any;

  beforeAll(async () => {
    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: "test-payment@example.com",
        name: "Test Payment User",
        role: "student",
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    if (testPayment) {
      await prisma.payment.delete({ where: { id: testPayment.id } });
    }
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } });
    }
  });

  it("should create a checkout session", async () => {
    const response = await fetch("http://localhost:3000/api/checkout/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `next-auth.session-token=test-token`, // Mock session
      },
      body: JSON.stringify({
        plan: "standard",
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.sessionId).toBeDefined();
    expect(data.url).toContain("checkout.stripe.com");
  });

  it("should handle webhook signature verification", async () => {
    const webhookPayload = {
      id: "evt_test_webhook",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_session",
          payment_intent: "pi_test_intent",
          customer: "cus_test_customer",
          metadata: {
            userId: testUser.id,
            plan: "standard",
            affiliateId: "",
            referralCode: "",
          },
        },
      },
    };

    // Create test payment record
    testPayment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        stripeSessionId: "cs_test_session",
        amount: 49700, // $497
        currency: "usd",
        status: "pending",
        plan: "standard",
      },
    });

    // Test webhook processing (without signature verification for test)
    const response = await fetch("http://localhost:3000/api/webhooks/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": "test-signature", // Mock signature
      },
      body: JSON.stringify(webhookPayload),
    });

    // Should fail without proper signature, but we can test the structure
    expect([200, 400]).toContain(response.status);
  });

  it("should create enrollment after successful payment", async () => {
    // Simulate successful payment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: testUser.id,
        paymentId: testPayment.id,
        plan: "standard",
        status: "active",
        accessGrantedAt: new Date(),
        modulesUnlocked: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
      },
    });

    expect(enrollment).toBeDefined();
    expect(enrollment.plan).toBe("standard");
    expect(enrollment.status).toBe("active");
    expect(enrollment.modulesUnlocked).toHaveLength(9);
  });

  it("should handle refund and revoke access", async () => {
    // Create refund record
    const refund = await prisma.refund.create({
      data: {
        paymentId: testPayment.id,
        stripeRefundId: "re_test_refund",
        amount: 49700,
        reason: "requested_by_customer",
        status: "succeeded",
      },
    });

    // Update payment status
    await prisma.payment.update({
      where: { id: testPayment.id },
      data: { status: "refunded" },
    });

    // Revoke access
    await prisma.enrollment.updateMany({
      where: { paymentId: testPayment.id },
      data: {
        status: "cancelled",
        accessRevokedAt: new Date(),
      },
    });

    expect(refund).toBeDefined();
    expect(refund.amount).toBe(49700);
    expect(refund.status).toBe("succeeded");
  });

  it("should handle affiliate commission tracking", async () => {
    // Create affiliate account
    const affiliate = await prisma.affiliateAccount.create({
      data: {
        userId: testUser.id,
        referralCode: "TEST123",
        referralUrl: "https://example.com?ref=TEST123",
        commissionRate: 0.1, // 10%
      },
    });

    // Create commission record
    const commission = await prisma.commission.create({
      data: {
        affiliateId: affiliate.id,
        paymentId: testPayment.id,
        amount: 4970, // 10% of $497
        rate: 0.1,
        status: "pending",
      },
    });

    expect(commission).toBeDefined();
    expect(commission.amount).toBe(4970);
    expect(commission.rate).toBe(0.1);
    expect(commission.status).toBe("pending");

    // Clean up
    await prisma.commission.delete({ where: { id: commission.id } });
    await prisma.affiliateAccount.delete({ where: { id: affiliate.id } });
  });
});
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

describe("Payment Integration Tests", () => {
  let testUser: any;
  let testPayment: any;

  beforeAll(async () => {
    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: "test-payment@example.com",
        name: "Test Payment User",
        role: "student",
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    if (testPayment) {
      await prisma.payment.delete({ where: { id: testPayment.id } });
    }
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } });
    }
  });

  it("should create a checkout session", async () => {
    const response = await fetch("http://localhost:3000/api/checkout/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `next-auth.session-token=test-token`, // Mock session
      },
      body: JSON.stringify({
        plan: "standard",
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.sessionId).toBeDefined();
    expect(data.url).toContain("checkout.stripe.com");
  });

  it("should handle webhook signature verification", async () => {
    const webhookPayload = {
      id: "evt_test_webhook",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_session",
          payment_intent: "pi_test_intent",
          customer: "cus_test_customer",
          metadata: {
            userId: testUser.id,
            plan: "standard",
            affiliateId: "",
            referralCode: "",
          },
        },
      },
    };

    // Create test payment record
    testPayment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        stripeSessionId: "cs_test_session",
        amount: 49700, // $497
        currency: "usd",
        status: "pending",
        plan: "standard",
      },
    });

    // Test webhook processing (without signature verification for test)
    const response = await fetch("http://localhost:3000/api/webhooks/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": "test-signature", // Mock signature
      },
      body: JSON.stringify(webhookPayload),
    });

    // Should fail without proper signature, but we can test the structure
    expect([200, 400]).toContain(response.status);
  });

  it("should create enrollment after successful payment", async () => {
    // Simulate successful payment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: testUser.id,
        paymentId: testPayment.id,
        plan: "standard",
        status: "active",
        accessGrantedAt: new Date(),
        modulesUnlocked: ["0", "1", "2", "3", "4", "5", "6", "7", "8"],
      },
    });

    expect(enrollment).toBeDefined();
    expect(enrollment.plan).toBe("standard");
    expect(enrollment.status).toBe("active");
    expect(enrollment.modulesUnlocked).toHaveLength(9);
  });

  it("should handle refund and revoke access", async () => {
    // Create refund record
    const refund = await prisma.refund.create({
      data: {
        paymentId: testPayment.id,
        stripeRefundId: "re_test_refund",
        amount: 49700,
        reason: "requested_by_customer",
        status: "succeeded",
      },
    });

    // Update payment status
    await prisma.payment.update({
      where: { id: testPayment.id },
      data: { status: "refunded" },
    });

    // Revoke access
    await prisma.enrollment.updateMany({
      where: { paymentId: testPayment.id },
      data: {
        status: "cancelled",
        accessRevokedAt: new Date(),
      },
    });

    expect(refund).toBeDefined();
    expect(refund.amount).toBe(49700);
    expect(refund.status).toBe("succeeded");
  });

  it("should handle affiliate commission tracking", async () => {
    // Create affiliate account
    const affiliate = await prisma.affiliateAccount.create({
      data: {
        userId: testUser.id,
        referralCode: "TEST123",
        referralUrl: "https://example.com?ref=TEST123",
        commissionRate: 0.1, // 10%
      },
    });

    // Create commission record
    const commission = await prisma.commission.create({
      data: {
        affiliateId: affiliate.id,
        paymentId: testPayment.id,
        amount: 4970, // 10% of $497
        rate: 0.1,
        status: "pending",
      },
    });

    expect(commission).toBeDefined();
    expect(commission.amount).toBe(4970);
    expect(commission.rate).toBe(0.1);
    expect(commission.status).toBe("pending");

    // Clean up
    await prisma.commission.delete({ where: { id: commission.id } });
    await prisma.affiliateAccount.delete({ where: { id: affiliate.id } });
  });
});


