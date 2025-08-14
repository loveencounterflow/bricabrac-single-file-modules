'use strict'

############################################################################################################
#
#===========================================================================================================
BRICS =

  #===========================================================================================================
  ### NOTE Future Single-File Module ###
  require_fast_linereader: ->
    FS  = require 'node:fs'
    nl  = '\n'.codePointAt 0

    #-----------------------------------------------------------------------------------------------------------
    templates =
      walk_buffers_with_positions_cfg:
        chunk_size:     16 * 1024

    #-----------------------------------------------------------------------------------------------------------
    walk_buffers_with_positions = ( path, cfg ) ->
      # H.types.validate.guy_fs_walk_buffers_cfg ( cfg = { defaults.guy_fs_walk_buffers_cfg..., cfg..., } )
      # H.types.validate.nonempty_text path
      { chunk_size }  = { templates.walk_buffers_with_positions_cfg..., cfg..., }
      fd              = FS.openSync path
      byte_idx        = 0
      loop
        buffer      = Buffer.alloc chunk_size
        byte_count  = FS.readSync fd, buffer, 0, chunk_size, byte_idx
        break if byte_count is 0
        buffer      = buffer.subarray 0, byte_count if byte_count < chunk_size
        yield { buffer, byte_idx, }
        byte_idx   += byte_count
      return null

    #-----------------------------------------------------------------------------------------------------------
    walk_lines_with_positions = ( path ) ->
      # from mmomtchev/readcsv/readcsv-buffered-opt.js
      remainder   = ''
      eol         = '\n'
      lnr         = 0
      #.........................................................................................................
      for { buffer, byte_idx, } from walk_buffers_with_positions path
        start = 0
        stop  = null
        while ( stop = buffer.indexOf nl, start ) isnt -1
          if ( start == 0 ) and ( remainder.length > 0 )
            lnr++
            yield { lnr, line: ( remainder + buffer.slice 0, stop ), eol, }
            remainder = ''
          else
            lnr++
            yield { lnr, line: ( ( buffer.slice start, stop ).toString 'utf-8' ), eol, }
          start = stop + 1
        remainder = buffer.slice start
      #.........................................................................................................
      return null

    #.......................................................................................................
    return exports = { walk_buffers_with_positions, walk_lines_with_positions, }

#===========================================================================================================
Object.assign module.exports, BRICS

