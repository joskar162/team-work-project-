import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const demoUsers = [
  { id: 1, name: 'Admin User', email: 'admin@library.com', password: 'Admin123!', role: 'admin' },
  { id: 2, name: 'Librarian User', email: 'librarian@library.com', password: 'Lib12345!', role: 'librarian' },
  { id: 3, name: 'Member User', email: 'member@library.com', password: 'Member123!', role: 'member' },
];

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: ({ email, password }) => {
        const found = demoUsers.find(
          (demoUser) => demoUser.email.toLowerCase() === email.toLowerCase() && demoUser.password === password
        );

        if (!found) {
          return { ok: false, message: 'Invalid credentials' };
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
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'library-auth-store',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
