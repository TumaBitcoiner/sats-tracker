import React, {useEffect} from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Card from '../shared/card'
import { useTransactions } from '../context/transactionContext'
import { globalStyles } from '../styles/global';


export default function Home(){

    const { totalIncome, totalExpenses, totalFees, availableBalance, updateTotals } = useTransactions();    

    useEffect(() => {
        updateTotals();
    }, []);

    return(
        <View style={globalStyles.container}>

            
            <View>
                <Card> 
                    <View style={globalStyles.cardContainer}>
                        <Text style={globalStyles.cardTitle}>Your Balance</Text>
                        <Text style={styles.balance}>{availableBalance} sats</Text>
                    </View>             
                </Card>
                <Card>
                    <View>
                        <View style={globalStyles.cardContainer}>
                            <Text style={styles.amountTitle}>Balance Info</Text>
                        </View>
                        <Card>   
                            <View style={styles.amountContainer}>
                                <Text style={styles.amount}>Income:</Text>
                                <Text style={styles.amount}>{totalIncome}</Text>
                            </View>            
                        </Card>
                        <Card>                   
                            <View style={styles.amountContainer}>
                                <Text style={styles.amount}>Expenses:</Text>
                                <Text style={styles.amount}>{totalExpenses}</Text>
                            </View>                      
                        </Card>
                        <Card>  
                            <View style={styles.amountContainer}>
                                <Text style={styles.amount}>Fees Paid:</Text>
                                <Text style={styles.amount}>{totalFees}</Text>
                            </View>          
                        </Card>
                    </View>
                </Card>
            </View>            
        </View>
    )    
}

const styles = StyleSheet.create({

    balance:{
        fontSize: 24,
        color: 'green',
        fontWeight: 'bold',
    },
    amount:{
        fontSize: 15
    },
    amountContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    amountTitle:{
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
    }


})