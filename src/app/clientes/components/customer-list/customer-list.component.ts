import { ActiveFormatoPipe } from './../../../shared/pipes/active-formato.pipe';
import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    Output,
    ChangeDetectionStrategy,
    type OnInit
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { Customers } from '../../api/customer';
import { HttpClient } from '@angular/common/http';
import { Message } from 'primeng/api';
import { FechaFormatoPipe } from 'src/app/shared/pipes/fecha-formato.pipe';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-customer-list',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        MessagesModule,
        FechaFormatoPipe,
        ActiveFormatoPipe,
        FormsModule,
        InputSwitchModule
    ],
    template: `
        @if (customers.length > 0) {
        <p-table
            [value]="customers"
            [tableStyle]="{ 'min-width': '50rem' }"
            styleClass="p-datatable-striped"
            [paginator]="true"
            [rows]="5"
            [selectionPageOnly]="true"
            [(selection)]="selectedCustomers"
            [rowsPerPageOptions]="[5, 10, 20]"
            [globalFilterFields]="['name']"
        >
            <ng-template pTemplate="header">
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
                    </th>
                    <th pSortableColumn="id">ID <p-sortIcon field="id" /></th>
                    <th pSortableColumn="name">Nombre <p-sortIcon field="name" /></th>
                    <th pSortableColumn="lastName">Apellidos <p-sortIcon field="lastName" /></th>
                    <th pSortableColumn="email">Correo <p-sortIcon field="email" /></th>
                    <th pSortableColumn="cardId">Documento <p-sortIcon field="cardId" /></th>
                    <th pSortableColumn="gender">Género <p-sortIcon field="gender" /></th>
                    <th pSortableColumn="birthDay">Fecha Nacimiento <p-sortIcon field="birthDay" /></th>
                    <th pSortableColumn="lastVisit">Última Visita <p-sortIcon field="lastVisit" /></th>
                    <th pSortableColumn="address">Dirección Residencia <p-sortIcon field="address" /></th>
                    <th pSortableColumn="phone">Teléfono <p-sortIcon field="phone" /></th>
                    <th pSortableColumn="active">Activo <p-sortIcon field="active" /></th>
                    <th >Acciones</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-customer>
                @if (customers.length > 0) {
                <tr>
                    <th>
                        <p-tableCheckbox [value]="customer"></p-tableCheckbox>
                    </th>
                    <td>{{ customer.id }}</td>
                    <td>{{ customer.name }}</td>
                    <td>{{ customer.lastName }}</td>
                    <td>{{ customer.email }}</td>
                    <td>{{ customer.cardId }}</td>
                    <td>{{ customer.gender }}</td>
                    <td>{{ customer.birthDay | fechaFormato }}</td>
                    <td>{{ customer.lastVisit | fechaFormato }}</td>
                    <td>{{ customer.address }}</td>
                    <td>{{ customer.phone }}</td>
                    <td>
                        <p-inputSwitch [(ngModel)]="customer.active" (onChange)="activeChange.emit(customer)"></p-inputSwitch>
                    </td>
                    <td>
                        <button
                            pButton
                            icon="pi pi-pencil"
                            class="p-button-rounded p-button-success"
                            (click)="updateCustomer.emit(customer)"
                        ></button>

                        <button
                            pButton
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-danger"
                            (click)="deleteCustomer.emit(customer.id)"
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
export class CustomerListComponent implements OnInit {
    @Input() customers: Customers[] = [];
    @Output() deleteCustomer = new EventEmitter<number>();
    @Output() updateCustomer = new EventEmitter<Customers>();
    @Output() activeChange = new EventEmitter<Customers>();
    selectedCustomers!: any;
    messages: Message[] | undefined = [{ severity: 'info', summary: 'Lista vacia', detail: 'No hay clientes por mostrar' }];;

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
    }

}
