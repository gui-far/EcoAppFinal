import knex from '../database/connection';
import {Request, Response} from 'express'

class ItemsController {
    //Get all Items (Oil, Batteries...)
    async index(req: Request, res: Response)  {

        const items = await knex('items').select('*')
    
        const serializedItems = items.map( item => {
            return {
                id: item.id,
                name: item.title,
                image_url: `http://192.168.0.3:3333/uploads/${item.image}`
            }
        })
    
        console.log(serializedItems);

        return res.json(serializedItems)
    }
}

export default ItemsController