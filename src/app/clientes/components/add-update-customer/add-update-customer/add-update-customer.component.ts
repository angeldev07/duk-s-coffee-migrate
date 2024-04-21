import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    type OnInit,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { Customers } from 'src/app/clientes/api/customer';
import { EmailValidator } from 'src/app/ordenes/directives/check-email.';

@Component({
  selector: 'app-add-update-customer',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    FileUploadModule,
    InputSwitchModule,
    DropdownModule,
    CalendarModule
  ],
  template: `
    <p-dialog
        header="{{
            customer ? 'Actualizar cliente' : 'Agregar nuevo cliente'
        }}"
        [modal]="true"
        [draggable]="false"
        [resizable]="false"
        [(visible)]="visible"
        (onHide)="visibleChange.emit(false)"
        [style]="{ width: '50rem' }"
        [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }"
    >
        <form
            [formGroup]="customerForm"
            class="pt-4 "
            (ngSubmit)="submitCustomer()"
        >
            <div class="mb-3">
                <label for="name" class="font-semibold block mb-2"
                    >Nombre</label
                >
                <input
                    id="name"
                    type="text"
                    formControlName="name"
                    pInputText
                    class="w-full"
                />
                @if (validateInput('name')) {
                <span class="text-red-500 text-md block p-2"
                     >El nombre es obligatorio</span
                >
                }
            </div>
            <div class="mb-3">
                <label for="lastName" class="font-semibold block mb-2"
                    >Apellido</label
                >
                <input
                    id="lastName"
                    type="text"
                    formControlName="lastName"
                    pInputText
                    class="w-full"
                />
                @if (validateInput('lastName')) {
                <span class="text-red-500 text-md block p-2"
                     >El apellido es obligatorio</span
                >
                }
            </div>
            <div class="mb-3">
                <label for="email" class="font-semibold block mb-2"
                    >Correo</label
                >
                <input
                    id="email"
                    type="email"
                    formControlName="email"
                    pInputText
                    class="w-full"
                />
                @if (validateInput('email')) {
                <span class="text-red-500 text-md block p-2"
                     >El correo es obligatorio ó ya en uso</span
                >
                }
            </div>
            <div class="mb-3">
                <label for="cardId" class="font-semibold block mb-2"
                    >Documento de Identidad</label
                >
                <input
                    id="cardId"
                    type="text"
                    formControlName="cardId"
                    pInputText
                    class="w-full"
                />
                @if (validateInput('cardId')) {
                <span class="text-red-500 text-md block p-2"
                     >El documento es obligatorio</span
                >
                }
            </div>
            <div class="mb-3">
                <label for="gender" class="font-semibold block mb-2"
                    >Género</label
                >
                <div *ngFor="let gender of genders" class="field-checkbox">
                    <input type="radio" [id]="gender.key" [value]="gender.key" formControlName="gender">
                    <label [for]="gender.key" class="ml-2">{{ gender.name }}</label>
                </div>
                @if (validateInput('gender')) {
                <span class="text-red-500 text-md block p-2"
                     >El género es obligatorio</span
                >
                }
            </div>
            <div class="mb-3">
                <label for="birthDay" class="font-semibold block mb-2"
                    >Fecha Nacimiento</label
                >
                <p-calendar formControlName="birthDay" dateFormat="dd/mm/yy"></p-calendar>
                @if (validateInput('birthDay')) {
                <span class="text-red-500 text-md block p-2"
                     >La fecha es obligatoria</span
                >
                }
            </div>
            <div class="mb-3">
                <label for="lastVisit" class="font-semibold block mb-2"
                    >Fecha ultima visita</label
                >
                <p-calendar formControlName="lastVisit" dateFormat="dd/mm/yy"></p-calendar>
                @if (validateInput('lastVisit')) {
                <span class="text-red-500 text-md block p-2"
                     >La fecha es obligatoria</span
                >
                }
            </div>
            <div class="mb-3">
                <label for="address" class="font-semibold block mb-2"
                    >Dirección Residencia</label
                >
                <input
                    id="address"
                    type="text"
                    formControlName="address"
                    pInputText
                    class="w-full"
                />
                @if (validateInput('address')) {
                <span class="text-red-500 text-md block p-2"
                     >La dirección es obligatoria</span
                >
                }
            </div>
            <div class="mb-3">
                <label for="phone" class="font-semibold block mb-2"
                    >Teléfono</label
                >
                <input
                    id="phone"
                    type="text"
                    formControlName="phone"
                    pInputText
                    class="w-full"
                />
                @if (validateInput('phone')) {
                <span class="text-red-500 text-md block p-2"
                     >El teléfono es obligatorio</span
                >
                }
            </div>
            <div class="mb-3">
                <label for="active" class="font-semibold block mb-2"
                    >Activo</label
                >
                <p-inputSwitch formControlName="active"></p-inputSwitch>
            </div>
            <div class="pt-3 flex justify-content-end">
                <p-button
                    icon="pi pi-check"
                    iconPos="right"
                    type="submit"
                    label="{{ customer ? 'Actualizar' : 'Guardar' }}"
                    pAutoFocus
                    [autofocus]="true"
                    [disabled]="customerForm.invalid"
                ></p-button>
            </div>
        </form>

    </p-dialog>
  `,
  styles: `
      :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUpdateCustomerComponent implements OnInit {
    @Input() customer: Customers | null = null;
    @Input() visible: boolean;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() saveCustomer = new EventEmitter<Customers>();

    customerForm = this.fb.group({
        name: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ["", [Validators.required], [this.emailValidator.validate.bind(this.emailValidator)]],
        cardId: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        birthDay: [new Date(), [Validators.required]],
        lastVisit: [new Date(), [Validators.required]],
        address: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        active: [true, [Validators.required]],
    });

    genders = [ { key: 'M', name: 'Masculino' }, { key: 'F', name: 'Femenino' } ];

    constructor(private fb: FormBuilder, private emailValidator: EmailValidator) {}

    ngOnInit(): void {
        if(!!this.customer) {
            this.customerForm.patchValue({
                name: this.customer.name,
                lastName: this.customer.lastName,
                email: this.customer.email,
                cardId: this.customer.cardId,
                gender: this.customer.gender,
                birthDay: this.customer.birthDay,
                lastVisit: this.customer.lastVisit,
                address: this.customer.address,
                phone: this.customer.phone,
                active: this.customer.active,
            });
        }
    }

    public validateInput(input: string) {
        return (
            this.customerForm.get(input).invalid &&
            this.customerForm.get(input).touched
        );
    }

    public submitCustomer() {
        if (this.customerForm.invalid) {
            this.customerForm.markAllAsTouched();
            this.customerForm.markAsDirty();
            return;
        }

        const customer: Customers = {
            id: this.customer?.id || -1,
            name: this.customerForm.get('name').value,
            lastName: this.customerForm.get('lastName').value,
            email: this.customerForm.get('email').value,
            cardId: this.customerForm.get('cardId').value,
            address: this.customerForm.get('address').value,
            phone: this.customerForm.get('phone').value,
            gender: this.customerForm.get('gender').value,
            birthDay: this.customerForm.get('birthDay').value,
            lastVisit: this.customerForm.get('lastVisit').value,
            active: Boolean(this.customerForm.get('active').value),

        };

        this.saveCustomer.emit(customer);
        this.visibleChange.emit(false)
    }

}
