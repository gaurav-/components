COMPONENT('checkboxlist', function() {
	var self = this;
	var template = Tangular.compile('<div class="{0} ui-checkboxlist-checkbox"><label><input type="checkbox" value="{{ id }}"><span>{{ name }}</span></label></div>'.format(self.attr('data-class')));

	self.make = function() {

		self.element.on('click', 'input', function() {
			var arr = self.get() || [];
			var value = self.parser(this.value);
			var index = arr.indexOf(value);
			if (index === -1)
				arr.push(value);
			else
				arr.splice(index, 1);
			self.set(arr);
		});

		self.element.on('click', '.ui-checkboxlist-selectall', function() {
			var arr = [];
			var inputs = self.element.find('input');
			var value = self.get();

			if (value && inputs.length === value.length) {
				self.set(arr);
				return;
			}

			inputs.each(function() {
				arr.push(self.parser(this.value));
			});

			self.set(arr);
		});

		self.make = function() {

			var options = self.attr('data-options');
			if (!options)
				return;

			var arr = options.split(';');
			var datasource = [];

			for (var i = 0, length = arr.length; i < length; i++) {
				var item = arr[i].split('|');
				datasource.push({ id: item[1] === undefined ? item[0] : item[1], name: item[0] });
			}

			self.redraw(datasource);
		};

		self.setter = function(value) {
			self.element.find('input').each(function() {
				this.checked = value && value.indexOf(self.parser(this.value)) !== -1;
			});
		};

		self.redraw = function(arr) {
			var builder = [];
			var kn = self.attr('data-source-text') || 'name';
			var kv = self.attr('data-source-value') || 'id';

			for (var i = 0, length = arr.length; i < length; i++) {
				var item = arr[i];
				if (typeof(item) === 'string')
					builder.push(template({ id: item, name: item }));
				else
					builder.push(template({ id: item[kv] === undefined ? item[kn] : item[kv], name: item[kn] }));
			}

			if (!builder.length)
				return;

			builder.push('<div class="clearfix"></div><div class="col-md-12"><div class="ui-checkboxlist-selectall"><a href="javascript:void(0)"><i class="fa fa-object-group mr5"></i>{0}</a></div></div>'.format(self.attr('data-button')));
			self.html(builder.join(''));
			return self;
		};

		var datasource = self.attr('data-source');
		if (datasource) {
			self.watch(datasource, function(path, value) {
				if (!value)
					value = [];
				self.redraw(value);
			}, true);
		}
	};
});