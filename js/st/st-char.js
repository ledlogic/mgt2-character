/* st-char.js */

/* 
 * The display models are optimized for the output display, rather than being truncated.
 * Since the order is known in the output, rendering of css is simplified.
 * In another layout, it could be adjusted to use css-specific overrides for position
 * of individual attributes.
 */
st.character = {
	spec: {},
	$pageft: null,
	init: function() {
		st.log("init character");
		st.character.$pageft = $(".st-page .st-page-ft");
	},
	loadChar: function(uri) {
		st.log("loading char");
		
		if (uri.indexOf(".json") > -1) {
			st.character.loadCharJson(uri);
		}
	},
	loadCharJson: function(uri) {
		st.log("loading char from json");
		
		$.ajax("js/char/" + uri)
		.done(function(data, status, jqxhr) {
			st.character.spec = data;
			setTimeout(st.character.render,10);
		})
		.fail(function() {
			alert("Error: unable to load character.");
		})
		.always(function() {
		});
	},
	render: function() {
		st.log("rendering char");

		var that = st.character;
		
		that.renderReset();
		that.renderOverview();
		that.renderCharacteristics();	
		
		$(".st-page").removeClass("st-initial-state");
	},
	renderReset: function() {
		st.character.$pageft.html("");
	},
	renderOverview: function() {
		st.log("rendering overview");

		var spec = st.character.spec;
		var overview = spec.overview;

		// page
		var $overview = $("<div class=\"st-section st-overview\"></div>");
		
		// name
		var h = overview.name;
		$elm = $("<span class=\"st-item st-overview-item st-overview-item-name\">" + h + "</span>");
		$overview.append($elm);

		st.character.$pageft.append($overview);
	},
	renderCharacteristics: function() {
		st.log("rendering characteristics");

		var ch = st.character.spec.characteristics;

		// attr
		var $attr = $("<div class=\"st-section st-attributes\"></div>");
		_.each(ch, function(value, key) {
			var h = value;
			$elm = $("<span class=\"st-item st-attribute st-attribute-" + key + "\">" + h + "</span>");
			$attr.append($elm);
		});
		st.character.$pageft.append($attr);
	}	
};