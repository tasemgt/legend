import { Transaction } from "./transaction"

export const Constants = {
    baseUrl:  'https://legendpay.ng/api/v2',
    merchantImageBaseUrl: "http://merchant.legend.ng/storage/merchant-image/",
    flutterwavePublicKey: 'FLWPUBK-f4ae78bd6a1439f2adc7dea888036aac-X',//'FLWPUBK_TEST-2ce49153bfb447b6f65c6e39949ce6b9-X',
    authUser: 'authUser',
    oneSignalAppID: 'a34ce124-7e9a-4f6a-947c-0768ff828796',
    googleProjectNumberSenderID: '914926673400'
}

export const BundleImage = {
    TriplePlay : "assets/imgs/triple-play-icons.png",
    DualPlay : "assets/imgs/dual-play-icons.png"
}

export const Plans = [
    {value: 1, name: 'Monthly', verb: 'a'},
    {value: 3, name: 'Quarterly', verb: 'a'},
    {value: 12, name: 'Annually', verb: 'an'}
]

export const TransactionReceiptTypes = {
    Electricity: {
        img: '',
        fields: (transaction: Transaction) => `<div class="detail">
                    <span>Username:</span>
                    <span>${transaction.username}</span>
                </div>
                <div class="detail">
                    <span>Customer name:</span>
                    <span>${transaction.name}</span>
                </div>
                <div class="detail">
                    <span>Customer Phone:</span>
                    <span>${transaction.phone}</span>
                </div>
                <div class="detail">
                    <span>Token:</span>
                    <span>${transaction.product}</span>
                </div>
                <div class="detail">
                    <span>Meter Number:</span>
                    <span>${transaction.airtime_num}</span>
                </div>
                <div class="detail">
                    <span>Meter Name:</span>
                    <span>${transaction.extra_one || '---'}</span>
                </div>
                <div class="detail">
                    <span>Meter Address:</span>
                    <span>${transaction.extra_two || '---'}</span>
                </div>
                <div class="detail">
                    <span>Number of Units:</span>
                    <span>${transaction.extra_three || '---'}</span>
                </div>
                <div class="detail">
                    <span>Amount:</span>
                    <span>${transaction.amount}</span>
                </div>
                `
    },
    Airtime: {
        img: '',
        fields: (transaction: Transaction) => `<div class="detail">
                    <span>Username:</span>
                    <span>${transaction.username}</span>
                </div>
                <div class="detail">
                    <span>Service Name:</span>
                    <span>Airtime Purchase</span>
                </div>
                <div class="detail">
                    <span>Network Provider:</span>
                    <span>${transaction.product}</span>
                </div>
                <div class="detail">
                    <span>Amount:</span>
                    <del>N</del><span>${transaction.amount}</span>
                </div>
                <div class="detail">
                    <span>Transaction Status:</span>
                    <span>${transaction.status}</span>
                </div>
                `
    },
    Transfer: {
        img: '',
        fields: (transaction: Transaction) => {
            if(transaction.product === 'Bank Transfer'){
                return `
                <div class="detail">
                    <span>Username:</span>
                    <span>${transaction.username}</span>
                </div>
                <div class="detail">
                    <span>Recipient Bank Name:</span>
                    <span>${transaction.extra_one || '---'}</span>
                </div>
                <div class="detail">
                    <span>Recipient Account Name:</span>
                    <span>${transaction.extra_two || '---'}</span>
                </div>
                <div class="detail">
                    <span>Recipient Account Number:</span>
                    <span>${transaction.airtime_num || '---'}</span>
                </div>
                <div class="detail">
                    <span>Sender Name:</span>
                    <span>${transaction.name}</span>
                </div>
                <div class="detail">
                    <span>Amount Transferred:</span>
                    <span>${transaction.amount}</span>
                </div>
                <div class="detail">
                    <span>Transaction Status:</span>
                    <span>${transaction.status}</span>
                </div>
                `;
            }
            return `
                <div class="detail">
                    <span>Username:</span>
                    <span>${transaction.username}</span>
                </div>
                <div class="detail">
                    <span>Description:</span>
                    <span>${transaction.product}</span>
                </div>
                <div class="detail">
                    <span>Amount Transferred:</span>
                    <span>${transaction.amount}</span>
                </div>
                <div class="detail">
                    <span>Transaction Status:</span>
                    <span>${transaction.status}</span>
                </div>
                `;
        }
        ,
    },
    Recharge: {
        img: '',
        fields: (transaction: Transaction) => `<div class="detail">
                    <span>Username:</span>
                    <span>${transaction.username}</span>
                </div>
                <div class="detail">
                    <span>Customer Name:</span>
                    <span>${transaction.name}</span>
                </div>
                <div class="detail">
                    <span>Wallet Recharge Amount:</span>
                    <span>${transaction.amount}</span>
                </div>
                <div class="detail">
                    <span>Account Name:</span>
                    <span>${transaction.name}</span>
                </div>
                <div class="detail">
                    <span>Transaction Status:</span>
                    <span>${transaction.status}</span>
                </div>
                `
    },
    DSTV:{
        img: '',
        fields: (transaction: Transaction) => `<div class="detail">
                    <span>Username:</span>
                    <span>${transaction.username}</span>
                </div>
                <div class="detail">
                    <span>Full name:</span>
                    <span>${transaction.name}</span>
                </div>
                <div class="detail">
                    <span>Service Name:</span>
                    <span>DSTV</span>
                </div>
                <div class="detail">
                    <span>Description:</span>
                    <span>${transaction.product}</span>
                </div>
                <div class="detail">
                    <span>Amount:</span>
                    <span>${transaction.amount}</span>
                </div>
                <div class="detail">
                    <span>Account Name:</span>
                    <span>${transaction.name}</span>
                </div>
                <div class="detail">
                    <span>Transaction Status:</span>
                    <span>${transaction.status}</span>
                </div>
                `
    },

    GenericTemplate: (transaction: Transaction) => `
        <div class="detail">
            <span>Username:</span>
            <span>${transaction.username}</span>
        </div>
        <div class="detail">
            <span>Full name:</span>
            <span>${transaction.name}</span>
        </div>
        <div class="detail">
            <span>Service Name:</span>
            <span>${transaction.type}</span>
        </div>
        <div class="detail">
            <span>Description:</span>
            <span>${transaction.product}</span>
        </div>
        <div class="detail">
            <span>Amount:</span>
            <span>${transaction.amount}</span>
        </div>
        <div class="detail">
            <span>Transaction Status:</span>
            <span>${transaction.status}</span>
        </div>
    `
}