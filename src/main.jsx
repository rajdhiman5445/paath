import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import appIcon from './content/icon.png';

function setIcon(rel, href) {
  let link = document.querySelector(`link[rel="${rel}"]`);

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }

  link.setAttribute('href', href);
}

document.title = 'Paath';
setIcon('icon', appIcon);
setIcon('apple-touch-icon', appIcon);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
