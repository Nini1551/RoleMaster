const e = require('express');
const Character = require('../models/character');
const CharacterNote = require('../models/character-note');

const createCharacter = async (req, res) => {
    try {
        const { name } = req.body;
        const data = {
            name,
            userId: req.session.userId
        };

        const character = await Character.create(data);

        if (character) {
            return res.status(201).send(character);
        } else {
            return res.status(409).send("This character already");
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Serveur Error')
    }
};

const getCharacters = async (req, res) => {
    try {
        const characters = await Character.findAll({
            where: {
                userId: req.session.userId
            },
            attributes: ['id', 'name']
        });

        if (characters) {
            return res.status(200).send(characters);
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Serveur Error')
    }
};

const getCharacter = async (req, res) => {
    try {
        const id = parseInt(req.params['id']);
        const character = await Character.findOne({
            where: {
                id
            },
            attributes: ['id', 'name']
        });

        if (character) {
            return res.status(200).send(character);
        } else {
            return res.status(404).send('Character not found');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Serveur Error')
    }
};

const deleteCharacter = async (req, res) => {
    try {
      console.log(req.params['id']);
        const id = parseInt(req.params['id']);

        const character = await Character.findOne({
            where: {
                id
            }
        });

        if (character) {
            await character.destroy();
            return res.status(200).send({message: 'Character deleted'});
        } else {
            return res.status(404).send('Character not found');
        }
      } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Serveur Error')
      };
};

const getCharacterNotes = async (req, res) => {
    try {
        const characterId = parseInt(req.params['id']);
        const characterNotes = await CharacterNote.findAll({
            where: {
                characterId
            },
            attributes: ['id', 'name', 'note']
        });

        if (characterNotes) {
            return res.status(200).send(characterNotes);
        } else {
            return res.status(404).send('Character notes not found');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Serveur Error')
    }
};

const createCharacterNote = async (req, res) => {
    try {
        const characterId = parseInt(req.params['id']);
        console.log(characterId);
        console.log(req.body);
        const { name, note } = req.body;
        const data = {
            name: name,
            note: note,
            characterId: characterId
        };

        const characterNote = await CharacterNote.create(data);

        if (characterNote) {
            return res.status(201).send(characterNote);
        } else {
            return res.status(409).send('This character note already exists');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Serveur Error')
    }
};

const deleteCharacterNote = async (req, res) => {
    try {
        const characterId = parseInt(req.params['id']);
        const id = parseInt(req.params['noteId']);

        const characterNote = await CharacterNote.findOne({
            where: {
                id,
                characterId
            }       
        });

        if (characterNote) {
            await characterNote.destroy();
            return res.status(200).send({message: 'Character note deleted'});
        } else {
            return res.status(404).send('Character note not found');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Serveur Error')
    }
};

module.exports = {
    createCharacter,
    getCharacters,
    deleteCharacter,
    getCharacter,
    getCharacterNotes,
    createCharacterNote,
    deleteCharacterNote
};