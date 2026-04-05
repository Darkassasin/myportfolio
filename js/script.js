$(function(){
	"use strict";

	/*=========================================================================
		Initializing stellar.js Plugin
	=========================================================================*/
	$('.section').stellar({
		horizontalScrolling: false
	});
	
	
	$(window).on('load', function(){
	
		$('body').addClass('loaded');
	
		
		/*=========================================================================
			Portfolio Grid
		=========================================================================*/
		var grid = $('#portfolio-grid');
		grid.shuffle({
			itemSelector: '.item'
		});
		
		$('#portfolio-filters > ul > li > a').on('click', function (e) {
			e.preventDefault();
			var groupName = $(this).attr('data-group');
			$('#portfolio-filters > ul > li > a').removeClass('active');
			$(this).addClass('active');
			grid.shuffle('shuffle', groupName );
		});
		
		$('a.image-link').magnificPopup({
			type: 'image',
			removalDelay: 300,
			mainClass: 'mfp-fade',
			gallery: {
				enabled: true
			}
		});
	
	});
	
	
	
	/*=========================================================================
		Links Navigation System
	=========================================================================*/
	$('.front-person-links > ul > li > a[data-section]').on('click', function(e){
		e.preventDefault();
		var section = $('#' + $(this).data('section'));
		
		if( section.size() != 0 ){
			
			$('body').addClass('section-show');
			
			section.addClass('active');
		
		}
		
	});
	$('.close-btn').on('click', function(){
		$('body').removeClass('section-show');
		$('section.active').removeClass('active');
	});
	
	
	
	/*=========================================================================
		Testimonials Slider
	=========================================================================*/
	$('.testimonials-slider').owlCarousel({
		singleItem: true
	});
	
	
	
	/*=========================================================================
		Skill Bar's Percent Initialization from attribute data-percent
	=========================================================================*/
	$('.skill-bar').each(function(){
		var $this = $(this),
			percent = parseInt( $this.data('percent'), 10 );
		
		$this.find('.bar').css('width', percent + '%');
	});
	
	
	
	
	/*=========================================================================
		Contact Form
	=========================================================================*/
	function isJSON(val){
		var str = val.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
		return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
	}
	$('#contact-form').validator().on('submit', function (e) {
		
		if (!e.isDefaultPrevented()) {
			// If there is no any error in validation then send the message
			
			e.preventDefault();
			var $this = $(this),
				
				//You can edit alerts here
				alerts = {
				
					success: 
					"<div class='form-group' >\
						<div class='alert alert-success alert-dismissible' role='alert'> \
							<button type='button' class='close' data-dismiss='alert' aria-label='Close' > \
								<i class='ion-ios-close-empty' ></i> \
							</button> \
							<strong>Message Sent!</strong> We'll be in touch as soon as possible\
						</div>\
					</div>",
					
					
					error: 
					"<div class='form-group' >\
						<div class='alert alert-danger alert-dismissible' role='alert'> \
							<button type='button' class='close' data-dismiss='alert' aria-label='Close' > \
								<i class='ion-ios-close-empty' ></i> \
							</button> \
							<strong>Error!</strong> Sorry, an error occurred. Try again.\
						</div>\
					</div>"
					
				};
			
			$.ajax({
			
				url: 'mail.php',
				type: 'post',
				data: $this.serialize(),
				success: function(data){
					
					if( isJSON(data) ){
						
						data = $.parseJSON(data);
						
						if(data['error'] == false){
							
							$('#contact-form-result').html(alerts.success);
							
							$('#contact-form').trigger('reset');
							
						}else{
							
							$('#contact-form-result').html(
							"<div class='form-group' >\
								<div class='alert alert-danger alert-dismissible' role='alert'> \
									<button type='button' class='close' data-dismiss='alert' aria-label='Close' > \
										<i class='ion-ios-close-empty' ></i> \
									</button> \
									"+ data['error'] +"\
								</div>\
							</div>"
							);
							
						}
						
						
					}else{
						$('#contact-form-result').html(alerts.error);
					}
					
				},
				error: function(){
					$('#contact-form-result').html(alerts.error);
				}
			});
		}
	});
	

	$('.edu-node').click(function() {
        // Remove 'active' from all nodes
        $('.edu-node').removeClass('active');
        $(this).addClass('active');

        // Get the selected degree
        var degree = $(this).data('degree');

        // Show the corresponding degree details and hide others
        $('.degree-details').each(function() {
            if ($(this).attr('id') === degree) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    });

	function initFrontBackground() {
		var canvas = document.getElementById('front-bg-canvas');
		if (!canvas || !canvas.getContext) return;

		var ctx = canvas.getContext('2d');
		var width = 0;
		var height = 0;
		var pointer = { x: 0, y: 0, active: false };
		var particles = [];
		var particleCount = 60;
		var maxDistance = 140;
		var mouseRadius = 180;

		function resize() {
			width = canvas.clientWidth;
			height = canvas.clientHeight;
			canvas.width = width * window.devicePixelRatio;
			canvas.height = height * window.devicePixelRatio;
			ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
		}

		function random(min, max) {
			return min + Math.random() * (max - min);
		}

		function createParticles() {
			particles = [];
			for (var i = 0; i < particleCount; i++) {
				particles.push({
					x: random(0, width),
					y: random(0, height),
					vx: random(-0.3, 0.3),
					vy: random(-0.3, 0.3),
					radius: random(1.5, 2.8)
				});
			}
		}

		function distance(a, b) {
			var dx = a.x - b.x;
			var dy = a.y - b.y;
			return Math.sqrt(dx * dx + dy * dy);
		}

		function draw() {
			ctx.clearRect(0, 0, width, height);
			ctx.fillStyle = 'rgba(255,255,255,0)';
			ctx.fillRect(0, 0, width, height);

			particles.forEach(function(p) {
				p.x += p.vx;
				p.y += p.vy;

				if (p.x < 0 || p.x > width) p.vx *= -1;
				if (p.y < 0 || p.y > height) p.vy *= -1;

				if (pointer.active) {
					var dist = distance(p, pointer);
					if (dist < mouseRadius) {
						var force = (mouseRadius - dist) / mouseRadius;
						p.vx += (p.x - pointer.x) * 0.0003 * force;
						p.vy += (p.y - pointer.y) * 0.0003 * force;
					}
				}

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
				ctx.fillStyle = 'rgba(70, 130, 255, 0.9)';
				ctx.fill();
			});

			for (var i = 0; i < particleCount; i++) {
				for (var j = i + 1; j < particleCount; j++) {
					var p1 = particles[i];
					var p2 = particles[j];
					var dist = distance(p1, p2);
					if (dist < maxDistance) {
						ctx.strokeStyle = 'rgba(70, 130, 255,' + (0.24 - dist / maxDistance * 0.16) + ')';
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(p1.x, p1.y);
						ctx.lineTo(p2.x, p2.y);
						ctx.stroke();
					}
				}
			}

			if (pointer.active) {
				ctx.beginPath();
				ctx.arc(pointer.x, pointer.y, 2.5, 0, Math.PI * 2, false);
				ctx.fillStyle = 'rgba(70, 130, 255, 1)';
				ctx.fill();
				particles.forEach(function(p) {
					var dist = distance(p, pointer);
					if (dist < maxDistance) {
						ctx.strokeStyle = 'rgba(70, 130, 255,' + (0.24 - dist / maxDistance * 0.16) + ')';
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(p.x, p.y);
						ctx.lineTo(pointer.x, pointer.y);
						ctx.stroke();
					}
				});
			}

			requestAnimationFrame(draw);
		}

		function start() {
			resize();
			createParticles();
			draw();
		}

		window.addEventListener('mousemove', function(event) {
			var rect = canvas.getBoundingClientRect();
			pointer.x = event.clientX - rect.left;
			pointer.y = event.clientY - rect.top;
			pointer.active = true;
		});

		window.addEventListener('mouseleave', function() {
			pointer.active = false;
		});

		window.addEventListener('resize', function() {
			resize();
			createParticles();
		});

		start();
	}

	initFrontBackground();
});