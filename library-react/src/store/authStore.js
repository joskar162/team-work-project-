import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const USERS_KEY = 'library-users';
const LOGIN_ATTEMPTS_KEY = 'library-login-attempts';
const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 60 * 60 * 1000;

function getLoginAttempts() {
  return JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '{}');
}

function setLoginAttempts(attempts) {
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
}

function formatRemainingTime(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || 'null');
const demoUsers = storedUsers || [
  { id: 1, name: 'Admin User', email: 'admin@library.com', password: 'Admin123!', role: 'admin' },
  { id: 2, name: 'Librarian User', email: 'librarian@library.com', password: 'Lib12345!', role: 'librarian' },
  { id: 3, name: 'Member User', email: 'member@library.com', password: 'Member123!', role: 'member' },
];

if (!storedUsers) {
  localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
}

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      pendingEmail: null,
      otpSent: false,
      otpVerified: false,
      registeredUsers: demoUsers,
      getUsers: () => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        return users;
      },
      addUser: (userData) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const exists = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
        if (exists) {
          return { ok: false, message: 'User already exists' };
        }
        const newUser = { ...userData, id: Date.now() };
        const updatedUsers = [...users, newUser];
        localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
        set({ registeredUsers: updatedUsers });
        return { ok: true, user: newUser };
      },
      sendOTP: (email) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!found) {
          return { ok: false, message: 'User not found' };
        }
        const otp = generateOTP();
        localStorage.setItem(`otp-${email}`, otp);
        
        if (typeof window !== 'undefined') {
          window.alert(`OTP for ${email}: ${otp}`);
        }
        console.log(`OTP for ${email}: ${otp}`);
        
        set({ pendingEmail: email, otpSent: true, otpVerified: false });
        return { ok: true, message: `OTP sent to ${email}`, otp };
      },
      verifyOTP: (email, otp) => {
        const storedOTP = localStorage.getItem(`otp-${email}`);
        if (storedOTP !== otp) {
          return { ok: false, message: 'Invalid OTP' };
        }
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        const safeUser = {
          id: found.id,
          name: found.name,
          email: found.email,
          role: found.role,
        };
        set({ user: safeUser, token: `demo-token-${found.id}`, otpVerified: true, otpSent: false });
        localStorage.removeItem(`otp-${email}`);
        return { ok: true, user: safeUser };
      },
      login: ({ email, password }) => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const normalizedEmail = email.trim().toLowerCase();
        const attempts = getLoginAttempts();
        const entry = attempts[normalizedEmail] || { failedCount: 0, lockedUntil: 0 };
        const now = Date.now();

        if (entry.lockedUntil && entry.lockedUntil > now) {
          const remaining = formatRemainingTime(entry.lockedUntil - now);
          return {
            ok: false,
            message: `Account suspended. Try again in ${remaining}`,
            lockedUntil: entry.lockedUntil,
          };
        }

        const found = users.find((user) => user.email.toLowerCase() === normalizedEmail);

        if (!found || found.password !== password) {
          if (found) {
            const nextFailedCount = Number(entry.failedCount || 0) + 1;

            if (nextFailedCount >= MAX_FAILED_ATTEMPTS) {
              const lockedUntil = now + LOCKOUT_DURATION_MS;
              attempts[normalizedEmail] = { failedCount: 0, lockedUntil };
              setLoginAttempts(attempts);
              return {
                ok: false,
                message: 'Too many incorrect passwords. Account suspended for 1 hour.',
                lockedUntil,
              };
            }

            attempts[normalizedEmail] = { failedCount: nextFailedCount, lockedUntil: 0 };
            setLoginAttempts(attempts);

            const attemptsLeft = MAX_FAILED_ATTEMPTS - nextFailedCount;
            return {
              ok: false,
              message: `Invalid credentials. ${attemptsLeft} attempt(s) left before 1-hour suspension.`,
            };
          }

          return { ok: false, message: 'Invalid credentials' };
        }

        if (attempts[normalizedEmail]) {
          delete attempts[normalizedEmail];
          setLoginAttempts(attempts);
        }

        const safeUser = {
          id: found.id,
          name: found.name,
          email: found.email,
          role: found.role,
        };

        set({ user: safeUser, token: `demo-token-${found.id}` });
        return { ok: true, user: safeUser };
      },
      resetOTPState: () => set({ pendingEmail: null, otpSent: false, otpVerified: false }),
      logout: () => set({ user: null, token: null, pendingEmail: null, otpSent: false, otpVerified: false }),
    }),
    {
      name: 'library-auth-store',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
