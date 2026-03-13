const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const noteRoutes = require('../routes/notes');
const Note = require('../models/Note');

let mongoServer;
const app = express();
app.use(express.json());
app.use('/api/notes', noteRoutes);

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

afterEach(async () => {
    await Note.deleteMany();
});

describe('Notes API', () => {
    describe('POST /api/notes', () => {
        it('should create a new note', async () => {
            const res = await request(app)
                .post('/api/notes')
                .send({
                    title: 'Test Note',
                    content: 'This is a test content',
                    category: 'Work'
                });
            
            expect(res.statusCode).toEqual(201);
            expect(res.body.data).toHaveProperty('title', 'Test Note');
        });

        it('should fail if title is missing', async () => {
            const res = await request(app)
                .post('/api/notes')
                .send({
                    content: 'Missing title'
                });
            
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('GET /api/notes', () => {
        it('should fetch all notes', async () => {
            await Note.create({ title: 'Note 1', content: 'Content 1' });
            await Note.create({ title: 'Note 2', content: 'Content 2' });

            const res = await request(app).get('/api/notes');
            
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body.data)).toBeTruthy();
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/notes/:id', () => {
        it('should fetch a note by id', async () => {
            const note = await Note.create({ title: 'Note 1', content: 'Content 1' });
            const res = await request(app).get(`/api/notes/${note._id}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveProperty('title', 'Note 1');
        });

        it('should return 404 if note not found', async () => {
            const res = await request(app).get('/api/notes/507f1f77bcf86cd799439011');
            
            expect(res.statusCode).toEqual(404);
        });
    }               
    );
});

describe('PUT /api/notes/:id', () => {      
    it('should update a note', async () => {
        const note = await Note.create({ title: 'Note 1', content: 'Content 1' });
        const res = await request(app)
            .put(`/api/notes/${note._id}`)
            .send({ title: 'Updated Note' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('title', 'Updated Note');
    });

    it('should return 404 if note not found', async () => {
        const res = await request(app)
            .put('/api/notes/507f1f77bcf86cd799439011')
            .send({ title: 'Updated Note' });

        expect(res.statusCode).toEqual(404);
    });
});

describe('DELETE /api/notes/:id', () => {
    it('should delete a note', async () => {
        const note = await Note.create({ title: 'Note 1', content: 'Content 1' });
        const res = await request(app).delete(`/api/notes/${note._id}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Note deleted successfully');
    });

    it('should return 404 if note not found', async () => {
        const res = await request(app).delete('/api/notes/507f1f77bcf86cd799439011');

        expect(res.statusCode).toEqual(404);
    });
});
            