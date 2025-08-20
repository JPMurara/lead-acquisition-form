(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react/jsx-runtime'), require('react'), require('react-dom'), require('@/components/ui/button'), require('@/components/ui/input')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react/jsx-runtime', 'react', 'react-dom', '@/components/ui/button', '@/components/ui/input'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ConversationalFormWidget = {}, global.jsxRuntime, global.React, global.ReactDOM, global.button, global.input));
})(this, (function (exports, jsxRuntime, React, ReactDOM, button, input) { 'use strict';

    function _interopNamespaceDefault(e) {
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n.default = e;
        return Object.freeze(n);
    }

    var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    // packages/react/compose-refs/src/compose-refs.tsx
    function setRef(ref, value) {
      if (typeof ref === "function") {
        return ref(value);
      } else if (ref !== null && ref !== void 0) {
        ref.current = value;
      }
    }
    function composeRefs(...refs) {
      return (node) => {
        let hasCleanup = false;
        const cleanups = refs.map((ref) => {
          const cleanup = setRef(ref, node);
          if (!hasCleanup && typeof cleanup == "function") {
            hasCleanup = true;
          }
          return cleanup;
        });
        if (hasCleanup) {
          return () => {
            for (let i = 0; i < cleanups.length; i++) {
              const cleanup = cleanups[i];
              if (typeof cleanup == "function") {
                cleanup();
              } else {
                setRef(refs[i], null);
              }
            }
          };
        }
      };
    }
    function useComposedRefs(...refs) {
      return React__namespace.useCallback(composeRefs(...refs), refs);
    }

    // src/slot.tsx
    // @__NO_SIDE_EFFECTS__
    function createSlot(ownerName) {
      const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
      const Slot2 = React__namespace.forwardRef((props, forwardedRef) => {
        const { children, ...slotProps } = props;
        const childrenArray = React__namespace.Children.toArray(children);
        const slottable = childrenArray.find(isSlottable);
        if (slottable) {
          const newElement = slottable.props.children;
          const newChildren = childrenArray.map((child) => {
            if (child === slottable) {
              if (React__namespace.Children.count(newElement) > 1) return React__namespace.Children.only(null);
              return React__namespace.isValidElement(newElement) ? newElement.props.children : null;
            } else {
              return child;
            }
          });
          return /* @__PURE__ */ jsxRuntime.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: React__namespace.isValidElement(newElement) ? React__namespace.cloneElement(newElement, void 0, newChildren) : null });
        }
        return /* @__PURE__ */ jsxRuntime.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
      });
      Slot2.displayName = `${ownerName}.Slot`;
      return Slot2;
    }
    var Slot = /* @__PURE__ */ createSlot("Slot");
    // @__NO_SIDE_EFFECTS__
    function createSlotClone(ownerName) {
      const SlotClone = React__namespace.forwardRef((props, forwardedRef) => {
        const { children, ...slotProps } = props;
        if (React__namespace.isValidElement(children)) {
          const childrenRef = getElementRef$1(children);
          const props2 = mergeProps(slotProps, children.props);
          if (children.type !== React__namespace.Fragment) {
            props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
          }
          return React__namespace.cloneElement(children, props2);
        }
        return React__namespace.Children.count(children) > 1 ? React__namespace.Children.only(null) : null;
      });
      SlotClone.displayName = `${ownerName}.SlotClone`;
      return SlotClone;
    }
    var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
    function isSlottable(child) {
      return React__namespace.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
    }
    function mergeProps(slotProps, childProps) {
      const overrideProps = { ...childProps };
      for (const propName in childProps) {
        const slotPropValue = slotProps[propName];
        const childPropValue = childProps[propName];
        const isHandler = /^on[A-Z]/.test(propName);
        if (isHandler) {
          if (slotPropValue && childPropValue) {
            overrideProps[propName] = (...args) => {
              const result = childPropValue(...args);
              slotPropValue(...args);
              return result;
            };
          } else if (slotPropValue) {
            overrideProps[propName] = slotPropValue;
          }
        } else if (propName === "style") {
          overrideProps[propName] = { ...slotPropValue, ...childPropValue };
        } else if (propName === "className") {
          overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
        }
      }
      return { ...slotProps, ...overrideProps };
    }
    function getElementRef$1(element) {
      let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
      let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
      if (mayWarn) {
        return element.ref;
      }
      getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
      mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
      if (mayWarn) {
        return element.props.ref;
      }
      return element.props.ref || element.ref;
    }

    function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}

    const falsyToString = (value)=>typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
    const cx = clsx;
    const cva = (base, config)=>(props)=>{
            var _config_compoundVariants;
            if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
            const { variants, defaultVariants } = config;
            const getVariantClassNames = Object.keys(variants).map((variant)=>{
                const variantProp = props === null || props === void 0 ? void 0 : props[variant];
                const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
                if (variantProp === null) return null;
                const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
                return variants[variant][variantKey];
            });
            const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param)=>{
                let [key, value] = param;
                if (value === undefined) {
                    return acc;
                }
                acc[key] = value;
                return acc;
            }, {});
            const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param)=>{
                let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
                return Object.entries(compoundVariantOptions).every((param)=>{
                    let [key, value] = param;
                    return Array.isArray(value) ? value.includes({
                        ...defaultVariants,
                        ...propsWithoutUndefined
                    }[key]) : ({
                        ...defaultVariants,
                        ...propsWithoutUndefined
                    })[key] === value;
                }) ? [
                    ...acc,
                    cvClass,
                    cvClassName
                ] : acc;
            }, []);
            return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
        };

    const CLASS_PART_SEPARATOR = '-';
    const createClassGroupUtils = config => {
      const classMap = createClassMap(config);
      const {
        conflictingClassGroups,
        conflictingClassGroupModifiers
      } = config;
      const getClassGroupId = className => {
        const classParts = className.split(CLASS_PART_SEPARATOR);
        // Classes like `-inset-1` produce an empty string as first classPart. We assume that classes for negative values are used correctly and remove it from classParts.
        if (classParts[0] === '' && classParts.length !== 1) {
          classParts.shift();
        }
        return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
      };
      const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
        const conflicts = conflictingClassGroups[classGroupId] || [];
        if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
          return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]];
        }
        return conflicts;
      };
      return {
        getClassGroupId,
        getConflictingClassGroupIds
      };
    };
    const getGroupRecursive = (classParts, classPartObject) => {
      if (classParts.length === 0) {
        return classPartObject.classGroupId;
      }
      const currentClassPart = classParts[0];
      const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
      const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : undefined;
      if (classGroupFromNextClassPart) {
        return classGroupFromNextClassPart;
      }
      if (classPartObject.validators.length === 0) {
        return undefined;
      }
      const classRest = classParts.join(CLASS_PART_SEPARATOR);
      return classPartObject.validators.find(({
        validator
      }) => validator(classRest))?.classGroupId;
    };
    const arbitraryPropertyRegex = /^\[(.+)\]$/;
    const getGroupIdForArbitraryProperty = className => {
      if (arbitraryPropertyRegex.test(className)) {
        const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
        const property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(':'));
        if (property) {
          // I use two dots here because one dot is used as prefix for class groups in plugins
          return 'arbitrary..' + property;
        }
      }
    };
    /**
     * Exported for testing only
     */
    const createClassMap = config => {
      const {
        theme,
        classGroups
      } = config;
      const classMap = {
        nextPart: new Map(),
        validators: []
      };
      for (const classGroupId in classGroups) {
        processClassesRecursively(classGroups[classGroupId], classMap, classGroupId, theme);
      }
      return classMap;
    };
    const processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
      classGroup.forEach(classDefinition => {
        if (typeof classDefinition === 'string') {
          const classPartObjectToEdit = classDefinition === '' ? classPartObject : getPart(classPartObject, classDefinition);
          classPartObjectToEdit.classGroupId = classGroupId;
          return;
        }
        if (typeof classDefinition === 'function') {
          if (isThemeGetter(classDefinition)) {
            processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
            return;
          }
          classPartObject.validators.push({
            validator: classDefinition,
            classGroupId
          });
          return;
        }
        Object.entries(classDefinition).forEach(([key, classGroup]) => {
          processClassesRecursively(classGroup, getPart(classPartObject, key), classGroupId, theme);
        });
      });
    };
    const getPart = (classPartObject, path) => {
      let currentClassPartObject = classPartObject;
      path.split(CLASS_PART_SEPARATOR).forEach(pathPart => {
        if (!currentClassPartObject.nextPart.has(pathPart)) {
          currentClassPartObject.nextPart.set(pathPart, {
            nextPart: new Map(),
            validators: []
          });
        }
        currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
      });
      return currentClassPartObject;
    };
    const isThemeGetter = func => func.isThemeGetter;

    // LRU cache inspired from hashlru (https://github.com/dominictarr/hashlru/blob/v1.0.4/index.js) but object replaced with Map to improve performance
    const createLruCache = maxCacheSize => {
      if (maxCacheSize < 1) {
        return {
          get: () => undefined,
          set: () => {}
        };
      }
      let cacheSize = 0;
      let cache = new Map();
      let previousCache = new Map();
      const update = (key, value) => {
        cache.set(key, value);
        cacheSize++;
        if (cacheSize > maxCacheSize) {
          cacheSize = 0;
          previousCache = cache;
          cache = new Map();
        }
      };
      return {
        get(key) {
          let value = cache.get(key);
          if (value !== undefined) {
            return value;
          }
          if ((value = previousCache.get(key)) !== undefined) {
            update(key, value);
            return value;
          }
        },
        set(key, value) {
          if (cache.has(key)) {
            cache.set(key, value);
          } else {
            update(key, value);
          }
        }
      };
    };
    const IMPORTANT_MODIFIER = '!';
    const MODIFIER_SEPARATOR = ':';
    const MODIFIER_SEPARATOR_LENGTH = MODIFIER_SEPARATOR.length;
    const createParseClassName = config => {
      const {
        prefix,
        experimentalParseClassName
      } = config;
      /**
       * Parse class name into parts.
       *
       * Inspired by `splitAtTopLevelOnly` used in Tailwind CSS
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v3.2.2/src/util/splitAtTopLevelOnly.js
       */
      let parseClassName = className => {
        const modifiers = [];
        let bracketDepth = 0;
        let parenDepth = 0;
        let modifierStart = 0;
        let postfixModifierPosition;
        for (let index = 0; index < className.length; index++) {
          let currentCharacter = className[index];
          if (bracketDepth === 0 && parenDepth === 0) {
            if (currentCharacter === MODIFIER_SEPARATOR) {
              modifiers.push(className.slice(modifierStart, index));
              modifierStart = index + MODIFIER_SEPARATOR_LENGTH;
              continue;
            }
            if (currentCharacter === '/') {
              postfixModifierPosition = index;
              continue;
            }
          }
          if (currentCharacter === '[') {
            bracketDepth++;
          } else if (currentCharacter === ']') {
            bracketDepth--;
          } else if (currentCharacter === '(') {
            parenDepth++;
          } else if (currentCharacter === ')') {
            parenDepth--;
          }
        }
        const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
        const baseClassName = stripImportantModifier(baseClassNameWithImportantModifier);
        const hasImportantModifier = baseClassName !== baseClassNameWithImportantModifier;
        const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : undefined;
        return {
          modifiers,
          hasImportantModifier,
          baseClassName,
          maybePostfixModifierPosition
        };
      };
      if (prefix) {
        const fullPrefix = prefix + MODIFIER_SEPARATOR;
        const parseClassNameOriginal = parseClassName;
        parseClassName = className => className.startsWith(fullPrefix) ? parseClassNameOriginal(className.substring(fullPrefix.length)) : {
          isExternal: true,
          modifiers: [],
          hasImportantModifier: false,
          baseClassName: className,
          maybePostfixModifierPosition: undefined
        };
      }
      if (experimentalParseClassName) {
        const parseClassNameOriginal = parseClassName;
        parseClassName = className => experimentalParseClassName({
          className,
          parseClassName: parseClassNameOriginal
        });
      }
      return parseClassName;
    };
    const stripImportantModifier = baseClassName => {
      if (baseClassName.endsWith(IMPORTANT_MODIFIER)) {
        return baseClassName.substring(0, baseClassName.length - 1);
      }
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      if (baseClassName.startsWith(IMPORTANT_MODIFIER)) {
        return baseClassName.substring(1);
      }
      return baseClassName;
    };

    /**
     * Sorts modifiers according to following schema:
     * - Predefined modifiers are sorted alphabetically
     * - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
     */
    const createSortModifiers = config => {
      const orderSensitiveModifiers = Object.fromEntries(config.orderSensitiveModifiers.map(modifier => [modifier, true]));
      const sortModifiers = modifiers => {
        if (modifiers.length <= 1) {
          return modifiers;
        }
        const sortedModifiers = [];
        let unsortedModifiers = [];
        modifiers.forEach(modifier => {
          const isPositionSensitive = modifier[0] === '[' || orderSensitiveModifiers[modifier];
          if (isPositionSensitive) {
            sortedModifiers.push(...unsortedModifiers.sort(), modifier);
            unsortedModifiers = [];
          } else {
            unsortedModifiers.push(modifier);
          }
        });
        sortedModifiers.push(...unsortedModifiers.sort());
        return sortedModifiers;
      };
      return sortModifiers;
    };
    const createConfigUtils = config => ({
      cache: createLruCache(config.cacheSize),
      parseClassName: createParseClassName(config),
      sortModifiers: createSortModifiers(config),
      ...createClassGroupUtils(config)
    });
    const SPLIT_CLASSES_REGEX = /\s+/;
    const mergeClassList = (classList, configUtils) => {
      const {
        parseClassName,
        getClassGroupId,
        getConflictingClassGroupIds,
        sortModifiers
      } = configUtils;
      /**
       * Set of classGroupIds in following format:
       * `{importantModifier}{variantModifiers}{classGroupId}`
       * @example 'float'
       * @example 'hover:focus:bg-color'
       * @example 'md:!pr'
       */
      const classGroupsInConflict = [];
      const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
      let result = '';
      for (let index = classNames.length - 1; index >= 0; index -= 1) {
        const originalClassName = classNames[index];
        const {
          isExternal,
          modifiers,
          hasImportantModifier,
          baseClassName,
          maybePostfixModifierPosition
        } = parseClassName(originalClassName);
        if (isExternal) {
          result = originalClassName + (result.length > 0 ? ' ' + result : result);
          continue;
        }
        let hasPostfixModifier = !!maybePostfixModifierPosition;
        let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
        if (!classGroupId) {
          if (!hasPostfixModifier) {
            // Not a Tailwind class
            result = originalClassName + (result.length > 0 ? ' ' + result : result);
            continue;
          }
          classGroupId = getClassGroupId(baseClassName);
          if (!classGroupId) {
            // Not a Tailwind class
            result = originalClassName + (result.length > 0 ? ' ' + result : result);
            continue;
          }
          hasPostfixModifier = false;
        }
        const variantModifier = sortModifiers(modifiers).join(':');
        const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
        const classId = modifierId + classGroupId;
        if (classGroupsInConflict.includes(classId)) {
          // Tailwind class omitted due to conflict
          continue;
        }
        classGroupsInConflict.push(classId);
        const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
        for (let i = 0; i < conflictGroups.length; ++i) {
          const group = conflictGroups[i];
          classGroupsInConflict.push(modifierId + group);
        }
        // Tailwind class not in conflict
        result = originalClassName + (result.length > 0 ? ' ' + result : result);
      }
      return result;
    };

    /**
     * The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
     *
     * Specifically:
     * - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
     * - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
     *
     * Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
     */
    function twJoin() {
      let index = 0;
      let argument;
      let resolvedValue;
      let string = '';
      while (index < arguments.length) {
        if (argument = arguments[index++]) {
          if (resolvedValue = toValue(argument)) {
            string && (string += ' ');
            string += resolvedValue;
          }
        }
      }
      return string;
    }
    const toValue = mix => {
      if (typeof mix === 'string') {
        return mix;
      }
      let resolvedValue;
      let string = '';
      for (let k = 0; k < mix.length; k++) {
        if (mix[k]) {
          if (resolvedValue = toValue(mix[k])) {
            string && (string += ' ');
            string += resolvedValue;
          }
        }
      }
      return string;
    };
    function createTailwindMerge(createConfigFirst, ...createConfigRest) {
      let configUtils;
      let cacheGet;
      let cacheSet;
      let functionToCall = initTailwindMerge;
      function initTailwindMerge(classList) {
        const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
        configUtils = createConfigUtils(config);
        cacheGet = configUtils.cache.get;
        cacheSet = configUtils.cache.set;
        functionToCall = tailwindMerge;
        return tailwindMerge(classList);
      }
      function tailwindMerge(classList) {
        const cachedResult = cacheGet(classList);
        if (cachedResult) {
          return cachedResult;
        }
        const result = mergeClassList(classList, configUtils);
        cacheSet(classList, result);
        return result;
      }
      return function callTailwindMerge() {
        return functionToCall(twJoin.apply(null, arguments));
      };
    }
    const fromTheme = key => {
      const themeGetter = theme => theme[key] || [];
      themeGetter.isThemeGetter = true;
      return themeGetter;
    };
    const arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
    const arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
    const fractionRegex = /^\d+\/\d+$/;
    const tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
    const lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
    const colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
    // Shadow always begins with x and y offset separated by underscore optionally prepended by inset
    const shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
    const imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
    const isFraction = value => fractionRegex.test(value);
    const isNumber = value => !!value && !Number.isNaN(Number(value));
    const isInteger = value => !!value && Number.isInteger(Number(value));
    const isPercent = value => value.endsWith('%') && isNumber(value.slice(0, -1));
    const isTshirtSize = value => tshirtUnitRegex.test(value);
    const isAny = () => true;
    const isLengthOnly = value =>
    // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
    // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
    // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
    lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
    const isNever = () => false;
    const isShadow = value => shadowRegex.test(value);
    const isImage = value => imageRegex.test(value);
    const isAnyNonArbitrary = value => !isArbitraryValue(value) && !isArbitraryVariable(value);
    const isArbitrarySize = value => getIsArbitraryValue(value, isLabelSize, isNever);
    const isArbitraryValue = value => arbitraryValueRegex.test(value);
    const isArbitraryLength = value => getIsArbitraryValue(value, isLabelLength, isLengthOnly);
    const isArbitraryNumber = value => getIsArbitraryValue(value, isLabelNumber, isNumber);
    const isArbitraryPosition = value => getIsArbitraryValue(value, isLabelPosition, isNever);
    const isArbitraryImage = value => getIsArbitraryValue(value, isLabelImage, isImage);
    const isArbitraryShadow = value => getIsArbitraryValue(value, isLabelShadow, isShadow);
    const isArbitraryVariable = value => arbitraryVariableRegex.test(value);
    const isArbitraryVariableLength = value => getIsArbitraryVariable(value, isLabelLength);
    const isArbitraryVariableFamilyName = value => getIsArbitraryVariable(value, isLabelFamilyName);
    const isArbitraryVariablePosition = value => getIsArbitraryVariable(value, isLabelPosition);
    const isArbitraryVariableSize = value => getIsArbitraryVariable(value, isLabelSize);
    const isArbitraryVariableImage = value => getIsArbitraryVariable(value, isLabelImage);
    const isArbitraryVariableShadow = value => getIsArbitraryVariable(value, isLabelShadow, true);
    // Helpers
    const getIsArbitraryValue = (value, testLabel, testValue) => {
      const result = arbitraryValueRegex.exec(value);
      if (result) {
        if (result[1]) {
          return testLabel(result[1]);
        }
        return testValue(result[2]);
      }
      return false;
    };
    const getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false) => {
      const result = arbitraryVariableRegex.exec(value);
      if (result) {
        if (result[1]) {
          return testLabel(result[1]);
        }
        return shouldMatchNoLabel;
      }
      return false;
    };
    // Labels
    const isLabelPosition = label => label === 'position' || label === 'percentage';
    const isLabelImage = label => label === 'image' || label === 'url';
    const isLabelSize = label => label === 'length' || label === 'size' || label === 'bg-size';
    const isLabelLength = label => label === 'length';
    const isLabelNumber = label => label === 'number';
    const isLabelFamilyName = label => label === 'family-name';
    const isLabelShadow = label => label === 'shadow';
    const getDefaultConfig = () => {
      /**
       * Theme getters for theme variable namespaces
       * @see https://tailwindcss.com/docs/theme#theme-variable-namespaces
       */
      /***/
      const themeColor = fromTheme('color');
      const themeFont = fromTheme('font');
      const themeText = fromTheme('text');
      const themeFontWeight = fromTheme('font-weight');
      const themeTracking = fromTheme('tracking');
      const themeLeading = fromTheme('leading');
      const themeBreakpoint = fromTheme('breakpoint');
      const themeContainer = fromTheme('container');
      const themeSpacing = fromTheme('spacing');
      const themeRadius = fromTheme('radius');
      const themeShadow = fromTheme('shadow');
      const themeInsetShadow = fromTheme('inset-shadow');
      const themeTextShadow = fromTheme('text-shadow');
      const themeDropShadow = fromTheme('drop-shadow');
      const themeBlur = fromTheme('blur');
      const themePerspective = fromTheme('perspective');
      const themeAspect = fromTheme('aspect');
      const themeEase = fromTheme('ease');
      const themeAnimate = fromTheme('animate');
      /**
       * Helpers to avoid repeating the same scales
       *
       * We use functions that create a new array every time they're called instead of static arrays.
       * This ensures that users who modify any scale by mutating the array (e.g. with `array.push(element)`) don't accidentally mutate arrays in other parts of the config.
       */
      /***/
      const scaleBreak = () => ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'];
      const scalePosition = () => ['center', 'top', 'bottom', 'left', 'right', 'top-left',
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      'left-top', 'top-right',
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      'right-top', 'bottom-right',
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      'right-bottom', 'bottom-left',
      // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
      'left-bottom'];
      const scalePositionWithArbitrary = () => [...scalePosition(), isArbitraryVariable, isArbitraryValue];
      const scaleOverflow = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'];
      const scaleOverscroll = () => ['auto', 'contain', 'none'];
      const scaleUnambiguousSpacing = () => [isArbitraryVariable, isArbitraryValue, themeSpacing];
      const scaleInset = () => [isFraction, 'full', 'auto', ...scaleUnambiguousSpacing()];
      const scaleGridTemplateColsRows = () => [isInteger, 'none', 'subgrid', isArbitraryVariable, isArbitraryValue];
      const scaleGridColRowStartAndEnd = () => ['auto', {
        span: ['full', isInteger, isArbitraryVariable, isArbitraryValue]
      }, isInteger, isArbitraryVariable, isArbitraryValue];
      const scaleGridColRowStartOrEnd = () => [isInteger, 'auto', isArbitraryVariable, isArbitraryValue];
      const scaleGridAutoColsRows = () => ['auto', 'min', 'max', 'fr', isArbitraryVariable, isArbitraryValue];
      const scaleAlignPrimaryAxis = () => ['start', 'end', 'center', 'between', 'around', 'evenly', 'stretch', 'baseline', 'center-safe', 'end-safe'];
      const scaleAlignSecondaryAxis = () => ['start', 'end', 'center', 'stretch', 'center-safe', 'end-safe'];
      const scaleMargin = () => ['auto', ...scaleUnambiguousSpacing()];
      const scaleSizing = () => [isFraction, 'auto', 'full', 'dvw', 'dvh', 'lvw', 'lvh', 'svw', 'svh', 'min', 'max', 'fit', ...scaleUnambiguousSpacing()];
      const scaleColor = () => [themeColor, isArbitraryVariable, isArbitraryValue];
      const scaleBgPosition = () => [...scalePosition(), isArbitraryVariablePosition, isArbitraryPosition, {
        position: [isArbitraryVariable, isArbitraryValue]
      }];
      const scaleBgRepeat = () => ['no-repeat', {
        repeat: ['', 'x', 'y', 'space', 'round']
      }];
      const scaleBgSize = () => ['auto', 'cover', 'contain', isArbitraryVariableSize, isArbitrarySize, {
        size: [isArbitraryVariable, isArbitraryValue]
      }];
      const scaleGradientStopPosition = () => [isPercent, isArbitraryVariableLength, isArbitraryLength];
      const scaleRadius = () => [
      // Deprecated since Tailwind CSS v4.0.0
      '', 'none', 'full', themeRadius, isArbitraryVariable, isArbitraryValue];
      const scaleBorderWidth = () => ['', isNumber, isArbitraryVariableLength, isArbitraryLength];
      const scaleLineStyle = () => ['solid', 'dashed', 'dotted', 'double'];
      const scaleBlendMode = () => ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'];
      const scaleMaskImagePosition = () => [isNumber, isPercent, isArbitraryVariablePosition, isArbitraryPosition];
      const scaleBlur = () => [
      // Deprecated since Tailwind CSS v4.0.0
      '', 'none', themeBlur, isArbitraryVariable, isArbitraryValue];
      const scaleRotate = () => ['none', isNumber, isArbitraryVariable, isArbitraryValue];
      const scaleScale = () => ['none', isNumber, isArbitraryVariable, isArbitraryValue];
      const scaleSkew = () => [isNumber, isArbitraryVariable, isArbitraryValue];
      const scaleTranslate = () => [isFraction, 'full', ...scaleUnambiguousSpacing()];
      return {
        cacheSize: 500,
        theme: {
          animate: ['spin', 'ping', 'pulse', 'bounce'],
          aspect: ['video'],
          blur: [isTshirtSize],
          breakpoint: [isTshirtSize],
          color: [isAny],
          container: [isTshirtSize],
          'drop-shadow': [isTshirtSize],
          ease: ['in', 'out', 'in-out'],
          font: [isAnyNonArbitrary],
          'font-weight': ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
          'inset-shadow': [isTshirtSize],
          leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'],
          perspective: ['dramatic', 'near', 'normal', 'midrange', 'distant', 'none'],
          radius: [isTshirtSize],
          shadow: [isTshirtSize],
          spacing: ['px', isNumber],
          text: [isTshirtSize],
          'text-shadow': [isTshirtSize],
          tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest']
        },
        classGroups: {
          // --------------
          // --- Layout ---
          // --------------
          /**
           * Aspect Ratio
           * @see https://tailwindcss.com/docs/aspect-ratio
           */
          aspect: [{
            aspect: ['auto', 'square', isFraction, isArbitraryValue, isArbitraryVariable, themeAspect]
          }],
          /**
           * Container
           * @see https://tailwindcss.com/docs/container
           * @deprecated since Tailwind CSS v4.0.0
           */
          container: ['container'],
          /**
           * Columns
           * @see https://tailwindcss.com/docs/columns
           */
          columns: [{
            columns: [isNumber, isArbitraryValue, isArbitraryVariable, themeContainer]
          }],
          /**
           * Break After
           * @see https://tailwindcss.com/docs/break-after
           */
          'break-after': [{
            'break-after': scaleBreak()
          }],
          /**
           * Break Before
           * @see https://tailwindcss.com/docs/break-before
           */
          'break-before': [{
            'break-before': scaleBreak()
          }],
          /**
           * Break Inside
           * @see https://tailwindcss.com/docs/break-inside
           */
          'break-inside': [{
            'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column']
          }],
          /**
           * Box Decoration Break
           * @see https://tailwindcss.com/docs/box-decoration-break
           */
          'box-decoration': [{
            'box-decoration': ['slice', 'clone']
          }],
          /**
           * Box Sizing
           * @see https://tailwindcss.com/docs/box-sizing
           */
          box: [{
            box: ['border', 'content']
          }],
          /**
           * Display
           * @see https://tailwindcss.com/docs/display
           */
          display: ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'table', 'inline-table', 'table-caption', 'table-cell', 'table-column', 'table-column-group', 'table-footer-group', 'table-header-group', 'table-row-group', 'table-row', 'flow-root', 'grid', 'inline-grid', 'contents', 'list-item', 'hidden'],
          /**
           * Screen Reader Only
           * @see https://tailwindcss.com/docs/display#screen-reader-only
           */
          sr: ['sr-only', 'not-sr-only'],
          /**
           * Floats
           * @see https://tailwindcss.com/docs/float
           */
          float: [{
            float: ['right', 'left', 'none', 'start', 'end']
          }],
          /**
           * Clear
           * @see https://tailwindcss.com/docs/clear
           */
          clear: [{
            clear: ['left', 'right', 'both', 'none', 'start', 'end']
          }],
          /**
           * Isolation
           * @see https://tailwindcss.com/docs/isolation
           */
          isolation: ['isolate', 'isolation-auto'],
          /**
           * Object Fit
           * @see https://tailwindcss.com/docs/object-fit
           */
          'object-fit': [{
            object: ['contain', 'cover', 'fill', 'none', 'scale-down']
          }],
          /**
           * Object Position
           * @see https://tailwindcss.com/docs/object-position
           */
          'object-position': [{
            object: scalePositionWithArbitrary()
          }],
          /**
           * Overflow
           * @see https://tailwindcss.com/docs/overflow
           */
          overflow: [{
            overflow: scaleOverflow()
          }],
          /**
           * Overflow X
           * @see https://tailwindcss.com/docs/overflow
           */
          'overflow-x': [{
            'overflow-x': scaleOverflow()
          }],
          /**
           * Overflow Y
           * @see https://tailwindcss.com/docs/overflow
           */
          'overflow-y': [{
            'overflow-y': scaleOverflow()
          }],
          /**
           * Overscroll Behavior
           * @see https://tailwindcss.com/docs/overscroll-behavior
           */
          overscroll: [{
            overscroll: scaleOverscroll()
          }],
          /**
           * Overscroll Behavior X
           * @see https://tailwindcss.com/docs/overscroll-behavior
           */
          'overscroll-x': [{
            'overscroll-x': scaleOverscroll()
          }],
          /**
           * Overscroll Behavior Y
           * @see https://tailwindcss.com/docs/overscroll-behavior
           */
          'overscroll-y': [{
            'overscroll-y': scaleOverscroll()
          }],
          /**
           * Position
           * @see https://tailwindcss.com/docs/position
           */
          position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
          /**
           * Top / Right / Bottom / Left
           * @see https://tailwindcss.com/docs/top-right-bottom-left
           */
          inset: [{
            inset: scaleInset()
          }],
          /**
           * Right / Left
           * @see https://tailwindcss.com/docs/top-right-bottom-left
           */
          'inset-x': [{
            'inset-x': scaleInset()
          }],
          /**
           * Top / Bottom
           * @see https://tailwindcss.com/docs/top-right-bottom-left
           */
          'inset-y': [{
            'inset-y': scaleInset()
          }],
          /**
           * Start
           * @see https://tailwindcss.com/docs/top-right-bottom-left
           */
          start: [{
            start: scaleInset()
          }],
          /**
           * End
           * @see https://tailwindcss.com/docs/top-right-bottom-left
           */
          end: [{
            end: scaleInset()
          }],
          /**
           * Top
           * @see https://tailwindcss.com/docs/top-right-bottom-left
           */
          top: [{
            top: scaleInset()
          }],
          /**
           * Right
           * @see https://tailwindcss.com/docs/top-right-bottom-left
           */
          right: [{
            right: scaleInset()
          }],
          /**
           * Bottom
           * @see https://tailwindcss.com/docs/top-right-bottom-left
           */
          bottom: [{
            bottom: scaleInset()
          }],
          /**
           * Left
           * @see https://tailwindcss.com/docs/top-right-bottom-left
           */
          left: [{
            left: scaleInset()
          }],
          /**
           * Visibility
           * @see https://tailwindcss.com/docs/visibility
           */
          visibility: ['visible', 'invisible', 'collapse'],
          /**
           * Z-Index
           * @see https://tailwindcss.com/docs/z-index
           */
          z: [{
            z: [isInteger, 'auto', isArbitraryVariable, isArbitraryValue]
          }],
          // ------------------------
          // --- Flexbox and Grid ---
          // ------------------------
          /**
           * Flex Basis
           * @see https://tailwindcss.com/docs/flex-basis
           */
          basis: [{
            basis: [isFraction, 'full', 'auto', themeContainer, ...scaleUnambiguousSpacing()]
          }],
          /**
           * Flex Direction
           * @see https://tailwindcss.com/docs/flex-direction
           */
          'flex-direction': [{
            flex: ['row', 'row-reverse', 'col', 'col-reverse']
          }],
          /**
           * Flex Wrap
           * @see https://tailwindcss.com/docs/flex-wrap
           */
          'flex-wrap': [{
            flex: ['nowrap', 'wrap', 'wrap-reverse']
          }],
          /**
           * Flex
           * @see https://tailwindcss.com/docs/flex
           */
          flex: [{
            flex: [isNumber, isFraction, 'auto', 'initial', 'none', isArbitraryValue]
          }],
          /**
           * Flex Grow
           * @see https://tailwindcss.com/docs/flex-grow
           */
          grow: [{
            grow: ['', isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Flex Shrink
           * @see https://tailwindcss.com/docs/flex-shrink
           */
          shrink: [{
            shrink: ['', isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Order
           * @see https://tailwindcss.com/docs/order
           */
          order: [{
            order: [isInteger, 'first', 'last', 'none', isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Grid Template Columns
           * @see https://tailwindcss.com/docs/grid-template-columns
           */
          'grid-cols': [{
            'grid-cols': scaleGridTemplateColsRows()
          }],
          /**
           * Grid Column Start / End
           * @see https://tailwindcss.com/docs/grid-column
           */
          'col-start-end': [{
            col: scaleGridColRowStartAndEnd()
          }],
          /**
           * Grid Column Start
           * @see https://tailwindcss.com/docs/grid-column
           */
          'col-start': [{
            'col-start': scaleGridColRowStartOrEnd()
          }],
          /**
           * Grid Column End
           * @see https://tailwindcss.com/docs/grid-column
           */
          'col-end': [{
            'col-end': scaleGridColRowStartOrEnd()
          }],
          /**
           * Grid Template Rows
           * @see https://tailwindcss.com/docs/grid-template-rows
           */
          'grid-rows': [{
            'grid-rows': scaleGridTemplateColsRows()
          }],
          /**
           * Grid Row Start / End
           * @see https://tailwindcss.com/docs/grid-row
           */
          'row-start-end': [{
            row: scaleGridColRowStartAndEnd()
          }],
          /**
           * Grid Row Start
           * @see https://tailwindcss.com/docs/grid-row
           */
          'row-start': [{
            'row-start': scaleGridColRowStartOrEnd()
          }],
          /**
           * Grid Row End
           * @see https://tailwindcss.com/docs/grid-row
           */
          'row-end': [{
            'row-end': scaleGridColRowStartOrEnd()
          }],
          /**
           * Grid Auto Flow
           * @see https://tailwindcss.com/docs/grid-auto-flow
           */
          'grid-flow': [{
            'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense']
          }],
          /**
           * Grid Auto Columns
           * @see https://tailwindcss.com/docs/grid-auto-columns
           */
          'auto-cols': [{
            'auto-cols': scaleGridAutoColsRows()
          }],
          /**
           * Grid Auto Rows
           * @see https://tailwindcss.com/docs/grid-auto-rows
           */
          'auto-rows': [{
            'auto-rows': scaleGridAutoColsRows()
          }],
          /**
           * Gap
           * @see https://tailwindcss.com/docs/gap
           */
          gap: [{
            gap: scaleUnambiguousSpacing()
          }],
          /**
           * Gap X
           * @see https://tailwindcss.com/docs/gap
           */
          'gap-x': [{
            'gap-x': scaleUnambiguousSpacing()
          }],
          /**
           * Gap Y
           * @see https://tailwindcss.com/docs/gap
           */
          'gap-y': [{
            'gap-y': scaleUnambiguousSpacing()
          }],
          /**
           * Justify Content
           * @see https://tailwindcss.com/docs/justify-content
           */
          'justify-content': [{
            justify: [...scaleAlignPrimaryAxis(), 'normal']
          }],
          /**
           * Justify Items
           * @see https://tailwindcss.com/docs/justify-items
           */
          'justify-items': [{
            'justify-items': [...scaleAlignSecondaryAxis(), 'normal']
          }],
          /**
           * Justify Self
           * @see https://tailwindcss.com/docs/justify-self
           */
          'justify-self': [{
            'justify-self': ['auto', ...scaleAlignSecondaryAxis()]
          }],
          /**
           * Align Content
           * @see https://tailwindcss.com/docs/align-content
           */
          'align-content': [{
            content: ['normal', ...scaleAlignPrimaryAxis()]
          }],
          /**
           * Align Items
           * @see https://tailwindcss.com/docs/align-items
           */
          'align-items': [{
            items: [...scaleAlignSecondaryAxis(), {
              baseline: ['', 'last']
            }]
          }],
          /**
           * Align Self
           * @see https://tailwindcss.com/docs/align-self
           */
          'align-self': [{
            self: ['auto', ...scaleAlignSecondaryAxis(), {
              baseline: ['', 'last']
            }]
          }],
          /**
           * Place Content
           * @see https://tailwindcss.com/docs/place-content
           */
          'place-content': [{
            'place-content': scaleAlignPrimaryAxis()
          }],
          /**
           * Place Items
           * @see https://tailwindcss.com/docs/place-items
           */
          'place-items': [{
            'place-items': [...scaleAlignSecondaryAxis(), 'baseline']
          }],
          /**
           * Place Self
           * @see https://tailwindcss.com/docs/place-self
           */
          'place-self': [{
            'place-self': ['auto', ...scaleAlignSecondaryAxis()]
          }],
          // Spacing
          /**
           * Padding
           * @see https://tailwindcss.com/docs/padding
           */
          p: [{
            p: scaleUnambiguousSpacing()
          }],
          /**
           * Padding X
           * @see https://tailwindcss.com/docs/padding
           */
          px: [{
            px: scaleUnambiguousSpacing()
          }],
          /**
           * Padding Y
           * @see https://tailwindcss.com/docs/padding
           */
          py: [{
            py: scaleUnambiguousSpacing()
          }],
          /**
           * Padding Start
           * @see https://tailwindcss.com/docs/padding
           */
          ps: [{
            ps: scaleUnambiguousSpacing()
          }],
          /**
           * Padding End
           * @see https://tailwindcss.com/docs/padding
           */
          pe: [{
            pe: scaleUnambiguousSpacing()
          }],
          /**
           * Padding Top
           * @see https://tailwindcss.com/docs/padding
           */
          pt: [{
            pt: scaleUnambiguousSpacing()
          }],
          /**
           * Padding Right
           * @see https://tailwindcss.com/docs/padding
           */
          pr: [{
            pr: scaleUnambiguousSpacing()
          }],
          /**
           * Padding Bottom
           * @see https://tailwindcss.com/docs/padding
           */
          pb: [{
            pb: scaleUnambiguousSpacing()
          }],
          /**
           * Padding Left
           * @see https://tailwindcss.com/docs/padding
           */
          pl: [{
            pl: scaleUnambiguousSpacing()
          }],
          /**
           * Margin
           * @see https://tailwindcss.com/docs/margin
           */
          m: [{
            m: scaleMargin()
          }],
          /**
           * Margin X
           * @see https://tailwindcss.com/docs/margin
           */
          mx: [{
            mx: scaleMargin()
          }],
          /**
           * Margin Y
           * @see https://tailwindcss.com/docs/margin
           */
          my: [{
            my: scaleMargin()
          }],
          /**
           * Margin Start
           * @see https://tailwindcss.com/docs/margin
           */
          ms: [{
            ms: scaleMargin()
          }],
          /**
           * Margin End
           * @see https://tailwindcss.com/docs/margin
           */
          me: [{
            me: scaleMargin()
          }],
          /**
           * Margin Top
           * @see https://tailwindcss.com/docs/margin
           */
          mt: [{
            mt: scaleMargin()
          }],
          /**
           * Margin Right
           * @see https://tailwindcss.com/docs/margin
           */
          mr: [{
            mr: scaleMargin()
          }],
          /**
           * Margin Bottom
           * @see https://tailwindcss.com/docs/margin
           */
          mb: [{
            mb: scaleMargin()
          }],
          /**
           * Margin Left
           * @see https://tailwindcss.com/docs/margin
           */
          ml: [{
            ml: scaleMargin()
          }],
          /**
           * Space Between X
           * @see https://tailwindcss.com/docs/margin#adding-space-between-children
           */
          'space-x': [{
            'space-x': scaleUnambiguousSpacing()
          }],
          /**
           * Space Between X Reverse
           * @see https://tailwindcss.com/docs/margin#adding-space-between-children
           */
          'space-x-reverse': ['space-x-reverse'],
          /**
           * Space Between Y
           * @see https://tailwindcss.com/docs/margin#adding-space-between-children
           */
          'space-y': [{
            'space-y': scaleUnambiguousSpacing()
          }],
          /**
           * Space Between Y Reverse
           * @see https://tailwindcss.com/docs/margin#adding-space-between-children
           */
          'space-y-reverse': ['space-y-reverse'],
          // --------------
          // --- Sizing ---
          // --------------
          /**
           * Size
           * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
           */
          size: [{
            size: scaleSizing()
          }],
          /**
           * Width
           * @see https://tailwindcss.com/docs/width
           */
          w: [{
            w: [themeContainer, 'screen', ...scaleSizing()]
          }],
          /**
           * Min-Width
           * @see https://tailwindcss.com/docs/min-width
           */
          'min-w': [{
            'min-w': [themeContainer, 'screen', /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            'none', ...scaleSizing()]
          }],
          /**
           * Max-Width
           * @see https://tailwindcss.com/docs/max-width
           */
          'max-w': [{
            'max-w': [themeContainer, 'screen', 'none', /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            'prose', /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            {
              screen: [themeBreakpoint]
            }, ...scaleSizing()]
          }],
          /**
           * Height
           * @see https://tailwindcss.com/docs/height
           */
          h: [{
            h: ['screen', 'lh', ...scaleSizing()]
          }],
          /**
           * Min-Height
           * @see https://tailwindcss.com/docs/min-height
           */
          'min-h': [{
            'min-h': ['screen', 'lh', 'none', ...scaleSizing()]
          }],
          /**
           * Max-Height
           * @see https://tailwindcss.com/docs/max-height
           */
          'max-h': [{
            'max-h': ['screen', 'lh', ...scaleSizing()]
          }],
          // ------------------
          // --- Typography ---
          // ------------------
          /**
           * Font Size
           * @see https://tailwindcss.com/docs/font-size
           */
          'font-size': [{
            text: ['base', themeText, isArbitraryVariableLength, isArbitraryLength]
          }],
          /**
           * Font Smoothing
           * @see https://tailwindcss.com/docs/font-smoothing
           */
          'font-smoothing': ['antialiased', 'subpixel-antialiased'],
          /**
           * Font Style
           * @see https://tailwindcss.com/docs/font-style
           */
          'font-style': ['italic', 'not-italic'],
          /**
           * Font Weight
           * @see https://tailwindcss.com/docs/font-weight
           */
          'font-weight': [{
            font: [themeFontWeight, isArbitraryVariable, isArbitraryNumber]
          }],
          /**
           * Font Stretch
           * @see https://tailwindcss.com/docs/font-stretch
           */
          'font-stretch': [{
            'font-stretch': ['ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed', 'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded', isPercent, isArbitraryValue]
          }],
          /**
           * Font Family
           * @see https://tailwindcss.com/docs/font-family
           */
          'font-family': [{
            font: [isArbitraryVariableFamilyName, isArbitraryValue, themeFont]
          }],
          /**
           * Font Variant Numeric
           * @see https://tailwindcss.com/docs/font-variant-numeric
           */
          'fvn-normal': ['normal-nums'],
          /**
           * Font Variant Numeric
           * @see https://tailwindcss.com/docs/font-variant-numeric
           */
          'fvn-ordinal': ['ordinal'],
          /**
           * Font Variant Numeric
           * @see https://tailwindcss.com/docs/font-variant-numeric
           */
          'fvn-slashed-zero': ['slashed-zero'],
          /**
           * Font Variant Numeric
           * @see https://tailwindcss.com/docs/font-variant-numeric
           */
          'fvn-figure': ['lining-nums', 'oldstyle-nums'],
          /**
           * Font Variant Numeric
           * @see https://tailwindcss.com/docs/font-variant-numeric
           */
          'fvn-spacing': ['proportional-nums', 'tabular-nums'],
          /**
           * Font Variant Numeric
           * @see https://tailwindcss.com/docs/font-variant-numeric
           */
          'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
          /**
           * Letter Spacing
           * @see https://tailwindcss.com/docs/letter-spacing
           */
          tracking: [{
            tracking: [themeTracking, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Line Clamp
           * @see https://tailwindcss.com/docs/line-clamp
           */
          'line-clamp': [{
            'line-clamp': [isNumber, 'none', isArbitraryVariable, isArbitraryNumber]
          }],
          /**
           * Line Height
           * @see https://tailwindcss.com/docs/line-height
           */
          leading: [{
            leading: [/** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
            themeLeading, ...scaleUnambiguousSpacing()]
          }],
          /**
           * List Style Image
           * @see https://tailwindcss.com/docs/list-style-image
           */
          'list-image': [{
            'list-image': ['none', isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * List Style Position
           * @see https://tailwindcss.com/docs/list-style-position
           */
          'list-style-position': [{
            list: ['inside', 'outside']
          }],
          /**
           * List Style Type
           * @see https://tailwindcss.com/docs/list-style-type
           */
          'list-style-type': [{
            list: ['disc', 'decimal', 'none', isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Text Alignment
           * @see https://tailwindcss.com/docs/text-align
           */
          'text-alignment': [{
            text: ['left', 'center', 'right', 'justify', 'start', 'end']
          }],
          /**
           * Placeholder Color
           * @deprecated since Tailwind CSS v3.0.0
           * @see https://v3.tailwindcss.com/docs/placeholder-color
           */
          'placeholder-color': [{
            placeholder: scaleColor()
          }],
          /**
           * Text Color
           * @see https://tailwindcss.com/docs/text-color
           */
          'text-color': [{
            text: scaleColor()
          }],
          /**
           * Text Decoration
           * @see https://tailwindcss.com/docs/text-decoration
           */
          'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
          /**
           * Text Decoration Style
           * @see https://tailwindcss.com/docs/text-decoration-style
           */
          'text-decoration-style': [{
            decoration: [...scaleLineStyle(), 'wavy']
          }],
          /**
           * Text Decoration Thickness
           * @see https://tailwindcss.com/docs/text-decoration-thickness
           */
          'text-decoration-thickness': [{
            decoration: [isNumber, 'from-font', 'auto', isArbitraryVariable, isArbitraryLength]
          }],
          /**
           * Text Decoration Color
           * @see https://tailwindcss.com/docs/text-decoration-color
           */
          'text-decoration-color': [{
            decoration: scaleColor()
          }],
          /**
           * Text Underline Offset
           * @see https://tailwindcss.com/docs/text-underline-offset
           */
          'underline-offset': [{
            'underline-offset': [isNumber, 'auto', isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Text Transform
           * @see https://tailwindcss.com/docs/text-transform
           */
          'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
          /**
           * Text Overflow
           * @see https://tailwindcss.com/docs/text-overflow
           */
          'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
          /**
           * Text Wrap
           * @see https://tailwindcss.com/docs/text-wrap
           */
          'text-wrap': [{
            text: ['wrap', 'nowrap', 'balance', 'pretty']
          }],
          /**
           * Text Indent
           * @see https://tailwindcss.com/docs/text-indent
           */
          indent: [{
            indent: scaleUnambiguousSpacing()
          }],
          /**
           * Vertical Alignment
           * @see https://tailwindcss.com/docs/vertical-align
           */
          'vertical-align': [{
            align: ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom', 'sub', 'super', isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Whitespace
           * @see https://tailwindcss.com/docs/whitespace
           */
          whitespace: [{
            whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces']
          }],
          /**
           * Word Break
           * @see https://tailwindcss.com/docs/word-break
           */
          break: [{
            break: ['normal', 'words', 'all', 'keep']
          }],
          /**
           * Overflow Wrap
           * @see https://tailwindcss.com/docs/overflow-wrap
           */
          wrap: [{
            wrap: ['break-word', 'anywhere', 'normal']
          }],
          /**
           * Hyphens
           * @see https://tailwindcss.com/docs/hyphens
           */
          hyphens: [{
            hyphens: ['none', 'manual', 'auto']
          }],
          /**
           * Content
           * @see https://tailwindcss.com/docs/content
           */
          content: [{
            content: ['none', isArbitraryVariable, isArbitraryValue]
          }],
          // -------------------
          // --- Backgrounds ---
          // -------------------
          /**
           * Background Attachment
           * @see https://tailwindcss.com/docs/background-attachment
           */
          'bg-attachment': [{
            bg: ['fixed', 'local', 'scroll']
          }],
          /**
           * Background Clip
           * @see https://tailwindcss.com/docs/background-clip
           */
          'bg-clip': [{
            'bg-clip': ['border', 'padding', 'content', 'text']
          }],
          /**
           * Background Origin
           * @see https://tailwindcss.com/docs/background-origin
           */
          'bg-origin': [{
            'bg-origin': ['border', 'padding', 'content']
          }],
          /**
           * Background Position
           * @see https://tailwindcss.com/docs/background-position
           */
          'bg-position': [{
            bg: scaleBgPosition()
          }],
          /**
           * Background Repeat
           * @see https://tailwindcss.com/docs/background-repeat
           */
          'bg-repeat': [{
            bg: scaleBgRepeat()
          }],
          /**
           * Background Size
           * @see https://tailwindcss.com/docs/background-size
           */
          'bg-size': [{
            bg: scaleBgSize()
          }],
          /**
           * Background Image
           * @see https://tailwindcss.com/docs/background-image
           */
          'bg-image': [{
            bg: ['none', {
              linear: [{
                to: ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']
              }, isInteger, isArbitraryVariable, isArbitraryValue],
              radial: ['', isArbitraryVariable, isArbitraryValue],
              conic: [isInteger, isArbitraryVariable, isArbitraryValue]
            }, isArbitraryVariableImage, isArbitraryImage]
          }],
          /**
           * Background Color
           * @see https://tailwindcss.com/docs/background-color
           */
          'bg-color': [{
            bg: scaleColor()
          }],
          /**
           * Gradient Color Stops From Position
           * @see https://tailwindcss.com/docs/gradient-color-stops
           */
          'gradient-from-pos': [{
            from: scaleGradientStopPosition()
          }],
          /**
           * Gradient Color Stops Via Position
           * @see https://tailwindcss.com/docs/gradient-color-stops
           */
          'gradient-via-pos': [{
            via: scaleGradientStopPosition()
          }],
          /**
           * Gradient Color Stops To Position
           * @see https://tailwindcss.com/docs/gradient-color-stops
           */
          'gradient-to-pos': [{
            to: scaleGradientStopPosition()
          }],
          /**
           * Gradient Color Stops From
           * @see https://tailwindcss.com/docs/gradient-color-stops
           */
          'gradient-from': [{
            from: scaleColor()
          }],
          /**
           * Gradient Color Stops Via
           * @see https://tailwindcss.com/docs/gradient-color-stops
           */
          'gradient-via': [{
            via: scaleColor()
          }],
          /**
           * Gradient Color Stops To
           * @see https://tailwindcss.com/docs/gradient-color-stops
           */
          'gradient-to': [{
            to: scaleColor()
          }],
          // ---------------
          // --- Borders ---
          // ---------------
          /**
           * Border Radius
           * @see https://tailwindcss.com/docs/border-radius
           */
          rounded: [{
            rounded: scaleRadius()
          }],
          /**
           * Border Radius Start
           * @see https://tailwindcss.com/docs/border-radius
           */
          'rounded-s': [{
            'rounded-s': scaleRadius()
          }],
          /**
           * Border Radius End
           * @see https://tailwindcss.com/docs/border-radius
           */
          'rounded-e': [{
            'rounded-e': scaleRadius()
          }],
          /**
           * Border Radius Top
           * @see https://tailwindcss.com/docs/border-radius
           */
          'rounded-t': [{
            'rounded-t': scaleRadius()
          }],
          /**
           * Border Radius Right
           * @see https://tailwindcss.com/docs/border-radius
           */
          'rounded-r': [{
            'rounded-r': scaleRadius()
          }],
          /**
           * Border Radius Bottom
           * @see https://tailwindcss.com/docs/border-radius
           */
          'rounded-b': [{
            'rounded-b': scaleRadius()
          }],
          /**
           * Border Radius Left
           * @see https://tailwindcss.com/docs/border-radius
           */
          'rounded-l': [{
            'rounded-l': scaleRadius()
          }],
          /**
           * Border Radius Start Start
           * @see https://tailwindcss.com/docs/border-radius
           */
          'rounded-ss': [{
            'rounded-ss': scaleRadius()
          }],
          /**
           * Border Radius Start End
           * @see https://tailwindcss.com/docs/border-radius
           */
          'rounded-se': [{
            'rounded-se': scaleRadius()
          }],
          /**
           * Border Radius End End
           * @see https://tailwindcss.com/docs/border-radius
           */
          'rounded-ee': [{
            'rounded-ee': scaleRadius()
          }],
          /**
           * Border Radius End Start
           * @see https://tailwindcss.com/docs/border-radius
           */
          'rounded-es': [{
            'rounded-es': scaleRadius()
          }],
          /**
           * Border Radius Top Left
           * @see https://tailwindcss.com/docs/border-radius
           */
          'rounded-tl': [{
            'rounded-tl': scaleRadius()
          }],
          /**
           * Border Radius Top Right
           * @see https://tailwindcss.com/docs/border-radius
           */
          'rounded-tr': [{
            'rounded-tr': scaleRadius()
          }],
          /**
           * Border Radius Bottom Right
           * @see https://tailwindcss.com/docs/border-radius
           */
          'rounded-br': [{
            'rounded-br': scaleRadius()
          }],
          /**
           * Border Radius Bottom Left
           * @see https://tailwindcss.com/docs/border-radius
           */
          'rounded-bl': [{
            'rounded-bl': scaleRadius()
          }],
          /**
           * Border Width
           * @see https://tailwindcss.com/docs/border-width
           */
          'border-w': [{
            border: scaleBorderWidth()
          }],
          /**
           * Border Width X
           * @see https://tailwindcss.com/docs/border-width
           */
          'border-w-x': [{
            'border-x': scaleBorderWidth()
          }],
          /**
           * Border Width Y
           * @see https://tailwindcss.com/docs/border-width
           */
          'border-w-y': [{
            'border-y': scaleBorderWidth()
          }],
          /**
           * Border Width Start
           * @see https://tailwindcss.com/docs/border-width
           */
          'border-w-s': [{
            'border-s': scaleBorderWidth()
          }],
          /**
           * Border Width End
           * @see https://tailwindcss.com/docs/border-width
           */
          'border-w-e': [{
            'border-e': scaleBorderWidth()
          }],
          /**
           * Border Width Top
           * @see https://tailwindcss.com/docs/border-width
           */
          'border-w-t': [{
            'border-t': scaleBorderWidth()
          }],
          /**
           * Border Width Right
           * @see https://tailwindcss.com/docs/border-width
           */
          'border-w-r': [{
            'border-r': scaleBorderWidth()
          }],
          /**
           * Border Width Bottom
           * @see https://tailwindcss.com/docs/border-width
           */
          'border-w-b': [{
            'border-b': scaleBorderWidth()
          }],
          /**
           * Border Width Left
           * @see https://tailwindcss.com/docs/border-width
           */
          'border-w-l': [{
            'border-l': scaleBorderWidth()
          }],
          /**
           * Divide Width X
           * @see https://tailwindcss.com/docs/border-width#between-children
           */
          'divide-x': [{
            'divide-x': scaleBorderWidth()
          }],
          /**
           * Divide Width X Reverse
           * @see https://tailwindcss.com/docs/border-width#between-children
           */
          'divide-x-reverse': ['divide-x-reverse'],
          /**
           * Divide Width Y
           * @see https://tailwindcss.com/docs/border-width#between-children
           */
          'divide-y': [{
            'divide-y': scaleBorderWidth()
          }],
          /**
           * Divide Width Y Reverse
           * @see https://tailwindcss.com/docs/border-width#between-children
           */
          'divide-y-reverse': ['divide-y-reverse'],
          /**
           * Border Style
           * @see https://tailwindcss.com/docs/border-style
           */
          'border-style': [{
            border: [...scaleLineStyle(), 'hidden', 'none']
          }],
          /**
           * Divide Style
           * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
           */
          'divide-style': [{
            divide: [...scaleLineStyle(), 'hidden', 'none']
          }],
          /**
           * Border Color
           * @see https://tailwindcss.com/docs/border-color
           */
          'border-color': [{
            border: scaleColor()
          }],
          /**
           * Border Color X
           * @see https://tailwindcss.com/docs/border-color
           */
          'border-color-x': [{
            'border-x': scaleColor()
          }],
          /**
           * Border Color Y
           * @see https://tailwindcss.com/docs/border-color
           */
          'border-color-y': [{
            'border-y': scaleColor()
          }],
          /**
           * Border Color S
           * @see https://tailwindcss.com/docs/border-color
           */
          'border-color-s': [{
            'border-s': scaleColor()
          }],
          /**
           * Border Color E
           * @see https://tailwindcss.com/docs/border-color
           */
          'border-color-e': [{
            'border-e': scaleColor()
          }],
          /**
           * Border Color Top
           * @see https://tailwindcss.com/docs/border-color
           */
          'border-color-t': [{
            'border-t': scaleColor()
          }],
          /**
           * Border Color Right
           * @see https://tailwindcss.com/docs/border-color
           */
          'border-color-r': [{
            'border-r': scaleColor()
          }],
          /**
           * Border Color Bottom
           * @see https://tailwindcss.com/docs/border-color
           */
          'border-color-b': [{
            'border-b': scaleColor()
          }],
          /**
           * Border Color Left
           * @see https://tailwindcss.com/docs/border-color
           */
          'border-color-l': [{
            'border-l': scaleColor()
          }],
          /**
           * Divide Color
           * @see https://tailwindcss.com/docs/divide-color
           */
          'divide-color': [{
            divide: scaleColor()
          }],
          /**
           * Outline Style
           * @see https://tailwindcss.com/docs/outline-style
           */
          'outline-style': [{
            outline: [...scaleLineStyle(), 'none', 'hidden']
          }],
          /**
           * Outline Offset
           * @see https://tailwindcss.com/docs/outline-offset
           */
          'outline-offset': [{
            'outline-offset': [isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Outline Width
           * @see https://tailwindcss.com/docs/outline-width
           */
          'outline-w': [{
            outline: ['', isNumber, isArbitraryVariableLength, isArbitraryLength]
          }],
          /**
           * Outline Color
           * @see https://tailwindcss.com/docs/outline-color
           */
          'outline-color': [{
            outline: scaleColor()
          }],
          // ---------------
          // --- Effects ---
          // ---------------
          /**
           * Box Shadow
           * @see https://tailwindcss.com/docs/box-shadow
           */
          shadow: [{
            shadow: [
            // Deprecated since Tailwind CSS v4.0.0
            '', 'none', themeShadow, isArbitraryVariableShadow, isArbitraryShadow]
          }],
          /**
           * Box Shadow Color
           * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
           */
          'shadow-color': [{
            shadow: scaleColor()
          }],
          /**
           * Inset Box Shadow
           * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
           */
          'inset-shadow': [{
            'inset-shadow': ['none', themeInsetShadow, isArbitraryVariableShadow, isArbitraryShadow]
          }],
          /**
           * Inset Box Shadow Color
           * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
           */
          'inset-shadow-color': [{
            'inset-shadow': scaleColor()
          }],
          /**
           * Ring Width
           * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
           */
          'ring-w': [{
            ring: scaleBorderWidth()
          }],
          /**
           * Ring Width Inset
           * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
           * @deprecated since Tailwind CSS v4.0.0
           * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
           */
          'ring-w-inset': ['ring-inset'],
          /**
           * Ring Color
           * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
           */
          'ring-color': [{
            ring: scaleColor()
          }],
          /**
           * Ring Offset Width
           * @see https://v3.tailwindcss.com/docs/ring-offset-width
           * @deprecated since Tailwind CSS v4.0.0
           * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
           */
          'ring-offset-w': [{
            'ring-offset': [isNumber, isArbitraryLength]
          }],
          /**
           * Ring Offset Color
           * @see https://v3.tailwindcss.com/docs/ring-offset-color
           * @deprecated since Tailwind CSS v4.0.0
           * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
           */
          'ring-offset-color': [{
            'ring-offset': scaleColor()
          }],
          /**
           * Inset Ring Width
           * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
           */
          'inset-ring-w': [{
            'inset-ring': scaleBorderWidth()
          }],
          /**
           * Inset Ring Color
           * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
           */
          'inset-ring-color': [{
            'inset-ring': scaleColor()
          }],
          /**
           * Text Shadow
           * @see https://tailwindcss.com/docs/text-shadow
           */
          'text-shadow': [{
            'text-shadow': ['none', themeTextShadow, isArbitraryVariableShadow, isArbitraryShadow]
          }],
          /**
           * Text Shadow Color
           * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
           */
          'text-shadow-color': [{
            'text-shadow': scaleColor()
          }],
          /**
           * Opacity
           * @see https://tailwindcss.com/docs/opacity
           */
          opacity: [{
            opacity: [isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Mix Blend Mode
           * @see https://tailwindcss.com/docs/mix-blend-mode
           */
          'mix-blend': [{
            'mix-blend': [...scaleBlendMode(), 'plus-darker', 'plus-lighter']
          }],
          /**
           * Background Blend Mode
           * @see https://tailwindcss.com/docs/background-blend-mode
           */
          'bg-blend': [{
            'bg-blend': scaleBlendMode()
          }],
          /**
           * Mask Clip
           * @see https://tailwindcss.com/docs/mask-clip
           */
          'mask-clip': [{
            'mask-clip': ['border', 'padding', 'content', 'fill', 'stroke', 'view']
          }, 'mask-no-clip'],
          /**
           * Mask Composite
           * @see https://tailwindcss.com/docs/mask-composite
           */
          'mask-composite': [{
            mask: ['add', 'subtract', 'intersect', 'exclude']
          }],
          /**
           * Mask Image
           * @see https://tailwindcss.com/docs/mask-image
           */
          'mask-image-linear-pos': [{
            'mask-linear': [isNumber]
          }],
          'mask-image-linear-from-pos': [{
            'mask-linear-from': scaleMaskImagePosition()
          }],
          'mask-image-linear-to-pos': [{
            'mask-linear-to': scaleMaskImagePosition()
          }],
          'mask-image-linear-from-color': [{
            'mask-linear-from': scaleColor()
          }],
          'mask-image-linear-to-color': [{
            'mask-linear-to': scaleColor()
          }],
          'mask-image-t-from-pos': [{
            'mask-t-from': scaleMaskImagePosition()
          }],
          'mask-image-t-to-pos': [{
            'mask-t-to': scaleMaskImagePosition()
          }],
          'mask-image-t-from-color': [{
            'mask-t-from': scaleColor()
          }],
          'mask-image-t-to-color': [{
            'mask-t-to': scaleColor()
          }],
          'mask-image-r-from-pos': [{
            'mask-r-from': scaleMaskImagePosition()
          }],
          'mask-image-r-to-pos': [{
            'mask-r-to': scaleMaskImagePosition()
          }],
          'mask-image-r-from-color': [{
            'mask-r-from': scaleColor()
          }],
          'mask-image-r-to-color': [{
            'mask-r-to': scaleColor()
          }],
          'mask-image-b-from-pos': [{
            'mask-b-from': scaleMaskImagePosition()
          }],
          'mask-image-b-to-pos': [{
            'mask-b-to': scaleMaskImagePosition()
          }],
          'mask-image-b-from-color': [{
            'mask-b-from': scaleColor()
          }],
          'mask-image-b-to-color': [{
            'mask-b-to': scaleColor()
          }],
          'mask-image-l-from-pos': [{
            'mask-l-from': scaleMaskImagePosition()
          }],
          'mask-image-l-to-pos': [{
            'mask-l-to': scaleMaskImagePosition()
          }],
          'mask-image-l-from-color': [{
            'mask-l-from': scaleColor()
          }],
          'mask-image-l-to-color': [{
            'mask-l-to': scaleColor()
          }],
          'mask-image-x-from-pos': [{
            'mask-x-from': scaleMaskImagePosition()
          }],
          'mask-image-x-to-pos': [{
            'mask-x-to': scaleMaskImagePosition()
          }],
          'mask-image-x-from-color': [{
            'mask-x-from': scaleColor()
          }],
          'mask-image-x-to-color': [{
            'mask-x-to': scaleColor()
          }],
          'mask-image-y-from-pos': [{
            'mask-y-from': scaleMaskImagePosition()
          }],
          'mask-image-y-to-pos': [{
            'mask-y-to': scaleMaskImagePosition()
          }],
          'mask-image-y-from-color': [{
            'mask-y-from': scaleColor()
          }],
          'mask-image-y-to-color': [{
            'mask-y-to': scaleColor()
          }],
          'mask-image-radial': [{
            'mask-radial': [isArbitraryVariable, isArbitraryValue]
          }],
          'mask-image-radial-from-pos': [{
            'mask-radial-from': scaleMaskImagePosition()
          }],
          'mask-image-radial-to-pos': [{
            'mask-radial-to': scaleMaskImagePosition()
          }],
          'mask-image-radial-from-color': [{
            'mask-radial-from': scaleColor()
          }],
          'mask-image-radial-to-color': [{
            'mask-radial-to': scaleColor()
          }],
          'mask-image-radial-shape': [{
            'mask-radial': ['circle', 'ellipse']
          }],
          'mask-image-radial-size': [{
            'mask-radial': [{
              closest: ['side', 'corner'],
              farthest: ['side', 'corner']
            }]
          }],
          'mask-image-radial-pos': [{
            'mask-radial-at': scalePosition()
          }],
          'mask-image-conic-pos': [{
            'mask-conic': [isNumber]
          }],
          'mask-image-conic-from-pos': [{
            'mask-conic-from': scaleMaskImagePosition()
          }],
          'mask-image-conic-to-pos': [{
            'mask-conic-to': scaleMaskImagePosition()
          }],
          'mask-image-conic-from-color': [{
            'mask-conic-from': scaleColor()
          }],
          'mask-image-conic-to-color': [{
            'mask-conic-to': scaleColor()
          }],
          /**
           * Mask Mode
           * @see https://tailwindcss.com/docs/mask-mode
           */
          'mask-mode': [{
            mask: ['alpha', 'luminance', 'match']
          }],
          /**
           * Mask Origin
           * @see https://tailwindcss.com/docs/mask-origin
           */
          'mask-origin': [{
            'mask-origin': ['border', 'padding', 'content', 'fill', 'stroke', 'view']
          }],
          /**
           * Mask Position
           * @see https://tailwindcss.com/docs/mask-position
           */
          'mask-position': [{
            mask: scaleBgPosition()
          }],
          /**
           * Mask Repeat
           * @see https://tailwindcss.com/docs/mask-repeat
           */
          'mask-repeat': [{
            mask: scaleBgRepeat()
          }],
          /**
           * Mask Size
           * @see https://tailwindcss.com/docs/mask-size
           */
          'mask-size': [{
            mask: scaleBgSize()
          }],
          /**
           * Mask Type
           * @see https://tailwindcss.com/docs/mask-type
           */
          'mask-type': [{
            'mask-type': ['alpha', 'luminance']
          }],
          /**
           * Mask Image
           * @see https://tailwindcss.com/docs/mask-image
           */
          'mask-image': [{
            mask: ['none', isArbitraryVariable, isArbitraryValue]
          }],
          // ---------------
          // --- Filters ---
          // ---------------
          /**
           * Filter
           * @see https://tailwindcss.com/docs/filter
           */
          filter: [{
            filter: [
            // Deprecated since Tailwind CSS v3.0.0
            '', 'none', isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Blur
           * @see https://tailwindcss.com/docs/blur
           */
          blur: [{
            blur: scaleBlur()
          }],
          /**
           * Brightness
           * @see https://tailwindcss.com/docs/brightness
           */
          brightness: [{
            brightness: [isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Contrast
           * @see https://tailwindcss.com/docs/contrast
           */
          contrast: [{
            contrast: [isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Drop Shadow
           * @see https://tailwindcss.com/docs/drop-shadow
           */
          'drop-shadow': [{
            'drop-shadow': [
            // Deprecated since Tailwind CSS v4.0.0
            '', 'none', themeDropShadow, isArbitraryVariableShadow, isArbitraryShadow]
          }],
          /**
           * Drop Shadow Color
           * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
           */
          'drop-shadow-color': [{
            'drop-shadow': scaleColor()
          }],
          /**
           * Grayscale
           * @see https://tailwindcss.com/docs/grayscale
           */
          grayscale: [{
            grayscale: ['', isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Hue Rotate
           * @see https://tailwindcss.com/docs/hue-rotate
           */
          'hue-rotate': [{
            'hue-rotate': [isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Invert
           * @see https://tailwindcss.com/docs/invert
           */
          invert: [{
            invert: ['', isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Saturate
           * @see https://tailwindcss.com/docs/saturate
           */
          saturate: [{
            saturate: [isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Sepia
           * @see https://tailwindcss.com/docs/sepia
           */
          sepia: [{
            sepia: ['', isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Backdrop Filter
           * @see https://tailwindcss.com/docs/backdrop-filter
           */
          'backdrop-filter': [{
            'backdrop-filter': [
            // Deprecated since Tailwind CSS v3.0.0
            '', 'none', isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Backdrop Blur
           * @see https://tailwindcss.com/docs/backdrop-blur
           */
          'backdrop-blur': [{
            'backdrop-blur': scaleBlur()
          }],
          /**
           * Backdrop Brightness
           * @see https://tailwindcss.com/docs/backdrop-brightness
           */
          'backdrop-brightness': [{
            'backdrop-brightness': [isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Backdrop Contrast
           * @see https://tailwindcss.com/docs/backdrop-contrast
           */
          'backdrop-contrast': [{
            'backdrop-contrast': [isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Backdrop Grayscale
           * @see https://tailwindcss.com/docs/backdrop-grayscale
           */
          'backdrop-grayscale': [{
            'backdrop-grayscale': ['', isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Backdrop Hue Rotate
           * @see https://tailwindcss.com/docs/backdrop-hue-rotate
           */
          'backdrop-hue-rotate': [{
            'backdrop-hue-rotate': [isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Backdrop Invert
           * @see https://tailwindcss.com/docs/backdrop-invert
           */
          'backdrop-invert': [{
            'backdrop-invert': ['', isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Backdrop Opacity
           * @see https://tailwindcss.com/docs/backdrop-opacity
           */
          'backdrop-opacity': [{
            'backdrop-opacity': [isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Backdrop Saturate
           * @see https://tailwindcss.com/docs/backdrop-saturate
           */
          'backdrop-saturate': [{
            'backdrop-saturate': [isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Backdrop Sepia
           * @see https://tailwindcss.com/docs/backdrop-sepia
           */
          'backdrop-sepia': [{
            'backdrop-sepia': ['', isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          // --------------
          // --- Tables ---
          // --------------
          /**
           * Border Collapse
           * @see https://tailwindcss.com/docs/border-collapse
           */
          'border-collapse': [{
            border: ['collapse', 'separate']
          }],
          /**
           * Border Spacing
           * @see https://tailwindcss.com/docs/border-spacing
           */
          'border-spacing': [{
            'border-spacing': scaleUnambiguousSpacing()
          }],
          /**
           * Border Spacing X
           * @see https://tailwindcss.com/docs/border-spacing
           */
          'border-spacing-x': [{
            'border-spacing-x': scaleUnambiguousSpacing()
          }],
          /**
           * Border Spacing Y
           * @see https://tailwindcss.com/docs/border-spacing
           */
          'border-spacing-y': [{
            'border-spacing-y': scaleUnambiguousSpacing()
          }],
          /**
           * Table Layout
           * @see https://tailwindcss.com/docs/table-layout
           */
          'table-layout': [{
            table: ['auto', 'fixed']
          }],
          /**
           * Caption Side
           * @see https://tailwindcss.com/docs/caption-side
           */
          caption: [{
            caption: ['top', 'bottom']
          }],
          // ---------------------------------
          // --- Transitions and Animation ---
          // ---------------------------------
          /**
           * Transition Property
           * @see https://tailwindcss.com/docs/transition-property
           */
          transition: [{
            transition: ['', 'all', 'colors', 'opacity', 'shadow', 'transform', 'none', isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Transition Behavior
           * @see https://tailwindcss.com/docs/transition-behavior
           */
          'transition-behavior': [{
            transition: ['normal', 'discrete']
          }],
          /**
           * Transition Duration
           * @see https://tailwindcss.com/docs/transition-duration
           */
          duration: [{
            duration: [isNumber, 'initial', isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Transition Timing Function
           * @see https://tailwindcss.com/docs/transition-timing-function
           */
          ease: [{
            ease: ['linear', 'initial', themeEase, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Transition Delay
           * @see https://tailwindcss.com/docs/transition-delay
           */
          delay: [{
            delay: [isNumber, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Animation
           * @see https://tailwindcss.com/docs/animation
           */
          animate: [{
            animate: ['none', themeAnimate, isArbitraryVariable, isArbitraryValue]
          }],
          // ------------------
          // --- Transforms ---
          // ------------------
          /**
           * Backface Visibility
           * @see https://tailwindcss.com/docs/backface-visibility
           */
          backface: [{
            backface: ['hidden', 'visible']
          }],
          /**
           * Perspective
           * @see https://tailwindcss.com/docs/perspective
           */
          perspective: [{
            perspective: [themePerspective, isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Perspective Origin
           * @see https://tailwindcss.com/docs/perspective-origin
           */
          'perspective-origin': [{
            'perspective-origin': scalePositionWithArbitrary()
          }],
          /**
           * Rotate
           * @see https://tailwindcss.com/docs/rotate
           */
          rotate: [{
            rotate: scaleRotate()
          }],
          /**
           * Rotate X
           * @see https://tailwindcss.com/docs/rotate
           */
          'rotate-x': [{
            'rotate-x': scaleRotate()
          }],
          /**
           * Rotate Y
           * @see https://tailwindcss.com/docs/rotate
           */
          'rotate-y': [{
            'rotate-y': scaleRotate()
          }],
          /**
           * Rotate Z
           * @see https://tailwindcss.com/docs/rotate
           */
          'rotate-z': [{
            'rotate-z': scaleRotate()
          }],
          /**
           * Scale
           * @see https://tailwindcss.com/docs/scale
           */
          scale: [{
            scale: scaleScale()
          }],
          /**
           * Scale X
           * @see https://tailwindcss.com/docs/scale
           */
          'scale-x': [{
            'scale-x': scaleScale()
          }],
          /**
           * Scale Y
           * @see https://tailwindcss.com/docs/scale
           */
          'scale-y': [{
            'scale-y': scaleScale()
          }],
          /**
           * Scale Z
           * @see https://tailwindcss.com/docs/scale
           */
          'scale-z': [{
            'scale-z': scaleScale()
          }],
          /**
           * Scale 3D
           * @see https://tailwindcss.com/docs/scale
           */
          'scale-3d': ['scale-3d'],
          /**
           * Skew
           * @see https://tailwindcss.com/docs/skew
           */
          skew: [{
            skew: scaleSkew()
          }],
          /**
           * Skew X
           * @see https://tailwindcss.com/docs/skew
           */
          'skew-x': [{
            'skew-x': scaleSkew()
          }],
          /**
           * Skew Y
           * @see https://tailwindcss.com/docs/skew
           */
          'skew-y': [{
            'skew-y': scaleSkew()
          }],
          /**
           * Transform
           * @see https://tailwindcss.com/docs/transform
           */
          transform: [{
            transform: [isArbitraryVariable, isArbitraryValue, '', 'none', 'gpu', 'cpu']
          }],
          /**
           * Transform Origin
           * @see https://tailwindcss.com/docs/transform-origin
           */
          'transform-origin': [{
            origin: scalePositionWithArbitrary()
          }],
          /**
           * Transform Style
           * @see https://tailwindcss.com/docs/transform-style
           */
          'transform-style': [{
            transform: ['3d', 'flat']
          }],
          /**
           * Translate
           * @see https://tailwindcss.com/docs/translate
           */
          translate: [{
            translate: scaleTranslate()
          }],
          /**
           * Translate X
           * @see https://tailwindcss.com/docs/translate
           */
          'translate-x': [{
            'translate-x': scaleTranslate()
          }],
          /**
           * Translate Y
           * @see https://tailwindcss.com/docs/translate
           */
          'translate-y': [{
            'translate-y': scaleTranslate()
          }],
          /**
           * Translate Z
           * @see https://tailwindcss.com/docs/translate
           */
          'translate-z': [{
            'translate-z': scaleTranslate()
          }],
          /**
           * Translate None
           * @see https://tailwindcss.com/docs/translate
           */
          'translate-none': ['translate-none'],
          // ---------------------
          // --- Interactivity ---
          // ---------------------
          /**
           * Accent Color
           * @see https://tailwindcss.com/docs/accent-color
           */
          accent: [{
            accent: scaleColor()
          }],
          /**
           * Appearance
           * @see https://tailwindcss.com/docs/appearance
           */
          appearance: [{
            appearance: ['none', 'auto']
          }],
          /**
           * Caret Color
           * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
           */
          'caret-color': [{
            caret: scaleColor()
          }],
          /**
           * Color Scheme
           * @see https://tailwindcss.com/docs/color-scheme
           */
          'color-scheme': [{
            scheme: ['normal', 'dark', 'light', 'light-dark', 'only-dark', 'only-light']
          }],
          /**
           * Cursor
           * @see https://tailwindcss.com/docs/cursor
           */
          cursor: [{
            cursor: ['auto', 'default', 'pointer', 'wait', 'text', 'move', 'help', 'not-allowed', 'none', 'context-menu', 'progress', 'cell', 'crosshair', 'vertical-text', 'alias', 'copy', 'no-drop', 'grab', 'grabbing', 'all-scroll', 'col-resize', 'row-resize', 'n-resize', 'e-resize', 's-resize', 'w-resize', 'ne-resize', 'nw-resize', 'se-resize', 'sw-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'zoom-in', 'zoom-out', isArbitraryVariable, isArbitraryValue]
          }],
          /**
           * Field Sizing
           * @see https://tailwindcss.com/docs/field-sizing
           */
          'field-sizing': [{
            'field-sizing': ['fixed', 'content']
          }],
          /**
           * Pointer Events
           * @see https://tailwindcss.com/docs/pointer-events
           */
          'pointer-events': [{
            'pointer-events': ['auto', 'none']
          }],
          /**
           * Resize
           * @see https://tailwindcss.com/docs/resize
           */
          resize: [{
            resize: ['none', '', 'y', 'x']
          }],
          /**
           * Scroll Behavior
           * @see https://tailwindcss.com/docs/scroll-behavior
           */
          'scroll-behavior': [{
            scroll: ['auto', 'smooth']
          }],
          /**
           * Scroll Margin
           * @see https://tailwindcss.com/docs/scroll-margin
           */
          'scroll-m': [{
            'scroll-m': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Margin X
           * @see https://tailwindcss.com/docs/scroll-margin
           */
          'scroll-mx': [{
            'scroll-mx': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Margin Y
           * @see https://tailwindcss.com/docs/scroll-margin
           */
          'scroll-my': [{
            'scroll-my': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Margin Start
           * @see https://tailwindcss.com/docs/scroll-margin
           */
          'scroll-ms': [{
            'scroll-ms': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Margin End
           * @see https://tailwindcss.com/docs/scroll-margin
           */
          'scroll-me': [{
            'scroll-me': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Margin Top
           * @see https://tailwindcss.com/docs/scroll-margin
           */
          'scroll-mt': [{
            'scroll-mt': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Margin Right
           * @see https://tailwindcss.com/docs/scroll-margin
           */
          'scroll-mr': [{
            'scroll-mr': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Margin Bottom
           * @see https://tailwindcss.com/docs/scroll-margin
           */
          'scroll-mb': [{
            'scroll-mb': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Margin Left
           * @see https://tailwindcss.com/docs/scroll-margin
           */
          'scroll-ml': [{
            'scroll-ml': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Padding
           * @see https://tailwindcss.com/docs/scroll-padding
           */
          'scroll-p': [{
            'scroll-p': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Padding X
           * @see https://tailwindcss.com/docs/scroll-padding
           */
          'scroll-px': [{
            'scroll-px': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Padding Y
           * @see https://tailwindcss.com/docs/scroll-padding
           */
          'scroll-py': [{
            'scroll-py': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Padding Start
           * @see https://tailwindcss.com/docs/scroll-padding
           */
          'scroll-ps': [{
            'scroll-ps': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Padding End
           * @see https://tailwindcss.com/docs/scroll-padding
           */
          'scroll-pe': [{
            'scroll-pe': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Padding Top
           * @see https://tailwindcss.com/docs/scroll-padding
           */
          'scroll-pt': [{
            'scroll-pt': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Padding Right
           * @see https://tailwindcss.com/docs/scroll-padding
           */
          'scroll-pr': [{
            'scroll-pr': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Padding Bottom
           * @see https://tailwindcss.com/docs/scroll-padding
           */
          'scroll-pb': [{
            'scroll-pb': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Padding Left
           * @see https://tailwindcss.com/docs/scroll-padding
           */
          'scroll-pl': [{
            'scroll-pl': scaleUnambiguousSpacing()
          }],
          /**
           * Scroll Snap Align
           * @see https://tailwindcss.com/docs/scroll-snap-align
           */
          'snap-align': [{
            snap: ['start', 'end', 'center', 'align-none']
          }],
          /**
           * Scroll Snap Stop
           * @see https://tailwindcss.com/docs/scroll-snap-stop
           */
          'snap-stop': [{
            snap: ['normal', 'always']
          }],
          /**
           * Scroll Snap Type
           * @see https://tailwindcss.com/docs/scroll-snap-type
           */
          'snap-type': [{
            snap: ['none', 'x', 'y', 'both']
          }],
          /**
           * Scroll Snap Type Strictness
           * @see https://tailwindcss.com/docs/scroll-snap-type
           */
          'snap-strictness': [{
            snap: ['mandatory', 'proximity']
          }],
          /**
           * Touch Action
           * @see https://tailwindcss.com/docs/touch-action
           */
          touch: [{
            touch: ['auto', 'none', 'manipulation']
          }],
          /**
           * Touch Action X
           * @see https://tailwindcss.com/docs/touch-action
           */
          'touch-x': [{
            'touch-pan': ['x', 'left', 'right']
          }],
          /**
           * Touch Action Y
           * @see https://tailwindcss.com/docs/touch-action
           */
          'touch-y': [{
            'touch-pan': ['y', 'up', 'down']
          }],
          /**
           * Touch Action Pinch Zoom
           * @see https://tailwindcss.com/docs/touch-action
           */
          'touch-pz': ['touch-pinch-zoom'],
          /**
           * User Select
           * @see https://tailwindcss.com/docs/user-select
           */
          select: [{
            select: ['none', 'text', 'all', 'auto']
          }],
          /**
           * Will Change
           * @see https://tailwindcss.com/docs/will-change
           */
          'will-change': [{
            'will-change': ['auto', 'scroll', 'contents', 'transform', isArbitraryVariable, isArbitraryValue]
          }],
          // -----------
          // --- SVG ---
          // -----------
          /**
           * Fill
           * @see https://tailwindcss.com/docs/fill
           */
          fill: [{
            fill: ['none', ...scaleColor()]
          }],
          /**
           * Stroke Width
           * @see https://tailwindcss.com/docs/stroke-width
           */
          'stroke-w': [{
            stroke: [isNumber, isArbitraryVariableLength, isArbitraryLength, isArbitraryNumber]
          }],
          /**
           * Stroke
           * @see https://tailwindcss.com/docs/stroke
           */
          stroke: [{
            stroke: ['none', ...scaleColor()]
          }],
          // ---------------------
          // --- Accessibility ---
          // ---------------------
          /**
           * Forced Color Adjust
           * @see https://tailwindcss.com/docs/forced-color-adjust
           */
          'forced-color-adjust': [{
            'forced-color-adjust': ['auto', 'none']
          }]
        },
        conflictingClassGroups: {
          overflow: ['overflow-x', 'overflow-y'],
          overscroll: ['overscroll-x', 'overscroll-y'],
          inset: ['inset-x', 'inset-y', 'start', 'end', 'top', 'right', 'bottom', 'left'],
          'inset-x': ['right', 'left'],
          'inset-y': ['top', 'bottom'],
          flex: ['basis', 'grow', 'shrink'],
          gap: ['gap-x', 'gap-y'],
          p: ['px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl'],
          px: ['pr', 'pl'],
          py: ['pt', 'pb'],
          m: ['mx', 'my', 'ms', 'me', 'mt', 'mr', 'mb', 'ml'],
          mx: ['mr', 'ml'],
          my: ['mt', 'mb'],
          size: ['w', 'h'],
          'font-size': ['leading'],
          'fvn-normal': ['fvn-ordinal', 'fvn-slashed-zero', 'fvn-figure', 'fvn-spacing', 'fvn-fraction'],
          'fvn-ordinal': ['fvn-normal'],
          'fvn-slashed-zero': ['fvn-normal'],
          'fvn-figure': ['fvn-normal'],
          'fvn-spacing': ['fvn-normal'],
          'fvn-fraction': ['fvn-normal'],
          'line-clamp': ['display', 'overflow'],
          rounded: ['rounded-s', 'rounded-e', 'rounded-t', 'rounded-r', 'rounded-b', 'rounded-l', 'rounded-ss', 'rounded-se', 'rounded-ee', 'rounded-es', 'rounded-tl', 'rounded-tr', 'rounded-br', 'rounded-bl'],
          'rounded-s': ['rounded-ss', 'rounded-es'],
          'rounded-e': ['rounded-se', 'rounded-ee'],
          'rounded-t': ['rounded-tl', 'rounded-tr'],
          'rounded-r': ['rounded-tr', 'rounded-br'],
          'rounded-b': ['rounded-br', 'rounded-bl'],
          'rounded-l': ['rounded-tl', 'rounded-bl'],
          'border-spacing': ['border-spacing-x', 'border-spacing-y'],
          'border-w': ['border-w-x', 'border-w-y', 'border-w-s', 'border-w-e', 'border-w-t', 'border-w-r', 'border-w-b', 'border-w-l'],
          'border-w-x': ['border-w-r', 'border-w-l'],
          'border-w-y': ['border-w-t', 'border-w-b'],
          'border-color': ['border-color-x', 'border-color-y', 'border-color-s', 'border-color-e', 'border-color-t', 'border-color-r', 'border-color-b', 'border-color-l'],
          'border-color-x': ['border-color-r', 'border-color-l'],
          'border-color-y': ['border-color-t', 'border-color-b'],
          translate: ['translate-x', 'translate-y', 'translate-none'],
          'translate-none': ['translate', 'translate-x', 'translate-y', 'translate-z'],
          'scroll-m': ['scroll-mx', 'scroll-my', 'scroll-ms', 'scroll-me', 'scroll-mt', 'scroll-mr', 'scroll-mb', 'scroll-ml'],
          'scroll-mx': ['scroll-mr', 'scroll-ml'],
          'scroll-my': ['scroll-mt', 'scroll-mb'],
          'scroll-p': ['scroll-px', 'scroll-py', 'scroll-ps', 'scroll-pe', 'scroll-pt', 'scroll-pr', 'scroll-pb', 'scroll-pl'],
          'scroll-px': ['scroll-pr', 'scroll-pl'],
          'scroll-py': ['scroll-pt', 'scroll-pb'],
          touch: ['touch-x', 'touch-y', 'touch-pz'],
          'touch-x': ['touch'],
          'touch-y': ['touch'],
          'touch-pz': ['touch']
        },
        conflictingClassGroupModifiers: {
          'font-size': ['leading']
        },
        orderSensitiveModifiers: ['*', '**', 'after', 'backdrop', 'before', 'details-content', 'file', 'first-letter', 'first-line', 'marker', 'placeholder', 'selection']
      };
    };
    const twMerge = /*#__PURE__*/createTailwindMerge(getDefaultConfig);

    function cn(...inputs) {
        return twMerge(clsx(inputs));
    }

    const buttonVariants = cva("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    });
    const Button = React__namespace.forwardRef((_a, ref) => {
        var { className, variant, size, asChild = false } = _a, props = __rest(_a, ["className", "variant", "size", "asChild"]);
        const Comp = asChild ? Slot : "button";
        return (jsxRuntime.jsx(Comp, Object.assign({ className: cn(buttonVariants({ variant, size, className })), ref: ref }, props)));
    });
    Button.displayName = "Button";

    function Input(_a) {
        var { className, type } = _a, props = __rest(_a, ["className", "type"]);
        return (jsxRuntime.jsx("input", Object.assign({ type: type, "data-slot": "input", className: cn("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className) }, props)));
    }

    // src/primitive.tsx
    var NODES = [
      "a",
      "button",
      "div",
      "form",
      "h2",
      "h3",
      "img",
      "input",
      "label",
      "li",
      "nav",
      "ol",
      "p",
      "select",
      "span",
      "svg",
      "ul"
    ];
    var Primitive = NODES.reduce((primitive, node) => {
      const Slot = createSlot(`Primitive.${node}`);
      const Node = React__namespace.forwardRef((props, forwardedRef) => {
        const { asChild, ...primitiveProps } = props;
        const Comp = asChild ? Slot : node;
        if (typeof window !== "undefined") {
          window[Symbol.for("radix-ui")] = true;
        }
        return /* @__PURE__ */ jsxRuntime.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
      });
      Node.displayName = `Primitive.${node}`;
      return { ...primitive, [node]: Node };
    }, {});

    var NAME = "Label";
    var Label$1 = React__namespace.forwardRef((props, forwardedRef) => {
      return /* @__PURE__ */ jsxRuntime.jsx(
        Primitive.label,
        {
          ...props,
          ref: forwardedRef,
          onMouseDown: (event) => {
            const target = event.target;
            if (target.closest("button, input, select, textarea")) return;
            props.onMouseDown?.(event);
            if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
          }
        }
      );
    });
    Label$1.displayName = NAME;
    var Root$1 = Label$1;

    const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
    const Label = React__namespace.forwardRef((_a, ref) => {
        var { className } = _a, props = __rest(_a, ["className"]);
        return (jsxRuntime.jsx(Root$1, Object.assign({ ref: ref, className: cn(labelVariants(), className) }, props)));
    });
    Label.displayName = Root$1.displayName;

    const Card = React__namespace.forwardRef((_a, ref) => {
        var { className } = _a, props = __rest(_a, ["className"]);
        return (jsxRuntime.jsx("div", Object.assign({ ref: ref, className: cn("rounded-lg border bg-card text-card-foreground shadow-sm", className) }, props)));
    });
    Card.displayName = "Card";
    const CardHeader = React__namespace.forwardRef((_a, ref) => {
        var { className } = _a, props = __rest(_a, ["className"]);
        return (jsxRuntime.jsx("div", Object.assign({ ref: ref, className: cn("flex flex-col space-y-1.5 p-6", className) }, props)));
    });
    CardHeader.displayName = "CardHeader";
    const CardTitle = React__namespace.forwardRef((_a, ref) => {
        var { className } = _a, props = __rest(_a, ["className"]);
        return (jsxRuntime.jsx("h3", Object.assign({ ref: ref, className: cn("text-2xl font-semibold leading-none tracking-tight", className) }, props)));
    });
    CardTitle.displayName = "CardTitle";
    const CardDescription = React__namespace.forwardRef((_a, ref) => {
        var { className } = _a, props = __rest(_a, ["className"]);
        return (jsxRuntime.jsx("p", Object.assign({ ref: ref, className: cn("text-sm text-muted-foreground", className) }, props)));
    });
    CardDescription.displayName = "CardDescription";
    const CardContent = React__namespace.forwardRef((_a, ref) => {
        var { className } = _a, props = __rest(_a, ["className"]);
        return (jsxRuntime.jsx("div", Object.assign({ ref: ref, className: cn("p-6 pt-0", className) }, props)));
    });
    CardContent.displayName = "CardContent";
    const CardFooter = React__namespace.forwardRef((_a, ref) => {
        var { className } = _a, props = __rest(_a, ["className"]);
        return (jsxRuntime.jsx("div", Object.assign({ ref: ref, className: cn("flex items-center p-6 pt-0", className) }, props)));
    });
    CardFooter.displayName = "CardFooter";

    function Message({ role, content, timestamp, isTyping }) {
        const isUser = role === "user";
        return (jsxRuntime.jsx("div", { className: cn("flex w-full", isUser ? "justify-end" : "justify-start"), children: jsxRuntime.jsxs("div", { className: cn("max-w-[80%] rounded-lg px-4 py-2 text-sm", isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"), children: [isTyping ? (jsxRuntime.jsxs("div", { className: "flex space-x-1", children: [jsxRuntime.jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" }), jsxRuntime.jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" }), jsxRuntime.jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-current" })] })) : (jsxRuntime.jsx("p", { className: "whitespace-pre-wrap", children: content })), timestamp && (jsxRuntime.jsx("p", { className: "mt-1 text-xs opacity-70", children: timestamp.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        }) }))] }) }));
    }
    function MessageList({ children }) {
        return jsxRuntime.jsx("div", { className: "flex flex-col space-y-4 p-4", children: children });
    }

    /**
     * @license lucide-react v0.539.0 - ISC
     *
     * This source code is licensed under the ISC license.
     * See the LICENSE file in the root directory of this source tree.
     */

    const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    const toCamelCase = (string) => string.replace(
      /^([A-Z])|[\s-_]+(\w)/g,
      (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
    );
    const toPascalCase = (string) => {
      const camelCase = toCamelCase(string);
      return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    };
    const mergeClasses = (...classes) => classes.filter((className, index, array) => {
      return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
    const hasA11yProp = (props) => {
      for (const prop in props) {
        if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
          return true;
        }
      }
    };

    /**
     * @license lucide-react v0.539.0 - ISC
     *
     * This source code is licensed under the ISC license.
     * See the LICENSE file in the root directory of this source tree.
     */

    var defaultAttributes = {
      xmlns: "http://www.w3.org/2000/svg",
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    };

    /**
     * @license lucide-react v0.539.0 - ISC
     *
     * This source code is licensed under the ISC license.
     * See the LICENSE file in the root directory of this source tree.
     */


    const Icon = React.forwardRef(
      ({
        color = "currentColor",
        size = 24,
        strokeWidth = 2,
        absoluteStrokeWidth,
        className = "",
        children,
        iconNode,
        ...rest
      }, ref) => React.createElement(
        "svg",
        {
          ref,
          ...defaultAttributes,
          width: size,
          height: size,
          stroke: color,
          strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
          className: mergeClasses("lucide", className),
          ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
          ...rest
        },
        [
          ...iconNode.map(([tag, attrs]) => React.createElement(tag, attrs)),
          ...Array.isArray(children) ? children : [children]
        ]
      )
    );

    /**
     * @license lucide-react v0.539.0 - ISC
     *
     * This source code is licensed under the ISC license.
     * See the LICENSE file in the root directory of this source tree.
     */


    const createLucideIcon = (iconName, iconNode) => {
      const Component = React.forwardRef(
        ({ className, ...props }, ref) => React.createElement(Icon, {
          ref,
          iconNode,
          className: mergeClasses(
            `lucide-${toKebabCase(toPascalCase(iconName))}`,
            `lucide-${iconName}`,
            className
          ),
          ...props
        })
      );
      Component.displayName = toPascalCase(iconName);
      return Component;
    };

    /**
     * @license lucide-react v0.539.0 - ISC
     *
     * This source code is licensed under the ISC license.
     * See the LICENSE file in the root directory of this source tree.
     */


    const __iconNode$1 = [
      ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
      ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
    ];
    const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$1);

    /**
     * @license lucide-react v0.539.0 - ISC
     *
     * This source code is licensed under the ISC license.
     * See the LICENSE file in the root directory of this source tree.
     */


    const __iconNode = [
      [
        "path",
        {
          d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
          key: "1ffxy3"
        }
      ],
      ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
    ];
    const Send = createLucideIcon("send", __iconNode);

    function ChatInput({ onSendMessage, disabled, placeholder, }) {
        const [message, setMessage] = React__namespace.useState("");
        const inputRef = React__namespace.useRef(null);
        // Focus the input when it becomes enabled
        React__namespace.useEffect(() => {
            if (!disabled && inputRef.current) {
                inputRef.current.focus();
            }
        }, [disabled]);
        const handleSubmit = (e) => {
            e.preventDefault();
            if (message.trim() && !disabled) {
                onSendMessage(message.trim());
                setMessage("");
            }
        };
        const handleKeyPress = (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
            }
        };
        return (jsxRuntime.jsxs("form", { onSubmit: handleSubmit, className: "flex items-center space-x-2 p-4 border-t", children: [jsxRuntime.jsx(input.Input, { ref: inputRef, value: message, autoFocus: true, onChange: (e) => setMessage(e.target.value), onKeyPress: handleKeyPress, placeholder: placeholder || "Type your message...", disabled: disabled, className: "flex-1" }), jsxRuntime.jsx(button.Button, { type: "submit", size: "icon", disabled: !message.trim() || disabled, className: "shrink-0", children: jsxRuntime.jsx(Send, { className: "h-4 w-4" }) })] }));
    }

    // Data extraction utilities for parsing AI responses
    const extractAllData = (text) => {
        const extracted = {};
        // Extract from the specific AI template format
        const nameMatch = text.match(/Name: (\[name\]|[a-zA-Z\s]+)\.?$/im);
        const loanTypeMatch = text.match(/Loan type:\s*(\[loan type\]|[^\r\n]+?)\.?\s*$/im);
        const amountMatch = text.match(/Loan amount:\s*(\[loan amount\]|\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*$/im);
        const phoneMatch = text.match(/Phone:\s*(\[phone number\]|[0-9 ()+\-]+)\s*$/im);
        const emailMatch = text.match(/Email:\s*(\[email\]|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,})\s*$/im);
        if (nameMatch && nameMatch[1] !== "[name]") {
            extracted.name = nameMatch[1].trim();
        }
        if (loanTypeMatch && loanTypeMatch[1] !== "[loan type]") {
            extracted.loanType = loanTypeMatch[1].trim();
        }
        if (amountMatch && amountMatch[1] !== "[loan amount]") {
            const amount = parseFloat(amountMatch[1].replace(/[$,]/g, ""));
            if (!isNaN(amount)) {
                extracted.loanAmount = amount;
            }
        }
        if (phoneMatch && phoneMatch[1] !== "[phone number]") {
            extracted.phone = phoneMatch[1].trim();
        }
        if (emailMatch && emailMatch[1] !== "[email]") {
            extracted.email = emailMatch[1].trim();
        }
        return extracted;
    };
    const parseAIResponse = (aiResponse) => {
        // Check if this is the final confirmation template
        const isFinalConfirmation = aiResponse.includes("Thank") &&
            aiResponse.includes("submit button") &&
            aiResponse.includes("Loan type") &&
            aiResponse.includes("Name") &&
            aiResponse.includes("Phone") &&
            aiResponse.includes("Email");
        if (isFinalConfirmation) {
            // returns an object with the extracted data for the form data
            return extractAllData(aiResponse);
        }
        // For all other messages, return empty object
        return {};
    };

    // packages/core/primitive/src/primitive.tsx
    function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
      return function handleEvent(event) {
        originalEventHandler?.(event);
        if (checkForDefaultPrevented === false || !event.defaultPrevented) {
          return ourEventHandler?.(event);
        }
      };
    }

    // packages/react/context/src/create-context.tsx
    function createContextScope(scopeName, createContextScopeDeps = []) {
      let defaultContexts = [];
      function createContext3(rootComponentName, defaultContext) {
        const BaseContext = React__namespace.createContext(defaultContext);
        const index = defaultContexts.length;
        defaultContexts = [...defaultContexts, defaultContext];
        const Provider = (props) => {
          const { scope, children, ...context } = props;
          const Context = scope?.[scopeName]?.[index] || BaseContext;
          const value = React__namespace.useMemo(() => context, Object.values(context));
          return /* @__PURE__ */ jsxRuntime.jsx(Context.Provider, { value, children });
        };
        Provider.displayName = rootComponentName + "Provider";
        function useContext2(consumerName, scope) {
          const Context = scope?.[scopeName]?.[index] || BaseContext;
          const context = React__namespace.useContext(Context);
          if (context) return context;
          if (defaultContext !== void 0) return defaultContext;
          throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
        }
        return [Provider, useContext2];
      }
      const createScope = () => {
        const scopeContexts = defaultContexts.map((defaultContext) => {
          return React__namespace.createContext(defaultContext);
        });
        return function useScope(scope) {
          const contexts = scope?.[scopeName] || scopeContexts;
          return React__namespace.useMemo(
            () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
            [scope, contexts]
          );
        };
      };
      createScope.scopeName = scopeName;
      return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
    }
    function composeContextScopes(...scopes) {
      const baseScope = scopes[0];
      if (scopes.length === 1) return baseScope;
      const createScope = () => {
        const scopeHooks = scopes.map((createScope2) => ({
          useScope: createScope2(),
          scopeName: createScope2.scopeName
        }));
        return function useComposedScopes(overrideScopes) {
          const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
            const scopeProps = useScope(overrideScopes);
            const currentScope = scopeProps[`__scope${scopeName}`];
            return { ...nextScopes2, ...currentScope };
          }, {});
          return React__namespace.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
        };
      };
      createScope.scopeName = baseScope.scopeName;
      return createScope;
    }

    function createCollection(name) {
      const PROVIDER_NAME = name + "CollectionProvider";
      const [createCollectionContext, createCollectionScope] = createContextScope(PROVIDER_NAME);
      const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(
        PROVIDER_NAME,
        { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
      );
      const CollectionProvider = (props) => {
        const { scope, children } = props;
        const ref = React.useRef(null);
        const itemMap = React.useRef(/* @__PURE__ */ new Map()).current;
        return /* @__PURE__ */ jsxRuntime.jsx(CollectionProviderImpl, { scope, itemMap, collectionRef: ref, children });
      };
      CollectionProvider.displayName = PROVIDER_NAME;
      const COLLECTION_SLOT_NAME = name + "CollectionSlot";
      const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
      const CollectionSlot = React.forwardRef(
        (props, forwardedRef) => {
          const { scope, children } = props;
          const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
          const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
          return /* @__PURE__ */ jsxRuntime.jsx(CollectionSlotImpl, { ref: composedRefs, children });
        }
      );
      CollectionSlot.displayName = COLLECTION_SLOT_NAME;
      const ITEM_SLOT_NAME = name + "CollectionItemSlot";
      const ITEM_DATA_ATTR = "data-radix-collection-item";
      const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
      const CollectionItemSlot = React.forwardRef(
        (props, forwardedRef) => {
          const { scope, children, ...itemData } = props;
          const ref = React.useRef(null);
          const composedRefs = useComposedRefs(forwardedRef, ref);
          const context = useCollectionContext(ITEM_SLOT_NAME, scope);
          React.useEffect(() => {
            context.itemMap.set(ref, { ref, ...itemData });
            return () => void context.itemMap.delete(ref);
          });
          return /* @__PURE__ */ jsxRuntime.jsx(CollectionItemSlotImpl, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
        }
      );
      CollectionItemSlot.displayName = ITEM_SLOT_NAME;
      function useCollection(scope) {
        const context = useCollectionContext(name + "CollectionConsumer", scope);
        const getItems = React.useCallback(() => {
          const collectionNode = context.collectionRef.current;
          if (!collectionNode) return [];
          const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
          const items = Array.from(context.itemMap.values());
          const orderedItems = items.sort(
            (a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current)
          );
          return orderedItems;
        }, [context.collectionRef, context.itemMap]);
        return getItems;
      }
      return [
        { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
        useCollection,
        createCollectionScope
      ];
    }

    // packages/react/use-layout-effect/src/use-layout-effect.tsx
    var useLayoutEffect2 = globalThis?.document ? React__namespace.useLayoutEffect : () => {
    };

    // packages/react/id/src/id.tsx
    var useReactId = React__namespace[" useId ".trim().toString()] || (() => void 0);
    var count = 0;
    function useId(deterministicId) {
      const [id, setId] = React__namespace.useState(useReactId());
      useLayoutEffect2(() => {
        setId((reactId) => reactId ?? String(count++));
      }, [deterministicId]);
      return deterministicId || (id ? `radix-${id}` : "");
    }

    // packages/react/use-callback-ref/src/use-callback-ref.tsx
    function useCallbackRef(callback) {
      const callbackRef = React__namespace.useRef(callback);
      React__namespace.useEffect(() => {
        callbackRef.current = callback;
      });
      return React__namespace.useMemo(() => (...args) => callbackRef.current?.(...args), []);
    }

    // src/use-controllable-state.tsx
    var useInsertionEffect = React__namespace[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
    function useControllableState({
      prop,
      defaultProp,
      onChange = () => {
      },
      caller
    }) {
      const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
        defaultProp,
        onChange
      });
      const isControlled = prop !== void 0;
      const value = isControlled ? prop : uncontrolledProp;
      {
        const isControlledRef = React__namespace.useRef(prop !== void 0);
        React__namespace.useEffect(() => {
          const wasControlled = isControlledRef.current;
          if (wasControlled !== isControlled) {
            const from = wasControlled ? "controlled" : "uncontrolled";
            const to = isControlled ? "controlled" : "uncontrolled";
            console.warn(
              `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
            );
          }
          isControlledRef.current = isControlled;
        }, [isControlled, caller]);
      }
      const setValue = React__namespace.useCallback(
        (nextValue) => {
          if (isControlled) {
            const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
            if (value2 !== prop) {
              onChangeRef.current?.(value2);
            }
          } else {
            setUncontrolledProp(nextValue);
          }
        },
        [isControlled, prop, setUncontrolledProp, onChangeRef]
      );
      return [value, setValue];
    }
    function useUncontrolledState({
      defaultProp,
      onChange
    }) {
      const [value, setValue] = React__namespace.useState(defaultProp);
      const prevValueRef = React__namespace.useRef(value);
      const onChangeRef = React__namespace.useRef(onChange);
      useInsertionEffect(() => {
        onChangeRef.current = onChange;
      }, [onChange]);
      React__namespace.useEffect(() => {
        if (prevValueRef.current !== value) {
          onChangeRef.current?.(value);
          prevValueRef.current = value;
        }
      }, [value, prevValueRef]);
      return [value, setValue, onChangeRef];
    }
    function isFunction(value) {
      return typeof value === "function";
    }

    // packages/react/direction/src/direction.tsx
    var DirectionContext = React__namespace.createContext(void 0);
    function useDirection(localDir) {
      const globalDir = React__namespace.useContext(DirectionContext);
      return localDir || globalDir || "ltr";
    }

    var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
    var EVENT_OPTIONS = { bubbles: false, cancelable: true };
    var GROUP_NAME = "RovingFocusGroup";
    var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
    var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
      GROUP_NAME,
      [createCollectionScope]
    );
    var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
    var RovingFocusGroup = React__namespace.forwardRef(
      (props, forwardedRef) => {
        return /* @__PURE__ */ jsxRuntime.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntime.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntime.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
      }
    );
    RovingFocusGroup.displayName = GROUP_NAME;
    var RovingFocusGroupImpl = React__namespace.forwardRef((props, forwardedRef) => {
      const {
        __scopeRovingFocusGroup,
        orientation,
        loop = false,
        dir,
        currentTabStopId: currentTabStopIdProp,
        defaultCurrentTabStopId,
        onCurrentTabStopIdChange,
        onEntryFocus,
        preventScrollOnEntryFocus = false,
        ...groupProps
      } = props;
      const ref = React__namespace.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const direction = useDirection(dir);
      const [currentTabStopId, setCurrentTabStopId] = useControllableState({
        prop: currentTabStopIdProp,
        defaultProp: defaultCurrentTabStopId ?? null,
        onChange: onCurrentTabStopIdChange,
        caller: GROUP_NAME
      });
      const [isTabbingBackOut, setIsTabbingBackOut] = React__namespace.useState(false);
      const handleEntryFocus = useCallbackRef(onEntryFocus);
      const getItems = useCollection(__scopeRovingFocusGroup);
      const isClickFocusRef = React__namespace.useRef(false);
      const [focusableItemsCount, setFocusableItemsCount] = React__namespace.useState(0);
      React__namespace.useEffect(() => {
        const node = ref.current;
        if (node) {
          node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
          return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
        }
      }, [handleEntryFocus]);
      return /* @__PURE__ */ jsxRuntime.jsx(
        RovingFocusProvider,
        {
          scope: __scopeRovingFocusGroup,
          orientation,
          dir: direction,
          loop,
          currentTabStopId,
          onItemFocus: React__namespace.useCallback(
            (tabStopId) => setCurrentTabStopId(tabStopId),
            [setCurrentTabStopId]
          ),
          onItemShiftTab: React__namespace.useCallback(() => setIsTabbingBackOut(true), []),
          onFocusableItemAdd: React__namespace.useCallback(
            () => setFocusableItemsCount((prevCount) => prevCount + 1),
            []
          ),
          onFocusableItemRemove: React__namespace.useCallback(
            () => setFocusableItemsCount((prevCount) => prevCount - 1),
            []
          ),
          children: /* @__PURE__ */ jsxRuntime.jsx(
            Primitive.div,
            {
              tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
              "data-orientation": orientation,
              ...groupProps,
              ref: composedRefs,
              style: { outline: "none", ...props.style },
              onMouseDown: composeEventHandlers(props.onMouseDown, () => {
                isClickFocusRef.current = true;
              }),
              onFocus: composeEventHandlers(props.onFocus, (event) => {
                const isKeyboardFocus = !isClickFocusRef.current;
                if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
                  const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
                  event.currentTarget.dispatchEvent(entryFocusEvent);
                  if (!entryFocusEvent.defaultPrevented) {
                    const items = getItems().filter((item) => item.focusable);
                    const activeItem = items.find((item) => item.active);
                    const currentItem = items.find((item) => item.id === currentTabStopId);
                    const candidateItems = [activeItem, currentItem, ...items].filter(
                      Boolean
                    );
                    const candidateNodes = candidateItems.map((item) => item.ref.current);
                    focusFirst(candidateNodes, preventScrollOnEntryFocus);
                  }
                }
                isClickFocusRef.current = false;
              }),
              onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
            }
          )
        }
      );
    });
    var ITEM_NAME = "RovingFocusGroupItem";
    var RovingFocusGroupItem = React__namespace.forwardRef(
      (props, forwardedRef) => {
        const {
          __scopeRovingFocusGroup,
          focusable = true,
          active = false,
          tabStopId,
          children,
          ...itemProps
        } = props;
        const autoId = useId();
        const id = tabStopId || autoId;
        const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
        const isCurrentTabStop = context.currentTabStopId === id;
        const getItems = useCollection(__scopeRovingFocusGroup);
        const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
        React__namespace.useEffect(() => {
          if (focusable) {
            onFocusableItemAdd();
            return () => onFocusableItemRemove();
          }
        }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
        return /* @__PURE__ */ jsxRuntime.jsx(
          Collection.ItemSlot,
          {
            scope: __scopeRovingFocusGroup,
            id,
            focusable,
            active,
            children: /* @__PURE__ */ jsxRuntime.jsx(
              Primitive.span,
              {
                tabIndex: isCurrentTabStop ? 0 : -1,
                "data-orientation": context.orientation,
                ...itemProps,
                ref: forwardedRef,
                onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
                  if (!focusable) event.preventDefault();
                  else context.onItemFocus(id);
                }),
                onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
                onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
                  if (event.key === "Tab" && event.shiftKey) {
                    context.onItemShiftTab();
                    return;
                  }
                  if (event.target !== event.currentTarget) return;
                  const focusIntent = getFocusIntent(event, context.orientation, context.dir);
                  if (focusIntent !== void 0) {
                    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                    event.preventDefault();
                    const items = getItems().filter((item) => item.focusable);
                    let candidateNodes = items.map((item) => item.ref.current);
                    if (focusIntent === "last") candidateNodes.reverse();
                    else if (focusIntent === "prev" || focusIntent === "next") {
                      if (focusIntent === "prev") candidateNodes.reverse();
                      const currentIndex = candidateNodes.indexOf(event.currentTarget);
                      candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                    }
                    setTimeout(() => focusFirst(candidateNodes));
                  }
                }),
                children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
              }
            )
          }
        );
      }
    );
    RovingFocusGroupItem.displayName = ITEM_NAME;
    var MAP_KEY_TO_FOCUS_INTENT = {
      ArrowLeft: "prev",
      ArrowUp: "prev",
      ArrowRight: "next",
      ArrowDown: "next",
      PageUp: "first",
      Home: "first",
      PageDown: "last",
      End: "last"
    };
    function getDirectionAwareKey(key, dir) {
      if (dir !== "rtl") return key;
      return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
    }
    function getFocusIntent(event, orientation, dir) {
      const key = getDirectionAwareKey(event.key, dir);
      if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
      if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
      return MAP_KEY_TO_FOCUS_INTENT[key];
    }
    function focusFirst(candidates, preventScroll = false) {
      const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
      for (const candidate of candidates) {
        if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
        candidate.focus({ preventScroll });
        if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
      }
    }
    function wrapArray(array, startIndex) {
      return array.map((_, index) => array[(startIndex + index) % array.length]);
    }
    var Root = RovingFocusGroup;
    var Item = RovingFocusGroupItem;

    function useStateMachine(initialState, machine) {
      return React__namespace.useReducer((state, event) => {
        const nextState = machine[state][event];
        return nextState ?? state;
      }, initialState);
    }

    // src/presence.tsx
    var Presence = (props) => {
      const { present, children } = props;
      const presence = usePresence(present);
      const child = typeof children === "function" ? children({ present: presence.isPresent }) : React__namespace.Children.only(children);
      const ref = useComposedRefs(presence.ref, getElementRef(child));
      const forceMount = typeof children === "function";
      return forceMount || presence.isPresent ? React__namespace.cloneElement(child, { ref }) : null;
    };
    Presence.displayName = "Presence";
    function usePresence(present) {
      const [node, setNode] = React__namespace.useState();
      const stylesRef = React__namespace.useRef(null);
      const prevPresentRef = React__namespace.useRef(present);
      const prevAnimationNameRef = React__namespace.useRef("none");
      const initialState = present ? "mounted" : "unmounted";
      const [state, send] = useStateMachine(initialState, {
        mounted: {
          UNMOUNT: "unmounted",
          ANIMATION_OUT: "unmountSuspended"
        },
        unmountSuspended: {
          MOUNT: "mounted",
          ANIMATION_END: "unmounted"
        },
        unmounted: {
          MOUNT: "mounted"
        }
      });
      React__namespace.useEffect(() => {
        const currentAnimationName = getAnimationName(stylesRef.current);
        prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
      }, [state]);
      useLayoutEffect2(() => {
        const styles = stylesRef.current;
        const wasPresent = prevPresentRef.current;
        const hasPresentChanged = wasPresent !== present;
        if (hasPresentChanged) {
          const prevAnimationName = prevAnimationNameRef.current;
          const currentAnimationName = getAnimationName(styles);
          if (present) {
            send("MOUNT");
          } else if (currentAnimationName === "none" || styles?.display === "none") {
            send("UNMOUNT");
          } else {
            const isAnimating = prevAnimationName !== currentAnimationName;
            if (wasPresent && isAnimating) {
              send("ANIMATION_OUT");
            } else {
              send("UNMOUNT");
            }
          }
          prevPresentRef.current = present;
        }
      }, [present, send]);
      useLayoutEffect2(() => {
        if (node) {
          let timeoutId;
          const ownerWindow = node.ownerDocument.defaultView ?? window;
          const handleAnimationEnd = (event) => {
            const currentAnimationName = getAnimationName(stylesRef.current);
            const isCurrentAnimation = currentAnimationName.includes(event.animationName);
            if (event.target === node && isCurrentAnimation) {
              send("ANIMATION_END");
              if (!prevPresentRef.current) {
                const currentFillMode = node.style.animationFillMode;
                node.style.animationFillMode = "forwards";
                timeoutId = ownerWindow.setTimeout(() => {
                  if (node.style.animationFillMode === "forwards") {
                    node.style.animationFillMode = currentFillMode;
                  }
                });
              }
            }
          };
          const handleAnimationStart = (event) => {
            if (event.target === node) {
              prevAnimationNameRef.current = getAnimationName(stylesRef.current);
            }
          };
          node.addEventListener("animationstart", handleAnimationStart);
          node.addEventListener("animationcancel", handleAnimationEnd);
          node.addEventListener("animationend", handleAnimationEnd);
          return () => {
            ownerWindow.clearTimeout(timeoutId);
            node.removeEventListener("animationstart", handleAnimationStart);
            node.removeEventListener("animationcancel", handleAnimationEnd);
            node.removeEventListener("animationend", handleAnimationEnd);
          };
        } else {
          send("ANIMATION_END");
        }
      }, [node, send]);
      return {
        isPresent: ["mounted", "unmountSuspended"].includes(state),
        ref: React__namespace.useCallback((node2) => {
          stylesRef.current = node2 ? getComputedStyle(node2) : null;
          setNode(node2);
        }, [])
      };
    }
    function getAnimationName(styles) {
      return styles?.animationName || "none";
    }
    function getElementRef(element) {
      let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
      let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
      if (mayWarn) {
        return element.ref;
      }
      getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
      mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
      if (mayWarn) {
        return element.props.ref;
      }
      return element.props.ref || element.ref;
    }

    var TABS_NAME = "Tabs";
    var [createTabsContext, createTabsScope] = createContextScope(TABS_NAME, [
      createRovingFocusGroupScope
    ]);
    var useRovingFocusGroupScope = createRovingFocusGroupScope();
    var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
    var Tabs$1 = React__namespace.forwardRef(
      (props, forwardedRef) => {
        const {
          __scopeTabs,
          value: valueProp,
          onValueChange,
          defaultValue,
          orientation = "horizontal",
          dir,
          activationMode = "automatic",
          ...tabsProps
        } = props;
        const direction = useDirection(dir);
        const [value, setValue] = useControllableState({
          prop: valueProp,
          onChange: onValueChange,
          defaultProp: defaultValue ?? "",
          caller: TABS_NAME
        });
        return /* @__PURE__ */ jsxRuntime.jsx(
          TabsProvider,
          {
            scope: __scopeTabs,
            baseId: useId(),
            value,
            onValueChange: setValue,
            orientation,
            dir: direction,
            activationMode,
            children: /* @__PURE__ */ jsxRuntime.jsx(
              Primitive.div,
              {
                dir: direction,
                "data-orientation": orientation,
                ...tabsProps,
                ref: forwardedRef
              }
            )
          }
        );
      }
    );
    Tabs$1.displayName = TABS_NAME;
    var TAB_LIST_NAME = "TabsList";
    var TabsList$1 = React__namespace.forwardRef(
      (props, forwardedRef) => {
        const { __scopeTabs, loop = true, ...listProps } = props;
        const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
        const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
        return /* @__PURE__ */ jsxRuntime.jsx(
          Root,
          {
            asChild: true,
            ...rovingFocusGroupScope,
            orientation: context.orientation,
            dir: context.dir,
            loop,
            children: /* @__PURE__ */ jsxRuntime.jsx(
              Primitive.div,
              {
                role: "tablist",
                "aria-orientation": context.orientation,
                ...listProps,
                ref: forwardedRef
              }
            )
          }
        );
      }
    );
    TabsList$1.displayName = TAB_LIST_NAME;
    var TRIGGER_NAME = "TabsTrigger";
    var TabsTrigger$1 = React__namespace.forwardRef(
      (props, forwardedRef) => {
        const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
        const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
        const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
        const triggerId = makeTriggerId(context.baseId, value);
        const contentId = makeContentId(context.baseId, value);
        const isSelected = value === context.value;
        return /* @__PURE__ */ jsxRuntime.jsx(
          Item,
          {
            asChild: true,
            ...rovingFocusGroupScope,
            focusable: !disabled,
            active: isSelected,
            children: /* @__PURE__ */ jsxRuntime.jsx(
              Primitive.button,
              {
                type: "button",
                role: "tab",
                "aria-selected": isSelected,
                "aria-controls": contentId,
                "data-state": isSelected ? "active" : "inactive",
                "data-disabled": disabled ? "" : void 0,
                disabled,
                id: triggerId,
                ...triggerProps,
                ref: forwardedRef,
                onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
                  if (!disabled && event.button === 0 && event.ctrlKey === false) {
                    context.onValueChange(value);
                  } else {
                    event.preventDefault();
                  }
                }),
                onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
                  if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
                }),
                onFocus: composeEventHandlers(props.onFocus, () => {
                  const isAutomaticActivation = context.activationMode !== "manual";
                  if (!isSelected && !disabled && isAutomaticActivation) {
                    context.onValueChange(value);
                  }
                })
              }
            )
          }
        );
      }
    );
    TabsTrigger$1.displayName = TRIGGER_NAME;
    var CONTENT_NAME = "TabsContent";
    var TabsContent$1 = React__namespace.forwardRef(
      (props, forwardedRef) => {
        const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
        const context = useTabsContext(CONTENT_NAME, __scopeTabs);
        const triggerId = makeTriggerId(context.baseId, value);
        const contentId = makeContentId(context.baseId, value);
        const isSelected = value === context.value;
        const isMountAnimationPreventedRef = React__namespace.useRef(isSelected);
        React__namespace.useEffect(() => {
          const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
          return () => cancelAnimationFrame(rAF);
        }, []);
        return /* @__PURE__ */ jsxRuntime.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntime.jsx(
          Primitive.div,
          {
            "data-state": isSelected ? "active" : "inactive",
            "data-orientation": context.orientation,
            role: "tabpanel",
            "aria-labelledby": triggerId,
            hidden: !present,
            id: contentId,
            tabIndex: 0,
            ...contentProps,
            ref: forwardedRef,
            style: {
              ...props.style,
              animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
            },
            children: present && children
          }
        ) });
      }
    );
    TabsContent$1.displayName = CONTENT_NAME;
    function makeTriggerId(baseId, value) {
      return `${baseId}-trigger-${value}`;
    }
    function makeContentId(baseId, value) {
      return `${baseId}-content-${value}`;
    }
    var Root2 = Tabs$1;
    var List = TabsList$1;
    var Trigger = TabsTrigger$1;
    var Content = TabsContent$1;

    function Tabs(_a) {
        var { className } = _a, props = __rest(_a, ["className"]);
        return (jsxRuntime.jsx(Root2, Object.assign({ "data-slot": "tabs", className: cn("flex flex-col gap-2", className) }, props)));
    }
    function TabsList(_a) {
        var { className } = _a, props = __rest(_a, ["className"]);
        return (jsxRuntime.jsx(List, Object.assign({ "data-slot": "tabs-list", className: cn("bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]", className) }, props)));
    }
    function TabsTrigger(_a) {
        var { className } = _a, props = __rest(_a, ["className"]);
        return (jsxRuntime.jsx(Trigger, Object.assign({ "data-slot": "tabs-trigger", className: cn("data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className) }, props)));
    }
    function TabsContent(_a) {
        var { className } = _a, props = __rest(_a, ["className"]);
        return (jsxRuntime.jsx(Content, Object.assign({ "data-slot": "tabs-content", className: cn("flex-1 outline-none", className) }, props)));
    }

    function ConversationalForm({ apiEndpoint = "/api/chat", onFormSubmit, onFormError, logoUrl, showPreview = true, }) {
        const [conversationState, setConversationState] = React.useState({
            messages: [
                {
                    id: "1",
                    role: "assistant",
                    content: "Hi! I'm here to help you with your loan application. What loan amount are you considering? Please note that we only work with amounts between $1,000 and $40,000.",
                    timestamp: new Date(),
                },
            ],
            formData: {},
            isTyping: false,
        });
        const [isSubmitting, setIsSubmitting] = React.useState(false);
        const [isSubmitted, setIsSubmitted] = React.useState(false);
        const messagesEndRef = React.useRef(null);
        const handleSubmitApplication = async () => {
            setIsSubmitting(true);
            try {
                const formattedChatHistory = conversationState.messages
                    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
                    .join("\n\n");
                const submissionData = {
                    loanAmount: conversationState.formData.loanAmount,
                    loanType: conversationState.formData.loanType,
                    name: conversationState.formData.name,
                    email: conversationState.formData.email,
                    phone: conversationState.formData.phone,
                    chatHistory: formattedChatHistory,
                };
                // Call the external API endpoint
                const response = await fetch(apiEndpoint.replace('/chat', '/submit'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submissionData),
                });
                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.error || "Failed to submit lead");
                }
                if (onFormSubmit) {
                    onFormSubmit(submissionData);
                }
                setIsSubmitted(true);
            }
            catch (err) {
                console.error("Error submitting form:", err);
                if (onFormError) {
                    onFormError(err);
                }
            }
            finally {
                setIsSubmitting(false);
            }
        };
        // Auto-scroll to bottom when new messages arrive
        React.useEffect(() => {
            var _a;
            (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
        }, [conversationState.messages]);
        const handleSendMessage = async (userMessage) => {
            const userMsg = {
                id: Date.now().toString(),
                role: "user",
                content: userMessage,
                timestamp: new Date(),
            };
            setConversationState((prev) => (Object.assign(Object.assign({}, prev), { messages: [...prev.messages, userMsg], isTyping: true })));
            try {
                const transformedMessageData = [
                    ...conversationState.messages,
                    userMsg,
                ].map((m) => ({ role: m.role, content: m.content }));
                // Send the user message to the external API
                const response = await fetch(apiEndpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        messages: transformedMessageData,
                        formData: conversationState.formData,
                    }),
                });
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                // Extract data from AI response (only on final confirmation)
                const extractedData = parseAIResponse(data.response);
                const updatedFormData = Object.assign(Object.assign({}, conversationState.formData), extractedData);
                const assistantMsg = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: data.response,
                    timestamp: new Date(),
                };
                setConversationState((prev) => (Object.assign(Object.assign({}, prev), { messages: [...prev.messages, assistantMsg], formData: updatedFormData, isTyping: false })));
            }
            catch (error) {
                console.error("Error sending message:", error);
                if (onFormError) {
                    onFormError(error);
                }
                const errorMsg = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "I apologize, but I encountered an error. Please try again.",
                    timestamp: new Date(),
                };
                setConversationState((prev) => (Object.assign(Object.assign({}, prev), { messages: [...prev.messages, errorMsg], isTyping: false })));
            }
        };
        const isFormComplete = conversationState.formData.name &&
            conversationState.formData.email &&
            conversationState.formData.phone &&
            conversationState.formData.loanAmount &&
            conversationState.formData.loanType;
        if (isSubmitted) {
            return (jsxRuntime.jsx(Card, { className: "w-full max-w-4xl mx-auto", children: jsxRuntime.jsxs(CardHeader, { children: [jsxRuntime.jsxs(CardTitle, { className: "text-green-600 flex items-center gap-2", children: [jsxRuntime.jsx(CircleCheckBig, { className: "h-6 w-6" }), "Thank You!"] }), jsxRuntime.jsx(CardDescription, { children: "Your loan application has been submitted successfully. We'll be in touch soon!" })] }) }));
        }
        return (jsxRuntime.jsx("div", { className: "w-full h-full flex flex-col", children: jsxRuntime.jsxs(Tabs, { defaultValue: "chat", className: "w-full h-full flex flex-col", children: [jsxRuntime.jsxs(TabsList, { className: "grid w-full grid-cols-2 flex-shrink-0", children: [jsxRuntime.jsx(TabsTrigger, { value: "chat", children: "Chat Assistant" }), showPreview && jsxRuntime.jsx(TabsTrigger, { value: "preview", children: "Application Preview" })] }), jsxRuntime.jsx(TabsContent, { value: "chat", className: "flex-1 mt-4 min-h-0", children: jsxRuntime.jsxs(Card, { className: "h-full flex flex-col", children: [jsxRuntime.jsxs(CardHeader, { className: "flex-shrink-0", children: [jsxRuntime.jsxs("div", { className: "flex flex-row items-center justify-between", children: [logoUrl && (jsxRuntime.jsx("img", { src: logoUrl, alt: "Company Logo", className: "w-20 h-auto" })), jsxRuntime.jsx(CardTitle, { className: "flex items-center gap-2", children: "Loan Assistant" })] }), jsxRuntime.jsx(CardDescription, { children: "Chat with our virtual assistant to complete your application" })] }), jsxRuntime.jsxs(CardContent, { className: "flex-1 flex flex-col p-0 min-h-0", children: [jsxRuntime.jsx("div", { className: "flex-1 overflow-y-auto", children: jsxRuntime.jsxs(MessageList, { children: [conversationState.messages.map((message) => (jsxRuntime.jsx(Message, { role: message.role, content: message.content, timestamp: message.timestamp }, message.id))), conversationState.isTyping && (jsxRuntime.jsx(Message, { role: "assistant", content: "", isTyping: true })), jsxRuntime.jsx("div", { ref: messagesEndRef })] }) }), isFormComplete ? (jsxRuntime.jsx(jsxRuntime.Fragment, { children: jsxRuntime.jsx("div", { className: "p-4 border-t flex-shrink-0", children: jsxRuntime.jsx(Button, { onClick: handleSubmitApplication, className: "w-full", disabled: !isFormComplete || isSubmitting, children: isSubmitting ? "Submitting..." : "Submit Application" }) }) })) : (jsxRuntime.jsx("div", { className: "flex-shrink-0", children: jsxRuntime.jsx(ChatInput, { onSendMessage: handleSendMessage, disabled: conversationState.isTyping || !!isFormComplete, placeholder: "Type your message..." }) }))] })] }) }), showPreview && (jsxRuntime.jsx(TabsContent, { value: "preview", className: "flex-1 mt-4 min-h-0", children: jsxRuntime.jsxs(Card, { className: "h-full flex flex-col", children: [jsxRuntime.jsxs(CardHeader, { className: "flex-shrink-0", children: [jsxRuntime.jsx(CardTitle, { className: "flex items-center gap-2", children: "Form Preview" }), jsxRuntime.jsx(CardDescription, { children: "Your information will be filled as we chat" })] }), jsxRuntime.jsx(CardContent, { className: "flex-1 overflow-y-auto", children: jsxRuntime.jsxs("div", { className: "space-y-4", children: [jsxRuntime.jsxs("div", { className: "space-y-2", children: [jsxRuntime.jsx(Label, { children: "Loan Amount" }), jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [jsxRuntime.jsx(Input, { value: conversationState.formData.loanAmount
                                                                    ? `$${conversationState.formData.loanAmount.toLocaleString()}`
                                                                    : "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.loanAmount && (jsxRuntime.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-500" }))] })] }), jsxRuntime.jsxs("div", { className: "space-y-2", children: [jsxRuntime.jsx(Label, { children: "Loan Type" }), jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [jsxRuntime.jsx(Input, { value: conversationState.formData.loanType || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.loanType && (jsxRuntime.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-500" }))] })] }), jsxRuntime.jsxs("div", { className: "space-y-2", children: [jsxRuntime.jsx(Label, { children: "Full Name" }), jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [jsxRuntime.jsx(Input, { value: conversationState.formData.name || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.name && (jsxRuntime.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-500" }))] })] }), jsxRuntime.jsxs("div", { className: "space-y-2", children: [jsxRuntime.jsx(Label, { children: "Email Address" }), jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [jsxRuntime.jsx(Input, { value: conversationState.formData.email || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.email && (jsxRuntime.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-500" }))] })] }), jsxRuntime.jsxs("div", { className: "space-y-2", children: [jsxRuntime.jsx(Label, { children: "Phone Number" }), jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [jsxRuntime.jsx(Input, { value: conversationState.formData.phone || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.phone && (jsxRuntime.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-500" }))] })] }), jsxRuntime.jsxs("div", { className: "space-y-2", children: [jsxRuntime.jsx(Label, { children: "Chat History" }), jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [jsxRuntime.jsx(Input, { value: conversationState.messages
                                                                    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
                                                                    .join("\n\n"), placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.messages && (jsxRuntime.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-500" }))] })] })] }) })] }) }))] }) }));
    }

    function ConversationalFormWidget({ containerId = "conversational-form-widget", apiEndpoint = "/api/chat", theme = "light", onFormSubmit, onFormError, logoUrl, showPreview = true, position = "center", width = "100%", height = "600px", }) {
        const [isLoaded, setIsLoaded] = React.useState(false);
        React.useEffect(() => {
            // Inject Tailwind CSS if not already present
            if (!document.querySelector("#tailwind-css")) {
                const link = document.createElement("link");
                link.id = "tailwind-css";
                link.rel = "stylesheet";
                link.href =
                    "https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css";
                document.head.appendChild(link);
            }
            // Inject Lucide React icons CSS if not already present
            if (!document.querySelector("#lucide-css")) {
                const link = document.createElement("link");
                link.id = "lucide-css";
                link.rel = "stylesheet";
                link.href =
                    "https://cdn.jsdelivr.net/npm/lucide-static@latest/font/lucide.css";
                document.head.appendChild(link);
            }
            setIsLoaded(true);
        }, []);
        const getPositionStyles = () => {
            switch (position) {
                case "bottom-right":
                    return "fixed bottom-4 right-4 z-50";
                case "bottom-left":
                    return "fixed bottom-4 left-4 z-50";
                case "top-right":
                    return "fixed top-4 right-4 z-50";
                case "top-left":
                    return "fixed top-4 left-4 z-50";
                case "center":
                default:
                    return "relative";
            }
        };
        if (!isLoaded) {
            return jsxRuntime.jsx("div", { children: "Loading..." });
        }
        return (jsxRuntime.jsx("div", { className: `conversational-form-widget ${theme} ${getPositionStyles()}`, style: { width, height }, children: jsxRuntime.jsx(ConversationalForm, { apiEndpoint: apiEndpoint, onFormSubmit: onFormSubmit, onFormError: onFormError, logoUrl: logoUrl, showPreview: showPreview }) }));
    }

    // Default export for UMD builds
    const ConversationalFormWidgetLibrary = {
        ConversationalForm,
        ConversationalFormWidget
    };

    exports.ConversationalForm = ConversationalForm;
    exports.ConversationalFormWidget = ConversationalFormWidget;
    exports.default = ConversationalFormWidgetLibrary;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
