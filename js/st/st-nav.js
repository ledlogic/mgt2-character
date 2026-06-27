/* st-nav.js */

/*
 * Navigation controller. Loads the master character list (m2-char-list.json),
 * derives campaign groups from the prefix before the colon in each character
 * name, and drives two dependent dropdowns: Campaign and Character.
 *
 * Selecting a campaign filters the character dropdown to that campaign's entries
 * and strips the campaign prefix from each displayed name. Selecting a character
 * calls st.character.loadChar() with the character's URI.
 *
 * Both selections are persisted in the URL hash as
 * "encodedCampaignName|charUri" so the page restores its state on refresh.
 */
st.nav = {
	allCharacters: [],
	init: function() {
		st.log("init nav");

		$(".st-nav-link").click(st.nav.click);
		$("#st-select-campaign").bind("change", st.nav.selectCampaign);
		$("#st-select-char").bind("change", st.nav.selectChar);
		$(window).on("hashchange", st.nav.onHashChange);
		st.nav.loadChars();
	},
	onHashChange: function() {
		var hash = window.location.hash.substring(1);
		var parts = hash.split("|");
		var campaign = parts[0] ? decodeURIComponent(parts[0]) : "";
		var charUri = parts[1] || "";

		var $camp = $("#st-select-campaign");
		var $char = $("#st-select-char");

		// If char cleared (back button from a character), reset to select state
		if (campaign && !charUri) {
			$camp.val(campaign);
			$char.val("");
			st.character.hideChar();
			return;
		}
		// If both cleared, reset both dropdowns
		if (!campaign && !charUri) {
			$camp.val("");
			$char.val("");
			st.character.hideChar();
			return;
		}
		// If char present, load it
		if (charUri) {
			var $match = $char.find("option[value='" + charUri + "']");
			if ($match.length) {
				$char.val(charUri);
				st.character.loadChar(charUri);
			}
		}
	},
	click: function() {
		st.log("clicked nav");

		var $that = $(this);
		var href = $that.attr("href").substring(1);
		$(".st-nav-link").removeClass("st-nav-link-active");
		$that.addClass("st-nav-link-active");
		$(".st-page").hide();
		$("." + href).show();
	},
	loadChars: function() {
		st.log("loading chars");

		var t = (new Date()).getTime();
		$.ajax("js/char/m2-char-list.json?t=" + t)
			.done(function(data) {
				st.nav.allCharacters = data.characters;

				// Derive unique campaign names from prefix before the colon
				var seen = {};
				var campaigns = [];
				for (var i = 0; i < data.characters.length; i++) {
					var name = data.characters[i].name;
					var colon = name.indexOf(":");
					var campaign = colon > -1 ? name.substring(0, colon).trim() : "(Other)";
					if (!seen[campaign]) {
						seen[campaign] = true;
						campaigns.push(campaign);
					}
				}

				// Populate campaign dropdown
				var $camp = $("#st-select-campaign");
				$camp.empty();
				$camp.append(new Option("Select one...", ""));
				for (var j = 0; j < campaigns.length; j++) {
					$camp.append(new Option(campaigns[j], campaigns[j]));
				}

				// Restore from hash: "campaignName|charUri"
				var hash = window.location.hash.substring(1);
				var parts = hash.split("|");
				var restoreCampaign = parts[0] ? decodeURIComponent(parts[0]) : "";
				var restoreChar = parts[1] || "";

				if (restoreCampaign) {
					var $matchCamp = $camp.find("option[value='" + restoreCampaign + "']");
					if ($matchCamp.length) {
						$camp.val(restoreCampaign);
						st.nav.renderChars(restoreCampaign, restoreChar);
					}
				}
			})
			.fail(function() {
				alert("Error: unable to load character list.");
			});
	},
	selectCampaign: function() {
		var campaign = $(this).find("option:selected").attr("value");
		window.location.hash = encodeURIComponent(campaign) + "|";
		st.character.hideChar();
		st.nav.renderChars(campaign, "");
	},
	renderChars: function(campaign, restoreCharUri) {
		st.log("rendering chars for campaign: " + campaign);

		var $sel = $("#st-select-char");
		$sel.empty();
		$sel.append(new Option("Select one...", ""));

		for (var i = 0; i < st.nav.allCharacters.length; i++) {
			var character = st.nav.allCharacters[i];
			var name = character.name;
			var colon = name.indexOf(":");
			var charCampaign = colon > -1 ? name.substring(0, colon).trim() : "(Other)";
			var shortName = colon > -1 ? name.substring(colon + 1).trim() : name;

			if (charCampaign === campaign) {
				$sel.append(new Option(shortName, character.uri));
			}
		}

		if (restoreCharUri) {
			var $match = $sel.find("option[value='" + restoreCharUri + "']");
			if ($match.length) {
				$sel.val(restoreCharUri);
				st.character.loadChar(restoreCharUri);
			}
		}
	},
	selectChar: function() {
		st.log("selected char");

		var uri = $(this).find("option:selected").attr("value");
		var campaign = $("#st-select-campaign").find("option:selected").attr("value") || "";
		if (uri) {
			window.location.hash = encodeURIComponent(campaign) + "|" + uri;
			st.character.loadChar(uri);
		} else {
			window.location.hash = encodeURIComponent(campaign) + "|";
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
