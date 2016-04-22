# wisDom

wisDom is a light-weight DOM manipulation library that covers essential web API methods.  

To illustrate it is fully useable for simple DOM manipulation: [a playable Snake made with wisDom](http://www.pklong.io/snake)

## Features

* Allows creation and manipulation of wisDom objects through an intuitive syntax.
* Allows creation of wisDom objects via DOMElement selection, string selection, or function selection.
* Provides a DOM search based on a selector.
* Enables manipulation of classes, attributes, html, and eventListeners of wisDom objects.
* Enables selection of parents and children of wisDom objects.
* Enables ajax requests with options hashes.

###Public API

* $w(arg) - Create new wisDomNodeCollection or add callback to be called on DOMContentLoaded.
	* $w.extend(base, ...objects) - Merge objects into base object.
	* $w.myAjax(options) - new XMLHttpRequest, options object overrides default.
* wisDomNodeCollection
	* addClass(className) - Add class to DOM elements.
	* append(children) - Add children elements to DOM element.
	* attr(key, value) - Retrieve attribute or set attribute if optional value given.
	* children() - Immediate children of DOM elements, returns new wisDomNodeCollection.
	* each(cb) - Iterate through each DOM element in wisDomNodeCollection.
	* empty() - Set DOM elements to empty strings.
	* eq(index) - Find DOM element by index in wisDomNodeCollection, returns new wisDomNodeCollection.
	* filter(selector) - Filter DOM elements that match on selector, returns new wisDomNodeCollection.
	* find(selector) - Find DOM element by selector, returns new wisDomNodeCollection.
	* html(string) - Set innerHTML for each node, or retrieve html of node if no arg given.
	* on(event, callback) - Add event listener to DOM elements.
	* off(event, callback) - Remove event listener from DOM element.
	* parent() - Get parent of DOM elements, returns new wisDomNodeCollection.
	* remove() - Remove DOM elements from DOM.
	* removeClass(className) - Remove class from DOM elements.
