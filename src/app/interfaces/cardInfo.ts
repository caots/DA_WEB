export interface CardInfo {
    ssl_account_number: string;
    ssl_card_number: number;
    ssl_address2: string;
    ssl_avs_address: string;
    ssl_avs_zip: string;
    ssl_card_type: string;
    ssl_city: string;
    ssl_company: string;
    ssl_country: string;
    ssl_customer_id: string;
    ssl_description: string;
    ssl_email: string;
    ssl_exp_date: string;
    ssl_first_name: string;
    ssl_last_name: string;
    ssl_phone: string;
    ssl_result: string;
    ssl_state: string;
    ssl_token: string;
    ssl_token_format: string;
    ssl_token_provider: string;
    ssl_token_response: string;
    ssl_user_id: string;
    ssl_card_short_description: string;
}

export interface CardSettings {
    featured_price?: number;
    standard_price?: number;
    created_at: Date;
    free_assessment_validation?: any;
    id: number;
    is_enable_free_assessment?: number;
    nbr_referral_for_one_validation?: number;
    standard_validation_price?: number;
    top_up: any;
    topup_validation_price?: number;
    type: number;
    updated_at: Date;
    urgent_hiring_price: number;
    private_job_price: number;
    free_direct_message: number;
    standard_direct_message_price: number;
    topup_credit: any;
}
