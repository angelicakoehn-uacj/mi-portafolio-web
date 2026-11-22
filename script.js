// ==========================================
// 1. MODO OSCURO CON LOCAL STORAGE
// ==========================================
const btnTheme = document.getElementById('btn-theme');

// Comprobar si ya se tenía el modo oscuro guardado previamente
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (btnTheme) btnTheme.textContent = '☀️ Modo Claro';
}

// Evento al hacer clic en el botón de tema
if (btnTheme) {
    btnTheme.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            btnTheme.textContent = '☀️ Modo Claro';
            localStorage.setItem('theme', 'dark'); // Guardar preferencia
        } else {
            btnTheme.textContent = '🌙 Modo Oscuro';
            localStorage.setItem('theme', 'light'); // Guardar preferencia
        }
    });
}

// ==========================================
// 2. ENVIAR FORMULARIO A POSTGRESQL (BACKEND)
// ==========================================
const formulario = document.querySelector('form');

if (formulario) {
    formulario.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que la página se recargue

        const datos = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            mensaje: document.getElementById('mensaje').value.trim()
        };

        // Validar que los campos no estén vacíos
        if (datos.nombre === '' || datos.email === '' || datos.mensaje === '') {
            alert('Por favor, completa todos los campos del formulario.');
            return;
        }

        try {
            // Enviar petición HTTP POST al backend Node.js
            const respuesta = await fetch('https://backend-portafolio-qtuu.onrender.com/api/contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (respuesta.ok) {
                alert(`¡Gracias por tu mensaje, ${datos.nombre}! Se ha guardado correctamente en la base de datos PostgreSQL.`);
                formulario.reset();
            } else {
                alert('Hubo un error en el servidor al intentar guardar tu mensaje.');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            alert('No se pudo conectar con el servidor backend en https://backend-portafolio-qtuu.onrender.com.');
        }
    });
}

// ==========================================
// 3. CARGAR PROYECTOS DESDE POSTGRESQL
// ==========================================
async function cargarProyectos() {
    const contenedorProyectos = document.getElementById('proyectos');
    if (!contenedorProyectos) return;

    try {
        const respuesta = await fetch('https://backend-portafolio-qtuu.onrender.com/api/proyectos');
        const proyectos = await respuesta.json();

        // Mantener el título h2 y limpiar elementos anteriores
        const titulo = contenedorProyectos.querySelector('h2');
        contenedorProyectos.innerHTML = '';
        if (titulo) contenedorProyectos.appendChild(titulo);

        // Renderizar proyectos cargados dinámicamente desde la base de datos
        proyectos.forEach(proy => {
            const article = document.createElement('article');
            article.innerHTML = `
                <h3>${proy.titulo}</h3>
                <p>${proy.descripcion}</p>
                <p><a href="${proy.link_github}" target="_blank" rel="noopener">Ver código en GitHub</a></p>
            `;
            contenedorProyectos.appendChild(article);
        });
    } catch (error) {
        console.error('Error al cargar proyectos:', error);
    }
}

// Cargar proyectos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarProyectos);
// ==========================================
// MENÚ HAMBURGUESA (MÓVIL)
// ==========================================
const btnHamburger = document.getElementById('btn-hamburger');
const navLinks = document.getElementById('nav-links');

if (btnHamburger && navLinks) {
    btnHamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}