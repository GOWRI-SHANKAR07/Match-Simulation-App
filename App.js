import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

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
    // if (score >= 174 || overs >= 20 || wickets >= 10) {
    //   return 'Match Over';
    // }

    

    const random = Math.random();
    const { probability } = currentStriker;

    // Simulate the outcome of the ball based on probabilities
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
    } else {
      outcome = 'out';
    }

    // Update the score and striker based on the outcome
    if (outcome !== 'dotball' && outcome !== 'out') {
      const run = parseInt(outcome, 10);
      setScore(prevScore => prevScore + parseInt(outcome, 10));
      setCurrentStrikerScore(prevStrikerScore => prevStrikerScore + run);
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

      // Choose the next non-striker as the new striker
      const nextNonStriker = availablePlayers.find(player => player !== nonStriker);
      setStrikerIndex(availablePlayers.indexOf(nextNonStriker));
      setIsOut(false);
      setCurrentStrikerScore(0);
    }

    setOvers(prevOvers => prevOvers + 0.1);
  };

  return (
    <View>
      <View>
        <Text>Score: {score}</Text>
        <Text>Wickets: {wickets}</Text>
        <Text>Overs: {overs.toFixed(1)}</Text>
      </View>
      <View>
        <Text>Striker: {currentStriker.name}{strikerIndex === 0 && !isOut ? '*' : ''}({currentStrikerScore})</Text>
        <Text>Non-Striker: {nonStriker ? `${nonStriker.name}${strikerIndex === 1 && !isOut ? '*' : ''}` : ''}</Text>
      </View>
      <Button
        title="Bowl"
        onPress={handleBowl}
        disabled={score >= 174 || overs >= 20 || wickets >= 10}
      />
      <Text>Out Players: {outPlayers.join(', ')}</Text>
      <View>{overs == 20 || score >= 174 || wickets == 10 ? (<Text>{matchResult()}</Text>) : (<Text>Match in Progress</Text>)}</View>
    </View>
  );
};

export default MatchSimulation;
