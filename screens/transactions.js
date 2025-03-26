import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import Card from '../shared/card'


export default function Transactions(){

    const navigation = useNavigation();

    return(
        <View>
            <TouchableOpacity onPress={()=> navigation.navigate('TransactionDetails')}>
                <Card>
                    <Text>Transaction Screen</Text>
                </Card>
            </TouchableOpacity>
        </View>
    )    
}