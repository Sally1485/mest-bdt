'use client';
// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, Group, User } from 'lucide-react'; // Using Lucide Icons for simplicity
import Link from 'next/link';
import HankoLogout from '../auth/HankoLogout';

// Define the type for a sidebar link item
interface SidebarItem {
  name: string;
  icon: React.ElementType; // Icon component type
  href: string;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Programs', icon: Group, href: '/programs' },
  { name: 'Profile', icon: User, href: '/profile' },
];

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 📱 Mobile Toggle Button (Visible on small screens) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 text-white bg-indigo-600 rounded-md lg:hidden shadow-lg hover:bg-indigo-700 transition"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 💻 Sidebar Container */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-40
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:h-auto lg:w-64 lg:shadow-xl
          ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
        `}
      >
        <div className="p-4 flex flex-col h-full justify-between">
          <div>
            {/* Sidebar Header/Logo */}
            <div className="mb-8 flex items-center justify-between lg:justify-start">
              <h1 className="text-2xl font-bold text-indigo-400">MEST Africa - BDT</h1>
              {/* Close button for mobile (optional, but good for clarity) */}
              <button
                className="p-1 rounded lg:hidden text-gray-400 hover:text-white"
                onClick={toggleSidebar}
                aria-label="Close sidebar"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2 grow">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150 ease-in-out"
                    onClick={/* Close sidebar on item click for mobile */ () => setIsOpen(false)}
                  >
                    <Icon size={20} />
                    <span className="text-base font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <HankoLogout />
        </div>
      </div>

      {/* 📱 Mobile Overlay (For when the sidebar is open) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;