import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
    selector: 'app-revision',
    standalone: true,
    imports: [
        CommonModule,
    ],
    template: `<p>revision works!</p>`,
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevisionComponent implements OnInit {

    ngOnInit(): void { }

}
