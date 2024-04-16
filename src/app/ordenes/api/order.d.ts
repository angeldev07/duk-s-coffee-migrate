export interface Orders {
    id: number;
    reference: string;
    customer: string;
    total: number;
    state: string;
    dateOrder: Date;
}
