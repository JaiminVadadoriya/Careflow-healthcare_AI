import { Component, Input, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../theme/theme.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
           <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
             <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <span class="font-bold text-sm">{{ role.charAt(0).toUpperCase() }}</span>
             </div>
             <div class="overflow-hidden">
               <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{{ role }}</p>
               <p class="text-xs text-gray-500 dark:text-gray-400 truncate">Online</p>
             </div>
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
                <div *ngIf="showThemeMenu" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1 z-50">
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
  `,
  styles: [`
    :host ::ng-deep [sidebar-items] a {
      @apply flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 transition-all duration-200;
    }
    :host ::ng-deep [sidebar-items] a:hover {
      @apply bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white;
    }
    :host ::ng-deep [sidebar-items] a.active, 
    :host ::ng-deep [sidebar-items] a[routerLinkActive*="active"] 
    { 
      /* Styles handled by routerLinkActive in parent */
    }
  `]
})
export class DashboardLayoutComponent implements OnInit {
  @Input() title: string = 'Dashboard';
  @Input() role: string = 'User';
  
  showThemeMenu = false;
  currentTheme: 'light' | 'dark' | 'system' = 'system';

  constructor(private themeService: ThemeService, private eRef: ElementRef) {}

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  toggleThemeMenu() {
    this.showThemeMenu = !this.showThemeMenu;
  }

  setTheme(theme: 'light' | 'dark' | 'system') {
    this.themeService.setTheme(theme);
    this.currentTheme = theme;
    this.showThemeMenu = false;
  }

  getCurrentIcon() {
    switch (this.currentTheme) {
      case 'light': return 'light_mode';
      case 'dark': return 'dark_mode';
      case 'system': return 'settings_brightness';
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showThemeMenu = false;
    }
  }
}
