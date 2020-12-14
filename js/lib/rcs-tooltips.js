
/**
 * Used to create the Twitter tooltip. Usage after the element is created:
 * $(<selector>.tooltip(<config>);
 * Sample configs:
 *
 *	var top = {
 *		'container': 'body',
 *		'placement': 'top',
 *		'trigger': 'hover'
 *	};
 *	var right = {
 *		'container': 'body',
 *		'placement': 'right',
 *		'trigger': 'hover'
 *	};
 *	var left = {
 *		'container': 'body',
 *		'placement': 'left',
 *		'trigger': 'hover'
 *	};
 *	var bottom = {
 *		'container': 'body',
 *		'placement': 'bottom',
 *		'trigger': 'hover'
 *	};)
 */
var tooltip = new function () {

	this.TOP = {
			'container': 'body',
			'placement': 'top',
			'trigger': 'hover',
			'html': 'true'
		},
		this.LEFT = {
			'container': 'body',
			'placement': 'left',
			'trigger': 'hover',
			'html': 'true'
		},
		this.BOTTOM = {
			'container': 'body',
			'placement': 'bottom',
			'trigger': 'hover',
			'html': 'true'
		},
		this.RIGHT = {
			'container': 'body',
			'placement': 'right',
			'trigger': 'hover',
			'html': 'true'
		};

	function show(eventObject) {
		$(this).tooltip('show');
	}

	function hide(eventObject) {
		$('.twipsy').each(function () {
			var tt = $(this);
			if (tt.hasClass('in')) {
				tt.remove();
			}
		});
		$(this).tooltip('hide');
	}

	this.show = show;
	this.hide = hide;
	this.handlers = {
		'mouseover': show,
		'mouseout': hide
	};

	return this;
};


function clearTooltips() {
	if ($('.tooltip'))
			$('.tooltip').remove()
}