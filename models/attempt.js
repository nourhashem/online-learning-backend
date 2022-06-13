'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Attempt extends Model {
		static associate(models) {
			// define association here
			Attempt.deliverable = models.Deliverable.hasMany(models.Attempt, {
				foreignKey: {
					name: 'deliverableUuid',
					type: DataTypes.UUID,
				},
				as: 'attempts',
			});
			models.Attempt.belongsTo(models.Deliverable, {
				foreignKey: {
					name: 'deliverableUuid',
				},
				as: 'deliverable',
			});

			Attempt.student = models.User.hasMany(models.Attempt, {
				foreignKey: {
					name: 'studentUuid',
					type: DataTypes.UUID,
				},
				as: 'attempts',
			});
			models.Attempt.belongsTo(models.User, {
				foreignKey: {
					name: 'studentUuid',
				},
				as: 'student',
			});

			Attempt.questions = models.Attempt.hasMany(models.Question, {
				foreignKey: {
					name: 'attemptUuid',
					type: DataTypes.UUID,
				},
				as: 'questions',
			});
			models.Question.belongsTo(models.Attempt, {
				foreignKey: {
					name: 'attemptUuid',
				},
				as: 'attempt',
			});
		}
	}

	Attempt.init(
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			grade: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'Attempt',
		}
	);

	return Attempt;
};
