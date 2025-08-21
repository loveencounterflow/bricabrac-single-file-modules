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
    const fs = require('fs');
    const os = require('os');
    const path = require('path');
    const crypto = require('crypto');
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Vuc3RhYmxlLXRlbXAtYnJpY3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLG1CQUFBOzs7OztFQUtBLG1CQUFBLEdBR0UsQ0FBQTs7SUFBQSx5QkFBQSxFQUEyQixRQUFBLENBQUEsQ0FBQTtBQUM3QixVQUFBO01BQUksQ0FBQSxHQUFJLENBQUE7TUFDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QixDQUFBO1lBQUUsSUFBQSxFQUFNO1VBQVIsQ0FBQSxHQUFrQixJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWIsQ0FBbEI7VUFDQSxFQUFBLEdBQWtCLFFBQUEsQ0FBQSxDQUFBO21CQUFHLEVBQUUsQ0FBQyxNQUFILENBQVUsSUFBVixFQUFnQjtjQUFFLFNBQUEsRUFBVztZQUFiLENBQWhCO1VBQUg7QUFDbEIsaUJBQU8sQ0FBRSxJQUFGLEVBQVEsRUFBUjtRQUxTOztNQXRFcEIsRUFmSjs7TUE4RkksU0FBQSxHQUFZLE1BQU0sQ0FBQyxNQUFQLENBQWMsQ0FBRSxHQUFBLFNBQUYsRUFBZ0IsSUFBaEIsQ0FBZDtBQUNaLGFBQU8sT0FBQSxHQUFVO1FBQ2YsSUFBQSxFQUFNLElBQUksSUFBSixDQUFBLENBRFM7O1FBR2Y7TUFIZTtJQWpHTDtFQWwxQmQsRUFSRjs7O0VBazhCQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFyQixFQUE4QixtQkFBOUI7QUFsOEJBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuI1xuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5VTlNUQUJMRV9URU1QX0JSSUNTID1cblxuICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgcmVxdWlyZV90ZW1wX2ludGVybmFsX3RtcDogLT5cbiAgICBSID0ge31cbiAgICBgYGBcbiAgICAvKiFcbiAgICAgKiBUbXBcbiAgICAgKlxuICAgICAqIENvcHlyaWdodCAoYykgMjAxMS0yMDE3IEtBUkFTWkkgSXN0dmFuIDxnaXRodWJAc3BhbS5yYXN6aS5odT5cbiAgICAgKlxuICAgICAqIE1JVCBMaWNlbnNlZFxuICAgICAqL1xuXG4gICAgLypcbiAgICAgKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICAgICAqL1xuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICBjb25zdCBvcyA9IHJlcXVpcmUoJ29zJyk7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICBjb25zdCBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgICBjb25zdCBfYyA9IHsgZnM6IGZzLmNvbnN0YW50cywgb3M6IG9zLmNvbnN0YW50cyB9O1xuXG4gICAgLypcbiAgICAgKiBUaGUgd29ya2luZyBpbm5lciB2YXJpYWJsZXMuXG4gICAgICovXG4gICAgY29uc3QgLy8gdGhlIHJhbmRvbSBjaGFyYWN0ZXJzIHRvIGNob29zZSBmcm9tXG4gICAgICBSQU5ET01fQ0hBUlMgPSAnMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonLFxuICAgICAgVEVNUExBVEVfUEFUVEVSTiA9IC9YWFhYWFgvLFxuICAgICAgREVGQVVMVF9UUklFUyA9IDMsXG4gICAgICBDUkVBVEVfRkxBR1MgPSAoX2MuT19DUkVBVCB8fCBfYy5mcy5PX0NSRUFUKSB8IChfYy5PX0VYQ0wgfHwgX2MuZnMuT19FWENMKSB8IChfYy5PX1JEV1IgfHwgX2MuZnMuT19SRFdSKSxcbiAgICAgIC8vIGNvbnN0YW50cyBhcmUgb2ZmIG9uIHRoZSB3aW5kb3dzIHBsYXRmb3JtIGFuZCB3aWxsIG5vdCBtYXRjaCB0aGUgYWN0dWFsIGVycm5vIGNvZGVzXG4gICAgICBJU19XSU4zMiA9IG9zLnBsYXRmb3JtKCkgPT09ICd3aW4zMicsXG4gICAgICBFQkFERiA9IF9jLkVCQURGIHx8IF9jLm9zLmVycm5vLkVCQURGLFxuICAgICAgRU5PRU5UID0gX2MuRU5PRU5UIHx8IF9jLm9zLmVycm5vLkVOT0VOVCxcbiAgICAgIERJUl9NT0RFID0gMG83MDAgLyogNDQ4ICovLFxuICAgICAgRklMRV9NT0RFID0gMG82MDAgLyogMzg0ICovLFxuICAgICAgRVhJVCA9ICdleGl0JyxcbiAgICAgIC8vIHRoaXMgd2lsbCBob2xkIHRoZSBvYmplY3RzIG5lZWQgdG8gYmUgcmVtb3ZlZCBvbiBleGl0XG4gICAgICBfcmVtb3ZlT2JqZWN0cyA9IFtdLFxuICAgICAgLy8gQVBJIGNoYW5nZSBpbiBmcy5ybWRpclN5bmMgbGVhZHMgdG8gZXJyb3Igd2hlbiBwYXNzaW5nIGluIGEgc2Vjb25kIHBhcmFtZXRlciwgZS5nLiB0aGUgY2FsbGJhY2tcbiAgICAgIEZOX1JNRElSX1NZTkMgPSBmcy5ybWRpclN5bmMuYmluZChmcyk7XG5cbiAgICBsZXQgX2dyYWNlZnVsQ2xlYW51cCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogUmVjdXJzaXZlbHkgcmVtb3ZlIGEgZGlyZWN0b3J5IGFuZCBpdHMgY29udGVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGlyUGF0aCBwYXRoIG9mIGRpcmVjdG9yeSB0byByZW1vdmVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmltcmFmKGRpclBhdGgsIGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gZnMucm0oZGlyUGF0aCwgeyByZWN1cnNpdmU6IHRydWUgfSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlY3Vyc2l2ZWx5IHJlbW92ZSBhIGRpcmVjdG9yeSBhbmQgaXRzIGNvbnRlbnRzLCBzeW5jaHJvbm91c2x5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGRpclBhdGggcGF0aCBvZiBkaXJlY3RvcnkgdG8gcmVtb3ZlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBGTl9SSU1SQUZfU1lOQyhkaXJQYXRoKSB7XG4gICAgICByZXR1cm4gZnMucm1TeW5jKGRpclBhdGgsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSB0ZW1wb3JhcnkgZmlsZSBuYW1lLlxuICAgICAqXG4gICAgICogQHBhcmFtIHsoT3B0aW9uc3x0bXBOYW1lQ2FsbGJhY2spfSBvcHRpb25zIG9wdGlvbnMgb3IgY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0gez90bXBOYW1lQ2FsbGJhY2t9IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRtcE5hbWUob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICAgIGNvbnN0IGFyZ3MgPSBfcGFyc2VBcmd1bWVudHMob3B0aW9ucywgY2FsbGJhY2spLFxuICAgICAgICBvcHRzID0gYXJnc1swXSxcbiAgICAgICAgY2IgPSBhcmdzWzFdO1xuXG4gICAgICBfYXNzZXJ0QW5kU2FuaXRpemVPcHRpb25zKG9wdHMsIGZ1bmN0aW9uIChlcnIsIHNhbml0aXplZE9wdGlvbnMpIHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycik7XG5cbiAgICAgICAgbGV0IHRyaWVzID0gc2FuaXRpemVkT3B0aW9ucy50cmllcztcbiAgICAgICAgKGZ1bmN0aW9uIF9nZXRVbmlxdWVOYW1lKCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gX2dlbmVyYXRlVG1wTmFtZShzYW5pdGl6ZWRPcHRpb25zKTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgd2hldGhlciB0aGUgcGF0aCBleGlzdHMgdGhlbiByZXRyeSBpZiBuZWVkZWRcbiAgICAgICAgICAgIGZzLnN0YXQobmFtZSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgICAgICAgICAgaWYgKHRyaWVzLS0gPiAwKSByZXR1cm4gX2dldFVuaXF1ZU5hbWUoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjYihuZXcgRXJyb3IoJ0NvdWxkIG5vdCBnZXQgYSB1bmlxdWUgdG1wIGZpbGVuYW1lLCBtYXggdHJpZXMgcmVhY2hlZCAnICsgbmFtZSkpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY2IobnVsbCwgbmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNiKGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9KSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3luY2hyb25vdXMgdmVyc2lvbiBvZiB0bXBOYW1lLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZ2VuZXJhdGVkIHJhbmRvbSBuYW1lXG4gICAgICogQHRocm93cyB7RXJyb3J9IGlmIHRoZSBvcHRpb25zIGFyZSBpbnZhbGlkIG9yIGNvdWxkIG5vdCBnZW5lcmF0ZSBhIGZpbGVuYW1lXG4gICAgICovXG4gICAgZnVuY3Rpb24gdG1wTmFtZVN5bmMob3B0aW9ucykge1xuICAgICAgY29uc3QgYXJncyA9IF9wYXJzZUFyZ3VtZW50cyhvcHRpb25zKSxcbiAgICAgICAgb3B0cyA9IGFyZ3NbMF07XG5cbiAgICAgIGNvbnN0IHNhbml0aXplZE9wdGlvbnMgPSBfYXNzZXJ0QW5kU2FuaXRpemVPcHRpb25zU3luYyhvcHRzKTtcblxuICAgICAgbGV0IHRyaWVzID0gc2FuaXRpemVkT3B0aW9ucy50cmllcztcbiAgICAgIGRvIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IF9nZW5lcmF0ZVRtcE5hbWUoc2FuaXRpemVkT3B0aW9ucyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZnMuc3RhdFN5bmMobmFtZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZXR1cm4gbmFtZTtcbiAgICAgICAgfVxuICAgICAgfSB3aGlsZSAodHJpZXMtLSA+IDApO1xuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBnZXQgYSB1bmlxdWUgdG1wIGZpbGVuYW1lLCBtYXggdHJpZXMgcmVhY2hlZCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW5kIG9wZW5zIGEgdGVtcG9yYXJ5IGZpbGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyhPcHRpb25zfG51bGx8dW5kZWZpbmVkfGZpbGVDYWxsYmFjayl9IG9wdGlvbnMgdGhlIGNvbmZpZyBvcHRpb25zIG9yIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBvciBudWxsIG9yIHVuZGVmaW5lZFxuICAgICAqIEBwYXJhbSB7P2ZpbGVDYWxsYmFja30gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaWxlKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgICBjb25zdCBhcmdzID0gX3BhcnNlQXJndW1lbnRzKG9wdGlvbnMsIGNhbGxiYWNrKSxcbiAgICAgICAgb3B0cyA9IGFyZ3NbMF0sXG4gICAgICAgIGNiID0gYXJnc1sxXTtcblxuICAgICAgLy8gZ2V0cyBhIHRlbXBvcmFyeSBmaWxlbmFtZVxuICAgICAgdG1wTmFtZShvcHRzLCBmdW5jdGlvbiBfdG1wTmFtZUNyZWF0ZWQoZXJyLCBuYW1lKSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBhbmQgb3BlbiB0aGUgZmlsZVxuICAgICAgICBmcy5vcGVuKG5hbWUsIENSRUFURV9GTEFHUywgb3B0cy5tb2RlIHx8IEZJTEVfTU9ERSwgZnVuY3Rpb24gX2ZpbGVDcmVhdGVkKGVyciwgZmQpIHtcbiAgICAgICAgICAvKiBpc3RhbmJ1IGlnbm9yZSBlbHNlICovXG4gICAgICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycik7XG5cbiAgICAgICAgICBpZiAob3B0cy5kaXNjYXJkRGVzY3JpcHRvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZzLmNsb3NlKGZkLCBmdW5jdGlvbiBfZGlzY2FyZENhbGxiYWNrKHBvc3NpYmxlRXJyKSB7XG4gICAgICAgICAgICAgIC8vIHRoZSBjaGFuY2Ugb2YgZ2V0dGluZyBhbiBlcnJvciBvbiBjbG9zZSBoZXJlIGlzIHJhdGhlciBsb3cgYW5kIG1pZ2h0IG9jY3VyIGluIHRoZSBtb3N0IGVkZ2llc3QgY2FzZXMgb25seVxuICAgICAgICAgICAgICByZXR1cm4gY2IocG9zc2libGVFcnIsIG5hbWUsIHVuZGVmaW5lZCwgX3ByZXBhcmVUbXBGaWxlUmVtb3ZlQ2FsbGJhY2sobmFtZSwgLTEsIG9wdHMsIGZhbHNlKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZGV0YWNoRGVzY3JpcHRvciBwYXNzZXMgdGhlIGRlc2NyaXB0b3Igd2hlcmVhcyBkaXNjYXJkRGVzY3JpcHRvciBjbG9zZXMgaXQsIGVpdGhlciB3YXksIHdlIG5vIGxvbmdlciBjYXJlXG4gICAgICAgICAgICAvLyBhYm91dCB0aGUgZGVzY3JpcHRvclxuICAgICAgICAgICAgY29uc3QgZGlzY2FyZE9yRGV0YWNoRGVzY3JpcHRvciA9IG9wdHMuZGlzY2FyZERlc2NyaXB0b3IgfHwgb3B0cy5kZXRhY2hEZXNjcmlwdG9yO1xuICAgICAgICAgICAgY2IobnVsbCwgbmFtZSwgZmQsIF9wcmVwYXJlVG1wRmlsZVJlbW92ZUNhbGxiYWNrKG5hbWUsIGRpc2NhcmRPckRldGFjaERlc2NyaXB0b3IgPyAtMSA6IGZkLCBvcHRzLCBmYWxzZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTeW5jaHJvbm91cyB2ZXJzaW9uIG9mIGZpbGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09wdGlvbnN9IG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7RmlsZVN5bmNPYmplY3R9IG9iamVjdCBjb25zaXN0cyBvZiBuYW1lLCBmZCBhbmQgcmVtb3ZlQ2FsbGJhY2tcbiAgICAgKiBAdGhyb3dzIHtFcnJvcn0gaWYgY2Fubm90IGNyZWF0ZSBhIGZpbGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaWxlU3luYyhvcHRpb25zKSB7XG4gICAgICBjb25zdCBhcmdzID0gX3BhcnNlQXJndW1lbnRzKG9wdGlvbnMpLFxuICAgICAgICBvcHRzID0gYXJnc1swXTtcblxuICAgICAgY29uc3QgZGlzY2FyZE9yRGV0YWNoRGVzY3JpcHRvciA9IG9wdHMuZGlzY2FyZERlc2NyaXB0b3IgfHwgb3B0cy5kZXRhY2hEZXNjcmlwdG9yO1xuICAgICAgY29uc3QgbmFtZSA9IHRtcE5hbWVTeW5jKG9wdHMpO1xuICAgICAgbGV0IGZkID0gZnMub3BlblN5bmMobmFtZSwgQ1JFQVRFX0ZMQUdTLCBvcHRzLm1vZGUgfHwgRklMRV9NT0RFKTtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAob3B0cy5kaXNjYXJkRGVzY3JpcHRvcikge1xuICAgICAgICBmcy5jbG9zZVN5bmMoZmQpO1xuICAgICAgICBmZCA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgZmQ6IGZkLFxuICAgICAgICByZW1vdmVDYWxsYmFjazogX3ByZXBhcmVUbXBGaWxlUmVtb3ZlQ2FsbGJhY2sobmFtZSwgZGlzY2FyZE9yRGV0YWNoRGVzY3JpcHRvciA/IC0xIDogZmQsIG9wdHMsIHRydWUpXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSB0ZW1wb3JhcnkgZGlyZWN0b3J5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHsoT3B0aW9uc3xkaXJDYWxsYmFjayl9IG9wdGlvbnMgdGhlIG9wdGlvbnMgb3IgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHs/ZGlyQ2FsbGJhY2t9IGNhbGxiYWNrXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGlyKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgICBjb25zdCBhcmdzID0gX3BhcnNlQXJndW1lbnRzKG9wdGlvbnMsIGNhbGxiYWNrKSxcbiAgICAgICAgb3B0cyA9IGFyZ3NbMF0sXG4gICAgICAgIGNiID0gYXJnc1sxXTtcblxuICAgICAgLy8gZ2V0cyBhIHRlbXBvcmFyeSBmaWxlbmFtZVxuICAgICAgdG1wTmFtZShvcHRzLCBmdW5jdGlvbiBfdG1wTmFtZUNyZWF0ZWQoZXJyLCBuYW1lKSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpO1xuXG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgZGlyZWN0b3J5XG4gICAgICAgIGZzLm1rZGlyKG5hbWUsIG9wdHMubW9kZSB8fCBESVJfTU9ERSwgZnVuY3Rpb24gX2RpckNyZWF0ZWQoZXJyKSB7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKTtcblxuICAgICAgICAgIGNiKG51bGwsIG5hbWUsIF9wcmVwYXJlVG1wRGlyUmVtb3ZlQ2FsbGJhY2sobmFtZSwgb3B0cywgZmFsc2UpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTeW5jaHJvbm91cyB2ZXJzaW9uIG9mIGRpci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T3B0aW9uc30gb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHtEaXJTeW5jT2JqZWN0fSBvYmplY3QgY29uc2lzdHMgb2YgbmFtZSBhbmQgcmVtb3ZlQ2FsbGJhY2tcbiAgICAgKiBAdGhyb3dzIHtFcnJvcn0gaWYgaXQgY2Fubm90IGNyZWF0ZSBhIGRpcmVjdG9yeVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpclN5bmMob3B0aW9ucykge1xuICAgICAgY29uc3QgYXJncyA9IF9wYXJzZUFyZ3VtZW50cyhvcHRpb25zKSxcbiAgICAgICAgb3B0cyA9IGFyZ3NbMF07XG5cbiAgICAgIGNvbnN0IG5hbWUgPSB0bXBOYW1lU3luYyhvcHRzKTtcbiAgICAgIGZzLm1rZGlyU3luYyhuYW1lLCBvcHRzLm1vZGUgfHwgRElSX01PREUpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICByZW1vdmVDYWxsYmFjazogX3ByZXBhcmVUbXBEaXJSZW1vdmVDYWxsYmFjayhuYW1lLCBvcHRzLCB0cnVlKVxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGZpbGVzIGFzeW5jaHJvbm91c2x5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGZkUGF0aFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG5leHRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9yZW1vdmVGaWxlQXN5bmMoZmRQYXRoLCBuZXh0KSB7XG4gICAgICBjb25zdCBfaGFuZGxlciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKGVyciAmJiAhX2lzRU5PRU5UKGVycikpIHtcbiAgICAgICAgICAvLyByZXJhaXNlIGFueSB1bmFudGljaXBhdGVkIGVycm9yXG4gICAgICAgICAgcmV0dXJuIG5leHQoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBuZXh0KCk7XG4gICAgICB9O1xuXG4gICAgICBpZiAoMCA8PSBmZFBhdGhbMF0pXG4gICAgICAgIGZzLmNsb3NlKGZkUGF0aFswXSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZzLnVubGluayhmZFBhdGhbMV0sIF9oYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgICBlbHNlIGZzLnVubGluayhmZFBhdGhbMV0sIF9oYW5kbGVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGZpbGVzIHN5bmNocm9ub3VzbHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZmRQYXRoXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfcmVtb3ZlRmlsZVN5bmMoZmRQYXRoKSB7XG4gICAgICBsZXQgcmV0aHJvd25FeGNlcHRpb24gPSBudWxsO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKDAgPD0gZmRQYXRoWzBdKSBmcy5jbG9zZVN5bmMoZmRQYXRoWzBdKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gcmVyYWlzZSBhbnkgdW5hbnRpY2lwYXRlZCBlcnJvclxuICAgICAgICBpZiAoIV9pc0VCQURGKGUpICYmICFfaXNFTk9FTlQoZSkpIHRocm93IGU7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZzLnVubGlua1N5bmMoZmRQYXRoWzFdKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIHJlcmFpc2UgYW55IHVuYW50aWNpcGF0ZWQgZXJyb3JcbiAgICAgICAgICBpZiAoIV9pc0VOT0VOVChlKSkgcmV0aHJvd25FeGNlcHRpb24gPSBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmV0aHJvd25FeGNlcHRpb24gIT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgcmV0aHJvd25FeGNlcHRpb247XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJlcGFyZXMgdGhlIGNhbGxiYWNrIGZvciByZW1vdmFsIG9mIHRoZSB0ZW1wb3JhcnkgZmlsZS5cbiAgICAgKlxuICAgICAqIFJldHVybnMgZWl0aGVyIGEgc3luYyBjYWxsYmFjayBvciBhIGFzeW5jIGNhbGxiYWNrIGRlcGVuZGluZyBvbiB3aGV0aGVyXG4gICAgICogZmlsZVN5bmMgb3IgZmlsZSB3YXMgY2FsbGVkLCB3aGljaCBpcyBleHByZXNzZWQgYnkgdGhlIHN5bmMgcGFyYW1ldGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgdGhlIHBhdGggb2YgdGhlIGZpbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZmQgZmlsZSBkZXNjcmlwdG9yXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHN5bmNcbiAgICAgKiBAcmV0dXJucyB7ZmlsZUNhbGxiYWNrIHwgZmlsZUNhbGxiYWNrU3luY31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9wcmVwYXJlVG1wRmlsZVJlbW92ZUNhbGxiYWNrKG5hbWUsIGZkLCBvcHRzLCBzeW5jKSB7XG4gICAgICBjb25zdCByZW1vdmVDYWxsYmFja1N5bmMgPSBfcHJlcGFyZVJlbW92ZUNhbGxiYWNrKF9yZW1vdmVGaWxlU3luYywgW2ZkLCBuYW1lXSwgc3luYyk7XG4gICAgICBjb25zdCByZW1vdmVDYWxsYmFjayA9IF9wcmVwYXJlUmVtb3ZlQ2FsbGJhY2soX3JlbW92ZUZpbGVBc3luYywgW2ZkLCBuYW1lXSwgc3luYywgcmVtb3ZlQ2FsbGJhY2tTeW5jKTtcblxuICAgICAgaWYgKCFvcHRzLmtlZXApIF9yZW1vdmVPYmplY3RzLnVuc2hpZnQocmVtb3ZlQ2FsbGJhY2tTeW5jKTtcblxuICAgICAgcmV0dXJuIHN5bmMgPyByZW1vdmVDYWxsYmFja1N5bmMgOiByZW1vdmVDYWxsYmFjaztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcmVwYXJlcyB0aGUgY2FsbGJhY2sgZm9yIHJlbW92YWwgb2YgdGhlIHRlbXBvcmFyeSBkaXJlY3RvcnkuXG4gICAgICpcbiAgICAgKiBSZXR1cm5zIGVpdGhlciBhIHN5bmMgY2FsbGJhY2sgb3IgYSBhc3luYyBjYWxsYmFjayBkZXBlbmRpbmcgb24gd2hldGhlclxuICAgICAqIHRtcEZpbGVTeW5jIG9yIHRtcEZpbGUgd2FzIGNhbGxlZCwgd2hpY2ggaXMgZXhwcmVzc2VkIGJ5IHRoZSBzeW5jIHBhcmFtZXRlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHN5bmNcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IHRoZSBjYWxsYmFja1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3ByZXBhcmVUbXBEaXJSZW1vdmVDYWxsYmFjayhuYW1lLCBvcHRzLCBzeW5jKSB7XG4gICAgICBjb25zdCByZW1vdmVGdW5jdGlvbiA9IG9wdHMudW5zYWZlQ2xlYW51cCA/IHJpbXJhZiA6IGZzLnJtZGlyLmJpbmQoZnMpO1xuICAgICAgY29uc3QgcmVtb3ZlRnVuY3Rpb25TeW5jID0gb3B0cy51bnNhZmVDbGVhbnVwID8gRk5fUklNUkFGX1NZTkMgOiBGTl9STURJUl9TWU5DO1xuICAgICAgY29uc3QgcmVtb3ZlQ2FsbGJhY2tTeW5jID0gX3ByZXBhcmVSZW1vdmVDYWxsYmFjayhyZW1vdmVGdW5jdGlvblN5bmMsIG5hbWUsIHN5bmMpO1xuICAgICAgY29uc3QgcmVtb3ZlQ2FsbGJhY2sgPSBfcHJlcGFyZVJlbW92ZUNhbGxiYWNrKHJlbW92ZUZ1bmN0aW9uLCBuYW1lLCBzeW5jLCByZW1vdmVDYWxsYmFja1N5bmMpO1xuICAgICAgaWYgKCFvcHRzLmtlZXApIF9yZW1vdmVPYmplY3RzLnVuc2hpZnQocmVtb3ZlQ2FsbGJhY2tTeW5jKTtcblxuICAgICAgcmV0dXJuIHN5bmMgPyByZW1vdmVDYWxsYmFja1N5bmMgOiByZW1vdmVDYWxsYmFjaztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZ3VhcmRlZCBmdW5jdGlvbiB3cmFwcGluZyB0aGUgcmVtb3ZlRnVuY3Rpb24gY2FsbC5cbiAgICAgKlxuICAgICAqIFRoZSBjbGVhbnVwIGNhbGxiYWNrIGlzIHNhdmUgdG8gYmUgY2FsbGVkIG11bHRpcGxlIHRpbWVzLlxuICAgICAqIFN1YnNlcXVlbnQgaW52b2NhdGlvbnMgd2lsbCBiZSBpZ25vcmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVtb3ZlRnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZU9yRGlyTmFtZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gc3luY1xuICAgICAqIEBwYXJhbSB7Y2xlYW51cENhbGxiYWNrU3luYz99IGNsZWFudXBDYWxsYmFja1N5bmNcbiAgICAgKiBAcmV0dXJucyB7Y2xlYW51cENhbGxiYWNrIHwgY2xlYW51cENhbGxiYWNrU3luY31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9wcmVwYXJlUmVtb3ZlQ2FsbGJhY2socmVtb3ZlRnVuY3Rpb24sIGZpbGVPckRpck5hbWUsIHN5bmMsIGNsZWFudXBDYWxsYmFja1N5bmMpIHtcbiAgICAgIGxldCBjYWxsZWQgPSBmYWxzZTtcblxuICAgICAgLy8gaWYgc3luYyBpcyB0cnVlLCB0aGUgbmV4dCBwYXJhbWV0ZXIgd2lsbCBiZSBpZ25vcmVkXG4gICAgICByZXR1cm4gZnVuY3Rpb24gX2NsZWFudXBDYWxsYmFjayhuZXh0KSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgIGlmICghY2FsbGVkKSB7XG4gICAgICAgICAgLy8gcmVtb3ZlIGNsZWFudXBDYWxsYmFjayBmcm9tIGNhY2hlXG4gICAgICAgICAgY29uc3QgdG9SZW1vdmUgPSBjbGVhbnVwQ2FsbGJhY2tTeW5jIHx8IF9jbGVhbnVwQ2FsbGJhY2s7XG4gICAgICAgICAgY29uc3QgaW5kZXggPSBfcmVtb3ZlT2JqZWN0cy5pbmRleE9mKHRvUmVtb3ZlKTtcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgIGlmIChpbmRleCA+PSAwKSBfcmVtb3ZlT2JqZWN0cy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoc3luYyB8fCByZW1vdmVGdW5jdGlvbiA9PT0gRk5fUk1ESVJfU1lOQyB8fCByZW1vdmVGdW5jdGlvbiA9PT0gRk5fUklNUkFGX1NZTkMpIHtcbiAgICAgICAgICAgIHJldHVybiByZW1vdmVGdW5jdGlvbihmaWxlT3JEaXJOYW1lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJlbW92ZUZ1bmN0aW9uKGZpbGVPckRpck5hbWUsIG5leHQgfHwgZnVuY3Rpb24gKCkge30pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZ2FyYmFnZSBjb2xsZWN0b3IuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9nYXJiYWdlQ29sbGVjdG9yKCkge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmICghX2dyYWNlZnVsQ2xlYW51cCkgcmV0dXJuO1xuXG4gICAgICAvLyB0aGUgZnVuY3Rpb24gYmVpbmcgY2FsbGVkIHJlbW92ZXMgaXRzZWxmIGZyb20gX3JlbW92ZU9iamVjdHMsXG4gICAgICAvLyBsb29wIHVudGlsIF9yZW1vdmVPYmplY3RzIGlzIGVtcHR5XG4gICAgICB3aGlsZSAoX3JlbW92ZU9iamVjdHMubGVuZ3RoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgX3JlbW92ZU9iamVjdHNbMF0oKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIGFscmVhZHkgcmVtb3ZlZD9cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJhbmRvbSBuYW1lIGdlbmVyYXRvciBiYXNlZCBvbiBjcnlwdG8uXG4gICAgICogQWRhcHRlZCBmcm9tIGh0dHA6Ly9ibG9nLnRvbXBhd2xhay5vcmcvaG93LXRvLWdlbmVyYXRlLXJhbmRvbS12YWx1ZXMtbm9kZWpzLWphdmFzY3JpcHRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBob3dNYW55XG4gICAgICogQHJldHVybnMge3N0cmluZ30gdGhlIGdlbmVyYXRlZCByYW5kb20gbmFtZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3JhbmRvbUNoYXJzKGhvd01hbnkpIHtcbiAgICAgIGxldCB2YWx1ZSA9IFtdLFxuICAgICAgICBybmQgPSBudWxsO1xuXG4gICAgICAvLyBtYWtlIHN1cmUgdGhhdCB3ZSBkbyBub3QgZmFpbCBiZWNhdXNlIHdlIHJhbiBvdXQgb2YgZW50cm9weVxuICAgICAgdHJ5IHtcbiAgICAgICAgcm5kID0gY3J5cHRvLnJhbmRvbUJ5dGVzKGhvd01hbnkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBybmQgPSBjcnlwdG8ucHNldWRvUmFuZG9tQnl0ZXMoaG93TWFueSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaG93TWFueTsgaSsrKSB7XG4gICAgICAgIHZhbHVlLnB1c2goUkFORE9NX0NIQVJTW3JuZFtpXSAlIFJBTkRPTV9DSEFSUy5sZW5ndGhdKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlLmpvaW4oJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSBgb2JqYCBwYXJhbWV0ZXIgaXMgZGVmaW5lZCBvciBub3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIG9iamVjdCBpcyB1bmRlZmluZWRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9pc1VuZGVmaW5lZChvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZXMgdGhlIGZ1bmN0aW9uIGFyZ3VtZW50cy5cbiAgICAgKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gaGVscHMgdG8gaGF2ZSBvcHRpb25hbCBhcmd1bWVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyhPcHRpb25zfG51bGx8dW5kZWZpbmVkfEZ1bmN0aW9uKX0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7P0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEByZXR1cm5zIHtBcnJheX0gcGFyc2VkIGFyZ3VtZW50c1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3BhcnNlQXJndW1lbnRzKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBbe30sIG9wdGlvbnNdO1xuICAgICAgfVxuXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKF9pc1VuZGVmaW5lZChvcHRpb25zKSkge1xuICAgICAgICByZXR1cm4gW3t9LCBjYWxsYmFja107XG4gICAgICB9XG5cbiAgICAgIC8vIGNvcHkgb3B0aW9ucyBzbyB3ZSBkbyBub3QgbGVhayB0aGUgY2hhbmdlcyB3ZSBtYWtlIGludGVybmFsbHlcbiAgICAgIGNvbnN0IGFjdHVhbE9wdGlvbnMgPSB7fTtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9wdGlvbnMpKSB7XG4gICAgICAgIGFjdHVhbE9wdGlvbnNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFthY3R1YWxPcHRpb25zLCBjYWxsYmFja107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZSB0aGUgc3BlY2lmaWVkIHBhdGggbmFtZSBpbiByZXNwZWN0IHRvIHRtcERpci5cbiAgICAgKlxuICAgICAqIFRoZSBzcGVjaWZpZWQgbmFtZSBtaWdodCBpbmNsdWRlIHJlbGF0aXZlIHBhdGggY29tcG9uZW50cywgZS5nLiAuLi9cbiAgICAgKiBzbyB3ZSBuZWVkIHRvIHJlc29sdmUgaW4gb3JkZXIgdG8gYmUgc3VyZSB0aGF0IGlzIGlzIGxvY2F0ZWQgaW5zaWRlIHRtcERpclxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfcmVzb2x2ZVBhdGgobmFtZSwgdG1wRGlyLCBjYikge1xuICAgICAgY29uc3QgcGF0aFRvUmVzb2x2ZSA9IHBhdGguaXNBYnNvbHV0ZShuYW1lKSA/IG5hbWUgOiBwYXRoLmpvaW4odG1wRGlyLCBuYW1lKTtcblxuICAgICAgZnMuc3RhdChwYXRoVG9SZXNvbHZlLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBmcy5yZWFscGF0aChwYXRoLmRpcm5hbWUocGF0aFRvUmVzb2x2ZSksIGZ1bmN0aW9uIChlcnIsIHBhcmVudERpcikge1xuICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycik7XG5cbiAgICAgICAgICAgIGNiKG51bGwsIHBhdGguam9pbihwYXJlbnREaXIsIHBhdGguYmFzZW5hbWUocGF0aFRvUmVzb2x2ZSkpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcy5yZWFscGF0aChwYXRoVG9SZXNvbHZlLCBjYik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc29sdmUgdGhlIHNwZWNpZmllZCBwYXRoIG5hbWUgaW4gcmVzcGVjdCB0byB0bXBEaXIuXG4gICAgICpcbiAgICAgKiBUaGUgc3BlY2lmaWVkIG5hbWUgbWlnaHQgaW5jbHVkZSByZWxhdGl2ZSBwYXRoIGNvbXBvbmVudHMsIGUuZy4gLi4vXG4gICAgICogc28gd2UgbmVlZCB0byByZXNvbHZlIGluIG9yZGVyIHRvIGJlIHN1cmUgdGhhdCBpcyBpcyBsb2NhdGVkIGluc2lkZSB0bXBEaXJcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3Jlc29sdmVQYXRoU3luYyhuYW1lLCB0bXBEaXIpIHtcbiAgICAgIGNvbnN0IHBhdGhUb1Jlc29sdmUgPSBwYXRoLmlzQWJzb2x1dGUobmFtZSkgPyBuYW1lIDogcGF0aC5qb2luKHRtcERpciwgbmFtZSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZzLnN0YXRTeW5jKHBhdGhUb1Jlc29sdmUpO1xuICAgICAgICByZXR1cm4gZnMucmVhbHBhdGhTeW5jKHBhdGhUb1Jlc29sdmUpO1xuICAgICAgfSBjYXRjaCAoX2Vycikge1xuICAgICAgICBjb25zdCBwYXJlbnREaXIgPSBmcy5yZWFscGF0aFN5bmMocGF0aC5kaXJuYW1lKHBhdGhUb1Jlc29sdmUpKTtcblxuICAgICAgICByZXR1cm4gcGF0aC5qb2luKHBhcmVudERpciwgcGF0aC5iYXNlbmFtZShwYXRoVG9SZXNvbHZlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGVzIGEgbmV3IHRlbXBvcmFyeSBuYW1lLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgbmV3IHJhbmRvbSBuYW1lIGFjY29yZGluZyB0byBvcHRzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZ2VuZXJhdGVUbXBOYW1lKG9wdHMpIHtcbiAgICAgIGNvbnN0IHRtcERpciA9IG9wdHMudG1wZGlyO1xuXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKCFfaXNVbmRlZmluZWQob3B0cy5uYW1lKSkge1xuICAgICAgICByZXR1cm4gcGF0aC5qb2luKHRtcERpciwgb3B0cy5kaXIsIG9wdHMubmFtZSk7XG4gICAgICB9XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAoIV9pc1VuZGVmaW5lZChvcHRzLnRlbXBsYXRlKSkge1xuICAgICAgICByZXR1cm4gcGF0aC5qb2luKHRtcERpciwgb3B0cy5kaXIsIG9wdHMudGVtcGxhdGUpLnJlcGxhY2UoVEVNUExBVEVfUEFUVEVSTiwgX3JhbmRvbUNoYXJzKDYpKTtcbiAgICAgIH1cblxuICAgICAgLy8gcHJlZml4IGFuZCBwb3N0Zml4XG4gICAgICBjb25zdCBuYW1lID0gW1xuICAgICAgICBvcHRzLnByZWZpeCA/IG9wdHMucHJlZml4IDogJ3RtcCcsXG4gICAgICAgICctJyxcbiAgICAgICAgcHJvY2Vzcy5waWQsXG4gICAgICAgICctJyxcbiAgICAgICAgX3JhbmRvbUNoYXJzKDEyKSxcbiAgICAgICAgb3B0cy5wb3N0Zml4ID8gJy0nICsgb3B0cy5wb3N0Zml4IDogJydcbiAgICAgIF0uam9pbignJyk7XG5cbiAgICAgIHJldHVybiBwYXRoLmpvaW4odG1wRGlyLCBvcHRzLmRpciwgbmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyBhbmQgc2FuaXRpemVzIHRoZSBiYXNpYyBvcHRpb25zLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfYXNzZXJ0T3B0aW9uc0Jhc2Uob3B0aW9ucykge1xuICAgICAgaWYgKCFfaXNVbmRlZmluZWQob3B0aW9ucy5uYW1lKSkge1xuICAgICAgICBjb25zdCBuYW1lID0gb3B0aW9ucy5uYW1lO1xuXG4gICAgICAgIC8vIGFzc2VydCB0aGF0IG5hbWUgaXMgbm90IGFic29sdXRlIGFuZCBkb2VzIG5vdCBjb250YWluIGEgcGF0aFxuICAgICAgICBpZiAocGF0aC5pc0Fic29sdXRlKG5hbWUpKSB0aHJvdyBuZXcgRXJyb3IoYG5hbWUgb3B0aW9uIG11c3Qgbm90IGNvbnRhaW4gYW4gYWJzb2x1dGUgcGF0aCwgZm91bmQgXCIke25hbWV9XCIuYCk7XG5cbiAgICAgICAgLy8gbXVzdCBub3QgZmFpbCBvbiB2YWxpZCAuPG5hbWU+IG9yIC4uPG5hbWU+IG9yIHNpbWlsYXIgc3VjaCBjb25zdHJ1Y3RzXG4gICAgICAgIGNvbnN0IGJhc2VuYW1lID0gcGF0aC5iYXNlbmFtZShuYW1lKTtcbiAgICAgICAgaWYgKGJhc2VuYW1lID09PSAnLi4nIHx8IGJhc2VuYW1lID09PSAnLicgfHwgYmFzZW5hbWUgIT09IG5hbWUpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBuYW1lIG9wdGlvbiBtdXN0IG5vdCBjb250YWluIGEgcGF0aCwgZm91bmQgXCIke25hbWV9XCIuYCk7XG4gICAgICB9XG5cbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAoIV9pc1VuZGVmaW5lZChvcHRpb25zLnRlbXBsYXRlKSAmJiAhb3B0aW9ucy50ZW1wbGF0ZS5tYXRjaChURU1QTEFURV9QQVRURVJOKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdGVtcGxhdGUsIGZvdW5kIFwiJHtvcHRpb25zLnRlbXBsYXRlfVwiLmApO1xuICAgICAgfVxuXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKCghX2lzVW5kZWZpbmVkKG9wdGlvbnMudHJpZXMpICYmIGlzTmFOKG9wdGlvbnMudHJpZXMpKSB8fCBvcHRpb25zLnRyaWVzIDwgMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdHJpZXMsIGZvdW5kIFwiJHtvcHRpb25zLnRyaWVzfVwiLmApO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiBhIG5hbWUgd2FzIHNwZWNpZmllZCB3ZSB3aWxsIHRyeSBvbmNlXG4gICAgICBvcHRpb25zLnRyaWVzID0gX2lzVW5kZWZpbmVkKG9wdGlvbnMubmFtZSkgPyBvcHRpb25zLnRyaWVzIHx8IERFRkFVTFRfVFJJRVMgOiAxO1xuICAgICAgb3B0aW9ucy5rZWVwID0gISFvcHRpb25zLmtlZXA7XG4gICAgICBvcHRpb25zLmRldGFjaERlc2NyaXB0b3IgPSAhIW9wdGlvbnMuZGV0YWNoRGVzY3JpcHRvcjtcbiAgICAgIG9wdGlvbnMuZGlzY2FyZERlc2NyaXB0b3IgPSAhIW9wdGlvbnMuZGlzY2FyZERlc2NyaXB0b3I7XG4gICAgICBvcHRpb25zLnVuc2FmZUNsZWFudXAgPSAhIW9wdGlvbnMudW5zYWZlQ2xlYW51cDtcblxuICAgICAgLy8gZm9yIGNvbXBsZXRlbmVzcycgc2FrZSBvbmx5LCBhbHNvIGtlZXAgKG11bHRpcGxlKSBibGFua3MgaWYgdGhlIHVzZXIsIHB1cnBvcnRlZGx5IHNhbmUsIHJlcXVlc3RzIHVzIHRvXG4gICAgICBvcHRpb25zLnByZWZpeCA9IF9pc1VuZGVmaW5lZChvcHRpb25zLnByZWZpeCkgPyAnJyA6IG9wdGlvbnMucHJlZml4O1xuICAgICAgb3B0aW9ucy5wb3N0Zml4ID0gX2lzVW5kZWZpbmVkKG9wdGlvbnMucG9zdGZpeCkgPyAnJyA6IG9wdGlvbnMucG9zdGZpeDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSByZWxhdGl2ZSBkaXJlY3RvcnkgdG8gdG1wRGlyLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZ2V0UmVsYXRpdmVQYXRoKG9wdGlvbiwgbmFtZSwgdG1wRGlyLCBjYikge1xuICAgICAgaWYgKF9pc1VuZGVmaW5lZChuYW1lKSkgcmV0dXJuIGNiKG51bGwpO1xuXG4gICAgICBfcmVzb2x2ZVBhdGgobmFtZSwgdG1wRGlyLCBmdW5jdGlvbiAoZXJyLCByZXNvbHZlZFBhdGgpIHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycik7XG5cbiAgICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gcGF0aC5yZWxhdGl2ZSh0bXBEaXIsIHJlc29sdmVkUGF0aCk7XG5cbiAgICAgICAgaWYgKCFyZXNvbHZlZFBhdGguc3RhcnRzV2l0aCh0bXBEaXIpKSB7XG4gICAgICAgICAgcmV0dXJuIGNiKG5ldyBFcnJvcihgJHtvcHRpb259IG9wdGlvbiBtdXN0IGJlIHJlbGF0aXZlIHRvIFwiJHt0bXBEaXJ9XCIsIGZvdW5kIFwiJHtyZWxhdGl2ZVBhdGh9XCIuYCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2IobnVsbCwgcmVsYXRpdmVQYXRoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHJlbGF0aXZlIHBhdGggdG8gdG1wRGlyLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZ2V0UmVsYXRpdmVQYXRoU3luYyhvcHRpb24sIG5hbWUsIHRtcERpcikge1xuICAgICAgaWYgKF9pc1VuZGVmaW5lZChuYW1lKSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCByZXNvbHZlZFBhdGggPSBfcmVzb2x2ZVBhdGhTeW5jKG5hbWUsIHRtcERpcik7XG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBwYXRoLnJlbGF0aXZlKHRtcERpciwgcmVzb2x2ZWRQYXRoKTtcblxuICAgICAgaWYgKCFyZXNvbHZlZFBhdGguc3RhcnRzV2l0aCh0bXBEaXIpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvcHRpb259IG9wdGlvbiBtdXN0IGJlIHJlbGF0aXZlIHRvIFwiJHt0bXBEaXJ9XCIsIGZvdW5kIFwiJHtyZWxhdGl2ZVBhdGh9XCIuYCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZWxhdGl2ZVBhdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXNzZXJ0cyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgb3B0aW9ucyBhcmUgdmFsaWQsIGFsc28gc2FuaXRpemVzIG9wdGlvbnMgYW5kIHByb3ZpZGVzIHNhbmUgZGVmYXVsdHMgZm9yIG1pc3NpbmdcbiAgICAgKiBvcHRpb25zLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfYXNzZXJ0QW5kU2FuaXRpemVPcHRpb25zKG9wdGlvbnMsIGNiKSB7XG4gICAgICBfZ2V0VG1wRGlyKG9wdGlvbnMsIGZ1bmN0aW9uIChlcnIsIHRtcERpcikge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKTtcblxuICAgICAgICBvcHRpb25zLnRtcGRpciA9IHRtcERpcjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIF9hc3NlcnRPcHRpb25zQmFzZShvcHRpb25zLCB0bXBEaXIpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNhbml0aXplIGRpciwgYWxzbyBrZWVwIChtdWx0aXBsZSkgYmxhbmtzIGlmIHRoZSB1c2VyLCBwdXJwb3J0ZWRseSBzYW5lLCByZXF1ZXN0cyB1cyB0b1xuICAgICAgICBfZ2V0UmVsYXRpdmVQYXRoKCdkaXInLCBvcHRpb25zLmRpciwgdG1wRGlyLCBmdW5jdGlvbiAoZXJyLCBkaXIpIHtcbiAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKTtcblxuICAgICAgICAgIG9wdGlvbnMuZGlyID0gX2lzVW5kZWZpbmVkKGRpcikgPyAnJyA6IGRpcjtcblxuICAgICAgICAgIC8vIHNhbml0aXplIGZ1cnRoZXIgaWYgdGVtcGxhdGUgaXMgcmVsYXRpdmUgdG8gb3B0aW9ucy5kaXJcbiAgICAgICAgICBfZ2V0UmVsYXRpdmVQYXRoKCd0ZW1wbGF0ZScsIG9wdGlvbnMudGVtcGxhdGUsIHRtcERpciwgZnVuY3Rpb24gKGVyciwgdGVtcGxhdGUpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpO1xuXG4gICAgICAgICAgICBvcHRpb25zLnRlbXBsYXRlID0gdGVtcGxhdGU7XG5cbiAgICAgICAgICAgIGNiKG51bGwsIG9wdGlvbnMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFzc2VydHMgd2hldGhlciB0aGUgc3BlY2lmaWVkIG9wdGlvbnMgYXJlIHZhbGlkLCBhbHNvIHNhbml0aXplcyBvcHRpb25zIGFuZCBwcm92aWRlcyBzYW5lIGRlZmF1bHRzIGZvciBtaXNzaW5nXG4gICAgICogb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2Fzc2VydEFuZFNhbml0aXplT3B0aW9uc1N5bmMob3B0aW9ucykge1xuICAgICAgY29uc3QgdG1wRGlyID0gKG9wdGlvbnMudG1wZGlyID0gX2dldFRtcERpclN5bmMob3B0aW9ucykpO1xuXG4gICAgICBfYXNzZXJ0T3B0aW9uc0Jhc2Uob3B0aW9ucywgdG1wRGlyKTtcblxuICAgICAgY29uc3QgZGlyID0gX2dldFJlbGF0aXZlUGF0aFN5bmMoJ2RpcicsIG9wdGlvbnMuZGlyLCB0bXBEaXIpO1xuICAgICAgb3B0aW9ucy5kaXIgPSBfaXNVbmRlZmluZWQoZGlyKSA/ICcnIDogZGlyO1xuXG4gICAgICBvcHRpb25zLnRlbXBsYXRlID0gX2dldFJlbGF0aXZlUGF0aFN5bmMoJ3RlbXBsYXRlJywgb3B0aW9ucy50ZW1wbGF0ZSwgdG1wRGlyKTtcblxuICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGVscGVyIGZvciB0ZXN0aW5nIGFnYWluc3QgRUJBREYgdG8gY29tcGVuc2F0ZSBjaGFuZ2VzIG1hZGUgdG8gTm9kZSA3LnggdW5kZXIgV2luZG93cy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2lzRUJBREYoZXJyb3IpIHtcbiAgICAgIHJldHVybiBfaXNFeHBlY3RlZEVycm9yKGVycm9yLCAtRUJBREYsICdFQkFERicpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhlbHBlciBmb3IgdGVzdGluZyBhZ2FpbnN0IEVOT0VOVCB0byBjb21wZW5zYXRlIGNoYW5nZXMgbWFkZSB0byBOb2RlIDcueCB1bmRlciBXaW5kb3dzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaXNFTk9FTlQoZXJyb3IpIHtcbiAgICAgIHJldHVybiBfaXNFeHBlY3RlZEVycm9yKGVycm9yLCAtRU5PRU5ULCAnRU5PRU5UJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGVscGVyIHRvIGRldGVybWluZSB3aGV0aGVyIHRoZSBleHBlY3RlZCBlcnJvciBjb2RlIG1hdGNoZXMgdGhlIGFjdHVhbCBjb2RlIGFuZCBlcnJubyxcbiAgICAgKiB3aGljaCB3aWxsIGRpZmZlciBiZXR3ZWVuIHRoZSBzdXBwb3J0ZWQgbm9kZSB2ZXJzaW9ucy5cbiAgICAgKlxuICAgICAqIC0gTm9kZSA+PSA3LjA6XG4gICAgICogICBlcnJvci5jb2RlIHtzdHJpbmd9XG4gICAgICogICBlcnJvci5lcnJubyB7bnVtYmVyfSBhbnkgbnVtZXJpY2FsIHZhbHVlIHdpbGwgYmUgbmVnYXRlZFxuICAgICAqXG4gICAgICogQ0FWRUFUXG4gICAgICpcbiAgICAgKiBPbiB3aW5kb3dzLCB0aGUgZXJybm8gZm9yIEVCQURGIGlzIC00MDgzIGJ1dCBvcy5jb25zdGFudHMuZXJybm8uRUJBREYgaXMgZGlmZmVyZW50IGFuZCB3ZSBtdXN0IGFzc3VtZSB0aGF0IEVOT0VOVFxuICAgICAqIGlzIG5vIGRpZmZlcmVudCBoZXJlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTeXN0ZW1FcnJvcn0gZXJyb3JcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZXJybm9cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2lzRXhwZWN0ZWRFcnJvcihlcnJvciwgZXJybm8sIGNvZGUpIHtcbiAgICAgIHJldHVybiBJU19XSU4zMiA/IGVycm9yLmNvZGUgPT09IGNvZGUgOiBlcnJvci5jb2RlID09PSBjb2RlICYmIGVycm9yLmVycm5vID09PSBlcnJubztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBncmFjZWZ1bCBjbGVhbnVwLlxuICAgICAqXG4gICAgICogSWYgZ3JhY2VmdWwgY2xlYW51cCBpcyBzZXQsIHRtcCB3aWxsIHJlbW92ZSBhbGwgY29udHJvbGxlZCB0ZW1wb3Jhcnkgb2JqZWN0cyBvbiBwcm9jZXNzIGV4aXQsIG90aGVyd2lzZSB0aGVcbiAgICAgKiB0ZW1wb3Jhcnkgb2JqZWN0cyB3aWxsIHJlbWFpbiBpbiBwbGFjZSwgd2FpdGluZyB0byBiZSBjbGVhbmVkIHVwIG9uIHN5c3RlbSByZXN0YXJ0IG9yIG90aGVyd2lzZSBzY2hlZHVsZWQgdGVtcG9yYXJ5XG4gICAgICogb2JqZWN0IHJlbW92YWxzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldEdyYWNlZnVsQ2xlYW51cCgpIHtcbiAgICAgIF9ncmFjZWZ1bENsZWFudXAgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGN1cnJlbnRseSBjb25maWd1cmVkIHRtcCBkaXIgZnJvbSBvcy50bXBkaXIoKS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2dldFRtcERpcihvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIGZzLnJlYWxwYXRoKChvcHRpb25zICYmIG9wdGlvbnMudG1wZGlyKSB8fCBvcy50bXBkaXIoKSwgY2IpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGN1cnJlbnRseSBjb25maWd1cmVkIHRtcCBkaXIgZnJvbSBvcy50bXBkaXIoKS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2dldFRtcERpclN5bmMob3B0aW9ucykge1xuICAgICAgcmV0dXJuIGZzLnJlYWxwYXRoU3luYygob3B0aW9ucyAmJiBvcHRpb25zLnRtcGRpcikgfHwgb3MudG1wZGlyKCkpO1xuICAgIH1cblxuICAgIC8vIEluc3RhbGwgcHJvY2VzcyBleGl0IGxpc3RlbmVyXG4gICAgcHJvY2Vzcy5hZGRMaXN0ZW5lcihFWElULCBfZ2FyYmFnZUNvbGxlY3Rvcik7XG5cbiAgICAvKipcbiAgICAgKiBDb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBPcHRpb25zXG4gICAgICogQHByb3BlcnR5IHs/Ym9vbGVhbn0ga2VlcCB0aGUgdGVtcG9yYXJ5IG9iamVjdCAoZmlsZSBvciBkaXIpIHdpbGwgbm90IGJlIGdhcmJhZ2UgY29sbGVjdGVkXG4gICAgICogQHByb3BlcnR5IHs/bnVtYmVyfSB0cmllcyB0aGUgbnVtYmVyIG9mIHRyaWVzIGJlZm9yZSBnaXZlIHVwIHRoZSBuYW1lIGdlbmVyYXRpb25cbiAgICAgKiBAcHJvcGVydHkgKD9pbnQpIG1vZGUgdGhlIGFjY2VzcyBtb2RlLCBkZWZhdWx0cyBhcmUgMG83MDAgZm9yIGRpcmVjdG9yaWVzIGFuZCAwbzYwMCBmb3IgZmlsZXNcbiAgICAgKiBAcHJvcGVydHkgez9zdHJpbmd9IHRlbXBsYXRlIHRoZSBcIm1rc3RlbXBcIiBsaWtlIGZpbGVuYW1lIHRlbXBsYXRlXG4gICAgICogQHByb3BlcnR5IHs/c3RyaW5nfSBuYW1lIGZpeGVkIG5hbWUgcmVsYXRpdmUgdG8gdG1wZGlyIG9yIHRoZSBzcGVjaWZpZWQgZGlyIG9wdGlvblxuICAgICAqIEBwcm9wZXJ0eSB7P3N0cmluZ30gZGlyIHRtcCBkaXJlY3RvcnkgcmVsYXRpdmUgdG8gdGhlIHJvb3QgdG1wIGRpcmVjdG9yeSBpbiB1c2VcbiAgICAgKiBAcHJvcGVydHkgez9zdHJpbmd9IHByZWZpeCBwcmVmaXggZm9yIHRoZSBnZW5lcmF0ZWQgbmFtZVxuICAgICAqIEBwcm9wZXJ0eSB7P3N0cmluZ30gcG9zdGZpeCBwb3N0Zml4IGZvciB0aGUgZ2VuZXJhdGVkIG5hbWVcbiAgICAgKiBAcHJvcGVydHkgez9zdHJpbmd9IHRtcGRpciB0aGUgcm9vdCB0bXAgZGlyZWN0b3J5IHdoaWNoIG92ZXJyaWRlcyB0aGUgb3MgdG1wZGlyXG4gICAgICogQHByb3BlcnR5IHs/Ym9vbGVhbn0gdW5zYWZlQ2xlYW51cCByZWN1cnNpdmVseSByZW1vdmVzIHRoZSBjcmVhdGVkIHRlbXBvcmFyeSBkaXJlY3RvcnksIGV2ZW4gd2hlbiBpdCdzIG5vdCBlbXB0eVxuICAgICAqIEBwcm9wZXJ0eSB7P2Jvb2xlYW59IGRldGFjaERlc2NyaXB0b3IgZGV0YWNoZXMgdGhlIGZpbGUgZGVzY3JpcHRvciwgY2FsbGVyIGlzIHJlc3BvbnNpYmxlIGZvciBjbG9zaW5nIHRoZSBmaWxlLCB0bXAgd2lsbCBubyBsb25nZXIgdHJ5IGNsb3NpbmcgdGhlIGZpbGUgZHVyaW5nIGdhcmJhZ2UgY29sbGVjdGlvblxuICAgICAqIEBwcm9wZXJ0eSB7P2Jvb2xlYW59IGRpc2NhcmREZXNjcmlwdG9yIGRpc2NhcmRzIHRoZSBmaWxlIGRlc2NyaXB0b3IgKGNsb3NlcyBmaWxlLCBmZCBpcyAtMSksIHRtcCB3aWxsIG5vIGxvbmdlciB0cnkgY2xvc2luZyB0aGUgZmlsZSBkdXJpbmcgZ2FyYmFnZSBjb2xsZWN0aW9uXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBGaWxlU3luY09iamVjdFxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lIHRoZSBuYW1lIG9mIHRoZSBmaWxlXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGZkIHRoZSBmaWxlIGRlc2NyaXB0b3Igb3IgLTEgaWYgdGhlIGZkIGhhcyBiZWVuIGRpc2NhcmRlZFxuICAgICAqIEBwcm9wZXJ0eSB7ZmlsZUNhbGxiYWNrfSByZW1vdmVDYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gcmVtb3ZlIHRoZSBmaWxlXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBEaXJTeW5jT2JqZWN0XG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWUgdGhlIG5hbWUgb2YgdGhlIGRpcmVjdG9yeVxuICAgICAqIEBwcm9wZXJ0eSB7ZmlsZUNhbGxiYWNrfSByZW1vdmVDYWxsYmFjayB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gcmVtb3ZlIHRoZSBkaXJlY3RvcnlcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBjYWxsYmFjayB0bXBOYW1lQ2FsbGJhY2tcbiAgICAgKiBAcGFyYW0gez9FcnJvcn0gZXJyIHRoZSBlcnJvciBvYmplY3QgaWYgYW55dGhpbmcgZ29lcyB3cm9uZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRoZSB0ZW1wb3JhcnkgZmlsZSBuYW1lXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAY2FsbGJhY2sgZmlsZUNhbGxiYWNrXG4gICAgICogQHBhcmFtIHs/RXJyb3J9IGVyciB0aGUgZXJyb3Igb2JqZWN0IGlmIGFueXRoaW5nIGdvZXMgd3JvbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSB0aGUgdGVtcG9yYXJ5IGZpbGUgbmFtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmZCB0aGUgZmlsZSBkZXNjcmlwdG9yIG9yIC0xIGlmIHRoZSBmZCBoYWQgYmVlbiBkaXNjYXJkZWRcbiAgICAgKiBAcGFyYW0ge2NsZWFudXBDYWxsYmFja30gZm4gdGhlIGNsZWFudXAgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBjYWxsYmFjayBmaWxlQ2FsbGJhY2tTeW5jXG4gICAgICogQHBhcmFtIHs/RXJyb3J9IGVyciB0aGUgZXJyb3Igb2JqZWN0IGlmIGFueXRoaW5nIGdvZXMgd3JvbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSB0aGUgdGVtcG9yYXJ5IGZpbGUgbmFtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmZCB0aGUgZmlsZSBkZXNjcmlwdG9yIG9yIC0xIGlmIHRoZSBmZCBoYWQgYmVlbiBkaXNjYXJkZWRcbiAgICAgKiBAcGFyYW0ge2NsZWFudXBDYWxsYmFja1N5bmN9IGZuIHRoZSBjbGVhbnVwIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAY2FsbGJhY2sgZGlyQ2FsbGJhY2tcbiAgICAgKiBAcGFyYW0gez9FcnJvcn0gZXJyIHRoZSBlcnJvciBvYmplY3QgaWYgYW55dGhpbmcgZ29lcyB3cm9uZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRoZSB0ZW1wb3JhcnkgZmlsZSBuYW1lXG4gICAgICogQHBhcmFtIHtjbGVhbnVwQ2FsbGJhY2t9IGZuIHRoZSBjbGVhbnVwIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAY2FsbGJhY2sgZGlyQ2FsbGJhY2tTeW5jXG4gICAgICogQHBhcmFtIHs/RXJyb3J9IGVyciB0aGUgZXJyb3Igb2JqZWN0IGlmIGFueXRoaW5nIGdvZXMgd3JvbmdcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSB0aGUgdGVtcG9yYXJ5IGZpbGUgbmFtZVxuICAgICAqIEBwYXJhbSB7Y2xlYW51cENhbGxiYWNrU3luY30gZm4gdGhlIGNsZWFudXAgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIHRlbXBvcmFyeSBjcmVhdGVkIGZpbGUgb3IgZGlyZWN0b3J5LlxuICAgICAqXG4gICAgICogQGNhbGxiYWNrIGNsZWFudXBDYWxsYmFja1xuICAgICAqIEBwYXJhbSB7c2ltcGxlQ2FsbGJhY2t9IFtuZXh0XSBmdW5jdGlvbiB0byBjYWxsIHdoZW5ldmVyIHRoZSB0bXAgb2JqZWN0IG5lZWRzIHRvIGJlIHJlbW92ZWRcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIHRlbXBvcmFyeSBjcmVhdGVkIGZpbGUgb3IgZGlyZWN0b3J5LlxuICAgICAqXG4gICAgICogQGNhbGxiYWNrIGNsZWFudXBDYWxsYmFja1N5bmNcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIENhbGxiYWNrIGZ1bmN0aW9uIGZvciBmdW5jdGlvbiBjb21wb3NpdGlvbi5cbiAgICAgKiBAc2VlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vcmFzemkvbm9kZS10bXAvaXNzdWVzLzU3fHJhc3ppL25vZGUtdG1wIzU3fVxuICAgICAqXG4gICAgICogQGNhbGxiYWNrIHNpbXBsZUNhbGxiYWNrXG4gICAgICovXG5cbiAgICAvLyBleHBvcnRpbmcgYWxsIHRoZSBuZWVkZWQgbWV0aG9kc1xuXG4gICAgLy8gZXZhbHVhdGUgX2dldFRtcERpcigpIGxhemlseSwgbWFpbmx5IGZvciBzaW1wbGlmeWluZyB0ZXN0aW5nIGJ1dCBpdCBhbHNvIHdpbGxcbiAgICAvLyBhbGxvdyB1c2VycyB0byByZWNvbmZpZ3VyZSB0aGUgdGVtcG9yYXJ5IGRpcmVjdG9yeVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSLCAndG1wZGlyJywge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9nZXRUbXBEaXJTeW5jKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBSLmRpciA9IGRpcjtcbiAgICBSLmRpclN5bmMgPSBkaXJTeW5jO1xuXG4gICAgUi5maWxlID0gZmlsZTtcbiAgICBSLmZpbGVTeW5jID0gZmlsZVN5bmM7XG5cbiAgICBSLnRtcE5hbWUgPSB0bXBOYW1lO1xuICAgIFIudG1wTmFtZVN5bmMgPSB0bXBOYW1lU3luYztcblxuICAgIFIuc2V0R3JhY2VmdWxDbGVhbnVwID0gc2V0R3JhY2VmdWxDbGVhbnVwO1xuICAgIGBgYFxuICAgIHJldHVybiBSXG5cbiAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICMjIyBOT1RFIEZ1dHVyZSBTaW5nbGUtRmlsZSBNb2R1bGUgIyMjXG4gIHJlcXVpcmVfdGVtcDogLT5cblxuICAgICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICB7IGRlYnVnLCAgICAgICAgfSA9IGNvbnNvbGVcblxuICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICB0ZW1wbGF0ZXMgPSBPYmplY3QuZnJlZXplXG4gICAgICB0ZW1wOlxuICAgICAgICBrZWVwOiAgICAgZmFsc2VcbiAgICAgICAgcHJlZml4OiAgICdicmljcy50ZW1wLSdcbiAgICAgICAgc3VmZml4OiAgICcnXG5cbiAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgVEVNUCAgICAgID0gVU5TVEFCTEVfVEVNUF9CUklDUy5yZXF1aXJlX3RlbXBfaW50ZXJuYWxfdG1wKClcbiAgICBpbnRlcm5hbHMgPSB7IHRlbXBsYXRlcywgfVxuXG4gICAgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY2xhc3MgVGVtcFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgd2l0aF9maWxlOiAoIGNmZywgaGFuZGxlciApIC0+XG4gICAgICAgIHN3aXRjaCBhcml0eSA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICAgICB3aGVuIDEgdGhlbiBbIGNmZywgaGFuZGxlciwgXSA9IFsgbnVsbCwgY2ZnLCBdXG4gICAgICAgICAgd2hlbiAyIHRoZW4gbnVsbFxuICAgICAgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yIFwiZXhwZWN0ZWQgMSBvciAyIGFyZ3VtZW50cywgZ290ICN7YXJpdHl9XCJcbiAgICAgICAgY2ZnICAgPSB7IHRlbXBsYXRlcy50ZW1wLi4uLCBjZmcuLi4sIH1cbiAgICAgICAgdHlwZSAgPSBPYmplY3Q6OnRvU3RyaW5nLmNhbGwgaGFuZGxlclxuICAgICAgICByZXR1cm4gQF93aXRoX2ZpbGVfYXN5bmMgY2ZnLCBoYW5kbGVyIGlmIHR5cGUgaXMgJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nXG4gICAgICAgIHJldHVybiBAX3dpdGhfZmlsZV9zeW5jICBjZmcsIGhhbmRsZXIgaWYgdHlwZSBpcyAnW29iamVjdCBGdW5jdGlvbl0nXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIl5ndXkudGVtcEAxXiBleHBlY3RlZCBhbiAoc3luYyBvciBhc3luYykgZnVuY3Rpb24sIGdvdCBhICN7dHlwZX1cIlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgd2l0aF9kaXJlY3Rvcnk6ICggY2ZnLCBoYW5kbGVyICkgLT5cbiAgICAgICAgc3dpdGNoIGFyaXR5ID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgICAgIHdoZW4gMSB0aGVuIFsgY2ZnLCBoYW5kbGVyLCBdID0gWyBudWxsLCBjZmcsIF1cbiAgICAgICAgICB3aGVuIDIgdGhlbiBudWxsXG4gICAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCJleHBlY3RlZCAxIG9yIDIgYXJndW1lbnRzLCBnb3QgI3thcml0eX1cIlxuICAgICAgICBjZmcgICA9IHsgdGVtcGxhdGVzLnRlbXAuLi4sIGNmZy4uLiwgfVxuICAgICAgICB0eXBlICA9IE9iamVjdDo6dG9TdHJpbmcuY2FsbCBoYW5kbGVyXG4gICAgICAgIHJldHVybiBAX3dpdGhfZGlyZWN0b3J5X2FzeW5jIGNmZywgaGFuZGxlciBpZiB0eXBlIGlzICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJ1xuICAgICAgICByZXR1cm4gQF93aXRoX2RpcmVjdG9yeV9zeW5jICBjZmcsIGhhbmRsZXIgaWYgdHlwZSBpcyAnW29iamVjdCBGdW5jdGlvbl0nXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIl5ndXkudGVtcEAyXiBleHBlY3RlZCBhbiAoc3luYyBvciBhc3luYykgZnVuY3Rpb24sIGdvdCBhICN7dHlwZX1cIlxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX3dpdGhfZmlsZV9zeW5jOiAoIGNmZywgaGFuZGxlciApIC0+XG4gICAgICAgIHsgbmFtZTogcGF0aFxuICAgICAgICAgIGZkXG4gICAgICAgICAgcmVtb3ZlQ2FsbGJhY2sgfSA9IFRFTVAuZmlsZVN5bmMgY2ZnXG4gICAgICAgIHRyeSBoYW5kbGVyIHsgcGF0aCwgZmQsIH0gZmluYWxseVxuICAgICAgICAgIHJlbW92ZUNhbGxiYWNrKCkgdW5sZXNzIGNmZy5rZWVwXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBfd2l0aF9kaXJlY3Rvcnlfc3luYzogKCBjZmcsIGhhbmRsZXIgKSAtPlxuICAgICAgICBGUyAgICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOmZzJ1xuICAgICAgICB7IG5hbWU6IHBhdGgsIH0gPSBURU1QLmRpclN5bmMgY2ZnXG4gICAgICAgIHRyeSBoYW5kbGVyIHsgcGF0aCwgfSBmaW5hbGx5XG4gICAgICAgICAgRlMucm1TeW5jIHBhdGgsIHsgcmVjdXJzaXZlOiB0cnVlLCB9IHVubGVzcyBjZmcua2VlcFxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX3dpdGhfZmlsZV9hc3luYzogKCBjZmcsIGhhbmRsZXIgKSAtPlxuICAgICAgICB7IG5hbWU6IHBhdGhcbiAgICAgICAgICBmZFxuICAgICAgICAgIHJlbW92ZUNhbGxiYWNrIH0gPSBURU1QLmZpbGVTeW5jIGNmZ1xuICAgICAgICB0cnkgYXdhaXQgaGFuZGxlciB7IHBhdGgsIGZkLCB9IGZpbmFsbHlcbiAgICAgICAgICByZW1vdmVDYWxsYmFjaygpIHVubGVzcyBjZmcua2VlcFxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgX3dpdGhfZGlyZWN0b3J5X2FzeW5jOiAoIGNmZywgaGFuZGxlciApIC0+XG4gICAgICAgIHN3aXRjaCBhcml0eSA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgICAgICB3aGVuIDEgdGhlbiBbIGNmZywgaGFuZGxlciwgXSA9IFsgbnVsbCwgY2ZnLCBdXG4gICAgICAgICAgd2hlbiAyIHRoZW4gbnVsbFxuICAgICAgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yIFwiZXhwZWN0ZWQgMSBvciAyIGFyZ3VtZW50cywgZ290ICN7YXJpdHl9XCJcbiAgICAgICAgY2ZnICAgICAgICAgICAgID0geyB0ZW1wbGF0ZXMudGVtcC4uLiwgY2ZnLi4uLCB9XG4gICAgICAgIEZTICAgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6ZnMnXG4gICAgICAgIHsgbmFtZTogcGF0aCwgfSA9IFRFTVAuZGlyU3luYyBjZmdcbiAgICAgICAgdHJ5IGF3YWl0IGhhbmRsZXIgeyBwYXRoLCB9IGZpbmFsbHlcbiAgICAgICAgICBGUy5ybVN5bmMgcGF0aCwgeyByZWN1cnNpdmU6IHRydWUsIH0gdW5sZXNzIGNmZy5rZWVwXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBjcmVhdGVfZGlyZWN0b3J5OiAoIGNmZyApIC0+XG4gICAgICAgIEZTICAgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6ZnMnXG4gICAgICAgIGNmZyAgICAgICAgICAgICA9IHsgdGVtcGxhdGVzLnRlbXAuLi4sIGNmZy4uLiwgfVxuICAgICAgICB7IG5hbWU6IHBhdGgsIH0gPSBURU1QLmRpclN5bmMgY2ZnXG4gICAgICAgIHJtICAgICAgICAgICAgICA9IC0+IEZTLnJtU3luYyBwYXRoLCB7IHJlY3Vyc2l2ZTogdHJ1ZSwgfVxuICAgICAgICByZXR1cm4geyBwYXRoLCBybSwgfVxuXG5cbiAgICAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgaW50ZXJuYWxzID0gT2JqZWN0LmZyZWV6ZSB7IGludGVybmFscy4uLiwgVGVtcCwgfVxuICAgIHJldHVybiBleHBvcnRzID0ge1xuICAgICAgdGVtcDogbmV3IFRlbXBcbiAgICAgICMgVGVtcCxcbiAgICAgIGludGVybmFscywgfVxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuT2JqZWN0LmFzc2lnbiBtb2R1bGUuZXhwb3J0cywgVU5TVEFCTEVfVEVNUF9CUklDU1xuXG5cblxuXG5cbiJdfQ==
//# sourceURL=../src/unstable-temp-brics.coffee