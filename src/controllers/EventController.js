const Bill = require('../models/Bill');
const Event = require('../models/Event');
const EventBill = require('../models/EventBill');
const EventUser = require('../models/EventUser');
const User = require('../models/User');

const { v4 } = require('uuid');
const validate = require('uuid-validate');

module.exports = {
  async index(req, res) {
    try {
      const events = await Event.findAll({
        attributes: ['id', 'name', 'status', 'created_at'],
        include: [
          {
            association: 'bills',
            attributes: ['bill_id'],
            include: [
              {
                model: Bill,
                as: 'data',
                attributes: ['name', 'description', 'value', 'status'],
                include: [
                  {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'username', 'email', 'avatar'],
                  },
                ],
              },
            ],
          },
          {
            association: 'users',
            attributes: [],
            include: [
              {
                model: User,
                as: 'data',
                attributes: ['id', 'username', 'email', 'avatar'],
              },
            ],
          },
        ],
      });

      if (!events)
        return res.status(404).send({
          error: 'Events not found',
        });

      return res.json(events);
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    if (!validate(id, 4))
      return res.status(400).send({
        error: 'Invalid event',
      });

    try {
      const event = await Event.findOne({
        where: { id },
        attributes: ['id', 'name', 'status', 'created_at'],
        include: [
          {
            association: 'bills',
            attributes: ['bill_id'],
            include: [
              {
                model: Bill,
                as: 'data',
                attributes: ['name', 'description', 'value', 'status'],
                include: [
                  {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'username', 'email', 'avatar'],
                  },
                ],
              },
            ],
          },
          {
            association: 'users',
            attributes: ['user_id'],
            include: [
              {
                model: User,
                as: 'data',
                attributes: ['username', 'email', 'avatar'],
              },
            ],
          },
        ],
      });

      if (!event)
        return res.status(404).send({
          error: 'Event not found',
        });

      return res.json(event);
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async store(req, res) {
    const { name } = req.body;

    if (!name || name === '')
      return res.status(400).send({
        error: 'Invalid name',
      });

    const { users_emails } = req.body;
    if (!users_emails)
      return res.status(400).send({
        error: 'Invalid users emails',
      });

    try {
      const event = await Event.create({
        id: v4(),
        name,
        status: 'normal',
      });

      users_emails.forEach(async (user_email) => {
        const user = await User.findOne({
          where: {
            email: user_email,
          },
        });

        if (user) {
          await EventUser.create({
            id: v4(),
            event_id: event.get('id'),
            user_id: user.get('id'),
          });
        }
      });

      return res.status(201).json({
        id: event.get('id'),
      });
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, users_emails } = req.body;

    if (!validate(id, 4))
      return res.status(400).send({
        error: 'Invalid event',
      });

    if (!name && !users_emails)
      return res.status(400).send({
        error: 'Nothing to update',
      });

    try {
      const event = await Event.findByPk(id);

      if (!event)
        return res.status(404).send({
          error: 'Event not found',
        });

      event.name = name;

      users_emails.forEach(async (user_email) => {
        const user = await User.findOne({
          where: {
            email: user_email,
          },
        });

        if (user) {
          const exists = await EventUser.findOne({
            where: {
              event_id: id,
              user_id: user.get('id'),
            },
          });

          if (!exists) {
            await EventUser.create({
              id: v4(),
              event_id: event.get('id'),
              user_id: user.get('id'),
            });
          }
        }
      });

      await event.save();

      return res.status(200).send();
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async destroy(req, res) {
    const { id } = req.params;

    if (!validate(id))
      return res.status(400).send({
        error: 'Invalid event',
      });

    try {
      const event = await Event.findByPk(id);

      if (!event)
        return res.status(404).send({
          error: 'Event not found',
        });

      const event_users = await EventUser.findAll({
        where: {
          event_id: id,
        },
      });

      event_users.forEach(async (event_user) => {
        await event_user.destroy();
      });

      const event_bills = await EventBill.findAll({
        where: {
          event_id: id,
        },
      });

      event_bills.forEach(async (event_bill) => {
        const bill = await Bill.findByPk(event_bill.get('bill_id'));

        await bill.destroy();
        await event_bill.destroy();
      });

      await event.destroy();

      return res.send({
        message: 'Event deleted successfully',
      });
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },
};
