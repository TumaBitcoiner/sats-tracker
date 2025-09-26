import React from "react";
import {StyleSheet, View, Text, Image} from 'react-native';
import Card from "../shared/card";
import HeaderWithOptions from "../headers/headerWithOptions";
import { useNavigation } from "@react-navigation/native";

export default function HomeTxDetails({route}){

    const navigation = useNavigation();
    
    return (
    <View>
        <HeaderWithOptions headerTitle='Tx Details' navigation={navigation} onOptionPress={() => console.log*('BELLAA')}/>
        
        <Card>
            <Text>Home Tx details</Text>
        </Card>
    </View>
    )
}