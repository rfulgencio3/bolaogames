import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import * as routes from '../../Constants/routes';
import AuthUserContext from '../AuthUserContext';

const links = [
    { path: routes.LANDING, name: 'Landing', authRequired: false },
    { path: routes.HOME, name: 'Home', authRequired: true},
    { path: routes.ACCOUNT, name: 'Minha Conta', authRequired: true },
    { path: routes.SIGN_IN, name: 'Login', authRequired: false },
	{ path: routes.SIGN_UP, name: 'Cadastro', authRequired: false }
];

export default () =>
    (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">
                    <AuthUserContext.Consumer>
                    {
                        authUser => authUser ?
                        links.map((route, index) =>
                            route.authRequired ? <li className="nav-item" key={`link__${index}`}>
                                <Link className="nav-link" to={route.path}>{route.name}</Link></li> : null
                        ) :
                        links.map((route, index) =>
                            !route.authRequired ? <li className="nav-item" key={`link__${index}`}>
                                <Link className="nav-link" to={route.path}>{route.name}</Link></li> : null
                        )
                    }
					</AuthUserContext.Consumer>
					<SignOutButton />
                </ul>
            </div>
        </nav>
    );