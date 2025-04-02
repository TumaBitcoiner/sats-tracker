import React, {useState} from "react";
import {FlatList, View, Text, TouchableOpacity} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import Card from "../shared/card";
import { globalStyles } from "../styles/global";
import { categories } from "../styles/categories";


function CategoryChoice({categoryType, onPress}) {

    return(
        <FlatList 
            data={categoryType}
            renderItem={( {item} ) => (
                <TouchableOpacity 
                    onPress={() => onPress(item)}>
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
            onPress={onPress}
        />
    )
}

export function CategoryIncome({onPress}) {

    return(
        <CategoryChoice 
            categoryType={categories.income} 
            onPress={onPress}
        />
    )
}