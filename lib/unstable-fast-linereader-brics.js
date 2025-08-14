(function() {
  'use strict';
  var BRICS;

  //###########################################################################################################

  //===========================================================================================================
  BRICS = {
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_fast_linereader: function() {
      var FS, exports, nl, templates, walk_buffers_with_positions, walk_lines_with_positions;
      FS = require('node:fs');
      nl = '\n'.codePointAt(0);
      //-----------------------------------------------------------------------------------------------------------
      templates = {
        walk_buffers_with_positions_cfg: {
          chunk_size: 16 * 1024
        }
      };
      //-----------------------------------------------------------------------------------------------------------
      walk_buffers_with_positions = function*(path, cfg) {
        var buffer, byte_count, byte_idx, chunk_size, fd;
        // H.types.validate.guy_fs_walk_buffers_cfg ( cfg = { defaults.guy_fs_walk_buffers_cfg..., cfg..., } )
        // H.types.validate.nonempty_text path
        ({chunk_size} = {...templates.walk_buffers_with_positions_cfg, ...cfg});
        fd = FS.openSync(path);
        byte_idx = 0;
        while (true) {
          buffer = Buffer.alloc(chunk_size);
          byte_count = FS.readSync(fd, buffer, 0, chunk_size, byte_idx);
          if (byte_count === 0) {
            break;
          }
          if (byte_count < chunk_size) {
            buffer = buffer.subarray(0, byte_count);
          }
          yield ({buffer, byte_idx});
          byte_idx += byte_count;
        }
        return null;
      };
      //-----------------------------------------------------------------------------------------------------------
      walk_lines_with_positions = function*(path) {
        var buffer, byte_idx, eol, lnr, remainder, start, stop, x;
        // from mmomtchev/readcsv/readcsv-buffered-opt.js
        remainder = '';
        eol = '\n';
        lnr = 0;
//.........................................................................................................
        for (x of walk_buffers_with_positions(path)) {
          ({buffer, byte_idx} = x);
          start = 0;
          stop = null;
          while ((stop = buffer.indexOf(nl, start)) !== -1) {
            if ((start === 0) && (remainder.length > 0)) {
              lnr++;
              yield ({
                lnr,
                line: remainder + buffer.slice(0, stop),
                eol
              });
              remainder = '';
            } else {
              lnr++;
              yield ({
                lnr,
                line: (buffer.slice(start, stop)).toString('utf-8'),
                eol
              });
            }
            start = stop + 1;
          }
          remainder = buffer.slice(start);
        }
        //.........................................................................................................
        return null;
      };
      //.......................................................................................................
      return exports = {walk_buffers_with_positions, walk_lines_with_positions};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWZhc3QtbGluZXJlYWRlci1icmljcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsS0FBQTs7Ozs7RUFLQSxLQUFBLEdBSUUsQ0FBQTs7O0lBQUEsdUJBQUEsRUFBeUIsUUFBQSxDQUFBLENBQUE7QUFDM0IsVUFBQSxFQUFBLEVBQUEsT0FBQSxFQUFBLEVBQUEsRUFBQSxTQUFBLEVBQUEsMkJBQUEsRUFBQTtNQUFJLEVBQUEsR0FBTSxPQUFBLENBQVEsU0FBUjtNQUNOLEVBQUEsR0FBTSxJQUFJLENBQUMsV0FBTCxDQUFpQixDQUFqQixFQURWOztNQUlJLFNBQUEsR0FDRTtRQUFBLCtCQUFBLEVBQ0U7VUFBQSxVQUFBLEVBQWdCLEVBQUEsR0FBSztRQUFyQjtNQURGLEVBTE47O01BU0ksMkJBQUEsR0FBOEIsU0FBQSxDQUFFLElBQUYsRUFBUSxHQUFSLENBQUE7QUFDbEMsWUFBQSxNQUFBLEVBQUEsVUFBQSxFQUFBLFFBQUEsRUFBQSxVQUFBLEVBQUEsRUFBQTs7O1FBRU0sQ0FBQSxDQUFFLFVBQUYsQ0FBQSxHQUFrQixDQUFFLEdBQUEsU0FBUyxDQUFDLCtCQUFaLEVBQWdELEdBQUEsR0FBaEQsQ0FBbEI7UUFDQSxFQUFBLEdBQWtCLEVBQUUsQ0FBQyxRQUFILENBQVksSUFBWjtRQUNsQixRQUFBLEdBQWtCO0FBQ2xCLGVBQUEsSUFBQTtVQUNFLE1BQUEsR0FBYyxNQUFNLENBQUMsS0FBUCxDQUFhLFVBQWI7VUFDZCxVQUFBLEdBQWMsRUFBRSxDQUFDLFFBQUgsQ0FBWSxFQUFaLEVBQWdCLE1BQWhCLEVBQXdCLENBQXhCLEVBQTJCLFVBQTNCLEVBQXVDLFFBQXZDO1VBQ2QsSUFBUyxVQUFBLEtBQWMsQ0FBdkI7QUFBQSxrQkFBQTs7VUFDQSxJQUErQyxVQUFBLEdBQWEsVUFBNUQ7WUFBQSxNQUFBLEdBQWMsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsQ0FBaEIsRUFBbUIsVUFBbkIsRUFBZDs7VUFDQSxNQUFNLENBQUEsQ0FBRSxNQUFGLEVBQVUsUUFBVixDQUFBO1VBQ04sUUFBQSxJQUFjO1FBTmhCO0FBT0EsZUFBTztNQWJxQixFQVRsQzs7TUF5QkkseUJBQUEsR0FBNEIsU0FBQSxDQUFFLElBQUYsQ0FBQTtBQUNoQyxZQUFBLE1BQUEsRUFBQSxRQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxTQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxDQUFBOztRQUNNLFNBQUEsR0FBYztRQUNkLEdBQUEsR0FBYztRQUNkLEdBQUEsR0FBYyxFQUhwQjs7UUFLTSxLQUFBLHNDQUFBO1dBQUksQ0FBRSxNQUFGLEVBQVUsUUFBVjtVQUNGLEtBQUEsR0FBUTtVQUNSLElBQUEsR0FBUTtBQUNSLGlCQUFNLENBQUUsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQWUsRUFBZixFQUFtQixLQUFuQixDQUFULENBQUEsS0FBeUMsQ0FBQyxDQUFoRDtZQUNFLElBQUcsQ0FBRSxLQUFBLEtBQVMsQ0FBWCxDQUFBLElBQW1CLENBQUUsU0FBUyxDQUFDLE1BQVYsR0FBbUIsQ0FBckIsQ0FBdEI7Y0FDRSxHQUFBO2NBQ0EsTUFBTSxDQUFBO2dCQUFFLEdBQUY7Z0JBQU8sSUFBQSxFQUFRLFNBQUEsR0FBWSxNQUFNLENBQUMsS0FBUCxDQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FBM0I7Z0JBQW1EO2NBQW5ELENBQUE7Y0FDTixTQUFBLEdBQVksR0FIZDthQUFBLE1BQUE7Y0FLRSxHQUFBO2NBQ0EsTUFBTSxDQUFBO2dCQUFFLEdBQUY7Z0JBQU8sSUFBQSxFQUFRLENBQUUsTUFBTSxDQUFDLEtBQVAsQ0FBYSxLQUFiLEVBQW9CLElBQXBCLENBQUYsQ0FBNEIsQ0FBQyxRQUE3QixDQUFzQyxPQUF0QyxDQUFmO2dCQUFnRTtjQUFoRSxDQUFBLEVBTlI7O1lBT0EsS0FBQSxHQUFRLElBQUEsR0FBTztVQVJqQjtVQVNBLFNBQUEsR0FBWSxNQUFNLENBQUMsS0FBUCxDQUFhLEtBQWI7UUFaZCxDQUxOOztBQW1CTSxlQUFPO01BcEJtQixFQXpCaEM7O0FBZ0RJLGFBQU8sT0FBQSxHQUFVLENBQUUsMkJBQUYsRUFBK0IseUJBQS9CO0lBakRNO0VBQXpCLEVBVEY7OztFQTZEQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixLQUE5QjtBQTdEQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQlJJQ1MgPVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2Zhc3RfbGluZXJlYWRlcjogLT5cbiAgICBGUyAgPSByZXF1aXJlICdub2RlOmZzJ1xuICAgIG5sICA9ICdcXG4nLmNvZGVQb2ludEF0IDBcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHRlbXBsYXRlcyA9XG4gICAgICB3YWxrX2J1ZmZlcnNfd2l0aF9wb3NpdGlvbnNfY2ZnOlxuICAgICAgICBjaHVua19zaXplOiAgICAgMTYgKiAxMDI0XG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB3YWxrX2J1ZmZlcnNfd2l0aF9wb3NpdGlvbnMgPSAoIHBhdGgsIGNmZyApIC0+XG4gICAgICAjIEgudHlwZXMudmFsaWRhdGUuZ3V5X2ZzX3dhbGtfYnVmZmVyc19jZmcgKCBjZmcgPSB7IGRlZmF1bHRzLmd1eV9mc193YWxrX2J1ZmZlcnNfY2ZnLi4uLCBjZmcuLi4sIH0gKVxuICAgICAgIyBILnR5cGVzLnZhbGlkYXRlLm5vbmVtcHR5X3RleHQgcGF0aFxuICAgICAgeyBjaHVua19zaXplIH0gID0geyB0ZW1wbGF0ZXMud2Fsa19idWZmZXJzX3dpdGhfcG9zaXRpb25zX2NmZy4uLiwgY2ZnLi4uLCB9XG4gICAgICBmZCAgICAgICAgICAgICAgPSBGUy5vcGVuU3luYyBwYXRoXG4gICAgICBieXRlX2lkeCAgICAgICAgPSAwXG4gICAgICBsb29wXG4gICAgICAgIGJ1ZmZlciAgICAgID0gQnVmZmVyLmFsbG9jIGNodW5rX3NpemVcbiAgICAgICAgYnl0ZV9jb3VudCAgPSBGUy5yZWFkU3luYyBmZCwgYnVmZmVyLCAwLCBjaHVua19zaXplLCBieXRlX2lkeFxuICAgICAgICBicmVhayBpZiBieXRlX2NvdW50IGlzIDBcbiAgICAgICAgYnVmZmVyICAgICAgPSBidWZmZXIuc3ViYXJyYXkgMCwgYnl0ZV9jb3VudCBpZiBieXRlX2NvdW50IDwgY2h1bmtfc2l6ZVxuICAgICAgICB5aWVsZCB7IGJ1ZmZlciwgYnl0ZV9pZHgsIH1cbiAgICAgICAgYnl0ZV9pZHggICArPSBieXRlX2NvdW50XG4gICAgICByZXR1cm4gbnVsbFxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgd2Fsa19saW5lc193aXRoX3Bvc2l0aW9ucyA9ICggcGF0aCApIC0+XG4gICAgICAjIGZyb20gbW1vbXRjaGV2L3JlYWRjc3YvcmVhZGNzdi1idWZmZXJlZC1vcHQuanNcbiAgICAgIHJlbWFpbmRlciAgID0gJydcbiAgICAgIGVvbCAgICAgICAgID0gJ1xcbidcbiAgICAgIGxuciAgICAgICAgID0gMFxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgZm9yIHsgYnVmZmVyLCBieXRlX2lkeCwgfSBmcm9tIHdhbGtfYnVmZmVyc193aXRoX3Bvc2l0aW9ucyBwYXRoXG4gICAgICAgIHN0YXJ0ID0gMFxuICAgICAgICBzdG9wICA9IG51bGxcbiAgICAgICAgd2hpbGUgKCBzdG9wID0gYnVmZmVyLmluZGV4T2YgbmwsIHN0YXJ0ICkgaXNudCAtMVxuICAgICAgICAgIGlmICggc3RhcnQgPT0gMCApIGFuZCAoIHJlbWFpbmRlci5sZW5ndGggPiAwIClcbiAgICAgICAgICAgIGxucisrXG4gICAgICAgICAgICB5aWVsZCB7IGxuciwgbGluZTogKCByZW1haW5kZXIgKyBidWZmZXIuc2xpY2UgMCwgc3RvcCApLCBlb2wsIH1cbiAgICAgICAgICAgIHJlbWFpbmRlciA9ICcnXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbG5yKytcbiAgICAgICAgICAgIHlpZWxkIHsgbG5yLCBsaW5lOiAoICggYnVmZmVyLnNsaWNlIHN0YXJ0LCBzdG9wICkudG9TdHJpbmcgJ3V0Zi04JyApLCBlb2wsIH1cbiAgICAgICAgICBzdGFydCA9IHN0b3AgKyAxXG4gICAgICAgIHJlbWFpbmRlciA9IGJ1ZmZlci5zbGljZSBzdGFydFxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgcmV0dXJuIG51bGxcblxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7IHdhbGtfYnVmZmVyc193aXRoX3Bvc2l0aW9ucywgd2Fsa19saW5lc193aXRoX3Bvc2l0aW9ucywgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbk9iamVjdC5hc3NpZ24gbW9kdWxlLmV4cG9ydHMsIEJSSUNTXG5cbiJdfQ==
//# sourceURL=../src/unstable-fast-linereader-brics.coffee