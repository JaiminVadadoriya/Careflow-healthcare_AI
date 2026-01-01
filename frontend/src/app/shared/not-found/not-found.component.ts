import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div class="text-center">
        <h1 class="text-9xl font-extrabold text-gray-200 dark:text-gray-700">404</h1>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
             <h2 class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Page Not Found</h2>
        </div>
      </div>
      <p class="text-gray-600 dark:text-gray-400 mt-4 max-w-md text-center">
        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <a routerLink="/home" class="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition-transform hover:-translate-y-1">
        Go Back Home
      </a>
    </div>
  `
})
export class NotFoundComponent {} 