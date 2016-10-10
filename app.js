var Io = require('socket.io')
	, path = require('path')
	, fs = require('fs')
	, express = require('express')
	, utils = require('./controller/utils')
	, Tweets = require('./controller/tweets')
	, Datastore = require('./model/index')
	, params = require('./params')
	, debug = require('debug')('server')
	, app = express()
	, twitto = {
		controller: {}
		, model: {}
	}

twitto.controller.io = Io({ path: '/ws/'})

twitto.model = new Datastore(twitto)
twitto.controller.tweets = new Tweets(twitto)

// set the view engine to ejs
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname + '/view'))

console.log('static', __dirname + '/public')

app.use(express.static( __dirname + '/public'))

// launch express server
app.listen(8080)

console.log('knock on the magic 8080 port')

app.render('pages/502', {
		title: 'Twitto.be - down for maintenance'
		, description: 'Twitto is temporarily unavailable - please try again in a few seconds'
		, ga: params.googleAnalytics
	}, function(err, res) {
	if (err)
		console.log('Error rendering 502.html', err)
	else {
		fs.writeFile(__dirname + '/public/502.html', res)
	}
})


// index page route
app.get('/', function (req, res) {
	res.render('pages/index', {
		title: 'Twitto.be - realtime tweets dashboard'
		, description: 'Twitto.be is a live dashboard providing analytics about the tweets geolocated in Belgium. Curious about what\'s being tweeted right now? Come have a look'
		, ga: params.googleAnalytics
	})
})
app.get('/502', function (req, res) {
	res.render('pages/502', {
		title: 'Twitto.be - down for maintenance'
		, description: 'Twitto is temporarily unavailable - please try again in a few seconds'
		, ga: params.googleAnalytics
	})
})

// Redirect all requests to home page instead of 404
app.use(function(req, res, next){

	// respond with html page
	if (req.accepts('html')) {
		res.redirect(301, '/')
		return
	}
	
	res.status(404)

	// respond with json
	if (req.accepts('json')) {
		res.send({ error: 'Not found' })
		return
	}

	// default to plain-text. send()
	res.type('txt').send('Not found')
})

// visitor connection, send all tweets
twitto.controller.io.on('connection', function(socket) {
	
	debug('client connection', socket.id)

	socket.on('tweets', function() {
//~ console.log(twitto.model.tweets.getTimelines())

		// send tweet statistics (for donut chart)
		socket.emit('tweetStats', twitto.model.tweets.getStats())

		// send tweet timelines (for timeline chart)
		socket.emit('timelines', twitto.model.tweets.getTimelines())

		// send tweets (for map)
		socket.emit('tweets', twitto.model.tweets.getAll())

		// send top trends (for bar charts)
		socket.emit('entitiesStats', twitto.model.tweets.getEntitiesStats())

	})

	
})

twitto.controller.io.listen(3031)
