

'use strict'


tests =

  #---------------------------------------------------------------------------------------------------------
  types_bounded_list: ->
    { internals               } = require '../../../apps/hollerith/lib/types'
    { Bounded_list,           } = internals
    # { type_of,                } = SFMODULES.unstable.require_type_of()
    { isDeepStrictEqual: equals, } = require 'node:util'
    #.......................................................................................................
    blist = new Bounded_list 3
    @eq ( Ωhllt_136 = -> blist.size               ), 0
    @eq ( Ωhllt_137 = -> blist.is_empty           ), true
    @eq ( Ωhllt_138 = -> blist.max_size           ), 3
    @eq ( Ωhllt_139 = -> blist.at -1              ), undefined
    #.......................................................................................................
    data_1 = blist.current
    @eq ( Ωhllt_140 = -> data_1                   ), {}
    @eq ( Ωhllt_141 = -> blist.current            ), data_1
    @eq ( Ωhllt_142 = -> blist.at -1              ), data_1
    @eq ( Ωhllt_143 = -> blist.size               ), 1
    @eq ( Ωhllt_144 = -> blist.is_empty           ), false
    #.......................................................................................................
    data_2 = blist.create()
    @eq ( Ωhllt_145 = -> equals data_1, data_2    ), true
    @eq ( Ωhllt_146 = -> data_1 is data_2         ), false
    @eq ( Ωhllt_147 = -> blist.at -1              ), data_2
    @eq ( Ωhllt_148 = -> blist.size               ), 2
    @eq ( Ωhllt_149 = -> blist.is_empty           ), false
    @eq ( Ωhllt_150 = -> data_2 is blist.current  ), true
    @eq ( Ωhllt_151 = -> blist.at -1              ), data_2
    @eq ( Ωhllt_152 = -> blist.size               ), 2
    @eq ( Ωhllt_153 = -> blist.is_empty           ), false
    #.......................................................................................................
    data_3 = blist.create()
    @eq ( Ωhllt_154 = -> equals data_2, data_3    ), true
    @eq ( Ωhllt_155 = -> data_2 is data_3         ), false
    @eq ( Ωhllt_156 = -> blist.at -1              ), data_3
    @eq ( Ωhllt_157 = -> blist.size               ), 3
    @eq ( Ωhllt_158 = -> blist.is_empty           ), false
    @eq ( Ωhllt_159 = -> data_3 is blist.current  ), true
    @eq ( Ωhllt_160 = -> blist.at -1              ), data_3
    @eq ( Ωhllt_161 = -> blist.at -2              ), data_2
    @eq ( Ωhllt_162 = -> blist.at -3              ), data_1
    @eq ( Ωhllt_163 = -> blist.size               ), 3
    @eq ( Ωhllt_164 = -> blist.is_empty           ), false
    #.......................................................................................................
    data_4 = blist.create { a: 1, b: 2, }
    @eq ( Ωhllt_165 = -> equals data_3, data_4    ), false
    @eq ( Ωhllt_166 = -> data_3 is data_4         ), false
    @eq ( Ωhllt_167 = -> blist.at -1              ), { a: 1, b: 2, }
    @eq ( Ωhllt_168 = -> blist.size               ), 3
    @eq ( Ωhllt_169 = -> blist.is_empty           ), false
    @eq ( Ωhllt_170 = -> blist.current            ), { a: 1, b: 2, }
    @eq ( Ωhllt_171 = -> blist.at -1              ), { a: 1, b: 2, }
    @eq ( Ωhllt_172 = -> blist.at -2              ), data_3
    @eq ( Ωhllt_173 = -> blist.at -3              ), data_2
    @eq ( Ωhllt_174 = -> blist.size               ), 3
    @eq ( Ωhllt_175 = -> blist.is_empty           ), false
    #.......................................................................................................
    @eq ( Ωhllt_176 = -> [ blist.create(), blist.size, ]    ), [ {}, 3, ]
    @eq ( Ωhllt_177 = -> [ blist.create(), blist.size, ]    ), [ {}, 3, ]
    @eq ( Ωhllt_178 = -> [ blist.create(), blist.size, ]    ), [ {}, 3, ]
    #.......................................................................................................
    blist = new Bounded_list 3
    @eq ( Ωhllt_179 = -> [ ( blist.assign { message: 'oops',        } ), blist.size, blist.current, ] ), [ { message: 'oops'        }, 1, { message: 'oops'        } ]
    @eq ( Ωhllt_180 = -> [ ( blist.assign { message: 'over', x: 1,  } ), blist.size, blist.current, ] ), [ { message: 'over', x: 1, }, 1, { message: 'over', x: 1, } ]
    #.......................................................................................................
    return null

#===========================================================================================================
### NOTE Future Single-File Module ###
class Bounded_list

  #---------------------------------------------------------------------------------------------------------
  constructor: ( max_size = 3 ) ->
    @max_size   = max_size
    @data       = []
    return undefined

  #---------------------------------------------------------------------------------------------------------
  create: ( P... ) ->
    @data.push clean_assign {}, P...
    @data.shift() if @size > @max_size
    return @current

  #---------------------------------------------------------------------------------------------------------
  assign: ( P...  ) -> clean_assign @current, P...
  at:     ( idx   ) -> @data.at idx

  #---------------------------------------------------------------------------------------------------------
  set_getter @::, 'size',     -> @data.length
  set_getter @::, 'is_empty', -> @data.length is 0
  set_getter @::, 'current',  -> if @is_empty then @create() else @at -1

