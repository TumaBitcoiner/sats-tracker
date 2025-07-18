import React, {useState} from "react";
import {FlatList, View, Text, TouchableOpacity} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import Card from "../shared/card";
import { globalStyles } from "../styles/global";
import { categories } from "../styles/categories";


function CategoryChoice({categoryType, onPress, isExpenses}) {

    return(
        <FlatList 
            data={categoryType.slice(3)}
            renderItem={( {item} ) => (
                <TouchableOpacity 
                    onPress={() => onPress(item, isExpenses)}>
                    <Card>
                        <View style={globalStyles.transactionCard}>
                            <MaterialIcons name={item[0]} style={globalStyles.icons} />
                            <Text style={globalStyles.transactionCategoryText}>{item[1]}</Text>
                        </View>
                    </Card>
                </TouchableOpacity>
            )}
        />
    )
}

export function CategoryExpenses({onPress}) {

    return(
        <CategoryChoice 
            categoryType={categories.expenses} 
            isExpenses={true}
            onPress={onPress}
        />
    )
}

export function CategoryIncome({onPress}) {

    return(
        <CategoryChoice 
            categoryType={categories.income} 
            isExpenses={false}
            onPress={onPress}
        />
    )
}