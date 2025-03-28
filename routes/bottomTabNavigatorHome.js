import { createStaticNavigation, TabRouter } from '@react-navigation/native';
//import { Button } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home';
//import Budget from '../screens/budget';
//import Transactions from '../screens/transactions';
import TransactionStack from './transactionStack';
import {MaterialIcons} from '@expo/vector-icons'
import BudgetStack from './budgetStack';


  const BottomTabNavigatorHome = createBottomTabNavigator({

    screens:{
        Home: {
            screen: Home,
            options:{
                tabBarIcon:({ color, size }) =>           
                    <MaterialIcons name='home' color={color} size={size}/>           
                
            }
        },
        
        TransactionStack: {
            screen: TransactionStack,
            options:{
                tabBarIcon:({ color, size }) =>
                    <MaterialIcons name='money' color={color} size={size} />           
                
            }
        }, 
        
        BudgetStack: {
            screen: BudgetStack,
            options:{
                tabBarIcon:({ color, size }) =>
                    <MaterialIcons name='account-balance-wallet' color={color} size={size}/>           
            }
        },
    },
    screenOptions:{
        tabBarInactiveTintColor: 'black',
        tabBarActiveTintColor: 'black',
        tabBarInactiveBackgroundColor: 'orange',
    }
  })

  export default createStaticNavigation(BottomTabNavigatorHome);