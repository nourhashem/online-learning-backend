var express = require('express');
var router = express.Router();
var deliverableController = require('../controllers/deliverable');
var attemptController = require('../controllers/attempt');
const { authToken } = require('../utils/jwt');

router.get('/', authToken, async (req, res, next) => {
	const classroomUuid = req.query.classroomUuid;
	const deliverables = await deliverableController.getAll(classroomUuid);
	const deliverablesJSON = [];
	for (let i = 0; i < deliverables.length; i++) {
		const deliverableJSON = deliverables[i].dataValues;
		deliverablesJSON.push(deliverableJSON);
	}
	const response = await Promise.all(
		deliverablesJSON.map(async (d) => ({
			...d,
			attempted: await attemptController.exists(req.userUuid, d.uuid),
			grade: await attemptController.getStudentGrade(
				req.userUuid,
				d.uuid
			),
			questions: d.questions.map((q) => ({
				...q.dataValues,
				answer: '',
				choices: JSON.parse(q.dataValues.choices),
			})),
		}))
	);
	res.send({ deliverables: response });
});

router.post('/', authToken, async (req, res, next) => {
	try {
		const deliverableObj = {
			classroomUuid: req.body.classroomUuid,
			questions: req.body.data.questions.map((q) => ({
				...q,
				choices: JSON.stringify(q.choices),
				answer: JSON.stringify(q.answer),
				correct: true,
			})),
			published: false,
			...req.body.data.metadata,
		};
		console.log(deliverableObj);
		await deliverableController.add(deliverableObj);
		res.send({ message: 'success' });
	} catch (error) {
		res.send({ error });
	}
});

router.post('/publish', authToken, async (req, res, next) => {
	try {
		const { deliverableUuid } = req.body;
		await deliverableController.publish(deliverableUuid);
		res.send({ message: 'success' });
	} catch (error) {
		res.send({ error });
	}
});

router.get('/report', authToken, async (req, res, next) => {
	try {
		const { studentUuid, classroomUuid } = req.query;
		const report = await deliverableController.getStudentReport(
			studentUuid,
			classroomUuid
		);
		res.send(report);
	} catch (error) {
		res.send({ error });
	}
});

router.get('/:deliverableUuid', authToken, async (req, res, next) => {
	const answers = req.query.answers === 'true';
	const deliverableUuid = req.params.deliverableUuid;
	const deliverable = await deliverableController.getByUuid(deliverableUuid);
	let deliverableData = deliverable.dataValues;
	if (!answers) {
		const questions = deliverableData.questions.map((q) => {
			const { answer, choices, correct, attemptUuid, ...withoutAnswer } =
				q.dataValues;
			return { ...withoutAnswer, choices: JSON.parse(choices) };
		});
		deliverableData = {
			...deliverableData,
			questions,
		};
	} else {
		const questions = deliverableData.questions.map((q) => {
			const { answer, choices, correct, attemptUuid, ...withoutAnswer } =
				q.dataValues;
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

module.exports = router;
