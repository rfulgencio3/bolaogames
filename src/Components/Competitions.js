import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withAuthorization from './withAuthorization';
import { db } from '../Firebase';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import saveBtn from '../images/save.png';

class CompetitionPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            competition: {},
            competitiongroups: {}
        };
    }

    componentDidMount() {
        const {match: {params}} = this.props;
        db.onceGetCompetition(params.competitionid)
            .then(snap =>
                this.setState(() => ({competition: snap.val()}))
            ).then(() => {
            db.onceGetMatches(params.competitionid)
                .then(snapshot => {
                    this.setState((prev) => ({competitiongroups: snapshot.val(), competition: prev.competition}));
                })
        });


    }

    render() {
		const { competition, competitiongroups } = this.state;
		const { match: { params } } = this.props;
        return (
			<Grid>
				<Row className="show-grid">
					<Col xs={8} md={8} sm={4}>
						<h1>Copa 2018 - Deve vir do Banco</h1>
					</Col>
					<Col xs={4} md={4} sm={2}>
						<Link to={`/ranking/${params.groupid}/${params.competitionid}`} key={params.competitionid}>
							<div key={params.competitionid}>Ranking</div>
						</Link>
					</Col>
				</Row>
                {!!competitiongroups && <MatchList allMatches={competitiongroups} competition={competition}/>}
			</Grid>
        );
    }
}


const MatchList = ({allMatches, competition}) =>
	<Row>
        {Object.keys(allMatches).map(key =>
			<Col xs={6} md={6} sm={8} key={key}>
				<h1>{key}</h1>
				<Row>
                	{Object.keys(allMatches[key]).map(groupkey =>
						<Col xs={6} md={6} sm={8} key={groupkey}>
							<FormGroup>
								<Col componentClass={ControlLabel} xs={9}>
									<img src={competition.participants[allMatches[key][groupkey].host].icon}
										alt={allMatches[key][groupkey].host} />
									{allMatches[key][groupkey].host} {competition.participants[allMatches[key][groupkey].host].name}
								</Col>
								{allMatches[key][groupkey].open ?
									<Col xs={3}>
										<FormControl type="number" />
										<FormControl.Feedback />
									</Col>
									:
									<Col xs={3} componentClass={ControlLabel}>
										{allMatches[key][groupkey].result.host}
									</Col>
								}
							</FormGroup>
							<FormGroup>
								<Col componentClass={ControlLabel} xs={9}>
									<img src={competition.participants[allMatches[key][groupkey].guest].icon}
										alt={allMatches[key][groupkey].guest} />
									{allMatches[key][groupkey].guest} {competition.participants[allMatches[key][groupkey].guest].name}
								</Col>

							</FormGroup>
							<p>
								{allMatches[key][groupkey].open ?
									<Col xs={3}>
										<FormControl type="number" />
										<FormControl.Feedback />
										<img src={saveBtn} alt="gravar palpite" />
									</Col>
									: allMatches[key][groupkey].result.guest

								}
							</p>
							<p>{allMatches[key][groupkey].date}</p>
						</Col>
					)}
				</Row>
			</Col>
        )}
	</Row>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(CompetitionPage);