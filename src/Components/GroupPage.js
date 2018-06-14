import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import withAuthorization from './withAuthorization';
import {db} from '../Firebase';

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
                        console.log(this.state.competitions);
                    });
                });
            });
	}

	render() {
        const {competitions} = this.state;
        const {match: {params}} = this.props;
		return (
            <div>
                <p>Competitions</p>
                {!!competitions && <CompetitionList competitions={competitions} group={params.id}/>}
            </div>
        );
    }
}


const CompetitionList = ({competitions, group}) =>
    <div>
        {Object.keys(competitions).map(key =>
            <Link to={`/competition/${group}/${competitions[key].uid}`} key={key}>
                <div key={key}>
                    <img src={competitions[key].icon} alt={competitions[key].name}/>
                    <p>{competitions[key].name}</p>
                </div>
            </Link>
        )}
    </div>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(GroupPage);