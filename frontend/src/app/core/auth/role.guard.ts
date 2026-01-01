import { Injectable } from '@angular/core';
import { CanLoad, CanActivate, Route, UrlSegment, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanLoad, CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    const roles = route.data && route.data['roles'];
    if (this.auth.hasRole(roles)) {
      return true;
    }
    this.router.navigate(['/auth/login']);
    return false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = route.data && route.data['roles'];
    if (this.auth.hasRole(roles)) {
      return true;
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
} 