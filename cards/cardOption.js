import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/global';
//import { categoryArray, walletsArray } from '../styles/categories';
import Card from '../shared/card';
import { MaterialIcons } from '@expo/vector-icons';
//import { formatNumber } from '../shared/utils';

export default function CardOption({cardIcon, cardTitle}){

    return(
        <View style={styles.cardOptionContainer}>           
            <View style={globalStyles.transactionCard}>
                <MaterialIcons 
                    name={cardIcon} 
                    style={globalStyles.icons} />
                <Text style={globalStyles.transactionCategoryText}>
                    {cardTitle}
                </Text>
            </View> 
        </View>
    )
}

const styles = StyleSheet.create({

    cardOptionContainer:{
        width: '100%',
        //flex: 1,
        backgroundColor: '#fff',
        //marginHorizontal: 4,
        //marginVertical: 6,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        //shadowOffset:{ width: 1, height: 1},
       // shadowColor: '#333',
        //elevation: 3,
    }
});