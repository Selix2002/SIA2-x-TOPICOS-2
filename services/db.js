import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('app.db');

export async function initDB() {
  await db.withTransactionAsync(async () => {
    // Crear tablas
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS musculos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS objetivos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS frecuencias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nivel TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS ejercicios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        musculo_id INTEGER NOT NULL,
        objetivo_id INTEGER NOT NULL,
        FOREIGN KEY (musculo_id) REFERENCES musculos(id),
        FOREIGN KEY (objetivo_id) REFERENCES objetivos(id)
      );

      CREATE TABLE IF NOT EXISTS parametros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        objetivo_id INTEGER NOT NULL,
        frecuencia_id INTEGER NOT NULL,
        series TEXT NOT NULL,
        repeticiones TEXT NOT NULL,
        descanso TEXT NOT NULL,
        FOREIGN KEY (objetivo_id) REFERENCES objetivos(id),
        FOREIGN KEY (frecuencia_id) REFERENCES frecuencias(id)
      );
    `);

    // Insertar datos iniciales
    await insertInitialData();
  });
}

async function insertInitialData() {
  // Insertar músculos
  const musculos = ['Bíceps', 'Abdomen', 'Cuádriceps'];
  for (const nombre of musculos) {
    await db.runAsync(
      'INSERT OR IGNORE INTO musculos (nombre) VALUES (?)',
      [nombre]
    );
  }

  // Insertar objetivos
  const objetivos = [
    'Hipertrofia', 
    'Resistencia Cardiovascular', 
    'Reducción de Grasa'
  ];
  for (const nombre of objetivos) {
    await db.runAsync(
      'INSERT OR IGNORE INTO objetivos (nombre) VALUES (?)',
      [nombre]
    );
  }

  // Insertar frecuencias
  const frecuencias = [
    'No hace ejercicio', 
    '1–3 h/semana', 
    '4–7 h/semana'
  ];
  for (const nivel of frecuencias) {
    await db.runAsync(
      'INSERT OR IGNORE INTO frecuencias (nivel) VALUES (?)',
      [nivel]
    );
  }

  // Insertar ejercicios
  const ejerciciosData = [
    // Hipertrofia - Bíceps
    { nombre: 'Curl con banda elástica', descripcion: 'Pisa la banda con ambos pies y, con agarre supino, flexiona el codo hasta la altura del hombro.', musculo: 'Bíceps', objetivo: 'Hipertrofia' },
    { nombre: 'Curl alterno con mancuerna', descripcion: 'Sostén una mancuerna en cada mano y flexiona un brazo a la vez, controlando el descenso.', musculo: 'Bíceps', objetivo: 'Hipertrofia' },
    { nombre: 'Chin-up supino (negativos asistidos)', descripcion: 'Con agarre supino en una barra o marco de puerta, súbete con impulso ligero y desciende lentamente (3–5 s) para enfatizar la fase excéntrica.', musculo: 'Bíceps', objetivo: 'Hipertrofia' },
    
    // Hipertrofia - Abdomen
    { nombre: 'Crunch con carga', descripcion: 'Tumbado boca arriba, sujeta una botella o mochila ligera sobre el pecho y realiza el crunch tradicional.', musculo: 'Abdomen', objetivo: 'Hipertrofia' },
    { nombre: 'Elevación de piernas tumbado', descripcion: 'Con la espalda apoyada en el suelo, eleva las piernas rectas hasta 90° y baja controlando el movimiento sin apoyar los pies.', musculo: 'Abdomen', objetivo: 'Hipertrofia' },
    { nombre: 'Russian twists con peso', descripcion: 'Sentado con las piernas flexionadas, sujeta un balón o botella y rota el tronco llevando el peso hacia cada lado.', musculo: 'Abdomen', objetivo: 'Hipertrofia' },
    
    // Hipertrofia - Cuádriceps
    { nombre: 'Sentadilla con mochila', descripcion: 'Coloca una mochila con peso (libros) en la espalda y realiza sentadillas profundas (rodillas a 90°).', musculo: 'Cuádriceps', objetivo: 'Hipertrofia' },
    { nombre: 'Sentadilla búlgara', descripcion: 'Apoya un pie atrás sobre una silla, mantén el torso erguido y baja en sentadilla con la pierna delantera.', musculo: 'Cuádriceps', objetivo: 'Hipertrofia' },
    { nombre: 'Zancadas inversas', descripcion: 'Da un paso atrás y baja la rodilla trasera casi hasta el suelo, manteniendo la postura estable.', musculo: 'Cuádriceps', objetivo: 'Hipertrofia' },
    
    // Resistencia - Bíceps
    { nombre: 'Burpee con curl de bíceps', descripcion: 'Sostén un par de mancuernas, realiza un burpee y, al incorporarte, efectúa un curl de bíceps rápidamente.', musculo: 'Bíceps', objetivo: 'Resistencia Cardiovascular' },
    { nombre: 'Renegade row alterno', descripcion: 'Desde posición de plancha con dos mancuernas, rema un brazo a la vez de forma rápida y controlada.', musculo: 'Bíceps', objetivo: 'Resistencia Cardiovascular' },
    { nombre: 'Curl rápido con banda elástica', descripcion: 'Pisa la banda y ejecuta curls continuos a ritmo elevado, enfatizando velocidad.', musculo: 'Bíceps', objetivo: 'Resistencia Cardiovascular' },
    
    // Resistencia - Abdomen
    { nombre: 'Mountain climbers', descripcion: 'En plancha alta, lleva cada rodilla al pecho de forma alterna y veloz.', musculo: 'Abdomen', objetivo: 'Resistencia Cardiovascular' },
    { nombre: 'Russian twists rápidos', descripcion: 'Sentado con piernas ligeramente flexionadas, gira el tronco tocando el suelo de un lado a otro con las manos.', musculo: 'Abdomen', objetivo: 'Resistencia Cardiovascular' },
    { nombre: 'Plank jacks', descripcion: 'En plancha frontal, abre y cierra los pies en salto manteniendo el core firme.', musculo: 'Abdomen', objetivo: 'Resistencia Cardiovascular' },
    
    // Resistencia - Cuádriceps
    { nombre: 'Jump squats', descripcion: 'Desde sentadilla profunda, impulsa un salto vertical y aterriza controlado sin pausa.', musculo: 'Cuádriceps', objetivo: 'Resistencia Cardiovascular' },
    { nombre: 'Jumping lunges', descripcion: 'Alterna zancada frontal con salto explosivo, cambiando de pierna en el aire.', musculo: 'Cuádriceps', objetivo: 'Resistencia Cardiovascular' },
    { nombre: 'Tuck jumps', descripcion: 'Salta llevando las rodillas al pecho y aterriza suavemente.', musculo: 'Cuádriceps', objetivo: 'Resistencia Cardiovascular' },
    
    // Reducción - Bíceps
    { nombre: 'Squat + Curl de bíceps', descripcion: 'Sentadilla profunda seguida de un curl de bíceps al subir.', musculo: 'Bíceps', objetivo: 'Reducción de Grasa' },
    { nombre: 'Curl con banda en zona de pulsos', descripcion: 'Flexiona hasta la mitad del recorrido y realiza 10–15 pulsos cortos antes de completar la elevación.', musculo: 'Bíceps', objetivo: 'Reducción de Grasa' },
    { nombre: 'Curl alterno con mancuerna y salto ligero', descripcion: 'Flexiona un brazo mientras ejecutas un mini-salto con las rodillas semiflexionadas; alterna.', musculo: 'Bíceps', objetivo: 'Reducción de Grasa' },
    
    // Reducción - Abdomen
    { nombre: 'Bicycle crunch', descripcion: 'Tumbado, lleva codo derecho a rodilla izquierda y viceversa en ritmo continuo.', musculo: 'Abdomen', objetivo: 'Reducción de Grasa' },
    { nombre: 'Plank to knee-tap', descripcion: 'En plancha alta, lleva la rodilla al codo correspondiente y alterna rápidamente.', musculo: 'Abdomen', objetivo: 'Reducción de Grasa' },
    { nombre: 'Flutter kicks', descripcion: 'Tumbado, eleva ligeramente las piernas y realiza patadas alternas rápidas sin apoyar pies.', musculo: 'Abdomen', objetivo: 'Reducción de Grasa' },
    
    // Reducción - Cuádriceps
    { nombre: 'Jump squats', descripcion: 'Salta desde sentadilla profunda y retorna sin pausa.', musculo: 'Cuádriceps', objetivo: 'Reducción de Grasa' },
    { nombre: 'Walking lunges dinámicos', descripcion: 'Avanza en zancada manteniendo ritmo continuo y explosivo.', musculo: 'Cuádriceps', objetivo: 'Reducción de Grasa' },
    { nombre: 'Step-ups en escalón', descripcion: 'Sube y baja rápido de un escalón, alternando pierna líder.', musculo: 'Cuádriceps', objetivo: 'Reducción de Grasa' }
  ];

  for (const ej of ejerciciosData) {
    await db.runAsync(
      `INSERT OR IGNORE INTO ejercicios (nombre, descripcion, musculo_id, objetivo_id)
       VALUES (?, ?, 
         (SELECT id FROM musculos WHERE nombre = ?), 
         (SELECT id FROM objetivos WHERE nombre = ?)
       )`,
      [ej.nombre, ej.descripcion, ej.musculo, ej.objetivo]
    );
  }

  // Insertar parámetros
  const parametrosData = [
    // Hipertrofia
    { objetivo: 'Hipertrofia', frecuencia: 'No hace ejercicio', series: '1–2', repeticiones: '8–10', descanso: '90' },
    { objetivo: 'Hipertrofia', frecuencia: '1–3 h/semana', series: '3', repeticiones: '10–12', descanso: '60' },
    { objetivo: 'Hipertrofia', frecuencia: '4–7 h/semana', series: '4', repeticiones: '12–15', descanso: '45' },
    
    // Resistencia Cardiovascular
    { objetivo: 'Resistencia Cardiovascular', frecuencia: 'No hace ejercicio', series: '1–2', repeticiones: '20–30', descanso: '90' },
    { objetivo: 'Resistencia Cardiovascular', frecuencia: '1–3 h/semana', series: '2–3', repeticiones: '30–40', descanso: '60' },
    { objetivo: 'Resistencia Cardiovascular', frecuencia: '4–7 h/semana', series: '3–4', repeticiones: '40–50', descanso: '30' },
    
    // Reducción de Grasa
    { objetivo: 'Reducción de Grasa', frecuencia: 'No hace ejercicio', series: '1–2', repeticiones: '12–15', descanso: '90' },
    { objetivo: 'Reducción de Grasa', frecuencia: '1–3 h/semana', series: '2–3', repeticiones: '15–20', descanso: '60' },
    { objetivo: 'Reducción de Grasa', frecuencia: '4–7 h/semana', series: '3–4', repeticiones: '20–25', descanso: '45' }
  ];

  for (const param of parametrosData) {
    await db.runAsync(
      `INSERT OR IGNORE INTO parametros (objetivo_id, frecuencia_id, series, repeticiones, descanso)
       VALUES (
         (SELECT id FROM objetivos WHERE nombre = ?),
         (SELECT id FROM frecuencias WHERE nivel = ?),
         ?, ?, ?
       )`,
      [param.objetivo, param.frecuencia, param.series, param.repeticiones, param.descanso]
    );
  }
}

export async function getRutinas(objetivo, frecuencia) {
  return db.getAllAsync(`
    SELECT e.nombre, e.descripcion, p.series, p.repeticiones, p.descanso 
    FROM ejercicios e
    JOIN parametros p ON e.objetivo_id = p.objetivo_id
    JOIN frecuencias f ON p.frecuencia_id = f.id
    WHERE f.nivel = ? AND e.objetivo_id = (
      SELECT id FROM objetivos WHERE nombre = ?
    )
  `, [frecuencia, objetivo]);
}

export async function getObjetivos() {
  return db.getAllAsync(`SELECT * FROM objetivos`);
}

export async function getFrecuencias() {
  return db.getAllAsync(`SELECT * FROM frecuencias`);
}

export async function getEjercicios() {
  return db.getAllAsync(`SELECT * FROM ejercicios`);
}

export async function getEjercicioId(id) {
  return db.getAsync(`SELECT * FROM ejercicios WHERE id = ?`, [id]);
}

export async function getMusculosPorObjetivo(objetivoId) {
  return db.getAllAsync(`
    SELECT DISTINCT m.id, m.nombre 
    FROM ejercicios e
    JOIN musculos m ON e.musculo_id = m.id
    WHERE e.objetivo_id = ?
  `, [objetivoId]);
}

// Obtener ejercicios por músculo y objetivo
export async function getEjerciciosPorMusculo(musculoId, objetivoId) {
  return db.getAllAsync(`
    SELECT e.id, e.nombre, e.descripcion 
    FROM ejercicios e
    WHERE e.musculo_id = ? AND e.objetivo_id = ?
  `, [musculoId, objetivoId]);
}

// Obtener detalles completos de un ejercicio
export async function getEjercicioDetalle(ejercicioId, frecuenciaId) {
  return db.getAsync(`
    SELECT 
      e.nombre,
      e.descripcion,
      p.series,
      p.repeticiones,
      p.descanso,
      f.nivel AS frecuencia,
      o.nombre AS objetivo
    FROM ejercicios e
    JOIN parametros p ON e.objetivo_id = p.objetivo_id
    JOIN objetivos o ON e.objetivo_id = o.id
    JOIN frecuencias f ON p.frecuencia_id = f.id
    WHERE e.id = ? AND p.frecuencia_id = ?
  `, [ejercicioId, frecuenciaId]);
}