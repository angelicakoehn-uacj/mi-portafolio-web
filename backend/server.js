const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// procesar JSON y permitir solicitudes del Frontend
app.use(cors());
app.use(express.json());


// Render en la nube o localhost en pc
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:MOGa8149@localhost:5432/portafolio_db',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Crear la tabla "contactos" 
pool.query(`
    CREATE TABLE IF NOT EXISTS contactos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        mensaje TEXT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`)
.then(() => console.log('✅ Tabla "contactos" lista en PostgreSQL'))
.catch(err => console.error('❌ Error al verificar/crear la tabla:', err));


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