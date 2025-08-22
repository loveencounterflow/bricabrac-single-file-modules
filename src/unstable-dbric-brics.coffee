'use strict'

############################################################################################################
#
#===========================================================================================================
UNSTABLE_DBRIC_BRICS =
  

  #=========================================================================================================
  ### NOTE Future Single-File Module ###
  require_dbric: ->

    #=======================================================================================================
    { hide,
      set_getter,           } = ( require './main' ).require_managed_property_tools()
    { type_of,              } = ( require './main' ).unstable.require_type_of()
    { show_no_colors: rpr,  } = ( require './main' ).unstable.require_show()
    SQLITE                    = require 'node:sqlite'
    { debug,                } = console

    #-------------------------------------------------------------------------------------------------------
    create_statement_re = ///
      ^ \s*
      create \s+
      (?<type> table | view | index ) \s+
      (?<name> \S+ ) \s+
      ///is

    #-------------------------------------------------------------------------------------------------------
    internals = { type_of, create_statement_re, }


    #===========================================================================================================
    class Esql

      #---------------------------------------------------------------------------------------------------
      unquote_name: ( name ) ->
        ### TAINT use proper validation ###
        unless ( type = type_of name ) is 'text'
          throw new Error "Ω___1 expected a text, got a #{type}"
        switch true
          when /^[^"](.*)[^"]$/.test  name then return name
          when /^"(.+)"$/.test        name then return name[ 1 ... name.length - 1 ].replace /""/g, '"'
        throw new Error "Ω___2 expected a name, got #{rpr name}"

      #---------------------------------------------------------------------------------------------------------
      I: ( name ) => '"' + ( name.replace /"/g, '""' ) + '"'

      # #---------------------------------------------------------------------------------------------------------
      # L: ( x ) =>
      #   return 'null' unless x?
      #   switch type = type_of x
      #     when 'text'       then return  "'" + ( x.replace /'/g, "''" ) + "'"
      #     # when 'list'       then return "'#{@list_as_json x}'"
      #     when 'float'      then return x.toString()
      #     when 'boolean'    then return ( if x then '1' else '0' )
      #     # when 'list'       then throw new Error "^dba@23^ use `X()` for lists"
      #   throw new E.DBay_sql_value_error '^dbay/sql@1^', type, x

      # #---------------------------------------------------------------------------------------------------------
      # V: ( x ) =>
      #   throw new E.DBay_sql_not_a_list_error '^dbay/sql@2^', type, x unless ( type = type_of x ) is 'list'
      #   return '( ' + ( ( @L e for e in x ).join ', ' ) + ' )'

      # #---------------------------------------------------------------------------------------------------------
      # interpolate: ( sql, values ) =>
      #   idx = -1
      #   return sql.replace @_interpolation_pattern, ( $0, opener, format, name ) =>
      #     idx++
      #     switch opener
      #       when '$'
      #         validate.nonempty_text name
      #         key = name
      #       when '?'
      #         key = idx
      #     value = values[ key ]
      #     switch format
      #       when '', 'I'  then return @I value
      #       when 'L'      then return @L value
      #       when 'V'      then return @V value
      #     throw new E.DBay_interpolation_format_unknown '^dbay/sql@3^', format
      # _interpolation_pattern: /(?<opener>[$?])(?<format>.?):(?<name>\w*)/g
    #-------------------------------------------------------------------------------------------------------
    esql = new Esql()

    #-------------------------------------------------------------------------------------------------------
    SQL = ( parts, expressions... ) ->
      R = parts[ 0 ]
      for expression, idx in expressions
        R += expression.toString() + parts[ idx + 1 ]
      return R


    #=======================================================================================================
    class Dbric

      #-----------------------------------------------------------------------------------------------------
      @cfg: Object.freeze
        prefix: '(NOPREFIX)'
      @functions:   {}
      @statements:  {}
      @build:       null

      #-----------------------------------------------------------------------------------------------------
      @open: ( db_path ) ->
        clasz = @
        R     = new clasz db_path
        R.build()
        R._prepare_statements()
        return R

      #-----------------------------------------------------------------------------------------------------
      constructor: ( db_path ) ->
        @db                 = new SQLITE.DatabaseSync db_path
        clasz               = @constructor
        @cfg                = Object.freeze { clasz.cfg..., db_path, }
        ### NOTE we can't just prepare all the stetments as they depend on DB objects existing or not existing,
        as the case may be. Hence we prepare statements on-demand and cache them here as needed: ###
        hide @, 'statements', {}
        #...................................................................................................
        fn_cfg_template = { deterministic: true, varargs: false, }
        for name, fn_cfg of clasz.functions
          if ( typeof fn_cfg ) is 'function'
            [ call, fn_cfg, ] = [ fn_cfg, {}, ]
          else
            { call, } = fn_cfg
          fn_cfg  = { fn_cfg_template..., fn_cfg, }
          call    = call.bind @
          @db.function name, fn_cfg, call
        return undefined

      #-----------------------------------------------------------------------------------------------------
      _get_db_objects: ->
        R = {}
        for dbo from ( @db.prepare SQL"select name, type from sqlite_schema" ).iterate()
          R[ dbo.name ] = { name: dbo.name, type: dbo.type, }
        return R

      #-----------------------------------------------------------------------------------------------------
      teardown: ->
        count       = 0
        full_prefix = @full_prefix
        ( @prepare SQL"pragma foreign_keys = off;" ).run()
        for _, { name, type, } of @_get_db_objects()
          continue unless name.startsWith full_prefix
          count++
          ( @prepare SQL"drop #{type} #{esql.I name};" ).run()
        ( @prepare SQL"pragma foreign_keys = on;" ).run()
        return count

      #-----------------------------------------------------------------------------------------------------
      build: -> if @is_ready then 0 else @rebuild()

      #-----------------------------------------------------------------------------------------------------
      rebuild: ->
        clasz         = @constructor
        type_of_build = type_of clasz.build
        #...................................................................................................
        ### TAINT use proper validation ###
        unless type_of_build in [ 'undefined', 'null', 'list', ]
          throw new Error "Ω___3 expected an optional list for #{clasz.name}.build, got a #{type_of_build}"
        #...................................................................................................
        return -1 if ( not clasz.build? )
        return  0 if ( clasz.build.length is 0 )
        #...................................................................................................
        @teardown()
        count = 0
        #...................................................................................................
        for build_statement in clasz.build
          count++
          # debug 'Ω___4', "build statement:", build_statement
          ( @prepare build_statement ).run()
        return count

      #---------------------------------------------------------------------------------------------------
      set_getter @::, 'is_ready',     -> @_get_is_ready()

      #---------------------------------------------------------------------------------------------------
      set_getter @::, 'prefix',       ->
        return @constructor.name.replace /^.*_([^_]+)$/, '$1' unless @cfg.prefix?
        return '' if @cfg.prefix is '(NOPREFIX)'
        return @cfg.prefix

      #---------------------------------------------------------------------------------------------------
      set_getter @::, 'full_prefix',  ->
        return '' if ( not @cfg.prefix? )
        return '' if @cfg.prefix is '(NOPREFIX)'
        return '' if @cfg.prefix is ''
        return "#{@cfg.prefix}_"

      #---------------------------------------------------------------------------------------------------
      _get_objects_in_build_statements: ->
        ### TAINT does not yet deal with quoted names ###
        clasz         = @constructor
        db_objects    = {}
        statement_nr  = 0
        error_count   = 0
        for statement in clasz.build ? []
          statement_nr++
          if ( match = statement.match create_statement_re )?
            { name,
              type, }           = match.groups
            name                = esql.unquote_name name
            db_objects[ name ]  = { name, type, }
          else
            error_count++
            name                = "error_#{statement_nr}"
            type                = 'error'
            message             = "non-conformant statement: #{rpr statement}"
            db_objects[ name ]  = { name, type, message, }
        return { error_count, db_objects, }

      #-----------------------------------------------------------------------------------------------------
      _get_is_ready: ->
        { error_count,
          db_objects: expected_db_objects, } = @_get_objects_in_build_statements()
        #...................................................................................................
        if error_count isnt 0
          messages = []
          for name, { type, message, } of expected_db_objects
            continue unless type is 'error'
            messages.push message
          throw new Error "Ω___5 one or more build statements could not be parsed: #{rpr messages}"
        #...................................................................................................
        present_db_objects = @_get_db_objects()
        for name, { type: expected_type, } of expected_db_objects
          return false unless present_db_objects[ name ]?.type is expected_type
        return true

      #-----------------------------------------------------------------------------------------------------
      _prepare_statements: ->
        # #.................................................................................................
        # for name, sql of clasz.statements
        #   switch true
        #     when name.startsWith 'create_table_'
        #       null
        #     when name.startsWith 'insert_'
        #       null
        #     else
        #       throw new Error "Ωnql___6 unable to parse statement name #{rpr name}"
        # #   @[ name ] = @prepare sql
        hide @, 'statements', {}
        build_statement_name  = @_name_of_build_statements
        for name, statement of @constructor.statements
          # if ( type_of statement ) is 'list'
          #   @statements[ name ] = ( @prepare sub_statement for sub_statement in statement )
          #   continue
          @statements[ name ] = @prepare statement
        return null

      #---------------------------------------------------------------------------------------------------
      is_ready: ->
        # dbos = @_get_db_objects()
        # return false unless dbos.store_facets?.type is 'table'
        return true

      #-----------------------------------------------------------------------------------------------------
      execute: ( sql ) -> @db.exec    sql

      #-----------------------------------------------------------------------------------------------------
      prepare: ( sql ) ->
        try
          R = @db.prepare sql
        catch cause
          ### TAINT `rpr()` urgently needed ###
          throw new Error "Ω___7 when trying to prepare the following statement, an error was thrown: #{rpr sql}", { cause, }
        return R

    #=======================================================================================================
    class Dbric_std extends Dbric

      #-----------------------------------------------------------------------------------------------------
      @cfg: Object.freeze
        prefix: 'std'

      #-----------------------------------------------------------------------------------------------------
      @functions:   {}

      #-----------------------------------------------------------------------------------------------------
      @statements:
        std_get_schema: SQL"""
          select * from sqlite_schema order by name, type;"""
        std_get_tables: SQL"""
          select * from sqlite_schema where type is 'table' order by name, type;"""
        std_get_views: SQL"""
          select * from sqlite_schema where type is 'view' order by name, type;"""
        std_get_relations: SQL"""
          select * from sqlite_schema where type in ( 'table', 'view' ) order by name, type;"""

      #-----------------------------------------------------------------------------------------------------
      @build: [
        SQL"""create view std_tables as
          select * from sqlite_schema
            where type is 'table' order by name, type;"""
        SQL"""create view std_views as
          select * from sqlite_schema
            where type is 'view' order by name, type;"""
        SQL"""create view "std_relations" as
          select * from sqlite_schema
            where type in ( 'table', 'view' ) order by name, type;"""
        ]


    #=======================================================================================================
    class Segment_width_db extends Dbric

      #-----------------------------------------------------------------------------------------------------
      @functions:
        #...................................................................................................
        width_from_text:
          deterministic:  true
          varargs:        false
          call:           ( text ) -> get_wc_max_line_length text
        #...................................................................................................
        length_from_text:
          deterministic:  true
          varargs:        false
          call:           ( text ) -> text.length

      #-----------------------------------------------------------------------------------------------------
      @statements:
        #...................................................................................................
        create_table_segments: SQL"""
          drop table if exists segments;
          create table segments (
              segment_text      text    not null primary key,
              segment_width     integer not null generated always as ( width_from_text(  segment_text ) ) stored,
              segment_length    integer not null generated always as ( length_from_text( segment_text ) ) stored,
            constraint segment_width_eqgt_zero  check ( segment_width  >= 0 ),
            constraint segment_length_eqgt_zero check ( segment_length >= 0 ) );"""
        # #.................................................................................................
        # insert_segment: SQL"""
        #   insert into segments  ( segment_text,   segment_width,  segment_length  )
        #                 values  ( $segment_text,  $segment_width, $segment_length )
        #     on conflict ( segment_text ) do update
        #                 set     (                 segment_width,  segment_length  ) =
        #                         ( excluded.segment_width, excluded.segment_length );"""
        #...................................................................................................
        insert_segment: SQL"""
          insert into segments  ( segment_text  )
                        values  ( $segment_text )
            on conflict ( segment_text ) do nothing
            returning *;"""
        #...................................................................................................
        select_row_from_segments: SQL"""
          select * from segments where segment_text = $segment_text limit 1;"""

      #-----------------------------------------------------------------------------------------------------
      constructor: ( db_path ) ->
        super db_path
        clasz   = @constructor
        @cache  = new Map()
        ### TAINT should be done automatically ###
        @statements =
          insert_segment:           @prepare clasz.statements.insert_segment
          select_row_from_segments: @prepare clasz.statements.select_row_from_segments
        return undefined

    #=======================================================================================================
    internals = Object.freeze { internals..., Segment_width_db, }
    return exports = {
      Dbric,
      Dbric_std,
      esql,
      SQL,
      internals, }


#===========================================================================================================
Object.assign module.exports, UNSTABLE_DBRIC_BRICS

