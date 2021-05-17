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

export interface Profile{
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    username: string;
    street?: string;
    streetname?: string;
    city?: string;
    code?: string;
    pin?: string;
    can_transfer: string;
}

export interface UserCred{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    password_confirmation: string;
    ref?: string;
}

export interface UserAddress{
    street: string;
    streetname: string;
    city: string;
}