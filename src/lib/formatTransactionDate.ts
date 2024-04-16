const DEFAULT_DATETIME_FORMAT: Intl.DateTimeFormatOptions = {
  dateStyle: "full",
};

type FormatDateProps = {
  date: Date;
  opts?: Intl.DateTimeFormatOptions;
};

export const formatTransactionDate = ({
  date,
  opts = DEFAULT_DATETIME_FORMAT,
}: FormatDateProps) => {
  return new Intl.DateTimeFormat("en-CA", opts).format(date);
};
