import {db} from './firebase';

// User API
export const doCreateUser = (id, username, email) =>
	db.ref(`users/${id}`).set({
		username,
		email
	});

export const onceGetUsers = () =>
	db.ref('users').once('value');

export const onceAddUserToGroup = (userid, groupid) => {
	return db.ref(`users/${userid}`).once('value')
		.then(snapshot => {
			var user = snapshot.val();
			if (user.groups)
				user.groups[groupid] = true;
			else
				user.groups = { [groupid]: true };

			return db.ref(`users/${userid}`)
				.set({
					email: user.email,
					groups: user.groups,
					username: user.username
				});
		});
}

//Group API
export const doCreateGroup = (name, description, icon, code) => {
    const groupsRef = db.ref('groups');
	var group = groupsRef.push();
	return group.set({ name, description, icon, code });
}

export const onceGetGrupos = () =>
	db.ref('groups').once('value');

export const onceFindGroupByCode = (code) => {
	return db.ref('groups').once('value').then(groupSnapshot => {
		const groups = groupSnapshot.val();
        var groupToFind = null;
		Object.keys(groups).forEach(groupkey => {
			if (groups[groupkey].code === code) {
				groupToFind = groups[groupkey];
				groupToFind.key = groupkey;
            }
        });
        return groupToFind;
    });
}

export const onceGetMyGroups = (userid) =>
    db.ref(`users/${userid}`).once('value')
        .then(userSnapshot => userSnapshot.val())
        .then(user => {
			var myGroups = [];
			if (user.groups) {
				Object.keys(user.groups).forEach(groupid => {
					myGroups.push(db.ref(`groups/${groupid}`).once('value'));
				});
			}
            return myGroups;
        })


//Competition API
export const doCreateCompetition = (name, description, icon, status) => {
    const competitionsRef = db.ref('competitions');
    var competition = competitionsRef.push();
    return competition.set({name, description, icon, status});
}

export const onceGetCompetitions = () =>
    db.ref('competitions').once('value');

export const onceGetCompetition = (id) =>
    db.ref(`competitions/${id}`).once('value');

export const onceGetMyCompetitions = (groupid) => {
    return db.ref(`groups/${groupid}`).once('value')
        .then(snapshot => snapshot.val().competitions)
        .then(competitions => {
            var myGroups = [];
            Object.keys(competitions).forEach(competitionid => {
                myGroups.push(db.ref(`competitions/${competitionid}`).once('value'));
            });
            return myGroups;
        })
}

//Matches API

export const onceGetMatches = (id) =>
	db.ref(`matches/${id}`).once('value');

//Ranking API
export const onceGetRanking = (groupid, competitionid) =>
	db.ref(`ranking/${groupid}/${competitionid}`).once('value');

//Bid API
export const onceGetBid = (groupid,competitionid,matchid,userid) =>
	db.ref(`bids/${groupid}/${competitionid}/${matchid}/${userid}`).once('value');

export const onceDoBid = (groupid, competitionid, matchid, userid,host,guest) =>
	db.ref(`bids/${groupid}/${competitionid}/${matchid}/${userid}`).set({host,guest});
