(function() {
  'use strict';
  var VARIOUS_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  VARIOUS_BRICS = {
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_list_tools: function() {
      var append, is_empty;
      append = function(list, ...P) {
        return list.splice(list.length, 0, ...P);
      };
      is_empty = function(list) {
        return list.length === 0;
      };
      return {append, is_empty};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_escape_html_text: function() {
      var escape_html_text;
      escape_html_text = function(text) {
        var R;
        R = text;
        R = R.replace(/&/g, '&amp;');
        R = R.replace(/</g, '&lt;');
        R = R.replace(/>/g, '&gt;');
        return R;
      };
      return {escape_html_text};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_tagfun_tools: function() {
      var is_tagfun_call, walk_nonempty_parts, walk_parts, walk_raw_nonempty_parts, walk_raw_parts;
      // ### Given the arguments of either a tagged template function call ('tagfun call') or the single
      // argument of a conventional function call, `get_first_argument()` will return either

      // * the result of applying `as_text()` to the sole argument, or

      // * the result of concatenating the constant parts and the interpolated expressions, which each
      // expression replaced by the result of applying `as_text()` to it.

      // Another way to describe this behavior is to say that this function treats a conventional call with
      // a single expression the same way that it treats a funtag call with a string that contains nothing but
      // that same expression, so the invariant `( get_first_argument exp ) == ( get_first_argument"#{ exp }"
      // )` holds.

      // * intended for string producers, text processing, markup production;
      // * list some examples. ###

      // #---------------------------------------------------------------------------------------------------------
      // create_get_first_argument_fn = ( as_text = null ) ->
      //   as_text ?= ( expression ) -> "#{expression}"
      //   ### TAINT use proper validation ###
      //   unless ( typeof as_text ) is 'function'
      //     throw new Error "Ωidsp___1 expected a function, got #{rpr as_text}"
      //   #-------------------------------------------------------------------------------------------------------
      //   get_first_argument = ( P... ) ->
      //     unless is_tagfun_call P...
      //       unless P.length is 1
      //         throw new Error "Ωidsp___2 expected 1 argument, got #{P.length}"
      //       return as_text P[ 0 ]
      //     #.....................................................................................................
      //     [ parts, expressions..., ] = P
      //     R = parts[ 0 ]
      //     for expression, idx in expressions
      //       R += ( as_text expression ) + parts[ idx + 1 ]
      //     return R
      //   #-------------------------------------------------------------------------------------------------------
      //   get_first_argument.create = create_get_first_argument_fn
      //   return get_first_argument

      //---------------------------------------------------------------------------------------------------------
      is_tagfun_call = function(...P) {
        if (!Array.isArray(P[0])) {
          return false;
        }
        if (!Object.isFrozen(P[0])) {
          return false;
        }
        if (P[0].raw == null) {
          return false;
        }
        return true;
      };
      //---------------------------------------------------------------------------------------------------------
      walk_raw_parts = function*(chunks, ...values) {
        var chunk;
        chunks = (function() {
          var i, len, ref, results;
          ref = chunks.raw;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            chunk = ref[i];
            results.push(chunk);
          }
          return results;
        })();
        chunks.raw = chunks.slice(0);
        Object.freeze(chunks);
        return (yield* walk_parts(chunks, ...values));
      };
      //---------------------------------------------------------------------------------------------------------
      walk_parts = function*(chunks, ...values) {
        var i, idx, len, value;
        if (!is_tagfun_call(chunks, ...values)) {
          if (values.length !== 0) {
            throw new Error(`Ω___3 expected 1 argument in non-template call, got ${arguments.length}`);
          }
          if (typeof chunks === 'string') {
            [chunks, values] = [[chunks], []];
          } else {
            [chunks, values] = [['', ''], [chunks]];
          }
        }
        yield ({
          //.......................................................................................................
          chunk: chunks[0],
          isa: 'chunk'
        });
        for (idx = i = 0, len = values.length; i < len; idx = ++i) {
          value = values[idx];
          yield ({
            value,
            isa: 'value'
          });
          yield ({
            chunk: chunks[idx + 1],
            isa: 'chunk'
          });
        }
        //.......................................................................................................
        return null;
      };
      //---------------------------------------------------------------------------------------------------------
      walk_raw_nonempty_parts = function*(chunks, ...values) {
        var part;
        for (part of walk_raw_parts(chunks, ...values)) {
          if (!((part.chunk === '') || (part.value === ''))) {
            yield part;
          }
        }
        return null;
      };
      //---------------------------------------------------------------------------------------------------------
      walk_nonempty_parts = function*(chunks, ...values) {
        var part;
        for (part of walk_parts(chunks, ...values)) {
          if (!((part.chunk === '') || (part.value === ''))) {
            yield part;
          }
        }
        return null;
      };
      //---------------------------------------------------------------------------------------------------------
      // return do exports = ( get_first_argument = create_get_first_argument_fn() ) -> {
      //   get_first_argument, is_tagfun_call,
      //   walk_parts, walk_nonempty_parts, walk_raw_parts, walk_raw_nonempty_parts, }
      return {is_tagfun_call, walk_parts, walk_raw_parts, walk_nonempty_parts, walk_raw_nonempty_parts};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_managed_property_tools: function() {
      var hide, set_getter;
      set_getter = function(object, name, get) {
        return Object.defineProperties(object, {
          [name]: {get}
        });
      };
      hide = (object, name, value) => {
        return Object.defineProperty(object, name, {
          enumerable: false,
          writable: true,
          configurable: true,
          value: value
        });
      };
      //---------------------------------------------------------------------------------------------------------
      return {set_getter, hide};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_nameit: function() {
      var nameit;
      nameit = function(name, fn) {
        Object.defineProperty(fn, 'name', {
          value: name
        });
        return fn;
      };
      //---------------------------------------------------------------------------------------------------------
      return {nameit};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_stack_classes: function() {
      var Stack, XXX_Stack_error, hide, misfit, set_getter;
      ({set_getter, hide} = VARIOUS_BRICS.require_managed_property_tools());
      misfit = Symbol('misfit');
      XXX_Stack_error = class XXX_Stack_error extends Error {};
      Stack = (function() {
        //===========================================================================================================
        class Stack {
          //---------------------------------------------------------------------------------------------------------
          constructor() {
            this.data = [];
            return void 0;
          }

          //---------------------------------------------------------------------------------------------------------
          toString() {
            var e;
            return `[${((function() {
              var i, len, ref, results;
              ref = this.data;
              results = [];
              for (i = 0, len = ref.length; i < len; i++) {
                e = ref[i];
                results.push(`${e}`);
              }
              return results;
            }).call(this)).join`.`}]`;
          }

          clear() {
            this.data.length = 0;
            return null;
          }

          * [Symbol.iterator]() {
            return (yield* this.data);
          }

          //---------------------------------------------------------------------------------------------------------
          push(x) {
            this.data.push(x);
            return null;
          }

          unshift(x) {
            this.data.unshift(x);
            return null;
          }

          //---------------------------------------------------------------------------------------------------------
          pop(fallback = misfit) {
            if (this.is_empty) {
              if (fallback !== misfit) {
                return fallback;
              }
              throw new XXX_Stack_error("Ωidsp___4 unable to pop value from empty stack");
            }
            return this.data.pop();
          }

          //---------------------------------------------------------------------------------------------------------
          shift(fallback = misfit) {
            if (this.is_empty) {
              if (fallback !== misfit) {
                return fallback;
              }
              throw new XXX_Stack_error("Ωidsp___5 unable to shift value from empty stack");
            }
            return this.data.shift();
          }

          //---------------------------------------------------------------------------------------------------------
          peek(fallback = misfit) {
            if (this.is_empty) {
              if (fallback !== misfit) {
                return fallback;
              }
              throw new XXX_Stack_error("Ωidsp___6 unable to peek value of empty stack");
            }
            return this.data.at(-1);
          }

        };

        //---------------------------------------------------------------------------------------------------------
        set_getter(Stack.prototype, 'length', function() {
          return this.data.length;
        });

        set_getter(Stack.prototype, 'is_empty', function() {
          return this.data.length === 0;
        });

        return Stack;

      }).call(this);
      //-----------------------------------------------------------------------------------------------------------
      return {Stack};
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_infiniproxy: function() {
      /*

      ## To Do

      * **`[—]`** allow to set context to be used by `apply()`
      * **`[—]`** allow to call `sys.stack.clear()` manually where seen fit

       */
      /* TAINT in this simulation of single-file modules, a new distinct symbol is produced with each call to
         `require_infiniproxy()` */
      var Stack, create_infinyproxy, hide, sys_symbol, template;
      ({hide} = VARIOUS_BRICS.require_managed_property_tools());
      ({Stack} = VARIOUS_BRICS.require_stack_classes());
      sys_symbol = Symbol('sys');
      // misfit                  = Symbol 'misfit'
      template = {
        /* An object that will be checked for existing properties to return; when no provider is given or a
             provider lacks a requested property, `sys.sub_level_proxy` will be returned for property accesses: */
        provider: Object.create(null),
        /* A function to be called when the proxy (either `sys.top_level_proxy` or `sys.sub_level_proxy`) is
             called; notice that if the `provider` provides a method for a given key, that method will be called
             instead of the `callee`: */
        callee: null
      };
      //=========================================================================================================
      create_infinyproxy = function(cfg) {
        var new_proxy, sys;
        cfg = {...template, ...cfg};
        //.......................................................................................................
        new_proxy = function({is_top_level}) {
          var R, callee_ctx, get_ctx;
          callee_ctx = null;
          get_ctx = function() {
            return callee_ctx != null ? callee_ctx : callee_ctx = {is_top_level, ...cfg, ...sys};
          };
          //.....................................................................................................
          R = new Proxy(cfg.callee, {
            //-----------------------------------------------------------------------------------------------------
            apply: function(target, key, P) {
              // urge 'Ωbrcs___7', "apply #{rpr { target, key, P, is_top_level, }}"
              R = Reflect.apply(target, get_ctx(), P);
              sys.stack.clear();
              return R;
            },
            //-----------------------------------------------------------------------------------------------------
            get: function(target, key) {
              if (key === sys_symbol) {
                // urge 'Ωbrcs___8', "get #{rpr { target, key, }}"
                return get_ctx();
              }
              if ((typeof key) === 'symbol') {
                return target[key];
              }
              if (Reflect.has(cfg.provider, key)) {
                return Reflect.get(cfg.provider, key);
              }
              if (is_top_level) {
                sys.stack.clear();
              }
              sys.stack.push(key);
              // return "[result for getting non-preset key #{rpr key}] from #{rpr provider}"
              return sys.sub_level_proxy;
            }
          });
          //.....................................................................................................
          return R;
        };
        //.......................................................................................................
        sys = {
          stack: new Stack()
        };
        sys.top_level_proxy = new_proxy({
          is_top_level: true
        });
        sys.sub_level_proxy = new_proxy({
          is_top_level: false
        });
        //.......................................................................................................
        return sys.top_level_proxy;
      };
      //---------------------------------------------------------------------------------------------------------
      return {create_infinyproxy, sys_symbol};
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, VARIOUS_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3ZhcmlvdXMtYnJpY3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQUE7QUFBQSxNQUFBLGFBQUE7Ozs7O0VBS0EsYUFBQSxHQUlFLENBQUE7OztJQUFBLGtCQUFBLEVBQW9CLFFBQUEsQ0FBQSxDQUFBO0FBQ3RCLFVBQUEsTUFBQSxFQUFBO01BQUksTUFBQSxHQUFZLFFBQUEsQ0FBRSxJQUFGLEVBQUEsR0FBUSxDQUFSLENBQUE7ZUFBa0IsSUFBSSxDQUFDLE1BQUwsQ0FBWSxJQUFJLENBQUMsTUFBakIsRUFBeUIsQ0FBekIsRUFBNEIsR0FBQSxDQUE1QjtNQUFsQjtNQUNaLFFBQUEsR0FBWSxRQUFBLENBQUUsSUFBRixDQUFBO2VBQVksSUFBSSxDQUFDLE1BQUwsS0FBZTtNQUEzQjtBQUNaLGFBQU8sQ0FBRSxNQUFGLEVBQVUsUUFBVjtJQUhXLENBQXBCOzs7SUFPQSx3QkFBQSxFQUEwQixRQUFBLENBQUEsQ0FBQTtBQUM1QixVQUFBO01BQUksZ0JBQUEsR0FBbUIsUUFBQSxDQUFFLElBQUYsQ0FBQTtBQUN2QixZQUFBO1FBQU0sQ0FBQSxHQUFJO1FBQ0osQ0FBQSxHQUFJLENBQUMsQ0FBQyxPQUFGLENBQVUsSUFBVixFQUFnQixPQUFoQjtRQUNKLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixDQUFVLElBQVYsRUFBZ0IsTUFBaEI7UUFDSixDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLE1BQWhCO0FBQ0osZUFBTztNQUxVO0FBTW5CLGFBQU8sQ0FBRSxnQkFBRjtJQVBpQixDQVAxQjs7O0lBa0JBLG9CQUFBLEVBQXNCLFFBQUEsQ0FBQSxDQUFBO0FBRXhCLFVBQUEsY0FBQSxFQUFBLG1CQUFBLEVBQUEsVUFBQSxFQUFBLHVCQUFBLEVBQUEsY0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXVDSSxjQUFBLEdB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QUFPWSxxQkFBTyxHQUFHLENBQUM7WUFSUjtVQVJMLENBSEUsRUFIWjs7QUF3QlEsaUJBQU87UUF6QkcsRUFIbEI7O1FBOEJNLEdBQUEsR0FBTTtVQUFFLEtBQUEsRUFBTyxJQUFJLEtBQUosQ0FBQTtRQUFUO1FBQ04sR0FBRyxDQUFDLGVBQUosR0FBc0IsU0FBQSxDQUFVO1VBQUUsWUFBQSxFQUFjO1FBQWhCLENBQVY7UUFDdEIsR0FBRyxDQUFDLGVBQUosR0FBc0IsU0FBQSxDQUFVO1VBQUUsWUFBQSxFQUFjO1FBQWhCLENBQVYsRUFoQzVCOztBQWtDTSxlQUFPLEdBQUcsQ0FBQztNQW5DUSxFQXhCekI7O0FBOERJLGFBQU8sQ0FBRSxrQkFBRixFQUFzQixVQUF0QjtJQS9EWTtFQXhMckIsRUFURjs7O0VBb1FBLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBTSxDQUFDLE9BQXJCLEVBQThCLGFBQTlCO0FBcFFBIiwic291cmNlc0NvbnRlbnQiOlsiXG4ndXNlIHN0cmljdCdcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblZBUklPVVNfQlJJQ1MgPVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2xpc3RfdG9vbHM6IC0+XG4gICAgYXBwZW5kICAgID0gKCBsaXN0LCBQLi4uICkgLT4gbGlzdC5zcGxpY2UgbGlzdC5sZW5ndGgsIDAsIFAuLi5cbiAgICBpc19lbXB0eSAgPSAoIGxpc3QgKSAtPiBsaXN0Lmxlbmd0aCBpcyAwXG4gICAgcmV0dXJuIHsgYXBwZW5kLCBpc19lbXB0eSwgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX2VzY2FwZV9odG1sX3RleHQ6IC0+XG4gICAgZXNjYXBlX2h0bWxfdGV4dCA9ICggdGV4dCApIC0+XG4gICAgICBSID0gdGV4dFxuICAgICAgUiA9IFIucmVwbGFjZSAvJi9nLCAnJmFtcDsnXG4gICAgICBSID0gUi5yZXBsYWNlIC88L2csICcmbHQ7J1xuICAgICAgUiA9IFIucmVwbGFjZSAvPi9nLCAnJmd0OydcbiAgICAgIHJldHVybiBSXG4gICAgcmV0dXJuIHsgZXNjYXBlX2h0bWxfdGV4dCwgfVxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX3RhZ2Z1bl90b29sczogLT5cblxuICAgICMgIyMjIEdpdmVuIHRoZSBhcmd1bWVudHMgb2YgZWl0aGVyIGEgdGFnZ2VkIHRlbXBsYXRlIGZ1bmN0aW9uIGNhbGwgKCd0YWdmdW4gY2FsbCcpIG9yIHRoZSBzaW5nbGVcbiAgICAjIGFyZ3VtZW50IG9mIGEgY29udmVudGlvbmFsIGZ1bmN0aW9uIGNhbGwsIGBnZXRfZmlyc3RfYXJndW1lbnQoKWAgd2lsbCByZXR1cm4gZWl0aGVyXG5cbiAgICAjICogdGhlIHJlc3VsdCBvZiBhcHBseWluZyBgYXNfdGV4dCgpYCB0byB0aGUgc29sZSBhcmd1bWVudCwgb3JcblxuICAgICMgKiB0aGUgcmVzdWx0IG9mIGNvbmNhdGVuYXRpbmcgdGhlIGNvbnN0YW50IHBhcnRzIGFuZCB0aGUgaW50ZXJwb2xhdGVkIGV4cHJlc3Npb25zLCB3aGljaCBlYWNoXG4gICAgIyBleHByZXNzaW9uIHJlcGxhY2VkIGJ5IHRoZSByZXN1bHQgb2YgYXBwbHlpbmcgYGFzX3RleHQoKWAgdG8gaXQuXG5cbiAgICAjIEFub3RoZXIgd2F5IHRvIGRlc2NyaWJlIHRoaXMgYmVoYXZpb3IgaXMgdG8gc2F5IHRoYXQgdGhpcyBmdW5jdGlvbiB0cmVhdHMgYSBjb252ZW50aW9uYWwgY2FsbCB3aXRoXG4gICAgIyBhIHNpbmdsZSBleHByZXNzaW9uIHRoZSBzYW1lIHdheSB0aGF0IGl0IHRyZWF0cyBhIGZ1bnRhZyBjYWxsIHdpdGggYSBzdHJpbmcgdGhhdCBjb250YWlucyBub3RoaW5nIGJ1dFxuICAgICMgdGhhdCBzYW1lIGV4cHJlc3Npb24sIHNvIHRoZSBpbnZhcmlhbnQgYCggZ2V0X2ZpcnN0X2FyZ3VtZW50IGV4cCApID09ICggZ2V0X2ZpcnN0X2FyZ3VtZW50XCIjeyBleHAgfVwiXG4gICAgIyApYCBob2xkcy5cblxuICAgICMgKiBpbnRlbmRlZCBmb3Igc3RyaW5nIHByb2R1Y2VycywgdGV4dCBwcm9jZXNzaW5nLCBtYXJrdXAgcHJvZHVjdGlvbjtcbiAgICAjICogbGlzdCBzb21lIGV4YW1wbGVzLiAjIyNcblxuICAgICMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMgY3JlYXRlX2dldF9maXJzdF9hcmd1bWVudF9mbiA9ICggYXNfdGV4dCA9IG51bGwgKSAtPlxuICAgICMgICBhc190ZXh0ID89ICggZXhwcmVzc2lvbiApIC0+IFwiI3tleHByZXNzaW9ufVwiXG4gICAgIyAgICMjIyBUQUlOVCB1c2UgcHJvcGVyIHZhbGlkYXRpb24gIyMjXG4gICAgIyAgIHVubGVzcyAoIHR5cGVvZiBhc190ZXh0ICkgaXMgJ2Z1bmN0aW9uJ1xuICAgICMgICAgIHRocm93IG5ldyBFcnJvciBcIs6paWRzcF9fXzEgZXhwZWN0ZWQgYSBmdW5jdGlvbiwgZ290ICN7cnByIGFzX3RleHR9XCJcbiAgICAjICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjICAgZ2V0X2ZpcnN0X2FyZ3VtZW50ID0gKCBQLi4uICkgLT5cbiAgICAjICAgICB1bmxlc3MgaXNfdGFnZnVuX2NhbGwgUC4uLlxuICAgICMgICAgICAgdW5sZXNzIFAubGVuZ3RoIGlzIDFcbiAgICAjICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlpZHNwX19fMiBleHBlY3RlZCAxIGFyZ3VtZW50LCBnb3QgI3tQLmxlbmd0aH1cIlxuICAgICMgICAgICAgcmV0dXJuIGFzX3RleHQgUFsgMCBdXG4gICAgIyAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgIyAgICAgWyBwYXJ0cywgZXhwcmVzc2lvbnMuLi4sIF0gPSBQXG4gICAgIyAgICAgUiA9IHBhcnRzWyAwIF1cbiAgICAjICAgICBmb3IgZXhwcmVzc2lvbiwgaWR4IGluIGV4cHJlc3Npb25zXG4gICAgIyAgICAgICBSICs9ICggYXNfdGV4dCBleHByZXNzaW9uICkgKyBwYXJ0c1sgaWR4ICsgMSBdXG4gICAgIyAgICAgcmV0dXJuIFJcbiAgICAjICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjICAgZ2V0X2ZpcnN0X2FyZ3VtZW50LmNyZWF0ZSA9IGNyZWF0ZV9nZXRfZmlyc3RfYXJndW1lbnRfZm5cbiAgICAjICAgcmV0dXJuIGdldF9maXJzdF9hcmd1bWVudFxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGlzX3RhZ2Z1bl9jYWxsID0gKCBQLi4uICkgLT5cbiAgICAgIHJldHVybiBmYWxzZSB1bmxlc3MgQXJyYXkuaXNBcnJheSAgIFBbIDAgXVxuICAgICAgcmV0dXJuIGZhbHNlIHVubGVzcyBPYmplY3QuaXNGcm96ZW4gUFsgMCBdXG4gICAgICByZXR1cm4gZmFsc2UgdW5sZXNzIFBbIDAgXS5yYXc/XG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHdhbGtfcmF3X3BhcnRzID0gKCBjaHVua3MsIHZhbHVlcy4uLiApIC0+XG4gICAgICBjaHVua3MgICAgICA9ICggY2h1bmsgZm9yIGNodW5rIGluIGNodW5rcy5yYXcgKVxuICAgICAgY2h1bmtzLnJhdyAgPSBjaHVua3NbIC4uLiBdXG4gICAgICBPYmplY3QuZnJlZXplIGNodW5rc1xuICAgICAgeWllbGQgZnJvbSB3YWxrX3BhcnRzIGNodW5rcywgdmFsdWVzLi4uXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgd2Fsa19wYXJ0cyA9ICggY2h1bmtzLCB2YWx1ZXMuLi4gKSAtPlxuICAgICAgdW5sZXNzIGlzX3RhZ2Z1bl9jYWxsIGNodW5rcywgdmFsdWVzLi4uXG4gICAgICAgIGlmIHZhbHVlcy5sZW5ndGggaXNudCAwXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwizqlfX18zIGV4cGVjdGVkIDEgYXJndW1lbnQgaW4gbm9uLXRlbXBsYXRlIGNhbGwsIGdvdCAje2FyZ3VtZW50cy5sZW5ndGh9XCJcbiAgICAgICAgaWYgdHlwZW9mIGNodW5rcyBpcyAnc3RyaW5nJyB0aGVuIFsgY2h1bmtzLCB2YWx1ZXMsIF0gPSBbIFsgY2h1bmtzLCBdLCBbXSwgICAgICAgICAgXVxuICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWyBjaHVua3MsIHZhbHVlcywgXSA9IFsgWyAnJywgJycsIF0sIFsgY2h1bmtzLCBdLCBdXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgeWllbGQgeyBjaHVuazogY2h1bmtzWyAwIF0sIGlzYTogJ2NodW5rJywgfVxuICAgICAgZm9yIHZhbHVlLCBpZHggaW4gdmFsdWVzXG4gICAgICAgIHlpZWxkIHsgdmFsdWUsIGlzYTogJ3ZhbHVlJywgfVxuICAgICAgICB5aWVsZCB7IGNodW5rOiBjaHVua3NbIGlkeCArIDEgXSwgaXNhOiAnY2h1bmsnLCB9XG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgcmV0dXJuIG51bGxcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB3YWxrX3Jhd19ub25lbXB0eV9wYXJ0cyA9ICggY2h1bmtzLCB2YWx1ZXMuLi4gKSAtPlxuICAgICAgZm9yIHBhcnQgZnJvbSB3YWxrX3Jhd19wYXJ0cyBjaHVua3MsIHZhbHVlcy4uLlxuICAgICAgICB5aWVsZCBwYXJ0IHVubGVzcyAoIHBhcnQuY2h1bmsgaXMgJycgKSBvciAoIHBhcnQudmFsdWUgaXMgJycgKVxuICAgICAgcmV0dXJuIG51bGxcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB3YWxrX25vbmVtcHR5X3BhcnRzID0gKCBjaHVua3MsIHZhbHVlcy4uLiApIC0+XG4gICAgICBmb3IgcGFydCBmcm9tIHdhbGtfcGFydHMgY2h1bmtzLCB2YWx1ZXMuLi5cbiAgICAgICAgeWllbGQgcGFydCB1bmxlc3MgKCBwYXJ0LmNodW5rIGlzICcnICkgb3IgKCBwYXJ0LnZhbHVlIGlzICcnIClcbiAgICAgIHJldHVybiBudWxsXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyByZXR1cm4gZG8gZXhwb3J0cyA9ICggZ2V0X2ZpcnN0X2FyZ3VtZW50ID0gY3JlYXRlX2dldF9maXJzdF9hcmd1bWVudF9mbigpICkgLT4ge1xuICAgICMgICBnZXRfZmlyc3RfYXJndW1lbnQsIGlzX3RhZ2Z1bl9jYWxsLFxuICAgICMgICB3YWxrX3BhcnRzLCB3YWxrX25vbmVtcHR5X3BhcnRzLCB3YWxrX3Jhd19wYXJ0cywgd2Fsa19yYXdfbm9uZW1wdHlfcGFydHMsIH1cbiAgICByZXR1cm4ge1xuICAgICAgaXNfdGFnZnVuX2NhbGwsXG4gICAgICB3YWxrX3BhcnRzLCAgICAgICAgICAgd2Fsa19yYXdfcGFydHMsXG4gICAgICB3YWxrX25vbmVtcHR5X3BhcnRzLCAgd2Fsa19yYXdfbm9uZW1wdHlfcGFydHMsIH1cblxuXG4gICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIyMgTk9URSBGdXR1cmUgU2luZ2xlLUZpbGUgTW9kdWxlICMjI1xuICByZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHM6IC0+XG4gICAgc2V0X2dldHRlciA9ICggb2JqZWN0LCBuYW1lLCBnZXQgKSAtPiBPYmplY3QuZGVmaW5lUHJvcGVydGllcyBvYmplY3QsIHsgW25hbWVdOiB7IGdldCwgfSwgfVxuICAgIGhpZGUgPSAoIG9iamVjdCwgbmFtZSwgdmFsdWUgKSA9PiBPYmplY3QuZGVmaW5lUHJvcGVydHkgb2JqZWN0LCBuYW1lLFxuICAgICAgICBlbnVtZXJhYmxlOiAgIGZhbHNlXG4gICAgICAgIHdyaXRhYmxlOiAgICAgdHJ1ZVxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgdmFsdWU6ICAgICAgICB2YWx1ZVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJldHVybiB7IHNldF9nZXR0ZXIsIGhpZGUsIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9uYW1laXQ6IC0+XG4gICAgbmFtZWl0ID0gKCBuYW1lLCBmbiApIC0+IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBmbiwgJ25hbWUnLCB7IHZhbHVlOiBuYW1lLCB9OyBmblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXR1cm4geyBuYW1laXQsIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9zdGFja19jbGFzc2VzOiAtPlxuICAgIHsgc2V0X2dldHRlcixcbiAgICAgIGhpZGUsICAgICAgIH0gPSBWQVJJT1VTX0JSSUNTLnJlcXVpcmVfbWFuYWdlZF9wcm9wZXJ0eV90b29scygpXG4gICAgbWlzZml0ICAgICAgICAgID0gU3ltYm9sICdtaXNmaXQnXG4gICAgY2xhc3MgWFhYX1N0YWNrX2Vycm9yIGV4dGVuZHMgRXJyb3JcblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNsYXNzIFN0YWNrXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBAZGF0YSA9IFtdXG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgdG9TdHJpbmc6IC0+IFwiWyN7ICggXCIje2V9XCIgZm9yIGUgaW4gQGRhdGEgKS5qb2luJy4nIH1dXCJcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgc2V0X2dldHRlciBAOjosICdsZW5ndGgnLCAgIC0+IEBkYXRhLmxlbmd0aFxuICAgICAgc2V0X2dldHRlciBAOjosICdpc19lbXB0eScsIC0+IEBkYXRhLmxlbmd0aCBpcyAwXG4gICAgICBjbGVhcjogLT4gQGRhdGEubGVuZ3RoID0gMDsgbnVsbFxuICAgICAgW1N5bWJvbC5pdGVyYXRvcl06IC0+IHlpZWxkIGZyb20gQGRhdGFcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcHVzaDogICAgICggeCApIC0+IEBkYXRhLnB1c2ggeDsgICAgbnVsbFxuICAgICAgdW5zaGlmdDogICggeCApIC0+IEBkYXRhLnVuc2hpZnQgeDsgbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBwb3A6ICggZmFsbGJhY2sgPSBtaXNmaXQgKSAtPlxuICAgICAgICBpZiBAaXNfZW1wdHlcbiAgICAgICAgICByZXR1cm4gZmFsbGJhY2sgdW5sZXNzIGZhbGxiYWNrIGlzIG1pc2ZpdFxuICAgICAgICAgIHRocm93IG5ldyBYWFhfU3RhY2tfZXJyb3IgXCLOqWlkc3BfX180IHVuYWJsZSB0byBwb3AgdmFsdWUgZnJvbSBlbXB0eSBzdGFja1wiXG4gICAgICAgIHJldHVybiBAZGF0YS5wb3AoKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBzaGlmdDogKCBmYWxsYmFjayA9IG1pc2ZpdCApIC0+XG4gICAgICAgIGlmIEBpc19lbXB0eVxuICAgICAgICAgIHJldHVybiBmYWxsYmFjayB1bmxlc3MgZmFsbGJhY2sgaXMgbWlzZml0XG4gICAgICAgICAgdGhyb3cgbmV3IFhYWF9TdGFja19lcnJvciBcIs6paWRzcF9fXzUgdW5hYmxlIHRvIHNoaWZ0IHZhbHVlIGZyb20gZW1wdHkgc3RhY2tcIlxuICAgICAgICByZXR1cm4gQGRhdGEuc2hpZnQoKVxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBwZWVrOiAoIGZhbGxiYWNrID0gbWlzZml0ICkgLT5cbiAgICAgICAgaWYgQGlzX2VtcHR5XG4gICAgICAgICAgcmV0dXJuIGZhbGxiYWNrIHVubGVzcyBmYWxsYmFjayBpcyBtaXNmaXRcbiAgICAgICAgICB0aHJvdyBuZXcgWFhYX1N0YWNrX2Vycm9yIFwizqlpZHNwX19fNiB1bmFibGUgdG8gcGVlayB2YWx1ZSBvZiBlbXB0eSBzdGFja1wiXG4gICAgICAgIHJldHVybiBAZGF0YS5hdCAtMVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgcmV0dXJuIHsgU3RhY2ssIH1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV9pbmZpbmlwcm94eTogLT5cbiAgICAjIyNcblxuICAgICMjIFRvIERvXG5cbiAgICAqICoqYFvigJRdYCoqIGFsbG93IHRvIHNldCBjb250ZXh0IHRvIGJlIHVzZWQgYnkgYGFwcGx5KClgXG4gICAgKiAqKmBb4oCUXWAqKiBhbGxvdyB0byBjYWxsIGBzeXMuc3RhY2suY2xlYXIoKWAgbWFudWFsbHkgd2hlcmUgc2VlbiBmaXRcblxuICAgICMjI1xuICAgIHsgaGlkZSwgICAgICAgICAgICAgICB9ID0gVkFSSU9VU19CUklDUy5yZXF1aXJlX21hbmFnZWRfcHJvcGVydHlfdG9vbHMoKVxuICAgIHsgU3RhY2ssICAgICAgICAgICAgICB9ID0gVkFSSU9VU19CUklDUy5yZXF1aXJlX3N0YWNrX2NsYXNzZXMoKVxuICAgICMjIyBUQUlOVCBpbiB0aGlzIHNpbXVsYXRpb24gb2Ygc2luZ2xlLWZpbGUgbW9kdWxlcywgYSBuZXcgZGlzdGluY3Qgc3ltYm9sIGlzIHByb2R1Y2VkIHdpdGggZWFjaCBjYWxsIHRvXG4gICAgYHJlcXVpcmVfaW5maW5pcHJveHkoKWAgIyMjXG4gICAgc3lzX3N5bWJvbCAgICAgICAgICAgICAgPSBTeW1ib2wgJ3N5cydcbiAgICAjIG1pc2ZpdCAgICAgICAgICAgICAgICAgID0gU3ltYm9sICdtaXNmaXQnXG4gICAgdGVtcGxhdGUgICAgICAgICAgICAgICAgPVxuICAgICAgIyMjIEFuIG9iamVjdCB0aGF0IHdpbGwgYmUgY2hlY2tlZCBmb3IgZXhpc3RpbmcgcHJvcGVydGllcyB0byByZXR1cm47IHdoZW4gbm8gcHJvdmlkZXIgaXMgZ2l2ZW4gb3IgYVxuICAgICAgcHJvdmlkZXIgbGFja3MgYSByZXF1ZXN0ZWQgcHJvcGVydHksIGBzeXMuc3ViX2xldmVsX3Byb3h5YCB3aWxsIGJlIHJldHVybmVkIGZvciBwcm9wZXJ0eSBhY2Nlc3NlczogIyMjXG4gICAgICBwcm92aWRlcjogICAgIE9iamVjdC5jcmVhdGUgbnVsbFxuICAgICAgIyMjIEEgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIHByb3h5IChlaXRoZXIgYHN5cy50b3BfbGV2ZWxfcHJveHlgIG9yIGBzeXMuc3ViX2xldmVsX3Byb3h5YCkgaXNcbiAgICAgIGNhbGxlZDsgbm90aWNlIHRoYXQgaWYgdGhlIGBwcm92aWRlcmAgcHJvdmlkZXMgYSBtZXRob2QgZm9yIGEgZ2l2ZW4ga2V5LCB0aGF0IG1ldGhvZCB3aWxsIGJlIGNhbGxlZFxuICAgICAgaW5zdGVhZCBvZiB0aGUgYGNhbGxlZWA6ICMjI1xuICAgICAgY2FsbGVlOiAgICAgICBudWxsXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY3JlYXRlX2luZmlueXByb3h5ID0gKCBjZmcgKSAtPlxuICAgICAgIyMjIFRBSU5UIHVzZSBwcm9wZXIgdHlwZWNoZWNraW5nICMjI1xuICAgICAgY2ZnID0geyB0ZW1wbGF0ZS4uLiwgIGNmZy4uLiwgfVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIG5ld19wcm94eSA9ICh7IGlzX3RvcF9sZXZlbCwgfSkgLT5cbiAgICAgICAgY2FsbGVlX2N0eCAgPSBudWxsXG4gICAgICAgIGdldF9jdHggICAgID0gLT4gY2FsbGVlX2N0eCA/PSB7IGlzX3RvcF9sZXZlbCwgY2ZnLi4uLCBzeXMuLi4sIH1cbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIFIgPSBuZXcgUHJveHkgY2ZnLmNhbGxlZSxcblxuICAgICAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgIGFwcGx5OiAoIHRhcmdldCwga2V5LCBQICkgLT5cbiAgICAgICAgICAgICMgdXJnZSAnzqlicmNzX19fNycsIFwiYXBwbHkgI3tycHIgeyB0YXJnZXQsIGtleSwgUCwgaXNfdG9wX2xldmVsLCB9fVwiXG5cbiAgICAgICAgICAgIFIgPSBSZWZsZWN0LmFwcGx5IHRhcmdldCwgZ2V0X2N0eCgpLCBQXG4gICAgICAgICAgICBzeXMuc3RhY2suY2xlYXIoKVxuICAgICAgICAgICAgcmV0dXJuIFJcblxuICAgICAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgIGdldDogKCB0YXJnZXQsIGtleSApIC0+XG4gICAgICAgICAgICAjIHVyZ2UgJ86pYnJjc19fXzgnLCBcImdldCAje3JwciB7IHRhcmdldCwga2V5LCB9fVwiXG4gICAgICAgICAgICByZXR1cm4gZ2V0X2N0eCgpICAgICAgICAgICAgICAgICAgICAgIGlmIGtleSBpcyBzeXNfc3ltYm9sXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0WyBrZXkgXSAgICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIGtleSApIGlzICdzeW1ib2wnXG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQgY2ZnLnByb3ZpZGVyLCBrZXkgIGlmIFJlZmxlY3QuaGFzIGNmZy5wcm92aWRlciwga2V5XG4gICAgICAgICAgICBzeXMuc3RhY2suY2xlYXIoKSBpZiBpc190b3BfbGV2ZWxcbiAgICAgICAgICAgIHN5cy5zdGFjay5wdXNoIGtleVxuICAgICAgICAgICAgIyByZXR1cm4gXCJbcmVzdWx0IGZvciBnZXR0aW5nIG5vbi1wcmVzZXQga2V5ICN7cnByIGtleX1dIGZyb20gI3tycHIgcHJvdmlkZXJ9XCJcbiAgICAgICAgICAgIHJldHVybiBzeXMuc3ViX2xldmVsX3Byb3h5XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICByZXR1cm4gUlxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHN5cyA9IHsgc3RhY2s6IG5ldyBTdGFjaygpLCB9XG4gICAgICBzeXMudG9wX2xldmVsX3Byb3h5ID0gbmV3X3Byb3h5IHsgaXNfdG9wX2xldmVsOiB0cnVlLCAgfVxuICAgICAgc3lzLnN1Yl9sZXZlbF9wcm94eSA9IG5ld19wcm94eSB7IGlzX3RvcF9sZXZlbDogZmFsc2UsIH1cbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICByZXR1cm4gc3lzLnRvcF9sZXZlbF9wcm94eVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHJldHVybiB7IGNyZWF0ZV9pbmZpbnlwcm94eSwgc3lzX3N5bWJvbCwgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgVkFSSU9VU19CUklDU1xuXG4iXX0=
