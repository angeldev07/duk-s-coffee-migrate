import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { ActiveFormatoPipe } from 'src/app/shared/pipes/active-formato.pipe';
import { FechaFormatoPipe } from 'src/app/shared/pipes/fecha-formato.pipe';
import { Orders } from '../../api/order';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    MessagesModule,
    FechaFormatoPipe,
    ActiveFormatoPipe,
    InputSwitchModule
  ],
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
                    <th pSortableColumn="reference">Referencia <p-sortIcon field="reference" /></th>
                    <th pSortableColumn="customer">Cliente <p-sortIcon field="customer" /></th>
                    <th pSortableColumn="total">Total <p-sortIcon field="total" /></th>
                    <th pSortableColumn="state">Estado <p-sortIcon field="state" /></th>
                    <th pSortableColumn="dateOrder">Fecha <p-sortIcon field="dateOrder" /></th>
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
                    <td>{{ order.reference }}</td>
                    <td>{{ order.customer }}</td>
                    <td>{{ order.total }}</td>
                    <td>{{ order.state }}</td>
                    <td>{{ order.dateOrder | fechaFormato}}</td>
                    <td>
                        <button
                            pButton
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-danger"
                            (click)="deleteOrder.emit(order.id)"
                        ></button>
                    </td>
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
export class OrderListComponent {
    @Input() orders: Orders[] = [];
    @Output() deleteOrder = new EventEmitter<number>();
    //@Output() updateCustomer = new EventEmitter<Customers>();
    // @Output() deleteCustomers = new EventEmitter<number[]>();
    //@Output() activeChange = new EventEmitter<Customers>();

    messages: Message[] | undefined = [{ severity: 'info', summary: 'Lista vacia', detail: 'No hay ordenes por mostrar' }];;

}
