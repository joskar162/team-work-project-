import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { seedBooks, seedLoans, seedMembers } from '../utils/mockData';

function nextId(items) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

export const useLibraryStore = create(
  persist(
    (set) => ({
      books: seedBooks,
      members: seedMembers,
      loans: seedLoans,
      addBook: (book) =>
        set((state) => ({
          books: [...state.books, { ...book, id: nextId(state.books), status: 'Available' }],
        })),
      returnBook: (loanId) =>
        set((state) => ({
          loans: state.loans.map((loan) =>
            loan.id === loanId ? { ...loan, status: 'Returned', daysLeft: 0 } : loan
          ),
        })),
    }),
    {
      name: 'library-data-store',
    }
  )
);
