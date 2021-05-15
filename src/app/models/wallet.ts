export interface Wallet {
}

export interface FundWalletObject{
    ref: string;
    amount: number;
    phone: string;
    pin: string;
}

export class Balance{
    autorenew: string;
    period: string;
    points: number;
    autorenew_rate: string;
    code: number;
    renew: string;
    balance: string;
    prod_balance: string;
    raw_prod_balance: string;
    price: number;
    bundle: string;
    bundle_id: number;
    expiry: string;
    expiry_days: number;
    condition: string;
    checkout_mode: string;
    duration?: number;
    can_transfer?: string;
    bvn_verified?: string;
    pin?: string;

    public resetBalance(): void{
        this.balance = ''; this.prod_balance = ''; this.bundle = '';
    }
}