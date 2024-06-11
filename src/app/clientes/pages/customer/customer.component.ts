
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy, Component, signal,
    type OnInit
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ClienteService } from '../../services/cliente.service';
import { MessageService } from 'primeng/api';
import { Customers } from '../../api/customer';
import { DropdownModule } from 'primeng/dropdown';
import { CustomerListComponent } from '../../components/customer-list/customer-list.component';
import { AddUpdateCustomerComponent } from '../../components/add-update-customer/add-update-customer/add-update-customer.component';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-customer',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        TabViewModule,
        TableModule,
        DropdownModule,
        ToastModule,
        CustomerListComponent,
        AddUpdateCustomerComponent
    ],
    providers: [MessageService],
    template: `
    <main>
        <section
        class="card flex justify-content-between align-items-center px-4"
        >
        <h2 class="mb-0 text-2xl md:text-3xl">Clientes</h2>
                <p-button
                    label="Agregar"
                    icon="pi pi-plus"
                    [iconPos]="'right'"
                    [outlined]="true"
                    (onClick)="openAddCustomerDialog = true"
                ></p-button>
        </section>

        <section>
            <p-tabView>
                <p-tabPanel header="Listado">
                    <app-customer-list
                        [customers]="clientesList"
                        (deleteCustomer)="deleteCustomer($event)"
                        (deleteCustomers)="setDeleteCustomerList($event)"
                        (activeChange)="activeChange($event)"
                        (updateCustomer)="
                            selectedCustomer.set($event);
                            openAddCustomerDialog = true
                        "
                    />
                </p-tabPanel>
                <p-tabPanel header="Activos">
                    <ng-template pTemplate="content">
                        <app-customer-list [customers]="activeCustomers" />
                    </ng-template>
                </p-tabPanel>
                <p-tabPanel header="Deshabilitados">
                    <ng-template pTemplate="content">
                        <app-customer-list [customers]="disableCustomers" />
                    </ng-template>
                </p-tabPanel>
            </p-tabView>
        </section>
        @if (openAddCustomerDialog) {
            <app-add-update-customer
                (saveCustomer)="saveCustomer($event)"
                [(visible)]="openAddCustomerDialog"
                (visibleChange)="clear($event)"
                [customer]="selectedCustomer()"
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
export class CustomerComponent implements OnInit {

    openAddCustomerDialog = false;
    customerList = signal<Customers[]>([]);
    selectedCustomer = signal<Customers | null | number[]>(null);

    constructor(
        private customerService: ClienteService,
        private messageService: MessageService,
    ) { }


    ngOnInit(): void {
        this.getCustomers();
    }

    get activeCustomers() {
        return this.customerList().filter((customer) => customer.active);
    }

    get disableCustomers() {
        return this.customerList().filter((customer) => !customer.active);
    }

    get clientesList() {
        return this.customerList();
    }


    getCustomers() {
        this.customerService.getCustomers().subscribe({
            next: (res: any) => {
                this.customerList.set(res);
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    saveCustomer(cliente: Customers) {
        if (cliente.id === -1) {
            this.saveNewCustomer(cliente);
        } else {
            this.updateCustomer(cliente);
        }
    }

    saveNewCustomer(cliente: Customers) {
        const data = {
            id: cliente.id,
            name: cliente.name,
            lastName: cliente.lastName,
            email: cliente.email,
            cardId: cliente.cardId,
            gender: cliente.gender,
            birthDay: cliente.birthDay,
            active: cliente.active,
            lastVisit: cliente.lastVisit,
            address: cliente.address,
            phone: cliente.phone,
        };
        this.customerService.saveCustomer(data).subscribe({
            next: () => {
                this.getCustomers();
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

    deleteCustomer(id: number) {
        this.customerService.deleteCustomer(id).subscribe({
            next: () => {
                this.getCustomers();
                this.messageService.clear();
                this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Se ha eliminado el cliente con éxito' });
            },
            error: (err) => {
                this.messageService.clear();
                this.messageService.add({ severity: 'error', summary: 'Error :(', detail: 'Ha ocurrido un error inesperado. Intentelo de nuevo' });
                console.log(err);
            },
        });
    }

    updateCustomer(cliente: Customers) {
        this.customerService.updateCustomer(cliente.id, cliente).subscribe({
            next: () => {
                this.getCustomers();
                this.messageService.clear();
                this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Se ha actualizado el cliente con éxito' });
            },
            error: (err) => {
               this.messageService.clear();
               this.messageService.add({ severity: 'error', summary: 'Error :(', detail: 'Ha ocurrido un error inesperado. Intentelo de nuevo' });
                console.log(err);
            },
        });
    }

    setDeleteCustomerList(event: any) {
        this.selectedCustomer.set(event);
    }

    getCustomersWithoutMessage() {
        this.customerService.getCustomers().subscribe({
            next: (res: any) => {
                this.customerList.set(res);
            },
        });
    }

    activeChange(event: Customers) {
        this.customerService.activeCustomer(event.id, event.active).subscribe({
            next: (res: any) => {
                this.getCustomersWithoutMessage();
                this.messageService.clear();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Cliente actualizado',
                    detail: 'El cliente se ha actualizado correctamente',
                });
            },
        });
    }

    clear(event: boolean) {
        this.openAddCustomerDialog = false;
        this.selectedCustomer.set(null)
     }
}
