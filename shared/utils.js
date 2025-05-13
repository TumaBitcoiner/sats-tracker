
export const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
};

export const groupTransactionsByDate = (transactions) => {
    const groups = transactions.reduce((groups, transaction) => {
        const date = new Date(transaction.date).toISOString().split('T')[0];
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {});

    // Convert to array and sort by date
    return Object.keys(groups)
        .sort((a, b) => new Date(b) - new Date(a))
        .map(date => ({
            date,
            data: groups[date]
        }));
};