import { View, Text } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons'
import { globalStyles } from '../styles/global';
import Header from '../headers/header';


export default function Budgets(){

    const navigation = useNavigation();
    
    return(
    
        <View style={globalStyles.container}>

            <Header title='Budgets'/>
            <View style={globalStyles.emptyContainer}>
                <MaterialIcons name='build' style={globalStyles.emptyIcon} />
                <Text style={globalStyles.emptyText}>Working on it!</Text>
            </View>
        </View>
    )    
}