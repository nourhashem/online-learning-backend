'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.owner = models.User.hasMany(models.Post, {
        foreignKey: {
          name: 'ownerUuid',
          type: DataTypes.UUID,
        },
        as: 'posts',
      });
      models.Post.belongsTo(models.User, {
        foreignKey: {
          name: 'ownerUuid',
        },
        as: 'owner',
      });

      Post.classroom = models.Classroom.hasMany(models.Post, {
        foreignKey: {
          name: 'classroomUuid',
          type: DataTypes.UUID,
        },
        as: 'posts',
      });
      models.Post.belongsTo(models.Classroom, {
        foreignKey: {
          name: 'classroomUuid',
        },
        as: 'classroom',
      });
    }
    toJson() {
      return {
        title: this.title,
        body: this.body,
        date: this.date,
        uuid: this.uuid,
      };
    }
  }

  Post.init(
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
      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Post',
    }
  );

  return Post;
};
