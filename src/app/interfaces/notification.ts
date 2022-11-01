export interface Notification {
    created_at: Date;
    id: number;
    is_read: number;
    is_sent_mail: number;
    metadata: any;
    sent_mail_status: number;
    type: number;
    updated_at: Date;
    user_acc_type: number;
    user_id: number;
}