
export enum Category {
  Groceries = "Groceries",
  DiningOut = "Dining Out",
  Transport = "Transport",
  Shopping = "Shopping",
  Entertainment = "Entertainment",
  Utilities = "Utilities",
  Health = "Health",
  Travel = "Travel",
  Education = "Education",
  Other = "Other"
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
  currency: string;
}
