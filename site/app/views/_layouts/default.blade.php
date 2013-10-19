<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>@yield('title') - Twitto.be</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="@yield('description')">
	<meta name="author" content="Mango Information Systems SPRL">
	<meta name="language" content="en">
	<meta name="revised" content="{{ Config::get('app.reviseddate') }}" scheme="YYYY-MM-DD">
	
	<meta property="og:title" content="@yield('title') - Twitto.be" />
	<meta property="og:image" content="{{ URL::asset('assets/img/twitto.be-0.4.png') }}"/>
	<meta property="og:site_name" content="@yield('title') - Twitto.be"/>
	<meta property="og:url" content="<?php echo Request::fullUrl(); ?>" />
	<meta property="og:description" content="@yield('description')"/>

	<!-- Le styles -->
	{{ Basset::show('home.css') }}


	<style type="text/css">
		.sidebar-nav {
			padding: 9px 0;
		}

		@media (max-width: 980px) {
			/* Enable use of floated navbar text */
			.navbar-text.pull-right {
				float: none;
				padding-left: 5px;
				padding-right: 5px;
			}
		}
	</style>

	<!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
	<!--[if lt IE 9]>
	<script src="../assets/js/html5shiv.js"></script>
	<![endif]-->

	<!-- Fav and touch icons -->
	<link rel="apple-touch-icon-precomposed" href="/assets/img/favicon-152.png">
</head>

<body>

<div class="navbar navbar-fixed-top navbar-inverse">
	<div class="navbar-inner">
		<div class="container-fluid">
			<button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="brand" href="{{{ URL::to('/') }}}"><img src="../assets/img/twitto_be-0.4.0-square-logo-40x40.png" width="40px" height="40px"/> Twitto.be</a>
			@section('topmenu')
			@include('topmenu')
		</div>
	</div>
</div>

<div class="container-fluid">
	<div class="row-fluid">
		<div class="span12">
			<h1>
				@section('h1-title')
				@show
			</h1>

			@yield('main')
		</div><!--/span-->
	</div><!--/row-->

	<hr>

	<footer>
		<div class="container">

			<div class="row text-center">
				<div class="span12" style="float: none; margin: 0 auto;">
					&copy; <a href="http://mango-is.com/" target="_blank"><img src="{{ URL::asset('assets/img/mango-information-systems-square-logo-23x23.png') }}" /> Mango Information systems 2013</a>
					|
					<a href="https://github.com/Mango-information-systems/twitto_be" target="_blank">Fork me on Github</a>
					|
					<a href="https://twitter.com/twitto_be" target="_blank">Follow @twitto_be</a>
				</div>
			</div>
		</div>
	</footer>

</div><!--/.fluid-container-->


<div class="feedback">
	<a id="feedback_button">Feedback</a>

	<div class="well form" id="feedback-form" style="margin-bottom: 0 !important;">
		<h4>Please Send Us Your Feedback</h4>
		<?php
		echo Form::open(array('url' => 'feedback', 'method' => 'post', 'class' => 'ajax', 'data-replace' => '.feedback-status', 'data-spinner' => '.feedback-status' ));
		echo Form::email('email', null, array('placeholder' => 'Email (optional)', 'id' => 'email'));
		echo Form::textarea('feedback_text', null, array('placeholder' => 'Message (mandatory)', 'id' => 'feedback_text'));
		echo Form::text('welcome_check', null, array('id' => 'welcome_check'));
		echo Form::button('Send', array('name' => 'submit_form', 'id' => 'submit_form', 'class' => 'btn pull-right', 'type' => 'submit'));
		?>
		<?php echo Form::close();?>
		<div class="feedback-status" id="feedback-status"></div>

	</div>
</div>


<!-- Le javascript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
{{ Basset::show('home.js') }}


@if(!Config::get('app.debug'))
<script lang="text/javascript">
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga')

	ga('create', 'UA-25766439-4', 'twitto.be')
	ga('send', 'pageview')
	
	window.onerror = function(message, file, line) {
		ga('send', 'event', 'Exceptions', file + ':' + line, message)
	}
</script>
@endif

@section('inline-javascript')
@show


</body>
</html>
