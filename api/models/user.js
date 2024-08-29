const { DataTypes } = require('sequelize');
const Character = require('./character');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: false // Si vous n'avez pas de colonnes `updated_at`, sinon mettre `true`
});

User.hasMany(Character, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

User.sync();

module.exports = User;