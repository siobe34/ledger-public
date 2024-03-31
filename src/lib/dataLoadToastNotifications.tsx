import { MONTHS } from "@/lib/constants/months";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

type ParamProps = {
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  month: number;
  year: number;
  dataLength: number;
};

export const dataLoadToastNotifications = ({
  isError,
  isLoading,
  isSuccess,
  month,
  year,
  dataLength,
}: ParamProps) => {
  if (isError) {
    toast.error(
      "Unable to load Transactions data at this time. Please try again.",
    );
  }

  if (isLoading) {
    toast(`Loading transactions for ${MONTHS[month - 1]!.label}, ${year}.`, {
      icon: <RefreshCw className="h-4 animate-spin" />,
    });
  }

  if (isSuccess && dataLength === 0) {
    toast.info(
      `No Transactions exist for ${MONTHS[month - 1]!.label}, ${year}. Head over to the Upload page to load them in.`,
    );
  }

  if (isSuccess && dataLength > 0) {
    toast.success(
      `Transactions successfully loaded for ${MONTHS[month - 1]!.label}, ${year}.`,
    );
  }
};
