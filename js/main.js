// Log In

let usuarios = [];

const contenedorLog = document.getElementById("contenedorLog");
const username = document.getElementById("username");
const btnLogIn = document.getElementById("logIn");
const criptoYa = "https://criptoya.com/api/dolar";
let logged = false;

btnLogIn.addEventListener("click", () => {
	if(username.value == "") {
		Swal.fire({
			icon: "info",
			title: "Oops...",
			text: "Por favor ingrese un usuario!"
		});
		return;
	}
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
	logged = true;
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
		logged = false;
	});
};

// Simulador

const simulador = document.getElementById("inputSimul");
const respSimul = document.getElementById("respSimul");
let intervaloMonedas;

function mostrarSimulador() {
	let simul = document.createElement("div");
	simul.classList.add("inicioSimul");
	simul.innerHTML = `
	<h3>Simulador: solicita tu prestamo, devolve en ARS ($) y en cuotas fijas</h3>
	<div class="entradaSimul">
	Capital: <input type="text" id="capitalSimul">
	Cuotas: <input type="number" id="cuotasSimul">
	<select id="select">
		<option value="1" id="ars" selected>ARS</option>
		<option value="1" id="oficial" >USD Oficial</option>
		<option value="1" id="ahorro" >USD Ahorro</option>
		<option value="1" id="blue" >USD Blue</option>
		<option value="1" id="cripto" >USD Cripto</option>
		<option value="1" id="ccl" >USD CCL</option>
		<option value="1" id="mep" >USD Mep</option>
	</select>
	Cotizacion: $<div id="cotizacion">1</div>
	TNA: 50,0%
	<button id="calcularSimul">Calcular</button>
	</div>
	`;
	simulador.appendChild(simul);
	let calcularSimul = document.getElementById("calcularSimul");
	calcularSimul.addEventListener("click", () => {
		calcularSimulador();
	});
	
	let actualizarSelect = document.getElementById("select");
	actualizarSelect.addEventListener("change", () => {
		actualizarCotizacion();
	});

	// Frecuencia de actualizacion de la cotizacion
	actualizarMonedas();
	intervaloMonedas = setInterval( () => {
		if(logged) {
			actualizarMonedas();
		}
		else {
			clearInterval(intervaloMonedas);
		}
	},3000);
}

function actualizarCotizacion () {
	let select = document.getElementById("select");
	let cotizacion = document.getElementById("cotizacion");
	for (let i = 0; i < select.length; i++) {
		if(select[i].selected == true) {
			cotizacion.innerText = select[i].value;
		}
	}
}

function actualizarMonedas() {
	const combo = document.getElementById("select");
	fetch(criptoYa)
		.then(response => response.json())
		.then(({oficial, ahorro, blue, cripto, ccl, mep}) => {
			for (let i = 0; i < combo.length; i++) {
				if(combo[i].id == "oficial") {
					combo[i].value = oficial.price.toFixed(2);
				}
				else if (combo[i].id == "ahorro") {
					combo[i].value = ahorro.ask.toFixed(2);
				}
				else if (combo[i].id == "blue") {
					combo[i].value = blue.ask.toFixed(2);
				}
				else if (combo[i].id == "cripto") {
					combo[i].value = cripto.usdt.ask.toFixed(2);
				}
				else if (combo[i].id == "ccl") {
					combo[i].value = ccl.al30.ci.price.toFixed(2);
				}
				else if (combo[i].id == "mep") {
					combo[i].value = mep.al30.ci.price.toFixed(2);
				}
			}
			actualizarCotizacion();
		})
}

function calcularSimulador() {
	respSimul.innerHTML = ""
	let capitalSimul = parseInt(document.getElementById("capitalSimul").value);
	const cuotasSimul = parseInt(document.getElementById("cuotasSimul").value);
	const select = document.getElementById("select");
	for (let i = 0; i < select.length; i++) {
		if(select[i].selected == true) {
			// Convierto capital simulado a $
			capitalSimul = capitalSimul*parseFloat(select[i].value);
		}
	}
	let tna = 50;
	let amortizacion = "Frances Mensual";
	let calculo = document.createElement("div");
	if(capitalSimul <= 0  || isNaN(capitalSimul)) {
		Swal.fire({
			icon: "error",
			title: "Oops...",
			text: "No se ingreso un monto de Capital valido",
			footer: '<p>El Capital debe ser un monto positivo</p>'
		});
		return;
	}
	else if(cuotasSimul <= 0 || isNaN(cuotasSimul)) {
		Swal.fire({
			icon: "error",
			title: "Oops...",
			text: "No se ingreso una cantidad de Cuotas valida",
			footer: '<p>Las cuotas deben ser al menos 1</p>'
		});
		return;
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
}

// Prestamos

let prestamos = [];

function solicitarPrestamo(capitalSimul,cuotasSimul,total,tna,amortizacion) {

	Swal.fire({
		title: "Desea solicitar el prestamo?",
		text: "El prestamo simulado se asociara a su cuenta!",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Si, solicitarlo!",
		cancelButtonText: "Cancelar"
	}).then((result) => {
		if (result.isConfirmed) {
			Swal.fire({
			title: "Completado!",
			text: "Prestamo generado correctamente.",
			icon: "success"
			});
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
	});
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