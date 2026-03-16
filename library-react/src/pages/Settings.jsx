import { useState } from 'react';
import { Save, User, Bell, Shield, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import { sanitizePayload } from '../utils/security';
import { useLibraryStore } from '../store/libraryStore';
import { useAuthStore } from '../store/authStore';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [securityOptions, setSecurityOptions] = useState({
    twoFactor: true,
    strictSession: true,
  });

  const books = useLibraryStore((state) => state.books);
  const members = useLibraryStore((state) => state.members);
  const loans = useLibraryStore((state) => state.loans);
  const user = useAuthStore((state) => state.user);

  const handleGeneralSave = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = sanitizePayload({
      libraryName: String(formData.get('libraryName') || ''),
      email: String(formData.get('email') || ''),
      address: String(formData.get('address') || ''),
      loanDuration: String(formData.get('loanDuration') || ''),
    });

    if (!payload.libraryName || !payload.email) {
      toast.error('Library name and email are required.');
      return;
    }

    toast.success('General settings saved with input sanitization.');
  };

  const handlePasswordUpdate = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const currentPassword = String(formData.get('currentPassword') || '');
    const newPassword = String(formData.get('newPassword') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Password confirmation does not match.');
      return;
    }

    toast.success('Password policy checks passed (demo mode).');
  };

  const exportData = (format) => {
    const payload = {
      books,
      members,
      loans,
      exportedBy: user?.email || 'unknown',
      exportedAt: new Date().toISOString(),
    };

    const content = format === 'csv'
      ? [
          'type,id,name,status',
          ...books.map((book) => `book,${book.id},${book.title},${book.status}`),
          ...members.map((member) => `member,${member.id},${member.name},${member.status}`),
          ...loans.map((loan) => `loan,${loan.id},${loan.book},${loan.status}`),
        ].join('\n')
      : JSON.stringify(payload, null, 2);

    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `library-export.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'data', name: 'Data Management', icon: Database },
  ];

  return (
    <>
      <Header title="Settings" />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-2xl">
            {activeTab === 'general' && (
              <form className="bg-white rounded-xl border border-gray-100 shadow-sm p-6" onSubmit={handleGeneralSave}>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Library Name</label>
                    <input
                      name="libraryName"
                      type="text"
                      defaultValue="City Public Library"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      name="email"
                      type="email"
                      defaultValue="admin@library.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      name="address"
                      rows={3}
                      defaultValue="123 Library Street, City, State 12345"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loan Duration (days)</label>
                    <input
                      name="loanDuration"
                      type="number"
                      defaultValue={14}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h2>
                <div className="space-y-4">
                  {['Email notifications for due books', 'SMS reminders for overdue returns', 'Weekly loan summary', 'New book announcements'].map((item, i) => (
                    <label key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-700">{item}</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                    </label>
                  ))}
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mt-6">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'security' && (
              <form className="bg-white rounded-xl border border-gray-100 shadow-sm p-6" onSubmit={handlePasswordUpdate}>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <label className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">Enable Two-Factor Verification</span>
                    <input
                      type="checkbox"
                      checked={securityOptions.twoFactor}
                      onChange={(event) => setSecurityOptions((prev) => ({ ...prev, twoFactor: event.target.checked }))}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700">Strict Session Timeout</span>
                    <input
                      type="checkbox"
                      checked={securityOptions.strictSession}
                      onChange={(event) => setSecurityOptions((prev) => ({ ...prev, strictSession: event.target.checked }))}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      name="currentPassword"
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      name="newPassword"
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Save className="w-4 h-4" />
                    Update Password
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'data' && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Data Management</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Export Data</h3>
                    <p className="text-sm text-gray-500 mb-3">Download all library data in JSON or CSV format</p>
                    <div className="flex gap-3">
                      <button onClick={() => exportData('json')} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Export JSON</button>
                      <button onClick={() => exportData('csv')} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Export CSV</button>
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-700 mb-3">This action cannot be undone. Please proceed with caution.</p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Reset All Data</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
