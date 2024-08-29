// @desc Get all contacts
// @route GET /api/v1/contacts
// @access Public

const path = require("path");
const Contact = require("../models/Contact");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const mongoose = require("mongoose");

exports.getContacts = asyncHandler(async (req, res, next) => {
  let query;

    if(req.params.userId){
      
    // Make sure user is contact owner
    if (req.user.id != req.params.userId && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.params.id} is not authorized to access this contact list.`,
          401
        )
      );
    }
      query = Contact.find({user:req.params.userId});
    }
    else{
      query = await Contact.find();
    }

    const contacts = await query;

    res.status(200).json({success:true, data:contacts});
});

// @desc Get Single Contact
// @route GET /api/v1/contacts/:id
// @access Public
exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(
      new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: contact });
});

// @desc Create Contact
// @route Post /api/v1/contacts
// @access Private

exports.createContact = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const contact = await Contact.create(req.body);

  res
    .status(200)
    .json({ success: true, data: contact, msg: "Created new contact" });
});


// @desc Update Contact
// @route PUT /api/v1/contacts/:id
// @access Private

exports.updateContact = asyncHandler(async (req, res, next) => {
  
    let contact = await Contact.findById(req.params.id);

    if(!contact){
      return next(new ErrorResponse(`Contact not found with specified id`));
    }
   
    // Make sure user is contact owner
    if (contact.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `User ${req.params.id} is not authorized to update this contact.`,
          401
        )
      );
    }
  
    contact = await Contact.findOneAndUpdate(new mongoose.Types.ObjectId(req.params.id), req.body, {
      new: true,
      runValidators: true,
    });

  res
    .status(200)
    .json({ success: true, data: contact, msg: "Updated contact" });
});


// @desc Delete Contact
// @route Delete /api/v1/contacts/:id
// @access Private

exports.deleteContact = asyncHandler(async (req, res, next) => {

  const contact = await Contact.findById(req.params.id);

  // Make sure user is contact owner
  if (contact.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this contact`,
        401
      )
    );
  }

  await contact.deleteOne();

  res
    .status(200)
    .json({ success: true, data: {}, msg: "Deleted contact" });
});

