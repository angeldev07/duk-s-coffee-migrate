import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, type OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-products-no-category',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        MessagesModule
    ],
    template: `
    <!-- @if (products.length > 0) { -->
      <p-table
            [value]="products"
            [tableStyle]="{ 'min-width': '50rem' }"
            styleClass="p-datatable-striped"
            [paginator]="true"
            [rows]="5"
            [selectionPageOnly]="true"
            [rowsPerPageOptions]="[5, 10, 20]"
            [globalFilterFields]="['category.name']"
        >
            <ng-template pTemplate="emptymessage">
              <div class="p-fluid w-full">
                <p-messages [value]="messages" [enableService]="false" [closable]="false" ></p-messages>
              </div>
            </ng-template>
            
            <ng-template pTemplate="header">
                <tr>
                    <th pSortableColumn="id">ID <p-sortIcon field="id" /></th>
                    <th pSortableColumn="name">Producto <p-sortIcon field="name" /></th>
                    <th pSortableColumn="basePrice">Precio Base <p-sortIcon field="basePrice" /></th>
                    <th pSortableColumn="amount">Cantidad <p-sortIcon field="amount" /></th>
                    <th pSortableColumn="active">Activo <p-sortIcon field="active" /></th>
                    <th pSortableColumn="category.name">
                      Categoria 
                      <p-sortIcon field="category.name" />
                    </th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-product>
                @if (products.length > 0) {
                <tr>
                    <td>{{ product.id }}</td>
                    <td class="flex align-items-center gap-2">
                      <img [src]="product.profileImg" alt="imagen del productos {{product.name}}" class="w-3rem h-3rem">
                      {{ product.name }}
                    </td>
                    <td>{{ product.basePrice }}</td>
                    <td>{{ product.amount }}</td>
                    <td>{{ product.active ? 'Si' : 'No' }}</td>
                    <td>
                        {{
                            product.category
                                ? product.category.name
                                : 'Sin categoria'
                        }}
                    </td>
                </tr>
                }
            </ng-template>
        </p-table>
    <!-- } @else {
      <p-messages [value]="messages" [enableService]="false" [closable]="false"></p-messages>
    } -->
    `,
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsNoCategoryComponent implements OnInit {

  messages: Message[] | undefined = [{ severity: 'info', summary: 'Lista vacia', detail: 'No hay productos por mostrar' }];

  @Input() products = []

  ngOnInit(): void { }

}
