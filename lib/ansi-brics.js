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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Fuc2ktYnJpY3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLFVBQUE7SUFBQSwyREFBQTs7Ozs7RUFLQSxVQUFBLEdBS0UsQ0FBQTs7OztJQUFBLFlBQUEsRUFBYyxRQUFBLENBQUEsQ0FBQTtBQUVoQixVQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQTs7TUFDSSxJQUFBLEdBQU8sSUFBQSxDQUFVLE9BQU4sTUFBQSxLQUFBLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQXdCVCxXQUFhLENBQUMsQ0FBRSxDQUFGLEVBQUssQ0FBTCxFQUFRLENBQVIsQ0FBRCxDQUFBO2lCQUFrQixDQUFBLFdBQUEsQ0FBQSxDQUFjLENBQWQsQ0FBQSxDQUFBLENBQUEsQ0FBbUIsQ0FBbkIsQ0FBQSxDQUFBLENBQUEsQ0FBd0IsQ0FBeEIsQ0FBQSxDQUFBO1FBQWxCOztRQUNiLFdBQWEsQ0FBQyxDQUFFLENBQUYsRUFBSyxDQUFMLEVBQVEsQ0FBUixDQUFELENBQUE7aUJBQWtCLENBQUEsV0FBQSxDQUFBLENBQWMsQ0FBZCxDQUFBLENBQUEsQ0FBQSxDQUFtQixDQUFuQixDQUFBLENBQUEsQ0FBQSxDQUF3QixDQUF4QixDQUFBLENBQUE7UUFBbEI7O1FBQ2IsV0FBYSxDQUFFLEdBQUYsQ0FBQTtpQkFBVyxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxZQUFELENBQWMsR0FBZCxDQUFiO1FBQVg7O1FBQ2IsV0FBYSxDQUFFLEdBQUYsQ0FBQTtpQkFBVyxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxZQUFELENBQWMsR0FBZCxDQUFiO1FBQVg7O1FBQ2IsWUFBYyxDQUFFLElBQUYsQ0FBQTtBQUNwQixjQUFBLEdBQUEsRUFBQTtVQUFRLEdBQUEsNkNBQXdCLElBQUMsQ0FBQSxNQUFNLENBQUM7QUFDaEMsaUJBQU8sSUFBQyxDQUFBLFdBQUQs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RUFGUDthQUFBLE1BQUE7Y0FJRSxDQUFBLElBQUssUUFBSyxNQUFRLEVBQVIsS0FBYSxDQUFoQixHQUF1QixVQUF2QixHQUF1QyxTQUF6QyxDQUFBLENBQXFELElBQXJELEVBSlA7O1VBSEY7VUFRQSxJQUFTLEtBQUEsR0FBUSxNQUFqQjtBQUFBLGtCQUFBOztRQVRGO0FBVUEsZUFBTztNQWpCUyxFQUR0Qjs7QUFxQkksYUFBTyxPQUFBLEdBQVUsQ0FBRSxlQUFGO0lBdEJBO0VBalJuQixFQVZGOzs7RUFvVEEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsVUFBOUI7QUFwVEEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkFOU0lfQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9hbnNpOiAtPlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIEFOU0kgPSBuZXcgY2xhc3MgQW5zaVxuICAgICAgIyMjXG5cbiAgICAgICogYXMgZm9yIHRoZSBiYWNrZ3JvdW5kICgnYmcnKSwgb25seSBjb2xvcnMgYW5kIG5vIGVmZmVjdHMgY2FuIGJlIHNldDsgaW4gYWRkaXRpb24sIHRoZSBiZyBjb2xvciBjYW4gYmVcbiAgICAgICAgc2V0IHRvIGl0cyBkZWZhdWx0IChvciAndHJhbnNwYXJlbnQnKSwgd2hpY2ggd2lsbCBzaG93IHRoZSB0ZXJtaW5hbCdzIG9yIHRoZSB0ZXJtaW5hbCBlbXVsYXRvcidzXG4gICAgICAgIGNvbmZpZ3VyZWQgYmcgY29sb3JcbiAgICAgICogYXMgZm9yIHRoZSBmb3JlZ3JvdW5kICgnZmcnKSwgY29sb3JzIGFuZCBlZmZlY3RzIHN1Y2ggYXMgYmxpbmtpbmcsIGJvbGQsIGl0YWxpYywgdW5kZXJsaW5lLCBvdmVybGluZSxcbiAgICAgICAgc3RyaWtlIGNhbiBiZSBzZXQ7IGluIGFkZGl0aW9uLCB0aGUgY29uZmlndXJlZCB0ZXJtaW5hbCBkZWZhdWx0IGZvbnQgY29sb3IgY2FuIGJlIHNldCwgYW5kIGVhY2ggZWZmZWN0XG4gICAgICAgIGhhcyBhIGRlZGljYXRlZCBvZmYtc3dpdGNoXG4gICAgICAqIG5lYXQgdGFibGVzIGNhbiBiZSBkcmF3biBieSBjb21iaW5pbmcgdGhlIG92ZXJsaW5lIGVmZmVjdCB3aXRoIGDilIJgIFUrMjUwMiAnQm94IERyYXdpbmcgTGlnaHQgVmVydGljYWxcbiAgICAgICAgTGluZSc7IHRoZSByZW5tYXJrYWJsZSBmZWF0dXJlIG9mIHRoaXMgaXMgdGhhdCBpdCBtaW5pbWl6ZXMgc3BhY2luZyBhcm91bmQgY2hhcmFjdGVycyBtZWFuaW5nIGl0J3NcbiAgICAgICAgcG9zc2libGUgdG8gaGF2ZSBhZGphY2VudCByb3dzIG9mIGNlbGxzIHNlcGFyYXRlZCBmcm9tIHRoZSBuZXh0IHJvdyBieSBhIGJvcmRlciB3aXRob3V0IGhhdmluZyB0b1xuICAgICAgICBzYWNyaWZpY2UgYSBsaW5lIG9mIHRleHQganVzdCB0byBkcmF3IHRoZSBib3JkZXIuXG4gICAgICAqIHdoaWxlIHRoZSB0d28gY29sb3IgcGFsYXR0ZXMgaW1wbGllZCBieSB0aGUgc3RhbmRhcmQgWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYXG4gICAgICAgICogYmV0dGVyIHRvIG9ubHkgdXNlIGZ1bGwgUkdCIHRoYW4gdG8gZnV6eiBhcm91bmQgd2l0aCBwYWxldHRlc1xuICAgICAgICAqIGFwcHMgdGhhdCB1c2UgY29sb3JzIGF0IGFsbCBzaG91bGQgYmUgcHJlcGFyZWQgZm9yIGRhcmsgYW5kIGJyaWdodCBiYWNrZ3JvdW5kc1xuICAgICAgICAqIGluIGdlbmVyYWwgYmV0dGVyIHRvIHNldCBmZywgYmcgY29sb3JzIHRoYW4gdG8gdXNlIHJldmVyc2VcbiAgICAgICAgKiBidXQgcmV2ZXJzZSBhY3R1YWxseSBkb2VzIGRvIHdoYXQgaXQgc2F5c+KAlGl0IHN3YXBzIGZnIHdpdGggYmcgY29sb3JcblxuICAgICAgXFx4MWJbMzltIGRlZmF1bHQgZmcgY29sb3JcbiAgICAgIFxceDFiWzQ5bSBkZWZhdWx0IGJnIGNvbG9yXG5cbiAgICAgICMjI1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZnX2Zyb21fZGVjOiAoWyByLCBnLCBiLCBdKSAtPiBcIlxceDFiWzM4OjI6OiN7cn06I3tnfToje2J9bVwiXG4gICAgICBiZ19mcm9tX2RlYzogKFsgciwgZywgYiwgXSkgLT4gXCJcXHgxYls0ODoyOjoje3J9OiN7Z306I3tifW1cIlxuICAgICAgZmdfZnJvbV9oZXg6ICggcmh4ICkgLT4gQGZnX2Zyb21fZGVjIEBkZWNfZnJvbV9oZXggcmh4XG4gICAgICBiZ19mcm9tX2hleDogKCByaHggKSAtPiBAYmdfZnJvbV9kZWMgQGRlY19mcm9tX2hleCByaHhcbiAgICAgIGZnX2Zyb21fbmFtZTogKCBuYW1lICkgLT5cbiAgICAgICAgcmdiID0gQGNvbG9yc1sgbmFtZSBdID8gQGNvbG9ycy5mYWxsYmFja1xuICAgICAgICByZXR1cm4gQGZnX2Zyb21fZGVjIHJnYlxuICAgICAgZGVjX2Zyb21faGV4OiAoIGhleCApIC0+XG4gICAgICAgICMjIyBUQUlOVCB1c2UgcHJvcGVyIHR5cGluZyAjIyNcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX18zIGV4cGVjdGVkIHRleHQsIGdvdCAje3JwciBoZXh9XCIgdW5sZXNzICggdHlwZW9mIGhleCApIGlzICdzdHJpbmcnXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNCBub3QgYSBwcm9wZXIgaGV4YWRlY2ltYWwgUkdCIGNvZGU6ICcje2hleC5yZXBsYWNlIC8nL2csIFwiXFxcXCdcIn0nXCIgdW5sZXNzIC9eI1swLTlhLWZdezZ9JC9pLnRlc3QgaGV4XG4gICAgICAgIFsgcjE2LCBnMTYsIGIxNiwgXSA9IFsgaGV4WyAxIC4uIDIgXSwgaGV4WyAzIC4uIDQgXSwgaGV4WyA1IC4uIDYgXSwgXVxuICAgICAgICByZXR1cm4gWyAoIHBhcnNlSW50IHIxNiwgMTYgKSwgKCBwYXJzZUludCBnMTYsIDE2ICksICggcGFyc2VJbnQgYjE2LCAxNiApLCBdXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IEFOU0ksIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9hbnNpX2NvbG9yc19hbmRfZWZmZWN0czogLT5cbiAgICB7IEFOU0ksIH0gPSBBTlNJX0JSSUNTLnJlcXVpcmVfYW5zaSgpXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJnYl9kZWMgPVxuICAgICAgYmxhY2s6ICAgICAgICAgICAgICBbICAgMCwgICAwLCAgIDAsIF1cbiAgICAgIGRhcmtzbGF0ZWdyYXk6ICAgICAgWyAgNDcsICA3OSwgIDc5LCBdXG4gICAgICBkaW1ncmF5OiAgICAgICAgICAgIFsgMTA1LCAxMDUsIDEwNSwgXVxuICAgICAgc2xhdGVncmF5OiAgICAgICAgICBbIDExMiwgMTI4LCAxNDQsIF1cbiAgICAgIGdyYXk6ICAgICAgICAgICAgICAgWyAxMjgsIDEyOCwgMTI4LCBdXG4gICAgICBsaWdodHNsYXRlZ3JheTogICAgIFsgMTE5LCAxMzYsIDE1MywgXVxuICAgICAgZGFya2dyYXk6ICAgICAgICAgICBbIDE2OSwgMTY5LCAxNjksIF1cbiAgICAgIHNpbHZlcjogICAgICAgICAgICAgWyAxOTIsIDE5MiwgMTkyLCBdXG4gICAgICBsaWdodGdyYXk6ICAgICAgICAgIFsgMjExLCAyMTEsIDIxMSwgXVxuICAgICAgZ2FpbnNib3JvOiAgICAgICAgICBbIDIyMCwgMjIwLCAyMjAsIF1cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmdiX2hleCA9XG4gICAgICB3aGl0ZTogICAgICAgICAgICAnI2ZmZmZmZidcbiAgICAgIGFtZXRoeXN0OiAgICAgICAgICcjZjBhM2ZmJ1xuICAgICAgYmx1ZTogICAgICAgICAgICAgJyMwMDc1ZGMnXG4gICAgICBjYXJhbWVsOiAgICAgICAgICAnIzk5M2YwMCdcbiAgICAgIGRhbXNvbjogICAgICAgICAgICcjNGMwMDVjJ1xuICAgICAgZWJvbnk6ICAgICAgICAgICAgJyMxOTE5MTknXG4gICAgICBmb3Jlc3Q6ICAgICAgICAgICAnIzAwNWMzMSdcbiAgICAgIGdyZWVuOiAgICAgICAgICAgICcjMmJjZTQ4J1xuICAgICAgbGltZTogICAgICAgICAgICAgJyM5ZGNjMDAnXG4gICAgICBxdWFnbWlyZTogICAgICAgICAnIzQyNjYwMCdcbiAgICAgIGhvbmV5ZGV3OiAgICAgICAgICcjZmZjYzk5J1xuICAgICAgaXJvbjogICAgICAgICAgICAgJyM4MDgwODAnXG4gICAgICBqYWRlOiAgICAgICAgICAgICAnIzk0ZmZiNSdcbiAgICAgIGtoYWtpOiAgICAgICAgICAgICcjOGY3YzAwJ1xuICAgICAgbWFsbG93OiAgICAgICAgICAgJyNjMjAwODgnXG4gICAgICBuYXZ5OiAgICAgICAgICAgICAnIzAwMzM4MCdcbiAgICAgIG9ycGltZW50OiAgICAgICAgICcjZmZhNDA1J1xuICAgICAgcGluazogICAgICAgICAgICAgJyNmZmE4YmInXG4gICAgICByZWQ6ICAgICAgICAgICAgICAnI2ZmMDAxMCdcbiAgICAgIHNreTogICAgICAgICAgICAgICcjNWVmMWYyJ1xuICAgICAgdHVycXVvaXNlOiAgICAgICAgJyMwMDk5OGYnXG4gICAgICB2aW9sZXQ6ICAgICAgICAgICAnIzc0MGFmZidcbiAgICAgIHdpbmU6ICAgICAgICAgICAgICcjOTkwMDAwJ1xuICAgICAgdXJhbml1bTogICAgICAgICAgJyNlMGZmNjYnXG4gICAgICB4YW50aGluOiAgICAgICAgICAnI2ZmZmY4MCdcbiAgICAgIHllbGxvdzogICAgICAgICAgICcjZmZlMTAwJ1xuICAgICAgemlubmlhOiAgICAgICAgICAgJyNmZjUwMDUnXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIFIgPVxuICAgICAgb3ZlcmxpbmUxOiAgICAgICAgICAnXFx4MWJbNTNtJ1xuICAgICAgb3ZlcmxpbmUwOiAgICAgICAgICAnXFx4MWJbNTVtJ1xuICAgICAgZGVmYXVsdDogICAgICAgICAgICAnXFx4MWJbMzltJ1xuICAgICAgYmdfZGVmYXVsdDogICAgICAgICAnXFx4MWJbNDltJ1xuICAgICAgYm9sZDogICAgICAgICAgICAgICAnXFx4MWJbMW0nXG4gICAgICBib2xkMDogICAgICAgICAgICAgICdcXHgxYlsyMm0nXG4gICAgICBpdGFsaWM6ICAgICAgICAgICAgICdcXHgxYlszbSdcbiAgICAgIGl0YWxpYzA6ICAgICAgICAgICAgJ1xceDFiWzIzbSdcbiAgICAgIHJlc2V0OiAgICAgICAgICAgICAgJ1xceDFiWzBtJ1xuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGJsYWNrOiAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmJsYWNrXG4gICAgICBkYXJrc2xhdGVncmF5OiAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5kYXJrc2xhdGVncmF5XG4gICAgICBkaW1ncmF5OiAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5kaW1ncmF5XG4gICAgICBzbGF0ZWdyYXk6ICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5zbGF0ZWdyYXlcbiAgICAgIGdyYXk6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmdyYXlcbiAgICAgIGxpZ2h0c2xhdGVncmF5OiAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmxpZ2h0c2xhdGVncmF5XG4gICAgICBkYXJrZ3JheTogICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5kYXJrZ3JheVxuICAgICAgc2lsdmVyOiAgICAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuc2lsdmVyXG4gICAgICBsaWdodGdyYXk6ICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5saWdodGdyYXlcbiAgICAgIGdhaW5zYm9ybzogICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmdhaW5zYm9yb1xuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHdoaXRlOiAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LndoaXRlXG4gICAgICBhbWV0aHlzdDogICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5hbWV0aHlzdFxuICAgICAgYmx1ZTogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguYmx1ZVxuICAgICAgY2FyYW1lbDogICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguY2FyYW1lbFxuICAgICAgZGFtc29uOiAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguZGFtc29uXG4gICAgICBlYm9ueTogICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5lYm9ueVxuICAgICAgZm9yZXN0OiAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguZm9yZXN0XG4gICAgICBncmVlbjogICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5ncmVlblxuICAgICAgbGltZTogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgubGltZVxuICAgICAgcXVhZ21pcmU6ICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgucXVhZ21pcmVcbiAgICAgIGhvbmV5ZGV3OiAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmhvbmV5ZGV3XG4gICAgICBpcm9uOiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5pcm9uXG4gICAgICBqYWRlOiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5qYWRlXG4gICAgICBraGFraTogICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5raGFraVxuICAgICAgbWFsbG93OiAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgubWFsbG93XG4gICAgICBuYXZ5OiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5uYXZ5XG4gICAgICBvcnBpbWVudDogICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5vcnBpbWVudFxuICAgICAgcGluazogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgucGlua1xuICAgICAgcmVkOiAgICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgucmVkXG4gICAgICBza3k6ICAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5za3lcbiAgICAgIHR1cnF1b2lzZTogICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnR1cnF1b2lzZVxuICAgICAgdmlvbGV0OiAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgudmlvbGV0XG4gICAgICB3aW5lOiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC53aW5lXG4gICAgICB1cmFuaXVtOiAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC51cmFuaXVtXG4gICAgICB4YW50aGluOiAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC54YW50aGluXG4gICAgICB5ZWxsb3c6ICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC55ZWxsb3dcbiAgICAgIHppbm5pYTogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4Lnppbm5pYVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGJnX2JsYWNrOiAgICAgICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmJsYWNrXG4gICAgICBiZ19kYXJrc2xhdGVncmF5OiAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5kYXJrc2xhdGVncmF5XG4gICAgICBiZ19kaW1ncmF5OiAgICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5kaW1ncmF5XG4gICAgICBiZ19zbGF0ZWdyYXk6ICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5zbGF0ZWdyYXlcbiAgICAgIGJnX2dyYXk6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmdyYXlcbiAgICAgIGJnX2xpZ2h0c2xhdGVncmF5OiAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmxpZ2h0c2xhdGVncmF5XG4gICAgICBiZ19kYXJrZ3JheTogICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5kYXJrZ3JheVxuICAgICAgYmdfc2lsdmVyOiAgICAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuc2lsdmVyXG4gICAgICBiZ19saWdodGdyYXk6ICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5saWdodGdyYXlcbiAgICAgIGJnX2dhaW5zYm9ybzogICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmdhaW5zYm9yb1xuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGJnX3doaXRlOiAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LndoaXRlXG4gICAgICBiZ19hbWV0aHlzdDogICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5hbWV0aHlzdFxuICAgICAgYmdfYmx1ZTogICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguYmx1ZVxuICAgICAgYmdfY2FyYW1lbDogICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguY2FyYW1lbFxuICAgICAgYmdfZGFtc29uOiAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguZGFtc29uXG4gICAgICBiZ19lYm9ueTogICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5lYm9ueVxuICAgICAgYmdfZm9yZXN0OiAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguZm9yZXN0XG4gICAgICBiZ19ncmVlbjogICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5ncmVlblxuICAgICAgYmdfbGltZTogICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgubGltZVxuICAgICAgYmdfcXVhZ21pcmU6ICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgucXVhZ21pcmVcbiAgICAgIGJnX2hvbmV5ZGV3OiAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmhvbmV5ZGV3XG4gICAgICBiZ19pcm9uOiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5pcm9uXG4gICAgICBiZ19qYWRlOiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5qYWRlXG4gICAgICBiZ19raGFraTogICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5raGFraVxuICAgICAgYmdfbWFsbG93OiAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgubWFsbG93XG4gICAgICBiZ19uYXZ5OiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5uYXZ5XG4gICAgICBiZ19vcnBpbWVudDogICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5vcnBpbWVudFxuICAgICAgYmdfcGluazogICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgucGlua1xuICAgICAgYmdfcmVkOiAgICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgucmVkXG4gICAgICBiZ19za3k6ICAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5za3lcbiAgICAgIGJnX3R1cnF1b2lzZTogICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnR1cnF1b2lzZVxuICAgICAgYmdfdmlvbGV0OiAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgudmlvbGV0XG4gICAgICBiZ193aW5lOiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC53aW5lXG4gICAgICBiZ191cmFuaXVtOiAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC51cmFuaXVtXG4gICAgICBiZ194YW50aGluOiAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC54YW50aGluXG4gICAgICBiZ195ZWxsb3c6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC55ZWxsb3dcbiAgICAgIGJnX3ppbm5pYTogICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4Lnppbm5pYVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4geyBhbnNpX2NvbG9yc19hbmRfZWZmZWN0czogUiwgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Fuc2lfY2h1bmtlcjogLT5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBWQVJJT1VTX0JSSUNTICAgICAgICAgICA9IHJlcXVpcmUgJy4vdmFyaW91cy1icmljcydcbiAgICB7IHNldF9nZXR0ZXIsXG4gICAgICBoaWRlLCAgICAgICAgICAgICAgIH0gPSBWQVJJT1VTX0JSSUNTLnJlcXVpcmVfbWFuYWdlZF9wcm9wZXJ0eV90b29scygpXG4gICAgc2VnbWVudGVyICAgICAgICAgICAgICAgPSBuZXcgSW50bC5TZWdtZW50ZXIoKVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBzaW1wbGVfZ2V0X3dpZHRoICA9ICggdGV4dCApIC0+ICggQXJyYXkuZnJvbSB0ZXh0ICkubGVuZ3RoXG4gICAgYW5zaV9zcGxpdHRlciAgICAgPSAvKCg/OlxceDFiXFxbW15tXSttKSspL2dcbiAgICBqc19zZWdtZW50aXplICAgICA9ICggdGV4dCApIC0+ICggZC5zZWdtZW50IGZvciBkIGZyb20gc2VnbWVudGVyLnNlZ21lbnQgdGV4dCApXG4gICAgY2ZnX3RlbXBsYXRlICAgICAgPSBPYmplY3QuZnJlZXplXG4gICAgICBzcGxpdHRlcjogICAgICAgICAgIGFuc2lfc3BsaXR0ZXJcbiAgICAgIGdldF93aWR0aDogICAgICAgICAgc2ltcGxlX2dldF93aWR0aFxuICAgICAgc2VnbWVudGl6ZTogICAgICAgICBqc19zZWdtZW50aXplXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGludGVybmFscyAgICAgICAgID0gT2JqZWN0LmZyZWV6ZSB7IHNpbXBsZV9nZXRfd2lkdGgsIGFuc2lfc3BsaXR0ZXIsIGpzX3NlZ21lbnRpemUsIGNmZ190ZW1wbGF0ZSwgfVxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIENodW5rXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBbU3ltYm9sLml0ZXJhdG9yXTogLT4geWllbGQgZnJvbSBAdGV4dFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICh7IGhhc19hbnNpLCB3aWR0aCwgdGV4dCwgfSkgLT5cbiAgICAgICAgQHdpZHRoID0gd2lkdGhcbiAgICAgICAgaGlkZSBALCAnaGFzX2Fuc2knLCBoYXNfYW5zaVxuICAgICAgICBoaWRlIEAsICd0ZXh0JywgICAgIHRleHRcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X2dldHRlciBAOjosICdsZW5ndGgnLCAtPiBAdGV4dC5sZW5ndGhcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBBbnNpX2NodW5rZXJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIFtTeW1ib2wuaXRlcmF0b3JdOiAtPiB5aWVsZCBmcm9tIEBjaHVua3NcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGNmZyA9IG51bGwgKSAtPlxuICAgICAgICBoaWRlIEAsICdjZmcnLCB7IGNmZ190ZW1wbGF0ZS4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIGhpZGUgQCwgJ2NodW5rcycsICAgW11cbiAgICAgICAgQHJlc2V0KClcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X2dldHRlciBAOjosICdoYXNfYW5zaScsIC0+XG4gICAgICAgIGZvciBjaHVuayBpbiBAY2h1bmtzXG4gICAgICAgICAgcmV0dXJuIHRydWUgaWYgY2h1bmsuaGFzX2Fuc2lcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ3dpZHRoJywgIC0+IEBjaHVua3MucmVkdWNlICggKCBzdW0sIGNodW5rICkgLT4gc3VtICsgY2h1bmsud2lkdGggICApLCAwXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2xlbmd0aCcsIC0+IEBjaHVua3MucmVkdWNlICggKCBzdW0sIGNodW5rICkgLT4gc3VtICsgY2h1bmsubGVuZ3RoICApLCAwXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ3RleHQnLCAgIC0+IEBjaHVua3MucmVkdWNlICggKCBzdW0sIGNodW5rICkgLT4gc3VtICsgY2h1bmsudGV4dCAgICApLCAnJ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcmVzZXQ6IC0+XG4gICAgICAgIEBjaHVua3MgICA9IFtdXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjaHVua2lmeTogKCBzb3VyY2UgKSAtPlxuICAgICAgICBAcmVzZXQoKVxuICAgICAgICBpZiBzb3VyY2UgaXMgJydcbiAgICAgICAgICAjIyMgVEFJTlQgbWlnaHQgYXMgd2VsbCByZXR1cm4gYW4gZW1wdHkgbGlzdCBvZiBAY2h1bmtzICMjI1xuICAgICAgICAgIEBjaHVua3MucHVzaCBuZXcgQ2h1bmsgeyBoYXNfYW5zaTogZmFsc2UsIHdpZHRoOiAwLCB0ZXh0OiAnJywgfVxuICAgICAgICAgIHJldHVybiBAXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBoYXNfYW5zaSA9IHRydWVcbiAgICAgICAgZm9yIHRleHQgaW4gc291cmNlLnNwbGl0IEBjZmcuc3BsaXR0ZXJcbiAgICAgICAgICBoYXNfYW5zaSAgPSBub3QgaGFzX2Fuc2lcbiAgICAgICAgICBjb250aW51ZSBpZiB0ZXh0IGlzICcnXG4gICAgICAgICAgd2lkdGggICAgID0gaWYgaGFzX2Fuc2kgdGhlbiAwIGVsc2UgQGNmZy5nZXRfd2lkdGggdGV4dFxuICAgICAgICAgIEBjaHVua3MucHVzaCBuZXcgQ2h1bmsgeyBoYXNfYW5zaSwgd2lkdGgsIHRleHQsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBAXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2h1bmtpZnkgPSAoIHRleHQgKSAtPiBuZXcgQW5zaV9jaHVua2VyIHRleHRcblxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHJldHVybiBleHBvcnRzID0geyBBbnNpX2NodW5rZXIsIGNodW5raWZ5LCBpbnRlcm5hbHMsIH1cblxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Nocl9nYXVnZTogLT5cbiAgICB7IGFuc2lfY29sb3JzX2FuZF9lZmZlY3RzOiBDLCB9ID0gQU5TSV9CUklDUy5yZXF1aXJlX2Fuc2lfY29sb3JzX2FuZF9lZmZlY3RzKClcbiAgICBidWlsZF9jaHJfZ2F1Z2UgPSAoeyBsZW5ndGggPSAzMCwgfSkgLT5cbiAgICAgIGV2ZW5fY29sb3IgICAgPSAoIHggKSAtPiBDLmJnX3llbGxvdyAgKyBDLmJsYWNrICAgKyBDLmJvbGQgKyBcIiN7eH1cIiArIEMucmVzZXRcbiAgICAgIG9kZF9jb2xvciAgICAgPSAoIHggKSAtPiBDLmJnX2JsYWNrICAgKyBDLnllbGxvdyAgKyBDLmJvbGQgKyBcIiN7eH1cIiArIEMucmVzZXRcbiAgICAgIGRlY2FkZV9jb2xvciAgPSAoIHggKSAtPiBDLmJnX3doaXRlICAgKyBDLnJlZCAgICAgKyBDLmJvbGQgKyBcIiN7eH1cIiArIEMucmVzZXRcbiAgICAgIGRlY2FkZSAgICAgICAgPSAwXG4gICAgICBjb3VudCAgICAgICAgID0gMFxuICAgICAgUiAgICAgICAgICAgICA9ICcnXG4gICAgICBsb29wXG4gICAgICAgIGZvciB1bml0IGluIFsgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMCwgXVxuICAgICAgICAgIGNvdW50KytcbiAgICAgICAgICBicmVhayBpZiBjb3VudCA+IGxlbmd0aFxuICAgICAgICAgIGlmIHVuaXQgaXMgMFxuICAgICAgICAgICAgZGVjYWRlKytcbiAgICAgICAgICAgIFIgKz0gZGVjYWRlX2NvbG9yIGRlY2FkZVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIFIgKz0gKCBpZiB1bml0ICUlIDIgaXMgMCB0aGVuIGV2ZW5fY29sb3IgZWxzZSBvZGRfY29sb3IgKSB1bml0XG4gICAgICAgIGJyZWFrIGlmIGNvdW50ID4gbGVuZ3RoXG4gICAgICByZXR1cm4gUlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHJldHVybiBleHBvcnRzID0geyBidWlsZF9jaHJfZ2F1Z2UsIH1cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBBTlNJX0JSSUNTXG5cbiJdfQ==
//# sourceURL=../src/ansi-brics.coffee