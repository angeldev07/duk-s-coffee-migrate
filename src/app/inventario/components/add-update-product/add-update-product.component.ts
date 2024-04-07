import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    type OnInit,
} from '@angular/core';
import { Category, Product } from '../../api';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumber } from 'primeng/inputnumber';

@Component({
    selector: 'app-add-update-product',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        InputTextModule,
        ReactiveFormsModule,
        FileUploadModule,
        InputSwitchModule,
        DropdownModule,
    ],
    template: `
        <p-dialog
            header="{{
                product ? 'Actualizar producto' : 'Agregar nuevo producto'
            }}"
            [modal]="true"
            [draggable]="false"
            [resizable]="false"
            [(visible)]="visible"
            (onHide)="visibleChange.emit(false)"
            [style]="{ width: '50rem' }"
            [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }"
        >
            <form
                [formGroup]="productForm"
                class="pt-4 "
                (ngSubmit)="submitProduct()"
            >
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
                    />
                    @if (validateInput('name')) {
                    <span class="text-red-500 text-md block p-2"
                        >El nombre es obligatorio</span
                    >
                    }
                </div>

                <div class="mb-3">
                    <label for="basePrice" class="font-semibold block mb-2"
                        >Precio base</label
                    >
                    <input
                        id="basePrice"
                        type="number"
                        formControlName="basePrice"
                        pInputText
                        class="w-full"
                    />
                    @if (validateInput('basePrice')) {
                    <span class="text-red-500 text-md block p-2"
                        >El precio base es obligatorio y mayor a $2500</span
                    >
                    }
                </div>

                <div class="mb-3">
                    <label for="active" class="font-semibold block mb-2"
                        >Categoria</label
                    >
                    <p-dropdown
                        formControlName="category"
                        [options]="categories"
                        optionLabel="name"
                        placeholder="Seleccione la categoria"
                        [styleClass]="'w-full'"
                    ></p-dropdown>
                    @if (validateInput('category')) {
                    <span class="text-red-500 text-md block p-2"
                        >La categoria es obligatoria</span
                    >
                    }
                </div>

                <div class="mb-3">
                    <label for="img" class="font-semibold block mb-2"
                        >Seleccionar imagen</label
                    >
                    <input
                        type="file"
                        accept="image/*"
                        (input)="getImg($event)"
                    />
                    @if (imgError) {
                    <span class="text-red-500 text-md block p-2"
                        >La imagen es obligatoria</span
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
                        (onClick)="submitProduct()"
                        label="{{ product ? 'Actualizar' : 'Guardar' }}"
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
export class AddUpdateProductComponent implements OnInit {
    // If comes a product, it will be updated, if not, it will be created
    @Input() product: Product | null = null;
    @Input() visible: boolean;
    @Input() categories: Category[] = [];
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() saveProduct = new EventEmitter<Product>();

    productForm = this.fb.group({
        name: ['', [Validators.required]],
        basePrice: [0, [Validators.required, Validators.min(2500)]],
        active: [true, [Validators.required]],
        category: ['', [Validators.required]],
    });
    img: string | null = null;
    imgError = false;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        if(!!this.product) {
            this.productForm.patchValue({
                name: this.product.name,
                basePrice: this.product.basePrice,
                active: this.product.active,
                category: this.product.category ? this.product.category.name : '',
            });
            this.img = this.product.profileImg;
        }
    }

    public validateInput(input: string) {
        return (
            this.productForm.get(input).invalid &&
            this.productForm.get(input).touched
        );
    }
    public submitProduct() {
        if (this.productForm.invalid) {
            this.productForm.markAllAsTouched();
            this.productForm.markAsDirty();
            if (!this.img) {
                this.imgError = true;
            }
            return;
        }

        if (!this.img) {
            this.imgError = true;
            return;
        }

        const product: Product = {
            id: this.product?.id || -1,
            name: this.productForm.get('name').value,
            basePrice: Number(this.productForm.get('basePrice').value),
            amount: 0,
            active: Boolean(this.productForm.get('active').value),
            category: JSON.parse(
                JSON.stringify(this.productForm.get('category').value)
            ) as Category,
            profileImg: this.img || null,
        };

        this.saveProduct.emit(product);
        this.visibleChange.emit(false)
    }
    getImg($event: any) {
        const file = $event.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                this.img = base64String;
            };

            reader.readAsDataURL(file);
            this.imgError = false;
        }
    }
}
