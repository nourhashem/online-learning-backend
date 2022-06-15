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

router.get('/:attemptUuid', authToken, async (req, res, next) => {
  const attemptUuid = req.params.attemptUuid;
  const attempt = await attemptController.getByUuid(attemptUuid);
  const attemptData = {
    ...attempt.dataValues,
    questions: attemptData.questions.map((q) => {
      const { answer, choices, ...withoutAnswer } = q.dataValues;
      return {
        ...withoutAnswer,
        answer: JSON.parse(answer),
        choices: JSON.parse(choices),
      };
    }),
  };
  res.send({ attempt: attemptData });
});

router.post('/', authToken, async (req, res, next) => {
  try {
    console.log('my_request');
    const deliverableUuid = req.body.deliverableUuid;
    const deliverable = await deliverableController.getByUuid(deliverableUuid);
    const questions = deliverable.dataValues.questions.map((q) => ({
      ...q.dataValues,
      choices: JSON.parse(q.dataValues.choices),
      answer: JSON.parse(q.dataValues.answer),
    }));
    console.log('my_questions', questions);
    console.log('my_data', req.body.data);
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
    console.log('my_answers', answers);
    const attemptObj = {
      uuid: attemptUuid,
      deliverableUuid,
      studentUuid: req.userUuid,
      questions: answers,
      grade: deliverableController.calculateGrade(answers, questions),
    };
    console.log('my_attempt', attemptObj);
    await attemptController.add(attemptObj);
    res.send({ message: 'success' });
  } catch (error) {
    res.send({ error });
  }
});

module.exports = router;
