import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../services/auth.service';
import { LoginData } from '../api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
    imports: [ReactiveFormsModule, InputTextModule, PasswordModule, CheckboxModule, ButtonModule]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    constructor(public layoutService: LayoutService, private authService: AuthService,  private fb: FormBuilder ) { }

    public doLogin() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.form.markAsDirty();
            return;
        }

        this.authService.login({
            email: this.form.get('email').value,
            password: this.form.get('password').value,
        })
    }

    public validateInput(input: string) {
        return this.form.get(input).invalid && this.form.get(input).touched;
    }

}
