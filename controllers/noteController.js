const Note = require('../models/Note');

// @desc    Create a new note
// @route   POST /api/notes
// @access  Public
const createNote = async (req, res, next) => {
    try {
        const { title, content, category, isPinned } = req.body;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                error: 'Please provide title and content'
            });
        }

        const note = await Note.create({
            title,
            content,
            category: category || 'General',
            isPinned: isPinned || false
        });

        res.status(201).json({
            success: true,
            data: note
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
const getNotes = async (req, res, next) => {
    try {
        const { category, pinned, sort } = req.query;
        
        // Build filter object
        let filter = {};
        if (category && category !== 'All') {
            filter.category = category;
        }
        if (pinned === 'true') {
            filter.isPinned = true;
        }

        // Build sort object
        let sortBy = {};
        if (sort === 'oldest') {
            sortBy.createdAt = 1;
        } else if (sort === 'updated') {
            sortBy.updatedAt = -1;
        } else {
            sortBy.createdAt = -1; // default: newest first
        }

        const notes = await Note.find(filter).sort(sortBy);

        res.status(200).json({
            success: true,
            count: notes.length,
            data: notes
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Public
const getNote = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                success: false,
                error: 'Note not found'
            });
        }

        res.status(200).json({
            success: true,
            data: note
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Public
const updateNote = async (req, res, next) => {
    try {
        const { title, content, category, isPinned } = req.body;
        
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                success: false,
                error: 'Note not found'
            });
        }

        // Update fields
        note.title = title || note.title;
        note.content = content || note.content;
        note.category = category || note.category;
        note.isPinned = isPinned !== undefined ? isPinned : note.isPinned;
        
        await note.save();

        res.status(200).json({
            success: true,
            data: note
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Public
const deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                success: false,
                error: 'Note not found'
            });
        }

        await note.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Note deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote
};