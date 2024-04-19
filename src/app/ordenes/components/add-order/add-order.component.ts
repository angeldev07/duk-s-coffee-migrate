import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { Orders} from '../../api/order';
import { Customers } from 'src/app/clientes/api/customer';

@Component({
  selector: 'app-add-order',
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
        header="Agregar nueva orden"
        [modal]="true"
        [draggable]="false"
        [resizable]="false"
        [(visible)]="visible"
        (onHide)="visibleChange.emit(false)"
        [style]="{ width: '50rem' }"
        [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }"
    >
        <form
            [formGroup]="orderForm"
            class="pt-4 "
            (ngSubmit)="submitOrder()"
        >
            <!-- <div class="mb-3">
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
            </div> -->
              <!-- Campos adicionales -->
                <div formArrayName="camposExtras">
                    <div *ngFor="let campo of camposExtras.controls; let i = index">
                        <input [formControl]="campo">
                            <div class="mb-3">
                                <label for="campo" class="font-semibold block mb-2"
                                    >Nombre</label
                                >
                            <input
                                id="name"
                                type="text"
                                formControlName="campo"
                                pInputText
                                class="w-full"
                            />
                            @if (validateInput('campo')) {
                            <span class="text-red-500 text-md block p-2"
                                >El nombre es obligatorio</span
                            >
                }
            </div>
                        <button type="button" (click)="eliminarCampoExtra(i)">Eliminar</button>
                    </div>
                </div>

  <!-- Botón para agregar campo adicional -->
                <button type="button" (click)="agregarCampoExtra()">Agregar Campo</button>
        </form>
    <ng-template pTemplate="footer">
                <div class="pt-3">
                    <p-button
                        icon="pi pi-check"
                        iconPos="right"
                        (onClick)="submitCustomer()"
                        label="Guardar"
                        pAutoFocus
                        [autofocus]="true"
                    ></p-button>
                </div>
            </ng-template>
    </p-dialog>
  `,
  styles: `
      :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddOrderComponent implements OnInit {
    @Input() order: Orders | null = null;
    @Input() visible: boolean;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() saveOrder = new EventEmitter<Orders>();

    orderForm: FormGroup;

    // orderForm = this.fb.group({
    //     name: ['', [Validators.required]],
    //     lastName: ['', [Validators.required]],
    //     email: ["", [Validators.required]],
    //     cardId: ['', [Validators.required]],
    //     birthDay: [new Date(), [Validators.required]],
    //     lastVisit: [new Date(), [Validators.required]],
    //     address: ['', [Validators.required]],
    //     phone: ['', [Validators.required]],
    //     active: [true, [Validators.required]],
    // });

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.orderForm = this.fb.group({
            // Define los campos iniciales de tu formulario
            campo1: '',
            campo2: '',
            // Utiliza un FormArray para los campos adicionales
            camposExtras: this.fb.array([])
          });
    }

    // Getter conveniente para acceder al FormArray
    get camposExtras() {
        return this.orderForm.get('camposExtras') as FormArray;
    }

    // Método para agregar un nuevo campo adicional
    agregarCampoExtra() {
        this.camposExtras.push(this.fb.control(''));
    }

    // Método para eliminar un campo adicional
    eliminarCampoExtra(index: number) {
        this.camposExtras.removeAt(index);
    }

    public validateInput(input: string) {
        return (
            this.orderForm.get(input).invalid &&
            this.orderForm.get(input).touched
        );
    }

    public submitOrder() {
        if (this.orderForm.invalid) {
            this.orderForm.markAllAsTouched();
            this.orderForm.markAsDirty();
            return;
        }

        const order: Orders = {
            id: this.order?.id || -1,
            bill: this.order?.bill || -1,
            client: this.order?.client || '',
            total: this.order?.total || 0,
            date: this.order?.date || new Date()

        };

        this.saveOrder.emit(order);
        this.visibleChange.emit(false)
    }
}
