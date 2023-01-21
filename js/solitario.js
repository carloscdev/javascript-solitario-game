// Tipos de Cartas
let palos = ["viu", "cua", "hex", "cir"];

// Lista de números
let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// let numeros = [9, 10, 11, 12];

// Tapetes
const tapeteInicial   = document.getElementById("inicial");
const tapeteSobrantes = document.getElementById("sobrantes");
const tapeteReceptor1 = document.getElementById("receptor1");
const tapeteReceptor2 = document.getElementById("receptor2");
const tapeteReceptor3 = document.getElementById("receptor3");
const tapeteReceptor4 = document.getElementById("receptor4");

// Mazos
let mazo = {
	inicial: [],
	sobrantes: [],
	receptor1: [],
	receptor2: [],
	receptor3: [],
	receptor4: []
}

// Body
const body = document.querySelector('body')

// Contadores de cartas
const contInicial     = document.getElementById("contador_inicial");
const contSobrantes   = document.getElementById("contador_sobrantes");
const contReceptor1   = document.getElementById("contador_receptor1");
const contReceptor2   = document.getElementById("contador_receptor2");
const contReceptor3   = document.getElementById("contador_receptor3");
const contReceptor4   = document.getElementById("contador_receptor4");
const contMovimientos = document.getElementById("contador_movimientos");

// Modal con los resultados
const modalContenedor = document.getElementById("result");
const modalTiempo = document.getElementById("tiempo-total")
const modalMovimiento = document.getElementById("movimiento-total")

// Tiempo
const contTiempo  = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos 	 = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador
let cronometro = ""; // almacena el cronómetro

// Movimientos
let movimientos = -1;

// Botones
const reiniciar = document.getElementById("reset");
const barajar = document.getElementById("sort");
const modalReiniciar = document.getElementById("again");

// Asignación de funciones
reiniciar.onclick = reiniciarJuego;
modalReiniciar.onclick = reiniciarJuego;
barajar.onclick = barajarInicialSobrantes;

tapeteSobrantes.addEventListener("dragover", permitirDrop, false);
tapeteSobrantes.addEventListener("drop", drop, false);
tapeteSobrantes.addEventListener("dragenter", dragEntra, false);
tapeteSobrantes.addEventListener("dragleave", dragSale, false);

tapeteReceptor1.addEventListener("dragover", permitirDrop, false);
tapeteReceptor1.addEventListener("drop", drop, false);
tapeteReceptor1.addEventListener("dragenter", dragEntra, false);
tapeteReceptor1.addEventListener("dragleave", dragSale, false);

tapeteReceptor2.addEventListener("dragover", permitirDrop, false);
tapeteReceptor2.addEventListener("drop", drop, false);
tapeteReceptor2.addEventListener("dragenter", dragEntra, false);
tapeteReceptor2.addEventListener("dragleave", dragSale, false);

tapeteReceptor3.addEventListener("dragover", permitirDrop, false);
tapeteReceptor3.addEventListener("drop", drop, false);
tapeteReceptor3.addEventListener("dragenter", dragEntra, false);
tapeteReceptor3.addEventListener("dragleave", dragSale, false);

tapeteReceptor4.addEventListener("dragover", permitirDrop, false);
tapeteReceptor4.addEventListener("drop", drop, false);
tapeteReceptor4.addEventListener("dragenter", dragEntra, false);
tapeteReceptor4.addEventListener("dragleave", dragSale, false);

// Inicia el Juego
function comenzarJuego() {
	barajarMazoInicial();
	inicializarContador()
	arrancarTiempo();

}
comenzarJuego();

// Inicializa el cronómetro
function arrancarTiempo(){
	const hms = () => {
		let seg = Math.trunc( segundos % 60 );
		let min = Math.trunc( (segundos % 3600) / 60 );
		let hor = Math.trunc( (segundos % 86400) / 3600 );
		let tiempo = ( (hor<10)? "0"+hor : ""+hor )
			+ ":" + ( (min<10)? "0"+min : ""+min )
			+ ":" + ( (seg<10)? "0"+seg : ""+seg );
		setContador(contTiempo, tiempo);
		cronometro = tiempo;
		segundos++;
	}
	segundos = 0;
	hms();
	temporizador = setInterval(hms, 1000);
}

// Configura el mazo inicial con los valores de las cartas y números
function barajarMazoInicial() {
	for (let numero of numeros) {
		for (let palo of palos) {
			mazo['inicial'].push(`${numero}-${palo}`);
		}
	}
	mazo['inicial'] = barajarMazo(mazo['inicial']);
	for (let item of mazo['inicial']) {
		cargarTapete(tapeteInicial, item);
	}
}

// Crea elementos el el DOM con las imágenes según el array
function cargarTapete(componente, mazo) {
	const cartaMazo = document.createElement('img');
	cartaMazo.src = `../imagenes/baraja/${mazo}.png`;
	cartaMazo.setAttribute('class', 'cartaMazo');
	cartaMazo.setAttribute('id', mazo);
	cartaMazo.setAttribute('draggable', 'true');
	cartaMazo.setAttribute('alt', mazo);
	cartaMazo.addEventListener("dragstart", dragInicio);
	cartaMazo.addEventListener("dragend", dragFin);
	componente.appendChild(cartaMazo);
}

// Función para modificar el contador
function setContador(contador, valor) {
	contador.innerHTML = valor;
}

// Barajar todas las cartas de TapeteInicial y TapeteSobrantes
function barajarInicialSobrantes() {
	let nuevaBaraja = [...mazo['inicial'], ...mazo['sobrantes']];
	mazo['inicial'] = barajarMazo(nuevaBaraja);
	mazo['sobrantes'] = [];
	const inicialHijos = document.querySelectorAll('#inicial img');
	const sobrantesHijos = document.querySelectorAll('#sobrantes img');
	inicialHijos.forEach(item => item.remove())
	sobrantesHijos.forEach(item => item.remove())
	for (let item of mazo['inicial']) {
		cargarTapete(tapeteInicial, item);
	}
	inicializarContador();
}

// Barajar las cartas de un mazo
function barajarMazo(lista) {
	for (let i = lista.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[lista[i], lista[j]] = [lista[j], lista[i]];
	}
	return lista;
}

// Reiniciar el juego
function reiniciarJuego() {
	modalContenedor.classList.add('hidden');
	const listaCartaMazo = document.querySelectorAll('.cartaMazo');
	listaCartaMazo.forEach(item => item.remove())
	mazo['inicial'] = [];
	mazo['sobrantes'] = [];
	mazo['receptor1'] = [];
	mazo['receptor2'] = [];
	mazo['receptor3'] = [];
	mazo['receptor4'] = [];
	movimientos = -1;
	clearInterval(temporizador);
	comenzarJuego();
}

// Actualiza el contador de cartas por tapete y el contador de movimientos
function inicializarContador() {
	setContador(contMovimientos, ++movimientos);
	setContador(contInicial, mazo['inicial'].length);
	setContador(contSobrantes, mazo['sobrantes'].length);
	setContador(contReceptor1, mazo['receptor1'].length);
	setContador(contReceptor2, mazo['receptor2'].length);
	setContador(contReceptor3, mazo['receptor3'].length);
	setContador(contReceptor4, mazo['receptor4'].length);
}

// Muestra una alerta con la información del usuario y reinicia el juego
function finalizarJuego() {
	modalTiempo.innerHTML = cronometro;
	modalMovimiento.innerHTML = movimientos;
	modalContenedor.classList.remove('hidden');
}

// Se ejecuta cuando se arrastra una carta para enviar el ID de la carta y el padre contenedor
function dragInicio(ev) {
	ev.dataTransfer.setData("tapeteActual", document.getElementById(ev.target.id).parentElement.id)
	ev.dataTransfer.setData("cartaActual",ev.target.id);
	setTimeout(() => body.setAttribute("class", "block-event"), 100)
}

// Se ejecuta cuando se suelta la carta dentro de otro tapete y realiza una validación
function drop(ev) {
	ev.preventDefault();
	let tapeteActual = ev.target;
	const tapeteAnterior = ev.dataTransfer.getData('tapeteActual')
	const cartaActual = ev.dataTransfer.getData('cartaActual').split('/').at(-1).replace('.png', '');
	const valorCarta = cartaActual.split('-');
	const numero = Number(valorCarta[0]);
	const color = valorCarta[1];
	let error = false;
	if (tapeteActual.id === 'sobrantes') {
		mazo['sobrantes'].push(cartaActual);
	} else {
		if (mazo[tapeteActual.id].length > 0) {
			const valorPrevio = mazo[tapeteActual.id].at(-1).split('-')
			if (!validarPorColor(valorPrevio[1], color) || !validarPorNumero(Number(valorPrevio[0]), numero)) {
				error = true;
			} else {
				mazo[tapeteActual.id].push(cartaActual);
			}
		} else {
			if (numero === 12) {
				mazo[tapeteActual.id].push(cartaActual);
			} else {
				error = true;
			}
		}
	}

	if (!error) {
		mazo[tapeteAnterior].pop();
		ev.target.appendChild(document.getElementById(cartaActual));
	}
	ev.target.style.opacity = "1";
}

// Valida por color de carta
function validarPorColor(prev, next) {
	if (prev === 'hex' || prev === 'cir') {
		return (next === 'cua' || next === 'viu');
	} else {
		return (next === 'hex' || next === 'cir');
	}
}

// Valida por número de carta
function validarPorNumero(prev, next) {
	return (prev - 1) === next;
}

function permitirDrop(ev) {
	ev.preventDefault();
}

// Efecto de opacidad al entrar a un tapete
function dragEntra(ev) {
	ev.target.style.opacity = "0.5";
}

// Restablecer opacidad al salir de un tapete
function dragSale(ev) {
	ev.target.style.opacity = "1";
}

// Se ejecuta al soltar la carta
function dragFin() {
	inicializarContador();
	body.classList.remove("block-event");

	if (mazo['inicial'].length === 0 && mazo['sobrantes'].length === 0) {
		finalizarJuego();
	}
}