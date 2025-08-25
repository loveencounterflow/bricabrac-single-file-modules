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
        darkslatish: [24, 40, 40],
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
        darkslatish: ANSI.fg_from_dec(rgb_dec.darkslatish),
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
        bg_darkslatish: ANSI.bg_from_dec(rgb_dec.darkslatish),
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Fuc2ktYnJpY3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLFVBQUE7SUFBQSwyREFBQTs7Ozs7RUFLQSxVQUFBLEdBS0UsQ0FBQTs7OztJQUFBLFlBQUEsRUFBYyxRQUFBLENBQUEsQ0FBQTtBQUVoQixVQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQTs7TUFDSSxJQUFBLEdBQU8sSUFBQSxDQUFVLE9BQU4sTUFBQSxLQUFBLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQXdCVCxXQUFhLENBQUMsQ0FBRSxDQUFGLEVBQUssQ0FBTCxFQUFRLENBQVIsQ0FBRCxDQUFBO2lCQUFrQixDQUFBLFdBQUEsQ0FBQSxDQUFjLENBQWQsQ0FBQSxDQUFBLENBQUEsQ0FBbUIsQ0FBbkIsQ0FBQSxDQUFBLENBQUEsQ0FBd0IsQ0FBeEIsQ0FBQSxDQUFBO1FBQWxCOztRQUNiLFdBQWEsQ0FBQyxDQUFFLENBQUYsRUFBSyxDQUFMLEVBQVEsQ0FBUixDQUFELENBQUE7aUJBQWtCLENBQUEsV0FBQSxDQUFBLENBQWMsQ0FBZCxDQUFBLENBQUEsQ0FBQSxDQUFtQixDQUFuQixDQUFBLENBQUEsQ0FBQSxDQUF3QixDQUF4QixDQUFBLENBQUE7UUFBbEI7O1FBQ2IsV0FBYSxDQUFFLEdBQUYsQ0FBQTtpQkFBVyxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxZQUFELENBQWMsR0FBZCxDQUFiO1FBQVg7O1FBQ2IsV0FBYSxDQUFFLEdBQUYsQ0FBQTtpQkFBVyxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxZQUFELENBQWMsR0FBZCxDQUFiO1FBQVg7O1FBQ2IsWUFBYyxDQUFFLElBQUYsQ0FBQTtBQUNwQixjQUFBLEdBQUEsRUFBQTtVQUFRLEdBQUEsNkNBQXdCLElBQUMsQ0FBQSxNQUFNLENBQUM7QUFDaEMsaUJBQU8sSUFBQyxDQUFBLFdBQUQs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QyxDQUFDLENBQUM7UUFBeEQ7UUFDaEIsU0FBQSxHQUFnQixRQUFBLENBQUUsQ0FBRixDQUFBO2lCQUFTLENBQUMsQ0FBQyxRQUFGLEdBQWUsQ0FBQyxDQUFDLE1BQWpCLEdBQTJCLENBQUMsQ0FBQyxJQUE3QixHQUFvQyxDQUFBLENBQUEsQ0FBRyxDQUFILENBQUEsQ0FBcEMsR0FBNkMsQ0FBQyxDQUFDO1FBQXhEO1FBQ2hCLFlBQUEsR0FBZ0IsUUFBQSxDQUFFLENBQUYsQ0FBQTtpQkFBUyxDQUFDLENBQUMsUUFBRixHQUFlLENBQUMsQ0FBQyxHQUFqQixHQUEyQixDQUFDLENBQUMsSUFBN0IsR0FBb0MsQ0FBQSxDQUFBLENBQUcsQ0FBSCxDQUFBLENBQXBDLEdBQTZDLENBQUMsQ0FBQztRQUF4RDtRQUNoQixNQUFBLEdBQWdCO1FBQ2hCLEtBQUEsR0FBZ0I7UUFDaEIsQ0FBQSxHQUFnQjtBQUNoQixlQUFBLElBQUE7QUFDRTtVQUFBLEtBQUEscUNBQUE7O1lBQ0UsS0FBQTtZQUNBLElBQVMsS0FBQSxHQUFRLE1BQWpCO0FBQUEsb0JBQUE7O1lBQ0EsSUFBRyxJQUFBLEtBQVEsQ0FBWDtjQUNFLE1BQUE7Y0FDQSxDQUFBLElBQUssWUFBQSxDQUFhLE1BQWIsRUFGUDthQUFBLE1BQUE7Y0FJRSxDQUFBLElBQUssUUFBSyxNQUFRLEVBQVIsS0FBYSxDQUFoQixHQUF1QixVQUF2QixHQUF1QyxTQUF6QyxDQUFBLENBQXFELElBQXJELEVBSlA7O1VBSEY7VUFRQSxJQUFTLEtBQUEsR0FBUSxNQUFqQjtBQUFBLGtCQUFBOztRQVRGO0FBVUEsZUFBTztNQWpCUyxFQUR0Qjs7QUFzQkksYUFBTyxPQUFBLEdBQVUsQ0FBRSxlQUFGO0lBdkJBO0VBL1NuQixFQVZGOzs7RUFtVkEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsVUFBOUI7QUFuVkEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkFOU0lfQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9hbnNpOiAtPlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIEFOU0kgPSBuZXcgY2xhc3MgQW5zaVxuICAgICAgIyMjXG5cbiAgICAgICogYXMgZm9yIHRoZSBiYWNrZ3JvdW5kICgnYmcnKSwgb25seSBjb2xvcnMgYW5kIG5vIGVmZmVjdHMgY2FuIGJlIHNldDsgaW4gYWRkaXRpb24sIHRoZSBiZyBjb2xvciBjYW4gYmVcbiAgICAgICAgc2V0IHRvIGl0cyBkZWZhdWx0IChvciAndHJhbnNwYXJlbnQnKSwgd2hpY2ggd2lsbCBzaG93IHRoZSB0ZXJtaW5hbCdzIG9yIHRoZSB0ZXJtaW5hbCBlbXVsYXRvcidzXG4gICAgICAgIGNvbmZpZ3VyZWQgYmcgY29sb3JcbiAgICAgICogYXMgZm9yIHRoZSBmb3JlZ3JvdW5kICgnZmcnKSwgY29sb3JzIGFuZCBlZmZlY3RzIHN1Y2ggYXMgYmxpbmtpbmcsIGJvbGQsIGl0YWxpYywgdW5kZXJsaW5lLCBvdmVybGluZSxcbiAgICAgICAgc3RyaWtlIGNhbiBiZSBzZXQ7IGluIGFkZGl0aW9uLCB0aGUgY29uZmlndXJlZCB0ZXJtaW5hbCBkZWZhdWx0IGZvbnQgY29sb3IgY2FuIGJlIHNldCwgYW5kIGVhY2ggZWZmZWN0XG4gICAgICAgIGhhcyBhIGRlZGljYXRlZCBvZmYtc3dpdGNoXG4gICAgICAqIG5lYXQgdGFibGVzIGNhbiBiZSBkcmF3biBieSBjb21iaW5pbmcgdGhlIG92ZXJsaW5lIGVmZmVjdCB3aXRoIGDilIJgIFUrMjUwMiAnQm94IERyYXdpbmcgTGlnaHQgVmVydGljYWxcbiAgICAgICAgTGluZSc7IHRoZSByZW5tYXJrYWJsZSBmZWF0dXJlIG9mIHRoaXMgaXMgdGhhdCBpdCBtaW5pbWl6ZXMgc3BhY2luZyBhcm91bmQgY2hhcmFjdGVycyBtZWFuaW5nIGl0J3NcbiAgICAgICAgcG9zc2libGUgdG8gaGF2ZSBhZGphY2VudCByb3dzIG9mIGNlbGxzIHNlcGFyYXRlZCBmcm9tIHRoZSBuZXh0IHJvdyBieSBhIGJvcmRlciB3aXRob3V0IGhhdmluZyB0b1xuICAgICAgICBzYWNyaWZpY2UgYSBsaW5lIG9mIHRleHQganVzdCB0byBkcmF3IHRoZSBib3JkZXIuXG4gICAgICAqIHdoaWxlIHRoZSB0d28gY29sb3IgcGFsYXR0ZXMgaW1wbGllZCBieSB0aGUgc3RhbmRhcmQgWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYXG4gICAgICAgICogYmV0dGVyIHRvIG9ubHkgdXNlIGZ1bGwgUkdCIHRoYW4gdG8gZnV6eiBhcm91bmQgd2l0aCBwYWxldHRlc1xuICAgICAgICAqIGFwcHMgdGhhdCB1c2UgY29sb3JzIGF0IGFsbCBzaG91bGQgYmUgcHJlcGFyZWQgZm9yIGRhcmsgYW5kIGJyaWdodCBiYWNrZ3JvdW5kc1xuICAgICAgICAqIGluIGdlbmVyYWwgYmV0dGVyIHRvIHNldCBmZywgYmcgY29sb3JzIHRoYW4gdG8gdXNlIHJldmVyc2VcbiAgICAgICAgKiBidXQgcmV2ZXJzZSBhY3R1YWxseSBkb2VzIGRvIHdoYXQgaXQgc2F5c+KAlGl0IHN3YXBzIGZnIHdpdGggYmcgY29sb3JcblxuICAgICAgXFx4MWJbMzltIGRlZmF1bHQgZmcgY29sb3JcbiAgICAgIFxceDFiWzQ5bSBkZWZhdWx0IGJnIGNvbG9yXG5cbiAgICAgICMjI1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZnX2Zyb21fZGVjOiAoWyByLCBnLCBiLCBdKSAtPiBcIlxceDFiWzM4OjI6OiN7cn06I3tnfToje2J9bVwiXG4gICAgICBiZ19mcm9tX2RlYzogKFsgciwgZywgYiwgXSkgLT4gXCJcXHgxYls0ODoyOjoje3J9OiN7Z306I3tifW1cIlxuICAgICAgZmdfZnJvbV9oZXg6ICggcmh4ICkgLT4gQGZnX2Zyb21fZGVjIEBkZWNfZnJvbV9oZXggcmh4XG4gICAgICBiZ19mcm9tX2hleDogKCByaHggKSAtPiBAYmdfZnJvbV9kZWMgQGRlY19mcm9tX2hleCByaHhcbiAgICAgIGZnX2Zyb21fbmFtZTogKCBuYW1lICkgLT5cbiAgICAgICAgcmdiID0gQGNvbG9yc1sgbmFtZSBdID8gQGNvbG9ycy5mYWxsYmFja1xuICAgICAgICByZXR1cm4gQGZnX2Zyb21fZGVjIHJnYlxuICAgICAgZGVjX2Zyb21faGV4OiAoIGhleCApIC0+XG4gICAgICAgICMjIyBUQUlOVCB1c2UgcHJvcGVyIHR5cGluZyAjIyNcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX18zIGV4cGVjdGVkIHRleHQsIGdvdCAje3JwciBoZXh9XCIgdW5sZXNzICggdHlwZW9mIGhleCApIGlzICdzdHJpbmcnXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNCBub3QgYSBwcm9wZXIgaGV4YWRlY2ltYWwgUkdCIGNvZGU6ICcje2hleC5yZXBsYWNlIC8nL2csIFwiXFxcXCdcIn0nXCIgdW5sZXNzIC9eI1swLTlhLWZdezZ9JC9pLnRlc3QgaGV4XG4gICAgICAgIFsgcjE2LCBnMTYsIGIxNiwgXSA9IFsgaGV4WyAxIC4uIDIgXSwgaGV4WyAzIC4uIDQgXSwgaGV4WyA1IC4uIDYgXSwgXVxuICAgICAgICByZXR1cm4gWyAoIHBhcnNlSW50IHIxNiwgMTYgKSwgKCBwYXJzZUludCBnMTYsIDE2ICksICggcGFyc2VJbnQgYjE2LCAxNiApLCBdXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IEFOU0ksIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9hbnNpX2NvbG9yc19hbmRfZWZmZWN0czogLT5cbiAgICB7IEFOU0ksIH0gPSBBTlNJX0JSSUNTLnJlcXVpcmVfYW5zaSgpXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJnYl9kZWMgPVxuICAgICAgYmxhY2s6ICAgICAgICAgICAgICBbICAgMCwgICAwLCAgIDAsIF1cbiAgICAgIGRhcmtzbGF0aXNoOiAgICAgICAgWyAgMjQsICA0MCwgIDQwLCBdXG4gICAgICBkYXJrc2xhdGVncmF5OiAgICAgIFsgIDQ3LCAgNzksICA3OSwgXVxuICAgICAgZGltZ3JheTogICAgICAgICAgICBbIDEwNSwgMTA1LCAxMDUsIF1cbiAgICAgIHNsYXRlZ3JheTogICAgICAgICAgWyAxMTIsIDEyOCwgMTQ0LCBdXG4gICAgICBncmF5OiAgICAgICAgICAgICAgIFsgMTI4LCAxMjgsIDEyOCwgXVxuICAgICAgbGlnaHRzbGF0ZWdyYXk6ICAgICBbIDExOSwgMTM2LCAxNTMsIF1cbiAgICAgIGRhcmtncmF5OiAgICAgICAgICAgWyAxNjksIDE2OSwgMTY5LCBdXG4gICAgICBzaWx2ZXI6ICAgICAgICAgICAgIFsgMTkyLCAxOTIsIDE5MiwgXVxuICAgICAgbGlnaHRncmF5OiAgICAgICAgICBbIDIxMSwgMjExLCAyMTEsIF1cbiAgICAgIGdhaW5zYm9ybzogICAgICAgICAgWyAyMjAsIDIyMCwgMjIwLCBdXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJnYl9oZXggPVxuICAgICAgd2hpdGU6ICAgICAgICAgICAgJyNmZmZmZmYnXG4gICAgICBhbWV0aHlzdDogICAgICAgICAnI2YwYTNmZidcbiAgICAgIGJsdWU6ICAgICAgICAgICAgICcjMDA3NWRjJ1xuICAgICAgY2FyYW1lbDogICAgICAgICAgJyM5OTNmMDAnXG4gICAgICBkYW1zb246ICAgICAgICAgICAnIzRjMDA1YydcbiAgICAgIGVib255OiAgICAgICAgICAgICcjMTkxOTE5J1xuICAgICAgZm9yZXN0OiAgICAgICAgICAgJyMwMDVjMzEnXG4gICAgICBncmVlbjogICAgICAgICAgICAnIzJiY2U0OCdcbiAgICAgIGxpbWU6ICAgICAgICAgICAgICcjOWRjYzAwJ1xuICAgICAgcXVhZ21pcmU6ICAgICAgICAgJyM0MjY2MDAnXG4gICAgICBob25leWRldzogICAgICAgICAnI2ZmY2M5OSdcbiAgICAgIGlyb246ICAgICAgICAgICAgICcjODA4MDgwJ1xuICAgICAgamFkZTogICAgICAgICAgICAgJyM5NGZmYjUnXG4gICAgICBraGFraTogICAgICAgICAgICAnIzhmN2MwMCdcbiAgICAgIG1hbGxvdzogICAgICAgICAgICcjYzIwMDg4J1xuICAgICAgbmF2eTogICAgICAgICAgICAgJyMwMDMzODAnXG4gICAgICBvcnBpbWVudDogICAgICAgICAnI2ZmYTQwNSdcbiAgICAgIHBpbms6ICAgICAgICAgICAgICcjZmZhOGJiJ1xuICAgICAgcmVkOiAgICAgICAgICAgICAgJyNmZjAwMTAnXG4gICAgICBza3k6ICAgICAgICAgICAgICAnIzVlZjFmMidcbiAgICAgIHR1cnF1b2lzZTogICAgICAgICcjMDA5OThmJ1xuICAgICAgdmlvbGV0OiAgICAgICAgICAgJyM3NDBhZmYnXG4gICAgICB3aW5lOiAgICAgICAgICAgICAnIzk5MDAwMCdcbiAgICAgIHVyYW5pdW06ICAgICAgICAgICcjZTBmZjY2J1xuICAgICAgeGFudGhpbjogICAgICAgICAgJyNmZmZmODAnXG4gICAgICB5ZWxsb3c6ICAgICAgICAgICAnI2ZmZTEwMCdcbiAgICAgIHppbm5pYTogICAgICAgICAgICcjZmY1MDA1J1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBSID1cbiAgICAgIG92ZXJsaW5lOiAgICAgICAgICAgJ1xceDFiWzUzbSdcbiAgICAgIG92ZXJsaW5lMDogICAgICAgICAgJ1xceDFiWzU1bSdcbiAgICAgIHVuZGVybGluZTogICAgICAgICAgJ1xceDFiWzRtJ1xuICAgICAgdW5kZXJsaW5lMDogICAgICAgICAnXFx4MWJbMjRtJ1xuICAgICAgZGVmYXVsdDogICAgICAgICAgICAnXFx4MWJbMzltJ1xuICAgICAgYmdfZGVmYXVsdDogICAgICAgICAnXFx4MWJbNDltJ1xuICAgICAgYm9sZDogICAgICAgICAgICAgICAnXFx4MWJbMW0nXG4gICAgICBib2xkMDogICAgICAgICAgICAgICdcXHgxYlsyMm0nXG4gICAgICBpdGFsaWM6ICAgICAgICAgICAgICdcXHgxYlszbSdcbiAgICAgIGl0YWxpYzA6ICAgICAgICAgICAgJ1xceDFiWzIzbSdcbiAgICAgIHJlc2V0OiAgICAgICAgICAgICAgJ1xceDFiWzBtJ1xuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGJsYWNrOiAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmJsYWNrXG4gICAgICBkYXJrc2xhdGlzaDogICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5kYXJrc2xhdGlzaFxuICAgICAgZGFya3NsYXRlZ3JheTogICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuZGFya3NsYXRlZ3JheVxuICAgICAgZGltZ3JheTogICAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuZGltZ3JheVxuICAgICAgc2xhdGVncmF5OiAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuc2xhdGVncmF5XG4gICAgICBncmF5OiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5ncmF5XG4gICAgICBsaWdodHNsYXRlZ3JheTogICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5saWdodHNsYXRlZ3JheVxuICAgICAgZGFya2dyYXk6ICAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuZGFya2dyYXlcbiAgICAgIHNpbHZlcjogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLnNpbHZlclxuICAgICAgbGlnaHRncmF5OiAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMubGlnaHRncmF5XG4gICAgICBnYWluc2Jvcm86ICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5nYWluc2Jvcm9cbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB3aGl0ZTogICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC53aGl0ZVxuICAgICAgYW1ldGh5c3Q6ICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguYW1ldGh5c3RcbiAgICAgIGJsdWU6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmJsdWVcbiAgICAgIGNhcmFtZWw6ICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmNhcmFtZWxcbiAgICAgIGRhbXNvbjogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmRhbXNvblxuICAgICAgZWJvbnk6ICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguZWJvbnlcbiAgICAgIGZvcmVzdDogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmZvcmVzdFxuICAgICAgZ3JlZW46ICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguZ3JlZW5cbiAgICAgIGxpbWU6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmxpbWVcbiAgICAgIHF1YWdtaXJlOiAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnF1YWdtaXJlXG4gICAgICBob25leWRldzogICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5ob25leWRld1xuICAgICAgaXJvbjogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguaXJvblxuICAgICAgamFkZTogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguamFkZVxuICAgICAga2hha2k6ICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgua2hha2lcbiAgICAgIG1hbGxvdzogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4Lm1hbGxvd1xuICAgICAgbmF2eTogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgubmF2eVxuICAgICAgb3JwaW1lbnQ6ICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgub3JwaW1lbnRcbiAgICAgIHBpbms6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnBpbmtcbiAgICAgIHJlZDogICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnJlZFxuICAgICAgc2t5OiAgICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguc2t5XG4gICAgICB0dXJxdW9pc2U6ICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC50dXJxdW9pc2VcbiAgICAgIHZpb2xldDogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnZpb2xldFxuICAgICAgd2luZTogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgud2luZVxuICAgICAgdXJhbml1bTogICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgudXJhbml1bVxuICAgICAgeGFudGhpbjogICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgueGFudGhpblxuICAgICAgeWVsbG93OiAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgueWVsbG93XG4gICAgICB6aW5uaWE6ICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC56aW5uaWFcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBiZ19ibGFjazogICAgICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5ibGFja1xuICAgICAgYmdfZGFya3NsYXRpc2g6ICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuZGFya3NsYXRpc2hcbiAgICAgIGJnX2RhcmtzbGF0ZWdyYXk6ICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmRhcmtzbGF0ZWdyYXlcbiAgICAgIGJnX2RpbWdyYXk6ICAgICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmRpbWdyYXlcbiAgICAgIGJnX3NsYXRlZ3JheTogICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLnNsYXRlZ3JheVxuICAgICAgYmdfZ3JheTogICAgICAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuZ3JheVxuICAgICAgYmdfbGlnaHRzbGF0ZWdyYXk6ICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMubGlnaHRzbGF0ZWdyYXlcbiAgICAgIGJnX2RhcmtncmF5OiAgICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmRhcmtncmF5XG4gICAgICBiZ19zaWx2ZXI6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5zaWx2ZXJcbiAgICAgIGJnX2xpZ2h0Z3JheTogICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmxpZ2h0Z3JheVxuICAgICAgYmdfZ2FpbnNib3JvOiAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuZ2FpbnNib3JvXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgYmdfd2hpdGU6ICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgud2hpdGVcbiAgICAgIGJnX2FtZXRoeXN0OiAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmFtZXRoeXN0XG4gICAgICBiZ19ibHVlOiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5ibHVlXG4gICAgICBiZ19jYXJhbWVsOiAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5jYXJhbWVsXG4gICAgICBiZ19kYW1zb246ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5kYW1zb25cbiAgICAgIGJnX2Vib255OiAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmVib255XG4gICAgICBiZ19mb3Jlc3Q6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5mb3Jlc3RcbiAgICAgIGJnX2dyZWVuOiAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmdyZWVuXG4gICAgICBiZ19saW1lOiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5saW1lXG4gICAgICBiZ19xdWFnbWlyZTogICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5xdWFnbWlyZVxuICAgICAgYmdfaG9uZXlkZXc6ICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguaG9uZXlkZXdcbiAgICAgIGJnX2lyb246ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4Lmlyb25cbiAgICAgIGJnX2phZGU6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmphZGVcbiAgICAgIGJnX2toYWtpOiAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmtoYWtpXG4gICAgICBiZ19tYWxsb3c6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5tYWxsb3dcbiAgICAgIGJnX25hdnk6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4Lm5hdnlcbiAgICAgIGJnX29ycGltZW50OiAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4Lm9ycGltZW50XG4gICAgICBiZ19waW5rOiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5waW5rXG4gICAgICBiZ19yZWQ6ICAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5yZWRcbiAgICAgIGJnX3NreTogICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnNreVxuICAgICAgYmdfdHVycXVvaXNlOiAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgudHVycXVvaXNlXG4gICAgICBiZ192aW9sZXQ6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC52aW9sZXRcbiAgICAgIGJnX3dpbmU6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LndpbmVcbiAgICAgIGJnX3VyYW5pdW06ICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnVyYW5pdW1cbiAgICAgIGJnX3hhbnRoaW46ICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnhhbnRoaW5cbiAgICAgIGJnX3llbGxvdzogICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnllbGxvd1xuICAgICAgYmdfemlubmlhOiAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguemlubmlhXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiB7IGFuc2lfY29sb3JzX2FuZF9lZmZlY3RzOiBSLCB9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfc3RyaXBfYW5zaTogLT5cbiAgICAjIyMgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvYmxvYi8yMWVhYzc5M2NkNzQ2ZWFiMGIzNmQ3NWFmNWUxNmFlZDExZjlhYTRiL2xpYi9pbnRlcm5hbC91dGlsL2luc3BlY3QuanMjTDI1MjEgIyMjXG4gICAgIyMjIGF1Z21lbnRlZCB0byBhbHNvIG1hdGNoIGNvbG9ucyBhcyBwZXIgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSMyNC1iaXQgIyMjXG4gICAgYGBgXG4gICAgLy8gUmVnZXggdXNlZCBmb3IgYW5zaSBlc2NhcGUgY29kZSBzcGxpdHRpbmdcbiAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9jaGFsay9hbnNpLXJlZ2V4L2Jsb2IvZjMzOGUxODE0MTQ0ZWZiOTUwMjc2YWFjODQxMzVmZjg2YjcyZGM4ZS9pbmRleC5qc1xuICAgIC8vIExpY2Vuc2U6IE1JVCBieSBTaW5kcmUgU29yaHVzIDxzaW5kcmVzb3JodXNAZ21haWwuY29tPlxuICAgIC8vIE1hdGNoZXMgYWxsIGFuc2kgZXNjYXBlIGNvZGUgc2VxdWVuY2VzIGluIGEgc3RyaW5nXG4gICAgY29uc3QgY2hhbGtfYW5zaV9yZSA9IG5ldyBSZWdFeHAoXG4gICAgICAnW1xcXFx1MDAxQlxcXFx1MDA5Ql1bW1xcXFxdKCkjOzo/XSonICtcbiAgICAgICcoPzooPzooPzooPzpbOzpdWy1hLXpBLVpcXFxcZFxcXFwvXFxcXCMmLjo9PyVAfl9dKykqJyArXG4gICAgICAnfFthLXpBLVpcXFxcZF0rKD86Wzs6XVstYS16QS1aXFxcXGRcXFxcL1xcXFwjJi46PT8lQH5fXSopKik/JyArXG4gICAgICAnKD86XFxcXHUwMDA3fFxcXFx1MDAxQlxcXFx1MDA1Q3xcXFxcdTAwOUMpKScgK1xuICAgICAgJ3woPzooPzpcXFxcZHsxLDR9KD86Wzs6XVxcXFxkezAsNH0pKik/JyArXG4gICAgICAnW1xcXFxkQS1QUi1UWmNmLW5xLXV5PT48fl0pKScsICdnJyxcbiAgICApO1xuICAgIGBgYFxuICAgIG93bl9zaW5nbGVfYW5zaV9yZSAgPSAvLy8gICAoICAgXFx4MWIgXFxbIFteIFxceDQwIC0gXFx4N2UgXSogWyBcXHg0MCAtIFxceDdlIF0gKSAgICAvLy9nXG4gICAgb3duX2Fuc2lfcmUgICAgICAgICA9IC8vLyAoICg/OiBcXHgxYiBcXFsgW14gXFx4NDAgLSBcXHg3ZSBdKiBbIFxceDQwIC0gXFx4N2UgXSApKyApIC8vL2dcbiAgICBzdHJpcF9hbnNpICAgICAgICAgID0gKCB0ZXh0LCByZXBsYWNlbWVudCA9ICcnICkgLT4gdGV4dC5yZXBsYWNlIG93bl9hbnNpX3JlLCByZXBsYWNlbWVudFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4geyBzdHJpcF9hbnNpLCBpbnRlcm5hbHM6IHsgYW5zaV9yZTogb3duX2Fuc2lfcmUsIG93bl9zaW5nbGVfYW5zaV9yZSwgfSwgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Fuc2lfY2h1bmtlcjogLT5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBWQVJJT1VTX0JSSUNTICAgICAgICAgICA9IHJlcXVpcmUgJy4vdmFyaW91cy1icmljcydcbiAgICB7IHNldF9nZXR0ZXIsXG4gICAgICBoaWRlLCAgICAgICAgICAgICAgIH0gPSBWQVJJT1VTX0JSSUNTLnJlcXVpcmVfbWFuYWdlZF9wcm9wZXJ0eV90b29scygpXG4gICAgc2VnbWVudGVyICAgICAgICAgICAgICAgPSBuZXcgSW50bC5TZWdtZW50ZXIoKVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBzaW1wbGVfZ2V0X3dpZHRoICA9ICggdGV4dCApIC0+ICggQXJyYXkuZnJvbSB0ZXh0ICkubGVuZ3RoXG4gICAgYW5zaV9zcGxpdHRlciAgICAgPSAvKCg/OlxceDFiXFxbW15tXSttKSspL2dcbiAgICBqc19zZWdtZW50aXplICAgICA9ICggdGV4dCApIC0+ICggZC5zZWdtZW50IGZvciBkIGZyb20gc2VnbWVudGVyLnNlZ21lbnQgdGV4dCApXG4gICAgY2ZnX3RlbXBsYXRlICAgICAgPSBPYmplY3QuZnJlZXplXG4gICAgICBzcGxpdHRlcjogICAgICAgICAgIGFuc2lfc3BsaXR0ZXJcbiAgICAgIGdldF93aWR0aDogICAgICAgICAgc2ltcGxlX2dldF93aWR0aFxuICAgICAgc2VnbWVudGl6ZTogICAgICAgICBqc19zZWdtZW50aXplXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGludGVybmFscyAgICAgICAgID0gT2JqZWN0LmZyZWV6ZSB7IHNpbXBsZV9nZXRfd2lkdGgsIGFuc2lfc3BsaXR0ZXIsIGpzX3NlZ21lbnRpemUsIGNmZ190ZW1wbGF0ZSwgfVxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIENodW5rXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBbU3ltYm9sLml0ZXJhdG9yXTogLT4geWllbGQgZnJvbSBAdGV4dFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICh7IGhhc19hbnNpLCB3aWR0aCwgdGV4dCwgfSkgLT5cbiAgICAgICAgQHdpZHRoID0gd2lkdGhcbiAgICAgICAgaGlkZSBALCAnaGFzX2Fuc2knLCBoYXNfYW5zaVxuICAgICAgICBoaWRlIEAsICd0ZXh0JywgICAgIHRleHRcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X2dldHRlciBAOjosICdsZW5ndGgnLCAtPiBAdGV4dC5sZW5ndGhcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBBbnNpX2NodW5rZXJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIFtTeW1ib2wuaXRlcmF0b3JdOiAtPiB5aWVsZCBmcm9tIEBjaHVua3NcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGNmZyA9IG51bGwgKSAtPlxuICAgICAgICBoaWRlIEAsICdjZmcnLCB7IGNmZ190ZW1wbGF0ZS4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIGhpZGUgQCwgJ2NodW5rcycsICAgW11cbiAgICAgICAgQHJlc2V0KClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X2dldHRlciBAOjosICdoYXNfYW5zaScsIC0+XG4gICAgICAgIGZvciBjaHVuayBpbiBAY2h1bmtzXG4gICAgICAgICAgcmV0dXJuIHRydWUgaWYgY2h1bmsuaGFzX2Fuc2lcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ3dpZHRoJywgIC0+IEBjaHVua3MucmVkdWNlICggKCBzdW0sIGNodW5rICkgLT4gc3VtICsgY2h1bmsud2lkdGggICApLCAwXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2xlbmd0aCcsIC0+IEBjaHVua3MucmVkdWNlICggKCBzdW0sIGNodW5rICkgLT4gc3VtICsgY2h1bmsubGVuZ3RoICApLCAwXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ3RleHQnLCAgIC0+IEBjaHVua3MucmVkdWNlICggKCBzdW0sIGNodW5rICkgLT4gc3VtICsgY2h1bmsudGV4dCAgICApLCAnJ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcmVzZXQ6IC0+XG4gICAgICAgIEBjaHVua3MgICA9IFtdXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjaHVua2lmeTogKCBzb3VyY2UgKSAtPlxuICAgICAgICBAcmVzZXQoKVxuICAgICAgICBpZiBzb3VyY2UgaXMgJydcbiAgICAgICAgICAjIyMgVEFJTlQgbWlnaHQgYXMgd2VsbCByZXR1cm4gYW4gZW1wdHkgbGlzdCBvZiBAY2h1bmtzICMjI1xuICAgICAgICAgIEBjaHVua3MucHVzaCBuZXcgQ2h1bmsgeyBoYXNfYW5zaTogZmFsc2UsIHdpZHRoOiAwLCB0ZXh0OiAnJywgfVxuICAgICAgICAgIHJldHVybiBAXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBoYXNfYW5zaSA9IHRydWVcbiAgICAgICAgZm9yIHRleHQgaW4gc291cmNlLnNwbGl0IEBjZmcuc3BsaXR0ZXJcbiAgICAgICAgICBoYXNfYW5zaSAgPSBub3QgaGFzX2Fuc2lcbiAgICAgICAgICBjb250aW51ZSBpZiB0ZXh0IGlzICcnXG4gICAgICAgICAgd2lkdGggICAgID0gaWYgaGFzX2Fuc2kgdGhlbiAwIGVsc2UgQGNmZy5nZXRfd2lkdGggdGV4dFxuICAgICAgICAgIEBjaHVua3MucHVzaCBuZXcgQ2h1bmsgeyBoYXNfYW5zaSwgd2lkdGgsIHRleHQsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBAXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2h1bmtpZnkgPSAoIHRleHQgKSAtPiBuZXcgQW5zaV9jaHVua2VyIHRleHRcblxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHJldHVybiBleHBvcnRzID0geyBBbnNpX2NodW5rZXIsIGNodW5raWZ5LCBpbnRlcm5hbHMsIH1cblxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Nocl9nYXVnZTogLT5cbiAgICB7IGFuc2lfY29sb3JzX2FuZF9lZmZlY3RzOiBDLCB9ID0gQU5TSV9CUklDUy5yZXF1aXJlX2Fuc2lfY29sb3JzX2FuZF9lZmZlY3RzKClcbiAgICBidWlsZF9jaHJfZ2F1Z2UgPSAoeyBsZW5ndGggPSAzMCwgfSkgLT5cbiAgICAgIGV2ZW5fY29sb3IgICAgPSAoIHggKSAtPiBDLmJnX3llbGxvdyAgKyBDLmJsYWNrICAgKyBDLmJvbGQgKyBcIiN7eH1cIiArIEMucmVzZXRcbiAgICAgIG9kZF9jb2xvciAgICAgPSAoIHggKSAtPiBDLmJnX2JsYWNrICAgKyBDLnllbGxvdyAgKyBDLmJvbGQgKyBcIiN7eH1cIiArIEMucmVzZXRcbiAgICAgIGRlY2FkZV9jb2xvciAgPSAoIHggKSAtPiBDLmJnX3doaXRlICAgKyBDLnJlZCAgICAgKyBDLmJvbGQgKyBcIiN7eH1cIiArIEMucmVzZXRcbiAgICAgIGRlY2FkZSAgICAgICAgPSAwXG4gICAgICBjb3VudCAgICAgICAgID0gMFxuICAgICAgUiAgICAgICAgICAgICA9ICcnXG4gICAgICBsb29wXG4gICAgICAgIGZvciB1bml0IGluIFsgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMCwgXVxuICAgICAgICAgIGNvdW50KytcbiAgICAgICAgICBicmVhayBpZiBjb3VudCA+IGxlbmd0aFxuICAgICAgICAgIGlmIHVuaXQgaXMgMFxuICAgICAgICAgICAgZGVjYWRlKytcbiAgICAgICAgICAgIFIgKz0gZGVjYWRlX2NvbG9yIGRlY2FkZVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIFIgKz0gKCBpZiB1bml0ICUlIDIgaXMgMCB0aGVuIGV2ZW5fY29sb3IgZWxzZSBvZGRfY29sb3IgKSB1bml0XG4gICAgICAgIGJyZWFrIGlmIGNvdW50ID4gbGVuZ3RoXG4gICAgICByZXR1cm4gUlxuXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGJ1aWxkX2Nocl9nYXVnZSwgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIEFOU0lfQlJJQ1NcblxuIl19
//# sourceURL=../src/ansi-brics.coffee