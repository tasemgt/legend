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