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
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, ANSI_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Fuc2ktYnJpY3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLFVBQUE7Ozs7O0VBS0EsVUFBQSxHQUtFLENBQUE7Ozs7SUFBQSxZQUFBLEVBQWMsUUFBQSxDQUFBLENBQUE7QUFFaEIsVUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUE7O01BQ0ksSUFBQSxHQUFPLElBQUEsQ0FBVSxPQUFOLE1BQUEsS0FBQSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUF3QlQsV0FBYSxDQUFDLENBQUUsQ0FBRixFQUFLLENBQUwsRUFBUSxDQUFSLENBQUQsQ0FBQTtpQkFBa0IsQ0FBQSxXQUFBLENBQUEsQ0FBYyxDQUFkLENBQUEsQ0FBQSxDQUFBLENBQW1CLENBQW5CLENBQUEsQ0FBQSxDQUFBLENBQXdCLENBQXhCLENBQUEsQ0FBQTtRQUFsQjs7UUFDYixXQUFhLENBQUMsQ0FBRSxDQUFGLEVBQUssQ0FBTCxFQUFRLENBQVIsQ0FBRCxDQUFBO2lCQUFrQixDQUFBLFdBQUEsQ0FBQSxDQUFjLENBQWQsQ0FBQSxDQUFBLENBQUEsQ0FBbUIsQ0FBbkIsQ0FBQSxDQUFBLENBQUEsQ0FBd0IsQ0FBeEIsQ0FBQSxDQUFBO1FBQWxCOztRQUNiLFdBQWEsQ0FBRSxHQUFGLENBQUE7aUJBQVcsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsWUFBRCxDQUFjLEdBQWQsQ0FBYjtRQUFYOztRQUNiLFdBQWEsQ0FBRSxHQUFGLENBQUE7aUJBQVcsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsWUFBRCxDQUFjLEdBQWQsQ0FBYjtRQUFYOztRQUNiLFlBQWMsQ0FBRSxJQUFGLENBQUE7QUFDcEIsY0FBQSxHQUFBLEVBQUE7VUFBUSxHQUFBLDZDQUF3QixJQUFDLENBQUEsTUFBTSxDQUFDO0FBQ2hDLGlCQUFPLElBQUMsQ0FBQSxXQUFELENBQWEsR0FBYjtR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Iid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQU5TSV9CUklDUyA9XG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Fuc2k6IC0+XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgQU5TSSA9IG5ldyBjbGFzcyBBbnNpXG4gICAgICAjIyNcblxuICAgICAgKiBhcyBmb3IgdGhlIGJhY2tncm91bmQgKCdiZycpLCBvbmx5IGNvbG9ycyBhbmQgbm8gZWZmZWN0cyBjYW4gYmUgc2V0OyBpbiBhZGRpdGlvbiwgdGhlIGJnIGNvbG9yIGNhbiBiZVxuICAgICAgICBzZXQgdG8gaXRzIGRlZmF1bHQgKG9yICd0cmFuc3BhcmVudCcpLCB3aGljaCB3aWxsIHNob3cgdGhlIHRlcm1pbmFsJ3Mgb3IgdGhlIHRlcm1pbmFsIGVtdWxhdG9yJ3NcbiAgICAgICAgY29uZmlndXJlZCBiZyBjb2xvclxuICAgICAgKiBhcyBmb3IgdGhlIGZvcmVncm91bmQgKCdmZycpLCBjb2xvcnMgYW5kIGVmZmVjdHMgc3VjaCBhcyBibGlua2luZywgYm9sZCwgaXRhbGljLCB1bmRlcmxpbmUsIG92ZXJsaW5lLFxuICAgICAgICBzdHJpa2UgY2FuIGJlIHNldDsgaW4gYWRkaXRpb24sIHRoZSBjb25maWd1cmVkIHRlcm1pbmFsIGRlZmF1bHQgZm9udCBjb2xvciBjYW4gYmUgc2V0LCBhbmQgZWFjaCBlZmZlY3RcbiAgICAgICAgaGFzIGEgZGVkaWNhdGVkIG9mZi1zd2l0Y2hcbiAgICAgICogbmVhdCB0YWJsZXMgY2FuIGJlIGRyYXduIGJ5IGNvbWJpbmluZyB0aGUgb3ZlcmxpbmUgZWZmZWN0IHdpdGggYOKUgmAgVSsyNTAyICdCb3ggRHJhd2luZyBMaWdodCBWZXJ0aWNhbFxuICAgICAgICBMaW5lJzsgdGhlIHJlbm1hcmthYmxlIGZlYXR1cmUgb2YgdGhpcyBpcyB0aGF0IGl0IG1pbmltaXplcyBzcGFjaW5nIGFyb3VuZCBjaGFyYWN0ZXJzIG1lYW5pbmcgaXQnc1xuICAgICAgICBwb3NzaWJsZSB0byBoYXZlIGFkamFjZW50IHJvd3Mgb2YgY2VsbHMgc2VwYXJhdGVkIGZyb20gdGhlIG5leHQgcm93IGJ5IGEgYm9yZGVyIHdpdGhvdXQgaGF2aW5nIHRvXG4gICAgICAgIHNhY3JpZmljZSBhIGxpbmUgb2YgdGV4dCBqdXN0IHRvIGRyYXcgdGhlIGJvcmRlci5cbiAgICAgICogd2hpbGUgdGhlIHR3byBjb2xvciBwYWxhdHRlcyBpbXBsaWVkIGJ5IHRoZSBzdGFuZGFyZCBYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhcbiAgICAgICAgKiBiZXR0ZXIgdG8gb25seSB1c2UgZnVsbCBSR0IgdGhhbiB0byBmdXp6IGFyb3VuZCB3aXRoIHBhbGV0dGVzXG4gICAgICAgICogYXBwcyB0aGF0IHVzZSBjb2xvcnMgYXQgYWxsIHNob3VsZCBiZSBwcmVwYXJlZCBmb3IgZGFyayBhbmQgYnJpZ2h0IGJhY2tncm91bmRzXG4gICAgICAgICogaW4gZ2VuZXJhbCBiZXR0ZXIgdG8gc2V0IGZnLCBiZyBjb2xvcnMgdGhhbiB0byB1c2UgcmV2ZXJzZVxuICAgICAgICAqIGJ1dCByZXZlcnNlIGFjdHVhbGx5IGRvZXMgZG8gd2hhdCBpdCBzYXlz4oCUaXQgc3dhcHMgZmcgd2l0aCBiZyBjb2xvclxuXG4gICAgICBcXHgxYlszOW0gZGVmYXVsdCBmZyBjb2xvclxuICAgICAgXFx4MWJbNDltIGRlZmF1bHQgYmcgY29sb3JcblxuICAgICAgIyMjXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZmdfZnJvbV9kZWM6IChbIHIsIGcsIGIsIF0pIC0+IFwiXFx4MWJbMzg6Mjo6I3tyfToje2d9OiN7Yn1tXCJcbiAgICAgIGJnX2Zyb21fZGVjOiAoWyByLCBnLCBiLCBdKSAtPiBcIlxceDFiWzQ4OjI6OiN7cn06I3tnfToje2J9bVwiXG4gICAgICBmZ19mcm9tX2hleDogKCByaHggKSAtPiBAZmdfZnJvbV9kZWMgQGRlY19mcm9tX2hleCByaHhcbiAgICAgIGJnX2Zyb21faGV4OiAoIHJoeCApIC0+IEBiZ19mcm9tX2RlYyBAZGVjX2Zyb21faGV4IHJoeFxuICAgICAgZmdfZnJvbV9uYW1lOiAoIG5hbWUgKSAtPlxuICAgICAgICByZ2IgPSBAY29sb3JzWyBuYW1lIF0gPyBAY29sb3JzLmZhbGxiYWNrXG4gICAgICAgIHJldHVybiBAZmdfZnJvbV9kZWMgcmdiXG4gICAgICBkZWNfZnJvbV9oZXg6ICggaGV4ICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdHlwaW5nICMjI1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzMgZXhwZWN0ZWQgdGV4dCwgZ290ICN7cnByIGhleH1cIiB1bmxlc3MgKCB0eXBlb2YgaGV4ICkgaXMgJ3N0cmluZydcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX180IG5vdCBhIHByb3BlciBoZXhhZGVjaW1hbCBSR0IgY29kZTogJyN7aGV4LnJlcGxhY2UgLycvZywgXCJcXFxcJ1wifSdcIiB1bmxlc3MgL14jWzAtOWEtZl17Nn0kL2kudGVzdCBoZXhcbiAgICAgICAgWyByMTYsIGcxNiwgYjE2LCBdID0gWyBoZXhbIDEgLi4gMiBdLCBoZXhbIDMgLi4gNCBdLCBoZXhbIDUgLi4gNiBdLCBdXG4gICAgICAgIHJldHVybiBbICggcGFyc2VJbnQgcjE2LCAxNiApLCAoIHBhcnNlSW50IGcxNiwgMTYgKSwgKCBwYXJzZUludCBiMTYsIDE2ICksIF1cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgQU5TSSwgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Fuc2lfY29sb3JzX2FuZF9lZmZlY3RzOiAtPlxuICAgIHsgQU5TSSwgfSA9IEFOU0lfQlJJQ1MucmVxdWlyZV9hbnNpKClcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmdiX2RlYyA9XG4gICAgICBibGFjazogICAgICAgICAgICAgIFsgICAwLCAgIDAsICAgMCwgXVxuICAgICAgZGFya3NsYXRlZ3JheTogICAgICBbICA0NywgIDc5LCAgNzksIF1cbiAgICAgIGRpbWdyYXk6ICAgICAgICAgICAgWyAxMDUsIDEwNSwgMTA1LCBdXG4gICAgICBzbGF0ZWdyYXk6ICAgICAgICAgIFsgMTEyLCAxMjgsIDE0NCwgXVxuICAgICAgZ3JheTogICAgICAgICAgICAgICBbIDEyOCwgMTI4LCAxMjgsIF1cbiAgICAgIGxpZ2h0c2xhdGVncmF5OiAgICAgWyAxMTksIDEzNiwgMTUzLCBdXG4gICAgICBkYXJrZ3JheTogICAgICAgICAgIFsgMTY5LCAxNjksIDE2OSwgXVxuICAgICAgc2lsdmVyOiAgICAgICAgICAgICBbIDE5MiwgMTkyLCAxOTIsIF1cbiAgICAgIGxpZ2h0Z3JheTogICAgICAgICAgWyAyMTEsIDIxMSwgMjExLCBdXG4gICAgICBnYWluc2Jvcm86ICAgICAgICAgIFsgMjIwLCAyMjAsIDIyMCwgXVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZ2JfaGV4ID1cbiAgICAgIHdoaXRlOiAgICAgICAgICAgICcjZmZmZmZmJ1xuICAgICAgYW1ldGh5c3Q6ICAgICAgICAgJyNmMGEzZmYnXG4gICAgICBibHVlOiAgICAgICAgICAgICAnIzAwNzVkYydcbiAgICAgIGNhcmFtZWw6ICAgICAgICAgICcjOTkzZjAwJ1xuICAgICAgZGFtc29uOiAgICAgICAgICAgJyM0YzAwNWMnXG4gICAgICBlYm9ueTogICAgICAgICAgICAnIzE5MTkxOSdcbiAgICAgIGZvcmVzdDogICAgICAgICAgICcjMDA1YzMxJ1xuICAgICAgZ3JlZW46ICAgICAgICAgICAgJyMyYmNlNDgnXG4gICAgICBsaW1lOiAgICAgICAgICAgICAnIzlkY2MwMCdcbiAgICAgIHF1YWdtaXJlOiAgICAgICAgICcjNDI2NjAwJ1xuICAgICAgaG9uZXlkZXc6ICAgICAgICAgJyNmZmNjOTknXG4gICAgICBpcm9uOiAgICAgICAgICAgICAnIzgwODA4MCdcbiAgICAgIGphZGU6ICAgICAgICAgICAgICcjOTRmZmI1J1xuICAgICAga2hha2k6ICAgICAgICAgICAgJyM4ZjdjMDAnXG4gICAgICBtYWxsb3c6ICAgICAgICAgICAnI2MyMDA4OCdcbiAgICAgIG5hdnk6ICAgICAgICAgICAgICcjMDAzMzgwJ1xuICAgICAgb3JwaW1lbnQ6ICAgICAgICAgJyNmZmE0MDUnXG4gICAgICBwaW5rOiAgICAgICAgICAgICAnI2ZmYThiYidcbiAgICAgIHJlZDogICAgICAgICAgICAgICcjZmYwMDEwJ1xuICAgICAgc2t5OiAgICAgICAgICAgICAgJyM1ZWYxZjInXG4gICAgICB0dXJxdW9pc2U6ICAgICAgICAnIzAwOTk4ZidcbiAgICAgIHZpb2xldDogICAgICAgICAgICcjNzQwYWZmJ1xuICAgICAgd2luZTogICAgICAgICAgICAgJyM5OTAwMDAnXG4gICAgICB1cmFuaXVtOiAgICAgICAgICAnI2UwZmY2NidcbiAgICAgIHhhbnRoaW46ICAgICAgICAgICcjZmZmZjgwJ1xuICAgICAgeWVsbG93OiAgICAgICAgICAgJyNmZmUxMDAnXG4gICAgICB6aW5uaWE6ICAgICAgICAgICAnI2ZmNTAwNSdcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgUiA9XG4gICAgICBvdmVybGluZTE6ICAgICAgICAgICdcXHgxYls1M20nXG4gICAgICBvdmVybGluZTA6ICAgICAgICAgICdcXHgxYls1NW0nXG4gICAgICBkZWZhdWx0OiAgICAgICAgICAgICdcXHgxYlszOW0nXG4gICAgICBiZ19kZWZhdWx0OiAgICAgICAgICdcXHgxYls0OW0nXG4gICAgICBib2xkOiAgICAgICAgICAgICAgICdcXHgxYlsxbSdcbiAgICAgIGJvbGQwOiAgICAgICAgICAgICAgJ1xceDFiWzIybSdcbiAgICAgIGl0YWxpYzogICAgICAgICAgICAgJ1xceDFiWzNtJ1xuICAgICAgaXRhbGljMDogICAgICAgICAgICAnXFx4MWJbMjNtJ1xuICAgICAgcmVzZXQ6ICAgICAgICAgICAgICAnXFx4MWJbMG0nXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgYmxhY2s6ICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuYmxhY2tcbiAgICAgIGRhcmtzbGF0ZWdyYXk6ICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmRhcmtzbGF0ZWdyYXlcbiAgICAgIGRpbWdyYXk6ICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmRpbWdyYXlcbiAgICAgIHNsYXRlZ3JheTogICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLnNsYXRlZ3JheVxuICAgICAgZ3JheTogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuZ3JheVxuICAgICAgbGlnaHRzbGF0ZWdyYXk6ICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMubGlnaHRzbGF0ZWdyYXlcbiAgICAgIGRhcmtncmF5OiAgICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmRhcmtncmF5XG4gICAgICBzaWx2ZXI6ICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5zaWx2ZXJcbiAgICAgIGxpZ2h0Z3JheTogICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLmxpZ2h0Z3JheVxuICAgICAgZ2FpbnNib3JvOiAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuZ2FpbnNib3JvXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgd2hpdGU6ICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgud2hpdGVcbiAgICAgIGFtZXRoeXN0OiAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmFtZXRoeXN0XG4gICAgICBibHVlOiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5ibHVlXG4gICAgICBjYXJhbWVsOiAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5jYXJhbWVsXG4gICAgICBkYW1zb246ICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5kYW1zb25cbiAgICAgIGVib255OiAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmVib255XG4gICAgICBmb3Jlc3Q6ICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5mb3Jlc3RcbiAgICAgIGdyZWVuOiAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmdyZWVuXG4gICAgICBsaW1lOiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5saW1lXG4gICAgICBxdWFnbWlyZTogICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5xdWFnbWlyZVxuICAgICAgaG9uZXlkZXc6ICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguaG9uZXlkZXdcbiAgICAgIGlyb246ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4Lmlyb25cbiAgICAgIGphZGU6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmphZGVcbiAgICAgIGtoYWtpOiAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmtoYWtpXG4gICAgICBtYWxsb3c6ICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5tYWxsb3dcbiAgICAgIG5hdnk6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4Lm5hdnlcbiAgICAgIG9ycGltZW50OiAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4Lm9ycGltZW50XG4gICAgICBwaW5rOiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5waW5rXG4gICAgICByZWQ6ICAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5yZWRcbiAgICAgIHNreTogICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnNreVxuICAgICAgdHVycXVvaXNlOiAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgudHVycXVvaXNlXG4gICAgICB2aW9sZXQ6ICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC52aW9sZXRcbiAgICAgIHdpbmU6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LndpbmVcbiAgICAgIHVyYW5pdW06ICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnVyYW5pdW1cbiAgICAgIHhhbnRoaW46ICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnhhbnRoaW5cbiAgICAgIHllbGxvdzogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnllbGxvd1xuICAgICAgemlubmlhOiAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguemlubmlhXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgYmdfYmxhY2s6ICAgICAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuYmxhY2tcbiAgICAgIGJnX2RhcmtzbGF0ZWdyYXk6ICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmRhcmtzbGF0ZWdyYXlcbiAgICAgIGJnX2RpbWdyYXk6ICAgICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmRpbWdyYXlcbiAgICAgIGJnX3NsYXRlZ3JheTogICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLnNsYXRlZ3JheVxuICAgICAgYmdfZ3JheTogICAgICAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuZ3JheVxuICAgICAgYmdfbGlnaHRzbGF0ZWdyYXk6ICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMubGlnaHRzbGF0ZWdyYXlcbiAgICAgIGJnX2RhcmtncmF5OiAgICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmRhcmtncmF5XG4gICAgICBiZ19zaWx2ZXI6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5zaWx2ZXJcbiAgICAgIGJnX2xpZ2h0Z3JheTogICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLmxpZ2h0Z3JheVxuICAgICAgYmdfZ2FpbnNib3JvOiAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuZ2FpbnNib3JvXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgYmdfd2hpdGU6ICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgud2hpdGVcbiAgICAgIGJnX2FtZXRoeXN0OiAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmFtZXRoeXN0XG4gICAgICBiZ19ibHVlOiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5ibHVlXG4gICAgICBiZ19jYXJhbWVsOiAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5jYXJhbWVsXG4gICAgICBiZ19kYW1zb246ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5kYW1zb25cbiAgICAgIGJnX2Vib255OiAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmVib255XG4gICAgICBiZ19mb3Jlc3Q6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5mb3Jlc3RcbiAgICAgIGJnX2dyZWVuOiAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmdyZWVuXG4gICAgICBiZ19saW1lOiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5saW1lXG4gICAgICBiZ19xdWFnbWlyZTogICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5xdWFnbWlyZVxuICAgICAgYmdfaG9uZXlkZXc6ICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguaG9uZXlkZXdcbiAgICAgIGJnX2lyb246ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4Lmlyb25cbiAgICAgIGJnX2phZGU6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmphZGVcbiAgICAgIGJnX2toYWtpOiAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmtoYWtpXG4gICAgICBiZ19tYWxsb3c6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5tYWxsb3dcbiAgICAgIGJnX25hdnk6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4Lm5hdnlcbiAgICAgIGJnX29ycGltZW50OiAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4Lm9ycGltZW50XG4gICAgICBiZ19waW5rOiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5waW5rXG4gICAgICBiZ19yZWQ6ICAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5yZWRcbiAgICAgIGJnX3NreTogICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnNreVxuICAgICAgYmdfdHVycXVvaXNlOiAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgudHVycXVvaXNlXG4gICAgICBiZ192aW9sZXQ6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC52aW9sZXRcbiAgICAgIGJnX3dpbmU6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LndpbmVcbiAgICAgIGJnX3VyYW5pdW06ICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnVyYW5pdW1cbiAgICAgIGJnX3hhbnRoaW46ICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnhhbnRoaW5cbiAgICAgIGJnX3llbGxvdzogICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnllbGxvd1xuICAgICAgYmdfemlubmlhOiAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguemlubmlhXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiB7IGFuc2lfY29sb3JzX2FuZF9lZmZlY3RzOiBSLCB9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfYW5zaV9jaHVua2VyOiAtPlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIFZBUklPVVNfQlJJQ1MgICAgICAgICAgID0gcmVxdWlyZSAnLi92YXJpb3VzLWJyaWNzJ1xuICAgIHsgc2V0X2dldHRlcixcbiAgICAgIGhpZGUsICAgICAgICAgICAgICAgfSA9IFZBUklPVVNfQlJJQ1MucmVxdWlyZV9tYW5hZ2VkX3Byb3BlcnR5X3Rvb2xzKClcbiAgICBzZWdtZW50ZXIgICAgICAgICAgICAgICA9IG5ldyBJbnRsLlNlZ21lbnRlcigpXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHNpbXBsZV9nZXRfd2lkdGggID0gKCB0ZXh0ICkgLT4gKCBBcnJheS5mcm9tIHRleHQgKS5sZW5ndGhcbiAgICBhbnNpX3NwbGl0dGVyICAgICA9IC8oKD86XFx4MWJcXFtbXm1dK20pKykvZ1xuICAgIGpzX3NlZ21lbnRpemUgICAgID0gKCB0ZXh0ICkgLT4gKCBkLnNlZ21lbnQgZm9yIGQgZnJvbSBzZWdtZW50ZXIuc2VnbWVudCB0ZXh0IClcbiAgICBjZmdfdGVtcGxhdGUgICAgICA9IE9iamVjdC5mcmVlemVcbiAgICAgIHNwbGl0dGVyOiAgICAgICAgICAgYW5zaV9zcGxpdHRlclxuICAgICAgZ2V0X3dpZHRoOiAgICAgICAgICBzaW1wbGVfZ2V0X3dpZHRoXG4gICAgICBzZWdtZW50aXplOiAgICAgICAgIGpzX3NlZ21lbnRpemVcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgaW50ZXJuYWxzICAgICAgICAgPSBPYmplY3QuZnJlZXplIHsgc2ltcGxlX2dldF93aWR0aCwgYW5zaV9zcGxpdHRlciwganNfc2VnbWVudGl6ZSwgY2ZnX3RlbXBsYXRlLCB9XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgQ2h1bmtcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIFtTeW1ib2wuaXRlcmF0b3JdOiAtPiB5aWVsZCBmcm9tIEB0ZXh0XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKHsgaGFzX2Fuc2ksIHdpZHRoLCB0ZXh0LCB9KSAtPlxuICAgICAgICBAd2lkdGggPSB3aWR0aFxuICAgICAgICBoaWRlIEAsICdoYXNfYW5zaScsIGhhc19hbnNpXG4gICAgICAgIGhpZGUgQCwgJ3RleHQnLCAgICAgdGV4dFxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2xlbmd0aCcsIC0+IEB0ZXh0Lmxlbmd0aFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIEFuc2lfY2h1bmtlclxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgW1N5bWJvbC5pdGVyYXRvcl06IC0+IHlpZWxkIGZyb20gQGNodW5rc1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICggY2ZnID0gbnVsbCApIC0+XG4gICAgICAgIGhpZGUgQCwgJ2NmZycsIHsgY2ZnX3RlbXBsYXRlLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgaGlkZSBALCAnY2h1bmtzJywgICBbXVxuICAgICAgICBAcmVzZXQoKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2hhc19hbnNpJywgLT5cbiAgICAgICAgZm9yIGNodW5rIGluIEBjaHVua3NcbiAgICAgICAgICByZXR1cm4gdHJ1ZSBpZiBjaHVuay5oYXNfYW5zaVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAnd2lkdGgnLCAgLT4gQGNodW5rcy5yZWR1Y2UgKCAoIHN1bSwgY2h1bmsgKSAtPiBzdW0gKyBjaHVuay53aWR0aCAgICksIDBcbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAnbGVuZ3RoJywgLT4gQGNodW5rcy5yZWR1Y2UgKCAoIHN1bSwgY2h1bmsgKSAtPiBzdW0gKyBjaHVuay5sZW5ndGggICksIDBcbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAndGV4dCcsICAgLT4gQGNodW5rcy5yZWR1Y2UgKCAoIHN1bSwgY2h1bmsgKSAtPiBzdW0gKyBjaHVuay50ZXh0ICAgICksICcnXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByZXNldDogLT5cbiAgICAgICAgQGNodW5rcyAgID0gW11cbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNodW5raWZ5OiAoIHNvdXJjZSApIC0+XG4gICAgICAgIEByZXNldCgpXG4gICAgICAgIGlmIHNvdXJjZSBpcyAnJ1xuICAgICAgICAgICMjIyBUQUlOVCBtaWdodCBhcyB3ZWxsIHJldHVybiBhbiBlbXB0eSBsaXN0IG9mIEBjaHVua3MgIyMjXG4gICAgICAgICAgQGNodW5rcy5wdXNoIG5ldyBDaHVuayB7IGhhc19hbnNpOiBmYWxzZSwgd2lkdGg6IDAsIHRleHQ6ICcnLCB9XG4gICAgICAgICAgcmV0dXJuIEBcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGhhc19hbnNpID0gdHJ1ZVxuICAgICAgICBmb3IgdGV4dCBpbiBzb3VyY2Uuc3BsaXQgQGNmZy5zcGxpdHRlclxuICAgICAgICAgIGhhc19hbnNpICA9IG5vdCBoYXNfYW5zaVxuICAgICAgICAgIGNvbnRpbnVlIGlmIHRleHQgaXMgJydcbiAgICAgICAgICB3aWR0aCAgICAgPSBpZiBoYXNfYW5zaSB0aGVuIDAgZWxzZSBAY2ZnLmdldF93aWR0aCB0ZXh0XG4gICAgICAgICAgQGNodW5rcy5wdXNoIG5ldyBDaHVuayB7IGhhc19hbnNpLCB3aWR0aCwgdGV4dCwgfVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIEBcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjaHVua2lmeSA9ICggdGV4dCApIC0+IG5ldyBBbnNpX2NodW5rZXIgdGV4dFxuXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IEFuc2lfY2h1bmtlciwgY2h1bmtpZnksIGludGVybmFscywgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgQU5TSV9CUklDU1xuXG4iXX0=
//# sourceURL=../src/ansi-brics.coffee