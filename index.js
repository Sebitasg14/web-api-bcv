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
    const swapCurrency = document.getElementById('swap-currency');
    const tableConvertions = document.querySelector('.rates-table');
    const sourceItems = document.querySelectorAll('.source-item')
    console.log(
        'BolívarBase: Interface Loaded. Ready for logic implementation.'
    );

    let isSwapped = false;
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
            resultSection();
            printConvertions();
        } else {
            console.error(
                'No se pudo obtener la tasa de conversión. Verifica tu conexión o la API.'
            );
        }
    }

    async function obtenerPrecioDolares() {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 15000);
            const response = await fetch('/api/api', {
                signal: controller.signal
            });
            if (!response.ok)
                throw new Error(`Error al obtener datos: ${response.status}`);
            const data = await response.json();
            clearTimeout(id);
            conversionRate = data;
            return true;
        } catch (error) {
            console.error('Error al obtener el precio de los dólares:', error);
            return false;
        }
    }
    //Lista debajo de conversion
    function resultSection(source = 'Dolar') {
        let priceUsdOficial = conversionRate.find((cotizacion) => cotizacion.nombre === source)?.valor;
        let priceUsdParalelo = conversionRate.find((cotizacion) => cotizacion.nombre === 'Paralelo')?.valor;
        
        if (conversionRate) {
            if (source === 'Dolar') {
                showConversionLabel.textContent = `Tasa de conversión: 1 USD = ${priceUsdOficial.toFixed(2)} Bs`;
            } else if (source === 'Paralelo') {
                showConversionLabel.textContent = `Tasa de conversión: 1 USD = ${priceUsdParalelo.toFixed(2)} Bs`;
            } else if (source === 'Euro') {
                showConversionLabel.textContent = `Tasa de conversión: 1 EUR = ${priceUsdOficial.toFixed(2)} Bs`;
            } 
        }
    }

    function swapButton() {
        if (amountInputFrom.value === ''){
            isSwapped = !isSwapped;
            updatePlaceholders()
        }
    }

    let sourceSwap = 'Dolar'

    swapCurrency.addEventListener('click', () => {
        swapButton()
    });

    function updatePlaceholders(){
        if (isSwapped) {
            if (sourceSwap === 'Dolar' || sourceSwap === 'Paralelo') {
                amountInputFrom.placeholder =
                    'Ingresa la cantidad en bolivares';
                amountInputTo.placeholder = 'Recibes esta cantidad en dolares';
                showConversionAmount.textContent = '... USD';
            } else if (sourceSwap === 'Euro') {
                amountInputFrom.placeholder =
                    'Ingresa la cantidad en bolivares';
                amountInputTo.placeholder = 'Recibes esta cantidad en euros';
                showConversionAmount.textContent = '... EUR';
            }
        } else {
            if (sourceSwap === 'Dolar' || sourceSwap === 'Paralelo') {
                amountInputFrom.placeholder = 'Ingresa la cantidad en dolares';
                amountInputTo.placeholder =
                    'Recibes esta cantidad en bolivares';
                showConversionAmount.textContent = '... Bs';
            } else if (sourceSwap === 'Euro') {
                amountInputFrom.placeholder = 'Ingresa la cantidad en euros';
                amountInputTo.placeholder =
                    'Recibes esta cantidad en bolivares';
                showConversionAmount.textContent = '... Bs';
            }
        }
    }

    sourceItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            if (e.target !== undefined){
                const source = e.target.dataset.source;
                sourceItems.forEach((i) => i.classList.remove('active'));
                e.target.classList.add('active');
                resultSection(source);
                convertCurrency(0, source);
                sourceSwap = source
                updatePlaceholders()
                amountInputFrom.value = '';
                amountInputTo.value = '';
            } else {
                sourceItems[0].classList.add('active');
                resultSection();
                convertCurrency();
                updatePlaceholders()
            }
        });
    });

    function convertCurrency(value = 0, source = 'Dolar') {
        if (amountInputFrom.value === '') {
            showConversionAmount.textContent = '...';
            amountInputTo.value = '';
            return;
        }
        if (isNaN(value) || conversionRate === null) {
            showConversionAmount.textContent =
                'Ingrese un monto válido y asegúrese de que la tasa de conversión esté disponible.';
            return;
        }
        let amount = 0
        const priceUsdOficial = conversionRate.find((cotizacion) => cotizacion.nombre === 'Dolar')?.valor;
        const priceUsdEuro = conversionRate.find((cotizacion) => cotizacion.nombre === 'Euro')?.valor;
        const priceUsdParalelo = conversionRate.find((cotizacion) => cotizacion.nombre === 'Paralelo')?.valor;
        const swappedConversionTextTrue = source === 'Dolar' || source === 'Paralelo' ? 'USD' : 'EUR';
        
        if (source === 'Dolar'){
            amount = priceUsdOficial;
        } else if (source === 'Paralelo') {
            amount = priceUsdParalelo;
        } else if (source === 'Euro'){
            amount = priceUsdEuro;
        }

        if (!isSwapped) {
            const convertedAmount = value * amount
            showConversionAmount.textContent = `${convertedAmount.toFixed(2)} Bs`;
            amountInputTo.value = `${convertedAmount.toFixed(2)}`;
        } else {
            const convertedAmount = value / amount
            showConversionAmount.textContent = `${convertedAmount.toFixed(2)},${swappedConversionTextTrue}`;
            amountInputTo.value = `${convertedAmount.toFixed(2)}`;
        }
    }

    amountInputFrom.addEventListener('input', (e) => {
        let dataset = null
        sourceItems.forEach((item) => {
            if (item.classList.contains('active')){
                dataset = item.dataset.source;
            }
        })
        const valor = parseFloat(e.target.value);
        convertCurrency(valor, dataset);
    });

    function printConvertions() {
        tableConvertions.innerHTML = '';
        conversionRate.forEach((e) => {
            const tr = document.createElement('tr');
            tr.classList.add('rate-row');
            let classTrend = e.valor > e.valorAnterior ? 'up' : 'down';
            let porcentage = e.valorAnterior
                ? ((e.valor - e.valorAnterior) / e.valorAnterior) * 100
                : 0;
            const setNameText = e.fuente === 'paralelo' ? e.nombre + ' ' + e.moneda : e.nombre + ' BCV'
            tr.innerHTML = `
                <td>
                    <div class="source-info">
                        <div class="source-icon">${e.fuente[0].toUpperCase()}</div>
                        <div class="source-name">${setNameText}</div>
                    </div>
                </td>
                <td>
                    <span class="rate-value">${e.valor.toFixed(2)} <small>Bs</small></span>
                    <span class="trend ${classTrend}"><i class="fas fa-caret-${classTrend}"></i> ${Math.abs(porcentage).toFixed(2)}%</span>
                </td>
            `;
            tableConvertions.appendChild(tr);
        });
    }

    initProcess();
});
