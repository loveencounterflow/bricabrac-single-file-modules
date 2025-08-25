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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxLQUFBO0lBQUE7d0JBQUE7Ozs7O0VBS0EsS0FBQSxHQUtFLENBQUE7Ozs7SUFBQSwwQkFBQSxFQUE0QixRQUFBLENBQUEsQ0FBQTtBQUM5QixVQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsb0JBQUEsRUFBQSxvQkFBQSxFQUFBLGlCQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLGlCQUFBLEVBQUEsc0JBQUEsRUFBQTtNQUFJLEdBQUEsR0FDRTtRQUFBLFdBQUEsRUFBZ0IsSUFBaEI7UUFDQSxNQUFBLEVBQWdCLElBRGhCO1FBRUEsTUFBQSxFQUFnQjtNQUZoQjtNQUdGLGlCQUFBLEdBQW9CLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUVaLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBRlksQ0FBQSxrQ0FBQSxDQUFBLENBTVosTUFBTSxDQUFDLE1BQVAsQ0FBYyxHQUFHLENBQUMsTUFBbEIsQ0FOWSxDQUFBLEVBQUEsQ0FBQSxFQVFmLEdBUmUsRUFKeEI7Ozs7O01BaUJJLEdBQUEsR0FBb0IsUUFBQSxDQUFFLENBQUYsQ0FBQTtBQUNsQixlQUFPLENBQUEsQ0FBQSxDQUFBLENBQTZCLENBQUUsT0FBTyxDQUFULENBQUEsS0FBZ0IsUUFBekMsR0FBQSxDQUFDLENBQUMsT0FBRixDQUFVLElBQVYsRUFBZ0IsS0FBaEIsQ0FBQSxHQUFBLE1BQUosQ0FBQSxDQUFBO0FBQ1AsZUFBTyxDQUFBLENBQUEsQ0FBRyxDQUFILENBQUE7TUFGVztNQUdwQixNQUFBLEdBQ0U7UUFBQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFBLHFCQUFBLFFBQW1DLE1BQW5DLENBQUEsQ0FBdEI7UUFDQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFB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c291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5CUklDUyA9XG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX25leHRfZnJlZV9maWxlbmFtZTogLT5cbiAgICBjZmcgPVxuICAgICAgbWF4X3JldHJpZXM6ICAgIDk5OTlcbiAgICAgIHByZWZpeDogICAgICAgICAnfi4nXG4gICAgICBzdWZmaXg6ICAgICAgICAgJy5icmljYWJyYWMtY2FjaGUnXG4gICAgY2FjaGVfZmlsZW5hbWVfcmUgPSAvLy9cbiAgICAgIF5cbiAgICAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnByZWZpeH0gKVxuICAgICAgKD88Zmlyc3Q+LiopXG4gICAgICBcXC5cbiAgICAgICg/PG5yPlswLTldezR9KVxuICAgICAgKD86ICN7UmVnRXhwLmVzY2FwZSBjZmcuc3VmZml4fSApXG4gICAgICAkXG4gICAgICAvLy92XG4gICAgIyBjYWNoZV9zdWZmaXhfcmUgPSAvLy9cbiAgICAjICAgKD86ICN7UmVnRXhwLmVzY2FwZSBjZmcuc3VmZml4fSApXG4gICAgIyAgICRcbiAgICAjICAgLy8vdlxuICAgIHJwciAgICAgICAgICAgICAgID0gKCB4ICkgLT5cbiAgICAgIHJldHVybiBcIicje3gucmVwbGFjZSAvJy9nLCBcIlxcXFwnXCIgaWYgKCB0eXBlb2YgeCApIGlzICdzdHJpbmcnfSdcIlxuICAgICAgcmV0dXJuIFwiI3t4fVwiXG4gICAgZXJyb3JzID1cbiAgICAgIFRNUF9leGhhdXN0aW9uX2Vycm9yOiBjbGFzcyBUTVBfZXhoYXVzdGlvbl9lcnJvciBleHRlbmRzIEVycm9yXG4gICAgICBUTVBfdmFsaWRhdGlvbl9lcnJvcjogY2xhc3MgVE1QX3ZhbGlkYXRpb25fZXJyb3IgZXh0ZW5kcyBFcnJvclxuICAgIEZTICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOmZzJ1xuICAgIFBBVEggICAgICAgICAgPSByZXF1aXJlICdub2RlOnBhdGgnXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBleGlzdHMgPSAoIHBhdGggKSAtPlxuICAgICAgdHJ5IEZTLnN0YXRTeW5jIHBhdGggY2F0Y2ggZXJyb3IgdGhlbiByZXR1cm4gZmFsc2VcbiAgICAgIHJldHVybiB0cnVlXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBnZXRfbmV4dF9maWxlbmFtZSA9ICggcGF0aCApIC0+XG4gICAgICAjIyMgVEFJTlQgdXNlIHByb3BlciB0eXBlIGNoZWNraW5nICMjI1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5UTVBfdmFsaWRhdGlvbl9lcnJvciBcIs6pX19fMSBleHBlY3RlZCBhIHRleHQsIGdvdCAje3JwciBwYXRofVwiIHVubGVzcyAoIHR5cGVvZiBwYXRoICkgaXMgJ3N0cmluZydcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX3ZhbGlkYXRpb25fZXJyb3IgXCLOqV9fXzIgZXhwZWN0ZWQgYSBub25lbXB0eSB0ZXh0LCBnb3QgI3tycHIgcGF0aH1cIiB1bmxlc3MgcGF0aC5sZW5ndGggPiAwXG4gICAgICBkaXJuYW1lICA9IFBBVEguZGlybmFtZSBwYXRoXG4gICAgICBiYXNlbmFtZSA9IFBBVEguYmFzZW5hbWUgcGF0aFxuICAgICAgdW5sZXNzICggbWF0Y2ggPSBiYXNlbmFtZS5tYXRjaCBjYWNoZV9maWxlbmFtZV9yZSApP1xuICAgICAgICByZXR1cm4gUEFUSC5qb2luIGRpcm5hbWUsIFwiI3tjZmcucHJlZml4fSN7YmFzZW5hbWV9LjAwMDEje2NmZy5zdWZmaXh9XCJcbiAgICAgIHsgZmlyc3QsIG5yLCAgfSA9IG1hdGNoLmdyb3Vwc1xuICAgICAgbnIgICAgICAgICAgICAgID0gXCIjeyggcGFyc2VJbnQgbnIsIDEwICkgKyAxfVwiLnBhZFN0YXJ0IDQsICcwJ1xuICAgICAgcGF0aCAgICAgICAgICAgID0gZmlyc3RcbiAgICAgIHJldHVybiBQQVRILmpvaW4gZGlybmFtZSwgXCIje2NmZy5wcmVmaXh9I3tmaXJzdH0uI3tucn0je2NmZy5zdWZmaXh9XCJcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGdldF9uZXh0X2ZyZWVfZmlsZW5hbWUgPSAoIHBhdGggKSAtPlxuICAgICAgUiAgICAgICAgICAgICA9IHBhdGhcbiAgICAgIGZhaWx1cmVfY291bnQgPSAtMVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBsb29wXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZmFpbHVyZV9jb3VudCsrXG4gICAgICAgIGlmIGZhaWx1cmVfY291bnQgPiBjZmcubWF4X3JldHJpZXNcbiAgICAgICAgICAgdGhyb3cgbmV3IGVycm9ycy5UTVBfZXhoYXVzdGlvbl9lcnJvciBcIs6pX19fMyB0b28gbWFueSAoI3tmYWlsdXJlX2NvdW50fSkgcmV0cmllczsgIHBhdGggI3tycHIgUn0gZXhpc3RzXCJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBSID0gZ2V0X25leHRfZmlsZW5hbWUgUlxuICAgICAgICBicmVhayB1bmxlc3MgZXhpc3RzIFJcbiAgICAgIHJldHVybiBSXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAjIHN3YXBfc3VmZml4ID0gKCBwYXRoLCBzdWZmaXggKSAtPiBwYXRoLnJlcGxhY2UgY2FjaGVfc3VmZml4X3JlLCBzdWZmaXhcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBnZXRfbmV4dF9mcmVlX2ZpbGVuYW1lLCBnZXRfbmV4dF9maWxlbmFtZSwgZXhpc3RzLCBjYWNoZV9maWxlbmFtZV9yZSwgZXJyb3JzLCB9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfY29tbWFuZF9saW5lX3Rvb2xzOiAtPlxuICAgIENQID0gcmVxdWlyZSAnbm9kZTpjaGlsZF9wcm9jZXNzJ1xuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9jb21tYW5kX2xpbmVfcmVzdWx0ID0gKCBjb21tYW5kLCBpbnB1dCApIC0+XG4gICAgICByZXR1cm4gKCBDUC5leGVjU3luYyBjb21tYW5kLCB7IGVuY29kaW5nOiAndXRmLTgnLCBpbnB1dCwgfSApLnJlcGxhY2UgL1xcbiQvcywgJydcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF93Y19tYXhfbGluZV9sZW5ndGggPSAoIHRleHQgKSAtPlxuICAgICAgIyMjIHRoeCB0byBodHRwczovL3VuaXguc3RhY2tleGNoYW5nZS5jb20vYS8yNTg1NTEvMjgwMjA0ICMjI1xuICAgICAgcmV0dXJuIHBhcnNlSW50ICggZ2V0X2NvbW1hbmRfbGluZV9yZXN1bHQgJ3djIC0tbWF4LWxpbmUtbGVuZ3RoJywgdGV4dCApLCAxMFxuXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgZ2V0X2NvbW1hbmRfbGluZV9yZXN1bHQsIGdldF93Y19tYXhfbGluZV9sZW5ndGgsIH1cblxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX3Byb2dyZXNzX2luZGljYXRvcnM6IC0+XG4gICAgeyBhbnNpX2NvbG9yc19hbmRfZWZmZWN0czogQywgfSA9ICggcmVxdWlyZSAnLi9hbnNpLWJyaWNzJyApLnJlcXVpcmVfYW5zaV9jb2xvcnNfYW5kX2VmZmVjdHMoKVxuICAgIGZnICA9IEMuZ3JlZW5cbiAgICBiZyAgPSBDLmJnX3JlZFxuICAgIGZnMCA9IEMuZGVmYXVsdFxuICAgIGJnMCA9IEMuYmdfZGVmYXVsdFxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X3BlcmNlbnRhZ2VfYmFyID0gKCBwZXJjZW50YWdlICkgLT5cbiAgICAgICMjIyDwn66C8J+ug/CfroTwn66F8J+uhiDiloHiloLiloPiloTiloXilobilofilogg4paJ4paK4paL4paM4paN4paO4paP8J+uh/Cfrojwn66J8J+uivCfrosg4paQIPCfrbAg8J+tsSDwn62yIPCfrbMg8J+ttCDwn621IPCfroAg8J+ugSDwn622IPCfrbcg8J+tuCDwn625IPCfrbog8J+tuyDwn629IPCfrb4g8J+tvCDwn62/ICMjI1xuICAgICAgcGVyY2VudGFnZV9ycHIgID0gKCBNYXRoLnJvdW5kIHBlcmNlbnRhZ2UgKS50b1N0cmluZygpLnBhZFN0YXJ0IDNcbiAgICAgIGlmIHBlcmNlbnRhZ2UgaXMgbnVsbCBvciBwZXJjZW50YWdlIDw9IDAgIHRoZW4gcmV0dXJuIFwiI3twZXJjZW50YWdlX3Jwcn0gJeKWlSAgICAgICAgICAgICDilo9cIlxuICAgICAgaWYgcGVyY2VudGFnZSA+PSAxMDAgICAgICAgICAgICAgICAgICAgICAgdGhlbiByZXR1cm4gXCIje3BlcmNlbnRhZ2VfcnByfSAl4paV4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paPXCJcbiAgICAgIHBlcmNlbnRhZ2UgICAgICA9ICggTWF0aC5yb3VuZCBwZXJjZW50YWdlIC8gMTAwICogMTA0IClcbiAgICAgIFIgICAgICAgICAgICAgICA9ICfilognLnJlcGVhdCBwZXJjZW50YWdlIC8vIDhcbiAgICAgIHN3aXRjaCBwZXJjZW50YWdlICUlIDhcbiAgICAgICAgd2hlbiAwIHRoZW4gUiArPSAnICdcbiAgICAgICAgd2hlbiAxIHRoZW4gUiArPSAn4paPJ1xuICAgICAgICB3aGVuIDIgdGhlbiBSICs9ICfilo4nXG4gICAgICAgIHdoZW4gMyB0aGVuIFIgKz0gJ+KWjSdcbiAgICAgICAgd2hlbiA0IHRoZW4gUiArPSAn4paMJ1xuICAgICAgICB3aGVuIDUgdGhlbiBSICs9ICfilosnXG4gICAgICAgIHdoZW4gNiB0aGVuIFIgKz0gJ+KWiidcbiAgICAgICAgd2hlbiA3IHRoZW4gUiArPSAn4paJJ1xuICAgICAgcmV0dXJuIFwiI3twZXJjZW50YWdlX3Jwcn0gJeKWlSN7ZmcrYmd9I3tSLnBhZEVuZCAxM30je2ZnMCtiZzB94paPXCJcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhvbGxvd19wZXJjZW50YWdlX2JhciA9ICggbiApIC0+XG4gICAgICBpZiBuIGlzIG51bGwgb3IgbiA8PSAwICB0aGVuIHJldHVybiAnICAgICAgICAgICAgICdcbiAgICAgICMgaWYgbiA+PSAxMDAgICAgICAgICAgICAgdGhlbiByZXR1cm4gJ+KWkeKWkeKWkeKWkeKWkeKWkeKWkeKWkeKWkeKWkeKWkeKWkeKWkSdcbiAgICAgIGlmIG4gPj0gMTAwICAgICAgICAgICAgIHRoZW4gcmV0dXJuICfilpPilpPilpPilpPilpPilpPilpPilpPilpPilpPilpPilpPilpMnXG4gICAgICBuID0gKCBNYXRoLnJvdW5kIG4gLyAxMDAgKiAxMDQgKVxuICAgICAgIyBSID0gJ+KWkScucmVwZWF0IG4gLy8gOFxuICAgICAgUiA9ICfilpMnLnJlcGVhdCBuIC8vIDhcbiAgICAgIHN3aXRjaCBuICUlIDhcbiAgICAgICAgd2hlbiAwIHRoZW4gUiArPSAnICdcbiAgICAgICAgd2hlbiAxIHRoZW4gUiArPSAn4paPJ1xuICAgICAgICB3aGVuIDIgdGhlbiBSICs9ICfilo4nXG4gICAgICAgIHdoZW4gMyB0aGVuIFIgKz0gJ+KWjSdcbiAgICAgICAgd2hlbiA0IHRoZW4gUiArPSAn4paMJ1xuICAgICAgICB3aGVuIDUgdGhlbiBSICs9ICfilosnXG4gICAgICAgIHdoZW4gNiB0aGVuIFIgKz0gJ+KWiidcbiAgICAgICAgd2hlbiA3IHRoZW4gUiArPSAn4paJJ1xuICAgICAgICAjIHdoZW4gOCB0aGVuIFIgKz0gJ+KWiCdcbiAgICAgIHJldHVybiBSLnBhZEVuZCAxM1xuXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgZ2V0X3BlcmNlbnRhZ2VfYmFyLCB9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfZm9ybWF0X3N0YWNrOiAtPlxuICAgIHsgYW5zaV9jb2xvcnNfYW5kX2VmZmVjdHM6IEMsIH0gPSAoIHJlcXVpcmUgJy4vYW5zaS1icmljcycgKS5yZXF1aXJlX2Fuc2lfY29sb3JzX2FuZF9lZmZlY3RzKClcbiAgICB7IHN0cmlwX2Fuc2ksICAgICAgICAgICAgICAgICB9ID0gKCByZXF1aXJlICcuL2Fuc2ktYnJpY3MnICkucmVxdWlyZV9zdHJpcF9hbnNpKClcbiAgICB7IHR5cGVfb2YsICAgICAgICAgICAgICAgICAgICB9ID0gKCByZXF1aXJlICcuL3Vuc3RhYmxlLXJwci10eXBlX29mLWJyaWNzJyApLnJlcXVpcmVfdHlwZV9vZigpXG4gICAgeyBoaWRlLCAgICAgICAgICAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi92YXJpb3VzLWJyaWNzJyApLnJlcXVpcmVfbWFuYWdlZF9wcm9wZXJ0eV90b29scygpXG4gICAgeyBzaG93X25vX2NvbG9yczogcnByLCAgICAgICAgfSA9ICggcmVxdWlyZSAnLi9tYWluJyApLnVuc3RhYmxlLnJlcXVpcmVfc2hvdygpXG4gICAgIyMjIFRBSU5UIG1ha2UgdXNlIG9mIGBGU2Agb3B0aW9uYWwgbGlrZSBgZ2V0X3JlbGF0aXZlX3BhdGgoKWAgIyMjXG4gICAgRlMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6ZnMnXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIG1haW5fYyAgICAgICAgICAgICAgICAgICAgPSB7fVxuICAgIG1haW5fYy5yZXNldCAgICAgICAgICAgICAgPSBDLnJlc2V0ICMgQy5kZWZhdWx0ICsgQy5iZ19kZWZhdWx0ICArIEMuYm9sZDBcbiAgICBtYWluX2MuZm9sZGVyX3BhdGggICAgICAgID0gQy5ibGFjayAgICsgQy5iZ19saW1lICAgICArIEMuYm9sZFxuICAgIG1haW5fYy5maWxlX25hbWUgICAgICAgICAgPSBDLndpbmUgICAgKyBDLmJnX2xpbWUgICAgICsgQy5ib2xkXG4gICAgbWFpbl9jLmNhbGxlZSAgICAgICAgICAgICA9IEMuYmxhY2sgICArIEMuYmdfbGltZSAgICAgKyBDLmJvbGRcbiAgICBtYWluX2MubGluZV9uciAgICAgICAgICAgID0gQy5ibGFjayAgICsgQy5iZ19ibHVlICAgICArIEMuYm9sZFxuICAgIG1haW5fYy5jb2x1bW5fbnIgICAgICAgICAgPSBDLmJsYWNrICAgKyBDLmJnX2JsdWUgICAgICsgQy5ib2xkXG4gICAgbWFpbl9jLmNvbnRleHQgICAgICAgICAgICA9IEMubGlnaHRzbGF0ZWdyYXkgICsgQy5iZ19kYXJrc2xhdGlzaFxuICAgICMgbWFpbl9jLmNvbnRleHQgICAgICAgICAgICA9IEMubGlnaHRzbGF0ZWdyYXkgICsgQy5iZ19kYXJrc2xhdGVncmF5XG4gICAgbWFpbl9jLmhpdCAgICAgICAgICAgICAgICA9IEMud2hpdGUgICAgICAgICAgICsgQy5iZ19kYXJrc2xhdGlzaCArIEMuYm9sZFxuICAgIG1haW5fYy5zcG90ICAgICAgICAgICAgICAgPSBDLnllbGxvdyAgICAgICAgICAgICArIEMuYmdfd2luZSArIEMuYm9sZFxuICAgICMgbWFpbl9jLmhpdCAgICAgICAgICAgICAgICA9IEMud2hpdGUgICAgICAgICAgKyBDLmJnX2ZvcmVzdCArIEMuYm9sZFxuICAgIG1haW5fYy5yZWZlcmVuY2UgICAgICAgICAgPSBDLmxpZ2h0c2xhdGVncmF5ICArIEMuYmdfYmxhY2tcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGV4dGVybmFsX2MgICAgICAgICAgICAgICAgPSBPYmplY3QuY3JlYXRlIG1haW5fY1xuICAgIGV4dGVybmFsX2MuZm9sZGVyX3BhdGggICAgPSBDLmJsYWNrICAgKyBDLmJnX3llbGxvdyAgICsgQy5ib2xkXG4gICAgZXh0ZXJuYWxfYy5maWxlX25hbWUgICAgICA9IEMud2luZSAgICArIEMuYmdfeWVsbG93ICAgKyBDLmJvbGRcbiAgICBleHRlcm5hbF9jLmNhbGxlZSAgICAgICAgID0gQy5ibGFjayAgICsgQy5iZ195ZWxsb3cgICArIEMuYm9sZFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZGVwZW5kZW5jeV9jICAgICAgICAgICAgICA9IE9iamVjdC5jcmVhdGUgbWFpbl9jXG4gICAgZGVwZW5kZW5jeV9jLmZvbGRlcl9wYXRoICA9IEMuYmxhY2sgICArIEMuYmdfb3JwaW1lbnQgKyBDLmJvbGRcbiAgICBkZXBlbmRlbmN5X2MuZmlsZV9uYW1lICAgID0gQy53aW5lICAgICsgQy5iZ19vcnBpbWVudCArIEMuYm9sZFxuICAgIGRlcGVuZGVuY3lfYy5jYWxsZWUgICAgICAgPSBDLmJsYWNrICAgKyBDLmJnX29ycGltZW50ICsgQy5ib2xkXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBpbnRlcm5hbF9jICAgICAgICAgICAgICAgID0gT2JqZWN0LmNyZWF0ZSBtYWluX2NcbiAgICBpbnRlcm5hbF9jLmZvbGRlcl9wYXRoICAgID0gQy5ncmF5ICAgICsgQy5iZ19zaWx2ZXIgICArIEMuYm9sZFxuICAgIGludGVybmFsX2MuZmlsZV9uYW1lICAgICAgPSBDLmdyYXkgICAgKyBDLmJnX3NpbHZlciAgICsgQy5ib2xkXG4gICAgaW50ZXJuYWxfYy5saW5lX25yICAgICAgICA9IEMuZ3JheSAgICArIEMuYmdfc2lsdmVyICAgKyBDLmJvbGRcbiAgICBpbnRlcm5hbF9jLmNvbHVtbl9uciAgICAgID0gQy5ncmF5ICAgICsgQy5iZ19zaWx2ZXIgICArIEMuYm9sZFxuICAgIGludGVybmFsX2MuY2FsbGVlICAgICAgICAgPSBDLmdyYXkgICAgKyBDLmJnX3NpbHZlciAgICsgQy5ib2xkXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICB1bnBhcnNhYmxlX2MgICAgICAgICAgICAgID0gT2JqZWN0LmNyZWF0ZSBtYWluX2NcbiAgICB1bnBhcnNhYmxlX2MuZm9sZGVyX3BhdGggID0gQy5ibGFjayAgICsgQy5iZ19yZWQgICAgICArIEMuYm9sZFxuICAgIHVucGFyc2FibGVfYy5maWxlX25hbWUgICAgPSBDLnJlZCAgICAgKyBDLmJnX3JlZCAgICAgICsgQy5ib2xkXG4gICAgdW5wYXJzYWJsZV9jLmxpbmVfbnIgICAgICA9IEMucmVkICAgICArIEMuYmdfcmVkICAgICAgKyBDLmJvbGRcbiAgICB1bnBhcnNhYmxlX2MuY29sdW1uX25yICAgID0gQy5yZWQgICAgICsgQy5iZ19yZWQgICAgICArIEMuYm9sZFxuICAgIHVucGFyc2FibGVfYy5jYWxsZWUgICAgICAgPSBDLnJlZCAgICAgKyBDLmJnX3JlZCAgICAgICsgQy5ib2xkXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICB0ZW1wbGF0ZXMgPVxuICAgICAgZm9ybWF0X3N0YWNrOlxuICAgICAgICByZWxhdGl2ZTogICAgICAgdHJ1ZSAjIGJvb2xlYW4gdG8gdXNlIENXRCwgb3Igc3BlY2lmeSByZWZlcmVuY2UgcGF0aFxuICAgICAgICBjb250ZXh0OiAgICAgICAgMlxuICAgICAgICBwYWRkaW5nOlxuICAgICAgICAgIHBhdGg6ICAgICAgICAgICA5MFxuICAgICAgICAgIGNhbGxlZTogICAgICAgICA2MFxuICAgICAgICBjb2xvcjpcbiAgICAgICAgICBtYWluOiAgICAgICAgICAgbWFpbl9jXG4gICAgICAgICAgaW50ZXJuYWw6ICAgICAgIGludGVybmFsX2NcbiAgICAgICAgICBleHRlcm5hbDogICAgICAgZXh0ZXJuYWxfY1xuICAgICAgICAgIGRlcGVuZGVuY3k6ICAgICBkZXBlbmRlbmN5X2NcbiAgICAgICAgICB1bnBhcnNhYmxlOiAgICAgdW5wYXJzYWJsZV9jXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHN0YWNrX2xpbmVfcmUgPSAvLy8gXlxuICAgICAgXFxzKiBhdCBcXHMrXG4gICAgICAoPzpcbiAgICAgICAgKD88Y2FsbGVlPiAuKj8gICAgKVxuICAgICAgICBcXHMrIFxcKFxuICAgICAgICApP1xuICAgICAgKD88cGF0aD4gICAgICAoPzxmb2xkZXJfcGF0aD4gLio/ICkgKD88ZmlsZV9uYW1lPiBbXiBcXC8gXSsgKSAgKSA6XG4gICAgICAoPzxsaW5lX25yPiAgIFxcZCsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDpcbiAgICAgICg/PGNvbHVtbl9ucj4gXFxkKyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgIFxcKT9cbiAgICAgICQgLy8vO1xuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIHsgdGVtcGxhdGVzLCB9XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIEZvcm1hdF9zdGFja1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGNmZyApIC0+XG4gICAgICAgIEBjZmcgPSB7IHRlbXBsYXRlcy5mb3JtYXRfc3RhY2suLi4sIGNmZy4uLiwgfVxuICAgICAgICBtZSA9ICggUC4uLiApID0+IEBmb3JtYXQgUC4uLlxuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YgbWUsIEBcbiAgICAgICAgaGlkZSBALCAnZ2V0X3JlbGF0aXZlX3BhdGgnLCBkbyA9PlxuICAgICAgICAgIHRyeSBQQVRIID0gcmVxdWlyZSAnbm9kZTpwYXRoJyBjYXRjaCBlcnJvciB0aGVuIHJldHVybiBudWxsXG4gICAgICAgICAgcmV0dXJuIFBBVEgucmVsYXRpdmUuYmluZCBQQVRIXG4gICAgICAgIGhpZGUgQCwgJ3N0YXRlJywgeyBjYWNoZTogbmV3IE1hcCgpLCB9XG4gICAgICAgIHJldHVybiBtZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZvcm1hdDogKCBlcnJvcl9vcl9zdGFjayApIC0+XG4gICAgICAgICMjIyBUQUlOVCB1c2UgcHJvcGVyIHZhbGlkYXRpb24gIyMjXG4gICAgICAgIHN3aXRjaCB0eXBlID0gdHlwZV9vZiBlcnJvcl9vcl9zdGFja1xuICAgICAgICAgIHdoZW4gJ2Vycm9yJyAgdGhlbiBzdGFjayA9IGVycm9yX29yX3N0YWNrLnN0YWNrXG4gICAgICAgICAgd2hlbiAndGV4dCcgICB0aGVuIHN0YWNrID0gZXJyb3Jfb3Jfc3RhY2tcbiAgICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvciBcIs6pX19fNCBleHBlY3RlZCBhbiBlcnJvciBvciBhIHRleHQsIGdvdCBhICN7dHlwZX1cIlxuICAgICAgICBsaW5lcyA9ICggc3RhY2suc3BsaXQgJ1xcbicgKS5yZXZlcnNlKClcbiAgICAgICAgcmV0dXJuICggKCBAZm9ybWF0X2xpbmUgbGluZSApIGZvciBsaW5lIGluIGxpbmVzICkuam9pbiAnXFxuJ1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHBhcnNlX2xpbmU6ICggbGluZSApIC0+XG4gICAgICAgICMjIyBUQUlOVCB1c2UgcHJvcGVyIHZhbGlkYXRpb24gIyMjXG4gICAgICAgIHVubGVzcyAoIHR5cGUgPSB0eXBlX29mIGxpbmUgKSBpcyAndGV4dCdcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzUgZXhwZWN0ZWQgYSB0ZXh0LCBnb3QgYSAje3R5cGV9XCJcbiAgICAgICAgaWYgKCAnXFxuJyBpbiBsaW5lIClcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzYgZXhwZWN0ZWQgYSBzaW5nbGUgbGluZSwgZ290IGEgdGV4dCB3aXRoIGxpbmUgYnJlYWtzXCJcbiAgICAgICAgaWYgKCBtYXRjaCA9IGxpbmUubWF0Y2ggc3RhY2tfbGluZV9yZSApP1xuICAgICAgICAgIFIgICAgICAgICAgID0geyBtYXRjaC5ncm91cHMuLi4sIH1cbiAgICAgICAgICBpc19pbnRlcm5hbCA9IFIucGF0aC5zdGFydHNXaXRoICdub2RlOidcbiAgICAgICAgICBSLmNhbGxlZSAgID89ICdbYW5vbnltb3VzXSdcbiAgICAgICAgICBSLmxpbmVfbnIgICA9IHBhcnNlSW50IFIubGluZV9uciwgICAxMFxuICAgICAgICAgIFIuY29sdW1uX25yID0gcGFyc2VJbnQgUi5jb2x1bW5fbnIsIDEwXG4gICAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgICBpZiBAZ2V0X3JlbGF0aXZlX3BhdGg/IGFuZCAoIG5vdCBpc19pbnRlcm5hbCApIGFuZCAoIEBjZmcucmVsYXRpdmUgaXNudCBmYWxzZSApXG4gICAgICAgICAgICByZWZlcmVuY2UgICAgID0gaWYgKCBAY2ZnLnJlbGF0aXZlIGlzIHRydWUgKSB0aGVuIHByb2Nlc3MuY3dkKCkgZWxzZSBAY2ZnLnJlbGF0aXZlXG4gICAgICAgICAgICBSLnBhdGggICAgICAgID0gKCBAZ2V0X3JlbGF0aXZlX3BhdGggcmVmZXJlbmNlLCBSLnBhdGggICAgICAgIClcbiAgICAgICAgICAgIFIuZm9sZGVyX3BhdGggPSAoIEBnZXRfcmVsYXRpdmVfcGF0aCByZWZlcmVuY2UsIFIuZm9sZGVyX3BhdGggKSArICcvJ1xuICAgICAgICAgICAgIyBSLnBhdGggICAgICAgID0gJy4vJyArIFIucGF0aCAgICAgICAgdW5sZXNzIFIucGF0aFsgMCBdICAgICAgICAgaW4gJy4vJ1xuICAgICAgICAgICAgIyBSLmZvbGRlcl9wYXRoID0gJy4vJyArIFIuZm9sZGVyX3BhdGggdW5sZXNzIFIuZm9sZGVyX3BhdGhbIDAgXSAgaW4gJy4vJ1xuICAgICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICAgc3dpdGNoIHRydWVcbiAgICAgICAgICAgIHdoZW4gaXNfaW50ZXJuYWwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW4gIFIudHlwZSA9ICdpbnRlcm5hbCdcbiAgICAgICAgICAgIHdoZW4gL1xcYm5vZGVfbW9kdWxlc1xcLy8udGVzdCBSLnBhdGggICAgICAgICAgICAgdGhlbiAgUi50eXBlID0gJ2RlcGVuZGVuY3knXG4gICAgICAgICAgICB3aGVuIFIucGF0aC5zdGFydHNXaXRoICcuLi8nICAgICAgICAgICAgICAgICAgICB0aGVuICBSLnR5cGUgPSAnZXh0ZXJuYWwnXG4gICAgICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSLnR5cGUgPSAnbWFpbidcbiAgICAgICAgZWxzZVxuICAgICAgICAgIFIgPVxuICAgICAgICAgICAgY2FsbGVlOiAgICAgICAnJ1xuICAgICAgICAgICAgcGF0aDogICAgICAgICAnJ1xuICAgICAgICAgICAgZm9sZGVyX3BhdGg6ICBsaW5lXG4gICAgICAgICAgICBmaWxlX25hbWU6ICAgICcnXG4gICAgICAgICAgICBsaW5lX25yOiAgICAgICcnXG4gICAgICAgICAgICBjb2x1bW5fbnI6ICAgICcnXG4gICAgICAgICAgICB0eXBlOiAgICAgICAgICd1bnBhcnNhYmxlJ1xuICAgICAgICByZXR1cm4gUlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZvcm1hdF9saW5lOiAoIGxpbmUgKSAtPlxuICAgICAgICB7IHN0YWNrX2luZm8sXG4gICAgICAgICAgc291cmNlX3JlZmVyZW5jZSwgICB9ID0gQF9mb3JtYXRfc291cmNlX3JlZmVyZW5jZSBsaW5lXG4gICAgICAgIGNvbnRleHQgPSBAX2dldF9jb250ZXh0IHN0YWNrX2luZm9cbiAgICAgICAgcmV0dXJuIFsgc291cmNlX3JlZmVyZW5jZSwgY29udGV4dC4uLiwgXS5qb2luICdcXG4nXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2Zvcm1hdF9zb3VyY2VfcmVmZXJlbmNlOiAoIGxpbmUgKSAtPlxuICAgICAgICBzdGFja19pbmZvICAgICAgPSBAcGFyc2VfbGluZSBsaW5lXG4gICAgICAgIHRoZW1lICAgICAgICAgICA9IEBjZmcuY29sb3JbIHN0YWNrX2luZm8udHlwZSBdXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZm9sZGVyX3BhdGggICAgID0gdGhlbWUuZm9sZGVyX3BhdGggICsgJyAnICAgICsgc3RhY2tfaW5mby5mb2xkZXJfcGF0aCAgKyAnJyAgICAgKyB0aGVtZS5yZXNldFxuICAgICAgICBmaWxlX25hbWUgICAgICAgPSB0aGVtZS5maWxlX25hbWUgICAgKyAnJyAgICAgKyBzdGFja19pbmZvLmZpbGVfbmFtZSAgICArICcgJyAgICArIHRoZW1lLnJlc2V0XG4gICAgICAgIGxpbmVfbnIgICAgICAgICA9IHRoZW1lLmxpbmVfbnIgICAgICArICcgKCcgICArIHN0YWNrX2luZm8ubGluZV9uciAgICAgICsgJycgICAgICsgdGhlbWUucmVzZXRcbiAgICAgICAgY29sdW1uX25yICAgICAgID0gdGhlbWUuY29sdW1uX25yICAgICsgJzonICAgICsgc3RhY2tfaW5mby5jb2x1bW5fbnIgICAgKyAnKSAnICAgKyB0aGVtZS5yZXNldFxuICAgICAgICBjYWxsZWUgICAgICAgICAgPSB0aGVtZS5jYWxsZWUgICAgICAgKyAnICMgJyAgKyBzdGFja19pbmZvLmNhbGxlZSAgICAgICArICcoKSAnICArIHRoZW1lLnJlc2V0XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcGF0aF9sZW5ndGggICAgID0gKCBzdHJpcF9hbnNpIGZvbGRlcl9wYXRoICsgZmlsZV9uYW1lICsgbGluZV9uciArIGNvbHVtbl9uciAgKS5sZW5ndGhcbiAgICAgICAgY2FsbGVlX2xlbmd0aCAgID0gKCBzdHJpcF9hbnNpIGNhbGxlZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKS5sZW5ndGhcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBwYXRoX2xlbmd0aCAgICAgPSBNYXRoLm1heCAwLCBAY2ZnLnBhZGRpbmcucGF0aCAgICAtICAgcGF0aF9sZW5ndGhcbiAgICAgICAgY2FsbGVlX2xlbmd0aCAgID0gTWF0aC5tYXggMCwgQGNmZy5wYWRkaW5nLmNhbGxlZSAgLSBjYWxsZWVfbGVuZ3RoXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcGFkZGluZ19wYXRoICAgID0gdGhlbWUuZm9sZGVyX3BhdGggKyAoICcgJy5yZXBlYXQgICAgcGF0aF9sZW5ndGggKSArIHRoZW1lLnJlc2V0XG4gICAgICAgIHBhZGRpbmdfY2FsbGVlICA9IHRoZW1lLmNhbGxlZSAgICAgICsgKCAnICcucmVwZWF0ICBjYWxsZWVfbGVuZ3RoICkgKyB0aGVtZS5yZXNldFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHNvdXJjZV9yZWZlcmVuY2UgID0gZm9sZGVyX3BhdGggKyBmaWxlX25hbWUgKyBsaW5lX25yICsgY29sdW1uX25yICsgcGFkZGluZ19wYXRoICsgY2FsbGVlICsgcGFkZGluZ19jYWxsZWVcbiAgICAgICAgcmV0dXJuIHsgc3RhY2tfaW5mbywgc291cmNlX3JlZmVyZW5jZSwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfY29udGV4dDogKCBzdGFja19pbmZvICkgLT5cbiAgICAgICAgcmV0dXJuIFtdIGlmICggc3RhY2tfaW5mby50eXBlIGluIFsgJ2ludGVybmFsJywgJ3VucGFyc2FibGUnLCBdICkgb3IgKCBzdGFja19pbmZvLnBhdGggaXMgJycgKVxuICAgICAgICB0cnlcbiAgICAgICAgICBzb3VyY2UgPSBGUy5yZWFkRmlsZVN5bmMgc3RhY2tfaW5mby5wYXRoLCB7IGVuY29kaW5nOiAndXRmLTgnLCB9XG4gICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgdGhyb3cgZXJyb3IgdW5sZXNzIGVycm9yLmNvZGUgaXMgJ0VOT0VOVCdcbiAgICAgICAgICByZXR1cm4gWyBcInVuYWJsZSB0byByZWFkIGZpbGUgI3tycHIgc3RhY2tfaW5mby5wYXRofVwiLCBdXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgdGhlbWUgICAgID0gQGNmZy5jb2xvclsgc3RhY2tfaW5mby50eXBlIF1cbiAgICAgICAgcmVmX3dpZHRoID0gN1xuICAgICAgICB3aWR0aCAgICAgPSBAY2ZnLnBhZGRpbmcucGF0aCArIEBjZmcucGFkZGluZy5jYWxsZWUgLSByZWZfd2lkdGhcbiAgICAgICAgc291cmNlICAgID0gc291cmNlLnNwbGl0ICdcXG4nXG4gICAgICAgIGhpdF9pZHggICA9IHN0YWNrX2luZm8ubGluZV9uciAtIDFcbiAgICAgICAgIyByZXR1cm4gc291cmNlWyBoaXRfaWR4IF0gaWYgQGNmZy5jb250ZXh0IDwgMVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZpcnN0X2lkeCA9IE1hdGgubWF4ICggaGl0X2lkeCAtIEBjZmcuY29udGV4dCApLCAwXG4gICAgICAgIGxhc3RfaWR4ICA9IE1hdGgubWluICggaGl0X2lkeCArIEBjZmcuY29udGV4dCApLCBzb3VyY2UubGVuZ3RoIC0gMVxuICAgICAgICBSICAgICAgICAgPSBbXVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZvciBpZHggaW4gWyBmaXJzdF9pZHggLi4gbGFzdF9pZHggXVxuICAgICAgICAgIGxpbmUgICAgICA9IHNvdXJjZVsgaWR4IF1cbiAgICAgICAgICByZWZlcmVuY2UgPSB0aGVtZS5yZWZlcmVuY2UgKyAoIFwiI3tpZHggKyAxfSBcIi5wYWRTdGFydCByZWZfd2lkdGgsICcgJyApXG4gICAgICAgICAgaWYgKCBpZHggaXMgaGl0X2lkeCApXG4gICAgICAgICAgICBiZWZvcmUgICAgPSBsaW5lWyAuLi4gc3RhY2tfaW5mby5jb2x1bW5fbnIgLSAxICAgIF1cbiAgICAgICAgICAgIHNwb3QgICAgICA9IGxpbmVbICAgICBzdGFja19pbmZvLmNvbHVtbl9uciAtIDEgLi4gXVxuICAgICAgICAgICAgYmVoaW5kICAgID0gJyAnLnJlcGVhdCBNYXRoLm1heCAwLCBsaW5lLmxlbmd0aCAtIHdpZHRoXG4gICAgICAgICAgICBSLnB1c2ggcmVmZXJlbmNlICsgdGhlbWUuaGl0ICsgYmVmb3JlICsgdGhlbWUuc3BvdCArIHNwb3QgKyB0aGVtZS5oaXQgKyBiZWhpbmQgKyB0aGVtZS5yZXNldFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxpbmUgICAgICA9IGxpbmUucGFkRW5kIHdpZHRoLCAnICdcbiAgICAgICAgICAgIFIucHVzaCByZWZlcmVuY2UgKyB0aGVtZS5jb250ZXh0ICArIGxpbmUgKyB0aGVtZS5yZXNldFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBSXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0gZG8gPT5cbiAgICAgIGZvcm1hdF9zdGFjayA9IG5ldyBGb3JtYXRfc3RhY2soKVxuICAgICAgcmV0dXJuIHsgZm9ybWF0X3N0YWNrLCBGb3JtYXRfc3RhY2ssIGludGVybmFscywgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgQlJJQ1NcblxuIl19
//# sourceURL=../src/unstable-brics.coffee