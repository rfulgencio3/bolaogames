import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import * as routes from '../../Constants/routes';
import withAuthorization from '../withAuthorization';
import { db } from '../../Firebase';
import { Grid,Row,Col } from 'react-bootstrap';

class HomePage extends Component {
	constructor(props) {
		super(props);

		this.handleSubmit = this.handleSubmit.bind(this);

		this.state = {
			groups: [],
			groupLookUp: null
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

	handleSubmit(ev) {
		db.onceFindGroupByCode(ev.target[0].value)
			.then(grupoCode => {
				if (grupoCode) {
					db.onceAddUserToGroup(this.props.authUser.uid, grupoCode.key)
						.then(() => {
							this.setState((prev) => ({ groups: [...prev.groups, grupoCode] }));
						});
				} else {
					alert('No Result Found');
				}
			});
		ev.preventDefault();
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
						<MyForm action={this.handleSubmit} />
					</Col>
				</Row>
				{!!groups && <GroupList groups={groups} />}

			</Grid>
		);
	}
}

class MyForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			groupCode: ''
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleSubmit(ev) {
		db.onceFindGroupByCode(this.state.groupCode)
			.then(grupoCode => {
				if (grupoCode) {
					console.log('Firebase Hit', grupoCode)
				}
			});
		ev.preventDefault();
	}

	handleChange(stateName) {
		return (ev) => {
			const value = ev.target.value;
			this.setState({
				[stateName]: value
			})
		}
	}

	render() {
		return (
			<form onSubmit={this.props.action.bind(this)}>
				<input type="text" name="group_code" value={this.state.groupCode} onChange={this.handleChange('groupCode')} />
			</form>
		);
	}
}

const GroupList = ({ groups }) =>
	<Row>
		{Object.keys(groups).map(key =>
			<Col xs={4} md={4} sm={2} key={key}>
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