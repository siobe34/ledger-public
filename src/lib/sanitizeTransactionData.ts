export const sanitizeTransactionData = (
  rawData: Record<string, string | number | Date | null>[],
) => {
  return rawData.map((rawTransaction, idx) => {
    const transaction: Record<string, string | number | Date> = {};

    if (rawTransaction.transactionDate) {
      transaction.transactionDate = new Date(rawTransaction.transactionDate);
    }

    return {
      sequence: idx + 1,
      transactionDate:
        transaction.transactionDate ?? rawTransaction.transactionDate,
      description: rawTransaction.description,
      debit: rawTransaction.debit,
      credit: rawTransaction.credit,
      balance: rawTransaction.balance,
      user: rawTransaction.user,
      account: rawTransaction.account,
      category: rawTransaction.category,
      comments: rawTransaction.comments,
    };
  });
};
