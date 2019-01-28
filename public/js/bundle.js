/******/ (function(modules) { // webpackBootstrap
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
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

throw new Error("Module build failed: SyntaxError: /Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/src/index.js: Unexpected token (30:4)\n\n\u001b[0m \u001b[90m 28 | \u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 29 | \u001b[39m\u001b[33mReactDOM\u001b[39m\u001b[33m.\u001b[39mrender((\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 30 | \u001b[39m    \u001b[33m<\u001b[39m\u001b[33mProvider\u001b[39m store\u001b[33m=\u001b[39m{store}\u001b[33m>\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m    | \u001b[39m    \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 31 | \u001b[39m      \u001b[33m<\u001b[39m\u001b[33mRouter\u001b[39m history\u001b[33m=\u001b[39m{history}\u001b[33m>\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 32 | \u001b[39m        \u001b[33m<\u001b[39m\u001b[33mRoute\u001b[39m path\u001b[33m=\u001b[39m\u001b[32m\"/\"\u001b[39m component\u001b[33m=\u001b[39m{\u001b[33mApp\u001b[39m}\u001b[33m>\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 33 | \u001b[39m          \u001b[33m<\u001b[39m\u001b[33mIndexRoute\u001b[39m component\u001b[33m=\u001b[39m{\u001b[33mHome\u001b[39m} \u001b[33m/\u001b[39m\u001b[33m>\u001b[39m\u001b[0m\n    at Parser.raise (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:4028:15)\n    at Parser.unexpected (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:5343:16)\n    at Parser.parseExprAtom (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:6432:20)\n    at Parser.parseExprSubscripts (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:6019:21)\n    at Parser.parseMaybeUnary (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:5998:21)\n    at Parser.parseExprOps (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:5907:21)\n    at Parser.parseMaybeConditional (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:5879:21)\n    at Parser.parseMaybeAssign (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:5826:21)\n    at Parser.parseParenAndDistinguishExpression (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:6588:28)\n    at Parser.parseExprAtom (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:6388:21)\n    at Parser.parseExprSubscripts (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:6019:21)\n    at Parser.parseMaybeUnary (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:5998:21)\n    at Parser.parseExprOps (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:5907:21)\n    at Parser.parseMaybeConditional (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:5879:21)\n    at Parser.parseMaybeAssign (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:5826:21)\n    at Parser.parseExprListItem (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:7111:18)\n    at Parser.parseCallExpressionArguments (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:6227:22)\n    at Parser.parseSubscript (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:6129:32)\n    at Parser.parseSubscripts (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:6039:19)\n    at Parser.parseExprSubscripts (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:6029:17)\n    at Parser.parseMaybeUnary (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:5998:21)\n    at Parser.parseExprOps (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:5907:21)\n    at Parser.parseMaybeConditional (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:5879:21)\n    at Parser.parseMaybeAssign (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:5826:21)\n    at Parser.parseExpression (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:5779:21)\n    at Parser.parseStatementContent (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:7391:21)\n    at Parser.parseStatement (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:7277:17)\n    at Parser.parseBlockOrModuleBlockBody (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:7829:23)\n    at Parser.parseBlockBody (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:7816:10)\n    at Parser.parseTopLevel (/Users/santteegt/Consensys-Academy/Resources/Final project/truffle-react/client/node_modules/@babel/parser/lib/index.js:7242:10)");

/***/ })
/******/ ]);