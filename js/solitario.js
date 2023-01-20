let palos = ["viu", "cua", "hex", "cir"];
// let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let numeros = [9, 10, 11, 12];

// Tapetes
const tapeteInicial   = document.getElementById("inicial");
const tapeteSobrantes = document.getElementById("sobrantes");
const tapeteReceptor1 = document.getElementById("receptor1");
const tapeteReceptor2 = document.getElementById("receptor2");
const tapeteReceptor3 = document.getElementById("receptor3");
const tapeteReceptor4 = document.getElementById("receptor4");
// Mazos
let mazoInicial   = [];
let mazoSobrantes = [];
let mazoReceptor1 = [];
let mazoReceptor2 = [];
let mazoReceptor3 = [];
let mazoReceptor4 = [];

// Contadores de cartas
const contInicial     = document.getElementById("contador_inicial");
const contSobrantes   = document.getElementById("contador_sobrantes");
const contReceptor1   = document.getElementById("contador_receptor1");
const contReceptor2   = document.getElementById("contador_receptor2");
const contReceptor3   = document.getElementById("contador_receptor3");
const contReceptor4   = document.getElementById("contador_receptor4");
const contMovimientos = document.getElementById("contador_movimientos");

// Tiempo
const contTiempo  = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos 	 = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador

let movimientos = 0;

// Botones
const reiniciar = document.getElementById("reset");

// Asignación de funciones
reiniciar.onclick = reiniciarJuego;

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

// Desarrollo del comienzo de juego
function comenzarJuego() {
	barajarMazoInicial();
	inicializarContador()
	arrancarTiempo();

} // comenzarJuego

comenzarJuego();

function arrancarTiempo(){
	const hms = () => {
		let seg = Math.trunc( segundos % 60 );
		let min = Math.trunc( (segundos % 3600) / 60 );
		let hor = Math.trunc( (segundos % 86400) / 3600 );
		let tiempo = ( (hor<10)? "0"+hor : ""+hor )
			+ ":" + ( (min<10)? "0"+min : ""+min )
			+ ":" + ( (seg<10)? "0"+seg : ""+seg );
		setContador(contTiempo, tiempo);
		segundos++;
	}
	segundos = 0;
	hms();
	temporizador = setInterval(hms, 1000);
}

function barajarMazoInicial() {
	for (let numero of numeros) {
		for (let palo of palos) {
			mazoInicial.push(`${numero}-${palo}`);
		}
	}
	mazoInicial = barajarMazo(mazoInicial);
	for (let mazo of mazoInicial) {
		cargarTapete(tapeteInicial, mazo);
	}
}

function cargarTapete(componente, mazo) {
	const cartaMazo = document.createElement('img');
	cartaMazo.src = `../imagenes/baraja/${mazo}.png`;
	cartaMazo.setAttribute('class', 'cartaMazo');
	cartaMazo.setAttribute('id', mazo);
	cartaMazo.setAttribute('draggable', 'true');
	cartaMazo.addEventListener("dragstart", dragInicio);
	cartaMazo.addEventListener("dragend", dragFin);
	componente.appendChild(cartaMazo);
}

function setContador(contador, valor) {
	contador.innerHTML = valor;
}

function barajarMazo(lista) {
	for (let i = lista.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[lista[i], lista[j]] = [lista[j], lista[i]];
	}
	return lista;
}

// Reiniciar el juego
function reiniciarJuego() {
	const listaCartaMazo = document.querySelectorAll('.cartaMazo')
	listaCartaMazo.forEach(item => item.remove())
	mazoInicial   = [];
	mazoSobrantes = [];
	mazoReceptor1 = [];
	mazoReceptor2 = [];
	mazoReceptor3 = [];
	mazoReceptor4 = [];
	movimientos = 0;
	clearInterval(temporizador);
	comenzarJuego();
}

function inicializarContador() {
	setContador(contInicial, mazoInicial.length);
	setContador(contSobrantes, mazoSobrantes.length);
	setContador(contReceptor1, mazoReceptor1.length);
	setContador(contReceptor2, mazoReceptor2.length);
	setContador(contReceptor3, mazoReceptor3.length);
	setContador(contReceptor4, mazoReceptor4.length);
	setContador(contMovimientos, movimientos++);
}

function finalizarJuego() {
	alert("GANASTER");
	reiniciarJuego();
}

function dragInicio(ev) {
	ev.dataTransfer.setData("Text",ev.target.id);
	const images = document.querySelectorAll('img')
	for (let image of images) {
		image.classList.add("block-event");
	}
}

function drop(ev) {
	ev.preventDefault();
	let tapeteActual = ev.originalTarget;
	const idCartaActual = ev.dataTransfer.getData('text/plain').split('/').at(-1).replace('.png', '');
	const valorCarta = idCartaActual.split('-');
	const numero = Number(valorCarta[0]);
	const color = valorCarta[1];
	let error = false;
	console.log(valorCarta);

	if (tapeteActual.id === 'sobrantes') {
		mazoSobrantes.push(idCartaActual);
	}  else if (tapeteActual.id === 'receptor1') {
		if (mazoReceptor1.length > 0) {
			const valorPrevio = mazoReceptor1.at(-1).split('-')
			if (!validarPorColor(valorPrevio[1], color) || !validarPorNumero(Number(valorPrevio[0]), numero)) {
				error = true;
			} else {
				mazoReceptor1.push(idCartaActual);
			}
		} else {
			if (numero === 12) {
				mazoReceptor1.push(idCartaActual);
			} else {
				error = true;
			}
		}
	} else if (tapeteActual.id === 'receptor2') {
		if (mazoReceptor2.length > 0) {
			const valorPrevio = mazoReceptor2.at(-1).split('-')
			if (!validarPorColor(valorPrevio[1], color) || !validarPorNumero(Number(valorPrevio[0]), numero)) {
				error = true;
			} else {
				mazoReceptor2.push(idCartaActual);
			}
		} else {
			if (numero === 12) {
				mazoReceptor2.push(idCartaActual);
			} else {
				error = true;
			}
		}
	} else if (tapeteActual.id === 'receptor3') {
		if (mazoReceptor3.length > 0) {
			const valorPrevio = mazoReceptor3.at(-1).split('-')
			if (!validarPorColor(valorPrevio[1], color) || !validarPorNumero(Number(valorPrevio[0]), numero)) {
				error = true;
			} else {
				mazoReceptor3.push(idCartaActual);
			}
		} else {
			if (numero === 12) {
				mazoReceptor3.push(idCartaActual);
			} else {
				error = true;
			}
		}
	} else if (tapeteActual.id === 'receptor4') {
		if (mazoReceptor4.length > 0) {
			const valorPrevio = mazoReceptor4.at(-1).split('-')
			if (!validarPorColor(valorPrevio[1], color) || !validarPorNumero(Number(valorPrevio[0]), numero)) {
				error = true;
			} else {
				mazoReceptor4.push(idCartaActual);
			}
		} else {
			if (numero === 12) {
				mazoReceptor4.push(idCartaActual);
			} else {
				error = true;
			}
		}
	} else {
		error = true;
	}

	if (!error) {
		mazoInicial.pop();
	ev.target.appendChild(document.getElementById(idCartaActual));
	}
	ev.target.style.opacity = "1";
}

function validarPorColor(prev, next) {
	if (prev === 'hex' || prev === 'cir') {
		return (next === 'cua' || next === 'viu');
	} else {
		return (next === 'hex' || next === 'cir');
	}
}

function validarPorNumero(prev, next) {
	return (prev - 1) === next;
}

function permitirDrop(ev) {
	ev.preventDefault();
}

function dragEntra(ev) {
	ev.target.style.opacity = "0.5";
}

function dragSale(ev) {
	ev.target.style.opacity = "1";
}

function dragFin() {
	const images = document.querySelectorAll('img');
	for (let image of images) {
		image.classList.remove("block-event");
	}
	inicializarContador();

	if (mazoInicial.length === 0 && mazoSobrantes.length === 0) {
		finalizarJuego();
	}
	console.log('Mazo Inicial', mazoInicial);
	console.log('Mazo Sobrantes', mazoSobrantes);
	console.log('Mazo Receptor 1', mazoReceptor1);
	console.log('Mazo Receptor 2', mazoReceptor2);
	console.log('Mazo Receptor 3', mazoReceptor3);
	console.log('Mazo Receptor 4', mazoReceptor4);
}