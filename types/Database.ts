import { Document, WithId } from "mongodb";

type AccountType = "Credit" | "Debit";
type AverageType = number;
type BalanceType = number;
type CreditType = number;
type CategoryType = string;
type DebitType = number;
type MonthType = number;
type SavingsType = number;
type SumType = number;
type UserType = string;

export type ManageCollectionType = WithId<Document> & {
    email: string;
    payload: {
        users: UserType[];
        categories: CategoryType[];
    };
};

export type TransactionsCollectionType = WithId<Document> & {
    email: string;
    date: Date;
    description: string;
    credit: number;
    debit: number;
    balance: number;
    category: string;
    user: string;
    account: string;
    comments: string;
};

export type MonthlyBalanceSummaryType = {
    credit: CreditType;
    debit: DebitType;
    savings: SavingsType;
    user: UserType;
    account: AccountType;
    balance: BalanceType;
};

export type MonthlyCategoricalSummaryType = {
    sum: SumType;
    category: CategoryType;
    user?: UserType;
};

export type AnnualBalanceSummaryType = {
    user: UserType;
    account: AccountType;
    month: MonthType;
    balance: BalanceType;
};
export type AnnualCategoricalSummaryType = {
    category: CategoryType;
    sum: SumType;
    average: AverageType;
};
