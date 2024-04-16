const DEFAULT_MONETARY_FORMAT: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "CAD",
};

type FormatDateProps = {
  value: number | bigint;
  opts?: Intl.NumberFormatOptions;
};

export const formatMonetaryVals = ({
  value,
  opts = DEFAULT_MONETARY_FORMAT,
}: FormatDateProps) => {
  return new Intl.NumberFormat("en-CA", opts).format(value);
};
