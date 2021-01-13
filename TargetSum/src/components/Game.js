import React, { Component } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import PropTypes from 'prop-types';
import RandomNumber  from './RandomNumber';
import shuffle from 'lodash';

class Game extends Component {
    static propTypes = {
        randomNumberCount: PropTypes.number.isRequired,
        initialTime: PropTypes.number.isRequired,
        onPlayAgain: PropTypes.func.isRequired,
    };

    state = {
        selectedIds: [],
        remainingTime: this.props.initialTime,
    };

    gameStatus = 'PLAYING';

    randomNumbers = Array
        .from({ length: this.props.randomNumberCount })
        .map(() => 1 + Math.floor(10 * Math.random()));
    target = this.randomNumbers
        .slice(0, this.props.randomNumberCount - 2)
        .reduce((acc, curr) => acc + curr, 0);
    shuffledRandomNumbers = shuffle(this.randomNumbers);

    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.setState(
                (prevState) => {
                    return { remainingTime: prevState.remainingTime - 1 };
                },
                () => {
                    if (this.state.remainingTime === 0) {
                        clearInterval(this.intervalId);
                    }
                }
            );
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if(nextState.selectedIds !== this.state.selectedIds || nextState.remainingTime === 0){
            this.gameStatus = this.calcgameStatus(nextState);
            if(this.gameStatus !== 'PLAYING'){
                clearInterval(this.intervalId);
            }
        }
    }

    isNumberSelected = (numberIndex) => {
        return this.state.selectedIds.indexOf(numberIndex) >= 0;
    }

    selectNumber = (numberIndex) => {
        this.setState((prevState) => ({
            selectedIds: [...prevState.selectedIds, numberIndex],
        }));
    }

    //gameStatus: playing, won, lost
    calcgameStatus = (nextState) => {
        const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
            return acc + this.shuffledRandomNumbers[curr];
        }, 0);
        
        
        if(nextState.remainingTime === 0){
            return 'LOST';
        }
        if(sumSelected < this.target){
            return 'PLAYING';
        }
        if(sumSelected === this.target){
            return 'WON';
        }
        if(sumSelected > this.target){
            return 'LOST';
        }
    }

    render() {
        const  gameStatus = this.gameStatus;
        return (
            <View style={styles.container}>
                <Text style={[styles.target,styles[`STATUS_${gameStatus}`]]}>
                    {this.target}
                </Text>
                <View style={styles.randomContainer}>
                    {
                        this.shuffledRandomNumbers.map((randomNumber, index) =>
                            <RandomNumber 
                                id={index}
                                key={index} 
                                number={randomNumber}
                                isDisabled={
                                    this.isNumberSelected(index) || gameStatus != 'PLAYING'
                                }
                                onPress={this.selectNumber}
                            />
                        )
                    }
                </View>
                {
                    this.gameStatus != 'PLAYING' &&
                    <View style={styles.buttonholder}>
                        <Button 
                            title='Play Again' 
                            onPress={this.props.onPlayAgain} 
                            color='white'
                        />
                    </View>
                }
                <Text style={styles.timer}>
                    Timer: {this.state.remainingTime}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#094D92',
        flex: 1,
    },

    target: {
        fontSize: 50,
        margin: 50,
        textAlign: 'center',
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
        overflow: 'hidden',
    },

    randomContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },

    STATUS_PLAYING: {
        backgroundColor: '#C1DFF0',
    },

    STATUS_WON: {
        backgroundColor: 'green',
    },

    STATUS_LOST: {
        backgroundColor: 'red',
    },

    timer: {
        alignSelf: 'center',
        bottom: 200,
        fontSize: 20,
    },

    buttonholder: {
        flex: 1,
        alignContent: 'center',
        top: 100,
    }

});


export default Game;