'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '⬡' },
  { href: '/explorer', label: 'Chain Explorer', icon: '🔗' },
  { href: '/pos-demo', label: 'PoS Interactive', icon: '⚡' },
  { href: '/pow-explained', label: 'How PoW Works', icon: '⛏️' },
  { href: '/pos-explained', label: 'How PoS Works', icon: '📘' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="text-lg font-bold text-indigo-700">
              Consensus
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2
                    ${isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                >
                  {/* <span>{item.icon}</span> */}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-slate-500">API Connected</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
