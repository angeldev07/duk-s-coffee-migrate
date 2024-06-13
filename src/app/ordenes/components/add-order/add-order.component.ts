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
import { map } from 'rxjs';
import { NewCustomerComponent } from '../new-customer/new-customer.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from 'src/app/demo/components/auth/services/auth.service';

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
    PickListModule,
    NewCustomerComponent,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-dialog
        [(visible)]="visible"
        [modal]="true"
        maskStyle="backdrop-filter: blur(2px); overflow-y: auto"
        [style]="{ width: '90vw',height: '550px' ,boxShadow: 'none' }"
        [draggable]="false"
        [resizable]="false"
        (onHide)="visibleChange.emit(false)"
        >

        <ng-template pTemplate="headless">
            <div class="grid gap-3">

                <!-- seccion para el cliente y los prodcutos dividoso en 2, arriba la infromacion del cliente, abajo los productos -->
                <section class="grid col  md:col-7  border-round">

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
                            <p-dropdown [options]="customers" optionLabel="name" [showClear]="true" placeholder="Seleccione un cliente" (onChange)="selectCustomer($event)">
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
                           <app-new-customer (onSaveCustomer)="saveCustomer($event)" />
                        }

                    </section>
                    <!-- seccion para los productos -->
                    <section class="col-12 bg-white border-round">
                        <h2>Seleccion de productos</h2>
                        <p-pickList [source]="sourceProducts" [target]="targetProducts" sourceHeader="Productos" targetHeader="Seleccionar" [dragdrop]="true" [responsive]="true"
                           (onMoveToTarget)="onMove($event)" (onMoveToSource)="onMove($event)" (onMoveAllToSource)="onMove($event)" (onMoveAllToTarget)="onMove($event)"
                           filterBy="name" sourceFilterPlaceholder="Buscar por nombre" targetFilterPlaceholder="Buscar por nombre">
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
                <section class="bg-white col border-round bill">
                   <app-bill [products]="this.billInfo().products" [customer]="this.billInfo().customer" (onSaveBill)="saveBill($event)" />
                </section>


            </div>
            <section class="bg-white w-min mt-10 border-round mx-auto">
                <button type="button" pButton icon="pi pi-times" label="Cerrar" (click)="visibleChange.emit(false)" class=" p-button-rounded p-button-text"></button>
                </section>
            <p-toast></p-toast>
        </ng-template>
    </p-dialog>
  `,
  styles: `
     .bill{
        height: 550px;
        overflow-y: auto;
     }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddOrderComponent implements OnInit {
    @Input() visible: boolean;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() saveOrder = new EventEmitter();

    // Controles de clientes
    clientControls = signal({
        open: true,
        selectedClient: null,
        isNewClient: false,
        existClient: false,
        showForm: false
    })

    customers: Customers[] = []

    // productos
    sourceProducts: Product[] = [];
    targetProducts: Product[] = [];
    //

    orderForm: FormGroup;

    //bill inputs
    billInfo = signal({customer: null, products: []})

    constructor(
        private fb: FormBuilder, private customerService: ClienteService,
        private productService: ProductoService,
        private messageService: MessageService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {

        this.productService.getProductsWithCategory().pipe(
            map((res: any) => res.map((product: Product) => ({...product, quantity: 1})) )
        ).subscribe({
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

            this.getClients()
        }

    }

    onMove(event: any) {
        const {customer} = this.billInfo()
        this.billInfo.set( {
            products: [...this.targetProducts],
            customer
        })
    }

    saveCustomer(event: Customers){
        this.billInfo.update((state) => ({...state, customer: event}))
        this.customerService.saveCustomer(event).subscribe(
            {
                next: (res: any) => {
                    localStorage.removeItem('customers');
                    this.clientControls.set({
                        open: false,
                        selectedClient: res,
                        isNewClient: false,
                        existClient: true,
                        showForm: false
                    })
                },
                error: (err) => {
                    console.log(err);
                },
            }
        )
    }

    private getClients(){
        this.customerService.getCustomers().subscribe({
            next: (res: any) => {
                this.customers = res;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    selectCustomer(event){
        const {value} = event
        this.clientControls.set({
            open: false,
            selectedClient: null,
            isNewClient: false,
            existClient: false,
            showForm: false
        })

        this.billInfo.update((state) => ({...state, customer: value}))

    }

    saveBill(event:any){
        const {customer, products} = event
        console.log(this.auth.user.value.id);

        const data = {
            id: -1,
            userId:this.auth.user.value.id,
            clientId: customer.id,
            date: new Date(),
            orderxproducts: products,
            billId: -1
        }

        this.saveOrder.emit(data)
        this.visibleChange.emit(false)


    }

}
