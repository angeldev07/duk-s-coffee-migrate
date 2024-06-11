import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    inject,
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
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';

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
        InputNumberModule,
        TooltipModule
    ],
    template: `
        <p-dialog
            header="{{
                product && product.id != -1 ? 'Actualizar producto' : 'Agregar nuevo producto'
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
                class="formgrid grid"
            >
                <div class="mb-3 field col-12 grid p-fluid">
                    <div class="mb-3 col">
                        <label for="name" class="font-semibold block mb-2"
                            >Nombre</label
                        >
                        <input
                            id="name"
                            type="text"
                            formControlName="name"
                            pInputText
                            class="w-full"
                            [ngClass]="{'ng-invalid ng-dirty': validateInput('name')}"
                            pTooltip="Nombre del producto"
                            tooltipPosition="top"
                        />
                        @if (validateInput('name')) {
                        <span class="text-red-500 text-md block p-2"
                            >El nombre es obligatorio</span
                        >
                        }
                    </div>

                    <div class="mb-3 col">
                        <label for="name" class="font-semibold block mb-2"
                            >Stock</label
                        >
                        <input
                            id="stock"
                            type="text"
                            formControlName="stock"
                            pInputText
                            class="w-full"
                            [ngClass]="{'ng-invalid ng-dirty': validateInput('stock')}"
                            pTooltip="Cantidad de productos en stock"
                            tooltipPosition="top"
                        />
                        @if (validateInput('stock')) {
                        <span class="text-red-500 text-md block p-2"
                            >El stock es obligatorio y minimo 1 unidad.</span
                        >
                        }
                    </div>
                </div>

                <div class="mb-3 field col p-fluid">
                    <label for="basePrice" class="font-semibold block mb-2"
                        >Precio base (en COP)</label
                    >
                    <p-inputNumber
                        formControlName="basePrice"
                        inputId="basePrice"
                        mode="currency"
                        currency="COP"
                        locale="es-CO"
                        pTooltip="Precio sin IVA en pesos colombianos"
                        tooltipPosition="top"
                        [ngClass]="{'ng-invalid ng-dirty': validateInput('basePrice')}"
                         />
                    @if (validateInput('basePrice')) {
                    <span class="text-red-500 text-md block p-2"
                        >El precio base es obligatorio</span
                    >
                    }
                </div>
                <div class="mb-3 field col p-fluid">
                    <label for="iva" class="font-semibold block mb-2"
                        >IVA</label
                    >
                    <p-inputNumber
                        formControlName="iva"
                        inputId="iva"
                        prefix="%"
                        [min]="0"
                        [max]="19"
                        pTooltip="Porcentaje de IVA del producto"
                        tooltipPosition="top"
                        [ngClass]="{'ng-invalid ng-dirty': validateInput('iva')}"
                        />
                    @if (validateInput('iva')) {
                    <span class="text-red-500 text-md block p-2"
                        >Valor incorrecto.</span
                    >
                    }
                </div>

                <div class="mb-3 field col-12">
                    <label for="active" class="font-semibold block mb-2"
                        >Categoria</label
                    >
                    <div class="flex p-fluid gap-2">
                        <div class="p-fluid flex-1">
                            <p-dropdown
                                formControlName="category"
                                [options]="categories"
                                optionLabel="name"
                                placeholder="Seleccione la categoria"
                                [styleClass]="'w-full flex-1'"
                                pTooltip="Categoria del producto"
                                tooltipPosition="top"
                                [ngClass]="{'ng-invalid ng-dirty': validateInput('category')}"
                            ></p-dropdown>
                        </div>
                        <p-button
                            label="Agregar"
                            icon="pi pi-plus" iconPos="right"
                            tooltipPosition="top" pTooltip="Agregar nueva categoria"
                            (onClick)="onAddNewCategory()" />
                    </div>
                    @if (validateInput('category')) {
                    <span class="text-red-500 text-md block p-2"
                        >La categoria es obligatoria</span
                    >
                    }
                </div>

                <div class="mb-3 field col-12">
                    <label for="img" class="font-semibold block mb-2"
                        >Seleccionar imagen</label
                    >
                    <div class="p-4 border-dashed border-gray border-round flex justify-content-center"
                         pTooltip="Imagen del producto (.jpg, .png, .wepg, .jpeg)" tooltipPosition="top"
                         [ngClass]="{'border-green-300': !imgError && imgTouch && img}">
                        <input
                            type="file"
                            accept="image/*"
                            (input)="getImg($event)"
                        />

                    </div>
                    @if (imgError) {
                    <span class="text-red-500 text-md block p-2"
                        >La imagen es obligatoria</span
                    >
                    }
                </div>

                <div class="mb-3 field col-12">
                    <label for="active" class="font-semibold block mb-2"
                    pTooltip="Indica si el producto esta activo para vender" tooltipPosition="top">Activo</label
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
                        label="{{  product && product.id != -1  ? 'Actualizar' : 'Guardar' }}"
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
        basePrice: [0, [Validators.required, Validators.min(200)]],
        active: [true, [Validators.required]],
        category: [{} as Category, [Validators.required]],
        iva: [0, [Validators.required, Validators.min(0), Validators.max(19)]],
        stock: [1, [Validators.required, Validators.min(1)]],
    });
    img: string | null = null;
    imgError = false;
    imgTouch = false;

    router = inject(Router)

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        if(!!this.product) {
            this.productForm.patchValue({
                name: this.product.name,
                basePrice: this.product.basePrice,
                active: this.product.active,
                category: this.product.category ? this.product.category : {} as Category,
                iva: this.product.iva || 0,
                stock: this.product.stock || 1,
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
            iva: Number(this.productForm.get('iva').value),
            stock: Number(this.productForm.get('stock').value),
        };

        this.saveProduct.emit(product);
        this.visibleChange.emit(false)
    }

    getImg($event: any) {
        const file = $event.target.files[0];
        this.imgTouch = true;

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

    onAddNewCategory(){
        const product: Product = {
            id: Number(this.product?.id) || -1,
            name: this.productForm.get('name').value,
            basePrice: Number(this.productForm.get('basePrice').value),
            amount: 0,
            active: Boolean(this.productForm.get('active').value),
            category: JSON.parse(
                JSON.stringify(this.productForm.get('category').value)
            ) as Category,
            profileImg: this.img || null,
            iva: Number(this.productForm.get('iva').value),
            stock: Number(this.productForm.get('stock').value),
        };

        this.router.navigate(['/backoffice/inventario/categorias'],
        {
            queryParams: {
                    add: true,
                    newProduct: this.product ? false : true,
                    redirectTo: this.router.url,
                    ...product,
                },
        })
    }
}
