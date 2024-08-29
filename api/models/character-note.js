const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CharacterNote = sequelize.define('CharacterNote', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ''
  },
  characterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'characters',
      key: 'id',
      onDelete: 'CASCADE'
    }
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['characterId', 'name']
    }
  ],
  tableName: 'character-notes',
  timestamps: false // Si vous n'avez pas de colonnes `updated_at`, sinon mettre `true`
});

CharacterNote.sync(); 

module.exports = CharacterNote;