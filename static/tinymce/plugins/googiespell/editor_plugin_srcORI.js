/**
 * $Id: editor_plugin_src.js 895 2008-07-10 14:34:23Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright © 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	tinymce.create('tinymce.plugins.translate', {
		init : function(ed, url) {
			var t = this, css = tinymce.explode(ed.settings.content_css);

			t.editor = ed;

			// Force absolute CSS urls	
			tinymce.each(css, function(u, k) {
				css[k] = ed.documentBaseURI.toAbsolute(u);
			});

			ed.addCommand('mcetranslate', function() {
				ed.windowManager.open({
					file : ed.getParam("plugin_translate_pageurl", url + "/translate.html"),
					width : parseInt(ed.getParam("plugin_translate_width", "550")),
					height : parseInt(ed.getParam("plugin_translate_height", "600")),
					resizable : "yes",
					scrollbars : "yes",
					popup_css : css.join(','),
					inline : ed.getParam("plugin_translate_inline", 1)
				}, {
					base : ed.documentBaseURI.getURI()
				});
			});

			ed.addButton('translate', {title : 'translate.translate_desc', cmd : 'mcetranslate'});
		},

		getInfo : function() {
			return {
				longname : 'translate',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/translate',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('translate', tinymce.plugins.translate);
})();