const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/branch", require("./branch"));
router.use("/category", require("./category"));
router.use("/customer", require("./customer"));
router.use("/employee", require("./employee"));
router.use("/permission", require("./permission"));
router.use("/product", require("./product"));
router.use("/role", require("./role"));
router.use("/subcategory", require("./subcategory"));
router.use("/supplier", require("./supplier"));

module.exports = router;
