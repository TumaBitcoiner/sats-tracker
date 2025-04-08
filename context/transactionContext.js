import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTotalIncome, getTotalExpenses, getTotalFees } from '../database/database';

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalFees, setTotalFees] = useState(0);
    const [availableBalance, setAvailableBalance] = useState(0);

    const updateTotals = async () => {
        try {
            const [income, expenses, fees] = await Promise.all([
                getTotalIncome(),
                getTotalExpenses(),
                getTotalFees()
            ]);

            console.log('Total Income:', income);
            console.log('Total Expenses:', expenses);
            console.log('Total Fees:', fees);

            setTotalIncome(income);
            setTotalExpenses(expenses);
            setTotalFees(fees);

            setAvailableBalance(income - expenses - fees);
            console.log('Available Balance:', availableBalance);

        } catch (error) {
            console.error('Error updating totals:', error);
        }
    };

    useEffect(() => {
        updateTotals();
    }, []);

    return (
        <TransactionContext.Provider value={{
            totalIncome,
            totalExpenses,
            totalFees,
            availableBalance,
            updateTotals
        }}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransactions() {
    return useContext(TransactionContext);
}