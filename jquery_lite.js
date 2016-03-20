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
      return this.nodes[0].innerHTML;
    }
  },

  empty: function () {
    this.html("");
  },

  append: function (childNode) {

    var htmlEl = childNode;

    this.nodes.forEach( function (el) {
      if (childNode.constructor.name === "DOMNodeCollection") {
        htmlEl = childNode.nodes;
        for (var i = 0; i < htmlEl.length; i++) {
          el.innerHTML += htmlEl[i].outerHTML;
        }
      } else if (typeof htmlEl === "string") {
        el.innerHTML += htmlEl;
      } else {
        el.innerHTML += htmlEl.outerHTML;
      }
    });
  },

  attr: function (name, value) {
    if (value === undefined) {
      return this.nodes[0].getAttribute(name);
    } else {
      this.nodes.forEach (function (el) {
        el.setAttribute(name, value);
      });
      return null;
    }
  },
  addClass: function(className) {
    this.nodes.forEach (function (el) {
      if (el.attributes["class"] && !el.attributes["class"].value.includes(className)) {
        var newClass = el.getAttribute("class").split(" ");
        newClass.push(className);
        newClass = newClass.join(" ");
        el.setAttribute("class", newClass);
      } else if (!el.attributes["class"]) {
        el.setAttribute("class", className);
      }
    });
  },
  removeClass: function (className) {
    this.nodes.forEach (function (el) {
      if (el.attributes["class"]) {
        var newClass = el.getAttribute("class").replace(className, "").trim();
        el.setAttribute("class", newClass);
      }
    });
  },

  children: function () {
    var result = [];
    this.nodes.forEach( function (el) {
      var children = el.children;
      for (var i = 0; i < children.length; i++) {
        result.push(children[i]);
      }
    });
    return new DOMNodeCollection(result);
  },

  parent: function () {
    var result = [];
    this.nodes.forEach(function (el) {
      var parent = el.parentNode;
      result.push(parent);
    });
    return new DOMNodeCollection(result);
  },

  find: function (selector) {
    var result = [];
    this.nodes.forEach(function (el) {
      var query = el.querySelectorAll(selector);
      var queryArray = [].slice.call(query);
      result = result.concat(queryArray);
    });
    return new DOMNodeCollection(result);
  },

  remove: function () {
    var length = this.nodes.length;
    for (var i = 0; i < length; i++) {
      this.nodes.pop().remove();
    }
    return null;
  },

  on: function (listenedEvent, callback) {
    this.nodes.forEach( function (el) {
      el.addEventListener(listenedEvent, callback);
    });
    return this.nodes;
  },

  off: function (listenedEvent, callback) {
    this.nodes.forEach( function (el) {
      el.removeEventListener(listenedEvent, callback);
    });
    return this.nodes;
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
