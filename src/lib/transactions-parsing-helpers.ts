type Json = Record<string, string>;
type ReqdCols = string[];
type DataCols = string[];
type ColOrder = Record<string, number>;

export const getTransactionsCsvHeaders = ({
  colOrder,
  requiredCols,
}: {
  colOrder: ColOrder;
  requiredCols: ReqdCols;
}) => {
  const sortedColOrder = Object.entries(colOrder).sort(
    ([_a, a], [_b, b]) => a - b,
  );

  return sortedColOrder
    .filter(([col]) => requiredCols.includes(col))
    .map(([col]) => col);
};

export const addMissingKeysToJson = ({
  json,
  dataCols,
  requiredCols,
}: {
  json: Json[];
  dataCols: DataCols;
  requiredCols: ReqdCols;
}) => {
  const missingCols = dataCols.filter((col) => !requiredCols.includes(col));

  missingCols.forEach((key) => {
    json = json.map((x) => ({ ...x, [key]: "" }));
  });

  return json;
};

export const addAccUserToJson = ({
  json,
  requiredCols,
  account,
  user,
}: {
  account: string;
  user: string;
  json: Json[];
  requiredCols: ReqdCols;
}) => {
  if (!requiredCols.includes("account")) {
    json = json.map((x) => ({ ...x, account: account }));
  }

  if (!requiredCols.includes("user")) {
    json = json.map((x) => ({ ...x, user: user }));
  }

  return json;
};
