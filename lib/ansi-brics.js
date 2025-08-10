(function() {
  'use strict';
  var ANSI_BRICS,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  //###########################################################################################################

  //===========================================================================================================
  ANSI_BRICS = {
    
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
            throw new Error(`Ω___3 expected text, got ${rpr(hex)}`);
          }
          if (!/^#[0-9a-f]{6}$/i.test(hex)) {
            throw new Error(`Ω___4 not a proper hexadecimal RGB code: '${hex.replace(/'/g, "\\'")}'`);
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
      ({ANSI} = ANSI_BRICS.require_ansi());
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
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_strip_ansi: function() {
      
    // Regex used for ansi escape code splitting
    // Ref: https://github.com/chalk/ansi-regex/blob/f338e1814144efb950276aac84135ff86b72dc8e/index.js
    // License: MIT by Sindre Sorhus <sindresorhus@gmail.com>
    // Matches all ansi escape code sequences in a string
    const chalk_ansi_re = new RegExp(
      '[\\u001B\\u009B][[\\]()#;:?]*' +
      '(?:(?:(?:(?:[;:][-a-zA-Z\\d\\/\\#&.:=?%@~_]+)*' +
      '|[a-zA-Z\\d]+(?:[;:][-a-zA-Z\\d\\/\\#&.:=?%@~_]*)*)?' +
      '(?:\\u0007|\\u001B\\u005C|\\u009C))' +
      '|(?:(?:\\d{1,4}(?:[;:]\\d{0,4})*)?' +
      '[\\dA-PR-TZcf-nq-uy=><~]))', 'g',
    );
    /* from https://github.com/nodejs/node/blob/21eac793cd746eab0b36d75af5e16aed11f9aa4b/lib/internal/util/inspect.js#L2521 */
    /* augmented to also match colons as per https://en.wikipedia.org/wiki/ANSI_escape_code#24-bit */
    ;
      var own_ansi_re, own_single_ansi_re, strip_ansi;
      own_single_ansi_re = /(\x1b\[[^\x40-\x7e]*[\x40-\x7e])/g;
      own_ansi_re = /((?:\x1b\[[^\x40-\x7e]*[\x40-\x7e])+)/g;
      strip_ansi = function(text) {
        return text.replace(own_ansi_re, '');
      };
      return {
        //.........................................................................................................
        strip_ansi,
        internals: {
          ansi_re: own_ansi_re,
          own_single_ansi_re
        }
      };
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_ansi_chunker: function() {
      var Ansi_chunker, Chunk, VARIOUS_BRICS, ansi_splitter, cfg_template, chunkify, exports, hide, internals, js_segmentize, segmenter, set_getter, simple_get_width;
      //=========================================================================================================
      VARIOUS_BRICS = require('./various-brics');
      ({set_getter, hide} = VARIOUS_BRICS.require_managed_property_tools());
      segmenter = new Intl.Segmenter();
      //.........................................................................................................
      simple_get_width = function(text) {
        return (Array.from(text)).length;
      };
      ansi_splitter = /((?:\x1b\[[^m]+m)+)/g;
      js_segmentize = function(text) {
        var d, results;
        results = [];
        for (d of segmenter.segment(text)) {
          results.push(d.segment);
        }
        return results;
      };
      cfg_template = Object.freeze({
        splitter: ansi_splitter,
        get_width: simple_get_width,
        segmentize: js_segmentize
      });
      //.........................................................................................................
      internals = Object.freeze({simple_get_width, ansi_splitter, js_segmentize, cfg_template});
      Chunk = (function() {
        //=========================================================================================================
        class Chunk {
          //-------------------------------------------------------------------------------------------------------
          * [Symbol.iterator]() {
            return (yield* this.text);
          }

          //-------------------------------------------------------------------------------------------------------
          constructor({has_ansi, width, text}) {
            this.width = width;
            hide(this, 'has_ansi', has_ansi);
            hide(this, 'text', text);
            return void 0;
          }

        };

        //-------------------------------------------------------------------------------------------------------
        set_getter(Chunk.prototype, 'length', function() {
          return this.text.length;
        });

        return Chunk;

      }).call(this);
      Ansi_chunker = (function() {
        //=========================================================================================================
        class Ansi_chunker {
          //-------------------------------------------------------------------------------------------------------
          * [Symbol.iterator]() {
            return (yield* this.chunks);
          }

          //-------------------------------------------------------------------------------------------------------
          constructor(cfg = null) {
            hide(this, 'cfg', {...cfg_template, ...cfg});
            hide(this, 'chunks', []);
            this.reset();
            return void 0;
          }

          //-------------------------------------------------------------------------------------------------------
          reset() {
            this.chunks = [];
            return null;
          }

          //-------------------------------------------------------------------------------------------------------
          chunkify(source) {
            var has_ansi, i, len, ref, text, width;
            this.reset();
            if (source === '') {
              /* TAINT might as well return an empty list of @chunks */
              this.chunks.push(new Chunk({
                has_ansi: false,
                width: 0,
                text: ''
              }));
              return this;
            }
            //.....................................................................................................
            has_ansi = true;
            ref = source.split(this.cfg.splitter);
            for (i = 0, len = ref.length; i < len; i++) {
              text = ref[i];
              has_ansi = !has_ansi;
              if (text === '') {
                continue;
              }
              width = has_ansi ? 0 : this.cfg.get_width(text);
              this.chunks.push(new Chunk({has_ansi, width, text}));
            }
            //.....................................................................................................
            return this;
          }

        };

        //-------------------------------------------------------------------------------------------------------
        set_getter(Ansi_chunker.prototype, 'has_ansi', function() {
          var chunk, i, len, ref;
          ref = this.chunks;
          for (i = 0, len = ref.length; i < len; i++) {
            chunk = ref[i];
            if (chunk.has_ansi) {
              return true;
            }
          }
          return false;
        });

        //-------------------------------------------------------------------------------------------------------
        set_getter(Ansi_chunker.prototype, 'width', function() {
          return this.chunks.reduce((function(sum, chunk) {
            return sum + chunk.width;
          }), 0);
        });

        set_getter(Ansi_chunker.prototype, 'length', function() {
          return this.chunks.reduce((function(sum, chunk) {
            return sum + chunk.length;
          }), 0);
        });

        set_getter(Ansi_chunker.prototype, 'text', function() {
          return this.chunks.reduce((function(sum, chunk) {
            return sum + chunk.text;
          }), '');
        });

        return Ansi_chunker;

      }).call(this);
      //=========================================================================================================
      chunkify = function(text) {
        return new Ansi_chunker(text);
      };
      //=========================================================================================================
      return exports = {Ansi_chunker, chunkify, internals};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_chr_gauge: function() {
      var C, build_chr_gauge, exports;
      ({
        ansi_colors_and_effects: C
      } = ANSI_BRICS.require_ansi_colors_and_effects());
      build_chr_gauge = function({length = 30}) {
        var R, count, decade, decade_color, even_color, i, len, odd_color, ref, unit;
        even_color = function(x) {
          return C.bg_yellow + C.black + C.bold + `${x}` + C.reset;
        };
        odd_color = function(x) {
          return C.bg_black + C.yellow + C.bold + `${x}` + C.reset;
        };
        decade_color = function(x) {
          return C.bg_white + C.red + C.bold + `${x}` + C.reset;
        };
        decade = 0;
        count = 0;
        R = '';
        while (true) {
          ref = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
          for (i = 0, len = ref.length; i < len; i++) {
            unit = ref[i];
            count++;
            if (count > length) {
              break;
            }
            if (unit === 0) {
              decade++;
              R += decade_color(decade);
            } else {
              R += (modulo(unit, 2) === 0 ? even_color : odd_color)(unit);
            }
          }
          if (count > length) {
            break;
          }
        }
        return R;
      };
      //=========================================================================================================
      return exports = {build_chr_gauge};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, ANSI_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Fuc2ktYnJpY3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLFVBQUE7SUFBQSwyREFBQTs7Ozs7RUFLQSxVQUFBLEdBS0UsQ0FBQTs7OztJQUFBLFlBQUEsRUFBYyxRQUFBLENBQUEsQ0FBQTtBQUVoQixVQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQTs7TUFDSSxJQUFBLEdBQU8sSUFBQSxDQUFVLE9BQU4sTUFBQSxLQUFBLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQXdCVCxXQUFhLENBQUMsQ0FBRSxDQUFGLEVBQUssQ0FBTCxFQUFRLENBQVIsQ0FBRCxDQUFBO2lCQUFrQixDQUFBLFdBQUEsQ0FBQSxDQUFjLENBQWQsQ0FBQSxDQUFBLENBQUEsQ0FBbUIsQ0FBbkIsQ0FBQSxDQUFBLENBQUEsQ0FBd0IsQ0FBeEIsQ0FBQSxDQUFBO1FBQWxCOztRQUNiLFdBQWEsQ0FBQyxDQUFFLENBQUYsRUFBSyxDQUFMLEVBQVEsQ0FBUixDQUFELENBQUE7aUJBQWtCLENBQUEsV0FBQSxDQUFBLENBQWMsQ0FBZCxDQUFBLENBQUEsQ0FBQSxDQUFtQixDQUFuQixDQUFBLENBQUEsQ0FBQSxDQUF3QixDQUF4QixDQUFBLENBQUE7UUFBbEI7O1FBQ2IsV0FBYSxDQUFFLEdBQUYsQ0FBQTtpQkFBVyxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxZQUFELENBQWMsR0FBZCxDQUFiO1FBQVg7O1FBQ2IsV0FBYSxDQUFFLEdBQUYsQ0FBQTtpQkFBVyxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxZQUFELENBQWMsR0FBZCxDQUFiO1FBQVg7O1FBQ2IsWUFBYyxDQUFFLElBQUYsQ0FBQTtBQUNwQixjQUFBLEdBQUEsRUFBQTtVQUFRLEdBQUEsNkNBQXdCLElBQUMsQ0FBQSxNQUFNLENBQUM7QUFDaEMsaUJBQU8sSUFBQyxDQUFBLFdBQUQs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Q0FBQyxDQUFDLEdBQWpCLEdBQTJCLENBQUMsQ0FBQyxJQUE3QixHQUFvQyxDQUFBLENBQUEsQ0FBRyxDQUFILENBQUEsQ0FBcEMsR0FBNkMsQ0FBQyxDQUFDO1FBQXhEO1FBQ2hCLE1BQUEsR0FBZ0I7UUFDaEIsS0FBQSxHQUFnQjtRQUNoQixDQUFBLEdBQWdCO0FBQ2hCLGVBQUEsSUFBQTtBQUNFO1VBQUEsS0FBQSxxQ0FBQTs7WUFDRSxLQUFBO1lBQ0EsSUFBUyxLQUFBLEdBQVEsTUFBakI7QUFBQSxvQkFBQTs7WUFDQSxJQUFHLElBQUEsS0FBUSxDQUFYO2NBQ0UsTUFBQTtjQUNBLENBQUEsSUFBSyxZQUFBLENBQWEsTUFBYixFQUZQO2FBQUEsTUFBQTtjQUlFLENBQUEsSUFBSyxRQUFLLE1BQVEsRUFBUixLQUFhLENBQWhCLEdBQXVCLFVBQXZCLEdBQXVDLFNBQXpDLENBQUEsQ0FBcUQsSUFBckQsRUFKUDs7VUFIRjtVQVFBLElBQVMsS0FBQSxHQUFRLE1BQWpCO0FBQUEsa0JBQUE7O1FBVEY7QUFVQSxlQUFPO01BakJTLEVBRHRCOztBQXNCSSxhQUFPLE9BQUEsR0FBVSxDQUFFLGVBQUY7SUF2QkE7RUExU25CLEVBVkY7OztFQThVQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixVQUE5QjtBQTlVQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQU5TSV9CUklDUyA9XG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Fuc2k6IC0+XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgQU5TSSA9IG5ldyBjbGFzcyBBbnNpXG4gICAgICAjIyNcblxuICAgICAgKiBhcyBmb3IgdGhlIGJhY2tncm91bmQgKCdiZycpLCBvbmx5IGNvbG9ycyBhbmQgbm8gZWZmZWN0cyBjYW4gYmUgc2V0OyBpbiBhZGRpdGlvbiwgdGhlIGJnIGNvbG9yIGNhbiBiZVxuICAgICAgICBzZXQgdG8gaXRzIGRlZmF1bHQgKG9yICd0cmFuc3BhcmVudCcpLCB3aGljaCB3aWxsIHNob3cgdGhlIHRlcm1pbmFsJ3Mgb3IgdGhlIHRlcm1pbmFsIGVtdWxhdG9yJ3NcbiAgICAgICAgY29uZmlndXJlZCBiZyBjb2xvclxuICAgICAgKiBhcyBmb3IgdGhlIGZvcmVncm91bmQgKCdmZycpLCBjb2xvcnMgYW5kIGVmZmVjdHMgc3VjaCBhcyBibGlua2luZywgYm9sZCwgaXRhbGljLCB1bmRlcmxpbmUsIG92ZXJsaW5lLFxuICAgICAgICBzdHJpa2UgY2FuIGJlIHNldDsgaW4gYWRkaXRpb24sIHRoZSBjb25maWd1cmVkIHRlcm1pbmFsIGRlZmF1bHQgZm9udCBjb2xvciBjYW4gYmUgc2V0LCBhbmQgZWFjaCBlZmZlY3RcbiAgICAgICAgaGFzIGEgZGVkaWNhdGVkIG9mZi1zd2l0Y2hcbiAgICAgICogbmVhdCB0YWJsZXMgY2FuIGJlIGRyYXduIGJ5IGNvbWJpbmluZyB0aGUgb3ZlcmxpbmUgZWZmZWN0IHdpdGggYOKUgmAgVSsyNTAyICdCb3ggRHJhd2luZyBMaWdodCBWZXJ0aWNhbFxuICAgICAgICBMaW5lJzsgdGhlIHJlbm1hcmthYmxlIGZlYXR1cmUgb2YgdGhpcyBpcyB0aGF0IGl0IG1pbmltaXplcyBzcGFjaW5nIGFyb3VuZCBjaGFyYWN0ZXJzIG1lYW5pbmcgaXQnc1xuICAgICAgICBwb3NzaWJsZSB0byBoYXZlIGFkamFjZW50IHJvd3Mgb2YgY2VsbHMgc2VwYXJhdGVkIGZyb20gdGhlIG5leHQgcm93IGJ5IGEgYm9yZGVyIHdpdGhvdXQgaGF2aW5nIHRvXG4gICAgICAgIHNhY3JpZmljZSBhIGxpbmUgb2YgdGV4dCBqdXN0IHRvIGRyYXcgdGhlIGJvcmRlci5cbiAgICAgICogd2hpbGUgdGhlIHR3byBjb2xvciBwYWxhdHRlcyBpbXBsaWVkIGJ5IHRoZSBzdGFuZGFyZCBYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhcbiAgICAgICAgKiBiZXR0ZXIgdG8gb25seSB1c2UgZnVsbCBSR0IgdGhhbiB0byBmdXp6IGFyb3VuZCB3aXRoIHBhbGV0dGVzXG4gICAgICAgICogYXBwcyB0aGF0IHVzZSBjb2xvcnMgYXQgYWxsIHNob3VsZCBiZSBwcmVwYXJlZCBmb3IgZGFyayBhbmQgYnJpZ2h0IGJhY2tncm91bmRzXG4gICAgICAgICogaW4gZ2VuZXJhbCBiZXR0ZXIgdG8gc2V0IGZnLCBiZyBjb2xvcnMgdGhhbiB0byB1c2UgcmV2ZXJzZVxuICAgICAgICAqIGJ1dCByZXZlcnNlIGFjdHVhbGx5IGRvZXMgZG8gd2hhdCBpdCBzYXlz4oCUaXQgc3dhcHMgZmcgd2l0aCBiZyBjb2xvclxuXG4gICAgICBcXHgxYlszOW0gZGVmYXVsdCBmZyBjb2xvclxuICAgICAgXFx4MWJbNDltIGRlZmF1bHQgYmcgY29sb3JcblxuICAgICAgIyMjXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZmdfZnJvbV9kZWM6IChbIHIsIGcsIGIsIF0pIC0+IFwiXFx4MWJbMzg6Mjo6I3tyfToje2d9OiN7Yn1tXCJcbiAgICAgIGJnX2Zyb21fZGVjOiAoWyByLCBnLCBiLCBdKSAtPiBcIlxceDFiWzQ4OjI6OiN7cn06I3tnfToje2J9bVwiXG4gICAgICBmZ19mcm9tX2hleDogKCByaHggKSAtPiBAZmdfZnJvbV9kZWMgQGRlY19mcm9tX2hleCByaHhcbiAgICAgIGJnX2Zyb21faGV4OiAoIHJoeCApIC0+IEBiZ19mcm9tX2RlYyBAZGVjX2Zyb21faGV4IHJoeFxuICAgICAgZmdfZnJvbV9uYW1lOiAoIG5hbWUgKSAtPlxuICAgICAgICByZ2IgPSBAY29sb3JzWyBuYW1lIF0gPyBAY29sb3JzLmZhbGxiYWNrXG4gICAgICAgIHJldHVybiBAZmdfZnJvbV9kZWMgcmdiXG4gICAgICBkZWNfZnJvbV9oZXg6ICggaGV4ICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdHlwaW5nICMjI1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzMgZXhwZWN0ZWQgdGV4dCwgZ290ICN7cnByIGhleH1cIiB1bmxlc3MgKCB0eXBlb2YgaGV4ICkgaXMgJ3N0cmluZydcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX180IG5vdCBhIHByb3BlciBoZXhhZGVjaW1hbCBSR0IgY29kZTogJyN7aGV4LnJlcGxhY2UgLycvZywgXCJcXFxcJ1wifSdcIiB1bmxlc3MgL14jWzAtOWEtZl17Nn0kL2kudGVzdCBoZXhcbiAgICAgICAgWyByMTYsIGcxNiwgYjE2LCBdID0gWyBoZXhbIDEgLi4gMiBdLCBoZXhbIDMgLi4gNCBdLCBoZXhbIDUgLi4gNiBdLCBdXG4gICAgICAgIHJldHVybiBbICggcGFyc2VJbnQgcjE2LCAxNiApLCAoIHBhcnNlSW50IGcxNiwgMTYgKSwgKCBwYXJzZUludCBiMTYsIDE2ICksIF1cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgQU5TSSwgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Fuc2lfY29sb3JzX2FuZF9lZmZlY3RzOiAtPlxuICAgIHsgQU5TSSwgfSA9IEFOU0lfQlJJQ1MucmVxdWlyZV9hbnNpKClcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmdiX2RlYyA9XG4gICAgICBibGFjazogICAgICAgICAgICAgIFsgICAwLCAgIDAsICAgMCwgXVxuICAgICAgZGFya3NsYXRlZ3JheTogICAgICBbICA0NywgIDc5LCAgNzksIF1cbiAgICAgIGRpbWdyYXk6ICAgICAgICAgICAgWyAxMDUsIDEwNSwgMTA1LCBdXG4gICAgICBzbGF0ZWdyYXk6ICAgICAgICAgIFsgMTEyLCAxMjgsIDE0NCwgXVxuICAgICAgZ3JheTogICAgICAgICAgICAgICBbIDEyOCwgMTI4LCAxMjgsIF1cbiAgICAgIGxpZ2h0c2xhdGVncmF5OiAgICAgWyAxMTksIDEzNiwgMTUzLCBdXG4gICAgICBkYXJrZ3JheTogICAgICAgICAgIFsgMTY5LCAxNjksIDE2OSwgXVxuICAgICAgc2lsdmVyOiAgICAgICAgICAgICBbIDE5MiwgMTkyLCAxOTIsIF1cbiAgICAgIGxpZ2h0Z3JheTogICAgICAgICAgWyAyMTEsIDIxMSwgMjExLCBdXG4gICAgICBnYWluc2Jvcm86ICAgICAgICAgIFsgMjIwLCAyMjAsIDIyMCwgXVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZ2JfaGV4ID1cbiAgICAgIHdoaXRlOiAgICAgICAgICAgICcjZmZmZmZmJ1xuICAgICAgYW1ldGh5c3Q6ICAgICAgICAgJyNmMGEzZmYnXG4gICAgICBibHVlOiAgICAgICAgICAgICAnIzAwNzVkYydcbiAgICAgIGNhcmFtZWw6ICAgICAgICAgICcjOTkzZjAwJ1xuICAgICAgZGFtc29uOiAgICAgICAgICAgJyM0YzAwNWMnXG4gICAgICBlYm9ueTogICAgICAgICAgICAnIzE5MTkxOSdcbiAgICAgIGZvcmVzdDogICAgICAgICAgICcjMDA1YzMxJ1xuICAgICAgZ3JlZW46ICAgICAgICAgICAgJyMyYmNlNDgnXG4gICAgICBsaW1lOiAgICAgICAgICAgICAnIzlkY2MwMCdcbiAgICAgIHF1YWdtaXJlOiAgICAgICAgICcjNDI2NjAwJ1xuICAgICAgaG9uZXlkZXc6ICAgICAgICAgJyNmZmNjOTknXG4gICAgICBpcm9uOiAgICAgICAgICAgICAnIzgwODA4MCdcbiAgICAgIGphZGU6ICAgICAgICAgICAgICcjOTRmZmI1J1xuICAgICAga2hha2k6ICAgICAgICAgICAgJyM4ZjdjMDAnXG4gICAgICBtYWxsb3c6ICAgICAgICAgICAnI2MyMDA4OCdcbiAgICAgIG5hdnk6ICAgICAgICAgICAgICcjMDAzMzgwJ1xuICAgICAgb3JwaW1lbnQ6ICAgICAgICAgJyNmZmE0MDUnXG4gICAgICBwaW5rOiAgICAgICAgICAgICAnI2ZmYThiYidcbiAgICAgIHJlZDogICAgICAgICAgICAgICcjZmYwMDEwJ1xuICAgICAgc2t5OiAgICAgICAgICAgICAgJyM1ZWYxZjInXG4gICAgICB0dXJxdW9pc2U6ICAgICAgICAnIzAwOTk4ZidcbiAgICAgIHZpb2xldDogICAgICAgICAgICcjNzQwYWZmJ1xuICAgICAgd2luZTogICAgICAgICAgICAgJyM5OTAwMDAnXG4gICAgICB1cmFuaXVtOiAgICAgICAgICAnI2UwZmY2NidcbiAgICAgIHhhbnRoaW46ICAgICAgICAgICcjZmZmZjgwJ1xuICAgICAgeWVsbG93OiAgICAgICAgICAgJyNmZmUxMDAnXG4gICAgICB6aW5uaWE6ICAgICAgICAgICAnI2ZmNTAwNSdcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgUiA9XG4gICAgICBvdmVybGluZTE6ICAgICAgICAgICdcXHgxYls1M20nXG4gICAgICBvdmVybGluZTA6ICAgICAgICAgICdcXHgxYls1NW0nXG4gICAgICBkZWZhdWx0OiAgICAgICAgICAgICdcXHgxYlszOW0nXG4gICAgICBiZ19kZWZhdWx0OiAgICAgICAgICdcXHgxYls0OW0nXG4gICAgICBib2xkOiAgICAgICAgICAgICAgICdcXHgxYlsxbSdcbiAgICAgIGJvbGQwOiAgICAgICAgICAgICAgJ1xceDFiWzIybSdcbiAgICAgIGl0YWxpYzogICAgICAgICAgICAgJ1xceDFiWzNtJ1xuICAgICAgaXRhbGljMDogICAgICAgICAgICAnXFx4MWJbMjNtJ1xuICAgICAgcmVzZXQ6ICAgICAgICAgICAgICAnXFx4MWJbMG0nXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgYmxhY2s6ICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuYmxhY2tcbiAgICAgIGRhcmtzbGF0ZWdyYXk6ICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmRhcmtzbGF0ZWdyYXlcbiAgICAgIGRpbWdyYXk6ICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmRpbWdyYXlcbiAgICAgIHNsYXRlZ3JheTogICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLnNsYXRlZ3JheVxuICAgICAgZ3JheTogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuZ3JheVxuICAgICAgbGlnaHRzbGF0ZWdyYXk6ICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMubGlnaHRzbGF0ZWdyYXlcbiAgICAgIGRhcmtncmF5OiAgICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmRhcmtncmF5XG4gICAgICBzaWx2ZXI6ICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5zaWx2ZXJcbiAgICAgIGxpZ2h0Z3JheTogICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmxpZ2h0Z3JheVxuICAgICAgZ2FpbnNib3JvOiAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuZ2FpbnNib3JvXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgd2hpdGU6ICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgud2hpdGVcbiAgICAgIGFtZXRoeXN0OiAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmFtZXRoeXN0XG4gICAgICBibHVlOiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5ibHVlXG4gICAgICBjYXJhbWVsOiAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5jYXJhbWVsXG4gICAgICBkYW1zb246ICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5kYW1zb25cbiAgICAgIGVib255OiAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmVib255XG4gICAgICBmb3Jlc3Q6ICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5mb3Jlc3RcbiAgICAgIGdyZWVuOiAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmdyZWVuXG4gICAgICBsaW1lOiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5saW1lXG4gICAgICBxdWFnbWlyZTogICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5xdWFnbWlyZVxuICAgICAgaG9uZXlkZXc6ICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguaG9uZXlkZXdcbiAgICAgIGlyb246ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4Lmlyb25cbiAgICAgIGphZGU6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmphZGVcbiAgICAgIGtoYWtpOiAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmtoYWtpXG4gICAgICBtYWxsb3c6ICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5tYWxsb3dcbiAgICAgIG5hdnk6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4Lm5hdnlcbiAgICAgIG9ycGltZW50OiAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4Lm9ycGltZW50XG4gICAgICBwaW5rOiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5waW5rXG4gICAgICByZWQ6ICAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5yZWRcbiAgICAgIHNreTogICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnNreVxuICAgICAgdHVycXVvaXNlOiAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgudHVycXVvaXNlXG4gICAgICB2aW9sZXQ6ICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC52aW9sZXRcbiAgICAgIHdpbmU6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LndpbmVcbiAgICAgIHVyYW5pdW06ICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnVyYW5pdW1cbiAgICAgIHhhbnRoaW46ICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnhhbnRoaW5cbiAgICAgIHllbGxvdzogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnllbGxvd1xuICAgICAgemlubmlhOiAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguemlubmlhXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgYmdfYmxhY2s6ICAgICAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuYmxhY2tcbiAgICAgIGJnX2RhcmtzbGF0ZWdyYXk6ICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmRhcmtzbGF0ZWdyYXlcbiAgICAgIGJnX2RpbWdyYXk6ICAgICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmRpbWdyYXlcbiAgICAgIGJnX3NsYXRlZ3JheTogICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLnNsYXRlZ3JheVxuICAgICAgYmdfZ3JheTogICAgICAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuZ3JheVxuICAgICAgYmdfbGlnaHRzbGF0ZWdyYXk6ICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMubGlnaHRzbGF0ZWdyYXlcbiAgICAgIGJnX2RhcmtncmF5OiAgICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmRhcmtncmF5XG4gICAgICBiZ19zaWx2ZXI6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5zaWx2ZXJcbiAgICAgIGJnX2xpZ2h0Z3JheTogICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmxpZ2h0Z3JheVxuICAgICAgYmdfZ2FpbnNib3JvOiAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuZ2FpbnNib3JvXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgYmdfd2hpdGU6ICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgud2hpdGVcbiAgICAgIGJnX2FtZXRoeXN0OiAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmFtZXRoeXN0XG4gICAgICBiZ19ibHVlOiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5ibHVlXG4gICAgICBiZ19jYXJhbWVsOiAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5jYXJhbWVsXG4gICAgICBiZ19kYW1zb246ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5kYW1zb25cbiAgICAgIGJnX2Vib255OiAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmVib255XG4gICAgICBiZ19mb3Jlc3Q6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5mb3Jlc3RcbiAgICAgIGJnX2dyZWVuOiAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmdyZWVuXG4gICAgICBiZ19saW1lOiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5saW1lXG4gICAgICBiZ19xdWFnbWlyZTogICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5xdWFnbWlyZVxuICAgICAgYmdfaG9uZXlkZXc6ICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguaG9uZXlkZXdcbiAgICAgIGJnX2lyb246ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4Lmlyb25cbiAgICAgIGJnX2phZGU6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmphZGVcbiAgICAgIGJnX2toYWtpOiAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmtoYWtpXG4gICAgICBiZ19tYWxsb3c6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5tYWxsb3dcbiAgICAgIGJnX25hdnk6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4Lm5hdnlcbiAgICAgIGJnX29ycGltZW50OiAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4Lm9ycGltZW50XG4gICAgICBiZ19waW5rOiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5waW5rXG4gICAgICBiZ19yZWQ6ICAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5yZWRcbiAgICAgIGJnX3NreTogICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnNreVxuICAgICAgYmdfdHVycXVvaXNlOiAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgudHVycXVvaXNlXG4gICAgICBiZ192aW9sZXQ6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC52aW9sZXRcbiAgICAgIGJnX3dpbmU6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LndpbmVcbiAgICAgIGJnX3VyYW5pdW06ICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnVyYW5pdW1cbiAgICAgIGJnX3hhbnRoaW46ICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnhhbnRoaW5cbiAgICAgIGJnX3llbGxvdzogICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnllbGxvd1xuICAgICAgYmdfemlubmlhOiAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguemlubmlhXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiB7IGFuc2lfY29sb3JzX2FuZF9lZmZlY3RzOiBSLCB9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfc3RyaXBfYW5zaTogLT5cbiAgICAjIyMgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvYmxvYi8yMWVhYzc5M2NkNzQ2ZWFiMGIzNmQ3NWFmNWUxNmFlZDExZjlhYTRiL2xpYi9pbnRlcm5hbC91dGlsL2luc3BlY3QuanMjTDI1MjEgIyMjXG4gICAgIyMjIGF1Z21lbnRlZCB0byBhbHNvIG1hdGNoIGNvbG9ucyBhcyBwZXIgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSMyNC1iaXQgIyMjXG4gICAgYGBgXG4gICAgLy8gUmVnZXggdXNlZCBmb3IgYW5zaSBlc2NhcGUgY29kZSBzcGxpdHRpbmdcbiAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9jaGFsay9hbnNpLXJlZ2V4L2Jsb2IvZjMzOGUxODE0MTQ0ZWZiOTUwMjc2YWFjODQxMzVmZjg2YjcyZGM4ZS9pbmRleC5qc1xuICAgIC8vIExpY2Vuc2U6IE1JVCBieSBTaW5kcmUgU29yaHVzIDxzaW5kcmVzb3JodXNAZ21haWwuY29tPlxuICAgIC8vIE1hdGNoZXMgYWxsIGFuc2kgZXNjYXBlIGNvZGUgc2VxdWVuY2VzIGluIGEgc3RyaW5nXG4gICAgY29uc3QgY2hhbGtfYW5zaV9yZSA9IG5ldyBSZWdFeHAoXG4gICAgICAnW1xcXFx1MDAxQlxcXFx1MDA5Ql1bW1xcXFxdKCkjOzo/XSonICtcbiAgICAgICcoPzooPzooPzooPzpbOzpdWy1hLXpBLVpcXFxcZFxcXFwvXFxcXCMmLjo9PyVAfl9dKykqJyArXG4gICAgICAnfFthLXpBLVpcXFxcZF0rKD86Wzs6XVstYS16QS1aXFxcXGRcXFxcL1xcXFwjJi46PT8lQH5fXSopKik/JyArXG4gICAgICAnKD86XFxcXHUwMDA3fFxcXFx1MDAxQlxcXFx1MDA1Q3xcXFxcdTAwOUMpKScgK1xuICAgICAgJ3woPzooPzpcXFxcZHsxLDR9KD86Wzs6XVxcXFxkezAsNH0pKik/JyArXG4gICAgICAnW1xcXFxkQS1QUi1UWmNmLW5xLXV5PT48fl0pKScsICdnJyxcbiAgICApO1xuICAgIGBgYFxuICAgIG93bl9zaW5nbGVfYW5zaV9yZSAgPSAvLy8gICAoICAgXFx4MWIgXFxbIFteIFxceDQwIC0gXFx4N2UgXSogWyBcXHg0MCAtIFxceDdlIF0gKSAgICAvLy9nXG4gICAgb3duX2Fuc2lfcmUgICAgICAgICA9IC8vLyAoICg/OiBcXHgxYiBcXFsgW14gXFx4NDAgLSBcXHg3ZSBdKiBbIFxceDQwIC0gXFx4N2UgXSApKyApIC8vL2dcbiAgICBzdHJpcF9hbnNpICAgICAgICAgID0gKCB0ZXh0ICkgLT4gdGV4dC5yZXBsYWNlIG93bl9hbnNpX3JlLCAnJ1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4geyBzdHJpcF9hbnNpLCBpbnRlcm5hbHM6IHsgYW5zaV9yZTogb3duX2Fuc2lfcmUsIG93bl9zaW5nbGVfYW5zaV9yZSwgfSwgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Fuc2lfY2h1bmtlcjogLT5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBWQVJJT1VTX0JSSUNTICAgICAgICAgICA9IHJlcXVpcmUgJy4vdmFyaW91cy1icmljcydcbiAgICB7IHNldF9nZXR0ZXIsXG4gICAgICBoaWRlLCAgICAgICAgICAgICAgIH0gPSBWQVJJT1VTX0JSSUNTLnJlcXVpcmVfbWFuYWdlZF9wcm9wZXJ0eV90b29scygpXG4gICAgc2VnbWVudGVyICAgICAgICAgICAgICAgPSBuZXcgSW50bC5TZWdtZW50ZXIoKVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBzaW1wbGVfZ2V0X3dpZHRoICA9ICggdGV4dCApIC0+ICggQXJyYXkuZnJvbSB0ZXh0ICkubGVuZ3RoXG4gICAgYW5zaV9zcGxpdHRlciAgICAgPSAvKCg/OlxceDFiXFxbW15tXSttKSspL2dcbiAgICBqc19zZWdtZW50aXplICAgICA9ICggdGV4dCApIC0+ICggZC5zZWdtZW50IGZvciBkIGZyb20gc2VnbWVudGVyLnNlZ21lbnQgdGV4dCApXG4gICAgY2ZnX3RlbXBsYXRlICAgICAgPSBPYmplY3QuZnJlZXplXG4gICAgICBzcGxpdHRlcjogICAgICAgICAgIGFuc2lfc3BsaXR0ZXJcbiAgICAgIGdldF93aWR0aDogICAgICAgICAgc2ltcGxlX2dldF93aWR0aFxuICAgICAgc2VnbWVudGl6ZTogICAgICAgICBqc19zZWdtZW50aXplXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGludGVybmFscyAgICAgICAgID0gT2JqZWN0LmZyZWV6ZSB7IHNpbXBsZV9nZXRfd2lkdGgsIGFuc2lfc3BsaXR0ZXIsIGpzX3NlZ21lbnRpemUsIGNmZ190ZW1wbGF0ZSwgfVxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIENodW5rXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBbU3ltYm9sLml0ZXJhdG9yXTogLT4geWllbGQgZnJvbSBAdGV4dFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICh7IGhhc19hbnNpLCB3aWR0aCwgdGV4dCwgfSkgLT5cbiAgICAgICAgQHdpZHRoID0gd2lkdGhcbiAgICAgICAgaGlkZSBALCAnaGFzX2Fuc2knLCBoYXNfYW5zaVxuICAgICAgICBoaWRlIEAsICd0ZXh0JywgICAgIHRleHRcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X2dldHRlciBAOjosICdsZW5ndGgnLCAtPiBAdGV4dC5sZW5ndGhcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBBbnNpX2NodW5rZXJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIFtTeW1ib2wuaXRlcmF0b3JdOiAtPiB5aWVsZCBmcm9tIEBjaHVua3NcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGNmZyA9IG51bGwgKSAtPlxuICAgICAgICBoaWRlIEAsICdjZmcnLCB7IGNmZ190ZW1wbGF0ZS4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIGhpZGUgQCwgJ2NodW5rcycsICAgW11cbiAgICAgICAgQHJlc2V0KClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X2dldHRlciBAOjosICdoYXNfYW5zaScsIC0+XG4gICAgICAgIGZvciBjaHVuayBpbiBAY2h1bmtzXG4gICAgICAgICAgcmV0dXJuIHRydWUgaWYgY2h1bmsuaGFzX2Fuc2lcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ3dpZHRoJywgIC0+IEBjaHVua3MucmVkdWNlICggKCBzdW0sIGNodW5rICkgLT4gc3VtICsgY2h1bmsud2lkdGggICApLCAwXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2xlbmd0aCcsIC0+IEBjaHVua3MucmVkdWNlICggKCBzdW0sIGNodW5rICkgLT4gc3VtICsgY2h1bmsubGVuZ3RoICApLCAwXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ3RleHQnLCAgIC0+IEBjaHVua3MucmVkdWNlICggKCBzdW0sIGNodW5rICkgLT4gc3VtICsgY2h1bmsudGV4dCAgICApLCAnJ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcmVzZXQ6IC0+XG4gICAgICAgIEBjaHVua3MgICA9IFtdXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjaHVua2lmeTogKCBzb3VyY2UgKSAtPlxuICAgICAgICBAcmVzZXQoKVxuICAgICAgICBpZiBzb3VyY2UgaXMgJydcbiAgICAgICAgICAjIyMgVEFJTlQgbWlnaHQgYXMgd2VsbCByZXR1cm4gYW4gZW1wdHkgbGlzdCBvZiBAY2h1bmtzICMjI1xuICAgICAgICAgIEBjaHVua3MucHVzaCBuZXcgQ2h1bmsgeyBoYXNfYW5zaTogZmFsc2UsIHdpZHRoOiAwLCB0ZXh0OiAnJywgfVxuICAgICAgICAgIHJldHVybiBAXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBoYXNfYW5zaSA9IHRydWVcbiAgICAgICAgZm9yIHRleHQgaW4gc291cmNlLnNwbGl0IEBjZmcuc3BsaXR0ZXJcbiAgICAgICAgICBoYXNfYW5zaSAgPSBub3QgaGFzX2Fuc2lcbiAgICAgICAgICBjb250aW51ZSBpZiB0ZXh0IGlzICcnXG4gICAgICAgICAgd2lkdGggICAgID0gaWYgaGFzX2Fuc2kgdGhlbiAwIGVsc2UgQGNmZy5nZXRfd2lkdGggdGV4dFxuICAgICAgICAgIEBjaHVua3MucHVzaCBuZXcgQ2h1bmsgeyBoYXNfYW5zaSwgd2lkdGgsIHRleHQsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBAXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2h1bmtpZnkgPSAoIHRleHQgKSAtPiBuZXcgQW5zaV9jaHVua2VyIHRleHRcblxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHJldHVybiBleHBvcnRzID0geyBBbnNpX2NodW5rZXIsIGNodW5raWZ5LCBpbnRlcm5hbHMsIH1cblxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Nocl9nYXVnZTogLT5cbiAgICB7IGFuc2lfY29sb3JzX2FuZF9lZmZlY3RzOiBDLCB9ID0gQU5TSV9CUklDUy5yZXF1aXJlX2Fuc2lfY29sb3JzX2FuZF9lZmZlY3RzKClcbiAgICBidWlsZF9jaHJfZ2F1Z2UgPSAoeyBsZW5ndGggPSAzMCwgfSkgLT5cbiAgICAgIGV2ZW5fY29sb3IgICAgPSAoIHggKSAtPiBDLmJnX3llbGxvdyAgKyBDLmJsYWNrICAgKyBDLmJvbGQgKyBcIiN7eH1cIiArIEMucmVzZXRcbiAgICAgIG9kZF9jb2xvciAgICAgPSAoIHggKSAtPiBDLmJnX2JsYWNrICAgKyBDLnllbGxvdyAgKyBDLmJvbGQgKyBcIiN7eH1cIiArIEMucmVzZXRcbiAgICAgIGRlY2FkZV9jb2xvciAgPSAoIHggKSAtPiBDLmJnX3doaXRlICAgKyBDLnJlZCAgICAgKyBDLmJvbGQgKyBcIiN7eH1cIiArIEMucmVzZXRcbiAgICAgIGRlY2FkZSAgICAgICAgPSAwXG4gICAgICBjb3VudCAgICAgICAgID0gMFxuICAgICAgUiAgICAgICAgICAgICA9ICcnXG4gICAgICBsb29wXG4gICAgICAgIGZvciB1bml0IGluIFsgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMCwgXVxuICAgICAgICAgIGNvdW50KytcbiAgICAgICAgICBicmVhayBpZiBjb3VudCA+IGxlbmd0aFxuICAgICAgICAgIGlmIHVuaXQgaXMgMFxuICAgICAgICAgICAgZGVjYWRlKytcbiAgICAgICAgICAgIFIgKz0gZGVjYWRlX2NvbG9yIGRlY2FkZVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIFIgKz0gKCBpZiB1bml0ICUlIDIgaXMgMCB0aGVuIGV2ZW5fY29sb3IgZWxzZSBvZGRfY29sb3IgKSB1bml0XG4gICAgICAgIGJyZWFrIGlmIGNvdW50ID4gbGVuZ3RoXG4gICAgICByZXR1cm4gUlxuXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGJ1aWxkX2Nocl9nYXVnZSwgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIEFOU0lfQlJJQ1NcblxuIl19
//# sourceURL=../src/ansi-brics.coffee