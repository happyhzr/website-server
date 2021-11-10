const express = require("express")
const router = express.Router()

const moment = require("moment")

const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const adapter = new FileSync("db.json")
const db = low(adapter)

db.defaults({ posts: [] })
    .write()

router.get("/", (req, res, next) => {
    let posts = []
    if (req.query.search_text) {
        posts = db.get("posts")
            .find({ content: req.query.search_text })
            .value()
    } else {
        posts = db.get("posts")
    }
    res.send(posts)
})

router.post("/", (req, res, next) => {
    const article = {
        id: db.get("posts").size().value() + 1,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss").toString(),
        updatedAt: moment().format("YYYY-MM-DD HH:mm:ss").toString(),
        ...req.body,
    }
    db.get("posts")
        .push(article)
        .write()
    res.send(article)
})

module.exports = router