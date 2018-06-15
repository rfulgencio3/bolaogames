import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { auth } from '../Firebase';

const PasswordForgetPage = () =>
    <div>
        <h1>PasswordForget</h1>
        <PasswordForgetForm />
    </div>

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    email: '',
    error: null,
};

class PasswordForgetForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
        const { email } = this.state;

        auth.doPasswordReset(email)
            .then(() => {
                this.setState(() => ({ ...INITIAL_STATE }));
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        event.preventDefault();
    }

    render() {
        const {
            email,
            error,
        } = this.state;

        const isInvalid = email === '';

        return (
            <div className="row">
                <div className="col-md-8 col-sm-12">
                    <form onSubmit={this.onSubmit} className="form-inline">
                        <div className="form-group mb-2">
                            <label htmlFor="emailField"></label>
                            <input
                                value={this.state.email}
                                onChange={event => this.setState(byPropKey('email', event.target.value))}
                                type="text"
                                placeholder="Email Address"
                                class="form-control"
                                id="emailField"
                            />
                        </div>
                        <button class="btn btn-primary mx-sm-3 mb-2" disabled={isInvalid} type="submit">
                            Resetar minha senha
                        </button>
                        <div className={`${error ? null : 'd-none'} alert alert-danger`}>
                            { error ? error.message : null }
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
    

export default PasswordForgetPage;

export { PasswordForgetForm };