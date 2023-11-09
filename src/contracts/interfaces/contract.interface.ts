interface ContractPayment {
  orderPayment: number;
  expiredDate: Date;
}

export interface Contract {
  id: number;
  customer: string;
  email?: string;
  phone?: string;
  startContractDate: Date;
  endContractDate: Date;
  assuranceCompany: string;
  contract: string;
  payment: ContractPayment[];
}
