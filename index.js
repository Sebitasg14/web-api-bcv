/**
 * BolívarBase | Digital Ledger Logic
 * Este archivo está reservado para la lógica de la aplicación.
 * El usuario se encargará de implementar la lógica para practicar.
 */


document.addEventListener('DOMContentLoaded', () => {
    const amountInputFrom = document.getElementById('amount-from');
    const amountInputTo = document.getElementById('amount-to');
    const showConversionLabel = document.querySelector('.result-label');
    const showConversionAmount = document.querySelector('.result-amount');
    const tableConvertions = document.querySelector('.rates-table')
    console.log(
        'BolívarBase: Interface Loaded. Ready for logic implementation.'
    );

    let conversionRate = null; // Aquí se almacenará la tasa de conversión obtenida

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
    
    async function initProcess() {
        const success = await obtenerPrecioDolares();
        if (success) {
            resultSection()
            printConvertions()
        } else {
            console.error('No se pudo obtener la tasa de conversión. Verifica tu conexión o la API.');
        }
    }
    
    async function obtenerPrecioDolares() {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 15000);
            const response = await fetch('/api/api');
            if (!response.ok)
                throw new Error(`Error al obtener datos: ${response.status}`);
            clearTimeout(id);
            const data = await response.json();
            conversionRate = data
            return true
        } catch (error) {
            console.error('Error al obtener el precio de los dólares:', error);
        }
    }
    //Lista debajo de conversion
    function resultSection(){
        let priceUsdOficial = conversionRate.find((cotizacion) => cotizacion.fuente === 'oficial')?.valor;
        if (conversionRate) {
            showConversionLabel.textContent = `Tasa de conversión: 1 USD = ${priceUsdOficial} VES`;
        }
    }
    
    function convertCurrency(value){
        if (amountInputFrom.value === '') {
            showConversionAmount.textContent = '...'
            return
        }
        if (isNaN(value) || conversionRate === null) {
            showConversionAmount.textContent = 'Ingrese un monto válido y asegúrese de que la tasa de conversión esté disponible.';
            return;
        }
        const convertedAmount = value * conversionRate.find((cotizacion) => cotizacion.fuente === 'oficial')?.valor;
        showConversionAmount.textContent = `${convertedAmount.toFixed(2)} Bs`;
        amountInputTo.value = `${convertedAmount.toFixed(2)}`;
    }

    amountInputFrom.addEventListener('input', (e) => {
        const valor = parseFloat(e.target.value)
        convertCurrency(valor)
    })
    
    function printConvertions(){
        tableConvertions.innerHTML = ''
        conversionRate.forEach((e) => {
            const tr = document.createElement('tr')
            tr.classList.add('rate-row')
            let classTrend = e.valor > e.valorAnterior ? 'up' : 'down'
            let porcentage = ((e.valor - e.valorAnterior) / e.valorAnterior) * 100
            tr.innerHTML = `
                <td>
                    <div class="source-info">
                        <div class="source-icon">${e.fuente[0].toUpperCase()}</div>
                        <div class="source-name">${e.nombre}</div>
                    </div>
                </td>
                <td>
                    <span class="rate-value">${e.valor.toFixed(2)} <small>Bs</small></span>
                    <span class="trend ${classTrend}"><i class="fas fa-caret-${classTrend}"></i> ${Math.abs(porcentage).toFixed(2)}%</span>
                </td>
            `;
            tableConvertions.appendChild(tr)
        })
    }

    initProcess();
    
});
