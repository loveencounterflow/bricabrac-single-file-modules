(function() {
  'use strict';
  var BRICS, debug, demo_show, echo,
    indexOf = [].indexOf;

  ({
    debug,
    log: echo
  } = console);

  //###########################################################################################################

  //===========================================================================================================
  BRICS = {
    
    //=========================================================================================================
    /* NOTE Future Single-File Module */
    require_show: function() {
      var C, COLOR, Show, colors, exports, internals, is_primitive_type, isa_jsid, jsid_re, show, show_no_colors, strip_ansi, templates, type_of, write;
      //=======================================================================================================
      write = function(p) {
        return process.stdout.write(p);
      };
      C = require('../../hengist-NG/node_modules/.pnpm/ansis@4.1.0/node_modules/ansis/index.cjs');
      ({type_of, is_primitive_type} = BRICS.require_type_of());
      ({strip_ansi} = (require('./main')).require_strip_ansi());
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
          indentation: null,
          colors: true
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
            /* TAINT avoid to add colors instead */
            var R, text;
            R = ((function() {
              var results;
              results = [];
              for (text of this.pen(x)) {
                results.push(text);
              }
              return results;
            }).call(this)).join('');
            if (this.cfg.colors === false) {
              R = strip_ansi(R);
            }
            return R;
          };
          Object.setPrototypeOf(me, this);
          this.cfg = {...templates.show, ...cfg};
          this.state = {
            level: 0,
            ended_with_nl: false,
            seen: new Set()
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
          this.state.seen.clear();
          for (text of this.dispatch(x)) {
            this.state.ended_with_nl = text.endsWith('\n');
            yield text;
          }
          if (!this.state.ended_with_nl) {
            this.state.ended_with_nl = true;
          }
          // yield '\n'
          this.state.seen.clear();
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
          var method, omit, type;
          type = type_of(x);
          omit = false;
          if (is_primitive_type(type)) {
            if (this.state.seen.has(x)) {
              // debug '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', "seen", type
              null;
            } else {
              // omit = true
              // yield '(CIRCULAR)'
              this.state.seen.add(x);
            }
          }
          if (!omit) {
            if ((method = this[`show_${type}`]) != null) {
              yield* method.call(this, x);
            } else {
              yield* this.show_other(x);
            }
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
          var R, element, i, len, text;
          R = '';
          R += colors.list('[');
          for (i = 0, len = x.length; i < len; i++) {
            element = x[i];
/* TAINT code duplication */
            for (text of this.dispatch(element)) {
              R += ' ' + text + (colors.list(','));
            }
          }
          R += colors.list((x.length === 0) ? ']' : ' ]');
          yield R;
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
      show_no_colors = new Show({
        colors: false
      });
      //=======================================================================================================
      internals = Object.freeze({...internals});
      return exports = {Show, show, show_no_colors, internals};
    },
    //=========================================================================================================
    /* NOTE Future Single-File Module */
    require_type_of: function() {
      var exports, internals, is_primitive, is_primitive_type, object_prototype, pod_prototypes, primitive_types, type_of;
      //=======================================================================================================
      object_prototype = Object.getPrototypeOf({});
      pod_prototypes = Object.freeze([null, object_prototype]);
      //-----------------------------------------------------------------------------------------------------------
      primitive_types = Object.freeze(['null', 'undefined', 'boolean', 'infinity', 'nan', 'float', 'text', 'symbol', 'regex']);
      //=======================================================================================================
      internals = {object_prototype, pod_prototypes, primitive_types};
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
        if ((x === true) || (x === false)) {
          return 'boolean';
        }
        if (Number.isNaN(x)) {
          // return 'true'         if ( x is true )
          // return 'false'        if ( x is false )
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

      //-----------------------------------------------------------------------------------------------------------
      is_primitive = function(x) {
        var ref;
        return ref = type_of(x), indexOf.call(primitive_types, ref) >= 0;
      };
      is_primitive_type = function(type) {
        return indexOf.call(primitive_types, type) >= 0;
      };
      //=======================================================================================================
      internals = Object.freeze({...internals});
      return exports = {type_of, is_primitive, is_primitive_type, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, BRICS);

  //===========================================================================================================
  demo_show = function() {
    var GUY, Show, a, b, c, d, e, rpr, show, v_1, v_10, v_2, v_3, v_4, v_5, v_6, v_7, v_8, v_9;
    GUY = require('../../guy');
    ({rpr} = GUY.trm);
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
    echo(rpr(v_10));
    echo('————————————————————————————————————————————————————————————————');
    a = ['a'];
    b = ['b', a];
    echo(rpr(b));
    echo(show(b));
    echo('————————————————————————————————————————————————————————————————');
    b.push(a);
    echo(rpr(b));
    echo(show(b));
    echo('————————————————————————————————————————————————————————————————');
    d = {};
    c = {d};
    d.c = c;
    e = {d, c};
    echo(rpr(c));
    echo(rpr(e));
    // echo show b
    echo('————————————————————————————————————————————————————————————————');
    echo();
    return null;
  };

  // demo_show()

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLXJwci10eXBlX29mLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxJQUFBO0lBQUE7O0VBRUEsQ0FBQTtJQUFFLEtBQUY7SUFDRSxHQUFBLEVBQUs7RUFEUCxDQUFBLEdBQ2lCLE9BRGpCLEVBRkE7Ozs7O0VBU0EsS0FBQSxHQU1FLENBQUE7Ozs7SUFBQSxZQUFBLEVBQWMsUUFBQSxDQUFBLENBQUE7QUFFaEIsVUFBQSxDQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLFNBQUEsRUFBQSxpQkFBQSxFQUFBLFFBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLGNBQUEsRUFBQSxVQUFBLEVBQUEsU0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBOztNQUNJLEtBQUEsR0FBNEIsUUFBQSxDQUFFLENBQUYsQ0FBQTtlQUFTLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixDQUFyQjtNQUFUO01BQzVCLENBQUEsR0FBNEIsT0FBQSxDQUFRLDhFQUFSO01BQzVCLENBQUEsQ0FBRSxPQUFGLEVBQ0UsaUJBREYsQ0FBQSxHQUM0QixLQUFLLENBQUMsZUFBTixDQUFBLENBRDVCO01BRUEsQ0FBQSxDQUFFLFVBQUYsQ0FBQSxHQUE0QixDQUFFLE9BQUEsQ0FBUSxRQUFSLENBQUYsQ0FBb0IsQ0FBQyxrQkFBckIsQ0FBQSxDQUE1QixFQUxKOzs7Ozs7OztNQWFJLE9BQUEsR0FBWTtNQUNaLFFBQUEsR0FBWSxRQUFBLENBQUUsQ0FBRixDQUFBO2VBQVMsQ0FBRSxDQUFFLE9BQU8sQ0FBVCxDQUFBLEtBQWdCLFFBQWxCLENBQUEsSUFBaUMsT0FBTyxDQUFDLElBQVIsQ0FBYSxDQUFiO01BQTFDLEVBZGhCOztNQWdCSSxTQUFBLEdBQ0U7UUFBQSxJQUFBLEVB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Q0FBTDtJQUNBLElBQUEsQ0FBSyxrRUFBTDtJQUNBLENBQUEsR0FBSSxDQUFFLEdBQUY7SUFDSixDQUFBLEdBQUksQ0FBRSxHQUFGLEVBQU8sQ0FBUDtJQUNKLElBQUEsQ0FBSyxHQUFBLENBQUssQ0FBTCxDQUFMO0lBQ0EsSUFBQSxDQUFLLElBQUEsQ0FBSyxDQUFMLENBQUw7SUFDQSxJQUFBLENBQUssa0VBQUw7SUFDQSxDQUFDLENBQUMsSUFBRixDQUFPLENBQVA7SUFDQSxJQUFBLENBQUssR0FBQSxDQUFLLENBQUwsQ0FBTDtJQUNBLElBQUEsQ0FBSyxJQUFBLENBQUssQ0FBTCxDQUFMO0lBQ0EsSUFBQSxDQUFLLGtFQUFMO0lBQ0EsQ0FBQSxHQUFJLENBQUE7SUFDSixDQUFBLEdBQUksQ0FBRSxDQUFGO0lBQ0osQ0FBQyxDQUFDLENBQUYsR0FBTTtJQUNOLENBQUEsR0FBSSxDQUFFLENBQUYsRUFBSyxDQUFMO0lBQ0osSUFBQSxDQUFLLEdBQUEsQ0FBSSxDQUFKLENBQUw7SUFDQSxJQUFBLENBQUssR0FBQSxDQUFJLENBQUosQ0FBTCxFQWpERjs7SUFtREUsSUFBQSxDQUFLLGtFQUFMO0lBQ0EsSUFBQSxDQUFBO0FBQ0EsV0FBTztFQXRERzs7RUF2Ylo7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG57IGRlYnVnLFxuICBsb2c6IGVjaG8sIH0gPSBjb25zb2xlXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkJSSUNTID1cblxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfc2hvdzogLT5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgd3JpdGUgICAgICAgICAgICAgICAgICAgICA9ICggcCApIC0+IHByb2Nlc3Muc3Rkb3V0LndyaXRlIHBcbiAgICBDICAgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vaGVuZ2lzdC1ORy9ub2RlX21vZHVsZXMvLnBucG0vYW5zaXNANC4xLjAvbm9kZV9tb2R1bGVzL2Fuc2lzL2luZGV4LmNqcydcbiAgICB7IHR5cGVfb2YsXG4gICAgICBpc19wcmltaXRpdmVfdHlwZSwgICAgfSA9IEJSSUNTLnJlcXVpcmVfdHlwZV9vZigpXG4gICAgeyBzdHJpcF9hbnNpLCAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi9tYWluJyApLnJlcXVpcmVfc3RyaXBfYW5zaSgpXG4gICAgIyB7IGhpZGUsXG4gICAgIyAgIHNldF9nZXR0ZXIsICAgfSA9ICggcmVxdWlyZSAnLi9tYWluJyApLnJlcXVpcmVfbWFuYWdlZF9wcm9wZXJ0eV90b29scygpXG4gICAgIyBTUUxJVEUgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6c3FsaXRlJ1xuICAgICMgeyBkZWJ1ZywgICAgICAgIH0gPSBjb25zb2xlXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICMjIyB0aHggdG8gaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9pZGVudGlmaWVyLXJlZ2V4ICMjI1xuICAgIGpzaWRfcmUgICA9IC8vL14gWyAkIF8gXFxwe0lEX1N0YXJ0fSBdIFsgJCBfIFxcdTIwMEMgXFx1MjAwRCBcXHB7SURfQ29udGludWV9IF0qICQvLy92XG4gICAgaXNhX2pzaWQgID0gKCB4ICkgLT4gKCAoIHR5cGVvZiB4ICkgaXMgJ3N0cmluZycgKSBhbmQganNpZF9yZS50ZXN0IHhcbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHRlbXBsYXRlcyA9XG4gICAgICBzaG93OlxuICAgICAgICBpbmRlbnRhdGlvbjogIG51bGxcbiAgICAgICAgY29sb3JzOiAgICAgICB0cnVlXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGludGVybmFscyA9IHsganNpZF9yZSwgaXNhX2pzaWQsIHRlbXBsYXRlcywgfVxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBTaG93XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICggY2ZnICkgLT5cbiAgICAgICAgbWUgPSAoIHggKSA9PlxuICAgICAgICAgIFIgPSAoIHRleHQgZm9yIHRleHQgZnJvbSBAcGVuIHggKS5qb2luICcnXG4gICAgICAgICAgIyMjIFRBSU5UIGF2b2lkIHRvIGFkZCBjb2xvcnMgaW5zdGVhZCAjIyNcbiAgICAgICAgICBSID0gc3RyaXBfYW5zaSBSIGlmIEBjZmcuY29sb3JzIGlzIGZhbHNlXG4gICAgICAgICAgcmV0dXJuIFJcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mIG1lLCBAXG4gICAgICAgIEBjZmcgICAgPSB7IHRlbXBsYXRlcy5zaG93Li4uLCBjZmcuLi4sIH1cbiAgICAgICAgQHN0YXRlICA9IHsgbGV2ZWw6IDAsIGVuZGVkX3dpdGhfbmw6IGZhbHNlLCBzZWVuOiAoIG5ldyBTZXQoKSApLCB9XG4gICAgICAgIEBzcGFjZXIgPSAnXFx4MjBcXHgyMCdcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5IEAsICdkZW50JyxcbiAgICAgICAgICBnZXQ6ID0+IEBzcGFjZXIucmVwZWF0IEBzdGF0ZS5sZXZlbFxuICAgICAgICByZXR1cm4gbWVcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBwZW46ICggeCApIC0+XG4gICAgICAgIEBzdGF0ZS5zZWVuLmNsZWFyKClcbiAgICAgICAgZm9yIHRleHQgZnJvbSBAZGlzcGF0Y2ggeFxuICAgICAgICAgIEBzdGF0ZS5lbmRlZF93aXRoX25sID0gdGV4dC5lbmRzV2l0aCAnXFxuJ1xuICAgICAgICAgIHlpZWxkIHRleHRcbiAgICAgICAgdW5sZXNzIEBzdGF0ZS5lbmRlZF93aXRoX25sXG4gICAgICAgICAgQHN0YXRlLmVuZGVkX3dpdGhfbmwgPSB0cnVlXG4gICAgICAgICAgIyB5aWVsZCAnXFxuJ1xuICAgICAgICBAc3RhdGUuc2Vlbi5jbGVhcigpXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZ29fZG93bjogLT5cbiAgICAgICAgQHN0YXRlLmxldmVsKytcbiAgICAgICAgcmV0dXJuIEBzdGF0ZS5sZXZlbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGdvX3VwOiAtPlxuICAgICAgICBpZiBAc3RhdGUubGV2ZWwgPCAxXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX18xIHVuYWJsZSB0byBnbyBiZWxvdyBsZXZlbCAwXCJcbiAgICAgICAgQHN0YXRlLmxldmVsLS1cbiAgICAgICAgcmV0dXJuIEBzdGF0ZS5sZXZlbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGRpc3BhdGNoOiAoIHggKSAtPlxuICAgICAgICB0eXBlICA9IHR5cGVfb2YgeFxuICAgICAgICBvbWl0ICA9IGZhbHNlXG4gICAgICAgIGlmICggaXNfcHJpbWl0aXZlX3R5cGUgdHlwZSApXG4gICAgICAgICAgaWYgQHN0YXRlLnNlZW4uaGFzIHhcbiAgICAgICAgICAgICMgZGVidWcgJ15eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl4nLCBcInNlZW5cIiwgdHlwZVxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICAgIyBvbWl0ID0gdHJ1ZVxuICAgICAgICAgICAgIyB5aWVsZCAnKENJUkNVTEFSKSdcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAc3RhdGUuc2Vlbi5hZGQgeFxuICAgICAgICB1bmxlc3Mgb21pdFxuICAgICAgICAgIGlmICggbWV0aG9kID0gQFsgXCJzaG93XyN7dHlwZX1cIiBdICk/XG4gICAgICAgICAgICB5aWVsZCBmcm9tIG1ldGhvZC5jYWxsIEAsIHhcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB5aWVsZCBmcm9tIEBzaG93X290aGVyIHhcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfc2hvd19rZXk6ICgga2V5ICkgLT5cbiAgICAgICAgaWYgaXNhX2pzaWQga2V5IHRoZW4gcmV0dXJuIGNvbG9ycy5fa2V5IGtleVxuICAgICAgICByZXR1cm4gWyAoIHQgZm9yIHQgZnJvbSBAZGlzcGF0Y2gga2V5ICkuLi4sIF0uam9pbiAnJ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNob3dfcG9kOiAoIHggKSAtPlxuICAgICAgICBoYXNfa2V5cyA9IGZhbHNlXG4gICAgICAgIHlpZWxkIGNvbG9ycy5wb2QgJ3snXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZm9yIGtleSwgdmFsdWUgb2YgeFxuICAgICAgICAgICMjIyBUQUlOVCBjb2RlIGR1cGxpY2F0aW9uICMjI1xuICAgICAgICAgIGhhc19rZXlzID0gdHJ1ZVxuICAgICAgICAgIHlpZWxkICcgJyArICggQF9zaG93X2tleSBrZXkgKSArIGNvbG9ycy5wb2QgJzogJ1xuICAgICAgICAgIGZvciB0ZXh0IGZyb20gQGRpc3BhdGNoIHZhbHVlXG4gICAgICAgICAgICB5aWVsZCB0ZXh0XG4gICAgICAgICAgeWllbGQgY29sb3JzLnBvZCAnLCdcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB5aWVsZCBjb2xvcnMucG9kIGlmICggbm90IGhhc19rZXlzICkgdGhlbiAnfScgZWxzZSAnIH0nXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2hvd19tYXA6ICggeCApIC0+XG4gICAgICAgIGhhc19rZXlzID0gZmFsc2VcbiAgICAgICAgeWllbGQgY29sb3JzLm1hcCAnbWFweydcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmb3IgWyBrZXksIHZhbHVlLCBdIGZyb20geC5lbnRyaWVzKClcbiAgICAgICAgICAjIyMgVEFJTlQgY29kZSBkdXBsaWNhdGlvbiAjIyNcbiAgICAgICAgICBoYXNfa2V5cyA9IHRydWVcbiAgICAgICAgICB5aWVsZCAnICcgKyAoIEBfc2hvd19rZXkga2V5ICkgKyBjb2xvcnMubWFwICc6ICdcbiAgICAgICAgICBmb3IgdGV4dCBmcm9tIEBkaXNwYXRjaCB2YWx1ZVxuICAgICAgICAgICAgeWllbGQgdGV4dFxuICAgICAgICAgIHlpZWxkIGNvbG9ycy5tYXAgJywnXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgeWllbGQgY29sb3JzLm1hcCBpZiAoIG5vdCBoYXNfa2V5cyApIHRoZW4gJ30nIGVsc2UgJyB9J1xuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNob3dfbGlzdDogKCB4ICkgLT5cbiAgICAgICAgUiA9ICcnXG4gICAgICAgIFIgKz0gY29sb3JzLmxpc3QgJ1snXG4gICAgICAgIGZvciBlbGVtZW50IGluIHhcbiAgICAgICAgICAjIyMgVEFJTlQgY29kZSBkdXBsaWNhdGlvbiAjIyNcbiAgICAgICAgICBmb3IgdGV4dCBmcm9tIEBkaXNwYXRjaCBlbGVtZW50XG4gICAgICAgICAgICBSICs9ICcgJyArIHRleHQgKyAoIGNvbG9ycy5saXN0ICcsJyApXG4gICAgICAgIFIgKz0gY29sb3JzLmxpc3QgaWYgKCB4Lmxlbmd0aCBpcyAwICkgdGhlbiAnXScgZWxzZSAnIF0nXG4gICAgICAgIHlpZWxkIFJcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzaG93X3NldDogKCB4ICkgLT5cbiAgICAgICAgeWllbGQgY29sb3JzLnNldCAnc2V0WydcbiAgICAgICAgZm9yIGVsZW1lbnQgZnJvbSB4LmtleXMoKVxuICAgICAgICAgICMjIyBUQUlOVCBjb2RlIGR1cGxpY2F0aW9uICMjI1xuICAgICAgICAgIGZvciB0ZXh0IGZyb20gQGRpc3BhdGNoIGVsZW1lbnRcbiAgICAgICAgICAgIHlpZWxkICcgJyArIHRleHQgKyBjb2xvcnMuc2V0ICcsJ1xuICAgICAgICB5aWVsZCBjb2xvcnMuc2V0IGlmICggeC5sZW5ndGggaXMgMCApIHRoZW4gJ10nIGVsc2UgJyBdJ1xuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNob3dfdGV4dDogKCB4ICkgLT5cbiAgICAgICAgaWYgXCInXCIgaW4geCB0aGVuICB5aWVsZCBjb2xvcnMudGV4dCAnXCInICsgKCB4LnJlcGxhY2UgL1wiL2csICdcXFxcXCInICkgKyAnXCInXG4gICAgICAgIGVsc2UgICAgICAgICAgICAgIHlpZWxkIGNvbG9ycy50ZXh0IFwiJ1wiICsgKCB4LnJlcGxhY2UgLycvZywgXCJcXFxcJ1wiICkgKyBcIidcIlxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNob3dfZmxvYXQ6ICggeCApIC0+XG4gICAgICAgIHlpZWxkICggY29sb3JzLmZsb2F0IHgudG9TdHJpbmcoKSApXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2hvd19yZWdleDogKCB4ICkgLT5cbiAgICAgICAgeWllbGQgKCBjb2xvcnMucmVnZXggeC50b1N0cmluZygpIClcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAjIyMgZnVsbCB3b3JkczogIyMjXG4gICAgICAjIHNob3dfdHJ1ZTogICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy50cnVlICAgICAgJ3RydWUnICAgICAgKVxuICAgICAgIyBzaG93X2ZhbHNlOiAgICAgKCB4ICkgLT4geWllbGQgKCBjb2xvcnMuZmFsc2UgICAgICdmYWxzZScgICAgIClcbiAgICAgICMgc2hvd191bmRlZmluZWQ6ICggeCApIC0+IHlpZWxkICggY29sb3JzLnVuZGVmaW5lZCAndW5kZWZpbmVkJyApXG4gICAgICAjIHNob3dfbnVsbDogICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy5udWxsICAgICAgJ251bGwnICAgICAgKVxuICAgICAgIyBzaG93X25hbjogICAgICAgKCB4ICkgLT4geWllbGQgKCBjb2xvcnMubmFuICAgICAgICdOYU4nICAgICAgIClcbiAgICAgICMjIyAobW9zdGx5KSBzaW5nbGUgbGV0dGVyczogIyMjXG4gICAgICBzaG93X3RydWU6ICAgICAgKCB4ICkgLT4geWllbGQgKCBjb2xvcnMudHJ1ZSAgICAgICcgVCAnICAgICApXG4gICAgICBzaG93X2ZhbHNlOiAgICAgKCB4ICkgLT4geWllbGQgKCBjb2xvcnMuZmFsc2UgICAgICcgRiAnICAgICApXG4gICAgICBzaG93X3VuZGVmaW5lZDogKCB4ICkgLT4geWllbGQgKCBjb2xvcnMudW5kZWZpbmVkICcgVSAnICAgICApXG4gICAgICBzaG93X251bGw6ICAgICAgKCB4ICkgLT4geWllbGQgKCBjb2xvcnMubnVsbCAgICAgICcgTiAnICAgICApXG4gICAgICBzaG93X25hbjogICAgICAgKCB4ICkgLT4geWllbGQgKCBjb2xvcnMubmFuICAgICAgICcgTmFOICcgICApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2hvd19vdGhlcjogKCB4ICkgLT5cbiAgICAgICAgIyB5aWVsZCAnXFxuJyB1bmxlc3MgQHN0YXRlLmVuZGVkX3dpdGhfbmxcbiAgICAgICAgeWllbGQgY29sb3JzLm90aGVyIFwiI3t4fVwiXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIENPTE9SID0gbmV3IEMuQW5zaXMoKS5leHRlbmRcbiAgICAgIGFsaWNlYmx1ZTogICAgICAgICAgICAgICAgICAnI2YwZjhmZidcbiAgICAgIGFudGlxdWV3aGl0ZTogICAgICAgICAgICAgICAnI2ZhZWJkNydcbiAgICAgIGFxdWE6ICAgICAgICAgICAgICAgICAgICAgICAnIzAwZmZmZidcbiAgICAgIGFxdWFtYXJpbmU6ICAgICAgICAgICAgICAgICAnIzdmZmZkNCdcbiAgICAgIGF6dXJlOiAgICAgICAgICAgICAgICAgICAgICAnI2YwZmZmZidcbiAgICAgIGJlaWdlOiAgICAgICAgICAgICAgICAgICAgICAnI2Y1ZjVkYydcbiAgICAgIGJpc3F1ZTogICAgICAgICAgICAgICAgICAgICAnI2ZmZTRjNCdcbiAgICAgIGJsYWNrOiAgICAgICAgICAgICAgICAgICAgICAnIzAwMDAwMCdcbiAgICAgIGJsYW5jaGVkYWxtb25kOiAgICAgICAgICAgICAnI2ZmZWJjZCdcbiAgICAgIGJsdWU6ICAgICAgICAgICAgICAgICAgICAgICAnIzAwMDBmZidcbiAgICAgIGJsdWV2aW9sZXQ6ICAgICAgICAgICAgICAgICAnIzhhMmJlMidcbiAgICAgIGJyb3duOiAgICAgICAgICAgICAgICAgICAgICAnI2E1MmEyYSdcbiAgICAgIGJ1cmx5d29vZDogICAgICAgICAgICAgICAgICAnI2RlYjg4NydcbiAgICAgIGNhZGV0Ymx1ZTogICAgICAgICAgICAgICAgICAnIzVmOWVhMCdcbiAgICAgIGNoYXJ0cmV1c2U6ICAgICAgICAgICAgICAgICAnIzdmZmYwMCdcbiAgICAgIGNob2NvbGF0ZTogICAgICAgICAgICAgICAgICAnI2QyNjkxZSdcbiAgICAgIGNvcmFsOiAgICAgICAgICAgICAgICAgICAgICAnI2ZmN2Y1MCdcbiAgICAgIGNvcm5mbG93ZXJibHVlOiAgICAgICAgICAgICAnIzY0OTVlZCdcbiAgICAgIGNvcm5zaWxrOiAgICAgICAgICAgICAgICAgICAnI2ZmZjhkYydcbiAgICAgIGNyaW1zb246ICAgICAgICAgICAgICAgICAgICAnI2RjMTQzYydcbiAgICAgIGN5YW46ICAgICAgICAgICAgICAgICAgICAgICAnIzAwZmZmZidcbiAgICAgIGRhcmtibHVlOiAgICAgICAgICAgICAgICAgICAnIzAwMDA4YidcbiAgICAgIGRhcmtjeWFuOiAgICAgICAgICAgICAgICAgICAnIzAwOGI4YidcbiAgICAgIGRhcmtnb2xkZW5yb2Q6ICAgICAgICAgICAgICAnI2I4ODYwYidcbiAgICAgIGRhcmtncmF5OiAgICAgICAgICAgICAgICAgICAnI2E5YTlhOSdcbiAgICAgIGRhcmtncmVlbjogICAgICAgICAgICAgICAgICAnIzAwNjQwMCdcbiAgICAgIGRhcmtraGFraTogICAgICAgICAgICAgICAgICAnI2JkYjc2YidcbiAgICAgIGRhcmttYWdlbnRhOiAgICAgICAgICAgICAgICAnIzhiMDA4YidcbiAgICAgIGRhcmtvbGl2ZWdyZWVuOiAgICAgICAgICAgICAnIzU1NmIyZidcbiAgICAgIGRhcmtvcmFuZ2U6ICAgICAgICAgICAgICAgICAnI2ZmOGMwMCdcbiAgICAgIGRhcmtvcmNoaWQ6ICAgICAgICAgICAgICAgICAnIzk5MzJjYydcbiAgICAgIGRhcmtyZWQ6ICAgICAgICAgICAgICAgICAgICAnIzhiMDAwMCdcbiAgICAgIGRhcmtzYWxtb246ICAgICAgICAgICAgICAgICAnI2U5OTY3YSdcbiAgICAgIGRhcmtzZWFncmVlbjogICAgICAgICAgICAgICAnIzhmYmM4ZidcbiAgICAgIGRhcmtzbGF0ZWJsdWU6ICAgICAgICAgICAgICAnIzQ4M2Q4YidcbiAgICAgIGRhcmtzbGF0ZWdyYXk6ICAgICAgICAgICAgICAnIzJmNGY0ZidcbiAgICAgIGRhcmt0dXJxdW9pc2U6ICAgICAgICAgICAgICAnIzAwY2VkMSdcbiAgICAgIGRhcmt2aW9sZXQ6ICAgICAgICAgICAgICAgICAnIzk0MDBkMydcbiAgICAgIGRlZXBwaW5rOiAgICAgICAgICAgICAgICAgICAnI2ZmMTQ5MydcbiAgICAgIGRlZXBza3libHVlOiAgICAgICAgICAgICAgICAnIzAwYmZmZidcbiAgICAgIGRpbWdyYXk6ICAgICAgICAgICAgICAgICAgICAnIzY5Njk2OSdcbiAgICAgIGRvZGdlcmJsdWU6ICAgICAgICAgICAgICAgICAnIzFlOTBmZidcbiAgICAgIGZpcmVicmljazogICAgICAgICAgICAgICAgICAnI2IyMjIyMidcbiAgICAgIGZsb3JhbHdoaXRlOiAgICAgICAgICAgICAgICAnI2ZmZmFmMCdcbiAgICAgIGZvcmVzdGdyZWVuOiAgICAgICAgICAgICAgICAnIzIyOGIyMidcbiAgICAgIGdhaW5zYm9ybzogICAgICAgICAgICAgICAgICAnI2RjZGNkYydcbiAgICAgIGdob3N0d2hpdGU6ICAgICAgICAgICAgICAgICAnI2Y4ZjhmZidcbiAgICAgIGdvbGQ6ICAgICAgICAgICAgICAgICAgICAgICAnI2ZmZDcwMCdcbiAgICAgIGdvbGRlbnJvZDogICAgICAgICAgICAgICAgICAnI2RhYTUyMCdcbiAgICAgIGdyYXk6ICAgICAgICAgICAgICAgICAgICAgICAnIzgwODA4MCdcbiAgICAgIGdyZWVuOiAgICAgICAgICAgICAgICAgICAgICAnIzAwODAwMCdcbiAgICAgIGdyZWVueWVsbG93OiAgICAgICAgICAgICAgICAnI2FkZmYyZidcbiAgICAgIGhvbmV5ZGV3OiAgICAgICAgICAgICAgICAgICAnI2YwZmZmMCdcbiAgICAgIGhvdHBpbms6ICAgICAgICAgICAgICAgICAgICAnI2ZmNjliNCdcbiAgICAgIGluZGlhbnJlZDogICAgICAgICAgICAgICAgICAnI2NkNWM1YydcbiAgICAgIGluZGlnbzogICAgICAgICAgICAgICAgICAgICAnIzRiMDA4MidcbiAgICAgIGl2b3J5OiAgICAgICAgICAgICAgICAgICAgICAnI2ZmZmZmMCdcbiAgICAgIGtoYWtpOiAgICAgICAgICAgICAgICAgICAgICAnI2YwZTY4YydcbiAgICAgIGxhdmVuZGVyOiAgICAgICAgICAgICAgICAgICAnI2U2ZTZmYSdcbiAgICAgIGxhdmVuZGVyYmx1c2g6ICAgICAgICAgICAgICAnI2ZmZjBmNSdcbiAgICAgIGxhd25ncmVlbjogICAgICAgICAgICAgICAgICAnIzdjZmMwMCdcbiAgICAgIGxlbW9uY2hpZmZvbjogICAgICAgICAgICAgICAnI2ZmZmFjZCdcbiAgICAgIGxpZ2h0Ymx1ZTogICAgICAgICAgICAgICAgICAnI2FkZDhlNidcbiAgICAgIGxpZ2h0Y29yYWw6ICAgICAgICAgICAgICAgICAnI2YwODA4MCdcbiAgICAgIGxpZ2h0Y3lhbjogICAgICAgICAgICAgICAgICAnI2UwZmZmZidcbiAgICAgIGxpZ2h0Z29sZGVucm9keWVsbG93OiAgICAgICAnI2ZhZmFkMidcbiAgICAgIGxpZ2h0Z3JheTogICAgICAgICAgICAgICAgICAnI2QzZDNkMydcbiAgICAgIGxpZ2h0Z3JlZW46ICAgICAgICAgICAgICAgICAnIzkwZWU5MCdcbiAgICAgIGxpZ2h0cGluazogICAgICAgICAgICAgICAgICAnI2ZmYjZjMSdcbiAgICAgIGxpZ2h0c2FsbW9uOiAgICAgICAgICAgICAgICAnI2ZmYTA3YSdcbiAgICAgIGxpZ2h0c2VhZ3JlZW46ICAgICAgICAgICAgICAnIzIwYjJhYSdcbiAgICAgIGxpZ2h0c2t5Ymx1ZTogICAgICAgICAgICAgICAnIzg3Y2VmYSdcbiAgICAgIGxpZ2h0c2xhdGVncmF5OiAgICAgICAgICAgICAnIzc3ODg5OSdcbiAgICAgIGxpZ2h0c3RlZWxibHVlOiAgICAgICAgICAgICAnI2IwYzRkZSdcbiAgICAgIGxpZ2h0eWVsbG93OiAgICAgICAgICAgICAgICAnI2ZmZmZlMCdcbiAgICAgIGxpbWU6ICAgICAgICAgICAgICAgICAgICAgICAnIzAwZmYwMCdcbiAgICAgIGxpbWVncmVlbjogICAgICAgICAgICAgICAgICAnIzMyY2QzMidcbiAgICAgIGxpbmVuOiAgICAgICAgICAgICAgICAgICAgICAnI2ZhZjBlNidcbiAgICAgIG1hZ2VudGE6ICAgICAgICAgICAgICAgICAgICAnI2ZmMDBmZidcbiAgICAgIG1hcm9vbjogICAgICAgICAgICAgICAgICAgICAnIzgwMDAwMCdcbiAgICAgIG1lZGl1bWFxdWFtYXJpbmU6ICAgICAgICAgICAnIzY2Y2RhYSdcbiAgICAgIG1lZGl1bWJsdWU6ICAgICAgICAgICAgICAgICAnIzAwMDBjZCdcbiAgICAgIG1lZGl1bW9yY2hpZDogICAgICAgICAgICAgICAnI2JhNTVkMydcbiAgICAgIG1lZGl1bXB1cnBsZTogICAgICAgICAgICAgICAnIzkzNzBkYidcbiAgICAgIG1lZGl1bXNlYWdyZWVuOiAgICAgICAgICAgICAnIzNjYjM3MSdcbiAgICAgIG1lZGl1bXNsYXRlYmx1ZTogICAgICAgICAgICAnIzdiNjhlZSdcbiAgICAgIG1lZGl1bXNwcmluZ2dyZWVuOiAgICAgICAgICAnIzAwZmE5YSdcbiAgICAgIG1lZGl1bXR1cnF1b2lzZTogICAgICAgICAgICAnIzQ4ZDFjYydcbiAgICAgIG1lZGl1bXZpb2xldHJlZDogICAgICAgICAgICAnI2M3MTU4NSdcbiAgICAgIG1pZG5pZ2h0Ymx1ZTogICAgICAgICAgICAgICAnIzE5MTk3MCdcbiAgICAgIG1pbnRjcmVhbTogICAgICAgICAgICAgICAgICAnI2Y1ZmZmYSdcbiAgICAgIG1pc3R5cm9zZTogICAgICAgICAgICAgICAgICAnI2ZmZTRlMSdcbiAgICAgIG1vY2Nhc2luOiAgICAgICAgICAgICAgICAgICAnI2ZmZTRiNSdcbiAgICAgIG5hdmFqb3doaXRlOiAgICAgICAgICAgICAgICAnI2ZmZGVhZCdcbiAgICAgIG5hdnk6ICAgICAgICAgICAgICAgICAgICAgICAnIzAwMDA4MCdcbiAgICAgIG9sZGxhY2U6ICAgICAgICAgICAgICAgICAgICAnI2ZkZjVlNidcbiAgICAgIG9saXZlOiAgICAgICAgICAgICAgICAgICAgICAnIzgwODAwMCdcbiAgICAgIG9saXZlZHJhYjogICAgICAgICAgICAgICAgICAnIzZiOGUyMydcbiAgICAgIG9yYW5nZTogICAgICAgICAgICAgICAgICAgICAnI2ZmYTUwMCdcbiAgICAgIG9yYW5nZXJlZDogICAgICAgICAgICAgICAgICAnI2ZmNDUwMCdcbiAgICAgIG9yY2hpZDogICAgICAgICAgICAgICAgICAgICAnI2RhNzBkNidcbiAgICAgIHBhbGVnb2xkZW5yb2Q6ICAgICAgICAgICAgICAnI2VlZThhYSdcbiAgICAgIHBhbGVncmVlbjogICAgICAgICAgICAgICAgICAnIzk4ZmI5OCdcbiAgICAgIHBhbGV0dXJxdW9pc2U6ICAgICAgICAgICAgICAnI2FmZWVlZSdcbiAgICAgIHBhbGV2aW9sZXRyZWQ6ICAgICAgICAgICAgICAnI2RiNzA5MydcbiAgICAgIHBhcGF5YXdoaXA6ICAgICAgICAgICAgICAgICAnI2ZmZWZkNSdcbiAgICAgIHBlYWNocHVmZjogICAgICAgICAgICAgICAgICAnI2ZmZGFiOSdcbiAgICAgIHBlcnU6ICAgICAgICAgICAgICAgICAgICAgICAnI2NkODUzZidcbiAgICAgIHBpbms6ICAgICAgICAgICAgICAgICAgICAgICAnI2ZmYzBjYidcbiAgICAgIHBsdW06ICAgICAgICAgICAgICAgICAgICAgICAnI2RkYTBkZCdcbiAgICAgIHBvd2RlcmJsdWU6ICAgICAgICAgICAgICAgICAnI2IwZTBlNidcbiAgICAgIHB1cnBsZTogICAgICAgICAgICAgICAgICAgICAnIzgwMDA4MCdcbiAgICAgIHJlZDogICAgICAgICAgICAgICAgICAgICAgICAnI2ZmMDAwMCdcbiAgICAgIHJvc3licm93bjogICAgICAgICAgICAgICAgICAnI2JjOGY4ZidcbiAgICAgIHJveWFsYmx1ZTogICAgICAgICAgICAgICAgICAnIzQxNjllMSdcbiAgICAgIHNhZGRsZWJyb3duOiAgICAgICAgICAgICAgICAnIzhiNDUxMydcbiAgICAgIHNhbG1vbjogICAgICAgICAgICAgICAgICAgICAnI2ZhODA3MidcbiAgICAgIHNhbmR5YnJvd246ICAgICAgICAgICAgICAgICAnI2Y0YTQ2MCdcbiAgICAgIHNlYWdyZWVuOiAgICAgICAgICAgICAgICAgICAnIzJlOGI1NydcbiAgICAgIHNlYXNoZWxsOiAgICAgICAgICAgICAgICAgICAnI2ZmZjVlZSdcbiAgICAgIHNpZW5uYTogICAgICAgICAgICAgICAgICAgICAnI2EwNTIyZCdcbiAgICAgIHNpbHZlcjogICAgICAgICAgICAgICAgICAgICAnI2MwYzBjMCdcbiAgICAgIHNreWJsdWU6ICAgICAgICAgICAgICAgICAgICAnIzg3Y2VlYidcbiAgICAgIHNsYXRlYmx1ZTogICAgICAgICAgICAgICAgICAnIzZhNWFjZCdcbiAgICAgIHNsYXRlZ3JheTogICAgICAgICAgICAgICAgICAnIzcwODA5MCdcbiAgICAgIHNub3c6ICAgICAgICAgICAgICAgICAgICAgICAnI2ZmZmFmYSdcbiAgICAgIHNwcmluZ2dyZWVuOiAgICAgICAgICAgICAgICAnIzAwZmY3ZidcbiAgICAgIHN0ZWVsYmx1ZTogICAgICAgICAgICAgICAgICAnIzQ2ODJiNCdcbiAgICAgIHRhbjogICAgICAgICAgICAgICAgICAgICAgICAnI2QyYjQ4YydcbiAgICAgIHRlYWw6ICAgICAgICAgICAgICAgICAgICAgICAnIzAwODA4MCdcbiAgICAgIHRoaXN0bGU6ICAgICAgICAgICAgICAgICAgICAnI2Q4YmZkOCdcbiAgICAgIHRvbWF0bzogICAgICAgICAgICAgICAgICAgICAnI2ZmNjM0NydcbiAgICAgIHR1cnF1b2lzZTogICAgICAgICAgICAgICAgICAnIzQwZTBkMCdcbiAgICAgIHZpb2xldDogICAgICAgICAgICAgICAgICAgICAnI2VlODJlZSdcbiAgICAgIHdoZWF0OiAgICAgICAgICAgICAgICAgICAgICAnI2Y1ZGViMydcbiAgICAgIHdoaXRlOiAgICAgICAgICAgICAgICAgICAgICAnI2ZmZmZmZidcbiAgICAgIHdoaXRlc21va2U6ICAgICAgICAgICAgICAgICAnI2Y1ZjVmNSdcbiAgICAgIHllbGxvdzogICAgICAgICAgICAgICAgICAgICAnI2ZmZmYwMCdcbiAgICAgIHllbGxvd2dyZWVuOiAgICAgICAgICAgICAgICAnIzlhY2QzMidcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgRkFOQ1lSRUQ6ICAgICAgICAgICAgICAgICAgICcjZmQ1MjMwJ1xuICAgICAgRkFOQ1lPUkFOR0U6ICAgICAgICAgICAgICAgICcjZmQ2ZDMwJ1xuICAgICAgIyBvb21waDogKCB4ICkgLT4gZGVidWcgJ86pX19fMicsIHg7IHJldHVybiBcIn5+fiAje3h9IH5+flwiXG5cbiAgICBjb2xvcnMgPVxuICAgICAgX2tleTogICAgICAgKCB4ICkgLT4gQ09MT1IuY3lhbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgcG9kOiAgICAgICAgKCB4ICkgLT4gQ09MT1IuZ29sZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgbWFwOiAgICAgICAgKCB4ICkgLT4gQ09MT1IuZ29sZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgbGlzdDogICAgICAgKCB4ICkgLT4gQ09MT1IuZ29sZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgc2V0OiAgICAgICAgKCB4ICkgLT4gQ09MT1IuZ29sZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgdGV4dDogICAgICAgKCB4ICkgLT4gQ09MT1Iud2hlYXQgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgZmxvYXQ6ICAgICAgKCB4ICkgLT4gQ09MT1IuRkFOQ1lSRUQgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgcmVnZXg6ICAgICAgKCB4ICkgLT4gQ09MT1IucGx1bSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgdHJ1ZTogICAgICAgKCB4ICkgLT4gQ09MT1IuaW52ZXJzZS5ib2xkLml0YWxpYy5saW1lICAgICAgICAgeFxuICAgICAgZmFsc2U6ICAgICAgKCB4ICkgLT4gQ09MT1IuaW52ZXJzZS5ib2xkLml0YWxpYy5GQU5DWU9SQU5HRSAgeFxuICAgICAgdW5kZWZpbmVkOiAgKCB4ICkgLT4gQ09MT1IuaW52ZXJzZS5ib2xkLml0YWxpYy5tYWdlbnRhICAgICAgeFxuICAgICAgbnVsbDogICAgICAgKCB4ICkgLT4gQ09MT1IuaW52ZXJzZS5ib2xkLml0YWxpYy5ibHVlICAgICAgICAgeFxuICAgICAgbmFuOiAgICAgICAgKCB4ICkgLT4gQ09MT1IuaW52ZXJzZS5ib2xkLml0YWxpYy5tYWdlbnRhICAgICAgeFxuICAgICAgb3RoZXI6ICAgICAgKCB4ICkgLT4gQ09MT1IuaW52ZXJzZS5yZWQgICAgICAgICAgICAgICAgICAgICAgeFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBzaG93ICAgICAgICAgICAgPSBuZXcgU2hvdygpXG4gICAgc2hvd19ub19jb2xvcnMgID0gbmV3IFNob3cgeyBjb2xvcnM6IGZhbHNlLCB9XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGludGVybmFscyA9IE9iamVjdC5mcmVlemUgeyBpbnRlcm5hbHMuLi4sIH1cbiAgICByZXR1cm4gZXhwb3J0cyA9IHtcbiAgICAgIFNob3csXG4gICAgICBzaG93LFxuICAgICAgc2hvd19ub19jb2xvcnMsXG4gICAgICBpbnRlcm5hbHMsIH1cblxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV90eXBlX29mOiAtPlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBvYmplY3RfcHJvdG90eXBlICA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB7fVxuICAgIHBvZF9wcm90b3R5cGVzICAgID0gT2JqZWN0LmZyZWV6ZSBbIG51bGwsIG9iamVjdF9wcm90b3R5cGUsIF1cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHByaW1pdGl2ZV90eXBlcyAgICAgPSBPYmplY3QuZnJlZXplIFtcbiAgICAgICdudWxsJywgJ3VuZGVmaW5lZCcsXG4gICAgICAnYm9vbGVhbicsXG4gICAgICAnaW5maW5pdHknLCAnbmFuJywgJ2Zsb2F0JyxcbiAgICAgICd0ZXh0JywgJ3N5bWJvbCcsICdyZWdleCcsXG4gICAgICBdXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGludGVybmFscyAgICAgICAgID0geyBvYmplY3RfcHJvdG90eXBlLCBwb2RfcHJvdG90eXBlcywgcHJpbWl0aXZlX3R5cGVzLCB9XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB0eXBlX29mID0gKCB4ICkgLT5cbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICMjIyBQcmltaXRpdmVzOiAjIyNcbiAgICAgIHJldHVybiAnbnVsbCcgICAgICAgICBpZiB4IGlzIG51bGxcbiAgICAgIHJldHVybiAndW5kZWZpbmVkJyAgICBpZiB4IGlzIHVuZGVmaW5lZFxuICAgICAgcmV0dXJuICdpbmZpbml0eScgICAgIGlmICggeCBpcyArSW5maW5pdHkgKSBvciAoIHggaXMgLUluZmluaXR5IClcbiAgICAgIHJldHVybiAnYm9vbGVhbicgICAgICBpZiAoIHggaXMgdHJ1ZSApIG9yICggeCBpcyBmYWxzZSApXG4gICAgICAjIHJldHVybiAndHJ1ZScgICAgICAgICBpZiAoIHggaXMgdHJ1ZSApXG4gICAgICAjIHJldHVybiAnZmFsc2UnICAgICAgICBpZiAoIHggaXMgZmFsc2UgKVxuICAgICAgcmV0dXJuICduYW4nICAgICAgICAgIGlmIE51bWJlci5pc05hTiAgICAgeFxuICAgICAgcmV0dXJuICdmbG9hdCcgICAgICAgIGlmIE51bWJlci5pc0Zpbml0ZSAgeFxuICAgICAgIyByZXR1cm4gJ3Vuc2V0JyAgICAgICAgaWYgeCBpcyB1bnNldFxuICAgICAgcmV0dXJuICdwb2QnICAgICAgICAgIGlmICggT2JqZWN0LmdldFByb3RvdHlwZU9mIHggKSBpbiBwb2RfcHJvdG90eXBlc1xuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgc3dpdGNoIGpzdHlwZW9mID0gdHlwZW9mIHhcbiAgICAgICAgd2hlbiAnc3RyaW5nJyAgICAgICAgICAgICAgICAgICAgICAgdGhlbiByZXR1cm4gJ3RleHQnXG4gICAgICAgIHdoZW4gJ3N5bWJvbCcgICAgICAgICAgICAgICAgICAgICAgIHRoZW4gcmV0dXJuICdzeW1ib2wnXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICByZXR1cm4gJ2xpc3QnICAgICAgICAgaWYgQXJyYXkuaXNBcnJheSAgeFxuICAgICAgIyMjIFRBSU5UIGNvbnNpZGVyIHRvIHJldHVybiB4LmNvbnN0cnVjdG9yLm5hbWUgIyMjXG4gICAgICBzd2l0Y2ggbWlsbGVydHlwZSA9ICggKCBPYmplY3Q6OnRvU3RyaW5nLmNhbGwgeCApLnJlcGxhY2UgL15cXFtvYmplY3QgKFteXFxdXSspXFxdJC8sICckMScgKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIHdoZW4gJ3JlZ2V4cCcgICAgICAgICAgICAgICAgICAgICAgIHRoZW4gcmV0dXJuICdyZWdleCdcbiAgICAgIHJldHVybiBtaWxsZXJ0eXBlXG4gICAgICAjIHN3aXRjaCBtaWxsZXJ0eXBlID0gT2JqZWN0Ojp0b1N0cmluZy5jYWxsIHhcbiAgICAgICMgICB3aGVuICdbb2JqZWN0IEZ1bmN0aW9uXScgICAgICAgICAgICB0aGVuIHJldHVybiAnZnVuY3Rpb24nXG4gICAgICAjICAgd2hlbiAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScgICAgICAgdGhlbiByZXR1cm4gJ2FzeW5jZnVuY3Rpb24nXG4gICAgICAjICAgd2hlbiAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nICAgdGhlbiByZXR1cm4gJ2dlbmVyYXRvcmZ1bmN0aW9uJ1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaXNfcHJpbWl0aXZlICAgICAgPSAoIHggICAgICkgLT4gKCB0eXBlX29mIHggKSAgaW4gcHJpbWl0aXZlX3R5cGVzXG4gICAgaXNfcHJpbWl0aXZlX3R5cGUgPSAoIHR5cGUgICkgLT4gdHlwZSAgICAgICAgICAgaW4gcHJpbWl0aXZlX3R5cGVzXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGludGVybmFscyA9IE9iamVjdC5mcmVlemUgeyBpbnRlcm5hbHMuLi4sIH1cbiAgICByZXR1cm4gZXhwb3J0cyA9IHtcbiAgICAgIHR5cGVfb2YsXG4gICAgICBpc19wcmltaXRpdmUsXG4gICAgICBpc19wcmltaXRpdmVfdHlwZSxcbiAgICAgIGludGVybmFscywgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIEJSSUNTXG5cblxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVtb19zaG93ID0gLT5cbiAgR1VZICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uL2d1eSdcbiAgeyBycHIsIH0gPSBHVVkudHJtXG4gIHsgc2hvdyxcbiAgICBTaG93LCB9ID0gQlJJQ1MucmVxdWlyZV9zaG93KClcbiAgZGVidWcgJ86pX19fMycsIHNob3dcbiAgZGVidWcgJ86pX19fNCcsIHNob3cuc3RhdGVcbiAgZGVidWcgJ86pX19fNScsIHNob3cgc2hvdy5kZW50XG4gIGRlYnVnICfOqV9fXzYnLCBzaG93LmdvX2Rvd24oKVxuICBkZWJ1ZyAnzqlfX183Jywgc2hvdyBzaG93LmRlbnRcbiAgZWNobygpXG4gIGVjaG8gJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyBzaG93IHZfMSA9IFwiZm9vICdiYXInXCJcbiAgZWNobyAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvIHNob3cgdl8yID0ge31cbiAgZWNobyAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvIHNob3cgdl8zID0geyBrb25nOiAxMDgsIGxvdzogOTIzLCBudW1iZXJzOiBbIDEwLCAxMSwgMTIsIF0sIH1cbiAgZWNobyAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvIHNob3cgdl80ID0gW11cbiAgZWNobyAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvIHNob3cgdl81ID0gWyAnc29tZScsICd3b3JkcycsICd0bycsICdzaG93JywgMSwgLTEsIGZhbHNlLCBdXG4gIGVjaG8gJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyBzaG93IHZfNiA9IG5ldyBNYXAgWyBbICdrb25nJywgMTA4LCBdLCBbICdsb3cnLCA5MjMsIF0sIFsgOTcxLCAnd29yZCcsIF0sIFsgdHJ1ZSwgJysxJywgXSwgWyAnYSBiIGMnLCBmYWxzZSwgXSBdXG4gIGVjaG8gJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyBzaG93IHZfNyA9IG5ldyBTZXQgWyAnc29tZScsICd3b3JkcycsIHRydWUsIGZhbHNlLCBudWxsLCB1bmRlZmluZWQsIDMuMTQxNTkyNiwgTmFOLCBdXG4gIGVjaG8gJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyBzaG93IHZfOCA9IC9hYmNbZGVdL1xuICBlY2hvICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8gc2hvdyB2XzkgPSBCdWZmZXIuZnJvbSAnYWJjw6TDtsO8J1xuICBlY2hvICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8gc2hvdyB2XzEwID0geyB2XzEsIHZfMiwgdl8zLCB2XzQsIHZfNSwgdl82LCB2XzcsIHZfOCwgdl85LCB9ICMgdl8xMCwgdl8xMSwgdl8xMiwgdl8xMywgdl8xNCwgfVxuICB2XzEwLnZfMTAgPSB2XzEwXG4gIGVjaG8gJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgIyBlY2hvIHNob3cgdl8xMCA9IHsgdl8xLCB2XzIsIHZfMywgdl80LCB2XzUsIHZfNiwgdl83LCB2XzgsIHZfOSwgdl8xMCwgfSAjIHZfMTAsIHZfMTEsIHZfMTIsIHZfMTMsIHZfMTQsIH1cbiAgZWNobyBycHIgdl8xMFxuICBlY2hvICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGEgPSBbICdhJywgXVxuICBiID0gWyAnYicsIGEsIF1cbiAgZWNobyBycHIgIGJcbiAgZWNobyBzaG93IGJcbiAgZWNobyAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBiLnB1c2ggYVxuICBlY2hvIHJwciAgYlxuICBlY2hvIHNob3cgYlxuICBlY2hvICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGQgPSB7fVxuICBjID0geyBkLCB9XG4gIGQuYyA9IGNcbiAgZSA9IHsgZCwgYywgfVxuICBlY2hvIHJwciBjXG4gIGVjaG8gcnByIGVcbiAgIyBlY2hvIHNob3cgYlxuICBlY2hvICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8oKVxuICByZXR1cm4gbnVsbFxuXG4jIGRlbW9fc2hvdygpXG5cblxuXG4iXX0=
//# sourceURL=../src/unstable-rpr-type_of.coffee