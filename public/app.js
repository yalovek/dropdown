(function() {
  'use strict';

  var id = setInterval(function() {
    if (typeof window.dropdownFactory === 'function'
      && typeof window.createElement === 'function') {
      clearInterval(id);

      (function(dropdownFactory, createElement) {
        var app = document.getElementById('app');
        var form = createElement({
          tag: 'form',
          attrs: {
            class: 'form'
          },
          childs: [
            createElement({
              tag: 'input',
              attrs: {
                name: 'user_id',
                class: 'form__input',
                placeholder: 'user id'
              }
            }),
            createElement({
              tag: 'label',
              attrs: {
                class: 'checkbox',
                type: 'checkbox'
              },
              childs: [
                createElement({
                  tag: 'span',
                  attrs: {
                    class: 'checkbox__text'
                  },
                  childs: [
                    'multiple'
                  ]
                }),
                createElement({
                  tag: 'input',
                  attrs: {
                    name: 'multiple',
                    class: 'checkbox__input',
                    type: 'checkbox'
                  }
                }),
                createElement({
                  tag: 'span',
                  attrs: {
                    class: 'checkbox__status'
                  }
                })
              ]
            }),
            createElement({
              tag: 'label',
              attrs: {
                class: 'checkbox',
                type: 'checkbox'
              },
              childs: [
                createElement({
                  tag: 'span',
                  attrs: {
                    class: 'checkbox__text'
                  },
                  childs: [
                    'autocomplete'
                  ]
                }),
                createElement({
                  tag: 'input',
                  attrs: {
                    name: 'autocomplete',
                    class: 'checkbox__input',
                    type: 'checkbox'
                  }
                }),
                createElement({
                  tag: 'span',
                  attrs: {
                    class: 'checkbox__status'
                  }
                })
              ]
            }),
            createElement({
              tag: 'label',
              attrs: {
                class: 'checkbox',
                type: 'checkbox'
              },
              childs: [
                createElement({
                  tag: 'span',
                  attrs: {
                    class: 'checkbox__text'
                  },
                  childs: [
                    'request'
                  ]
                }),
                createElement({
                  tag: 'input',
                  attrs: {
                    name: 'request',
                    class: 'checkbox__input',
                    type: 'checkbox'
                  }
                }),
                createElement({
                  tag: 'span',
                  attrs: {
                    class: 'checkbox__status'
                  }
                })
              ]
            }),
            createElement({
              tag: 'label',
              attrs: {
                class: 'checkbox',
                type: 'checkbox'
              },
              childs: [
                createElement({
                  tag: 'span',
                  attrs: {
                    class: 'checkbox__text'
                  },
                  childs: [
                    'avatar'
                  ]
                }),
                createElement({
                  tag: 'input',
                  attrs: {
                    name: 'avatar',
                    class: 'checkbox__input',
                    type: 'checkbox'
                  }
                }),
                createElement({
                  tag: 'span',
                  attrs: {
                    class: 'checkbox__status'
                  }
                })
              ]
            }),
            createElement({
              tag: 'div',
              attrs: {
                class: 'form__item'
              },
              childs: [
                createElement({
                  tag: 'button',
                  attrs: {
                    class: 'button'
                  },
                  childs: [
                    'create'
                  ],
                  events: {
                    click: function(e) {
                      e.preventDefault();

                      app.appendChild(dropdownFactory({
                        user_id: parseInt(form.querySelector('[name=user_id]').value) || 0,
                        multiple: form.querySelector('[name=multiple]').checked,
                        autocomplete: form.querySelector('[name=autocomplete]').checked,
                        request: form.querySelector('[name=request]').checked,
                        avatar: form.querySelector('[name=avatar]').checked
                      }).render());
                    }
                  }
                })
              ]
            })
          ]
        });

        app.appendChild(form);
        app.appendChild(dropdownFactory({
          user_id: 0,
          multiple: true,
          autocomplete: true,
          request: true,
          avatar: true
        }).render());
      })(window.dropdownFactory, window.createElement);
    }
  }, 0);
})();
