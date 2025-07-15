import { useState, useEffect } from 'react';
import {View, Text, FlatList, Dimensions, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/global';
import { getCategoryTotalsByWallet } from '../database/database'; // Import the function to get totals
import { useNavigation } from "@react-navigation/native";
import { CardCategory } from '../cards/cardCategory';
import { PieChart } from 'react-native-chart-kit';
import Card from '../shared/card';
import { EXPENSES_RANK_COLORS } from '../styles/categories';

export default function WalletDetails({route}){


    const [walletExpenses, setWalletExpenses] = useState([]);
    const [pieData, setPieData] = useState([]);

    //const [walletIncome, setWalletIncome] = useState([]);

    const navigation = useNavigation();
    
    // Transform wallet expenses into pie chart data
    const createPieChartData = (expenses) => {
        return expenses.map(expense => ({
            name: expense.category,
            amount: expense.totalSpent,
            color: EXPENSES_RANK_COLORS[expense.category] || '#808080', // Random color
            legendFontColor: "#7F7F7F",
        }));
    };
    
    const renderItem = ({ item }) => (
        <CardCategory
            item={item}
            onPress={() =>  navigation.goBack()}
            isExpenses={true}
        />
    );

     const fetchTotalsOfCategoryByWallet = async () => {
            
        try {
                //console.log("Wallet ID:", route.params.id);
                const totals = await getCategoryTotalsByWallet(route.params.id);
                
                setWalletExpenses(totals);
                setPieData(createPieChartData(totals));
                //setFirstCat(totals[0].category);
               
                console.log("Wallet Expenses:", totals);
            } catch (error) {
                console.error('Error fetching wallet details:', error);
            }
    };

    useEffect(() => {

        fetchTotalsOfCategoryByWallet();

        const unsubscribe = navigation.addListener('focus', fetchTotalsOfCategoryByWallet);
        
        // Cleanup subscription
        return () => {
            unsubscribe();
            //setWalletExpenses([]);
        };
    }, [navigation]);

    return(

        <View style={globalStyles.container}>
            {/* <Text>{firstCat}</Text> */}
            <Card>
                <View style={globalStyles.cardContainer}>
                    <Text style={globalStyles.titleText}>Expenses by Catergory</Text>
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
                    data={walletExpenses}
                    keyExtractor={item => item.category}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />

            </View>
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
    }
});