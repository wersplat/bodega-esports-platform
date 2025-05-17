'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useMediaQuery } from '@/components/hooks/use-media-query';
import { Drawer, DrawerContent } from '@/components/ui/drawer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mounted, setMounted] = useState(false);

  // Only render the drawer on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close the drawer when the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Don't render anything until we know if we're on mobile
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="bg-background/80 backdrop-blur-sm"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="h-[80%]">
            <div className="p-4">
              <Sidebar />
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Main content */}
      <div className="flex-1 md:pl-64">
        <div className="h-16 md:hidden" /> {/* Spacer for mobile header */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
