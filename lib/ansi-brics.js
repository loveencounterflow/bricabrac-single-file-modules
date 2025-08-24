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
        overline: '\x1b[53m',
        overline0: '\x1b[55m',
        underline: '\x1b[4m',
        underline0: '\x1b[24m',
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
      strip_ansi = function(text, replacement = '') {
        return text.replace(own_ansi_re, replacement);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Fuc2ktYnJpY3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLFVBQUE7SUFBQSwyREFBQTs7Ozs7RUFLQSxVQUFBLEdBS0UsQ0FBQTs7OztJQUFBLFlBQUEsRUFBYyxRQUFBLENBQUEsQ0FBQTtBQUVoQixVQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQTs7TUFDSSxJQUFBLEdBQU8sSUFBQSxDQUFVLE9BQU4sTUFBQSxLQUFBLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQXdCVCxXQUFhLENBQUMsQ0FBRSxDQUFGLEVBQUssQ0FBTCxFQUFRLENBQVIsQ0FBRCxDQUFBO2lCQUFrQixDQUFBLFdBQUEsQ0FBQSxDQUFjLENBQWQsQ0FBQSxDQUFBLENBQUEsQ0FBbUIsQ0FBbkIsQ0FBQSxDQUFBLENBQUEsQ0FBd0IsQ0FBeEIsQ0FBQSxDQUFBO1FBQWxCOztRQUNiLFdBQWEsQ0FBQyxDQUFFLENBQUYsRUFBSyxDQUFMLEVBQVEsQ0FBUixDQUFELENBQUE7aUJBQWtCLENBQUEsV0FBQSxDQUFBLENBQWMsQ0FBZCxDQUFBLENBQUEsQ0FBQSxDQUFtQixDQUFuQixDQUFBLENBQUEsQ0FBQSxDQUF3QixDQUF4QixDQUFBLENBQUE7UUFBbEI7O1FBQ2IsV0FBYSxDQUFFLEdBQUYsQ0FBQTtpQkFBVyxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxZQUFELENBQWMsR0FBZCxDQUFiO1FBQVg7O1FBQ2IsV0FBYSxDQUFFLEdBQUYsQ0FBQTtpQkFBVyxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxZQUFELENBQWMsR0FBZCxDQUFiO1FBQVg7O1FBQ2IsWUFBYyxDQUFFLElBQUYsQ0FBQTtBQUNwQixjQUFBLEdBQUEsRUFBQTtVQUFRLEdBQUEsNkNBQXdCLElBQUMsQ0FBQSxNQUFNLENBQUM7QUFDaEMsaUJBQU8sSUFBQyxDQUFBLFdBQUQs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eEQ7UUFDaEIsWUFBQSxHQUFnQixRQUFBLENBQUUsQ0FBRixDQUFBO2lCQUFTLENBQUMsQ0FBQyxRQUFGLEdBQWUsQ0FBQyxDQUFDLEdBQWpCLEdBQTJCLENBQUMsQ0FBQyxJQUE3QixHQUFvQyxDQUFBLENBQUEsQ0FBRyxDQUFILENBQUEsQ0FBcEMsR0FBNkMsQ0FBQyxDQUFDO1FBQXhEO1FBQ2hCLE1BQUEsR0FBZ0I7UUFDaEIsS0FBQSxHQUFnQjtRQUNoQixDQUFBLEdBQWdCO0FBQ2hCLGVBQUEsSUFBQTtBQUNFO1VBQUEsS0FBQSxxQ0FBQTs7WUFDRSxLQUFBO1lBQ0EsSUFBUyxLQUFBLEdBQVEsTUFBakI7QUFBQSxvQkFBQTs7WUFDQSxJQUFHLElBQUEsS0FBUSxDQUFYO2NBQ0UsTUFBQTtjQUNBLENBQUEsSUFBSyxZQUFBLENBQWEsTUFBYixFQUZQO2FBQUEsTUFBQTtjQUlFLENBQUEsSUFBSyxRQUFLLE1BQVEsRUFBUixLQUFhLENBQWhCLEdBQXVCLFVBQXZCLEdBQXVDLFNBQXpDLENBQUEsQ0FBcUQsSUFBckQsRUFKUDs7VUFIRjtVQVFBLElBQVMsS0FBQSxHQUFRLE1BQWpCO0FBQUEsa0JBQUE7O1FBVEY7QUFVQSxlQUFPO01BakJTLEVBRHRCOztBQXNCSSxhQUFPLE9BQUEsR0FBVSxDQUFFLGVBQUY7SUF2QkE7RUE1U25CLEVBVkY7OztFQWdWQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixVQUE5QjtBQWhWQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQU5TSV9CUklDUyA9XG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Fuc2k6IC0+XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgQU5TSSA9IG5ldyBjbGFzcyBBbnNpXG4gICAgICAjIyNcblxuICAgICAgKiBhcyBmb3IgdGhlIGJhY2tncm91bmQgKCdiZycpLCBvbmx5IGNvbG9ycyBhbmQgbm8gZWZmZWN0cyBjYW4gYmUgc2V0OyBpbiBhZGRpdGlvbiwgdGhlIGJnIGNvbG9yIGNhbiBiZVxuICAgICAgICBzZXQgdG8gaXRzIGRlZmF1bHQgKG9yICd0cmFuc3BhcmVudCcpLCB3aGljaCB3aWxsIHNob3cgdGhlIHRlcm1pbmFsJ3Mgb3IgdGhlIHRlcm1pbmFsIGVtdWxhdG9yJ3NcbiAgICAgICAgY29uZmlndXJlZCBiZyBjb2xvclxuICAgICAgKiBhcyBmb3IgdGhlIGZvcmVncm91bmQgKCdmZycpLCBjb2xvcnMgYW5kIGVmZmVjdHMgc3VjaCBhcyBibGlua2luZywgYm9sZCwgaXRhbGljLCB1bmRlcmxpbmUsIG92ZXJsaW5lLFxuICAgICAgICBzdHJpa2UgY2FuIGJlIHNldDsgaW4gYWRkaXRpb24sIHRoZSBjb25maWd1cmVkIHRlcm1pbmFsIGRlZmF1bHQgZm9udCBjb2xvciBjYW4gYmUgc2V0LCBhbmQgZWFjaCBlZmZlY3RcbiAgICAgICAgaGFzIGEgZGVkaWNhdGVkIG9mZi1zd2l0Y2hcbiAgICAgICogbmVhdCB0YWJsZXMgY2FuIGJlIGRyYXduIGJ5IGNvbWJpbmluZyB0aGUgb3ZlcmxpbmUgZWZmZWN0IHdpdGggYOKUgmAgVSsyNTAyICdCb3ggRHJhd2luZyBMaWdodCBWZXJ0aWNhbFxuICAgICAgICBMaW5lJzsgdGhlIHJlbm1hcmthYmxlIGZlYXR1cmUgb2YgdGhpcyBpcyB0aGF0IGl0IG1pbmltaXplcyBzcGFjaW5nIGFyb3VuZCBjaGFyYWN0ZXJzIG1lYW5pbmcgaXQnc1xuICAgICAgICBwb3NzaWJsZSB0byBoYXZlIGFkamFjZW50IHJvd3Mgb2YgY2VsbHMgc2VwYXJhdGVkIGZyb20gdGhlIG5leHQgcm93IGJ5IGEgYm9yZGVyIHdpdGhvdXQgaGF2aW5nIHRvXG4gICAgICAgIHNhY3JpZmljZSBhIGxpbmUgb2YgdGV4dCBqdXN0IHRvIGRyYXcgdGhlIGJvcmRlci5cbiAgICAgICogd2hpbGUgdGhlIHR3byBjb2xvciBwYWxhdHRlcyBpbXBsaWVkIGJ5IHRoZSBzdGFuZGFyZCBYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhcbiAgICAgICAgKiBiZXR0ZXIgdG8gb25seSB1c2UgZnVsbCBSR0IgdGhhbiB0byBmdXp6IGFyb3VuZCB3aXRoIHBhbGV0dGVzXG4gICAgICAgICogYXBwcyB0aGF0IHVzZSBjb2xvcnMgYXQgYWxsIHNob3VsZCBiZSBwcmVwYXJlZCBmb3IgZGFyayBhbmQgYnJpZ2h0IGJhY2tncm91bmRzXG4gICAgICAgICogaW4gZ2VuZXJhbCBiZXR0ZXIgdG8gc2V0IGZnLCBiZyBjb2xvcnMgdGhhbiB0byB1c2UgcmV2ZXJzZVxuICAgICAgICAqIGJ1dCByZXZlcnNlIGFjdHVhbGx5IGRvZXMgZG8gd2hhdCBpdCBzYXlz4oCUaXQgc3dhcHMgZmcgd2l0aCBiZyBjb2xvclxuXG4gICAgICBcXHgxYlszOW0gZGVmYXVsdCBmZyBjb2xvclxuICAgICAgXFx4MWJbNDltIGRlZmF1bHQgYmcgY29sb3JcblxuICAgICAgIyMjXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZmdfZnJvbV9kZWM6IChbIHIsIGcsIGIsIF0pIC0+IFwiXFx4MWJbMzg6Mjo6I3tyfToje2d9OiN7Yn1tXCJcbiAgICAgIGJnX2Zyb21fZGVjOiAoWyByLCBnLCBiLCBdKSAtPiBcIlxceDFiWzQ4OjI6OiN7cn06I3tnfToje2J9bVwiXG4gICAgICBmZ19mcm9tX2hleDogKCByaHggKSAtPiBAZmdfZnJvbV9kZWMgQGRlY19mcm9tX2hleCByaHhcbiAgICAgIGJnX2Zyb21faGV4OiAoIHJoeCApIC0+IEBiZ19mcm9tX2RlYyBAZGVjX2Zyb21faGV4IHJoeFxuICAgICAgZmdfZnJvbV9uYW1lOiAoIG5hbWUgKSAtPlxuICAgICAgICByZ2IgPSBAY29sb3JzWyBuYW1lIF0gPyBAY29sb3JzLmZhbGxiYWNrXG4gICAgICAgIHJldHVybiBAZmdfZnJvbV9kZWMgcmdiXG4gICAgICBkZWNfZnJvbV9oZXg6ICggaGV4ICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdHlwaW5nICMjI1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzMgZXhwZWN0ZWQgdGV4dCwgZ290ICN7cnByIGhleH1cIiB1bmxlc3MgKCB0eXBlb2YgaGV4ICkgaXMgJ3N0cmluZydcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX180IG5vdCBhIHByb3BlciBoZXhhZGVjaW1hbCBSR0IgY29kZTogJyN7aGV4LnJlcGxhY2UgLycvZywgXCJcXFxcJ1wifSdcIiB1bmxlc3MgL14jWzAtOWEtZl17Nn0kL2kudGVzdCBoZXhcbiAgICAgICAgWyByMTYsIGcxNiwgYjE2LCBdID0gWyBoZXhbIDEgLi4gMiBdLCBoZXhbIDMgLi4gNCBdLCBoZXhbIDUgLi4gNiBdLCBdXG4gICAgICAgIHJldHVybiBbICggcGFyc2VJbnQgcjE2LCAxNiApLCAoIHBhcnNlSW50IGcxNiwgMTYgKSwgKCBwYXJzZUludCBiMTYsIDE2ICksIF1cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgQU5TSSwgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Fuc2lfY29sb3JzX2FuZF9lZmZlY3RzOiAtPlxuICAgIHsgQU5TSSwgfSA9IEFOU0lfQlJJQ1MucmVxdWlyZV9hbnNpKClcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmdiX2RlYyA9XG4gICAgICBibGFjazogICAgICAgICAgICAgIFsgICAwLCAgIDAsICAgMCwgXVxuICAgICAgZGFya3NsYXRlZ3JheTogICAgICBbICA0NywgIDc5LCAgNzksIF1cbiAgICAgIGRpbWdyYXk6ICAgICAgICAgICAgWyAxMDUsIDEwNSwgMTA1LCBdXG4gICAgICBzbGF0ZWdyYXk6ICAgICAgICAgIFsgMTEyLCAxMjgsIDE0NCwgXVxuICAgICAgZ3JheTogICAgICAgICAgICAgICBbIDEyOCwgMTI4LCAxMjgsIF1cbiAgICAgIGxpZ2h0c2xhdGVncmF5OiAgICAgWyAxMTksIDEzNiwgMTUzLCBdXG4gICAgICBkYXJrZ3JheTogICAgICAgICAgIFsgMTY5LCAxNjksIDE2OSwgXVxuICAgICAgc2lsdmVyOiAgICAgICAgICAgICBbIDE5MiwgMTkyLCAxOTIsIF1cbiAgICAgIGxpZ2h0Z3JheTogICAgICAgICAgWyAyMTEsIDIxMSwgMjExLCBdXG4gICAgICBnYWluc2Jvcm86ICAgICAgICAgIFsgMjIwLCAyMjAsIDIyMCwgXVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZ2JfaGV4ID1cbiAgICAgIHdoaXRlOiAgICAgICAgICAgICcjZmZmZmZmJ1xuICAgICAgYW1ldGh5c3Q6ICAgICAgICAgJyNmMGEzZmYnXG4gICAgICBibHVlOiAgICAgICAgICAgICAnIzAwNzVkYydcbiAgICAgIGNhcmFtZWw6ICAgICAgICAgICcjOTkzZjAwJ1xuICAgICAgZGFtc29uOiAgICAgICAgICAgJyM0YzAwNWMnXG4gICAgICBlYm9ueTogICAgICAgICAgICAnIzE5MTkxOSdcbiAgICAgIGZvcmVzdDogICAgICAgICAgICcjMDA1YzMxJ1xuICAgICAgZ3JlZW46ICAgICAgICAgICAgJyMyYmNlNDgnXG4gICAgICBsaW1lOiAgICAgICAgICAgICAnIzlkY2MwMCdcbiAgICAgIHF1YWdtaXJlOiAgICAgICAgICcjNDI2NjAwJ1xuICAgICAgaG9uZXlkZXc6ICAgICAgICAgJyNmZmNjOTknXG4gICAgICBpcm9uOiAgICAgICAgICAgICAnIzgwODA4MCdcbiAgICAgIGphZGU6ICAgICAgICAgICAgICcjOTRmZmI1J1xuICAgICAga2hha2k6ICAgICAgICAgICAgJyM4ZjdjMDAnXG4gICAgICBtYWxsb3c6ICAgICAgICAgICAnI2MyMDA4OCdcbiAgICAgIG5hdnk6ICAgICAgICAgICAgICcjMDAzMzgwJ1xuICAgICAgb3JwaW1lbnQ6ICAgICAgICAgJyNmZmE0MDUnXG4gICAgICBwaW5rOiAgICAgICAgICAgICAnI2ZmYThiYidcbiAgICAgIHJlZDogICAgICAgICAgICAgICcjZmYwMDEwJ1xuICAgICAgc2t5OiAgICAgICAgICAgICAgJyM1ZWYxZjInXG4gICAgICB0dXJxdW9pc2U6ICAgICAgICAnIzAwOTk4ZidcbiAgICAgIHZpb2xldDogICAgICAgICAgICcjNzQwYWZmJ1xuICAgICAgd2luZTogICAgICAgICAgICAgJyM5OTAwMDAnXG4gICAgICB1cmFuaXVtOiAgICAgICAgICAnI2UwZmY2NidcbiAgICAgIHhhbnRoaW46ICAgICAgICAgICcjZmZmZjgwJ1xuICAgICAgeWVsbG93OiAgICAgICAgICAgJyNmZmUxMDAnXG4gICAgICB6aW5uaWE6ICAgICAgICAgICAnI2ZmNTAwNSdcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgUiA9XG4gICAgICBvdmVybGluZTogICAgICAgICAgICdcXHgxYls1M20nXG4gICAgICBvdmVybGluZTA6ICAgICAgICAgICdcXHgxYls1NW0nXG4gICAgICB1bmRlcmxpbmU6ICAgICAgICAgICdcXHgxYls0bSdcbiAgICAgIHVuZGVybGluZTA6ICAgICAgICAgJ1xceDFiWzI0bSdcbiAgICAgIGRlZmF1bHQ6ICAgICAgICAgICAgJ1xceDFiWzM5bSdcbiAgICAgIGJnX2RlZmF1bHQ6ICAgICAgICAgJ1xceDFiWzQ5bSdcbiAgICAgIGJvbGQ6ICAgICAgICAgICAgICAgJ1xceDFiWzFtJ1xuICAgICAgYm9sZDA6ICAgICAgICAgICAgICAnXFx4MWJbMjJtJ1xuICAgICAgaXRhbGljOiAgICAgICAgICAgICAnXFx4MWJbM20nXG4gICAgICBpdGFsaWMwOiAgICAgICAgICAgICdcXHgxYlsyM20nXG4gICAgICByZXNldDogICAgICAgICAgICAgICdcXHgxYlswbSdcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBibGFjazogICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5ibGFja1xuICAgICAgZGFya3NsYXRlZ3JheTogICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuZGFya3NsYXRlZ3JheVxuICAgICAgZGltZ3JheTogICAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuZGltZ3JheVxuICAgICAgc2xhdGVncmF5OiAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuc2xhdGVncmF5XG4gICAgICBncmF5OiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5ncmF5XG4gICAgICBsaWdodHNsYXRlZ3JheTogICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5saWdodHNsYXRlZ3JheVxuICAgICAgZGFya2dyYXk6ICAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuZGFya2dyYXlcbiAgICAgIHNpbHZlcjogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLnNpbHZlclxuICAgICAgbGlnaHRncmF5OiAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMubGlnaHRncmF5XG4gICAgICBnYWluc2Jvcm86ICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5nYWluc2Jvcm9cbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB3aGl0ZTogICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC53aGl0ZVxuICAgICAgYW1ldGh5c3Q6ICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguYW1ldGh5c3RcbiAgICAgIGJsdWU6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmJsdWVcbiAgICAgIGNhcmFtZWw6ICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmNhcmFtZWxcbiAgICAgIGRhbXNvbjogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmRhbXNvblxuICAgICAgZWJvbnk6ICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguZWJvbnlcbiAgICAgIGZvcmVzdDogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmZvcmVzdFxuICAgICAgZ3JlZW46ICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguZ3JlZW5cbiAgICAgIGxpbWU6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmxpbWVcbiAgICAgIHF1YWdtaXJlOiAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnF1YWdtaXJlXG4gICAgICBob25leWRldzogICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5ob25leWRld1xuICAgICAgaXJvbjogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguaXJvblxuICAgICAgamFkZTogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguamFkZVxuICAgICAga2hha2k6ICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgua2hha2lcbiAgICAgIG1hbGxvdzogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4Lm1hbGxvd1xuICAgICAgbmF2eTogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgubmF2eVxuICAgICAgb3JwaW1lbnQ6ICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgub3JwaW1lbnRcbiAgICAgIHBpbms6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnBpbmtcbiAgICAgIHJlZDogICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnJlZFxuICAgICAgc2t5OiAgICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguc2t5XG4gICAgICB0dXJxdW9pc2U6ICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC50dXJxdW9pc2VcbiAgICAgIHZpb2xldDogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnZpb2xldFxuICAgICAgd2luZTogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgud2luZVxuICAgICAgdXJhbml1bTogICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgudXJhbml1bVxuICAgICAgeGFudGhpbjogICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgueGFudGhpblxuICAgICAgeWVsbG93OiAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgueWVsbG93XG4gICAgICB6aW5uaWE6ICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC56aW5uaWFcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBiZ19ibGFjazogICAgICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5ibGFja1xuICAgICAgYmdfZGFya3NsYXRlZ3JheTogICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuZGFya3NsYXRlZ3JheVxuICAgICAgYmdfZGltZ3JheTogICAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuZGltZ3JheVxuICAgICAgYmdfc2xhdGVncmF5OiAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuc2xhdGVncmF5XG4gICAgICBiZ19ncmF5OiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5ncmF5XG4gICAgICBiZ19saWdodHNsYXRlZ3JheTogIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5saWdodHNsYXRlZ3JheVxuICAgICAgYmdfZGFya2dyYXk6ICAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuZGFya2dyYXlcbiAgICAgIGJnX3NpbHZlcjogICAgICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLnNpbHZlclxuICAgICAgYmdfbGlnaHRncmF5OiAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMubGlnaHRncmF5XG4gICAgICBiZ19nYWluc2Jvcm86ICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5nYWluc2Jvcm9cbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBiZ193aGl0ZTogICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC53aGl0ZVxuICAgICAgYmdfYW1ldGh5c3Q6ICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguYW1ldGh5c3RcbiAgICAgIGJnX2JsdWU6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmJsdWVcbiAgICAgIGJnX2NhcmFtZWw6ICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmNhcmFtZWxcbiAgICAgIGJnX2RhbXNvbjogICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmRhbXNvblxuICAgICAgYmdfZWJvbnk6ICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguZWJvbnlcbiAgICAgIGJnX2ZvcmVzdDogICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmZvcmVzdFxuICAgICAgYmdfZ3JlZW46ICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguZ3JlZW5cbiAgICAgIGJnX2xpbWU6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmxpbWVcbiAgICAgIGJnX3F1YWdtaXJlOiAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnF1YWdtaXJlXG4gICAgICBiZ19ob25leWRldzogICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5ob25leWRld1xuICAgICAgYmdfaXJvbjogICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguaXJvblxuICAgICAgYmdfamFkZTogICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguamFkZVxuICAgICAgYmdfa2hha2k6ICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgua2hha2lcbiAgICAgIGJnX21hbGxvdzogICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4Lm1hbGxvd1xuICAgICAgYmdfbmF2eTogICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgubmF2eVxuICAgICAgYmdfb3JwaW1lbnQ6ICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgub3JwaW1lbnRcbiAgICAgIGJnX3Bpbms6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnBpbmtcbiAgICAgIGJnX3JlZDogICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnJlZFxuICAgICAgYmdfc2t5OiAgICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguc2t5XG4gICAgICBiZ190dXJxdW9pc2U6ICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC50dXJxdW9pc2VcbiAgICAgIGJnX3Zpb2xldDogICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnZpb2xldFxuICAgICAgYmdfd2luZTogICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgud2luZVxuICAgICAgYmdfdXJhbml1bTogICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgudXJhbml1bVxuICAgICAgYmdfeGFudGhpbjogICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgueGFudGhpblxuICAgICAgYmdfeWVsbG93OiAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgueWVsbG93XG4gICAgICBiZ196aW5uaWE6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC56aW5uaWFcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIHsgYW5zaV9jb2xvcnNfYW5kX2VmZmVjdHM6IFIsIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9zdHJpcF9hbnNpOiAtPlxuICAgICMjIyBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9ibG9iLzIxZWFjNzkzY2Q3NDZlYWIwYjM2ZDc1YWY1ZTE2YWVkMTFmOWFhNGIvbGliL2ludGVybmFsL3V0aWwvaW5zcGVjdC5qcyNMMjUyMSAjIyNcbiAgICAjIyMgYXVnbWVudGVkIHRvIGFsc28gbWF0Y2ggY29sb25zIGFzIHBlciBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlIzI0LWJpdCAjIyNcbiAgICBgYGBcbiAgICAvLyBSZWdleCB1c2VkIGZvciBhbnNpIGVzY2FwZSBjb2RlIHNwbGl0dGluZ1xuICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL2NoYWxrL2Fuc2ktcmVnZXgvYmxvYi9mMzM4ZTE4MTQxNDRlZmI5NTAyNzZhYWM4NDEzNWZmODZiNzJkYzhlL2luZGV4LmpzXG4gICAgLy8gTGljZW5zZTogTUlUIGJ5IFNpbmRyZSBTb3JodXMgPHNpbmRyZXNvcmh1c0BnbWFpbC5jb20+XG4gICAgLy8gTWF0Y2hlcyBhbGwgYW5zaSBlc2NhcGUgY29kZSBzZXF1ZW5jZXMgaW4gYSBzdHJpbmdcbiAgICBjb25zdCBjaGFsa19hbnNpX3JlID0gbmV3IFJlZ0V4cChcbiAgICAgICdbXFxcXHUwMDFCXFxcXHUwMDlCXVtbXFxcXF0oKSM7Oj9dKicgK1xuICAgICAgJyg/Oig/Oig/Oig/Ols7Ol1bLWEtekEtWlxcXFxkXFxcXC9cXFxcIyYuOj0/JUB+X10rKSonICtcbiAgICAgICd8W2EtekEtWlxcXFxkXSsoPzpbOzpdWy1hLXpBLVpcXFxcZFxcXFwvXFxcXCMmLjo9PyVAfl9dKikqKT8nICtcbiAgICAgICcoPzpcXFxcdTAwMDd8XFxcXHUwMDFCXFxcXHUwMDVDfFxcXFx1MDA5QykpJyArXG4gICAgICAnfCg/Oig/OlxcXFxkezEsNH0oPzpbOzpdXFxcXGR7MCw0fSkqKT8nICtcbiAgICAgICdbXFxcXGRBLVBSLVRaY2YtbnEtdXk9Pjx+XSkpJywgJ2cnLFxuICAgICk7XG4gICAgYGBgXG4gICAgb3duX3NpbmdsZV9hbnNpX3JlICA9IC8vLyAgICggICBcXHgxYiBcXFsgW14gXFx4NDAgLSBcXHg3ZSBdKiBbIFxceDQwIC0gXFx4N2UgXSApICAgIC8vL2dcbiAgICBvd25fYW5zaV9yZSAgICAgICAgID0gLy8vICggKD86IFxceDFiIFxcWyBbXiBcXHg0MCAtIFxceDdlIF0qIFsgXFx4NDAgLSBcXHg3ZSBdICkrICkgLy8vZ1xuICAgIHN0cmlwX2Fuc2kgICAgICAgICAgPSAoIHRleHQsIHJlcGxhY2VtZW50ID0gJycgKSAtPiB0ZXh0LnJlcGxhY2Ugb3duX2Fuc2lfcmUsIHJlcGxhY2VtZW50XG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiB7IHN0cmlwX2Fuc2ksIGludGVybmFsczogeyBhbnNpX3JlOiBvd25fYW5zaV9yZSwgb3duX3NpbmdsZV9hbnNpX3JlLCB9LCB9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfYW5zaV9jaHVua2VyOiAtPlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIFZBUklPVVNfQlJJQ1MgICAgICAgICAgID0gcmVxdWlyZSAnLi92YXJpb3VzLWJyaWNzJ1xuICAgIHsgc2V0X2dldHRlcixcbiAgICAgIGhpZGUsICAgICAgICAgICAgICAgfSA9IFZBUklPVVNfQlJJQ1MucmVxdWlyZV9tYW5hZ2VkX3Byb3BlcnR5X3Rvb2xzKClcbiAgICBzZWdtZW50ZXIgICAgICAgICAgICAgICA9IG5ldyBJbnRsLlNlZ21lbnRlcigpXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHNpbXBsZV9nZXRfd2lkdGggID0gKCB0ZXh0ICkgLT4gKCBBcnJheS5mcm9tIHRleHQgKS5sZW5ndGhcbiAgICBhbnNpX3NwbGl0dGVyICAgICA9IC8oKD86XFx4MWJcXFtbXm1dK20pKykvZ1xuICAgIGpzX3NlZ21lbnRpemUgICAgID0gKCB0ZXh0ICkgLT4gKCBkLnNlZ21lbnQgZm9yIGQgZnJvbSBzZWdtZW50ZXIuc2VnbWVudCB0ZXh0IClcbiAgICBjZmdfdGVtcGxhdGUgICAgICA9IE9iamVjdC5mcmVlemVcbiAgICAgIHNwbGl0dGVyOiAgICAgICAgICAgYW5zaV9zcGxpdHRlclxuICAgICAgZ2V0X3dpZHRoOiAgICAgICAgICBzaW1wbGVfZ2V0X3dpZHRoXG4gICAgICBzZWdtZW50aXplOiAgICAgICAgIGpzX3NlZ21lbnRpemVcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgaW50ZXJuYWxzICAgICAgICAgPSBPYmplY3QuZnJlZXplIHsgc2ltcGxlX2dldF93aWR0aCwgYW5zaV9zcGxpdHRlciwganNfc2VnbWVudGl6ZSwgY2ZnX3RlbXBsYXRlLCB9XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgQ2h1bmtcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIFtTeW1ib2wuaXRlcmF0b3JdOiAtPiB5aWVsZCBmcm9tIEB0ZXh0XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKHsgaGFzX2Fuc2ksIHdpZHRoLCB0ZXh0LCB9KSAtPlxuICAgICAgICBAd2lkdGggPSB3aWR0aFxuICAgICAgICBoaWRlIEAsICdoYXNfYW5zaScsIGhhc19hbnNpXG4gICAgICAgIGhpZGUgQCwgJ3RleHQnLCAgICAgdGV4dFxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2xlbmd0aCcsIC0+IEB0ZXh0Lmxlbmd0aFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIEFuc2lfY2h1bmtlclxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgW1N5bWJvbC5pdGVyYXRvcl06IC0+IHlpZWxkIGZyb20gQGNodW5rc1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICggY2ZnID0gbnVsbCApIC0+XG4gICAgICAgIGhpZGUgQCwgJ2NmZycsIHsgY2ZnX3RlbXBsYXRlLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgaGlkZSBALCAnY2h1bmtzJywgICBbXVxuICAgICAgICBAcmVzZXQoKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2hhc19hbnNpJywgLT5cbiAgICAgICAgZm9yIGNodW5rIGluIEBjaHVua3NcbiAgICAgICAgICByZXR1cm4gdHJ1ZSBpZiBjaHVuay5oYXNfYW5zaVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAnd2lkdGgnLCAgLT4gQGNodW5rcy5yZWR1Y2UgKCAoIHN1bSwgY2h1bmsgKSAtPiBzdW0gKyBjaHVuay53aWR0aCAgICksIDBcbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAnbGVuZ3RoJywgLT4gQGNodW5rcy5yZWR1Y2UgKCAoIHN1bSwgY2h1bmsgKSAtPiBzdW0gKyBjaHVuay5sZW5ndGggICksIDBcbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAndGV4dCcsICAgLT4gQGNodW5rcy5yZWR1Y2UgKCAoIHN1bSwgY2h1bmsgKSAtPiBzdW0gKyBjaHVuay50ZXh0ICAgICksICcnXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByZXNldDogLT5cbiAgICAgICAgQGNodW5rcyAgID0gW11cbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNodW5raWZ5OiAoIHNvdXJjZSApIC0+XG4gICAgICAgIEByZXNldCgpXG4gICAgICAgIGlmIHNvdXJjZSBpcyAnJ1xuICAgICAgICAgICMjIyBUQUlOVCBtaWdodCBhcyB3ZWxsIHJldHVybiBhbiBlbXB0eSBsaXN0IG9mIEBjaHVua3MgIyMjXG4gICAgICAgICAgQGNodW5rcy5wdXNoIG5ldyBDaHVuayB7IGhhc19hbnNpOiBmYWxzZSwgd2lkdGg6IDAsIHRleHQ6ICcnLCB9XG4gICAgICAgICAgcmV0dXJuIEBcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGhhc19hbnNpID0gdHJ1ZVxuICAgICAgICBmb3IgdGV4dCBpbiBzb3VyY2Uuc3BsaXQgQGNmZy5zcGxpdHRlclxuICAgICAgICAgIGhhc19hbnNpICA9IG5vdCBoYXNfYW5zaVxuICAgICAgICAgIGNvbnRpbnVlIGlmIHRleHQgaXMgJydcbiAgICAgICAgICB3aWR0aCAgICAgPSBpZiBoYXNfYW5zaSB0aGVuIDAgZWxzZSBAY2ZnLmdldF93aWR0aCB0ZXh0XG4gICAgICAgICAgQGNodW5rcy5wdXNoIG5ldyBDaHVuayB7IGhhc19hbnNpLCB3aWR0aCwgdGV4dCwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIEBcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjaHVua2lmeSA9ICggdGV4dCApIC0+IG5ldyBBbnNpX2NodW5rZXIgdGV4dFxuXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IEFuc2lfY2h1bmtlciwgY2h1bmtpZnksIGludGVybmFscywgfVxuXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfY2hyX2dhdWdlOiAtPlxuICAgIHsgYW5zaV9jb2xvcnNfYW5kX2VmZmVjdHM6IEMsIH0gPSBBTlNJX0JSSUNTLnJlcXVpcmVfYW5zaV9jb2xvcnNfYW5kX2VmZmVjdHMoKVxuICAgIGJ1aWxkX2Nocl9nYXVnZSA9ICh7IGxlbmd0aCA9IDMwLCB9KSAtPlxuICAgICAgZXZlbl9jb2xvciAgICA9ICggeCApIC0+IEMuYmdfeWVsbG93ICArIEMuYmxhY2sgICArIEMuYm9sZCArIFwiI3t4fVwiICsgQy5yZXNldFxuICAgICAgb2RkX2NvbG9yICAgICA9ICggeCApIC0+IEMuYmdfYmxhY2sgICArIEMueWVsbG93ICArIEMuYm9sZCArIFwiI3t4fVwiICsgQy5yZXNldFxuICAgICAgZGVjYWRlX2NvbG9yICA9ICggeCApIC0+IEMuYmdfd2hpdGUgICArIEMucmVkICAgICArIEMuYm9sZCArIFwiI3t4fVwiICsgQy5yZXNldFxuICAgICAgZGVjYWRlICAgICAgICA9IDBcbiAgICAgIGNvdW50ICAgICAgICAgPSAwXG4gICAgICBSICAgICAgICAgICAgID0gJydcbiAgICAgIGxvb3BcbiAgICAgICAgZm9yIHVuaXQgaW4gWyAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAwLCBdXG4gICAgICAgICAgY291bnQrK1xuICAgICAgICAgIGJyZWFrIGlmIGNvdW50ID4gbGVuZ3RoXG4gICAgICAgICAgaWYgdW5pdCBpcyAwXG4gICAgICAgICAgICBkZWNhZGUrK1xuICAgICAgICAgICAgUiArPSBkZWNhZGVfY29sb3IgZGVjYWRlXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgUiArPSAoIGlmIHVuaXQgJSUgMiBpcyAwIHRoZW4gZXZlbl9jb2xvciBlbHNlIG9kZF9jb2xvciApIHVuaXRcbiAgICAgICAgYnJlYWsgaWYgY291bnQgPiBsZW5ndGhcbiAgICAgIHJldHVybiBSXG5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgYnVpbGRfY2hyX2dhdWdlLCB9XG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgQU5TSV9CUklDU1xuXG4iXX0=
//# sourceURL=../src/ansi-brics.coffee