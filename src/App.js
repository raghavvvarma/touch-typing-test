/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import './App.css';
import Modal from 'react-modal';

const alphabets = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];

const images = {
  a: 'https://lh3.googleusercontent.com/SwoMSH-Kr0oKLav94Q4WvzPuYEW1b7XwHOa5xSVRo4orKmlfW-cvzwyT0GYB-ytQfkb284s=s85',
  s: 'https://lh3.googleusercontent.com/ZfnOEluvJ-WXrC6iZK2WVR2NqeCjfrXfgRT0UcvzDaaDJqcRM_78xEdIDK5jjbI-Wotsx0Q=s85',
  d: 'https://lh3.googleusercontent.com/col9ixVxVbm6KoIQDPIpPhDY3W2gDPPdmHL6snljiBEp2FiN9if23eOh8U0Lqxn7SLNG=s85',
  f: 'https://lh3.googleusercontent.com/VycGmQ81Kdb8nAX9sTz23b6AMiA-WkSIDJtYVDpNixILT0va8Q-AEpb1xXyjqjKH4g3IcA=s85',
  j: 'https://lh3.googleusercontent.com/IVHdLYTfEloYtZJZY7MnDRYRLYjhKxGLTJq0D0Aym5dLF5zv4ATLknyGps7GD5ZFLTECNQ=s85',
  k: 'https://lh3.googleusercontent.com/8tGLv58xVOafQ4g5mhAyFJSzLfGWYoQ8H33tmg04fHTTVeX9OiLNHUh1ZOXV_dhUT_WyhzE=s85',
  l: 'https://lh3.googleusercontent.com/cwZ1fdGTPyS_EIt03aarE8nPtZye2gzw0bQ99kEChZP1ePXZsuXVJ6ABByOJxNiRi4bg-XA=s85',
  ';': 'https://lh3.googleusercontent.com/uk7Dj0G0VALrsDMqAgxC58jLeGp4N_sOvfOuzwlnCTvVrKLXklo-Q5TDwBi4U6EpeYtWFA=s85',
};

const TIME_LIMIT = 5 * 60 * 1000; // 5 minutes in milliseconds

class App extends Component {
  state = {
    randomAlpha: '',
    enteredKey: '',
    correctCount: 0,
    incorrectCount: 0,
    remainingTime: TIME_LIMIT,
    isModalOpen: false,
  };

  componentDidMount() {
    this.generateRandomAlpha();
    document.addEventListener('keydown', this.handleKeyDown);
    this.startTimer();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.stopTimer();
  }

  generateRandomAlpha = () => {
    const randomIndex = Math.floor(Math.random() * alphabets.length);
    const randomAlpha = alphabets[randomIndex];
    this.setState({ randomAlpha });
  };

  handleKeyDown = (e) => {
    const { randomAlpha, enteredKey, correctCount, incorrectCount, remainingTime } = this.state;
    const enteredKeyLowerCase = e.key.toLowerCase();

    if (remainingTime > 0) {
      if (enteredKeyLowerCase === randomAlpha) {
        this.setState((prevState) => ({
          correctCount: prevState.correctCount + 1,
          enteredKey: enteredKeyLowerCase,
        }));
        this.generateRandomAlpha();
      } else {
        this.setState((prevState) => ({
          incorrectCount: prevState.incorrectCount + 1,
          enteredKey: enteredKeyLowerCase,
        }));
      }
    }
  };

  startTimer = () => {
    const startTime = Date.now();

    this.timer = setInterval(() => {
      const { remainingTime } = this.state;
      const elapsedTime = Date.now() - startTime;
      const updatedRemainingTime = Math.max(TIME_LIMIT - elapsedTime, 0);

      if (updatedRemainingTime === 0) {
        this.stopTimer();
        this.openModal();
      }

      this.setState({ remainingTime: updatedRemainingTime });
    }, 1000);
  };

  stopTimer = () => {
    clearInterval(this.timer);
  };

  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  calculateAccuracy = () => {
    const { correctCount, incorrectCount } = this.state;
    const totalInputs = correctCount + incorrectCount;
    const accuracy = totalInputs === 0 ? 0 : (correctCount / totalInputs) * 100;
    return accuracy.toFixed(2);
  };

  render() {
    const { randomAlpha, enteredKey, correctCount, incorrectCount, remainingTime, isModalOpen } = this.state;

    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);

    const accuracy = this.calculateAccuracy();

    return (
      <div className="app-container">
        <h1 className="heading">Typing Speed Test</h1>
        <div className="timer">Remaining Time: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</div>
        <img className="alphabet-image" src={images[randomAlpha]} alt={randomAlpha} />
        <div className="entered-text">Entered Text: {enteredKey}</div>
        <div className="stats-container">
          <div className="stats">
            <div className="stat">
              <span className="stat-label">Correct Count:</span>
              <span className="stat-value">{correctCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Incorrect Count:</span>
              <span className="stat-value">{incorrectCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Accuracy:</span>
              <span className="stat-value">{accuracy}%</span>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onRequestClose={this.closeModal} className="modal">
          <h2>Test Results</h2>
          <div className="modal-stats">
            <div className="modal-stat">
              <span className="modal-stat-label">Correct Inputs:</span>
              <span className="modal-stat-value">{correctCount}</span>
            </div>
            <div className="modal-stat">
              <span className="modal-stat-label">Incorrect Inputs:</span>
              <span className="modal-stat-value">{incorrectCount}</span>
            </div>
            <div className="modal-stat">
              <span className="modal-stat-label">Accuracy:</span>
              <span className="modal-stat-value">{accuracy}%</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={this.closeModal}>Close</button>
        </Modal>
      </div>
    );
  }
}

export default App;

