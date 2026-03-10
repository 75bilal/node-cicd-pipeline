const express = require('express');
const router = express.Router();
const {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote
} = require('../controllers/noteController');

// @route   POST /api/notes
// @desc    Create a new note
router.post('/', createNote);

// @route   GET /api/notes
// @desc    Get all notes
router.get('/', getNotes);

// @route   GET /api/notes/:id
// @desc    Get a single note
router.get('/:id', getNote);

// @route   PUT /api/notes/:id
// @desc    Update a note
router.put('/:id', updateNote);

// @route   DELETE /api/notes/:id
// @desc    Delete a note
router.delete('/:id', deleteNote);

module.exports = router;