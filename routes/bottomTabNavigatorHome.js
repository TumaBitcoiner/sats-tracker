import { createStaticNavigation, TabRouter } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {MaterialIcons} from '@expo/vector-icons'
import Home from '../screens/home';
import TransactionStack from './transactionStack';
import WalletStack from './walletStack';
import Wallets from '../screens/wallets';
import BudgetStack from './budgetStack';
import Header from '../shared/header';


  const BottomTabNavigatorHome = createBottomTabNavigator({

    screens:{
        Home: {
            screen: Home,
            options:{
                tabBarIcon:({ color, size }) =>           
                    <MaterialIcons name='home' color={color} size={size}/>,
                headerTitle: () => <Header title="Home" />,
                headerTitleAlign: 'center',
                title: 'Home'
            }
        },
        
        // Wallets: {
        //     screen: Wallets,
        //     options:{
        //         tabBarIcon:({ color, size }) =>
        //             <MaterialIcons name='account-balance-wallet' color={color} size={size} />,
        //         headerTitle: () => <Header title="Wallets" />,
        //         headerTitleAlign: 'center',
        //         //headerShown: false, 
        //         title:'Wallets',
        //     }
        // }, 

        WalletStack: {
            screen: WalletStack,
            options:{
                tabBarIcon:({ color, size }) =>
                    <MaterialIcons name='account-balance-wallet' color={color} size={size} />,
                
                headerShown: false, 
                title:'Wallets',
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
        

        BudgetStack: {
            screen: BudgetStack,
            options:{
                tabBarIcon:({ color, size }) =>
                    <MaterialIcons name='savings' color={color} size={size}/>,
                headerShown: false,
                title:'Budgets', 
            },
        },
    },
    screenOptions:{
        tabBarInactiveTintColor: 'black',
        tabBarActiveTintColor: 'black',
        tabBarInactiveBackgroundColor: '#f7931a',  
    }
  })
  

  export default createStaticNavigation(BottomTabNavigatorHome);