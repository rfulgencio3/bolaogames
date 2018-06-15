import React from 'react';
import { Link } from 'react-router-dom';
import CustomRoute from '../CustomRoute';
import SignOutButton from '../SignOut';
import * as routes from '../../Constants/routes';
import { auth } from '../../Firebase';
import AuthUserContext from '../AuthUserContext';

const signOut = e => {
    e.preventDefault();
    auth.doSignOut();
}

const links = [
    { path: routes.LANDING, name: 'Landing', authRequired: false },
    { path: routes.HOME, name: 'Home', authRequired: true},
    { path: routes.ACCOUNT, name: 'Minha Conta', authRequired: true },
    { path: routes.SIGN_IN, name: 'Login', authRequired: false },
    { path: routes.SIGN_UP, name: 'Cadastro', authRequired: false },
    { path: null, name: 'Sair', authRequired: true, onClick: signOut }
];

const getLink = route =>
    route.onClick ?
        <a className="nav-link" onClick={route.onClick}>{route.name}</a> :
        <CustomRoute to={route.path} label={route.name} />;

export default () =>
    (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">
                    <AuthUserContext.Consumer>
                    {
                        authUser => authUser ?
                        links.map((route, index) =>
                            route.authRequired ?
                                <li className="nav-item" key={`link__${index}`}>{getLink(route)}</li> : null
                        ) :
                        links.map((route, index) =>
                            !route.authRequired ? <li className="nav-item" key={`link__${index}`}>
                                <CustomRoute to={route.path} label={route.name} /></li> : null
                        )
                    }
					</AuthUserContext.Consumer>
                </ul>
            </div>
        </nav>
    );