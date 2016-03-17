(function (root) {

  root.$l = function (selector) {

    this.queue = [];
    var nodeListArr = [];

    if (typeof selector === "function") {
      if (document.readyState === "interactive") {
        selector();
      } else {
        this.queue.push(selector);
      }

    }

    if (document.readyState === "interactive") {
      this.queue.forEach (function(cb) {
        cb();
      });
    }

    if (selector instanceof HTMLElement) {
      nodeListArr.push(selector);
    } else {
      var nodeList = document.querySelectorAll(selector);
      nodeListArr = [].slice.call(nodeList);
    }

    function DOMNodeCollection(htmlArray) {
      this.els = htmlArray;
    }

    DOMNodeCollection.prototype.html = function (str) {
      if (str === undefined) {
        return this.els[0].innerHTML;
      } else {
        this.els.forEach(function (el) {
          el.innerHTML = str;
        });
      }
      return null;
    };

    DOMNodeCollection.prototype.empty = function () {
      this.html("");
    };

    DOMNodeCollection.prototype.append = function (childNode) {

      var htmlEl = childNode;

      this.els.forEach( function (el) {
        if (childNode.constructor.name === "DOMNodeCollection") {
          htmlEl = childNode.els;
          for (var i = 0; i < htmlEl.length; i++) {
            el.innerHTML += htmlEl[i].outerHTML;
          }
        } else if (typeof htmlEl === "string") {
          el.innerHTML += htmlEl;
        } else {
          el.innerHTML += htmlEl.outerHTML;
        }
      });
    };

    DOMNodeCollection.prototype.attr = function (name, value) {
      if (value === undefined) {
        return this.els[0].getAttribute(name);
      } else {
        this.els.forEach (function (el) {
          el.setAttribute(name, value);
        });
        return null;
      }
    };
    DOMNodeCollection.prototype.addClass = function(className) {
      this.els.forEach (function (el) {
        if (el.attributes["class"] && !el.attributes["class"].value.includes(className)) {
          var newClass = el.getAttribute("class").split(" ");
          newClass.push(className);
          newClass = newClass.join(" ");
          el.setAttribute("class", newClass);
        } else if (!el.attributes["class"]) {
          el.setAttribute("class", className);
        }
      });
    };
    DOMNodeCollection.prototype.removeClass = function (className) {
      this.els.forEach (function (el) {
        if (el.attributes["class"]) {
          var newClass = el.getAttribute("class").replace(className, "").trim();
          el.setAttribute("class", newClass);
        }
      });
    };

    DOMNodeCollection.prototype.children = function () {
      var result = [];
      this.els.forEach( function (el) {
        var children = el.children;
        for (var i = 0; i < children.length; i++) {
          result.push(children[i]);
        }
      });
      return new DOMNodeCollection(result);
    };

    DOMNodeCollection.prototype.parent = function () {
      var result = [];
      this.els.forEach(function (el) {
        var parent = el.parentNode;
        result.push(parent);
      });
      return new DOMNodeCollection(result);
    };

    DOMNodeCollection.prototype.find = function (selector) {
      var result = [];
      this.els.forEach(function (el) {
        var query = el.querySelectorAll(selector);
        var queryArray = [].slice.call(query);
        result = result.concat(queryArray);
      });
      return new DOMNodeCollection(result);
    };

    DOMNodeCollection.prototype.remove = function () {
      var length = this.els.length;
      for (var i = 0; i < length; i++) {
        this.els.pop().remove();
      }
      return null;
    };

    DOMNodeCollection.prototype.on = function (listenedEvent, callback) {
      this.els.forEach( function (el) {
        el.addEventListener(listenedEvent, callback);
      });
      return this.els;
    };

    DOMNodeCollection.prototype.off = function (listenedEvent, callback) {
      this.els.forEach( function (el) {
        el.removeEventListener(listenedEvent, callback);
      });
      return this.els;
    };




    var collection = new DOMNodeCollection(nodeListArr);
    return collection;
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
