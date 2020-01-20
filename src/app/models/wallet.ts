export interface Wallet {
}

export interface FundWalletObject{
    ref: string;
    amount: number;
    phone: string;
    pin: string;
}

export class Balance{
    code: number;
    balance: string;
    prod_balance: string;
    bundle: string;
    bundle_id: number;
    expiry: string;
    expiry_days: number;
    condition: string;
    checkout_mode: string;
    duration?: number;
}