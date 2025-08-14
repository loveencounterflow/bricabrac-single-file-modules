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

* Like JavaScript's built-in `Math.random()` generator, this PRNG will generate evenly distributed values between
  `0` (inclusive) and `1` (exclusive) (i.e. *t* )

![red dot](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAJ/ycycAAAAASUVORK5CYII=)


* each type has dedicated methods to produce instances of each type:
  * a convenience function bearing the name of the type: `Get_random::float`

### Errors

* **`[—]`** custom error base class
  * **`[—]`** or multiple ones, each derived from a built-in class such as `RangeError`, `TypeError`,
    `AggregateError`

* **`[—]`** solution to capture existing error, issue new one a la Python's `raise Error_2 from Error_1`

### Other

* **`[—]`** publish `clean()` solution to the 'Assign-Problem with Intermediate Nulls and Undefineds' in the
  context of a Bric-A-Brac SFModule


