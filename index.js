const express = require('express')
const app = express()
const fs = require('fs')
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', './views');
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
let data = require('./data.json')
app.listen(3000, () => {
    console.log("I'm listening")
})

app.get('/', (req, res) => {
    res.render('index', { data: data })
})
app.get('/newArticle', (req, res) => {
    res.render('newArticle', { data: data })
})
app.get('/post/:id', (req, res) => {
    res.render('post', {
        blogPost: data[req.params.id],
        data: data
    })
})
app.post('/new', (req, res) => {
    let newData = req.body
    let dateArr = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    let date = new Date()
    let month = dateArr[date.getMonth()]
    let day = date.getDate()
    let year = date.getFullYear()
    let published = `${month} ${day}, ${year}`
    newData.published_at = published
    let readTime = (newData.body.length / 400).toFixed()
    newData.duration = readTime
    data.splice(1, 0, newData)
    for (let i = 0; i < data.length; i++) {
        data[i].id = i
    }
    let jsonData = JSON.stringify(data)
    fs.writeFile('./data.json', jsonData, () => {
        console.log("I have written")
    })
    res.redirect('/')
})