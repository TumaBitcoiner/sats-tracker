import { createStaticNavigation, TabRouter } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {MaterialIcons} from '@expo/vector-icons'
import Home from '../screens/home';
import TransactionStack from './transactionStack';
import Wallets from '../screens/wallets';
import BudgetStack from './budgetStack';


  const BottomTabNavigatorHome = createBottomTabNavigator({

    screens:{
        Home: {
            screen: Home,
            options:{
                tabBarIcon:({ color, size }) =>           
                    <MaterialIcons name='home' color={color} size={size}/>,
                title:'Home' 
            }
        },
        
        TransactionStack: {
            screen: TransactionStack,
            options:{
                tabBarIcon:({ color, size }) =>
                    <MaterialIcons name='money' color={color} size={size} />,
                
                headerShown: false, 
                title:'Transactions',
            }
        }, 
        
        Wallets: {
            screen: Wallets,
            options:{
                tabBarIcon:({ color, size }) =>
                    <MaterialIcons name='account-balance-wallet' color={color} size={size} />,
                
                //headerShown: false, 
                title:'Wallets',
            }
        }, 

        BudgetStack: {
            screen: BudgetStack,
            options:{
                tabBarIcon:({ color, size }) =>
                    <MaterialIcons name='savings' color={color} size={size}/>,
                
                headerShown: false, 
                title:'Budget', 
            },
        },
    },
    screenOptions:{
        tabBarInactiveTintColor: 'black',
        tabBarActiveTintColor: 'black',
        tabBarInactiveBackgroundColor: 'orange',  
    }
  })
  

  export default createStaticNavigation(BottomTabNavigatorHome);