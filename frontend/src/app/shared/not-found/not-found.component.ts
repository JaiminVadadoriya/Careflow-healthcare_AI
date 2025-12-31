import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 class="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p class="text-2xl text-gray-700 dark:text-gray-200 mb-2">Page Not Found</p>
      <a routerLink="/home" href="home" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Go Home</a>
    </div>
  `
})
export class NotFoundComponent {} 