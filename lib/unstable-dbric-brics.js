(function() {
  'use strict';
  var UNSTABLE_DBRIC_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_DBRIC_BRICS = {
    
    //=========================================================================================================
    /* NOTE Future Single-File Module */
    require_dbric: function() {
      var Dbric, Dbric_std, Esql, SQL, SQLITE, Segment_width_db, debug, esql, exports, hide, internals, rpr, set_getter, type_of;
      //=======================================================================================================
      ({hide, set_getter} = (require('./main')).require_managed_property_tools());
      ({type_of} = (require('./main')).unstable.require_type_of());
      ({
        show_no_colors: rpr
      } = (require('./main')).unstable.require_show());
      SQLITE = require('node:sqlite');
      ({debug} = console);
      //-------------------------------------------------------------------------------------------------------
      internals = {};
      //===========================================================================================================
      Esql = class Esql {
        constructor() {
          //---------------------------------------------------------------------------------------------------------
          this.I = this.I.bind(this);
        }

        I(name) {
          return '"' + (name.replace(/"/g, '""')) + '"';
        }

      };
      // #---------------------------------------------------------------------------------------------------------
      // L: ( x ) =>
      //   return 'null' unless x?
      //   switch type = type_of x
      //     when 'text'       then return  "'" + ( x.replace /'/g, "''" ) + "'"
      //     # when 'list'       then return "'#{@list_as_json x}'"
      //     when 'float'      then return x.toString()
      //     when 'boolean'    then return ( if x then '1' else '0' )
      //     # when 'list'       then throw new Error "^dba@23^ use `X()` for lists"
      //   throw new E.DBay_sql_value_error '^dbay/sql@1^', type, x

      // #---------------------------------------------------------------------------------------------------------
      // V: ( x ) =>
      //   throw new E.DBay_sql_not_a_list_error '^dbay/sql@2^', type, x unless ( type = type_of x ) is 'list'
      //   return '( ' + ( ( @L e for e in x ).join ', ' ) + ' )'

      // #---------------------------------------------------------------------------------------------------------
      // interpolate: ( sql, values ) =>
      //   idx = -1
      //   return sql.replace @_interpolation_pattern, ( $0, opener, format, name ) =>
      //     idx++
      //     switch opener
      //       when '$'
      //         validate.nonempty_text name
      //         key = name
      //       when '?'
      //         key = idx
      //     value = values[ key ]
      //     switch format
      //       when '', 'I'  then return @I value
      //       when 'L'      then return @L value
      //       when 'V'      then return @V value
      //     throw new E.DBay_interpolation_format_unknown '^dbay/sql@3^', format
      // _interpolation_pattern: /(?<opener>[$?])(?<format>.?):(?<name>\w*)/g
      //-------------------------------------------------------------------------------------------------------
      esql = new Esql();
      //-------------------------------------------------------------------------------------------------------
      SQL = function(parts, ...expressions) {
        var R, expression, i, idx, len;
        R = parts[0];
        for (idx = i = 0, len = expressions.length; i < len; idx = ++i) {
          expression = expressions[idx];
          R += expression.toString() + parts[idx + 1];
        }
        return R;
      };
      Dbric = (function() {
        //=======================================================================================================
        class Dbric {
          //-----------------------------------------------------------------------------------------------------
          static open(db_path) {
            var R, clasz;
            clasz = this;
            R = new clasz(db_path);
            R.build();
            R._prepare_statements();
            return R;
          }

          //-----------------------------------------------------------------------------------------------------
          constructor(db_path) {
            var call, clasz, fn_cfg, fn_cfg_template, name, ref;
            this.db = new SQLITE.DatabaseSync(db_path);
            clasz = this.constructor;
            this.cfg = Object.freeze({...clasz.cfg, db_path});
            /* NOTE we can't just prepare all the stetments as they depend on DB objects existing or not existing,
                   as the case may be. Hence we prepare statements on-demand and cache them here as needed: */
            hide(this, 'statements', {});
            //...................................................................................................
            fn_cfg_template = {
              deterministic: true,
              varargs: false
            };
            ref = clasz.functions;
            for (name in ref) {
              fn_cfg = ref[name];
              if ((typeof fn_cfg) === 'function') {
                [call, fn_cfg] = [fn_cfg, {}];
              } else {
                ({call} = fn_cfg);
              }
              fn_cfg = {...fn_cfg_template, fn_cfg};
              call = call.bind(this);
              this.db.function(name, fn_cfg, call);
            }
            return void 0;
          }

          //-----------------------------------------------------------------------------------------------------
          _get_db_objects() {
            var R, dbo;
            R = {};
            for (dbo of (this.db.prepare(SQL`select name, type from sqlite_schema`)).iterate()) {
              R[dbo.name] = {
                name: dbo.name,
                type: dbo.type
              };
            }
            return R;
          }

          //-----------------------------------------------------------------------------------------------------
          teardown() {
            var _, count, full_prefix, name, ref, type;
            count = 0;
            full_prefix = this.full_prefix;
            (this.prepare(SQL`pragma foreign_keys = off;`)).run();
            ref = this._get_db_objects();
            for (_ in ref) {
              ({name, type} = ref[_]);
              if (!name.startsWith(full_prefix)) {
                continue;
              }
              count++;
              (this.prepare(SQL`drop ${type} ${esql.I(name)};`)).run();
            }
            (this.prepare(SQL`pragma foreign_keys = on;`)).run();
            return count;
          }

          //-----------------------------------------------------------------------------------------------------
          build() {
            if (this.is_ready) {
              return 0;
            } else {
              return this.rebuild();
            }
          }

          //-----------------------------------------------------------------------------------------------------
          rebuild() {
            var build_statement, clasz, count, i, len, ref, type_of_build;
            clasz = this.constructor;
            type_of_build = type_of(clasz.build);
            //...................................................................................................
            /* TAINT use proper validation */
            if (type_of_build !== 'undefined' && type_of_build !== 'null' && type_of_build !== 'list') {
              throw new Error(`Ω___5 expected an optional list for ${clasz.name}.build, got a ${type_of_build}`);
            }
            if (clasz.build == null) {
              //...................................................................................................
              return -1;
            }
            if (clasz.build.length === 0) {
              return 0;
            }
            //...................................................................................................
            this.teardown();
            count = 0;
            ref = clasz.build;
            //...................................................................................................
            for (i = 0, len = ref.length; i < len; i++) {
              build_statement = ref[i];
              count++;
              // debug 'Ω___6', "build statement:", build_statement
              (this.prepare(build_statement)).run();
            }
            return count;
          }

          //---------------------------------------------------------------------------------------------------
          _get_is_ready() {
            return true;
          }

          //-----------------------------------------------------------------------------------------------------
          _prepare_statements() {
            var build_statement_name, name, ref, statement;
            // #.................................................................................................
            // for name, sql of clasz.statements
            //   switch true
            //     when name.startsWith 'create_table_'
            //       null
            //     when name.startsWith 'insert_'
            //       null
            //     else
            //       throw new Error "Ωnql___7 unable to parse statement name #{rpr name}"
            // #   @[ name ] = @prepare sql
            hide(this, 'statements', {});
            build_statement_name = this._name_of_build_statements;
            ref = this.constructor.statements;
            for (name in ref) {
              statement = ref[name];
              // if ( type_of statement ) is 'list'
              //   @statements[ name ] = ( @prepare sub_statement for sub_statement in statement )
              //   continue
              this.statements[name] = this.prepare(statement);
            }
            return null;
          }

          //---------------------------------------------------------------------------------------------------
          is_ready() {
            // dbos = @_get_db_objects()
            // return false unless dbos.store_facets?.type is 'table'
            return true;
          }

          //-----------------------------------------------------------------------------------------------------
          execute(sql) {
            return this.db.exec(sql);
          }

          //-----------------------------------------------------------------------------------------------------
          prepare(sql) {
            var R, cause;
            try {
              R = this.db.prepare(sql);
            } catch (error) {
              cause = error;
              /* TAINT `rpr()` urgently needed */
              throw new Error(`Ω___8 when trying to prepare the following statement, an error was thrown: ${rpr(sql)}`, {cause});
            }
            return R;
          }

        };

        //-----------------------------------------------------------------------------------------------------
        Dbric.cfg = Object.freeze({
          prefix: '(NOPREFIX)'
        });

        Dbric.functions = {};

        Dbric.statements = {};

        Dbric.build = null;

        //---------------------------------------------------------------------------------------------------
        set_getter(Dbric.prototype, 'is_ready', function() {
          return this._get_is_ready();
        });

        //---------------------------------------------------------------------------------------------------
        set_getter(Dbric.prototype, 'prefix', function() {
          if (this.cfg.prefix == null) {
            return this.constructor.name.replace(/^.*_([^_]+)$/, '$1');
          }
          if (this.cfg.prefix === '(NOPREFIX)') {
            return '';
          }
          return this.cfg.prefix;
        });

        //---------------------------------------------------------------------------------------------------
        set_getter(Dbric.prototype, 'full_prefix', function() {
          if (this.cfg.prefix == null) {
            return '';
          }
          if (this.cfg.prefix === '(NOPREFIX)') {
            return '';
          }
          if (this.cfg.prefix === '') {
            return '';
          }
          return `${this.cfg.prefix}_`;
        });

        return Dbric;

      }).call(this);
      Dbric_std = (function() {
        //=======================================================================================================
        class Dbric_std extends Dbric {
          //---------------------------------------------------------------------------------------------------
          _get_is_ready() {
            var db_objects, ref, ref1, ref2;
            db_objects = this._get_db_objects();
            if (((ref = db_objects.std_tables) != null ? ref.type : void 0) !== 'view') {
              return false;
            }
            if (((ref1 = db_objects.std_views) != null ? ref1.type : void 0) !== 'view') {
              return false;
            }
            if (((ref2 = db_objects.std_relations) != null ? ref2.type : void 0) !== 'view') {
              return false;
            }
            return true;
          }

        };

        //-----------------------------------------------------------------------------------------------------
        Dbric_std.cfg = Object.freeze({
          prefix: 'std'
        });

        //-----------------------------------------------------------------------------------------------------
        Dbric_std.functions = {};

        //-----------------------------------------------------------------------------------------------------
        Dbric_std.statements = {
          std_get_schema: SQL`select * from sqlite_schema order by name, type;`,
          std_get_tables: SQL`select * from sqlite_schema where type is 'table' order by name, type;`,
          std_get_views: SQL`select * from sqlite_schema where type is 'view' order by name, type;`,
          std_get_relations: SQL`select * from sqlite_schema where type in ( 'table', 'view' ) order by name, type;`
        };

        //-----------------------------------------------------------------------------------------------------
        Dbric_std.build = [
          SQL`create view std_tables as
select * from sqlite_schema
  where type is 'table' order by name, type;`,
          SQL`create view std_views as
select * from sqlite_schema
  where type is 'view' order by name, type;`,
          SQL`create view std_relations as
select * from sqlite_schema
  where type in ( 'table', 'view' ) order by name, type;`
        ];

        return Dbric_std;

      }).call(this);
      Segment_width_db = (function() {
        //=======================================================================================================
        class Segment_width_db extends Dbric {
          //-----------------------------------------------------------------------------------------------------
          constructor(db_path) {
            var clasz;
            super(db_path);
            clasz = this.constructor;
            this.cache = new Map();
            /* TAINT should be done automatically */
            this.statements = {
              insert_segment: this.prepare(clasz.statements.insert_segment),
              select_row_from_segments: this.prepare(clasz.statements.select_row_from_segments)
            };
            return void 0;
          }

        };

        //-----------------------------------------------------------------------------------------------------
        Segment_width_db.functions = {
          //...................................................................................................
          width_from_text: {
            deterministic: true,
            varargs: false,
            call: function(text) {
              return get_wc_max_line_length(text);
            }
          },
          //...................................................................................................
          length_from_text: {
            deterministic: true,
            varargs: false,
            call: function(text) {
              return text.length;
            }
          }
        };

        //-----------------------------------------------------------------------------------------------------
        Segment_width_db.statements = {
          //...................................................................................................
          create_table_segments: SQL`drop table if exists segments;
create table segments (
    segment_text      text    not null primary key,
    segment_width     integer not null generated always as ( width_from_text(  segment_text ) ) stored,
    segment_length    integer not null generated always as ( length_from_text( segment_text ) ) stored,
  constraint segment_width_eqgt_zero  check ( segment_width  >= 0 ),
  constraint segment_length_eqgt_zero check ( segment_length >= 0 ) );`,
          // #.................................................................................................
          // insert_segment: SQL"""
          //   insert into segments  ( segment_text,   segment_width,  segment_length  )
          //                 values  ( $segment_text,  $segment_width, $segment_length )
          //     on conflict ( segment_text ) do update
          //                 set     (                 segment_width,  segment_length  ) =
          //                         ( excluded.segment_width, excluded.segment_length );"""
          //...................................................................................................
          insert_segment: SQL`insert into segments  ( segment_text  )
              values  ( $segment_text )
  on conflict ( segment_text ) do nothing
  returning *;`,
          //...................................................................................................
          select_row_from_segments: SQL`select * from segments where segment_text = $segment_text limit 1;`
        };

        return Segment_width_db;

      }).call(this);
      //=======================================================================================================
      internals = Object.freeze({...internals, Segment_width_db});
      return exports = {Dbric, Dbric_std, esql, SQL, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_DBRIC_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWRicmljLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxvQkFBQTs7Ozs7RUFLQSxvQkFBQSxHQUtFLENBQUE7Ozs7SUFBQSxhQUFBLEVBQWUsUUFBQSxDQUFBLENBQUE7QUFFakIsVUFBQSxLQUFBLEVBQUEsU0FBQSxFQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsTUFBQSxFQUFBLGdCQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxHQUFBLEVBQUEsVUFBQSxFQUFBLE9BQUE7O01BQ0ksQ0FBQSxDQUFFLElBQUYsRUFDRSxVQURGLENBQUEsR0FDNEIsQ0FBRSxPQUFBLENBQVEsUUFBUixDQUFGLENBQW9CLENBQUMsOEJBQXJCLENBQUEsQ0FENUI7TUFFQSxDQUFBLENBQUUsT0FBRixDQUFBLEdBQTRCLENBQUUsT0FBQSxDQUFRLFFBQVIsQ0FBRixDQUFvQixDQUFDLFFBQVEsQ0FBQyxlQUE5QixDQUFBLENBQTVCO01BQ0EsQ0FBQTtRQUFFLGNBQUEsRUFBZ0I7TUFBbEIsQ0FBQSxHQUE0QixDQUFFLE9BQUEsQ0FBUSxRQUFSLENBQUYsQ0FBb0IsQ0FBQyxRQUFRLENBQUMsWUFBOUIsQ0FBQSxDQUE1QjtNQUNBLE1BQUEsR0FBNEIsT0FBQSxDQUFRLGFBQVI7TUFDNUIsQ0FBQSxDQUFFLEtBQUYsQ0FBQSxHQUE0QixPQUE1QixFQU5KOztNQVNJLFNBQUEsR0FBWSxDQUFBLEVBVGhCOztNQWFVLE9BQU4sTUFBQSxLQUFBOzs7Y0FHRSxDQUFBLFFBQUEsQ0FBQTs7O1FBQUEsQ0FBRyxDQUFFLElBQUYsQ0FBQTtpQkFBWSxHQUFBLEdBQU0sQ0FBRSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBRixDQUFOLEdBQW9DO1FBQWhEOztNQUhMLEVBYko7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LENBQUE7O1VBQUEsZUFBQSxFQUNFO1lBQUEsYUFBQSxFQUFnQixJQUFoQjtZQUNBLE9BQUEsRUFBZ0IsS0FEaEI7WUFFQSxJQUFBLEVBQWdCLFFBQUEsQ0FBRSxJQUFGLENBQUE7cUJBQVksc0JBQUEsQ0FBdUIsSUFBdkI7WUFBWjtVQUZoQixDQURGOztVQUtBLGdCQUFBLEVBQ0U7WUFBQSxhQUFBLEVBQWdCLElBQWhCO1lBQ0EsT0FBQSxFQUFnQixLQURoQjtZQUVBLElBQUEsRUFBZ0IsUUFBQSxDQUFFLElBQUYsQ0FBQTtxQkFBWSxJQUFJLENBQUM7WUFBakI7VUFGaEI7UUFORjs7O1FBV0YsZ0JBQUMsQ0FBQSxVQUFELEdBRUUsQ0FBQTs7VUFBQSxxQkFBQSxFQUF1QixHQUFHLENBQUE7Ozs7OztzRUFBQSxDQUExQjs7Ozs7Ozs7O1VBZ0JBLGNBQUEsRUFBZ0IsR0FBRyxDQUFBOzs7Y0FBQSxDQWhCbkI7O1VBc0JBLHdCQUFBLEVBQTBCLEdBQUcsQ0FBQSxrRUFBQTtRQXRCN0I7Ozs7b0JBdlFSOztNQTRTSSxTQUFBLEdBQVksTUFBTSxDQUFDLE1BQVAsQ0FBYyxDQUFFLEdBQUEsU0FBRixFQUFnQixnQkFBaEIsQ0FBZDtBQUNaLGFBQU8sT0FBQSxHQUFVLENBQ2YsS0FEZSxFQUVmLFNBRmUsRUFHZixJQUhlLEVBSWYsR0FKZSxFQUtmLFNBTGU7SUEvU0o7RUFBZixFQVZGOzs7RUFrVUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsb0JBQTlCO0FBbFVBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5VTlNUQUJMRV9EQlJJQ19CUklDUyA9XG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9kYnJpYzogLT5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgeyBoaWRlLFxuICAgICAgc2V0X2dldHRlciwgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vbWFpbicgKS5yZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHMoKVxuICAgIHsgdHlwZV9vZiwgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vbWFpbicgKS51bnN0YWJsZS5yZXF1aXJlX3R5cGVfb2YoKVxuICAgIHsgc2hvd19ub19jb2xvcnM6IHJwciwgIH0gPSAoIHJlcXVpcmUgJy4vbWFpbicgKS51bnN0YWJsZS5yZXF1aXJlX3Nob3coKVxuICAgIFNRTElURSAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOnNxbGl0ZSdcbiAgICB7IGRlYnVnLCAgICAgICAgICAgICAgICB9ID0gY29uc29sZVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbnRlcm5hbHMgPSB7fVxuXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBFc3FsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIEk6ICggbmFtZSApID0+ICdcIicgKyAoIG5hbWUucmVwbGFjZSAvXCIvZywgJ1wiXCInICkgKyAnXCInXG5cbiAgICAgICMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgIyBMOiAoIHggKSA9PlxuICAgICAgIyAgIHJldHVybiAnbnVsbCcgdW5sZXNzIHg/XG4gICAgICAjICAgc3dpdGNoIHR5cGUgPSB0eXBlX29mIHhcbiAgICAgICMgICAgIHdoZW4gJ3RleHQnICAgICAgIHRoZW4gcmV0dXJuICBcIidcIiArICggeC5yZXBsYWNlIC8nL2csIFwiJydcIiApICsgXCInXCJcbiAgICAgICMgICAgICMgd2hlbiAnbGlzdCcgICAgICAgdGhlbiByZXR1cm4gXCInI3tAbGlzdF9hc19qc29uIHh9J1wiXG4gICAgICAjICAgICB3aGVuICdmbG9hdCcgICAgICB0aGVuIHJldHVybiB4LnRvU3RyaW5nKClcbiAgICAgICMgICAgIHdoZW4gJ2Jvb2xlYW4nICAgIHRoZW4gcmV0dXJuICggaWYgeCB0aGVuICcxJyBlbHNlICcwJyApXG4gICAgICAjICAgICAjIHdoZW4gJ2xpc3QnICAgICAgIHRoZW4gdGhyb3cgbmV3IEVycm9yIFwiXmRiYUAyM14gdXNlIGBYKClgIGZvciBsaXN0c1wiXG4gICAgICAjICAgdGhyb3cgbmV3IEUuREJheV9zcWxfdmFsdWVfZXJyb3IgJ15kYmF5L3NxbEAxXicsIHR5cGUsIHhcblxuICAgICAgIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAjIFY6ICggeCApID0+XG4gICAgICAjICAgdGhyb3cgbmV3IEUuREJheV9zcWxfbm90X2FfbGlzdF9lcnJvciAnXmRiYXkvc3FsQDJeJywgdHlwZSwgeCB1bmxlc3MgKCB0eXBlID0gdHlwZV9vZiB4ICkgaXMgJ2xpc3QnXG4gICAgICAjICAgcmV0dXJuICcoICcgKyAoICggQEwgZSBmb3IgZSBpbiB4ICkuam9pbiAnLCAnICkgKyAnICknXG5cbiAgICAgICMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgIyBpbnRlcnBvbGF0ZTogKCBzcWwsIHZhbHVlcyApID0+XG4gICAgICAjICAgaWR4ID0gLTFcbiAgICAgICMgICByZXR1cm4gc3FsLnJlcGxhY2UgQF9pbnRlcnBvbGF0aW9uX3BhdHRlcm4sICggJDAsIG9wZW5lciwgZm9ybWF0LCBuYW1lICkgPT5cbiAgICAgICMgICAgIGlkeCsrXG4gICAgICAjICAgICBzd2l0Y2ggb3BlbmVyXG4gICAgICAjICAgICAgIHdoZW4gJyQnXG4gICAgICAjICAgICAgICAgdmFsaWRhdGUubm9uZW1wdHlfdGV4dCBuYW1lXG4gICAgICAjICAgICAgICAga2V5ID0gbmFtZVxuICAgICAgIyAgICAgICB3aGVuICc/J1xuICAgICAgIyAgICAgICAgIGtleSA9IGlkeFxuICAgICAgIyAgICAgdmFsdWUgPSB2YWx1ZXNbIGtleSBdXG4gICAgICAjICAgICBzd2l0Y2ggZm9ybWF0XG4gICAgICAjICAgICAgIHdoZW4gJycsICdJJyAgdGhlbiByZXR1cm4gQEkgdmFsdWVcbiAgICAgICMgICAgICAgd2hlbiAnTCcgICAgICB0aGVuIHJldHVybiBATCB2YWx1ZVxuICAgICAgIyAgICAgICB3aGVuICdWJyAgICAgIHRoZW4gcmV0dXJuIEBWIHZhbHVlXG4gICAgICAjICAgICB0aHJvdyBuZXcgRS5EQmF5X2ludGVycG9sYXRpb25fZm9ybWF0X3Vua25vd24gJ15kYmF5L3NxbEAzXicsIGZvcm1hdFxuICAgICAgIyBfaW50ZXJwb2xhdGlvbl9wYXR0ZXJuOiAvKD88b3BlbmVyPlskP10pKD88Zm9ybWF0Pi4/KTooPzxuYW1lPlxcdyopL2dcbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGVzcWwgPSBuZXcgRXNxbCgpXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFNRTCA9ICggcGFydHMsIGV4cHJlc3Npb25zLi4uICkgLT5cbiAgICAgIFIgPSBwYXJ0c1sgMCBdXG4gICAgICBmb3IgZXhwcmVzc2lvbiwgaWR4IGluIGV4cHJlc3Npb25zXG4gICAgICAgIFIgKz0gZXhwcmVzc2lvbi50b1N0cmluZygpICsgcGFydHNbIGlkeCArIDEgXVxuICAgICAgcmV0dXJuIFJcblxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBEYnJpY1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIEBjZmc6IE9iamVjdC5mcmVlemVcbiAgICAgICAgcHJlZml4OiAnKE5PUFJFRklYKSdcbiAgICAgIEBmdW5jdGlvbnM6ICAge31cbiAgICAgIEBzdGF0ZW1lbnRzOiAge31cbiAgICAgIEBidWlsZDogICAgICAgbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIEBvcGVuOiAoIGRiX3BhdGggKSAtPlxuICAgICAgICBjbGFzeiA9IEBcbiAgICAgICAgUiAgICAgPSBuZXcgY2xhc3ogZGJfcGF0aFxuICAgICAgICBSLmJ1aWxkKClcbiAgICAgICAgUi5fcHJlcGFyZV9zdGF0ZW1lbnRzKClcbiAgICAgICAgcmV0dXJuIFJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKCBkYl9wYXRoICkgLT5cbiAgICAgICAgQGRiICAgICAgICAgICAgICAgICA9IG5ldyBTUUxJVEUuRGF0YWJhc2VTeW5jIGRiX3BhdGhcbiAgICAgICAgY2xhc3ogICAgICAgICAgICAgICA9IEBjb25zdHJ1Y3RvclxuICAgICAgICBAY2ZnICAgICAgICAgICAgICAgID0gT2JqZWN0LmZyZWV6ZSB7IGNsYXN6LmNmZy4uLiwgZGJfcGF0aCwgfVxuICAgICAgICAjIyMgTk9URSB3ZSBjYW4ndCBqdXN0IHByZXBhcmUgYWxsIHRoZSBzdGV0bWVudHMgYXMgdGhleSBkZXBlbmQgb24gREIgb2JqZWN0cyBleGlzdGluZyBvciBub3QgZXhpc3RpbmcsXG4gICAgICAgIGFzIHRoZSBjYXNlIG1heSBiZS4gSGVuY2Ugd2UgcHJlcGFyZSBzdGF0ZW1lbnRzIG9uLWRlbWFuZCBhbmQgY2FjaGUgdGhlbSBoZXJlIGFzIG5lZWRlZDogIyMjXG4gICAgICAgIGhpZGUgQCwgJ3N0YXRlbWVudHMnLCB7fVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZuX2NmZ190ZW1wbGF0ZSA9IHsgZGV0ZXJtaW5pc3RpYzogdHJ1ZSwgdmFyYXJnczogZmFsc2UsIH1cbiAgICAgICAgZm9yIG5hbWUsIGZuX2NmZyBvZiBjbGFzei5mdW5jdGlvbnNcbiAgICAgICAgICBpZiAoIHR5cGVvZiBmbl9jZmcgKSBpcyAnZnVuY3Rpb24nXG4gICAgICAgICAgICBbIGNhbGwsIGZuX2NmZywgXSA9IFsgZm5fY2ZnLCB7fSwgXVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHsgY2FsbCwgfSA9IGZuX2NmZ1xuICAgICAgICAgIGZuX2NmZyAgPSB7IGZuX2NmZ190ZW1wbGF0ZS4uLiwgZm5fY2ZnLCB9XG4gICAgICAgICAgY2FsbCAgICA9IGNhbGwuYmluZCBAXG4gICAgICAgICAgQGRiLmZ1bmN0aW9uIG5hbWUsIGZuX2NmZywgY2FsbFxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9kYl9vYmplY3RzOiAtPlxuICAgICAgICBSID0ge31cbiAgICAgICAgZm9yIGRibyBmcm9tICggQGRiLnByZXBhcmUgU1FMXCJzZWxlY3QgbmFtZSwgdHlwZSBmcm9tIHNxbGl0ZV9zY2hlbWFcIiApLml0ZXJhdGUoKVxuICAgICAgICAgIFJbIGRiby5uYW1lIF0gPSB7IG5hbWU6IGRiby5uYW1lLCB0eXBlOiBkYm8udHlwZSwgfVxuICAgICAgICByZXR1cm4gUlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHRlYXJkb3duOiAtPlxuICAgICAgICBjb3VudCAgICAgICA9IDBcbiAgICAgICAgZnVsbF9wcmVmaXggPSBAZnVsbF9wcmVmaXhcbiAgICAgICAgKCBAcHJlcGFyZSBTUUxcInByYWdtYSBmb3JlaWduX2tleXMgPSBvZmY7XCIgKS5ydW4oKVxuICAgICAgICBmb3IgXywgeyBuYW1lLCB0eXBlLCB9IG9mIEBfZ2V0X2RiX29iamVjdHMoKVxuICAgICAgICAgIGNvbnRpbnVlIHVubGVzcyBuYW1lLnN0YXJ0c1dpdGggZnVsbF9wcmVmaXhcbiAgICAgICAgICBjb3VudCsrXG4gICAgICAgICAgKCBAcHJlcGFyZSBTUUxcImRyb3AgI3t0eXBlfSAje2VzcWwuSSBuYW1lfTtcIiApLnJ1bigpXG4gICAgICAgICggQHByZXBhcmUgU1FMXCJwcmFnbWEgZm9yZWlnbl9rZXlzID0gb247XCIgKS5ydW4oKVxuICAgICAgICByZXR1cm4gY291bnRcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBidWlsZDogLT4gaWYgQGlzX3JlYWR5IHRoZW4gMCBlbHNlIEByZWJ1aWxkKClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByZWJ1aWxkOiAtPlxuICAgICAgICBjbGFzeiAgICAgICAgID0gQGNvbnN0cnVjdG9yXG4gICAgICAgIHR5cGVfb2ZfYnVpbGQgPSB0eXBlX29mIGNsYXN6LmJ1aWxkXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdmFsaWRhdGlvbiAjIyNcbiAgICAgICAgdW5sZXNzIHR5cGVfb2ZfYnVpbGQgaW4gWyAndW5kZWZpbmVkJywgJ251bGwnLCAnbGlzdCcsIF1cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzUgZXhwZWN0ZWQgYW4gb3B0aW9uYWwgbGlzdCBmb3IgI3tjbGFzei5uYW1lfS5idWlsZCwgZ290IGEgI3t0eXBlX29mX2J1aWxkfVwiXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIC0xIGlmICggbm90IGNsYXN6LmJ1aWxkPyApXG4gICAgICAgIHJldHVybiAgMCBpZiAoIGNsYXN6LmJ1aWxkLmxlbmd0aCBpcyAwIClcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBAdGVhcmRvd24oKVxuICAgICAgICBjb3VudCA9IDBcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBmb3IgYnVpbGRfc3RhdGVtZW50IGluIGNsYXN6LmJ1aWxkXG4gICAgICAgICAgY291bnQrK1xuICAgICAgICAgICMgZGVidWcgJ86pX19fNicsIFwiYnVpbGQgc3RhdGVtZW50OlwiLCBidWlsZF9zdGF0ZW1lbnRcbiAgICAgICAgICAoIEBwcmVwYXJlIGJ1aWxkX3N0YXRlbWVudCApLnJ1bigpXG4gICAgICAgIHJldHVybiBjb3VudFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2lzX3JlYWR5JywgICAgIC0+IEBfZ2V0X2lzX3JlYWR5KClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X2dldHRlciBAOjosICdwcmVmaXgnLCAgICAgICAtPlxuICAgICAgICByZXR1cm4gQGNvbnN0cnVjdG9yLm5hbWUucmVwbGFjZSAvXi4qXyhbXl9dKykkLywgJyQxJyB1bmxlc3MgQGNmZy5wcmVmaXg/XG4gICAgICAgIHJldHVybiAnJyBpZiBAY2ZnLnByZWZpeCBpcyAnKE5PUFJFRklYKSdcbiAgICAgICAgcmV0dXJuIEBjZmcucHJlZml4XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHNldF9nZXR0ZXIgQDo6LCAnZnVsbF9wcmVmaXgnLCAgLT5cbiAgICAgICAgcmV0dXJuICcnIGlmICggbm90IEBjZmcucHJlZml4PyApXG4gICAgICAgIHJldHVybiAnJyBpZiBAY2ZnLnByZWZpeCBpcyAnKE5PUFJFRklYKSdcbiAgICAgICAgcmV0dXJuICcnIGlmIEBjZmcucHJlZml4IGlzICcnXG4gICAgICAgIHJldHVybiBcIiN7QGNmZy5wcmVmaXh9X1wiXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfaXNfcmVhZHk6IC0+IHRydWVcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfcHJlcGFyZV9zdGF0ZW1lbnRzOiAtPlxuICAgICAgICAjICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICMgZm9yIG5hbWUsIHNxbCBvZiBjbGFzei5zdGF0ZW1lbnRzXG4gICAgICAgICMgICBzd2l0Y2ggdHJ1ZVxuICAgICAgICAjICAgICB3aGVuIG5hbWUuc3RhcnRzV2l0aCAnY3JlYXRlX3RhYmxlXydcbiAgICAgICAgIyAgICAgICBudWxsXG4gICAgICAgICMgICAgIHdoZW4gbmFtZS5zdGFydHNXaXRoICdpbnNlcnRfJ1xuICAgICAgICAjICAgICAgIG51bGxcbiAgICAgICAgIyAgICAgZWxzZVxuICAgICAgICAjICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pbnFsX19fNyB1bmFibGUgdG8gcGFyc2Ugc3RhdGVtZW50IG5hbWUgI3tycHIgbmFtZX1cIlxuICAgICAgICAjICMgICBAWyBuYW1lIF0gPSBAcHJlcGFyZSBzcWxcbiAgICAgICAgaGlkZSBALCAnc3RhdGVtZW50cycsIHt9XG4gICAgICAgIGJ1aWxkX3N0YXRlbWVudF9uYW1lICA9IEBfbmFtZV9vZl9idWlsZF9zdGF0ZW1lbnRzXG4gICAgICAgIGZvciBuYW1lLCBzdGF0ZW1lbnQgb2YgQGNvbnN0cnVjdG9yLnN0YXRlbWVudHNcbiAgICAgICAgICAjIGlmICggdHlwZV9vZiBzdGF0ZW1lbnQgKSBpcyAnbGlzdCdcbiAgICAgICAgICAjICAgQHN0YXRlbWVudHNbIG5hbWUgXSA9ICggQHByZXBhcmUgc3ViX3N0YXRlbWVudCBmb3Igc3ViX3N0YXRlbWVudCBpbiBzdGF0ZW1lbnQgKVxuICAgICAgICAgICMgICBjb250aW51ZVxuICAgICAgICAgIEBzdGF0ZW1lbnRzWyBuYW1lIF0gPSBAcHJlcGFyZSBzdGF0ZW1lbnRcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgaXNfcmVhZHk6IC0+XG4gICAgICAgICMgZGJvcyA9IEBfZ2V0X2RiX29iamVjdHMoKVxuICAgICAgICAjIHJldHVybiBmYWxzZSB1bmxlc3MgZGJvcy5zdG9yZV9mYWNldHM/LnR5cGUgaXMgJ3RhYmxlJ1xuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGV4ZWN1dGU6ICggc3FsICkgLT4gQGRiLmV4ZWMgICAgc3FsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcHJlcGFyZTogKCBzcWwgKSAtPlxuICAgICAgICB0cnlcbiAgICAgICAgICBSID0gQGRiLnByZXBhcmUgc3FsXG4gICAgICAgIGNhdGNoIGNhdXNlXG4gICAgICAgICAgIyMjIFRBSU5UIGBycHIoKWAgdXJnZW50bHkgbmVlZGVkICMjI1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fOCB3aGVuIHRyeWluZyB0byBwcmVwYXJlIHRoZSBmb2xsb3dpbmcgc3RhdGVtZW50LCBhbiBlcnJvciB3YXMgdGhyb3duOiAje3JwciBzcWx9XCIsIHsgY2F1c2UsIH1cbiAgICAgICAgcmV0dXJuIFJcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgRGJyaWNfc3RkIGV4dGVuZHMgRGJyaWNcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBAY2ZnOiBPYmplY3QuZnJlZXplXG4gICAgICAgIHByZWZpeDogJ3N0ZCdcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBAZnVuY3Rpb25zOiAgIHt9XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgQHN0YXRlbWVudHM6XG4gICAgICAgIHN0ZF9nZXRfc2NoZW1hOiBTUUxcIlwiXCJcbiAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNxbGl0ZV9zY2hlbWEgb3JkZXIgYnkgbmFtZSwgdHlwZTtcIlwiXCJcbiAgICAgICAgc3RkX2dldF90YWJsZXM6IFNRTFwiXCJcIlxuICAgICAgICAgIHNlbGVjdCAqIGZyb20gc3FsaXRlX3NjaGVtYSB3aGVyZSB0eXBlIGlzICd0YWJsZScgb3JkZXIgYnkgbmFtZSwgdHlwZTtcIlwiXCJcbiAgICAgICAgc3RkX2dldF92aWV3czogU1FMXCJcIlwiXG4gICAgICAgICAgc2VsZWN0ICogZnJvbSBzcWxpdGVfc2NoZW1hIHdoZXJlIHR5cGUgaXMgJ3ZpZXcnIG9yZGVyIGJ5IG5hbWUsIHR5cGU7XCJcIlwiXG4gICAgICAgIHN0ZF9nZXRfcmVsYXRpb25zOiBTUUxcIlwiXCJcbiAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNxbGl0ZV9zY2hlbWEgd2hlcmUgdHlwZSBpbiAoICd0YWJsZScsICd2aWV3JyApIG9yZGVyIGJ5IG5hbWUsIHR5cGU7XCJcIlwiXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgQGJ1aWxkOiBbXG4gICAgICAgIFNRTFwiXCJcImNyZWF0ZSB2aWV3IHN0ZF90YWJsZXMgYXNcbiAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNxbGl0ZV9zY2hlbWFcbiAgICAgICAgICAgIHdoZXJlIHR5cGUgaXMgJ3RhYmxlJyBvcmRlciBieSBuYW1lLCB0eXBlO1wiXCJcIlxuICAgICAgICBTUUxcIlwiXCJjcmVhdGUgdmlldyBzdGRfdmlld3MgYXNcbiAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNxbGl0ZV9zY2hlbWFcbiAgICAgICAgICAgIHdoZXJlIHR5cGUgaXMgJ3ZpZXcnIG9yZGVyIGJ5IG5hbWUsIHR5cGU7XCJcIlwiXG4gICAgICAgIFNRTFwiXCJcImNyZWF0ZSB2aWV3IHN0ZF9yZWxhdGlvbnMgYXNcbiAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNxbGl0ZV9zY2hlbWFcbiAgICAgICAgICAgIHdoZXJlIHR5cGUgaW4gKCAndGFibGUnLCAndmlldycgKSBvcmRlciBieSBuYW1lLCB0eXBlO1wiXCJcIlxuICAgICAgICBdXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9nZXRfaXNfcmVhZHk6IC0+XG4gICAgICAgIGRiX29iamVjdHMgPSBAX2dldF9kYl9vYmplY3RzKClcbiAgICAgICAgcmV0dXJuIGZhbHNlIHVubGVzcyBkYl9vYmplY3RzLnN0ZF90YWJsZXM/LnR5cGUgICAgIGlzICd2aWV3J1xuICAgICAgICByZXR1cm4gZmFsc2UgdW5sZXNzIGRiX29iamVjdHMuc3RkX3ZpZXdzPy50eXBlICAgICAgaXMgJ3ZpZXcnXG4gICAgICAgIHJldHVybiBmYWxzZSB1bmxlc3MgZGJfb2JqZWN0cy5zdGRfcmVsYXRpb25zPy50eXBlICBpcyAndmlldydcbiAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgU2VnbWVudF93aWR0aF9kYiBleHRlbmRzIERicmljXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgQGZ1bmN0aW9uczpcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB3aWR0aF9mcm9tX3RleHQ6XG4gICAgICAgICAgZGV0ZXJtaW5pc3RpYzogIHRydWVcbiAgICAgICAgICB2YXJhcmdzOiAgICAgICAgZmFsc2VcbiAgICAgICAgICBjYWxsOiAgICAgICAgICAgKCB0ZXh0ICkgLT4gZ2V0X3djX21heF9saW5lX2xlbmd0aCB0ZXh0XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgbGVuZ3RoX2Zyb21fdGV4dDpcbiAgICAgICAgICBkZXRlcm1pbmlzdGljOiAgdHJ1ZVxuICAgICAgICAgIHZhcmFyZ3M6ICAgICAgICBmYWxzZVxuICAgICAgICAgIGNhbGw6ICAgICAgICAgICAoIHRleHQgKSAtPiB0ZXh0Lmxlbmd0aFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIEBzdGF0ZW1lbnRzOlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGNyZWF0ZV90YWJsZV9zZWdtZW50czogU1FMXCJcIlwiXG4gICAgICAgICAgZHJvcCB0YWJsZSBpZiBleGlzdHMgc2VnbWVudHM7XG4gICAgICAgICAgY3JlYXRlIHRhYmxlIHNlZ21lbnRzIChcbiAgICAgICAgICAgICAgc2VnbWVudF90ZXh0ICAgICAgdGV4dCAgICBub3QgbnVsbCBwcmltYXJ5IGtleSxcbiAgICAgICAgICAgICAgc2VnbWVudF93aWR0aCAgICAgaW50ZWdlciBub3QgbnVsbCBnZW5lcmF0ZWQgYWx3YXlzIGFzICggd2lkdGhfZnJvbV90ZXh0KCAgc2VnbWVudF90ZXh0ICkgKSBzdG9yZWQsXG4gICAgICAgICAgICAgIHNlZ21lbnRfbGVuZ3RoICAgIGludGVnZXIgbm90IG51bGwgZ2VuZXJhdGVkIGFsd2F5cyBhcyAoIGxlbmd0aF9mcm9tX3RleHQoIHNlZ21lbnRfdGV4dCApICkgc3RvcmVkLFxuICAgICAgICAgICAgY29uc3RyYWludCBzZWdtZW50X3dpZHRoX2VxZ3RfemVybyAgY2hlY2sgKCBzZWdtZW50X3dpZHRoICA+PSAwICksXG4gICAgICAgICAgICBjb25zdHJhaW50IHNlZ21lbnRfbGVuZ3RoX2VxZ3RfemVybyBjaGVjayAoIHNlZ21lbnRfbGVuZ3RoID49IDAgKSApO1wiXCJcIlxuICAgICAgICAjICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICMgaW5zZXJ0X3NlZ21lbnQ6IFNRTFwiXCJcIlxuICAgICAgICAjICAgaW5zZXJ0IGludG8gc2VnbWVudHMgICggc2VnbWVudF90ZXh0LCAgIHNlZ21lbnRfd2lkdGgsICBzZWdtZW50X2xlbmd0aCAgKVxuICAgICAgICAjICAgICAgICAgICAgICAgICB2YWx1ZXMgICggJHNlZ21lbnRfdGV4dCwgICRzZWdtZW50X3dpZHRoLCAkc2VnbWVudF9sZW5ndGggKVxuICAgICAgICAjICAgICBvbiBjb25mbGljdCAoIHNlZ21lbnRfdGV4dCApIGRvIHVwZGF0ZVxuICAgICAgICAjICAgICAgICAgICAgICAgICBzZXQgICAgICggICAgICAgICAgICAgICAgIHNlZ21lbnRfd2lkdGgsICBzZWdtZW50X2xlbmd0aCAgKSA9XG4gICAgICAgICMgICAgICAgICAgICAgICAgICAgICAgICAgKCBleGNsdWRlZC5zZWdtZW50X3dpZHRoLCBleGNsdWRlZC5zZWdtZW50X2xlbmd0aCApO1wiXCJcIlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGluc2VydF9zZWdtZW50OiBTUUxcIlwiXCJcbiAgICAgICAgICBpbnNlcnQgaW50byBzZWdtZW50cyAgKCBzZWdtZW50X3RleHQgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlcyAgKCAkc2VnbWVudF90ZXh0IClcbiAgICAgICAgICAgIG9uIGNvbmZsaWN0ICggc2VnbWVudF90ZXh0ICkgZG8gbm90aGluZ1xuICAgICAgICAgICAgcmV0dXJuaW5nICo7XCJcIlwiXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgc2VsZWN0X3Jvd19mcm9tX3NlZ21lbnRzOiBTUUxcIlwiXCJcbiAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNlZ21lbnRzIHdoZXJlIHNlZ21lbnRfdGV4dCA9ICRzZWdtZW50X3RleHQgbGltaXQgMTtcIlwiXCJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKCBkYl9wYXRoICkgLT5cbiAgICAgICAgc3VwZXIgZGJfcGF0aFxuICAgICAgICBjbGFzeiAgID0gQGNvbnN0cnVjdG9yXG4gICAgICAgIEBjYWNoZSAgPSBuZXcgTWFwKClcbiAgICAgICAgIyMjIFRBSU5UIHNob3VsZCBiZSBkb25lIGF1dG9tYXRpY2FsbHkgIyMjXG4gICAgICAgIEBzdGF0ZW1lbnRzID1cbiAgICAgICAgICBpbnNlcnRfc2VnbWVudDogICAgICAgICAgIEBwcmVwYXJlIGNsYXN6LnN0YXRlbWVudHMuaW5zZXJ0X3NlZ21lbnRcbiAgICAgICAgICBzZWxlY3Rfcm93X2Zyb21fc2VnbWVudHM6IEBwcmVwYXJlIGNsYXN6LnN0YXRlbWVudHMuc2VsZWN0X3Jvd19mcm9tX3NlZ21lbnRzXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW50ZXJuYWxzID0gT2JqZWN0LmZyZWV6ZSB7IGludGVybmFscy4uLiwgU2VnbWVudF93aWR0aF9kYiwgfVxuICAgIHJldHVybiBleHBvcnRzID0ge1xuICAgICAgRGJyaWMsXG4gICAgICBEYnJpY19zdGQsXG4gICAgICBlc3FsLFxuICAgICAgU1FMLFxuICAgICAgaW50ZXJuYWxzLCB9XG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBVTlNUQUJMRV9EQlJJQ19CUklDU1xuXG4iXX0=
//# sourceURL=../src/unstable-dbric-brics.coffee