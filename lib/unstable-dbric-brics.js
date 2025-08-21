(function() {
  'use strict';
  var UNSTABLE_DBRIC_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_DBRIC_BRICS = {
    
    //=========================================================================================================
    /* NOTE Future Single-File Module */
    require_dbric: function() {
      var Dbric, Dbric_std, SQL, SQLITE, Segment_width_db, debug, exports, hide, internals, rpr, set_getter, type_of;
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
            for (dbo of (this.db.prepare(this.constructor.statements.std_get_schema)).iterate()) {
              R[dbo.name] = {
                name: dbo.name,
                type: dbo.type
              };
            }
            return R;
          }

          //-----------------------------------------------------------------------------------------------------
          teardown() {}

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
            var R, build_statement, build_statements, clasz, count, i, len, ref;
            R = -1;
            clasz = this.constructor;
            if ((build_statements = (ref = clasz.statements) != null ? ref.build : void 0) == null) {
              //...................................................................................................
              return -1;
            }
            //...................................................................................................
            /* TAINT use proper validation */
            if (!Array.isArray(build_statements)) {
              throw new Error(`Ω___4 expected a list for ${clasz.name}::statements.build, got ${build_statements}`);
            }
            //...................................................................................................
            this.teardown();
            //...................................................................................................
            count = 0;
            for (i = 0, len = build_statements.length; i < len; i++) {
              build_statement = build_statements[i];
              count++;
              debug('Ω___5', "build statement:", build_statement);
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
            //       throw new Error "Ωnql___6 unable to parse statement name #{rpr name}"
            // #   @[ name ] = @prepare sql
            hide(this, 'statements', {});
            build_statement_name = this._name_of_build_statements;
            ref = this.constructor.statements;
            for (name in ref) {
              statement = ref[name];
              if (name === build_statement_name) {
                continue;
              }
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
              throw new Error(`Ω___7 when trying to prepare the following statement, an error was thrown: ${rpr(sql)}`, {cause});
            }
            return R;
          }

        };

        //-----------------------------------------------------------------------------------------------------
        Dbric.cfg = Object.freeze({
          prefix: 'NOPREFIX'
        });

        Dbric.functions = {};

        Dbric.statements = {
          build: []
        };

        //---------------------------------------------------------------------------------------------------
        set_getter(Dbric.prototype, 'is_ready', function() {
          return this._get_is_ready();
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

        Dbric_std.functions = {};

        Dbric_std.statements = {
          std_get_schema: SQL`select * from sqlite_schema order by name, type;`,
          std_get_tables: SQL`select * from sqlite_schema where type is 'table' order by name, type;`,
          std_get_views: SQL`select * from sqlite_schema where type is 'view' order by name, type;`,
          std_get_relations: SQL`select * from sqlite_schema where type in ( 'table', 'view' ) order by name, type;`,
          //...................................................................................................
          std_build: [
            SQL`create view std_tables as
select * from sqlite_schema
  where type is 'table' order by name, type;`,
            SQL`create view std_views as
select * from sqlite_schema
  where type is 'view' order by name, type;`,
            SQL`create view std_relations as
select * from sqlite_schema
  where type in ( 'table', 'view' ) order by name, type;`
          ]
        };

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
      return exports = {Dbric, SQL, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_DBRIC_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWRicmljLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxvQkFBQTs7Ozs7RUFLQSxvQkFBQSxHQUtFLENBQUE7Ozs7SUFBQSxhQUFBLEVBQWUsUUFBQSxDQUFBLENBQUE7QUFFakIsVUFBQSxLQUFBLEVBQUEsU0FBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsZ0JBQUEsRUFBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBLEVBQUEsR0FBQSxFQUFBLFVBQUEsRUFBQSxPQUFBOztNQUNJLENBQUEsQ0FBRSxJQUFGLEVBQ0UsVUFERixDQUFBLEdBQzRCLENBQUUsT0FBQSxDQUFRLFFBQVIsQ0FBRixDQUFvQixDQUFDLDhCQUFyQixDQUFBLENBRDVCO01BRUEsQ0FBQSxDQUFFLE9BQUYsQ0FBQSxHQUE0QixDQUFFLE9BQUEsQ0FBUSxRQUFSLENBQUYsQ0FBb0IsQ0FBQyxRQUFRLENBQUMsZUFBOUIsQ0FBQSxDQUE1QjtNQUNBLENBQUE7UUFBRSxjQUFBLEVBQWdCO01BQWxCLENBQUEsR0FBNEIsQ0FBRSxPQUFBLENBQVEsUUFBUixDQUFGLENBQW9CLENBQUMsUUFBUSxDQUFDLFlBQTlCLENBQUEsQ0FBNUI7TUFDQSxNQUFBLEdBQTRCLE9BQUEsQ0FBUSxhQUFSO01BQzVCLENBQUEsQ0FBRSxLQUFGLENBQUEsR0FBNEIsT0FBNUIsRUFOSjs7TUFTSSxTQUFBLEdBQVksQ0FBQSxFQVRoQjs7TUFZSSxHQUFBLEdBQU0sUUFBQSxDQUFFLEtBQUYsRUFBQSxHQUFTLFdBQVQsQ0FBQTtBQUNWLFlBQUEsQ0FBQSxFQUFBLFVBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBO1FBQU0sQ0FBQSxHQUFJLEtBQUssQ0FBRSxDQUFGO1FBQ1QsS0FBQSx5REFBQTs7VUFDRSxDQUFBLElBQUssVUFBVSxDQUFDLFFBQVgsQ0FB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LENBQUUsR0FBQSxTQUFGLEVBQWdCLGdCQUFoQixDQUFkO0FBQ1osYUFBTyxPQUFBLEdBQVUsQ0FDZixLQURlLEVBRWYsR0FGZSxFQUdmLFNBSGU7SUFwT0o7RUFBZixFQVZGOzs7RUFxUEEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBckIsRUFBOEIsb0JBQTlCO0FBclBBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5VTlNUQUJMRV9EQlJJQ19CUklDUyA9XG4gIFxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9kYnJpYzogLT5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgeyBoaWRlLFxuICAgICAgc2V0X2dldHRlciwgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vbWFpbicgKS5yZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHMoKVxuICAgIHsgdHlwZV9vZiwgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4vbWFpbicgKS51bnN0YWJsZS5yZXF1aXJlX3R5cGVfb2YoKVxuICAgIHsgc2hvd19ub19jb2xvcnM6IHJwciwgIH0gPSAoIHJlcXVpcmUgJy4vbWFpbicgKS51bnN0YWJsZS5yZXF1aXJlX3Nob3coKVxuICAgIFNRTElURSAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOnNxbGl0ZSdcbiAgICB7IGRlYnVnLCAgICAgICAgICAgICAgICB9ID0gY29uc29sZVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBpbnRlcm5hbHMgPSB7fVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBTUUwgPSAoIHBhcnRzLCBleHByZXNzaW9ucy4uLiApIC0+XG4gICAgICBSID0gcGFydHNbIDAgXVxuICAgICAgZm9yIGV4cHJlc3Npb24sIGlkeCBpbiBleHByZXNzaW9uc1xuICAgICAgICBSICs9IGV4cHJlc3Npb24udG9TdHJpbmcoKSArIHBhcnRzWyBpZHggKyAxIF1cbiAgICAgIHJldHVybiBSXG5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgRGJyaWNcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBAY2ZnOiBPYmplY3QuZnJlZXplXG4gICAgICAgIHByZWZpeDogJ05PUFJFRklYJ1xuICAgICAgQGZ1bmN0aW9uczogICB7fVxuICAgICAgQHN0YXRlbWVudHM6ICB7IGJ1aWxkOiBbXSwgfVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIEBvcGVuOiAoIGRiX3BhdGggKSAtPlxuICAgICAgICBjbGFzeiA9IEBcbiAgICAgICAgUiAgICAgPSBuZXcgY2xhc3ogZGJfcGF0aFxuICAgICAgICBSLmJ1aWxkKClcbiAgICAgICAgUi5fcHJlcGFyZV9zdGF0ZW1lbnRzKClcbiAgICAgICAgcmV0dXJuIFJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKCBkYl9wYXRoICkgLT5cbiAgICAgICAgQGRiICAgICAgICAgICAgICAgICA9IG5ldyBTUUxJVEUuRGF0YWJhc2VTeW5jIGRiX3BhdGhcbiAgICAgICAgY2xhc3ogICAgICAgICAgICAgICA9IEBjb25zdHJ1Y3RvclxuICAgICAgICBAY2ZnICAgICAgICAgICAgICAgID0gT2JqZWN0LmZyZWV6ZSB7IGNsYXN6LmNmZy4uLiwgZGJfcGF0aCwgfVxuICAgICAgICAjIyMgTk9URSB3ZSBjYW4ndCBqdXN0IHByZXBhcmUgYWxsIHRoZSBzdGV0bWVudHMgYXMgdGhleSBkZXBlbmQgb24gREIgb2JqZWN0cyBleGlzdGluZyBvciBub3QgZXhpc3RpbmcsXG4gICAgICAgIGFzIHRoZSBjYXNlIG1heSBiZS4gSGVuY2Ugd2UgcHJlcGFyZSBzdGF0ZW1lbnRzIG9uLWRlbWFuZCBhbmQgY2FjaGUgdGhlbSBoZXJlIGFzIG5lZWRlZDogIyMjXG4gICAgICAgIGhpZGUgQCwgJ3N0YXRlbWVudHMnLCB7fVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGZuX2NmZ190ZW1wbGF0ZSA9IHsgZGV0ZXJtaW5pc3RpYzogdHJ1ZSwgdmFyYXJnczogZmFsc2UsIH1cbiAgICAgICAgZm9yIG5hbWUsIGZuX2NmZyBvZiBjbGFzei5mdW5jdGlvbnNcbiAgICAgICAgICBpZiAoIHR5cGVvZiBmbl9jZmcgKSBpcyAnZnVuY3Rpb24nXG4gICAgICAgICAgICBbIGNhbGwsIGZuX2NmZywgXSA9IFsgZm5fY2ZnLCB7fSwgXVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHsgY2FsbCwgfSA9IGZuX2NmZ1xuICAgICAgICAgIGZuX2NmZyAgPSB7IGZuX2NmZ190ZW1wbGF0ZS4uLiwgZm5fY2ZnLCB9XG4gICAgICAgICAgY2FsbCAgICA9IGNhbGwuYmluZCBAXG4gICAgICAgICAgQGRiLmZ1bmN0aW9uIG5hbWUsIGZuX2NmZywgY2FsbFxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9kYl9vYmplY3RzOiAtPlxuICAgICAgICBSID0ge31cbiAgICAgICAgZm9yIGRibyBmcm9tICggQGRiLnByZXBhcmUgQGNvbnN0cnVjdG9yLnN0YXRlbWVudHMuc3RkX2dldF9zY2hlbWEgKS5pdGVyYXRlKClcbiAgICAgICAgICBSWyBkYm8ubmFtZSBdID0geyBuYW1lOiBkYm8ubmFtZSwgdHlwZTogZGJvLnR5cGUsIH1cbiAgICAgICAgcmV0dXJuIFJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB0ZWFyZG93bjogLT5cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBidWlsZDogLT4gaWYgQGlzX3JlYWR5IHRoZW4gMCBlbHNlIEByZWJ1aWxkKClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByZWJ1aWxkOiAtPlxuICAgICAgICBSICAgICA9IC0xXG4gICAgICAgIGNsYXN6ID0gQGNvbnN0cnVjdG9yXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgcmV0dXJuIC0xIHVubGVzcyAoIGJ1aWxkX3N0YXRlbWVudHMgPSBjbGFzei5zdGF0ZW1lbnRzPy5idWlsZCApP1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgICMjIyBUQUlOVCB1c2UgcHJvcGVyIHZhbGlkYXRpb24gIyMjXG4gICAgICAgIHVubGVzcyBBcnJheS5pc0FycmF5IGJ1aWxkX3N0YXRlbWVudHNcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzQgZXhwZWN0ZWQgYSBsaXN0IGZvciAje2NsYXN6Lm5hbWV9OjpzdGF0ZW1lbnRzLmJ1aWxkLCBnb3QgI3tidWlsZF9zdGF0ZW1lbnRzfVwiXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgQHRlYXJkb3duKClcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBjb3VudCA9IDBcbiAgICAgICAgZm9yIGJ1aWxkX3N0YXRlbWVudCBpbiBidWlsZF9zdGF0ZW1lbnRzXG4gICAgICAgICAgY291bnQrK1xuICAgICAgICAgIGRlYnVnICfOqV9fXzUnLCBcImJ1aWxkIHN0YXRlbWVudDpcIiwgYnVpbGRfc3RhdGVtZW50XG4gICAgICAgICAgKCBAcHJlcGFyZSBidWlsZF9zdGF0ZW1lbnQgKS5ydW4oKVxuICAgICAgICByZXR1cm4gY291bnRcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X2dldHRlciBAOjosICdpc19yZWFkeScsIC0+IEBfZ2V0X2lzX3JlYWR5KClcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9pc19yZWFkeTogLT4gdHJ1ZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9wcmVwYXJlX3N0YXRlbWVudHM6IC0+XG4gICAgICAgICMgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgIyBmb3IgbmFtZSwgc3FsIG9mIGNsYXN6LnN0YXRlbWVudHNcbiAgICAgICAgIyAgIHN3aXRjaCB0cnVlXG4gICAgICAgICMgICAgIHdoZW4gbmFtZS5zdGFydHNXaXRoICdjcmVhdGVfdGFibGVfJ1xuICAgICAgICAjICAgICAgIG51bGxcbiAgICAgICAgIyAgICAgd2hlbiBuYW1lLnN0YXJ0c1dpdGggJ2luc2VydF8nXG4gICAgICAgICMgICAgICAgbnVsbFxuICAgICAgICAjICAgICBlbHNlXG4gICAgICAgICMgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlucWxfX182IHVuYWJsZSB0byBwYXJzZSBzdGF0ZW1lbnQgbmFtZSAje3JwciBuYW1lfVwiXG4gICAgICAgICMgIyAgIEBbIG5hbWUgXSA9IEBwcmVwYXJlIHNxbFxuICAgICAgICBoaWRlIEAsICdzdGF0ZW1lbnRzJywge31cbiAgICAgICAgYnVpbGRfc3RhdGVtZW50X25hbWUgID0gQF9uYW1lX29mX2J1aWxkX3N0YXRlbWVudHNcbiAgICAgICAgZm9yIG5hbWUsIHN0YXRlbWVudCBvZiBAY29uc3RydWN0b3Iuc3RhdGVtZW50c1xuICAgICAgICAgIGNvbnRpbnVlIGlmIG5hbWUgaXMgYnVpbGRfc3RhdGVtZW50X25hbWVcbiAgICAgICAgICBAc3RhdGVtZW50c1sgbmFtZSBdID0gQHByZXBhcmUgc3RhdGVtZW50XG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGlzX3JlYWR5OiAtPlxuICAgICAgICAjIGRib3MgPSBAX2dldF9kYl9vYmplY3RzKClcbiAgICAgICAgIyByZXR1cm4gZmFsc2UgdW5sZXNzIGRib3Muc3RvcmVfZmFjZXRzPy50eXBlIGlzICd0YWJsZSdcbiAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBleGVjdXRlOiAoIHNxbCApIC0+IEBkYi5leGVjICAgIHNxbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHByZXBhcmU6ICggc3FsICkgLT5cbiAgICAgICAgdHJ5XG4gICAgICAgICAgUiA9IEBkYi5wcmVwYXJlIHNxbFxuICAgICAgICBjYXRjaCBjYXVzZVxuICAgICAgICAgICMjIyBUQUlOVCBgcnByKClgIHVyZ2VudGx5IG5lZWRlZCAjIyNcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqV9fXzcgd2hlbiB0cnlpbmcgdG8gcHJlcGFyZSB0aGUgZm9sbG93aW5nIHN0YXRlbWVudCwgYW4gZXJyb3Igd2FzIHRocm93bjogI3tycHIgc3FsfVwiLCB7IGNhdXNlLCB9XG4gICAgICAgIHJldHVybiBSXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIERicmljX3N0ZCBleHRlbmRzIERicmljXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgQGNmZzogT2JqZWN0LmZyZWV6ZVxuICAgICAgICBwcmVmaXg6ICdzdGQnXG4gICAgICBAZnVuY3Rpb25zOiAgIHt9XG4gICAgICBAc3RhdGVtZW50czpcbiAgICAgICAgc3RkX2dldF9zY2hlbWE6IFNRTFwiXCJcIlxuICAgICAgICAgIHNlbGVjdCAqIGZyb20gc3FsaXRlX3NjaGVtYSBvcmRlciBieSBuYW1lLCB0eXBlO1wiXCJcIlxuICAgICAgICBzdGRfZ2V0X3RhYmxlczogU1FMXCJcIlwiXG4gICAgICAgICAgc2VsZWN0ICogZnJvbSBzcWxpdGVfc2NoZW1hIHdoZXJlIHR5cGUgaXMgJ3RhYmxlJyBvcmRlciBieSBuYW1lLCB0eXBlO1wiXCJcIlxuICAgICAgICBzdGRfZ2V0X3ZpZXdzOiBTUUxcIlwiXCJcbiAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNxbGl0ZV9zY2hlbWEgd2hlcmUgdHlwZSBpcyAndmlldycgb3JkZXIgYnkgbmFtZSwgdHlwZTtcIlwiXCJcbiAgICAgICAgc3RkX2dldF9yZWxhdGlvbnM6IFNRTFwiXCJcIlxuICAgICAgICAgIHNlbGVjdCAqIGZyb20gc3FsaXRlX3NjaGVtYSB3aGVyZSB0eXBlIGluICggJ3RhYmxlJywgJ3ZpZXcnICkgb3JkZXIgYnkgbmFtZSwgdHlwZTtcIlwiXCJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBzdGRfYnVpbGQ6IFtcbiAgICAgICAgICBTUUxcIlwiXCJjcmVhdGUgdmlldyBzdGRfdGFibGVzIGFzXG4gICAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNxbGl0ZV9zY2hlbWFcbiAgICAgICAgICAgICAgd2hlcmUgdHlwZSBpcyAndGFibGUnIG9yZGVyIGJ5IG5hbWUsIHR5cGU7XCJcIlwiXG4gICAgICAgICAgU1FMXCJcIlwiY3JlYXRlIHZpZXcgc3RkX3ZpZXdzIGFzXG4gICAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNxbGl0ZV9zY2hlbWFcbiAgICAgICAgICAgICAgd2hlcmUgdHlwZSBpcyAndmlldycgb3JkZXIgYnkgbmFtZSwgdHlwZTtcIlwiXCJcbiAgICAgICAgICBTUUxcIlwiXCJjcmVhdGUgdmlldyBzdGRfcmVsYXRpb25zIGFzXG4gICAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNxbGl0ZV9zY2hlbWFcbiAgICAgICAgICAgICAgd2hlcmUgdHlwZSBpbiAoICd0YWJsZScsICd2aWV3JyApIG9yZGVyIGJ5IG5hbWUsIHR5cGU7XCJcIlwiXG4gICAgICAgICAgXVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X2lzX3JlYWR5OiAtPlxuICAgICAgICBkYl9vYmplY3RzID0gQF9nZXRfZGJfb2JqZWN0cygpXG4gICAgICAgIHJldHVybiBmYWxzZSB1bmxlc3MgZGJfb2JqZWN0cy5zdGRfdGFibGVzPy50eXBlICAgICBpcyAndmlldydcbiAgICAgICAgcmV0dXJuIGZhbHNlIHVubGVzcyBkYl9vYmplY3RzLnN0ZF92aWV3cz8udHlwZSAgICAgIGlzICd2aWV3J1xuICAgICAgICByZXR1cm4gZmFsc2UgdW5sZXNzIGRiX29iamVjdHMuc3RkX3JlbGF0aW9ucz8udHlwZSAgaXMgJ3ZpZXcnXG4gICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIFNlZ21lbnRfd2lkdGhfZGIgZXh0ZW5kcyBEYnJpY1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIEBmdW5jdGlvbnM6XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgd2lkdGhfZnJvbV90ZXh0OlxuICAgICAgICAgIGRldGVybWluaXN0aWM6ICB0cnVlXG4gICAgICAgICAgdmFyYXJnczogICAgICAgIGZhbHNlXG4gICAgICAgICAgY2FsbDogICAgICAgICAgICggdGV4dCApIC0+IGdldF93Y19tYXhfbGluZV9sZW5ndGggdGV4dFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGxlbmd0aF9mcm9tX3RleHQ6XG4gICAgICAgICAgZGV0ZXJtaW5pc3RpYzogIHRydWVcbiAgICAgICAgICB2YXJhcmdzOiAgICAgICAgZmFsc2VcbiAgICAgICAgICBjYWxsOiAgICAgICAgICAgKCB0ZXh0ICkgLT4gdGV4dC5sZW5ndGhcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBAc3RhdGVtZW50czpcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBjcmVhdGVfdGFibGVfc2VnbWVudHM6IFNRTFwiXCJcIlxuICAgICAgICAgIGRyb3AgdGFibGUgaWYgZXhpc3RzIHNlZ21lbnRzO1xuICAgICAgICAgIGNyZWF0ZSB0YWJsZSBzZWdtZW50cyAoXG4gICAgICAgICAgICAgIHNlZ21lbnRfdGV4dCAgICAgIHRleHQgICAgbm90IG51bGwgcHJpbWFyeSBrZXksXG4gICAgICAgICAgICAgIHNlZ21lbnRfd2lkdGggICAgIGludGVnZXIgbm90IG51bGwgZ2VuZXJhdGVkIGFsd2F5cyBhcyAoIHdpZHRoX2Zyb21fdGV4dCggIHNlZ21lbnRfdGV4dCApICkgc3RvcmVkLFxuICAgICAgICAgICAgICBzZWdtZW50X2xlbmd0aCAgICBpbnRlZ2VyIG5vdCBudWxsIGdlbmVyYXRlZCBhbHdheXMgYXMgKCBsZW5ndGhfZnJvbV90ZXh0KCBzZWdtZW50X3RleHQgKSApIHN0b3JlZCxcbiAgICAgICAgICAgIGNvbnN0cmFpbnQgc2VnbWVudF93aWR0aF9lcWd0X3plcm8gIGNoZWNrICggc2VnbWVudF93aWR0aCAgPj0gMCApLFxuICAgICAgICAgICAgY29uc3RyYWludCBzZWdtZW50X2xlbmd0aF9lcWd0X3plcm8gY2hlY2sgKCBzZWdtZW50X2xlbmd0aCA+PSAwICkgKTtcIlwiXCJcbiAgICAgICAgIyAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAjIGluc2VydF9zZWdtZW50OiBTUUxcIlwiXCJcbiAgICAgICAgIyAgIGluc2VydCBpbnRvIHNlZ21lbnRzICAoIHNlZ21lbnRfdGV4dCwgICBzZWdtZW50X3dpZHRoLCAgc2VnbWVudF9sZW5ndGggIClcbiAgICAgICAgIyAgICAgICAgICAgICAgICAgdmFsdWVzICAoICRzZWdtZW50X3RleHQsICAkc2VnbWVudF93aWR0aCwgJHNlZ21lbnRfbGVuZ3RoIClcbiAgICAgICAgIyAgICAgb24gY29uZmxpY3QgKCBzZWdtZW50X3RleHQgKSBkbyB1cGRhdGVcbiAgICAgICAgIyAgICAgICAgICAgICAgICAgc2V0ICAgICAoICAgICAgICAgICAgICAgICBzZWdtZW50X3dpZHRoLCAgc2VnbWVudF9sZW5ndGggICkgPVxuICAgICAgICAjICAgICAgICAgICAgICAgICAgICAgICAgICggZXhjbHVkZWQuc2VnbWVudF93aWR0aCwgZXhjbHVkZWQuc2VnbWVudF9sZW5ndGggKTtcIlwiXCJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBpbnNlcnRfc2VnbWVudDogU1FMXCJcIlwiXG4gICAgICAgICAgaW5zZXJ0IGludG8gc2VnbWVudHMgICggc2VnbWVudF90ZXh0ICApXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgICggJHNlZ21lbnRfdGV4dCApXG4gICAgICAgICAgICBvbiBjb25mbGljdCAoIHNlZ21lbnRfdGV4dCApIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIHJldHVybmluZyAqO1wiXCJcIlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHNlbGVjdF9yb3dfZnJvbV9zZWdtZW50czogU1FMXCJcIlwiXG4gICAgICAgICAgc2VsZWN0ICogZnJvbSBzZWdtZW50cyB3aGVyZSBzZWdtZW50X3RleHQgPSAkc2VnbWVudF90ZXh0IGxpbWl0IDE7XCJcIlwiXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICggZGJfcGF0aCApIC0+XG4gICAgICAgIHN1cGVyIGRiX3BhdGhcbiAgICAgICAgY2xhc3ogICA9IEBjb25zdHJ1Y3RvclxuICAgICAgICBAY2FjaGUgID0gbmV3IE1hcCgpXG4gICAgICAgICMjIyBUQUlOVCBzaG91bGQgYmUgZG9uZSBhdXRvbWF0aWNhbGx5ICMjI1xuICAgICAgICBAc3RhdGVtZW50cyA9XG4gICAgICAgICAgaW5zZXJ0X3NlZ21lbnQ6ICAgICAgICAgICBAcHJlcGFyZSBjbGFzei5zdGF0ZW1lbnRzLmluc2VydF9zZWdtZW50XG4gICAgICAgICAgc2VsZWN0X3Jvd19mcm9tX3NlZ21lbnRzOiBAcHJlcGFyZSBjbGFzei5zdGF0ZW1lbnRzLnNlbGVjdF9yb3dfZnJvbV9zZWdtZW50c1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGludGVybmFscyA9IE9iamVjdC5mcmVlemUgeyBpbnRlcm5hbHMuLi4sIFNlZ21lbnRfd2lkdGhfZGIsIH1cbiAgICByZXR1cm4gZXhwb3J0cyA9IHtcbiAgICAgIERicmljLFxuICAgICAgU1FMLFxuICAgICAgaW50ZXJuYWxzLCB9XG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBVTlNUQUJMRV9EQlJJQ19CUklDU1xuXG4iXX0=
//# sourceURL=../src/unstable-dbric-brics.coffee