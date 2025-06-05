const db = require('../config/db'); // Assuming db.js exports a query function or pool

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private (to be implemented)
exports.getAllClients = async (req, res) => {
    try {
        // TODO: Add pagination, filtering, sorting options from req.query
        // For now, selecting a subset of columns for brevity in list view.
        // Consider selecting all columns '*' if the frontend needs all data immediately,
        // or create a separate detailed endpoint.
        const { rows } = await db.query('SELECT client_id, first_name, last_name, phone_number, email, city, state, is_active FROM Clients ORDER BY last_name, first_name');
        res.json(rows);
    } catch (error) {
        console.error('Error in getAllClients:', error.message);
        res.status(500).json({ message: 'Server error while fetching clients.' });
    }
};

// @desc    Get a single client by ID
// @route   GET /api/clients/:id
// @access  Private
exports.getClientById = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query('SELECT * FROM Clients WHERE client_id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Client not found.' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(`Error in getClientById for ID ${id}:`, error.message);
        res.status(500).json({ message: 'Server error while fetching client.' });
    }
};

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private
exports.createClient = async (req, res) => {
    const {
        first_name, last_name, address_line1, address_line2, city, state, zip_code,
        phone_number, email, preferred_language, date_of_birth,
        emergency_contact_name, emergency_contact_phone, special_instructions
    } = req.body;

    // Basic validation: Check for required fields (as per DB schema NOT NULL constraints)
    if (!first_name || !last_name || !address_line1 || !city || !state || !zip_code) {
        return res.status(400).json({ message: 'Missing required fields: first_name, last_name, address_line1, city, state, zip_code are required.' });
    }

    try {
        const queryText = `
            INSERT INTO Clients (
                first_name, last_name, address_line1, address_line2, city, state, zip_code,
                phone_number, email, preferred_language, date_of_birth,
                emergency_contact_name, emergency_contact_phone, special_instructions,
                is_active, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *;
        `;
        const values = [
            first_name, last_name, address_line1, address_line2, city, state, zip_code,
            phone_number, email, preferred_language, date_of_birth,
            emergency_contact_name, emergency_contact_phone, special_instructions
        ];
        const { rows } = await db.query(queryText, values);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error in createClient:', error.message);
        // Consider more specific error handling, e.g., for unique constraint violations
        if (error.code === '23505') { // Unique violation (e.g. email if it were unique)
             return res.status(409).json({ message: 'Client with this identifier already exists.', detail: error.detail });
        }
        res.status(500).json({ message: 'Server error while creating client.' });
    }
};

// @desc    Update a client by ID
// @route   PUT /api/clients/:id
// @access  Private
exports.updateClient = async (req, res) => {
    const { id } = req.params;
    const {
        first_name, last_name, address_line1, address_line2, city, state, zip_code,
        phone_number, email, preferred_language, date_of_birth,
        emergency_contact_name, emergency_contact_phone, special_instructions, is_active
    } = req.body;

    // Basic validation: Check for required fields if they are being updated
    if (first_name === '' || last_name === '' || address_line1 === '' || city === '' || state === '' || zip_code === '') {
        return res.status(400).json({ message: 'Required fields cannot be empty if provided for update.' });
    }
    if (typeof is_active !== 'boolean' && is_active !== undefined) {
        return res.status(400).json({ message: 'is_active must be a boolean value.' });
    }

    try {
        // Fetch current client data to only update provided fields (Partial Update - PATCH like behavior)
        // For a strict PUT, you might require all fields or set unspecified ones to null.
        // This example demonstrates a more flexible update.
        const currentClientResult = await db.query('SELECT * FROM Clients WHERE client_id = $1', [id]);
        if (currentClientResult.rows.length === 0) {
            return res.status(404).json({ message: 'Client not found for update.' });
        }
        const currentClient = currentClientResult.rows[0];

        const queryText = `
            UPDATE Clients
            SET
                first_name = $1,
                last_name = $2,
                address_line1 = $3,
                address_line2 = $4,
                city = $5,
                state = $6,
                zip_code = $7,
                phone_number = $8,
                email = $9,
                preferred_language = $10,
                date_of_birth = $11,
                emergency_contact_name = $12,
                emergency_contact_phone = $13,
                special_instructions = $14,
                is_active = $15,
                updated_at = CURRENT_TIMESTAMP
            WHERE client_id = $16
            RETURNING *;
        `;
        const values = [
            first_name !== undefined ? first_name : currentClient.first_name,
            last_name !== undefined ? last_name : currentClient.last_name,
            address_line1 !== undefined ? address_line1 : currentClient.address_line1,
            address_line2 !== undefined ? address_line2 : currentClient.address_line2,
            city !== undefined ? city : currentClient.city,
            state !== undefined ? state : currentClient.state,
            zip_code !== undefined ? zip_code : currentClient.zip_code,
            phone_number !== undefined ? phone_number : currentClient.phone_number,
            email !== undefined ? email : currentClient.email,
            preferred_language !== undefined ? preferred_language : currentClient.preferred_language,
            date_of_birth !== undefined ? date_of_birth : currentClient.date_of_birth,
            emergency_contact_name !== undefined ? emergency_contact_name : currentClient.emergency_contact_name,
            emergency_contact_phone !== undefined ? emergency_contact_phone : currentClient.emergency_contact_phone,
            special_instructions !== undefined ? special_instructions : currentClient.special_instructions,
            is_active !== undefined ? is_active : currentClient.is_active,
            id
        ];
        
        const { rows } = await db.query(queryText, values);
        res.json(rows[0]);
    } catch (error) {
        console.error(`Error in updateClient for ID ${id}:`, error.message);
        res.status(500).json({ message: 'Server error while updating client.' });
    }
};

// @desc    Delete a client by ID (soft delete or hard delete)
// @route   DELETE /api/clients/:id
// @access  Private
exports.deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        // Soft delete: Set is_active to FALSE
        const { rows } = await db.query(
            'UPDATE Clients SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE client_id = $1 RETURNING client_id, first_name, last_name, is_active',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Client not found for deletion.' });
        }
        
        res.json({ message: `Client '${rows[0].first_name} ${rows[0].last_name}' (ID: ${id}) has been marked as inactive.`, client: rows[0] });
    } catch (error) {
        console.error(`Error in deleteClient for ID ${id}:`, error.message);
        res.status(500).json({ message: 'Server error while deleting client.' });
    }
};

// TODO: Implement functions for client notes and documents
// exports.getClientNotes = async (req, res) => { ... };
// exports.addClientNote = async (req, res) => { ... };
// exports.uploadClientDocument = async (req, res) => { ... }; // This will involve file handling (e.g., multer)