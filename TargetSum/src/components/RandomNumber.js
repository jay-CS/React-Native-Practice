import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

class RandomNumber extends Component {
    static propTypes = {
        number: PropTypes.number.isRequired,
        isDisabled: PropTypes.bool.isRequired,
        onPress: PropTypes.func.isRequired,
        id: PropTypes.number.isRequired,
    };

    handlePress = () => {
        if(this.props.isDisabled) { return; }
        this.props.onPress(this.props.id);
    };

    render(){
        return(
            <TouchableOpacity onPress={this.handlePress}>
                <Text style={[styles.random, this.props.isDisabled && styles.selected]}>
                    {this.props.number}
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    random: {
        backgroundColor: '#999',
        width: 100,
        marginHorizontal: 25,
        marginVertical: 25,
        fontSize: 35,
        textAlign: 'center',
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
        overflow: 'hidden',
    },

    selected: {
        opacity: .3,
    },

});

export default RandomNumber;