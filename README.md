# Team Work Project - Library Management System

Modern role-based library system built with React, Vite, Zustand, and Tailwind CSS.

## Overview

This project manages books, loans, and members with role-based access control.

Core goals:

- Secure login with OTP and anti-bot verification
- Strict role permissions (admin, librarian, member)
- Controlled borrowing workflow
- Local persistence for demo and development workflows

## Live Features Implemented

- Authentication with email/password + OTP flow
- Human verification puzzle on login
- Account suspension for 1 hour after 3 incorrect password attempts
- Email normalization and enforcement to library.com domain
- Role-based navigation and route protection
- Admin-only dashboard access
- Member-only AI book recommendations
- Loans visibility filtered per member ownership
- Admin can approve books for borrowing using tick checkbox
- Members can borrow a maximum of 2 books at a time
- Member must return borrowed books before borrowing more

## Role Access Matrix

### Admin

- Can access dashboard
- Can access books, members, loans, settings
- Can add books
- Can tick books as borrow-approved
- Can return books
- Can view member emails in admin views

### Librarian

- Can access books, members, loans
- Can add books
- Can return books
- Cannot access dashboard or settings

### Member

- Can access books and loans
- Can only view own loans
- Can borrow only approved books
- Borrow limit: max 2 active loans
- AI recommendations available only to this role

## Borrowing Rules

Borrowing succeeds only when all conditions are true:

- Book status is Available
- Book is ticked by admin as borrow-approved
- User is signed in
- If user is member: active loans must be less than 2

If any check fails, a clear message is shown.

## Security Rules

- All users must use library.com emails
- Non-conforming stored emails are normalized on load
- Login lockout policy:
	- 3 failed password attempts
	- Account suspended for 1 hour
	- Countdown shown in login UI
- OTP is required before completing login

## Tech Stack

- React 18
- Vite 5
- Zustand (persist middleware)
- React Router v6
- React Hook Form + Zod
- Tailwind CSS
- Recharts
- Lucide React

## Project Structure

main folders:

- library-react/src/pages: Route pages (Books, Loans, Members, Dashboard, Login, Settings)
- library-react/src/store: Zustand stores (auth and library state)
- library-react/src/components: Shared UI, layout, and route guards
- library-react/src/utils: Mock data, security helpers, AI helpers

## Getting Started

### 1) Install dependencies

From project root:

```bash
npm run install:app
```

or inside app folder:

```bash
cd library-react
npm install
```

### 2) Run development server

From project root:

```bash
npm run dev
```

### 3) Build production bundle

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Demo Accounts

- Admin: admin@library.com / Admin123!
- Librarian: librarian@library.com / Lib12345!
- Member: member@library.com / Member123!

## NPM Scripts (Root)

- dev: start Vite dev server from root
- build: production build for app
- preview: preview production build
- install:app: install dependencies for app

## Persistence and Reset

App data is persisted in browser localStorage.

Useful keys:

- library-auth-store
- library-data-store
- library-users
- library-login-attempts

If you want a clean state, clear these keys from browser storage.

## Notes for Team

- Business rules are enforced in store logic, not only UI, to prevent bypass.
- Route guards are implemented in the protected route wrapper and route definitions.
- Migration logic in stores normalizes old persisted data to current schema.

## Detailed Documentation

- Technical documentation: docs/TECHNICAL_DOCUMENTATION.md
- User documentation: docs/USER_DOCUMENTATION.md
