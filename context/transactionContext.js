import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTotalIncome, getTotalExpenses, getTotalFees,
     getLNBalance, getOCBalance, getMonthlyTotals } from '../database/database';

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalFees, setTotalFees] = useState(0);
    const [availableBalance, setAvailableBalance] = useState(0);
    const [LNBalance, setLNBalance] = useState(0);
    const [OCBalance, setOCBalance] = useState(0);
    const [totalMonthlyIncome, setTotalMonthlyIncome] = useState(0);
    const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0);
    const [totalMonthlyOCFees, setTotaMonthlyOCFees] = useState(0);
    const [totalMonthlyLNFees, setTotaMonthlyLNFees] = useState(0);
    const [totalMonthlyFees, setTotaMonthlyFees] = useState(0);
    const [totalMonthlyBudget, setTotalMonthlyBudget] = useState(0);


    // const currentDate = new Date();
    // const month = currentDate.getMonth() + 1; // JavaScript months are 0-based
    // const year = currentDate.getFullYear();


    const updateTotals = async (activeMonth, activeYear) => {

        //const currentDate = new Date();
        const month = activeMonth; // JavaScript months are 0-based
        const year = activeYear;

        try {
            const [income, expenses, fees, ln, oc, monthlyTotals] = await Promise.all([
                getTotalIncome(),
                getTotalExpenses(),
                getTotalFees(),
                getLNBalance(),
                getOCBalance(),
                getMonthlyTotals(month, year)
            ]);

            setTotalIncome(income);
            setTotalExpenses(expenses);
            setTotalFees(fees);
            setLNBalance(ln);
            setOCBalance(oc);

            setAvailableBalance(income - expenses - fees);
            
            setTotalMonthlyIncome(monthlyTotals.totalIncome);
            setTotalMonthlyExpenses(monthlyTotals.totalExpenses);
            setTotaMonthlyOCFees(monthlyTotals.totalOCFees);
            setTotaMonthlyLNFees(monthlyTotals.totalLNFees);
            setTotaMonthlyFees(monthlyTotals.totalFees);

            setTotalMonthlyBudget(monthlyTotals.totalIncome - monthlyTotals.totalExpenses - monthlyTotals.totalFees);

        } catch (error) {
            console.error('Error updating totals:', error);
        }
    };

    return (
        <TransactionContext.Provider value={{
            totalIncome,
            totalExpenses,
            totalFees,
            availableBalance,
            LNBalance,
            OCBalance,
            totalMonthlyIncome,
            totalMonthlyExpenses,
            totalMonthlyOCFees,
            totalMonthlyLNFees,
            totalMonthlyFees,
            totalMonthlyBudget,
            updateTotals
        }}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransactions() {
    return useContext(TransactionContext);
}