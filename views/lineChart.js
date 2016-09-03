var d3 = require('d3')
	, debug = require('debug')('lineChart')

/**
* Set of functions to manage real-time line chart (tweets counter)
*
* @constructor
* 
* @param {object} svg the d3 selection
* @param {object} tweets the array of tweets
* @param {object} granularity 'm' or 's' for minute or second
* 
*/
function LineChart (svg, tweets, granularity) {



	var self = this
	
	if (granularity === 'm') {
		var timeRes = 60000
			, barCount = 30
			, svgWidth = 600
			, idFunc = function(d) { return d.getMinutes() }
	}
	else {
		var timeRes = 1000
			, barCount = 60
			, svgWidth = 300
			, idFunc = function(d) { return + ('' + d.getMinutes() + d.getSeconds()) }
	}

	var ts = Date.now()
		, recentTweets = tweets.filter(function(tweet) {
			return ts - new Date(tweet.created_at) < barCount * timeRes
		})
		
	var countStruct = d3.range(barCount).map(function(d, i) {
		//~ if (granularity === 'm') 
			//~ console.log('id', idFunc(new Date(ts - (barCount-1-i) * timeRes)))
		
		return {
			id: idFunc(new Date(ts - (barCount-1-i) * timeRes))
			, count: 0
		}
	})
	
	self.countByTimeInterval = recentTweets.reduce(function(memo, tweet){
		var howLongAgo = Math.floor((ts - new Date(tweet.created_at)) / timeRes)
		
		memo[barCount-1 - howLongAgo].count += 1

		return memo
		
	}, countStruct)

	var maxCount = d3.max(self.countByTimeInterval, function(d) {return d.count})

	/***********
	* Render line chart
	*
	************/

	var margin = {top: 20, right: 20, bottom: 80, left: 40},
		width = svgWidth - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom
	
	this.g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

	var x = d3.scaleLinear()
		.domain([-(barCount-1), 0])
		.range([0, width])
		.nice()

	self.y = d3.scaleLinear()
		.domain([0, maxCount])
		.range([height, 0])
		//~ .nice()

	this.g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + self.y(0) + ")")
		.call(d3.axisBottom(x).ticks(5))

	self.yAxis = this.g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(self.y).ticks(6))
	
	var bars = this.g.append('g')
	
	bars.selectAll('rect').data(self.countByTimeInterval, function(d) {return d.id})
		.enter()
		.append('rect')
			.attr('x', function(d, i) { return x(i - barCount)})
			.attr('y', function(d) { return self.y(d.count)})
			.attr('width', width / barCount)
			.attr('height', function(d) { return height - self.y(d.count)})
			.style('fill', function(d, i) { return i === barCount-1? '#008000' : '#66B366'})
			.style('stroke', 'white')
			.style('stroke-width', '1')
	
	
	/****************************************
	* 
	* Private methods
	* 
	****************************************/
	
	/****************************************
	* 
	* slide bars as time goes on (every new minute or second, based on granularity)
	* 
	****************************************/
	function nextTimeInterval() {

		self.countByTimeInterval.shift()
		
		self.countByTimeInterval.push({
			id: idFunc(new Date())
			, count: 0
		})

		var rect = bars.selectAll('rect').data(self.countByTimeInterval, function(d) {return d.id})

		rect.enter()
			.append('rect')
				.attr('x', function(d, i) { return x(-1)})
				.attr('y', height)
				.attr('width', width / barCount)
				.attr('height', function(d) { return height - self.y(d.count)})
				.style('fill', '#008000')
				.style('stroke', 'white')
				.style('stroke-width', '1')
			.transition()
				.duration(650)
				.attr('y', function(d) { return self.y(d.count)})

		rect.transition()
			.duration(650)
				.attr('x', function(d, i) { return x(i - barCount)})
				.style('fill', '#66B366')
		
		self.yAxis.call(d3.axisLeft(self.y).tickFormat(d3.format('d')).ticks(tickCountSetter(maxCount)))
		
		rect.exit().transition()
			.duration(650)
			.attr('y', height)
			.attr('height', 0)
			.attr('x', function(d, i) { return x(i - barCount)})
			.remove()
	
	}
	
	setInterval(nextTimeInterval, timeRes)
	
	function tickCountSetter(n){
		if (n <=2)
			return n
		else
			return 6
	}
	
	/****************************************
	* 
	* Public methods
	* 
	****************************************/
	
	
	/***********
	* Add new tweet to latest bar
	*
	************/
	this.addTweet = function() {

		self.countByTimeInterval[self.countByTimeInterval.length-1].count++
		
	//~ console.log('addTweet', granularity, self.countByTimeInterval)
		
		maxCount = d3.max(self.countByTimeInterval, function(d) {return d.count})
		
		self.y.domain([0, maxCount])
		
		self.yAxis.call(d3.axisLeft(self.y).tickFormat(d3.format('d')).ticks(tickCountSetter(maxCount)))
		
		bars.selectAll('rect').data(self.countByTimeInterval, function(d) {return d.id})
			.transition()
				.attr('y', function(d) { return self.y(d.count) })
				.attr('height', function(d) { return height - self.y(d.count)})
	}



	return this	
}

module.exports = LineChart