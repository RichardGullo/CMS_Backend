const express = require("express");
const {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
} = require("../controllers/contacts");

const router = express.Router({mergeParams:true});

const { protect, authorize } = require("../middleware/auth");


router
  .route("/")
  .get(getContacts)
  .post(protect, createContact);

router.route("/:id").get(getContact).delete(protect,deleteContact).put(protect,updateContact);



module.exports = router;
