import React, {useEffect} from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Card from '../shared/card'
import { useTransactions } from '../context/transactionContext'


export default function Home(){

    const { totalIncome, totalExpenses, totalFees, availableBalance, updateTotals } = useTransactions();

    useEffect(() => {
        updateTotals();
    }, []);

    return(
        <View>
            <Card>               
                <Text>Your Balance: {availableBalance}</Text>
            </Card>
            <Card>               
                <Text>Income: {totalIncome}</Text>
                <Text>Expenses: {totalExpenses}</Text>
                <Text>Fees: {totalFees}</Text>
            </Card>
        </View>
    )    
}