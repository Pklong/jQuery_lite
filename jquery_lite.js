(function (root) {
  var callBackQueue = [],
      ready = false;

  document.addEventListener("DOMContentLoaded", function () {
    ready = true;
    callBackQueue.forEach(function (cb) { cb(); });
  });

  var enqueueDocumentCB = function(cb) {
    if (ready) {
      cb();
    } else {
      callBackQueue.push(cb);
    }
  };

  root.$l = function(arg) {
    var wrapper;

    if (typeof arg === 'function') {
      //document is loading...
      enqueueDocumentCB(arg);
    } else if (typeof arg === 'string') {
      //css selector
      wrapper = retrieveDomNodes(arg);
    } else if (arg instanceof HTMLElement) {
      wrapper = new DOMNodeCollection([arg]);
    } else {
      console.error("Cannot jQuerify!");
    }

    return wrapper;
  };

  function retrieveDomNodes(selector) {
    var nodes = [].slice.call(document.querySelectorAll(selector), 0);
    return new DOMNodeCollection(nodes);
  }

  function DOMNodeCollection(nodes) {
    this.nodes = [].slice.call(nodes);
  }

  DOMNodeCollection.prototype = {

    html: function(html) {
      if (typeof html === 'string') {
        //setter
        this.nodes.forEach(function (el) {
          el.innerHTML = html;
        });
      } else {
        //getter
        if (this.nodes.length > 0) {
          return this.nodes[0].innerHTML;
        } else {
          console.error("No nodes present!");
        }
      }
    },

    each: function(cb) {
      this.nodes.forEach(cb);
    },

    empty: function () {
      this.html("");
    },

    append: function (children) {
      if (this.nodes.length > 0) { return; }

      if (typeof children === 'object' &&
          !(children instanceof DOMNodeCollection)) {
        children = root.$l(children);
      }

      if (typeof children === 'string') {
        this.each(function (node) {
          node.innerHTML += children;
        });
      } else if (children instanceof DOMNodeCollection) {
        var node = this.nodes[0];
        children.each(function (childNode) {
          node.appendChild(childNode);
        });
      }
    },

    attr: function (key, value) {
      if (typeof value === 'string') {
        this.each (function (node) {
          node.setAttribute(key, value);
        });
      } else {
        return this.nodes[0].getAttribute(key);
      }
    },
    addClass: function(className) {
      this.each(function(node) {
        node.classList.add(className);
      });
    },

    removeClass: function(className) {
      this.each(function(node) {
        node.classList.remove(className);
      });
    },

    children: function () {
      var childNodes = [];
      this.each(function(node) {
        var childNodeList = node.children;
        childNodes = childNodes.concat([].slice.call(childNodeList));
      });
      return new DOMNodeCollection(childNodes);
    },

    parent: function () {
      var parentNodes = [];
      this.each(function (node) {
        parentNodes.push(node.parentNode);
      });
      return new DOMNodeCollection(parentNodes);
    },

    find: function (selector) {
      var foundNodes = [];
      this.each(function (node) {
        var nodeList = node.querySelectorAll(selector);
        foundNodes = foundNodes.concat([].slice.call(nodeList));
      });
      return new DOMNodeCollection(foundNodes);
    },

    remove: function () {
      this.each(function(node){
        node.parentNode.removeChild(node);
      });
    },

    on: function (event, callback) {
      this.each(function(node) {
        node.addEventListener(event, callback);
      });
    },

    off: function (event, callback) {
      this.each(function (node) {
        node.removeEventListener(event, callback);
      });
    }
};


  root.$l.extend = function (obj1, obj2) {
    var args = [].slice.call(arguments, 1);
    args.forEach( function (el) {
      for (var key in el) {
        obj1[key] = el[key];
      }
    });
    return obj1;
  };

  root.$l.myAjax = function (options) {
    var requestParams = {
      type: 'GET',
      url: window.location.href,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      success: function () { console.log("Request Complete"); },
      error: function () { console.log("Error"); }
    };
    requestParams = this.extend(requestParams, options);

    var request = new XMLHttpRequest();
    request.open(requestParams.type, requestParams.url);
    request.send();
  };


})(this);
