<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Bric-A-Brac Standard Brics](#bric-a-brac-standard-brics)
  - [To Do](#to-do)
    - [Random](#random)
      - [Random: Implementation Structure](#random-implementation-structure)
    - [Errors](#errors)
    - [Other](#other)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Bric-A-Brac Standard Brics


## To Do


### Random

* **`[—]`** Provide alternative to ditched `unique`, such as filling a `Set` to a certain size with
  characters
* **`[—]`** Provide internal implementations that capture attempt counts for testing, better insights
* **`[—]`** use custom class for `stats` that handles excessive retry counts
* **`[—]`** implement iterators
* **`[—]`** should `on_exhaustion`, `on_stats`, `max_retries` be implemented for each method?

#### Random: Implementation Structure

* the library currently supports four data types to generate instance values for: `float`, `integer`, `chr`,
  `text`
* for each case, instance values can be produced...
  * ...that are not smaller than a given `min`imum and not larger than a given `max`imum
  * ...that are `filter`ed according to a given RegEx pattern or an arbitrary function
  * ...that, in the case of `text`s, are not shorter and not longer than a given pair of `min`imum`_length`
    and `max`imum`_length`
  * ...that are unique in relation to a given collection (IOW that are new to a given collection)

* the foundational Pseudo-Random Number Generator (PRNG) that enables the generation of pseudo-random values
  is piece of code that I [found on the
  Internet](https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript)
  (duh), is called [*SplitMix32*](https://stackoverflow.com/a/47593316/7568091) and is, according to the
  poster,

  > A 32-bit state PRNG that was made by taking MurmurHash3's mixing function, adding a incrementor and
  > tweaking the constants. It's potentially one of the better 32-bit PRNGs so far; even the author of
  > Mulberry32 considers it to be the better choice. It's also just as fast.

* Like JavaScript's built-in `Math.random()` generator, this PRNG will generate evenly distributed values
  `t` between `0` (inclusive) and `1` (exclusive) (i.e. `0 < t ≤ 1`), but other than `Math.random()`, it
  allows to be given a `seed` to set its state to a known fixed point, from whence the series of random
  numbers to be generated will remain constant for each instantiation. This randomly-deterministic (or
  deterministically random, or 'random but foreseeable') operation is valuable for testing.

* Since the random core value `t` (accessible as `Get_random::_float()`) is always in the interval `[0,1)`,
  it's straightforward to both scale (stretch or shrink) it to any other length `[0,p)` and / or transpose
  (shift left or right) it to any other starting point `[q,q+1)`, meaning it can be projected into any
  interval `[min,max)` by computing `j = min + ( t * ( max - min ) )`. That projected value `j` can then be
  rounded e.g. to an integer number `n`, and that integer `n` can be interpreted as a [Unicode Code
  Point](https://de.wikipedia.org/wiki/Codepoint) and be used in `String.fromCodePoint()` to obtain a
  'character'. Since many Unicode codepoints are unassigned or contain control characters, `Get_random`
  methods will filter codepoints to include only 'printable' characters. Lastly, characters can be
  concatenated to strings which, again, can be made shorter or longer, be built from filtered codepoints
  from a narrowed set like, say, `/^[a-zA-ZäöüÄÖÜß]$/` (most commonly used letters to write German), or
  adhere to some predefined pattern or other arbitrary restrictions. It all comes out of `[0,1)` which I
  find amazing.

* A further desirable restriction on random values that is sometimes encountered is the exclusion of
  duplicates; `Get_random` can help with that.

* each type has dedicated methods to produce instances of each type:
  * a convenience function bearing the name of the type: `Get_random::float`


* **`[—]`** implement a 'raw codepoint' convenience method?

### Errors

* **`[—]`** custom error base class
  * **`[—]`** or multiple ones, each derived from a built-in class such as `RangeError`, `TypeError`,
    `AggregateError`

* **`[—]`** solution to capture existing error, issue new one a la Python's `raise Error_2 from Error_1`

### Other

* **`[—]`** publish `clean()` solution to the 'Assign-Problem with Intermediate Nulls and Undefineds' in the
  context of a Bric-A-Brac SFModule


