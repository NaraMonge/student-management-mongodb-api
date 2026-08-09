const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const collectionName = process.env.COLLECTION_NAME;

// Ruta principal
app.get("/", (req, res) => {
  res.send("API Simulación 2 funcionando correctamente");
});

// Listar todos los estudiantes
app.get("/api/estudiantes", async (req, res) => {
  try {
    const db = await connectDB();

    const estudiantes = await db
      .collection(collectionName)
      .find()
      .toArray();

    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar estudiante por ID
app.get("/api/estudiantes/:id", async (req, res) => {
  try {
    const db = await connectDB();

    const estudiante = await db.collection(collectionName).findOne({
      _id: req.params.id
    });

    if (!estudiante) {
      return res.status(404).json({
        mensaje: "Estudiante no encontrado"
      });
    }

    res.json(estudiante);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Insertar estudiante
app.post("/api/estudiantes", async (req, res) => {
  try {
    const db = await connectDB();

    const resultado = await db
      .collection(collectionName)
      .insertOne(req.body);

    res.status(201).json({
      mensaje: "Estudiante insertado correctamente",
      insertedId: resultado.insertedId
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al insertar estudiante",
      error: error.message
    });
  }
});

// Actualizar estudiante
app.put("/api/estudiantes/:id", async (req, res) => {
  try {
    const db = await connectDB();

    const resultado = await db.collection(collectionName).updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );

    res.json({
      mensaje: "Actualización realizada",
      matchedCount: resultado.matchedCount,
      modifiedCount: resultado.modifiedCount
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar estudiante",
      error: error.message
    });
  }
});

// Eliminar estudiante
app.delete("/api/estudiantes/:id", async (req, res) => {
  try {
    const db = await connectDB();

    const resultado = await db.collection(collectionName).deleteOne({
      _id: req.params.id
    });

    res.json({
      mensaje: "Eliminación realizada",
      deletedCount: resultado.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Consulta 4a: estudiantes aprobados con excelencia
app.get("/api/consultas/excelencia", async (req, res) => {
  try {
    const { nombre } = req.query;
    const db = await connectDB();

    const resultado = await db.collection(collectionName).find({
      nombre_estudiante: nombre,
      condicion: "Aprobado",
      nota1: { $gte: 90 },
      nota2: { $gte: 90 },
      nota3: { $gte: 90 }
    }).toArray();

    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Consulta 4b: estudiantes por cuatrimestre y nombre sin apellidos
app.get("/api/consultas/cuatrimestre-nombre", async (req, res) => {
  try {
    const { cuatrimestre, nombre } = req.query;
    const db = await connectDB();

    const resultado = await db.collection(collectionName).find({
      cuatrimestre: Number(cuatrimestre),
      nombre_estudiante: {
        $regex: `^${nombre}\\s`,
        $options: "i"
      }
    }).toArray();

    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Consulta 4c: estudiantes con nota menor a 70 y condición Reprobado
app.get("/api/consultas/reprobados", async (req, res) => {
  try {
    const db = await connectDB();

    const resultado = await db.collection(collectionName).find({
      promedio: { $lt: 70 },
      condicion: "Reprobado"
    }).toArray();

    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Consulta 4d: promedio general por cuatrimestre
app.get("/api/consultas/promedio-cuatrimestre", async (req, res) => {
  try {
    const { cuatrimestre } = req.query;
    const db = await connectDB();

    const resultado = await db.collection(collectionName).aggregate([
      {
        $match: {
          cuatrimestre: Number(cuatrimestre)
        }
      },
      {
        $group: {
          _id: "$cuatrimestre",
          promedio_general: { $avg: "$promedio" },
          total_estudiantes: { $sum: 1 }
        }
      }
    ]).toArray();

    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Consulta 4e: nota más baja de un cuatrimestre para un estudiante específico
app.get("/api/consultas/nota-baja", async (req, res) => {
  try {
    const { cuatrimestre, nombre } = req.query;
    const db = await connectDB();

    const resultado = await db.collection(collectionName).aggregate([
      {
        $match: {
          cuatrimestre: Number(cuatrimestre),
          nombre_estudiante: nombre
        }
      },
      {
        $project: {
          _id: 1,
          nombre_estudiante: 1,
          materia: 1,
          cuatrimestre: 1,
          nota1: 1,
          nota2: 1,
          nota3: 1,
          promedio: 1,
          condicion: 1,
          nota_mas_baja: {
            $min: ["$nota1", "$nota2", "$nota3"]
          }
        }
      },
      {
        $sort: {
          nota_mas_baja: 1
        }
      },
      {
        $limit: 1
      }
    ]).toArray();

    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Consulta 4f: promedio general de Literatura por cuatrimestre
app.get("/api/consultas/promedio-literatura", async (req, res) => {
  try {
    const { cuatrimestre } = req.query;
    const db = await connectDB();

    const resultado = await db.collection(collectionName).aggregate([
      {
        $match: {
          cuatrimestre: Number(cuatrimestre),
          materia: "Literatura"
        }
      },
      {
        $group: {
          _id: {
            cuatrimestre: "$cuatrimestre",
            materia: "$materia"
          },
          promedio_literatura: { $avg: "$promedio" },
          total_registros: { $sum: 1 }
        }
      }
    ]).toArray();

    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Levantar servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${process.env.PORT}`);
});