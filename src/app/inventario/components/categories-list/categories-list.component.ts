import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, type OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Category } from '../../api';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-categories-list',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        MessagesModule,
        ButtonModule,
        InputSwitchModule,
        FormsModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        TooltipModule
    ],
    template: `
      @if (categories.length > 0) {
        <p-table
            [value]="categories"
            [tableStyle]="{ 'min-width': '50rem' }"
            styleClass="p-datatable-striped"
            [paginator]="true"
            [rows]="5"
            [selectionPageOnly]="true"
            [(selection)]="selectedCategories"
            (onRowSelect)="emitRowSelection()"
            (onHeaderCheckboxToggle)="emitRowSelection()"
            [rowsPerPageOptions]="[5, 10, 20]"
            [globalFilterFields]="['name']"
            #dt2
      >
      <ng-template pTemplate="caption">
            <div class="flex">
                <p-iconField iconPosition="left" class="ml-auto">
                    <input 
                        pInputText 
                        type="text" 
                        (input)="dt2.filterGlobal($event.target.value, 'contains')" 
                        placeholder="Buscar por nombre..."
                        pTooltip="Buscar por nombre" tooltipPosition="top" 
                        />
                </p-iconField>
            </div>
        </ng-template>
      <ng-template pTemplate="header">
                <tr>
                    <th style="width: 3rem">
                      <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
                    </th>
                    <th pSortableColumn="id">ID <p-sortIcon field="id" /></th>
                    <th pSortableColumn="name">Producto <p-sortIcon field="name" /></th>
                    <th pSortableColumn="active">Activo <p-sortIcon field="active" /></th>
                    <th >Acciones</th>
                </tr>
        </ng-template>
        <ng-template pTemplate="body" let-category>
                @if (categories.length > 0) {
                <tr>
                    <th>
                      <p-tableCheckbox [value]="category"></p-tableCheckbox>
                    </th>
                    <td>{{ category.id }}</td>
                    <td>{{ category.name }}</td>
                    <td>
                      <p-inputSwitch [(ngModel)]="category.active" (onChange)="activeChange.emit(category)"></p-inputSwitch>
                    </td>
                    <td>
                        <button
                            pButton
                            icon="pi pi-pencil"
                            class="p-button-rounded p-button-success"
                            (click)="updateCategory.emit(category)"
                        ></button>
                        <button
                            pButton
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-danger"
                            (click)="deleteCategory.emit(category)"
                        ></button>
                    </td>
                </tr>
                }
            </ng-template>

      </p-table>
      } @else {
        <p-messages [value]="messages" [enableService]="false" [closable]="false"></p-messages>
      }

    `,
    styles: `
      td, th, tr {
        text-align: center !important;
      }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesListComponent implements OnInit {

  @Input() categories: Category[] = [];
  @Output() deleteCategory = new EventEmitter<Category>();
  @Output() updateCategory = new EventEmitter<Category>();
  @Output() activeChange = new EventEmitter<Category>();

  selectedCategories: any
  @Output() selectionCategoriesRowEvent = new EventEmitter<number[]>();
  

  messages: Message[] | undefined = [{ severity: 'info', summary: 'Lista vacia', detail: 'No hay categorias por mostrar' }];;

    ngOnInit(): void { }

    emitRowSelection(){
      this.selectionCategoriesRowEvent.emit(this.selectedCategories.map(category => category.id))
    }
}
