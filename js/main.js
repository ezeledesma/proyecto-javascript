const Prestamos = [];

class Prestamo {
	constructor(numero, monto, cuotas) {
		this.numero = numero;
		this.monto = monto;
		this.cuotas = cuotas;
		this.importeCuota = this.monto/this.cuotas;
	}
}

function SimuladorPrestamo() {
	let Cantidad = 0;
	let Cuotas = 0;
	let Monto = 0.0;
	Cantidad = parseInt(prompt("Ingrese cantidad de prestamos a pedir:"));
	for(let i = 1; i <= Cantidad; i = i + 1) {
		Monto = parseFloat(prompt("Ingrese monto del prestamo "+ i+ ":"));
		Cuotas = parseInt(prompt("Ingrese cantidad de cuotas mayor a 0:"));
		if(Cuotas < 1) {
			alert("Cantidad de cuotas ingresadas incorrecta, recargue la pagina para reintentar");
			return;
		}
		Prestamos.push(new Prestamo(i,Monto,Cuotas));
		alert("Prestamo " + i + ": " + Cuotas + " cuotas de $" + Monto/Cuotas);
	}
}

function BuscarPrestamo() {
	let Numero = 0;
	let Consulta = 0;
	let Aux=[];
	Consulta = parseInt(prompt("Ingrese '1' si quiere consultar algun prestamo"));
	while(Consulta == 1) {
		Numero = parseInt(prompt("Ingrese numero de prestamo a consultar:"));
		if(Numero > Prestamos.length || Numero < 1) {
			alert("No existe el numero de prestamo ingresado");
		}
		else {
			Aux = Prestamos.filter((el) => el.numero == Numero)[0];
			alert("Prestamo " + Aux.numero + ": " + Aux.cuotas + " cuotas de $" + Aux.importeCuota);
		}
		Consulta = parseInt(prompt("Ingrese '1' si quiere realizar otra consulta"));
	}
}

//SimuladorPrestamo();
//BuscarPrestamo();

// Parte 3

/*

1) Leo usuario al apretar en Entrar
2) Si existe levanto datos
3) Si no existe creo usuario y lo guardo
4) Dejo mensaje de bienvenida y cargo ventanas de simulacion y prestamos
5) Habilito boton para salir?

*/

// Log In

let usuarios = [];

const username = document.getElementById("username");
const btnLogIn = document.getElementById("logIn");

btnLogIn.addEventListener("click", () => {
	const usuariosJson = localStorage.getItem("usuarios");
	usuarios = JSON.parse(usuariosJson);
	btnLogIn.style.display = "none";
	if(usuarios) {
		// Existen usuarios
		if(usuarios.find((el) => el.username === username.value)){
			// Existe el que busco
			mostrarBienvenida(username.value,"existente");
		}
		else {
			usuarios.push({username:username.value,pwd:"1234"});
			mostrarBienvenida(username.value,"nuevo");
		}
	}
	else {
		// No existe ninguno
		usuarios = [{username:username.value,pwd:"1234"}];
		mostrarBienvenida(username.value,"nuevo");
	}
	// Lo guardo
	localStorage.setItem("usuarios",JSON.stringify(usuarios));
	mostrarSimulador();
});

function mostrarBienvenida(username, tipo) {
	const mensaje = document.getElementById("contenedorMensajeLog");
	let msj = document.createElement("p");
	if(tipo == "existente") {
		msj.innerText = `Sesion iniciada como: ${username}`;
	}
	else if (tipo == "nuevo") {
		msj.innerText = `Bienvenido ${username}, se registro su nuevo usuario`;
	}
	mensaje.appendChild(msj);
};

// Simulador

const simulador = document.getElementById("inputSimul");
const respSimul = document.getElementById("respSimul");

function mostrarSimulador() {
	let simul = document.createElement("div");
	simul.innerHTML = `
	<h3>Simulador</h3>
	Capital: <input type="text" id="capitalSimul">
	<br>
	Cuotas: <input type="number" id="cuotasSimul">
	TNA: 50,0%
	<button id="calcularSimul">Calcular</button>
	`;
	simulador.appendChild(simul);
	let calcularSimul = document.getElementById("calcularSimul");
	calcularSimul.addEventListener("click", () => {
		calcularSimulador();
	});
}

function calcularSimulador() {
	respSimul.innerHTML = ""
	const capitalSimul = parseInt(document.getElementById("capitalSimul").value);
	const cuotasSimul = parseInt(document.getElementById("cuotasSimul").value);
	let calculo = document.createElement("div");
	if(capitalSimul <= 0  || isNaN(capitalSimul)) {
		calculo.innerHTML = `<p>Por favor ingrese un monto de Capital positivo</p>`
	}
	else if(cuotasSimul <= 0 || isNaN(cuotasSimul)) {
		calculo.innerHTML = `<p>Por favor ingrese una cantidad de cuotas positiva</p>`
	}
	else {
		let total = capitalSimul + capitalSimul * 0.5 * cuotasSimul / 12;
		calculo.innerHTML = `
		Capital: ${capitalSimul} Cuotas: ${cuotasSimul}
		Total: ${total} Amortizacion: Frances Mensual
		<button id="solicitarSimul">Solicitar</button>
		<p>Devuelve: ${cuotasSimul} x ${total/cuotasSimul}</p>
		`;
	}
	respSimul.appendChild(calculo);
}


const prestamosVigentes = document.getElementById("contenedorPrestamos");

// Prestamos

function mostrarPrestamos() {

}