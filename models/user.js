'use strict';
const { Model } = require('sequelize');
const hashPassword = require('../utils/password').hashPassword;
const uuid = require('uuid');
const { USER_ROLES } = require('../utils/constants');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.studentClassrooms = models.User.belongsToMany(models.Classroom, {
        through: 'students_classrooms',
        foreignKey: 'studentUuid',
        as: 'studentClassrooms',
      });
    }
    toJson() {
      return {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
      };
    }
  }

  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [Object.values(USER_ROLES)],
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidPassword(value) {
            if (value.length < 8) {
              throw new Error('Password is too short');
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  User.beforeCreate(async (user, options) => {
    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;
  });

  return User;
};
