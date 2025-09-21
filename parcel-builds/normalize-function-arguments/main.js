
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

      var $parcel$global = globalThis;
    
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire993b"];

if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire993b"] = parcelRequire;
}

var parcelRegister = parcelRequire.register;
parcelRegister("5WJ0w", function(module, exports) {

(function() {
    'use strict';
    var Template, bind_instance_methods, create_validator, debug, get_instance_methods, gnd, help, hide, nameit, new_pod, pod_prototypes, push_at, rpr, set_at, warn, indexOf = [].indexOf;
    //===========================================================================================================
    // optional                  = Symbol 'optional'
    pod_prototypes = Object.freeze([
        null,
        Object.getPrototypeOf({})
    ]);
    // new_pod                   = -> {}
    new_pod = function() {
        return Object.create(null);
    };
    // #===========================================================================================================
    // @bind_proto = ( that, f ) -> that::[ f.name ] = f.bind that::
    //===========================================================================================================
    Template = class Template {
        //---------------------------------------------------------------------------------------------------------
        constructor(cfg = null){
            var descriptor, name, ref;
            ref = Object.getOwnPropertyDescriptors(cfg != null ? cfg : {});
            for(name in ref){
                descriptor = ref[name];
                descriptor = (function() {
                    switch(true){
                        //...................................................................................................
                        case gnd.function.isa(descriptor.value):
                            return ((descriptor)=>{
                                var configurable, get;
                                ({ configurable: configurable, value: get } = descriptor);
                                return {
                                    enumerable: true,
                                    configurable: configurable,
                                    get: get
                                };
                            })(descriptor);
                        //...................................................................................................
                        case gnd.pod.isa(descriptor.value):
                            return ((descriptor)=>{
                                var configurable, get, value;
                                ({ configurable: configurable, value: value } = descriptor);
                                get = function() {
                                    return new Template(value);
                                };
                                return {
                                    enumerable: true,
                                    configurable: configurable,
                                    get: get
                                };
                            })(descriptor);
                        default:
                            //...................................................................................................
                            return descriptor;
                    }
                }).call(this);
                //.....................................................................................................
                Object.defineProperty(this, name, descriptor);
            }
            return void 0;
        }
    };
    //===========================================================================================================
    create_validator = function(typename, isa) {
        /* TAINT `gnd.nonempty_text.validate typename` */ /* TAINT `gnd.function.validate isa` */ /* TAINT silently accepts truthy, falsy values returned by `isa()`, not only booleans */ return function(x) {
            if (isa(x)) return x;
            throw new TypeError(`\u{3A9}nfa___1 validation error: expected a ${typename} got ${rpr(x)}`);
        };
    };
    //===========================================================================================================
    gnd = function() {
        var R, type, typename;
        R = {
            // boolean:        isa:  ( x ) -> ( x is true ) or ( x is false )
            //.......................................................................................................
            function: {
                isa: function(x) {
                    return Object.prototype.toString.call(x) === '[object Function]';
                }
            },
            //.......................................................................................................
            template: {
                isa: function(x) {
                    return x instanceof Template;
                }
            },
            //.......................................................................................................
            pod: {
                isa: function(x) {
                    var ref;
                    return x != null && (ref = Object.getPrototypeOf(x), indexOf.call(pod_prototypes, ref) >= 0);
                },
                create: function(...Q) {
                    return Object.assign(new_pod(), ...Q);
                }
            },
            //.......................................................................................................
            nfa_cfg: {
                isa: function(x) {
                    if (!gnd.pod.isa(x)) return false;
                    if (!gnd.template.isa_optional(x.template)) return false;
                    if (!gnd.function.isa_optional(x.isa)) return false;
                    if (!gnd.function.isa_optional(x.validate)) return false;
                    // return false unless gnd.function.isa_optional x.type
                    return true;
                },
                template: {
                    template: null,
                    isa: null,
                    validate: null,
                    type: null
                }
            }
        };
        //.........................................................................................................
        for(typename in R){
            type = R[typename];
            type.name = typename;
        }
        // type.validate = ( x ) -> ...
        //.........................................................................................................
        return R;
    }();
    (()=>{
        var results, type, typename;
        results = [];
        for(typename in gnd){
            type = gnd[typename];
            results.push(function(typename, type) {
                if (type.template != null) type.template = new Template(type.template);
                if (type.isa != null) {
                    if (type.isa_optional == null) type.isa_optional = function(x) {
                        return x == null || type.isa(x);
                    };
                    if (type.validate == null) type.validate = create_validator(type.name, function(x) {
                        return type.isa(x);
                    });
                }
                return null;
            }(typename, type));
        }
        return results;
    })();
    //===========================================================================================================
    hide = (object, name, value)=>{
        return Object.defineProperty(object, name, {
            enumerable: false,
            writable: true,
            configurable: true,
            value: value
        });
    };
    //===========================================================================================================
    nameit = function(name, f) {
        Object.defineProperty(f, 'name', {
            value: name
        });
        return f;
    };
    //===========================================================================================================
    get_instance_methods = function(instance) {
        var R, key, method, ref;
        R = {};
        ref = Object.getOwnPropertyDescriptors(instance);
        for(key in ref){
            ({ value: method } = ref[key]);
            if (key === 'constructor') continue;
            if (!gnd.function.isa(method)) continue;
            R[key] = method;
        }
        return R;
    };
    //===========================================================================================================
    bind_instance_methods = function(instance, keep_name = true) {
        var key, method, ref;
        ref = get_instance_methods(Object.getPrototypeOf(instance));
        for(key in ref){
            method = ref[key];
            if (keep_name) hide(instance, key, nameit(method.name, method.bind(instance)));
            else hide(instance, key, method.bind(instance));
        }
        return null;
    };
    //===========================================================================================================
    push_at = function(list, idx, x) {
        if (!(idx < 0)) throw new Error(`\u{3A9}nfa___7 expected negative number, got ${rpr(idx)}`);
        list.splice(Math.max(list.length + idx, 0), 0, x);
        return list;
    };
    // #-----------------------------------------------------------------------------------------------------------
    // pop_at = ( list, idx, x ) ->
    //   unless idx < 0
    //     throw new Error "Ωnfa___8 expected negative number, got #{rpr idx}"
    //   unless list.length >= Math.abs idx
    //     throw new Error "Ωnfa___9 list too short, got index #{idx} for length of #{list.length}"
    //   return ( list.splice idx, 1 )[ 0 ]
    //-----------------------------------------------------------------------------------------------------------
    set_at = function(list, idx, x) {
        if (!(idx < 0)) throw new Error(`\u{3A9}nfa__10 expected negative number, got ${rpr(idx)}`);
        list[list.length + idx] = x;
        return x;
    };
    //===========================================================================================================
    debug = console.debug;
    help = console.help;
    warn = console.warn;
    rpr = function(x) {
        return (parcelRequire("5g8F0")).inspect(x);
    };
    //===========================================================================================================
    // get_instance_methods
    // pop_at
    module.exports = {
        Template: Template,
        gnd: gnd,
        create_validator: create_validator,
        hide: hide,
        nameit: nameit,
        bind_instance_methods: bind_instance_methods,
        push_at: push_at,
        set_at: set_at,
        debug: debug,
        help: help,
        warn: warn,
        rpr: rpr
    };
}).call(module.exports);

});
parcelRegister("5g8F0", function(module, exports) {

$parcel$export(module.exports, "inspect", () => $3d452a2a8c08ef7b$export$9dec5d1b3b6a130d);
/* !
 * loupe
 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */ 
var $4hQGr = parcelRequire("4hQGr");

var $6AAF3 = parcelRequire("6AAF3");

var $hNq97 = parcelRequire("hNq97");

var $01F44 = parcelRequire("01F44");

var $kJkl4 = parcelRequire("kJkl4");

var $aZF84 = parcelRequire("aZF84");

var $lVEhB = parcelRequire("lVEhB");

var $ja2Y5 = parcelRequire("ja2Y5");

var $arfko = parcelRequire("arfko");

var $7Gt6m = parcelRequire("7Gt6m");

var $iJCsd = parcelRequire("iJCsd");

var $ieooK = parcelRequire("ieooK");

var $a7Az3 = parcelRequire("a7Az3");

var $77AW2 = parcelRequire("77AW2");

var $gYlV2 = parcelRequire("gYlV2");

var $36qXs = parcelRequire("36qXs");

var $81aia = parcelRequire("81aia");

var $aUxLQ = parcelRequire("aUxLQ");
const $3d452a2a8c08ef7b$var$symbolsSupported = typeof Symbol === 'function' && typeof Symbol.for === 'function';
const $3d452a2a8c08ef7b$var$chaiInspect = $3d452a2a8c08ef7b$var$symbolsSupported ? Symbol.for('chai/inspect') : '@@chai/inspect';
const $3d452a2a8c08ef7b$var$nodeInspect = Symbol.for('nodejs.util.inspect.custom');
const $3d452a2a8c08ef7b$var$constructorMap = new WeakMap();
const $3d452a2a8c08ef7b$var$stringTagMap = {};
const $3d452a2a8c08ef7b$var$baseTypesMap = {
    undefined: (value, options)=>options.stylize('undefined', 'undefined'),
    null: (value, options)=>options.stylize('null', 'null'),
    boolean: (value, options)=>options.stylize(String(value), 'boolean'),
    Boolean: (value, options)=>options.stylize(String(value), 'boolean'),
    number: (0, $aZF84.default),
    Number: (0, $aZF84.default),
    bigint: (0, $lVEhB.default),
    BigInt: (0, $lVEhB.default),
    string: (0, $7Gt6m.default),
    String: (0, $7Gt6m.default),
    function: (0, $01F44.default),
    Function: (0, $01F44.default),
    symbol: (0, $iJCsd.default),
    // A Symbol polyfill will return `Symbol` not `symbol` from typedetect
    Symbol: (0, $iJCsd.default),
    Array: (0, $4hQGr.default),
    Date: (0, $hNq97.default),
    Map: (0, $kJkl4.default),
    Set: (0, $arfko.default),
    RegExp: (0, $ja2Y5.default),
    Promise: (0, $ieooK.default),
    // WeakSet, WeakMap are totally opaque to us
    WeakSet: (value, options)=>options.stylize("WeakSet{\u2026}", 'special'),
    WeakMap: (value, options)=>options.stylize("WeakMap{\u2026}", 'special'),
    Arguments: (0, $gYlV2.default),
    Int8Array: (0, $6AAF3.default),
    Uint8Array: (0, $6AAF3.default),
    Uint8ClampedArray: (0, $6AAF3.default),
    Int16Array: (0, $6AAF3.default),
    Uint16Array: (0, $6AAF3.default),
    Int32Array: (0, $6AAF3.default),
    Uint32Array: (0, $6AAF3.default),
    Float32Array: (0, $6AAF3.default),
    Float64Array: (0, $6AAF3.default),
    Generator: ()=>'',
    DataView: ()=>'',
    ArrayBuffer: ()=>'',
    Error: (0, $36qXs.default),
    HTMLCollection: (0, $81aia.inspectNodeCollection),
    NodeList: (0, $81aia.inspectNodeCollection)
};
// eslint-disable-next-line complexity
const $3d452a2a8c08ef7b$var$inspectCustom = (value, options, type)=>{
    if ($3d452a2a8c08ef7b$var$chaiInspect in value && typeof value[$3d452a2a8c08ef7b$var$chaiInspect] === 'function') return value[$3d452a2a8c08ef7b$var$chaiInspect](options);
    if ($3d452a2a8c08ef7b$var$nodeInspect in value && typeof value[$3d452a2a8c08ef7b$var$nodeInspect] === 'function') return value[$3d452a2a8c08ef7b$var$nodeInspect](options.depth, options);
    if ('inspect' in value && typeof value.inspect === 'function') return value.inspect(options.depth, options);
    if ('constructor' in value && $3d452a2a8c08ef7b$var$constructorMap.has(value.constructor)) return $3d452a2a8c08ef7b$var$constructorMap.get(value.constructor)(value, options);
    if ($3d452a2a8c08ef7b$var$stringTagMap[type]) return $3d452a2a8c08ef7b$var$stringTagMap[type](value, options);
    return '';
};
const $3d452a2a8c08ef7b$var$toString = Object.prototype.toString;
function $3d452a2a8c08ef7b$export$9dec5d1b3b6a130d(value, opts = {}) {
    const options = (0, $aUxLQ.normaliseOptions)(opts, $3d452a2a8c08ef7b$export$9dec5d1b3b6a130d);
    const { customInspect: customInspect } = options;
    let type = value === null ? 'null' : typeof value;
    if (type === 'object') type = $3d452a2a8c08ef7b$var$toString.call(value).slice(8, -1);
    // If it is a base value that we already support, then use Loupe's inspector
    if (type in $3d452a2a8c08ef7b$var$baseTypesMap) return $3d452a2a8c08ef7b$var$baseTypesMap[type](value, options);
    // If `options.customInspect` is set to true then try to use the custom inspector
    if (customInspect && value) {
        const output = $3d452a2a8c08ef7b$var$inspectCustom(value, options, type);
        if (output) {
            if (typeof output === 'string') return output;
            return $3d452a2a8c08ef7b$export$9dec5d1b3b6a130d(output, options);
        }
    }
    const proto = value ? Object.getPrototypeOf(value) : false;
    // If it's a plain Object then use Loupe's inspector
    if (proto === Object.prototype || proto === null) return (0, $77AW2.default)(value, options);
    // Specifically account for HTMLElements
    // @ts-ignore
    if (value && typeof HTMLElement === 'function' && value instanceof HTMLElement) return (0, $81aia.default)(value, options);
    if ('constructor' in value) {
        // If it is a class, inspect it like an object but add the constructor name
        if (value.constructor !== Object) return (0, $a7Az3.default)(value, options);
        // If it is an object with an anonymous prototype, display it as an object.
        return (0, $77AW2.default)(value, options);
    }
    // last chance to check if it's an object
    if (value === Object(value)) return (0, $77AW2.default)(value, options);
    // We have run out of options! Just stringify the value
    return options.stylize(String(value), type);
}
function $3d452a2a8c08ef7b$export$1c157cd0103c585e(constructor, inspector) {
    if ($3d452a2a8c08ef7b$var$constructorMap.has(constructor)) return false;
    $3d452a2a8c08ef7b$var$constructorMap.set(constructor, inspector);
    return true;
}
function $3d452a2a8c08ef7b$export$34571d0b1fb60855(stringTag, inspector) {
    if (stringTag in $3d452a2a8c08ef7b$var$stringTagMap) return false;
    $3d452a2a8c08ef7b$var$stringTagMap[stringTag] = inspector;
    return true;
}
const $3d452a2a8c08ef7b$export$4c00f665f0d4b443 = $3d452a2a8c08ef7b$var$chaiInspect;
var $3d452a2a8c08ef7b$export$2e2bcd8739ae039 = $3d452a2a8c08ef7b$export$9dec5d1b3b6a130d;

});
parcelRegister("4hQGr", function(module, exports) {

$parcel$export(module.exports, "default", () => $31f19dd433a42a8c$export$2e2bcd8739ae039);

var $aUxLQ = parcelRequire("aUxLQ");
function $31f19dd433a42a8c$export$2e2bcd8739ae039(array, options) {
    // Object.keys will always output the Array indices first, so we can slice by
    // `array.length` to get non-index properties
    const nonIndexProperties = Object.keys(array).slice(array.length);
    if (!array.length && !nonIndexProperties.length) return '[]';
    options.truncate -= 4;
    const listContents = (0, $aUxLQ.inspectList)(array, options);
    options.truncate -= listContents.length;
    let propertyContents = '';
    if (nonIndexProperties.length) propertyContents = (0, $aUxLQ.inspectList)(nonIndexProperties.map((key)=>[
            key,
            array[key]
        ]), options, (0, $aUxLQ.inspectProperty));
    return `[ ${listContents}${propertyContents ? `, ${propertyContents}` : ''} ]`;
}

});
parcelRegister("aUxLQ", function(module, exports) {

$parcel$export(module.exports, "truncator", () => $7f1954869b6a372c$export$f41f670fb11449ac);
$parcel$export(module.exports, "normaliseOptions", () => $7f1954869b6a372c$export$12b873b4043e1e4d);
$parcel$export(module.exports, "truncate", () => $7f1954869b6a372c$export$6a506b36fdea397d);
$parcel$export(module.exports, "inspectList", () => $7f1954869b6a372c$export$3da3a1f1d6bf8bb8);
$parcel$export(module.exports, "inspectProperty", () => $7f1954869b6a372c$export$f96adfe007d4d783);
const $7f1954869b6a372c$var$ansiColors = {
    bold: [
        '1',
        '22'
    ],
    dim: [
        '2',
        '22'
    ],
    italic: [
        '3',
        '23'
    ],
    underline: [
        '4',
        '24'
    ],
    // 5 & 6 are blinking
    inverse: [
        '7',
        '27'
    ],
    hidden: [
        '8',
        '28'
    ],
    strike: [
        '9',
        '29'
    ],
    // 10-20 are fonts
    // 21-29 are resets for 1-9
    black: [
        '30',
        '39'
    ],
    red: [
        '31',
        '39'
    ],
    green: [
        '32',
        '39'
    ],
    yellow: [
        '33',
        '39'
    ],
    blue: [
        '34',
        '39'
    ],
    magenta: [
        '35',
        '39'
    ],
    cyan: [
        '36',
        '39'
    ],
    white: [
        '37',
        '39'
    ],
    brightblack: [
        '30;1',
        '39'
    ],
    brightred: [
        '31;1',
        '39'
    ],
    brightgreen: [
        '32;1',
        '39'
    ],
    brightyellow: [
        '33;1',
        '39'
    ],
    brightblue: [
        '34;1',
        '39'
    ],
    brightmagenta: [
        '35;1',
        '39'
    ],
    brightcyan: [
        '36;1',
        '39'
    ],
    brightwhite: [
        '37;1',
        '39'
    ],
    grey: [
        '90',
        '39'
    ]
};
const $7f1954869b6a372c$var$styles = {
    special: 'cyan',
    number: 'yellow',
    bigint: 'yellow',
    boolean: 'yellow',
    undefined: 'grey',
    null: 'bold',
    string: 'green',
    symbol: 'green',
    date: 'magenta',
    regexp: 'red'
};
const $7f1954869b6a372c$export$f41f670fb11449ac = "\u2026";
function $7f1954869b6a372c$var$colorise(value, styleType) {
    const color = $7f1954869b6a372c$var$ansiColors[$7f1954869b6a372c$var$styles[styleType]] || $7f1954869b6a372c$var$ansiColors[styleType] || '';
    if (!color) return String(value);
    return `\u001b[${color[0]}m${String(value)}\u001b[${color[1]}m`;
}
function $7f1954869b6a372c$export$12b873b4043e1e4d({ showHidden: showHidden = false, depth: depth = 2, colors: colors = false, customInspect: customInspect = true, showProxy: showProxy = false, maxArrayLength: maxArrayLength = Infinity, breakLength: breakLength = Infinity, seen: seen = [], truncate: // eslint-disable-next-line no-shadow
truncate = Infinity, stylize: stylize = String } = {}, inspect) {
    const options = {
        showHidden: Boolean(showHidden),
        depth: Number(depth),
        colors: Boolean(colors),
        customInspect: Boolean(customInspect),
        showProxy: Boolean(showProxy),
        maxArrayLength: Number(maxArrayLength),
        breakLength: Number(breakLength),
        truncate: Number(truncate),
        seen: seen,
        inspect: inspect,
        stylize: stylize
    };
    if (options.colors) options.stylize = $7f1954869b6a372c$var$colorise;
    return options;
}
function $7f1954869b6a372c$var$isHighSurrogate(char) {
    return char >= '\ud800' && char <= '\udbff';
}
function $7f1954869b6a372c$export$6a506b36fdea397d(string, length, tail = $7f1954869b6a372c$export$f41f670fb11449ac) {
    string = String(string);
    const tailLength = tail.length;
    const stringLength = string.length;
    if (tailLength > length && stringLength > tailLength) return tail;
    if (stringLength > length && stringLength > tailLength) {
        let end = length - tailLength;
        if (end > 0 && $7f1954869b6a372c$var$isHighSurrogate(string[end - 1])) end = end - 1;
        return `${string.slice(0, end)}${tail}`;
    }
    return string;
}
function $7f1954869b6a372c$export$3da3a1f1d6bf8bb8(list, options, inspectItem, separator = ', ') {
    inspectItem = inspectItem || options.inspect;
    const size = list.length;
    if (size === 0) return '';
    const originalLength = options.truncate;
    let output = '';
    let peek = '';
    let truncated = '';
    for(let i = 0; i < size; i += 1){
        const last = i + 1 === list.length;
        const secondToLast = i + 2 === list.length;
        truncated = `${$7f1954869b6a372c$export$f41f670fb11449ac}(${list.length - i})`;
        const value = list[i];
        // If there is more than one remaining we need to account for a separator of `, `
        options.truncate = originalLength - output.length - (last ? 0 : separator.length);
        const string = peek || inspectItem(value, options) + (last ? '' : separator);
        const nextLength = output.length + string.length;
        const truncatedLength = nextLength + truncated.length;
        // If this is the last element, and adding it would
        // take us over length, but adding the truncator wouldn't - then break now
        if (last && nextLength > originalLength && output.length + truncated.length <= originalLength) break;
        // If this isn't the last or second to last element to scan,
        // but the string is already over length then break here
        if (!last && !secondToLast && truncatedLength > originalLength) break;
        // Peek at the next string to determine if we should
        // break early before adding this item to the output
        peek = last ? '' : inspectItem(list[i + 1], options) + (secondToLast ? '' : separator);
        // If we have one element left, but this element and
        // the next takes over length, the break early
        if (!last && secondToLast && truncatedLength > originalLength && nextLength + peek.length > originalLength) break;
        output += string;
        // If the next element takes us to length -
        // but there are more after that, then we should truncate now
        if (!last && !secondToLast && nextLength + peek.length >= originalLength) {
            truncated = `${$7f1954869b6a372c$export$f41f670fb11449ac}(${list.length - i - 1})`;
            break;
        }
        truncated = '';
    }
    return `${output}${truncated}`;
}
function $7f1954869b6a372c$var$quoteComplexKey(key) {
    if (key.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) return key;
    return JSON.stringify(key).replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
}
function $7f1954869b6a372c$export$f96adfe007d4d783([key, value], options) {
    options.truncate -= 2;
    if (typeof key === 'string') key = $7f1954869b6a372c$var$quoteComplexKey(key);
    else if (typeof key !== 'number') key = `[${options.inspect(key, options)}]`;
    options.truncate -= key.length;
    value = options.inspect(value, options);
    return `${key}: ${value}`;
}

});


parcelRegister("6AAF3", function(module, exports) {

$parcel$export(module.exports, "default", () => $4cc28b014d8b53cb$export$2e2bcd8739ae039);

var $aUxLQ = parcelRequire("aUxLQ");
const $4cc28b014d8b53cb$var$getArrayName = (array)=>{
    // We need to special case Node.js' Buffers, which report to be Uint8Array
    // @ts-ignore
    if (typeof Buffer === 'function' && array instanceof Buffer) return 'Buffer';
    if (array[Symbol.toStringTag]) return array[Symbol.toStringTag];
    return array.constructor.name;
};
function $4cc28b014d8b53cb$export$2e2bcd8739ae039(array, options) {
    const name = $4cc28b014d8b53cb$var$getArrayName(array);
    options.truncate -= name.length + 4;
    // Object.keys will always output the Array indices first, so we can slice by
    // `array.length` to get non-index properties
    const nonIndexProperties = Object.keys(array).slice(array.length);
    if (!array.length && !nonIndexProperties.length) return `${name}[]`;
    // As we know TypedArrays only contain Unsigned Integers, we can skip inspecting each one and simply
    // stylise the toString() value of them
    let output = '';
    for(let i = 0; i < array.length; i++){
        const string = `${options.stylize((0, $aUxLQ.truncate)(array[i], options.truncate), 'number')}${i === array.length - 1 ? '' : ', '}`;
        options.truncate -= string.length;
        if (array[i] !== array.length && options.truncate <= 3) {
            output += `${0, $aUxLQ.truncator}(${array.length - array[i] + 1})`;
            break;
        }
        output += string;
    }
    let propertyContents = '';
    if (nonIndexProperties.length) propertyContents = (0, $aUxLQ.inspectList)(nonIndexProperties.map((key)=>[
            key,
            array[key]
        ]), options, (0, $aUxLQ.inspectProperty));
    return `${name}[ ${output}${propertyContents ? `, ${propertyContents}` : ''} ]`;
}

});

parcelRegister("hNq97", function(module, exports) {

$parcel$export(module.exports, "default", () => $cf4b4b5b420d1b6e$export$2e2bcd8739ae039);

var $aUxLQ = parcelRequire("aUxLQ");
function $cf4b4b5b420d1b6e$export$2e2bcd8739ae039(dateObject, options) {
    const stringRepresentation = dateObject.toJSON();
    if (stringRepresentation === null) return 'Invalid Date';
    const split = stringRepresentation.split('T');
    const date = split[0];
    // If we need to - truncate the time portion, but never the date
    return options.stylize(`${date}T${(0, $aUxLQ.truncate)(split[1], options.truncate - date.length - 1)}`, 'date');
}

});

parcelRegister("01F44", function(module, exports) {

$parcel$export(module.exports, "default", () => $004ff2ad754c3916$export$2e2bcd8739ae039);

var $aUxLQ = parcelRequire("aUxLQ");
function $004ff2ad754c3916$export$2e2bcd8739ae039(func, options) {
    const functionType = func[Symbol.toStringTag] || 'Function';
    const name = func.name;
    if (!name) return options.stylize(`[${functionType}]`, 'special');
    return options.stylize(`[${functionType} ${(0, $aUxLQ.truncate)(name, options.truncate - 11)}]`, 'special');
}

});

parcelRegister("kJkl4", function(module, exports) {

$parcel$export(module.exports, "default", () => $f177c97e60db2a66$export$2e2bcd8739ae039);

var $aUxLQ = parcelRequire("aUxLQ");
function $f177c97e60db2a66$var$inspectMapEntry([key, value], options) {
    options.truncate -= 4;
    key = options.inspect(key, options);
    options.truncate -= key.length;
    value = options.inspect(value, options);
    return `${key} => ${value}`;
}
// IE11 doesn't support `map.entries()`
function $f177c97e60db2a66$var$mapToEntries(map) {
    const entries = [];
    map.forEach((value, key)=>{
        entries.push([
            key,
            value
        ]);
    });
    return entries;
}
function $f177c97e60db2a66$export$2e2bcd8739ae039(map, options) {
    if (map.size === 0) return 'Map{}';
    options.truncate -= 7;
    return `Map{ ${(0, $aUxLQ.inspectList)($f177c97e60db2a66$var$mapToEntries(map), options, $f177c97e60db2a66$var$inspectMapEntry)} }`;
}

});

parcelRegister("aZF84", function(module, exports) {

$parcel$export(module.exports, "default", () => $800f814799afeeaa$export$2e2bcd8739ae039);

var $aUxLQ = parcelRequire("aUxLQ");
const $800f814799afeeaa$var$isNaN = Number.isNaN || ((i)=>i !== i); // eslint-disable-line no-self-compare
function $800f814799afeeaa$export$2e2bcd8739ae039(number, options) {
    if ($800f814799afeeaa$var$isNaN(number)) return options.stylize('NaN', 'number');
    if (number === Infinity) return options.stylize('Infinity', 'number');
    if (number === -Infinity) return options.stylize('-Infinity', 'number');
    if (number === 0) return options.stylize(1 / number === Infinity ? '+0' : '-0', 'number');
    return options.stylize((0, $aUxLQ.truncate)(String(number), options.truncate), 'number');
}

});

parcelRegister("lVEhB", function(module, exports) {

$parcel$export(module.exports, "default", () => $ff6e2b3198d42455$export$2e2bcd8739ae039);

var $aUxLQ = parcelRequire("aUxLQ");
function $ff6e2b3198d42455$export$2e2bcd8739ae039(number, options) {
    let nums = (0, $aUxLQ.truncate)(number.toString(), options.truncate - 1);
    if (nums !== (0, $aUxLQ.truncator)) nums += 'n';
    return options.stylize(nums, 'bigint');
}

});

parcelRegister("ja2Y5", function(module, exports) {

$parcel$export(module.exports, "default", () => $df3140edd5ba5308$export$2e2bcd8739ae039);

var $aUxLQ = parcelRequire("aUxLQ");
function $df3140edd5ba5308$export$2e2bcd8739ae039(value, options) {
    const flags = value.toString().split('/')[2];
    const sourceLength = options.truncate - (2 + flags.length);
    const source = value.source;
    return options.stylize(`/${(0, $aUxLQ.truncate)(source, sourceLength)}/${flags}`, 'regexp');
}

});

parcelRegister("arfko", function(module, exports) {

$parcel$export(module.exports, "default", () => $01f611d1c5a73fc2$export$2e2bcd8739ae039);

var $aUxLQ = parcelRequire("aUxLQ");
// IE11 doesn't support `Array.from(set)`
function $01f611d1c5a73fc2$var$arrayFromSet(set) {
    const values = [];
    set.forEach((value)=>{
        values.push(value);
    });
    return values;
}
function $01f611d1c5a73fc2$export$2e2bcd8739ae039(set, options) {
    if (set.size === 0) return 'Set{}';
    options.truncate -= 7;
    return `Set{ ${(0, $aUxLQ.inspectList)($01f611d1c5a73fc2$var$arrayFromSet(set), options)} }`;
}

});

parcelRegister("7Gt6m", function(module, exports) {

$parcel$export(module.exports, "default", () => $5983079b04b8ed43$export$2e2bcd8739ae039);

var $aUxLQ = parcelRequire("aUxLQ");
const $5983079b04b8ed43$var$stringEscapeChars = new RegExp("['\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]", 'g');
const $5983079b04b8ed43$var$escapeCharacters = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    "'": "\\'",
    '\\': '\\\\'
};
const $5983079b04b8ed43$var$hex = 16;
const $5983079b04b8ed43$var$unicodeLength = 4;
function $5983079b04b8ed43$var$escape(char) {
    return $5983079b04b8ed43$var$escapeCharacters[char] || `\\u${`0000${char.charCodeAt(0).toString($5983079b04b8ed43$var$hex)}`.slice(-$5983079b04b8ed43$var$unicodeLength)}`;
}
function $5983079b04b8ed43$export$2e2bcd8739ae039(string, options) {
    if ($5983079b04b8ed43$var$stringEscapeChars.test(string)) string = string.replace($5983079b04b8ed43$var$stringEscapeChars, $5983079b04b8ed43$var$escape);
    return options.stylize(`'${(0, $aUxLQ.truncate)(string, options.truncate - 2)}'`, 'string');
}

});

parcelRegister("iJCsd", function(module, exports) {

$parcel$export(module.exports, "default", () => $da3a422171a63509$export$2e2bcd8739ae039);
function $da3a422171a63509$export$2e2bcd8739ae039(value) {
    if ('description' in Symbol.prototype) return value.description ? `Symbol(${value.description})` : 'Symbol()';
    return value.toString();
}

});

parcelRegister("ieooK", function(module, exports) {

$parcel$export(module.exports, "default", () => $d45c75bffae1cd2d$export$2e2bcd8739ae039);
let $d45c75bffae1cd2d$var$getPromiseValue = ()=>"Promise{\u2026}";
try {
    // @ts-ignore
    const { getPromiseDetails: getPromiseDetails, kPending: kPending, kRejected: kRejected } = process.binding('util');
    if (Array.isArray(getPromiseDetails(Promise.resolve()))) $d45c75bffae1cd2d$var$getPromiseValue = (value, options)=>{
        const [state, innerValue] = getPromiseDetails(value);
        if (state === kPending) return 'Promise{<pending>}';
        return `Promise${state === kRejected ? '!' : ''}{${options.inspect(innerValue, options)}}`;
    };
} catch (notNode) {
/* ignore */ }
var $d45c75bffae1cd2d$export$2e2bcd8739ae039 = $d45c75bffae1cd2d$var$getPromiseValue;

});

parcelRegister("a7Az3", function(module, exports) {

$parcel$export(module.exports, "default", () => $75e6ebc47117399a$export$2e2bcd8739ae039);

var $77AW2 = parcelRequire("77AW2");
const $75e6ebc47117399a$var$toStringTag = typeof Symbol !== 'undefined' && Symbol.toStringTag ? Symbol.toStringTag : false;
function $75e6ebc47117399a$export$2e2bcd8739ae039(value, options) {
    let name = '';
    if ($75e6ebc47117399a$var$toStringTag && $75e6ebc47117399a$var$toStringTag in value) name = value[$75e6ebc47117399a$var$toStringTag];
    name = name || value.constructor.name;
    // Babel transforms anonymous classes to the name `_class`
    if (!name || name === '_class') name = '<Anonymous Class>';
    options.truncate -= name.length;
    return `${name}${(0, $77AW2.default)(value, options)}`;
}

});
parcelRegister("77AW2", function(module, exports) {

$parcel$export(module.exports, "default", () => $52f5d6634c57ed23$export$2e2bcd8739ae039);

var $aUxLQ = parcelRequire("aUxLQ");
function $52f5d6634c57ed23$export$2e2bcd8739ae039(object, options) {
    const properties = Object.getOwnPropertyNames(object);
    const symbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(object) : [];
    if (properties.length === 0 && symbols.length === 0) return '{}';
    options.truncate -= 4;
    options.seen = options.seen || [];
    if (options.seen.includes(object)) return '[Circular]';
    options.seen.push(object);
    const propertyContents = (0, $aUxLQ.inspectList)(properties.map((key)=>[
            key,
            object[key]
        ]), options, (0, $aUxLQ.inspectProperty));
    const symbolContents = (0, $aUxLQ.inspectList)(symbols.map((key)=>[
            key,
            object[key]
        ]), options, (0, $aUxLQ.inspectProperty));
    options.seen.pop();
    let sep = '';
    if (propertyContents && symbolContents) sep = ', ';
    return `{ ${propertyContents}${sep}${symbolContents} }`;
}

});


parcelRegister("gYlV2", function(module, exports) {

$parcel$export(module.exports, "default", () => $c5b340933768778c$export$2e2bcd8739ae039);

var $aUxLQ = parcelRequire("aUxLQ");
function $c5b340933768778c$export$2e2bcd8739ae039(args, options) {
    if (args.length === 0) return 'Arguments[]';
    options.truncate -= 13;
    return `Arguments[ ${(0, $aUxLQ.inspectList)(args, options)} ]`;
}

});

parcelRegister("36qXs", function(module, exports) {

$parcel$export(module.exports, "default", () => $2426d7ef664fcabf$export$2e2bcd8739ae039);

var $aUxLQ = parcelRequire("aUxLQ");
const $2426d7ef664fcabf$var$errorKeys = [
    'stack',
    'line',
    'column',
    'name',
    'message',
    'fileName',
    'lineNumber',
    'columnNumber',
    'number',
    'description',
    'cause'
];
function $2426d7ef664fcabf$export$2e2bcd8739ae039(error, options) {
    const properties = Object.getOwnPropertyNames(error).filter((key)=>$2426d7ef664fcabf$var$errorKeys.indexOf(key) === -1);
    const name = error.name;
    options.truncate -= name.length;
    let message = '';
    if (typeof error.message === 'string') message = (0, $aUxLQ.truncate)(error.message, options.truncate);
    else properties.unshift('message');
    message = message ? `: ${message}` : '';
    options.truncate -= message.length + 5;
    options.seen = options.seen || [];
    if (options.seen.includes(error)) return '[Circular]';
    options.seen.push(error);
    const propertyContents = (0, $aUxLQ.inspectList)(properties.map((key)=>[
            key,
            error[key]
        ]), options, (0, $aUxLQ.inspectProperty));
    return `${name}${message}${propertyContents ? ` { ${propertyContents} }` : ''}`;
}

});

parcelRegister("81aia", function(module, exports) {

$parcel$export(module.exports, "inspectNodeCollection", () => $5d66668626687269$export$8edb6e2e5d8e2aca);
$parcel$export(module.exports, "default", () => $5d66668626687269$export$2e2bcd8739ae039);

var $aUxLQ = parcelRequire("aUxLQ");
function $5d66668626687269$export$4bea0f86bbb13a30([key, value], options) {
    options.truncate -= 3;
    if (!value) return `${options.stylize(String(key), 'yellow')}`;
    return `${options.stylize(String(key), 'yellow')}=${options.stylize(`"${value}"`, 'string')}`;
}
function $5d66668626687269$export$8edb6e2e5d8e2aca(collection, options) {
    return (0, $aUxLQ.inspectList)(collection, options, $5d66668626687269$export$1fb4942445f794e6, '\n');
}
function $5d66668626687269$export$1fb4942445f794e6(node, options) {
    switch(node.nodeType){
        case 1:
            return $5d66668626687269$export$2e2bcd8739ae039(node, options);
        case 3:
            return options.inspect(node.data, options);
        default:
            return options.inspect(node, options);
    }
}
function $5d66668626687269$export$2e2bcd8739ae039(element, options) {
    const properties = element.getAttributeNames();
    const name = element.tagName.toLowerCase();
    const head = options.stylize(`<${name}`, 'special');
    const headClose = options.stylize(`>`, 'special');
    const tail = options.stylize(`</${name}>`, 'special');
    options.truncate -= name.length * 2 + 5;
    let propertyContents = '';
    if (properties.length > 0) {
        propertyContents += ' ';
        propertyContents += (0, $aUxLQ.inspectList)(properties.map((key)=>[
                key,
                element.getAttribute(key)
            ]), options, $5d66668626687269$export$4bea0f86bbb13a30, ' ');
    }
    options.truncate -= propertyContents.length;
    const truncate = options.truncate;
    let children = $5d66668626687269$export$8edb6e2e5d8e2aca(element.children, options);
    if (children && children.length > truncate) children = `${0, $aUxLQ.truncator}(${element.children.length})`;
    return `${head}${propertyContents}${headClose}${children}${tail}`;
}

});




(function() {
    'use strict';
    var Argument_type_error, Arity_error, H, Internals, Named_arity_error, Nfa_error, Normalize_function_arguments, Not_implemented_error, Positional_arity_error, Runtime_arity_error, Signature_cfg_position_error, Signature_disposition_Error, Signature_error, Signature_missing_parameter_Error, Signature_naming_Error, Template, Type_error, Value_mismatch_error, bind_instance_methods, create_validator, debug, get_signature, gnd, help, hide, internals, nameit, nfa, normalizer, push_at, rpr, set_at, warn;
    //===========================================================================================================
    H = (parcelRequire("5WJ0w"));
    // get_instance_methods
    // pop_at
    ({ Template: Template, gnd: gnd, hide: hide, create_validator: create_validator, bind_instance_methods: bind_instance_methods, nameit: nameit, push_at: push_at, set_at: set_at, debug: debug, warn: warn, help: help, rpr: rpr } = H);
    // E                         = require './errors'
    // optional                  = Symbol 'optional'
    //=========================================================================================================
    Nfa_error = class Nfa_error extends Error {
    };
    Arity_error = class Arity_error extends Nfa_error {
    };
    Named_arity_error = class Named_arity_error extends Arity_error {
    };
    Runtime_arity_error = class Runtime_arity_error extends Arity_error {
    };
    Positional_arity_error = class Positional_arity_error extends Arity_error {
    };
    Not_implemented_error = class Not_implemented_error extends Nfa_error {
    };
    Signature_error = class Signature_error extends Nfa_error {
    };
    Signature_disposition_Error = class Signature_disposition_Error extends Signature_error {
    };
    Signature_naming_Error = class Signature_naming_Error extends Signature_error {
    };
    Signature_missing_parameter_Error = class Signature_missing_parameter_Error extends Signature_error {
    };
    Signature_cfg_position_error = class Signature_cfg_position_error extends Signature_error {
    };
    Value_mismatch_error = class Value_mismatch_error extends Nfa_error {
    };
    Type_error = class Type_error extends Nfa_error {
    };
    Argument_type_error = class Argument_type_error extends Type_error {
    };
    //===========================================================================================================
    internals = new (Internals = class Internals {
        constructor(){
            this.pod_prototypes = H.pod_prototypes;
            this.gnd = gnd;
            this.push_at = push_at;
            // @pop_at         = pop_at
            this.set_at = set_at;
            this.nameit = nameit;
            return void 0;
        }
    })();
    //===========================================================================================================
    Normalize_function_arguments = class Normalize_function_arguments {
        //---------------------------------------------------------------------------------------------------------
        constructor(cfg = null){
            if (cfg != null) throw new Not_implemented_error("\u03A9nfa___1 configuration not implemented");
            bind_instance_methods(this);
            return void 0;
        }
        //---------------------------------------------------------------------------------------------------------
        nfa(cfg, fn) /* Normalize Function Arguments */ {
            var arity, fn_name, names, q_idx, q_ridx, validate;
            switch(arity = arguments.length){
                case 1:
                    [cfg, fn] = [
                        {},
                        cfg
                    ];
                    break;
                case 2:
                    break;
                default:
                    throw new Runtime_arity_error(`\u{3A9}nfa___2 expected 1 or 2 arguments, got ${arity}`);
            }
            //.......................................................................................................
            /* TAINT do this in `gnd` */ if (!gnd.pod.isa(cfg)) throw new Type_error(`\u{3A9}nfa___3 expected a POD, got ${rpr(cfg)}`);
            if (!gnd.function.isa(fn)) throw new Type_error(`\u{3A9}nfa___4 expected a function, got ${rpr(cfg)}`);
            //.......................................................................................................
            cfg = {
                ...gnd.nfa_cfg.template,
                ...cfg
            };
            if (cfg.template != null) cfg.template = new Template(cfg.template);
            gnd.nfa_cfg.validate(cfg);
            //.......................................................................................................
            ({ names: names, q_idx: q_idx, q_ridx: q_ridx } = this.get_signature(fn));
            arity = names.length;
            fn_name = fn.name;
            //.......................................................................................................
            validate = cfg.isa != null ? create_validator(`${fn_name}_cfg`, cfg.isa) : function(x) {
                return x;
            };
            //.......................................................................................................
            return nameit(fn_name, function(...P) {
                /* ATP, `P` holds `arity` arguments and there *is* a POD in CFG position (which we assume to
               represent CFG so we can make a copy, filling in template values): */ var Q, i, idx, len, name;
                if (P.length > arity) throw new Positional_arity_error(`\u{3A9}nfa___5 expected up to ${arity} arguments, got ${P.length}`);
                //.....................................................................................................
                if (q_ridx === -2 && gnd.function.isa(P.at(-1))) {
                    if (gnd.pod.isa(P.at(q_ridx))) while(P.length < arity)push_at(P, q_ridx, void 0);
                    else while(P.length < arity)push_at(P, -1, void 0);
                }
                //.....................................................................................................
                if (gnd.pod.isa(P.at(q_ridx))) {
                    while(P.length < arity)push_at(P, q_ridx, void 0);
                    Q = set_at(P, q_ridx, gnd.pod.create(cfg.template, P.at(q_ridx)));
                } else {
                    while(P.length < arity)P.push(void 0);
                    /* ATP, `P` holds `arity` arguments and there *may be* an `undefined` in CFG position (which we
                 assume is replaceable by a newly created CFG instance with template values): */ if (P.at(q_ridx) === void 0) Q = set_at(P, q_ridx, gnd.pod.create(cfg.template));
                    else throw new Argument_type_error(`\u{3A9}nfa___6 expected an optional POD at position ${q_ridx}, got ${rpr(P.at(q_ridx))}`);
                }
                //.....................................................................................................
                /* Harmonize values: */ for(idx = i = 0, len = names.length; i < len; idx = ++i){
                    name = names[idx];
                    if (idx === q_idx /* skip over CFG object's (`Q`'s') position in P */ ) continue;
                    if (P[idx] === void 0) P[idx] = Q[name];
                    else Q[name] = P[idx];
                    if (Q[name] === void 0) Q[name] = P[idx];
                }
                //.....................................................................................................
                return validate(fn.call(this, ...P));
            });
        }
        //---------------------------------------------------------------------------------------------------------
        get_signature(fn) {
            /* thx to https://github.com/sindresorhus/identifier-regex */ var i, idx, jsid_re, len, name, names, names_rpr, q_idx, q_ridx, signature, this_cfg_q_name;
            this_cfg_q_name = 'cfg' /* TAINT pick from @cfg */ ;
            jsid_re = /^[$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}]*$/sv;
            //.......................................................................................................
            signature = fn.toString();
            signature = signature.replace(/\s+/svg, '');
            signature = signature.replace(/^[^\(]*\((?<parens>[^\)]*)\).*$/svg, '$<parens>');
            names = signature.split(',');
            //.......................................................................................................
            q_idx = null;
            for(idx = i = 0, len = names.length; i < len; idx = ++i){
                name = names[idx];
                if (jsid_re.test(name)) {
                    if (name === this_cfg_q_name) q_idx = idx;
                } else throw new Signature_disposition_Error(`\u{3A9}nfa___7 parameter disposition not compliant: ${rpr(name)} in ${rpr(signature)}`);
            }
            //.......................................................................................................
            if (q_idx == null) {
                names_rpr = names.join(', ');
                throw new Signature_naming_Error(`\u{3A9}nfa___8 parameter naming not compliant: no parameter named ${rpr(this_cfg_q_name)}, got ${rpr(names_rpr)}`);
            }
            //.......................................................................................................
            switch(q_idx){
                case names.length - 2:
                    q_ridx = -2;
                    break;
                case names.length - 1:
                    q_ridx = -1;
                    break;
                default:
                    throw new Signature_cfg_position_error(`\u{3A9}nfa___9 parameter ordering not compliant: expected ${rpr(this_cfg_q_name)} to come last or next-to-last, found it at index ${q_idx} of ${names.length} parameters`);
            }
            //.......................................................................................................
            return {
                names: names,
                q_idx: q_idx,
                q_ridx: q_ridx
            };
        }
    };
    //===========================================================================================================
    normalizer = new Normalize_function_arguments();
    ({ nfa: nfa, get_signature: get_signature } = normalizer);
    //===========================================================================================================
    module.exports = {
        nfa: nfa,
        get_signature: get_signature,
        Normalize_function_arguments: Normalize_function_arguments,
        Template: Template,
        internals: internals
    };
}).call(module.exports);


//# sourceMappingURL=main.js.map
