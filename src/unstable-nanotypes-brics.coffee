
'use strict'

#===========================================================================================================
{ debug, } = console


############################################################################################################
#
#===========================================================================================================
BRICS =

  #=========================================================================================================
  ### NOTE Future Single-File Module ###
  require_nanotypes_v1: ->

    #=======================================================================================================
    SFMODULES                 = require './main'
    { clean_assign,         } = SFMODULES.unstable.require_clean_assign()
    { hide,
      set_getter,           } = SFMODULES.require_managed_property_tools()
    { nameit,               } = SFMODULES.require_nameit()
    { remap,                } = SFMODULES.unstable.require_remap()
    { freeze,               } = Object
    { show_no_colors: rpr,  } = SFMODULES.unstable.require_show()
    # { type_of,              } = SFMODULES.unstable.require_type_of()
    CFG                       = Symbol.for 'cfg'

    #=======================================================================================================
    class Type

      #-----------------------------------------------------------------------------------------------------
      constructor: ( typespace, name, isa ) ->
        hide @, 'name',     name
        hide @, 'T',        typespace
        hide @, '_isa',     isa
        set_getter @, CFG,  => @T[CFG]
        @data             = {} # new Bounded_list()
        return undefined

      #-----------------------------------------------------------------------------------------------------
      isa: ( x, data = null, mapping = null ) ->
        @data   = {}
        R       = @_isa.call @, x
        #...................................................................................................
        if data?
          if mapping?     then  clean_assign data, ( remap ( clean_assign {}, @data ), mapping )  ### d1 m1 ###
          else                  clean_assign data,                            @data               ### d1 m0 ###
        else if mapping?  then                       remap                    @data,   mapping    ### d0 m1 ###
        return R                                                                                  ### d0 m0 ###

      #-----------------------------------------------------------------------------------------------------
      validate: ( x, data = null, mapping = null ) ->
        return x if @isa x, data, mapping
        ### TAINT use better rpr() ###
        throw new Error "Ωbbnt___1 not a valid #{@name}: #{x}"

      #-----------------------------------------------------------------------------------------------------
      assign: ( P... ) -> clean_assign @data, P...

      #-----------------------------------------------------------------------------------------------------
      fail: ( message, P... ) -> clean_assign @data, { message, }, P...; false


    #=======================================================================================================
    class Typespace

      #-----------------------------------------------------------------------------------------------------
      @[CFG]: null

      #=====================================================================================================
      constructor: ( cfg = null ) ->
        clasz   = @constructor
        @[CFG]  = freeze clean_assign {}, ( clasz[CFG] ? undefined ), ( cfg ? undefined )
        for name in Object.getOwnPropertyNames clasz
          class Typeclass extends Type
          nameit name, Typeclass
          @[ name ] = new Typeclass @, name, isa = clasz[ name ]
        return undefined

    #=======================================================================================================
    return exports = { Type, Typespace, CFG, }


  #=========================================================================================================
  ### NOTE Future Single-File Module ###
  require_nanotypes_v2: ->

    #=======================================================================================================
    SFMODULES                 = require './main'
    { clean_assign,         } = SFMODULES.unstable.require_clean_assign()
    { hide,
      set_getter,           } = SFMODULES.require_managed_property_tools()
    { nameit,               } = SFMODULES.require_nameit()
    { remap,                } = SFMODULES.unstable.require_remap()
    { freeze,               } = Object
    { show_no_colors: rpr,  } = SFMODULES.unstable.require_show()
    # { type_of,              } = SFMODULES.unstable.require_type_of()
    CFG                       = Symbol.for 'cfg'

    #=======================================================================================================
    class Type

      #-----------------------------------------------------------------------------------------------------
      constructor: ( typespace, name, isa ) ->
        hide @, 'name',       name
        hide @, 'T',          typespace
        hide @, '_isa',       isa
        hide @, 'inputs',     {}
        set_getter @, CFG,  => @T[CFG]
        @data             = {}
        return undefined

      #-----------------------------------------------------------------------------------------------------
      set_getter @::, 'full_name', ->
        return @name unless @inputs[ 0 ] instanceof Type
        return "#{@name} <#{@inputs[ 0 ].full_name}>"

      #-----------------------------------------------------------------------------------------------------
      dm_isa: ( data, mapping, x, P... ) ->
        ### Like `Type::isa()`, but capture data and optionally remap it ###
        R = @isa x, P...
        #...................................................................................................
        if data?
          if mapping?     then  clean_assign data, ( remap ( clean_assign {}, @data ), mapping )  ### d1 m1 ###
          else                  clean_assign data,                            @data               ### d1 m0 ###
        else if mapping?  then                       remap                    @data,   mapping    ### d0 m1 ###
        return R                                                                                  ### d0 m0 ###

      #-----------------------------------------------------------------------------------------------------
      isa: ( x, P... ) ->
        @data   = {}
        @inputs = { x, P..., }
        R       = @_isa.call @, x, P...
        return R

      # #-----------------------------------------------------------------------------------------------------
      # dm_validate: ( data, mapping, x, P... ) ->
      #   return x if @isa x, P...
      #   message   = "not a valid #{@full_name}: #{x}"
      #   message  += " – #{@data.message}" if @data.message?
      #   throw new Error message

      #-----------------------------------------------------------------------------------------------------
      _get_validation_failure_message: ( x ) ->
        R   = "(#{@full_name}) not a valid #{@full_name}: #{x}"
        R  += " – #{@data.message}" if @data.message?
        return R

      #-----------------------------------------------------------------------------------------------------
      dm_validate: ( data, mapping,  x, P... ) ->
        return x if @dm_isa data, mapping, x, P...
        throw new Error @_get_validation_failure_message x

      #-----------------------------------------------------------------------------------------------------
      validate: ( x, P... ) ->
        return x if @isa x, P...
        throw new Error @_get_validation_failure_message x

      #-----------------------------------------------------------------------------------------------------
      assign: ( P... ) -> clean_assign @data, P...

      #-----------------------------------------------------------------------------------------------------
      fail: ( message, P... ) -> clean_assign @data, { message, }, P...; false


    #=======================================================================================================
    class Typespace

      #-----------------------------------------------------------------------------------------------------
      @[CFG]: null

      #=====================================================================================================
      constructor: ( cfg = null ) ->
        clasz   = @constructor
        @[CFG]  = freeze clean_assign {}, ( clasz[CFG] ? undefined ), ( cfg ? undefined )
        for name in Object.getOwnPropertyNames clasz
          class Typeclass extends Type
          nameit name, Typeclass
          @[ name ] = new Typeclass @, name, isa = clasz[ name ]
        return undefined

    #=======================================================================================================
    return exports = { Type, Typespace, CFG, }



#===========================================================================================================
BRICS.require_nanotypes = BRICS.require_nanotypes_v2
Object.assign module.exports, BRICS
