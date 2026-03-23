const express = require("express");
const { askAiTutor } = require("../controllers/ai.controller");
const router = express.Router();

router.post("/chat", askAiTutor);

module.exports = router;
