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
      var Ansi_chunker, Chunk, VARIOUS_BRICS, ansi_matcher, cfg_template, chunkify, exports, get_string_width, hide, internals, js_segmentize, segmenter, set_getter;
      //=========================================================================================================
      VARIOUS_BRICS = require('./various-brics');
      ({set_getter, hide} = VARIOUS_BRICS.require_managed_property_tools());
      //.........................................................................................................
      get_string_width = function(text) {
        return (Array.from(text)).length;
      };
      //.........................................................................................................
      ansi_matcher = /((?:\x1b\[[^m]+m)+)/g;
      segmenter = new Intl.Segmenter();
      js_segmentize = function(text) {
        var d, results;
        results = [];
        for (d of segmenter.segment(text)) {
          results.push(d.segment);
        }
        return results;
      };
      cfg_template = Object.freeze({get_string_width});
      // get_string_width
      // segmentize: js_segmentize
      //.........................................................................................................
      internals = Object.freeze({ansi_matcher, segmenter, js_segmentize, cfg_template});
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Fuc2ktYnJpY3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLFVBQUE7Ozs7O0VBS0EsVUFBQSxHQUtFLENBQUE7Ozs7SUFBQSxZQUFBLEVBQWMsUUFBQSxDQUFBLENBQUE7QUFFaEIsVUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUE7O01BQ0ksSUFBQSxHQUFPLElBQUEsQ0FBVSxPQUFOLE1BQUEsS0FBQSxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUF3QlQsV0FBYSxDQUFDLENBQUUsQ0FBRixFQUFLLENBQUwsRUFBUSxDQUFSLENBQUQsQ0FBQTtpQkFBa0IsQ0FBQSxXQUFBLENBQUEsQ0FBYyxDQUFkLENBQUEsQ0FBQSxDQUFBLENBQW1CLENBQW5CLENBQUEsQ0FBQSxDQUFBLENBQXdCLENBQXhCLENBQUEsQ0FBQTtRQUFsQjs7UUFDYixXQUFhLENBQUMsQ0FBRSxDQUFGLEVBQUssQ0FBTCxFQUFRLENBQVIsQ0FBRCxDQUFBO2lCQUFrQixDQUFBLFdBQUEsQ0FBQSxDQUFjLENBQWQsQ0FBQSxDQUFBLENBQUEsQ0FBbUIsQ0FBbkIsQ0FBQSxDQUFBLENBQUEsQ0FBd0IsQ0FBeEIsQ0FBQSxDQUFBO1FBQWxCOztRQUNiLFdBQWEsQ0FBRSxHQUFGLENBQUE7aUJBQVcsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsWUFBRCxDQUFjLEdBQWQsQ0FBYjtRQUFYOztRQUNiLFdBQWEsQ0FBRSxHQUFGLENBQUE7aUJBQVcsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsWUFBRCxDQUFjLEdBQWQsQ0FBYjtRQUFYOztRQUNiLFlBQWMsQ0FBRSxJQUFGLENBQUE7QUFDcEIsY0FBQSxHQUFBLEVBQUE7VUFBUSxHQUFBLDZDQUF3QixJQUFDLENBQUEsTUFBTSxDQUFDO0FBQ2hDLGlCQUFPLElBQUMsQ0FBQSxXQUFELENBQWEsR0FBYjtR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IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5BTlNJX0JSSUNTID1cbiAgXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfYW5zaTogLT5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBBTlNJID0gbmV3IGNsYXNzIEFuc2lcbiAgICAgICMjI1xuXG4gICAgICAqIGFzIGZvciB0aGUgYmFja2dyb3VuZCAoJ2JnJyksIG9ubHkgY29sb3JzIGFuZCBubyBlZmZlY3RzIGNhbiBiZSBzZXQ7IGluIGFkZGl0aW9uLCB0aGUgYmcgY29sb3IgY2FuIGJlXG4gICAgICAgIHNldCB0byBpdHMgZGVmYXVsdCAob3IgJ3RyYW5zcGFyZW50JyksIHdoaWNoIHdpbGwgc2hvdyB0aGUgdGVybWluYWwncyBvciB0aGUgdGVybWluYWwgZW11bGF0b3Inc1xuICAgICAgICBjb25maWd1cmVkIGJnIGNvbG9yXG4gICAgICAqIGFzIGZvciB0aGUgZm9yZWdyb3VuZCAoJ2ZnJyksIGNvbG9ycyBhbmQgZWZmZWN0cyBzdWNoIGFzIGJsaW5raW5nLCBib2xkLCBpdGFsaWMsIHVuZGVybGluZSwgb3ZlcmxpbmUsXG4gICAgICAgIHN0cmlrZSBjYW4gYmUgc2V0OyBpbiBhZGRpdGlvbiwgdGhlIGNvbmZpZ3VyZWQgdGVybWluYWwgZGVmYXVsdCBmb250IGNvbG9yIGNhbiBiZSBzZXQsIGFuZCBlYWNoIGVmZmVjdFxuICAgICAgICBoYXMgYSBkZWRpY2F0ZWQgb2ZmLXN3aXRjaFxuICAgICAgKiBuZWF0IHRhYmxlcyBjYW4gYmUgZHJhd24gYnkgY29tYmluaW5nIHRoZSBvdmVybGluZSBlZmZlY3Qgd2l0aCBg4pSCYCBVKzI1MDIgJ0JveCBEcmF3aW5nIExpZ2h0IFZlcnRpY2FsXG4gICAgICAgIExpbmUnOyB0aGUgcmVubWFya2FibGUgZmVhdHVyZSBvZiB0aGlzIGlzIHRoYXQgaXQgbWluaW1pemVzIHNwYWNpbmcgYXJvdW5kIGNoYXJhY3RlcnMgbWVhbmluZyBpdCdzXG4gICAgICAgIHBvc3NpYmxlIHRvIGhhdmUgYWRqYWNlbnQgcm93cyBvZiBjZWxscyBzZXBhcmF0ZWQgZnJvbSB0aGUgbmV4dCByb3cgYnkgYSBib3JkZXIgd2l0aG91dCBoYXZpbmcgdG9cbiAgICAgICAgc2FjcmlmaWNlIGEgbGluZSBvZiB0ZXh0IGp1c3QgdG8gZHJhdyB0aGUgYm9yZGVyLlxuICAgICAgKiB3aGlsZSB0aGUgdHdvIGNvbG9yIHBhbGF0dGVzIGltcGxpZWQgYnkgdGhlIHN0YW5kYXJkIFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFxuICAgICAgICAqIGJldHRlciB0byBvbmx5IHVzZSBmdWxsIFJHQiB0aGFuIHRvIGZ1enogYXJvdW5kIHdpdGggcGFsZXR0ZXNcbiAgICAgICAgKiBhcHBzIHRoYXQgdXNlIGNvbG9ycyBhdCBhbGwgc2hvdWxkIGJlIHByZXBhcmVkIGZvciBkYXJrIGFuZCBicmlnaHQgYmFja2dyb3VuZHNcbiAgICAgICAgKiBpbiBnZW5lcmFsIGJldHRlciB0byBzZXQgZmcsIGJnIGNvbG9ycyB0aGFuIHRvIHVzZSByZXZlcnNlXG4gICAgICAgICogYnV0IHJldmVyc2UgYWN0dWFsbHkgZG9lcyBkbyB3aGF0IGl0IHNheXPigJRpdCBzd2FwcyBmZyB3aXRoIGJnIGNvbG9yXG5cbiAgICAgIFxceDFiWzM5bSBkZWZhdWx0IGZnIGNvbG9yXG4gICAgICBcXHgxYls0OW0gZGVmYXVsdCBiZyBjb2xvclxuXG4gICAgICAjIyNcbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmZ19mcm9tX2RlYzogKFsgciwgZywgYiwgXSkgLT4gXCJcXHgxYlszODoyOjoje3J9OiN7Z306I3tifW1cIlxuICAgICAgYmdfZnJvbV9kZWM6IChbIHIsIGcsIGIsIF0pIC0+IFwiXFx4MWJbNDg6Mjo6I3tyfToje2d9OiN7Yn1tXCJcbiAgICAgIGZnX2Zyb21faGV4OiAoIHJoeCApIC0+IEBmZ19mcm9tX2RlYyBAZGVjX2Zyb21faGV4IHJoeFxuICAgICAgYmdfZnJvbV9oZXg6ICggcmh4ICkgLT4gQGJnX2Zyb21fZGVjIEBkZWNfZnJvbV9oZXggcmh4XG4gICAgICBmZ19mcm9tX25hbWU6ICggbmFtZSApIC0+XG4gICAgICAgIHJnYiA9IEBjb2xvcnNbIG5hbWUgXSA/IEBjb2xvcnMuZmFsbGJhY2tcbiAgICAgICAgcmV0dXJuIEBmZ19mcm9tX2RlYyByZ2JcbiAgICAgIGRlY19mcm9tX2hleDogKCBoZXggKSAtPlxuICAgICAgICAjIyMgVEFJTlQgdXNlIHByb3BlciB0eXBpbmcgIyMjXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fMyBleHBlY3RlZCB0ZXh0LCBnb3QgI3tycHIgaGV4fVwiIHVubGVzcyAoIHR5cGVvZiBoZXggKSBpcyAnc3RyaW5nJ1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzQgbm90IGEgcHJvcGVyIGhleGFkZWNpbWFsIFJHQiBjb2RlOiAnI3toZXgucmVwbGFjZSAvJy9nLCBcIlxcXFwnXCJ9J1wiIHVubGVzcyAvXiNbMC05YS1mXXs2fSQvaS50ZXN0IGhleFxuICAgICAgICBbIHIxNiwgZzE2LCBiMTYsIF0gPSBbIGhleFsgMSAuLiAyIF0sIGhleFsgMyAuLiA0IF0sIGhleFsgNSAuLiA2IF0sIF1cbiAgICAgICAgcmV0dXJuIFsgKCBwYXJzZUludCByMTYsIDE2ICksICggcGFyc2VJbnQgZzE2LCAxNiApLCAoIHBhcnNlSW50IGIxNiwgMTYgKSwgXVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJldHVybiBleHBvcnRzID0geyBBTlNJLCB9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfYW5zaV9jb2xvcnNfYW5kX2VmZmVjdHM6IC0+XG4gICAgeyBBTlNJLCB9ID0gQU5TSV9CUklDUy5yZXF1aXJlX2Fuc2koKVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZ2JfZGVjID1cbiAgICAgIGJsYWNrOiAgICAgICAgICAgICAgWyAgIDAsICAgMCwgICAwLCBdXG4gICAgICBkYXJrc2xhdGVncmF5OiAgICAgIFsgIDQ3LCAgNzksICA3OSwgXVxuICAgICAgZGltZ3JheTogICAgICAgICAgICBbIDEwNSwgMTA1LCAxMDUsIF1cbiAgICAgIHNsYXRlZ3JheTogICAgICAgICAgWyAxMTIsIDEyOCwgMTQ0LCBdXG4gICAgICBncmF5OiAgICAgICAgICAgICAgIFsgMTI4LCAxMjgsIDEyOCwgXVxuICAgICAgbGlnaHRzbGF0ZWdyYXk6ICAgICBbIDExOSwgMTM2LCAxNTMsIF1cbiAgICAgIGRhcmtncmF5OiAgICAgICAgICAgWyAxNjksIDE2OSwgMTY5LCBdXG4gICAgICBzaWx2ZXI6ICAgICAgICAgICAgIFsgMTkyLCAxOTIsIDE5MiwgXVxuICAgICAgbGlnaHRncmF5OiAgICAgICAgICBbIDIxMSwgMjExLCAyMTEsIF1cbiAgICAgIGdhaW5zYm9ybzogICAgICAgICAgWyAyMjAsIDIyMCwgMjIwLCBdXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJnYl9oZXggPVxuICAgICAgd2hpdGU6ICAgICAgICAgICAgJyNmZmZmZmYnXG4gICAgICBhbWV0aHlzdDogICAgICAgICAnI2YwYTNmZidcbiAgICAgIGJsdWU6ICAgICAgICAgICAgICcjMDA3NWRjJ1xuICAgICAgY2FyYW1lbDogICAgICAgICAgJyM5OTNmMDAnXG4gICAgICBkYW1zb246ICAgICAgICAgICAnIzRjMDA1YydcbiAgICAgIGVib255OiAgICAgICAgICAgICcjMTkxOTE5J1xuICAgICAgZm9yZXN0OiAgICAgICAgICAgJyMwMDVjMzEnXG4gICAgICBncmVlbjogICAgICAgICAgICAnIzJiY2U0OCdcbiAgICAgIGxpbWU6ICAgICAgICAgICAgICcjOWRjYzAwJ1xuICAgICAgcXVhZ21pcmU6ICAgICAgICAgJyM0MjY2MDAnXG4gICAgICBob25leWRldzogICAgICAgICAnI2ZmY2M5OSdcbiAgICAgIGlyb246ICAgICAgICAgICAgICcjODA4MDgwJ1xuICAgICAgamFkZTogICAgICAgICAgICAgJyM5NGZmYjUnXG4gICAgICBraGFraTogICAgICAgICAgICAnIzhmN2MwMCdcbiAgICAgIG1hbGxvdzogICAgICAgICAgICcjYzIwMDg4J1xuICAgICAgbmF2eTogICAgICAgICAgICAgJyMwMDMzODAnXG4gICAgICBvcnBpbWVudDogICAgICAgICAnI2ZmYTQwNSdcbiAgICAgIHBpbms6ICAgICAgICAgICAgICcjZmZhOGJiJ1xuICAgICAgcmVkOiAgICAgICAgICAgICAgJyNmZjAwMTAnXG4gICAgICBza3k6ICAgICAgICAgICAgICAnIzVlZjFmMidcbiAgICAgIHR1cnF1b2lzZTogICAgICAgICcjMDA5OThmJ1xuICAgICAgdmlvbGV0OiAgICAgICAgICAgJyM3NDBhZmYnXG4gICAgICB3aW5lOiAgICAgICAgICAgICAnIzk5MDAwMCdcbiAgICAgIHVyYW5pdW06ICAgICAgICAgICcjZTBmZjY2J1xuICAgICAgeGFudGhpbjogICAgICAgICAgJyNmZmZmODAnXG4gICAgICB5ZWxsb3c6ICAgICAgICAgICAnI2ZmZTEwMCdcbiAgICAgIHppbm5pYTogICAgICAgICAgICcjZmY1MDA1J1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBSID1cbiAgICAgIG92ZXJsaW5lMTogICAgICAgICAgJ1xceDFiWzUzbSdcbiAgICAgIG92ZXJsaW5lMDogICAgICAgICAgJ1xceDFiWzU1bSdcbiAgICAgIGRlZmF1bHQ6ICAgICAgICAgICAgJ1xceDFiWzM5bSdcbiAgICAgIGJnX2RlZmF1bHQ6ICAgICAgICAgJ1xceDFiWzQ5bSdcbiAgICAgIGJvbGQ6ICAgICAgICAgICAgICAgJ1xceDFiWzFtJ1xuICAgICAgYm9sZDA6ICAgICAgICAgICAgICAnXFx4MWJbMjJtJ1xuICAgICAgaXRhbGljOiAgICAgICAgICAgICAnXFx4MWJbM20nXG4gICAgICBpdGFsaWMwOiAgICAgICAgICAgICdcXHgxYlsyM20nXG4gICAgICByZXNldDogICAgICAgICAgICAgICdcXHgxYlswbSdcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBibGFjazogICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5ibGFja1xuICAgICAgZGFya3NsYXRlZ3JheTogICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuZGFya3NsYXRlZ3JheVxuICAgICAgZGltZ3JheTogICAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuZGltZ3JheVxuICAgICAgc2xhdGVncmF5OiAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuc2xhdGVncmF5XG4gICAgICBncmF5OiAgICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5ncmF5XG4gICAgICBsaWdodHNsYXRlZ3JheTogICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5saWdodHNsYXRlZ3JheVxuICAgICAgZGFya2dyYXk6ICAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMuZGFya2dyYXlcbiAgICAgIHNpbHZlcjogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2RlYyByZ2JfZGVjLnNpbHZlclxuICAgICAgbGlnaHRncmF5OiAgICAgICAgICBBTlNJLmZnX2Zyb21fZGVjIHJnYl9kZWMubGlnaHRncmF5XG4gICAgICBnYWluc2Jvcm86ICAgICAgICAgIEFOU0kuZmdfZnJvbV9kZWMgcmdiX2RlYy5nYWluc2Jvcm9cbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB3aGl0ZTogICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC53aGl0ZVxuICAgICAgYW1ldGh5c3Q6ICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguYW1ldGh5c3RcbiAgICAgIGJsdWU6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmJsdWVcbiAgICAgIGNhcmFtZWw6ICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmNhcmFtZWxcbiAgICAgIGRhbXNvbjogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmRhbXNvblxuICAgICAgZWJvbnk6ICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguZWJvbnlcbiAgICAgIGZvcmVzdDogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmZvcmVzdFxuICAgICAgZ3JlZW46ICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguZ3JlZW5cbiAgICAgIGxpbWU6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LmxpbWVcbiAgICAgIHF1YWdtaXJlOiAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnF1YWdtaXJlXG4gICAgICBob25leWRldzogICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC5ob25leWRld1xuICAgICAgaXJvbjogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguaXJvblxuICAgICAgamFkZTogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguamFkZVxuICAgICAga2hha2k6ICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgua2hha2lcbiAgICAgIG1hbGxvdzogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4Lm1hbGxvd1xuICAgICAgbmF2eTogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgubmF2eVxuICAgICAgb3JwaW1lbnQ6ICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgub3JwaW1lbnRcbiAgICAgIHBpbms6ICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnBpbmtcbiAgICAgIHJlZDogICAgICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnJlZFxuICAgICAgc2t5OiAgICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXguc2t5XG4gICAgICB0dXJxdW9pc2U6ICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC50dXJxdW9pc2VcbiAgICAgIHZpb2xldDogICAgICAgICAgICAgQU5TSS5mZ19mcm9tX2hleCByZ2JfaGV4LnZpb2xldFxuICAgICAgd2luZTogICAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgud2luZVxuICAgICAgdXJhbml1bTogICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgudXJhbml1bVxuICAgICAgeGFudGhpbjogICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgueGFudGhpblxuICAgICAgeWVsbG93OiAgICAgICAgICAgICBBTlNJLmZnX2Zyb21faGV4IHJnYl9oZXgueWVsbG93XG4gICAgICB6aW5uaWE6ICAgICAgICAgICAgIEFOU0kuZmdfZnJvbV9oZXggcmdiX2hleC56aW5uaWFcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBiZ19ibGFjazogICAgICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5ibGFja1xuICAgICAgYmdfZGFya3NsYXRlZ3JheTogICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuZGFya3NsYXRlZ3JheVxuICAgICAgYmdfZGltZ3JheTogICAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuZGltZ3JheVxuICAgICAgYmdfc2xhdGVncmF5OiAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuc2xhdGVncmF5XG4gICAgICBiZ19ncmF5OiAgICAgICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5ncmF5XG4gICAgICBiZ19saWdodHNsYXRlZ3JheTogIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5saWdodHNsYXRlZ3JheVxuICAgICAgYmdfZGFya2dyYXk6ICAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMuZGFya2dyYXlcbiAgICAgIGJnX3NpbHZlcjogICAgICAgICAgQU5TSS5iZ19mcm9tX2RlYyByZ2JfZGVjLnNpbHZlclxuICAgICAgYmdfbGlnaHRncmF5OiAgICAgICBBTlNJLmJnX2Zyb21fZGVjIHJnYl9kZWMubGlnaHRncmF5XG4gICAgICBiZ19nYWluc2Jvcm86ICAgICAgIEFOU0kuYmdfZnJvbV9kZWMgcmdiX2RlYy5nYWluc2Jvcm9cbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBiZ193aGl0ZTogICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC53aGl0ZVxuICAgICAgYmdfYW1ldGh5c3Q6ICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguYW1ldGh5c3RcbiAgICAgIGJnX2JsdWU6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmJsdWVcbiAgICAgIGJnX2NhcmFtZWw6ICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmNhcmFtZWxcbiAgICAgIGJnX2RhbXNvbjogICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmRhbXNvblxuICAgICAgYmdfZWJvbnk6ICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguZWJvbnlcbiAgICAgIGJnX2ZvcmVzdDogICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmZvcmVzdFxuICAgICAgYmdfZ3JlZW46ICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguZ3JlZW5cbiAgICAgIGJnX2xpbWU6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LmxpbWVcbiAgICAgIGJnX3F1YWdtaXJlOiAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnF1YWdtaXJlXG4gICAgICBiZ19ob25leWRldzogICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC5ob25leWRld1xuICAgICAgYmdfaXJvbjogICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguaXJvblxuICAgICAgYmdfamFkZTogICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguamFkZVxuICAgICAgYmdfa2hha2k6ICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgua2hha2lcbiAgICAgIGJnX21hbGxvdzogICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4Lm1hbGxvd1xuICAgICAgYmdfbmF2eTogICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgubmF2eVxuICAgICAgYmdfb3JwaW1lbnQ6ICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgub3JwaW1lbnRcbiAgICAgIGJnX3Bpbms6ICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnBpbmtcbiAgICAgIGJnX3JlZDogICAgICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnJlZFxuICAgICAgYmdfc2t5OiAgICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXguc2t5XG4gICAgICBiZ190dXJxdW9pc2U6ICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC50dXJxdW9pc2VcbiAgICAgIGJnX3Zpb2xldDogICAgICAgICAgQU5TSS5iZ19mcm9tX2hleCByZ2JfaGV4LnZpb2xldFxuICAgICAgYmdfd2luZTogICAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgud2luZVxuICAgICAgYmdfdXJhbml1bTogICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgudXJhbml1bVxuICAgICAgYmdfeGFudGhpbjogICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgueGFudGhpblxuICAgICAgYmdfeWVsbG93OiAgICAgICAgICBBTlNJLmJnX2Zyb21faGV4IHJnYl9oZXgueWVsbG93XG4gICAgICBiZ196aW5uaWE6ICAgICAgICAgIEFOU0kuYmdfZnJvbV9oZXggcmdiX2hleC56aW5uaWFcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIHsgYW5zaV9jb2xvcnNfYW5kX2VmZmVjdHM6IFIsIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9hbnNpX2NodW5rZXI6IC0+XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgVkFSSU9VU19CUklDUyAgICAgICAgICAgPSByZXF1aXJlICcuL3ZhcmlvdXMtYnJpY3MnXG4gICAgeyBzZXRfZ2V0dGVyLFxuICAgICAgaGlkZSwgICAgICAgICAgICAgICB9ID0gVkFSSU9VU19CUklDUy5yZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHMoKVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBnZXRfc3RyaW5nX3dpZHRoICA9ICggdGV4dCApIC0+XG4gICAgICByZXR1cm4gKCBBcnJheS5mcm9tIHRleHQgKS5sZW5ndGhcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgYW5zaV9tYXRjaGVyICAgICAgPSAvKCg/OlxceDFiXFxbW15tXSttKSspL2dcbiAgICBzZWdtZW50ZXIgICAgICAgICA9IG5ldyBJbnRsLlNlZ21lbnRlcigpXG4gICAganNfc2VnbWVudGl6ZSAgICAgPSAoIHRleHQgKSAtPiAoIGQuc2VnbWVudCBmb3IgZCBmcm9tIHNlZ21lbnRlci5zZWdtZW50IHRleHQgKVxuICAgIGNmZ190ZW1wbGF0ZSAgICAgID0gT2JqZWN0LmZyZWV6ZSB7IGdldF9zdHJpbmdfd2lkdGgsIH1cbiAgICAgICMgZ2V0X3N0cmluZ193aWR0aFxuICAgICAgIyBzZWdtZW50aXplOiBqc19zZWdtZW50aXplXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGludGVybmFscyAgICAgICAgID0gT2JqZWN0LmZyZWV6ZSB7IGFuc2lfbWF0Y2hlciwgc2VnbWVudGVyLCBqc19zZWdtZW50aXplLCBjZmdfdGVtcGxhdGUsIH1cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBDaHVua1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgW1N5bWJvbC5pdGVyYXRvcl06IC0+IHlpZWxkIGZyb20gQHRleHRcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoeyBoYXNfYW5zaSwgd2lkdGgsIHRleHQsIH0pIC0+XG4gICAgICAgIEB3aWR0aCA9IHdpZHRoXG4gICAgICAgIGhpZGUgQCwgJ2hhc19hbnNpJywgaGFzX2Fuc2lcbiAgICAgICAgaGlkZSBALCAndGV4dCcsICAgICB0ZXh0XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAnbGVuZ3RoJywgLT4gQHRleHQubGVuZ3RoXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgQW5zaV9jaHVua2VyXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBbU3ltYm9sLml0ZXJhdG9yXTogLT4geWllbGQgZnJvbSBAY2h1bmtzXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKCBjZmcgPSBudWxsICkgLT5cbiAgICAgICAgaGlkZSBALCAnY2ZnJywgeyBjZmdfdGVtcGxhdGUuLi4sIGNmZy4uLiwgfVxuICAgICAgICBoaWRlIEAsICdjaHVua3MnLCAgIFtdXG4gICAgICAgIEByZXNldCgpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAnaGFzX2Fuc2knLCAtPlxuICAgICAgICBmb3IgY2h1bmsgaW4gQGNodW5rc1xuICAgICAgICAgIHJldHVybiB0cnVlIGlmIGNodW5rLmhhc19hbnNpXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X2dldHRlciBAOjosICd3aWR0aCcsICAtPiBAY2h1bmtzLnJlZHVjZSAoICggc3VtLCBjaHVuayApIC0+IHN1bSArIGNodW5rLndpZHRoICAgKSwgMFxuICAgICAgc2V0X2dldHRlciBAOjosICdsZW5ndGgnLCAtPiBAY2h1bmtzLnJlZHVjZSAoICggc3VtLCBjaHVuayApIC0+IHN1bSArIGNodW5rLmxlbmd0aCAgKSwgMFxuICAgICAgc2V0X2dldHRlciBAOjosICd0ZXh0JywgICAtPiBAY2h1bmtzLnJlZHVjZSAoICggc3VtLCBjaHVuayApIC0+IHN1bSArIGNodW5rLnRleHQgICAgKSwgJydcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHJlc2V0OiAtPlxuICAgICAgICBAY2h1bmtzICAgPSBbXVxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY2h1bmtpZnk6ICggc291cmNlICkgLT5cbiAgICAgICAgQHJlc2V0KClcbiAgICAgICAgaWYgc291cmNlIGlzICcnXG4gICAgICAgICAgIyMjIFRBSU5UIG1pZ2h0IGFzIHdlbGwgcmV0dXJuIGFuIGVtcHR5IGxpc3Qgb2YgQGNodW5rcyAjIyNcbiAgICAgICAgICBAY2h1bmtzLnB1c2ggbmV3IENodW5rIHsgaGFzX2Fuc2k6IGZhbHNlLCB3aWR0aDogMCwgdGV4dDogJycsIH1cbiAgICAgICAgICByZXR1cm4gQFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgaGFzX2Fuc2kgPSB0cnVlXG4gICAgICAgIGZvciB0ZXh0IGluIHNvdXJjZS5zcGxpdCBhbnNpX21hdGNoZXJcbiAgICAgICAgICBoYXNfYW5zaSAgPSBub3QgaGFzX2Fuc2lcbiAgICAgICAgICBjb250aW51ZSBpZiB0ZXh0IGlzICcnXG4gICAgICAgICAgd2lkdGggICAgID0gaWYgaGFzX2Fuc2kgdGhlbiAwIGVsc2UgQGNmZy5nZXRfc3RyaW5nX3dpZHRoIHRleHRcbiAgICAgICAgICBAY2h1bmtzLnB1c2ggbmV3IENodW5rIHsgaGFzX2Fuc2ksIHdpZHRoLCB0ZXh0LCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gQFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNodW5raWZ5ID0gKCB0ZXh0ICkgLT4gbmV3IEFuc2lfY2h1bmtlciB0ZXh0XG5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgQW5zaV9jaHVua2VyLCBjaHVua2lmeSwgaW50ZXJuYWxzLCB9XG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBBTlNJX0JSSUNTXG5cbiJdfQ==
//# sourceURL=../src/ansi-brics.coffee