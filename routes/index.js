const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/branch", require("./branch"));
router.use("/branchjunction", require("./branchjunction"));
router.use("/category", require("./category"));
router.use("/customer", require("./customer"));
router.use("/employee", require("./employee"));
router.use("/item", require("./item"));
router.use("/order", require("./order"));
router.use("/permission", require("./permission"));
router.use("/petty-cash", require("./petty-cash"));
router.use("/product", require("./product"));
router.use("/report", require("./report"));
router.use("/return", require("./return"));
router.use("/role", require("./role"));
router.use("/scan", require("./scan"));
router.use("/subcategory", require("./subcategory"));
router.use("/shipment", require("./shipment"));
router.use("/supplier", require("./supplier"));
router.use("/tailor", require("./tailor"));

module.exports = router;
