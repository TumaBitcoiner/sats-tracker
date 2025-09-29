import {useEffect} from "react";
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import { globalStyles } from "../styles/global";
import Card from "../shared/card";
import HeaderBack from "../headers/headerBack";
import { MaterialIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useNavigation } from "@react-navigation/native";
import { formatNumber } from '../shared/utils';
import { useTransactions } from '../context/transactionContext';

export default function HomeFeeDetails({route}){

    const navigation = useNavigation();
    const {  totalMonthlyOCFees, totalMonthlyLNFees, 
        totalMonthlyFees, updateTotals } = useTransactions();
    
    const { activeMonth, activeYear} = route.params;


    useEffect(() => {

        if (activeMonth && activeYear) {
            console.log('Active Month:', activeMonth);
            console.log('Updating totals for month:', activeMonth, 'and year:', activeYear);
            updateTotals(activeMonth, activeYear);

            const unsubscribe = navigation.addListener('focus', () => {
                console.log('Navigation focus - Updating totals for:', activeMonth, activeYear);
                updateTotals(activeMonth, activeYear);
            });

            // Cleanup subscription
            return unsubscribe;
        }
    }, [navigation]);

    const pieData = [
        {
            name: "LN Fees",
            amount: totalMonthlyLNFees,
            color: "#FFEB3B",
            legendFontColor: "#7F7F7F",
        },
        {
            name: "OC Fees",
            amount: totalMonthlyOCFees,
            color: "#F7931A",
            legendFontColor: "#7F7F7F",
        },
    ];
    
    return (
    <View style={globalStyles.container}>
        <HeaderBack headerTitle='Fee Details' navigation={navigation} onOptionPress={() => console.log*('BELLAA')}/>
        
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
                <Card>
                    <View style={globalStyles.transactionCard}>
                        <View style={globalStyles.transactionCard}>
                            <MaterialIcons 
                                name='currency-bitcoin'
                                style={globalStyles.icons} />
                            <Text style={globalStyles.transactionCategoryText}>
                                OC Fees:
                            </Text>
                            
                        </View>
                        <View style={globalStyles.transactionCard}>
                            <Text style={globalStyles.transactionAmountExpense}>
                                {formatNumber(totalMonthlyOCFees)} sats
                            </Text>
                        </View>
                    </View>
                </Card>
                <Card>
                    <View style={globalStyles.transactionCard}>
                        <View style={globalStyles.transactionCard}>
                            <MaterialIcons 
                                name='bolt'
                                style={globalStyles.icons} />
                            <Text style={globalStyles.transactionCategoryText}>
                                LN Fees:
                            </Text>
                            
                        </View>
                        <View style={globalStyles.transactionCard}>
                            <Text style={globalStyles.transactionAmountExpense}>
                                {formatNumber(totalMonthlyLNFees)} sats
                            </Text>
                        </View>
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