(function() {
  'use strict';
  var ANSI_BRICS;

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
      var Ansi_chunker, Chunk, VARIOUS_BRICS, ansi_matcher, cfg_template, chunkify, exports, get_string_width, hide, internals, segmenter, set_getter, split_glyphs;
      //=========================================================================================================
      get_string_width = function(text) {};
      VARIOUS_BRICS = require('./various-brics');
      ({set_getter, hide} = VARIOUS_BRICS.require_managed_property_tools());
      //.........................................................................................................
      get_string_width = function(text) {
        return (Array.from(text)).length;
      };
      //.........................................................................................................
      ansi_matcher = /((?:\x1b\[[^m]+m)+)/g;
      segmenter = new Intl.Segmenter();
      split_glyphs = function(text) {
        var d, results;
        results = [];
        for (d of segmenter.segment(text)) {
          results.push(d.segment);
        }
        return results;
      };
      cfg_template = Object.freeze({get_string_width});
      //.........................................................................................................
      internals = Object.freeze({ansi_matcher, segmenter, split_glyphs, cfg_template});
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
            ref = source.split(ansi_matcher);
            for (i = 0, len = ref.length; i < len; i++) {
              text = ref[i];
              has_ansi = !has_ansi;
              if (text === '') {
                continue;
              }
              width = has_ansi ? 0 : this.cfg.get_string_width(text);
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
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, ANSI_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Fuc2ktYnJpY3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLFVBQUE7Ozs7O0VBS0EsVUFBQSxHQUtFLENBQUE7Ozs7SUFBQSxZQUFBLEVBQWMsUUFBQSxDQUFBLENBQUE7QUFFaEIsVUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUE7O01BQ0ksSUFBQSxHQUFPLElBQUEsQ0FBVSxPQUFOLE1BQUEsS0FBQSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUF3QlQsV0FBYSxDQUFDLENBQUUsQ0FBRixFQUFLLENBQUwsRUFBUSxDQUFSLENBQUQsQ0FBQTtpQkFBa0IsQ0FBQSxXQUFBLENBQUEsQ0FBYyxDQUFkLENBQUEsQ0FBQSxDQUFBLENBQW1CLENBQW5CLENBQUEsQ0FBQSxDQUFBLENBQXdCLENBQXhCLENBQUEsQ0FBQTtRQUFsQjs7UUFDYixXQUFhLENBQUMsQ0FBRSxDQUFGLEVBQUssQ0FBTCxFQUFRLENBQVIsQ0FBRCxDQUFBO2lCQUFrQixDQUFBLFdBQUEsQ0FBQSxDQUFjLENBQWQsQ0FBQSxDQUFBLENBQUEsQ0FBbUIsQ0FBbkIsQ0FBQSxDQUFBLENBQUEsQ0FBd0IsQ0FBeEIsQ0FBQSxDQUFBO1FBQWxCOztRQUNiLFdBQWEsQ0FBRSxHQUFGLENBQUE7aUJBQVcsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsWUFBRCxDQUFjLEdBQWQsQ0FBYjtRQUFYOztRQUNiLFdBQWEsQ0FBRSxHQUFGLENBQUE7aUJBQVcsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsWUFBRCxDQUFjLEdBQWQsQ0FBYjtRQUFYOztRQUNiLFlBQWMsQ0FBRSxJQUFGLENBQUE7QUFDcEIsY0FBQSxHQUFBLEVBQUE7VUFBUSxHQUFBLDZDQUF3QixJQUFDLENBQUEsTUFBTSxDQUFDO0FBQ2hDLGlCQUFPLElBQUMsQ0FBQSxXQUFELENBQWEsR0FBYjtR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dXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkFOU0lfQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9hbnNpOiAtPlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIEFOU0kgPSBuZXcgY2xhc3MgQW5zaVxuICAgICAgIyMjXG5cbiAgICAgICogYXMgZm9yIHRoZSBiYWNrZ3JvdW5kICgnYmcnKSwgb25seSBjb2xvcnMgYW5kIG5vIGVmZmVjdHMgY2FuIGJlIHNldDsgaW4gYWRkaXRpb24sIHRoZSBiZyBjb2xvciBjYW4gYmVcbiAgICAgICAgc2V0IHRvIGl0cyBkZWZhdWx0IChvciAndHJhbnNwYXJlbnQnKSwgd2hpY2ggd2lsbCBzaG93IHRoZSB0ZXJtaW5hbCdzIG9yIHRoZSB0ZXJtaW5hbCBlbXVsYXRvcidzXG4gICAgICAgIGNvbmZpZ3VyZWQgYmcgY29sb3JcbiAgICAgICogYXMgZm9yIHRoZSBmb3JlZ3JvdW5kICgnZmcnKSwgY29sb3JzIGFuZCBlZmZlY3RzIHN1Y2ggYXMgYmxpbmtpbmcsIGJvbGQsIGl0YWxpYywgdW5kZXJsaW5lLCBvdmVybGluZSxcbiAgICAgICAgc3RyaWtlIGNhbiBiZSBzZXQ7IGluIGFkZGl0aW9uLCB0aGUgY29uZmlndXJlZCB0ZXJtaW5hbCBkZWZhdWx0IGZvbnQgY29sb3IgY2FuIGJlIHNldCwgYW5kIGVhY2ggZWZmZWN0XG4gICAgICAgIGhhcyBhIGRlZGljYXRlZCBvZmYtc3dpdGNoXG4gICAgICAqIG5lYXQgdGFibGVzIGNhbiBiZSBkcmF3biBieSBjb21iaW5pbmcgdGhlIG92ZXJsaW5lIGVmZmVjdCB3aXRoIGDilIJgIFUrMjUwMiAnQm94IERyYXdpbmcgTGlnaHQgVmVydGljYWxcbiAgICAgICAgTGluZSc7IHRoZSByZW5tYXJrYWJsZSBmZWF0dXJlIG9mIHRoaXMgaXMgdGhhdCBpdCBtaW5pbWl6ZXMgc3BhY2luZyBhcm91bmQgY2hhcmFjdGVycyBtZWFuaW5nIGl0J3NcbiAgICAgICAgcG9zc2libGUgdG8gaGF2ZSBhZGphY2VudCByb3dzIG9mIGNlbGxzIHNlcGFyYXRlZCBmcm9tIHRoZSBuZXh0IHJvdyBieSBhIGJvcmRlciB3aXRob3V0IGhhdmluZyB0b1xuICAgICAgICBzYWNyaWZpY2UgYSBsaW5lIG9mIHRleHQganVzdCB0byBkcmF3IHRoZSBib3JkZXIuXG4gICAgICAqIHdoaWxlIHRoZSB0d28gY29sb3IgcGFsYXR0ZXMgaW1wbGllZCBieSB0aGUgc3RhbmRhcmQgWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYXG4gICAgICAgICogYmV0dGVyIHRvIG9ubHkgdXNlIGZ1bGwgUkdCIHRoYW4gdG8gZnV6eiBhcm91bmQgd2l0aCBwYWxldHRlc1xuICAgICAgICAqIGFwcHMgdGhhdCB1c2UgY29sb3JzIGF0IGFsbCBzaG91bGQgYmUgcHJlcGFyZWQgZm9yIGRhcmsgYW5kIGJyaWdodCBiYWNrZ3JvdW5kc1xuICAgICAgICAqIGluIGdlbmVyYWwgYmV0dGVyIHRvIHNldCBmZywgYmcgY29sb3JzIHRoYW4gdG8gdXNlIHJldmVyc2VcbiAgICAgICAgKiBidXQgcmV2ZXJzZSBhY3R1YWxseSBkb2VzIGRvIHdoYXQgaXQgc2F5c+KAlGl0IHN3YXBzIGZnIHdpdGggYmcgY29sb3JcblxuICAgICAgXFx4MWJbMzltIGRlZmF1bHQgZmcgY29sb3JcbiAgICAgIFxceDFiWzQ5bSBkZWZhdWx0IGJnIGNvbG9yXG5cbiAgICAgICMjI1xuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZnX2Zyb21fZGVjOiAoWyByLCBnLCBiLCBdKSAtPiBcIlxceDFiWzM4OjI6OiN7cn06I3tnfToje2J9bVwiXG4gICAgICBiZ19mcm9tX2RlYzogKFsgciwgZywgYiwgXSkgLT4gXCJcXHgxYls0ODoyOjoje3J9OiN7Z306I3tifW1cIlxuICAgICAgZmdfZnJvbV9oZXg6ICggcmh4ICkgLT4gQGZnX2Zyb21fZGVjIEBkZWNfZnJvbV9oZXggcmh4XG4gICAgICBiZ19mcm9tX2hleDogKCByaHggKSAtPiBAYmdfZnJvbV9kZWMgQGRlY19mcm9tX2hleCByaHhcbiAgICAgIGZnX2Zyb21fbmFtZTogKCBuYW1lICkgLT5cbiAgICAgICAgcmdiID0gQGNvbG9yc1sgbmFtZSBdID8gQGNvbG9ycy5mYWxsYmFja1xuICAgICAgICByZXR1cm4gQGZnX2Zyb21fZGVjIHJnYlxuICAgICAgZGVjX2Zyb21faGV4OiAoIGhleCApIC0+XG4gICAgICAgICMjIyBUQUlOVCB1c2UgcHJvcGVyIHR5cGluZyAjIyNcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX18zIGV4cGVjdGVkIHRleHQsIGdvdCAje3JwciBoZXh9XCIgdW5sZXNzICggdHlwZW9mIGhleCApIGlzICdzdHJpbmcnXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNCBub3QgYSBwcm9wZXIgaGV4YWRlY2ltYWwgUkdCIGNvZGU6ICcje2hleC5yZXBsYWNlIC8nL2csIFwiXFxcXCdcIn0nXCIgdW5sZXNzIC9eI1swLTlhLWZdezZ9JC9pLnRlc3QgaGV4XG4gICAgICAgIFsgcjE2LCBnMTYsIGIxNiwgXSA9IFsgaGV4WyAxIC4uIDIgXSwgaGV4WyAzIC4uIDQgXSwgaGV4WyA1IC4uIDYgXSwgXVxuICAgICAgICByZXR1cm4gWyAoIHBhcnNlSW50IHIxNiwgMTYgKSwgKCBwYXJzZUludCBnMTYsIDE2ICksICggcGFyc2VJbnQgYjE2LCAxNiApLCBdXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IEFOU0ksIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9hbnNpX2NvbG9yc19hbmRfZWZmZWN0czogLT5cbiAgICB7IEFOU0ksIH0gPSBBTlNJX0JSSUNTLnJlcXVpcmVfYW5zaSgpXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJnYl9kZWMgPVxuICAgICAgYmxhY2s6ICAgICAgICAgICAgICBbICAgMCwgICAwLCAgIDAsIF1cbiAgICAgIGRhcmtzbGF0ZWdyYXk6ICAgICAgWyAgNDcsICA3OSwgIDc5LCBdXG4gICAgICBkaW1ncmF5OiAgICAgICAgICAgIFsgMTA1LCAxMDUsIDEwNSwgXVxuICAgICAgc2xhdGVncmF5OiAgICAgICAgICBbIDExMiwgMTI4LCAxNDQsIF1cbiAgICAgIGdyYXk6ICAgICAgICAgICAgICAgWyAxMjgsIDEyOCwgMTI4LCBdXG4gICAgICBsaWdodHNsYXRlZ3JheTogICAgIFsgMTE5LCAxMzYsIDE1MywgXVxuICAgICAgZGFya2dyYXk6ICAgICAgICAgICBbIDE2OSwgMTY5LCAxNjksIF1cbiAgICAgIHNpbHZlcjogICAgICAgICAgICAgWyAxOTIsIDE5MiwgMTkyLCBdXG4gICAgICBsaWdodGdyYXk6ICAgICAgICAgIFsgMjExLCAyMTEsIDIxMSwgXVxuICAgICAgZ2FpbnNib3JvOiAgICAgICAgICBbIDIyMCwgMjIwLCAyMjAsIF1cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmdiX2hleCA9XG4gICAgICB3aGl0ZTogICAgICAgICAgICAnI2ZmZmZmZidcbiAgICAgIGFtZXRoeXN0OiAgICAgICAgICcjZjBhM2ZmJ1xuICAgICAgYmx1ZTogICAgICAgICAgICAgJyMwMDc1ZGMnXG4gICAgICBjYXJhbWVsOiAgICAgICAgICAnIzk5M2YwMCdcbiAgICAgIGRhbXNvbjogICAgICAgICAgICcjNGMwMDVjJ1xuICAgICAgZWJvbnk6ICAgICAgICAgICAgJyMxOTE5MTknXG4gICAgICBmb3Jlc3Q6ICAgICAgICAgICAnIzAwNWMzMSdcbiAgICAgIGdyZWVuOiAgICAgICAgICAgICcjMmJjZTQ4J1xuICAgICAgbGltZTogICAgICAgICAgICAgJyM5ZGNjMDAnXG4gICAgICBxdWFnbWlyZTogICAgICAgICAnIzQyNjYwMCdcbiAgICAgIGhvbmV5ZGV3OiAgICAgICAgICcjZmZjYzk5J1xuICAgICAgaXJvbjogICAgICAgICAgICAgJyM4MDgwODAnXG4gICAgICBqYWRlOiAgICAgICAgICAgICAnIzk0ZmZiNSdcbiAgICAgIGtoYWtpOiAgICAgICAgICAgICcjOGY3YzAwJ1xuICAgICAgbWFsbG93OiAgICAgICAgICAgJyNjMjAwODgnXG4gICAgICBuYXZ5OiAgICAgICAgICAgICAnIzAwMzM4MCdcbiAgICAgIG9ycGltZW50OiAgICAgICAgICcjZmZhNDA1J1xuICAgICAgcGluazogICAgICAgICAgICAgJyNmZmE4YmInXG4gICAgICByZWQ6ICAgICAgICAgICAgICAnI2ZmMDAxMCdcbiAgICAgIHNreTogICAgICAgICAgICAgICcjNWVmMWYyJ1xuICAgICAgdHVycXVvaXNlOiAgICAgICAgJyMwMDk5OGYnXG4gICAgICB2aW9sZXQ6ICAgICAgICAgICAnIzc0MGFmZidcbiAgICAgIHdpbmU6ICAgICAgICAgICAgICcjOTkwMDAwJ1xuICAgICAgdXJhbml1bTogICAgICAgICAgJyNlMGZmNjYnXG4gICAgICB4YW50aGluOiAgICAgICAgICAnI2ZmZmY4MCdcbiAgICAgIHllbGxvdzogICAgICAgICAgICcjZmZlMTAwJ1xuICAgICAgemlubmlhOiAgICAgICAgICAgJyNmZjUwMDUnXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIFIgPVxuICAgICAgb3ZlcmxpbmUxOiAgICAgICAgICAnXFx4MWJbNTNtJ1xuICAgICAgb3ZlcmxpbmUwOiAgICAgICAgICAnXFx4MWJbNTVtJ1xuICAgICAgZGVmYXVsdDogICAgICAgICAgICAnXFx4MWJbMzltJ1xuICAgICAgYmdfZGVmYXVsdDogICAgICAgICAnXFx4MWJbNDltJ1xuICAgICAgYm9sZDogICAgICAgICAgICAgICAnXFx4MWJbMW0nXG4gICAgICBib2xkMDogICAgICAgICAgICAgICdcXHgxYlsyMm0nXG4gICAgICBpdGFsaWM6ICAgICAgICAgICAgICdcXHgxYlszbSdcbiAgICAgIGl0YWxpYzA6ICAgICAgICAgICAgJ1xceDFiWzIzbSdcbiAgICAgIHJlc2V0OiAgICAgICAgICAgICAgJ1xceDFiWzBtJ1xuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGJsYWNrOiAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmJsYWNrXG4gICAgICBkYXJrc2xhdGVncmF5OiAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5kYXJrc2xhdGVncmF5XG4gICAgICBkaW1ncmF5OiAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5kaW1ncmF5XG4gICAgICBzbGF0ZWdyYXk6ICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5zbGF0ZWdyYXlcbiAgICAgIGdyYXk6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmdyYXlcbiAgICAgIGxpZ2h0c2xhdGVncmF5OiAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmxpZ2h0c2xhdGVncmF5XG4gICAgICBkYXJrZ3JheTogICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5kYXJrZ3JheVxuICAgICAgc2lsdmVyOiAgICAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuc2lsdmVyXG4gICAgICBsaWdodGdyYXk6ICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5saWdodGdyYXlcbiAgICAgIGdhaW5zYm9ybzogICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmdhaW5zYm9yb1xuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHdoaXRlOiAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LndoaXRlXG4gICAgICBhbWV0aHlzdDogICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5hbWV0aHlzdFxuICAgICAgYmx1ZTogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguYmx1ZVxuICAgICAgY2FyYW1lbDogICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguY2FyYW1lbFxuICAgICAgZGFtc29uOiAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguZGFtc29uXG4gICAgICBlYm9ueTogICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5lYm9ueVxuICAgICAgZm9yZXN0OiAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguZm9yZXN0XG4gICAgICBncmVlbjogICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5ncmVlblxuICAgICAgbGltZTogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgubGltZVxuICAgICAgcXVhZ21pcmU6ICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgucXVhZ21pcmVcbiAgICAgIGhvbmV5ZGV3OiAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmhvbmV5ZGV3XG4gICAgICBpcm9uOiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5pcm9uXG4gICAgICBqYWRlOiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5qYWRlXG4gICAgICBraGFraTogICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5raGFraVxuICAgICAgbWFsbG93OiAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgubWFsbG93XG4gICAgICBuYXZ5OiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5uYXZ5XG4gICAgICBvcnBpbWVudDogICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5vcnBpbWVudFxuICAgICAgcGluazogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgucGlua1xuICAgICAgcmVkOiAgICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgucmVkXG4gICAgICBza3k6ICAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5za3lcbiAgICAgIHR1cnF1b2lzZTogICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnR1cnF1b2lzZVxuICAgICAgdmlvbGV0OiAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgudmlvbGV0XG4gICAgICB3aW5lOiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC53aW5lXG4gICAgICB1cmFuaXVtOiAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC51cmFuaXVtXG4gICAgICB4YW50aGluOiAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC54YW50aGluXG4gICAgICB5ZWxsb3c6ICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC55ZWxsb3dcbiAgICAgIHppbm5pYTogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4Lnppbm5pYVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGJnX2JsYWNrOiAgICAgICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmJsYWNrXG4gICAgICBiZ19kYXJrc2xhdGVncmF5OiAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5kYXJrc2xhdGVncmF5XG4gICAgICBiZ19kaW1ncmF5OiAgICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5kaW1ncmF5XG4gICAgICBiZ19zbGF0ZWdyYXk6ICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5zbGF0ZWdyYXlcbiAgICAgIGJnX2dyYXk6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmdyYXlcbiAgICAgIGJnX2xpZ2h0c2xhdGVncmF5OiAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmxpZ2h0c2xhdGVncmF5XG4gICAgICBiZ19kYXJrZ3JheTogICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5kYXJrZ3JheVxuICAgICAgYmdfc2lsdmVyOiAgICAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuc2lsdmVyXG4gICAgICBiZ19saWdodGdyYXk6ICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5saWdodGdyYXlcbiAgICAgIGJnX2dhaW5zYm9ybzogICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmdhaW5zYm9yb1xuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGJnX3doaXRlOiAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LndoaXRlXG4gICAgICBiZ19hbWV0aHlzdDogICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5hbWV0aHlzdFxuICAgICAgYmdfYmx1ZTogICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguYmx1ZVxuICAgICAgYmdfY2FyYW1lbDogICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguY2FyYW1lbFxuICAgICAgYmdfZGFtc29uOiAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguZGFtc29uXG4gICAgICBiZ19lYm9ueTogICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5lYm9ueVxuICAgICAgYmdfZm9yZXN0OiAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguZm9yZXN0XG4gICAgICBiZ19ncmVlbjogICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5ncmVlblxuICAgICAgYmdfbGltZTogICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgubGltZVxuICAgICAgYmdfcXVhZ21pcmU6ICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgucXVhZ21pcmVcbiAgICAgIGJnX2hvbmV5ZGV3OiAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmhvbmV5ZGV3XG4gICAgICBiZ19pcm9uOiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5pcm9uXG4gICAgICBiZ19qYWRlOiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5qYWRlXG4gICAgICBiZ19raGFraTogICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5raGFraVxuICAgICAgYmdfbWFsbG93OiAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgubWFsbG93XG4gICAgICBiZ19uYXZ5OiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5uYXZ5XG4gICAgICBiZ19vcnBpbWVudDogICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5vcnBpbWVudFxuICAgICAgYmdfcGluazogICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgucGlua1xuICAgICAgYmdfcmVkOiAgICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgucmVkXG4gICAgICBiZ19za3k6ICAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5za3lcbiAgICAgIGJnX3R1cnF1b2lzZTogICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnR1cnF1b2lzZVxuICAgICAgYmdfdmlvbGV0OiAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgudmlvbGV0XG4gICAgICBiZ193aW5lOiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC53aW5lXG4gICAgICBiZ191cmFuaXVtOiAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC51cmFuaXVtXG4gICAgICBiZ194YW50aGluOiAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC54YW50aGluXG4gICAgICBiZ195ZWxsb3c6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC55ZWxsb3dcbiAgICAgIGJnX3ppbm5pYTogICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4Lnppbm5pYVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4geyBhbnNpX2NvbG9yc19hbmRfZWZmZWN0czogUiwgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Fuc2lfY2h1bmtlcjogLT5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBnZXRfc3RyaW5nX3dpZHRoICA9ICggdGV4dCApIC0+XG4gICAgVkFSSU9VU19CUklDUyAgICAgICAgICAgPSByZXF1aXJlICcuL3ZhcmlvdXMtYnJpY3MnXG4gICAgeyBzZXRfZ2V0dGVyLFxuICAgICAgaGlkZSwgICAgICAgICAgICAgICB9ID0gVkFSSU9VU19CUklDUy5yZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHMoKVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBnZXRfc3RyaW5nX3dpZHRoICA9ICggdGV4dCApIC0+XG4gICAgICByZXR1cm4gKCBBcnJheS5mcm9tIHRleHQgKS5sZW5ndGhcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgYW5zaV9tYXRjaGVyICAgICAgPSAvKCg/OlxceDFiXFxbW15tXSttKSspL2dcbiAgICBzZWdtZW50ZXIgICAgICAgICA9IG5ldyBJbnRsLlNlZ21lbnRlcigpXG4gICAgc3BsaXRfZ2x5cGhzICAgICAgPSAoIHRleHQgKSAtPiAoIGQuc2VnbWVudCBmb3IgZCBmcm9tIHNlZ21lbnRlci5zZWdtZW50IHRleHQgKVxuICAgIGNmZ190ZW1wbGF0ZSAgICAgID0gT2JqZWN0LmZyZWV6ZSB7IGdldF9zdHJpbmdfd2lkdGgsIH1cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgaW50ZXJuYWxzICAgICAgICAgPSBPYmplY3QuZnJlZXplIHsgYW5zaV9tYXRjaGVyLCBzZWdtZW50ZXIsIHNwbGl0X2dseXBocywgY2ZnX3RlbXBsYXRlLCB9XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgQ2h1bmtcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIFtTeW1ib2wuaXRlcmF0b3JdOiAtPiB5aWVsZCBmcm9tIEB0ZXh0XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKHsgaGFzX2Fuc2ksIHdpZHRoLCB0ZXh0LCB9KSAtPlxuICAgICAgICBAd2lkdGggPSB3aWR0aFxuICAgICAgICBoaWRlIEAsICdoYXNfYW5zaScsIGhhc19hbnNpXG4gICAgICAgIGhpZGUgQCwgJ3RleHQnLCAgICAgdGV4dFxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2xlbmd0aCcsIC0+IEB0ZXh0Lmxlbmd0aFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIEFuc2lfY2h1bmtlclxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgW1N5bWJvbC5pdGVyYXRvcl06IC0+IHlpZWxkIGZyb20gQGNodW5rc1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICggY2ZnID0gbnVsbCApIC0+XG4gICAgICAgIGhpZGUgQCwgJ2NmZycsIHsgY2ZnX3RlbXBsYXRlLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgaGlkZSBALCAnY2h1bmtzJywgICBbXVxuICAgICAgICBAcmVzZXQoKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2hhc19hbnNpJywgLT5cbiAgICAgICAgZm9yIGNodW5rIGluIEBjaHVua3NcbiAgICAgICAgICByZXR1cm4gdHJ1ZSBpZiBjaHVuay5oYXNfYW5zaVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAnd2lkdGgnLCAgLT4gQGNodW5rcy5yZWR1Y2UgKCAoIHN1bSwgY2h1bmsgKSAtPiBzdW0gKyBjaHVuay53aWR0aCAgICksIDBcbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAnbGVuZ3RoJywgLT4gQGNodW5rcy5yZWR1Y2UgKCAoIHN1bSwgY2h1bmsgKSAtPiBzdW0gKyBjaHVuay5sZW5ndGggICksIDBcbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAndGV4dCcsICAgLT4gQGNodW5rcy5yZWR1Y2UgKCAoIHN1bSwgY2h1bmsgKSAtPiBzdW0gKyBjaHVuay50ZXh0ICAgICksICcnXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByZXNldDogLT5cbiAgICAgICAgQGNodW5rcyAgID0gW11cbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNodW5raWZ5OiAoIHNvdXJjZSApIC0+XG4gICAgICAgIEByZXNldCgpXG4gICAgICAgIGlmIHNvdXJjZSBpcyAnJ1xuICAgICAgICAgICMjIyBUQUlOVCBtaWdodCBhcyB3ZWxsIHJldHVybiBhbiBlbXB0eSBsaXN0IG9mIEBjaHVua3MgIyMjXG4gICAgICAgICAgQGNodW5rcy5wdXNoIG5ldyBDaHVuayB7IGhhc19hbnNpOiBmYWxzZSwgd2lkdGg6IDAsIHRleHQ6ICcnLCB9XG4gICAgICAgICAgcmV0dXJuIEBcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGhhc19hbnNpID0gdHJ1ZVxuICAgICAgICBmb3IgdGV4dCBpbiBzb3VyY2Uuc3BsaXQgYW5zaV9tYXRjaGVyXG4gICAgICAgICAgaGFzX2Fuc2kgID0gbm90IGhhc19hbnNpXG4gICAgICAgICAgY29udGludWUgaWYgdGV4dCBpcyAnJ1xuICAgICAgICAgIHdpZHRoICAgICA9IGlmIGhhc19hbnNpIHRoZW4gMCBlbHNlIEBjZmcuZ2V0X3N0cmluZ193aWR0aCB0ZXh0XG4gICAgICAgICAgQGNodW5rcy5wdXNoIG5ldyBDaHVuayB7IGhhc19hbnNpLCB3aWR0aCwgdGV4dCwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIEBcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjaHVua2lmeSA9ICggdGV4dCApIC0+IG5ldyBBbnNpX2NodW5rZXIgdGV4dFxuXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IEFuc2lfY2h1bmtlciwgY2h1bmtpZnksIGludGVybmFscywgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgQU5TSV9CUklDU1xuXG4iXX0=
//# sourceURL=../src/ansi-brics.coffee