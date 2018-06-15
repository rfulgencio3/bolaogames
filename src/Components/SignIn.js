import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpLink } from './SignUp';
import { auth } from '../Firebase';
import { PasswordForgetLink } from './PasswordForget';
import * as routes from '../Constants/routes';

const SignInPage = ({ history }) =>
    <div>
        <h1>Login</h1>
        <SignInForm history={history} />
        <SignUpLink />
    </div>

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
        const {
            email,
            password,
        } = this.state;

        const {
            history,
        } = this.props;

        auth.doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState(() => ({ ...INITIAL_STATE }));
                history.push(routes.HOME);
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        event.preventDefault();
    }

    render() {
        const {
            email,
            password,
            error,
        } = this.state;

        const isInvalid =
            password === '' ||
            email === '';

        return (
            <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <input
                        value={email}
                        onChange={event => this.setState(byPropKey('email', event.target.value))}
                        type="text"
                        placeholder="Email Address"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <input
                        value={password}
                        onChange={event => this.setState(byPropKey('password', event.target.value))}
                        type="password"
                        placeholder="Senha"
                        className="form-control"
                    />
                </div>
                <button className="btn btn-primary mb20" disabled={isInvalid} type="submit">Entrar</button>
                <div className={`${error ? null : 'd-none'} alert alert-danger`}>
                    { error ? error.message : null }
                </div>
            </form>
        );
    }
}

export default withRouter(SignInPage);

export {
    SignInForm,
};