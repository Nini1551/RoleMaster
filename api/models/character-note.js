const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CharacterNote = sequelize.define('CharacterNote', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  characterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'characters',
      key: 'id',
      onDelete: 'CASCADE'
    }
  }
}, {
  tableName: 'character-notes',
  timestamps: false // Si vous n'avez pas de colonnes `updated_at`, sinon mettre `true`
});

CharacterNote.sync(); 

module.exports = CharacterNote;