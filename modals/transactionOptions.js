import {View} from 'react-native';
import CardOption from '../cards/cardOption';

export default function TransactionOptions({onPress}){

    return(
        <View>
            <CardOption
                cardIcon='edit'
                cardTitle='Edit Transaction'
                onPress={() => onPress('edit')}
            />
            <CardOption
                cardIcon='delete'
                cardTitle='Delete Transaction'
                onPress={() => onPress('delete')}
            />
        </View>
    )
}