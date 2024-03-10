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
    alert("Prestamo " + i + ": " + Cuotas + " cuotas de $" + Monto/Cuotas);
  }
}

SimuladorPrestamo();
