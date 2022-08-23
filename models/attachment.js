'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attachment.post = models.Post.hasMany(models.Attachment, {
        foreignKey: {
          name: 'postUuid',
          type: DataTypes.UUID,
        },
        as: 'attachments',
      });
      models.Attachment.belongsTo(models.Post, {
        foreignKey: {
          name: 'postUuid',
        },
        as: 'post',
      });
    }
  }

  Attachment.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      originalName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fileSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Attachment',
    }
  );

  return Attachment;
};
