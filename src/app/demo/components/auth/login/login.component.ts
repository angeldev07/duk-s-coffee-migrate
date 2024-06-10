import { Component, inject } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../services/auth.service';
import { LoginData } from '../api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailValidator } from '../../../../ordenes/directives/check-email.';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    // styles: [`
    //     :host ::ng-deep .pi-eye,
    //     :host ::ng-deep .pi-eye-slash {
    //         transform:scale(1.6);
    //         margin-right: 1rem;
    //         color: var(--primary-color) !important;
    //     }
    // `],
    styleUrls: ['./login.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, InputTextModule, PasswordModule, CheckboxModule, ButtonModule, ConfirmDialogModule, ToastModule, DialogModule]
})
export class LoginComponent {
    visible: boolean = false;
    valCheck: string[] = ['remember'];
    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });



    constructor(public layoutService: LayoutService, private authService: AuthService,  private fb: FormBuilder, private router: Router) { }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        if(this.authService.isAuthenticated()) {
            this.router.navigate(['/backoffice/inventario/'], {replaceUrl: true});
        }
    }

    public doLogin() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.form.markAsDirty();
            return;
        }
        const data = {
            email: this.form.get('email').value,
            password: this.form.get('password').value,
        }

        this.authService.login(data).subscribe({
            next: (response: any) => {
                this.authService.localUser(response);
            },
            error: (error) => {
                console.log('error', error);
                this.visible = true;
            }}
        );

    }

    public validateInput(input: string) {
        return this.form.get(input).errors?.['required'] && this.form.get(input).touched;
    }

    public validateEmail(input: string) {
        return this.form.get(input).errors?.['email'] && this.form.get(input).touched;
    }

}
