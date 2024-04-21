import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { ActiveFormatoPipe } from 'src/app/shared/pipes/active-formato.pipe';
import { FechaFormatoPipe } from 'src/app/shared/pipes/fecha-formato.pipe';
import { Orders } from '../../api/order';
import { Message } from 'primeng/api';
import { OrderDetailsComponent } from "../order-details/order-details/order-details.component";

@Component({
    selector: 'app-order-list',
    standalone: true,
    template: `
    @if (orders.length > 0) {
        <p-table
            [value]="orders"
            [tableStyle]="{ 'min-width': '50rem' }"
            styleClass="p-datatable-striped"
            [paginator]="true"
            [rows]="5"
            [selectionPageOnly]="true"
            [rowsPerPageOptions]="[5, 10, 20]"
            [globalFilterFields]="['name']"
        >
            <ng-template pTemplate="header">
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
                    </th>
                    <th pSortableColumn="id">ID <p-sortIcon field="id" /></th>
                    <th pSortableColumn="customer">Cliente <p-sortIcon field="customer" /></th>
                    <th pSortableColumn="reference">Referencia Factura<p-sortIcon field="reference" /></th>
                    <th pSortableColumn="total">Total Factura<p-sortIcon field="total" /></th>
                    <th pSortableColumn="dateOrder">Fecha Pedido<p-sortIcon field="dateOrder" /></th>
                    <th >Acciones</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-order>
                @if (orders.length > 0) {
                <tr>
                    <th>
                        <p-tableCheckbox [value]="order"></p-tableCheckbox>
                    </th>
                    <td>{{ order.id }}</td>
                    <td>{{ order.client.name + " " + order.client.lastName}}</td>
                    <td>{{ order.bill.id }}</td>
                    <td>{{ order.bill.totalPrice | currency}} COP</td>
                    <td>{{ order.date | fechaFormato}}</td>
                    <td>
                        <p-button
                            icon="pi pi-search"
                            class="p-button-rounded p-button-info"
                            (onClick)="openOrderDetailsDialog(order.id)"
                        ></p-button>
                    </td>
                </tr>
                }


                @if (openOrderDetailsDialog === order.id) {
                <app-order-details
                    [orderId]="selectedOrderId"
                    [(visible)]="openOrderDetailsDialog"
                />
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
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        MessagesModule,
        FechaFormatoPipe,
        ActiveFormatoPipe,
        InputSwitchModule,
        OrderDetailsComponent,
        CurrencyPipe
    ]
})
export class OrderListComponent {
    @Input() orders: Orders[] = [];
    @Output() orderDetails = new EventEmitter();

    selectedOrderId: number | null = null;

    openOrderDetails(orderId: number) {
        this.selectedOrderId = orderId;
    }
    openOrderDetailsDialog(id:number){
        this.orderDetails.emit(id);
    }

    

    messages: Message[] | undefined = [{ severity: 'info', summary: 'Lista vacia', detail: 'No hay ordenes por mostrar' }];;

}
