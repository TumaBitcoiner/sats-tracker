import { StyleSheet, View, Text } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons'
import ButtonCircular from '../shared/buttonCircular';
import { globalStyles } from '../styles/global';


export default function Budgets(){

    const navigation = useNavigation();
    
    return(
    
        <View style={globalStyles.container}>

            <View style={styles.emptyContainer}>
                <MaterialIcons name='build' style={styles.emptyIcon} />
                <Text style={styles.emptyText}>Working on it!</Text>
            </View>
        </View>
    )    
}

const styles = StyleSheet.create({
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
    }
});