export interface CustomerItem {
  name: string;
  logoUrl: string;
}

export interface CustomersData {
  title: string;
  subTitle?: string;
  customers: CustomerItem[];
}