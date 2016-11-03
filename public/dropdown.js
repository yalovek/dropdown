(function() {
  'use strict';

  var id = setInterval(function() {
    if (typeof window.populateIndex === 'function') {
      clearInterval(id);

      (function(populateIndex) {
        var Dropdown = {
          user_id: 0,
          index: {},
          list: [],
          multiple: false,
          autocomplete: false,
          request: false,
          avatar: false,
          elemClasses: {
            labels: '.labels',
            labelsRemove: '.labels__remove',
            input: '.input',
            listWrapper: '.list__wrapper',
            listItem: '.list__item',
            listStatus: '.list__status'
          },
          render: function() {
            this.init();

            return this.node;
          },
          init: function() {
            var _this = this;

            this.node = this.create();

            fetch('/list?user_id=' + this.user_id).then(function(response) {
                return response.json();
              })
              .then(function(json) {
                _this.list = json;

                var list = createElement({
                  tag: 'ul',
                  attrs: {
                    class: 'list'
                  } 
                });

                _this.list.forEach(function(listItem) {
                  if (_this.autocomplete) {
                    _this.index = _this.createIndex(listItem, _this.index);
                  }

                  listItem.full_name = [
                    listItem.first_name,
                    listItem.last_name
                  ].join(' ');

                  listItem.status = createElement({
                    tag: 'span',
                    attrs: {
                      class: 'list__status'
                    }
                  });

                  listItem.item = createElement({
                    tag: 'li',
                    attrs: {
                      class: 'list__item'
                    },
                    childs: [
                      createElement({
                        tag: 'a',
                        attrs: {
                          class: 'list__link',
                          href: '/' + listItem.domain
                        },
                        childs: [
                          _this.avatar && createElement({
                            tag: 'img',
                            attrs: {
                              class: 'list__photo',
                              alt: listItem.full_name,
                              src: listItem.photo_50 || 'camera_50.png'
                            }
                          }),
                          createElement({
                            tag: 'span',
                            attrs: {
                              class: 'list__text'
                            },
                            childs: [
                              listItem.full_name
                            ]
                          }),
                          listItem.status
                        ]
                      })
                    ],
                    props: {
                      id: listItem.user_id
                    }
                  });

                  list.appendChild(listItem.item);
                }, _this);

                _this.node.querySelector(_this.elemClasses.listWrapper).appendChild(list);
              });
          },
          create: function() {
            var _this = this;

            return createElement({
              tag: 'div',
              attrs: {
                class: 'dropdown'
              },
              childs: [
                createElement({
                  tag: 'div',
                  attrs: {
                    class: 'search'
                  },
                  childs: [
                    createElement({
                      tag: 'ul',
                      attrs: {
                        class: 'labels'
                      }
                    }),
                    createElement({
                      tag: 'input',
                      attrs: {
                        class: 'input',
                        placeholder: 'Введите имя или фамилию'
                      }
                    })
                  ]
                }),
                createElement({
                  tag: 'div',
                  attrs: {
                    class: 'list__wrapper'
                  }
                })
              ],
              events: {
                click: function(e) {
                  e.preventDefault();

                  var node = getElement(e.target, _this.elemClasses.listItem)
                    || getElement(e.target, _this.elemClasses.labelsRemove);

                  if (node) {
                    _this.clickItem(node);
                  }
                },
                input: function(e) {
                  if (_this.autocomplete) {
                    var node = getElement(e.target, _this.elemClasses.input);

                    if (node) {
                      _this.getList(node.value);
                    }
                  }
                }
              }
            });
          },
          createIndex: function(listItem, index) {
            var data = [
              listItem.first_name.split(''),
              listItem.last_name.split('')
            ];

            return data.reduce(function(result, value) {
              return populateIndex(value, listItem.user_id, result);
            }, index);
          },
          clickItem: function(node) {
            var id = node.props && node.props.id;
            var listItem = this.list.find(function(listItem) {
              return listItem.user_id === id;
            });

            if (!listItem) {
              return;
            }

            if (listItem.selected) {
              this.removeItem(listItem);

              this.setInputWidth();
            }
            else {
              if (!this.multiple) {
                this.list.forEach(function(listItem) {
                  if (listItem.selected && listItem.id !== id) {
                    this.removeItem(listItem);
                  }
                }, this);
              }

              listItem.selected = true;
              listItem.status.classList.add('list__status_selected');
              listItem.label = this.node.querySelector(this.elemClasses.labels).appendChild(createElement({
                tag: 'li',
                attrs: {
                  class: 'labels__item'
                },
                childs: [
                  createElement({
                    tag: 'span',
                    attrs: {
                      class: 'labels__text'
                    },
                    childs: [
                      listItem.full_name
                    ]
                  }),
                  createElement({
                    tag: 'button',
                    attrs: {
                      class: 'labels__remove'
                    },
                    props: {
                      id: listItem.user_id
                    }
                  })
                ]
              }));
              
              this.setInputWidth();
            }
          },
          removeItem: function(listItem) {
            listItem.label.remove();

            listItem.selected = false;
            listItem.status.classList.remove('list__status_selected');
          },
          setInputWidth: function() {
            var labelsWidth = 0;
            var input = this.node.querySelector(this.elemClasses.input);
            var labels = this.node.querySelector(this.elemClasses.labels).childNodes;

            if (!this.inputWidthInit) {
              this.inputWidthInit = input.offsetWidth;
            }

            for (var i in labels) {
              if (labels.hasOwnProperty(i)) {
                var width = labels[i].offsetWidth + 5;
                
                labelsWidth += width;

                if (labelsWidth > this.inputWidthInit) {
                  labelsWidth = width;
                }
              }
            }

            input.style.width = this.inputWidthInit - labelsWidth - 41 + 'px';
          },
          getList: function(value) {
            var values = value ? value.toLowerCase().trim().split(' ') : [];

            if (this.request && values.length) {
              var _this = this;
              var requests = values.reduce(function(result, q) {
                q && result.push(fetch('/search?user_id=' + _this.user_id + '&q=' + q));

                return result;
              }, []);

              Promise.all(requests).then(function(responses) {
                  return Promise.all(responses.map(function(response) {
                    return response.json();
                  }));
                })
                .then(function(jsonArray) {
                  var json = getIdsArray(jsonArray);
                  var valuesIds = values.map(function(val) {
                    return _this.index[val] || [];
                  });
                  var indexIds = getIdsArray(valuesIds);
                  var ids = indexIds.concat(json).sort()
                    .filter(function(value, index, array) {
                      return !index || value !== array[index - 1];
                    });

                  _this.filterList(ids, value);
                })
                .catch(function() {
                  var valuesIds = values.map(function(val) {
                    return _this.index[val] || [];
                  });
                  var indexIds = getIdsArray(valuesIds);

                  _this.filterList(indexIds, value);
                });
            }
            else {
              var valuesIds = values.map(function(val) {
                return _this.index[val] || [];
              });
              var indexIds = getIdsArray(valuesIds);

              this.filterList(indexIds, value);
            }
          },
          filterList: function(ids, value) {
            this.list.forEach(function(listItem) {
              listItem.item.hidden = ids && ids.length
                ? !ids.find(function(id) {
                    return id === listItem.user_id;
                  })
                : value ? true : false;
            });
          }
        };

        function createElement(options) {
          if (!options) {
            throw new Error('options is required');
          }

          if (typeof options !== 'object' || Array.isArray(options)) {
            throw new TypeError('options should be an object');
          }

          if (!options.tag) {
            throw new Error('options.tag is required');
          }

          if (typeof options.tag !== 'string') {
            throw new TypeError('options.tag should be a string');
          }

          var element = document.createElement(options.tag);

          if (options.attrs) {
            if (typeof options.attrs !== 'object' || Array.isArray(options.attrs)) {
              throw new TypeError('options.attrs should be an object');
            }

            for (var key in options.attrs) {
              if (options.attrs.hasOwnProperty(key)) {
                element.setAttribute(key, options.attrs[key]);
              }
            }
          }

          if (options.childs) {
            if (!Array.isArray(options.childs)) {
              throw new TypeError('options.childs should be an array');
            }

            for (var i in options.childs) {
              if (typeof options.childs[i] === 'object' && !Array.isArray(options.childs[i])) {
                element.appendChild(options.childs[i]);
              }
              else if (typeof options.childs[i] === 'boolean') {}
              else {
                element.appendChild(document.createTextNode(options.childs[i]));
              }
            }
          }

          if (options.events) {
            if (typeof options.events !== 'object' || Array.isArray(options.events)) {
              throw new TypeError('options.events should be an object');
            }

            for (var key in options.events) {
              element.addEventListener(key, options.events[key]);
            }
          }

          if (options.props) {
            if (typeof options.props !== 'object' || Array.isArray(options.props)) {
              throw new TypeError('options.props should be an object');
            }

            element.props = options.props;
          }

          return element;
        }

        function getElement(node, query) {
          if (node && node.nodeType === 1) {
            if ((query[0] === '#' && node.id === query.slice(1))
              || (query[0] === '.' && node.classList.contains(query.slice(1)))
              || (query[0] === '[' && node.getAttribute(query.split('=')[0].slice(1)))
              || node.nodeName === query.toUpperCase()) {
              return node;
            }
            else if (node.parentNode) {
              return getElement(node.parentNode, query);
            }
          }

          return null;
        }

        function getIdsArray(arrayOfIds) {
          var arrayOfIdsFiltered = arrayOfIds.filter(function(array) {
            return array.length;
          });
          var first = arrayOfIdsFiltered[0] || [];
          var filterArray = arrayOfIdsFiltered.length ? arrayOfIdsFiltered.reduce(function(result, array) {
            if (result.length > array.length) {
              result = array;
            }

            return result;
          }) : [];
          
          return filterArray.length
            ? first.length
              ? first.filter(function(value) {
                return filterArray.find(function(id) {
                  return id === value;
                });
              })
              : filterArray
            : first;
        }

        function dropdownFactory(options) {
          if (!options) {
            throw new Error('options is required');
          }

          if (typeof options !== 'object' || Array.isArray(options)) {
            throw new TypeError('options should be an object');
          }
          
          return Object.assign({}, Dropdown, options);
        }

        window.dropdownFactory = dropdownFactory;
        window.createElement = createElement;
      })(window.populateIndex);
    }
  }, 0);
})();
