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
      /* TAINT make use of `FS` optional like `get_relative_path()` */
      var C, FS, Format_stack, dependency_c, exports, external_c, hide, internal_c, internals, main_c, rpr, stack_line_re, strip_ansi, templates, type_of, unparsable_c;
      ({
        ansi_colors_and_effects: C
      } = (require('./ansi-brics')).require_ansi_colors_and_effects());
      ({strip_ansi} = (require('./ansi-brics')).require_strip_ansi());
      ({type_of} = (require('./unstable-rpr-type_of-brics')).require_type_of());
      ({hide} = (require('./various-brics')).require_managed_property_tools());
      ({
        show_no_colors: rpr
      } = (require('./main')).unstable.require_show());
      FS = require('node:fs');
      //=======================================================================================================
      main_c = {};
      main_c.reset = C.reset; // C.default + C.bg_default  + C.bold0
      main_c.folder_path = C.black + C.bg_lime + C.bold;
      main_c.file_name = C.wine + C.bg_lime + C.bold;
      main_c.callee = C.black + C.bg_lime + C.bold;
      main_c.line_nr = C.black + C.bg_blue + C.bold;
      main_c.column_nr = C.black + C.bg_blue + C.bold;
      main_c.context = C.lightslategray + C.bg_darkslatish;
      // main_c.context            = C.lightslategray  + C.bg_darkslategray
      main_c.hit = C.white + C.bg_darkslatish + C.bold;
      main_c.spot = C.yellow + C.bg_wine + C.bold;
      // main_c.hit                = C.white          + C.bg_forest + C.bold
      main_c.reference = C.lightslategray + C.bg_black;
      //.......................................................................................................
      external_c = Object.create(main_c);
      external_c.folder_path = C.black + C.bg_yellow + C.bold;
      external_c.file_name = C.wine + C.bg_yellow + C.bold;
      external_c.callee = C.black + C.bg_yellow + C.bold;
      //.......................................................................................................
      dependency_c = Object.create(main_c);
      dependency_c.folder_path = C.black + C.bg_orpiment + C.bold;
      dependency_c.file_name = C.wine + C.bg_orpiment + C.bold;
      dependency_c.callee = C.black + C.bg_orpiment + C.bold;
      //.......................................................................................................
      internal_c = Object.create(main_c);
      internal_c.folder_path = C.gray + C.bg_silver + C.bold;
      internal_c.file_name = C.gray + C.bg_silver + C.bold;
      internal_c.line_nr = C.gray + C.bg_silver + C.bold;
      internal_c.column_nr = C.gray + C.bg_silver + C.bold;
      internal_c.callee = C.gray + C.bg_silver + C.bold;
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
          context: 2,
          padding: {
            path: 90,
            callee: 60
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
          hide(this, 'state', {
            cache: new Map()
          });
          return me;
        }

        //-----------------------------------------------------------------------------------------------------
        format(error_or_stack) {
          /* TAINT use proper validation */
          var line, lines, stack, type;
          switch (type = type_of(error_or_stack)) {
            case 'error':
              stack = error_or_stack.stack;
              break;
            // headline  =
            case 'text':
              stack = error_or_stack;
              break;
            default:
              // headline  = stack.
              throw new Error(`Ω___4 expected an error or a text, got a ${type}`);
          }
          lines = stack.split('\n');
          lines.push(lines[0]);
          lines = lines.reverse();
          return ((function() {
            var i, len, results;
            results = [];
            for (i = 0, len = lines.length; i < len; i++) {
              line = lines[i];
              results.push(this.format_line(line));
            }
            return results;
          }).call(this)).join('\n');
        }

        //-----------------------------------------------------------------------------------------------------
        parse_line(line) {
          /* TAINT use proper validation */
          var R, is_internal, match, reference, type;
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
            }
            // R.path        = './' + R.path        unless R.path[ 0 ]         in './'
            // R.folder_path = './' + R.folder_path unless R.folder_path[ 0 ]  in './'
            //.................................................................................................
            switch (true) {
              case is_internal:
                R.type = 'internal';
                break;
              case /\bnode_modules\//.test(R.path):
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
          var context, source_reference, stack_info;
          ({stack_info, source_reference} = this._format_source_reference(line));
          context = this.cfg.context === false ? [] : this._get_context(stack_info);
          return [source_reference, ...context].join('\n');
        }

        //-----------------------------------------------------------------------------------------------------
        _format_source_reference(line) {
          var callee, callee_length, column_nr, file_name, folder_path, line_nr, padding_callee, padding_path, path_length, source_reference, stack_info, theme;
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
          source_reference = folder_path + file_name + line_nr + column_nr + padding_path + callee + padding_callee;
          return {stack_info, source_reference};
        }

        //-----------------------------------------------------------------------------------------------------
        _get_context(stack_info) {
          var R, before, behind, error, first_idx, hit_idx, i, idx, last_idx, line, ref, ref1, ref2, ref_width, reference, source, spot, theme, width;
          if (((ref = stack_info.type) === 'internal' || ref === 'unparsable') || (stack_info.path === '')) {
            return [];
          }
          try {
            source = FS.readFileSync(stack_info.path, {
              encoding: 'utf-8'
            });
          } catch (error1) {
            error = error1;
            if (error.code !== 'ENOENT') {
              throw error;
            }
            return [`unable to read file ${rpr(stack_info.path)}`];
          }
          //...................................................................................................
          theme = this.cfg.color[stack_info.type];
          ref_width = 7;
          width = this.cfg.padding.path + this.cfg.padding.callee - ref_width;
          source = source.split('\n');
          hit_idx = stack_info.line_nr - 1;
          // return source[ hit_idx ] if @cfg.context < 1
          //...................................................................................................
          first_idx = Math.max(hit_idx - this.cfg.context, 0);
          last_idx = Math.min(hit_idx + this.cfg.context, source.length - 1);
          R = [];
//...................................................................................................
          for (idx = i = ref1 = first_idx, ref2 = last_idx; (ref1 <= ref2 ? i <= ref2 : i >= ref2); idx = ref1 <= ref2 ? ++i : --i) {
            line = source[idx];
            reference = theme.reference + (`${idx + 1} `.padStart(ref_width, ' '));
            if (idx === hit_idx) {
              before = line.slice(0, stack_info.column_nr - 1);
              spot = line.slice(stack_info.column_nr - 1);
              behind = ' '.repeat(Math.max(0, line.length - width));
              R.push(reference + theme.hit + before + theme.spot + spot + theme.hit + behind + theme.reset);
            } else {
              line = line.padEnd(width, ' ');
              R.push(reference + theme.context + line + theme.reset);
            }
          }
          //...................................................................................................
          return R;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxLQUFBO0lBQUE7d0JBQUE7Ozs7O0VBS0EsS0FBQSxHQUtFLENBQUE7Ozs7SUFBQSwwQkFBQSxFQUE0QixRQUFBLENBQUEsQ0FBQTtBQUM5QixVQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsb0JBQUEsRUFBQSxvQkFBQSxFQUFBLGlCQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLGlCQUFBLEVBQUEsc0JBQUEsRUFBQTtNQUFJLEdBQUEsR0FDRTtRQUFBLFdBQUEsRUFBZ0IsSUFBaEI7UUFDQSxNQUFBLEVBQWdCLElBRGhCO1FBRUEsTUFBQSxFQUFnQjtNQUZoQjtNQUdGLGlCQUFBLEdBQW9CLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUVaLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBRlksQ0FBQSxrQ0FBQSxDQUFBLENBTVosTUFBTSxDQUFDLE1BQVAsQ0FBYyxHQUFHLENBQUMsTUFBbEIsQ0FOWSxDQUFBLEVBQUEsQ0FBQSxFQVFmLEdBUmUsRUFKeEI7Ozs7O01BaUJJLEdBQUEsR0FBb0IsUUFBQSxDQUFFLENBQUYsQ0FBQTtBQUNsQixlQUFPLENBQUEsQ0FBQSxDQUFBLENBQTZCLENBQUUsT0FBTyxDQUFULENBQUEsS0FBZ0IsUUFBekMsR0FBQSxDQUFDLENBQUMsT0FBRixDQUFVLElBQVYsRUFBZ0IsS0FBaEIsQ0FBQSxHQUFBLE1BQUosQ0FBQSxDQUFBO0FBQ1AsZUFBTyxDQUFBLENBQUEsQ0FBRyxDQUFILENBQUE7TUFGVztNQUdwQixNQUFBLEdBQ0U7UUFBQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFBLHFCQUFBLFFBQW1DLE1BQW5DLENBQUEsQ0FBdEI7UUFDQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFB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RUFBOEIsU0FBOUI7TUFGVyxDQUFBO0lBbE5BO0VBcEl0QixFQVZGOzs7RUFzV0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsS0FBOUI7QUF0V0EiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkJSSUNTID1cbiAgXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfbmV4dF9mcmVlX2ZpbGVuYW1lOiAtPlxuICAgIGNmZyA9XG4gICAgICBtYXhfcmV0cmllczogICAgOTk5OVxuICAgICAgcHJlZml4OiAgICAgICAgICd+LidcbiAgICAgIHN1ZmZpeDogICAgICAgICAnLmJyaWNhYnJhYy1jYWNoZSdcbiAgICBjYWNoZV9maWxlbmFtZV9yZSA9IC8vL1xuICAgICAgXlxuICAgICAgKD86ICN7UmVnRXhwLmVzY2FwZSBjZmcucHJlZml4fSApXG4gICAgICAoPzxmaXJzdD4uKilcbiAgICAgIFxcLlxuICAgICAgKD88bnI+WzAtOV17NH0pXG4gICAgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5zdWZmaXh9IClcbiAgICAgICRcbiAgICAgIC8vL3ZcbiAgICAjIGNhY2hlX3N1ZmZpeF9yZSA9IC8vL1xuICAgICMgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5zdWZmaXh9IClcbiAgICAjICAgJFxuICAgICMgICAvLy92XG4gICAgcnByICAgICAgICAgICAgICAgPSAoIHggKSAtPlxuICAgICAgcmV0dXJuIFwiJyN7eC5yZXBsYWNlIC8nL2csIFwiXFxcXCdcIiBpZiAoIHR5cGVvZiB4ICkgaXMgJ3N0cmluZyd9J1wiXG4gICAgICByZXR1cm4gXCIje3h9XCJcbiAgICBlcnJvcnMgPVxuICAgICAgVE1QX2V4aGF1c3Rpb25fZXJyb3I6IGNsYXNzIFRNUF9leGhhdXN0aW9uX2Vycm9yIGV4dGVuZHMgRXJyb3JcbiAgICAgIFRNUF92YWxpZGF0aW9uX2Vycm9yOiBjbGFzcyBUTVBfdmFsaWRhdGlvbl9lcnJvciBleHRlbmRzIEVycm9yXG4gICAgRlMgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6ZnMnXG4gICAgUEFUSCAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6cGF0aCdcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGV4aXN0cyA9ICggcGF0aCApIC0+XG4gICAgICB0cnkgRlMuc3RhdFN5bmMgcGF0aCBjYXRjaCBlcnJvciB0aGVuIHJldHVybiBmYWxzZVxuICAgICAgcmV0dXJuIHRydWVcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGdldF9uZXh0X2ZpbGVuYW1lID0gKCBwYXRoICkgLT5cbiAgICAgICMjIyBUQUlOVCB1c2UgcHJvcGVyIHR5cGUgY2hlY2tpbmcgIyMjXG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF92YWxpZGF0aW9uX2Vycm9yIFwizqlfX18xIGV4cGVjdGVkIGEgdGV4dCwgZ290ICN7cnByIHBhdGh9XCIgdW5sZXNzICggdHlwZW9mIHBhdGggKSBpcyAnc3RyaW5nJ1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5UTVBfdmFsaWRhdGlvbl9lcnJvciBcIs6pX19fMiBleHBlY3RlZCBhIG5vbmVtcHR5IHRleHQsIGdvdCAje3JwciBwYXRofVwiIHVubGVzcyBwYXRoLmxlbmd0aCA+IDBcbiAgICAgIGRpcm5hbWUgID0gUEFUSC5kaXJuYW1lIHBhdGhcbiAgICAgIGJhc2VuYW1lID0gUEFUSC5iYXNlbmFtZSBwYXRoXG4gICAgICB1bmxlc3MgKCBtYXRjaCA9IGJhc2VuYW1lLm1hdGNoIGNhY2hlX2ZpbGVuYW1lX3JlICk/XG4gICAgICAgIHJldHVybiBQQVRILmpvaW4gZGlybmFtZSwgXCIje2NmZy5wcmVmaXh9I3tiYXNlbmFtZX0uMDAwMSN7Y2ZnLnN1ZmZpeH1cIlxuICAgICAgeyBmaXJzdCwgbnIsICB9ID0gbWF0Y2guZ3JvdXBzXG4gICAgICBuciAgICAgICAgICAgICAgPSBcIiN7KCBwYXJzZUludCBuciwgMTAgKSArIDF9XCIucGFkU3RhcnQgNCwgJzAnXG4gICAgICBwYXRoICAgICAgICAgICAgPSBmaXJzdFxuICAgICAgcmV0dXJuIFBBVEguam9pbiBkaXJuYW1lLCBcIiN7Y2ZnLnByZWZpeH0je2ZpcnN0fS4je25yfSN7Y2ZnLnN1ZmZpeH1cIlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZ2V0X25leHRfZnJlZV9maWxlbmFtZSA9ICggcGF0aCApIC0+XG4gICAgICBSICAgICAgICAgICAgID0gcGF0aFxuICAgICAgZmFpbHVyZV9jb3VudCA9IC0xXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGxvb3BcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmYWlsdXJlX2NvdW50KytcbiAgICAgICAgaWYgZmFpbHVyZV9jb3VudCA+IGNmZy5tYXhfcmV0cmllc1xuICAgICAgICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF9leGhhdXN0aW9uX2Vycm9yIFwizqlfX18zIHRvbyBtYW55ICgje2ZhaWx1cmVfY291bnR9KSByZXRyaWVzOyAgcGF0aCAje3JwciBSfSBleGlzdHNcIlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIFIgPSBnZXRfbmV4dF9maWxlbmFtZSBSXG4gICAgICAgIGJyZWFrIHVubGVzcyBleGlzdHMgUlxuICAgICAgcmV0dXJuIFJcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICMgc3dhcF9zdWZmaXggPSAoIHBhdGgsIHN1ZmZpeCApIC0+IHBhdGgucmVwbGFjZSBjYWNoZV9zdWZmaXhfcmUsIHN1ZmZpeFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9uZXh0X2ZyZWVfZmlsZW5hbWUsIGdldF9uZXh0X2ZpbGVuYW1lLCBleGlzdHMsIGNhY2hlX2ZpbGVuYW1lX3JlLCBlcnJvcnMsIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9jb21tYW5kX2xpbmVfdG9vbHM6IC0+XG4gICAgQ1AgPSByZXF1aXJlICdub2RlOmNoaWxkX3Byb2Nlc3MnXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X2NvbW1hbmRfbGluZV9yZXN1bHQgPSAoIGNvbW1hbmQsIGlucHV0ICkgLT5cbiAgICAgIHJldHVybiAoIENQLmV4ZWNTeW5jIGNvbW1hbmQsIHsgZW5jb2Rpbmc6ICd1dGYtOCcsIGlucHV0LCB9ICkucmVwbGFjZSAvXFxuJC9zLCAnJ1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X3djX21heF9saW5lX2xlbmd0aCA9ICggdGV4dCApIC0+XG4gICAgICAjIyMgdGh4IHRvIGh0dHBzOi8vdW5peC5zdGFja2V4Y2hhbmdlLmNvbS9hLzI1ODU1MS8yODAyMDQgIyMjXG4gICAgICByZXR1cm4gcGFyc2VJbnQgKCBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCAnd2MgLS1tYXgtbGluZS1sZW5ndGgnLCB0ZXh0ICksIDEwXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCwgZ2V0X3djX21heF9saW5lX2xlbmd0aCwgfVxuXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfcHJvZ3Jlc3NfaW5kaWNhdG9yczogLT5cbiAgICB7IGFuc2lfY29sb3JzX2FuZF9lZmZlY3RzOiBDLCB9ID0gKCByZXF1aXJlICcuL2Fuc2ktYnJpY3MnICkucmVxdWlyZV9hbnNpX2NvbG9yc19hbmRfZWZmZWN0cygpXG4gICAgZmcgID0gQy5ncmVlblxuICAgIGJnICA9IEMuYmdfcmVkXG4gICAgZmcwID0gQy5kZWZhdWx0XG4gICAgYmcwID0gQy5iZ19kZWZhdWx0XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfcGVyY2VudGFnZV9iYXIgPSAoIHBlcmNlbnRhZ2UgKSAtPlxuICAgICAgIyMjIPCfroLwn66D8J+uhPCfroXwn66GIOKWgeKWguKWg+KWhOKWheKWhuKWh+KWiCDilonilorilovilozilo3ilo7ilo/wn66H8J+uiPCfronwn66K8J+uiyDilpAg8J+tsCDwn62xIPCfrbIg8J+tsyDwn620IPCfrbUg8J+ugCDwn66BIPCfrbYg8J+ttyDwn624IPCfrbkg8J+tuiDwn627IPCfrb0g8J+tviDwn628IPCfrb8gIyMjXG4gICAgICBwZXJjZW50YWdlX3JwciAgPSAoIE1hdGgucm91bmQgcGVyY2VudGFnZSApLnRvU3RyaW5nKCkucGFkU3RhcnQgM1xuICAgICAgaWYgcGVyY2VudGFnZSBpcyBudWxsIG9yIHBlcmNlbnRhZ2UgPD0gMCAgdGhlbiByZXR1cm4gXCIje3BlcmNlbnRhZ2VfcnByfSAl4paVICAgICAgICAgICAgIOKWj1wiXG4gICAgICBpZiBwZXJjZW50YWdlID49IDEwMCAgICAgICAgICAgICAgICAgICAgICB0aGVuIHJldHVybiBcIiN7cGVyY2VudGFnZV9ycHJ9ICXilpXilojilojilojilojilojilojilojilojilojilojilojilojilojilo9cIlxuICAgICAgcGVyY2VudGFnZSAgICAgID0gKCBNYXRoLnJvdW5kIHBlcmNlbnRhZ2UgLyAxMDAgKiAxMDQgKVxuICAgICAgUiAgICAgICAgICAgICAgID0gJ+KWiCcucmVwZWF0IHBlcmNlbnRhZ2UgLy8gOFxuICAgICAgc3dpdGNoIHBlcmNlbnRhZ2UgJSUgOFxuICAgICAgICB3aGVuIDAgdGhlbiBSICs9ICcgJ1xuICAgICAgICB3aGVuIDEgdGhlbiBSICs9ICfilo8nXG4gICAgICAgIHdoZW4gMiB0aGVuIFIgKz0gJ+KWjidcbiAgICAgICAgd2hlbiAzIHRoZW4gUiArPSAn4paNJ1xuICAgICAgICB3aGVuIDQgdGhlbiBSICs9ICfilownXG4gICAgICAgIHdoZW4gNSB0aGVuIFIgKz0gJ+KWiydcbiAgICAgICAgd2hlbiA2IHRoZW4gUiArPSAn4paKJ1xuICAgICAgICB3aGVuIDcgdGhlbiBSICs9ICfiloknXG4gICAgICByZXR1cm4gXCIje3BlcmNlbnRhZ2VfcnByfSAl4paVI3tmZytiZ30je1IucGFkRW5kIDEzfSN7ZmcwK2JnMH3ilo9cIlxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaG9sbG93X3BlcmNlbnRhZ2VfYmFyID0gKCBuICkgLT5cbiAgICAgIGlmIG4gaXMgbnVsbCBvciBuIDw9IDAgIHRoZW4gcmV0dXJuICcgICAgICAgICAgICAgJ1xuICAgICAgIyBpZiBuID49IDEwMCAgICAgICAgICAgICB0aGVuIHJldHVybiAn4paR4paR4paR4paR4paR4paR4paR4paR4paR4paR4paR4paR4paRJ1xuICAgICAgaWYgbiA+PSAxMDAgICAgICAgICAgICAgdGhlbiByZXR1cm4gJ+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWk+KWkydcbiAgICAgIG4gPSAoIE1hdGgucm91bmQgbiAvIDEwMCAqIDEwNCApXG4gICAgICAjIFIgPSAn4paRJy5yZXBlYXQgbiAvLyA4XG4gICAgICBSID0gJ+KWkycucmVwZWF0IG4gLy8gOFxuICAgICAgc3dpdGNoIG4gJSUgOFxuICAgICAgICB3aGVuIDAgdGhlbiBSICs9ICcgJ1xuICAgICAgICB3aGVuIDEgdGhlbiBSICs9ICfilo8nXG4gICAgICAgIHdoZW4gMiB0aGVuIFIgKz0gJ+KWjidcbiAgICAgICAgd2hlbiAzIHRoZW4gUiArPSAn4paNJ1xuICAgICAgICB3aGVuIDQgdGhlbiBSICs9ICfilownXG4gICAgICAgIHdoZW4gNSB0aGVuIFIgKz0gJ+KWiydcbiAgICAgICAgd2hlbiA2IHRoZW4gUiArPSAn4paKJ1xuICAgICAgICB3aGVuIDcgdGhlbiBSICs9ICfiloknXG4gICAgICAgICMgd2hlbiA4IHRoZW4gUiArPSAn4paIJ1xuICAgICAgcmV0dXJuIFIucGFkRW5kIDEzXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBnZXRfcGVyY2VudGFnZV9iYXIsIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9mb3JtYXRfc3RhY2s6IC0+XG4gICAgeyBhbnNpX2NvbG9yc19hbmRfZWZmZWN0czogQywgfSA9ICggcmVxdWlyZSAnLi9hbnNpLWJyaWNzJyApLnJlcXVpcmVfYW5zaV9jb2xvcnNfYW5kX2VmZmVjdHMoKVxuICAgIHsgc3RyaXBfYW5zaSwgICAgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vYW5zaS1icmljcycgKS5yZXF1aXJlX3N0cmlwX2Fuc2koKVxuICAgIHsgdHlwZV9vZiwgICAgICAgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vdW5zdGFibGUtcnByLXR5cGVfb2YtYnJpY3MnICkucmVxdWlyZV90eXBlX29mKClcbiAgICB7IGhpZGUsICAgICAgICAgICAgICAgICAgICAgICB9ID0gKCByZXF1aXJlICcuL3ZhcmlvdXMtYnJpY3MnICkucmVxdWlyZV9tYW5hZ2VkX3Byb3BlcnR5X3Rvb2xzKClcbiAgICB7IHNob3dfbm9fY29sb3JzOiBycHIsICAgICAgICB9ID0gKCByZXF1aXJlICcuL21haW4nICkudW5zdGFibGUucmVxdWlyZV9zaG93KClcbiAgICAjIyMgVEFJTlQgbWFrZSB1c2Ugb2YgYEZTYCBvcHRpb25hbCBsaWtlIGBnZXRfcmVsYXRpdmVfcGF0aCgpYCAjIyNcbiAgICBGUyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpmcydcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgbWFpbl9jICAgICAgICAgICAgICAgICAgICA9IHt9XG4gICAgbWFpbl9jLnJlc2V0ICAgICAgICAgICAgICA9IEMucmVzZXQgIyBDLmRlZmF1bHQgKyBDLmJnX2RlZmF1bHQgICsgQy5ib2xkMFxuICAgIG1haW5fYy5mb2xkZXJfcGF0aCAgICAgICAgPSBDLmJsYWNrICAgKyBDLmJnX2xpbWUgICAgICsgQy5ib2xkXG4gICAgbWFpbl9jLmZpbGVfbmFtZSAgICAgICAgICA9IEMud2luZSAgICArIEMuYmdfbGltZSAgICAgKyBDLmJvbGRcbiAgICBtYWluX2MuY2FsbGVlICAgICAgICAgICAgID0gQy5ibGFjayAgICsgQy5iZ19saW1lICAgICArIEMuYm9sZFxuICAgIG1haW5fYy5saW5lX25yICAgICAgICAgICAgPSBDLmJsYWNrICAgKyBDLmJnX2JsdWUgICAgICsgQy5ib2xkXG4gICAgbWFpbl9jLmNvbHVtbl9uciAgICAgICAgICA9IEMuYmxhY2sgICArIEMuYmdfYmx1ZSAgICAgKyBDLmJvbGRcbiAgICBtYWluX2MuY29udGV4dCAgICAgICAgICAgID0gQy5saWdodHNsYXRlZ3JheSAgKyBDLmJnX2RhcmtzbGF0aXNoXG4gICAgIyBtYWluX2MuY29udGV4dCAgICAgICAgICAgID0gQy5saWdodHNsYXRlZ3JheSAgKyBDLmJnX2RhcmtzbGF0ZWdyYXlcbiAgICBtYWluX2MuaGl0ICAgICAgICAgICAgICAgID0gQy53aGl0ZSAgICAgICAgICAgKyBDLmJnX2RhcmtzbGF0aXNoICsgQy5ib2xkXG4gICAgbWFpbl9jLnNwb3QgICAgICAgICAgICAgICA9IEMueWVsbG93ICAgICAgICAgICAgICsgQy5iZ193aW5lICsgQy5ib2xkXG4gICAgIyBtYWluX2MuaGl0ICAgICAgICAgICAgICAgID0gQy53aGl0ZSAgICAgICAgICArIEMuYmdfZm9yZXN0ICsgQy5ib2xkXG4gICAgbWFpbl9jLnJlZmVyZW5jZSAgICAgICAgICA9IEMubGlnaHRzbGF0ZWdyYXkgICsgQy5iZ19ibGFja1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZXh0ZXJuYWxfYyAgICAgICAgICAgICAgICA9IE9iamVjdC5jcmVhdGUgbWFpbl9jXG4gICAgZXh0ZXJuYWxfYy5mb2xkZXJfcGF0aCAgICA9IEMuYmxhY2sgICArIEMuYmdfeWVsbG93ICAgKyBDLmJvbGRcbiAgICBleHRlcm5hbF9jLmZpbGVfbmFtZSAgICAgID0gQy53aW5lICAgICsgQy5iZ195ZWxsb3cgICArIEMuYm9sZFxuICAgIGV4dGVybmFsX2MuY2FsbGVlICAgICAgICAgPSBDLmJsYWNrICAgKyBDLmJnX3llbGxvdyAgICsgQy5ib2xkXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBkZXBlbmRlbmN5X2MgICAgICAgICAgICAgID0gT2JqZWN0LmNyZWF0ZSBtYWluX2NcbiAgICBkZXBlbmRlbmN5X2MuZm9sZGVyX3BhdGggID0gQy5ibGFjayAgICsgQy5iZ19vcnBpbWVudCArIEMuYm9sZFxuICAgIGRlcGVuZGVuY3lfYy5maWxlX25hbWUgICAgPSBDLndpbmUgICAgKyBDLmJnX29ycGltZW50ICsgQy5ib2xkXG4gICAgZGVwZW5kZW5jeV9jLmNhbGxlZSAgICAgICA9IEMuYmxhY2sgICArIEMuYmdfb3JwaW1lbnQgKyBDLmJvbGRcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGludGVybmFsX2MgICAgICAgICAgICAgICAgPSBPYmplY3QuY3JlYXRlIG1haW5fY1xuICAgIGludGVybmFsX2MuZm9sZGVyX3BhdGggICAgPSBDLmdyYXkgICAgKyBDLmJnX3NpbHZlciAgICsgQy5ib2xkXG4gICAgaW50ZXJuYWxfYy5maWxlX25hbWUgICAgICA9IEMuZ3JheSAgICArIEMuYmdfc2lsdmVyICAgKyBDLmJvbGRcbiAgICBpbnRlcm5hbF9jLmxpbmVfbnIgICAgICAgID0gQy5ncmF5ICAgICsgQy5iZ19zaWx2ZXIgICArIEMuYm9sZFxuICAgIGludGVybmFsX2MuY29sdW1uX25yICAgICAgPSBDLmdyYXkgICAgKyBDLmJnX3NpbHZlciAgICsgQy5ib2xkXG4gICAgaW50ZXJuYWxfYy5jYWxsZWUgICAgICAgICA9IEMuZ3JheSAgICArIEMuYmdfc2lsdmVyICAgKyBDLmJvbGRcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHVucGFyc2FibGVfYyAgICAgICAgICAgICAgPSBPYmplY3QuY3JlYXRlIG1haW5fY1xuICAgIHVucGFyc2FibGVfYy5mb2xkZXJfcGF0aCAgPSBDLmJsYWNrICAgKyBDLmJnX3JlZCAgICAgICsgQy5ib2xkXG4gICAgdW5wYXJzYWJsZV9jLmZpbGVfbmFtZSAgICA9IEMucmVkICAgICArIEMuYmdfcmVkICAgICAgKyBDLmJvbGRcbiAgICB1bnBhcnNhYmxlX2MubGluZV9uciAgICAgID0gQy5yZWQgICAgICsgQy5iZ19yZWQgICAgICArIEMuYm9sZFxuICAgIHVucGFyc2FibGVfYy5jb2x1bW5fbnIgICAgPSBDLnJlZCAgICAgKyBDLmJnX3JlZCAgICAgICsgQy5ib2xkXG4gICAgdW5wYXJzYWJsZV9jLmNhbGxlZSAgICAgICA9IEMucmVkICAgICArIEMuYmdfcmVkICAgICAgKyBDLmJvbGRcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHRlbXBsYXRlcyA9XG4gICAgICBmb3JtYXRfc3RhY2s6XG4gICAgICAgIHJlbGF0aXZlOiAgICAgICB0cnVlICMgYm9vbGVhbiB0byB1c2UgQ1dELCBvciBzcGVjaWZ5IHJlZmVyZW5jZSBwYXRoXG4gICAgICAgIGNvbnRleHQ6ICAgICAgICAyXG4gICAgICAgIHBhZGRpbmc6XG4gICAgICAgICAgcGF0aDogICAgICAgICAgIDkwXG4gICAgICAgICAgY2FsbGVlOiAgICAgICAgIDYwXG4gICAgICAgIGNvbG9yOlxuICAgICAgICAgIG1haW46ICAgICAgICAgICBtYWluX2NcbiAgICAgICAgICBpbnRlcm5hbDogICAgICAgaW50ZXJuYWxfY1xuICAgICAgICAgIGV4dGVybmFsOiAgICAgICBleHRlcm5hbF9jXG4gICAgICAgICAgZGVwZW5kZW5jeTogICAgIGRlcGVuZGVuY3lfY1xuICAgICAgICAgIHVucGFyc2FibGU6ICAgICB1bnBhcnNhYmxlX2NcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgc3RhY2tfbGluZV9yZSA9IC8vLyBeXG4gICAgICBcXHMqIGF0IFxccytcbiAgICAgICg/OlxuICAgICAgICAoPzxjYWxsZWU+IC4qPyAgICApXG4gICAgICAgIFxccysgXFwoXG4gICAgICAgICk/XG4gICAgICAoPzxwYXRoPiAgICAgICg/PGZvbGRlcl9wYXRoPiAuKj8gKSAoPzxmaWxlX25hbWU+IFteIFxcLyBdKyApICApIDpcbiAgICAgICg/PGxpbmVfbnI+ICAgXFxkKyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOlxuICAgICAgKD88Y29sdW1uX25yPiBcXGQrICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgXFwpP1xuICAgICAgJCAvLy87XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGludGVybmFscyA9IE9iamVjdC5mcmVlemUgeyB0ZW1wbGF0ZXMsIH1cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgRm9ybWF0X3N0YWNrXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICggY2ZnICkgLT5cbiAgICAgICAgQGNmZyA9IHsgdGVtcGxhdGVzLmZvcm1hdF9zdGFjay4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIG1lID0gKCBQLi4uICkgPT4gQGZvcm1hdCBQLi4uXG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZiBtZSwgQFxuICAgICAgICBoaWRlIEAsICdnZXRfcmVsYXRpdmVfcGF0aCcsIGRvID0+XG4gICAgICAgICAgdHJ5IFBBVEggPSByZXF1aXJlICdub2RlOnBhdGgnIGNhdGNoIGVycm9yIHRoZW4gcmV0dXJuIG51bGxcbiAgICAgICAgICByZXR1cm4gUEFUSC5yZWxhdGl2ZS5iaW5kIFBBVEhcbiAgICAgICAgaGlkZSBALCAnc3RhdGUnLCB7IGNhY2hlOiBuZXcgTWFwKCksIH1cbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZm9ybWF0OiAoIGVycm9yX29yX3N0YWNrICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdmFsaWRhdGlvbiAjIyNcbiAgICAgICAgc3dpdGNoIHR5cGUgPSB0eXBlX29mIGVycm9yX29yX3N0YWNrXG4gICAgICAgICAgd2hlbiAnZXJyb3InXG4gICAgICAgICAgICBzdGFjayAgICAgPSBlcnJvcl9vcl9zdGFjay5zdGFja1xuICAgICAgICAgICAgIyBoZWFkbGluZSAgPVxuICAgICAgICAgIHdoZW4gJ3RleHQnXG4gICAgICAgICAgICBzdGFjayAgICAgPSBlcnJvcl9vcl9zdGFja1xuICAgICAgICAgICAgIyBoZWFkbGluZSAgPSBzdGFjay5cbiAgICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvciBcIs6pX19fNCBleHBlY3RlZCBhbiBlcnJvciBvciBhIHRleHQsIGdvdCBhICN7dHlwZX1cIlxuICAgICAgICBsaW5lcyA9IHN0YWNrLnNwbGl0ICdcXG4nXG4gICAgICAgIGxpbmVzLnB1c2ggbGluZXNbIDAgXVxuICAgICAgICBsaW5lcyA9IGxpbmVzLnJldmVyc2UoKVxuICAgICAgICByZXR1cm4gKCAoIEBmb3JtYXRfbGluZSBsaW5lICkgZm9yIGxpbmUgaW4gbGluZXMgKS5qb2luICdcXG4nXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcGFyc2VfbGluZTogKCBsaW5lICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdmFsaWRhdGlvbiAjIyNcbiAgICAgICAgdW5sZXNzICggdHlwZSA9IHR5cGVfb2YgbGluZSApIGlzICd0ZXh0J1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNSBleHBlY3RlZCBhIHRleHQsIGdvdCBhICN7dHlwZX1cIlxuICAgICAgICBpZiAoICdcXG4nIGluIGxpbmUgKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNiBleHBlY3RlZCBhIHNpbmdsZSBsaW5lLCBnb3QgYSB0ZXh0IHdpdGggbGluZSBicmVha3NcIlxuICAgICAgICBpZiAoIG1hdGNoID0gbGluZS5tYXRjaCBzdGFja19saW5lX3JlICk/XG4gICAgICAgICAgUiAgICAgICAgICAgPSB7IG1hdGNoLmdyb3Vwcy4uLiwgfVxuICAgICAgICAgIGlzX2ludGVybmFsID0gUi5wYXRoLnN0YXJ0c1dpdGggJ25vZGU6J1xuICAgICAgICAgIFIuY2FsbGVlICAgPz0gJ1thbm9ueW1vdXNdJ1xuICAgICAgICAgIFIubGluZV9uciAgID0gcGFyc2VJbnQgUi5saW5lX25yLCAgIDEwXG4gICAgICAgICAgUi5jb2x1bW5fbnIgPSBwYXJzZUludCBSLmNvbHVtbl9uciwgMTBcbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIGlmIEBnZXRfcmVsYXRpdmVfcGF0aD8gYW5kICggbm90IGlzX2ludGVybmFsICkgYW5kICggQGNmZy5yZWxhdGl2ZSBpc250IGZhbHNlIClcbiAgICAgICAgICAgIHJlZmVyZW5jZSAgICAgPSBpZiAoIEBjZmcucmVsYXRpdmUgaXMgdHJ1ZSApIHRoZW4gcHJvY2Vzcy5jd2QoKSBlbHNlIEBjZmcucmVsYXRpdmVcbiAgICAgICAgICAgIFIucGF0aCAgICAgICAgPSAoIEBnZXRfcmVsYXRpdmVfcGF0aCByZWZlcmVuY2UsIFIucGF0aCAgICAgICAgKVxuICAgICAgICAgICAgUi5mb2xkZXJfcGF0aCA9ICggQGdldF9yZWxhdGl2ZV9wYXRoIHJlZmVyZW5jZSwgUi5mb2xkZXJfcGF0aCApICsgJy8nXG4gICAgICAgICAgICAjIFIucGF0aCAgICAgICAgPSAnLi8nICsgUi5wYXRoICAgICAgICB1bmxlc3MgUi5wYXRoWyAwIF0gICAgICAgICBpbiAnLi8nXG4gICAgICAgICAgICAjIFIuZm9sZGVyX3BhdGggPSAnLi8nICsgUi5mb2xkZXJfcGF0aCB1bmxlc3MgUi5mb2xkZXJfcGF0aFsgMCBdICBpbiAnLi8nXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBzd2l0Y2ggdHJ1ZVxuICAgICAgICAgICAgd2hlbiBpc19pbnRlcm5hbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbiAgUi50eXBlID0gJ2ludGVybmFsJ1xuICAgICAgICAgICAgd2hlbiAvXFxibm9kZV9tb2R1bGVzXFwvLy50ZXN0IFIucGF0aCAgICAgICAgICAgICB0aGVuICBSLnR5cGUgPSAnZGVwZW5kZW5jeSdcbiAgICAgICAgICAgIHdoZW4gUi5wYXRoLnN0YXJ0c1dpdGggJy4uLycgICAgICAgICAgICAgICAgICAgIHRoZW4gIFIudHlwZSA9ICdleHRlcm5hbCdcbiAgICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFIudHlwZSA9ICdtYWluJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgUiA9XG4gICAgICAgICAgICBjYWxsZWU6ICAgICAgICcnXG4gICAgICAgICAgICBwYXRoOiAgICAgICAgICcnXG4gICAgICAgICAgICBmb2xkZXJfcGF0aDogIGxpbmVcbiAgICAgICAgICAgIGZpbGVfbmFtZTogICAgJydcbiAgICAgICAgICAgIGxpbmVfbnI6ICAgICAgJydcbiAgICAgICAgICAgIGNvbHVtbl9ucjogICAgJydcbiAgICAgICAgICAgIHR5cGU6ICAgICAgICAgJ3VucGFyc2FibGUnXG4gICAgICAgIHJldHVybiBSXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZm9ybWF0X2xpbmU6ICggbGluZSApIC0+XG4gICAgICAgIHsgc3RhY2tfaW5mbyxcbiAgICAgICAgICBzb3VyY2VfcmVmZXJlbmNlLCAgIH0gPSBAX2Zvcm1hdF9zb3VyY2VfcmVmZXJlbmNlIGxpbmVcbiAgICAgICAgY29udGV4dCA9IGlmIEBjZmcuY29udGV4dCBpcyBmYWxzZSB0aGVuIFtdIGVsc2UgQF9nZXRfY29udGV4dCBzdGFja19pbmZvXG4gICAgICAgIHJldHVybiBbIHNvdXJjZV9yZWZlcmVuY2UsIGNvbnRleHQuLi4sIF0uam9pbiAnXFxuJ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9mb3JtYXRfc291cmNlX3JlZmVyZW5jZTogKCBsaW5lICkgLT5cbiAgICAgICAgc3RhY2tfaW5mbyAgICAgID0gQHBhcnNlX2xpbmUgbGluZVxuICAgICAgICB0aGVtZSAgICAgICAgICAgPSBAY2ZnLmNvbG9yWyBzdGFja19pbmZvLnR5cGUgXVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZvbGRlcl9wYXRoICAgICA9IHRoZW1lLmZvbGRlcl9wYXRoICArICcgJyAgICArIHN0YWNrX2luZm8uZm9sZGVyX3BhdGggICsgJycgICAgICsgdGhlbWUucmVzZXRcbiAgICAgICAgZmlsZV9uYW1lICAgICAgID0gdGhlbWUuZmlsZV9uYW1lICAgICsgJycgICAgICsgc3RhY2tfaW5mby5maWxlX25hbWUgICAgKyAnICcgICAgKyB0aGVtZS5yZXNldFxuICAgICAgICBsaW5lX25yICAgICAgICAgPSB0aGVtZS5saW5lX25yICAgICAgKyAnICgnICAgKyBzdGFja19pbmZvLmxpbmVfbnIgICAgICArICcnICAgICArIHRoZW1lLnJlc2V0XG4gICAgICAgIGNvbHVtbl9uciAgICAgICA9IHRoZW1lLmNvbHVtbl9uciAgICArICc6JyAgICArIHN0YWNrX2luZm8uY29sdW1uX25yICAgICsgJykgJyAgICsgdGhlbWUucmVzZXRcbiAgICAgICAgY2FsbGVlICAgICAgICAgID0gdGhlbWUuY2FsbGVlICAgICAgICsgJyAjICcgICsgc3RhY2tfaW5mby5jYWxsZWUgICAgICAgKyAnKCkgJyAgKyB0aGVtZS5yZXNldFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHBhdGhfbGVuZ3RoICAgICA9ICggc3RyaXBfYW5zaSBmb2xkZXJfcGF0aCArIGZpbGVfbmFtZSArIGxpbmVfbnIgKyBjb2x1bW5fbnIgICkubGVuZ3RoXG4gICAgICAgIGNhbGxlZV9sZW5ndGggICA9ICggc3RyaXBfYW5zaSBjYWxsZWUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkubGVuZ3RoXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcGF0aF9sZW5ndGggICAgID0gTWF0aC5tYXggMCwgQGNmZy5wYWRkaW5nLnBhdGggICAgLSAgIHBhdGhfbGVuZ3RoXG4gICAgICAgIGNhbGxlZV9sZW5ndGggICA9IE1hdGgubWF4IDAsIEBjZmcucGFkZGluZy5jYWxsZWUgIC0gY2FsbGVlX2xlbmd0aFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHBhZGRpbmdfcGF0aCAgICA9IHRoZW1lLmZvbGRlcl9wYXRoICsgKCAnICcucmVwZWF0ICAgIHBhdGhfbGVuZ3RoICkgKyB0aGVtZS5yZXNldFxuICAgICAgICBwYWRkaW5nX2NhbGxlZSAgPSB0aGVtZS5jYWxsZWUgICAgICArICggJyAnLnJlcGVhdCAgY2FsbGVlX2xlbmd0aCApICsgdGhlbWUucmVzZXRcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBzb3VyY2VfcmVmZXJlbmNlICA9IGZvbGRlcl9wYXRoICsgZmlsZV9uYW1lICsgbGluZV9uciArIGNvbHVtbl9uciArIHBhZGRpbmdfcGF0aCArIGNhbGxlZSArIHBhZGRpbmdfY2FsbGVlXG4gICAgICAgIHJldHVybiB7IHN0YWNrX2luZm8sIHNvdXJjZV9yZWZlcmVuY2UsIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X2NvbnRleHQ6ICggc3RhY2tfaW5mbyApIC0+XG4gICAgICAgIHJldHVybiBbXSBpZiAoIHN0YWNrX2luZm8udHlwZSBpbiBbICdpbnRlcm5hbCcsICd1bnBhcnNhYmxlJywgXSApIG9yICggc3RhY2tfaW5mby5wYXRoIGlzICcnIClcbiAgICAgICAgdHJ5XG4gICAgICAgICAgc291cmNlID0gRlMucmVhZEZpbGVTeW5jIHN0YWNrX2luZm8ucGF0aCwgeyBlbmNvZGluZzogJ3V0Zi04JywgfVxuICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgIHRocm93IGVycm9yIHVubGVzcyBlcnJvci5jb2RlIGlzICdFTk9FTlQnXG4gICAgICAgICAgcmV0dXJuIFsgXCJ1bmFibGUgdG8gcmVhZCBmaWxlICN7cnByIHN0YWNrX2luZm8ucGF0aH1cIiwgXVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHRoZW1lICAgICA9IEBjZmcuY29sb3JbIHN0YWNrX2luZm8udHlwZSBdXG4gICAgICAgIHJlZl93aWR0aCA9IDdcbiAgICAgICAgd2lkdGggICAgID0gQGNmZy5wYWRkaW5nLnBhdGggKyBAY2ZnLnBhZGRpbmcuY2FsbGVlIC0gcmVmX3dpZHRoXG4gICAgICAgIHNvdXJjZSAgICA9IHNvdXJjZS5zcGxpdCAnXFxuJ1xuICAgICAgICBoaXRfaWR4ICAgPSBzdGFja19pbmZvLmxpbmVfbnIgLSAxXG4gICAgICAgICMgcmV0dXJuIHNvdXJjZVsgaGl0X2lkeCBdIGlmIEBjZmcuY29udGV4dCA8IDFcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmaXJzdF9pZHggPSBNYXRoLm1heCAoIGhpdF9pZHggLSBAY2ZnLmNvbnRleHQgKSwgMFxuICAgICAgICBsYXN0X2lkeCAgPSBNYXRoLm1pbiAoIGhpdF9pZHggKyBAY2ZnLmNvbnRleHQgKSwgc291cmNlLmxlbmd0aCAtIDFcbiAgICAgICAgUiAgICAgICAgID0gW11cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmb3IgaWR4IGluIFsgZmlyc3RfaWR4IC4uIGxhc3RfaWR4IF1cbiAgICAgICAgICBsaW5lICAgICAgPSBzb3VyY2VbIGlkeCBdXG4gICAgICAgICAgcmVmZXJlbmNlID0gdGhlbWUucmVmZXJlbmNlICsgKCBcIiN7aWR4ICsgMX0gXCIucGFkU3RhcnQgcmVmX3dpZHRoLCAnICcgKVxuICAgICAgICAgIGlmICggaWR4IGlzIGhpdF9pZHggKVxuICAgICAgICAgICAgYmVmb3JlICAgID0gbGluZVsgLi4uIHN0YWNrX2luZm8uY29sdW1uX25yIC0gMSAgICBdXG4gICAgICAgICAgICBzcG90ICAgICAgPSBsaW5lWyAgICAgc3RhY2tfaW5mby5jb2x1bW5fbnIgLSAxIC4uIF1cbiAgICAgICAgICAgIGJlaGluZCAgICA9ICcgJy5yZXBlYXQgTWF0aC5tYXggMCwgbGluZS5sZW5ndGggLSB3aWR0aFxuICAgICAgICAgICAgUi5wdXNoIHJlZmVyZW5jZSArIHRoZW1lLmhpdCArIGJlZm9yZSArIHRoZW1lLnNwb3QgKyBzcG90ICsgdGhlbWUuaGl0ICsgYmVoaW5kICsgdGhlbWUucmVzZXRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBsaW5lICAgICAgPSBsaW5lLnBhZEVuZCB3aWR0aCwgJyAnXG4gICAgICAgICAgICBSLnB1c2ggcmVmZXJlbmNlICsgdGhlbWUuY29udGV4dCAgKyBsaW5lICsgdGhlbWUucmVzZXRcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gUlxuXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IGRvID0+XG4gICAgICBmb3JtYXRfc3RhY2sgPSBuZXcgRm9ybWF0X3N0YWNrKClcbiAgICAgIHJldHVybiB7IGZvcm1hdF9zdGFjaywgRm9ybWF0X3N0YWNrLCBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIEJSSUNTXG5cbiJdfQ==
//# sourceURL=../src/unstable-brics.coffee