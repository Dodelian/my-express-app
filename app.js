// app.js
const express = require('express');
const sqlite3 = require('sqlite3');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

// Conexiune la baza de date SQLite
const db = new sqlite3.Database('utilizatori.db');

// Configurare Express pentru utilizarea EJS și a fișierelor statice
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Creare tabela "utilizatori" dacă nu există deja
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS utilizatori (id INTEGER PRIMARY KEY, nume TEXT, email TEXT)');
});

// Ruta pentru afișarea paginii principale
app.get('/', (req, res) => {
    // Interogare pentru a obține toți utilizatorii din baza de date
    db.all('SELECT * FROM utilizatori', (err, utilizatori) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Eroare la interogarea bazei de date.');
        }
        res.render('main', { utilizatori });
    });
});

// Ruta pentru afișarea paginii de adăugare utilizator
app.get('/adauga', (req, res) => {
    res.render('add');
});

// Ruta pentru adăugarea unui utilizator
app.post('/utilizatori', (req, res) => {
    const { nume, email } = req.body;

    // Inserare utilizator nou în baza de date
    db.run('INSERT INTO utilizatori (nume, email) VALUES (?, ?)', [nume, email], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Eroare la adăugarea în baza de date.');
        }
        res.redirect('/');
    });
});

// Ruta pentru afișarea paginii de editare utilizator
app.get('/utilizatori/:id/editare', (req, res) => {
    const userId = req.params.id;

    // Interogare pentru a obține detalii despre utilizator
    db.get('SELECT * FROM utilizatori WHERE id = ?', userId, (err, utilizator) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Eroare la interogarea bazei de date.');
        }
        res.render('edit', { utilizator });
    });
});

// Ruta pentru actualizarea unui utilizator
app.post('/utilizatori/:id/actualizeaza', (req, res) => {
    const userId = req.params.id;
    const { nume, email } = req.body;

    // Actualizare utilizator în baza de date
    db.run('UPDATE utilizatori SET nume = ?, email = ? WHERE id = ?', [nume, email, userId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Eroare la actualizarea în baza de date.');
        }
        res.redirect('/');
    });
});

// Ruta pentru afișarea paginii de vizualizare utilizator
app.get('/utilizatori/:id', (req, res) => {
    const userId = req.params.id;

    // Interogare pentru a obține detalii despre utilizator
    db.get('SELECT * FROM utilizatori WHERE id = ?', userId, (err, utilizator) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Eroare la interogarea bazei de date.');
        }
        res.render('view', { utilizator });
    });
});

// Ruta pentru ștergerea unui utilizator
app.get('/utilizatori/:id/sterge', (req, res) => {
    const userId = req.params.id;

    // Ștergere utilizator din baza de date
    db.run('DELETE FROM utilizatori WHERE id = ?', userId, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Eroare la ștergerea din baza de date.');
        }
        res.redirect('/');
    });
});

// Pornirea serverului
app.listen(port, () => {
    console.log(`Serverul rulează la adresa http://localhost:${port}`);
});
