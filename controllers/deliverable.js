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

const checkAnswer = (studentAnswer, answers) => {
	const myAnswer = answers.find((a) => a.uuid === studentAnswer.uuid);
	if (myAnswer) {
		const answer = { ...myAnswer, answer: JSON.parse(myAnswer.answer) };
		if (answer.type === 'multiple') {
			let correct = true;
			for (let j = 0; j < choices.length; j++) {
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
	console.log('calculateGrade');
	const numTotal = answers.length;
	let numCorrect = 0;
	for (let i = 0; i < studentAnswers.length; i++) {
		const studentAnswer = studentAnswers[i];
		if (studentAnswer.correct) numCorrect += 1;
	}
	const grade = (numCorrect / numTotal) * 100;
	console.log({ numTotal, numCorrect, grade });
	return grade;
};

module.exports = {
	add,
	getAll,
	getByUuid,
	checkAnswer,
	calculateGrade,
};
