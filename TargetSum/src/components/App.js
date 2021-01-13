import React, {Component} from 'react';
import Game from './Game';

export default class App extends Component {
    state = {
        gameId: 1,
    };

    resetGame = () => {
        this.setState((prevState) => {
            return {gameId: prevState.gameId + 1};
        });
    }

    render() {
        return (
            <Game 
                onPlayAgain={this.resetGame}
                randomNumberCount={6} 
                initialTime={15}
                key={this.state.gameId}
            />
        );
    }
}