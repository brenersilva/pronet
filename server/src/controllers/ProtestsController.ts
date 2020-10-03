import { Request, Response } from 'express';

import db from '../database/connection';

export default class ProtestsController {
  async index(request: Request, response: Response) {
    const filters = request.query;

    const number_protest = filters.number_protest as string;
    const customer_id = filters.customer_id as string;

    if (filters.number_protest) {
      const protests = await db('protests')
        .where('protests.number_protest', '=', number_protest)
        .join('customers', 'protests.customer_id', '=', 'customers.id')
        .select(['protests.*', 'customers.name']);
      response.json(protests);
    } else if (filters.customer_id) {
      const customers = await db('customers')
        .where('customers.id', '=', customer_id)
        .join('protests', 'protests.customer_id', '=', 'customers.id')
        .select(['protests.*', 'customers.name']);
      response.json(customers);
    } else {
      const protests = await db('protests')
        .join('customers', 'protests.customer_id', '=', 'customers.id')
        .select(['protests.*', 'customers.name'])
        .orderBy('number_protest');
      response.json(protests);
    };
  };

  async create(request: Request, response: Response) {
    const {
      number_protest,
      customers_id,
      customers_name,
      cost_protest,
      creation_date,
      send_date,
      return_date,
      payment_date,
      situation,
    } = request.body;
    
    const trx = await db.transaction();
    
    try {
      const insertedCustomersIds = await trx('customers').insert({
        id: customers_id,
        name: customers_name,
      });
      
      const customer_id = insertedCustomersIds[0];
      
      await trx('protests').insert({
        number_protest,
        customer_id,
        cost_protest,
        creation_date,
        send_date,
        return_date,
        payment_date,
        situation,
      });
      
      await trx.commit();
      
      return response.status(201).send();
    } catch (err) {
      console.log(err);
    
      await trx.rollback();
    
      return response.status(400).json({
        error: 'Unexpected error while creating new protest',
      });
    };
  };
};
