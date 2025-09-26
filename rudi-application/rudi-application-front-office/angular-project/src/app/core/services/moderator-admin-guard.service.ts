import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {User} from 'micro_service_modules/acl/acl-model';
import {UserService} from './user.service';
import {AuthenticationService} from './authentication.service';
import {AuthenticationState} from './authentication/authentication-method';

const ADMINISTRATOR_ROLE = 'ADMINISTRATOR';
const MODERATOR_ROLE = 'MODERATOR';

@Injectable({
    providedIn: 'root'
})
export class ModeratorAdminGuardService {

    constructor(
        private readonly userService: UserService,
        private readonly authenticationService: AuthenticationService,
        private readonly router: Router
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> |
        Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authenticationService.authenticationChanged$.pipe(
            switchMap(authState => {
                if (authState !== AuthenticationState.USER) {
                    return of(this.navigateToLogin(state.url));
                }
                return this.userService.getConnectedUser().pipe(
                    map(user => this.hasModerationRights(user) ? true : this.navigateToForbidden()),
                    catchError(() => of(this.navigateToForbidden()))
                );
            })
        );
    }

    private hasModerationRights(user: User | undefined): boolean {
        const roles = user?.roles ?? [];
        return roles.some(role => role.code === ADMINISTRATOR_ROLE || role.code === MODERATOR_ROLE);
    }

    private navigateToForbidden(): UrlTree {
        return this.router.createUrlTree(['/personal-space/my-notifications']);
    }

    private navigateToLogin(redirectUrl: string): UrlTree {
        return this.router.createUrlTree(['/login'], {queryParams: {redirectTo: redirectUrl}});
    }
}
