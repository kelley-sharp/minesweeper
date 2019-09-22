import React, { Component } from 'react';
import './App.css';
import Game from './Game';

class App extends Component {
  render() {
    return (
      <section>
        <Game difficulty="easy" />
      </section>
    );
  }
}

export default App;
