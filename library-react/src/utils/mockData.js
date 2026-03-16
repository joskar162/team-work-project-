export const seedBooks = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', status: 'Available', year: 1925 },
  { id: 2, title: '1984', author: 'George Orwell', category: 'Dystopian', status: 'Borrowed', year: 1949 },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', status: 'Available', year: 1960 },
  { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Romance', status: 'Available', year: 1813 },
  { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', category: 'Fiction', status: 'Borrowed', year: 1951 },
  { id: 6, title: 'Lord of the Flies', author: 'William Golding', category: 'Fiction', status: 'Available', year: 1954 },
  { id: 7, title: 'Brave New World', author: 'Aldous Huxley', category: 'Dystopian', status: 'Available', year: 1932 },
  { id: 8, title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', status: 'Borrowed', year: 1937 },
];

export const seedMembers = [
  { id: 1, name: 'John Smith', email: 'john.smith@email.com', role: 'member', joinDate: '2023-01-15', status: 'Active', booksBorrowed: 12, preferredCategory: 'Fiction' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@email.com', role: 'member', joinDate: '2023-02-20', status: 'Active', booksBorrowed: 8, preferredCategory: 'Dystopian' },
  { id: 3, name: 'Mike Davis', email: 'mike.davis@email.com', role: 'member', joinDate: '2023-03-10', status: 'Inactive', booksBorrowed: 3, preferredCategory: 'Fiction' },
  { id: 4, name: 'Emily Brown', email: 'emily.b@email.com', role: 'member', joinDate: '2023-04-05', status: 'Active', booksBorrowed: 15, preferredCategory: 'Romance' },
  { id: 5, name: 'Alex Wilson', email: 'alex.w@email.com', role: 'member', joinDate: '2023-05-12', status: 'Active', booksBorrowed: 6, preferredCategory: 'Fantasy' },
];

export const seedLoans = [
  { id: 1, book: 'The Great Gatsby', member: 'John Smith', memberId: 1, loanDate: '2024-01-10', dueDate: '2024-01-24', status: 'Active', daysLeft: 3 },
  { id: 2, book: '1984', member: 'Sarah Johnson', memberId: 2, loanDate: '2024-01-08', dueDate: '2024-01-22', status: 'Overdue', daysLeft: -2 },
  { id: 3, book: 'To Kill a Mockingbird', member: 'Mike Davis', memberId: 3, loanDate: '2024-01-12', dueDate: '2024-01-26', status: 'Active', daysLeft: 5 },
  { id: 4, book: 'Pride and Prejudice', member: 'Emily Brown', memberId: 4, loanDate: '2024-01-05', dueDate: '2024-01-19', status: 'Returned', daysLeft: 0 },
  { id: 5, book: 'The Catcher in the Rye', member: 'Alex Wilson', memberId: 5, loanDate: '2024-01-11', dueDate: '2024-01-25', status: 'Active', daysLeft: 4 },
  { id: 6, book: 'Lord of the Flies', member: 'John Smith', memberId: 1, loanDate: '2024-01-09', dueDate: '2024-01-23', status: 'Overdue', daysLeft: -4 },
];
