const express = require('express');
const router = express.Router();
const Customer = require('../db/models/customer-schema');
const helpers = require('../helpers/user-validation');
const CustomerService = require('../services/customer-service')(Customer);

// Get all  Customers
router.get('/', helpers.validateUser, helpers.isAdmin, async function (req, res, next) {
  try {
    let response = await CustomerService.getAllCustomers();
    if (response) {
      res.json(response);
    }
  } catch (error) {
    next(error);
  }
});


// Get a Customer By Id
router.get('/:id', helpers.validateUser, helpers.isAdmin, async function (req, res, next) {
  let customerId=req.params.id;
  try {
    let response = await CustomerService.getCustomerById(customerId);
    if (response) {
      res.json(response);
    }
  } catch (error) {
    next(error);
  }
});


// @ts-check
// Add new Customer
router.post('/add', helpers.validateUser, helpers.isAdmin, async function (req, res, next) {
  let {
    ...customer
  } = req.body;
  try {
    let response = await CustomerService.addCustomer(customer);
    res.json(response);
  } catch (error) {
    next(error);
  }

});


// Update a Customer
router.put('/update/:id', helpers.validateUser, helpers.isAdmin, async function (req, res, next) {
  let customerId = req.params.id;
  let customer = {
    ...req.body
  };

  try {
    let response = await CustomerService.updateCustomer(customerId, customer);
    if (response) {
      res.json(response);
    }
  } catch (error) {
    next(error);
  }
});


// remove a Customer
router.delete('/delete/:id', helpers.validateUser, helpers.isAdmin, async function (req, res, next) {
  let customerId = req.params.id;

  try {
    let response = await CustomerService.removeCustomer(customerId);
    if (response) {
      res.json(response);
    }
  } catch (error) {
    next(error);
  }
});



module.exports = router;