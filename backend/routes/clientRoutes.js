const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// GET all clients
router.get('/', clientController.getAllClients);

// GET a single client by ID
router.get('/:id', clientController.getClientById);

// POST (create) a new client
router.post('/', clientController.createClient);

// PUT (update) a client by ID
router.put('/:id', clientController.updateClient);

// DELETE a client by ID
router.delete('/:id', clientController.deleteClient);

// TODO: Add routes for client notes and documents if they are managed via separate endpoints
// Example:
// router.get('/:clientId/notes', clientController.getClientNotes);
// router.post('/:clientId/notes', clientController.addClientNote);
// router.post('/:clientId/documents', clientController.uploadClientDocument);


module.exports = router;