const express = require('express');
const path = require('path');
const UserRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorMiddleware');
const notFoundHandler = require('./middlewares/notFoundHandler');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
app.set('trust proxy', 1); // ⬅️ AÑADE ESTA LÍNEA AQUÍ

app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173','https://pruebadesplieguebackend.onrender.com','http://192.168.1.136:3000','http://localhost:3000',
    'https://prueba-despliegue-frontend.vercel.app','https://prueba-despliegue-frontend-3xiih9qlp-nestor-vmps-projects.vercel.app'],
  credentials: true
}));

app.use(helmet());
app.use(mongoSanitize());

const apiLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones desde esta IP'
});

app.use('/api', apiLimiter);

app.use('/user', UserRoutes);

/*app.get('/', (req, res) => {
  res.send('API de backend en funcionamiento');
});*/

// ⬇️ SIRVE STATIC DEL FRONTEND DESPUÉS DE LAS RUTAS API
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// ⬇️ Para React Router (SPA), sirve el index.html si no matchea rutas anteriores
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;