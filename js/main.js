/*
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
*/


// Parte 3


// Log In

let usuarios = [];

const contenedorLog = document.getElementById("contenedorLog");
const username = document.getElementById("username");
const btnLogIn = document.getElementById("logIn");

btnLogIn.addEventListener("click", () => {
	const usuariosJson = localStorage.getItem("usuarios");
	usuarios = JSON.parse(usuariosJson);
	contenedorLog.style.display = "none";
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
	cargarPrestamos();
	mostrarPrestamos();
});

const mensaje = document.getElementById("contenedorMensajeLog");

function mostrarBienvenida(username, tipo) {
	let msj = document.createElement("div");
	msj.classList.add("mensajeLog");
	if(tipo == "existente") {
		msj.innerHTML = `<h3>Sesion iniciada como: ${username}</h3>`;
	}
	else if (tipo == "nuevo") {
		msj.innerHTML = `<h3>Bienvenido ${username}, se registro su nuevo usuario</h3>`;
	}
	msj.innerHTML += `<button id="logOut">Salir</button>`;
	mensaje.appendChild(msj);
	let logOut = document.getElementById("logOut");
	logOut.addEventListener("click", () => {
		document.getElementById("username").value = "";
		username.innerHTML = "";
		contenedorLog.style.display = "flex";
		mensaje.innerHTML = "";
		simulador.innerHTML = "";
		respSimul.innerHTML = "";
		prestamosVigentes.innerHTML = "";
	});
};

// Simulador

const simulador = document.getElementById("inputSimul");
const respSimul = document.getElementById("respSimul");

function mostrarSimulador() {
	let simul = document.createElement("div");
	simul.classList.add("inicioSimul");
	simul.innerHTML = `
	<h3>Simulador</h3>
	<div class="entradaSimul">
	Capital: <input type="text" id="capitalSimul">
	Cuotas: <input type="number" id="cuotasSimul">
	TNA: 50,0%
	<button id="calcularSimul">Calcular</button>
	</div>
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
	let tna = 50;
	let amortizacion = "Frances Mensual";
	let calculo = document.createElement("div");
	if(capitalSimul <= 0  || isNaN(capitalSimul)) {
		calculo.innerHTML = `<p class="error">Por favor ingrese un monto de Capital positivo</p>`
	}
	else if(cuotasSimul <= 0 || isNaN(cuotasSimul)) {
		calculo.innerHTML = `<p class="error">Por favor ingrese una cantidad de cuotas positiva</p>`
	}
	else {
		let total = capitalSimul + capitalSimul * (tna/100.0) * cuotasSimul / 12;
		calculo.innerHTML = `
		<div class="resp">
		Capital: $${capitalSimul} Cuotas: ${cuotasSimul} TNA: ${tna}%
		<button id="solicitarSimul">Solicitar</button>
		</div>
		<div class="resp">
		Total: $${total.toFixed(2)} Amortizacion: ${amortizacion}
		</div>
		<div class="resp">
		<h5>Prestamo pre-aprobado, usted devuelve: ${cuotasSimul} x $${(total/cuotasSimul).toFixed(2)}</h5>
		</div>
		`;
		respSimul.appendChild(calculo);
		let solicitarSimul = document.getElementById("solicitarSimul");
		solicitarSimul.addEventListener("click", () => {
			solicitarPrestamo(capitalSimul,cuotasSimul,total,tna,amortizacion);
		});
		return;
	}
	respSimul.appendChild(calculo);
}

// Prestamos

let prestamos = [];

function solicitarPrestamo(capitalSimul,cuotasSimul,total,tna,amortizacion) {
	let prestamo = {
		username: username.value,
		capital: capitalSimul,
		cuotas: cuotasSimul,
		total: total,
		tna: tna,
		amortizacion: amortizacion,
		fechaOrig: (new Date()).toLocaleDateString()
	}
	prestamos.push(prestamo);
	localStorage.setItem("prestamos",JSON.stringify(prestamos));
	mostrarPrestamos();
}

const prestamosVigentes = document.getElementById("contenedorPr");

function mostrarPrestamos() {
	prestamosVigentes.innerHTML = "";
	let contador = 0;
	prestamos.filter((el) => el.username == username.value).forEach(prestamo => {
		const card = document.createElement("div");
		contador++;
		let fechaPartes = prestamo.fechaOrig.split("/");
		let fecha1erVto = new Date(fechaPartes[2], fechaPartes[1] - 1, fechaPartes[0]);
		let auxFecha;
		let innerCard ="";
		if(contador == 1) {
			innerCard = `
			<div class="titulo">
				<p>Prestamos vigentes</p>
			</div>`
		}
		innerCard += `
		<div class="subTitulo">
			<p>Prestamo: #${contador} Monto: $${prestamo.total.toFixed(2)} Cuotas: ${prestamo.cuotas} TNA: ${prestamo.tna}% Amort: ${prestamo.amortizacion}</p>
		</div>
		<div class="detalleCuotas">
			<div class="cabecera">Cuota Vencimiento Monto Adeudado Estado</div>
			<div class="cuotas">`
		for(let i = 0; i < prestamo.cuotas; i++) {
			auxFecha = new Date(fecha1erVto.setMonth(fecha1erVto.getMonth() + 1)).toLocaleDateString()
			innerCard += `<p>${i+1} ${auxFecha} $${(prestamo.total/prestamo.cuotas).toFixed(2)} $${(prestamo.total/prestamo.cuotas).toFixed(2)} A Vencer</p>`;
		}
		innerCard += "</div></div>";
		;
		card.innerHTML = innerCard;
		prestamosVigentes.appendChild(card);

		// Boton pagar
	})
}

function cargarPrestamos() {
	let prestamosJson = localStorage.getItem("prestamos");
	let todosLosPrestamos = JSON.parse(prestamosJson);
	if(todosLosPrestamos) {
		// Si hay elementos guardados, los cargo
		prestamos = todosLosPrestamos;
	}
}