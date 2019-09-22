import React, { Component } from 'react';
import './Flag.css';
import flagImg from '../images/flag.png';

class Flag extends Component {
  render() {
    return <img className="flag" src={flagImg} alt="f" />;
  }
}

export default Flag;
