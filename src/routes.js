import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import authMiddlwere from './app/middlewares/auth';

import UserController from './app/controlles/UserController';
import SessionController from './app/controlles/SessionController';
import ProductController from './app/controlles/ProductController';
import CategoryController from './app/controlles/CategoryController';
import OrderController from './app/controlles/OrderController';

const routes = new Router()

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddlwere)

routes.post('/products', upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index);
routes.put('/products/:id', upload.single('file'), ProductController.update);

routes.post('/categories', upload.single('file'), CategoryController.store);
routes.get('/categories', CategoryController.index);
routes.put('/categories/:id', upload.single('file'), CategoryController.update);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update)

export default routes;

