import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { EmailValidator } from '../../directives/check-email.';
import { debounceTime, Subscription } from 'rxjs';
import { Customers } from 'src/app/clientes/api/customer';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-new-customer',
    standalone: true,
    imports: [
        CommonModule,
        InputTextModule,
        ReactiveFormsModule,
        ButtonModule,
        DropdownModule,
        NgClass
    ],
    template: `
         <form [formGroup]="customerForm" class="formgrid grid px-3" (ngSubmit)="saveCustomer()">
            <div class="field col-12 md:col-6">
                <label for="Nombre">Nombres</label>
                <input type="text" pInputText formControlName="name" inputId="Nombre" 
                  [ngClass]="{'border-green-400': !customerForm.get('name').invalid,'ng-dirty ng-invalid': errorByControl('name') }"/>
                @if(errorByControl('name')){ 
                    @for (error of errorsByControl('name'); track error) {
                        <p class="text-red-500 text-sm">
                            {{ error }}
                        </p>
                    } 
                }
            </div>
            <div class="field col-12 md:col-6">
                <label for="lastname">Apellidos</label>
                <input type="text" pInputText formControlName="lastName" inputId="lastname" 
                  [ngClass]="{'border-green-400': !customerForm.get('lastName').invalid, 'ng-dirty ng-invalid': errorByControl('lastName')}" />
                @if(errorByControl('lastName')){ 
                    @for (error of errorsByControl('lastName'); track error) {
                        <p class="text-red-500 text-sm">
                            {{ error }}
                        </p>
                    } 
                }
            </div>

            <div class="field col-12 md:col-6">
                <label for="email">correo</label>
                <input type="email" pInputText formControlName="email" inputId="email" 
                  [ngClass]="{'border-green-400': !customerForm.get('email').invalid, 'ng-dirty ng-invalid': errorByControl('email')}"/>
                @if(errorByControl('email')){ 
                    @for (error of errorsByControl('email'); track error) {
                        <p class="text-red-500 text-sm">
                            {{ error }}
                        </p>
                    } 
                }
            </div>
            <div class="field col-12 md:col-6">
                <label for="cardId">CC</label>
                <input type="number" pInputText formControlName="cardId" inputId="cardId" 
                   [ngClass]="{'border-green-400': !customerForm.get('cardId').invalid, 'ng-dirty ng-invalid': errorByControl('cardId')}"/>
                @if(errorByControl('cardId')){ 
                    @for (error of errorsByControl('cardId'); track error) {
                        <p class="text-red-500 text-sm">
                            {{ error }}
                        </p>
                    } 
                }
            </div>

            <div class="field col-12 md:col-4">
                <label for="address">direccion</label>
                <input type="text" pInputText formControlName="address" inputId="address" 
                  [ngClass]="{'border-green-400': !customerForm.get('address').invalid, 'ng-dirty ng-invalid': errorByControl('address')}"/>
                @if(errorByControl('address')){ 
                    @for (error of errorsByControl('address'); track error) {
                        <p class="text-red-500 text-sm">
                            {{ error }}
                        </p>
                    } 
                }
            </div>
            <div class="field col-12 md:col-4">
                <label for="phone">Celular</label>
                <input type="number" pInputText formControlName="phone" inputId="phone" 
                   [ngClass]="{'border-green-400': !customerForm.get('phone').invalid, 'ng-dirty ng-invalid': errorByControl('phone')}"/>
                @if(errorByControl('phone')){ 
                    @for (error of errorsByControl('phone'); track error) {
                        <p class="text-red-500 text-sm">
                            {{ error }}
                        </p>
                    } 
                }
            </div>
            <div class="field col-12 md:col-4">
                <label for="phone">Sexo</label>
                <p-dropdown 
                    [options]="['Masculino', 'Femenino']" 
                    placeholder="Seleccione el sexo" 
                    formControlName="gender"
                    [ngClass]="{'ng-dirty ng-invalid': errorByControl('gender')}">
                </p-dropdown>
                @if(errorByControl('gender')){ 
                    @for (error of errorsByControl('gender'); track error) {
                        <p class="text-red-500 text-sm">
                            {{ error }}
                        </p>
                    } 
                }
            </div>
            <div class=" field col-12 flex justify-content-end">
                <p-button type="submit" label="Guardar" [raised]="true" [disabled]="customerForm.invalid"></p-button>
            </div>
        </form>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCustomerComponent { 

    @Output() onSaveCustomer = new EventEmitter();
    formValuesChanges$ = new Subscription()

    customerForm: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
        lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]],
        email:  ["", [Validators.required, Validators.email], [this.emailValidator.validate.bind(this.emailValidator)]],
        cardId: ['', [Validators.required]],
        address: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/3[0-9]{9}/gm)]],
        gender: ['', [Validators.required]],
    });

    constructor(private fb: FormBuilder, private emailValidator: EmailValidator) {}

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.formValuesChanges$ = this.customerForm.get('email').valueChanges.pipe(debounceTime(500)).subscribe((value) => {
            if (this.customerForm.get('email').valid) {
                this.customerForm.get('email').updateValueAndValidity({ onlySelf: true, emitEvent: false });
            }
          });
    }

    errorsByControl(control: string) {
        const controlErrors = this.customerForm.get(control)?.errors;
        const errorMessages = [];
        if (controlErrors) {
            Object.keys(controlErrors).forEach((error) => {
                switch (error) {
                    case 'required':
                        errorMessages.push('Este campo es requerido');
                        break;
                    case 'pattern':
                        errorMessages.push('El valor ingresado no es valido');
                        break;
                    case 'minlength':
                        errorMessages.push('Minimo 50 caracteres para la justificación');
                        break;
                    case "emailTaken":
                        errorMessages.push('El correo ingresado ya existe');
                        break;
                    default:
                        errorMessages.push('El valor ingresado no es valido');
                        break;
                }
            });
        }
        return errorMessages;
    }

    errorByControl(control: string) {
        return (
            this.customerForm.get(control)?.invalid &&
            (this.customerForm.get(control)?.touched ||
                this.customerForm.get(control)?.dirty)
        );
    }

    saveCustomer() {
        const {value} = this.customerForm;
        const customer: Customers = {
            name: value.name,
            lastName: value.lastName,
            email: value.email,
            cardId: value.cardId,
            address: value.address,
            phone: value.phone,
            active: true,
            birthDay: null,
            id: -1,
            gender: value.gender[0],
            lastVisit: null,
        }
        this.onSaveCustomer.emit(customer);
    }

}
