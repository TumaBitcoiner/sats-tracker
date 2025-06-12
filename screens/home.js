import React, {useEffect} from 'react'
import { StyleSheet, View, Text, Dimensions, ScrollView, TurboModuleRegistry } from 'react-native'
import Card from '../shared/card'
import { useTransactions } from '../context/transactionContext'
import { globalStyles } from '../styles/global';
import { formatNumber } from '../shared/utils';
//import { Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';



export default function Home(){

    const { totalIncome, totalExpenses, totalFees, availableBalance, LNBalance, OCBalance, updateTotals } = useTransactions();    

    const barData = {
        labels: ["Income", "Expenses", "Fees"],
        datasets: [
            {
                data: [totalIncome, totalExpenses, totalFees],
                
            }
        ],
        colors: [
            '#00C851',  // Green for income
            '#ff4444',  // Red for expenses
            '#ffbb33'   // Yellow for fees
        ]
    };

    const pieData = [
        {
            name: "LN Balance",
            amount: LNBalance,
            color: "#FFEB3B",
            legendFontColor: "#7F7F7F",
        },
        {
            name: "OC Balance",
            amount: OCBalance,
            color: "#F7931A",
            legendFontColor: "#7F7F7F",
        },
        // {
        //     name: "Fees",
        //     amount: totalFees,
        //     color: "#ffbb33",
        //     legendFontColor: "#7F7F7F",
        // }
    ];

    useEffect(() => {
        updateTotals();
    }, []);

    return(
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        
            <View style={globalStyles.container}>

                <View>
                    <Card> 
                        <View style={globalStyles.cardContainer}>
                            <Text style={globalStyles.cardTitle}>Your Balance</Text>
                            <Text style={styles.balance}>{formatNumber(availableBalance)} sats</Text>
                        </View>             
                    </Card>
                    <Card>
                        <View style={globalStyles.cardContainer}>
                            <Text style={styles.amountTitle}>Wallet Type Distribution</Text>
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
                        <View style={globalStyles.cardContainer}>
                            <Text style={styles.amountTitle}>Transaction Overview</Text>
                            <BarChart
                                data={barData}
                                width={Dimensions.get("window").width - 40}
                                height={220}
                                yAxisLabel=""
                                chartConfig={{
                                    backgroundColor: "#ffffff",
                                    backgroundGradientFrom: "#ffffff",
                                    backgroundGradientTo: "#ffffff",
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    },
                                    barPercentage: 0.5,
                                    //useShadowColorFromDataset: true,
                                    fillShadowGradient: '#000000',
                                    fillShadowGradientOpacity: 1,
                                    propsForLabels: {
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                    },                                    
                                }}
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16
                                }}
                                //showValuesOnTopOfBars={true}
                                fromZero={true}
                                horizontal={true}
                            />
                        </View>
                    </Card>
                    <Card>
                        <View>
                            <View style={globalStyles.cardContainer}>
                                <Text style={styles.amountTitle}>Balance Info</Text>
                            </View>
                            <Card>   
                                <View style={styles.amountContainer}>
                                    <Text style={styles.amount}>Income:</Text>
                                    <Text style={styles.amount}>{formatNumber(totalIncome)}</Text>
                                </View>            
                            </Card>
                            <Card>                   
                                <View style={styles.amountContainer}>
                                    <Text style={styles.amount}>Expenses:</Text>
                                    <Text style={styles.amount}>{formatNumber(totalExpenses)}</Text>
                                </View>                      
                            </Card>
                            <Card>  
                                <View style={styles.amountContainer}>
                                    <Text style={styles.amount}>Fees Paid:</Text>
                                    <Text style={styles.amount}>{formatNumber(totalFees)}</Text>
                                </View>          
                            </Card>
                        </View>
                    </Card>
                </View>            
            </View>

        </ScrollView>
    )    
}

const styles = StyleSheet.create({

    balance:{
        fontSize: 24,
        color: 'green',
        fontWeight: 'bold',
    },
    amount:{
        fontSize: 15
    },
    amountContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    amountTitle:{
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },

})