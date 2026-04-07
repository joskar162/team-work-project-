import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { seedBooks, seedLoans, seedMembers } from '../utils/mockData';

const DEMO_MEMBER_EMAIL = 'member@library.com';
const REQUIRED_EMAIL_DOMAIN = 'library.com';

function nextId(items) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function createLoanDates(days = 14) {
  const loanDate = new Date();
  const dueDate = new Date(loanDate);
  dueDate.setDate(loanDate.getDate() + days);

  return {
    loanDate: formatDate(loanDate),
    dueDate: formatDate(dueDate),
    daysLeft: days,
  };
}

function buildLibraryEmail(value, fallback) {
  const raw = String(value || '').trim().toLowerCase();
  const localPart = raw.includes('@') ? raw.split('@')[0] : raw;
  const cleaned = localPart.replace(/[^a-z0-9._-]/g, '') || fallback;
  return `${cleaned}@${REQUIRED_EMAIL_DOMAIN}`;
}

function normalizeMembersEmails(members) {
  const taken = new Set();

  return members.map((member) => {
    const fallback = String(member.name || `member${member.id || Date.now()}`)
      .toLowerCase()
      .replace(/\s+/g, '.');

    const preferred = buildLibraryEmail(member.email, fallback);
    const [baseLocal] = preferred.split('@');
    let local = baseLocal;
    let suffix = 1;

    while (taken.has(`${local}@${REQUIRED_EMAIL_DOMAIN}`)) {
      local = `${baseLocal}${suffix}`;
      suffix += 1;
    }

    const normalizedEmail = `${local}@${REQUIRED_EMAIL_DOMAIN}`;
    taken.add(normalizedEmail);

    return { ...member, email: normalizedEmail };
  });
}

function normalizeLibraryData(data) {
  const members = normalizeMembersEmails(Array.isArray(data.members) ? data.members : []);
  const loans = Array.isArray(data.loans) ? data.loans : [];

  let normalizedMembers = members;
  let normalizedLoans = loans;

  let demoMember = normalizedMembers.find(
    (member) => member.email?.toLowerCase() === DEMO_MEMBER_EMAIL
  );

  if (!demoMember) {
    demoMember = {
      id: nextId(normalizedMembers),
      name: 'Member User',
      email: DEMO_MEMBER_EMAIL,
      role: 'member',
      joinDate: '2024-01-01',
      status: 'Active',
      booksBorrowed: 1,
      preferredCategory: 'Fiction',
    };
    normalizedMembers = [...normalizedMembers, demoMember];
  }

  const hasLoan = normalizedLoans.some((loan) => loan.memberId === demoMember.id);
  if (!hasLoan) {
    normalizedLoans = [
      {
        id: nextId(normalizedLoans),
        book: 'The Hobbit',
        member: demoMember.name,
        memberId: demoMember.id,
        loanDate: '2024-01-15',
        dueDate: '2024-01-29',
        status: 'Active',
        daysLeft: 7,
      },
      ...normalizedLoans,
    ];
  }

  return {
    ...data,
    members: normalizedMembers,
    loans: normalizedLoans,
  };
}

const normalizedSeedData = normalizeLibraryData({
  books: seedBooks,
  members: seedMembers,
  loans: seedLoans,
});

export const useLibraryStore = create(
  persist(
    (set) => ({
      books: normalizedSeedData.books,
      members: normalizedSeedData.members,
      loans: normalizedSeedData.loans,
      addBook: (book) =>
        set((state) => ({
          books: [...state.books, { ...book, id: nextId(state.books), status: 'Available' }],
        })),
      returnBook: (loanId) =>
        set((state) => {
          const targetLoan = state.loans.find((loan) => loan.id === loanId);

          if (!targetLoan) {
            return state;
          }

          return {
            loans: state.loans.map((loan) =>
              loan.id === loanId ? { ...loan, status: 'Returned', daysLeft: 0 } : loan
            ),
            books: state.books.map((book) => {
              const sameBook = targetLoan.bookId ? book.id === targetLoan.bookId : book.title === targetLoan.book;
              return sameBook ? { ...book, status: 'Available' } : book;
            }),
          };
        }),
      borrowBook: ({ bookId, user }) => {
        let result = { ok: false, message: 'Unable to borrow book' };

        set((state) => {
          const targetBook = state.books.find((book) => book.id === bookId);
          if (!targetBook) {
            result = { ok: false, message: 'Book not found' };
            return state;
          }

          if (targetBook.status !== 'Available') {
            result = { ok: false, message: 'Book is not available' };
            return state;
          }

          let member = state.members.find(
            (entry) => entry.email?.toLowerCase() === user?.email?.toLowerCase()
          );

          const members = [...state.members];
          if (!member) {
            member = {
              id: nextId(state.members),
              name: user?.name || 'Member',
              email: user?.email || '',
              role: 'member',
              joinDate: formatDate(new Date()),
              status: 'Active',
              booksBorrowed: 0,
              preferredCategory: targetBook.category,
            };
            members.push(member);
          }

          const dates = createLoanDates(14);
          const newLoan = {
            id: nextId(state.loans),
            book: targetBook.title,
            bookId: targetBook.id,
            member: member.name,
            memberId: member.id,
            loanDate: dates.loanDate,
            dueDate: dates.dueDate,
            status: 'Active',
            daysLeft: dates.daysLeft,
          };

          result = { ok: true, message: 'Book borrowed successfully', loan: newLoan };

          return {
            members: members.map((entry) =>
              entry.id === member.id
                ? { ...entry, booksBorrowed: Number(entry.booksBorrowed || 0) + 1 }
                : entry
            ),
            books: state.books.map((book) =>
              book.id === bookId ? { ...book, status: 'Borrowed' } : book
            ),
            loans: [newLoan, ...state.loans],
          };
        });

        return result;
      },
    }),
    {
      name: 'library-data-store',
      version: 2,
      migrate: (persistedState) => normalizeLibraryData(persistedState || {}),
    }
  )
);
