export interface User {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    token: string;
    token_type: string;
    expiry: string;
    message: string;
}

export interface UserCred{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    pin: string;
    bvn: string;
    password: string;
    password_confirmation: string;
}