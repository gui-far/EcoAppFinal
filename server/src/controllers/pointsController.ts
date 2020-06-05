import knex from '../database/connection';
import {Request, Response, response} from 'express'

class PointsControler {

    //Get all Points/Locations
    async index (req: Request, res : Response) {

        const { city, uf, items} = req.query;

        const parsedItems = String(items).split(',')
        .map(item => Number(item.trim()))

        const points = await knex('points')
        .join('point_items','points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*')

        const serializedPoints = points.map( point => {
            return {
                ...point,
                image_url: `http://192.168.0.3:3333/uploads/${point.image}`
            }
        })

        return res.json(serializedPoints);

    }

    //Get data for one specific Point/Location
    async show (req : Request, res : Response) {

        const { id } = req.params;
        const point = await knex('points').where('id', id).first()


        if(!point) {
            return res.status(400).json({message: "Point not found."})
        }

        const serializedPoint = {
                ...point,
                image_url: `http://192.168.0.3:3333/uploads/${point.image}`
            }
      

        const items = await knex('items')
        .join('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id)
        .select('items.title')

        return res.json({point: serializedPoint, items});

    }

    //Create a now Point/Location
    async create (req: Request, res: Response) {

        //Destructuring...
        const { name, email, whatsapp, latitude, longitude, city, uf, items} = req.body;
    
        const trx = await knex.transaction();
    
        const insertedIds = await trx('points').insert({
            image: req.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        })
    
        const point_id = insertedIds[0];
    
        const pointItems = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id : number) => {
            return {
                item_id,
                point_id
            }
        })
    


        await trx('point_items').insert(pointItems)
    
    
        await trx.commit();
      
        return res.json({ point_id })
            
    }
    
}

export default PointsControler