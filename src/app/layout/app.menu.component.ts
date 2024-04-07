import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AppMenuitemComponent } from './app.menuitem.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    standalone: true,
    imports: [NgFor, NgIf, AppMenuitemComponent]
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Inventario',
                items: [
                    { 
                        label: 'Inventario', 
                        icon: 'pi pi-shopping-bag', 
                        items: [
                            { label: 'Productos', icon: 'pi pi-fw pi-briefcase', routerLink: ['/backoffice/inventario/productos'] },
                            { label: 'Categorias', icon: 'pi pi-fw pi-inbox', routerLink: ['/backoffice/inventario/categorias'] },
                            { label: 'Revisión', icon: 'pi pi-fw pi-eye', routerLink: ['/backoffice/inventario/revision'] },
                            // { label: 'Stock', icon: 'pi pi-fw pi-home', routerLink: ['/backoffice/inventario/productos'] },
                        ]
                    },
                    
                ]
            },
            {
                label: 'Clientes',
                items: [
                    { 
                        label: 'clientes', 
                        icon: 'pi pi-fw pi-home', 
                        routerLink: ['/clientes'],
                    },
                    
                ]
            },
            {
                label: 'Ordenes',
                items: [
                    { 
                        label: 'ordenes', 
                        icon: 'pi pi-fw pi-home', 
                        routerLink: ['/ordenes'],
                    },
                    
                ]
            },
        ];
    }
}
