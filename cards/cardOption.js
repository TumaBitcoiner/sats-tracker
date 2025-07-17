import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/global';
//import { categoryArray, walletsArray } from '../styles/categories';
import Card from '../shared/card';
import { MaterialIcons } from '@expo/vector-icons';
//import { formatNumber } from '../shared/utils';

export default function CardOption({cardIcon, cardTitle, onPress}){

    return(
        <View style={styles.cardOptionContainer}>   
            <TouchableOpacity onPress={onPress}>       
                <View style={globalStyles.transactionCard}>
                    <MaterialIcons 
                        name={cardIcon} 
                        style={globalStyles.icons} />
                    <Text style={globalStyles.transactionCategoryText}>
                        {cardTitle}
                    </Text>
                </View> 
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

    cardOptionContainer:{
        width: '100%',
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    }
});