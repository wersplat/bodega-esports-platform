'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Leagues', href: '/leagues' },
    { name: 'Matches', href: '/matches' },
    { name: 'Profile', href: '/profile' },
  ];

  return (
    <header className="bg-[#1e293b] text-white fixed top-0 left-0 right-0 z-40 h-16 shadow-md">
      <nav className="container mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
            Bodega Esports
          </Link>
        </div>
        
        <ul className="flex items-center space-x-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={cn(
                  'text-sm font-medium hover:text-gray-300 transition-colors',
                  pathname === item.href ? 'text-white border-b-2 border-[#e11d48]' : 'text-gray-300'
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

// Add this to your global CSS if not already present
/*
@layer components {
  .nav-link {
    @apply text-gray-300 hover:text-white px-3 py-2 text-sm font-medium;
  }
  .nav-link.active {
    @apply text-white bg-gray-900;
  }
}
*/
