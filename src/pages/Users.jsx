import React from 'react';
import { Users as UsersIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Users() {
  const { themeConfig = { text: 'text-amber-600' } } = useTheme() || {};

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <UsersIcon className={`w-7 h-7 ${themeConfig.text}`} /> Staff Management
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage system users, employee roles, and permissions
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-sm">
        <UsersIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Staff Management Panel</h3>
        <p className="text-sm text-gray-400 mt-1">User directory and role assignment views coming soon.</p>
      </div>
    </div>
  );
}