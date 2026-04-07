# User Documentation

## 1. What This System Does

This Library Management System helps you:

- Sign in securely
- View books
- Borrow and return books
- Track loan status
- Manage members and books (admin/librarian)

## 2. User Roles

### Admin

Can:

- Access Dashboard
- Manage books and members
- View all loans
- Approve books for borrowing (tick)
- Access settings

### Librarian

Can:

- Manage books and members
- View all loans
- Return books

### Member

Can:

- View books
- View own loans
- Borrow approved books
- Receive AI book recommendations

## 3. Login Process

1. Enter email and password.
2. Solve the human puzzle.
3. Enter OTP code.
4. Access your role-based pages.

Important:

- If you enter the wrong password 3 times, your account is suspended for 1 hour.

## 4. Borrowing Rules for Members

You can borrow a book only if:

- The book is available.
- Admin has ticked the book as approved for borrowing.
- You currently have fewer than 2 active borrowed books.

If you already borrowed 2 books:

- Return one or both books first.
- Then borrowing is enabled again.

## 5. How Admin Approves a Book

1. Go to Books page.
2. Locate the target book.
3. Tick Allow Borrow (Admin Tick).
4. Members can now borrow that book.

If unticked, members will see waiting for admin approval.

## 6. Loans Page Behavior

- Admin/Librarian: see all loans.
- Member: see only own loans.

Loan status meaning:

- Active: borrowed and still within time.
- Overdue: due date passed.
- Returned: book returned.

## 7. Members Page Information

Members list displays:

- Name and email
- Join date
- Number of books borrowed
- Current status

## 8. Email Requirement

All accounts use @library.com domain.

If a user is added with another domain, system will not allow it.

## 9. Demo Accounts

- Admin: admin@library.com / Admin123!
- Librarian: librarian@library.com / Lib12345!
- Member: member@library.com / Member123!

## 10. Troubleshooting

### I cannot borrow a book

Check:

- Book is marked Available
- Admin tick is enabled
- You have fewer than 2 active loans

### I cannot log in

Check:

- Email and password are correct
- Puzzle answer is correct
- OTP is correct
- Account is not currently suspended

### My data looks old or incorrect

Ask technical team to clear browser localStorage and re-login.

## 11. Quick Navigation

- Books: browse and borrow books
- Loans: track loan records
- Members: manage/view member records (admin/librarian)
- Dashboard: admin only
- Settings: admin only
