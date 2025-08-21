(function() {
  'use strict';
  var BRICS, demo_show, object_prototype, pod_prototypes, type_of,
    indexOf = [].indexOf;

  //###########################################################################################################

  //===========================================================================================================
  BRICS = {
    
    //=========================================================================================================
    /* NOTE Future Single-File Module */
    require_dbric: function() {
      var C, COLOR, Dbric, Show, TMPTRM, colors, exports, internals, isa_jsid, jsid_re, show, templates, write;
      //=======================================================================================================
      write = function(p) {
        return process.stdout.write(p);
      };
      TMPTRM = GUY.trm;
      C = require('ansis');
      // { hide,
      //   set_getter,   } = ( require './main' ).require_managed_property_tools()
      // SQLITE            = require 'node:sqlite'
      // { debug,        } = console

      //-------------------------------------------------------------------------------------------------------
      internals = {};
      //=======================================================================================================
      Dbric = class Dbric {
        //-----------------------------------------------------------------------------------------------------
        constructor(db_path) {
          return void 0;
        }

      };
      //=======================================================================================================
      /* thx to https://github.com/sindresorhus/identifier-regex */
      jsid_re = /^[$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}]*$/v;
      isa_jsid = function(x) {
        return ((typeof x) === 'string') && jsid_re.test(x);
      };
      //=======================================================================================================
      templates = {
        show: {
          indentation: null
        }
      };
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
      return exports = {Dbric, internals};
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
    var v_1, v_10, v_2, v_3, v_4, v_5, v_6, v_7, v_8, v_9;
    debug('Ω___3', show);
    debug('Ω___4', show.state);
    debug('Ω___5', rpr(show.dent));
    debug('Ω___6', show.go_down());
    debug('Ω___7', rpr(show.dent));
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

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLXJwci10eXBlX29mLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxLQUFBLEVBQUEsU0FBQSxFQUFBLGdCQUFBLEVBQUEsY0FBQSxFQUFBLE9BQUE7SUFBQSxvQkFBQTs7Ozs7RUFLQSxLQUFBLEdBTUUsQ0FBQTs7OztJQUFBLGFBQUEsRUFBZSxRQUFBLENBQUEsQ0FBQTtBQUVqQixVQUFBLENBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBLEtBQUE7O01BQ0ksS0FBQSxHQUE0QixRQUFBLENBQUUsQ0FBRixDQUFBO2VBQVMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLENBQXJCO01BQVQ7TUFDNUIsTUFBQSxHQUE0QixHQUFHLENBQUM7TUFDaEMsQ0FBQSxHQUE0QixPQUFBLENBQVEsT0FBUixFQUhoQzs7Ozs7OztNQVVJLFNBQUEsR0FBWSxDQUFBLEVBVmhCOztNQWNVLFFBQU4sTUFBQSxNQUFBLENBQUE7O1FBR0UsV0FBYSxDQUFFLE9BQUYsQ0FBQTtBQUNYLGlCQUFPO1FBREk7O01BSGYsRUFkSjs7O01Bd0JJLE9BQUEsR0FBWTtNQUNaLFFBQUEsR0FBWSxRQUFBLENBQUUsQ0FBRixDQUFBO2VBQVMsQ0FBRSxDQUFFLE9BQU8sQ0FBVCxDQUFBLEtBQWdCLFFBQWxCLENBQUEsSUFBaUMsT0FBTyxDQUFDLElBQVIsQ0FBYSxDQUFiO01BQTFDLEVBekJoQjs7TUE2QkksU0FBQSxHQUNFO1FBQUEsSUFBQSxFQUFNO1VBQUUsV0FBQSxFQUFhO1FBQWY7TUFBTixFQTlCTjs7TUFpQ1UsT0FBTixNQUFBLEtBQUEsQ0FBQTs7UUFHRSxXQUFhLENBQUUsR0FBRixDQUFB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QUFyQyxFQUEwQyxHQUExQyxDQUFaLENBQUwsRUF6QkY7SUEwQkUsSUFBSSxDQUFDLElBQUwsR0FBWTtJQUNaLElBQUEsQ0FBSyxrRUFBTCxFQTNCRjs7SUE2QkUsSUFBQSxDQUFLLGtFQUFMO0lBQ0EsSUFBQSxDQUFBO0FBQ0EsV0FBTztFQWhDRztBQTNZWiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQlJJQ1MgPVxuXG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9kYnJpYzogLT5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgd3JpdGUgICAgICAgICAgICAgICAgICAgICA9ICggcCApIC0+IHByb2Nlc3Muc3Rkb3V0LndyaXRlIHBcbiAgICBUTVBUUk0gICAgICAgICAgICAgICAgICAgID0gR1VZLnRybVxuICAgIEMgICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdhbnNpcydcbiAgICAjIHsgaGlkZSxcbiAgICAjICAgc2V0X2dldHRlciwgICB9ID0gKCByZXF1aXJlICcuL21haW4nICkucmVxdWlyZV9tYW5hZ2VkX3Byb3BlcnR5X3Rvb2xzKClcbiAgICAjIFNRTElURSAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpzcWxpdGUnXG4gICAgIyB7IGRlYnVnLCAgICAgICAgfSA9IGNvbnNvbGVcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW50ZXJuYWxzID0ge31cblxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBEYnJpY1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGRiX3BhdGggKSAtPlxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cblxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAjIyMgdGh4IHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvaWRlbnRpZmllci1yZWdleCAjIyNcbiAgICBqc2lkX3JlICAgPSAvLy9eIFsgJCBfIFxccHtJRF9TdGFydH0gXSBbICQgXyBcXHUyMDBDIFxcdTIwMEQgXFxwe0lEX0NvbnRpbnVlfSBdKiAkLy8vdlxuICAgIGlzYV9qc2lkICA9ICggeCApIC0+ICggKCB0eXBlb2YgeCApIGlzICdzdHJpbmcnICkgYW5kIGpzaWRfcmUudGVzdCB4XG5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgdGVtcGxhdGVzID1cbiAgICAgIHNob3c6IHsgaW5kZW50YXRpb246IG51bGwsIH1cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgU2hvd1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGNmZyApIC0+XG4gICAgICAgIG1lID0gKCB4ICkgPT5cbiAgICAgICAgICByZXR1cm4gKCB0ZXh0IGZvciB0ZXh0IGZyb20gQHBlbiB4ICkuam9pbiAnJ1xuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YgbWUsIEBcbiAgICAgICAgQGNmZyAgICA9IHsgdGVtcGxhdGVzLnNob3cuLi4sIGNmZy4uLiwgfVxuICAgICAgICBAc3RhdGUgID0geyBsZXZlbDogMCwgZW5kZWRfd2l0aF9ubDogZmFsc2UsIH1cbiAgICAgICAgQHNwYWNlciA9ICdcXHgyMFxceDIwJ1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgQCwgJ2RlbnQnLFxuICAgICAgICAgIGdldDogPT4gQHNwYWNlci5yZXBlYXQgQHN0YXRlLmxldmVsXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHBlbjogKCB4ICkgLT5cbiAgICAgICAgZm9yIHRleHQgZnJvbSBAZGlzcGF0Y2ggeFxuICAgICAgICAgIEBzdGF0ZS5lbmRlZF93aXRoX25sID0gdGV4dC5lbmRzV2l0aCAnXFxuJ1xuICAgICAgICAgIHlpZWxkIHRleHRcbiAgICAgICAgdW5sZXNzIEBzdGF0ZS5lbmRlZF93aXRoX25sXG4gICAgICAgICAgQHN0YXRlLmVuZGVkX3dpdGhfbmwgPSB0cnVlXG4gICAgICAgICAgIyB5aWVsZCAnXFxuJ1xuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGdvX2Rvd246IC0+XG4gICAgICAgIEBzdGF0ZS5sZXZlbCsrXG4gICAgICAgIHJldHVybiBAc3RhdGUubGV2ZWxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBnb191cDogLT5cbiAgICAgICAgaWYgQHN0YXRlLmxldmVsIDwgMVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fMSB1bmFibGUgdG8gZ28gYmVsb3cgbGV2ZWwgMFwiXG4gICAgICAgIEBzdGF0ZS5sZXZlbC0tXG4gICAgICAgIHJldHVybiBAc3RhdGUubGV2ZWxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBkaXNwYXRjaDogKCB4ICkgLT5cbiAgICAgICAgaWYgKCBtZXRob2QgPSBAWyBcInNob3dfI3t0eXBlX29mIHh9XCIgXSApP1xuICAgICAgICAgIHlpZWxkIGZyb20gbWV0aG9kLmNhbGwgQCwgeFxuICAgICAgICBlbHNlXG4gICAgICAgICAgeWllbGQgZnJvbSBAc2hvd19vdGhlciB4XG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX3Nob3dfa2V5OiAoIGtleSApIC0+XG4gICAgICAgIGlmIGlzYV9qc2lkIGtleSB0aGVuIHJldHVybiBjb2xvcnMuX2tleSBrZXlcbiAgICAgICAgcmV0dXJuIFsgKCB0IGZvciB0IGZyb20gQGRpc3BhdGNoIGtleSApLi4uLCBdLmpvaW4gJydcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzaG93X3BvZDogKCB4ICkgLT5cbiAgICAgICAgaGFzX2tleXMgPSBmYWxzZVxuICAgICAgICB5aWVsZCBjb2xvcnMucG9kICd7J1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZvciBrZXksIHZhbHVlIG9mIHhcbiAgICAgICAgICAjIyMgVEFJTlQgY29kZSBkdXBsaWNhdGlvbiAjIyNcbiAgICAgICAgICBoYXNfa2V5cyA9IHRydWVcbiAgICAgICAgICB5aWVsZCAnICcgKyAoIEBfc2hvd19rZXkga2V5ICkgKyBjb2xvcnMucG9kICc6ICdcbiAgICAgICAgICBmb3IgdGV4dCBmcm9tIEBkaXNwYXRjaCB2YWx1ZVxuICAgICAgICAgICAgeWllbGQgdGV4dFxuICAgICAgICAgIHlpZWxkIGNvbG9ycy5wb2QgJywnXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeWllbGQgY29sb3JzLnBvZCBpZiAoIG5vdCBoYXNfa2V5cyApIHRoZW4gJ30nIGVsc2UgJyB9J1xuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNob3dfbWFwOiAoIHggKSAtPlxuICAgICAgICBoYXNfa2V5cyA9IGZhbHNlXG4gICAgICAgIHlpZWxkIGNvbG9ycy5tYXAgJ21hcHsnXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZm9yIFsga2V5LCB2YWx1ZSwgXSBmcm9tIHguZW50cmllcygpXG4gICAgICAgICAgIyMjIFRBSU5UIGNvZGUgZHVwbGljYXRpb24gIyMjXG4gICAgICAgICAgaGFzX2tleXMgPSB0cnVlXG4gICAgICAgICAgeWllbGQgJyAnICsgKCBAX3Nob3dfa2V5IGtleSApICsgY29sb3JzLm1hcCAnOiAnXG4gICAgICAgICAgZm9yIHRleHQgZnJvbSBAZGlzcGF0Y2ggdmFsdWVcbiAgICAgICAgICAgIHlpZWxkIHRleHRcbiAgICAgICAgICB5aWVsZCBjb2xvcnMubWFwICcsJ1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHlpZWxkIGNvbG9ycy5tYXAgaWYgKCBub3QgaGFzX2tleXMgKSB0aGVuICd9JyBlbHNlICcgfSdcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzaG93X2xpc3Q6ICggeCApIC0+XG4gICAgICAgIHlpZWxkIGNvbG9ycy5saXN0ICdbJ1xuICAgICAgICBmb3IgZWxlbWVudCBpbiB4XG4gICAgICAgICAgIyMjIFRBSU5UIGNvZGUgZHVwbGljYXRpb24gIyMjXG4gICAgICAgICAgZm9yIHRleHQgZnJvbSBAZGlzcGF0Y2ggZWxlbWVudFxuICAgICAgICAgICAgeWllbGQgJyAnICsgdGV4dCArICggY29sb3JzLmxpc3QgJywnIClcbiAgICAgICAgeWllbGQgY29sb3JzLmxpc3QgaWYgKCB4Lmxlbmd0aCBpcyAwICkgdGhlbiAnXScgZWxzZSAnIF0nXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2hvd19zZXQ6ICggeCApIC0+XG4gICAgICAgIHlpZWxkIGNvbG9ycy5zZXQgJ3NldFsnXG4gICAgICAgIGZvciBlbGVtZW50IGZyb20geC5rZXlzKClcbiAgICAgICAgICAjIyMgVEFJTlQgY29kZSBkdXBsaWNhdGlvbiAjIyNcbiAgICAgICAgICBmb3IgdGV4dCBmcm9tIEBkaXNwYXRjaCBlbGVtZW50XG4gICAgICAgICAgICB5aWVsZCAnICcgKyB0ZXh0ICsgY29sb3JzLnNldCAnLCdcbiAgICAgICAgeWllbGQgY29sb3JzLnNldCBpZiAoIHgubGVuZ3RoIGlzIDAgKSB0aGVuICddJyBlbHNlICcgXSdcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzaG93X3RleHQ6ICggeCApIC0+XG4gICAgICAgIGlmIFwiJ1wiIGluIHggdGhlbiAgeWllbGQgY29sb3JzLnRleHQgJ1wiJyArICggeC5yZXBsYWNlIC9cIi9nLCAnXFxcXFwiJyApICsgJ1wiJ1xuICAgICAgICBlbHNlICAgICAgICAgICAgICB5aWVsZCBjb2xvcnMudGV4dCBcIidcIiArICggeC5yZXBsYWNlIC8nL2csIFwiXFxcXCdcIiApICsgXCInXCJcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzaG93X2Zsb2F0OiAoIHggKSAtPlxuICAgICAgICB5aWVsZCAoIGNvbG9ycy5mbG9hdCB4LnRvU3RyaW5nKCkgKVxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNob3dfcmVnZXg6ICggeCApIC0+XG4gICAgICAgIHlpZWxkICggY29sb3JzLnJlZ2V4IHgudG9TdHJpbmcoKSApXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgIyMjIGZ1bGwgd29yZHM6ICMjI1xuICAgICAgIyBzaG93X3RydWU6ICAgICAgKCB4ICkgLT4geWllbGQgKCBjb2xvcnMudHJ1ZSAgICAgICd0cnVlJyAgICAgIClcbiAgICAgICMgc2hvd19mYWxzZTogICAgICggeCApIC0+IHlpZWxkICggY29sb3JzLmZhbHNlICAgICAnZmFsc2UnICAgICApXG4gICAgICAjIHNob3dfdW5kZWZpbmVkOiAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy51bmRlZmluZWQgJ3VuZGVmaW5lZCcgKVxuICAgICAgIyBzaG93X251bGw6ICAgICAgKCB4ICkgLT4geWllbGQgKCBjb2xvcnMubnVsbCAgICAgICdudWxsJyAgICAgIClcbiAgICAgICMgc2hvd19uYW46ICAgICAgICggeCApIC0+IHlpZWxkICggY29sb3JzLm5hbiAgICAgICAnTmFOJyAgICAgICApXG4gICAgICAjIyMgKG1vc3RseSkgc2luZ2xlIGxldHRlcnM6ICMjI1xuICAgICAgc2hvd190cnVlOiAgICAgICggeCApIC0+IHlpZWxkICggY29sb3JzLnRydWUgICAgICAnIFQgJyAgICAgKVxuICAgICAgc2hvd19mYWxzZTogICAgICggeCApIC0+IHlpZWxkICggY29sb3JzLmZhbHNlICAgICAnIEYgJyAgICAgKVxuICAgICAgc2hvd191bmRlZmluZWQ6ICggeCApIC0+IHlpZWxkICggY29sb3JzLnVuZGVmaW5lZCAnIFUgJyAgICAgKVxuICAgICAgc2hvd19udWxsOiAgICAgICggeCApIC0+IHlpZWxkICggY29sb3JzLm51bGwgICAgICAnIE4gJyAgICAgKVxuICAgICAgc2hvd19uYW46ICAgICAgICggeCApIC0+IHlpZWxkICggY29sb3JzLm5hbiAgICAgICAnIE5hTiAnICAgKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNob3dfb3RoZXI6ICggeCApIC0+XG4gICAgICAgICMgeWllbGQgJ1xcbicgdW5sZXNzIEBzdGF0ZS5lbmRlZF93aXRoX25sXG4gICAgICAgIHlpZWxkIGNvbG9ycy5vdGhlciBcIiN7eH1cIlxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBDT0xPUiA9IG5ldyBDLkFuc2lzKCkuZXh0ZW5kXG4gICAgICBhbGljZWJsdWU6ICAgICAgICAgICAgICAgICAgJyNmMGY4ZmYnXG4gICAgICBhbnRpcXVld2hpdGU6ICAgICAgICAgICAgICAgJyNmYWViZDcnXG4gICAgICBhcXVhOiAgICAgICAgICAgICAgICAgICAgICAgJyMwMGZmZmYnXG4gICAgICBhcXVhbWFyaW5lOiAgICAgICAgICAgICAgICAgJyM3ZmZmZDQnXG4gICAgICBhenVyZTogICAgICAgICAgICAgICAgICAgICAgJyNmMGZmZmYnXG4gICAgICBiZWlnZTogICAgICAgICAgICAgICAgICAgICAgJyNmNWY1ZGMnXG4gICAgICBiaXNxdWU6ICAgICAgICAgICAgICAgICAgICAgJyNmZmU0YzQnXG4gICAgICBibGFjazogICAgICAgICAgICAgICAgICAgICAgJyMwMDAwMDAnXG4gICAgICBibGFuY2hlZGFsbW9uZDogICAgICAgICAgICAgJyNmZmViY2QnXG4gICAgICBibHVlOiAgICAgICAgICAgICAgICAgICAgICAgJyMwMDAwZmYnXG4gICAgICBibHVldmlvbGV0OiAgICAgICAgICAgICAgICAgJyM4YTJiZTInXG4gICAgICBicm93bjogICAgICAgICAgICAgICAgICAgICAgJyNhNTJhMmEnXG4gICAgICBidXJseXdvb2Q6ICAgICAgICAgICAgICAgICAgJyNkZWI4ODcnXG4gICAgICBjYWRldGJsdWU6ICAgICAgICAgICAgICAgICAgJyM1ZjllYTAnXG4gICAgICBjaGFydHJldXNlOiAgICAgICAgICAgICAgICAgJyM3ZmZmMDAnXG4gICAgICBjaG9jb2xhdGU6ICAgICAgICAgICAgICAgICAgJyNkMjY5MWUnXG4gICAgICBjb3JhbDogICAgICAgICAgICAgICAgICAgICAgJyNmZjdmNTAnXG4gICAgICBjb3JuZmxvd2VyYmx1ZTogICAgICAgICAgICAgJyM2NDk1ZWQnXG4gICAgICBjb3Juc2lsazogICAgICAgICAgICAgICAgICAgJyNmZmY4ZGMnXG4gICAgICBjcmltc29uOiAgICAgICAgICAgICAgICAgICAgJyNkYzE0M2MnXG4gICAgICBjeWFuOiAgICAgICAgICAgICAgICAgICAgICAgJyMwMGZmZmYnXG4gICAgICBkYXJrYmx1ZTogICAgICAgICAgICAgICAgICAgJyMwMDAwOGInXG4gICAgICBkYXJrY3lhbjogICAgICAgICAgICAgICAgICAgJyMwMDhiOGInXG4gICAgICBkYXJrZ29sZGVucm9kOiAgICAgICAgICAgICAgJyNiODg2MGInXG4gICAgICBkYXJrZ3JheTogICAgICAgICAgICAgICAgICAgJyNhOWE5YTknXG4gICAgICBkYXJrZ3JlZW46ICAgICAgICAgICAgICAgICAgJyMwMDY0MDAnXG4gICAgICBkYXJra2hha2k6ICAgICAgICAgICAgICAgICAgJyNiZGI3NmInXG4gICAgICBkYXJrbWFnZW50YTogICAgICAgICAgICAgICAgJyM4YjAwOGInXG4gICAgICBkYXJrb2xpdmVncmVlbjogICAgICAgICAgICAgJyM1NTZiMmYnXG4gICAgICBkYXJrb3JhbmdlOiAgICAgICAgICAgICAgICAgJyNmZjhjMDAnXG4gICAgICBkYXJrb3JjaGlkOiAgICAgICAgICAgICAgICAgJyM5OTMyY2MnXG4gICAgICBkYXJrcmVkOiAgICAgICAgICAgICAgICAgICAgJyM4YjAwMDAnXG4gICAgICBkYXJrc2FsbW9uOiAgICAgICAgICAgICAgICAgJyNlOTk2N2EnXG4gICAgICBkYXJrc2VhZ3JlZW46ICAgICAgICAgICAgICAgJyM4ZmJjOGYnXG4gICAgICBkYXJrc2xhdGVibHVlOiAgICAgICAgICAgICAgJyM0ODNkOGInXG4gICAgICBkYXJrc2xhdGVncmF5OiAgICAgICAgICAgICAgJyMyZjRmNGYnXG4gICAgICBkYXJrdHVycXVvaXNlOiAgICAgICAgICAgICAgJyMwMGNlZDEnXG4gICAgICBkYXJrdmlvbGV0OiAgICAgICAgICAgICAgICAgJyM5NDAwZDMnXG4gICAgICBkZWVwcGluazogICAgICAgICAgICAgICAgICAgJyNmZjE0OTMnXG4gICAgICBkZWVwc2t5Ymx1ZTogICAgICAgICAgICAgICAgJyMwMGJmZmYnXG4gICAgICBkaW1ncmF5OiAgICAgICAgICAgICAgICAgICAgJyM2OTY5NjknXG4gICAgICBkb2RnZXJibHVlOiAgICAgICAgICAgICAgICAgJyMxZTkwZmYnXG4gICAgICBmaXJlYnJpY2s6ICAgICAgICAgICAgICAgICAgJyNiMjIyMjInXG4gICAgICBmbG9yYWx3aGl0ZTogICAgICAgICAgICAgICAgJyNmZmZhZjAnXG4gICAgICBmb3Jlc3RncmVlbjogICAgICAgICAgICAgICAgJyMyMjhiMjInXG4gICAgICBnYWluc2Jvcm86ICAgICAgICAgICAgICAgICAgJyNkY2RjZGMnXG4gICAgICBnaG9zdHdoaXRlOiAgICAgICAgICAgICAgICAgJyNmOGY4ZmYnXG4gICAgICBnb2xkOiAgICAgICAgICAgICAgICAgICAgICAgJyNmZmQ3MDAnXG4gICAgICBnb2xkZW5yb2Q6ICAgICAgICAgICAgICAgICAgJyNkYWE1MjAnXG4gICAgICBncmF5OiAgICAgICAgICAgICAgICAgICAgICAgJyM4MDgwODAnXG4gICAgICBncmVlbjogICAgICAgICAgICAgICAgICAgICAgJyMwMDgwMDAnXG4gICAgICBncmVlbnllbGxvdzogICAgICAgICAgICAgICAgJyNhZGZmMmYnXG4gICAgICBob25leWRldzogICAgICAgICAgICAgICAgICAgJyNmMGZmZjAnXG4gICAgICBob3RwaW5rOiAgICAgICAgICAgICAgICAgICAgJyNmZjY5YjQnXG4gICAgICBpbmRpYW5yZWQ6ICAgICAgICAgICAgICAgICAgJyNjZDVjNWMnXG4gICAgICBpbmRpZ286ICAgICAgICAgICAgICAgICAgICAgJyM0YjAwODInXG4gICAgICBpdm9yeTogICAgICAgICAgICAgICAgICAgICAgJyNmZmZmZjAnXG4gICAgICBraGFraTogICAgICAgICAgICAgICAgICAgICAgJyNmMGU2OGMnXG4gICAgICBsYXZlbmRlcjogICAgICAgICAgICAgICAgICAgJyNlNmU2ZmEnXG4gICAgICBsYXZlbmRlcmJsdXNoOiAgICAgICAgICAgICAgJyNmZmYwZjUnXG4gICAgICBsYXduZ3JlZW46ICAgICAgICAgICAgICAgICAgJyM3Y2ZjMDAnXG4gICAgICBsZW1vbmNoaWZmb246ICAgICAgICAgICAgICAgJyNmZmZhY2QnXG4gICAgICBsaWdodGJsdWU6ICAgICAgICAgICAgICAgICAgJyNhZGQ4ZTYnXG4gICAgICBsaWdodGNvcmFsOiAgICAgICAgICAgICAgICAgJyNmMDgwODAnXG4gICAgICBsaWdodGN5YW46ICAgICAgICAgICAgICAgICAgJyNlMGZmZmYnXG4gICAgICBsaWdodGdvbGRlbnJvZHllbGxvdzogICAgICAgJyNmYWZhZDInXG4gICAgICBsaWdodGdyYXk6ICAgICAgICAgICAgICAgICAgJyNkM2QzZDMnXG4gICAgICBsaWdodGdyZWVuOiAgICAgICAgICAgICAgICAgJyM5MGVlOTAnXG4gICAgICBsaWdodHBpbms6ICAgICAgICAgICAgICAgICAgJyNmZmI2YzEnXG4gICAgICBsaWdodHNhbG1vbjogICAgICAgICAgICAgICAgJyNmZmEwN2EnXG4gICAgICBsaWdodHNlYWdyZWVuOiAgICAgICAgICAgICAgJyMyMGIyYWEnXG4gICAgICBsaWdodHNreWJsdWU6ICAgICAgICAgICAgICAgJyM4N2NlZmEnXG4gICAgICBsaWdodHNsYXRlZ3JheTogICAgICAgICAgICAgJyM3Nzg4OTknXG4gICAgICBsaWdodHN0ZWVsYmx1ZTogICAgICAgICAgICAgJyNiMGM0ZGUnXG4gICAgICBsaWdodHllbGxvdzogICAgICAgICAgICAgICAgJyNmZmZmZTAnXG4gICAgICBsaW1lOiAgICAgICAgICAgICAgICAgICAgICAgJyMwMGZmMDAnXG4gICAgICBsaW1lZ3JlZW46ICAgICAgICAgICAgICAgICAgJyMzMmNkMzInXG4gICAgICBsaW5lbjogICAgICAgICAgICAgICAgICAgICAgJyNmYWYwZTYnXG4gICAgICBtYWdlbnRhOiAgICAgICAgICAgICAgICAgICAgJyNmZjAwZmYnXG4gICAgICBtYXJvb246ICAgICAgICAgICAgICAgICAgICAgJyM4MDAwMDAnXG4gICAgICBtZWRpdW1hcXVhbWFyaW5lOiAgICAgICAgICAgJyM2NmNkYWEnXG4gICAgICBtZWRpdW1ibHVlOiAgICAgICAgICAgICAgICAgJyMwMDAwY2QnXG4gICAgICBtZWRpdW1vcmNoaWQ6ICAgICAgICAgICAgICAgJyNiYTU1ZDMnXG4gICAgICBtZWRpdW1wdXJwbGU6ICAgICAgICAgICAgICAgJyM5MzcwZGInXG4gICAgICBtZWRpdW1zZWFncmVlbjogICAgICAgICAgICAgJyMzY2IzNzEnXG4gICAgICBtZWRpdW1zbGF0ZWJsdWU6ICAgICAgICAgICAgJyM3YjY4ZWUnXG4gICAgICBtZWRpdW1zcHJpbmdncmVlbjogICAgICAgICAgJyMwMGZhOWEnXG4gICAgICBtZWRpdW10dXJxdW9pc2U6ICAgICAgICAgICAgJyM0OGQxY2MnXG4gICAgICBtZWRpdW12aW9sZXRyZWQ6ICAgICAgICAgICAgJyNjNzE1ODUnXG4gICAgICBtaWRuaWdodGJsdWU6ICAgICAgICAgICAgICAgJyMxOTE5NzAnXG4gICAgICBtaW50Y3JlYW06ICAgICAgICAgICAgICAgICAgJyNmNWZmZmEnXG4gICAgICBtaXN0eXJvc2U6ICAgICAgICAgICAgICAgICAgJyNmZmU0ZTEnXG4gICAgICBtb2NjYXNpbjogICAgICAgICAgICAgICAgICAgJyNmZmU0YjUnXG4gICAgICBuYXZham93aGl0ZTogICAgICAgICAgICAgICAgJyNmZmRlYWQnXG4gICAgICBuYXZ5OiAgICAgICAgICAgICAgICAgICAgICAgJyMwMDAwODAnXG4gICAgICBvbGRsYWNlOiAgICAgICAgICAgICAgICAgICAgJyNmZGY1ZTYnXG4gICAgICBvbGl2ZTogICAgICAgICAgICAgICAgICAgICAgJyM4MDgwMDAnXG4gICAgICBvbGl2ZWRyYWI6ICAgICAgICAgICAgICAgICAgJyM2YjhlMjMnXG4gICAgICBvcmFuZ2U6ICAgICAgICAgICAgICAgICAgICAgJyNmZmE1MDAnXG4gICAgICBvcmFuZ2VyZWQ6ICAgICAgICAgICAgICAgICAgJyNmZjQ1MDAnXG4gICAgICBvcmNoaWQ6ICAgICAgICAgICAgICAgICAgICAgJyNkYTcwZDYnXG4gICAgICBwYWxlZ29sZGVucm9kOiAgICAgICAgICAgICAgJyNlZWU4YWEnXG4gICAgICBwYWxlZ3JlZW46ICAgICAgICAgICAgICAgICAgJyM5OGZiOTgnXG4gICAgICBwYWxldHVycXVvaXNlOiAgICAgICAgICAgICAgJyNhZmVlZWUnXG4gICAgICBwYWxldmlvbGV0cmVkOiAgICAgICAgICAgICAgJyNkYjcwOTMnXG4gICAgICBwYXBheWF3aGlwOiAgICAgICAgICAgICAgICAgJyNmZmVmZDUnXG4gICAgICBwZWFjaHB1ZmY6ICAgICAgICAgICAgICAgICAgJyNmZmRhYjknXG4gICAgICBwZXJ1OiAgICAgICAgICAgICAgICAgICAgICAgJyNjZDg1M2YnXG4gICAgICBwaW5rOiAgICAgICAgICAgICAgICAgICAgICAgJyNmZmMwY2InXG4gICAgICBwbHVtOiAgICAgICAgICAgICAgICAgICAgICAgJyNkZGEwZGQnXG4gICAgICBwb3dkZXJibHVlOiAgICAgICAgICAgICAgICAgJyNiMGUwZTYnXG4gICAgICBwdXJwbGU6ICAgICAgICAgICAgICAgICAgICAgJyM4MDAwODAnXG4gICAgICByZWQ6ICAgICAgICAgICAgICAgICAgICAgICAgJyNmZjAwMDAnXG4gICAgICByb3N5YnJvd246ICAgICAgICAgICAgICAgICAgJyNiYzhmOGYnXG4gICAgICByb3lhbGJsdWU6ICAgICAgICAgICAgICAgICAgJyM0MTY5ZTEnXG4gICAgICBzYWRkbGVicm93bjogICAgICAgICAgICAgICAgJyM4YjQ1MTMnXG4gICAgICBzYWxtb246ICAgICAgICAgICAgICAgICAgICAgJyNmYTgwNzInXG4gICAgICBzYW5keWJyb3duOiAgICAgICAgICAgICAgICAgJyNmNGE0NjAnXG4gICAgICBzZWFncmVlbjogICAgICAgICAgICAgICAgICAgJyMyZThiNTcnXG4gICAgICBzZWFzaGVsbDogICAgICAgICAgICAgICAgICAgJyNmZmY1ZWUnXG4gICAgICBzaWVubmE6ICAgICAgICAgICAgICAgICAgICAgJyNhMDUyMmQnXG4gICAgICBzaWx2ZXI6ICAgICAgICAgICAgICAgICAgICAgJyNjMGMwYzAnXG4gICAgICBza3libHVlOiAgICAgICAgICAgICAgICAgICAgJyM4N2NlZWInXG4gICAgICBzbGF0ZWJsdWU6ICAgICAgICAgICAgICAgICAgJyM2YTVhY2QnXG4gICAgICBzbGF0ZWdyYXk6ICAgICAgICAgICAgICAgICAgJyM3MDgwOTAnXG4gICAgICBzbm93OiAgICAgICAgICAgICAgICAgICAgICAgJyNmZmZhZmEnXG4gICAgICBzcHJpbmdncmVlbjogICAgICAgICAgICAgICAgJyMwMGZmN2YnXG4gICAgICBzdGVlbGJsdWU6ICAgICAgICAgICAgICAgICAgJyM0NjgyYjQnXG4gICAgICB0YW46ICAgICAgICAgICAgICAgICAgICAgICAgJyNkMmI0OGMnXG4gICAgICB0ZWFsOiAgICAgICAgICAgICAgICAgICAgICAgJyMwMDgwODAnXG4gICAgICB0aGlzdGxlOiAgICAgICAgICAgICAgICAgICAgJyNkOGJmZDgnXG4gICAgICB0b21hdG86ICAgICAgICAgICAgICAgICAgICAgJyNmZjYzNDcnXG4gICAgICB0dXJxdW9pc2U6ICAgICAgICAgICAgICAgICAgJyM0MGUwZDAnXG4gICAgICB2aW9sZXQ6ICAgICAgICAgICAgICAgICAgICAgJyNlZTgyZWUnXG4gICAgICB3aGVhdDogICAgICAgICAgICAgICAgICAgICAgJyNmNWRlYjMnXG4gICAgICB3aGl0ZTogICAgICAgICAgICAgICAgICAgICAgJyNmZmZmZmYnXG4gICAgICB3aGl0ZXNtb2tlOiAgICAgICAgICAgICAgICAgJyNmNWY1ZjUnXG4gICAgICB5ZWxsb3c6ICAgICAgICAgICAgICAgICAgICAgJyNmZmZmMDAnXG4gICAgICB5ZWxsb3dncmVlbjogICAgICAgICAgICAgICAgJyM5YWNkMzInXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIEZBTkNZUkVEOiAgICAgICAgICAgICAgICAgICAnI2ZkNTIzMCdcbiAgICAgIEZBTkNZT1JBTkdFOiAgICAgICAgICAgICAgICAnI2ZkNmQzMCdcbiAgICAgICMgb29tcGg6ICggeCApIC0+IGRlYnVnICfOqV9fXzInLCB4OyByZXR1cm4gXCJ+fn4gI3t4fSB+fn5cIlxuXG4gICAgY29sb3JzID1cbiAgICAgIF9rZXk6ICAgICAgICggeCApIC0+IENPTE9SLmN5YW4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhcbiAgICAgIHBvZDogICAgICAgICggeCApIC0+IENPTE9SLmdvbGQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhcbiAgICAgIG1hcDogICAgICAgICggeCApIC0+IENPTE9SLmdvbGQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhcbiAgICAgIGxpc3Q6ICAgICAgICggeCApIC0+IENPTE9SLmdvbGQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhcbiAgICAgIHNldDogICAgICAgICggeCApIC0+IENPTE9SLmdvbGQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhcbiAgICAgIHRleHQ6ICAgICAgICggeCApIC0+IENPTE9SLndoZWF0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhcbiAgICAgIGZsb2F0OiAgICAgICggeCApIC0+IENPTE9SLkZBTkNZUkVEICAgICAgICAgICAgICAgICAgICAgICAgIHhcbiAgICAgIHJlZ2V4OiAgICAgICggeCApIC0+IENPTE9SLnBsdW0gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhcbiAgICAgIHRydWU6ICAgICAgICggeCApIC0+IENPTE9SLmludmVyc2UuYm9sZC5pdGFsaWMubGltZSAgICAgICAgIHhcbiAgICAgIGZhbHNlOiAgICAgICggeCApIC0+IENPTE9SLmludmVyc2UuYm9sZC5pdGFsaWMuRkFOQ1lPUkFOR0UgIHhcbiAgICAgIHVuZGVmaW5lZDogICggeCApIC0+IENPTE9SLmludmVyc2UuYm9sZC5pdGFsaWMubWFnZW50YSAgICAgIHhcbiAgICAgIG51bGw6ICAgICAgICggeCApIC0+IENPTE9SLmludmVyc2UuYm9sZC5pdGFsaWMuYmx1ZSAgICAgICAgIHhcbiAgICAgIG5hbjogICAgICAgICggeCApIC0+IENPTE9SLmludmVyc2UuYm9sZC5pdGFsaWMubWFnZW50YSAgICAgIHhcbiAgICAgIG90aGVyOiAgICAgICggeCApIC0+IENPTE9SLmludmVyc2UucmVkICAgICAgICAgICAgICAgICAgICAgIHhcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgc2hvdyA9IG5ldyBTaG93KClcblxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIHsgaW50ZXJuYWxzLi4uLCB9XG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7XG4gICAgICBEYnJpYyxcbiAgICAgIGludGVybmFscywgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgQlJJQ1NcblxuXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxub2JqZWN0X3Byb3RvdHlwZSAgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yge31cbnBvZF9wcm90b3R5cGVzICAgID0gWyBudWxsLCBvYmplY3RfcHJvdG90eXBlLCBdXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudHlwZV9vZiA9ICggeCApIC0+XG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgIyMjIFByaW1pdGl2ZXM6ICMjI1xuICByZXR1cm4gJ251bGwnICAgICAgICAgaWYgeCBpcyBudWxsXG4gIHJldHVybiAndW5kZWZpbmVkJyAgICBpZiB4IGlzIHVuZGVmaW5lZFxuICByZXR1cm4gJ2luZmluaXR5JyAgICAgaWYgKCB4IGlzICtJbmZpbml0eSApIG9yICggeCBpcyAtSW5maW5pdHkgKVxuICAjIHJldHVybiAnYm9vbGVhbicgICAgICBpZiAoIHggaXMgdHJ1ZSApIG9yICggeCBpcyBmYWxzZSApXG4gIHJldHVybiAndHJ1ZScgICAgICAgICBpZiAoIHggaXMgdHJ1ZSApXG4gIHJldHVybiAnZmFsc2UnICAgICAgICBpZiAoIHggaXMgZmFsc2UgKVxuICByZXR1cm4gJ25hbicgICAgICAgICAgaWYgTnVtYmVyLmlzTmFOICAgICB4XG4gIHJldHVybiAnZmxvYXQnICAgICAgICBpZiBOdW1iZXIuaXNGaW5pdGUgIHhcbiAgIyByZXR1cm4gJ3Vuc2V0JyAgICAgICAgaWYgeCBpcyB1bnNldFxuICByZXR1cm4gJ3BvZCcgICAgICAgICAgaWYgKCBPYmplY3QuZ2V0UHJvdG90eXBlT2YgeCApIGluIHBvZF9wcm90b3R5cGVzXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgc3dpdGNoIGpzdHlwZW9mID0gdHlwZW9mIHhcbiAgICB3aGVuICdzdHJpbmcnICAgICAgICAgICAgICAgICAgICAgICB0aGVuIHJldHVybiAndGV4dCdcbiAgICB3aGVuICdzeW1ib2wnICAgICAgICAgICAgICAgICAgICAgICB0aGVuIHJldHVybiAnc3ltYm9sJ1xuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHJldHVybiAnbGlzdCcgICAgICAgICBpZiBBcnJheS5pc0FycmF5ICB4XG4gICMjIyBUQUlOVCBjb25zaWRlciB0byByZXR1cm4geC5jb25zdHJ1Y3Rvci5uYW1lICMjI1xuICBzd2l0Y2ggbWlsbGVydHlwZSA9ICggKCBPYmplY3Q6OnRvU3RyaW5nLmNhbGwgeCApLnJlcGxhY2UgL15cXFtvYmplY3QgKFteXFxdXSspXFxdJC8sICckMScgKS50b0xvd2VyQ2FzZSgpXG4gICAgd2hlbiAncmVnZXhwJyAgICAgICAgICAgICAgICAgICAgICAgdGhlbiByZXR1cm4gJ3JlZ2V4J1xuICByZXR1cm4gbWlsbGVydHlwZVxuICAjIHN3aXRjaCBtaWxsZXJ0eXBlID0gT2JqZWN0Ojp0b1N0cmluZy5jYWxsIHhcbiAgIyAgIHdoZW4gJ1tvYmplY3QgRnVuY3Rpb25dJyAgICAgICAgICAgIHRoZW4gcmV0dXJuICdmdW5jdGlvbidcbiAgIyAgIHdoZW4gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nICAgICAgIHRoZW4gcmV0dXJuICdhc3luY2Z1bmN0aW9uJ1xuICAjICAgd2hlbiAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nICAgdGhlbiByZXR1cm4gJ2dlbmVyYXRvcmZ1bmN0aW9uJ1xuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlbW9fc2hvdyA9IC0+XG4gIGRlYnVnICfOqV9fXzMnLCBzaG93XG4gIGRlYnVnICfOqV9fXzQnLCBzaG93LnN0YXRlXG4gIGRlYnVnICfOqV9fXzUnLCBycHIgc2hvdy5kZW50XG4gIGRlYnVnICfOqV9fXzYnLCBzaG93LmdvX2Rvd24oKVxuICBkZWJ1ZyAnzqlfX183JywgcnByIHNob3cuZGVudFxuICBlY2hvKClcbiAgZWNobyAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvIHNob3cgdl8xID0gXCJmb28gJ2JhcidcIlxuICBlY2hvICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8gc2hvdyB2XzIgPSB7fVxuICBlY2hvICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8gc2hvdyB2XzMgPSB7IGtvbmc6IDEwOCwgbG93OiA5MjMsIG51bWJlcnM6IFsgMTAsIDExLCAxMiwgXSwgfVxuICBlY2hvICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8gc2hvdyB2XzQgPSBbXVxuICBlY2hvICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8gc2hvdyB2XzUgPSBbICdzb21lJywgJ3dvcmRzJywgJ3RvJywgJ3Nob3cnLCAxLCAtMSwgZmFsc2UsIF1cbiAgZWNobyAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvIHNob3cgdl82ID0gbmV3IE1hcCBbIFsgJ2tvbmcnLCAxMDgsIF0sIFsgJ2xvdycsIDkyMywgXSwgWyA5NzEsICd3b3JkJywgXSwgWyB0cnVlLCAnKzEnLCBdLCBbICdhIGIgYycsIGZhbHNlLCBdIF1cbiAgZWNobyAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvIHNob3cgdl83ID0gbmV3IFNldCBbICdzb21lJywgJ3dvcmRzJywgdHJ1ZSwgZmFsc2UsIG51bGwsIHVuZGVmaW5lZCwgMy4xNDE1OTI2LCBOYU4sIF1cbiAgZWNobyAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvIHNob3cgdl84ID0gL2FiY1tkZV0vXG4gIGVjaG8gJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyBzaG93IHZfOSA9IEJ1ZmZlci5mcm9tICdhYmPDpMO2w7wnXG4gIGVjaG8gJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyBzaG93IHZfMTAgPSB7IHZfMSwgdl8yLCB2XzMsIHZfNCwgdl81LCB2XzYsIHZfNywgdl84LCB2XzksIH0gIyB2XzEwLCB2XzExLCB2XzEyLCB2XzEzLCB2XzE0LCB9XG4gIHZfMTAudl8xMCA9IHZfMTBcbiAgZWNobyAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICAjIGVjaG8gc2hvdyB2XzEwID0geyB2XzEsIHZfMiwgdl8zLCB2XzQsIHZfNSwgdl82LCB2XzcsIHZfOCwgdl85LCB2XzEwLCB9ICMgdl8xMCwgdl8xMSwgdl8xMiwgdl8xMywgdl8xNCwgfVxuICBlY2hvICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8oKVxuICByZXR1cm4gbnVsbFxuXG5cblxuXG5cbiJdfQ==
//# sourceURL=../src/unstable-rpr-type_of.coffee