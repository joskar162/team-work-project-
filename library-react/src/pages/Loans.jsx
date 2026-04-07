import { useState } from 'react';
import { Search, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import { useLibraryStore } from '../store/libraryStore';
import { useAuthStore } from '../store/authStore';

const statusFilters = ['All', 'Active', 'Overdue', 'Returned'];

export default function Loans() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const loans = useLibraryStore((state) => state.loans);
  const members = useLibraryStore((state) => state.members);
  const returnBook = useLibraryStore((state) => state.returnBook);
  const user = useAuthStore((state) => state.user);

  const isPrivileged = user?.role === 'admin' || user?.role === 'librarian';
  const isAdmin = user?.role === 'admin';
  const memberEmailById = new Map(
    members.map((member) => [member.id, member.email || ''])
  );
  const currentMember = members.find(
    (member) => member.email?.toLowerCase() === user?.email?.toLowerCase()
  );

  const visibleLoans = isPrivileged
    ? loans
    : currentMember
      ? loans.filter((loan) => loan.memberId === currentMember.id)
      : [];

  const filteredLoans = visibleLoans.filter((loan) => {
    const memberEmail = memberEmailById.get(loan.memberId) || '';
    const matchesSearch = loan.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          loan.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (isAdmin && memberEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Overdue': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'Returned': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  return (
    <>
      <Header title="Loans" />
      <main className="flex-1 overflow-y-auto p-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{loan.book}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-700">{loan.member}</p>
                        {isAdmin && memberEmailById.get(loan.memberId) && (
                          <p className="text-xs text-gray-500">{memberEmailById.get(loan.memberId)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{loan.loanDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{loan.dueDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(loan.status)}
                        <span className={`text-sm font-medium ${
                          loan.status === 'Active' ? 'text-blue-600' :
                          loan.status === 'Overdue' ? 'text-red-600' :
                          'text-green-600'
                        }`}>
                          {loan.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${
                        loan.daysLeft < 0 ? 'text-red-600 font-medium' :
                        loan.daysLeft === 0 ? 'text-gray-600' :
                        'text-gray-600'
                      }`}>
                        {loan.daysLeft === 0 ? 'Due today' :
                         loan.daysLeft < 0 ? `${Math.abs(loan.daysLeft)} days overdue` :
                         `${loan.daysLeft} days left`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {loan.status !== 'Returned' && (user?.role === 'admin' || user?.role === 'librarian') && (
                        <button
                          className="flex items-center gap-1 px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          onClick={() => returnBook(loan.id)}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
