import { createStaticNavigation, TabRouter } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {MaterialIcons} from '@expo/vector-icons'
import Home from '../screens/home';
import TransactionStack from './transactionStack';
import WalletStack from './walletStack';
import BudgetStack from './budgetStack';


  const BottomTabNavigatorHome = createBottomTabNavigator({

    screens:{
        Home: {
            screen: Home,
            options:{
                tabBarIcon:({ color, size }) =>           
                    <MaterialIcons name='home' color={color} size={size}/>,
                headerShown: false,
                // headerTitle: () => <Header title="Home" />,
                // headerTitleAlign: 'center',
                // title: 'Home'
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
        // tabBarStyle: {
        //     elevation: 8,
        //     shadowOffset: {
        //         width: 0,
        //         height: -4,
        //     },
        //     shadowOpacity: 0.1,
        //     shadowRadius: 4,
        //     borderTopWidth: 0,
        // },
    }
  })
  

  export default createStaticNavigation(BottomTabNavigatorHome);