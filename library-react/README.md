# Library React App

Frontend application for the Team Work Project Library Management System.

## Quick Start

```bash
npm install
npm run dev
```

App runs with Vite and supports hot reload.

## Available Scripts

- npm run dev: start dev server
- npm run build: create production build
- npm run preview: preview production build
- npm run lint: run ESLint

## Main Functional Areas

- Login and OTP verification
- Books catalog and borrow workflow
- Member management
- Loans tracking and returns
- Admin dashboard and settings

## Important Business Constraints

- Dashboard is admin-only
- AI recommendations are member-only
- Book borrowing requires admin approval tick per book
- Member borrow limit is 2 active loans
- Member must return current books before borrowing again
- User emails must use library.com domain

## State Management

Zustand stores:

- authStore: authentication, OTP, lockout, users
- libraryStore: books, members, loans, borrow and return actions

Both stores use persisted localStorage state with migration support.

## Related Documentation

For full project documentation (roles, workflow, security, setup from root), see:

- ../README.md
- ../docs/TECHNICAL_DOCUMENTATION.md
- ../docs/USER_DOCUMENTATION.md
