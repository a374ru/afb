import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthStateService } from '../data-access/auth-state.service';

@Component({
    imports: [RouterModule],
    selector: 'app-layout',
    templateUrl: "layout.component.html" 
})
export default class LayoutComponent {
  private _authState = inject(AuthStateService);
  private _router = inject(Router);

   user = this._authState.currentUser

  async logOut() {
    await this._authState.logOut();
    this._router.navigateByUrl('/auth/sign-in');
  }
}
