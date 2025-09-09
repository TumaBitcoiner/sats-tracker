import {View, Text, FlatList, Dimensions, StyleSheet} from 'react-native';
import { globalStyles } from '../../styles/global';
import { PieChart } from 'react-native-chart-kit';
import Card from '../../shared/card';
import { CardCategory } from '../../cards/cardCategory';

export default function SubWalletDetails({isExpense, walletTxs, pieData}){

    const renderItem = ({ item }) => {
        if (!item) return null;
        return (
            <CardCategory
                item={item}
                onPress={() =>  console.log('Category pressed:', item.category)}
                isExpenses={isExpense}
            />
        );
    };

    return(
        <View style={globalStyles.container}>
            <Card>
                <View style={globalStyles.cardContainer}>
                    <Text style={globalStyles.titleText}>{isExpense ? 'Expenses' : 'Income'} by Catergory</Text>
                    <PieChart
                        data={pieData}
                        width={Dimensions.get("window").width - 40}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="amount"
                        backgroundColor="transparent"
                        paddingLeft="15"
                    />
                </View>
            </Card>
            <View style={styles.listSection}>

                <FlatList 
                    data={walletTxs}
                    keyExtractor={item => item.category}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerSection: {
        paddingBottom: 10
    },
    listSection: {
        flex: 1
    },
    listContent: {
        paddingBottom: 50
    },
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