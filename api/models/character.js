const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Character = sequelize.define('Character', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
      onDelete: 'CASCADE'
    }
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'name']
    }
  ],
  tableName: 'characters',
  timestamps: false // Si vous n'avez pas de colonnes `updated_at`, sinon mettre `true`
});

Character.sync();

module.exports = Character;