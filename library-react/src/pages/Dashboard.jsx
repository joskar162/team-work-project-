import { BookOpen, Users, CalendarDays, TrendingUp } from 'lucide-react';
import Header from '../components/layout/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useLibraryStore } from '../store/libraryStore';
import { useAuthStore } from '../store/authStore';
import { predictOverdueRisk, recommendBooksForMember } from '../utils/ai';

const monthlyData = [
  { month: 'Jan', loans: 120, returns: 95 },
  { month: 'Feb', loans: 145, returns: 130 },
  { month: 'Mar', loans: 168, returns: 145 },
  { month: 'Apr', loans: 156, returns: 160 },
  { month: 'May', loans: 180, returns: 155 },
  { month: 'Jun', loans: 210, returns: 185 },
];

export default function Dashboard() {
  const books = useLibraryStore((state) => state.books);
  const members = useLibraryStore((state) => state.members);
  const loans = useLibraryStore((state) => state.loans);
  const currentUser = useAuthStore((state) => state.user);

  const activeLoans = loans.filter((loan) => loan.status === 'Active').length;
  const overdueLoans = loans.filter((loan) => loan.status === 'Overdue').length;
  const returnedLoans = loans.filter((loan) => loan.status === 'Returned').length;

  const stats = [
    { name: 'Total Books', value: String(books.length), change: '+', icon: BookOpen, color: 'bg-blue-500' },
    { name: 'Active Members', value: String(members.filter((m) => m.status === 'Active').length), change: '+', icon: Users, color: 'bg-green-500' },
    { name: 'Current Loans', value: String(activeLoans), change: overdueLoans ? '-' : '+', icon: CalendarDays, color: 'bg-orange-500' },
    { name: 'Returns Logged', value: String(returnedLoans), change: '+', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  const recentLoans = loans.slice(0, 5).map((loan) => ({
    id: loan.id,
    book: loan.book,
    member: loan.member,
    date: loan.loanDate,
    status: loan.status,
  }));

  const memberInsights = members
    .map((member) => ({ member, risk: predictOverdueRisk(member, loans) }))
    .sort((a, b) => b.risk.score - a.risk.score)
    .slice(0, 3);

  const currentMember = members.find((member) => member.email === currentUser?.email);
  const recommendations = currentMember ? recommendBooksForMember(currentMember, books, loans) : [];

  return (
    <>
      <Header title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change === '+' ? 'Healthy' : 'Attention'}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.name}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Area Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Loans Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="loans" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorLoans)" />
                <Area type="monotone" dataKey="returns" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorReturns)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="loans" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="returns" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Risk Watch</h3>
            <div className="space-y-3">
              {memberInsights.map(({ member, risk }) => (
                <div key={member.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                  <span className={`text-sm font-semibold ${risk.level === 'High' ? 'text-red-600' : risk.level === 'Medium' ? 'text-orange-600' : 'text-green-600'}`}>
                    {risk.level} ({risk.score}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Book Recommendations</h3>
            {recommendations.length === 0 ? (
              <p className="text-sm text-gray-500">Sign in as a member to get personalized recommendations.</p>
            ) : (
              <div className="space-y-3">
                {recommendations.map((book) => (
                  <div key={book.id} className="rounded-lg bg-blue-50 px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">{book.title}</p>
                    <p className="text-xs text-gray-600">{book.author} • {book.category}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Loans Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Loans</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{loan.book}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{loan.member}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{loan.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        loan.status === 'Active' ? 'bg-green-100 text-green-700' :
                        loan.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {loan.status}
                      </span>
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
