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
          var is_circular, method, type;
          type = type_of(x);
          is_circular = false;
          if (!is_primitive_type(type)) {
            if (this.state.seen.has(x)) {
              // debug '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', "seen", type
              // null
              is_circular = true;
              yield '(CIRCULAR)';
              return null;
            }
          }
          this.state.seen.add(x);
          // unless is_circular
          if ((method = this[`show_${type}`]) != null) {
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
    echo('Ω___8', '————————————————————————————————————————————————————————————————');
    echo('Ω___9', show(v_1 = "foo 'bar'"));
    echo('Ω__10', '————————————————————————————————————————————————————————————————');
    echo('Ω__11', show(v_2 = {}));
    echo('Ω__12', '————————————————————————————————————————————————————————————————');
    echo('Ω__13', show(v_3 = {
      kong: 108,
      low: 923,
      numbers: [10, 11, 12]
    }));
    echo('Ω__14', '————————————————————————————————————————————————————————————————');
    echo('Ω__15', show(v_4 = []));
    echo('Ω__16', '————————————————————————————————————————————————————————————————');
    echo('Ω__17', show(v_5 = ['some', 'words', 'to', 'show', 1, -1, false]));
    echo('Ω__18', '————————————————————————————————————————————————————————————————');
    echo('Ω__19', show(v_6 = new Map([['kong', 108], ['low', 923], [971, 'word'], [true, '+1'], ['a b c', false]])));
    echo('Ω__20', '————————————————————————————————————————————————————————————————');
    echo('Ω__21', show(v_7 = new Set(['some', 'words', true, false, null, void 0, 3.1415926, 0/0])));
    echo('Ω__22', '————————————————————————————————————————————————————————————————');
    echo('Ω__23', show(v_8 = /abc[de]/));
    echo('Ω__24', '————————————————————————————————————————————————————————————————');
    echo('Ω__25', show(v_9 = Buffer.from('abcäöü')));
    echo('Ω__26', '————————————————————————————————————————————————————————————————');
    echo('Ω__27', show(v_10 = {v_1, v_2, v_3, v_4, v_5, v_6, v_7, v_8, v_9})); // v_10, v_11, v_12, v_13, v_14, }
    v_10.v_10 = v_10;
    echo('Ω__28', '————————————————————————————————————————————————————————————————');
    echo('Ω__29', rpr(v_10));
    echo('Ω__30', show(v_10 = {v_1, v_2, v_3, v_4, v_5, v_6, v_7, v_8, v_9, v_10})); // v_10, v_11, v_12, v_13, v_14, }
    echo('Ω__31', '————————————————————————————————————————————————————————————————');
    a = ['a'];
    b = ['b', a];
    echo('Ω__32', rpr(b));
    echo('Ω__33', show(b));
    echo('Ω__34', '————————————————————————————————————————————————————————————————');
    b.push(a);
    echo('Ω__35', rpr(b));
    echo('Ω__36', show(b));
    echo('Ω__37', '————————————————————————————————————————————————————————————————');
    d = {};
    c = {d};
    d.c = c;
    e = {d, c};
    echo('Ω__38', rpr(c));
    echo('Ω__39', rpr(e));
    // echo 'Ω__40', show b
    echo('Ω__41', '————————————————————————————————————————————————————————————————');
    echo();
    return null;
  };

  // demo_show()

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLXJwci10eXBlX29mLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxJQUFBO0lBQUE7O0VBRUEsQ0FBQTtJQUFFLEtBQUY7SUFDRSxHQUFBLEVBQUs7RUFEUCxDQUFBLEdBQ2lCLE9BRGpCLEVBRkE7Ozs7O0VBU0EsS0FBQSxHQU1FLENBQUE7Ozs7SUFBQSxZQUFBLEVBQWMsUUFBQSxDQUFBLENBQUE7QUFFaEIsVUFBQSxDQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLFNBQUEsRUFBQSxpQkFBQSxFQUFBLFFBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLGNBQUEsRUFBQSxVQUFBLEVBQUEsU0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBOztNQUNJLEtBQUEsR0FBNEIsUUFBQSxDQUFFLENBQUYsQ0FBQTtlQUFTLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixDQUFyQjtNQUFUO01BQzVCLENBQUEsR0FBNEIsT0FBQSxDQUFRLDhFQUFSO01BQzVCLENBQUEsQ0FBRSxPQUFGLEVBQ0UsaUJBREYsQ0FBQSxHQUM0QixLQUFLLENBQUMsZUFBTixDQUFBLENBRDVCO01BRUEsQ0FBQSxDQUFFLFVBQUYsQ0FBQSxHQUE0QixDQUFFLE9BQUEsQ0FBUSxRQUFSLENBQUYsQ0FBb0IsQ0FBQyxrQkFBckIsQ0FBQSxDQUE1QixFQUxKOzs7Ozs7OztNQWFJLE9BQUEsR0FBWTtNQUNaLFFBQUEsR0FBWSxRQUFBLENBQUUsQ0FBRixDQUFBO2VBQVMsQ0FBRSxDQUFFLE9BQU8sQ0FBVCxDQUFBLEtBQWdCLFFBQWxCLENBQUEsSUFBaUMsT0FBTyxDQUFDLElBQVIsQ0FBYSxDQUFiO01BQTFDLEVBZGhCOztNQWdCSSxTQUFBLEdBQ0U7UUFBQSxJQUFBLEVB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SSxDQUFKLENBQWQ7SUFDQSxJQUFBLENBQUssT0FBTCxFQUFjLEdBQUEsQ0FBSSxDQUFKLENBQWQsRUFqREY7O0lBbURFLElBQUEsQ0FBSyxPQUFMLEVBQWMsa0VBQWQ7SUFDQSxJQUFBLENBQUE7QUFDQSxXQUFPO0VBdERHOztFQXZiWjtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbnsgZGVidWcsXG4gIGxvZzogZWNobywgfSA9IGNvbnNvbGVcblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQlJJQ1MgPVxuXG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9zaG93OiAtPlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICB3cml0ZSAgICAgICAgICAgICAgICAgICAgID0gKCBwICkgLT4gcHJvY2Vzcy5zdGRvdXQud3JpdGUgcFxuICAgIEMgICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi9oZW5naXN0LU5HL25vZGVfbW9kdWxlcy8ucG5wbS9hbnNpc0A0LjEuMC9ub2RlX21vZHVsZXMvYW5zaXMvaW5kZXguY2pzJ1xuICAgIHsgdHlwZV9vZixcbiAgICAgIGlzX3ByaW1pdGl2ZV90eXBlLCAgICB9ID0gQlJJQ1MucmVxdWlyZV90eXBlX29mKClcbiAgICB7IHN0cmlwX2Fuc2ksICAgICAgICAgICB9ID0gKCByZXF1aXJlICcuL21haW4nICkucmVxdWlyZV9zdHJpcF9hbnNpKClcbiAgICAjIHsgaGlkZSxcbiAgICAjICAgc2V0X2dldHRlciwgICB9ID0gKCByZXF1aXJlICcuL21haW4nICkucmVxdWlyZV9tYW5hZ2VkX3Byb3BlcnR5X3Rvb2xzKClcbiAgICAjIFNRTElURSAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpzcWxpdGUnXG4gICAgIyB7IGRlYnVnLCAgICAgICAgfSA9IGNvbnNvbGVcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgIyMjIHRoeCB0byBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL2lkZW50aWZpZXItcmVnZXggIyMjXG4gICAganNpZF9yZSAgID0gLy8vXiBbICQgXyBcXHB7SURfU3RhcnR9IF0gWyAkIF8gXFx1MjAwQyBcXHUyMDBEIFxccHtJRF9Db250aW51ZX0gXSogJC8vL3ZcbiAgICBpc2FfanNpZCAgPSAoIHggKSAtPiAoICggdHlwZW9mIHggKSBpcyAnc3RyaW5nJyApIGFuZCBqc2lkX3JlLnRlc3QgeFxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgdGVtcGxhdGVzID1cbiAgICAgIHNob3c6XG4gICAgICAgIGluZGVudGF0aW9uOiAgbnVsbFxuICAgICAgICBjb2xvcnM6ICAgICAgIHRydWVcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW50ZXJuYWxzID0geyBqc2lkX3JlLCBpc2FfanNpZCwgdGVtcGxhdGVzLCB9XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIFNob3dcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKCBjZmcgKSAtPlxuICAgICAgICBtZSA9ICggeCApID0+XG4gICAgICAgICAgUiA9ICggdGV4dCBmb3IgdGV4dCBmcm9tIEBwZW4geCApLmpvaW4gJydcbiAgICAgICAgICAjIyMgVEFJTlQgYXZvaWQgdG8gYWRkIGNvbG9ycyBpbnN0ZWFkICMjI1xuICAgICAgICAgIFIgPSBzdHJpcF9hbnNpIFIgaWYgQGNmZy5jb2xvcnMgaXMgZmFsc2VcbiAgICAgICAgICByZXR1cm4gUlxuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YgbWUsIEBcbiAgICAgICAgQGNmZyAgICA9IHsgdGVtcGxhdGVzLnNob3cuLi4sIGNmZy4uLiwgfVxuICAgICAgICBAc3RhdGUgID0geyBsZXZlbDogMCwgZW5kZWRfd2l0aF9ubDogZmFsc2UsIHNlZW46ICggbmV3IFNldCgpICksIH1cbiAgICAgICAgQHNwYWNlciA9ICdcXHgyMFxceDIwJ1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgQCwgJ2RlbnQnLFxuICAgICAgICAgIGdldDogPT4gQHNwYWNlci5yZXBlYXQgQHN0YXRlLmxldmVsXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHBlbjogKCB4ICkgLT5cbiAgICAgICAgQHN0YXRlLnNlZW4uY2xlYXIoKVxuICAgICAgICBmb3IgdGV4dCBmcm9tIEBkaXNwYXRjaCB4XG4gICAgICAgICAgQHN0YXRlLmVuZGVkX3dpdGhfbmwgPSB0ZXh0LmVuZHNXaXRoICdcXG4nXG4gICAgICAgICAgeWllbGQgdGV4dFxuICAgICAgICB1bmxlc3MgQHN0YXRlLmVuZGVkX3dpdGhfbmxcbiAgICAgICAgICBAc3RhdGUuZW5kZWRfd2l0aF9ubCA9IHRydWVcbiAgICAgICAgICAjIHlpZWxkICdcXG4nXG4gICAgICAgIEBzdGF0ZS5zZWVuLmNsZWFyKClcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBnb19kb3duOiAtPlxuICAgICAgICBAc3RhdGUubGV2ZWwrK1xuICAgICAgICByZXR1cm4gQHN0YXRlLmxldmVsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZ29fdXA6IC0+XG4gICAgICAgIGlmIEBzdGF0ZS5sZXZlbCA8IDFcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzEgdW5hYmxlIHRvIGdvIGJlbG93IGxldmVsIDBcIlxuICAgICAgICBAc3RhdGUubGV2ZWwtLVxuICAgICAgICByZXR1cm4gQHN0YXRlLmxldmVsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZGlzcGF0Y2g6ICggeCApIC0+XG4gICAgICAgIHR5cGUgICAgICAgID0gdHlwZV9vZiB4XG4gICAgICAgIGlzX2NpcmN1bGFyID0gZmFsc2VcbiAgICAgICAgaWYgKCBub3QgaXNfcHJpbWl0aXZlX3R5cGUgdHlwZSApXG4gICAgICAgICAgaWYgQHN0YXRlLnNlZW4uaGFzIHhcbiAgICAgICAgICAgICMgZGVidWcgJ15eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl4nLCBcInNlZW5cIiwgdHlwZVxuICAgICAgICAgICAgIyBudWxsXG4gICAgICAgICAgICBpc19jaXJjdWxhciA9IHRydWVcbiAgICAgICAgICAgIHlpZWxkICcoQ0lSQ1VMQVIpJ1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgQHN0YXRlLnNlZW4uYWRkIHhcbiAgICAgICAgIyB1bmxlc3MgaXNfY2lyY3VsYXJcbiAgICAgICAgaWYgKCBtZXRob2QgPSBAWyBcInNob3dfI3t0eXBlfVwiIF0gKT9cbiAgICAgICAgICB5aWVsZCBmcm9tIG1ldGhvZC5jYWxsIEAsIHhcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHlpZWxkIGZyb20gQHNob3dfb3RoZXIgeFxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9zaG93X2tleTogKCBrZXkgKSAtPlxuICAgICAgICBpZiBpc2FfanNpZCBrZXkgdGhlbiByZXR1cm4gY29sb3JzLl9rZXkga2V5XG4gICAgICAgIHJldHVybiBbICggdCBmb3IgdCBmcm9tIEBkaXNwYXRjaCBrZXkgKS4uLiwgXS5qb2luICcnXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2hvd19wb2Q6ICggeCApIC0+XG4gICAgICAgIGhhc19rZXlzID0gZmFsc2VcbiAgICAgICAgeWllbGQgY29sb3JzLnBvZCAneydcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmb3Iga2V5LCB2YWx1ZSBvZiB4XG4gICAgICAgICAgIyMjIFRBSU5UIGNvZGUgZHVwbGljYXRpb24gIyMjXG4gICAgICAgICAgaGFzX2tleXMgPSB0cnVlXG4gICAgICAgICAgeWllbGQgJyAnICsgKCBAX3Nob3dfa2V5IGtleSApICsgY29sb3JzLnBvZCAnOiAnXG4gICAgICAgICAgZm9yIHRleHQgZnJvbSBAZGlzcGF0Y2ggdmFsdWVcbiAgICAgICAgICAgIHlpZWxkIHRleHRcbiAgICAgICAgICB5aWVsZCBjb2xvcnMucG9kICcsJ1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHlpZWxkIGNvbG9ycy5wb2QgaWYgKCBub3QgaGFzX2tleXMgKSB0aGVuICd9JyBlbHNlICcgfSdcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzaG93X21hcDogKCB4ICkgLT5cbiAgICAgICAgaGFzX2tleXMgPSBmYWxzZVxuICAgICAgICB5aWVsZCBjb2xvcnMubWFwICdtYXB7J1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZvciBbIGtleSwgdmFsdWUsIF0gZnJvbSB4LmVudHJpZXMoKVxuICAgICAgICAgICMjIyBUQUlOVCBjb2RlIGR1cGxpY2F0aW9uICMjI1xuICAgICAgICAgIGhhc19rZXlzID0gdHJ1ZVxuICAgICAgICAgIHlpZWxkICcgJyArICggQF9zaG93X2tleSBrZXkgKSArIGNvbG9ycy5tYXAgJzogJ1xuICAgICAgICAgIGZvciB0ZXh0IGZyb20gQGRpc3BhdGNoIHZhbHVlXG4gICAgICAgICAgICB5aWVsZCB0ZXh0XG4gICAgICAgICAgeWllbGQgY29sb3JzLm1hcCAnLCdcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB5aWVsZCBjb2xvcnMubWFwIGlmICggbm90IGhhc19rZXlzICkgdGhlbiAnfScgZWxzZSAnIH0nXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2hvd19saXN0OiAoIHggKSAtPlxuICAgICAgICBSID0gJydcbiAgICAgICAgUiArPSBjb2xvcnMubGlzdCAnWydcbiAgICAgICAgZm9yIGVsZW1lbnQgaW4geFxuICAgICAgICAgICMjIyBUQUlOVCBjb2RlIGR1cGxpY2F0aW9uICMjI1xuICAgICAgICAgIGZvciB0ZXh0IGZyb20gQGRpc3BhdGNoIGVsZW1lbnRcbiAgICAgICAgICAgIFIgKz0gJyAnICsgdGV4dCArICggY29sb3JzLmxpc3QgJywnIClcbiAgICAgICAgUiArPSBjb2xvcnMubGlzdCBpZiAoIHgubGVuZ3RoIGlzIDAgKSB0aGVuICddJyBlbHNlICcgXSdcbiAgICAgICAgeWllbGQgUlxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNob3dfc2V0OiAoIHggKSAtPlxuICAgICAgICB5aWVsZCBjb2xvcnMuc2V0ICdzZXRbJ1xuICAgICAgICBmb3IgZWxlbWVudCBmcm9tIHgua2V5cygpXG4gICAgICAgICAgIyMjIFRBSU5UIGNvZGUgZHVwbGljYXRpb24gIyMjXG4gICAgICAgICAgZm9yIHRleHQgZnJvbSBAZGlzcGF0Y2ggZWxlbWVudFxuICAgICAgICAgICAgeWllbGQgJyAnICsgdGV4dCArIGNvbG9ycy5zZXQgJywnXG4gICAgICAgIHlpZWxkIGNvbG9ycy5zZXQgaWYgKCB4Lmxlbmd0aCBpcyAwICkgdGhlbiAnXScgZWxzZSAnIF0nXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2hvd190ZXh0OiAoIHggKSAtPlxuICAgICAgICBpZiBcIidcIiBpbiB4IHRoZW4gIHlpZWxkIGNvbG9ycy50ZXh0ICdcIicgKyAoIHgucmVwbGFjZSAvXCIvZywgJ1xcXFxcIicgKSArICdcIidcbiAgICAgICAgZWxzZSAgICAgICAgICAgICAgeWllbGQgY29sb3JzLnRleHQgXCInXCIgKyAoIHgucmVwbGFjZSAvJy9nLCBcIlxcXFwnXCIgKSArIFwiJ1wiXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2hvd19mbG9hdDogKCB4ICkgLT5cbiAgICAgICAgeWllbGQgKCBjb2xvcnMuZmxvYXQgeC50b1N0cmluZygpIClcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzaG93X3JlZ2V4OiAoIHggKSAtPlxuICAgICAgICB5aWVsZCAoIGNvbG9ycy5yZWdleCB4LnRvU3RyaW5nKCkgKVxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICMjIyBmdWxsIHdvcmRzOiAjIyNcbiAgICAgICMgc2hvd190cnVlOiAgICAgICggeCApIC0+IHlpZWxkICggY29sb3JzLnRydWUgICAgICAndHJ1ZScgICAgICApXG4gICAgICAjIHNob3dfZmFsc2U6ICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy5mYWxzZSAgICAgJ2ZhbHNlJyAgICAgKVxuICAgICAgIyBzaG93X3VuZGVmaW5lZDogKCB4ICkgLT4geWllbGQgKCBjb2xvcnMudW5kZWZpbmVkICd1bmRlZmluZWQnIClcbiAgICAgICMgc2hvd19udWxsOiAgICAgICggeCApIC0+IHlpZWxkICggY29sb3JzLm51bGwgICAgICAnbnVsbCcgICAgICApXG4gICAgICAjIHNob3dfbmFuOiAgICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy5uYW4gICAgICAgJ05hTicgICAgICAgKVxuICAgICAgIyMjIChtb3N0bHkpIHNpbmdsZSBsZXR0ZXJzOiAjIyNcbiAgICAgIHNob3dfdHJ1ZTogICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy50cnVlICAgICAgJyBUICcgICAgIClcbiAgICAgIHNob3dfZmFsc2U6ICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy5mYWxzZSAgICAgJyBGICcgICAgIClcbiAgICAgIHNob3dfdW5kZWZpbmVkOiAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy51bmRlZmluZWQgJyBVICcgICAgIClcbiAgICAgIHNob3dfbnVsbDogICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy5udWxsICAgICAgJyBOICcgICAgIClcbiAgICAgIHNob3dfbmFuOiAgICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy5uYW4gICAgICAgJyBOYU4gJyAgIClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzaG93X290aGVyOiAoIHggKSAtPlxuICAgICAgICAjIHlpZWxkICdcXG4nIHVubGVzcyBAc3RhdGUuZW5kZWRfd2l0aF9ubFxuICAgICAgICB5aWVsZCBjb2xvcnMub3RoZXIgXCIje3h9XCJcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgQ09MT1IgPSBuZXcgQy5BbnNpcygpLmV4dGVuZFxuICAgICAgYWxpY2VibHVlOiAgICAgICAgICAgICAgICAgICcjZjBmOGZmJ1xuICAgICAgYW50aXF1ZXdoaXRlOiAgICAgICAgICAgICAgICcjZmFlYmQ3J1xuICAgICAgYXF1YTogICAgICAgICAgICAgICAgICAgICAgICcjMDBmZmZmJ1xuICAgICAgYXF1YW1hcmluZTogICAgICAgICAgICAgICAgICcjN2ZmZmQ0J1xuICAgICAgYXp1cmU6ICAgICAgICAgICAgICAgICAgICAgICcjZjBmZmZmJ1xuICAgICAgYmVpZ2U6ICAgICAgICAgICAgICAgICAgICAgICcjZjVmNWRjJ1xuICAgICAgYmlzcXVlOiAgICAgICAgICAgICAgICAgICAgICcjZmZlNGM0J1xuICAgICAgYmxhY2s6ICAgICAgICAgICAgICAgICAgICAgICcjMDAwMDAwJ1xuICAgICAgYmxhbmNoZWRhbG1vbmQ6ICAgICAgICAgICAgICcjZmZlYmNkJ1xuICAgICAgYmx1ZTogICAgICAgICAgICAgICAgICAgICAgICcjMDAwMGZmJ1xuICAgICAgYmx1ZXZpb2xldDogICAgICAgICAgICAgICAgICcjOGEyYmUyJ1xuICAgICAgYnJvd246ICAgICAgICAgICAgICAgICAgICAgICcjYTUyYTJhJ1xuICAgICAgYnVybHl3b29kOiAgICAgICAgICAgICAgICAgICcjZGViODg3J1xuICAgICAgY2FkZXRibHVlOiAgICAgICAgICAgICAgICAgICcjNWY5ZWEwJ1xuICAgICAgY2hhcnRyZXVzZTogICAgICAgICAgICAgICAgICcjN2ZmZjAwJ1xuICAgICAgY2hvY29sYXRlOiAgICAgICAgICAgICAgICAgICcjZDI2OTFlJ1xuICAgICAgY29yYWw6ICAgICAgICAgICAgICAgICAgICAgICcjZmY3ZjUwJ1xuICAgICAgY29ybmZsb3dlcmJsdWU6ICAgICAgICAgICAgICcjNjQ5NWVkJ1xuICAgICAgY29ybnNpbGs6ICAgICAgICAgICAgICAgICAgICcjZmZmOGRjJ1xuICAgICAgY3JpbXNvbjogICAgICAgICAgICAgICAgICAgICcjZGMxNDNjJ1xuICAgICAgY3lhbjogICAgICAgICAgICAgICAgICAgICAgICcjMDBmZmZmJ1xuICAgICAgZGFya2JsdWU6ICAgICAgICAgICAgICAgICAgICcjMDAwMDhiJ1xuICAgICAgZGFya2N5YW46ICAgICAgICAgICAgICAgICAgICcjMDA4YjhiJ1xuICAgICAgZGFya2dvbGRlbnJvZDogICAgICAgICAgICAgICcjYjg4NjBiJ1xuICAgICAgZGFya2dyYXk6ICAgICAgICAgICAgICAgICAgICcjYTlhOWE5J1xuICAgICAgZGFya2dyZWVuOiAgICAgICAgICAgICAgICAgICcjMDA2NDAwJ1xuICAgICAgZGFya2toYWtpOiAgICAgICAgICAgICAgICAgICcjYmRiNzZiJ1xuICAgICAgZGFya21hZ2VudGE6ICAgICAgICAgICAgICAgICcjOGIwMDhiJ1xuICAgICAgZGFya29saXZlZ3JlZW46ICAgICAgICAgICAgICcjNTU2YjJmJ1xuICAgICAgZGFya29yYW5nZTogICAgICAgICAgICAgICAgICcjZmY4YzAwJ1xuICAgICAgZGFya29yY2hpZDogICAgICAgICAgICAgICAgICcjOTkzMmNjJ1xuICAgICAgZGFya3JlZDogICAgICAgICAgICAgICAgICAgICcjOGIwMDAwJ1xuICAgICAgZGFya3NhbG1vbjogICAgICAgICAgICAgICAgICcjZTk5NjdhJ1xuICAgICAgZGFya3NlYWdyZWVuOiAgICAgICAgICAgICAgICcjOGZiYzhmJ1xuICAgICAgZGFya3NsYXRlYmx1ZTogICAgICAgICAgICAgICcjNDgzZDhiJ1xuICAgICAgZGFya3NsYXRlZ3JheTogICAgICAgICAgICAgICcjMmY0ZjRmJ1xuICAgICAgZGFya3R1cnF1b2lzZTogICAgICAgICAgICAgICcjMDBjZWQxJ1xuICAgICAgZGFya3Zpb2xldDogICAgICAgICAgICAgICAgICcjOTQwMGQzJ1xuICAgICAgZGVlcHBpbms6ICAgICAgICAgICAgICAgICAgICcjZmYxNDkzJ1xuICAgICAgZGVlcHNreWJsdWU6ICAgICAgICAgICAgICAgICcjMDBiZmZmJ1xuICAgICAgZGltZ3JheTogICAgICAgICAgICAgICAgICAgICcjNjk2OTY5J1xuICAgICAgZG9kZ2VyYmx1ZTogICAgICAgICAgICAgICAgICcjMWU5MGZmJ1xuICAgICAgZmlyZWJyaWNrOiAgICAgICAgICAgICAgICAgICcjYjIyMjIyJ1xuICAgICAgZmxvcmFsd2hpdGU6ICAgICAgICAgICAgICAgICcjZmZmYWYwJ1xuICAgICAgZm9yZXN0Z3JlZW46ICAgICAgICAgICAgICAgICcjMjI4YjIyJ1xuICAgICAgZ2FpbnNib3JvOiAgICAgICAgICAgICAgICAgICcjZGNkY2RjJ1xuICAgICAgZ2hvc3R3aGl0ZTogICAgICAgICAgICAgICAgICcjZjhmOGZmJ1xuICAgICAgZ29sZDogICAgICAgICAgICAgICAgICAgICAgICcjZmZkNzAwJ1xuICAgICAgZ29sZGVucm9kOiAgICAgICAgICAgICAgICAgICcjZGFhNTIwJ1xuICAgICAgZ3JheTogICAgICAgICAgICAgICAgICAgICAgICcjODA4MDgwJ1xuICAgICAgZ3JlZW46ICAgICAgICAgICAgICAgICAgICAgICcjMDA4MDAwJ1xuICAgICAgZ3JlZW55ZWxsb3c6ICAgICAgICAgICAgICAgICcjYWRmZjJmJ1xuICAgICAgaG9uZXlkZXc6ICAgICAgICAgICAgICAgICAgICcjZjBmZmYwJ1xuICAgICAgaG90cGluazogICAgICAgICAgICAgICAgICAgICcjZmY2OWI0J1xuICAgICAgaW5kaWFucmVkOiAgICAgICAgICAgICAgICAgICcjY2Q1YzVjJ1xuICAgICAgaW5kaWdvOiAgICAgICAgICAgICAgICAgICAgICcjNGIwMDgyJ1xuICAgICAgaXZvcnk6ICAgICAgICAgICAgICAgICAgICAgICcjZmZmZmYwJ1xuICAgICAga2hha2k6ICAgICAgICAgICAgICAgICAgICAgICcjZjBlNjhjJ1xuICAgICAgbGF2ZW5kZXI6ICAgICAgICAgICAgICAgICAgICcjZTZlNmZhJ1xuICAgICAgbGF2ZW5kZXJibHVzaDogICAgICAgICAgICAgICcjZmZmMGY1J1xuICAgICAgbGF3bmdyZWVuOiAgICAgICAgICAgICAgICAgICcjN2NmYzAwJ1xuICAgICAgbGVtb25jaGlmZm9uOiAgICAgICAgICAgICAgICcjZmZmYWNkJ1xuICAgICAgbGlnaHRibHVlOiAgICAgICAgICAgICAgICAgICcjYWRkOGU2J1xuICAgICAgbGlnaHRjb3JhbDogICAgICAgICAgICAgICAgICcjZjA4MDgwJ1xuICAgICAgbGlnaHRjeWFuOiAgICAgICAgICAgICAgICAgICcjZTBmZmZmJ1xuICAgICAgbGlnaHRnb2xkZW5yb2R5ZWxsb3c6ICAgICAgICcjZmFmYWQyJ1xuICAgICAgbGlnaHRncmF5OiAgICAgICAgICAgICAgICAgICcjZDNkM2QzJ1xuICAgICAgbGlnaHRncmVlbjogICAgICAgICAgICAgICAgICcjOTBlZTkwJ1xuICAgICAgbGlnaHRwaW5rOiAgICAgICAgICAgICAgICAgICcjZmZiNmMxJ1xuICAgICAgbGlnaHRzYWxtb246ICAgICAgICAgICAgICAgICcjZmZhMDdhJ1xuICAgICAgbGlnaHRzZWFncmVlbjogICAgICAgICAgICAgICcjMjBiMmFhJ1xuICAgICAgbGlnaHRza3libHVlOiAgICAgICAgICAgICAgICcjODdjZWZhJ1xuICAgICAgbGlnaHRzbGF0ZWdyYXk6ICAgICAgICAgICAgICcjNzc4ODk5J1xuICAgICAgbGlnaHRzdGVlbGJsdWU6ICAgICAgICAgICAgICcjYjBjNGRlJ1xuICAgICAgbGlnaHR5ZWxsb3c6ICAgICAgICAgICAgICAgICcjZmZmZmUwJ1xuICAgICAgbGltZTogICAgICAgICAgICAgICAgICAgICAgICcjMDBmZjAwJ1xuICAgICAgbGltZWdyZWVuOiAgICAgICAgICAgICAgICAgICcjMzJjZDMyJ1xuICAgICAgbGluZW46ICAgICAgICAgICAgICAgICAgICAgICcjZmFmMGU2J1xuICAgICAgbWFnZW50YTogICAgICAgICAgICAgICAgICAgICcjZmYwMGZmJ1xuICAgICAgbWFyb29uOiAgICAgICAgICAgICAgICAgICAgICcjODAwMDAwJ1xuICAgICAgbWVkaXVtYXF1YW1hcmluZTogICAgICAgICAgICcjNjZjZGFhJ1xuICAgICAgbWVkaXVtYmx1ZTogICAgICAgICAgICAgICAgICcjMDAwMGNkJ1xuICAgICAgbWVkaXVtb3JjaGlkOiAgICAgICAgICAgICAgICcjYmE1NWQzJ1xuICAgICAgbWVkaXVtcHVycGxlOiAgICAgICAgICAgICAgICcjOTM3MGRiJ1xuICAgICAgbWVkaXVtc2VhZ3JlZW46ICAgICAgICAgICAgICcjM2NiMzcxJ1xuICAgICAgbWVkaXVtc2xhdGVibHVlOiAgICAgICAgICAgICcjN2I2OGVlJ1xuICAgICAgbWVkaXVtc3ByaW5nZ3JlZW46ICAgICAgICAgICcjMDBmYTlhJ1xuICAgICAgbWVkaXVtdHVycXVvaXNlOiAgICAgICAgICAgICcjNDhkMWNjJ1xuICAgICAgbWVkaXVtdmlvbGV0cmVkOiAgICAgICAgICAgICcjYzcxNTg1J1xuICAgICAgbWlkbmlnaHRibHVlOiAgICAgICAgICAgICAgICcjMTkxOTcwJ1xuICAgICAgbWludGNyZWFtOiAgICAgICAgICAgICAgICAgICcjZjVmZmZhJ1xuICAgICAgbWlzdHlyb3NlOiAgICAgICAgICAgICAgICAgICcjZmZlNGUxJ1xuICAgICAgbW9jY2FzaW46ICAgICAgICAgICAgICAgICAgICcjZmZlNGI1J1xuICAgICAgbmF2YWpvd2hpdGU6ICAgICAgICAgICAgICAgICcjZmZkZWFkJ1xuICAgICAgbmF2eTogICAgICAgICAgICAgICAgICAgICAgICcjMDAwMDgwJ1xuICAgICAgb2xkbGFjZTogICAgICAgICAgICAgICAgICAgICcjZmRmNWU2J1xuICAgICAgb2xpdmU6ICAgICAgICAgICAgICAgICAgICAgICcjODA4MDAwJ1xuICAgICAgb2xpdmVkcmFiOiAgICAgICAgICAgICAgICAgICcjNmI4ZTIzJ1xuICAgICAgb3JhbmdlOiAgICAgICAgICAgICAgICAgICAgICcjZmZhNTAwJ1xuICAgICAgb3JhbmdlcmVkOiAgICAgICAgICAgICAgICAgICcjZmY0NTAwJ1xuICAgICAgb3JjaGlkOiAgICAgICAgICAgICAgICAgICAgICcjZGE3MGQ2J1xuICAgICAgcGFsZWdvbGRlbnJvZDogICAgICAgICAgICAgICcjZWVlOGFhJ1xuICAgICAgcGFsZWdyZWVuOiAgICAgICAgICAgICAgICAgICcjOThmYjk4J1xuICAgICAgcGFsZXR1cnF1b2lzZTogICAgICAgICAgICAgICcjYWZlZWVlJ1xuICAgICAgcGFsZXZpb2xldHJlZDogICAgICAgICAgICAgICcjZGI3MDkzJ1xuICAgICAgcGFwYXlhd2hpcDogICAgICAgICAgICAgICAgICcjZmZlZmQ1J1xuICAgICAgcGVhY2hwdWZmOiAgICAgICAgICAgICAgICAgICcjZmZkYWI5J1xuICAgICAgcGVydTogICAgICAgICAgICAgICAgICAgICAgICcjY2Q4NTNmJ1xuICAgICAgcGluazogICAgICAgICAgICAgICAgICAgICAgICcjZmZjMGNiJ1xuICAgICAgcGx1bTogICAgICAgICAgICAgICAgICAgICAgICcjZGRhMGRkJ1xuICAgICAgcG93ZGVyYmx1ZTogICAgICAgICAgICAgICAgICcjYjBlMGU2J1xuICAgICAgcHVycGxlOiAgICAgICAgICAgICAgICAgICAgICcjODAwMDgwJ1xuICAgICAgcmVkOiAgICAgICAgICAgICAgICAgICAgICAgICcjZmYwMDAwJ1xuICAgICAgcm9zeWJyb3duOiAgICAgICAgICAgICAgICAgICcjYmM4ZjhmJ1xuICAgICAgcm95YWxibHVlOiAgICAgICAgICAgICAgICAgICcjNDE2OWUxJ1xuICAgICAgc2FkZGxlYnJvd246ICAgICAgICAgICAgICAgICcjOGI0NTEzJ1xuICAgICAgc2FsbW9uOiAgICAgICAgICAgICAgICAgICAgICcjZmE4MDcyJ1xuICAgICAgc2FuZHlicm93bjogICAgICAgICAgICAgICAgICcjZjRhNDYwJ1xuICAgICAgc2VhZ3JlZW46ICAgICAgICAgICAgICAgICAgICcjMmU4YjU3J1xuICAgICAgc2Vhc2hlbGw6ICAgICAgICAgICAgICAgICAgICcjZmZmNWVlJ1xuICAgICAgc2llbm5hOiAgICAgICAgICAgICAgICAgICAgICcjYTA1MjJkJ1xuICAgICAgc2lsdmVyOiAgICAgICAgICAgICAgICAgICAgICcjYzBjMGMwJ1xuICAgICAgc2t5Ymx1ZTogICAgICAgICAgICAgICAgICAgICcjODdjZWViJ1xuICAgICAgc2xhdGVibHVlOiAgICAgICAgICAgICAgICAgICcjNmE1YWNkJ1xuICAgICAgc2xhdGVncmF5OiAgICAgICAgICAgICAgICAgICcjNzA4MDkwJ1xuICAgICAgc25vdzogICAgICAgICAgICAgICAgICAgICAgICcjZmZmYWZhJ1xuICAgICAgc3ByaW5nZ3JlZW46ICAgICAgICAgICAgICAgICcjMDBmZjdmJ1xuICAgICAgc3RlZWxibHVlOiAgICAgICAgICAgICAgICAgICcjNDY4MmI0J1xuICAgICAgdGFuOiAgICAgICAgICAgICAgICAgICAgICAgICcjZDJiNDhjJ1xuICAgICAgdGVhbDogICAgICAgICAgICAgICAgICAgICAgICcjMDA4MDgwJ1xuICAgICAgdGhpc3RsZTogICAgICAgICAgICAgICAgICAgICcjZDhiZmQ4J1xuICAgICAgdG9tYXRvOiAgICAgICAgICAgICAgICAgICAgICcjZmY2MzQ3J1xuICAgICAgdHVycXVvaXNlOiAgICAgICAgICAgICAgICAgICcjNDBlMGQwJ1xuICAgICAgdmlvbGV0OiAgICAgICAgICAgICAgICAgICAgICcjZWU4MmVlJ1xuICAgICAgd2hlYXQ6ICAgICAgICAgICAgICAgICAgICAgICcjZjVkZWIzJ1xuICAgICAgd2hpdGU6ICAgICAgICAgICAgICAgICAgICAgICcjZmZmZmZmJ1xuICAgICAgd2hpdGVzbW9rZTogICAgICAgICAgICAgICAgICcjZjVmNWY1J1xuICAgICAgeWVsbG93OiAgICAgICAgICAgICAgICAgICAgICcjZmZmZjAwJ1xuICAgICAgeWVsbG93Z3JlZW46ICAgICAgICAgICAgICAgICcjOWFjZDMyJ1xuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBGQU5DWVJFRDogICAgICAgICAgICAgICAgICAgJyNmZDUyMzAnXG4gICAgICBGQU5DWU9SQU5HRTogICAgICAgICAgICAgICAgJyNmZDZkMzAnXG4gICAgICAjIG9vbXBoOiAoIHggKSAtPiBkZWJ1ZyAnzqlfX18yJywgeDsgcmV0dXJuIFwifn5+ICN7eH0gfn5+XCJcblxuICAgIGNvbG9ycyA9XG4gICAgICBfa2V5OiAgICAgICAoIHggKSAtPiBDT0xPUi5jeWFuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4XG4gICAgICBwb2Q6ICAgICAgICAoIHggKSAtPiBDT0xPUi5nb2xkICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4XG4gICAgICBtYXA6ICAgICAgICAoIHggKSAtPiBDT0xPUi5nb2xkICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4XG4gICAgICBsaXN0OiAgICAgICAoIHggKSAtPiBDT0xPUi5nb2xkICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4XG4gICAgICBzZXQ6ICAgICAgICAoIHggKSAtPiBDT0xPUi5nb2xkICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4XG4gICAgICB0ZXh0OiAgICAgICAoIHggKSAtPiBDT0xPUi53aGVhdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB4XG4gICAgICBmbG9hdDogICAgICAoIHggKSAtPiBDT0xPUi5GQU5DWVJFRCAgICAgICAgICAgICAgICAgICAgICAgICB4XG4gICAgICByZWdleDogICAgICAoIHggKSAtPiBDT0xPUi5wbHVtICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4XG4gICAgICB0cnVlOiAgICAgICAoIHggKSAtPiBDT0xPUi5pbnZlcnNlLmJvbGQuaXRhbGljLmxpbWUgICAgICAgICB4XG4gICAgICBmYWxzZTogICAgICAoIHggKSAtPiBDT0xPUi5pbnZlcnNlLmJvbGQuaXRhbGljLkZBTkNZT1JBTkdFICB4XG4gICAgICB1bmRlZmluZWQ6ICAoIHggKSAtPiBDT0xPUi5pbnZlcnNlLmJvbGQuaXRhbGljLm1hZ2VudGEgICAgICB4XG4gICAgICBudWxsOiAgICAgICAoIHggKSAtPiBDT0xPUi5pbnZlcnNlLmJvbGQuaXRhbGljLmJsdWUgICAgICAgICB4XG4gICAgICBuYW46ICAgICAgICAoIHggKSAtPiBDT0xPUi5pbnZlcnNlLmJvbGQuaXRhbGljLm1hZ2VudGEgICAgICB4XG4gICAgICBvdGhlcjogICAgICAoIHggKSAtPiBDT0xPUi5pbnZlcnNlLnJlZCAgICAgICAgICAgICAgICAgICAgICB4XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHNob3cgICAgICAgICAgICA9IG5ldyBTaG93KClcbiAgICBzaG93X25vX2NvbG9ycyAgPSBuZXcgU2hvdyB7IGNvbG9yczogZmFsc2UsIH1cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW50ZXJuYWxzID0gT2JqZWN0LmZyZWV6ZSB7IGludGVybmFscy4uLiwgfVxuICAgIHJldHVybiBleHBvcnRzID0ge1xuICAgICAgU2hvdyxcbiAgICAgIHNob3csXG4gICAgICBzaG93X25vX2NvbG9ycyxcbiAgICAgIGludGVybmFscywgfVxuXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX3R5cGVfb2Y6IC0+XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIG9iamVjdF9wcm90b3R5cGUgID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHt9XG4gICAgcG9kX3Byb3RvdHlwZXMgICAgPSBPYmplY3QuZnJlZXplIFsgbnVsbCwgb2JqZWN0X3Byb3RvdHlwZSwgXVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcHJpbWl0aXZlX3R5cGVzICAgICA9IE9iamVjdC5mcmVlemUgW1xuICAgICAgJ251bGwnLCAndW5kZWZpbmVkJyxcbiAgICAgICdib29sZWFuJyxcbiAgICAgICdpbmZpbml0eScsICduYW4nLCAnZmxvYXQnLFxuICAgICAgJ3RleHQnLCAnc3ltYm9sJywgJ3JlZ2V4JyxcbiAgICAgIF1cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW50ZXJuYWxzICAgICAgICAgPSB7IG9iamVjdF9wcm90b3R5cGUsIHBvZF9wcm90b3R5cGVzLCBwcmltaXRpdmVfdHlwZXMsIH1cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHR5cGVfb2YgPSAoIHggKSAtPlxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgIyMjIFByaW1pdGl2ZXM6ICMjI1xuICAgICAgcmV0dXJuICdudWxsJyAgICAgICAgIGlmIHggaXMgbnVsbFxuICAgICAgcmV0dXJuICd1bmRlZmluZWQnICAgIGlmIHggaXMgdW5kZWZpbmVkXG4gICAgICByZXR1cm4gJ2luZmluaXR5JyAgICAgaWYgKCB4IGlzICtJbmZpbml0eSApIG9yICggeCBpcyAtSW5maW5pdHkgKVxuICAgICAgcmV0dXJuICdib29sZWFuJyAgICAgIGlmICggeCBpcyB0cnVlICkgb3IgKCB4IGlzIGZhbHNlIClcbiAgICAgICMgcmV0dXJuICd0cnVlJyAgICAgICAgIGlmICggeCBpcyB0cnVlIClcbiAgICAgICMgcmV0dXJuICdmYWxzZScgICAgICAgIGlmICggeCBpcyBmYWxzZSApXG4gICAgICByZXR1cm4gJ25hbicgICAgICAgICAgaWYgTnVtYmVyLmlzTmFOICAgICB4XG4gICAgICByZXR1cm4gJ2Zsb2F0JyAgICAgICAgaWYgTnVtYmVyLmlzRmluaXRlICB4XG4gICAgICAjIHJldHVybiAndW5zZXQnICAgICAgICBpZiB4IGlzIHVuc2V0XG4gICAgICByZXR1cm4gJ3BvZCcgICAgICAgICAgaWYgKCBPYmplY3QuZ2V0UHJvdG90eXBlT2YgeCApIGluIHBvZF9wcm90b3R5cGVzXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBzd2l0Y2gganN0eXBlb2YgPSB0eXBlb2YgeFxuICAgICAgICB3aGVuICdzdHJpbmcnICAgICAgICAgICAgICAgICAgICAgICB0aGVuIHJldHVybiAndGV4dCdcbiAgICAgICAgd2hlbiAnc3ltYm9sJyAgICAgICAgICAgICAgICAgICAgICAgdGhlbiByZXR1cm4gJ3N5bWJvbCdcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHJldHVybiAnbGlzdCcgICAgICAgICBpZiBBcnJheS5pc0FycmF5ICB4XG4gICAgICAjIyMgVEFJTlQgY29uc2lkZXIgdG8gcmV0dXJuIHguY29uc3RydWN0b3IubmFtZSAjIyNcbiAgICAgIHN3aXRjaCBtaWxsZXJ0eXBlID0gKCAoIE9iamVjdDo6dG9TdHJpbmcuY2FsbCB4ICkucmVwbGFjZSAvXlxcW29iamVjdCAoW15cXF1dKylcXF0kLywgJyQxJyApLnRvTG93ZXJDYXNlKClcbiAgICAgICAgd2hlbiAncmVnZXhwJyAgICAgICAgICAgICAgICAgICAgICAgdGhlbiByZXR1cm4gJ3JlZ2V4J1xuICAgICAgcmV0dXJuIG1pbGxlcnR5cGVcbiAgICAgICMgc3dpdGNoIG1pbGxlcnR5cGUgPSBPYmplY3Q6OnRvU3RyaW5nLmNhbGwgeFxuICAgICAgIyAgIHdoZW4gJ1tvYmplY3QgRnVuY3Rpb25dJyAgICAgICAgICAgIHRoZW4gcmV0dXJuICdmdW5jdGlvbidcbiAgICAgICMgICB3aGVuICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyAgICAgICB0aGVuIHJldHVybiAnYXN5bmNmdW5jdGlvbidcbiAgICAgICMgICB3aGVuICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScgICB0aGVuIHJldHVybiAnZ2VuZXJhdG9yZnVuY3Rpb24nXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpc19wcmltaXRpdmUgICAgICA9ICggeCAgICAgKSAtPiAoIHR5cGVfb2YgeCApICBpbiBwcmltaXRpdmVfdHlwZXNcbiAgICBpc19wcmltaXRpdmVfdHlwZSA9ICggdHlwZSAgKSAtPiB0eXBlICAgICAgICAgICBpbiBwcmltaXRpdmVfdHlwZXNcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW50ZXJuYWxzID0gT2JqZWN0LmZyZWV6ZSB7IGludGVybmFscy4uLiwgfVxuICAgIHJldHVybiBleHBvcnRzID0ge1xuICAgICAgdHlwZV9vZixcbiAgICAgIGlzX3ByaW1pdGl2ZSxcbiAgICAgIGlzX3ByaW1pdGl2ZV90eXBlLFxuICAgICAgaW50ZXJuYWxzLCB9XG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgQlJJQ1NcblxuXG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZW1vX3Nob3cgPSAtPlxuICBHVVkgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vZ3V5J1xuICB7IHJwciwgfSA9IEdVWS50cm1cbiAgeyBzaG93LFxuICAgIFNob3csIH0gPSBCUklDUy5yZXF1aXJlX3Nob3coKVxuICBkZWJ1ZyAnzqlfX18zJywgc2hvd1xuICBkZWJ1ZyAnzqlfX180Jywgc2hvdy5zdGF0ZVxuICBkZWJ1ZyAnzqlfX181Jywgc2hvdyBzaG93LmRlbnRcbiAgZGVidWcgJ86pX19fNicsIHNob3cuZ29fZG93bigpXG4gIGRlYnVnICfOqV9fXzcnLCBzaG93IHNob3cuZGVudFxuICBlY2hvKClcbiAgZWNobyAnzqlfX184JywgJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyAnzqlfX185Jywgc2hvdyB2XzEgPSBcImZvbyAnYmFyJ1wiXG4gIGVjaG8gJ86pX18xMCcsICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8gJ86pX18xMScsIHNob3cgdl8yID0ge31cbiAgZWNobyAnzqlfXzEyJywgJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyAnzqlfXzEzJywgc2hvdyB2XzMgPSB7IGtvbmc6IDEwOCwgbG93OiA5MjMsIG51bWJlcnM6IFsgMTAsIDExLCAxMiwgXSwgfVxuICBlY2hvICfOqV9fMTQnLCAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvICfOqV9fMTUnLCBzaG93IHZfNCA9IFtdXG4gIGVjaG8gJ86pX18xNicsICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8gJ86pX18xNycsIHNob3cgdl81ID0gWyAnc29tZScsICd3b3JkcycsICd0bycsICdzaG93JywgMSwgLTEsIGZhbHNlLCBdXG4gIGVjaG8gJ86pX18xOCcsICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8gJ86pX18xOScsIHNob3cgdl82ID0gbmV3IE1hcCBbIFsgJ2tvbmcnLCAxMDgsIF0sIFsgJ2xvdycsIDkyMywgXSwgWyA5NzEsICd3b3JkJywgXSwgWyB0cnVlLCAnKzEnLCBdLCBbICdhIGIgYycsIGZhbHNlLCBdIF1cbiAgZWNobyAnzqlfXzIwJywgJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyAnzqlfXzIxJywgc2hvdyB2XzcgPSBuZXcgU2V0IFsgJ3NvbWUnLCAnd29yZHMnLCB0cnVlLCBmYWxzZSwgbnVsbCwgdW5kZWZpbmVkLCAzLjE0MTU5MjYsIE5hTiwgXVxuICBlY2hvICfOqV9fMjInLCAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvICfOqV9fMjMnLCBzaG93IHZfOCA9IC9hYmNbZGVdL1xuICBlY2hvICfOqV9fMjQnLCAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvICfOqV9fMjUnLCBzaG93IHZfOSA9IEJ1ZmZlci5mcm9tICdhYmPDpMO2w7wnXG4gIGVjaG8gJ86pX18yNicsICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8gJ86pX18yNycsIHNob3cgdl8xMCA9IHsgdl8xLCB2XzIsIHZfMywgdl80LCB2XzUsIHZfNiwgdl83LCB2XzgsIHZfOSwgfSAjIHZfMTAsIHZfMTEsIHZfMTIsIHZfMTMsIHZfMTQsIH1cbiAgdl8xMC52XzEwID0gdl8xMFxuICBlY2hvICfOqV9fMjgnLCAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvICfOqV9fMjknLCBycHIgdl8xMFxuICBlY2hvICfOqV9fMzAnLCBzaG93IHZfMTAgPSB7IHZfMSwgdl8yLCB2XzMsIHZfNCwgdl81LCB2XzYsIHZfNywgdl84LCB2XzksIHZfMTAsIH0gIyB2XzEwLCB2XzExLCB2XzEyLCB2XzEzLCB2XzE0LCB9XG4gIGVjaG8gJ86pX18zMScsICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGEgPSBbICdhJywgXVxuICBiID0gWyAnYicsIGEsIF1cbiAgZWNobyAnzqlfXzMyJywgcnByICBiXG4gIGVjaG8gJ86pX18zMycsIHNob3cgYlxuICBlY2hvICfOqV9fMzQnLCAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBiLnB1c2ggYVxuICBlY2hvICfOqV9fMzUnLCBycHIgIGJcbiAgZWNobyAnzqlfXzM2Jywgc2hvdyBiXG4gIGVjaG8gJ86pX18zNycsICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGQgPSB7fVxuICBjID0geyBkLCB9XG4gIGQuYyA9IGNcbiAgZSA9IHsgZCwgYywgfVxuICBlY2hvICfOqV9fMzgnLCBycHIgY1xuICBlY2hvICfOqV9fMzknLCBycHIgZVxuICAjIGVjaG8gJ86pX180MCcsIHNob3cgYlxuICBlY2hvICfOqV9fNDEnLCAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvKClcbiAgcmV0dXJuIG51bGxcblxuIyBkZW1vX3Nob3coKVxuXG5cblxuIl19
//# sourceURL=../src/unstable-rpr-type_of.coffee