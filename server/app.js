var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
// var cors = require("cors")

// var indexRouter = require("./routes/index")
// var usersRouter = require("./routes/users")
var savetimeline = require("./routes/savetimeline")
var updategoods = require("./routes/updategoods")

var app = express()
/* app.use(
  cors({
    origin: "*",
    methods: ["get", "post"]
  })
) */
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

// app.use("/", indexRouter)
app.use("/savetimeline", savetimeline)
app.use("/updategoods", updategoods)
// app.use("/users", usersRouter)

module.exports = app
