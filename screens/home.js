import {useState, useEffect} from 'react'
import { StyleSheet, View, Text, Dimensions, ScrollView} from 'react-native'
import Card from '../shared/card'
import { useTransactions } from '../context/transactionContext'
import { globalStyles } from '../styles/global';
import { formatNumber } from '../shared/utils';
import { useNavigation } from "@react-navigation/native";
import { PieChart, BarChart } from 'react-native-chart-kit';
import ButtonIcon from '../shared/buttonIcon';
import Header from '../headers/header';
import CardMonthlyHome from '../cards/cardMonthlyHome';

export default function Home(){
    
    const { totalIncome, totalExpenses, totalFees, 
        availableBalance, LNBalance, OCBalance, 
        totalMonthlyIncome, totalMonthlyExpenses, totalMonthlyFees, totalMonthlyBudget, updateTotals } = useTransactions();    
        
    const navigation = useNavigation();
    
    const currentDate = new Date();
    const [activeMonth, setActiveMonth] = useState(currentDate.getMonth() + 1);
    const [activeYear, setActiveYear] = useState(currentDate.getFullYear());
    
    const updateActiveDate = (newMonth) => {
        if (newMonth < 1) {
            setActiveMonth(12);
            setActiveYear(activeYear - 1);
        } else if (newMonth > 12) {
            setActiveMonth(1);
            setActiveYear(activeYear + 1);
        } else {
            setActiveMonth(newMonth);
        }
    }
    
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
    }, [navigation, activeMonth, activeYear]);

    const barData = {
        labels: ["Income", "Expenses", "Fees"],
        datasets: [
            {
                data: [
                    totalMonthlyIncome, 
                    totalMonthlyExpenses, 
                    totalMonthlyFees
                ],                
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
    ];


    return(
        
        <View style={globalStyles.container}>
            
            <Header title="Home" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
        
                <View>
                    <Card> 
                        <View style={globalStyles.cardContainer}>
                            <Text style={globalStyles.cardTitle}>Your Balance</Text>
                            <Text style={styles.balance}>{formatNumber(availableBalance)} sats</Text>
                        </View>             
                    </Card>
                    <Card>
                        <View style={globalStyles.cardContainer}>
                            <View style={styles.monthlyHeaderContainer}>
                                <ButtonIcon icon='arrow-back-ios' onPress={() => updateActiveDate(activeMonth-1)}/>
                                <Text style={globalStyles.cardTitle}>{activeMonth}/{activeYear}</Text>
                                <ButtonIcon icon='arrow-forward-ios' onPress={() => updateActiveDate(activeMonth+1)}/>
                            </View>
                            <View style={globalStyles.cardContainer}>
                                <Text style={styles.amountTitle}>Monthly Balance</Text>
                                <Text style={totalMonthlyBudget > 0 ? styles.monthlyAmountTitlePositive : styles.monthlyAmountTitleNegative}>{formatNumber(totalMonthlyBudget)} sats</Text>
                            </View>
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
                                fromZero={true}
                                horizontal={true}
                            />
                        </View>
                        <View>
                            <CardMonthlyHome 
                                amount={totalMonthlyIncome} 
                                title='Income' 
                                onPress={() =>  navigation.navigate(
                                    'HomeTxDetails',)
                                }
                            />
                            <CardMonthlyHome 
                                amount={totalMonthlyExpenses} 
                                title='Expenses' 
                                onPress={() =>  navigation.navigate(
                                    'HomeTxDetails',)
                                }
                            />
                            <CardMonthlyHome 
                                amount={totalMonthlyFees} 
                                title='Fees' 
                                onPress={() =>  navigation.navigate(
                                    'HomeFeeDetails',)
                                }
                            />
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
                </View>            
            </ScrollView>
        </View>

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
    monthlyAmountTitlePositive:{
        fontSize: 24,
        color: 'green',
        fontWeight: 'bold',
    },
    monthlyAmountTitleNegative:{
        fontSize: 24,
        color: 'red',
        fontWeight: 'bold',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    monthlyHeaderContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    }

})