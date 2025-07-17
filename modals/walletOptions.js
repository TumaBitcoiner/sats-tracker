import {View} from 'react-native';
import CardOption from '../cards/cardOption';

export default function WalletOptions(){

    return(
        <View>
            <CardOption
                cardIcon='swap-horiz'
                cardTitle='Swap Funds'
                onPress={() => console.log('Swap Funds Pressed')}
            />
            <CardOption
                cardIcon='change-circle'
                cardTitle='Consolidate'
                onPress={() => console.log('Consolidate Pressed')}
            />
            <CardOption
                cardIcon='edit'
                cardTitle='Edit Wallet'
                onPress={() => console.log('Edit Wallet Pressed')}
            />
            <CardOption
                cardIcon='delete'
                cardTitle='Delete Wallet'
                onPress={() => console.log('Delete Wallet Pressed')}
            />
        </View>
    )
}