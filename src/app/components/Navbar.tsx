import React from 'react';
import { Button } from './ui/button';
import { Activity, Home, LayoutDashboard, Users, Bell, Settings } from 'lucide-react';

interface NavbarProps {
  currentPage: 'home' | 'dashboard';
  onNavigate: (page: 'home' | 'dashboard') => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <nav className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Activity className="size-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl">ATM Monitor</h1>
              <p className="text-xs text-muted-foreground">Smart Monitoring System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
              className="gap-2"
            >
              <Home className="size-4" />
              Home
            </Button>
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => onNavigate('dashboard')}
              className="gap-2"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="size-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
