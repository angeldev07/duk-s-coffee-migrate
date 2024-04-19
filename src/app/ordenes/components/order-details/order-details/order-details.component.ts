import { Component, Input } from '@angular/core';
import { Orders } from 'src/app/ordenes/api/order';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [],
  template: `
    <p>
      order-details works!
    </p>
  `,
  styles: ``
})
export class OrderDetailsComponent {
    @Input() orderId: Orders;

}
