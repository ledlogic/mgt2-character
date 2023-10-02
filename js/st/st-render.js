st.render = {
	render: function() {
		st.log("rendering char");

		var r = st.render;
		r.renderReset();
		r.renderOverview();
		r.renderCharacteristics();	
		r.renderSkills();
		r.renderBETE();
		r.renderStory();

		$(".st-page").removeClass("st-initial-state");
		$("h1,.st-nav").hide();
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
		
		// name
		var h = overview.name;
		$elm = $("<span class=\"st-overview-name\">" + h + "</span>");
		$overview.append($elm);

		// rank
		var h = overview.ranks.join(", ");
		$elm = $("<span class=\"st-overview-rank\">" + h + "</span>");
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
			
			var mod = st.character.modifier(value);
			if (mod > 0) {
				mod = "+" + mod;
			}
						
			var v1 = "<span class=\"st-attribute st-attribute-" + key + "\">" + value + "</span>";
			var v2 = "<span class=\"st-attribute st-attribute-" + key + " st-attribute-mod\">" + mod + "</span>";
			$attr.append(v1+v2);
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
		st.log("rendering skills");

		var $sk = $("<div class=\"st-section st-skills\"></div>");
		var $skt = $("<div class=\"st-skills-title\">Skills</div>");
		$sk.append($skt);
		var sk = st.character.spec.skills;
		_.each(sk, function(value, key) {
			var l1 = "<span class=\"st-skill\">";
			var keyClass = "st-skill-label st-skill-label-" + key;
			var hasParens = key.indexOf("(")>-1;
			if (hasParens) {
				keyClass += " st-skill-subset";
			}
			var isNegative = value < 0;
			if (isNegative) {
				keyClass += " st-skill-negative";
			}
			var l2 = "<span class=\"" + keyClass + "\">" + key + "</span>";
			var v = "<span class=\"st-skill-value st-skill-value-" + key + "\">" + value + "</span>";
			var l3 = "</span>";
			$sk.append(l1 + l2 + v + l3);
		});

		st.character.$pageft.append($sk);
	},
	renderBETE: function() {
		st.log("rendering background, education, terms");
		var $bet = $("<div class=\"st-section st-bet\"></div>");
				
		// stuff
		var expenses = 0;
		var stuff = ["armour", "weapons", "equipment"];
		
		for (var i=0; i<stuff.length;i++) {
		
			var sk = "<div class=\"st-section st-" + stuff[i] + "\">"
			       + "<div class=\"st-" + stuff[i] + "-title\">" + stuff[i] + "</div>"
			       + "</div>";
			
			var eq = st.character.spec[stuff[i]];
			var t = [];
			t.push("<table>");
			
			// head
			t.push("<thead>");
			t.push("<tr>");
			for (var key in eq[0]) {
				t.push("<th class=\"st-" + stuff[i] + "-" + key + "\">" + key + "</th>");
			}
			t.push("</tr>");
			t.push("</thead>");
				
			t.push("<tbody>");
			_.each(eq, function(value, key) {
				t.push("<tr>");
				for (var key in value) {
					var unit = "";
					var pos = "";
					if (key == "cost") {
						unit = "cr";
						expenses += parseInt(value[key],10);
					}
					if (key == "mass") {
						unit = "kg";
					}
					if (key == "range") {
						unit = "m";
					}
					if (key == "protection") {
						pos = "+";
					}					
					if (key === "equipped") {
						t.push("<td class=\"st-" + stuff[i] + "-" + key + "\"><input type=\"checkbox\"" + (value[key] === true ? " checked=\"checked\"" : "") + "/></td>");
					} else {
						t.push("<td class=\"st-" + stuff[i] + "-" + key + "\">" + pos + value[key].toLocaleString() + unit + "</td>");
					}
				}
				t.push("</tr>");	
			});
			t.push("</tbody>");
			t.push("</table>");
			var $sk = $(sk);
			$sk.append(t.join(""));
			$bet.append($sk);
		}
		
		st.character.$pageft.append($bet);	
	
		var spec = st.character.spec;
		var overview = spec.overview;
		overview.expenses = expenses;
		var credits = overview.initial - expenses;
		var $overview = $(".st-overview");
		overview.credits = credits;
		
		var arr = ["age", "traits", "initial", "credits"];
		for (var i=0; i<arr.length; i++) {
			var key = arr[i];
			var value = overview[key];
			var $l = $("<span class=\"st-overview-label st-overview-label-" + key + "\">" + key + "</span>");
			$overview.append($l);
			var $v = $("<span class=\"st-overview-value st-overview-" + key + "\">" + value + "</span>");
			$overview.append($v);
		}	
	},
	renderStory: function() {
		st.log("rendering story");
		var $story = $("<div class=\"st-section st-story\"></div>");
		
		// background
		var background = st.character.spec.background;
		if (background) {
			var $sk = $("<div class=\"st-section st-background\"></div>");
			var skt = "<div class=\"st-background-title\">background</div>";
			$sk.append(skt);

			var skv = "<div class=\"st-background-value\">" + background + "</div>";
			$sk.append(skv);
			$story.append($sk);
		}

		// education
		var education = st.character.spec.education;
		if (education) {				
			var $sk = $("<div class=\"st-section st-education\"></div>");
			var skt = "<div class=\"st-education-title\">education</div>";
			$sk.append(skt);

			var skv = "<div class=\"st-education-value\">" + education + "</div>";
			$sk.append(skv);
			$story.append($sk);
		}

		// terms
		var terms = st.character.spec.terms;
		if (terms) {
			var $sk = $("<div class=\"st-section st-terms\"></div>");
			var skt = "<div class=\"st-terms-title\">terms</div>";
			$sk.append(skt);
			
			_.each(terms, function(value, key) {
				var skv = "<div class=\"st-term-value\">" + (key+1) + ". " + value + "</div>";
				$sk.append(skv);	
			});
			$story.append($sk);
		}
		
		// contacts
		var contacts = st.character.spec.contacts;
		if (contacts) {
			var $ct = $("<div class=\"st-section st-contacts\"></div>");
			var cct = "<div class=\"st-contacts-title\">contacts</div>";
			$ct.append(cct);
			
			_.each(contacts, function(value, key) {
				var cv = "<div class=\"st-contact-value\">" + (key+1) + ". " + value.type + ": " + value.kind + "</div>";
				$ct.append(cv);	
			});
			$story.append($ct);
		}
		
		// interactions
		var interactions = st.character.spec.interactions;
		if (interactions) {
			var $int = $("<div class=\"st-section st-interactions\"></div>");
			var intt = "<div class=\"st-terms-title\">interactions</div>";
			$int.append(intt);
			
			_.each(interactions, function(value, key) {
				var intv = "<div class=\"st-interaction-value\">" + (key+1) + ". " + value + "</div>";
				$int.append(intv);	
			});
			$story.append($int);
		}
		
		st.character.$pageft.append($story);		
	}
};