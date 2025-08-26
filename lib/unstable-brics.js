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
      var C, FS, Format_stack, dependency_c, exports, external_c, headline_c, hide, internal_c, internals, linkline_c, main_c, rpr, stack_line_re, strip_ansi, templates, type_of, unparsable_c;
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
      internal_c.folder_path = C.gray + C.bg_darkslatish;
      internal_c.file_name = C.gray + C.bg_darkslatish;
      internal_c.line_nr = C.gray + C.bg_darkslatish;
      internal_c.column_nr = C.gray + C.bg_darkslatish;
      internal_c.callee = C.gray + C.bg_darkslatish;
      //.......................................................................................................
      unparsable_c = {};
      unparsable_c.text = C.black + C.bg_violet + C.bold;
      unparsable_c.reset = main_c.reset;
      //.......................................................................................................
      headline_c = {};
      headline_c.headline = C.black + C.bg_red + C.bold;
      headline_c.reset = main_c.reset;
      //.......................................................................................................
      linkline_c = {};
      linkline_c.linkline = C.black + C.bg_turquoise + C.bold;
      linkline_c.reset = main_c.reset;
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
            unparsable: unparsable_c,
            headline: headline_c,
            linkline: linkline_c
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
          this.cfg.padding.line = this.cfg.padding.path + this.cfg.padding.callee;
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
          var R, cause, error, headline, line, lines, ref, stack, type;
          switch (type = type_of(error_or_stack)) {
            case 'error':
              error = error_or_stack;
              cause = (ref = error.cause) != null ? ref : null;
              stack = error.stack;
              break;
            case 'text':
              error = null;
              cause = null;
              stack = error_or_stack;
              break;
            default:
              // headline  = stack.
              throw new Error(`Ω___4 expected an error or a text, got a ${type}`);
          }
          //...................................................................................................
          if ((lines = stack.split('\n')).length === 1) {
            R = this.format_line(line);
          } else {
            headline = this.format_headline(lines.shift(), error);
            lines = lines.reverse();
            lines = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = lines.length; i < len; i++) {
                line = lines[i];
                results.push(this.format_line(line));
              }
              return results;
            }).call(this);
            R = [headline, ...lines, headline].join('\n');
          }
          //...................................................................................................
          if (cause != null) {
            R = (this.format(cause)) + this.get_linkline() + R;
          }
          return R;
        }

        //-----------------------------------------------------------------------------------------------------
        parse_line(line) {
          /* TAINT use proper validation */
          var R, is_internal, match, reference, type;
          if ((type = type_of(line)) !== 'text') {
            throw new Error(`Ω___5 expected a text, got a ${type}`);
          }
          //...................................................................................................
          if ((indexOf.call(line, '\n') >= 0)) {
            throw new Error("Ω___6 expected a single line, got a text with line breaks");
          }
          if ((match = line.match(stack_line_re)) == null) {
            return {
              //...................................................................................................
              text: line,
              type: 'unparsable'
            };
          }
          //...................................................................................................
          R = {...match.groups};
          is_internal = R.path.startsWith('node:');
          if (R.callee == null) {
            R.callee = '[anonymous]';
          }
          R.line_nr = parseInt(R.line_nr, 10);
          R.column_nr = parseInt(R.column_nr, 10);
          //...................................................................................................
          if ((this.get_relative_path != null) && (!is_internal) && (this.cfg.relative !== false)) {
            reference = (this.cfg.relative === true) ? process.cwd() : this.cfg.relative;
            R.path = this.get_relative_path(reference, R.path);
            R.folder_path = (this.get_relative_path(reference, R.folder_path)) + '/';
          }
          // R.path        = './' + R.path        unless R.path[ 0 ]         in './'
          // R.folder_path = './' + R.folder_path unless R.folder_path[ 0 ]  in './'
          //...................................................................................................
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
        format_headline(line, error = null) {
          var error_class, ref, theme;
          /* TAINT also show code, name where aprropriate */
          //   show_error_with_source_context error.cause, " Cause: #{error.cause.constructor.name}: #{error.cause.message} "
          theme = this.cfg.color.headline;
          error_class = (ref = error != null ? error.constructor.name : void 0) != null ? ref : '(no error class)';
          line = ` [${error_class}] ${line}`;
          line = line.padEnd(this.cfg.padding.line, ' ');
          return theme.headline + line + theme.reset;
        }

        //-----------------------------------------------------------------------------------------------------
        get_linkline() {
          var line, theme;
          theme = this.cfg.color.linkline;
          line = "  the below error was caused by the one above  △  △  △  ";
          line = line.padStart(this.cfg.padding.line, ' △ ');
          return '\n' + theme.linkline + line + theme.reset + '\n';
        }

        //-----------------------------------------------------------------------------------------------------
        _format_source_reference(line) {
          var callee, callee_length, column_nr, file_name, folder_path, line_nr, padding_callee, padding_path, path_length, source_reference, stack_info, theme;
          stack_info = this.parse_line(line);
          theme = this.cfg.color[stack_info.type];
          //...................................................................................................
          if (stack_info.type === 'unparsable') {
            source_reference = theme.text + stack_info.text + theme.reset;
            return {stack_info, source_reference};
          }
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
              behind = ' '.repeat(Math.max(0, width - line.length));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxLQUFBO0lBQUE7d0JBQUE7Ozs7O0VBS0EsS0FBQSxHQUtFLENBQUE7Ozs7SUFBQSwwQkFBQSxFQUE0QixRQUFBLENBQUEsQ0FBQTtBQUM5QixVQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsb0JBQUEsRUFBQSxvQkFBQSxFQUFBLGlCQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLGlCQUFBLEVBQUEsc0JBQUEsRUFBQTtNQUFJLEdBQUEsR0FDRTtRQUFBLFdBQUEsRUFBZ0IsSUFBaEI7UUFDQSxNQUFBLEVBQWdCLElBRGhCO1FBRUEsTUFBQSxFQUFnQjtNQUZoQjtNQUdGLGlCQUFBLEdBQW9CLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUVaLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBRlksQ0FBQSxrQ0FBQSxDQUFBLENBTVosTUFBTSxDQUFDLE1BQVAsQ0FBYyxHQUFHLENBQUMsTUFBbEIsQ0FOWSxDQUFBLEVBQUEsQ0FBQSxFQVFmLEdBUmUsRUFKeEI7Ozs7O01BaUJJLEdBQUEsR0FBb0IsUUFBQSxDQUFFLENBQUYsQ0FBQTtBQUNsQixlQUFPLENBQUEsQ0FBQSxDQUFBLENBQTZCLENBQUUsT0FBTyxDQUFULENBQUEsS0FBZ0IsUUFBekMsR0FBQSxDQUFDLENBQUMsT0FBRixDQUFVLElBQVYsRUFBZ0IsS0FBaEIsQ0FBQSxHQUFBLE1BQUosQ0FBQSxDQUFBO0FBQ1AsZUFBTyxDQUFBLENBQUEsQ0FBRyxDQUFILENBQUE7TUFGVztNQUdwQixNQUFBLEdBQ0U7UUFBQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFBLHFCQUFBLFFBQW1DLE1BQW5DLENBQUEsQ0FBdEI7UUFDQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFB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LElBQUEsR0FBWSxJQUFJLENBQUMsTUFBTCxDQUFZLEtBQVosRUFBbUIsR0FBbkI7Y0FDWixDQUFDLENBQUMsSUFBRixDQUFPLFNBQUEsR0FBWSxLQUFLLENBQUMsT0FBbEIsR0FBNkIsSUFBN0IsR0FBb0MsS0FBSyxDQUFDLEtBQWpELEVBUEY7O1VBSEYsQ0FsQlI7O0FBOEJRLGlCQUFPO1FBL0JLOztNQTVIaEIsRUFyRko7O0FBbVBJLGFBQU8sT0FBQSxHQUFhLENBQUEsQ0FBQSxDQUFBLEdBQUE7QUFDeEIsWUFBQTtRQUFNLFlBQUEsR0FBZSxJQUFJLFlBQUosQ0FBQTtBQUNmLGVBQU8sQ0FBRSxZQUFGLEVBQWdCLFlBQWhCLEVBQThCLFNBQTlCO01BRlcsQ0FBQTtJQXBQQTtFQXBJdEIsRUFWRjs7O0VBd1lBLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQThCLEtBQTlCO0FBeFlBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5CUklDUyA9XG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX25leHRfZnJlZV9maWxlbmFtZTogLT5cbiAgICBjZmcgPVxuICAgICAgbWF4X3JldHJpZXM6ICAgIDk5OTlcbiAgICAgIHByZWZpeDogICAgICAgICAnfi4nXG4gICAgICBzdWZmaXg6ICAgICAgICAgJy5icmljYWJyYWMtY2FjaGUnXG4gICAgY2FjaGVfZmlsZW5hbWVfcmUgPSAvLy9cbiAgICAgIF5cbiAgICAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnByZWZpeH0gKVxuICAgICAgKD88Zmlyc3Q+LiopXG4gICAgICBcXC5cbiAgICAgICg/PG5yPlswLTldezR9KVxuICAgICAgKD86ICN7UmVnRXhwLmVzY2FwZSBjZmcuc3VmZml4fSApXG4gICAgICAkXG4gICAgICAvLy92XG4gICAgIyBjYWNoZV9zdWZmaXhfcmUgPSAvLy9cbiAgICAjICAgKD86ICN7UmVnRXhwLmVzY2FwZSBjZmcuc3VmZml4fSApXG4gICAgIyAgICRcbiAgICAjICAgLy8vdlxuICAgIHJwciAgICAgICAgICAgICAgID0gKCB4ICkgLT5cbiAgICAgIHJldHVybiBcIicje3gucmVwbGFjZSAvJy9nLCBcIlxcXFwnXCIgaWYgKCB0eXBlb2YgeCApIGlzICdzdHJpbmcnfSdcIlxuICAgICAgcmV0dXJuIFwiI3t4fVwiXG4gICAgZXJyb3JzID1cbiAgICAgIFRNUF9leGhhdXN0aW9uX2Vycm9yOiBjbGFzcyBUTVBfZXhoYXVzdGlvbl9lcnJvciBleHRlbmRzIEVycm9yXG4gICAgICBUTVBfdmFsaWRhdGlvbl9lcnJvcjogY2xhc3MgVE1QX3ZhbGlkYXRpb25fZXJyb3IgZXh0ZW5kcyBFcnJvclxuICAgIEZTICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOmZzJ1xuICAgIFBBVEggICAgICAgICAgPSByZXF1aXJlICdub2RlOnBhdGgnXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBleGlzdHMgPSAoIHBhdGggKSAtPlxuICAgICAgdHJ5IEZTLnN0YXRTeW5jIHBhdGggY2F0Y2ggZXJyb3IgdGhlbiByZXR1cm4gZmFsc2VcbiAgICAgIHJldHVybiB0cnVlXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBnZXRfbmV4dF9maWxlbmFtZSA9ICggcGF0aCApIC0+XG4gICAgICAjIyMgVEFJTlQgdXNlIHByb3BlciB0eXBlIGNoZWNraW5nICMjI1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5UTVBfdmFsaWRhdGlvbl9lcnJvciBcIs6pX19fMSBleHBlY3RlZCBhIHRleHQsIGdvdCAje3JwciBwYXRofVwiIHVubGVzcyAoIHR5cGVvZiBwYXRoICkgaXMgJ3N0cmluZydcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX3ZhbGlkYXRpb25fZXJyb3IgXCLOqV9fXzIgZXhwZWN0ZWQgYSBub25lbXB0eSB0ZXh0LCBnb3QgI3tycHIgcGF0aH1cIiB1bmxlc3MgcGF0aC5sZW5ndGggPiAwXG4gICAgICBkaXJuYW1lICA9IFBBVEguZGlybmFtZSBwYXRoXG4gICAgICBiYXNlbmFtZSA9IFBBVEguYmFzZW5hbWUgcGF0aFxuICAgICAgdW5sZXNzICggbWF0Y2ggPSBiYXNlbmFtZS5tYXRjaCBjYWNoZV9maWxlbmFtZV9yZSApP1xuICAgICAgICByZXR1cm4gUEFUSC5qb2luIGRpcm5hbWUsIFwiI3tjZmcucHJlZml4fSN7YmFzZW5hbWV9LjAwMDEje2NmZy5zdWZmaXh9XCJcbiAgICAgIHsgZmlyc3QsIG5yLCAgfSA9IG1hdGNoLmdyb3Vwc1xuICAgICAgbnIgICAgICAgICAgICAgID0gXCIjeyggcGFyc2VJbnQgbnIsIDEwICkgKyAxfVwiLnBhZFN0YXJ0IDQsICcwJ1xuICAgICAgcGF0aCAgICAgICAgICAgID0gZmlyc3RcbiAgICAgIHJldHVybiBQQVRILmpvaW4gZGlybmFtZSwgXCIje2NmZy5wcmVmaXh9I3tmaXJzdH0uI3tucn0je2NmZy5zdWZmaXh9XCJcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGdldF9uZXh0X2ZyZWVfZmlsZW5hbWUgPSAoIHBhdGggKSAtPlxuICAgICAgUiAgICAgICAgICAgICA9IHBhdGhcbiAgICAgIGZhaWx1cmVfY291bnQgPSAtMVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBsb29wXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZmFpbHVyZV9jb3VudCsrXG4gICAgICAgIGlmIGZhaWx1cmVfY291bnQgPiBjZmcubWF4X3JldHJpZXNcbiAgICAgICAgICAgdGhyb3cgbmV3IGVycm9ycy5UTVBfZXhoYXVzdGlvbl9lcnJvciBcIs6pX19fMyB0b28gbWFueSAoI3tmYWlsdXJlX2NvdW50fSkgcmV0cmllczsgIHBhdGggI3tycHIgUn0gZXhpc3RzXCJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBSID0gZ2V0X25leHRfZmlsZW5hbWUgUlxuICAgICAgICBicmVhayB1bmxlc3MgZXhpc3RzIFJcbiAgICAgIHJldHVybiBSXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAjIHN3YXBfc3VmZml4ID0gKCBwYXRoLCBzdWZmaXggKSAtPiBwYXRoLnJlcGxhY2UgY2FjaGVfc3VmZml4X3JlLCBzdWZmaXhcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyBnZXRfbmV4dF9mcmVlX2ZpbGVuYW1lLCBnZXRfbmV4dF9maWxlbmFtZSwgZXhpc3RzLCBjYWNoZV9maWxlbmFtZV9yZSwgZXJyb3JzLCB9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfY29tbWFuZF9saW5lX3Rvb2xzOiAtPlxuICAgIENQID0gcmVxdWlyZSAnbm9kZTpjaGlsZF9wcm9jZXNzJ1xuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9jb21tYW5kX2xpbmVfcmVzdWx0ID0gKCBjb21tYW5kLCBpbnB1dCApIC0+XG4gICAgICByZXR1cm4gKCBDUC5leGVjU3luYyBjb21tYW5kLCB7IGVuY29kaW5nOiAndXRmLTgnLCBpbnB1dCwgfSApLnJlcGxhY2UgL1xcbiQvcywgJydcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF93Y19tYXhfbGluZV9sZW5ndGggPSAoIHRleHQgKSAtPlxuICAgICAgIyMjIHRoeCB0byBodHRwczovL3VuaXguc3RhY2tleGNoYW5nZS5jb20vYS8yNTg1NTEvMjgwMjA0ICMjI1xuICAgICAgcmV0dXJuIHBhcnNlSW50ICggZ2V0X2NvbW1hbmRfbGluZV9yZXN1bHQgJ3djIC0tbWF4LWxpbmUtbGVuZ3RoJywgdGV4dCApLCAxMFxuXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgZ2V0X2NvbW1hbmRfbGluZV9yZXN1bHQsIGdldF93Y19tYXhfbGluZV9sZW5ndGgsIH1cblxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX3Byb2dyZXNzX2luZGljYXRvcnM6IC0+XG4gICAgeyBhbnNpX2NvbG9yc19hbmRfZWZmZWN0czogQywgfSA9ICggcmVxdWlyZSAnLi9hbnNpLWJyaWNzJyApLnJlcXVpcmVfYW5zaV9jb2xvcnNfYW5kX2VmZmVjdHMoKVxuICAgIGZnICA9IEMuZ3JlZW5cbiAgICBiZyAgPSBDLmJnX3JlZFxuICAgIGZnMCA9IEMuZGVmYXVsdFxuICAgIGJnMCA9IEMuYmdfZGVmYXVsdFxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZ2V0X3BlcmNlbnRhZ2VfYmFyID0gKCBwZXJjZW50YWdlICkgLT5cbiAgICAgICMjIyDwn66C8J+ug/CfroTwn66F8J+uhiDiloHiloLiloPiloTiloXilobilofilogg4paJ4paK4paL4paM4paN4paO4paP8J+uh/Cfrojwn66J8J+uivCfrosg4paQIPCfrbAg8J+tsSDwn62yIPCfrbMg8J+ttCDwn621IPCfroAg8J+ugSDwn622IPCfrbcg8J+tuCDwn625IPCfrbog8J+tuyDwn629IPCfrb4g8J+tvCDwn62/ICMjI1xuICAgICAgcGVyY2VudGFnZV9ycHIgID0gKCBNYXRoLnJvdW5kIHBlcmNlbnRhZ2UgKS50b1N0cmluZygpLnBhZFN0YXJ0IDNcbiAgICAgIGlmIHBlcmNlbnRhZ2UgaXMgbnVsbCBvciBwZXJjZW50YWdlIDw9IDAgIHRoZW4gcmV0dXJuIFwiI3twZXJjZW50YWdlX3Jwcn0gJeKWlSAgICAgICAgICAgICDilo9cIlxuICAgICAgaWYgcGVyY2VudGFnZSA+PSAxMDAgICAgICAgICAgICAgICAgICAgICAgdGhlbiByZXR1cm4gXCIje3BlcmNlbnRhZ2VfcnByfSAl4paV4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paI4paPXCJcbiAgICAgIHBlcmNlbnRhZ2UgICAgICA9ICggTWF0aC5yb3VuZCBwZXJjZW50YWdlIC8gMTAwICogMTA0IClcbiAgICAgIFIgICAgICAgICAgICAgICA9ICfilognLnJlcGVhdCBwZXJjZW50YWdlIC8vIDhcbiAgICAgIHN3aXRjaCBwZXJjZW50YWdlICUlIDhcbiAgICAgICAgd2hlbiAwIHRoZW4gUiArPSAnICdcbiAgICAgICAgd2hlbiAxIHRoZW4gUiArPSAn4paPJ1xuICAgICAgICB3aGVuIDIgdGhlbiBSICs9ICfilo4nXG4gICAgICAgIHdoZW4gMyB0aGVuIFIgKz0gJ+KWjSdcbiAgICAgICAgd2hlbiA0IHRoZW4gUiArPSAn4paMJ1xuICAgICAgICB3aGVuIDUgdGhlbiBSICs9ICfilosnXG4gICAgICAgIHdoZW4gNiB0aGVuIFIgKz0gJ+KWiidcbiAgICAgICAgd2hlbiA3IHRoZW4gUiArPSAn4paJJ1xuICAgICAgcmV0dXJuIFwiI3twZXJjZW50YWdlX3Jwcn0gJeKWlSN7ZmcrYmd9I3tSLnBhZEVuZCAxM30je2ZnMCtiZzB94paPXCJcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGhvbGxvd19wZXJjZW50YWdlX2JhciA9ICggbiApIC0+XG4gICAgICBpZiBuIGlzIG51bGwgb3IgbiA8PSAwICB0aGVuIHJldHVybiAnICAgICAgICAgICAgICdcbiAgICAgICMgaWYgbiA+PSAxMDAgICAgICAgICAgICAgdGhlbiByZXR1cm4gJ+KWkeKWkeKWkeKWkeKWkeKWkeKWkeKWkeKWkeKWkeKWkeKWkeKWkSdcbiAgICAgIGlmIG4gPj0gMTAwICAgICAgICAgICAgIHRoZW4gcmV0dXJuICfilpPilpPilpPilpPilpPilpPilpPilpPilpPilpPilpPilpPilpMnXG4gICAgICBuID0gKCBNYXRoLnJvdW5kIG4gLyAxMDAgKiAxMDQgKVxuICAgICAgIyBSID0gJ+KWkScucmVwZWF0IG4gLy8gOFxuICAgICAgUiA9ICfilpMnLnJlcGVhdCBuIC8vIDhcbiAgICAgIHN3aXRjaCBuICUlIDhcbiAgICAgICAgd2hlbiAwIHRoZW4gUiArPSAnICdcbiAgICAgICAgd2hlbiAxIHRoZW4gUiArPSAn4paPJ1xuICAgICAgICB3aGVuIDIgdGhlbiBSICs9ICfilo4nXG4gICAgICAgIHdoZW4gMyB0aGVuIFIgKz0gJ+KWjSdcbiAgICAgICAgd2hlbiA0IHRoZW4gUiArPSAn4paMJ1xuICAgICAgICB3aGVuIDUgdGhlbiBSICs9ICfilosnXG4gICAgICAgIHdoZW4gNiB0aGVuIFIgKz0gJ+KWiidcbiAgICAgICAgd2hlbiA3IHRoZW4gUiArPSAn4paJJ1xuICAgICAgICAjIHdoZW4gOCB0aGVuIFIgKz0gJ+KWiCdcbiAgICAgIHJldHVybiBSLnBhZEVuZCAxM1xuXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgZ2V0X3BlcmNlbnRhZ2VfYmFyLCB9XG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfZm9ybWF0X3N0YWNrOiAtPlxuICAgIHsgYW5zaV9jb2xvcnNfYW5kX2VmZmVjdHM6IEMsIH0gPSAoIHJlcXVpcmUgJy4vYW5zaS1icmljcycgKS5yZXF1aXJlX2Fuc2lfY29sb3JzX2FuZF9lZmZlY3RzKClcbiAgICB7IHN0cmlwX2Fuc2ksICAgICAgICAgICAgICAgICB9ID0gKCByZXF1aXJlICcuL2Fuc2ktYnJpY3MnICkucmVxdWlyZV9zdHJpcF9hbnNpKClcbiAgICB7IHR5cGVfb2YsICAgICAgICAgICAgICAgICAgICB9ID0gKCByZXF1aXJlICcuL3Vuc3RhYmxlLXJwci10eXBlX29mLWJyaWNzJyApLnJlcXVpcmVfdHlwZV9vZigpXG4gICAgeyBoaWRlLCAgICAgICAgICAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi92YXJpb3VzLWJyaWNzJyApLnJlcXVpcmVfbWFuYWdlZF9wcm9wZXJ0eV90b29scygpXG4gICAgeyBzaG93X25vX2NvbG9yczogcnByLCAgICAgICAgfSA9ICggcmVxdWlyZSAnLi9tYWluJyApLnVuc3RhYmxlLnJlcXVpcmVfc2hvdygpXG4gICAgIyMjIFRBSU5UIG1ha2UgdXNlIG9mIGBGU2Agb3B0aW9uYWwgbGlrZSBgZ2V0X3JlbGF0aXZlX3BhdGgoKWAgIyMjXG4gICAgRlMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6ZnMnXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIG1haW5fYyAgICAgICAgICAgICAgICAgICAgPSB7fVxuICAgIG1haW5fYy5yZXNldCAgICAgICAgICAgICAgPSBDLnJlc2V0ICMgQy5kZWZhdWx0ICsgQy5iZ19kZWZhdWx0ICArIEMuYm9sZDBcbiAgICBtYWluX2MuZm9sZGVyX3BhdGggICAgICAgID0gQy5ibGFjayAgICsgQy5iZ19saW1lICAgICArIEMuYm9sZFxuICAgIG1haW5fYy5maWxlX25hbWUgICAgICAgICAgPSBDLndpbmUgICAgKyBDLmJnX2xpbWUgICAgICsgQy5ib2xkXG4gICAgbWFpbl9jLmNhbGxlZSAgICAgICAgICAgICA9IEMuYmxhY2sgICArIEMuYmdfbGltZSAgICAgKyBDLmJvbGRcbiAgICBtYWluX2MubGluZV9uciAgICAgICAgICAgID0gQy5ibGFjayAgICsgQy5iZ19ibHVlICAgICArIEMuYm9sZFxuICAgIG1haW5fYy5jb2x1bW5fbnIgICAgICAgICAgPSBDLmJsYWNrICAgKyBDLmJnX2JsdWUgICAgICsgQy5ib2xkXG4gICAgbWFpbl9jLmNvbnRleHQgICAgICAgICAgICA9IEMubGlnaHRzbGF0ZWdyYXkgICsgQy5iZ19kYXJrc2xhdGlzaFxuICAgICMgbWFpbl9jLmNvbnRleHQgICAgICAgICAgICA9IEMubGlnaHRzbGF0ZWdyYXkgICsgQy5iZ19kYXJrc2xhdGVncmF5XG4gICAgbWFpbl9jLmhpdCAgICAgICAgICAgICAgICA9IEMud2hpdGUgICAgICAgICAgICsgQy5iZ19kYXJrc2xhdGlzaCArIEMuYm9sZFxuICAgIG1haW5fYy5zcG90ICAgICAgICAgICAgICAgPSBDLnllbGxvdyAgICAgICAgICAgICArIEMuYmdfd2luZSArIEMuYm9sZFxuICAgICMgbWFpbl9jLmhpdCAgICAgICAgICAgICAgICA9IEMud2hpdGUgICAgICAgICAgKyBDLmJnX2ZvcmVzdCArIEMuYm9sZFxuICAgIG1haW5fYy5yZWZlcmVuY2UgICAgICAgICAgPSBDLmxpZ2h0c2xhdGVncmF5ICArIEMuYmdfYmxhY2tcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGV4dGVybmFsX2MgICAgICAgICAgICAgICAgPSBPYmplY3QuY3JlYXRlIG1haW5fY1xuICAgIGV4dGVybmFsX2MuZm9sZGVyX3BhdGggICAgPSBDLmJsYWNrICAgKyBDLmJnX3llbGxvdyAgICsgQy5ib2xkXG4gICAgZXh0ZXJuYWxfYy5maWxlX25hbWUgICAgICA9IEMud2luZSAgICArIEMuYmdfeWVsbG93ICAgKyBDLmJvbGRcbiAgICBleHRlcm5hbF9jLmNhbGxlZSAgICAgICAgID0gQy5ibGFjayAgICsgQy5iZ195ZWxsb3cgICArIEMuYm9sZFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZGVwZW5kZW5jeV9jICAgICAgICAgICAgICA9IE9iamVjdC5jcmVhdGUgbWFpbl9jXG4gICAgZGVwZW5kZW5jeV9jLmZvbGRlcl9wYXRoICA9IEMuYmxhY2sgICArIEMuYmdfb3JwaW1lbnQgKyBDLmJvbGRcbiAgICBkZXBlbmRlbmN5X2MuZmlsZV9uYW1lICAgID0gQy53aW5lICAgICsgQy5iZ19vcnBpbWVudCArIEMuYm9sZFxuICAgIGRlcGVuZGVuY3lfYy5jYWxsZWUgICAgICAgPSBDLmJsYWNrICAgKyBDLmJnX29ycGltZW50ICsgQy5ib2xkXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBpbnRlcm5hbF9jICAgICAgICAgICAgICAgID0gT2JqZWN0LmNyZWF0ZSBtYWluX2NcbiAgICBpbnRlcm5hbF9jLmZvbGRlcl9wYXRoICAgID0gQy5ncmF5ICAgICsgQy5iZ19kYXJrc2xhdGlzaFxuICAgIGludGVybmFsX2MuZmlsZV9uYW1lICAgICAgPSBDLmdyYXkgICAgKyBDLmJnX2RhcmtzbGF0aXNoXG4gICAgaW50ZXJuYWxfYy5saW5lX25yICAgICAgICA9IEMuZ3JheSAgICArIEMuYmdfZGFya3NsYXRpc2hcbiAgICBpbnRlcm5hbF9jLmNvbHVtbl9uciAgICAgID0gQy5ncmF5ICAgICsgQy5iZ19kYXJrc2xhdGlzaFxuICAgIGludGVybmFsX2MuY2FsbGVlICAgICAgICAgPSBDLmdyYXkgICAgKyBDLmJnX2RhcmtzbGF0aXNoXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICB1bnBhcnNhYmxlX2MgICAgICAgICAgICAgID0ge31cbiAgICB1bnBhcnNhYmxlX2MudGV4dCAgICAgICAgID0gQy5ibGFjayAgICsgQy5iZ192aW9sZXQgICAgICArIEMuYm9sZFxuICAgIHVucGFyc2FibGVfYy5yZXNldCAgICAgICAgPSBtYWluX2MucmVzZXRcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGhlYWRsaW5lX2MgICAgICAgICAgICAgICAgPSB7fVxuICAgIGhlYWRsaW5lX2MuaGVhZGxpbmUgICAgICAgPSBDLmJsYWNrICAgKyBDLmJnX3JlZCAgICAgICsgQy5ib2xkXG4gICAgaGVhZGxpbmVfYy5yZXNldCAgICAgICAgICA9IG1haW5fYy5yZXNldFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgbGlua2xpbmVfYyAgICAgICAgICAgICAgICA9IHt9XG4gICAgbGlua2xpbmVfYy5saW5rbGluZSAgICAgICA9IEMuYmxhY2sgICArIEMuYmdfdHVycXVvaXNlICAgICAgKyBDLmJvbGRcbiAgICBsaW5rbGluZV9jLnJlc2V0ICAgICAgICAgID0gbWFpbl9jLnJlc2V0XG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICB0ZW1wbGF0ZXMgPVxuICAgICAgZm9ybWF0X3N0YWNrOlxuICAgICAgICByZWxhdGl2ZTogICAgICAgdHJ1ZSAjIGJvb2xlYW4gdG8gdXNlIENXRCwgb3Igc3BlY2lmeSByZWZlcmVuY2UgcGF0aFxuICAgICAgICBjb250ZXh0OiAgICAgICAgMlxuICAgICAgICBwYWRkaW5nOlxuICAgICAgICAgIHBhdGg6ICAgICAgICAgICA5MFxuICAgICAgICAgIGNhbGxlZTogICAgICAgICA2MFxuICAgICAgICBjb2xvcjpcbiAgICAgICAgICBtYWluOiAgICAgICAgICAgbWFpbl9jXG4gICAgICAgICAgaW50ZXJuYWw6ICAgICAgIGludGVybmFsX2NcbiAgICAgICAgICBleHRlcm5hbDogICAgICAgZXh0ZXJuYWxfY1xuICAgICAgICAgIGRlcGVuZGVuY3k6ICAgICBkZXBlbmRlbmN5X2NcbiAgICAgICAgICB1bnBhcnNhYmxlOiAgICAgdW5wYXJzYWJsZV9jXG4gICAgICAgICAgaGVhZGxpbmU6ICAgICAgIGhlYWRsaW5lX2NcbiAgICAgICAgICBsaW5rbGluZTogICAgICAgbGlua2xpbmVfY1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzdGFja19saW5lX3JlID0gLy8vIF5cbiAgICAgIFxccyogYXQgXFxzK1xuICAgICAgKD86XG4gICAgICAgICg/PGNhbGxlZT4gLio/ICAgIClcbiAgICAgICAgXFxzKyBcXChcbiAgICAgICAgKT9cbiAgICAgICg/PHBhdGg+ICAgICAgKD88Zm9sZGVyX3BhdGg+IC4qPyApICg/PGZpbGVfbmFtZT4gW14gXFwvIF0rICkgICkgOlxuICAgICAgKD88bGluZV9ucj4gICBcXGQrICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6XG4gICAgICAoPzxjb2x1bW5fbnI+IFxcZCsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICBcXCk/XG4gICAgICAkIC8vLztcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW50ZXJuYWxzID0gT2JqZWN0LmZyZWV6ZSB7IHRlbXBsYXRlcywgfVxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBGb3JtYXRfc3RhY2tcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKCBjZmcgKSAtPlxuICAgICAgICBAY2ZnICAgICAgICAgICAgICA9IHsgdGVtcGxhdGVzLmZvcm1hdF9zdGFjay4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIEBjZmcucGFkZGluZy5saW5lID0gQGNmZy5wYWRkaW5nLnBhdGggKyBAY2ZnLnBhZGRpbmcuY2FsbGVlXG4gICAgICAgIG1lICAgICAgICAgICAgICAgID0gKCBQLi4uICkgPT4gQGZvcm1hdCBQLi4uXG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZiBtZSwgQFxuICAgICAgICBoaWRlIEAsICdnZXRfcmVsYXRpdmVfcGF0aCcsIGRvID0+XG4gICAgICAgICAgdHJ5IFBBVEggPSByZXF1aXJlICdub2RlOnBhdGgnIGNhdGNoIGVycm9yIHRoZW4gcmV0dXJuIG51bGxcbiAgICAgICAgICByZXR1cm4gUEFUSC5yZWxhdGl2ZS5iaW5kIFBBVEhcbiAgICAgICAgaGlkZSBALCAnc3RhdGUnLCB7IGNhY2hlOiBuZXcgTWFwKCksIH1cbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZm9ybWF0OiAoIGVycm9yX29yX3N0YWNrICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdmFsaWRhdGlvbiAjIyNcbiAgICAgICAgc3dpdGNoIHR5cGUgPSB0eXBlX29mIGVycm9yX29yX3N0YWNrXG4gICAgICAgICAgd2hlbiAnZXJyb3InXG4gICAgICAgICAgICBlcnJvciAgICAgPSBlcnJvcl9vcl9zdGFja1xuICAgICAgICAgICAgY2F1c2UgICAgID0gZXJyb3IuY2F1c2UgPyBudWxsXG4gICAgICAgICAgICBzdGFjayAgICAgPSBlcnJvci5zdGFja1xuICAgICAgICAgIHdoZW4gJ3RleHQnXG4gICAgICAgICAgICBlcnJvciAgICAgPSBudWxsXG4gICAgICAgICAgICBjYXVzZSAgICAgPSBudWxsXG4gICAgICAgICAgICBzdGFjayAgICAgPSBlcnJvcl9vcl9zdGFja1xuICAgICAgICAgICAgIyBoZWFkbGluZSAgPSBzdGFjay5cbiAgICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvciBcIs6pX19fNCBleHBlY3RlZCBhbiBlcnJvciBvciBhIHRleHQsIGdvdCBhICN7dHlwZX1cIlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGlmICggbGluZXMgPSBzdGFjay5zcGxpdCAnXFxuJyApLmxlbmd0aCBpcyAxXG4gICAgICAgICAgUiA9IEBmb3JtYXRfbGluZSBsaW5lXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBoZWFkbGluZSAgPSBAZm9ybWF0X2hlYWRsaW5lIGxpbmVzLnNoaWZ0KCksIGVycm9yXG4gICAgICAgICAgbGluZXMgICAgID0gbGluZXMucmV2ZXJzZSgpXG4gICAgICAgICAgbGluZXMgICAgID0gKCAoIEBmb3JtYXRfbGluZSBsaW5lICkgZm9yIGxpbmUgaW4gbGluZXMgKVxuICAgICAgICAgIFIgICAgICAgICA9IFsgaGVhZGxpbmUsIGxpbmVzLi4uLCBoZWFkbGluZSwgXS5qb2luICdcXG4nXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgaWYgY2F1c2U/XG4gICAgICAgICAgUiA9ICggQGZvcm1hdCBjYXVzZSApICsgQGdldF9saW5rbGluZSgpICsgUlxuICAgICAgICByZXR1cm4gUlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHBhcnNlX2xpbmU6ICggbGluZSApIC0+XG4gICAgICAgICMjIyBUQUlOVCB1c2UgcHJvcGVyIHZhbGlkYXRpb24gIyMjXG4gICAgICAgIHVubGVzcyAoIHR5cGUgPSB0eXBlX29mIGxpbmUgKSBpcyAndGV4dCdcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzUgZXhwZWN0ZWQgYSB0ZXh0LCBnb3QgYSAje3R5cGV9XCJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBpZiAoICdcXG4nIGluIGxpbmUgKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNiBleHBlY3RlZCBhIHNpbmdsZSBsaW5lLCBnb3QgYSB0ZXh0IHdpdGggbGluZSBicmVha3NcIlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiB7IHRleHQ6IGxpbmUsIHR5cGU6ICd1bnBhcnNhYmxlJywgfSB1bmxlc3MgKCBtYXRjaCA9IGxpbmUubWF0Y2ggc3RhY2tfbGluZV9yZSApP1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIFIgICAgICAgICAgID0geyBtYXRjaC5ncm91cHMuLi4sIH1cbiAgICAgICAgaXNfaW50ZXJuYWwgPSBSLnBhdGguc3RhcnRzV2l0aCAnbm9kZTonXG4gICAgICAgIFIuY2FsbGVlICAgPz0gJ1thbm9ueW1vdXNdJ1xuICAgICAgICBSLmxpbmVfbnIgICA9IHBhcnNlSW50IFIubGluZV9uciwgICAxMFxuICAgICAgICBSLmNvbHVtbl9uciA9IHBhcnNlSW50IFIuY29sdW1uX25yLCAxMFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGlmIEBnZXRfcmVsYXRpdmVfcGF0aD8gYW5kICggbm90IGlzX2ludGVybmFsICkgYW5kICggQGNmZy5yZWxhdGl2ZSBpc250IGZhbHNlIClcbiAgICAgICAgICByZWZlcmVuY2UgICAgID0gaWYgKCBAY2ZnLnJlbGF0aXZlIGlzIHRydWUgKSB0aGVuIHByb2Nlc3MuY3dkKCkgZWxzZSBAY2ZnLnJlbGF0aXZlXG4gICAgICAgICAgUi5wYXRoICAgICAgICA9ICggQGdldF9yZWxhdGl2ZV9wYXRoIHJlZmVyZW5jZSwgUi5wYXRoICAgICAgICApXG4gICAgICAgICAgUi5mb2xkZXJfcGF0aCA9ICggQGdldF9yZWxhdGl2ZV9wYXRoIHJlZmVyZW5jZSwgUi5mb2xkZXJfcGF0aCApICsgJy8nXG4gICAgICAgICAgIyBSLnBhdGggICAgICAgID0gJy4vJyArIFIucGF0aCAgICAgICAgdW5sZXNzIFIucGF0aFsgMCBdICAgICAgICAgaW4gJy4vJ1xuICAgICAgICAgICMgUi5mb2xkZXJfcGF0aCA9ICcuLycgKyBSLmZvbGRlcl9wYXRoIHVubGVzcyBSLmZvbGRlcl9wYXRoWyAwIF0gIGluICcuLydcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBzd2l0Y2ggdHJ1ZVxuICAgICAgICAgIHdoZW4gaXNfaW50ZXJuYWwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW4gIFIudHlwZSA9ICdpbnRlcm5hbCdcbiAgICAgICAgICB3aGVuIC9cXGJub2RlX21vZHVsZXNcXC8vLnRlc3QgUi5wYXRoICAgICAgICAgICAgIHRoZW4gIFIudHlwZSA9ICdkZXBlbmRlbmN5J1xuICAgICAgICAgIHdoZW4gUi5wYXRoLnN0YXJ0c1dpdGggJy4uLycgICAgICAgICAgICAgICAgICAgIHRoZW4gIFIudHlwZSA9ICdleHRlcm5hbCdcbiAgICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSLnR5cGUgPSAnbWFpbidcbiAgICAgICAgcmV0dXJuIFJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmb3JtYXRfbGluZTogKCBsaW5lICkgLT5cbiAgICAgICAgeyBzdGFja19pbmZvLFxuICAgICAgICAgIHNvdXJjZV9yZWZlcmVuY2UsICAgfSA9IEBfZm9ybWF0X3NvdXJjZV9yZWZlcmVuY2UgbGluZVxuICAgICAgICBjb250ZXh0ID0gaWYgQGNmZy5jb250ZXh0IGlzIGZhbHNlIHRoZW4gW10gZWxzZSBAX2dldF9jb250ZXh0IHN0YWNrX2luZm9cbiAgICAgICAgcmV0dXJuIFsgc291cmNlX3JlZmVyZW5jZSwgY29udGV4dC4uLiwgXS5qb2luICdcXG4nXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZm9ybWF0X2hlYWRsaW5lOiAoIGxpbmUsIGVycm9yID0gbnVsbCApIC0+XG4gICAgICAgICMjIyBUQUlOVCBhbHNvIHNob3cgY29kZSwgbmFtZSB3aGVyZSBhcHJyb3ByaWF0ZSAjIyNcbiAgICAgICAgIyAgIHNob3dfZXJyb3Jfd2l0aF9zb3VyY2VfY29udGV4dCBlcnJvci5jYXVzZSwgXCIgQ2F1c2U6ICN7ZXJyb3IuY2F1c2UuY29uc3RydWN0b3IubmFtZX06ICN7ZXJyb3IuY2F1c2UubWVzc2FnZX0gXCJcbiAgICAgICAgdGhlbWUgICAgICAgPSBAY2ZnLmNvbG9yLmhlYWRsaW5lXG4gICAgICAgIGVycm9yX2NsYXNzID0gZXJyb3I/LmNvbnN0cnVjdG9yLm5hbWUgPyAnKG5vIGVycm9yIGNsYXNzKSdcbiAgICAgICAgbGluZSAgICAgICAgPSBcIiBbI3tlcnJvcl9jbGFzc31dICN7bGluZX1cIlxuICAgICAgICBsaW5lICAgICAgICA9IGxpbmUucGFkRW5kIEBjZmcucGFkZGluZy5saW5lLCAnICdcbiAgICAgICAgcmV0dXJuIHRoZW1lLmhlYWRsaW5lICsgbGluZSArIHRoZW1lLnJlc2V0XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZ2V0X2xpbmtsaW5lOiAtPlxuICAgICAgICB0aGVtZSAgICAgICA9IEBjZmcuY29sb3IubGlua2xpbmVcbiAgICAgICAgbGluZSAgICAgICAgPSBcIiAgdGhlIGJlbG93IGVycm9yIHdhcyBjYXVzZWQgYnkgdGhlIG9uZSBhYm92ZSAg4pazICDilrMgIOKWsyAgXCJcbiAgICAgICAgbGluZSAgICAgICAgPSBsaW5lLnBhZFN0YXJ0IEBjZmcucGFkZGluZy5saW5lLCAnIOKWsyAnXG4gICAgICAgIHJldHVybiAnXFxuJyArIHRoZW1lLmxpbmtsaW5lICsgbGluZSArIHRoZW1lLnJlc2V0ICsgJ1xcbidcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZm9ybWF0X3NvdXJjZV9yZWZlcmVuY2U6ICggbGluZSApIC0+XG4gICAgICAgIHN0YWNrX2luZm8gICAgICA9IEBwYXJzZV9saW5lIGxpbmVcbiAgICAgICAgdGhlbWUgICAgICAgICAgID0gQGNmZy5jb2xvclsgc3RhY2tfaW5mby50eXBlIF1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBpZiBzdGFja19pbmZvLnR5cGUgaXMgJ3VucGFyc2FibGUnXG4gICAgICAgICAgc291cmNlX3JlZmVyZW5jZSA9IHRoZW1lLnRleHQgKyBzdGFja19pbmZvLnRleHQgKyB0aGVtZS5yZXNldFxuICAgICAgICAgIHJldHVybiB7IHN0YWNrX2luZm8sIHNvdXJjZV9yZWZlcmVuY2UsIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmb2xkZXJfcGF0aCAgICAgPSB0aGVtZS5mb2xkZXJfcGF0aCAgKyAnICcgICAgKyBzdGFja19pbmZvLmZvbGRlcl9wYXRoICArICcnICAgICArIHRoZW1lLnJlc2V0XG4gICAgICAgIGZpbGVfbmFtZSAgICAgICA9IHRoZW1lLmZpbGVfbmFtZSAgICArICcnICAgICArIHN0YWNrX2luZm8uZmlsZV9uYW1lICAgICsgJyAnICAgICsgdGhlbWUucmVzZXRcbiAgICAgICAgbGluZV9uciAgICAgICAgID0gdGhlbWUubGluZV9uciAgICAgICsgJyAoJyAgICsgc3RhY2tfaW5mby5saW5lX25yICAgICAgKyAnJyAgICAgKyB0aGVtZS5yZXNldFxuICAgICAgICBjb2x1bW5fbnIgICAgICAgPSB0aGVtZS5jb2x1bW5fbnIgICAgKyAnOicgICAgKyBzdGFja19pbmZvLmNvbHVtbl9uciAgICArICcpICcgICArIHRoZW1lLnJlc2V0XG4gICAgICAgIGNhbGxlZSAgICAgICAgICA9IHRoZW1lLmNhbGxlZSAgICAgICArICcgIyAnICArIHN0YWNrX2luZm8uY2FsbGVlICAgICAgICsgJygpICcgICsgdGhlbWUucmVzZXRcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBwYXRoX2xlbmd0aCAgICAgPSAoIHN0cmlwX2Fuc2kgZm9sZGVyX3BhdGggKyBmaWxlX25hbWUgKyBsaW5lX25yICsgY29sdW1uX25yICApLmxlbmd0aFxuICAgICAgICBjYWxsZWVfbGVuZ3RoICAgPSAoIHN0cmlwX2Fuc2kgY2FsbGVlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLmxlbmd0aFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHBhdGhfbGVuZ3RoICAgICA9IE1hdGgubWF4IDAsIEBjZmcucGFkZGluZy5wYXRoICAgIC0gICBwYXRoX2xlbmd0aFxuICAgICAgICBjYWxsZWVfbGVuZ3RoICAgPSBNYXRoLm1heCAwLCBAY2ZnLnBhZGRpbmcuY2FsbGVlICAtIGNhbGxlZV9sZW5ndGhcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBwYWRkaW5nX3BhdGggICAgPSB0aGVtZS5mb2xkZXJfcGF0aCArICggJyAnLnJlcGVhdCAgICBwYXRoX2xlbmd0aCApICsgdGhlbWUucmVzZXRcbiAgICAgICAgcGFkZGluZ19jYWxsZWUgID0gdGhlbWUuY2FsbGVlICAgICAgKyAoICcgJy5yZXBlYXQgIGNhbGxlZV9sZW5ndGggKSArIHRoZW1lLnJlc2V0XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgc291cmNlX3JlZmVyZW5jZSAgPSBmb2xkZXJfcGF0aCArIGZpbGVfbmFtZSArIGxpbmVfbnIgKyBjb2x1bW5fbnIgKyBwYWRkaW5nX3BhdGggKyBjYWxsZWUgKyBwYWRkaW5nX2NhbGxlZVxuICAgICAgICByZXR1cm4geyBzdGFja19pbmZvLCBzb3VyY2VfcmVmZXJlbmNlLCB9XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9jb250ZXh0OiAoIHN0YWNrX2luZm8gKSAtPlxuICAgICAgICByZXR1cm4gW10gaWYgKCBzdGFja19pbmZvLnR5cGUgaW4gWyAnaW50ZXJuYWwnLCAndW5wYXJzYWJsZScsIF0gKSBvciAoIHN0YWNrX2luZm8ucGF0aCBpcyAnJyApXG4gICAgICAgIHRyeVxuICAgICAgICAgIHNvdXJjZSA9IEZTLnJlYWRGaWxlU3luYyBzdGFja19pbmZvLnBhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcsIH1cbiAgICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgICB0aHJvdyBlcnJvciB1bmxlc3MgZXJyb3IuY29kZSBpcyAnRU5PRU5UJ1xuICAgICAgICAgIHJldHVybiBbIFwidW5hYmxlIHRvIHJlYWQgZmlsZSAje3JwciBzdGFja19pbmZvLnBhdGh9XCIsIF1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB0aGVtZSAgICAgPSBAY2ZnLmNvbG9yWyBzdGFja19pbmZvLnR5cGUgXVxuICAgICAgICByZWZfd2lkdGggPSA3XG4gICAgICAgIHdpZHRoICAgICA9IEBjZmcucGFkZGluZy5wYXRoICsgQGNmZy5wYWRkaW5nLmNhbGxlZSAtIHJlZl93aWR0aFxuICAgICAgICBzb3VyY2UgICAgPSBzb3VyY2Uuc3BsaXQgJ1xcbidcbiAgICAgICAgaGl0X2lkeCAgID0gc3RhY2tfaW5mby5saW5lX25yIC0gMVxuICAgICAgICAjIHJldHVybiBzb3VyY2VbIGhpdF9pZHggXSBpZiBAY2ZnLmNvbnRleHQgPCAxXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZmlyc3RfaWR4ID0gTWF0aC5tYXggKCBoaXRfaWR4IC0gQGNmZy5jb250ZXh0ICksIDBcbiAgICAgICAgbGFzdF9pZHggID0gTWF0aC5taW4gKCBoaXRfaWR4ICsgQGNmZy5jb250ZXh0ICksIHNvdXJjZS5sZW5ndGggLSAxXG4gICAgICAgIFIgICAgICAgICA9IFtdXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZm9yIGlkeCBpbiBbIGZpcnN0X2lkeCAuLiBsYXN0X2lkeCBdXG4gICAgICAgICAgbGluZSAgICAgID0gc291cmNlWyBpZHggXVxuICAgICAgICAgIHJlZmVyZW5jZSA9IHRoZW1lLnJlZmVyZW5jZSArICggXCIje2lkeCArIDF9IFwiLnBhZFN0YXJ0IHJlZl93aWR0aCwgJyAnIClcbiAgICAgICAgICBpZiAoIGlkeCBpcyBoaXRfaWR4IClcbiAgICAgICAgICAgIGJlZm9yZSAgICA9IGxpbmVbIC4uLiBzdGFja19pbmZvLmNvbHVtbl9uciAtIDEgICAgXVxuICAgICAgICAgICAgc3BvdCAgICAgID0gbGluZVsgICAgIHN0YWNrX2luZm8uY29sdW1uX25yIC0gMSAuLiBdXG4gICAgICAgICAgICBiZWhpbmQgICAgPSAnICcucmVwZWF0IE1hdGgubWF4IDAsIHdpZHRoIC0gbGluZS5sZW5ndGhcbiAgICAgICAgICAgIFIucHVzaCByZWZlcmVuY2UgKyB0aGVtZS5oaXQgKyBiZWZvcmUgKyB0aGVtZS5zcG90ICsgc3BvdCArIHRoZW1lLmhpdCArIGJlaGluZCArIHRoZW1lLnJlc2V0XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbGluZSAgICAgID0gbGluZS5wYWRFbmQgd2lkdGgsICcgJ1xuICAgICAgICAgICAgUi5wdXNoIHJlZmVyZW5jZSArIHRoZW1lLmNvbnRleHQgICsgbGluZSArIHRoZW1lLnJlc2V0XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIFJcblxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSBkbyA9PlxuICAgICAgZm9ybWF0X3N0YWNrID0gbmV3IEZvcm1hdF9zdGFjaygpXG4gICAgICByZXR1cm4geyBmb3JtYXRfc3RhY2ssIEZvcm1hdF9zdGFjaywgaW50ZXJuYWxzLCB9XG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBCUklDU1xuXG4iXX0=
