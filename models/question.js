'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Question extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Question.deliverable = models.Deliverable.hasMany(models.Question, {
				foreignKey: {
					name: 'deliverableUuid',
					type: DataTypes.UUID,
				},
				as: 'questions',
			});
			models.Question.belongsTo(models.Deliverable, {
				foreignKey: {
					name: 'deliverableUuid',
				},
				as: 'deliverable',
			});
		}
	}

	Question.init(
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			question: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			choices: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			answer: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			correct: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
			},
			points: {
				type: DataTypes.DOUBLE,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'Question',
		}
	);

	return Question;
};
