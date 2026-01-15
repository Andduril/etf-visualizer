'use client';

import Link from 'next/link';
import { Button } from '../button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../sheet';
import { Command, Menu } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'q') {
        setOpen(true);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <Dialog open={open}>
      <header className="sticky top-0 w-full border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link href={'/'} className="text-lg font-semibold">
            Etf-Visualizer
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={'/'}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Button onClick={() => setOpen(true)} variant={'outline'}>
              search <Command />+ Q
            </Button>
            <Link
              href={'/etfs'}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              All Etfs
            </Link>
          </nav>

          {/* mobile navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Ouvrir le menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-64">
              <SheetTitle>menu</SheetTitle>
              <nav className="flex flex-col gap-4 mt-6">
                <Link
                  href={'/'}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">AMogus</div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Navbar;
