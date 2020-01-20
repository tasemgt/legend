export interface Bundle{
    products_id: number;
    products_name: string;
    bundle_id: number;
    checkout_mode: number;
    cycle_num: number;
    checkout_cycle: string;
    checkout_amount: number;
    condition: string;
    checkoutDateByFirst: string;
    mgr_name: string;   
    renew?: string;
    data?: Bundle[];
}

// name: string; 
// amount: string; 
// description: { 
//     duration: string; 
//     package: string;
// };