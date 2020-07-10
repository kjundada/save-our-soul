import React from 'react';
import { 
  BrowserRouter as Router, 
  Route
} from "react-router-dom";
import './App.css';
import MyNavbar from './components/MyNavbar';
import LandingPage from './components/LandingPage';
import ConnectedPage from './components/ConnectedPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/" component={ MyNavbar } />
        <Route exact path="/" component={ LandingPage } />
        <Route exact path="/connect" component={ ConnectedPage } />
      </div>
    </Router>
  );
}

export default App;
