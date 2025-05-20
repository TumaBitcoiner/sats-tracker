import React, {useState} from "react";
import {FlatList, View, Text, TouchableOpacity} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import Card from "../shared/card";
import { globalStyles } from "../styles/global";
import { wallets } from "../styles/categories";
import { CardWallet } from "../cards/cardWallet";


export function WalletChoice({onPress, walletList}) {

    return(
        <FlatList 
            data={walletList}
            renderItem={( {item} ) => (
                <CardWallet
                    onPress={() => onPress(item.id, item.type, item.name)}
                    name={item.name}
                    type={item.type}                    
                    balance={item.balance}
                />
            )}
            keyExtractor={item => item.id.toString()}
            //keyExtractor={(_, index) => index.toString()}
        />
    )
}