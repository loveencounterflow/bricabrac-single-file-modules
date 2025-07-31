(function() {
  //###########################################################################################################

  //===========================================================================================================
  var SFMODULES;

  module.exports = SFMODULES = {
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_list_tools: function() {
      var append, is_empty;
      append = function(list, ...P) {
        return list.splice(list.length, 0, ...P);
      };
      is_empty = function(list) {
        return list.length === 0;
      };
      return {append, is_empty};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_escape_html_text: function() {
      var escape_html_text;
      escape_html_text = function(text) {
        var R;
        R = text;
        R = R.replace(/&/g, '&amp;');
        R = R.replace(/</g, '&lt;');
        R = R.replace(/>/g, '&gt;');
        return R;
      };
      return {escape_html_text};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_tagfun_tools: function() {
      var is_tagfun_call, walk_nonempty_parts, walk_parts, walk_raw_nonempty_parts, walk_raw_parts;
      // ### Given the arguments of either a tagged template function call ('tagfun call') or the single
      // argument of a conventional function call, `get_first_argument()` will return either

      // * the result of applying `as_text()` to the sole argument, or

      // * the result of concatenating the constant parts and the interpolated expressions, which each
      // expression replaced by the result of applying `as_text()` to it.

      // Another way to describe this behavior is to say that this function treats a conventional call with
      // a single expression the same way that it treats a funtag call with a string that contains nothing but
      // that same expression, so the invariant `( get_first_argument exp ) == ( get_first_argument"#{ exp }"
      // )` holds.

      // * intended for string producers, text processing, markup production;
      // * list some examples. ###

      // #---------------------------------------------------------------------------------------------------------
      // create_get_first_argument_fn = ( as_text = null ) ->
      //   as_text ?= ( expression ) -> "#{expression}"
      //   ### TAINT use proper validation ###
      //   unless ( typeof as_text ) is 'function'
      //     throw new Error "Ωidsp___1 expected a function, got #{rpr as_text}"
      //   #-------------------------------------------------------------------------------------------------------
      //   get_first_argument = ( P... ) ->
      //     unless is_tagfun_call P...
      //       unless P.length is 1
      //         throw new Error "Ωidsp___2 expected 1 argument, got #{P.length}"
      //       return as_text P[ 0 ]
      //     #.....................................................................................................
      //     [ parts, expressions..., ] = P
      //     R = parts[ 0 ]
      //     for expression, idx in expressions
      //       R += ( as_text expression ) + parts[ idx + 1 ]
      //     return R
      //   #-------------------------------------------------------------------------------------------------------
      //   get_first_argument.create = create_get_first_argument_fn
      //   return get_first_argument

      //---------------------------------------------------------------------------------------------------------
      is_tagfun_call = function(...P) {
        if (!Array.isArray(P[0])) {
          return false;
        }
        if (!Object.isFrozen(P[0])) {
          return false;
        }
        if (P[0].raw == null) {
          return false;
        }
        return true;
      };
      //---------------------------------------------------------------------------------------------------------
      walk_raw_parts = function*(chunks, ...values) {
        var chunk;
        chunks = (function() {
          var i, len, ref, results;
          ref = chunks.raw;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            chunk = ref[i];
            results.push(chunk);
          }
          return results;
        })();
        chunks.raw = chunks.slice(0);
        Object.freeze(chunks);
        return (yield* walk_parts(chunks, ...values));
      };
      //---------------------------------------------------------------------------------------------------------
      walk_parts = function*(chunks, ...values) {
        var i, idx, len, value;
        if (!is_tagfun_call(chunks, ...values)) {
          if (values.length !== 0) {
            throw new Error(`Ω___3 expected 1 argument in non-template call, got ${arguments.length}`);
          }
          if (typeof chunks === 'string') {
            [chunks, values] = [[chunks], []];
          } else {
            [chunks, values] = [['', ''], [chunks]];
          }
        }
        yield ({
          //.......................................................................................................
          chunk: chunks[0],
          isa: 'chunk'
        });
        for (idx = i = 0, len = values.length; i < len; idx = ++i) {
          value = values[idx];
          yield ({
            value,
            isa: 'value'
          });
          yield ({
            chunk: chunks[idx + 1],
            isa: 'chunk'
          });
        }
        //.......................................................................................................
        return null;
      };
      //---------------------------------------------------------------------------------------------------------
      walk_raw_nonempty_parts = function*(chunks, ...values) {
        var part;
        for (part of walk_raw_parts(chunks, ...values)) {
          if (!((part.chunk === '') || (part.value === ''))) {
            yield part;
          }
        }
        return null;
      };
      //---------------------------------------------------------------------------------------------------------
      walk_nonempty_parts = function*(chunks, ...values) {
        var part;
        for (part of walk_parts(chunks, ...values)) {
          if (!((part.chunk === '') || (part.value === ''))) {
            yield part;
          }
        }
        return null;
      };
      //---------------------------------------------------------------------------------------------------------
      // return do exports = ( get_first_argument = create_get_first_argument_fn() ) -> {
      //   get_first_argument, is_tagfun_call,
      //   walk_parts, walk_nonempty_parts, walk_raw_parts, walk_raw_nonempty_parts, }
      return {is_tagfun_call, walk_parts, walk_raw_parts, walk_nonempty_parts, walk_raw_nonempty_parts};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_managed_property_tools: function() {
      var hide, set_getter;
      set_getter = function(object, name, get) {
        return Object.defineProperties(object, {
          [name]: {get}
        });
      };
      hide = (object, name, value) => {
        return Object.defineProperty(object, name, {
          enumerable: false,
          writable: true,
          configurable: true,
          value: value
        });
      };
      //---------------------------------------------------------------------------------------------------------
      return {set_getter, hide};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_nameit: function() {
      var nameit;
      nameit = function(name, fn) {
        Object.defineProperty(fn, 'name', {
          value: name
        });
        return fn;
      };
      //---------------------------------------------------------------------------------------------------------
      return {nameit};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_stack_classes: function() {
      var Stack, XXX_Stack_error, hide, misfit, set_getter;
      ({set_getter, hide} = SFMODULES.require_managed_property_tools());
      misfit = Symbol('misfit');
      XXX_Stack_error = class XXX_Stack_error extends Error {};
      Stack = (function() {
        //===========================================================================================================
        class Stack {
          //---------------------------------------------------------------------------------------------------------
          constructor() {
            this.data = [];
            return void 0;
          }

          //---------------------------------------------------------------------------------------------------------
          toString() {
            var e;
            return `[${((function() {
              var i, len, ref, results;
              ref = this.data;
              results = [];
              for (i = 0, len = ref.length; i < len; i++) {
                e = ref[i];
                results.push(`${e}`);
              }
              return results;
            }).call(this)).join`.`}]`;
          }

          clear() {
            this.data.length = 0;
            return null;
          }

          * [Symbol.iterator]() {
            return (yield* this.data);
          }

          //---------------------------------------------------------------------------------------------------------
          push(x) {
            this.data.push(x);
            return null;
          }

          unshift(x) {
            this.data.unshift(x);
            return null;
          }

          //---------------------------------------------------------------------------------------------------------
          pop(fallback = misfit) {
            if (this.is_empty) {
              if (fallback !== misfit) {
                return fallback;
              }
              throw new XXX_Stack_error("Ωidsp___4 unable to pop value from empty stack");
            }
            return this.data.pop();
          }

          //---------------------------------------------------------------------------------------------------------
          shift(fallback = misfit) {
            if (this.is_empty) {
              if (fallback !== misfit) {
                return fallback;
              }
              throw new XXX_Stack_error("Ωidsp___5 unable to shift value from empty stack");
            }
            return this.data.shift();
          }

          //---------------------------------------------------------------------------------------------------------
          peek(fallback = misfit) {
            if (this.is_empty) {
              if (fallback !== misfit) {
                return fallback;
              }
              throw new XXX_Stack_error("Ωidsp___6 unable to peek value of empty stack");
            }
            return this.data.at(-1);
          }

        };

        //---------------------------------------------------------------------------------------------------------
        set_getter(Stack.prototype, 'length', function() {
          return this.data.length;
        });

        set_getter(Stack.prototype, 'is_empty', function() {
          return this.data.length === 0;
        });

        return Stack;

      }).call(this);
      //-----------------------------------------------------------------------------------------------------------
      return {Stack};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_infiniproxy: function() {
      /*

      ## To Do

      * **`[—]`** allow to set context to be used by `apply()`
      * **`[—]`** allow to call `sys.stack.clear()` manually where seen fit

       */
      /* TAINT in this simulation of single-file modules, a new distinct symbol is produced with each call to
         `require_infiniproxy()` */
      var Stack, create_infinyproxy, hide, sys_symbol, template;
      ({hide} = SFMODULES.require_managed_property_tools());
      ({Stack} = SFMODULES.require_stack_classes());
      sys_symbol = Symbol('sys');
      // misfit                  = Symbol 'misfit'
      template = {
        /* An object that will be checked for existing properties to return; when no provider is given or a
             provider lacks a requested property, `sys.sub_level_proxy` will be returned for property accesses: */
        provider: Object.create(null),
        /* A function to be called when the proxy (either `sys.top_level_proxy` or `sys.sub_level_proxy`) is
             called; notice that if the `provider` provides a method for a given key, that method will be called
             instead of the `callee`: */
        callee: null
      };
      //=========================================================================================================
      create_infinyproxy = function(cfg) {
        var new_proxy, sys;
        cfg = {...template, ...cfg};
        //.......................................................................................................
        new_proxy = function({is_top_level}) {
          var R, callee_ctx, get_ctx;
          callee_ctx = null;
          get_ctx = function() {
            return callee_ctx != null ? callee_ctx : callee_ctx = {is_top_level, ...cfg, ...sys};
          };
          //.....................................................................................................
          R = new Proxy(cfg.callee, {
            //-----------------------------------------------------------------------------------------------------
            apply: function(target, key, P) {
              // urge 'Ω__10', "apply #{rpr { target, key, P, is_top_level, }}"
              R = Reflect.apply(target, get_ctx(), P);
              sys.stack.clear();
              return R;
            },
            //-----------------------------------------------------------------------------------------------------
            get: function(target, key) {
              if (key === sys_symbol) {
                // urge 'Ω__11', "get #{rpr { target, key, }}"
                return get_ctx();
              }
              if ((typeof key) === 'symbol') {
                return target[key];
              }
              if (Reflect.has(cfg.provider, key)) {
                return Reflect.get(cfg.provider, key);
              }
              if (is_top_level) {
                sys.stack.clear();
              }
              sys.stack.push(key);
              // return "[result for getting non-preset key #{rpr key}] from #{rpr provider}"
              return sys.sub_level_proxy;
            }
          });
          //.....................................................................................................
          return R;
        };
        //.......................................................................................................
        sys = {
          stack: new Stack()
        };
        sys.top_level_proxy = new_proxy({
          is_top_level: true
        });
        sys.sub_level_proxy = new_proxy({
          is_top_level: false
        });
        //.......................................................................................................
        return sys.top_level_proxy;
      };
      //---------------------------------------------------------------------------------------------------------
      return {create_infinyproxy, sys_symbol};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_next_free_filename: function() {
      var FS, PATH, TMP_exhaustion_error, TMP_validation_error, cache_filename_re, cfg, errors, exists, exports, get_next_filename, get_next_free_filename, rpr;
      cfg = {
        max_attempts: 9999,
        prefix: '~.',
        suffix: '.bricabrac-cache'
      };
      cache_filename_re = RegExp(`^(?:${RegExp.escape(cfg.prefix)})(?<first>.*)\\.(?<nr>[0-9]{4})(?:${RegExp.escape(cfg.suffix)})$`, "v");
      rpr = function(x) {
        return `'${(typeof x) === 'string' ? x.replace(/'/g, "\\'") : void 0}'`;
        return `${x}`;
      };
      errors = {
        TMP_exhaustion_error: TMP_exhaustion_error = class TMP_exhaustion_error extends Error {},
        TMP_validation_error: TMP_validation_error = class TMP_validation_error extends Error {}
      };
      FS = require('node:fs');
      PATH = require('node:path');
      //.......................................................................................................
      exists = function(path) {
        var error;
        try {
          FS.statSync(path);
        } catch (error1) {
          error = error1;
          return false;
        }
        return true;
      };
      //.......................................................................................................
      get_next_filename = function(path) {
        var basename, dirname, first, match, nr;
        if ((typeof path) !== 'string') {
          /* TAINT use proper type checking */
          throw new errors.TMP_validation_error(`Ω___1 expected a text, got ${rpr(path)}`);
        }
        if (!(path.length > 0)) {
          throw new errors.TMP_validation_error(`Ω___2 expected a nonempty text, got ${rpr(path)}`);
        }
        dirname = PATH.dirname(path);
        basename = PATH.basename(path);
        if ((match = basename.match(cache_filename_re)) == null) {
          return PATH.join(dirname, `${cfg.prefix}${basename}.0001${cfg.suffix}`);
        }
        ({first, nr} = match.groups);
        nr = `${(parseInt(nr, 10)) + 1}`.padStart(4, '0');
        path = first;
        return PATH.join(dirname, `${cfg.prefix}${first}.${nr}${cfg.suffix}`);
      };
      //.......................................................................................................
      get_next_free_filename = function(path) {
        var R, failure_count;
        R = path;
        failure_count = -1;
        while (true) {
          //...................................................................................................
          //.....................................................................................................
          failure_count++;
          if (failure_count > cfg.max_attempts) {
            throw new errors.TMP_exhaustion_error(`Ω___5 too many (${failure_count}) attempts; path ${rpr(R)} exists`);
          }
          //...................................................................................................
          R = get_next_filename(R);
          if (!exists(R)) {
            break;
          }
        }
        return R;
      };
      //.......................................................................................................
      return exports = {get_next_free_filename, get_next_filename, exists, cache_filename_re, errors};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_ansi: function() {
      var ANSI, Ansi, exports;
      //=========================================================================================================
      ANSI = new (Ansi = class Ansi {
        /*

        * as for the background ('bg'), only colors and no effects can be set; in addition, the bg color can be
          set to its default (or 'transparent'), which will show the terminal's or the terminal emulator's
          configured bg color
        * as for the foreground ('fg'), colors and effects such as blinking, bold, italic, underline, overline,
          strike can be set; in addition, the configured terminal default font color can be set, and each effect
          has a dedicated off-switch
        * neat tables can be drawn by combining the overline effect with `│` U+2502 'Box Drawing Light Vertical
          Line'; the renmarkable feature of this is that it minimizes spacing around characters meaning it's
          possible to have adjacent rows of cells separated from the next row by a border without having to
          sacrifice a line of text just to draw the border.
        * while the two color palattes implied by the standard XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
          * better to only use full RGB than to fuzz around with palettes
          * apps that use colors at all should be prepared for dark and bright backgrounds
          * in general better to set fg, bg colors than to use reverse
          * but reverse actually does do what it says—it swaps fg with bg color

        \x1b[39m default fg color
        \x1b[49m default bg color

         */
        //-------------------------------------------------------------------------------------------------------
        fg_from_dec([r, g, b]) {
          return `\x1b[38:2::${r}:${g}:${b}m`;
        }

        bg_from_dec([r, g, b]) {
          return `\x1b[48:2::${r}:${g}:${b}m`;
        }

        fg_from_hex(rhx) {
          return this.fg_from_dec(this.dec_from_hex(rhx));
        }

        bg_from_hex(rhx) {
          return this.bg_from_dec(this.dec_from_hex(rhx));
        }

        fg_from_name(name) {
          var ref, rgb;
          rgb = (ref = this.colors[name]) != null ? ref : this.colors.fallback;
          return this.fg_from_dec(rgb);
        }

        dec_from_hex(hex) {
          var b16, g16, r16;
          if ((typeof hex) !== 'string') {
            /* TAINT use proper typing */
            throw new Error(`Ω__25 expected text, got ${rpr(hex)}`);
          }
          if (!/^#[0-9a-f]{6}$/i.test(hex)) {
            throw new Error(`Ω__25 not a proper hexadecimal RGB code: '${hex.replace(/'/g, "\\'")}'`);
          }
          [r16, g16, b16] = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)];
          return [parseInt(r16, 16), parseInt(g16, 16), parseInt(b16, 16)];
        }

      })();
      //---------------------------------------------------------------------------------------------------------
      return exports = {ANSI};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_ansi_colors_and_effects: function() {
      var ANSI, R, rgb_dec, rgb_hex;
      ({ANSI} = SFMODULES.require_ansi());
      //.........................................................................................................
      rgb_dec = {
        black: [0, 0, 0],
        darkslategray: [47, 79, 79],
        dimgray: [105, 105, 105],
        slategray: [112, 128, 144],
        gray: [128, 128, 128],
        lightslategray: [119, 136, 153],
        darkgray: [169, 169, 169],
        silver: [192, 192, 192],
        lightgray: [211, 211, 211],
        gainsboro: [220, 220, 220]
      };
      //.........................................................................................................
      rgb_hex = {
        white: '#ffffff',
        amethyst: '#f0a3ff',
        blue: '#0075dc',
        caramel: '#993f00',
        damson: '#4c005c',
        ebony: '#191919',
        forest: '#005c31',
        green: '#2bce48',
        lime: '#9dcc00',
        quagmire: '#426600',
        honeydew: '#ffcc99',
        iron: '#808080',
        jade: '#94ffb5',
        khaki: '#8f7c00',
        mallow: '#c20088',
        navy: '#003380',
        orpiment: '#ffa405',
        pink: '#ffa8bb',
        red: '#ff0010',
        sky: '#5ef1f2',
        turquoise: '#00998f',
        violet: '#740aff',
        wine: '#990000',
        uranium: '#e0ff66',
        xanthin: '#ffff80',
        yellow: '#ffe100',
        zinnia: '#ff5005'
      };
      //.........................................................................................................
      R = {
        overline1: '\x1b[53m',
        overline0: '\x1b[55m',
        default: '\x1b[39m',
        bg_default: '\x1b[49m',
        bold: '\x1b[1m',
        bold0: '\x1b[22m',
        italic: '\x1b[3m',
        italic0: '\x1b[23m',
        reset: '\x1b[0m',
        //.......................................................................................................
        black: ANSI.fg_from_dec(rgb_dec.black),
        darkslategray: ANSI.fg_from_dec(rgb_dec.darkslategray),
        dimgray: ANSI.fg_from_dec(rgb_dec.dimgray),
        slategray: ANSI.fg_from_dec(rgb_dec.slategray),
        gray: ANSI.fg_from_dec(rgb_dec.gray),
        lightslategray: ANSI.fg_from_dec(rgb_dec.lightslategray),
        darkgray: ANSI.fg_from_dec(rgb_dec.darkgray),
        silver: ANSI.fg_from_dec(rgb_dec.silver),
        lightgray: ANSI.fg_from_dec(rgb_dec.lightgray),
        gainsboro: ANSI.fg_from_dec(rgb_dec.gainsboro),
        //.......................................................................................................
        white: ANSI.fg_from_hex(rgb_hex.white),
        amethyst: ANSI.fg_from_hex(rgb_hex.amethyst),
        blue: ANSI.fg_from_hex(rgb_hex.blue),
        caramel: ANSI.fg_from_hex(rgb_hex.caramel),
        damson: ANSI.fg_from_hex(rgb_hex.damson),
        ebony: ANSI.fg_from_hex(rgb_hex.ebony),
        forest: ANSI.fg_from_hex(rgb_hex.forest),
        green: ANSI.fg_from_hex(rgb_hex.green),
        lime: ANSI.fg_from_hex(rgb_hex.lime),
        quagmire: ANSI.fg_from_hex(rgb_hex.quagmire),
        honeydew: ANSI.fg_from_hex(rgb_hex.honeydew),
        iron: ANSI.fg_from_hex(rgb_hex.iron),
        jade: ANSI.fg_from_hex(rgb_hex.jade),
        khaki: ANSI.fg_from_hex(rgb_hex.khaki),
        mallow: ANSI.fg_from_hex(rgb_hex.mallow),
        navy: ANSI.fg_from_hex(rgb_hex.navy),
        orpiment: ANSI.fg_from_hex(rgb_hex.orpiment),
        pink: ANSI.fg_from_hex(rgb_hex.pink),
        red: ANSI.fg_from_hex(rgb_hex.red),
        sky: ANSI.fg_from_hex(rgb_hex.sky),
        turquoise: ANSI.fg_from_hex(rgb_hex.turquoise),
        violet: ANSI.fg_from_hex(rgb_hex.violet),
        wine: ANSI.fg_from_hex(rgb_hex.wine),
        uranium: ANSI.fg_from_hex(rgb_hex.uranium),
        xanthin: ANSI.fg_from_hex(rgb_hex.xanthin),
        yellow: ANSI.fg_from_hex(rgb_hex.yellow),
        zinnia: ANSI.fg_from_hex(rgb_hex.zinnia),
        //.......................................................................................................
        bg_black: ANSI.bg_from_dec(rgb_dec.black),
        bg_darkslategray: ANSI.bg_from_dec(rgb_dec.darkslategray),
        bg_dimgray: ANSI.bg_from_dec(rgb_dec.dimgray),
        bg_slategray: ANSI.bg_from_dec(rgb_dec.slategray),
        bg_gray: ANSI.bg_from_dec(rgb_dec.gray),
        bg_lightslategray: ANSI.bg_from_dec(rgb_dec.lightslategray),
        bg_darkgray: ANSI.bg_from_dec(rgb_dec.darkgray),
        bg_silver: ANSI.bg_from_dec(rgb_dec.silver),
        bg_lightgray: ANSI.bg_from_dec(rgb_dec.lightgray),
        bg_gainsboro: ANSI.bg_from_dec(rgb_dec.gainsboro),
        //.......................................................................................................
        bg_white: ANSI.bg_from_hex(rgb_hex.white),
        bg_amethyst: ANSI.bg_from_hex(rgb_hex.amethyst),
        bg_blue: ANSI.bg_from_hex(rgb_hex.blue),
        bg_caramel: ANSI.bg_from_hex(rgb_hex.caramel),
        bg_damson: ANSI.bg_from_hex(rgb_hex.damson),
        bg_ebony: ANSI.bg_from_hex(rgb_hex.ebony),
        bg_forest: ANSI.bg_from_hex(rgb_hex.forest),
        bg_green: ANSI.bg_from_hex(rgb_hex.green),
        bg_lime: ANSI.bg_from_hex(rgb_hex.lime),
        bg_quagmire: ANSI.bg_from_hex(rgb_hex.quagmire),
        bg_honeydew: ANSI.bg_from_hex(rgb_hex.honeydew),
        bg_iron: ANSI.bg_from_hex(rgb_hex.iron),
        bg_jade: ANSI.bg_from_hex(rgb_hex.jade),
        bg_khaki: ANSI.bg_from_hex(rgb_hex.khaki),
        bg_mallow: ANSI.bg_from_hex(rgb_hex.mallow),
        bg_navy: ANSI.bg_from_hex(rgb_hex.navy),
        bg_orpiment: ANSI.bg_from_hex(rgb_hex.orpiment),
        bg_pink: ANSI.bg_from_hex(rgb_hex.pink),
        bg_red: ANSI.bg_from_hex(rgb_hex.red),
        bg_sky: ANSI.bg_from_hex(rgb_hex.sky),
        bg_turquoise: ANSI.bg_from_hex(rgb_hex.turquoise),
        bg_violet: ANSI.bg_from_hex(rgb_hex.violet),
        bg_wine: ANSI.bg_from_hex(rgb_hex.wine),
        bg_uranium: ANSI.bg_from_hex(rgb_hex.uranium),
        bg_xanthin: ANSI.bg_from_hex(rgb_hex.xanthin),
        bg_yellow: ANSI.bg_from_hex(rgb_hex.yellow),
        bg_zinnia: ANSI.bg_from_hex(rgb_hex.zinnia)
      };
      return {
        //.........................................................................................................
        ansi_colors_and_effects: R
      };
    }
  };

}).call(this);

//# sourceMappingURL=main.js.map