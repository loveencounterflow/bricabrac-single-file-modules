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
      var C, Format_stack, dependency_c, exports, external_c, hide, internal_c, internals, main_c, stack_line_re, strip_ansi, templates, type_of, unparsable_c;
      ({
        ansi_colors_and_effects: C
      } = (require('./ansi-brics')).require_ansi_colors_and_effects());
      ({strip_ansi} = (require('./ansi-brics')).require_strip_ansi());
      ({type_of} = (require('./unstable-rpr-type_of-brics')).require_type_of());
      ({hide} = (require('./various-brics')).require_managed_property_tools());
      //=======================================================================================================
      main_c = {};
      main_c.reset = C.reset; // C.default + C.bg_default  + C.bold0
      main_c.folder_path = C.black + C.bg_silver + C.bold;
      main_c.file_name = C.wine + C.bg_silver + C.bold;
      main_c.line_nr = C.black + C.bg_blue + C.bold;
      main_c.column_nr = C.black + C.bg_blue + C.bold;
      main_c.callee = C.black + C.bg_yellow + C.bold;
      //.......................................................................................................
      internal_c = Object.create(main_c);
      internal_c.folder_path = C.gray + C.bg_silver + C.bold;
      internal_c.file_name = C.gray + C.bg_silver + C.bold;
      internal_c.line_nr = C.gray + C.bg_silver + C.bold;
      internal_c.column_nr = C.gray + C.bg_silver + C.bold;
      internal_c.callee = C.gray + C.bg_silver + C.bold;
      //.......................................................................................................
      external_c = Object.create(main_c);
      external_c.callee = C.black + C.bg_lime + C.bold;
      //.......................................................................................................
      dependency_c = Object.create(main_c);
      dependency_c.callee = C.black + C.bg_orpiment + C.bold;
      //.......................................................................................................
      unparsable_c = Object.create(main_c);
      unparsable_c.folder_path = C.black + C.bg_red + C.bold;
      unparsable_c.file_name = C.red + C.bg_red + C.bold;
      unparsable_c.line_nr = C.red + C.bg_red + C.bold;
      unparsable_c.column_nr = C.red + C.bg_red + C.bold;
      unparsable_c.callee = C.red + C.bg_red + C.bold;
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
            dependency: dependency_c,
            unparsable: unparsable_c
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
          hide(this, 'get_relative_path', (() => {
            var PATH, error;
            try {
              PATH = require('node:path');
            } catch (error1) {
              error = error1;
              return null;
            }
            return PATH.relative.bind(PATH);
          })());
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
        parse_line(line) {
          /* TAINT use proper validation */
          var R, is_internal, match, ref, ref1, reference, type;
          if ((type = type_of(line)) !== 'text') {
            throw new Error(`Ω___5 expected a text, got a ${type}`);
          }
          if ((indexOf.call(line, '\n') >= 0)) {
            throw new Error("Ω___6 expected a single line, got a text with line breaks");
          }
          if ((match = line.match(stack_line_re)) != null) {
            R = {...match.groups};
            is_internal = R.path.startsWith('node:');
            if (R.callee == null) {
              R.callee = '[anonymous]';
            }
            R.line_nr = parseInt(R.line_nr, 10);
            R.column_nr = parseInt(R.column_nr, 10);
            //.................................................................................................
            if ((this.get_relative_path != null) && (!is_internal) && (this.cfg.relative !== false)) {
              reference = (this.cfg.relative === true) ? process.cwd() : this.cfg.relative;
              R.path = this.get_relative_path(reference, R.path);
              R.folder_path = (this.get_relative_path(reference, R.folder_path)) + '/';
              if (ref = R.path[0], indexOf.call('./', ref) < 0) {
                R.path = './' + R.path;
              }
              if (ref1 = R.folder_path[0], indexOf.call('./', ref1) < 0) {
                R.folder_path = './' + R.folder_path;
              }
            }
            //.................................................................................................
            switch (true) {
              case is_internal:
                R.type = 'internal';
                break;
              case (R.path.indexOf('/node_modules/')) > -1:
                R.type = 'dependency';
                break;
              case R.path.startsWith('../'):
                R.type = 'external';
                break;
              default:
                R.type = 'main';
            }
          } else {
            R = {
              callee: '',
              path: '',
              folder_path: line,
              file_name: '',
              line_nr: '',
              column_nr: '',
              type: 'unparsable'
            };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxLQUFBO0lBQUE7d0JBQUE7Ozs7O0VBS0EsS0FBQSxHQUtFLENBQUE7Ozs7SUFBQSwwQkFBQSxFQUE0QixRQUFBLENBQUEsQ0FBQTtBQUM5QixVQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsb0JBQUEsRUFBQSxvQkFBQSxFQUFBLGlCQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLGlCQUFBLEVBQUEsc0JBQUEsRUFBQTtNQUFJLEdBQUEsR0FDRTtRQUFBLFdBQUEsRUFBZ0IsSUFBaEI7UUFDQSxNQUFBLEVBQWdCLElBRGhCO1FBRUEsTUFBQSxFQUFnQjtNQUZoQjtNQUdGLGlCQUFBLEdBQW9CLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUVaLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBRlksQ0FBQSxrQ0FBQSxDQUFBLENBTVosTUFBTSxDQUFDLE1BQVAsQ0FBYyxHQUFHLENBQUMsTUFBbEIsQ0FOWSxDQUFBLEVBQUEsQ0FBQSxFQVFmLEdBUmUsRUFKeEI7Ozs7O01BaUJJLEdBQUEsR0FBb0IsUUFBQSxDQUFFLENBQUYsQ0FBQTtBQUNsQixlQUFPLENBQUEsQ0FBQSxDQUFBLENBQTZCLENBQUUsT0FBTyxDQUFULENBQUEsS0FBZ0IsUUFBekMsR0FBQSxDQUFDLENBQUMsT0FBRixDQUFVLElBQVYsRUFBZ0IsS0FBaEIsQ0FBQSxHQUFBLE1BQUosQ0FBQSxDQUFBO0FBQ1AsZUFBTyxDQUFBLENBQUEsQ0FBRyxDQUFILENBQUE7TUFGVztNQUdwQixNQUFBLEdBQ0U7UUFBQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFBLHFCQUFBLFFBQW1DLE1BQW5DLENBQUEsQ0FBdEI7UUFDQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFBLHFCQUFBLFFBQW1DLE1BQW5DLENBQUE7TUFEdEI7TUFFRixFQUFBLEdBQWdCLE9BQUEsQ0FBUSxTQUFSO01BQ2hCLElBQUEsR0FBZ0IsT0FBQSxDQUFRLFdBQVIsRUF4QnBCOztNQTBCSSxNQUFBLEdBQVMsUUFBQSxDQUFFLElBQUYsQ0FBQTtBQUNiLFlBQUE7QUFBTTtVQUFJLEVBQUUsQ0FBQyxRQUFILENBQVksSUFBWixFQUFKO1NBQXFCLGNBQUE7VUFBTTtBQUFXLGlCQUFPLE1BQXhCOztBQUNyQixlQUFPO01BRkEsRUExQmI7O01BOEJJLGlCQUFBLEdBQW9CLFFBQUEsQ0FBRSxJQUFGLENBQUE7QUFDeEIsWUFBQSxRQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUE7UUFDTSxJQUFzRixDQUFFLE9BQU8sSUFBVCxDQUFBLEtBQW1CLFFBQXpHOztVQUFBLE1BQU0sSUFBSSxNQUFNLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQSwyQkFBQSxDQUFBLENBQThCLEdBQUEsQ0FBSSxJQUFKLENBQTlCLENBQUEsQ0FBaEMsRUFBTjs7UUFDQSxNQUErRixJQUFJLENBQUMsTUFBTCxHQUFjLEVBQTdHO1VBQUEsTUFBTSxJQUFJLE1BQU0sQ0FBQyxvQkFBWCxDQUFnQyxDQUFBLG9DQUFBLENBQUEsQ0FBdUMsR0FBQSxDQUFJLElBQUosQ0FBdkMsQ0FBQSxDQUFoQyxFQUFOOztRQUNBLE9BQUEsR0FBVyxJQUFJLENBQUMsT0FBTCxDQUFhLElBQWI7UUFDWCxRQUFBLEdBQVcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFkO1FBQ1gsSUFBTyxtREFBUDtBQUNFLGlCQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFtQixDQUFBLENBQUEsQ0FBRyxHQUFHLENBQUMsTUFBUCxDQUFBLENBQUEsQ0FBZ0IsUUFBaEIsQ0FBQSxLQUFBLENBQUEsQ0FBZ0MsR0FBRyxDQUFDLE1BQXBDLENBQUEsQ0FBbkIsRUFEVDs7UUFFQSxDQUFBLENBQUUsS0FBRixFQUFTLEVBQVQsQ0FBQSxHQUFrQixLQUFLLENBQUMsTUFBeEI7UUFDQSxFQUFBLEdBQWtCLENBQUEsQ0FBQSxDQUFHLENBQUUsUUFBQSxDQUFTLEVBQVQsRUFBYSxFQUFiLENBQUYsQ0FBQSxHQUFzQixDQUF6QixDQUFBLENBQTRCLENBQUMsUUFBN0IsQ0FBc0MsQ0FBdEMsRUFBeUMsR0FBekM7UUFDbEIsSUFBQSxHQUFrQjtBQUNsQixlQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFtQixDQUFBLENBQUEsQ0FBRyxHQUFHLENBQUMsTUFBUCxDQUFBLENBQUEsQ0FBZ0IsS0FBaEIsQ0FBQSxDQUFBLENBQUEsQ0FBeUIsRUFBekIsQ0FBQSxDQUFBLENBQThCLEdBQUcsQ0FBQyxNQUFsQyxDQUFBLENBQW5CO01BWFcsRUE5QnhCOztNQTJDSSxzQkFBQSxHQUF5QixRQUFBLENBQUUsSUFBRixDQUFBO0FBQzdCLFlBQUEsQ0FBQSxFQUFBO1FBQU0sQ0FBQSxHQUFnQjtRQUNoQixhQUFBLEdBQWdCLENBQUM7QUFFakIsZUFBQSxJQUFBLEdBQUE7OztVQUVFLGFBQUE7VUFDQSxJQUFHLGFBQUEsR0FBZ0IsR0FBRyxDQUFDLFdBQXZCO1lBQ0csTUFBTSxJQUFJLE1BQU0sQ0FBQyxvQkFBWCxDQUFnQyxDQUFBLGdCQUFBLENBQUEsQ0FBbUIsYUFBbkIsQ0FBQSxpQkFBQSxDQUFBLENBQW9ELEdBQUEsQ0FBSSxDQUFKLENBQXBELENBQUEsT0FBQSxDQUFoQyxFQURUO1dBRlI7O1VBS1EsQ0FBQSxHQUFJLGlCQUFBLENBQWtCLENBQWxCO1VBQ0osS0FBYSxNQUFBLENBQU8sQ0FBUCxDQUFiO0FBQUEsa0JBQUE7O1FBUEY7QUFRQSxlQUFPO01BWmdCLEVBM0M3Qjs7OztBQTJESSxhQUFPLE9BQUEsR0FBVSxDQUFFLHNCQUFGLEVBQTBCLGlCQUExQixFQUE2QyxNQUE3QyxFQUFxRCxpQkFBckQsRUFBd0UsTUFBeEU7SUE1RFMsQ0FBNUI7OztJQWdFQSwwQkFBQSxFQUE0QixRQUFBLENBQUEsQ0FBQTtBQUM5QixVQUFBLEVBQUEsRUFBQSxPQUFBLEVBQUEsdUJBQUEsRUFBQTtNQUFJLEVBQUEsR0FBSyxPQUFBLENBQVEsb0JBQVIsRUFBVDs7TUFFSSx1QkFBQSxHQUEwQixRQUFBLENBQUUsT0FBRixFQUFXLEtBQVgsQ0FBQTtBQUN4QixlQUFPLENBQUUsRUFBRSxDQUFDLFFBQUgsQ0FBWSxPQUFaLEVBQXFCO1VBQUUsUUFBQSxFQUFVLE9BQVo7VUFBcUI7UUFBckIsQ0FBckIsQ0FBRixDQUFzRCxDQUFDLE9BQXZELENBQStELE1BQS9ELEVBQXVFLEVBQXZFO01BRGlCLEVBRjlCOztNQU1JLHNCQUFBLEdBQXlCLFFBQUEsQ0FBRSxJQUFGLENBQUEsRUFBQTs7QUFFdkIsZUFBTyxRQUFBLENBQVcsdUJBQUEsQ0FBd0Isc0JBQXhCLEVBQWdELElBQWhELENBQVgsRUFBbUUsRUFBbkU7TUFGZ0IsRUFON0I7O0FBV0ksYUFBTyxPQUFBLEdBQVUsQ0FBRSx1QkFBRixFQUEyQixzQkFBM0I7SUFaUyxDQWhFNUI7OztJQWlGQSwyQkFBQSxFQUE2QixRQUFBLENBQUEsQ0FBQTtBQUMvQixVQUFBLENBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLGtCQUFBLEVBQUE7TUFBSSxDQUFBO1FBQUUsdUJBQUEsRUFBeUI7TUFBM0IsQ0FBQSxHQUFrQyxDQUFFLE9BQUEsQ0FBUSxjQUFSLENBQUYsQ0FBMEIsQ0FBQywrQkFBM0IsQ0FBQSxDQUFsQztNQUNBLEVBQUEsR0FBTSxDQUFDLENBQUM7TUFDUixFQUFBLEdBQU0sQ0FBQyxDQUFDO01BQ1IsR0FBQSxHQUFNLENBQUMsQ0FBQztNQUNSLEdBQUEsR0FBTSxDQUFDLENBQUMsV0FKWjs7TUFPSSxrQkFBQSxHQUFxQixRQUFBLENBQUUsVUFBRixDQUFBLEVBQUE7O0FBQ3pCLFlBQUEsQ0FBQSxFQUFBO1FBQ00sY0FBQSxHQUFrQixDQUFFLElBQUksQ0FBQyxLQUFMLENBQVcsVUFBWCxDQUFGLENBQXlCLENBQUMsUUFBMUIsQ0FBQSxDQUFvQyxDQUFDLFFBQXJDLENBQThDLENBQTlDO1FBQ2xCLElBQUcsVUFBQSxLQUFjLElBQWQsSUFBc0IsVUFBQSxJQUFjLENBQXZDO0FBQStDLGlCQUFPLENBQUEsQ0FBQSxDQUFHLGNBQUgsQ0FBQSxpQkFBQSxFQUF0RDs7UUFDQSxJQUFHLFVBQUEsSUFBYyxHQUFqQjtBQUErQyxpQkFBTyxDQUFBLENBQUEsQ0FBRyxjQUFILENBQUEsaUJBQUEsRUFBdEQ7O1FBQ0EsVUFBQSxHQUFvQixJQUFJLENBQUMsS0FBTCxDQUFXLFVBQUEsR0FBYSxHQUFiLEdBQW1CLEdBQTlCO1FBQ3BCLENBQUEsR0FBa0IsR0FBRyxDQUFDLE1BQUosWUFBVyxhQUFjLEVBQXpCO0FBQ2xCLHVCQUFPLFlBQWMsRUFBckI7QUFBQSxlQUNPLENBRFA7WUFDYyxDQUFBLElBQUs7QUFBWjtBQURQLGVBRU8sQ0FGUDtZQUVjLENBQUEsSUFBSztBQUFaO0FBRlAsZUFHTyxDQUhQO1lBR2MsQ0FBQSxJQUFLO0FBQVo7QUFIUCxlQUlPLENBSlA7WUFJYyxDQUFBLElBQUs7QUFBWjtBQUpQLGVBS08sQ0FMUDtZQUtjLENBQUEsSUFBSztBQUFaO0FBTFAsZUFNTyxDQU5QO1lBTWMsQ0FBQSxJQUFLO0FBQVo7QUFOUCxlQU9PLENBUFA7WUFPYyxDQUFBLElBQUs7QUFBWjtBQVBQLGVBUU8sQ0FSUDtZQVFjLENBQUEsSUFBSztBQVJuQjtBQVNBLGVBQU8sQ0FBQSxDQUFBLENBQUcsY0FBSCxDQUFBLEdBQUEsQ0FBQSxDQUF1QixFQUFBLEdBQUcsRUFBMUIsQ0FBQSxDQUFBLENBQStCLENBQUMsQ0FBQyxNQUFGLENBQVMsRUFBVCxDQUEvQixDQUFBLENBQUEsQ0FBNkMsR0FBQSxHQUFJLEdBQWpELENBQUEsQ0FBQTtNQWhCWSxFQVB6Qjs7TUEwQkkscUJBQUEsR0FBd0IsUUFBQSxDQUFFLENBQUYsQ0FBQTtBQUM1QixZQUFBO1FBQU0sSUFBRyxDQUFBLEtBQUssSUFBTCxJQUFhLENBQUEsSUFBSyxDQUFyQjtBQUE2QixpQkFBTyxnQkFBcEM7U0FBTjs7UUFFTSxJQUFHLENBQUEsSUFBSyxHQUFSO0FBQTZCLGlCQUFPLGdCQUFwQzs7UUFDQSxDQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFBLEdBQUksR0FBSixHQUFVLEdBQXJCLEVBSFo7O1FBS00sQ0FBQSxHQUFJLEdBQUcsQ0FBQyxNQUFKLFlBQVcsSUFBSyxFQUFoQjtBQUNKLHVCQUFPLEdBQUssRUFBWjtBQUFBLGVBQ08sQ0FEUDtZQUNjLENBQUEsSUFBSztBQUFaO0FBRFAsZUFFTyxDQUZQO1lBRWMsQ0FBQSxJQUFLO0FBQVo7QUFGUCxlQUdPLENBSFA7WUFHYyxDQUFBLElBQUs7QUFBWjtBQUhQLGVBSU8sQ0FKUDtZQUljLENBQUEsSUFBSztBQUFaO0FBSlAsZUFLTyxDQUxQO1lBS2MsQ0FBQSxJQUFLO0FBQVo7QUFMUCxlQU1PLENBTlA7WUFNYyxDQUFBLElBQUs7QUFBWjtBQU5QLGVBT08sQ0FQUDtZQU9jLENBQUEsSUFBSztBQUFaO0FBUFAsZUFRTyxDQVJQO1lBUWMsQ0FBQSxJQUFLO0FBUm5CLFNBTk47O0FBZ0JNLGVBQU8sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxFQUFUO01BakJlLEVBMUI1Qjs7QUE4Q0ksYUFBTyxPQUFBLEdBQVUsQ0FBRSxrQkFBRjtJQS9DVSxDQWpGN0I7OztJQW9JQSxvQkFBQSxFQUFzQixRQUFBLENBQUEsQ0FBQTtBQUN4QixVQUFBLENBQUEsRUFBQSxZQUFBLEVBQUEsWUFBQSxFQUFBLE9BQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxFQUFBLFVBQUEsRUFBQSxTQUFBLEVBQUEsTUFBQSxFQUFBLGFBQUEsRUFBQSxVQUFBLEVBQUEsU0FBQSxFQUFBLE9BQUEsRUFBQTtNQUFJLENBQUE7UUFBRSx1QkFBQSxFQUF5QjtNQUEzQixDQUFBLEdBQWtDLENBQUUsT0FBQSxDQUFRLGNBQVIsQ0FBRixDQUEwQixDQUFDLCtCQUEzQixDQUFBLENBQWxDO01BQ0EsQ0FBQSxDQUFFLFVBQUYsQ0FBQSxHQUFrQyxDQUFFLE9BQUEsQ0FBUSxjQUFSLENBQUYsQ0FBMEIsQ0FBQyxrQkFBM0IsQ0FBQSxDQUFsQztNQUNBLENBQUEsQ0FBRSxPQUFGLENBQUEsR0FBa0MsQ0FBRSxPQUFBLENBQVEsOEJBQVIsQ0FBRixDQUEwQyxDQUFDLGVBQTNDLENBQUEsQ0FBbEM7TUFDQSxDQUFBLENBQUUsSUFBRixDQUFBLEdBQWtDLENBQUUsT0FBQSxDQUFRLGlCQUFSLENBQUYsQ0FBNkIsQ0FBQyw4QkFBOUIsQ0FBQSxDQUFsQyxFQUhKOztNQU1JLE1BQUEsR0FBNEIsQ0FBQTtNQUM1QixNQUFNLENBQUMsS0FBUCxHQUE0QixDQUFDLENBQUMsTUFQbEM7TUFRSSxNQUFNLENBQUMsV0FBUCxHQUE0QixDQUFDLENBQUMsS0FBRixHQUFZLENBQUMsQ0FBQyxTQUFkLEdBQTRCLENBQUMsQ0FBQztNQUMxRCxNQUFNLENBQUMsU0FBUCxHQUE0QixDQUFDLENBQUMsSUFBRixHQUFZLENBQUMsQ0FBQyxTQUFkLEdBQTRCLENBQUMsQ0FBQztNQUMxRCxNQUFNLENBQUMsT0FBUCxHQUE0QixDQUFDLENBQUMsS0FBRixHQUFZLENBQUMsQ0FBQyxPQUFkLEdBQTRCLENBQUMsQ0FBQztNQUMxRCxNQUFNLENBQUMsU0FBUCxHQUE0QixDQUFDLENBQUMsS0FBRixHQUFZLENBQUMsQ0FBQyxPQUFkLEdBQTRCLENBQUMsQ0FBQztNQUMxRCxNQUFNLENBQUMsTUFBUCxHQUE0QixDQUFDLENBQUMsS0FBRixHQUFZLENBQUMsQ0FBQyxTQUFkLEdBQTRCLENBQUMsQ0FBQyxLQVo5RDs7TUFjSSxVQUFBLEdBQTRCLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBZDtNQUM1QixVQUFVLENBQUMsV0FBWCxHQUE0QixDQUFDLENBQUMsSUFBRixHQUFZLENBQUMsQ0FBQyxTQUFkLEdBQTRCLENBQUMsQ0FBQztNQUMxRCxVQUFVLENBQUMsU0FBWCxHQUE0QixDQUFDLENBQUMsSUFBRixHQUFZLENBQUMsQ0FBQyxTQUFkLEdBQTRCLENBQUMsQ0FBQztNQUMxRCxVQUFVLENBQUMsT0FBWCxHQUE0QixDQUFDLENBQUMsSUFBRixHQUFZLENBQUMsQ0FBQyxTQUFkLEdBQTRCLENBQUMsQ0FBQztNQUMxRCxVQUFVLENBQUMsU0FBWCxHQUE0QixDQUFDLENBQUMsSUFBRixHQUFZLENBQUMsQ0FBQyxTQUFkLEdBQTRCLENBQUMsQ0FBQztNQUMxRCxVQUFVLENBQUMsTUFBWCxHQUE0QixDQUFDLENBQUMsSUFBRixHQUFZLENBQUMsQ0FBQyxTQUFkLEdBQTRCLENBQUMsQ0FBQyxLQW5COUQ7O01BcUJJLFVBQUEsR0FBNEIsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFkO01BQzVCLFVBQVUsQ0FBQyxNQUFYLEdBQTRCLENBQUMsQ0FBQyxLQUFGLEdBQVksQ0FBQyxDQUFDLE9BQWQsR0FBMEIsQ0FBQyxDQUFDLEtBdEI1RDs7TUF3QkksWUFBQSxHQUE0QixNQUFNLENBQUMsTUFBUCxDQUFjLE1BQWQ7TUFDNUIsWUFBWSxDQUFDLE1BQWIsR0FBNEIsQ0FBQyxDQUFDLEtBQUYsR0FBWSxDQUFDLENBQUMsV0FBZCxHQUE4QixDQUFDLENBQUMsS0F6QmhFOztNQTJCSSxZQUFBLEdBQTRCLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBZDtNQUM1QixZQUFZLENBQUMsV0FBYixHQUE0QixDQUFDLENBQUMsS0FBRixHQUFZLENBQUMsQ0FBQyxNQUFkLEdBQXlCLENBQUMsQ0FBQztNQUN2RCxZQUFZLENBQUMsU0FBYixHQUE0QixDQUFDLENBQUMsR0FBRixHQUFZLENBQUMsQ0FBQyxNQUFkLEdBQXlCLENBQUMsQ0FBQztNQUN2RCxZQUFZLENBQUMsT0FBYixHQUE0QixDQUFDLENBQUMsR0FBRixHQUFZLENBQUMsQ0FBQyxNQUFkLEdBQXlCLENBQUMsQ0FBQztNQUN2RCxZQUFZLENBQUMsU0FBYixHQUE0QixDQUFDLENBQUMsR0FBRixHQUFZLENBQUMsQ0FBQyxNQUFkLEdBQXlCLENBQUMsQ0FBQztNQUN2RCxZQUFZLENBQUMsTUFBYixHQUE0QixDQUFDLENBQUMsR0FBRixHQUFZLENBQUMsQ0FBQyxNQUFkLEdBQXlCLENBQUMsQ0FBQyxLQWhDM0Q7O01Ba0NJLFNBQUEsR0FDRTtRQUFBLFlBQUEsRUFDRTtVQUFBLFFBQUEsRUFBZ0IsSUFBaEI7VUFDQSxPQUFBLEVBQ0U7WUFBQSxJQUFBLEVBQWdCLEVBQWhCO1lBQ0EsTUFBQSxFQUFnQjtVQURoQixDQUZGO1VBSUEsS0FBQSxFQUNFO1lBQUEsSUFBQSxFQUFnQixNQUFoQjtZQUNBLFFBQUEsRUFBZ0IsVUFEaEI7WUFFQSxRQUFBLEVBQWdCLFVBRmhCO1lBR0EsVUFBQSxFQUFnQixZQUhoQjtZQUlBLFVBQUEsRUFBZ0I7VUFKaEI7UUFMRjtNQURGLEVBbkNOOztNQWdESSxhQUFBLEdBQWdCO01BYWhCLFNBQUEsR0FBWSxNQUFNLENBQUMsTUFBUCxDQUFjLENBQUUsU0FBRixDQUFkLEVBN0RoQjs7TUFnRVUsZUFBTixNQUFBLGFBQUEsQ0FBQTs7UUFHRSxXQUFhLENBQUUsR0FBRixDQUFBO0FBQ25CLGNBQUE7VUFBUSxJQUFDLENBQUEsR0FBRCxHQUFPLENBQUUsR0FBQSxTQUFTLENBQUMsWUFBWixFQUE2QixHQUFBLEdBQTdCO1VBQ1AsRUFBQSxHQUFLLENBQUEsR0FBRSxDQUFGLENBQUEsR0FBQTttQkFBWSxJQUFDLENBQUEsTUFBRCxDQUFRLEdBQUEsQ0FBUjtVQUFaO1VBQ0wsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsRUFBdEIsRUFBMEIsSUFBMUI7VUFDQSxJQUFBLENBQUssSUFBTCxFQUFRLG1CQUFSLEVBQWdDLENBQUEsQ0FBQSxDQUFBLEdBQUE7QUFDeEMsZ0JBQUEsSUFBQSxFQUFBO0FBQVU7Y0FBSSxJQUFBLEdBQU8sT0FBQSxDQUFRLFdBQVIsRUFBWDthQUErQixjQUFBO2NBQU07QUFBVyxxQkFBTyxLQUF4Qjs7QUFDL0IsbUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFkLENBQW1CLElBQW5CO1VBRnVCLENBQUEsR0FBaEM7QUFHQSxpQkFBTztRQVBJLENBRG5COzs7UUFXTSxNQUFRLENBQUUsb0JBQUYsQ0FBQSxFQUFBOztBQUNkLGNBQUEsV0FBQSxFQUFBO0FBQ1Esa0JBQU8sSUFBQSxHQUFPLE9BQUEsQ0FBUSxvQkFBUixDQUFkO0FBQUEsaUJBQ08sT0FEUDtjQUNxQixXQUFBLEdBQWMsb0JBQW9CLENBQUM7QUFBakQ7QUFEUCxpQkFFTyxNQUZQO2NBRXFCLFdBQUEsR0FBYztBQUE1QjtBQUZQO2NBR08sTUFBTSxJQUFJLEtBQUosQ0FBVSxDQUFBLHlDQUFBLENBQUEsQ0FBNEMsSUFBNUMsQ0FBQSxDQUFWO0FBSGI7QUFJQSxpQkFBWSxJQUFDLENBQUE7UUFOUCxDQVhkOzs7UUFvQk0sVUFBWSxDQUFFLElBQUYsQ0FBQSxFQUFBOztBQUNsQixjQUFBLENBQUEsRUFBQSxXQUFBLEVBQUEsS0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsU0FBQSxFQUFBO1VBQ1EsSUFBTyxDQUFFLElBQUEsR0FBTyxPQUFBLENBQVEsSUFBUixDQUFULENBQUEsS0FBMkIsTUFBbEM7WUFDRSxNQUFNLElBQUksS0FBSixDQUFVLENBQUEsNkJBQUEsQ0FBQSxDQUFnQyxJQUFoQyxDQUFBLENBQVYsRUFEUjs7VUFFQSxJQUFHLGNBQVUsTUFBUixVQUFGLENBQUg7WUFDRSxNQUFNLElBQUksS0FBSixDQUFVLDJEQUFWLEVBRFI7O1VBRUEsSUFBRywyQ0FBSDtZQUNFLENBQUEsR0FBYyxDQUFFLEdBQUEsS0FBSyxDQUFDLE1BQVI7WUFDZCxXQUFBLEdBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFQLENBQWtCLE9BQWxCOztjQUNkLENBQUMsQ0FBQyxTQUFZOztZQUNkLENBQUMsQ0FBQyxPQUFGLEdBQWMsUUFBQSxDQUFTLENBQUMsQ0FBQyxPQUFYLEVBQXNCLEVBQXRCO1lBQ2QsQ0FBQyxDQUFDLFNBQUYsR0FBYyxRQUFBLENBQVMsQ0FBQyxDQUFDLFNBQVgsRUFBc0IsRUFBdEIsRUFKeEI7O1lBTVUsSUFBRyxnQ0FBQSxJQUF3QixDQUFFLENBQUksV0FBTixDQUF4QixJQUFnRCxDQUFFLElBQUMsQ0FBQSxHQUFHLENBQUMsUUFBTCxLQUFtQixLQUFyQixDQUFuRDtjQUNFLFNBQUEsR0FBbUIsQ0FBRSxJQUFDLENBQUEsR0FBRyxDQUFDLFFBQUwsS0FBaUIsSUFBbkIsQ0FBSCxHQUFrQyxPQUFPLENBQUMsR0FBUixDQUFBLENBQWxDLEdBQXFELElBQUMsQ0FBQSxHQUFHLENBQUM7Y0FDMUUsQ0FBQyxDQUFDLElBQUYsR0FBa0IsSUFBQyxDQUFBLGlCQUFELENBQW1CLFNBQW5CLEVBQThCLENBQUMsQ0FBQyxJQUFoQztjQUNsQixDQUFDLENBQUMsV0FBRixHQUFnQixDQUFFLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixTQUFuQixFQUE4QixDQUFDLENBQUMsV0FBaEMsQ0FBRixDQUFBLEdBQWtEO2NBQ2xFLFVBQTRDLENBQUMsQ0FBQyxJQUFJLENBQUUsQ0FBRixnQkFBaUIsTUFBdkIsUUFBNUM7Z0JBQUEsQ0FBQyxDQUFDLElBQUYsR0FBZ0IsSUFBQSxHQUFPLENBQUMsQ0FBQyxLQUF6Qjs7Y0FDQSxXQUE0QyxDQUFDLENBQUMsV0FBVyxDQUFFLENBQUYsZ0JBQVUsTUFBdkIsU0FBNUM7Z0JBQUEsQ0FBQyxDQUFDLFdBQUYsR0FBZ0IsSUFBQSxHQUFPLENBQUMsQ0FBQyxZQUF6QjtlQUxGO2FBTlY7O0FBYVUsb0JBQU8sSUFBUDtBQUFBLG1CQUNPLFdBRFA7Z0JBQ3dELENBQUMsQ0FBQyxJQUFGLEdBQVM7QUFBMUQ7QUFEUCxtQkFFTyxDQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBUCxDQUFlLGdCQUFmLENBQUYsQ0FBQSxHQUFzQyxDQUFDLENBRjlDO2dCQUV3RCxDQUFDLENBQUMsSUFBRixHQUFTO0FBQTFEO0FBRlAsbUJBR08sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBSFA7Z0JBR3dELENBQUMsQ0FBQyxJQUFGLEdBQVM7QUFBMUQ7QUFIUDtnQkFJd0QsQ0FBQyxDQUFDLElBQUYsR0FBUztBQUpqRSxhQWRGO1dBQUEsTUFBQTtZQW9CRSxDQUFBLEdBQ0U7Y0FBQSxNQUFBLEVBQWMsRUFBZDtjQUNBLElBQUEsRUFBYyxFQURkO2NBRUEsV0FBQSxFQUFjLElBRmQ7Y0FHQSxTQUFBLEVBQWMsRUFIZDtjQUlBLE9BQUEsRUFBYyxFQUpkO2NBS0EsU0FBQSxFQUFjLEVBTGQ7Y0FNQSxJQUFBLEVBQWM7WUFOZCxFQXJCSjs7QUE0QkEsaUJBQU87UUFsQ0csQ0FwQmxCOzs7UUF5RE0sV0FBYSxDQUFFLElBQUYsQ0FBQTtBQUNuQixjQUFBLE1BQUEsRUFBQSxhQUFBLEVBQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxXQUFBLEVBQUEsT0FBQSxFQUFBLGNBQUEsRUFBQSxZQUFBLEVBQUEsV0FBQSxFQUFBLFVBQUEsRUFBQTtVQUFRLFVBQUEsR0FBa0IsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFaO1VBQ2xCLEtBQUEsR0FBa0IsSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUUsVUFBVSxDQUFDLElBQWIsRUFEcEM7O1VBR1EsV0FBQSxHQUFrQixLQUFLLENBQUMsV0FBTixHQUFxQixHQUFyQixHQUE4QixVQUFVLENBQUMsV0FBekMsR0FBd0QsRUFBeEQsR0FBaUUsS0FBSyxDQUFDO1VBQ3pGLFNBQUEsR0FBa0IsS0FBSyxDQUFDLFNBQU4sR0FBcUIsRUFBckIsR0FBOEIsVUFBVSxDQUFDLFNBQXpDLEdBQXdELEdBQXhELEdBQWlFLEtBQUssQ0FBQztVQUN6RixPQUFBLEdBQWtCLEtBQUssQ0FBQyxPQUFOLEdBQXFCLElBQXJCLEdBQThCLFVBQVUsQ0FBQyxPQUF6QyxHQUF3RCxFQUF4RCxHQUFpRSxLQUFLLENBQUM7VUFDekYsU0FBQSxHQUFrQixLQUFLLENBQUMsU0FBTixHQUFxQixHQUFyQixHQUE4QixVQUFVLENBQUMsU0FBekMsR0FBd0QsSUFBeEQsR0FBaUUsS0FBSyxDQUFDO1VBQ3pGLE1BQUEsR0FBa0IsS0FBSyxDQUFDLE1BQU4sR0FBcUIsS0FBckIsR0FBOEIsVUFBVSxDQUFDLE1BQXpDLEdBQXdELEtBQXhELEdBQWlFLEtBQUssQ0FBQyxNQVBqRzs7VUFTUSxXQUFBLEdBQWtCLENBQUUsVUFBQSxDQUFXLFdBQUEsR0FBYyxTQUFkLEdBQTBCLE9BQTFCLEdBQW9DLFNBQS9DLENBQUYsQ0FBNkQsQ0FBQztVQUNoRixhQUFBLEdBQWtCLENBQUUsVUFBQSxDQUFXLE1BQVgsQ0FBRixDQUE2RCxDQUFDLE9BVnhGOztVQVlRLFdBQUEsR0FBa0IsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBYixHQUF5QixXQUFyQztVQUNsQixhQUFBLEdBQWtCLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQWIsR0FBdUIsYUFBbkMsRUFiMUI7O1VBZVEsWUFBQSxHQUFrQixLQUFLLENBQUMsV0FBTixHQUFvQixDQUFFLEdBQUcsQ0FBQyxNQUFKLENBQWMsV0FBZCxDQUFGLENBQXBCLEdBQW9ELEtBQUssQ0FBQztVQUM1RSxjQUFBLEdBQWtCLEtBQUssQ0FBQyxNQUFOLEdBQW9CLENBQUUsR0FBRyxDQUFDLE1BQUosQ0FBWSxhQUFaLENBQUYsQ0FBcEIsR0FBb0QsS0FBSyxDQUFDLE1BaEJwRjs7QUFrQlEsaUJBQU8sV0FBQSxHQUFjLFNBQWQsR0FBMEIsT0FBMUIsR0FBb0MsU0FBcEMsR0FBZ0QsWUFBaEQsR0FBK0QsTUFBL0QsR0FBd0U7UUFuQnBFOztNQTNEZixFQWhFSjs7QUFpSkksYUFBTyxPQUFBLEdBQWEsQ0FBQSxDQUFBLENBQUEsR0FBQTtBQUN4QixZQUFBO1FBQU0sWUFBQSxHQUFlLElBQUksWUFBSixDQUFBO0FBQ2YsZUFBTyxDQUFFLFlBQUYsRUFBZ0IsWUFBaEIsRUFBOEIsU0FBOUI7TUFGVyxDQUFBO0lBbEpBO0VBcEl0QixFQVZGOzs7RUFzU0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsS0FBOUI7QUF0U0EiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkJSSUNTID1cbiAgXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfbmV4dF9mcmVlX2ZpbGVuYW1lOiAtPlxuICAgIGNmZyA9XG4gICAgICBtYXhfcmV0cmllczogICAgOTk5OVxuICAgICAgcHJlZml4OiAgICAgICAgICd+LidcbiAgICAgIHN1ZmZpeDogICAgICAgICAnLmJyaWNhYnJhYy1jYWNoZSdcbiAgICBjYWNoZV9maWxlbmFtZV9yZSA9IC8vL1xuICAgICAgXlxuICAgICAgKD86ICN7UmVnRXhwLmVzY2FwZSBjZmcucHJlZml4fSApXG4gICAgICAoPzxmaXJzdD4uKilcbiAgICAgIFxcLlxuICAgICAgKD88bnI+WzAtOV17NH0pXG4gICAgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5zdWZmaXh9IClcbiAgICAgICRcbiAgICAgIC8vL3ZcbiAgICAjIGNhY2hlX3N1ZmZpeF9yZSA9IC8vL1xuICAgICMgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5zdWZmaXh9IClcbiAgICAjICAgJFxuICAgICMgICAvLy92XG4gICAgcnByICAgICAgICAgICAgICAgPSAoIHggKSAtPlxuICAgICAgcmV0dXJuIFwiJyN7eC5yZXBsYWNlIC8nL2csIFwiXFxcXCdcIiBpZiAoIHR5cGVvZiB4ICkgaXMgJ3N0cmluZyd9J1wiXG4gICAgICByZXR1cm4gXCIje3h9XCJcbiAgICBlcnJvcnMgPVxuICAgICAgVE1QX2V4aGF1c3Rpb25fZXJyb3I6IGNsYXNzIFRNUF9leGhhdXN0aW9uX2Vycm9yIGV4dGVuZHMgRXJyb3JcbiAgICAgIFRNUF92YWxpZGF0aW9uX2Vycm9yOiBjbGFzcyBUTVBfdmFsaWRhdGlvbl9lcnJvciBleHRlbmRzIEVycm9yXG4gICAgRlMgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6ZnMnXG4gICAgUEFUSCAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6cGF0aCdcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGV4aXN0cyA9ICggcGF0aCApIC0+XG4gICAgICB0cnkgRlMuc3RhdFN5bmMgcGF0aCBjYXRjaCBlcnJvciB0aGVuIHJldHVybiBmYWxzZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGdldF9uZXh0X2ZpbGVuYW1lID0gKCBwYXRoICkgLT5cbiAgICAgICMjIyBUQUlOVCB1c2UgcHJvcGVyIHR5cGUgY2hlY2tpbmcgIyMjXG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF92YWxpZGF0aW9uX2Vycm9yIFwizqlfX18xIGV4cGVjdGVkIGEgdGV4dCwgZ290ICN7cnByIHBhdGh9XCIgdW5sZXNzICggdHlwZW9mIHBhdGggKSBpcyAnc3RyaW5nJ1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5UTVBfdmFsaWRhdGlvbl9lcnJvciBcIs6pX19fMiBleHBlY3RlZCBhIG5vbmVtcHR5IHRleHQsIGdvdCAje3JwciBwYXRofVwiIHVubGVzcyBwYXRoLmxlbmd0aCA+IDBcbiAgICAgIGRpcm5hbWUgID0gUEFUSC5kaXJuYW1lIHBhdGhcbiAgICAgIGJhc2VuYW1lID0gUEFUSC5iYXNlbmFtZSBwYXRoXG4gICAgICB1bmxlc3MgKCBtYXRjaCA9IGJhc2VuYW1lLm1hdGNoIGNhY2hlX2ZpbGVuYW1lX3JlICk/XG4gICAgICAgIHJldHVybiBQQVRILmpvaW4gZGlybmFtZSwgXCIje2NmZy5wcmVmaXh9I3tiYXNlbmFtZX0uMDAwMSN7Y2ZnLnN1ZmZpeH1cIlxuICAgICAgeyBmaXJzdCwgbnIsICB9ID0gbWF0Y2guZ3JvdXBzXG4gICAgICBuciAgICAgICAgICAgICAgPSBcIiN7KCBwYXJzZUludCBuciwgMTAgKSArIDF9XCIucGFkU3RhcnQgNCwgJzAnXG4gICAgICBwYXRoICAgICAgICAgICAgPSBmaXJzdFxuICAgICAgcmV0dXJuIFBBVEguam9pbiBkaXJuYW1lLCBcIiN7Y2ZnLnByZWZpeH0je2ZpcnN0fS4je25yfSN7Y2ZnLnN1ZmZpeH1cIlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZ2V0X25leHRfZnJlZV9maWxlbmFtZSA9ICggcGF0aCApIC0+XG4gICAgICBSICAgICAgICAgICAgID0gcGF0aFxuICAgICAgZmFpbHVyZV9jb3VudCA9IC0xXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGxvb3BcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmYWlsdXJlX2NvdW50KytcbiAgICAgICAgaWYgZmFpbHVyZV9jb3VudCA+IGNmZy5tYXhfcmV0cmllc1xuICAgICAgICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF9leGhhdXN0aW9uX2Vycm9yIFwizqlfX18zIHRvbyBtYW55ICgje2ZhaWx1cmVfY291bnR9KSByZXRyaWVzOyAgcGF0aCAje3JwciBSfSBleGlzdHNcIlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIFIgPSBnZXRfbmV4dF9maWxlbmFtZSBSXG4gICAgICAgIGJyZWFrIHVubGVzcyBleGlzdHMgUlxuICAgICAgcmV0dXJuIFJcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICMgc3dhcF9zdWZmaXggPSAoIHBhdGgsIHN1ZmZpeCApIC0+IHBhdGgucmVwbGFjZSBjYWNoZV9zdWZmaXhfcmUsIHN1ZmZpeFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9uZXh0X2ZyZWVfZmlsZW5hbWUsIGdldF9uZXh0X2ZpbGVuYW1lLCBleGlzdHMsIGNhY2hlX2ZpbGVuYW1lX3JlLCBlcnJvcnMsIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9jb21tYW5kX2xpbmVfdG9vbHM6IC0+XG4gICAgQ1AgPSByZXF1aXJlICdub2RlOmNoaWxkX3Byb2Nlc3MnXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X2NvbW1hbmRfbGluZV9yZXN1bHQgPSAoIGNvbW1hbmQsIGlucHV0ICkgLT5cbiAgICAgIHJldHVybiAoIENQLmV4ZWNTeW5jIGNvbW1hbmQsIHsgZW5jb2Rpbmc6ICd1dGYtOCcsIGlucHV0LCB9ICkucmVwbGFjZSAvXFxuJC9zLCAnJ1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X3djX21heF9saW5lX2xlbmd0aCA9ICggdGV4dCApIC0+XG4gICAgICAjIyMgdGh4IHRvIGh0dHBzOi8vdW5peC5zdGFja2V4Y2hhbmdlLmNvbS9hLzI1ODU1MS8yODAyMDQgIyMjXG4gICAgICByZXR1cm4gcGFyc2VJbnQgKCBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCAnd2MgLS1tYXgtbGluZS1sZW5ndGgnLCB0ZXh0ICksIDEwXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCwgZ2V0X3djX21heF9saW5lX2xlbmd0aCwgfVxuXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfcHJvZ3Jlc3NfaW5kaWNhdG9yczogLT5cbiAgICB7IGFuc2lfY29sb3JzX2FuZF9lZmZlY3RzOiBDLCB9ID0gKCByZXF1aXJlICcuL2Fuc2ktYnJpY3MnICkucmVxdWlyZV9hbnNpX2NvbG9yc19hbmRfZWZmZWN0cygpXG4gICAgZmcgID0gQy5ncmVlblxuICAgIGJnICA9IEMuYmdfcmVkXG4gICAgZmcwID0gQy5kZWZhdWx0XG4gICAgYmcwID0gQy5iZ19kZWZhdWx0XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfcGVyY2VudGFnZV9iYXIgPSAoIHBlcmNlbnRhZ2UgKSAtPlxuICAgICAgIyMjIPCfroLwn66D8J+uhPCfroXwn66GIOKWgeKWguKWg+KWhOKWheKWhuKWh+KWiCDilonilorilovilozilo3ilo7ilo/wn66H8J+uiPCfronwn66K8J+uiyDilpAg8J+tsCDwn62xIPCfrbIg8J+tsyDwn620IPCfrbUg8J+ugCDwn66BIPCfrbYg8J+ttyDwn624IPCfrbkg8J+tuiDwn627IPCfrb0g8J+tviDwn628IPCfrb8gIyMjXG4gICAgICBwZXJjZW50YWdlX3JwciAgPSAoIE1hdGgucm91bmQgcGVyY2VudGFnZSApLnRvU3RyaW5nKCkucGFkU3RhcnQgM1xuICAgICAgaWYgcGVyY2VudGFnZSBpcyBudWxsIG9yIHBlcmNlbnRhZ2UgPD0gMCAgdGhlbiByZXR1cm4gXCIje3BlcmNlbnRhZ2VfcnByfSAl4paVICAgICAgICAgICAgIOKWj1wiXG4gICAgICBpZiBwZXJjZW50YWdlID49IDEwMCAgICAgICAgICAgICAgICAgICAgICB0aGVuIHJldHVybiBcIiN7cGVyY2VudGFnZV9ycHJ9ICXilpXilojilojilojilojilojilojilojilojilojilojilojilojilojilo9cIlxuICAgICAgcGVyY2VudGFnZSAgICAgID0gKCBNYXRoLnJvdW5kIHBlcmNlbnRhZ2UgLyAxMDAgKiAxMDQgKVxuICAgICAgUiAgICAgICAgICAgICAgID0gJ+KWiCcucmVwZWF0IHBlcmNlbnRhZ2UgLy8gOFxuICAgICAgc3dpdGNoIHBlcmNlbnRhZ2UgJSUgOFxuICAgICAgICB3aGVuIDAgdGhlbiBSICs9ICcgJ1xuICAgICAgICB3aGVuIDEgdGhlbiBSICs9ICfilo8nXG4gICAgICAgIHdoZW4gMiB0aGVuIFIgKz0gJ+KWjidcbiAgICAgICAgd2hlbiAzIHRoZW4gUiArPSAn4paNJ1xuICAgICAgICB3aGVuIDQgdGhlbiBSICs9ICfilownXG4gICAgICAgIHdoZW4gNSB0aGVuIFIgKz0gJ+KWiydcbiAgICAgICAgd2hlbiA2IHRoZW4gUiArPSAn4paKJ1xuICAgICAgICB3aGVuIDcgdGhlbiBSICs9ICfiloknXG4gICAgICByZXR1cm4gXCIje3BlcmNlbnRhZ2VfcnByfSAl4paVI3tmZytiZ30je1IucGFkRW5kIDEzfSN7ZmcwK2JnMH3ilo9cIlxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaG9sbG93X3BlcmNlbnRhZ2VfYmFyID0gKCBuICkgLT5cbiAgICAgIGlmIG4gaXMgbnVsbCBvciBuIDw9IDAgIHRoZW4gcmV0dXJuICcgICAgICAgICAgICAgJ1xuICAgICAgIyBpZiBuID49IDEwMCAgICAgICAgICAgICB0aGVuIHJldHVybiAn4paR4paR4paR4paR4paR4paR4paR4paR4paR4paR4paR4paR4paRJ1xuICAgICAgaWYgbiA+PSAxMDAgICAgICAgICAgICAgdGhlbiByZXR1cm4gJ+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWkydcbiAgICAgIG4gPSAoIE1hdGgucm91bmQgbiAvIDEwMCAqIDEwNCApXG4gICAgICAjIFIgPSAn4paRJy5yZXBlYXQgbiAvLyA4XG4gICAgICBSID0gJ+KWkycucmVwZWF0IG4gLy8gOFxuICAgICAgc3dpdGNoIG4gJSUgOFxuICAgICAgICB3aGVuIDAgdGhlbiBSICs9ICcgJ1xuICAgICAgICB3aGVuIDEgdGhlbiBSICs9ICfilo8nXG4gICAgICAgIHdoZW4gMiB0aGVuIFIgKz0gJ+KWjidcbiAgICAgICAgd2hlbiAzIHRoZW4gUiArPSAn4paNJ1xuICAgICAgICB3aGVuIDQgdGhlbiBSICs9ICfilownXG4gICAgICAgIHdoZW4gNSB0aGVuIFIgKz0gJ+KWiydcbiAgICAgICAgd2hlbiA2IHRoZW4gUiArPSAn4paKJ1xuICAgICAgICB3aGVuIDcgdGhlbiBSICs9ICfiloknXG4gICAgICAgICMgd2hlbiA4IHRoZW4gUiArPSAn4paIJ1xuICAgICAgcmV0dXJuIFIucGFkRW5kIDEzXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBnZXRfcGVyY2VudGFnZV9iYXIsIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9mb3JtYXRfc3RhY2s6IC0+XG4gICAgeyBhbnNpX2NvbG9yc19hbmRfZWZmZWN0czogQywgfSA9ICggcmVxdWlyZSAnLi9hbnNpLWJyaWNzJyApLnJlcXVpcmVfYW5zaV9jb2xvcnNfYW5kX2VmZmVjdHMoKVxuICAgIHsgc3RyaXBfYW5zaSwgICAgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vYW5zaS1icmljcycgKS5yZXF1aXJlX3N0cmlwX2Fuc2koKVxuICAgIHsgdHlwZV9vZiwgICAgICAgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vdW5zdGFibGUtcnByLXR5cGVfb2YtYnJpY3MnICkucmVxdWlyZV90eXBlX29mKClcbiAgICB7IGhpZGUsICAgICAgICAgICAgICAgICAgICAgICB9ID0gKCByZXF1aXJlICcuL3ZhcmlvdXMtYnJpY3MnICkucmVxdWlyZV9tYW5hZ2VkX3Byb3BlcnR5X3Rvb2xzKClcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgbWFpbl9jICAgICAgICAgICAgICAgICAgICA9IHt9XG4gICAgbWFpbl9jLnJlc2V0ICAgICAgICAgICAgICA9IEMucmVzZXQgIyBDLmRlZmF1bHQgKyBDLmJnX2RlZmF1bHQgICsgQy5ib2xkMFxuICAgIG1haW5fYy5mb2xkZXJfcGF0aCAgICAgICAgPSBDLmJsYWNrICAgKyBDLmJnX3NpbHZlciAgICsgQy5ib2xkXG4gICAgbWFpbl9jLmZpbGVfbmFtZSAgICAgICAgICA9IEMud2luZSAgICArIEMuYmdfc2lsdmVyICAgKyBDLmJvbGRcbiAgICBtYWluX2MubGluZV9uciAgICAgICAgICAgID0gQy5ibGFjayAgICsgQy5iZ19ibHVlICAgICArIEMuYm9sZFxuICAgIG1haW5fYy5jb2x1bW5fbnIgICAgICAgICAgPSBDLmJsYWNrICAgKyBDLmJnX2JsdWUgICAgICsgQy5ib2xkXG4gICAgbWFpbl9jLmNhbGxlZSAgICAgICAgICAgICA9IEMuYmxhY2sgICArIEMuYmdfeWVsbG93ICAgKyBDLmJvbGRcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGludGVybmFsX2MgICAgICAgICAgICAgICAgPSBPYmplY3QuY3JlYXRlIG1haW5fY1xuICAgIGludGVybmFsX2MuZm9sZGVyX3BhdGggICAgPSBDLmdyYXkgICAgKyBDLmJnX3NpbHZlciAgICsgQy5ib2xkXG4gICAgaW50ZXJuYWxfYy5maWxlX25hbWUgICAgICA9IEMuZ3JheSAgICArIEMuYmdfc2lsdmVyICAgKyBDLmJvbGRcbiAgICBpbnRlcm5hbF9jLmxpbmVfbnIgICAgICAgID0gQy5ncmF5ICAgICsgQy5iZ19zaWx2ZXIgICArIEMuYm9sZFxuICAgIGludGVybmFsX2MuY29sdW1uX25yICAgICAgPSBDLmdyYXkgICAgKyBDLmJnX3NpbHZlciAgICsgQy5ib2xkXG4gICAgaW50ZXJuYWxfYy5jYWxsZWUgICAgICAgICA9IEMuZ3JheSAgICArIEMuYmdfc2lsdmVyICAgKyBDLmJvbGRcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGV4dGVybmFsX2MgICAgICAgICAgICAgICAgPSBPYmplY3QuY3JlYXRlIG1haW5fY1xuICAgIGV4dGVybmFsX2MuY2FsbGVlICAgICAgICAgPSBDLmJsYWNrICAgKyBDLmJnX2xpbWUgICArIEMuYm9sZFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZGVwZW5kZW5jeV9jICAgICAgICAgICAgICA9IE9iamVjdC5jcmVhdGUgbWFpbl9jXG4gICAgZGVwZW5kZW5jeV9jLmNhbGxlZSAgICAgICA9IEMuYmxhY2sgICArIEMuYmdfb3JwaW1lbnQgICArIEMuYm9sZFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgdW5wYXJzYWJsZV9jICAgICAgICAgICAgICA9IE9iamVjdC5jcmVhdGUgbWFpbl9jXG4gICAgdW5wYXJzYWJsZV9jLmZvbGRlcl9wYXRoICA9IEMuYmxhY2sgICArIEMuYmdfcmVkICAgKyBDLmJvbGRcbiAgICB1bnBhcnNhYmxlX2MuZmlsZV9uYW1lICAgID0gQy5yZWQgICAgICsgQy5iZ19yZWQgICArIEMuYm9sZFxuICAgIHVucGFyc2FibGVfYy5saW5lX25yICAgICAgPSBDLnJlZCAgICAgKyBDLmJnX3JlZCAgICsgQy5ib2xkXG4gICAgdW5wYXJzYWJsZV9jLmNvbHVtbl9uciAgICA9IEMucmVkICAgICArIEMuYmdfcmVkICAgKyBDLmJvbGRcbiAgICB1bnBhcnNhYmxlX2MuY2FsbGVlICAgICAgID0gQy5yZWQgICAgICsgQy5iZ19yZWQgICArIEMuYm9sZFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgdGVtcGxhdGVzID1cbiAgICAgIGZvcm1hdF9zdGFjazpcbiAgICAgICAgcmVsYXRpdmU6ICAgICAgIHRydWUgIyBib29sZWFuIHRvIHVzZSBDV0QsIG9yIHNwZWNpZnkgcmVmZXJlbmNlIHBhdGhcbiAgICAgICAgcGFkZGluZzpcbiAgICAgICAgICBwYXRoOiAgICAgICAgICAgODBcbiAgICAgICAgICBjYWxsZWU6ICAgICAgICAgNTBcbiAgICAgICAgY29sb3I6XG4gICAgICAgICAgbWFpbjogICAgICAgICAgIG1haW5fY1xuICAgICAgICAgIGludGVybmFsOiAgICAgICBpbnRlcm5hbF9jXG4gICAgICAgICAgZXh0ZXJuYWw6ICAgICAgIGV4dGVybmFsX2NcbiAgICAgICAgICBkZXBlbmRlbmN5OiAgICAgZGVwZW5kZW5jeV9jXG4gICAgICAgICAgdW5wYXJzYWJsZTogICAgIHVucGFyc2FibGVfY1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzdGFja19saW5lX3JlID0gLy8vIF5cbiAgICAgIFxccyogYXQgXFxzK1xuICAgICAgKD86XG4gICAgICAgICg/PGNhbGxlZT4gLio/ICAgIClcbiAgICAgICAgXFxzKyBcXChcbiAgICAgICAgKT9cbiAgICAgICg/PHBhdGg+ICAgICAgKD88Zm9sZGVyX3BhdGg+IC4qPyApICg/PGZpbGVfbmFtZT4gW14gXFwvIF0rICkgICkgOlxuICAgICAgKD88bGluZV9ucj4gICBcXGQrICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6XG4gICAgICAoPzxjb2x1bW5fbnI+IFxcZCsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICBcXCk/XG4gICAgICAkIC8vLztcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW50ZXJuYWxzID0gT2JqZWN0LmZyZWV6ZSB7IHRlbXBsYXRlcywgfVxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBGb3JtYXRfc3RhY2tcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKCBjZmcgKSAtPlxuICAgICAgICBAY2ZnID0geyB0ZW1wbGF0ZXMuZm9ybWF0X3N0YWNrLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgbWUgPSAoIFAuLi4gKSA9PiBAZm9ybWF0IFAuLi5cbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mIG1lLCBAXG4gICAgICAgIGhpZGUgQCwgJ2dldF9yZWxhdGl2ZV9wYXRoJywgZG8gPT5cbiAgICAgICAgICB0cnkgUEFUSCA9IHJlcXVpcmUgJ25vZGU6cGF0aCcgY2F0Y2ggZXJyb3IgdGhlbiByZXR1cm4gbnVsbFxuICAgICAgICAgIHJldHVybiBQQVRILnJlbGF0aXZlLmJpbmQgUEFUSFxuICAgICAgICByZXR1cm4gbWVcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmb3JtYXQ6ICggZXJyb3Jfb3Jfc3RhY2tfdHJhY2UgKSAtPlxuICAgICAgICAjIyMgVEFJTlQgdXNlIHByb3BlciB2YWxpZGF0aW9uICMjI1xuICAgICAgICBzd2l0Y2ggdHlwZSA9IHR5cGVfb2YgZXJyb3Jfb3Jfc3RhY2tfdHJhY2VcbiAgICAgICAgICB3aGVuICdlcnJvcicgIHRoZW4gc3RhY2tfdHJhY2UgPSBlcnJvcl9vcl9zdGFja190cmFjZS5zdGFja1xuICAgICAgICAgIHdoZW4gJ3RleHQnICAgdGhlbiBzdGFja190cmFjZSA9IGVycm9yX29yX3N0YWNrX3RyYWNlXG4gICAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzQgZXhwZWN0ZWQgYW4gZXJyb3Igb3IgYSB0ZXh0LCBnb3QgYSAje3R5cGV9XCJcbiAgICAgICAgcmV0dXJuICggKCAgQGZvcm1hdF9saW5lKSApXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcGFyc2VfbGluZTogKCBsaW5lICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdmFsaWRhdGlvbiAjIyNcbiAgICAgICAgdW5sZXNzICggdHlwZSA9IHR5cGVfb2YgbGluZSApIGlzICd0ZXh0J1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNSBleHBlY3RlZCBhIHRleHQsIGdvdCBhICN7dHlwZX1cIlxuICAgICAgICBpZiAoICdcXG4nIGluIGxpbmUgKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNiBleHBlY3RlZCBhIHNpbmdsZSBsaW5lLCBnb3QgYSB0ZXh0IHdpdGggbGluZSBicmVha3NcIlxuICAgICAgICBpZiAoIG1hdGNoID0gbGluZS5tYXRjaCBzdGFja19saW5lX3JlICk/XG4gICAgICAgICAgUiAgICAgICAgICAgPSB7IG1hdGNoLmdyb3Vwcy4uLiwgfVxuICAgICAgICAgIGlzX2ludGVybmFsID0gUi5wYXRoLnN0YXJ0c1dpdGggJ25vZGU6J1xuICAgICAgICAgIFIuY2FsbGVlICAgPz0gJ1thbm9ueW1vdXNdJ1xuICAgICAgICAgIFIubGluZV9uciAgID0gcGFyc2VJbnQgUi5saW5lX25yLCAgIDEwXG4gICAgICAgICAgUi5jb2x1bW5fbnIgPSBwYXJzZUludCBSLmNvbHVtbl9uciwgMTBcbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGlmIEBnZXRfcmVsYXRpdmVfcGF0aD8gYW5kICggbm90IGlzX2ludGVybmFsICkgYW5kICggQGNmZy5yZWxhdGl2ZSBpc250IGZhbHNlIClcbiAgICAgICAgICAgIHJlZmVyZW5jZSAgICAgPSBpZiAoIEBjZmcucmVsYXRpdmUgaXMgdHJ1ZSApIHRoZW4gcHJvY2Vzcy5jd2QoKSBlbHNlIEBjZmcucmVsYXRpdmVcbiAgICAgICAgICAgIFIucGF0aCAgICAgICAgPSAoIEBnZXRfcmVsYXRpdmVfcGF0aCByZWZlcmVuY2UsIFIucGF0aCAgICAgICAgKVxuICAgICAgICAgICAgUi5mb2xkZXJfcGF0aCA9ICggQGdldF9yZWxhdGl2ZV9wYXRoIHJlZmVyZW5jZSwgUi5mb2xkZXJfcGF0aCApICsgJy8nXG4gICAgICAgICAgICBSLnBhdGggICAgICAgID0gJy4vJyArIFIucGF0aCAgICAgICAgdW5sZXNzIFIucGF0aFsgMCBdICAgICAgICAgaW4gJy4vJ1xuICAgICAgICAgICAgUi5mb2xkZXJfcGF0aCA9ICcuLycgKyBSLmZvbGRlcl9wYXRoIHVubGVzcyBSLmZvbGRlcl9wYXRoWyAwIF0gIGluICcuLydcbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHN3aXRjaCB0cnVlXG4gICAgICAgICAgICB3aGVuIGlzX2ludGVybmFsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVuICBSLnR5cGUgPSAnaW50ZXJuYWwnXG4gICAgICAgICAgICB3aGVuICggUi5wYXRoLmluZGV4T2YgJy9ub2RlX21vZHVsZXMvJyApID4gLTEgICB0aGVuICBSLnR5cGUgPSAnZGVwZW5kZW5jeSdcbiAgICAgICAgICAgIHdoZW4gUi5wYXRoLnN0YXJ0c1dpdGggJy4uLycgICAgICAgICAgICAgICAgICAgIHRoZW4gIFIudHlwZSA9ICdleHRlcm5hbCdcbiAgICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFIudHlwZSA9ICdtYWluJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgUiA9XG4gICAgICAgICAgICBjYWxsZWU6ICAgICAgICcnXG4gICAgICAgICAgICBwYXRoOiAgICAgICAgICcnXG4gICAgICAgICAgICBmb2xkZXJfcGF0aDogIGxpbmVcbiAgICAgICAgICAgIGZpbGVfbmFtZTogICAgJydcbiAgICAgICAgICAgIGxpbmVfbnI6ICAgICAgJydcbiAgICAgICAgICAgIGNvbHVtbl9ucjogICAgJydcbiAgICAgICAgICAgIHR5cGU6ICAgICAgICAgJ3VucGFyc2FibGUnXG4gICAgICAgIHJldHVybiBSXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZm9ybWF0X2xpbmU6ICggbGluZSApIC0+XG4gICAgICAgIHN0YWNrX2luZm8gICAgICA9IEBwYXJzZV9saW5lIGxpbmVcbiAgICAgICAgdGhlbWUgICAgICAgICAgID0gQGNmZy5jb2xvclsgc3RhY2tfaW5mby50eXBlIF1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmb2xkZXJfcGF0aCAgICAgPSB0aGVtZS5mb2xkZXJfcGF0aCAgKyAnICcgICAgKyBzdGFja19pbmZvLmZvbGRlcl9wYXRoICArICcnICAgICArIHRoZW1lLnJlc2V0XG4gICAgICAgIGZpbGVfbmFtZSAgICAgICA9IHRoZW1lLmZpbGVfbmFtZSAgICArICcnICAgICArIHN0YWNrX2luZm8uZmlsZV9uYW1lICAgICsgJyAnICAgICsgdGhlbWUucmVzZXRcbiAgICAgICAgbGluZV9uciAgICAgICAgID0gdGhlbWUubGluZV9uciAgICAgICsgJyAoJyAgICsgc3RhY2tfaW5mby5saW5lX25yICAgICAgKyAnJyAgICAgKyB0aGVtZS5yZXNldFxuICAgICAgICBjb2x1bW5fbnIgICAgICAgPSB0aGVtZS5jb2x1bW5fbnIgICAgKyAnOicgICAgKyBzdGFja19pbmZvLmNvbHVtbl9uciAgICArICcpICcgICArIHRoZW1lLnJlc2V0XG4gICAgICAgIGNhbGxlZSAgICAgICAgICA9IHRoZW1lLmNhbGxlZSAgICAgICArICcgIyAnICArIHN0YWNrX2luZm8uY2FsbGVlICAgICAgICsgJygpICcgICsgdGhlbWUucmVzZXRcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBwYXRoX2xlbmd0aCAgICAgPSAoIHN0cmlwX2Fuc2kgZm9sZGVyX3BhdGggKyBmaWxlX25hbWUgKyBsaW5lX25yICsgY29sdW1uX25yICApLmxlbmd0aFxuICAgICAgICBjYWxsZWVfbGVuZ3RoICAgPSAoIHN0cmlwX2Fuc2kgY2FsbGVlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLmxlbmd0aFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHBhdGhfbGVuZ3RoICAgICA9IE1hdGgubWF4IDAsIEBjZmcucGFkZGluZy5wYXRoICAgIC0gICBwYXRoX2xlbmd0aFxuICAgICAgICBjYWxsZWVfbGVuZ3RoICAgPSBNYXRoLm1heCAwLCBAY2ZnLnBhZGRpbmcuY2FsbGVlICAtIGNhbGxlZV9sZW5ndGhcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBwYWRkaW5nX3BhdGggICAgPSB0aGVtZS5mb2xkZXJfcGF0aCArICggJyAnLnJlcGVhdCAgICBwYXRoX2xlbmd0aCApICsgdGhlbWUucmVzZXRcbiAgICAgICAgcGFkZGluZ19jYWxsZWUgID0gdGhlbWUuY2FsbGVlICAgICAgKyAoICcgJy5yZXBlYXQgIGNhbGxlZV9sZW5ndGggKSArIHRoZW1lLnJlc2V0XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIGZvbGRlcl9wYXRoICsgZmlsZV9uYW1lICsgbGluZV9uciArIGNvbHVtbl9uciArIHBhZGRpbmdfcGF0aCArIGNhbGxlZSArIHBhZGRpbmdfY2FsbGVlXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0gZG8gPT5cbiAgICAgIGZvcm1hdF9zdGFjayA9IG5ldyBGb3JtYXRfc3RhY2soKVxuICAgICAgcmV0dXJuIHsgZm9ybWF0X3N0YWNrLCBGb3JtYXRfc3RhY2ssIGludGVybmFscywgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgQlJJQ1NcblxuIl19
//# sourceURL=../src/unstable-brics.coffee