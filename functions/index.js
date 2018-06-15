const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.computaPontos = functions.database.ref('matches/{competitionid}/{grupoid}/{matchid}')
	.onUpdate((change, context) => {
		if (change.before.exists() && change.after.exists()) {
			const matchNow = change.after.val();
			const matchBefore = change.before.val();

			if (matchNow && matchBefore) {

				console.log('Path', change.after.ref.path);

				/*
				if (matchBefore.result.host !== matchNow.result.host && matchBefore.result.guest !== matchNow.result.guest) {
					return change
						.after.ref
						.parent.parent.parent.parent.child(`stub/${change.after.key}`).set({ host: matchNow.result.host, guest: matchNow.result.guest });
				}
				*/
			}
		}
		return null;
	});
