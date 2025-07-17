import {View} from 'react-native';
import CardOption from '../cards/cardOption';

export default function WalletOptions(){

    return(
        <View>
            <CardOption
                cardIcon='swap-horiz'
                cardTitle='Swap Funds'
            />
            <CardOption
                cardIcon='change-circle'
                cardTitle='Consolidate'
            />
            <CardOption
                cardIcon='edit'
                cardTitle='Edit Wallet'
            />
            <CardOption
                cardIcon='delete'
                cardTitle='Delete Wallet'
            />
        </View>
    )
}