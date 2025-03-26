import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import Card from '../shared/card'


export default function Budget(){

    const navigation = useNavigation();
    
    return(
        <View>
            <TouchableOpacity onPress={()=> navigation.navigate('BudgetDetails')}>
                <Card>
                    <Text>Budget Screen</Text>
                </Card>                
            </TouchableOpacity>
        </View>
    )    
}