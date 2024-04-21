import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { OrderListComponent } from '../../components/order-list/order-list.component';
import { AddOrderComponent } from '../../components/add-order/add-order.component';
import { MessageService } from 'primeng/api';
import { Orders } from '../../api/order';
import { OrdenService } from '../../services/orden.service';
import { OrderDetailsComponent } from '../../components/order-details/order-details/order-details.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TabViewModule,
    TableModule,
    DropdownModule,
    ToastModule,
    OrderListComponent,
    AddOrderComponent,
    OrderDetailsComponent
  ],
  providers: [MessageService],
  template: `
    <main>
        <section class="card flex justify-content-between align-items-center px-4">
            <h2 class="mb-0 text-2xl md:text-3xl">Órdenes</h2>
                <p-button
                    label="Agregar"
                    icon="pi pi-plus"
                    [iconPos]="'right'"
                    [outlined]="true"
                    (onClick)="openAddOrderDialog = true"
                ></p-button>
        </section>
        <section>
            <p-tabView>
                <p-tabPanel header="Listado">
                    <app-order-list
                        [orders]="ordenesList"
                        (orderDetails)="getOrderDetails($event)"
                    />
                </p-tabPanel>
            </p-tabView>
        </section>
        @if (openAddOrderDialog) {
            <app-add-order
                (saveOrder)="saveNewOrder($event)"
                [(visible)]="openAddOrderDialog"
            />
        }

        @if (openOrderDetailsDialog) {
            <app-order-details [(visible)]="openOrderDetailsDialog" [order]="orderDetails()" />
        }
            <p-toast />
    </main>

  `,
  styles: `
  :host {
    display: block;
  }
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderComponent implements OnInit {

    openAddOrderDialog = false;
    orderList = signal<Orders[]>([]);
    orderDetails = signal<Orders | null>(null);
    openOrderDetailsDialog = false;

    constructor(
        private orderService: OrdenService,
        private messageService: MessageService
    ) { }


    ngOnInit(): void {
        this.getOrdersList();
    }

    get ordenesList() {
        return this.orderList();
    }

    getOrdersList() {
        this.orderService.getOrders().subscribe({
            next: (res: any) => {
                this.orderList.set(res);
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    getOrderDetails(orderId: number) {
        this.openOrderDetailsDialog = true;
        this.orderService.getOrdersById(orderId).subscribe({
            next: (res: any) => {
                this.orderDetails.set(res);
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    saveCustomer(orden: Orders) {
            this.saveNewOrder(orden);
    }

    saveNewOrder(orden: any) {

        this.orderService.saveOrder(orden).subscribe({
            next: () => {
                this.getOrdersList();   
                this.messageService.clear();
                this.messageService.add({ severity: 'success', summary: 'Agregado', detail: 'Se ha registrado el cliente con éxito' });
            },
            error: (err) => {
                this.messageService.clear();
                this.messageService.add({ severity: 'error', summary: 'Error :(', detail: 'Ha ocurrido un error inesperado. Intentelo de nuevo' });
                console.log(err);
            },
        });
    }
}
