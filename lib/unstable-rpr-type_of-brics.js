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
      var Show, colors, exports, internals, is_primitive_type, isa_jsid, jsid_re, show, show_no_colors, strip_ansi, templates, type_of, write;
      //=======================================================================================================
      write = function(p) {
        return process.stdout.write(p);
      };
      // C                         = require '../../hengist-NG/node_modules/.pnpm/ansis@4.1.0/node_modules/ansis/index.cjs'
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
      // COLOR = new C.Ansis().extend
      //   aliceblue:                  '#f0f8ff'
      //   antiquewhite:               '#faebd7'
      //   aqua:                       '#00ffff'
      //   aquamarine:                 '#7fffd4'
      //   azure:                      '#f0ffff'
      //   beige:                      '#f5f5dc'
      //   bisque:                     '#ffe4c4'
      //   black:                      '#000000'
      //   blanchedalmond:             '#ffebcd'
      //   blue:                       '#0000ff'
      //   blueviolet:                 '#8a2be2'
      //   brown:                      '#a52a2a'
      //   burlywood:                  '#deb887'
      //   cadetblue:                  '#5f9ea0'
      //   chartreuse:                 '#7fff00'
      //   chocolate:                  '#d2691e'
      //   coral:                      '#ff7f50'
      //   cornflowerblue:             '#6495ed'
      //   cornsilk:                   '#fff8dc'
      //   crimson:                    '#dc143c'
      //   cyan:                       '#00ffff'
      //   darkblue:                   '#00008b'
      //   darkcyan:                   '#008b8b'
      //   darkgoldenrod:              '#b8860b'
      //   darkgray:                   '#a9a9a9'
      //   darkgreen:                  '#006400'
      //   darkkhaki:                  '#bdb76b'
      //   darkmagenta:                '#8b008b'
      //   darkolivegreen:             '#556b2f'
      //   darkorange:                 '#ff8c00'
      //   darkorchid:                 '#9932cc'
      //   darkred:                    '#8b0000'
      //   darksalmon:                 '#e9967a'
      //   darkseagreen:               '#8fbc8f'
      //   darkslateblue:              '#483d8b'
      //   darkslategray:              '#2f4f4f'
      //   darkturquoise:              '#00ced1'
      //   darkviolet:                 '#9400d3'
      //   deeppink:                   '#ff1493'
      //   deepskyblue:                '#00bfff'
      //   dimgray:                    '#696969'
      //   dodgerblue:                 '#1e90ff'
      //   firebrick:                  '#b22222'
      //   floralwhite:                '#fffaf0'
      //   forestgreen:                '#228b22'
      //   gainsboro:                  '#dcdcdc'
      //   ghostwhite:                 '#f8f8ff'
      //   gold:                       '#ffd700'
      //   goldenrod:                  '#daa520'
      //   gray:                       '#808080'
      //   green:                      '#008000'
      //   greenyellow:                '#adff2f'
      //   honeydew:                   '#f0fff0'
      //   hotpink:                    '#ff69b4'
      //   indianred:                  '#cd5c5c'
      //   indigo:                     '#4b0082'
      //   ivory:                      '#fffff0'
      //   khaki:                      '#f0e68c'
      //   lavender:                   '#e6e6fa'
      //   lavenderblush:              '#fff0f5'
      //   lawngreen:                  '#7cfc00'
      //   lemonchiffon:               '#fffacd'
      //   lightblue:                  '#add8e6'
      //   lightcoral:                 '#f08080'
      //   lightcyan:                  '#e0ffff'
      //   lightgoldenrodyellow:       '#fafad2'
      //   lightgray:                  '#d3d3d3'
      //   lightgreen:                 '#90ee90'
      //   lightpink:                  '#ffb6c1'
      //   lightsalmon:                '#ffa07a'
      //   lightseagreen:              '#20b2aa'
      //   lightskyblue:               '#87cefa'
      //   lightslategray:             '#778899'
      //   lightsteelblue:             '#b0c4de'
      //   lightyellow:                '#ffffe0'
      //   lime:                       '#00ff00'
      //   limegreen:                  '#32cd32'
      //   linen:                      '#faf0e6'
      //   magenta:                    '#ff00ff'
      //   maroon:                     '#800000'
      //   mediumaquamarine:           '#66cdaa'
      //   mediumblue:                 '#0000cd'
      //   mediumorchid:               '#ba55d3'
      //   mediumpurple:               '#9370db'
      //   mediumseagreen:             '#3cb371'
      //   mediumslateblue:            '#7b68ee'
      //   mediumspringgreen:          '#00fa9a'
      //   mediumturquoise:            '#48d1cc'
      //   mediumvioletred:            '#c71585'
      //   midnightblue:               '#191970'
      //   mintcream:                  '#f5fffa'
      //   mistyrose:                  '#ffe4e1'
      //   moccasin:                   '#ffe4b5'
      //   navajowhite:                '#ffdead'
      //   navy:                       '#000080'
      //   oldlace:                    '#fdf5e6'
      //   olive:                      '#808000'
      //   olivedrab:                  '#6b8e23'
      //   orange:                     '#ffa500'
      //   orangered:                  '#ff4500'
      //   orchid:                     '#da70d6'
      //   palegoldenrod:              '#eee8aa'
      //   palegreen:                  '#98fb98'
      //   paleturquoise:              '#afeeee'
      //   palevioletred:              '#db7093'
      //   papayawhip:                 '#ffefd5'
      //   peachpuff:                  '#ffdab9'
      //   peru:                       '#cd853f'
      //   pink:                       '#ffc0cb'
      //   plum:                       '#dda0dd'
      //   powderblue:                 '#b0e0e6'
      //   purple:                     '#800080'
      //   red:                        '#ff0000'
      //   rosybrown:                  '#bc8f8f'
      //   royalblue:                  '#4169e1'
      //   saddlebrown:                '#8b4513'
      //   salmon:                     '#fa8072'
      //   sandybrown:                 '#f4a460'
      //   seagreen:                   '#2e8b57'
      //   seashell:                   '#fff5ee'
      //   sienna:                     '#a0522d'
      //   silver:                     '#c0c0c0'
      //   skyblue:                    '#87ceeb'
      //   slateblue:                  '#6a5acd'
      //   slategray:                  '#708090'
      //   snow:                       '#fffafa'
      //   springgreen:                '#00ff7f'
      //   steelblue:                  '#4682b4'
      //   tan:                        '#d2b48c'
      //   teal:                       '#008080'
      //   thistle:                    '#d8bfd8'
      //   tomato:                     '#ff6347'
      //   turquoise:                  '#40e0d0'
      //   violet:                     '#ee82ee'
      //   wheat:                      '#f5deb3'
      //   white:                      '#ffffff'
      //   whitesmoke:                 '#f5f5f5'
      //   yellow:                     '#ffff00'
      //   yellowgreen:                '#9acd32'
      //   #.....................................................................................................
      //   FANCYRED:                   '#fd5230'
      //   FANCYORANGE:                '#fd6d30'
      //   # oomph: ( x ) -> debug 'Ω___2', x; return "~~~ #{x} ~~~"
      colors = {
        _key: function(x) {
          return x;
        },
        pod: function(x) {
          return x;
        },
        map: function(x) {
          return x;
        },
        list: function(x) {
          return x;
        },
        set: function(x) {
          return x;
        },
        text: function(x) {
          return x;
        },
        float: function(x) {
          return x;
        },
        regex: function(x) {
          return x;
        },
        true: function(x) {
          return x;
        },
        false: function(x) {
          return x;
        },
        undefined: function(x) {
          return x;
        },
        null: function(x) {
          return x;
        },
        nan: function(x) {
          return x;
        },
        other: function(x) {
          return x;
        }
      };
      // _key:       ( x ) -> COLOR.cyan                             x
      // pod:        ( x ) -> COLOR.gold                             x
      // map:        ( x ) -> COLOR.gold                             x
      // list:       ( x ) -> COLOR.gold                             x
      // set:        ( x ) -> COLOR.gold                             x
      // text:       ( x ) -> COLOR.wheat                            x
      // float:      ( x ) -> COLOR.FANCYRED                         x
      // regex:      ( x ) -> COLOR.plum                             x
      // true:       ( x ) -> COLOR.inverse.bold.italic.lime         x
      // false:      ( x ) -> COLOR.inverse.bold.italic.FANCYORANGE  x
      // undefined:  ( x ) -> COLOR.inverse.bold.italic.magenta      x
      // null:       ( x ) -> COLOR.inverse.bold.italic.blue         x
      // nan:        ( x ) -> COLOR.inverse.bold.italic.magenta      x
      // other:      ( x ) -> COLOR.inverse.red                      x

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLXJwci10eXBlX29mLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxJQUFBO0lBQUE7O0VBRUEsQ0FBQTtJQUFFLEtBQUY7SUFDRSxHQUFBLEVBQUs7RUFEUCxDQUFBLEdBQ2lCLE9BRGpCLEVBRkE7Ozs7O0VBU0EsS0FBQSxHQU1FLENBQUE7Ozs7SUFBQSxZQUFBLEVBQWMsUUFBQSxDQUFBLENBQUE7QUFFaEIsVUFBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxTQUFBLEVBQUEsaUJBQUEsRUFBQSxRQUFBLEVBQUEsT0FBQSxFQUFBLElBQUEsRUFBQSxjQUFBLEVBQUEsVUFBQSxFQUFBLFNBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQTs7TUFDSSxLQUFBLEdBQTRCLFFBQUEsQ0FBRSxDQUFGLENBQUE7ZUFBUyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQWYsQ0FBcUIsQ0FBckI7TUFBVCxFQURoQzs7TUFHSSxDQUFBLENBQUUsT0FBRixFQUNFLGlCQURGLENBQUEsR0FDNEIsS0FBSyxDQUFDLGVBQU4sQ0FBQSxDQUQ1QjtNQUVBLENBQUEsQ0FBRSxVQUFGLENBQUEsR0FBNEIsQ0FBRSxPQUFBLENBQVEsUUFBUixDQUFGLENBQW9CLENBQUMsa0JBQXJCLENBQUEsQ0FBNUIsRUFMSjs7Ozs7Ozs7TUFhSSxPQUFBLEdBQVk7TUFDWixRQUFBLEdBQVksUUFBQSxDQUFFLENBQUYsQ0FBQTtlQUFTLENBQUUsQ0FBRSxPQUFPLENBQVQsQ0FBQSxLQUFnQixRQUFsQixDQUFBLElBQWlDLE9BQU8sQ0FBQyxJQUFSLENBQWEsQ0FBYjtNQUExQyxFQWRoQjs7TUFnQkksU0FBQSxHQUNFO1FBQUEsSUFBQSxFQUNFO1VBQUEsV0FBQSxFQUFjLElBQWQ7VUFDQSxNQUFBLEVBQWM7UUFE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QUFLLElBQUEsR0FBTyxDQUFFLEdBQUYsRUFBTyxHQUFQLEVBQVksR0FBWixFQUFpQixHQUFqQixFQUFzQixHQUF0QixFQUEyQixHQUEzQixFQUFnQyxHQUFoQyxFQUFxQyxHQUFyQyxFQUEwQyxHQUExQyxFQUErQyxJQUEvQyxDQUFaLENBQWQsRUFqQ0Y7SUFrQ0UsSUFBQSxDQUFLLE9BQUwsRUFBYyxrRUFBZDtJQUNBLENBQUEsR0FBSSxDQUFFLEdBQUY7SUFDSixDQUFBLEdBQUksQ0FBRSxHQUFGLEVBQU8sQ0FBUDtJQUNKLElBQUEsQ0FBSyxPQUFMLEVBQWMsR0FBQSxDQUFLLENBQUwsQ0FBZDtJQUNBLElBQUEsQ0FBSyxPQUFMLEVBQWMsSUFBQSxDQUFLLENBQUwsQ0FBZDtJQUNBLElBQUEsQ0FBSyxPQUFMLEVBQWMsa0VBQWQ7SUFDQSxDQUFDLENBQUMsSUFBRixDQUFPLENBQVA7SUFDQSxJQUFBLENBQUssT0FBTCxFQUFjLEdBQUEsQ0FBSyxDQUFMLENBQWQ7SUFDQSxJQUFBLENBQUssT0FBTCxFQUFjLElBQUEsQ0FBSyxDQUFMLENBQWQ7SUFDQSxJQUFBLENBQUssT0FBTCxFQUFjLGtFQUFkO0lBQ0EsQ0FBQSxHQUFJLENBQUE7SUFDSixDQUFBLEdBQUksQ0FBRSxDQUFGO0lBQ0osQ0FBQyxDQUFDLENBQUYsR0FBTTtJQUNOLENBQUEsR0FBSSxDQUFFLENBQUYsRUFBSyxDQUFMO0lBQ0osSUFBQSxDQUFLLE9BQUwsRUFBYyxHQUFBLENBQUksQ0FBSixDQUFkO0lBQ0EsSUFBQSxDQUFLLE9BQUwsRUFBYyxHQUFBLENBQUksQ0FBSixDQUFkLEVBakRGOztJQW1ERSxJQUFBLENBQUssT0FBTCxFQUFjLGtFQUFkO0lBQ0EsSUFBQSxDQUFBO0FBQ0EsV0FBTztFQXRERzs7RUFyY1o7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG57IGRlYnVnLFxuICBsb2c6IGVjaG8sIH0gPSBjb25zb2xlXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkJSSUNTID1cblxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfc2hvdzogLT5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgd3JpdGUgICAgICAgICAgICAgICAgICAgICA9ICggcCApIC0+IHByb2Nlc3Muc3Rkb3V0LndyaXRlIHBcbiAgICAjIEMgICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi9oZW5naXN0LU5HL25vZGVfbW9kdWxlcy8ucG5wbS9hbnNpc0A0LjEuMC9ub2RlX21vZHVsZXMvYW5zaXMvaW5kZXguY2pzJ1xuICAgIHsgdHlwZV9vZixcbiAgICAgIGlzX3ByaW1pdGl2ZV90eXBlLCAgICB9ID0gQlJJQ1MucmVxdWlyZV90eXBlX29mKClcbiAgICB7IHN0cmlwX2Fuc2ksICAgICAgICAgICB9ID0gKCByZXF1aXJlICcuL21haW4nICkucmVxdWlyZV9zdHJpcF9hbnNpKClcbiAgICAjIHsgaGlkZSxcbiAgICAjICAgc2V0X2dldHRlciwgICB9ID0gKCByZXF1aXJlICcuL21haW4nICkucmVxdWlyZV9tYW5hZ2VkX3Byb3BlcnR5X3Rvb2xzKClcbiAgICAjIFNRTElURSAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpzcWxpdGUnXG4gICAgIyB7IGRlYnVnLCAgICAgICAgfSA9IGNvbnNvbGVcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgIyMjIHRoeCB0byBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL2lkZW50aWZpZXItcmVnZXggIyMjXG4gICAganNpZF9yZSAgID0gLy8vXiBbICQgXyBcXHB7SURfU3RhcnR9IF0gWyAkIF8gXFx1MjAwQyBcXHUyMDBEIFxccHtJRF9Db250aW51ZX0gXSogJC8vL3ZcbiAgICBpc2FfanNpZCAgPSAoIHggKSAtPiAoICggdHlwZW9mIHggKSBpcyAnc3RyaW5nJyApIGFuZCBqc2lkX3JlLnRlc3QgeFxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgdGVtcGxhdGVzID1cbiAgICAgIHNob3c6XG4gICAgICAgIGluZGVudGF0aW9uOiAgbnVsbFxuICAgICAgICBjb2xvcnM6ICAgICAgIHRydWVcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW50ZXJuYWxzID0geyBqc2lkX3JlLCBpc2FfanNpZCwgdGVtcGxhdGVzLCB9XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIFNob3dcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKCBjZmcgKSAtPlxuICAgICAgICBtZSA9ICggeCApID0+XG4gICAgICAgICAgUiA9ICggdGV4dCBmb3IgdGV4dCBmcm9tIEBwZW4geCApLmpvaW4gJydcbiAgICAgICAgICAjIyMgVEFJTlQgYXZvaWQgdG8gYWRkIGNvbG9ycyBpbnN0ZWFkICMjI1xuICAgICAgICAgIFIgPSBzdHJpcF9hbnNpIFIgaWYgQGNmZy5jb2xvcnMgaXMgZmFsc2VcbiAgICAgICAgICByZXR1cm4gUlxuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YgbWUsIEBcbiAgICAgICAgQGNmZyAgICA9IHsgdGVtcGxhdGVzLnNob3cuLi4sIGNmZy4uLiwgfVxuICAgICAgICBAc3RhdGUgID0geyBsZXZlbDogMCwgZW5kZWRfd2l0aF9ubDogZmFsc2UsIHNlZW46ICggbmV3IFNldCgpICksIH1cbiAgICAgICAgQHNwYWNlciA9ICdcXHgyMFxceDIwJ1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgQCwgJ2RlbnQnLFxuICAgICAgICAgIGdldDogPT4gQHNwYWNlci5yZXBlYXQgQHN0YXRlLmxldmVsXG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHBlbjogKCB4ICkgLT5cbiAgICAgICAgQHN0YXRlLnNlZW4uY2xlYXIoKVxuICAgICAgICBmb3IgdGV4dCBmcm9tIEBkaXNwYXRjaCB4XG4gICAgICAgICAgQHN0YXRlLmVuZGVkX3dpdGhfbmwgPSB0ZXh0LmVuZHNXaXRoICdcXG4nXG4gICAgICAgICAgeWllbGQgdGV4dFxuICAgICAgICB1bmxlc3MgQHN0YXRlLmVuZGVkX3dpdGhfbmxcbiAgICAgICAgICBAc3RhdGUuZW5kZWRfd2l0aF9ubCA9IHRydWVcbiAgICAgICAgICAjIHlpZWxkICdcXG4nXG4gICAgICAgIEBzdGF0ZS5zZWVuLmNsZWFyKClcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBnb19kb3duOiAtPlxuICAgICAgICBAc3RhdGUubGV2ZWwrK1xuICAgICAgICByZXR1cm4gQHN0YXRlLmxldmVsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZ29fdXA6IC0+XG4gICAgICAgIGlmIEBzdGF0ZS5sZXZlbCA8IDFcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzEgdW5hYmxlIHRvIGdvIGJlbG93IGxldmVsIDBcIlxuICAgICAgICBAc3RhdGUubGV2ZWwtLVxuICAgICAgICByZXR1cm4gQHN0YXRlLmxldmVsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZGlzcGF0Y2g6ICggeCApIC0+XG4gICAgICAgIHR5cGUgICAgICAgID0gdHlwZV9vZiB4XG4gICAgICAgIGlzX2NpcmN1bGFyID0gZmFsc2VcbiAgICAgICAgaWYgKCBub3QgaXNfcHJpbWl0aXZlX3R5cGUgdHlwZSApXG4gICAgICAgICAgaWYgQHN0YXRlLnNlZW4uaGFzIHhcbiAgICAgICAgICAgICMgZGVidWcgJ15eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl4nLCBcInNlZW5cIiwgdHlwZVxuICAgICAgICAgICAgIyBudWxsXG4gICAgICAgICAgICBpc19jaXJjdWxhciA9IHRydWVcbiAgICAgICAgICAgIHlpZWxkICcoQ0lSQ1VMQVIpJ1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgQHN0YXRlLnNlZW4uYWRkIHhcbiAgICAgICAgIyB1bmxlc3MgaXNfY2lyY3VsYXJcbiAgICAgICAgaWYgKCBtZXRob2QgPSBAWyBcInNob3dfI3t0eXBlfVwiIF0gKT9cbiAgICAgICAgICB5aWVsZCBmcm9tIG1ldGhvZC5jYWxsIEAsIHhcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHlpZWxkIGZyb20gQHNob3dfb3RoZXIgeFxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9zaG93X2tleTogKCBrZXkgKSAtPlxuICAgICAgICBpZiBpc2FfanNpZCBrZXkgdGhlbiByZXR1cm4gY29sb3JzLl9rZXkga2V5XG4gICAgICAgIHJldHVybiBbICggdCBmb3IgdCBmcm9tIEBkaXNwYXRjaCBrZXkgKS4uLiwgXS5qb2luICcnXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2hvd19wb2Q6ICggeCApIC0+XG4gICAgICAgIGhhc19rZXlzID0gZmFsc2VcbiAgICAgICAgeWllbGQgY29sb3JzLnBvZCAneydcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmb3Iga2V5LCB2YWx1ZSBvZiB4XG4gICAgICAgICAgIyMjIFRBSU5UIGNvZGUgZHVwbGljYXRpb24gIyMjXG4gICAgICAgICAgaGFzX2tleXMgPSB0cnVlXG4gICAgICAgICAgeWllbGQgJyAnICsgKCBAX3Nob3dfa2V5IGtleSApICsgY29sb3JzLnBvZCAnOiAnXG4gICAgICAgICAgZm9yIHRleHQgZnJvbSBAZGlzcGF0Y2ggdmFsdWVcbiAgICAgICAgICAgIHlpZWxkIHRleHRcbiAgICAgICAgICB5aWVsZCBjb2xvcnMucG9kICcsJ1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHlpZWxkIGNvbG9ycy5wb2QgaWYgKCBub3QgaGFzX2tleXMgKSB0aGVuICd9JyBlbHNlICcgfSdcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzaG93X21hcDogKCB4ICkgLT5cbiAgICAgICAgaGFzX2tleXMgPSBmYWxzZVxuICAgICAgICB5aWVsZCBjb2xvcnMubWFwICdtYXB7J1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZvciBbIGtleSwgdmFsdWUsIF0gZnJvbSB4LmVudHJpZXMoKVxuICAgICAgICAgICMjIyBUQUlOVCBjb2RlIGR1cGxpY2F0aW9uICMjI1xuICAgICAgICAgIGhhc19rZXlzID0gdHJ1ZVxuICAgICAgICAgIHlpZWxkICcgJyArICggQF9zaG93X2tleSBrZXkgKSArIGNvbG9ycy5tYXAgJzogJ1xuICAgICAgICAgIGZvciB0ZXh0IGZyb20gQGRpc3BhdGNoIHZhbHVlXG4gICAgICAgICAgICB5aWVsZCB0ZXh0XG4gICAgICAgICAgeWllbGQgY29sb3JzLm1hcCAnLCdcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB5aWVsZCBjb2xvcnMubWFwIGlmICggbm90IGhhc19rZXlzICkgdGhlbiAnfScgZWxzZSAnIH0nXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2hvd19saXN0OiAoIHggKSAtPlxuICAgICAgICBSID0gJydcbiAgICAgICAgUiArPSBjb2xvcnMubGlzdCAnWydcbiAgICAgICAgZm9yIGVsZW1lbnQgaW4geFxuICAgICAgICAgICMjIyBUQUlOVCBjb2RlIGR1cGxpY2F0aW9uICMjI1xuICAgICAgICAgIGZvciB0ZXh0IGZyb20gQGRpc3BhdGNoIGVsZW1lbnRcbiAgICAgICAgICAgIFIgKz0gJyAnICsgdGV4dCArICggY29sb3JzLmxpc3QgJywnIClcbiAgICAgICAgUiArPSBjb2xvcnMubGlzdCBpZiAoIHgubGVuZ3RoIGlzIDAgKSB0aGVuICddJyBlbHNlICcgXSdcbiAgICAgICAgeWllbGQgUlxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNob3dfc2V0OiAoIHggKSAtPlxuICAgICAgICB5aWVsZCBjb2xvcnMuc2V0ICdzZXRbJ1xuICAgICAgICBmb3IgZWxlbWVudCBmcm9tIHgua2V5cygpXG4gICAgICAgICAgIyMjIFRBSU5UIGNvZGUgZHVwbGljYXRpb24gIyMjXG4gICAgICAgICAgZm9yIHRleHQgZnJvbSBAZGlzcGF0Y2ggZWxlbWVudFxuICAgICAgICAgICAgeWllbGQgJyAnICsgdGV4dCArIGNvbG9ycy5zZXQgJywnXG4gICAgICAgIHlpZWxkIGNvbG9ycy5zZXQgaWYgKCB4Lmxlbmd0aCBpcyAwICkgdGhlbiAnXScgZWxzZSAnIF0nXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2hvd190ZXh0OiAoIHggKSAtPlxuICAgICAgICBpZiBcIidcIiBpbiB4IHRoZW4gIHlpZWxkIGNvbG9ycy50ZXh0ICdcIicgKyAoIHgucmVwbGFjZSAvXCIvZywgJ1xcXFxcIicgKSArICdcIidcbiAgICAgICAgZWxzZSAgICAgICAgICAgICAgeWllbGQgY29sb3JzLnRleHQgXCInXCIgKyAoIHgucmVwbGFjZSAvJy9nLCBcIlxcXFwnXCIgKSArIFwiJ1wiXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2hvd19mbG9hdDogKCB4ICkgLT5cbiAgICAgICAgeWllbGQgKCBjb2xvcnMuZmxvYXQgeC50b1N0cmluZygpIClcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzaG93X3JlZ2V4OiAoIHggKSAtPlxuICAgICAgICB5aWVsZCAoIGNvbG9ycy5yZWdleCB4LnRvU3RyaW5nKCkgKVxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICMjIyBmdWxsIHdvcmRzOiAjIyNcbiAgICAgICMgc2hvd190cnVlOiAgICAgICggeCApIC0+IHlpZWxkICggY29sb3JzLnRydWUgICAgICAndHJ1ZScgICAgICApXG4gICAgICAjIHNob3dfZmFsc2U6ICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy5mYWxzZSAgICAgJ2ZhbHNlJyAgICAgKVxuICAgICAgIyBzaG93X3VuZGVmaW5lZDogKCB4ICkgLT4geWllbGQgKCBjb2xvcnMudW5kZWZpbmVkICd1bmRlZmluZWQnIClcbiAgICAgICMgc2hvd19udWxsOiAgICAgICggeCApIC0+IHlpZWxkICggY29sb3JzLm51bGwgICAgICAnbnVsbCcgICAgICApXG4gICAgICAjIHNob3dfbmFuOiAgICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy5uYW4gICAgICAgJ05hTicgICAgICAgKVxuICAgICAgIyMjIChtb3N0bHkpIHNpbmdsZSBsZXR0ZXJzOiAjIyNcbiAgICAgIHNob3dfdHJ1ZTogICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy50cnVlICAgICAgJyBUICcgICAgIClcbiAgICAgIHNob3dfZmFsc2U6ICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy5mYWxzZSAgICAgJyBGICcgICAgIClcbiAgICAgIHNob3dfdW5kZWZpbmVkOiAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy51bmRlZmluZWQgJyBVICcgICAgIClcbiAgICAgIHNob3dfbnVsbDogICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy5udWxsICAgICAgJyBOICcgICAgIClcbiAgICAgIHNob3dfbmFuOiAgICAgICAoIHggKSAtPiB5aWVsZCAoIGNvbG9ycy5uYW4gICAgICAgJyBOYU4gJyAgIClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzaG93X290aGVyOiAoIHggKSAtPlxuICAgICAgICAjIHlpZWxkICdcXG4nIHVubGVzcyBAc3RhdGUuZW5kZWRfd2l0aF9ubFxuICAgICAgICB5aWVsZCBjb2xvcnMub3RoZXIgXCIje3h9XCJcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgIyBDT0xPUiA9IG5ldyBDLkFuc2lzKCkuZXh0ZW5kXG4gICAgIyAgIGFsaWNlYmx1ZTogICAgICAgICAgICAgICAgICAnI2YwZjhmZidcbiAgICAjICAgYW50aXF1ZXdoaXRlOiAgICAgICAgICAgICAgICcjZmFlYmQ3J1xuICAgICMgICBhcXVhOiAgICAgICAgICAgICAgICAgICAgICAgJyMwMGZmZmYnXG4gICAgIyAgIGFxdWFtYXJpbmU6ICAgICAgICAgICAgICAgICAnIzdmZmZkNCdcbiAgICAjICAgYXp1cmU6ICAgICAgICAgICAgICAgICAgICAgICcjZjBmZmZmJ1xuICAgICMgICBiZWlnZTogICAgICAgICAgICAgICAgICAgICAgJyNmNWY1ZGMnXG4gICAgIyAgIGJpc3F1ZTogICAgICAgICAgICAgICAgICAgICAnI2ZmZTRjNCdcbiAgICAjICAgYmxhY2s6ICAgICAgICAgICAgICAgICAgICAgICcjMDAwMDAwJ1xuICAgICMgICBibGFuY2hlZGFsbW9uZDogICAgICAgICAgICAgJyNmZmViY2QnXG4gICAgIyAgIGJsdWU6ICAgICAgICAgICAgICAgICAgICAgICAnIzAwMDBmZidcbiAgICAjICAgYmx1ZXZpb2xldDogICAgICAgICAgICAgICAgICcjOGEyYmUyJ1xuICAgICMgICBicm93bjogICAgICAgICAgICAgICAgICAgICAgJyNhNTJhMmEnXG4gICAgIyAgIGJ1cmx5d29vZDogICAgICAgICAgICAgICAgICAnI2RlYjg4NydcbiAgICAjICAgY2FkZXRibHVlOiAgICAgICAgICAgICAgICAgICcjNWY5ZWEwJ1xuICAgICMgICBjaGFydHJldXNlOiAgICAgICAgICAgICAgICAgJyM3ZmZmMDAnXG4gICAgIyAgIGNob2NvbGF0ZTogICAgICAgICAgICAgICAgICAnI2QyNjkxZSdcbiAgICAjICAgY29yYWw6ICAgICAgICAgICAgICAgICAgICAgICcjZmY3ZjUwJ1xuICAgICMgICBjb3JuZmxvd2VyYmx1ZTogICAgICAgICAgICAgJyM2NDk1ZWQnXG4gICAgIyAgIGNvcm5zaWxrOiAgICAgICAgICAgICAgICAgICAnI2ZmZjhkYydcbiAgICAjICAgY3JpbXNvbjogICAgICAgICAgICAgICAgICAgICcjZGMxNDNjJ1xuICAgICMgICBjeWFuOiAgICAgICAgICAgICAgICAgICAgICAgJyMwMGZmZmYnXG4gICAgIyAgIGRhcmtibHVlOiAgICAgICAgICAgICAgICAgICAnIzAwMDA4YidcbiAgICAjICAgZGFya2N5YW46ICAgICAgICAgICAgICAgICAgICcjMDA4YjhiJ1xuICAgICMgICBkYXJrZ29sZGVucm9kOiAgICAgICAgICAgICAgJyNiODg2MGInXG4gICAgIyAgIGRhcmtncmF5OiAgICAgICAgICAgICAgICAgICAnI2E5YTlhOSdcbiAgICAjICAgZGFya2dyZWVuOiAgICAgICAgICAgICAgICAgICcjMDA2NDAwJ1xuICAgICMgICBkYXJra2hha2k6ICAgICAgICAgICAgICAgICAgJyNiZGI3NmInXG4gICAgIyAgIGRhcmttYWdlbnRhOiAgICAgICAgICAgICAgICAnIzhiMDA4YidcbiAgICAjICAgZGFya29saXZlZ3JlZW46ICAgICAgICAgICAgICcjNTU2YjJmJ1xuICAgICMgICBkYXJrb3JhbmdlOiAgICAgICAgICAgICAgICAgJyNmZjhjMDAnXG4gICAgIyAgIGRhcmtvcmNoaWQ6ICAgICAgICAgICAgICAgICAnIzk5MzJjYydcbiAgICAjICAgZGFya3JlZDogICAgICAgICAgICAgICAgICAgICcjOGIwMDAwJ1xuICAgICMgICBkYXJrc2FsbW9uOiAgICAgICAgICAgICAgICAgJyNlOTk2N2EnXG4gICAgIyAgIGRhcmtzZWFncmVlbjogICAgICAgICAgICAgICAnIzhmYmM4ZidcbiAgICAjICAgZGFya3NsYXRlYmx1ZTogICAgICAgICAgICAgICcjNDgzZDhiJ1xuICAgICMgICBkYXJrc2xhdGVncmF5OiAgICAgICAgICAgICAgJyMyZjRmNGYnXG4gICAgIyAgIGRhcmt0dXJxdW9pc2U6ICAgICAgICAgICAgICAnIzAwY2VkMSdcbiAgICAjICAgZGFya3Zpb2xldDogICAgICAgICAgICAgICAgICcjOTQwMGQzJ1xuICAgICMgICBkZWVwcGluazogICAgICAgICAgICAgICAgICAgJyNmZjE0OTMnXG4gICAgIyAgIGRlZXBza3libHVlOiAgICAgICAgICAgICAgICAnIzAwYmZmZidcbiAgICAjICAgZGltZ3JheTogICAgICAgICAgICAgICAgICAgICcjNjk2OTY5J1xuICAgICMgICBkb2RnZXJibHVlOiAgICAgICAgICAgICAgICAgJyMxZTkwZmYnXG4gICAgIyAgIGZpcmVicmljazogICAgICAgICAgICAgICAgICAnI2IyMjIyMidcbiAgICAjICAgZmxvcmFsd2hpdGU6ICAgICAgICAgICAgICAgICcjZmZmYWYwJ1xuICAgICMgICBmb3Jlc3RncmVlbjogICAgICAgICAgICAgICAgJyMyMjhiMjInXG4gICAgIyAgIGdhaW5zYm9ybzogICAgICAgICAgICAgICAgICAnI2RjZGNkYydcbiAgICAjICAgZ2hvc3R3aGl0ZTogICAgICAgICAgICAgICAgICcjZjhmOGZmJ1xuICAgICMgICBnb2xkOiAgICAgICAgICAgICAgICAgICAgICAgJyNmZmQ3MDAnXG4gICAgIyAgIGdvbGRlbnJvZDogICAgICAgICAgICAgICAgICAnI2RhYTUyMCdcbiAgICAjICAgZ3JheTogICAgICAgICAgICAgICAgICAgICAgICcjODA4MDgwJ1xuICAgICMgICBncmVlbjogICAgICAgICAgICAgICAgICAgICAgJyMwMDgwMDAnXG4gICAgIyAgIGdyZWVueWVsbG93OiAgICAgICAgICAgICAgICAnI2FkZmYyZidcbiAgICAjICAgaG9uZXlkZXc6ICAgICAgICAgICAgICAgICAgICcjZjBmZmYwJ1xuICAgICMgICBob3RwaW5rOiAgICAgICAgICAgICAgICAgICAgJyNmZjY5YjQnXG4gICAgIyAgIGluZGlhbnJlZDogICAgICAgICAgICAgICAgICAnI2NkNWM1YydcbiAgICAjICAgaW5kaWdvOiAgICAgICAgICAgICAgICAgICAgICcjNGIwMDgyJ1xuICAgICMgICBpdm9yeTogICAgICAgICAgICAgICAgICAgICAgJyNmZmZmZjAnXG4gICAgIyAgIGtoYWtpOiAgICAgICAgICAgICAgICAgICAgICAnI2YwZTY4YydcbiAgICAjICAgbGF2ZW5kZXI6ICAgICAgICAgICAgICAgICAgICcjZTZlNmZhJ1xuICAgICMgICBsYXZlbmRlcmJsdXNoOiAgICAgICAgICAgICAgJyNmZmYwZjUnXG4gICAgIyAgIGxhd25ncmVlbjogICAgICAgICAgICAgICAgICAnIzdjZmMwMCdcbiAgICAjICAgbGVtb25jaGlmZm9uOiAgICAgICAgICAgICAgICcjZmZmYWNkJ1xuICAgICMgICBsaWdodGJsdWU6ICAgICAgICAgICAgICAgICAgJyNhZGQ4ZTYnXG4gICAgIyAgIGxpZ2h0Y29yYWw6ICAgICAgICAgICAgICAgICAnI2YwODA4MCdcbiAgICAjICAgbGlnaHRjeWFuOiAgICAgICAgICAgICAgICAgICcjZTBmZmZmJ1xuICAgICMgICBsaWdodGdvbGRlbnJvZHllbGxvdzogICAgICAgJyNmYWZhZDInXG4gICAgIyAgIGxpZ2h0Z3JheTogICAgICAgICAgICAgICAgICAnI2QzZDNkMydcbiAgICAjICAgbGlnaHRncmVlbjogICAgICAgICAgICAgICAgICcjOTBlZTkwJ1xuICAgICMgICBsaWdodHBpbms6ICAgICAgICAgICAgICAgICAgJyNmZmI2YzEnXG4gICAgIyAgIGxpZ2h0c2FsbW9uOiAgICAgICAgICAgICAgICAnI2ZmYTA3YSdcbiAgICAjICAgbGlnaHRzZWFncmVlbjogICAgICAgICAgICAgICcjMjBiMmFhJ1xuICAgICMgICBsaWdodHNreWJsdWU6ICAgICAgICAgICAgICAgJyM4N2NlZmEnXG4gICAgIyAgIGxpZ2h0c2xhdGVncmF5OiAgICAgICAgICAgICAnIzc3ODg5OSdcbiAgICAjICAgbGlnaHRzdGVlbGJsdWU6ICAgICAgICAgICAgICcjYjBjNGRlJ1xuICAgICMgICBsaWdodHllbGxvdzogICAgICAgICAgICAgICAgJyNmZmZmZTAnXG4gICAgIyAgIGxpbWU6ICAgICAgICAgICAgICAgICAgICAgICAnIzAwZmYwMCdcbiAgICAjICAgbGltZWdyZWVuOiAgICAgICAgICAgICAgICAgICcjMzJjZDMyJ1xuICAgICMgICBsaW5lbjogICAgICAgICAgICAgICAgICAgICAgJyNmYWYwZTYnXG4gICAgIyAgIG1hZ2VudGE6ICAgICAgICAgICAgICAgICAgICAnI2ZmMDBmZidcbiAgICAjICAgbWFyb29uOiAgICAgICAgICAgICAgICAgICAgICcjODAwMDAwJ1xuICAgICMgICBtZWRpdW1hcXVhbWFyaW5lOiAgICAgICAgICAgJyM2NmNkYWEnXG4gICAgIyAgIG1lZGl1bWJsdWU6ICAgICAgICAgICAgICAgICAnIzAwMDBjZCdcbiAgICAjICAgbWVkaXVtb3JjaGlkOiAgICAgICAgICAgICAgICcjYmE1NWQzJ1xuICAgICMgICBtZWRpdW1wdXJwbGU6ICAgICAgICAgICAgICAgJyM5MzcwZGInXG4gICAgIyAgIG1lZGl1bXNlYWdyZWVuOiAgICAgICAgICAgICAnIzNjYjM3MSdcbiAgICAjICAgbWVkaXVtc2xhdGVibHVlOiAgICAgICAgICAgICcjN2I2OGVlJ1xuICAgICMgICBtZWRpdW1zcHJpbmdncmVlbjogICAgICAgICAgJyMwMGZhOWEnXG4gICAgIyAgIG1lZGl1bXR1cnF1b2lzZTogICAgICAgICAgICAnIzQ4ZDFjYydcbiAgICAjICAgbWVkaXVtdmlvbGV0cmVkOiAgICAgICAgICAgICcjYzcxNTg1J1xuICAgICMgICBtaWRuaWdodGJsdWU6ICAgICAgICAgICAgICAgJyMxOTE5NzAnXG4gICAgIyAgIG1pbnRjcmVhbTogICAgICAgICAgICAgICAgICAnI2Y1ZmZmYSdcbiAgICAjICAgbWlzdHlyb3NlOiAgICAgICAgICAgICAgICAgICcjZmZlNGUxJ1xuICAgICMgICBtb2NjYXNpbjogICAgICAgICAgICAgICAgICAgJyNmZmU0YjUnXG4gICAgIyAgIG5hdmFqb3doaXRlOiAgICAgICAgICAgICAgICAnI2ZmZGVhZCdcbiAgICAjICAgbmF2eTogICAgICAgICAgICAgICAgICAgICAgICcjMDAwMDgwJ1xuICAgICMgICBvbGRsYWNlOiAgICAgICAgICAgICAgICAgICAgJyNmZGY1ZTYnXG4gICAgIyAgIG9saXZlOiAgICAgICAgICAgICAgICAgICAgICAnIzgwODAwMCdcbiAgICAjICAgb2xpdmVkcmFiOiAgICAgICAgICAgICAgICAgICcjNmI4ZTIzJ1xuICAgICMgICBvcmFuZ2U6ICAgICAgICAgICAgICAgICAgICAgJyNmZmE1MDAnXG4gICAgIyAgIG9yYW5nZXJlZDogICAgICAgICAgICAgICAgICAnI2ZmNDUwMCdcbiAgICAjICAgb3JjaGlkOiAgICAgICAgICAgICAgICAgICAgICcjZGE3MGQ2J1xuICAgICMgICBwYWxlZ29sZGVucm9kOiAgICAgICAgICAgICAgJyNlZWU4YWEnXG4gICAgIyAgIHBhbGVncmVlbjogICAgICAgICAgICAgICAgICAnIzk4ZmI5OCdcbiAgICAjICAgcGFsZXR1cnF1b2lzZTogICAgICAgICAgICAgICcjYWZlZWVlJ1xuICAgICMgICBwYWxldmlvbGV0cmVkOiAgICAgICAgICAgICAgJyNkYjcwOTMnXG4gICAgIyAgIHBhcGF5YXdoaXA6ICAgICAgICAgICAgICAgICAnI2ZmZWZkNSdcbiAgICAjICAgcGVhY2hwdWZmOiAgICAgICAgICAgICAgICAgICcjZmZkYWI5J1xuICAgICMgICBwZXJ1OiAgICAgICAgICAgICAgICAgICAgICAgJyNjZDg1M2YnXG4gICAgIyAgIHBpbms6ICAgICAgICAgICAgICAgICAgICAgICAnI2ZmYzBjYidcbiAgICAjICAgcGx1bTogICAgICAgICAgICAgICAgICAgICAgICcjZGRhMGRkJ1xuICAgICMgICBwb3dkZXJibHVlOiAgICAgICAgICAgICAgICAgJyNiMGUwZTYnXG4gICAgIyAgIHB1cnBsZTogICAgICAgICAgICAgICAgICAgICAnIzgwMDA4MCdcbiAgICAjICAgcmVkOiAgICAgICAgICAgICAgICAgICAgICAgICcjZmYwMDAwJ1xuICAgICMgICByb3N5YnJvd246ICAgICAgICAgICAgICAgICAgJyNiYzhmOGYnXG4gICAgIyAgIHJveWFsYmx1ZTogICAgICAgICAgICAgICAgICAnIzQxNjllMSdcbiAgICAjICAgc2FkZGxlYnJvd246ICAgICAgICAgICAgICAgICcjOGI0NTEzJ1xuICAgICMgICBzYWxtb246ICAgICAgICAgICAgICAgICAgICAgJyNmYTgwNzInXG4gICAgIyAgIHNhbmR5YnJvd246ICAgICAgICAgICAgICAgICAnI2Y0YTQ2MCdcbiAgICAjICAgc2VhZ3JlZW46ICAgICAgICAgICAgICAgICAgICcjMmU4YjU3J1xuICAgICMgICBzZWFzaGVsbDogICAgICAgICAgICAgICAgICAgJyNmZmY1ZWUnXG4gICAgIyAgIHNpZW5uYTogICAgICAgICAgICAgICAgICAgICAnI2EwNTIyZCdcbiAgICAjICAgc2lsdmVyOiAgICAgICAgICAgICAgICAgICAgICcjYzBjMGMwJ1xuICAgICMgICBza3libHVlOiAgICAgICAgICAgICAgICAgICAgJyM4N2NlZWInXG4gICAgIyAgIHNsYXRlYmx1ZTogICAgICAgICAgICAgICAgICAnIzZhNWFjZCdcbiAgICAjICAgc2xhdGVncmF5OiAgICAgICAgICAgICAgICAgICcjNzA4MDkwJ1xuICAgICMgICBzbm93OiAgICAgICAgICAgICAgICAgICAgICAgJyNmZmZhZmEnXG4gICAgIyAgIHNwcmluZ2dyZWVuOiAgICAgICAgICAgICAgICAnIzAwZmY3ZidcbiAgICAjICAgc3RlZWxibHVlOiAgICAgICAgICAgICAgICAgICcjNDY4MmI0J1xuICAgICMgICB0YW46ICAgICAgICAgICAgICAgICAgICAgICAgJyNkMmI0OGMnXG4gICAgIyAgIHRlYWw6ICAgICAgICAgICAgICAgICAgICAgICAnIzAwODA4MCdcbiAgICAjICAgdGhpc3RsZTogICAgICAgICAgICAgICAgICAgICcjZDhiZmQ4J1xuICAgICMgICB0b21hdG86ICAgICAgICAgICAgICAgICAgICAgJyNmZjYzNDcnXG4gICAgIyAgIHR1cnF1b2lzZTogICAgICAgICAgICAgICAgICAnIzQwZTBkMCdcbiAgICAjICAgdmlvbGV0OiAgICAgICAgICAgICAgICAgICAgICcjZWU4MmVlJ1xuICAgICMgICB3aGVhdDogICAgICAgICAgICAgICAgICAgICAgJyNmNWRlYjMnXG4gICAgIyAgIHdoaXRlOiAgICAgICAgICAgICAgICAgICAgICAnI2ZmZmZmZidcbiAgICAjICAgd2hpdGVzbW9rZTogICAgICAgICAgICAgICAgICcjZjVmNWY1J1xuICAgICMgICB5ZWxsb3c6ICAgICAgICAgICAgICAgICAgICAgJyNmZmZmMDAnXG4gICAgIyAgIHllbGxvd2dyZWVuOiAgICAgICAgICAgICAgICAnIzlhY2QzMidcbiAgICAjICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgIyAgIEZBTkNZUkVEOiAgICAgICAgICAgICAgICAgICAnI2ZkNTIzMCdcbiAgICAjICAgRkFOQ1lPUkFOR0U6ICAgICAgICAgICAgICAgICcjZmQ2ZDMwJ1xuICAgICMgICAjIG9vbXBoOiAoIHggKSAtPiBkZWJ1ZyAnzqlfX18yJywgeDsgcmV0dXJuIFwifn5+ICN7eH0gfn5+XCJcblxuICAgIGNvbG9ycyA9XG4gICAgICBfa2V5OiAgICAgICAoIHggKSAtPiB4XG4gICAgICBwb2Q6ICAgICAgICAoIHggKSAtPiB4XG4gICAgICBtYXA6ICAgICAgICAoIHggKSAtPiB4XG4gICAgICBsaXN0OiAgICAgICAoIHggKSAtPiB4XG4gICAgICBzZXQ6ICAgICAgICAoIHggKSAtPiB4XG4gICAgICB0ZXh0OiAgICAgICAoIHggKSAtPiB4XG4gICAgICBmbG9hdDogICAgICAoIHggKSAtPiB4XG4gICAgICByZWdleDogICAgICAoIHggKSAtPiB4XG4gICAgICB0cnVlOiAgICAgICAoIHggKSAtPiB4XG4gICAgICBmYWxzZTogICAgICAoIHggKSAtPiB4XG4gICAgICB1bmRlZmluZWQ6ICAoIHggKSAtPiB4XG4gICAgICBudWxsOiAgICAgICAoIHggKSAtPiB4XG4gICAgICBuYW46ICAgICAgICAoIHggKSAtPiB4XG4gICAgICBvdGhlcjogICAgICAoIHggKSAtPiB4XG4gICAgICAjIF9rZXk6ICAgICAgICggeCApIC0+IENPTE9SLmN5YW4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhcbiAgICAgICMgcG9kOiAgICAgICAgKCB4ICkgLT4gQ09MT1IuZ29sZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgIyBtYXA6ICAgICAgICAoIHggKSAtPiBDT0xPUi5nb2xkICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4XG4gICAgICAjIGxpc3Q6ICAgICAgICggeCApIC0+IENPTE9SLmdvbGQgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhcbiAgICAgICMgc2V0OiAgICAgICAgKCB4ICkgLT4gQ09MT1IuZ29sZCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgIyB0ZXh0OiAgICAgICAoIHggKSAtPiBDT0xPUi53aGVhdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB4XG4gICAgICAjIGZsb2F0OiAgICAgICggeCApIC0+IENPTE9SLkZBTkNZUkVEICAgICAgICAgICAgICAgICAgICAgICAgIHhcbiAgICAgICMgcmVnZXg6ICAgICAgKCB4ICkgLT4gQ09MT1IucGx1bSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFxuICAgICAgIyB0cnVlOiAgICAgICAoIHggKSAtPiBDT0xPUi5pbnZlcnNlLmJvbGQuaXRhbGljLmxpbWUgICAgICAgICB4XG4gICAgICAjIGZhbHNlOiAgICAgICggeCApIC0+IENPTE9SLmludmVyc2UuYm9sZC5pdGFsaWMuRkFOQ1lPUkFOR0UgIHhcbiAgICAgICMgdW5kZWZpbmVkOiAgKCB4ICkgLT4gQ09MT1IuaW52ZXJzZS5ib2xkLml0YWxpYy5tYWdlbnRhICAgICAgeFxuICAgICAgIyBudWxsOiAgICAgICAoIHggKSAtPiBDT0xPUi5pbnZlcnNlLmJvbGQuaXRhbGljLmJsdWUgICAgICAgICB4XG4gICAgICAjIG5hbjogICAgICAgICggeCApIC0+IENPTE9SLmludmVyc2UuYm9sZC5pdGFsaWMubWFnZW50YSAgICAgIHhcbiAgICAgICMgb3RoZXI6ICAgICAgKCB4ICkgLT4gQ09MT1IuaW52ZXJzZS5yZWQgICAgICAgICAgICAgICAgICAgICAgeFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBzaG93ICAgICAgICAgICAgPSBuZXcgU2hvdygpXG4gICAgc2hvd19ub19jb2xvcnMgID0gbmV3IFNob3cgeyBjb2xvcnM6IGZhbHNlLCB9XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGludGVybmFscyA9IE9iamVjdC5mcmVlemUgeyBpbnRlcm5hbHMuLi4sIH1cbiAgICByZXR1cm4gZXhwb3J0cyA9IHtcbiAgICAgIFNob3csXG4gICAgICBzaG93LFxuICAgICAgc2hvd19ub19jb2xvcnMsXG4gICAgICBpbnRlcm5hbHMsIH1cblxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV90eXBlX29mOiAtPlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBvYmplY3RfcHJvdG90eXBlICA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB7fVxuICAgIHBvZF9wcm90b3R5cGVzICAgID0gT2JqZWN0LmZyZWV6ZSBbIG51bGwsIG9iamVjdF9wcm90b3R5cGUsIF1cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHByaW1pdGl2ZV90eXBlcyAgICAgPSBPYmplY3QuZnJlZXplIFtcbiAgICAgICdudWxsJywgJ3VuZGVmaW5lZCcsXG4gICAgICAnYm9vbGVhbicsXG4gICAgICAnaW5maW5pdHknLCAnbmFuJywgJ2Zsb2F0JyxcbiAgICAgICd0ZXh0JywgJ3N5bWJvbCcsICdyZWdleCcsXG4gICAgICBdXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGludGVybmFscyAgICAgICAgID0geyBvYmplY3RfcHJvdG90eXBlLCBwb2RfcHJvdG90eXBlcywgcHJpbWl0aXZlX3R5cGVzLCB9XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB0eXBlX29mID0gKCB4ICkgLT5cbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICMjIyBQcmltaXRpdmVzOiAjIyNcbiAgICAgIHJldHVybiAnbnVsbCcgICAgICAgICBpZiB4IGlzIG51bGxcbiAgICAgIHJldHVybiAndW5kZWZpbmVkJyAgICBpZiB4IGlzIHVuZGVmaW5lZFxuICAgICAgcmV0dXJuICdpbmZpbml0eScgICAgIGlmICggeCBpcyArSW5maW5pdHkgKSBvciAoIHggaXMgLUluZmluaXR5IClcbiAgICAgIHJldHVybiAnYm9vbGVhbicgICAgICBpZiAoIHggaXMgdHJ1ZSApIG9yICggeCBpcyBmYWxzZSApXG4gICAgICAjIHJldHVybiAndHJ1ZScgICAgICAgICBpZiAoIHggaXMgdHJ1ZSApXG4gICAgICAjIHJldHVybiAnZmFsc2UnICAgICAgICBpZiAoIHggaXMgZmFsc2UgKVxuICAgICAgcmV0dXJuICduYW4nICAgICAgICAgIGlmIE51bWJlci5pc05hTiAgICAgeFxuICAgICAgcmV0dXJuICdmbG9hdCcgICAgICAgIGlmIE51bWJlci5pc0Zpbml0ZSAgeFxuICAgICAgIyByZXR1cm4gJ3Vuc2V0JyAgICAgICAgaWYgeCBpcyB1bnNldFxuICAgICAgcmV0dXJuICdwb2QnICAgICAgICAgIGlmICggT2JqZWN0LmdldFByb3RvdHlwZU9mIHggKSBpbiBwb2RfcHJvdG90eXBlc1xuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgc3dpdGNoIGpzdHlwZW9mID0gdHlwZW9mIHhcbiAgICAgICAgd2hlbiAnc3RyaW5nJyAgICAgICAgICAgICAgICAgICAgICAgdGhlbiByZXR1cm4gJ3RleHQnXG4gICAgICAgIHdoZW4gJ3N5bWJvbCcgICAgICAgICAgICAgICAgICAgICAgIHRoZW4gcmV0dXJuICdzeW1ib2wnXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICByZXR1cm4gJ2xpc3QnICAgICAgICAgaWYgQXJyYXkuaXNBcnJheSAgeFxuICAgICAgIyMjIFRBSU5UIGNvbnNpZGVyIHRvIHJldHVybiB4LmNvbnN0cnVjdG9yLm5hbWUgIyMjXG4gICAgICBzd2l0Y2ggbWlsbGVydHlwZSA9ICggKCBPYmplY3Q6OnRvU3RyaW5nLmNhbGwgeCApLnJlcGxhY2UgL15cXFtvYmplY3QgKFteXFxdXSspXFxdJC8sICckMScgKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIHdoZW4gJ3JlZ2V4cCcgICAgICAgICAgICAgICAgICAgICAgIHRoZW4gcmV0dXJuICdyZWdleCdcbiAgICAgIHJldHVybiBtaWxsZXJ0eXBlXG4gICAgICAjIHN3aXRjaCBtaWxsZXJ0eXBlID0gT2JqZWN0Ojp0b1N0cmluZy5jYWxsIHhcbiAgICAgICMgICB3aGVuICdbb2JqZWN0IEZ1bmN0aW9uXScgICAgICAgICAgICB0aGVuIHJldHVybiAnZnVuY3Rpb24nXG4gICAgICAjICAgd2hlbiAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScgICAgICAgdGhlbiByZXR1cm4gJ2FzeW5jZnVuY3Rpb24nXG4gICAgICAjICAgd2hlbiAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nICAgdGhlbiByZXR1cm4gJ2dlbmVyYXRvcmZ1bmN0aW9uJ1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaXNfcHJpbWl0aXZlICAgICAgPSAoIHggICAgICkgLT4gKCB0eXBlX29mIHggKSAgaW4gcHJpbWl0aXZlX3R5cGVzXG4gICAgaXNfcHJpbWl0aXZlX3R5cGUgPSAoIHR5cGUgICkgLT4gdHlwZSAgICAgICAgICAgaW4gcHJpbWl0aXZlX3R5cGVzXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGludGVybmFscyA9IE9iamVjdC5mcmVlemUgeyBpbnRlcm5hbHMuLi4sIH1cbiAgICByZXR1cm4gZXhwb3J0cyA9IHtcbiAgICAgIHR5cGVfb2YsXG4gICAgICBpc19wcmltaXRpdmUsXG4gICAgICBpc19wcmltaXRpdmVfdHlwZSxcbiAgICAgIGludGVybmFscywgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIEJSSUNTXG5cblxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVtb19zaG93ID0gLT5cbiAgR1VZICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uL2d1eSdcbiAgeyBycHIsIH0gPSBHVVkudHJtXG4gIHsgc2hvdyxcbiAgICBTaG93LCB9ID0gQlJJQ1MucmVxdWlyZV9zaG93KClcbiAgZGVidWcgJ86pX19fMycsIHNob3dcbiAgZGVidWcgJ86pX19fNCcsIHNob3cuc3RhdGVcbiAgZGVidWcgJ86pX19fNScsIHNob3cgc2hvdy5kZW50XG4gIGRlYnVnICfOqV9fXzYnLCBzaG93LmdvX2Rvd24oKVxuICBkZWJ1ZyAnzqlfX183Jywgc2hvdyBzaG93LmRlbnRcbiAgZWNobygpXG4gIGVjaG8gJ86pX19fOCcsICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8gJ86pX19fOScsIHNob3cgdl8xID0gXCJmb28gJ2JhcidcIlxuICBlY2hvICfOqV9fMTAnLCAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvICfOqV9fMTEnLCBzaG93IHZfMiA9IHt9XG4gIGVjaG8gJ86pX18xMicsICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8gJ86pX18xMycsIHNob3cgdl8zID0geyBrb25nOiAxMDgsIGxvdzogOTIzLCBudW1iZXJzOiBbIDEwLCAxMSwgMTIsIF0sIH1cbiAgZWNobyAnzqlfXzE0JywgJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyAnzqlfXzE1Jywgc2hvdyB2XzQgPSBbXVxuICBlY2hvICfOqV9fMTYnLCAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvICfOqV9fMTcnLCBzaG93IHZfNSA9IFsgJ3NvbWUnLCAnd29yZHMnLCAndG8nLCAnc2hvdycsIDEsIC0xLCBmYWxzZSwgXVxuICBlY2hvICfOqV9fMTgnLCAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvICfOqV9fMTknLCBzaG93IHZfNiA9IG5ldyBNYXAgWyBbICdrb25nJywgMTA4LCBdLCBbICdsb3cnLCA5MjMsIF0sIFsgOTcxLCAnd29yZCcsIF0sIFsgdHJ1ZSwgJysxJywgXSwgWyAnYSBiIGMnLCBmYWxzZSwgXSBdXG4gIGVjaG8gJ86pX18yMCcsICfigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJTigJQnXG4gIGVjaG8gJ86pX18yMScsIHNob3cgdl83ID0gbmV3IFNldCBbICdzb21lJywgJ3dvcmRzJywgdHJ1ZSwgZmFsc2UsIG51bGwsIHVuZGVmaW5lZCwgMy4xNDE1OTI2LCBOYU4sIF1cbiAgZWNobyAnzqlfXzIyJywgJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyAnzqlfXzIzJywgc2hvdyB2XzggPSAvYWJjW2RlXS9cbiAgZWNobyAnzqlfXzI0JywgJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyAnzqlfXzI1Jywgc2hvdyB2XzkgPSBCdWZmZXIuZnJvbSAnYWJjw6TDtsO8J1xuICBlY2hvICfOqV9fMjYnLCAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBlY2hvICfOqV9fMjcnLCBzaG93IHZfMTAgPSB7IHZfMSwgdl8yLCB2XzMsIHZfNCwgdl81LCB2XzYsIHZfNywgdl84LCB2XzksIH0gIyB2XzEwLCB2XzExLCB2XzEyLCB2XzEzLCB2XzE0LCB9XG4gIHZfMTAudl8xMCA9IHZfMTBcbiAgZWNobyAnzqlfXzI4JywgJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobyAnzqlfXzI5JywgcnByIHZfMTBcbiAgZWNobyAnzqlfXzMwJywgc2hvdyB2XzEwID0geyB2XzEsIHZfMiwgdl8zLCB2XzQsIHZfNSwgdl82LCB2XzcsIHZfOCwgdl85LCB2XzEwLCB9ICMgdl8xMCwgdl8xMSwgdl8xMiwgdl8xMywgdl8xNCwgfVxuICBlY2hvICfOqV9fMzEnLCAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBhID0gWyAnYScsIF1cbiAgYiA9IFsgJ2InLCBhLCBdXG4gIGVjaG8gJ86pX18zMicsIHJwciAgYlxuICBlY2hvICfOqV9fMzMnLCBzaG93IGJcbiAgZWNobyAnzqlfXzM0JywgJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgYi5wdXNoIGFcbiAgZWNobyAnzqlfXzM1JywgcnByICBiXG4gIGVjaG8gJ86pX18zNicsIHNob3cgYlxuICBlY2hvICfOqV9fMzcnLCAn4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCU4oCUJ1xuICBkID0ge31cbiAgYyA9IHsgZCwgfVxuICBkLmMgPSBjXG4gIGUgPSB7IGQsIGMsIH1cbiAgZWNobyAnzqlfXzM4JywgcnByIGNcbiAgZWNobyAnzqlfXzM5JywgcnByIGVcbiAgIyBlY2hvICfOqV9fNDAnLCBzaG93IGJcbiAgZWNobyAnzqlfXzQxJywgJ+KAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlOKAlCdcbiAgZWNobygpXG4gIHJldHVybiBudWxsXG5cbiMgZGVtb19zaG93KClcblxuXG5cbiJdfQ==
