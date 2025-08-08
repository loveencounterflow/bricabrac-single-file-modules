(function() {
  'use strict';
  var UNSTABLE_BENCHMARK_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_BENCHMARK_BRICS = {
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
  Object.assign(module.exports, UNSTABLE_BENCHMARK_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLWZhc3QtbGluZXJlYWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsd0JBQUE7Ozs7O0VBS0Esd0JBQUEsR0FJRSxDQUFBOzs7SUFBQSx1QkFBQSxFQUF5QixRQUFBLENBQUEsQ0FBQTtBQUMzQixVQUFBLEVBQUEsRUFBQSxPQUFBLEVBQUEsRUFBQSxFQUFBLFNBQUEsRUFBQSwyQkFBQSxFQUFBO01BQUksRUFBQSxHQUFNLE9BQUEsQ0FBUSxTQUFSO01BQ04sRUFBQSxHQUFNLElBQUksQ0FBQyxXQUFMLENBQWlCLENBQWpCLEVBRFY7O01BSUksU0FBQSxHQUNFO1FBQUEsK0JBQUEsRUFDRTtVQUFBLFVBQUEsRUFBZ0IsRUFBQSxHQUFLO1FBQXJCO01BREYsRUFMTjs7TUFTSSwyQkFBQSxHQUE4QixTQUFBLENBQUUsSUFBRixFQUFRLEdBQVIsQ0FBQTtBQUNsQyxZQUFBLE1BQUEsRUFBQSxVQUFBLEVBQUEsUUFBQSxFQUFBLFVBQUEsRUFBQSxFQUFBOzs7UUFFTSxDQUFBLENBQUUsVUFBRixDQUFBLEdBQWtCLENBQUUsR0FBQSxTQUFTLENBQUMsK0JBQVosRUFBZ0QsR0FBQSxHQUFoRCxDQUFsQjtRQUNBLEVBQUEsR0FBa0IsRUFBRSxDQUFDLFFBQUgsQ0FBWSxJQUFaO1FBQ2xCLFFBQUEsR0FBa0I7QUFDbEIsZUFBQSxJQUFBO1VBQ0UsTUFBQSxHQUFjLE1BQU0sQ0FBQyxLQUFQLENBQWEsVUFBYjtVQUNkLFVBQUEsR0FBYyxFQUFFLENBQUMsUUFBSCxDQUFZLEVBQVosRUFBZ0IsTUFBaEIsRUFBd0IsQ0FBeEIsRUFBMkIsVUFBM0IsRUFBdUMsUUFBdkM7VUFDZCxJQUFTLFVBQUEsS0FBYyxDQUF2QjtBQUFBLGtCQUFBOztVQUNBLElBQStDLFVBQUEsR0FBYSxVQUE1RDtZQUFBLE1BQUEsR0FBYyxNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFoQixFQUFtQixVQUFuQixFQUFkOztVQUNBLE1BQU0sQ0FBQSxDQUFFLE1BQUYsRUFBVSxRQUFWLENBQUE7VUFDTixRQUFBLElBQWM7UUFOaEI7QUFPQSxlQUFPO01BYnFCLEVBVGxDOztNQXlCSSx5QkFBQSxHQUE0QixTQUFBLENBQUUsSUFBRixDQUFBO0FBQ2hDLFlBQUEsTUFBQSxFQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLFNBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLENBQUE7O1FBQ00sU0FBQSxHQUFjO1FBQ2QsR0FBQSxHQUFjO1FBQ2QsR0FBQSxHQUFjLEVBSHBCOztRQUtNLEtBQUEsc0NBQUE7V0FBSSxDQUFFLE1BQUYsRUFBVSxRQUFWO1VBQ0YsS0FBQSxHQUFRO1VBQ1IsSUFBQSxHQUFRO0FBQ1IsaUJBQU0sQ0FBRSxJQUFBLEdBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBZSxFQUFmLEVBQW1CLEtBQW5CLENBQVQsQ0FBQSxLQUF5QyxDQUFDLENBQWhEO1lBQ0UsSUFBRyxDQUFFLEtBQUEsS0FBUyxDQUFYLENBQUEsSUFBbUIsQ0FBRSxTQUFTLENBQUMsTUFBVixHQUFtQixDQUFyQixDQUF0QjtjQUNFLEdBQUE7Y0FDQSxNQUFNLENBQUE7Z0JBQUUsR0FBRjtnQkFBTyxJQUFBLEVBQVEsU0FBQSxHQUFZLE1BQU0sQ0FBQyxLQUFQLENBQWEsQ0FBYixFQUFnQixJQUFoQixDQUEzQjtnQkFBbUQ7Y0FBbkQsQ0FBQTtjQUNOLFNBQUEsR0FBWSxHQUhkO2FBQUEsTUFBQTtjQUtFLEdBQUE7Y0FDQSxNQUFNLENBQUE7Z0JBQUUsR0FBRjtnQkFBTyxJQUFBLEVBQVEsQ0FBRSxNQUFNLENBQUMsS0FBUCxDQUFhLEtBQWIsRUFBb0IsSUFBcEIsQ0FBRixDQUE0QixDQUFDLFFBQTdCLENBQXNDLE9BQXRDLENBQWY7Z0JBQWdFO2NBQWhFLENBQUEsRUFOUjs7WUFPQSxLQUFBLEdBQVEsSUFBQSxHQUFPO1VBUmpCO1VBU0EsU0FBQSxHQUFZLE1BQU0sQ0FBQyxLQUFQLENBQWEsS0FBYjtRQVpkLENBTE47O0FBbUJNLGVBQU87TUFwQm1CLEVBekJoQzs7QUFnREksYUFBTyxPQUFBLEdBQVUsQ0FBRSwyQkFBRixFQUErQix5QkFBL0I7SUFqRE07RUFBekIsRUFURjs7O0VBNkRBLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQThCLHdCQUE5QjtBQTdEQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiNcbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuVU5TVEFCTEVfQkVOQ0hNQVJLX0JSSUNTID1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9mYXN0X2xpbmVyZWFkZXI6IC0+XG4gICAgRlMgID0gcmVxdWlyZSAnbm9kZTpmcydcbiAgICBubCAgPSAnXFxuJy5jb2RlUG9pbnRBdCAwXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB0ZW1wbGF0ZXMgPVxuICAgICAgd2Fsa19idWZmZXJzX3dpdGhfcG9zaXRpb25zX2NmZzpcbiAgICAgICAgY2h1bmtfc2l6ZTogICAgIDE2ICogMTAyNFxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgd2Fsa19idWZmZXJzX3dpdGhfcG9zaXRpb25zID0gKCBwYXRoLCBjZmcgKSAtPlxuICAgICAgIyBILnR5cGVzLnZhbGlkYXRlLmd1eV9mc193YWxrX2J1ZmZlcnNfY2ZnICggY2ZnID0geyBkZWZhdWx0cy5ndXlfZnNfd2Fsa19idWZmZXJzX2NmZy4uLiwgY2ZnLi4uLCB9IClcbiAgICAgICMgSC50eXBlcy52YWxpZGF0ZS5ub25lbXB0eV90ZXh0IHBhdGhcbiAgICAgIHsgY2h1bmtfc2l6ZSB9ICA9IHsgdGVtcGxhdGVzLndhbGtfYnVmZmVyc193aXRoX3Bvc2l0aW9uc19jZmcuLi4sIGNmZy4uLiwgfVxuICAgICAgZmQgICAgICAgICAgICAgID0gRlMub3BlblN5bmMgcGF0aFxuICAgICAgYnl0ZV9pZHggICAgICAgID0gMFxuICAgICAgbG9vcFxuICAgICAgICBidWZmZXIgICAgICA9IEJ1ZmZlci5hbGxvYyBjaHVua19zaXplXG4gICAgICAgIGJ5dGVfY291bnQgID0gRlMucmVhZFN5bmMgZmQsIGJ1ZmZlciwgMCwgY2h1bmtfc2l6ZSwgYnl0ZV9pZHhcbiAgICAgICAgYnJlYWsgaWYgYnl0ZV9jb3VudCBpcyAwXG4gICAgICAgIGJ1ZmZlciAgICAgID0gYnVmZmVyLnN1YmFycmF5IDAsIGJ5dGVfY291bnQgaWYgYnl0ZV9jb3VudCA8IGNodW5rX3NpemVcbiAgICAgICAgeWllbGQgeyBidWZmZXIsIGJ5dGVfaWR4LCB9XG4gICAgICAgIGJ5dGVfaWR4ICAgKz0gYnl0ZV9jb3VudFxuICAgICAgcmV0dXJuIG51bGxcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHdhbGtfbGluZXNfd2l0aF9wb3NpdGlvbnMgPSAoIHBhdGggKSAtPlxuICAgICAgIyBmcm9tIG1tb210Y2hldi9yZWFkY3N2L3JlYWRjc3YtYnVmZmVyZWQtb3B0LmpzXG4gICAgICByZW1haW5kZXIgICA9ICcnXG4gICAgICBlb2wgICAgICAgICA9ICdcXG4nXG4gICAgICBsbnIgICAgICAgICA9IDBcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGZvciB7IGJ1ZmZlciwgYnl0ZV9pZHgsIH0gZnJvbSB3YWxrX2J1ZmZlcnNfd2l0aF9wb3NpdGlvbnMgcGF0aFxuICAgICAgICBzdGFydCA9IDBcbiAgICAgICAgc3RvcCAgPSBudWxsXG4gICAgICAgIHdoaWxlICggc3RvcCA9IGJ1ZmZlci5pbmRleE9mIG5sLCBzdGFydCApIGlzbnQgLTFcbiAgICAgICAgICBpZiAoIHN0YXJ0ID09IDAgKSBhbmQgKCByZW1haW5kZXIubGVuZ3RoID4gMCApXG4gICAgICAgICAgICBsbnIrK1xuICAgICAgICAgICAgeWllbGQgeyBsbnIsIGxpbmU6ICggcmVtYWluZGVyICsgYnVmZmVyLnNsaWNlIDAsIHN0b3AgKSwgZW9sLCB9XG4gICAgICAgICAgICByZW1haW5kZXIgPSAnJ1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxucisrXG4gICAgICAgICAgICB5aWVsZCB7IGxuciwgbGluZTogKCAoIGJ1ZmZlci5zbGljZSBzdGFydCwgc3RvcCApLnRvU3RyaW5nICd1dGYtOCcgKSwgZW9sLCB9XG4gICAgICAgICAgc3RhcnQgPSBzdG9wICsgMVxuICAgICAgICByZW1haW5kZXIgPSBidWZmZXIuc2xpY2Ugc3RhcnRcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHJldHVybiBudWxsXG5cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHJldHVybiBleHBvcnRzID0geyB3YWxrX2J1ZmZlcnNfd2l0aF9wb3NpdGlvbnMsIHdhbGtfbGluZXNfd2l0aF9wb3NpdGlvbnMsIH1cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBVTlNUQUJMRV9CRU5DSE1BUktfQlJJQ1NcblxuIl19
//# sourceURL=../src/unstable-fast-linereader.coffee