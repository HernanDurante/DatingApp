import { PreventUnsavedChanges } from './guards/prevent-unsaved-changes.guard';
import { MemberEditResolver } from './resolvers/member-edit.resolver';
import { MemberEditComponent } from './components/members/member-edit/member-edit.component';
import { MemberDetailComponent } from './components/members/member-detail/member-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { ListsComponent } from './components/lists/lists.component';
import { MessagesComponent } from './components/messages/messages.component';
import { MemberListComponent } from './components/members/member-list/member-list.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MemberDetailResolver } from './resolvers/member-detail.resolver';
import { MemberListResolver } from './resolvers/member-list.resolver';
import { ListResolver } from './resolvers/lists.resolver';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'members', component: MemberListComponent,  resolve: {users: MemberListResolver} },
      { path: 'members/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver} },
      { path: 'member/edit', component: MemberEditComponent,
          resolve: {user: MemberEditResolver}, canDeactivate: [PreventUnsavedChanges] },
      { path: 'messages', component: MessagesComponent },
      { path: 'lists', component: ListsComponent, resolve: {users: ListResolver} }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
