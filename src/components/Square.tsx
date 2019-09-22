import React, { Component } from 'react';
import Flag from './Flag';
import './Square.css';
import bombImg from '../images/bomb.png';
import { Cell } from './types';

type SquareProps = {
  toggleFlag(id: string): void;
  handleClick(e: React.MouseEvent): void;
} & Cell;

class Square extends Component<SquareProps> {
  handleToggleFlag = (event: React.MouseEvent) => {
    event.preventDefault();
    this.props.toggleFlag(this.props.id);
  };

  renderValue = (value: Cell['value']) => {
    if (value === 0) {
      return '';
    } else if (value === 'bomb') {
      return <img src={bombImg} className="bomb" alt="bomb" />;
    } else {
      return <span className="number">{value}</span>;
    }
  };

  render() {
    let {
      isFlagged,
      playerRevealed,
      endRevealed,
      value,
      handleClick
    } = this.props;

    let squareClasses = 'square';
    if (playerRevealed) {
      squareClasses += ' revealed';
    } else if (!playerRevealed && endRevealed) {
      squareClasses += ' untouched';
    } else {
      squareClasses += ' not-revealed';
    }

    return (
      <div
        className={squareClasses}
        onContextMenu={this.handleToggleFlag}
        onClick={handleClick}
      >
        {isFlagged && !playerRevealed && <Flag />}
        {playerRevealed && this.renderValue(value)}
        {endRevealed && !playerRevealed && this.renderValue(value)}
      </div>
    );
  }
}

export default Square;
