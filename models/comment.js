'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.owner = models.User.hasMany(models.Comment, {
        foreignKey: {
          name: 'ownerUuid',
          type: DataTypes.UUID,
        },
        as: 'comments',
      });
      models.Comment.belongsTo(models.User, {
        foreignKey: {
          name: 'ownerUuid',
        },
        as: 'owner',
      });

      Comment.post = models.Post.hasMany(models.Comment, {
        foreignKey: {
          name: 'postUuid',
          type: DataTypes.UUID,
        },
        as: 'comments',
      });
      models.Comment.belongsTo(models.Post, {
        foreignKey: {
          name: 'postUuid',
        },
        as: 'post',
      });
    }
  }

  Comment.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  );

  return Comment;
};
