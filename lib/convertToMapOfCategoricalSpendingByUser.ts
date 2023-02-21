import { MonthlyCategoricalSummaryType } from "../types/Database";

// * Func to convert an array of categorical spending per user to a key/value pair of user and array of categorical spending
export const convertToMapOfCategoricalSpendingByUser = (data: Required<MonthlyCategoricalSummaryType>[]) => {
    // * Initialize empty Map to store array of categorical spending for each user
    const categoricalSpendingByUser = new Map<string, number[]>();

    // * Get array of unique users in data
    const uniqueUsers = [...new Set(data.map((item) => item.user))];

    // * Get array of unique categories in data
    const uniqueCategories = [...new Set(data.map((item) => item.category))];

    // * Loop over each user in data and set the array of categorical spending for that user
    uniqueUsers.forEach((user) => {
        // * Filter data to only get data for the user being looped over
        const userFilteredSummary = data.filter((item) => item.user === user);

        // * Loop over the unique categories in the dataset to either set the array element for that category to 0 or the actual sum of spending for that category
        const arrayOfCategoricalSpending = uniqueCategories.map((category) => {
            // * Filter the dataset to only include the category being looped over
            const categoryItem = userFilteredSummary.filter((item) => item.category === category)[0];

            // * Set array element for that category to 0 if no data for the category exists, or set it to the sum for that category
            return categoryItem === undefined ? 0 : categoryItem.sum;
        });

        // * Set the array of categorical spending for the user
        categoricalSpendingByUser.set(user, arrayOfCategoricalSpending);
    });

    // * Return the Map of categorical spending by user
    return categoricalSpendingByUser;
};
