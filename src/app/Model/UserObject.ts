export interface Dealer {
    id: string;
    name: string;
    account_number: string;
    dis_cat: string;
    dis_cat_desc: string;
    financial_yr_to_date_sales: string;
    financial_last_yr_sales: string;
}

export interface OrderProductList {
  sku: string;
  model: string;
  desc: string;
  history: string;
  group: string;
  main_cat?: string;
  s1: string;
  s2: string;
  s3: string;
  pna: string;
  d1: string;
  d2: string;
  d3: string;
  msrp: string;
  cost: string;
  ayp: string;
  ext: number;
  color_code: string;  
}

export interface Templates {
    id: number,
    created: string,
    updated: string,
    submitted: string,
    s1_ship: string,
    s2_ship: string,
    s3_ship: string,
    pa_ship: string,
    project_code: string,
    total: string,
    name: string
  }

  export interface TabsResult {
    id: string;
    name: string;
    subtabs: []
  }
  
  export interface TabsResponse {
    results: TabsResult[];
    count: number;
  }

  export interface ApiResponse {
    results: { id: string, name: string }[];
    count: number;
  }
  
  export interface Category {
    id: number,
    name: string
  }

  export interface PartProducts{
    blank?: 'manually' | 'ordered' | '-';
    sku: number,
    description: string,
    price: string,
    y2023: string,
    y2024: string,
    r12: string,
    order: string
  }

  export interface AddNewItem {
    blank: string,
    sku: string,
    description: string,
    price: string
  }

  export interface SaveOrderResponse {
    OrderID: string;
    // Add other properties if necessary
  }