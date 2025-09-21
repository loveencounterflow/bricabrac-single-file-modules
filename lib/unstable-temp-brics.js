(function() {
  'use strict';
  var UNSTABLE_TEMP_BRICS;

  //###########################################################################################################

  //===========================================================================================================
  UNSTABLE_TEMP_BRICS = {
    //===========================================================================================================
    require_temp_internal_tmp: function() {
      var R;
      R = {};
      
    /*!
     * Tmp
     *
     * Copyright (c) 2011-2017 KARASZI Istvan <github@spam.raszi.hu>
     *
     * MIT Licensed
     */

    /*
     * Module dependencies.
     */
    const fs = require('node:fs');
    const os = require('node:os');
    const path = require('node:path');
    const crypto = require('node:crypto');
    const _c = { fs: fs.constants, os: os.constants };

    /*
     * The working inner variables.
     */
    const // the random characters to choose from
      RANDOM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      TEMPLATE_PATTERN = /XXXXXX/,
      DEFAULT_TRIES = 3,
      CREATE_FLAGS = (_c.O_CREAT || _c.fs.O_CREAT) | (_c.O_EXCL || _c.fs.O_EXCL) | (_c.O_RDWR || _c.fs.O_RDWR),
      // constants are off on the windows platform and will not match the actual errno codes
      IS_WIN32 = os.platform() === 'win32',
      EBADF = _c.EBADF || _c.os.errno.EBADF,
      ENOENT = _c.ENOENT || _c.os.errno.ENOENT,
      DIR_MODE = 0o700 /* 448 */,
      FILE_MODE = 0o600 /* 384 */,
      EXIT = 'exit',
      // this will hold the objects need to be removed on exit
      _removeObjects = [],
      // API change in fs.rmdirSync leads to error when passing in a second parameter, e.g. the callback
      FN_RMDIR_SYNC = fs.rmdirSync.bind(fs);

    let _gracefulCleanup = false;

    /**
     * Recursively remove a directory and its contents.
     *
     * @param {string} dirPath path of directory to remove
     * @param {Function} callback
     * @private
     */
    function rimraf(dirPath, callback) {
      return fs.rm(dirPath, { recursive: true }, callback);
    }

    /**
     * Recursively remove a directory and its contents, synchronously.
     *
     * @param {string} dirPath path of directory to remove
     * @private
     */
    function FN_RIMRAF_SYNC(dirPath) {
      return fs.rmSync(dirPath, { recursive: true });
    }

    /**
     * Gets a temporary file name.
     *
     * @param {(Options|tmpNameCallback)} options options or callback
     * @param {?tmpNameCallback} callback the callback function
     */
    function tmpName(options, callback) {
      const args = _parseArguments(options, callback),
        opts = args[0],
        cb = args[1];

      _assertAndSanitizeOptions(opts, function (err, sanitizedOptions) {
        if (err) return cb(err);

        let tries = sanitizedOptions.tries;
        (function _getUniqueName() {
          try {
            const name = _generateTmpName(sanitizedOptions);

            // check whether the path exists then retry if needed
            fs.stat(name, function (err) {
              /* istanbul ignore else */
              if (!err) {
                /* istanbul ignore else */
                if (tries-- > 0) return _getUniqueName();

                return cb(new Error('Could not get a unique tmp filename, max tries reached ' + name));
              }

              cb(null, name);
            });
          } catch (err) {
            cb(err);
          }
        })();
      });
    }

    /**
     * Synchronous version of tmpName.
     *
     * @param {Object} options
     * @returns {string} the generated random name
     * @throws {Error} if the options are invalid or could not generate a filename
     */
    function tmpNameSync(options) {
      const args = _parseArguments(options),
        opts = args[0];

      const sanitizedOptions = _assertAndSanitizeOptionsSync(opts);

      let tries = sanitizedOptions.tries;
      do {
        const name = _generateTmpName(sanitizedOptions);
        try {
          fs.statSync(name);
        } catch (e) {
          return name;
        }
      } while (tries-- > 0);

      throw new Error('Could not get a unique tmp filename, max tries reached');
    }

    /**
     * Creates and opens a temporary file.
     *
     * @param {(Options|null|undefined|fileCallback)} options the config options or the callback function or null or undefined
     * @param {?fileCallback} callback
     */
    function file(options, callback) {
      const args = _parseArguments(options, callback),
        opts = args[0],
        cb = args[1];

      // gets a temporary filename
      tmpName(opts, function _tmpNameCreated(err, name) {
        /* istanbul ignore else */
        if (err) return cb(err);

        // create and open the file
        fs.open(name, CREATE_FLAGS, opts.mode || FILE_MODE, function _fileCreated(err, fd) {
          /* istanbu ignore else */
          if (err) return cb(err);

          if (opts.discardDescriptor) {
            return fs.close(fd, function _discardCallback(possibleErr) {
              // the chance of getting an error on close here is rather low and might occur in the most edgiest cases only
              return cb(possibleErr, name, undefined, _prepareTmpFileRemoveCallback(name, -1, opts, false));
            });
          } else {
            // detachDescriptor passes the descriptor whereas discardDescriptor closes it, either way, we no longer care
            // about the descriptor
            const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
            cb(null, name, fd, _prepareTmpFileRemoveCallback(name, discardOrDetachDescriptor ? -1 : fd, opts, false));
          }
        });
      });
    }

    /**
     * Synchronous version of file.
     *
     * @param {Options} options
     * @returns {FileSyncObject} object consists of name, fd and removeCallback
     * @throws {Error} if cannot create a file
     */
    function fileSync(options) {
      const args = _parseArguments(options),
        opts = args[0];

      const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
      const name = tmpNameSync(opts);
      let fd = fs.openSync(name, CREATE_FLAGS, opts.mode || FILE_MODE);
      /* istanbul ignore else */
      if (opts.discardDescriptor) {
        fs.closeSync(fd);
        fd = undefined;
      }

      return {
        name: name,
        fd: fd,
        removeCallback: _prepareTmpFileRemoveCallback(name, discardOrDetachDescriptor ? -1 : fd, opts, true)
      };
    }

    /**
     * Creates a temporary directory.
     *
     * @param {(Options|dirCallback)} options the options or the callback function
     * @param {?dirCallback} callback
     */
    function dir(options, callback) {
      const args = _parseArguments(options, callback),
        opts = args[0],
        cb = args[1];

      // gets a temporary filename
      tmpName(opts, function _tmpNameCreated(err, name) {
        /* istanbul ignore else */
        if (err) return cb(err);

        // create the directory
        fs.mkdir(name, opts.mode || DIR_MODE, function _dirCreated(err) {
          /* istanbul ignore else */
          if (err) return cb(err);

          cb(null, name, _prepareTmpDirRemoveCallback(name, opts, false));
        });
      });
    }

    /**
     * Synchronous version of dir.
     *
     * @param {Options} options
     * @returns {DirSyncObject} object consists of name and removeCallback
     * @throws {Error} if it cannot create a directory
     */
    function dirSync(options) {
      const args = _parseArguments(options),
        opts = args[0];

      const name = tmpNameSync(opts);
      fs.mkdirSync(name, opts.mode || DIR_MODE);

      return {
        name: name,
        removeCallback: _prepareTmpDirRemoveCallback(name, opts, true)
      };
    }

    /**
     * Removes files asynchronously.
     *
     * @param {Object} fdPath
     * @param {Function} next
     * @private
     */
    function _removeFileAsync(fdPath, next) {
      const _handler = function (err) {
        if (err && !_isENOENT(err)) {
          // reraise any unanticipated error
          return next(err);
        }
        next();
      };

      if (0 <= fdPath[0])
        fs.close(fdPath[0], function () {
          fs.unlink(fdPath[1], _handler);
        });
      else fs.unlink(fdPath[1], _handler);
    }

    /**
     * Removes files synchronously.
     *
     * @param {Object} fdPath
     * @private
     */
    function _removeFileSync(fdPath) {
      let rethrownException = null;
      try {
        if (0 <= fdPath[0]) fs.closeSync(fdPath[0]);
      } catch (e) {
        // reraise any unanticipated error
        if (!_isEBADF(e) && !_isENOENT(e)) throw e;
      } finally {
        try {
          fs.unlinkSync(fdPath[1]);
        } catch (e) {
          // reraise any unanticipated error
          if (!_isENOENT(e)) rethrownException = e;
        }
      }
      if (rethrownException !== null) {
        throw rethrownException;
      }
    }

    /**
     * Prepares the callback for removal of the temporary file.
     *
     * Returns either a sync callback or a async callback depending on whether
     * fileSync or file was called, which is expressed by the sync parameter.
     *
     * @param {string} name the path of the file
     * @param {number} fd file descriptor
     * @param {Object} opts
     * @param {boolean} sync
     * @returns {fileCallback | fileCallbackSync}
     * @private
     */
    function _prepareTmpFileRemoveCallback(name, fd, opts, sync) {
      const removeCallbackSync = _prepareRemoveCallback(_removeFileSync, [fd, name], sync);
      const removeCallback = _prepareRemoveCallback(_removeFileAsync, [fd, name], sync, removeCallbackSync);

      if (!opts.keep) _removeObjects.unshift(removeCallbackSync);

      return sync ? removeCallbackSync : removeCallback;
    }

    /**
     * Prepares the callback for removal of the temporary directory.
     *
     * Returns either a sync callback or a async callback depending on whether
     * tmpFileSync or tmpFile was called, which is expressed by the sync parameter.
     *
     * @param {string} name
     * @param {Object} opts
     * @param {boolean} sync
     * @returns {Function} the callback
     * @private
     */
    function _prepareTmpDirRemoveCallback(name, opts, sync) {
      const removeFunction = opts.unsafeCleanup ? rimraf : fs.rmdir.bind(fs);
      const removeFunctionSync = opts.unsafeCleanup ? FN_RIMRAF_SYNC : FN_RMDIR_SYNC;
      const removeCallbackSync = _prepareRemoveCallback(removeFunctionSync, name, sync);
      const removeCallback = _prepareRemoveCallback(removeFunction, name, sync, removeCallbackSync);
      if (!opts.keep) _removeObjects.unshift(removeCallbackSync);

      return sync ? removeCallbackSync : removeCallback;
    }

    /**
     * Creates a guarded function wrapping the removeFunction call.
     *
     * The cleanup callback is save to be called multiple times.
     * Subsequent invocations will be ignored.
     *
     * @param {Function} removeFunction
     * @param {string} fileOrDirName
     * @param {boolean} sync
     * @param {cleanupCallbackSync?} cleanupCallbackSync
     * @returns {cleanupCallback | cleanupCallbackSync}
     * @private
     */
    function _prepareRemoveCallback(removeFunction, fileOrDirName, sync, cleanupCallbackSync) {
      let called = false;

      // if sync is true, the next parameter will be ignored
      return function _cleanupCallback(next) {
        /* istanbul ignore else */
        if (!called) {
          // remove cleanupCallback from cache
          const toRemove = cleanupCallbackSync || _cleanupCallback;
          const index = _removeObjects.indexOf(toRemove);
          /* istanbul ignore else */
          if (index >= 0) _removeObjects.splice(index, 1);

          called = true;
          if (sync || removeFunction === FN_RMDIR_SYNC || removeFunction === FN_RIMRAF_SYNC) {
            return removeFunction(fileOrDirName);
          } else {
            return removeFunction(fileOrDirName, next || function () {});
          }
        }
      };
    }

    /**
     * The garbage collector.
     *
     * @private
     */
    function _garbageCollector() {
      /* istanbul ignore else */
      if (!_gracefulCleanup) return;

      // the function being called removes itself from _removeObjects,
      // loop until _removeObjects is empty
      while (_removeObjects.length) {
        try {
          _removeObjects[0]();
        } catch (e) {
          // already removed?
        }
      }
    }

    /**
     * Random name generator based on crypto.
     * Adapted from http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
     *
     * @param {number} howMany
     * @returns {string} the generated random name
     * @private
     */
    function _randomChars(howMany) {
      let value = [],
        rnd = null;

      // make sure that we do not fail because we ran out of entropy
      try {
        rnd = crypto.randomBytes(howMany);
      } catch (e) {
        rnd = crypto.pseudoRandomBytes(howMany);
      }

      for (let i = 0; i < howMany; i++) {
        value.push(RANDOM_CHARS[rnd[i] % RANDOM_CHARS.length]);
      }

      return value.join('');
    }

    /**
     * Checks whether the `obj` parameter is defined or not.
     *
     * @param {Object} obj
     * @returns {boolean} true if the object is undefined
     * @private
     */
    function _isUndefined(obj) {
      return typeof obj === 'undefined';
    }

    /**
     * Parses the function arguments.
     *
     * This function helps to have optional arguments.
     *
     * @param {(Options|null|undefined|Function)} options
     * @param {?Function} callback
     * @returns {Array} parsed arguments
     * @private
     */
    function _parseArguments(options, callback) {
      /* istanbul ignore else */
      if (typeof options === 'function') {
        return [{}, options];
      }

      /* istanbul ignore else */
      if (_isUndefined(options)) {
        return [{}, callback];
      }

      // copy options so we do not leak the changes we make internally
      const actualOptions = {};
      for (const key of Object.getOwnPropertyNames(options)) {
        actualOptions[key] = options[key];
      }

      return [actualOptions, callback];
    }

    /**
     * Resolve the specified path name in respect to tmpDir.
     *
     * The specified name might include relative path components, e.g. ../
     * so we need to resolve in order to be sure that is is located inside tmpDir
     *
     * @private
     */
    function _resolvePath(name, tmpDir, cb) {
      const pathToResolve = path.isAbsolute(name) ? name : path.join(tmpDir, name);

      fs.stat(pathToResolve, function (err) {
        if (err) {
          fs.realpath(path.dirname(pathToResolve), function (err, parentDir) {
            if (err) return cb(err);

            cb(null, path.join(parentDir, path.basename(pathToResolve)));
          });
        } else {
          fs.realpath(pathToResolve, cb);
        }
      });
    }

    /**
     * Resolve the specified path name in respect to tmpDir.
     *
     * The specified name might include relative path components, e.g. ../
     * so we need to resolve in order to be sure that is is located inside tmpDir
     *
     * @private
     */
    function _resolvePathSync(name, tmpDir) {
      const pathToResolve = path.isAbsolute(name) ? name : path.join(tmpDir, name);

      try {
        fs.statSync(pathToResolve);
        return fs.realpathSync(pathToResolve);
      } catch (_err) {
        const parentDir = fs.realpathSync(path.dirname(pathToResolve));

        return path.join(parentDir, path.basename(pathToResolve));
      }
    }

    /**
     * Generates a new temporary name.
     *
     * @param {Object} opts
     * @returns {string} the new random name according to opts
     * @private
     */
    function _generateTmpName(opts) {
      const tmpDir = opts.tmpdir;

      /* istanbul ignore else */
      if (!_isUndefined(opts.name)) {
        return path.join(tmpDir, opts.dir, opts.name);
      }

      /* istanbul ignore else */
      if (!_isUndefined(opts.template)) {
        return path.join(tmpDir, opts.dir, opts.template).replace(TEMPLATE_PATTERN, _randomChars(6));
      }

      // prefix and postfix
      const name = [
        opts.prefix ? opts.prefix : 'tmp',
        '-',
        process.pid,
        '-',
        _randomChars(12),
        opts.postfix ? '-' + opts.postfix : ''
      ].join('');

      return path.join(tmpDir, opts.dir, name);
    }

    /**
     * Asserts and sanitizes the basic options.
     *
     * @private
     */
    function _assertOptionsBase(options) {
      if (!_isUndefined(options.name)) {
        const name = options.name;

        // assert that name is not absolute and does not contain a path
        if (path.isAbsolute(name)) throw new Error(`name option must not contain an absolute path, found "${name}".`);

        // must not fail on valid .<name> or ..<name> or similar such constructs
        const basename = path.basename(name);
        if (basename === '..' || basename === '.' || basename !== name)
          throw new Error(`name option must not contain a path, found "${name}".`);
      }

      /* istanbul ignore else */
      if (!_isUndefined(options.template) && !options.template.match(TEMPLATE_PATTERN)) {
        throw new Error(`Invalid template, found "${options.template}".`);
      }

      /* istanbul ignore else */
      if ((!_isUndefined(options.tries) && isNaN(options.tries)) || options.tries < 0) {
        throw new Error(`Invalid tries, found "${options.tries}".`);
      }

      // if a name was specified we will try once
      options.tries = _isUndefined(options.name) ? options.tries || DEFAULT_TRIES : 1;
      options.keep = !!options.keep;
      options.detachDescriptor = !!options.detachDescriptor;
      options.discardDescriptor = !!options.discardDescriptor;
      options.unsafeCleanup = !!options.unsafeCleanup;

      // for completeness' sake only, also keep (multiple) blanks if the user, purportedly sane, requests us to
      options.prefix = _isUndefined(options.prefix) ? '' : options.prefix;
      options.postfix = _isUndefined(options.postfix) ? '' : options.postfix;
    }

    /**
     * Gets the relative directory to tmpDir.
     *
     * @private
     */
    function _getRelativePath(option, name, tmpDir, cb) {
      if (_isUndefined(name)) return cb(null);

      _resolvePath(name, tmpDir, function (err, resolvedPath) {
        if (err) return cb(err);

        const relativePath = path.relative(tmpDir, resolvedPath);

        if (!resolvedPath.startsWith(tmpDir)) {
          return cb(new Error(`${option} option must be relative to "${tmpDir}", found "${relativePath}".`));
        }

        cb(null, relativePath);
      });
    }

    /**
     * Gets the relative path to tmpDir.
     *
     * @private
     */
    function _getRelativePathSync(option, name, tmpDir) {
      if (_isUndefined(name)) return;

      const resolvedPath = _resolvePathSync(name, tmpDir);
      const relativePath = path.relative(tmpDir, resolvedPath);

      if (!resolvedPath.startsWith(tmpDir)) {
        throw new Error(`${option} option must be relative to "${tmpDir}", found "${relativePath}".`);
      }

      return relativePath;
    }

    /**
     * Asserts whether the specified options are valid, also sanitizes options and provides sane defaults for missing
     * options.
     *
     * @private
     */
    function _assertAndSanitizeOptions(options, cb) {
      _getTmpDir(options, function (err, tmpDir) {
        if (err) return cb(err);

        options.tmpdir = tmpDir;

        try {
          _assertOptionsBase(options, tmpDir);
        } catch (err) {
          return cb(err);
        }

        // sanitize dir, also keep (multiple) blanks if the user, purportedly sane, requests us to
        _getRelativePath('dir', options.dir, tmpDir, function (err, dir) {
          if (err) return cb(err);

          options.dir = _isUndefined(dir) ? '' : dir;

          // sanitize further if template is relative to options.dir
          _getRelativePath('template', options.template, tmpDir, function (err, template) {
            if (err) return cb(err);

            options.template = template;

            cb(null, options);
          });
        });
      });
    }

    /**
     * Asserts whether the specified options are valid, also sanitizes options and provides sane defaults for missing
     * options.
     *
     * @private
     */
    function _assertAndSanitizeOptionsSync(options) {
      const tmpDir = (options.tmpdir = _getTmpDirSync(options));

      _assertOptionsBase(options, tmpDir);

      const dir = _getRelativePathSync('dir', options.dir, tmpDir);
      options.dir = _isUndefined(dir) ? '' : dir;

      options.template = _getRelativePathSync('template', options.template, tmpDir);

      return options;
    }

    /**
     * Helper for testing against EBADF to compensate changes made to Node 7.x under Windows.
     *
     * @private
     */
    function _isEBADF(error) {
      return _isExpectedError(error, -EBADF, 'EBADF');
    }

    /**
     * Helper for testing against ENOENT to compensate changes made to Node 7.x under Windows.
     *
     * @private
     */
    function _isENOENT(error) {
      return _isExpectedError(error, -ENOENT, 'ENOENT');
    }

    /**
     * Helper to determine whether the expected error code matches the actual code and errno,
     * which will differ between the supported node versions.
     *
     * - Node >= 7.0:
     *   error.code {string}
     *   error.errno {number} any numerical value will be negated
     *
     * CAVEAT
     *
     * On windows, the errno for EBADF is -4083 but os.constants.errno.EBADF is different and we must assume that ENOENT
     * is no different here.
     *
     * @param {SystemError} error
     * @param {number} errno
     * @param {string} code
     * @private
     */
    function _isExpectedError(error, errno, code) {
      return IS_WIN32 ? error.code === code : error.code === code && error.errno === errno;
    }

    /**
     * Sets the graceful cleanup.
     *
     * If graceful cleanup is set, tmp will remove all controlled temporary objects on process exit, otherwise the
     * temporary objects will remain in place, waiting to be cleaned up on system restart or otherwise scheduled temporary
     * object removals.
     */
    function setGracefulCleanup() {
      _gracefulCleanup = true;
    }

    /**
     * Returns the currently configured tmp dir from os.tmpdir().
     *
     * @private
     */
    function _getTmpDir(options, cb) {
      return fs.realpath((options && options.tmpdir) || os.tmpdir(), cb);
    }

    /**
     * Returns the currently configured tmp dir from os.tmpdir().
     *
     * @private
     */
    function _getTmpDirSync(options) {
      return fs.realpathSync((options && options.tmpdir) || os.tmpdir());
    }

    // Install process exit listener
    process.addListener(EXIT, _garbageCollector);

    /**
     * Configuration options.
     *
     * @typedef {Object} Options
     * @property {?boolean} keep the temporary object (file or dir) will not be garbage collected
     * @property {?number} tries the number of tries before give up the name generation
     * @property (?int) mode the access mode, defaults are 0o700 for directories and 0o600 for files
     * @property {?string} template the "mkstemp" like filename template
     * @property {?string} name fixed name relative to tmpdir or the specified dir option
     * @property {?string} dir tmp directory relative to the root tmp directory in use
     * @property {?string} prefix prefix for the generated name
     * @property {?string} postfix postfix for the generated name
     * @property {?string} tmpdir the root tmp directory which overrides the os tmpdir
     * @property {?boolean} unsafeCleanup recursively removes the created temporary directory, even when it's not empty
     * @property {?boolean} detachDescriptor detaches the file descriptor, caller is responsible for closing the file, tmp will no longer try closing the file during garbage collection
     * @property {?boolean} discardDescriptor discards the file descriptor (closes file, fd is -1), tmp will no longer try closing the file during garbage collection
     */

    /**
     * @typedef {Object} FileSyncObject
     * @property {string} name the name of the file
     * @property {string} fd the file descriptor or -1 if the fd has been discarded
     * @property {fileCallback} removeCallback the callback function to remove the file
     */

    /**
     * @typedef {Object} DirSyncObject
     * @property {string} name the name of the directory
     * @property {fileCallback} removeCallback the callback function to remove the directory
     */

    /**
     * @callback tmpNameCallback
     * @param {?Error} err the error object if anything goes wrong
     * @param {string} name the temporary file name
     */

    /**
     * @callback fileCallback
     * @param {?Error} err the error object if anything goes wrong
     * @param {string} name the temporary file name
     * @param {number} fd the file descriptor or -1 if the fd had been discarded
     * @param {cleanupCallback} fn the cleanup callback function
     */

    /**
     * @callback fileCallbackSync
     * @param {?Error} err the error object if anything goes wrong
     * @param {string} name the temporary file name
     * @param {number} fd the file descriptor or -1 if the fd had been discarded
     * @param {cleanupCallbackSync} fn the cleanup callback function
     */

    /**
     * @callback dirCallback
     * @param {?Error} err the error object if anything goes wrong
     * @param {string} name the temporary file name
     * @param {cleanupCallback} fn the cleanup callback function
     */

    /**
     * @callback dirCallbackSync
     * @param {?Error} err the error object if anything goes wrong
     * @param {string} name the temporary file name
     * @param {cleanupCallbackSync} fn the cleanup callback function
     */

    /**
     * Removes the temporary created file or directory.
     *
     * @callback cleanupCallback
     * @param {simpleCallback} [next] function to call whenever the tmp object needs to be removed
     */

    /**
     * Removes the temporary created file or directory.
     *
     * @callback cleanupCallbackSync
     */

    /**
     * Callback function for function composition.
     * @see {@link https://github.com/raszi/node-tmp/issues/57|raszi/node-tmp#57}
     *
     * @callback simpleCallback
     */

    // exporting all the needed methods

    // evaluate _getTmpDir() lazily, mainly for simplifying testing but it also will
    // allow users to reconfigure the temporary directory
    Object.defineProperty(R, 'tmpdir', {
      enumerable: true,
      configurable: false,
      get: function () {
        return _getTmpDirSync();
      }
    });

    R.dir = dir;
    R.dirSync = dirSync;

    R.file = file;
    R.fileSync = fileSync;

    R.tmpName = tmpName;
    R.tmpNameSync = tmpNameSync;

    R.setGracefulCleanup = setGracefulCleanup;
    ;
      return R;
    },
    //===========================================================================================================
    /* NOTE Future Single-File Module */
    require_temp: function() {
      var TEMP, Temp, debug, exports, internals, templates;
      //=========================================================================================================
      ({debug} = console);
      //---------------------------------------------------------------------------------------------------------
      templates = Object.freeze({
        temp: {
          keep: false,
          prefix: 'brics.temp-',
          suffix: ''
        }
      });
      //---------------------------------------------------------------------------------------------------------
      TEMP = UNSTABLE_TEMP_BRICS.require_temp_internal_tmp();
      internals = {templates};
      //===========================================================================================================
      Temp = class Temp {
        //---------------------------------------------------------------------------------------------------------
        constructor() {
          return void 0;
        }

        //-------------------------------------------------------------------------------------------------------
        with_file(cfg, handler) {
          var arity, type;
          switch (arity = arguments.length) {
            case 1:
              [cfg, handler] = [null, cfg];
              break;
            case 2:
              null;
              break;
            default:
              throw new Error(`expected 1 or 2 arguments, got ${arity}`);
          }
          cfg = {...templates.temp, ...cfg};
          type = Object.prototype.toString.call(handler);
          if (type === '[object AsyncFunction]') {
            return this._with_file_async(cfg, handler);
          }
          if (type === '[object Function]') {
            return this._with_file_sync(cfg, handler);
          }
          throw new Error(`^guy.temp@1^ expected an (sync or async) function, got a ${type}`);
        }

        //-------------------------------------------------------------------------------------------------------
        with_directory(cfg, handler) {
          var arity, type;
          switch (arity = arguments.length) {
            case 1:
              [cfg, handler] = [null, cfg];
              break;
            case 2:
              null;
              break;
            default:
              throw new Error(`expected 1 or 2 arguments, got ${arity}`);
          }
          cfg = {...templates.temp, ...cfg};
          type = Object.prototype.toString.call(handler);
          if (type === '[object AsyncFunction]') {
            return this._with_directory_async(cfg, handler);
          }
          if (type === '[object Function]') {
            return this._with_directory_sync(cfg, handler);
          }
          throw new Error(`^guy.temp@2^ expected an (sync or async) function, got a ${type}`);
        }

        //-------------------------------------------------------------------------------------------------------
        _with_file_sync(cfg, handler) {
          var fd, path, removeCallback;
          ({
            name: path,
            fd,
            removeCallback
          } = TEMP.fileSync(cfg));
          try {
            handler({path, fd});
          } finally {
            if (!cfg.keep) {
              removeCallback();
            }
          }
          return null;
        }

        //-------------------------------------------------------------------------------------------------------
        _with_directory_sync(cfg, handler) {
          var FS, path;
          FS = require('node:fs');
          ({
            name: path
          } = TEMP.dirSync(cfg));
          try {
            handler({path});
          } finally {
            if (!cfg.keep) {
              FS.rmSync(path, {
                recursive: true
              });
            }
          }
          return null;
        }

        //-------------------------------------------------------------------------------------------------------
        async _with_file_async(cfg, handler) {
          var fd, path, removeCallback;
          ({
            name: path,
            fd,
            removeCallback
          } = TEMP.fileSync(cfg));
          try {
            await handler({path, fd});
          } finally {
            if (!cfg.keep) {
              removeCallback();
            }
          }
          return null;
        }

        //-------------------------------------------------------------------------------------------------------
        async _with_directory_async(cfg, handler) {
          var FS, arity, path;
          switch (arity = arguments.length) {
            case 1:
              [cfg, handler] = [null, cfg];
              break;
            case 2:
              null;
              break;
            default:
              throw new Error(`expected 1 or 2 arguments, got ${arity}`);
          }
          cfg = {...templates.temp, ...cfg};
          FS = require('node:fs');
          ({
            name: path
          } = TEMP.dirSync(cfg));
          try {
            await handler({path});
          } finally {
            if (!cfg.keep) {
              FS.rmSync(path, {
                recursive: true
              });
            }
          }
          return null;
        }

        //-------------------------------------------------------------------------------------------------------
        create_directory(cfg) {
          var FS, path, rm;
          FS = require('node:fs');
          cfg = {...templates.temp, ...cfg};
          ({
            name: path
          } = TEMP.dirSync(cfg));
          rm = function() {
            return FS.rmSync(path, {
              recursive: true
            });
          };
          return {path, rm};
        }

      };
      //=========================================================================================================
      internals = Object.freeze({...internals, Temp});
      return exports = {
        temp: new Temp(),
        // Temp,
        internals
      };
    }
  };

  //===========================================================================================================
  Object.assign(module.exports, UNSTABLE_TEMP_BRICS);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLXRlbXAtYnJpY3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLG1CQUFBOzs7OztFQUtBLG1CQUFBLEdBR0UsQ0FBQTs7SUFBQSx5QkFBQSxFQUEyQixRQUFBLENBQUEsQ0FBQTtBQUM3QixVQUFBO01BQUksQ0FBQSxHQUFJLENBQUE7TUFDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QixDQUFBO1lBQUUsSUFBQSxFQUFNO1VBQVIsQ0FBQSxHQUFrQixJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWIsQ0FBbEI7VUFDQSxFQUFBLEdBQWtCLFFBQUEsQ0FBQSxDQUFBO21CQUFHLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBVixFQUFnQjtjQUFFLFNBQUEsRUFBVztZQUFiLENBQWhCO1VBQUg7QUFDbEIsaUJBQU8sQ0FBRSxJQUFGLEVBQVEsRUFBUjtRQUxTOztNQXRFcEIsRUFmSjs7TUE4RkksU0FBQSxHQUFZLE1BQU0sQ0FBQyxNQUFQLENBQWMsQ0FBRSxHQUFBLFNBQUYsRUFBZ0IsSUFBaEIsQ0FBZDtBQUNaLGFBQU8sT0FBQSxHQUFVO1FBQ2YsSUFBQSxFQUFNLElBQUksSUFBSixDQUFBLENBRFM7O1FBR2Y7TUFIZTtJQWpHTDtFQWwxQmQsRUFSRjs7O0VBazhCQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixtQkFBOUI7QUFsOEJBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5VTlNUQUJMRV9URU1QX0JSSUNTID1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgcmVxdWlyZV90ZW1wX2ludGVybmFsX3RtcDogLT5cbiAgICBSID0ge31cbiAgICBgYGBcbiAgICAvKiFcbiAgICAgKiBUbXBcbiAgICAgKlxuICAgICAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE3IEtBUkFTWkkgSXN0dmFuIDxnaXRodWJAc3BhbS5yYXN6aS5odT5cbiAgICAgKlxuICAgICAqIE1JVCBMaWNlbnNlZFxuICAgICAqL1xuXG4gICAgLypcbiAgICAgKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICAgICAqL1xuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnbm9kZTpmcycpO1xuICAgIGNvbnN0IG9zID0gcmVxdWlyZSgnbm9kZTpvcycpO1xuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdub2RlOnBhdGgnKTtcbiAgICBjb25zdCBjcnlwdG8gPSByZXF1aXJlKCdub2RlOmNyeXB0bycpO1xuICAgIGNvbnN0IF9jID0geyBmczogZnMuY29uc3RhbnRzLCBvczogb3MuY29uc3RhbnRzIH07XG5cbiAgICAvKlxuICAgICAqIFRoZSB3b3JraW5nIGlubmVyIHZhcmlhYmxlcy5cbiAgICAgKi9cbiAgICBjb25zdCAvLyB0aGUgcmFuZG9tIGNoYXJhY3RlcnMgdG8gY2hvb3NlIGZyb21cbiAgICAgIFJBTkRPTV9DSEFSUyA9ICcwMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicsXG4gICAgICBURU1QTEFURV9QQVRURVJOID0gL1hYWFhYWC8sXG4gICAgICBERUZBVUxUX1RSSUVTID0gMyxcbiAgICAgIENSRUFURV9GTEFHUyA9IChfYy5PX0NSRUFUIHx8IF9jLmZzLk9fQ1JFQVQpIHwgKF9jLk9fRVhDTCB8fCBfYy5mcy5PX0VYQ0wpIHwgKF9jLk9fUkRXUiB8fCBfYy5mcy5PX1JEV1IpLFxuICAgICAgLy8gY29uc3RhbnRzIGFyZSBvZmYgb24gdGhlIHdpbmRvd3MgcGxhdGZvcm0gYW5kIHdpbGwgbm90IG1hdGNoIHRoZSBhY3R1YWwgZXJybm8gY29kZXNcbiAgICAgIElTX1dJTjMyID0gb3MucGxhdGZvcm0oKSA9PT0gJ3dpbjMyJyxcbiAgICAgIEVCQURGID0gX2MuRUJBREYgfHwgX2Mub3MuZXJybm8uRUJBREYsXG4gICAgICBFTk9FTlQgPSBfYy5FTk9FTlQgfHwgX2Mub3MuZXJybm8uRU5PRU5ULFxuICAgICAgRElSX01PREUgPSAwbzcwMCAvKiA0NDggKi8sXG4gICAgICBGSUxFX01PREUgPSAwbzYwMCAvKiAzODQgKi8sXG4gICAgICBFWElUID0gJ2V4aXQnLFxuICAgICAgLy8gdGhpcyB3aWxsIGhvbGQgdGhlIG9iamVjdHMgbmVlZCB0byBiZSByZW1vdmVkIG9uIGV4aXRcbiAgICAgIF9yZW1vdmVPYmplY3RzID0gW10sXG4gICAgICAvLyBBUEkgY2hhbmdlIGluIGZzLnJtZGlyU3luYyBsZWFkcyB0byBlcnJvciB3aGVuIHBhc3NpbmcgaW4gYSBzZWNvbmQgcGFyYW1ldGVyLCBlLmcuIHRoZSBjYWxsYmFja1xuICAgICAgRk5fUk1ESVJfU1lOQyA9IGZzLnJtZGlyU3luYy5iaW5kKGZzKTtcblxuICAgIGxldCBfZ3JhY2VmdWxDbGVhbnVwID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBSZWN1cnNpdmVseSByZW1vdmUgYSBkaXJlY3RvcnkgYW5kIGl0cyBjb250ZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkaXJQYXRoIHBhdGggb2YgZGlyZWN0b3J5IHRvIHJlbW92ZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByaW1yYWYoZGlyUGF0aCwgY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiBmcy5ybShkaXJQYXRoLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9LCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVjdXJzaXZlbHkgcmVtb3ZlIGEgZGlyZWN0b3J5IGFuZCBpdHMgY29udGVudHMsIHN5bmNocm9ub3VzbHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGlyUGF0aCBwYXRoIG9mIGRpcmVjdG9yeSB0byByZW1vdmVcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEZOX1JJTVJBRl9TWU5DKGRpclBhdGgpIHtcbiAgICAgIHJldHVybiBmcy5ybVN5bmMoZGlyUGF0aCwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIHRlbXBvcmFyeSBmaWxlIG5hbWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyhPcHRpb25zfHRtcE5hbWVDYWxsYmFjayl9IG9wdGlvbnMgb3B0aW9ucyBvciBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7P3RtcE5hbWVDYWxsYmFja30gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICovXG4gICAgZnVuY3Rpb24gdG1wTmFtZShvcHRpb25zLCBjYWxsYmFjaykge1xuICAgICAgY29uc3QgYXJncyA9IF9wYXJzZUFyZ3VtZW50cyhvcHRpb25zLCBjYWxsYmFjayksXG4gICAgICAgIG9wdHMgPSBhcmdzWzBdLFxuICAgICAgICBjYiA9IGFyZ3NbMV07XG5cbiAgICAgIF9hc3NlcnRBbmRTYW5pdGl6ZU9wdGlvbnMob3B0cywgZnVuY3Rpb24gKGVyciwgc2FuaXRpemVkT3B0aW9ucykge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKTtcblxuICAgICAgICBsZXQgdHJpZXMgPSBzYW5pdGl6ZWRPcHRpb25zLnRyaWVzO1xuICAgICAgICAoZnVuY3Rpb24gX2dldFVuaXF1ZU5hbWUoKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBfZ2VuZXJhdGVUbXBOYW1lKHNhbml0aXplZE9wdGlvbnMpO1xuXG4gICAgICAgICAgICAvLyBjaGVjayB3aGV0aGVyIHRoZSBwYXRoIGV4aXN0cyB0aGVuIHJldHJ5IGlmIG5lZWRlZFxuICAgICAgICAgICAgZnMuc3RhdChuYW1lLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICAgICAgICBpZiAodHJpZXMtLSA+IDApIHJldHVybiBfZ2V0VW5pcXVlTmFtZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcignQ291bGQgbm90IGdldCBhIHVuaXF1ZSB0bXAgZmlsZW5hbWUsIG1heCB0cmllcyByZWFjaGVkICcgKyBuYW1lKSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjYihudWxsLCBuYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY2IoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTeW5jaHJvbm91cyB2ZXJzaW9uIG9mIHRtcE5hbWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBnZW5lcmF0ZWQgcmFuZG9tIG5hbWVcbiAgICAgKiBAdGhyb3dzIHtFcnJvcn0gaWYgdGhlIG9wdGlvbnMgYXJlIGludmFsaWQgb3IgY291bGQgbm90IGdlbmVyYXRlIGEgZmlsZW5hbWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0bXBOYW1lU3luYyhvcHRpb25zKSB7XG4gICAgICBjb25zdCBhcmdzID0gX3BhcnNlQXJndW1lbnRzKG9wdGlvbnMpLFxuICAgICAgICBvcHRzID0gYXJnc1swXTtcblxuICAgICAgY29uc3Qgc2FuaXRpemVkT3B0aW9ucyA9IF9hc3NlcnRBbmRTYW5pdGl6ZU9wdGlvbnNTeW5jKG9wdHMpO1xuXG4gICAgICBsZXQgdHJpZXMgPSBzYW5pdGl6ZWRPcHRpb25zLnRyaWVzO1xuICAgICAgZG8ge1xuICAgICAgICBjb25zdCBuYW1lID0gX2dlbmVyYXRlVG1wTmFtZShzYW5pdGl6ZWRPcHRpb25zKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmcy5zdGF0U3luYyhuYW1lKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgICB9XG4gICAgICB9IHdoaWxlICh0cmllcy0tID4gMCk7XG5cbiAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGdldCBhIHVuaXF1ZSB0bXAgZmlsZW5hbWUsIG1heCB0cmllcyByZWFjaGVkJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbmQgb3BlbnMgYSB0ZW1wb3JhcnkgZmlsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7KE9wdGlvbnN8bnVsbHx1bmRlZmluZWR8ZmlsZUNhbGxiYWNrKX0gb3B0aW9ucyB0aGUgY29uZmlnIG9wdGlvbnMgb3IgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIG51bGwgb3IgdW5kZWZpbmVkXG4gICAgICogQHBhcmFtIHs/ZmlsZUNhbGxiYWNrfSBjYWxsYmFja1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbGUob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICAgIGNvbnN0IGFyZ3MgPSBfcGFyc2VBcmd1bWVudHMob3B0aW9ucywgY2FsbGJhY2spLFxuICAgICAgICBvcHRzID0gYXJnc1swXSxcbiAgICAgICAgY2IgPSBhcmdzWzFdO1xuXG4gICAgICAvLyBnZXRzIGEgdGVtcG9yYXJ5IGZpbGVuYW1lXG4gICAgICB0bXBOYW1lKG9wdHMsIGZ1bmN0aW9uIF90bXBOYW1lQ3JlYXRlZChlcnIsIG5hbWUpIHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycik7XG5cbiAgICAgICAgLy8gY3JlYXRlIGFuZCBvcGVuIHRoZSBmaWxlXG4gICAgICAgIGZzLm9wZW4obmFtZSwgQ1JFQVRFX0ZMQUdTLCBvcHRzLm1vZGUgfHwgRklMRV9NT0RFLCBmdW5jdGlvbiBfZmlsZUNyZWF0ZWQoZXJyLCBmZCkge1xuICAgICAgICAgIC8qIGlzdGFuYnUgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKTtcblxuICAgICAgICAgIGlmIChvcHRzLmRpc2NhcmREZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZnMuY2xvc2UoZmQsIGZ1bmN0aW9uIF9kaXNjYXJkQ2FsbGJhY2socG9zc2libGVFcnIpIHtcbiAgICAgICAgICAgICAgLy8gdGhlIGNoYW5jZSBvZiBnZXR0aW5nIGFuIGVycm9yIG9uIGNsb3NlIGhlcmUgaXMgcmF0aGVyIGxvdyBhbmQgbWlnaHQgb2NjdXIgaW4gdGhlIG1vc3QgZWRnaWVzdCBjYXNlcyBvbmx5XG4gICAgICAgICAgICAgIHJldHVybiBjYihwb3NzaWJsZUVyciwgbmFtZSwgdW5kZWZpbmVkLCBfcHJlcGFyZVRtcEZpbGVSZW1vdmVDYWxsYmFjayhuYW1lLCAtMSwgb3B0cywgZmFsc2UpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBkZXRhY2hEZXNjcmlwdG9yIHBhc3NlcyB0aGUgZGVzY3JpcHRvciB3aGVyZWFzIGRpc2NhcmREZXNjcmlwdG9yIGNsb3NlcyBpdCwgZWl0aGVyIHdheSwgd2Ugbm8gbG9uZ2VyIGNhcmVcbiAgICAgICAgICAgIC8vIGFib3V0IHRoZSBkZXNjcmlwdG9yXG4gICAgICAgICAgICBjb25zdCBkaXNjYXJkT3JEZXRhY2hEZXNjcmlwdG9yID0gb3B0cy5kaXNjYXJkRGVzY3JpcHRvciB8fCBvcHRzLmRldGFjaERlc2NyaXB0b3I7XG4gICAgICAgICAgICBjYihudWxsLCBuYW1lLCBmZCwgX3ByZXBhcmVUbXBGaWxlUmVtb3ZlQ2FsbGJhY2sobmFtZSwgZGlzY2FyZE9yRGV0YWNoRGVzY3JpcHRvciA/IC0xIDogZmQsIG9wdHMsIGZhbHNlKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN5bmNocm9ub3VzIHZlcnNpb24gb2YgZmlsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T3B0aW9uc30gb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHtGaWxlU3luY09iamVjdH0gb2JqZWN0IGNvbnNpc3RzIG9mIG5hbWUsIGZkIGFuZCByZW1vdmVDYWxsYmFja1xuICAgICAqIEB0aHJvd3Mge0Vycm9yfSBpZiBjYW5ub3QgY3JlYXRlIGEgZmlsZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbGVTeW5jKG9wdGlvbnMpIHtcbiAgICAgIGNvbnN0IGFyZ3MgPSBfcGFyc2VBcmd1bWVudHMob3B0aW9ucyksXG4gICAgICAgIG9wdHMgPSBhcmdzWzBdO1xuXG4gICAgICBjb25zdCBkaXNjYXJkT3JEZXRhY2hEZXNjcmlwdG9yID0gb3B0cy5kaXNjYXJkRGVzY3JpcHRvciB8fCBvcHRzLmRldGFjaERlc2NyaXB0b3I7XG4gICAgICBjb25zdCBuYW1lID0gdG1wTmFtZVN5bmMob3B0cyk7XG4gICAgICBsZXQgZmQgPSBmcy5vcGVuU3luYyhuYW1lLCBDUkVBVEVfRkxBR1MsIG9wdHMubW9kZSB8fCBGSUxFX01PREUpO1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmIChvcHRzLmRpc2NhcmREZXNjcmlwdG9yKSB7XG4gICAgICAgIGZzLmNsb3NlU3luYyhmZCk7XG4gICAgICAgIGZkID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBmZDogZmQsXG4gICAgICAgIHJlbW92ZUNhbGxiYWNrOiBfcHJlcGFyZVRtcEZpbGVSZW1vdmVDYWxsYmFjayhuYW1lLCBkaXNjYXJkT3JEZXRhY2hEZXNjcmlwdG9yID8gLTEgOiBmZCwgb3B0cywgdHJ1ZSlcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHRlbXBvcmFyeSBkaXJlY3RvcnkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyhPcHRpb25zfGRpckNhbGxiYWNrKX0gb3B0aW9ucyB0aGUgb3B0aW9ucyBvciB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0gez9kaXJDYWxsYmFja30gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkaXIob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICAgIGNvbnN0IGFyZ3MgPSBfcGFyc2VBcmd1bWVudHMob3B0aW9ucywgY2FsbGJhY2spLFxuICAgICAgICBvcHRzID0gYXJnc1swXSxcbiAgICAgICAgY2IgPSBhcmdzWzFdO1xuXG4gICAgICAvLyBnZXRzIGEgdGVtcG9yYXJ5IGZpbGVuYW1lXG4gICAgICB0bXBOYW1lKG9wdHMsIGZ1bmN0aW9uIF90bXBOYW1lQ3JlYXRlZChlcnIsIG5hbWUpIHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycik7XG5cbiAgICAgICAgLy8gY3JlYXRlIHRoZSBkaXJlY3RvcnlcbiAgICAgICAgZnMubWtkaXIobmFtZSwgb3B0cy5tb2RlIHx8IERJUl9NT0RFLCBmdW5jdGlvbiBfZGlyQ3JlYXRlZChlcnIpIHtcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpO1xuXG4gICAgICAgICAgY2IobnVsbCwgbmFtZSwgX3ByZXBhcmVUbXBEaXJSZW1vdmVDYWxsYmFjayhuYW1lLCBvcHRzLCBmYWxzZSkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN5bmNocm9ub3VzIHZlcnNpb24gb2YgZGlyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPcHRpb25zfSBvcHRpb25zXG4gICAgICogQHJldHVybnMge0RpclN5bmNPYmplY3R9IG9iamVjdCBjb25zaXN0cyBvZiBuYW1lIGFuZCByZW1vdmVDYWxsYmFja1xuICAgICAqIEB0aHJvd3Mge0Vycm9yfSBpZiBpdCBjYW5ub3QgY3JlYXRlIGEgZGlyZWN0b3J5XG4gICAgICovXG4gICAgZnVuY3Rpb24gZGlyU3luYyhvcHRpb25zKSB7XG4gICAgICBjb25zdCBhcmdzID0gX3BhcnNlQXJndW1lbnRzKG9wdGlvbnMpLFxuICAgICAgICBvcHRzID0gYXJnc1swXTtcblxuICAgICAgY29uc3QgbmFtZSA9IHRtcE5hbWVTeW5jKG9wdHMpO1xuICAgICAgZnMubWtkaXJTeW5jKG5hbWUsIG9wdHMubW9kZSB8fCBESVJfTU9ERSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIHJlbW92ZUNhbGxiYWNrOiBfcHJlcGFyZVRtcERpclJlbW92ZUNhbGxiYWNrKG5hbWUsIG9wdHMsIHRydWUpXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgZmlsZXMgYXN5bmNocm9ub3VzbHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZmRQYXRoXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV4dFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3JlbW92ZUZpbGVBc3luYyhmZFBhdGgsIG5leHQpIHtcbiAgICAgIGNvbnN0IF9oYW5kbGVyID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoZXJyICYmICFfaXNFTk9FTlQoZXJyKSkge1xuICAgICAgICAgIC8vIHJlcmFpc2UgYW55IHVuYW50aWNpcGF0ZWQgZXJyb3JcbiAgICAgICAgICByZXR1cm4gbmV4dChlcnIpO1xuICAgICAgICB9XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH07XG5cbiAgICAgIGlmICgwIDw9IGZkUGF0aFswXSlcbiAgICAgICAgZnMuY2xvc2UoZmRQYXRoWzBdLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZnMudW5saW5rKGZkUGF0aFsxXSwgX2hhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICAgIGVsc2UgZnMudW5saW5rKGZkUGF0aFsxXSwgX2hhbmRsZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgZmlsZXMgc3luY2hyb25vdXNseS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBmZFBhdGhcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9yZW1vdmVGaWxlU3luYyhmZFBhdGgpIHtcbiAgICAgIGxldCByZXRocm93bkV4Y2VwdGlvbiA9IG51bGw7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoMCA8PSBmZFBhdGhbMF0pIGZzLmNsb3NlU3luYyhmZFBhdGhbMF0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyByZXJhaXNlIGFueSB1bmFudGljaXBhdGVkIGVycm9yXG4gICAgICAgIGlmICghX2lzRUJBREYoZSkgJiYgIV9pc0VOT0VOVChlKSkgdGhyb3cgZTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZnMudW5saW5rU3luYyhmZFBhdGhbMV0pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gcmVyYWlzZSBhbnkgdW5hbnRpY2lwYXRlZCBlcnJvclxuICAgICAgICAgIGlmICghX2lzRU5PRU5UKGUpKSByZXRocm93bkV4Y2VwdGlvbiA9IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChyZXRocm93bkV4Y2VwdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyByZXRocm93bkV4Y2VwdGlvbjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcmVwYXJlcyB0aGUgY2FsbGJhY2sgZm9yIHJlbW92YWwgb2YgdGhlIHRlbXBvcmFyeSBmaWxlLlxuICAgICAqXG4gICAgICogUmV0dXJucyBlaXRoZXIgYSBzeW5jIGNhbGxiYWNrIG9yIGEgYXN5bmMgY2FsbGJhY2sgZGVwZW5kaW5nIG9uIHdoZXRoZXJcbiAgICAgKiBmaWxlU3luYyBvciBmaWxlIHdhcyBjYWxsZWQsIHdoaWNoIGlzIGV4cHJlc3NlZCBieSB0aGUgc3luYyBwYXJhbWV0ZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSB0aGUgcGF0aCBvZiB0aGUgZmlsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmZCBmaWxlIGRlc2NyaXB0b3JcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3luY1xuICAgICAqIEByZXR1cm5zIHtmaWxlQ2FsbGJhY2sgfCBmaWxlQ2FsbGJhY2tTeW5jfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3ByZXBhcmVUbXBGaWxlUmVtb3ZlQ2FsbGJhY2sobmFtZSwgZmQsIG9wdHMsIHN5bmMpIHtcbiAgICAgIGNvbnN0IHJlbW92ZUNhbGxiYWNrU3luYyA9IF9wcmVwYXJlUmVtb3ZlQ2FsbGJhY2soX3JlbW92ZUZpbGVTeW5jLCBbZmQsIG5hbWVdLCBzeW5jKTtcbiAgICAgIGNvbnN0IHJlbW92ZUNhbGxiYWNrID0gX3ByZXBhcmVSZW1vdmVDYWxsYmFjayhfcmVtb3ZlRmlsZUFzeW5jLCBbZmQsIG5hbWVdLCBzeW5jLCByZW1vdmVDYWxsYmFja1N5bmMpO1xuXG4gICAgICBpZiAoIW9wdHMua2VlcCkgX3JlbW92ZU9iamVjdHMudW5zaGlmdChyZW1vdmVDYWxsYmFja1N5bmMpO1xuXG4gICAgICByZXR1cm4gc3luYyA/IHJlbW92ZUNhbGxiYWNrU3luYyA6IHJlbW92ZUNhbGxiYWNrO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByZXBhcmVzIHRoZSBjYWxsYmFjayBmb3IgcmVtb3ZhbCBvZiB0aGUgdGVtcG9yYXJ5IGRpcmVjdG9yeS5cbiAgICAgKlxuICAgICAqIFJldHVybnMgZWl0aGVyIGEgc3luYyBjYWxsYmFjayBvciBhIGFzeW5jIGNhbGxiYWNrIGRlcGVuZGluZyBvbiB3aGV0aGVyXG4gICAgICogdG1wRmlsZVN5bmMgb3IgdG1wRmlsZSB3YXMgY2FsbGVkLCB3aGljaCBpcyBleHByZXNzZWQgYnkgdGhlIHN5bmMgcGFyYW1ldGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3luY1xuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gdGhlIGNhbGxiYWNrXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfcHJlcGFyZVRtcERpclJlbW92ZUNhbGxiYWNrKG5hbWUsIG9wdHMsIHN5bmMpIHtcbiAgICAgIGNvbnN0IHJlbW92ZUZ1bmN0aW9uID0gb3B0cy51bnNhZmVDbGVhbnVwID8gcmltcmFmIDogZnMucm1kaXIuYmluZChmcyk7XG4gICAgICBjb25zdCByZW1vdmVGdW5jdGlvblN5bmMgPSBvcHRzLnVuc2FmZUNsZWFudXAgPyBGTl9SSU1SQUZfU1lOQyA6IEZOX1JNRElSX1NZTkM7XG4gICAgICBjb25zdCByZW1vdmVDYWxsYmFja1N5bmMgPSBfcHJlcGFyZVJlbW92ZUNhbGxiYWNrKHJlbW92ZUZ1bmN0aW9uU3luYywgbmFtZSwgc3luYyk7XG4gICAgICBjb25zdCByZW1vdmVDYWxsYmFjayA9IF9wcmVwYXJlUmVtb3ZlQ2FsbGJhY2socmVtb3ZlRnVuY3Rpb24sIG5hbWUsIHN5bmMsIHJlbW92ZUNhbGxiYWNrU3luYyk7XG4gICAgICBpZiAoIW9wdHMua2VlcCkgX3JlbW92ZU9iamVjdHMudW5zaGlmdChyZW1vdmVDYWxsYmFja1N5bmMpO1xuXG4gICAgICByZXR1cm4gc3luYyA/IHJlbW92ZUNhbGxiYWNrU3luYyA6IHJlbW92ZUNhbGxiYWNrO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBndWFyZGVkIGZ1bmN0aW9uIHdyYXBwaW5nIHRoZSByZW1vdmVGdW5jdGlvbiBjYWxsLlxuICAgICAqXG4gICAgICogVGhlIGNsZWFudXAgY2FsbGJhY2sgaXMgc2F2ZSB0byBiZSBjYWxsZWQgbXVsdGlwbGUgdGltZXMuXG4gICAgICogU3Vic2VxdWVudCBpbnZvY2F0aW9ucyB3aWxsIGJlIGlnbm9yZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZW1vdmVGdW5jdGlvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlT3JEaXJOYW1lXG4gICAgICogQHBhcmFtIHtib29sZWFufSBzeW5jXG4gICAgICogQHBhcmFtIHtjbGVhbnVwQ2FsbGJhY2tTeW5jP30gY2xlYW51cENhbGxiYWNrU3luY1xuICAgICAqIEByZXR1cm5zIHtjbGVhbnVwQ2FsbGJhY2sgfCBjbGVhbnVwQ2FsbGJhY2tTeW5jfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3ByZXBhcmVSZW1vdmVDYWxsYmFjayhyZW1vdmVGdW5jdGlvbiwgZmlsZU9yRGlyTmFtZSwgc3luYywgY2xlYW51cENhbGxiYWNrU3luYykge1xuICAgICAgbGV0IGNhbGxlZCA9IGZhbHNlO1xuXG4gICAgICAvLyBpZiBzeW5jIGlzIHRydWUsIHRoZSBuZXh0IHBhcmFtZXRlciB3aWxsIGJlIGlnbm9yZWRcbiAgICAgIHJldHVybiBmdW5jdGlvbiBfY2xlYW51cENhbGxiYWNrKG5leHQpIHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgICAgICAvLyByZW1vdmUgY2xlYW51cENhbGxiYWNrIGZyb20gY2FjaGVcbiAgICAgICAgICBjb25zdCB0b1JlbW92ZSA9IGNsZWFudXBDYWxsYmFja1N5bmMgfHwgX2NsZWFudXBDYWxsYmFjaztcbiAgICAgICAgICBjb25zdCBpbmRleCA9IF9yZW1vdmVPYmplY3RzLmluZGV4T2YodG9SZW1vdmUpO1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgICAgaWYgKGluZGV4ID49IDApIF9yZW1vdmVPYmplY3RzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICAgIGlmIChzeW5jIHx8IHJlbW92ZUZ1bmN0aW9uID09PSBGTl9STURJUl9TWU5DIHx8IHJlbW92ZUZ1bmN0aW9uID09PSBGTl9SSU1SQUZfU1lOQykge1xuICAgICAgICAgICAgcmV0dXJuIHJlbW92ZUZ1bmN0aW9uKGZpbGVPckRpck5hbWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVtb3ZlRnVuY3Rpb24oZmlsZU9yRGlyTmFtZSwgbmV4dCB8fCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBnYXJiYWdlIGNvbGxlY3Rvci5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2dhcmJhZ2VDb2xsZWN0b3IoKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKCFfZ3JhY2VmdWxDbGVhbnVwKSByZXR1cm47XG5cbiAgICAgIC8vIHRoZSBmdW5jdGlvbiBiZWluZyBjYWxsZWQgcmVtb3ZlcyBpdHNlbGYgZnJvbSBfcmVtb3ZlT2JqZWN0cyxcbiAgICAgIC8vIGxvb3AgdW50aWwgX3JlbW92ZU9iamVjdHMgaXMgZW1wdHlcbiAgICAgIHdoaWxlIChfcmVtb3ZlT2JqZWN0cy5sZW5ndGgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBfcmVtb3ZlT2JqZWN0c1swXSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gYWxyZWFkeSByZW1vdmVkP1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmFuZG9tIG5hbWUgZ2VuZXJhdG9yIGJhc2VkIG9uIGNyeXB0by5cbiAgICAgKiBBZGFwdGVkIGZyb20gaHR0cDovL2Jsb2cudG9tcGF3bGFrLm9yZy9ob3ctdG8tZ2VuZXJhdGUtcmFuZG9tLXZhbHVlcy1ub2RlanMtamF2YXNjcmlwdFxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhvd01hbnlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZ2VuZXJhdGVkIHJhbmRvbSBuYW1lXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfcmFuZG9tQ2hhcnMoaG93TWFueSkge1xuICAgICAgbGV0IHZhbHVlID0gW10sXG4gICAgICAgIHJuZCA9IG51bGw7XG5cbiAgICAgIC8vIG1ha2Ugc3VyZSB0aGF0IHdlIGRvIG5vdCBmYWlsIGJlY2F1c2Ugd2UgcmFuIG91dCBvZiBlbnRyb3B5XG4gICAgICB0cnkge1xuICAgICAgICBybmQgPSBjcnlwdG8ucmFuZG9tQnl0ZXMoaG93TWFueSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJuZCA9IGNyeXB0by5wc2V1ZG9SYW5kb21CeXRlcyhob3dNYW55KTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBob3dNYW55OyBpKyspIHtcbiAgICAgICAgdmFsdWUucHVzaChSQU5ET01fQ0hBUlNbcm5kW2ldICUgUkFORE9NX0NIQVJTLmxlbmd0aF0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWUuam9pbignJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIGBvYmpgIHBhcmFtZXRlciBpcyBkZWZpbmVkIG9yIG5vdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgb2JqZWN0IGlzIHVuZGVmaW5lZFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2lzVW5kZWZpbmVkKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhcnNlcyB0aGUgZnVuY3Rpb24gYXJndW1lbnRzLlxuICAgICAqXG4gICAgICogVGhpcyBmdW5jdGlvbiBoZWxwcyB0byBoYXZlIG9wdGlvbmFsIGFyZ3VtZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7KE9wdGlvbnN8bnVsbHx1bmRlZmluZWR8RnVuY3Rpb24pfSBvcHRpb25zXG4gICAgICogQHBhcmFtIHs/RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHJldHVybnMge0FycmF5fSBwYXJzZWQgYXJndW1lbnRzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfcGFyc2VBcmd1bWVudHMob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIFt7fSwgb3B0aW9uc107XG4gICAgICB9XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAoX2lzVW5kZWZpbmVkKG9wdGlvbnMpKSB7XG4gICAgICAgIHJldHVybiBbe30sIGNhbGxiYWNrXTtcbiAgICAgIH1cblxuICAgICAgLy8gY29weSBvcHRpb25zIHNvIHdlIGRvIG5vdCBsZWFrIHRoZSBjaGFuZ2VzIHdlIG1ha2UgaW50ZXJuYWxseVxuICAgICAgY29uc3QgYWN0dWFsT3B0aW9ucyA9IHt9O1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob3B0aW9ucykpIHtcbiAgICAgICAgYWN0dWFsT3B0aW9uc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gW2FjdHVhbE9wdGlvbnMsIGNhbGxiYWNrXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlIHRoZSBzcGVjaWZpZWQgcGF0aCBuYW1lIGluIHJlc3BlY3QgdG8gdG1wRGlyLlxuICAgICAqXG4gICAgICogVGhlIHNwZWNpZmllZCBuYW1lIG1pZ2h0IGluY2x1ZGUgcmVsYXRpdmUgcGF0aCBjb21wb25lbnRzLCBlLmcuIC4uL1xuICAgICAqIHNvIHdlIG5lZWQgdG8gcmVzb2x2ZSBpbiBvcmRlciB0byBiZSBzdXJlIHRoYXQgaXMgaXMgbG9jYXRlZCBpbnNpZGUgdG1wRGlyXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9yZXNvbHZlUGF0aChuYW1lLCB0bXBEaXIsIGNiKSB7XG4gICAgICBjb25zdCBwYXRoVG9SZXNvbHZlID0gcGF0aC5pc0Fic29sdXRlKG5hbWUpID8gbmFtZSA6IHBhdGguam9pbih0bXBEaXIsIG5hbWUpO1xuXG4gICAgICBmcy5zdGF0KHBhdGhUb1Jlc29sdmUsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGZzLnJlYWxwYXRoKHBhdGguZGlybmFtZShwYXRoVG9SZXNvbHZlKSwgZnVuY3Rpb24gKGVyciwgcGFyZW50RGlyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKTtcblxuICAgICAgICAgICAgY2IobnVsbCwgcGF0aC5qb2luKHBhcmVudERpciwgcGF0aC5iYXNlbmFtZShwYXRoVG9SZXNvbHZlKSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLnJlYWxwYXRoKHBhdGhUb1Jlc29sdmUsIGNiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZSB0aGUgc3BlY2lmaWVkIHBhdGggbmFtZSBpbiByZXNwZWN0IHRvIHRtcERpci5cbiAgICAgKlxuICAgICAqIFRoZSBzcGVjaWZpZWQgbmFtZSBtaWdodCBpbmNsdWRlIHJlbGF0aXZlIHBhdGggY29tcG9uZW50cywgZS5nLiAuLi9cbiAgICAgKiBzbyB3ZSBuZWVkIHRvIHJlc29sdmUgaW4gb3JkZXIgdG8gYmUgc3VyZSB0aGF0IGlzIGlzIGxvY2F0ZWQgaW5zaWRlIHRtcERpclxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfcmVzb2x2ZVBhdGhTeW5jKG5hbWUsIHRtcERpcikge1xuICAgICAgY29uc3QgcGF0aFRvUmVzb2x2ZSA9IHBhdGguaXNBYnNvbHV0ZShuYW1lKSA/IG5hbWUgOiBwYXRoLmpvaW4odG1wRGlyLCBuYW1lKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZnMuc3RhdFN5bmMocGF0aFRvUmVzb2x2ZSk7XG4gICAgICAgIHJldHVybiBmcy5yZWFscGF0aFN5bmMocGF0aFRvUmVzb2x2ZSk7XG4gICAgICB9IGNhdGNoIChfZXJyKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudERpciA9IGZzLnJlYWxwYXRoU3luYyhwYXRoLmRpcm5hbWUocGF0aFRvUmVzb2x2ZSkpO1xuXG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4ocGFyZW50RGlyLCBwYXRoLmJhc2VuYW1lKHBhdGhUb1Jlc29sdmUpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgYSBuZXcgdGVtcG9yYXJ5IG5hbWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBuZXcgcmFuZG9tIG5hbWUgYWNjb3JkaW5nIHRvIG9wdHNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9nZW5lcmF0ZVRtcE5hbWUob3B0cykge1xuICAgICAgY29uc3QgdG1wRGlyID0gb3B0cy50bXBkaXI7XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAoIV9pc1VuZGVmaW5lZChvcHRzLm5hbWUpKSB7XG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4odG1wRGlyLCBvcHRzLmRpciwgb3B0cy5uYW1lKTtcbiAgICAgIH1cblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmICghX2lzVW5kZWZpbmVkKG9wdHMudGVtcGxhdGUpKSB7XG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4odG1wRGlyLCBvcHRzLmRpciwgb3B0cy50ZW1wbGF0ZSkucmVwbGFjZShURU1QTEFURV9QQVRURVJOLCBfcmFuZG9tQ2hhcnMoNikpO1xuICAgICAgfVxuXG4gICAgICAvLyBwcmVmaXggYW5kIHBvc3RmaXhcbiAgICAgIGNvbnN0IG5hbWUgPSBbXG4gICAgICAgIG9wdHMucHJlZml4ID8gb3B0cy5wcmVmaXggOiAndG1wJyxcbiAgICAgICAgJy0nLFxuICAgICAgICBwcm9jZXNzLnBpZCxcbiAgICAgICAgJy0nLFxuICAgICAgICBfcmFuZG9tQ2hhcnMoMTIpLFxuICAgICAgICBvcHRzLnBvc3RmaXggPyAnLScgKyBvcHRzLnBvc3RmaXggOiAnJ1xuICAgICAgXS5qb2luKCcnKTtcblxuICAgICAgcmV0dXJuIHBhdGguam9pbih0bXBEaXIsIG9wdHMuZGlyLCBuYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIGFuZCBzYW5pdGl6ZXMgdGhlIGJhc2ljIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9hc3NlcnRPcHRpb25zQmFzZShvcHRpb25zKSB7XG4gICAgICBpZiAoIV9pc1VuZGVmaW5lZChvcHRpb25zLm5hbWUpKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBvcHRpb25zLm5hbWU7XG5cbiAgICAgICAgLy8gYXNzZXJ0IHRoYXQgbmFtZSBpcyBub3QgYWJzb2x1dGUgYW5kIGRvZXMgbm90IGNvbnRhaW4gYSBwYXRoXG4gICAgICAgIGlmIChwYXRoLmlzQWJzb2x1dGUobmFtZSkpIHRocm93IG5ldyBFcnJvcihgbmFtZSBvcHRpb24gbXVzdCBub3QgY29udGFpbiBhbiBhYnNvbHV0ZSBwYXRoLCBmb3VuZCBcIiR7bmFtZX1cIi5gKTtcblxuICAgICAgICAvLyBtdXN0IG5vdCBmYWlsIG9uIHZhbGlkIC48bmFtZT4gb3IgLi48bmFtZT4gb3Igc2ltaWxhciBzdWNoIGNvbnN0cnVjdHNcbiAgICAgICAgY29uc3QgYmFzZW5hbWUgPSBwYXRoLmJhc2VuYW1lKG5hbWUpO1xuICAgICAgICBpZiAoYmFzZW5hbWUgPT09ICcuLicgfHwgYmFzZW5hbWUgPT09ICcuJyB8fCBiYXNlbmFtZSAhPT0gbmFtZSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYG5hbWUgb3B0aW9uIG11c3Qgbm90IGNvbnRhaW4gYSBwYXRoLCBmb3VuZCBcIiR7bmFtZX1cIi5gKTtcbiAgICAgIH1cblxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmICghX2lzVW5kZWZpbmVkKG9wdGlvbnMudGVtcGxhdGUpICYmICFvcHRpb25zLnRlbXBsYXRlLm1hdGNoKFRFTVBMQVRFX1BBVFRFUk4pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0ZW1wbGF0ZSwgZm91bmQgXCIke29wdGlvbnMudGVtcGxhdGV9XCIuYCk7XG4gICAgICB9XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAoKCFfaXNVbmRlZmluZWQob3B0aW9ucy50cmllcykgJiYgaXNOYU4ob3B0aW9ucy50cmllcykpIHx8IG9wdGlvbnMudHJpZXMgPCAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0cmllcywgZm91bmQgXCIke29wdGlvbnMudHJpZXN9XCIuYCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIGEgbmFtZSB3YXMgc3BlY2lmaWVkIHdlIHdpbGwgdHJ5IG9uY2VcbiAgICAgIG9wdGlvbnMudHJpZXMgPSBfaXNVbmRlZmluZWQob3B0aW9ucy5uYW1lKSA/IG9wdGlvbnMudHJpZXMgfHwgREVGQVVMVF9UUklFUyA6IDE7XG4gICAgICBvcHRpb25zLmtlZXAgPSAhIW9wdGlvbnMua2VlcDtcbiAgICAgIG9wdGlvbnMuZGV0YWNoRGVzY3JpcHRvciA9ICEhb3B0aW9ucy5kZXRhY2hEZXNjcmlwdG9yO1xuICAgICAgb3B0aW9ucy5kaXNjYXJkRGVzY3JpcHRvciA9ICEhb3B0aW9ucy5kaXNjYXJkRGVzY3JpcHRvcjtcbiAgICAgIG9wdGlvbnMudW5zYWZlQ2xlYW51cCA9ICEhb3B0aW9ucy51bnNhZmVDbGVhbnVwO1xuXG4gICAgICAvLyBmb3IgY29tcGxldGVuZXNzJyBzYWtlIG9ubHksIGFsc28ga2VlcCAobXVsdGlwbGUpIGJsYW5rcyBpZiB0aGUgdXNlciwgcHVycG9ydGVkbHkgc2FuZSwgcmVxdWVzdHMgdXMgdG9cbiAgICAgIG9wdGlvbnMucHJlZml4ID0gX2lzVW5kZWZpbmVkKG9wdGlvbnMucHJlZml4KSA/ICcnIDogb3B0aW9ucy5wcmVmaXg7XG4gICAgICBvcHRpb25zLnBvc3RmaXggPSBfaXNVbmRlZmluZWQob3B0aW9ucy5wb3N0Zml4KSA/ICcnIDogb3B0aW9ucy5wb3N0Zml4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHJlbGF0aXZlIGRpcmVjdG9yeSB0byB0bXBEaXIuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9nZXRSZWxhdGl2ZVBhdGgob3B0aW9uLCBuYW1lLCB0bXBEaXIsIGNiKSB7XG4gICAgICBpZiAoX2lzVW5kZWZpbmVkKG5hbWUpKSByZXR1cm4gY2IobnVsbCk7XG5cbiAgICAgIF9yZXNvbHZlUGF0aChuYW1lLCB0bXBEaXIsIGZ1bmN0aW9uIChlcnIsIHJlc29sdmVkUGF0aCkge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKTtcblxuICAgICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBwYXRoLnJlbGF0aXZlKHRtcERpciwgcmVzb2x2ZWRQYXRoKTtcblxuICAgICAgICBpZiAoIXJlc29sdmVkUGF0aC5zdGFydHNXaXRoKHRtcERpcikpIHtcbiAgICAgICAgICByZXR1cm4gY2IobmV3IEVycm9yKGAke29wdGlvbn0gb3B0aW9uIG11c3QgYmUgcmVsYXRpdmUgdG8gXCIke3RtcERpcn1cIiwgZm91bmQgXCIke3JlbGF0aXZlUGF0aH1cIi5gKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjYihudWxsLCByZWxhdGl2ZVBhdGgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgcmVsYXRpdmUgcGF0aCB0byB0bXBEaXIuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9nZXRSZWxhdGl2ZVBhdGhTeW5jKG9wdGlvbiwgbmFtZSwgdG1wRGlyKSB7XG4gICAgICBpZiAoX2lzVW5kZWZpbmVkKG5hbWUpKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IHJlc29sdmVkUGF0aCA9IF9yZXNvbHZlUGF0aFN5bmMobmFtZSwgdG1wRGlyKTtcbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHBhdGgucmVsYXRpdmUodG1wRGlyLCByZXNvbHZlZFBhdGgpO1xuXG4gICAgICBpZiAoIXJlc29sdmVkUGF0aC5zdGFydHNXaXRoKHRtcERpcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke29wdGlvbn0gb3B0aW9uIG11c3QgYmUgcmVsYXRpdmUgdG8gXCIke3RtcERpcn1cIiwgZm91bmQgXCIke3JlbGF0aXZlUGF0aH1cIi5gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlbGF0aXZlUGF0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBc3NlcnRzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCBvcHRpb25zIGFyZSB2YWxpZCwgYWxzbyBzYW5pdGl6ZXMgb3B0aW9ucyBhbmQgcHJvdmlkZXMgc2FuZSBkZWZhdWx0cyBmb3IgbWlzc2luZ1xuICAgICAqIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9hc3NlcnRBbmRTYW5pdGl6ZU9wdGlvbnMob3B0aW9ucywgY2IpIHtcbiAgICAgIF9nZXRUbXBEaXIob3B0aW9ucywgZnVuY3Rpb24gKGVyciwgdG1wRGlyKSB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpO1xuXG4gICAgICAgIG9wdGlvbnMudG1wZGlyID0gdG1wRGlyO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgX2Fzc2VydE9wdGlvbnNCYXNlKG9wdGlvbnMsIHRtcERpcik7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2FuaXRpemUgZGlyLCBhbHNvIGtlZXAgKG11bHRpcGxlKSBibGFua3MgaWYgdGhlIHVzZXIsIHB1cnBvcnRlZGx5IHNhbmUsIHJlcXVlc3RzIHVzIHRvXG4gICAgICAgIF9nZXRSZWxhdGl2ZVBhdGgoJ2RpcicsIG9wdGlvbnMuZGlyLCB0bXBEaXIsIGZ1bmN0aW9uIChlcnIsIGRpcikge1xuICAgICAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpO1xuXG4gICAgICAgICAgb3B0aW9ucy5kaXIgPSBfaXNVbmRlZmluZWQoZGlyKSA/ICcnIDogZGlyO1xuXG4gICAgICAgICAgLy8gc2FuaXRpemUgZnVydGhlciBpZiB0ZW1wbGF0ZSBpcyByZWxhdGl2ZSB0byBvcHRpb25zLmRpclxuICAgICAgICAgIF9nZXRSZWxhdGl2ZVBhdGgoJ3RlbXBsYXRlJywgb3B0aW9ucy50ZW1wbGF0ZSwgdG1wRGlyLCBmdW5jdGlvbiAoZXJyLCB0ZW1wbGF0ZSkge1xuICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycik7XG5cbiAgICAgICAgICAgIG9wdGlvbnMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcblxuICAgICAgICAgICAgY2IobnVsbCwgb3B0aW9ucyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgb3B0aW9ucyBhcmUgdmFsaWQsIGFsc28gc2FuaXRpemVzIG9wdGlvbnMgYW5kIHByb3ZpZGVzIHNhbmUgZGVmYXVsdHMgZm9yIG1pc3NpbmdcbiAgICAgKiBvcHRpb25zLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfYXNzZXJ0QW5kU2FuaXRpemVPcHRpb25zU3luYyhvcHRpb25zKSB7XG4gICAgICBjb25zdCB0bXBEaXIgPSAob3B0aW9ucy50bXBkaXIgPSBfZ2V0VG1wRGlyU3luYyhvcHRpb25zKSk7XG5cbiAgICAgIF9hc3NlcnRPcHRpb25zQmFzZShvcHRpb25zLCB0bXBEaXIpO1xuXG4gICAgICBjb25zdCBkaXIgPSBfZ2V0UmVsYXRpdmVQYXRoU3luYygnZGlyJywgb3B0aW9ucy5kaXIsIHRtcERpcik7XG4gICAgICBvcHRpb25zLmRpciA9IF9pc1VuZGVmaW5lZChkaXIpID8gJycgOiBkaXI7XG5cbiAgICAgIG9wdGlvbnMudGVtcGxhdGUgPSBfZ2V0UmVsYXRpdmVQYXRoU3luYygndGVtcGxhdGUnLCBvcHRpb25zLnRlbXBsYXRlLCB0bXBEaXIpO1xuXG4gICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIZWxwZXIgZm9yIHRlc3RpbmcgYWdhaW5zdCBFQkFERiB0byBjb21wZW5zYXRlIGNoYW5nZXMgbWFkZSB0byBOb2RlIDcueCB1bmRlciBXaW5kb3dzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaXNFQkFERihlcnJvcikge1xuICAgICAgcmV0dXJuIF9pc0V4cGVjdGVkRXJyb3IoZXJyb3IsIC1FQkFERiwgJ0VCQURGJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGVscGVyIGZvciB0ZXN0aW5nIGFnYWluc3QgRU5PRU5UIHRvIGNvbXBlbnNhdGUgY2hhbmdlcyBtYWRlIHRvIE5vZGUgNy54IHVuZGVyIFdpbmRvd3MuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9pc0VOT0VOVChlcnJvcikge1xuICAgICAgcmV0dXJuIF9pc0V4cGVjdGVkRXJyb3IoZXJyb3IsIC1FTk9FTlQsICdFTk9FTlQnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIZWxwZXIgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGV4cGVjdGVkIGVycm9yIGNvZGUgbWF0Y2hlcyB0aGUgYWN0dWFsIGNvZGUgYW5kIGVycm5vLFxuICAgICAqIHdoaWNoIHdpbGwgZGlmZmVyIGJldHdlZW4gdGhlIHN1cHBvcnRlZCBub2RlIHZlcnNpb25zLlxuICAgICAqXG4gICAgICogLSBOb2RlID49IDcuMDpcbiAgICAgKiAgIGVycm9yLmNvZGUge3N0cmluZ31cbiAgICAgKiAgIGVycm9yLmVycm5vIHtudW1iZXJ9IGFueSBudW1lcmljYWwgdmFsdWUgd2lsbCBiZSBuZWdhdGVkXG4gICAgICpcbiAgICAgKiBDQVZFQVRcbiAgICAgKlxuICAgICAqIE9uIHdpbmRvd3MsIHRoZSBlcnJubyBmb3IgRUJBREYgaXMgLTQwODMgYnV0IG9zLmNvbnN0YW50cy5lcnJuby5FQkFERiBpcyBkaWZmZXJlbnQgYW5kIHdlIG11c3QgYXNzdW1lIHRoYXQgRU5PRU5UXG4gICAgICogaXMgbm8gZGlmZmVyZW50IGhlcmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N5c3RlbUVycm9yfSBlcnJvclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBlcnJub1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaXNFeHBlY3RlZEVycm9yKGVycm9yLCBlcnJubywgY29kZSkge1xuICAgICAgcmV0dXJuIElTX1dJTjMyID8gZXJyb3IuY29kZSA9PT0gY29kZSA6IGVycm9yLmNvZGUgPT09IGNvZGUgJiYgZXJyb3IuZXJybm8gPT09IGVycm5vO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGdyYWNlZnVsIGNsZWFudXAuXG4gICAgICpcbiAgICAgKiBJZiBncmFjZWZ1bCBjbGVhbnVwIGlzIHNldCwgdG1wIHdpbGwgcmVtb3ZlIGFsbCBjb250cm9sbGVkIHRlbXBvcmFyeSBvYmplY3RzIG9uIHByb2Nlc3MgZXhpdCwgb3RoZXJ3aXNlIHRoZVxuICAgICAqIHRlbXBvcmFyeSBvYmplY3RzIHdpbGwgcmVtYWluIGluIHBsYWNlLCB3YWl0aW5nIHRvIGJlIGNsZWFuZWQgdXAgb24gc3lzdGVtIHJlc3RhcnQgb3Igb3RoZXJ3aXNlIHNjaGVkdWxlZCB0ZW1wb3JhcnlcbiAgICAgKiBvYmplY3QgcmVtb3ZhbHMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0R3JhY2VmdWxDbGVhbnVwKCkge1xuICAgICAgX2dyYWNlZnVsQ2xlYW51cCA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgY3VycmVudGx5IGNvbmZpZ3VyZWQgdG1wIGRpciBmcm9tIG9zLnRtcGRpcigpLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZ2V0VG1wRGlyKG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gZnMucmVhbHBhdGgoKG9wdGlvbnMgJiYgb3B0aW9ucy50bXBkaXIpIHx8IG9zLnRtcGRpcigpLCBjYik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgY3VycmVudGx5IGNvbmZpZ3VyZWQgdG1wIGRpciBmcm9tIG9zLnRtcGRpcigpLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZ2V0VG1wRGlyU3luYyhvcHRpb25zKSB7XG4gICAgICByZXR1cm4gZnMucmVhbHBhdGhTeW5jKChvcHRpb25zICYmIG9wdGlvbnMudG1wZGlyKSB8fCBvcy50bXBkaXIoKSk7XG4gICAgfVxuXG4gICAgLy8gSW5zdGFsbCBwcm9jZXNzIGV4aXQgbGlzdGVuZXJcbiAgICBwcm9jZXNzLmFkZExpc3RlbmVyKEVYSVQsIF9nYXJiYWdlQ29sbGVjdG9yKTtcblxuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIEB0eXBlZGVmIHtPYmplY3R9IE9wdGlvbnNcbiAgICAgKiBAcHJvcGVydHkgez9ib29sZWFufSBrZWVwIHRoZSB0ZW1wb3Jhcnkgb2JqZWN0IChmaWxlIG9yIGRpcikgd2lsbCBub3QgYmUgZ2FyYmFnZSBjb2xsZWN0ZWRcbiAgICAgKiBAcHJvcGVydHkgez9udW1iZXJ9IHRyaWVzIHRoZSBudW1iZXIgb2YgdHJpZXMgYmVmb3JlIGdpdmUgdXAgdGhlIG5hbWUgZ2VuZXJhdGlvblxuICAgICAqIEBwcm9wZXJ0eSAoP2ludCkgbW9kZSB0aGUgYWNjZXNzIG1vZGUsIGRlZmF1bHRzIGFyZSAwbzcwMCBmb3IgZGlyZWN0b3JpZXMgYW5kIDBvNjAwIGZvciBmaWxlc1xuICAgICAqIEBwcm9wZXJ0eSB7P3N0cmluZ30gdGVtcGxhdGUgdGhlIFwibWtzdGVtcFwiIGxpa2UgZmlsZW5hbWUgdGVtcGxhdGVcbiAgICAgKiBAcHJvcGVydHkgez9zdHJpbmd9IG5hbWUgZml4ZWQgbmFtZSByZWxhdGl2ZSB0byB0bXBkaXIgb3IgdGhlIHNwZWNpZmllZCBkaXIgb3B0aW9uXG4gICAgICogQHByb3BlcnR5IHs/c3RyaW5nfSBkaXIgdG1wIGRpcmVjdG9yeSByZWxhdGl2ZSB0byB0aGUgcm9vdCB0bXAgZGlyZWN0b3J5IGluIHVzZVxuICAgICAqIEBwcm9wZXJ0eSB7P3N0cmluZ30gcHJlZml4IHByZWZpeCBmb3IgdGhlIGdlbmVyYXRlZCBuYW1lXG4gICAgICogQHByb3BlcnR5IHs/c3RyaW5nfSBwb3N0Zml4IHBvc3RmaXggZm9yIHRoZSBnZW5lcmF0ZWQgbmFtZVxuICAgICAqIEBwcm9wZXJ0eSB7P3N0cmluZ30gdG1wZGlyIHRoZSByb290IHRtcCBkaXJlY3Rvcnkgd2hpY2ggb3ZlcnJpZGVzIHRoZSBvcyB0bXBkaXJcbiAgICAgKiBAcHJvcGVydHkgez9ib29sZWFufSB1bnNhZmVDbGVhbnVwIHJlY3Vyc2l2ZWx5IHJlbW92ZXMgdGhlIGNyZWF0ZWQgdGVtcG9yYXJ5IGRpcmVjdG9yeSwgZXZlbiB3aGVuIGl0J3Mgbm90IGVtcHR5XG4gICAgICogQHByb3BlcnR5IHs/Ym9vbGVhbn0gZGV0YWNoRGVzY3JpcHRvciBkZXRhY2hlcyB0aGUgZmlsZSBkZXNjcmlwdG9yLCBjYWxsZXIgaXMgcmVzcG9uc2libGUgZm9yIGNsb3NpbmcgdGhlIGZpbGUsIHRtcCB3aWxsIG5vIGxvbmdlciB0cnkgY2xvc2luZyB0aGUgZmlsZSBkdXJpbmcgZ2FyYmFnZSBjb2xsZWN0aW9uXG4gICAgICogQHByb3BlcnR5IHs/Ym9vbGVhbn0gZGlzY2FyZERlc2NyaXB0b3IgZGlzY2FyZHMgdGhlIGZpbGUgZGVzY3JpcHRvciAoY2xvc2VzIGZpbGUsIGZkIGlzIC0xKSwgdG1wIHdpbGwgbm8gbG9uZ2VyIHRyeSBjbG9zaW5nIHRoZSBmaWxlIGR1cmluZyBnYXJiYWdlIGNvbGxlY3Rpb25cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEB0eXBlZGVmIHtPYmplY3R9IEZpbGVTeW5jT2JqZWN0XG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWUgdGhlIG5hbWUgb2YgdGhlIGZpbGVcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gZmQgdGhlIGZpbGUgZGVzY3JpcHRvciBvciAtMSBpZiB0aGUgZmQgaGFzIGJlZW4gZGlzY2FyZGVkXG4gICAgICogQHByb3BlcnR5IHtmaWxlQ2FsbGJhY2t9IHJlbW92ZUNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byByZW1vdmUgdGhlIGZpbGVcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEB0eXBlZGVmIHtPYmplY3R9IERpclN5bmNPYmplY3RcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSB0aGUgbmFtZSBvZiB0aGUgZGlyZWN0b3J5XG4gICAgICogQHByb3BlcnR5IHtmaWxlQ2FsbGJhY2t9IHJlbW92ZUNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byByZW1vdmUgdGhlIGRpcmVjdG9yeVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQGNhbGxiYWNrIHRtcE5hbWVDYWxsYmFja1xuICAgICAqIEBwYXJhbSB7P0Vycm9yfSBlcnIgdGhlIGVycm9yIG9iamVjdCBpZiBhbnl0aGluZyBnb2VzIHdyb25nXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgdGhlIHRlbXBvcmFyeSBmaWxlIG5hbWVcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBjYWxsYmFjayBmaWxlQ2FsbGJhY2tcbiAgICAgKiBAcGFyYW0gez9FcnJvcn0gZXJyIHRoZSBlcnJvciBvYmplY3QgaWYgYW55dGhpbmcgZ29lcyB3cm9uZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRoZSB0ZW1wb3JhcnkgZmlsZSBuYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZkIHRoZSBmaWxlIGRlc2NyaXB0b3Igb3IgLTEgaWYgdGhlIGZkIGhhZCBiZWVuIGRpc2NhcmRlZFxuICAgICAqIEBwYXJhbSB7Y2xlYW51cENhbGxiYWNrfSBmbiB0aGUgY2xlYW51cCBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQGNhbGxiYWNrIGZpbGVDYWxsYmFja1N5bmNcbiAgICAgKiBAcGFyYW0gez9FcnJvcn0gZXJyIHRoZSBlcnJvciBvYmplY3QgaWYgYW55dGhpbmcgZ29lcyB3cm9uZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRoZSB0ZW1wb3JhcnkgZmlsZSBuYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZkIHRoZSBmaWxlIGRlc2NyaXB0b3Igb3IgLTEgaWYgdGhlIGZkIGhhZCBiZWVuIGRpc2NhcmRlZFxuICAgICAqIEBwYXJhbSB7Y2xlYW51cENhbGxiYWNrU3luY30gZm4gdGhlIGNsZWFudXAgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBjYWxsYmFjayBkaXJDYWxsYmFja1xuICAgICAqIEBwYXJhbSB7P0Vycm9yfSBlcnIgdGhlIGVycm9yIG9iamVjdCBpZiBhbnl0aGluZyBnb2VzIHdyb25nXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgdGhlIHRlbXBvcmFyeSBmaWxlIG5hbWVcbiAgICAgKiBAcGFyYW0ge2NsZWFudXBDYWxsYmFja30gZm4gdGhlIGNsZWFudXAgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBjYWxsYmFjayBkaXJDYWxsYmFja1N5bmNcbiAgICAgKiBAcGFyYW0gez9FcnJvcn0gZXJyIHRoZSBlcnJvciBvYmplY3QgaWYgYW55dGhpbmcgZ29lcyB3cm9uZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRoZSB0ZW1wb3JhcnkgZmlsZSBuYW1lXG4gICAgICogQHBhcmFtIHtjbGVhbnVwQ2FsbGJhY2tTeW5jfSBmbiB0aGUgY2xlYW51cCBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgdGVtcG9yYXJ5IGNyZWF0ZWQgZmlsZSBvciBkaXJlY3RvcnkuXG4gICAgICpcbiAgICAgKiBAY2FsbGJhY2sgY2xlYW51cENhbGxiYWNrXG4gICAgICogQHBhcmFtIHtzaW1wbGVDYWxsYmFja30gW25leHRdIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbmV2ZXIgdGhlIHRtcCBvYmplY3QgbmVlZHMgdG8gYmUgcmVtb3ZlZFxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgdGVtcG9yYXJ5IGNyZWF0ZWQgZmlsZSBvciBkaXJlY3RvcnkuXG4gICAgICpcbiAgICAgKiBAY2FsbGJhY2sgY2xlYW51cENhbGxiYWNrU3luY1xuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQ2FsbGJhY2sgZnVuY3Rpb24gZm9yIGZ1bmN0aW9uIGNvbXBvc2l0aW9uLlxuICAgICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXN6aS9ub2RlLXRtcC9pc3N1ZXMvNTd8cmFzemkvbm9kZS10bXAjNTd9XG4gICAgICpcbiAgICAgKiBAY2FsbGJhY2sgc2ltcGxlQ2FsbGJhY2tcbiAgICAgKi9cblxuICAgIC8vIGV4cG9ydGluZyBhbGwgdGhlIG5lZWRlZCBtZXRob2RzXG5cbiAgICAvLyBldmFsdWF0ZSBfZ2V0VG1wRGlyKCkgbGF6aWx5LCBtYWlubHkgZm9yIHNpbXBsaWZ5aW5nIHRlc3RpbmcgYnV0IGl0IGFsc28gd2lsbFxuICAgIC8vIGFsbG93IHVzZXJzIHRvIHJlY29uZmlndXJlIHRoZSB0ZW1wb3JhcnkgZGlyZWN0b3J5XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFIsICd0bXBkaXInLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX2dldFRtcERpclN5bmMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIFIuZGlyID0gZGlyO1xuICAgIFIuZGlyU3luYyA9IGRpclN5bmM7XG5cbiAgICBSLmZpbGUgPSBmaWxlO1xuICAgIFIuZmlsZVN5bmMgPSBmaWxlU3luYztcblxuICAgIFIudG1wTmFtZSA9IHRtcE5hbWU7XG4gICAgUi50bXBOYW1lU3luYyA9IHRtcE5hbWVTeW5jO1xuXG4gICAgUi5zZXRHcmFjZWZ1bENsZWFudXAgPSBzZXRHcmFjZWZ1bENsZWFudXA7XG4gICAgYGBgXG4gICAgcmV0dXJuIFJcblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyMjIE5PVEUgRnV0dXJlIFNpbmdsZS1GaWxlIE1vZHVsZSAjIyNcbiAgcmVxdWlyZV90ZW1wOiAtPlxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIHsgZGVidWcsICAgICAgICB9ID0gY29uc29sZVxuXG4gICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHRlbXBsYXRlcyA9IE9iamVjdC5mcmVlemVcbiAgICAgIHRlbXA6XG4gICAgICAgIGtlZXA6ICAgICBmYWxzZVxuICAgICAgICBwcmVmaXg6ICAgJ2JyaWNzLnRlbXAtJ1xuICAgICAgICBzdWZmaXg6ICAgJydcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBURU1QICAgICAgPSBVTlNUQUJMRV9URU1QX0JSSUNTLnJlcXVpcmVfdGVtcF9pbnRlcm5hbF90bXAoKVxuICAgIGludGVybmFscyA9IHsgdGVtcGxhdGVzLCB9XG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjbGFzcyBUZW1wXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB3aXRoX2ZpbGU6ICggY2ZnLCBoYW5kbGVyICkgLT5cbiAgICAgICAgc3dpdGNoIGFyaXR5ID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgICAgIHdoZW4gMSB0aGVuIFsgY2ZnLCBoYW5kbGVyLCBdID0gWyBudWxsLCBjZmcsIF1cbiAgICAgICAgICB3aGVuIDIgdGhlbiBudWxsXG4gICAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCJleHBlY3RlZCAxIG9yIDIgYXJndW1lbnRzLCBnb3QgI3thcml0eX1cIlxuICAgICAgICBjZmcgICA9IHsgdGVtcGxhdGVzLnRlbXAuLi4sIGNmZy4uLiwgfVxuICAgICAgICB0eXBlICA9IE9iamVjdDo6dG9TdHJpbmcuY2FsbCBoYW5kbGVyXG4gICAgICAgIHJldHVybiBAX3dpdGhfZmlsZV9hc3luYyBjZmcsIGhhbmRsZXIgaWYgdHlwZSBpcyAnW29iamVjdCBBc3luY0Z1bmN0aW9uXSdcbiAgICAgICAgcmV0dXJuIEBfd2l0aF9maWxlX3N5bmMgIGNmZywgaGFuZGxlciBpZiB0eXBlIGlzICdbb2JqZWN0IEZ1bmN0aW9uXSdcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiXmd1eS50ZW1wQDFeIGV4cGVjdGVkIGFuIChzeW5jIG9yIGFzeW5jKSBmdW5jdGlvbiwgZ290IGEgI3t0eXBlfVwiXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB3aXRoX2RpcmVjdG9yeTogKCBjZmcsIGhhbmRsZXIgKSAtPlxuICAgICAgICBzd2l0Y2ggYXJpdHkgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgICAgICAgd2hlbiAxIHRoZW4gWyBjZmcsIGhhbmRsZXIsIF0gPSBbIG51bGwsIGNmZywgXVxuICAgICAgICAgIHdoZW4gMiB0aGVuIG51bGxcbiAgICAgICAgICBlbHNlIHRocm93IG5ldyBFcnJvciBcImV4cGVjdGVkIDEgb3IgMiBhcmd1bWVudHMsIGdvdCAje2FyaXR5fVwiXG4gICAgICAgIGNmZyAgID0geyB0ZW1wbGF0ZXMudGVtcC4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIHR5cGUgID0gT2JqZWN0Ojp0b1N0cmluZy5jYWxsIGhhbmRsZXJcbiAgICAgICAgcmV0dXJuIEBfd2l0aF9kaXJlY3RvcnlfYXN5bmMgY2ZnLCBoYW5kbGVyIGlmIHR5cGUgaXMgJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nXG4gICAgICAgIHJldHVybiBAX3dpdGhfZGlyZWN0b3J5X3N5bmMgIGNmZywgaGFuZGxlciBpZiB0eXBlIGlzICdbb2JqZWN0IEZ1bmN0aW9uXSdcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiXmd1eS50ZW1wQDJeIGV4cGVjdGVkIGFuIChzeW5jIG9yIGFzeW5jKSBmdW5jdGlvbiwgZ290IGEgI3t0eXBlfVwiXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfd2l0aF9maWxlX3N5bmM6ICggY2ZnLCBoYW5kbGVyICkgLT5cbiAgICAgICAgeyBuYW1lOiBwYXRoXG4gICAgICAgICAgZmRcbiAgICAgICAgICByZW1vdmVDYWxsYmFjayB9ID0gVEVNUC5maWxlU3luYyBjZmdcbiAgICAgICAgdHJ5IGhhbmRsZXIgeyBwYXRoLCBmZCwgfSBmaW5hbGx5XG4gICAgICAgICAgcmVtb3ZlQ2FsbGJhY2soKSB1bmxlc3MgY2ZnLmtlZXBcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIF93aXRoX2RpcmVjdG9yeV9zeW5jOiAoIGNmZywgaGFuZGxlciApIC0+XG4gICAgICAgIEZTICAgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6ZnMnXG4gICAgICAgIHsgbmFtZTogcGF0aCwgfSA9IFRFTVAuZGlyU3luYyBjZmdcbiAgICAgICAgdHJ5IGhhbmRsZXIgeyBwYXRoLCB9IGZpbmFsbHlcbiAgICAgICAgICBGUy5ybVN5bmMgcGF0aCwgeyByZWN1cnNpdmU6IHRydWUsIH0gdW5sZXNzIGNmZy5rZWVwXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfd2l0aF9maWxlX2FzeW5jOiAoIGNmZywgaGFuZGxlciApIC0+XG4gICAgICAgIHsgbmFtZTogcGF0aFxuICAgICAgICAgIGZkXG4gICAgICAgICAgcmVtb3ZlQ2FsbGJhY2sgfSA9IFRFTVAuZmlsZVN5bmMgY2ZnXG4gICAgICAgIHRyeSBhd2FpdCBoYW5kbGVyIHsgcGF0aCwgZmQsIH0gZmluYWxseVxuICAgICAgICAgIHJlbW92ZUNhbGxiYWNrKCkgdW5sZXNzIGNmZy5rZWVwXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfd2l0aF9kaXJlY3RvcnlfYXN5bmM6ICggY2ZnLCBoYW5kbGVyICkgLT5cbiAgICAgICAgc3dpdGNoIGFyaXR5ID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgICAgIHdoZW4gMSB0aGVuIFsgY2ZnLCBoYW5kbGVyLCBdID0gWyBudWxsLCBjZmcsIF1cbiAgICAgICAgICB3aGVuIDIgdGhlbiBudWxsXG4gICAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCJleHBlY3RlZCAxIG9yIDIgYXJndW1lbnRzLCBnb3QgI3thcml0eX1cIlxuICAgICAgICBjZmcgICAgICAgICAgICAgPSB7IHRlbXBsYXRlcy50ZW1wLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgRlMgICAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpmcydcbiAgICAgICAgeyBuYW1lOiBwYXRoLCB9ID0gVEVNUC5kaXJTeW5jIGNmZ1xuICAgICAgICB0cnkgYXdhaXQgaGFuZGxlciB7IHBhdGgsIH0gZmluYWxseVxuICAgICAgICAgIEZTLnJtU3luYyBwYXRoLCB7IHJlY3Vyc2l2ZTogdHJ1ZSwgfSB1bmxlc3MgY2ZnLmtlZXBcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGNyZWF0ZV9kaXJlY3Rvcnk6ICggY2ZnICkgLT5cbiAgICAgICAgRlMgICAgICAgICAgICAgID0gcmVxdWlyZSAnbm9kZTpmcydcbiAgICAgICAgY2ZnICAgICAgICAgICAgID0geyB0ZW1wbGF0ZXMudGVtcC4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIHsgbmFtZTogcGF0aCwgfSA9IFRFTVAuZGlyU3luYyBjZmdcbiAgICAgICAgcm0gICAgICAgICAgICAgID0gLT4gRlMucm1TeW5jIHBhdGgsIHsgcmVjdXJzaXZlOiB0cnVlLCB9XG4gICAgICAgIHJldHVybiB7IHBhdGgsIHJtLCB9XG5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBpbnRlcm5hbHMgPSBPYmplY3QuZnJlZXplIHsgaW50ZXJuYWxzLi4uLCBUZW1wLCB9XG4gICAgcmV0dXJuIGV4cG9ydHMgPSB7XG4gICAgICB0ZW1wOiBuZXcgVGVtcFxuICAgICAgIyBUZW1wLFxuICAgICAgaW50ZXJuYWxzLCB9XG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5PYmplY3QuYXNzaWduIG1vZHVsZS5leHBvcnRzLCBVTlNUQUJMRV9URU1QX0JSSUNTXG5cblxuXG5cblxuIl19
