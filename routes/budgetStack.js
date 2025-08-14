import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { createStaticNavigation } from '@react-navigation/native';
import Budgets from '../screens/budgets';
import BudgetDetails from '../screens/budgetDetails';
import Header from '../shared/header';

const BudgetStack = createNativeStackNavigator({
    screens : {
        Budgets: {
            screen: Budgets,
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