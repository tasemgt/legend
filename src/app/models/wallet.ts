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
    bundle: string;
    expiry: string;
;    duration: number;
}