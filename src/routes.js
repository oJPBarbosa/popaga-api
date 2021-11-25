const express = require('express');

const auth = require('./middlewares/auth');

const BillController = require('./controllers/BillController');
const EventController = require('./controllers/EventController');
const UserController = require('./controllers/UserController');

const routes = express.Router();

routes.get('/bills', auth, BillController.index);
routes.get('/bills/:id', auth, BillController.show);
routes.post('/bills', auth, BillController.store);
routes.put('/bills/:id', auth, BillController.update);
routes.delete('/bills/:id', auth, BillController.destroy);

routes.get('/events', auth, EventController.index);
routes.get('/events/:id', auth, EventController.show);
routes.post('/events', auth, EventController.store);
routes.put('/events/:id', auth, EventController.update);
routes.delete('/events/:id', auth, EventController.destroy);

routes.get('/users', auth, UserController.index);
routes.get('/users/:id', auth, UserController.show);
routes.post('/users', UserController.store);
routes.post('/users/auth', UserController.auth);
routes.put('/users/:id', auth, UserController.update);
routes.delete('/users/:id', auth, UserController.destroy);

module.exports = routes;
