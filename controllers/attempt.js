const db = require('../models');

const add = (attemptObj) =>
	new Promise((resolve, reject) => {
		db.Attempt.create(attemptObj, {
			include: [
				{
					association: db.Attempt.deliverable,
				},
				{
					association: db.Attempt.student,
				},
				db.Attempt.questions,
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

const getAll = (deliverableUuid) =>
	new Promise((resolve, reject) => {
		db.Attempt.findAll({
			where: {
				deliverableUuid: deliverableUuid,
			},
			include: [
				{
					model: db.Question,
					as: 'questions',
				},
				{
					model: db.Deliverable,
					as: 'deliverable',
				},
				{
					model: db.User,
					as: 'student',
				},
			],
		})
			.then((deliverables) => resolve(deliverables))
			.catch((error) => reject(error));
	});

const getByUuid = (attemptUuid) =>
	new Promise((resolve, reject) => {
		db.Attempt.findByPk(attemptUuid, {
			include: [
				{
					model: db.Question,
					as: 'questions',
				},
				{
					model: db.Deliverable,
					as: 'deliverable',
				},
				{
					model: db.User,
					as: 'student',
				},
			],
		})
			.then((deliverable) => resolve(deliverable))
			.catch((error) => reject(error));
	});

const exists = (studentUuid, deliverableUuid) =>
	new Promise(async (resolve, reject) => {
		try {
			const attempt = await db.Attempt.findOne({
				where: { studentUuid, deliverableUuid },
			});
			if (attempt === null) resolve(false);
			else resolve(true);
		} catch (error) {
			reject(error);
		}
	});

const getStudentGrade = (studentUuid, deliverableUuid) =>
	new Promise(async (resolve, reject) => {
		try {
			const attempt = await db.Attempt.findOne({
				where: { studentUuid, deliverableUuid },
			});
			if (attempt === null) resolve(0);
			else resolve(attempt.grade);
		} catch (error) {
			reject(error);
		}
	});

const getStudentAttempt = (studentUuid, deliverableUuid) =>
	new Promise(async (resolve, reject) => {
		try {
			const attempt = await db.Attempt.findOne({
				where: { studentUuid, deliverableUuid },
				include: [
					{
						model: db.Question,
						as: 'questions',
					},
					{
						model: db.Deliverable,
						as: 'deliverable',
					},
					{
						model: db.User,
						as: 'student',
					},
				],
			});
			resolve(attempt);
		} catch (error) {
			reject(error);
		}
	});

module.exports = {
	add,
	getAll,
	getByUuid,
	exists,
	getStudentGrade,
	getStudentAttempt,
};
