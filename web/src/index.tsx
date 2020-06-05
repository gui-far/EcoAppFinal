//This is the first file React reads

import React from 'react';

//Makes react understand the "DOM"
import ReactDOM from 'react-dom';

//Import App...
import App from './App';

//Render....
ReactDOM.render(
  //...this component...
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  //...inside this element...
  document.getElementById('root')
);