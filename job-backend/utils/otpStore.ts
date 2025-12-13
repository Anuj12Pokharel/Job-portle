type OtpRecord = {
  code: string;
  expiresAt: number;
  identifier: string; // email or mobile used to request
};

const store: Record<string, OtpRecord> = {};
const OTP_TTL_MS = 5 * 60 * 1000;

export const setOtp = (userId: string, identifier: string, code: string) => {
  store[userId] = {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    identifier,
  };
};

export const verifyOtp = (userId: string, identifier: string, code: string) => {
  const rec = store[userId];
  if (!rec) return false;
  if (rec.identifier !== identifier) return false;
  if (Date.now() > rec.expiresAt) {
    delete store[userId];
    return false;
  }
  const ok = rec.code === code;
  if (ok) delete store[userId];
  return ok;
};

export const clearOtp = (userId: string) => {
  delete store[userId];
};


