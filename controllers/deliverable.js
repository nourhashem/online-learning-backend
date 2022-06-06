const db = require('../models');

const add = (deliverableObj) =>
	new Promise((resolve, reject) => {
		db.Deliverable.create(deliverableObj, {
			include: [
				{
					association: db.Deliverable.classroom,
				},
				db.Question.deliverable,
			],
		})
			.then((deliverables) => {
				resolve(deliverables);
			})
			.catch((error) => {
				if (error && error.errors) {
					const errorMessage = error.errors
						.map((errorObj) => errorObj.message)
						.join();
					reject(errorMessage);
				} else {
					reject('Deliverable creation failed');
				}
			});
	});

const getAll = (classroomUuid) =>
	new Promise((resolve, reject) => {
		db.Deliverable.findAll({
			where: {
				classroomUuid: classroomUuid,
			},
			include: [
				{
					model: db.Question,
					as: 'questions',
				},
			],
		})
			.then((deliverables) => resolve(deliverables))
			.catch((error) => reject(error));
	});

const getByUuid = (deliverableUuid) =>
	new Promise((resolve, reject) => {
		db.Deliverable.findByPk(deliverableUuid, {
			include: [
				{
					model: db.Question,
					as: 'questions',
				},
			],
		})
			.then((deliverable) => resolve(deliverable))
			.catch((error) => reject(error));
	});

module.exports = {
	add,
	getAll,
	getByUuid,
};
