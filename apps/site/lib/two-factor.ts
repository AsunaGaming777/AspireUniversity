// Optional dependencies - will use dynamic imports
export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export async function generateTwoFactorSecret(email: string): Promise<TwoFactorSetup> {
  try {
    const speakeasy = await import("speakeasy");
    const secret = speakeasy.default.generateSecret({
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
  } catch (error) {
    throw new Error("2FA feature requires 'speakeasy' package. Please install it: pnpm add speakeasy");
  }
}

export async function verifyTOTP(secret: string, token: string): Promise<boolean> {
  try {
    const speakeasy = await import("speakeasy");
    return speakeasy.default.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 2, // Allow 2 time steps before/after
    });
  } catch (error) {
    throw new Error("2FA feature requires 'speakeasy' package. Please install it: pnpm add speakeasy");
  }
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
    const QRCode = await import("qrcode");
    return await QRCode.default.toDataURL(dataUrl);
  } catch (error) {
    throw new Error("QR code generation requires 'qrcode' package. Please install it: pnpm add qrcode");
  }
}

export function validateBackupCode(backupCodes: string[], code: string): boolean {
  return backupCodes.includes(code.toUpperCase());
}
