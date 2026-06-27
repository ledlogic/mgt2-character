/* st-font.js */

/*
 * Font sizing utilities shared across the character sheet renderer.
 *
 * shrinkToFit($el, defaultSize, minSize) — reduces font-size on a single $el
 * with fixed height and overflow:hidden, stepping down until scrollHeight fits
 * inside clientHeight.
 *
 * shrinkBlockToFit($block, defaultSize, minSize, $page) — reduces font-size on
 * all child divs of $block until the block's bottom sits within $page. Uses
 * getBoundingClientRect for page-relative measurement.
 *
 * shrinkChildrenToFit($block, $children, defaultSize, minSize, $page) — like
 * shrinkBlockToFit but takes an explicit set of children to shrink. Useful
 * when the block contains a mix of styled elements and only specific ones
 * should be resized together (e.g., shrink every value div but not the
 * uppercase section titles).
 *
 * Used by:
 *   st.render.autoResizeOverview  — traits value in the overview header
 *   st.render.autoResizeStory     — all value text in the story column
 */

st.font = {
	shrinkToFit: function($el, defaultSize, minSize) {
		var el = $el[0];
		if (!el) return;
		var fontSize = defaultSize;
		$el.css("font-size", fontSize + "px");
		while (fontSize > minSize) {
			if (el.scrollHeight <= el.clientHeight) break;
			fontSize--;
			$el.css("font-size", fontSize + "px");
		}
	},
	shrinkBlockToFit: function($block, defaultSize, minSize, $page) {
		st.font.shrinkChildrenToFit($block, $block.find("div"), defaultSize, minSize, $page);
	},
	shrinkChildrenToFit: function($block, $children, defaultSize, minSize, $page) {
		var block = $block[0];
		var page = $page[0];
		if (!block || !page) return;

		var fontSize = defaultSize;
		$children.css("font-size", fontSize + "px");

		while (fontSize > minSize) {
			var pageRect = page.getBoundingClientRect();
			var blockRect = block.getBoundingClientRect();
			var bottomWithinPage = blockRect.bottom - pageRect.top;
			if (bottomWithinPage <= pageRect.height) break;
			fontSize--;
			$children.css("font-size", fontSize + "px");
		}
	}
};
