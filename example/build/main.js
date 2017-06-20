/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "ae1693902589b3e6f766"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./index.js")(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/@webcomponents/custom-elements/src/AlreadyConstructedMarker.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This class exists only to work around Closure's lack of a way to describe
 * singletons. It represents the 'already constructed marker' used in custom
 * element construction stacks.
 *
 * https://html.spec.whatwg.org/#concept-already-constructed-marker
 */
var AlreadyConstructedMarker = function AlreadyConstructedMarker() {
  _classCallCheck(this, AlreadyConstructedMarker);
};

exports.default = new AlreadyConstructedMarker();

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Utilities = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");

var Utilities = _interopRequireWildcard(_Utilities);

var _CustomElementState = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementState.js");

var _CustomElementState2 = _interopRequireDefault(_CustomElementState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CustomElementInternals = function () {
  function CustomElementInternals() {
    _classCallCheck(this, CustomElementInternals);

    /** @type {!Map<string, !CustomElementDefinition>} */
    this._localNameToDefinition = new Map();

    /** @type {!Map<!Function, !CustomElementDefinition>} */
    this._constructorToDefinition = new Map();

    /** @type {!Array<!function(!Node)>} */
    this._patches = [];

    /** @type {boolean} */
    this._hasPatches = false;
  }

  /**
   * @param {string} localName
   * @param {!CustomElementDefinition} definition
   */


  _createClass(CustomElementInternals, [{
    key: 'setDefinition',
    value: function setDefinition(localName, definition) {
      this._localNameToDefinition.set(localName, definition);
      this._constructorToDefinition.set(definition.constructor, definition);
    }

    /**
     * @param {string} localName
     * @return {!CustomElementDefinition|undefined}
     */

  }, {
    key: 'localNameToDefinition',
    value: function localNameToDefinition(localName) {
      return this._localNameToDefinition.get(localName);
    }

    /**
     * @param {!Function} constructor
     * @return {!CustomElementDefinition|undefined}
     */

  }, {
    key: 'constructorToDefinition',
    value: function constructorToDefinition(constructor) {
      return this._constructorToDefinition.get(constructor);
    }

    /**
     * @param {!function(!Node)} listener
     */

  }, {
    key: 'addPatch',
    value: function addPatch(listener) {
      this._hasPatches = true;
      this._patches.push(listener);
    }

    /**
     * @param {!Node} node
     */

  }, {
    key: 'patchTree',
    value: function patchTree(node) {
      var _this = this;

      if (!this._hasPatches) return;

      Utilities.walkDeepDescendantElements(node, function (element) {
        return _this.patch(element);
      });
    }

    /**
     * @param {!Node} node
     */

  }, {
    key: 'patch',
    value: function patch(node) {
      if (!this._hasPatches) return;

      if (node.__CE_patched) return;
      node.__CE_patched = true;

      for (var i = 0; i < this._patches.length; i++) {
        this._patches[i](node);
      }
    }

    /**
     * @param {!Node} root
     */

  }, {
    key: 'connectTree',
    value: function connectTree(root) {
      var elements = [];

      Utilities.walkDeepDescendantElements(root, function (element) {
        return elements.push(element);
      });

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.__CE_state === _CustomElementState2.default.custom) {
          this.connectedCallback(element);
        } else {
          this.upgradeElement(element);
        }
      }
    }

    /**
     * @param {!Node} root
     */

  }, {
    key: 'disconnectTree',
    value: function disconnectTree(root) {
      var elements = [];

      Utilities.walkDeepDescendantElements(root, function (element) {
        return elements.push(element);
      });

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.__CE_state === _CustomElementState2.default.custom) {
          this.disconnectedCallback(element);
        }
      }
    }

    /**
     * Upgrades all uncustomized custom elements at and below a root node for
     * which there is a definition. When custom element reaction callbacks are
     * assumed to be called synchronously (which, by the current DOM / HTML spec
     * definitions, they are *not*), callbacks for both elements customized
     * synchronously by the parser and elements being upgraded occur in the same
     * relative order.
     *
     * NOTE: This function, when used to simulate the construction of a tree that
     * is already created but not customized (i.e. by the parser), does *not*
     * prevent the element from reading the 'final' (true) state of the tree. For
     * example, the element, during truly synchronous parsing / construction would
     * see that it contains no children as they have not yet been inserted.
     * However, this function does not modify the tree, the element will
     * (incorrectly) have children. Additionally, self-modification restrictions
     * for custom element constructors imposed by the DOM spec are *not* enforced.
     *
     *
     * The following nested list shows the steps extending down from the HTML
     * spec's parsing section that cause elements to be synchronously created and
     * upgraded:
     *
     * The "in body" insertion mode:
     * https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
     * - Switch on token:
     *   .. other cases ..
     *   -> Any other start tag
     *      - [Insert an HTML element](below) for the token.
     *
     * Insert an HTML element:
     * https://html.spec.whatwg.org/multipage/syntax.html#insert-an-html-element
     * - Insert a foreign element for the token in the HTML namespace:
     *   https://html.spec.whatwg.org/multipage/syntax.html#insert-a-foreign-element
     *   - Create an element for a token:
     *     https://html.spec.whatwg.org/multipage/syntax.html#create-an-element-for-the-token
     *     - Will execute script flag is true?
     *       - (Element queue pushed to the custom element reactions stack.)
     *     - Create an element:
     *       https://dom.spec.whatwg.org/#concept-create-element
     *       - Sync CE flag is true?
     *         - Constructor called.
     *         - Self-modification restrictions enforced.
     *       - Sync CE flag is false?
     *         - (Upgrade reaction enqueued.)
     *     - Attributes appended to element.
     *       (`attributeChangedCallback` reactions enqueued.)
     *     - Will execute script flag is true?
     *       - (Element queue popped from the custom element reactions stack.
     *         Reactions in the popped stack are invoked.)
     *   - (Element queue pushed to the custom element reactions stack.)
     *   - Insert the element:
     *     https://dom.spec.whatwg.org/#concept-node-insert
     *     - Shadow-including descendants are connected. During parsing
     *       construction, there are no shadow-*excluding* descendants.
     *       However, the constructor may have validly attached a shadow
     *       tree to itself and added descendants to that shadow tree.
     *       (`connectedCallback` reactions enqueued.)
     *   - (Element queue popped from the custom element reactions stack.
     *     Reactions in the popped stack are invoked.)
     *
     * @param {!Node} root
     * @param {!Set<Node>=} visitedImports
     */

  }, {
    key: 'patchAndUpgradeTree',
    value: function patchAndUpgradeTree(root) {
      var _this2 = this;

      var visitedImports = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();

      var elements = [];

      var gatherElements = function gatherElements(element) {
        if (element.localName === 'link' && element.getAttribute('rel') === 'import') {
          // The HTML Imports polyfill sets a descendant element of the link to
          // the `import` property, specifically this is *not* a Document.
          var importNode = /** @type {?Node} */element.import;

          if (importNode instanceof Node && importNode.readyState === 'complete') {
            importNode.__CE_isImportDocument = true;

            // Connected links are associated with the registry.
            importNode.__CE_hasRegistry = true;
          } else {
            // If this link's import root is not available, its contents can't be
            // walked. Wait for 'load' and walk it when it's ready.
            element.addEventListener('load', function () {
              var importNode = /** @type {!Node} */element.import;

              if (importNode.__CE_documentLoadHandled) return;
              importNode.__CE_documentLoadHandled = true;

              importNode.__CE_isImportDocument = true;

              // Connected links are associated with the registry.
              importNode.__CE_hasRegistry = true;

              // Clone the `visitedImports` set that was populated sync during
              // the `patchAndUpgradeTree` call that caused this 'load' handler to
              // be added. Then, remove *this* link's import node so that we can
              // walk that import again, even if it was partially walked later
              // during the same `patchAndUpgradeTree` call.
              var clonedVisitedImports = new Set(visitedImports);
              visitedImports.delete(importNode);

              _this2.patchAndUpgradeTree(importNode, visitedImports);
            });
          }
        } else {
          elements.push(element);
        }
      };

      // `walkDeepDescendantElements` populates (and internally checks against)
      // `visitedImports` when traversing a loaded import.
      Utilities.walkDeepDescendantElements(root, gatherElements, visitedImports);

      if (this._hasPatches) {
        for (var i = 0; i < elements.length; i++) {
          this.patch(elements[i]);
        }
      }

      for (var _i = 0; _i < elements.length; _i++) {
        this.upgradeElement(elements[_i]);
      }
    }

    /**
     * @param {!Element} element
     */

  }, {
    key: 'upgradeElement',
    value: function upgradeElement(element) {
      var currentState = element.__CE_state;
      if (currentState !== undefined) return;

      var definition = this.localNameToDefinition(element.localName);
      if (!definition) return;

      definition.constructionStack.push(element);

      var constructor = definition.constructor;
      try {
        try {
          var result = new constructor();
          if (result !== element) {
            throw new Error('The custom element constructor did not produce the element being upgraded.');
          }
        } finally {
          definition.constructionStack.pop();
        }
      } catch (e) {
        element.__CE_state = _CustomElementState2.default.failed;
        throw e;
      }

      element.__CE_state = _CustomElementState2.default.custom;
      element.__CE_definition = definition;

      if (definition.attributeChangedCallback) {
        var observedAttributes = definition.observedAttributes;
        for (var i = 0; i < observedAttributes.length; i++) {
          var name = observedAttributes[i];
          var value = element.getAttribute(name);
          if (value !== null) {
            this.attributeChangedCallback(element, name, null, value, null);
          }
        }
      }

      if (Utilities.isConnected(element)) {
        this.connectedCallback(element);
      }
    }

    /**
     * @param {!Element} element
     */

  }, {
    key: 'connectedCallback',
    value: function connectedCallback(element) {
      var definition = element.__CE_definition;
      if (definition.connectedCallback) {
        definition.connectedCallback.call(element);
      }
    }

    /**
     * @param {!Element} element
     */

  }, {
    key: 'disconnectedCallback',
    value: function disconnectedCallback(element) {
      var definition = element.__CE_definition;
      if (definition.disconnectedCallback) {
        definition.disconnectedCallback.call(element);
      }
    }

    /**
     * @param {!Element} element
     * @param {string} name
     * @param {?string} oldValue
     * @param {?string} newValue
     * @param {?string} namespace
     */

  }, {
    key: 'attributeChangedCallback',
    value: function attributeChangedCallback(element, name, oldValue, newValue, namespace) {
      var definition = element.__CE_definition;
      if (definition.attributeChangedCallback && definition.observedAttributes.indexOf(name) > -1) {
        definition.attributeChangedCallback.call(element, name, oldValue, newValue, namespace);
      }
    }
  }]);

  return CustomElementInternals;
}();

exports.default = CustomElementInternals;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/CustomElementRegistry.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _DocumentConstructionObserver = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/DocumentConstructionObserver.js");

var _DocumentConstructionObserver2 = _interopRequireDefault(_DocumentConstructionObserver);

var _Deferred = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Deferred.js");

var _Deferred2 = _interopRequireDefault(_Deferred);

var _Utilities = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");

var Utilities = _interopRequireWildcard(_Utilities);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @unrestricted
 */
var CustomElementRegistry = function () {

  /**
   * @param {!CustomElementInternals} internals
   */
  function CustomElementRegistry(internals) {
    _classCallCheck(this, CustomElementRegistry);

    /**
     * @private
     * @type {boolean}
     */
    this._elementDefinitionIsRunning = false;

    /**
     * @private
     * @type {!CustomElementInternals}
     */
    this._internals = internals;

    /**
     * @private
     * @type {!Map<string, !Deferred<undefined>>}
     */
    this._whenDefinedDeferred = new Map();

    /**
     * The default flush callback triggers the document walk synchronously.
     * @private
     * @type {!Function}
     */
    this._flushCallback = function (fn) {
      return fn();
    };

    /**
     * @private
     * @type {boolean}
     */
    this._flushPending = false;

    /**
     * @private
     * @type {!Array<string>}
     */
    this._unflushedLocalNames = [];

    /**
     * @private
     * @type {!DocumentConstructionObserver}
     */
    this._documentConstructionObserver = new _DocumentConstructionObserver2.default(internals, document);
  }

  /**
   * @param {string} localName
   * @param {!Function} constructor
   */


  _createClass(CustomElementRegistry, [{
    key: 'define',
    value: function define(localName, constructor) {
      var _this = this;

      if (!(constructor instanceof Function)) {
        throw new TypeError('Custom element constructors must be functions.');
      }

      if (!Utilities.isValidCustomElementName(localName)) {
        throw new SyntaxError('The element name \'' + localName + '\' is not valid.');
      }

      if (this._internals.localNameToDefinition(localName)) {
        throw new Error('A custom element with name \'' + localName + '\' has already been defined.');
      }

      if (this._elementDefinitionIsRunning) {
        throw new Error('A custom element is already being defined.');
      }
      this._elementDefinitionIsRunning = true;

      var connectedCallback = void 0;
      var disconnectedCallback = void 0;
      var adoptedCallback = void 0;
      var attributeChangedCallback = void 0;
      var observedAttributes = void 0;
      try {
        var getCallback = function getCallback(name) {
          var callbackValue = prototype[name];
          if (callbackValue !== undefined && !(callbackValue instanceof Function)) {
            throw new Error('The \'' + name + '\' callback must be a function.');
          }
          return callbackValue;
        };

        /** @type {!Object} */
        var prototype = constructor.prototype;
        if (!(prototype instanceof Object)) {
          throw new TypeError('The custom element constructor\'s prototype is not an object.');
        }

        connectedCallback = getCallback('connectedCallback');
        disconnectedCallback = getCallback('disconnectedCallback');
        adoptedCallback = getCallback('adoptedCallback');
        attributeChangedCallback = getCallback('attributeChangedCallback');
        observedAttributes = constructor['observedAttributes'] || [];
      } catch (e) {
        return;
      } finally {
        this._elementDefinitionIsRunning = false;
      }

      var definition = {
        localName: localName,
        constructor: constructor,
        connectedCallback: connectedCallback,
        disconnectedCallback: disconnectedCallback,
        adoptedCallback: adoptedCallback,
        attributeChangedCallback: attributeChangedCallback,
        observedAttributes: observedAttributes,
        constructionStack: []
      };

      this._internals.setDefinition(localName, definition);

      this._unflushedLocalNames.push(localName);

      // If we've already called the flush callback and it hasn't called back yet,
      // don't call it again.
      if (!this._flushPending) {
        this._flushPending = true;
        this._flushCallback(function () {
          return _this._flush();
        });
      }
    }
  }, {
    key: '_flush',
    value: function _flush() {
      // If no new definitions were defined, don't attempt to flush. This could
      // happen if a flush callback keeps the function it is given and calls it
      // multiple times.
      if (this._flushPending === false) return;

      this._flushPending = false;
      this._internals.patchAndUpgradeTree(document);

      while (this._unflushedLocalNames.length > 0) {
        var localName = this._unflushedLocalNames.shift();
        var deferred = this._whenDefinedDeferred.get(localName);
        if (deferred) {
          deferred.resolve(undefined);
        }
      }
    }

    /**
     * @param {string} localName
     * @return {Function|undefined}
     */

  }, {
    key: 'get',
    value: function get(localName) {
      var definition = this._internals.localNameToDefinition(localName);
      if (definition) {
        return definition.constructor;
      }

      return undefined;
    }

    /**
     * @param {string} localName
     * @return {!Promise<undefined>}
     */

  }, {
    key: 'whenDefined',
    value: function whenDefined(localName) {
      if (!Utilities.isValidCustomElementName(localName)) {
        return Promise.reject(new SyntaxError('\'' + localName + '\' is not a valid custom element name.'));
      }

      var prior = this._whenDefinedDeferred.get(localName);
      if (prior) {
        return prior.toPromise();
      }

      var deferred = new _Deferred2.default();
      this._whenDefinedDeferred.set(localName, deferred);

      var definition = this._internals.localNameToDefinition(localName);
      // Resolve immediately only if the given local name has a definition *and*
      // the full document walk to upgrade elements with that local name has
      // already happened.
      if (definition && this._unflushedLocalNames.indexOf(localName) === -1) {
        deferred.resolve(undefined);
      }

      return deferred.toPromise();
    }
  }, {
    key: 'polyfillWrapFlushCallback',
    value: function polyfillWrapFlushCallback(outer) {
      this._documentConstructionObserver.disconnect();
      var inner = this._flushCallback;
      this._flushCallback = function (flush) {
        return outer(function () {
          return inner(flush);
        });
      };
    }
  }]);

  return CustomElementRegistry;
}();

// Closure compiler exports.


exports.default = CustomElementRegistry;
window['CustomElementRegistry'] = CustomElementRegistry;
CustomElementRegistry.prototype['define'] = CustomElementRegistry.prototype.define;
CustomElementRegistry.prototype['get'] = CustomElementRegistry.prototype.get;
CustomElementRegistry.prototype['whenDefined'] = CustomElementRegistry.prototype.whenDefined;
CustomElementRegistry.prototype['polyfillWrapFlushCallback'] = CustomElementRegistry.prototype.polyfillWrapFlushCallback;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/CustomElementState.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @enum {number}
 */
var CustomElementState = {
  custom: 1,
  failed: 2
};

exports.default = CustomElementState;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Deferred.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @template T
 */
var Deferred = function () {
  function Deferred() {
    var _this = this;

    _classCallCheck(this, Deferred);

    /**
     * @private
     * @type {T|undefined}
     */
    this._value = undefined;

    /**
     * @private
     * @type {Function|undefined}
     */
    this._resolve = undefined;

    /**
     * @private
     * @type {!Promise<T>}
     */
    this._promise = new Promise(function (resolve) {
      _this._resolve = resolve;

      if (_this._value) {
        resolve(_this._value);
      }
    });
  }

  /**
   * @param {T} value
   */


  _createClass(Deferred, [{
    key: 'resolve',
    value: function resolve(value) {
      if (this._value) {
        throw new Error('Already resolved.');
      }

      this._value = value;

      if (this._resolve) {
        this._resolve(value);
      }
    }

    /**
     * @return {!Promise<T>}
     */

  }, {
    key: 'toPromise',
    value: function toPromise() {
      return this._promise;
    }
  }]);

  return Deferred;
}();

exports.default = Deferred;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/DocumentConstructionObserver.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DocumentConstructionObserver = function () {
  function DocumentConstructionObserver(internals, doc) {
    _classCallCheck(this, DocumentConstructionObserver);

    /**
     * @type {!CustomElementInternals}
     */
    this._internals = internals;

    /**
     * @type {!Document}
     */
    this._document = doc;

    /**
     * @type {MutationObserver|undefined}
     */
    this._observer = undefined;

    // Simulate tree construction for all currently accessible nodes in the
    // document.
    this._internals.patchAndUpgradeTree(this._document);

    if (this._document.readyState === 'loading') {
      this._observer = new MutationObserver(this._handleMutations.bind(this));

      // Nodes created by the parser are given to the observer *before* the next
      // task runs. Inline scripts are run in a new task. This means that the
      // observer will be able to handle the newly parsed nodes before the inline
      // script is run.
      this._observer.observe(this._document, {
        childList: true,
        subtree: true
      });
    }
  }

  _createClass(DocumentConstructionObserver, [{
    key: 'disconnect',
    value: function disconnect() {
      if (this._observer) {
        this._observer.disconnect();
      }
    }

    /**
     * @param {!Array<!MutationRecord>} mutations
     */

  }, {
    key: '_handleMutations',
    value: function _handleMutations(mutations) {
      // Once the document's `readyState` is 'interactive' or 'complete', all new
      // nodes created within that document will be the result of script and
      // should be handled by patching.
      var readyState = this._document.readyState;
      if (readyState === 'interactive' || readyState === 'complete') {
        this.disconnect();
      }

      for (var i = 0; i < mutations.length; i++) {
        var addedNodes = mutations[i].addedNodes;
        for (var j = 0; j < addedNodes.length; j++) {
          var node = addedNodes[j];
          this._internals.patchAndUpgradeTree(node);
        }
      }
    }
  }]);

  return DocumentConstructionObserver;
}();

exports.default = DocumentConstructionObserver;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Document.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (internals) {
  Utilities.setPropertyUnchecked(Document.prototype, 'createElement',
  /**
   * @this {Document}
   * @param {string} localName
   * @return {!Element}
   */
  function (localName) {
    // Only create custom elements if this document is associated with the registry.
    if (this.__CE_hasRegistry) {
      var definition = internals.localNameToDefinition(localName);
      if (definition) {
        return new definition.constructor();
      }
    }

    var result = /** @type {!Element} */
    _Native2.default.Document_createElement.call(this, localName);
    internals.patch(result);
    return result;
  });

  Utilities.setPropertyUnchecked(Document.prototype, 'importNode',
  /**
   * @this {Document}
   * @param {!Node} node
   * @param {boolean=} deep
   * @return {!Node}
   */
  function (node, deep) {
    var clone = _Native2.default.Document_importNode.call(this, node, deep);
    // Only create custom elements if this document is associated with the registry.
    if (!this.__CE_hasRegistry) {
      internals.patchTree(clone);
    } else {
      internals.patchAndUpgradeTree(clone);
    }
    return clone;
  });

  var NS_HTML = "http://www.w3.org/1999/xhtml";

  Utilities.setPropertyUnchecked(Document.prototype, 'createElementNS',
  /**
   * @this {Document}
   * @param {?string} namespace
   * @param {string} localName
   * @return {!Element}
   */
  function (namespace, localName) {
    // Only create custom elements if this document is associated with the registry.
    if (this.__CE_hasRegistry && (namespace === null || namespace === NS_HTML)) {
      var definition = internals.localNameToDefinition(localName);
      if (definition) {
        return new definition.constructor();
      }
    }

    var result = /** @type {!Element} */
    _Native2.default.Document_createElementNS.call(this, namespace, localName);
    internals.patch(result);
    return result;
  });

  (0, _ParentNode2.default)(internals, Document.prototype, {
    prepend: _Native2.default.Document_prepend,
    append: _Native2.default.Document_append
  });
};

var _Native = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Native.js");

var _Native2 = _interopRequireDefault(_Native);

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _Utilities = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");

var Utilities = _interopRequireWildcard(_Utilities);

var _ParentNode = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ParentNode.js");

var _ParentNode2 = _interopRequireDefault(_ParentNode);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/**
 * @param {!CustomElementInternals} internals
 */

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Element.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (internals) {
  if (_Native2.default.Element_attachShadow) {
    Utilities.setPropertyUnchecked(Element.prototype, 'attachShadow',
    /**
     * @this {Element}
     * @param {!{mode: string}} init
     * @return {ShadowRoot}
     */
    function (init) {
      var shadowRoot = _Native2.default.Element_attachShadow.call(this, init);
      this.__CE_shadowRoot = shadowRoot;
      return shadowRoot;
    });
  } else {
    console.warn('Custom Elements: `Element#attachShadow` was not patched.');
  }

  function patch_innerHTML(destination, baseDescriptor) {
    Object.defineProperty(destination, 'innerHTML', {
      enumerable: baseDescriptor.enumerable,
      configurable: true,
      get: baseDescriptor.get,
      set: /** @this {Element} */function set(htmlString) {
        var _this = this;

        var isConnected = Utilities.isConnected(this);

        // NOTE: In IE11, when using the native `innerHTML` setter, all nodes
        // that were previously descendants of the context element have all of
        // their children removed as part of the set - the entire subtree is
        // 'disassembled'. This work around walks the subtree *before* using the
        // native setter.
        /** @type {!Array<!Element>|undefined} */
        var removedElements = undefined;
        if (isConnected) {
          removedElements = [];
          Utilities.walkDeepDescendantElements(this, function (element) {
            if (element !== _this) {
              removedElements.push(element);
            }
          });
        }

        baseDescriptor.set.call(this, htmlString);

        if (removedElements) {
          for (var i = 0; i < removedElements.length; i++) {
            var element = removedElements[i];
            if (element.__CE_state === _CustomElementState2.default.custom) {
              internals.disconnectedCallback(element);
            }
          }
        }

        // Only create custom elements if this element's owner document is
        // associated with the registry.
        if (!this.ownerDocument.__CE_hasRegistry) {
          internals.patchTree(this);
        } else {
          internals.patchAndUpgradeTree(this);
        }
        return htmlString;
      }
    });
  }

  if (_Native2.default.Element_innerHTML && _Native2.default.Element_innerHTML.get) {
    patch_innerHTML(Element.prototype, _Native2.default.Element_innerHTML);
  } else if (_Native2.default.HTMLElement_innerHTML && _Native2.default.HTMLElement_innerHTML.get) {
    patch_innerHTML(HTMLElement.prototype, _Native2.default.HTMLElement_innerHTML);
  } else {

    /** @type {HTMLDivElement} */
    var rawDiv = _Native2.default.Document_createElement.call(document, 'div');

    internals.addPatch(function (element) {
      patch_innerHTML(element, {
        enumerable: true,
        configurable: true,
        // Implements getting `innerHTML` by performing an unpatched `cloneNode`
        // of the element and returning the resulting element's `innerHTML`.
        // TODO: Is this too expensive?
        get: /** @this {Element} */function get() {
          return _Native2.default.Node_cloneNode.call(this, true).innerHTML;
        },
        // Implements setting `innerHTML` by creating an unpatched element,
        // setting `innerHTML` of that element and replacing the target
        // element's children with those of the unpatched element.
        set: /** @this {Element} */function set(assignedValue) {
          // NOTE: re-route to `content` for `template` elements.
          // We need to do this because `template.appendChild` does not
          // route into `template.content`.
          /** @type {!Node} */
          var content = this.localName === 'template' ? /** @type {!HTMLTemplateElement} */this.content : this;
          rawDiv.innerHTML = assignedValue;

          while (content.childNodes.length > 0) {
            _Native2.default.Node_removeChild.call(content, content.childNodes[0]);
          }
          while (rawDiv.childNodes.length > 0) {
            _Native2.default.Node_appendChild.call(content, rawDiv.childNodes[0]);
          }
        }
      });
    });
  }

  Utilities.setPropertyUnchecked(Element.prototype, 'setAttribute',
  /**
   * @this {Element}
   * @param {string} name
   * @param {string} newValue
   */
  function (name, newValue) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== _CustomElementState2.default.custom) {
      return _Native2.default.Element_setAttribute.call(this, name, newValue);
    }

    var oldValue = _Native2.default.Element_getAttribute.call(this, name);
    _Native2.default.Element_setAttribute.call(this, name, newValue);
    newValue = _Native2.default.Element_getAttribute.call(this, name);
    if (oldValue !== newValue) {
      internals.attributeChangedCallback(this, name, oldValue, newValue, null);
    }
  });

  Utilities.setPropertyUnchecked(Element.prototype, 'setAttributeNS',
  /**
   * @this {Element}
   * @param {?string} namespace
   * @param {string} name
   * @param {string} newValue
   */
  function (namespace, name, newValue) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== _CustomElementState2.default.custom) {
      return _Native2.default.Element_setAttributeNS.call(this, namespace, name, newValue);
    }

    var oldValue = _Native2.default.Element_getAttributeNS.call(this, namespace, name);
    _Native2.default.Element_setAttributeNS.call(this, namespace, name, newValue);
    newValue = _Native2.default.Element_getAttributeNS.call(this, namespace, name);
    if (oldValue !== newValue) {
      internals.attributeChangedCallback(this, name, oldValue, newValue, namespace);
    }
  });

  Utilities.setPropertyUnchecked(Element.prototype, 'removeAttribute',
  /**
   * @this {Element}
   * @param {string} name
   */
  function (name) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== _CustomElementState2.default.custom) {
      return _Native2.default.Element_removeAttribute.call(this, name);
    }

    var oldValue = _Native2.default.Element_getAttribute.call(this, name);
    _Native2.default.Element_removeAttribute.call(this, name);
    if (oldValue !== null) {
      internals.attributeChangedCallback(this, name, oldValue, null, null);
    }
  });

  Utilities.setPropertyUnchecked(Element.prototype, 'removeAttributeNS',
  /**
   * @this {Element}
   * @param {?string} namespace
   * @param {string} name
   */
  function (namespace, name) {
    // Fast path for non-custom elements.
    if (this.__CE_state !== _CustomElementState2.default.custom) {
      return _Native2.default.Element_removeAttributeNS.call(this, namespace, name);
    }

    var oldValue = _Native2.default.Element_getAttributeNS.call(this, namespace, name);
    _Native2.default.Element_removeAttributeNS.call(this, namespace, name);
    // In older browsers, `Element#getAttributeNS` may return the empty string
    // instead of null if the attribute does not exist. For details, see;
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNS#Notes
    var newValue = _Native2.default.Element_getAttributeNS.call(this, namespace, name);
    if (oldValue !== newValue) {
      internals.attributeChangedCallback(this, name, oldValue, newValue, namespace);
    }
  });

  function patch_insertAdjacentElement(destination, baseMethod) {
    Utilities.setPropertyUnchecked(destination, 'insertAdjacentElement',
    /**
     * @this {Element}
     * @param {string} where
     * @param {!Element} element
     * @return {?Element}
     */
    function (where, element) {
      var wasConnected = Utilities.isConnected(element);
      var insertedElement = /** @type {!Element} */
      baseMethod.call(this, where, element);

      if (wasConnected) {
        internals.disconnectTree(element);
      }

      if (Utilities.isConnected(insertedElement)) {
        internals.connectTree(element);
      }
      return insertedElement;
    });
  }

  if (_Native2.default.HTMLElement_insertAdjacentElement) {
    patch_insertAdjacentElement(HTMLElement.prototype, _Native2.default.HTMLElement_insertAdjacentElement);
  } else if (_Native2.default.Element_insertAdjacentElement) {
    patch_insertAdjacentElement(Element.prototype, _Native2.default.Element_insertAdjacentElement);
  } else {
    console.warn('Custom Elements: `Element#insertAdjacentElement` was not patched.');
  }

  (0, _ParentNode2.default)(internals, Element.prototype, {
    prepend: _Native2.default.Element_prepend,
    append: _Native2.default.Element_append
  });

  (0, _ChildNode2.default)(internals, Element.prototype, {
    before: _Native2.default.Element_before,
    after: _Native2.default.Element_after,
    replaceWith: _Native2.default.Element_replaceWith,
    remove: _Native2.default.Element_remove
  });
};

var _Native = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Native.js");

var _Native2 = _interopRequireDefault(_Native);

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _CustomElementState = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementState.js");

var _CustomElementState2 = _interopRequireDefault(_CustomElementState);

var _Utilities = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");

var Utilities = _interopRequireWildcard(_Utilities);

var _ParentNode = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ParentNode.js");

var _ParentNode2 = _interopRequireDefault(_ParentNode);

var _ChildNode = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ChildNode.js");

var _ChildNode2 = _interopRequireDefault(_ChildNode);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/**
 * @param {!CustomElementInternals} internals
 */

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/HTMLElement.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (internals) {
  window['HTMLElement'] = function () {
    /**
     * @type {function(new: HTMLElement): !HTMLElement}
     */
    function HTMLElement() {
      // This should really be `new.target` but `new.target` can't be emulated
      // in ES5. Assuming the user keeps the default value of the constructor's
      // prototype's `constructor` property, this is equivalent.
      /** @type {!Function} */
      var constructor = this.constructor;

      var definition = internals.constructorToDefinition(constructor);
      if (!definition) {
        throw new Error('The custom element being constructed was not registered with `customElements`.');
      }

      var constructionStack = definition.constructionStack;

      if (constructionStack.length === 0) {
        var _element = _Native2.default.Document_createElement.call(document, definition.localName);
        Object.setPrototypeOf(_element, constructor.prototype);
        _element.__CE_state = _CustomElementState2.default.custom;
        _element.__CE_definition = definition;
        internals.patch(_element);
        return _element;
      }

      var lastIndex = constructionStack.length - 1;
      var element = constructionStack[lastIndex];
      if (element === _AlreadyConstructedMarker2.default) {
        throw new Error('The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.');
      }
      constructionStack[lastIndex] = _AlreadyConstructedMarker2.default;

      Object.setPrototypeOf(element, constructor.prototype);
      internals.patch( /** @type {!HTMLElement} */element);

      return element;
    }

    HTMLElement.prototype = _Native2.default.HTMLElement.prototype;

    return HTMLElement;
  }();
};

var _Native = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Native.js");

var _Native2 = _interopRequireDefault(_Native);

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _CustomElementState = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementState.js");

var _CustomElementState2 = _interopRequireDefault(_CustomElementState);

var _AlreadyConstructedMarker = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/AlreadyConstructedMarker.js");

var _AlreadyConstructedMarker2 = _interopRequireDefault(_AlreadyConstructedMarker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/**
 * @param {!CustomElementInternals} internals
 */

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ChildNode.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (internals, destination, builtIn) {
  /**
   * @param {...(!Node|string)} nodes
   */
  destination['before'] = function () {
    for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
      nodes[_key] = arguments[_key];
    }

    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    var connectedBefore = /** @type {!Array<!Node>} */nodes.filter(function (node) {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && Utilities.isConnected(node);
    });

    builtIn.before.apply(this, nodes);

    for (var i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (Utilities.isConnected(this)) {
      for (var _i = 0; _i < nodes.length; _i++) {
        var node = nodes[_i];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  /**
   * @param {...(!Node|string)} nodes
   */
  destination['after'] = function () {
    for (var _len2 = arguments.length, nodes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      nodes[_key2] = arguments[_key2];
    }

    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    var connectedBefore = /** @type {!Array<!Node>} */nodes.filter(function (node) {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && Utilities.isConnected(node);
    });

    builtIn.after.apply(this, nodes);

    for (var i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (Utilities.isConnected(this)) {
      for (var _i2 = 0; _i2 < nodes.length; _i2++) {
        var node = nodes[_i2];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  /**
   * @param {...(!Node|string)} nodes
   */
  destination['replaceWith'] = function () {
    for (var _len3 = arguments.length, nodes = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      nodes[_key3] = arguments[_key3];
    }

    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    var connectedBefore = /** @type {!Array<!Node>} */nodes.filter(function (node) {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && Utilities.isConnected(node);
    });

    var wasConnected = Utilities.isConnected(this);

    builtIn.replaceWith.apply(this, nodes);

    for (var i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (wasConnected) {
      internals.disconnectTree(this);
      for (var _i3 = 0; _i3 < nodes.length; _i3++) {
        var node = nodes[_i3];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  destination['remove'] = function () {
    var wasConnected = Utilities.isConnected(this);

    builtIn.remove.call(this);

    if (wasConnected) {
      internals.disconnectTree(this);
    }
  };
};

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _Utilities = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");

var Utilities = _interopRequireWildcard(_Utilities);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {{
 *   before: !function(...(!Node|string)),
 *   after: !function(...(!Node|string)),
 *   replaceWith: !function(...(!Node|string)),
 *   remove: !function(),
 * }}
 */
var ChildNodeNativeMethods = void 0;

/**
 * @param {!CustomElementInternals} internals
 * @param {!Object} destination
 * @param {!ChildNodeNativeMethods} builtIn
 */
;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Interface/ParentNode.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (internals, destination, builtIn) {
  /**
   * @param {...(!Node|string)} nodes
   */
  destination['prepend'] = function () {
    for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
      nodes[_key] = arguments[_key];
    }

    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    var connectedBefore = /** @type {!Array<!Node>} */nodes.filter(function (node) {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && Utilities.isConnected(node);
    });

    builtIn.prepend.apply(this, nodes);

    for (var i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (Utilities.isConnected(this)) {
      for (var _i = 0; _i < nodes.length; _i++) {
        var node = nodes[_i];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  /**
   * @param {...(!Node|string)} nodes
   */
  destination['append'] = function () {
    for (var _len2 = arguments.length, nodes = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      nodes[_key2] = arguments[_key2];
    }

    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    var connectedBefore = /** @type {!Array<!Node>} */nodes.filter(function (node) {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && Utilities.isConnected(node);
    });

    builtIn.append.apply(this, nodes);

    for (var i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (Utilities.isConnected(this)) {
      for (var _i2 = 0; _i2 < nodes.length; _i2++) {
        var node = nodes[_i2];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };
};

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _Utilities = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");

var Utilities = _interopRequireWildcard(_Utilities);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {{
 *   prepend: !function(...(!Node|string)),
  *  append: !function(...(!Node|string)),
 * }}
 */
var ParentNodeNativeMethods = void 0;

/**
 * @param {!CustomElementInternals} internals
 * @param {!Object} destination
 * @param {!ParentNodeNativeMethods} builtIn
 */
;

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Native.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  Document_createElement: window.Document.prototype.createElement,
  Document_createElementNS: window.Document.prototype.createElementNS,
  Document_importNode: window.Document.prototype.importNode,
  Document_prepend: window.Document.prototype['prepend'],
  Document_append: window.Document.prototype['append'],
  Node_cloneNode: window.Node.prototype.cloneNode,
  Node_appendChild: window.Node.prototype.appendChild,
  Node_insertBefore: window.Node.prototype.insertBefore,
  Node_removeChild: window.Node.prototype.removeChild,
  Node_replaceChild: window.Node.prototype.replaceChild,
  Node_textContent: Object.getOwnPropertyDescriptor(window.Node.prototype, 'textContent'),
  Element_attachShadow: window.Element.prototype['attachShadow'],
  Element_innerHTML: Object.getOwnPropertyDescriptor(window.Element.prototype, 'innerHTML'),
  Element_getAttribute: window.Element.prototype.getAttribute,
  Element_setAttribute: window.Element.prototype.setAttribute,
  Element_removeAttribute: window.Element.prototype.removeAttribute,
  Element_getAttributeNS: window.Element.prototype.getAttributeNS,
  Element_setAttributeNS: window.Element.prototype.setAttributeNS,
  Element_removeAttributeNS: window.Element.prototype.removeAttributeNS,
  Element_insertAdjacentElement: window.Element.prototype['insertAdjacentElement'],
  Element_prepend: window.Element.prototype['prepend'],
  Element_append: window.Element.prototype['append'],
  Element_before: window.Element.prototype['before'],
  Element_after: window.Element.prototype['after'],
  Element_replaceWith: window.Element.prototype['replaceWith'],
  Element_remove: window.Element.prototype['remove'],
  HTMLElement: window.HTMLElement,
  HTMLElement_innerHTML: Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerHTML'),
  HTMLElement_insertAdjacentElement: window.HTMLElement.prototype['insertAdjacentElement']
};

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Patch/Node.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (internals) {
  // `Node#nodeValue` is implemented on `Attr`.
  // `Node#textContent` is implemented on `Attr`, `Element`.

  Utilities.setPropertyUnchecked(Node.prototype, 'insertBefore',
  /**
   * @this {Node}
   * @param {!Node} node
   * @param {?Node} refNode
   * @return {!Node}
   */
  function (node, refNode) {
    if (node instanceof DocumentFragment) {
      var insertedNodes = Array.prototype.slice.apply(node.childNodes);
      var _nativeResult = _Native2.default.Node_insertBefore.call(this, node, refNode);

      // DocumentFragments can't be connected, so `disconnectTree` will never
      // need to be called on a DocumentFragment's children after inserting it.

      if (Utilities.isConnected(this)) {
        for (var i = 0; i < insertedNodes.length; i++) {
          internals.connectTree(insertedNodes[i]);
        }
      }

      return _nativeResult;
    }

    var nodeWasConnected = Utilities.isConnected(node);
    var nativeResult = _Native2.default.Node_insertBefore.call(this, node, refNode);

    if (nodeWasConnected) {
      internals.disconnectTree(node);
    }

    if (Utilities.isConnected(this)) {
      internals.connectTree(node);
    }

    return nativeResult;
  });

  Utilities.setPropertyUnchecked(Node.prototype, 'appendChild',
  /**
   * @this {Node}
   * @param {!Node} node
   * @return {!Node}
   */
  function (node) {
    if (node instanceof DocumentFragment) {
      var insertedNodes = Array.prototype.slice.apply(node.childNodes);
      var _nativeResult2 = _Native2.default.Node_appendChild.call(this, node);

      // DocumentFragments can't be connected, so `disconnectTree` will never
      // need to be called on a DocumentFragment's children after inserting it.

      if (Utilities.isConnected(this)) {
        for (var i = 0; i < insertedNodes.length; i++) {
          internals.connectTree(insertedNodes[i]);
        }
      }

      return _nativeResult2;
    }

    var nodeWasConnected = Utilities.isConnected(node);
    var nativeResult = _Native2.default.Node_appendChild.call(this, node);

    if (nodeWasConnected) {
      internals.disconnectTree(node);
    }

    if (Utilities.isConnected(this)) {
      internals.connectTree(node);
    }

    return nativeResult;
  });

  Utilities.setPropertyUnchecked(Node.prototype, 'cloneNode',
  /**
   * @this {Node}
   * @param {boolean=} deep
   * @return {!Node}
   */
  function (deep) {
    var clone = _Native2.default.Node_cloneNode.call(this, deep);
    // Only create custom elements if this element's owner document is
    // associated with the registry.
    if (!this.ownerDocument.__CE_hasRegistry) {
      internals.patchTree(clone);
    } else {
      internals.patchAndUpgradeTree(clone);
    }
    return clone;
  });

  Utilities.setPropertyUnchecked(Node.prototype, 'removeChild',
  /**
   * @this {Node}
   * @param {!Node} node
   * @return {!Node}
   */
  function (node) {
    var nodeWasConnected = Utilities.isConnected(node);
    var nativeResult = _Native2.default.Node_removeChild.call(this, node);

    if (nodeWasConnected) {
      internals.disconnectTree(node);
    }

    return nativeResult;
  });

  Utilities.setPropertyUnchecked(Node.prototype, 'replaceChild',
  /**
   * @this {Node}
   * @param {!Node} nodeToInsert
   * @param {!Node} nodeToRemove
   * @return {!Node}
   */
  function (nodeToInsert, nodeToRemove) {
    if (nodeToInsert instanceof DocumentFragment) {
      var insertedNodes = Array.prototype.slice.apply(nodeToInsert.childNodes);
      var _nativeResult3 = _Native2.default.Node_replaceChild.call(this, nodeToInsert, nodeToRemove);

      // DocumentFragments can't be connected, so `disconnectTree` will never
      // need to be called on a DocumentFragment's children after inserting it.

      if (Utilities.isConnected(this)) {
        internals.disconnectTree(nodeToRemove);
        for (var i = 0; i < insertedNodes.length; i++) {
          internals.connectTree(insertedNodes[i]);
        }
      }

      return _nativeResult3;
    }

    var nodeToInsertWasConnected = Utilities.isConnected(nodeToInsert);
    var nativeResult = _Native2.default.Node_replaceChild.call(this, nodeToInsert, nodeToRemove);
    var thisIsConnected = Utilities.isConnected(this);

    if (thisIsConnected) {
      internals.disconnectTree(nodeToRemove);
    }

    if (nodeToInsertWasConnected) {
      internals.disconnectTree(nodeToInsert);
    }

    if (thisIsConnected) {
      internals.connectTree(nodeToInsert);
    }

    return nativeResult;
  });

  function patch_textContent(destination, baseDescriptor) {
    Object.defineProperty(destination, 'textContent', {
      enumerable: baseDescriptor.enumerable,
      configurable: true,
      get: baseDescriptor.get,
      set: /** @this {Node} */function set(assignedValue) {
        // If this is a text node then there are no nodes to disconnect.
        if (this.nodeType === Node.TEXT_NODE) {
          baseDescriptor.set.call(this, assignedValue);
          return;
        }

        var removedNodes = undefined;
        // Checking for `firstChild` is faster than reading `childNodes.length`
        // to compare with 0.
        if (this.firstChild) {
          // Using `childNodes` is faster than `children`, even though we only
          // care about elements.
          var childNodes = this.childNodes;
          var childNodesLength = childNodes.length;
          if (childNodesLength > 0 && Utilities.isConnected(this)) {
            // Copying an array by iterating is faster than using slice.
            removedNodes = new Array(childNodesLength);
            for (var i = 0; i < childNodesLength; i++) {
              removedNodes[i] = childNodes[i];
            }
          }
        }

        baseDescriptor.set.call(this, assignedValue);

        if (removedNodes) {
          for (var _i = 0; _i < removedNodes.length; _i++) {
            internals.disconnectTree(removedNodes[_i]);
          }
        }
      }
    });
  }

  if (_Native2.default.Node_textContent && _Native2.default.Node_textContent.get) {
    patch_textContent(Node.prototype, _Native2.default.Node_textContent);
  } else {
    internals.addPatch(function (element) {
      patch_textContent(element, {
        enumerable: true,
        configurable: true,
        // NOTE: This implementation of the `textContent` getter assumes that
        // text nodes' `textContent` getter will not be patched.
        get: /** @this {Node} */function get() {
          /** @type {!Array<string>} */
          var parts = [];

          for (var i = 0; i < this.childNodes.length; i++) {
            parts.push(this.childNodes[i].textContent);
          }

          return parts.join('');
        },
        set: /** @this {Node} */function set(assignedValue) {
          while (this.firstChild) {
            _Native2.default.Node_removeChild.call(this, this.firstChild);
          }
          _Native2.default.Node_appendChild.call(this, document.createTextNode(assignedValue));
        }
      });
    });
  }
};

var _Native = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Native.js");

var _Native2 = _interopRequireDefault(_Native);

var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _Utilities = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Utilities.js");

var Utilities = _interopRequireWildcard(_Utilities);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

/**
 * @param {!CustomElementInternals} internals
 */

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/Utilities.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidCustomElementName = isValidCustomElementName;
exports.isConnected = isConnected;
exports.walkDeepDescendantElements = walkDeepDescendantElements;
exports.setPropertyUnchecked = setPropertyUnchecked;
var reservedTagList = new Set(['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph']);

/**
 * @param {string} localName
 * @returns {boolean}
 */
function isValidCustomElementName(localName) {
  var reserved = reservedTagList.has(localName);
  var validForm = /^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(localName);
  return !reserved && validForm;
}

/**
 * @private
 * @param {!Node} node
 * @return {boolean}
 */
function isConnected(node) {
  // Use `Node#isConnected`, if defined.
  var nativeValue = node.isConnected;
  if (nativeValue !== undefined) {
    return nativeValue;
  }

  /** @type {?Node|undefined} */
  var current = node;
  while (current && !(current.__CE_isImportDocument || current instanceof Document)) {
    current = current.parentNode || (window.ShadowRoot && current instanceof ShadowRoot ? current.host : undefined);
  }
  return !!(current && (current.__CE_isImportDocument || current instanceof Document));
}

/**
 * @param {!Node} root
 * @param {!Node} start
 * @return {?Node}
 */
function nextSiblingOrAncestorSibling(root, start) {
  var node = start;
  while (node && node !== root && !node.nextSibling) {
    node = node.parentNode;
  }
  return !node || node === root ? null : node.nextSibling;
}

/**
 * @param {!Node} root
 * @param {!Node} start
 * @return {?Node}
 */
function nextNode(root, start) {
  return start.firstChild ? start.firstChild : nextSiblingOrAncestorSibling(root, start);
}

/**
 * @param {!Node} root
 * @param {!function(!Element)} callback
 * @param {!Set<Node>=} visitedImports
 */
function walkDeepDescendantElements(root, callback) {
  var visitedImports = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Set();

  var node = root;
  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      var element = /** @type {!Element} */node;

      callback(element);

      var localName = element.localName;
      if (localName === 'link' && element.getAttribute('rel') === 'import') {
        // If this import (polyfilled or not) has it's root node available,
        // walk it.
        var importNode = /** @type {!Node} */element.import;
        if (importNode instanceof Node && !visitedImports.has(importNode)) {
          // Prevent multiple walks of the same import root.
          visitedImports.add(importNode);

          for (var child = importNode.firstChild; child; child = child.nextSibling) {
            walkDeepDescendantElements(child, callback, visitedImports);
          }
        }

        // Ignore descendants of import links to prevent attempting to walk the
        // elements created by the HTML Imports polyfill that we just walked
        // above.
        node = nextSiblingOrAncestorSibling(root, element);
        continue;
      } else if (localName === 'template') {
        // Ignore descendants of templates. There shouldn't be any descendants
        // because they will be moved into `.content` during construction in
        // browsers that support template but, in case they exist and are still
        // waiting to be moved by a polyfill, they will be ignored.
        node = nextSiblingOrAncestorSibling(root, element);
        continue;
      }

      // Walk shadow roots.
      var shadowRoot = element.__CE_shadowRoot;
      if (shadowRoot) {
        for (var _child = shadowRoot.firstChild; _child; _child = _child.nextSibling) {
          walkDeepDescendantElements(_child, callback, visitedImports);
        }
      }
    }

    node = nextNode(root, node);
  }
}

/**
 * Used to suppress Closure's "Modifying the prototype is only allowed if the
 * constructor is in the same scope" warning without using
 * `@suppress {newCheckTypes, duplicate}` because `newCheckTypes` is too broad.
 *
 * @param {!Object} destination
 * @param {string} name
 * @param {*} value
 */
function setPropertyUnchecked(destination, name, value) {
  destination[name] = value;
}

/***/ }),

/***/ "../node_modules/@webcomponents/custom-elements/src/custom-elements.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _CustomElementInternals = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementInternals.js");

var _CustomElementInternals2 = _interopRequireDefault(_CustomElementInternals);

var _CustomElementRegistry = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/CustomElementRegistry.js");

var _CustomElementRegistry2 = _interopRequireDefault(_CustomElementRegistry);

var _HTMLElement = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/HTMLElement.js");

var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

var _Document = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Document.js");

var _Document2 = _interopRequireDefault(_Document);

var _Node = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Node.js");

var _Node2 = _interopRequireDefault(_Node);

var _Element = __webpack_require__("../node_modules/@webcomponents/custom-elements/src/Patch/Element.js");

var _Element2 = _interopRequireDefault(_Element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

var priorCustomElements = window['customElements'];

if (!priorCustomElements || priorCustomElements['forcePolyfill'] || typeof priorCustomElements['define'] != 'function' || typeof priorCustomElements['get'] != 'function') {
  /** @type {!CustomElementInternals} */
  var internals = new _CustomElementInternals2.default();

  (0, _HTMLElement2.default)(internals);
  (0, _Document2.default)(internals);
  (0, _Node2.default)(internals);
  (0, _Element2.default)(internals);

  // The main document is always associated with the registry.
  document.__CE_hasRegistry = true;

  /** @type {!CustomElementRegistry} */
  var customElements = new _CustomElementRegistry2.default(internals);

  Object.defineProperty(window, 'customElements', {
    configurable: true,
    enumerable: true,
    value: customElements
  });
}

/***/ }),

/***/ "../node_modules/array.from/implementation.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ES = __webpack_require__("../node_modules/es-abstract/es6.js");
var supportsDescriptors = __webpack_require__("../node_modules/define-properties/index.js").supportsDescriptors;

/*! https://mths.be/array-from v0.2.0 by @mathias */
module.exports = function from(arrayLike) {
	var defineProperty = supportsDescriptors ? Object.defineProperty : function put(object, key, descriptor) {
		object[key] = descriptor.value;
	};
	var C = this;
	if (arrayLike === null || typeof arrayLike === 'undefined') {
		throw new TypeError('`Array.from` requires an array-like object, not `null` or `undefined`');
	}
	var items = ES.ToObject(arrayLike);

	var mapFn, T;
	if (typeof arguments[1] !== 'undefined') {
		mapFn = arguments[1];
		if (!ES.IsCallable(mapFn)) {
			throw new TypeError('When provided, the second argument to `Array.from` must be a function');
		}
		if (arguments.length > 2) {
			T = arguments[2];
		}
	}

	var len = ES.ToLength(items.length);
	var A = ES.IsCallable(C) ? ES.ToObject(new C(len)) : new Array(len);
	var k = 0;
	var kValue, mappedValue;
	while (k < len) {
		kValue = items[k];
		if (mapFn) {
			mappedValue = typeof T === 'undefined' ? mapFn(kValue, k) : ES.Call(mapFn, T, [kValue, k]);
		} else {
			mappedValue = kValue;
		}
		defineProperty(A, k, {
			'configurable': true,
			'enumerable': true,
			'value': mappedValue,
			'writable': true
		});
		k += 1;
	}
	A.length = len;
	return A;
};

/***/ }),

/***/ "../node_modules/array.from/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var define = __webpack_require__("../node_modules/define-properties/index.js");

var implementation = __webpack_require__("../node_modules/array.from/implementation.js");
var getPolyfill = __webpack_require__("../node_modules/array.from/polyfill.js");
var shim = __webpack_require__("../node_modules/array.from/shim.js");

// eslint-disable-next-line no-unused-vars
var boundFromShim = function from(array) {
	// eslint-disable-next-line no-invalid-this
	return implementation.apply(this || Array, arguments);
};

define(boundFromShim, {
	'getPolyfill': getPolyfill,
	'implementation': implementation,
	'shim': shim
});

module.exports = boundFromShim;

/***/ }),

/***/ "../node_modules/array.from/polyfill.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ES = __webpack_require__("../node_modules/es-abstract/es6.js");
var implementation = __webpack_require__("../node_modules/array.from/implementation.js");

var tryCall = function tryCall(fn) {
	try {
		fn();
		return true;
	} catch (e) {
		return false;
	}
};

module.exports = function getPolyfill() {
	var implemented = ES.IsCallable(Array.from) && tryCall(function () {
		Array.from({ 'length': -Infinity });
	}) && !tryCall(function () {
		Array.from([], undefined);
	});

	return implemented ? Array.from : implementation;
};

/***/ }),

/***/ "../node_modules/array.from/shim.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var define = __webpack_require__("../node_modules/define-properties/index.js");
var getPolyfill = __webpack_require__("../node_modules/array.from/polyfill.js");

module.exports = function shimArrayFrom() {
	var polyfill = getPolyfill();

	define(Array, { 'from': polyfill }, {
		'from': function from() {
			return Array.from !== polyfill;
		}
	});

	return polyfill;
};

/***/ }),

/***/ "../node_modules/define-properties/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var keys = __webpack_require__("../node_modules/object-keys/index.js");
var foreach = __webpack_require__("../node_modules/foreach/index.js");
var hasSymbols = typeof Symbol === 'function' && _typeof(Symbol()) === 'symbol';

var toStr = Object.prototype.toString;

var isFunction = function isFunction(fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function arePropertyDescriptorsSupported() {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
		/* eslint-disable no-unused-vars, no-restricted-syntax */
		for (var _ in obj) {
			return false;
		}
		/* eslint-enable no-unused-vars, no-restricted-syntax */
		return obj.x === obj;
	} catch (e) {
		/* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty = function defineProperty(object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function defineProperties(object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = props.concat(Object.getOwnPropertySymbols(map));
	}
	foreach(props, function (name) {
		defineProperty(object, name, map[name], predicates[name]);
	});
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;

/***/ }),

/***/ "../node_modules/es-abstract/es5.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var $isNaN = __webpack_require__("../node_modules/es-abstract/helpers/isNaN.js");
var $isFinite = __webpack_require__("../node_modules/es-abstract/helpers/isFinite.js");

var sign = __webpack_require__("../node_modules/es-abstract/helpers/sign.js");
var mod = __webpack_require__("../node_modules/es-abstract/helpers/mod.js");

var IsCallable = __webpack_require__("../node_modules/is-callable/index.js");
var toPrimitive = __webpack_require__("../node_modules/es-to-primitive/es5.js");

// https://es5.github.io/#x9
var ES5 = {
	ToPrimitive: toPrimitive,

	ToBoolean: function ToBoolean(value) {
		return Boolean(value);
	},
	ToNumber: function ToNumber(value) {
		return Number(value);
	},
	ToInteger: function ToInteger(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number)) {
			return 0;
		}
		if (number === 0 || !$isFinite(number)) {
			return number;
		}
		return sign(number) * Math.floor(Math.abs(number));
	},
	ToInt32: function ToInt32(x) {
		return this.ToNumber(x) >> 0;
	},
	ToUint32: function ToUint32(x) {
		return this.ToNumber(x) >>> 0;
	},
	ToUint16: function ToUint16(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) {
			return 0;
		}
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x10000);
	},
	ToString: function ToString(value) {
		return String(value);
	},
	ToObject: function ToObject(value) {
		this.CheckObjectCoercible(value);
		return Object(value);
	},
	CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
		/* jshint eqnull:true */
		if (value == null) {
			throw new TypeError(optMessage || 'Cannot call method on ' + value);
		}
		return value;
	},
	IsCallable: IsCallable,
	SameValue: function SameValue(x, y) {
		if (x === y) {
			// 0 === -0, but they are not identical.
			if (x === 0) {
				return 1 / x === 1 / y;
			}
			return true;
		}
		return $isNaN(x) && $isNaN(y);
	},

	// http://www.ecma-international.org/ecma-262/5.1/#sec-8
	Type: function Type(x) {
		if (x === null) {
			return 'Null';
		}
		if (typeof x === 'undefined') {
			return 'Undefined';
		}
		if (typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object') {
			return 'Object';
		}
		if (typeof x === 'number') {
			return 'Number';
		}
		if (typeof x === 'boolean') {
			return 'Boolean';
		}
		if (typeof x === 'string') {
			return 'String';
		}
	}
};

module.exports = ES5;

/***/ }),

/***/ "../node_modules/es-abstract/es6.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && _typeof(Symbol.iterator) === 'symbol';
var symbolToStr = hasSymbols ? Symbol.prototype.toString : toStr;

var $isNaN = __webpack_require__("../node_modules/es-abstract/helpers/isNaN.js");
var $isFinite = __webpack_require__("../node_modules/es-abstract/helpers/isFinite.js");
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

var assign = __webpack_require__("../node_modules/es-abstract/helpers/assign.js");
var sign = __webpack_require__("../node_modules/es-abstract/helpers/sign.js");
var mod = __webpack_require__("../node_modules/es-abstract/helpers/mod.js");
var isPrimitive = __webpack_require__("../node_modules/es-abstract/helpers/isPrimitive.js");
var toPrimitive = __webpack_require__("../node_modules/es-to-primitive/es6.js");
var parseInteger = parseInt;
var bind = __webpack_require__("../node_modules/function-bind/index.js");
var strSlice = bind.call(Function.call, String.prototype.slice);
var isBinary = bind.call(Function.call, RegExp.prototype.test, /^0b[01]+$/i);
var isOctal = bind.call(Function.call, RegExp.prototype.test, /^0o[0-7]+$/i);
var nonWS = ['\x85', '\u200B', '\uFFFE'].join('');
var nonWSregex = new RegExp('[' + nonWS + ']', 'g');
var hasNonWS = bind.call(Function.call, RegExp.prototype.test, nonWSregex);
var invalidHexLiteral = /^[-+]0x[0-9a-f]+$/i;
var isInvalidHexLiteral = bind.call(Function.call, RegExp.prototype.test, invalidHexLiteral);

// whitespace from: http://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = ['\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003', '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028', '\u2029\uFEFF'].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var replace = bind.call(Function.call, String.prototype.replace);
var trim = function trim(value) {
	return replace(value, trimRegex, '');
};

var ES5 = __webpack_require__("../node_modules/es-abstract/es5.js");

var hasRegExpMatcher = __webpack_require__("../node_modules/is-regex/index.js");

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
var ES6 = assign(assign({}, ES5), {

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-call-f-v-args
	Call: function Call(F, V) {
		var args = arguments.length > 2 ? arguments[2] : [];
		if (!this.IsCallable(F)) {
			throw new TypeError(F + ' is not a function');
		}
		return F.apply(V, args);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toprimitive
	ToPrimitive: toPrimitive,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toboolean
	// ToBoolean: ES5.ToBoolean,

	// http://www.ecma-international.org/ecma-262/6.0/#sec-tonumber
	ToNumber: function ToNumber(argument) {
		var value = isPrimitive(argument) ? argument : toPrimitive(argument, 'number');
		if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a number');
		}
		if (typeof value === 'string') {
			if (isBinary(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 2));
			} else if (isOctal(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 8));
			} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
				return NaN;
			} else {
				var trimmed = trim(value);
				if (trimmed !== value) {
					return this.ToNumber(trimmed);
				}
			}
		}
		return Number(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tointeger
	// ToInteger: ES5.ToNumber,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint32
	// ToInt32: ES5.ToInt32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint32
	// ToUint32: ES5.ToUint32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint16
	ToInt16: function ToInt16(argument) {
		var int16bit = this.ToUint16(argument);
		return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint16
	// ToUint16: ES5.ToUint16,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint8
	ToInt8: function ToInt8(argument) {
		var int8bit = this.ToUint8(argument);
		return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8
	ToUint8: function ToUint8(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) {
			return 0;
		}
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x100);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8clamp
	ToUint8Clamp: function ToUint8Clamp(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number <= 0) {
			return 0;
		}
		if (number >= 0xFF) {
			return 0xFF;
		}
		var f = Math.floor(argument);
		if (f + 0.5 < number) {
			return f + 1;
		}
		if (number < f + 0.5) {
			return f;
		}
		if (f % 2 !== 0) {
			return f + 1;
		}
		return f;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring
	ToString: function ToString(argument) {
		if ((typeof argument === 'undefined' ? 'undefined' : _typeof(argument)) === 'symbol') {
			throw new TypeError('Cannot convert a Symbol value to a string');
		}
		return String(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toobject
	ToObject: function ToObject(value) {
		this.RequireObjectCoercible(value);
		return Object(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
	ToPropertyKey: function ToPropertyKey(argument) {
		var key = this.ToPrimitive(argument, String);
		return (typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'symbol' ? symbolToStr.call(key) : this.ToString(key);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	ToLength: function ToLength(argument) {
		var len = this.ToInteger(argument);
		if (len <= 0) {
			return 0;
		} // includes converting -0 to +0
		if (len > MAX_SAFE_INTEGER) {
			return MAX_SAFE_INTEGER;
		}
		return len;
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring
	CanonicalNumericIndexString: function CanonicalNumericIndexString(argument) {
		if (toStr.call(argument) !== '[object String]') {
			throw new TypeError('must be a string');
		}
		if (argument === '-0') {
			return -0;
		}
		var n = this.ToNumber(argument);
		if (this.SameValue(this.ToString(n), argument)) {
			return n;
		}
		return void 0;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-requireobjectcoercible
	RequireObjectCoercible: ES5.CheckObjectCoercible,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
	IsArray: Array.isArray || function IsArray(argument) {
		return toStr.call(argument) === '[object Array]';
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iscallable
	// IsCallable: ES5.IsCallable,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
	IsConstructor: function IsConstructor(argument) {
		return typeof argument === 'function' && !!argument.prototype; // unfortunately there's no way to truly check this without try/catch `new argument`
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isextensible-o
	IsExtensible: function IsExtensible(obj) {
		if (!Object.preventExtensions) {
			return true;
		}
		if (isPrimitive(obj)) {
			return false;
		}
		return Object.isExtensible(obj);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isinteger
	IsInteger: function IsInteger(argument) {
		if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
			return false;
		}
		var abs = Math.abs(argument);
		return Math.floor(abs) === abs;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ispropertykey
	IsPropertyKey: function IsPropertyKey(argument) {
		return typeof argument === 'string' || (typeof argument === 'undefined' ? 'undefined' : _typeof(argument)) === 'symbol';
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-isregexp
	IsRegExp: function IsRegExp(argument) {
		if (!argument || (typeof argument === 'undefined' ? 'undefined' : _typeof(argument)) !== 'object') {
			return false;
		}
		if (hasSymbols) {
			var isRegExp = argument[Symbol.match];
			if (typeof isRegExp !== 'undefined') {
				return ES5.ToBoolean(isRegExp);
			}
		}
		return hasRegExpMatcher(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue
	// SameValue: ES5.SameValue,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
	SameValueZero: function SameValueZero(x, y) {
		return x === y || $isNaN(x) && $isNaN(y);
	},

	/**
  * 7.3.2 GetV (V, P)
  * 1. Assert: IsPropertyKey(P) is true.
  * 2. Let O be ToObject(V).
  * 3. ReturnIfAbrupt(O).
  * 4. Return O.[[Get]](P, V).
  */
	GetV: function GetV(V, P) {
		// 7.3.2.1
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}

		// 7.3.2.2-3
		var O = this.ToObject(V);

		// 7.3.2.4
		return O[P];
	},

	/**
  * 7.3.9 - http://www.ecma-international.org/ecma-262/6.0/#sec-getmethod
  * 1. Assert: IsPropertyKey(P) is true.
  * 2. Let func be GetV(O, P).
  * 3. ReturnIfAbrupt(func).
  * 4. If func is either undefined or null, return undefined.
  * 5. If IsCallable(func) is false, throw a TypeError exception.
  * 6. Return func.
  */
	GetMethod: function GetMethod(O, P) {
		// 7.3.9.1
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}

		// 7.3.9.2
		var func = this.GetV(O, P);

		// 7.3.9.4
		if (func == null) {
			return undefined;
		}

		// 7.3.9.5
		if (!this.IsCallable(func)) {
			throw new TypeError(P + 'is not a function');
		}

		// 7.3.9.6
		return func;
	},

	/**
  * 7.3.1 Get (O, P) - http://www.ecma-international.org/ecma-262/6.0/#sec-get-o-p
  * 1. Assert: Type(O) is Object.
  * 2. Assert: IsPropertyKey(P) is true.
  * 3. Return O.[[Get]](P, O).
  */
	Get: function Get(O, P) {
		// 7.3.1.1
		if (this.Type(O) !== 'Object') {
			throw new TypeError('Assertion failed: Type(O) is not Object');
		}
		// 7.3.1.2
		if (!this.IsPropertyKey(P)) {
			throw new TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}
		// 7.3.1.3
		return O[P];
	},

	Type: function Type(x) {
		if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'symbol') {
			return 'Symbol';
		}
		return ES5.Type(x);
	},

	// http://www.ecma-international.org/ecma-262/6.0/#sec-speciesconstructor
	SpeciesConstructor: function SpeciesConstructor(O, defaultConstructor) {
		if (this.Type(O) !== 'Object') {
			throw new TypeError('Assertion failed: Type(O) is not Object');
		}
		var C = O.constructor;
		if (typeof C === 'undefined') {
			return defaultConstructor;
		}
		if (this.Type(C) !== 'Object') {
			throw new TypeError('O.constructor is not an Object');
		}
		var S = hasSymbols && Symbol.species ? C[Symbol.species] : undefined;
		if (S == null) {
			return defaultConstructor;
		}
		if (this.IsConstructor(S)) {
			return S;
		}
		throw new TypeError('no constructor found');
	}
});

delete ES6.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible

module.exports = ES6;

/***/ }),

/***/ "../node_modules/es-abstract/helpers/assign.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;
module.exports = Object.assign || function assign(target, source) {
	for (var key in source) {
		if (has.call(source, key)) {
			target[key] = source[key];
		}
	}
	return target;
};

/***/ }),

/***/ "../node_modules/es-abstract/helpers/isFinite.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $isNaN = Number.isNaN || function (a) {
  return a !== a;
};

module.exports = Number.isFinite || function (x) {
  return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity;
};

/***/ }),

/***/ "../node_modules/es-abstract/helpers/isNaN.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = Number.isNaN || function isNaN(a) {
	return a !== a;
};

/***/ }),

/***/ "../node_modules/es-abstract/helpers/isPrimitive.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function isPrimitive(value) {
	return value === null || typeof value !== 'function' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object';
};

/***/ }),

/***/ "../node_modules/es-abstract/helpers/mod.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function mod(number, modulo) {
	var remain = number % modulo;
	return Math.floor(remain >= 0 ? remain : remain + modulo);
};

/***/ }),

/***/ "../node_modules/es-abstract/helpers/sign.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function sign(number) {
	return number >= 0 ? 1 : -1;
};

/***/ }),

/***/ "../node_modules/es-to-primitive/es5.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;

var isPrimitive = __webpack_require__("../node_modules/es-to-primitive/helpers/isPrimitive.js");

var isCallable = __webpack_require__("../node_modules/is-callable/index.js");

// https://es5.github.io/#x8.12
var ES5internalSlots = {
	'[[DefaultValue]]': function DefaultValue(O, hint) {
		var actualHint = hint || (toStr.call(O) === '[object Date]' ? String : Number);

		if (actualHint === String || actualHint === Number) {
			var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
			var value, i;
			for (i = 0; i < methods.length; ++i) {
				if (isCallable(O[methods[i]])) {
					value = O[methods[i]]();
					if (isPrimitive(value)) {
						return value;
					}
				}
			}
			throw new TypeError('No default value');
		}
		throw new TypeError('invalid [[DefaultValue]] hint supplied');
	}
};

// https://es5.github.io/#x9
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	return ES5internalSlots['[[DefaultValue]]'](input, PreferredType);
};

/***/ }),

/***/ "../node_modules/es-to-primitive/es6.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var hasSymbols = typeof Symbol === 'function' && _typeof(Symbol.iterator) === 'symbol';

var isPrimitive = __webpack_require__("../node_modules/es-to-primitive/helpers/isPrimitive.js");
var isCallable = __webpack_require__("../node_modules/is-callable/index.js");
var isDate = __webpack_require__("../node_modules/is-date-object/index.js");
var isSymbol = __webpack_require__("../node_modules/is-symbol/index.js");

var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
	if (typeof O === 'undefined' || O === null) {
		throw new TypeError('Cannot call method on ' + O);
	}
	if (typeof hint !== 'string' || hint !== 'number' && hint !== 'string') {
		throw new TypeError('hint must be "string" or "number"');
	}
	var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
	var method, result, i;
	for (i = 0; i < methodNames.length; ++i) {
		method = O[methodNames[i]];
		if (isCallable(method)) {
			result = method.call(O);
			if (isPrimitive(result)) {
				return result;
			}
		}
	}
	throw new TypeError('No default value');
};

var GetMethod = function GetMethod(O, P) {
	var func = O[P];
	if (func !== null && typeof func !== 'undefined') {
		if (!isCallable(func)) {
			throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
		}
		return func;
	}
};

// http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
module.exports = function ToPrimitive(input, PreferredType) {
	if (isPrimitive(input)) {
		return input;
	}
	var hint = 'default';
	if (arguments.length > 1) {
		if (PreferredType === String) {
			hint = 'string';
		} else if (PreferredType === Number) {
			hint = 'number';
		}
	}

	var exoticToPrim;
	if (hasSymbols) {
		if (Symbol.toPrimitive) {
			exoticToPrim = GetMethod(input, Symbol.toPrimitive);
		} else if (isSymbol(input)) {
			exoticToPrim = Symbol.prototype.valueOf;
		}
	}
	if (typeof exoticToPrim !== 'undefined') {
		var result = exoticToPrim.call(input, hint);
		if (isPrimitive(result)) {
			return result;
		}
		throw new TypeError('unable to convert exotic object to primitive');
	}
	if (hint === 'default' && (isDate(input) || isSymbol(input))) {
		hint = 'string';
	}
	return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
};

/***/ }),

/***/ "../node_modules/es-to-primitive/helpers/isPrimitive.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function isPrimitive(value) {
	return value === null || typeof value !== 'function' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object';
};

/***/ }),

/***/ "../node_modules/es6-promise/dist/es6-promise.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.0
 */

(function (global, factory) {
  ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : global.ES6Promise = factory();
})(undefined, function () {
  'use strict';

  function objectOrFunction(x) {
    return typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null;
  }

  function isFunction(x) {
    return typeof x === 'function';
  }

  var _isArray = undefined;
  if (!Array.isArray) {
    _isArray = function _isArray(x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    };
  } else {
    _isArray = Array.isArray;
  }

  var isArray = _isArray;

  var len = 0;
  var vertxNext = undefined;
  var customSchedulerFn = undefined;

  var asap = function asap(callback, arg) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;
    if (len === 2) {
      // If len is 2, that means that we need to schedule an async flush.
      // If additional callbacks are queued before the queue is flushed, they
      // will be processed by this flush that we are scheduling.
      if (customSchedulerFn) {
        customSchedulerFn(flush);
      } else {
        scheduleFlush();
      }
    }
  };

  function setScheduler(scheduleFn) {
    customSchedulerFn = scheduleFn;
  }

  function setAsap(asapFn) {
    asap = asapFn;
  }

  var browserWindow = typeof window !== 'undefined' ? window : undefined;
  var browserGlobal = browserWindow || {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

  // test for web worker but not in IE10
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

  // node
  function useNextTick() {
    // node version 0.10.x displays a deprecation warning when nextTick is used recursively
    // see https://github.com/cujojs/when/issues/410 for details
    return function () {
      return process.nextTick(flush);
    };
  }

  // vertx
  function useVertxTimer() {
    if (typeof vertxNext !== 'undefined') {
      return function () {
        vertxNext(flush);
      };
    }

    return useSetTimeout();
  }

  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, { characterData: true });

    return function () {
      node.data = iterations = ++iterations % 2;
    };
  }

  // web worker
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function () {
      return channel.port2.postMessage(0);
    };
  }

  function useSetTimeout() {
    // Store setTimeout reference so es6-promise will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var globalSetTimeout = setTimeout;
    return function () {
      return globalSetTimeout(flush, 1);
    };
  }

  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < len; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];

      callback(arg);

      queue[i] = undefined;
      queue[i + 1] = undefined;
    }

    len = 0;
  }

  function attemptVertx() {
    try {
      var r = require;
      var vertx = __webpack_require__(0);
      vertxNext = vertx.runOnLoop || vertx.runOnContext;
      return useVertxTimer();
    } catch (e) {
      return useSetTimeout();
    }
  }

  var scheduleFlush = undefined;
  // Decide what async method to use to triggering processing of queued callbacks:
  if (isNode) {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else if (browserWindow === undefined && "function" === 'function') {
    scheduleFlush = attemptVertx();
  } else {
    scheduleFlush = useSetTimeout();
  }

  function then(onFulfillment, onRejection) {
    var _arguments = arguments;

    var parent = this;

    var child = new this.constructor(noop);

    if (child[PROMISE_ID] === undefined) {
      makePromise(child);
    }

    var _state = parent._state;

    if (_state) {
      (function () {
        var callback = _arguments[_state - 1];
        asap(function () {
          return invokeCallback(_state, child, callback, parent._result);
        });
      })();
    } else {
      subscribe(parent, child, onFulfillment, onRejection);
    }

    return child;
  }

  /**
    `Promise.resolve` returns a promise that will become resolved with the
    passed `value`. It is shorthand for the following:
  
    ```javascript
    let promise = new Promise(function(resolve, reject){
      resolve(1);
    });
  
    promise.then(function(value){
      // value === 1
    });
    ```
  
    Instead of writing the above, your code now simply becomes the following:
  
    ```javascript
    let promise = Promise.resolve(1);
  
    promise.then(function(value){
      // value === 1
    });
    ```
  
    @method resolve
    @static
    @param {Any} value value that the returned promise will be resolved with
    Useful for tooling.
    @return {Promise} a promise that will become fulfilled with the given
    `value`
  */
  function resolve(object) {
    /*jshint validthis:true */
    var Constructor = this;

    if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.constructor === Constructor) {
      return object;
    }

    var promise = new Constructor(noop);
    _resolve(promise, object);
    return promise;
  }

  var PROMISE_ID = Math.random().toString(36).substring(16);

  function noop() {}

  var PENDING = void 0;
  var FULFILLED = 1;
  var REJECTED = 2;

  var GET_THEN_ERROR = new ErrorObject();

  function selfFulfillment() {
    return new TypeError("You cannot resolve a promise with itself");
  }

  function cannotReturnOwn() {
    return new TypeError('A promises callback cannot return that same promise.');
  }

  function getThen(promise) {
    try {
      return promise.then;
    } catch (error) {
      GET_THEN_ERROR.error = error;
      return GET_THEN_ERROR;
    }
  }

  function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
    try {
      then.call(value, fulfillmentHandler, rejectionHandler);
    } catch (e) {
      return e;
    }
  }

  function handleForeignThenable(promise, thenable, then) {
    asap(function (promise) {
      var sealed = false;
      var error = tryThen(then, thenable, function (value) {
        if (sealed) {
          return;
        }
        sealed = true;
        if (thenable !== value) {
          _resolve(promise, value);
        } else {
          fulfill(promise, value);
        }
      }, function (reason) {
        if (sealed) {
          return;
        }
        sealed = true;

        _reject(promise, reason);
      }, 'Settle: ' + (promise._label || ' unknown promise'));

      if (!sealed && error) {
        sealed = true;
        _reject(promise, error);
      }
    }, promise);
  }

  function handleOwnThenable(promise, thenable) {
    if (thenable._state === FULFILLED) {
      fulfill(promise, thenable._result);
    } else if (thenable._state === REJECTED) {
      _reject(promise, thenable._result);
    } else {
      subscribe(thenable, undefined, function (value) {
        return _resolve(promise, value);
      }, function (reason) {
        return _reject(promise, reason);
      });
    }
  }

  function handleMaybeThenable(promise, maybeThenable, then$$) {
    if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
      handleOwnThenable(promise, maybeThenable);
    } else {
      if (then$$ === GET_THEN_ERROR) {
        _reject(promise, GET_THEN_ERROR.error);
        GET_THEN_ERROR.error = null;
      } else if (then$$ === undefined) {
        fulfill(promise, maybeThenable);
      } else if (isFunction(then$$)) {
        handleForeignThenable(promise, maybeThenable, then$$);
      } else {
        fulfill(promise, maybeThenable);
      }
    }
  }

  function _resolve(promise, value) {
    if (promise === value) {
      _reject(promise, selfFulfillment());
    } else if (objectOrFunction(value)) {
      handleMaybeThenable(promise, value, getThen(value));
    } else {
      fulfill(promise, value);
    }
  }

  function publishRejection(promise) {
    if (promise._onerror) {
      promise._onerror(promise._result);
    }

    publish(promise);
  }

  function fulfill(promise, value) {
    if (promise._state !== PENDING) {
      return;
    }

    promise._result = value;
    promise._state = FULFILLED;

    if (promise._subscribers.length !== 0) {
      asap(publish, promise);
    }
  }

  function _reject(promise, reason) {
    if (promise._state !== PENDING) {
      return;
    }
    promise._state = REJECTED;
    promise._result = reason;

    asap(publishRejection, promise);
  }

  function subscribe(parent, child, onFulfillment, onRejection) {
    var _subscribers = parent._subscribers;
    var length = _subscribers.length;

    parent._onerror = null;

    _subscribers[length] = child;
    _subscribers[length + FULFILLED] = onFulfillment;
    _subscribers[length + REJECTED] = onRejection;

    if (length === 0 && parent._state) {
      asap(publish, parent);
    }
  }

  function publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;

    if (subscribers.length === 0) {
      return;
    }

    var child = undefined,
        callback = undefined,
        detail = promise._result;

    for (var i = 0; i < subscribers.length; i += 3) {
      child = subscribers[i];
      callback = subscribers[i + settled];

      if (child) {
        invokeCallback(settled, child, callback, detail);
      } else {
        callback(detail);
      }
    }

    promise._subscribers.length = 0;
  }

  function ErrorObject() {
    this.error = null;
  }

  var TRY_CATCH_ERROR = new ErrorObject();

  function tryCatch(callback, detail) {
    try {
      return callback(detail);
    } catch (e) {
      TRY_CATCH_ERROR.error = e;
      return TRY_CATCH_ERROR;
    }
  }

  function invokeCallback(settled, promise, callback, detail) {
    var hasCallback = isFunction(callback),
        value = undefined,
        error = undefined,
        succeeded = undefined,
        failed = undefined;

    if (hasCallback) {
      value = tryCatch(callback, detail);

      if (value === TRY_CATCH_ERROR) {
        failed = true;
        error = value.error;
        value.error = null;
      } else {
        succeeded = true;
      }

      if (promise === value) {
        _reject(promise, cannotReturnOwn());
        return;
      }
    } else {
      value = detail;
      succeeded = true;
    }

    if (promise._state !== PENDING) {
      // noop
    } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
  }

  function initializePromise(promise, resolver) {
    try {
      resolver(function resolvePromise(value) {
        _resolve(promise, value);
      }, function rejectPromise(reason) {
        _reject(promise, reason);
      });
    } catch (e) {
      _reject(promise, e);
    }
  }

  var id = 0;
  function nextId() {
    return id++;
  }

  function makePromise(promise) {
    promise[PROMISE_ID] = id++;
    promise._state = undefined;
    promise._result = undefined;
    promise._subscribers = [];
  }

  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this._input = input;
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate();
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      _reject(this.promise, validationError());
    }
  }

  function validationError() {
    return new Error('Array Methods must be provided an Array');
  };

  Enumerator.prototype._enumerate = function () {
    var length = this.length;
    var _input = this._input;

    for (var i = 0; this._state === PENDING && i < length; i++) {
      this._eachEntry(_input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function (entry, i) {
    var c = this._instanceConstructor;
    var resolve$$ = c.resolve;

    if (resolve$$ === resolve) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$) {
          return resolve$$(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function (state, i, value) {
    var promise = this.promise;

    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        _reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function (promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  /**
    `Promise.all` accepts an array of promises, and returns a new promise which
    is fulfilled with an array of fulfillment values for the passed promises, or
    rejected with the reason of the first passed promise to be rejected. It casts all
    elements of the passed iterable to promises as it runs this algorithm.
  
    Example:
  
    ```javascript
    let promise1 = resolve(1);
    let promise2 = resolve(2);
    let promise3 = resolve(3);
    let promises = [ promise1, promise2, promise3 ];
  
    Promise.all(promises).then(function(array){
      // The array here would be [ 1, 2, 3 ];
    });
    ```
  
    If any of the `promises` given to `all` are rejected, the first promise
    that is rejected will be given as an argument to the returned promises's
    rejection handler. For example:
  
    Example:
  
    ```javascript
    let promise1 = resolve(1);
    let promise2 = reject(new Error("2"));
    let promise3 = reject(new Error("3"));
    let promises = [ promise1, promise2, promise3 ];
  
    Promise.all(promises).then(function(array){
      // Code here never runs because there are rejected promises!
    }, function(error) {
      // error.message === "2"
    });
    ```
  
    @method all
    @static
    @param {Array} entries array of promises
    @param {String} label optional string for labeling the promise.
    Useful for tooling.
    @return {Promise} promise that is fulfilled when all `promises` have been
    fulfilled, or rejected if any of them become rejected.
    @static
  */
  function all(entries) {
    return new Enumerator(this, entries).promise;
  }

  /**
    `Promise.race` returns a new promise which is settled in the same way as the
    first passed promise to settle.
  
    Example:
  
    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });
  
    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 2');
      }, 100);
    });
  
    Promise.race([promise1, promise2]).then(function(result){
      // result === 'promise 2' because it was resolved before promise1
      // was resolved.
    });
    ```
  
    `Promise.race` is deterministic in that only the state of the first
    settled promise matters. For example, even if other promises given to the
    `promises` array argument are resolved, but the first settled promise has
    become rejected before the other promises became fulfilled, the returned
    promise will become rejected:
  
    ```javascript
    let promise1 = new Promise(function(resolve, reject){
      setTimeout(function(){
        resolve('promise 1');
      }, 200);
    });
  
    let promise2 = new Promise(function(resolve, reject){
      setTimeout(function(){
        reject(new Error('promise 2'));
      }, 100);
    });
  
    Promise.race([promise1, promise2]).then(function(result){
      // Code here never runs
    }, function(reason){
      // reason.message === 'promise 2' because promise 2 became rejected before
      // promise 1 became fulfilled
    });
    ```
  
    An example real-world use case is implementing timeouts:
  
    ```javascript
    Promise.race([ajax('foo.json'), timeout(5000)])
    ```
  
    @method race
    @static
    @param {Array} promises array of promises to observe
    Useful for tooling.
    @return {Promise} a promise which settles in the same way as the first passed
    promise to settle.
  */
  function race(entries) {
    /*jshint validthis:true */
    var Constructor = this;

    if (!isArray(entries)) {
      return new Constructor(function (_, reject) {
        return reject(new TypeError('You must pass an array to race.'));
      });
    } else {
      return new Constructor(function (resolve, reject) {
        var length = entries.length;
        for (var i = 0; i < length; i++) {
          Constructor.resolve(entries[i]).then(resolve, reject);
        }
      });
    }
  }

  /**
    `Promise.reject` returns a promise rejected with the passed `reason`.
    It is shorthand for the following:
  
    ```javascript
    let promise = new Promise(function(resolve, reject){
      reject(new Error('WHOOPS'));
    });
  
    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```
  
    Instead of writing the above, your code now simply becomes the following:
  
    ```javascript
    let promise = Promise.reject(new Error('WHOOPS'));
  
    promise.then(function(value){
      // Code here doesn't run because the promise is rejected!
    }, function(reason){
      // reason.message === 'WHOOPS'
    });
    ```
  
    @method reject
    @static
    @param {Any} reason value that the returned promise will be rejected with.
    Useful for tooling.
    @return {Promise} a promise rejected with the given `reason`.
  */
  function reject(reason) {
    /*jshint validthis:true */
    var Constructor = this;
    var promise = new Constructor(noop);
    _reject(promise, reason);
    return promise;
  }

  function needsResolver() {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }

  function needsNew() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  /**
    Promise objects represent the eventual result of an asynchronous operation. The
    primary way of interacting with a promise is through its `then` method, which
    registers callbacks to receive either a promise's eventual value or the reason
    why the promise cannot be fulfilled.
  
    Terminology
    -----------
  
    - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
    - `thenable` is an object or function that defines a `then` method.
    - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
    - `exception` is a value that is thrown using the throw statement.
    - `reason` is a value that indicates why a promise was rejected.
    - `settled` the final resting state of a promise, fulfilled or rejected.
  
    A promise can be in one of three states: pending, fulfilled, or rejected.
  
    Promises that are fulfilled have a fulfillment value and are in the fulfilled
    state.  Promises that are rejected have a rejection reason and are in the
    rejected state.  A fulfillment value is never a thenable.
  
    Promises can also be said to *resolve* a value.  If this value is also a
    promise, then the original promise's settled state will match the value's
    settled state.  So a promise that *resolves* a promise that rejects will
    itself reject, and a promise that *resolves* a promise that fulfills will
    itself fulfill.
  
  
    Basic Usage:
    ------------
  
    ```js
    let promise = new Promise(function(resolve, reject) {
      // on success
      resolve(value);
  
      // on failure
      reject(reason);
    });
  
    promise.then(function(value) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
  
    Advanced Usage:
    ---------------
  
    Promises shine when abstracting away asynchronous interactions such as
    `XMLHttpRequest`s.
  
    ```js
    function getJSON(url) {
      return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();
  
        xhr.open('GET', url);
        xhr.onreadystatechange = handler;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send();
  
        function handler() {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              resolve(this.response);
            } else {
              reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
            }
          }
        };
      });
    }
  
    getJSON('/posts.json').then(function(json) {
      // on fulfillment
    }, function(reason) {
      // on rejection
    });
    ```
  
    Unlike callbacks, promises are great composable primitives.
  
    ```js
    Promise.all([
      getJSON('/posts'),
      getJSON('/comments')
    ]).then(function(values){
      values[0] // => postsJSON
      values[1] // => commentsJSON
  
      return values;
    });
    ```
  
    @class Promise
    @param {function} resolver
    Useful for tooling.
    @constructor
  */
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  Promise.all = all;
  Promise.race = race;
  Promise.resolve = resolve;
  Promise.reject = reject;
  Promise._setScheduler = setScheduler;
  Promise._setAsap = setAsap;
  Promise._asap = asap;

  Promise.prototype = {
    constructor: Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.
    
      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```
    
      Chaining
      --------
    
      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.
    
      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });
    
      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
    
      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```
    
      Assimilation
      ------------
    
      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.
    
      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```
    
      If the assimliated promise rejects, then the downstream promise will also reject.
    
      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```
    
      Simple Example
      --------------
    
      Synchronous Example
    
      ```javascript
      let result;
    
      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```
    
      Errback Example
    
      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```
    
      Promise Example;
    
      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```
    
      Advanced Example
      --------------
    
      Synchronous Example
    
      ```javascript
      let author, books;
    
      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```
    
      Errback Example
    
      ```js
    
      function foundBooks(books) {
    
      }
    
      function failure(reason) {
    
      }
    
      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```
    
      Promise Example;
    
      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```
    
      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
    then: then,

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.
    
      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }
    
      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }
    
      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```
    
      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
    'catch': function _catch(onRejection) {
      return this.then(null, onRejection);
    }
  };

  function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
      local = global;
    } else if (typeof self !== 'undefined') {
      local = self;
    } else {
      try {
        local = Function('return this')();
      } catch (e) {
        throw new Error('polyfill failed because global object is unavailable in this environment');
      }
    }

    var P = local.Promise;

    if (P) {
      var promiseToString = null;
      try {
        promiseToString = Object.prototype.toString.call(P.resolve());
      } catch (e) {
        // silently ignored
      }

      if (promiseToString === '[object Promise]' && !P.cast) {
        return;
      }
    }

    local.Promise = Promise;
  }

  // Strange compat..
  Promise.polyfill = polyfill;
  Promise.Promise = Promise;

  return Promise;
});
//# sourceMappingURL=es6-promise.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/process/browser.js"), __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/foreach/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach(obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};

/***/ }),

/***/ "../node_modules/function-bind/implementation.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function binder() {
        if (this instanceof bound) {
            var result = target.apply(this, args.concat(slice.call(arguments)));
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(that, args.concat(slice.call(arguments)));
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

/***/ }),

/***/ "../node_modules/function-bind/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var implementation = __webpack_require__("../node_modules/function-bind/implementation.js");

module.exports = Function.prototype.bind || implementation;

/***/ }),

/***/ "../node_modules/has/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__("../node_modules/function-bind/index.js");

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

/***/ }),

/***/ "../node_modules/idom-util/src/button.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'button');

/***/ }),

/***/ "../node_modules/idom-util/src/div.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'div');

/***/ }),

/***/ "../node_modules/idom-util/src/element.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _incrementalDom = __webpack_require__("../node_modules/incremental-dom/dist/incremental-dom-cjs.js");

exports.default = function (tagName) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var renderContent = args.pop();

  _incrementalDom.elementOpen.apply(undefined, [tagName].concat(args));
  typeof renderContent === 'function' && renderContent();
  (0, _incrementalDom.elementClose)(tagName);
};

/***/ }),

/***/ "../node_modules/idom-util/src/h3.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'h3');

/***/ }),

/***/ "../node_modules/idom-util/src/image.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _incrementalDom = __webpack_require__("../node_modules/incremental-dom/dist/incremental-dom-cjs.js");

exports.default = function (src) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var key = args.shift();
  var staticProperties = args.shift();

  return _incrementalDom.elementVoid.apply(undefined, ['img', key, staticProperties, 'src', src].concat(args));
};

/***/ }),

/***/ "../node_modules/idom-util/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderH3 = exports.renderPre = exports.renderStrong = exports.renderStyle = exports.renderUl = exports.renderLi = exports.renderImage = exports.renderButton = exports.renderSpan = exports.renderDiv = exports.renderElement = undefined;

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

var _div = __webpack_require__("../node_modules/idom-util/src/div.js");

var _div2 = _interopRequireDefault(_div);

var _span = __webpack_require__("../node_modules/idom-util/src/span.js");

var _span2 = _interopRequireDefault(_span);

var _button = __webpack_require__("../node_modules/idom-util/src/button.js");

var _button2 = _interopRequireDefault(_button);

var _image = __webpack_require__("../node_modules/idom-util/src/image.js");

var _image2 = _interopRequireDefault(_image);

var _li = __webpack_require__("../node_modules/idom-util/src/li.js");

var _li2 = _interopRequireDefault(_li);

var _ul = __webpack_require__("../node_modules/idom-util/src/ul.js");

var _ul2 = _interopRequireDefault(_ul);

var _style = __webpack_require__("../node_modules/idom-util/src/style.js");

var _style2 = _interopRequireDefault(_style);

var _strong = __webpack_require__("../node_modules/idom-util/src/strong.js");

var _strong2 = _interopRequireDefault(_strong);

var _pre = __webpack_require__("../node_modules/idom-util/src/pre.js");

var _pre2 = _interopRequireDefault(_pre);

var _h = __webpack_require__("../node_modules/idom-util/src/h3.js");

var _h2 = _interopRequireDefault(_h);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.renderElement = _element2.default;
exports.renderDiv = _div2.default;
exports.renderSpan = _span2.default;
exports.renderButton = _button2.default;
exports.renderImage = _image2.default;
exports.renderLi = _li2.default;
exports.renderUl = _ul2.default;
exports.renderStyle = _style2.default;
exports.renderStrong = _strong2.default;
exports.renderPre = _pre2.default;
exports.renderH3 = _h2.default;

/***/ }),

/***/ "../node_modules/idom-util/src/li.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'li');

/***/ }),

/***/ "../node_modules/idom-util/src/pre.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'pre');

/***/ }),

/***/ "../node_modules/idom-util/src/span.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'span');

/***/ }),

/***/ "../node_modules/idom-util/src/strong.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'strong');

/***/ }),

/***/ "../node_modules/idom-util/src/style.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

var _incrementalDom = __webpack_require__("../node_modules/incremental-dom/dist/incremental-dom-cjs.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (style) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return _element2.default.apply(undefined, ['style'].concat(args, [_incrementalDom.text.bind(null, style)]));
};

/***/ }),

/***/ "../node_modules/idom-util/src/ul.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__("../node_modules/idom-util/src/element.js");

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _element2.default.bind(null, 'ul');

/***/ }),

/***/ "../node_modules/incremental-dom/dist/incremental-dom-cjs.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
/**
 * @license
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A cached reference to the hasOwnProperty function.
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * A constructor function that will create blank objects.
 * @constructor
 */
function Blank() {}

Blank.prototype = Object.create(null);

/**
 * Used to prevent property collisions between our "map" and its prototype.
 * @param {!Object<string, *>} map The map to check.
 * @param {string} property The property to check.
 * @return {boolean} Whether map has property.
 */
var has = function has(map, property) {
  return hasOwnProperty.call(map, property);
};

/**
 * Creates an map object without a prototype.
 * @return {!Object}
 */
var createMap = function createMap() {
  return new Blank();
};

/**
 * Keeps track of information needed to perform diffs for a given DOM node.
 * @param {!string} nodeName
 * @param {?string=} key
 * @constructor
 */
function NodeData(nodeName, key) {
  /**
   * The attributes and their values.
   * @const {!Object<string, *>}
   */
  this.attrs = createMap();

  /**
   * An array of attribute name/value pairs, used for quickly diffing the
   * incomming attributes to see if the DOM node's attributes need to be
   * updated.
   * @const {Array<*>}
   */
  this.attrsArr = [];

  /**
   * The incoming attributes for this Node, before they are updated.
   * @const {!Object<string, *>}
   */
  this.newAttrs = createMap();

  /**
   * Whether or not the statics have been applied for the node yet.
   * {boolean}
   */
  this.staticsApplied = false;

  /**
   * The key used to identify this node, used to preserve DOM nodes when they
   * move within their parent.
   * @const
   */
  this.key = key;

  /**
   * Keeps track of children within this node by their key.
   * {!Object<string, !Element>}
   */
  this.keyMap = createMap();

  /**
   * Whether or not the keyMap is currently valid.
   * @type {boolean}
   */
  this.keyMapValid = true;

  /**
   * Whether or the associated node is, or contains, a focused Element.
   * @type {boolean}
   */
  this.focused = false;

  /**
   * The node name for this node.
   * @const {string}
   */
  this.nodeName = nodeName;

  /**
   * @type {?string}
   */
  this.text = null;
}

/**
 * Initializes a NodeData object for a Node.
 *
 * @param {Node} node The node to initialize data for.
 * @param {string} nodeName The node name of node.
 * @param {?string=} key The key that identifies the node.
 * @return {!NodeData} The newly initialized data object
 */
var initData = function initData(node, nodeName, key) {
  var data = new NodeData(nodeName, key);
  node['__incrementalDOMData'] = data;
  return data;
};

/**
 * Retrieves the NodeData object for a Node, creating it if necessary.
 *
 * @param {?Node} node The Node to retrieve the data for.
 * @return {!NodeData} The NodeData for this Node.
 */
var getData = function getData(node) {
  importNode(node);
  return node['__incrementalDOMData'];
};

/**
 * Imports node and its subtree, initializing caches.
 *
 * @param {?Node} node The Node to import.
 */
var importNode = function importNode(node) {
  if (node['__incrementalDOMData']) {
    return;
  }

  var isElement = node instanceof Element;
  var nodeName = isElement ? node.localName : node.nodeName;
  var key = isElement ? node.getAttribute('key') : null;
  var data = initData(node, nodeName, key);

  if (key) {
    getData(node.parentNode).keyMap[key] = node;
  }

  if (isElement) {
    var attributes = node.attributes;
    var attrs = data.attrs;
    var newAttrs = data.newAttrs;
    var attrsArr = data.attrsArr;

    for (var i = 0; i < attributes.length; i += 1) {
      var attr = attributes[i];
      var name = attr.name;
      var value = attr.value;

      attrs[name] = value;
      newAttrs[name] = undefined;
      attrsArr.push(name);
      attrsArr.push(value);
    }
  }

  for (var child = node.firstChild; child; child = child.nextSibling) {
    importNode(child);
  }
};

/**
 * Gets the namespace to create an element (of a given tag) in.
 * @param {string} tag The tag to get the namespace for.
 * @param {?Node} parent
 * @return {?string} The namespace to create the tag in.
 */
var getNamespaceForTag = function getNamespaceForTag(tag, parent) {
  if (tag === 'svg') {
    return 'http://www.w3.org/2000/svg';
  }

  if (getData(parent).nodeName === 'foreignObject') {
    return null;
  }

  return parent.namespaceURI;
};

/**
 * Creates an Element.
 * @param {Document} doc The document with which to create the Element.
 * @param {?Node} parent
 * @param {string} tag The tag for the Element.
 * @param {?string=} key A key to identify the Element.
 * @return {!Element}
 */
var createElement = function createElement(doc, parent, tag, key) {
  var namespace = getNamespaceForTag(tag, parent);
  var el = undefined;

  if (namespace) {
    el = doc.createElementNS(namespace, tag);
  } else {
    el = doc.createElement(tag);
  }

  initData(el, tag, key);

  return el;
};

/**
 * Creates a Text Node.
 * @param {Document} doc The document with which to create the Element.
 * @return {!Text}
 */
var createText = function createText(doc) {
  var node = doc.createTextNode('');
  initData(node, '#text', null);
  return node;
};

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @const */
var notifications = {
  /**
   * Called after patch has compleated with any Nodes that have been created
   * and added to the DOM.
   * @type {?function(Array<!Node>)}
   */
  nodesCreated: null,

  /**
   * Called after patch has compleated with any Nodes that have been removed
   * from the DOM.
   * Note it's an applications responsibility to handle any childNodes.
   * @type {?function(Array<!Node>)}
   */
  nodesDeleted: null
};

/**
 * Keeps track of the state of a patch.
 * @constructor
 */
function Context() {
  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.created = notifications.nodesCreated && [];

  /**
   * @type {(Array<!Node>|undefined)}
   */
  this.deleted = notifications.nodesDeleted && [];
}

/**
 * @param {!Node} node
 */
Context.prototype.markCreated = function (node) {
  if (this.created) {
    this.created.push(node);
  }
};

/**
 * @param {!Node} node
 */
Context.prototype.markDeleted = function (node) {
  if (this.deleted) {
    this.deleted.push(node);
  }
};

/**
 * Notifies about nodes that were created during the patch opearation.
 */
Context.prototype.notifyChanges = function () {
  if (this.created && this.created.length > 0) {
    notifications.nodesCreated(this.created);
  }

  if (this.deleted && this.deleted.length > 0) {
    notifications.nodesDeleted(this.deleted);
  }
};

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
  * Keeps track whether or not we are in an attributes declaration (after
  * elementOpenStart, but before elementOpenEnd).
  * @type {boolean}
  */
var inAttributes = false;

/**
  * Keeps track whether or not we are in an element that should not have its
  * children cleared.
  * @type {boolean}
  */
var inSkip = false;

/**
 * Makes sure that there is a current patch context.
 * @param {string} functionName
 * @param {*} context
 */
var assertInPatch = function assertInPatch(functionName, context) {
  if (!context) {
    throw new Error('Cannot call ' + functionName + '() unless in patch.');
  }
};

/**
 * Makes sure that a patch closes every node that it opened.
 * @param {?Node} openElement
 * @param {!Node|!DocumentFragment} root
 */
var assertNoUnclosedTags = function assertNoUnclosedTags(openElement, root) {
  if (openElement === root) {
    return;
  }

  var currentElement = openElement;
  var openTags = [];
  while (currentElement && currentElement !== root) {
    openTags.push(currentElement.nodeName.toLowerCase());
    currentElement = currentElement.parentNode;
  }

  throw new Error('One or more tags were not closed:\n' + openTags.join('\n'));
};

/**
 * Makes sure that the caller is not where attributes are expected.
 * @param {string} functionName
 */
var assertNotInAttributes = function assertNotInAttributes(functionName) {
  if (inAttributes) {
    throw new Error(functionName + '() can not be called between ' + 'elementOpenStart() and elementOpenEnd().');
  }
};

/**
 * Makes sure that the caller is not inside an element that has declared skip.
 * @param {string} functionName
 */
var assertNotInSkip = function assertNotInSkip(functionName) {
  if (inSkip) {
    throw new Error(functionName + '() may not be called inside an element ' + 'that has called skip().');
  }
};

/**
 * Makes sure that the caller is where attributes are expected.
 * @param {string} functionName
 */
var assertInAttributes = function assertInAttributes(functionName) {
  if (!inAttributes) {
    throw new Error(functionName + '() can only be called after calling ' + 'elementOpenStart().');
  }
};

/**
 * Makes sure the patch closes virtual attributes call
 */
var assertVirtualAttributesClosed = function assertVirtualAttributesClosed() {
  if (inAttributes) {
    throw new Error('elementOpenEnd() must be called after calling ' + 'elementOpenStart().');
  }
};

/**
  * Makes sure that tags are correctly nested.
  * @param {string} nodeName
  * @param {string} tag
  */
var assertCloseMatchesOpenTag = function assertCloseMatchesOpenTag(nodeName, tag) {
  if (nodeName !== tag) {
    throw new Error('Received a call to close "' + tag + '" but "' + nodeName + '" was open.');
  }
};

/**
 * Makes sure that no children elements have been declared yet in the current
 * element.
 * @param {string} functionName
 * @param {?Node} previousNode
 */
var assertNoChildrenDeclaredYet = function assertNoChildrenDeclaredYet(functionName, previousNode) {
  if (previousNode !== null) {
    throw new Error(functionName + '() must come before any child ' + 'declarations inside the current element.');
  }
};

/**
 * Checks that a call to patchOuter actually patched the element.
 * @param {?Node} startNode The value for the currentNode when the patch
 *     started.
 * @param {?Node} currentNode The currentNode when the patch finished.
 * @param {?Node} expectedNextNode The Node that is expected to follow the
 *    currentNode after the patch;
 * @param {?Node} expectedPrevNode The Node that is expected to preceed the
 *    currentNode after the patch.
 */
var assertPatchElementNoExtras = function assertPatchElementNoExtras(startNode, currentNode, expectedNextNode, expectedPrevNode) {
  var wasUpdated = currentNode.nextSibling === expectedNextNode && currentNode.previousSibling === expectedPrevNode;
  var wasChanged = currentNode.nextSibling === startNode.nextSibling && currentNode.previousSibling === expectedPrevNode;
  var wasRemoved = currentNode === startNode;

  if (!wasUpdated && !wasChanged && !wasRemoved) {
    throw new Error('There must be exactly one top level call corresponding ' + 'to the patched element.');
  }
};

/**
 * Updates the state of being in an attribute declaration.
 * @param {boolean} value
 * @return {boolean} the previous value.
 */
var setInAttributes = function setInAttributes(value) {
  var previous = inAttributes;
  inAttributes = value;
  return previous;
};

/**
 * Updates the state of being in a skip element.
 * @param {boolean} value
 * @return {boolean} the previous value.
 */
var setInSkip = function setInSkip(value) {
  var previous = inSkip;
  inSkip = value;
  return previous;
};

/**
 * Copyright 2016 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @param {!Node} node
 * @return {boolean} True if the node the root of a document, false otherwise.
 */
var isDocumentRoot = function isDocumentRoot(node) {
  // For ShadowRoots, check if they are a DocumentFragment instead of if they
  // are a ShadowRoot so that this can work in 'use strict' if ShadowRoots are
  // not supported.
  return node instanceof Document || node instanceof DocumentFragment;
};

/**
 * @param {!Node} node The node to start at, inclusive.
 * @param {?Node} root The root ancestor to get until, exclusive.
 * @return {!Array<!Node>} The ancestry of DOM nodes.
 */
var getAncestry = function getAncestry(node, root) {
  var ancestry = [];
  var cur = node;

  while (cur !== root) {
    ancestry.push(cur);
    cur = cur.parentNode;
  }

  return ancestry;
};

/**
 * @param {!Node} node
 * @return {!Node} The root node of the DOM tree that contains node.
 */
var getRoot = function getRoot(node) {
  var cur = node;
  var prev = cur;

  while (cur) {
    prev = cur;
    cur = cur.parentNode;
  }

  return prev;
};

/**
 * @param {!Node} node The node to get the activeElement for.
 * @return {?Element} The activeElement in the Document or ShadowRoot
 *     corresponding to node, if present.
 */
var getActiveElement = function getActiveElement(node) {
  var root = getRoot(node);
  return isDocumentRoot(root) ? root.activeElement : null;
};

/**
 * Gets the path of nodes that contain the focused node in the same document as
 * a reference node, up until the root.
 * @param {!Node} node The reference node to get the activeElement for.
 * @param {?Node} root The root to get the focused path until.
 * @return {!Array<Node>}
 */
var getFocusedPath = function getFocusedPath(node, root) {
  var activeElement = getActiveElement(node);

  if (!activeElement || !node.contains(activeElement)) {
    return [];
  }

  return getAncestry(activeElement, root);
};

/**
 * Like insertBefore, but instead instead of moving the desired node, instead
 * moves all the other nodes after.
 * @param {?Node} parentNode
 * @param {!Node} node
 * @param {?Node} referenceNode
 */
var moveBefore = function moveBefore(parentNode, node, referenceNode) {
  var insertReferenceNode = node.nextSibling;
  var cur = referenceNode;

  while (cur !== node) {
    var next = cur.nextSibling;
    parentNode.insertBefore(cur, insertReferenceNode);
    cur = next;
  }
};

/** @type {?Context} */
var context = null;

/** @type {?Node} */
var currentNode = null;

/** @type {?Node} */
var currentParent = null;

/** @type {?Document} */
var doc = null;

/**
 * @param {!Array<Node>} focusPath The nodes to mark.
 * @param {boolean} focused Whether or not they are focused.
 */
var markFocused = function markFocused(focusPath, focused) {
  for (var i = 0; i < focusPath.length; i += 1) {
    getData(focusPath[i]).focused = focused;
  }
};

/**
 * Returns a patcher function that sets up and restores a patch context,
 * running the run function with the provided data.
 * @param {function((!Element|!DocumentFragment),!function(T),T=): ?Node} run
 * @return {function((!Element|!DocumentFragment),!function(T),T=): ?Node}
 * @template T
 */
var patchFactory = function patchFactory(run) {
  /**
   * TODO(moz): These annotations won't be necessary once we switch to Closure
   * Compiler's new type inference. Remove these once the switch is done.
   *
   * @param {(!Element|!DocumentFragment)} node
   * @param {!function(T)} fn
   * @param {T=} data
   * @return {?Node} node
   * @template T
   */
  var f = function f(node, fn, data) {
    var prevContext = context;
    var prevDoc = doc;
    var prevCurrentNode = currentNode;
    var prevCurrentParent = currentParent;
    var previousInAttributes = false;
    var previousInSkip = false;

    context = new Context();
    doc = node.ownerDocument;
    currentParent = node.parentNode;

    if (process.env.NODE_ENV !== 'production') {
      previousInAttributes = setInAttributes(false);
      previousInSkip = setInSkip(false);
    }

    var focusPath = getFocusedPath(node, currentParent);
    markFocused(focusPath, true);
    var retVal = run(node, fn, data);
    markFocused(focusPath, false);

    if (process.env.NODE_ENV !== 'production') {
      assertVirtualAttributesClosed();
      setInAttributes(previousInAttributes);
      setInSkip(previousInSkip);
    }

    context.notifyChanges();

    context = prevContext;
    doc = prevDoc;
    currentNode = prevCurrentNode;
    currentParent = prevCurrentParent;

    return retVal;
  };
  return f;
};

/**
 * Patches the document starting at node with the provided function. This
 * function may be called during an existing patch operation.
 * @param {!Element|!DocumentFragment} node The Element or Document
 *     to patch.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @return {!Node} The patched node.
 * @template T
 */
var patchInner = patchFactory(function (node, fn, data) {
  currentNode = node;

  enterNode();
  fn(data);
  exitNode();

  if (process.env.NODE_ENV !== 'production') {
    assertNoUnclosedTags(currentNode, node);
  }

  return node;
});

/**
 * Patches an Element with the the provided function. Exactly one top level
 * element call should be made corresponding to `node`.
 * @param {!Element} node The Element where the patch should start.
 * @param {!function(T)} fn A function containing elementOpen/elementClose/etc.
 *     calls that describe the DOM. This should have at most one top level
 *     element call.
 * @param {T=} data An argument passed to fn to represent DOM state.
 * @return {?Node} The node if it was updated, its replacedment or null if it
 *     was removed.
 * @template T
 */
var patchOuter = patchFactory(function (node, fn, data) {
  var startNode = /** @type {!Element} */{ nextSibling: node };
  var expectedNextNode = null;
  var expectedPrevNode = null;

  if (process.env.NODE_ENV !== 'production') {
    expectedNextNode = node.nextSibling;
    expectedPrevNode = node.previousSibling;
  }

  currentNode = startNode;
  fn(data);

  if (process.env.NODE_ENV !== 'production') {
    assertPatchElementNoExtras(startNode, currentNode, expectedNextNode, expectedPrevNode);
  }

  if (node !== currentNode && node.parentNode) {
    removeChild(currentParent, node, getData(currentParent).keyMap);
  }

  return startNode === currentNode ? null : currentNode;
});

/**
 * Checks whether or not the current node matches the specified nodeName and
 * key.
 *
 * @param {!Node} matchNode A node to match the data to.
 * @param {?string} nodeName The nodeName for this node.
 * @param {?string=} key An optional key that identifies a node.
 * @return {boolean} True if the node matches, false otherwise.
 */
var matches = function matches(matchNode, nodeName, key) {
  var data = getData(matchNode);

  // Key check is done using double equals as we want to treat a null key the
  // same as undefined. This should be okay as the only values allowed are
  // strings, null and undefined so the == semantics are not too weird.
  return nodeName === data.nodeName && key == data.key;
};

/**
 * Aligns the virtual Element definition with the actual DOM, moving the
 * corresponding DOM node to the correct location or creating it if necessary.
 * @param {string} nodeName For an Element, this should be a valid tag string.
 *     For a Text, this should be #text.
 * @param {?string=} key The key used to identify this element.
 */
var alignWithDOM = function alignWithDOM(nodeName, key) {
  if (currentNode && matches(currentNode, nodeName, key)) {
    return;
  }

  var parentData = getData(currentParent);
  var currentNodeData = currentNode && getData(currentNode);
  var keyMap = parentData.keyMap;
  var node = undefined;

  // Check to see if the node has moved within the parent.
  if (key) {
    var keyNode = keyMap[key];
    if (keyNode) {
      if (matches(keyNode, nodeName, key)) {
        node = keyNode;
      } else if (keyNode === currentNode) {
        context.markDeleted(keyNode);
      } else {
        removeChild(currentParent, keyNode, keyMap);
      }
    }
  }

  // Create the node if it doesn't exist.
  if (!node) {
    if (nodeName === '#text') {
      node = createText(doc);
    } else {
      node = createElement(doc, currentParent, nodeName, key);
    }

    if (key) {
      keyMap[key] = node;
    }

    context.markCreated(node);
  }

  // Re-order the node into the right position, preserving focus if either
  // node or currentNode are focused by making sure that they are not detached
  // from the DOM.
  if (getData(node).focused) {
    // Move everything else before the node.
    moveBefore(currentParent, node, currentNode);
  } else if (currentNodeData && currentNodeData.key && !currentNodeData.focused) {
    // Remove the currentNode, which can always be added back since we hold a
    // reference through the keyMap. This prevents a large number of moves when
    // a keyed item is removed or moved backwards in the DOM.
    currentParent.replaceChild(node, currentNode);
    parentData.keyMapValid = false;
  } else {
    currentParent.insertBefore(node, currentNode);
  }

  currentNode = node;
};

/**
 * @param {?Node} node
 * @param {?Node} child
 * @param {?Object<string, !Element>} keyMap
 */
var removeChild = function removeChild(node, child, keyMap) {
  node.removeChild(child);
  context.markDeleted( /** @type {!Node}*/child);

  var key = getData(child).key;
  if (key) {
    delete keyMap[key];
  }
};

/**
 * Clears out any unvisited Nodes, as the corresponding virtual element
 * functions were never called for them.
 */
var clearUnvisitedDOM = function clearUnvisitedDOM() {
  var node = currentParent;
  var data = getData(node);
  var keyMap = data.keyMap;
  var keyMapValid = data.keyMapValid;
  var child = node.lastChild;
  var key = undefined;

  if (child === currentNode && keyMapValid) {
    return;
  }

  while (child !== currentNode) {
    removeChild(node, child, keyMap);
    child = node.lastChild;
  }

  // Clean the keyMap, removing any unusued keys.
  if (!keyMapValid) {
    for (key in keyMap) {
      child = keyMap[key];
      if (child.parentNode !== node) {
        context.markDeleted(child);
        delete keyMap[key];
      }
    }

    data.keyMapValid = true;
  }
};

/**
 * Changes to the first child of the current node.
 */
var enterNode = function enterNode() {
  currentParent = currentNode;
  currentNode = null;
};

/**
 * @return {?Node} The next Node to be patched.
 */
var getNextNode = function getNextNode() {
  if (currentNode) {
    return currentNode.nextSibling;
  } else {
    return currentParent.firstChild;
  }
};

/**
 * Changes to the next sibling of the current node.
 */
var nextNode = function nextNode() {
  currentNode = getNextNode();
};

/**
 * Changes to the parent of the current node, removing any unvisited children.
 */
var exitNode = function exitNode() {
  clearUnvisitedDOM();

  currentNode = currentParent;
  currentParent = currentParent.parentNode;
};

/**
 * Makes sure that the current node is an Element with a matching tagName and
 * key.
 *
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @return {!Element} The corresponding Element.
 */
var coreElementOpen = function coreElementOpen(tag, key) {
  nextNode();
  alignWithDOM(tag, key);
  enterNode();
  return (/** @type {!Element} */currentParent
  );
};

/**
 * Closes the currently open Element, removing any unvisited children if
 * necessary.
 *
 * @return {!Element} The corresponding Element.
 */
var coreElementClose = function coreElementClose() {
  if (process.env.NODE_ENV !== 'production') {
    setInSkip(false);
  }

  exitNode();
  return (/** @type {!Element} */currentNode
  );
};

/**
 * Makes sure the current node is a Text node and creates a Text node if it is
 * not.
 *
 * @return {!Text} The corresponding Text Node.
 */
var coreText = function coreText() {
  nextNode();
  alignWithDOM('#text', null);
  return (/** @type {!Text} */currentNode
  );
};

/**
 * Gets the current Element being patched.
 * @return {!Element}
 */
var currentElement = function currentElement() {
  if (process.env.NODE_ENV !== 'production') {
    assertInPatch('currentElement', context);
    assertNotInAttributes('currentElement');
  }
  return (/** @type {!Element} */currentParent
  );
};

/**
 * @return {Node} The Node that will be evaluated for the next instruction.
 */
var currentPointer = function currentPointer() {
  if (process.env.NODE_ENV !== 'production') {
    assertInPatch('currentPointer', context);
    assertNotInAttributes('currentPointer');
  }
  return getNextNode();
};

/**
 * Skips the children in a subtree, allowing an Element to be closed without
 * clearing out the children.
 */
var skip = function skip() {
  if (process.env.NODE_ENV !== 'production') {
    assertNoChildrenDeclaredYet('skip', currentNode);
    setInSkip(true);
  }
  currentNode = currentParent.lastChild;
};

/**
 * Skips the next Node to be patched, moving the pointer forward to the next
 * sibling of the current pointer.
 */
var skipNode = nextNode;

/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @const */
var symbols = {
  default: '__default'
};

/**
 * @param {string} name
 * @return {string|undefined} The namespace to use for the attribute.
 */
var getNamespace = function getNamespace(name) {
  if (name.lastIndexOf('xml:', 0) === 0) {
    return 'http://www.w3.org/XML/1998/namespace';
  }

  if (name.lastIndexOf('xlink:', 0) === 0) {
    return 'http://www.w3.org/1999/xlink';
  }
};

/**
 * Applies an attribute or property to a given Element. If the value is null
 * or undefined, it is removed from the Element. Otherwise, the value is set
 * as an attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {?(boolean|number|string)=} value The attribute's value.
 */
var applyAttr = function applyAttr(el, name, value) {
  if (value == null) {
    el.removeAttribute(name);
  } else {
    var attrNS = getNamespace(name);
    if (attrNS) {
      el.setAttributeNS(attrNS, name, value);
    } else {
      el.setAttribute(name, value);
    }
  }
};

/**
 * Applies a property to a given Element.
 * @param {!Element} el
 * @param {string} name The property's name.
 * @param {*} value The property's value.
 */
var applyProp = function applyProp(el, name, value) {
  el[name] = value;
};

/**
 * Applies a value to a style declaration. Supports CSS custom properties by
 * setting properties containing a dash using CSSStyleDeclaration.setProperty.
 * @param {CSSStyleDeclaration} style
 * @param {!string} prop
 * @param {*} value
 */
var setStyleValue = function setStyleValue(style, prop, value) {
  if (prop.indexOf('-') >= 0) {
    style.setProperty(prop, /** @type {string} */value);
  } else {
    style[prop] = value;
  }
};

/**
 * Applies a style to an Element. No vendor prefix expansion is done for
 * property names/values.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} style The style to set. Either a string of css or an object
 *     containing property-value pairs.
 */
var applyStyle = function applyStyle(el, name, style) {
  if (typeof style === 'string') {
    el.style.cssText = style;
  } else {
    el.style.cssText = '';
    var elStyle = el.style;
    var obj = /** @type {!Object<string,string>} */style;

    for (var prop in obj) {
      if (has(obj, prop)) {
        setStyleValue(elStyle, prop, obj[prop]);
      }
    }
  }
};

/**
 * Updates a single attribute on an Element.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value. If the value is an object or
 *     function it is set on the Element, otherwise, it is set as an HTML
 *     attribute.
 */
var applyAttributeTyped = function applyAttributeTyped(el, name, value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

  if (type === 'object' || type === 'function') {
    applyProp(el, name, value);
  } else {
    applyAttr(el, name, /** @type {?(boolean|number|string)} */value);
  }
};

/**
 * Calls the appropriate attribute mutator for this attribute.
 * @param {!Element} el
 * @param {string} name The attribute's name.
 * @param {*} value The attribute's value.
 */
var updateAttribute = function updateAttribute(el, name, value) {
  var data = getData(el);
  var attrs = data.attrs;

  if (attrs[name] === value) {
    return;
  }

  var mutator = attributes[name] || attributes[symbols.default];
  mutator(el, name, value);

  attrs[name] = value;
};

/**
 * A publicly mutable object to provide custom mutators for attributes.
 * @const {!Object<string, function(!Element, string, *)>}
 */
var attributes = createMap();

// Special generic mutator that's called for any attribute that does not
// have a specific mutator.
attributes[symbols.default] = applyAttributeTyped;

attributes['style'] = applyStyle;

/**
 * The offset in the virtual element declaration where the attributes are
 * specified.
 * @const
 */
var ATTRIBUTES_OFFSET = 3;

/**
 * Builds an array of arguments for use with elementOpenStart, attr and
 * elementOpenEnd.
 * @const {Array<*>}
 */
var argsBuilder = [];

/**
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args, Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
var elementOpen = function elementOpen(tag, key, statics, var_args) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('elementOpen');
    assertNotInSkip('elementOpen');
  }

  var node = coreElementOpen(tag, key);
  var data = getData(node);

  if (!data.staticsApplied) {
    if (statics) {
      for (var _i = 0; _i < statics.length; _i += 2) {
        var name = /** @type {string} */statics[_i];
        var value = statics[_i + 1];
        updateAttribute(node, name, value);
      }
    }
    // Down the road, we may want to keep track of the statics array to use it
    // as an additional signal about whether a node matches or not. For now,
    // just use a marker so that we do not reapply statics.
    data.staticsApplied = true;
  }

  /*
   * Checks to see if one or more attributes have changed for a given Element.
   * When no attributes have changed, this is much faster than checking each
   * individual argument. When attributes have changed, the overhead of this is
   * minimal.
   */
  var attrsArr = data.attrsArr;
  var newAttrs = data.newAttrs;
  var isNew = !attrsArr.length;
  var i = ATTRIBUTES_OFFSET;
  var j = 0;

  for (; i < arguments.length; i += 2, j += 2) {
    var _attr = arguments[i];
    if (isNew) {
      attrsArr[j] = _attr;
      newAttrs[_attr] = undefined;
    } else if (attrsArr[j] !== _attr) {
      break;
    }

    var value = arguments[i + 1];
    if (isNew || attrsArr[j + 1] !== value) {
      attrsArr[j + 1] = value;
      updateAttribute(node, _attr, value);
    }
  }

  if (i < arguments.length || j < attrsArr.length) {
    for (; i < arguments.length; i += 1, j += 1) {
      attrsArr[j] = arguments[i];
    }

    if (j < attrsArr.length) {
      attrsArr.length = j;
    }

    /*
     * Actually perform the attribute update.
     */
    for (i = 0; i < attrsArr.length; i += 2) {
      var name = /** @type {string} */attrsArr[i];
      var value = attrsArr[i + 1];
      newAttrs[name] = value;
    }

    for (var _attr2 in newAttrs) {
      updateAttribute(node, _attr2, newAttrs[_attr2]);
      newAttrs[_attr2] = undefined;
    }
  }

  return node;
};

/**
 * Declares a virtual Element at the current location in the document. This
 * corresponds to an opening tag and a elementClose tag is required. This is
 * like elementOpen, but the attributes are defined using the attr function
 * rather than being passed as arguments. Must be folllowed by 0 or more calls
 * to attr, then a call to elementOpenEnd.
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 */
var elementOpenStart = function elementOpenStart(tag, key, statics) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('elementOpenStart');
    setInAttributes(true);
  }

  argsBuilder[0] = tag;
  argsBuilder[1] = key;
  argsBuilder[2] = statics;
};

/***
 * Defines a virtual attribute at this point of the DOM. This is only valid
 * when called between elementOpenStart and elementOpenEnd.
 *
 * @param {string} name
 * @param {*} value
 */
var attr = function attr(name, value) {
  if (process.env.NODE_ENV !== 'production') {
    assertInAttributes('attr');
  }

  argsBuilder.push(name);
  argsBuilder.push(value);
};

/**
 * Closes an open tag started with elementOpenStart.
 * @return {!Element} The corresponding Element.
 */
var elementOpenEnd = function elementOpenEnd() {
  if (process.env.NODE_ENV !== 'production') {
    assertInAttributes('elementOpenEnd');
    setInAttributes(false);
  }

  var node = elementOpen.apply(null, argsBuilder);
  argsBuilder.length = 0;
  return node;
};

/**
 * Closes an open virtual Element.
 *
 * @param {string} tag The element's tag.
 * @return {!Element} The corresponding Element.
 */
var elementClose = function elementClose(tag) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('elementClose');
  }

  var node = coreElementClose();

  if (process.env.NODE_ENV !== 'production') {
    assertCloseMatchesOpenTag(getData(node).nodeName, tag);
  }

  return node;
};

/**
 * Declares a virtual Element at the current location in the document that has
 * no children.
 * @param {string} tag The element's tag.
 * @param {?string=} key The key used to identify this element. This can be an
 *     empty string, but performance may be better if a unique value is used
 *     when iterating over an array of items.
 * @param {?Array<*>=} statics An array of attribute name/value pairs of the
 *     static attributes for the Element. These will only be set once when the
 *     Element is created.
 * @param {...*} var_args Attribute name/value pairs of the dynamic attributes
 *     for the Element.
 * @return {!Element} The corresponding Element.
 */
var elementVoid = function elementVoid(tag, key, statics, var_args) {
  elementOpen.apply(null, arguments);
  return elementClose(tag);
};

/**
 * Declares a virtual Text at this point in the document.
 *
 * @param {string|number|boolean} value The value of the Text.
 * @param {...(function((string|number|boolean)):string)} var_args
 *     Functions to format the value which are called only when the value has
 *     changed.
 * @return {!Text} The corresponding text node.
 */
var text = function text(value, var_args) {
  if (process.env.NODE_ENV !== 'production') {
    assertNotInAttributes('text');
    assertNotInSkip('text');
  }

  var node = coreText();
  var data = getData(node);

  if (data.text !== value) {
    data.text = /** @type {string} */value;

    var formatted = value;
    for (var i = 1; i < arguments.length; i += 1) {
      /*
       * Call the formatter function directly to prevent leaking arguments.
       * https://github.com/google/incremental-dom/pull/204#issuecomment-178223574
       */
      var fn = arguments[i];
      formatted = fn(formatted);
    }

    node.data = formatted;
  }

  return node;
};

exports.patch = patchInner;
exports.patchInner = patchInner;
exports.patchOuter = patchOuter;
exports.currentElement = currentElement;
exports.currentPointer = currentPointer;
exports.skip = skip;
exports.skipNode = skipNode;
exports.elementVoid = elementVoid;
exports.elementOpenStart = elementOpenStart;
exports.elementOpenEnd = elementOpenEnd;
exports.elementOpen = elementOpen;
exports.elementClose = elementClose;
exports.text = text;
exports.attr = attr;
exports.symbols = symbols;
exports.attributes = attributes;
exports.applyAttr = applyAttr;
exports.applyProp = applyProp;
exports.notifications = notifications;
exports.importNode = importNode;

//# sourceMappingURL=incremental-dom-cjs.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/process/browser.js")))

/***/ }),

/***/ "../node_modules/is-callable/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var fnToStr = Function.prototype.toString;

var constructorRegex = /^\s*class /;
var isES6ClassFn = function isES6ClassFn(value) {
	try {
		var fnStr = fnToStr.call(value);
		var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
		var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
		var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
		return constructorRegex.test(spaceStripped);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionObject(value) {
	try {
		if (isES6ClassFn(value)) {
			return false;
		}
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && _typeof(Symbol.toStringTag) === 'symbol';

module.exports = function isCallable(value) {
	if (!value) {
		return false;
	}
	if (typeof value !== 'function' && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
		return false;
	}
	if (hasToStringTag) {
		return tryFunctionObject(value);
	}
	if (isES6ClassFn(value)) {
		return false;
	}
	var strClass = toStr.call(value);
	return strClass === fnClass || strClass === genClass;
};

/***/ }),

/***/ "../node_modules/is-date-object/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateObject(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = typeof Symbol === 'function' && _typeof(Symbol.toStringTag) === 'symbol';

module.exports = function isDateObject(value) {
	if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' || value === null) {
		return false;
	}
	return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};

/***/ }),

/***/ "../node_modules/is-regex/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var has = __webpack_require__("../node_modules/has/src/index.js");
var regexExec = RegExp.prototype.exec;
var gOPD = Object.getOwnPropertyDescriptor;

var tryRegexExecCall = function tryRegexExec(value) {
	try {
		var lastIndex = value.lastIndex;
		value.lastIndex = 0;

		regexExec.call(value);
		return true;
	} catch (e) {
		return false;
	} finally {
		value.lastIndex = lastIndex;
	}
};
var toStr = Object.prototype.toString;
var regexClass = '[object RegExp]';
var hasToStringTag = typeof Symbol === 'function' && _typeof(Symbol.toStringTag) === 'symbol';

module.exports = function isRegex(value) {
	if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
		return false;
	}
	if (!hasToStringTag) {
		return toStr.call(value) === regexClass;
	}

	var descriptor = gOPD(value, 'lastIndex');
	var hasLastIndexDataProperty = descriptor && has(descriptor, 'value');
	if (!hasLastIndexDataProperty) {
		return false;
	}

	return tryRegexExecCall(value);
};

/***/ }),

/***/ "../node_modules/is-symbol/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && _typeof(Symbol()) === 'symbol';

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isSymbolObject(value) {
		if (_typeof(value.valueOf()) !== 'symbol') {
			return false;
		}
		return symStringRegex.test(symToStr.call(value));
	};
	module.exports = function isSymbol(value) {
		if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'symbol') {
			return true;
		}
		if (toStr.call(value) !== '[object Symbol]') {
			return false;
		}
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {
	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return false;
	};
}

/***/ }),

/***/ "../node_modules/lodash.isequal/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = ( false ? 'undefined' : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && ( false ? 'undefined' : _typeof(module)) == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = function () {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}();

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    _Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map || ListCache)(),
    'string': new Hash()
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache();
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache();
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (
    // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' ||
    // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') ||
    // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') ||
    // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack());
    return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack());
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function (othValue, othIndex) {
        if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == other + '';

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function (object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function (symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
  getTag = function getTag(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;
        case mapCtorString:
          return mapTag;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag;
        case weakMapCtorString:
          return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;

  return value === proto;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return func + '';
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function () {
  return arguments;
}()) ? baseIsArguments : function (value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEqual;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js"), __webpack_require__("../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "../node_modules/lodash.throttle/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function now() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

module.exports = throttle;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../node_modules/object-keys/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// modified from https://github.com/es-shims/es5-shim

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = __webpack_require__("../node_modules/object-keys/isArguments.js");
var isEnumerable = Object.prototype.propertyIsEnumerable;
var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
var equalsConstructorPrototype = function equalsConstructorPrototype(o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var excludedKeys = {
	$console: true,
	$external: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$innerHeight: true,
	$innerWidth: true,
	$outerHeight: true,
	$outerWidth: true,
	$pageXOffset: true,
	$pageYOffset: true,
	$parent: true,
	$scrollLeft: true,
	$scrollTop: true,
	$scrollX: true,
	$scrollY: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = function () {
	/* global window */
	if (typeof window === 'undefined') {
		return false;
	}
	for (var k in window) {
		try {
			if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && _typeof(window[k]) === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}();
var equalsConstructorPrototypeIfNotBuggy = function equalsConstructorPrototypeIfNotBuggy(o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2);
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

/***/ }),

/***/ "../node_modules/object-keys/isArguments.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' && value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

/***/ }),

/***/ "../node_modules/object.assign/hasSymbols.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var keys = __webpack_require__("../node_modules/object-keys/index.js");

module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
		return false;
	}
	if (_typeof(Symbol.iterator) === 'symbol') {
		return true;
	}

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') {
		return false;
	}

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
		return false;
	}
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
		return false;
	}

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) {
		return false;
	}
	if (keys(obj).length !== 0) {
		return false;
	}
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
		return false;
	}

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
		return false;
	}

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) {
		return false;
	}

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
		return false;
	}

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) {
			return false;
		}
	}

	return true;
};

/***/ }),

/***/ "../node_modules/object.assign/implementation.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// modified from https://github.com/es-shims/es6-shim

var keys = __webpack_require__("../node_modules/object-keys/index.js");
var bind = __webpack_require__("../node_modules/function-bind/index.js");
var canBeObject = function canBeObject(obj) {
	return typeof obj !== 'undefined' && obj !== null;
};
var hasSymbols = __webpack_require__("../node_modules/object.assign/hasSymbols.js")();
var toObject = Object;
var push = bind.call(Function.call, Array.prototype.push);
var propIsEnumerable = bind.call(Function.call, Object.prototype.propertyIsEnumerable);
var originalGetSymbols = hasSymbols ? Object.getOwnPropertySymbols : null;

module.exports = function assign(target, source1) {
	if (!canBeObject(target)) {
		throw new TypeError('target must be an object');
	}
	var objTarget = toObject(target);
	var s, source, i, props, syms, value, key;
	for (s = 1; s < arguments.length; ++s) {
		source = toObject(arguments[s]);
		props = keys(source);
		var getSymbols = hasSymbols && (Object.getOwnPropertySymbols || originalGetSymbols);
		if (getSymbols) {
			syms = getSymbols(source);
			for (i = 0; i < syms.length; ++i) {
				key = syms[i];
				if (propIsEnumerable(source, key)) {
					push(props, key);
				}
			}
		}
		for (i = 0; i < props.length; ++i) {
			key = props[i];
			value = source[key];
			if (propIsEnumerable(source, key)) {
				objTarget[key] = value;
			}
		}
	}
	return objTarget;
};

/***/ }),

/***/ "../node_modules/object.assign/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defineProperties = __webpack_require__("../node_modules/define-properties/index.js");

var implementation = __webpack_require__("../node_modules/object.assign/implementation.js");
var getPolyfill = __webpack_require__("../node_modules/object.assign/polyfill.js");
var shim = __webpack_require__("../node_modules/object.assign/shim.js");

var polyfill = getPolyfill();

defineProperties(polyfill, {
	implementation: implementation,
	getPolyfill: getPolyfill,
	shim: shim
});

module.exports = polyfill;

/***/ }),

/***/ "../node_modules/object.assign/polyfill.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var implementation = __webpack_require__("../node_modules/object.assign/implementation.js");

var lacksProperEnumerationOrder = function lacksProperEnumerationOrder() {
	if (!Object.assign) {
		return false;
	}
	// v8, specifically in node 4.x, has a bug with incorrect property enumeration order
	// note: this does not detect the bug unless there's 20 characters
	var str = 'abcdefghijklmnopqrst';
	var letters = str.split('');
	var map = {};
	for (var i = 0; i < letters.length; ++i) {
		map[letters[i]] = letters[i];
	}
	var obj = Object.assign({}, map);
	var actual = '';
	for (var k in obj) {
		actual += k;
	}
	return str !== actual;
};

var assignHasPendingExceptions = function assignHasPendingExceptions() {
	if (!Object.assign || !Object.preventExtensions) {
		return false;
	}
	// Firefox 37 still has "pending exception" logic in its Object.assign implementation,
	// which is 72% slower than our shim, and Firefox 40's native implementation.
	var thrower = Object.preventExtensions({ 1: 2 });
	try {
		Object.assign(thrower, 'xy');
	} catch (e) {
		return thrower[1] === 'y';
	}
	return false;
};

module.exports = function getPolyfill() {
	if (!Object.assign) {
		return implementation;
	}
	if (lacksProperEnumerationOrder()) {
		return implementation;
	}
	if (assignHasPendingExceptions()) {
		return implementation;
	}
	return Object.assign;
};

/***/ }),

/***/ "../node_modules/object.assign/shim.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var define = __webpack_require__("../node_modules/define-properties/index.js");
var getPolyfill = __webpack_require__("../node_modules/object.assign/polyfill.js");

module.exports = function shimAssign() {
	var polyfill = getPolyfill();
	define(Object, { assign: polyfill }, { assign: function assign() {
			return Object.assign !== polyfill;
		} });
	return polyfill;
};

/***/ }),

/***/ "../node_modules/process/browser.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),

/***/ "../node_modules/pwet/src/assertions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUnknownElement = exports.isElement = exports.isComponent = exports.isInteger = exports.isNumber = exports.isFunction = exports.isString = exports.isBoolean = exports.isEmpty = exports.isObject = exports.ofType = exports.isArray = exports.isInstanceOf = exports.isNull = exports.isUndefined = exports.isTrue = exports.isEqualTo = exports.isDeeplyEqual = exports.assert = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = __webpack_require__("../node_modules/lodash.isequal/index.js");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = exports.assert = function assert(condition, message) {

  if (condition) return condition;

  throw new Error(message);
};

var isDeeplyEqual = exports.isDeeplyEqual = _lodash2.default;
var isEqualTo = exports.isEqualTo = function isEqualTo(value, input) {
  return input === value;
};
var isTrue = exports.isTrue = function isTrue(input) {
  return isEqualTo(true, input);
};
var isUndefined = exports.isUndefined = function isUndefined(input) {
  return isEqualTo(void 0, input);
};
var isNull = exports.isNull = function isNull(input) {
  return isEqualTo(null, input);
};
var isInstanceOf = exports.isInstanceOf = function isInstanceOf(type, input) {
  return input instanceof type;
};
var isArray = exports.isArray = function isArray(input) {
  return isInstanceOf(Array, input);
};
var ofType = exports.ofType = function ofType(type, input) {
  return isEqualTo(type, typeof input === 'undefined' ? 'undefined' : _typeof(input));
};
var isObject = exports.isObject = function isObject(input) {
  return ofType('object', input);
};
var isEmpty = exports.isEmpty = function isEmpty(input) {
  return !input || input.length < 1;
};
var isBoolean = exports.isBoolean = function isBoolean(input) {
  return ofType('boolean', input);
};
var isString = exports.isString = function isString(input) {

  return ofType('string', input);
};
var isFunction = exports.isFunction = function isFunction(input) {
  return ofType('function', input);
};
var isNumber = exports.isNumber = function isNumber(input) {
  return ofType('number', input);
};
var isInteger = exports.isInteger = function isInteger(input) {
  return Number.isInteger(input);
};
var isComponent = exports.isComponent = function isComponent(input) {
  return isObject(input) && input.isPwetComponent === true;
};
var isElement = exports.isElement = function isElement(input) {
  return isInstanceOf(HTMLElement, input);
};
var isUnknownElement = exports.isUnknownElement = function isUnknownElement(input) {
  return Object.prototype.toString.call(input) === '[object HTMLUnknownElement]';
};

/***/ }),

/***/ "../node_modules/pwet/src/attribute.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utilities = __webpack_require__("../node_modules/pwet/src/utilities.js");

var _assertions = __webpack_require__("../node_modules/pwet/src/assertions.js");

var internal = {};

internal.empty = function (val) {
  return val == null;
};
internal.nullOrType = function (type) {
  return function (val) {
    return internal.empty(val) ? null : type(val);
  };
};
internal.zeroOrNumber = function (val) {
  return internal.empty(val) ? 0 : Number(val);
};
internal.attribute = Object.freeze({ source: true });

internal.Attribute = module.exports = function (attribute) {

  (0, _assertions.assert)((0, _assertions.isObject)(attribute), '\'attribute\' must be an object');

  var _attribute$stringify = attribute.stringify,
      stringify = _attribute$stringify === undefined ? _utilities.identity : _attribute$stringify,
      _attribute$parse = attribute.parse,
      parse = _attribute$parse === undefined ? _utilities.identity : _attribute$parse,
      _attribute$coerce = attribute.coerce,
      coerce = _attribute$coerce === undefined ? _utilities.identity : _attribute$coerce,
      defaultValue = attribute.defaultValue;


  (0, _assertions.assert)((0, _assertions.isFunction)(stringify), '\'stringify\' must be a function');
  (0, _assertions.assert)((0, _assertions.isFunction)(parse), '\'parse\' must be a function');
  (0, _assertions.assert)((0, _assertions.isFunction)(coerce), '\'coerce\' must be a function');

  return Object.freeze({
    isPwetAttribute: true,
    stringify: stringify,
    parse: parse,
    coerce: coerce,
    defaultValue: defaultValue
  });
};

internal.Attribute.isAttribute = function (input) {
  return (0, _assertions.isObject)(input) && input.isPwetAttribute === true;
};

internal.Attribute.array = internal.Attribute({
  coerce: function coerce(val) {
    return Array.isArray(val) ? val : internal.empty(val) ? null : [val];
  },
  defaultValue: Object.freeze([]),
  parse: JSON.parse,
  stringify: JSON.stringify
});

internal.Attribute.boolean = internal.Attribute({
  coerce: Boolean,
  defaultValue: false,
  parse: function parse(val) {
    return !internal.empty(val);
  },
  stringify: function stringify(val) {
    return val ? '' : null;
  }
});

internal.Attribute.number = internal.Attribute({
  defaultValue: 0,
  coerce: internal.zeroOrNumber,
  parse: internal.zeroOrNumber,
  stringify: internal.nullOrType(Number)
});

internal.Attribute.object = internal.Attribute({
  defaultValue: Object.freeze({}),
  parse: JSON.parse,
  stringify: JSON.stringify
});

internal.Attribute.string = internal.Attribute({
  defaultValue: '',
  coerce: String,
  stringify: internal.nullOrType(String)
});

/***/ }),

/***/ "../node_modules/pwet/src/component.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utilities = __webpack_require__("../node_modules/pwet/src/utilities.js");

var _filters = __webpack_require__("../node_modules/pwet/src/filters.js");

var _assertions = __webpack_require__("../node_modules/pwet/src/assertions.js");

var _property = __webpack_require__("../node_modules/pwet/src/property.js");

var _property2 = _interopRequireDefault(_property);

var _attribute = __webpack_require__("../node_modules/pwet/src/attribute.js");

var _attribute2 = _interopRequireDefault(_attribute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var internal = {
  factories: [],
  allowedHooks: ['attach', 'detach', 'initialize', 'update', 'render']
};

internal.parseProperties = function (input) {

  var properties = [];

  if (!(0, _assertions.isObject)(input)) return properties;

  var keys = Object.keys(input);

  if ((0, _assertions.isEmpty)(keys)) return properties;

  return keys.reduce(function (properties, key) {

    var property = input[key];

    if (!(0, _assertions.isObject)(property)) property = { defaultValue: property };

    if (_attribute2.default.isAttribute(property)) property = {
      attribute: property
    };

    property.name = key;

    property = (0, _property2.default)(property);

    properties.push(property);

    return properties;
  }, properties);
};
internal.isAllowedHook = function (key) {
  return internal.allowedHooks.includes(key);
};

internal.defaultsHooks = {
  attach: function attach(component, _attach) {
    _attach(!component.isRendered);
  },
  update: function update(component, newState, _update) {
    _update(true);
  },
  initialize: function initialize(component, newProperties, _initialize) {
    _initialize(true);
  }
};

internal.Component = function (factory, element) {

  (0, _assertions.assert)(internal.Component.get(factory), '\'factory\' must be a defined component factory');
  (0, _assertions.assert)((0, _assertions.isElement)(element), '\'element\' must be a HTMLElement');

  if (element.pwet !== void 0) return;

  var _isAttached = false;
  var _isRendered = false;
  var _isUpdating = false;
  var _isInitializing = false;
  var _state = factory.initialState();
  var _properties = {};
  var _callbacks = [];

  var attributeChanged = function attributeChanged(name, oldValue, newValue) {
    var properties = component.properties;


    _attributes.forEach(function (property) {

      if (name === property.name) properties[name] = property.attribute.parse(newValue);
    });

    component.properties = properties;
  };

  var editState = function editState(partialState /*, callback*/) {
    // console.log('Component.editState()');

    (0, _assertions.assert)((0, _assertions.isObject)(partialState) && !(0, _assertions.isNull)(partialState), '\'partialState\' must be an object');

    // if (!isUndefined(callback))
    //   _callbacks.push(callback);

    var state = component.state;

    Object.assign(state, partialState);

    update(state);
  };

  var attach = function attach() {
    // console.log('Component.attach()');

    if (_isAttached) return;

    if (factory.shadowRoot) element.shadowRoot = element.attachShadow(factory.shadowRoot);

    _hooks.attach(function () {
      var shouldRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


      _isAttached = true;

      if (shouldRender) component.render();
    });
  };

  var detach = function detach() {
    // console.log('Component.detach()');

    if (!_isAttached) return;

    _isAttached = false;

    _hooks.detach();
  };

  var initialize = function initialize(newProperties) {
    // console.log('Component.initialize()', 'before', _isInitializing);

    if (_isInitializing) return;

    (0, _assertions.assert)((0, _assertions.isObject)(newProperties) && !(0, _assertions.isNull)(newProperties), '\'newProperties\' must be an object');

    _isInitializing = true;

    newProperties = factory.properties.reduce(function (properties, _ref) {
      var name = _ref.name,
          coerce = _ref.coerce,
          defaultValue = _ref.defaultValue;


      return Object.assign(properties, _defineProperty({}, name, !(0, _assertions.isUndefined)(newProperties[name]) ? coerce(newProperties[name]) : !(0, _assertions.isUndefined)(_properties[name]) ? _properties[name] : defaultValue));
    }, {});

    _hooks.initialize(newProperties, function () {
      var shouldRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


      _properties = newProperties;

      if (shouldRender) component.render();

      _isInitializing = false;
    });
  };

  var update = function update(newState) {
    // console.log('Component.update()', newState);

    if (_isUpdating) return;

    (0, _assertions.assert)((0, _assertions.isObject)(newState) && !(0, _assertions.isNull)(newState), '\'newState\' must be an object');

    (0, _assertions.assert)(_state !== newState, '\'newState\' must not be equal to previous state');

    if (_isInitializing) return void (_state = newState);

    _isUpdating = true;

    _hooks.update(newState, function () {
      var shouldRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


      _state = newState;

      // const shift = _callbacks.shift.bind(_callbacks);
      // const stateCopy = Object.assign({}, newState);
      //
      // while (_callbacks.length > 0)
      //   shift()(stateCopy);

      if (shouldRender) component.render();

      _isUpdating = false;
    });
  };

  var render = function render() {
    // console.log('Component.render()', _isAttached);

    if (!_isAttached) return;

    _hooks.render();

    _isRendered = true;
  };

  var component = element.pwet = {
    isPwetComponent: true,
    element: element,
    editState: editState,
    attach: attach,
    detach: detach,
    initialize: initialize,
    update: update,
    render: render,
    attributeChanged: attributeChanged,
    get isRendered() {
      return _isRendered;
    }
  };

  var _hooks = {
    initialize: factory.initialize.bind(null, component),
    update: factory.update.bind(null, component),
    render: factory.render.bind(null, component),
    attach: factory.attach.bind(null, component),
    detach: factory.detach.bind(null, component)
  };

  var _attributes = factory.properties.filter(function (property) {
    return property.attribute !== false;
  });

  Object.defineProperty(component, 'state', {
    get: function get() {
      return Object.assign({}, _state);
    },
    set: function set(newState) {

      if (!_isUpdating) component.update(newState);
    }
  });

  Object.defineProperty(component, 'properties', {
    get: function get() {
      return Object.assign({}, _properties);
    },

    set: initialize
  });

  var overridenHooks = factory(Object.freeze(component));

  if (!(0, _assertions.isObject)(overridenHooks) || (0, _assertions.isNull)(overridenHooks)) return component;

  Object.keys(overridenHooks).filter(internal.isAllowedHook).forEach(function (key) {

    var method = overridenHooks[key];

    (0, _assertions.assert)((0, _assertions.isFunction)(method), '\'' + key + '\' must be a function');

    _hooks[key] = method;
  });

  (0, _assertions.assert)(_hooks.render !== _utilities.noop, '\'render\' method is required');

  // first initialization
  component.properties = factory.properties.reduce(function (properties, _ref2) {
    var name = _ref2.name,
        attribute = _ref2.attribute,
        defaultValue = _ref2.defaultValue;


    Object.defineProperty(element, name, {
      get: function get() {
        return component.properties[name];
      },
      set: function set(newValue) {

        component.properties = Object.assign(component.properties, _defineProperty({}, name, newValue));
      }
    });

    var value = defaultValue;

    if (attribute !== false) {

      var attributeValue = element.dataset[name];

      if (!(0, _assertions.isUndefined)(attributeValue)) value = attributeValue;
    }

    return Object.assign(properties, _defineProperty({}, name, value));
  }, {});

  return component;
};

internal.Component.get = function (input) {
  return internal.factories.find((0, _filters.EqualFilter)(input));
};

internal.Component.define = function (factory, options) {

  (0, _assertions.assert)((0, _assertions.isFunction)(factory), '\'factory\' must be a function');

  if (!(0, _assertions.isUndefined)(options)) (0, _assertions.assert)((0, _assertions.isObject)(options), '\'options\' must be an object');

  var tagName = factory.tagName,
      _factory$attributes = factory.attributes,
      attributes = _factory$attributes === undefined ? {} : _factory$attributes;
  var _factory$initialState = factory.initialState,
      initialState = _factory$initialState === undefined ? {} : _factory$initialState;


  (0, _assertions.assert)((0, _assertions.isString)(tagName) && /[a-z0-9-]+/i, '\'tagName\' must be a string');
  (0, _assertions.assert)(!internal.Component.get(factory), 'That component factory is already defined');
  (0, _assertions.assert)(!internal.factories.find((0, _filters.ByFilter)('tagName', tagName)), '\'' + tagName + '\' component is already defined');

  if ((0, _assertions.isObject)(initialState) && !(0, _assertions.isNull)(initialState)) initialState = _utilities.identity.bind(null, initialState);

  (0, _assertions.assert)((0, _assertions.isFunction)(initialState), '\'initialState\' must be an object or a function');

  factory.initialState = initialState;
  factory.properties = internal.parseProperties(factory.properties);

  if (!(0, _assertions.isFunction)(factory.attach)) factory.attach = internal.defaultsHooks.attach;
  if (!(0, _assertions.isFunction)(factory.initialize)) factory.initialize = internal.defaultsHooks.initialize;
  if (!(0, _assertions.isFunction)(factory.detach)) factory.detach = _utilities.noop;
  if (!(0, _assertions.isFunction)(factory.update)) factory.update = internal.defaultsHooks.update;
  if (!(0, _assertions.isFunction)(factory.render)) factory.render = _utilities.noop;

  internal.factories.push(factory);

  var attributesNames = factory.properties.filter(function (property) {
    return property.attribute;
  }).map(function (property) {
    return property.name;
  });

  customElements.define(tagName, function (_HTMLElement) {
    _inherits(_class, _HTMLElement);

    function _class() {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

      internal.Component(factory, _this);
      return _this;
    }

    _createClass(_class, [{
      key: 'connectedCallback',
      value: function connectedCallback() {

        this.pwet.attach();
      }
    }, {
      key: 'disconnectedCallback',
      value: function disconnectedCallback() {

        this.pwet.detach();
      }
    }, {
      key: 'attributeChangedCallback',
      value: function attributeChangedCallback(name, oldValue, newValue) {

        this.pwet.attributeChanged(name, oldValue, newValue);
      }
    }], [{
      key: 'observedAttributes',
      get: function get() {

        return attributesNames;
      }
    }]);

    return _class;
  }(HTMLElement));
};

exports.default = internal.Component;

/***/ }),

/***/ "../node_modules/pwet/src/filters.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ByFilter = exports.ByFilter = function ByFilter(key, value) {
  return function (item) {
    return item[key] === value;
  };
};
var EqualFilter = exports.EqualFilter = function EqualFilter(value) {
  return function (item) {
    return item === value;
  };
};

/***/ }),

/***/ "../node_modules/pwet/src/polyfills/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// NOTE!!!
//
// We have to load polyfills directly from source as non-minified files are not
// published by the polyfills. An issue was raised to discuss this problem and
// to see if it can be resolved.
//
// See https://github.com/webcomponents/custom-elements/issues/45

// ES2015 polyfills required for the polyfills to work in older browsers.
__webpack_require__("../node_modules/array.from/index.js").shim();
__webpack_require__("../node_modules/object.assign/index.js").shim();
__webpack_require__("../node_modules/es6-promise/dist/es6-promise.js").polyfill();

// We have to include this first so that it can patch native. This must be done
// before any polyfills are loaded.
__webpack_require__("../node_modules/pwet/src/polyfills/native-shim.js");

// // Template polyfill is necessary to use shadycss in IE11
// // this comes before custom elements because of
// // https://github.com/webcomponents/template/blob/master/template.js#L39
// require('@webcomponents/template');

// This comes after the native shim because it requries it to be patched first.
__webpack_require__("../node_modules/@webcomponents/custom-elements/src/custom-elements.js");

// // Force the polyfill in Safari 10.0.0 and 10.0.1.
// const { navigator } = window;
// const { userAgent } = navigator;
// const safari = userAgent.indexOf('Safari/60') !== -1;
// const safariVersion = safari && userAgent.match(/Version\/([^\s]+)/)[1];
// const safariVersions = [0, 1].map(v => `10.0.${v}`).concat(['10.0']);
//
// if (safari && safariVersions.indexOf(safariVersion) > -1) {
//   window.ShadyDOM = { force: true };
// }
//
// // ShadyDOM comes first. Both because it may need to be forced and the
// // ShadyCSS polyfill requires it to function.
// require('cloudydom/src/shadydom');
// require('@webcomponents/shadycss/index');

/***/ }),

/***/ "../node_modules/pwet/src/polyfills/native-shim.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.customElements && eval("/**\n * @license\n * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.\n * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt\n * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt\n * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt\n * Code distributed by Google as part of the polymer project is also\n * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt\n */\n\n/**\n * This shim allows elements written in, or compiled to, ES5 to work on native\n * implementations of Custom Elements.\n *\n * ES5-style classes don't work with native Custom Elements because the\n * HTMLElement constructor uses the value of `new.target` to look up the custom\n * element definition for the currently called constructor. `new.target` is only\n * set when `new` is called and is only propagated via super() calls. super()\n * is not emulatable in ES5. The pattern of `SuperClass.call(this)`` only works\n * when extending other ES5-style classes, and does not propagate `new.target`.\n *\n * This shim allows the native HTMLElement constructor to work by generating and\n * registering a stand-in class instead of the users custom element class. This\n * stand-in class's constructor has an actual call to super().\n * `customElements.define()` and `customElements.get()` are both overridden to\n * hide this stand-in class from users.\n *\n * In order to create instance of the user-defined class, rather than the stand\n * in, the stand-in's constructor swizzles its instances prototype and invokes\n * the user-defined constructor. When the user-defined constructor is called\n * directly it creates an instance of the stand-in class to get a real extension\n * of HTMLElement and returns that.\n *\n * There are two important constructors: A patched HTMLElement constructor, and\n * the StandInElement constructor. They both will be called to create an element\n * but which is called first depends on whether the browser creates the element\n * or the user-defined constructor is called directly. The variables\n * `browserConstruction` and `userConstruction` control the flow between the\n * two constructors.\n *\n * This shim should be better than forcing the polyfill because:\n *   1. It's smaller\n *   2. All reaction timings are the same as native (mostly synchronous)\n *   3. All reaction triggering DOM operations are automatically supported\n *\n * There are some restrictions and requirements on ES5 constructors:\n *   1. All constructors in a inheritance hierarchy must be ES5-style, so that\n *      they can be called with Function.call(). This effectively means that the\n *      whole application must be compiled to ES5.\n *   2. Constructors must return the value of the emulated super() call. Like\n *      `return SuperClass.call(this)`\n *   3. The `this` reference should not be used before the emulated super() call\n *      just like `this` is illegal to use before super() in ES6.\n *   4. Constructors should not create other custom elements before the emulated\n *      super() call. This is the same restriction as with native custom\n *      elements.\n *\n *  Compiling valid class-based custom elements to ES5 will satisfy these\n *  requirements with the latest version of popular transpilers.\n */\n(() => {\n  'use strict';\n\n  // Do nothing if `customElements` does not exist.\n  if (!window.customElements) return;\n\n  const NativeHTMLElement = window.HTMLElement;\n  const nativeDefine = window.customElements.define;\n  const nativeGet = window.customElements.get;\n\n  /**\n   * Map of user-provided constructors to tag names.\n   *\n   * @type {Map<Function, string>}\n   */\n  const tagnameByConstructor = new Map();\n\n  /**\n   * Map of tag names to user-provided constructors.\n   *\n   * @type {Map<string, Function>}\n   */\n  const constructorByTagname = new Map();\n\n\n  /**\n   * Whether the constructors are being called by a browser process, ie parsing\n   * or createElement.\n   */\n  let browserConstruction = false;\n\n  /**\n   * Whether the constructors are being called by a user-space process, ie\n   * calling an element constructor.\n   */\n  let userConstruction = false;\n\n  window.HTMLElement = function() {\n    if (!browserConstruction) {\n      const tagname = tagnameByConstructor.get(this.constructor);\n      const fakeClass = nativeGet.call(window.customElements, tagname);\n\n      // Make sure that the fake constructor doesn't call back to this constructor\n      userConstruction = true;\n      const instance = new (fakeClass)();\n      return instance;\n    }\n    // Else do nothing. This will be reached by ES5-style classes doing\n    // HTMLElement.call() during initialization\n    browserConstruction = false;\n  };\n  // By setting the patched HTMLElement's prototype property to the native\n  // HTMLElement's prototype we make sure that:\n  //     document.createElement('a') instanceof HTMLElement\n  // works because instanceof uses HTMLElement.prototype, which is on the\n  // ptototype chain of built-in elements.\n  window.HTMLElement.prototype = NativeHTMLElement.prototype;\n\n  window.customElements.define = (tagname, elementClass) => {\n    const elementProto = elementClass.prototype;\n    const StandInElement = class extends NativeHTMLElement {\n      constructor() {\n        // Call the native HTMLElement constructor, this gives us the\n        // under-construction instance as `this`:\n        super();\n\n        // The prototype will be wrong up because the browser used our fake\n        // class, so fix it:\n        Object.setPrototypeOf(this, elementProto);\n\n        if (!userConstruction) {\n          // Make sure that user-defined constructor bottom's out to a do-nothing\n          // HTMLElement() call\n          browserConstruction = true;\n          // Call the user-defined constructor on our instance:\n          elementClass.call(this);\n        }\n        userConstruction = false;\n      }\n    };\n    const standInProto = StandInElement.prototype;\n    StandInElement.observedAttributes = elementClass.observedAttributes;\n    standInProto.connectedCallback = elementProto.connectedCallback;\n    standInProto.disconnectedCallback = elementProto.disconnectedCallback;\n    standInProto.attributeChangedCallback = elementProto.attributeChangedCallback;\n    standInProto.adoptedCallback = elementProto.adoptedCallback;\n\n    tagnameByConstructor.set(elementClass, tagname);\n    constructorByTagname.set(tagname, elementClass);\n    nativeDefine.call(window.customElements, tagname, StandInElement);\n  };\n\n  window.customElements.get = (tagname) => constructorByTagname.get(tagname);\n\n})();\n");

/***/ }),

/***/ "../node_modules/pwet/src/property.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utilities = __webpack_require__("../node_modules/pwet/src/utilities.js");

var _assertions = __webpack_require__("../node_modules/pwet/src/assertions.js");

var _attribute = __webpack_require__("../node_modules/pwet/src/attribute.js");

var _attribute2 = _interopRequireDefault(_attribute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var internal = {};

internal.Property = module.exports = function (property) {

  (0, _assertions.assert)((0, _assertions.isObject)(property), '\'property\' must be an object');

  var name = property.name,
      _property$attribute = property.attribute,
      attribute = _property$attribute === undefined ? false : _property$attribute,
      _property$isPartOfSta = property.isPartOfState,
      isPartOfState = _property$isPartOfSta === undefined ? false : _property$isPartOfSta,
      _property$coerce = property.coerce,
      coerce = _property$coerce === undefined ? _utilities.identity : _property$coerce,
      defaultValue = property.defaultValue;


  (0, _assertions.assert)((0, _assertions.isString)(name), '\'name\' must be a string');
  (0, _assertions.assert)((0, _assertions.isFunction)(coerce), '\'coerce\' must be a function');
  (0, _assertions.assert)((0, _assertions.isBoolean)(isPartOfState), '\'isPartOfState\' must be a boolean');

  if (attribute) {

    (0, _assertions.assert)(_attribute2.default.isAttribute(attribute), '\'attribute\' is not an Attribute object');

    if ((0, _assertions.isUndefined)(defaultValue) && !(0, _assertions.isUndefined)(attribute.defaultValue)) defaultValue = attribute.defaultValue;

    if (attribute.coerce !== coerce) coerce = attribute.coerce;
  }

  return Object.freeze(Object.assign(property, {
    name: name,
    attribute: attribute,
    coerce: coerce,
    defaultValue: defaultValue,
    isPartOfState: isPartOfState
  }));
};

/***/ }),

/***/ "../node_modules/pwet/src/utilities.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAttached = exports.not = exports.toggle = exports.identity = exports.noop = exports.clone = undefined;

var _assertions = __webpack_require__("../node_modules/pwet/src/assertions.js");

var clone = exports.clone = function clone(input) {
  return !(0, _assertions.isArray)(input) ? (0, _assertions.isObject)(input) ? Object.assign({}, input) : input : input.map(clone);
};

var noop = exports.noop = function noop() {};
var identity = exports.identity = function identity(arg) {
  return arg;
};
var toggle = exports.toggle = function toggle(input) {
  return !input;
};
var not = exports.not = toggle;
var isAttached = exports.isAttached = function isAttached(element) {

  if (element === document) return true;

  element = element.parentNode;
  if (element) return isAttached(element);

  return false;
};

/***/ }),

/***/ "../node_modules/url-loader/index.js!./spinner.gif?mimetype=image/gif":
/***/ (function(module, exports) {

module.exports = "data:image/gif;base64,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"

/***/ }),

/***/ "../node_modules/webpack/buildin/global.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),

/***/ "../node_modules/webpack/buildin/module.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),

/***/ "../src/component.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _attribute = __webpack_require__("../node_modules/pwet/src/attribute.js");

var _attribute2 = _interopRequireDefault(_attribute);

var _utilities = __webpack_require__("../node_modules/pwet/src/utilities.js");

var _lodash = __webpack_require__("../node_modules/lodash.throttle/index.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _assertions = __webpack_require__("../node_modules/pwet/src/assertions.js");

var _incrementalDom = __webpack_require__("../node_modules/incremental-dom/dist/incremental-dom-cjs.js");

var _idomUtil = __webpack_require__("../node_modules/idom-util/src/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var internal = {};

internal.defaults = {
  pipeline: false,
  auto: true
};

internal.unsetListeners = function (image) {
  return image.onerror = image.onabort = image.onload = null;
};

internal.ImageLoader = function (component) {
  var element = component.element;


  console.log('ImageLoader()');

  var _loadImage = function _loadImage(src) {
    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var state = component.state,
        properties = component.properties;
    var status = state.status,
        loaded = state.loaded,
        failed = state.failed,
        queue = state.queue;
    var onComplete = properties.onComplete,
        onProgress = properties.onProgress,
        pipeline = properties.pipeline,
        onError = properties.onError,
        onLoad = properties.onLoad;


    console.log('ImageLoader._loadImage()', state.index);

    component.editState({
      status: 'loading'
    });

    index++;

    var _makeEventHandler = function _makeEventHandler(state, returnValue) {
      return function (event) {

        internal.unsetListeners(image);

        var method = !returnValue ? onError : onLoad;
        var array = !returnValue ? failed : loaded;

        array.push(src);

        component.editState({
          loaded: loaded,
          progress: Math.floor(100 / queue.length * (loaded.length + failed.length)),
          status: 'loading'
        });

        onProgress(component, src, state, event);
        method(component, src, state, event);

        if (loaded.length + failed.length === queue.length) {

          component.editState({
            status: 'loaded'
          });

          onComplete(component, loaded, failed);
        }

        if (pipeline && index < queue.length - 1) _loadImage(queue[index + 1]);
      };
    };

    var image = new Image();

    image.onerror = image.onabort = _makeEventHandler(state, null);

    image.onload = _makeEventHandler(state, image);

    image.src = src;
  };

  var attach = function attach(_attach) {
    console.log('ImageLoader.attach()', component.properties, component.state);
    _attach(!component.isRendered);
  };

  var detach = function detach() {
    console.log('ImageLoader.detach()');
  };

  var initialize = function initialize(newProperties, _initialize) {

    console.log('ImageLoader.initialize()', 'before', newProperties, component.properties, component.state);

    var oldProperties = component.properties;

    if (newProperties.src.length > 0 && newProperties.src !== oldProperties.src) {
      var state = component.state,
          properties = component.properties;
      var pipeline = properties.pipeline;


      if (state.status === 'loading') return;

      if ((0, _assertions.isString)(newProperties.src)) newProperties.src = [newProperties.src];

      (0, _assertions.assert)((0, _assertions.isArray)(newProperties.src) && newProperties.src.every(_assertions.isString), '\'images\' must be an array of string');

      component.editState({
        queue: newProperties.src,
        loaded: [],
        failed: []
      });

      if (pipeline) _loadImage(newProperties.src[0]);

      newProperties.src.forEach(_loadImage);
    }

    _initialize(!component.isRendered || !(0, _assertions.isDeeplyEqual)(oldProperties, newProperties));
  };

  var update = function update(newState, _update) {
    var state = component.state;


    console.log('ImageLoader.update()', state.progress + '%');

    _update(true);
  };

  var render = function render() {
    var state = component.state,
        properties = component.properties;
    var status = state.status,
        loaded = state.loaded;
    var renderImage = properties.renderImage,
        renderSpinner = properties.renderSpinner;


    console.error('ImageLoader.render()', properties, state);

    (0, _incrementalDom.patch)(element, function () {

      if (status === 'pending' || status === 'loading' && loaded.length < 1) return void renderSpinner(component);

      loaded.forEach(renderImage.bind(null, component));
    });
  };

  return {
    attach: attach,
    detach: detach,
    update: update,
    initialize: initialize,
    render: (0, _lodash2.default)(render, internal.ImageLoader.maxWait)
  };
};

internal.ImageLoader.properties = {
  src: {
    attribute: _attribute2.default.array

  },
  pipeline: false,
  onLoad: _utilities.noop,
  onError: _utilities.noop,
  onComplete: function onComplete(component, loaded, failed) {
    console.log('default onComplete() loaded:' + loaded.length + ' failed:' + failed.length);
  },

  onProgress: _utilities.noop,
  renderSpinner: function renderSpinner(component, src) {
    (0, _incrementalDom.text)('loading...');
  },
  renderImage: function renderImage(component, src) {
    (0, _incrementalDom.text)(src);
  }
};

internal.ImageLoader.initialState = {
  status: 'pending',
  loaded: []
};

internal.ImageLoader.maxWait = 250;

internal.ImageLoader.tagName = 'x-image-loader';

exports.default = internal.ImageLoader;

/***/ }),

/***/ "./index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__("../node_modules/pwet/src/polyfills/index.js");

var _component = __webpack_require__("../node_modules/pwet/src/component.js");

var _component2 = _interopRequireDefault(_component);

var _component3 = __webpack_require__("../src/component.js");

var _component4 = _interopRequireDefault(_component3);

var _idomUtil = __webpack_require__("../node_modules/idom-util/src/index.js");

var _gif = __webpack_require__("../node_modules/url-loader/index.js!./spinner.gif?mimetype=image/gif");

var _gif2 = _interopRequireDefault(_gif);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_component4.default.maxWait = 1000;

_component2.default.define(_component4.default);

var container = document.getElementById('container');
var imageLoader = document.createElement('x-image-loader');

imageLoader.renderSpinner = function (component, src) {
  (0, _idomUtil.renderImage)(_gif2.default);
};

container.appendChild(imageLoader);

console.log('===============================');

var src = new Array(42).fill(void 0).map(function (el, i) {
  return 'https://unsplash.it/600?image=' + (1084 - i) + '&' + +new Date();
});

imageLoader.pwet.initialize({
  src: src,
  onProgress: function onProgress(component, src, _ref) {
    var index = _ref.index,
        queue = _ref.queue,
        progress = _ref.progress;

    console.log(index + ' / ' + queue.length + ' (' + progress + ')');
  },
  renderImage: function renderImage(component, src) {
    (0, _idomUtil.renderImage)(src, null, null, 'class', 'fade');
  }
});

/***/ }),

/***/ 0:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

/******/ });
//# sourceMappingURL=main.js.map