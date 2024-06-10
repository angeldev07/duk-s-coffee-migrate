import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
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
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { getProductByParamsQuery } from './helpers';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

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
        DropdownModule,
        FormsModule
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
                    <div class="field col md:col-6 flex flex-column">
                        <p class="text-md mb-0">Accion por lote</p>
                        <p-dropdown
                            [options]="[{ name: 'Eliminar' }, {name: 'Deshabilitar'}, {name: 'Activar'}]"
                            optionLabel="name"
                            placeholder="Accion por lote"
                            [styleClass]="'w-full'"
                            (onChange)="takeBatchActions()"
                            [(ngModel)]="selectedBathOption"
                        />
                    </div>
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
                            (selectionCategoriesRowEvent)=" selectedCategories = $event"
                        />
                    </p-tabPanel>
                </p-tabView>
            </section>
            @if (openAddCategoryDialog) {
            <app-add-update-cateogry
                [(visible)]="openAddCategoryDialog"
                (visibleChange)="returnToProducts()"
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

    selectedCategories: number[]

    activedRouterService = inject(ActivatedRoute)
    router = inject(Router)
    activedRouterSus$ = new Subscription()

    params: any

    selectedBathOption: any

    constructor(
        private categoryService: CategoryService,
        private messages: MessageService
    ) {}

    ngOnInit(): void {
        // validamos si se ha pasado un parametro por la url
        this.openAddCategoryQueryParams();
        this.getCategories();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.activedRouterSus$.unsubscribe()
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

                if (this.params['add']) {
                    this.returnToProducts()
                }
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

  openAddCategoryQueryParams(){
    this.activedRouterSus$ = this.activedRouterService.queryParams.subscribe({
        next: (params) => {
            // si llega add, abrimos el dialogo
            this.params = params

            if(this.params['add']){
                this.openAddCategoryDialog = true
            }
        }
    })
  }

  returnToProducts() {
    // si no hay parametros, no hacemos nada
    if(Object.keys(this.params).length === 0){
        return
    }  
    const product = getProductByParamsQuery(this.params)    
    
    this.router.navigate([this.params['redirectTo']], {queryParams: { 
        newProduct: this.params['newProduct'] ? this.params['newProduct'] : null,
        ...product
      } })
  }

  takeBatchActions(){ 
    
    if(!this.selectedCategories || this.selectedCategories.length === 0){
        this.messages.clear();
        this.messages.add({ severity: 'error', summary: 'Error :(', detail: 'No se ha seleccionado ninguna categoria' });
        return
    }

    if(this.selectedBathOption.name === 'Activar'){
        this.categoryService.activeDeactivateByList(this.selectedCategories, 'on').subscribe({
            next: () => {
                this.messages.clear();
                this.messages.add({ severity: 'success', summary: 'Activadas', detail: 'Se han activado las categorias seleccionadas' });
                this.getCategoriesWithoutMessage();
            },
            error: (err) => {
                this.messages.clear();
                this.messages.add({ severity: 'error', summary: 'Error :(', detail: 'Ha ocurrido un error inesperado. Intentelo de nuevo' });
                console.log(err);
            }
        })
    }

    if(this.selectedBathOption.name === 'Deshabilitar'){
        this.categoryService.activeDeactivateByList(this.selectedCategories, 'off').subscribe({
            next: () => {
                this.messages.clear();
                this.messages.add({ severity: 'success', summary: 'Deshabilitadas', detail: 'Se han deshabilitado las categorias seleccionadas' });
                this.getCategoriesWithoutMessage();
            },
            error: (err) => {
                this.messages.clear();
                this.messages.add({ severity: 'error', summary: 'Error :(', detail: 'Ha ocurrido un error inesperado. Intentelo de nuevo' });
                console.log(err);
            }
        })
    }

    if(this.selectedBathOption.name === 'Eliminar'){
        this.categoryService.deleteCategoriesByList(this.selectedCategories).subscribe({
            next: () => {
                this.messages.clear();
                this.messages.add({ severity: 'success', summary: 'Eliminadas', detail: 'Se han eliminado las categorias seleccionadas' });
                this.getCategoriesWithoutMessage();
            },
            error: (err) => {
                this.messages.clear();
                this.messages.add({ severity: 'error', summary: 'Error :(', detail: 'Ha ocurrido un error inesperado. Intentelo de nuevo' });
                console.log(err);
            }
        })
    }

    this.selectedCategories = []

  }
}
