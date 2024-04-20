import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { Customers } from 'src/app/clientes/api/customer';
import { Product } from 'src/app/inventario/api';

@Component({
    selector: 'app-bill',
    standalone: true,
    imports: [
        CommonModule,
        DividerModule,
        TableModule
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
                        <p class="mb-0">Angel Garcia</p>
                        <p class="mb-0">C.C. 123456789</p>
                        <p class="mb-0">Cel. 1234567890</p>
                    </div>
                </div>
                <!-- fecha -->
                <div class="col-6 text-right">
                    <span class="inline-block mb-2 font-bold">Datos extras</span>
                    <div>
                        <p class="mb-0">Fecha: 12/12/2021</p>
                        <p class="mb-0">N de pedido: 3423  </p>
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
                            <td>{{ product.quantity }}</td>
                            <td>{{ product.basePrice }}</td>
                            <td>{{ product.basePrice * product.quantity }}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>

        </section>
    
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillComponent {

    @Input({required: true}) customer: Customers | null = null;
    @Input({required: true}) products = [];


 }
