(function() {
  'use strict';
  var UNSTABLE_DBRIC_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_DBRIC_BRICS = {
    
    //=========================================================================================================
    /* NOTE Future Single-File Module */
    require_dbric: function() {
      var Dbric, Dbric_std, SQL, SQLITE, Segment_width_db, debug, exports, hide, internals, set_getter;
      //=======================================================================================================
      ({hide, set_getter} = (require('./main')).require_managed_property_tools());
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
              throw new Error(`Ω___7 when trying to prepare the following statement, an error was thrown: ${sql}`, {cause});
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWRicmljLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxvQkFBQTs7Ozs7RUFLQSxvQkFBQSxHQUtFLENBQUE7Ozs7SUFBQSxhQUFBLEVBQWUsUUFBQSxDQUFBLENBQUE7QUFFakIsVUFBQSxLQUFBLEVBQUEsU0FBQSxFQUFBLEdBQUEsRUFBQSxNQUFBLEVBQUEsZ0JBQUEsRUFBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLElBQUEsRUFBQSxTQUFBLEVBQUEsVUFBQTs7TUFDSSxDQUFBLENBQUUsSUFBRixFQUNFLFVBREYsQ0FBQSxHQUNvQixDQUFFLE9BQUEsQ0FBUSxRQUFSLENBQUYsQ0FBb0IsQ0FBQyw4QkFBckIsQ0FBQSxDQURwQjtNQUVBLE1BQUEsR0FBb0IsT0FBQSxDQUFRLGFBQVI7TUFDcEIsQ0FBQSxDQUFFLEtBQUYsQ0FBQSxHQUFvQixPQUFwQixFQUpKOztNQU9JLFNBQUEsR0FBWSxDQUFBLEVBUGhCOztNQVVJLEdBQUEsR0FBTSxRQUFBLENBQUUsS0FBRixFQUFBLEdBQVMsV0FBVCxDQUFBO0FBQ1YsWUFBQSxDQUFBLEVBQUEsVUFBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUE7UUFBTSxDQUFBLEdBQUksS0FBSyxDQUFFLENBQUY7UUFDVCxLQUFBLHlEQUFBOztVQUNFLENBQUEsSUFBSyxVQUFVLENBQUMsUUFBWCxDQUFBLENBQUEsR0FBd0IsS0FBSyxDQUFFLEdBQUEsR0FBTSxDQUFSO1FBRHBDO0FBRUEsZUFBTztNQUpIO01BUUE7O1FBQU4sTUFBQSxNQUFBLENBQUE7O1VBU1MsT0FBTixJQUFNLENBQUUsT0FBRixDQUFBO0FBQ2IsZ0JBQUEsQ0FBQSxFQUFBO1lBQVEsS0FBQSxHQUFRO1lBQ1IsQ0FBQSxHQUFRLElBQUksS0FBSixDQUFVLE9BQVY7WUFDUixDQUFDLENBQUMsS0FBRixDQUFBO1lBQ0EsQ0FB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RUFBMEIsSUFBQyxDQUFBLE9BQUQsQ0FBUyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQTFCLENBQTFCO2NBQ0Esd0JBQUEsRUFBMEIsSUFBQyxDQUFBLE9BQUQsQ0FBUyxLQUFLLENBQUMsVUFBVSxDQUFDLHdCQUExQjtZQUQxQjtBQUVGLG1CQUFPO1VBUkk7O1FBNUNmOzs7UUFHRSxnQkFBQyxDQUFBLFNBQUQsR0FFRSxDQUFBOztVQUFBLGVBQUEsRUFDRTtZQUFBLGFBQUEsRUFBZ0IsSUFBaEI7WUFDQSxPQUFBLEVBQWdCLEtBRGhCO1lBRUEsSUFBQSxFQUFnQixRQUFBLENBQUUsSUFBRixDQUFBO3FCQUFZLHNCQUFBLENBQXVCLElBQXZCO1lBQVo7VUFGaEIsQ0FERjs7VUFLQSxnQkFBQSxFQUNFO1lBQUEsYUFBQSxFQUFnQixJQUFoQjtZQUNBLE9BQUEsRUFBZ0IsS0FEaEI7WUFFQSxJQUFBLEVBQWdCLFFBQUEsQ0FBRSxJQUFGLENBQUE7cUJBQVksSUFBSSxDQUFDO1lBQWpCO1VBRmhCO1FBTkY7OztRQVdGLGdCQUFDLENBQUEsVUFBRCxHQUVFLENBQUE7O1VBQUEscUJBQUEsRUFBdUIsR0FBRyxDQUFBOzs7Ozs7c0VBQUEsQ0FBMUI7Ozs7Ozs7OztVQWdCQSxjQUFBLEVBQWdCLEdBQUcsQ0FBQTs7O2NBQUEsQ0FoQm5COztVQXNCQSx3QkFBQSxFQUEwQixHQUFHLENBQUEsa0VBQUE7UUF0QjdCOzs7O29CQTFMUjs7TUErTkksU0FBQSxHQUFZLE1BQU0sQ0FBQyxNQUFQLENBQWMsQ0FBRSxHQUFBLFNBQUYsRUFBZ0IsZ0JBQWhCLENBQWQ7QUFDWixhQUFPLE9BQUEsR0FBVSxDQUNmLEtBRGUsRUFFZixHQUZlLEVBR2YsU0FIZTtJQWxPSjtFQUFmLEVBVkY7OztFQW1QQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixvQkFBOUI7QUFuUEEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblVOU1RBQkxFX0RCUklDX0JSSUNTID1cbiAgXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2RicmljOiAtPlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICB7IGhpZGUsXG4gICAgICBzZXRfZ2V0dGVyLCAgIH0gPSAoIHJlcXVpcmUgJy4vbWFpbicgKS5yZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHMoKVxuICAgIFNRTElURSAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpzcWxpdGUnXG4gICAgeyBkZWJ1ZywgICAgICAgIH0gPSBjb25zb2xlXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGludGVybmFscyA9IHt9XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFNRTCA9ICggcGFydHMsIGV4cHJlc3Npb25zLi4uICkgLT5cbiAgICAgIFIgPSBwYXJ0c1sgMCBdXG4gICAgICBmb3IgZXhwcmVzc2lvbiwgaWR4IGluIGV4cHJlc3Npb25zXG4gICAgICAgIFIgKz0gZXhwcmVzc2lvbi50b1N0cmluZygpICsgcGFydHNbIGlkeCArIDEgXVxuICAgICAgcmV0dXJuIFJcblxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBEYnJpY1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIEBjZmc6IE9iamVjdC5mcmVlemVcbiAgICAgICAgcHJlZml4OiAnTk9QUkVGSVgnXG4gICAgICBAZnVuY3Rpb25zOiAgIHt9XG4gICAgICBAc3RhdGVtZW50czogIHsgYnVpbGQ6IFtdLCB9XG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgQG9wZW46ICggZGJfcGF0aCApIC0+XG4gICAgICAgIGNsYXN6ID0gQFxuICAgICAgICBSICAgICA9IG5ldyBjbGFzeiBkYl9wYXRoXG4gICAgICAgIFIuYnVpbGQoKVxuICAgICAgICBSLl9wcmVwYXJlX3N0YXRlbWVudHMoKVxuICAgICAgICByZXR1cm4gUlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGRiX3BhdGggKSAtPlxuICAgICAgICBAZGIgICAgICAgICAgICAgICAgID0gbmV3IFNRTElURS5EYXRhYmFzZVN5bmMgZGJfcGF0aFxuICAgICAgICBjbGFzeiAgICAgICAgICAgICAgID0gQGNvbnN0cnVjdG9yXG4gICAgICAgIEBjZmcgICAgICAgICAgICAgICAgPSBPYmplY3QuZnJlZXplIHsgY2xhc3ouY2ZnLi4uLCBkYl9wYXRoLCB9XG4gICAgICAgICMjIyBOT1RFIHdlIGNhbid0IGp1c3QgcHJlcGFyZSBhbGwgdGhlIHN0ZXRtZW50cyBhcyB0aGV5IGRlcGVuZCBvbiBEQiBvYmplY3RzIGV4aXN0aW5nIG9yIG5vdCBleGlzdGluZyxcbiAgICAgICAgYXMgdGhlIGNhc2UgbWF5IGJlLiBIZW5jZSB3ZSBwcmVwYXJlIHN0YXRlbWVudHMgb24tZGVtYW5kIGFuZCBjYWNoZSB0aGVtIGhlcmUgYXMgbmVlZGVkOiAjIyNcbiAgICAgICAgaGlkZSBALCAnc3RhdGVtZW50cycsIHt9XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZm5fY2ZnX3RlbXBsYXRlID0geyBkZXRlcm1pbmlzdGljOiB0cnVlLCB2YXJhcmdzOiBmYWxzZSwgfVxuICAgICAgICBmb3IgbmFtZSwgZm5fY2ZnIG9mIGNsYXN6LmZ1bmN0aW9uc1xuICAgICAgICAgIGlmICggdHlwZW9mIGZuX2NmZyApIGlzICdmdW5jdGlvbidcbiAgICAgICAgICAgIFsgY2FsbCwgZm5fY2ZnLCBdID0gWyBmbl9jZmcsIHt9LCBdXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgeyBjYWxsLCB9ID0gZm5fY2ZnXG4gICAgICAgICAgZm5fY2ZnICA9IHsgZm5fY2ZnX3RlbXBsYXRlLi4uLCBmbl9jZmcsIH1cbiAgICAgICAgICBjYWxsICAgID0gY2FsbC5iaW5kIEBcbiAgICAgICAgICBAZGIuZnVuY3Rpb24gbmFtZSwgZm5fY2ZnLCBjYWxsXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X2RiX29iamVjdHM6IC0+XG4gICAgICAgIFIgPSB7fVxuICAgICAgICBmb3IgZGJvIGZyb20gKCBAZGIucHJlcGFyZSBAY29uc3RydWN0b3Iuc3RhdGVtZW50cy5zdGRfZ2V0X3NjaGVtYSApLml0ZXJhdGUoKVxuICAgICAgICAgIFJbIGRiby5uYW1lIF0gPSB7IG5hbWU6IGRiby5uYW1lLCB0eXBlOiBkYm8udHlwZSwgfVxuICAgICAgICByZXR1cm4gUlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHRlYXJkb3duOiAtPlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGJ1aWxkOiAtPiBpZiBAaXNfcmVhZHkgdGhlbiAwIGVsc2UgQHJlYnVpbGQoKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHJlYnVpbGQ6IC0+XG4gICAgICAgIFIgICAgID0gLTFcbiAgICAgICAgY2xhc3ogPSBAY29uc3RydWN0b3JcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gLTEgdW5sZXNzICggYnVpbGRfc3RhdGVtZW50cyA9IGNsYXN6LnN0YXRlbWVudHM/LmJ1aWxkICk/XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdmFsaWRhdGlvbiAjIyNcbiAgICAgICAgdW5sZXNzIEFycmF5LmlzQXJyYXkgYnVpbGRfc3RhdGVtZW50c1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNCBleHBlY3RlZCBhIGxpc3QgZm9yICN7Y2xhc3oubmFtZX06OnN0YXRlbWVudHMuYnVpbGQsIGdvdCAje2J1aWxkX3N0YXRlbWVudHN9XCJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBAdGVhcmRvd24oKVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGNvdW50ID0gMFxuICAgICAgICBmb3IgYnVpbGRfc3RhdGVtZW50IGluIGJ1aWxkX3N0YXRlbWVudHNcbiAgICAgICAgICBjb3VudCsrXG4gICAgICAgICAgZGVidWcgJ86pX19fNScsIFwiYnVpbGQgc3RhdGVtZW50OlwiLCBidWlsZF9zdGF0ZW1lbnRcbiAgICAgICAgICAoIEBwcmVwYXJlIGJ1aWxkX3N0YXRlbWVudCApLnJ1bigpXG4gICAgICAgIHJldHVybiBjb3VudFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ2lzX3JlYWR5JywgLT4gQF9nZXRfaXNfcmVhZHkoKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfZ2V0X2lzX3JlYWR5OiAtPiB0cnVlXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX3ByZXBhcmVfc3RhdGVtZW50czogLT5cbiAgICAgICAgIyAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAjIGZvciBuYW1lLCBzcWwgb2YgY2xhc3ouc3RhdGVtZW50c1xuICAgICAgICAjICAgc3dpdGNoIHRydWVcbiAgICAgICAgIyAgICAgd2hlbiBuYW1lLnN0YXJ0c1dpdGggJ2NyZWF0ZV90YWJsZV8nXG4gICAgICAgICMgICAgICAgbnVsbFxuICAgICAgICAjICAgICB3aGVuIG5hbWUuc3RhcnRzV2l0aCAnaW5zZXJ0XydcbiAgICAgICAgIyAgICAgICBudWxsXG4gICAgICAgICMgICAgIGVsc2VcbiAgICAgICAgIyAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqW5xbF9fXzYgdW5hYmxlIHRvIHBhcnNlIHN0YXRlbWVudCBuYW1lICN7cnByIG5hbWV9XCJcbiAgICAgICAgIyAjICAgQFsgbmFtZSBdID0gQHByZXBhcmUgc3FsXG4gICAgICAgIGhpZGUgQCwgJ3N0YXRlbWVudHMnLCB7fVxuICAgICAgICBidWlsZF9zdGF0ZW1lbnRfbmFtZSAgPSBAX25hbWVfb2ZfYnVpbGRfc3RhdGVtZW50c1xuICAgICAgICBmb3IgbmFtZSwgc3RhdGVtZW50IG9mIEBjb25zdHJ1Y3Rvci5zdGF0ZW1lbnRzXG4gICAgICAgICAgY29udGludWUgaWYgbmFtZSBpcyBidWlsZF9zdGF0ZW1lbnRfbmFtZVxuICAgICAgICAgIEBzdGF0ZW1lbnRzWyBuYW1lIF0gPSBAcHJlcGFyZSBzdGF0ZW1lbnRcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgaXNfcmVhZHk6IC0+XG4gICAgICAgICMgZGJvcyA9IEBfZ2V0X2RiX29iamVjdHMoKVxuICAgICAgICAjIHJldHVybiBmYWxzZSB1bmxlc3MgZGJvcy5zdG9yZV9mYWNldHM/LnR5cGUgaXMgJ3RhYmxlJ1xuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGV4ZWN1dGU6ICggc3FsICkgLT4gQGRiLmV4ZWMgICAgc3FsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcHJlcGFyZTogKCBzcWwgKSAtPlxuICAgICAgICB0cnlcbiAgICAgICAgICBSID0gQGRiLnByZXBhcmUgc3FsXG4gICAgICAgIGNhdGNoIGNhdXNlXG4gICAgICAgICAgIyMjIFRBSU5UIGBycHIoKWAgdXJnZW50bHkgbmVlZGVkICMjI1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNyB3aGVuIHRyeWluZyB0byBwcmVwYXJlIHRoZSBmb2xsb3dpbmcgc3RhdGVtZW50LCBhbiBlcnJvciB3YXMgdGhyb3duOiAje3NxbH1cIiwgeyBjYXVzZSwgfVxuICAgICAgICByZXR1cm4gUlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBEYnJpY19zdGQgZXh0ZW5kcyBEYnJpY1xuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIEBjZmc6IE9iamVjdC5mcmVlemVcbiAgICAgICAgcHJlZml4OiAnc3RkJ1xuICAgICAgQGZ1bmN0aW9uczogICB7fVxuICAgICAgQHN0YXRlbWVudHM6XG4gICAgICAgIHN0ZF9nZXRfc2NoZW1hOiBTUUxcIlwiXCJcbiAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNxbGl0ZV9zY2hlbWEgb3JkZXIgYnkgbmFtZSwgdHlwZTtcIlwiXCJcbiAgICAgICAgc3RkX2dldF90YWJsZXM6IFNRTFwiXCJcIlxuICAgICAgICAgIHNlbGVjdCAqIGZyb20gc3FsaXRlX3NjaGVtYSB3aGVyZSB0eXBlIGlzICd0YWJsZScgb3JkZXIgYnkgbmFtZSwgdHlwZTtcIlwiXCJcbiAgICAgICAgc3RkX2dldF92aWV3czogU1FMXCJcIlwiXG4gICAgICAgICAgc2VsZWN0ICogZnJvbSBzcWxpdGVfc2NoZW1hIHdoZXJlIHR5cGUgaXMgJ3ZpZXcnIG9yZGVyIGJ5IG5hbWUsIHR5cGU7XCJcIlwiXG4gICAgICAgIHN0ZF9nZXRfcmVsYXRpb25zOiBTUUxcIlwiXCJcbiAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNxbGl0ZV9zY2hlbWEgd2hlcmUgdHlwZSBpbiAoICd0YWJsZScsICd2aWV3JyApIG9yZGVyIGJ5IG5hbWUsIHR5cGU7XCJcIlwiXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgc3RkX2J1aWxkOiBbXG4gICAgICAgICAgU1FMXCJcIlwiY3JlYXRlIHZpZXcgc3RkX3RhYmxlcyBhc1xuICAgICAgICAgICAgc2VsZWN0ICogZnJvbSBzcWxpdGVfc2NoZW1hXG4gICAgICAgICAgICAgIHdoZXJlIHR5cGUgaXMgJ3RhYmxlJyBvcmRlciBieSBuYW1lLCB0eXBlO1wiXCJcIlxuICAgICAgICAgIFNRTFwiXCJcImNyZWF0ZSB2aWV3IHN0ZF92aWV3cyBhc1xuICAgICAgICAgICAgc2VsZWN0ICogZnJvbSBzcWxpdGVfc2NoZW1hXG4gICAgICAgICAgICAgIHdoZXJlIHR5cGUgaXMgJ3ZpZXcnIG9yZGVyIGJ5IG5hbWUsIHR5cGU7XCJcIlwiXG4gICAgICAgICAgU1FMXCJcIlwiY3JlYXRlIHZpZXcgc3RkX3JlbGF0aW9ucyBhc1xuICAgICAgICAgICAgc2VsZWN0ICogZnJvbSBzcWxpdGVfc2NoZW1hXG4gICAgICAgICAgICAgIHdoZXJlIHR5cGUgaW4gKCAndGFibGUnLCAndmlldycgKSBvcmRlciBieSBuYW1lLCB0eXBlO1wiXCJcIlxuICAgICAgICAgIF1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9pc19yZWFkeTogLT5cbiAgICAgICAgZGJfb2JqZWN0cyA9IEBfZ2V0X2RiX29iamVjdHMoKVxuICAgICAgICByZXR1cm4gZmFsc2UgdW5sZXNzIGRiX29iamVjdHMuc3RkX3RhYmxlcz8udHlwZSAgICAgaXMgJ3ZpZXcnXG4gICAgICAgIHJldHVybiBmYWxzZSB1bmxlc3MgZGJfb2JqZWN0cy5zdGRfdmlld3M/LnR5cGUgICAgICBpcyAndmlldydcbiAgICAgICAgcmV0dXJuIGZhbHNlIHVubGVzcyBkYl9vYmplY3RzLnN0ZF9yZWxhdGlvbnM/LnR5cGUgIGlzICd2aWV3J1xuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBTZWdtZW50X3dpZHRoX2RiIGV4dGVuZHMgRGJyaWNcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBAZnVuY3Rpb25zOlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHdpZHRoX2Zyb21fdGV4dDpcbiAgICAgICAgICBkZXRlcm1pbmlzdGljOiAgdHJ1ZVxuICAgICAgICAgIHZhcmFyZ3M6ICAgICAgICBmYWxzZVxuICAgICAgICAgIGNhbGw6ICAgICAgICAgICAoIHRleHQgKSAtPiBnZXRfd2NfbWF4X2xpbmVfbGVuZ3RoIHRleHRcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBsZW5ndGhfZnJvbV90ZXh0OlxuICAgICAgICAgIGRldGVybWluaXN0aWM6ICB0cnVlXG4gICAgICAgICAgdmFyYXJnczogICAgICAgIGZhbHNlXG4gICAgICAgICAgY2FsbDogICAgICAgICAgICggdGV4dCApIC0+IHRleHQubGVuZ3RoXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgQHN0YXRlbWVudHM6XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgY3JlYXRlX3RhYmxlX3NlZ21lbnRzOiBTUUxcIlwiXCJcbiAgICAgICAgICBkcm9wIHRhYmxlIGlmIGV4aXN0cyBzZWdtZW50cztcbiAgICAgICAgICBjcmVhdGUgdGFibGUgc2VnbWVudHMgKFxuICAgICAgICAgICAgICBzZWdtZW50X3RleHQgICAgICB0ZXh0ICAgIG5vdCBudWxsIHByaW1hcnkga2V5LFxuICAgICAgICAgICAgICBzZWdtZW50X3dpZHRoICAgICBpbnRlZ2VyIG5vdCBudWxsIGdlbmVyYXRlZCBhbHdheXMgYXMgKCB3aWR0aF9mcm9tX3RleHQoICBzZWdtZW50X3RleHQgKSApIHN0b3JlZCxcbiAgICAgICAgICAgICAgc2VnbWVudF9sZW5ndGggICAgaW50ZWdlciBub3QgbnVsbCBnZW5lcmF0ZWQgYWx3YXlzIGFzICggbGVuZ3RoX2Zyb21fdGV4dCggc2VnbWVudF90ZXh0ICkgKSBzdG9yZWQsXG4gICAgICAgICAgICBjb25zdHJhaW50IHNlZ21lbnRfd2lkdGhfZXFndF96ZXJvICBjaGVjayAoIHNlZ21lbnRfd2lkdGggID49IDAgKSxcbiAgICAgICAgICAgIGNvbnN0cmFpbnQgc2VnbWVudF9sZW5ndGhfZXFndF96ZXJvIGNoZWNrICggc2VnbWVudF9sZW5ndGggPj0gMCApICk7XCJcIlwiXG4gICAgICAgICMgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgIyBpbnNlcnRfc2VnbWVudDogU1FMXCJcIlwiXG4gICAgICAgICMgICBpbnNlcnQgaW50byBzZWdtZW50cyAgKCBzZWdtZW50X3RleHQsICAgc2VnbWVudF93aWR0aCwgIHNlZ21lbnRfbGVuZ3RoICApXG4gICAgICAgICMgICAgICAgICAgICAgICAgIHZhbHVlcyAgKCAkc2VnbWVudF90ZXh0LCAgJHNlZ21lbnRfd2lkdGgsICRzZWdtZW50X2xlbmd0aCApXG4gICAgICAgICMgICAgIG9uIGNvbmZsaWN0ICggc2VnbWVudF90ZXh0ICkgZG8gdXBkYXRlXG4gICAgICAgICMgICAgICAgICAgICAgICAgIHNldCAgICAgKCAgICAgICAgICAgICAgICAgc2VnbWVudF93aWR0aCwgIHNlZ21lbnRfbGVuZ3RoICApID1cbiAgICAgICAgIyAgICAgICAgICAgICAgICAgICAgICAgICAoIGV4Y2x1ZGVkLnNlZ21lbnRfd2lkdGgsIGV4Y2x1ZGVkLnNlZ21lbnRfbGVuZ3RoICk7XCJcIlwiXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgaW5zZXJ0X3NlZ21lbnQ6IFNRTFwiXCJcIlxuICAgICAgICAgIGluc2VydCBpbnRvIHNlZ21lbnRzICAoIHNlZ21lbnRfdGV4dCAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzICAoICRzZWdtZW50X3RleHQgKVxuICAgICAgICAgICAgb24gY29uZmxpY3QgKCBzZWdtZW50X3RleHQgKSBkbyBub3RoaW5nXG4gICAgICAgICAgICByZXR1cm5pbmcgKjtcIlwiXCJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBzZWxlY3Rfcm93X2Zyb21fc2VnbWVudHM6IFNRTFwiXCJcIlxuICAgICAgICAgIHNlbGVjdCAqIGZyb20gc2VnbWVudHMgd2hlcmUgc2VnbWVudF90ZXh0ID0gJHNlZ21lbnRfdGV4dCBsaW1pdCAxO1wiXCJcIlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoIGRiX3BhdGggKSAtPlxuICAgICAgICBzdXBlciBkYl9wYXRoXG4gICAgICAgIGNsYXN6ICAgPSBAY29uc3RydWN0b3JcbiAgICAgICAgQGNhY2hlICA9IG5ldyBNYXAoKVxuICAgICAgICAjIyMgVEFJTlQgc2hvdWxkIGJlIGRvbmUgYXV0b21hdGljYWxseSAjIyNcbiAgICAgICAgQHN0YXRlbWVudHMgPVxuICAgICAgICAgIGluc2VydF9zZWdtZW50OiAgICAgICAgICAgQHByZXBhcmUgY2xhc3ouc3RhdGVtZW50cy5pbnNlcnRfc2VnbWVudFxuICAgICAgICAgIHNlbGVjdF9yb3dfZnJvbV9zZWdtZW50czogQHByZXBhcmUgY2xhc3ouc3RhdGVtZW50cy5zZWxlY3Rfcm93X2Zyb21fc2VnbWVudHNcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIHsgaW50ZXJuYWxzLi4uLCBTZWdtZW50X3dpZHRoX2RiLCB9XG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7XG4gICAgICBEYnJpYyxcbiAgICAgIFNRTCxcbiAgICAgIGludGVybmFscywgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgVU5TVEFCTEVfREJSSUNfQlJJQ1NcblxuIl19
//# sourceURL=../src/unstable-dbric-brics.coffee