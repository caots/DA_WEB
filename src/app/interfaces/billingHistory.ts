export interface BillingHistory {
    createdAt: Date;
    description: string;
    id: number;
    paymentType: number;
    products: any;
    sslCardNumber: string;
    sslCardType: string;
    sslExpDate: string;
    status: number;
    totalAmount: number;
    updatedAt: Date;
    serviceType: string;
    userId: number;
    tax: number;
    discount_value: number;
    sub_total: number;
    invoice_receipt_url: string;
    isChecked: boolean;
}