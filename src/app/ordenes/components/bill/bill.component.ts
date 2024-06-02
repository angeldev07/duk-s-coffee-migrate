import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Customers } from 'src/app/clientes/api/customer';
import { Product } from 'src/app/inventario/api';

@Component({
    selector: 'app-bill',
    standalone: true,
    imports: [
        CommonModule,
        DividerModule,
        TableModule,
        DatePipe,
        InputTextModule,
        FormsModule,
        ButtonModule
    ],
    template: `

        <section class="p-4">
            <!-- header de la factura -->
            <div class="flex justify-content-between ">
                <div>
                    <h2>Duks Coffe Inc.</h2>
                    <p>Av. 1ra. Calle 1-2 Zona 1</p>
                    <p>Cucuta, Norte de Santander</p>
                </div>
                <!-- logo   -->
                <div>
                    <img src="assets/Logo.jpeg" alt="logo de duks coffe" class="w-8rem h-8rem border-circle">
                </div>
            </div>

            <p-divider></p-divider>

            <!-- datos del cliente y fecha -->
            <div class="grid">
                <!-- cliente -->
                <div class="col-6">
                    <span class="inline-block mb-2 font-bold">Facturar a</span>
                    <div>
                        <p class="mb-0">{{ customer ? customer.name+' '+customer.lastName : '' }}</p>
                        <p class="mb-0">C.C: {{customer ? customer.cardId : '- - - -'}}</p>
                        <p class="mb-0">Cel: {{customer ? customer.phone : '- - - -'}}</p>
                    </div>
                </div>
                <!-- fecha -->
                <div class="col-6 text-right">
                    <span class="inline-block mb-2 font-bold">Datos extras</span>
                    <div>
                        <p class="mb-0">Fecha: {{ today | date}}</p>
                        <p class="mb-0">Direccion: {{customer ? customer.address : '- - - - - - - -'}}</p>
                    </div>
                </div>
            </div>

            <p-divider></p-divider>

            <!-- tabla de productos -->
            <div>
                <h3 class="mb-4">Productos</h3>
                <p-table [value]="products">
                <ng-template pTemplate="emptymessage">
                    <span class="inline-block p-4">No hay productos seleccionados</span>
                </ng-template>
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-product>
                        <tr>
                            <td>{{ product.name }}</td>
                            <td [pEditableColumn]="product.quantity" pEditableColumnField="quantity">
                                <p-cellEditor>
                                    <ng-template pTemplate="input">
                                        <input pInputText type="text" [(ngModel)]="product.quantity " />
                                    </ng-template>
                                    <ng-template pTemplate="output">
                                        {{ product.quantity }}
                                    </ng-template>
                                </p-cellEditor>
                            </td>
                            <td>{{ product.basePrice }}</td>
                            <td>{{ product.basePrice * product.quantity }}</td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="summary">
                    <div class="flex align-items-center justify-content-between">
                        Total de la cuenta <span class="font-bold">{{ total }}</span>
                    </div>
                    </ng-template>
                </p-table>
            </div>

            <div class="flex justify-content-end mt-3">
                <p-button label="Guardar" icon="pi pi-send" iconPos="right" (onClick)="onSave()" [disabled]="disableButton"></p-button>
            </div>

        </section>

    `,
    styles: `
        td, tr, th {
            text-align: center;
        }


    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillComponent {

    @Input({required: true}) customer: Customers | null = null;
    @Input({required: true}) products = [];

    @Output() onSaveBill = new EventEmitter();


    get today(){
        return new Date();
    }

    get total(){
        return this.products.reduce((acc: number, product) => acc + (product.basePrice * product.quantity), 0)
    }

    //Amount es la cantidad de productos que se van a comprar y el total es el precio total de la compra
    onSave(){
        this.onSaveBill.emit(
            {
                customer: this.customer,
                products: this.products.map(product => (
                    {
                        id:-1,
                        productId: product.id,
                        amount: product.quantity,
                        total: product.basePrice * product.quantity
                    }
                ))
            }
        );
    }


    get disableButton(){
        return (this.products.length === 0 || !this.customer) ||
               (this.products.some(product => product.quantity === 0))
    }



 }
