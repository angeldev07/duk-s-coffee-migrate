import { Params } from "@angular/router";
import { Product } from "src/app/inventario/api";

export const getProductByParamsQuery = (params: Params) => {
    const productsProps: Array<keyof Product> = [
        'id', 'name', 'basePrice', 'amount', 'active', 'category', 'iva', 'stock'
    ]
    // se filtran las propiedades que no son de productos
    const productParams = Object.keys(params).filter((key) => productsProps.includes(key as keyof Product));
    const product: Product = {} as Product   
    // se crea un objeto con las propiedades que son de productos
    productParams.forEach((key) => {
        if(key === 'id')
            product[key] = Number(params[key])
        product[key] = params[key]
    })
    return  product
}