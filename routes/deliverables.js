var express = require('express');
var router = express.Router();
var deliverableController = require('../controllers/deliverable');
// var attemptController = require('../controllers/attempt');
const { authToken } = require('../utils/jwt');

router.get('/', authToken, async (req, res, next) => {
	const classroomUuid = req.query.classroomUuid;
	const deliverables = await deliverableController.getAll(classroomUuid);
	const deliverablesJSON = [];
	for (let i = 0; i < deliverables.length; i++) {
		const deliverableJSON = deliverables[i].dataValues;
		deliverablesJSON.push(deliverableJSON);
	}
	const response = deliverablesJSON.map((d) => ({
		...d,
		questions: d.questions.map((q) => ({
			...q.dataValues,
			answer: '',
			choices: JSON.parse(q.dataValues.choices),
		})),
	}));
	res.send({ deliverables: response });
});

router.get('/:deliverableUuid', authToken, async (req, res, next) => {
	const answers = req.query.answers === 'true';
	const deliverableUuid = req.params.deliverableUuid;
	const deliverable = await deliverableController.getByUuid(deliverableUuid);
	let deliverableData = deliverable.dataValues;
	if (!answers) {
		const questions = deliverableData.questions.map((q) => {
			const { answer, choices, ...withoutAnswer } = q.dataValues;
			return { ...withoutAnswer, choices: JSON.parse(choices) };
		});
		deliverableData = {
			...deliverableData,
			questions,
		};
	} else {
		const questions = deliverableData.questions.map((q) => {
			const { answer, choices, ...withoutAnswer } = q.dataValues;
			return {
				...withoutAnswer,
				answer: JSON.parse(answer),
				choices: JSON.parse(choices),
			};
		});
		deliverableData = {
			...deliverableData,
			questions,
		};
	}
	res.send({ deliverable: deliverableData });
});

router.post('/', authToken, async (req, res, next) => {
	try {
		const deliverableObj = {
			classroomUuid: req.body.classroomUuid,
			questions: req.body.data.questions.map((q) => ({
				...q,
				choices: JSON.stringify(q.choices),
				answer: JSON.stringify(q.answer),
			})),
			...req.body.data.metadata,
		};
		console.log(deliverableObj);
		await deliverableController.add(deliverableObj);
		res.send({ message: 'success' });
	} catch (error) {
		res.send({ error });
	}
});

router.post('/submit', authToken, async (req, res, next) => {
	// @TODO create Attempt model
});

module.exports = router;
