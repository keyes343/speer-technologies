export type UserPayloadToServer = {
  userId: string;
  company_name: string;
  action: 'buy' | 'sell';
  quantity: number;
};
