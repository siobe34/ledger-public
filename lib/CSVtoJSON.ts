interface ConvertedJson {
    [key: string]: string;
}

export const CSVtoJSON = (CSV: string, headers: string[], removeFirstRow?: boolean): ConvertedJson[] => {
    // * Try to convert the provided string to CSV
    try {
        // * Split the CSV string into an array of rows while ignoring any empty rows in the CSV
        const rows = CSV.split("\n").filter((row) => row !== "");

        // * Remove first row of CSV array if first row is to be removed
        if (removeFirstRow) rows.shift();

        // * Map the array of rows to convert to JSON
        const json: ConvertedJson[] = rows.map((row) => {
            // * Split the current row into an array of values and remove any potential whitespaces
            const values = row.split(",").map((val) => val.replace(/\s+/g, " ").trim());

            // * Initialize an empty object to store the JSON object
            const obj: ConvertedJson = {};

            // * Iterate through provided keys and assign the values taken from the current row into the JSON object
            headers.forEach((key, index) => {
                // * Assign the key/value pair to the object
                obj[key] = values[index];
            });

            // * Return object of key/value pairs for the current row
            return obj;
        });

        // * Return JSON converted from a CSV string
        return json;
    } catch (e) {
        // * Throw error if conversion is not successful
        console.log(e);
        throw "Provided string is not a valid CSV string.";
    }
};
