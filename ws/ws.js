const express = require('express')
const hbs = require('express-handlebars')
const path = require('path')

class WebSocket {

    constructor(token, port, client) {
        this.token = token
        this.client = client

        this.app = express()
        this.app.engine('hbs', hbs({
            extname: 'hbs',
            defaultLayout: 'layout',
            layoutisDir: __dirname + '/layouts'
        }))
        this.app.set('views', path.join(__dirname, 'views'))
        this.app.set('view engine', 'hbs')
        this.app.use(express.static(path.join(__dirname, 'public')))
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json())

        this.registerRoots()

        this.server = this.app.listen(port, () => {
            console.log(`WebSocket listening on port ${this.server.address().port}`)
        })
    }

    checkToken(_token) {
        return (_token == this.token)
    }

    registerRoots() {

        this.app.get('/', (req, res) => {
            var _token = req.query.token

            if (!this.checkToken(_token)) {
                res.render('error', { title: 'ERROR', errtype: 'INVALID TOKEN' })
                return
            }

            var chans = []
            this.client.guilds.first().channels
                .filter(c => c.type == 'text')
                .forEach(c => {
                    chans.push({ id: c.id, name: c.name})
            })

            res.render('index', { 
                title: 'discordBot webinterface',
                token: _token,
                chans
            })
        })

        this.app.post('/sendMessage', (req, res) => {
            var _token = req.body.token
            var text = req.body.text
            var channelid = req.body.channelid

            if (!this.checkToken(_token))
                return

            var chan = this.client.guilds.first().channels.get(channelid)

            if (chan) {
                chan.send(text)
            }
        })

    }
}

module.exports = WebSocket