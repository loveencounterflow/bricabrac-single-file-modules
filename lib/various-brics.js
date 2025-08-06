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

//# sourceMappingURL=various-brics.js.map