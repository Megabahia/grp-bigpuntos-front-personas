import {Component, OnInit, ViewChild} from '@angular/core';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {first, takeUntil} from 'rxjs/operators';
import {CoreConfigService} from '../../../../@core/services/config.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject, Subscription} from 'rxjs';
import {AuthenticationService} from '../../../auth/service/authentication.service';
import {ReCaptchaV3Service} from 'ngx-captcha';
import {environment} from "../../../../environments/environment";
import {
    FacebookLoginProvider,
    SocialAuthService,
    SocialUser,
} from 'angularx-social-login';
import {RegistroService} from '../registro/registro.service';
import {Role} from 'app/auth/models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    //  Public
    @ViewChild('captchaElem') captchaElem;

    @ViewChild('mensajeModal') mensajeModal;
    public mensaje = '';

    public coreConfig: any;
    public loginForm: FormGroup;
    public loading = false;
    public submitted = false;
    public returnUrl: string;
    public captcha: boolean;
    public siteKey: string;
    public error = '';
    public passwordTextType: boolean;
    private socialUser: SocialUser;
    private isLoggedin: boolean = null;
    private logginSubs: Subscription;

    public startDateOptions = {
        altInput: true,
        mode: 'single',
        altInputClass:
            'form-control flat-picker flatpickr-input invoice-edit-input',
        enableTime: true,
    };

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
        private _router: Router,
        private _authenticationService: AuthenticationService,
        private socialAuthService: SocialAuthService,
        private _registroService: RegistroService,
        private _modalService: NgbModal,
        private toastr: ToastrService,
    ) {
        this.siteKey = environment.setKey;
        this.captcha = false;
        this._unsubscribeAll = new Subject();
        // Configure the layout
        this._coreConfigService.config = {
            layout: {
                navbar: {
                    hidden: true,
                },
                menu: {
                    hidden: true,
                },
                footer: {
                    hidden: true,
                },
                customizer: false,
                enableLocalStorage: false,
            },
        };
        if (this._authenticationService.grpPersonasUserValue) {
            this._router.navigate(['/']);
        }
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
        if (this.loginForm.invalid || !this.captcha) {
            this.toastr.warning('Al parecer existe un error con la información que ingresó, por favor revise y vuelva a intentar.',
                'Alerta');
            return;
        }

        // Login
        this.loading = true;
        this._authenticationService
            .login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                (data) => {
                    if (data.code === 400) {
                        this.mensaje = data.msg;
                        this.abrirModal(this.mensajeModal);
                        this.loading = false;
                    }
                    // this._router.navigate([this.returnUrl]);
                    const semilla = JSON.parse(localStorage.getItem('semillaPago'));
                    const simulador = localStorage.getItem('simulador');
                    if (semilla) {
                        if (semilla.pantalla === 'verPremios') {
                            this._router.navigate(['/personas/mis-premios']);
                        } else if (semilla.pantalla === 'pagar') {
                            this._router.navigate(['/personas/supermonedas/pagar-con-supermonedas']);
                        }
                    } else {
                        if (simulador === 'ok') {
                            this._router.navigate(['/personas/creditos-autonomos/solicitar-credito']);
                        } else {
                            this._router.navigate(['/']);
                        }
                    }
                },
                (error) => {
                    this.error = 'Fallo en la autenticación, vuelva a intentarlo';
                    this.loading = false;
                }
            );
    }

    async loginWithFacebook() {
        await this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);

        this.logginSubs = await this.socialAuthService.authState.subscribe(
            (user) => {
                console.log('User ', user);
                this.socialUser = user;
                this.isLoggedin = user != null;
                this.loginForm.patchValue({
                    email: user.email,
                    password: user.id,
                });
                this.logginSocial();
            }
        );
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------
    abrirModal(modal) {
        this._modalService.open(modal);
    }

    cerrarModal() {
        this._modalService.dismissAll();
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

        // Subscribe to config changes
        this._coreConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                // config.app.appLogoImage = 'assets/images/logo/credicompra.png';
                this.coreConfig = config;
            });
    }

    logginSocial() {
        this._registroService
            .registrarUsuario({
                password: this.f.password.value,
                roles: Role.BigPuntos,
                email: this.f.email.value,
                estado: 2,
                tipoUsuario: 'core',
            })
            .subscribe(
                (info) => {
                    console.log('va registrar');
                    if (info.email[0] === 'Ya existe usuarios con este email.') {
                        // this.login();
                    } else {
                        this.error = null;
                        this.loading = true;
                        localStorage.setItem('grpPersonasUser', JSON.stringify(info));
                        // console.log('va espear 10 ssss');
                        // setTimeout(() => {
                        //     console.log('va espear 10 s');
                        //     window.location.href = '/';
                        // }, 10000);
                    }
                },
                (error) => {
                    this.login();

                    // this.error = error.error.password;
                }
            );

        setTimeout(() => {
            this.loginFacebook();
        }, 1000);

    }

    loginFacebook() {
        // console.log('entra a preguntar---');
        this._authenticationService.loginFacebok(this.f.email.value)
            .subscribe((data) => {
                // console.log('existe y va logear ');
                if (data.code === 400) {
                    this.mensaje = data.msg;
                    this.abrirModal(this.mensajeModal);
                    this.loading = false;
                }
                // this._router.navigate([this.returnUrl]);
                const semilla = JSON.parse(localStorage.getItem('semillaPago'));
                const simulador = localStorage.getItem('simulador');
                if (semilla) {
                    if (semilla.pantalla === 'verPremios') {
                        this._router.navigate(['/personas/mis-premios']);
                    } else if (semilla.pantalla === 'pagar') {
                        this._router.navigate(['/personas/supermonedas/pagar-con-supermonedas']);
                    }
                } else {
                    if (simulador === 'ok') {
                        this._router.navigate(['/personas/creditos-autonomos/solicitar-credito']);
                    } else {
                        this._router.navigate(['/']);
                    }
                }
            });
    }

    login() {
        this._authenticationService
            .login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                (data) => {
                    // this._router.navigate([this.returnUrl]);
                    this._router.navigate(['/']);
                },
                (error) => {
                    console.log(error);
                    this.error = 'Fallo en la autenticación, vuelva a intentarlo';
                }
            );
    }

    captchaValidado(evento) {
        this.captcha = true;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        if (this.logginSubs) {
            this.logginSubs.unsubscribe();
        }

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
