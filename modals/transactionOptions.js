import {View} from 'react-native';
import CardOption from '../cards/cardOption';

export default function TransactionOptions({onPress}){

    return(
        <View>
            <CardOption
                cardIcon='edit'
                cardTitle='Edit Wallet'
                onPress={() => onPress('edit')}
            />
            <CardOption
                cardIcon='delete'
                cardTitle='Delete Wallet'
                onPress={() => onPress('delete')}
            />
        </View>
    )
}