import { Request, Response } from 'express';

import db from '../database/connection';

export default class SituationsController {
  async index(request: Request, response: Response) {
    const filters = request.query;

    const situations_name = filters.situations_name as string;

    if (filters.situations_name) {
      const situations = await db('situations')
        .where('situations.situations_name', '=', situations_name)
        .select(['situations.*', 'situations.situations_name']);
      response.json(situations);
    } else {
      const situations = await db('situations')
        .select(['situations.*', 'situations.situations_name']);
      response.json(situations);
    }
  };

  async create(request: Request, response: Response) {
    const {
      situations_name,
    } = request.body;

    const trx = await db.transaction();

    try {
      const situations = await trx('situations')
        .select('situations_name');
      
      const situationExist = situations.find(name => name.situations_name == situations_name);

      if (!situationExist) {
        await trx('situations').insert({
          situations_name,
        });

        await trx.commit();

        return response.status(201).send();
      } else {
        await trx.rollback();

        return response.status(400).json({
          error: 'Situation already exist',
        });
      }
    } catch (err) {
      console.log(err);

      await trx.rollback();

      return response.status(400).json({
        error: 'Unexpected error while creating new situation',
      });
    };
  };
};
