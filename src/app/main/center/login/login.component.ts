import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { CoreConfigService } from '../../../../@core/services/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
//  Public
public coreConfig: any;
public loginForm: FormGroup;
public loading = false;
public submitted = false;
public returnUrl: string;
public error = '';
public passwordTextType: boolean;

// Private
private _unsubscribeAll: Subject<any>;

/**
 * Constructor
 *
 * @param {CoreConfigService} _coreConfigService
 */
constructor(
  private _coreConfigService: CoreConfigService,
  private _formBuilder: FormBuilder,
  private _route: ActivatedRoute,
  private _router: Router
) {
  this._unsubscribeAll = new Subject();

  // Configure the layout
  this._coreConfigService.config = {
    layout: {
      navbar: {
        hidden: true
      },
      menu: {
        hidden: true
      },
      footer: {
        hidden: true
      },
      customizer: false,
      enableLocalStorage: false
    }
  };
}

// convenience getter for easy access to form fields
get f() {
  return this.loginForm.controls;
}

/**
 * Toggle password
 */
togglePasswordTextType() {
  this.passwordTextType = !this.passwordTextType;
}

onSubmit() {
  this.submitted = true;

  // stop here if form is invalid
  if (this.loginForm.invalid) {
    return;
  }

  // Login
  this.loading = true;

  // redirect to home page
  setTimeout(() => {
    this._router.navigate(['/sample']);
  }, 100);
}

// Lifecycle Hooks
// -----------------------------------------------------------------------------------------------------

/**
 * On init
 */
ngOnInit(): void {
  this.loginForm = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  // get return url from route parameters or default to '/'
  this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

  // Subscribe to config changes
  this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
    this.coreConfig = config;
  });
}

/**
 * On destroy
 */
ngOnDestroy(): void {
  // Unsubscribe from all subscriptions
  this._unsubscribeAll.next();
  this._unsubscribeAll.complete();
}

}
