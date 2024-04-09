import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    signal,
    type OnInit,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { CategoriesListComponent } from '../../components/categories-list/categories-list.component';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AddUpdateCateogryComponent } from '../../components/add-update-cateogry/add-update-cateogry.component';

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TabViewModule,
        CategoriesListComponent,
        ToastModule,
        AddUpdateCateogryComponent,
    ],
    providers: [MessageService],
    template: `
        <main>
            <section
                class="card flex justify-content-between align-items-center px-4"
            >
                <h2 class="mb-0 text-2xl md:text-3xl">Categorias</h2>
                <p-button
                    label="Agregar"
                    icon="pi pi-plus"
                    [iconPos]="'right'"
                    [outlined]="true"
                    (onClick)="openAddCategoryDialog = true"
                ></p-button>
            </section>

            <section>
                <p-tabView>
                    <p-tabPanel header="Listado">
                        <app-categories-list
                            [categories]="categoriesList()"
                            (deleteCategory)="deleteCategory($event)"
                            (activeChange)="activeChange($event)"
                            (updateCategory)="
                                selectedCategory.set($event);
                                openAddCategoryDialog = true
                            "
                        />
                    </p-tabPanel>
                </p-tabView>
            </section>
            @if (openAddCategoryDialog) {
            <app-add-update-cateogry
                [(visible)]="openAddCategoryDialog"
                (saveCategory)="saveCategory($event)"
                [category]="selectedCategory()"
            />
            }
            <p-toast></p-toast>
        </main>
    `,
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit {
    categoriesList = signal<Category[]>([]);
    openAddCategoryDialog = false;
    selectedCategory = signal<Category | null>(null);

    constructor(
        private categoryService: CategoryService,
        private messages: MessageService
    ) {}

    ngOnInit(): void {
        this.getCategories();
    }

    getCategories() {
        this.categoryService.getCategories().subscribe({
            next: (res: any) => {
                this.categoriesList.set(res);
                this.messages.clear();
                this.messages.add({
                    severity: 'success',
                    summary: 'Categorias cargadas',
                    detail: 'Las categorias se han cargado correctamente',
                });
            },
        });
    }

    getCategoriesWithoutMessage() {
        this.categoryService.getCategories().subscribe({
            next: (res: any) => {
                this.categoriesList.set(res);
            },
        });
    }

    deleteCategory(event: Category) {
        this.categoryService.deleteCategory(event.id).subscribe({
            next: (res: any) => {
                this.getCategoriesWithoutMessage();
                this.messages.clear();
                this.messages.add({
                    severity: 'success',
                    summary: 'Categoria eliminada',
                    detail: 'La categoria se ha eliminado correctamente',
                });
            },
        });
    }

    activeChange(event: Category) {
        this.categoryService.activeCategory(event.id, event.active).subscribe({
            next: (res: any) => {
                this.getCategoriesWithoutMessage();
                this.messages.clear();
                this.messages.add({
                    severity: 'success',
                    summary: 'Categoria actualizada',
                    detail: 'La categoria se ha actualizado correctamente',
                });
            },
        });
    }

    saveCategory(event: Category) {
        if (event.id === -1) {
            this.saveNewCategory(event);
        } else {
            this.updateProduct(event);
        }
    }

    saveNewCategory(category: Category) {
        this.categoryService.saveCategory(category).subscribe({
            next: (res: any) => {
                this.getCategoriesWithoutMessage();
                this.messages.clear();
                this.messages.add({
                    severity: 'success',
                    summary: 'Categoria guardada',
                    detail: 'La categoria se ha guardado correctamente',
                });
            },
        });
    }

    updateProduct(category: Category) {
      this.categoryService.updateCategory(category).subscribe({
          next: () => {
              this.getCategoriesWithoutMessage();
              this.messages.clear();
              this.messages.add({ severity: 'success', summary: 'Actualizado', detail: 'Se ha actualizado la categoria con éxito' });
          },
          error: (err) => {
            this.messages.clear();
            this.messages.add({ severity: 'error', summary: 'Error :(', detail: 'Ha ocurrido un error inesperado. Intentelo de nuevo' });
            console.log(err);
          },
      });
  }
}
