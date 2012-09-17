(function($){
	var perfectWidth = 120, // em
		perfectHeight = 60; // em
	var minWidth = 400; // in px
	var refreshRate = 15; // frame per second
	var updateTitle = true; // whether update window title or not
	var resizeDelayTimer = null;
	var toggleTime = 100;
	function resizeEM(duration, callback)
	{
		duration = (duration === 0) ? 0 : (Number(duration) || 300);
		var perfectRatio = perfectWidth / perfectHeight;
		var width = $(window).width(),
			height = $(window).height();
		var currentRatio = width / height;
		/*
		if (width < minWidth) width = minWidth;
		if (height < minWidth / perfectRatio) height = minWidth / perfectRatio;
		*/
		var fontSize = ((currentRatio < perfectRatio) ? width / perfectWidth : height / perfectHeight) + 'px';
		if (fontSize !== $(document.body).css('fontSize'))
			$(document.body).stop().animate({'fontSize': fontSize, 'opacity': 1}, duration, callback);
	}
	var body = $(document.body);
	var	wrapper = $('#wrapper', body),
		control = $('#control', body);
	var body_focusField = $('#body_focusField', body),
		control_focusField = $('#control_focusField', control);
	var clockField = {
		hour12: $('#hour12', wrapper),
		hour24: $('#hour24', wrapper),
		minute: $('#minute', wrapper),
		second: $('#second', wrapper),
		am: $('#am', wrapper),
		weekday: $('#weekday', wrapper),
		month: $('#month', wrapper),
		day: $('#day', wrapper),
		year: $('#year', wrapper)
	};
	var api = {
		'hour24_on': function()
		{
			wrapper.addClass('h24', toggleTime);
		},
		'hour24_off': function()
		{
			wrapper.removeClass('h24', toggleTime);
		},
		'weekday_on': function()
		{
			wrapper.removeClass('noweekday', toggleTime);
		},
		'weekday_off': function()
		{
			wrapper.addClass('noweekday', toggleTime);
		},
		'date_on': function()
		{
			wrapper.addClass('nodate', toggleTime);
		},
		'date_off': function()
		{
			wrapper.removeClass('nodate', toggleTime);
		},
	};
	function refreshClock()
	{
		var now = new Date();
		var h = now.getHours(),
			m = now.getMinutes(),
			s = now.getSeconds(),
			d = now.getDate(),
			D = now.getDay(),
			M = now.getMonth(),
			Y = now.getFullYear();
		var label_h12 = (((h % 12) < 10) ? '0' : '') + String(h % 12),
			label_h24 = ((h < 10) ? '0' : '') + String(h),
			label_m = ((m < 10) ? '0' : '') + String(m),
			label_s = ((s < 10) ? '0' : '') + String(s),
			label_d = String(d) + ((d > 0 && d < 4 || d > 20 && d < 24 || d > 30) ? ['st', 'nd', 'rd'][d % 10 - 1] : 'th'),
			label_D = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][D],
			label_M = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December'][M],
			label_Y = String(Y),
			label_am = ['AM', 'PM'][Math.floor(h/12)];
		var label_title = label_h12 + ':' + label_m + ':' + label_s + ' ' + label_am;
		if (clockField.hour12.text() !== label_h12) clockField.hour12.text(label_h12);
		if (clockField.hour24.text() !== label_h24) clockField.hour24.text(label_h24);
		if (clockField.minute.text() !== label_m) clockField.minute.text(label_m);
		if (clockField.second.text() !== label_s) clockField.second.text(label_s);
		if (clockField.am.text() !== label_am) clockField.am.text(label_am);
		if (clockField.weekday.text() !== label_D) clockField.weekday.text(label_D);
		if (clockField.month.text() !== label_M) clockField.month.text(label_M);
		if (clockField.day.text() !== label_d) clockField.day.text(label_d);
		if (clockField.year.text() !== label_Y) clockField.year.text(label_Y);
		if (updateTitle && document.title !== label_title) document.title = label_title;
	}
	function hideClock()
	{
		wrapper.fadeOut(300);
		wrapper.addClass('hidden');
		wrapper.show();
	}
	function showClock()
	{
		wrapper.hide();
		wrapper.removeClass('hidden');
		wrapper.fadeIn(300);
	}
	function showControl()
	{
		control.hide();
		control.removeClass('hidden');
		control.fadeIn(300);
	}
	resizeEM(0, function()
	{
	//	return;
		showClock();
		showControl();
		body_focusField.focus(function()
		{
			control.removeClass('active', 300);
		});
		body.click(function()
		{
			body_focusField.focus();
			return false;
		});
		control_focusField.keydown(function()
		{
			return false;
		});
		control_focusField.focus(function()
		{
			control.addClass('active', 300);
		});
		control.click(function()
		{
			control_focusField.focus();
			return false;
		});
		/* settings */
		$('.checkSlide').click(function()
		{
			var jQObj = $('.toggler', this);
			var target = String(jQObj.attr('for'));
			if (jQObj.hasClass('on')) {
				jQObj.removeClass('on', toggleTime);
				var apiName = target + '_off';
			} else {
				jQObj.addClass('on', toggleTime);
				var apiName = target + '_on';
			}
			if (typeof api[apiName] !== 'undefined') api[apiName].call();
			return false;
		});
		/* auto resizing */
		$(window).resize(function()
		{
			if (resizeDelayTimer !== null) window.clearTimeout(resizeDelayTimer);
			resizeDelayTimer = window.setTimeout(resizeEM, 300);
		});
		/* start refreshing time */
		window.setInterval(refreshClock, 1000 / refreshRate);
	});
})(jQuery);