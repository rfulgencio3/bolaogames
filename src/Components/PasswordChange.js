import React, { Component } from 'react';

import { auth } from '../Firebase';

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

class PasswordChangeForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
        const { passwordOne } = this.state;

        auth.doPasswordUpdate(passwordOne)
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
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '';

        return (
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <form onSubmit={this.onSubmit}>
                        <div class="form-group">
                            <label htmlFor="newPassword">Nova senha</label>
                            <input
                                value={passwordOne}
                                onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
                                type="password"
                                placeholder="Nova senha"
                                className="form-control"
                                id="newPassword"
                            />
                        </div>
                        <div class="form-group">
                        <label htmlFor="newPasswordConfirmation">Confirmar nova senha</label>
                            <input
                                value={passwordTwo}
                                onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
                                type="password"
                                placeholder="Confirmar nova senha"
                                className="form-control"
                                id="newPasswordConfirmation"
                            />
                        </div>
                        <button type="submit" class="btn btn-primary" disabled={isInvalid}>
                            Alterar senha
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

export default PasswordChangeForm;