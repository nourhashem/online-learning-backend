'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.owner = models.User.hasMany(models.Message, {
        foreignKey: {
          name: 'ownerUuid',
          type: DataTypes.UUID,
        },
        as: 'messages',
      });
      models.Message.belongsTo(models.User, {
        foreignKey: {
          name: 'ownerUuid',
        },
        as: 'owner',
      });

      Message.classroom = models.Classroom.hasMany(models.Message, {
        foreignKey: {
          name: 'classroomUuid',
          type: DataTypes.UUID,
        },
        as: 'messages',
      });
      models.Message.belongsTo(models.Classroom, {
        foreignKey: {
          name: 'classroomUuid',
        },
        as: 'classroom',
      });
    }
  }

  Message.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Message',
    }
  );

  return Message;
};
