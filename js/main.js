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

SimuladorPrestamo();
BuscarPrestamo();
