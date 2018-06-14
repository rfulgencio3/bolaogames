import React, {Component} from 'react';
import withAuthorization from './withAuthorization';
import {db} from '../Firebase';

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
        const {competition, competitiongroups} = this.state;
        return (
            <div>
                <p>Competitions</p>
                {!!competitiongroups && <MatchList allMatches={competitiongroups} competition={competition}/>}
            </div>
        );
    }
}


const MatchList = ({allMatches, competition}) =>
    <div>
        {Object.keys(allMatches).map(key =>
            <div key={key}>
                <h1>{key}</h1>
                {Object.keys(allMatches[key]).map(groupkey =>
                    <div key={groupkey}>
                        <p>
                            <img src={competition.participants[allMatches[key][groupkey].host].icon}
                                 alt={allMatches[key][groupkey].host}/>
                            {allMatches[key][groupkey].host} {competition.participants[allMatches[key][groupkey].host].name}
                            <input/>
                            x
                            <input/>
                            {allMatches[key][groupkey].guest} {competition.participants[allMatches[key][groupkey].guest].name}
                        </p>
                        <p>{allMatches[key][groupkey].date}</p>
                    </div>
                )}
            </div>
        )}
    </div>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(CompetitionPage);