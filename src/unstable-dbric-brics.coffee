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
      set_getter,   } = ( require './main' ).require_managed_property_tools()
    SQLITE            = require 'node:sqlite'
    { debug,        } = console

    #-------------------------------------------------------------------------------------------------------
    internals = {}

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
        prefix: 'NOPREFIX'
      @functions:   {}
      @statements:  { build: [], }

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
        for dbo from ( @db.prepare @constructor.statements.std_get_schema ).iterate()
          R[ dbo.name ] = { name: dbo.name, type: dbo.type, }
        return R

      #-----------------------------------------------------------------------------------------------------
      teardown: ->

      #-----------------------------------------------------------------------------------------------------
      build: -> if @is_ready then 0 else @rebuild()

      #-----------------------------------------------------------------------------------------------------
      rebuild: ->
        R     = -1
        clasz = @constructor
        #...................................................................................................
        return -1 unless ( build_statements = clasz.statements?.build )?
        #...................................................................................................
        ### TAINT use proper validation ###
        unless Array.isArray build_statements
          throw new Error "Ω___4 expected a list for #{clasz.name}::statements.build, got #{build_statements}"
        #...................................................................................................
        @teardown()
        #...................................................................................................
        count = 0
        for build_statement in build_statements
          count++
          debug 'Ω___5', "build statement:", build_statement
          ( @prepare build_statement ).run()
        return count

      #---------------------------------------------------------------------------------------------------
      set_getter @::, 'is_ready', -> @_get_is_ready()

      #---------------------------------------------------------------------------------------------------
      _get_is_ready: -> true

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
          continue if name is build_statement_name
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
          throw new Error "Ω___7 when trying to prepare the following statement, an error was thrown: #{sql}", { cause, }
        return R

    #=======================================================================================================
    class Dbric_std extends Dbric

      #-----------------------------------------------------------------------------------------------------
      @cfg: Object.freeze
        prefix: 'std'
      @functions:   {}
      @statements:
        std_get_schema: SQL"""
          select * from sqlite_schema order by name, type;"""
        std_get_tables: SQL"""
          select * from sqlite_schema where type is 'table' order by name, type;"""
        std_get_views: SQL"""
          select * from sqlite_schema where type is 'view' order by name, type;"""
        std_get_relations: SQL"""
          select * from sqlite_schema where type in ( 'table', 'view' ) order by name, type;"""
        #...................................................................................................
        std_build: [
          SQL"""create view std_tables as
            select * from sqlite_schema
              where type is 'table' order by name, type;"""
          SQL"""create view std_views as
            select * from sqlite_schema
              where type is 'view' order by name, type;"""
          SQL"""create view std_relations as
            select * from sqlite_schema
              where type in ( 'table', 'view' ) order by name, type;"""
          ]

      #---------------------------------------------------------------------------------------------------
      _get_is_ready: ->
        db_objects = @_get_db_objects()
        return false unless db_objects.std_tables?.type     is 'view'
        return false unless db_objects.std_views?.type      is 'view'
        return false unless db_objects.std_relations?.type  is 'view'
        return true

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
      SQL,
      internals, }


#===========================================================================================================
Object.assign module.exports, UNSTABLE_DBRIC_BRICS

