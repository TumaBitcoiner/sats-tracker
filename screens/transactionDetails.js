import React from "react";
import {StyleSheet, View, Text, Image} from 'react-native';
import Card from "../shared/card";
import { globalStyles } from "../styles/global";
import { MaterialIcons } from "@expo/vector-icons";

export default function TransactionDetails({route}){

    return (
        <Card>
            <View style={globalStyles.transactionCard}>
                    
                <View style={styles.category}>
                    <MaterialIcons name={route.params.category[0]} style={globalStyles.icons} />
                    <Text style={{...globalStyles.transactionCategoryText, ...styles.category}}>{route.params.category[1]}</Text>
                </View>
                <View>
                    <Text style={globalStyles.transactionAmount}>{route.params.amount} sats</Text>
                    <Text style={{...globalStyles.transactionAmount, ...styles.feeText}}>{route.params.transactionFee} sats</Text>
                </View>
            </View>
            <View style={globalStyles.info}>
                <MaterialIcons name='calendar-month' style={globalStyles.icons} />
                <Text style={globalStyles.infoText}>{`${route.params.date}`}</Text>
            </View>
            <View style={globalStyles.info}>
                <MaterialIcons name='place' style={globalStyles.icons} />
                <Text style={globalStyles.infoText}>{route.params.place}</Text>
            </View>
            <Text style={globalStyles.info}>{route.params.note}</Text>
        </Card>
    )
}

const styles = StyleSheet.create({
    note: {
        paddingTop: 16,
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
    place:{
        flexDirection: 'row',
        paddingTop: 16,
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    feeText:{
        textAlign: 'right'
    },
    date:{
        flexDirection: 'row',
        paddingTop: 16,
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    category:{
        flexDirection: 'row',
        verticalAlign: 'middle',
    },
});