import { EXPENSES_RANK_COLORS, INCOME_RANK_COLORS } from '../styles/categories';

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

// Transform wallet TXS into pie chart data
export const createPieChartData = (transactionList, isExpense) => {

    if (!transactionList || !Array.isArray(transactionList)) return [];

    return transactionList.map(transaction => ({
        name: transaction.category,
        amount: transaction.totalAmount,
        color: (isExpense ? EXPENSES_RANK_COLORS[transaction.category] : INCOME_RANK_COLORS[transaction.category]) || '#808080', // Random color
        legendFontColor: "#7F7F7F",
    }));
};