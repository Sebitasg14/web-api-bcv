/**
 * BolívarBase | Digital Ledger Logic
 * Este archivo está reservado para la lógica de la aplicación.
 * El usuario se encargará de implementar la lógica para practicar.
 */


document.addEventListener('DOMContentLoaded', () => {
    console.log(
        'BolívarBase: Interface Loaded. Ready for logic implementation.'
    );

    // --- Lógica de Menú Mobile ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            // Cambiar icono del botón (bars vs times)
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Cerrar menú al hacer click en un link (para scroll fluido)
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // --- Lógica de Conversión (Para que el usuario implemente) ---
    // Aquí puedes añadir tus escuchadores de eventos y lógica de conversión

    async function obtenerPrecioDolares() {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 15000);
            const response = await fetch('/api/api');
            if (!response.ok)
                throw new Error(`Error al obtener datos: ${response.status}`);
            clearTimeout(id);
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error al obtener el precio de los dólares:', error);
        }
    }

    obtenerPrecioDolares();
});
