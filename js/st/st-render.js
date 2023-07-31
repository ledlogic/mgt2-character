st.render = {
	render: function() {
		st.log("rendering char");

		var r = st.render;
		r.renderReset();
		r.renderOverview();
		r.renderCharacteristics();	
		r.renderSkills();
		r.renderBETE();

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
		
		// credits
		var key = "credits";
		var value = overview[key];
		var $l = $("<span class=\"st-overview-label st-overview-label-" + key + "\">" + key + "</span>");
		$overview.append($l);
		var $v = $("<span class=\"st-overview-value st-overview-" + key + "\">" + value + " cr</span>");
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
		
		// background
		var $sk = $("<div class=\"st-section st-background\"></div>");
		var skt = "<div class=\"st-background-title\">background</div>";
		
		var value = st.character.spec.background;
		var skv = "<div class=\"st-background-value\">" + value + "</div>";
		$bet.append(skt+skv);
		$bet.append($sk);

		// education
		var $sk = $("<div class=\"st-section st-education\"></div>");
		var skt = "<div class=\"st-education-title\">education</div>";
		
		var value = st.character.spec.education;
		var skv = "<div class=\"st-education-value\">" + value + "</div>";
		$bet.append(skt+skv);
		$bet.append($sk);

		// terms
		var $sk = $("<div class=\"st-section st-terms\"></div>");
		var skt = "<div class=\"st-terms-title\">terms</div>";
		$sk.append(skt);
		
		var terms = st.character.spec.terms;
		_.each(terms, function(value, key) {
			var skv = "<div class=\"st-term-value\">" + (key+1) + ". " + value + "</div>";
			$sk.append(skv);	
		});
		$bet.append($sk);
		
		// armour with a u because, Mongoose
		var sk = "<div class=\"st-section st-armour\">"
		       + "<div class=\"st-armour-title\">armour</div>"
		       + "</div>";
		
		var armour = st.character.spec.armour;
		var t = [];
		t.push("<table>");
		
		// head
		t.push("<thead>");
		t.push("<tr>");
		for (var key in armour[0]) {
			t.push("<th class=\"st-armour-" + key + "\">" + key + "</th>");
		}
		t.push("<th class=\"st-armour-" + key + "\">equipped</th>");
		t.push("</tr>");
		t.push("</thead>");
			
		t.push("<tbody>");
		_.each(armour, function(value, key) {
			t.push("<tr>");
			for (var key in value) {
				var v = value[key];
				if (!isNaN(v)) {
					v = Number(v).toLocaleString();
				}
				t.push("<td class=\"st-armour-" + key + "\">" + v + "</td>");
			}
			t.push("<td class=\"st-armour-equipped\"><input type=\"checkbox\" /></td>");
			t.push("</tr>");	
		});
		t.push("</tbody>");
		t.push("</table>");
		var $sk = $(sk);
		$sk.append(t.join(""));
		$bet.append($sk);
		
		// equipment
		var sk = "<div class=\"st-section st-equipment\">"
		       + "<div class=\"st-equipment-title\">equipment</div>"
		       + "</div>";
		
		var eq = st.character.spec.equipment;
		var t = [];
		t.push("<table>");
		
		// head
		t.push("<thead>");
		t.push("<tr>");
		for (var key in eq[0]) {
			t.push("<th class=\"st-equipment-" + key + "\">" + key + "</th>");
		}
		t.push("<th class=\"st-equipment-" + key + "\">equipped</th>");
		t.push("</tr>");
		t.push("</thead>");
			
		t.push("<tbody>");
		_.each(eq, function(value, key) {
			t.push("<tr>");
			for (var key in value) {
				t.push("<td class=\"st-equipment-" + key + "\">" + value[key].toLocaleString() + "</td>");
			}
			t.push("<td class=\"st-equipment-equipped\"><input type=\"checkbox\" /></td>");
			t.push("</tr>");	
		});
		t.push("</tbody>");
		t.push("</table>");
		var $sk = $(sk);
		$sk.append(t.join(""));
		$bet.append($sk);
	
		st.character.$pageft.append($bet);		
	}
};