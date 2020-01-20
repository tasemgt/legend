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
    code?: string;
}

export interface UserCred{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    password_confirmation: string;
}