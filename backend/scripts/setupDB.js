const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);

function calcularPromedio(nota1, nota2, nota3) {
  return Number(((nota1 + nota2 + nota3) / 3).toFixed(2));
}

async function setupDB() {
  try {
    await client.connect();

    const db = client.db(process.env.DB_NAME);
    const collectionName = process.env.COLLECTION_NAME;

    try {
      await db.collection(collectionName).drop();
      console.log("Colección anterior eliminada.");
    } catch (error) {
      console.log("No existía una colección anterior.");
    }

    await db.createCollection(collectionName, {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "_id",
            "nombre_estudiante",
            "materia",
            "nota1",
            "nota2",
            "nota3",
            "promedio",
            "condicion",
            "cuatrimestre"
          ],
          properties: {
            _id: {
              bsonType: "string",
              description: "Identificador del estudiante"
            },
            nombre_estudiante: {
              bsonType: "string",
              pattern: "^([A-Za-zÁÉÍÓÚáéíóúÑñ]+\\s){3}[A-Za-zÁÉÍÓÚáéíóúÑñ]+$",
              description: "Debe tener dos nombres y dos apellidos, sin números"
            },
            materia: {
              bsonType: "string",
              description: "Nombre de la materia"
            },
            nota1: {
              bsonType: ["int", "double"],
              minimum: 0,
              maximum: 100,
              description: "Debe ser una nota numérica"
            },
            nota2: {
              bsonType: ["int", "double"],
              minimum: 0,
              maximum: 100,
              description: "Debe ser una nota numérica"
            },
            nota3: {
              bsonType: ["int", "double"],
              minimum: 0,
              maximum: 100,
              description: "Debe ser una nota numérica"
            },
            promedio: {
              bsonType: ["int", "double"],
              minimum: 0,
              maximum: 100,
              description: "Debe ser un promedio numérico"
            },
            condicion: {
              enum: ["Aprobado", "Ampliación", "Reprobado"],
              description: "Solo permite Aprobado, Ampliación o Reprobado"
            },
            cuatrimestre: {
              bsonType: "int",
              minimum: 1,
              description: "Debe ser un número natural"
            }
          }
        }
      }
    });

    console.log("Colección creada con validator.");

    const estudiantes = [
      {
        _id: "E001",
        nombre_estudiante: "Gustavo Adolfo Mora Salas",
        materia: "Literatura",
        nota1: 95,
        nota2: 94,
        nota3: 96,
        promedio: calcularPromedio(95, 94, 96),
        condicion: "Aprobado",
        cuatrimestre: 2
      },
      {
        _id: "E002",
        nombre_estudiante: "Gustavo Adolfo Mora Salas",
        materia: "Matemática",
        nota1: 88,
        nota2: 91,
        nota3: 90,
        promedio: calcularPromedio(88, 91, 90),
        condicion: "Aprobado",
        cuatrimestre: 2
      },
      {
        _id: "E003",
        nombre_estudiante: "Gustavo Adolfo Mora Salas",
        materia: "Ciencias",
        nota1: 62,
        nota2: 65,
        nota3: 68,
        promedio: calcularPromedio(62, 65, 68),
        condicion: "Reprobado",
        cuatrimestre: 2
      },
      {
        _id: "E004",
        nombre_estudiante: "María Fernanda López Vargas",
        materia: "Literatura",
        nota1: 91,
        nota2: 92,
        nota3: 93,
        promedio: calcularPromedio(91, 92, 93),
        condicion: "Aprobado",
        cuatrimestre: 1
      },
      {
        _id: "E005",
        nombre_estudiante: "María Fernanda López Vargas",
        materia: "Historia",
        nota1: 74,
        nota2: 76,
        nota3: 75,
        promedio: calcularPromedio(74, 76, 75),
        condicion: "Aprobado",
        cuatrimestre: 1
      },
      {
        _id: "E006",
        nombre_estudiante: "Ana Sofía Rojas Méndez",
        materia: "Literatura",
        nota1: 87,
        nota2: 89,
        nota3: 90,
        promedio: calcularPromedio(87, 89, 90),
        condicion: "Aprobado",
        cuatrimestre: 2
      },
      {
        _id: "E007",
        nombre_estudiante: "José Daniel Pérez Jiménez",
        materia: "Matemática",
        nota1: 55,
        nota2: 60,
        nota3: 58,
        promedio: calcularPromedio(55, 60, 58),
        condicion: "Reprobado",
        cuatrimestre: 1
      },
      {
        _id: "E008",
        nombre_estudiante: "Laura Daniela Castro Ruiz",
        materia: "Inglés",
        nota1: 80,
        nota2: 82,
        nota3: 84,
        promedio: calcularPromedio(80, 82, 84),
        condicion: "Aprobado",
        cuatrimestre: 3
      },
      {
        _id: "E009",
        nombre_estudiante: "Carlos Eduardo Ramírez Soto",
        materia: "Ciencias",
        nota1: 68,
        nota2: 66,
        nota3: 67,
        promedio: calcularPromedio(68, 66, 67),
        condicion: "Reprobado",
        cuatrimestre: 3
      },
      {
        _id: "E010",
        nombre_estudiante: "Valeria Isabel Torres Mora",
        materia: "Historia",
        nota1: 70,
        nota2: 72,
        nota3: 73,
        promedio: calcularPromedio(70, 72, 73),
        condicion: "Aprobado",
        cuatrimestre: 1
      },
      {
        _id: "E011",
        nombre_estudiante: "Diego Alejandro Sánchez León",
        materia: "Literatura",
        nota1: 83,
        nota2: 85,
        nota3: 84,
        promedio: calcularPromedio(83, 85, 84),
        condicion: "Aprobado",
        cuatrimestre: 2
      },
      {
        _id: "E012",
        nombre_estudiante: "Natalia Gabriela Solano Castro",
        materia: "Matemática",
        nota1: 45,
        nota2: 50,
        nota3: 48,
        promedio: calcularPromedio(45, 50, 48),
        condicion: "Reprobado",
        cuatrimestre: 2
      },
      {
        _id: "E013",
        nombre_estudiante: "Andrés Felipe Jiménez Arias",
        materia: "Inglés",
        nota1: 78,
        nota2: 79,
        nota3: 80,
        promedio: calcularPromedio(78, 79, 80),
        condicion: "Aprobado",
        cuatrimestre: 3
      },
      {
        _id: "E014",
        nombre_estudiante: "Camila Victoria Mora Rojas",
        materia: "Ciencias",
        nota1: 90,
        nota2: 91,
        nota3: 92,
        promedio: calcularPromedio(90, 91, 92),
        condicion: "Aprobado",
        cuatrimestre: 1
      },
      {
        _id: "E015",
        nombre_estudiante: "Luis Fernando Gómez Alfaro",
        materia: "Historia",
        nota1: 69,
        nota2: 68,
        nota3: 66,
        promedio: calcularPromedio(69, 68, 66),
        condicion: "Reprobado",
        cuatrimestre: 3
      },
      {
        _id: "E016",
        nombre_estudiante: "Sofía Alejandra Vargas Chaves",
        materia: "Literatura",
        nota1: 92,
        nota2: 93,
        nota3: 94,
        promedio: calcularPromedio(92, 93, 94),
        condicion: "Aprobado",
        cuatrimestre: 1
      },
      {
        _id: "E017",
        nombre_estudiante: "Mateo Sebastián Rojas Campos",
        materia: "Matemática",
        nota1: 71,
        nota2: 73,
        nota3: 72,
        promedio: calcularPromedio(71, 73, 72),
        condicion: "Aprobado",
        cuatrimestre: 2
      },
      {
        _id: "E018",
        nombre_estudiante: "Daniela María Fernández Soto",
        materia: "Inglés",
        nota1: 86,
        nota2: 87,
        nota3: 88,
        promedio: calcularPromedio(86, 87, 88),
        condicion: "Aprobado",
        cuatrimestre: 3
      },
      {
        _id: "E019",
        nombre_estudiante: "José María Villalobos Piedra",
        materia: "Ciencias",
        nota1: 60,
        nota2: 62,
        nota3: 61,
        promedio: calcularPromedio(60, 62, 61),
        condicion: "Reprobado",
        cuatrimestre: 2
      },
      {
        _id: "E020",
        nombre_estudiante: "Paula Andrea Morales Ríos",
        materia: "Historia",
        nota1: 77,
        nota2: 78,
        nota3: 79,
        promedio: calcularPromedio(77, 78, 79),
        condicion: "Aprobado",
        cuatrimestre: 1
      },
      {
        _id: "E021",
        nombre_estudiante: "Ricardo Antonio Castro Molina",
        materia: "Literatura",
        nota1: 81,
        nota2: 82,
        nota3: 83,
        promedio: calcularPromedio(81, 82, 83),
        condicion: "Aprobado",
        cuatrimestre: 3
      },
      {
        _id: "E022",
        nombre_estudiante: "Fernanda Isabel Chacón Vega",
        materia: "Matemática",
        nota1: 89,
        nota2: 88,
        nota3: 90,
        promedio: calcularPromedio(89, 88, 90),
        condicion: "Aprobado",
        cuatrimestre: 2
      },
      {
        _id: "E023",
        nombre_estudiante: "Manuel Antonio Cordero Ruiz",
        materia: "Inglés",
        nota1: 52,
        nota2: 55,
        nota3: 54,
        promedio: calcularPromedio(52, 55, 54),
        condicion: "Reprobado",
        cuatrimestre: 1
      },
      {
        _id: "E024",
        nombre_estudiante: "Isabella Sofía Méndez Castro",
        materia: "Ciencias",
        nota1: 93,
        nota2: 94,
        nota3: 95,
        promedio: calcularPromedio(93, 94, 95),
        condicion: "Aprobado",
        cuatrimestre: 3
      },
      {
        _id: "E025",
        nombre_estudiante: "Gabriel Alejandro Rojas Mora",
        materia: "Literatura",
        nota1: 88,
        nota2: 89,
        nota3: 87,
        promedio: calcularPromedio(88, 89, 87),
        condicion: "Aprobado",
        cuatrimestre: 2
      }
    ];

    await db.collection(collectionName).createIndex({
      cuatrimestre: 1,
      condicion: 1
    });

    console.log("Índice creado en cuatrimestre y condicion.");

    await db.collection(collectionName).insertMany(estudiantes);

    console.log("25 documentos insertados.");

    const total = await db.collection(collectionName).countDocuments();

    console.log("Total de documentos en la colección:", total);
  } catch (error) {
    console.error("Error en la configuración:", error);
  } finally {
    await client.close();
  }
}

setupDB();