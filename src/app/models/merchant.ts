export interface Merchant{
  id: number;
  name: string;
  su_username: string;
  image: string;
  status: string;
  created_at: string;
  updated_at: string;
}


export interface MerchantWrapper{
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
  data: Merchant[];
}