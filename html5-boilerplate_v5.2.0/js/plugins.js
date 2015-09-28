// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

var StorageUtility = (function (storage) {
	
	return {
		saveLinks: saveLinks,
		loadLinks: loadLinks
	};
	
	function saveLinks(key, value) {
		storage.setItem(key, JSON.stringify(value));
	}
	
	function loadLinks(key) {
		return JSON.parse(storage.getItem(key));
	}
	
})(window.localStorage);


var UIUtility = (function ($){
	
	return {
		init: init,
		refreshTabsUI: refreshTabsUI,
		hideDropdown: hideDropdown,
		showDropdown: showDropdown,
		httpPref: httpPref
	};
	
	function init() {
		
		// activate clicking on dropdown goes to first link
		$('.menu-caption').each(function (){
			var $this = $(this);
			var gotoLink = $this.siblings('.action-list').find('li:first-child > a').attr('href');
			
			$this.click(function () {
				window.location = gotoLink;
			});
		});
		
		// make select in tabs refresh the tabs
		$('.iframe-selector').change(function () {
			if ($(this).val()) {
				refreshTabsUI(true);
			}
		});
		
		activateOptionDropdowns();
	}
	
	function httpPref() {
		
		 
	}	
	
	function showDropdown($toggler, $target) {
		$target.show();
		$target.addClass('collapsed');
		$toggler.css('background', '#fff');
	}
	
	function hideDropdown($toggler, $target) {
		$target.hide();
		$target.removeClass('collapsed');
		$toggler.css('background','');
	}
	
	function activateOptionDropdowns() {
		$('[data-dropdown]').each(function () {
			
			var $this = $(this);
			var targetId = $this.data('target');
			var $target = $(targetId);
			var $cancelButton = $target.find('.cancel');
			
			[$cancelButton, $this].map(function ($element) {
				$element.click(function (e) {
					e.preventDefault();
					
					if ($target.hasClass('collapsed')) {
						hideDropdown($element, $target);
					} else {
						showDropdown($element, $target);
					}
				});
			});
			
		});
	}
	
	function refreshTabsUI(fromSelect) {
		var $interactiveTabs = $('[data-interactive-tab]');
		
		$interactiveTabs.each(function () {
			var $this = $(this);
			var key = $this.data('interactive-tab');
			var data = StorageUtility.loadLinks(key);
			var $iframeSelector = $this.find('.iframe-selector');
			var $gotoPageBtn = $this.find('.go-to-page');
			var $optionsButton = $this.find('.options');
			var $dropdown = $($optionsButton.data('target'));
			
			var fieldSets = $this.find('fieldset');
			
			// if we have data stored
			if (data && data.length) {
				var reversed = [].concat(data);
				var pref = "http://";
				var pattern = /^((http|https|ftp):\/\/)/;
	
				if (!fromSelect) {
					$iframeSelector.empty();
					for (var i = 0; i < reversed.length; ++i) {
						// load into the select
						var $option = $('<option></option>');
						
						$option.addClass('iframe-option');
						if (i == 0) {
							$option.prop('selected' , true);
						}
						
						$option.val(reversed[i].url);
						$option.text(reversed[i].name);
						$iframeSelector.append($option);
					
						// load into the field sets
						$(fieldSets[i]).find('input[name="name0'+ (i+1) +'"]').val(data[i].name);
						$(fieldSets[i]).find('input[name="url0'+ (i+1) +'"]').val(data[i].url);
						
						$gotoPageBtn.attr('href', reversed[0].url);
				
						$this.find('iframe').attr('src', reversed[0].url);
						
						var url = $this.find('iframe').attr('src');						
						if(!pattern.test(url)) {
							url = pref + url; 
							$this.find('iframe').attr('src', url);
						}
					}
				} else { // changed from the iframe selector
					var url = $iframeSelector.val();						
					if(!pattern.test(url)) {
						url = pref + url; 
					}	
					
					$gotoPageBtn.attr('href', url);
					
					$this.find('iframe').attr('src', url);
				}
				
				$iframeSelector.show();
				$gotoPageBtn.show();
				
			} else { // and if we dont..
				$iframeSelector.hide();
				$gotoPageBtn.hide();
				showDropdown($optionsButton, $dropdown);
			}
		});
		
	}
	
})(jQuery);


var FormUtility = (function ($) {
	
	$.validator.addMethod('urlValidator', function(value, element) {
		var $element = $(element);
		var urlRegex = new RegExp("^http:\/\/|(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$");
		
		return (this.optional(element) || urlRegex.test(value));
	});
	
	return {
		activateForms: activateForms
	};
	
	function activateForms() {
		$('form').each(function () {
			var $this = $(this);
			$this.submit(function (e) {
				e.preventDefault();
			});
			
			var $interactiveTab = $this.parents('[data-interactive-tab]').first();
			var $dropdown = $interactiveTab.find('.option-dropdown');
			var $toggler = $interactiveTab.find('[data-dropdown]');
			var key = $interactiveTab.data('interactive-tab');
			
			$this.validate({
				errorClass: "error",
				rules: {
					'name01': {
						required: function(element){
							return $this.find('[name="url01"]').val() !== '';
						}
					},
					'name02': {
						required: function(element){
							return $this.find('[name="url02"]').val() !== '';
						}
					},
					'name03': {
						required: function(element){
							return $this.find('[name="url03"]').val() !== '';
						}
					}
				},
				submitHandler: function () {
					var values = $this.serializeArray();
					var id = 1;
					var linkValues = [];
					
					for (var i = 0; i < values.length; ++i) {
						var dataObject = {};
						var tmpValue = values[i].value;
						
						if (values[i].name === ('name0'+id) && values[i].value !== '') {
							dataObject.name = values[i].value;
							++i;
							
							if (values[i].name === ('url0'+id) && values[i].value !== '') {
								dataObject.url = values[i].value;
								linkValues.push(dataObject);
							}
						}
						id++;
					}
					
					StorageUtility.saveLinks(key, linkValues);
					UIUtility.refreshTabsUI();
					
				},
				errorPlacement: function(error,element) {
					true
				}
			});
		});
	}
	
})(jQuery);














