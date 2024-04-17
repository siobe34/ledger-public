type Props = {
  csv: string;
  headers: string[];
  ignoreFirstRow?: boolean;
};

export const csvToJson = ({ csv, headers, ignoreFirstRow = false }: Props) => {
  const rows = csv.split("\n").filter((row) => row !== "");

  if (ignoreFirstRow) rows.shift();

  const json = rows.map((row) => {
    // * Split the current row into an array of values and remove any potential whitespaces
    const values = row.split(",").map((val) => val.replace(/\s+/g, " ").trim());

    const rowObject: Record<string, string> = {};

    headers.forEach((key, index) => {
      rowObject[key] = values[index] ?? "";
    });

    return rowObject;
  });

  return json;
};
