import Link from 'next/link';
import { Button } from '../button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../sheet';
import { Menu } from 'lucide-react';

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/features', label: 'Fonctionnalités' },
  { href: '/pricing', label: 'Tarifs' },
  { href: '/contact', label: 'Contact' },
];

const Navbar = async () => {
  return (
    <header className="sticky top-0 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href={'/'} className="text-lg font-semibold">
          Etf-Visualizer
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link, index) => {
            return (
              <Link
                key={index}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            );
          })}
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
              {links.map((link, index) => {
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
