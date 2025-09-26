import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/global';
import { categoryArray, walletsArray } from '../styles/categories';
import Card from '../shared/card';
import { MaterialIcons } from '@expo/vector-icons';
import { formatNumber } from '../shared/utils';

export default function CardMonthlyHome({amount, title, onPress}){

    return(
       
        <View>
            <TouchableOpacity onPress={onPress}>
                 <Card>   
                    <View style={styles.amountContainer}>
                        <Text style={styles.amount}>{title}:</Text>
                        <Text style={styles.amount}>{formatNumber(amount)}</Text>
                    </View>            
                </Card>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

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
})