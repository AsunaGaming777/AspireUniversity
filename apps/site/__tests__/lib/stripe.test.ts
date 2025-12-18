import { describe, it, expect } from 'vitest';
import { getPlanPrice, getPlanName, getPlanDescription, STRIPE_CONFIG } from '@/lib/stripe';

describe('Stripe utilities', () => {
  describe('getPlanPrice', () => {
    it('should return correct price for standard plan', () => {
      expect(getPlanPrice('standard')).toBe(497);
    });

    it('should return correct price for mastery plan', () => {
      expect(getPlanPrice('mastery')).toBe(997);
    });

    it('should return correct price for mastermind plan', () => {
      expect(getPlanPrice('mastermind')).toBe(197);
    });
  });

  describe('getPlanName', () => {
    it('should return correct name for each plan', () => {
      expect(getPlanName('standard')).toBe('Standard');
      expect(getPlanName('mastery')).toBe('Mastery');
      expect(getPlanName('mastermind')).toBe('Mastermind');
    });
  });

  describe('getPlanDescription', () => {
    it('should return description for each plan', () => {
      expect(getPlanDescription('standard')).toBe('Complete AI mastery course');
      expect(getPlanDescription('mastery')).toBe('Complete course + capstone coaching');
      expect(getPlanDescription('mastermind')).toBe('Ongoing access + community');
    });
  });

  describe('STRIPE_CONFIG', () => {
    it('should have correct plan configurations', () => {
      expect(STRIPE_CONFIG.plans.standard.price).toBe(49700);
      expect(STRIPE_CONFIG.plans.standard.currency).toBe('usd');
      expect(STRIPE_CONFIG.plans.standard.interval).toBeNull();

      expect(STRIPE_CONFIG.plans.mastermind.interval).toBe('month');
    });

    it('should have webhook secret configured', () => {
      expect(STRIPE_CONFIG.webhookSecret).toBeDefined();
    });

    it('should have success and cancel URLs', () => {
      expect(STRIPE_CONFIG.successUrl).toContain('/dashboard');
      expect(STRIPE_CONFIG.cancelUrl).toContain('/pricing');
    });
  });
});
import { getPlanPrice, getPlanName, getPlanDescription, STRIPE_CONFIG } from '@/lib/stripe';

describe('Stripe utilities', () => {
  describe('getPlanPrice', () => {
    it('should return correct price for standard plan', () => {
      expect(getPlanPrice('standard')).toBe(497);
    });

    it('should return correct price for mastery plan', () => {
      expect(getPlanPrice('mastery')).toBe(997);
    });

    it('should return correct price for mastermind plan', () => {
      expect(getPlanPrice('mastermind')).toBe(197);
    });
  });

  describe('getPlanName', () => {
    it('should return correct name for each plan', () => {
      expect(getPlanName('standard')).toBe('Standard');
      expect(getPlanName('mastery')).toBe('Mastery');
      expect(getPlanName('mastermind')).toBe('Mastermind');
    });
  });

  describe('getPlanDescription', () => {
    it('should return description for each plan', () => {
      expect(getPlanDescription('standard')).toBe('Complete AI mastery course');
      expect(getPlanDescription('mastery')).toBe('Complete course + capstone coaching');
      expect(getPlanDescription('mastermind')).toBe('Ongoing access + community');
    });
  });

  describe('STRIPE_CONFIG', () => {
    it('should have correct plan configurations', () => {
      expect(STRIPE_CONFIG.plans.standard.price).toBe(49700);
      expect(STRIPE_CONFIG.plans.standard.currency).toBe('usd');
      expect(STRIPE_CONFIG.plans.standard.interval).toBeNull();

      expect(STRIPE_CONFIG.plans.mastermind.interval).toBe('month');
    });

    it('should have webhook secret configured', () => {
      expect(STRIPE_CONFIG.webhookSecret).toBeDefined();
    });

    it('should have success and cancel URLs', () => {
      expect(STRIPE_CONFIG.successUrl).toContain('/dashboard');
      expect(STRIPE_CONFIG.cancelUrl).toContain('/pricing');
    });
  });
});


