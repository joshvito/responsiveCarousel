// responsiveCarousel
// a responsive designed carousel 
// version 1.0, March 21th, 2012

;(function($) {
    $.fn.responsiveCarousel = function(options) {

        var defaults = $.extend( {
			slideContainerId: '#carousel_slides',
			slideClass:'.slide',
			carouselFrameId: '#carousel',
			frameRatio: 2.35,
			speed: 6000,	//rotation speed and timer defaults 1000 = 1sec
			delay: 30000,//time in ms to restart autoscroll after a click
			autostart: true,
         }, options);
		
		//debug to console
		// use a less common namespace than just 'log'
		function myLog(msg){
			// attempt to send a message to the console
			try	{
				console.log(msg);
			}
			// fail gracefully if it does not exist
			catch(e){}
		}//end myLog			

		return this.each(function() {
			function slideSizer(slideContainerId,slideClass){
				//the slide is built with a container '#carousel_slides' and any number of div class="slide" in the container
				//this function is for setting the two variables when we add slides, individual slide size, and carousel_slides size (like a horizontal slide strip)
				var slide_count = $(slideClass).length;//find the num or slides from passed css class
				var strip_width = slide_count * 100 +'%'; //calculate the total width of the slide strip
				var slide_width = 100/slide_count +'%'; //calculate the slide width% based on its parent size
				$(slideContainerId).css('width',strip_width); //set the width of the slide strip
				$(slideClass).css('width',slide_width)// reset the slide size
				return;
			}//end function slideSizer
		
			function setupSlideStrip(slideContainerId,slideClass){		 
				//this function creates bindings for the prev and next buttons
				//
				var item_width = $(slideContainerId + ' ' + slideClass).outerWidth(); //get slideStrip length
				var left_value = item_width * (-1); //negate value
				//move the last item before first item, just in case user clicks prev button
				$(slideContainerId + ' ' + slideClass +':first').before($(slideContainerId + ' ' + slideClass + ':last'));
				$(slideContainerId).css({'left' : left_value});//set the default item to the correct position
			 
				//if user clicked on prev button
				$('#prev').unbind(); //since this is called on window.resize, we need to unbind then bind to prevent multiples
				$('#prev').click(function() {
					//get the right position            
					var left_indent = parseInt($(slideContainerId).css('left')) + item_width;
					//slide the item            
					$(slideContainerId).animate({'left' : left_indent}, 650, 'swing',function(){    
						//move the last item and put it as first item               
						$(slideContainerId + ' ' + slideClass + ':first').before($(slideContainerId + ' ' + slideClass + ':last'));           
						$(slideContainerId).css({'left' : left_value});//set the default item to correct position
					});
					//cancel the link behavior            
					return false;
				}); //end prev function
			 
				//if user clicked on next button
				$('#next').unbind();
				$('#next').click(function() {
					//get the right position
					var left_indent = parseInt($(slideContainerId).css('left')) - item_width;
					//slide the item
					$(slideContainerId).animate({'left' : left_indent}, 650, 'swing', function () {
						//move the first item and put it as last item
						$(slideContainerId + ' ' + slideClass + ':last').after($(slideContainerId + ' ' + slideClass + ':first'));                  
						$(slideContainerId).css({'left' : left_value});//set the default item to correct position
					});
					//cancel the link behavior
					return false;
				});  //end next function      
				
			}//end setupSlideStrip
					
			function returnHeight(carouselFrameId,frameRatio){
				//this function resetys the height of the slideshow frame 
				$this = $(carouselFrameId); //store element for easy access
				var h = $this.height(); //get id height
				var w = $this.width(); //get id width
				//set height to match width
				h = w/frameRatio; 
				$this.css('height',h+'px'); //assign calculated height		
				return false;
			}//end function returnHeight
			
		//call the functions on window resize to reset the ratio of the slide container
			$(window).resize(function(){
				returnHeight(defaults.carouselFrameId,defaults.frameRatio); //pass the target id and the width to reset height ratio
				slideSizer(defaults.slideContainerId,defaults.slideClass);  // resize the slide strip 
				if(this.resizeTO) clearTimeout(this.resizeTO);
					this.resizeTO = setTimeout(function() {
						setupSlideStrip(defaults.slideContainerId,defaults.slideClass); //unbind and bind the .slide size to the next and prev buttons
					}, 200);
			});
			
			//auto scroll the slides, need to build a stop
			function autoStart(speed){
				//if (defaults.autostart){
					var count = speed/1000;
					var counter = setInterval(clickNext,1000);//run every secong
					
					function clickNext(){
						count = count-1;
						myLog('count = '+ count);//debug
						if (count<=0){
							clearInterval(counter);
							if (defaults.autostart){
								$('#next').click();
								myLog('clickNext called');//debug
							}
							autoStart(defaults.speed);
							return;
						}
					}
				//}
			}//end autoStart
			
			//create a listener for a mousedown on either button, and cancel the autostart for set period of time
			$('#carousel_buttons').delegate('a','mousedown', function(){
				defaults.autostart = false;
				myLog('stop the auto');//debug
				setTimeout(function(){
					defaults.autostart = true;
					myLog('restart the autoscroll');//debug
					},defaults.delay);//restart the autoscroll after some time
			});
		
		//call onload functions here
			returnHeight(defaults.carouselFrameId,defaults.frameRatio); 
			slideSizer(defaults.slideContainerId,defaults.slideClass);
			setupSlideStrip(defaults.slideContainerId,defaults.slideClass);
			if (defaults.autostart){
				autoStart(defaults.speed);
			}
			
		});
    };
})(jQuery);