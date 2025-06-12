import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTotalIncome, getTotalExpenses, getTotalFees, getLNBalance, getOCBalance } from '../database/database';

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalFees, setTotalFees] = useState(0);
    const [availableBalance, setAvailableBalance] = useState(0);
    const [LNBalance, setLNBalance] = useState(0);
    const [OCBalance, setOCBalance] = useState(0);

    const updateTotals = async () => {
        try {
            const [income, expenses, fees, ln, oc] = await Promise.all([
                getTotalIncome(),
                getTotalExpenses(),
                getTotalFees(),
                getLNBalance(),
                getOCBalance()
            ]);

            setTotalIncome(income);
            setTotalExpenses(expenses);
            setTotalFees(fees);
            setLNBalance(ln);
            setOCBalance(oc);

            setAvailableBalance(income - expenses - fees);
            
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
            LNBalance,
            OCBalance,
            updateTotals
        }}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransactions() {
    return useContext(TransactionContext);
}