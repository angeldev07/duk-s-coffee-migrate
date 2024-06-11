import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ProductsListComponent } from 'src/app/inventario/components/products-list/products-list.component';
import { Orders } from 'src/app/ordenes/api/order';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [DialogModule, DatePipe, CurrencyPipe, ButtonModule, ProductsListComponent],
  template: `
    <p-dialog
        [(visible)]="visible"
        [modal]="true"
        maskStyle="backdrop-filter: blur(2px); overflow-y: auto"
        [style]="{ width: '90vw' ,boxShadow: 'none' }"
        [draggable]="false"
        [resizable]="false"
        (onHide)="visibleChange.emit(false)">

      <ng-template pTemplate="headless">
        @if (order) {
          <section class="bg-white mb-6 border-round p-3">
            <div class="flex justify-content-between flex-wrap">
            <span class="">Ordenes</span>
            <button type="button" pButton icon="pi pi-times" (click)="visibleChange.emit(false)" class="absolute top-0 right-0 p-button-rounded p-button-text"></button>
            </div>
            <h2 class="text-2xl">
              <span class="inline-block  text-bluegray-400"># {{order.id}} </span>
              de {{ order.client.name+' '+order.client.lastName }}
              <span class="inline-block border-round p-2 bg-blue-300 text-white"> {{order.bill.totalPrice | currency}} </span>
              <span> {{order.bill.dateBill | date}} </span>
            </h2>
          </section>

          <section class="grid">
            <!-- Cliente details -->
            <div class="bg-white border-round p-0 col-12 mb-4 xl:mb-0 xl:mr-2 xl:col-4">
              <!-- header -->
              <div class="bg-gray-50 border-bottom-1 border-gray-100 p-3 border-round-top">
                <span>Cliente</span>
              </div>

              <div class="p-2 mb-3 ">
                <span class="block p-3 bg-gray-100 font-bold text-xl border-round">
                  <i class="pi pi-user mr-2"></i>
                  {{order.client.name+' '+order.client.lastName}}
                  # {{order.client.id}}
                </span>
              </div>

              <div class="px-4 pb-4">
                  <p class="font-bold mb-2">
                    Email: <span class="block w-full font-normal"> {{order.client.email}} </span>
                  </p>
                  <p class="font-bold ">
                    Cuenta registrada: <span class="block w-full font-normal"> {{order.client.lastVisit | date}} </span>
                  </p>
              </div>

            </div>

            <div class="bg-white col-12 xl:col p-0 border-round">
              <div class="bg-gray-50 border-bottom-1 border-gray-100 p-3 border-round-top">
                  <span>Productos</span>
              </div>
              <div class="">
                <app-products-list [products]="order.productList" [actionsEnabled]="false" [showAmountBill]="true"></app-products-list>
              </div>
              <div class="">
                <div class="block w-full p-3 bg-gray-100 font-bold text-xl border-round">
                  <span class="text block w-full">(Total con IVA incluido)</span>
                  <div>
                    <i class="pi pi-shopping-cart mr-2"></i>
                    Total: {{order.bill.totalPrice | currency}}
                  </div>
                </div>
              </div>
            </div>

          </section>
        } @else{
          <div class="bg-white">
          <i class="pi pi-spin pi-spinner" style="font-size: 10rem"></i>
          </div>
        }

      </ng-template>

      </p-dialog>
  `,
  styles: `
    .text{
      font-size: 10px;
      text-align: center
    }
  `
})
export class OrderDetailsComponent {
    @Input() order: any = {};
    @Input() visible: boolean;
    @Output() visibleChange = new EventEmitter<boolean>();

}
