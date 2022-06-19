var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
var classroomController = require('../controllers/classroom');
const { USER_ROLES } = require('../utils/constants');
var comparePassword = require('../utils/password').comparePassword;
const jwtUtils = require('../utils/jwt');

router.get('/', jwtUtils.authToken, async (req, res, next) => {
	users = await userController.getAll();
	res.send({ users });
});

router.post('/signup', async (req, res, next) => {
	try {
		const user = await userController.add({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
			role: USER_ROLES.STUDENT,
		});
		const token = jwtUtils.generateToken(user.uuid);
		res.send({ message: 'success', jwt: token });
	} catch (error) {
		res.send({ error });
	}
});

router.post('/signin', async (req, res, next) => {
	try {
		console.log('start');
		const user = await userController.getByEmail(req.body.email);
		console.log({ user });
		if (!user) {
			return res.send({
				message: 'User does not exist',
				authenticated: false,
			});
		}
		const isValid = await comparePassword(req.body.password, user.password);
		if (isValid) {
			const token = jwtUtils.generateToken(user.uuid);
			return res.send({
				message: 'success',
				authenticated: true,
				user: user.toJSON(),
				jwt: token,
			});
		} else {
			return res.send({
				message: 'Incorrect password',
				authenticated: false,
			});
		}
	} catch (error) {
		return res.send({ error });
	}
});

router.get('/classroom', jwtUtils.authToken, async (req, res, next) => {
	const classroomUuid = req.query.classroomUuid;
	let response = {};
	await classroomController.getByUuid(classroomUuid).then((res) => {
		const instructor = res.instructor.dataValues;
		const instructorJson = {
			name: `${instructor.firstName} ${instructor.lastName}`,
			uuid: instructor.uuid,
		};
		const studentsJson = [];
		for (let i = 0; i < res.students.length; i++) {
			const student = res.students[i].dataValues;
			studentsJson.push({
				name: `${student.firstName} ${student.lastName}`,
				uuid: student.uuid,
			});
		}
		console.log(instructorJson);
		console.log(studentsJson);
		response = {
			instructor: instructorJson,
			students: studentsJson,
		};
	});
	res.send(response);
});

module.exports = router;
