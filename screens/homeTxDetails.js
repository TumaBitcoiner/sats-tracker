import {useEffect, useState} from "react";
import {StyleSheet, View, Text, Dimensions, FlatList} from 'react-native';
import Card from "../shared/card";
import HeaderBack from "../headers/headerBack";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/global";
import { MaterialIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { getCategoryTotalsByMonth } from "../database/database";
import { CardCategory } from "../cards/cardCategory";
import { useTransactions } from '../context/transactionContext';
import { formatNumber } from '../shared/utils';
import { createPieChartData } from '../shared/utils';

export default function HomeTxDetails({route}){

    const navigation = useNavigation();

    const {  totalMonthlyIncome, totalMonthlyExpenses, updateTotals } = useTransactions();

    const { activeMonth, activeYear, isExpense} = route.params;

    const [monthlyTotal, setMonthlyTotal] = useState([]);
    const [pieData, setPieData] = useState([]);
    
    const renderItem = ({ item }) => {
        if (!item) return null;
        return (
            <CardCategory
                item={item}
                onPress={() =>  console.log('Category pressed:', item.category)}
                isExpenses={isExpense}
            />
        );
    };
    
    const fetchTotalsOfCategoryByDate = async () => {
                
        try {
            const totalAmount = await getCategoryTotalsByMonth(activeMonth, activeYear, isExpense);
            
            setMonthlyTotal(totalAmount);
            console.log('Fetched monthly totals:', totalAmount);

            setPieData(createPieChartData(totalAmount || [], isExpense));

        } catch (error) {
            console.error('Error fetching wallet details:', error);
        }
    };

    useEffect(() => {
            
            const unsubscribe = navigation.addListener('focus', () => {
                fetchTotalsOfCategoryByDate();
                updateTotals(activeMonth, activeYear);
            });
            return () => unsubscribe();
        }, [navigation]);
    
    return (
        <View style={globalStyles.container}>
            <HeaderBack headerTitle={isExpense ? ' Expense Details' : 'Income Details'} navigation={navigation} onOptionPress={() => console.log*('BELLAA')}/>
            
            {monthlyTotal.length === 0 ?
                <View style={globalStyles.emptyContainer}>
                    <MaterialIcons name='info' style={globalStyles.emptyIcon} />
                    <Text style={globalStyles.emptyText}>No {isExpense ? 'expenses' : 'income'} in the specified month.</Text>
                </View>
                :   
                <View style={globalStyles.container}>
                    <Card> 
                        <View style={globalStyles.cardContainer}>
                            <Text style={globalStyles.cardTitle}>Total {isExpense ? 'Expenses' : 'Income'} in {activeMonth}/{activeYear}:</Text>
                            <Text style={{...styles.balance, color: isExpense ? 'red' : 'green'}}>{formatNumber(isExpense ? totalMonthlyExpenses : totalMonthlyIncome)} sats</Text>
                        </View>             
                    </Card>
                    <Card>
                        <View style={globalStyles.cardContainer}>
                            <Text style={globalStyles.titleText}>{isExpense ? 'Expenses' : 'Income'} by Catergory</Text>
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
                    <View style={styles.listSection}>
        
                        <FlatList 
                            data={monthlyTotal}
                            keyExtractor={item => item.category}
                            renderItem={renderItem}
                            contentContainerStyle={styles.listContent}
                        />
        
                    </View>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    headerSection: {
        paddingBottom: 10
    },
    listSection: {
        flex: 1
    },
    listContent: {
        paddingBottom: 50
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    emptyIcon: {
        fontSize: 48,
        color: '#666',
        marginBottom: 16
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center'
    },
    balance:{
        fontSize: 24,
        fontWeight: 'bold',
    },
});