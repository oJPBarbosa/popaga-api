const express = require('express');

const auth = require('./middlewares/auth');

const BillController = require('./controllers/BillController');
const GroupController = require('./controllers/GroupController');
const UserController = require('./controllers/UserController');
const FriendController = require('./controllers/FriendController');

const routes = express.Router();

// TODO: add prevention verifications

routes.get('/bills', auth, BillController.index);
routes.post('/bills', auth, BillController.store);
routes.put('/bills/:id', auth, BillController.update);
routes.delete('/bills/:id', auth, BillController.destroy);

routes.get('/groups', GroupController.index);
routes.get('/groups/:id', GroupController.show);
routes.post('/groups', GroupController.store);
// routes.put('/groups/:id', auth (?), GroupController.update); // TODO
// routes.delete('/groups/:id', auth (?), GroupController.destroy); // TODO

routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.post('/users/auth', UserController.auth);
routes.post('/users', UserController.store);
// routes.put('/users/:id', auth (?), UserController.update); // TODO
// routes.delete('/users/:id', auth (?), UserController.destroy); // TODO

// routes.get('/friendships/:id', auth, FriendController.friendship (?))
routes.get('/users/:id/friends', auth, FriendController.show);
routes.post('/users/:id/friends', auth, FriendController.store);
// routes.delete('/users/:id/friends', auth, FriendController.store); // TODO

module.exports = routes;
