(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react/jsx-runtime'), require('react'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react/jsx-runtime', 'react', 'react-dom'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ConversationalFormWidget = {}, global.jsxRuntime, global.React));
})(this, (function (exports, jsxRuntime, React$2) { 'use strict';

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

  var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React$2);

  const __storeToDerived = /* @__PURE__ */ new WeakMap();
  const __derivedToStore = /* @__PURE__ */ new WeakMap();
  const __depsThatHaveWrittenThisTick = {
    current: []
  };
  let __isFlushing = false;
  let __batchDepth = 0;
  const __pendingUpdates = /* @__PURE__ */ new Set();
  const __initialBatchValues = /* @__PURE__ */ new Map();
  function __flush_internals(relatedVals) {
    const sorted = Array.from(relatedVals).sort((a, b) => {
      if (a instanceof Derived && a.options.deps.includes(b)) return 1;
      if (b instanceof Derived && b.options.deps.includes(a)) return -1;
      return 0;
    });
    for (const derived of sorted) {
      if (__depsThatHaveWrittenThisTick.current.includes(derived)) {
        continue;
      }
      __depsThatHaveWrittenThisTick.current.push(derived);
      derived.recompute();
      const stores = __derivedToStore.get(derived);
      if (stores) {
        for (const store of stores) {
          const relatedLinkedDerivedVals = __storeToDerived.get(store);
          if (!relatedLinkedDerivedVals) continue;
          __flush_internals(relatedLinkedDerivedVals);
        }
      }
    }
  }
  function __notifyListeners(store) {
    store.listeners.forEach(
      (listener) => listener({
        prevVal: store.prevState,
        currentVal: store.state
      })
    );
  }
  function __notifyDerivedListeners(derived) {
    derived.listeners.forEach(
      (listener) => listener({
        prevVal: derived.prevState,
        currentVal: derived.state
      })
    );
  }
  function __flush(store) {
    if (__batchDepth > 0 && !__initialBatchValues.has(store)) {
      __initialBatchValues.set(store, store.prevState);
    }
    __pendingUpdates.add(store);
    if (__batchDepth > 0) return;
    if (__isFlushing) return;
    try {
      __isFlushing = true;
      while (__pendingUpdates.size > 0) {
        const stores = Array.from(__pendingUpdates);
        __pendingUpdates.clear();
        for (const store2 of stores) {
          const prevState = __initialBatchValues.get(store2) ?? store2.prevState;
          store2.prevState = prevState;
          __notifyListeners(store2);
        }
        for (const store2 of stores) {
          const derivedVals = __storeToDerived.get(store2);
          if (!derivedVals) continue;
          __depsThatHaveWrittenThisTick.current.push(store2);
          __flush_internals(derivedVals);
        }
        for (const store2 of stores) {
          const derivedVals = __storeToDerived.get(store2);
          if (!derivedVals) continue;
          for (const derived of derivedVals) {
            __notifyDerivedListeners(derived);
          }
        }
      }
    } finally {
      __isFlushing = false;
      __depsThatHaveWrittenThisTick.current = [];
      __initialBatchValues.clear();
    }
  }
  function batch(fn) {
    __batchDepth++;
    try {
      fn();
    } finally {
      __batchDepth--;
      if (__batchDepth === 0) {
        const pendingUpdateToFlush = Array.from(__pendingUpdates)[0];
        if (pendingUpdateToFlush) {
          __flush(pendingUpdateToFlush);
        }
      }
    }
  }

  function isUpdaterFunction(updater) {
    return typeof updater === "function";
  }

  class Store {
    constructor(initialState, options) {
      this.listeners = /* @__PURE__ */ new Set();
      this.subscribe = (listener) => {
        var _a, _b;
        this.listeners.add(listener);
        const unsub = (_b = (_a = this.options) == null ? void 0 : _a.onSubscribe) == null ? void 0 : _b.call(_a, listener, this);
        return () => {
          this.listeners.delete(listener);
          unsub == null ? void 0 : unsub();
        };
      };
      this.prevState = initialState;
      this.state = initialState;
      this.options = options;
    }
    setState(updater) {
      var _a, _b, _c;
      this.prevState = this.state;
      if ((_a = this.options) == null ? void 0 : _a.updateFn) {
        this.state = this.options.updateFn(this.prevState)(updater);
      } else {
        if (isUpdaterFunction(updater)) {
          this.state = updater(this.prevState);
        } else {
          this.state = updater;
        }
      }
      (_c = (_b = this.options) == null ? void 0 : _b.onUpdate) == null ? void 0 : _c.call(_b);
      __flush(this);
    }
  }

  class Derived {
    constructor(options) {
      this.listeners = /* @__PURE__ */ new Set();
      this._subscriptions = [];
      this.lastSeenDepValues = [];
      this.getDepVals = () => {
        const prevDepVals = [];
        const currDepVals = [];
        for (const dep of this.options.deps) {
          prevDepVals.push(dep.prevState);
          currDepVals.push(dep.state);
        }
        this.lastSeenDepValues = currDepVals;
        return {
          prevDepVals,
          currDepVals,
          prevVal: this.prevState ?? void 0
        };
      };
      this.recompute = () => {
        var _a, _b;
        this.prevState = this.state;
        const { prevDepVals, currDepVals, prevVal } = this.getDepVals();
        this.state = this.options.fn({
          prevDepVals,
          currDepVals,
          prevVal
        });
        (_b = (_a = this.options).onUpdate) == null ? void 0 : _b.call(_a);
      };
      this.checkIfRecalculationNeededDeeply = () => {
        for (const dep of this.options.deps) {
          if (dep instanceof Derived) {
            dep.checkIfRecalculationNeededDeeply();
          }
        }
        let shouldRecompute = false;
        const lastSeenDepValues = this.lastSeenDepValues;
        const { currDepVals } = this.getDepVals();
        for (let i = 0; i < currDepVals.length; i++) {
          if (currDepVals[i] !== lastSeenDepValues[i]) {
            shouldRecompute = true;
            break;
          }
        }
        if (shouldRecompute) {
          this.recompute();
        }
      };
      this.mount = () => {
        this.registerOnGraph();
        this.checkIfRecalculationNeededDeeply();
        return () => {
          this.unregisterFromGraph();
          for (const cleanup of this._subscriptions) {
            cleanup();
          }
        };
      };
      this.subscribe = (listener) => {
        var _a, _b;
        this.listeners.add(listener);
        const unsub = (_b = (_a = this.options).onSubscribe) == null ? void 0 : _b.call(_a, listener, this);
        return () => {
          this.listeners.delete(listener);
          unsub == null ? void 0 : unsub();
        };
      };
      this.options = options;
      this.state = options.fn({
        prevDepVals: void 0,
        prevVal: void 0,
        currDepVals: this.getDepVals().currDepVals
      });
    }
    registerOnGraph(deps = this.options.deps) {
      for (const dep of deps) {
        if (dep instanceof Derived) {
          dep.registerOnGraph();
          this.registerOnGraph(dep.options.deps);
        } else if (dep instanceof Store) {
          let relatedLinkedDerivedVals = __storeToDerived.get(dep);
          if (!relatedLinkedDerivedVals) {
            relatedLinkedDerivedVals = /* @__PURE__ */ new Set();
            __storeToDerived.set(dep, relatedLinkedDerivedVals);
          }
          relatedLinkedDerivedVals.add(this);
          let relatedStores = __derivedToStore.get(this);
          if (!relatedStores) {
            relatedStores = /* @__PURE__ */ new Set();
            __derivedToStore.set(this, relatedStores);
          }
          relatedStores.add(dep);
        }
      }
    }
    unregisterFromGraph(deps = this.options.deps) {
      for (const dep of deps) {
        if (dep instanceof Derived) {
          this.unregisterFromGraph(dep.options.deps);
        } else if (dep instanceof Store) {
          const relatedLinkedDerivedVals = __storeToDerived.get(dep);
          if (relatedLinkedDerivedVals) {
            relatedLinkedDerivedVals.delete(this);
          }
          const relatedStores = __derivedToStore.get(this);
          if (relatedStores) {
            relatedStores.delete(dep);
          }
        }
      }
    }
  }

  function functionalUpdate(updater, input) {
    return typeof updater === "function" ? updater(input) : updater;
  }
  function getBy(obj, path) {
    const pathObj = makePathArray(path);
    return pathObj.reduce((current, pathPart) => {
      if (current === null) return null;
      if (typeof current !== "undefined") {
        return current[pathPart];
      }
      return void 0;
    }, obj);
  }
  function setBy(obj, _path, updater) {
    const path = makePathArray(_path);
    function doSet(parent) {
      if (!path.length) {
        return functionalUpdate(updater, parent);
      }
      const key = path.shift();
      if (typeof key === "string" || typeof key === "number" && !Array.isArray(parent)) {
        if (typeof parent === "object") {
          if (parent === null) {
            parent = {};
          }
          return {
            ...parent,
            [key]: doSet(parent[key])
          };
        }
        return {
          [key]: doSet()
        };
      }
      if (Array.isArray(parent) && typeof key === "number") {
        const prefix = parent.slice(0, key);
        return [
          ...prefix.length ? prefix : new Array(key),
          doSet(parent[key]),
          ...parent.slice(key + 1)
        ];
      }
      return [...new Array(key), doSet()];
    }
    return doSet(obj);
  }
  function deleteBy(obj, _path) {
    const path = makePathArray(_path);
    function doDelete(parent) {
      if (!parent) return;
      if (path.length === 1) {
        const finalPath = path[0];
        if (Array.isArray(parent) && typeof finalPath === "number") {
          return parent.filter((_, i) => i !== finalPath);
        }
        const { [finalPath]: remove, ...rest } = parent;
        return rest;
      }
      const key = path.shift();
      if (typeof key === "string") {
        if (typeof parent === "object") {
          return {
            ...parent,
            [key]: doDelete(parent[key])
          };
        }
      }
      if (typeof key === "number") {
        if (Array.isArray(parent)) {
          if (key >= parent.length) {
            return parent;
          }
          const prefix = parent.slice(0, key);
          return [
            ...prefix.length ? prefix : new Array(key),
            doDelete(parent[key]),
            ...parent.slice(key + 1)
          ];
        }
      }
      throw new Error("It seems we have created an infinite loop in deleteBy. ");
    }
    return doDelete(obj);
  }
  const reLineOfOnlyDigits = /^(\d+)$/gm;
  const reDigitsBetweenDots = /\.(\d+)(?=\.)/gm;
  const reStartWithDigitThenDot = /^(\d+)\./gm;
  const reDotWithDigitsToEnd = /\.(\d+$)/gm;
  const reMultipleDots = /\.{2,}/gm;
  const intPrefix = "__int__";
  const intReplace = `${intPrefix}$1`;
  function makePathArray(str) {
    if (Array.isArray(str)) {
      return [...str];
    }
    if (typeof str !== "string") {
      throw new Error("Path must be a string.");
    }
    return str.replace(/(^\[)|]/gm, "").replace(/\[/g, ".").replace(reLineOfOnlyDigits, intReplace).replace(reDigitsBetweenDots, `.${intReplace}.`).replace(reStartWithDigitThenDot, `${intReplace}.`).replace(reDotWithDigitsToEnd, `.${intReplace}`).replace(reMultipleDots, ".").split(".").map((d) => {
      if (d.startsWith(intPrefix)) {
        const numStr = d.substring(intPrefix.length);
        const num = parseInt(numStr, 10);
        if (String(num) === numStr) {
          return num;
        }
        return numStr;
      }
      return d;
    });
  }
  function isNonEmptyArray(obj) {
    return !(Array.isArray(obj) && obj.length === 0);
  }
  function getSyncValidatorArray(cause, options) {
    const runValidation = (props) => {
      return props.validators.filter(Boolean).map((validator) => {
        return {
          cause: validator.cause,
          validate: validator.fn
        };
      });
    };
    return options.validationLogic({
      form: options.form,
      validators: options.validators,
      event: { type: cause, async: false },
      runValidation
    });
  }
  function getAsyncValidatorArray(cause, options) {
    const { asyncDebounceMs } = options;
    const {
      onBlurAsyncDebounceMs,
      onChangeAsyncDebounceMs,
      onDynamicAsyncDebounceMs
    } = options.validators || {};
    const defaultDebounceMs = asyncDebounceMs ?? 0;
    const runValidation = (props) => {
      return props.validators.filter(Boolean).map((validator) => {
        const validatorCause = validator?.cause || cause;
        let debounceMs = defaultDebounceMs;
        switch (validatorCause) {
          case "change":
            debounceMs = onChangeAsyncDebounceMs ?? defaultDebounceMs;
            break;
          case "blur":
            debounceMs = onBlurAsyncDebounceMs ?? defaultDebounceMs;
            break;
          case "dynamic":
            debounceMs = onDynamicAsyncDebounceMs ?? defaultDebounceMs;
            break;
          case "submit":
            debounceMs = 0;
            break;
        }
        if (cause === "submit") {
          debounceMs = 0;
        }
        return {
          cause: validatorCause,
          validate: validator.fn,
          debounceMs
        };
      });
    };
    return options.validationLogic({
      form: options.form,
      validators: options.validators,
      event: { type: cause, async: true },
      runValidation
    });
  }
  const isGlobalFormValidationError = (error) => {
    return !!error && typeof error === "object" && "fields" in error;
  };
  function evaluate(objA, objB) {
    if (Object.is(objA, objB)) {
      return true;
    }
    if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
      return false;
    }
    if (objA instanceof Map && objB instanceof Map) {
      if (objA.size !== objB.size) return false;
      for (const [k, v] of objA) {
        if (!objB.has(k) || !Object.is(v, objB.get(k))) return false;
      }
      return true;
    }
    if (objA instanceof Set && objB instanceof Set) {
      if (objA.size !== objB.size) return false;
      for (const v of objA) {
        if (!objB.has(v)) return false;
      }
      return true;
    }
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
      return false;
    }
    for (const key of keysA) {
      if (!keysB.includes(key) || !evaluate(objA[key], objB[key])) {
        return false;
      }
    }
    return true;
  }
  const determineFormLevelErrorSourceAndValue = ({
    newFormValidatorError,
    isPreviousErrorFromFormValidator,
    previousErrorValue
  }) => {
    if (newFormValidatorError) {
      return { newErrorValue: newFormValidatorError, newSource: "form" };
    }
    if (isPreviousErrorFromFormValidator) {
      return { newErrorValue: void 0, newSource: void 0 };
    }
    if (previousErrorValue) {
      return { newErrorValue: previousErrorValue, newSource: "field" };
    }
    return { newErrorValue: void 0, newSource: void 0 };
  };
  const determineFieldLevelErrorSourceAndValue = ({
    formLevelError,
    fieldLevelError
  }) => {
    if (fieldLevelError) {
      return { newErrorValue: fieldLevelError, newSource: "field" };
    }
    if (formLevelError) {
      return { newErrorValue: formLevelError, newSource: "form" };
    }
    return { newErrorValue: void 0, newSource: void 0 };
  };

  const defaultValidationLogic = (props) => {
    if (!props.validators) {
      return props.runValidation({
        validators: [],
        form: props.form
      });
    }
    const isAsync = props.event.async;
    const onMountValidator = isAsync ? void 0 : { fn: props.validators.onMount, cause: "mount" };
    const onChangeValidator = {
      fn: isAsync ? props.validators.onChangeAsync : props.validators.onChange,
      cause: "change"
    };
    const onBlurValidator = {
      fn: isAsync ? props.validators.onBlurAsync : props.validators.onBlur,
      cause: "blur"
    };
    const onSubmitValidator = {
      fn: isAsync ? props.validators.onSubmitAsync : props.validators.onSubmit,
      cause: "submit"
    };
    const onServerValidator = isAsync ? void 0 : { fn: () => void 0, cause: "server" };
    switch (props.event.type) {
      case "mount": {
        return props.runValidation({
          validators: [onMountValidator],
          form: props.form
        });
      }
      case "submit": {
        return props.runValidation({
          validators: [
            onChangeValidator,
            onBlurValidator,
            onSubmitValidator,
            onServerValidator
          ],
          form: props.form
        });
      }
      case "server": {
        return props.runValidation({
          validators: [],
          form: props.form
        });
      }
      case "blur": {
        return props.runValidation({
          validators: [onBlurValidator, onServerValidator],
          form: props.form
        });
      }
      case "change": {
        return props.runValidation({
          validators: [onChangeValidator, onServerValidator],
          form: props.form
        });
      }
      default: {
        throw new Error(`Unknown validation event type: ${props.event.type}`);
      }
    }
  };

  function prefixSchemaToErrors(issues) {
    const schema = /* @__PURE__ */ new Map();
    for (const issue of issues) {
      const path = [...issue.path ?? []].map((segment) => {
        const normalizedSegment = typeof segment === "object" ? segment.key : segment;
        return typeof normalizedSegment === "number" ? `[${normalizedSegment}]` : normalizedSegment;
      }).join(".").replace(/\.\[/g, "[");
      schema.set(path, (schema.get(path) ?? []).concat(issue));
    }
    return Object.fromEntries(schema);
  }
  const transformFormIssues = (issues) => {
    const schemaErrors = prefixSchemaToErrors(issues);
    return {
      form: schemaErrors,
      fields: schemaErrors
    };
  };
  const standardSchemaValidators = {
    validate({
      value,
      validationSource
    }, schema) {
      const result = schema["~standard"].validate(value);
      if (result instanceof Promise) {
        throw new Error("async function passed to sync validator");
      }
      if (!result.issues) return;
      if (validationSource === "field")
        return result.issues;
      return transformFormIssues(result.issues);
    },
    async validateAsync({
      value,
      validationSource
    }, schema) {
      const result = await schema["~standard"].validate(value);
      if (!result.issues) return;
      if (validationSource === "field")
        return result.issues;
      return transformFormIssues(result.issues);
    }
  };
  const isStandardSchemaValidator = (validator) => !!validator && "~standard" in validator;

  const defaultFieldMeta = {
    isValidating: false,
    isTouched: false,
    isBlurred: false,
    isDirty: false,
    isPristine: true,
    isValid: true,
    isDefaultValue: true,
    errors: [],
    errorMap: {},
    errorSourceMap: {}
  };
  function metaHelper(formApi) {
    function handleArrayFieldMetaShift(field, index, mode, secondIndex) {
      const affectedFields = getAffectedFields(field, index, mode, secondIndex);
      const handlers = {
        insert: () => handleInsertMode(affectedFields, field, index),
        remove: () => handleRemoveMode(affectedFields),
        swap: () => secondIndex !== void 0 && handleSwapMode(affectedFields, field, index, secondIndex),
        move: () => secondIndex !== void 0 && handleMoveMode(affectedFields, field, index, secondIndex)
      };
      handlers[mode]();
    }
    function getFieldPath(field, index) {
      return `${field}[${index}]`;
    }
    function getAffectedFields(field, index, mode, secondIndex) {
      const affectedFieldKeys = [getFieldPath(field, index)];
      if (mode === "swap") {
        affectedFieldKeys.push(getFieldPath(field, secondIndex));
      } else if (mode === "move") {
        const [startIndex, endIndex] = [
          Math.min(index, secondIndex),
          Math.max(index, secondIndex)
        ];
        for (let i = startIndex; i <= endIndex; i++) {
          affectedFieldKeys.push(getFieldPath(field, i));
        }
      } else {
        const currentValue = formApi.getFieldValue(field);
        const fieldItems = Array.isArray(currentValue) ? currentValue.length : 0;
        for (let i = index + 1; i < fieldItems; i++) {
          affectedFieldKeys.push(getFieldPath(field, i));
        }
      }
      return Object.keys(formApi.fieldInfo).filter(
        (fieldKey) => affectedFieldKeys.some((key) => fieldKey.startsWith(key))
      );
    }
    function updateIndex(fieldKey, direction) {
      return fieldKey.replace(/\[(\d+)\]/, (_, num) => {
        const currIndex = parseInt(num, 10);
        const newIndex = direction === "up" ? currIndex + 1 : Math.max(0, currIndex - 1);
        return `[${newIndex}]`;
      });
    }
    function shiftMeta(fields, direction) {
      const sortedFields = direction === "up" ? fields : [...fields].reverse();
      sortedFields.forEach((fieldKey) => {
        const nextFieldKey = updateIndex(fieldKey.toString(), direction);
        const nextFieldMeta = formApi.getFieldMeta(nextFieldKey);
        if (nextFieldMeta) {
          formApi.setFieldMeta(fieldKey, nextFieldMeta);
        } else {
          formApi.setFieldMeta(fieldKey, getEmptyFieldMeta());
        }
      });
    }
    const getEmptyFieldMeta = () => defaultFieldMeta;
    const handleInsertMode = (fields, field, insertIndex) => {
      shiftMeta(fields, "down");
      fields.forEach((fieldKey) => {
        if (fieldKey.toString().startsWith(getFieldPath(field, insertIndex))) {
          formApi.setFieldMeta(fieldKey, getEmptyFieldMeta());
        }
      });
    };
    const handleRemoveMode = (fields) => {
      shiftMeta(fields, "up");
    };
    const handleMoveMode = (fields, field, fromIndex, toIndex) => {
      const fromFields = new Map(
        Object.keys(formApi.fieldInfo).filter(
          (fieldKey) => fieldKey.startsWith(getFieldPath(field, fromIndex))
        ).map((fieldKey) => [
          fieldKey,
          formApi.getFieldMeta(fieldKey)
        ])
      );
      shiftMeta(fields, fromIndex < toIndex ? "up" : "down");
      Object.keys(formApi.fieldInfo).filter((fieldKey) => fieldKey.startsWith(getFieldPath(field, toIndex))).forEach((fieldKey) => {
        const fromKey = fieldKey.replace(
          getFieldPath(field, toIndex),
          getFieldPath(field, fromIndex)
        );
        const fromMeta = fromFields.get(fromKey);
        if (fromMeta) {
          formApi.setFieldMeta(fieldKey, fromMeta);
        }
      });
    };
    const handleSwapMode = (fields, field, index, secondIndex) => {
      fields.forEach((fieldKey) => {
        if (!fieldKey.toString().startsWith(getFieldPath(field, index))) return;
        const swappedKey = fieldKey.toString().replace(
          getFieldPath(field, index),
          getFieldPath(field, secondIndex)
        );
        const [meta1, meta2] = [
          formApi.getFieldMeta(fieldKey),
          formApi.getFieldMeta(swappedKey)
        ];
        if (meta1) formApi.setFieldMeta(swappedKey, meta1);
        if (meta2) formApi.setFieldMeta(fieldKey, meta2);
      });
    };
    return { handleArrayFieldMetaShift };
  }

  function getDefaultFormState(defaultState) {
    return {
      values: defaultState.values ?? {},
      errorMap: defaultState.errorMap ?? {},
      fieldMetaBase: defaultState.fieldMetaBase ?? {},
      isSubmitted: defaultState.isSubmitted ?? false,
      isSubmitting: defaultState.isSubmitting ?? false,
      isValidating: defaultState.isValidating ?? false,
      submissionAttempts: defaultState.submissionAttempts ?? 0,
      isSubmitSuccessful: defaultState.isSubmitSuccessful ?? false,
      validationMetaMap: defaultState.validationMetaMap ?? {
        onChange: void 0,
        onBlur: void 0,
        onSubmit: void 0,
        onMount: void 0,
        onServer: void 0,
        onDynamic: void 0
      }
    };
  }
  class FormApi {
    /**
     * Constructs a new `FormApi` instance with the given form options.
     */
    constructor(opts) {
      this.options = {};
      this.fieldInfo = {};
      this.prevTransformArray = [];
      this.mount = () => {
        const cleanupFieldMetaDerived = this.fieldMetaDerived.mount();
        const cleanupStoreDerived = this.store.mount();
        const cleanup = () => {
          cleanupFieldMetaDerived();
          cleanupStoreDerived();
        };
        this.options.listeners?.onMount?.({ formApi: this });
        const { onMount } = this.options.validators || {};
        if (!onMount) return cleanup;
        this.validateSync("mount");
        return cleanup;
      };
      this.update = (options) => {
        if (!options) return;
        const oldOptions = this.options;
        this.options = options;
        const shouldUpdateReeval = !!options.transform?.deps?.some(
          (val, i) => val !== this.prevTransformArray[i]
        );
        const shouldUpdateValues = options.defaultValues && !evaluate(options.defaultValues, oldOptions.defaultValues) && !this.state.isTouched;
        const shouldUpdateState = !evaluate(options.defaultState, oldOptions.defaultState) && !this.state.isTouched;
        if (!shouldUpdateValues && !shouldUpdateState && !shouldUpdateReeval) return;
        batch(() => {
          this.baseStore.setState(
            () => getDefaultFormState(
              Object.assign(
                {},
                this.state,
                shouldUpdateState ? options.defaultState : {},
                shouldUpdateValues ? {
                  values: options.defaultValues
                } : {},
                shouldUpdateReeval ? { _force_re_eval: !this.state._force_re_eval } : {}
              )
            )
          );
        });
      };
      this.reset = (values, opts2) => {
        const { fieldMeta: currentFieldMeta } = this.state;
        const fieldMetaBase = this.resetFieldMeta(currentFieldMeta);
        if (values && !opts2?.keepDefaultValues) {
          this.options = {
            ...this.options,
            defaultValues: values
          };
        }
        this.baseStore.setState(
          () => getDefaultFormState({
            ...this.options.defaultState,
            values: values ?? this.options.defaultValues ?? this.options.defaultState?.values,
            fieldMetaBase
          })
        );
      };
      this.validateAllFields = async (cause) => {
        const fieldValidationPromises = [];
        batch(() => {
          void Object.values(this.fieldInfo).forEach(
            (field) => {
              if (!field.instance) return;
              const fieldInstance = field.instance;
              fieldValidationPromises.push(
                // Remember, `validate` is either a sync operation or a promise
                Promise.resolve().then(
                  () => fieldInstance.validate(cause, { skipFormValidation: true })
                )
              );
              if (!field.instance.state.meta.isTouched) {
                field.instance.setMeta((prev) => ({ ...prev, isTouched: true }));
              }
            }
          );
        });
        const fieldErrorMapMap = await Promise.all(fieldValidationPromises);
        return fieldErrorMapMap.flat();
      };
      this.validateArrayFieldsStartingFrom = async (field, index, cause) => {
        const currentValue = this.getFieldValue(field);
        const lastIndex = Array.isArray(currentValue) ? Math.max(currentValue.length - 1, 0) : null;
        const fieldKeysToValidate = [`${field}[${index}]`];
        for (let i = index + 1; i <= (lastIndex ?? 0); i++) {
          fieldKeysToValidate.push(`${field}[${i}]`);
        }
        const fieldsToValidate = Object.keys(this.fieldInfo).filter(
          (fieldKey) => fieldKeysToValidate.some((key) => fieldKey.startsWith(key))
        );
        const fieldValidationPromises = [];
        batch(() => {
          fieldsToValidate.forEach((nestedField) => {
            fieldValidationPromises.push(
              Promise.resolve().then(() => this.validateField(nestedField, cause))
            );
          });
        });
        const fieldErrorMapMap = await Promise.all(fieldValidationPromises);
        return fieldErrorMapMap.flat();
      };
      this.validateField = (field, cause) => {
        const fieldInstance = this.fieldInfo[field]?.instance;
        if (!fieldInstance) return [];
        if (!fieldInstance.state.meta.isTouched) {
          fieldInstance.setMeta((prev) => ({ ...prev, isTouched: true }));
        }
        return fieldInstance.validate(cause);
      };
      this.validateSync = (cause) => {
        const validates = getSyncValidatorArray(cause, {
          ...this.options,
          form: this,
          validationLogic: this.options.validationLogic || defaultValidationLogic
        });
        let hasErrored = false;
        const currentValidationErrorMap = {};
        batch(() => {
          for (const validateObj of validates) {
            if (!validateObj.validate) continue;
            const rawError = this.runValidator({
              validate: validateObj.validate,
              value: {
                value: this.state.values,
                formApi: this,
                validationSource: "form"
              },
              type: "validate"
            });
            const { formError, fieldErrors } = normalizeError$1(rawError);
            const errorMapKey = getErrorMapKey$1(validateObj.cause);
            for (const field of Object.keys(
              this.state.fieldMeta
            )) {
              const fieldMeta = this.getFieldMeta(field);
              if (!fieldMeta) continue;
              const {
                errorMap: currentErrorMap,
                errorSourceMap: currentErrorMapSource
              } = fieldMeta;
              const newFormValidatorError = fieldErrors?.[field];
              const { newErrorValue, newSource } = determineFormLevelErrorSourceAndValue({
                newFormValidatorError,
                isPreviousErrorFromFormValidator: (
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  currentErrorMapSource?.[errorMapKey] === "form"
                ),
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                previousErrorValue: currentErrorMap?.[errorMapKey]
              });
              if (newSource === "form") {
                currentValidationErrorMap[field] = {
                  ...currentValidationErrorMap[field],
                  [errorMapKey]: newFormValidatorError
                };
              }
              if (
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                currentErrorMap?.[errorMapKey] !== newErrorValue
              ) {
                this.setFieldMeta(field, (prev) => ({
                  ...prev,
                  errorMap: {
                    ...prev.errorMap,
                    [errorMapKey]: newErrorValue
                  },
                  errorSourceMap: {
                    ...prev.errorSourceMap,
                    [errorMapKey]: newSource
                  }
                }));
              }
            }
            if (this.state.errorMap?.[errorMapKey] !== formError) {
              this.baseStore.setState((prev) => ({
                ...prev,
                errorMap: {
                  ...prev.errorMap,
                  [errorMapKey]: formError
                }
              }));
            }
            if (formError || fieldErrors) {
              hasErrored = true;
            }
          }
          const submitErrKey = getErrorMapKey$1("submit");
          if (
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            this.state.errorMap?.[submitErrKey] && cause !== "submit" && !hasErrored
          ) {
            this.baseStore.setState((prev) => ({
              ...prev,
              errorMap: {
                ...prev.errorMap,
                [submitErrKey]: void 0
              }
            }));
          }
          const serverErrKey = getErrorMapKey$1("server");
          if (
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            this.state.errorMap?.[serverErrKey] && cause !== "server" && !hasErrored
          ) {
            this.baseStore.setState((prev) => ({
              ...prev,
              errorMap: {
                ...prev.errorMap,
                [serverErrKey]: void 0
              }
            }));
          }
        });
        return { hasErrored, fieldsErrorMap: currentValidationErrorMap };
      };
      this.validateAsync = async (cause) => {
        const validates = getAsyncValidatorArray(cause, {
          ...this.options,
          form: this,
          validationLogic: this.options.validationLogic || defaultValidationLogic
        });
        if (!this.state.isFormValidating) {
          this.baseStore.setState((prev) => ({ ...prev, isFormValidating: true }));
        }
        const promises = [];
        let fieldErrorsFromFormValidators;
        for (const validateObj of validates) {
          if (!validateObj.validate) continue;
          const key = getErrorMapKey$1(validateObj.cause);
          const fieldValidatorMeta = this.state.validationMetaMap[key];
          fieldValidatorMeta?.lastAbortController.abort();
          const controller = new AbortController();
          this.state.validationMetaMap[key] = {
            lastAbortController: controller
          };
          promises.push(
            new Promise(async (resolve) => {
              let rawError;
              try {
                rawError = await new Promise((rawResolve, rawReject) => {
                  setTimeout(async () => {
                    if (controller.signal.aborted) return rawResolve(void 0);
                    try {
                      rawResolve(
                        await this.runValidator({
                          validate: validateObj.validate,
                          value: {
                            value: this.state.values,
                            formApi: this,
                            validationSource: "form",
                            signal: controller.signal
                          },
                          type: "validateAsync"
                        })
                      );
                    } catch (e) {
                      rawReject(e);
                    }
                  }, validateObj.debounceMs);
                });
              } catch (e) {
                rawError = e;
              }
              const { formError, fieldErrors: fieldErrorsFromNormalizeError } = normalizeError$1(rawError);
              if (fieldErrorsFromNormalizeError) {
                fieldErrorsFromFormValidators = fieldErrorsFromFormValidators ? {
                  ...fieldErrorsFromFormValidators,
                  ...fieldErrorsFromNormalizeError
                } : fieldErrorsFromNormalizeError;
              }
              const errorMapKey = getErrorMapKey$1(validateObj.cause);
              for (const field of Object.keys(
                this.state.fieldMeta
              )) {
                const fieldMeta = this.getFieldMeta(field);
                if (!fieldMeta) continue;
                const {
                  errorMap: currentErrorMap,
                  errorSourceMap: currentErrorMapSource
                } = fieldMeta;
                const newFormValidatorError = fieldErrorsFromFormValidators?.[field];
                const { newErrorValue, newSource } = determineFormLevelErrorSourceAndValue({
                  newFormValidatorError,
                  isPreviousErrorFromFormValidator: (
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    currentErrorMapSource?.[errorMapKey] === "form"
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  previousErrorValue: currentErrorMap?.[errorMapKey]
                });
                if (
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  currentErrorMap?.[errorMapKey] !== newErrorValue
                ) {
                  this.setFieldMeta(field, (prev) => ({
                    ...prev,
                    errorMap: {
                      ...prev.errorMap,
                      [errorMapKey]: newErrorValue
                    },
                    errorSourceMap: {
                      ...prev.errorSourceMap,
                      [errorMapKey]: newSource
                    }
                  }));
                }
              }
              this.baseStore.setState((prev) => ({
                ...prev,
                errorMap: {
                  ...prev.errorMap,
                  [errorMapKey]: formError
                }
              }));
              resolve(
                fieldErrorsFromFormValidators ? { fieldErrors: fieldErrorsFromFormValidators, errorMapKey } : void 0
              );
            })
          );
        }
        let results = [];
        const fieldsErrorMap = {};
        if (promises.length) {
          results = await Promise.all(promises);
          for (const fieldValidationResult of results) {
            if (fieldValidationResult?.fieldErrors) {
              const { errorMapKey } = fieldValidationResult;
              for (const [field, fieldError] of Object.entries(
                fieldValidationResult.fieldErrors
              )) {
                const oldErrorMap = fieldsErrorMap[field] || {};
                const newErrorMap = {
                  ...oldErrorMap,
                  [errorMapKey]: fieldError
                };
                fieldsErrorMap[field] = newErrorMap;
              }
            }
          }
        }
        this.baseStore.setState((prev) => ({
          ...prev,
          isFormValidating: false
        }));
        return fieldsErrorMap;
      };
      this.validate = (cause) => {
        const { hasErrored, fieldsErrorMap } = this.validateSync(cause);
        if (hasErrored && !this.options.asyncAlways) {
          return fieldsErrorMap;
        }
        return this.validateAsync(cause);
      };
      this.getFieldValue = (field) => getBy(this.state.values, field);
      this.getFieldMeta = (field) => {
        return this.state.fieldMeta[field];
      };
      this.getFieldInfo = (field) => {
        return this.fieldInfo[field] ||= {
          instance: null,
          validationMetaMap: {
            onChange: void 0,
            onBlur: void 0,
            onSubmit: void 0,
            onMount: void 0,
            onServer: void 0,
            onDynamic: void 0
          }
        };
      };
      this.setFieldMeta = (field, updater) => {
        this.baseStore.setState((prev) => {
          return {
            ...prev,
            fieldMetaBase: {
              ...prev.fieldMetaBase,
              [field]: functionalUpdate(
                updater,
                prev.fieldMetaBase[field]
              )
            }
          };
        });
      };
      this.resetFieldMeta = (fieldMeta) => {
        return Object.keys(fieldMeta).reduce(
          (acc, key) => {
            const fieldKey = key;
            acc[fieldKey] = defaultFieldMeta;
            return acc;
          },
          {}
        );
      };
      this.setFieldValue = (field, updater, opts2) => {
        const dontUpdateMeta = opts2?.dontUpdateMeta ?? false;
        batch(() => {
          if (!dontUpdateMeta) {
            this.setFieldMeta(field, (prev) => ({
              ...prev,
              isTouched: true,
              isDirty: true,
              errorMap: {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                ...prev?.errorMap,
                onMount: void 0
              }
            }));
          }
          this.baseStore.setState((prev) => {
            return {
              ...prev,
              values: setBy(prev.values, field, updater)
            };
          });
        });
      };
      this.deleteField = (field) => {
        const subFieldsToDelete = Object.keys(this.fieldInfo).filter((f) => {
          const fieldStr = field.toString();
          return f !== fieldStr && f.startsWith(fieldStr);
        });
        const fieldsToDelete = [...subFieldsToDelete, field];
        this.baseStore.setState((prev) => {
          const newState = { ...prev };
          fieldsToDelete.forEach((f) => {
            newState.values = deleteBy(newState.values, f);
            delete this.fieldInfo[f];
            delete newState.fieldMetaBase[f];
          });
          return newState;
        });
      };
      this.pushFieldValue = (field, value, opts2) => {
        this.setFieldValue(
          field,
          (prev) => [...Array.isArray(prev) ? prev : [], value],
          opts2
        );
        this.validateField(field, "change");
      };
      this.insertFieldValue = async (field, index, value, opts2) => {
        this.setFieldValue(
          field,
          (prev) => {
            return [
              ...prev.slice(0, index),
              value,
              ...prev.slice(index)
            ];
          },
          opts2
        );
        await this.validateField(field, "change");
        metaHelper(this).handleArrayFieldMetaShift(field, index, "insert");
        await this.validateArrayFieldsStartingFrom(field, index, "change");
      };
      this.replaceFieldValue = async (field, index, value, opts2) => {
        this.setFieldValue(
          field,
          (prev) => {
            return prev.map(
              (d, i) => i === index ? value : d
            );
          },
          opts2
        );
        await this.validateField(field, "change");
        await this.validateArrayFieldsStartingFrom(field, index, "change");
      };
      this.removeFieldValue = async (field, index, opts2) => {
        const fieldValue = this.getFieldValue(field);
        const lastIndex = Array.isArray(fieldValue) ? Math.max(fieldValue.length - 1, 0) : null;
        this.setFieldValue(
          field,
          (prev) => {
            return prev.filter(
              (_d, i) => i !== index
            );
          },
          opts2
        );
        metaHelper(this).handleArrayFieldMetaShift(field, index, "remove");
        if (lastIndex !== null) {
          const start = `${field}[${lastIndex}]`;
          this.deleteField(start);
        }
        await this.validateField(field, "change");
        await this.validateArrayFieldsStartingFrom(field, index, "change");
      };
      this.swapFieldValues = (field, index1, index2, opts2) => {
        this.setFieldValue(
          field,
          (prev) => {
            const prev1 = prev[index1];
            const prev2 = prev[index2];
            return setBy(setBy(prev, `${index1}`, prev2), `${index2}`, prev1);
          },
          opts2
        );
        metaHelper(this).handleArrayFieldMetaShift(field, index1, "swap", index2);
        this.validateField(field, "change");
        this.validateField(`${field}[${index1}]`, "change");
        this.validateField(`${field}[${index2}]`, "change");
      };
      this.moveFieldValues = (field, index1, index2, opts2) => {
        this.setFieldValue(
          field,
          (prev) => {
            const next = [...prev];
            next.splice(index2, 0, next.splice(index1, 1)[0]);
            return next;
          },
          opts2
        );
        metaHelper(this).handleArrayFieldMetaShift(field, index1, "move", index2);
        this.validateField(field, "change");
        this.validateField(`${field}[${index1}]`, "change");
        this.validateField(`${field}[${index2}]`, "change");
      };
      this.clearFieldValues = (field, opts2) => {
        const fieldValue = this.getFieldValue(field);
        const lastIndex = Array.isArray(fieldValue) ? Math.max(fieldValue.length - 1, 0) : null;
        this.setFieldValue(field, [], opts2);
        if (lastIndex !== null) {
          for (let i = 0; i <= lastIndex; i++) {
            const fieldKey = `${field}[${i}]`;
            this.deleteField(fieldKey);
          }
        }
        this.validateField(field, "change");
      };
      this.resetField = (field) => {
        this.baseStore.setState((prev) => {
          return {
            ...prev,
            fieldMetaBase: {
              ...prev.fieldMetaBase,
              [field]: defaultFieldMeta
            },
            values: this.options.defaultValues ? setBy(prev.values, field, getBy(this.options.defaultValues, field)) : prev.values
          };
        });
      };
      this.getAllErrors = () => {
        return {
          form: {
            errors: this.state.errors,
            errorMap: this.state.errorMap
          },
          fields: Object.entries(this.state.fieldMeta).reduce(
            (acc, [fieldName, fieldMeta]) => {
              if (Object.keys(fieldMeta).length && fieldMeta.errors.length) {
                acc[fieldName] = {
                  errors: fieldMeta.errors,
                  errorMap: fieldMeta.errorMap
                };
              }
              return acc;
            },
            {}
          )
        };
      };
      this.parseValuesWithSchema = (schema) => {
        return standardSchemaValidators.validate(
          { value: this.state.values, validationSource: "form" },
          schema
        );
      };
      this.parseValuesWithSchemaAsync = (schema) => {
        return standardSchemaValidators.validateAsync(
          { value: this.state.values, validationSource: "form" },
          schema
        );
      };
      this.baseStore = new Store(
        getDefaultFormState({
          ...opts?.defaultState,
          values: opts?.defaultValues ?? opts?.defaultState?.values
        })
      );
      this.fieldMetaDerived = new Derived({
        deps: [this.baseStore],
        fn: ({ prevDepVals, currDepVals, prevVal: _prevVal }) => {
          const prevVal = _prevVal;
          const prevBaseStore = prevDepVals?.[0];
          const currBaseStore = currDepVals[0];
          let originalMetaCount = 0;
          const fieldMeta = {};
          for (const fieldName of Object.keys(
            currBaseStore.fieldMetaBase
          )) {
            const currBaseMeta = currBaseStore.fieldMetaBase[fieldName];
            const prevBaseMeta = prevBaseStore?.fieldMetaBase[fieldName];
            const prevFieldInfo = prevVal?.[fieldName];
            const curFieldVal = getBy(currBaseStore.values, fieldName);
            let fieldErrors = prevFieldInfo?.errors;
            if (!prevBaseMeta || currBaseMeta.errorMap !== prevBaseMeta.errorMap) {
              fieldErrors = Object.values(currBaseMeta.errorMap ?? {}).filter(
                (val) => val !== void 0
              );
              const fieldInstance = this.getFieldInfo(fieldName)?.instance;
              if (fieldInstance && !fieldInstance.options.disableErrorFlat) {
                fieldErrors = fieldErrors?.flat(
                  1
                );
              }
            }
            const isFieldValid = !isNonEmptyArray(fieldErrors ?? []);
            const isFieldPristine = !currBaseMeta.isDirty;
            const isDefaultValue = evaluate(
              curFieldVal,
              getBy(this.options.defaultValues, fieldName)
            ) || evaluate(
              curFieldVal,
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              this.getFieldInfo(fieldName)?.instance?.options.defaultValue
            );
            if (prevFieldInfo && prevFieldInfo.isPristine === isFieldPristine && prevFieldInfo.isValid === isFieldValid && prevFieldInfo.isDefaultValue === isDefaultValue && prevFieldInfo.errors === fieldErrors && currBaseMeta === prevBaseMeta) {
              fieldMeta[fieldName] = prevFieldInfo;
              originalMetaCount++;
              continue;
            }
            fieldMeta[fieldName] = {
              ...currBaseMeta,
              errors: fieldErrors,
              isPristine: isFieldPristine,
              isValid: isFieldValid,
              isDefaultValue
            };
          }
          if (!Object.keys(currBaseStore.fieldMetaBase).length) return fieldMeta;
          if (prevVal && originalMetaCount === Object.keys(currBaseStore.fieldMetaBase).length) {
            return prevVal;
          }
          return fieldMeta;
        }
      });
      this.store = new Derived({
        deps: [this.baseStore, this.fieldMetaDerived],
        fn: ({ prevDepVals, currDepVals, prevVal: _prevVal }) => {
          const prevVal = _prevVal;
          const prevBaseStore = prevDepVals?.[0];
          const currBaseStore = currDepVals[0];
          const currFieldMeta = currDepVals[1];
          const fieldMetaValues = Object.values(currFieldMeta).filter(
            Boolean
          );
          const isFieldsValidating = fieldMetaValues.some(
            (field) => field.isValidating
          );
          const isFieldsValid = fieldMetaValues.every((field) => field.isValid);
          const isTouched = fieldMetaValues.some((field) => field.isTouched);
          const isBlurred = fieldMetaValues.some((field) => field.isBlurred);
          const isDefaultValue = fieldMetaValues.every(
            (field) => field.isDefaultValue
          );
          const shouldInvalidateOnMount = (
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            isTouched && currBaseStore.errorMap?.onMount
          );
          const isDirty = fieldMetaValues.some((field) => field.isDirty);
          const isPristine = !isDirty;
          const hasOnMountError = Boolean(
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            currBaseStore.errorMap?.onMount || // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            fieldMetaValues.some((f) => f?.errorMap?.onMount)
          );
          const isValidating = !!isFieldsValidating;
          let errors = prevVal?.errors ?? [];
          if (!prevBaseStore || currBaseStore.errorMap !== prevBaseStore.errorMap) {
            errors = Object.values(currBaseStore.errorMap).reduce((prev, curr) => {
              if (curr === void 0) return prev;
              if (curr && isGlobalFormValidationError(curr)) {
                prev.push(curr.form);
                return prev;
              }
              prev.push(curr);
              return prev;
            }, []);
          }
          const isFormValid = errors.length === 0;
          const isValid = isFieldsValid && isFormValid;
          const submitInvalid = this.options.canSubmitWhenInvalid ?? false;
          const canSubmit = currBaseStore.submissionAttempts === 0 && !isTouched && !hasOnMountError || !isValidating && !currBaseStore.isSubmitting && isValid || submitInvalid;
          let errorMap = currBaseStore.errorMap;
          if (shouldInvalidateOnMount) {
            errors = errors.filter(
              (err) => err !== currBaseStore.errorMap.onMount
            );
            errorMap = Object.assign(errorMap, { onMount: void 0 });
          }
          if (prevVal && prevBaseStore && prevVal.errorMap === errorMap && prevVal.fieldMeta === this.fieldMetaDerived.state && prevVal.errors === errors && prevVal.isFieldsValidating === isFieldsValidating && prevVal.isFieldsValid === isFieldsValid && prevVal.isFormValid === isFormValid && prevVal.isValid === isValid && prevVal.canSubmit === canSubmit && prevVal.isTouched === isTouched && prevVal.isBlurred === isBlurred && prevVal.isPristine === isPristine && prevVal.isDefaultValue === isDefaultValue && prevVal.isDirty === isDirty && evaluate(prevBaseStore, currBaseStore)) {
            return prevVal;
          }
          let state = {
            ...currBaseStore,
            errorMap,
            fieldMeta: this.fieldMetaDerived.state,
            errors,
            isFieldsValidating,
            isFieldsValid,
            isFormValid,
            isValid,
            canSubmit,
            isTouched,
            isBlurred,
            isPristine,
            isDefaultValue,
            isDirty
          };
          const transformArray = this.options.transform?.deps ?? [];
          const shouldTransform = transformArray.length !== this.prevTransformArray.length || transformArray.some((val, i) => val !== this.prevTransformArray[i]);
          if (shouldTransform) {
            const newObj = Object.assign({}, this, { state });
            this.options.transform?.fn(newObj);
            state = newObj.state;
            this.prevTransformArray = transformArray;
          }
          return state;
        }
      });
      this.handleSubmit = this.handleSubmit.bind(this);
      this.update(opts || {});
    }
    get state() {
      return this.store.state;
    }
    get formId() {
      return this.options.formId;
    }
    /**
     * @private
     */
    runValidator(props) {
      if (isStandardSchemaValidator(props.validate)) {
        return standardSchemaValidators[props.type](
          props.value,
          props.validate
        );
      }
      return props.validate(props.value);
    }
    async handleSubmit(submitMeta) {
      this.baseStore.setState((old) => ({
        ...old,
        // Submission attempts mark the form as not submitted
        isSubmitted: false,
        // Count submission attempts
        submissionAttempts: old.submissionAttempts + 1,
        isSubmitSuccessful: false
        // Reset isSubmitSuccessful at the start of submission
      }));
      batch(() => {
        void Object.values(this.fieldInfo).forEach(
          (field) => {
            if (!field.instance) return;
            if (!field.instance.state.meta.isTouched) {
              field.instance.setMeta((prev) => ({ ...prev, isTouched: true }));
            }
          }
        );
      });
      if (!this.state.canSubmit) return;
      const submitMetaArg = submitMeta ?? this.options.onSubmitMeta;
      this.baseStore.setState((d) => ({ ...d, isSubmitting: true }));
      const done = () => {
        this.baseStore.setState((prev) => ({ ...prev, isSubmitting: false }));
      };
      await this.validateAllFields("submit");
      if (!this.state.isFieldsValid) {
        done();
        this.options.onSubmitInvalid?.({
          value: this.state.values,
          formApi: this,
          meta: submitMetaArg
        });
        return;
      }
      await this.validate("submit");
      if (!this.state.isValid) {
        done();
        this.options.onSubmitInvalid?.({
          value: this.state.values,
          formApi: this,
          meta: submitMetaArg
        });
        return;
      }
      batch(() => {
        void Object.values(this.fieldInfo).forEach(
          (field) => {
            field.instance?.options.listeners?.onSubmit?.({
              value: field.instance.state.value,
              fieldApi: field.instance
            });
          }
        );
      });
      this.options.listeners?.onSubmit?.({ formApi: this, meta: submitMetaArg });
      try {
        await this.options.onSubmit?.({
          value: this.state.values,
          formApi: this,
          meta: submitMetaArg
        });
        batch(() => {
          this.baseStore.setState((prev) => ({
            ...prev,
            isSubmitted: true,
            isSubmitSuccessful: true
            // Set isSubmitSuccessful to true on successful submission
          }));
          done();
        });
      } catch (err) {
        this.baseStore.setState((prev) => ({
          ...prev,
          isSubmitSuccessful: false
          // Ensure isSubmitSuccessful is false if an error occurs
        }));
        done();
        throw err;
      }
    }
    /**
     * Updates the form's errorMap
     */
    setErrorMap(errorMap) {
      batch(() => {
        Object.entries(errorMap).forEach(([key, value]) => {
          const errorMapKey = key;
          if (isGlobalFormValidationError(value)) {
            const { formError, fieldErrors } = normalizeError$1(value);
            for (const fieldName of Object.keys(
              this.fieldInfo
            )) {
              const fieldMeta = this.getFieldMeta(fieldName);
              if (!fieldMeta) continue;
              this.setFieldMeta(fieldName, (prev) => ({
                ...prev,
                errorMap: {
                  ...prev.errorMap,
                  [errorMapKey]: fieldErrors?.[fieldName]
                },
                errorSourceMap: {
                  ...prev.errorSourceMap,
                  [errorMapKey]: "form"
                }
              }));
            }
            this.baseStore.setState((prev) => ({
              ...prev,
              errorMap: {
                ...prev.errorMap,
                [errorMapKey]: formError
              }
            }));
          } else {
            this.baseStore.setState((prev) => ({
              ...prev,
              errorMap: {
                ...prev.errorMap,
                [errorMapKey]: value
              }
            }));
          }
        });
      });
    }
  }
  function normalizeError$1(rawError) {
    if (rawError) {
      if (isGlobalFormValidationError(rawError)) {
        const formError = normalizeError$1(rawError.form).formError;
        const fieldErrors = rawError.fields;
        return { formError, fieldErrors };
      }
      return { formError: rawError };
    }
    return { formError: void 0 };
  }
  function getErrorMapKey$1(cause) {
    switch (cause) {
      case "submit":
        return "onSubmit";
      case "blur":
        return "onBlur";
      case "mount":
        return "onMount";
      case "server":
        return "onServer";
      case "dynamic":
        return "onDynamic";
      case "change":
      default:
        return "onChange";
    }
  }

  class FieldApi {
    /**
     * Initializes a new `FieldApi` instance.
     */
    constructor(opts) {
      this.options = {};
      this.mount = () => {
        const cleanup = this.store.mount();
        if (this.options.defaultValue !== void 0) {
          this.form.setFieldValue(this.name, this.options.defaultValue, {
            dontUpdateMeta: true
          });
        }
        const info = this.getInfo();
        info.instance = this;
        this.update(this.options);
        const { onMount } = this.options.validators || {};
        if (onMount) {
          const error = this.runValidator({
            validate: onMount,
            value: {
              value: this.state.value,
              fieldApi: this,
              validationSource: "field"
            },
            type: "validate"
          });
          if (error) {
            this.setMeta(
              (prev) => ({
                ...prev,
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                errorMap: { ...prev?.errorMap, onMount: error },
                errorSourceMap: {
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  ...prev?.errorSourceMap,
                  onMount: "field"
                }
              })
            );
          }
        }
        this.options.listeners?.onMount?.({
          value: this.state.value,
          fieldApi: this
        });
        return cleanup;
      };
      this.update = (opts2) => {
        this.options = opts2;
        const nameHasChanged = this.name !== opts2.name;
        this.name = opts2.name;
        if (this.state.value === void 0) {
          const formDefault = getBy(opts2.form.options.defaultValues, opts2.name);
          const defaultValue = opts2.defaultValue ?? formDefault;
          if (nameHasChanged) {
            this.setValue((val) => val || defaultValue, {
              dontUpdateMeta: true
            });
          } else if (defaultValue !== void 0) {
            this.setValue(defaultValue, {
              dontUpdateMeta: true
            });
          }
        }
        if (this.form.getFieldMeta(this.name) === void 0) {
          this.setMeta(this.state.meta);
        }
      };
      this.getValue = () => {
        return this.form.getFieldValue(this.name);
      };
      this.setValue = (updater, options) => {
        this.form.setFieldValue(this.name, updater, options);
        this.triggerOnChangeListener();
        this.validate("change");
      };
      this.getMeta = () => this.store.state.meta;
      this.setMeta = (updater) => this.form.setFieldMeta(this.name, updater);
      this.getInfo = () => this.form.getFieldInfo(this.name);
      this.pushValue = (value, opts2) => {
        this.form.pushFieldValue(this.name, value, opts2);
        this.triggerOnChangeListener();
      };
      this.insertValue = (index, value, opts2) => {
        this.form.insertFieldValue(this.name, index, value, opts2);
        this.triggerOnChangeListener();
      };
      this.replaceValue = (index, value, opts2) => {
        this.form.replaceFieldValue(this.name, index, value, opts2);
        this.triggerOnChangeListener();
      };
      this.removeValue = (index, opts2) => {
        this.form.removeFieldValue(this.name, index, opts2);
        this.triggerOnChangeListener();
      };
      this.swapValues = (aIndex, bIndex, opts2) => {
        this.form.swapFieldValues(this.name, aIndex, bIndex, opts2);
        this.triggerOnChangeListener();
      };
      this.moveValue = (aIndex, bIndex, opts2) => {
        this.form.moveFieldValues(this.name, aIndex, bIndex, opts2);
        this.triggerOnChangeListener();
      };
      this.clearValues = (opts2) => {
        this.form.clearFieldValues(this.name, opts2);
        this.triggerOnChangeListener();
      };
      this.getLinkedFields = (cause) => {
        const fields = Object.values(this.form.fieldInfo);
        const linkedFields = [];
        for (const field of fields) {
          if (!field.instance) continue;
          const { onChangeListenTo, onBlurListenTo } = field.instance.options.validators || {};
          if (cause === "change" && onChangeListenTo?.includes(this.name)) {
            linkedFields.push(field.instance);
          }
          if (cause === "blur" && onBlurListenTo?.includes(this.name)) {
            linkedFields.push(field.instance);
          }
        }
        return linkedFields;
      };
      this.validateSync = (cause, errorFromForm) => {
        const validates = getSyncValidatorArray(cause, {
          ...this.options,
          form: this.form,
          validationLogic: this.form.options.validationLogic || defaultValidationLogic
        });
        const linkedFields = this.getLinkedFields(cause);
        const linkedFieldValidates = linkedFields.reduce(
          (acc, field) => {
            const fieldValidates = getSyncValidatorArray(cause, {
              ...field.options,
              form: field.form,
              validationLogic: field.form.options.validationLogic || defaultValidationLogic
            });
            fieldValidates.forEach((validate) => {
              validate.field = field;
            });
            return acc.concat(fieldValidates);
          },
          []
        );
        let hasErrored = false;
        batch(() => {
          const validateFieldFn = (field, validateObj) => {
            const errorMapKey = getErrorMapKey(validateObj.cause);
            const fieldLevelError = validateObj.validate ? normalizeError(
              field.runValidator({
                validate: validateObj.validate,
                value: {
                  value: field.store.state.value,
                  validationSource: "field",
                  fieldApi: field
                },
                type: "validate"
              })
            ) : void 0;
            const formLevelError = errorFromForm[errorMapKey];
            const { newErrorValue, newSource } = determineFieldLevelErrorSourceAndValue({
              formLevelError,
              fieldLevelError
            });
            if (field.state.meta.errorMap?.[errorMapKey] !== newErrorValue) {
              field.setMeta((prev) => ({
                ...prev,
                errorMap: {
                  ...prev.errorMap,
                  [errorMapKey]: newErrorValue
                },
                errorSourceMap: {
                  ...prev.errorSourceMap,
                  [errorMapKey]: newSource
                }
              }));
            }
            if (newErrorValue) {
              hasErrored = true;
            }
          };
          for (const validateObj of validates) {
            validateFieldFn(this, validateObj);
          }
          for (const fieldValitateObj of linkedFieldValidates) {
            if (!fieldValitateObj.validate) continue;
            validateFieldFn(fieldValitateObj.field, fieldValitateObj);
          }
        });
        const submitErrKey = getErrorMapKey("submit");
        if (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          this.state.meta.errorMap?.[submitErrKey] && cause !== "submit" && !hasErrored
        ) {
          this.setMeta((prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              [submitErrKey]: void 0
            },
            errorSourceMap: {
              ...prev.errorSourceMap,
              [submitErrKey]: void 0
            }
          }));
        }
        return { hasErrored };
      };
      this.validateAsync = async (cause, formValidationResultPromise) => {
        const validates = getAsyncValidatorArray(cause, {
          ...this.options,
          form: this.form,
          validationLogic: this.form.options.validationLogic || defaultValidationLogic
        });
        const asyncFormValidationResults = await formValidationResultPromise;
        const linkedFields = this.getLinkedFields(cause);
        const linkedFieldValidates = linkedFields.reduce(
          (acc, field) => {
            const fieldValidates = getAsyncValidatorArray(cause, {
              ...field.options,
              form: field.form,
              validationLogic: field.form.options.validationLogic || defaultValidationLogic
            });
            fieldValidates.forEach((validate) => {
              validate.field = field;
            });
            return acc.concat(fieldValidates);
          },
          []
        );
        if (!this.state.meta.isValidating) {
          this.setMeta((prev) => ({ ...prev, isValidating: true }));
        }
        for (const linkedField of linkedFields) {
          linkedField.setMeta((prev) => ({ ...prev, isValidating: true }));
        }
        const validatesPromises = [];
        const linkedPromises = [];
        const validateFieldAsyncFn = (field, validateObj, promises) => {
          const errorMapKey = getErrorMapKey(validateObj.cause);
          const fieldValidatorMeta = field.getInfo().validationMetaMap[errorMapKey];
          fieldValidatorMeta?.lastAbortController.abort();
          const controller = new AbortController();
          this.getInfo().validationMetaMap[errorMapKey] = {
            lastAbortController: controller
          };
          promises.push(
            new Promise(async (resolve) => {
              let rawError;
              try {
                rawError = await new Promise((rawResolve, rawReject) => {
                  if (this.timeoutIds.validations[validateObj.cause]) {
                    clearTimeout(this.timeoutIds.validations[validateObj.cause]);
                  }
                  this.timeoutIds.validations[validateObj.cause] = setTimeout(
                    async () => {
                      if (controller.signal.aborted) return rawResolve(void 0);
                      try {
                        rawResolve(
                          await this.runValidator({
                            validate: validateObj.validate,
                            value: {
                              value: field.store.state.value,
                              fieldApi: field,
                              signal: controller.signal,
                              validationSource: "field"
                            },
                            type: "validateAsync"
                          })
                        );
                      } catch (e) {
                        rawReject(e);
                      }
                    },
                    validateObj.debounceMs
                  );
                });
              } catch (e) {
                rawError = e;
              }
              if (controller.signal.aborted) return resolve(void 0);
              const fieldLevelError = normalizeError(rawError);
              const formLevelError = asyncFormValidationResults[this.name]?.[errorMapKey];
              const { newErrorValue, newSource } = determineFieldLevelErrorSourceAndValue({
                formLevelError,
                fieldLevelError
              });
              field.setMeta((prev) => {
                return {
                  ...prev,
                  errorMap: {
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    ...prev?.errorMap,
                    [errorMapKey]: newErrorValue
                  },
                  errorSourceMap: {
                    ...prev.errorSourceMap,
                    [errorMapKey]: newSource
                  }
                };
              });
              resolve(newErrorValue);
            })
          );
        };
        for (const validateObj of validates) {
          if (!validateObj.validate) continue;
          validateFieldAsyncFn(this, validateObj, validatesPromises);
        }
        for (const fieldValitateObj of linkedFieldValidates) {
          if (!fieldValitateObj.validate) continue;
          validateFieldAsyncFn(
            fieldValitateObj.field,
            fieldValitateObj,
            linkedPromises
          );
        }
        let results = [];
        if (validatesPromises.length || linkedPromises.length) {
          results = await Promise.all(validatesPromises);
          await Promise.all(linkedPromises);
        }
        this.setMeta((prev) => ({ ...prev, isValidating: false }));
        for (const linkedField of linkedFields) {
          linkedField.setMeta((prev) => ({ ...prev, isValidating: false }));
        }
        return results.filter(Boolean);
      };
      this.validate = (cause, opts2) => {
        if (!this.state.meta.isTouched) return [];
        const { fieldsErrorMap } = opts2?.skipFormValidation ? { fieldsErrorMap: {} } : this.form.validateSync(cause);
        const { hasErrored } = this.validateSync(
          cause,
          fieldsErrorMap[this.name] ?? {}
        );
        if (hasErrored && !this.options.asyncAlways) {
          this.getInfo().validationMetaMap[getErrorMapKey(cause)]?.lastAbortController.abort();
          return this.state.meta.errors;
        }
        const formValidationResultPromise = opts2?.skipFormValidation ? Promise.resolve({}) : this.form.validateAsync(cause);
        return this.validateAsync(cause, formValidationResultPromise);
      };
      this.handleChange = (updater) => {
        this.setValue(updater);
      };
      this.handleBlur = () => {
        const prevTouched = this.state.meta.isTouched;
        if (!prevTouched) {
          this.setMeta((prev) => ({ ...prev, isTouched: true }));
        }
        if (!this.state.meta.isBlurred) {
          this.setMeta((prev) => ({ ...prev, isBlurred: true }));
        }
        this.validate("blur");
        this.triggerOnBlurListener();
      };
      this.parseValueWithSchema = (schema) => {
        return standardSchemaValidators.validate(
          { value: this.state.value, validationSource: "field" },
          schema
        );
      };
      this.parseValueWithSchemaAsync = (schema) => {
        return standardSchemaValidators.validateAsync(
          { value: this.state.value, validationSource: "field" },
          schema
        );
      };
      this.form = opts.form;
      this.name = opts.name;
      this.timeoutIds = {
        validations: {},
        listeners: {},
        formListeners: {}
      };
      this.store = new Derived({
        deps: [this.form.store],
        fn: () => {
          const value = this.form.getFieldValue(this.name);
          const meta = this.form.getFieldMeta(this.name) ?? {
            ...defaultFieldMeta,
            ...opts.defaultMeta
          };
          return {
            value,
            meta
          };
        }
      });
      this.options = opts;
    }
    /**
     * The current field state.
     */
    get state() {
      return this.store.state;
    }
    /**
     * @private
     */
    runValidator(props) {
      if (isStandardSchemaValidator(props.validate)) {
        return standardSchemaValidators[props.type](
          props.value,
          props.validate
        );
      }
      return props.validate(props.value);
    }
    /**
     * Updates the field's errorMap
     */
    setErrorMap(errorMap) {
      this.setMeta((prev) => ({
        ...prev,
        errorMap: {
          ...prev.errorMap,
          ...errorMap
        }
      }));
    }
    triggerOnBlurListener() {
      const formDebounceMs = this.form.options.listeners?.onBlurDebounceMs;
      if (formDebounceMs && formDebounceMs > 0) {
        if (this.timeoutIds.formListeners.blur) {
          clearTimeout(this.timeoutIds.formListeners.blur);
        }
        this.timeoutIds.formListeners.blur = setTimeout(() => {
          this.form.options.listeners?.onBlur?.({
            formApi: this.form,
            fieldApi: this
          });
        }, formDebounceMs);
      } else {
        this.form.options.listeners?.onBlur?.({
          formApi: this.form,
          fieldApi: this
        });
      }
      const fieldDebounceMs = this.options.listeners?.onBlurDebounceMs;
      if (fieldDebounceMs && fieldDebounceMs > 0) {
        if (this.timeoutIds.listeners.blur) {
          clearTimeout(this.timeoutIds.listeners.blur);
        }
        this.timeoutIds.listeners.blur = setTimeout(() => {
          this.options.listeners?.onBlur?.({
            value: this.state.value,
            fieldApi: this
          });
        }, fieldDebounceMs);
      } else {
        this.options.listeners?.onBlur?.({
          value: this.state.value,
          fieldApi: this
        });
      }
    }
    triggerOnChangeListener() {
      const formDebounceMs = this.form.options.listeners?.onChangeDebounceMs;
      if (formDebounceMs && formDebounceMs > 0) {
        if (this.timeoutIds.formListeners.change) {
          clearTimeout(this.timeoutIds.formListeners.change);
        }
        this.timeoutIds.formListeners.change = setTimeout(() => {
          this.form.options.listeners?.onChange?.({
            formApi: this.form,
            fieldApi: this
          });
        }, formDebounceMs);
      } else {
        this.form.options.listeners?.onChange?.({
          formApi: this.form,
          fieldApi: this
        });
      }
      const fieldDebounceMs = this.options.listeners?.onChangeDebounceMs;
      if (fieldDebounceMs && fieldDebounceMs > 0) {
        if (this.timeoutIds.listeners.change) {
          clearTimeout(this.timeoutIds.listeners.change);
        }
        this.timeoutIds.listeners.change = setTimeout(() => {
          this.options.listeners?.onChange?.({
            value: this.state.value,
            fieldApi: this
          });
        }, fieldDebounceMs);
      } else {
        this.options.listeners?.onChange?.({
          value: this.state.value,
          fieldApi: this
        });
      }
    }
  }
  function normalizeError(rawError) {
    if (rawError) {
      return rawError;
    }
    return void 0;
  }
  function getErrorMapKey(cause) {
    switch (cause) {
      case "submit":
        return "onSubmit";
      case "blur":
        return "onBlur";
      case "mount":
        return "onMount";
      case "server":
        return "onServer";
      case "dynamic":
        return "onDynamic";
      case "change":
      default:
        return "onChange";
    }
  }

  var withSelector = {exports: {}};

  var withSelector_production = {};

  var shim$2 = {exports: {}};

  var useSyncExternalStoreShim_production = {};

  /**
   * @license React
   * use-sync-external-store-shim.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var React$1 = React$2;
  function is$1(x, y) {
    return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
  }
  var objectIs$1 = "function" === typeof Object.is ? Object.is : is$1,
    useState = React$1.useState,
    useEffect$1 = React$1.useEffect,
    useLayoutEffect = React$1.useLayoutEffect,
    useDebugValue$1 = React$1.useDebugValue;
  function useSyncExternalStore$2(subscribe, getSnapshot) {
    var value = getSnapshot(),
      _useState = useState({ inst: { value: value, getSnapshot: getSnapshot } }),
      inst = _useState[0].inst,
      forceUpdate = _useState[1];
    useLayoutEffect(
      function () {
        inst.value = value;
        inst.getSnapshot = getSnapshot;
        checkIfSnapshotChanged(inst) && forceUpdate({ inst: inst });
      },
      [subscribe, value, getSnapshot]
    );
    useEffect$1(
      function () {
        checkIfSnapshotChanged(inst) && forceUpdate({ inst: inst });
        return subscribe(function () {
          checkIfSnapshotChanged(inst) && forceUpdate({ inst: inst });
        });
      },
      [subscribe]
    );
    useDebugValue$1(value);
    return value;
  }
  function checkIfSnapshotChanged(inst) {
    var latestGetSnapshot = inst.getSnapshot;
    inst = inst.value;
    try {
      var nextValue = latestGetSnapshot();
      return !objectIs$1(inst, nextValue);
    } catch (error) {
      return true;
    }
  }
  function useSyncExternalStore$1(subscribe, getSnapshot) {
    return getSnapshot();
  }
  var shim$1 =
    "undefined" === typeof window ||
    "undefined" === typeof window.document ||
    "undefined" === typeof window.document.createElement
      ? useSyncExternalStore$1
      : useSyncExternalStore$2;
  useSyncExternalStoreShim_production.useSyncExternalStore =
    void 0 !== React$1.useSyncExternalStore ? React$1.useSyncExternalStore : shim$1;

  {
    shim$2.exports = useSyncExternalStoreShim_production;
  }

  var shimExports = shim$2.exports;

  /**
   * @license React
   * use-sync-external-store-shim/with-selector.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var React = React$2,
    shim = shimExports;
  function is(x, y) {
    return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is,
    useSyncExternalStore = shim.useSyncExternalStore,
    useRef = React.useRef,
    useEffect = React.useEffect,
    useMemo = React.useMemo,
    useDebugValue = React.useDebugValue;
  withSelector_production.useSyncExternalStoreWithSelector = function (
    subscribe,
    getSnapshot,
    getServerSnapshot,
    selector,
    isEqual
  ) {
    var instRef = useRef(null);
    if (null === instRef.current) {
      var inst = { hasValue: false, value: null };
      instRef.current = inst;
    } else inst = instRef.current;
    instRef = useMemo(
      function () {
        function memoizedSelector(nextSnapshot) {
          if (!hasMemo) {
            hasMemo = true;
            memoizedSnapshot = nextSnapshot;
            nextSnapshot = selector(nextSnapshot);
            if (void 0 !== isEqual && inst.hasValue) {
              var currentSelection = inst.value;
              if (isEqual(currentSelection, nextSnapshot))
                return (memoizedSelection = currentSelection);
            }
            return (memoizedSelection = nextSnapshot);
          }
          currentSelection = memoizedSelection;
          if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
          var nextSelection = selector(nextSnapshot);
          if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
            return (memoizedSnapshot = nextSnapshot), currentSelection;
          memoizedSnapshot = nextSnapshot;
          return (memoizedSelection = nextSelection);
        }
        var hasMemo = false,
          memoizedSnapshot,
          memoizedSelection,
          maybeGetServerSnapshot =
            void 0 === getServerSnapshot ? null : getServerSnapshot;
        return [
          function () {
            return memoizedSelector(getSnapshot());
          },
          null === maybeGetServerSnapshot
            ? void 0
            : function () {
                return memoizedSelector(maybeGetServerSnapshot());
              }
        ];
      },
      [getSnapshot, getServerSnapshot, selector, isEqual]
    );
    var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
    useEffect(
      function () {
        inst.hasValue = true;
        inst.value = value;
      },
      [value]
    );
    useDebugValue(value);
    return value;
  };

  {
    withSelector.exports = withSelector_production;
  }

  var withSelectorExports = withSelector.exports;

  function useStore(store, selector = (d) => d) {
    const slice = withSelectorExports.useSyncExternalStoreWithSelector(
      store.subscribe,
      () => store.state,
      () => store.state,
      selector,
      shallow
    );
    return slice;
  }
  function shallow(objA, objB) {
    if (Object.is(objA, objB)) {
      return true;
    }
    if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
      return false;
    }
    if (objA instanceof Map && objB instanceof Map) {
      if (objA.size !== objB.size) return false;
      for (const [k, v] of objA) {
        if (!objB.has(k) || !Object.is(v, objB.get(k))) return false;
      }
      return true;
    }
    if (objA instanceof Set && objB instanceof Set) {
      if (objA.size !== objB.size) return false;
      for (const v of objA) {
        if (!objB.has(v)) return false;
      }
      return true;
    }
    if (objA instanceof Date && objB instanceof Date) {
      if (objA.getTime() !== objB.getTime()) return false;
      return true;
    }
    const keysA = Object.keys(objA);
    if (keysA.length !== Object.keys(objB).length) {
      return false;
    }
    for (let i = 0; i < keysA.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
        return false;
      }
    }
    return true;
  }

  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React$2.useLayoutEffect : React$2.useEffect;

  function useField(opts) {
    const [fieldApi] = React$2.useState(() => {
      const api = new FieldApi({
        ...opts,
        form: opts.form,
        name: opts.name
      });
      const extendedApi = api;
      extendedApi.Field = Field;
      return extendedApi;
    });
    useIsomorphicLayoutEffect(fieldApi.mount, [fieldApi]);
    useIsomorphicLayoutEffect(() => {
      fieldApi.update(opts);
    });
    useStore(
      fieldApi.store,
      opts.mode === "array" ? (state) => {
        return [
          state.meta,
          Object.keys(state.value ?? []).length
        ];
      } : void 0
    );
    return fieldApi;
  }
  const Field = ({
    children,
    ...fieldOptions
  }) => {
    const fieldApi = useField(fieldOptions);
    const jsxToDisplay = React$2.useMemo(
      () => functionalUpdate(children, fieldApi),
      /**
       * The reason this exists is to fix an issue with the React Compiler.
       * Namely, functionalUpdate is memoized where it checks for `fieldApi`, which is a static type.
       * This means that when `state.value` changes, it does not trigger a re-render. The useMemo explicitly fixes this problem
       */
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [children, fieldApi, fieldApi.state.value, fieldApi.state.meta]
    );
    return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: jsxToDisplay });
  };

  function LocalSubscribe({
    form,
    selector,
    children
  }) {
    const data = useStore(form.store, selector);
    return functionalUpdate(children, data);
  }
  function useForm(opts) {
    const [formApi] = React$2.useState(() => {
      const api = new FormApi(opts);
      const extendedApi = api;
      extendedApi.Field = function APIField(props) {
        return /* @__PURE__ */ jsxRuntime.jsx(Field, { ...props, form: api });
      };
      extendedApi.Subscribe = function Subscribe(props) {
        return /* @__PURE__ */ jsxRuntime.jsx(
          LocalSubscribe,
          {
            form: api,
            selector: props.selector,
            children: props.children
          }
        );
      };
      return extendedApi;
    });
    useIsomorphicLayoutEffect(formApi.mount, []);
    useIsomorphicLayoutEffect(() => {
      formApi.update(opts);
    });
    return formApi;
  }

  /** A special constant with type `never` */
  function $constructor(name, initializer, params) {
      function init(inst, def) {
          var _a;
          Object.defineProperty(inst, "_zod", {
              value: inst._zod ?? {},
              enumerable: false,
          });
          (_a = inst._zod).traits ?? (_a.traits = new Set());
          inst._zod.traits.add(name);
          initializer(inst, def);
          // support prototype modifications
          for (const k in _.prototype) {
              if (!(k in inst))
                  Object.defineProperty(inst, k, { value: _.prototype[k].bind(inst) });
          }
          inst._zod.constr = _;
          inst._zod.def = def;
      }
      // doesn't work if Parent has a constructor with arguments
      const Parent = params?.Parent ?? Object;
      class Definition extends Parent {
      }
      Object.defineProperty(Definition, "name", { value: name });
      function _(def) {
          var _a;
          const inst = params?.Parent ? new Definition() : this;
          init(inst, def);
          (_a = inst._zod).deferred ?? (_a.deferred = []);
          for (const fn of inst._zod.deferred) {
              fn();
          }
          return inst;
      }
      Object.defineProperty(_, "init", { value: init });
      Object.defineProperty(_, Symbol.hasInstance, {
          value: (inst) => {
              if (params?.Parent && inst instanceof params.Parent)
                  return true;
              return inst?._zod?.traits?.has(name);
          },
      });
      Object.defineProperty(_, "name", { value: name });
      return _;
  }
  class $ZodAsyncError extends Error {
      constructor() {
          super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
      }
  }
  const globalConfig = {};
  function config(newConfig) {
      return globalConfig;
  }

  // functions
  function getEnumValues(entries) {
      const numericValues = Object.values(entries).filter((v) => typeof v === "number");
      const values = Object.entries(entries)
          .filter(([k, _]) => numericValues.indexOf(+k) === -1)
          .map(([_, v]) => v);
      return values;
  }
  function jsonStringifyReplacer(_, value) {
      if (typeof value === "bigint")
          return value.toString();
      return value;
  }
  function cached(getter) {
      return {
          get value() {
              {
                  const value = getter();
                  Object.defineProperty(this, "value", { value });
                  return value;
              }
          },
      };
  }
  function nullish(input) {
      return input === null || input === undefined;
  }
  function cleanRegex(source) {
      const start = source.startsWith("^") ? 1 : 0;
      const end = source.endsWith("$") ? source.length - 1 : source.length;
      return source.slice(start, end);
  }
  function floatSafeRemainder(val, step) {
      const valDecCount = (val.toString().split(".")[1] || "").length;
      const stepString = step.toString();
      let stepDecCount = (stepString.split(".")[1] || "").length;
      if (stepDecCount === 0 && /\d?e-\d?/.test(stepString)) {
          const match = stepString.match(/\d?e-(\d?)/);
          if (match?.[1]) {
              stepDecCount = Number.parseInt(match[1]);
          }
      }
      const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
      const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
      const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
      return (valInt % stepInt) / 10 ** decCount;
  }
  const EVALUATING = Symbol("evaluating");
  function defineLazy(object, key, getter) {
      let value = undefined;
      Object.defineProperty(object, key, {
          get() {
              if (value === EVALUATING) {
                  // Circular reference detected, return undefined to break the cycle
                  return undefined;
              }
              if (value === undefined) {
                  value = EVALUATING;
                  value = getter();
              }
              return value;
          },
          set(v) {
              Object.defineProperty(object, key, {
                  value: v,
                  // configurable: true,
              });
              // object[key] = v;
          },
          configurable: true,
      });
  }
  function objectClone(obj) {
      return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
  }
  function assignProp(target, prop, value) {
      Object.defineProperty(target, prop, {
          value,
          writable: true,
          enumerable: true,
          configurable: true,
      });
  }
  function mergeDefs(...defs) {
      const mergedDescriptors = {};
      for (const def of defs) {
          const descriptors = Object.getOwnPropertyDescriptors(def);
          Object.assign(mergedDescriptors, descriptors);
      }
      return Object.defineProperties({}, mergedDescriptors);
  }
  function esc(str) {
      return JSON.stringify(str);
  }
  const captureStackTrace = ("captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => { });
  function isObject(data) {
      return typeof data === "object" && data !== null && !Array.isArray(data);
  }
  const allowsEval = cached(() => {
      // @ts-ignore
      if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
          return false;
      }
      try {
          const F = Function;
          new F("");
          return true;
      }
      catch (_) {
          return false;
      }
  });
  function isPlainObject(o) {
      if (isObject(o) === false)
          return false;
      // modified constructor
      const ctor = o.constructor;
      if (ctor === undefined)
          return true;
      // modified prototype
      const prot = ctor.prototype;
      if (isObject(prot) === false)
          return false;
      // ctor doesn't have static `isPrototypeOf`
      if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
          return false;
      }
      return true;
  }
  function shallowClone(o) {
      if (isPlainObject(o))
          return { ...o };
      return o;
  }
  const propertyKeyTypes = new Set(["string", "number", "symbol"]);
  function escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  // zod-specific utils
  function clone(inst, def, params) {
      const cl = new inst._zod.constr(def ?? inst._zod.def);
      if (!def || params?.parent)
          cl._zod.parent = inst;
      return cl;
  }
  function normalizeParams(_params) {
      const params = _params;
      if (!params)
          return {};
      if (typeof params === "string")
          return { error: () => params };
      if (params?.message !== undefined) {
          if (params?.error !== undefined)
              throw new Error("Cannot specify both `message` and `error` params");
          params.error = params.message;
      }
      delete params.message;
      if (typeof params.error === "string")
          return { ...params, error: () => params.error };
      return params;
  }
  function optionalKeys(shape) {
      return Object.keys(shape).filter((k) => {
          return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
      });
  }
  const NUMBER_FORMAT_RANGES = {
      safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
      int32: [-2147483648, 2147483647],
      uint32: [0, 4294967295],
      float32: [-34028234663852886e22, 3.4028234663852886e38],
      float64: [-Number.MAX_VALUE, Number.MAX_VALUE],
  };
  function pick(schema, mask) {
      const currDef = schema._zod.def;
      const def = mergeDefs(schema._zod.def, {
          get shape() {
              const newShape = {};
              for (const key in mask) {
                  if (!(key in currDef.shape)) {
                      throw new Error(`Unrecognized key: "${key}"`);
                  }
                  if (!mask[key])
                      continue;
                  newShape[key] = currDef.shape[key];
              }
              assignProp(this, "shape", newShape); // self-caching
              return newShape;
          },
          checks: [],
      });
      return clone(schema, def);
  }
  function omit(schema, mask) {
      const currDef = schema._zod.def;
      const def = mergeDefs(schema._zod.def, {
          get shape() {
              const newShape = { ...schema._zod.def.shape };
              for (const key in mask) {
                  if (!(key in currDef.shape)) {
                      throw new Error(`Unrecognized key: "${key}"`);
                  }
                  if (!mask[key])
                      continue;
                  delete newShape[key];
              }
              assignProp(this, "shape", newShape); // self-caching
              return newShape;
          },
          checks: [],
      });
      return clone(schema, def);
  }
  function extend(schema, shape) {
      if (!isPlainObject(shape)) {
          throw new Error("Invalid input to extend: expected a plain object");
      }
      const def = mergeDefs(schema._zod.def, {
          get shape() {
              const _shape = { ...schema._zod.def.shape, ...shape };
              assignProp(this, "shape", _shape); // self-caching
              return _shape;
          },
          checks: [],
      });
      return clone(schema, def);
  }
  function merge(a, b) {
      const def = mergeDefs(a._zod.def, {
          get shape() {
              const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
              assignProp(this, "shape", _shape); // self-caching
              return _shape;
          },
          get catchall() {
              return b._zod.def.catchall;
          },
          checks: [], // delete existing checks
      });
      return clone(a, def);
  }
  function partial(Class, schema, mask) {
      const def = mergeDefs(schema._zod.def, {
          get shape() {
              const oldShape = schema._zod.def.shape;
              const shape = { ...oldShape };
              if (mask) {
                  for (const key in mask) {
                      if (!(key in oldShape)) {
                          throw new Error(`Unrecognized key: "${key}"`);
                      }
                      if (!mask[key])
                          continue;
                      // if (oldShape[key]!._zod.optin === "optional") continue;
                      shape[key] = Class
                          ? new Class({
                              type: "optional",
                              innerType: oldShape[key],
                          })
                          : oldShape[key];
                  }
              }
              else {
                  for (const key in oldShape) {
                      // if (oldShape[key]!._zod.optin === "optional") continue;
                      shape[key] = Class
                          ? new Class({
                              type: "optional",
                              innerType: oldShape[key],
                          })
                          : oldShape[key];
                  }
              }
              assignProp(this, "shape", shape); // self-caching
              return shape;
          },
          checks: [],
      });
      return clone(schema, def);
  }
  function required(Class, schema, mask) {
      const def = mergeDefs(schema._zod.def, {
          get shape() {
              const oldShape = schema._zod.def.shape;
              const shape = { ...oldShape };
              if (mask) {
                  for (const key in mask) {
                      if (!(key in shape)) {
                          throw new Error(`Unrecognized key: "${key}"`);
                      }
                      if (!mask[key])
                          continue;
                      // overwrite with non-optional
                      shape[key] = new Class({
                          type: "nonoptional",
                          innerType: oldShape[key],
                      });
                  }
              }
              else {
                  for (const key in oldShape) {
                      // overwrite with non-optional
                      shape[key] = new Class({
                          type: "nonoptional",
                          innerType: oldShape[key],
                      });
                  }
              }
              assignProp(this, "shape", shape); // self-caching
              return shape;
          },
          checks: [],
      });
      return clone(schema, def);
  }
  // invalid_type | too_big | too_small | invalid_format | not_multiple_of | unrecognized_keys | invalid_union | invalid_key | invalid_element | invalid_value | custom
  function aborted(x, startIndex = 0) {
      for (let i = startIndex; i < x.issues.length; i++) {
          if (x.issues[i]?.continue !== true) {
              return true;
          }
      }
      return false;
  }
  function prefixIssues(path, issues) {
      return issues.map((iss) => {
          var _a;
          (_a = iss).path ?? (_a.path = []);
          iss.path.unshift(path);
          return iss;
      });
  }
  function unwrapMessage(message) {
      return typeof message === "string" ? message : message?.message;
  }
  function finalizeIssue(iss, ctx, config) {
      const full = { ...iss, path: iss.path ?? [] };
      // for backwards compatibility
      if (!iss.message) {
          const message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ??
              unwrapMessage(ctx?.error?.(iss)) ??
              unwrapMessage(config.customError?.(iss)) ??
              unwrapMessage(config.localeError?.(iss)) ??
              "Invalid input";
          full.message = message;
      }
      // delete (full as any).def;
      delete full.inst;
      delete full.continue;
      if (!ctx?.reportInput) {
          delete full.input;
      }
      return full;
  }
  function getLengthableOrigin(input) {
      if (Array.isArray(input))
          return "array";
      if (typeof input === "string")
          return "string";
      return "unknown";
  }
  function issue(...args) {
      const [iss, input, inst] = args;
      if (typeof iss === "string") {
          return {
              message: iss,
              code: "custom",
              input,
              inst,
          };
      }
      return { ...iss };
  }

  const initializer$1 = (inst, def) => {
      inst.name = "$ZodError";
      Object.defineProperty(inst, "_zod", {
          value: inst._zod,
          enumerable: false,
      });
      Object.defineProperty(inst, "issues", {
          value: def,
          enumerable: false,
      });
      inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
      Object.defineProperty(inst, "toString", {
          value: () => inst.message,
          enumerable: false,
      });
  };
  const $ZodError = $constructor("$ZodError", initializer$1);
  const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
  function flattenError(error, mapper = (issue) => issue.message) {
      const fieldErrors = {};
      const formErrors = [];
      for (const sub of error.issues) {
          if (sub.path.length > 0) {
              fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
              fieldErrors[sub.path[0]].push(mapper(sub));
          }
          else {
              formErrors.push(mapper(sub));
          }
      }
      return { formErrors, fieldErrors };
  }
  function formatError(error, _mapper) {
      const mapper = _mapper ||
          function (issue) {
              return issue.message;
          };
      const fieldErrors = { _errors: [] };
      const processError = (error) => {
          for (const issue of error.issues) {
              if (issue.code === "invalid_union" && issue.errors.length) {
                  issue.errors.map((issues) => processError({ issues }));
              }
              else if (issue.code === "invalid_key") {
                  processError({ issues: issue.issues });
              }
              else if (issue.code === "invalid_element") {
                  processError({ issues: issue.issues });
              }
              else if (issue.path.length === 0) {
                  fieldErrors._errors.push(mapper(issue));
              }
              else {
                  let curr = fieldErrors;
                  let i = 0;
                  while (i < issue.path.length) {
                      const el = issue.path[i];
                      const terminal = i === issue.path.length - 1;
                      if (!terminal) {
                          curr[el] = curr[el] || { _errors: [] };
                      }
                      else {
                          curr[el] = curr[el] || { _errors: [] };
                          curr[el]._errors.push(mapper(issue));
                      }
                      curr = curr[el];
                      i++;
                  }
              }
          }
      };
      processError(error);
      return fieldErrors;
  }

  const _parse = (_Err) => (schema, value, _ctx, _params) => {
      const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
      const result = schema._zod.run({ value, issues: [] }, ctx);
      if (result instanceof Promise) {
          throw new $ZodAsyncError();
      }
      if (result.issues.length) {
          const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
          captureStackTrace(e, _params?.callee);
          throw e;
      }
      return result.value;
  };
  const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
      const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
      let result = schema._zod.run({ value, issues: [] }, ctx);
      if (result instanceof Promise)
          result = await result;
      if (result.issues.length) {
          const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
          captureStackTrace(e, params?.callee);
          throw e;
      }
      return result.value;
  };
  const _safeParse = (_Err) => (schema, value, _ctx) => {
      const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
      const result = schema._zod.run({ value, issues: [] }, ctx);
      if (result instanceof Promise) {
          throw new $ZodAsyncError();
      }
      return result.issues.length
          ? {
              success: false,
              error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
          }
          : { success: true, data: result.value };
  };
  const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
  const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
      const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
      let result = schema._zod.run({ value, issues: [] }, ctx);
      if (result instanceof Promise)
          result = await result;
      return result.issues.length
          ? {
              success: false,
              error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
          }
          : { success: true, data: result.value };
  };
  const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);

  const cuid = /^[cC][^\s-]{8,}$/;
  const cuid2 = /^[0-9a-z]+$/;
  const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
  const xid = /^[0-9a-vA-V]{20}$/;
  const ksuid = /^[A-Za-z0-9]{27}$/;
  const nanoid = /^[a-zA-Z0-9_-]{21}$/;
  /** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
  const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
  /** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
  const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
  /** Returns a regex for validating an RFC 9562/4122 UUID.
   *
   * @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
  const uuid = (version) => {
      if (!version)
          return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$/;
      return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
  };
  /** Practical email validation */
  const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
  // from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
  const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
  function emoji() {
      return new RegExp(_emoji$1, "u");
  }
  const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
  const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$/;
  const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
  const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
  // https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
  const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
  const base64url = /^[A-Za-z0-9_-]*$/;
  // based on https://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address
  // export const hostname: RegExp = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$/;
  const hostname = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/;
  // https://blog.stevenlevithan.com/archives/validate-phone-number#r4-3 (regex sans spaces)
  const e164 = /^\+(?:[0-9]){6,14}[0-9]$/;
  // const dateSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
  const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
  const date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
  function timeSource(args) {
      const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
      const regex = typeof args.precision === "number"
          ? args.precision === -1
              ? `${hhmm}`
              : args.precision === 0
                  ? `${hhmm}:[0-5]\\d`
                  : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}`
          : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
      return regex;
  }
  function time$1(args) {
      return new RegExp(`^${timeSource(args)}$`);
  }
  // Adapted from https://stackoverflow.com/a/3143231
  function datetime$1(args) {
      const time = timeSource({ precision: args.precision });
      const opts = ["Z"];
      if (args.local)
          opts.push("");
      // if (args.offset) opts.push(`([+-]\\d{2}:\\d{2})`);
      if (args.offset)
          opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
      const timeRegex = `${time}(?:${opts.join("|")})`;
      return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
  }
  const string$1 = (params) => {
      const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
      return new RegExp(`^${regex}$`);
  };
  const integer = /^\d+$/;
  const number$1 = /^-?\d+(?:\.\d+)?/i;
  // regex for string with no uppercase letters
  const lowercase = /^[^A-Z]*$/;
  // regex for string with no lowercase letters
  const uppercase = /^[^a-z]*$/;

  // import { $ZodType } from "./schemas.js";
  const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
      var _a;
      inst._zod ?? (inst._zod = {});
      inst._zod.def = def;
      (_a = inst._zod).onattach ?? (_a.onattach = []);
  });
  const numericOriginMap = {
      number: "number",
      bigint: "bigint",
      object: "date",
  };
  const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
      $ZodCheck.init(inst, def);
      const origin = numericOriginMap[typeof def.value];
      inst._zod.onattach.push((inst) => {
          const bag = inst._zod.bag;
          const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
          if (def.value < curr) {
              if (def.inclusive)
                  bag.maximum = def.value;
              else
                  bag.exclusiveMaximum = def.value;
          }
      });
      inst._zod.check = (payload) => {
          if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
              return;
          }
          payload.issues.push({
              origin,
              code: "too_big",
              maximum: def.value,
              input: payload.value,
              inclusive: def.inclusive,
              inst,
              continue: !def.abort,
          });
      };
  });
  const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
      $ZodCheck.init(inst, def);
      const origin = numericOriginMap[typeof def.value];
      inst._zod.onattach.push((inst) => {
          const bag = inst._zod.bag;
          const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
          if (def.value > curr) {
              if (def.inclusive)
                  bag.minimum = def.value;
              else
                  bag.exclusiveMinimum = def.value;
          }
      });
      inst._zod.check = (payload) => {
          if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
              return;
          }
          payload.issues.push({
              origin,
              code: "too_small",
              minimum: def.value,
              input: payload.value,
              inclusive: def.inclusive,
              inst,
              continue: !def.abort,
          });
      };
  });
  const $ZodCheckMultipleOf = 
  /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
      $ZodCheck.init(inst, def);
      inst._zod.onattach.push((inst) => {
          var _a;
          (_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
      });
      inst._zod.check = (payload) => {
          if (typeof payload.value !== typeof def.value)
              throw new Error("Cannot mix number and bigint in multiple_of check.");
          const isMultiple = typeof payload.value === "bigint"
              ? payload.value % def.value === BigInt(0)
              : floatSafeRemainder(payload.value, def.value) === 0;
          if (isMultiple)
              return;
          payload.issues.push({
              origin: typeof payload.value,
              code: "not_multiple_of",
              divisor: def.value,
              input: payload.value,
              inst,
              continue: !def.abort,
          });
      };
  });
  const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
      $ZodCheck.init(inst, def); // no format checks
      def.format = def.format || "float64";
      const isInt = def.format?.includes("int");
      const origin = isInt ? "int" : "number";
      const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
      inst._zod.onattach.push((inst) => {
          const bag = inst._zod.bag;
          bag.format = def.format;
          bag.minimum = minimum;
          bag.maximum = maximum;
          if (isInt)
              bag.pattern = integer;
      });
      inst._zod.check = (payload) => {
          const input = payload.value;
          if (isInt) {
              if (!Number.isInteger(input)) {
                  // invalid_format issue
                  // payload.issues.push({
                  //   expected: def.format,
                  //   format: def.format,
                  //   code: "invalid_format",
                  //   input,
                  //   inst,
                  // });
                  // invalid_type issue
                  payload.issues.push({
                      expected: origin,
                      format: def.format,
                      code: "invalid_type",
                      continue: false,
                      input,
                      inst,
                  });
                  return;
                  // not_multiple_of issue
                  // payload.issues.push({
                  //   code: "not_multiple_of",
                  //   origin: "number",
                  //   input,
                  //   inst,
                  //   divisor: 1,
                  // });
              }
              if (!Number.isSafeInteger(input)) {
                  if (input > 0) {
                      // too_big
                      payload.issues.push({
                          input,
                          code: "too_big",
                          maximum: Number.MAX_SAFE_INTEGER,
                          note: "Integers must be within the safe integer range.",
                          inst,
                          origin,
                          continue: !def.abort,
                      });
                  }
                  else {
                      // too_small
                      payload.issues.push({
                          input,
                          code: "too_small",
                          minimum: Number.MIN_SAFE_INTEGER,
                          note: "Integers must be within the safe integer range.",
                          inst,
                          origin,
                          continue: !def.abort,
                      });
                  }
                  return;
              }
          }
          if (input < minimum) {
              payload.issues.push({
                  origin: "number",
                  input,
                  code: "too_small",
                  minimum,
                  inclusive: true,
                  inst,
                  continue: !def.abort,
              });
          }
          if (input > maximum) {
              payload.issues.push({
                  origin: "number",
                  input,
                  code: "too_big",
                  maximum,
                  inst,
              });
          }
      };
  });
  const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
      var _a;
      $ZodCheck.init(inst, def);
      (_a = inst._zod.def).when ?? (_a.when = (payload) => {
          const val = payload.value;
          return !nullish(val) && val.length !== undefined;
      });
      inst._zod.onattach.push((inst) => {
          const curr = (inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY);
          if (def.maximum < curr)
              inst._zod.bag.maximum = def.maximum;
      });
      inst._zod.check = (payload) => {
          const input = payload.value;
          const length = input.length;
          if (length <= def.maximum)
              return;
          const origin = getLengthableOrigin(input);
          payload.issues.push({
              origin,
              code: "too_big",
              maximum: def.maximum,
              inclusive: true,
              input,
              inst,
              continue: !def.abort,
          });
      };
  });
  const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
      var _a;
      $ZodCheck.init(inst, def);
      (_a = inst._zod.def).when ?? (_a.when = (payload) => {
          const val = payload.value;
          return !nullish(val) && val.length !== undefined;
      });
      inst._zod.onattach.push((inst) => {
          const curr = (inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY);
          if (def.minimum > curr)
              inst._zod.bag.minimum = def.minimum;
      });
      inst._zod.check = (payload) => {
          const input = payload.value;
          const length = input.length;
          if (length >= def.minimum)
              return;
          const origin = getLengthableOrigin(input);
          payload.issues.push({
              origin,
              code: "too_small",
              minimum: def.minimum,
              inclusive: true,
              input,
              inst,
              continue: !def.abort,
          });
      };
  });
  const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
      var _a;
      $ZodCheck.init(inst, def);
      (_a = inst._zod.def).when ?? (_a.when = (payload) => {
          const val = payload.value;
          return !nullish(val) && val.length !== undefined;
      });
      inst._zod.onattach.push((inst) => {
          const bag = inst._zod.bag;
          bag.minimum = def.length;
          bag.maximum = def.length;
          bag.length = def.length;
      });
      inst._zod.check = (payload) => {
          const input = payload.value;
          const length = input.length;
          if (length === def.length)
              return;
          const origin = getLengthableOrigin(input);
          const tooBig = length > def.length;
          payload.issues.push({
              origin,
              ...(tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length }),
              inclusive: true,
              exact: true,
              input: payload.value,
              inst,
              continue: !def.abort,
          });
      };
  });
  const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
      var _a, _b;
      $ZodCheck.init(inst, def);
      inst._zod.onattach.push((inst) => {
          const bag = inst._zod.bag;
          bag.format = def.format;
          if (def.pattern) {
              bag.patterns ?? (bag.patterns = new Set());
              bag.patterns.add(def.pattern);
          }
      });
      if (def.pattern)
          (_a = inst._zod).check ?? (_a.check = (payload) => {
              def.pattern.lastIndex = 0;
              if (def.pattern.test(payload.value))
                  return;
              payload.issues.push({
                  origin: "string",
                  code: "invalid_format",
                  format: def.format,
                  input: payload.value,
                  ...(def.pattern ? { pattern: def.pattern.toString() } : {}),
                  inst,
                  continue: !def.abort,
              });
          });
      else
          (_b = inst._zod).check ?? (_b.check = () => { });
  });
  const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
      $ZodCheckStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
          def.pattern.lastIndex = 0;
          if (def.pattern.test(payload.value))
              return;
          payload.issues.push({
              origin: "string",
              code: "invalid_format",
              format: "regex",
              input: payload.value,
              pattern: def.pattern.toString(),
              inst,
              continue: !def.abort,
          });
      };
  });
  const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
      def.pattern ?? (def.pattern = lowercase);
      $ZodCheckStringFormat.init(inst, def);
  });
  const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
      def.pattern ?? (def.pattern = uppercase);
      $ZodCheckStringFormat.init(inst, def);
  });
  const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
      $ZodCheck.init(inst, def);
      const escapedRegex = escapeRegex(def.includes);
      const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
      def.pattern = pattern;
      inst._zod.onattach.push((inst) => {
          const bag = inst._zod.bag;
          bag.patterns ?? (bag.patterns = new Set());
          bag.patterns.add(pattern);
      });
      inst._zod.check = (payload) => {
          if (payload.value.includes(def.includes, def.position))
              return;
          payload.issues.push({
              origin: "string",
              code: "invalid_format",
              format: "includes",
              includes: def.includes,
              input: payload.value,
              inst,
              continue: !def.abort,
          });
      };
  });
  const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
      $ZodCheck.init(inst, def);
      const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
      def.pattern ?? (def.pattern = pattern);
      inst._zod.onattach.push((inst) => {
          const bag = inst._zod.bag;
          bag.patterns ?? (bag.patterns = new Set());
          bag.patterns.add(pattern);
      });
      inst._zod.check = (payload) => {
          if (payload.value.startsWith(def.prefix))
              return;
          payload.issues.push({
              origin: "string",
              code: "invalid_format",
              format: "starts_with",
              prefix: def.prefix,
              input: payload.value,
              inst,
              continue: !def.abort,
          });
      };
  });
  const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
      $ZodCheck.init(inst, def);
      const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
      def.pattern ?? (def.pattern = pattern);
      inst._zod.onattach.push((inst) => {
          const bag = inst._zod.bag;
          bag.patterns ?? (bag.patterns = new Set());
          bag.patterns.add(pattern);
      });
      inst._zod.check = (payload) => {
          if (payload.value.endsWith(def.suffix))
              return;
          payload.issues.push({
              origin: "string",
              code: "invalid_format",
              format: "ends_with",
              suffix: def.suffix,
              input: payload.value,
              inst,
              continue: !def.abort,
          });
      };
  });
  const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
      $ZodCheck.init(inst, def);
      inst._zod.check = (payload) => {
          payload.value = def.tx(payload.value);
      };
  });

  class Doc {
      constructor(args = []) {
          this.content = [];
          this.indent = 0;
          if (this)
              this.args = args;
      }
      indented(fn) {
          this.indent += 1;
          fn(this);
          this.indent -= 1;
      }
      write(arg) {
          if (typeof arg === "function") {
              arg(this, { execution: "sync" });
              arg(this, { execution: "async" });
              return;
          }
          const content = arg;
          const lines = content.split("\n").filter((x) => x);
          const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
          const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
          for (const line of dedented) {
              this.content.push(line);
          }
      }
      compile() {
          const F = Function;
          const args = this?.args;
          const content = this?.content ?? [``];
          const lines = [...content.map((x) => `  ${x}`)];
          // console.log(lines.join("\n"));
          return new F(...args, lines.join("\n"));
      }
  }

  const version = {
      major: 4,
      minor: 0,
      patch: 17,
  };

  const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
      var _a;
      inst ?? (inst = {});
      inst._zod.def = def; // set _def property
      inst._zod.bag = inst._zod.bag || {}; // initialize _bag object
      inst._zod.version = version;
      const checks = [...(inst._zod.def.checks ?? [])];
      // if inst is itself a checks.$ZodCheck, run it as a check
      if (inst._zod.traits.has("$ZodCheck")) {
          checks.unshift(inst);
      }
      //
      for (const ch of checks) {
          for (const fn of ch._zod.onattach) {
              fn(inst);
          }
      }
      if (checks.length === 0) {
          // deferred initializer
          // inst._zod.parse is not yet defined
          (_a = inst._zod).deferred ?? (_a.deferred = []);
          inst._zod.deferred?.push(() => {
              inst._zod.run = inst._zod.parse;
          });
      }
      else {
          const runChecks = (payload, checks, ctx) => {
              let isAborted = aborted(payload);
              let asyncResult;
              for (const ch of checks) {
                  if (ch._zod.def.when) {
                      const shouldRun = ch._zod.def.when(payload);
                      if (!shouldRun)
                          continue;
                  }
                  else if (isAborted) {
                      continue;
                  }
                  const currLen = payload.issues.length;
                  const _ = ch._zod.check(payload);
                  if (_ instanceof Promise && ctx?.async === false) {
                      throw new $ZodAsyncError();
                  }
                  if (asyncResult || _ instanceof Promise) {
                      asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
                          await _;
                          const nextLen = payload.issues.length;
                          if (nextLen === currLen)
                              return;
                          if (!isAborted)
                              isAborted = aborted(payload, currLen);
                      });
                  }
                  else {
                      const nextLen = payload.issues.length;
                      if (nextLen === currLen)
                          continue;
                      if (!isAborted)
                          isAborted = aborted(payload, currLen);
                  }
              }
              if (asyncResult) {
                  return asyncResult.then(() => {
                      return payload;
                  });
              }
              return payload;
          };
          inst._zod.run = (payload, ctx) => {
              const result = inst._zod.parse(payload, ctx);
              if (result instanceof Promise) {
                  if (ctx.async === false)
                      throw new $ZodAsyncError();
                  return result.then((result) => runChecks(result, checks, ctx));
              }
              return runChecks(result, checks, ctx);
          };
      }
      inst["~standard"] = {
          validate: (value) => {
              try {
                  const r = safeParse$1(inst, value);
                  return r.success ? { value: r.data } : { issues: r.error?.issues };
              }
              catch (_) {
                  return safeParseAsync$1(inst, value).then((r) => (r.success ? { value: r.data } : { issues: r.error?.issues }));
              }
          },
          vendor: "zod",
          version: 1,
      };
  });
  const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.pattern = [...(inst?._zod.bag?.patterns ?? [])].pop() ?? string$1(inst._zod.bag);
      inst._zod.parse = (payload, _) => {
          if (def.coerce)
              try {
                  payload.value = String(payload.value);
              }
              catch (_) { }
          if (typeof payload.value === "string")
              return payload;
          payload.issues.push({
              expected: "string",
              code: "invalid_type",
              input: payload.value,
              inst,
          });
          return payload;
      };
  });
  const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
      // check initialization must come first
      $ZodCheckStringFormat.init(inst, def);
      $ZodString.init(inst, def);
  });
  const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
      def.pattern ?? (def.pattern = guid);
      $ZodStringFormat.init(inst, def);
  });
  const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
      if (def.version) {
          const versionMap = {
              v1: 1,
              v2: 2,
              v3: 3,
              v4: 4,
              v5: 5,
              v6: 6,
              v7: 7,
              v8: 8,
          };
          const v = versionMap[def.version];
          if (v === undefined)
              throw new Error(`Invalid UUID version: "${def.version}"`);
          def.pattern ?? (def.pattern = uuid(v));
      }
      else
          def.pattern ?? (def.pattern = uuid());
      $ZodStringFormat.init(inst, def);
  });
  const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
      def.pattern ?? (def.pattern = email);
      $ZodStringFormat.init(inst, def);
  });
  const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
      $ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
          try {
              // Trim whitespace from input
              const trimmed = payload.value.trim();
              // @ts-ignore
              const url = new URL(trimmed);
              if (def.hostname) {
                  def.hostname.lastIndex = 0;
                  if (!def.hostname.test(url.hostname)) {
                      payload.issues.push({
                          code: "invalid_format",
                          format: "url",
                          note: "Invalid hostname",
                          pattern: hostname.source,
                          input: payload.value,
                          inst,
                          continue: !def.abort,
                      });
                  }
              }
              if (def.protocol) {
                  def.protocol.lastIndex = 0;
                  if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
                      payload.issues.push({
                          code: "invalid_format",
                          format: "url",
                          note: "Invalid protocol",
                          pattern: def.protocol.source,
                          input: payload.value,
                          inst,
                          continue: !def.abort,
                      });
                  }
              }
              // Set the output value based on normalize flag
              if (def.normalize) {
                  // Use normalized URL
                  payload.value = url.href;
              }
              else {
                  // Preserve the original input (trimmed)
                  payload.value = trimmed;
              }
              return;
          }
          catch (_) {
              payload.issues.push({
                  code: "invalid_format",
                  format: "url",
                  input: payload.value,
                  inst,
                  continue: !def.abort,
              });
          }
      };
  });
  const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
      def.pattern ?? (def.pattern = emoji());
      $ZodStringFormat.init(inst, def);
  });
  const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
      def.pattern ?? (def.pattern = nanoid);
      $ZodStringFormat.init(inst, def);
  });
  const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
      def.pattern ?? (def.pattern = cuid);
      $ZodStringFormat.init(inst, def);
  });
  const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
      def.pattern ?? (def.pattern = cuid2);
      $ZodStringFormat.init(inst, def);
  });
  const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
      def.pattern ?? (def.pattern = ulid);
      $ZodStringFormat.init(inst, def);
  });
  const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
      def.pattern ?? (def.pattern = xid);
      $ZodStringFormat.init(inst, def);
  });
  const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
      def.pattern ?? (def.pattern = ksuid);
      $ZodStringFormat.init(inst, def);
  });
  const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
      def.pattern ?? (def.pattern = datetime$1(def));
      $ZodStringFormat.init(inst, def);
  });
  const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
      def.pattern ?? (def.pattern = date$1);
      $ZodStringFormat.init(inst, def);
  });
  const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
      def.pattern ?? (def.pattern = time$1(def));
      $ZodStringFormat.init(inst, def);
  });
  const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
      def.pattern ?? (def.pattern = duration$1);
      $ZodStringFormat.init(inst, def);
  });
  const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
      def.pattern ?? (def.pattern = ipv4);
      $ZodStringFormat.init(inst, def);
      inst._zod.onattach.push((inst) => {
          const bag = inst._zod.bag;
          bag.format = `ipv4`;
      });
  });
  const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
      def.pattern ?? (def.pattern = ipv6);
      $ZodStringFormat.init(inst, def);
      inst._zod.onattach.push((inst) => {
          const bag = inst._zod.bag;
          bag.format = `ipv6`;
      });
      inst._zod.check = (payload) => {
          try {
              // @ts-ignore
              new URL(`http://[${payload.value}]`);
              // return;
          }
          catch {
              payload.issues.push({
                  code: "invalid_format",
                  format: "ipv6",
                  input: payload.value,
                  inst,
                  continue: !def.abort,
              });
          }
      };
  });
  const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
      def.pattern ?? (def.pattern = cidrv4);
      $ZodStringFormat.init(inst, def);
  });
  const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
      def.pattern ?? (def.pattern = cidrv6); // not used for validation
      $ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
          const [address, prefix] = payload.value.split("/");
          try {
              if (!prefix)
                  throw new Error();
              const prefixNum = Number(prefix);
              if (`${prefixNum}` !== prefix)
                  throw new Error();
              if (prefixNum < 0 || prefixNum > 128)
                  throw new Error();
              // @ts-ignore
              new URL(`http://[${address}]`);
          }
          catch {
              payload.issues.push({
                  code: "invalid_format",
                  format: "cidrv6",
                  input: payload.value,
                  inst,
                  continue: !def.abort,
              });
          }
      };
  });
  //////////////////////////////   ZodBase64   //////////////////////////////
  function isValidBase64(data) {
      if (data === "")
          return true;
      if (data.length % 4 !== 0)
          return false;
      try {
          // @ts-ignore
          atob(data);
          return true;
      }
      catch {
          return false;
      }
  }
  const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
      def.pattern ?? (def.pattern = base64);
      $ZodStringFormat.init(inst, def);
      inst._zod.onattach.push((inst) => {
          inst._zod.bag.contentEncoding = "base64";
      });
      inst._zod.check = (payload) => {
          if (isValidBase64(payload.value))
              return;
          payload.issues.push({
              code: "invalid_format",
              format: "base64",
              input: payload.value,
              inst,
              continue: !def.abort,
          });
      };
  });
  //////////////////////////////   ZodBase64   //////////////////////////////
  function isValidBase64URL(data) {
      if (!base64url.test(data))
          return false;
      const base64 = data.replace(/[-_]/g, (c) => (c === "-" ? "+" : "/"));
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
      return isValidBase64(padded);
  }
  const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
      def.pattern ?? (def.pattern = base64url);
      $ZodStringFormat.init(inst, def);
      inst._zod.onattach.push((inst) => {
          inst._zod.bag.contentEncoding = "base64url";
      });
      inst._zod.check = (payload) => {
          if (isValidBase64URL(payload.value))
              return;
          payload.issues.push({
              code: "invalid_format",
              format: "base64url",
              input: payload.value,
              inst,
              continue: !def.abort,
          });
      };
  });
  const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
      def.pattern ?? (def.pattern = e164);
      $ZodStringFormat.init(inst, def);
  });
  //////////////////////////////   ZodJWT   //////////////////////////////
  function isValidJWT(token, algorithm = null) {
      try {
          const tokensParts = token.split(".");
          if (tokensParts.length !== 3)
              return false;
          const [header] = tokensParts;
          if (!header)
              return false;
          // @ts-ignore
          const parsedHeader = JSON.parse(atob(header));
          if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
              return false;
          if (!parsedHeader.alg)
              return false;
          if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
              return false;
          return true;
      }
      catch {
          return false;
      }
  }
  const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
      $ZodStringFormat.init(inst, def);
      inst._zod.check = (payload) => {
          if (isValidJWT(payload.value, def.alg))
              return;
          payload.issues.push({
              code: "invalid_format",
              format: "jwt",
              input: payload.value,
              inst,
              continue: !def.abort,
          });
      };
  });
  const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
      inst._zod.parse = (payload, _ctx) => {
          if (def.coerce)
              try {
                  payload.value = Number(payload.value);
              }
              catch (_) { }
          const input = payload.value;
          if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
              return payload;
          }
          const received = typeof input === "number"
              ? Number.isNaN(input)
                  ? "NaN"
                  : !Number.isFinite(input)
                      ? "Infinity"
                      : undefined
              : undefined;
          payload.issues.push({
              expected: "number",
              code: "invalid_type",
              input,
              inst,
              ...(received ? { received } : {}),
          });
          return payload;
      };
  });
  const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
      $ZodCheckNumberFormat.init(inst, def);
      $ZodNumber.init(inst, def); // no format checksp
  });
  const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.parse = (payload) => payload;
  });
  const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
          payload.issues.push({
              expected: "never",
              code: "invalid_type",
              input: payload.value,
              inst,
          });
          return payload;
      };
  });
  function handleArrayResult(result, final, index) {
      if (result.issues.length) {
          final.issues.push(...prefixIssues(index, result.issues));
      }
      final.value[index] = result.value;
  }
  const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
          const input = payload.value;
          if (!Array.isArray(input)) {
              payload.issues.push({
                  expected: "array",
                  code: "invalid_type",
                  input,
                  inst,
              });
              return payload;
          }
          payload.value = Array(input.length);
          const proms = [];
          for (let i = 0; i < input.length; i++) {
              const item = input[i];
              const result = def.element._zod.run({
                  value: item,
                  issues: [],
              }, ctx);
              if (result instanceof Promise) {
                  proms.push(result.then((result) => handleArrayResult(result, payload, i)));
              }
              else {
                  handleArrayResult(result, payload, i);
              }
          }
          if (proms.length) {
              return Promise.all(proms).then(() => payload);
          }
          return payload; //handleArrayResultsAsync(parseResults, final);
      };
  });
  function handlePropertyResult(result, final, key, input) {
      if (result.issues.length) {
          final.issues.push(...prefixIssues(key, result.issues));
      }
      if (result.value === undefined) {
          if (key in input) {
              final.value[key] = undefined;
          }
      }
      else {
          final.value[key] = result.value;
      }
  }
  const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
      // requires cast because technically $ZodObject doesn't extend
      $ZodType.init(inst, def);
      const _normalized = cached(() => {
          const keys = Object.keys(def.shape);
          for (const k of keys) {
              if (!def.shape[k]._zod.traits.has("$ZodType")) {
                  throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
              }
          }
          const okeys = optionalKeys(def.shape);
          return {
              shape: def.shape,
              keys,
              keySet: new Set(keys),
              numKeys: keys.length,
              optionalKeys: new Set(okeys),
          };
      });
      defineLazy(inst._zod, "propValues", () => {
          const shape = def.shape;
          const propValues = {};
          for (const key in shape) {
              const field = shape[key]._zod;
              if (field.values) {
                  propValues[key] ?? (propValues[key] = new Set());
                  for (const v of field.values)
                      propValues[key].add(v);
              }
          }
          return propValues;
      });
      const generateFastpass = (shape) => {
          const doc = new Doc(["shape", "payload", "ctx"]);
          const normalized = _normalized.value;
          const parseStr = (key) => {
              const k = esc(key);
              return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
          };
          doc.write(`const input = payload.value;`);
          const ids = Object.create(null);
          let counter = 0;
          for (const key of normalized.keys) {
              ids[key] = `key_${counter++}`;
          }
          // A: preserve key order {
          doc.write(`const newResult = {}`);
          for (const key of normalized.keys) {
              const id = ids[key];
              const k = esc(key);
              doc.write(`const ${id} = ${parseStr(key)};`);
              doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
      `);
          }
          doc.write(`payload.value = newResult;`);
          doc.write(`return payload;`);
          const fn = doc.compile();
          return (payload, ctx) => fn(shape, payload, ctx);
      };
      let fastpass;
      const isObject$1 = isObject;
      const jit = !globalConfig.jitless;
      const allowsEval$1 = allowsEval;
      const fastEnabled = jit && allowsEval$1.value; // && !def.catchall;
      const catchall = def.catchall;
      let value;
      inst._zod.parse = (payload, ctx) => {
          value ?? (value = _normalized.value);
          const input = payload.value;
          if (!isObject$1(input)) {
              payload.issues.push({
                  expected: "object",
                  code: "invalid_type",
                  input,
                  inst,
              });
              return payload;
          }
          const proms = [];
          if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
              // always synchronous
              if (!fastpass)
                  fastpass = generateFastpass(def.shape);
              payload = fastpass(payload, ctx);
          }
          else {
              payload.value = {};
              const shape = value.shape;
              for (const key of value.keys) {
                  const el = shape[key];
                  const r = el._zod.run({ value: input[key], issues: [] }, ctx);
                  if (r instanceof Promise) {
                      proms.push(r.then((r) => handlePropertyResult(r, payload, key, input)));
                  }
                  else {
                      handlePropertyResult(r, payload, key, input);
                  }
              }
          }
          if (!catchall) {
              return proms.length ? Promise.all(proms).then(() => payload) : payload;
          }
          const unrecognized = [];
          // iterate over input keys
          const keySet = value.keySet;
          const _catchall = catchall._zod;
          const t = _catchall.def.type;
          for (const key of Object.keys(input)) {
              if (keySet.has(key))
                  continue;
              if (t === "never") {
                  unrecognized.push(key);
                  continue;
              }
              const r = _catchall.run({ value: input[key], issues: [] }, ctx);
              if (r instanceof Promise) {
                  proms.push(r.then((r) => handlePropertyResult(r, payload, key, input)));
              }
              else {
                  handlePropertyResult(r, payload, key, input);
              }
          }
          if (unrecognized.length) {
              payload.issues.push({
                  code: "unrecognized_keys",
                  keys: unrecognized,
                  input,
                  inst,
              });
          }
          if (!proms.length)
              return payload;
          return Promise.all(proms).then(() => {
              return payload;
          });
      };
  });
  function handleUnionResults(results, final, inst, ctx) {
      for (const result of results) {
          if (result.issues.length === 0) {
              final.value = result.value;
              return final;
          }
      }
      const nonaborted = results.filter((r) => !aborted(r));
      if (nonaborted.length === 1) {
          final.value = nonaborted[0].value;
          return nonaborted[0];
      }
      final.issues.push({
          code: "invalid_union",
          input: final.value,
          inst,
          errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
      });
      return final;
  }
  const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : undefined);
      defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : undefined);
      defineLazy(inst._zod, "values", () => {
          if (def.options.every((o) => o._zod.values)) {
              return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
          }
          return undefined;
      });
      defineLazy(inst._zod, "pattern", () => {
          if (def.options.every((o) => o._zod.pattern)) {
              const patterns = def.options.map((o) => o._zod.pattern);
              return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
          }
          return undefined;
      });
      const single = def.options.length === 1;
      const first = def.options[0]._zod.run;
      inst._zod.parse = (payload, ctx) => {
          if (single) {
              return first(payload, ctx);
          }
          let async = false;
          const results = [];
          for (const option of def.options) {
              const result = option._zod.run({
                  value: payload.value,
                  issues: [],
              }, ctx);
              if (result instanceof Promise) {
                  results.push(result);
                  async = true;
              }
              else {
                  if (result.issues.length === 0)
                      return result;
                  results.push(result);
              }
          }
          if (!async)
              return handleUnionResults(results, payload, inst, ctx);
          return Promise.all(results).then((results) => {
              return handleUnionResults(results, payload, inst, ctx);
          });
      };
  });
  const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
          const input = payload.value;
          const left = def.left._zod.run({ value: input, issues: [] }, ctx);
          const right = def.right._zod.run({ value: input, issues: [] }, ctx);
          const async = left instanceof Promise || right instanceof Promise;
          if (async) {
              return Promise.all([left, right]).then(([left, right]) => {
                  return handleIntersectionResults(payload, left, right);
              });
          }
          return handleIntersectionResults(payload, left, right);
      };
  });
  function mergeValues(a, b) {
      // const aType = parse.t(a);
      // const bType = parse.t(b);
      if (a === b) {
          return { valid: true, data: a };
      }
      if (a instanceof Date && b instanceof Date && +a === +b) {
          return { valid: true, data: a };
      }
      if (isPlainObject(a) && isPlainObject(b)) {
          const bKeys = Object.keys(b);
          const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
          const newObj = { ...a, ...b };
          for (const key of sharedKeys) {
              const sharedValue = mergeValues(a[key], b[key]);
              if (!sharedValue.valid) {
                  return {
                      valid: false,
                      mergeErrorPath: [key, ...sharedValue.mergeErrorPath],
                  };
              }
              newObj[key] = sharedValue.data;
          }
          return { valid: true, data: newObj };
      }
      if (Array.isArray(a) && Array.isArray(b)) {
          if (a.length !== b.length) {
              return { valid: false, mergeErrorPath: [] };
          }
          const newArray = [];
          for (let index = 0; index < a.length; index++) {
              const itemA = a[index];
              const itemB = b[index];
              const sharedValue = mergeValues(itemA, itemB);
              if (!sharedValue.valid) {
                  return {
                      valid: false,
                      mergeErrorPath: [index, ...sharedValue.mergeErrorPath],
                  };
              }
              newArray.push(sharedValue.data);
          }
          return { valid: true, data: newArray };
      }
      return { valid: false, mergeErrorPath: [] };
  }
  function handleIntersectionResults(result, left, right) {
      if (left.issues.length) {
          result.issues.push(...left.issues);
      }
      if (right.issues.length) {
          result.issues.push(...right.issues);
      }
      if (aborted(result))
          return result;
      const merged = mergeValues(left.value, right.value);
      if (!merged.valid) {
          throw new Error(`Unmergable intersection. Error path: ` + `${JSON.stringify(merged.mergeErrorPath)}`);
      }
      result.value = merged.data;
      return result;
  }
  const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
      $ZodType.init(inst, def);
      const values = getEnumValues(def.entries);
      const valuesSet = new Set(values);
      inst._zod.values = valuesSet;
      inst._zod.pattern = new RegExp(`^(${values
        .filter((k) => propertyKeyTypes.has(typeof k))
        .map((o) => (typeof o === "string" ? escapeRegex(o) : o.toString()))
        .join("|")})$`);
      inst._zod.parse = (payload, _ctx) => {
          const input = payload.value;
          if (valuesSet.has(input)) {
              return payload;
          }
          payload.issues.push({
              code: "invalid_value",
              values,
              input,
              inst,
          });
          return payload;
      };
  });
  const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
          const _out = def.transform(payload.value, payload);
          if (_ctx.async) {
              const output = _out instanceof Promise ? _out : Promise.resolve(_out);
              return output.then((output) => {
                  payload.value = output;
                  return payload;
              });
          }
          if (_out instanceof Promise) {
              throw new $ZodAsyncError();
          }
          payload.value = _out;
          return payload;
      };
  });
  function handleOptionalResult(result, input) {
      if (result.issues.length && input === undefined) {
          return { issues: [], value: undefined };
      }
      return result;
  }
  const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.optin = "optional";
      inst._zod.optout = "optional";
      defineLazy(inst._zod, "values", () => {
          return def.innerType._zod.values ? new Set([...def.innerType._zod.values, undefined]) : undefined;
      });
      defineLazy(inst._zod, "pattern", () => {
          const pattern = def.innerType._zod.pattern;
          return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : undefined;
      });
      inst._zod.parse = (payload, ctx) => {
          if (def.innerType._zod.optin === "optional") {
              const result = def.innerType._zod.run(payload, ctx);
              if (result instanceof Promise)
                  return result.then((r) => handleOptionalResult(r, payload.value));
              return handleOptionalResult(result, payload.value);
          }
          if (payload.value === undefined) {
              return payload;
          }
          return def.innerType._zod.run(payload, ctx);
      };
  });
  const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
      defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
      defineLazy(inst._zod, "pattern", () => {
          const pattern = def.innerType._zod.pattern;
          return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : undefined;
      });
      defineLazy(inst._zod, "values", () => {
          return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : undefined;
      });
      inst._zod.parse = (payload, ctx) => {
          if (payload.value === null)
              return payload;
          return def.innerType._zod.run(payload, ctx);
      };
  });
  const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
      $ZodType.init(inst, def);
      // inst._zod.qin = "true";
      inst._zod.optin = "optional";
      defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      inst._zod.parse = (payload, ctx) => {
          if (payload.value === undefined) {
              payload.value = def.defaultValue;
              /**
               * $ZodDefault always returns the default value immediately.
               * It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
              return payload;
          }
          const result = def.innerType._zod.run(payload, ctx);
          if (result instanceof Promise) {
              return result.then((result) => handleDefaultResult(result, def));
          }
          return handleDefaultResult(result, def);
      };
  });
  function handleDefaultResult(payload, def) {
      if (payload.value === undefined) {
          payload.value = def.defaultValue;
      }
      return payload;
  }
  const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.optin = "optional";
      defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      inst._zod.parse = (payload, ctx) => {
          if (payload.value === undefined) {
              payload.value = def.defaultValue;
          }
          return def.innerType._zod.run(payload, ctx);
      };
  });
  const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazy(inst._zod, "values", () => {
          const v = def.innerType._zod.values;
          return v ? new Set([...v].filter((x) => x !== undefined)) : undefined;
      });
      inst._zod.parse = (payload, ctx) => {
          const result = def.innerType._zod.run(payload, ctx);
          if (result instanceof Promise) {
              return result.then((result) => handleNonOptionalResult(result, inst));
          }
          return handleNonOptionalResult(result, inst);
      };
  });
  function handleNonOptionalResult(payload, inst) {
      if (!payload.issues.length && payload.value === undefined) {
          payload.issues.push({
              code: "invalid_type",
              expected: "nonoptional",
              input: payload.value,
              inst,
          });
      }
      return payload;
  }
  const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
      defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
      defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      inst._zod.parse = (payload, ctx) => {
          const result = def.innerType._zod.run(payload, ctx);
          if (result instanceof Promise) {
              return result.then((result) => {
                  payload.value = result.value;
                  if (result.issues.length) {
                      payload.value = def.catchValue({
                          ...payload,
                          error: {
                              issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
                          },
                          input: payload.value,
                      });
                      payload.issues = [];
                  }
                  return payload;
              });
          }
          payload.value = result.value;
          if (result.issues.length) {
              payload.value = def.catchValue({
                  ...payload,
                  error: {
                      issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
                  },
                  input: payload.value,
              });
              payload.issues = [];
          }
          return payload;
      };
  });
  const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazy(inst._zod, "values", () => def.in._zod.values);
      defineLazy(inst._zod, "optin", () => def.in._zod.optin);
      defineLazy(inst._zod, "optout", () => def.out._zod.optout);
      defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
      inst._zod.parse = (payload, ctx) => {
          const left = def.in._zod.run(payload, ctx);
          if (left instanceof Promise) {
              return left.then((left) => handlePipeResult(left, def, ctx));
          }
          return handlePipeResult(left, def, ctx);
      };
  });
  function handlePipeResult(left, def, ctx) {
      if (left.issues.length) {
          return left;
      }
      return def.out._zod.run({ value: left.value, issues: left.issues }, ctx);
  }
  const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
      defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
      defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
      inst._zod.parse = (payload, ctx) => {
          const result = def.innerType._zod.run(payload, ctx);
          if (result instanceof Promise) {
              return result.then(handleReadonlyResult);
          }
          return handleReadonlyResult(result);
      };
  });
  function handleReadonlyResult(payload) {
      payload.value = Object.freeze(payload.value);
      return payload;
  }
  const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
      $ZodCheck.init(inst, def);
      $ZodType.init(inst, def);
      inst._zod.parse = (payload, _) => {
          return payload;
      };
      inst._zod.check = (payload) => {
          const input = payload.value;
          const r = def.fn(input);
          if (r instanceof Promise) {
              return r.then((r) => handleRefineResult(r, payload, input, inst));
          }
          handleRefineResult(r, payload, input, inst);
          return;
      };
  });
  function handleRefineResult(result, payload, input, inst) {
      if (!result) {
          const _iss = {
              code: "custom",
              input,
              inst, // incorporates params.error into issue reporting
              path: [...(inst._zod.def.path ?? [])], // incorporates params.error into issue reporting
              continue: !inst._zod.def.abort,
              // params: inst._zod.def.params,
          };
          if (inst._zod.def.params)
              _iss.params = inst._zod.def.params;
          payload.issues.push(issue(_iss));
      }
  }

  class $ZodRegistry {
      constructor() {
          this._map = new Map();
          this._idmap = new Map();
      }
      add(schema, ..._meta) {
          const meta = _meta[0];
          this._map.set(schema, meta);
          if (meta && typeof meta === "object" && "id" in meta) {
              if (this._idmap.has(meta.id)) {
                  throw new Error(`ID ${meta.id} already exists in the registry`);
              }
              this._idmap.set(meta.id, schema);
          }
          return this;
      }
      clear() {
          this._map = new Map();
          this._idmap = new Map();
          return this;
      }
      remove(schema) {
          const meta = this._map.get(schema);
          if (meta && typeof meta === "object" && "id" in meta) {
              this._idmap.delete(meta.id);
          }
          this._map.delete(schema);
          return this;
      }
      get(schema) {
          // return this._map.get(schema) as any;
          // inherit metadata
          const p = schema._zod.parent;
          if (p) {
              const pm = { ...(this.get(p) ?? {}) };
              delete pm.id; // do not inherit id
              const f = { ...pm, ...this._map.get(schema) };
              return Object.keys(f).length ? f : undefined;
          }
          return this._map.get(schema);
      }
      has(schema) {
          return this._map.has(schema);
      }
  }
  // registries
  function registry() {
      return new $ZodRegistry();
  }
  const globalRegistry = /*@__PURE__*/ registry();

  function _string(Class, params) {
      return new Class({
          type: "string",
          ...normalizeParams(params),
      });
  }
  function _email(Class, params) {
      return new Class({
          type: "string",
          format: "email",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _guid(Class, params) {
      return new Class({
          type: "string",
          format: "guid",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _uuid(Class, params) {
      return new Class({
          type: "string",
          format: "uuid",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _uuidv4(Class, params) {
      return new Class({
          type: "string",
          format: "uuid",
          check: "string_format",
          abort: false,
          version: "v4",
          ...normalizeParams(params),
      });
  }
  function _uuidv6(Class, params) {
      return new Class({
          type: "string",
          format: "uuid",
          check: "string_format",
          abort: false,
          version: "v6",
          ...normalizeParams(params),
      });
  }
  function _uuidv7(Class, params) {
      return new Class({
          type: "string",
          format: "uuid",
          check: "string_format",
          abort: false,
          version: "v7",
          ...normalizeParams(params),
      });
  }
  function _url(Class, params) {
      return new Class({
          type: "string",
          format: "url",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _emoji(Class, params) {
      return new Class({
          type: "string",
          format: "emoji",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _nanoid(Class, params) {
      return new Class({
          type: "string",
          format: "nanoid",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _cuid(Class, params) {
      return new Class({
          type: "string",
          format: "cuid",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _cuid2(Class, params) {
      return new Class({
          type: "string",
          format: "cuid2",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _ulid(Class, params) {
      return new Class({
          type: "string",
          format: "ulid",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _xid(Class, params) {
      return new Class({
          type: "string",
          format: "xid",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _ksuid(Class, params) {
      return new Class({
          type: "string",
          format: "ksuid",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _ipv4(Class, params) {
      return new Class({
          type: "string",
          format: "ipv4",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _ipv6(Class, params) {
      return new Class({
          type: "string",
          format: "ipv6",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _cidrv4(Class, params) {
      return new Class({
          type: "string",
          format: "cidrv4",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _cidrv6(Class, params) {
      return new Class({
          type: "string",
          format: "cidrv6",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _base64(Class, params) {
      return new Class({
          type: "string",
          format: "base64",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _base64url(Class, params) {
      return new Class({
          type: "string",
          format: "base64url",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _e164(Class, params) {
      return new Class({
          type: "string",
          format: "e164",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _jwt(Class, params) {
      return new Class({
          type: "string",
          format: "jwt",
          check: "string_format",
          abort: false,
          ...normalizeParams(params),
      });
  }
  function _isoDateTime(Class, params) {
      return new Class({
          type: "string",
          format: "datetime",
          check: "string_format",
          offset: false,
          local: false,
          precision: null,
          ...normalizeParams(params),
      });
  }
  function _isoDate(Class, params) {
      return new Class({
          type: "string",
          format: "date",
          check: "string_format",
          ...normalizeParams(params),
      });
  }
  function _isoTime(Class, params) {
      return new Class({
          type: "string",
          format: "time",
          check: "string_format",
          precision: null,
          ...normalizeParams(params),
      });
  }
  function _isoDuration(Class, params) {
      return new Class({
          type: "string",
          format: "duration",
          check: "string_format",
          ...normalizeParams(params),
      });
  }
  function _number(Class, params) {
      return new Class({
          type: "number",
          checks: [],
          ...normalizeParams(params),
      });
  }
  function _int(Class, params) {
      return new Class({
          type: "number",
          check: "number_format",
          abort: false,
          format: "safeint",
          ...normalizeParams(params),
      });
  }
  function _unknown(Class) {
      return new Class({
          type: "unknown",
      });
  }
  function _never(Class, params) {
      return new Class({
          type: "never",
          ...normalizeParams(params),
      });
  }
  function _lt(value, params) {
      return new $ZodCheckLessThan({
          check: "less_than",
          ...normalizeParams(params),
          value,
          inclusive: false,
      });
  }
  function _lte(value, params) {
      return new $ZodCheckLessThan({
          check: "less_than",
          ...normalizeParams(params),
          value,
          inclusive: true,
      });
  }
  function _gt(value, params) {
      return new $ZodCheckGreaterThan({
          check: "greater_than",
          ...normalizeParams(params),
          value,
          inclusive: false,
      });
  }
  function _gte(value, params) {
      return new $ZodCheckGreaterThan({
          check: "greater_than",
          ...normalizeParams(params),
          value,
          inclusive: true,
      });
  }
  function _multipleOf(value, params) {
      return new $ZodCheckMultipleOf({
          check: "multiple_of",
          ...normalizeParams(params),
          value,
      });
  }
  function _maxLength(maximum, params) {
      const ch = new $ZodCheckMaxLength({
          check: "max_length",
          ...normalizeParams(params),
          maximum,
      });
      return ch;
  }
  function _minLength(minimum, params) {
      return new $ZodCheckMinLength({
          check: "min_length",
          ...normalizeParams(params),
          minimum,
      });
  }
  function _length(length, params) {
      return new $ZodCheckLengthEquals({
          check: "length_equals",
          ...normalizeParams(params),
          length,
      });
  }
  function _regex(pattern, params) {
      return new $ZodCheckRegex({
          check: "string_format",
          format: "regex",
          ...normalizeParams(params),
          pattern,
      });
  }
  function _lowercase(params) {
      return new $ZodCheckLowerCase({
          check: "string_format",
          format: "lowercase",
          ...normalizeParams(params),
      });
  }
  function _uppercase(params) {
      return new $ZodCheckUpperCase({
          check: "string_format",
          format: "uppercase",
          ...normalizeParams(params),
      });
  }
  function _includes(includes, params) {
      return new $ZodCheckIncludes({
          check: "string_format",
          format: "includes",
          ...normalizeParams(params),
          includes,
      });
  }
  function _startsWith(prefix, params) {
      return new $ZodCheckStartsWith({
          check: "string_format",
          format: "starts_with",
          ...normalizeParams(params),
          prefix,
      });
  }
  function _endsWith(suffix, params) {
      return new $ZodCheckEndsWith({
          check: "string_format",
          format: "ends_with",
          ...normalizeParams(params),
          suffix,
      });
  }
  function _overwrite(tx) {
      return new $ZodCheckOverwrite({
          check: "overwrite",
          tx,
      });
  }
  // normalize
  function _normalize(form) {
      return _overwrite((input) => input.normalize(form));
  }
  // trim
  function _trim() {
      return _overwrite((input) => input.trim());
  }
  // toLowerCase
  function _toLowerCase() {
      return _overwrite((input) => input.toLowerCase());
  }
  // toUpperCase
  function _toUpperCase() {
      return _overwrite((input) => input.toUpperCase());
  }
  function _array(Class, element, params) {
      return new Class({
          type: "array",
          element,
          // get element() {
          //   return element;
          // },
          ...normalizeParams(params),
      });
  }
  // same as _custom but defaults to abort:false
  function _refine(Class, fn, _params) {
      const schema = new Class({
          type: "custom",
          check: "custom",
          fn: fn,
          ...normalizeParams(_params),
      });
      return schema;
  }
  function _superRefine(fn) {
      const ch = _check((payload) => {
          payload.addIssue = (issue$1) => {
              if (typeof issue$1 === "string") {
                  payload.issues.push(issue(issue$1, payload.value, ch._zod.def));
              }
              else {
                  // for Zod 3 backwards compatibility
                  const _issue = issue$1;
                  if (_issue.fatal)
                      _issue.continue = false;
                  _issue.code ?? (_issue.code = "custom");
                  _issue.input ?? (_issue.input = payload.value);
                  _issue.inst ?? (_issue.inst = ch);
                  _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
                  payload.issues.push(issue(_issue));
              }
          };
          return fn(payload.value, payload);
      });
      return ch;
  }
  function _check(fn, params) {
      const ch = new $ZodCheck({
          check: "custom",
          ...normalizeParams(params),
      });
      ch._zod.check = fn;
      return ch;
  }

  const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
      $ZodISODateTime.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  function datetime(params) {
      return _isoDateTime(ZodISODateTime, params);
  }
  const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
      $ZodISODate.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  function date(params) {
      return _isoDate(ZodISODate, params);
  }
  const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
      $ZodISOTime.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  function time(params) {
      return _isoTime(ZodISOTime, params);
  }
  const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
      $ZodISODuration.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  function duration(params) {
      return _isoDuration(ZodISODuration, params);
  }

  const initializer = (inst, issues) => {
      $ZodError.init(inst, issues);
      inst.name = "ZodError";
      Object.defineProperties(inst, {
          format: {
              value: (mapper) => formatError(inst, mapper),
              // enumerable: false,
          },
          flatten: {
              value: (mapper) => flattenError(inst, mapper),
              // enumerable: false,
          },
          addIssue: {
              value: (issue) => {
                  inst.issues.push(issue);
                  inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
              },
              // enumerable: false,
          },
          addIssues: {
              value: (issues) => {
                  inst.issues.push(...issues);
                  inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
              },
              // enumerable: false,
          },
          isEmpty: {
              get() {
                  return inst.issues.length === 0;
              },
              // enumerable: false,
          },
      });
      // Object.defineProperty(inst, "isEmpty", {
      //   get() {
      //     return inst.issues.length === 0;
      //   },
      // });
  };
  const ZodRealError = $constructor("ZodError", initializer, {
      Parent: Error,
  });
  // /** @deprecated Use `z.core.$ZodErrorMapCtx` instead. */
  // export type ErrorMapCtx = core.$ZodErrorMapCtx;

  const parse = /* @__PURE__ */ _parse(ZodRealError);
  const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
  const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
  const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);

  const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
      $ZodType.init(inst, def);
      inst.def = def;
      Object.defineProperty(inst, "_def", { value: def });
      // base methods
      inst.check = (...checks) => {
          return inst.clone({
              ...def,
              checks: [
                  ...(def.checks ?? []),
                  ...checks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch),
              ],
          }
          // { parent: true }
          );
      };
      inst.clone = (def, params) => clone(inst, def, params);
      inst.brand = () => inst;
      inst.register = ((reg, meta) => {
          reg.add(inst, meta);
          return inst;
      });
      // parsing
      inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
      inst.safeParse = (data, params) => safeParse(inst, data, params);
      inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
      inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
      inst.spa = inst.safeParseAsync;
      // refinements
      inst.refine = (check, params) => inst.check(refine(check, params));
      inst.superRefine = (refinement) => inst.check(superRefine(refinement));
      inst.overwrite = (fn) => inst.check(_overwrite(fn));
      // wrappers
      inst.optional = () => optional(inst);
      inst.nullable = () => nullable(inst);
      inst.nullish = () => optional(nullable(inst));
      inst.nonoptional = (params) => nonoptional(inst, params);
      inst.array = () => array(inst);
      inst.or = (arg) => union([inst, arg]);
      inst.and = (arg) => intersection(inst, arg);
      inst.transform = (tx) => pipe(inst, transform(tx));
      inst.default = (def) => _default(inst, def);
      inst.prefault = (def) => prefault(inst, def);
      // inst.coalesce = (def, params) => coalesce(inst, def, params);
      inst.catch = (params) => _catch(inst, params);
      inst.pipe = (target) => pipe(inst, target);
      inst.readonly = () => readonly(inst);
      // meta
      inst.describe = (description) => {
          const cl = inst.clone();
          globalRegistry.add(cl, { description });
          return cl;
      };
      Object.defineProperty(inst, "description", {
          get() {
              return globalRegistry.get(inst)?.description;
          },
          configurable: true,
      });
      inst.meta = (...args) => {
          if (args.length === 0) {
              return globalRegistry.get(inst);
          }
          const cl = inst.clone();
          globalRegistry.add(cl, args[0]);
          return cl;
      };
      // helpers
      inst.isOptional = () => inst.safeParse(undefined).success;
      inst.isNullable = () => inst.safeParse(null).success;
      return inst;
  });
  /** @internal */
  const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
      $ZodString.init(inst, def);
      ZodType.init(inst, def);
      const bag = inst._zod.bag;
      inst.format = bag.format ?? null;
      inst.minLength = bag.minimum ?? null;
      inst.maxLength = bag.maximum ?? null;
      // validations
      inst.regex = (...args) => inst.check(_regex(...args));
      inst.includes = (...args) => inst.check(_includes(...args));
      inst.startsWith = (...args) => inst.check(_startsWith(...args));
      inst.endsWith = (...args) => inst.check(_endsWith(...args));
      inst.min = (...args) => inst.check(_minLength(...args));
      inst.max = (...args) => inst.check(_maxLength(...args));
      inst.length = (...args) => inst.check(_length(...args));
      inst.nonempty = (...args) => inst.check(_minLength(1, ...args));
      inst.lowercase = (params) => inst.check(_lowercase(params));
      inst.uppercase = (params) => inst.check(_uppercase(params));
      // transforms
      inst.trim = () => inst.check(_trim());
      inst.normalize = (...args) => inst.check(_normalize(...args));
      inst.toLowerCase = () => inst.check(_toLowerCase());
      inst.toUpperCase = () => inst.check(_toUpperCase());
  });
  const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
      $ZodString.init(inst, def);
      _ZodString.init(inst, def);
      inst.email = (params) => inst.check(_email(ZodEmail, params));
      inst.url = (params) => inst.check(_url(ZodURL, params));
      inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
      inst.emoji = (params) => inst.check(_emoji(ZodEmoji, params));
      inst.guid = (params) => inst.check(_guid(ZodGUID, params));
      inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
      inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
      inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
      inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
      inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
      inst.guid = (params) => inst.check(_guid(ZodGUID, params));
      inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
      inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
      inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
      inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
      inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
      inst.xid = (params) => inst.check(_xid(ZodXID, params));
      inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
      inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
      inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
      inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
      inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
      inst.e164 = (params) => inst.check(_e164(ZodE164, params));
      // iso
      inst.datetime = (params) => inst.check(datetime(params));
      inst.date = (params) => inst.check(date(params));
      inst.time = (params) => inst.check(time(params));
      inst.duration = (params) => inst.check(duration(params));
  });
  function string(params) {
      return _string(ZodString, params);
  }
  const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
      $ZodStringFormat.init(inst, def);
      _ZodString.init(inst, def);
  });
  const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodEmail.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodGUID.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodUUID.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodURL.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodEmoji.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodNanoID.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodCUID.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodCUID2.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodULID.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodXID.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodKSUID.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodIPv4.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodIPv6.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
      $ZodCIDRv4.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
      $ZodCIDRv6.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodBase64.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodBase64URL.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodE164.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
      // ZodStringFormat.init(inst, def);
      $ZodJWT.init(inst, def);
      ZodStringFormat.init(inst, def);
  });
  const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
      $ZodNumber.init(inst, def);
      ZodType.init(inst, def);
      inst.gt = (value, params) => inst.check(_gt(value, params));
      inst.gte = (value, params) => inst.check(_gte(value, params));
      inst.min = (value, params) => inst.check(_gte(value, params));
      inst.lt = (value, params) => inst.check(_lt(value, params));
      inst.lte = (value, params) => inst.check(_lte(value, params));
      inst.max = (value, params) => inst.check(_lte(value, params));
      inst.int = (params) => inst.check(int(params));
      inst.safe = (params) => inst.check(int(params));
      inst.positive = (params) => inst.check(_gt(0, params));
      inst.nonnegative = (params) => inst.check(_gte(0, params));
      inst.negative = (params) => inst.check(_lt(0, params));
      inst.nonpositive = (params) => inst.check(_lte(0, params));
      inst.multipleOf = (value, params) => inst.check(_multipleOf(value, params));
      inst.step = (value, params) => inst.check(_multipleOf(value, params));
      // inst.finite = (params) => inst.check(core.finite(params));
      inst.finite = () => inst;
      const bag = inst._zod.bag;
      inst.minValue =
          Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
      inst.maxValue =
          Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
      inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
      inst.isFinite = true;
      inst.format = bag.format ?? null;
  });
  function number(params) {
      return _number(ZodNumber, params);
  }
  const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
      $ZodNumberFormat.init(inst, def);
      ZodNumber.init(inst, def);
  });
  function int(params) {
      return _int(ZodNumberFormat, params);
  }
  const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
      $ZodUnknown.init(inst, def);
      ZodType.init(inst, def);
  });
  function unknown() {
      return _unknown(ZodUnknown);
  }
  const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
      $ZodNever.init(inst, def);
      ZodType.init(inst, def);
  });
  function never(params) {
      return _never(ZodNever, params);
  }
  const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
      $ZodArray.init(inst, def);
      ZodType.init(inst, def);
      inst.element = def.element;
      inst.min = (minLength, params) => inst.check(_minLength(minLength, params));
      inst.nonempty = (params) => inst.check(_minLength(1, params));
      inst.max = (maxLength, params) => inst.check(_maxLength(maxLength, params));
      inst.length = (len, params) => inst.check(_length(len, params));
      inst.unwrap = () => inst.element;
  });
  function array(element, params) {
      return _array(ZodArray, element, params);
  }
  const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
      $ZodObject.init(inst, def);
      ZodType.init(inst, def);
      defineLazy(inst, "shape", () => def.shape);
      inst.keyof = () => _enum(Object.keys(inst._zod.def.shape));
      inst.catchall = (catchall) => inst.clone({ ...inst._zod.def, catchall: catchall });
      inst.passthrough = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
      inst.loose = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
      inst.strict = () => inst.clone({ ...inst._zod.def, catchall: never() });
      inst.strip = () => inst.clone({ ...inst._zod.def, catchall: undefined });
      inst.extend = (incoming) => {
          return extend(inst, incoming);
      };
      inst.merge = (other) => merge(inst, other);
      inst.pick = (mask) => pick(inst, mask);
      inst.omit = (mask) => omit(inst, mask);
      inst.partial = (...args) => partial(ZodOptional, inst, args[0]);
      inst.required = (...args) => required(ZodNonOptional, inst, args[0]);
  });
  function object(shape, params) {
      const def = {
          type: "object",
          get shape() {
              assignProp(this, "shape", shape ? objectClone(shape) : {});
              return this.shape;
          },
          ...normalizeParams(params),
      };
      return new ZodObject(def);
  }
  const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
      $ZodUnion.init(inst, def);
      ZodType.init(inst, def);
      inst.options = def.options;
  });
  function union(options, params) {
      return new ZodUnion({
          type: "union",
          options: options,
          ...normalizeParams(params),
      });
  }
  const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
      $ZodIntersection.init(inst, def);
      ZodType.init(inst, def);
  });
  function intersection(left, right) {
      return new ZodIntersection({
          type: "intersection",
          left: left,
          right: right,
      });
  }
  const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
      $ZodEnum.init(inst, def);
      ZodType.init(inst, def);
      inst.enum = def.entries;
      inst.options = Object.values(def.entries);
      const keys = new Set(Object.keys(def.entries));
      inst.extract = (values, params) => {
          const newEntries = {};
          for (const value of values) {
              if (keys.has(value)) {
                  newEntries[value] = def.entries[value];
              }
              else
                  throw new Error(`Key ${value} not found in enum`);
          }
          return new ZodEnum({
              ...def,
              checks: [],
              ...normalizeParams(params),
              entries: newEntries,
          });
      };
      inst.exclude = (values, params) => {
          const newEntries = { ...def.entries };
          for (const value of values) {
              if (keys.has(value)) {
                  delete newEntries[value];
              }
              else
                  throw new Error(`Key ${value} not found in enum`);
          }
          return new ZodEnum({
              ...def,
              checks: [],
              ...normalizeParams(params),
              entries: newEntries,
          });
      };
  });
  function _enum(values, params) {
      const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
      return new ZodEnum({
          type: "enum",
          entries,
          ...normalizeParams(params),
      });
  }
  const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
      $ZodTransform.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.parse = (payload, _ctx) => {
          payload.addIssue = (issue$1) => {
              if (typeof issue$1 === "string") {
                  payload.issues.push(issue(issue$1, payload.value, def));
              }
              else {
                  // for Zod 3 backwards compatibility
                  const _issue = issue$1;
                  if (_issue.fatal)
                      _issue.continue = false;
                  _issue.code ?? (_issue.code = "custom");
                  _issue.input ?? (_issue.input = payload.value);
                  _issue.inst ?? (_issue.inst = inst);
                  // _issue.continue ??= true;
                  payload.issues.push(issue(_issue));
              }
          };
          const output = def.transform(payload.value, payload);
          if (output instanceof Promise) {
              return output.then((output) => {
                  payload.value = output;
                  return payload;
              });
          }
          payload.value = output;
          return payload;
      };
  });
  function transform(fn) {
      return new ZodTransform({
          type: "transform",
          transform: fn,
      });
  }
  const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
      $ZodOptional.init(inst, def);
      ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
  });
  function optional(innerType) {
      return new ZodOptional({
          type: "optional",
          innerType: innerType,
      });
  }
  const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
      $ZodNullable.init(inst, def);
      ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
  });
  function nullable(innerType) {
      return new ZodNullable({
          type: "nullable",
          innerType: innerType,
      });
  }
  const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
      $ZodDefault.init(inst, def);
      ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
      inst.removeDefault = inst.unwrap;
  });
  function _default(innerType, defaultValue) {
      return new ZodDefault({
          type: "default",
          innerType: innerType,
          get defaultValue() {
              return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
          },
      });
  }
  const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
      $ZodPrefault.init(inst, def);
      ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
  });
  function prefault(innerType, defaultValue) {
      return new ZodPrefault({
          type: "prefault",
          innerType: innerType,
          get defaultValue() {
              return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
          },
      });
  }
  const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
      $ZodNonOptional.init(inst, def);
      ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
  });
  function nonoptional(innerType, params) {
      return new ZodNonOptional({
          type: "nonoptional",
          innerType: innerType,
          ...normalizeParams(params),
      });
  }
  const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
      $ZodCatch.init(inst, def);
      ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
      inst.removeCatch = inst.unwrap;
  });
  function _catch(innerType, catchValue) {
      return new ZodCatch({
          type: "catch",
          innerType: innerType,
          catchValue: (typeof catchValue === "function" ? catchValue : () => catchValue),
      });
  }
  const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
      $ZodPipe.init(inst, def);
      ZodType.init(inst, def);
      inst.in = def.in;
      inst.out = def.out;
  });
  function pipe(in_, out) {
      return new ZodPipe({
          type: "pipe",
          in: in_,
          out: out,
          // ...util.normalizeParams(params),
      });
  }
  const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
      $ZodReadonly.init(inst, def);
      ZodType.init(inst, def);
      inst.unwrap = () => inst._zod.def.innerType;
  });
  function readonly(innerType) {
      return new ZodReadonly({
          type: "readonly",
          innerType: innerType,
      });
  }
  const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
      $ZodCustom.init(inst, def);
      ZodType.init(inst, def);
  });
  function refine(fn, _params = {}) {
      return _refine(ZodCustom, fn, _params);
  }
  // superRefine
  function superRefine(fn) {
      return _superRefine(fn);
  }

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
        const childrenRef = getElementRef(children);
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

  const Input = React__namespace.forwardRef((_a, ref) => {
      var { className, type } = _a, props = __rest(_a, ["className", "type"]);
      return (jsxRuntime.jsx("input", Object.assign({ type: type, className: cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className), ref: ref }, props)));
  });
  Input.displayName = "Input";

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
  var Root = Label$1;

  const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
  const Label = React__namespace.forwardRef((_a, ref) => {
      var { className } = _a, props = __rest(_a, ["className"]);
      return (jsxRuntime.jsx(Root, Object.assign({ ref: ref, className: cn(labelVariants(), className) }, props)));
  });
  Label.displayName = Root.displayName;

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
                  : "bg-muted text-muted-foreground"), children: [isTyping ? (jsxRuntime.jsxs("div", { className: "flex space-x-1", children: [jsxRuntime.jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" }), jsxRuntime.jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" }), jsxRuntime.jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-current" })] })) : (jsxRuntime.jsx("p", { className: "whitespace-pre-wrap", children: content.replace("[SUBMIT_BUTTON]", "").trim() })), timestamp && (jsxRuntime.jsx("p", { className: "mt-1 text-xs opacity-70", children: timestamp.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                      }) }))] }) }));
  }
  function MessageList({ children }) {
      return (jsxRuntime.jsx("div", { className: "flex flex-col space-y-4 overflow-y-auto p-4", children: children }));
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


  const Icon = React$2.forwardRef(
    ({
      color = "currentColor",
      size = 24,
      strokeWidth = 2,
      absoluteStrokeWidth,
      className = "",
      children,
      iconNode,
      ...rest
    }, ref) => React$2.createElement(
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
        ...iconNode.map(([tag, attrs]) => React$2.createElement(tag, attrs)),
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
    const Component = React$2.forwardRef(
      ({ className, ...props }, ref) => React$2.createElement(Icon, {
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


  const __iconNode$3 = [
    ["path", { d: "M12 8V4H8", key: "hb8ula" }],
    ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
    ["path", { d: "M2 14h2", key: "vft8re" }],
    ["path", { d: "M20 14h2", key: "4cs60a" }],
    ["path", { d: "M15 13v2", key: "1xurst" }],
    ["path", { d: "M9 13v2", key: "rq6x2g" }]
  ];
  const Bot = createLucideIcon("bot", __iconNode$3);

  /**
   * @license lucide-react v0.539.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */


  const __iconNode$2 = [
    ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
    ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
  ];
  const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$2);

  /**
   * @license lucide-react v0.539.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */


  const __iconNode$1 = [
    [
      "path",
      {
        d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
        key: "1ffxy3"
      }
    ],
    ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
  ];
  const Send = createLucideIcon("send", __iconNode$1);

  /**
   * @license lucide-react v0.539.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */


  const __iconNode = [
    ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
    ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
  ];
  const User = createLucideIcon("user", __iconNode);

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
      return (jsxRuntime.jsxs("form", { onSubmit: handleSubmit, className: "flex items-center space-x-2 p-4 border-t", children: [jsxRuntime.jsx(Input, { ref: inputRef, value: message, autoFocus: true, onChange: (e) => setMessage(e.target.value), onKeyPress: handleKeyPress, placeholder: placeholder || "Type your message...", disabled: disabled, className: "flex-1" }), jsxRuntime.jsx(Button, { type: "submit", size: "icon", disabled: !message.trim() || disabled, className: "shrink-0", children: jsxRuntime.jsx(Send, { className: "h-4 w-4" }) })] }));
  }

  // Data extraction utilities for parsing AI responses
  const extractAllData = (text) => {
      const extracted = {};
      // Extract from the specific AI template format
      const nameMatch = text.match(/Thank you (\[name\]|[a-zA-Z\s]+)\./i);
      const loanTypeMatch = text.match(/applying for a (\[loan type\]|[a-zA-Z\s]+) in the amount/);
      const amountMatch = text.match(/amount of (\[loan amount\]|\$?[0-9,]+)/i);
      const phoneMatch = text.match(/phone number as (\[phone number\]|[0-9\s\-\(\)\+]+)/i);
      const emailMatch = text.match(/email as (\[email\]|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
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
  // Update parseAIResponse to detect this specific template
  const parseAIResponse = (aiResponse, currentStep) => {
      // Check if this is the final confirmation template
      const isFinalConfirmation = aiResponse.includes("Thank you") &&
          aiResponse.includes("applying for a") &&
          aiResponse.includes("amount of") &&
          aiResponse.includes("phone number as") &&
          aiResponse.includes("email as");
      if (isFinalConfirmation) {
          console.log("Detected final confirmation template, extracting all data");
          return extractAllData(aiResponse);
      }
      // For all other messages, return empty object
      return {};
  };
  const determineNextStep = (currentStep, formData) => {
      switch (currentStep) {
          case "loan_amount":
              return formData.loanAmount ? "loan_type" : "loan_amount";
          case "loan_type":
              return formData.loanType ? "personal_details" : "loan_type";
          case "personal_details":
              return formData.name && formData.email && formData.phone
                  ? "complete"
                  : "personal_details";
          default:
              return "loan_amount";
      }
  };
  // Hybrid approach: Check AI response AND form completion state
  const shouldShowSubmitButton = (aiResponse, formData, currentStep) => {
      // Primary check: AI explicitly says to show button
      const submitPattern = [
          /submit\w* your application by clicking the button below/i,
          /submit\w* your application/i,
          /click\w* the button below/i,
      ];
      const aiSaysShowButton = submitPattern.some((pattern) => pattern.test(aiResponse));
      // Secondary check: Form is complete and we're in final step
      const isComplete = Boolean(formData.name &&
          formData.email &&
          formData.phone &&
          formData.loanAmount &&
          formData.loanType);
      const isFinalStep = currentStep === "complete";
      // Show button if AI says so OR if form is complete and in final step
      return aiSaysShowButton || (isComplete && isFinalStep);
  };

  // Updated Zod schema to include chat history
  const conversationalFormSchema = object({
      loanAmount: number()
          .min(1000, "Loan amount must be at least $1,000")
          .max(40000, "Loan amount must be no more than $40,000"),
      loanType: string().min(1, "Loan type is required"),
      name: string()
          .min(1, "Name is required")
          .min(2, "Name must be at least 2 characters")
          .max(50, "Name must be less than 50 characters"),
      email: string()
          .min(1, "Email is required")
          .email("Please enter a valid email address"),
      phone: string()
          .min(1, "Phone number is required")
          .regex(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/, "Please enter a valid phone number"),
      chatHistory: string().optional(), // Hidden field for chat history
  });
  function ConversationalForm({ apiEndpoint = "/api/chat", onFormSubmit, onFormError, } = {}) {
      var _a;
      const [conversationState, setConversationState] = React$2.useState({
          currentStep: "loan_amount",
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
      const [isSubmitting, setIsSubmitting] = React$2.useState(false);
      const [isSubmitted, setIsSubmitted] = React$2.useState(false);
      const messagesEndRef = React$2.useRef(null);
      const form = useForm({
          defaultValues: {
              loanAmount: "", // Change from undefined to empty string
              loanType: "",
              name: "",
              email: "",
              phone: "",
              chatHistory: "",
          },
          onSubmit: async ({ value }) => {
              setIsSubmitting(true);
              try {
                  // Format chat history before submission
                  const formattedChatHistory = conversationState.messages
                      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
                      .join("\n\n");
                  const submissionData = Object.assign(Object.assign({}, value), { chatHistory: formattedChatHistory });
                  const validatedData = conversationalFormSchema.parse(submissionData);
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  console.log("Form submitted:", validatedData);
                  if (onFormSubmit) {
                      onFormSubmit(validatedData);
                  }
                  setIsSubmitted(true);
              }
              catch (error) {
                  console.error("Error submitting form:", error);
                  if (onFormError) {
                      onFormError(error);
                  }
              }
              finally {
                  setIsSubmitting(false);
              }
          },
      });
      // Auto-scroll to bottom when new messages arrive
      React$2.useEffect(() => {
          var _a;
          (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
      }, [conversationState.messages]);
      // Update the useEffect to also handle chatHistory updates
      React$2.useEffect(() => {
          console.log("useEffect triggered with formData:", conversationState.formData);
          // Create a complete form data object including chat history
          const completeFormData = Object.assign(Object.assign({}, conversationState.formData), { chatHistory: conversationState.messages
                  .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
                  .join("\n\n") });
          Object.entries(completeFormData).forEach(([field, value]) => {
              console.log(`Processing field: ${field}, value: ${value}`);
              if (value !== undefined && value !== null && value !== "") {
                  console.log(`Setting field: ${field} to value: ${value}`);
                  try {
                      // Convert loanAmount to string for the form
                      const formValue = field === "loanAmount" && typeof value === "number"
                          ? value.toString()
                          : value;
                      form.setFieldValue(field, String(formValue));
                      console.log(`Successfully set ${field} to ${formValue}`);
                  }
                  catch (error) {
                      console.error(`Error setting field ${field}:`, error);
                  }
              }
              else {
                  console.log(`Skipping field ${field} - value is falsy: ${value}`);
              }
          });
      }, [conversationState.formData, conversationState.messages]); // Add messages to dependency
      const handleSendMessage = async (userMessage) => {
          const userMsg = {
              id: Date.now().toString(),
              role: "user",
              content: userMessage,
              timestamp: new Date(),
          };
          setConversationState((prev) => (Object.assign(Object.assign({}, prev), { messages: [...prev.messages, userMsg], isTyping: true })));
          try {
              const response = await fetch(apiEndpoint, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                      messages: [...conversationState.messages, userMsg],
                      currentStep: conversationState.currentStep,
                      formData: conversationState.formData,
                  }),
              });
              const data = await response.json();
              if (data.error) {
                  throw new Error(data.error);
              }
              // Extract data from AI response (only on final confirmation)
              const extractedData = parseAIResponse(data.response, conversationState.currentStep);
              const updatedFormData = Object.assign(Object.assign({}, conversationState.formData), extractedData);
              const nextStep = determineNextStep(conversationState.currentStep, updatedFormData);
              const assistantMsg = {
                  id: (Date.now() + 1).toString(),
                  role: "assistant",
                  content: data.response,
                  timestamp: new Date(),
              };
              setConversationState((prev) => (Object.assign(Object.assign({}, prev), { messages: [...prev.messages, assistantMsg], formData: updatedFormData, currentStep: nextStep, isTyping: false })));
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
      // Add function to handle chat submission
      const handleChatSubmission = async () => {
          if (isFormComplete) {
              await form.handleSubmit();
          }
      };
      const getStepProgress = () => {
          const steps = ["loan_amount", "loan_type", "personal_details"];
          const currentIndex = steps.indexOf(conversationState.currentStep);
          return Math.max(0, currentIndex);
      };
      const isFormComplete = conversationState.formData.name &&
          conversationState.formData.email &&
          conversationState.formData.phone &&
          conversationState.formData.loanAmount &&
          conversationState.formData.loanType;
      if (isSubmitted) {
          return (jsxRuntime.jsx(Card, { className: "w-full max-w-4xl mx-auto", children: jsxRuntime.jsxs(CardHeader, { children: [jsxRuntime.jsxs(CardTitle, { className: "text-green-600 flex items-center gap-2", children: [jsxRuntime.jsx(CircleCheckBig, { className: "h-6 w-6" }), "Thank You!"] }), jsxRuntime.jsx(CardDescription, { children: "Your loan application has been submitted successfully. We'll be in touch soon!" })] }) }));
      }
      return (jsxRuntime.jsxs("div", { className: "w-full max-w-4xl mx-auto space-y-6", children: [jsxRuntime.jsxs(Card, { children: [jsxRuntime.jsxs(CardHeader, { children: [jsxRuntime.jsx(CardTitle, { className: "text-lg", children: "Loan Application Progress" }), jsxRuntime.jsxs(CardDescription, { children: ["Step ", getStepProgress() + 1, " of 3:", " ", conversationState.currentStep === "loan_amount"
                                          ? "Loan Amount"
                                          : conversationState.currentStep === "loan_type"
                                              ? "Loan Type"
                                              : conversationState.currentStep === "personal_details"
                                                  ? "Personal Details"
                                                  : "Complete"] })] }), jsxRuntime.jsx(CardContent, { children: jsxRuntime.jsx("div", { className: "flex space-x-2", children: ["loan_amount", "loan_type", "personal_details"].map((step, index) => {
                                  const isCompleted = conversationState.formData[step === "loan_amount"
                                      ? "loanAmount"
                                      : step === "loan_type"
                                          ? "loanType"
                                          : "name"];
                                  const isCurrent = conversationState.currentStep === step;
                                  return (jsxRuntime.jsx("div", { className: `flex-1 h-2 rounded-full ${isCompleted
                                        ? "bg-green-500"
                                        : isCurrent
                                            ? "bg-blue-500"
                                            : "bg-gray-200"}` }, step));
                              }) }) })] }), jsxRuntime.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [jsxRuntime.jsxs(Card, { className: "h-[600px] flex flex-col", children: [jsxRuntime.jsxs(CardHeader, { children: [jsxRuntime.jsxs(CardTitle, { className: "flex items-center gap-2", children: [jsxRuntime.jsx(Bot, { className: "h-5 w-5" }), "Loan Assistant"] }), jsxRuntime.jsx(CardDescription, { children: "Chat with our AI assistant to complete your application" })] }), jsxRuntime.jsxs(CardContent, { className: "flex-1 flex flex-col p-0 overflow-y-auto", children: [jsxRuntime.jsx("div", { className: "flex-1 overflow-y-auto", children: jsxRuntime.jsxs(MessageList, { children: [conversationState.messages.map((message) => (jsxRuntime.jsx(Message, { role: message.role, content: message.content, timestamp: message.timestamp }, message.id))), conversationState.isTyping && (jsxRuntime.jsx(Message, { role: "assistant", content: "", isTyping: true })), jsxRuntime.jsx("div", { ref: messagesEndRef })] }) }), shouldShowSubmitButton(((_a = conversationState.messages[conversationState.messages.length - 1]) === null || _a === void 0 ? void 0 : _a.content) || "", conversationState.formData, conversationState.currentStep) ? (jsxRuntime.jsx("div", { className: "p-4 border-t", children: jsxRuntime.jsx(Button, { onClick: handleChatSubmission, disabled: isSubmitting, className: "w-full h-12 text-lg font-semibold", children: isSubmitting ? (jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [jsxRuntime.jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" }), "Submitting Application..."] })) : ("Submit Application") }) })) : (jsxRuntime.jsx(ChatInput, { onSendMessage: handleSendMessage, disabled: Boolean(conversationState.isTyping || isFormComplete), placeholder: conversationState.currentStep === "loan_amount"
                                              ? "Enter loan amount..."
                                              : conversationState.currentStep === "loan_type"
                                                  ? "Choose loan type..."
                                                  : "Provide your details..." }))] })] }), jsxRuntime.jsxs(Card, { className: "h-[600px] flex flex-col", children: [jsxRuntime.jsxs(CardHeader, { children: [jsxRuntime.jsxs(CardTitle, { className: "flex items-center gap-2", children: [jsxRuntime.jsx(User, { className: "h-5 w-5" }), "Application Summary"] }), jsxRuntime.jsx(CardDescription, { children: "Your information will be filled as we chat" })] }), jsxRuntime.jsxs(CardContent, { className: "flex-1 flex flex-col", children: [jsxRuntime.jsxs("div", { className: "flex-1 space-y-4", children: [jsxRuntime.jsxs("div", { className: "space-y-2", children: [jsxRuntime.jsx(Label, { children: "Loan Amount" }), jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [jsxRuntime.jsx(Input, { value: conversationState.formData.loanAmount
                                                                      ? `$${conversationState.formData.loanAmount.toLocaleString()}`
                                                                      : "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.loanAmount && (jsxRuntime.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-500" }))] })] }), jsxRuntime.jsxs("div", { className: "space-y-2", children: [jsxRuntime.jsx(Label, { children: "Loan Type" }), jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [jsxRuntime.jsx(Input, { value: conversationState.formData.loanType || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.loanType && (jsxRuntime.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-500" }))] })] }), jsxRuntime.jsxs("div", { className: "space-y-2", children: [jsxRuntime.jsx(Label, { children: "Full Name" }), jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [jsxRuntime.jsx(Input, { value: conversationState.formData.name || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.name && (jsxRuntime.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-500" }))] })] }), jsxRuntime.jsxs("div", { className: "space-y-2", children: [jsxRuntime.jsx(Label, { children: "Email Address" }), jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [jsxRuntime.jsx(Input, { value: conversationState.formData.email || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.email && (jsxRuntime.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-500" }))] })] }), jsxRuntime.jsxs("div", { className: "space-y-2", children: [jsxRuntime.jsx(Label, { children: "Phone Number" }), jsxRuntime.jsxs("div", { className: "flex items-center gap-2", children: [jsxRuntime.jsx(Input, { value: conversationState.formData.phone || "", placeholder: "Will be filled from conversation", disabled: true, className: "bg-gray-50" }), conversationState.formData.phone && (jsxRuntime.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-500" }))] })] })] }), jsxRuntime.jsx("div", { className: "pt-4 border-t", children: jsxRuntime.jsx(Button, { onClick: () => form.handleSubmit(), className: "w-full", disabled: !isFormComplete || isSubmitting, children: isSubmitting ? "Submitting..." : "Submit Application" }) })] })] })] })] }));
  }

  function ConversationalFormWidget({ containerId = "conversational-form-widget", apiEndpoint = "/api/chat", theme = "light", onFormSubmit, onFormError, }) {
      const [isLoaded, setIsLoaded] = React$2.useState(false);
      React$2.useEffect(() => {
          // Inject Tailwind CSS if not already present
          if (!document.querySelector("#tailwind-css")) {
              const link = document.createElement("link");
              link.id = "tailwind-css";
              link.rel = "stylesheet";
              link.href =
                  "https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css";
              document.head.appendChild(link);
          }
          setIsLoaded(true);
      }, []);
      if (!isLoaded) {
          return jsxRuntime.jsx("div", { children: "Loading..." });
      }
      return (jsxRuntime.jsx("div", { className: `conversational-form-widget ${theme}`, children: jsxRuntime.jsx(ConversationalForm, { apiEndpoint: apiEndpoint, onFormSubmit: onFormSubmit, onFormError: onFormError }) }));
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
