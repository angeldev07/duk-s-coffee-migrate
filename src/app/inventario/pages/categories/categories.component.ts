import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [
        CommonModule,
    ],
    template: `<p>categories works!</p>`,
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit {

    ngOnInit(): void { }

}
