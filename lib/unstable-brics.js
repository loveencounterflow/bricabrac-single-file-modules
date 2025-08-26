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
      var C, FS, Format_stack, dependency_c, exports, external_c, headline_c, hide, internal_c, internals, main_c, rpr, stack_line_re, strip_ansi, templates, type_of, unparsable_c;
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
            headline: headline_c
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
          var error, headline, line, lines, stack, type;
          switch (type = type_of(error_or_stack)) {
            case 'error':
              error = error_or_stack;
              stack = error.stack;
              break;
            case 'text':
              error = null;
              stack = error_or_stack;
              break;
            default:
              // headline  = stack.
              throw new Error(`Ω___4 expected an error or a text, got a ${type}`);
          }
          lines = stack.split('\n');
          if (lines.length > 1) {
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
            return [headline, ...lines, headline].join('\n');
          }
          return this.format_line(line);
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
          theme = this.cfg.color.headline;
          error_class = (ref = error != null ? error.constructor.name : void 0) != null ? ref : '(no error class)';
          line = ` [${error_class}] ${line}`;
          line = line.padEnd(this.cfg.padding.line, ' ');
          return theme.headline + line + theme.reset;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxLQUFBO0lBQUE7d0JBQUE7Ozs7O0VBS0EsS0FBQSxHQUtFLENBQUE7Ozs7SUFBQSwwQkFBQSxFQUE0QixRQUFBLENBQUEsQ0FBQTtBQUM5QixVQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsb0JBQUEsRUFBQSxvQkFBQSxFQUFBLGlCQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLGlCQUFBLEVBQUEsc0JBQUEsRUFBQTtNQUFJLEdBQUEsR0FDRTtRQUFBLFdBQUEsRUFBZ0IsSUFBaEI7UUFDQSxNQUFBLEVBQWdCLElBRGhCO1FBRUEsTUFBQSxFQUFnQjtNQUZoQjtNQUdGLGlCQUFBLEdBQW9CLE1BQUEsQ0FBQSxDQUFBLElBQUEsQ0FBQSxDQUVaLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBRyxDQUFDLE1BQWxCLENBRlksQ0FBQSxrQ0FBQSxDQUFBLENBTVosTUFBTSxDQUFDLE1BQVAsQ0FBYyxHQUFHLENBQUMsTUFBbEIsQ0FOWSxDQUFBLEVBQUEsQ0FBQSxFQVFmLEdBUmUsRUFKeEI7Ozs7O01BaUJJLEdBQUEsR0FBb0IsUUFBQSxDQUFFLENBQUYsQ0FBQTtBQUNsQixlQUFPLENBQUEsQ0FBQSxDQUFBLENBQTZCLENBQUUsT0FBTyxDQUFULENBQUEsS0FBZ0IsUUFBekMsR0FBQSxDQUFDLENBQUMsT0FBRixDQUFVLElBQVYsRUFBZ0IsS0FBaEIsQ0FBQSxHQUFBLE1BQUosQ0FBQSxDQUFBO0FBQ1AsZUFBTyxDQUFBLENBQUEsQ0FBRyxDQUFILENBQUE7TUFGVztNQUdwQixNQUFBLEdBQ0U7UUFBQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFBLHFCQUFBLFFBQW1DLE1BQW5DLENBQUEsQ0FBdEI7UUFDQSxvQkFBQSxFQUE0Qix1QkFBTixNQUFBLHFCQUFBLFFBQW1DLE1BQW5DLENBQUE7TUFEdEI7TUFFRixFQUFBLEdBQWdCLE9BQUEsQ0FBUSxTQUFSO01BQ2hCLElBQUEsR0FBZ0IsT0FBQSxDQUFRLFdBQVIsRUF4QnBCOztNQTBCSSxNQUFBLEdBQVMsUUFBQSxDQUFFLElBQUYsQ0FBQTtBQUNiLFlBQUE7QUFBTTtVQUFJLEVBQUUsQ0FBQyxRQUFILENBQVksSUFBWixFQUFKO1NBQXFCLGNBQUE7VUFBTTtBQUFXLGlCQUFPLE1BQXhCOztBQUNyQixlQUFPO01BRkEsRUExQmI7O01BOEJJLGlCQUFBLEdBQW9CLFFBQUEsQ0FBRSxJQUFGLENBQUE7QUFDeEIsWUFBQSxRQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUE7UUFDTSxJQUFzRixDQUFFLE9BQU8sSUFBVCxDQUFBLEtBQW1CLFFBQXpHOztVQUFBLE1BQU0sSUFBSSxNQUFNLENBQUMsb0JBQVgsQ0FBZ0MsQ0FBQSwyQkFBQSxDQUFBLENBQThCLEdBQUEsQ0FBSSxJQUFKLENBQTlCLENBQUEsQ0FBaEMsRUFBTjs7UUFDQSxNQUErRixJQUFJLENBQUMsTUFBTCxHQUFjLEVBQTdHO1VBQUEsTUFBTSxJQUFJLE1BQU0sQ0FBQyxvQkFBWCxDQUFnQyxDQUFBLG9DQUFBLENBQUEsQ0FBdUMsR0FBQSxDQUFJLElBQUosQ0FBdkMsQ0FBQSxDQUFoQyxFQUFOOztRQUNBLE9BQUEsR0FBVyxJQUFJLENBQUMsT0FBTCxDQUFhLElBQWI7UUFDWCxRQUFBLEdBQVcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFkO1FBQ1gsSUFBTyxtREFBUDtBQUNFLGlCQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFtQixDQUFBLENBQUEsQ0FBRyxHQUFHLENBQUMsTUFBUCxDQUFBLENBQUEsQ0FBZ0IsUUFBaEIsQ0FBQSxLQUFBLENBQUEsQ0FBZ0MsR0FBRyxDQUFDLE1BQXBDLENBQUEsQ0FBbkIsRUFEVDs7UUFFQSxDQUFBLENBQUUsS0FBRixFQUFTLEVBQVQsQ0FBQSxHQUFrQixLQUFLLENBQUMsTUFBeEI7UUFDQSxFQUFBLEdBQWtCLENBQUEsQ0FBQSxDQUFHLENBQUUsUUFBQSxDQUFTLEVBQVQsRUFBYSxFQUFiLENBQUYsQ0FBQSxHQUFzQixDQUF6QixDQUFBLENBQTRCLENBQUMsUUFBN0IsQ0FBc0MsQ0FBdEMsRUFBeUMsR0FBekM7UUFDbEIsSUFBQSxHQUFrQjtBQUNsQixlQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFtQixDQUFBLENBQUEsQ0FBRyxHQUFHLENBQUMsTUFBUCxDQUFBLENBQUEsQ0FBZ0IsS0FBaEIsQ0FBQSxDQUFBLENBQUEsQ0FBeUIsRUFBekIsQ0FBQSxDQUFBLENBQThCLEdBQUcsQ0FBQyxNQUFsQyxDQUFBLENBQW5CO01BWFcsRUE5QnhCOztNQTJDSSxzQkFBQSxHQUF5QixRQUFBLENBQUUsSUFBRixDQUFBO0FBQzdCLFlBQUEsQ0FBQSxFQUFBO1FBQU0sQ0FBQSxHQUFnQjtRQUNoQixhQUFBLEdBQWdCLENBQUM7QUFFakIsZUFBQSxJQUFBLEdBQUE7OztVQUVFLGFBQUE7VUFDQSxJQUFHLGFBQUEsR0FBZ0IsR0FBRyxDQUFDLFdBQXZCO1lBQ0csTUFBTSxJQUFJLE1BQU0sQ0FBQyxvQkFBWCxDQUFnQyxDQUFBLGdCQUFBLENBQUEsQ0FBbUIsYUFBbkIsQ0FBQSxpQkFBQSxDQUFBLENBQW9ELEdBQUEsQ0FBSSxDQUFKLENBQXBELENBQUEsT0FBQSxDQUFoQyxFQURUO1dBRlI7O1VBS1EsQ0FBQSxHQUFJLGlCQUFBLENBQWtCLENBQWxCO1VBQ0osS0FBYSxNQUFBLENBQU8sQ0FBUCxDQUFiO0FBQUEsa0JBQUE7O1FBUEY7QUFRQSxlQUFPO01BWmdCLEVBM0M3Qjs7OztBQTJESSxhQUFPLE9BQUEsR0FBVSxDQUFFLHNCQUFGLEVBQTBCLGlCQUExQixFQUE2QyxNQUE3QyxFQUFxRCxpQkFBckQsRUFBd0UsTUFBeEU7SUE1RFMsQ0FBNUI7OztJQWdFQSwwQkFBQSxFQUE0QixRQUFBLENBQUEsQ0FBQTtBQUM5QixVQUFBLEVBQUEsRUFBQSxPQUFBLEVBQUEsdUJBQUEsRUFBQTtNQUFJLEVBQUEsR0FBSyxPQUFBLENBQVEsb0JBQVIsRUFBVDs7TUFFSSx1QkFBQSxHQUEwQixRQUFBLENBQUUsT0FBRixFQUFXLEtBQVgsQ0FBQTtBQUN4QixlQUFPLENBQUUsRUFBRSxDQUFDLFFBQUgsQ0FBWSxPQUFaLEVBQXFCO1VBQUUsUUFBQSxFQUFVLE9BQVo7VUFBcUI7UUFBckIsQ0FBckIsQ0FBRixDQUFzRCxDQUFDLE9BQXZELENBQStELE1BQS9ELEVBQXVFLEVBQXZFO01BRGlCLEVBRjlCOztNQU1JLHNCQUFBLEdBQXlCLFFBQUEsQ0FBRSxJQUFGLENBQUEsRUFBQTs7QUFFdkIsZUFBTyxRQUFBLENBQVcsdUJBQUEsQ0FBd0Isc0JBQXhCLEVBQWdELElBQWhELENBQVgsRUFBbUUsRUFBbkU7TUFGZ0IsRUFON0I7O0FBV0ksYUFBTyxPQUFBLEdBQVUsQ0FBRSx1QkFBRixFQUEyQixzQkFBM0I7SUFaUyxDQWhFNUI7OztJQWlGQSwyQkFBQSxFQUE2QixRQUFBLENBQUEsQ0FBQTtBQUMvQixVQUFBLENBQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxFQUFBLEVBQUEsR0FBQSxFQUFBLGtCQUFBLEVBQUE7TUFBSSxDQUFBO1FBQUUsdUJBQUEsRUFBeUI7TUFBM0IsQ0FBQSxHQUFrQyxDQUFFLE9BQUEsQ0FBUSxjQUFSLENBQUYsQ0FBMEIsQ0FBQywrQkFBM0IsQ0FBQSxDQUFsQztNQUNBLEVBQUEsR0FBTSxDQUFDLENBQUM7TUFDUixFQUFBLEdBQU0sQ0FBQyxDQUFDO01BQ1IsR0FBQSxHQUFNLENBQUMsQ0FBQztNQUNSLEdBQUEsR0FBTSxDQUFDLENBQUMsV0FKWjs7TUFPSSxrQkFBQSxHQUFxQixRQUFBLENBQUUsVUFBRixDQUFBLEVBQUE7O0FBQ3pCLFlBQUEsQ0FBQSxFQUFBO1FBQ00sY0FBQSxHQUFrQixDQUFFLElBQUksQ0FBQyxLQUFMLENBQVcsVUFBWCxDQUFGLENBQXlCLENBQUMsUUFBMUIsQ0FBQSxDQUFvQyxDQUFDLFFBQXJDLENBQThDLENBQTlDO1FBQ2xCLElBQUcsVUFBQSxLQUFjLElBQWQsSUFBc0IsVUFBQSxJQUFjLENBQXZDO0FBQStDLGlCQUFPLENBQUEsQ0FBQSxDQUFHLGNBQUgsQ0FBQSxpQkFBQSxFQUF0RDs7UUFDQSxJQUFHLFVBQUEsSUFBYyxHQUFqQjtBQUErQyxpQkFBTyxDQUFBLENBQUEsQ0FBRyxjQUFILENBQUEsaUJBQUEsRUFBdEQ7O1FBQ0EsVUFBQSxHQUFvQixJQUFJLENBQUMsS0FBTCxDQUFXLFVBQUEsR0FBYSxHQUFiLEdBQW1CLEdBQTlCO1FBQ3BCLENBQUEsR0FBa0IsR0FBRyxDQUFDLE1BQUosWUFBVyxhQUFjLEVBQXpCO0FBQ2xCLHVCQUFPLFlBQWMsRUFBckI7QUFBQSxlQUNPLENBRFA7WUFDYyxDQUFBLElBQUs7QUFBWjtBQURQLGVBRU8sQ0FGUDtZQUVjLENBQUEsSUFBSztBQUFaO0FBRlAsZUFHTyxDQUhQO1lBR2MsQ0FBQSxJQUFLO0FBQVo7QUFIUCxlQUlPLENBSlA7WUFJYyxDQUFBLElBQUs7QUFBWjtBQUpQLGVBS08sQ0FMUDtZQUtjLENBQUEsSUFBSztBQUFaO0FBTFAsZUFNTyxDQU5QO1lBTWMsQ0FBQSxJQUFLO0FBQVo7QUFOUCxlQU9PLENBUFA7WUFPYyxDQUFBLElBQUs7QUFBWjtBQVBQLGVBUU8sQ0FSUDtZQVFjLENBQUEsSUFBSztBQVJuQjtBQVNBLGVBQU8sQ0FBQSxDQUFBLENBQUcsY0FBSCxDQUFBLEdBQUEsQ0FBQSxDQUF1QixFQUFBLEdBQUcsRUFBMUIsQ0FBQSxDQUFBLENBQStCLENBQUMsQ0FBQyxNQUFGLENBQVMsRUFBVCxDQUEvQixDQUFBLENBQUEsQ0FBNkMsR0FBQSxHQUFJLEdBQWpELENBQUEsQ0FBQTtNQWhCWSxFQVB6Qjs7TUEwQkkscUJBQUEsR0FBd0IsUUFBQSxDQUFFLENBQUYsQ0FBQTtBQUM1QixZQUFBO1FBQU0sSUFBRyxDQUFBLEtBQUssSUFBTCxJQUFhLENBQUEsSUFBSyxDQUFyQjtBQUE2QixpQkFBTyxnQkFBcEM7U0FBTjs7UUFFTSxJQUFHLENBQUEsSUFBSyxHQUFSO0FBQTZCLGlCQUFPLGdCQUFwQzs7UUFDQSxDQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFBLEdBQUksR0FBSixHQUFVLEdBQXJCLEVBSFo7O1FBS00sQ0FBQSxHQUFJLEdBQUcsQ0FBQyxNQUFKLFlBQVcsSUFBSyxFQUFoQjtBQUNKLHVCQUFPLEdBQUssRUFBWjtBQUFBLGVBQ08sQ0FEUDtZQUNjLENBQUEsSUFBSztBQUFaO0FBRFAsZUFFTyxDQUZQO1lBRWMsQ0FBQSxJQUFLO0FBQVo7QUFGUCxlQUdPLENBSFA7WUFHYyxDQUFBLElBQUs7QUFBWjtBQUhQLGVBSU8sQ0FKUDtZQUljLENBQUEsSUFBSztBQUFaO0FBSlAsZUFLTyxDQUxQO1lBS2MsQ0FBQSxJQUFLO0FBQVo7QUFMUCxlQU1PLENBTlA7WUFNYyxDQUFBLElBQUs7QUFBWjtBQU5QLGVBT08sQ0FQUDtZQU9jLENBQUEsSUFBSztBQUFaO0FBUFAsZUFRTyxDQVJQO1lBUWMsQ0FBQSxJQUFLO0FBUm5CLFNBTk47O0FBZ0JNLGVBQU8sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxFQUFUO01BakJlLEVBMUI1Qjs7QUE4Q0ksYUFBTyxPQUFBLEdBQVUsQ0FBRSxrQkFBRjtJQS9DVSxDQWpGN0I7OztJQW9JQSxvQkFBQSxFQUFzQixRQUFBLENBQUEsQ0FBQSxFQUFBOztBQUN4QixVQUFBLENBQUEsRUFBQSxFQUFBLEVBQUEsWUFBQSxFQUFBLFlBQUEsRUFBQSxPQUFBLEVBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxJQUFBLEVBQUEsVUFBQSxFQUFBLFNBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLGFBQUEsRUFBQSxVQUFBLEVBQUEsU0FBQSxFQUFBLE9BQUEsRUFBQTtNQUFJLENBQUE7UUFBRSx1QkFBQSxFQUF5QjtNQUEzQixDQUFBLEdBQWtDLENBQUUsT0FBQSxDQUFRLGNBQVIsQ0FBRixDQUEwQixDQUFDLCtCQUEzQixDQUFBLENBQWxDO01BQ0EsQ0FBQSxDQUFFLFVBQUYsQ0FBQSxHQUFrQyxDQUFFLE9BQUEsQ0FBUSxjQUFSLENBQUYsQ0FBMEIsQ0FBQyxrQkFBM0IsQ0FBQSxDQUFsQztNQUNBLENBQUEsQ0FBRSxPQUFGLENBQUEsR0FBa0MsQ0FBRSxPQUFBLENBQVEsOEJBQVIsQ0FBRixDQUEwQyxDQUFDLGVBQTNDLENBQUEsQ0FBbEM7TUFDQSxDQUFBLENBQUUsSUFBRixDQUFBLEdBQWtDLENBQUUsT0FBQSxDQUFRLGlCQUFSLENBQUYsQ0FBNkIsQ0FBQyw4QkFBOUIsQ0FBQSxDQUFsQztNQUNBLENBQUE7UUFBRSxjQUFBLEVBQWdCO01BQWxCLENBQUEsR0FBa0MsQ0FBRSxPQUFBLENBQVEsUUFBUixDQUFGLENBQW9CLENBQUMsUUFBUSxDQUFDLFlBQTlCLENBQUEsQ0FBbEM7TUFFQSxFQUFBLEdBQWtDLE9BQUEsQ0FBUSxTQUFSLEVBTnRDOztNQVNJLE1BQUEsR0FBNEIsQ0FBQTtNQUM1QixNQUFNLENBQUMsS0FBUCxHQUE0QixDQUFDLENBQUMsTUFWbEM7TUFXSSxNQUFNLENBQUMsV0FBUCxHQUE0QixDQUFDLENBQUMsS0FBRixHQUFZLENBQUMsQ0FBQyxPQUFkLEdBQTRCLENBQUMsQ0FBQztNQUMxRCxNQUFNLENBQUMsU0FBUCxHQUE0QixDQUFDLENBQUMsSUFBRixHQUFZLENBQUMsQ0FBQyxPQUFkLEdBQTRCLENBQUMsQ0FBQztNQUMxRCxNQUFNLENBQUMsTUFBUCxHQUE0QixDQUFDLENBQUMsS0FBRixHQUFZLENBQUMsQ0FBQyxPQUFkLEdBQTRCLENBQUMsQ0FBQztNQUMxRCxNQUFNLENBQUMsT0FBUCxHQUE0QixDQUFDLENBQUMsS0FBRixHQUFZLENBQUMsQ0FBQyxPQUFkLEdBQTRCLENBQUMsQ0FBQztNQUMxRCxNQUFNLENBQUMsU0FBUCxHQUE0QixDQUFDLENBQUMsS0FBRixHQUFZLENBQUMsQ0FBQyxPQUFkLEdBQTRCLENBQUMsQ0FBQztNQUMxRCxNQUFNLENBQUMsT0FBUCxHQUE0QixDQUFDLENBQUMsY0FBRixHQUFvQixDQUFDLENBQUMsZUFoQnREOztNQWtCSSxNQUFNLENBQUMsR0FBUCxHQUE0QixDQUFDLENBQUMsS0FBRixHQUFvQixDQUFDLENBQUMsY0FBdEIsR0FBdUMsQ0FBQyxDQUFDO01BQ3JFLE1BQU0sQ0FBQyxJQUFQLEdBQTRCLENBQUMsQ0FBQyxNQUFGLEdBQXVCLENBQUMsQ0FBQyxPQUF6QixHQUFtQyxDQUFDLENBQUMsS0FuQnJFOztNQXFCSSxNQUFNLENBQUMsU0FBUCxHQUE0QixDQUFDLENBQUMsY0FBRixHQUFvQixDQUFDLENBQUMsU0FyQnREOztNQXVCSSxVQUFBLEdBQTRCLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBZDtNQUM1QixVQUFVLENBQUMsV0FBWCxHQUE0QixDQUFDLENBQUMsS0FBRixHQUFZLENBQUMsQ0FBQyxTQUFkLEdBQTRCLENBQUMsQ0FBQztNQUMxRCxVQUFVLENBQUMsU0FBWCxHQUE0QixDQUFDLENBQUMsSUFBRixHQUFZLENBQUMsQ0FBQyxTQUFkLEdBQTRCLENBQUMsQ0FBQztNQUMxRCxVQUFVLENBQUMsTUFBWCxHQUE0QixDQUFDLENBQUMsS0FBRixHQUFZLENBQUMsQ0FBQyxTQUFkLEdBQTRCLENBQUMsQ0FBQyxLQTFCOUQ7O01BNEJJLFlBQUEsR0FBNEIsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFkO01BQzVCLFlBQVksQ0FBQyxXQUFiLEdBQTRCLENBQUMsQ0FBQyxLQUFGLEdBQVksQ0FBQyxDQUFDLFdBQWQsR0FBNEIsQ0FBQyxDQUFDO01BQzFELFlBQVksQ0FBQyxTQUFiLEdBQTRCLENBQUMsQ0FBQyxJQUFGLEdBQVksQ0FBQyxDQUFDLFdBQWQsR0FBNEIsQ0FBQyxDQUFDO01BQzFELFlBQVksQ0FBQyxNQUFiLEdBQTRCLENBQUMsQ0FBQyxLQUFGLEdBQVksQ0FBQyxDQUFDLFdBQWQsR0FBNEIsQ0FBQyxDQUFDLEtBL0I5RDs7TUFpQ0ksVUFBQSxHQUE0QixNQUFNLENBQUMsTUFBUCxDQUFjLE1BQWQ7TUFDNUIsVUFBVSxDQUFDLFdBQVgsR0FBNEIsQ0FBQyxDQUFDLElBQUYsR0FBWSxDQUFDLENBQUM7TUFDMUMsVUFBVSxDQUFDLFNBQVgsR0FBNEIsQ0FBQyxDQUFDLElBQUYsR0FBWSxDQUFDLENBQUM7TUFDMUMsVUFBVSxDQUFDLE9BQVgsR0FBNEIsQ0FBQyxDQUFDLElBQUYsR0FBWSxDQUFDLENBQUM7TUFDMUMsVUFBVSxDQUFDLFNBQVgsR0FBNEIsQ0FBQyxDQUFDLElBQUYsR0FBWSxDQUFDLENBQUM7TUFDMUMsVUFBVSxDQUFDLE1BQVgsR0FBNEIsQ0FBQyxDQUFDLElBQUYsR0FBWSxDQUFDLENBQUMsZUF0QzlDOztNQXdDSSxZQUFBLEdBQTRCLENBQUE7TUFDNUIsWUFBWSxDQUFDLElBQWIsR0FBNEIsQ0FBQyxDQUFDLEtBQUYsR0FBWSxDQUFDLENBQUMsU0FBZCxHQUErQixDQUFDLENBQUM7TUFDN0QsWUFBWSxDQUFDLEtBQWIsR0FBNEIsTUFBTSxDQUFDLE1BMUN2Qzs7TUE0Q0ksVUFBQSxHQUE0QixDQUFBO01BQzVCLFVBQVUsQ0FBQyxRQUFYLEdBQTRCLENBQUMsQ0FBQyxLQUFGLEdBQVksQ0FBQyxDQUFDLE1BQWQsR0FBNEIsQ0FBQyxDQUFDO01BQzFELFVBQVUsQ0FBQyxLQUFYLEdBQTRCLE1BQU0sQ0FBQyxNQTlDdkM7O01BZ0RJLFNBQUEsR0FDRTtRQUFBLFlBQUEsRUFDRTtVQUFBLFFBQUEsRUFBZ0IsSUFBaEI7VUFDQSxPQUFBLEVBQWdCLENBRGhCO1VBRUEsT0FBQSxFQUNFO1lBQUEsSUFBQSxFQUFnQixFQUFoQjtZQUNBLE1BQUEsRUFBZ0I7VUFEaEIsQ0FIRjtVQUtBLEtBQUEsRUFDRTtZQUFBLElBQUEsRUFBZ0IsTUFBaEI7WUFDQSxRQUFBLEVBQWdCLFVBRGhCO1lBRUEsUUFBQSxFQUFnQixVQUZoQjtZQUdBLFVBQUEsRUFBZ0IsWUFIaEI7WUFJQSxVQUFBLEVBQWdCLFlBSmhCO1lBS0EsUUFBQSxFQUFnQjtVQUxoQjtRQU5GO01BREYsRUFqRE47O01BZ0VJLGFBQUEsR0FBZ0I7TUFhaEIsU0FBQSxHQUFZLE1BQU0sQ0FBQyxNQUFQLENBQWMsQ0FBRSxTQUFGLENBQWQsRUE3RWhCOztNQWdGVSxlQUFOLE1BQUEsYUFBQSxDQUFBOztRQUdFLFdBQWEsQ0FBRSxHQUFGLENBQUE7QUFDbkIsY0FBQTtVQUFRLElBQUMsQ0FBQSxHQUFELEdBQW9CLENBQUUsR0FBQSxTQUFTLENBQUMsWUFBWixFQUE2QixHQUFBLEdBQTdCO1VBQ3BCLElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQWIsR0FBb0IsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBYixHQUFvQixJQUFDLENBQUEsR0FBRyxDQUFDLE9BQU8sQ0FBQztVQUNyRCxFQUFBLEdBQUssQ0FBQSxHQUFFLENBQUYsQ0FBQSxHQUFBO21CQUFZLElBQUMsQ0FBQSxNQUFELENBQVEsR0FBQSxDQUFSO1VBQVo7VUFDTCxNQUFNLENBQUMsY0FBUCxDQUFzQixFQUF0QixFQUEwQixJQUExQjtVQUNBLElBQUEsQ0FBSyxJQUFMLEVBQVEsbUJBQVIsRUFBZ0MsQ0FBQSxDQUFBLENBQUEsR0FBQTtBQUN4QyxnQkFBQSxJQUFBLEVBQUE7QUFBVTtjQUFJLElBQUEsR0FBTyxPQUFBLENBQVEsV0FBUixFQUFYO2FBQStCLGNBQUE7Y0FBTTtBQUFXLHFCQUFPLEtBQXhCOztBQUMvQixtQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQWQsQ0FBbUIsSUFBbkI7VUFGdUIsQ0FBQSxHQUFoQztVQUdBLElBQUEsQ0FBSyxJQUFMLEVBQVEsT0FBUixFQUFpQjtZQUFFLEtBQUEsRUFBTyxJQUFJLEdBQUosQ0FBQTtVQUFULENBQWpCO0FBQ0EsaUJBQU87UUFUSSxDQURuQjs7O1FBYU0sTUFBUSxDQUFFLGNBQUYsQ0FBQSxFQUFBOztBQUNkLGNBQUEsS0FBQSxFQUFBLFFBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQTtBQUNRLGtCQUFPLElBQUEsR0FBTyxPQUFBLENBQVEsY0FBUixDQUFkO0FBQUEsaUJBQ08sT0FEUDtjQUVJLEtBQUEsR0FBWTtjQUNaLEtBQUEsR0FBWSxLQUFLLENBQUM7QUFGZjtBQURQLGlCQUlPLE1BSlA7Y0FLSSxLQUFBLEdBQVk7Y0FDWixLQUFBLEdBQVk7QUFGVDtBQUpQOztjQVFPLE1BQU0sSUFBSSxLQUFKLENBQVUsQ0FBQSx5Q0FBQSxDQUFBLENBQTRDLElBQTVDLENBQUEsQ0FBVjtBQVJiO1VBU0EsS0FBQSxHQUFRLEtBQUssQ0FBQyxLQUFOLENBQVksSUFBWjtVQUNSLElBQUcsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFsQjtZQUNFLFFBQUEsR0FBWSxJQUFDLENBQUEsZUFBRCxDQUFpQixLQUFLLENBQUMsS0FBTixDQUFBLENBQWpCLEVBQWdDLEtBQWhDO1lBQ1osS0FBQSxHQUFZLEtBQUssQ0FBQyxPQUFOLENBQUE7WUFDWixLQUFBOztBQUFjO2NBQUEsS0FBQSx1Q0FBQTs7NkJBQUUsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFiO2NBQUYsQ0FBQTs7O0FBQ2QsbUJBQU8sQ0FBRSxRQUFGLEVBQVksR0FBQSxLQUFaLEVBQXNCLFFBQXRCLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsSUFBdkMsRUFKVDs7QUFLQSxpQkFBTyxJQUFDLENBQUEsV0FBRCxDQUFhLElBQWI7UUFqQkQsQ0FiZDs7O1FBaUNNLFVBQVksQ0FBRSxJQUFGLENBQUEsRUFBQTs7QUFDbEIsY0FBQSxDQUFBLEVBQUEsV0FBQSxFQUFBLEtBQUEsRUFBQSxTQUFBLEVBQUE7VUFDUSxJQUFPLENBQUUsSUFBQSxHQUFPLE9BQUEsQ0FBUSxJQUFSLENBQVQsQ0FBQSxLQUEyQixNQUFsQztZQUNFLE1BQU0sSUFBSSxLQUFKLENBQVUsQ0FBQSw2QkFBQSxDQUFBLENBQWdDLElBQWhDLENBQUEsQ0FBVixFQURSO1dBRFI7O1VBSVEsSUFBRyxjQUFVLE1BQVIsVUFBRixDQUFIO1lBQ0UsTUFBTSxJQUFJLEtBQUosQ0FBVSwyREFBVixFQURSOztVQUdBLElBQWtELDJDQUFsRDtBQUFBLG1CQUFPLENBQUE7O2NBQUUsSUFBQSxFQUFNLElBQVI7Y0FBYyxJQUFBLEVBQU07WUFBcEIsRUFBUDtXQVBSOztVQVNRLENBQUEsR0FBYyxDQUFFLEdBQUEsS0FBSyxDQUFDLE1BQVI7VUFDZCxXQUFBLEdBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFQLENBQWtCLE9BQWxCOztZQUNkLENBQUMsQ0FBQyxTQUFZOztVQUNkLENBQUMsQ0FBQyxPQUFGLEdBQWMsUUFBQSxDQUFTLENBQUMsQ0FBQyxPQUFYLEVBQXNCLEVBQXRCO1VBQ2QsQ0FBQyxDQUFDLFNBQUYsR0FBYyxRQUFBLENBQVMsQ0FBQyxDQUFDLFNBQVgsRUFBc0IsRUFBdEIsRUFidEI7O1VBZVEsSUFBRyxnQ0FBQSxJQUF3QixDQUFFLENBQUksV0FBTixDQUF4QixJQUFnRCxDQUFFLElBQUMsQ0FBQSxHQUFHLENBQUMsUUFBTCxLQUFtQixLQUFyQixDQUFuRDtZQUNFLFNBQUEsR0FBbUIsQ0FBRSxJQUFDLENBQUEsR0FBRyxDQUFDLFFBQUwsS0FBaUIsSUFBbkIsQ0FBSCxHQUFrQyxPQUFPLENBQUMsR0FBUixDQUFBLENBQWxDLEdBQXFELElBQUMsQ0FBQSxHQUFHLENBQUM7WUFDMUUsQ0FBQyxDQUFDLElBQUYsR0FBa0IsSUFBQyxDQUFBLGlCQUFELENBQW1CLFNBQW5CLEVBQThCLENBQUMsQ0FBQyxJQUFoQztZQUNsQixDQUFDLENBQUMsV0FBRixHQUFnQixDQUFFLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixTQUFuQixFQUE4QixDQUFDLENBQUMsV0FBaEMsQ0FBRixDQUFBLEdBQWtELElBSHBFO1dBZlI7Ozs7QUFzQlEsa0JBQU8sSUFBUDtBQUFBLGlCQUNPLFdBRFA7Y0FDd0QsQ0FBQyxDQUFDLElBQUYsR0FBUztBQUExRDtBQURQLGlCQUVPLGtCQUFrQixDQUFDLElBQW5CLENBQXdCLENBQUMsQ0FBQyxJQUExQixDQUZQO2NBRXdELENBQUMsQ0FBQyxJQUFGLEdBQVM7QUFBMUQ7QUFGUCxpQkFHTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEIsQ0FIUDtjQUd3RCxDQUFDLENBQUMsSUFBRixHQUFTO0FBQTFEO0FBSFA7Y0FJd0QsQ0FBQyxDQUFDLElBQUYsR0FBUztBQUpqRTtBQUtBLGlCQUFPO1FBNUJHLENBakNsQjs7O1FBZ0VNLFdBQWEsQ0FBRSxJQUFGLENBQUE7QUFDbkIsY0FBQSxPQUFBLEVBQUEsZ0JBQUEsRUFBQTtVQUFRLENBQUEsQ0FBRSxVQUFGLEVBQ0UsZ0JBREYsQ0FBQSxHQUMwQixJQUFDLENBQUEsd0JBQUQsQ0FBMEIsSUFBMUIsQ0FEMUI7VUFFQSxPQUFBLEdBQWEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFMLEtBQWdCLEtBQW5CLEdBQThCLEVBQTlCLEdBQXNDLElBQUMsQ0FBQSxZQUFELENBQWMsVUFBZDtBQUNoRCxpQkFBTyxDQUFFLGdCQUFGLEVBQW9CLEdBQUEsT0FBcEIsQ0FBaUMsQ0FBQyxJQUFsQyxDQUF1QyxJQUF2QztRQUpJLENBaEVuQjs7O1FBdUVNLGVBQWlCLENBQUUsSUFBRixFQUFRLFFBQVEsSUFBaEIsQ0FBQTtBQUN2QixjQUFBLFdBQUEsRUFBQSxHQUFBLEVBQUE7VUFBUSxLQUFBLEdBQWMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUM7VUFDekIsV0FBQSwyRUFBd0M7VUFDeEMsSUFBQSxHQUFjLENBQUEsRUFBQSxDQUFBLENBQUssV0FBTCxDQUFBLEVBQUEsQ0FBQSxDQUFxQixJQUFyQixDQUFBO1VBQ2QsSUFBQSxHQUFjLElBQUksQ0FBQyxNQUFMLENBQVksSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBekIsRUFBK0IsR0FBL0I7QUFDZCxpQkFBTyxLQUFLLENBQUMsUUFBTixHQUFpQixJQUFqQixHQUF3QixLQUFLLENBQUM7UUFMdEIsQ0F2RXZCOzs7UUErRU0sd0JBQTBCLENBQUUsSUFBRixDQUFBO0FBQ2hDLGNBQUEsTUFBQSxFQUFBLGFBQUEsRUFBQSxTQUFBLEVBQUEsU0FBQSxFQUFBLFdBQUEsRUFBQSxPQUFBLEVBQUEsY0FBQSxFQUFBLFlBQUEsRUFBQSxXQUFBLEVBQUEsZ0JBQUEsRUFBQSxVQUFBLEVBQUE7VUFBUSxVQUFBLEdBQWtCLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWjtVQUNsQixLQUFBLEdBQWtCLElBQUMsQ0FBQSxHQUFHLENBQUMsS0FBSyxDQUFFLFVBQVUsQ0FBQyxJQUFiLEVBRHBDOztVQUdRLElBQUcsVUFBVSxDQUFDLElBQVgsS0FBbUIsWUFBdEI7WUFDRSxnQkFBQSxHQUFtQixLQUFLLENBQUMsSUFBTixHQUFhLFVBQVUsQ0FBQyxJQUF4QixHQUErQixLQUFLLENBQUM7QUFDeEQsbUJBQU8sQ0FBRSxVQUFGLEVBQWMsZ0JBQWQsRUFGVDtXQUhSOztVQU9RLFdBQUEsR0FBa0IsS0FBSyxDQUFDLFdBQU4sR0FBcUIsR0FBckIsR0FBOEIsVUFBVSxDQUFDLFdBQXpDLEdBQXdELEVBQXhELEdBQWlFLEtBQUssQ0FBQztVQUN6RixTQUFBLEdBQWtCLEtBQUssQ0FBQyxTQUFOLEdBQXFCLEVBQXJCLEdBQThCLFVBQVUsQ0FBQyxTQUF6QyxHQUF3RCxHQUF4RCxHQUFpRSxLQUFLLENBQUM7VUFDekYsT0FBQSxHQUFrQixLQUFLLENBQUMsT0FBTixHQUFxQixJQUFyQixHQUE4QixVQUFVLENBQUMsT0FBekMsR0FBd0QsRUFBeEQsR0FBaUUsS0FBSyxDQUFDO1VBQ3pGLFNBQUEsR0FBa0IsS0FBSyxDQUFDLFNBQU4sR0FBcUIsR0FBckIsR0FBOEIsVUFBVSxDQUFDLFNBQXpDLEdBQXdELElBQXhELEdBQWlFLEtBQUssQ0FBQztVQUN6RixNQUFBLEdBQWtCLEtBQUssQ0FBQyxNQUFOLEdBQXFCLEtBQXJCLEdBQThCLFVBQVUsQ0FBQyxNQUF6QyxHQUF3RCxLQUF4RCxHQUFpRSxLQUFLLENBQUMsTUFYakc7O1VBYVEsV0FBQSxHQUFrQixDQUFFLFVBQUEsQ0FBVyxXQUFBLEdBQWMsU0FBZCxHQUEwQixPQUExQixHQUFvQyxTQUEvQyxDQUFGLENBQTZELENBQUM7VUFDaEYsYUFBQSxHQUFrQixDQUFFLFVBQUEsQ0FBVyxNQUFYLENBQUYsQ0FBNkQsQ0FBQyxPQWR4Rjs7VUFnQlEsV0FBQSxHQUFrQixJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFDLENBQUEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFiLEdBQXlCLFdBQXJDO1VBQ2xCLGFBQUEsR0FBa0IsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBYixHQUF1QixhQUFuQyxFQWpCMUI7O1VBbUJRLFlBQUEsR0FBa0IsS0FBSyxDQUFDLFdBQU4sR0FBb0IsQ0FBRSxHQUFHLENBQUMsTUFBSixDQUFjLFdBQWQsQ0FBRixDQUFwQixHQUFvRCxLQUFLLENBQUM7VUFDNUUsY0FBQSxHQUFrQixLQUFLLENBQUMsTUFBTixHQUFvQixDQUFFLEdBQUcsQ0FBQyxNQUFKLENBQVksYUFBWixDQUFGLENBQXBCLEdBQW9ELEtBQUssQ0FBQyxNQXBCcEY7O1VBc0JRLGdCQUFBLEdBQW9CLFdBQUEsR0FBYyxTQUFkLEdBQTBCLE9BQTFCLEdBQW9DLFNBQXBDLEdBQWdELFlBQWhELEdBQStELE1BQS9ELEdBQXdFO0FBQzVGLGlCQUFPLENBQUUsVUFBRixFQUFjLGdCQUFkO1FBeEJpQixDQS9FaEM7OztRQTBHTSxZQUFjLENBQUUsVUFBRixDQUFBO0FBQ3BCLGNBQUEsQ0FBQSxFQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsS0FBQSxFQUFBLFNBQUEsRUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEVBQUE7VUFBUSxJQUFhLFFBQUUsVUFBVSxDQUFDLFVBQVUsY0FBckIsUUFBaUMsWUFBbkMsQ0FBQSxJQUF3RCxDQUFFLFVBQVUsQ0FBQyxJQUFYLEtBQW1CLEVBQXJCLENBQXJFO0FBQUEsbUJBQU8sR0FBUDs7QUFDQTtZQUNFLE1BQUEsR0FBUyxFQUFFLENBQUMsWUFBSCxDQUFnQixVQUFVLENBQUMsSUFBM0IsRUFBaUM7Y0FBRSxRQUFBLEVBQVU7WUFBWixDQUFqQyxFQURYO1dBRUEsY0FBQTtZQUFNO1lBQ0osSUFBbUIsS0FBSyxDQUFDLElBQU4sS0FBYyxRQUFqQztjQUFBLE1BQU0sTUFBTjs7QUFDQSxtQkFBTyxDQUFFLENBQUEsb0JBQUEsQ0FBQSxDQUF1QixHQUFBLENBQUksVUFBVSxDQUFDLElBQWYsQ0FBdkIsQ0FBQSxDQUFGLEVBRlQ7V0FIUjs7VUFPUSxLQUFBLEdBQVksSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUUsVUFBVSxDQUFDLElBQWI7VUFDdEIsU0FBQSxHQUFZO1VBQ1osS0FBQSxHQUFZLElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQWIsR0FBb0IsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBakMsR0FBMEM7VUFDdEQsTUFBQSxHQUFZLE1BQU0sQ0FBQyxLQUFQLENBQWEsSUFBYjtVQUNaLE9BQUEsR0FBWSxVQUFVLENBQUMsT0FBWCxHQUFxQixFQVh6Qzs7O1VBY1EsU0FBQSxHQUFZLElBQUksQ0FBQyxHQUFMLENBQVcsT0FBQSxHQUFVLElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBMUIsRUFBcUMsQ0FBckM7VUFDWixRQUFBLEdBQVksSUFBSSxDQUFDLEdBQUwsQ0FBVyxPQUFBLEdBQVUsSUFBQyxDQUFBLEdBQUcsQ0FBQyxPQUExQixFQUFxQyxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUFyRDtVQUNaLENBQUEsR0FBWSxHQWhCcEI7O1VBa0JRLEtBQVcsbUhBQVg7WUFDRSxJQUFBLEdBQVksTUFBTSxDQUFFLEdBQUY7WUFDbEIsU0FBQSxHQUFZLEtBQUssQ0FBQyxTQUFOLEdBQWtCLENBQUUsQ0FBQSxDQUFBLENBQUcsR0FBQSxHQUFNLENBQVQsRUFBQSxDQUFhLENBQUMsUUFBZCxDQUF1QixTQUF2QixFQUFrQyxHQUFsQyxDQUFGO1lBQzlCLElBQUssR0FBQSxLQUFPLE9BQVo7Y0FDRSxNQUFBLEdBQVksSUFBSTtjQUNoQixJQUFBLEdBQVksSUFBSTtjQUNoQixNQUFBLEdBQVksR0FBRyxDQUFDLE1BQUosQ0FBVyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxLQUFBLEdBQVEsSUFBSSxDQUFDLE1BQXpCLENBQVg7Y0FDWixDQUFDLENBQUMsSUFBRixDQUFPLFNBQUEsR0FBWSxLQUFLLENBQUMsR0FBbEIsR0FBd0IsTUFBeEIsR0FBaUMsS0FBSyxDQUFDLElBQXZDLEdBQThDLElBQTlDLEdBQXFELEtBQUssQ0FBQyxHQUEzRCxHQUFpRSxNQUFqRSxHQUEwRSxLQUFLLENBQUMsS0FBdkYsRUFKRjthQUFBLE1BQUE7Y0FNRSxJQUFBLEdBQVksSUFBSSxDQUFDLE1BQUwsQ0FBWSxLQUFaLEVBQW1CLEdBQW5CO2NBQ1osQ0FBQyxDQUFDLElBQUYsQ0FBTyxTQUFBLEdBQVksS0FBSyxDQUFDLE9BQWxCLEdBQTZCLElBQTdCLEdBQW9DLEtBQUssQ0FBQyxLQUFqRCxFQVBGOztVQUhGLENBbEJSOztBQThCUSxpQkFBTztRQS9CSzs7TUE1R2hCLEVBaEZKOztBQThOSSxhQUFPLE9BQUEsR0FBYSxDQUFBLENBQUEsQ0FBQSxHQUFBO0FBQ3hCLFlBQUE7UUFBTSxZQUFBLEdBQWUsSUFBSSxZQUFKLENBQUE7QUFDZixlQUFPLENBQUUsWUFBRixFQUFnQixZQUFoQixFQUE4QixTQUE5QjtNQUZXLENBQUE7SUEvTkE7RUFwSXRCLEVBVkY7OztFQW1YQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixLQUE5QjtBQW5YQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9uZXh0X2ZyZWVfZmlsZW5hbWU6IC0+XG4gICAgY2ZnID1cbiAgICAgIG1heF9yZXRyaWVzOiAgICA5OTk5XG4gICAgICBwcmVmaXg6ICAgICAgICAgJ34uJ1xuICAgICAgc3VmZml4OiAgICAgICAgICcuYnJpY2FicmFjLWNhY2hlJ1xuICAgIGNhY2hlX2ZpbGVuYW1lX3JlID0gLy8vXG4gICAgICBeXG4gICAgICAoPzogI3tSZWdFeHAuZXNjYXBlIGNmZy5wcmVmaXh9IClcbiAgICAgICg/PGZpcnN0Pi4qKVxuICAgICAgXFwuXG4gICAgICAoPzxucj5bMC05XXs0fSlcbiAgICAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnN1ZmZpeH0gKVxuICAgICAgJFxuICAgICAgLy8vdlxuICAgICMgY2FjaGVfc3VmZml4X3JlID0gLy8vXG4gICAgIyAgICg/OiAje1JlZ0V4cC5lc2NhcGUgY2ZnLnN1ZmZpeH0gKVxuICAgICMgICAkXG4gICAgIyAgIC8vL3ZcbiAgICBycHIgICAgICAgICAgICAgICA9ICggeCApIC0+XG4gICAgICByZXR1cm4gXCInI3t4LnJlcGxhY2UgLycvZywgXCJcXFxcJ1wiIGlmICggdHlwZW9mIHggKSBpcyAnc3RyaW5nJ30nXCJcbiAgICAgIHJldHVybiBcIiN7eH1cIlxuICAgIGVycm9ycyA9XG4gICAgICBUTVBfZXhoYXVzdGlvbl9lcnJvcjogY2xhc3MgVE1QX2V4aGF1c3Rpb25fZXJyb3IgZXh0ZW5kcyBFcnJvclxuICAgICAgVE1QX3ZhbGlkYXRpb25fZXJyb3I6IGNsYXNzIFRNUF92YWxpZGF0aW9uX2Vycm9yIGV4dGVuZHMgRXJyb3JcbiAgICBGUyAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpmcydcbiAgICBQQVRIICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpwYXRoJ1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZXhpc3RzID0gKCBwYXRoICkgLT5cbiAgICAgIHRyeSBGUy5zdGF0U3luYyBwYXRoIGNhdGNoIGVycm9yIHRoZW4gcmV0dXJuIGZhbHNlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZ2V0X25leHRfZmlsZW5hbWUgPSAoIHBhdGggKSAtPlxuICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdHlwZSBjaGVja2luZyAjIyNcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX3ZhbGlkYXRpb25fZXJyb3IgXCLOqV9fXzEgZXhwZWN0ZWQgYSB0ZXh0LCBnb3QgI3tycHIgcGF0aH1cIiB1bmxlc3MgKCB0eXBlb2YgcGF0aCApIGlzICdzdHJpbmcnXG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLlRNUF92YWxpZGF0aW9uX2Vycm9yIFwizqlfX18yIGV4cGVjdGVkIGEgbm9uZW1wdHkgdGV4dCwgZ290ICN7cnByIHBhdGh9XCIgdW5sZXNzIHBhdGgubGVuZ3RoID4gMFxuICAgICAgZGlybmFtZSAgPSBQQVRILmRpcm5hbWUgcGF0aFxuICAgICAgYmFzZW5hbWUgPSBQQVRILmJhc2VuYW1lIHBhdGhcbiAgICAgIHVubGVzcyAoIG1hdGNoID0gYmFzZW5hbWUubWF0Y2ggY2FjaGVfZmlsZW5hbWVfcmUgKT9cbiAgICAgICAgcmV0dXJuIFBBVEguam9pbiBkaXJuYW1lLCBcIiN7Y2ZnLnByZWZpeH0je2Jhc2VuYW1lfS4wMDAxI3tjZmcuc3VmZml4fVwiXG4gICAgICB7IGZpcnN0LCBuciwgIH0gPSBtYXRjaC5ncm91cHNcbiAgICAgIG5yICAgICAgICAgICAgICA9IFwiI3soIHBhcnNlSW50IG5yLCAxMCApICsgMX1cIi5wYWRTdGFydCA0LCAnMCdcbiAgICAgIHBhdGggICAgICAgICAgICA9IGZpcnN0XG4gICAgICByZXR1cm4gUEFUSC5qb2luIGRpcm5hbWUsIFwiI3tjZmcucHJlZml4fSN7Zmlyc3R9LiN7bnJ9I3tjZmcuc3VmZml4fVwiXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBnZXRfbmV4dF9mcmVlX2ZpbGVuYW1lID0gKCBwYXRoICkgLT5cbiAgICAgIFIgICAgICAgICAgICAgPSBwYXRoXG4gICAgICBmYWlsdXJlX2NvdW50ID0gLTFcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgbG9vcFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZhaWx1cmVfY291bnQrK1xuICAgICAgICBpZiBmYWlsdXJlX2NvdW50ID4gY2ZnLm1heF9yZXRyaWVzXG4gICAgICAgICAgIHRocm93IG5ldyBlcnJvcnMuVE1QX2V4aGF1c3Rpb25fZXJyb3IgXCLOqV9fXzMgdG9vIG1hbnkgKCN7ZmFpbHVyZV9jb3VudH0pIHJldHJpZXM7ICBwYXRoICN7cnByIFJ9IGV4aXN0c1wiXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgUiA9IGdldF9uZXh0X2ZpbGVuYW1lIFJcbiAgICAgICAgYnJlYWsgdW5sZXNzIGV4aXN0cyBSXG4gICAgICByZXR1cm4gUlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgIyBzd2FwX3N1ZmZpeCA9ICggcGF0aCwgc3VmZml4ICkgLT4gcGF0aC5yZXBsYWNlIGNhY2hlX3N1ZmZpeF9yZSwgc3VmZml4XG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICByZXR1cm4gZXhwb3J0cyA9IHsgZ2V0X25leHRfZnJlZV9maWxlbmFtZSwgZ2V0X25leHRfZmlsZW5hbWUsIGV4aXN0cywgY2FjaGVfZmlsZW5hbWVfcmUsIGVycm9ycywgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2NvbW1hbmRfbGluZV90b29sczogLT5cbiAgICBDUCA9IHJlcXVpcmUgJ25vZGU6Y2hpbGRfcHJvY2VzcydcbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfY29tbWFuZF9saW5lX3Jlc3VsdCA9ICggY29tbWFuZCwgaW5wdXQgKSAtPlxuICAgICAgcmV0dXJuICggQ1AuZXhlY1N5bmMgY29tbWFuZCwgeyBlbmNvZGluZzogJ3V0Zi04JywgaW5wdXQsIH0gKS5yZXBsYWNlIC9cXG4kL3MsICcnXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBnZXRfd2NfbWF4X2xpbmVfbGVuZ3RoID0gKCB0ZXh0ICkgLT5cbiAgICAgICMjIyB0aHggdG8gaHR0cHM6Ly91bml4LnN0YWNrZXhjaGFuZ2UuY29tL2EvMjU4NTUxLzI4MDIwNCAjIyNcbiAgICAgIHJldHVybiBwYXJzZUludCAoIGdldF9jb21tYW5kX2xpbmVfcmVzdWx0ICd3YyAtLW1heC1saW5lLWxlbmd0aCcsIHRleHQgKSwgMTBcblxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9jb21tYW5kX2xpbmVfcmVzdWx0LCBnZXRfd2NfbWF4X2xpbmVfbGVuZ3RoLCB9XG5cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9wcm9ncmVzc19pbmRpY2F0b3JzOiAtPlxuICAgIHsgYW5zaV9jb2xvcnNfYW5kX2VmZmVjdHM6IEMsIH0gPSAoIHJlcXVpcmUgJy4vYW5zaS1icmljcycgKS5yZXF1aXJlX2Fuc2lfY29sb3JzX2FuZF9lZmZlY3RzKClcbiAgICBmZyAgPSBDLmdyZWVuXG4gICAgYmcgID0gQy5iZ19yZWRcbiAgICBmZzAgPSBDLmRlZmF1bHRcbiAgICBiZzAgPSBDLmJnX2RlZmF1bHRcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGdldF9wZXJjZW50YWdlX2JhciA9ICggcGVyY2VudGFnZSApIC0+XG4gICAgICAjIyMg8J+ugvCfroPwn66E8J+uhfCfroYg4paB4paC4paD4paE4paF4paG4paH4paIIOKWieKWiuKWi+KWjOKWjeKWjuKWj/Cfrofwn66I8J+uifCfrorwn66LIOKWkCDwn62wIPCfrbEg8J+tsiDwn62zIPCfrbQg8J+ttSDwn66AIPCfroEg8J+ttiDwn623IPCfrbgg8J+tuSDwn626IPCfrbsg8J+tvSDwn62+IPCfrbwg8J+tvyAjIyNcbiAgICAgIHBlcmNlbnRhZ2VfcnByICA9ICggTWF0aC5yb3VuZCBwZXJjZW50YWdlICkudG9TdHJpbmcoKS5wYWRTdGFydCAzXG4gICAgICBpZiBwZXJjZW50YWdlIGlzIG51bGwgb3IgcGVyY2VudGFnZSA8PSAwICB0aGVuIHJldHVybiBcIiN7cGVyY2VudGFnZV9ycHJ9ICXilpUgICAgICAgICAgICAg4paPXCJcbiAgICAgIGlmIHBlcmNlbnRhZ2UgPj0gMTAwICAgICAgICAgICAgICAgICAgICAgIHRoZW4gcmV0dXJuIFwiI3twZXJjZW50YWdlX3Jwcn0gJeKWleKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWj1wiXG4gICAgICBwZXJjZW50YWdlICAgICAgPSAoIE1hdGgucm91bmQgcGVyY2VudGFnZSAvIDEwMCAqIDEwNCApXG4gICAgICBSICAgICAgICAgICAgICAgPSAn4paIJy5yZXBlYXQgcGVyY2VudGFnZSAvLyA4XG4gICAgICBzd2l0Y2ggcGVyY2VudGFnZSAlJSA4XG4gICAgICAgIHdoZW4gMCB0aGVuIFIgKz0gJyAnXG4gICAgICAgIHdoZW4gMSB0aGVuIFIgKz0gJ+KWjydcbiAgICAgICAgd2hlbiAyIHRoZW4gUiArPSAn4paOJ1xuICAgICAgICB3aGVuIDMgdGhlbiBSICs9ICfilo0nXG4gICAgICAgIHdoZW4gNCB0aGVuIFIgKz0gJ+KWjCdcbiAgICAgICAgd2hlbiA1IHRoZW4gUiArPSAn4paLJ1xuICAgICAgICB3aGVuIDYgdGhlbiBSICs9ICfiloonXG4gICAgICAgIHdoZW4gNyB0aGVuIFIgKz0gJ+KWiSdcbiAgICAgIHJldHVybiBcIiN7cGVyY2VudGFnZV9ycHJ9ICXilpUje2ZnK2JnfSN7Ui5wYWRFbmQgMTN9I3tmZzArYmcwfeKWj1wiXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBob2xsb3dfcGVyY2VudGFnZV9iYXIgPSAoIG4gKSAtPlxuICAgICAgaWYgbiBpcyBudWxsIG9yIG4gPD0gMCAgdGhlbiByZXR1cm4gJyAgICAgICAgICAgICAnXG4gICAgICAjIGlmIG4gPj0gMTAwICAgICAgICAgICAgIHRoZW4gcmV0dXJuICfilpHilpHilpHilpHilpHilpHilpHilpHilpHilpHilpHilpHilpEnXG4gICAgICBpZiBuID49IDEwMCAgICAgICAgICAgICB0aGVuIHJldHVybiAn4paT4paT4paT4paT4paT4paT4paT4paT4paT4paT4paT4paT4paTJ1xuICAgICAgbiA9ICggTWF0aC5yb3VuZCBuIC8gMTAwICogMTA0IClcbiAgICAgICMgUiA9ICfilpEnLnJlcGVhdCBuIC8vIDhcbiAgICAgIFIgPSAn4paTJy5yZXBlYXQgbiAvLyA4XG4gICAgICBzd2l0Y2ggbiAlJSA4XG4gICAgICAgIHdoZW4gMCB0aGVuIFIgKz0gJyAnXG4gICAgICAgIHdoZW4gMSB0aGVuIFIgKz0gJ+KWjydcbiAgICAgICAgd2hlbiAyIHRoZW4gUiArPSAn4paOJ1xuICAgICAgICB3aGVuIDMgdGhlbiBSICs9ICfilo0nXG4gICAgICAgIHdoZW4gNCB0aGVuIFIgKz0gJ+KWjCdcbiAgICAgICAgd2hlbiA1IHRoZW4gUiArPSAn4paLJ1xuICAgICAgICB3aGVuIDYgdGhlbiBSICs9ICfiloonXG4gICAgICAgIHdoZW4gNyB0aGVuIFIgKz0gJ+KWiSdcbiAgICAgICAgIyB3aGVuIDggdGhlbiBSICs9ICfilognXG4gICAgICByZXR1cm4gUi5wYWRFbmQgMTNcblxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IGdldF9wZXJjZW50YWdlX2JhciwgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Zvcm1hdF9zdGFjazogLT5cbiAgICB7IGFuc2lfY29sb3JzX2FuZF9lZmZlY3RzOiBDLCB9ID0gKCByZXF1aXJlICcuL2Fuc2ktYnJpY3MnICkucmVxdWlyZV9hbnNpX2NvbG9yc19hbmRfZWZmZWN0cygpXG4gICAgeyBzdHJpcF9hbnNpLCAgICAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi9hbnNpLWJyaWNzJyApLnJlcXVpcmVfc3RyaXBfYW5zaSgpXG4gICAgeyB0eXBlX29mLCAgICAgICAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi91bnN0YWJsZS1ycHItdHlwZV9vZi1icmljcycgKS5yZXF1aXJlX3R5cGVfb2YoKVxuICAgIHsgaGlkZSwgICAgICAgICAgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vdmFyaW91cy1icmljcycgKS5yZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHMoKVxuICAgIHsgc2hvd19ub19jb2xvcnM6IHJwciwgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vbWFpbicgKS51bnN0YWJsZS5yZXF1aXJlX3Nob3coKVxuICAgICMjIyBUQUlOVCBtYWtlIHVzZSBvZiBgRlNgIG9wdGlvbmFsIGxpa2UgYGdldF9yZWxhdGl2ZV9wYXRoKClgICMjI1xuICAgIEZTICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOmZzJ1xuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBtYWluX2MgICAgICAgICAgICAgICAgICAgID0ge31cbiAgICBtYWluX2MucmVzZXQgICAgICAgICAgICAgID0gQy5yZXNldCAjIEMuZGVmYXVsdCArIEMuYmdfZGVmYXVsdCAgKyBDLmJvbGQwXG4gICAgbWFpbl9jLmZvbGRlcl9wYXRoICAgICAgICA9IEMuYmxhY2sgICArIEMuYmdfbGltZSAgICAgKyBDLmJvbGRcbiAgICBtYWluX2MuZmlsZV9uYW1lICAgICAgICAgID0gQy53aW5lICAgICsgQy5iZ19saW1lICAgICArIEMuYm9sZFxuICAgIG1haW5fYy5jYWxsZWUgICAgICAgICAgICAgPSBDLmJsYWNrICAgKyBDLmJnX2xpbWUgICAgICsgQy5ib2xkXG4gICAgbWFpbl9jLmxpbmVfbnIgICAgICAgICAgICA9IEMuYmxhY2sgICArIEMuYmdfYmx1ZSAgICAgKyBDLmJvbGRcbiAgICBtYWluX2MuY29sdW1uX25yICAgICAgICAgID0gQy5ibGFjayAgICsgQy5iZ19ibHVlICAgICArIEMuYm9sZFxuICAgIG1haW5fYy5jb250ZXh0ICAgICAgICAgICAgPSBDLmxpZ2h0c2xhdGVncmF5ICArIEMuYmdfZGFya3NsYXRpc2hcbiAgICAjIG1haW5fYy5jb250ZXh0ICAgICAgICAgICAgPSBDLmxpZ2h0c2xhdGVncmF5ICArIEMuYmdfZGFya3NsYXRlZ3JheVxuICAgIG1haW5fYy5oaXQgICAgICAgICAgICAgICAgPSBDLndoaXRlICAgICAgICAgICArIEMuYmdfZGFya3NsYXRpc2ggKyBDLmJvbGRcbiAgICBtYWluX2Muc3BvdCAgICAgICAgICAgICAgID0gQy55ZWxsb3cgICAgICAgICAgICAgKyBDLmJnX3dpbmUgKyBDLmJvbGRcbiAgICAjIG1haW5fYy5oaXQgICAgICAgICAgICAgICAgPSBDLndoaXRlICAgICAgICAgICsgQy5iZ19mb3Jlc3QgKyBDLmJvbGRcbiAgICBtYWluX2MucmVmZXJlbmNlICAgICAgICAgID0gQy5saWdodHNsYXRlZ3JheSAgKyBDLmJnX2JsYWNrXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBleHRlcm5hbF9jICAgICAgICAgICAgICAgID0gT2JqZWN0LmNyZWF0ZSBtYWluX2NcbiAgICBleHRlcm5hbF9jLmZvbGRlcl9wYXRoICAgID0gQy5ibGFjayAgICsgQy5iZ195ZWxsb3cgICArIEMuYm9sZFxuICAgIGV4dGVybmFsX2MuZmlsZV9uYW1lICAgICAgPSBDLndpbmUgICAgKyBDLmJnX3llbGxvdyAgICsgQy5ib2xkXG4gICAgZXh0ZXJuYWxfYy5jYWxsZWUgICAgICAgICA9IEMuYmxhY2sgICArIEMuYmdfeWVsbG93ICAgKyBDLmJvbGRcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGRlcGVuZGVuY3lfYyAgICAgICAgICAgICAgPSBPYmplY3QuY3JlYXRlIG1haW5fY1xuICAgIGRlcGVuZGVuY3lfYy5mb2xkZXJfcGF0aCAgPSBDLmJsYWNrICAgKyBDLmJnX29ycGltZW50ICsgQy5ib2xkXG4gICAgZGVwZW5kZW5jeV9jLmZpbGVfbmFtZSAgICA9IEMud2luZSAgICArIEMuYmdfb3JwaW1lbnQgKyBDLmJvbGRcbiAgICBkZXBlbmRlbmN5X2MuY2FsbGVlICAgICAgID0gQy5ibGFjayAgICsgQy5iZ19vcnBpbWVudCArIEMuYm9sZFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgaW50ZXJuYWxfYyAgICAgICAgICAgICAgICA9IE9iamVjdC5jcmVhdGUgbWFpbl9jXG4gICAgaW50ZXJuYWxfYy5mb2xkZXJfcGF0aCAgICA9IEMuZ3JheSAgICArIEMuYmdfZGFya3NsYXRpc2hcbiAgICBpbnRlcm5hbF9jLmZpbGVfbmFtZSAgICAgID0gQy5ncmF5ICAgICsgQy5iZ19kYXJrc2xhdGlzaFxuICAgIGludGVybmFsX2MubGluZV9uciAgICAgICAgPSBDLmdyYXkgICAgKyBDLmJnX2RhcmtzbGF0aXNoXG4gICAgaW50ZXJuYWxfYy5jb2x1bW5fbnIgICAgICA9IEMuZ3JheSAgICArIEMuYmdfZGFya3NsYXRpc2hcbiAgICBpbnRlcm5hbF9jLmNhbGxlZSAgICAgICAgID0gQy5ncmF5ICAgICsgQy5iZ19kYXJrc2xhdGlzaFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgdW5wYXJzYWJsZV9jICAgICAgICAgICAgICA9IHt9XG4gICAgdW5wYXJzYWJsZV9jLnRleHQgICAgICAgICA9IEMuYmxhY2sgICArIEMuYmdfdmlvbGV0ICAgICAgKyBDLmJvbGRcbiAgICB1bnBhcnNhYmxlX2MucmVzZXQgICAgICAgID0gbWFpbl9jLnJlc2V0XG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBoZWFkbGluZV9jICAgICAgICAgICAgICAgID0ge31cbiAgICBoZWFkbGluZV9jLmhlYWRsaW5lICAgICAgID0gQy5ibGFjayAgICsgQy5iZ19yZWQgICAgICArIEMuYm9sZFxuICAgIGhlYWRsaW5lX2MucmVzZXQgICAgICAgICAgPSBtYWluX2MucmVzZXRcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHRlbXBsYXRlcyA9XG4gICAgICBmb3JtYXRfc3RhY2s6XG4gICAgICAgIHJlbGF0aXZlOiAgICAgICB0cnVlICMgYm9vbGVhbiB0byB1c2UgQ1dELCBvciBzcGVjaWZ5IHJlZmVyZW5jZSBwYXRoXG4gICAgICAgIGNvbnRleHQ6ICAgICAgICAyXG4gICAgICAgIHBhZGRpbmc6XG4gICAgICAgICAgcGF0aDogICAgICAgICAgIDkwXG4gICAgICAgICAgY2FsbGVlOiAgICAgICAgIDYwXG4gICAgICAgIGNvbG9yOlxuICAgICAgICAgIG1haW46ICAgICAgICAgICBtYWluX2NcbiAgICAgICAgICBpbnRlcm5hbDogICAgICAgaW50ZXJuYWxfY1xuICAgICAgICAgIGV4dGVybmFsOiAgICAgICBleHRlcm5hbF9jXG4gICAgICAgICAgZGVwZW5kZW5jeTogICAgIGRlcGVuZGVuY3lfY1xuICAgICAgICAgIHVucGFyc2FibGU6ICAgICB1bnBhcnNhYmxlX2NcbiAgICAgICAgICBoZWFkbGluZTogICAgICAgaGVhZGxpbmVfY1xuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBzdGFja19saW5lX3JlID0gLy8vIF5cbiAgICAgIFxccyogYXQgXFxzK1xuICAgICAgKD86XG4gICAgICAgICg/PGNhbGxlZT4gLio/ICAgIClcbiAgICAgICAgXFxzKyBcXChcbiAgICAgICAgKT9cbiAgICAgICg/PHBhdGg+ICAgICAgKD88Zm9sZGVyX3BhdGg+IC4qPyApICg/PGZpbGVfbmFtZT4gW14gXFwvIF0rICkgICkgOlxuICAgICAgKD88bGluZV9ucj4gICBcXGQrICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6XG4gICAgICAoPzxjb2x1bW5fbnI+IFxcZCsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICBcXCk/XG4gICAgICAkIC8vLztcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW50ZXJuYWxzID0gT2JqZWN0LmZyZWV6ZSB7IHRlbXBsYXRlcywgfVxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBGb3JtYXRfc3RhY2tcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKCBjZmcgKSAtPlxuICAgICAgICBAY2ZnICAgICAgICAgICAgICA9IHsgdGVtcGxhdGVzLmZvcm1hdF9zdGFjay4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIEBjZmcucGFkZGluZy5saW5lID0gQGNmZy5wYWRkaW5nLnBhdGggKyBAY2ZnLnBhZGRpbmcuY2FsbGVlXG4gICAgICAgIG1lID0gKCBQLi4uICkgPT4gQGZvcm1hdCBQLi4uXG4gICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZiBtZSwgQFxuICAgICAgICBoaWRlIEAsICdnZXRfcmVsYXRpdmVfcGF0aCcsIGRvID0+XG4gICAgICAgICAgdHJ5IFBBVEggPSByZXF1aXJlICdub2RlOnBhdGgnIGNhdGNoIGVycm9yIHRoZW4gcmV0dXJuIG51bGxcbiAgICAgICAgICByZXR1cm4gUEFUSC5yZWxhdGl2ZS5iaW5kIFBBVEhcbiAgICAgICAgaGlkZSBALCAnc3RhdGUnLCB7IGNhY2hlOiBuZXcgTWFwKCksIH1cbiAgICAgICAgcmV0dXJuIG1lXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZm9ybWF0OiAoIGVycm9yX29yX3N0YWNrICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdmFsaWRhdGlvbiAjIyNcbiAgICAgICAgc3dpdGNoIHR5cGUgPSB0eXBlX29mIGVycm9yX29yX3N0YWNrXG4gICAgICAgICAgd2hlbiAnZXJyb3InXG4gICAgICAgICAgICBlcnJvciAgICAgPSBlcnJvcl9vcl9zdGFja1xuICAgICAgICAgICAgc3RhY2sgICAgID0gZXJyb3Iuc3RhY2tcbiAgICAgICAgICB3aGVuICd0ZXh0J1xuICAgICAgICAgICAgZXJyb3IgICAgID0gbnVsbFxuICAgICAgICAgICAgc3RhY2sgICAgID0gZXJyb3Jfb3Jfc3RhY2tcbiAgICAgICAgICAgICMgaGVhZGxpbmUgID0gc3RhY2suXG4gICAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzQgZXhwZWN0ZWQgYW4gZXJyb3Igb3IgYSB0ZXh0LCBnb3QgYSAje3R5cGV9XCJcbiAgICAgICAgbGluZXMgPSBzdGFjay5zcGxpdCAnXFxuJ1xuICAgICAgICBpZiBsaW5lcy5sZW5ndGggPiAxXG4gICAgICAgICAgaGVhZGxpbmUgID0gQGZvcm1hdF9oZWFkbGluZSBsaW5lcy5zaGlmdCgpLCBlcnJvclxuICAgICAgICAgIGxpbmVzICAgICA9IGxpbmVzLnJldmVyc2UoKVxuICAgICAgICAgIGxpbmVzICAgICA9ICggKCBAZm9ybWF0X2xpbmUgbGluZSApIGZvciBsaW5lIGluIGxpbmVzIClcbiAgICAgICAgICByZXR1cm4gWyBoZWFkbGluZSwgbGluZXMuLi4sIGhlYWRsaW5lLCBdLmpvaW4gJ1xcbidcbiAgICAgICAgcmV0dXJuIEBmb3JtYXRfbGluZSBsaW5lXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcGFyc2VfbGluZTogKCBsaW5lICkgLT5cbiAgICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdmFsaWRhdGlvbiAjIyNcbiAgICAgICAgdW5sZXNzICggdHlwZSA9IHR5cGVfb2YgbGluZSApIGlzICd0ZXh0J1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNSBleHBlY3RlZCBhIHRleHQsIGdvdCBhICN7dHlwZX1cIlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGlmICggJ1xcbicgaW4gbGluZSApXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX182IGV4cGVjdGVkIGEgc2luZ2xlIGxpbmUsIGdvdCBhIHRleHQgd2l0aCBsaW5lIGJyZWFrc1wiXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIHsgdGV4dDogbGluZSwgdHlwZTogJ3VucGFyc2FibGUnLCB9IHVubGVzcyAoIG1hdGNoID0gbGluZS5tYXRjaCBzdGFja19saW5lX3JlICk/XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgUiAgICAgICAgICAgPSB7IG1hdGNoLmdyb3Vwcy4uLiwgfVxuICAgICAgICBpc19pbnRlcm5hbCA9IFIucGF0aC5zdGFydHNXaXRoICdub2RlOidcbiAgICAgICAgUi5jYWxsZWUgICA/PSAnW2Fub255bW91c10nXG4gICAgICAgIFIubGluZV9uciAgID0gcGFyc2VJbnQgUi5saW5lX25yLCAgIDEwXG4gICAgICAgIFIuY29sdW1uX25yID0gcGFyc2VJbnQgUi5jb2x1bW5fbnIsIDEwXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgaWYgQGdldF9yZWxhdGl2ZV9wYXRoPyBhbmQgKCBub3QgaXNfaW50ZXJuYWwgKSBhbmQgKCBAY2ZnLnJlbGF0aXZlIGlzbnQgZmFsc2UgKVxuICAgICAgICAgIHJlZmVyZW5jZSAgICAgPSBpZiAoIEBjZmcucmVsYXRpdmUgaXMgdHJ1ZSApIHRoZW4gcHJvY2Vzcy5jd2QoKSBlbHNlIEBjZmcucmVsYXRpdmVcbiAgICAgICAgICBSLnBhdGggICAgICAgID0gKCBAZ2V0X3JlbGF0aXZlX3BhdGggcmVmZXJlbmNlLCBSLnBhdGggICAgICAgIClcbiAgICAgICAgICBSLmZvbGRlcl9wYXRoID0gKCBAZ2V0X3JlbGF0aXZlX3BhdGggcmVmZXJlbmNlLCBSLmZvbGRlcl9wYXRoICkgKyAnLydcbiAgICAgICAgICAjIFIucGF0aCAgICAgICAgPSAnLi8nICsgUi5wYXRoICAgICAgICB1bmxlc3MgUi5wYXRoWyAwIF0gICAgICAgICBpbiAnLi8nXG4gICAgICAgICAgIyBSLmZvbGRlcl9wYXRoID0gJy4vJyArIFIuZm9sZGVyX3BhdGggdW5sZXNzIFIuZm9sZGVyX3BhdGhbIDAgXSAgaW4gJy4vJ1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHN3aXRjaCB0cnVlXG4gICAgICAgICAgd2hlbiBpc19pbnRlcm5hbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbiAgUi50eXBlID0gJ2ludGVybmFsJ1xuICAgICAgICAgIHdoZW4gL1xcYm5vZGVfbW9kdWxlc1xcLy8udGVzdCBSLnBhdGggICAgICAgICAgICAgdGhlbiAgUi50eXBlID0gJ2RlcGVuZGVuY3knXG4gICAgICAgICAgd2hlbiBSLnBhdGguc3RhcnRzV2l0aCAnLi4vJyAgICAgICAgICAgICAgICAgICAgdGhlbiAgUi50eXBlID0gJ2V4dGVybmFsJ1xuICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFIudHlwZSA9ICdtYWluJ1xuICAgICAgICByZXR1cm4gUlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGZvcm1hdF9saW5lOiAoIGxpbmUgKSAtPlxuICAgICAgICB7IHN0YWNrX2luZm8sXG4gICAgICAgICAgc291cmNlX3JlZmVyZW5jZSwgICB9ID0gQF9mb3JtYXRfc291cmNlX3JlZmVyZW5jZSBsaW5lXG4gICAgICAgIGNvbnRleHQgPSBpZiBAY2ZnLmNvbnRleHQgaXMgZmFsc2UgdGhlbiBbXSBlbHNlIEBfZ2V0X2NvbnRleHQgc3RhY2tfaW5mb1xuICAgICAgICByZXR1cm4gWyBzb3VyY2VfcmVmZXJlbmNlLCBjb250ZXh0Li4uLCBdLmpvaW4gJ1xcbidcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBmb3JtYXRfaGVhZGxpbmU6ICggbGluZSwgZXJyb3IgPSBudWxsICkgLT5cbiAgICAgICAgdGhlbWUgICAgICAgPSBAY2ZnLmNvbG9yLmhlYWRsaW5lXG4gICAgICAgIGVycm9yX2NsYXNzID0gZXJyb3I/LmNvbnN0cnVjdG9yLm5hbWUgPyAnKG5vIGVycm9yIGNsYXNzKSdcbiAgICAgICAgbGluZSAgICAgICAgPSBcIiBbI3tlcnJvcl9jbGFzc31dICN7bGluZX1cIlxuICAgICAgICBsaW5lICAgICAgICA9IGxpbmUucGFkRW5kIEBjZmcucGFkZGluZy5saW5lLCAnICdcbiAgICAgICAgcmV0dXJuIHRoZW1lLmhlYWRsaW5lICsgbGluZSArIHRoZW1lLnJlc2V0XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2Zvcm1hdF9zb3VyY2VfcmVmZXJlbmNlOiAoIGxpbmUgKSAtPlxuICAgICAgICBzdGFja19pbmZvICAgICAgPSBAcGFyc2VfbGluZSBsaW5lXG4gICAgICAgIHRoZW1lICAgICAgICAgICA9IEBjZmcuY29sb3JbIHN0YWNrX2luZm8udHlwZSBdXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgaWYgc3RhY2tfaW5mby50eXBlIGlzICd1bnBhcnNhYmxlJ1xuICAgICAgICAgIHNvdXJjZV9yZWZlcmVuY2UgPSB0aGVtZS50ZXh0ICsgc3RhY2tfaW5mby50ZXh0ICsgdGhlbWUucmVzZXRcbiAgICAgICAgICByZXR1cm4geyBzdGFja19pbmZvLCBzb3VyY2VfcmVmZXJlbmNlLCB9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZm9sZGVyX3BhdGggICAgID0gdGhlbWUuZm9sZGVyX3BhdGggICsgJyAnICAgICsgc3RhY2tfaW5mby5mb2xkZXJfcGF0aCAgKyAnJyAgICAgKyB0aGVtZS5yZXNldFxuICAgICAgICBmaWxlX25hbWUgICAgICAgPSB0aGVtZS5maWxlX25hbWUgICAgKyAnJyAgICAgKyBzdGFja19pbmZvLmZpbGVfbmFtZSAgICArICcgJyAgICArIHRoZW1lLnJlc2V0XG4gICAgICAgIGxpbmVfbnIgICAgICAgICA9IHRoZW1lLmxpbmVfbnIgICAgICArICcgKCcgICArIHN0YWNrX2luZm8ubGluZV9uciAgICAgICsgJycgICAgICsgdGhlbWUucmVzZXRcbiAgICAgICAgY29sdW1uX25yICAgICAgID0gdGhlbWUuY29sdW1uX25yICAgICsgJzonICAgICsgc3RhY2tfaW5mby5jb2x1bW5fbnIgICAgKyAnKSAnICAgKyB0aGVtZS5yZXNldFxuICAgICAgICBjYWxsZWUgICAgICAgICAgPSB0aGVtZS5jYWxsZWUgICAgICAgKyAnICMgJyAgKyBzdGFja19pbmZvLmNhbGxlZSAgICAgICArICcoKSAnICArIHRoZW1lLnJlc2V0XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcGF0aF9sZW5ndGggICAgID0gKCBzdHJpcF9hbnNpIGZvbGRlcl9wYXRoICsgZmlsZV9uYW1lICsgbGluZV9uciArIGNvbHVtbl9uciAgKS5sZW5ndGhcbiAgICAgICAgY2FsbGVlX2xlbmd0aCAgID0gKCBzdHJpcF9hbnNpIGNhbGxlZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKS5sZW5ndGhcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBwYXRoX2xlbmd0aCAgICAgPSBNYXRoLm1heCAwLCBAY2ZnLnBhZGRpbmcucGF0aCAgICAtICAgcGF0aF9sZW5ndGhcbiAgICAgICAgY2FsbGVlX2xlbmd0aCAgID0gTWF0aC5tYXggMCwgQGNmZy5wYWRkaW5nLmNhbGxlZSAgLSBjYWxsZWVfbGVuZ3RoXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcGFkZGluZ19wYXRoICAgID0gdGhlbWUuZm9sZGVyX3BhdGggKyAoICcgJy5yZXBlYXQgICAgcGF0aF9sZW5ndGggKSArIHRoZW1lLnJlc2V0XG4gICAgICAgIHBhZGRpbmdfY2FsbGVlICA9IHRoZW1lLmNhbGxlZSAgICAgICsgKCAnICcucmVwZWF0ICBjYWxsZWVfbGVuZ3RoICkgKyB0aGVtZS5yZXNldFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHNvdXJjZV9yZWZlcmVuY2UgID0gZm9sZGVyX3BhdGggKyBmaWxlX25hbWUgKyBsaW5lX25yICsgY29sdW1uX25yICsgcGFkZGluZ19wYXRoICsgY2FsbGVlICsgcGFkZGluZ19jYWxsZWVcbiAgICAgICAgcmV0dXJuIHsgc3RhY2tfaW5mbywgc291cmNlX3JlZmVyZW5jZSwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfY29udGV4dDogKCBzdGFja19pbmZvICkgLT5cbiAgICAgICAgcmV0dXJuIFtdIGlmICggc3RhY2tfaW5mby50eXBlIGluIFsgJ2ludGVybmFsJywgJ3VucGFyc2FibGUnLCBdICkgb3IgKCBzdGFja19pbmZvLnBhdGggaXMgJycgKVxuICAgICAgICB0cnlcbiAgICAgICAgICBzb3VyY2UgPSBGUy5yZWFkRmlsZVN5bmMgc3RhY2tfaW5mby5wYXRoLCB7IGVuY29kaW5nOiAndXRmLTgnLCB9XG4gICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgdGhyb3cgZXJyb3IgdW5sZXNzIGVycm9yLmNvZGUgaXMgJ0VOT0VOVCdcbiAgICAgICAgICByZXR1cm4gWyBcInVuYWJsZSB0byByZWFkIGZpbGUgI3tycHIgc3RhY2tfaW5mby5wYXRofVwiLCBdXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgdGhlbWUgICAgID0gQGNmZy5jb2xvclsgc3RhY2tfaW5mby50eXBlIF1cbiAgICAgICAgcmVmX3dpZHRoID0gN1xuICAgICAgICB3aWR0aCAgICAgPSBAY2ZnLnBhZGRpbmcucGF0aCArIEBjZmcucGFkZGluZy5jYWxsZWUgLSByZWZfd2lkdGhcbiAgICAgICAgc291cmNlICAgID0gc291cmNlLnNwbGl0ICdcXG4nXG4gICAgICAgIGhpdF9pZHggICA9IHN0YWNrX2luZm8ubGluZV9uciAtIDFcbiAgICAgICAgIyByZXR1cm4gc291cmNlWyBoaXRfaWR4IF0gaWYgQGNmZy5jb250ZXh0IDwgMVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZpcnN0X2lkeCA9IE1hdGgubWF4ICggaGl0X2lkeCAtIEBjZmcuY29udGV4dCApLCAwXG4gICAgICAgIGxhc3RfaWR4ICA9IE1hdGgubWluICggaGl0X2lkeCArIEBjZmcuY29udGV4dCApLCBzb3VyY2UubGVuZ3RoIC0gMVxuICAgICAgICBSICAgICAgICAgPSBbXVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZvciBpZHggaW4gWyBmaXJzdF9pZHggLi4gbGFzdF9pZHggXVxuICAgICAgICAgIGxpbmUgICAgICA9IHNvdXJjZVsgaWR4IF1cbiAgICAgICAgICByZWZlcmVuY2UgPSB0aGVtZS5yZWZlcmVuY2UgKyAoIFwiI3tpZHggKyAxfSBcIi5wYWRTdGFydCByZWZfd2lkdGgsICcgJyApXG4gICAgICAgICAgaWYgKCBpZHggaXMgaGl0X2lkeCApXG4gICAgICAgICAgICBiZWZvcmUgICAgPSBsaW5lWyAuLi4gc3RhY2tfaW5mby5jb2x1bW5fbnIgLSAxICAgIF1cbiAgICAgICAgICAgIHNwb3QgICAgICA9IGxpbmVbICAgICBzdGFja19pbmZvLmNvbHVtbl9uciAtIDEgLi4gXVxuICAgICAgICAgICAgYmVoaW5kICAgID0gJyAnLnJlcGVhdCBNYXRoLm1heCAwLCB3aWR0aCAtIGxpbmUubGVuZ3RoXG4gICAgICAgICAgICBSLnB1c2ggcmVmZXJlbmNlICsgdGhlbWUuaGl0ICsgYmVmb3JlICsgdGhlbWUuc3BvdCArIHNwb3QgKyB0aGVtZS5oaXQgKyBiZWhpbmQgKyB0aGVtZS5yZXNldFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxpbmUgICAgICA9IGxpbmUucGFkRW5kIHdpZHRoLCAnICdcbiAgICAgICAgICAgIFIucHVzaCByZWZlcmVuY2UgKyB0aGVtZS5jb250ZXh0ICArIGxpbmUgKyB0aGVtZS5yZXNldFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHJldHVybiBSXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0gZG8gPT5cbiAgICAgIGZvcm1hdF9zdGFjayA9IG5ldyBGb3JtYXRfc3RhY2soKVxuICAgICAgcmV0dXJuIHsgZm9ybWF0X3N0YWNrLCBGb3JtYXRfc3RhY2ssIGludGVybmFscywgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgQlJJQ1NcblxuIl19
