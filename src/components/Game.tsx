import React, { Component } from 'react';
import Board from './Board';
import { Difficulty } from './types';

type GameProps = {
  difficulty: 'easy' | 'medium';
};

class Game extends Component<GameProps> {
  difficulties: { easy: Difficulty; medium: Difficulty };
  constructor(props: GameProps) {
    super(props);
    this.difficulties = {
      easy: {
        rows: 8,
        columns: 10,
        bombs: 10
      },
      medium: {
        rows: 14,
        columns: 18,
        bombs: 40
      }
    };
  }
  render() {
    return <Board difficulty={this.difficulties[this.props.difficulty]} />;
  }
}

export default Game;
