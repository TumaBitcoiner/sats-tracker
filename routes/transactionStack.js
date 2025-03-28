import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { createStaticNavigation } from '@react-navigation/native';
import Transactions from '../screens/transactions';
import TransactionDetails from '../screens/transactionDetails';
import Header from '../shared/header';

const TransactionStack = createNativeStackNavigator({
    screens : {
        Transactions: {
            screen: Transactions,
            options: ({navigation}) => {
                return{
                    headerTitle: () => <Header title='Transactions'/>
                }
            }
        },
        TransactionDetails:{            
            screen: TransactionDetails,
            options:{
                title: 'Transaction Details',
            }
        }
    },
});

export default TransactionStack;