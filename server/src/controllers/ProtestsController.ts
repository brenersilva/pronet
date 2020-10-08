import { Request, Response } from 'express';

import db from '../database/connection';

export default class ProtestsController {
  async index(request: Request, response: Response) {
    const filters = request.query;

    const protests_number = filters.protests_number as string;
    const customers_id = filters.customers_id as string;
    const customers_name = filters.customers_name as string;
    const situations_name = filters.situations_name as string;

    if (filters.protests_number) {
      const protests = await db('protests')
        .where('protests.protests_number', '=', protests_number)
        .join('customers', 'protests.customers_id', '=', 'customers.customers_id')
        .select(['protests.*', 'customers.customers_name'])
        .join('situations', 'protests.situations_id', '=', 'situations.situations_id')
        .select(['protests.*', 'situations.situations_name']);
      response.json(protests);
    } else if (filters.customers_id) {
      const customers = await db('customers')
        .where('customers.customers_id', '=', customers_id)
        .join('protests', 'protests.customers_id', '=', 'customers.customers_id')
        .select(['protests.*', 'customers.customers_name'])
        .join('situations', 'protests.situations_id', '=', 'situations.situations_id')
        .select(['protests.*', 'situations.situations_name']);
      response.json(customers);
    } else if (filters.customers_name) {
      const customers = await db('customers')
        .where('customers.customers_name', '=', customers_name)
        .join('protests', 'protests.customers_id', '=', 'customers.customers_id')
        .select(['protests.*', 'customers.customers_name'])
        .join('situations', 'protests.situations_id', '=', 'situations.situations_id')
        .select(['protests.*', 'situations.situations_name'])
        .orderBy('protests_number');
      response.json(customers);
    } else if (filters.situations_name) {
      const situations = await db('situations')
        .where('situations.situations_name', '=', situations_name)
        .join('customers', 'protests.customers_id', '=', 'customers.customers_id')
        .select(['protests.*', 'customers.customers_name'])
        .join('protests', 'protests.situations_id', '=', 'situations.situations_id')
        .select((['protests.*', 'situations.situations_name']))
        .orderBy('protests_number');
      response.json(situations);
    } else {
      const protests = await db('protests')
        .join('customers', 'protests.customers_id', '=', 'customers.customers_id')
        .select(['protests.*', 'customers.customers_name'])
        .join('situations', 'protests.situations_id', '=', 'situations.situations_id')
        .select(['protests.*', 'situations.situations_name'])
        .orderBy('protests_number');
      response.json(protests);
    };
  };

  async create(request: Request, response: Response) {
    const {
      protests_number,
      customers_id,
      customers_name,
      protests_cost,
      protests_creation,
      protests_send,
      protests_return,
      protests_payment,
      situations_id,
    } = request.body;
    
    const trx = await db.transaction();
    
    try {
      const customers = await trx('customers')
        .select('customers_id');

      const customersExist  = customers.find(id => id.customers_id == customers_id);

      if (!customersExist) {
        await trx('customers').insert({
          customers_id,
          customers_name,
        });
  
        await trx('protests').insert({
          protests_number,
          customers_id,
          protests_cost,
          protests_creation,
          protests_send,
          protests_return,
          protests_payment,
          situations_id,
        });
          
        await trx.commit();
  
        return response.status(201).send();
      } else {
        await trx('protests').insert({
          protests_number,
          customers_id,
          protests_cost,
          protests_creation,
          protests_send,
          protests_return,
          protests_payment,
          situations_id,
        });
        
        await trx.commit();
        
        return response.status(201).send();
      }
    } catch (err) {
      console.log(err);
    
      await trx.rollback();
    
      return response.status(400).json({
        error: 'Unexpected error while creating new protest',
      });
    };
  };
};
