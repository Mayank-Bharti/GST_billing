import Customer from "../models/Customer.js";

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create a customer
// @route   POST /api/customers
// @access  Private
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, gstin, pan } = req.body;

    const customerExists = await Customer.findOne({ phone });
    if (customerExists) {
      return res.status(400).json({ message: "Customer with this phone already exists" });
    }

    const customer = new Customer({
      name,
      email,
      phone,
      address,
      gstin,
      pan,
    });

    const createdCustomer = await customer.save();
    res.status(201).json(createdCustomer);
  } catch (error) {
    res.status(400).json({ message: "Invalid customer data", error: error.message });
  }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Private
export const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, gstin, pan } = req.body;

    const customer = await Customer.findById(req.params.id);

    if (customer) {
      customer.name = name || customer.name;
      customer.email = email || customer.email;
      customer.phone = phone || customer.phone;
      customer.address = address || customer.address;
      customer.gstin = gstin || customer.gstin;
      customer.pan = pan || customer.pan;

      const updatedCustomer = await customer.save();
      res.json(updatedCustomer);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid customer data", error: error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private/Admin
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      await customer.deleteOne();
      res.json({ message: "Customer removed" });
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
