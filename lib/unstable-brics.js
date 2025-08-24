(function() {
  'use strict';
  var BRICS,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  //###########################################################################################################

  //===========================================================================================================
  BRICS = {
    
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_next_free_filename: function() {
      var FS, PATH, TMP_exhaustion_error, TMP_validation_error, cache_filename_re, cfg, errors, exists, exports, get_next_filename, get_next_free_filename, rpr;
      cfg = {
        max_retries: 9999,
        prefix: '~.',
        suffix: '.bricabrac-cache'
      };
      cache_filename_re = RegExp(`^(?:${RegExp.escape(cfg.prefix)})(?<first>.*)\\.(?<nr>[0-9]{4})(?:${RegExp.escape(cfg.suffix)})$`, "v");
      // cache_suffix_re = ///
      //   (?: #{RegExp.escape cfg.suffix} )
      //   $
      //   ///v
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
          if (failure_count > cfg.max_retries) {
            throw new errors.TMP_exhaustion_error(`Ω___3 too many (${failure_count}) retries;  path ${rpr(R)} exists`);
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
      // swap_suffix = ( path, suffix ) -> path.replace cache_suffix_re, suffix
      //.......................................................................................................
      return exports = {get_next_free_filename, get_next_filename, exists, cache_filename_re, errors};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_command_line_tools: function() {
      var CP, exports, get_command_line_result, get_wc_max_line_length;
      CP = require('node:child_process');
      //-----------------------------------------------------------------------------------------------------------
      get_command_line_result = function(command, input) {
        return (CP.execSync(command, {
          encoding: 'utf-8',
          input
        })).replace(/\n$/s, '');
      };
      //-----------------------------------------------------------------------------------------------------------
      get_wc_max_line_length = function(text) {
        /* thx to https://unix.stackexchange.com/a/258551/280204 */
        return parseInt(get_command_line_result('wc --max-line-length', text), 10);
      };
      //.......................................................................................................
      return exports = {get_command_line_result, get_wc_max_line_length};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_progress_indicators: function() {
      var C, bg, bg0, exports, fg, fg0, get_percentage_bar, hollow_percentage_bar;
      ({
        ansi_colors_and_effects: C
      } = (require('./ansi-brics')).require_ansi_colors_and_effects());
      fg = C.green;
      bg = C.bg_red;
      fg0 = C.default;
      bg0 = C.bg_default;
      //-----------------------------------------------------------------------------------------------------------
      get_percentage_bar = function(percentage) {
        /* 🮂🮃🮄🮅🮆 ▁▂▃▄▅▆▇█ ▉▊▋▌▍▎▏🮇🮈🮉🮊🮋 ▐ 🭰 🭱 🭲 🭳 🭴 🭵 🮀 🮁 🭶 🭷 🭸 🭹 🭺 🭻 🭽 🭾 🭼 🭿 */
        var R, percentage_rpr;
        percentage_rpr = (Math.round(percentage)).toString().padStart(3);
        if (percentage === null || percentage <= 0) {
          return `${percentage_rpr} %▕             ▏`;
        }
        if (percentage >= 100) {
          return `${percentage_rpr} %▕█████████████▏`;
        }
        percentage = Math.round(percentage / 100 * 104);
        R = '█'.repeat(Math.floor(percentage / 8));
        switch (modulo(percentage, 8)) {
          case 0:
            R += ' ';
            break;
          case 1:
            R += '▏';
            break;
          case 2:
            R += '▎';
            break;
          case 3:
            R += '▍';
            break;
          case 4:
            R += '▌';
            break;
          case 5:
            R += '▋';
            break;
          case 6:
            R += '▊';
            break;
          case 7:
            R += '▉';
        }
        return `${percentage_rpr} %▕${fg + bg}${R.padEnd(13)}${fg0 + bg0}▏`;
      };
      //-----------------------------------------------------------------------------------------------------------
      hollow_percentage_bar = function(n) {
        var R;
        if (n === null || n <= 0) {
          return '             ';
        }
        // if n >= 100             then return '░░░░░░░░░░░░░'
        if (n >= 100) {
          return '▓▓▓▓▓▓▓▓▓▓▓▓▓';
        }
        n = Math.round(n / 100 * 104);
        // R = '░'.repeat n // 8
        R = '▓'.repeat(Math.floor(n / 8));
        switch (modulo(n, 8)) {
          case 0:
            R += ' ';
            break;
          case 1:
            R += '▏';
            break;
          case 2:
            R += '▎';
            break;
          case 3:
            R += '▍';
            break;
          case 4:
            R += '▌';
            break;
          case 5:
            R += '▋';
            break;
          case 6:
            R += '▊';
            break;
          case 7:
            R += '▉';
        }
        // when 8 then R += '█'
        return R.padEnd(13);
      };
      //.......................................................................................................
      return exports = {get_percentage_bar};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_format_stack: function() {
      var C, Format_stack, exports, internals, stack_line_re, templates, type_of;
      ({
        ansi_colors_and_effects: C
      } = (require('./ansi-brics')).require_ansi_colors_and_effects());
      ({type_of} = (require('./unstable-rpr-type_of-brics')).require_show());
      //=======================================================================================================
      templates = {
        error_formatter: {
          path: function(text) {
            return `${C.green}${text}${C.bg_default}`;
          },
          line_nr: function(text) {
            return `:${C.blue}${text}${C.bg_default}`;
          },
          column_nr: function(text) {
            return `${C.red}:${text}:${C.bg_default}`;
          },
          function: function(text) {
            return ` ${C.gold}${text}${C.bg_default}()`;
          }
        }
      };
      //-------------------------------------------------------------------------------------------------------
      stack_line_re = /^\s*at\s+(?:(?<callee>.*?)\s+\()?(?<path>.+):(?<line_nr>\d+):(?<column_nr>\d+)\)?$/;
      internals = Object.freeze({templates});
      //=======================================================================================================
      Format_stack = class Format_stack {
        //-----------------------------------------------------------------------------------------------------
        constructor(cfg) {
          var me;
          this.cfg = {...templates.error_formatter, ...cfg};
          me = (...P) => {
            return this.format(...P);
          };
          Object.setPrototypeOf(me, this);
          return me;
        }

        //-----------------------------------------------------------------------------------------------------
        format(error_or_stack_trace) {
          /* TAINT use proper validation */
          var stack_trace, type;
          switch (type = type_of(error_or_stack_trace)) {
            case 'error':
              stack_trace = error_or_stack_trace.stack;
              break;
            case 'text':
              stack_trace = error_or_stack_trace;
              break;
            default:
              throw new Error(`Ω___1 expected an error or a text, got a ${type}`);
          }
          return this.format_line;
        }

        //-----------------------------------------------------------------------------------------------------
        parse_line(line) {
          var R, callee, column_nr, line_nr, match, path;
          if ((match = line.match(stack_line_re)) == null) {
            return null;
          }
          [, callee, path, line_nr, column_nr] = match;
          R = {...match.groups};
          if (R.callee == null) {
            R.callee = null;
          }
          R.line_nr = parseInt(R.line_nr, 10);
          R.column_nr = parseInt(R.column_nr, 10);
          return R;
        }

      };
      
    function parseStackLine(line) {
      // Matches:
      // "    at functionName (/path/file.js:10:15)"
      // "    at /path/file.js:42:1"
    }

    function parseStackTrace(stack) {
      return stack
        .split("\n")
        .map(parseStackLine)
        .filter(Boolean);
    }

    ;
      //.......................................................................................................
      return exports = (() => {
        var format_stack;
        format_stack = new Format_stack();
        return {format_stack, internals, parseStackLine, parseStackTrace};
      })();
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxLQUFBO0lBQUEsMkRBQUE7Ozs7O0VBS0EsS0FBQSxHQUtFLENBQUE7Ozs7SUFBQSwwQkFBQSxFQUE0QixRQUFBLENBQUEsQ0FBQTtBQUM5QixVQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsb0JBQUEsRUFBQSxvQkFBQSxFQUFBLGlCQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLGlCQUFBLEVBQUEsc0JBQUEsRUFBQTtNQUFJLEdBQUEsR0FDRTtRQUFBLFdBQUEsRUFBZ0IsSUFBaEI7UUFDQSxNQUFBLEVBQWdCLElBRGhCO1FBRUEsTUFBQSxFQUFnQjtNQUZoQjtNQUdGLGlCQUFBLEdBQW9CLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUVaLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBRlksQ0FBQSxrQ0FBQSxDQUFBLENBTVosTUFBTSxDQUFDLE1BQVAsQ0FBYyxHQUFHLENBQUMsTUFBbEIsQ0FOWSxDQUFBLEVBQUEsQ0FBQSxFQVFmLEdBUmUsRUFKeEI7Ozs7O01BaUJJLEdBQUEsR0FBb0IsUUFBQSxDQUFFLENBQUYsQ0FBQTtBQUNsQixlQUFPLENBQUEsQ0FBQSxDQUFBLENBQTZCLENBQUUsT0FBTyxDQUFULENBQUEsS0FBZ0IsUUFBekMsR0FBQSxDQUFDLENBQUMsT0FBRixDQUFVLElBQVYsRUFBZ0IsS0FBaEIsQ0FBQSxHQUFBLE1BQUosQ0FBQSxDQUFBO0FBQ1AsZUFBTyxDQUFBLENBQUEsQ0FBRyxDQUFILENBQUE7TUFGVztNQUdwQixNQUFBLEdBQ0U7UUFBQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFBLHFCQUFBLFFBQW1DLE1BQW5DLENBQUEsQ0FBdEI7UUFDQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFB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QUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixLQUE5QjtBQTdOQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9uZXh0X2ZyZWVfZmlsZW5hbWU6IC0+XG4gICAgY2ZnID1cbiAgICAgIG1heF9yZXRyaWVzOiAgICA5OTk5XG4gICAgICBwcmVmaXg6ICAgICAgICAgJ34uJ1xuICAgICAgc3VmZml4OiAgICAgICAgICcuYnJpY2FicmFjLWNhY2hlJ1xuICAgIGNhY2hlX2ZpbGVuYW1lX3JlID0gLy8vXG4gICAgICBeXG4gICAgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5wcmVmaXh9IClcbiAgICAgICg/PGZpcnN0Pi4qKVxuICAgICAgXFwuXG4gICAgICAoPzxucj5bMC05XXs0fSlcbiAgICAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnN1ZmZpeH0gKVxuICAgICAgJFxuICAgICAgLy8vdlxuICAgICMgY2FjaGVfc3VmZml4X3JlID0gLy8vXG4gICAgIyAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnN1ZmZpeH0gKVxuICAgICMgICAkXG4gICAgIyAgIC8vL3ZcbiAgICBycHIgICAgICAgICAgICAgICA9ICggeCApIC0+XG4gICAgICByZXR1cm4gXCInI3t4LnJlcGxhY2UgLycvZywgXCJcXFxcJ1wiIGlmICggdHlwZW9mIHggKSBpcyAnc3RyaW5nJ30nXCJcbiAgICAgIHJldHVybiBcIiN7eH1cIlxuICAgIGVycm9ycyA9XG4gICAgICBUTVBfZXhoYXVzdGlvbl9lcnJvcjogY2xhc3MgVE1QX2V4aGF1c3Rpb25fZXJyb3IgZXh0ZW5kcyBFcnJvclxuICAgICAgVE1QX3ZhbGlkYXRpb25fZXJyb3I6IGNsYXNzIFRNUF92YWxpZGF0aW9uX2Vycm9yIGV4dGVuZHMgRXJyb3JcbiAgICBGUyAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpmcydcbiAgICBQQVRIICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpwYXRoJ1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZXhpc3RzID0gKCBwYXRoICkgLT5cbiAgICAgIHRyeSBGUy5zdGF0U3luYyBwYXRoIGNhdGNoIGVycm9yIHRoZW4gcmV0dXJuIGZhbHNlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZ2V0X25leHRfZmlsZW5hbWUgPSAoIHBhdGggKSAtPlxuICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdHlwZSBjaGVja2luZyAjIyNcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX3ZhbGlkYXRpb25fZXJyb3IgXCLOqV9fXzEgZXhwZWN0ZWQgYSB0ZXh0LCBnb3QgI3tycHIgcGF0aH1cIiB1bmxlc3MgKCB0eXBlb2YgcGF0aCApIGlzICdzdHJpbmcnXG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF92YWxpZGF0aW9uX2Vycm9yIFwizqlfX18yIGV4cGVjdGVkIGEgbm9uZW1wdHkgdGV4dCwgZ290ICN7cnByIHBhdGh9XCIgdW5sZXNzIHBhdGgubGVuZ3RoID4gMFxuICAgICAgZGlybmFtZSAgPSBQQVRILmRpcm5hbWUgcGF0aFxuICAgICAgYmFzZW5hbWUgPSBQQVRILmJhc2VuYW1lIHBhdGhcbiAgICAgIHVubGVzcyAoIG1hdGNoID0gYmFzZW5hbWUubWF0Y2ggY2FjaGVfZmlsZW5hbWVfcmUgKT9cbiAgICAgICAgcmV0dXJuIFBBVEguam9pbiBkaXJuYW1lLCBcIiN7Y2ZnLnByZWZpeH0je2Jhc2VuYW1lfS4wMDAxI3tjZmcuc3VmZml4fVwiXG4gICAgICB7IGZpcnN0LCBuciwgIH0gPSBtYXRjaC5ncm91cHNcbiAgICAgIG5yICAgICAgICAgICAgICA9IFwiI3soIHBhcnNlSW50IG5yLCAxMCApICsgMX1cIi5wYWRTdGFydCA0LCAnMCdcbiAgICAgIHBhdGggICAgICAgICAgICA9IGZpcnN0XG4gICAgICByZXR1cm4gUEFUSC5qb2luIGRpcm5hbWUsIFwiI3tjZmcucHJlZml4fSN7Zmlyc3R9LiN7bnJ9I3tjZmcuc3VmZml4fVwiXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBnZXRfbmV4dF9mcmVlX2ZpbGVuYW1lID0gKCBwYXRoICkgLT5cbiAgICAgIFIgICAgICAgICAgICAgPSBwYXRoXG4gICAgICBmYWlsdXJlX2NvdW50ID0gLTFcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgbG9vcFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZhaWx1cmVfY291bnQrK1xuICAgICAgICBpZiBmYWlsdXJlX2NvdW50ID4gY2ZnLm1heF9yZXRyaWVzXG4gICAgICAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX2V4aGF1c3Rpb25fZXJyb3IgXCLOqV9fXzMgdG9vIG1hbnkgKCN7ZmFpbHVyZV9jb3VudH0pIHJldHJpZXM7ICBwYXRoICN7cnByIFJ9IGV4aXN0c1wiXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgUiA9IGdldF9uZXh0X2ZpbGVuYW1lIFJcbiAgICAgICAgYnJlYWsgdW5sZXNzIGV4aXN0cyBSXG4gICAgICByZXR1cm4gUlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgIyBzd2FwX3N1ZmZpeCA9ICggcGF0aCwgc3VmZml4ICkgLT4gcGF0aC5yZXBsYWNlIGNhY2hlX3N1ZmZpeF9yZSwgc3VmZml4XG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgZ2V0X25leHRfZnJlZV9maWxlbmFtZSwgZ2V0X25leHRfZmlsZW5hbWUsIGV4aXN0cywgY2FjaGVfZmlsZW5hbWVfcmUsIGVycm9ycywgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2NvbW1hbmRfbGluZV90b29sczogLT5cbiAgICBDUCA9IHJlcXVpcmUgJ25vZGU6Y2hpbGRfcHJvY2VzcydcbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCA9ICggY29tbWFuZCwgaW5wdXQgKSAtPlxuICAgICAgcmV0dXJuICggQ1AuZXhlY1N5bmMgY29tbWFuZCwgeyBlbmNvZGluZzogJ3V0Zi04JywgaW5wdXQsIH0gKS5yZXBsYWNlIC9cXG4kL3MsICcnXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfd2NfbWF4X2xpbmVfbGVuZ3RoID0gKCB0ZXh0ICkgLT5cbiAgICAgICMjIyB0aHggdG8gaHR0cHM6Ly91bml4LnN0YWNrZXhjaGFuZ2UuY29tL2EvMjU4NTUxLzI4MDIwNCAjIyNcbiAgICAgIHJldHVybiBwYXJzZUludCAoIGdldF9jb21tYW5kX2xpbmVfcmVzdWx0ICd3YyAtLW1heC1saW5lLWxlbmd0aCcsIHRleHQgKSwgMTBcblxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9jb21tYW5kX2xpbmVfcmVzdWx0LCBnZXRfd2NfbWF4X2xpbmVfbGVuZ3RoLCB9XG5cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9wcm9ncmVzc19pbmRpY2F0b3JzOiAtPlxuICAgIHsgYW5zaV9jb2xvcnNfYW5kX2VmZmVjdHM6IEMsIH0gPSAoIHJlcXVpcmUgJy4vYW5zaS1icmljcycgKS5yZXF1aXJlX2Fuc2lfY29sb3JzX2FuZF9lZmZlY3RzKClcbiAgICBmZyAgPSBDLmdyZWVuXG4gICAgYmcgID0gQy5iZ19yZWRcbiAgICBmZzAgPSBDLmRlZmF1bHRcbiAgICBiZzAgPSBDLmJnX2RlZmF1bHRcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9wZXJjZW50YWdlX2JhciA9ICggcGVyY2VudGFnZSApIC0+XG4gICAgICAjIyMg8J+ugvCfroPwn66E8J+uhfCfroYg4paB4paC4paD4paE4paF4paG4paH4paIIOKWieKWiuKWi+KWjOKWjeKWjuKWj/Cfrofwn66I8J+uifCfrorwn66LIOKWkCDwn62wIPCfrbEg8J+tsiDwn62zIPCfrbQg8J+ttSDwn66AIPCfroEg8J+ttiDwn623IPCfrbgg8J+tuSDwn626IPCfrbsg8J+tvSDwn62+IPCfrbwg8J+tvyAjIyNcbiAgICAgIHBlcmNlbnRhZ2VfcnByICA9ICggTWF0aC5yb3VuZCBwZXJjZW50YWdlICkudG9TdHJpbmcoKS5wYWRTdGFydCAzXG4gICAgICBpZiBwZXJjZW50YWdlIGlzIG51bGwgb3IgcGVyY2VudGFnZSA8PSAwICB0aGVuIHJldHVybiBcIiN7cGVyY2VudGFnZV9ycHJ9ICXilpUgICAgICAgICAgICAg4paPXCJcbiAgICAgIGlmIHBlcmNlbnRhZ2UgPj0gMTAwICAgICAgICAgICAgICAgICAgICAgIHRoZW4gcmV0dXJuIFwiI3twZXJjZW50YWdlX3Jwcn0gJeKWleKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWj1wiXG4gICAgICBwZXJjZW50YWdlICAgICAgPSAoIE1hdGgucm91bmQgcGVyY2VudGFnZSAvIDEwMCAqIDEwNCApXG4gICAgICBSICAgICAgICAgICAgICAgPSAn4paIJy5yZXBlYXQgcGVyY2VudGFnZSAvLyA4XG4gICAgICBzd2l0Y2ggcGVyY2VudGFnZSAlJSA4XG4gICAgICAgIHdoZW4gMCB0aGVuIFIgKz0gJyAnXG4gICAgICAgIHdoZW4gMSB0aGVuIFIgKz0gJ+KWjydcbiAgICAgICAgd2hlbiAyIHRoZW4gUiArPSAn4paOJ1xuICAgICAgICB3aGVuIDMgdGhlbiBSICs9ICfilo0nXG4gICAgICAgIHdoZW4gNCB0aGVuIFIgKz0gJ+KWjCdcbiAgICAgICAgd2hlbiA1IHRoZW4gUiArPSAn4paLJ1xuICAgICAgICB3aGVuIDYgdGhlbiBSICs9ICfiloonXG4gICAgICAgIHdoZW4gNyB0aGVuIFIgKz0gJ+KWiSdcbiAgICAgIHJldHVybiBcIiN7cGVyY2VudGFnZV9ycHJ9ICXilpUje2ZnK2JnfSN7Ui5wYWRFbmQgMTN9I3tmZzArYmcwfeKWj1wiXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBob2xsb3dfcGVyY2VudGFnZV9iYXIgPSAoIG4gKSAtPlxuICAgICAgaWYgbiBpcyBudWxsIG9yIG4gPD0gMCAgdGhlbiByZXR1cm4gJyAgICAgICAgICAgICAnXG4gICAgICAjIGlmIG4gPj0gMTAwICAgICAgICAgICAgIHRoZW4gcmV0dXJuICfilpHilpHilpHilpHilpHilpHilpHilpHilpHilpHilpHilpHilpEnXG4gICAgICBpZiBuID49IDEwMCAgICAgICAgICAgICB0aGVuIHJldHVybiAn4paT4paT4paT4paT4paT4paT4paT4paT4paT4paT4paT4paT4paTJ1xuICAgICAgbiA9ICggTWF0aC5yb3VuZCBuIC8gMTAwICogMTA0IClcbiAgICAgICMgUiA9ICfilpEnLnJlcGVhdCBuIC8vIDhcbiAgICAgIFIgPSAn4paTJy5yZXBlYXQgbiAvLyA4XG4gICAgICBzd2l0Y2ggbiAlJSA4XG4gICAgICAgIHdoZW4gMCB0aGVuIFIgKz0gJyAnXG4gICAgICAgIHdoZW4gMSB0aGVuIFIgKz0gJ+KWjydcbiAgICAgICAgd2hlbiAyIHRoZW4gUiArPSAn4paOJ1xuICAgICAgICB3aGVuIDMgdGhlbiBSICs9ICfilo0nXG4gICAgICAgIHdoZW4gNCB0aGVuIFIgKz0gJ+KWjCdcbiAgICAgICAgd2hlbiA1IHRoZW4gUiArPSAn4paLJ1xuICAgICAgICB3aGVuIDYgdGhlbiBSICs9ICfiloonXG4gICAgICAgIHdoZW4gNyB0aGVuIFIgKz0gJ+KWiSdcbiAgICAgICAgIyB3aGVuIDggdGhlbiBSICs9ICfilognXG4gICAgICByZXR1cm4gUi5wYWRFbmQgMTNcblxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9wZXJjZW50YWdlX2JhciwgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Zvcm1hdF9zdGFjazogLT5cbiAgICB7IGFuc2lfY29sb3JzX2FuZF9lZmZlY3RzOiBDLCB9ID0gKCByZXF1aXJlICcuL2Fuc2ktYnJpY3MnICkucmVxdWlyZV9hbnNpX2NvbG9yc19hbmRfZWZmZWN0cygpXG4gICAgeyB0eXBlX29mLCAgICAgICAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi91bnN0YWJsZS1ycHItdHlwZV9vZi1icmljcycgKS5yZXF1aXJlX3Nob3coKVxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICB0ZW1wbGF0ZXMgPVxuICAgICAgZXJyb3JfZm9ybWF0dGVyOlxuICAgICAgICBwYXRoOiAgICAgICAoIHRleHQgKSAtPiBcIiN7Qy5ncmVlbn0je3RleHR9I3tDLmJnX2RlZmF1bHR9XCJcbiAgICAgICAgbGluZV9ucjogICAgKCB0ZXh0ICkgLT4gXCI6I3tDLmJsdWV9I3t0ZXh0fSN7Qy5iZ19kZWZhdWx0fVwiXG4gICAgICAgIGNvbHVtbl9ucjogICggdGV4dCApIC0+IFwiI3tDLnJlZH06I3t0ZXh0fToje0MuYmdfZGVmYXVsdH1cIlxuICAgICAgICBmdW5jdGlvbjogICAoIHRleHQgKSAtPiBcIiAje0MuZ29sZH0je3RleHR9I3tDLmJnX2RlZmF1bHR9KClcIlxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzdGFja19saW5lX3JlID0gLy8vIF5cbiAgICAgIFxccyogYXQgXFxzK1xuICAgICAgKD86XG4gICAgICAgICg/PGNhbGxlZT4gLio/ICAgIClcbiAgICAgICAgXFxzKyBcXChcbiAgICAgICAgKT9cbiAgICAgICg/PHBhdGg+IC4rICAgICAgICkgOlxuICAgICAgKD88bGluZV9ucj4gICBcXGQrICkgOlxuICAgICAgKD88Y29sdW1uX25yPiBcXGQrIClcbiAgICAgIFxcKT9cbiAgICAgICQgLy8vO1xuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIHsgdGVtcGxhdGVzLCB9XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIEZvcm1hdF9zdGFja1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGNmZyApIC0+XG4gICAgICAgIEBjZmcgPSB7IHRlbXBsYXRlcy5lcnJvcl9mb3JtYXR0ZXIuLi4sIGNmZy4uLiwgfVxuICAgICAgICBtZSA9ICggUC4uLiApID0+IEBmb3JtYXQgUC4uLlxuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YgbWUsIEBcbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZm9ybWF0OiAoIGVycm9yX29yX3N0YWNrX3RyYWNlICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdmFsaWRhdGlvbiAjIyNcbiAgICAgICAgc3dpdGNoIHR5cGUgPSB0eXBlX29mIGVycm9yX29yX3N0YWNrX3RyYWNlXG4gICAgICAgICAgd2hlbiAnZXJyb3InICB0aGVuIHN0YWNrX3RyYWNlID0gZXJyb3Jfb3Jfc3RhY2tfdHJhY2Uuc3RhY2tcbiAgICAgICAgICB3aGVuICd0ZXh0JyAgIHRoZW4gc3RhY2tfdHJhY2UgPSBlcnJvcl9vcl9zdGFja190cmFjZVxuICAgICAgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yIFwizqlfX18xIGV4cGVjdGVkIGFuIGVycm9yIG9yIGEgdGV4dCwgZ290IGEgI3t0eXBlfVwiXG4gICAgICAgIHJldHVybiAoICggIEBmb3JtYXRfbGluZSkgKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHBhcnNlX2xpbmU6ICggbGluZSApIC0+XG4gICAgICAgIHJldHVybiBudWxsIHVubGVzcyAoIG1hdGNoID0gbGluZS5tYXRjaCBzdGFja19saW5lX3JlICk/XG4gICAgICAgIFssIGNhbGxlZSwgcGF0aCwgbGluZV9uciwgY29sdW1uX25yXSA9IG1hdGNoXG4gICAgICAgIFIgICAgICAgICAgID0geyBtYXRjaC5ncm91cHMuLi4sIH1cbiAgICAgICAgUi5jYWxsZWUgICA/PSBudWxsXG4gICAgICAgIFIubGluZV9uciAgID0gcGFyc2VJbnQgUi5saW5lX25yLCAgIDEwXG4gICAgICAgIFIuY29sdW1uX25yID0gcGFyc2VJbnQgUi5jb2x1bW5fbnIsIDEwXG4gICAgICAgIHJldHVybiBSXG5cbiAgICBgYGBcbiAgICBmdW5jdGlvbiBwYXJzZVN0YWNrTGluZShsaW5lKSB7XG4gICAgICAvLyBNYXRjaGVzOlxuICAgICAgLy8gXCIgICAgYXQgZnVuY3Rpb25OYW1lICgvcGF0aC9maWxlLmpzOjEwOjE1KVwiXG4gICAgICAvLyBcIiAgICBhdCAvcGF0aC9maWxlLmpzOjQyOjFcIlxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlU3RhY2tUcmFjZShzdGFjaykge1xuICAgICAgcmV0dXJuIHN0YWNrXG4gICAgICAgIC5zcGxpdChcIlxcblwiKVxuICAgICAgICAubWFwKHBhcnNlU3RhY2tMaW5lKVxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuICAgIH1cblxuICAgIGBgYFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSBkbyA9PlxuICAgICAgZm9ybWF0X3N0YWNrID0gbmV3IEZvcm1hdF9zdGFjaygpXG4gICAgICByZXR1cm4geyBmb3JtYXRfc3RhY2ssIGludGVybmFscywgcGFyc2VTdGFja0xpbmUsIHBhcnNlU3RhY2tUcmFjZSwgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgQlJJQ1NcblxuIl19
//# sourceURL=../src/unstable-brics.coffee