const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Middlewares para procesar JSON y permitir solicitudes del Frontend
app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'portafolio_db',
    password: 'MOGa8149', // CONTRASEÑA EN POSTGRESQL
    port: 5432,
});

// Endpoint GET: Obtener la lista de proyectos desde PostgreSQL
app.get('/api/proyectos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM proyectos');
        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint POST: Guardar mensajes del formulario de contacto en PostgreSQL
app.post('/api/contacto', async (req, res) => {
    const { nombre, email, mensaje } = req.body;
    try {
        await pool.query(
            'INSERT INTO contactos (nombre, email, mensaje) VALUES ($1, $2, $3)',
            [nombre, email, mensaje]
        );
        res.status(201).json({ respuesta: 'Mensaje guardado con éxito' });
    } catch (error) {
        console.error('Error al guardar mensaje:', error);
        res.status(500).json({ error: 'No se pudo guardar el mensaje' });
    }
});

// Iniciar servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Backend con PostgreSQL corriendo en http://localhost:${PORT}`);
});