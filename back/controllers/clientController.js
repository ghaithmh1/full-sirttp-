const createHttpError = require("http-errors");
const Client = require("../models/clientModel");
const { default: mongoose } = require("mongoose");

const addClient = async (req, res, next) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res
      .status(201)
      .json({ success: true, message: "Client created!", data: client });
  } catch (error) {
    next(error);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const client = await Client.findById(id);
    if (!client) {
      const error = createHttpError(404, "Client not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
};

const getClients = async (req, res, next) => {
  try {
  const clients = await Client.find();
    res.status(200).json({ data: clients });
  } catch (error) {
    next(error);
  }
};


const updateClient = async (req, res, next) => {
  try {
    const updates = req.body; // Use all fields from body
    const { id } = req.params;

    console.log("Request body:", req.body);
    console.log("Client ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    // Optional: Prevent updating certain fields like _id
    delete updates._id;

    if (Object.keys(updates).length === 0) {
      return next(createHttpError(400, "No fields provided for update"));
    }

    const client = await Client.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!client) {
      const error = createHttpError(404, "Client not found!");
      return next(error);
    }

    res.status(200).json({ success: true, message: "Client updated", data: client });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Invalid id!"));
    }

    const client = await Client.findByIdAndDelete(id);
    if (!client) {
      return next(createHttpError(404, "Client not found!"));
    }

    res
      .status(200)
      .json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    next(error);
  }
};


module.exports = { addClient, getClientById, getClients, updateClient, deleteClient };