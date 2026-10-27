import React from 'react';
import { Sun, Moon, Palette, Check, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, toggleTheme, accentColor, setAccentColor } = useTheme() || {};

  const accentOptions = [
    {
      id: 'amber',
      name: 'Amber Gold',
      bgClass: 'bg-amber-500',
      borderClass: 'border-amber-500',
      ringClass: 'ring-amber-500',
      textClass: 'text-amber-500',
    },
    {
      id: 'indigo',
      name: 'Royal Blue',
      bgClass: 'bg-indigo-600',
      borderClass: 'border-indigo-600',
      ringClass: 'ring-indigo-500',
      textClass: 'text-indigo-600',
    },
    {
      id: 'emerald',
      name: 'Emerald Green',
      bgClass: 'bg-emerald-500',
      borderClass: 'border-emerald-500',
      ringClass: 'ring-emerald-500',
      textClass: 'text-emerald-500',
    },
    {
      id: 'rose',
      name: 'Ruby Crimson',
      bgClass: 'bg-rose-500',
      borderClass: 'border-rose-500',
      ringClass: 'ring-rose-500',
      textClass: 'text-rose-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
          Appearance & Theme Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Customize how KaratFlow looks and feels on your device.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-slate-100">
              Interface Theme
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Select your preferred background color mode.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => theme !== 'light' && toggleTheme && toggleTheme()}
            className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 font-medium'
                : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 text-gray-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun size={20} className="text-amber-500" />
              <div>
                <p className="text-sm font-semibold">Light Mode</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Clean & crisp look</p>
              </div>
            </div>
            {theme === 'light' && <Check size={18} className="text-blue-600" />}
          </button>

          <button
            type="button"
            onClick={() => theme !== 'dark' && toggleTheme && toggleTheme()}
            className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-950/40 text-blue-400 font-medium'
                : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 text-gray-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon size={20} className="text-blue-400" />
              <div>
                <p className="text-sm font-semibold">Dark Mode</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Easy on the eyes</p>
              </div>
            </div>
            {theme === 'dark' && <Check size={18} className="text-blue-400" />}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Palette size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-slate-100">
              Accent Color
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Choose a highlight color for active items, buttons, and badges.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {accentOptions.map((option) => {
            const isSelected = accentColor === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setAccentColor && setAccentColor(option.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 gap-2 transition-all ${
                  isSelected
                    ? `${option.borderClass} bg-slate-50 dark:bg-slate-800/60 ring-2${option.ringClass}`
                    : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full ${option.bgClass} flex items-center justify-center text-white shadow-sm`}
                >
                  {isSelected && <Check size={16} />}
                </div>
                <span className="text-xs font-semibold text-gray-800 dark:text-slate-200">
                  {option.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Theme changes save automatically to local browser cache.</span>
        </div>
        <span className="font-mono text-[10px]">KaratFlow v1.0.4</span>
      </div>
    </div>
  );
}