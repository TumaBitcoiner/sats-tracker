import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { createStaticNavigation } from '@react-navigation/native';
import Budget from '../screens/budget';
import BudgetDetails from '../screens/budgetDetails';
import Header from '../shared/header';

const BudgetStack = createNativeStackNavigator({
    screens : {
        Budget: {
            screen: Budget,
            options: ({navigation}) => {
                return{
                    headerTitle: () => <Header title='Budgets'/>
                }
            }
        },
        BudgetDetails:{            
            screen: BudgetDetails,
            options:{
                title: 'Budget Details',
            }
        }
    },
});

export default BudgetStack;