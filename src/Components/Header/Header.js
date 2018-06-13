import React from 'react';
import Navigation from './Navigation'
import bolaoImg from '../../images/bolao-logo.png'

export default () => (
    <header className="container">
      <div className="row">
        <div className="top col-12">
          <div className="d-flex align-items-center">
            <img src={bolaoImg} alt="" width="48" height="48"/>
            <h2>Bolão Copa do mundo 2018</h2>
          </div>
        </div>
        <div className="col-12">
          <Navigation></Navigation>
        </div>
      </div>
    </header>
);
