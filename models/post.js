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
          as: 'owner',
          type: DataTypes.UUID,
        },
      });
      models.Post.belongsTo(models.User, {
        foreignKey: 'ownerUuid',
        as: 'owner',
      });

      Post.classroom = models.Classroom.hasMany(models.Post, {
        foreignKey: {
          name: 'classroomUuid',
          as: 'classroom',
          type: DataTypes.UUID,
        },
      });
      models.Post.belongsTo(models.Classroom, {
        foreignKey: 'classroomUuid',
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
