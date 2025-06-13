const express = require('express');
const path = require('path');
const UserRoutes = require('./routes/userRoutes');
const gastoRoutes = require('./routes/gastoRoutes');
const suscripcionRoutes = require('./routes/suscripcionRoutes');
const consumoRoutes = require('./routes/consumoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const frecuenciaRoutes = require('./routes/frecuenciaRoutes');
const emailRoutes = require('./routes/emailRoutes');
const cronRoutes = require('./routes/cronRoutes');
const errorHandler = require('./middlewares/errorMiddleware');
const notFoundHandler = require('./middlewares/notFoundHandler');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const app = express();
app.set('trust proxy', 1);

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

['/user', '/gasto', '/suscripcion', '/consumo', '/api', '/categorias'].forEach((ruta) =>
  app.use(ruta, apiLimiter)
);

app.use('/user', UserRoutes);
app.use('/gasto', gastoRoutes);
app.use('/suscripcion', suscripcionRoutes);
app.use('/consumo', consumoRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/frecuencias', frecuenciaRoutes);
app.use('/email', emailRoutes);
app.use('/cron', cronRoutes);

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;