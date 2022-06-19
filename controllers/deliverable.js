const db = require('../models');
const attemptController = require('./attempt');
const userController = require('./user');

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

const checkAnswer = (studentAnswer, answers) => {
	if (!studentAnswer) return false;
	const answer = answers.find((a) => a.uuid === studentAnswer.uuid);
	if (answer) {
		if (answer.type === 'multiple') {
			let correct = true;
			for (let j = 0; j < answer.choices.length; j++) {
				if (answer.answer[j] !== studentAnswer.answer[j]) {
					correct = false;
					return false;
				}
			}
			if (correct) return true;
		} else if (answer.answer === studentAnswer.answer) {
			return true;
		}
		return false;
	} else {
		return false;
	}
};

const calculateGrade = (studentAnswers, answers) => {
	const totalPoints = answers.reduce((sum, answer) => sum + answer.points, 0);
	let correctPoints = 0;
	for (let i = 0; i < studentAnswers.length; i++) {
		const studentAnswer = studentAnswers[i];
		if (studentAnswer.correct) correctPoints += studentAnswer.points;
	}
	const grade = (correctPoints / totalPoints) * 100;
	return grade;
};

const publish = (deliverableUuid) =>
	new Promise((resolve, reject) => {
		db.Deliverable.update(
			{ published: true },
			{
				where: {
					uuid: deliverableUuid,
				},
			}
		)
			.then(resolve)
			.catch(reject);
	});

const getStudentReport = (studentUuid, classroomUuid) =>
	new Promise(async (resolve, reject) => {
		try {
			const student = await userController.getByUuid(studentUuid);
			const deliverables = await getAll(classroomUuid);
			const result = [];
			for (let i = 0; i < deliverables.length; i++) {
				const deliverable = deliverables[i].dataValues;
				const attempt = await attemptController.getStudentAttempt(
					studentUuid,
					deliverable.uuid
				);
				deliverable.attempt = attempt ? attempt.dataValues : {};
				deliverable.attempted = !!attempt;
				result.push(deliverable);
			}
			resolve({ student, deliverables: result });
		} catch (error) {
			reject(error);
		}
	});

module.exports = {
	add,
	getAll,
	getByUuid,
	checkAnswer,
	calculateGrade,
	publish,
	getStudentReport,
};
