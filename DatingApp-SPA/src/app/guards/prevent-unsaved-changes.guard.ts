import { Injectable } from '@angular/core';
import { CanDeactivate, Router } from '@angular/router';
import { MemberEditComponent } from '../components/members/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent>  {
    canDeactivate(component: MemberEditComponent) {
        if (component.editForm.dirty) {
            return confirm('Are you sure you want to continue? Any unsaved changes will be lost')
        }
        return true;
    }
}
