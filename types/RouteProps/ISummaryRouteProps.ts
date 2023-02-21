import { NotificationType } from "../INotifications";
import { AnnualBalanceSummaryType, AnnualCategoricalSummaryType, MonthlyBalanceSummaryType, MonthlyCategoricalSummaryType } from "../Database";

export interface IMonthlySummaryProps {
    data?: {
        monthlyCategoricalSummary: MonthlyCategoricalSummaryType[];
        monthlyCategoricalSummaryByUser: Required<MonthlyCategoricalSummaryType>[];
        monthlyAccountBalanceSummary: MonthlyBalanceSummaryType[];
    };
    notifications?: NotificationType[];
}

export interface IAnnualSummaryProps {
    data?: { annualBalanceSummary: AnnualBalanceSummaryType[]; annualCategoricalSummary: AnnualCategoricalSummaryType[] };
    notifications?: NotificationType[];
}
