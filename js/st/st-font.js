/* st-font.js */

/*
 * Font sizing utilities shared across the character sheet renderer.
 *
 * shrinkToFit($el, defaultSize, minSize, maxBottom) — reduces the font-size
 * of a single $el one pixel at a time from defaultSize down to minSize until
 * the element's scrollHeight fits within its own box height. Used when the
 * element has a fixed height and overflow:hidden — measures scrollHeight rather
 * than outerHeight so clipped overflow is still detected.
 *
 * shrinkBlockToFit($block, defaultSize, minSize, maxBottom) — reduces the
 * font-size on all child divs of $block until the last child's bottom edge
 * fits within maxBottom. Used for variable-height blocks (interactions column)
 * where the container has no fixed height.
 *
 * Used by:
 *   st.render.autoResizeOverview  — traits value in the overview header
 *   st.render.renderStory         — interactions block in the story column
 */

st.font = {
	shrinkToFit: function($el, defaultSize, minSize, maxBottom) {
		var el = $el[0];
		if (!el) return;
		var fontSize = defaultSize;
		$el.css("font-size", fontSize + "px");
		while (fontSize > minSize) {
			// Use scrollHeight to detect overflow even when overflow:hidden
			if (el.scrollHeight <= el.clientHeight) break;
			fontSize--;
			$el.css("font-size", fontSize + "px");
		}
	},
	shrinkBlockToFit: function($block, defaultSize, minSize, maxBottom) {
		var fontSize = defaultSize;
		var $children = $block.find("div");
		$children.css("font-size", fontSize + "px");
		while (fontSize > minSize) {
			var $last = $children.last();
			if (!$last.length) break;
			var bottom = $last.position().top + $last.outerHeight(true);
			if (bottom <= maxBottom) break;
			fontSize--;
			$children.css("font-size", fontSize + "px");
		}
	}
};
