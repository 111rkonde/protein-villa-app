import bcrypt from 'bcryptjs';

// Pre-computed dummy hash for timing attack mitigation on failed user lookups
const DUMMY_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const dummyPasswordCompare = async (password: string): Promise<boolean> => {
  return bcrypt.compare(password, DUMMY_HASH);
};
