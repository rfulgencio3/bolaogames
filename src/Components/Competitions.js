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
				{!!competitiongroups && <MatchList allMatches={competitiongroups} competition={competition} authUser={this.props.authUser} urlparams={this.props.match.params}/>}
			</Grid>
        );
    }
}


const MatchList = ({ allMatches, competition, authUser, urlparams}) =>
	<Row>
        {Object.keys(allMatches).map(key =>
			<Col xs={6} md={6} sm={8} key={key}>
				<h1>{key}</h1>
				<Row>
                	{Object.keys(allMatches[key]).map(groupkey =>
						<SingleMatch competition={competition} match={allMatches[key][groupkey]} authUser={authUser} matchid={groupkey} urlparams={urlparams} />
					)}
				</Row>
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
			<Col xs={6} md={6} sm={8}>
				<MatchItem competition={competition} match={match} type="host" bid={this.bidHost} formValue={this.state.host} changevalue={this.change} />
				<MatchItem competition={competition} match={match} type="guest" bid={this.bidGuest} formValue={this.state.guest} changevalue={this.change} />
				<p>{match.date}</p>
			</Col>
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
			<FormGroup>
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
			</FormGroup>
		);
	}
}

const MatchParticipant = ({ competition, match, type }) =>
	<Col componentClass={ControlLabel} xs={9}>
		<img src={competition.participants[match[type]].icon}
			alt={match[type]} />
		{match[type]} {competition.participants[match[type]].name}
	</Col>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(CompetitionPage);