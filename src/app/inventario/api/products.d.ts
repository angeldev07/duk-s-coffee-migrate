export interface Category {
    id: number
    name: string
    active: boolean
}

export interface Product {
    profileImg: null | string | undefined;
    id: number;
    name:       string;
    basePrice:  number;
    amount:     number;
    active:    boolean;
    category:   Category | null;
    iva?:       number;
    stock?:     number;
}