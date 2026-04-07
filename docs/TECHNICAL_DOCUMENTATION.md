# Technical Documentation

## 1. Project Summary

Team Work Project is a role-based Library Management System frontend built with React and Vite. It manages users, books, members, borrowing, and returns with business rules enforced in state logic.

## 2. Technology Stack

- React 18
- Vite 5
- Zustand with persist middleware
- React Router v6
- React Hook Form + Zod validation
- Tailwind CSS
- Recharts
- Lucide React

## 3. Runtime Architecture

### 3.1 Client-Only Architecture

- No backend API is currently integrated.
- Application state is persisted in browser localStorage.
- Business rules are implemented in Zustand stores.

### 3.2 State Stores

#### Auth Store (src/store/authStore.js)

Responsibilities:

- Login and role session handling
- OTP generation/verification
- Login lockout policy
- User list persistence and normalization
- Enforce email domain: @library.com

Important localStorage keys:

- library-users
- library-auth-store
- library-login-attempts

#### Library Store (src/store/libraryStore.js)

Responsibilities:

- Books, members, loans state
- Borrow and return workflows
- Book borrow approval toggle (admin tick)
- Borrow limit for members
- Data normalization and migration for persisted records

Important localStorage key:

- library-data-store

## 4. Routing and Access Control

Routing is configured in src/App.jsx and guarded with src/components/auth/ProtectedRoute.jsx.

Role access:

- Admin: dashboard, books, members, loans, settings
- Librarian: books, members, loans
- Member: books, loans

Special constraints:

- Dashboard route is admin-only.
- Unauthorized route access redirects to /books.

## 5. Core Business Rules

### 5.1 Borrow Approval Rule

A book can be borrowed only when:

- status is Available
- borrowApproved is true (admin ticked)

### 5.2 Member Borrow Limit

For member role:

- Maximum 2 active loans (loan.status != Returned)
- Must return borrowed books before borrowing again

### 5.3 Loan Ownership Visibility

- Members can see only their own loans (memberId match).
- Admin/librarian can see all loans.

### 5.4 Email Domain Enforcement

- User and member emails are normalized/enforced to @library.com.
- Invalid domain is rejected for added users.

## 6. Security Controls

### 6.1 Authentication Flow

1. User enters email + password.
2. Human puzzle must be solved.
3. Credentials are verified.
4. OTP is generated and verified.
5. Session token and safe user data are persisted.

### 6.2 Lockout Policy

- 3 failed password attempts -> account suspended for 1 hour.
- Countdown displayed on login page.

## 7. Data Model (Frontend)

### 7.1 User (auth store)

- id
- name
- email
- password
- role (admin | librarian | member)

### 7.2 Member (library store)

- id
- name
- email
- role
- joinDate
- status
- booksBorrowed
- preferredCategory

### 7.3 Book

- id
- title
- author
- category
- status (Available | Borrowed)
- year
- borrowApproved (boolean)

### 7.4 Loan

- id
- book
- bookId
- member
- memberId
- loanDate
- dueDate
- status (Active | Overdue | Returned)
- daysLeft

## 8. Build and Run

From repository root:

- npm run install:app
- npm run dev
- npm run build
- npm run preview

From app folder (library-react):

- npm install
- npm run dev
- npm run build
- npm run preview

## 9. Persistence and Reset

To reset demo data, remove these localStorage keys:

- library-auth-store
- library-data-store
- library-users
- library-login-attempts

## 10. Known Limitations

- No backend/database yet; all data is browser-local.
- OTP is simulated and shown in alert/console for demo use.
- Build warns about large JS chunk size (optimization pending).

## 11. Suggested Next Technical Steps

- Add backend API with persistent database.
- Move auth/OTP to secure server-side flow.
- Add audit log for borrow approval ticks.
- Add automated tests (unit + integration + e2e).
- Add code-splitting for bundle size optimization.
