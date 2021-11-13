const express = require('express');

const auth = require('./middlewares/auth');

const BillController = require('./controllers/BillController');
const GroupController = require('./controllers/GroupController');
const UserController = require('./controllers/UserController');
const FriendController = require('./controllers/FriendController');

const routes = express.Router();

/* routes.get('/bills', auth, BillController.index);
routes.get('/bills/:id', auth, BillController.show);
routes.post('/bills', auth, BillController.store);

routes.get('/groups', GroupController.index);
routes.get('/groups/:id', GroupController.show);
routes.post('/groups', GroupController.store); */

routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.post('/users/auth', UserController.auth);
routes.post('/users', UserController.store);

/* routes.get('/users/:id/friends', FriendController.show);
routes.post('/users/:id/friends', FriendController.store); */

module.exports = routes;
