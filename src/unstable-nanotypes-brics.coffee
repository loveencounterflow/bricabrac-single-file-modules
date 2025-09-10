
'use strict'


############################################################################################################
#
#===========================================================================================================
BRICS =

  #=========================================================================================================
  ### NOTE Future Single-File Module ###
  require_nanotypes: ->

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
        hide @, 'name',     name
        hide @, 'T',        typespace
        hide @, '_isa',     isa
        set_getter @, CFG,  => @T[CFG]
        @data             = {}
        return undefined

      #-----------------------------------------------------------------------------------------------------
      isa: ( x, P... ) ->
        R = @_isa.call @, x, P...
        return R

      #-----------------------------------------------------------------------------------------------------
      isa_datmap: ( [ x, P..., ], data = null, mapping = null ) ->
        @data   = {}
        R       = @isa x, P...
        #...................................................................................................
        if data?
          if mapping?     then  clean_assign data, ( remap ( clean_assign {}, @data ), mapping )  ### d1 m1 ###
          else                  clean_assign data,                            @data               ### d1 m0 ###
        else if mapping?  then                       remap                    @data,   mapping    ### d0 m1 ###
        return R                                                                                  ### d0 m0 ###

      #-----------------------------------------------------------------------------------------------------
      datmap_isa: ( data, mapping, x, P... ) ->
        @data   = {}
        R       = @isa x, P...
        #...................................................................................................
        if data?
          if mapping?     then  clean_assign data, ( remap ( clean_assign {}, @data ), mapping )  ### d1 m1 ###
          else                  clean_assign data,                            @data               ### d1 m0 ###
        else if mapping?  then                       remap                    @data,   mapping    ### d0 m1 ###
        return R                                                                                  ### d0 m0 ###

      #-----------------------------------------------------------------------------------------------------
      validate: ( x, P... ) ->
        return x if @isa x, P...
        ### TAINT use better rpr() ###
        throw new Error "Ωbbnt___2 not a valid #{@name}: #{x}"

      #-----------------------------------------------------------------------------------------------------
      validate_datmap: ( [ x, P..., ], data = null, mapping = null ) ->
        return x if @isa_datmap [ x, P..., ], data, mapping
        ### TAINT use better rpr() ###
        throw new Error "Ωbbnt___3 not a valid #{@name}: #{x}"

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
Object.assign module.exports, BRICS
