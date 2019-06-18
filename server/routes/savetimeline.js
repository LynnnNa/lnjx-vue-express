const express = require("express")
const path = require("path")
const router = express.Router()
const fs = require("fs")

router.post("/", function(req, res) {
  let rawData = JSON.stringify(req.body),
    filePath = path.resolve(__dirname, "../public/data/default.json")
  fs.writeFile(filePath, rawData, err => {
    if (err) res.json(500, { msg: err })
    res.json(200, { msg: "success" })
  })
})
module.exports = router
