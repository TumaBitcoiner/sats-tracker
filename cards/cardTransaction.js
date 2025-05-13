import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';
import { categoryArray, walletsArray } from '../styles/categories';
import Card from '../shared/card';
import { MaterialIcons } from '@expo/vector-icons';

export function CardTransaction({onPress, item}){

    return(
        <View>
            <TouchableOpacity onPress={onPress}>
                <Card>
                    <View style={globalStyles.transactionCard}>
                        <View style={globalStyles.transactionCard}>
                            <MaterialIcons 
                                name={item.isExpenses
                                    ? categoryArray.expenses[item.category][0]
                                    : categoryArray.income[item.category][0]} 
                                style={globalStyles.icons} />
                            <Text style={globalStyles.transactionCategoryText}>
                                {item.isExpenses
                                    ? categoryArray.expenses[item.category][1]
                                    : categoryArray.income[item.category][1]}
                            </Text>
                        </View>
                        <View style={globalStyles.transactionCard}>
                            <Text style={item.isExpenses 
                                ? globalStyles.transactionAmountExpense 
                                : globalStyles.transactionAmountIncome}>
                                {item.amount}
                            </Text>
                            <MaterialIcons 
                                name={walletsArray.type[item.transactionType][0]}
                                style={globalStyles.icons} />
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        </View>
    )
}