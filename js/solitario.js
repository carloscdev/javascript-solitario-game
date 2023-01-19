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

// Botones
const reiniciar = document.getElementById("reset");

// Asignación de funciones
reiniciar.onclick = reiniciarJuego;
tapeteSobrantes.addEventListener("dragleave", dragLeave);
tapeteReceptor1.addEventListener("dragleave", dragLeave);
tapeteReceptor2.addEventListener("dragleave", dragLeave);
tapeteReceptor3.addEventListener("dragleave", dragLeave);
tapeteReceptor4.addEventListener("dragleave", dragLeave);

// Desarrollo del comienzo de juego
function comenzarJuego() {
	barajarMazoInicial();
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
	contInicial.innerHTML = mazoInicial.length;
	for (let mazo of mazoInicial) {
		setTimeout(() => {
			cargarTapete(tapeteInicial, mazo);
		}, 500)
	}
} // barajar

function cargarTapete(componente, mazo) {
	const cartaMazo = document.createElement('img');
	cartaMazo.src = `../imagenes/baraja/${mazo}.png`;
	cartaMazo.className = 'cartaMazo';
	cartaMazo.id = mazo;
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
	return [...lista];
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
	clearInterval(temporizador);
	comenzarJuego();
}

function dragLeave(e) {
	let cartaActual = e.dataTransfer.getData('text/plain').split('/').at(-1).replace('.png', '');
	if (mazoSobrantes.includes(cartaActual)) return;
	mazoSobrantes.push(cartaActual);

	mazoInicial = mazoInicial.filter(item => item !== cartaActual);

	const cartaAntigua = document.getElementById(cartaActual);
	if (cartaAntigua) cartaAntigua.remove();

	cargarTapete(e.originalTarget, cartaActual);

	console.log('Mazo Inicial', mazoInicial);
	console.log('Mazo Sobrantes', mazoSobrantes);
	console.log(e.originalTarget, '----', tapeteSobrantes);
}