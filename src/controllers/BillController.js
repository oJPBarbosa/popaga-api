const Bill = require('../models/Bill');
const Group = require('../models/Group');

const { v4 } = require('uuid');
const validate = require('uuid-validate');

const updateGroupStatuses = async (group_id) => {
  const statuses = await Bill.findAll({
    where: { group_id },
    attributes: ['status'],
  });

  let grade = parseInt(statuses.length / 2);

  statuses.forEach((status) => {
    const _status = status.get('status').toLowerCase();

    if (_status === 'to be paid') grade--;
    else if (_status === 'paid off') grade++;
    else if (_status === 'archived') grade--;
  });

  const group = await Group.findByPk(group_id);

  if (grade > statuses.length / 2) group.status = 'cool';
  else if (grade === statuses.length / 2) group.status = 'normal';
  else if (grade < statuses.length / 2) group.status = 'negative';

  await group.save();
};

module.exports = {
  async index(req, res) {
    const bill_id = req.query.bill;
    const group_id = req.query.group;

    if (bill_id && group_id)
      return res.status(400).send({
        error: `Only one query param is allowed at a time`,
      });

    try {
      if (bill_id) {
        if (bill_id === '' || !validate(bill_id, 4))
          return res.status(400).send({
            error: 'Bad bill',
          });

        const bill = await Bill.findOne({
          where: { id: bill_id },
          attributes: ['name', 'description', 'value', 'status', 'created_at'],
          include: [
            {
              model: Group,
              as: 'group',
              attributes: ['id', 'name', 'status'],
            },
          ],
        });

        if (!bill || bill.length === 0)
          return res.status(404).send({
            error: `Bill ${bill_id} not found`,
          });

        updateGroupStatuses(bill.get('group')['id']);

        return res.status(200).json(bill);
      } else if (group_id) {
        if (group_id === '' || !validate(group_id, 4))
          return res.status(400).send({
            error: 'Bad group',
          });

        const bills = await Bill.findAll({
          where: { group_id },
          attributes: [
            'id',
            'name',
            'description',
            'value',
            'status',
            'created_at',
          ],
        });

        const group = await Group.findOne({
          where: {
            id: group_id,
          },
          attributes: ['name', 'status', 'created_at'],
        });

        if (!bills || bills.length === 0)
          return res.status(404).send({
            error: `Group ${group_id} has no bills`,
          });

        updateGroupStatuses(group_id);

        return res.status(200).json({
          group,
          bills,
        });
      }

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
            model: Group,
            as: 'group',
            attributes: ['id', 'name', 'status'],
          },
        ],
      });

      if (!bills || bills.length === 0)
        return res.status(404).send({
          error: 'Bills not found',
        });

      bills.forEach((bill) => {
        updateGroupStatuses(bill.get('group')['id']);
      });

      return res.status(200).json(bills);
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
        error: `Bad name`,
      });

    const { description } = req.body;
    if (!description || description === '')
      return res.status(400).send({
        error: `Bad description`,
      });

    const { value } = req.body;
    if (!value || value === '')
      return res.status(400).send({
        error: `Bad value`,
      });

    const { status } = req.body;
    if (!status || status === '')
      return res.status(400).send({
        error: `Bad status`,
      });

    const { group_id } = req.body;
    if (!group_id || group_id === '' || !validate(group_id, 4))
      return res.status(400).send({
        error: 'Bad group',
      });

    const exists = await Group.findByPk(group_id);
    if (!exists)
      return res.status(404).send({
        error: `Group ${group_id} not found`,
      });

    const id = v4();
    try {
      const bill = await Bill.create({
        id,
        name,
        description,
        value,
        status,
        group_id,
      });

      updateGroupStatuses(group_id);

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
    const { name, description, value, status } = req.body;

    if (id === '' || !validate(id, 4))
      return res.status(400).send({
        error: 'Bad bill',
      });

    if (!name && !description && !value && !status)
      return res.status(400).send({
        error: 'Nothing to update',
      });

    try {
      const bill = await Bill.findByPk(id);

      if (!bill)
        return res.status(400).send({
          error: `Bill ${id} not found`,
        });

      bill.name = name;
      bill.description = description;
      bill.value = value;
      bill.status = status;

      updateGroupStatuses(bill.get('group_id'));
      await bill.save();

      return res.status(200).send({
        message: `Bill ${id} updated successfully`,
      });
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },

  async destroy(req, res) {
    const { id } = req.params;

    if (id === '' || !validate(id, 4))
      return res.status(400).send({
        error: 'Bad bill',
      });

    try {
      const bill = await Bill.findByPk(id);

      if (!bill)
        return res.status(404).send({
          error: `Bill ${id} not found`,
        });

      updateGroupStatuses(bill.get('group_id'));
      await bill.destroy();

      return res.status(200).send({
        message: `Bill ${id} deleted successfully`,
      });
    } catch {
      return res.status(500).send({
        error: 'Server fail',
      });
    }
  },
};
