import speakeasy from "speakeasy";
import QRCode from "qrcode";

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export function generateTwoFactorSecret(email: string): TwoFactorSetup {
  const secret = speakeasy.generateSecret({
    name: `Aspire (${email})`,
    issuer: "Aspire Academy",
    length: 32,
  });

  const backupCodes = generateBackupCodes();

  return {
    secret: secret.base32,
    qrCodeUrl: secret.otpauth_url!,
    backupCodes,
  };
}

export function verifyTOTP(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 2, // Allow 2 time steps before/after
  });
}

export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    codes.push(generateRandomCode());
  }
  return codes;
}

function generateRandomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateQRCode(dataUrl: string): Promise<string> {
  try {
    return await QRCode.toDataURL(dataUrl);
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
}

export function validateBackupCode(backupCodes: string[], code: string): boolean {
  return backupCodes.includes(code.toUpperCase());
}
import QRCode from "qrcode";

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export function generateTwoFactorSecret(email: string): TwoFactorSetup {
  const secret = speakeasy.generateSecret({
    name: `Aspire (${email})`,
    issuer: "Aspire Academy",
    length: 32,
  });

  const backupCodes = generateBackupCodes();

  return {
    secret: secret.base32,
    qrCodeUrl: secret.otpauth_url!,
    backupCodes,
  };
}

export function verifyTOTP(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 2, // Allow 2 time steps before/after
  });
}

export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    codes.push(generateRandomCode());
  }
  return codes;
}

function generateRandomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function generateQRCode(dataUrl: string): Promise<string> {
  try {
    return await QRCode.toDataURL(dataUrl);
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
}

export function validateBackupCode(backupCodes: string[], code: string): boolean {
  return backupCodes.includes(code.toUpperCase());
}


