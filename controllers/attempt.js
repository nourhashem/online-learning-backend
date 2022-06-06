const db = require('../models');

const add = (attemptObj) =>
	new Promise((resolve, reject) => {
		db.Attempt.create(attemptObj, {
			include: [
				{
					//@FIX associations
					association: db.Deliverable.classroom,
				},
			],
		})
			.then((attempt) => {
				resolve(attempt);
			})
			.catch((error) => {
				if (error && error.errors) {
					const errorMessage = error.errors
						.map((errorObj) => errorObj.message)
						.join();
					reject(errorMessage);
				} else {
					reject('Attempt creation failed');
				}
			});
	});
