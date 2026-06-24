import React from 'react';

const Navbar: React.FC = () => {
  return (
    <header className="w-full bg-background sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-1">
          <button className="text-sm font-medium text-foreground hover:bg-muted px-3 py-2 rounded-full transition-colors whitespace-nowrap">
            Inicio
          </button>
          <button className="text-sm font-medium text-foreground hover:bg-muted px-3 py-2 rounded-full transition-colors whitespace-nowrap hidden sm:block">
            Nuestro Blog
          </button>
          <button className="text-sm font-medium text-foreground hover:bg-muted px-3 py-2 rounded-full transition-colors whitespace-nowrap hidden sm:block">
            Sobre Nosotros
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm font-medium text-foreground border border-foreground px-4 py-1.5 rounded-full hover:bg-foreground hover:text-background transition-colors whitespace-nowrap hidden sm:block">
            Contactanos
          </button>
          <button className="text-sm font-medium text-primary-foreground bg-primary px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap">
            Phone Number
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
