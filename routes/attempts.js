var express = require('express');
var router = express.Router();
var deliverableController = require('../controllers/deliverable');
var attemptController = require('../controllers/attempt');
const { authToken } = require('../utils/jwt');
const { v4: uuidv4 } = require('uuid');

router.get('/', authToken, async (req, res, next) => {
	const deliverableUuid = req.query.deliverableUuid;
	const attempts = await attemptController.getAll(deliverableUuid);
	const attemptsJSON = [];
	for (let i = 0; i < attempts.length; i++) {
		const attemptJSON = attempts[i].dataValues;
		attemptsJSON.push(attemptJSON);
	}
	const response = attemptsJSON.map((attempt) => ({
		...attempt,
		questions: attempt.questions.map((question) => ({
			...question.dataValues,
			answer: JSON.parse(question.dataValues.answer),
			choices: JSON.parse(question.dataValues.choices),
		})),
	}));
	res.send({ attempts: response });
});

router.get('/student', authToken, async (req, res, next) => {
	console.log('test route');
	const { deliverableUuid, studentUuid } = req.query;
	console.log('/student', deliverableUuid, studentUuid);
	const attempt = await attemptController.getStudentAttempt(
		studentUuid,
		deliverableUuid
	);
	console.log('my_attempt', attempt);
	if (attempt) {
		const attemptData = {
			...attempt.dataValues,
			questions: attempt.dataValues.questions.map((q) => {
				const { answer, choices, ...withoutAnswer } = q.dataValues;
				return {
					...withoutAnswer,
					answer: JSON.parse(answer),
					choices: JSON.parse(choices),
				};
			}),
		};
		return res.send({ attempt: attemptData });
	}
	return res.send({ error: 'attempt not found' });
});

router.post('/', authToken, async (req, res, next) => {
	try {
		const deliverableUuid = req.body.deliverableUuid;
		const deliverable = await deliverableController.getByUuid(
			deliverableUuid
		);
		const questions = deliverable.dataValues.questions.map((q) => ({
			...q.dataValues,
			choices: JSON.parse(q.dataValues.choices),
			answer: JSON.parse(q.dataValues.answer),
		}));
		const attemptUuid = uuidv4();
		const answers = req.body.data.filter(Boolean).map((a) => ({
			...a,
			uuid: uuidv4(),
			attemptUuid,
			deliverableUuid: null,
			choices: JSON.stringify(a.choices),
			answer: JSON.stringify(a.answer),
			correct: deliverableController.checkAnswer(a, questions),
		}));
		const attemptObj = {
			uuid: attemptUuid,
			deliverableUuid,
			studentUuid: req.userUuid,
			questions: answers,
			grade: deliverableController.calculateGrade(answers, questions),
		};
		await attemptController.add(attemptObj);
		res.send({ message: 'success' });
	} catch (error) {
		res.send({ error });
	}
});

module.exports = router;
