import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import {CategoryExpenses, CategoryIncome} from '../modals/categoryChoice';

const Tab = createMaterialTopTabNavigator();

export default function TopTabNavigatorCategories({onPress}) {

    return (
        <NavigationIndependentTree>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions= {{
                        tabBarLabelStyle: { fontSize: 20, color: 'black' },
                        tabBarStyle: { 
                            backgroundColor: 'orange',
                            borderTopLeftRadius:8,
                            borderTopRightRadius:8,
                        }  

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