import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../../Constants/routes';
import withAuthorization from '../withAuthorization';
import AuthUserContext from '../AuthUserContext'
import { db } from '../../Firebase';


class HomePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			groups: [],
		};
	}

	componentDidMount() {
		db.onceGetMyGroups(this.props.authUser.uid)
			.then(snapshot => {
				let arrayGroups = [];
				snapshot.forEach(groupSnap => {
					groupSnap.then(aSnap => {
						this.setState((prev) => ({groups: [...prev.groups,aSnap.val()]}))
					});
				});
			})
	}

	render() {
		const { groups } = this.state;
		return (
			<div>
				<h1>Grupos</h1>
				<div>
					<input />
				</div>
				<p>Seus Grupos</p>
				{!!groups && <GroupList groups={groups} />}
			</div>
		);
	}
}

const GroupList = ({ groups }) =>
	<div>
		{Object.keys(groups).map(key =>
			<Link to={`${routes.GROUP}/${groups[key].uid}`} key={key}>
				<div key={key}>
					<img src={groups[key].icon} />
					<p>{groups[key].name}</p>
				</div>
			</Link>
		)}
	</div>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);