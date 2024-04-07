import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy, Component,
  signal,
  type OnInit
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { AddUpdateProductComponent } from '../../components/add-update-product/add-update-product.component';
import { ProductsListComponent } from '../../components/products-list/products-list.component';
import { Category, Product } from '../../api';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// TODO: Implementar la funcionalidad de eliminar productos por lote
@Component({
    selector: 'app-products',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TabViewModule,
        TableModule,
        DropdownModule,
        AddUpdateProductComponent,
        ProductsListComponent,
        FormsModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <main>
            <section
                class="card flex justify-content-between align-items-center px-4"
            >
                <h2 class="mb-0 text-2xl md:text-3xl">Productos</h2>
                <p-button
                    label="Agregar"
                    icon="pi pi-plus"
                    [iconPos]="'right'"
                    [outlined]="true"
                    (onClick)="openAddProductDialog = true"
                ></p-button>
            </section>

            <section>
                <div class="mb-4 formgrid grid">
                    <div class="field col md:col-6 flex flex-column">
                        <p class="text-md mb-0">Accion por lote</p>
                        <p-dropdown
                            [options]="[{ name: 'Eliminar' }]"
                            optionLabel="name"
                            placeholder="Accion por lote"
                            [styleClass]="'w-full'"
                            (onChange)="deleteProductsList($event)"
                        ></p-dropdown>
                    </div>
                    <div class="field col md:col-6 flex flex-column">
                        <p class="text-md mb-0 md:text-right">
                            Seleccionar categoria
                        </p>
                        <p-dropdown
                            [options]="categories()"
                            optionLabel="name"
                            placeholder="Seleccionar categoria"
                            (onChange)="applyFilter($event)"
                            [styleClass]="'w-full'"
                        ></p-dropdown>
                    </div>
                </div>
                <p-tabView>
                    <p-tabPanel header="Listado">
                        <app-products-list
                            [products]="filteredProducts"
                            (deleteProduct)="deleteProduct($event)"
                            (updateProduct)="
                                selectedProduct.set($event);
                                openAddProductDialog = true
                            "
                            (deleteProducts)="setDeleteProductsList($event)"
                        />
                    </p-tabPanel>
                    <p-tabPanel header="Activos">
                        <ng-template pTemplate="content">
                            <app-products-list [products]="activeProducts" />
                        </ng-template>
                    </p-tabPanel>
                    <p-tabPanel header="Deshabilitados">
                        <ng-template pTemplate="content">
                            <app-products-list [products]="disabledProducts" />
                        </ng-template>
                    </p-tabPanel>
                </p-tabView>
            </section>
            @if (openAddProductDialog) {
            <app-add-update-product
                (saveProduct)="saveProduct($event)"
                [(visible)]="openAddProductDialog"
                [categories]="categories().slice(1, categories().length)"
                [product]="selectedProduct()"
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
export class ProductsComponent implements OnInit {
    openAddProductDialog = false;
    productList = signal<Product[]>([]);
    categories = signal<Category[]>([{ id: -1, name: 'Todo', active: true }]);
    selectedCategory = signal<Category | null>(null);
    selectedProduct = signal<Product | null | number[]>(null);
    

    constructor(
        private productService: ProductoService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.getProducts();
        this.getCategories();
    }

    get activeProducts() {
        return this.productList().filter((product) => product.active);
    }

    get disabledProducts() {
        return this.productList().filter((product) => !product.active);
    }

    get filteredProducts() {
        return this.productList().filter((product) => {
            if (
                this.selectedCategory() === null ||
                this.selectedCategory().name === 'Todo'
            )
                return true;
            return product.category?.id === this.selectedCategory().id;
        });
    }

    applyFilter(event) {
        const { value } = event;
        this.selectedCategory.set(value);
    }

    getProducts() {
        this.productService.getProducts().subscribe({
            next: (res: any) => {
                this.productList.set(res);
            },
            error: (err) => {
              console.log(err);
            },
        });
    }

    getCategories() {
        this.productService.getCategories().subscribe({
            next: (res: any) => {
                this.categories.update((value) => [...value, ...res]);
            },
        });
    }

    saveProduct(producto: Product) {
        if (producto.id === -1) {
            this.saveNewProduct(producto);
        } else {
            this.updateProduct(producto);
        }
    }

    saveNewProduct(product: Product) {
        const data = {
            name: product.name,
            basePrice: product.basePrice,
            amount: product.amount,
            active: product.active,
            category: product.category,
            profileImg: product.profileImg,
        };

        this.productService.saveProduct(data).subscribe({
            next: () => {
                this.getProducts();
                this.messageService.clear();
                this.messageService.add({ severity: 'success', summary: 'Agregado', detail: 'Se ha agregado el producto con éxito' });
            },
            error: (err) => {
              this.messageService.clear();
              this.messageService.add({ severity: 'error', summary: 'Error :(', detail: 'Ha ocurrido un error inesperado. Intentelo de nuevo' });
              console.log(err);
            },
        });
    }

    deleteProduct(id: number) {
        this.productService.deleteProduct(id).subscribe({
            next: () => {
                this.getProducts();
                this.messageService.clear();
                this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Se ha eliminado el producto con éxito' });
            },
            error: (err) => {
              this.messageService.clear();
              this.messageService.add({ severity: 'error', summary: 'Error :(', detail: 'Ha ocurrido un error inesperado. Intentelo de nuevo' });
              console.log(err);
            },
        });
    }

    updateProduct(product: Product) {
        this.productService.updateProduct(product).subscribe({
            next: () => {
                this.getProducts();
                this.messageService.clear();
                this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Se ha actualizado el producto con éxito' });
            },
            error: (err) => {
              this.messageService.clear();
              this.messageService.add({ severity: 'error', summary: 'Error :(', detail: 'Ha ocurrido un error inesperado. Intentelo de nuevo' });
              console.log(err);
            },
        });
    }
    setDeleteProductsList(event: any) {
      this.selectedProduct.set(event);
    }

    deleteProductsList(products: number[]) {
        this.productService.deleteProductsByList(products).subscribe({
            next: () => {
                this.getProducts();
            },
            error: (err) => {
              this.messageService.clear();
              this.messageService.add({ severity: 'success', summary: 'Elimados', detail: 'Se han eliminado los productos seleccionados con éxito' });
              console.log(err);
            },
        });
    }
}
