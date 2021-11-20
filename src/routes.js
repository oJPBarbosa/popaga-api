const express = require('express');

const auth = require('./middlewares/auth');

const BillController = require('./controllers/BillController');
const GroupController = require('./controllers/GroupController');
const UserController = require('./controllers/UserController');
const FriendshipController = require('./controllers/FriendshipController');

const routes = express.Router();

routes.get('/bills', auth, BillController.index);
routes.post('/bills', auth, BillController.store);
routes.put('/bills/:id', auth, BillController.update);
routes.delete('/bills/:id', auth, BillController.destroy);

routes.get('/groups', auth, GroupController.index);
routes.get('/groups/:id', auth, GroupController.show);
routes.post('/groups', auth, GroupController.store); // DOING
routes.put('/groups/:id', auth, GroupController.update); // DOING
routes.delete('/groups/:id', auth, GroupController.destroy); // DOING

routes.get('/users', auth, UserController.index);
routes.get('/users/:id', auth, UserController.show);
routes.post('/users', UserController.store);
routes.post('/users/auth', UserController.auth);
routes.put('/users/:id', auth, UserController.update);
routes.delete('/users/:id', auth, UserController.destroy);

routes.get('/users/:id/friends', auth, FriendshipController.show); // TODO
routes.post('/users/:id/friends', auth, FriendshipController.store); // TODO
// routes.delete('/users/:id/friends', auth, FriendController.destroy); // TODO

module.exports = routes;
