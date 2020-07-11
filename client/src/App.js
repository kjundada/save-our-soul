import React from 'react';
import { 
  BrowserRouter as Router, 
  Route
} from "react-router-dom";
import './App.css';
import LandingPage from './components/LandingPage';
import ConnectedPage from './components/ConnectedPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={ LandingPage } />
        <Route path="/connect" component={ ConnectedPage } />
      </div>
    </Router>
  );
}

export default App;
