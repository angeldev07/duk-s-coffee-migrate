import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
    AddOrderComponent
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
                ></p-button>
        </section>
        <section>
        <p-tabView>
                    <p-tabPanel header="Listado">
                        <app-order-list
                            [orders]="orderList"
                        />
                    </p-tabPanel>
                </p-tabView>
        </section>
        @if (openAddOrderDialog) {
            <app-add-order
            />
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
    //orderList = signal<Customers[]>([]);
    orderList: Orders[] = [
        {
            id: 1,
            reference: "REF-001",
            customer: "John Doe",
            total: 100.50,
            state: "Pending",
            dateOrder: new Date("2024-05-01")
        },
        {
            id: 2,
            reference: "REF-002",
            customer: "Jane Smith",
            total: 150.75,
            state: "Completed",
            dateOrder: new Date("2024-05-05")
        },
        // Agrega más objetos según sea necesario
    ];
    // selectedCustomer = signal<Customers | null | number[]>(null);

    constructor(
       // private customerService: ClienteService,
        private messageService: MessageService
    ) { }


    ngOnInit(): void {

    }
}
