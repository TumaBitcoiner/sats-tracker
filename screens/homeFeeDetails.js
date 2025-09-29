import React from "react";
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import { globalStyles } from "../styles/global";
import Card from "../shared/card";
import HeaderWithOptions from "../headers/headerWithOptions";
import { MaterialIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useNavigation } from "@react-navigation/native";
import { formatNumber } from '../shared/utils';


export default function HomeFeeDetails({route}){

    const navigation = useNavigation();
    const { lnFees, ocFees, totalMonthlyFees, activeMonth, activeYear} = route.params;


    const pieData = [
        {
            name: "LN Fees",
            amount: lnFees,
            color: "#FFEB3B",
            legendFontColor: "#7F7F7F",
        },
        {
            name: "OC Fees",
            amount: ocFees,
            color: "#F7931A",
            legendFontColor: "#7F7F7F",
        },
    ];
    
    return (
    <View style={globalStyles.container}>
        <HeaderWithOptions headerTitle='Fee Details' navigation={navigation} onOptionPress={() => console.log*('BELLAA')}/>
        
        { (totalMonthlyFees === 0) ?
            <View style={globalStyles.emptyContainer}>
                <MaterialIcons name='info' style={globalStyles.emptyIcon} />
                <Text style={globalStyles.emptyText}>No fees paid in the specified month.</Text>
            </View>
            :
            <View>
                <Card> 
                    <View style={globalStyles.cardContainer}>
                        <Text style={globalStyles.cardTitle}>Total Fees Paid in {activeMonth}/{activeYear}:</Text>
                        <Text style={styles.balance}>{formatNumber(totalMonthlyFees)} sats</Text>
                    </View>             
                </Card>
                <Card>
                    <View style={globalStyles.cardContainer}>
                        {/* <Text style={styles.amountTitle}>Wallet Type Distribution</Text> */}
                        <PieChart
                            data={pieData}
                            width={Dimensions.get("window").width - 40}
                            height={220}
                            chartConfig={{
                                backgroundColor: "#ffffff",
                                backgroundGradientFrom: "#ffffff",
                                backgroundGradientTo: "#ffffff",
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="amount"
                            backgroundColor="transparent"
                            paddingLeft="15"
                        />
                    </View>
                </Card>
            </View>
        }        
    </View>
    )
}

const styles = StyleSheet.create({

    balance:{
        fontSize: 24,
        color: 'red',
        fontWeight: 'bold',
    },
});