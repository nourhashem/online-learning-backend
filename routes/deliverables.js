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
	const deliverableUuid = req.params.deliverableUuid;
	res.send({ post: jsonPost });
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
