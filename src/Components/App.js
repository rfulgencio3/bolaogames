import React from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import LandingPage from './Landing';
import Home from './Home/Home';
import SignUpPage from './SignUp';
import SignInPage from './SignIn';
import PasswordForgetPage from './PasswordForget';
import AccountPage from './Account';
import GroupPage from './GroupPage';
import * as routes from '../Constants/routes';
import withAuthentication from './withAuthentication';

require('dotenv').config()

const App = () => (
    <Router>
        <div className="main-wrap">
            <Header></Header>
                <main className="container">
                    <Route exact path={routes.LANDING} component={() => <LandingPage />} />
                    <Route exact path={routes.HOME} component={() => <Home />} />
                    <Route exact path={routes.SIGN_UP} component={() => <SignUpPage />} />
                    <Route exact path={routes.SIGN_IN} component={() => <SignInPage />} />
                    <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
				<Route exact path={routes.ACCOUNT} component={() => <AccountPage />} />
				<Route path={routes.GROUPID} component={GroupPage} />
                </main>
            <Footer></Footer>
        </div>
    </Router>
)

export default withAuthentication(App);