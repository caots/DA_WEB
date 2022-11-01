export interface Coupon {
    code: string;
    created_at: Date;
    discount_acc_type: number;
    discount_for: number;
    discount_type: number;
    discount_value: number;
    expired_from: Date;
    expired_to: Date;
    expired_type: number;
    id: number;
    is_for_all_user: number;
    is_nbr_user_limit: number;
    max_discount_value: number;
    nbr_used: number;
    remaining_number: number;
    status: number;
    updated_at: Date;
}

export interface SendDataPayment {
    carts: any[];
    coupon: any;
    discountValue: number;
    subTotal: number
    paymentType: number;
}

export interface SendDataUpgrade {
    jobs: {
        id: number;
        expired_days: number,
        is_make_featured: number,
        featured_start_date: any,
        featured_end_date: any,
        add_urgent_hiring_badge: number
    },
    coupon: any;
    discountValue: number;
    subTotal: number;
    paymentType: number;
}