import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import { useLibraryStore } from '../store/libraryStore';
import { sanitizePayload } from '../utils/security';

const categories = ['Fiction', 'Dystopian', 'Romance', 'Fantasy', 'Science', 'History'];

const addBookSchema = z.object({
  title: z.string().min(2, 'Title is too short').max(120, 'Title is too long'),
  author: z.string().min(2, 'Author name is too short').max(80, 'Author name is too long'),
  category: z.enum(categories),
  year: z.coerce
    .number()
    .int('Year must be a whole number')
    .min(1400, 'Year is too old')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
});

export default function AddBook() {
  const navigate = useNavigate();
  const addBook = useLibraryStore((state) => state.addBook);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addBookSchema),
    defaultValues: {
      title: '',
      author: '',
      category: 'Fiction',
      year: 2000,
    },
  });

  const onSubmit = async (values) => {
    const sanitized = sanitizePayload(values);
    addBook(sanitized);
    toast.success('Book added securely');
    navigate('/books');
  };

  return (
    <>
      <Header title="Add Book" />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">New Book Record</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                {...register('title')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <input
                type="text"
                {...register('author')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.author && <p className="text-xs text-red-600 mt-1">{errors.author.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                {...register('category')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                type="number"
                {...register('year')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.year && <p className="text-xs text-red-600 mt-1">{errors.year.message}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-70"
              >
                {isSubmitting ? 'Saving...' : 'Save Book'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/books')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
