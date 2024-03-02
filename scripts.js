document.getElementById('calculatorForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calcularPesoIdeal();
});

function calcularPesoIdeal() {
    var altura = parseFloat(document.getElementById('altura').value);
    var peso = parseFloat(document.getElementById('peso').value);
    var constitucion = document.getElementById('constitucion').value;
    var genero = document.getElementById('genero').value;
    var actividad = document.getElementById('actividad').value;
    var objetivo = document.getElementById('objetivo').value;

    if (altura > 0 && peso > 0) {
        var pesoIdeal = calcularFormulaPesoIdeal(altura, peso, constitucion, genero);
        var mensaje = "Tu peso ideal es de " + pesoIdeal.toFixed(2) + " kg.";
        document.getElementById('resultado').innerText = mensaje;

        var dietaSemanal = calcularDietaSemanal(pesoIdeal, actividad, objetivo);
        var tablaDieta = generarTablaDieta(dietaSemanal);
        var tablaDietaComidas = generarTablaDietaComidas(dietaSemanal);

        document.getElementById('resultadoDieta').innerHTML = tablaDieta;
        document.getElementById('resultadoDietaComidas').innerHTML = tablaDietaComidas;

    } else {
        document.getElementById('resultado').innerText = "Por favor, introduce valores válidos.";
        document.getElementById('resultadoDieta').innerHTML = "";
    }
}

function calcularFormulaPesoIdeal(altura, peso, constitucion, genero) {
    // Fórmula de peso ideal
    var alturaMetros = altura / 100; // Convertir altura a metros
    var pesoIdeal;

    if (genero === "hombre") {
        if (constitucion === "delgada") {
            pesoIdeal = (alturaMetros * 100 - 100) * 0.9;
        } else if (constitucion === "robusta") {
            pesoIdeal = (alturaMetros * 100 - 100) * 1.1;
        } else {
            pesoIdeal = (alturaMetros * 100 - 100);
        }
    } else if (genero === "mujer") {
        if (constitucion === "delgada") {
            pesoIdeal = (alturaMetros * 100 - 100) * 0.85;
        } else if (constitucion === "robusta") {
            pesoIdeal = (alturaMetros * 100 - 100) * 1.15;
        } else {
            pesoIdeal = (alturaMetros * 100 - 100) * 0.9;
        }
    }
    
    return pesoIdeal;
}

function calcularDietaSemanal(pesoIdeal, actividad, objetivo) {
    // Calcular necesidades calóricas diarias
    var factorActividad = 0;
    switch (actividad) {
        case "sedentario":
            factorActividad = 1.2;
            break;
        case "ligera":
            factorActividad = 1.375;
            break;
        case "moderada":
            factorActividad = 1.55;
            break;
        case "intensa":
            factorActividad = 1.725;
            break;
        case "muyIntensa":
            factorActividad = 1.9;
            break;
        default:
            break;
    }

    var caloriasDiarias;
    if (objetivo === "perder") {
        caloriasDiarias = pesoIdeal * 24 * factorActividad * 0.8;
    } else if (objetivo === "mantener") {
        caloriasDiarias = pesoIdeal * 24 * factorActividad;
    } else if (objetivo === "ganar") {
        caloriasDiarias = pesoIdeal * 24 * factorActividad * 1.2;
    }

    // Calcular distribución de macronutrientes
    var proteinas = pesoIdeal * 2.2; // 2.2g/kg de peso corporal
    var grasas = caloriasDiarias * 0.3 / 9; // 30% de calorías totales, 1g de grasa = 9 calorías
    var carbohidratos = (caloriasDiarias - (proteinas * 4) - (grasas * 9)) / 4; // 4 calorías por gramo de carbohidratos

    // Solo necesitas el consumo diario, así que simplemente devuelve los macronutrientes
    return { "Proteínas": proteinas.toFixed(2), "Grasas": grasas.toFixed(2), "Carbohidratos": carbohidratos.toFixed(2) };
}

function generarTablaDieta(dietaDiaria) {
    var tablaHTML = "<h2>Macro Diario</h2><table><tr><th></th><th>Gramos</th></tr>";
    for (var macro in dietaDiaria) {
        tablaHTML += "<tr>";
        tablaHTML += "<td>" + macro + "</td>";
        tablaHTML += "<td>" + dietaDiaria[macro] + "</td>";
        tablaHTML += "</tr>";
    }
    tablaHTML += "</table>";
    return tablaHTML;
}
function generarTablaDietaComidas(dietaDiaria) {
    // Base de datos de platos completos con valores nutricionales
    var platosCompletos = [
    // Desayunos adicionales
    { nombre: "Tostada de aguacate y tomate", tipo: "Desayuno", proteinas: 5, grasas: 10, carbohidratos: 25 },
    { nombre: "Batido de espinacas, plátano y almendras", tipo: "Desayuno", proteinas: 8, grasas: 7, carbohidratos: 30 },
    { nombre: "Tortitas de avena y plátano", tipo: "Desayuno", proteinas: 6, grasas: 5, carbohidratos: 35 },
    { nombre: "Yogur de almendras con frutas y granola", tipo: "Desayuno", proteinas: 7, grasas: 8, carbohidratos: 40 },
    { nombre: "Tostada de hummus y pepino", tipo: "Desayuno", proteinas: 5, grasas: 7, carbohidratos: 30 },
    { nombre: "Bol de frutas y frutos secos", tipo: "Desayuno", proteinas: 4, grasas: 6, carbohidratos: 40 },
    { nombre: "Smoothie de bayas y espinacas", tipo: "Desayuno", proteinas: 6, grasas: 3, carbohidratos: 35 },
    { nombre: "Gachas de quinoa con leche de almendras", tipo: "Desayuno", proteinas: 7, grasas: 6, carbohidratos: 45 },
    { nombre: "Tortilla de champiñones y espinacas", tipo: "Desayuno", proteinas: 8, grasas: 7, carbohidratos: 15 },
    { nombre: "Pan integral con aguacate y huevo pochado", tipo: "Desayuno", proteinas: 12, grasas: 15, carbohidratos: 20 },

    // Almuerzos adicionales
    { nombre: "Hamburguesa de lentejas con ensalada", tipo: "Almuerzo", proteinas: 20, grasas: 10, carbohidratos: 35 },
    { nombre: "Curry de garbanzos con arroz integral", tipo: "Almuerzo", proteinas: 18, grasas: 8, carbohidratos: 50 },
    { nombre: "Ensalada de quinoa, aguacate y tomate", tipo: "Almuerzo", proteinas: 15, grasas: 12, carbohidratos: 40 },
    { nombre: "Wrap de hummus y vegetales", tipo: "Almuerzo", proteinas: 10, grasas: 8, carbohidratos: 30 },
    { nombre: "Pasta integral con pesto de espinacas y nueces", tipo: "Almuerzo", proteinas: 12, grasas: 15, carbohidratos: 45 },
    { nombre: "Sopa de lentejas con verduras", tipo: "Almuerzo", proteinas: 10, grasas: 5, carbohidratos: 25 },
    { nombre: "Bowl de arroz integral, frijoles negros y aguacate", tipo: "Almuerzo", proteinas: 20, grasas: 10, carbohidratos: 40 },
    { nombre: "Pizza vegetal casera", tipo: "Almuerzo", proteinas: 15, grasas: 12, carbohidratos: 30 },
    { nombre: "Sándwich de tofu a la parrilla con verduras", tipo: "Almuerzo", proteinas: 18, grasas: 10, carbohidratos: 35 },
    { nombre: "Bowl de falafel con hummus y ensalada", tipo: "Almuerzo", proteinas: 20, grasas: 15, carbohidratos: 30 },

    // Cenas adicionales
    { nombre: "Lasagna de vegetales y tofu", tipo: "Cena", proteinas: 20, grasas: 15, carbohidratos: 35 },
    { nombre: "Ensalada de garbanzos y remolacha", tipo: "Cena", proteinas: 15, grasas: 8, carbohidratos: 30 },
    { nombre: "Tacos de coliflor con guacamole", tipo: "Cena", proteinas: 12, grasas: 10, carbohidratos: 25 },
    { nombre: "Curry de verduras y garbanzos", tipo: "Cena", proteinas: 18, grasas: 10, carbohidratos: 40 },
    { nombre: "Berenjenas rellenas de quinoa y verduras", tipo: "Cena", proteinas: 15, grasas: 10, carbohidratos: 30 },
    { nombre: "Risotto de champiñones y espárragos", tipo: "Cena", proteinas: 15, grasas: 12, carbohidratos: 40 },
    { nombre: "Sopa de calabaza y zanahoria", tipo: "Cena", proteinas: 8, grasas: 5, carbohidratos: 20 },
    { nombre: "Pastel de queso vegano", tipo: "Cena", proteinas: 10, grasas: 12, carbohidratos: 30 },
    { nombre: "Brochetas de tofu y vegetales a la parrilla", tipo: "Cena", proteinas: 16, grasas: 10, carbohidratos: 25 },
    { nombre: "Ensalada de lentejas y vegetales asados", tipo: "Cena", proteinas: 15, grasas: 8, carbohidratos: 30 },

    // Snacks adicionales
    { nombre: "Hummus con bastones de zanahoria", tipo: "Snack", proteinas: 5, grasas: 6, carbohidratos: 15 },
    { nombre: "Rodajas de manzana con mantequilla de almendras", tipo: "Snack", proteinas: 3, grasas: 8, carbohidratos: 20 },
    { nombre: "Batido de proteínas de guisante", tipo: "Snack", proteinas: 20, grasas: 5, carbohidratos: 10 },
    { nombre: "Palomitas de maíz caseras con levadura nutricional", tipo: "Snack", proteinas: 3, grasas: 5, carbohidratos: 25 },
    { nombre: "Barritas de cereales y frutos secos", tipo: "Snack", proteinas: 5, grasas: 10, carbohidratos: 20 },
    { nombre: "Bolitas energéticas de dátiles y nueces", tipo: "Snack", proteinas: 4, grasas: 6, carbohidratos: 25 },
    { nombre: "Smoothie bowl de espirulina y frutas", tipo: "Snack", proteinas: 7, grasas: 3, carbohidratos: 35 },
    { nombre: "Pan integral con aguacate y tomate", tipo: "Snack", proteinas: 5, grasas: 10, carbohidratos: 20 },
    { nombre: "Batido verde detox", tipo: "Snack", proteinas: 5, grasas: 3, carbohidratos: 30 },
    { nombre: "Huevos rellenos de tofu y aguacate", tipo: "Snack", proteinas: 10, grasas: 8, carbohidratos: 15 }
    // Agrega más platos completos vegetarianos según sea necesario
];

    
    var tablaHTML = "<h2>Selección de Comidas</h2><table><tr><th>Día</th><th>Comida</th><th>Plato Completo</th></tr>";
    
    // Para cada día de la semana y cada comida
    var diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    var comidas = ["Desayuno", "Almuerzo", "Cena", "Snack"];
    
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 4; j++) {
            // Seleccionar plato completo que cumpla con los requerimientos de macros y coincida con el tipo de comida
            var plato = seleccionarPlatoCompleto(dietaDiaria, platosCompletos.filter(function(item) { return item.tipo === comidas[j]; }));
            tablaHTML += "<tr>";
            tablaHTML += "<td>" + diasSemana[i] + "</td>";
            tablaHTML += "<td>" + comidas[j] + "</td>";
            tablaHTML += "<td>" + plato.nombre + "</td>";
            tablaHTML += "</tr>";
        }
    }
    
    tablaHTML += "</table>";
    return tablaHTML;
}

function seleccionarPlatoCompleto(dietaDiaria, platosCompletos) {
    var candidatos = [];

    platosCompletos.forEach(function(plato) {
        if (plato.proteinas <= dietaDiaria["Proteínas"] && plato.grasas <= dietaDiaria["Grasas"] && plato.carbohidratos <= dietaDiaria["Carbohidratos"]) {
            candidatos.push(plato);
        }
    });

    // Si no hay candidatos, seleccionar uno aleatorio
    if (candidatos.length === 0) {
        return platosCompletos[Math.floor(Math.random() * platosCompletos.length)];
    }

    // Ordenar candidatos de forma aleatoria y seleccionar el primero
    candidatos.sort(function() { return 0.5 - Math.random() });
    return candidatos[0];
}
