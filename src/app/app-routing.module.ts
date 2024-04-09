import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { authGuard } from './demo/components/auth/guard/auth.guard';
import { CustomerComponent } from './clientes/pages/customer/customer.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'backoffice', component: AppLayoutComponent,
                children: [
                    {
                        path: 'inventario',
                        loadChildren: () => import('./inventario/inventary.routes').then(m => m.INVENTORY_ROUTES)
                    },
                    {
                        path: 'clientes',
                        // component: CustomerComponent
                        loadChildren: () => import('./clientes/customer.routes').then(m => m.CUSTOMER_ROUTES)
                    }
                ],
                canActivate: [authGuard]
            },
            { path: '', loadChildren: () => import('./demo/components/auth/auth.routes').then(a => a.AUTH_ROUTES) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
