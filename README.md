<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Bric-A-Brac Standard Brics](#bric-a-brac-standard-brics)
  - [To Do](#to-do)
    - [Random](#random)
    - [Errors](#errors)

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

### Errors

* **`[—]`** custom error base class
  * **`[—]`** or multiple ones, each derived from a built-in class such as `RangeError`, `TypeError`,
    `AggregateError`

* **`[—]`** solution to capture existing error, issue new one a la Python's `raise Error_2 from Error_1`



