import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';
import { categoryArray } from '../styles/categories';
import Card from '../shared/card';
import { MaterialIcons } from '@expo/vector-icons';
import { formatNumber } from '../shared/utils';

export function CardCategory({onPress, item, isExpenses}){

    return(
        <View>
            <TouchableOpacity onPress={onPress}>
                <Card>
                    <View style={globalStyles.transactionCard}>
                        <View style={globalStyles.transactionCard}>
                            <MaterialIcons 
                                name={isExpenses
                                    ? categoryArray.expenses[item.category][0]
                                    : categoryArray.income[item.category][0]} 
                                style={globalStyles.icons} />
                            <Text style={globalStyles.transactionCategoryText}>
                                {isExpenses
                                    ? categoryArray.expenses[item.category][1]
                                    : categoryArray.income[item.category][1]}
                            </Text>
                        </View>
                        <View style={globalStyles.transactionCard}>
                            <Text style={isExpenses 
                                ? globalStyles.transactionAmountExpense 
                                : globalStyles.transactionAmountIncome}>
                                {formatNumber(item.totalSpent)} sats
                            </Text>
                            {/* <MaterialIcons 
                                name={walletsArray.type[item.transactionType][0]}
                                style={globalStyles.icons} /> */}
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        </View>
    )
}