import React from 'react';
import {withRouter} from 'react-router-dom';

import AuthUserContext from './AuthUserContext';
import {firebase} from '../Firebase';
import * as routes from '../Constants/routes';

const withAuthorization = (authCondition) => (Component) => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
			firebase.auth.onAuthStateChanged(authUser => {
                if (!authCondition(authUser)) {
                    this.props.history.push(routes.SIGN_IN);
				}
            });
        }

        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser => authUser ? <Component authUser={authUser} {...this.props} /> : null}
                </AuthUserContext.Consumer>
            );
        }
    }

    return withRouter(WithAuthorization);
}

export default withAuthorization;