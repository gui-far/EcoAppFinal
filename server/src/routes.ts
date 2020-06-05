//Import Express...
import express from 'express'
//Celebrate uses an the "joi" api
//Celebrate's job is to facilitate integration with express
//While Joi really does the validation stuff
import { celebrate, Joi} from 'celebrate'

import PointsController from './controllers/pointsController'
import ItemsController from './controllers/itemsController'

import multer from 'multer'
import multerConfig from './config/multer'

//These routes allow you to use the routes in this separate file (outside of "server.ts")
const routes = express.Router();
const upload = multer(multerConfig)

//Constructors...
const itemsController = new ItemsController();
const pointsController = new PointsController();

//Routes...
routes.get('/items', itemsController.index)

routes.get('/points/:id', pointsController.show)


routes.get('/points', pointsController.index)

//Allows upload
routes.post(
    '/points',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required()
        },)
    },{abortEarly: false}),
    pointsController.create)

//Exports so it can be imported inside "server.ts"
export default routes;