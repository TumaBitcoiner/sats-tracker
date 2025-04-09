import React, {useState} from "react";
import {FlatList, View, Text, TouchableOpacity} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import Card from "../shared/card";
import { globalStyles } from "../styles/global";
import { wallets } from "../styles/categories";


export function WalletTypeChoice({onPress}) {

    return(
        <FlatList 
            data={wallets.type}
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
            //keyExtractor={(_, index) => index.toString()}
        />
    )
}