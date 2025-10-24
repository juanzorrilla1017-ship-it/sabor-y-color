const carrito = document.getElementById('carrito');
const elementos1 = document.getElementById('lista-1');

const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

let carritoArticulo = [];
//Esto es para que se abra la ventana modal
const modalOverlay = document.getElementById('modal-overlay');
//Esto es para que se cierre la ventana modal
const modalCloseBtn = document.getElementById('modal-content');
cargarEventListeners();
function cargarEventListeners() {
    elementos1.addEventListener("click", comprarElemento);
    carrito.addEventListener("click", eliminarElemento);
    vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
    //Agregar el funcionamiento de la información de los productos
    //document.body.addEventListener('click', mostrarInfo); 
    //En pocas palabras al hacer click se va abrir una ventana con la información del
    //producto seleccionado.
    //Ahora vamos agregar la x para cerrar la ventana
    modalCloseBtn.addEventListener('click', cerrarModal);
    modalOverlay.addEventListener('click', (e) => {
        //Si el usuario hace click fuera del modal, se cierra
        if (e.target === modalOverlay) {
            cerrarModal();
        }
    });
    //Local storage
    //Esto guarda la información del carrito en el local storage
    document.addEventListener('DOMContentLoaded', () => {
        carritoArticulo = JSON.parse(localStorage.getItem('carrito')) || [];
        dibujarCarrito();
    });
}

function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
   }  
}    
function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: elemento.querySelector('.precio').textContent,
        id: elemento.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    const existe = carritoArticulo.some(elemento => elemento.id === infoElemento.id);
    if (existe){
       //Si el elemento ya existe en el carrito, solo se actualiza la cantidad
        carritoArticulo = carritoArticulo.map(elemento => {
            if (elemento.id === infoElemento.id) {
                elemento.cantidad++; //Aumenta la cantidad en 1 cada vez 
                // que se agrega el mismo elemento
                return elemento; //Retorna el objeto actualizado
            } else {
                return elemento; //Retorna los objetos que no son duplicados
            }
        });
    } else{
        carritoArticulo.push(infoElemento);
    }
    dibujarCarrito();
}

function insertCarrito(elemento) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <img src="${elemento.imagen}" width=100>
        </td>
        <td>
            ${elemento.titulo}
        </td>
        <td>
            ${elemento.precio}
        </td>
        <td>
            <a href="#" class="borrar-elemento" data-id="${elemento.id}">X</a>
        </td>
    `;
    lista.appendChild(row);
}

function eliminarElemento(e) {  
    e.preventDefault();
    let elemento,
        elementoId;
    if (e.target.classList.contains('borrar-elemento')) {
        e.target.parentElement.parentElement.remove();
        elemento = e.target.parentElement.parentElement;
        elementoId = elemento.querySelector('a').getAttribute('data-id');

        carritoArticulo = carritoArticulo.filter(elemento => elemento.id !== elementoId);
        dibujarCarrito();
    }
}
function vaciarCarrito() {
    limpiarCarrito();
    carritoArticulo = [];
}

function limpiarCarrito() {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    return false;
}

function dibujarCarrito() {
    limpiarCarrito();

    carritoArticulo.forEach(elemento => {
        const { imagen, titulo, precio, cantidad, id } = elemento;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${elemento.imagen}" width=100>
            </td>
            <td>
                ${elemento.titulo}
            </td>
            <td>
                ${elemento.precio}
            </td>
            <td>
                <a href="#" class="borrar-elemento" data-id="${elemento.id}">X</a>
            </td>
        `;
        lista.appendChild(row);
    });
    guardareEnStorage();
}

function guardareEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carritoArticulo));
}