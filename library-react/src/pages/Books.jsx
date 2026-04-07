import { useState } from 'react';
import { Search, Filter, MoreVertical, BookOpen } from 'lucide-react';
import Header from '../components/layout/Header';
import { useLibraryStore } from '../store/libraryStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const categories = ['All', 'Fiction', 'Dystopian', 'Romance', 'Fantasy', 'Science', 'History'];

export default function Books() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const books = useLibraryStore((state) => state.books);
  const borrowBook = useLibraryStore((state) => state.borrowBook);
  const user = useAuthStore((state) => state.user);

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
                <button
                  type="button"
                  onClick={() => handleBorrowBook(book.id)}
                  disabled={book.status !== 'Available'}
                  className={`mt-4 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    book.status === 'Available'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {book.status === 'Available' ? 'Borrow Book' : 'Unavailable'}
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
