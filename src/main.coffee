
'use strict'

#===========================================================================================================
Object.assign module.exports, require './various-brics'
Object.assign module.exports, require './ansi-brics'
Object.assign module.exports, { unstable: {
  ( require './unstable-brics'                  )...,
  ( require './unstable-benchmark-brics'        )...,
  ( require './unstable-fast-linereader-brics'  )...,
  ( require './unstable-getrandom-brics'        )...,
  ( require './unstable-callsite-brics'         )...,
  ( require './unstable-dbric-brics'            )...,
  ( require './unstable-temp-brics'             )...,
  ( require './unstable-rpr-type_of-brics'      )...,
  ( require './unstable-anybase-brics'          )...,
  ( require './unstable-object-tools-brics'     )...,
  }, }

