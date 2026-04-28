const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lilistore'
});

const JWT_SECRET = 'secret123.';

// Registo de utilizadores
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    //res.json({ success: true });
    //First, check if the email already exists in the database
    pool.query('SELECT * FROM Users WHERE Email = ?', [email], async (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Erro ao verificar o utilizador', error: error.message });
        }

        if (results.length > 0) {
            // Email already exists, send an error response
            return res.status(409).json({ message: 'Email já existente. Por favor, use outro email.' });
        }

        //Email does not exist, proceed with registration
        const hashedPassword = await bcrypt.hash(password, 10);
        pool.query('INSERT INTO Users (Email, Password) VALUES (?, ?)', [email, hashedPassword], (error) => {
            if (error) {
                return res.status(500).json({ message: 'Erro ao registar novo utilizador', error: error.message });
            }
            res.status(201).json({ message: 'Utilizador registado com sucesso' });
        });
    });
});

// Login de utilizadores 
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    pool.query('SELECT * FROM Users WHERE Email = ?', [email], async (error, results) => {
        if (error || results.length === 0) {
            return res.status(401).json({ message: 'Password ou Email inválidos' });
        }

        const user = results[0];
        const passwordValid = await bcrypt.compare(password, user.Password);

        if (!passwordValid) {
            return res.status(401).json({ message: 'Password ou Email inválidos' });
        }
        const token = jwt.sign({ userId: user.UserID, isAdmin: user.IsAdmin }, JWT_SECRET, { expiresIn: '5m' });
        res.cookie('session_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
        res.status(200).json({ token, isAdmin: user.IsAdmin });
    });
});




const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('SIGINT', () => {
    pool.end((err) => {
        if (err) {
            console.error('Failed to close MySQL pool connections', err);
        } else {
            console.log('MySQL pool closed');
            process.exit(0);
        }
    });
});