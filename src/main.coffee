
############################################################################################################
#
#===========================================================================================================
module.exports = SFMODULES =

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_list_tools: ->
    append    = ( list, P... ) -> list.splice list.length, 0, P...
    is_empty  = ( list ) -> list.length is 0
    return { append, is_empty, }

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_escape_html_text: ->
    escape_html_text = ( text ) ->
      R = text
      R = R.replace /&/g, '&amp;'
      R = R.replace /</g, '&lt;'
      R = R.replace />/g, '&gt;'
      return R
    return { escape_html_text, }

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_tagfun_tools: ->

    # ### Given the arguments of either a tagged template function call ('tagfun call') or the single
    # argument of a conventional function call, `get_first_argument()` will return either

    # * the result of applying `as_text()` to the sole argument, or

    # * the result of concatenating the constant parts and the interpolated expressions, which each
    # expression replaced by the result of applying `as_text()` to it.

    # Another way to describe this behavior is to say that this function treats a conventional call with
    # a single expression the same way that it treats a funtag call with a string that contains nothing but
    # that same expression, so the invariant `( get_first_argument exp ) == ( get_first_argument"#{ exp }"
    # )` holds.

    # * intended for string producers, text processing, markup production;
    # * list some examples. ###

    # #---------------------------------------------------------------------------------------------------------
    # create_get_first_argument_fn = ( as_text = null ) ->
    #   as_text ?= ( expression ) -> "#{expression}"
    #   ### TAINT use proper validation ###
    #   unless ( typeof as_text ) is 'function'
    #     throw new Error "Ωidsp___1 expected a function, got #{rpr as_text}"
    #   #-------------------------------------------------------------------------------------------------------
    #   get_first_argument = ( P... ) ->
    #     unless is_tagfun_call P...
    #       unless P.length is 1
    #         throw new Error "Ωidsp___2 expected 1 argument, got #{P.length}"
    #       return as_text P[ 0 ]
    #     #.....................................................................................................
    #     [ parts, expressions..., ] = P
    #     R = parts[ 0 ]
    #     for expression, idx in expressions
    #       R += ( as_text expression ) + parts[ idx + 1 ]
    #     return R
    #   #-------------------------------------------------------------------------------------------------------
    #   get_first_argument.create = create_get_first_argument_fn
    #   return get_first_argument

    #---------------------------------------------------------------------------------------------------------
    is_tagfun_call = ( P... ) ->
      return false unless Array.isArray   P[ 0 ]
      return false unless Object.isFrozen P[ 0 ]
      return false unless P[ 0 ].raw?
      return true

    #---------------------------------------------------------------------------------------------------------
    walk_raw_parts = ( chunks, values... ) ->
      chunks      = ( chunk for chunk in chunks.raw )
      chunks.raw  = chunks[ ... ]
      Object.freeze chunks
      yield from walk_parts chunks, values...

    #---------------------------------------------------------------------------------------------------------
    walk_parts = ( chunks, values... ) ->
      unless is_tagfun_call chunks, values...
        if values.length isnt 0
          throw new Error "Ω___3 expected 1 argument in non-template call, got #{arguments.length}"
        if typeof chunks is 'string' then [ chunks, values, ] = [ [ chunks, ], [],          ]
        else                              [ chunks, values, ] = [ [ '', '', ], [ chunks, ], ]
      #.......................................................................................................
      yield { chunk: chunks[ 0 ], isa: 'chunk', }
      for value, idx in values
        yield { value, isa: 'value', }
        yield { chunk: chunks[ idx + 1 ], isa: 'chunk', }
      #.......................................................................................................
      return null

    #---------------------------------------------------------------------------------------------------------
    walk_raw_nonempty_parts = ( chunks, values... ) ->
      for part from walk_raw_parts chunks, values...
        yield part unless ( part.chunk is '' ) or ( part.value is '' )
      return null

    #---------------------------------------------------------------------------------------------------------
    walk_nonempty_parts = ( chunks, values... ) ->
      for part from walk_parts chunks, values...
        yield part unless ( part.chunk is '' ) or ( part.value is '' )
      return null

    #---------------------------------------------------------------------------------------------------------
    # return do exports = ( get_first_argument = create_get_first_argument_fn() ) -> {
    #   get_first_argument, is_tagfun_call,
    #   walk_parts, walk_nonempty_parts, walk_raw_parts, walk_raw_nonempty_parts, }
    return {
      is_tagfun_call,
      walk_parts,           walk_raw_parts,
      walk_nonempty_parts,  walk_raw_nonempty_parts, }


  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_managed_property_tools: ->
    set_getter = ( object, name, get ) -> Object.defineProperties object, { [name]: { get, }, }
    hide = ( object, name, value ) => Object.defineProperty object, name,
        enumerable:   false
        writable:     true
        configurable: true
        value:        value

    #---------------------------------------------------------------------------------------------------------
    return { set_getter, hide, }

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_nameit: ->
    nameit = ( name, fn ) -> Object.defineProperty fn, 'name', { value: name, }; fn
    #---------------------------------------------------------------------------------------------------------
    return { nameit, }

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_stack_classes: ->
    { set_getter,
      hide,       } = SFMODULES.require_managed_property_tools()
    misfit          = Symbol 'misfit'
    class XXX_Stack_error extends Error

    #===========================================================================================================
    class Stack

      #---------------------------------------------------------------------------------------------------------
      constructor: ->
        @data = []
        return undefined

      #---------------------------------------------------------------------------------------------------------
      toString: -> "[#{ ( "#{e}" for e in @data ).join'.' }]"

      #---------------------------------------------------------------------------------------------------------
      set_getter @::, 'length',   -> @data.length
      set_getter @::, 'is_empty', -> @data.length is 0
      clear: -> @data.length = 0; null
      [Symbol.iterator]: -> yield from @data

      #---------------------------------------------------------------------------------------------------------
      push:     ( x ) -> @data.push x;    null
      unshift:  ( x ) -> @data.unshift x; null

      #---------------------------------------------------------------------------------------------------------
      pop: ( fallback = misfit ) ->
        if @is_empty
          return fallback unless fallback is misfit
          throw new XXX_Stack_error "Ωidsp___4 unable to pop value from empty stack"
        return @data.pop()

      #---------------------------------------------------------------------------------------------------------
      shift: ( fallback = misfit ) ->
        if @is_empty
          return fallback unless fallback is misfit
          throw new XXX_Stack_error "Ωidsp___5 unable to shift value from empty stack"
        return @data.shift()

      #---------------------------------------------------------------------------------------------------------
      peek: ( fallback = misfit ) ->
        if @is_empty
          return fallback unless fallback is misfit
          throw new XXX_Stack_error "Ωidsp___6 unable to peek value of empty stack"
        return @data.at -1

    #-----------------------------------------------------------------------------------------------------------
    return { Stack, }

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_infiniproxy: ->
    ###

    ## To Do

    * **`[—]`** allow to set context to be used by `apply()`
    * **`[—]`** allow to call `sys.stack.clear()` manually where seen fit

    ###
    { hide,               } = SFMODULES.require_managed_property_tools()
    { Stack,              } = SFMODULES.require_stack_classes()
    ### TAINT in this simulation of single-file modules, a new distinct symbol is produced with each call to
    `require_infiniproxy()` ###
    sys_symbol              = Symbol 'sys'
    # misfit                  = Symbol 'misfit'
    template                =
      ### An object that will be checked for existing properties to return; when no provider is given or a
      provider lacks a requested property, `sys.sub_level_proxy` will be returned for property accesses: ###
      provider:     Object.create null
      ### A function to be called when the proxy (either `sys.top_level_proxy` or `sys.sub_level_proxy`) is
      called; notice that if the `provider` provides a method for a given key, that method will be called
      instead of the `callee`: ###
      callee:       null

    #=========================================================================================================
    create_infinyproxy = ( cfg ) ->
      ### TAINT use proper typechecking ###
      cfg = { template...,  cfg..., }
      #.......................................................................................................
      new_proxy = ({ is_top_level, }) ->
        callee_ctx  = null
        get_ctx     = -> callee_ctx ?= { is_top_level, cfg..., sys..., }
        #.....................................................................................................
        R = new Proxy cfg.callee,

          #-----------------------------------------------------------------------------------------------------
          apply: ( target, key, P ) ->
            # urge 'Ω__10', "apply #{rpr { target, key, P, is_top_level, }}"

            R = Reflect.apply target, get_ctx(), P
            sys.stack.clear()
            return R

          #-----------------------------------------------------------------------------------------------------
          get: ( target, key ) ->
            # urge 'Ω__11', "get #{rpr { target, key, }}"
            return get_ctx()                      if key is sys_symbol
            return target[ key ]                  if ( typeof key ) is 'symbol'
            return Reflect.get cfg.provider, key  if Reflect.has cfg.provider, key
            sys.stack.clear() if is_top_level
            sys.stack.push key
            # return "[result for getting non-preset key #{rpr key}] from #{rpr provider}"
            return sys.sub_level_proxy
        #.....................................................................................................
        return R
      #.......................................................................................................
      sys = { stack: new Stack(), }
      sys.top_level_proxy = new_proxy { is_top_level: true,  }
      sys.sub_level_proxy = new_proxy { is_top_level: false, }
      #.......................................................................................................
      return sys.top_level_proxy

    #---------------------------------------------------------------------------------------------------------
    return { create_infinyproxy, sys_symbol, }


  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_next_free_filename: ->
    cfg =
      max_attempts:   9999
      prefix:         '~.'
      suffix:         '.bricabrac-cache'
    cache_filename_re = ///
      ^
      (?: #{RegExp.escape cfg.prefix} )
      (?<first>.*)
      \.
      (?<nr>[0-9]{4})
      (?: #{RegExp.escape cfg.suffix} )
      $
      ///v
    rpr               = ( x ) ->
      return "'#{x.replace /'/g, "\\'" if ( typeof x ) is 'string'}'"
      return "#{x}"
    errors =
      TMP_exhaustion_error: class TMP_exhaustion_error extends Error
      TMP_validation_error: class TMP_validation_error extends Error
    FS            = require 'node:fs'
    PATH          = require 'node:path'
    #.......................................................................................................
    exists = ( path ) ->
      try FS.statSync path catch error then return false
      return true
    #.......................................................................................................
    get_next_filename = ( path ) ->
      ### TAINT use proper type checking ###
      throw new errors.TMP_validation_error "Ω___1 expected a text, got #{rpr path}" unless ( typeof path ) is 'string'
      throw new errors.TMP_validation_error "Ω___2 expected a nonempty text, got #{rpr path}" unless path.length > 0
      dirname  = PATH.dirname path
      basename = PATH.basename path
      unless ( match = basename.match cache_filename_re )?
        return PATH.join dirname, "#{cfg.prefix}#{basename}.0001#{cfg.suffix}"
      { first, nr,  } = match.groups
      nr              = "#{( parseInt nr, 10 ) + 1}".padStart 4, '0'
      path            = first
      return PATH.join dirname, "#{cfg.prefix}#{first}.#{nr}#{cfg.suffix}"
    #.......................................................................................................
    get_next_free_filename = ( path ) ->
      R             = path
      failure_count = -1
      #.....................................................................................................
      loop
        #...................................................................................................
        failure_count++
        if failure_count > cfg.max_attempts
          throw new errors.TMP_exhaustion_error "Ω___5 too many (#{failure_count}) attempts; path #{rpr R} exists"
        #...................................................................................................
        R = get_next_filename R
        break unless exists R
      return R
    #.......................................................................................................
    return exports = { get_next_free_filename, get_next_filename, exists, cache_filename_re, errors, }
