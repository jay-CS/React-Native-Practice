import React from 'react';
import {Text, 
View, 
StyleSheet, 
Image, 
PanResponder, 
Dimensions, 
Animated, 
TouchableOpacity,
Button,
Linking} from 'react-native';
import PropTypes from 'prop-types';
import {priceDisplay} from '../util';
import ajax from '../ajax';

class DealDetail extends React.Component {
    
    imageXPos = new Animated.Value(0);
    imagePanResponder = PanResponder.create({
       
        onStartShouldSetPanResponder: () => true,
        
        onPanResponderMove: (evt,gs) => {
            this.imageXPos.setValue(gs.dx)
        },
        
        onPanResponderRelease: (evt,gs) => {
            this.width = Dimensions.get('window').width;
            if(Math.abs(gs.dx) > .4 * this.width) {
                const direction = Math.sign(gs.dx)
                Animated.timing(this.imageXPos, {
                    toValue: direction * this.width,
                    duration: 250,
                }).start(() => this.handleSwipe(-1*direction));
            }
            else {
                Animated.spring(this.imageXPos, {
                    toValue: 0,
                }).start();
            }
        },
    });

    handleSwipe = (indexDirection) => {
        if(!this.state.deal.media[this.state.imageIndex + indexDirection]) {
            Animated.spring(this.imageXPos, {
                toValue: 0,
            }).start();
            return;
        }

        this.setState((prevState) => ({
            imageIndex: prevState.imageIndex + indexDirection
        }), () => {
            this.imageXPos.setValue(indexDirection * this.width);
            Animated.spring(this.imageXPos, {
                toValue: 0,
            }).start();
        });
    }

    openDealUrl = () => {
        Linking.openURL(this.state.deal.url);
    };

    static propTypes = {
        initialDealData: PropTypes.object.isRequired,
        onBack: PropTypes.func.isRequired,
    };

    state = {
        deal: this.props.initialDealData,
        imageIndex: 0,
    };

    async componentDidMount() {

        const fullDeal = await ajax.fetchDealDetails(this.state.deal.key);
        this.setState( {
            deal: fullDeal
        });
    }

    render() {
        
        const {deal} = this.state;
        
        return (
            <View style = {styles.deal}>
                <TouchableOpacity onPress = {this.props.onBack}>
                    <Text style = {styles.backLink}> Back </Text>
                </TouchableOpacity>
                <Animated.Image 
                    {...this.imagePanResponder.panHandlers}
                    source = {{uri: deal.media[this.state.imageIndex]}} 
                    style = {[{left: this.imageXPos},styles.image]}/>

                 <View style = {styles.info}>
                     
                     <Text style = {styles.title}> {deal.title} </Text> 
                    
                     <View style = {styles.footer}>
                        
                        <Text style = {styles.cause}> {deal.cause.name} </Text>
                        <Text style = {styles.price}> {priceDisplay(deal.price)}  </Text>
                    
                    </View>

                </View>

                {deal.user && 
                    (<View>
                        
                        <Image source = {{uri: deal.user.avatar}} style = {styles.avatar} />
                        <Text> {deal.user.name} </Text>
                        <Text> {deal.description} </Text>
                    </View>)
                } 
                <View>
                    <Button title = "BUY THIS DEAL!" onPress = {this.openDealUrl}/>
                </View>
            </View>
            
        );
    }

}

const styles = StyleSheet.create({

    backLink: {
        marginBottom: 5,
        color: '#0645ad',
        marginLeft: 10,
    },

    deal: {
        marginHorizontal: 12,
        marginTop: 20,
        borderColor: "#bbb",
        borderWidth: 2,
    },

    info: {
       alignItems: 'center',
    },

    title: {
        fontSize: 16,
        padding: 10,
        fontWeight: 'bold',
        backgroundColor: 'rgba(237, 149, 45, 0.4)',
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 15,
    },

    cause: {
        flex: 2,
    },

    price: {
        flex: 1,
        textAlign: 'right',
    },

    image: {
        width: '100%',
        height: 150,
        backgroundColor: '#ccc',
    },

    avatar: {
        width: 60, 
        height: 60
    },
    
    detail: {

    },

});


export default DealDetail;