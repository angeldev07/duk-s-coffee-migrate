import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    type OnInit,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Category } from '../../api';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-add-update-cateogry',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        ReactiveFormsModule,
        InputTextModule,
        InputSwitchModule,
        ButtonModule,
    ],
    template: `
        <p-dialog
            header="{{
                category ? 'Actualizar categoria' : 'Agregar nuevo categoria'
            }}"
            [modal]="true"
            [draggable]="false"
            [resizable]="false"
            [(visible)]="visible"
            (onHide)="visibleChange.emit(false)"
            [style]="{ width: '35rem' }"
        >
            <form [formGroup]="categoryForm" (ngSubmit)="submitCategory()">
                <div class="mb-3">
                    <label for="name" class="font-semibold block mb-2"
                        >Nombre</label
                    >
                    <input
                        id="name"
                        type="text"
                        formControlName="name"
                        pInputText
                        class="w-full"
                        [ngClass]="{
                            'ng-dirty ng-invalid': errorByControl('name')
                        }"
                    />
                    @if (errorByControl('name')) {
                    <span class="text-red-500 text-md block p-2"
                        >El nombre es obligatorio</span
                    >
                    }
                </div>
                <div class="mb-3">
                    <label for="active" class="font-semibold block mb-2"
                        >Activo</label
                    >
                    <p-inputSwitch formControlName="active"></p-inputSwitch>
                </div>
            </form>
            <ng-template pTemplate="footer">
                <div class="pt-3">
                    <p-button
                        icon="pi pi-check"
                        iconPos="right"
                        (onClick)="submitCategory()"
                        label="{{ category ? 'Actualizar' : 'Guardar' }}"
                        pAutoFocus
                        [autofocus]="true"
                    ></p-button>
                </div>
            </ng-template>
        </p-dialog>
    `,
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUpdateCateogryComponent implements OnInit {
    @Input() category: Category | null = null;
    @Input() visible: boolean;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() saveCategory = new EventEmitter<Category>();

    categoryForm = this.fb.group({
        name: ['', Validators.required],
        active: [true, Validators.required],
    });

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        if (this.category) {
            this.categoryForm.patchValue({
                name: this.category.name,
                active: this.category.active,
            });
        }
    }

    get name() {
        return this.categoryForm.get('name');
    }

    get active() {
        return this.categoryForm.get('active');
    }

    errorByControl(control: string) {
        return (
            this.categoryForm.get(control)?.invalid &&
            (this.categoryForm.get(control)?.touched ||
                this.categoryForm.get(control)?.dirty)
        );
    }

    public submitCategory() {
        if (this.categoryForm.invalid) {
            this.categoryForm.markAllAsTouched();
            this.categoryForm.markAsDirty();
            return;
        }

        const product: Category = {
            id: this.category?.id || -1,
            name: this.categoryForm.get('name').value,
            active: Boolean(this.categoryForm.get('active').value),
        };

        this.saveCategory.emit(product);
        this.visibleChange.emit(false);
    }
}
