const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config'); 
const Assignment = sequelize.define('assignments', {
    id : {
    type : DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      readOnly: true,
      primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        readOnly: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        readOnly: true,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Name cannot be an empty string.',
              },
          },
    },
    points : {
        type: DataTypes.INTEGER,
        readOnly: true,
        allowNull: false,
        validate: {
            isInt: {
                args: true,
                msg: 'Points must be an integer.',
              },
            notEmpty: {
                args: true,
                msg: 'Points cannot be an empty',
              },
            min: {
              args:1,
              msg : 'points hsould be in 1 and 100'
            },
            max: {
              args:100,
              msg : 'points should be in 1 and 100'
            },
          },
    },
    num_of_attempts : {
        type: DataTypes.INTEGER,
        readOnly: true,
        allowNull: false,
        validate: {
            isInt: {
                args: true,
                msg: 'Num of attempts must be an integer.',
              },
            notEmpty: {
                args: true,
                msg: 'Num_of_attempts cannot be an empty',
              },
            min: {
              args:1,
              msg:"Num_of_attempts should be in between 1 & 100"
            },
            max: {
              args:100,
              msg:"Num_of_attempts should be in between 1 & 100"
            },
            
          },
    },
    deadline:{
        type:DataTypes.DATE,
        readOnly: true,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Deadline cannot be an empty',
              },
            isDate: {
              args: true,
              msg: 'Invalid date format.Please use format (e.g., "2016-08-29T09:12:33.001Z").',
            },
          },
    },
   },
{
    createdAt: 'assignment_created',
  updatedAt: 'assignment_updated'
}
);

module.exports={Assignment};