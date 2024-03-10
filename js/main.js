function Ingreso() {
  let Entrada = "";
  Entrada = prompt("Ingrese clave:");
  if(Entrada == "PrimeraEntrega") {
    alert("Entrada correcta");
  }
}

function CalculadorCuotas() {
  let Cuotas = 0;
  Cuotas = parseInt(prompt("Ingrese cantidad de cuotas:"));
  for(let i = 1; i <= Cuotas; i = i + 1) {
    alert("Cuota " + i);
  }
}

Ingreso();
CalculadorCuotas();
