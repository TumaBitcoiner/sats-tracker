import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Wallets from '../screens/wallets';
import WalletDetails from '../screens/walletDetails';

const WalletStack = createNativeStackNavigator({
    screens : {
        Wallets: {
            screen: Wallets,
            options: {
                headerShown: false
            },
            // options: ({navigation}) => {
            //     return{
            //         headerTitle: () => <Header title='Wallets'/>
            //     }
            // }
        },
        WalletDetails:{            
            screen: WalletDetails,
            options: {
                headerShown: false
            }
        }
    },
});

export default WalletStack;