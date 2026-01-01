import { Component, Input, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';

import { RouterModule } from '@angular/router';
import { ThemeService } from '../theme/theme.service';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-sans">
    
      <!-- Sidebar (Desktop) -->
      <aside class="hidden md:flex w-72 flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300">
        <!-- Logo Area -->
        <div class="h-20 flex items-center px-8 border-b border-gray-50 dark:border-gray-800">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <span class="material-icons text-sm">local_hospital</span>
            </div>
            <span class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">CareFlow</span>
          </div>
        </div>
    
        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
          <ng-content select="[sidebar-items]"></ng-content>
        </nav>
    
        <!-- User Profile (Sidebar Bottom) -->
        <div class="p-4 border-t border-gray-50 dark:border-gray-800">
          <div class="flex items-center justify-between gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
            <div class="flex items-center gap-3 overflow-hidden">
                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span class="font-bold text-sm">{{ role.charAt(0).toUpperCase() }}</span>
                </div>
                <div class="overflow-hidden">
                  <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{{ role }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">Online</p>
                </div>
            </div>
            <button (click)="logout()" class="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Sign Out">
                <span class="material-icons">logout</span>
            </button>
          </div>
        </div>
      </aside>
    
      <!-- Main Area -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
    
        <!-- Topbar -->
        <header class="h-20 flex items-center justify-between px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
          <div class="flex items-center gap-4">
            <button class="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <span class="material-icons">menu</span>
            </button>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ title }}</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Welcome back, here is what's happening today.</p>
            </div>
          </div>
    
          <div class="flex items-center gap-3">
            <!-- Theme Toggle Dropdown -->
            <div class="relative" #themeMenu>
              <button (click)="toggleThemeMenu()" class="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
                <span class="material-icons text-xl">{{ getCurrentIcon() }}</span>
              </button>
    
              <!-- Dropdown -->
              @if (showThemeMenu) {
                <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1 z-50">
                  <button (click)="setTheme('light')" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                    <span class="material-icons text-lg">light_mode</span> Light
                  </button>
                  <button (click)="setTheme('dark')" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                    <span class="material-icons text-lg">dark_mode</span> Dark
                  </button>
                  <button (click)="setTheme('system')" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                    <span class="material-icons text-lg">settings_brightness</span> System
                  </button>
                </div>
              }
            </div>
    
            <!-- Notifications (Simulated) -->
            <button class="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors relative">
              <span class="material-icons text-xl">notifications</span>
              <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>
    
        <!-- Content Content -->
        <main class="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div class="max-w-7xl mx-auto space-y-6">
            <ng-content></ng-content>
          </div>
        </main>
      </div>
    </div>
    <!-- Logout Confirmation Modal -->
    @if (showLogoutConfirm) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" style="z-index: 100;">
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-100 dark:border-gray-800 transform transition-all scale-100">
          <div class="p-6 text-center">
            <div class="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-icons text-3xl text-red-500">logout</span>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Sign Out?</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to end your session?</p>
            
            <div class="grid grid-cols-2 gap-3">
              <button (click)="showLogoutConfirm = false" class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancel
              </button>
              <button (click)="confirmLogout()" class="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class DashboardLayoutComponent implements OnInit {
  @Input() title: string = 'Dashboard';
  @Input() role: string = 'User';

  showThemeMenu = false;
  showLogoutConfirm = false;
  currentTheme: 'light' | 'dark' | 'system' = 'system';

  constructor(
    private themeService: ThemeService, 
    public eRef: ElementRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleThemeMenu() {
    this.showThemeMenu = !this.showThemeMenu;
  }

  setTheme(theme: 'light' | 'dark' | 'system') {
    this.themeService.setTheme(theme);
    this.showThemeMenu = false;
  }

  getCurrentIcon() {
    switch (this.currentTheme) {
      case 'light': return 'light_mode';
      case 'dark': return 'dark_mode';
      case 'system': return 'settings_brightness';
      default: return 'settings_brightness';
    }
  }

  logout() {
    this.showLogoutConfirm = true;
  }

  confirmLogout() {
    this.authService.logout();
    this.showLogoutConfirm = false; // although redirect happens immediately
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    // specific check to close menus if clicked outside
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showThemeMenu = false;
    }
  }
}
