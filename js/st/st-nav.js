/* st-nav.js */

st.nav = {
	characters: [],
	init: function() {
		st.log("init nav");

		$(".st-nav-link").click(st.nav.click);
		$("#st-select-char").bind("change", st.nav.selectChar);
		st.nav.loadChars();
	},
	click: function() {
		st.log("clicked nav");

		var $that = $(this);
		var href = $that.attr("href").substring(1);
		$(".st-nav-link").removeClass("st-nav-link-active")
		$that.addClass("st-nav-link-active");
		$(".st-page").hide();
		$("." + href).show();
	},
	loadChars: function() {
		st.log("loading chars");

		var t = (new Date()).getTime();
		$.ajax("js/char/m2-char-list.json?t=" + t)
			.done(function(data, status, jqxhr) {
				st.nav.characters = data.characters;
				setTimeout(st.nav.renderChars, 10);
			})
			.fail(function() {
				alert("Error: unable to load character list.");
			})
			.always(function() {
			});
	},
	renderChars: function() {
		st.log("rendering chars");

		var $sel = $("#st-select-char");
		for (var i=0;i<st.nav.characters.length;i++) {
			var character = st.nav.characters[i];
			var option = new Option();
			option.value = character.uri;
			option.text = character.name;
			$sel.append(option);
		}

		// Restore selection from URL hash on load
		var hash = window.location.hash.substring(1); // e.g. "m2-ctkr-vasiliou.json"
		if (hash) {
			var $match = $sel.find("option[value='" + hash + "']");
			if ($match.length) {
				$sel.val(hash);
				st.character.loadChar(hash);
			}
		}
	},
	selectChar: function() {
		st.log("selected char");

		var $sel = $(this);
		var uri = $sel.find("option:selected").attr("value");
		if (uri) {
			window.location.hash = uri; // persist selection in URL
			st.character.loadChar(uri);
		} else {
			window.location.hash = "";
			st.character.hideChar();
		}
	},
	showLinks: function() {
		$(".st-nav-links").show();
	},
	hideLinks: function() {
		$(".st-nav-links").hide();
	}
};