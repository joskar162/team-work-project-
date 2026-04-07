import { useState } from 'react';
import { Search, Filter, MoreVertical, BookOpen } from 'lucide-react';
import Header from '../components/layout/Header';
import { useLibraryStore } from '../store/libraryStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { recommendBooksForMember } from '../utils/ai';

const categories = ['All', 'Fiction', 'Dystopian', 'Romance', 'Fantasy', 'Science', 'History'];

export default function Books() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const books = useLibraryStore((state) => state.books);
  const members = useLibraryStore((state) => state.members);
  const loans = useLibraryStore((state) => state.loans);
  const borrowBook = useLibraryStore((state) => state.borrowBook);
  const toggleBorrowApproval = useLibraryStore((state) => state.toggleBorrowApproval);
  const user = useAuthStore((state) => state.user);
  const isMember = user?.role === 'member';
  const isAdmin = user?.role === 'admin';
  const currentMember = members.find(
    (member) => member.email?.toLowerCase() === user?.email?.toLowerCase()
  );
  const activeMemberLoans = currentMember
    ? loans.filter((loan) => loan.memberId === currentMember.id && loan.status !== 'Returned').length
    : 0;
  const hasReachedBorrowLimit = isMember && activeMemberLoans >= 2;
  const recommendations = isMember && currentMember
    ? recommendBooksForMember(currentMember, books, loans)
    : [];

  const handleBorrowBook = (bookId) => {
    if (!user) {
      toast.error('You need to sign in to borrow a book');
      return;
    }

    const result = borrowBook({ bookId, user });
    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header title="Books" />
      <main className="flex-1 overflow-y-auto p-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              More Filters
            </button>
          </div>
        </div>

        {/* Books Grid */}
        {isMember && (
          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">AI Book Recommendations</h3>
            <p className="text-xs text-blue-700 mb-3">
              Borrowed now: {activeMemberLoans}/2
              {hasReachedBorrowLimit ? ' - Return your 2 books to borrow again.' : ''}
            </p>
            {recommendations.length === 0 ? (
              <p className="text-sm text-blue-700">Borrow history is not enough yet for recommendations.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendations.map((book) => (
                  <div key={book.id} className="rounded-lg bg-white border border-blue-100 px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">{book.title}</p>
                    <p className="text-xs text-gray-600">{book.author} - {book.category}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-primary-300" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{book.title}</h3>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-3">{book.author}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{book.category}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    book.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {book.status}
                  </span>
                </div>
                {isAdmin && (
                  <label className="mt-3 flex items-center gap-2 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(book.borrowApproved)}
                      onChange={(e) => toggleBorrowApproval(book.id, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Allow Borrow (Admin Tick)
                  </label>
                )}
                {!isAdmin && (
                  <p className={`mt-3 text-xs ${book.borrowApproved ? 'text-green-700' : 'text-amber-700'}`}>
                    {book.borrowApproved ? 'Borrow approved by admin' : 'Waiting admin approval'}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => handleBorrowBook(book.id)}
                  disabled={book.status !== 'Available' || hasReachedBorrowLimit || !book.borrowApproved}
                  className={`mt-4 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    book.status === 'Available' && !hasReachedBorrowLimit && book.borrowApproved
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {book.status !== 'Available'
                    ? 'Unavailable'
                    : hasReachedBorrowLimit
                      ? 'Limit Reached (2/2)'
                      : !book.borrowApproved
                        ? 'Pending Admin Tick'
                      : 'Borrow Book'}
                </button>
                <p className="text-xs text-gray-400 mt-3">{book.year}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </>
  );
}
