import { createStaticNavigation } from '@react-navigation/native';
//import { Button } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home';
import Budget from '../screens/budget';
import Transactions from '../screens/transactions';


  const BottomTabNavigatorHome = createBottomTabNavigator({

    screens:{
        Home: {
            screen: Home,
        },
        
        Transactions: {
            screen: Transactions,
        }, 
        
        Budget: {
            screen: Budget,
        },
    }
  })

  export default createStaticNavigation(BottomTabNavigatorHome);