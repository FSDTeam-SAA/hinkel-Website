const RECENT_EMAIL_VERIFICATION_KEY = "hinkle:recent-email-verification";
const RECENT_EMAIL_VERIFICATION_TTL_MS = 2 * 60 * 1000;

type RecentEmailVerification = {
  email: string;
  verifiedAt: number;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const readRecentEmailVerification = (): RecentEmailVerification | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(RECENT_EMAIL_VERIFICATION_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as RecentEmailVerification;

    if (!parsed.email || typeof parsed.verifiedAt !== "number") {
      window.sessionStorage.removeItem(RECENT_EMAIL_VERIFICATION_KEY);
      return null;
    }

    if (Date.now() - parsed.verifiedAt > RECENT_EMAIL_VERIFICATION_TTL_MS) {
      window.sessionStorage.removeItem(RECENT_EMAIL_VERIFICATION_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.sessionStorage.removeItem(RECENT_EMAIL_VERIFICATION_KEY);
    return null;
  }
};

export const markEmailAsRecentlyVerified = (email: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    RECENT_EMAIL_VERIFICATION_KEY,
    JSON.stringify({
      email: normalizeEmail(email),
      verifiedAt: Date.now(),
    } satisfies RecentEmailVerification),
  );
};

export const wasEmailRecentlyVerified = (email: string) => {
  const verification = readRecentEmailVerification();

  if (!verification) {
    return false;
  }

  return verification.email === normalizeEmail(email);
};

export const clearRecentEmailVerification = (email?: string) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!email) {
    window.sessionStorage.removeItem(RECENT_EMAIL_VERIFICATION_KEY);
    return;
  }

  const verification = readRecentEmailVerification();

  if (verification?.email === normalizeEmail(email)) {
    window.sessionStorage.removeItem(RECENT_EMAIL_VERIFICATION_KEY);
  }
};
