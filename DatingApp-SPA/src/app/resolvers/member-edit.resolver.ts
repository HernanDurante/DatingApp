import { AuthService } from './../services/auth/auth.service';
import { catchError } from 'rxjs/operators';
import { AlertifyService } from '../services/alertify/alertify.service';
import { UserService } from '../services/user/user.service';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
    constructor(private userService: UserService, private router: Router,
        private alertify: AlertifyService, private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                this.alertify.error('There was a problem retrieving your data');
                this.router.navigate(['/members']);
                return of(null);
            })
        );
    }

}
