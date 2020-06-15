import React from 'react';
import './App.css';
import Button from './components/Button';
import Hover from './components/Hover';
import Toggle from './components/Toggle';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <p>Learning React-Testing || JEST</p>
      <Button />
      <p>event functions inside of class component</p>
      <Hover />
      <p>simple css way</p>
      <Toggle />
      <Header />
      <p>End to End testing</p>
    </div>
  );
}

export default App;
