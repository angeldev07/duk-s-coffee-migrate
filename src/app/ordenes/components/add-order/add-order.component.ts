import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { Orders } from '../../api/order';
import { Customers } from 'src/app/clientes/api/customer';
import { ButtonModule } from 'primeng/button';
import { ClienteService } from 'src/app/clientes/services/cliente.service';
import { BillComponent } from '../bill/bill.component';
import { PickListModule } from 'primeng/picklist';
import { ProductoService } from 'src/app/inventario/services/producto.service';
import { Product } from 'src/app/inventario/api';

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
    CalendarModule,
    ButtonModule,
    DropdownModule,
    BillComponent,
    PickListModule
  ],
  template: `
    <p-dialog
        [(visible)]="visible"
        [modal]="true"
        maskStyle="backdrop-filter: blur(2px);"
        [style]="{ width: '90vw',height: '550px' ,boxShadow: 'none' }"
        [draggable]="false"
        [resizable]="false">

        <ng-template pTemplate="headless">
            <div class="grid gap-3">

                <!-- seccion para el cliente y los prodcutos dividoso en 2, arriba la infromacion del cliente, abajo los productos -->
                <section class="grid col  md:col-6  border-round"> 

                    <!-- seccion para la informacion del cliente -->
                    <section class="col-12 bg-white mb-3 border-round p-fluid">
                        <div class="flex justify-content-between align-items-center">
                            <h2 class="p-3">Informacion del cliente</h2>
                            <!-- preguntar si existe el cliente o agregar nuevo -->
                            <div class="flex justify-content-center gap-4 p-4">
                                <p-button label="Selecionar cliente existente" [raised]="true" (onClick)="typeClient(1)"></p-button>
                                <p-button label="Agregar nuevo cliente" [raised]="true" (onClick)="typeClient(0)"></p-button>
                            </div>
                        </div>
                        

                        @if(clientControls().existClient){
                            <!-- Mostrar tabla de cliente actuales -->
                            <p-dropdown [options]="customers" optionLabel="name" [showClear]="true" placeholder="Seleccione un cliente">
                                <ng-template pTemplate="selectedItem">
                                    @if (true) {
                                        <div class="flex align-items-center gap-2" *ngIf="selectedCountry">
                                            <img src="assets/shared/no-user.svg" style="width: 18px"/>
                                            <div>{{ 'pepito perez' }}</div>
                                        </div>
                                    }
                                </ng-template>
                                <ng-template let-customer pTemplate="item">
                                    <div class="flex align-items-center gap-2">
                                    <img src="assets/shared/no-user.svg" style="width: 18px"/>
                                        <div>{{ customer.name }} {{ customer.lastName }} - {{ customer.cardId }}</div>
                                    </div>
                                </ng-template>
                            </p-dropdown>
                        }

                                                
                        @if (clientControls().isNewClient) {
                            <!-- aca ira el formulario del nuevo cliente -->
                            <form [formGroup]="customerForm" class="formgrid grid px-3">
                                <div class="field col-12 md:col-6">
                                    <label for="Nombre">Nombres</label>
                                    <input type="text" pInputText formControlName="name" inputId="Nombre"/>
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="lastname">Apellidos</label>
                                    <input type="text" pInputText formControlName="lastName" inputId="lastname"/>
                                </div>

                                <div class="field col-12 md:col-6">
                                    <label for="email">correo</label>
                                    <input type="email" pInputText formControlName="email" inputId="email"/>
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="cardId">CC</label>
                                    <input type="number" pInputText formControlName="cardId" inputId="cardId"/>
                                </div>

                                <div class="field col-12 md:col-6">
                                    <label for="address">direccion</label>
                                    <input type="text" pInputText formControlName="address" inputId="address"/>
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="phone">Celular</label>
                                    <input type="number" pInputText formControlName="phone" inputId="phone"/>
                                </div>
                                <div class=" field col-12 flex justify-content-end">
                                    <p-button label="Guardar" [raised]="true" [disabled]="customerForm.invalid"></p-button>
                                </div>
                            </form>
                        }

                    </section>
                    <!-- seccion para los productos -->
                    <section class="col-12 bg-white border-round">
                        <h2>Seleccion de productos</h2>
                        <p-pickList [source]="sourceProducts" [target]="targetProducts" sourceHeader="Productos" targetHeader="Seleccionar" [dragdrop]="true" [responsive]="true"
                           (onMoveToTarget)="onMove($event)">
                            <ng-template let-product pTemplate="item">
                                <div class="flex flex-wrap p-2 align-items-center gap-3">
                                    <div class="flex-1 flex flex-column gap-2">
                                        <span class="font-bold">{{ product.name }}</span>
                                        <div class="flex align-items-center gap-2">
                                            <i class="pi pi-tag text-sm"></i>
                                            <span>{{ product.category.name }}</span>
                                        </div>
                                    </div>
                                    <span class="font-bold text-900">{{ '$' + product.basePrice}}</span>
                                </div>
                            </ng-template>
                        </p-pickList>
                    </section>
                    
                </section>

                <!-- seccion para ver la factura que se generara dinamicamente -->
                <section class="bg-white col border-round">
                   <app-bill [products]="targetProducts" />
                </section>

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

    // Controles de clientes 
    clientControls = signal({
        open: true,
        selectedClient: null,
        isNewClient: false,
        existClient: false,
        showForm: false
    })

    customers: Customers[] = []

    customerForm: FormGroup = this.fb.group({
        name: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email:  ["", [Validators.required]],
        cardId: ['', [Validators.required]],
        address: ['', [Validators.required]],
        phone: ['', [Validators.required]],
    });

    //

    // productos
    sourceProducts: Product[] = [];
    targetProducts: Product[] = [];
    //

    orderForm: FormGroup;

    constructor(private fb: FormBuilder, private customerService: ClienteService, private productService: ProductoService) {}

    ngOnInit(): void {

        this.productService.getProducts().subscribe({
            next: (res: any) => {
                this.sourceProducts = res;
            },
            error: (err) => {
                console.log(err);
            },
        });

    }

    typeClient(control: number){
        // 0 = nuevo cliente, 1 = cliente existente

        if(control === 0){
            this.clientControls.set({
                open: false,
                selectedClient: null,
                isNewClient: true,
                existClient: false,
                showForm: true
            })
        } 

        if(control === 1){
            this.clientControls.set({
                open: false,
                selectedClient: null,
                isNewClient: false,
                existClient: true,
                showForm: false
            })

            if (localStorage.getItem('customers')) {
                this.customers = JSON.parse(localStorage.getItem('customers') || '[]');
                return
            }

            this.customerService.getCustomers().subscribe({
                next: (res: any) => {
                    this.customers = res;
                    localStorage.setItem('customers', JSON.stringify(res));
                },
                error: (err) => {
                    console.log(err);
                },
            });
        }

    }

    onMove(event: any) {
        this.targetProducts = [...this.targetProducts.map( item => ({...item, quantity: 1}))]
    }

}
