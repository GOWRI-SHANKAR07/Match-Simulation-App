import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Platform, PixelRatio, useWindowDimensions, TouchableOpacity, TouchableOpacityBase, TouchableOpacityComponent } from 'react-native';
import { Logo, ScoreCont } from './styles/HomeScreen';
import { Normalize, windowHeight, windowWidth } from './utils/dimensions';

let initialPlayers = [
  { name: 'Kirat', probability: { dotball: 0.05, '1': 0.3, '2': 0.25, '3': 0.1, '4': 0.15, '5': 0.01, '6': 0.19, out: 0.05 }, available: true },
  { name: 'N.S. Nodhi', probability: { dotball: 0.1, '1': 0.4, '2': 0.2, '3': 0.05, '4': 0.05, '5': 0.01, '6': 0.19, out: 0.10 }, available: true },
  { name: 'R Rumrah', probability: { dotball: 0.2, '1': 0.3, '2': 0.15, '3': 0.05, '4': 0.05, '5': 0.01, '6': 0.24, out: 0.20 }, available: true },
  { name: 'Shashi Henra', probability: { dotball: 0.3, '1': 0.25, '2': 0.05, '3': 0, '4': 0.05, '5': 0.01, '6': 0.34, out: 0.30 }, available: true },
];




const MatchSimulation = () => {


  const [score, setScore] = useState(124);
  const [wickets, setWickets] = useState(7);
  const [overs, setOvers] = useState(16);
  const [strikerIndex, setStrikerIndex] = useState(0);
  const [isOut, setIsOut] = useState(false);
  const [outPlayers, setOutPlayers] = useState([]);
  const [currentStrikerScore, setCurrentStrikerScore] = useState(0);
  const [nonStrikerScore, setNonStrikerScore] = useState(0);
  const [currentBallScore, setCurrentBallScore] = useState(0);

  const availablePlayers = initialPlayers.filter(player => player.available);
  const [striker, nonStriker] = availablePlayers;
  const currentStriker = isOut ? nonStriker : striker;

  const matchResult = () => {
    if (score >= 174) {
      return 'Bengaluru won the match!';
    } else {
      return `Bengaluru lost the match by ${174 - score} runs.`;
    }
  };

  const handleBowl = () => {
    if (score >= 174 || overs >= 20 || wickets >= 10) {
      return;
    }

    const random = Math.random();
    const { probability } = currentStriker;

    let outcome;
    if (random <= probability['dotball']) {
      outcome = 'dotball';
    } else if (random <= probability['dotball'] + probability['1']) {
      outcome = '1';
    } else if (random <= probability['dotball'] + probability['1'] + probability['2']) {
      outcome = '2';
    } else if (random <= probability['dotball'] + probability['1'] + probability['2'] + probability['3']) {
      outcome = '3';
    } else if (random <= probability['dotball'] + probability['1'] + probability['2'] + probability['3'] + probability['4']) {
      outcome = '4';
    } else if (random <= probability['dotball'] + probability['1'] + probability['2'] + probability['3'] + probability['4'] + probability['5']) {
      outcome = '5';
    }  
    else {
      outcome = 'out';
    }

    if (outcome !== 'dotball' && outcome !== 'out') {
      const run = parseInt(outcome, 10);
      setScore(prevScore => prevScore + run);
      setCurrentStrikerScore(prevStrikerScore => prevStrikerScore + run);
      setCurrentBallScore(run);
      if (strikerIndex === 0) {
        setCurrentStrikerScore(prevScore => prevScore + run);
      } else {
        setNonStrikerScore(prevScore => prevScore + run);
      }
      if (outcome === '1' || outcome === '3' || outcome === '5') {
        setStrikerIndex(prevIndex => (prevIndex === 0 ? 1 : 0));
        setIsOut(false);
      }
    } else if (outcome === 'out') {
      setIsOut(true);
      setWickets(prevWickets => prevWickets + 1);
      setOutPlayers(prevOutPlayers => [...prevOutPlayers, currentStriker.name]);
      const updatedPlayers = initialPlayers.map(player => {
        if (player.name === currentStriker.name) {
          return { ...player, available: false };
        }
        return player;
      });
      initialPlayers = updatedPlayers;

      const nextNonStriker = availablePlayers.find(player => player !== nonStriker);
      setStrikerIndex(availablePlayers.indexOf(nextNonStriker));
      setIsOut(false);
      setCurrentStrikerScore(0);
      setNonStrikerScore(0);
    }

    setOvers(prevOvers => prevOvers + 0.1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Match Simulation</Text>
      <Text style={styles.label}>CSK VS RCB</Text>
      <Text>CSK won the toss and choose to bat first</Text>
      <View style={styles.secondCont}>
        <View style={styles.logoCont}>
          <Image
            style={styles.logo}
            source={require('./assets/rcb.jpg')}
          />
          <Text style={styles.logoLabel}>{score} - {wickets}</Text>
          <Text style={styles.oversLabel}>Overs: {overs.toFixed(1)}</Text>
        </View>
        <View style={styles.runsCont}>
          <Text style={styles.runsLabel}>{currentBallScore}</Text>
        </View>
        <View style={styles.strikerCont}>
          <Text style={styles.strikerLabel}>
          {currentStriker.name} ({currentStrikerScore}){strikerIndex === 0 && !isOut ? '*' : ''}          </Text>
          <Text style={styles.strikerLabel}>
          {nonStriker ? `${nonStriker.name}(${nonStrikerScore}) ${strikerIndex === 1 && !isOut ? '*' : ''}` : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          color={'#00A8E8'}
          // title="Bowl"
          onPress={handleBowl}
          disabled={score >= 174 || overs >= 20 || wickets >= 10}
        >
          <Text style={styles.buttonLabel}>BOWL</Text>
        </TouchableOpacity>
        <Text style={styles.outPlayersLabel}>Wickets: {outPlayers.join(', ')}</Text>
        <Text style={styles.resultLabel}>
          {overs === 20 || score >= 174 || wickets === 10 ? matchResult() : 'Match Inprogress'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#fff',
  },
  label: {
    fontSize: windowWidth * 0.1,
    color: '#fff',
  },
  outPlayersLabel: {
    fontSize: 16,
    marginTop: 10,
    color: '#fff',
  },
  resultLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#fff',
  },
  logoCont: {
    flexDirection: 'row',
    marginTop: windowHeight * -0.12,
    marginBottom: windowHeight * -0.06,
    marginRight: windowWidth * 0.01,
    backgroundColor: '#00A8E8',
    width: windowWidth * 0.92,
    height: windowHeight * 0.15,
    borderRadius: 25,
  },
  logo: {
    width: 100,
    height: 100,
    margin: 20,
    borderRadius: 10,
    alignSelf: 'center'

  },
  logoLabel: {
    color: '#fff',
    fontSize: windowWidth * 0.09,
    alignSelf: 'center'
  },

  oversLabel: {
    fontSize: windowWidth * 0.04,
    marginTop: windowHeight * 0.11,
    marginLeft: windowWidth * -0.03,
    fontWeight: '900'
  },

  strikerCont: {
    margin: windowHeight * 0.01,
    backgroundColor: '#000',
    width: windowWidth * 0.9,
    height: windowHeight * 0.13,
    borderRadius: 20,
    justifyContent: 'center',
    paddingLeft: windowWidth * 0.04
  },

  strikerLabel: {
    color: '#fff',
    fontSize: windowWidth * 0.045,
    padding: windowHeight * 0.01
  },

  runsCont: {
    marginTop: windowWidth * 0.2,
    width: windowWidth * 0.9,
    height: windowHeight * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderRadius: 20,
    borderColor: '#fff',
  },

  runsLabel: {
    color: '#fff',
    fontSize: windowWidth * 0.2
  },

  button: {
    backgroundColor: '#00A8E8',
    width: windowWidth * 0.6,
    height: windowHeight * 0.06,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: windowHeight * 0.01
  },

  buttonLabel: {
    fontSize: windowWidth * 0.07,
    color: '#fff',
  },

  secondCont: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: windowHeight * 0.2
  }


});

export default MatchSimulation;
