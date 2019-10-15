import React, { Component } from "react";
import "./App.css";
import { Difficulty } from "./types";
import Board from "./Board";
import ReactModal from "react-modal";
import dmine from "../images/dmine.png";

type AppState = { difficulty: "easy" | "medium"; showModal: boolean };
class App extends Component<{}, AppState> {
  difficulties: { easy: Difficulty; medium: Difficulty };
  constructor(props: any) {
    super(props);
    this.state = {
      difficulty: "easy",
      showModal: false
    };
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

  handleOpenModal = () => {
    this.setState({
      showModal: true
    });
  };

  handleCloseModal = () => {
    this.setState({
      showModal: false
    });
  };

  render() {
    const numColumns = this.difficulties[this.state.difficulty].columns;
    const CELL_SIZE_EM = 2;

    return (
      <div id="game-container">
        <div className="title-bar__container">
          <div className="title-bar">
            <img className="dmine" src={dmine} alt="mine" />
            <h1>Minesweeper</h1>
          </div>
        </div>
        <div>
          <ul className="menu__list">
            <li onClick={this.handleOpenModal}>Rules</li>
          </ul>
          <ReactModal
            isOpen={this.state.showModal}
            contentLabel="Rules"
            className="modal"
            style={{
              overlay: {
                zIndex: 1000,
                top: 30
              }
            }}
          >
            <div className="modal__top-bar">
              Rules
              <button className="x-button" onClick={this.handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <ul>
                <li>
                  Right mouse click: <span>flags suspected mines</span>{" "}
                </li>
                <li>
                  Left mouse click: <span> reveals square</span>{" "}
                </li>
                <li>
                  Smiley face click: <span> restarts the game</span>{" "}
                </li>
              </ul>
              <p>
                The objective is to clear the board without clicking on any of
                the 10 hidden mines.
              </p>
              <p>
                Numbers on the board indicate how many mines that cell is
                touching.
              </p>
              <p>
                A timer is set when you start so that you can compare your time
                with previous attempts.
              </p>
              <p>Good luck!</p>
            </div>
          </ReactModal>
        </div>
        <Board difficulty={this.difficulties[this.state.difficulty]} />
      </div>
    );
  }
}

export default App;
