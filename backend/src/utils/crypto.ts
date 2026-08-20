import crypto from 'crypto';

// Master 256-bit encryption key derived from environment secret with SHA-256
const MASTER_SECRET =
  process.env.BANK_ENCRYPTION_KEY ||
  process.env.JWT_SECRET ||
  'protein_villa_super_secure_vault_encryption_master_key_2026_aes256gcm';

const ENCRYPTION_KEY = crypto.createHash('sha256').update(MASTER_SECRET).digest(); // 32 bytes (256 bits)
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits IV for GCM

/**
 * Encrypt sensitive bank financial data using high level encryption security.
 * Includes randomized 128-bit Initialization Vector (IV) and 128-bit GCM Auth Tag.
 *
 * Output format: enc:gcm:<iv_hex>:<tag_hex>:<cipher_hex>
 */
export function encryptBankData(plainText: string): string {
  if (!plainText) return plainText;

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return `enc:gcm:${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt bank financial ciphertext with GCM integrity verification.
 * If data or tag has been tampered with in storage, decryption fails immediately.
 */
export function decryptBankData(cipherText: string): string {
  if (!cipherText || !cipherText.startsWith('enc:gcm:')) {
    // If not encrypted (e.g. legacy/plain), return as-is
    return cipherText;
  }

  try {
    const parts = cipherText.split(':');
    if (parts.length !== 5) {
      throw new Error('Invalid encrypted payload structure.');
    }

    const iv = Buffer.from(parts[2], 'hex');
    const authTag = Buffer.from(parts[3], 'hex');
    const encryptedText = parts[4];

    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error: any) {
    console.error('🚨 [CRYPTO ERROR] Bank data decryption failed or integrity check violated:', error.message);
    return '•••• •••• ••••';
  }
}

/**
 * Mask account number for safe display (e.g., '•••• •••• •••• 8234')
 */
export function maskAccountNumber(accountNumber: string): string {
  const decrypted = decryptBankData(accountNumber);
  const clean = decrypted.replace(/\s+/g, '');
  if (clean.length <= 4) return clean;
  return `•••• •••• •••• ${clean.slice(-4)}`;
}
