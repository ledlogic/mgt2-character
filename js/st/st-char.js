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
		that.renderSkills();	
		
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
		var $overview = $("<div class=\"st-overview\"></div>");
		
		var $img1 = $("<div class=\"st-bevel-tl\"></div>");
		$overview.append($img1);
		
		// rank
		var h = overview.rank;
		$elm = $("<span class=\"st-overview-rank\">" + h + "</span>");
		$overview.append($elm);

		// name
		var h = overview.name;
		$elm = $("<span class=\"st-overview-name\">" + h + "</span>");
		$overview.append($elm);

		// overview		
		var keys = ["species", "gender", "age", "traits"];
		for (var i=0; i<keys.length;i++) {
			var key = keys[i];
			var value = overview[key];
			var $l = $("<span class=\"st-overview-label st-overview-label-" + key + "\">" + key + "</span>");
			$overview.append($l);
			var $v = $("<span class=\"st-overview-value st-overview-" + key + "\">" + value + "</span>");
			$overview.append($v);
		}

		// age
		var key = "age";
		var value = overview[key];
		var $l = $("<span class=\"st-overview-label st-overview-label-" + key + "\">" + key + "</span>");
		$overview.append($l);
		var $v = $("<span class=\"st-overview-value st-overview-" + key + "\">" + value + "</span>");
		$overview.append($v);
		
		// traits
		var key = "traits";
		var value = overview[key];
		var $l = $("<span class=\"st-overview-label st-overview-label-" + key + "\">" + key + "</span>");
		$overview.append($l);
		var $v = $("<span class=\"st-overview-value st-overview-" + key + "\">" + value + "</span>");
		$overview.append($v);

		st.character.$pageft.append($overview);
	},
	renderCharacteristics: function() {
		st.log("rendering characteristics");

		var ch = st.character.spec.characteristics;

		// attr
		var $attr = $("<div class=\"st-section st-attributes\"></div>");
	
		var key = "characteristics";
		var $l = $("<span class=\"st-attribute-label st-attribute-label-" + key + "\">" + key + "</span>");
		$attr.append($l);

		_.each(ch, function(value, key) {
			var name = st.characteristics[key].name;
			var $l = $("<span class=\"st-attribute-label st-attribute-label-" + key + "\">" + name + "</span>");
			$attr.append($l);
			
			var v1 = st.character.modifier(value);
			if (v1 > 0) {
				v1 = "+" + v1;
			}
			value = value + " DM(" + v1 + ")";
			
			var $v = $("<span class=\"st-attribute st-attribute-" + key + "\">" + value + "</span>");
			$attr.append($v);
		});
		
		var $img2 = $("<div class=\"st-bevel-br\"></div>");
		$attr.append($img2);
		
		st.character.$pageft.append($attr);
		
		var img3 = "<div class=\"st-img-div\">";
		img3 += "<img class=\"st-img\" src=\"img/" + st.character.spec.overview.img + "\">";		
		img3 += "</div>";		
		var $img3 = $(img3);		
		st.character.$pageft.append($img3);
	},
	renderSkills: function() {
		
	},
	modifier: function(c) {
		switch (true) {
			case c===0:
				return -3; 
			case c>=1 && c<=2:
				return -2; 
			case c>=3 && c<=5:
				return -1; 
			case c>=6 && c<=8:
				return 0; 
			case c>=9 && c<=11:
				return 1; 
			case c>=12 && c<=14:
				return 2; 
			case c>=15:
				return 3; 
		}
	}
};