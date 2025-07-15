import { useState, useEffect, StrictMode } from 'react';
import {View, Text, FlatList, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';
import { getCategoryTotalsByWallet } from '../database/database'; // Import the function to get totals
import { useNavigation } from "@react-navigation/native";
import { CardCategory } from '../cards/cardCategory';

export default function WalletDetails({route}){


    const [walletExpenses, setWalletExpenses] = useState([]);
    //const [walletIncome, setWalletIncome] = useState([]);

    const [firstCat, setFirstCat] = useState("");

    const navigation = useNavigation();
    
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

        <View>
            {/* <Text>{firstCat}</Text> */}
            <StrictMode>
            <FlatList 
                data={walletExpenses}
                keyExtractor={item => item.category}
                renderItem={renderItem}
            />
            </StrictMode>
        </View>
    )
}