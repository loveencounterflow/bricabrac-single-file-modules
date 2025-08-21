(function() {
  'use strict';
  var UNSTABLE_DBRIC_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_DBRIC_BRICS = {
    
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_dbric: function() {
      var Dbric, SQL, SQLITE, Segment_width_db, debug, exports, hide, internals, set_getter;
      //=========================================================================================================
      ({hide, set_getter} = (require('./main')).require_managed_property_tools());
      SQLITE = require('node:sqlite');
      ({debug} = console);
      //---------------------------------------------------------------------------------------------------------
      internals = {};
      //-----------------------------------------------------------------------------------------------------------
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
        //===========================================================================================================
        class Dbric {
          //---------------------------------------------------------------------------------------------------------
          static open(db_path) {
            var R;
            R = new this(db_path);
            R._procure_db_objects();
            R._prepare_statements();
            return R;
          }

          //---------------------------------------------------------------------------------------------------------
          constructor(db_path) {
            var call, clasz, fn_cfg, fn_cfg_template, name, ref;
            this.db = new SQLITE.DatabaseSync(db_path);
            clasz = this.constructor;
            this.cfg = Object.freeze({...clasz.cfg, db_path});
            /* NOTE we can't just prepare all the stetments as they depend on DB objects existing or not existing,
                   as the case may be. Hence we prepare statements on-demand and cache them here as needed: */
            this.statements = {};
            //.......................................................................................................
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

          //---------------------------------------------------------------------------------------------------------
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

          //---------------------------------------------------------------------------------------------------------
          drop_my_objects() {}

          //---------------------------------------------------------------------------------------------------------
          _procure_db_objects() {
            var clasz, i, len, procure_statement, procure_statements;
            if (this.is_ready) {
              return null;
            }
            clasz = this.constructor;
            debug('Ω___1', "not ready");
            debug('Ω___2', "procure method:               ", this.procure);
            debug('Ω___3', "_name_of_procure_statements:  ", this._name_of_procure_statements);
            debug('Ω___4', "_procure_statements:          ", this._procure_statements);
            if ((procure_statements = this._procure_statements) == null) {
              throw new Error(`Ω___5 missing procure statement ${this._name_of_procure_statements}`);
            }
            /* TAINT use proper validation */
            if (!Array.isArray(procure_statements)) {
              throw new Error(`Ω___6 expected a list for @${this._name_of_procure_statements}, got ${procure_statements}`);
            }
            for (i = 0, len = procure_statements.length; i < len; i++) {
              procure_statement = procure_statements[i];
              debug('Ω___7', "procure statement:", procure_statement);
              (this.prepare(procure_statement)).run();
            }
            return null;
          }

          //---------------------------------------------------------------------------------------------------------
          _prepare_statements() {
            var name, procure_statement_name, ref, statement;
            // #.......................................................................................................
            // for name, sql of clasz.statements
            //   switch true
            //     when name.startsWith 'create_table_'
            //       null
            //     when name.startsWith 'insert_'
            //       null
            //     else
            //       throw new Error "Ωnql___8 unable to parse statement name #{rpr name}"
            // #   @[ name ] = @prepare sql
            hide(this, 'statements', {});
            procure_statement_name = this._name_of_procure_statements;
            ref = this.constructor.statements;
            for (name in ref) {
              statement = ref[name];
              if (name === procure_statement_name) {
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

          //---------------------------------------------------------------------------------------------------------
          execute(sql) {
            return this.db.exec(sql);
          }

          //---------------------------------------------------------------------------------------------------------
          prepare(sql) {
            var R, cause;
            try {
              R = this.db.prepare(sql);
            } catch (error) {
              cause = error;
              /* TAINT `rpr()` urgently needed */
              throw new Error(`Ω___5 when trying to prepare the following statement, an error was thrown: ${sql}`, {cause});
            }
            return R;
          }

        };

        //---------------------------------------------------------------------------------------------------------
        Dbric.cfg = Object.freeze({
          prefix: 'std'
        });

        Dbric.functions = {};

        Dbric.statements = {
          std_get_schema: SQL`select * from sqlite_schema order by name, type;`,
          std_get_tables: SQL`select * from sqlite_schema where type is 'table' order by name, type;`,
          std_get_views: SQL`select * from sqlite_schema where type is 'view' order by name, type;`,
          std_get_relations: SQL`select * from sqlite_schema where type in ( 'table', 'view' ) order by name, type;`,
          //.......................................................................................................
          std_procure: [
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

        //---------------------------------------------------------------------------------------------------------
        Dbric.prototype.procure = null;

        //---------------------------------------------------------------------------------------------------
        set_getter(Dbric.prototype, '_name_of_procure_statements', function() {
          return `${this.cfg.prefix}_procure`;
        });

        set_getter(Dbric.prototype, '_procure_statements', function() {
          return this.constructor.statements[this._name_of_procure_statements];
        });

        //---------------------------------------------------------------------------------------------------
        set_getter(Dbric.prototype, 'is_ready', function() {
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
        });

        return Dbric;

      }).call(this);
      Segment_width_db = (function() {
        //===========================================================================================================
        class Segment_width_db extends Dbric {
          //---------------------------------------------------------------------------------------------------------
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

        //---------------------------------------------------------------------------------------------------------
        Segment_width_db.functions = {
          //.......................................................................................................
          width_from_text: {
            deterministic: true,
            varargs: false,
            call: function(text) {
              return get_wc_max_line_length(text);
            }
          },
          //.......................................................................................................
          length_from_text: {
            deterministic: true,
            varargs: false,
            call: function(text) {
              return text.length;
            }
          }
        };

        //---------------------------------------------------------------------------------------------------------
        Segment_width_db.statements = {
          //.......................................................................................................
          create_table_segments: SQL`drop table if exists segments;
create table segments (
    segment_text      text    not null primary key,
    segment_width     integer not null generated always as ( width_from_text(  segment_text ) ) stored,
    segment_length    integer not null generated always as ( length_from_text( segment_text ) ) stored,
  constraint segment_width_eqgt_zero  check ( segment_width  >= 0 ),
  constraint segment_length_eqgt_zero check ( segment_length >= 0 ) );`,
          // #.......................................................................................................
          // insert_segment: SQL"""
          //   insert into segments  ( segment_text,   segment_width,  segment_length  )
          //                 values  ( $segment_text,  $segment_width, $segment_length )
          //     on conflict ( segment_text ) do update
          //                 set     (                 segment_width,  segment_length  ) =
          //                         ( excluded.segment_width, excluded.segment_length );"""
          //.......................................................................................................
          insert_segment: SQL`insert into segments  ( segment_text  )
              values  ( $segment_text )
  on conflict ( segment_text ) do nothing
  returning *;`,
          //.......................................................................................................
          select_row_from_segments: SQL`select * from segments where segment_text = $segment_text limit 1;`
        };

        return Segment_width_db;

      }).call(this);
      //=========================================================================================================
      internals = Object.freeze({...internals, Segment_width_db});
      return exports = {Dbric, SQL, internals};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_DBRIC_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWRicmljLWJyaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxvQkFBQTs7Ozs7RUFLQSxvQkFBQSxHQUtFLENBQUE7Ozs7SUFBQSxhQUFBLEVBQWUsUUFBQSxDQUFBLENBQUE7QUFFakIsVUFBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxnQkFBQSxFQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLFNBQUEsRUFBQSxVQUFBOztNQUNJLENBQUEsQ0FBRSxJQUFGLEVBQ0UsVUFERixDQUFBLEdBQ29CLENBQUUsT0FBQSxDQUFRLFFBQVIsQ0FBRixDQUFvQixDQUFDLDhCQUFyQixDQUFBLENBRHBCO01BRUEsTUFBQSxHQUFvQixPQUFBLENBQVEsYUFBUjtNQUNwQixDQUFBLENBQUUsS0FBRixDQUFBLEdBQW9CLE9BQXBCLEVBSko7O01BT0ksU0FBQSxHQUFZLENBQUEsRUFQaEI7O01BVUksR0FBQSxHQUFNLFFBQUEsQ0FBRSxLQUFGLEVBQUEsR0FBUyxXQUFULENBQUE7QUFDVixZQUFBLENBQUEsRUFBQSxVQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQTtRQUFNLENBQUEsR0FBSSxLQUFLLENBQUUsQ0FBRjtRQUNULEtBQUEseURBQUE7O1VBQ0UsQ0FBQSxJQUFLLFVBQVUsQ0FBQyxRQUFYLENBQUEsQ0FBQSxHQUF3QixLQUFLLENBQUUsR0FBQSxHQUFNLENBQVI7UUFEcEM7QUFFQSxlQUFPO01BSkg7TUFRQTs7UUFBTixNQUFBLE1BQUEsQ0FBQTs7VUE2QlMsT0FBTixJQUFNLENBQUUsT0FBRixDQUFBO0FBQ2IsZ0JBQUE7WUFBUSxDQUFBLEdBQUksSUFBSSxJQUFKLENBQU0sT0FBTjtZQUNKLENBQUMsQ0FBQyxtQkFBRixDQUFBO1lBQ0EsQ0FBQyxDQUFDLG1CQUFGLENBQUE7QUFDQSxtQkFBTztVQUpG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IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuVU5TVEFCTEVfREJSSUNfQlJJQ1MgPVxuICBcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9kYnJpYzogLT5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICB7IGhpZGUsXG4gICAgICBzZXRfZ2V0dGVyLCAgIH0gPSAoIHJlcXVpcmUgJy4vbWFpbicgKS5yZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHMoKVxuICAgIFNRTElURSAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpzcWxpdGUnXG4gICAgeyBkZWJ1ZywgICAgICAgIH0gPSBjb25zb2xlXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaW50ZXJuYWxzID0ge31cblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFNRTCA9ICggcGFydHMsIGV4cHJlc3Npb25zLi4uICkgLT5cbiAgICAgIFIgPSBwYXJ0c1sgMCBdXG4gICAgICBmb3IgZXhwcmVzc2lvbiwgaWR4IGluIGV4cHJlc3Npb25zXG4gICAgICAgIFIgKz0gZXhwcmVzc2lvbi50b1N0cmluZygpICsgcGFydHNbIGlkeCArIDEgXVxuICAgICAgcmV0dXJuIFJcblxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgRGJyaWNcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgQGNmZzogT2JqZWN0LmZyZWV6ZVxuICAgICAgICBwcmVmaXg6ICdzdGQnXG4gICAgICBAZnVuY3Rpb25zOiAgIHt9XG4gICAgICBAc3RhdGVtZW50czpcbiAgICAgICAgc3RkX2dldF9zY2hlbWE6IFNRTFwiXCJcIlxuICAgICAgICAgIHNlbGVjdCAqIGZyb20gc3FsaXRlX3NjaGVtYSBvcmRlciBieSBuYW1lLCB0eXBlO1wiXCJcIlxuICAgICAgICBzdGRfZ2V0X3RhYmxlczogU1FMXCJcIlwiXG4gICAgICAgICAgc2VsZWN0ICogZnJvbSBzcWxpdGVfc2NoZW1hIHdoZXJlIHR5cGUgaXMgJ3RhYmxlJyBvcmRlciBieSBuYW1lLCB0eXBlO1wiXCJcIlxuICAgICAgICBzdGRfZ2V0X3ZpZXdzOiBTUUxcIlwiXCJcbiAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNxbGl0ZV9zY2hlbWEgd2hlcmUgdHlwZSBpcyAndmlldycgb3JkZXIgYnkgbmFtZSwgdHlwZTtcIlwiXCJcbiAgICAgICAgc3RkX2dldF9yZWxhdGlvbnM6IFNRTFwiXCJcIlxuICAgICAgICAgIHNlbGVjdCAqIGZyb20gc3FsaXRlX3NjaGVtYSB3aGVyZSB0eXBlIGluICggJ3RhYmxlJywgJ3ZpZXcnICkgb3JkZXIgYnkgbmFtZSwgdHlwZTtcIlwiXCJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgc3RkX3Byb2N1cmU6IFtcbiAgICAgICAgICBTUUxcIlwiXCJjcmVhdGUgdmlldyBzdGRfdGFibGVzIGFzXG4gICAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNxbGl0ZV9zY2hlbWFcbiAgICAgICAgICAgICAgd2hlcmUgdHlwZSBpcyAndGFibGUnIG9yZGVyIGJ5IG5hbWUsIHR5cGU7XCJcIlwiXG4gICAgICAgICAgU1FMXCJcIlwiY3JlYXRlIHZpZXcgc3RkX3ZpZXdzIGFzXG4gICAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNxbGl0ZV9zY2hlbWFcbiAgICAgICAgICAgICAgd2hlcmUgdHlwZSBpcyAndmlldycgb3JkZXIgYnkgbmFtZSwgdHlwZTtcIlwiXCJcbiAgICAgICAgICBTUUxcIlwiXCJjcmVhdGUgdmlldyBzdGRfcmVsYXRpb25zIGFzXG4gICAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNxbGl0ZV9zY2hlbWFcbiAgICAgICAgICAgICAgd2hlcmUgdHlwZSBpbiAoICd0YWJsZScsICd2aWV3JyApIG9yZGVyIGJ5IG5hbWUsIHR5cGU7XCJcIlwiXG4gICAgICAgICAgXVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBAb3BlbjogKCBkYl9wYXRoICkgLT5cbiAgICAgICAgUiA9IG5ldyBAIGRiX3BhdGhcbiAgICAgICAgUi5fcHJvY3VyZV9kYl9vYmplY3RzKClcbiAgICAgICAgUi5fcHJlcGFyZV9zdGF0ZW1lbnRzKClcbiAgICAgICAgcmV0dXJuIFJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICggZGJfcGF0aCApIC0+XG4gICAgICAgIEBkYiAgICAgICAgICAgICAgICAgPSBuZXcgU1FMSVRFLkRhdGFiYXNlU3luYyBkYl9wYXRoXG4gICAgICAgIGNsYXN6ICAgICAgICAgICAgICAgPSBAY29uc3RydWN0b3JcbiAgICAgICAgQGNmZyAgICAgICAgICAgICAgICA9IE9iamVjdC5mcmVlemUgeyBjbGFzei5jZmcuLi4sIGRiX3BhdGgsIH1cbiAgICAgICAgIyMjIE5PVEUgd2UgY2FuJ3QganVzdCBwcmVwYXJlIGFsbCB0aGUgc3RldG1lbnRzIGFzIHRoZXkgZGVwZW5kIG9uIERCIG9iamVjdHMgZXhpc3Rpbmcgb3Igbm90IGV4aXN0aW5nLFxuICAgICAgICBhcyB0aGUgY2FzZSBtYXkgYmUuIEhlbmNlIHdlIHByZXBhcmUgc3RhdGVtZW50cyBvbi1kZW1hbmQgYW5kIGNhY2hlIHRoZW0gaGVyZSBhcyBuZWVkZWQ6ICMjI1xuICAgICAgICBAc3RhdGVtZW50cyAgICAgICAgID0ge31cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgZm5fY2ZnX3RlbXBsYXRlID0geyBkZXRlcm1pbmlzdGljOiB0cnVlLCB2YXJhcmdzOiBmYWxzZSwgfVxuICAgICAgICBmb3IgbmFtZSwgZm5fY2ZnIG9mIGNsYXN6LmZ1bmN0aW9uc1xuICAgICAgICAgIGlmICggdHlwZW9mIGZuX2NmZyApIGlzICdmdW5jdGlvbidcbiAgICAgICAgICAgIFsgY2FsbCwgZm5fY2ZnLCBdID0gWyBmbl9jZmcsIHt9LCBdXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgeyBjYWxsLCB9ID0gZm5fY2ZnXG4gICAgICAgICAgZm5fY2ZnICA9IHsgZm5fY2ZnX3RlbXBsYXRlLi4uLCBmbl9jZmcsIH1cbiAgICAgICAgICBjYWxsICAgID0gY2FsbC5iaW5kIEBcbiAgICAgICAgICBAZGIuZnVuY3Rpb24gbmFtZSwgZm5fY2ZnLCBjYWxsXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX2dldF9kYl9vYmplY3RzOiAtPlxuICAgICAgICBSID0ge31cbiAgICAgICAgZm9yIGRibyBmcm9tICggQGRiLnByZXBhcmUgQGNvbnN0cnVjdG9yLnN0YXRlbWVudHMuc3RkX2dldF9zY2hlbWEgKS5pdGVyYXRlKClcbiAgICAgICAgICBSWyBkYm8ubmFtZSBdID0geyBuYW1lOiBkYm8ubmFtZSwgdHlwZTogZGJvLnR5cGUsIH1cbiAgICAgICAgcmV0dXJuIFJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgZHJvcF9teV9vYmplY3RzOiAtPlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBwcm9jdXJlOiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF9wcm9jdXJlX2RiX29iamVjdHM6IC0+XG4gICAgICAgIHJldHVybiBudWxsIGlmIEBpc19yZWFkeVxuICAgICAgICBjbGFzeiAgICAgICAgICAgICA9IEBjb25zdHJ1Y3RvclxuICAgICAgICBkZWJ1ZyAnzqlfX18xJywgXCJub3QgcmVhZHlcIlxuICAgICAgICBkZWJ1ZyAnzqlfX18yJywgXCJwcm9jdXJlIG1ldGhvZDogICAgICAgICAgICAgICBcIiwgQHByb2N1cmVcbiAgICAgICAgZGVidWcgJ86pX19fMycsIFwiX25hbWVfb2ZfcHJvY3VyZV9zdGF0ZW1lbnRzOiAgXCIsIEBfbmFtZV9vZl9wcm9jdXJlX3N0YXRlbWVudHNcbiAgICAgICAgZGVidWcgJ86pX19fNCcsIFwiX3Byb2N1cmVfc3RhdGVtZW50czogICAgICAgICAgXCIsIEBfcHJvY3VyZV9zdGF0ZW1lbnRzXG4gICAgICAgIHVubGVzcyAoIHByb2N1cmVfc3RhdGVtZW50cyA9IEBfcHJvY3VyZV9zdGF0ZW1lbnRzICk/XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX181IG1pc3NpbmcgcHJvY3VyZSBzdGF0ZW1lbnQgI3tAX25hbWVfb2ZfcHJvY3VyZV9zdGF0ZW1lbnRzfVwiXG4gICAgICAgICMjIyBUQUlOVCB1c2UgcHJvcGVyIHZhbGlkYXRpb24gIyMjXG4gICAgICAgIHVubGVzcyBBcnJheS5pc0FycmF5IHByb2N1cmVfc3RhdGVtZW50c1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6pX19fNiBleHBlY3RlZCBhIGxpc3QgZm9yIEAje0BfbmFtZV9vZl9wcm9jdXJlX3N0YXRlbWVudHN9LCBnb3QgI3twcm9jdXJlX3N0YXRlbWVudHN9XCJcbiAgICAgICAgZm9yIHByb2N1cmVfc3RhdGVtZW50IGluIHByb2N1cmVfc3RhdGVtZW50c1xuICAgICAgICAgIGRlYnVnICfOqV9fXzcnLCBcInByb2N1cmUgc3RhdGVtZW50OlwiLCBwcm9jdXJlX3N0YXRlbWVudFxuICAgICAgICAgICggQHByZXBhcmUgcHJvY3VyZV9zdGF0ZW1lbnQgKS5ydW4oKVxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ19uYW1lX29mX3Byb2N1cmVfc3RhdGVtZW50cycsIC0+IFwiI3tAY2ZnLnByZWZpeH1fcHJvY3VyZVwiXG4gICAgICBzZXRfZ2V0dGVyIEA6OiwgJ19wcm9jdXJlX3N0YXRlbWVudHMnLCAgICAgICAgIC0+IEBjb25zdHJ1Y3Rvci5zdGF0ZW1lbnRzWyBAX25hbWVfb2ZfcHJvY3VyZV9zdGF0ZW1lbnRzIF1cblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X2dldHRlciBAOjosICdpc19yZWFkeScsIC0+XG4gICAgICAgIGRiX29iamVjdHMgPSBAX2dldF9kYl9vYmplY3RzKClcbiAgICAgICAgcmV0dXJuIGZhbHNlIHVubGVzcyBkYl9vYmplY3RzLnN0ZF90YWJsZXM/LnR5cGUgICAgIGlzICd2aWV3J1xuICAgICAgICByZXR1cm4gZmFsc2UgdW5sZXNzIGRiX29iamVjdHMuc3RkX3ZpZXdzPy50eXBlICAgICAgaXMgJ3ZpZXcnXG4gICAgICAgIHJldHVybiBmYWxzZSB1bmxlc3MgZGJfb2JqZWN0cy5zdGRfcmVsYXRpb25zPy50eXBlICBpcyAndmlldydcbiAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX3ByZXBhcmVfc3RhdGVtZW50czogLT5cbiAgICAgICAgIyAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAjIGZvciBuYW1lLCBzcWwgb2YgY2xhc3ouc3RhdGVtZW50c1xuICAgICAgICAjICAgc3dpdGNoIHRydWVcbiAgICAgICAgIyAgICAgd2hlbiBuYW1lLnN0YXJ0c1dpdGggJ2NyZWF0ZV90YWJsZV8nXG4gICAgICAgICMgICAgICAgbnVsbFxuICAgICAgICAjICAgICB3aGVuIG5hbWUuc3RhcnRzV2l0aCAnaW5zZXJ0XydcbiAgICAgICAgIyAgICAgICBudWxsXG4gICAgICAgICMgICAgIGVsc2VcbiAgICAgICAgIyAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqW5xbF9fXzggdW5hYmxlIHRvIHBhcnNlIHN0YXRlbWVudCBuYW1lICN7cnByIG5hbWV9XCJcbiAgICAgICAgIyAjICAgQFsgbmFtZSBdID0gQHByZXBhcmUgc3FsXG4gICAgICAgIGhpZGUgQCwgJ3N0YXRlbWVudHMnLCB7fVxuICAgICAgICBwcm9jdXJlX3N0YXRlbWVudF9uYW1lICA9IEBfbmFtZV9vZl9wcm9jdXJlX3N0YXRlbWVudHNcbiAgICAgICAgZm9yIG5hbWUsIHN0YXRlbWVudCBvZiBAY29uc3RydWN0b3Iuc3RhdGVtZW50c1xuICAgICAgICAgIGNvbnRpbnVlIGlmIG5hbWUgaXMgcHJvY3VyZV9zdGF0ZW1lbnRfbmFtZVxuICAgICAgICAgIEBzdGF0ZW1lbnRzWyBuYW1lIF0gPSBAcHJlcGFyZSBzdGF0ZW1lbnRcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgaXNfcmVhZHk6IC0+XG4gICAgICAgICMgZGJvcyA9IEBfZ2V0X2RiX29iamVjdHMoKVxuICAgICAgICAjIHJldHVybiBmYWxzZSB1bmxlc3MgZGJvcy5zdG9yZV9mYWNldHM/LnR5cGUgaXMgJ3RhYmxlJ1xuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBleGVjdXRlOiAoIHNxbCApIC0+IEBkYi5leGVjICAgIHNxbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBwcmVwYXJlOiAoIHNxbCApIC0+XG4gICAgICAgIHRyeVxuICAgICAgICAgIFIgPSBAZGIucHJlcGFyZSBzcWxcbiAgICAgICAgY2F0Y2ggY2F1c2VcbiAgICAgICAgICAjIyMgVEFJTlQgYHJwcigpYCB1cmdlbnRseSBuZWVkZWQgIyMjXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX181IHdoZW4gdHJ5aW5nIHRvIHByZXBhcmUgdGhlIGZvbGxvd2luZyBzdGF0ZW1lbnQsIGFuIGVycm9yIHdhcyB0aHJvd246ICN7c3FsfVwiLCB7IGNhdXNlLCB9XG4gICAgICAgIHJldHVybiBSXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBTZWdtZW50X3dpZHRoX2RiIGV4dGVuZHMgRGJyaWNcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgQGZ1bmN0aW9uczpcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgd2lkdGhfZnJvbV90ZXh0OlxuICAgICAgICAgIGRldGVybWluaXN0aWM6ICB0cnVlXG4gICAgICAgICAgdmFyYXJnczogICAgICAgIGZhbHNlXG4gICAgICAgICAgY2FsbDogICAgICAgICAgICggdGV4dCApIC0+IGdldF93Y19tYXhfbGluZV9sZW5ndGggdGV4dFxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBsZW5ndGhfZnJvbV90ZXh0OlxuICAgICAgICAgIGRldGVybWluaXN0aWM6ICB0cnVlXG4gICAgICAgICAgdmFyYXJnczogICAgICAgIGZhbHNlXG4gICAgICAgICAgY2FsbDogICAgICAgICAgICggdGV4dCApIC0+IHRleHQubGVuZ3RoXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIEBzdGF0ZW1lbnRzOlxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBjcmVhdGVfdGFibGVfc2VnbWVudHM6IFNRTFwiXCJcIlxuICAgICAgICAgIGRyb3AgdGFibGUgaWYgZXhpc3RzIHNlZ21lbnRzO1xuICAgICAgICAgIGNyZWF0ZSB0YWJsZSBzZWdtZW50cyAoXG4gICAgICAgICAgICAgIHNlZ21lbnRfdGV4dCAgICAgIHRleHQgICAgbm90IG51bGwgcHJpbWFyeSBrZXksXG4gICAgICAgICAgICAgIHNlZ21lbnRfd2lkdGggICAgIGludGVnZXIgbm90IG51bGwgZ2VuZXJhdGVkIGFsd2F5cyBhcyAoIHdpZHRoX2Zyb21fdGV4dCggIHNlZ21lbnRfdGV4dCApICkgc3RvcmVkLFxuICAgICAgICAgICAgICBzZWdtZW50X2xlbmd0aCAgICBpbnRlZ2VyIG5vdCBudWxsIGdlbmVyYXRlZCBhbHdheXMgYXMgKCBsZW5ndGhfZnJvbV90ZXh0KCBzZWdtZW50X3RleHQgKSApIHN0b3JlZCxcbiAgICAgICAgICAgIGNvbnN0cmFpbnQgc2VnbWVudF93aWR0aF9lcWd0X3plcm8gIGNoZWNrICggc2VnbWVudF93aWR0aCAgPj0gMCApLFxuICAgICAgICAgICAgY29uc3RyYWludCBzZWdtZW50X2xlbmd0aF9lcWd0X3plcm8gY2hlY2sgKCBzZWdtZW50X2xlbmd0aCA+PSAwICkgKTtcIlwiXCJcbiAgICAgICAgIyAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICAjIGluc2VydF9zZWdtZW50OiBTUUxcIlwiXCJcbiAgICAgICAgIyAgIGluc2VydCBpbnRvIHNlZ21lbnRzICAoIHNlZ21lbnRfdGV4dCwgICBzZWdtZW50X3dpZHRoLCAgc2VnbWVudF9sZW5ndGggIClcbiAgICAgICAgIyAgICAgICAgICAgICAgICAgdmFsdWVzICAoICRzZWdtZW50X3RleHQsICAkc2VnbWVudF93aWR0aCwgJHNlZ21lbnRfbGVuZ3RoIClcbiAgICAgICAgIyAgICAgb24gY29uZmxpY3QgKCBzZWdtZW50X3RleHQgKSBkbyB1cGRhdGVcbiAgICAgICAgIyAgICAgICAgICAgICAgICAgc2V0ICAgICAoICAgICAgICAgICAgICAgICBzZWdtZW50X3dpZHRoLCAgc2VnbWVudF9sZW5ndGggICkgPVxuICAgICAgICAjICAgICAgICAgICAgICAgICAgICAgICAgICggZXhjbHVkZWQuc2VnbWVudF93aWR0aCwgZXhjbHVkZWQuc2VnbWVudF9sZW5ndGggKTtcIlwiXCJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgaW5zZXJ0X3NlZ21lbnQ6IFNRTFwiXCJcIlxuICAgICAgICAgIGluc2VydCBpbnRvIHNlZ21lbnRzICAoIHNlZ21lbnRfdGV4dCAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzICAoICRzZWdtZW50X3RleHQgKVxuICAgICAgICAgICAgb24gY29uZmxpY3QgKCBzZWdtZW50X3RleHQgKSBkbyBub3RoaW5nXG4gICAgICAgICAgICByZXR1cm5pbmcgKjtcIlwiXCJcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgc2VsZWN0X3Jvd19mcm9tX3NlZ21lbnRzOiBTUUxcIlwiXCJcbiAgICAgICAgICBzZWxlY3QgKiBmcm9tIHNlZ21lbnRzIHdoZXJlIHNlZ21lbnRfdGV4dCA9ICRzZWdtZW50X3RleHQgbGltaXQgMTtcIlwiXCJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgY29uc3RydWN0b3I6ICggZGJfcGF0aCApIC0+XG4gICAgICAgIHN1cGVyIGRiX3BhdGhcbiAgICAgICAgY2xhc3ogICA9IEBjb25zdHJ1Y3RvclxuICAgICAgICBAY2FjaGUgID0gbmV3IE1hcCgpXG4gICAgICAgICMjIyBUQUlOVCBzaG91bGQgYmUgZG9uZSBhdXRvbWF0aWNhbGx5ICMjI1xuICAgICAgICBAc3RhdGVtZW50cyA9XG4gICAgICAgICAgaW5zZXJ0X3NlZ21lbnQ6ICAgICAgICAgICBAcHJlcGFyZSBjbGFzei5zdGF0ZW1lbnRzLmluc2VydF9zZWdtZW50XG4gICAgICAgICAgc2VsZWN0X3Jvd19mcm9tX3NlZ21lbnRzOiBAcHJlcGFyZSBjbGFzei5zdGF0ZW1lbnRzLnNlbGVjdF9yb3dfZnJvbV9zZWdtZW50c1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW50ZXJuYWxzID0gT2JqZWN0LmZyZWV6ZSB7IGludGVybmFscy4uLiwgU2VnbWVudF93aWR0aF9kYiwgfVxuICAgIHJldHVybiBleHBvcnRzID0ge1xuICAgICAgRGJyaWMsXG4gICAgICBTUUwsXG4gICAgICBpbnRlcm5hbHMsIH1cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIFVOU1RBQkxFX0RCUklDX0JSSUNTXG5cbiJdfQ==
//# sourceURL=../src/unstable-dbric-brics.coffee