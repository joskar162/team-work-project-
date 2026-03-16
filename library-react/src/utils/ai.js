export function predictOverdueRisk(member, loans) {
  const memberLoans = loans.filter((loan) => loan.memberId === member.id);
  const overdueCount = memberLoans.filter((loan) => loan.status === 'Overdue').length;
  const total = memberLoans.length || 1;
  const overdueRatio = overdueCount / total;
  const usageFactor = Math.min(member.booksBorrowed / 20, 1);

  const score = Math.round((overdueRatio * 70 + usageFactor * 30) * 100);

  let level = 'Low';
  if (score >= 70) {
    level = 'High';
  } else if (score >= 40) {
    level = 'Medium';
  }

  return { score, level };
}

export function recommendBooksForMember(member, books, loans) {
  const activeTitles = new Set(
    loans
      .filter((loan) => loan.memberId === member.id && loan.status !== 'Returned')
      .map((loan) => loan.book)
  );

  return books
    .filter((book) => book.status === 'Available')
    .filter((book) => !activeTitles.has(book.title))
    .filter((book) => book.category === member.preferredCategory)
    .slice(0, 3);
}
