import React from "react";
import {StyleSheet, View, Text, Image} from 'react-native';
import Card from "../shared/card";
import HeaderBack from "../headers/headerBack";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/global";
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeTxDetails({route}){

    const navigation = useNavigation();
    
    return (
    <View style={globalStyles.container}>
        <HeaderBack headerTitle='Tx Details' navigation={navigation} onOptionPress={() => console.log*('BELLAA')}/>
        
        <View style={globalStyles.emptyContainer}>
                <MaterialIcons name='build' style={globalStyles.emptyIcon} />
                <Text style={globalStyles.emptyText}>Working on it!</Text>
        </View>

    </View>
    )
}