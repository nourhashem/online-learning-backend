'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Deliverable extends Model {
		static associate(models) {
			// define association here
			Deliverable.classroom = models.Classroom.hasMany(
				models.Deliverable,
				{
					foreignKey: {
						name: 'classroomUuid',
						type: DataTypes.UUID,
					},
					as: 'deliverables',
				}
			);
			models.Deliverable.belongsTo(models.Classroom, {
				foreignKey: {
					name: 'classroomUuid',
				},
				as: 'classroom',
			});
		}
	}

	Deliverable.init(
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			activationDate: {
				type: DataTypes.BIGINT,
				allowNull: false,
			},
			activationTime: {
				type: DataTypes.BIGINT,
				allowNull: false,
			},
			endTime: {
				type: DataTypes.BIGINT,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'Deliverable',
		}
	);

	return Deliverable;
};
