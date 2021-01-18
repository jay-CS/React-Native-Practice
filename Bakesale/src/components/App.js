import React from 'react';
import {View, Text, StyleSheet, Easing, Dimensions, Animated} from 'react-native';
import ajax from '../ajax';
import DealList from './DealList';
import DealDetail from './DealDetail';
import SearchBar from './SearchBar';

class App extends React.Component {

    titleXPos = new Animated.Value(0);

    state = {
        
        deals: [],
        dealsFromSearch: [],
        currentDealId: null,

    };

    animateTitle = (direction = 1) => {
        const width = Dimensions.get('window').width - 300;
        Animated.timing(
            this.titleXPos, 
            {toValue: direction * (width/2), 
             duration: 1000,
             ease: Easing.ease,
            }
        ).start(({finished}) => {
            if(finished) { 
                this.animateTitle(-1 * direction);
            }
        });
    }


    async componentDidMount () {
        
        this.animateTitle();
        const deals = await ajax.fetchInitialDeals(); 
        this.setState({deals});
    
    };

    searchDeals = async (searchTerm) => {
        let dealsFromSearch = [];
        if(searchTerm) {
            dealsFromSearch = await ajax.fetchDealsSearchResults(searchTerm);
        }
        this.setState({dealsFromSearch});
    };

    setCurrentDeal = (dealId) => {
        this.setState({
            currentDealId: dealId,
        });
    };

    unsetCurrentDeal = () => {
        this.setState({
            currentDealId: null,
        });
    };

    currentDeal = () => {
        return this.state.deals.find((deal) => deal.key === this.state.currentDealId);
    };


    render() {

        if(this.state.currentDealId) {
            return (
                <View style = {styles.main}>
                    <DealDetail initialDealData = {this.currentDeal()} onBack = {this.unsetCurrentDeal}/>
                </View>
            );
        }
        const dealsToDisplay = this.state.dealsFromSearch.length > 0 ? this.state.dealsFromSearch : this.state.deals;

        if(dealsToDisplay.length > 0) {
            
           
            return  (
                <View style = {styles.main}>
                    
                    <SearchBar searchDeals = {this.searchDeals}/>
                    <DealList deals = {dealsToDisplay} onItemPress = {this.setCurrentDeal}/>
                
                </View>
            );
        }
        return (
            <Animated.View style = {[styles.container,{left : this.titleXPos}]}> 
            
                <Animated.Text style = {styles.header}> Special Brownies! </Animated.Text>

            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    main: {
        marginTop: 30,
    },

    header: {
        fontSize:40,
    },
});

export default App;