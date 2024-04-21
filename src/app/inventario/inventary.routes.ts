import { Routes } from "@angular/router";
import { ProductsComponent } from "./pages/products/products.component";
import { CategoriesComponent } from "./pages/categories/categories.component";
import { RevisionComponent } from "./pages/revision/revision.component";

export const INVENTORY_ROUTES: Routes = [
    {
        path: 'productos',
        component: ProductsComponent
    },
    {
        path: 'categorias',
        component: CategoriesComponent
    },
    {
        path: 'revision',
        component: RevisionComponent
    },
    {
        path: '**',
        redirectTo: 'productos'
    }

]
