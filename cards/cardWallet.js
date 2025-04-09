import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';
import { walletsArray } from '../styles/categories';
import Card from '../shared/card';
import { MaterialIcons } from '@expo/vector-icons';

export function CardWallet({onPress, type, name}){

    return(
        <View>
            <TouchableOpacity onPress={onPress}>
                <Card>
                    <View style={globalStyles.transactionCard}>
                        <View style={globalStyles.transactionCard}>
                            <MaterialIcons 
                                name={walletsArray.type[type][0]}
                                style={globalStyles.icons} />
                            <Text style={globalStyles.transactionCategoryText}>
                                {name}
                            </Text>
                        </View>
                        {/* <View style={globalStyles.transactionCard}>
                            <Text style={item.isExpenses 
                                ? globalStyles.transactionAmountExpense 
                                : globalStyles.transactionAmountIncome}>
                                {item.amount}
                            </Text>
                            <Text style={globalStyles.transactionAmount}>{item.transactionType}</Text>
                        </View> */}
                    </View>
                </Card>
            </TouchableOpacity>
        </View>
    )
}