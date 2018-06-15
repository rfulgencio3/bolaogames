import React from 'react';
import { Route, Link } from 'react-router-dom';

const CustomRoute = ({ label, to }) => (
  <Route path={to} children={({ match }) => (
    <Link
      className={`${match ? 'active' : null} nav-link`}
      to={to}>{label}</Link>
  )}
  />
);

export default CustomRoute;