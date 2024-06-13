import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProductsNoCategoryComponent } from '../../components/products-no-category/products-no-category.component';
import { RevisionService } from '../../services/revision.service';

@Component({
    selector: 'app-revision',
    standalone: true,
    imports: [
        CommonModule,
        ProductsNoCategoryComponent
    ],
    template: `
      <main>
        <section class="card flex justify-content-between align-items-center px-4 mb-6">
            <h2 class="mb-0 text-2xl md:text-3xl">Revision general</h2>
        </section>

        <section class="card">
          <div class="flex justify-content-between align-items-center mb-6">
              <h2 class="mb-0 text-2xl ">Productos sin categoria</h2>
          </div>
          <app-products-no-category [products]="stats().productsWithouCategoriesDTOList" />
        </section>
        <section class="card">
          <div class="flex justify-content-between align-items-center mb-6">
              <h2 class="mb-0 text-2xl ">Productos bajos de stock</h2>
          </div>
          <app-products-no-category [products]="stats().productsLowStock" />
        </section>
        <section class="card">
          <div class="flex justify-content-between align-items-center mb-6">
              <h2 class="mb-0 text-2xl ">Productos desactivados</h2>
          </div>
          <app-products-no-category [products]="stats().productsDeactivate" />
        </section>
      </main>
    `,
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevisionComponent implements OnInit {

  stats = signal<any>({})

  constructor(private revisionService: RevisionService) {}

  ngOnInit(): void {

    this.revisionService.getStats().subscribe({
      next: (res) => {
        this.stats.set(res)
      }
    })

  }

}
