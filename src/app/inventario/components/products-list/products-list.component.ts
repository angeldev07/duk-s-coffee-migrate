import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    signal,
    type OnInit,
} from '@angular/core';
import { Category, Product } from '../../api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-products-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule,MessagesModule, InputTextModule],
    template: `
        @if (products.length > 0) {
        <p-table
            [value]="products"
            [tableStyle]="{ 'min-width': '50rem' }"
            styleClass="p-datatable-striped"
            [paginator]="true"
            [rows]="5"
            [selectionPageOnly]="true"
            [(selection)]="selectedProducts"
            (onRowSelect)="showDeletedProducts()"
            (onHeaderCheckboxToggle)="showDeletedProducts()"
            [rowsPerPageOptions]="[5, 10, 20]"
            [globalFilterFields]="['category.name']"
            #dt2
        >
        <ng-template pTemplate="caption">
            <div class="flex">
                <p-iconField iconPosition="left" class="ml-auto">
                    <input 
                        pInputText 
                        type="text" 
                        (input)="dt2.filterGlobal($event.target.value, 'contains')" 
                        placeholder="Buscar por nombre"
                        pTooltip="Buscar por nombre" tooltipPosition="top" 
                        />
                </p-iconField>
            </div>
        </ng-template>
            <ng-template pTemplate="header">
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
                    </th>
                    <th pSortableColumn="id">ID <p-sortIcon field="id" /></th>
                    <th pSortableColumn="name">Producto <p-sortIcon field="name" /></th>
                    <th pSortableColumn="basePrice">Precio Base <p-sortIcon field="basePrice" /></th>
                    <th pSortableColumn="amount">Cantidad <p-sortIcon field="amount" /></th>
                    <th pSortableColumn="active">Activo <p-sortIcon field="active" /></th>
                    <th pSortableColumn="category.name">
                      Categoria
                      <p-sortIcon field="category.name" />
                    </th>
                    @if (actionsEnabled) {
                        <th >Acciones</th>
                    }
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-product>
                @if (products.length > 0) {
                <tr>
                    <th>
                        <p-tableCheckbox [value]="product"></p-tableCheckbox>
                    </th>
                    <td>{{ product.id }}</td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.basePrice }}</td>
                    <td>{{ showAmountBill ?  product.amountBill : product.stock  }}</td>
                    <td>{{ product.active }}</td>
                    <td>
                        {{
                            product.category
                                ? product.category.name
                                : 'Sin categoria'
                        }}
                    </td>
                    @if (actionsEnabled) {
                        <td>
                            <button
                                pButton
                                icon="pi pi-pencil"
                                class="p-button-rounded p-button-success"
                                (click)="updateProduct.emit(product)"
                            ></button>
                            <button
                                pButton
                                icon="pi pi-trash"
                                class="p-button-rounded p-button-danger"
                                (click)="deleteProduct.emit(product.id)"
                            ></button>
                        </td>
                    }
                </tr>
                }
            </ng-template>
        </p-table>
        } @else {
          <p-messages [value]="messages" [enableService]="false" [closable]="false"></p-messages>
        }
    `,
    styles: `
    :host {
      display: block;
    }
    td, th {
      text-align: center;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent implements OnInit {
    @Input() products: Product[] = [];
    @Output() deleteProduct = new EventEmitter<number>();
    @Output() updateProduct = new EventEmitter<Product>();
    @Output() deleteProducts = new EventEmitter<number[]>();

    @Input() actionsEnabled = true;
    @Input() showAmountBill = false;

    selectedProducts!: any;
    messages: Message[] | undefined = [{ severity: 'info', summary: 'Lista vacia', detail: 'No hay productos por mostrar' }];;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {

    }

    showDeletedProducts() {
      this.deleteProducts.emit(this.selectedProducts.map((product: Product) => product.id));
    }

}
