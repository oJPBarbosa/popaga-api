const Bill = require('../models/Bill');
const User = require('../models/User');
const UserBill = require('../models/UserBill');

const { v4 } = require('uuid');
const validate = require('uuid-validate');

module.exports = {
  async index(req, res) {
    try {
      const bills = await Bill.findAll({
        attributes: [
          'id',
          'name',
          'description',
          'value',
          'status',
          'created_at',
        ],
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username', 'email', 'avatar'],
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

      if (!bills || bills.length === 0)
        return res.status(404).send({
          error: 'Bills not found',
        });

      return res.status(200).json(bills);
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    try {
      const bill = await Bill.findByPk(id, {
        attributes: [
          'id',
          'name',
          'description',
          'value',
          'status',
          'created_at',
        ],
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username', 'email', 'avatar'],
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

      if (!bill)
        return res.status(404).send({
          error: 'Bill not found',
        });

      return res.status(200).json(bill);
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

    const { description } = req.body;
    if (!description || description === '')
      return res.status(400).send({
        error: 'Invalid description',
      });

    const { value } = req.body;
    if (!value || value === '')
      return res.status(400).send({
        error: 'Invalid value',
      });

    const { status } = req.body;
    if (!status || status === '')
      return res.status(400).send({
        error: 'Invalid status',
      });

    const { owner_id } = req.body;
    if (!validate(owner_id, 4))
      return res.status(400).send({
        error: 'Invalid owner',
      });

    const exists = await User.findByPk(owner_id);
    if (!exists)
      return res.status(404).send({
        error: 'Owner not found',
      });

    const users_emails = req.body.users_emails ? req.body.users_emails : [];

    try {
      const bill = await Bill.create({
        id: v4(),
        name,
        description,
        value,
        status,
        owner_id,
      });

      const owner_email = (await User.findByPk(owner_id)).get('email');

      if (!users_emails.includes(owner_email)) users_emails.push(owner_email);

      users_emails.forEach(async (user_email) => {
        const user = await User.findOne({
          where: {
            email: user_email,
          },
        });

        if (user) {
          await UserBill.create({
            id: v4(),
            bill_id: bill.get('id'),
            user_id: user.get('id'),
          });
        }
      });

      return res.status(201).json({
        id: bill.get('id'),
      });
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, description, value, status, users_emails } = req.body;

    if (!validate(id, 4))
      return res.status(400).send({
        error: 'Invalid bill',
      });

    if (!name && !description && !value && !status && !users_emails)
      return res.status(400).send({
        error: 'Nothing to update',
      });

    try {
      const bill = await Bill.findByPk(id);

      if (!bill)
        return res.status(400).send({
          error: 'Bill not found',
        });

      bill.name = name;
      bill.description = description;
      bill.value = value;
      bill.status = status;

      if (users_emails) {
        users_emails.forEach(async (user_email) => {
          const user = await User.findOne({
            where: {
              email: user_email,
            },
          });

          if (user) {
            await UserBill.create({
              id: v4(),
              bill_id: id,
              user_id: user.get('id'),
            });
          }
        });
      }

      await bill.save();

      return res.status(200).send({
        message: 'Bill updated successfully',
      });
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async destroy(req, res) {
    const { id } = req.params;

    if (!validate(id, 4))
      return res.status(400).send({
        error: 'Invalid bill',
      });

    try {
      const bill = await Bill.findByPk(id);

      if (!bill)
        return res.status(404).send({
          error: 'Bill not found',
        });

      const user_bills = await UserBill.findAll({
        where: {
          bill_id: id,
        },
      });

      user_bills.forEach(async (user_bill) => {
        await user_bill.destroy();
      });

      await bill.destroy();

      return res.status(200).send({
        message: 'Bill deleted successfully',
      });
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },
};
