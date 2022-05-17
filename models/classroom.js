'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Classroom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Classroom.students = models.Classroom.belongsToMany(models.User, {
        through: 'students_classrooms',
        foreignKey: 'classroomUuid',
        as: 'students',
      });

      Classroom.instructor = models.User.hasMany(models.Classroom, {
        foreignKey: {
          name: 'instructorUuid',
          type: DataTypes.UUID,
        },
        as: 'instructorClassrooms',
      });
      models.Classroom.belongsTo(models.User, {
        foreignKey: {
          name: 'instructorUuid',
        },
        as: 'instructor',
      });
    }
    toJson() {
      return {
        title: this.title,
        code: this.code,
        semester: this.semester,
        instructor: this.instructor,
        section: this.section,
        campus: this.campus,
        schedule: this.schedule,
        uuid: this.uuid,
      };
    }
  }

  Classroom.init(
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
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      semester: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      schedule: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      section: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      campus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Classroom',
    }
  );

  Classroom.beforeCreate(async (classroom, options) => {});

  return Classroom;
};
