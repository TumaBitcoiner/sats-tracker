import {View} from 'react-native';
import CardOption from '../cards/cardOption';

export default function WalletOptions({onPress}){

    return(
        <View>
            <CardOption
                cardIcon='swap-horiz'
                cardTitle='Swap Funds'
                onPress={() => onPress('swap')}
            />
            <CardOption
                cardIcon='change-circle'
                cardTitle='Consolidate'
                onPress={() => onPress('consolidate')}
            />
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