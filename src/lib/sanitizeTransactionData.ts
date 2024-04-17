export const sanitizeTransactionData = (
  rawData: Record<string, string | number | Date | null>[],
) => {
  return rawData.map((rawTransaction, idx) => {
    const transaction: Record<string, string | number | Date> = {};

    if (rawTransaction.transactionDate) {
      transaction.transactionDate = new Date(rawTransaction.transactionDate);
    }

    if (rawTransaction.debit) {
      transaction.debit =
        rawTransaction.debit === ""
          ? "0.00"
          : parseFloat(rawTransaction.debit.toString()).toFixed(2).toString();
    }

    if (rawTransaction.credit) {
      transaction.credit =
        rawTransaction.credit === ""
          ? "0.00"
          : parseFloat(rawTransaction.credit.toString()).toFixed(2).toString();
    }

    if (rawTransaction.balance) {
      transaction.balance =
        rawTransaction.balance === ""
          ? "0.00"
          : parseFloat(rawTransaction.balance.toString()).toFixed(2).toString();
    }

    return {
      sequence: idx + 1,
      transactionDate: transaction.transactionDate,
      description: rawTransaction.description,
      debit: transaction.debit ?? "0.00",
      credit: transaction.credit ?? "0.00",
      balance: transaction.balance ?? "0.00",
      user: rawTransaction.user,
      account: rawTransaction.account,
      category: rawTransaction.category,
      comments: rawTransaction.comments,
    };
  });
};
