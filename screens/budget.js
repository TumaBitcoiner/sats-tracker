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
                    <Text>Wait for it ;)</Text>
                </Card>                
            </TouchableOpacity>
        </View>
    )    
}