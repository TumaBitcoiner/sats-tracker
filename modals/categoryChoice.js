import {FlatList, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import Card from "../shared/card";
import { globalStyles } from "../styles/global";
import { categories } from "../styles/categories";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

function CategoryChoice({categoryType, onPress, isExpenses}) {

    return(
        <FlatList 
            data={categoryType.slice(4)}
            renderItem={( {item} ) => (
                <TouchableOpacity 
                    onPress={() => onPress(item, isExpenses)}>
                    <Card>
                        <View style={globalStyles.transactionCard}>
                            <MaterialIcons name={item[0]} style={globalStyles.icons} />
                            <Text style={globalStyles.transactionCategoryText}>{item[1]}</Text>
                        </View>
                    </Card>
                </TouchableOpacity>
            )}
            style={styles.listBackground}
            contentContainerStyle={styles.listContent}
        />
    )
}

function CategoryExpenses({onPress}) {

    return(
        <CategoryChoice 
            categoryType={categories.expenses} 
            isExpenses={true}
            onPress={onPress}
        />
    )
}

function CategoryIncome({onPress}) {

    return(
        <CategoryChoice 
            categoryType={categories.income} 
            isExpenses={false}
            onPress={onPress}
        />
    )
}

export default function TopTabNavigatorCategories({onPress}) {

    return (
        <NavigationIndependentTree>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={{
                        tabBarStyle:  globalStyles.tabBarNavigator,
                        tabBarIndicatorStyle: { backgroundColor: '#f7931a' },
                        tabBarShowIcon: false,
                        tabBarShowLabel: true,
                        tabBarLabelStyle: { fontSize: 20, fontWeight: 'bold' },
                        tabBarActiveTintColor: '#f7931a',
                        tabBarInactiveTintColor: 'black'
                    }}
                >
                    <Tab.Screen
                        name="Expenses"
                        children={() => <CategoryExpenses onPress={onPress} />} // Pass onPress as a prop
                    />
                    <Tab.Screen
                        name="Income"
                        children={() => <CategoryIncome onPress={onPress} />} // Pass onPress as a prop
                    />
                    
                </Tab.Navigator>
            </NavigationContainer>
        </NavigationIndependentTree>
    );
}

const styles = StyleSheet.create({
    listBackground: {
        backgroundColor: '#ffffff', // Match your modal background color
        flex: 1
    },
    listContent: {
        paddingTop: 16
    }
});