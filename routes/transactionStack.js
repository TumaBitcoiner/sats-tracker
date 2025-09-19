import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Transactions from '../screens/transactions';
import TransactionDetails from '../screens/transactionDetails';

const TransactionStack = createNativeStackNavigator({
    screens : {
        Transactions: {
            screen: Transactions,
            options: {
                headerShown: false
            }
            // options: ({navigation}) => {
            //     return{
            //         headerTitle: () => <Header title='Transactions'/>
            //     }
            // }
        },
        TransactionDetails:{            
            screen: TransactionDetails,
            options: {
                headerShown: false
            }
        }
    },
});

export default TransactionStack;