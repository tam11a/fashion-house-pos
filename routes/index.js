const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/employee", require("./employee"));
router.use("/role", require("./role"));
router.use("/permission", require("./permission"));

module.exports = router;
