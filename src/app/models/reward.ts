import { Bundle } from './bundle';
import { Merchant, MerchantProduct } from './merchant';

export interface Reward {
  username: string;
  point: number;
  referal: string;
  rewards: [
        {
            id: number;
            created_at: string;
            updated_at: string;
            user_id: number;
            username: string;
            ref: string;
            points_before: string;
            points_after: number;
        }
      ];
}

export interface Redeem{
  id: number;
  name: string;
  desc: string;
  type: string;
  type_cat: string;
  charge_type: string;
  pid: string;
  point: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface RedeemSub{
  redeem: Redeem;
  subscription: Bundle[];
}

export interface RedeemMerchant{
  redeem: Redeem;
  merchant: Merchant;
  product: MerchantProduct;
}