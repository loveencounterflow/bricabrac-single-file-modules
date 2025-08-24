(function() {
  'use strict';
  var BRICS,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; },
    indexOf = [].indexOf;

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
      var C, Format_stack, dependency_c, exports, external_c, internal_c, internals, main_c, stack_line_re, strip_ansi, templates, type_of;
      ({
        ansi_colors_and_effects: C
      } = (require('./ansi-brics')).require_ansi_colors_and_effects());
      ({strip_ansi} = (require('./ansi-brics')).require_strip_ansi());
      ({type_of} = (require('./unstable-rpr-type_of-brics')).require_type_of());
      //=======================================================================================================
      main_c = {};
      main_c.reset = C.default + C.bg_default + C.bold0;
      main_c.folder_path = C.black + C.bg_silver + C.bold;
      main_c.file_name = C.wine + C.bg_silver + C.bold;
      main_c.line_nr = C.black + C.bg_blue + C.bold;
      main_c.column_nr = C.black + C.bg_blue + C.bold;
      main_c.callee = C.black + C.bg_yellow + C.bold;
      //.......................................................................................................
      internal_c = Object.create(main_c);
      external_c = Object.create(main_c);
      dependency_c = Object.create(main_c);
      //.......................................................................................................
      templates = {
        format_stack: {
          relative: true, // boolean to use CWD, or specify reference path
          padding: {
            path: 80,
            callee: 50
          },
          color: {
            main: main_c,
            internal: internal_c,
            external: external_c,
            dependency: dependency_c
          }
        }
      };
      //-------------------------------------------------------------------------------------------------------
      stack_line_re = /^\s*at\s+(?:(?<callee>.*?)\s+\()?(?<path>(?<folder_path>.*?)(?<file_name>[^\/]+)):(?<line_nr>\d+):(?<column_nr>\d+)\)?$/;
      internals = Object.freeze({templates});
      //=======================================================================================================
      Format_stack = class Format_stack {
        //-----------------------------------------------------------------------------------------------------
        constructor(cfg) {
          var me;
          this.cfg = {...templates.format_stack, ...cfg};
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
              throw new Error(`Ω___4 expected an error or a text, got a ${type}`);
          }
          return this.format_line;
        }

        //-----------------------------------------------------------------------------------------------------
        rewrite_paths(line) {}

        //-----------------------------------------------------------------------------------------------------
        parse_line(line) {
          /* TAINT use proper validation */
          var R, match, type;
          if ((type = type_of(line)) !== 'text') {
            throw new Error(`Ω___5 expected a text, got a ${type}`);
          }
          if ((indexOf.call(line, '\n') >= 0)) {
            throw new Error("Ω___6 expected a single line, got a text with line breaks");
          }
          if ((match = line.match(stack_line_re)) == null) {
            return null;
          }
          R = {...match.groups};
          if (R.callee == null) {
            R.callee = '[anonymous]';
          }
          R.line_nr = parseInt(R.line_nr, 10);
          R.column_nr = parseInt(R.column_nr, 10);
          switch (true) {
            case R.path.startsWith('node:'):
              R.type = 'internal';
              break;
            case R.path.startsWith('../'):
              R.type = 'external';
              break;
            case (R.path.indexOf('/node_modules/')) > -1:
              R.type = 'dependency';
              break;
            default:
              R.type = 'main';
          }
          return R;
        }

        //-----------------------------------------------------------------------------------------------------
        format_line(line) {
          var callee, callee_length, column_nr, file_name, folder_path, line_nr, padding_callee, padding_path, path_length, stack_info, theme;
          stack_info = this.parse_line(line);
          theme = this.cfg.color[stack_info.type];
          //...................................................................................................
          folder_path = theme.folder_path + ' ' + stack_info.folder_path + '' + theme.reset;
          file_name = theme.file_name + '' + stack_info.file_name + ' ' + theme.reset;
          line_nr = theme.line_nr + ' (' + stack_info.line_nr + '' + theme.reset;
          column_nr = theme.column_nr + ':' + stack_info.column_nr + ') ' + theme.reset;
          callee = theme.callee + ' # ' + stack_info.callee + '() ' + theme.reset;
          //...................................................................................................
          path_length = (strip_ansi(folder_path + file_name + line_nr + column_nr)).length;
          callee_length = (strip_ansi(callee)).length;
          //...................................................................................................
          path_length = Math.max(0, this.cfg.padding.path - path_length);
          callee_length = Math.max(0, this.cfg.padding.callee - callee_length);
          //...................................................................................................
          padding_path = theme.folder_path + (' '.repeat(path_length)) + theme.reset;
          padding_callee = theme.callee + (' '.repeat(callee_length)) + theme.reset;
          //...................................................................................................
          return folder_path + file_name + line_nr + column_nr + padding_path + callee + padding_callee;
        }

      };
      //.......................................................................................................
      return exports = (() => {
        var format_stack;
        format_stack = new Format_stack();
        return {format_stack, Format_stack, internals};
      })();
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxLQUFBO0lBQUE7d0JBQUE7Ozs7O0VBS0EsS0FBQSxHQUtFLENBQUE7Ozs7SUFBQSwwQkFBQSxFQUE0QixRQUFBLENBQUEsQ0FBQTtBQUM5QixVQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsb0JBQUEsRUFBQSxvQkFBQSxFQUFBLGlCQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLGlCQUFBLEVBQUEsc0JBQUEsRUFBQTtNQUFJLEdBQUEsR0FDRTtRQUFBLFdBQUEsRUFBZ0IsSUFBaEI7UUFDQSxNQUFBLEVBQWdCLElBRGhCO1FBRUEsTUFBQSxFQUFnQjtNQUZoQjtNQUdGLGlCQUFBLEdBQW9CLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUVaLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBRlksQ0FBQSxrQ0FBQSxDQUFBLENBTVosTUFBTSxDQUFDLE1BQVAsQ0FBYyxHQUFHLENBQUMsTUFBbEIsQ0FOWSxDQUFBLEVBQUEsQ0FBQSxFQVFmLEdBUmUsRUFKeEI7Ozs7O01BaUJJLEdBQUEsR0FBb0IsUUFBQSxDQUFFLENBQUYsQ0FBQTtBQUNsQixlQUFPLENBQUEsQ0FBQSxDQUFBLENBQTZCLENBQUUsT0FBTyxDQUFULENBQUEsS0FBZ0IsUUFBekMsR0FBQSxDQUFDLENBQUMsT0FBRixDQUFVLElBQVYsRUFBZ0IsS0FBaEIsQ0FBQSxHQUFBLE1BQUosQ0FBQSxDQUFBO0FBQ1AsZUFBTyxDQUFBLENBQUEsQ0FBRyxDQUFILENBQUE7TUFGVztNQUdwQixNQUFBLEdBQ0U7UUFBQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFBLHFCQUFBLFFBQW1DLE1BQW5DLENBQUEsQ0FBdEI7UUFDQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFB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LENBQXBCLEdBQW9ELEtBQUssQ0FBQztVQUM1RSxjQUFBLEdBQWtCLEtBQUssQ0FBQyxNQUFOLEdBQW9CLENBQUUsR0FBRyxDQUFDLE1BQUosQ0FBWSxhQUFaLENBQUYsQ0FBcEIsR0FBb0QsS0FBSyxDQUFDLE1BaEJwRjs7QUFrQlEsaUJBQU8sV0FBQSxHQUFjLFNBQWQsR0FBMEIsT0FBMUIsR0FBb0MsU0FBcEMsR0FBZ0QsWUFBaEQsR0FBK0QsTUFBL0QsR0FBd0U7UUFuQnBFOztNQXpDZixFQTlDSjs7QUE2R0ksYUFBTyxPQUFBLEdBQWEsQ0FBQSxDQUFBLENBQUEsR0FBQTtBQUN4QixZQUFBO1FBQU0sWUFBQSxHQUFlLElBQUksWUFBSixDQUFBO0FBQ2YsZUFBTyxDQUFFLFlBQUYsRUFBZ0IsWUFBaEIsRUFBOEIsU0FBOUI7TUFGVyxDQUFBO0lBOUdBO0VBcEl0QixFQVZGOzs7RUFrUUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsS0FBOUI7QUFsUUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkJSSUNTID1cbiAgXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfbmV4dF9mcmVlX2ZpbGVuYW1lOiAtPlxuICAgIGNmZyA9XG4gICAgICBtYXhfcmV0cmllczogICAgOTk5OVxuICAgICAgcHJlZml4OiAgICAgICAgICd+LidcbiAgICAgIHN1ZmZpeDogICAgICAgICAnLmJyaWNhYnJhYy1jYWNoZSdcbiAgICBjYWNoZV9maWxlbmFtZV9yZSA9IC8vL1xuICAgICAgXlxuICAgICAgKD86ICN7UmVnRXhwLmVzY2FwZSBjZmcucHJlZml4fSApXG4gICAgICAoPzxmaXJzdD4uKilcbiAgICAgIFxcLlxuICAgICAgKD88bnI+WzAtOV17NH0pXG4gICAgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5zdWZmaXh9IClcbiAgICAgICRcbiAgICAgIC8vL3ZcbiAgICAjIGNhY2hlX3N1ZmZpeF9yZSA9IC8vL1xuICAgICMgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5zdWZmaXh9IClcbiAgICAjICAgJFxuICAgICMgICAvLy92XG4gICAgcnByICAgICAgICAgICAgICAgPSAoIHggKSAtPlxuICAgICAgcmV0dXJuIFwiJyN7eC5yZXBsYWNlIC8nL2csIFwiXFxcXCdcIiBpZiAoIHR5cGVvZiB4ICkgaXMgJ3N0cmluZyd9J1wiXG4gICAgICByZXR1cm4gXCIje3h9XCJcbiAgICBlcnJvcnMgPVxuICAgICAgVE1QX2V4aGF1c3Rpb25fZXJyb3I6IGNsYXNzIFRNUF9leGhhdXN0aW9uX2Vycm9yIGV4dGVuZHMgRXJyb3JcbiAgICAgIFRNUF92YWxpZGF0aW9uX2Vycm9yOiBjbGFzcyBUTVBfdmFsaWRhdGlvbl9lcnJvciBleHRlbmRzIEVycm9yXG4gICAgRlMgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6ZnMnXG4gICAgUEFUSCAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6cGF0aCdcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGV4aXN0cyA9ICggcGF0aCApIC0+XG4gICAgICB0cnkgRlMuc3RhdFN5bmMgcGF0aCBjYXRjaCBlcnJvciB0aGVuIHJldHVybiBmYWxzZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGdldF9uZXh0X2ZpbGVuYW1lID0gKCBwYXRoICkgLT5cbiAgICAgICMjIyBUQUlOVCB1c2UgcHJvcGVyIHR5cGUgY2hlY2tpbmcgIyMjXG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF92YWxpZGF0aW9uX2Vycm9yIFwizqlfX18xIGV4cGVjdGVkIGEgdGV4dCwgZ290ICN7cnByIHBhdGh9XCIgdW5sZXNzICggdHlwZW9mIHBhdGggKSBpcyAnc3RyaW5nJ1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5UTVBfdmFsaWRhdGlvbl9lcnJvciBcIs6pX19fMiBleHBlY3RlZCBhIG5vbmVtcHR5IHRleHQsIGdvdCAje3JwciBwYXRofVwiIHVubGVzcyBwYXRoLmxlbmd0aCA+IDBcbiAgICAgIGRpcm5hbWUgID0gUEFUSC5kaXJuYW1lIHBhdGhcbiAgICAgIGJhc2VuYW1lID0gUEFUSC5iYXNlbmFtZSBwYXRoXG4gICAgICB1bmxlc3MgKCBtYXRjaCA9IGJhc2VuYW1lLm1hdGNoIGNhY2hlX2ZpbGVuYW1lX3JlICk/XG4gICAgICAgIHJldHVybiBQQVRILmpvaW4gZGlybmFtZSwgXCIje2NmZy5wcmVmaXh9I3tiYXNlbmFtZX0uMDAwMSN7Y2ZnLnN1ZmZpeH1cIlxuICAgICAgeyBmaXJzdCwgbnIsICB9ID0gbWF0Y2guZ3JvdXBzXG4gICAgICBuciAgICAgICAgICAgICAgPSBcIiN7KCBwYXJzZUludCBuciwgMTAgKSArIDF9XCIucGFkU3RhcnQgNCwgJzAnXG4gICAgICBwYXRoICAgICAgICAgICAgPSBmaXJzdFxuICAgICAgcmV0dXJuIFBBVEguam9pbiBkaXJuYW1lLCBcIiN7Y2ZnLnByZWZpeH0je2ZpcnN0fS4je25yfSN7Y2ZnLnN1ZmZpeH1cIlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZ2V0X25leHRfZnJlZV9maWxlbmFtZSA9ICggcGF0aCApIC0+XG4gICAgICBSICAgICAgICAgICAgID0gcGF0aFxuICAgICAgZmFpbHVyZV9jb3VudCA9IC0xXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGxvb3BcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmYWlsdXJlX2NvdW50KytcbiAgICAgICAgaWYgZmFpbHVyZV9jb3VudCA+IGNmZy5tYXhfcmV0cmllc1xuICAgICAgICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF9leGhhdXN0aW9uX2Vycm9yIFwizqlfX18zIHRvbyBtYW55ICgje2ZhaWx1cmVfY291bnR9KSByZXRyaWVzOyAgcGF0aCAje3JwciBSfSBleGlzdHNcIlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIFIgPSBnZXRfbmV4dF9maWxlbmFtZSBSXG4gICAgICAgIGJyZWFrIHVubGVzcyBleGlzdHMgUlxuICAgICAgcmV0dXJuIFJcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICMgc3dhcF9zdWZmaXggPSAoIHBhdGgsIHN1ZmZpeCApIC0+IHBhdGgucmVwbGFjZSBjYWNoZV9zdWZmaXhfcmUsIHN1ZmZpeFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9uZXh0X2ZyZWVfZmlsZW5hbWUsIGdldF9uZXh0X2ZpbGVuYW1lLCBleGlzdHMsIGNhY2hlX2ZpbGVuYW1lX3JlLCBlcnJvcnMsIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9jb21tYW5kX2xpbmVfdG9vbHM6IC0+XG4gICAgQ1AgPSByZXF1aXJlICdub2RlOmNoaWxkX3Byb2Nlc3MnXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X2NvbW1hbmRfbGluZV9yZXN1bHQgPSAoIGNvbW1hbmQsIGlucHV0ICkgLT5cbiAgICAgIHJldHVybiAoIENQLmV4ZWNTeW5jIGNvbW1hbmQsIHsgZW5jb2Rpbmc6ICd1dGYtOCcsIGlucHV0LCB9ICkucmVwbGFjZSAvXFxuJC9zLCAnJ1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X3djX21heF9saW5lX2xlbmd0aCA9ICggdGV4dCApIC0+XG4gICAgICAjIyMgdGh4IHRvIGh0dHBzOi8vdW5peC5zdGFja2V4Y2hhbmdlLmNvbS9hLzI1ODU1MS8yODAyMDQgIyMjXG4gICAgICByZXR1cm4gcGFyc2VJbnQgKCBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCAnd2MgLS1tYXgtbGluZS1sZW5ndGgnLCB0ZXh0ICksIDEwXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCwgZ2V0X3djX21heF9saW5lX2xlbmd0aCwgfVxuXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfcHJvZ3Jlc3NfaW5kaWNhdG9yczogLT5cbiAgICB7IGFuc2lfY29sb3JzX2FuZF9lZmZlY3RzOiBDLCB9ID0gKCByZXF1aXJlICcuL2Fuc2ktYnJpY3MnICkucmVxdWlyZV9hbnNpX2NvbG9yc19hbmRfZWZmZWN0cygpXG4gICAgZmcgID0gQy5ncmVlblxuICAgIGJnICA9IEMuYmdfcmVkXG4gICAgZmcwID0gQy5kZWZhdWx0XG4gICAgYmcwID0gQy5iZ19kZWZhdWx0XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfcGVyY2VudGFnZV9iYXIgPSAoIHBlcmNlbnRhZ2UgKSAtPlxuICAgICAgIyMjIPCfroLwn66D8J+uhPCfroXwn66GIOKWgeKWguKWg+KWhOKWheKWhuKWh+KWiCDilonilorilovilozilo3ilo7ilo/wn66H8J+uiPCfronwn66K8J+uiyDilpAg8J+tsCDwn62xIPCfrbIg8J+tsyDwn620IPCfrbUg8J+ugCDwn66BIPCfrbYg8J+ttyDwn624IPCfrbkg8J+tuiDwn627IPCfrb0g8J+tviDwn628IPCfrb8gIyMjXG4gICAgICBwZXJjZW50YWdlX3JwciAgPSAoIE1hdGgucm91bmQgcGVyY2VudGFnZSApLnRvU3RyaW5nKCkucGFkU3RhcnQgM1xuICAgICAgaWYgcGVyY2VudGFnZSBpcyBudWxsIG9yIHBlcmNlbnRhZ2UgPD0gMCAgdGhlbiByZXR1cm4gXCIje3BlcmNlbnRhZ2VfcnByfSAl4paVICAgICAgICAgICAgIOKWj1wiXG4gICAgICBpZiBwZXJjZW50YWdlID49IDEwMCAgICAgICAgICAgICAgICAgICAgICB0aGVuIHJldHVybiBcIiN7cGVyY2VudGFnZV9ycHJ9ICXilpXilojilojilojilojilojilojilojilojilojilojilojilojilojilo9cIlxuICAgICAgcGVyY2VudGFnZSAgICAgID0gKCBNYXRoLnJvdW5kIHBlcmNlbnRhZ2UgLyAxMDAgKiAxMDQgKVxuICAgICAgUiAgICAgICAgICAgICAgID0gJ+KWiCcucmVwZWF0IHBlcmNlbnRhZ2UgLy8gOFxuICAgICAgc3dpdGNoIHBlcmNlbnRhZ2UgJSUgOFxuICAgICAgICB3aGVuIDAgdGhlbiBSICs9ICcgJ1xuICAgICAgICB3aGVuIDEgdGhlbiBSICs9ICfilo8nXG4gICAgICAgIHdoZW4gMiB0aGVuIFIgKz0gJ+KWjidcbiAgICAgICAgd2hlbiAzIHRoZW4gUiArPSAn4paNJ1xuICAgICAgICB3aGVuIDQgdGhlbiBSICs9ICfilownXG4gICAgICAgIHdoZW4gNSB0aGVuIFIgKz0gJ+KWiydcbiAgICAgICAgd2hlbiA2IHRoZW4gUiArPSAn4paKJ1xuICAgICAgICB3aGVuIDcgdGhlbiBSICs9ICfiloknXG4gICAgICByZXR1cm4gXCIje3BlcmNlbnRhZ2VfcnByfSAl4paVI3tmZytiZ30je1IucGFkRW5kIDEzfSN7ZmcwK2JnMH3ilo9cIlxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaG9sbG93X3BlcmNlbnRhZ2VfYmFyID0gKCBuICkgLT5cbiAgICAgIGlmIG4gaXMgbnVsbCBvciBuIDw9IDAgIHRoZW4gcmV0dXJuICcgICAgICAgICAgICAgJ1xuICAgICAgIyBpZiBuID49IDEwMCAgICAgICAgICAgICB0aGVuIHJldHVybiAn4paR4paR4paR4paR4paR4paR4paR4paR4paR4paR4paR4paR4paRJ1xuICAgICAgaWYgbiA+PSAxMDAgICAgICAgICAgICAgdGhlbiByZXR1cm4gJ+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWkydcbiAgICAgIG4gPSAoIE1hdGgucm91bmQgbiAvIDEwMCAqIDEwNCApXG4gICAgICAjIFIgPSAn4paRJy5yZXBlYXQgbiAvLyA4XG4gICAgICBSID0gJ+KWkycucmVwZWF0IG4gLy8gOFxuICAgICAgc3dpdGNoIG4gJSUgOFxuICAgICAgICB3aGVuIDAgdGhlbiBSICs9ICcgJ1xuICAgICAgICB3aGVuIDEgdGhlbiBSICs9ICfilo8nXG4gICAgICAgIHdoZW4gMiB0aGVuIFIgKz0gJ+KWjidcbiAgICAgICAgd2hlbiAzIHRoZW4gUiArPSAn4paNJ1xuICAgICAgICB3aGVuIDQgdGhlbiBSICs9ICfilownXG4gICAgICAgIHdoZW4gNSB0aGVuIFIgKz0gJ+KWiydcbiAgICAgICAgd2hlbiA2IHRoZW4gUiArPSAn4paKJ1xuICAgICAgICB3aGVuIDcgdGhlbiBSICs9ICfiloknXG4gICAgICAgICMgd2hlbiA4IHRoZW4gUiArPSAn4paIJ1xuICAgICAgcmV0dXJuIFIucGFkRW5kIDEzXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBnZXRfcGVyY2VudGFnZV9iYXIsIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9mb3JtYXRfc3RhY2s6IC0+XG4gICAgeyBhbnNpX2NvbG9yc19hbmRfZWZmZWN0czogQywgfSA9ICggcmVxdWlyZSAnLi9hbnNpLWJyaWNzJyApLnJlcXVpcmVfYW5zaV9jb2xvcnNfYW5kX2VmZmVjdHMoKVxuICAgIHsgc3RyaXBfYW5zaSwgICAgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vYW5zaS1icmljcycgKS5yZXF1aXJlX3N0cmlwX2Fuc2koKVxuICAgIHsgdHlwZV9vZiwgICAgICAgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vdW5zdGFibGUtcnByLXR5cGVfb2YtYnJpY3MnICkucmVxdWlyZV90eXBlX29mKClcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgbWFpbl9jICAgICAgICAgICAgICA9IHt9XG4gICAgbWFpbl9jLnJlc2V0ICAgICAgICA9IEMuZGVmYXVsdCArIEMuYmdfZGVmYXVsdCAgKyBDLmJvbGQwXG4gICAgbWFpbl9jLmZvbGRlcl9wYXRoICA9IEMuYmxhY2sgICArIEMuYmdfc2lsdmVyICAgKyBDLmJvbGRcbiAgICBtYWluX2MuZmlsZV9uYW1lICAgID0gQy53aW5lICAgICsgQy5iZ19zaWx2ZXIgICArIEMuYm9sZFxuICAgIG1haW5fYy5saW5lX25yICAgICAgPSBDLmJsYWNrICAgKyBDLmJnX2JsdWUgICAgICsgQy5ib2xkXG4gICAgbWFpbl9jLmNvbHVtbl9uciAgICA9IEMuYmxhY2sgICArIEMuYmdfYmx1ZSAgICAgKyBDLmJvbGRcbiAgICBtYWluX2MuY2FsbGVlICAgICAgID0gQy5ibGFjayAgICsgQy5iZ195ZWxsb3cgICArIEMuYm9sZFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgaW50ZXJuYWxfYyAgICAgICAgICA9IE9iamVjdC5jcmVhdGUgbWFpbl9jXG4gICAgZXh0ZXJuYWxfYyAgICAgICAgICA9IE9iamVjdC5jcmVhdGUgbWFpbl9jXG4gICAgZGVwZW5kZW5jeV9jICAgICAgICA9IE9iamVjdC5jcmVhdGUgbWFpbl9jXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICB0ZW1wbGF0ZXMgPVxuICAgICAgZm9ybWF0X3N0YWNrOlxuICAgICAgICByZWxhdGl2ZTogICAgICAgdHJ1ZSAjIGJvb2xlYW4gdG8gdXNlIENXRCwgb3Igc3BlY2lmeSByZWZlcmVuY2UgcGF0aFxuICAgICAgICBwYWRkaW5nOlxuICAgICAgICAgIHBhdGg6ICAgICAgICAgICA4MFxuICAgICAgICAgIGNhbGxlZTogICAgICAgICA1MFxuICAgICAgICBjb2xvcjpcbiAgICAgICAgICBtYWluOiAgICAgICAgICAgbWFpbl9jXG4gICAgICAgICAgaW50ZXJuYWw6ICAgICAgIGludGVybmFsX2NcbiAgICAgICAgICBleHRlcm5hbDogICAgICAgZXh0ZXJuYWxfY1xuICAgICAgICAgIGRlcGVuZGVuY3k6ICAgICBkZXBlbmRlbmN5X2NcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc3RhY2tfbGluZV9yZSA9IC8vLyBeXG4gICAgICBcXHMqIGF0IFxccytcbiAgICAgICg/OlxuICAgICAgICAoPzxjYWxsZWU+IC4qPyAgICApXG4gICAgICAgIFxccysgXFwoXG4gICAgICAgICk/XG4gICAgICAoPzxwYXRoPiAgICAgICg/PGZvbGRlcl9wYXRoPiAuKj8gKSAoPzxmaWxlX25hbWU+IFteIFxcLyBdKyApICApIDpcbiAgICAgICg/PGxpbmVfbnI+ICAgXFxkKyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOlxuICAgICAgKD88Y29sdW1uX25yPiBcXGQrICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgXFwpP1xuICAgICAgJCAvLy87XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGludGVybmFscyA9IE9iamVjdC5mcmVlemUgeyB0ZW1wbGF0ZXMsIH1cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgRm9ybWF0X3N0YWNrXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICggY2ZnICkgLT5cbiAgICAgICAgQGNmZyA9IHsgdGVtcGxhdGVzLmZvcm1hdF9zdGFjay4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIG1lID0gKCBQLi4uICkgPT4gQGZvcm1hdCBQLi4uXG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZiBtZSwgQFxuICAgICAgICByZXR1cm4gbWVcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmb3JtYXQ6ICggZXJyb3Jfb3Jfc3RhY2tfdHJhY2UgKSAtPlxuICAgICAgICAjIyMgVEFJTlQgdXNlIHByb3BlciB2YWxpZGF0aW9uICMjI1xuICAgICAgICBzd2l0Y2ggdHlwZSA9IHR5cGVfb2YgZXJyb3Jfb3Jfc3RhY2tfdHJhY2VcbiAgICAgICAgICB3aGVuICdlcnJvcicgIHRoZW4gc3RhY2tfdHJhY2UgPSBlcnJvcl9vcl9zdGFja190cmFjZS5zdGFja1xuICAgICAgICAgIHdoZW4gJ3RleHQnICAgdGhlbiBzdGFja190cmFjZSA9IGVycm9yX29yX3N0YWNrX3RyYWNlXG4gICAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzQgZXhwZWN0ZWQgYW4gZXJyb3Igb3IgYSB0ZXh0LCBnb3QgYSAje3R5cGV9XCJcbiAgICAgICAgcmV0dXJuICggKCAgQGZvcm1hdF9saW5lKSApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcmV3cml0ZV9wYXRoczogKCBsaW5lICkgLT5cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBwYXJzZV9saW5lOiAoIGxpbmUgKSAtPlxuICAgICAgICAjIyMgVEFJTlQgdXNlIHByb3BlciB2YWxpZGF0aW9uICMjI1xuICAgICAgICB1bmxlc3MgKCB0eXBlID0gdHlwZV9vZiBsaW5lICkgaXMgJ3RleHQnXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX181IGV4cGVjdGVkIGEgdGV4dCwgZ290IGEgI3t0eXBlfVwiXG4gICAgICAgIGlmICggJ1xcbicgaW4gbGluZSApXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX182IGV4cGVjdGVkIGEgc2luZ2xlIGxpbmUsIGdvdCBhIHRleHQgd2l0aCBsaW5lIGJyZWFrc1wiXG4gICAgICAgIHJldHVybiBudWxsIHVubGVzcyAoIG1hdGNoID0gbGluZS5tYXRjaCBzdGFja19saW5lX3JlICk/XG4gICAgICAgIFIgICAgICAgICAgID0geyBtYXRjaC5ncm91cHMuLi4sIH1cbiAgICAgICAgUi5jYWxsZWUgICA/PSAnW2Fub255bW91c10nXG4gICAgICAgIFIubGluZV9uciAgID0gcGFyc2VJbnQgUi5saW5lX25yLCAgIDEwXG4gICAgICAgIFIuY29sdW1uX25yID0gcGFyc2VJbnQgUi5jb2x1bW5fbnIsIDEwXG4gICAgICAgIHN3aXRjaCB0cnVlXG4gICAgICAgICAgd2hlbiBSLnBhdGguc3RhcnRzV2l0aCAnbm9kZTonICAgICAgICAgICAgICAgICAgdGhlbiAgUi50eXBlID0gJ2ludGVybmFsJ1xuICAgICAgICAgIHdoZW4gUi5wYXRoLnN0YXJ0c1dpdGggJy4uLycgICAgICAgICAgICAgICAgICAgIHRoZW4gIFIudHlwZSA9ICdleHRlcm5hbCdcbiAgICAgICAgICB3aGVuICggUi5wYXRoLmluZGV4T2YgJy9ub2RlX21vZHVsZXMvJyApID4gLTEgICB0aGVuICBSLnR5cGUgPSAnZGVwZW5kZW5jeSdcbiAgICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSLnR5cGUgPSAnbWFpbidcbiAgICAgICAgcmV0dXJuIFJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmb3JtYXRfbGluZTogKCBsaW5lICkgLT5cbiAgICAgICAgc3RhY2tfaW5mbyAgICAgID0gQHBhcnNlX2xpbmUgbGluZVxuICAgICAgICB0aGVtZSAgICAgICAgICAgPSBAY2ZnLmNvbG9yWyBzdGFja19pbmZvLnR5cGUgXVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZvbGRlcl9wYXRoICAgICA9IHRoZW1lLmZvbGRlcl9wYXRoICArICcgJyAgICArIHN0YWNrX2luZm8uZm9sZGVyX3BhdGggICsgJycgICAgICsgdGhlbWUucmVzZXRcbiAgICAgICAgZmlsZV9uYW1lICAgICAgID0gdGhlbWUuZmlsZV9uYW1lICAgICsgJycgICAgICsgc3RhY2tfaW5mby5maWxlX25hbWUgICAgKyAnICcgICAgKyB0aGVtZS5yZXNldFxuICAgICAgICBsaW5lX25yICAgICAgICAgPSB0aGVtZS5saW5lX25yICAgICAgKyAnICgnICAgKyBzdGFja19pbmZvLmxpbmVfbnIgICAgICArICcnICAgICArIHRoZW1lLnJlc2V0XG4gICAgICAgIGNvbHVtbl9uciAgICAgICA9IHRoZW1lLmNvbHVtbl9uciAgICArICc6JyAgICArIHN0YWNrX2luZm8uY29sdW1uX25yICAgICsgJykgJyAgICsgdGhlbWUucmVzZXRcbiAgICAgICAgY2FsbGVlICAgICAgICAgID0gdGhlbWUuY2FsbGVlICAgICAgICsgJyAjICcgICsgc3RhY2tfaW5mby5jYWxsZWUgICAgICAgKyAnKCkgJyAgKyB0aGVtZS5yZXNldFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHBhdGhfbGVuZ3RoICAgICA9ICggc3RyaXBfYW5zaSBmb2xkZXJfcGF0aCArIGZpbGVfbmFtZSArIGxpbmVfbnIgKyBjb2x1bW5fbnIgICkubGVuZ3RoXG4gICAgICAgIGNhbGxlZV9sZW5ndGggICA9ICggc3RyaXBfYW5zaSBjYWxsZWUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkubGVuZ3RoXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcGF0aF9sZW5ndGggICAgID0gTWF0aC5tYXggMCwgQGNmZy5wYWRkaW5nLnBhdGggICAgLSBwYXRoX2xlbmd0aFxuICAgICAgICBjYWxsZWVfbGVuZ3RoICAgPSBNYXRoLm1heCAwLCBAY2ZnLnBhZGRpbmcuY2FsbGVlICAtIGNhbGxlZV9sZW5ndGhcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBwYWRkaW5nX3BhdGggICAgPSB0aGVtZS5mb2xkZXJfcGF0aCArICggJyAnLnJlcGVhdCAgICBwYXRoX2xlbmd0aCApICsgdGhlbWUucmVzZXRcbiAgICAgICAgcGFkZGluZ19jYWxsZWUgID0gdGhlbWUuY2FsbGVlICAgICAgKyAoICcgJy5yZXBlYXQgIGNhbGxlZV9sZW5ndGggKSArIHRoZW1lLnJlc2V0XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIGZvbGRlcl9wYXRoICsgZmlsZV9uYW1lICsgbGluZV9uciArIGNvbHVtbl9uciArIHBhZGRpbmdfcGF0aCArIGNhbGxlZSArIHBhZGRpbmdfY2FsbGVlXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0gZG8gPT5cbiAgICAgIGZvcm1hdF9zdGFjayA9IG5ldyBGb3JtYXRfc3RhY2soKVxuICAgICAgcmV0dXJuIHsgZm9ybWF0X3N0YWNrLCBGb3JtYXRfc3RhY2ssIGludGVybmFscywgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgQlJJQ1NcblxuIl19
//# sourceURL=../src/unstable-brics.coffee