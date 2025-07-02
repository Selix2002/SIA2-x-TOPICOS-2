# 🏃🏻‍♂️ FitApp

FitApp es una aplicación móvil de fitness desarrollada con React Native y Expo que proporciona rutinas de ejercicios personalizadas basadas en objetivos de entrenamiento y nivel de actividad física del usuario.

## 🏋🏻‍♂️ Descripción General

La aplicación utiliza una base de datos SQLite local para almacenar ejercicios categorizados por grupos musculares y objetivos de entrenamiento, proporcionando recomendaciones personalizadas con videos demostrativos. 

## 📱Características Principales

### Sistema de Configuración Personalizada
- *Selección de Objetivos*: Hipertrofia, Resistencia Cardiovascular, Reducción de Grasa
- *Niveles de Actividad*: No hace ejercicio, 1-3 h/semana, 4-7 h/semana 
- *Grupos Musculares*: Bíceps, Abdomen, Cuádriceps

### Interfaz Interactiva
- *Mapa Corporal*: Selección visual de músculos mediante MuscleOverlayMap
- *Videos Demostrativos*: Reproducción automática con expo-video 
- *Parámetros Personalizados*: Series, repeticiones y descansos según frecuencia seleccionada

## 📲 Arquitectura de la Aplicación

### Estructura de Navegación
La aplicación sigue un flujo lineal de configuración:

1. *Pantalla Principal* (app/(tabs)/index.js): Inicializa la base de datos
2. *Configuración* (app/(tabs)/inicio.js): Selección de objetivo y actividad
3. *Selección Muscular* (app/(tabs)/select_musc.js): Mapa corporal interactivo
4. *Lista de Ejercicios* (app/(tabs)/lista_ejercicios.js): Ejercicios filtrados
5. *Detalle del Ejercicio* (app/(tabs)/ejercicio_detalle.js): Video y parámetros

### 🖥️ Base de Datos
Sistema SQLite con 5 tablas principales:
- musculos: Grupos musculares
- objetivos: Metas de entrenamiento  
- frecuencias: Niveles de actividad
- ejercicios: Definiciones de ejercicios
- parametros: Configuraciones de entrenamiento 

## 💻 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- Expo CLI
- Dispositivo móvil o emulador con la aplicación **Expo Go**

### Dependencias Principales
```json
{
  "expo",
  "react-native",
  "expo-router",
  "expo-sqlite",
  "expo-video",
}
```


### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Selix2002/SIA2-x-TOPICOS-2.git

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
npx expo start -c # También se puede usar este

# Posteriormente, escanear el código QR cargado en terminal a través de la aplicación Expo Go
```

### Scripts Disponibles
- `npm start` o `npx expo start -c`: Inicia Expo development server
- `npm run android`: Ejecuta en Android
- `npm run ios`: Ejecuta en iOS

## ⌨️ Funciones Principales del Código

### Inicialización de Base de Datos
La función `initDB()` crea las tablas y pobla la base de datos con ejercicios predefinidos: 
### Gestión de Estado
El componente `InicioScreen` maneja la preservación de selecciones del usuario mediante useEffect y navegación con parámetros: 

### Sistema de Videos
Resolución dual de videos con coincidencia exacta y normalizada:

### Filtrado de Ejercicios
La función `getEjerciciosPorMusculo()` filtra ejercicios por músculo y objetivo: 

## ⚙️ Configuración de Expo

La aplicación está configurada con plugins específicos para funcionalidad completa:
- `expo-router`: Navegación basada en archivos
- `expo-sqlite`: Base de datos local
- `expo-video`: Reproducción de videos
- `expo-splash-screen`: Pantalla de carga personalizada

## 📂 Estructura de Archivos

```
app/
├── (tabs)/
│   ├── index.js          # Punto de entrada y inicialización de BD
│   ├── inicio.js         # Pantalla principal de configuración
│   ├── objetivo_selection.js    # Selección de objetivos
│   ├── actividad_selection.js   # Selección de nivel de actividad
│   ├── select_musc.js    # Selección de músculos
│   ├── lista_ejercicios.js      # Lista de ejercicios filtrados
│   └── ejercicio_detalle.js     # Detalles y video del ejercicio
│   └── gymbutton.js          # Componentes de botones personalizados
components/
├── MuscleOverlayMap.js   # Mapa interactivo de músculos
services/
└── db.js                 # Servicio de base de datos SQLite
assets/
├── vids/                 # Videos de ejercicios
├── applogo.png          # Logo de la aplicación
└── body-muscles.png     # Imagen del mapa corporal
```

## 🧑‍💻 Integrantes del proyecto

- Sebastián Muñoz
- Diego Galindo
- Fernando Garay
## Notas

La aplicación utiliza expo-router/entry como punto de entrada principal y requiere permisos de almacenamiento para la base de datos SQLite. Los videos están optimizados para reproducción automática y bucle continuo para demostración de ejercicios. 
