import { catchError } from 'rxjs/operators';
import { AlertifyService } from './../services/alertify/alertify.service';
import { UserService } from './../services/user/user.service';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {
    constructor(private userService: UserService, private router: Router,
        private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(route.params['id']).pipe(
            catchError(error => {
                this.alertify.error('There was a problem retrieving data');
                this.router.navigate(['/members']);
                return of(null);
            })
        );
    }

}
