(function() {
  'use strict';
  var BRICS, demo_show, object_prototype, pod_prototypes, type_of,
    indexOf = [].indexOf;

  //###########################################################################################################

  //===========================================================================================================
  BRICS = {
    
    //=========================================================================================================
    /* NOTE Future Single-File Module */
    require_show: function() {
      var C, COLOR, Show, colors, exports, internals, isa_jsid, jsid_re, show, templates, write;
      //=======================================================================================================
      write = function(p) {
        return process.stdout.write(p);
      };
      C = require('/home/flow/jzr/hengist-NG/node_modules/.pnpm/ansis@4.1.0/node_modules/ansis/index.cjs');
      // { hide,
      //   set_getter,   } = ( require './main' ).require_managed_property_tools()
      // SQLITE            = require 'node:sqlite'
      // { debug,        } = console

      //=======================================================================================================
      /* thx to https://github.com/sindresorhus/identifier-regex */
      jsid_re = /^[$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}]*$/v;
      isa_jsid = function(x) {
        return ((typeof x) === 'string') && jsid_re.test(x);
      };
      //-------------------------------------------------------------------------------------------------------
      templates = {
        show: {
          indentation: null
        }
      };
      //=======================================================================================================
      internals = {jsid_re, isa_jsid, templates};
      //=======================================================================================================
      Show = class Show {
        //-----------------------------------------------------------------------------------------------------
        constructor(cfg) {
          var me;
          me = (x) => {
            var text;
            return ((function() {
              var results;
              results = [];
              for (text of this.pen(x)) {
                results.push(text);
              }
              return results;
            }).call(this)).join('');
          };
          Object.setPrototypeOf(me, this);
          this.cfg = {...templates.show, ...cfg};
          this.state = {
            level: 0,
            ended_with_nl: false
          };
          this.spacer = '\x20\x20';
          Object.defineProperty(this, 'dent', {
            get: () => {
              return this.spacer.repeat(this.state.level);
            }
          });
          return me;
        }

        //-----------------------------------------------------------------------------------------------------
        * pen(x) {
          var text;
          for (text of this.dispatch(x)) {
            this.state.ended_with_nl = text.endsWith('\n');
            yield text;
          }
          if (!this.state.ended_with_nl) {
            this.state.ended_with_nl = true;
          }
          // yield '\n'
          return null;
        }

        //-----------------------------------------------------------------------------------------------------
        go_down() {
          this.state.level++;
          return this.state.level;
        }

        //-----------------------------------------------------------------------------------------------------
        go_up() {
          if (this.state.level < 1) {
            throw new Error("Ω___1 unable to go below level 0");
          }
          this.state.level--;
          return this.state.level;
        }

        //-----------------------------------------------------------------------------------------------------
        * dispatch(x) {
          var method;
          if ((method = this[`show_${type_of(x)}`]) != null) {
            yield* method.call(this, x);
          } else {
            yield* this.show_other(x);
          }
          return null;
        }

        //-----------------------------------------------------------------------------------------------------
        _show_key(key) {
          var t;
          if (isa_jsid(key)) {
            return colors._key(key);
          }
          return [
            ...((function() {
              var results;
              results = [];
              for (t of this.dispatch(key)) {
                results.push(t);
              }
              return results;
            }).call(this))
          ].join('');
        }

        //-----------------------------------------------------------------------------------------------------
        * show_pod(x) {
          /* TAINT code duplication */
          var has_keys, key, text, value;
          has_keys = false;
          yield colors.pod('{');
//...................................................................................................
          for (key in x) {
            value = x[key];
            has_keys = true;
            yield ' ' + (this._show_key(key)) + colors.pod(': ');
            for (text of this.dispatch(value)) {
              yield text;
            }
            yield colors.pod(',');
          }
          //...................................................................................................
          yield colors.pod(!has_keys ? '}' : ' }');
          return null;
        }

        //-----------------------------------------------------------------------------------------------------
        * show_map(x) {
          /* TAINT code duplication */
          var has_keys, key, text, value, y;
          has_keys = false;
          yield colors.map('map{');
//...................................................................................................
          for (y of x.entries()) {
            [key, value] = y;
            has_keys = true;
            yield ' ' + (this._show_key(key)) + colors.map(': ');
            for (text of this.dispatch(value)) {
              yield text;
            }
            yield colors.map(',');
          }
          //...................................................................................................
          yield colors.map(!has_keys ? '}' : ' }');
          return null;
        }

        //-----------------------------------------------------------------------------------------------------
        * show_list(x) {
          var element, i, len, text;
          yield colors.list('[');
          for (i = 0, len = x.length; i < len; i++) {
            element = x[i];
/* TAINT code duplication */
            for (text of this.dispatch(element)) {
              yield ' ' + text + (colors.list(','));
            }
          }
          yield colors.list((x.length === 0) ? ']' : ' ]');
          return null;
        }

        //-----------------------------------------------------------------------------------------------------
        * show_set(x) {
          var element, text;
          yield colors.set('set[');
          for (element of x.keys()) {
/* TAINT code duplication */
            for (text of this.dispatch(element)) {
              yield ' ' + text + colors.set(',');
            }
          }
          yield colors.set((x.length === 0) ? ']' : ' ]');
          return null;
        }

        //-----------------------------------------------------------------------------------------------------
        * show_text(x) {
          if (indexOf.call(x, "'") >= 0) {
            yield colors.text('"' + (x.replace(/"/g, '\\"')) + '"');
          } else {
            yield colors.text("'" + (x.replace(/'/g, "\\'")) + "'");
          }
          return null;
        }

        //-----------------------------------------------------------------------------------------------------
        * show_float(x) {
          yield (colors.float(x.toString()));
          return null;
        }

        //-----------------------------------------------------------------------------------------------------
        * show_regex(x) {
          yield (colors.regex(x.toString()));
          return null;
        }

        //-----------------------------------------------------------------------------------------------------
        /* full words: */
        // show_true:      ( x ) -> yield ( colors.true      'true'      )
        // show_false:     ( x ) -> yield ( colors.false     'false'     )
        // show_undefined: ( x ) -> yield ( colors.undefined 'undefined' )
        // show_null:      ( x ) -> yield ( colors.null      'null'      )
        // show_nan:       ( x ) -> yield ( colors.nan       'NaN'       )
        /* (mostly) single letters: */
        * show_true(x) {
          return (yield (colors.true(' T ')));
        }

        * show_false(x) {
          return (yield (colors.false(' F ')));
        }

        * show_undefined(x) {
          return (yield (colors.undefined(' U ')));
        }

        * show_null(x) {
          return (yield (colors.null(' N ')));
        }

        * show_nan(x) {
          return (yield (colors.nan(' NaN ')));
        }

        //-----------------------------------------------------------------------------------------------------
        * show_other(x) {
          // yield '\n' unless @state.ended_with_nl
          yield colors.other(`${x}`);
          return null;
        }

      };
      //=======================================================================================================
      COLOR = new C.Ansis().extend({
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrodyellow: '#fafad2',
        lightgray: '#d3d3d3',
        lightgreen: '#90ee90',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370db',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#db7093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32',
        //.....................................................................................................
        FANCYRED: '#fd5230',
        FANCYORANGE: '#fd6d30'
      });
      // oomph: ( x ) -> debug 'Ω___2', x; return "~~~ #{x} ~~~"
      colors = {
        _key: function(x) {
          return COLOR.cyan(x);
        },
        pod: function(x) {
          return COLOR.gold(x);
        },
        map: function(x) {
          return COLOR.gold(x);
        },
        list: function(x) {
          return COLOR.gold(x);
        },
        set: function(x) {
          return COLOR.gold(x);
        },
        text: function(x) {
          return COLOR.wheat(x);
        },
        float: function(x) {
          return COLOR.FANCYRED(x);
        },
        regex: function(x) {
          return COLOR.plum(x);
        },
        true: function(x) {
          return COLOR.inverse.bold.italic.lime(x);
        },
        false: function(x) {
          return COLOR.inverse.bold.italic.FANCYORANGE(x);
        },
        undefined: function(x) {
          return COLOR.inverse.bold.italic.magenta(x);
        },
        null: function(x) {
          return COLOR.inverse.bold.italic.blue(x);
        },
        nan: function(x) {
          return COLOR.inverse.bold.italic.magenta(x);
        },
        other: function(x) {
          return COLOR.inverse.red(x);
        }
      };
      //=======================================================================================================
      show = new Show();
      //=======================================================================================================
      internals = Object.freeze({...internals});
      return exports = {Show, show, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, BRICS);

  //-----------------------------------------------------------------------------------------------------------
  object_prototype = Object.getPrototypeOf({});

  pod_prototypes = [null, object_prototype];

  //-----------------------------------------------------------------------------------------------------------
  type_of = function(x) {
    /* TAINT consider to return x.constructor.name */
    var jstypeof, millertype, ref;
    if (x === null) {
      //.........................................................................................................
      /* Primitives: */
      return 'null';
    }
    if (x === void 0) {
      return 'undefined';
    }
    if ((x === +2e308) || (x === -2e308)) {
      return 'infinity';
    }
    if (x === true) {
      // return 'boolean'      if ( x is true ) or ( x is false )
      return 'true';
    }
    if (x === false) {
      return 'false';
    }
    if (Number.isNaN(x)) {
      return 'nan';
    }
    if (Number.isFinite(x)) {
      return 'float';
    }
    if (ref = Object.getPrototypeOf(x), indexOf.call(pod_prototypes, ref) >= 0) {
      // return 'unset'        if x is unset
      return 'pod';
    }
    //.........................................................................................................
    switch (jstypeof = typeof x) {
      case 'string':
        return 'text';
      case 'symbol':
        return 'symbol';
    }
    if (Array.isArray(x)) {
      //.........................................................................................................
      return 'list';
    }
    switch (millertype = ((Object.prototype.toString.call(x)).replace(/^\[object ([^\]]+)\]$/, '$1')).toLowerCase()) {
      case 'regexp':
        return 'regex';
    }
    return millertype;
  };

  // switch millertype = Object::toString.call x
  //   when '[object Function]'            then return 'function'
  //   when '[object AsyncFunction]'       then return 'asyncfunction'
  //   when '[object GeneratorFunction]'   then return 'generatorfunction'

  //===========================================================================================================
  demo_show = function() {
    var Show, debug, echo, show, v_1, v_10, v_2, v_3, v_4, v_5, v_6, v_7, v_8, v_9;
    ({
      debug,
      log: echo
    } = console);
    ({show, Show} = BRICS.require_show());
    debug('Ω___3', show);
    debug('Ω___4', show.state);
    debug('Ω___5', show(show.dent));
    debug('Ω___6', show.go_down());
    debug('Ω___7', show(show.dent));
    echo();
    echo('————————————————————————————————————————————————————————————————');
    echo(show(v_1 = "foo 'bar'"));
    echo('————————————————————————————————————————————————————————————————');
    echo(show(v_2 = {}));
    echo('————————————————————————————————————————————————————————————————');
    echo(show(v_3 = {
      kong: 108,
      low: 923,
      numbers: [10, 11, 12]
    }));
    echo('————————————————————————————————————————————————————————————————');
    echo(show(v_4 = []));
    echo('————————————————————————————————————————————————————————————————');
    echo(show(v_5 = ['some', 'words', 'to', 'show', 1, -1, false]));
    echo('————————————————————————————————————————————————————————————————');
    echo(show(v_6 = new Map([['kong', 108], ['low', 923], [971, 'word'], [true, '+1'], ['a b c', false]])));
    echo('————————————————————————————————————————————————————————————————');
    echo(show(v_7 = new Set(['some', 'words', true, false, null, void 0, 3.1415926, 0/0])));
    echo('————————————————————————————————————————————————————————————————');
    echo(show(v_8 = /abc[de]/));
    echo('————————————————————————————————————————————————————————————————');
    echo(show(v_9 = Buffer.from('abcäöü')));
    echo('————————————————————————————————————————————————————————————————');
    echo(show(v_10 = {v_1, v_2, v_3, v_4, v_5, v_6, v_7, v_8, v_9})); // v_10, v_11, v_12, v_13, v_14, }
    v_10.v_10 = v_10;
    echo('————————————————————————————————————————————————————————————————');
    // echo show v_10 = { v_1, v_2, v_3, v_4, v_5, v_6, v_7, v_8, v_9, v_10, } # v_10, v_11, v_12, v_13, v_14, }
    echo('————————————————————————————————————————————————————————————————');
    echo();
    return null;
  };

  demo_show();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLXJwci10eXBlX29mLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxLQUFBLEVBQUEsU0FBQSxFQUFBLGdCQUFBLEVBQUEsY0FBQSxFQUFBLE9BQUE7SUFBQSxvQkFBQTs7Ozs7RUFLQSxLQUFBLEdBTUUsQ0FBQTs7OztJQUFBLFlBQUEsRUFBYyxRQUFBLENBQUEsQ0FBQTtBQUVoQixVQUFBLENBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUEsU0FBQSxFQUFBLFFBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxLQUFBOztNQUNJLEtBQUEsR0FBNEIsUUFBQSxDQUFFLENBQUYsQ0FBQTtlQUFTLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixDQUFyQjtNQUFUO01BQzVCLENBQUEsR0FBNEIsT0FBQSxDQUFRLHVGQUFSLEVBRmhDOzs7Ozs7OztNQVVJLE9BQUEsR0FBWTtNQUNaLFFBQUEsR0FBWSxRQUFBLENBQUUsQ0FBRixDQUFBO2VBQVMsQ0FBRSxDQUFFLE9BQU8sQ0FBVCxDQUFBLEtBQWdCLFFBQWxCLENBQUEsSUFBaUMsT0FBTyxDQUFDLElBQVIsQ0FBYSxDQUFiO01BQTFDLEVBWGhCOztNQWFJLFNBQUEsR0FDRTtRQUFBLElBQUEsRUFBTTtVQUFFLFdBQUEsRUFBYTtRQUFmO01BQU4sRUFkTjs7TUFpQkksU0FBQSxHQUFZLENBQUUsT0FBRixFQUFXLFFBQVgsRUFBcUIsU0FBckIsRUFqQmhCOztNQW9CVSxPQUFOLE1BQUEsS0FBQSxDQUFBOztRQUdFLFdBQWEsQ0FBRSxHQUFGLENBQUE7QUFDbkIsY0FBQTtVQUFRLEVBQUEsR0FBSyxDQUFFLENBQUYsQ0FBQSxHQUFBO0FBQ2IsZ0JBQUE7QUFBVSxtQkFBTzs7QUFBRTtjQUFBLEtBQUEsbUJBQUE7NkJBQUE7Y0FB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TyxHQUFQLEVBQVksR0FBWixFQUFpQixHQUFqQixFQUFzQixHQUF0QixFQUEyQixHQUEzQixFQUFnQyxHQUFoQyxFQUFxQyxHQUFyQyxFQUEwQyxHQUExQyxDQUFaLENBQUwsRUE3QkY7SUE4QkUsSUFBSSxDQUFDLElBQUwsR0FBWTtJQUNaLElBQUEsQ0FBSyxrRUFBTCxFQS9CRjs7SUFpQ0UsSUFBQSxDQUFLLGtFQUFMO0lBQ0EsSUFBQSxDQUFBO0FBQ0EsV0FBTztFQXBDRzs7RUFzQ1osU0FBQSxDQUFBO0FBcmFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5CUklDUyA9XG5cbiAgXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX3Nob3c6IC0+XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHdyaXRlICAgICAgICAgICAgICAgICAgICAgPSAoIHAgKSAtPiBwcm9jZXNzLnN0ZG91dC53cml0ZSBwXG4gICAgQyAgICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy9ob21lL2Zsb3cvanpyL2hlbmdpc3QtTkcvbm9kZV9tb2R1bGVzLy5wbnBtL2Fuc2lzQDQuMS4wL25vZGVfbW9kdWxlcy9hbnNpcy9pbmRleC5janMnXG4gICAgIyB7IGhpZGUsXG4gICAgIyAgIHNldF9nZXR0ZXIsICAgfSA9ICggcmVxdWlyZSAnLi9tYWluJyApLnJlcXVpcmVfbWFuYWdlZF9wcm9wZXJ0eV90b29scygpXG4gICAgIyBTUUxJVEUgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6c3FsaXRlJ1xuICAgICMgeyBkZWJ1ZywgICAgICAgIH0gPSBjb25zb2xlXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICMjIyB0aHggdG8gaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9pZGVudGlmaWVyLXJlZ2V4ICMjI1xuICAgIGpzaWRfcmUgICA9IC8vL14gWyAkIF8gXFxwe0lEX1N0YXJ0fSBdIFsgJCBfIFxcdTIwMEMgXFx1MjAwRCBcXHB7SURfQ29udGludWV9IF0qICQvLy92XG4gICAgaXNhX2pzaWQgID0gKCB4ICkgLT4gKCAoIHR5cGVvZiB4ICkgaXMgJ3N0cmluZycgKSBhbmQganNpZF9yZS50ZXN0IHhcbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHRlbXBsYXRlcyA9XG4gICAgICBzaG93OiB7IGluZGVudGF0aW9uOiBudWxsLCB9XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGludGVybmFscyA9IHsganNpZF9yZSwgaXNhX2pzaWQsIHRlbXBsYXRlcywgfVxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBTaG93XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICggY2ZnICkgLT5cbiAgICAgICAgbWUgPSAoIHggKSA9PlxuICAgICAgICAgIHJldHVybiAoIHRleHQgZm9yIHRleHQgZnJvbSBAcGVuIHggKS5qb2luICcnXG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZiBtZSwgQFxuICAgICAgICBAY2ZnICAgID0geyB0ZW1wbGF0ZXMuc2hvdy4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIEBzdGF0ZSAgPSB7IGxldmVsOiAwLCBlbmRlZF93aXRoX25sOiBmYWxzZSwgfVxuICAgICAgICBAc3BhY2VyID0gJ1xceDIwXFx4MjAnXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBALCAnZGVudCcsXG4gICAgICAgICAgZ2V0OiA9PiBAc3BhY2VyLnJlcGVhdCBAc3RhdGUubGV2ZWxcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcGVuOiAoIHggKSAtPlxuICAgICAgICBmb3IgdGV4dCBmcm9tIEBkaXNwYXRjaCB4XG4gICAgICAgICAgQHN0YXRlLmVuZGVkX3dpdGhfbmwgPSB0ZXh0LmVuZHNXaXRoICdcXG4nXG4gICAgICAgICAgeWllbGQgdGV4dFxuICAgICAgICB1bmxlc3MgQHN0YXRlLmVuZGVkX3dpdGhfbmxcbiAgICAgICAgICBAc3RhdGUuZW5kZWRfd2l0aF9ubCA9IHRydWVcbiAgICAgICAgICAjIHlpZWxkICdcXG4nXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZ29fZG93bjogLT5cbiAgICAgICAgQHN0YXRlLmxldmVsKytcbiAgICAgICAgcmV0dXJuIEBzdGF0ZS5sZXZlbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGdvX3VwOiAtPlxuICAgICAgICBpZiBAc3RhdGUubGV2ZWwgPCAxXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX18xIHVuYWJsZSB0byBnbyBiZWxvdyBsZXZlbCAwXCJcbiAgICAgICAgQHN0YXRlLmxldmVsLS1cbiAgICAgICAgcmV0dXJuIEBzdGF0ZS5sZXZlbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGRpc3BhdGNoOiAoIHggKSAtPlxuICAgICAgICBpZiAoIG1ldGhvZCA9IEBbIFwic2hvd18je3R5cGVfb2YgeH1cIiBdICk/XG4gICAgICAgICAgeWllbGQgZnJvbSBtZXRob2QuY2FsbCBALCB4XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB5aWVsZCBmcm9tIEBzaG93X290aGVyIHhcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfc2hvd19rZXk6ICgga2V5ICkgLT5cbiAgICAgICAgaWYgaXNhX2pzaWQga2V5IHRoZW4gcmV0dXJuIGNvbG9ycy5fa2V5IGtleVxuICAgICAgICByZXR1cm4gWyAoIHQgZm9yIHQgZnJvbSBAZGlzcGF0Y2gga2V5ICkuLi4sIF0uam9pbiAnJ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNob3dfcG9kOiAoIHggKSAtPlxuICAgICAgICBoYXNfa2V5cyA9IGZhbHNlXG4gICAgICAgIHlpZWxkIGNvbG9ycy5wb2QgJ3snXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZm9yIGtleSwgdmFsdWUgb2YgeFxuICAgICAgICAgICMjIyBUQUlOVCBjb2RlIGR1cGxpY2F0aW9uICMjI1xuICAgICAgICAgIGhhc19rZXlzID0gdHJ1ZVxuICAgICAgICAgIHlpZWxkICcgJyArICggQF9zaG93X2tleSBrZXkgKSArIGNvbG9ycy5wb2QgJzogJ1xuICAgICAgICAgIGZvciB0ZXh0IGZyb20gQGRpc3BhdGNoIHZhbHVlXG4gICAgICAgICAgICB5aWVsZCB0ZXh0XG4gICAgICAgICAgeWllbGQgY29sb3JzLnBvZCAnLCdcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB5aWVsZCBjb2xvcnMucG9kIGlmICggbm90IGhhc19rZXlzICkgdGhlbiAnfScgZWxzZSAnIH0nXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2hvd19tYXA6ICggeCApIC0+XG4gICAgICAgIGhhc19rZXlzID0gZmFsc2VcbiAgICAgICAgeWllbGQgY29sb3JzLm1hcCAnbWFweydcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmb3IgWyBrZXksIHZhbHVlLCBdIGZyb20geC5lbnRyaWVzKClcbiAgICAgICAgICAjIyMgVEFJTlQgY29kZSBkdXBsaWNhdGlvbiAjIyNcbiAgICAgICAgICBoYXNfa2V5cyA9IHRydWVcbiAgICAgICAgICB5aWVsZCAnICcgKyAoIEBfc2hvd19rZXkga2V5ICkgKyBjb2xvcnMubWFwICc6ICdcbiAgICAgICAgICBmb3IgdGV4dCBmcm9tIEBkaXNwYXRjaCB2YWx1ZVxuICAgICAgICAgICAgeWllbGQgdGV4dFxuICAgICAgICAgIHlpZWxkIGNvbG9ycy5tYXAgJywnXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeWllbGQgY29sb3JzLm1hcCBpZiAoIG5vdCBoYXNfa2V5cyApIHRoZW4gJ30nIGVsc2UgJyB9J1xuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNob3dfbGlzdDogKCB4ICkgLT5cbiAgICAgICAgeWllbGQgY29sb3JzLmxpc3QgJ1snXG4gICAgICAgIGZvciBlbGVtZW50IGluIHhcbiAgICAgICAgICAjIyMgVEFJTlQgY29kZSBkdXBsaWNhdGlvbiAjIyNcbiAgICAgICAgICBmb3IgdGV4dCBmcm9tIEBkaXNwYXRjaCBlbGVtZW50XG4gICAgICAgICAgICB5aWVsZCAnICcgKyB0ZXh0ICsgKCBjb2xvcnMubGlzdCAnLCcgKVxuICAgICAgICB5aWVsZCBjb2xvcnMubGlzdCBpZiAoIHgubGVuZ3RoIGlzIDAgKSB0aGVuICddJyBlbHNlICcgXSdcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzaG93X3NldDogKCB4ICkgLT5cbiAgICAgICAgeWllbGQgY29sb3JzLnNldCAnc2V0WydcbiAgICAgICAgZm9yIGVsZW1lbnQgZnJvbSB4LmtleXMoKVxuICAgICAgICAgICMjIyBUQUlOVCBjb2RlIGR1cGxpY2F0aW9uICMjI1xuICAgICAgICAgIGZvciB0ZXh0IGZyb20gQGRpc3BhdGNoIGVsZW1lbnRcbiAgICAgICAgICAgIHlpZWxkICcgJyArIHRleHQgKyBjb2xvcnMuc2V0ICcsJ1xuICAgICAgICB5aWVsZCBjb2xvcnMuc2V0IGlmICggeC5sZW5ndGggaXMgMCApIHRoZW4gJ10nIGVsc2UgJyBdJ1xuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNob3dfdGV4dDogKCB4ICkgLT5cbiAgICAgICAgaWYgXCInXCIgaW4geCB0aGVuICB5aWVsZCBjb2xvcnMudGV4dCAnXCInICsgKCB4LnJlcGxhY2UgL1wiL2csICdcXFxcXCInICkgKyAnXCInXG4gICAgICAgIGVsc2UgICAgICAgICAgICAgIHlpZWxkIGNvbG9ycy50ZXh0IFwiJ1wiICsgKCB4LnJlcGxhY2UgLycvZywgXCJcXFxcJ1wiICkgKyBcIidcIlxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNob3dfZmxvYXQ6ICggeCApIC0+XG4gICAgICAgIHlpZWxkICggY29sb3JzLmZsb2F0IHgudG9TdHJpbmcoKSApXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2hvd19yZWdleDogKCB4ICkgLT5cbiAgICAgICAgeWllbGQgKCBjb2xvcnMucmVnZXggeC50b1N0cmluZygpIClcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAjIyMgZnVsbCB3b3JkczogIyMjXG4gICAgICAjIHNob3dfdHJ1ZTogICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy50cnVlICAgICAgJ3RydWUnICAgICAgKVxuICAgICAgIyBzaG93X2ZhbHNlOiAgICAgKCB4ICkgLT4geWllbGQgKCBjb2xvcnMuZmFsc2UgICAgICdmYWxzZScgICAgIClcbiAgICAgICMgc2hvd191bmRlZmluZWQ6ICggeCApIC0+IHlpZWxkICggY29sb3JzLnVuZGVmaW5lZCAndW5kZWZpbmVkJyApXG4gICAgICAjIHNob3dfbnVsbDogICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy5udWxsICAgICAgJ251bGwnICAgICAgKVxuICAgICAgIyBzaG93X25hbjogICAgICAgKCB4ICkgLT4geWllbGQgKCBjb2xvcnMubmFuICAgICAgICdOYU4nICAgICAgIClcbiAgICAgICMjIyAobW9zdGx5KSBzaW5nbGUgbGV0dGVyczogIyMjXG4gICAgICBzaG93X3RydWU6ICAgICAgKCB4ICkgLT4geWllbGQgKCBjb2xvcnMudHJ1ZSAgICAgICcgVCAnICAgICApXG4gICAgICBzaG93X2ZhbHNlOiAgICAgKCB4ICkgLT4geWllbGQgKCBjb2xvcnMuZmFsc2UgICAgICcgRiAnICAgICApXG4gICAgICBzaG93X3VuZGVmaW5lZDogKCB4ICkgLT4geWllbGQgKCBjb2xvcnMudW5kZWZpbmVkICcgVSAnICAgICApXG4gICAgICBzaG93X251bGw6ICAgICAgKCB4ICkgLT4geWllbGQgKCBjb2xvcnMubnVsbCAgICAgICcgTiAnICAgICApXG4gICAgICBzaG93X25hbjogICAgICAgKCB4ICkgLT4geWllbGQgKCBjb2xvcnMubmFuICAgICAgICcgTmFOICcgICApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2hvd19vdGhlcjogKCB4ICkgLT5cbiAgICAgICAgIyB5aWVsZCAnXFxuJyB1bmxlc3MgQHN0YXRlLmVuZGVkX3dpdGhfbmxcbiAgICAgICAgeWllbGQgY29sb3JzLm90aGVyIFwiI3t4fVwiXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIENPTE9SID0gbmV3IEMuQW5zaXMoKS5leHRlbmRcbiAgICAgIGFsaWNlYmx1ZTogICAgICAgICAgICAgICAgICAnI2YwZjhmZidcbiAgICAgIGFudGlxdWV3aGl0ZTogICAgICAgICAgICAgICAnI2ZhZWJkNydcbiAgICAgIGFxdWE6ICAgICAgICAgICAgICAgICAgICAgICAnIzAwZmZmZidcbiAgICAgIGFxdWFtYXJpbmU6ICAgICAgICAgICAgICAgICAnIzdmZmZkNCdcbiAgICAgIGF6dXJlOiAgICAgICAgICAgICAgICAgICAgICAnI2YwZmZmZidcbiAgICAgIGJlaWdlOiAgICAgICAgICAgICAgICAgICAgICAnI2Y1ZjVkYydcbiAgICAgIGJpc3F1ZTogICAgICAgICAgICAgICAgICAgICAnI2ZmZTRjNCdcbiAgICAgIGJsYWNrOiAgICAgICAgICAgICAgICAgICAgICAnIzAwMDAwMCdcbiAgICAgIGJsYW5jaGVkYWxtb25kOiAgICAgICAgICAgICAnI2ZmZWJjZCdcbiAgICAgIGJsdWU6ICAgICAgICAgICAgICAgICAgICAgICAnIzAwMDBmZidcbiAgICAgIGJsdWV2aW9sZXQ6ICAgICAgICAgICAgICAgICAnIzhhMmJlMidcbiAgICAgIGJyb3duOiAgICAgICAgICAgICAgICAgICAgICAnI2E1MmEyYSdcbiAgICAgIGJ1cmx5d29vZDogICAgICAgICAgICAgICAgICAnI2RlYjg4NydcbiAgICAgIGNhZGV0Ymx1ZTogICAgICAgICAgICAgICAgICAnIzVmOWVhMCdcbiAgICAgIGNoYXJ0cmV1c2U6ICAgICAgICAgICAgICAgICAnIzdmZmYwMCdcbiAgICAgIGNob2NvbGF0ZTogICAgICAgICAgICAgICAgICAnI2QyNjkxZSdcbiAgICAgIGNvcmFsOiAgICAgICAgICAgICAgICAgICAgICAnI2ZmN2Y1MCdcbiAgICAgIGNvcm5mbG93ZXJibHVlOiAgICAgICAgICAgICAnIzY0OTVlZCdcbiAgICAgIGNvcm5zaWxrOiAgICAgICAgICAgICAgICAgICAnI2ZmZjhkYydcbiAgICAgIGNyaW1zb246ICAgICAgICAgICAgICAgICAgICAnI2RjMTQzYydcbiAgICAgIGN5YW46ICAgICAgICAgICAgICAgICAgICAgICAnIzAwZmZmZidcbiAgICAgIGRhcmtibHVlOiAgICAgICAgICAgICAgICAgICAnIzAwMDA4YidcbiAgICAgIGRhcmtjeWFuOiAgICAgICAgICAgICAgICAgICAnIzAwOGI4YidcbiAgICAgIGRhcmtnb2xkZW5yb2Q6ICAgICAgICAgICAgICAnI2I4ODYwYidcbiAgICAgIGRhcmtncmF5OiAgICAgICAgICAgICAgICAgICAnI2E5YTlhOSdcbiAgICAgIGRhcmtncmVlbjogICAgICAgICAgICAgICAgICAnIzAwNjQwMCdcbiAgICAgIGRhcmtraGFraTogICAgICAgICAgICAgICAgICAnI2JkYjc2YidcbiAgICAgIGRhcmttYWdlbnRhOiAgICAgICAgICAgICAgICAnIzhiMDA4YidcbiAgICAgIGRhcmtvbGl2ZWdyZWVuOiAgICAgICAgICAgICAnIzU1NmIyZidcbiAgICAgIGRhcmtvcmFuZ2U6ICAgICAgICAgICAgICAgICAnI2ZmOGMwMCdcbiAgICAgIGRhcmtvcmNoaWQ6ICAgICAgICAgICAgICAgICAnIzk5MzJjYydcbiAgICAgIGRhcmtyZWQ6ICAgICAgICAgICAgICAgICAgICAnIzhiMDAwMCdcbiAgICAgIGRhcmtzYWxtb246ICAgICAgICAgICAgICAgICAnI2U5OTY3YSdcbiAgICAgIGRhcmtzZWFncmVlbjogICAgICAgICAgICAgICAnIzhmYmM4ZidcbiAgICAgIGRhcmtzbGF0ZWJsdWU6ICAgICAgICAgICAgICAnIzQ4M2Q4YidcbiAgICAgIGRhcmtzbGF0ZWdyYXk6ICAgICAgICAgICAgICAnIzJmNGY0ZidcbiAgICAgIGRhcmt0dXJxdW9pc2U6ICAgICAgICAgICAgICAnIzAwY2VkMSdcbiAgICAgIGRhcmt2aW9sZXQ6ICAgICAgICAgICAgICAgICAnIzk0MDBkMydcbiAgICAgIGRlZXBwaW5rOiAgICAgICAgICAgICAgICAgICAnI2ZmMTQ5MydcbiAgICAgIGRlZXBza3libHVlOiAgICAgICAgICAgICAgICAnIzAwYmZmZidcbiAgICAgIGRpbWdyYXk6ICAgICAgICAgICAgICAgICAgICAnIzY5Njk2OSdcbiAgICAgIGRvZGdlcmJsdWU6ICAgICAgICAgICAgICAgICAnIzFlOTBmZidcbiAgICAgIGZpcmVicmljazogICAgICAgICAgICAgICAgICAnI2IyMjIyMidcbiAgICAgIGZsb3JhbHdoaXRlOiAgICAgICAgICAgICAgICAnI2ZmZmFmMCdcbiAgICAgIGZvcmVzdGdyZWVuOiAgICAgICAgICAgICAgICAnIzIyOGIyMidcbiAgICAgIGdhaW5zYm9ybzogICAgICAgICAgICAgICAgICAnI2RjZGNkYydcbiAgICAgIGdob3N0d2hpdGU6ICAgICAgICAgICAgICAgICAnI2Y4ZjhmZidcbiAgICAgIGdvbGQ6ICAgICAgICAgICAgICAgICAgICAgICAnI2ZmZDcwMCdcbiAgICAgIGdvbGRlbnJvZDogICAgICAgICAgICAgICAgICAnI2RhYTUyMCdcbiAgICAgIGdyYXk6ICAgICAgICAgICAgICAgICAgICAgICAnIzgwODA4MCdcbiAgICAgIGdyZWVuOiAgICAgICAgICAgICAgICAgICAgICAnIzAwODAwMCdcbiAgICAgIGdyZWVueWVsbG93OiAgICAgICAgICAgICAgICAnI2FkZmYyZidcbiAgICAgIGhvbmV5ZGV3OiAgICAgICAgICAgICAgICAgICAnI2YwZmZmMCdcbiAgICAgIGhvdHBpbms6ICAgICAgICAgICAgICAgICAgICAnI2ZmNjliNCdcbiAgICAgIGluZGlhbnJlZDogICAgICAgICAgICAgICAgICAnI2NkNWM1YydcbiAgICAgIGluZGlnbzogICAgICAgICAgICAgICAgICAgICAnIzRiMDA4MidcbiAgICAgIGl2b3J5OiAgICAgICAgICAgICAgICAgICAgICAnI2ZmZmZmMCdcbiAgICAgIGtoYWtpOiAgICAgICAgICAgICAgICAgICAgICAnI2YwZTY4YydcbiAgICAgIGxhdmVuZGVyOiAgICAgICAgICAgICAgICAgICAnI2U2ZTZmYSdcbiAgICAgIGxhdmVuZGVyYmx1c2g6ICAgICAgICAgICAgICAnI2ZmZjBmNSdcbiAgICAgIGxhd25ncmVlbjogICAgICAgICAgICAgICAgICAnIzdjZmMwMCdcbiAgICAgIGxlbW9uY2hpZmZvbjogICAgICAgICAgICAgICAnI2ZmZmFjZCdcbiAgICAgIGxpZ2h0Ymx1ZTogICAgICAgICAgICAgICAgICAnI2FkZDhlNidcbiAgICAgIGxpZ2h0Y29yYWw6ICAgICAgICAgICAgICAgICAnI2YwODA4MCdcbiAgICAgIGxpZ2h0Y3lhbjogICAgICAgICAgICAgICAgICAnI2UwZmZmZidcbiAgICAgIGxpZ2h0Z29sZGVucm9keWVsbG93OiAgICAgICAnI2ZhZmFkMidcbiAgICAgIGxpZ2h0Z3JheTogICAgICAgICAgICAgICAgICAnI2QzZDNkMydcbiAgICAgIGxpZ2h0Z3JlZW46ICAgICAgICAgICAgICAgICAnIzkwZWU5MCdcbiAgICAgIGxpZ2h0cGluazogICAgICAgICAgICAgICAgICAnI2ZmYjZjMSdcbiAgICAgIGxpZ2h0c2FsbW9uOiAgICAgICAgICAgICAgICAnI2ZmYTA3YSdcbiAgICAgIGxpZ2h0c2VhZ3JlZW46ICAgICAgICAgICAgICAnIzIwYjJhYSdcbiAgICAgIGxpZ2h0c2t5Ymx1ZTogICAgICAgICAgICAgICAnIzg3Y2VmYSdcbiAgICAgIGxpZ2h0c2xhdGVncmF5OiAgICAgICAgICAgICAnIzc3ODg5OSdcbiAgICAgIGxpZ2h0c3RlZWxibHVlOiAgICAgICAgICAgICAnI2IwYzRkZSdcbiAgICAgIGxpZ2h0eWVsbG93OiAgICAgICAgICAgICAgICAnI2ZmZmZlMCdcbiAgICAgIGxpbWU6ICAgICAgICAgICAgICAgICAgICAgICAnIzAwZmYwMCdcbiAgICAgIGxpbWVncmVlbjogICAgICAgICAgICAgICAgICAnIzMyY2QzMidcbiAgICAgIGxpbmVuOiAgICAgICAgICAgICAgICAgICAgICAnI2ZhZjBlNidcbiAgICAgIG1hZ2VudGE6ICAgICAgICAgICAgICAgICAgICAnI2ZmMDBmZidcbiAgICAgIG1hcm9vbjogICAgICAgICAgICAgICAgICAgICAnIzgwMDAwMCdcbiAgICAgIG1lZGl1bWFxdWFtYXJpbmU6ICAgICAgICAgICAnIzY2Y2RhYSdcbiAgICAgIG1lZGl1bWJsdWU6ICAgICAgICAgICAgICAgICAnIzAwMDBjZCdcbiAgICAgIG1lZGl1bW9yY2hpZDogICAgICAgICAgICAgICAnI2JhNTVkMydcbiAgICAgIG1lZGl1bXB1cnBsZTogICAgICAgICAgICAgICAnIzkzNzBkYidcbiAgICAgIG1lZGl1bXNlYWdyZWVuOiAgICAgICAgICAgICAnIzNjYjM3MSdcbiAgICAgIG1lZGl1bXNsYXRlYmx1ZTogICAgICAgICAgICAnIzdiNjhlZSdcbiAgICAgIG1lZGl1bXNwcmluZ2dyZWVuOiAgICAgICAgICAnIzAwZmE5YSdcbiAgICAgIG1lZGl1bXR1cnF1b2lzZTogICAgICAgICAgICAnIzQ4ZDFjYydcbiAgICAgIG1lZGl1bXZpb2xldHJlZDogICAgICAgICAgICAnI2M3MTU4NSdcbiAgICAgIG1pZG5pZ2h0Ymx1ZTogICAgICAgICAgICAgICAnIzE5MTk3MCdcbiAgICAgIG1pbnRjcmVhbTogICAgICAgICAgICAgICAgICAnI2Y1ZmZmYSdcbiAgICAgIG1pc3R5cm9zZTogICAgICAgICAgICAgICAgICAnI2ZmZTRlMSdcbiAgICAgIG1vY2Nhc2luOiAgICAgICAgICAgICAgICAgICAnI2ZmZTRiNSdcbiAgICAgIG5hdmFqb3doaXRlOiAgICAgICAgICAgICAgICAnI2ZmZGVhZCdcbiAgICAgIG5hdnk6ICAgICAgICAgICAgICAgICAgICAgICAnIzAwMDA4MCdcbiAgICAgIG9sZGxhY2U6ICAgICAgICAgICAgICAgICAgICAnI2ZkZjVlNidcbiAgICAgIG9saXZlOiAgICAgICAgICAgICAgICAgICAgICAnIzgwODAwMCdcbiAgICAgIG9saXZlZHJhYjogICAgICAgICAgICAgICAgICAnIzZiOGUyMydcbiAgICAgIG9yYW5nZTogICAgICAgICAgICAgICAgICAgICAnI2ZmYTUwMCdcbiAgICAgIG9yYW5nZXJlZDogICAgICAgICAgICAgICAgICAnI2ZmNDUwMCdcbiAgICAgIG9yY2hpZDogICAgICAgICAgICAgICAgICAgICAnI2RhNzBkNidcbiAgICAgIHBhbGVnb2xkZW5yb2Q6ICAgICAgICAgICAgICAnI2VlZThhYSdcbiAgICAgIHBhbGVncmVlbjogICAgICAgICAgICAgICAgICAnIzk4ZmI5OCdcbiAgICAgIHBhbGV0dXJxdW9pc2U6ICAgICAgICAgICAgICAnI2FmZWVlZSdcbiAgICAgIHBhbGV2aW9sZXRyZWQ6ICAgICAgICAgICAgICAnI2RiNzA5MydcbiAgICAgIHBhcGF5YXdoaXA6ICAgICAgICAgICAgICAgICAnI2ZmZWZkNSdcbiAgICAgIHBlYWNocHVmZjogICAgICAgICAgICAgICAgICAnI2ZmZGFiOSdcbiAgICAgIHBlcnU6ICAgICAgICAgICAgICAgICAgICAgICAnI2NkODUzZidcbiAgICAgIHBpbms6ICAgICAgICAgICAgICAgICAgICAgICAnI2ZmYzBjYidcbiAgICAgIHBsdW06ICAgICAgICAgICAgICAgICAgICAgICAnI2RkYTBkZCdcbiAgICAgIHBvd2RlcmJsdWU6ICAgICAgICAgICAgICAgICAnI2IwZTBlNidcbiAgICAgIHB1cnBsZTogICAgICAgICAgICAgICAgICAgICAnIzgwMDA4MCdcbiAgICAgIHJlZDogICAgICAgICAgICAgICAgICAgICAgICAnI2ZmMDAwMCdcbiAgICAgIHJvc3licm93bjogICAgICAgICAgICAgICAgICAnI2JjOGY4ZidcbiAgICAgIHJveWFsYmx1ZTogICAgICAgICAgICAgICAgICAnIzQxNjllMSdcbiAgICAgIHNhZGRsZWJyb3duOiAgICAgICAgICAgICAgICAnIzhiNDUxMydcbiAgICAgIHNhbG1vbjogICAgICAgICAgICAgICAgICAgICAnI2ZhODA3MidcbiAgICAgIHNhbmR5YnJvd246ICAgICAgICAgICAgICAgICAnI2Y0YTQ2MCdcbiAgICAgIHNlYWdyZWVuOiAgICAgICAgICAgICAgICAgICAnIzJlOGI1NydcbiAgICAgIHNlYXNoZWxsOiAgICAgICAgICAgICAgICAgICAnI2ZmZjVlZSdcbiAgICAgIHNpZW5uYTogICAgICAgICAgICAgICAgICAgICAnI2EwNTIyZCdcbiAgICAgIHNpbHZlcjogICAgICAgICAgICAgICAgICAgICAnI2MwYzBjMCdcbiAgICAgIHNreWJsdWU6ICAgICAgICAgICAgICAgICAgICAnIzg3Y2VlYidcbiAgICAgIHNsYXRlYmx1ZTogICAgICAgICAgICAgICAgICAnIzZhNWFjZCdcbiAgICAgIHNsYXRlZ3JheTogICAgICAgICAgICAgICAgICAnIzcwODA5MCdcbiAgICAgIHNub3c6ICAgICAgICAgICAgICAgICAgICAgICAnI2ZmZmFmYSdcbiAgICAgIHNwcmluZ2dyZWVuOiAgICAgICAgICAgICAgICAnIzAwZmY3ZidcbiAgICAgIHN0ZWVsYmx1ZTogICAgICAgICAgICAgICAgICAnIzQ2ODJiNCdcbiAgICAgIHRhbjogICAgICAgICAgICAgICAgICAgICAgICAnI2QyYjQ4YydcbiAgICAgIHRlYWw6ICAgICAgICAgICAgICAgICAgICAgICAnIzAwODA4MCdcbiAgICAgIHRoaXN0bGU6ICAgICAgICAgICAgICAgICAgICAnI2Q4YmZkOCdcbiAgICAgIHRvbWF0bzogICAgICAgICAgICAgICAgICAgICAnI2ZmNjM0NydcbiAgICAgIHR1cnF1b2lzZTogICAgICAgICAgICAgICAgICAnIzQwZTBkMCdcbiAgICAgIHZpb2xldDogICAgICAgICAgICAgICAgICAgICAnI2VlODJlZSdcbiAgICAgIHdoZWF0OiAgICAgICAgICAgICAgICAgICAgICAnI2Y1ZGViMydcbiAgICAgIHdoaXRlOiAgICAgICAgICAgICAgICAgICAgICAnI2ZmZmZmZidcbiAgICAgIHdoaXRlc21va2U6ICAgICAgICAgICAgICAgICAnI2Y1ZjVmNSdcbiAgICAgIHllbGxvdzogICAgICAgICAgICAgICAgICAgICAnI2ZmZmYwMCdcbiAgICAgIHllbGxvd2dyZWVuOiAgICAgICAgICAgICAgICAnIzlhY2QzMidcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgRkFOQ1lSRUQ6ICAgICAgICAgICAgICAgICAgICcjZmQ1MjMwJ1xuICAgICAgRkFOQ1lPUkFOR0U6ICAgICAgICAgICAgICAgICcjZmQ2ZDMwJ1xuICAgICAgIyBvb21waDogKCB4ICkgLT4gZGVidWcgJ86pX19fMicsIHg7IHJldHVybiBcIn5+fiAje3h9IH5+flwiXG5cbiAgICBjb2xvcnMgPVxuICAgICAgX2tleTogICAgICAgKCB4ICkgLT4gQ09MT1IuY3lhbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgcG9kOiAgICAgICAgKCB4ICkgLT4gQ09MT1IuZ29sZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgbWFwOiAgICAgICAgKCB4ICkgLT4gQ09MT1IuZ29sZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgbGlzdDogICAgICAgKCB4ICkgLT4gQ09MT1IuZ29sZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgc2V0OiAgICAgICAgKCB4ICkgLT4gQ09MT1IuZ29sZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgdGV4dDogICAgICAgKCB4ICkgLT4gQ09MT1Iud2hlYXQgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgZmxvYXQ6ICAgICAgKCB4ICkgLT4gQ09MT1IuRkFOQ1lSRUQgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgcmVnZXg6ICAgICAgKCB4ICkgLT4gQ09MT1IucGx1bSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgdHJ1ZTogICAgICAgKCB4ICkgLT4gQ09MT1IuaW52ZXJzZS5ib2xkLml0YWxpYy5saW1lICAgICAgICAgeFxuICAgICAgZmFsc2U6ICAgICAgKCB4ICkgLT4gQ09MT1IuaW52ZXJzZS5ib2xkLml0YWxpYy5GQU5DWU9SQU5HRSAgeFxuICAgICAgdW5kZWZpbmVkOiAgKCB4ICkgLT4gQ09MT1IuaW52ZXJzZS5ib2xkLml0YWxpYy5tYWdlbnRhICAgICAgeFxuICAgICAgbnVsbDogICAgICAgKCB4ICkgLT4gQ09MT1IuaW52ZXJzZS5ib2xkLml0YWxpYy5ibHVlICAgICAgICAgeFxuICAgICAgbmFuOiAgICAgICAgKCB4ICkgLT4gQ09MT1IuaW52ZXJzZS5ib2xkLml0YWxpYy5tYWdlbnRhICAgICAgeFxuICAgICAgb3RoZXI6ICAgICAgKCB4ICkgLT4gQ09MT1IuaW52ZXJzZS5yZWQgICAgICAgICAgICAgICAgICAgICAgeFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBzaG93ID0gbmV3IFNob3coKVxuXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGludGVybmFscyA9IE9iamVjdC5mcmVlemUgeyBpbnRlcm5hbHMuLi4sIH1cbiAgICByZXR1cm4gZXhwb3J0cyA9IHtcbiAgICAgIFNob3csXG4gICAgICBzaG93LFxuICAgICAgaW50ZXJuYWxzLCB9XG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBCUklDU1xuXG5cblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5vYmplY3RfcHJvdG90eXBlICA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB7fVxucG9kX3Byb3RvdHlwZXMgICAgPSBbIG51bGwsIG9iamVjdF9wcm90b3R5cGUsIF1cblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG50eXBlX29mID0gKCB4ICkgLT5cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAjIyMgUHJpbWl0aXZlczogIyMjXG4gIHJldHVybiAnbnVsbCcgICAgICAgICBpZiB4IGlzIG51bGxcbiAgcmV0dXJuICd1bmRlZmluZWQnICAgIGlmIHggaXMgdW5kZWZpbmVkXG4gIHJldHVybiAnaW5maW5pdHknICAgICBpZiAoIHggaXMgK0luZmluaXR5ICkgb3IgKCB4IGlzIC1JbmZpbml0eSApXG4gICMgcmV0dXJuICdib29sZWFuJyAgICAgIGlmICggeCBpcyB0cnVlICkgb3IgKCB4IGlzIGZhbHNlIClcbiAgcmV0dXJuICd0cnVlJyAgICAgICAgIGlmICggeCBpcyB0cnVlIClcbiAgcmV0dXJuICdmYWxzZScgICAgICAgIGlmICggeCBpcyBmYWxzZSApXG4gIHJldHVybiAnbmFuJyAgICAgICAgICBpZiBOdW1iZXIuaXNOYU4gICAgIHhcbiAgcmV0dXJuICdmbG9hdCcgICAgICAgIGlmIE51bWJlci5pc0Zpbml0ZSAgeFxuICAjIHJldHVybiAndW5zZXQnICAgICAgICBpZiB4IGlzIHVuc2V0XG4gIHJldHVybiAncG9kJyAgICAgICAgICBpZiAoIE9iamVjdC5nZXRQcm90b3R5cGVPZiB4ICkgaW4gcG9kX3Byb3RvdHlwZXNcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBzd2l0Y2gganN0eXBlb2YgPSB0eXBlb2YgeFxuICAgIHdoZW4gJ3N0cmluZycgICAgICAgICAgICAgICAgICAgICAgIHRoZW4gcmV0dXJuICd0ZXh0J1xuICAgIHdoZW4gJ3N5bWJvbCcgICAgICAgICAgICAgICAgICAgICAgIHRoZW4gcmV0dXJuICdzeW1ib2wnXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgcmV0dXJuICdsaXN0JyAgICAgICAgIGlmIEFycmF5LmlzQXJyYXkgIHhcbiAgIyMjIFRBSU5UIGNvbnNpZGVyIHRvIHJldHVybiB4LmNvbnN0cnVjdG9yLm5hbWUgIyMjXG4gIHN3aXRjaCBtaWxsZXJ0eXBlID0gKCAoIE9iamVjdDo6dG9TdHJpbmcuY2FsbCB4ICkucmVwbGFjZSAvXlxcW29iamVjdCAoW15cXF1dKylcXF0kLywgJyQxJyApLnRvTG93ZXJDYXNlKClcbiAgICB3aGVuICdyZWdleHAnICAgICAgICAgICAgICAgICAgICAgICB0aGVuIHJldHVybiAncmVnZXgnXG4gIHJldHVybiBtaWxsZXJ0eXBlXG4gICMgc3dpdGNoIG1pbGxlcnR5cGUgPSBPYmplY3Q6OnRvU3RyaW5nLmNhbGwgeFxuICAjICAgd2hlbiAnW29iamVjdCBGdW5jdGlvbl0nICAgICAgICAgICAgdGhlbiByZXR1cm4gJ2Z1bmN0aW9uJ1xuICAjICAgd2hlbiAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScgICAgICAgdGhlbiByZXR1cm4gJ2FzeW5jZnVuY3Rpb24nXG4gICMgICB3aGVuICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScgICB0aGVuIHJldHVybiAnZ2VuZXJhdG9yZnVuY3Rpb24nXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVtb19zaG93ID0gLT5cbiAgeyBkZWJ1ZyxcbiAgICBsb2c6IGVjaG8sIH0gPSBjb25zb2xlXG4gIHsgc2hvdyxcbiAgICBTaG93LCB9ID0gQlJJQ1MucmVxdWlyZV9zaG93KClcbiAgZGVidWcgJ86pX19fMycsIHNob3dcbiAgZGVidWcgJ86pX19fNCcsIHNob3cuc3RhdGVcbiAgZGVidWcgJ86pX19fNScsIHNob3cgc2hvdy5kZW50XG4gIGRlYnVnICfOqV9fXzYnLCBzaG93LmdvX2Rvd24oKVxuICBkZWJ1ZyAnzqlfX183Jywgc2hvdyBzaG93LmRlbnRcbiAgZWNobygpXG4gIGVjaG8gJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyBzaG93IHZfMSA9IFwiZm9vICdiYXInXCJcbiAgZWNobyAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvIHNob3cgdl8yID0ge31cbiAgZWNobyAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvIHNob3cgdl8zID0geyBrb25nOiAxMDgsIGxvdzogOTIzLCBudW1iZXJzOiBbIDEwLCAxMSwgMTIsIF0sIH1cbiAgZWNobyAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvIHNob3cgdl80ID0gW11cbiAgZWNobyAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvIHNob3cgdl81ID0gWyAnc29tZScsICd3b3JkcycsICd0bycsICdzaG93JywgMSwgLTEsIGZhbHNlLCBdXG4gIGVjaG8gJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyBzaG93IHZfNiA9IG5ldyBNYXAgWyBbICdrb25nJywgMTA4LCBdLCBbICdsb3cnLCA5MjMsIF0sIFsgOTcxLCAnd29yZCcsIF0sIFsgdHJ1ZSwgJysxJywgXSwgWyAnYSBiIGMnLCBmYWxzZSwgXSBdXG4gIGVjaG8gJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyBzaG93IHZfNyA9IG5ldyBTZXQgWyAnc29tZScsICd3b3JkcycsIHRydWUsIGZhbHNlLCBudWxsLCB1bmRlZmluZWQsIDMuMTQxNTkyNiwgTmFOLCBdXG4gIGVjaG8gJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyBzaG93IHZfOCA9IC9hYmNbZGVdL1xuICBlY2hvICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8gc2hvdyB2XzkgPSBCdWZmZXIuZnJvbSAnYWJjw6TDtsO8J1xuICBlY2hvICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8gc2hvdyB2XzEwID0geyB2XzEsIHZfMiwgdl8zLCB2XzQsIHZfNSwgdl82LCB2XzcsIHZfOCwgdl85LCB9ICMgdl8xMCwgdl8xMSwgdl8xMiwgdl8xMywgdl8xNCwgfVxuICB2XzEwLnZfMTAgPSB2XzEwXG4gIGVjaG8gJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgIyBlY2hvIHNob3cgdl8xMCA9IHsgdl8xLCB2XzIsIHZfMywgdl80LCB2XzUsIHZfNiwgdl83LCB2XzgsIHZfOSwgdl8xMCwgfSAjIHZfMTAsIHZfMTEsIHZfMTIsIHZfMTMsIHZfMTQsIH1cbiAgZWNobyAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvKClcbiAgcmV0dXJuIG51bGxcblxuZGVtb19zaG93KClcblxuXG5cbiJdfQ==
//# sourceURL=../src/unstable-rpr-type_of.coffee