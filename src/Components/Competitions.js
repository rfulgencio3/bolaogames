import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withAuthorization from './withAuthorization';
import { db } from '../Firebase';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

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
						<h1>{competition.name}</h1>
						<h3>{competition.description}</h3>
					</Col>
					<Col xs={4} md={4} sm={2}>
						<Link to={`/ranking/${params.groupid}/${params.competitionid}`} key={params.competitionid}>
							<div key={params.competitionid}>Ranking</div>
						</Link>
					</Col>
				</Row>
				{!!competitiongroups && <MatchList allMatches={competitiongroups} competition={competition} authUser={this.props.authUser} urlparams={this.props.match.params}/>}
			</Grid>
        );
    }
}


const MatchList = ({ allMatches, competition, authUser, urlparams}) =>
	<Row>
        {Object.keys(allMatches).map(key =>
			<Col xs={12} md={12} sm={12} key={key}>
				<Col xs={12} md={12} sm={12} key={key}>
				<h1>{key}</h1>
			</Col>
			<Col xs={12} md={12} sm={12} key={key} className="table-responsive">
					<table className="table">
                	{Object.keys(allMatches[key]).map(groupkey =>
						<SingleMatch competition={competition} match={allMatches[key][groupkey]} authUser={authUser} matchid={groupkey} urlparams={urlparams} />
					)}
				</table>
				</Col>
			</Col>
        )}
	</Row>

class SingleMatch extends Component {
	constructor(props) {
		super(props);

		this.bidGuest = this.bidGuest.bind(this);
		this.bidHost = this.bidHost.bind(this);
		this.change = this.change.bind(this);

		this.state = { host:0,guest:0,points:0 }
	}

	change(ev){
		const { urlparams, matchid, authUser: { uid } } = this.props;
		var oldstate = this.state;
		oldstate[ev.target.name]= parseInt(ev.target.value,10);
		this.setState(() => (oldstate));
		db.onceDoBid(urlparams.groupid,urlparams.competitionid,matchid,uid,oldstate.host,oldstate.guest)
		.then(() =>{});
	}

	bidHost(ev) {
		const { urlparams, matchid, authUser: { uid } } = this.props;
		var oldstate = this.state;
		oldstate[ev.target[0].name] = parseInt(ev.target[0].value, 10);
		this.setState(() => (oldstate));
		ev.preventDefault();
		db.onceDoBid(urlparams.groupid, urlparams.competitionid, matchid, uid, oldstate.host, oldstate.guest)
			.then(() => { });
	}

	bidGuest(ev) {
		const { urlparams, matchid, authUser: { uid } } = this.props;
		var oldstate = this.state;
		oldstate[ev.target[0].name] = parseInt(ev.target[0].value, 10);
		this.setState(() => (oldstate));
		ev.preventDefault();
		db.onceDoBid(urlparams.groupid, urlparams.competitionid, matchid, uid, oldstate.host, oldstate.guest)
			.then(() => { });
	}

	componentDidMount() {
		const { urlparams,matchid,authUser:{uid} } = this.props;
		db.onceGetBid(urlparams.groupid, urlparams.competitionid,matchid,uid)
		.then(snapshot =>{
			if(snapshot){
				const game = snapshot.val();
				this.setState(() =>(game));
			}
		})

	}

	render(){
		const { competition, match } = this.props;
		return(
			<tr>
				<MatchItem competition={competition} match={match} type="host" bid={this.bidHost} formValue={this.state.host} changevalue={this.change} />
				<MatchItem competition={competition} match={match} type="guest" bid={this.bidGuest} formValue={this.state.guest} changevalue={this.change} />
				<td>{match.date}</td>
			</tr>
		);
	}
}

class MatchItem extends Component{
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = { bid: 0}
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
		const { competition, match, type,formValue } = this.props;
		return (
			<td>
				<MatchParticipant competition={competition} match={match} type={type} />
				{match.open ?
					<Col xs={3}>
						<form onSubmit={this.props.bid.bind(this)}>
						<input type="number" name={type} value={formValue} onChange={this.props.changevalue}/>
						</form>
					</Col>
					:
					<Col xs={3} componentClass={ControlLabel}>
						{match.result[type]}
					</Col>
				}
			</td>
		);
	}
}

const MatchParticipant = ({ competition, match, type }) =>
	<span>
		<img src={competition.participants[match[type]].icon} alt={match[type]} />
		{match[type]} {competition.participants[match[type]].name}
	</span>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(CompetitionPage);