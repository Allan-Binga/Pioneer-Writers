const express = require("express");
const { rateClient, rateWriter, getWriterRatings, getClientRatings } = require("../controllers/ratings");
const { authWriter, authUser, authAnyRole } = require("../middleware/jwt");

const router = express.Router();

router.post("/rate-writer/:writerId", authUser, rateWriter);
router.post("/rate-client/:clientId", authWriter, rateClient);
router.get("/writer/get-ratings/:writerId", authAnyRole, getWriterRatings)
router.get("/client/get-ratings/:clientId", authAnyRole, getClientRatings)

module.exports = router;
