import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Budget from '../screens/budget';
import BudgetDetails from '../screens/budgetDetails';

const BudgetStack = createNativeStackNavigator({
    screens : {
        Budget: {
            screen: Budget,
            options: {
                headerShown: false
            },
            // options: ({navigation}) => {
            //     return{
            //         headerTitle: () => <Header title='Budgets'/>
            //     }
            // }
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