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
            case 'text':
              stack = error_or_stack;
              break;
            default:
              throw new Error(`Ω___4 expected an error or a text, got a ${type}`);
          }
          lines = (stack.split('\n')).reverse();
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
          context = this._get_context(stack_info);
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
          var R, before, behind, error, first_idx, hit_idx, i, idx, last_idx, line, match, ref, ref1, ref2, ref_width, reference, source, spot, spot_re, theme, width;
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
          spot_re = RegExp(`^(?<before>.{${stack_info.column_nr - 1}})(?<spot>\\w*)(?<behind>.*)$`);
//...................................................................................................
          for (idx = i = ref1 = first_idx, ref2 = last_idx; (ref1 <= ref2 ? i <= ref2 : i >= ref2); idx = ref1 <= ref2 ? ++i : --i) {
            line = source[idx].padEnd(width, ' ');
            reference = theme.reference + (`${idx + 1} `.padStart(ref_width, ' '));
            // reference = theme.reference + ( "#{idx + 1}│ ".padStart ref_width, ' ' )
            if ((idx === hit_idx) && ((match = line.match(spot_re)) != null)) {
              ({before, spot, behind} = match.groups);
              R.push(reference + theme.hit + before + theme.spot + spot + theme.hit + behind + theme.reset);
            } else {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxLQUFBO0lBQUE7d0JBQUE7Ozs7O0VBS0EsS0FBQSxHQUtFLENBQUE7Ozs7SUFBQSwwQkFBQSxFQUE0QixRQUFBLENBQUEsQ0FBQTtBQUM5QixVQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsb0JBQUEsRUFBQSxvQkFBQSxFQUFBLGlCQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLGlCQUFBLEVBQUEsc0JBQUEsRUFBQTtNQUFJLEdBQUEsR0FDRTtRQUFBLFdBQUEsRUFBZ0IsSUFBaEI7UUFDQSxNQUFBLEVBQWdCLElBRGhCO1FBRUEsTUFBQSxFQUFnQjtNQUZoQjtNQUdGLGlCQUFBLEdBQW9CLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUVaLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBRlksQ0FBQSxrQ0FBQSxDQUFBLENBTVosTUFBTSxDQUFDLE1BQVAsQ0FBYyxHQUFHLENBQUMsTUFBbEIsQ0FOWSxDQUFBLEVBQUEsQ0FBQSxFQVFmLEdBUmUsRUFKeEI7Ozs7O01BaUJJLEdBQUEsR0FBb0IsUUFBQSxDQUFFLENBQUYsQ0FBQTtBQUNsQixlQUFPLENBQUEsQ0FBQSxDQUFBLENBQTZCLENBQUUsT0FBTyxDQUFULENBQUEsS0FBZ0IsUUFBekMsR0FBQSxDQUFDLENBQUMsT0FBRixDQUFVLElBQVYsRUFBZ0IsS0FBaEIsQ0FBQSxHQUFBLE1BQUosQ0FBQSxDQUFBO0FBQ1AsZUFBTyxDQUFBLENBQUEsQ0FBRyxDQUFILENBQUE7TUFGVztNQUdwQixNQUFBLEdBQ0U7UUFBQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFBLHFCQUFBLFFBQW1DLE1BQW5DLENBQUEsQ0FBdEI7UUFDQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFB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QUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixLQUE5QjtBQS9WQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9uZXh0X2ZyZWVfZmlsZW5hbWU6IC0+XG4gICAgY2ZnID1cbiAgICAgIG1heF9yZXRyaWVzOiAgICA5OTk5XG4gICAgICBwcmVmaXg6ICAgICAgICAgJ34uJ1xuICAgICAgc3VmZml4OiAgICAgICAgICcuYnJpY2FicmFjLWNhY2hlJ1xuICAgIGNhY2hlX2ZpbGVuYW1lX3JlID0gLy8vXG4gICAgICBeXG4gICAgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5wcmVmaXh9IClcbiAgICAgICg/PGZpcnN0Pi4qKVxuICAgICAgXFwuXG4gICAgICAoPzxucj5bMC05XXs0fSlcbiAgICAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnN1ZmZpeH0gKVxuICAgICAgJFxuICAgICAgLy8vdlxuICAgICMgY2FjaGVfc3VmZml4X3JlID0gLy8vXG4gICAgIyAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnN1ZmZpeH0gKVxuICAgICMgICAkXG4gICAgIyAgIC8vL3ZcbiAgICBycHIgICAgICAgICAgICAgICA9ICggeCApIC0+XG4gICAgICByZXR1cm4gXCInI3t4LnJlcGxhY2UgLycvZywgXCJcXFxcJ1wiIGlmICggdHlwZW9mIHggKSBpcyAnc3RyaW5nJ30nXCJcbiAgICAgIHJldHVybiBcIiN7eH1cIlxuICAgIGVycm9ycyA9XG4gICAgICBUTVBfZXhoYXVzdGlvbl9lcnJvcjogY2xhc3MgVE1QX2V4aGF1c3Rpb25fZXJyb3IgZXh0ZW5kcyBFcnJvclxuICAgICAgVE1QX3ZhbGlkYXRpb25fZXJyb3I6IGNsYXNzIFRNUF92YWxpZGF0aW9uX2Vycm9yIGV4dGVuZHMgRXJyb3JcbiAgICBGUyAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpmcydcbiAgICBQQVRIICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpwYXRoJ1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZXhpc3RzID0gKCBwYXRoICkgLT5cbiAgICAgIHRyeSBGUy5zdGF0U3luYyBwYXRoIGNhdGNoIGVycm9yIHRoZW4gcmV0dXJuIGZhbHNlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZ2V0X25leHRfZmlsZW5hbWUgPSAoIHBhdGggKSAtPlxuICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdHlwZSBjaGVja2luZyAjIyNcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX3ZhbGlkYXRpb25fZXJyb3IgXCLOqV9fXzEgZXhwZWN0ZWQgYSB0ZXh0LCBnb3QgI3tycHIgcGF0aH1cIiB1bmxlc3MgKCB0eXBlb2YgcGF0aCApIGlzICdzdHJpbmcnXG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF92YWxpZGF0aW9uX2Vycm9yIFwizqlfX18yIGV4cGVjdGVkIGEgbm9uZW1wdHkgdGV4dCwgZ290ICN7cnByIHBhdGh9XCIgdW5sZXNzIHBhdGgubGVuZ3RoID4gMFxuICAgICAgZGlybmFtZSAgPSBQQVRILmRpcm5hbWUgcGF0aFxuICAgICAgYmFzZW5hbWUgPSBQQVRILmJhc2VuYW1lIHBhdGhcbiAgICAgIHVubGVzcyAoIG1hdGNoID0gYmFzZW5hbWUubWF0Y2ggY2FjaGVfZmlsZW5hbWVfcmUgKT9cbiAgICAgICAgcmV0dXJuIFBBVEguam9pbiBkaXJuYW1lLCBcIiN7Y2ZnLnByZWZpeH0je2Jhc2VuYW1lfS4wMDAxI3tjZmcuc3VmZml4fVwiXG4gICAgICB7IGZpcnN0LCBuciwgIH0gPSBtYXRjaC5ncm91cHNcbiAgICAgIG5yICAgICAgICAgICAgICA9IFwiI3soIHBhcnNlSW50IG5yLCAxMCApICsgMX1cIi5wYWRTdGFydCA0LCAnMCdcbiAgICAgIHBhdGggICAgICAgICAgICA9IGZpcnN0XG4gICAgICByZXR1cm4gUEFUSC5qb2luIGRpcm5hbWUsIFwiI3tjZmcucHJlZml4fSN7Zmlyc3R9LiN7bnJ9I3tjZmcuc3VmZml4fVwiXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBnZXRfbmV4dF9mcmVlX2ZpbGVuYW1lID0gKCBwYXRoICkgLT5cbiAgICAgIFIgICAgICAgICAgICAgPSBwYXRoXG4gICAgICBmYWlsdXJlX2NvdW50ID0gLTFcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgbG9vcFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZhaWx1cmVfY291bnQrK1xuICAgICAgICBpZiBmYWlsdXJlX2NvdW50ID4gY2ZnLm1heF9yZXRyaWVzXG4gICAgICAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX2V4aGF1c3Rpb25fZXJyb3IgXCLOqV9fXzMgdG9vIG1hbnkgKCN7ZmFpbHVyZV9jb3VudH0pIHJldHJpZXM7ICBwYXRoICN7cnByIFJ9IGV4aXN0c1wiXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgUiA9IGdldF9uZXh0X2ZpbGVuYW1lIFJcbiAgICAgICAgYnJlYWsgdW5sZXNzIGV4aXN0cyBSXG4gICAgICByZXR1cm4gUlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgIyBzd2FwX3N1ZmZpeCA9ICggcGF0aCwgc3VmZml4ICkgLT4gcGF0aC5yZXBsYWNlIGNhY2hlX3N1ZmZpeF9yZSwgc3VmZml4XG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgZ2V0X25leHRfZnJlZV9maWxlbmFtZSwgZ2V0X25leHRfZmlsZW5hbWUsIGV4aXN0cywgY2FjaGVfZmlsZW5hbWVfcmUsIGVycm9ycywgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2NvbW1hbmRfbGluZV90b29sczogLT5cbiAgICBDUCA9IHJlcXVpcmUgJ25vZGU6Y2hpbGRfcHJvY2VzcydcbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCA9ICggY29tbWFuZCwgaW5wdXQgKSAtPlxuICAgICAgcmV0dXJuICggQ1AuZXhlY1N5bmMgY29tbWFuZCwgeyBlbmNvZGluZzogJ3V0Zi04JywgaW5wdXQsIH0gKS5yZXBsYWNlIC9cXG4kL3MsICcnXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfd2NfbWF4X2xpbmVfbGVuZ3RoID0gKCB0ZXh0ICkgLT5cbiAgICAgICMjIyB0aHggdG8gaHR0cHM6Ly91bml4LnN0YWNrZXhjaGFuZ2UuY29tL2EvMjU4NTUxLzI4MDIwNCAjIyNcbiAgICAgIHJldHVybiBwYXJzZUludCAoIGdldF9jb21tYW5kX2xpbmVfcmVzdWx0ICd3YyAtLW1heC1saW5lLWxlbmd0aCcsIHRleHQgKSwgMTBcblxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9jb21tYW5kX2xpbmVfcmVzdWx0LCBnZXRfd2NfbWF4X2xpbmVfbGVuZ3RoLCB9XG5cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9wcm9ncmVzc19pbmRpY2F0b3JzOiAtPlxuICAgIHsgYW5zaV9jb2xvcnNfYW5kX2VmZmVjdHM6IEMsIH0gPSAoIHJlcXVpcmUgJy4vYW5zaS1icmljcycgKS5yZXF1aXJlX2Fuc2lfY29sb3JzX2FuZF9lZmZlY3RzKClcbiAgICBmZyAgPSBDLmdyZWVuXG4gICAgYmcgID0gQy5iZ19yZWRcbiAgICBmZzAgPSBDLmRlZmF1bHRcbiAgICBiZzAgPSBDLmJnX2RlZmF1bHRcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9wZXJjZW50YWdlX2JhciA9ICggcGVyY2VudGFnZSApIC0+XG4gICAgICAjIyMg8J+ugvCfroPwn66E8J+uhfCfroYg4paB4paC4paD4paE4paF4paG4paH4paIIOKWieKWiuKWi+KWjOKWjeKWjuKWj/Cfrofwn66I8J+uifCfrorwn66LIOKWkCDwn62wIPCfrbEg8J+tsiDwn62zIPCfrbQg8J+ttSDwn66AIPCfroEg8J+ttiDwn623IPCfrbgg8J+tuSDwn626IPCfrbsg8J+tvSDwn62+IPCfrbwg8J+tvyAjIyNcbiAgICAgIHBlcmNlbnRhZ2VfcnByICA9ICggTWF0aC5yb3VuZCBwZXJjZW50YWdlICkudG9TdHJpbmcoKS5wYWRTdGFydCAzXG4gICAgICBpZiBwZXJjZW50YWdlIGlzIG51bGwgb3IgcGVyY2VudGFnZSA8PSAwICB0aGVuIHJldHVybiBcIiN7cGVyY2VudGFnZV9ycHJ9ICXilpUgICAgICAgICAgICAg4paPXCJcbiAgICAgIGlmIHBlcmNlbnRhZ2UgPj0gMTAwICAgICAgICAgICAgICAgICAgICAgIHRoZW4gcmV0dXJuIFwiI3twZXJjZW50YWdlX3Jwcn0gJeKWleKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWj1wiXG4gICAgICBwZXJjZW50YWdlICAgICAgPSAoIE1hdGgucm91bmQgcGVyY2VudGFnZSAvIDEwMCAqIDEwNCApXG4gICAgICBSICAgICAgICAgICAgICAgPSAn4paIJy5yZXBlYXQgcGVyY2VudGFnZSAvLyA4XG4gICAgICBzd2l0Y2ggcGVyY2VudGFnZSAlJSA4XG4gICAgICAgIHdoZW4gMCB0aGVuIFIgKz0gJyAnXG4gICAgICAgIHdoZW4gMSB0aGVuIFIgKz0gJ+KWjydcbiAgICAgICAgd2hlbiAyIHRoZW4gUiArPSAn4paOJ1xuICAgICAgICB3aGVuIDMgdGhlbiBSICs9ICfilo0nXG4gICAgICAgIHdoZW4gNCB0aGVuIFIgKz0gJ+KWjCdcbiAgICAgICAgd2hlbiA1IHRoZW4gUiArPSAn4paLJ1xuICAgICAgICB3aGVuIDYgdGhlbiBSICs9ICfiloonXG4gICAgICAgIHdoZW4gNyB0aGVuIFIgKz0gJ+KWiSdcbiAgICAgIHJldHVybiBcIiN7cGVyY2VudGFnZV9ycHJ9ICXilpUje2ZnK2JnfSN7Ui5wYWRFbmQgMTN9I3tmZzArYmcwfeKWj1wiXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBob2xsb3dfcGVyY2VudGFnZV9iYXIgPSAoIG4gKSAtPlxuICAgICAgaWYgbiBpcyBudWxsIG9yIG4gPD0gMCAgdGhlbiByZXR1cm4gJyAgICAgICAgICAgICAnXG4gICAgICAjIGlmIG4gPj0gMTAwICAgICAgICAgICAgIHRoZW4gcmV0dXJuICfilpHilpHilpHilpHilpHilpHilpHilpHilpHilpHilpHilpHilpEnXG4gICAgICBpZiBuID49IDEwMCAgICAgICAgICAgICB0aGVuIHJldHVybiAn4paT4paT4paT4paT4paT4paT4paT4paT4paT4paT4paT4paT4paTJ1xuICAgICAgbiA9ICggTWF0aC5yb3VuZCBuIC8gMTAwICogMTA0IClcbiAgICAgICMgUiA9ICfilpEnLnJlcGVhdCBuIC8vIDhcbiAgICAgIFIgPSAn4paTJy5yZXBlYXQgbiAvLyA4XG4gICAgICBzd2l0Y2ggbiAlJSA4XG4gICAgICAgIHdoZW4gMCB0aGVuIFIgKz0gJyAnXG4gICAgICAgIHdoZW4gMSB0aGVuIFIgKz0gJ+KWjydcbiAgICAgICAgd2hlbiAyIHRoZW4gUiArPSAn4paOJ1xuICAgICAgICB3aGVuIDMgdGhlbiBSICs9ICfilo0nXG4gICAgICAgIHdoZW4gNCB0aGVuIFIgKz0gJ+KWjCdcbiAgICAgICAgd2hlbiA1IHRoZW4gUiArPSAn4paLJ1xuICAgICAgICB3aGVuIDYgdGhlbiBSICs9ICfiloonXG4gICAgICAgIHdoZW4gNyB0aGVuIFIgKz0gJ+KWiSdcbiAgICAgICAgIyB3aGVuIDggdGhlbiBSICs9ICfilognXG4gICAgICByZXR1cm4gUi5wYWRFbmQgMTNcblxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9wZXJjZW50YWdlX2JhciwgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Zvcm1hdF9zdGFjazogLT5cbiAgICB7IGFuc2lfY29sb3JzX2FuZF9lZmZlY3RzOiBDLCB9ID0gKCByZXF1aXJlICcuL2Fuc2ktYnJpY3MnICkucmVxdWlyZV9hbnNpX2NvbG9yc19hbmRfZWZmZWN0cygpXG4gICAgeyBzdHJpcF9hbnNpLCAgICAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi9hbnNpLWJyaWNzJyApLnJlcXVpcmVfc3RyaXBfYW5zaSgpXG4gICAgeyB0eXBlX29mLCAgICAgICAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi91bnN0YWJsZS1ycHItdHlwZV9vZi1icmljcycgKS5yZXF1aXJlX3R5cGVfb2YoKVxuICAgIHsgaGlkZSwgICAgICAgICAgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vdmFyaW91cy1icmljcycgKS5yZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHMoKVxuICAgIHsgc2hvd19ub19jb2xvcnM6IHJwciwgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vbWFpbicgKS51bnN0YWJsZS5yZXF1aXJlX3Nob3coKVxuICAgICMjIyBUQUlOVCBtYWtlIHVzZSBvZiBgRlNgIG9wdGlvbmFsIGxpa2UgYGdldF9yZWxhdGl2ZV9wYXRoKClgICMjI1xuICAgIEZTICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOmZzJ1xuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBtYWluX2MgICAgICAgICAgICAgICAgICAgID0ge31cbiAgICBtYWluX2MucmVzZXQgICAgICAgICAgICAgID0gQy5yZXNldCAjIEMuZGVmYXVsdCArIEMuYmdfZGVmYXVsdCAgKyBDLmJvbGQwXG4gICAgbWFpbl9jLmZvbGRlcl9wYXRoICAgICAgICA9IEMuYmxhY2sgICArIEMuYmdfbGltZSAgICAgKyBDLmJvbGRcbiAgICBtYWluX2MuZmlsZV9uYW1lICAgICAgICAgID0gQy53aW5lICAgICsgQy5iZ19saW1lICAgICArIEMuYm9sZFxuICAgIG1haW5fYy5jYWxsZWUgICAgICAgICAgICAgPSBDLmJsYWNrICAgKyBDLmJnX2xpbWUgICAgICsgQy5ib2xkXG4gICAgbWFpbl9jLmxpbmVfbnIgICAgICAgICAgICA9IEMuYmxhY2sgICArIEMuYmdfYmx1ZSAgICAgKyBDLmJvbGRcbiAgICBtYWluX2MuY29sdW1uX25yICAgICAgICAgID0gQy5ibGFjayAgICsgQy5iZ19ibHVlICAgICArIEMuYm9sZFxuICAgIG1haW5fYy5jb250ZXh0ICAgICAgICAgICAgPSBDLmxpZ2h0c2xhdGVncmF5ICArIEMuYmdfZGFya3NsYXRpc2hcbiAgICAjIG1haW5fYy5jb250ZXh0ICAgICAgICAgICAgPSBDLmxpZ2h0c2xhdGVncmF5ICArIEMuYmdfZGFya3NsYXRlZ3JheVxuICAgIG1haW5fYy5oaXQgICAgICAgICAgICAgICAgPSBDLndoaXRlICAgICAgICAgICArIEMuYmdfZGFya3NsYXRpc2ggKyBDLmJvbGRcbiAgICBtYWluX2Muc3BvdCAgICAgICAgICAgICAgID0gQy55ZWxsb3cgICAgICAgICAgICAgKyBDLmJnX3dpbmUgKyBDLmJvbGRcbiAgICAjIG1haW5fYy5oaXQgICAgICAgICAgICAgICAgPSBDLndoaXRlICAgICAgICAgICsgQy5iZ19mb3Jlc3QgKyBDLmJvbGRcbiAgICBtYWluX2MucmVmZXJlbmNlICAgICAgICAgID0gQy5saWdodHNsYXRlZ3JheSAgKyBDLmJnX2JsYWNrXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBleHRlcm5hbF9jICAgICAgICAgICAgICAgID0gT2JqZWN0LmNyZWF0ZSBtYWluX2NcbiAgICBleHRlcm5hbF9jLmZvbGRlcl9wYXRoICAgID0gQy5ibGFjayAgICsgQy5iZ195ZWxsb3cgICArIEMuYm9sZFxuICAgIGV4dGVybmFsX2MuZmlsZV9uYW1lICAgICAgPSBDLndpbmUgICAgKyBDLmJnX3llbGxvdyAgICsgQy5ib2xkXG4gICAgZXh0ZXJuYWxfYy5jYWxsZWUgICAgICAgICA9IEMuYmxhY2sgICArIEMuYmdfeWVsbG93ICAgKyBDLmJvbGRcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGRlcGVuZGVuY3lfYyAgICAgICAgICAgICAgPSBPYmplY3QuY3JlYXRlIG1haW5fY1xuICAgIGRlcGVuZGVuY3lfYy5mb2xkZXJfcGF0aCAgPSBDLmJsYWNrICAgKyBDLmJnX29ycGltZW50ICsgQy5ib2xkXG4gICAgZGVwZW5kZW5jeV9jLmZpbGVfbmFtZSAgICA9IEMud2luZSAgICArIEMuYmdfb3JwaW1lbnQgKyBDLmJvbGRcbiAgICBkZXBlbmRlbmN5X2MuY2FsbGVlICAgICAgID0gQy5ibGFjayAgICsgQy5iZ19vcnBpbWVudCArIEMuYm9sZFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgaW50ZXJuYWxfYyAgICAgICAgICAgICAgICA9IE9iamVjdC5jcmVhdGUgbWFpbl9jXG4gICAgaW50ZXJuYWxfYy5mb2xkZXJfcGF0aCAgICA9IEMuZ3JheSAgICArIEMuYmdfc2lsdmVyICAgKyBDLmJvbGRcbiAgICBpbnRlcm5hbF9jLmZpbGVfbmFtZSAgICAgID0gQy5ncmF5ICAgICsgQy5iZ19zaWx2ZXIgICArIEMuYm9sZFxuICAgIGludGVybmFsX2MubGluZV9uciAgICAgICAgPSBDLmdyYXkgICAgKyBDLmJnX3NpbHZlciAgICsgQy5ib2xkXG4gICAgaW50ZXJuYWxfYy5jb2x1bW5fbnIgICAgICA9IEMuZ3JheSAgICArIEMuYmdfc2lsdmVyICAgKyBDLmJvbGRcbiAgICBpbnRlcm5hbF9jLmNhbGxlZSAgICAgICAgID0gQy5ncmF5ICAgICsgQy5iZ19zaWx2ZXIgICArIEMuYm9sZFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgdW5wYXJzYWJsZV9jICAgICAgICAgICAgICA9IE9iamVjdC5jcmVhdGUgbWFpbl9jXG4gICAgdW5wYXJzYWJsZV9jLmZvbGRlcl9wYXRoICA9IEMuYmxhY2sgICArIEMuYmdfcmVkICAgICAgKyBDLmJvbGRcbiAgICB1bnBhcnNhYmxlX2MuZmlsZV9uYW1lICAgID0gQy5yZWQgICAgICsgQy5iZ19yZWQgICAgICArIEMuYm9sZFxuICAgIHVucGFyc2FibGVfYy5saW5lX25yICAgICAgPSBDLnJlZCAgICAgKyBDLmJnX3JlZCAgICAgICsgQy5ib2xkXG4gICAgdW5wYXJzYWJsZV9jLmNvbHVtbl9uciAgICA9IEMucmVkICAgICArIEMuYmdfcmVkICAgICAgKyBDLmJvbGRcbiAgICB1bnBhcnNhYmxlX2MuY2FsbGVlICAgICAgID0gQy5yZWQgICAgICsgQy5iZ19yZWQgICAgICArIEMuYm9sZFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgdGVtcGxhdGVzID1cbiAgICAgIGZvcm1hdF9zdGFjazpcbiAgICAgICAgcmVsYXRpdmU6ICAgICAgIHRydWUgIyBib29sZWFuIHRvIHVzZSBDV0QsIG9yIHNwZWNpZnkgcmVmZXJlbmNlIHBhdGhcbiAgICAgICAgY29udGV4dDogICAgICAgIDJcbiAgICAgICAgcGFkZGluZzpcbiAgICAgICAgICBwYXRoOiAgICAgICAgICAgOTBcbiAgICAgICAgICBjYWxsZWU6ICAgICAgICAgNjBcbiAgICAgICAgY29sb3I6XG4gICAgICAgICAgbWFpbjogICAgICAgICAgIG1haW5fY1xuICAgICAgICAgIGludGVybmFsOiAgICAgICBpbnRlcm5hbF9jXG4gICAgICAgICAgZXh0ZXJuYWw6ICAgICAgIGV4dGVybmFsX2NcbiAgICAgICAgICBkZXBlbmRlbmN5OiAgICAgZGVwZW5kZW5jeV9jXG4gICAgICAgICAgdW5wYXJzYWJsZTogICAgIHVucGFyc2FibGVfY1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzdGFja19saW5lX3JlID0gLy8vIF5cbiAgICAgIFxccyogYXQgXFxzK1xuICAgICAgKD86XG4gICAgICAgICg/PGNhbGxlZT4gLio/ICAgIClcbiAgICAgICAgXFxzKyBcXChcbiAgICAgICAgKT9cbiAgICAgICg/PHBhdGg+ICAgICAgKD88Zm9sZGVyX3BhdGg+IC4qPyApICg/PGZpbGVfbmFtZT4gW14gXFwvIF0rICkgICkgOlxuICAgICAgKD88bGluZV9ucj4gICBcXGQrICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6XG4gICAgICAoPzxjb2x1bW5fbnI+IFxcZCsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICBcXCk/XG4gICAgICAkIC8vLztcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW50ZXJuYWxzID0gT2JqZWN0LmZyZWV6ZSB7IHRlbXBsYXRlcywgfVxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBGb3JtYXRfc3RhY2tcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKCBjZmcgKSAtPlxuICAgICAgICBAY2ZnID0geyB0ZW1wbGF0ZXMuZm9ybWF0X3N0YWNrLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgbWUgPSAoIFAuLi4gKSA9PiBAZm9ybWF0IFAuLi5cbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mIG1lLCBAXG4gICAgICAgIGhpZGUgQCwgJ2dldF9yZWxhdGl2ZV9wYXRoJywgZG8gPT5cbiAgICAgICAgICB0cnkgUEFUSCA9IHJlcXVpcmUgJ25vZGU6cGF0aCcgY2F0Y2ggZXJyb3IgdGhlbiByZXR1cm4gbnVsbFxuICAgICAgICAgIHJldHVybiBQQVRILnJlbGF0aXZlLmJpbmQgUEFUSFxuICAgICAgICBoaWRlIEAsICdzdGF0ZScsIHsgY2FjaGU6IG5ldyBNYXAoKSwgfVxuICAgICAgICByZXR1cm4gbWVcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmb3JtYXQ6ICggZXJyb3Jfb3Jfc3RhY2sgKSAtPlxuICAgICAgICAjIyMgVEFJTlQgdXNlIHByb3BlciB2YWxpZGF0aW9uICMjI1xuICAgICAgICBzd2l0Y2ggdHlwZSA9IHR5cGVfb2YgZXJyb3Jfb3Jfc3RhY2tcbiAgICAgICAgICB3aGVuICdlcnJvcicgIHRoZW4gc3RhY2sgPSBlcnJvcl9vcl9zdGFjay5zdGFja1xuICAgICAgICAgIHdoZW4gJ3RleHQnICAgdGhlbiBzdGFjayA9IGVycm9yX29yX3N0YWNrXG4gICAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzQgZXhwZWN0ZWQgYW4gZXJyb3Igb3IgYSB0ZXh0LCBnb3QgYSAje3R5cGV9XCJcbiAgICAgICAgbGluZXMgPSAoIHN0YWNrLnNwbGl0ICdcXG4nICkucmV2ZXJzZSgpXG4gICAgICAgIHJldHVybiAoICggQGZvcm1hdF9saW5lIGxpbmUgKSBmb3IgbGluZSBpbiBsaW5lcyApLmpvaW4gJ1xcbidcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBwYXJzZV9saW5lOiAoIGxpbmUgKSAtPlxuICAgICAgICAjIyMgVEFJTlQgdXNlIHByb3BlciB2YWxpZGF0aW9uICMjI1xuICAgICAgICB1bmxlc3MgKCB0eXBlID0gdHlwZV9vZiBsaW5lICkgaXMgJ3RleHQnXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX181IGV4cGVjdGVkIGEgdGV4dCwgZ290IGEgI3t0eXBlfVwiXG4gICAgICAgIGlmICggJ1xcbicgaW4gbGluZSApXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX182IGV4cGVjdGVkIGEgc2luZ2xlIGxpbmUsIGdvdCBhIHRleHQgd2l0aCBsaW5lIGJyZWFrc1wiXG4gICAgICAgIGlmICggbWF0Y2ggPSBsaW5lLm1hdGNoIHN0YWNrX2xpbmVfcmUgKT9cbiAgICAgICAgICBSICAgICAgICAgICA9IHsgbWF0Y2guZ3JvdXBzLi4uLCB9XG4gICAgICAgICAgaXNfaW50ZXJuYWwgPSBSLnBhdGguc3RhcnRzV2l0aCAnbm9kZTonXG4gICAgICAgICAgUi5jYWxsZWUgICA/PSAnW2Fub255bW91c10nXG4gICAgICAgICAgUi5saW5lX25yICAgPSBwYXJzZUludCBSLmxpbmVfbnIsICAgMTBcbiAgICAgICAgICBSLmNvbHVtbl9uciA9IHBhcnNlSW50IFIuY29sdW1uX25yLCAxMFxuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgaWYgQGdldF9yZWxhdGl2ZV9wYXRoPyBhbmQgKCBub3QgaXNfaW50ZXJuYWwgKSBhbmQgKCBAY2ZnLnJlbGF0aXZlIGlzbnQgZmFsc2UgKVxuICAgICAgICAgICAgcmVmZXJlbmNlICAgICA9IGlmICggQGNmZy5yZWxhdGl2ZSBpcyB0cnVlICkgdGhlbiBwcm9jZXNzLmN3ZCgpIGVsc2UgQGNmZy5yZWxhdGl2ZVxuICAgICAgICAgICAgUi5wYXRoICAgICAgICA9ICggQGdldF9yZWxhdGl2ZV9wYXRoIHJlZmVyZW5jZSwgUi5wYXRoICAgICAgICApXG4gICAgICAgICAgICBSLmZvbGRlcl9wYXRoID0gKCBAZ2V0X3JlbGF0aXZlX3BhdGggcmVmZXJlbmNlLCBSLmZvbGRlcl9wYXRoICkgKyAnLydcbiAgICAgICAgICAgICMgUi5wYXRoICAgICAgICA9ICcuLycgKyBSLnBhdGggICAgICAgIHVubGVzcyBSLnBhdGhbIDAgXSAgICAgICAgIGluICcuLydcbiAgICAgICAgICAgICMgUi5mb2xkZXJfcGF0aCA9ICcuLycgKyBSLmZvbGRlcl9wYXRoIHVubGVzcyBSLmZvbGRlcl9wYXRoWyAwIF0gIGluICcuLydcbiAgICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAgIHN3aXRjaCB0cnVlXG4gICAgICAgICAgICB3aGVuIGlzX2ludGVybmFsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVuICBSLnR5cGUgPSAnaW50ZXJuYWwnXG4gICAgICAgICAgICB3aGVuIC9cXGJub2RlX21vZHVsZXNcXC8vLnRlc3QgUi5wYXRoICAgICAgICAgICAgIHRoZW4gIFIudHlwZSA9ICdkZXBlbmRlbmN5J1xuICAgICAgICAgICAgd2hlbiBSLnBhdGguc3RhcnRzV2l0aCAnLi4vJyAgICAgICAgICAgICAgICAgICAgdGhlbiAgUi50eXBlID0gJ2V4dGVybmFsJ1xuICAgICAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUi50eXBlID0gJ21haW4nXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBSID1cbiAgICAgICAgICAgIGNhbGxlZTogICAgICAgJydcbiAgICAgICAgICAgIHBhdGg6ICAgICAgICAgJydcbiAgICAgICAgICAgIGZvbGRlcl9wYXRoOiAgbGluZVxuICAgICAgICAgICAgZmlsZV9uYW1lOiAgICAnJ1xuICAgICAgICAgICAgbGluZV9ucjogICAgICAnJ1xuICAgICAgICAgICAgY29sdW1uX25yOiAgICAnJ1xuICAgICAgICAgICAgdHlwZTogICAgICAgICAndW5wYXJzYWJsZSdcbiAgICAgICAgcmV0dXJuIFJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmb3JtYXRfbGluZTogKCBsaW5lICkgLT5cbiAgICAgICAgeyBzdGFja19pbmZvLFxuICAgICAgICAgIHNvdXJjZV9yZWZlcmVuY2UsICAgfSA9IEBfZm9ybWF0X3NvdXJjZV9yZWZlcmVuY2UgbGluZVxuICAgICAgICBjb250ZXh0ID0gQF9nZXRfY29udGV4dCBzdGFja19pbmZvXG4gICAgICAgIHJldHVybiBbIHNvdXJjZV9yZWZlcmVuY2UsIGNvbnRleHQuLi4sIF0uam9pbiAnXFxuJ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9mb3JtYXRfc291cmNlX3JlZmVyZW5jZTogKCBsaW5lICkgLT5cbiAgICAgICAgc3RhY2tfaW5mbyAgICAgID0gQHBhcnNlX2xpbmUgbGluZVxuICAgICAgICB0aGVtZSAgICAgICAgICAgPSBAY2ZnLmNvbG9yWyBzdGFja19pbmZvLnR5cGUgXVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZvbGRlcl9wYXRoICAgICA9IHRoZW1lLmZvbGRlcl9wYXRoICArICcgJyAgICArIHN0YWNrX2luZm8uZm9sZGVyX3BhdGggICsgJycgICAgICsgdGhlbWUucmVzZXRcbiAgICAgICAgZmlsZV9uYW1lICAgICAgID0gdGhlbWUuZmlsZV9uYW1lICAgICsgJycgICAgICsgc3RhY2tfaW5mby5maWxlX25hbWUgICAgKyAnICcgICAgKyB0aGVtZS5yZXNldFxuICAgICAgICBsaW5lX25yICAgICAgICAgPSB0aGVtZS5saW5lX25yICAgICAgKyAnICgnICAgKyBzdGFja19pbmZvLmxpbmVfbnIgICAgICArICcnICAgICArIHRoZW1lLnJlc2V0XG4gICAgICAgIGNvbHVtbl9uciAgICAgICA9IHRoZW1lLmNvbHVtbl9uciAgICArICc6JyAgICArIHN0YWNrX2luZm8uY29sdW1uX25yICAgICsgJykgJyAgICsgdGhlbWUucmVzZXRcbiAgICAgICAgY2FsbGVlICAgICAgICAgID0gdGhlbWUuY2FsbGVlICAgICAgICsgJyAjICcgICsgc3RhY2tfaW5mby5jYWxsZWUgICAgICAgKyAnKCkgJyAgKyB0aGVtZS5yZXNldFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHBhdGhfbGVuZ3RoICAgICA9ICggc3RyaXBfYW5zaSBmb2xkZXJfcGF0aCArIGZpbGVfbmFtZSArIGxpbmVfbnIgKyBjb2x1bW5fbnIgICkubGVuZ3RoXG4gICAgICAgIGNhbGxlZV9sZW5ndGggICA9ICggc3RyaXBfYW5zaSBjYWxsZWUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkubGVuZ3RoXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcGF0aF9sZW5ndGggICAgID0gTWF0aC5tYXggMCwgQGNmZy5wYWRkaW5nLnBhdGggICAgLSAgIHBhdGhfbGVuZ3RoXG4gICAgICAgIGNhbGxlZV9sZW5ndGggICA9IE1hdGgubWF4IDAsIEBjZmcucGFkZGluZy5jYWxsZWUgIC0gY2FsbGVlX2xlbmd0aFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHBhZGRpbmdfcGF0aCAgICA9IHRoZW1lLmZvbGRlcl9wYXRoICsgKCAnICcucmVwZWF0ICAgIHBhdGhfbGVuZ3RoICkgKyB0aGVtZS5yZXNldFxuICAgICAgICBwYWRkaW5nX2NhbGxlZSAgPSB0aGVtZS5jYWxsZWUgICAgICArICggJyAnLnJlcGVhdCAgY2FsbGVlX2xlbmd0aCApICsgdGhlbWUucmVzZXRcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBzb3VyY2VfcmVmZXJlbmNlICA9IGZvbGRlcl9wYXRoICsgZmlsZV9uYW1lICsgbGluZV9uciArIGNvbHVtbl9uciArIHBhZGRpbmdfcGF0aCArIGNhbGxlZSArIHBhZGRpbmdfY2FsbGVlXG4gICAgICAgIHJldHVybiB7IHN0YWNrX2luZm8sIHNvdXJjZV9yZWZlcmVuY2UsIH1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X2NvbnRleHQ6ICggc3RhY2tfaW5mbyApIC0+XG4gICAgICAgIHJldHVybiBbXSBpZiAoIHN0YWNrX2luZm8udHlwZSBpbiBbICdpbnRlcm5hbCcsICd1bnBhcnNhYmxlJywgXSApIG9yICggc3RhY2tfaW5mby5wYXRoIGlzICcnIClcbiAgICAgICAgdHJ5XG4gICAgICAgICAgc291cmNlID0gRlMucmVhZEZpbGVTeW5jIHN0YWNrX2luZm8ucGF0aCwgeyBlbmNvZGluZzogJ3V0Zi04JywgfVxuICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgIHRocm93IGVycm9yIHVubGVzcyBlcnJvci5jb2RlIGlzICdFTk9FTlQnXG4gICAgICAgICAgcmV0dXJuIFsgXCJ1bmFibGUgdG8gcmVhZCBmaWxlICN7cnByIHN0YWNrX2luZm8ucGF0aH1cIiwgXVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHRoZW1lICAgICA9IEBjZmcuY29sb3JbIHN0YWNrX2luZm8udHlwZSBdXG4gICAgICAgIHJlZl93aWR0aCA9IDdcbiAgICAgICAgd2lkdGggICAgID0gQGNmZy5wYWRkaW5nLnBhdGggKyBAY2ZnLnBhZGRpbmcuY2FsbGVlIC0gcmVmX3dpZHRoXG4gICAgICAgIHNvdXJjZSAgICA9IHNvdXJjZS5zcGxpdCAnXFxuJ1xuICAgICAgICBoaXRfaWR4ICAgPSBzdGFja19pbmZvLmxpbmVfbnIgLSAxXG4gICAgICAgICMgcmV0dXJuIHNvdXJjZVsgaGl0X2lkeCBdIGlmIEBjZmcuY29udGV4dCA8IDFcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmaXJzdF9pZHggPSBNYXRoLm1heCAoIGhpdF9pZHggLSBAY2ZnLmNvbnRleHQgKSwgMFxuICAgICAgICBsYXN0X2lkeCAgPSBNYXRoLm1pbiAoIGhpdF9pZHggKyBAY2ZnLmNvbnRleHQgKSwgc291cmNlLmxlbmd0aCAtIDFcbiAgICAgICAgUiAgICAgICAgID0gW11cbiAgICAgICAgc3BvdF9yZSAgID0gLy8vIF4gKD88YmVmb3JlPi57I3tzdGFja19pbmZvLmNvbHVtbl9uciAtIDF9fSApICg/PHNwb3Q+IFxcdyogKSAoPzxiZWhpbmQ+IC4qICkgJC8vL1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZvciBpZHggaW4gWyBmaXJzdF9pZHggLi4gbGFzdF9pZHggXVxuICAgICAgICAgIGxpbmUgICAgICA9IHNvdXJjZVsgaWR4IF0ucGFkRW5kIHdpZHRoLCAnICdcbiAgICAgICAgICByZWZlcmVuY2UgPSB0aGVtZS5yZWZlcmVuY2UgKyAoIFwiI3tpZHggKyAxfSBcIi5wYWRTdGFydCByZWZfd2lkdGgsICcgJyApXG4gICAgICAgICAgIyByZWZlcmVuY2UgPSB0aGVtZS5yZWZlcmVuY2UgKyAoIFwiI3tpZHggKyAxfeKUgiBcIi5wYWRTdGFydCByZWZfd2lkdGgsICcgJyApXG4gICAgICAgICAgaWYgKCBpZHggaXMgaGl0X2lkeCApIGFuZCAoIG1hdGNoID0gbGluZS5tYXRjaCBzcG90X3JlICk/XG4gICAgICAgICAgICB7IGJlZm9yZSwgc3BvdCwgYmVoaW5kLCB9ID0gbWF0Y2guZ3JvdXBzXG4gICAgICAgICAgICBSLnB1c2ggcmVmZXJlbmNlICsgdGhlbWUuaGl0ICsgYmVmb3JlICsgdGhlbWUuc3BvdCArIHNwb3QgKyB0aGVtZS5oaXQgKyBiZWhpbmQgKyB0aGVtZS5yZXNldFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIFIucHVzaCByZWZlcmVuY2UgKyB0aGVtZS5jb250ZXh0ICArIGxpbmUgKyB0aGVtZS5yZXNldFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBSXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0gZG8gPT5cbiAgICAgIGZvcm1hdF9zdGFjayA9IG5ldyBGb3JtYXRfc3RhY2soKVxuICAgICAgcmV0dXJuIHsgZm9ybWF0X3N0YWNrLCBGb3JtYXRfc3RhY2ssIGludGVybmFscywgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgQlJJQ1NcblxuIl19
//# sourceURL=../src/unstable-brics.coffee