// Array

let tiposDeDolar = [
    {dolar:"oficial", precio:365.5},
    {dolar:"blue", precio:730},
    {dolar:"tarjeta", precio:639.62},
    {dolar:"turista", precio:659.93},
]


// Funciones

function formatearNumero(numero) {
    return numero.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS'
    });
}

function impuestoPais(precio) {
    let impuestoP=precio*0.30
    return impuestoP
}

function retencionPais(precio) {
    let retencionP=precio*0.45
    return retencionP
}

function obtenerCantidadYPrecio() {
    const cantidad = parseFloat(document.getElementById("CantidadDolares").value);
    const tipoDolar = document.getElementById("TipoDolar").value;
    const precioDolar = tiposDeDolar.find(item => item.dolar === tipoDolar).precio;
    const precioDolarFormateado = formatearNumero(precioDolar);
    const cantidadFormateada = formatearNumero(cantidad);

    return { cantidad, cantidadFormateada, tipoDolar, precioDolar, precioDolarFormateado };
}

function CalcularConImpuestos() {
    const { cantidad, precioDolar } = obtenerCantidadYPrecio();
    const totalImpuestos = (cantidad + impuestoPais(cantidad) + retencionPais(cantidad)) * precioDolar;
    return totalImpuestos;
}

function CalcularSinImpuestos() {
    const { cantidad, precioDolar } = obtenerCantidadYPrecio();
    const totalSinImpuestos = cantidad * precioDolar;
    return totalSinImpuestos;
}

// Compra de dólares

const ComprarDolares = document.getElementById("calcular");

ComprarDolares.addEventListener("click", (e) => {
    e.preventDefault();
    const impuestos = document.getElementById("AplicarImpuestos");
    const { cantidad, precioDolar, precioDolarFormateado, tipoDolar } = obtenerCantidadYPrecio();
        // Verificar si la cantidad es un número válido
        if (isNaN(cantidad) || cantidad <= 0) {
            const resultadoSection = document.querySelector(".resultado");
            const resultadoElement = document.createElement("h2");
            resultadoSection.innerHTML = ''; // Limpia cualquier contenido anterior
            resultadoElement.innerHTML = `<div class="p-3 border border-2 border-info border rounded-end">
                                            <p class="fw-bold">Ingrese un número válido.</p></div>`;
            resultadoSection.appendChild(resultadoElement)
            return; // Salir de la función si no es un número válido
        }
    if (impuestos.checked) {
        Total = CalcularConImpuestos();
        const impuestoPaisValue = impuestoPais(cantidad * precioDolar);
        const retencionValue = retencionPais(cantidad * precioDolar);
        const valorSinImpuestos = Total - impuestoPaisValue - retencionValue;
        const TotalFormateado = formatearNumero(Total);
        const impuestoPaisValueFormateado = formatearNumero(impuestoPaisValue);
        const retencionValueFormateado = formatearNumero(retencionValue);
        const valorSinImpuestosFormateado = formatearNumero(valorSinImpuestos);
        const resultadoSection = document.querySelector(".resultado");
        const resultadoElement = document.createElement("h2");
        resultadoElement.innerHTML = `<div class="p-3 border border-2 border-info border rounded-end">
                                        <div>Precio del Dólar ${tipoDolar}: ${precioDolarFormateado}</div>
                                        <div class="my-2 fw-bold">Total sin impuestos: ${valorSinImpuestosFormateado}</div>
                                        <div class="my-2">Impuesto País: ${impuestoPaisValueFormateado}</div>
                                        <div class="my-2 pb-2 border-bottom border-black">Retención: ${retencionValueFormateado}</div>
                                        <div class="my-2 fw-bold">Total: ${TotalFormateado}</div>
                                        </div>`;
        resultadoSection.innerHTML = '';
        resultadoSection.appendChild(resultadoElement);
    } else {
        Total = CalcularSinImpuestos();
        const resultadoSection = document.querySelector(".resultado");
        const resultadoElement = document.createElement("h2");
        const TotalFormateado = formatearNumero(Total);
        resultadoElement.innerHTML = `<div class="p-3 border border-2 border-info border rounded-end">Total sin impuestos: ${TotalFormateado}</div>`;
        resultadoSection.innerHTML = '';
        resultadoSection.appendChild(resultadoElement);
    }
    const resultadoGuardar = document.querySelector(".guardar");
    resultadoGuardar.innerHTML = `<button class="btn btn-success">Guardar este cálculo</button>`
    
    
});

// JSON Y LOCALSTORAGE

let Favoritos = [];

function obtenerEstadoCheckbox() {
    return document.getElementById("AplicarImpuestos").checked;
}

const resultadoGuardar = document.querySelector(".guardar");
const resultadosAnteriores = document.querySelector(".resultadosAnteriores");
const listaResultados = document.querySelector(".lista-resultados");

resultadoGuardar.addEventListener("click", (e) => {
    e.preventDefault();
    const { cantidad, cantidadFormateada, tipoDolar, precioDolarFormateado } = obtenerCantidadYPrecio();
    const estadoCheckbox = obtenerEstadoCheckbox();
    
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("No se pueden guardar resultados en 0");
    } else {
        const Total = estadoCheckbox ? CalcularConImpuestos() : CalcularSinImpuestos(); // Calcular el total
        const TotalFormateado = formatearNumero(Total); // Formatear el total
        const resultado = {
            cantidad: cantidadFormateada,
            tipoDolar,
            precioDolar: precioDolarFormateado,
            fecha: new Date().toLocaleString(),
            checkbox: estadoCheckbox, // Guarda el estado de la casilla de verificación
            total: TotalFormateado
        };
        Favoritos.push(resultado);
        localStorage.setItem("favoritos", JSON.stringify(Favoritos));
        console.log("Se ha guardado el resultado:", resultado);
        
        // Actualizar la lista de resultados
        const listItem = document.createElement("li");
        const tituloResultados = document.querySelector(".resultadosAnteriores");
        tituloResultados.innerHTML = `<h2>Cálculos Anteriores</h2>`
        listItem.innerHTML = `
            <p class="fw-bold"><strong>Cálculo ${Favoritos.length}: Dolar ${resultado.tipoDolar}</strong></p>
            <p>Cantidad: ${resultado.cantidad}</p>
            <p>Precio del Dólar: ${resultado.precioDolar}</p>
            <p>Impuestos aplicados: ${resultado.checkbox ? 'Sí' : 'No'}</p> <!-- Muestra el estado de la casilla de verificación -->
            <p class="fw-bold">Total: ${resultado.total}</p>
            <p>Fecha: ${resultado.fecha}</p>
        `;
        listaResultados.appendChild(listItem);
    }
});