import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import * as routes from '../../Constants/routes';
import withAuthorization from '../withAuthorization';
import { db } from '../../Firebase';
import { Grid,Row,Col } from 'react-bootstrap';

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
				snapshot.forEach(groupSnap => {
					groupSnap.then(aSnap => {
                        var group = aSnap.val();
                        group.uid = aSnap.key;
                        this.setState((prev) => ({groups: [...prev.groups, group]}));
					});
				});
			})
	}

	render() {
		const { groups } = this.state;
		return (
			<Grid>
				<Row className="show-grid">
					<Col xs={12} md={12}>
						<h1>Grupos</h1>
					</Col>
				</Row>
				<Row className="show-grid">
					<Col xs={12} md={12}>
						<input />
					</Col>
				</Row>
				{!!groups && <GroupList groups={groups} />}

			</Grid>
		);
	}
}

const GroupList = ({ groups }) =>
	<Row>
		{Object.keys(groups).map(key =>
			<Col xs={4} md={4} sm={2}>
				<Link to={`${routes.GROUP}/${groups[key].uid}`} key={key}>
				<div key={key}>
                    <img src={groups[key].icon} alt={groups[key].name}/>
					<p>{groups[key].name}</p>
				</div>
				</Link>
			</Col>
		)}
	</Row>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);