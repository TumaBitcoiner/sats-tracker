import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home';
import HomeFeeDetails from '../screens/homeFeeDetails';
import HomeTxDetails from '../screens/homeTxDetails';

const HomeStack = createNativeStackNavigator({
    screens : {
        Home: {
            screen: Home,
            options: {
                headerShown: false
            },
        },
        HomeFeeDetails:{            
            screen: HomeFeeDetails,
            options: {
                headerShown: false
            }
        },
        HomeTxDetails:{            
            screen: HomeTxDetails,
            options: {
                headerShown: false
            }
        }
    },
});

export default HomeStack;