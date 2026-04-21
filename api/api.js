// api/bcv.js
// Bun carga automáticamente el archivo .env, no se necesita dotenv

export default async function handler(req, res) {
    const API_URL = process.env.URL_API;
    const API_KEY = process.env.VITE_API_KEY;


    try {
        const respuesta = await fetch(`${API_URL}/v1/cotizaciones-all`, {
            headers: { 'x-api-key': API_KEY }
        });

        const datos = await respuesta.json();

        res.status(200).json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
