'use client';

import { Bell, Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sites, testimonials..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">Account</span>
          </button>
        </div>
      </div>
    </header>
  );
}

