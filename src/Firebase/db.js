import {db} from './firebase';

// User API
export const doCreateUser = (id, username, email) =>
	db.ref(`users/${id}`).set({
		username,
		email,
	});

export const onceGetUsers = () =>
	db.ref('users').once('value');

//Group API
export const doCreateGroup = (name, description, icon, code) => {
    const groupsRef = db.ref('groups');
	var group = groupsRef.push();
	return group.set({ name, description, icon, code });
}

export const onceGetGrupos = () =>
	db.ref('groups').once('value');

export const onceFindGroupByCode = (code) => {
    const allGroups = db.ref('groups').once('value');
    var _group = {};
    allGroups.every(function (group, index) {
        if (group.code === code) {
            _group = group;
            return false;
        }
        return true;
    });
    return _group;
}

export const onceGetMyGroups = (userid) => {
    const myself = db.ref(`users/${userid}`).once('value');

	return myself
		.then(userSnapshot => userSnapshot.val())
		.then(user => {
			var myGroups = [];
			Object.keys(user.groups).forEach(groupid => {
				myGroups.push(db.ref(`groups/${groupid}`).once('value'));
			});
			return myGroups;
		});
}


//Competition API
export const doCreateCompetition = (name, description, icon, status) => {
    const competitionsRef = db.ref('competitions');
    var competition = competitionsRef.push();
    return competition.set({name, description, icon, status});
}

export const onceGetCompetitions = () =>
    db.ref('competitions').once('value');

export const onceGetMyCompetitions = (groupid) => {

}

//