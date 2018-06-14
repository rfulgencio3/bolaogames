import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withAuthorization from './withAuthorization';
import { db } from '../Firebase';

class RankingPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			competition: {},
			ranking: {}
		};
	}

	componentDidMount() {
		const { match: { params } } = this.props;
		db.onceGetCompetition(params.competitionid)
			.then(snap =>
				this.setState(() => ({ competition: snap.val() }))
		).then(() =>
			db.onceGetRanking(params.groupid, params.competitionid)
				.then(snapshot => this.setState((prev) => ({competition: prev.competition, ranking:snapshot.val()})) )
		)
	}

	render() {
		const { match: { params } } = this.props;
		const { competition, ranking } = this.state;
		return (
			<div>
				<p>Ranking</p>
				<p>{competition.name}</p>
				<table>
					<thead>
						<th>Competidor</th>
						<th>Pontos</th>
					</thead>
					{!!ranking && <RankingBody lances={ranking} />}
				</table>
			</div>
		);
	}
}

const RankingBody = ({ lances }) => (
	<tbody>
	{ Object.keys(lances).map(key =>
		<tr>
				<td>{key}</td>
				<td>{lances[key]}</td>
		</tr>
	)}
	</tbody>
)

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(RankingPage);