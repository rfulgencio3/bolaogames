import React from 'react';

import AuthUserContext from './AuthUserContext';
import { PasswordForgetForm } from './PasswordForget';
import PasswordChangeForm from './PasswordChange';
import withAuthorization from './withAuthorization';


const AccountPage = () =>
    <AuthUserContext.Consumer>
        {authUser =>
            <div>
                <h3>Minha conta: <small class="text-muted">{authUser.email}</small></h3>
                <PasswordForgetForm />
                <hr/>
                <PasswordChangeForm />
            </div>
        }
    </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);