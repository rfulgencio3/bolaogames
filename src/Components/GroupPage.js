import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import withAuthorization from './withAuthorization';
import {db} from '../Firebase';
import { Grid, Row, Col } from 'react-bootstrap';

class GroupPage extends Component {
	constructor(props) {
		super(props);

        this.state = {
            competitions: [],
        };
	}

	componentDidMount() {
        const {match: {params}} = this.props;
        db.onceGetMyCompetitions(params.id)
            .then(snapshot => {
                snapshot.forEach(competitionSnap => {
                    competitionSnap.then(aSnap => {
                        var competition = aSnap.val();
                        competition.uid = aSnap.key;
                        this.setState((prev) => ({competitions: [...prev.competitions, competition]}));
                    });
                });
            });
	}

	render() {
        const {competitions} = this.state;
        const {match: {params}} = this.props;
		return (
			<Grid>
				<Row className="show-grid">
					<Col xs={12} md={12}>
						<h1>Competitions</h1>
					</Col>
				</Row>
                {!!competitions && <CompetitionList competitions={competitions} group={params.id}/>}
			</Grid>
        );
    }
}


const CompetitionList = ({competitions, group}) =>
	<Row>
		{Object.keys(competitions).map(key =>
			<Col xs={4} md={4} sm={2} key={key}>
            <Link to={`/competition/${group}/${competitions[key].uid}`} key={key}>
                <div key={key}>
                    <img src={competitions[key].icon} alt={competitions[key].name}/>
                    <p>{competitions[key].name}</p>
                </div>
				</Link>
			</Col>
        )}
	</Row>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(GroupPage);