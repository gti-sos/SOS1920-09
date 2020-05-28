
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value' || descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function select_multiple_value(select) {
        return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                info.blocks[i] = null;
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.20.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.20.1 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (209:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[10]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(209:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (207:0) {#if componentParams}
    function create_if_block(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: { params: /*componentParams*/ ctx[1] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*componentParams*/ 2) switch_instance_changes.params = /*componentParams*/ ctx[1];

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[9]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(207:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(route, userData, ...conditions) {
    	// Check if we don't have userData
    	if (userData && typeof userData == "function") {
    		conditions = conditions && conditions.length ? conditions : [];
    		conditions.unshift(userData);
    		userData = undefined;
    	}

    	// Parameter route and each item of conditions must be functions
    	if (!route || typeof route != "function") {
    		throw Error("Invalid parameter route");
    	}

    	if (conditions && conditions.length) {
    		for (let i = 0; i < conditions.length; i++) {
    			if (!conditions[i] || typeof conditions[i] != "function") {
    				throw Error("Invalid parameter conditions[" + i + "]");
    			}
    		}
    	}

    	// Returns an object that contains all the functions to execute too
    	const obj = { route, userData };

    	if (conditions && conditions.length) {
    		obj.conditions = conditions;
    	}

    	// The _sveltesparouter flag is to confirm the object was created by this router
    	Object.defineProperty(obj, "_sveltesparouter", { value: true });

    	return obj;
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	// Check if there's a querystring
    	const qsPosition = location.indexOf("?");

    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(getLocation(), // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return nextTickPromise(() => {
    		window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    	});
    }

    function pop() {
    	// Execute this code when the current call stack is complete
    	return nextTickPromise(() => {
    		window.history.back();
    	});
    }

    function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return nextTickPromise(() => {
    		const dest = (location.charAt(0) == "#" ? "" : "#") + location;

    		try {
    			window.history.replaceState(undefined, undefined, dest);
    		} catch(e) {
    			// eslint-disable-next-line no-console
    			console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.");
    		}

    		// The method above doesn't trigger the hashchange event, so let's do that manually
    		window.dispatchEvent(new Event("hashchange"));
    	});
    }

    function link(node) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	// Destination must start with '/'
    	const href = node.getAttribute("href");

    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute");
    	}

    	// Add # to every href attribute
    	node.setAttribute("href", "#" + href);
    }

    function nextTickPromise(cb) {
    	return new Promise(resolve => {
    			setTimeout(
    				() => {
    					resolve(cb());
    				},
    				0
    			);
    		});
    }

    function instance($$self, $$props, $$invalidate) {
    	let $loc,
    		$$unsubscribe_loc = noop;

    	validate_store(loc, "loc");
    	component_subscribe($$self, loc, $$value => $$invalidate(4, $loc = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_loc());
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent} component - Svelte component for the route
     */
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.route;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    			} else {
    				this.component = component;
    				this.conditions = [];
    				this.userData = undefined;
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, remove it before we run the matching
    			if (prefix && path.startsWith(prefix)) {
    				path = path.substr(prefix.length) || "/";
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				out[this._keys[i]] = matches[++i] || null;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {SvelteComponent} component - Svelte component
     * @property {string} name - Name of the Svelte component
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {Object} [userData] - Custom data passed by the user
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	const dispatchNextTick = (name, detail) => {
    		// Execute this code when the current call stack is complete
    		setTimeout(
    			() => {
    				dispatch(name, detail);
    			},
    			0
    		);
    	};

    	const writable_props = ["routes", "prefix"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Router", $$slots, []);

    	function routeEvent_handler(event) {
    		bubble($$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		derived,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		nextTickPromise,
    		createEventDispatcher,
    		regexparam,
    		routes,
    		prefix,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		dispatch,
    		dispatchNextTick,
    		$loc
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*component, $loc*/ 17) {
    			// Handle hash change events
    			// Listen to changes in the $loc store and update the page
    			 {
    				// Find a route matching the location
    				$$invalidate(0, component = null);

    				let i = 0;

    				while (!component && i < routesList.length) {
    					const match = routesList[i].match($loc.location);

    					if (match) {
    						const detail = {
    							component: routesList[i].component,
    							name: routesList[i].component.name,
    							location: $loc.location,
    							querystring: $loc.querystring,
    							userData: routesList[i].userData
    						};

    						// Check if the route can be loaded - if all conditions succeed
    						if (!routesList[i].checkConditions(detail)) {
    							// Trigger an event to notify the user
    							dispatchNextTick("conditionsFailed", detail);

    							break;
    						}

    						$$invalidate(0, component = routesList[i].component);

    						// Set componentParams onloy if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    						// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    						if (match && typeof match == "object" && Object.keys(match).length) {
    							$$invalidate(1, componentParams = match);
    						} else {
    							$$invalidate(1, componentParams = null);
    						}

    						dispatchNextTick("routeLoaded", detail);
    					}

    					i++;
    				}
    			}
    		}
    	};

    	return [
    		component,
    		componentParams,
    		routes,
    		prefix,
    		$loc,
    		RouteItem,
    		routesList,
    		dispatch,
    		dispatchNextTick,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { routes: 2, prefix: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\Home.svelte generated by Svelte v3.20.1 */

    const file = "src\\front\\Home.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let div0;
    	let button0;
    	let i0;
    	let t0;
    	let t1;
    	let button1;
    	let i1;
    	let t2;
    	let t3;
    	let button2;
    	let i2;
    	let t4;
    	let t5;
    	let div1;
    	let button3;
    	let i3;
    	let t6;
    	let t7;
    	let button4;
    	let i4;
    	let t8;
    	let t9;
    	let button5;
    	let i5;
    	let t10;
    	let t11;
    	let button6;
    	let i6;
    	let t12;
    	let t13;
    	let button7;
    	let i7;
    	let t14;
    	let t15;
    	let div2;
    	let button8;
    	let i8;
    	let t16;
    	let t17;
    	let div3;
    	let button9;
    	let i9;
    	let t18;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			button0 = element("button");
    			i0 = element("i");
    			t0 = text(" API de energías renovables");
    			t1 = space();
    			button1 = element("button");
    			i1 = element("i");
    			t2 = text(" API de coches eléctricos");
    			t3 = space();
    			button2 = element("button");
    			i2 = element("i");
    			t4 = text(" API de energías primarias");
    			t5 = space();
    			div1 = element("div");
    			button3 = element("button");
    			i3 = element("i");
    			t6 = text(" Gráfica de energías renovables");
    			t7 = space();
    			button4 = element("button");
    			i4 = element("i");
    			t8 = text(" Gráfica de energías renovables");
    			t9 = space();
    			button5 = element("button");
    			i5 = element("i");
    			t10 = text(" Gráfica de coches eléctricos");
    			t11 = space();
    			button6 = element("button");
    			i6 = element("i");
    			t12 = text(" Gráfica de energías primarias");
    			t13 = space();
    			button7 = element("button");
    			i7 = element("i");
    			t14 = text(" Gráfica de energías primarias 2");
    			t15 = space();
    			div2 = element("div");
    			button8 = element("button");
    			i8 = element("i");
    			t16 = text(" Gráfica común de datos");
    			t17 = space();
    			div3 = element("div");
    			button9 = element("button");
    			i9 = element("i");
    			t18 = text(" Gráfica de coches eléctricos");
    			attr_dev(i0, "class", "fas fa-leaf");
    			add_location(i0, file, 2, 113, 146);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-outline-success");
    			attr_dev(button0, "onclick", "window.location.href='#/renewableSourcesAPI'");
    			add_location(button0, file, 2, 2, 35);
    			attr_dev(i1, "class", "fas fa-car-battery");
    			add_location(i1, file, 3, 109, 321);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-outline-primary");
    			attr_dev(button1, "onclick", "window.location.href='#/plugInVehiclesAPI'");
    			add_location(button1, file, 3, 2, 214);
    			attr_dev(i2, "class", "fas fa-radiation");
    			add_location(i2, file, 4, 124, 516);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "btn btn-outline-dark");
    			attr_dev(button2, "onclick", "window.location.href='#/oilCoalNuclearEnergyConsumptionAPI'");
    			add_location(button2, file, 4, 2, 394);
    			attr_dev(div0, "class", "div-home");
    			add_location(div0, file, 1, 1, 9);
    			attr_dev(i3, "class", "fas fa-chart-area");
    			add_location(i3, file, 8, 115, 737);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "btn btn-outline-success");
    			attr_dev(button3, "onclick", "window.location.href='#/chartRenewableSources'");
    			add_location(button3, file, 8, 2, 624);
    			attr_dev(i4, "class", "fas fa-chart-area");
    			add_location(i4, file, 9, 124, 936);
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "class", "btn btn-outline-success");
    			attr_dev(button4, "onclick", "window.location.href='#/chartRenewableSourcesBillboard'");
    			add_location(button4, file, 9, 2, 814);
    			attr_dev(i5, "class", "fas fa-chart-area");
    			add_location(i5, file, 10, 111, 1122);
    			attr_dev(button5, "type", "button");
    			attr_dev(button5, "class", "btn btn-outline-primary");
    			attr_dev(button5, "onclick", "window.location.href='#/chartPlugInVehicles'");
    			add_location(button5, file, 10, 2, 1013);
    			attr_dev(i6, "class", "fas fa-chart-area");
    			add_location(i6, file, 11, 102, 1297);
    			attr_dev(button6, "type", "button");
    			attr_dev(button6, "class", "btn btn-outline-dark");
    			attr_dev(button6, "onclick", "window.location.href='#/chartOilCoal'");
    			add_location(button6, file, 11, 2, 1197);
    			attr_dev(i7, "class", "fas fa-chart-area");
    			add_location(i7, file, 12, 103, 1474);
    			attr_dev(button7, "type", "button");
    			attr_dev(button7, "class", "btn btn-outline-dark");
    			attr_dev(button7, "onclick", "window.location.href='#/chartOilCoal2'");
    			add_location(button7, file, 12, 2, 1373);
    			attr_dev(div1, "class", "div-home");
    			add_location(div1, file, 7, 1, 598);
    			attr_dev(i8, "class", "fas fa-chart-area");
    			add_location(i8, file, 17, 100, 1688);
    			attr_dev(button8, "type", "button");
    			attr_dev(button8, "class", "btn btn-outline-dark");
    			attr_dev(button8, "onclick", "window.location.href='#/analytics'");
    			add_location(button8, file, 17, 2, 1590);
    			attr_dev(div2, "class", "div-home");
    			add_location(div2, file, 16, 1, 1564);
    			attr_dev(i9, "class", "fas fa-chart-area");
    			add_location(i9, file, 21, 114, 1907);
    			attr_dev(button9, "type", "button");
    			attr_dev(button9, "class", "btn btn-outline-primary");
    			attr_dev(button9, "onclick", "window.location.href='#/chartOutPlugInVehicles'");
    			add_location(button9, file, 21, 2, 1795);
    			attr_dev(div3, "class", "div-home");
    			add_location(div3, file, 19, 1, 1765);
    			add_location(main, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, button0);
    			append_dev(button0, i0);
    			append_dev(button0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(button1, i1);
    			append_dev(button1, t2);
    			append_dev(div0, t3);
    			append_dev(div0, button2);
    			append_dev(button2, i2);
    			append_dev(button2, t4);
    			append_dev(main, t5);
    			append_dev(main, div1);
    			append_dev(div1, button3);
    			append_dev(button3, i3);
    			append_dev(button3, t6);
    			append_dev(div1, t7);
    			append_dev(div1, button4);
    			append_dev(button4, i4);
    			append_dev(button4, t8);
    			append_dev(div1, t9);
    			append_dev(div1, button5);
    			append_dev(button5, i5);
    			append_dev(button5, t10);
    			append_dev(div1, t11);
    			append_dev(div1, button6);
    			append_dev(button6, i6);
    			append_dev(button6, t12);
    			append_dev(div1, t13);
    			append_dev(div1, button7);
    			append_dev(button7, i7);
    			append_dev(button7, t14);
    			append_dev(main, t15);
    			append_dev(main, div2);
    			append_dev(div2, button8);
    			append_dev(button8, i8);
    			append_dev(button8, t16);
    			append_dev(main, t17);
    			append_dev(main, div3);
    			append_dev(div3, button9);
    			append_dev(button9, i9);
    			append_dev(button9, t18);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Home", $$slots, []);
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    function toVal(mix) {
    	var k, y, str='';
    	if (mix) {
    		if (typeof mix === 'object') {
    			if (Array.isArray(mix)) {
    				for (k=0; k < mix.length; k++) {
    					if (mix[k] && (y = toVal(mix[k]))) {
    						str && (str += ' ');
    						str += y;
    					}
    				}
    			} else {
    				for (k in mix) {
    					if (mix[k] && (y = toVal(k))) {
    						str && (str += ' ');
    						str += y;
    					}
    				}
    			}
    		} else if (typeof mix !== 'boolean' && !mix.call) {
    			str && (str += ' ');
    			str += mix;
    		}
    	}
    	return str;
    }

    function clsx () {
    	var i=0, x, str='';
    	while (i < arguments.length) {
    		if (x = toVal(arguments[i++])) {
    			str && (str += ' ');
    			str += x;
    		}
    	}
    	return str;
    }

    function isObject(value) {
      const type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    function getColumnSizeClass(isXs, colWidth, colSize) {
      if (colSize === true || colSize === '') {
        return isXs ? 'col' : `col-${colWidth}`;
      } else if (colSize === 'auto') {
        return isXs ? 'col-auto' : `col-${colWidth}-auto`;
      }

      return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
    }

    function clean($$props) {
      const rest = {};
      for (const key of Object.keys($$props)) {
        if (key !== "children" && key !== "$$scope" && key !== "$$slots") {
          rest[key] = $$props[key];
        }
      }
      return rest;
    }

    /* node_modules\sveltestrap\src\Table.svelte generated by Svelte v3.20.1 */
    const file$1 = "node_modules\\sveltestrap\\src\\Table.svelte";

    // (38:0) {:else}
    function create_else_block$1(ctx) {
    	let table;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let table_levels = [/*props*/ ctx[3], { class: /*classes*/ ctx[1] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$1, 38, 2, 908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[12], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null));
    				}
    			}

    			set_attributes(table, get_spread_update(table_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*classes*/ 2 && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(38:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:0) {#if responsive}
    function create_if_block$1(ctx) {
    	let div;
    	let table;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let table_levels = [/*props*/ ctx[3], { class: /*classes*/ ctx[1] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			add_location(table, file$1, 33, 4, 826);
    			attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			add_location(div, file$1, 32, 2, 788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[12], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null));
    				}
    			}

    			set_attributes(table, get_spread_update(table_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*classes*/ 2 && { class: /*classes*/ ctx[1] }
    			]));

    			if (!current || dirty & /*responsiveClassName*/ 4) {
    				attr_dev(div, "class", /*responsiveClassName*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(32:0) {#if responsive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*responsive*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { size = "" } = $$props;
    	let { bordered = false } = $$props;
    	let { borderless = false } = $$props;
    	let { striped = false } = $$props;
    	let { dark = false } = $$props;
    	let { hover = false } = $$props;
    	let { responsive = false } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Table", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("size" in $$new_props) $$invalidate(5, size = $$new_props.size);
    		if ("bordered" in $$new_props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ("borderless" in $$new_props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ("striped" in $$new_props) $$invalidate(8, striped = $$new_props.striped);
    		if ("dark" in $$new_props) $$invalidate(9, dark = $$new_props.dark);
    		if ("hover" in $$new_props) $$invalidate(10, hover = $$new_props.hover);
    		if ("responsive" in $$new_props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ("$$scope" in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		responsive,
    		props,
    		classes,
    		responsiveClassName
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(11, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("size" in $$props) $$invalidate(5, size = $$new_props.size);
    		if ("bordered" in $$props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ("borderless" in $$props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ("striped" in $$props) $$invalidate(8, striped = $$new_props.striped);
    		if ("dark" in $$props) $$invalidate(9, dark = $$new_props.dark);
    		if ("hover" in $$props) $$invalidate(10, hover = $$new_props.hover);
    		if ("responsive" in $$props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("responsiveClassName" in $$props) $$invalidate(2, responsiveClassName = $$new_props.responsiveClassName);
    	};

    	let classes;
    	let responsiveClassName;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, size, bordered, borderless, striped, dark, hover*/ 2032) {
    			 $$invalidate(1, classes = clsx(className, "table", size ? "table-" + size : false, bordered ? "table-bordered" : false, borderless ? "table-borderless" : false, striped ? "table-striped" : false, dark ? "table-dark" : false, hover ? "table-hover" : false));
    		}

    		if ($$self.$$.dirty & /*responsive*/ 1) {
    			 $$invalidate(2, responsiveClassName = responsive === true
    			? "table-responsive"
    			: `table-responsive-${responsive}`);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		responsive,
    		classes,
    		responsiveClassName,
    		props,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		$$props,
    		$$scope,
    		$$slots
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			class: 4,
    			size: 5,
    			bordered: 6,
    			borderless: 7,
    			striped: 8,
    			dark: 9,
    			hover: 10,
    			responsive: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get class() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bordered() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bordered(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderless() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderless(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get striped() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set striped(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get responsive() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Button.svelte generated by Svelte v3.20.1 */
    const file$2 = "node_modules\\sveltestrap\\src\\Button.svelte";

    // (53:0) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	let button_levels = [
    		/*props*/ ctx[10],
    		{ id: /*id*/ ctx[4] },
    		{ class: /*classes*/ ctx[8] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[6] },
    		{
    			"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
    		},
    		{ style: /*style*/ ctx[5] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$2, 53, 2, 1061);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[21], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 262144) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[18], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null));
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*close, children, $$scope*/ 262147) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_attributes(button, get_spread_update(button_levels, [
    				dirty & /*props*/ 1024 && /*props*/ ctx[10],
    				dirty & /*id*/ 16 && { id: /*id*/ ctx[4] },
    				dirty & /*classes*/ 256 && { class: /*classes*/ ctx[8] },
    				dirty & /*disabled*/ 4 && { disabled: /*disabled*/ ctx[2] },
    				dirty & /*value*/ 64 && { value: /*value*/ ctx[6] },
    				dirty & /*ariaLabel, defaultAriaLabel*/ 640 && {
    					"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
    				},
    				dirty & /*style*/ 32 && { style: /*style*/ ctx[5] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(53:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (37:0) {#if href}
    function create_if_block$2(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let dispose;
    	const if_block_creators = [create_if_block_1, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*props*/ ctx[10],
    		{ id: /*id*/ ctx[4] },
    		{ class: /*classes*/ ctx[8] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
    		},
    		{ style: /*style*/ ctx[5] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$2, 37, 2, 825);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(a, "click", /*click_handler*/ ctx[20], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, get_spread_update(a_levels, [
    				dirty & /*props*/ 1024 && /*props*/ ctx[10],
    				dirty & /*id*/ 16 && { id: /*id*/ ctx[4] },
    				dirty & /*classes*/ 256 && { class: /*classes*/ ctx[8] },
    				dirty & /*disabled*/ 4 && { disabled: /*disabled*/ ctx[2] },
    				dirty & /*href*/ 8 && { href: /*href*/ ctx[3] },
    				dirty & /*ariaLabel, defaultAriaLabel*/ 640 && {
    					"aria-label": /*ariaLabel*/ ctx[7] || /*defaultAriaLabel*/ ctx[9]
    				},
    				dirty & /*style*/ 32 && { style: /*style*/ ctx[5] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(37:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (68:6) {:else}
    function create_else_block_2(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 262144) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[18], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(68:6) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (66:25) 
    function create_if_block_3(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(66:25) ",
    		ctx
    	});

    	return block_1;
    }

    // (64:6) {#if close}
    function create_if_block_2(ctx) {
    	let span;

    	const block_1 = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "×";
    			attr_dev(span, "aria-hidden", "true");
    			add_location(span, file$2, 64, 8, 1250);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(64:6) {#if close}",
    		ctx
    	});

    	return block_1;
    }

    // (63:10)        
    function fallback_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_if_block_3, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*close*/ ctx[1]) return 0;
    		if (/*children*/ ctx[0]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(button, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(63:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (49:4) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 262144) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[18], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(49:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (47:4) {#if children}
    function create_if_block_1(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data_dev(t, /*children*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(47:4) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = "secondary" } = $$props;
    	let { disabled = false } = $$props;
    	let { href = "" } = $$props;
    	let { id = "" } = $$props;
    	let { outline = false } = $$props;
    	let { size = "" } = $$props;
    	let { style = "" } = $$props;
    	let { value = "" } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Button", $$slots, ['default']);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(17, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(11, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(12, active = $$new_props.active);
    		if ("block" in $$new_props) $$invalidate(13, block = $$new_props.block);
    		if ("children" in $$new_props) $$invalidate(0, children = $$new_props.children);
    		if ("close" in $$new_props) $$invalidate(1, close = $$new_props.close);
    		if ("color" in $$new_props) $$invalidate(14, color = $$new_props.color);
    		if ("disabled" in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("href" in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ("id" in $$new_props) $$invalidate(4, id = $$new_props.id);
    		if ("outline" in $$new_props) $$invalidate(15, outline = $$new_props.outline);
    		if ("size" in $$new_props) $$invalidate(16, size = $$new_props.size);
    		if ("style" in $$new_props) $$invalidate(5, style = $$new_props.style);
    		if ("value" in $$new_props) $$invalidate(6, value = $$new_props.value);
    		if ("$$scope" in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		active,
    		block,
    		children,
    		close,
    		color,
    		disabled,
    		href,
    		id,
    		outline,
    		size,
    		style,
    		value,
    		props,
    		ariaLabel,
    		classes,
    		defaultAriaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(17, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(11, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(12, active = $$new_props.active);
    		if ("block" in $$props) $$invalidate(13, block = $$new_props.block);
    		if ("children" in $$props) $$invalidate(0, children = $$new_props.children);
    		if ("close" in $$props) $$invalidate(1, close = $$new_props.close);
    		if ("color" in $$props) $$invalidate(14, color = $$new_props.color);
    		if ("disabled" in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("href" in $$props) $$invalidate(3, href = $$new_props.href);
    		if ("id" in $$props) $$invalidate(4, id = $$new_props.id);
    		if ("outline" in $$props) $$invalidate(15, outline = $$new_props.outline);
    		if ("size" in $$props) $$invalidate(16, size = $$new_props.size);
    		if ("style" in $$props) $$invalidate(5, style = $$new_props.style);
    		if ("value" in $$props) $$invalidate(6, value = $$new_props.value);
    		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
    		if ("classes" in $$props) $$invalidate(8, classes = $$new_props.classes);
    		if ("defaultAriaLabel" in $$props) $$invalidate(9, defaultAriaLabel = $$new_props.defaultAriaLabel);
    	};

    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		 $$invalidate(7, ariaLabel = $$props["aria-label"]);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active*/ 129026) {
    			 $$invalidate(8, classes = clsx(className, { close }, close || "btn", close || `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "btn-block" : false, { active }));
    		}

    		if ($$self.$$.dirty & /*close*/ 2) {
    			 $$invalidate(9, defaultAriaLabel = close ? "Close" : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		children,
    		close,
    		disabled,
    		href,
    		id,
    		style,
    		value,
    		ariaLabel,
    		classes,
    		defaultAriaLabel,
    		props,
    		className,
    		active,
    		block,
    		color,
    		outline,
    		size,
    		$$props,
    		$$scope,
    		$$slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			class: 11,
    			active: 12,
    			block: 13,
    			children: 0,
    			close: 1,
    			color: 14,
    			disabled: 2,
    			href: 3,
    			id: 4,
    			outline: 15,
    			size: 16,
    			style: 5,
    			value: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Input.svelte generated by Svelte v3.20.1 */

    const { console: console_1$1 } = globals;
    const file$3 = "node_modules\\sveltestrap\\src\\Input.svelte";

    // (391:39) 
    function create_if_block_17(ctx) {
    	let select;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[25], null);

    	let select_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ multiple: true },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] }
    	];

    	let select_data = {};

    	for (let i = 0; i < select_levels.length; i += 1) {
    		select_data = assign(select_data, select_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			if (default_slot) default_slot.c();
    			set_attributes(select, select_data);
    			if (/*value*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler_1*/ ctx[161].call(select));
    			add_location(select, file$3, 391, 2, 7495);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, select, anchor);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			select_options(select, /*value*/ ctx[1]);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(select, "blur", /*blur_handler_17*/ ctx[141], false, false, false),
    				listen_dev(select, "focus", /*focus_handler_17*/ ctx[142], false, false, false),
    				listen_dev(select, "change", /*change_handler_16*/ ctx[143], false, false, false),
    				listen_dev(select, "input", /*input_handler_16*/ ctx[144], false, false, false),
    				listen_dev(select, "change", /*select_change_handler_1*/ ctx[161])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 33554432) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[25], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[25], dirty, null));
    				}
    			}

    			set_attributes(select, get_spread_update(select_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ multiple: true },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				select_options(select, /*value*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			if (default_slot) default_slot.d(detaching);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(391:39) ",
    		ctx
    	});

    	return block;
    }

    // (376:40) 
    function create_if_block_16(ctx) {
    	let select;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[25], null);

    	let select_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] }
    	];

    	let select_data = {};

    	for (let i = 0; i < select_levels.length; i += 1) {
    		select_data = assign(select_data, select_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			if (default_slot) default_slot.c();
    			set_attributes(select, select_data);
    			if (/*value*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[160].call(select));
    			add_location(select, file$3, 376, 2, 7281);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, select, anchor);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			select_option(select, /*value*/ ctx[1]);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(select, "blur", /*blur_handler_16*/ ctx[137], false, false, false),
    				listen_dev(select, "focus", /*focus_handler_16*/ ctx[138], false, false, false),
    				listen_dev(select, "change", /*change_handler_15*/ ctx[139], false, false, false),
    				listen_dev(select, "input", /*input_handler_15*/ ctx[140], false, false, false),
    				listen_dev(select, "change", /*select_change_handler*/ ctx[160])
    			];
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 33554432) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[25], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[25], dirty, null));
    				}
    			}

    			set_attributes(select, get_spread_update(select_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				select_option(select, /*value*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			if (default_slot) default_slot.d(detaching);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(376:40) ",
    		ctx
    	});

    	return block;
    }

    // (360:29) 
    function create_if_block_15(ctx) {
    	let textarea;
    	let dispose;

    	let textarea_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] }
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			set_attributes(textarea, textarea_data);
    			add_location(textarea, file$3, 360, 2, 7043);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(textarea, "blur", /*blur_handler_15*/ ctx[130], false, false, false),
    				listen_dev(textarea, "focus", /*focus_handler_15*/ ctx[131], false, false, false),
    				listen_dev(textarea, "keydown", /*keydown_handler_15*/ ctx[132], false, false, false),
    				listen_dev(textarea, "keypress", /*keypress_handler_15*/ ctx[133], false, false, false),
    				listen_dev(textarea, "keyup", /*keyup_handler_15*/ ctx[134], false, false, false),
    				listen_dev(textarea, "change", /*change_handler_14*/ ctx[135], false, false, false),
    				listen_dev(textarea, "input", /*input_handler_14*/ ctx[136], false, false, false),
    				listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[159])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(textarea, get_spread_update(textarea_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(textarea, /*value*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(360:29) ",
    		ctx
    	});

    	return block;
    }

    // (86:0) {#if tag === 'input'}
    function create_if_block$3(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*type*/ ctx[3] === "text") return create_if_block_1$1;
    		if (/*type*/ ctx[3] === "password") return create_if_block_2$1;
    		if (/*type*/ ctx[3] === "email") return create_if_block_3$1;
    		if (/*type*/ ctx[3] === "file") return create_if_block_4;
    		if (/*type*/ ctx[3] === "checkbox") return create_if_block_5;
    		if (/*type*/ ctx[3] === "radio") return create_if_block_6;
    		if (/*type*/ ctx[3] === "url") return create_if_block_7;
    		if (/*type*/ ctx[3] === "number") return create_if_block_8;
    		if (/*type*/ ctx[3] === "date") return create_if_block_9;
    		if (/*type*/ ctx[3] === "time") return create_if_block_10;
    		if (/*type*/ ctx[3] === "datetime") return create_if_block_11;
    		if (/*type*/ ctx[3] === "color") return create_if_block_12;
    		if (/*type*/ ctx[3] === "range") return create_if_block_13;
    		if (/*type*/ ctx[3] === "search") return create_if_block_14;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(86:0) {#if tag === 'input'}",
    		ctx
    	});

    	return block;
    }

    // (340:2) {:else}
    function create_else_block$3(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: /*type*/ ctx[3] },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] },
    		{ value: /*value*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$3, 340, 4, 6710);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_14*/ ctx[125], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_14*/ ctx[126], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_14*/ ctx[127], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_14*/ ctx[128], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_14*/ ctx[129], false, false, false),
    				listen_dev(input, "input", /*handleInput*/ ctx[13], false, false, false),
    				listen_dev(input, "change", /*handleInput*/ ctx[13], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				dirty[0] & /*type*/ 8 && { type: /*type*/ ctx[3] },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] },
    				dirty[0] & /*value*/ 2 && { value: /*value*/ ctx[1] }
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(340:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (322:30) 
    function create_if_block_14(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "search" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$3, 322, 4, 6422);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_13*/ ctx[118], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_13*/ ctx[119], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_13*/ ctx[120], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_13*/ ctx[121], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_13*/ ctx[122], false, false, false),
    				listen_dev(input, "change", /*change_handler_13*/ ctx[123], false, false, false),
    				listen_dev(input, "input", /*input_handler_13*/ ctx[124], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_9*/ ctx[158])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "search" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(322:30) ",
    		ctx
    	});

    	return block;
    }

    // (304:29) 
    function create_if_block_13(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "range" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$3, 304, 4, 6114);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_12*/ ctx[111], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_12*/ ctx[112], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_12*/ ctx[113], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_12*/ ctx[114], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_12*/ ctx[115], false, false, false),
    				listen_dev(input, "change", /*change_handler_12*/ ctx[116], false, false, false),
    				listen_dev(input, "input", /*input_handler_12*/ ctx[117], false, false, false),
    				listen_dev(input, "change", /*input_change_input_handler*/ ctx[157]),
    				listen_dev(input, "input", /*input_change_input_handler*/ ctx[157])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "range" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(304:29) ",
    		ctx
    	});

    	return block;
    }

    // (286:29) 
    function create_if_block_12(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "color" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$3, 286, 4, 5807);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_11*/ ctx[104], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_11*/ ctx[105], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_11*/ ctx[106], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_11*/ ctx[107], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_11*/ ctx[108], false, false, false),
    				listen_dev(input, "change", /*change_handler_11*/ ctx[109], false, false, false),
    				listen_dev(input, "input", /*input_handler_11*/ ctx[110], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_8*/ ctx[156])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "color" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(286:29) ",
    		ctx
    	});

    	return block;
    }

    // (268:32) 
    function create_if_block_11(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "datetime" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$3, 268, 4, 5497);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_10*/ ctx[97], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_10*/ ctx[98], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_10*/ ctx[99], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_10*/ ctx[100], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_10*/ ctx[101], false, false, false),
    				listen_dev(input, "change", /*change_handler_10*/ ctx[102], false, false, false),
    				listen_dev(input, "input", /*input_handler_10*/ ctx[103], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_7*/ ctx[155])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "datetime" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(268:32) ",
    		ctx
    	});

    	return block;
    }

    // (250:28) 
    function create_if_block_10(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "time" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$3, 250, 4, 5188);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_9*/ ctx[90], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_9*/ ctx[91], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_9*/ ctx[92], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_9*/ ctx[93], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_9*/ ctx[94], false, false, false),
    				listen_dev(input, "change", /*change_handler_9*/ ctx[95], false, false, false),
    				listen_dev(input, "input", /*input_handler_9*/ ctx[96], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_6*/ ctx[154])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "time" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(250:28) ",
    		ctx
    	});

    	return block;
    }

    // (232:28) 
    function create_if_block_9(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "date" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$3, 232, 4, 4883);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_8*/ ctx[83], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_8*/ ctx[84], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_8*/ ctx[85], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_8*/ ctx[86], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_8*/ ctx[87], false, false, false),
    				listen_dev(input, "change", /*change_handler_8*/ ctx[88], false, false, false),
    				listen_dev(input, "input", /*input_handler_8*/ ctx[89], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_5*/ ctx[153])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "date" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(232:28) ",
    		ctx
    	});

    	return block;
    }

    // (214:30) 
    function create_if_block_8(ctx) {
    	let input;
    	let input_updating = false;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "number" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	function input_input_handler_4() {
    		input_updating = true;
    		/*input_input_handler_4*/ ctx[152].call(input);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$3, 214, 4, 4576);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_7*/ ctx[76], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_7*/ ctx[77], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_7*/ ctx[78], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_7*/ ctx[79], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_7*/ ctx[80], false, false, false),
    				listen_dev(input, "change", /*change_handler_7*/ ctx[81], false, false, false),
    				listen_dev(input, "input", /*input_handler_7*/ ctx[82], false, false, false),
    				listen_dev(input, "input", input_input_handler_4)
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "number" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (!input_updating && dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}

    			input_updating = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(214:30) ",
    		ctx
    	});

    	return block;
    }

    // (196:27) 
    function create_if_block_7(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "url" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$3, 196, 4, 4270);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_6*/ ctx[69], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_6*/ ctx[70], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_6*/ ctx[71], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_6*/ ctx[72], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_6*/ ctx[73], false, false, false),
    				listen_dev(input, "change", /*change_handler_6*/ ctx[74], false, false, false),
    				listen_dev(input, "input", /*input_handler_6*/ ctx[75], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_3*/ ctx[151])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "url" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(196:27) ",
    		ctx
    	});

    	return block;
    }

    // (178:29) 
    function create_if_block_6(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "radio" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$3, 178, 4, 3965);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_5*/ ctx[62], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_5*/ ctx[63], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_5*/ ctx[64], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_5*/ ctx[65], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_5*/ ctx[66], false, false, false),
    				listen_dev(input, "change", /*change_handler_5*/ ctx[67], false, false, false),
    				listen_dev(input, "input", /*input_handler_5*/ ctx[68], false, false, false),
    				listen_dev(input, "change", /*input_change_handler_2*/ ctx[150])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "radio" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(178:29) ",
    		ctx
    	});

    	return block;
    }

    // (159:32) 
    function create_if_block_5(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "checkbox" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$3, 159, 4, 3636);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			input.checked = /*checked*/ ctx[0];
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_4*/ ctx[55], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_4*/ ctx[56], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_4*/ ctx[57], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_4*/ ctx[58], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_4*/ ctx[59], false, false, false),
    				listen_dev(input, "change", /*change_handler_4*/ ctx[60], false, false, false),
    				listen_dev(input, "input", /*input_handler_4*/ ctx[61], false, false, false),
    				listen_dev(input, "change", /*input_change_handler_1*/ ctx[149])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "checkbox" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(159:32) ",
    		ctx
    	});

    	return block;
    }

    // (141:28) 
    function create_if_block_4(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "file" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$3, 141, 4, 3327);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_3*/ ctx[48], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_3*/ ctx[49], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_3*/ ctx[50], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_3*/ ctx[51], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_3*/ ctx[52], false, false, false),
    				listen_dev(input, "change", /*change_handler_3*/ ctx[53], false, false, false),
    				listen_dev(input, "input", /*input_handler_3*/ ctx[54], false, false, false),
    				listen_dev(input, "change", /*input_change_handler*/ ctx[148])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "file" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(141:28) ",
    		ctx
    	});

    	return block;
    }

    // (123:29) 
    function create_if_block_3$1(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "email" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$3, 123, 4, 3021);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_2*/ ctx[41], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_2*/ ctx[42], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_2*/ ctx[43], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_2*/ ctx[44], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_2*/ ctx[45], false, false, false),
    				listen_dev(input, "change", /*change_handler_2*/ ctx[46], false, false, false),
    				listen_dev(input, "input", /*input_handler_2*/ ctx[47], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_2*/ ctx[147])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "email" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(123:29) ",
    		ctx
    	});

    	return block;
    }

    // (105:32) 
    function create_if_block_2$1(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "password" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$3, 105, 4, 2711);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler_1*/ ctx[34], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_1*/ ctx[35], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler_1*/ ctx[36], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler_1*/ ctx[37], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler_1*/ ctx[38], false, false, false),
    				listen_dev(input, "change", /*change_handler_1*/ ctx[39], false, false, false),
    				listen_dev(input, "input", /*input_handler_1*/ ctx[40], false, false, false),
    				listen_dev(input, "input", /*input_input_handler_1*/ ctx[146])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "password" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(105:32) ",
    		ctx
    	});

    	return block;
    }

    // (87:2) {#if type === 'text'}
    function create_if_block_1$1(ctx) {
    	let input;
    	let dispose;

    	let input_levels = [
    		/*props*/ ctx[12],
    		{ id: /*id*/ ctx[6] },
    		{ type: "text" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[10] },
    		{ name: /*name*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[8] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$3, 87, 4, 2402);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[1]);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "blur", /*blur_handler*/ ctx[27], false, false, false),
    				listen_dev(input, "focus", /*focus_handler*/ ctx[28], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler*/ ctx[29], false, false, false),
    				listen_dev(input, "keypress", /*keypress_handler*/ ctx[30], false, false, false),
    				listen_dev(input, "keyup", /*keyup_handler*/ ctx[31], false, false, false),
    				listen_dev(input, "change", /*change_handler*/ ctx[32], false, false, false),
    				listen_dev(input, "input", /*input_handler*/ ctx[33], false, false, false),
    				listen_dev(input, "input", /*input_input_handler*/ ctx[145])
    			];
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, get_spread_update(input_levels, [
    				dirty[0] & /*props*/ 4096 && /*props*/ ctx[12],
    				dirty[0] & /*id*/ 64 && { id: /*id*/ ctx[6] },
    				{ type: "text" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 1024 && { class: /*classes*/ ctx[10] },
    				dirty[0] & /*name*/ 128 && { name: /*name*/ ctx[7] },
    				dirty[0] & /*disabled*/ 512 && { disabled: /*disabled*/ ctx[9] },
    				dirty[0] & /*placeholder*/ 256 && { placeholder: /*placeholder*/ ctx[8] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(87:2) {#if type === 'text'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_if_block_15, create_if_block_16, create_if_block_17];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[11] === "input") return 0;
    		if (/*tag*/ ctx[11] === "textarea") return 1;
    		if (/*tag*/ ctx[11] === "select" && !/*multiple*/ ctx[5]) return 2;
    		if (/*tag*/ ctx[11] === "select" && /*multiple*/ ctx[5]) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { type = "text" } = $$props;
    	let { size = undefined } = $$props;
    	let { bsSize = undefined } = $$props;
    	let { color = undefined } = $$props;
    	let { checked = false } = $$props;
    	let { valid = false } = $$props;
    	let { invalid = false } = $$props;
    	let { plaintext = false } = $$props;
    	let { addon = false } = $$props;
    	let { value = "" } = $$props;
    	let { files = "" } = $$props;
    	let { readonly } = $$props;
    	let { multiple = false } = $$props;
    	let { id = "" } = $$props;
    	let { name = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { disabled = false } = $$props;

    	// eslint-disable-next-line no-unused-vars
    	const { type: _omitType, color: _omitColor, ...props } = clean($$props);

    	let classes;
    	let tag;

    	const handleInput = event => {
    		$$invalidate(1, value = event.target.value);
    	};

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Input", $$slots, ['default']);

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function change_handler(event) {
    		bubble($$self, event);
    	}

    	function input_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_1(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_1(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_1(event) {
    		bubble($$self, event);
    	}

    	function change_handler_1(event) {
    		bubble($$self, event);
    	}

    	function input_handler_1(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_2(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_2(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_2(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_2(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_2(event) {
    		bubble($$self, event);
    	}

    	function change_handler_2(event) {
    		bubble($$self, event);
    	}

    	function input_handler_2(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_3(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_3(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_3(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_3(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_3(event) {
    		bubble($$self, event);
    	}

    	function change_handler_3(event) {
    		bubble($$self, event);
    	}

    	function input_handler_3(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_4(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_4(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_4(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_4(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_4(event) {
    		bubble($$self, event);
    	}

    	function change_handler_4(event) {
    		bubble($$self, event);
    	}

    	function input_handler_4(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_5(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_5(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_5(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_5(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_5(event) {
    		bubble($$self, event);
    	}

    	function change_handler_5(event) {
    		bubble($$self, event);
    	}

    	function input_handler_5(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_6(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_6(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_6(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_6(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_6(event) {
    		bubble($$self, event);
    	}

    	function change_handler_6(event) {
    		bubble($$self, event);
    	}

    	function input_handler_6(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_7(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_7(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_7(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_7(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_7(event) {
    		bubble($$self, event);
    	}

    	function change_handler_7(event) {
    		bubble($$self, event);
    	}

    	function input_handler_7(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_8(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_8(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_8(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_8(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_8(event) {
    		bubble($$self, event);
    	}

    	function change_handler_8(event) {
    		bubble($$self, event);
    	}

    	function input_handler_8(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_9(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_9(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_9(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_9(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_9(event) {
    		bubble($$self, event);
    	}

    	function change_handler_9(event) {
    		bubble($$self, event);
    	}

    	function input_handler_9(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_10(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_10(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_10(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_10(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_10(event) {
    		bubble($$self, event);
    	}

    	function change_handler_10(event) {
    		bubble($$self, event);
    	}

    	function input_handler_10(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_11(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_11(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_11(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_11(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_11(event) {
    		bubble($$self, event);
    	}

    	function change_handler_11(event) {
    		bubble($$self, event);
    	}

    	function input_handler_11(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_12(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_12(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_12(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_12(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_12(event) {
    		bubble($$self, event);
    	}

    	function change_handler_12(event) {
    		bubble($$self, event);
    	}

    	function input_handler_12(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_13(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_13(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_13(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_13(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_13(event) {
    		bubble($$self, event);
    	}

    	function change_handler_13(event) {
    		bubble($$self, event);
    	}

    	function input_handler_13(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_14(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_14(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_14(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_14(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_14(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_15(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_15(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_15(event) {
    		bubble($$self, event);
    	}

    	function keypress_handler_15(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler_15(event) {
    		bubble($$self, event);
    	}

    	function change_handler_14(event) {
    		bubble($$self, event);
    	}

    	function input_handler_14(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_16(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_16(event) {
    		bubble($$self, event);
    	}

    	function change_handler_15(event) {
    		bubble($$self, event);
    	}

    	function input_handler_15(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_17(event) {
    		bubble($$self, event);
    	}

    	function focus_handler_17(event) {
    		bubble($$self, event);
    	}

    	function change_handler_16(event) {
    		bubble($$self, event);
    	}

    	function input_handler_16(event) {
    		bubble($$self, event);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_1() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_2() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_change_handler() {
    		files = this.files;
    		$$invalidate(2, files);
    	}

    	function input_change_handler_1() {
    		checked = this.checked;
    		value = this.value;
    		$$invalidate(0, checked);
    		$$invalidate(1, value);
    	}

    	function input_change_handler_2() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_3() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_4() {
    		value = to_number(this.value);
    		$$invalidate(1, value);
    	}

    	function input_input_handler_5() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_6() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_7() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_8() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_change_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(1, value);
    	}

    	function input_input_handler_9() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(1, value);
    	}

    	function select_change_handler_1() {
    		value = select_multiple_value(this);
    		$$invalidate(1, value);
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(16, className = $$new_props.class);
    		if ("type" in $$new_props) $$invalidate(3, type = $$new_props.type);
    		if ("size" in $$new_props) $$invalidate(14, size = $$new_props.size);
    		if ("bsSize" in $$new_props) $$invalidate(15, bsSize = $$new_props.bsSize);
    		if ("color" in $$new_props) $$invalidate(17, color = $$new_props.color);
    		if ("checked" in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ("valid" in $$new_props) $$invalidate(18, valid = $$new_props.valid);
    		if ("invalid" in $$new_props) $$invalidate(19, invalid = $$new_props.invalid);
    		if ("plaintext" in $$new_props) $$invalidate(20, plaintext = $$new_props.plaintext);
    		if ("addon" in $$new_props) $$invalidate(21, addon = $$new_props.addon);
    		if ("value" in $$new_props) $$invalidate(1, value = $$new_props.value);
    		if ("files" in $$new_props) $$invalidate(2, files = $$new_props.files);
    		if ("readonly" in $$new_props) $$invalidate(4, readonly = $$new_props.readonly);
    		if ("multiple" in $$new_props) $$invalidate(5, multiple = $$new_props.multiple);
    		if ("id" in $$new_props) $$invalidate(6, id = $$new_props.id);
    		if ("name" in $$new_props) $$invalidate(7, name = $$new_props.name);
    		if ("placeholder" in $$new_props) $$invalidate(8, placeholder = $$new_props.placeholder);
    		if ("disabled" in $$new_props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ("$$scope" in $$new_props) $$invalidate(25, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		type,
    		size,
    		bsSize,
    		color,
    		checked,
    		valid,
    		invalid,
    		plaintext,
    		addon,
    		value,
    		files,
    		readonly,
    		multiple,
    		id,
    		name,
    		placeholder,
    		disabled,
    		_omitType,
    		_omitColor,
    		props,
    		classes,
    		tag,
    		handleInput
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(16, className = $$new_props.className);
    		if ("type" in $$props) $$invalidate(3, type = $$new_props.type);
    		if ("size" in $$props) $$invalidate(14, size = $$new_props.size);
    		if ("bsSize" in $$props) $$invalidate(15, bsSize = $$new_props.bsSize);
    		if ("color" in $$props) $$invalidate(17, color = $$new_props.color);
    		if ("checked" in $$props) $$invalidate(0, checked = $$new_props.checked);
    		if ("valid" in $$props) $$invalidate(18, valid = $$new_props.valid);
    		if ("invalid" in $$props) $$invalidate(19, invalid = $$new_props.invalid);
    		if ("plaintext" in $$props) $$invalidate(20, plaintext = $$new_props.plaintext);
    		if ("addon" in $$props) $$invalidate(21, addon = $$new_props.addon);
    		if ("value" in $$props) $$invalidate(1, value = $$new_props.value);
    		if ("files" in $$props) $$invalidate(2, files = $$new_props.files);
    		if ("readonly" in $$props) $$invalidate(4, readonly = $$new_props.readonly);
    		if ("multiple" in $$props) $$invalidate(5, multiple = $$new_props.multiple);
    		if ("id" in $$props) $$invalidate(6, id = $$new_props.id);
    		if ("name" in $$props) $$invalidate(7, name = $$new_props.name);
    		if ("placeholder" in $$props) $$invalidate(8, placeholder = $$new_props.placeholder);
    		if ("disabled" in $$props) $$invalidate(9, disabled = $$new_props.disabled);
    		if ("classes" in $$props) $$invalidate(10, classes = $$new_props.classes);
    		if ("tag" in $$props) $$invalidate(11, tag = $$new_props.tag);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*type, plaintext, addon, color, size, className, invalid, valid, bsSize*/ 4177928) {
    			 {
    				const checkInput = ["radio", "checkbox"].indexOf(type) > -1;
    				const isNotaNumber = new RegExp("\\D", "g");
    				const fileInput = type === "file";
    				const textareaInput = type === "textarea";
    				const rangeInput = type === "range";
    				const selectInput = type === "select";
    				const buttonInput = type === "button" || type === "reset" || type === "submit";
    				const unsupportedInput = type === "hidden" || type === "image";
    				$$invalidate(11, tag = selectInput || textareaInput ? type : "input");
    				let formControlClass = "form-control";

    				if (plaintext) {
    					formControlClass = `${formControlClass}-plaintext`;
    					$$invalidate(11, tag = "input");
    				} else if (fileInput) {
    					formControlClass = `${formControlClass}-file`;
    				} else if (checkInput) {
    					if (addon) {
    						formControlClass = null;
    					} else {
    						formControlClass = "form-check-input";
    					}
    				} else if (buttonInput) {
    					formControlClass = `btn btn-${color || "secondary"}`;
    				} else if (rangeInput) {
    					formControlClass = "form-control-range";
    				} else if (unsupportedInput) {
    					formControlClass = "";
    				}

    				if (size && isNotaNumber.test(size)) {
    					console.warn("Please use the prop \"bsSize\" instead of the \"size\" to bootstrap's input sizing.");
    					$$invalidate(15, bsSize = size);
    					$$invalidate(14, size = undefined);
    				}

    				$$invalidate(10, classes = clsx(className, invalid && "is-invalid", valid && "is-valid", bsSize ? `form-control-${bsSize}` : false, formControlClass));
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		checked,
    		value,
    		files,
    		type,
    		readonly,
    		multiple,
    		id,
    		name,
    		placeholder,
    		disabled,
    		classes,
    		tag,
    		props,
    		handleInput,
    		size,
    		bsSize,
    		className,
    		color,
    		valid,
    		invalid,
    		plaintext,
    		addon,
    		_omitType,
    		_omitColor,
    		$$props,
    		$$scope,
    		$$slots,
    		blur_handler,
    		focus_handler,
    		keydown_handler,
    		keypress_handler,
    		keyup_handler,
    		change_handler,
    		input_handler,
    		blur_handler_1,
    		focus_handler_1,
    		keydown_handler_1,
    		keypress_handler_1,
    		keyup_handler_1,
    		change_handler_1,
    		input_handler_1,
    		blur_handler_2,
    		focus_handler_2,
    		keydown_handler_2,
    		keypress_handler_2,
    		keyup_handler_2,
    		change_handler_2,
    		input_handler_2,
    		blur_handler_3,
    		focus_handler_3,
    		keydown_handler_3,
    		keypress_handler_3,
    		keyup_handler_3,
    		change_handler_3,
    		input_handler_3,
    		blur_handler_4,
    		focus_handler_4,
    		keydown_handler_4,
    		keypress_handler_4,
    		keyup_handler_4,
    		change_handler_4,
    		input_handler_4,
    		blur_handler_5,
    		focus_handler_5,
    		keydown_handler_5,
    		keypress_handler_5,
    		keyup_handler_5,
    		change_handler_5,
    		input_handler_5,
    		blur_handler_6,
    		focus_handler_6,
    		keydown_handler_6,
    		keypress_handler_6,
    		keyup_handler_6,
    		change_handler_6,
    		input_handler_6,
    		blur_handler_7,
    		focus_handler_7,
    		keydown_handler_7,
    		keypress_handler_7,
    		keyup_handler_7,
    		change_handler_7,
    		input_handler_7,
    		blur_handler_8,
    		focus_handler_8,
    		keydown_handler_8,
    		keypress_handler_8,
    		keyup_handler_8,
    		change_handler_8,
    		input_handler_8,
    		blur_handler_9,
    		focus_handler_9,
    		keydown_handler_9,
    		keypress_handler_9,
    		keyup_handler_9,
    		change_handler_9,
    		input_handler_9,
    		blur_handler_10,
    		focus_handler_10,
    		keydown_handler_10,
    		keypress_handler_10,
    		keyup_handler_10,
    		change_handler_10,
    		input_handler_10,
    		blur_handler_11,
    		focus_handler_11,
    		keydown_handler_11,
    		keypress_handler_11,
    		keyup_handler_11,
    		change_handler_11,
    		input_handler_11,
    		blur_handler_12,
    		focus_handler_12,
    		keydown_handler_12,
    		keypress_handler_12,
    		keyup_handler_12,
    		change_handler_12,
    		input_handler_12,
    		blur_handler_13,
    		focus_handler_13,
    		keydown_handler_13,
    		keypress_handler_13,
    		keyup_handler_13,
    		change_handler_13,
    		input_handler_13,
    		blur_handler_14,
    		focus_handler_14,
    		keydown_handler_14,
    		keypress_handler_14,
    		keyup_handler_14,
    		blur_handler_15,
    		focus_handler_15,
    		keydown_handler_15,
    		keypress_handler_15,
    		keyup_handler_15,
    		change_handler_14,
    		input_handler_14,
    		blur_handler_16,
    		focus_handler_16,
    		change_handler_15,
    		input_handler_15,
    		blur_handler_17,
    		focus_handler_17,
    		change_handler_16,
    		input_handler_16,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		input_change_handler,
    		input_change_handler_1,
    		input_change_handler_2,
    		input_input_handler_3,
    		input_input_handler_4,
    		input_input_handler_5,
    		input_input_handler_6,
    		input_input_handler_7,
    		input_input_handler_8,
    		input_change_input_handler,
    		input_input_handler_9,
    		textarea_input_handler,
    		select_change_handler,
    		select_change_handler_1
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				class: 16,
    				type: 3,
    				size: 14,
    				bsSize: 15,
    				color: 17,
    				checked: 0,
    				valid: 18,
    				invalid: 19,
    				plaintext: 20,
    				addon: 21,
    				value: 1,
    				files: 2,
    				readonly: 4,
    				multiple: 5,
    				id: 6,
    				name: 7,
    				placeholder: 8,
    				disabled: 9
    			},
    			[-1, -1, -1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*readonly*/ ctx[4] === undefined && !("readonly" in props)) {
    			console_1$1.warn("<Input> was created without expected prop 'readonly'");
    		}
    	}

    	get class() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bsSize() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bsSize(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get plaintext() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set plaintext(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addon() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addon(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get files() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Label.svelte generated by Svelte v3.20.1 */
    const file$4 = "node_modules\\sveltestrap\\src\\Label.svelte";

    function create_fragment$5(ctx) {
    	let label;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);

    	let label_levels = [
    		/*props*/ ctx[3],
    		{ id: /*id*/ ctx[1] },
    		{ class: /*classes*/ ctx[2] },
    		{ for: /*fore*/ ctx[0] }
    	];

    	let label_data = {};

    	for (let i = 0; i < label_levels.length; i += 1) {
    		label_data = assign(label_data, label_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (default_slot) default_slot.c();
    			set_attributes(label, label_data);
    			add_location(label, file$4, 73, 0, 1685);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 131072) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[17], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, null));
    				}
    			}

    			set_attributes(label, get_spread_update(label_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*id*/ 2 && { id: /*id*/ ctx[1] },
    				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] },
    				dirty & /*fore*/ 1 && { for: /*fore*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	const props = clean($$props);
    	let { hidden = false } = $$props;
    	let { check = false } = $$props;
    	let { size = "" } = $$props;
    	let { for: fore } = $$props;
    	let { id = "" } = $$props;
    	let { xs = "" } = $$props;
    	let { sm = "" } = $$props;
    	let { md = "" } = $$props;
    	let { lg = "" } = $$props;
    	let { xl = "" } = $$props;
    	const colWidths = { xs, sm, md, lg, xl };
    	let { widths = Object.keys(colWidths) } = $$props;
    	const colClasses = [];

    	widths.forEach(colWidth => {
    		let columnProp = $$props[colWidth];

    		if (!columnProp && columnProp !== "") {
    			return;
    		}

    		const isXs = colWidth === "xs";
    		let colClass;

    		if (isObject(columnProp)) {
    			const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
    			colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

    			colClasses.push(clsx({
    				[colClass]: columnProp.size || columnProp.size === "",
    				[`order${colSizeInterfix}${columnProp.order}`]: columnProp.order || columnProp.order === 0,
    				[`offset${colSizeInterfix}${columnProp.offset}`]: columnProp.offset || columnProp.offset === 0
    			}));
    		} else {
    			colClass = getColumnSizeClass(isXs, colWidth, columnProp);
    			colClasses.push(colClass);
    		}
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Label", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(16, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("hidden" in $$new_props) $$invalidate(5, hidden = $$new_props.hidden);
    		if ("check" in $$new_props) $$invalidate(6, check = $$new_props.check);
    		if ("size" in $$new_props) $$invalidate(7, size = $$new_props.size);
    		if ("for" in $$new_props) $$invalidate(0, fore = $$new_props.for);
    		if ("id" in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ("xs" in $$new_props) $$invalidate(8, xs = $$new_props.xs);
    		if ("sm" in $$new_props) $$invalidate(9, sm = $$new_props.sm);
    		if ("md" in $$new_props) $$invalidate(10, md = $$new_props.md);
    		if ("lg" in $$new_props) $$invalidate(11, lg = $$new_props.lg);
    		if ("xl" in $$new_props) $$invalidate(12, xl = $$new_props.xl);
    		if ("widths" in $$new_props) $$invalidate(13, widths = $$new_props.widths);
    		if ("$$scope" in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		getColumnSizeClass,
    		isObject,
    		className,
    		props,
    		hidden,
    		check,
    		size,
    		fore,
    		id,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		colWidths,
    		widths,
    		colClasses,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(16, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("hidden" in $$props) $$invalidate(5, hidden = $$new_props.hidden);
    		if ("check" in $$props) $$invalidate(6, check = $$new_props.check);
    		if ("size" in $$props) $$invalidate(7, size = $$new_props.size);
    		if ("fore" in $$props) $$invalidate(0, fore = $$new_props.fore);
    		if ("id" in $$props) $$invalidate(1, id = $$new_props.id);
    		if ("xs" in $$props) $$invalidate(8, xs = $$new_props.xs);
    		if ("sm" in $$props) $$invalidate(9, sm = $$new_props.sm);
    		if ("md" in $$props) $$invalidate(10, md = $$new_props.md);
    		if ("lg" in $$props) $$invalidate(11, lg = $$new_props.lg);
    		if ("xl" in $$props) $$invalidate(12, xl = $$new_props.xl);
    		if ("widths" in $$props) $$invalidate(13, widths = $$new_props.widths);
    		if ("classes" in $$props) $$invalidate(2, classes = $$new_props.classes);
    	};

    	let classes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, hidden, check, size*/ 240) {
    			 $$invalidate(2, classes = clsx(className, hidden ? "sr-only" : false, check ? "form-check-label" : false, size ? `col-form-label-${size}` : false, colClasses, colClasses.length ? "col-form-label" : false));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		fore,
    		id,
    		classes,
    		props,
    		className,
    		hidden,
    		check,
    		size,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		widths,
    		colWidths,
    		colClasses,
    		$$props,
    		$$scope,
    		$$slots
    	];
    }

    class Label extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			class: 4,
    			hidden: 5,
    			check: 6,
    			size: 7,
    			for: 0,
    			id: 1,
    			xs: 8,
    			sm: 9,
    			md: 10,
    			lg: 11,
    			xl: 12,
    			widths: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Label",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*fore*/ ctx[0] === undefined && !("for" in props)) {
    			console.warn("<Label> was created without expected prop 'for'");
    		}
    	}

    	get class() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hidden() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hidden(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get check() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set check(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get for() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set for(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xs() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xs(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get widths() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set widths(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\FormGroup.svelte generated by Svelte v3.20.1 */
    const file$5 = "node_modules\\sveltestrap\\src\\FormGroup.svelte";

    // (29:0) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	let div_levels = [/*props*/ ctx[3], { id: /*id*/ ctx[0] }, { class: /*classes*/ ctx[2] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$5, 29, 2, 648);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[10], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null));
    				}
    			}

    			set_attributes(div, get_spread_update(div_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*id*/ 1 && { id: /*id*/ ctx[0] },
    				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(29:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:0) {#if tag === 'fieldset'}
    function create_if_block$4(ctx) {
    	let fieldset;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	let fieldset_levels = [/*props*/ ctx[3], { id: /*id*/ ctx[0] }, { class: /*classes*/ ctx[2] }];
    	let fieldset_data = {};

    	for (let i = 0; i < fieldset_levels.length; i += 1) {
    		fieldset_data = assign(fieldset_data, fieldset_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			if (default_slot) default_slot.c();
    			set_attributes(fieldset, fieldset_data);
    			add_location(fieldset, file$5, 25, 2, 568);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);

    			if (default_slot) {
    				default_slot.m(fieldset, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[10], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null));
    				}
    			}

    			set_attributes(fieldset, get_spread_update(fieldset_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*id*/ 1 && { id: /*id*/ ctx[0] },
    				dirty & /*classes*/ 4 && { class: /*classes*/ ctx[2] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(fieldset);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(25:0) {#if tag === 'fieldset'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[1] === "fieldset") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { row = false } = $$props;
    	let { check = false } = $$props;
    	let { inline = false } = $$props;
    	let { disabled = false } = $$props;
    	let { id = "" } = $$props;
    	let { tag = null } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("FormGroup", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(9, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("row" in $$new_props) $$invalidate(5, row = $$new_props.row);
    		if ("check" in $$new_props) $$invalidate(6, check = $$new_props.check);
    		if ("inline" in $$new_props) $$invalidate(7, inline = $$new_props.inline);
    		if ("disabled" in $$new_props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ("id" in $$new_props) $$invalidate(0, id = $$new_props.id);
    		if ("tag" in $$new_props) $$invalidate(1, tag = $$new_props.tag);
    		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		row,
    		check,
    		inline,
    		disabled,
    		id,
    		tag,
    		props,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(9, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("row" in $$props) $$invalidate(5, row = $$new_props.row);
    		if ("check" in $$props) $$invalidate(6, check = $$new_props.check);
    		if ("inline" in $$props) $$invalidate(7, inline = $$new_props.inline);
    		if ("disabled" in $$props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ("id" in $$props) $$invalidate(0, id = $$new_props.id);
    		if ("tag" in $$props) $$invalidate(1, tag = $$new_props.tag);
    		if ("classes" in $$props) $$invalidate(2, classes = $$new_props.classes);
    	};

    	let classes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, row, check, inline, disabled*/ 496) {
    			 $$invalidate(2, classes = clsx(className, row ? "row" : false, check ? "form-check" : "form-group", check && inline ? "form-check-inline" : false, check && disabled ? "disabled" : false));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		id,
    		tag,
    		classes,
    		props,
    		className,
    		row,
    		check,
    		inline,
    		disabled,
    		$$props,
    		$$scope,
    		$$slots
    	];
    }

    class FormGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			class: 4,
    			row: 5,
    			check: 6,
    			inline: 7,
    			disabled: 8,
    			id: 0,
    			tag: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormGroup",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get class() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get row() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get check() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set check(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tag() {
    		throw new Error("<FormGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tag(value) {
    		throw new Error("<FormGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Form.svelte generated by Svelte v3.20.1 */
    const file$6 = "node_modules\\sveltestrap\\src\\Form.svelte";

    function create_fragment$7(ctx) {
    	let form;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let form_levels = [/*props*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let form_data = {};

    	for (let i = 0; i < form_levels.length; i += 1) {
    		form_data = assign(form_data, form_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			form = element("form");
    			if (default_slot) default_slot.c();
    			set_attributes(form, form_data);
    			add_location(form, file$6, 13, 0, 265);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, form, anchor);

    			if (default_slot) {
    				default_slot.m(form, null);
    			}

    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(form, "submit", /*submit_handler*/ ctx[7], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[5], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null));
    				}
    			}

    			set_attributes(form, get_spread_update(form_levels, [
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { inline = false } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Form", $$slots, ['default']);

    	function submit_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(4, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("inline" in $$new_props) $$invalidate(3, inline = $$new_props.inline);
    		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		inline,
    		props,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(4, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("inline" in $$props) $$invalidate(3, inline = $$new_props.inline);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	let classes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, inline*/ 12) {
    			 $$invalidate(0, classes = clsx(className, inline ? "form-inline" : false));
    		}
    	};

    	$$props = exclude_internal_props($$props);
    	return [classes, props, className, inline, $$props, $$scope, $$slots, submit_handler];
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { class: 2, inline: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get class() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<Form>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<Form>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Pagination.svelte generated by Svelte v3.20.1 */
    const file$7 = "node_modules\\sveltestrap\\src\\Pagination.svelte";

    function create_fragment$8(ctx) {
    	let nav;
    	let ul;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let nav_levels = [
    		/*props*/ ctx[3],
    		{ class: /*classes*/ ctx[1] },
    		{ "aria-label": /*ariaLabel*/ ctx[0] }
    	];

    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			attr_dev(ul, "class", /*listClasses*/ ctx[2]);
    			add_location(ul, file$7, 20, 2, 455);
    			set_attributes(nav, nav_data);
    			add_location(nav, file$7, 19, 0, 397);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[8], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null));
    				}
    			}

    			if (!current || dirty & /*listClasses*/ 4) {
    				attr_dev(ul, "class", /*listClasses*/ ctx[2]);
    			}

    			set_attributes(nav, get_spread_update(nav_levels, [
    				dirty & /*props*/ 8 && /*props*/ ctx[3],
    				dirty & /*classes*/ 2 && { class: /*classes*/ ctx[1] },
    				dirty & /*ariaLabel*/ 1 && { "aria-label": /*ariaLabel*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { listClassName = "" } = $$props;
    	let { size = "" } = $$props;
    	let { ariaLabel = "pagination" } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Pagination", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(7, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ("listClassName" in $$new_props) $$invalidate(5, listClassName = $$new_props.listClassName);
    		if ("size" in $$new_props) $$invalidate(6, size = $$new_props.size);
    		if ("ariaLabel" in $$new_props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		listClassName,
    		size,
    		ariaLabel,
    		props,
    		classes,
    		listClasses
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(7, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(4, className = $$new_props.className);
    		if ("listClassName" in $$props) $$invalidate(5, listClassName = $$new_props.listClassName);
    		if ("size" in $$props) $$invalidate(6, size = $$new_props.size);
    		if ("ariaLabel" in $$props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    		if ("classes" in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ("listClasses" in $$props) $$invalidate(2, listClasses = $$new_props.listClasses);
    	};

    	let classes;
    	let listClasses;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 16) {
    			 $$invalidate(1, classes = clsx(className));
    		}

    		if ($$self.$$.dirty & /*listClassName, size*/ 96) {
    			 $$invalidate(2, listClasses = clsx(listClassName, "pagination", { [`pagination-${size}`]: !!size }));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		ariaLabel,
    		classes,
    		listClasses,
    		props,
    		className,
    		listClassName,
    		size,
    		$$props,
    		$$scope,
    		$$slots
    	];
    }

    class Pagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			class: 4,
    			listClassName: 5,
    			size: 6,
    			ariaLabel: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get class() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listClassName() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listClassName(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\PaginationItem.svelte generated by Svelte v3.20.1 */
    const file$8 = "node_modules\\sveltestrap\\src\\PaginationItem.svelte";

    function create_fragment$9(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let li_levels = [/*props*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$8, 17, 0, 309);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 64) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[6], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null));
    				}
    			}

    			set_attributes(li, get_spread_update(li_levels, [
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { active = false } = $$props;
    	let { disabled = false } = $$props;
    	const props = clean($$props);
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("PaginationItem", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ("active" in $$new_props) $$invalidate(3, active = $$new_props.active);
    		if ("disabled" in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		active,
    		disabled,
    		props,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(2, className = $$new_props.className);
    		if ("active" in $$props) $$invalidate(3, active = $$new_props.active);
    		if ("disabled" in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ("classes" in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	let classes;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, active, disabled*/ 28) {
    			 $$invalidate(0, classes = clsx(className, "page-item", { active, disabled }));
    		}
    	};

    	$$props = exclude_internal_props($$props);
    	return [classes, props, className, active, disabled, $$props, $$scope, $$slots];
    }

    class PaginationItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { class: 2, active: 3, disabled: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationItem",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get class() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<PaginationItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<PaginationItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\PaginationLink.svelte generated by Svelte v3.20.1 */
    const file$9 = "node_modules\\sveltestrap\\src\\PaginationLink.svelte";

    // (50:2) {:else}
    function create_else_block$5(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8192) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[13], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null));
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(50:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (45:2) {#if previous || next || first || last}
    function create_if_block$5(ctx) {
    	let span0;
    	let t0;
    	let span1;
    	let t1;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t0 = space();
    			span1 = element("span");
    			t1 = text(/*realLabel*/ ctx[7]);
    			attr_dev(span0, "aria-hidden", "true");
    			add_location(span0, file$9, 45, 4, 995);
    			attr_dev(span1, "class", "sr-only");
    			add_location(span1, file$9, 48, 4, 1073);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(span0, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8192) {
    					default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[13], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null));
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*defaultCaret*/ 32) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (!current || dirty & /*realLabel*/ 128) set_data_dev(t1, /*realLabel*/ ctx[7]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(45:2) {#if previous || next || first || last}",
    		ctx
    	});

    	return block;
    }

    // (47:12)  
    function fallback_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*defaultCaret*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*defaultCaret*/ 32) set_data_dev(t, /*defaultCaret*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(47:12)  ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let dispose;
    	const if_block_creators = [create_if_block$5, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*previous*/ ctx[1] || /*next*/ ctx[0] || /*first*/ ctx[2] || /*last*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let a_levels = [/*props*/ ctx[8], { class: /*classes*/ ctx[6] }, { href: /*href*/ ctx[4] }];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$9, 43, 0, 902);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			current = true;
    			if (remount) dispose();
    			dispose = listen_dev(a, "click", /*click_handler*/ ctx[15], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, get_spread_update(a_levels, [
    				dirty & /*props*/ 256 && /*props*/ ctx[8],
    				dirty & /*classes*/ 64 && { class: /*classes*/ ctx[6] },
    				dirty & /*href*/ 16 && { href: /*href*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { next = false } = $$props;
    	let { previous = false } = $$props;
    	let { first = false } = $$props;
    	let { last = false } = $$props;
    	let { ariaLabel = "" } = $$props;
    	let { href = "" } = $$props;
    	const props = clean($$props);
    	let defaultAriaLabel;
    	let defaultCaret;
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("PaginationLink", $$slots, ['default']);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(12, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(9, className = $$new_props.class);
    		if ("next" in $$new_props) $$invalidate(0, next = $$new_props.next);
    		if ("previous" in $$new_props) $$invalidate(1, previous = $$new_props.previous);
    		if ("first" in $$new_props) $$invalidate(2, first = $$new_props.first);
    		if ("last" in $$new_props) $$invalidate(3, last = $$new_props.last);
    		if ("ariaLabel" in $$new_props) $$invalidate(10, ariaLabel = $$new_props.ariaLabel);
    		if ("href" in $$new_props) $$invalidate(4, href = $$new_props.href);
    		if ("$$scope" in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		clsx,
    		clean,
    		className,
    		next,
    		previous,
    		first,
    		last,
    		ariaLabel,
    		href,
    		props,
    		defaultAriaLabel,
    		defaultCaret,
    		classes,
    		realLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(12, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(9, className = $$new_props.className);
    		if ("next" in $$props) $$invalidate(0, next = $$new_props.next);
    		if ("previous" in $$props) $$invalidate(1, previous = $$new_props.previous);
    		if ("first" in $$props) $$invalidate(2, first = $$new_props.first);
    		if ("last" in $$props) $$invalidate(3, last = $$new_props.last);
    		if ("ariaLabel" in $$props) $$invalidate(10, ariaLabel = $$new_props.ariaLabel);
    		if ("href" in $$props) $$invalidate(4, href = $$new_props.href);
    		if ("defaultAriaLabel" in $$props) $$invalidate(11, defaultAriaLabel = $$new_props.defaultAriaLabel);
    		if ("defaultCaret" in $$props) $$invalidate(5, defaultCaret = $$new_props.defaultCaret);
    		if ("classes" in $$props) $$invalidate(6, classes = $$new_props.classes);
    		if ("realLabel" in $$props) $$invalidate(7, realLabel = $$new_props.realLabel);
    	};

    	let classes;
    	let realLabel;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 512) {
    			 $$invalidate(6, classes = clsx(className, "page-link"));
    		}

    		if ($$self.$$.dirty & /*previous, next, first, last*/ 15) {
    			 if (previous) {
    				$$invalidate(11, defaultAriaLabel = "Previous");
    			} else if (next) {
    				$$invalidate(11, defaultAriaLabel = "Next");
    			} else if (first) {
    				$$invalidate(11, defaultAriaLabel = "First");
    			} else if (last) {
    				$$invalidate(11, defaultAriaLabel = "Last");
    			}
    		}

    		if ($$self.$$.dirty & /*ariaLabel, defaultAriaLabel*/ 3072) {
    			 $$invalidate(7, realLabel = ariaLabel || defaultAriaLabel);
    		}

    		if ($$self.$$.dirty & /*previous, next, first, last*/ 15) {
    			 if (previous) {
    				$$invalidate(5, defaultCaret = "‹");
    			} else if (next) {
    				$$invalidate(5, defaultCaret = "›");
    			} else if (first) {
    				$$invalidate(5, defaultCaret = "«");
    			} else if (last) {
    				$$invalidate(5, defaultCaret = "»");
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		next,
    		previous,
    		first,
    		last,
    		href,
    		defaultCaret,
    		classes,
    		realLabel,
    		props,
    		className,
    		ariaLabel,
    		defaultAriaLabel,
    		$$props,
    		$$scope,
    		$$slots,
    		click_handler
    	];
    }

    class PaginationLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			class: 9,
    			next: 0,
    			previous: 1,
    			first: 2,
    			last: 3,
    			ariaLabel: 10,
    			href: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationLink",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get class() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get next() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set next(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get previous() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set previous(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get first() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set first(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get last() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set last(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<PaginationLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<PaginationLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\oilCoalNuclearEnergyConsumptionAPI\PrimaryEnergyTable.svelte generated by Svelte v3.20.1 */

    const { console: console_1$2 } = globals;
    const file$a = "src\\front\\oilCoalNuclearEnergyConsumptionAPI\\PrimaryEnergyTable.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>   import {     onMount     }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>   import {     onMount     }",
    		ctx
    	});

    	return block;
    }

    // (320:1) {:then oilEnergys}
    function create_then_block(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let current;

    	const formgroup0 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const formgroup1 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				class: "button-search",
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*search*/ ctx[12](/*currentCountry*/ ctx[3], /*currentYear*/ ctx[4]))) /*search*/ ctx[12](/*currentCountry*/ ctx[3], /*currentYear*/ ctx[4]).apply(this, arguments);
    	});

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formgroup0.$$.fragment);
    			t0 = space();
    			create_component(formgroup1.$$.fragment);
    			t1 = space();
    			create_component(button.$$.fragment);
    			t2 = space();
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formgroup0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(formgroup1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(button, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const formgroup0_changes = {};

    			if (dirty[0] & /*currentCountry, countries*/ 10 | dirty[1] & /*$$scope*/ 2048) {
    				formgroup0_changes.$$scope = { dirty, ctx };
    			}

    			formgroup0.$set(formgroup0_changes);
    			const formgroup1_changes = {};

    			if (dirty[0] & /*currentYear, years*/ 20 | dirty[1] & /*$$scope*/ 2048) {
    				formgroup1_changes.$$scope = { dirty, ctx };
    			}

    			formgroup1.$set(formgroup1_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const table_changes = {};

    			if (dirty[0] & /*oilEnergy, newOilEnergy*/ 129 | dirty[1] & /*$$scope*/ 2048) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup0.$$.fragment, local);
    			transition_in(formgroup1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup0.$$.fragment, local);
    			transition_out(formgroup1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formgroup0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(formgroup1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(button, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(320:1) {:then oilEnergys}",
    		ctx
    	});

    	return block;
    }

    // (322:8) <Label for="selectCountry">
    function create_default_slot_21(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Búsqueda por país");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(322:8) <Label for=\\\"selectCountry\\\">",
    		ctx
    	});

    	return block;
    }

    // (327:3) {:else}
    function create_else_block_1$1(ctx) {
    	let option;
    	let t_value = /*country*/ ctx[39] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*country*/ ctx[39];
    			option.value = option.__value;
    			add_location(option, file$a, 327, 3, 9557);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*countries*/ 2 && t_value !== (t_value = /*country*/ ctx[39] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*countries*/ 2 && option_value_value !== (option_value_value = /*country*/ ctx[39])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(327:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (325:3) {#if country == currentCountry}
    function create_if_block_3$2(ctx) {
    	let option;
    	let t_value = /*country*/ ctx[39] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.selected = "selected";
    			option.__value = option_value_value = /*country*/ ctx[39];
    			option.value = option.__value;
    			add_location(option, file$a, 325, 3, 9492);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*countries*/ 2 && t_value !== (t_value = /*country*/ ctx[39] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*countries*/ 2 && option_value_value !== (option_value_value = /*country*/ ctx[39])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(325:3) {#if country == currentCountry}",
    		ctx
    	});

    	return block;
    }

    // (324:3) {#each countries as country}
    function create_each_block_2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*country*/ ctx[39] == /*currentCountry*/ ctx[3]) return create_if_block_3$2;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(324:3) {#each countries as country}",
    		ctx
    	});

    	return block;
    }

    // (323:8) <Input type="select" name="selectCountry" id="selectCountry" bind:value="{currentCountry}">
    function create_default_slot_20(ctx) {
    	let t0;
    	let option;
    	let each_value_2 = /*countries*/ ctx[1];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			option = element("option");
    			option.textContent = "-";
    			option.__value = "-";
    			option.value = option.__value;
    			add_location(option, file$a, 330, 3, 9610);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, option, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*countries, currentCountry*/ 10) {
    				each_value_2 = /*countries*/ ctx[1];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(323:8) <Input type=\\\"select\\\" name=\\\"selectCountry\\\" id=\\\"selectCountry\\\" bind:value=\\\"{currentCountry}\\\">",
    		ctx
    	});

    	return block;
    }

    // (321:1) <FormGroup>
    function create_default_slot_19(ctx) {
    	let t;
    	let updating_value;
    	let current;

    	const label = new Label({
    			props: {
    				for: "selectCountry",
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function input_value_binding(value) {
    		/*input_value_binding*/ ctx[22].call(null, value);
    	}

    	let input_props = {
    		type: "select",
    		name: "selectCountry",
    		id: "selectCountry",
    		$$slots: { default: [create_default_slot_20] },
    		$$scope: { ctx }
    	};

    	if (/*currentCountry*/ ctx[3] !== void 0) {
    		input_props.value = /*currentCountry*/ ctx[3];
    	}

    	const input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "value", input_value_binding));

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    			t = space();
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    			const input_changes = {};

    			if (dirty[0] & /*countries, currentCountry*/ 10 | dirty[1] & /*$$scope*/ 2048) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*currentCountry*/ 8) {
    				updating_value = true;
    				input_changes.value = /*currentCountry*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(321:1) <FormGroup>",
    		ctx
    	});

    	return block;
    }

    // (337:3) <Label for="selectYear">
    function create_default_slot_18(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Año");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(337:3) <Label for=\\\"selectYear\\\">",
    		ctx
    	});

    	return block;
    }

    // (343:4) {:else}
    function create_else_block$6(ctx) {
    	let option;
    	let t_value = /*year*/ ctx[36] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*year*/ ctx[36];
    			option.value = option.__value;
    			add_location(option, file$a, 343, 4, 9942);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*years*/ 4 && t_value !== (t_value = /*year*/ ctx[36] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*years*/ 4 && option_value_value !== (option_value_value = /*year*/ ctx[36])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(343:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (341:4) {#if year == currentYear}
    function create_if_block_2$2(ctx) {
    	let option;
    	let t_value = /*year*/ ctx[36] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.selected = "selected";
    			option.__value = option_value_value = /*year*/ ctx[36];
    			option.value = option.__value;
    			add_location(option, file$a, 341, 4, 9879);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*years*/ 4 && t_value !== (t_value = /*year*/ ctx[36] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*years*/ 4 && option_value_value !== (option_value_value = /*year*/ ctx[36])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(341:4) {#if year == currentYear}",
    		ctx
    	});

    	return block;
    }

    // (340:4) {#each years as year}
    function create_each_block_1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*year*/ ctx[36] == /*currentYear*/ ctx[4]) return create_if_block_2$2;
    		return create_else_block$6;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(340:4) {#each years as year}",
    		ctx
    	});

    	return block;
    }

    // (338:3) <Input type="select" name="selectYear" id="selectYear" bind:value = "{currentYear}">
    function create_default_slot_17(ctx) {
    	let t0;
    	let option;
    	let each_value_1 = /*years*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			option = element("option");
    			option.textContent = "-";
    			option.__value = "-";
    			option.value = option.__value;
    			add_location(option, file$a, 346, 4, 9995);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, option, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*years, currentYear*/ 20) {
    				each_value_1 = /*years*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(338:3) <Input type=\\\"select\\\" name=\\\"selectYear\\\" id=\\\"selectYear\\\" bind:value = \\\"{currentYear}\\\">",
    		ctx
    	});

    	return block;
    }

    // (336:2) <FormGroup>
    function create_default_slot_16(ctx) {
    	let t;
    	let updating_value;
    	let current;

    	const label = new Label({
    			props: {
    				for: "selectYear",
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function input_value_binding_1(value) {
    		/*input_value_binding_1*/ ctx[23].call(null, value);
    	}

    	let input_props = {
    		type: "select",
    		name: "selectYear",
    		id: "selectYear",
    		$$slots: { default: [create_default_slot_17] },
    		$$scope: { ctx }
    	};

    	if (/*currentYear*/ ctx[4] !== void 0) {
    		input_props.value = /*currentYear*/ ctx[4];
    	}

    	const input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "value", input_value_binding_1));

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    			t = space();
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    			const input_changes = {};

    			if (dirty[0] & /*years, currentYear*/ 20 | dirty[1] & /*$$scope*/ 2048) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*currentYear*/ 16) {
    				updating_value = true;
    				input_changes.value = /*currentYear*/ ctx[4];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(336:2) <FormGroup>",
    		ctx
    	});

    	return block;
    }

    // (351:2) <Button outline color="secondary" on:click="{search(currentCountry, currentYear)}" class="button-search" >
    function create_default_slot_15(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Buscar");
    			attr_dev(i, "class", "fas fa-search");
    			add_location(i, file$a, 350, 109, 10155);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(351:2) <Button outline color=\\\"secondary\\\" on:click=\\\"{search(currentCountry, currentYear)}\\\" class=\\\"button-search\\\" >",
    		ctx
    	});

    	return block;
    }

    // (371:9) <Button outline color= "primary" on:click={insertOilEnergy}>
    function create_default_slot_14(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Insertar");
    			attr_dev(i, "class", "far fa-edit");
    			add_location(i, file$a, 370, 70, 11143);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(371:9) <Button outline color= \\\"primary\\\" on:click={insertOilEnergy}>",
    		ctx
    	});

    	return block;
    }

    // (386:10) <Button outline color= "danger" on:click = {deleteOilEnergy(oilEnergy.country,oilEnergy.year)}>
    function create_default_slot_13(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Borrar");
    			attr_dev(i, "class", "fa fa-trash");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$a, 385, 106, 11721);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(386:10) <Button outline color= \\\"danger\\\" on:click = {deleteOilEnergy(oilEnergy.country,oilEnergy.year)}>",
    		ctx
    	});

    	return block;
    }

    // (374:4) {#each oilEnergys as oilEnergy}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*oilEnergy*/ ctx[7].country + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*oilEnergy*/ ctx[7].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*oilEnergy*/ ctx[7]["oil-consumption"] + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*oilEnergy*/ ctx[7]["coal-consumption"] + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*oilEnergy*/ ctx[7]["nuclear-energy-consumption"] + "";
    	let t8;
    	let t9;
    	let td5;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*deleteOilEnergy*/ ctx[10](/*oilEnergy*/ ctx[7].country, /*oilEnergy*/ ctx[7].year))) /*deleteOilEnergy*/ ctx[10](/*oilEnergy*/ ctx[7].country, /*oilEnergy*/ ctx[7].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			attr_dev(a, "href", a_href_value = "#/oil-coal-nuclear-energy-consumption-stats/" + /*oilEnergy*/ ctx[7].country + "/" + /*oilEnergy*/ ctx[7].year);
    			add_location(a, file$a, 376, 7, 11275);
    			add_location(td0, file$a, 375, 6, 11262);
    			add_location(td1, file$a, 380, 6, 11428);
    			add_location(td2, file$a, 382, 6, 11468);
    			add_location(td3, file$a, 383, 6, 11515);
    			add_location(td4, file$a, 384, 6, 11563);
    			add_location(td5, file$a, 385, 6, 11621);
    			add_location(tr, file$a, 374, 5, 11250);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button, td5, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*oilEnergy*/ 128) && t0_value !== (t0_value = /*oilEnergy*/ ctx[7].country + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*oilEnergy*/ 128 && a_href_value !== (a_href_value = "#/oil-coal-nuclear-energy-consumption-stats/" + /*oilEnergy*/ ctx[7].country + "/" + /*oilEnergy*/ ctx[7].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty[0] & /*oilEnergy*/ 128) && t2_value !== (t2_value = /*oilEnergy*/ ctx[7].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*oilEnergy*/ 128) && t4_value !== (t4_value = /*oilEnergy*/ ctx[7]["oil-consumption"] + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*oilEnergy*/ 128) && t6_value !== (t6_value = /*oilEnergy*/ ctx[7]["coal-consumption"] + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*oilEnergy*/ 128) && t8_value !== (t8_value = /*oilEnergy*/ ctx[7]["nuclear-energy-consumption"] + "")) set_data_dev(t8, t8_value);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(374:4) {#each oilEnergys as oilEnergy}",
    		ctx
    	});

    	return block;
    }

    // (353:2) <Table bordered>
    function create_default_slot_12(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let updating_value;
    	let t12;
    	let td1;
    	let updating_value_1;
    	let t13;
    	let td2;
    	let updating_value_2;
    	let t14;
    	let td3;
    	let updating_value_3;
    	let t15;
    	let td4;
    	let updating_value_4;
    	let t16;
    	let td5;
    	let t17;
    	let t18;
    	let tr2;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[24].call(null, value);
    	}

    	let input0_props = { placeholder: "Ej. España" };

    	if (/*newOilEnergy*/ ctx[0].country !== void 0) {
    		input0_props.value = /*newOilEnergy*/ ctx[0].country;
    	}

    	const input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[25].call(null, value);
    	}

    	let input1_props = {
    		required: true,
    		type: "number",
    		placeholder: "Ej. 2020"
    	};

    	if (/*newOilEnergy*/ ctx[0].year !== void 0) {
    		input1_props.value = /*newOilEnergy*/ ctx[0].year;
    	}

    	const input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding));

    	function input2_value_binding(value) {
    		/*input2_value_binding*/ ctx[26].call(null, value);
    	}

    	let input2_props = {
    		required: true,
    		type: "number",
    		step: "0.01",
    		min: "0"
    	};

    	if (/*newOilEnergy*/ ctx[0]["oil-consumption"] !== void 0) {
    		input2_props.value = /*newOilEnergy*/ ctx[0]["oil-consumption"];
    	}

    	const input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, "value", input2_value_binding));

    	function input3_value_binding(value) {
    		/*input3_value_binding*/ ctx[27].call(null, value);
    	}

    	let input3_props = {
    		type: "number",
    		placeholder: "0.0",
    		step: "0.01",
    		min: "0"
    	};

    	if (/*newOilEnergy*/ ctx[0]["coal-consumption"] !== void 0) {
    		input3_props.value = /*newOilEnergy*/ ctx[0]["coal-consumption"];
    	}

    	const input3 = new Input({ props: input3_props, $$inline: true });
    	binding_callbacks.push(() => bind(input3, "value", input3_value_binding));

    	function input4_value_binding(value) {
    		/*input4_value_binding*/ ctx[28].call(null, value);
    	}

    	let input4_props = {
    		type: "number",
    		placeholder: "0.0",
    		step: "0.01",
    		min: "0"
    	};

    	if (/*newOilEnergy*/ ctx[0]["nuclear-energy-consumption"] !== void 0) {
    		input4_props.value = /*newOilEnergy*/ ctx[0]["nuclear-energy-consumption"];
    	}

    	const input4 = new Input({ props: input4_props, $$inline: true });
    	binding_callbacks.push(() => bind(input4, "value", input4_value_binding));

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertOilEnergy*/ ctx[9]);
    	let each_value = /*oilEnergys*/ ctx[33];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Consumo de Gasolina";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Consumo de Carbón";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Consumo de Energía Nuclear";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			create_component(input0.$$.fragment);
    			t12 = space();
    			td1 = element("td");
    			create_component(input1.$$.fragment);
    			t13 = space();
    			td2 = element("td");
    			create_component(input2.$$.fragment);
    			t14 = space();
    			td3 = element("td");
    			create_component(input3.$$.fragment);
    			t15 = space();
    			td4 = element("td");
    			create_component(input4.$$.fragment);
    			t16 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t17 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t18 = space();
    			tr2 = element("tr");
    			add_location(th0, file$a, 355, 5, 10254);
    			add_location(th1, file$a, 356, 5, 10274);
    			add_location(th2, file$a, 357, 5, 10293);
    			add_location(th3, file$a, 358, 5, 10328);
    			add_location(th4, file$a, 359, 20, 10376);
    			add_location(th5, file$a, 360, 20, 10433);
    			add_location(tr0, file$a, 354, 4, 10243);
    			add_location(thead, file$a, 353, 3, 10230);
    			add_location(td0, file$a, 365, 5, 10503);
    			add_location(td1, file$a, 366, 5, 10591);
    			add_location(td2, file$a, 367, 5, 10697);
    			add_location(td3, file$a, 368, 5, 10814);
    			add_location(td4, file$a, 369, 5, 10941);
    			add_location(td5, file$a, 370, 5, 11078);
    			add_location(tr1, file$a, 364, 4, 10492);
    			add_location(tr2, file$a, 388, 4, 11819);
    			add_location(tbody, file$a, 363, 3, 10479);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			mount_component(input0, td0, null);
    			append_dev(tr1, t12);
    			append_dev(tr1, td1);
    			mount_component(input1, td1, null);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			mount_component(input2, td2, null);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			mount_component(input3, td3, null);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			mount_component(input4, td4, null);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			append_dev(tbody, t17);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(tbody, t18);
    			append_dev(tbody, tr2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input0_changes = {};

    			if (!updating_value && dirty[0] & /*newOilEnergy*/ 1) {
    				updating_value = true;
    				input0_changes.value = /*newOilEnergy*/ ctx[0].country;
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty[0] & /*newOilEnergy*/ 1) {
    				updating_value_1 = true;
    				input1_changes.value = /*newOilEnergy*/ ctx[0].year;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};

    			if (!updating_value_2 && dirty[0] & /*newOilEnergy*/ 1) {
    				updating_value_2 = true;
    				input2_changes.value = /*newOilEnergy*/ ctx[0]["oil-consumption"];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			input2.$set(input2_changes);
    			const input3_changes = {};

    			if (!updating_value_3 && dirty[0] & /*newOilEnergy*/ 1) {
    				updating_value_3 = true;
    				input3_changes.value = /*newOilEnergy*/ ctx[0]["coal-consumption"];
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			input3.$set(input3_changes);
    			const input4_changes = {};

    			if (!updating_value_4 && dirty[0] & /*newOilEnergy*/ 1) {
    				updating_value_4 = true;
    				input4_changes.value = /*newOilEnergy*/ ctx[0]["nuclear-energy-consumption"];
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			input4.$set(input4_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty[0] & /*deleteOilEnergy, oilEnergy*/ 1152) {
    				each_value = /*oilEnergys*/ ctx[33];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, t18);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(input3.$$.fragment, local);
    			transition_in(input4.$$.fragment, local);
    			transition_in(button.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(input3.$$.fragment, local);
    			transition_out(input4.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(input3);
    			destroy_component(input4);
    			destroy_component(button);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(353:2) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (318:19)     Loading oilEnergy...   {:then oilEnergys}
    function create_pending_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading oilEnergy...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(318:19)     Loading oilEnergy...   {:then oilEnergys}",
    		ctx
    	});

    	return block;
    }

    // (398:8) <PaginationItem class = "{currentPage === 1 ? 'disabled' : ''}">
    function create_default_slot_11(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/oilCoalNuclearEnergyConsumptionAPI"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[29]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(398:8) <PaginationItem class = \\\"{currentPage === 1 ? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (402:2) {#if currentPage != 1}
    function create_if_block_1$2(ctx) {
    	let current;

    	const paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 2048) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(402:2) {#if currentPage != 1}",
    		ctx
    	});

    	return block;
    }

    // (404:12) <PaginationLink href="#/oilCoalNuclearEnergyConsumptionAPI" on:click="{() => addOffset(-1)}" >
    function create_default_slot_10(ctx) {
    	let t_value = /*currentPage*/ ctx[5] - 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 32 && t_value !== (t_value = /*currentPage*/ ctx[5] - 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(404:12) <PaginationLink href=\\\"#/oilCoalNuclearEnergyConsumptionAPI\\\" on:click=\\\"{() => addOffset(-1)}\\\" >",
    		ctx
    	});

    	return block;
    }

    // (403:8) <PaginationItem>
    function create_default_slot_9(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/oilCoalNuclearEnergyConsumptionAPI",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_1*/ ctx[30]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 2048) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(403:8) <PaginationItem>",
    		ctx
    	});

    	return block;
    }

    // (409:12) <PaginationLink href="#/oilCoalNuclearEnergyConsumptionAPI" >
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*currentPage*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 32) set_data_dev(t, /*currentPage*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(409:12) <PaginationLink href=\\\"#/oilCoalNuclearEnergyConsumptionAPI\\\" >",
    		ctx
    	});

    	return block;
    }

    // (408:8) <PaginationItem active>
    function create_default_slot_7(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/oilCoalNuclearEnergyConsumptionAPI",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 2048) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(408:8) <PaginationItem active>",
    		ctx
    	});

    	return block;
    }

    // (413:2) {#if moreData}
    function create_if_block$6(ctx) {
    	let current;

    	const paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 2048) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(413:2) {#if moreData}",
    		ctx
    	});

    	return block;
    }

    // (415:12) <PaginationLink href="#/oilCoalNuclearEnergyConsumptionAPI" on:click="{() => addOffset(1)}">
    function create_default_slot_6(ctx) {
    	let t_value = /*currentPage*/ ctx[5] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 32 && t_value !== (t_value = /*currentPage*/ ctx[5] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(415:12) <PaginationLink href=\\\"#/oilCoalNuclearEnergyConsumptionAPI\\\" on:click=\\\"{() => addOffset(1)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (414:8) <PaginationItem >
    function create_default_slot_5(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/oilCoalNuclearEnergyConsumptionAPI",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[31]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 2048) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(414:8) <PaginationItem >",
    		ctx
    	});

    	return block;
    }

    // (419:8) <PaginationItem class = "{moreData ? '' : 'disabled'}">
    function create_default_slot_4(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				next: true,
    				href: "#/oilCoalNuclearEnergyConsumptionAPI"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_3*/ ctx[32]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(419:8) <PaginationItem class = \\\"{moreData ? '' : 'disabled'}\\\">",
    		ctx
    	});

    	return block;
    }

    // (395:1) <Pagination style="float:right;" ariaLabel="Cambiar de página">
    function create_default_slot_3(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let current;

    	const paginationitem0 = new PaginationItem({
    			props: {
    				class: /*currentPage*/ ctx[5] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*currentPage*/ ctx[5] != 1 && create_if_block_1$2(ctx);

    	const paginationitem1 = new PaginationItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = /*moreData*/ ctx[6] && create_if_block$6(ctx);

    	const paginationitem2 = new PaginationItem({
    			props: {
    				class: /*moreData*/ ctx[6] ? "" : "disabled",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			create_component(paginationitem2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(paginationitem2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*currentPage*/ 32) paginationitem0_changes.class = /*currentPage*/ ctx[5] === 1 ? "disabled" : "";

    			if (dirty[1] & /*$$scope*/ 2048) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (/*currentPage*/ ctx[5] != 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 2048) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);

    			if (/*moreData*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block$6(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const paginationitem2_changes = {};
    			if (dirty[0] & /*moreData*/ 64) paginationitem2_changes.class = /*moreData*/ ctx[6] ? "" : "disabled";

    			if (dirty[1] & /*$$scope*/ 2048) {
    				paginationitem2_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem2.$set(paginationitem2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(paginationitem1.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(paginationitem2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(paginationitem1.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(paginationitem2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(paginationitem2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(395:1) <Pagination style=\\\"float:right;\\\" ariaLabel=\\\"Cambiar de página\\\">",
    		ctx
    	});

    	return block;
    }

    // (426:1) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot_2(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$a, 425, 53, 13098);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(426:1) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    // (427:1) <Button outline color= "warning" on:click = {loadInitialOilEnergy}>
    function create_default_slot_1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Cargar datos Iniciales");
    			attr_dev(i, "class", "fas fa-cloud-upload-alt");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$a, 426, 69, 13224);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(427:1) <Button outline color= \\\"warning\\\" on:click = {loadInitialOilEnergy}>",
    		ctx
    	});

    	return block;
    }

    // (428:1) <Button outline color= "danger" on:click = {deleteOilEnergys}>
    function create_default_slot(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Borrar todo");
    			attr_dev(i, "class", "fa fa-trash");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$a, 427, 64, 13381);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(428:1) <Button outline color= \\\"danger\\\" on:click = {deleteOilEnergys}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let main;
    	let div;
    	let t0;
    	let promise;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 33,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*oilEnergy*/ ctx[7], info);

    	const pagination = new Pagination({
    			props: {
    				style: "float:right;",
    				ariaLabel: "Cambiar de página",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button0 = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", pop);

    	const button1 = new Button({
    			props: {
    				outline: true,
    				color: "warning",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*loadInitialOilEnergy*/ ctx[8]);

    	const button2 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*deleteOilEnergys*/ ctx[11]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			t0 = space();
    			info.block.c();
    			t1 = space();
    			create_component(pagination.$$.fragment);
    			t2 = space();
    			create_component(button0.$$.fragment);
    			t3 = space();
    			create_component(button1.$$.fragment);
    			t4 = space();
    			create_component(button2.$$.fragment);
    			attr_dev(div, "role", "alert");
    			attr_dev(div, "id", "div_alert");
    			set_style(div, "display", "none");
    			add_location(div, file$a, 315, 1, 9104);
    			add_location(main, file$a, 314, 0, 9095);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(main, t0);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t1;
    			append_dev(main, t1);
    			mount_component(pagination, main, null);
    			append_dev(main, t2);
    			mount_component(button0, main, null);
    			append_dev(main, t3);
    			mount_component(button1, main, null);
    			append_dev(main, t4);
    			mount_component(button2, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty[0] & /*oilEnergy*/ 128 && promise !== (promise = /*oilEnergy*/ ctx[7]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[33] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			const pagination_changes = {};

    			if (dirty[0] & /*moreData, currentPage*/ 96 | dirty[1] & /*$$scope*/ 2048) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 2048) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(pagination.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(pagination.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(pagination);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_API_URL = "/api/v2/oil-coal-nuclear-energy-consumption-stats";

    function insertAlert() {
    	clearAlert();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = " alert alert dismissible in alert-success ";
    	alert_element.innerHTML = "<strong>¡Dato insertado!</strong> El dato ha sido insertado correctamente!";

    	setTimeout(
    		() => {
    			clearAlert();
    		},
    		3000
    	);
    }

    function deleteAlert() {
    	clearAlert();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = " alert alert dismissible in alert-danger ";
    	alert_element.innerHTML = "<strong>¡Dato borrado!</strong> El dato ha sido borrado correctamente!";

    	setTimeout(
    		() => {
    			clearAlert();
    		},
    		3000
    	);
    }

    function deleteAllAlert() {
    	clearAlert();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = " alert alert dismissible in alert-danger ";
    	alert_element.innerHTML = "<strong>¡Datos borrados!</strong> Todos los datos han sido borrados correctamente!";

    	setTimeout(
    		() => {
    			clearAlert();
    		},
    		3000
    	);
    }

    function initialDataAlert() {
    	clearAlert();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = " alert alert dismissible in alert-warning ";
    	alert_element.innerHTML = "<strong>Datos iniciales!</strong> ¡ Se han generado los datos iniciales !";

    	setTimeout(
    		() => {
    			clearAlert();
    		},
    		3000
    	);
    }

    function clearAlert() {
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "display: none; ";
    	alert_element.className = "alert alert-dismissible in";
    	alert_element.innerHTML = "";
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let oilEnergy = [];

    	let newOilEnergy = {
    		"country": "",
    		"year": "",
    		"oil-consumption": 0,
    		"coal-consumption": 0,
    		"nuclear-energy-consumption": 0
    	};

    	/* Select variables */
    	let countries = [];

    	let years = [];
    	let currentCountry = "-";
    	let currentYear = "-";
    	let numberElementsPages = 10;
    	let pages = [1];
    	let currentPage = 1;
    	let offset = 0;
    	let moreData = true;

    	onMount(() => {
    		getOilEnergy(currentCountry, currentYear);
    	});

    	onMount(getCountriesYears);

    	async function getCountriesYears() {
    		const res = await fetch(BASE_API_URL);

    		/* Getting the countries for the select */
    		if (res.ok) {
    			const json = await res.json();

    			$$invalidate(1, countries = json.map(d => {
    				return d.country;
    			}));

    			/* Deleting duplicated countries */
    			$$invalidate(1, countries = Array.from(new Set(countries)));

    			/* Getting the years for the select */
    			$$invalidate(2, years = json.map(d => {
    				return d.year;
    			}));

    			/* Deleting duplicated years */
    			$$invalidate(2, years = Array.from(new Set(years)));

    			console.log("Counted " + countries.length + "countries and " + years.length + "years.");
    		} else {
    			errorAlert = "Error interno al intentar obtener las ciudades y los años";
    			console.log("ERROR!");
    		}
    	}

    	async function getOilEnergy(country, year) {
    		console.log("Fetching oil scoal stats...");

    		/* Checking if it fields is empty */
    		var url = BASE_API_URL + "?limit=" + numberElementsPages;

    		if (country != "-" && year != "-") {
    			url = url + "&country=" + country + "&year=" + year;
    		} else if (country != "-" && year == "-") {
    			url = url + "&country=" + country;
    		} else if (country == "-" && year != "-") {
    			url = url + "&year=" + year;
    		}

    		const res = await fetch(url + "&offset=" + numberElementsPages * offset);

    		/* Asking for the following data */
    		const next = await fetch(url + "&offset=" + numberElementsPages * (offset + 1));

    		if (res.ok && next.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			const jsonNext = await next.json();
    			$$invalidate(7, oilEnergy = json);

    			/* Checking if we have run out of elements */
    			if (jsonNext.length == 0) {
    				$$invalidate(6, moreData = false);
    			} else {
    				$$invalidate(6, moreData = true);
    			}

    			console.log("Received " + oilEnergy.length + " oil coal stats.");
    		} else {
    			errorAlert = "Error interno al intentar obtener todos los elementos";
    			console.log("ERROR!");
    		}
    	}

    	async function loadInitialOilEnergy() {
    		console.log("Loading initial oil scoal stats data...");
    		deleteOilEnergys();

    		const res = await fetch(BASE_API_URL + "/loadInitialData").then(function (res) {
    			if (res.ok) {
    				/* putting the current year and the country to remove the search*/
    				console.log("OK");

    				$$invalidate(4, currentYear = "-");
    				$$invalidate(3, currentCountry = "-");
    				getOilEnergy(currentCountry, currentYear);
    				getCountriesYears();
    				initialDataAlert();
    			} else {
    				errorAlert = "Error al intentar borrar todos los elementos iniciales";
    				console.log("ERROR!");
    			}
    		});
    	}

    	async function checkData(data) {
    		const res = await fetch(BASE_API_URL);
    		let theDataExist = false;

    		/* Getting the countries for the select */
    		if (res.ok) {
    			const json = await res.json();

    			let numberRepeatedData = json.filter(d => {
    				return d.year == data.year && d.country == d.country;
    			}).length;

    			if (numberRepeatedData >= 1) {
    				theDataExist = true;
    			}
    		} else {
    			errorAlert = "Error interno al intentar obtener repetidos";
    			console.log("ERROR!");
    		}

    		return theDataExist;
    	}

    	async function insertOilEnergy() {
    		console.log("Inserting oil coal consumption...");
    		const isRepeated = await checkData(newOilEnergy);

    		if (newOilEnergy.country == "" || newOilEnergy.country == null || newOilEnergy.year == "" || newOilEnergy.year == null) {
    			alert("Es obligatorio el campo País y año");
    		} else if (isRepeated) {
    			alert("¡Ya existe!");
    		} else {
    			const res = await fetch(BASE_API_URL, {
    				method: "POST",
    				body: JSON.stringify(newOilEnergy),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				/* we can update it each time we insert*/
    				if (res.ok) {
    					getOilEnergy(currentCountry, currentYear);
    					insertAlert();
    				} else {
    					errorAlert("No se han podido insetar los elementos");
    				}
    			});
    		}

    		
    	}

    	async function deleteOilEnergy(country, year) {
    		console.log("Deleting oil coal consumption...");

    		const res = await fetch(BASE_API_URL + "/" + country + "/" + year, { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				getOilEnergy(currentCountry, currentYear);
    				deleteAlert();
    			} else if (res.status == 404) {
    				errorAlert("Se ha intentado borrar un dato inexistente");
    			} else {
    				errorAlert("Error interno al intentar borrar un elemento concreto");
    			}
    		});
    	}

    	async function deleteOilEnergys() {
    		console.log("Deleting oil coal consumptions...");

    		const res = await fetch(BASE_API_URL + "/", { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				setOffset(0);
    				$$invalidate(3, currentCountry = "-");
    				$$invalidate(4, currentYear = "-");
    				getOilEnergy(currentCountry, currentYear);
    				getCountriesYears();
    				deleteAllAlert();
    			} else {
    				errorAlert = "Error al intentar borrar todos los elementos";
    			}
    		});
    	}

    	function search(currentCountry, currentYear) {
    		setOffset(0);
    		getOilEnergy(currentCountry, currentYear);
    	}

    	function setOffset(newOffset) {
    		offset = newOffset;
    		$$invalidate(5, currentPage = newOffset + 1);
    		getOilEnergy(currentCountry, currentYear);
    	}

    	function addOffset(increment) {
    		offset += increment;
    		$$invalidate(5, currentPage += increment);
    		getOilEnergy(currentCountry, currentYear);
    	}

    	function errorAlert(error) {
    		clearAlert();
    		var alert_element = document.getElementById("div_alert");
    		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    		alert_element.className = " alert alert dismissible in alert-danger ";
    		alert_element.innerHTML = "<strong>¡ERROR!</strong> ¡Ha ocurrido un error!" + error;

    		setTimeout(
    			() => {
    				clearAlert();
    			},
    			3000
    		);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<PrimaryEnergyTable> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("PrimaryEnergyTable", $$slots, []);

    	function input_value_binding(value) {
    		currentCountry = value;
    		$$invalidate(3, currentCountry);
    	}

    	function input_value_binding_1(value) {
    		currentYear = value;
    		$$invalidate(4, currentYear);
    	}

    	function input0_value_binding(value) {
    		newOilEnergy.country = value;
    		$$invalidate(0, newOilEnergy);
    	}

    	function input1_value_binding(value) {
    		newOilEnergy.year = value;
    		$$invalidate(0, newOilEnergy);
    	}

    	function input2_value_binding(value) {
    		newOilEnergy["oil-consumption"] = value;
    		$$invalidate(0, newOilEnergy);
    	}

    	function input3_value_binding(value) {
    		newOilEnergy["coal-consumption"] = value;
    		$$invalidate(0, newOilEnergy);
    	}

    	function input4_value_binding(value) {
    		newOilEnergy["nuclear-energy-consumption"] = value;
    		$$invalidate(0, newOilEnergy);
    	}

    	const click_handler = () => addOffset(-1);
    	const click_handler_1 = () => addOffset(-1);
    	const click_handler_2 = () => addOffset(1);
    	const click_handler_3 = () => addOffset(1);

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		Input,
    		Label,
    		FormGroup,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		pop,
    		BASE_API_URL,
    		oilEnergy,
    		newOilEnergy,
    		countries,
    		years,
    		currentCountry,
    		currentYear,
    		numberElementsPages,
    		pages,
    		currentPage,
    		offset,
    		moreData,
    		getCountriesYears,
    		getOilEnergy,
    		loadInitialOilEnergy,
    		checkData,
    		insertOilEnergy,
    		deleteOilEnergy,
    		deleteOilEnergys,
    		search,
    		setOffset,
    		addOffset,
    		insertAlert,
    		deleteAlert,
    		deleteAllAlert,
    		initialDataAlert,
    		errorAlert,
    		clearAlert
    	});

    	$$self.$inject_state = $$props => {
    		if ("oilEnergy" in $$props) $$invalidate(7, oilEnergy = $$props.oilEnergy);
    		if ("newOilEnergy" in $$props) $$invalidate(0, newOilEnergy = $$props.newOilEnergy);
    		if ("countries" in $$props) $$invalidate(1, countries = $$props.countries);
    		if ("years" in $$props) $$invalidate(2, years = $$props.years);
    		if ("currentCountry" in $$props) $$invalidate(3, currentCountry = $$props.currentCountry);
    		if ("currentYear" in $$props) $$invalidate(4, currentYear = $$props.currentYear);
    		if ("numberElementsPages" in $$props) numberElementsPages = $$props.numberElementsPages;
    		if ("pages" in $$props) pages = $$props.pages;
    		if ("currentPage" in $$props) $$invalidate(5, currentPage = $$props.currentPage);
    		if ("offset" in $$props) offset = $$props.offset;
    		if ("moreData" in $$props) $$invalidate(6, moreData = $$props.moreData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		newOilEnergy,
    		countries,
    		years,
    		currentCountry,
    		currentYear,
    		currentPage,
    		moreData,
    		oilEnergy,
    		loadInitialOilEnergy,
    		insertOilEnergy,
    		deleteOilEnergy,
    		deleteOilEnergys,
    		search,
    		addOffset,
    		offset,
    		errorAlert,
    		numberElementsPages,
    		pages,
    		getCountriesYears,
    		getOilEnergy,
    		checkData,
    		setOffset,
    		input_value_binding,
    		input_value_binding_1,
    		input0_value_binding,
    		input1_value_binding,
    		input2_value_binding,
    		input3_value_binding,
    		input4_value_binding,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class PrimaryEnergyTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PrimaryEnergyTable",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\front\oilCoalNuclearEnergyConsumptionAPI\App.svelte generated by Svelte v3.20.1 */
    const file$b = "src\\front\\oilCoalNuclearEnergyConsumptionAPI\\App.svelte";

    function create_fragment$c(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let current;
    	const primaryenergytable = new PrimaryEnergyTable({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Administrador de datos de energías primarias";
    			t1 = space();
    			create_component(primaryenergytable.$$.fragment);
    			attr_dev(h1, "class", "display-4");
    			set_style(h1, "text-align", "center");
    			add_location(h1, file$b, 5, 1, 96);
    			add_location(main, file$b, 4, 0, 87);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			mount_component(primaryenergytable, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(primaryenergytable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(primaryenergytable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(primaryenergytable);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ PrimaryEnergyTable });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\front\plugInVehiclesAPI\PlugInVehiclesTable.svelte generated by Svelte v3.20.1 */

    const { console: console_1$3 } = globals;
    const file$c = "src\\front\\plugInVehiclesAPI\\PlugInVehiclesTable.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    // (334:2) <Label for="selectCountry">
    function create_default_slot_21$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Búsqueda por país");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21$1.name,
    		type: "slot",
    		source: "(334:2) <Label for=\\\"selectCountry\\\">",
    		ctx
    	});

    	return block;
    }

    // (340:3) {:else}
    function create_else_block_1$2(ctx) {
    	let option;
    	let t_value = /*country*/ ctx[36] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*country*/ ctx[36];
    			option.value = option.__value;
    			add_location(option, file$c, 340, 3, 10111);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*countries*/ 2 && t_value !== (t_value = /*country*/ ctx[36] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*countries*/ 2 && option_value_value !== (option_value_value = /*country*/ ctx[36])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(340:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (338:3) {#if country == currentCountry}
    function create_if_block_3$3(ctx) {
    	let option;
    	let t_value = /*country*/ ctx[36] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.selected = "selected";
    			option.__value = option_value_value = /*country*/ ctx[36];
    			option.value = option.__value;
    			add_location(option, file$c, 338, 3, 10048);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*countries*/ 2 && t_value !== (t_value = /*country*/ ctx[36] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*countries*/ 2 && option_value_value !== (option_value_value = /*country*/ ctx[36])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(338:3) {#if country == currentCountry}",
    		ctx
    	});

    	return block;
    }

    // (336:3) {#each countries as country}
    function create_each_block_2$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*country*/ ctx[36] == /*currentCountry*/ ctx[3]) return create_if_block_3$3;
    		return create_else_block_1$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(336:3) {#each countries as country}",
    		ctx
    	});

    	return block;
    }

    // (335:2) <Input type="select" name="selectCountry" id="selectCountry" bind:value="{currentCountry}">
    function create_default_slot_20$1(ctx) {
    	let t0;
    	let option;
    	let each_value_2 = /*countries*/ ctx[1];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			option = element("option");
    			option.textContent = "-";
    			option.__value = "-";
    			option.value = option.__value;
    			add_location(option, file$c, 343, 3, 10164);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, option, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*countries, currentCountry*/ 10) {
    				each_value_2 = /*countries*/ ctx[1];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20$1.name,
    		type: "slot",
    		source: "(335:2) <Input type=\\\"select\\\" name=\\\"selectCountry\\\" id=\\\"selectCountry\\\" bind:value=\\\"{currentCountry}\\\">",
    		ctx
    	});

    	return block;
    }

    // (333:1) <FormGroup>
    function create_default_slot_19$1(ctx) {
    	let t;
    	let updating_value;
    	let current;

    	const label = new Label({
    			props: {
    				for: "selectCountry",
    				$$slots: { default: [create_default_slot_21$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function input_value_binding(value) {
    		/*input_value_binding*/ ctx[20].call(null, value);
    	}

    	let input_props = {
    		type: "select",
    		name: "selectCountry",
    		id: "selectCountry",
    		$$slots: { default: [create_default_slot_20$1] },
    		$$scope: { ctx }
    	};

    	if (/*currentCountry*/ ctx[3] !== void 0) {
    		input_props.value = /*currentCountry*/ ctx[3];
    	}

    	const input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "value", input_value_binding));

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    			t = space();
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    			const input_changes = {};

    			if (dirty[0] & /*countries, currentCountry*/ 10 | dirty[1] & /*$$scope*/ 256) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*currentCountry*/ 8) {
    				updating_value = true;
    				input_changes.value = /*currentCountry*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19$1.name,
    		type: "slot",
    		source: "(333:1) <FormGroup>",
    		ctx
    	});

    	return block;
    }

    // (349:2) <Label for="selectYear">
    function create_default_slot_18$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Búsqueda por años");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18$1.name,
    		type: "slot",
    		source: "(349:2) <Label for=\\\"selectYear\\\">",
    		ctx
    	});

    	return block;
    }

    // (355:3) {:else}
    function create_else_block$7(ctx) {
    	let option;
    	let t_value = /*year*/ ctx[33] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*year*/ ctx[33];
    			option.value = option.__value;
    			add_location(option, file$c, 355, 3, 10564);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*years*/ 4 && t_value !== (t_value = /*year*/ ctx[33] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*years*/ 4 && option_value_value !== (option_value_value = /*year*/ ctx[33])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(355:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (353:3) {#if year == currentYear}
    function create_if_block_2$3(ctx) {
    	let option;
    	let t_value = /*year*/ ctx[33] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.selected = "selected";
    			option.__value = option_value_value = /*year*/ ctx[33];
    			option.value = option.__value;
    			add_location(option, file$c, 353, 3, 10504);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*years*/ 4 && t_value !== (t_value = /*year*/ ctx[33] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*years*/ 4 && option_value_value !== (option_value_value = /*year*/ ctx[33])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(353:3) {#if year == currentYear}",
    		ctx
    	});

    	return block;
    }

    // (351:3) {#each years as year}
    function create_each_block_1$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*year*/ ctx[33] == /*currentYear*/ ctx[4]) return create_if_block_2$3;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(351:3) {#each years as year}",
    		ctx
    	});

    	return block;
    }

    // (350:2) <Input type="select" name="selectYear" id="selectYear" bind:value="{currentYear}">
    function create_default_slot_17$1(ctx) {
    	let t0;
    	let option;
    	let each_value_1 = /*years*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			option = element("option");
    			option.textContent = "-";
    			option.__value = "-";
    			option.value = option.__value;
    			add_location(option, file$c, 358, 3, 10614);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, option, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*years, currentYear*/ 20) {
    				each_value_1 = /*years*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$1.name,
    		type: "slot",
    		source: "(350:2) <Input type=\\\"select\\\" name=\\\"selectYear\\\" id=\\\"selectYear\\\" bind:value=\\\"{currentYear}\\\">",
    		ctx
    	});

    	return block;
    }

    // (348:1) <FormGroup>
    function create_default_slot_16$1(ctx) {
    	let t;
    	let updating_value;
    	let current;

    	const label = new Label({
    			props: {
    				for: "selectYear",
    				$$slots: { default: [create_default_slot_18$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function input_value_binding_1(value) {
    		/*input_value_binding_1*/ ctx[21].call(null, value);
    	}

    	let input_props = {
    		type: "select",
    		name: "selectYear",
    		id: "selectYear",
    		$$slots: { default: [create_default_slot_17$1] },
    		$$scope: { ctx }
    	};

    	if (/*currentYear*/ ctx[4] !== void 0) {
    		input_props.value = /*currentYear*/ ctx[4];
    	}

    	const input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "value", input_value_binding_1));

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    			t = space();
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    			const input_changes = {};

    			if (dirty[0] & /*years, currentYear*/ 20 | dirty[1] & /*$$scope*/ 256) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*currentYear*/ 16) {
    				updating_value = true;
    				input_changes.value = /*currentYear*/ ctx[4];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$1.name,
    		type: "slot",
    		source: "(348:1) <FormGroup>",
    		ctx
    	});

    	return block;
    }

    // (363:1) <Button outline color="secondary" on:click="{search(currentCountry, currentYear)}" class="button-search">
    function create_default_slot_15$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Buscar");
    			attr_dev(i, "class", "fas fa-search");
    			add_location(i, file$c, 362, 108, 10771);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$1.name,
    		type: "slot",
    		source: "(363:1) <Button outline color=\\\"secondary\\\" on:click=\\\"{search(currentCountry, currentYear)}\\\" class=\\\"button-search\\\">",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     import {     onMount    }
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>     import {     onMount    }",
    		ctx
    	});

    	return block;
    }

    // (368:1) {:then pluginVehicles}
    function create_then_block$1(ctx) {
    	let current;

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_12$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty[0] & /*pluginVehicles, newPluginVehicles*/ 129 | dirty[1] & /*$$scope*/ 256) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(368:1) {:then pluginVehicles}",
    		ctx
    	});

    	return block;
    }

    // (388:10) <Button outline color="primary" on:click={insertPluginVehicles}>
    function create_default_slot_14$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Insertar");
    			attr_dev(i, "class", "far fa-edit");
    			add_location(i, file$c, 387, 75, 11738);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$1.name,
    		type: "slot",
    		source: "(388:10) <Button outline color=\\\"primary\\\" on:click={insertPluginVehicles}>",
    		ctx
    	});

    	return block;
    }

    // (401:10) <Button outline color="danger" on:click="{deletePluginVehicles(pluginVehicles.country, pluginVehicles.year)}">
    function create_default_slot_13$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Borrar");
    			attr_dev(i, "class", "fa fa-trash");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$c, 400, 121, 12323);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13$1.name,
    		type: "slot",
    		source: "(401:10) <Button outline color=\\\"danger\\\" on:click=\\\"{deletePluginVehicles(pluginVehicles.country, pluginVehicles.year)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (390:4) {#each pluginVehicles as pluginVehicles}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*pluginVehicles*/ ctx[7].country + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*pluginVehicles*/ ctx[7].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*pluginVehicles*/ ctx[7]["pev-stock"] + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*pluginVehicles*/ ctx[7]["annual-sale"] + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*pluginVehicles*/ ctx[7]["cars-per-1000"] + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_13$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*deletePluginVehicles*/ ctx[10](/*pluginVehicles*/ ctx[7].country, /*pluginVehicles*/ ctx[7].year))) /*deletePluginVehicles*/ ctx[10](/*pluginVehicles*/ ctx[7].country, /*pluginVehicles*/ ctx[7].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t10 = space();
    			attr_dev(a, "href", a_href_value = "#/plugin-vehicles-stats/" + /*pluginVehicles*/ ctx[7].country + "/" + /*pluginVehicles*/ ctx[7].year);
    			add_location(a, file$c, 392, 7, 11877);
    			add_location(td0, file$c, 391, 6, 11864);
    			add_location(td1, file$c, 396, 6, 12026);
    			add_location(td2, file$c, 397, 6, 12064);
    			add_location(td3, file$c, 398, 6, 12110);
    			add_location(td4, file$c, 399, 6, 12158);
    			add_location(td5, file$c, 400, 6, 12208);
    			add_location(tr, file$c, 390, 5, 11852);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button, td5, null);
    			append_dev(tr, t10);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*pluginVehicles*/ 128) && t0_value !== (t0_value = /*pluginVehicles*/ ctx[7].country + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*pluginVehicles*/ 128 && a_href_value !== (a_href_value = "#/plugin-vehicles-stats/" + /*pluginVehicles*/ ctx[7].country + "/" + /*pluginVehicles*/ ctx[7].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty[0] & /*pluginVehicles*/ 128) && t2_value !== (t2_value = /*pluginVehicles*/ ctx[7].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*pluginVehicles*/ 128) && t4_value !== (t4_value = /*pluginVehicles*/ ctx[7]["pev-stock"] + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*pluginVehicles*/ 128) && t6_value !== (t6_value = /*pluginVehicles*/ ctx[7]["annual-sale"] + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*pluginVehicles*/ 128) && t8_value !== (t8_value = /*pluginVehicles*/ ctx[7]["cars-per-1000"] + "")) set_data_dev(t8, t8_value);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(390:4) {#each pluginVehicles as pluginVehicles}",
    		ctx
    	});

    	return block;
    }

    // (370:2) <Table bordered>
    function create_default_slot_12$1(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let updating_value;
    	let t12;
    	let td1;
    	let updating_value_1;
    	let t13;
    	let td2;
    	let updating_value_2;
    	let t14;
    	let td3;
    	let updating_value_3;
    	let t15;
    	let td4;
    	let updating_value_4;
    	let t16;
    	let td5;
    	let t17;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[22].call(null, value);
    	}

    	let input0_props = { placeholder: "Ej. Spain" };

    	if (/*newPluginVehicles*/ ctx[0].country !== void 0) {
    		input0_props.value = /*newPluginVehicles*/ ctx[0].country;
    	}

    	const input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[23].call(null, value);
    	}

    	let input1_props = { placeholder: "Ej. 2020", type: "number" };

    	if (/*newPluginVehicles*/ ctx[0].year !== void 0) {
    		input1_props.value = /*newPluginVehicles*/ ctx[0].year;
    	}

    	const input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding));

    	function input2_value_binding(value) {
    		/*input2_value_binding*/ ctx[24].call(null, value);
    	}

    	let input2_props = { type: "number" };

    	if (/*newPluginVehicles*/ ctx[0]["pev-stock"] !== void 0) {
    		input2_props.value = /*newPluginVehicles*/ ctx[0]["pev-stock"];
    	}

    	const input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, "value", input2_value_binding));

    	function input3_value_binding(value) {
    		/*input3_value_binding*/ ctx[25].call(null, value);
    	}

    	let input3_props = { type: "number" };

    	if (/*newPluginVehicles*/ ctx[0]["annual-sale"] !== void 0) {
    		input3_props.value = /*newPluginVehicles*/ ctx[0]["annual-sale"];
    	}

    	const input3 = new Input({ props: input3_props, $$inline: true });
    	binding_callbacks.push(() => bind(input3, "value", input3_value_binding));

    	function input4_value_binding(value) {
    		/*input4_value_binding*/ ctx[26].call(null, value);
    	}

    	let input4_props = {
    		type: "number",
    		placeholder: "0.0",
    		step: "0.01",
    		min: "0"
    	};

    	if (/*newPluginVehicles*/ ctx[0]["cars-per-1000"] !== void 0) {
    		input4_props.value = /*newPluginVehicles*/ ctx[0]["cars-per-1000"];
    	}

    	const input4 = new Input({ props: input4_props, $$inline: true });
    	binding_callbacks.push(() => bind(input4, "value", input4_value_binding));

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_14$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertPluginVehicles*/ ctx[9]);
    	let each_value = /*pluginVehicles*/ ctx[7];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Ventas acumuladas";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Ventas anuales";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Porcentaje de coches cada 1000 personas";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			create_component(input0.$$.fragment);
    			t12 = space();
    			td1 = element("td");
    			create_component(input1.$$.fragment);
    			t13 = space();
    			td2 = element("td");
    			create_component(input2.$$.fragment);
    			t14 = space();
    			td3 = element("td");
    			create_component(input3.$$.fragment);
    			t15 = space();
    			td4 = element("td");
    			create_component(input4.$$.fragment);
    			t16 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t17 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$c, 372, 5, 10952);
    			add_location(th1, file$c, 373, 5, 10972);
    			add_location(th2, file$c, 374, 5, 10991);
    			add_location(th3, file$c, 375, 5, 11024);
    			add_location(th4, file$c, 376, 5, 11054);
    			add_location(th5, file$c, 377, 5, 11109);
    			add_location(tr0, file$c, 371, 4, 10941);
    			add_location(thead, file$c, 370, 3, 10928);
    			add_location(td0, file$c, 382, 5, 11179);
    			add_location(td1, file$c, 383, 5, 11269);
    			add_location(td2, file$c, 384, 5, 11369);
    			add_location(td3, file$c, 385, 5, 11454);
    			add_location(td4, file$c, 386, 5, 11541);
    			add_location(td5, file$c, 387, 5, 11668);
    			add_location(tr1, file$c, 381, 4, 11168);
    			add_location(tbody, file$c, 380, 3, 11155);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			mount_component(input0, td0, null);
    			append_dev(tr1, t12);
    			append_dev(tr1, td1);
    			mount_component(input1, td1, null);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			mount_component(input2, td2, null);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			mount_component(input3, td3, null);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			mount_component(input4, td4, null);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			append_dev(tbody, t17);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input0_changes = {};

    			if (!updating_value && dirty[0] & /*newPluginVehicles*/ 1) {
    				updating_value = true;
    				input0_changes.value = /*newPluginVehicles*/ ctx[0].country;
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty[0] & /*newPluginVehicles*/ 1) {
    				updating_value_1 = true;
    				input1_changes.value = /*newPluginVehicles*/ ctx[0].year;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};

    			if (!updating_value_2 && dirty[0] & /*newPluginVehicles*/ 1) {
    				updating_value_2 = true;
    				input2_changes.value = /*newPluginVehicles*/ ctx[0]["pev-stock"];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			input2.$set(input2_changes);
    			const input3_changes = {};

    			if (!updating_value_3 && dirty[0] & /*newPluginVehicles*/ 1) {
    				updating_value_3 = true;
    				input3_changes.value = /*newPluginVehicles*/ ctx[0]["annual-sale"];
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			input3.$set(input3_changes);
    			const input4_changes = {};

    			if (!updating_value_4 && dirty[0] & /*newPluginVehicles*/ 1) {
    				updating_value_4 = true;
    				input4_changes.value = /*newPluginVehicles*/ ctx[0]["cars-per-1000"];
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			input4.$set(input4_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty[0] & /*deletePluginVehicles, pluginVehicles*/ 1152) {
    				each_value = /*pluginVehicles*/ ctx[7];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(input3.$$.fragment, local);
    			transition_in(input4.$$.fragment, local);
    			transition_in(button.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(input3.$$.fragment, local);
    			transition_out(input4.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(input3);
    			destroy_component(input4);
    			destroy_component(button);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$1.name,
    		type: "slot",
    		source: "(370:2) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (366:24)     Loading plugin vehicles...   {:then pluginVehicles}
    function create_pending_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading plugin vehicles...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(366:24)     Loading plugin vehicles...   {:then pluginVehicles}",
    		ctx
    	});

    	return block;
    }

    // (409:8) <PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
    function create_default_slot_11$1(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/plugInVehiclesAPI"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[27]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$1.name,
    		type: "slot",
    		source: "(409:8) <PaginationItem class=\\\"{currentPage === 1 ? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (414:2) {#if currentPage != 1}
    function create_if_block_1$3(ctx) {
    	let current;

    	const paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(414:2) {#if currentPage != 1}",
    		ctx
    	});

    	return block;
    }

    // (416:12) <PaginationLink previous href="#/plugInVehiclesAPI" on:click="{() => addOffset(-1)}">
    function create_default_slot_10$1(ctx) {
    	let t_value = /*currentPage*/ ctx[5] - 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 32 && t_value !== (t_value = /*currentPage*/ ctx[5] - 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(416:12) <PaginationLink previous href=\\\"#/plugInVehiclesAPI\\\" on:click=\\\"{() => addOffset(-1)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (415:8) <PaginationItem>
    function create_default_slot_9$1(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/plugInVehiclesAPI",
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_1*/ ctx[28]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(415:8) <PaginationItem>",
    		ctx
    	});

    	return block;
    }

    // (420:12) <PaginationLink href="#/plugInVehiclesAPI">
    function create_default_slot_8$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*currentPage*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 32) set_data_dev(t, /*currentPage*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(420:12) <PaginationLink href=\\\"#/plugInVehiclesAPI\\\">",
    		ctx
    	});

    	return block;
    }

    // (419:8) <PaginationItem active>
    function create_default_slot_7$1(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/plugInVehiclesAPI",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(419:8) <PaginationItem active>",
    		ctx
    	});

    	return block;
    }

    // (423:2) {#if moreData}
    function create_if_block$7(ctx) {
    	let current;

    	const paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(423:2) {#if moreData}",
    		ctx
    	});

    	return block;
    }

    // (425:12) <PaginationLink previous href="#/plugInVehiclesAPI" on:click="{() => addOffset(1)}">
    function create_default_slot_6$1(ctx) {
    	let t_value = /*currentPage*/ ctx[5] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 32 && t_value !== (t_value = /*currentPage*/ ctx[5] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(425:12) <PaginationLink previous href=\\\"#/plugInVehiclesAPI\\\" on:click=\\\"{() => addOffset(1)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (424:8) <PaginationItem >
    function create_default_slot_5$1(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/plugInVehiclesAPI",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[29]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(424:8) <PaginationItem >",
    		ctx
    	});

    	return block;
    }

    // (429:8) <PaginationItem class="{moreData === true ? '' : 'disabled'}">
    function create_default_slot_4$1(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: { next: true, href: "#/plugInVehiclesAPI" },
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_3*/ ctx[30]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(429:8) <PaginationItem class=\\\"{moreData === true ? '' : 'disabled'}\\\">",
    		ctx
    	});

    	return block;
    }

    // (408:1) <Pagination style="float:right;" ariaLabel="Cambiar de página">
    function create_default_slot_3$1(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let current;

    	const paginationitem0 = new PaginationItem({
    			props: {
    				class: /*currentPage*/ ctx[5] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*currentPage*/ ctx[5] != 1 && create_if_block_1$3(ctx);

    	const paginationitem1 = new PaginationItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = /*moreData*/ ctx[6] && create_if_block$7(ctx);

    	const paginationitem2 = new PaginationItem({
    			props: {
    				class: /*moreData*/ ctx[6] === true ? "" : "disabled",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			create_component(paginationitem2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(paginationitem2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*currentPage*/ 32) paginationitem0_changes.class = /*currentPage*/ ctx[5] === 1 ? "disabled" : "";

    			if (dirty[1] & /*$$scope*/ 256) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (/*currentPage*/ ctx[5] != 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);

    			if (/*moreData*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block$7(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const paginationitem2_changes = {};
    			if (dirty[0] & /*moreData*/ 64) paginationitem2_changes.class = /*moreData*/ ctx[6] === true ? "" : "disabled";

    			if (dirty[1] & /*$$scope*/ 256) {
    				paginationitem2_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem2.$set(paginationitem2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(paginationitem1.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(paginationitem2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(paginationitem1.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(paginationitem2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(paginationitem2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(408:1) <Pagination style=\\\"float:right;\\\" ariaLabel=\\\"Cambiar de página\\\">",
    		ctx
    	});

    	return block;
    }

    // (434:1) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot_2$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$c, 433, 52, 13644);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(434:1) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    // (435:1) <Button outline color="warning" on:click={loadInitialPluginVehicles}>
    function create_default_slot_1$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Cargar datos iniciales");
    			attr_dev(i, "class", "fa fa-cloud-upload-alt");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$c, 434, 71, 13772);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(435:1) <Button outline color=\\\"warning\\\" on:click={loadInitialPluginVehicles}>",
    		ctx
    	});

    	return block;
    }

    // (436:1) <Button outline color="danger" on:click={deletePluginVehiclesAll}>
    function create_default_slot$1(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Borrar todos");
    			attr_dev(i, "class", "fa fa-trash");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$c, 435, 68, 13931);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(436:1) <Button outline color=\\\"danger\\\" on:click={deletePluginVehiclesAll}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let main;
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let promise;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let current;

    	const formgroup0 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_19$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const formgroup1 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_16$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button0 = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				class: "button-search",
    				$$slots: { default: [create_default_slot_15$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", function () {
    		if (is_function(/*search*/ ctx[12](/*currentCountry*/ ctx[3], /*currentYear*/ ctx[4]))) /*search*/ ctx[12](/*currentCountry*/ ctx[3], /*currentYear*/ ctx[4]).apply(this, arguments);
    	});

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 7,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*pluginVehicles*/ ctx[7], info);

    	const pagination = new Pagination({
    			props: {
    				style: "float:right;",
    				ariaLabel: "Cambiar de página",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button1 = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", pop);

    	const button2 = new Button({
    			props: {
    				outline: true,
    				color: "warning",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*loadInitialPluginVehicles*/ ctx[8]);

    	const button3 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*deletePluginVehiclesAll*/ ctx[11]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			t0 = space();
    			create_component(formgroup0.$$.fragment);
    			t1 = space();
    			create_component(formgroup1.$$.fragment);
    			t2 = space();
    			create_component(button0.$$.fragment);
    			t3 = space();
    			info.block.c();
    			t4 = space();
    			create_component(pagination.$$.fragment);
    			t5 = space();
    			create_component(button1.$$.fragment);
    			t6 = space();
    			create_component(button2.$$.fragment);
    			t7 = space();
    			create_component(button3.$$.fragment);
    			attr_dev(div, "role", "alert");
    			attr_dev(div, "id", "div_alert");
    			set_style(div, "display", "none");
    			add_location(div, file$c, 330, 1, 9666);
    			add_location(main, file$c, 328, 0, 9619);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(main, t0);
    			mount_component(formgroup0, main, null);
    			append_dev(main, t1);
    			mount_component(formgroup1, main, null);
    			append_dev(main, t2);
    			mount_component(button0, main, null);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t4;
    			append_dev(main, t4);
    			mount_component(pagination, main, null);
    			append_dev(main, t5);
    			mount_component(button1, main, null);
    			append_dev(main, t6);
    			mount_component(button2, main, null);
    			append_dev(main, t7);
    			mount_component(button3, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const formgroup0_changes = {};

    			if (dirty[0] & /*currentCountry, countries*/ 10 | dirty[1] & /*$$scope*/ 256) {
    				formgroup0_changes.$$scope = { dirty, ctx };
    			}

    			formgroup0.$set(formgroup0_changes);
    			const formgroup1_changes = {};

    			if (dirty[0] & /*currentYear, years*/ 20 | dirty[1] & /*$$scope*/ 256) {
    				formgroup1_changes.$$scope = { dirty, ctx };
    			}

    			formgroup1.$set(formgroup1_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			info.ctx = ctx;

    			if (dirty[0] & /*pluginVehicles*/ 128 && promise !== (promise = /*pluginVehicles*/ ctx[7]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[7] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			const pagination_changes = {};

    			if (dirty[0] & /*moreData, currentPage*/ 96 | dirty[1] & /*$$scope*/ 256) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup0.$$.fragment, local);
    			transition_in(formgroup1.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(info.block);
    			transition_in(pagination.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup0.$$.fragment, local);
    			transition_out(formgroup1.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(pagination.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(formgroup0);
    			destroy_component(formgroup1);
    			destroy_component(button0);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(pagination);
    			destroy_component(button1);
    			destroy_component(button2);
    			destroy_component(button3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_API_URL$1 = "/api/v2/plugin-vehicles-stats";

    async function checkData(data) {
    	const res = await fetch(BASE_API_URL$1);
    	let theDataExist = false;

    	/* Getting the countries for the select */
    	if (res.ok) {
    		const json = await res.json();

    		/* We find the number repeated data */
    		let numberRepeatedData = json.filter(d => {
    			return d.year == data.year && d.country == data.country;
    		}).length;

    		if (numberRepeatedData >= 1) {
    			theDataExist = true;
    		}
    	} else {
    		errorAlert("Error interno al intentar obtener repetidos");
    		console.log("ERROR!");
    	}

    	return theDataExist;
    }

    //These function are for the alerts
    function insertAlert$1() {
    	clearAlert$1();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = " alert alert dismissible in alert-success ";
    	alert_element.innerHTML = "<strong>¡Dato insertado!</strong> El dato ha sido insertado correctamente!";

    	setTimeout(
    		() => {
    			clearAlert$1();
    		},
    		3000
    	);
    }

    function deleteAlert$1() {
    	clearAlert$1();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = " alert alert dismissible in alert-danger ";
    	alert_element.innerHTML = "<strong>¡Dato borrado!</strong> El dato ha sido borrado correctamente!";

    	setTimeout(
    		() => {
    			clearAlert$1();
    		},
    		3000
    	);
    }

    function deleteAllAlert$1() {
    	clearAlert$1();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = " alert alert dismissible in alert-danger ";
    	alert_element.innerHTML = "<strong>¡Datos borrados!</strong> Todos los datos han sido borrados correctamente!";

    	setTimeout(
    		() => {
    			clearAlert$1();
    		},
    		3000
    	);
    }

    function initialDataAlert$1(error) {
    	clearAlert$1();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = " alert alert dismissible in alert-warning ";
    	alert_element.innerHTML = "<strong>¡Datos cargados!</strong> Todos los datos iniciales han sido cargados correctamente!";

    	setTimeout(
    		() => {
    			clearAlert$1();
    		},
    		3000
    	);
    }

    function errorAlert(error) {
    	clearAlert$1();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = " alert alert dismissible in alert-danger ";
    	alert_element.innerHTML = "<strong>¡ERROR!</strong> ¡Ha ocurrido un error! " + error;

    	setTimeout(
    		() => {
    			clearAlert$1();
    		},
    		3000
    	);
    }

    function clearAlert$1() {
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "display: none; ";
    	alert_element.className = "alert alert-dismissible in";
    	alert_element.innerHTML = "";
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let pluginVehicles = [];

    	let newPluginVehicles = {
    		"country": "",
    		"year": "",
    		"pev-stock": 0,
    		"annual-sale": 0,
    		"cars-per-1000": 0
    	};

    	// These variables are for the selects.
    	let countries = [];

    	let years = [];
    	let currentCountry = "-";
    	let currentYear = "-";
    	let numberElementsPages = 10;
    	let pages = [1];
    	let offset = 0;
    	let currentPage = 1; // We could use just one variable offset on currentPage, we leave both
    	let moreData = true;

    	onMount(() => {
    		getPluginVehicles(currentCountry, currentYear);
    	});

    	onMount(getCountriesYears);

    	/* 
    This function get years and countries to put them into the selects.
    	We call it just once in the onMount and each time we need to update the selects,
    	but taking care we are asking for all the data
    */
    	async function getCountriesYears() {
    		const res = await fetch(BASE_API_URL$1);

    		/* Getting the countries for the select */
    		if (res.ok) {
    			const json = await res.json();

    			$$invalidate(1, countries = json.map(d => {
    				return d.country;
    			}));

    			/* Deleting duplicated countries */
    			$$invalidate(1, countries = Array.from(new Set(countries)));

    			/* Getting the years for the select */
    			$$invalidate(2, years = json.map(d => {
    				return d.year;
    			}));

    			/* Deleting duplicated years */
    			$$invalidate(2, years = Array.from(new Set(years)));

    			console.log("Counted " + countries.length + "countries and " + years.length + "years.");
    		} else {
    			errorAlert("Error interno al intentar obtener los paises y años!");
    			console.log("ERROR!");
    		}
    	}

    	async function getPluginVehicles(country, year) {
    		console.log("Fetching plugin vehicles...");

    		/* Checking if the fields are empty */
    		var url = BASE_API_URL$1 + "?limit=" + numberElementsPages;

    		if (country != "-" && year != "-") {
    			url = url + "&country=" + country + "&year=" + year;
    		} else if (country != "-" && year == "-") {
    			url = url + "&country=" + country;
    		} else if (country == "-" && year != "-") {
    			url = url + "&year=" + year;
    		}

    		const res = await fetch(url + "&offset=" + numberElementsPages * offset);

    		// Asking for the following data of pagination
    		const next = await fetch(url + "&offset=" + numberElementsPages * (offset + 1));

    		if (res.ok && next.ok) {
    			console.log("OK:");
    			const json = await res.json();
    			const jsonNext = await next.json();
    			$$invalidate(7, pluginVehicles = json);

    			// checking if we have run out of elements
    			if (jsonNext.length == 0) {
    				$$invalidate(6, moreData = false);
    			} else {
    				$$invalidate(6, moreData = true);
    			}

    			console.log("Received " + pluginVehicles.length + " plugin vehicles.");
    		} else {
    			errorAlert("Error interno al intentar obtener todos los datos!");
    			console.log("ERROR!");
    		}
    	}

    	async function loadInitialPluginVehicles() {
    		console.log("Loading initial plugin vehicles stats...");
    		deletePluginVehiclesAll();

    		const res = await fetch(BASE_API_URL$1 + "/loadInitialData").then(function (res) {
    			if (res.ok) {
    				// Putthin the current year and the country to remove search. 
    				console.log("OK:");

    				$$invalidate(3, currentCountry = "-");
    				$$invalidate(4, currentYear = "-");
    				initialDataAlert$1();
    				getPluginVehicles(currentCountry, currentYear);
    				getCountriesYears();
    			} else {
    				errorAlert("Error interno al intentar obtener todos los datos iniciales!");
    				console.log("ERROR!");
    			}
    		});
    	}

    	async function insertPluginVehicles() {
    		console.log("Inserting plugin vehicles...");
    		const isRepeated = await checkData(newPluginVehicles);

    		if (newPluginVehicles.country == "" || newPluginVehicles.country == null || newPluginVehicles.year == "" || newPluginVehicles.year == null) {
    			alert("Se debe incluir el nombre del país y del año");
    		} else if (isRepeated) {
    			alert("¡Ya existe ese dato en nuestra base de datos!");
    		} else {
    			const res = await fetch(BASE_API_URL$1, {
    				method: "POST",
    				body: JSON.stringify(newPluginVehicles),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				if (res.ok) {
    					insertAlert$1();
    					getPluginVehicles(currentCountry, currentYear);
    				} else {
    					errorAlert("Error interno al intentar insertar un elemento.");
    				}
    			}); /* If we want the select to be update each time we insert, uncoment the line below */ //getCountriesYears();
    		}
    	}

    	async function deletePluginVehicles(country, year) {
    		console.log("Deleting plugin vehicles...");

    		const res = await fetch(BASE_API_URL$1 + "/" + country + "/" + year, { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				deleteAlert$1();
    				getPluginVehicles(currentCountry, currentYear);
    			} else if (res.status == 404) {
    				errorAlert("Se ha intentado borrar un elemento inexistente");
    			} else {
    				errorAlert("Error interno al intentar borrar un elemento concreto");
    			}
    		});
    	}

    	async function deletePluginVehiclesAll() {
    		console.log("Deleting all plugin vehicles...");

    		const res = await fetch(BASE_API_URL$1, { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				// To put the correct number in pagination
    				setOffset(0);

    				$$invalidate(3, currentCountry = "-");
    				$$invalidate(4, currentYear = "-");
    				deleteAllAlert$1();
    				getPluginVehicles(currentCountry, currentYear);
    				getCountriesYears();
    			} else {
    				errorAlert("Error interno al intentar borrar todos los elementos.");
    			}
    		});
    	}

    	function search(currentCountry, currentYear) {
    		setOffset(0);
    		getPluginVehicles(currentCountry, currentYear);
    	}

    	// Pagination always go first page.
    	async function setOffset(newtOffset) {
    		offset = newtOffset;
    		$$invalidate(5, currentPage = newtOffset + 1);
    	}

    	async function addOffset(increment) {
    		offset += increment;
    		$$invalidate(5, currentPage += increment);
    		getPluginVehicles(currentCountry, currentYear);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<PlugInVehiclesTable> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("PlugInVehiclesTable", $$slots, []);

    	function input_value_binding(value) {
    		currentCountry = value;
    		$$invalidate(3, currentCountry);
    	}

    	function input_value_binding_1(value) {
    		currentYear = value;
    		$$invalidate(4, currentYear);
    	}

    	function input0_value_binding(value) {
    		newPluginVehicles.country = value;
    		$$invalidate(0, newPluginVehicles);
    	}

    	function input1_value_binding(value) {
    		newPluginVehicles.year = value;
    		$$invalidate(0, newPluginVehicles);
    	}

    	function input2_value_binding(value) {
    		newPluginVehicles["pev-stock"] = value;
    		$$invalidate(0, newPluginVehicles);
    	}

    	function input3_value_binding(value) {
    		newPluginVehicles["annual-sale"] = value;
    		$$invalidate(0, newPluginVehicles);
    	}

    	function input4_value_binding(value) {
    		newPluginVehicles["cars-per-1000"] = value;
    		$$invalidate(0, newPluginVehicles);
    	}

    	const click_handler = () => addOffset(-1);
    	const click_handler_1 = () => addOffset(-1);
    	const click_handler_2 = () => addOffset(1);
    	const click_handler_3 = () => addOffset(1);

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		Table,
    		Button,
    		Input,
    		Label,
    		Form,
    		FormGroup,
    		BASE_API_URL: BASE_API_URL$1,
    		pluginVehicles,
    		newPluginVehicles,
    		countries,
    		years,
    		currentCountry,
    		currentYear,
    		numberElementsPages,
    		pages,
    		offset,
    		currentPage,
    		moreData,
    		getCountriesYears,
    		getPluginVehicles,
    		loadInitialPluginVehicles,
    		checkData,
    		insertPluginVehicles,
    		deletePluginVehicles,
    		deletePluginVehiclesAll,
    		search,
    		setOffset,
    		addOffset,
    		insertAlert: insertAlert$1,
    		deleteAlert: deleteAlert$1,
    		deleteAllAlert: deleteAllAlert$1,
    		initialDataAlert: initialDataAlert$1,
    		errorAlert,
    		clearAlert: clearAlert$1
    	});

    	$$self.$inject_state = $$props => {
    		if ("pluginVehicles" in $$props) $$invalidate(7, pluginVehicles = $$props.pluginVehicles);
    		if ("newPluginVehicles" in $$props) $$invalidate(0, newPluginVehicles = $$props.newPluginVehicles);
    		if ("countries" in $$props) $$invalidate(1, countries = $$props.countries);
    		if ("years" in $$props) $$invalidate(2, years = $$props.years);
    		if ("currentCountry" in $$props) $$invalidate(3, currentCountry = $$props.currentCountry);
    		if ("currentYear" in $$props) $$invalidate(4, currentYear = $$props.currentYear);
    		if ("numberElementsPages" in $$props) numberElementsPages = $$props.numberElementsPages;
    		if ("pages" in $$props) pages = $$props.pages;
    		if ("offset" in $$props) offset = $$props.offset;
    		if ("currentPage" in $$props) $$invalidate(5, currentPage = $$props.currentPage);
    		if ("moreData" in $$props) $$invalidate(6, moreData = $$props.moreData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		newPluginVehicles,
    		countries,
    		years,
    		currentCountry,
    		currentYear,
    		currentPage,
    		moreData,
    		pluginVehicles,
    		loadInitialPluginVehicles,
    		insertPluginVehicles,
    		deletePluginVehicles,
    		deletePluginVehiclesAll,
    		search,
    		addOffset,
    		offset,
    		numberElementsPages,
    		pages,
    		getCountriesYears,
    		getPluginVehicles,
    		setOffset,
    		input_value_binding,
    		input_value_binding_1,
    		input0_value_binding,
    		input1_value_binding,
    		input2_value_binding,
    		input3_value_binding,
    		input4_value_binding,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class PlugInVehiclesTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlugInVehiclesTable",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\front\plugInVehiclesAPI\App.svelte generated by Svelte v3.20.1 */
    const file$d = "src\\front\\plugInVehiclesAPI\\App.svelte";

    function create_fragment$e(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let current;
    	const pluginvehiclestable = new PlugInVehiclesTable({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Administrador de datos de coches eléctricos";
    			t1 = space();
    			create_component(pluginvehiclestable.$$.fragment);
    			attr_dev(h1, "class", "display-4");
    			set_style(h1, "text-align", "center");
    			add_location(h1, file$d, 5, 1, 98);
    			add_location(main, file$d, 4, 0, 89);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			mount_component(pluginvehiclestable, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pluginvehiclestable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pluginvehiclestable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(pluginvehiclestable);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ PlugInVehiclesTable });
    	return [];
    }

    class App$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\front\renewableSourcesAPI\RenewableSourcesTable.svelte generated by Svelte v3.20.1 */

    const { console: console_1$4 } = globals;
    const file$e = "src\\front\\renewableSourcesAPI\\RenewableSourcesTable.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>   import  {    onMount   }
    function create_catch_block$2(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(1:0) <script>   import  {    onMount   }",
    		ctx
    	});

    	return block;
    }

    // (329:1) {:then renewableSources}
    function create_then_block$2(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let current;

    	const formgroup0 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_19$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const formgroup1 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_16$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				class: "button-search",
    				$$slots: { default: [create_default_slot_15$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*search*/ ctx[12](/*currentCountry*/ ctx[3], /*currentYear*/ ctx[4]))) /*search*/ ctx[12](/*currentCountry*/ ctx[3], /*currentYear*/ ctx[4]).apply(this, arguments);
    	});

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_12$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formgroup0.$$.fragment);
    			t0 = space();
    			create_component(formgroup1.$$.fragment);
    			t1 = space();
    			create_component(button.$$.fragment);
    			t2 = space();
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formgroup0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(formgroup1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(button, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const formgroup0_changes = {};

    			if (dirty[0] & /*currentCountry, countries*/ 10 | dirty[1] & /*$$scope*/ 256) {
    				formgroup0_changes.$$scope = { dirty, ctx };
    			}

    			formgroup0.$set(formgroup0_changes);
    			const formgroup1_changes = {};

    			if (dirty[0] & /*currentYear, years*/ 20 | dirty[1] & /*$$scope*/ 256) {
    				formgroup1_changes.$$scope = { dirty, ctx };
    			}

    			formgroup1.$set(formgroup1_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const table_changes = {};

    			if (dirty[0] & /*renewableSources, newRenewableSource*/ 129 | dirty[1] & /*$$scope*/ 256) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formgroup0.$$.fragment, local);
    			transition_in(formgroup1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formgroup0.$$.fragment, local);
    			transition_out(formgroup1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formgroup0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(formgroup1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(button, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(329:1) {:then renewableSources}",
    		ctx
    	});

    	return block;
    }

    // (332:3) <Label for="selectCountry">
    function create_default_slot_21$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Búsqueda por país");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21$2.name,
    		type: "slot",
    		source: "(332:3) <Label for=\\\"selectCountry\\\">",
    		ctx
    	});

    	return block;
    }

    // (339:4) {:else}
    function create_else_block_1$3(ctx) {
    	let option;
    	let t_value = /*country*/ ctx[36] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*country*/ ctx[36];
    			option.value = option.__value;
    			add_location(option, file$e, 339, 4, 10307);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*countries*/ 2 && t_value !== (t_value = /*country*/ ctx[36] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*countries*/ 2 && option_value_value !== (option_value_value = /*country*/ ctx[36])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$3.name,
    		type: "else",
    		source: "(339:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (337:4) {#if country == currentCountry}
    function create_if_block_3$4(ctx) {
    	let option;
    	let t_value = /*country*/ ctx[36] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.selected = "selected";
    			option.__value = option_value_value = /*country*/ ctx[36];
    			option.value = option.__value;
    			add_location(option, file$e, 337, 4, 10242);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*countries*/ 2 && t_value !== (t_value = /*country*/ ctx[36] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*countries*/ 2 && option_value_value !== (option_value_value = /*country*/ ctx[36])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(337:4) {#if country == currentCountry}",
    		ctx
    	});

    	return block;
    }

    // (335:4) {#each countries as country}
    function create_each_block_2$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*country*/ ctx[36] == /*currentCountry*/ ctx[3]) return create_if_block_3$4;
    		return create_else_block_1$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(335:4) {#each countries as country}",
    		ctx
    	});

    	return block;
    }

    // (333:3) <Input type="select" name="selectCountry" id="selectCountry" bind:value="{currentCountry}">
    function create_default_slot_20$2(ctx) {
    	let t0;
    	let option;
    	let each_value_2 = /*countries*/ ctx[1];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			option = element("option");
    			option.textContent = "-";
    			option.__value = "-";
    			option.value = option.__value;
    			add_location(option, file$e, 342, 4, 10363);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, option, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*countries, currentCountry*/ 10) {
    				each_value_2 = /*countries*/ ctx[1];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20$2.name,
    		type: "slot",
    		source: "(333:3) <Input type=\\\"select\\\" name=\\\"selectCountry\\\" id=\\\"selectCountry\\\" bind:value=\\\"{currentCountry}\\\">",
    		ctx
    	});

    	return block;
    }

    // (331:2) <FormGroup>
    function create_default_slot_19$2(ctx) {
    	let t;
    	let updating_value;
    	let current;

    	const label = new Label({
    			props: {
    				for: "selectCountry",
    				$$slots: { default: [create_default_slot_21$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function input_value_binding(value) {
    		/*input_value_binding*/ ctx[19].call(null, value);
    	}

    	let input_props = {
    		type: "select",
    		name: "selectCountry",
    		id: "selectCountry",
    		$$slots: { default: [create_default_slot_20$2] },
    		$$scope: { ctx }
    	};

    	if (/*currentCountry*/ ctx[3] !== void 0) {
    		input_props.value = /*currentCountry*/ ctx[3];
    	}

    	const input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "value", input_value_binding));

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    			t = space();
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    			const input_changes = {};

    			if (dirty[0] & /*countries, currentCountry*/ 10 | dirty[1] & /*$$scope*/ 256) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*currentCountry*/ 8) {
    				updating_value = true;
    				input_changes.value = /*currentCountry*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19$2.name,
    		type: "slot",
    		source: "(331:2) <FormGroup>",
    		ctx
    	});

    	return block;
    }

    // (348:3) <Label for="selectYear">
    function create_default_slot_18$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Año");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18$2.name,
    		type: "slot",
    		source: "(348:3) <Label for=\\\"selectYear\\\">",
    		ctx
    	});

    	return block;
    }

    // (354:4) {:else}
    function create_else_block$8(ctx) {
    	let option;
    	let t_value = /*year*/ ctx[33] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*year*/ ctx[33];
    			option.value = option.__value;
    			add_location(option, file$e, 354, 4, 10764);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*years*/ 4 && t_value !== (t_value = /*year*/ ctx[33] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*years*/ 4 && option_value_value !== (option_value_value = /*year*/ ctx[33])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(354:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (352:4) {#if year == currentYear}
    function create_if_block_2$4(ctx) {
    	let option;
    	let t_value = /*year*/ ctx[33] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.selected = "selected";
    			option.__value = option_value_value = /*year*/ ctx[33];
    			option.value = option.__value;
    			add_location(option, file$e, 352, 4, 10702);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*years*/ 4 && t_value !== (t_value = /*year*/ ctx[33] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*years*/ 4 && option_value_value !== (option_value_value = /*year*/ ctx[33])) {
    				prop_dev(option, "__value", option_value_value);
    			}

    			option.value = option.__value;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(352:4) {#if year == currentYear}",
    		ctx
    	});

    	return block;
    }

    // (350:4) {#each years as year}
    function create_each_block_1$2(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*year*/ ctx[33] == /*currentYear*/ ctx[4]) return create_if_block_2$4;
    		return create_else_block$8;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(350:4) {#each years as year}",
    		ctx
    	});

    	return block;
    }

    // (349:3) <Input type="select"  name="selectYear" id="selectYear" bind:value="{currentYear}">
    function create_default_slot_17$2(ctx) {
    	let t0;
    	let option;
    	let each_value_1 = /*years*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			option = element("option");
    			option.textContent = "-";
    			option.__value = "-";
    			option.value = option.__value;
    			add_location(option, file$e, 357, 4, 10817);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, option, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*years, currentYear*/ 20) {
    				each_value_1 = /*years*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17$2.name,
    		type: "slot",
    		source: "(349:3) <Input type=\\\"select\\\"  name=\\\"selectYear\\\" id=\\\"selectYear\\\" bind:value=\\\"{currentYear}\\\">",
    		ctx
    	});

    	return block;
    }

    // (347:2) <FormGroup>
    function create_default_slot_16$2(ctx) {
    	let t;
    	let updating_value;
    	let current;

    	const label = new Label({
    			props: {
    				for: "selectYear",
    				$$slots: { default: [create_default_slot_18$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function input_value_binding_1(value) {
    		/*input_value_binding_1*/ ctx[20].call(null, value);
    	}

    	let input_props = {
    		type: "select",
    		name: "selectYear",
    		id: "selectYear",
    		$$slots: { default: [create_default_slot_17$2] },
    		$$scope: { ctx }
    	};

    	if (/*currentYear*/ ctx[4] !== void 0) {
    		input_props.value = /*currentYear*/ ctx[4];
    	}

    	const input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "value", input_value_binding_1));

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    			t = space();
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    			const input_changes = {};

    			if (dirty[0] & /*years, currentYear*/ 20 | dirty[1] & /*$$scope*/ 256) {
    				input_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*currentYear*/ 16) {
    				updating_value = true;
    				input_changes.value = /*currentYear*/ ctx[4];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16$2.name,
    		type: "slot",
    		source: "(347:2) <FormGroup>",
    		ctx
    	});

    	return block;
    }

    // (362:2) <Button outline color="secondary" on:click="{search(currentCountry, currentYear)}" class="button-search" >
    function create_default_slot_15$2(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Buscar");
    			attr_dev(i, "class", "fas fa-search");
    			add_location(i, file$e, 361, 109, 10977);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15$2.name,
    		type: "slot",
    		source: "(362:2) <Button outline color=\\\"secondary\\\" on:click=\\\"{search(currentCountry, currentYear)}\\\" class=\\\"button-search\\\" >",
    		ctx
    	});

    	return block;
    }

    // (383:10) <Button outline color="primary" on:click={insertRenewableSources}>
    function create_default_slot_14$2(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Insertar");
    			attr_dev(i, "class", "far fa-edit");
    			add_location(i, file$e, 382, 77, 12072);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14$2.name,
    		type: "slot",
    		source: "(383:10) <Button outline color=\\\"primary\\\" on:click={insertRenewableSources}>",
    		ctx
    	});

    	return block;
    }

    // (396:10) <Button outline color="danger" on:click="{deleteRenewableSource(renewableSource.country, renewableSource.year)}" >
    function create_default_slot_13$2(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Borrar");
    			attr_dev(i, "class", "fa fa-trash");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$e, 395, 125, 12718);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13$2.name,
    		type: "slot",
    		source: "(396:10) <Button outline color=\\\"danger\\\" on:click=\\\"{deleteRenewableSource(renewableSource.country, renewableSource.year)}\\\" >",
    		ctx
    	});

    	return block;
    }

    // (385:4) {#each renewableSources as renewableSource}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let a;
    	let t0_value = /*renewableSource*/ ctx[30].country + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let td1;
    	let t2_value = /*renewableSource*/ ctx[30].year + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*renewableSource*/ ctx[30]["percentage-re-total"] + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*renewableSource*/ ctx[30]["percentage-hydropower-total"] + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*renewableSource*/ ctx[30]["percentage-wind-power-total"] + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot_13$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*deleteRenewableSource*/ ctx[10](/*renewableSource*/ ctx[30].country, /*renewableSource*/ ctx[30].year))) /*deleteRenewableSource*/ ctx[10](/*renewableSource*/ ctx[30].country, /*renewableSource*/ ctx[30].year).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t10 = space();
    			attr_dev(a, "href", a_href_value = "#/renewable-sources-stats/" + /*renewableSource*/ ctx[30].country + "/" + /*renewableSource*/ ctx[30].year);
    			add_location(a, file$e, 387, 6, 12216);
    			add_location(td0, file$e, 386, 5, 12201);
    			add_location(td1, file$e, 391, 5, 12368);
    			add_location(td2, file$e, 392, 5, 12408);
    			add_location(td3, file$e, 393, 5, 12466);
    			add_location(td4, file$e, 394, 5, 12532);
    			add_location(td5, file$e, 395, 5, 12598);
    			add_location(tr, file$e, 385, 4, 12190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, a);
    			append_dev(a, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			mount_component(button, td5, null);
    			append_dev(tr, t10);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*renewableSources*/ 128) && t0_value !== (t0_value = /*renewableSource*/ ctx[30].country + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty[0] & /*renewableSources*/ 128 && a_href_value !== (a_href_value = "#/renewable-sources-stats/" + /*renewableSource*/ ctx[30].country + "/" + /*renewableSource*/ ctx[30].year)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || dirty[0] & /*renewableSources*/ 128) && t2_value !== (t2_value = /*renewableSource*/ ctx[30].year + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*renewableSources*/ 128) && t4_value !== (t4_value = /*renewableSource*/ ctx[30]["percentage-re-total"] + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*renewableSources*/ 128) && t6_value !== (t6_value = /*renewableSource*/ ctx[30]["percentage-hydropower-total"] + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty[0] & /*renewableSources*/ 128) && t8_value !== (t8_value = /*renewableSource*/ ctx[30]["percentage-wind-power-total"] + "")) set_data_dev(t8, t8_value);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(385:4) {#each renewableSources as renewableSource}",
    		ctx
    	});

    	return block;
    }

    // (365:2) <Table bordered>
    function create_default_slot_12$2(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let updating_value;
    	let t12;
    	let td1;
    	let updating_value_1;
    	let t13;
    	let td2;
    	let updating_value_2;
    	let t14;
    	let td3;
    	let updating_value_3;
    	let t15;
    	let td4;
    	let updating_value_4;
    	let t16;
    	let td5;
    	let t17;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[21].call(null, value);
    	}

    	let input0_props = { type: "text", placeholder: "Ej. Spain" };

    	if (/*newRenewableSource*/ ctx[0].country !== void 0) {
    		input0_props.value = /*newRenewableSource*/ ctx[0].country;
    	}

    	const input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[22].call(null, value);
    	}

    	let input1_props = { type: "number", placeholder: "Ej. 2020" };

    	if (/*newRenewableSource*/ ctx[0].year !== void 0) {
    		input1_props.value = /*newRenewableSource*/ ctx[0].year;
    	}

    	const input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding));

    	function input2_value_binding(value) {
    		/*input2_value_binding*/ ctx[23].call(null, value);
    	}

    	let input2_props = {
    		type: "number",
    		placeholder: "0.0",
    		step: "0.01",
    		min: "0"
    	};

    	if (/*newRenewableSource*/ ctx[0]["percentage-re-total"] !== void 0) {
    		input2_props.value = /*newRenewableSource*/ ctx[0]["percentage-re-total"];
    	}

    	const input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, "value", input2_value_binding));

    	function input3_value_binding(value) {
    		/*input3_value_binding*/ ctx[24].call(null, value);
    	}

    	let input3_props = {
    		type: "number",
    		placeholder: "0.0",
    		step: "0.01",
    		min: "0"
    	};

    	if (/*newRenewableSource*/ ctx[0]["percentage-hydropower-total"] !== void 0) {
    		input3_props.value = /*newRenewableSource*/ ctx[0]["percentage-hydropower-total"];
    	}

    	const input3 = new Input({ props: input3_props, $$inline: true });
    	binding_callbacks.push(() => bind(input3, "value", input3_value_binding));

    	function input4_value_binding(value) {
    		/*input4_value_binding*/ ctx[25].call(null, value);
    	}

    	let input4_props = {
    		type: "number",
    		placeholder: "0.0",
    		step: "0.01",
    		min: "0"
    	};

    	if (/*newRenewableSource*/ ctx[0]["percentage-wind-power-total"] !== void 0) {
    		input4_props.value = /*newRenewableSource*/ ctx[0]["percentage-wind-power-total"];
    	}

    	const input4 = new Input({ props: input4_props, $$inline: true });
    	binding_callbacks.push(() => bind(input4, "value", input4_value_binding));

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_14$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*insertRenewableSources*/ ctx[9]);
    	let each_value = /*renewableSources*/ ctx[7];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Porcentaje de uso de energías renovables";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Porcentaje de uso de energías hidroeléctricas";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Porcentaje de uso de energías eólica";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			create_component(input0.$$.fragment);
    			t12 = space();
    			td1 = element("td");
    			create_component(input1.$$.fragment);
    			t13 = space();
    			td2 = element("td");
    			create_component(input2.$$.fragment);
    			t14 = space();
    			td3 = element("td");
    			create_component(input3.$$.fragment);
    			t15 = space();
    			td4 = element("td");
    			create_component(input4.$$.fragment);
    			t16 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			t17 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$e, 367, 5, 11078);
    			add_location(th1, file$e, 368, 5, 11100);
    			add_location(th2, file$e, 369, 5, 11121);
    			add_location(th3, file$e, 370, 5, 11179);
    			add_location(th4, file$e, 371, 5, 11242);
    			add_location(th5, file$e, 372, 5, 11296);
    			add_location(tr0, file$e, 366, 4, 11067);
    			add_location(thead, file$e, 365, 3, 11054);
    			add_location(td0, file$e, 377, 5, 11368);
    			add_location(td1, file$e, 378, 5, 11473);
    			add_location(td2, file$e, 379, 5, 11576);
    			add_location(td3, file$e, 380, 5, 11712);
    			add_location(td4, file$e, 381, 5, 11856);
    			add_location(td5, file$e, 382, 5, 12000);
    			add_location(tr1, file$e, 376, 4, 11357);
    			add_location(tbody, file$e, 375, 3, 11344);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			mount_component(input0, td0, null);
    			append_dev(tr1, t12);
    			append_dev(tr1, td1);
    			mount_component(input1, td1, null);
    			append_dev(tr1, t13);
    			append_dev(tr1, td2);
    			mount_component(input2, td2, null);
    			append_dev(tr1, t14);
    			append_dev(tr1, td3);
    			mount_component(input3, td3, null);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			mount_component(input4, td4, null);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			append_dev(tbody, t17);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input0_changes = {};

    			if (!updating_value && dirty[0] & /*newRenewableSource*/ 1) {
    				updating_value = true;
    				input0_changes.value = /*newRenewableSource*/ ctx[0].country;
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty[0] & /*newRenewableSource*/ 1) {
    				updating_value_1 = true;
    				input1_changes.value = /*newRenewableSource*/ ctx[0].year;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};

    			if (!updating_value_2 && dirty[0] & /*newRenewableSource*/ 1) {
    				updating_value_2 = true;
    				input2_changes.value = /*newRenewableSource*/ ctx[0]["percentage-re-total"];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			input2.$set(input2_changes);
    			const input3_changes = {};

    			if (!updating_value_3 && dirty[0] & /*newRenewableSource*/ 1) {
    				updating_value_3 = true;
    				input3_changes.value = /*newRenewableSource*/ ctx[0]["percentage-hydropower-total"];
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			input3.$set(input3_changes);
    			const input4_changes = {};

    			if (!updating_value_4 && dirty[0] & /*newRenewableSource*/ 1) {
    				updating_value_4 = true;
    				input4_changes.value = /*newRenewableSource*/ ctx[0]["percentage-wind-power-total"];
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			input4.$set(input4_changes);
    			const button_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty[0] & /*deleteRenewableSource, renewableSources*/ 1152) {
    				each_value = /*renewableSources*/ ctx[7];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(input3.$$.fragment, local);
    			transition_in(input4.$$.fragment, local);
    			transition_in(button.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(input3.$$.fragment, local);
    			transition_out(input4.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(input3);
    			destroy_component(input4);
    			destroy_component(button);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$2.name,
    		type: "slot",
    		source: "(365:2) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (327:26)     Loading renewable sources...   {:then renewableSources}
    function create_pending_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading renewable sources...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(327:26)     Loading renewable sources...   {:then renewableSources}",
    		ctx
    	});

    	return block;
    }

    // (406:2) <PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
    function create_default_slot_11$2(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				previous: true,
    				href: "#/renewableSourcesAPI"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler*/ ctx[26]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$2.name,
    		type: "slot",
    		source: "(406:2) <PaginationItem class=\\\"{currentPage === 1 ? 'disabled' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (411:2) {#if currentPage != 1}
    function create_if_block_1$4(ctx) {
    	let current;

    	const paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_9$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(411:2) {#if currentPage != 1}",
    		ctx
    	});

    	return block;
    }

    // (413:3) <PaginationLink href="#/renewableSourcesAPI" on:click="{() => addOffset(-1)}" >
    function create_default_slot_10$2(ctx) {
    	let t_value = /*currentPage*/ ctx[5] - 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 32 && t_value !== (t_value = /*currentPage*/ ctx[5] - 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$2.name,
    		type: "slot",
    		source: "(413:3) <PaginationLink href=\\\"#/renewableSourcesAPI\\\" on:click=\\\"{() => addOffset(-1)}\\\" >",
    		ctx
    	});

    	return block;
    }

    // (412:2) <PaginationItem>
    function create_default_slot_9$2(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/renewableSourcesAPI",
    				$$slots: { default: [create_default_slot_10$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_1*/ ctx[27]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$2.name,
    		type: "slot",
    		source: "(412:2) <PaginationItem>",
    		ctx
    	});

    	return block;
    }

    // (417:3) <PaginationLink href="#/renewableSourcesAPI" >
    function create_default_slot_8$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*currentPage*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 32) set_data_dev(t, /*currentPage*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$2.name,
    		type: "slot",
    		source: "(417:3) <PaginationLink href=\\\"#/renewableSourcesAPI\\\" >",
    		ctx
    	});

    	return block;
    }

    // (416:2) <PaginationItem active>
    function create_default_slot_7$2(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/renewableSourcesAPI",
    				$$slots: { default: [create_default_slot_8$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(416:2) <PaginationItem active>",
    		ctx
    	});

    	return block;
    }

    // (421:2) {#if moreData}
    function create_if_block$8(ctx) {
    	let current;

    	const paginationitem = new PaginationItem({
    			props: {
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationitem_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem.$set(paginationitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(421:2) {#if moreData}",
    		ctx
    	});

    	return block;
    }

    // (423:3) <PaginationLink href="#/renewableSourcesAPI" on:click="{() => addOffset(1)}">
    function create_default_slot_6$2(ctx) {
    	let t_value = /*currentPage*/ ctx[5] + 1 + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPage*/ 32 && t_value !== (t_value = /*currentPage*/ ctx[5] + 1 + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(423:3) <PaginationLink href=\\\"#/renewableSourcesAPI\\\" on:click=\\\"{() => addOffset(1)}\\\">",
    		ctx
    	});

    	return block;
    }

    // (422:2) <PaginationItem >
    function create_default_slot_5$2(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				href: "#/renewableSourcesAPI",
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_2*/ ctx[28]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationlink_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationlink_changes.$$scope = { dirty, ctx };
    			}

    			paginationlink.$set(paginationlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(422:2) <PaginationItem >",
    		ctx
    	});

    	return block;
    }

    // (427:2) <PaginationItem class="{moreData ? '' : 'disabled'}">
    function create_default_slot_4$2(ctx) {
    	let current;

    	const paginationlink = new PaginationLink({
    			props: {
    				next: true,
    				href: "#/renewableSourcesAPI"
    			},
    			$$inline: true
    		});

    	paginationlink.$on("click", /*click_handler_3*/ ctx[29]);

    	const block = {
    		c: function create() {
    			create_component(paginationlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationlink, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(427:2) <PaginationItem class=\\\"{moreData ? '' : 'disabled'}\\\">",
    		ctx
    	});

    	return block;
    }

    // (403:1) <Pagination style="float:right;" ariaLabel="Cambiar de página">
    function create_default_slot_3$2(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let current;

    	const paginationitem0 = new PaginationItem({
    			props: {
    				class: /*currentPage*/ ctx[5] === 1 ? "disabled" : "",
    				$$slots: { default: [create_default_slot_11$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*currentPage*/ ctx[5] != 1 && create_if_block_1$4(ctx);

    	const paginationitem1 = new PaginationItem({
    			props: {
    				active: true,
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = /*moreData*/ ctx[6] && create_if_block$8(ctx);

    	const paginationitem2 = new PaginationItem({
    			props: {
    				class: /*moreData*/ ctx[6] ? "" : "disabled",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationitem0.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			create_component(paginationitem1.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			create_component(paginationitem2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(paginationitem1, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(paginationitem2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationitem0_changes = {};
    			if (dirty[0] & /*currentPage*/ 32) paginationitem0_changes.class = /*currentPage*/ ctx[5] === 1 ? "disabled" : "";

    			if (dirty[1] & /*$$scope*/ 256) {
    				paginationitem0_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem0.$set(paginationitem0_changes);

    			if (/*currentPage*/ ctx[5] != 1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_1$4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const paginationitem1_changes = {};

    			if (dirty[0] & /*currentPage*/ 32 | dirty[1] & /*$$scope*/ 256) {
    				paginationitem1_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem1.$set(paginationitem1_changes);

    			if (/*moreData*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block$8(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const paginationitem2_changes = {};
    			if (dirty[0] & /*moreData*/ 64) paginationitem2_changes.class = /*moreData*/ ctx[6] ? "" : "disabled";

    			if (dirty[1] & /*$$scope*/ 256) {
    				paginationitem2_changes.$$scope = { dirty, ctx };
    			}

    			paginationitem2.$set(paginationitem2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationitem0.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(paginationitem1.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(paginationitem2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationitem0.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(paginationitem1.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(paginationitem2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationitem0, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(paginationitem1, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(paginationitem2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(403:1) <Pagination style=\\\"float:right;\\\" ariaLabel=\\\"Cambiar de página\\\">",
    		ctx
    	});

    	return block;
    }

    // (433:1) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot_2$2(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$e, 432, 53, 13941);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(433:1) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    // (434:1) <Button outline color="warning" on:click={loadInitialRenewableSources} >
    function create_default_slot_1$2(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Cargar datos iniciales");
    			attr_dev(i, "class", "fas fa-cloud-upload-alt");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$e, 433, 74, 14073);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(434:1) <Button outline color=\\\"warning\\\" on:click={loadInitialRenewableSources} >",
    		ctx
    	});

    	return block;
    }

    // (435:1) <Button outline color="danger" on:click={deleteRenewableSources} >
    function create_default_slot$2(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Borrar todo");
    			attr_dev(i, "class", "fa fa-trash");
    			attr_dev(i, "aria-hidden", "true");
    			add_location(i, file$e, 434, 68, 14234);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(435:1) <Button outline color=\\\"danger\\\" on:click={deleteRenewableSources} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let main;
    	let div;
    	let t0;
    	let promise;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 7,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*renewableSources*/ ctx[7], info);

    	const pagination = new Pagination({
    			props: {
    				style: "float:right;",
    				ariaLabel: "Cambiar de página",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button0 = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", pop);

    	const button1 = new Button({
    			props: {
    				outline: true,
    				color: "warning",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*loadInitialRenewableSources*/ ctx[8]);

    	const button2 = new Button({
    			props: {
    				outline: true,
    				color: "danger",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*deleteRenewableSources*/ ctx[11]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			t0 = space();
    			info.block.c();
    			t1 = space();
    			create_component(pagination.$$.fragment);
    			t2 = space();
    			create_component(button0.$$.fragment);
    			t3 = space();
    			create_component(button1.$$.fragment);
    			t4 = space();
    			create_component(button2.$$.fragment);
    			attr_dev(div, "role", "alert");
    			attr_dev(div, "id", "div_alert");
    			set_style(div, "display", "none");
    			add_location(div, file$e, 324, 1, 9755);
    			add_location(main, file$e, 322, 0, 9708);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(main, t0);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t1;
    			append_dev(main, t1);
    			mount_component(pagination, main, null);
    			append_dev(main, t2);
    			mount_component(button0, main, null);
    			append_dev(main, t3);
    			mount_component(button1, main, null);
    			append_dev(main, t4);
    			mount_component(button2, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty[0] & /*renewableSources*/ 128 && promise !== (promise = /*renewableSources*/ ctx[7]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[7] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			const pagination_changes = {};

    			if (dirty[0] & /*moreData, currentPage*/ 96 | dirty[1] & /*$$scope*/ 256) {
    				pagination_changes.$$scope = { dirty, ctx };
    			}

    			pagination.$set(pagination_changes);
    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty[1] & /*$$scope*/ 256) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(pagination.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(pagination.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(pagination);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_API_URL$2 = "/api/v2/renewable-sources-stats";

    async function checkData$1(data) {
    	const res = await fetch(BASE_API_URL$2);
    	let theDataExist = false;

    	/* Getting the countries for the select */
    	if (res.ok) {
    		const json = await res.json();

    		/* We find the number repeated data */
    		let numberRepeatedData = json.filter(d => {
    			return d.year == data.year && d.country == data.country;
    		}).length;

    		if (numberRepeatedData >= 1) {
    			theDataExist = true;
    		}
    	} else {
    		errorAlert$1("Error interno al intentar obtener repetidos");
    		console.log("ERROR!");
    	}

    	return theDataExist;
    }

    /* These functions are for the alerts */
    function insertAlert$2() {
    	clearAlert$2();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = "alert alert-dismissible in alert-success ";
    	alert_element.innerHTML = "<strong>¡Dato insertado!</strong> El dato ha sido insertado correctamente";

    	setTimeout(
    		() => {
    			clearAlert$2();
    		},
    		3000
    	);
    }

    function deleteAlert$2() {
    	clearAlert$2();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = "alert alert-dismissible in alert-danger ";
    	alert_element.innerHTML = "<strong>¡Dato borrado!</strong> El dato ha sido borrado correctamente";

    	setTimeout(
    		() => {
    			clearAlert$2();
    		},
    		3000
    	);
    }

    function deleteAllAlert$2() {
    	clearAlert$2();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = "alert alert-dismissible in alert-danger ";
    	alert_element.innerHTML = "<strong>¡Datos borrados!</strong> Todos los datos han sido borrados correctamente";

    	setTimeout(
    		() => {
    			clearAlert$2();
    		},
    		3000
    	);
    }

    function initialDataAlert$2() {
    	clearAlert$2();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = "alert alert-dismissible in alert-warning ";
    	alert_element.innerHTML = "<strong>¡Datos iniciales!</strong> Se han generado datos iniciales correctamente ";

    	setTimeout(
    		() => {
    			clearAlert$2();
    		},
    		3000
    	);
    }

    function errorAlert$1(error) {
    	clearAlert$2();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = "alert alert-dismissible in alert-danger ";
    	alert_element.innerHTML = "<strong>¡ERROR!</strong> ¡Ha ocurrido un error! " + error;

    	setTimeout(
    		() => {
    			clearAlert$2();
    		},
    		3000
    	);
    }

    function clearAlert$2() {
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "display: none; ";
    	alert_element.className = "alert alert-dismissible in";
    	alert_element.innerHTML = "";
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let renewableSources = [];

    	let newRenewableSource = {
    		"country": "",
    		"year": "",
    		"percentage-re-total": 0,
    		"percentage-hydropower-total": 0,
    		"percentage-wind-power-total": 0
    	};

    	/* These variables are for the selects */
    	let countries = [];

    	let years = [];
    	let currentCountry = "-";
    	let currentYear = "-";
    	let numberElementsPages = 10;
    	let offset = 0;
    	let currentPage = 1; /* We could use just one variable offset or currentPage, we leave both */
    	let moreData = true;

    	onMount(() => {
    		getRenewableSources(currentCountry, currentYear);
    	});

    	onMount(getCountriesYears);

    	/* 
    This function get years and countries to put them into the selects.
    We call it just once in the onMount and each time we need to update the selects,
    but taking care we are asking for all the data.
    */
    	async function getCountriesYears() {
    		const res = await fetch(BASE_API_URL$2);

    		/* Getting the countries for the select */
    		if (res.ok) {
    			const json = await res.json();

    			$$invalidate(1, countries = json.map(d => {
    				return d.country;
    			}));

    			/* Deleting duplicated countries */
    			$$invalidate(1, countries = Array.from(new Set(countries)));

    			/* Getting the years for the select */
    			$$invalidate(2, years = json.map(d => {
    				return d.year;
    			}));

    			/* Deleting duplicated years */
    			$$invalidate(2, years = Array.from(new Set(years)));

    			console.log("Counted " + countries.length + "countries and " + years.length + "years.");
    		} else {
    			errorAlert$1("Error interno al intentar obtener las ciudades y los años");
    			console.log("ERROR!");
    		}
    	}

    	async function getRenewableSources(country, year) {
    		console.log("Fetching renewable sources stats...");

    		/* Checking if the fields are empty */
    		var url = BASE_API_URL$2 + "?limit=" + numberElementsPages;

    		if (country != "-" && year != "-") {
    			url = url + "&country=" + country + "&year=" + year;
    		} else if (country != "-" && year == "-") {
    			url = url + "&country=" + country;
    		} else if (country == "-" && year != "-") {
    			url = url + "&year=" + year;
    		}

    		const res = await fetch(url + "&offset=" + numberElementsPages * offset);

    		/* Asking for the following data for the pagination */
    		const next = await fetch(url + "&offset=" + numberElementsPages * (offset + 1));

    		if (res.ok && next.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			const jsonNext = await next.json();
    			$$invalidate(7, renewableSources = json);

    			/* Checking if we have run out of elements */
    			if (jsonNext.length == 0) {
    				$$invalidate(6, moreData = false);
    			} else {
    				$$invalidate(6, moreData = true);
    			}

    			console.log("Received " + renewableSources.length + " renewable sources stats.");
    		} else {
    			errorAlert$1("Error interno al intentar obtener todos los datos");
    			console.log("ERROR!");
    		}
    	}

    	async function loadInitialRenewableSources() {
    		console.log("Loading initial renewable sources stats...");
    		deleteRenewableSources();

    		const res = await fetch(BASE_API_URL$2 + "/loadInitialData").then(function (res) {
    			if (res.ok) {
    				console.log("Ok");

    				/* Putting the current year and the country to remove the search */
    				$$invalidate(4, currentYear = "-");

    				$$invalidate(3, currentCountry = "-");
    				getRenewableSources(currentCountry, currentYear);
    				getCountriesYears();
    				initialDataAlert$2();
    			} else {
    				errorAlert$1("Error interno al intentar obtener los datos iniciales");
    				console.log("ERROR!");
    			}
    		});
    	}

    	async function insertRenewableSources() {
    		console.log("Inserting renewable sources stats...");
    		const isRepeated = await checkData$1(newRenewableSource);

    		/* Checking if the country and the year are not empty */
    		if (newRenewableSource.country == "" || newRenewableSource.country == null || newRenewableSource.year == "" || newRenewableSource.year == null) {
    			alert("Se debe incluir el nombre del país y el año obligatoriamente");
    		} else if (isRepeated) {
    			alert("¡Ya existe ese dato en nuestra base de datos!");
    		} else {
    			const res = await fetch(BASE_API_URL$2, {
    				method: "POST",
    				body: JSON.stringify(newRenewableSource),
    				headers: { "Content-Type": "application/json" }
    			}).then(function (res) {
    				if (res.ok) {
    					/* If we want the select to be updated each time we insert, uncomment the line below */
    					/*getCountriesYears();*/
    					getRenewableSources(currentCountry, currentYear);

    					insertAlert$2();
    				} else {
    					errorAlert$1("Error interno al intentar insertar un elemento");
    				}
    			});
    		}
    	}

    	async function deleteRenewableSource(country, year) {
    		console.log("Deleting renewable resource...");

    		const res = await fetch(BASE_API_URL$2 + "/" + country + "/" + year, { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				getRenewableSources(currentCountry, currentYear);

    				/* If we want to delete the entry in the select, uncomment the line below */
    				/* We decided to conserve the option because we find it more logic */
    				/* getCountriesYears(); */
    				deleteAlert$2();
    			} else if (res.status == 404) {
    				errorAlert$1("Se ha intentado borrar un elemento inexistente.");
    			} else {
    				errorAlert$1("Error interno al intentar borrar un elemento concreto");
    			}
    		});
    	}

    	async function deleteRenewableSources() {
    		console.log("Deleting renewable resources...");

    		const res = await fetch(BASE_API_URL$2 + "/", { method: "DELETE" }).then(function (res) {
    			if (res.ok) {
    				/* To put the correct number in pagination */
    				setOffset(0);

    				$$invalidate(4, currentYear = "-");
    				$$invalidate(3, currentCountry = "-");
    				getRenewableSources(currentCountry, currentYear);
    				getCountriesYears();
    				deleteAllAlert$2();
    			} else {
    				errorAlert$1("Error interno al intentar borrar todos los elementos");
    			}
    		});
    	}

    	function search(country, year) {
    		setOffset(0);
    		getRenewableSources(country, year);
    	}

    	function setOffset(newOffset) {
    		offset = newOffset;
    		$$invalidate(5, currentPage = newOffset + 1);
    	}

    	function addOffset(increment) {
    		offset += increment;
    		$$invalidate(5, currentPage += increment);
    		getRenewableSources(currentCountry, currentYear);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<RenewableSourcesTable> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("RenewableSourcesTable", $$slots, []);

    	function input_value_binding(value) {
    		currentCountry = value;
    		$$invalidate(3, currentCountry);
    	}

    	function input_value_binding_1(value) {
    		currentYear = value;
    		$$invalidate(4, currentYear);
    	}

    	function input0_value_binding(value) {
    		newRenewableSource.country = value;
    		$$invalidate(0, newRenewableSource);
    	}

    	function input1_value_binding(value) {
    		newRenewableSource.year = value;
    		$$invalidate(0, newRenewableSource);
    	}

    	function input2_value_binding(value) {
    		newRenewableSource["percentage-re-total"] = value;
    		$$invalidate(0, newRenewableSource);
    	}

    	function input3_value_binding(value) {
    		newRenewableSource["percentage-hydropower-total"] = value;
    		$$invalidate(0, newRenewableSource);
    	}

    	function input4_value_binding(value) {
    		newRenewableSource["percentage-wind-power-total"] = value;
    		$$invalidate(0, newRenewableSource);
    	}

    	const click_handler = () => addOffset(-1);
    	const click_handler_1 = () => addOffset(-1);
    	const click_handler_2 = () => addOffset(1);
    	const click_handler_3 = () => addOffset(1);

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Table,
    		Button,
    		Input,
    		Label,
    		FormGroup,
    		Pagination,
    		PaginationItem,
    		PaginationLink,
    		BASE_API_URL: BASE_API_URL$2,
    		renewableSources,
    		newRenewableSource,
    		countries,
    		years,
    		currentCountry,
    		currentYear,
    		numberElementsPages,
    		offset,
    		currentPage,
    		moreData,
    		getCountriesYears,
    		getRenewableSources,
    		loadInitialRenewableSources,
    		checkData: checkData$1,
    		insertRenewableSources,
    		deleteRenewableSource,
    		deleteRenewableSources,
    		search,
    		setOffset,
    		addOffset,
    		insertAlert: insertAlert$2,
    		deleteAlert: deleteAlert$2,
    		deleteAllAlert: deleteAllAlert$2,
    		initialDataAlert: initialDataAlert$2,
    		errorAlert: errorAlert$1,
    		clearAlert: clearAlert$2
    	});

    	$$self.$inject_state = $$props => {
    		if ("renewableSources" in $$props) $$invalidate(7, renewableSources = $$props.renewableSources);
    		if ("newRenewableSource" in $$props) $$invalidate(0, newRenewableSource = $$props.newRenewableSource);
    		if ("countries" in $$props) $$invalidate(1, countries = $$props.countries);
    		if ("years" in $$props) $$invalidate(2, years = $$props.years);
    		if ("currentCountry" in $$props) $$invalidate(3, currentCountry = $$props.currentCountry);
    		if ("currentYear" in $$props) $$invalidate(4, currentYear = $$props.currentYear);
    		if ("numberElementsPages" in $$props) numberElementsPages = $$props.numberElementsPages;
    		if ("offset" in $$props) offset = $$props.offset;
    		if ("currentPage" in $$props) $$invalidate(5, currentPage = $$props.currentPage);
    		if ("moreData" in $$props) $$invalidate(6, moreData = $$props.moreData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		newRenewableSource,
    		countries,
    		years,
    		currentCountry,
    		currentYear,
    		currentPage,
    		moreData,
    		renewableSources,
    		loadInitialRenewableSources,
    		insertRenewableSources,
    		deleteRenewableSource,
    		deleteRenewableSources,
    		search,
    		addOffset,
    		offset,
    		numberElementsPages,
    		getCountriesYears,
    		getRenewableSources,
    		setOffset,
    		input_value_binding,
    		input_value_binding_1,
    		input0_value_binding,
    		input1_value_binding,
    		input2_value_binding,
    		input3_value_binding,
    		input4_value_binding,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class RenewableSourcesTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RenewableSourcesTable",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\front\renewableSourcesAPI\App.svelte generated by Svelte v3.20.1 */
    const file$f = "src\\front\\renewableSourcesAPI\\App.svelte";

    function create_fragment$g(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let current;
    	const renewablesourcestable = new RenewableSourcesTable({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Administrador de datos de energías renovables";
    			t1 = space();
    			create_component(renewablesourcestable.$$.fragment);
    			attr_dev(h1, "class", "display-4");
    			set_style(h1, "text-align", "center");
    			add_location(h1, file$f, 5, 1, 102);
    			add_location(main, file$f, 4, 0, 93);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			mount_component(renewablesourcestable, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(renewablesourcestable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(renewablesourcestable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(renewablesourcestable);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ RenewableSourcesTable });
    	return [];
    }

    class App$2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\front\oilCoalNuclearEnergyConsumptionAPI\EditOilCoal.svelte generated by Svelte v3.20.1 */

    const { console: console_1$5 } = globals;
    const file$g = "src\\front\\oilCoalNuclearEnergyConsumptionAPI\\EditOilCoal.svelte";

    // (1:0) <script>      import {          onMount      }
    function create_catch_block$3(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$3.name,
    		type: "catch",
    		source: "(1:0) <script>      import {          onMount      }",
    		ctx
    	});

    	return block;
    }

    // (119:4) {:then oilCoal}
    function create_then_block$3(ctx) {
    	let current;

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedNuclearEnergyConsumption, updatedCoalConsumption, updatedOilConsumption, updatedYear, updatedCountry*/ 8254) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$3.name,
    		type: "then",
    		source: "(119:4) {:then oilCoal}",
    		ctx
    	});

    	return block;
    }

    // (138:25) <Button outline  color="primary" on:click={updateOilCoal}>
    function create_default_slot_2$3(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Actualizar");
    			attr_dev(i, "class", "fas fa-pencil-alt");
    			add_location(i, file$g, 137, 84, 4707);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(138:25) <Button outline  color=\\\"primary\\\" on:click={updateOilCoal}>",
    		ctx
    	});

    	return block;
    }

    // (120:8) <Table bordered>
    function create_default_slot_1$3(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let t12;
    	let t13;
    	let td1;
    	let t14;
    	let t15;
    	let td2;
    	let updating_value;
    	let t16;
    	let td3;
    	let updating_value_1;
    	let t17;
    	let td4;
    	let updating_value_2;
    	let t18;
    	let td5;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[10].call(null, value);
    	}

    	let input0_props = { type: "number" };

    	if (/*updatedOilConsumption*/ ctx[3] !== void 0) {
    		input0_props.value = /*updatedOilConsumption*/ ctx[3];
    	}

    	const input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[11].call(null, value);
    	}

    	let input1_props = {
    		type: "number",
    		placeholder: "0.0",
    		step: "0.01",
    		min: "0"
    	};

    	if (/*updatedCoalConsumption*/ ctx[4] !== void 0) {
    		input1_props.value = /*updatedCoalConsumption*/ ctx[4];
    	}

    	const input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding));

    	function input2_value_binding(value) {
    		/*input2_value_binding*/ ctx[12].call(null, value);
    	}

    	let input2_props = {
    		type: "number",
    		placeholder: "0.0",
    		step: "0.01",
    		min: "0"
    	};

    	if (/*updatedNuclearEnergyConsumption*/ ctx[5] !== void 0) {
    		input2_props.value = /*updatedNuclearEnergyConsumption*/ ctx[5];
    	}

    	const input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, "value", input2_value_binding));

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updateOilCoal*/ ctx[7]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Consumo de Gasolina";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Consumo de Carbón";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Consumo de Energía Nuclear";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t12 = text(/*updatedCountry*/ ctx[1]);
    			t13 = space();
    			td1 = element("td");
    			t14 = text(/*updatedYear*/ ctx[2]);
    			t15 = space();
    			td2 = element("td");
    			create_component(input0.$$.fragment);
    			t16 = space();
    			td3 = element("td");
    			create_component(input1.$$.fragment);
    			t17 = space();
    			td4 = element("td");
    			create_component(input2.$$.fragment);
    			t18 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$g, 122, 5, 3906);
    			add_location(th1, file$g, 123, 5, 3926);
    			add_location(th2, file$g, 124, 5, 3945);
    			add_location(th3, file$g, 125, 5, 3980);
    			add_location(th4, file$g, 126, 20, 4028);
    			add_location(th5, file$g, 127, 20, 4085);
    			add_location(tr0, file$g, 121, 4, 3895);
    			add_location(thead, file$g, 120, 12, 3882);
    			add_location(td0, file$g, 132, 20, 4193);
    			add_location(td1, file$g, 133, 20, 4240);
    			add_location(td2, file$g, 134, 20, 4284);
    			add_location(td3, file$g, 135, 20, 4374);
    			add_location(td4, file$g, 136, 20, 4504);
    			add_location(td5, file$g, 137, 20, 4643);
    			add_location(tr1, file$g, 131, 16, 4167);
    			add_location(tbody, file$g, 130, 12, 4142);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			append_dev(td1, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			mount_component(input0, td2, null);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			mount_component(input1, td3, null);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			mount_component(input2, td4, null);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*updatedCountry*/ 2) set_data_dev(t12, /*updatedCountry*/ ctx[1]);
    			if (!current || dirty & /*updatedYear*/ 4) set_data_dev(t14, /*updatedYear*/ ctx[2]);
    			const input0_changes = {};

    			if (!updating_value && dirty & /*updatedOilConsumption*/ 8) {
    				updating_value = true;
    				input0_changes.value = /*updatedOilConsumption*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty & /*updatedCoalConsumption*/ 16) {
    				updating_value_1 = true;
    				input1_changes.value = /*updatedCoalConsumption*/ ctx[4];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};

    			if (!updating_value_2 && dirty & /*updatedNuclearEnergyConsumption*/ 32) {
    				updating_value_2 = true;
    				input2_changes.value = /*updatedNuclearEnergyConsumption*/ ctx[5];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			input2.$set(input2_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(120:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (117:20)           Loading oilCoal...      {:then oilCoal}
    function create_pending_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading oilCoal...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$3.name,
    		type: "pending",
    		source: "(117:20)           Loading oilCoal...      {:then oilCoal}",
    		ctx
    	});

    	return block;
    }

    // (143:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$3(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$g, 142, 55, 4896);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(143:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let main;
    	let div;
    	let t0;
    	let h20;
    	let small0;
    	let t2;
    	let h21;
    	let small1;
    	let strong0;
    	let t3_value = /*params*/ ctx[0].country + "";
    	let t3;
    	let t4;
    	let strong1;
    	let t5_value = /*params*/ ctx[0].year + "";
    	let t5;
    	let t6;
    	let promise;
    	let t7;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$3,
    		then: create_then_block$3,
    		catch: create_catch_block$3,
    		value: 6,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*oilCoal*/ ctx[6], info);

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			t0 = space();
    			h20 = element("h2");
    			small0 = element("small");
    			small0.textContent = "Editar datos Energías primarias:";
    			t2 = space();
    			h21 = element("h2");
    			small1 = element("small");
    			strong0 = element("strong");
    			t3 = text(t3_value);
    			t4 = text(" - ");
    			strong1 = element("strong");
    			t5 = text(t5_value);
    			t6 = space();
    			info.block.c();
    			t7 = space();
    			create_component(button.$$.fragment);
    			attr_dev(div, "role", "alert");
    			attr_dev(div, "id", "div_alert");
    			set_style(div, "display", "none");
    			add_location(div, file$g, 112, 4, 3465);
    			add_location(small0, file$g, 114, 37, 3573);
    			set_style(h20, "text-align", "center");
    			add_location(h20, file$g, 114, 4, 3540);
    			add_location(strong0, file$g, 115, 63, 3692);
    			add_location(strong1, file$g, 115, 99, 3728);
    			add_location(small1, file$g, 115, 56, 3685);
    			set_style(h21, "text-align", "center");
    			set_style(h21, "margin-bottom", "2%");
    			add_location(h21, file$g, 115, 4, 3633);
    			add_location(main, file$g, 111, 0, 3453);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(main, t0);
    			append_dev(main, h20);
    			append_dev(h20, small0);
    			append_dev(main, t2);
    			append_dev(main, h21);
    			append_dev(h21, small1);
    			append_dev(small1, strong0);
    			append_dev(strong0, t3);
    			append_dev(small1, t4);
    			append_dev(small1, strong1);
    			append_dev(strong1, t5);
    			append_dev(main, t6);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t7;
    			append_dev(main, t7);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*params*/ 1) && t3_value !== (t3_value = /*params*/ ctx[0].country + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*params*/ 1) && t5_value !== (t5_value = /*params*/ ctx[0].year + "")) set_data_dev(t5, t5_value);
    			info.ctx = ctx;

    			if (dirty & /*oilCoal*/ 64 && promise !== (promise = /*oilCoal*/ ctx[6]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[6] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_API_URL$3 = "/api/v2/oil-coal-nuclear-energy-consumption-stats";

    function updateAlert() {
    	clearAlert$3();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = " alert alert dismissible in alert-info ";
    	alert_element.innerHTML = "<strong>¡Datos actualizado!</strong> El dato se ha actualizado correctamente!";

    	setTimeout(
    		() => {
    			clearAlert$3();
    		},
    		3000
    	);
    }

    function clearAlert$3() {
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "display: none; ";
    	alert_element.className = "alert alert-dismissible in";
    	alert_element.innerHTML = "";
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { params = {} } = $$props;
    	let oilCoal = {};
    	let updatedCountry = "";
    	let updatedYear = 0;
    	let updatedOilConsumption = 0;
    	let updatedCoalConsumption = 0;
    	let updatedNuclearEnergyConsumption = 0;
    	onMount(getOilCoal);

    	async function getOilCoal() {
    		console.log("Fetching oilCoal...");
    		const res = await fetch(BASE_API_URL$3 + "/" + params.country + "/" + params.year);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(6, oilCoal = json);
    			$$invalidate(1, updatedCountry = oilCoal.country);
    			$$invalidate(2, updatedYear = oilCoal.year);
    			$$invalidate(3, updatedOilConsumption = oilCoal["oil-consumption"]);
    			$$invalidate(4, updatedCoalConsumption = oilCoal["coal-consumption"]);
    			$$invalidate(5, updatedNuclearEnergyConsumption = oilCoal["nuclear-energy-consumption"]);
    			console.log("Received contact.");
    		} else {
    			console.log("ERROR!");
    		}
    	}

    	async function updateOilCoal() {
    		console.log("Updating Oil Coal...");

    		const res = await fetch(BASE_API_URL$3 + "/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				country: params.country,
    				year: parseInt(params.year),
    				"oil-consumption": updatedOilConsumption,
    				"coal-consumption": updatedCoalConsumption,
    				"nuclear-energy-consumption": updatedNuclearEnergyConsumption
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			if (res.ok) {
    				getOilCoal();
    				updateAlert();
    			} else if (res.status == 404) {
    				errorAlert = "Se ha intentado borrar un elemento inexistente.";
    			} else {
    				errorAlert = "";
    			}
    		});
    	}

    	function errorAlert(error) {
    		clearAlert$3();
    		var alert_element = document.getElementById("div_alert");
    		alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    		alert_element.className = " alert alert dismissible in alert-danger ";
    		alert_element.innerHTML = "<strong>¡ERROR!</strong> ¡Ha ocurrido un error!" + error;

    		setTimeout(
    			() => {
    				clearAlert$3();
    			},
    			3000
    		);
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$5.warn(`<EditOilCoal> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("EditOilCoal", $$slots, []);

    	function input0_value_binding(value) {
    		updatedOilConsumption = value;
    		$$invalidate(3, updatedOilConsumption);
    	}

    	function input1_value_binding(value) {
    		updatedCoalConsumption = value;
    		$$invalidate(4, updatedCoalConsumption);
    	}

    	function input2_value_binding(value) {
    		updatedNuclearEnergyConsumption = value;
    		$$invalidate(5, updatedNuclearEnergyConsumption);
    	}

    	$$self.$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Input,
    		Table,
    		Button,
    		BASE_API_URL: BASE_API_URL$3,
    		params,
    		oilCoal,
    		updatedCountry,
    		updatedYear,
    		updatedOilConsumption,
    		updatedCoalConsumption,
    		updatedNuclearEnergyConsumption,
    		getOilCoal,
    		updateOilCoal,
    		errorAlert,
    		updateAlert,
    		clearAlert: clearAlert$3
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("oilCoal" in $$props) $$invalidate(6, oilCoal = $$props.oilCoal);
    		if ("updatedCountry" in $$props) $$invalidate(1, updatedCountry = $$props.updatedCountry);
    		if ("updatedYear" in $$props) $$invalidate(2, updatedYear = $$props.updatedYear);
    		if ("updatedOilConsumption" in $$props) $$invalidate(3, updatedOilConsumption = $$props.updatedOilConsumption);
    		if ("updatedCoalConsumption" in $$props) $$invalidate(4, updatedCoalConsumption = $$props.updatedCoalConsumption);
    		if ("updatedNuclearEnergyConsumption" in $$props) $$invalidate(5, updatedNuclearEnergyConsumption = $$props.updatedNuclearEnergyConsumption);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updatedCountry,
    		updatedYear,
    		updatedOilConsumption,
    		updatedCoalConsumption,
    		updatedNuclearEnergyConsumption,
    		oilCoal,
    		updateOilCoal,
    		errorAlert,
    		getOilCoal,
    		input0_value_binding,
    		input1_value_binding,
    		input2_value_binding
    	];
    }

    class EditOilCoal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditOilCoal",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get params() {
    		throw new Error("<EditOilCoal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditOilCoal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\plugInVehiclesAPI\EditPlugInVehicle.svelte generated by Svelte v3.20.1 */

    const { console: console_1$6 } = globals;
    const file$h = "src\\front\\plugInVehiclesAPI\\EditPlugInVehicle.svelte";

    // (1:0) <script>      import {          onMount      }
    function create_catch_block$4(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$4.name,
    		type: "catch",
    		source: "(1:0) <script>      import {          onMount      }",
    		ctx
    	});

    	return block;
    }

    // (119:4) {:then pluginVehicles}
    function create_then_block$4(ctx) {
    	let current;

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedCarsPerPeople, updatedAnnualSale, updatedPevStock, updatedYear, updatedCountry*/ 4158) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$4.name,
    		type: "then",
    		source: "(119:4) {:then pluginVehicles}",
    		ctx
    	});

    	return block;
    }

    // (138:25) <Button outline color="primary" on:click={updatedPluginVehicles}>
    function create_default_slot_2$4(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Actualizar");
    			attr_dev(i, "class", "fas fa-pencil-alt");
    			add_location(i, file$h, 137, 91, 4648);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(138:25) <Button outline color=\\\"primary\\\" on:click={updatedPluginVehicles}>",
    		ctx
    	});

    	return block;
    }

    // (120:8) <Table bordered>
    function create_default_slot_1$4(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let t12;
    	let t13;
    	let td1;
    	let t14;
    	let t15;
    	let td2;
    	let updating_value;
    	let t16;
    	let td3;
    	let updating_value_1;
    	let t17;
    	let td4;
    	let updating_value_2;
    	let t18;
    	let td5;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[9].call(null, value);
    	}

    	let input0_props = { type: "number" };

    	if (/*updatedPevStock*/ ctx[3] !== void 0) {
    		input0_props.value = /*updatedPevStock*/ ctx[3];
    	}

    	const input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[10].call(null, value);
    	}

    	let input1_props = { type: "number" };

    	if (/*updatedAnnualSale*/ ctx[4] !== void 0) {
    		input1_props.value = /*updatedAnnualSale*/ ctx[4];
    	}

    	const input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding));

    	function input2_value_binding(value) {
    		/*input2_value_binding*/ ctx[11].call(null, value);
    	}

    	let input2_props = { type: "number" };

    	if (/*updatedCarsPerPeople*/ ctx[5] !== void 0) {
    		input2_props.value = /*updatedCarsPerPeople*/ ctx[5];
    	}

    	const input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, "value", input2_value_binding));

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updatedPluginVehicles*/ ctx[7]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Ventas acumuladas";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Salario anual";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Porcentaje de coches cada 1000 personas";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t12 = text(/*updatedCountry*/ ctx[1]);
    			t13 = space();
    			td1 = element("td");
    			t14 = text(/*updatedYear*/ ctx[2]);
    			t15 = space();
    			td2 = element("td");
    			create_component(input0.$$.fragment);
    			t16 = space();
    			td3 = element("td");
    			create_component(input1.$$.fragment);
    			t17 = space();
    			td4 = element("td");
    			create_component(input2.$$.fragment);
    			t18 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$h, 122, 20, 3944);
    			add_location(th1, file$h, 123, 5, 3964);
    			add_location(th2, file$h, 124, 5, 3983);
    			add_location(th3, file$h, 125, 5, 4016);
    			add_location(th4, file$h, 126, 5, 4045);
    			add_location(th5, file$h, 127, 5, 4100);
    			add_location(tr0, file$h, 121, 16, 3918);
    			add_location(thead, file$h, 120, 12, 3893);
    			add_location(td0, file$h, 132, 20, 4227);
    			add_location(td1, file$h, 133, 20, 4274);
    			add_location(td2, file$h, 134, 20, 4318);
    			add_location(td3, file$h, 135, 20, 4402);
    			add_location(td4, file$h, 136, 20, 4488);
    			add_location(td5, file$h, 137, 20, 4577);
    			add_location(tr1, file$h, 131, 16, 4201);
    			add_location(tbody, file$h, 130, 12, 4176);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			append_dev(td1, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			mount_component(input0, td2, null);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			mount_component(input1, td3, null);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			mount_component(input2, td4, null);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*updatedCountry*/ 2) set_data_dev(t12, /*updatedCountry*/ ctx[1]);
    			if (!current || dirty & /*updatedYear*/ 4) set_data_dev(t14, /*updatedYear*/ ctx[2]);
    			const input0_changes = {};

    			if (!updating_value && dirty & /*updatedPevStock*/ 8) {
    				updating_value = true;
    				input0_changes.value = /*updatedPevStock*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty & /*updatedAnnualSale*/ 16) {
    				updating_value_1 = true;
    				input1_changes.value = /*updatedAnnualSale*/ ctx[4];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};

    			if (!updating_value_2 && dirty & /*updatedCarsPerPeople*/ 32) {
    				updating_value_2 = true;
    				input2_changes.value = /*updatedCarsPerPeople*/ ctx[5];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			input2.$set(input2_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(120:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (117:27)           Loading pluginVehicles...      {:then pluginVehicles}
    function create_pending_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading pluginVehicles...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$4.name,
    		type: "pending",
    		source: "(117:27)           Loading pluginVehicles...      {:then pluginVehicles}",
    		ctx
    	});

    	return block;
    }

    // (143:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$4(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$h, 142, 55, 4837);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(143:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let main;
    	let div;
    	let t0;
    	let h20;
    	let small0;
    	let t2;
    	let h21;
    	let small1;
    	let strong0;
    	let t3_value = /*params*/ ctx[0].country + "";
    	let t3;
    	let t4;
    	let strong1;
    	let t5_value = /*params*/ ctx[0].year + "";
    	let t5;
    	let t6;
    	let promise;
    	let t7;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$4,
    		then: create_then_block$4,
    		catch: create_catch_block$4,
    		value: 6,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*pluginVehicles*/ ctx[6], info);

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			t0 = space();
    			h20 = element("h2");
    			small0 = element("small");
    			small0.textContent = "Editar dato de coche eléctrico:";
    			t2 = space();
    			h21 = element("h2");
    			small1 = element("small");
    			strong0 = element("strong");
    			t3 = text(t3_value);
    			t4 = text(" - ");
    			strong1 = element("strong");
    			t5 = text(t5_value);
    			t6 = space();
    			info.block.c();
    			t7 = space();
    			create_component(button.$$.fragment);
    			attr_dev(div, "role", "alert");
    			attr_dev(div, "id", "div_alert");
    			set_style(div, "display", "none");
    			add_location(div, file$h, 111, 1, 3458);
    			add_location(small0, file$h, 113, 37, 3562);
    			set_style(h20, "text-align", "center");
    			add_location(h20, file$h, 113, 4, 3529);
    			add_location(strong0, file$h, 114, 63, 3680);
    			add_location(strong1, file$h, 114, 99, 3716);
    			add_location(small1, file$h, 114, 56, 3673);
    			set_style(h21, "text-align", "center");
    			set_style(h21, "margin-bottom", "2%");
    			add_location(h21, file$h, 114, 4, 3621);
    			add_location(main, file$h, 109, 0, 3408);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(main, t0);
    			append_dev(main, h20);
    			append_dev(h20, small0);
    			append_dev(main, t2);
    			append_dev(main, h21);
    			append_dev(h21, small1);
    			append_dev(small1, strong0);
    			append_dev(strong0, t3);
    			append_dev(small1, t4);
    			append_dev(small1, strong1);
    			append_dev(strong1, t5);
    			append_dev(main, t6);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t7;
    			append_dev(main, t7);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*params*/ 1) && t3_value !== (t3_value = /*params*/ ctx[0].country + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*params*/ 1) && t5_value !== (t5_value = /*params*/ ctx[0].year + "")) set_data_dev(t5, t5_value);
    			info.ctx = ctx;

    			if (dirty & /*pluginVehicles*/ 64 && promise !== (promise = /*pluginVehicles*/ ctx[6]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[6] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_API_URL$4 = "/api/v2/plugin-vehicles-stats";

    function errorAlert$2(error) {
    	clearAlert$4();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = " alert alert dismissible in alert-danger ";
    	alert_element.innerHTML = "<strong>¡ERROR!</strong> ¡Ha ocurrido un error! " + error;

    	setTimeout(
    		() => {
    			clearAlert$4();
    		},
    		3000
    	);
    }

    function updateAlert$1() {
    	clearAlert$4();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = " alert alert dismissible in alert-info ";
    	alert_element.innerHTML = "<strong>¡Dato actualizado!</strong> El dato ha sido actualizado correctamente!";

    	setTimeout(
    		() => {
    			clearAlert$4();
    		},
    		3000
    	);
    }

    function clearAlert$4() {
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "display: none; ";
    	alert_element.className = "alert alert-dismissible in";
    	alert_element.innerHTML = "";
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { params = {} } = $$props;
    	let pluginVehicles = {};
    	let updatedCountry = "";
    	let updatedYear = 0;
    	let updatedPevStock = 0;
    	let updatedAnnualSale = 0;
    	let updatedCarsPerPeople = 0;
    	onMount(getPluginVehicles);

    	async function getPluginVehicles() {
    		console.log("Fetching plugin vehicle...");
    		const res = await fetch(BASE_API_URL$4 + "/" + params.country + "/" + params.year);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(6, pluginVehicles = json);
    			$$invalidate(1, updatedCountry = pluginVehicles.country);
    			$$invalidate(2, updatedYear = pluginVehicles.year);
    			$$invalidate(3, updatedPevStock = pluginVehicles["pev-stock"]);
    			$$invalidate(4, updatedAnnualSale = pluginVehicles["annual-sale"]);
    			$$invalidate(5, updatedCarsPerPeople = pluginVehicles["cars-per-1000"]);
    			console.log("Received plugin vehicle.");
    		} else {
    			console.log("ERROR!");
    		}
    	}

    	async function updatedPluginVehicles() {
    		console.log("Updating plugin vehicles...");

    		const res = await fetch(BASE_API_URL$4 + "/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				country: params.country,
    				year: parseInt(params.year),
    				"pev-stock": updatedPevStock,
    				"annual-sale": updatedAnnualSale,
    				"cars-per-1000": updatedCarsPerPeople
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			if (res.ok) {
    				updateAlert$1();
    				getPluginVehicles();
    			} else if (res.status == 404) {
    				errorAlert$2("Se ha intentado borrar un elemento inexistente");
    			} else {
    				errorAlert$2("");
    			}
    		});
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$6.warn(`<EditPlugInVehicle> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("EditPlugInVehicle", $$slots, []);

    	function input0_value_binding(value) {
    		updatedPevStock = value;
    		$$invalidate(3, updatedPevStock);
    	}

    	function input1_value_binding(value) {
    		updatedAnnualSale = value;
    		$$invalidate(4, updatedAnnualSale);
    	}

    	function input2_value_binding(value) {
    		updatedCarsPerPeople = value;
    		$$invalidate(5, updatedCarsPerPeople);
    	}

    	$$self.$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Input,
    		Table,
    		Button,
    		BASE_API_URL: BASE_API_URL$4,
    		params,
    		pluginVehicles,
    		updatedCountry,
    		updatedYear,
    		updatedPevStock,
    		updatedAnnualSale,
    		updatedCarsPerPeople,
    		getPluginVehicles,
    		updatedPluginVehicles,
    		errorAlert: errorAlert$2,
    		updateAlert: updateAlert$1,
    		clearAlert: clearAlert$4
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("pluginVehicles" in $$props) $$invalidate(6, pluginVehicles = $$props.pluginVehicles);
    		if ("updatedCountry" in $$props) $$invalidate(1, updatedCountry = $$props.updatedCountry);
    		if ("updatedYear" in $$props) $$invalidate(2, updatedYear = $$props.updatedYear);
    		if ("updatedPevStock" in $$props) $$invalidate(3, updatedPevStock = $$props.updatedPevStock);
    		if ("updatedAnnualSale" in $$props) $$invalidate(4, updatedAnnualSale = $$props.updatedAnnualSale);
    		if ("updatedCarsPerPeople" in $$props) $$invalidate(5, updatedCarsPerPeople = $$props.updatedCarsPerPeople);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updatedCountry,
    		updatedYear,
    		updatedPevStock,
    		updatedAnnualSale,
    		updatedCarsPerPeople,
    		pluginVehicles,
    		updatedPluginVehicles,
    		getPluginVehicles,
    		input0_value_binding,
    		input1_value_binding,
    		input2_value_binding
    	];
    }

    class EditPlugInVehicle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditPlugInVehicle",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get params() {
    		throw new Error("<EditPlugInVehicle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditPlugInVehicle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\renewableSourcesAPI\EditRenewableSource.svelte generated by Svelte v3.20.1 */

    const { console: console_1$7 } = globals;
    const file$i = "src\\front\\renewableSourcesAPI\\EditRenewableSource.svelte";

    // (1:0) <script>      import {          onMount      }
    function create_catch_block$5(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$5.name,
    		type: "catch",
    		source: "(1:0) <script>      import {          onMount      }",
    		ctx
    	});

    	return block;
    }

    // (118:4) {:then renewableSource}
    function create_then_block$5(ctx) {
    	let current;

    	const table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, updatedPercentageWind, updatedPercentageHydro, updatedPercentageRe, updatedYear, updatedCountry*/ 4158) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$5.name,
    		type: "then",
    		source: "(118:4) {:then renewableSource}",
    		ctx
    	});

    	return block;
    }

    // (137:25) <Button outline color="primary" on:click={updateRenewableSource} >
    function create_default_slot_2$5(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Actualizar");
    			attr_dev(i, "class", "fas fa-pencil-alt");
    			add_location(i, file$i, 136, 92, 4883);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(137:25) <Button outline color=\\\"primary\\\" on:click={updateRenewableSource} >",
    		ctx
    	});

    	return block;
    }

    // (119:8) <Table bordered>
    function create_default_slot_1$5(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let td0;
    	let t12;
    	let t13;
    	let td1;
    	let t14;
    	let t15;
    	let td2;
    	let updating_value;
    	let t16;
    	let td3;
    	let updating_value_1;
    	let t17;
    	let td4;
    	let updating_value_2;
    	let t18;
    	let td5;
    	let current;

    	function input0_value_binding(value) {
    		/*input0_value_binding*/ ctx[9].call(null, value);
    	}

    	let input0_props = { type: "number" };

    	if (/*updatedPercentageRe*/ ctx[3] !== void 0) {
    		input0_props.value = /*updatedPercentageRe*/ ctx[3];
    	}

    	const input0 = new Input({ props: input0_props, $$inline: true });
    	binding_callbacks.push(() => bind(input0, "value", input0_value_binding));

    	function input1_value_binding(value) {
    		/*input1_value_binding*/ ctx[10].call(null, value);
    	}

    	let input1_props = {
    		type: "number",
    		placeholder: "0.0",
    		step: "0.01",
    		min: "0"
    	};

    	if (/*updatedPercentageHydro*/ ctx[4] !== void 0) {
    		input1_props.value = /*updatedPercentageHydro*/ ctx[4];
    	}

    	const input1 = new Input({ props: input1_props, $$inline: true });
    	binding_callbacks.push(() => bind(input1, "value", input1_value_binding));

    	function input2_value_binding(value) {
    		/*input2_value_binding*/ ctx[11].call(null, value);
    	}

    	let input2_props = {
    		type: "number",
    		placeholder: "0.0",
    		step: "0.01",
    		min: "0"
    	};

    	if (/*updatedPercentageWind*/ ctx[5] !== void 0) {
    		input2_props.value = /*updatedPercentageWind*/ ctx[5];
    	}

    	const input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, "value", input2_value_binding));

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "primary",
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*updateRenewableSource*/ ctx[7]);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "País";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Año";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Porcentaje de uso de energías renovables";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Porcentaje de uso de energías hidroeléctricas sobre el total";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Porcentaje de uso de energías eólica";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Acciones";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			t12 = text(/*updatedCountry*/ ctx[1]);
    			t13 = space();
    			td1 = element("td");
    			t14 = text(/*updatedYear*/ ctx[2]);
    			t15 = space();
    			td2 = element("td");
    			create_component(input0.$$.fragment);
    			t16 = space();
    			td3 = element("td");
    			create_component(input1.$$.fragment);
    			t17 = space();
    			td4 = element("td");
    			create_component(input2.$$.fragment);
    			t18 = space();
    			td5 = element("td");
    			create_component(button.$$.fragment);
    			add_location(th0, file$i, 121, 5, 4015);
    			add_location(th1, file$i, 122, 5, 4037);
    			add_location(th2, file$i, 123, 5, 4058);
    			add_location(th3, file$i, 124, 5, 4116);
    			add_location(th4, file$i, 125, 5, 4194);
    			add_location(th5, file$i, 126, 5, 4248);
    			add_location(tr0, file$i, 120, 16, 4004);
    			add_location(thead, file$i, 119, 12, 3979);
    			add_location(td0, file$i, 131, 20, 4365);
    			add_location(td1, file$i, 132, 20, 4414);
    			add_location(td2, file$i, 133, 20, 4460);
    			add_location(td3, file$i, 134, 20, 4550);
    			add_location(td4, file$i, 135, 20, 4681);
    			add_location(td5, file$i, 136, 20, 4811);
    			add_location(tr1, file$i, 130, 16, 4339);
    			add_location(tbody, file$i, 129, 12, 4314);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, t12);
    			append_dev(tr1, t13);
    			append_dev(tr1, td1);
    			append_dev(td1, t14);
    			append_dev(tr1, t15);
    			append_dev(tr1, td2);
    			mount_component(input0, td2, null);
    			append_dev(tr1, t16);
    			append_dev(tr1, td3);
    			mount_component(input1, td3, null);
    			append_dev(tr1, t17);
    			append_dev(tr1, td4);
    			mount_component(input2, td4, null);
    			append_dev(tr1, t18);
    			append_dev(tr1, td5);
    			mount_component(button, td5, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*updatedCountry*/ 2) set_data_dev(t12, /*updatedCountry*/ ctx[1]);
    			if (!current || dirty & /*updatedYear*/ 4) set_data_dev(t14, /*updatedYear*/ ctx[2]);
    			const input0_changes = {};

    			if (!updating_value && dirty & /*updatedPercentageRe*/ 8) {
    				updating_value = true;
    				input0_changes.value = /*updatedPercentageRe*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			input0.$set(input0_changes);
    			const input1_changes = {};

    			if (!updating_value_1 && dirty & /*updatedPercentageHydro*/ 16) {
    				updating_value_1 = true;
    				input1_changes.value = /*updatedPercentageHydro*/ ctx[4];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			input1.$set(input1_changes);
    			const input2_changes = {};

    			if (!updating_value_2 && dirty & /*updatedPercentageWind*/ 32) {
    				updating_value_2 = true;
    				input2_changes.value = /*updatedPercentageWind*/ ctx[5];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			input2.$set(input2_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_component(input0);
    			destroy_component(input1);
    			destroy_component(input2);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(119:8) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (116:28)           Loading renewableSource...      {:then renewableSource}
    function create_pending_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading renewableSource...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$5.name,
    		type: "pending",
    		source: "(116:28)           Loading renewableSource...      {:then renewableSource}",
    		ctx
    	});

    	return block;
    }

    // (143:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$5(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$i, 142, 56, 5076);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(143:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let main;
    	let div;
    	let t0;
    	let h20;
    	let small0;
    	let t2;
    	let h21;
    	let small1;
    	let strong0;
    	let t3_value = /*params*/ ctx[0].country + "";
    	let t3;
    	let t4;
    	let strong1;
    	let t5_value = /*params*/ ctx[0].year + "";
    	let t5;
    	let t6;
    	let promise;
    	let t7;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$5,
    		then: create_then_block$5,
    		catch: create_catch_block$5,
    		value: 6,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*renewableSource*/ ctx[6], info);

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			t0 = space();
    			h20 = element("h2");
    			small0 = element("small");
    			small0.textContent = "Editar dato de energía renovable:";
    			t2 = space();
    			h21 = element("h2");
    			small1 = element("small");
    			strong0 = element("strong");
    			t3 = text(t3_value);
    			t4 = text(" - ");
    			strong1 = element("strong");
    			t5 = text(t5_value);
    			t6 = space();
    			info.block.c();
    			t7 = space();
    			create_component(button.$$.fragment);
    			attr_dev(div, "role", "alert");
    			attr_dev(div, "id", "div_alert");
    			set_style(div, "display", "none");
    			add_location(div, file$i, 110, 1, 3535);
    			add_location(small0, file$i, 112, 37, 3639);
    			set_style(h20, "text-align", "center");
    			add_location(h20, file$i, 112, 4, 3606);
    			add_location(strong0, file$i, 113, 63, 3759);
    			add_location(strong1, file$i, 113, 99, 3795);
    			add_location(small1, file$i, 113, 56, 3752);
    			set_style(h21, "text-align", "center");
    			set_style(h21, "margin-bottom", "2%");
    			add_location(h21, file$i, 113, 4, 3700);
    			add_location(main, file$i, 108, 0, 3485);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(main, t0);
    			append_dev(main, h20);
    			append_dev(h20, small0);
    			append_dev(main, t2);
    			append_dev(main, h21);
    			append_dev(h21, small1);
    			append_dev(small1, strong0);
    			append_dev(strong0, t3);
    			append_dev(small1, t4);
    			append_dev(small1, strong1);
    			append_dev(strong1, t5);
    			append_dev(main, t6);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t7;
    			append_dev(main, t7);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*params*/ 1) && t3_value !== (t3_value = /*params*/ ctx[0].country + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*params*/ 1) && t5_value !== (t5_value = /*params*/ ctx[0].year + "")) set_data_dev(t5, t5_value);
    			info.ctx = ctx;

    			if (dirty & /*renewableSource*/ 64 && promise !== (promise = /*renewableSource*/ ctx[6]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[6] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_API_URL$5 = "/api/v2/renewable-sources-stats";

    function errorAlert$3(error) {
    	clearAlert$5();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = "alert alert-dismissible in alert-danger ";
    	alert_element.innerHTML = "<strong>¡ERROR!</strong> ¡Ha ocurrido un error! " + error;

    	setTimeout(
    		() => {
    			clearAlert$5();
    		},
    		3000
    	);
    }

    function updateAlert$2() {
    	clearAlert$5();
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "position: fixed; top: 0px; top: 1%; width: 90%;";
    	alert_element.className = "alert alert-dismissible in alert-info ";
    	alert_element.innerHTML = "<strong>¡Dato actualizado!</strong> El dato ha sido actualizado correctamente";

    	setTimeout(
    		() => {
    			clearAlert$5();
    		},
    		3000
    	);
    }

    function clearAlert$5() {
    	var alert_element = document.getElementById("div_alert");
    	alert_element.style = "display: none; ";
    	alert_element.className = "alert alert-dismissible in";
    	alert_element.innerHTML = "";
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { params = {} } = $$props;
    	let renewableSource = {};
    	let updatedCountry = "";
    	let updatedYear = 0;
    	let updatedPercentageRe = 0;
    	let updatedPercentageHydro = 0;
    	let updatedPercentageWind = 0;
    	onMount(getRenewableSource);

    	async function getRenewableSource() {
    		console.log("Fetching renewable source...");
    		const res = await fetch(BASE_API_URL$5 + "/" + params.country + "/" + params.year);

    		if (res.ok) {
    			console.log("Ok:");
    			const json = await res.json();
    			$$invalidate(6, renewableSource = json);
    			$$invalidate(1, updatedCountry = renewableSource.year);
    			$$invalidate(2, updatedYear = renewableSource.country);
    			$$invalidate(3, updatedPercentageRe = renewableSource["percentage-re-total"]);
    			$$invalidate(4, updatedPercentageHydro = renewableSource["percentage-hydropower-total"]);
    			$$invalidate(5, updatedPercentageWind = renewableSource["percentage-wind-power-total"]);
    			console.log("Received contact.");
    		} else {
    			console.log("ERROR!");
    		}
    	}

    	async function updateRenewableSource() {
    		console.log("Updating renewable source...");

    		const res = await fetch(BASE_API_URL$5 + "/" + params.country + "/" + params.year, {
    			method: "PUT",
    			body: JSON.stringify({
    				country: params.country,
    				year: parseInt(params.year),
    				"percentage-re-total": updatedPercentageRe,
    				"percentage-hydropower-total": updatedPercentageHydro,
    				"percentage-wind-power-total": updatedPercentageWind
    			}),
    			headers: { "Content-Type": "application/json" }
    		}).then(function (res) {
    			if (res.ok) {
    				getRenewableSource();
    				updateAlert$2();
    			} else if (res.status == 404) {
    				errorAlert$3("Se ha intentado borrar un elemento inexistente.");
    			} else {
    				errorAlert$3("");
    			}
    		});
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$7.warn(`<EditRenewableSource> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("EditRenewableSource", $$slots, []);

    	function input0_value_binding(value) {
    		updatedPercentageRe = value;
    		$$invalidate(3, updatedPercentageRe);
    	}

    	function input1_value_binding(value) {
    		updatedPercentageHydro = value;
    		$$invalidate(4, updatedPercentageHydro);
    	}

    	function input2_value_binding(value) {
    		updatedPercentageWind = value;
    		$$invalidate(5, updatedPercentageWind);
    	}

    	$$self.$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		pop,
    		Table,
    		Button,
    		Input,
    		BASE_API_URL: BASE_API_URL$5,
    		params,
    		renewableSource,
    		updatedCountry,
    		updatedYear,
    		updatedPercentageRe,
    		updatedPercentageHydro,
    		updatedPercentageWind,
    		getRenewableSource,
    		updateRenewableSource,
    		errorAlert: errorAlert$3,
    		updateAlert: updateAlert$2,
    		clearAlert: clearAlert$5
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("renewableSource" in $$props) $$invalidate(6, renewableSource = $$props.renewableSource);
    		if ("updatedCountry" in $$props) $$invalidate(1, updatedCountry = $$props.updatedCountry);
    		if ("updatedYear" in $$props) $$invalidate(2, updatedYear = $$props.updatedYear);
    		if ("updatedPercentageRe" in $$props) $$invalidate(3, updatedPercentageRe = $$props.updatedPercentageRe);
    		if ("updatedPercentageHydro" in $$props) $$invalidate(4, updatedPercentageHydro = $$props.updatedPercentageHydro);
    		if ("updatedPercentageWind" in $$props) $$invalidate(5, updatedPercentageWind = $$props.updatedPercentageWind);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		updatedCountry,
    		updatedYear,
    		updatedPercentageRe,
    		updatedPercentageHydro,
    		updatedPercentageWind,
    		renewableSource,
    		updateRenewableSource,
    		getRenewableSource,
    		input0_value_binding,
    		input1_value_binding,
    		input2_value_binding
    	];
    }

    class EditRenewableSource extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditRenewableSource",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get params() {
    		throw new Error("<EditRenewableSource>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<EditRenewableSource>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\oilCoalNuclearEnergyConsumptionAPI\ChartOilCoal.svelte generated by Svelte v3.20.1 */

    const { console: console_1$8 } = globals;
    const file$j = "src\\front\\oilCoalNuclearEnergyConsumptionAPI\\ChartOilCoal.svelte";

    // (158:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$6(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$j, 157, 56, 4891);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(158:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let t0;
    	let main;
    	let figure;
    	let div;
    	let t1;
    	let p;
    	let t2;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			t1 = space();
    			p = element("p");
    			t2 = space();
    			create_component(button.$$.fragment);
    			attr_dev(div, "id", "container");
    			add_location(div, file$j, 152, 8, 4732);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$j, 153, 8, 4768);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$j, 151, 4, 4688);
    			add_location(main, file$j, 149, 0, 4670);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t1);
    			append_dev(figure, p);
    			append_dev(main, t2);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getPointCategoryName(point, dimension) {
    	var series = point.series,
    		isY = dimension === "y",
    		axis = series[isY ? "yAxis" : "xAxis"];

    	return axis.categories[point[isY ? "y" : "x"]];
    }

    async function loadGraph() {
    	const BASE_API_URL = "/api/v2/oil-coal-nuclear-energy-consumption-stats";
    	const resData = await fetch(BASE_API_URL);
    	let Data = await resData.json();

    	let countries = Array.from(new Set(Data.map(d => {
    			return d.country;
    		})));

    	let years = Array.from(new Set(Data.map(d => {
    			return d.year;
    		})));

    	/*
        Spain => ["Spain", 0, 0]
        Canada => ["Canada", 1, 0]
    */
    	let countriesPosition = [];

    	for (let i = 0; i < countries.length; i++) {
    		countriesPosition.push([countries[i], i, 0]);
    	}

    	let DataChart = [];

    	years.forEach(y => {
    		countries.forEach(c => {
    			let data = Data.find(d => d.country == c && d.year == y);

    			if (Data.find(d => d.country == c && d.year == y)) {
    				DataChart.push([countries.indexOf(c), years.indexOf(y), data["oil-consumption"]]);
    			} else {
    				DataChart.push([countries.indexOf(c), years.indexOf(y), null]);
    			}
    		});
    	});

    	console.log(years);
    	console.log(DataChart);

    	Highcharts.chart("container", {
    		chart: {
    			type: "heatmap",
    			marginTop: 80,
    			marginBottom: 80,
    			plotBorderWidth: 1
    		},
    		title: {
    			text: "Porcentaje de consumo de Carbón por Año"
    		},
    		xAxis: { categories: countries },
    		yAxis: {
    			categories: years,
    			title: null,
    			reversed: true
    		},
    		accessibility: {
    			point: {
    				descriptionFormatter(point) {
    					var ix = point.index + 1,
    						xName = getPointCategoryName(point, "x"),
    						yName = getPointCategoryName(point, "y"),
    						val = point.value;

    					return ix + ". " + xName + " sales " + yName + ", " + val + ".";
    				}
    			}
    		},
    		colorAxis: {
    			min: 0,
    			minColor: "#FFFFFF",
    			maxColor: Highcharts.getOptions().colors[0]
    		},
    		legend: {
    			align: "right",
    			layout: "vertical",
    			margin: 0,
    			verticalAlign: "top",
    			y: 25,
    			symbolHeight: 280
    		},
    		tooltip: {
    			formatter() {
    				return "<b>" + getPointCategoryName(this.point, "x") + "</b><br><b>" + this.point.value + "</b> consumo de carbón <br><b>" + getPointCategoryName(this.point, "y") + "</b>";
    			}
    		},
    		series: [
    			{
    				name: "Sales per employee",
    				borderWidth: 1,
    				data: DataChart,
    				dataLabels: { enabled: true, color: "#000000" }
    			}
    		],
    		responsive: {
    			rules: [
    				{
    					condition: { maxWidth: 500 },
    					chartOptions: {
    						yAxis: {
    							labels: {
    								formatter() {
    									return this.value.charAt(0);
    								}
    							}
    						}
    					}
    				}
    			]
    		}
    	});
    }

    function instance$k($$self, $$props, $$invalidate) {
    	loadGraph();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$8.warn(`<ChartOilCoal> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ChartOilCoal", $$slots, []);

    	$$self.$capture_state = () => ({
    		Button,
    		pop,
    		onMount,
    		getPointCategoryName,
    		loadGraph
    	});

    	return [];
    }

    class ChartOilCoal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChartOilCoal",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\front\oilCoalNuclearEnergyConsumptionAPI\ChartOilCoal2.svelte generated by Svelte v3.20.1 */
    const file$k = "src\\front\\oilCoalNuclearEnergyConsumptionAPI\\ChartOilCoal2.svelte";

    // (62:0) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$7(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$k, 61, 52, 2249);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(62:0) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let canvas;
    	let t0;
    	let main;
    	let p;
    	let t2;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			canvas = element("canvas");
    			t0 = space();
    			main = element("main");
    			p = element("p");
    			p.textContent = "Representación Gráfica del consumo de gasolina medidos en Tonelada de petróleo por países del Año 2016.";
    			t2 = space();
    			create_component(button.$$.fragment);
    			attr_dev(canvas, "id", "myChart");
    			attr_dev(canvas, "width", "3");
    			attr_dev(canvas, "height", "1");
    			add_location(canvas, file$k, 0, 0, 0);
    			add_location(p, file$k, 60, 0, 2085);
    			add_location(main, file$k, 59, 0, 2077);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, p);
    			append_dev(main, t2);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph$1() {
    	const BASE_API_URL = "/api/v2/oil-coal-nuclear-energy-consumption-stats";
    	const resData = await fetch(BASE_API_URL);
    	let Data = await resData.json();

    	let years = Array.from(new Set(Data.map(d => {
    			return d.year;
    		})));

    	let countries = Array.from(new Set(Data.filter(d => d.year == 2016).map(d => {
    			return d.country;
    		})));

    	let oilconsumption = Array.from(new Set(Data.filter(d => d.year == 2016).map(d => {
    			return d["oil-consumption"];
    		})));

    	var ctx = document.getElementById("myChart");

    	var myChart = new Chart(ctx,
    	{
    			type: "bar",
    			data: {
    				labels: countries,
    				datasets: [
    					{
    						label: "Tonelada de petróleo equivalente",
    						data: oilconsumption,
    						backgroundColor: [
    							"rgba(255, 99, 132, 0.2)",
    							"rgba(54, 162, 235, 0.2)",
    							"rgba(255, 206, 86, 0.2)",
    							"rgba(75, 192, 192, 0.2)",
    							"rgba(153, 102, 255, 0.2)",
    							"rgba(255, 159, 64, 0.2)"
    						],
    						borderColor: [
    							"rgba(255, 99, 132, 1)",
    							"rgba(54, 162, 235, 1)",
    							"rgba(255, 206, 86, 1)",
    							"rgba(75, 192, 192, 1)",
    							"rgba(153, 102, 255, 1)",
    							"rgba(255, 159, 64, 1)"
    						],
    						borderWidth: 1
    					}
    				]
    			},
    			options: {
    				scales: {
    					yAxes: [{ ticks: { beginAtZero: true } }]
    				}
    			}
    		});
    }

    function instance$l($$self, $$props, $$invalidate) {
    	loadGraph$1();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChartOilCoal2> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ChartOilCoal2", $$slots, []);
    	$$self.$capture_state = () => ({ onMount, Button, pop, loadGraph: loadGraph$1 });
    	return [];
    }

    class ChartOilCoal2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChartOilCoal2",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\front\plugInVehiclesAPI\ChartPlugInVehicles.svelte generated by Svelte v3.20.1 */
    const file$l = "src\\front\\plugInVehiclesAPI\\ChartPlugInVehicles.svelte";

    // (213:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$8(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$l, 212, 55, 6886);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(213:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let script4;
    	let script4_src_value;
    	let t0;
    	let main;
    	let figure;
    	let div;
    	let t1;
    	let p0;
    	let t2;
    	let p1;
    	let t4;
    	let current;
    	let dispose;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			script4 = element("script");
    			t0 = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			t1 = space();
    			p0 = element("p");
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "En esta sección de la api podemos observar una representación gráfica acerca de los datos que tenemos sobre cada país\r\n            en relación con el uso de coches eléctricos, mostrando de azul las ventas acumuladas, de negro las ventas anuales y de verde\r\n            el porcentaje de coches cada 1000 personas.";
    			t4 = space();
    			create_component(button.$$.fragment);
    			if (script0.src !== (script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$l, 191, 8, 5773);
    			if (script1.src !== (script1_src_value = "https://code.highcharts.com/modules/series-label.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$l, 192, 8, 5868);
    			if (script2.src !== (script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$l, 193, 8, 5973);
    			if (script3.src !== (script3_src_value = "https://code.highcharts.com/modules/export-data.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$l, 194, 8, 6075);
    			if (script4.src !== (script4_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script4, "src", script4_src_value);
    			add_location(script4, file$l, 195, 8, 6179);
    			attr_dev(div, "id", "container");
    			add_location(div, file$l, 201, 8, 6365);
    			add_location(p0, file$l, 202, 8, 6401);
    			attr_dev(p1, "class", "highcharts-description");
    			add_location(p1, file$l, 205, 8, 6430);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$l, 200, 4, 6321);
    			add_location(main, file$l, 198, 0, 6303);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			append_dev(document.head, script4);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t1);
    			append_dev(figure, p0);
    			append_dev(figure, t2);
    			append_dev(figure, p1);
    			append_dev(main, t4);
    			mount_component(button, main, null);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(script0, "load", loadGraph$2, false, false, false),
    				listen_dev(script1, "load", loadGraph$2, false, false, false),
    				listen_dev(script2, "load", loadGraph$2, false, false, false),
    				listen_dev(script3, "load", loadGraph$2, false, false, false),
    				listen_dev(script4, "load", loadGraph$2, false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			detach_dev(script4);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph$2() {
    	const BASE_API_URL = "/api/v2/plugin-vehicles-stats";
    	let MyData = [];
    	const resData = await fetch(BASE_API_URL);
    	MyData = await resData.json();
    	let countries = [];
    	let pevStock = [];
    	let annualSale = [];
    	let carsPer1000 = [];

    	MyData.forEach(data => {
    		let country = data.country;
    		let year = data.year;
    		let p = data["pev-stock"];
    		let a = data["annual-sale"];
    		let c = data["cars-per-1000"];

    		if (data.year == 2018) {
    			countries.push(country);
    			pevStock.push(p);
    			annualSale.push(a);
    			carsPer1000.push(c);
    		}
    	});

    	/*
            { 
    			"country": "Japan",
    			"year": 2018,
    			"pev-stock": 257363,
    			"annual-sale": 52013,
    			"cars-per-1000": 2.0
    		}
            
            */
    	Highcharts.chart("container", {
    		chart: { zoomType: "xy" },
    		title: {
    			text: "Gráfica sobre datos de coches eléctricos.",
    			align: "left"
    		},
    		subtitle: {
    			text: "Datos sobre el año 2018:",
    			align: "left"
    		},
    		xAxis: [{ categories: countries, crosshair: true }],
    		yAxis: [
    			{
    				// Primary yAxis
    				labels: {
    					format: "{value} %",
    					style: { color: Highcharts.getOptions().colors[2] }
    				},
    				title: {
    					text: "Coches cada 1000 personas",
    					style: { color: Highcharts.getOptions().colors[2] }
    				},
    				opposite: true
    			},
    			{
    				// Secondary yAxis
    				gridLineWidth: 0,
    				title: {
    					text: "Ventas Acumuladas",
    					style: { color: Highcharts.getOptions().colors[0] }
    				},
    				labels: {
    					format: "{value} unidades",
    					style: { color: Highcharts.getOptions().colors[0] }
    				}
    			},
    			{
    				// Tertiary yAxis
    				gridLineWidth: 0,
    				title: {
    					text: "Ventas anuales",
    					style: { color: Highcharts.getOptions().colors[1] }
    				},
    				labels: {
    					format: "{value} unidades",
    					style: { color: Highcharts.getOptions().colors[1] }
    				},
    				opposite: true
    			}
    		],
    		tooltip: { shared: true },
    		legend: {
    			align: "left",
    			verticalAlign: "bottom",
    			y: 25,
    			floating: true,
    			backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || // theme
    			"rgba(255,255,255,0.25)"
    		},
    		series: [
    			{
    				name: "Ventas acumuladas",
    				type: "column",
    				yAxis: 1,
    				data: pevStock,
    				tooltip: { valueSuffix: " unidades" }
    			},
    			{
    				name: "Ventas anuales",
    				type: "spline",
    				yAxis: 2,
    				data: annualSale,
    				marker: { enabled: false },
    				dashStyle: "shortdot",
    				tooltip: { valueSuffix: " unidades" }
    			},
    			{
    				name: "Coches cada 1000 personas",
    				type: "spline",
    				data: carsPer1000,
    				tooltip: { valueSuffix: " %" }
    			}
    		],
    		responsive: {
    			rules: [
    				{
    					condition: { maxWidth: 500 },
    					chartOptions: {
    						legend: {
    							floating: false,
    							layout: "horizontal",
    							align: "center",
    							verticalAlign: "bottom",
    							x: 0,
    							y: 0
    						},
    						yAxis: [
    							{
    								labels: { align: "right", x: 0, y: -6 },
    								showLastLabel: false
    							},
    							{
    								labels: { align: "left", x: 0, y: -6 },
    								showLastLabel: false
    							},
    							{ visible: false }
    						]
    					}
    				}
    			]
    		}
    	});
    }

    function instance$m($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChartPlugInVehicles> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ChartPlugInVehicles", $$slots, []);
    	$$self.$capture_state = () => ({ pop, Button, loadGraph: loadGraph$2 });
    	return [];
    }

    class ChartPlugInVehicles extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChartPlugInVehicles",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src\front\plugInVehiclesAPI\ChartOutPlugInVehicles.svelte generated by Svelte v3.20.1 */
    const file$m = "src\\front\\plugInVehiclesAPI\\ChartOutPlugInVehicles.svelte";

    // (76:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$9(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$m, 75, 55, 2371);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(76:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let t0;
    	let main;
    	let div;
    	let t1;
    	let p0;
    	let t2;
    	let p1;
    	let t4;
    	let current;
    	let dispose;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			t0 = space();
    			main = element("main");
    			div = element("div");
    			t1 = space();
    			p0 = element("p");
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "Representación gráfica realizada con RGraph que nos muestra el porcentaje de coches electricos en el año 2018";
    			t4 = space();
    			create_component(button.$$.fragment);
    			if (script0.src !== (script0_src_value = "libraries/RGraph.svg.common.core.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$m, 65, 4, 1918);
    			if (script1.src !== (script1_src_value = "libraries/RGraph.svg.line.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$m, 66, 4, 2003);
    			set_style(div, "width", "750px");
    			set_style(div, "height", "250px");
    			attr_dev(div, "id", "chart-container");
    			add_location(div, file$m, 72, 4, 2111);
    			add_location(p0, file$m, 73, 4, 2185);
    			add_location(p1, file$m, 74, 4, 2198);
    			add_location(main, file$m, 70, 0, 2097);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(main, t1);
    			append_dev(main, p0);
    			append_dev(main, t2);
    			append_dev(main, p1);
    			append_dev(main, t4);
    			mount_component(button, main, null);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(script0, "load", loadGraph$3, false, false, false),
    				listen_dev(script1, "load", loadGraph$3, false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph$3() {
    	const BASE_API_URL = "/api/v2/plugin-vehicles-stats";
    	let MyData = [];
    	const resData = await fetch(BASE_API_URL);
    	MyData = await resData.json();
    	let countries = [];
    	let carsPer1000 = [];

    	MyData.forEach(data => {
    		let country = data.country;
    		let year = data.year;
    		let p = data["pev-stock"];
    		let a = data["annual-sale"];
    		let c = data["cars-per-1000"];

    		if (data.year == 2018) {
    			countries.push(country);
    			carsPer1000.push(c);
    		}
    	});

    	new RGraph.SVG.Line({
    			id: "chart-container",
    			data: carsPer1000,
    			options: {
    				backgroundColor: "#eee",
    				backgroundGridColor: "blue",
    				backgroundGridVlinesCount: 20,
    				backgroundGridLinewidth: 1,
    				colors: ["black"],
    				tickmarksStyle: "filledcircle",
    				xaxis: true,
    				yaxis: true,
    				yaxisScaleUnitsPost: "%",
    				textSize: 9,
    				xaxisLabels: countries
    			}
    		}).trace().responsive([
    		{
    			maxWidth: 900, // Use the trace() animation to show the chart and add some responsive capability
    			width: 450,
    			height: 200,
    			options: { linewidth: 2, tickmarksSize: 5 }
    		},
    		{
    			maxWidth: null,
    			width: 600,
    			height: 250,
    			options: { linewidth: 3, tickmarksSize: 6 }
    		}
    	]);
    }

    function instance$n($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChartOutPlugInVehicles> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ChartOutPlugInVehicles", $$slots, []);
    	$$self.$capture_state = () => ({ pop, Button, loadGraph: loadGraph$3 });
    	return [];
    }

    class ChartOutPlugInVehicles extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChartOutPlugInVehicles",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src\front\renewableSourcesAPI\ChartRenewableSources.svelte generated by Svelte v3.20.1 */
    const file$n = "src\\front\\renewableSourcesAPI\\ChartRenewableSources.svelte";

    // (148:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$a(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$n, 147, 56, 4375);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(148:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let t0;
    	let main;
    	let figure;
    	let div;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t4;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Gráfica que representa los datos de las energías renovables por países.";
    			t3 = space();
    			p1 = element("p");
    			t4 = space();
    			create_component(button.$$.fragment);
    			attr_dev(div, "id", "container");
    			add_location(div, file$n, 140, 8, 4118);
    			attr_dev(p0, "class", "highcharts-description");
    			add_location(p0, file$n, 141, 8, 4154);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$n, 139, 4, 4074);
    			add_location(p1, file$n, 146, 4, 4310);
    			add_location(main, file$n, 137, 0, 4056);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t1);
    			append_dev(figure, p0);
    			append_dev(main, t3);
    			append_dev(main, p1);
    			append_dev(main, t4);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph$4() {
    	/* Asking for the data to the back */
    	const BASE_API_URL = "/api/v2/renewable-sources-stats";

    	const resData = await fetch(BASE_API_URL);
    	let MyData = await resData.json();

    	/* Getting the countries */
    	let countries = Array.from(new Set(MyData.map(d => {
    			return d.country;
    		})));

    	/* Mapping the data in the right format */
    	/* The country must be an index of the array of countries */
    	/*  
    Turning this:

    {
        "country": "Country",
        "year": 2000,
        "percentage-re-total": 0.0,
        "percentage-hydropower-total": 0.0,
        "percentage-wind-power-total": 0.0
    }

    into this:

    [0, 2000, 0.0, 0.0, 0.0]
    The first 0 is the index of "Country" in the array of countries

    */
    	MyData = MyData.map(d => {
    		return [
    			countries.indexOf(d.country),
    			d.year,
    			d["percentage-re-total"],
    			d["percentage-hydropower-total"],
    			d["percentage-wind-power-total"]
    		];
    	});

    	/* 
    The following array turn this:
    [0, 2000, 0.0, 0.0, 0.0]

    into this:

    {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
    That is how the chart needs it
     */
    	let ChartData = MyData.map(function (set, i) {
    		return {
    			name: countries[set[0]],
    			data: set,
    			shadow: false
    		};
    	});

    	/* Setting the chart */
    	Highcharts.chart("container", {
    		chart: {
    			type: "spline",
    			parallelCoordinates: true,
    			parallelAxes: { lineWidth: 3 }
    		},
    		title: { text: "Energías renovables" },
    		plotOptions: {
    			series: {
    				animation: false,
    				marker: {
    					enabled: false,
    					states: { hover: { enabled: false } }
    				},
    				states: { hover: { halo: { size: 0 } } },
    				events: {
    					mouseOver() {
    						this.group.toFront();
    					}
    				}
    			}
    		},
    		tooltip: {
    			pointFormat: "<span style=\"color:{point.color}\">●</span>" + "{series.name}: <b>{point.formattedValue}</b><br/>"
    		},
    		xAxis: {
    			categories: [
    				"País",
    				"Año",
    				"Porcentaje de uso de energías renovables",
    				"Porcentaje de uso de energías hidroeléctricas",
    				"Porcentaje de uso de energías eólica"
    			],
    			offset: 10
    		},
    		yAxis: [
    			{
    				categories: countries,
    				tooltipValueFormat: "{value}"
    			},
    			{ min: 2000, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" }
    		],
    		colors: ["rgba(129, 131, 202, 0.8)"],
    		series: ChartData
    	});
    }

    function instance$o($$self, $$props, $$invalidate) {
    	loadGraph$4();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChartRenewableSources> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ChartRenewableSources", $$slots, []);
    	$$self.$capture_state = () => ({ Button, pop, loadGraph: loadGraph$4 });
    	return [];
    }

    class ChartRenewableSources extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChartRenewableSources",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src\front\renewableSourcesAPI\ChartRenewableSourcesBillboard.svelte generated by Svelte v3.20.1 */

    const { console: console_1$9 } = globals;
    const file$o = "src\\front\\renewableSourcesAPI\\ChartRenewableSourcesBillboard.svelte";

    // (87:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$b(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$o, 86, 56, 2024);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(87:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let t0;
    	let main;
    	let div;
    	let t1;
    	let p0;
    	let t2;
    	let p1;
    	let t4;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			div = element("div");
    			t1 = space();
    			p0 = element("p");
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "Gráfica utilizando billboard.js que representa el porcentaje de energía renovables por países de 2016.";
    			t4 = space();
    			create_component(button.$$.fragment);
    			attr_dev(div, "id", "gaugeChart");
    			add_location(div, file$o, 82, 4, 1809);
    			add_location(p0, file$o, 84, 4, 1844);
    			add_location(p1, file$o, 85, 4, 1857);
    			add_location(main, file$o, 79, 0, 1789);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(main, t1);
    			append_dev(main, p0);
    			append_dev(main, t2);
    			append_dev(main, p1);
    			append_dev(main, t4);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph$5() {
    	const BASE_API_URL = "/api/v2/renewable-sources-stats";
    	const resData = await fetch(BASE_API_URL);
    	let MyData = await resData.json();

    	let datachart = MyData.filter(d => d.year == 2016).map(d => {
    		return [d.country, d["percentage-re-total"]];
    	});

    	var chart = bb.generate({
    		data: {
    			columns: [],
    			type: "gauge",
    			onclick(d, i) {
    				console.log("onclick", d, i);
    			}
    		},
    		gauge: {},
    		color: {
    			pattern: ["#FF0000", "#F97600", "#F6C600", "#60B044"],
    			threshold: { values: [30, 60, 90, 100] }
    		},
    		size: { height: 300 },
    		bindto: "#gaugeChart"
    	});

    	/* Recursive function because settimeout doesnt work properly in loop  */
    	function loop_charting(i) {
    		setTimeout(
    			function () {
    				chart.load({ columns: [datachart[i]] });

    				if (i < datachart.length) {
    					loop_charting(i + 1);
    				}
    			},
    			1000
    		);
    	}

    	loop_charting(0);
    }

    function instance$p($$self, $$props, $$invalidate) {
    	loadGraph$5();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$9.warn(`<ChartRenewableSourcesBillboard> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ChartRenewableSourcesBillboard", $$slots, []);
    	$$self.$capture_state = () => ({ Button, pop, loadGraph: loadGraph$5 });
    	return [];
    }

    class ChartRenewableSourcesBillboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChartRenewableSourcesBillboard",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* src\front\CommonChart.svelte generated by Svelte v3.20.1 */
    const file$p = "src\\front\\CommonChart.svelte";

    // (128:1) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$c(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$p, 127, 52, 3122);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(128:1) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let t0;
    	let main;
    	let figure;
    	let div;
    	let t1;
    	let p;
    	let t3;
    	let current;
    	let dispose;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			t0 = space();
    			main = element("main");
    			figure = element("figure");
    			div = element("div");
    			t1 = space();
    			p = element("p");
    			p.textContent = "Gráfica común a las tres APIs. Muestra los millones de toneladas de petróleo, los porcentajes del uso energías renovables y las ventas coches eléctricos por cada 1000.";
    			t3 = space();
    			create_component(button.$$.fragment);
    			if (script0.src !== (script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$p, 111, 1, 2362);
    			if (script1.src !== (script1_src_value = "https://code.highcharts.com/highcharts-more.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$p, 112, 1, 2450);
    			if (script2.src !== (script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$p, 113, 1, 2543);
    			if (script3.src !== (script3_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$p, 114, 1, 2638);
    			attr_dev(div, "id", "container");
    			add_location(div, file$p, 121, 2, 2809);
    			attr_dev(p, "class", "highcharts-description");
    			add_location(p, file$p, 122, 2, 2839);
    			attr_dev(figure, "class", "highcharts-figure");
    			add_location(figure, file$p, 120, 1, 2771);
    			add_location(main, file$p, 118, 0, 2760);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, div);
    			append_dev(figure, t1);
    			append_dev(figure, p);
    			append_dev(main, t3);
    			mount_component(button, main, null);
    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(script0, "load", loadGraph$6, false, false, false),
    				listen_dev(script1, "load", loadGraph$6, false, false, false),
    				listen_dev(script2, "load", loadGraph$6, false, false, false),
    				listen_dev(script3, "load", loadGraph$6, false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph$6() {
    	const BASE_API_URL_1 = "/api/v2/oil-coal-nuclear-energy-consumption-stats";
    	const BASE_API_URL_2 = "/api/v2/renewable-sources-stats";
    	const BASE_API_URL_3 = "/api/v2/plugin-vehicles-stats";
    	const resDataPrimary = await fetch(BASE_API_URL_1);
    	const resDataRenewable = await fetch(BASE_API_URL_2);
    	const resDataPlugin = await fetch(BASE_API_URL_3);
    	let renewableData = await resDataRenewable.json();
    	let pluginData = await resDataPlugin.json();
    	let primaryData = await resDataPrimary.json();

    	let dataPlugin = pluginData.map(d => {
    		let res = {
    			name: d.country + " - " + d.year,
    			value: d["cars-per-1000"]
    		};

    		return res;
    	});

    	let dataPrimary = primaryData.map(d => {
    		let res = {
    			name: d.country + " - " + d.year,
    			value: d["oil-consumption"]
    		};

    		return res;
    	});

    	let dataRenewable = renewableData.map(d => {
    		let res = {
    			name: d.country + " - " + d.year,
    			value: d["percentage-re-total"]
    		};

    		return res;
    	});

    	let dataChart = [
    		{
    			name: "Porcentaje de coche eléctricos cada 1000 personas",
    			data: dataPlugin
    		},
    		{
    			name: "Millones de toneladas de petróleo",
    			data: dataPrimary
    		},
    		{
    			name: "Porcentaje de uso de energías renovables",
    			data: dataRenewable
    		}
    	];

    	Highcharts.chart("container", {
    		chart: { type: "packedbubble", height: "100%" },
    		title: {
    			text: "Carbon emissions around the world (2014)"
    		},
    		tooltip: {
    			useHTML: true,
    			pointFormat: "<b>{point.name}:</b> {point.value}"
    		},
    		plotOptions: {
    			packedbubble: {
    				minSize: "30%",
    				maxSize: "120%",
    				zMin: 0,
    				zMax: 1000,
    				layoutAlgorithm: {
    					splitSeries: false,
    					gravitationalConstant: 0.02
    				},
    				dataLabels: {
    					enabled: true,
    					format: "{point.name}",
    					filter: { property: "y", operator: ">", value: 250 },
    					style: {
    						color: "black",
    						textOutline: "none",
    						fontWeight: "normal"
    					}
    				}
    			}
    		},
    		series: dataChart
    	});
    }

    function instance$q($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CommonChart> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("CommonChart", $$slots, []);
    	$$self.$capture_state = () => ({ pop, Button, loadGraph: loadGraph$6 });
    	return [];
    }

    class CommonChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CommonChart",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src\front\efforts.svelte generated by Svelte v3.20.1 */
    const file$q = "src\\front\\efforts.svelte";

    // (14:1) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$d(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$q, 13, 52, 267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$d.name,
    		type: "slot",
    		source: "(14:1) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let main;
    	let h2;
    	let t1;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			h2 = element("h2");
    			h2.textContent = "Aquí estan nuestros esfuerzos para el proyecto";
    			t1 = space();
    			create_component(button.$$.fragment);
    			add_location(h2, file$q, 11, 1, 153);
    			add_location(main, file$q, 9, 0, 142);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(main, t1);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Efforts> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Efforts", $$slots, []);
    	$$self.$capture_state = () => ({ Button, pop });
    	return [];
    }

    class Efforts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Efforts",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* src\front\renewableSourcesAPI\Integrations.svelte generated by Svelte v3.20.1 */

    const { console: console_1$a } = globals;
    const file$r = "src\\front\\renewableSourcesAPI\\Integrations.svelte";

    // (2029:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$e(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$r, 2028, 56, 78685);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$e.name,
    		type: "slot",
    		source: "(2029:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let main;
    	let div30;
    	let div1;
    	let div0;
    	let a0;
    	let t1;
    	let a1;
    	let t3;
    	let a2;
    	let t5;
    	let a3;
    	let t7;
    	let a4;
    	let t9;
    	let a5;
    	let t11;
    	let a6;
    	let t13;
    	let a7;
    	let t15;
    	let a8;
    	let t17;
    	let a9;
    	let t19;
    	let a10;
    	let t21;
    	let a11;
    	let t23;
    	let a12;
    	let t25;
    	let div29;
    	let div28;
    	let div3;
    	let figure0;
    	let div2;
    	let t26;
    	let p0;
    	let t28;
    	let div5;
    	let figure1;
    	let div4;
    	let t29;
    	let p1;
    	let t31;
    	let div7;
    	let figure2;
    	let div6;
    	let t32;
    	let p2;
    	let t34;
    	let div9;
    	let figure3;
    	let div8;
    	let t35;
    	let p3;
    	let t37;
    	let div11;
    	let figure4;
    	let div10;
    	let t38;
    	let p4;
    	let t40;
    	let div13;
    	let figure5;
    	let div12;
    	let t41;
    	let p5;
    	let t43;
    	let div15;
    	let figure6;
    	let div14;
    	let t44;
    	let p6;
    	let t46;
    	let div17;
    	let figure7;
    	let div16;
    	let t47;
    	let p7;
    	let t49;
    	let div19;
    	let figure8;
    	let div18;
    	let t50;
    	let p8;
    	let t52;
    	let div21;
    	let figure9;
    	let div20;
    	let t53;
    	let p9;
    	let t55;
    	let div23;
    	let figure10;
    	let div22;
    	let t56;
    	let p10;
    	let t58;
    	let div25;
    	let figure11;
    	let div24;
    	let t59;
    	let p11;
    	let t61;
    	let div27;
    	let figure12;
    	let div26;
    	let t62;
    	let p12;
    	let t64;
    	let p13;
    	let t65;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$e] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div30 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			a0.textContent = "Integración con 7";
    			t1 = space();
    			a1 = element("a");
    			a1.textContent = "Integración con 27";
    			t3 = space();
    			a2 = element("a");
    			a2.textContent = "Integración con 5";
    			t5 = space();
    			a3 = element("a");
    			a3.textContent = "Integración con 4";
    			t7 = space();
    			a4 = element("a");
    			a4.textContent = "Integración con 22";
    			t9 = space();
    			a5 = element("a");
    			a5.textContent = "Integración con 1";
    			t11 = space();
    			a6 = element("a");
    			a6.textContent = "Integración con 30";
    			t13 = space();
    			a7 = element("a");
    			a7.textContent = "Integración con 23";
    			t15 = space();
    			a8 = element("a");
    			a8.textContent = "Integración con 25";
    			t17 = space();
    			a9 = element("a");
    			a9.textContent = "Integración con 8";
    			t19 = space();
    			a10 = element("a");
    			a10.textContent = "Integración con 6";
    			t21 = space();
    			a11 = element("a");
    			a11.textContent = "Integración con API externa 1";
    			t23 = space();
    			a12 = element("a");
    			a12.textContent = "Integración con API externa 2";
    			t25 = space();
    			div29 = element("div");
    			div28 = element("div");
    			div3 = element("div");
    			figure0 = element("figure");
    			div2 = element("div");
    			t26 = space();
    			p0 = element("p");
    			p0.textContent = "Integración con el grupo 7, la integración está realizada con la importaciones de vegetales y preparados.";
    			t28 = space();
    			div5 = element("div");
    			figure1 = element("figure");
    			div4 = element("div");
    			t29 = space();
    			p1 = element("p");
    			p1.textContent = "Integra la 27.";
    			t31 = space();
    			div7 = element("div");
    			figure2 = element("figure");
    			div6 = element("div");
    			t32 = space();
    			p2 = element("p");
    			p2.textContent = "Integra la 5.";
    			t34 = space();
    			div9 = element("div");
    			figure3 = element("figure");
    			div8 = element("div");
    			t35 = space();
    			p3 = element("p");
    			p3.textContent = "Integra la 4.";
    			t37 = space();
    			div11 = element("div");
    			figure4 = element("figure");
    			div10 = element("div");
    			t38 = space();
    			p4 = element("p");
    			p4.textContent = "Integra la 22.";
    			t40 = space();
    			div13 = element("div");
    			figure5 = element("figure");
    			div12 = element("div");
    			t41 = space();
    			p5 = element("p");
    			p5.textContent = "Integra la 1.";
    			t43 = space();
    			div15 = element("div");
    			figure6 = element("figure");
    			div14 = element("div");
    			t44 = space();
    			p6 = element("p");
    			p6.textContent = "Integra la 30.";
    			t46 = space();
    			div17 = element("div");
    			figure7 = element("figure");
    			div16 = element("div");
    			t47 = space();
    			p7 = element("p");
    			p7.textContent = "Integra la 23.";
    			t49 = space();
    			div19 = element("div");
    			figure8 = element("figure");
    			div18 = element("div");
    			t50 = space();
    			p8 = element("p");
    			p8.textContent = "Integra la 25.";
    			t52 = space();
    			div21 = element("div");
    			figure9 = element("figure");
    			div20 = element("div");
    			t53 = space();
    			p9 = element("p");
    			p9.textContent = "Integra la 8.";
    			t55 = space();
    			div23 = element("div");
    			figure10 = element("figure");
    			div22 = element("div");
    			t56 = space();
    			p10 = element("p");
    			p10.textContent = "Integra la 6.";
    			t58 = space();
    			div25 = element("div");
    			figure11 = element("figure");
    			div24 = element("div");
    			t59 = space();
    			p11 = element("p");
    			p11.textContent = "Integración con la una API externa que proporciona el área (en kilómetros cuadrados) de los países.";
    			t61 = space();
    			div27 = element("div");
    			figure12 = element("figure");
    			div26 = element("div");
    			t62 = space();
    			p12 = element("p");
    			p12.textContent = "Integración con la una API externa que proporciona la moneda utilizada de los países.";
    			t64 = space();
    			p13 = element("p");
    			t65 = space();
    			create_component(button.$$.fragment);
    			attr_dev(a0, "class", "list-group-item list-group-item-action active");
    			attr_dev(a0, "id", "list-home-list");
    			attr_dev(a0, "data-toggle", "list");
    			attr_dev(a0, "href", "#list-7");
    			attr_dev(a0, "role", "tab");
    			attr_dev(a0, "aria-controls", "home");
    			add_location(a0, file$r, 1896, 12, 70876);
    			attr_dev(a1, "class", "list-group-item list-group-item-action");
    			attr_dev(a1, "id", "list-profile-list");
    			attr_dev(a1, "data-toggle", "list");
    			attr_dev(a1, "href", "#list-27");
    			attr_dev(a1, "role", "tab");
    			attr_dev(a1, "aria-controls", "profile");
    			add_location(a1, file$r, 1897, 12, 71054);
    			attr_dev(a2, "class", "list-group-item list-group-item-action");
    			attr_dev(a2, "id", "list-profile-list");
    			attr_dev(a2, "data-toggle", "list");
    			attr_dev(a2, "href", "#list-5");
    			attr_dev(a2, "role", "tab");
    			attr_dev(a2, "aria-controls", "profile");
    			add_location(a2, file$r, 1898, 12, 71233);
    			attr_dev(a3, "class", "list-group-item list-group-item-action");
    			attr_dev(a3, "id", "list-profile-list");
    			attr_dev(a3, "data-toggle", "list");
    			attr_dev(a3, "href", "#list-4");
    			attr_dev(a3, "role", "tab");
    			attr_dev(a3, "aria-controls", "profile");
    			add_location(a3, file$r, 1899, 12, 71410);
    			attr_dev(a4, "class", "list-group-item list-group-item-action");
    			attr_dev(a4, "id", "list-profile-list");
    			attr_dev(a4, "data-toggle", "list");
    			attr_dev(a4, "href", "#list-22");
    			attr_dev(a4, "role", "tab");
    			attr_dev(a4, "aria-controls", "profile");
    			add_location(a4, file$r, 1900, 12, 71587);
    			attr_dev(a5, "class", "list-group-item list-group-item-action");
    			attr_dev(a5, "id", "list-profile-list");
    			attr_dev(a5, "data-toggle", "list");
    			attr_dev(a5, "href", "#list-1");
    			attr_dev(a5, "role", "tab");
    			attr_dev(a5, "aria-controls", "profile");
    			add_location(a5, file$r, 1901, 12, 71766);
    			attr_dev(a6, "class", "list-group-item list-group-item-action");
    			attr_dev(a6, "id", "list-profile-list");
    			attr_dev(a6, "data-toggle", "list");
    			attr_dev(a6, "href", "#list-30");
    			attr_dev(a6, "role", "tab");
    			attr_dev(a6, "aria-controls", "profile");
    			add_location(a6, file$r, 1902, 12, 71944);
    			attr_dev(a7, "class", "list-group-item list-group-item-action");
    			attr_dev(a7, "id", "list-profile-list");
    			attr_dev(a7, "data-toggle", "list");
    			attr_dev(a7, "href", "#list-23");
    			attr_dev(a7, "role", "tab");
    			attr_dev(a7, "aria-controls", "profile");
    			add_location(a7, file$r, 1903, 12, 72124);
    			attr_dev(a8, "class", "list-group-item list-group-item-action");
    			attr_dev(a8, "id", "list-profile-list");
    			attr_dev(a8, "data-toggle", "list");
    			attr_dev(a8, "href", "#list-25");
    			attr_dev(a8, "role", "tab");
    			attr_dev(a8, "aria-controls", "profile");
    			add_location(a8, file$r, 1904, 12, 72304);
    			attr_dev(a9, "class", "list-group-item list-group-item-action");
    			attr_dev(a9, "id", "list-profile-list");
    			attr_dev(a9, "data-toggle", "list");
    			attr_dev(a9, "href", "#list-8");
    			attr_dev(a9, "role", "tab");
    			attr_dev(a9, "aria-controls", "profile");
    			add_location(a9, file$r, 1905, 12, 72484);
    			attr_dev(a10, "class", "list-group-item list-group-item-action");
    			attr_dev(a10, "id", "list-profile-list");
    			attr_dev(a10, "data-toggle", "list");
    			attr_dev(a10, "href", "#list-6");
    			attr_dev(a10, "role", "tab");
    			attr_dev(a10, "aria-controls", "profile");
    			add_location(a10, file$r, 1906, 12, 72662);
    			attr_dev(a11, "class", "list-group-item list-group-item-action");
    			attr_dev(a11, "id", "list-profile-list");
    			attr_dev(a11, "data-toggle", "list");
    			attr_dev(a11, "href", "#list-ext1");
    			attr_dev(a11, "role", "tab");
    			attr_dev(a11, "aria-controls", "profile");
    			add_location(a11, file$r, 1910, 12, 72845);
    			attr_dev(a12, "class", "list-group-item list-group-item-action");
    			attr_dev(a12, "id", "list-profile-list");
    			attr_dev(a12, "data-toggle", "list");
    			attr_dev(a12, "href", "#list-ext2");
    			attr_dev(a12, "role", "tab");
    			attr_dev(a12, "aria-controls", "profile");
    			add_location(a12, file$r, 1911, 12, 73038);
    			attr_dev(div0, "class", "list-group");
    			attr_dev(div0, "id", "list-tab");
    			attr_dev(div0, "role", "tablist");
    			add_location(div0, file$r, 1895, 10, 70809);
    			attr_dev(div1, "class", "col-4");
    			add_location(div1, file$r, 1894, 8, 70778);
    			attr_dev(div2, "id", "container-7");
    			add_location(div2, file$r, 1919, 20, 73525);
    			attr_dev(p0, "class", "highcharts-description");
    			add_location(p0, file$r, 1920, 20, 73575);
    			attr_dev(figure0, "class", "highcharts-figure");
    			add_location(figure0, file$r, 1918, 16, 73469);
    			attr_dev(div3, "class", "tab-pane fade show active");
    			attr_dev(div3, "id", "list-7");
    			attr_dev(div3, "role", "tabpanel");
    			attr_dev(div3, "aria-labelledby", "list-home-list");
    			add_location(div3, file$r, 1917, 12, 73351);
    			attr_dev(div4, "id", "container-27");
    			add_location(div4, file$r, 1927, 20, 73993);
    			attr_dev(p1, "class", "highcharts-description");
    			add_location(p1, file$r, 1928, 20, 74044);
    			attr_dev(figure1, "class", "highcharts-figure");
    			add_location(figure1, file$r, 1926, 16, 73937);
    			attr_dev(div5, "class", "tab-pane fade");
    			attr_dev(div5, "id", "list-27");
    			attr_dev(div5, "role", "tabpanel");
    			attr_dev(div5, "aria-labelledby", "list-profile-list");
    			add_location(div5, file$r, 1925, 12, 73827);
    			attr_dev(div6, "id", "container-5");
    			add_location(div6, file$r, 1935, 20, 74370);
    			attr_dev(p2, "class", "highcharts-description");
    			add_location(p2, file$r, 1936, 20, 74420);
    			attr_dev(figure2, "class", "highcharts-figure");
    			add_location(figure2, file$r, 1934, 16, 74314);
    			attr_dev(div7, "class", "tab-pane fade");
    			attr_dev(div7, "id", "list-5");
    			attr_dev(div7, "role", "tabpanel");
    			attr_dev(div7, "aria-labelledby", "list-profile-list");
    			add_location(div7, file$r, 1933, 12, 74205);
    			attr_dev(div8, "id", "container-4");
    			add_location(div8, file$r, 1943, 20, 74745);
    			attr_dev(p3, "class", "highcharts-description");
    			add_location(p3, file$r, 1944, 20, 74795);
    			attr_dev(figure3, "class", "highcharts-figure");
    			add_location(figure3, file$r, 1942, 16, 74689);
    			attr_dev(div9, "class", "tab-pane fade");
    			attr_dev(div9, "id", "list-4");
    			attr_dev(div9, "role", "tabpanel");
    			attr_dev(div9, "aria-labelledby", "list-profile-list");
    			add_location(div9, file$r, 1941, 12, 74580);
    			attr_dev(div10, "id", "container-22");
    			add_location(div10, file$r, 1951, 20, 75121);
    			attr_dev(p4, "class", "highcharts-description");
    			add_location(p4, file$r, 1952, 20, 75172);
    			attr_dev(figure4, "class", "highcharts-figure");
    			add_location(figure4, file$r, 1950, 16, 75065);
    			attr_dev(div11, "class", "tab-pane fade");
    			attr_dev(div11, "id", "list-22");
    			attr_dev(div11, "role", "tabpanel");
    			attr_dev(div11, "aria-labelledby", "list-profile-list");
    			add_location(div11, file$r, 1949, 12, 74955);
    			attr_dev(div12, "id", "container-1");
    			add_location(div12, file$r, 1959, 20, 75498);
    			attr_dev(p5, "class", "highcharts-description");
    			add_location(p5, file$r, 1960, 20, 75548);
    			attr_dev(figure5, "class", "highcharts-figure");
    			add_location(figure5, file$r, 1958, 16, 75442);
    			attr_dev(div13, "class", "tab-pane fade");
    			attr_dev(div13, "id", "list-1");
    			attr_dev(div13, "role", "tabpanel");
    			attr_dev(div13, "aria-labelledby", "list-profile-list");
    			add_location(div13, file$r, 1957, 12, 75333);
    			attr_dev(div14, "id", "container-30");
    			add_location(div14, file$r, 1967, 20, 75874);
    			attr_dev(p6, "class", "highcharts-description");
    			add_location(p6, file$r, 1968, 20, 75925);
    			attr_dev(figure6, "class", "highcharts-figure");
    			add_location(figure6, file$r, 1966, 16, 75818);
    			attr_dev(div15, "class", "tab-pane fade");
    			attr_dev(div15, "id", "list-30");
    			attr_dev(div15, "role", "tabpanel");
    			attr_dev(div15, "aria-labelledby", "list-profile-list");
    			add_location(div15, file$r, 1965, 12, 75708);
    			attr_dev(div16, "id", "container-23");
    			add_location(div16, file$r, 1975, 20, 76252);
    			attr_dev(p7, "class", "highcharts-description");
    			add_location(p7, file$r, 1976, 20, 76303);
    			attr_dev(figure7, "class", "highcharts-figure");
    			add_location(figure7, file$r, 1974, 16, 76196);
    			attr_dev(div17, "class", "tab-pane fade");
    			attr_dev(div17, "id", "list-23");
    			attr_dev(div17, "role", "tabpanel");
    			attr_dev(div17, "aria-labelledby", "list-profile-list");
    			add_location(div17, file$r, 1973, 12, 76086);
    			attr_dev(div18, "id", "container-25");
    			add_location(div18, file$r, 1983, 20, 76630);
    			attr_dev(p8, "class", "highcharts-description");
    			add_location(p8, file$r, 1984, 20, 76681);
    			attr_dev(figure8, "class", "highcharts-figure");
    			add_location(figure8, file$r, 1982, 16, 76574);
    			attr_dev(div19, "class", "tab-pane fade");
    			attr_dev(div19, "id", "list-25");
    			attr_dev(div19, "role", "tabpanel");
    			attr_dev(div19, "aria-labelledby", "list-profile-list");
    			add_location(div19, file$r, 1981, 12, 76464);
    			attr_dev(div20, "id", "container-8");
    			add_location(div20, file$r, 1991, 20, 77007);
    			attr_dev(p9, "class", "highcharts-description");
    			add_location(p9, file$r, 1992, 20, 77057);
    			attr_dev(figure9, "class", "highcharts-figure");
    			add_location(figure9, file$r, 1990, 16, 76951);
    			attr_dev(div21, "class", "tab-pane fade");
    			attr_dev(div21, "id", "list-8");
    			attr_dev(div21, "role", "tabpanel");
    			attr_dev(div21, "aria-labelledby", "list-profile-list");
    			add_location(div21, file$r, 1989, 12, 76842);
    			attr_dev(div22, "id", "container-6");
    			add_location(div22, file$r, 1999, 20, 77382);
    			attr_dev(p10, "class", "highcharts-description");
    			add_location(p10, file$r, 2000, 20, 77432);
    			attr_dev(figure10, "class", "highcharts-figure");
    			add_location(figure10, file$r, 1998, 16, 77326);
    			attr_dev(div23, "class", "tab-pane fade");
    			attr_dev(div23, "id", "list-6");
    			attr_dev(div23, "role", "tabpanel");
    			attr_dev(div23, "aria-labelledby", "list-profile-list");
    			add_location(div23, file$r, 1997, 12, 77217);
    			attr_dev(div24, "id", "container-ext1");
    			add_location(div24, file$r, 2008, 20, 77774);
    			attr_dev(p11, "class", "highcharts-description");
    			add_location(p11, file$r, 2009, 20, 77827);
    			attr_dev(figure11, "class", "highcharts-figure");
    			add_location(figure11, file$r, 2007, 16, 77718);
    			attr_dev(div25, "class", "tab-pane fade");
    			attr_dev(div25, "id", "list-ext1");
    			attr_dev(div25, "role", "tabpanel");
    			attr_dev(div25, "aria-labelledby", "list-profile-list");
    			add_location(div25, file$r, 2006, 12, 77606);
    			attr_dev(div26, "id", "container-ext2");
    			add_location(div26, file$r, 2017, 20, 78267);
    			attr_dev(p12, "class", "highcharts-description");
    			add_location(p12, file$r, 2018, 20, 78320);
    			attr_dev(figure12, "class", "highcharts-figure");
    			add_location(figure12, file$r, 2016, 16, 78211);
    			attr_dev(div27, "class", "tab-pane fade");
    			attr_dev(div27, "id", "list-ext2");
    			attr_dev(div27, "role", "tabpanel");
    			attr_dev(div27, "aria-labelledby", "list-profile-list");
    			add_location(div27, file$r, 2015, 12, 78099);
    			attr_dev(div28, "class", "tab-content");
    			attr_dev(div28, "id", "nav-tabContent");
    			add_location(div28, file$r, 1916, 10, 73292);
    			attr_dev(div29, "class", "col-8");
    			add_location(div29, file$r, 1915, 8, 73261);
    			attr_dev(div30, "class", "row");
    			add_location(div30, file$r, 1893, 4, 70751);
    			add_location(p13, file$r, 2027, 6, 78620);
    			add_location(main, file$r, 1892, 0, 70739);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div30);
    			append_dev(div30, div1);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(div0, t1);
    			append_dev(div0, a1);
    			append_dev(div0, t3);
    			append_dev(div0, a2);
    			append_dev(div0, t5);
    			append_dev(div0, a3);
    			append_dev(div0, t7);
    			append_dev(div0, a4);
    			append_dev(div0, t9);
    			append_dev(div0, a5);
    			append_dev(div0, t11);
    			append_dev(div0, a6);
    			append_dev(div0, t13);
    			append_dev(div0, a7);
    			append_dev(div0, t15);
    			append_dev(div0, a8);
    			append_dev(div0, t17);
    			append_dev(div0, a9);
    			append_dev(div0, t19);
    			append_dev(div0, a10);
    			append_dev(div0, t21);
    			append_dev(div0, a11);
    			append_dev(div0, t23);
    			append_dev(div0, a12);
    			append_dev(div30, t25);
    			append_dev(div30, div29);
    			append_dev(div29, div28);
    			append_dev(div28, div3);
    			append_dev(div3, figure0);
    			append_dev(figure0, div2);
    			append_dev(figure0, t26);
    			append_dev(figure0, p0);
    			append_dev(div28, t28);
    			append_dev(div28, div5);
    			append_dev(div5, figure1);
    			append_dev(figure1, div4);
    			append_dev(figure1, t29);
    			append_dev(figure1, p1);
    			append_dev(div28, t31);
    			append_dev(div28, div7);
    			append_dev(div7, figure2);
    			append_dev(figure2, div6);
    			append_dev(figure2, t32);
    			append_dev(figure2, p2);
    			append_dev(div28, t34);
    			append_dev(div28, div9);
    			append_dev(div9, figure3);
    			append_dev(figure3, div8);
    			append_dev(figure3, t35);
    			append_dev(figure3, p3);
    			append_dev(div28, t37);
    			append_dev(div28, div11);
    			append_dev(div11, figure4);
    			append_dev(figure4, div10);
    			append_dev(figure4, t38);
    			append_dev(figure4, p4);
    			append_dev(div28, t40);
    			append_dev(div28, div13);
    			append_dev(div13, figure5);
    			append_dev(figure5, div12);
    			append_dev(figure5, t41);
    			append_dev(figure5, p5);
    			append_dev(div28, t43);
    			append_dev(div28, div15);
    			append_dev(div15, figure6);
    			append_dev(figure6, div14);
    			append_dev(figure6, t44);
    			append_dev(figure6, p6);
    			append_dev(div28, t46);
    			append_dev(div28, div17);
    			append_dev(div17, figure7);
    			append_dev(figure7, div16);
    			append_dev(figure7, t47);
    			append_dev(figure7, p7);
    			append_dev(div28, t49);
    			append_dev(div28, div19);
    			append_dev(div19, figure8);
    			append_dev(figure8, div18);
    			append_dev(figure8, t50);
    			append_dev(figure8, p8);
    			append_dev(div28, t52);
    			append_dev(div28, div21);
    			append_dev(div21, figure9);
    			append_dev(figure9, div20);
    			append_dev(figure9, t53);
    			append_dev(figure9, p9);
    			append_dev(div28, t55);
    			append_dev(div28, div23);
    			append_dev(div23, figure10);
    			append_dev(figure10, div22);
    			append_dev(figure10, t56);
    			append_dev(figure10, p10);
    			append_dev(div28, t58);
    			append_dev(div28, div25);
    			append_dev(div25, figure11);
    			append_dev(figure11, div24);
    			append_dev(figure11, t59);
    			append_dev(figure11, p11);
    			append_dev(div28, t61);
    			append_dev(div28, div27);
    			append_dev(div27, figure12);
    			append_dev(figure12, div26);
    			append_dev(figure12, t62);
    			append_dev(figure12, p12);
    			append_dev(main, t64);
    			append_dev(main, p13);
    			append_dev(main, t65);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph7() {
    	/* Asking for the data to the back */
    	const BASE_API_URL = "/api/v4/renewable-sources-stats";

    	const BASE_API_URL_7 = "/api/v2/foodsImports";
    	const resData = await fetch(BASE_API_URL);
    	const resData7 = await fetch(BASE_API_URL_7);
    	let MyData = await resData.json();
    	let Data7 = await resData7.json();

    	/* Getting the countries */
    	/* Turning them into upper case because the integration needs it */
    	let countries = Array.from(new Set(MyData.map(d => {
    			return d.country.toUpperCase();
    		})));

    	/* Mapping the data in the right format */
    	/* The country must be an index of the array of countries */
    	/*  
    Turning this:
        
    {
        "country": "COUNTRY",
        "year": 2000,
        "percentage-re-total": 0.0,
        "percentage-hydropower-total": 0.0,
        "percentage-wind-power-total": 0.0
    }
        
    into this:
        
    [0, 2000, 0.0, 0.0, 0.0]
    The first 0 is the index of "Country" in the array of countries

    */
    	MyData = MyData.map(d => {
    		return [
    			countries.indexOf(d.country.toUpperCase()),
    			d.year,
    			d["percentage-re-total"],
    			d["percentage-hydropower-total"],
    			d["percentage-wind-power-total"]
    		];
    	});

    	/* To integrate the data, we find the Data in the integration wich match with the year and the country */
    	MyData = MyData.filter(d => {
    		return Data7.find(d7 => d7.name == countries[d[0]] && parseInt(d7.year) == d[1]);
    	}).map(d => {
    		return [
    			d[0],
    			d[1],
    			d[2],
    			d[3],
    			d[4],
    			Data7.find(d7 => d7.name == countries[d[0]] && parseInt(d7.year) == d[1])["TVegANDPrep"]
    		];
    	});

    	/* 
    The following array turn this:
    [0, 2000, 0.0, 0.0, 0.0]
        
    into this:
        
    {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
    That is how the chart needs it
     */
    	let ChartData = MyData.map(function (set, i) {
    		return {
    			name: countries[set[0]],
    			data: set,
    			shadow: false
    		};
    	});

    	/* Setting the chart */
    	Highcharts.chart("container-7", {
    		chart: {
    			type: "spline",
    			parallelCoordinates: true,
    			parallelAxes: { lineWidth: 3 }
    		},
    		title: {
    			text: "Energías renovables e importaciones"
    		},
    		plotOptions: {
    			series: {
    				animation: false,
    				marker: {
    					enabled: false,
    					states: { hover: { enabled: false } }
    				},
    				states: { hover: { halo: { size: 0 } } },
    				events: {
    					mouseOver() {
    						this.group.toFront();
    					}
    				}
    			}
    		},
    		tooltip: {
    			pointFormat: "<span style=\"color:{point.color}\">●</span>" + "{series.name}: <b>{point.formattedValue}</b><br/>"
    		},
    		xAxis: {
    			categories: [
    				"País",
    				"Año",
    				"Porcentaje de uso de energías renovables",
    				"Porcentaje de uso de energías hidroeléctricas",
    				"Porcentaje de uso de energías eólica",
    				"Vegetales y preparados"
    			],
    			offset: 10
    		},
    		yAxis: [
    			{
    				categories: countries,
    				tooltipValueFormat: "{value}"
    			},
    			{ min: 2000, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value}" }
    		],
    		colors: ["rgba(129, 131, 202, 0.8)"],
    		series: ChartData
    	});
    }

    async function loadGraph4() {
    	console.log("Loading 4");

    	/* Asking for the data to the back */
    	const BASE_API_URL = "/api/v4/renewable-sources-stats";

    	const BASE_API_URL_4 = "https://sos1920-04.herokuapp.com/api/v1/vehicles";
    	const resData = await fetch(BASE_API_URL);
    	const resData4 = await fetch(BASE_API_URL_4);
    	let MyData = await resData.json();
    	let Data4 = await resData4.json();

    	/* Getting the countries */
    	/* Turning them into upper case because the integration needs it */
    	let countries = Array.from(new Set(MyData.map(d => {
    			return d.country;
    		})));

    	let provinces = Array.from(new Set(Data4.map(d => {
    			return d.province;
    		})));

    	/* Mapping the data in the right format */
    	/* The country must be an index of the array of countries */
    	/*  
    Turning this:
        
    {
        "country": "COUNTRY",
        "year": 2000,
        "percentage-re-total": 0.0,
        "percentage-hydropower-total": 0.0,
        "percentage-wind-power-total": 0.0
    }
        
    into this:
        
    [0, 2000, 0.0, 0.0, 0.0]
    The first 0 is the index of "Country" in the array of countries

    */
    	/* In the filter we put Spain to get only the Spain data and the years that are present in both APIs */
    	MyData = MyData.filter(d => {
    		return d.country == "Spain" && Data4.find(d4 => d4.year == d.year);
    	}).map(d => {
    		return [
    			countries.indexOf(d.country),
    			d.year,
    			d["percentage-re-total"],
    			d["percentage-hydropower-total"],
    			d["percentage-wind-power-total"]
    		];
    	});

    	let ModifiedData = [];

    	for (let i = 0; i < MyData.length; i++) {
    		Data4.filter(d => d.year == MyData[i][1]).forEach(dataMatchesYear => {
    			ModifiedData.push([
    				MyData[i][0],
    				provinces.indexOf(dataMatchesYear.province),
    				MyData[i][1],
    				MyData[i][2],
    				MyData[i][3],
    				MyData[i][4],
    				dataMatchesYear["car"]
    			]);
    		});
    	}

    	/* 
    The following array turn this:
    [0, 2000, 0.0, 0.0, 0.0]
        
    into this:
        
    {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
    That is how the chart needs it
     */
    	let ChartData = MyData.map(function (set, i) {
    		return {
    			name: countries[set[0]],
    			data: set,
    			shadow: false
    		};
    	});

    	/* Setting the chart */
    	Highcharts.chart("container-4", {
    		chart: {
    			type: "spline",
    			parallelCoordinates: true,
    			parallelAxes: { lineWidth: 3 }
    		},
    		title: {
    			text: "Energías renovables y número de coches"
    		},
    		plotOptions: {
    			series: {
    				animation: false,
    				marker: {
    					enabled: false,
    					states: { hover: { enabled: false } }
    				},
    				states: { hover: { halo: { size: 0 } } },
    				events: {
    					mouseOver() {
    						this.group.toFront();
    					}
    				}
    			}
    		},
    		tooltip: {
    			pointFormat: "<span style=\"color:{point.color}\">●</span>" + "{series.name}: <b>{point.formattedValue}</b><br/>"
    		},
    		xAxis: {
    			categories: [
    				"País",
    				"Provincias",
    				"Año",
    				"Porcentaje de uso de energías renovables",
    				"Porcentaje de uso de energías hidroeléctricas",
    				"Porcentaje de uso de energías eólica",
    				"Número de coches"
    			],
    			offset: 10
    		},
    		yAxis: [
    			{
    				categories: countries,
    				tooltipValueFormat: "{value}"
    			},
    			{
    				categories: provinces,
    				tooltipValueFormat: "{value}"
    			},
    			{ min: 2000, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value}" }
    		],
    		colors: ["rgba(129, 131, 202, 0.8)"],
    		series: ChartData
    	});
    }

    async function loadGraph27() {
    	console.log("Loading 27");

    	/* Asking for the data to the back */
    	const BASE_API_URL = "/api/v4/renewable-sources-stats";

    	const BASE_API_URL_27 = "https://sos1920-27.herokuapp.com/api/v2/lq-stats";
    	const resData = await fetch(BASE_API_URL);
    	const resData27 = await fetch(BASE_API_URL_27);
    	let MyData = await resData.json();
    	let Data27 = await resData27.json();

    	/* Getting the countries */
    	/* Turning them into upper case because the integration needs it */
    	let countries = Array.from(new Set(MyData.map(d => {
    			return d.country.toLowerCase();
    		})));

    	/* Mapping the data in the right format */
    	/* The country must be an index of the array of countries */
    	/*  
    Turning this:
        
    {
        "country": "COUNTRY",
        "year": 2000,
        "percentage-re-total": 0.0,
        "percentage-hydropower-total": 0.0,
        "percentage-wind-power-total": 0.0
    }
        
    into this:
        
    [0, 2000, 0.0, 0.0, 0.0]
    The first 0 is the index of "Country" in the array of countries

    */
    	MyData = MyData.map(d => {
    		return [
    			countries.indexOf(d.country.toLowerCase()),
    			d.year,
    			d["percentage-re-total"],
    			d["percentage-hydropower-total"],
    			d["percentage-wind-power-total"]
    		];
    	});

    	MyData = MyData.filter(d => {
    		return Data27.find(d27 => d27.country == countries[d[0]] && parseInt(d27.year) == d[1]);
    	}).map(d => {
    		return [
    			d[0],
    			d[1],
    			d[2],
    			d[3],
    			d[4],
    			Data27.find(d27 => d27.country == countries[d[0]] && parseInt(d27.year) == d[1])["climate"]
    		];
    	});

    	/* 
    The following array turn this:
    [0, 2000, 0.0, 0.0, 0.0]
        
    into this:
        
    {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
    That is how the chart needs it
     */
    	let ChartData = MyData.map(function (set, i) {
    		return {
    			name: countries[set[0]],
    			data: set,
    			shadow: false
    		};
    	});

    	/* Setting the chart */
    	Highcharts.chart("container-27", {
    		chart: {
    			type: "spline",
    			parallelCoordinates: true,
    			parallelAxes: { lineWidth: 3 }
    		},
    		title: {
    			text: "Energías renovables y calidad de vida"
    		},
    		plotOptions: {
    			series: {
    				animation: false,
    				marker: {
    					enabled: false,
    					states: { hover: { enabled: false } }
    				},
    				states: { hover: { halo: { size: 0 } } },
    				events: {
    					mouseOver() {
    						this.group.toFront();
    					}
    				}
    			}
    		},
    		tooltip: {
    			pointFormat: "<span style=\"color:{point.color}\">●</span>" + "{series.name}: <b>{point.formattedValue}</b><br/>"
    		},
    		xAxis: {
    			categories: [
    				"País",
    				"Año",
    				"Porcentaje de uso de energías renovables",
    				"Porcentaje de uso de energías hidroeléctricas",
    				"Porcentaje de uso de energías eólica",
    				"Calidad de vida"
    			],
    			offset: 10
    		},
    		yAxis: [
    			{
    				categories: countries,
    				tooltipValueFormat: "{value}"
    			},
    			{ min: 2000, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value}" }
    		],
    		colors: ["rgba(129, 131, 202, 0.8)"],
    		series: ChartData
    	});
    }

    async function loadGraph5() {
    	console.log("Loading 5");

    	/* Asking for the data to the back */
    	const BASE_API_URL = "/api/v4/renewable-sources-stats";

    	const BASE_API_URL_5 = "/api/v1/books-exports";
    	const resData = await fetch(BASE_API_URL);
    	const resData5 = await fetch(BASE_API_URL_5);
    	let MyData = await resData.json();
    	let Data5 = await resData5.json();

    	/* Getting the countries */
    	/* Turning them into upper case because the integration needs it */
    	let countries = Array.from(new Set(MyData.map(d => {
    			return d.country.toLowerCase();
    		})));

    	/* Mapping the data in the right format */
    	/* The country must be an index of the array of countries */
    	/*  
    Turning this:
        
    {
        "country": "COUNTRY",
        "year": 2000,
        "percentage-re-total": 0.0,
        "percentage-hydropower-total": 0.0,
        "percentage-wind-power-total": 0.0
    }
        
    into this:
        
    [0, 2000, 0.0, 0.0, 0.0]
    The first 0 is the index of "Country" in the array of countries

    */
    	MyData = MyData.map(d => {
    		return [
    			countries.indexOf(d.country.toLowerCase()),
    			d.year,
    			d["percentage-re-total"],
    			d["percentage-hydropower-total"],
    			d["percentage-wind-power-total"]
    		];
    	});

    	MyData = MyData.filter(d => {
    		return Data5.find(d5 => d5.country == countries[d[0]] && parseInt(d5.year) == d[1]);
    	}).map(d => {
    		return [
    			d[0],
    			d[1],
    			d[2],
    			d[3],
    			d[4],
    			Data5.find(d5 => d5.country == countries[d[0]] && parseInt(d5.year) == d[1])["exp_book"]
    		];
    	});

    	/* 
    The following array turn this:
    [0, 2000, 0.0, 0.0, 0.0]
        
    into this:
        
    {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
    That is how the chart needs it
     */
    	let ChartData = MyData.map(function (set, i) {
    		return {
    			name: countries[set[0]],
    			data: set,
    			shadow: false
    		};
    	});

    	/* Setting the chart */
    	Highcharts.chart("container-5", {
    		chart: {
    			type: "spline",
    			parallelCoordinates: true,
    			parallelAxes: { lineWidth: 3 }
    		},
    		title: {
    			text: "Energías renovables y exportación de libros"
    		},
    		plotOptions: {
    			series: {
    				animation: false,
    				marker: {
    					enabled: false,
    					states: { hover: { enabled: false } }
    				},
    				states: { hover: { halo: { size: 0 } } },
    				events: {
    					mouseOver() {
    						this.group.toFront();
    					}
    				}
    			}
    		},
    		tooltip: {
    			pointFormat: "<span style=\"color:{point.color}\">●</span>" + "{series.name}: <b>{point.formattedValue}</b><br/>"
    		},
    		xAxis: {
    			categories: [
    				"País",
    				"Año",
    				"Porcentaje de uso de energías renovables",
    				"Porcentaje de uso de energías hidroeléctricas",
    				"Porcentaje de uso de energías eólica",
    				"Exportación de libros"
    			],
    			offset: 10
    		},
    		yAxis: [
    			{
    				categories: countries,
    				tooltipValueFormat: "{value}"
    			},
    			{ min: 2000, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value}" }
    		],
    		colors: ["rgba(129, 131, 202, 0.8)"],
    		series: ChartData
    	});
    }

    async function loadGraph22() {
    	console.log("Loading 22");

    	/* Asking for the data to the back */
    	const BASE_API_URL = "/api/v4/renewable-sources-stats";

    	const BASE_API_URL_22 = "https://sos1920-22.herokuapp.com/api/v2/formula-stats";
    	const resData = await fetch(BASE_API_URL);
    	const resData22 = await fetch(BASE_API_URL_22);
    	let MyData = await resData.json();
    	let Data22 = await resData22.json();

    	/* Getting the countries */
    	/* Turning them into upper case because the integration needs it */
    	let countries = Array.from(new Set(MyData.map(d => {
    			return d.country.toLowerCase();
    		})));

    	/* Mapping the data in the right format */
    	/* The country must be an index of the array of countries */
    	/*  
    Turning this:
        
    {
        "country": "COUNTRY",
        "year": 2000,
        "percentage-re-total": 0.0,
        "percentage-hydropower-total": 0.0,
        "percentage-wind-power-total": 0.0
    }
        
    into this:
        
    [0, 2000, 0.0, 0.0, 0.0]
    The first 0 is the index of "Country" in the array of countries

    */
    	MyData = MyData.map(d => {
    		return [
    			countries.indexOf(d.country.toLowerCase()),
    			d.year,
    			d["percentage-re-total"],
    			d["percentage-hydropower-total"],
    			d["percentage-wind-power-total"]
    		];
    	});

    	MyData = MyData.filter(d => {
    		return Data22.find(d22 => d22.country == countries[d[0]] && parseInt(d22.year) == d[1]);
    	}).map(d => {
    		return [
    			d[0],
    			d[1],
    			d[2],
    			d[3],
    			d[4],
    			Data22.find(d22 => d22.country == countries[d[0]] && parseInt(d22.year) == d[1])["victorynumber"]
    		];
    	});

    	/* 
    The following array turn this:
    [0, 2000, 0.0, 0.0, 0.0]
        
    into this:
        
    {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
    That is how the chart needs it
     */
    	let ChartData = MyData.map(function (set, i) {
    		return {
    			name: countries[set[0]],
    			data: set,
    			shadow: false
    		};
    	});

    	/* Setting the chart */
    	Highcharts.chart("container-22", {
    		chart: {
    			type: "spline",
    			parallelCoordinates: true,
    			parallelAxes: { lineWidth: 3 }
    		},
    		title: {
    			text: "Energías renovables y victorias de fórmula 1"
    		},
    		plotOptions: {
    			series: {
    				animation: false,
    				marker: {
    					enabled: false,
    					states: { hover: { enabled: false } }
    				},
    				states: { hover: { halo: { size: 0 } } },
    				events: {
    					mouseOver() {
    						this.group.toFront();
    					}
    				}
    			}
    		},
    		tooltip: {
    			pointFormat: "<span style=\"color:{point.color}\">●</span>" + "{series.name}: <b>{point.formattedValue}</b><br/>"
    		},
    		xAxis: {
    			categories: [
    				"País",
    				"Año",
    				"Porcentaje de uso de energías renovables",
    				"Porcentaje de uso de energías hidroeléctricas",
    				"Porcentaje de uso de energías eólica",
    				"Victorias en fórmula 1"
    			],
    			offset: 10
    		},
    		yAxis: [
    			{
    				categories: countries,
    				tooltipValueFormat: "{value}"
    			},
    			{ min: 2000, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value}" }
    		],
    		colors: ["rgba(129, 131, 202, 0.8)"],
    		series: ChartData
    	});
    }

    async function loadGraph6() {
    	console.log("Loading 6");

    	/* Asking for the data to the back */
    	const BASE_API_URL = "/api/v4/renewable-sources-stats";

    	const BASE_API_URL_6 = "/api/v2/lottery-sales";
    	const resData = await fetch(BASE_API_URL);
    	const resData6 = await fetch(BASE_API_URL_6);
    	let MyData = await resData.json();
    	let Data6 = await resData6.json();

    	/* Getting the countries */
    	/* Turning them into upper case because the integration needs it */
    	let countries = Array.from(new Set(MyData.map(d => {
    			return d.country;
    		})));

    	let provinces = Array.from(new Set(Data6.map(d => {
    			return d.province;
    		})));

    	/* Mapping the data in the right format */
    	/* The country must be an index of the array of countries */
    	/*  
    Turning this:
        
    {
        "country": "COUNTRY",
        "year": 2000,
        "percentage-re-total": 0.0,
        "percentage-hydropower-total": 0.0,
        "percentage-wind-power-total": 0.0
    }
        
    into this:
        
    [0, 2000, 0.0, 0.0, 0.0]
    The first 0 is the index of "Country" in the array of countries

    */
    	MyData = MyData.filter(d => {
    		return d.country == "Spain" && Data6.find(d4 => d4.year == d.year);
    	}).map(d => {
    		return [
    			countries.indexOf(d.country),
    			d.year,
    			d["percentage-re-total"],
    			d["percentage-hydropower-total"],
    			d["percentage-wind-power-total"]
    		];
    	});

    	let ModifiedData = [];

    	for (let i = 0; i < MyData.length; i++) {
    		Data6.filter(d => d.year == MyData[i][1]).forEach(dataMatchesYear => {
    			ModifiedData.push([
    				MyData[i][0],
    				provinces.indexOf(dataMatchesYear.province),
    				MyData[i][1],
    				MyData[i][2],
    				MyData[i][3],
    				MyData[i][4],
    				dataMatchesYear["total"]
    			]);
    		});
    	}

    	/* 
    The following array turn this:
    [0, 2000, 0.0, 0.0, 0.0]
        
    into this:
        
    {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
    That is how the chart needs it
     */
    	let ChartData = ModifiedData.map(function (set, i) {
    		return {
    			name: countries[set[0]],
    			data: set,
    			shadow: false
    		};
    	});

    	/* Setting the chart */
    	Highcharts.chart("container-6", {
    		chart: {
    			type: "spline",
    			parallelCoordinates: true,
    			parallelAxes: { lineWidth: 3 }
    		},
    		title: {
    			text: "Energías renovables y número de coches"
    		},
    		plotOptions: {
    			series: {
    				animation: false,
    				marker: {
    					enabled: false,
    					states: { hover: { enabled: false } }
    				},
    				states: { hover: { halo: { size: 0 } } },
    				events: {
    					mouseOver() {
    						this.group.toFront();
    					}
    				}
    			}
    		},
    		tooltip: {
    			pointFormat: "<span style=\"color:{point.color}\">●</span>" + "{series.name}: <b>{point.formattedValue}</b><br/>"
    		},
    		xAxis: {
    			categories: [
    				"País",
    				"Provincias",
    				"Año",
    				"Porcentaje de uso de energías renovables",
    				"Porcentaje de uso de energías hidroeléctricas",
    				"Porcentaje de uso de energías eólica",
    				"Número de loterías vendidas"
    			],
    			offset: 10
    		},
    		yAxis: [
    			{
    				categories: countries,
    				tooltipValueFormat: "{value}"
    			},
    			{
    				categories: provinces,
    				tooltipValueFormat: "{value}"
    			},
    			{ min: 2000, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value}" }
    		],
    		colors: ["rgba(129, 131, 202, 0.8)"],
    		series: ChartData
    	});
    }

    async function loadGraph1() {
    	console.log("Loading 1");

    	/* Asking for the data to the back */
    	const BASE_API_URL = "/api/v4/renewable-sources-stats";

    	const BASE_API_URL_1 = "/api/v2/natality-stats";
    	const resData = await fetch(BASE_API_URL);
    	const resData1 = await fetch(BASE_API_URL_1);
    	let MyData = await resData.json();
    	let Data1 = await resData1.json();

    	/* Getting the countries */
    	/* Turning them into upper case because the integration needs it */
    	let countries = Array.from(new Set(MyData.map(d => {
    			return d.country.toLowerCase();
    		})));

    	/* Mapping the data in the right format */
    	/* The country must be an index of the array of countries */
    	/*  
    Turning this:
        
    {
        "country": "COUNTRY",
        "year": 2000,
        "percentage-re-total": 0.0,
        "percentage-hydropower-total": 0.0,
        "percentage-wind-power-total": 0.0
    }
        
    into this:
        
    [0, 2000, 0.0, 0.0, 0.0]
    The first 0 is the index of "Country" in the array of countries

    */
    	MyData = MyData.map(d => {
    		return [
    			countries.indexOf(d.country.toLowerCase()),
    			d.year,
    			d["percentage-re-total"],
    			d["percentage-hydropower-total"],
    			d["percentage-wind-power-total"]
    		];
    	});

    	MyData = MyData.filter(d => {
    		return Data1.find(d1 => d1.country == countries[d[0]] && parseInt(d1.year) == d[1]);
    	}).map(d => {
    		return [
    			d[0],
    			d[1],
    			d[2],
    			d[3],
    			d[4],
    			Data1.find(d1 => d1.country == countries[d[0]] && parseInt(d1.year) == d[1])["natality_totals"]
    		];
    	});

    	/* 
    The following array turn this:
    [0, 2000, 0.0, 0.0, 0.0]
        
    into this:
        
    {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
    That is how the chart needs it
     */
    	let ChartData = MyData.map(function (set, i) {
    		return {
    			name: countries[set[0]],
    			data: set,
    			shadow: false
    		};
    	});

    	/* Setting the chart */
    	Highcharts.chart("container-1", {
    		chart: {
    			type: "spline",
    			parallelCoordinates: true,
    			parallelAxes: { lineWidth: 3 }
    		},
    		title: { text: "Energías renovables y natalidad" },
    		plotOptions: {
    			series: {
    				animation: false,
    				marker: {
    					enabled: false,
    					states: { hover: { enabled: false } }
    				},
    				states: { hover: { halo: { size: 0 } } },
    				events: {
    					mouseOver() {
    						this.group.toFront();
    					}
    				}
    			}
    		},
    		tooltip: {
    			pointFormat: "<span style=\"color:{point.color}\">●</span>" + "{series.name}: <b>{point.formattedValue}</b><br/>"
    		},
    		xAxis: {
    			categories: [
    				"País",
    				"Año",
    				"Porcentaje de uso de energías renovables",
    				"Porcentaje de uso de energías hidroeléctricas",
    				"Porcentaje de uso de energías eólica",
    				"Número de nacimientos"
    			],
    			offset: 10
    		},
    		yAxis: [
    			{
    				categories: countries,
    				tooltipValueFormat: "{value}"
    			},
    			{ min: 2000, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value}" }
    		],
    		colors: ["rgba(129, 131, 202, 0.8)"],
    		series: ChartData
    	});
    }

    async function loadGraph30() {
    	console.log("Loading 30");

    	/* Asking for the data to the back */
    	const BASE_API_URL = "/api/v4/renewable-sources-stats";

    	const BASE_API_URL_30 = "https://sos1920-30.herokuapp.com/api/v3/sugarconsume";
    	const resData = await fetch(BASE_API_URL);
    	const resData30 = await fetch(BASE_API_URL_30);
    	let MyData = await resData.json();
    	let Data30 = await resData30.json();

    	/* Getting the countries */
    	/* Turning them into upper case because the integration needs it */
    	let years = Array.from(new Set(MyData.map(d => {
    			return d.year;
    		})));

    	/* Mapping the data in the right format */
    	/* The country must be an index of the array of countries */
    	/*  
    Turning this:
        
    {
        "country": "COUNTRY",
        "year": 2000,
        "percentage-re-total": 0.0,
        "percentage-hydropower-total": 0.0,
        "percentage-wind-power-total": 0.0
    }
        
    into this:
        
    [0, 2000, 0.0, 0.0, 0.0]
    The first 0 is the index of "Country" in the array of countries

    */
    	let MeanData = [];

    	years.filter(y => {
    		return Data30.find(d30 => d30.year == y);
    	}).forEach(y => {
    		let totalSugar = Data30.filter(d => {
    			return d.year == y;
    		}).map(d => {
    			return d["sugarconsume"];
    		}).reduce((accumulator, currentValue) => accumulator + currentValue);

    		let reAverrage = MyData.filter(d => {
    			return d.year == y;
    		}).map(d => {
    			return d["percentage-re-total"];
    		}).reduce((accumulator, currentValue) => accumulator + currentValue) / MyData.filter(d => {
    			return d.year == y;
    		}).length;

    		let hydropowerAverrage = MyData.filter(d => {
    			return d.year == y;
    		}).map(d => {
    			return d["percentage-hydropower-total"];
    		}).reduce((accumulator, currentValue) => accumulator + currentValue) / MyData.filter(d => {
    			return d.year == y;
    		}).length;

    		let windAverrage = MyData.filter(d => {
    			return d.year == y;
    		}).map(d => {
    			return d["percentage-wind-power-total"];
    		}).reduce((accumulator, currentValue) => accumulator + currentValue) / MyData.filter(d => {
    			return d.year == y;
    		}).length;

    		MeanData.push([y, reAverrage, hydropowerAverrage, windAverrage, totalSugar]);
    	});

    	/* 
    The following array turn this:
    [0, 2000, 0.0, 0.0, 0.0]
        
    into this:
        
    {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
    That is how the chart needs it
     */
    	let ChartData = MeanData.map(function (set, i) {
    		return { name: set[0], data: set, shadow: false };
    	});

    	/* Setting the chart */
    	Highcharts.chart("container-30", {
    		chart: {
    			type: "spline",
    			parallelCoordinates: true,
    			parallelAxes: { lineWidth: 3 }
    		},
    		title: {
    			text: "Energías renovables y azúcar consumido"
    		},
    		plotOptions: {
    			series: {
    				animation: false,
    				marker: {
    					enabled: false,
    					states: { hover: { enabled: false } }
    				},
    				states: { hover: { halo: { size: 0 } } },
    				events: {
    					mouseOver() {
    						this.group.toFront();
    					}
    				}
    			}
    		},
    		tooltip: {
    			pointFormat: "<span style=\"color:{point.color}\">●</span>" + "{series.name}: <b>{point.formattedValue}</b><br/>"
    		},
    		xAxis: {
    			categories: [
    				"Año",
    				"Porcentaje de uso de energías renovables",
    				"Porcentaje de uso de energías hidroeléctricas",
    				"Porcentaje de uso de energías eólica",
    				"Kilos de azúcar consumidos"
    			],
    			offset: 10
    		},
    		yAxis: [
    			,{ min: 2000, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value}" }
    		],
    		colors: ["rgba(129, 131, 202, 0.8)"],
    		series: ChartData
    	});
    }

    async function loadGraph23() {
    	console.log("Loading 23");

    	/* Asking for the data to the back */
    	const BASE_API_URL = "/api/v4/renewable-sources-stats";

    	const BASE_API_URL_23 = "/api/v2/cigarretes-sales";
    	const resData = await fetch(BASE_API_URL);
    	const resData23 = await fetch(BASE_API_URL_23);
    	let MyData = await resData.json();
    	let Data23 = await resData23.json();

    	/* Getting the countries */
    	/* Turning them into upper case because the integration needs it */
    	let countries = Array.from(new Set(MyData.map(d => {
    			return d.country;
    		})));

    	let provinces = Array.from(new Set(Data23.map(d => {
    			return d.community;
    		})));

    	/* Mapping the data in the right format */
    	/* The country must be an index of the array of countries */
    	/*  
    Turning this:
        
    {
        "country": "COUNTRY",
        "year": 2000,
        "percentage-re-total": 0.0,
        "percentage-hydropower-total": 0.0,
        "percentage-wind-power-total": 0.0
    }
        
    into this:
        
    [0, 2000, 0.0, 0.0, 0.0]
    The first 0 is the index of "Country" in the array of countries

    */
    	MyData = MyData.filter(d => {
    		return d.country == "Spain" && Data23.find(d4 => d4.year == d.year);
    	}).map(d => {
    		return [
    			countries.indexOf(d.country),
    			d.year,
    			d["percentage-re-total"],
    			d["percentage-hydropower-total"],
    			d["percentage-wind-power-total"]
    		];
    	});

    	let ModifiedData = [];

    	for (let i = 0; i < MyData.length; i++) {
    		Data23.filter(d => d.year == MyData[i][1]).forEach(dataMatchesYear => {
    			ModifiedData.push([
    				MyData[i][0],
    				provinces.indexOf(dataMatchesYear.community),
    				MyData[i][1],
    				MyData[i][2],
    				MyData[i][3],
    				MyData[i][4],
    				dataMatchesYear["cigarrete_sale"]
    			]);
    		});
    	}

    	/* 
    The following array turn this:
    [0, 2000, 0.0, 0.0, 0.0]
        
    into this:
        
    {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
    That is how the chart needs it
     */
    	let ChartData = ModifiedData.map(function (set, i) {
    		return {
    			name: countries[set[0]],
    			data: set,
    			shadow: false
    		};
    	});

    	/* Setting the chart */
    	Highcharts.chart("container-23", {
    		chart: {
    			type: "spline",
    			parallelCoordinates: true,
    			parallelAxes: { lineWidth: 3 }
    		},
    		title: { text: "Energías renovables y tabaco" },
    		plotOptions: {
    			series: {
    				animation: false,
    				marker: {
    					enabled: false,
    					states: { hover: { enabled: false } }
    				},
    				states: { hover: { halo: { size: 0 } } },
    				events: {
    					mouseOver() {
    						this.group.toFront();
    					}
    				}
    			}
    		},
    		tooltip: {
    			pointFormat: "<span style=\"color:{point.color}\">●</span>" + "{series.name}: <b>{point.formattedValue}</b><br/>"
    		},
    		xAxis: {
    			categories: [
    				"País",
    				"Provincias",
    				"Año",
    				"Porcentaje de uso de energías renovables",
    				"Porcentaje de uso de energías hidroeléctricas",
    				"Porcentaje de uso de energías eólica",
    				"Ventas de cigarrillos de tabaco"
    			],
    			offset: 10
    		},
    		yAxis: [
    			{
    				categories: countries,
    				tooltipValueFormat: "{value}"
    			},
    			{
    				categories: provinces,
    				tooltipValueFormat: "{value}"
    			},
    			{ min: 2000, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value}" }
    		],
    		colors: ["rgba(129, 131, 202, 0.8)"],
    		series: ChartData
    	});
    }

    async function loadGraph25() {
    	console.log("Loading 25");

    	/* Asking for the data to the back */
    	const BASE_API_URL = "/api/v4/renewable-sources-stats";

    	const BASE_API_URL_25 = "/api/v2/happiness_rate";
    	const resData = await fetch(BASE_API_URL);
    	const resData25 = await fetch(BASE_API_URL_25);
    	let MyData = await resData.json();
    	let Data25 = await resData25.json();

    	/* Getting the countries */
    	/* Turning them into upper case because the integration needs it */
    	let countries = Array.from(new Set(MyData.map(d => {
    			return d.country.toLowerCase();
    		})));

    	/* Mapping the data in the right format */
    	/* The country must be an index of the array of countries */
    	/*  
    Turning this:
        
    {
        "country": "COUNTRY",
        "year": 2000,
        "percentage-re-total": 0.0,
        "percentage-hydropower-total": 0.0,
        "percentage-wind-power-total": 0.0
    }
        
    into this:
        
    [0, 2000, 0.0, 0.0, 0.0]
    The first 0 is the index of "Country" in the array of countries

    */
    	MyData = MyData.map(d => {
    		return [
    			countries.indexOf(d.country.toLowerCase()),
    			d.year,
    			d["percentage-re-total"],
    			d["percentage-hydropower-total"],
    			d["percentage-wind-power-total"]
    		];
    	});

    	MyData = MyData.filter(d => {
    		return Data25.find(d25 => d25.country.toLowerCase() == countries[d[0]] && parseInt(d25.year) == d[1]);
    	}).map(d => {
    		return [
    			d[0],
    			d[1],
    			d[2],
    			d[3],
    			d[4],
    			Data25.find(d25 => d25.country.toLowerCase() == countries[d[0]] && parseInt(d25.year) == d[1])["happinessRanking"]
    		];
    	});

    	/* 
    The following array turn this:
    [0, 2000, 0.0, 0.0, 0.0]
        
    into this:
        
    {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
    That is how the chart needs it
     */
    	let ChartData = MyData.map(function (set, i) {
    		return {
    			name: countries[set[0]],
    			data: set,
    			shadow: false
    		};
    	});

    	/* Setting the chart */
    	Highcharts.chart("container-25", {
    		chart: {
    			type: "spline",
    			parallelCoordinates: true,
    			parallelAxes: { lineWidth: 3 }
    		},
    		title: {
    			text: "Energías renovables y nivel de felicidad"
    		},
    		plotOptions: {
    			series: {
    				animation: false,
    				marker: {
    					enabled: false,
    					states: { hover: { enabled: false } }
    				},
    				states: { hover: { halo: { size: 0 } } },
    				events: {
    					mouseOver() {
    						this.group.toFront();
    					}
    				}
    			}
    		},
    		tooltip: {
    			pointFormat: "<span style=\"color:{point.color}\">●</span>" + "{series.name}: <b>{point.formattedValue}</b><br/>"
    		},
    		xAxis: {
    			categories: [
    				"País",
    				"Año",
    				"Porcentaje de uso de energías renovables",
    				"Porcentaje de uso de energías hidroeléctricas",
    				"Porcentaje de uso de energías eólica",
    				"Ranking en felicidad"
    			],
    			offset: 10
    		},
    		yAxis: [
    			{
    				categories: countries,
    				tooltipValueFormat: "{value}"
    			},
    			{ min: 2000, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value}" }
    		],
    		colors: ["rgba(129, 131, 202, 0.8)"],
    		series: ChartData
    	});
    }

    async function loadGraph8() {
    	console.log("Loading 8");

    	/* Asking for the data to the back */
    	const BASE_API_URL = "/api/v4/renewable-sources-stats";

    	const BASE_API_URL_8 = "/api/v1/motogp-statistics";
    	const resData = await fetch(BASE_API_URL);
    	const resData8 = await fetch(BASE_API_URL_8);
    	let MyData = await resData.json();
    	let Data8 = await resData8.json();

    	/* Getting the countries */
    	/* Turning them into upper case because the integration needs it */
    	let countries = Array.from(new Set(MyData.map(d => {
    			return d.country;
    		})));

    	/* Mapping the data in the right format */
    	/* The country must be an index of the array of countries */
    	/*  
    Turning this:
        
    {
        "country": "COUNTRY",
        "year": 2000,
        "percentage-re-total": 0.0,
        "percentage-hydropower-total": 0.0,
        "percentage-wind-power-total": 0.0
    }
        
    into this:
        
    [0, 2000, 0.0, 0.0, 0.0]
    The first 0 is the index of "Country" in the array of countries

    */
    	MyData = MyData.map(d => {
    		return [
    			countries.indexOf(d.country),
    			d.year,
    			d["percentage-re-total"],
    			d["percentage-hydropower-total"],
    			d["percentage-wind-power-total"]
    		];
    	});

    	MyData = MyData.filter(d => {
    		return Data8.find(d8 => d8.country == countries[d[0]]);
    	}).map(d => {
    		return [
    			d[0],
    			d[1],
    			d[2],
    			d[3],
    			d[4],
    			Data8.find(d8 => d8.country == countries[d[0]])["world_title"]
    		];
    	});

    	/* 
    The following array turn this:
    [0, 2000, 0.0, 0.0, 0.0]
        
    into this:
        
    {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
    That is how the chart needs it
     */
    	let ChartData = MyData.map(function (set, i) {
    		return {
    			name: countries[set[0]],
    			data: set,
    			shadow: false
    		};
    	});

    	/* Setting the chart */
    	Highcharts.chart("container-8", {
    		chart: {
    			type: "spline",
    			parallelCoordinates: true,
    			parallelAxes: { lineWidth: 3 }
    		},
    		title: { text: "Energías renovables y motoGP" },
    		plotOptions: {
    			series: {
    				animation: false,
    				marker: {
    					enabled: false,
    					states: { hover: { enabled: false } }
    				},
    				states: { hover: { halo: { size: 0 } } },
    				events: {
    					mouseOver() {
    						this.group.toFront();
    					}
    				}
    			}
    		},
    		tooltip: {
    			pointFormat: "<span style=\"color:{point.color}\">●</span>" + "{series.name}: <b>{point.formattedValue}</b><br/>"
    		},
    		xAxis: {
    			categories: [
    				"País",
    				"Año",
    				"Porcentaje de uso de energías renovables",
    				"Porcentaje de uso de energías hidroeléctricas",
    				"Porcentaje de uso de energías eólica",
    				"Títulos mundiales"
    			],
    			offset: 10
    		},
    		yAxis: [
    			{
    				categories: countries,
    				tooltipValueFormat: "{value}"
    			},
    			{ min: 2000, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value}" }
    		],
    		colors: ["rgba(129, 131, 202, 0.8)"],
    		series: ChartData
    	});
    }

    async function loadGraphExt1() {
    	console.log("Loading external api");

    	/* Asking for the data to the back */
    	const BASE_API_URL = "/api/v4/renewable-sources-stats";

    	const BASE_API_URL_EXT = "https://restcountries.eu/rest/v2/all?fields=name;capital;area";
    	const resData = await fetch(BASE_API_URL);
    	const resDataExt = await fetch(BASE_API_URL_EXT);
    	let MyData = await resData.json();
    	let DataExt = await resDataExt.json();

    	/* Getting the countries */
    	/* Turning them into upper case because the integration needs it */
    	let countries = Array.from(new Set(MyData.map(d => {
    			return d.country;
    		})));

    	/* Mapping the data in the right format */
    	/* The country must be an index of the array of countries */
    	/*  
    Turning this:
        
    {
        "country": "COUNTRY",
        "year": 2000,
        "percentage-re-total": 0.0,
        "percentage-hydropower-total": 0.0,
        "percentage-wind-power-total": 0.0
    }
        
    into this:
        
    [0, 2000, 0.0, 0.0, 0.0]
    The first 0 is the index of "Country" in the array of countries

    */
    	MyData = MyData.map(d => {
    		return [
    			countries.indexOf(d.country),
    			d.year,
    			d["percentage-re-total"],
    			d["percentage-hydropower-total"],
    			d["percentage-wind-power-total"]
    		];
    	});

    	MyData = MyData.filter(d => {
    		return DataExt.find(dext => dext.name == countries[d[0]]);
    	}).map(d => {
    		return [
    			d[0],
    			d[1],
    			d[2],
    			d[3],
    			d[4],
    			DataExt.find(dext => dext.name == countries[d[0]])["area"]
    		];
    	});

    	/* 
    The following array turn this:
    [0, 2000, 0.0, 0.0, 0.0]
        
    into this:
        
    {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
    That is how the chart needs it
     */
    	let ChartData = MyData.map(function (set, i) {
    		return {
    			name: countries[set[0]],
    			data: set,
    			shadow: false
    		};
    	});

    	/* Setting the chart */
    	Highcharts.chart("container-ext1", {
    		chart: {
    			type: "spline",
    			parallelCoordinates: true,
    			parallelAxes: { lineWidth: 3 }
    		},
    		title: { text: "Energías renovables y área" },
    		plotOptions: {
    			series: {
    				animation: false,
    				marker: {
    					enabled: false,
    					states: { hover: { enabled: false } }
    				},
    				states: { hover: { halo: { size: 0 } } },
    				events: {
    					mouseOver() {
    						this.group.toFront();
    					}
    				}
    			}
    		},
    		tooltip: {
    			pointFormat: "<span style=\"color:{point.color}\">●</span>" + "{series.name}: <b>{point.formattedValue}</b><br/>"
    		},
    		xAxis: {
    			categories: [
    				"País",
    				"Año",
    				"Porcentaje de uso de energías renovables",
    				"Porcentaje de uso de energías hidroeléctricas",
    				"Porcentaje de uso de energías eólica",
    				"Área"
    			],
    			offset: 10
    		},
    		yAxis: [
    			{
    				categories: countries,
    				tooltipValueFormat: "{value}"
    			},
    			{ min: 2000, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value}" }
    		],
    		colors: ["rgba(129, 131, 202, 0.8)"],
    		series: ChartData
    	});
    }

    async function loadGraphExt2() {
    	console.log("Loading external api");

    	/* Asking for the data to the back */
    	const BASE_API_URL = "/api/v4/renewable-sources-stats";

    	const BASE_API_URL_EXT = "/v1/Country/getCountries";
    	const resData = await fetch(BASE_API_URL);
    	const resDataExt = await fetch(BASE_API_URL_EXT);
    	let MyData = await resData.json();
    	let DataExt = await resDataExt.json();

    	/* Getting the countries */
    	/* Turning them into upper case because the integration needs it */
    	let countries = Array.from(new Set(MyData.map(d => {
    			return d.country;
    		})));

    	let currencies = Array.from(new Set(DataExt.Response.map(d => {
    			return d["CurrencyName"];
    		})));

    	/* Mapping the data in the right format */
    	/* The country must be an index of the array of countries */
    	/*  
    Turning this:
        
    {
        "country": "COUNTRY",
        "year": 2000,
        "percentage-re-total": 0.0,
        "percentage-hydropower-total": 0.0,
        "percentage-wind-power-total": 0.0
    }
        
    into this:
        
    [0, 2000, 0.0, 0.0, 0.0]
    The first 0 is the index of "Country" in the array of countries

    */
    	MyData = MyData.map(d => {
    		return [
    			countries.indexOf(d.country),
    			d.year,
    			d["percentage-re-total"],
    			d["percentage-hydropower-total"],
    			d["percentage-wind-power-total"]
    		];
    	});

    	MyData = MyData.filter(d => {
    		return DataExt.Response.find(dext => dext.Name == countries[d[0]]);
    	}).map(d => {
    		return [
    			d[0],
    			d[1],
    			d[2],
    			d[3],
    			d[4],
    			currencies.indexOf(DataExt.Response.find(dext => dext.Name == countries[d[0]])["CurrencyName"])
    		];
    	});

    	/* 
    The following array turn this:
    [0, 2000, 0.0, 0.0, 0.0]
        
    into this:
        
    {name: "Country", data: [0, 2000, 0.0, 0.0, 0.0]}
    That is how the chart needs it
     */
    	let ChartData = MyData.map(function (set, i) {
    		return {
    			name: countries[set[0]],
    			data: set,
    			shadow: false
    		};
    	});

    	/* Setting the chart */
    	Highcharts.chart("container-ext2", {
    		chart: {
    			type: "spline",
    			parallelCoordinates: true,
    			parallelAxes: { lineWidth: 3 }
    		},
    		title: { text: "Energías renovables y monedas" },
    		plotOptions: {
    			series: {
    				animation: false,
    				marker: {
    					enabled: false,
    					states: { hover: { enabled: false } }
    				},
    				states: { hover: { halo: { size: 0 } } },
    				events: {
    					mouseOver() {
    						this.group.toFront();
    					}
    				}
    			}
    		},
    		tooltip: {
    			pointFormat: "<span style=\"color:{point.color}\">●</span>" + "{series.name}: <b>{point.formattedValue}</b><br/>"
    		},
    		xAxis: {
    			categories: [
    				"País",
    				"Año",
    				"Porcentaje de uso de energías renovables",
    				"Porcentaje de uso de energías hidroeléctricas",
    				"Porcentaje de uso de energías eólica",
    				"Moneda"
    			],
    			offset: 10
    		},
    		yAxis: [
    			{
    				categories: countries,
    				tooltipValueFormat: "{value}"
    			},
    			{ min: 2000, tooltipValueFormat: "{value}" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{ min: 0, tooltipValueFormat: "{value} %" },
    			{
    				categories: currencies,
    				tooltipValueFormat: "{value}"
    			}
    		],
    		colors: ["rgba(129, 131, 202, 0.8)"],
    		series: ChartData
    	});
    }

    function instance$s($$self, $$props, $$invalidate) {
    	loadGraph7();
    	loadGraph4();
    	loadGraph27();
    	loadGraph5(); // [proxy] bookexports
    	loadGraph22();
    	loadGraph6(); // [proxy] lottery
    	loadGraph1(); // [proxy] natality
    	loadGraph30();
    	loadGraph23(); // [proxy] cigarettes
    	loadGraph25(); // [proxy] happiness rate
    	loadGraph8(); // [proxy] motogp
    	loadGraphExt1();
    	loadGraphExt2();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$a.warn(`<Integrations> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Integrations", $$slots, []);

    	$$self.$capture_state = () => ({
    		Button,
    		pop,
    		loadGraph7,
    		loadGraph4,
    		loadGraph27,
    		loadGraph5,
    		loadGraph22,
    		loadGraph6,
    		loadGraph1,
    		loadGraph30,
    		loadGraph23,
    		loadGraph25,
    		loadGraph8,
    		loadGraphExt1,
    		loadGraphExt2
    	});

    	return [];
    }

    class Integrations extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Integrations",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    /* src\front\oilCoalNuclearEnergyConsumptionAPI\Integrations.svelte generated by Svelte v3.20.1 */

    const { console: console_1$b } = globals;
    const file$s = "src\\front\\oilCoalNuclearEnergyConsumptionAPI\\Integrations.svelte";

    // (941:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$f(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$s, 940, 56, 28416);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$f.name,
    		type: "slot",
    		source: "(941:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let t0;
    	let main;
    	let div19;
    	let div1;
    	let div0;
    	let a0;
    	let t2;
    	let a1;
    	let t4;
    	let a2;
    	let t6;
    	let a3;
    	let t8;
    	let a4;
    	let t10;
    	let a5;
    	let t12;
    	let a6;
    	let t14;
    	let div18;
    	let div17;
    	let div3;
    	let figure0;
    	let div2;
    	let t15;
    	let p0;
    	let t17;
    	let div5;
    	let figure1;
    	let div4;
    	let t18;
    	let p1;
    	let t20;
    	let div7;
    	let figure2;
    	let div6;
    	let t21;
    	let p2;
    	let t23;
    	let div9;
    	let figure3;
    	let div8;
    	let t24;
    	let p3;
    	let t26;
    	let div11;
    	let figure4;
    	let div10;
    	let t27;
    	let p4;
    	let t28;
    	let a7;
    	let t30;
    	let div13;
    	let figure5;
    	let div12;
    	let t31;
    	let p5;
    	let t33;
    	let div16;
    	let figure6;
    	let div15;
    	let button0;
    	let t35;
    	let div14;
    	let t36;
    	let current;

    	const button1 = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$f] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", pop);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			t0 = space();
    			main = element("main");
    			div19 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			a0.textContent = "Integración con 4";
    			t2 = space();
    			a1 = element("a");
    			a1.textContent = "Integración con 2";
    			t4 = space();
    			a2 = element("a");
    			a2.textContent = "Integración con 12";
    			t6 = space();
    			a3 = element("a");
    			a3.textContent = "Integración con 1";
    			t8 = space();
    			a4 = element("a");
    			a4.textContent = "Integración API Externa 1";
    			t10 = space();
    			a5 = element("a");
    			a5.textContent = "Integración con 28";
    			t12 = space();
    			a6 = element("a");
    			a6.textContent = "Integración con API externa";
    			t14 = space();
    			div18 = element("div");
    			div17 = element("div");
    			div3 = element("div");
    			figure0 = element("figure");
    			div2 = element("div");
    			t15 = space();
    			p0 = element("p");
    			p0.textContent = "Integración con la 4";
    			t17 = space();
    			div5 = element("div");
    			figure1 = element("figure");
    			div4 = element("div");
    			t18 = space();
    			p1 = element("p");
    			p1.textContent = "Integración con la 2.";
    			t20 = space();
    			div7 = element("div");
    			figure2 = element("figure");
    			div6 = element("div");
    			t21 = space();
    			p2 = element("p");
    			p2.textContent = "Integración con la 12.";
    			t23 = space();
    			div9 = element("div");
    			figure3 = element("figure");
    			div8 = element("div");
    			t24 = space();
    			p3 = element("p");
    			p3.textContent = "Integra la 1.";
    			t26 = space();
    			div11 = element("div");
    			figure4 = element("figure");
    			div10 = element("div");
    			t27 = space();
    			p4 = element("p");
    			t28 = text("Integración de API externa \r\n                        ");
    			a7 = element("a");
    			a7.textContent = "Link de la API";
    			t30 = space();
    			div13 = element("div");
    			figure5 = element("figure");
    			div12 = element("div");
    			t31 = space();
    			p5 = element("p");
    			p5.textContent = "Integra la 28.";
    			t33 = space();
    			div16 = element("div");
    			figure6 = element("figure");
    			div15 = element("div");
    			button0 = element("button");
    			button0.textContent = "Obtener";
    			t35 = space();
    			div14 = element("div");
    			t36 = space();
    			create_component(button1.$$.fragment);
    			if (script0.src !== (script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$s, 855, 4, 23562);
    			if (script1.src !== (script1_src_value = "https://code.highcharts.com/highcharts-more.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$s, 856, 4, 23633);
    			if (script2.src !== (script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$s, 857, 4, 23709);
    			if (script3.src !== (script3_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$s, 858, 4, 23787);
    			attr_dev(a0, "class", "list-group-item list-group-item-action active");
    			attr_dev(a0, "id", "list-home-list");
    			attr_dev(a0, "data-toggle", "list");
    			attr_dev(a0, "href", "#list-4");
    			attr_dev(a0, "role", "tab");
    			attr_dev(a0, "aria-controls", "home");
    			add_location(a0, file$s, 867, 12, 24024);
    			attr_dev(a1, "class", "list-group-item list-group-item-action");
    			attr_dev(a1, "id", "list-profile-list");
    			attr_dev(a1, "data-toggle", "list");
    			attr_dev(a1, "href", "#list-2");
    			attr_dev(a1, "role", "tab");
    			attr_dev(a1, "aria-controls", "profile");
    			add_location(a1, file$s, 868, 12, 24202);
    			attr_dev(a2, "class", "list-group-item list-group-item-action");
    			attr_dev(a2, "id", "list-profile-list");
    			attr_dev(a2, "data-toggle", "list");
    			attr_dev(a2, "href", "#list-12");
    			attr_dev(a2, "role", "tab");
    			attr_dev(a2, "aria-controls", "profile");
    			add_location(a2, file$s, 869, 12, 24379);
    			attr_dev(a3, "class", "list-group-item list-group-item-action");
    			attr_dev(a3, "id", "list-profile-list");
    			attr_dev(a3, "data-toggle", "list");
    			attr_dev(a3, "href", "#list-01");
    			attr_dev(a3, "role", "tab");
    			attr_dev(a3, "aria-controls", "profile");
    			add_location(a3, file$s, 870, 12, 24558);
    			attr_dev(a4, "class", "list-group-item list-group-item-action");
    			attr_dev(a4, "id", "list-profile-list");
    			attr_dev(a4, "data-toggle", "list");
    			attr_dev(a4, "href", "#list-ext");
    			attr_dev(a4, "role", "tab");
    			attr_dev(a4, "aria-controls", "profile");
    			add_location(a4, file$s, 871, 12, 24736);
    			attr_dev(a5, "class", "list-group-item list-group-item-action");
    			attr_dev(a5, "id", "list-profile-list");
    			attr_dev(a5, "data-toggle", "list");
    			attr_dev(a5, "href", "#list-28");
    			attr_dev(a5, "role", "tab");
    			attr_dev(a5, "aria-controls", "profile");
    			add_location(a5, file$s, 872, 12, 24923);
    			attr_dev(a6, "class", "list-group-item list-group-item-action");
    			attr_dev(a6, "id", "list-profile-list");
    			attr_dev(a6, "data-toggle", "list");
    			attr_dev(a6, "href", "#list-ext");
    			attr_dev(a6, "role", "tab");
    			attr_dev(a6, "aria-controls", "profile");
    			add_location(a6, file$s, 873, 12, 25102);
    			attr_dev(div0, "class", "list-group");
    			attr_dev(div0, "id", "list-tab");
    			attr_dev(div0, "role", "tablist");
    			add_location(div0, file$s, 866, 10, 23957);
    			attr_dev(div1, "class", "col-4");
    			add_location(div1, file$s, 865, 8, 23926);
    			attr_dev(div2, "id", "container-4");
    			add_location(div2, file$s, 881, 20, 25585);
    			attr_dev(p0, "class", "highcharts-description");
    			add_location(p0, file$s, 882, 20, 25635);
    			attr_dev(figure0, "class", "highcharts-figure");
    			add_location(figure0, file$s, 880, 16, 25529);
    			attr_dev(div3, "class", "tab-pane fade show active");
    			attr_dev(div3, "id", "list-4");
    			attr_dev(div3, "role", "tabpanel");
    			attr_dev(div3, "aria-labelledby", "list-home-list");
    			add_location(div3, file$s, 879, 12, 25411);
    			attr_dev(div4, "id", "container-2");
    			add_location(div4, file$s, 889, 20, 25965);
    			attr_dev(p1, "class", "highcharts-description");
    			add_location(p1, file$s, 890, 20, 26015);
    			attr_dev(figure1, "class", "highcharts-figure");
    			add_location(figure1, file$s, 888, 16, 25909);
    			attr_dev(div5, "class", "tab-pane fade");
    			attr_dev(div5, "id", "list-2");
    			attr_dev(div5, "role", "tabpanel");
    			attr_dev(div5, "aria-labelledby", "list-profile-list");
    			add_location(div5, file$s, 887, 12, 25800);
    			attr_dev(div6, "id", "container-12");
    			add_location(div6, file$s, 897, 20, 26349);
    			attr_dev(p2, "class", "highcharts-description");
    			add_location(p2, file$s, 898, 20, 26400);
    			attr_dev(figure2, "class", "highcharts-figure");
    			add_location(figure2, file$s, 896, 16, 26293);
    			attr_dev(div7, "class", "tab-pane fade");
    			attr_dev(div7, "id", "list-12");
    			attr_dev(div7, "role", "tabpanel");
    			attr_dev(div7, "aria-labelledby", "list-profile-list");
    			add_location(div7, file$s, 895, 12, 26183);
    			attr_dev(div8, "id", "container-01");
    			add_location(div8, file$s, 905, 20, 26735);
    			attr_dev(p3, "class", "highcharts-description");
    			add_location(p3, file$s, 906, 20, 26786);
    			attr_dev(figure3, "class", "highcharts-figure");
    			add_location(figure3, file$s, 904, 16, 26679);
    			attr_dev(div9, "class", "tab-pane fade");
    			attr_dev(div9, "id", "list-01");
    			attr_dev(div9, "role", "tabpanel");
    			attr_dev(div9, "aria-labelledby", "list-profile-list");
    			add_location(div9, file$s, 903, 12, 26569);
    			attr_dev(div10, "id", "container-ext");
    			add_location(div10, file$s, 913, 20, 27113);
    			attr_dev(a7, "href", "https://restcountries.eu/rest/v2/all?fields=name;area;population");
    			add_location(a7, file$s, 916, 24, 27278);
    			attr_dev(p4, "class", "highcharts-description");
    			add_location(p4, file$s, 914, 20, 27165);
    			attr_dev(figure4, "class", "highcharts-figure");
    			add_location(figure4, file$s, 912, 16, 27057);
    			attr_dev(div11, "class", "tab-pane fade");
    			attr_dev(div11, "id", "list-ext");
    			attr_dev(div11, "role", "tabpanel");
    			attr_dev(div11, "aria-labelledby", "list-profile-list");
    			add_location(div11, file$s, 911, 12, 26946);
    			attr_dev(div12, "id", "container-28");
    			add_location(div12, file$s, 922, 20, 27624);
    			attr_dev(p5, "class", "highcharts-description");
    			add_location(p5, file$s, 923, 20, 27675);
    			attr_dev(figure5, "class", "highcharts-figure");
    			add_location(figure5, file$s, 921, 16, 27568);
    			attr_dev(div13, "class", "tab-pane fade");
    			attr_dev(div13, "id", "list-28");
    			attr_dev(div13, "role", "tabpanel");
    			attr_dev(div13, "aria-labelledby", "list-profile-list");
    			add_location(div13, file$s, 920, 12, 27458);
    			attr_dev(button0, "class", "btn btn-danger w-100");
    			attr_dev(button0, "onclick", "traer()");
    			add_location(button0, file$s, 931, 24, 28069);
    			attr_dev(div14, "class", "mt-5");
    			attr_dev(div14, "id", "container-ext");
    			add_location(div14, file$s, 932, 24, 28166);
    			attr_dev(div15, "class", "container my-5 text-center");
    			add_location(div15, file$s, 930, 20, 28003);
    			attr_dev(figure6, "class", "highcharts-figure");
    			add_location(figure6, file$s, 929, 16, 27947);
    			attr_dev(div16, "class", "tab-pane fade");
    			attr_dev(div16, "id", "list-ext");
    			attr_dev(div16, "role", "tabpanel");
    			attr_dev(div16, "aria-labelledby", "list-profile-list");
    			add_location(div16, file$s, 928, 12, 27836);
    			attr_dev(div17, "class", "tab-content");
    			attr_dev(div17, "id", "nav-tabContent");
    			add_location(div17, file$s, 878, 10, 25352);
    			attr_dev(div18, "class", "col-8");
    			add_location(div18, file$s, 877, 8, 25321);
    			attr_dev(div19, "class", "row");
    			add_location(div19, file$s, 864, 4, 23899);
    			add_location(main, file$s, 863, 0, 23887);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div19);
    			append_dev(div19, div1);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(div0, t2);
    			append_dev(div0, a1);
    			append_dev(div0, t4);
    			append_dev(div0, a2);
    			append_dev(div0, t6);
    			append_dev(div0, a3);
    			append_dev(div0, t8);
    			append_dev(div0, a4);
    			append_dev(div0, t10);
    			append_dev(div0, a5);
    			append_dev(div0, t12);
    			append_dev(div0, a6);
    			append_dev(div19, t14);
    			append_dev(div19, div18);
    			append_dev(div18, div17);
    			append_dev(div17, div3);
    			append_dev(div3, figure0);
    			append_dev(figure0, div2);
    			append_dev(figure0, t15);
    			append_dev(figure0, p0);
    			append_dev(div17, t17);
    			append_dev(div17, div5);
    			append_dev(div5, figure1);
    			append_dev(figure1, div4);
    			append_dev(figure1, t18);
    			append_dev(figure1, p1);
    			append_dev(div17, t20);
    			append_dev(div17, div7);
    			append_dev(div7, figure2);
    			append_dev(figure2, div6);
    			append_dev(figure2, t21);
    			append_dev(figure2, p2);
    			append_dev(div17, t23);
    			append_dev(div17, div9);
    			append_dev(div9, figure3);
    			append_dev(figure3, div8);
    			append_dev(figure3, t24);
    			append_dev(figure3, p3);
    			append_dev(div17, t26);
    			append_dev(div17, div11);
    			append_dev(div11, figure4);
    			append_dev(figure4, div10);
    			append_dev(figure4, t27);
    			append_dev(figure4, p4);
    			append_dev(p4, t28);
    			append_dev(p4, a7);
    			append_dev(div17, t30);
    			append_dev(div17, div13);
    			append_dev(div13, figure5);
    			append_dev(figure5, div12);
    			append_dev(figure5, t31);
    			append_dev(figure5, p5);
    			append_dev(div17, t33);
    			append_dev(div17, div16);
    			append_dev(div16, figure6);
    			append_dev(figure6, div15);
    			append_dev(div15, button0);
    			append_dev(div15, t35);
    			append_dev(div15, div14);
    			append_dev(main, t36);
    			mount_component(button1, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    async function loadGraph4$1() {
    	const BASE_API_URL = "https://sos1920-04.herokuapp.com/api/v1/traffic_accidents/";
    	let MyData = [];
    	const resData = await fetch(BASE_API_URL);
    	MyData = await resData.json();

    	/* let countries = [];
     let pevStock = [];
     let annualSale = [];
     let carsPer1000 = [];
     */
    	let provincies = [];

    	let accidentWithVictims = [];
    	let mortalAccident = [];
    	let death = [];

    	MyData.forEach(data => {
    		let province = data.province;
    		let year = data.year;
    		let acc = data.accidentWithVictims;
    		let mor = data.mortalAccident;
    		let dea = data.death;
    		provincies.push(province);
    		accidentWithVictims.push(acc);
    		mortalAccident.push(mor);
    		death.push(dea);
    	});

    	/*
        { 
       province:"Almeria",
    		year: 2018,
    		accidentWithVictims: 1194,
    		mortalAccident: 27,
    		death: 27,
    		hospitalizedWounded: 111,
    		notHospitalizedWounded: 1780
        }
        
        */
    	Highcharts.chart("container-4", {
    		chart: { zoomType: "xy" },
    		title: {
    			text: "Gráfica sobre datos de accidentes de tráfico.",
    			align: "left"
    		},
    		subtitle: {
    			text: "Datos sobre el año 2015-2018:",
    			align: "left"
    		},
    		xAxis: [{ categories: provincies, crosshair: true }],
    		yAxis: [
    			{
    				// Primary yAxis
    				labels: {
    					format: "{value} casos",
    					style: { color: Highcharts.getOptions().colors[2] }
    				},
    				title: {
    					text: "Accidentes Mortales",
    					style: { color: Highcharts.getOptions().colors[2] }
    				},
    				opposite: true
    			},
    			{
    				// Secondary yAxis
    				gridLineWidth: 0,
    				title: {
    					text: "Accidentes con Víctimas",
    					style: { color: Highcharts.getOptions().colors[0] }
    				},
    				labels: {
    					format: "{value} casos",
    					style: { color: Highcharts.getOptions().colors[0] }
    				}
    			},
    			{
    				// Tertiary yAxis
    				gridLineWidth: 0,
    				title: {
    					text: "Personas Fallecidas",
    					style: { color: Highcharts.getOptions().colors[1] }
    				},
    				labels: {
    					format: "{value} unidades",
    					style: { color: Highcharts.getOptions().colors[1] }
    				},
    				opposite: true
    			}
    		],
    		tooltip: { shared: true },
    		legend: {
    			align: "left",
    			verticalAlign: "bottom",
    			y: 25,
    			floating: true,
    			backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || // theme
    			"rgba(255,255,255,0.25)"
    		},
    		series: [
    			{
    				name: "Accidentes con Víctimas",
    				type: "column",
    				yAxis: 1,
    				data: accidentWithVictims,
    				tooltip: { valueSuffix: " Personas" }
    			},
    			{
    				name: "Personas Fallecidas",
    				type: "spline",
    				yAxis: 2,
    				data: death,
    				marker: { enabled: false },
    				dashStyle: "shortdot",
    				tooltip: { valueSuffix: " Personas" }
    			},
    			{
    				name: "Accidentes Mortales",
    				type: "spline",
    				data: mortalAccident,
    				tooltip: { valueSuffix: " Personas" }
    			}
    		],
    		responsive: {
    			rules: [
    				{
    					condition: { maxWidth: 500 },
    					chartOptions: {
    						legend: {
    							floating: false,
    							layout: "horizontal",
    							align: "center",
    							verticalAlign: "bottom",
    							x: 0,
    							y: 0
    						},
    						yAxis: [
    							{
    								labels: { align: "right", x: 0, y: -6 },
    								showLastLabel: false
    							},
    							{
    								labels: { align: "left", x: 0, y: -6 },
    								showLastLabel: false
    							},
    							{ visible: false }
    						]
    					}
    				}
    			]
    		}
    	});
    }

    async function loadGraph2() {
    	const BASE_API_URL = "/api/v2/evolution-of-cycling-routes";
    	let MyData = [];
    	const resData = await fetch(BASE_API_URL);
    	MyData = await resData.json();

    	/* let countries = [];
     let pevStock = [];
     let annualSale = [];
     let carsPer1000 = [];
     */
    	let provincies = [];

    	let metropolitans = [];
    	let urbans = [];
    	let rests = [];

    	MyData.forEach(data => {
    		let province = data.province;
    		let year = data.year;
    		let metr = data.metropolitan;
    		let urb = data.urban;
    		let res = data.rest;

    		if (data.year == 2015) {
    			provincies.push(province);
    			metropolitans.push(metr);
    			urbans.push(urb);
    			rests.push(res);
    		}
    	});

    	/* 
        {   province: "almeria",
      year: 2015,
      metropolitan: 77.6,
      urban: 53.2, rest: 24.3
        }
         */
    	Highcharts.chart("container-2", {
    		chart: { zoomType: "xy" },
    		title: {
    			text: "Gráfica sobre datos de accidentes de tráfico.",
    			align: "left"
    		},
    		subtitle: {
    			text: "Datos sobre el año 2015:",
    			align: "left"
    		},
    		xAxis: [{ categories: provincies, crosshair: true }],
    		yAxis: [
    			{
    				// Primary yAxis
    				labels: {
    					format: "{value} km",
    					style: { color: Highcharts.getOptions().colors[2] }
    				},
    				title: {
    					text: "Metropolitano",
    					style: { color: Highcharts.getOptions().colors[2] }
    				},
    				opposite: true
    			},
    			{
    				// Secondary yAxis
    				gridLineWidth: 0,
    				title: {
    					text: "Urbano",
    					style: { color: Highcharts.getOptions().colors[0] }
    				},
    				labels: {
    					format: "{value} km",
    					style: { color: Highcharts.getOptions().colors[0] }
    				}
    			},
    			{
    				// Tertiary yAxis
    				gridLineWidth: 0,
    				title: {
    					text: "Resto",
    					style: { color: Highcharts.getOptions().colors[1] }
    				},
    				labels: {
    					format: "{value} km",
    					style: { color: Highcharts.getOptions().colors[1] }
    				},
    				opposite: true
    			}
    		],
    		tooltip: { shared: true },
    		legend: {
    			align: "left",
    			verticalAlign: "bottom",
    			y: 25,
    			floating: true,
    			backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || // theme
    			"rgba(255,255,255,0.25)"
    		},
    		series: [
    			{
    				name: "Urbano",
    				type: "column",
    				yAxis: 1,
    				data: urbans,
    				tooltip: { valueSuffix: " Personas" }
    			},
    			{
    				name: "Resto",
    				type: "spline",
    				yAxis: 2,
    				data: rests,
    				marker: { enabled: false },
    				dashStyle: "shortdot",
    				tooltip: { valueSuffix: " Personas" }
    			},
    			{
    				name: "Metropolitano",
    				type: "spline",
    				data: metropolitans,
    				tooltip: { valueSuffix: " Personas" }
    			}
    		],
    		responsive: {
    			rules: [
    				{
    					condition: { maxWidth: 500 },
    					chartOptions: {
    						legend: {
    							floating: false,
    							layout: "horizontal",
    							align: "center",
    							verticalAlign: "bottom",
    							x: 0,
    							y: 0
    						},
    						yAxis: [
    							{
    								labels: { align: "right", x: 0, y: -6 },
    								showLastLabel: false
    							},
    							{
    								labels: { align: "left", x: 0, y: -6 },
    								showLastLabel: false
    							},
    							{ visible: false }
    						]
    					}
    				}
    			]
    		}
    	});
    }

    async function loadGraph12() {
    	const BASE_API_URL = "http://sos1920-12.herokuapp.com/api/v1/drug_offences";
    	let MyData = [];
    	const resData = await fetch(BASE_API_URL);
    	MyData = await resData.json();

    	/*  country: "Portugal",
    	    year: 2014,
    		cannabis_offences: 11836,
    		offences_use: 7417,
    		offences_supply:4419
    */
    	let countries = [];

    	let cannabisoffences = [];
    	let offencesuse = [];
    	let offences_supply = [];

    	MyData.forEach(data => {
    		let country = data.country;
    		let year = data.year;
    		let cannoffen = data.cannabis_offences;
    		let offuse = data.offences_use;
    		let offsup = data.offences_supply;

    		if (data.year == 2017 || data.year == 2016) {
    			countries.push(country);
    			cannabisoffences.push(cannoffen);
    			offencesuse.push(offuse);
    			offences_supply.push(offsup);
    		}
    	});

    	/* 
        {   province: "almeria",
      year: 2015,
      metropolitan: 77.6,
      urban: 53.2, rest: 24.3
        }
         */
    	Highcharts.chart("container-12", {
    		chart: { zoomType: "xy" },
    		title: {
    			text: "Gráfica sobre datos relacionados con asesinatos y consumo de cannabis.",
    			align: "left"
    		},
    		subtitle: {
    			text: "Datos comprendidos entre 2016 y 2017:",
    			align: "left"
    		},
    		xAxis: [{ categories: countries, crosshair: true }],
    		yAxis: [
    			{
    				// Primary yAxis
    				labels: {
    					format: "{value} casos",
    					style: { color: Highcharts.getOptions().colors[2] }
    				},
    				title: {
    					text: "Delitos relacionados con el Cannabis",
    					style: { color: Highcharts.getOptions().colors[2] }
    				},
    				opposite: true
    			},
    			{
    				// Secondary yAxis
    				gridLineWidth: 0,
    				title: {
    					text: "Delitos relacionados con el tráfico de Cannabis",
    					style: { color: Highcharts.getOptions().colors[0] }
    				},
    				labels: {
    					format: "{value} casos",
    					style: { color: Highcharts.getOptions().colors[0] }
    				}
    			},
    			{
    				// Tertiary yAxis
    				gridLineWidth: 0,
    				title: {
    					text: "Delitos relacionadso con el uso de Cannabis",
    					style: { color: Highcharts.getOptions().colors[1] }
    				},
    				labels: {
    					format: "{value} km",
    					style: { color: Highcharts.getOptions().colors[1] }
    				},
    				opposite: true
    			}
    		],
    		tooltip: { shared: true },
    		legend: {
    			align: "left",
    			verticalAlign: "bottom",
    			y: 25,
    			floating: true,
    			backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || // theme
    			"rgba(255,255,255,0.25)"
    		},
    		series: [
    			{
    				name: "Tráfico",
    				type: "column",
    				yAxis: 1,
    				data: offences_supply,
    				tooltip: { valueSuffix: " casos" }
    			},
    			{
    				name: "Uso",
    				type: "spline",
    				yAxis: 2,
    				data: offencesuse,
    				marker: { enabled: false },
    				dashStyle: "shortdot",
    				tooltip: { valueSuffix: " casos" }
    			},
    			{
    				name: "Total",
    				type: "spline",
    				data: cannabisoffences,
    				tooltip: { valueSuffix: " casos" }
    			}
    		],
    		responsive: {
    			rules: [
    				{
    					condition: { maxWidth: 500 },
    					chartOptions: {
    						legend: {
    							floating: false,
    							layout: "horizontal",
    							align: "center",
    							verticalAlign: "bottom",
    							x: 0,
    							y: 0
    						},
    						yAxis: [
    							{
    								labels: { align: "right", x: 0, y: -6 },
    								showLastLabel: false
    							},
    							{
    								labels: { align: "left", x: 0, y: -6 },
    								showLastLabel: false
    							},
    							{ visible: false }
    						]
    					}
    				}
    			]
    		}
    	});
    }

    async function loadGraph01() {
    	const BASE_API_URL = "http://sos1920-01.herokuapp.com/api/v2/poverty-stats";
    	let MyData = [];
    	const resData = await fetch(BASE_API_URL);
    	MyData = await resData.json();

    	/* 
        country: "spain",
        year: 2010,
        poverty_prp:9551,
        poverty_pt:8763,
        poverty_ht:18402
    */
    	let countries = [];

    	let povertyprp = [];
    	let povertypt = [];
    	let povertyht = [];

    	MyData.forEach(data => {
    		let country = data.country;
    		let year = data.year;
    		let prp = data.poverty_prp;
    		let pt = data.poverty_pt;
    		let ht = data.poverty_ht;

    		if (data.year == 2015 || data.year == 2017) {
    			countries.push(country);
    			povertyprp.push(prp);
    			povertypt.push(pt);
    			povertyht.push(ht);
    		}
    	});

    	/* 
        {   province: "almeria",
      year: 2015,
      metropolitan: 77.6,
      urban: 53.2, rest: 24.3
        }
         */
    	Highcharts.chart("container-01", {
    		chart: { zoomType: "xy" },
    		title: {
    			text: "Gráfica sobre datos relacionados con la pobreza.",
    			align: "left"
    		},
    		subtitle: {
    			text: "Datos de 2015 y 2017:",
    			align: "left"
    		},
    		xAxis: [{ categories: countries, crosshair: true }],
    		yAxis: [
    			{
    				// Primary yAxis
    				labels: {
    					format: "{value} personas",
    					style: { color: Highcharts.getOptions().colors[2] }
    				},
    				title: {
    					text: "Personas en riesgo de pobreza",
    					style: { color: Highcharts.getOptions().colors[2] }
    				},
    				opposite: true
    			},
    			{
    				// Secondary yAxis
    				gridLineWidth: 0,
    				title: {
    					text: "Umbral de ingreso minimo por persona",
    					style: { color: Highcharts.getOptions().colors[0] }
    				},
    				labels: {
    					format: "{value} euros",
    					style: { color: Highcharts.getOptions().colors[0] }
    				}
    			},
    			{
    				// Tertiary yAxis
    				gridLineWidth: 0,
    				title: {
    					text: "Umbral de ingreso minimo por hogar",
    					style: { color: Highcharts.getOptions().colors[1] }
    				},
    				labels: {
    					format: "{value} euros",
    					style: { color: Highcharts.getOptions().colors[1] }
    				},
    				opposite: true
    			}
    		],
    		tooltip: { shared: true },
    		legend: {
    			align: "left",
    			verticalAlign: "bottom",
    			y: 25,
    			floating: true,
    			backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || // theme
    			"rgba(255,255,255,0.25)"
    		},
    		series: [
    			{
    				name: "Umbral por persona",
    				type: "column",
    				yAxis: 1,
    				data: povertypt,
    				tooltip: { valueSuffix: " euros" }
    			},
    			{
    				name: "Personas con pobreza",
    				type: "spline",
    				yAxis: 2,
    				data: povertyprp,
    				marker: { enabled: false },
    				dashStyle: "shortdot",
    				tooltip: { valueSuffix: " personas" }
    			},
    			{
    				name: "Umbral por Hogar",
    				type: "spline",
    				data: povertyht,
    				tooltip: { valueSuffix: " euros" }
    			}
    		],
    		responsive: {
    			rules: [
    				{
    					condition: { maxWidth: 500 },
    					chartOptions: {
    						legend: {
    							floating: false,
    							layout: "horizontal",
    							align: "center",
    							verticalAlign: "bottom",
    							x: 0,
    							y: 0
    						},
    						yAxis: [
    							{
    								labels: { align: "right", x: 0, y: -6 },
    								showLastLabel: false
    							},
    							{
    								labels: { align: "left", x: 0, y: -6 },
    								showLastLabel: false
    							},
    							{ visible: false }
    						]
    					}
    				}
    			]
    		}
    	});
    }

    async function loadGraphExt1$1() {
    	console.log("Loading external api");
    	const BASE_API_URL = "/api/v2/oil-coal-nuclear-energy-consumption-stats";
    	const BASE_API_URL_External01 = "https://restcountries.eu/rest/v2/all?fields=name;area;population";
    	const resData = await fetch(BASE_API_URL);
    	const resDataExternal01 = await fetch(BASE_API_URL_External01);
    	let MyData = await resData.json();
    	let DataExternal01 = await resDataExternal01.json();
    	console.log(DataExternal01);
    	console.log(MyData);

    	let dataPrimary = MyData.map(d => {
    		let res = {
    			name: d.country + " - " + d.year,
    			value: d["oil-consumption"]
    		};

    		return res;
    	});

    	let dataAPIExternal01 = DataExternal01.filter(d => {
    		return d.area > 5000000;
    	}).map(d => {
    		let res = {
    			name: d.name + " - " + d.population,
    			value: d.area
    		};

    		return res;
    	});

    	let datos = [
    		{
    			name: "Millones de toneladas de petróleo.",
    			data: dataPrimary
    		},
    		{
    			name: "Area por País y Población.",
    			data: dataAPIExternal01
    		}
    	];

    	Highcharts.chart("container-ext", {
    		chart: { type: "packedbubble", height: "100%" },
    		title: {
    			text: "Relacion Consumo de petroleo por Países junto con Países y su Poblacion con un area meno que 250."
    		},
    		tooltip: {
    			useHTML: true,
    			pointFormat: "<b>{point.name}:</b> {point.value}"
    		},
    		plotOptions: {
    			packedbubble: {
    				minSize: "30%",
    				maxSize: "120%",
    				zMin: 0,
    				zMax: 1000,
    				layoutAlgorithm: {
    					splitSeries: false,
    					gravitationalConstant: 0.02
    				},
    				dataLabels: {
    					enabled: true,
    					format: "{point.name}",
    					filter: { property: "y", operator: ">", value: 250 },
    					style: {
    						color: "black",
    						textOutline: "none",
    						fontWeight: "normal"
    					}
    				}
    			}
    		},
    		series: datos
    	});
    }

    function instance$t($$self, $$props, $$invalidate) {
    	loadGraph4$1();
    	loadGraph2();
    	loadGraph12();
    	loadGraph01();
    	loadGraphExt1$1();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$b.warn(`<Integrations> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Integrations", $$slots, []);

    	$$self.$capture_state = () => ({
    		Button,
    		pop,
    		loadGraph4: loadGraph4$1,
    		loadGraph2,
    		loadGraph12,
    		loadGraph01,
    		loadGraphExt1: loadGraphExt1$1
    	});

    	return [];
    }

    class Integrations$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Integrations",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* src\front\plugInVehiclesAPI\Integrations.svelte generated by Svelte v3.20.1 */

    const { console: console_1$c } = globals;
    const file$t = "src\\front\\plugInVehiclesAPI\\Integrations.svelte";

    // (1569:4) <Button outline color="secondary" on:click="{pop}">
    function create_default_slot$g(ctx) {
    	let i;
    	let t;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t = text(" Atrás");
    			attr_dev(i, "class", "fas fa-arrow-circle-left");
    			add_location(i, file$t, 1568, 56, 52923);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$g.name,
    		type: "slot",
    		source: "(1569:4) <Button outline color=\\\"secondary\\\" on:click=\\\"{pop}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let script3;
    	let script3_src_value;
    	let t0;
    	let main;
    	let div30;
    	let div1;
    	let div0;
    	let a0;
    	let t2;
    	let a1;
    	let t4;
    	let a2;
    	let t6;
    	let a3;
    	let t8;
    	let a4;
    	let t10;
    	let a5;
    	let t12;
    	let a6;
    	let t14;
    	let a7;
    	let t16;
    	let a8;
    	let t18;
    	let a9;
    	let t20;
    	let a10;
    	let t22;
    	let a11;
    	let t24;
    	let a12;
    	let t26;
    	let div29;
    	let div28;
    	let div3;
    	let figure0;
    	let div2;
    	let t27;
    	let p0;
    	let t29;
    	let div5;
    	let figure1;
    	let div4;
    	let t30;
    	let p1;
    	let t32;
    	let div7;
    	let figure2;
    	let div6;
    	let t33;
    	let p2;
    	let t35;
    	let div9;
    	let figure3;
    	let div8;
    	let t36;
    	let p3;
    	let t38;
    	let div11;
    	let figure4;
    	let div10;
    	let t39;
    	let p4;
    	let t41;
    	let div13;
    	let figure5;
    	let div12;
    	let t42;
    	let p5;
    	let t44;
    	let div15;
    	let figure6;
    	let div14;
    	let t45;
    	let p6;
    	let t47;
    	let div17;
    	let figure7;
    	let div16;
    	let t48;
    	let p7;
    	let t50;
    	let div19;
    	let figure8;
    	let div18;
    	let t51;
    	let p8;
    	let t53;
    	let div21;
    	let figure9;
    	let div20;
    	let t54;
    	let p9;
    	let t56;
    	let div23;
    	let figure10;
    	let div22;
    	let t57;
    	let p10;
    	let t59;
    	let div25;
    	let figure11;
    	let div24;
    	let t60;
    	let p11;
    	let t62;
    	let div27;
    	let figure12;
    	let div26;
    	let t63;
    	let p12;
    	let t65;
    	let current;

    	const button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$g] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", pop);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			script2 = element("script");
    			script3 = element("script");
    			t0 = space();
    			main = element("main");
    			div30 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			a0.textContent = "Integración con 01 emigrants-stats";
    			t2 = space();
    			a1 = element("a");
    			a1.textContent = "Integración con 04 roads";
    			t4 = space();
    			a2 = element("a");
    			a2.textContent = "Integración con 05 life_expectancies";
    			t6 = space();
    			a3 = element("a");
    			a3.textContent = "Integración con 06 not-hospitalized-stats";
    			t8 = space();
    			a4 = element("a");
    			a4.textContent = "Integración con 07 imports";
    			t10 = space();
    			a5 = element("a");
    			a5.textContent = "Integración con 08 electricity-produced-stats";
    			t12 = space();
    			a6 = element("a");
    			a6.textContent = "Integración con 12 overdose-deaths";
    			t14 = space();
    			a7 = element("a");
    			a7.textContent = "Integración con 23 fires-stats";
    			t16 = space();
    			a8 = element("a");
    			a8.textContent = "Integración con 24 atc-stats";
    			t18 = space();
    			a9 = element("a");
    			a9.textContent = "Integración con 27 spc-stats";
    			t20 = space();
    			a10 = element("a");
    			a10.textContent = "Integración con 28 gce";
    			t22 = space();
    			a11 = element("a");
    			a11.textContent = "Integración Externa 01";
    			t24 = space();
    			a12 = element("a");
    			a12.textContent = "Integración Externa 02";
    			t26 = space();
    			div29 = element("div");
    			div28 = element("div");
    			div3 = element("div");
    			figure0 = element("figure");
    			div2 = element("div");
    			t27 = space();
    			p0 = element("p");
    			p0.textContent = "La integración está realizada con emigrantes totales en todo el mundo junto el porcentaje de coches eléctricos cada 1000 personas \r\n                        en el año 2017 y 2018 respectivamente.";
    			t29 = space();
    			div5 = element("div");
    			figure1 = element("figure");
    			div4 = element("div");
    			t30 = space();
    			p1 = element("p");
    			p1.textContent = "La integración muestra los datos en España sobre el número total de carreteras, autopistas y autovías \r\n                        junto con la venta anual de coches electricos en 2018 (también en España).";
    			t32 = space();
    			div7 = element("div");
    			figure2 = element("figure");
    			div6 = element("div");
    			t33 = space();
    			p2 = element("p");
    			p2.textContent = "La integración muestra la esperanza de vida media en todo el mundo junto el porcentaje de coches\r\n                        eléctricos cada 1000 personas en todo el mundo en el año 2018.";
    			t35 = space();
    			div9 = element("div");
    			figure3 = element("figure");
    			div8 = element("div");
    			t36 = space();
    			p3 = element("p");
    			p3.textContent = "La integración muestra el número total de vías urbanas e interurbanas en distintas ciudades de España\r\n                        junto al porcentaje de coches eléctricos cada 1000 personas en España en el año 2018.";
    			t38 = space();
    			div11 = element("div");
    			figure4 = element("figure");
    			div10 = element("div");
    			t39 = space();
    			p4 = element("p");
    			p4.textContent = "La integración muestra la cantidad de alcohol total importado en todo el mundo en el año 2000\r\n                        junto al porcentaje de coches eléctricos cada 1000 personas en todo el mundo en el año 2018.";
    			t41 = space();
    			div13 = element("div");
    			figure5 = element("figure");
    			div12 = element("div");
    			t42 = space();
    			p5 = element("p");
    			p5.textContent = "La integración muestra el porcentaje de coches eléctricos cada 1000 personas en todo el mundo\r\n                        junto a la cantidad de energía producida, por carbon, solar o hidrográfica, en el año 2018.\r\n                        Podría haber mostrado unicamente los datos de EEUU, pero la gráfica resultante no resulta \r\n                        muy agradable visualmente.";
    			t44 = space();
    			div15 = element("div");
    			figure6 = element("figure");
    			div14 = element("div");
    			t45 = space();
    			p6 = element("p");
    			p6.textContent = "La integración muestra el número total de muertes por sobredosis, tanto masculinas como femeninas, en todo\r\n                        el mundo en el año 2017 junto al porcentaje de coches electricos cada 1000 personas en 2018.";
    			t47 = space();
    			div17 = element("div");
    			figure7 = element("figure");
    			div16 = element("div");
    			t48 = space();
    			p7 = element("p");
    			p7.textContent = "La integración muestra el número total de incendios en cada comunidad autónoma de España en el año 2007\r\n                        junto al porcentaje de coches eléctricos en el año 2018 en España.";
    			t50 = space();
    			div19 = element("div");
    			figure8 = element("figure");
    			div18 = element("div");
    			t51 = space();
    			p8 = element("p");
    			p8.textContent = "La integración muestra el coste medio de las matriculas universitarias españolas junto el Porcentaje\r\n                        de coches eléctricos cada 1000 personas en el año 2018 en España.";
    			t53 = space();
    			div21 = element("div");
    			figure9 = element("figure");
    			div20 = element("div");
    			t54 = space();
    			p9 = element("p");
    			p9.textContent = "La integración muestra el porcentaje de suicidios totales en paises de todo el mundo en el año 2013\r\n                        junto el porcentaje de coches eléctricos cada 1000 personas en todo el mundo en el año 2018.";
    			t56 = space();
    			div23 = element("div");
    			figure10 = element("figure");
    			div22 = element("div");
    			t57 = space();
    			p10 = element("p");
    			p10.textContent = "La integración muestra el porcentaje per capital en 2014 junto el porcentaje del número de coches\r\n                        eléctricos cada 1000 personas en el año 2018, en todo el mundo.";
    			t59 = space();
    			div25 = element("div");
    			figure11 = element("figure");
    			div24 = element("div");
    			t60 = space();
    			p11 = element("p");
    			p11.textContent = "Integra la API externa mediante proxy, y muestra datos del porcentaje de coches eléctricos cada\r\n                        1000 personas en USA junto con el nombre y el dorsal de jugadores de baloncesto de la NBA (en USA).";
    			t62 = space();
    			div27 = element("div");
    			figure12 = element("figure");
    			div26 = element("div");
    			t63 = space();
    			p12 = element("p");
    			p12.textContent = "Integra la API externa mediante proxy, y muestra datos del porcentaje de coches eléctricos cada 1000 personas\r\n                        junto el número y nombre de los satelites desplegados en el año 2018.";
    			t65 = space();
    			create_component(button.$$.fragment);
    			if (script0.src !== (script0_src_value = "https://code.highcharts.com/highcharts.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$t, 1412, 4, 42154);
    			if (script1.src !== (script1_src_value = "https://code.highcharts.com/highcharts-more.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$t, 1413, 4, 42225);
    			if (script2.src !== (script2_src_value = "https://code.highcharts.com/modules/exporting.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$t, 1414, 4, 42301);
    			if (script3.src !== (script3_src_value = "https://code.highcharts.com/modules/accessibility.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$t, 1415, 4, 42379);
    			attr_dev(a0, "class", "list-group-item list-group-item-action active");
    			attr_dev(a0, "id", "list-home-list");
    			attr_dev(a0, "data-toggle", "list");
    			attr_dev(a0, "href", "#list-01");
    			attr_dev(a0, "role", "tab");
    			attr_dev(a0, "aria-controls", "home");
    			add_location(a0, file$t, 1425, 12, 42622);
    			attr_dev(a1, "class", "list-group-item list-group-item-action");
    			attr_dev(a1, "id", "list-profile-list");
    			attr_dev(a1, "data-toggle", "list");
    			attr_dev(a1, "href", "#list-04");
    			attr_dev(a1, "role", "tab");
    			attr_dev(a1, "aria-controls", "profile");
    			add_location(a1, file$t, 1426, 12, 42818);
    			attr_dev(a2, "class", "list-group-item list-group-item-action");
    			attr_dev(a2, "id", "list-profile-list");
    			attr_dev(a2, "data-toggle", "list");
    			attr_dev(a2, "href", "#list-05");
    			attr_dev(a2, "role", "tab");
    			attr_dev(a2, "aria-controls", "profile");
    			add_location(a2, file$t, 1427, 12, 43003);
    			attr_dev(a3, "class", "list-group-item list-group-item-action");
    			attr_dev(a3, "id", "list-profile-list");
    			attr_dev(a3, "data-toggle", "list");
    			attr_dev(a3, "href", "#list-06");
    			attr_dev(a3, "role", "tab");
    			attr_dev(a3, "aria-controls", "profile");
    			add_location(a3, file$t, 1428, 12, 43200);
    			attr_dev(a4, "class", "list-group-item list-group-item-action");
    			attr_dev(a4, "id", "list-profile-list");
    			attr_dev(a4, "data-toggle", "list");
    			attr_dev(a4, "href", "#list-07");
    			attr_dev(a4, "role", "tab");
    			attr_dev(a4, "aria-controls", "profile");
    			add_location(a4, file$t, 1429, 12, 43402);
    			attr_dev(a5, "class", "list-group-item list-group-item-action");
    			attr_dev(a5, "id", "list-profile-list");
    			attr_dev(a5, "data-toggle", "list");
    			attr_dev(a5, "href", "#list-08");
    			attr_dev(a5, "role", "tab");
    			attr_dev(a5, "aria-controls", "profile");
    			add_location(a5, file$t, 1430, 12, 43589);
    			attr_dev(a6, "class", "list-group-item list-group-item-action");
    			attr_dev(a6, "id", "list-profile-list");
    			attr_dev(a6, "data-toggle", "list");
    			attr_dev(a6, "href", "#list-12");
    			attr_dev(a6, "role", "tab");
    			attr_dev(a6, "aria-controls", "profile");
    			add_location(a6, file$t, 1431, 12, 43795);
    			attr_dev(a7, "class", "list-group-item list-group-item-action");
    			attr_dev(a7, "id", "list-profile-list");
    			attr_dev(a7, "data-toggle", "list");
    			attr_dev(a7, "href", "#list-23");
    			attr_dev(a7, "role", "tab");
    			attr_dev(a7, "aria-controls", "profile");
    			add_location(a7, file$t, 1432, 12, 43990);
    			attr_dev(a8, "class", "list-group-item list-group-item-action");
    			attr_dev(a8, "id", "list-profile-list");
    			attr_dev(a8, "data-toggle", "list");
    			attr_dev(a8, "href", "#list-24");
    			attr_dev(a8, "role", "tab");
    			attr_dev(a8, "aria-controls", "profile");
    			add_location(a8, file$t, 1433, 12, 44181);
    			attr_dev(a9, "class", "list-group-item list-group-item-action");
    			attr_dev(a9, "id", "list-profile-list");
    			attr_dev(a9, "data-toggle", "list");
    			attr_dev(a9, "href", "#list-27");
    			attr_dev(a9, "role", "tab");
    			attr_dev(a9, "aria-controls", "profile");
    			add_location(a9, file$t, 1434, 12, 44370);
    			attr_dev(a10, "class", "list-group-item list-group-item-action");
    			attr_dev(a10, "id", "list-profile-list");
    			attr_dev(a10, "data-toggle", "list");
    			attr_dev(a10, "href", "#list-28");
    			attr_dev(a10, "role", "tab");
    			attr_dev(a10, "aria-controls", "profile");
    			add_location(a10, file$t, 1435, 12, 44559);
    			attr_dev(a11, "class", "list-group-item list-group-item-action");
    			attr_dev(a11, "id", "list-profile-list");
    			attr_dev(a11, "data-toggle", "list");
    			attr_dev(a11, "href", "#list-Ext01");
    			attr_dev(a11, "role", "tab");
    			attr_dev(a11, "aria-controls", "profile");
    			add_location(a11, file$t, 1436, 12, 44742);
    			attr_dev(a12, "class", "list-group-item list-group-item-action");
    			attr_dev(a12, "id", "list-profile-list");
    			attr_dev(a12, "data-toggle", "list");
    			attr_dev(a12, "href", "#list-Ext02");
    			attr_dev(a12, "role", "tab");
    			attr_dev(a12, "aria-controls", "profile");
    			add_location(a12, file$t, 1437, 12, 44928);
    			attr_dev(div0, "class", "list-group");
    			attr_dev(div0, "id", "list-tab");
    			attr_dev(div0, "role", "tablist");
    			add_location(div0, file$t, 1423, 10, 42553);
    			attr_dev(div1, "class", "col-4");
    			add_location(div1, file$t, 1422, 8, 42522);
    			attr_dev(div2, "id", "container01");
    			add_location(div2, file$t, 1445, 20, 45409);
    			attr_dev(p0, "class", "highcharts-description");
    			add_location(p0, file$t, 1446, 20, 45459);
    			attr_dev(figure0, "class", "highcharts-figure");
    			add_location(figure0, file$t, 1444, 16, 45353);
    			attr_dev(div3, "class", "tab-pane fade show active");
    			attr_dev(div3, "id", "list-01");
    			attr_dev(div3, "role", "tabpanel");
    			attr_dev(div3, "aria-labelledby", "list-home-list");
    			add_location(div3, file$t, 1443, 12, 45234);
    			attr_dev(div4, "id", "container04");
    			add_location(div4, file$t, 1454, 20, 45966);
    			attr_dev(p1, "class", "highcharts-description");
    			add_location(p1, file$t, 1455, 20, 46016);
    			attr_dev(figure1, "class", "highcharts-figure");
    			add_location(figure1, file$t, 1453, 16, 45910);
    			attr_dev(div5, "class", "tab-pane fade");
    			attr_dev(div5, "id", "list-04");
    			attr_dev(div5, "role", "tabpanel");
    			attr_dev(div5, "aria-labelledby", "list-profile-list");
    			add_location(div5, file$t, 1452, 12, 45800);
    			attr_dev(div6, "id", "container05");
    			add_location(div6, file$t, 1463, 20, 46531);
    			attr_dev(p2, "class", "highcharts-description");
    			add_location(p2, file$t, 1464, 20, 46581);
    			attr_dev(figure2, "class", "highcharts-figure");
    			add_location(figure2, file$t, 1462, 16, 46475);
    			attr_dev(div7, "class", "tab-pane fade");
    			attr_dev(div7, "id", "list-05");
    			attr_dev(div7, "role", "tabpanel");
    			attr_dev(div7, "aria-labelledby", "list-profile-list");
    			add_location(div7, file$t, 1461, 12, 46365);
    			attr_dev(div8, "id", "container06");
    			add_location(div8, file$t, 1472, 20, 47078);
    			attr_dev(p3, "class", "highcharts-description");
    			add_location(p3, file$t, 1473, 20, 47128);
    			attr_dev(figure3, "class", "highcharts-figure");
    			add_location(figure3, file$t, 1471, 16, 47022);
    			attr_dev(div9, "class", "tab-pane fade");
    			attr_dev(div9, "id", "list-06");
    			attr_dev(div9, "role", "tabpanel");
    			attr_dev(div9, "aria-labelledby", "list-profile-list");
    			add_location(div9, file$t, 1470, 12, 46912);
    			attr_dev(div10, "id", "container07");
    			add_location(div10, file$t, 1482, 20, 47679);
    			attr_dev(p4, "class", "highcharts-description");
    			add_location(p4, file$t, 1483, 20, 47729);
    			attr_dev(figure4, "class", "highcharts-figure");
    			add_location(figure4, file$t, 1481, 16, 47623);
    			attr_dev(div11, "class", "tab-pane fade");
    			attr_dev(div11, "id", "list-07");
    			attr_dev(div11, "role", "tabpanel");
    			attr_dev(div11, "aria-labelledby", "list-profile-list");
    			add_location(div11, file$t, 1480, 12, 47513);
    			attr_dev(div12, "id", "container08");
    			add_location(div12, file$t, 1491, 20, 48253);
    			attr_dev(p5, "class", "highcharts-description");
    			add_location(p5, file$t, 1492, 20, 48303);
    			attr_dev(figure5, "class", "highcharts-figure");
    			add_location(figure5, file$t, 1490, 16, 48197);
    			attr_dev(div13, "class", "tab-pane fade");
    			attr_dev(div13, "id", "list-08");
    			attr_dev(div13, "role", "tabpanel");
    			attr_dev(div13, "aria-labelledby", "list-profile-list");
    			add_location(div13, file$t, 1489, 12, 48087);
    			attr_dev(div14, "id", "container12");
    			add_location(div14, file$t, 1502, 20, 48994);
    			attr_dev(p6, "class", "highcharts-description");
    			add_location(p6, file$t, 1503, 20, 49044);
    			attr_dev(figure6, "class", "highcharts-figure");
    			add_location(figure6, file$t, 1501, 16, 48938);
    			attr_dev(div15, "class", "tab-pane fade");
    			attr_dev(div15, "id", "list-12");
    			attr_dev(div15, "role", "tabpanel");
    			attr_dev(div15, "aria-labelledby", "list-profile-list");
    			add_location(div15, file$t, 1500, 12, 48828);
    			attr_dev(div16, "id", "container23");
    			add_location(div16, file$t, 1511, 20, 49581);
    			attr_dev(p7, "class", "highcharts-description");
    			add_location(p7, file$t, 1512, 20, 49631);
    			attr_dev(figure7, "class", "highcharts-figure");
    			add_location(figure7, file$t, 1510, 16, 49525);
    			attr_dev(div17, "class", "tab-pane fade");
    			attr_dev(div17, "id", "list-23");
    			attr_dev(div17, "role", "tabpanel");
    			attr_dev(div17, "aria-labelledby", "list-profile-list");
    			add_location(div17, file$t, 1509, 12, 49415);
    			attr_dev(div18, "id", "container24");
    			add_location(div18, file$t, 1520, 20, 50139);
    			attr_dev(p8, "class", "highcharts-description");
    			add_location(p8, file$t, 1521, 20, 50189);
    			attr_dev(figure8, "class", "highcharts-figure");
    			add_location(figure8, file$t, 1519, 16, 50083);
    			attr_dev(div19, "class", "tab-pane fade");
    			attr_dev(div19, "id", "list-24");
    			attr_dev(div19, "role", "tabpanel");
    			attr_dev(div19, "aria-labelledby", "list-profile-list");
    			add_location(div19, file$t, 1518, 12, 49973);
    			attr_dev(div20, "id", "container27");
    			add_location(div20, file$t, 1529, 20, 50693);
    			attr_dev(p9, "class", "highcharts-description");
    			add_location(p9, file$t, 1530, 20, 50743);
    			attr_dev(figure9, "class", "highcharts-figure");
    			add_location(figure9, file$t, 1528, 16, 50637);
    			attr_dev(div21, "class", "tab-pane fade");
    			attr_dev(div21, "id", "list-27");
    			attr_dev(div21, "role", "tabpanel");
    			attr_dev(div21, "aria-labelledby", "list-profile-list");
    			add_location(div21, file$t, 1527, 12, 50527);
    			attr_dev(div22, "id", "container28");
    			add_location(div22, file$t, 1538, 20, 51273);
    			attr_dev(p10, "class", "highcharts-description");
    			add_location(p10, file$t, 1539, 20, 51323);
    			attr_dev(figure10, "class", "highcharts-figure");
    			add_location(figure10, file$t, 1537, 16, 51217);
    			attr_dev(div23, "class", "tab-pane fade");
    			attr_dev(div23, "id", "list-28");
    			attr_dev(div23, "role", "tabpanel");
    			attr_dev(div23, "aria-labelledby", "list-profile-list");
    			add_location(div23, file$t, 1536, 12, 51107);
    			attr_dev(div24, "id", "containerExt01");
    			add_location(div24, file$t, 1547, 20, 51825);
    			attr_dev(p11, "class", "highcharts-description");
    			add_location(p11, file$t, 1548, 20, 51878);
    			attr_dev(figure11, "class", "highcharts-figure");
    			add_location(figure11, file$t, 1546, 16, 51769);
    			attr_dev(div25, "class", "tab-pane fade");
    			attr_dev(div25, "id", "list-Ext01");
    			attr_dev(div25, "role", "tabpanel");
    			attr_dev(div25, "aria-labelledby", "list-profile-list");
    			add_location(div25, file$t, 1545, 12, 51656);
    			attr_dev(div26, "id", "containerExt02");
    			add_location(div26, file$t, 1556, 20, 52414);
    			attr_dev(p12, "class", "highcharts-description");
    			add_location(p12, file$t, 1557, 20, 52467);
    			attr_dev(figure12, "class", "highcharts-figure");
    			add_location(figure12, file$t, 1555, 16, 52358);
    			attr_dev(div27, "class", "tab-pane fade");
    			attr_dev(div27, "id", "list-Ext02");
    			attr_dev(div27, "role", "tabpanel");
    			attr_dev(div27, "aria-labelledby", "list-profile-list");
    			add_location(div27, file$t, 1554, 12, 52245);
    			attr_dev(div28, "class", "tab-content");
    			attr_dev(div28, "id", "nav-tabContent");
    			add_location(div28, file$t, 1442, 10, 45175);
    			attr_dev(div29, "class", "col-8");
    			add_location(div29, file$t, 1441, 8, 45144);
    			attr_dev(div30, "class", "row");
    			add_location(div30, file$t, 1421, 4, 42495);
    			add_location(main, file$t, 1419, 0, 42481);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			append_dev(document.head, script2);
    			append_dev(document.head, script3);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div30);
    			append_dev(div30, div1);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(div0, t2);
    			append_dev(div0, a1);
    			append_dev(div0, t4);
    			append_dev(div0, a2);
    			append_dev(div0, t6);
    			append_dev(div0, a3);
    			append_dev(div0, t8);
    			append_dev(div0, a4);
    			append_dev(div0, t10);
    			append_dev(div0, a5);
    			append_dev(div0, t12);
    			append_dev(div0, a6);
    			append_dev(div0, t14);
    			append_dev(div0, a7);
    			append_dev(div0, t16);
    			append_dev(div0, a8);
    			append_dev(div0, t18);
    			append_dev(div0, a9);
    			append_dev(div0, t20);
    			append_dev(div0, a10);
    			append_dev(div0, t22);
    			append_dev(div0, a11);
    			append_dev(div0, t24);
    			append_dev(div0, a12);
    			append_dev(div30, t26);
    			append_dev(div30, div29);
    			append_dev(div29, div28);
    			append_dev(div28, div3);
    			append_dev(div3, figure0);
    			append_dev(figure0, div2);
    			append_dev(figure0, t27);
    			append_dev(figure0, p0);
    			append_dev(div28, t29);
    			append_dev(div28, div5);
    			append_dev(div5, figure1);
    			append_dev(figure1, div4);
    			append_dev(figure1, t30);
    			append_dev(figure1, p1);
    			append_dev(div28, t32);
    			append_dev(div28, div7);
    			append_dev(div7, figure2);
    			append_dev(figure2, div6);
    			append_dev(figure2, t33);
    			append_dev(figure2, p2);
    			append_dev(div28, t35);
    			append_dev(div28, div9);
    			append_dev(div9, figure3);
    			append_dev(figure3, div8);
    			append_dev(figure3, t36);
    			append_dev(figure3, p3);
    			append_dev(div28, t38);
    			append_dev(div28, div11);
    			append_dev(div11, figure4);
    			append_dev(figure4, div10);
    			append_dev(figure4, t39);
    			append_dev(figure4, p4);
    			append_dev(div28, t41);
    			append_dev(div28, div13);
    			append_dev(div13, figure5);
    			append_dev(figure5, div12);
    			append_dev(figure5, t42);
    			append_dev(figure5, p5);
    			append_dev(div28, t44);
    			append_dev(div28, div15);
    			append_dev(div15, figure6);
    			append_dev(figure6, div14);
    			append_dev(figure6, t45);
    			append_dev(figure6, p6);
    			append_dev(div28, t47);
    			append_dev(div28, div17);
    			append_dev(div17, figure7);
    			append_dev(figure7, div16);
    			append_dev(figure7, t48);
    			append_dev(figure7, p7);
    			append_dev(div28, t50);
    			append_dev(div28, div19);
    			append_dev(div19, figure8);
    			append_dev(figure8, div18);
    			append_dev(figure8, t51);
    			append_dev(figure8, p8);
    			append_dev(div28, t53);
    			append_dev(div28, div21);
    			append_dev(div21, figure9);
    			append_dev(figure9, div20);
    			append_dev(figure9, t54);
    			append_dev(figure9, p9);
    			append_dev(div28, t56);
    			append_dev(div28, div23);
    			append_dev(div23, figure10);
    			append_dev(figure10, div22);
    			append_dev(figure10, t57);
    			append_dev(figure10, p10);
    			append_dev(div28, t59);
    			append_dev(div28, div25);
    			append_dev(div25, figure11);
    			append_dev(figure11, div24);
    			append_dev(figure11, t60);
    			append_dev(figure11, p11);
    			append_dev(div28, t62);
    			append_dev(div28, div27);
    			append_dev(div27, figure12);
    			append_dev(figure12, div26);
    			append_dev(figure12, t63);
    			append_dev(figure12, p12);
    			append_dev(main, t65);
    			mount_component(button, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			detach_dev(script2);
    			detach_dev(script3);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BASE_API_URL$6 = "/api/v3/plugin-vehicles-stats";

    async function loadGraph01$1() {
    	const BASE_API_URL_01 = "/api/v2/emigrants-stats";
    	const resData = await fetch(BASE_API_URL$6);
    	const resData01 = await fetch(BASE_API_URL_01);
    	let MyData = await resData.json();
    	let Data01 = await resData01.json();

    	/*
                Sus Datos:
    }
        "country": "spain",
        "year": 2017,
        "em_man": 609615,
        "em_woman": 736247,
        "em_totals": 1345862
    }
                Mis Datos:
    { 
        "country": "Japan",
        "year": 2018,
        "pev-stock": 257363,
        "annual-sale": 52013,
        "cars-per-1000": 2.0
    }
    */
    	let dataPlugin = MyData.filter(d => {
    		return d.year == 2018;
    	}).map(d => {
    		let res = {
    			name: d.country,
    			value: d["cars-per-1000"]
    		};

    		return res;
    	});

    	let dataAPI01 = Data01.filter(d => {
    		return d.year == 2017;
    	}).map(d => {
    		let res = { name: d.country, value: d.em_totals };
    		return res;
    	});

    	let datos = [
    		{
    			name: "Porcentaje de coche eléctricos cada 1000 personas en 2018.",
    			data: dataPlugin
    		},
    		{
    			name: "Emigrantes totales en el año 2017.",
    			data: dataAPI01
    		}
    	];

    	Highcharts.chart("container01", {
    		chart: { type: "packedbubble", height: "100%" },
    		title: {
    			text: "Integración con el grupo 01 emigrants-stats"
    		},
    		tooltip: {
    			useHTML: true,
    			pointFormat: "<b>{point.name}:</b> {point.value}"
    		},
    		plotOptions: {
    			packedbubble: {
    				minSize: "20%",
    				maxSize: "60%",
    				zMin: 0,
    				zMax: 1000,
    				layoutAlgorithm: {
    					gravitationalConstant: 0.05,
    					splitSeries: true,
    					seriesInteraction: false,
    					dragBetweenSeries: true,
    					parentNodeLimit: true
    				},
    				dataLabels: {
    					enabled: true,
    					format: "{point.name}",
    					filter: { property: "y", operator: ">", value: 250 },
    					style: {
    						color: "black",
    						textOutline: "none",
    						fontWeight: "normal"
    					}
    				}
    			}
    		},
    		series: datos
    	});
    }

    async function loadGraph04() {
    	const BASE_API_URL_04 = "https://sos1920-04.herokuapp.com/api/v1/roads/";
    	const resData = await fetch(BASE_API_URL$6);
    	const resData04 = await fetch(BASE_API_URL_04);
    	let MyData = await resData.json();
    	let Data04 = await resData04.json();

    	/*
                Sus Datos:
    {
        "province": "Madrid",
        "year": 2015,
        "oneway": 2347,
        "multipleway": 208,
        "dualCarriagewayAndHighway": 622,
        "highwayWithToll": 161,
        "total": 3338
    }
                Mis Datos:
    { 
        "country": "Japan",
        "year": 2018,
        "pev-stock": 257363,
        "annual-sale": 52013,
        "cars-per-1000": 2.0
    }
    */
    	let dataPlugin = MyData.filter(d => {
    		return d.year == 2018 && d.country == "Spain";
    	}).map(d => {
    		let res = { name: d.country, value: d["annual-sale"] };
    		return res;
    	});

    	let dataAPI04 = Data04.map(d => {
    		let res = { name: d["province"], value: d["total"] };
    		return res;
    	});

    	console.log(dataAPI04);

    	let datos = [
    		{
    			name: "Ventas anuales de coches electricos en España en 2018.",
    			data: dataPlugin
    		},
    		{
    			name: "Número total de carreteras, autopistas y autovías en España.",
    			data: dataAPI04
    		}
    	];

    	Highcharts.chart("container04", {
    		chart: { type: "packedbubble", height: "100%" },
    		title: {
    			text: "Integración con el grupo 04 roads"
    		},
    		tooltip: {
    			useHTML: true,
    			pointFormat: "<b>{point.name}:</b> {point.value}"
    		},
    		plotOptions: {
    			packedbubble: {
    				minSize: "05%",
    				maxSize: "40%",
    				zMin: 0,
    				zMax: 1000,
    				layoutAlgorithm: {
    					gravitationalConstant: 0.05,
    					splitSeries: true,
    					seriesInteraction: false,
    					dragBetweenSeries: true,
    					parentNodeLimit: true
    				},
    				dataLabels: {
    					enabled: true,
    					format: "{point.name}",
    					filter: { property: "y", operator: ">", value: 250 },
    					style: {
    						color: "black",
    						textOutline: "none",
    						fontWeight: "normal"
    					}
    				}
    			}
    		},
    		series: datos
    	});
    }

    async function loadGraph05() {
    	const BASE_API_URL_05 = "/api/v1/life_expectancies";
    	const resData = await fetch(BASE_API_URL$6);
    	const resData05 = await fetch(BASE_API_URL_05);
    	let MyData = await resData.json();
    	let Data05 = await resData05.json();

    	/*
                Sus Datos:
    {
        "country": "france",
        "year": 2015,
        "women_life_expectancy": 85.6,
        "men_life_expectancy": 79.2,
        "average_life_expectancy": 82.4
    }
                Mis Datos:
    { 
        "country": "Japan",
        "year": 2018,
        "pev-stock": 257363,
        "annual-sale": 52013,
        "cars-per-1000": 2.0
    }
    */
    	let dataPlugin = MyData.filter(d => {
    		return d.year == 2018;
    	}).map(d => {
    		let res = {
    			name: d.country,
    			value: d["cars-per-1000"]
    		};

    		return res;
    	});

    	let dataAPI05 = Data05.map(d => {
    		let res = {
    			name: d.country,
    			value: d["average_life_expectancy"]
    		};

    		return res;
    	});

    	let datos = [
    		{
    			name: "Porcentaje de coche eléctricos cada 1000 personas en el año 2018.",
    			data: dataPlugin
    		},
    		{
    			name: "Esperanza de vida media entre hombres y mujeres",
    			data: dataAPI05
    		}
    	];

    	Highcharts.chart("container05", {
    		chart: { type: "packedbubble", height: "100%" },
    		title: {
    			text: "Integración con el grupo 05 life_expectancies"
    		},
    		tooltip: {
    			useHTML: true,
    			pointFormat: "<b>{point.name}:</b> {point.value}"
    		},
    		plotOptions: {
    			packedbubble: {
    				minSize: "30%",
    				maxSize: "100%",
    				zMin: 0,
    				zMax: 1000,
    				layoutAlgorithm: {
    					gravitationalConstant: 0.05,
    					splitSeries: true,
    					seriesInteraction: false,
    					dragBetweenSeries: true,
    					parentNodeLimit: true
    				},
    				dataLabels: {
    					enabled: true,
    					format: "{point.name}",
    					filter: { property: "y", operator: ">", value: 250 },
    					style: {
    						color: "black",
    						textOutline: "none",
    						fontWeight: "normal"
    					}
    				}
    			}
    		},
    		series: datos
    	});
    }

    async function loadGraph06() {
    	const BASE_API_URL_06 = "/api/v2/not-hospitalized-stats";
    	const resData = await fetch(BASE_API_URL$6);
    	const resData06 = await fetch(BASE_API_URL_06);
    	let MyData = await resData.json();
    	let Data06 = await resData06.json();

    	/*
                Sus Datos:

    }
        "province": "Tarragona",
        "year": 1995,
        "total": 1676,
        "interurban": 1044,
        "urban": 632
    }
                Mis Datos:
    { 
        "country": "Japan",
        "year": 2018,
        "pev-stock": 257363,
        "annual-sale": 52013,
        "cars-per-1000": 2.0
    }
    */
    	let dataPlugin = MyData.filter(d => {
    		return d.year == 2018 && d.country == "Spain";
    	}).map(d => {
    		let res = {
    			name: d.country,
    			value: d["cars-per-1000"]
    		};

    		return res;
    	});

    	let dataAPI06 = Data06.map(d => {
    		let res = { name: d.province, value: d.total };
    		return res;
    	});

    	let datos = [
    		{
    			name: "Porcentaje de coche eléctricos cada 1000 personas en España en el año 2018.",
    			data: dataPlugin
    		},
    		{
    			name: "Número total de vías urbanas e interurbanas en ciudades españolas.",
    			data: dataAPI06
    		}
    	];

    	Highcharts.chart("container06", {
    		chart: { type: "packedbubble", height: "100%" },
    		title: {
    			text: "Integración con el grupo 06 not-hospitalized-stats"
    		},
    		tooltip: {
    			useHTML: true,
    			pointFormat: "<b>{point.name}:</b> {point.value}"
    		},
    		plotOptions: {
    			packedbubble: {
    				minSize: "15%",
    				maxSize: "40%",
    				zMin: 0,
    				zMax: 1000,
    				layoutAlgorithm: {
    					gravitationalConstant: 0.05,
    					splitSeries: true,
    					seriesInteraction: false,
    					dragBetweenSeries: true,
    					parentNodeLimit: true
    				},
    				dataLabels: {
    					enabled: true,
    					format: "{point.name}",
    					filter: { property: "y", operator: ">", value: 250 },
    					style: {
    						color: "black",
    						textOutline: "none",
    						fontWeight: "normal"
    					}
    				}
    			}
    		},
    		series: datos
    	});
    }

    async function loadGraph07() {
    	const BASE_API_URL_07 = "https://sos1920-07.herokuapp.com/api/v2/imports";
    	const resData = await fetch(BASE_API_URL$6);
    	const resData07 = await fetch(BASE_API_URL_07);
    	let MyData = await resData.json();
    	let Data07 = await resData07.json();

    	/*
                Sus Datos:
    }
        "country": "canada",
        "year": 2005,
        "gdamalt": 584620,
        "gdabarley": 50979,
        "gdaoat": 1466303,
        "gdawaste": 26325,
        "gdaethylalcohol": 99284
    }
                Mis Datos:
    { 
        "country": "Japan",
        "year": 2018,
        "pev-stock": 257363,
        "annual-sale": 52013,
        "cars-per-1000": 2.0
    }
    */
    	let dataPlugin = MyData.filter(d => {
    		return d.year == 2018;
    	}).map(d => {
    		let res = {
    			name: d.country,
    			value: d["cars-per-1000"]
    		};

    		return res;
    	});

    	//Como mi proveedor dispone de un dato en el cual el valor de pais es total y muetra el resultado total de todos los datos
    	// he decidido descartarlo.
    	let dataAPI07 = Data07.filter(d => {
    		return d.year == 2000 && d.country != "total";
    	}).map(d => {
    		let res = {
    			name: d.country,
    			value: d.gdaethylalcohol
    		};

    		return res;
    	});

    	let datos = [
    		{
    			name: "Porcentaje de coche eléctricos cada 1000 personas en el año 2018.",
    			data: dataPlugin
    		},
    		{
    			name: "Alcohol total importado en el año 2000.",
    			data: dataAPI07
    		}
    	];

    	Highcharts.chart("container07", {
    		chart: { type: "packedbubble", height: "100%" },
    		title: {
    			text: "Integración con el grupo 07 imports"
    		},
    		tooltip: {
    			useHTML: true,
    			pointFormat: "<b>{point.name}:</b> {point.value}"
    		},
    		plotOptions: {
    			packedbubble: {
    				minSize: "20%",
    				maxSize: "70%",
    				zMin: 0,
    				zMax: 1000,
    				layoutAlgorithm: {
    					gravitationalConstant: 0.05,
    					splitSeries: true,
    					seriesInteraction: false,
    					dragBetweenSeries: true,
    					parentNodeLimit: true
    				},
    				dataLabels: {
    					enabled: true,
    					format: "{point.name}",
    					filter: { property: "y", operator: ">", value: 250 },
    					style: {
    						color: "black",
    						textOutline: "none",
    						fontWeight: "normal"
    					}
    				}
    			}
    		},
    		series: datos
    	});
    }

    async function loadGraph08() {
    	const BASE_API_URL_08 = "/api/v2/electricity-produced-stats";
    	const resData = await fetch(BASE_API_URL$6);
    	const resData08 = await fetch(BASE_API_URL_08);
    	let MyData = await resData.json();
    	let Data08 = await resData08.json();

    	/*
                Sus Datos:
    {
        "country": "EEUU",
        "state": "Florida",
        "year": 2018,
        "hydro": 232574,
        "solar": 2412067,
        "coal": 30272201
    }
                Mis Datos:
    { 
        "country": "Japan",
        "year": 2018,
        "pev-stock": 257363,
        "annual-sale": 52013,
        "cars-per-1000": 2.0
    }
    */
    	let dataPlugin = MyData.filter(d => {
    		return d.year == 2018;
    	}).map(d => {
    		let res = {
    			name: d.country,
    			value: d["cars-per-1000"]
    		};

    		return res;
    	});

    	let dataAPI08_1 = Data08.map(d => {
    		let res = { name: d.state, value: d.hydro };
    		return res;
    	});

    	let dataAPI08_2 = Data08.map(d => {
    		let res = { name: d.state, value: d.solar };
    		return res;
    	});

    	let dataAPI08_3 = Data08.map(d => {
    		let res = { name: d.state, value: d.coal };
    		return res;
    	});

    	let datos = [
    		{
    			name: "Porcentaje de coche eléctricos cada 1000 personas en el año 2018.",
    			data: dataPlugin
    		},
    		{
    			name: "Energía Hidroeléctrica producida en EEUU en el año 2018",
    			data: dataAPI08_1
    		},
    		{
    			name: "Energía Solar producida en EEUU en el año 2018",
    			data: dataAPI08_2
    		},
    		{
    			name: "Energía por combustión de Carbón producida en EEUU en el año 2018",
    			data: dataAPI08_3
    		}
    	];

    	Highcharts.chart("container08", {
    		chart: { type: "packedbubble", height: "100%" },
    		title: {
    			text: "Integración con el grupo 08 electricity-produced-stats"
    		},
    		tooltip: {
    			useHTML: true,
    			pointFormat: "<b>{point.name}:</b> {point.value}"
    		},
    		plotOptions: {
    			packedbubble: {
    				minSize: "20%",
    				maxSize: "70%",
    				zMin: 0,
    				zMax: 1000,
    				layoutAlgorithm: {
    					gravitationalConstant: 0.05,
    					splitSeries: true,
    					seriesInteraction: false,
    					dragBetweenSeries: true,
    					parentNodeLimit: true
    				},
    				dataLabels: {
    					enabled: true,
    					format: "{point.name}",
    					filter: { property: "y", operator: ">", value: 250 },
    					style: {
    						color: "black",
    						textOutline: "none",
    						fontWeight: "normal"
    					}
    				}
    			}
    		},
    		series: datos
    	});
    }

    async function loadGraph12$1() {
    	const BASE_API_URL_12 = "https://sos1920-12.herokuapp.com/api/v2/overdose-deaths";
    	const resData = await fetch(BASE_API_URL$6);
    	const resData12 = await fetch(BASE_API_URL_12);
    	let MyData = await resData.json();
    	let Data12 = await resData12.json();

    	/*
                Sus Datos:
    {
        "country": "France",
        "year": 2011,
        "death_male": 249,
        "death_female": 91,
        "death_total": 340,
        "mean_age": 45.7
    }
                Mis Datos:
    { 
        "country": "Japan",
        "year": 2018,
        "pev-stock": 257363,
        "annual-sale": 52013,
        "cars-per-1000": 2.0
    }
    */
    	let dataPlugin = MyData.filter(d => {
    		return d.year == 2018;
    	}).map(d => {
    		let res = {
    			name: d.country,
    			value: d["cars-per-1000"]
    		};

    		return res;
    	});

    	let dataAPI12 = Data12.filter(d => {
    		return d.year == 2017;
    	}).map(d => {
    		let res = { name: d.country, value: d["death_total"] };
    		return res;
    	});

    	let datos = [
    		{
    			name: "Porcentaje de coche eléctricos cada 1000 personas en el año 2018.",
    			data: dataPlugin
    		},
    		{
    			name: "Número total de muertes por sobredosis en el año 2017.",
    			data: dataAPI12
    		}
    	];

    	Highcharts.chart("container12", {
    		chart: { type: "packedbubble", height: "100%" },
    		title: {
    			text: "Integración con el grupo 12 overdose-deaths"
    		},
    		tooltip: {
    			useHTML: true,
    			pointFormat: "<b>{point.name}:</b> {point.value}"
    		},
    		plotOptions: {
    			packedbubble: {
    				minSize: "20%",
    				maxSize: "80%",
    				zMin: 0,
    				zMax: 1000,
    				layoutAlgorithm: {
    					gravitationalConstant: 0.05,
    					splitSeries: true,
    					seriesInteraction: false,
    					dragBetweenSeries: true,
    					parentNodeLimit: true
    				},
    				dataLabels: {
    					enabled: true,
    					format: "{point.name}",
    					filter: { property: "y", operator: ">", value: 250 },
    					style: {
    						color: "black",
    						textOutline: "none",
    						fontWeight: "normal"
    					}
    				}
    			}
    		},
    		series: datos
    	});
    }

    async function loadGraph23$1() {
    	const BASE_API_URL_23 = "https://sos1920-23.herokuapp.com/api/v2/fires-stats/";
    	const resData = await fetch(BASE_API_URL$6);
    	const resData23 = await fetch(BASE_API_URL_23);
    	let MyData = await resData.json();
    	let Data23 = await resData23.json();

    	/*
                Sus Datos:
    {
        "community": "castilla-la-mancha",
        "year": 2007,
        "total_fire": 694,
        "forest_area": 2026.46,
        "non_forest_area": 1068.96
    }
                Mis Datos:
    { 
        "country": "Japan",
        "year": 2018,
        "pev-stock": 257363,
        "annual-sale": 52013,
        "cars-per-1000": 2.0
    }
    */
    	let dataPlugin = MyData.filter(d => {
    		return d.year == 2018 && d.country == "Spain";
    	}).map(d => {
    		let res = {
    			name: d.country,
    			value: d["cars-per-1000"]
    		};

    		return res;
    	});

    	let dataAPI23 = Data23.filter(d => {
    		return d.year == 2007;
    	}).map(d => {
    		let res = {
    			name: d.community,
    			value: d["total_fire"]
    		};

    		return res;
    	});

    	let datos = [
    		{
    			name: "Porcentaje de coches eléctricos cada 1000 personas en España en el año 2018.",
    			data: dataPlugin
    		},
    		{
    			name: "Número de incendios totales en España en el año 2007.",
    			data: dataAPI23
    		}
    	];

    	Highcharts.chart("container23", {
    		chart: { type: "packedbubble", height: "100%" },
    		title: {
    			text: "Integración con el grupo 23 fires-stats"
    		},
    		tooltip: {
    			useHTML: true,
    			pointFormat: "<b>{point.name}:</b> {point.value}"
    		},
    		plotOptions: {
    			packedbubble: {
    				minSize: "25%",
    				maxSize: "55%",
    				zMin: 0,
    				zMax: 1000,
    				layoutAlgorithm: {
    					gravitationalConstant: 0.05,
    					splitSeries: true,
    					seriesInteraction: false,
    					dragBetweenSeries: true,
    					parentNodeLimit: true
    				},
    				dataLabels: {
    					enabled: true,
    					format: "{point.name}",
    					filter: { property: "y", operator: ">", value: 250 },
    					style: {
    						color: "black",
    						textOutline: "none",
    						fontWeight: "normal"
    					}
    				}
    			}
    		},
    		series: datos
    	});
    }

    async function loadGraph24() {
    	const BASE_API_URL_24 = "https://sos1920-24.herokuapp.com/api/v2/atc-stats";
    	const resData = await fetch(BASE_API_URL$6);
    	const resData24 = await fetch(BASE_API_URL_24);
    	let MyData = await resData.json();
    	let Data24 = await resData24.json();

    	/*
                Sus Datos:
    {
        "aut_com": "Andalucia",
        "year": 2018,
        "espce": 757.2,
        "yaq": 757,
        "obu": 757
    }
                Mis Datos:
    { 
        "country": "Japan",
        "year": 2018,
        "pev-stock": 257363,
        "annual-sale": 52013,
        "cars-per-1000": 2.0
    }
    */
    	let dataPlugin = MyData.filter(d => {
    		return d.year == 2018 && d.country == "Spain";
    	}).map(d => {
    		let res = {
    			name: d.country,
    			value: d["cars-per-1000"]
    		};

    		return res;
    	});

    	let dataAPI24 = Data24.filter(d => {
    		return d.year == 2018;
    	}).map(d => {
    		let res = {
    			name: d["aut_com"],
    			//value: (d["espce"] / 10) //Los divido entre 10 para obtener una mejor visualización.
    			value: d["espce"]
    		};

    		return res;
    	});

    	let datos = [
    		{
    			name: "Porcentaje de coche eléctricos cada 1000 personas en España en el año 2018.",
    			data: dataPlugin
    		},
    		{
    			name: "Coste medio de la matricula universitaria en el año 2018.",
    			data: dataAPI24
    		}
    	];

    	Highcharts.chart("container24", {
    		chart: { type: "packedbubble", height: "100%" },
    		title: {
    			text: "Integración con el grupo 24 atc-stats"
    		},
    		tooltip: {
    			useHTML: true,
    			pointFormat: "<b>{point.name}:</b> {point.value}"
    		},
    		plotOptions: {
    			packedbubble: {
    				minSize: "20%",
    				maxSize: "40%",
    				zMin: 0,
    				zMax: 1000,
    				layoutAlgorithm: {
    					gravitationalConstant: 0.05,
    					splitSeries: true,
    					seriesInteraction: false,
    					dragBetweenSeries: true,
    					parentNodeLimit: true
    				},
    				dataLabels: {
    					enabled: true,
    					format: "{point.name}",
    					filter: { property: "y", operator: ">", value: 250 },
    					style: {
    						color: "black",
    						textOutline: "none",
    						fontWeight: "normal"
    					}
    				}
    			}
    		},
    		series: datos
    	});
    }

    async function loadGraph27$1() {
    	const BASE_API_URL_27 = "https://sos1920-27.herokuapp.com/api/v2/spc-stats";
    	const resData = await fetch(BASE_API_URL$6);
    	const resData27 = await fetch(BASE_API_URL_27);
    	let MyData = await resData.json();
    	let Data27 = await resData27.json();

    	/*
                Sus Datos:
    {
        "country": "cameroon",                       
        "both_sex": 19.5,
        "male_rank": 13,
        "male_number": 26.9,
        "female_rank": 10,
        "female_number": 12.5,
        "ratio": 2.15,
        "year": 2013,
        "continent": "africa"
    }
                Mis Datos:
    { 
        "country": "Japan",
        "year": 2018,
        "pev-stock": 257363,
        "annual-sale": 52013,
        "cars-per-1000": 2.0
    }
    */
    	let dataPlugin = MyData.filter(d => {
    		return d.year == 2018;
    	}).map(d => {
    		let res = {
    			name: d.country,
    			value: d["cars-per-1000"]
    		};

    		return res;
    	});

    	let dataAPI27 = Data27.filter(d => {
    		return d.year == 2013;
    	}).map(d => {
    		let res = { name: d.country, value: d["both_sex"] };
    		return res;
    	});

    	let datos = [
    		{
    			name: "Porcentaje de coche eléctricos cada 1000 personas en el año 2018",
    			data: dataPlugin
    		},
    		{
    			name: "Porcentaje de suicidios en el año 2013",
    			data: dataAPI27
    		}
    	];

    	Highcharts.chart("container27", {
    		chart: { type: "packedbubble", height: "100%" },
    		title: {
    			text: "Integración con el grupo 27 spc-stats"
    		},
    		tooltip: {
    			useHTML: true,
    			pointFormat: "<b>{point.name}:</b> {point.value}%"
    		},
    		plotOptions: {
    			packedbubble: {
    				minSize: "20%",
    				maxSize: "100%",
    				zMin: 0,
    				zMax: 1000,
    				layoutAlgorithm: {
    					gravitationalConstant: 0.05,
    					splitSeries: true,
    					seriesInteraction: false,
    					dragBetweenSeries: true,
    					parentNodeLimit: true
    				},
    				dataLabels: {
    					enabled: true,
    					format: "{point.name}",
    					filter: { property: "y", operator: ">", value: 250 },
    					style: {
    						color: "black",
    						textOutline: "none",
    						fontWeight: "normal"
    					}
    				}
    			}
    		},
    		series: datos
    	});
    }

    async function loadGraph28() {
    	const BASE_API_URL_28 = "/api/v1/gce";
    	const resData = await fetch(BASE_API_URL$6);
    	const resData28 = await fetch(BASE_API_URL_28);
    	let MyData = await resData.json();
    	let Data28 = await resData28.json();

    	/*
                Sus Datos:
    {
        "country": "Germany",
        "year": 2010,
        "gce_country": 811861,
        "gce_per_capita": 10.09,
        "gce_cars": 6311318
    }
                Mis Datos:
    { 
        "country": "Japan",
        "year": 2018,
        "pev-stock": 257363,
        "annual-sale": 52013,
        "cars-per-1000": 2.0
    }
    */
    	let dataPlugin = MyData.filter(d => {
    		return d.year == 2018;
    	}).map(d => {
    		let res = {
    			name: d.country,
    			value: d["cars-per-1000"]
    		};

    		return res;
    	});

    	let dataAPI28 = Data28.filter(d => {
    		return d.year == 2014;
    	}).map(d => {
    		let res = {
    			name: d.country,
    			value: d["gce_per_capita"]
    		};

    		return res;
    	});

    	let datos = [
    		{
    			name: "Porcentaje de coche eléctricos cada 1000 personas en el año 2018",
    			data: dataPlugin
    		},
    		{
    			name: "Porcentaje per capital en el año 2014",
    			data: dataAPI28
    		}
    	];

    	Highcharts.chart("container28", {
    		chart: { type: "packedbubble", height: "100%" },
    		title: { text: "Integración con el grupo 28 gce" },
    		tooltip: {
    			useHTML: true,
    			pointFormat: "<b>{point.name}:</b> {point.value}%"
    		},
    		plotOptions: {
    			packedbubble: {
    				minSize: "20%",
    				maxSize: "100%",
    				zMin: 0,
    				zMax: 1000,
    				layoutAlgorithm: {
    					gravitationalConstant: 0.05,
    					splitSeries: true,
    					seriesInteraction: false,
    					dragBetweenSeries: true,
    					parentNodeLimit: true
    				},
    				dataLabels: {
    					enabled: true,
    					format: "{point.name}",
    					filter: { property: "y", operator: ">", value: 250 },
    					style: {
    						color: "black",
    						textOutline: "none",
    						fontWeight: "normal"
    					}
    				}
    			}
    		},
    		series: datos
    	});
    }

    async function loadGraphExternal01() {
    	const BASE_API_URL_External01 = "/api/v1/players";
    	const resData = await fetch(BASE_API_URL$6);
    	const resDataExternal01 = await fetch(BASE_API_URL_External01);
    	let MyData = await resData.json();
    	let DataExternal01 = await resDataExternal01.json();

    	/*
                Sus Datos: (HAY BASTANTES MÁS, PERO DENTRO DE ESTOS ESTÁN LOS QUE YO USARE)
    }
    "data": [
        {
        "id": 14,
        "first_name": "Ike",
        "height_feet": null,
        "height_inches": null,
        "last_name": "Anigbogu",
        "position": "C",
        "team": {
            "id": 12,
            "abbreviation": "IND",
            "city": "Indiana",
            "conference": "East",
            "division": "Central",
            "full_name": "Indiana Pacers",
            "name": "Pacers"
        },
        "weight_pounds": null
        }

                Mis Datos:
    { 
        "country": "Japan",
        "year": 2018,
        "pev-stock": 257363,
        "annual-sale": 52013,
        "cars-per-1000": 2.0
    }
    */
    	let dataPlugin = MyData.filter(d => {
    		return d.country == "USA";
    	}).map(d => {
    		let res = { name: d.year, value: d["cars-per-1000"] };
    		return res;
    	});

    	let dataAPIExternal01 = DataExternal01.data.map(d => {
    		let res = { name: d.first_name, value: d.team.id };
    		return res;
    	});

    	let datos = [
    		{
    			name: "Porcentaje de coche eléctricos cada 1000 personas en USA.",
    			data: dataPlugin
    		},
    		{
    			name: "Nombre y dorsal de jugadores de baloncesto de la NBA.",
    			data: dataAPIExternal01
    		}
    	];

    	Highcharts.chart("containerExt01", {
    		chart: { type: "packedbubble", height: "100%" },
    		title: { text: "Integración con API externa." },
    		tooltip: {
    			useHTML: true,
    			pointFormat: "<b>{point.name}:</b> {point.value}"
    		},
    		plotOptions: {
    			packedbubble: {
    				minSize: "20%",
    				maxSize: "100%",
    				zMin: 0,
    				zMax: 1000,
    				layoutAlgorithm: {
    					gravitationalConstant: 0.05,
    					splitSeries: true,
    					seriesInteraction: false,
    					dragBetweenSeries: true,
    					parentNodeLimit: true
    				},
    				dataLabels: {
    					enabled: true,
    					format: "{point.name}",
    					filter: { property: "y", operator: ">", value: 250 },
    					style: {
    						color: "black",
    						textOutline: "none",
    						fontWeight: "normal"
    					}
    				}
    			}
    		},
    		series: datos
    	});
    }

    async function loadGraphExternal02() {
    	const BASE_API_URL_External02 = "/v3/launches";
    	const resData = await fetch(BASE_API_URL$6);
    	const resDataExternal02 = await fetch(BASE_API_URL_External02);
    	let MyData = await resData.json();
    	let DataExternal02 = await resDataExternal02.json();

    	/*
                Sus Datos: (HAY BASTANTES MÁS, PERO DENTRO DE ESTOS ESTÁN LOS QUE YO USARE)
    }
    mission_name": "FalconSat",
    "mission_id": [

    ],
    "upcoming": false,
    "launch_year": "2006",
    "launch_date_unix": 1143239400,
    "launch_date_utc": "2006-03-24T22:30:00.000Z",
    "launch_date_local": "2006-03-25T10:30:00+12:00",
    "is_tentative": false,
    "tentative_max_precision": "hour",
    "tbd": false,
    "launch_window": 0,
    "rocket": {
    "rocket_id": "falcon1",
    "rocket_name": "Falcon 1",
    "rocket_type": "Merlin A",
    "first_stage": {
        "cores": [
        {
            "core_serial": "Merlin1A",
            "flight": 1,

                Mis Datos:
    { 
        "country": "Japan",
        "year": 2018,
        "pev-stock": 257363,
        "annual-sale": 52013,
        "cars-per-1000": 2.0
    }
    */
    	let dataPlugin = MyData.filter(d => {
    		return d.year == 2018;
    	}).map(d => {
    		let res = {
    			name: d.country,
    			value: d["cars-per-1000"]
    		};

    		return res;
    	});

    	let dataAPIExternal02 = DataExternal02.filter(d => {
    		return d.launch_year == "2018";
    	}).map(d => {
    		let res = {
    			name: d.mission_name,
    			value: d.flight_number
    		};

    		return res;
    	});

    	let datos = [
    		{
    			name: "Porcentaje de coche eléctricos cada 1000 personas en el año 2018.",
    			data: dataPlugin
    		},
    		{
    			name: "Número y nombre de los satélites desplegados en el año 2018",
    			data: dataAPIExternal02
    		}
    	];

    	Highcharts.chart("containerExt02", {
    		chart: { type: "packedbubble", height: "100%" },
    		title: { text: "Integración con API externa." },
    		tooltip: {
    			useHTML: true,
    			pointFormat: "<b>{point.name}:</b> {point.value}"
    		},
    		plotOptions: {
    			packedbubble: {
    				minSize: "20%",
    				maxSize: "100%",
    				zMin: 0,
    				zMax: 1000,
    				layoutAlgorithm: {
    					gravitationalConstant: 0.05,
    					splitSeries: true,
    					seriesInteraction: false,
    					dragBetweenSeries: true,
    					parentNodeLimit: true
    				},
    				dataLabels: {
    					enabled: true,
    					format: "{point.name}",
    					filter: { property: "y", operator: ">", value: 250 },
    					style: {
    						color: "black",
    						textOutline: "none",
    						fontWeight: "normal"
    					}
    				}
    			}
    		},
    		series: datos
    	});
    }

    function instance$u($$self, $$props, $$invalidate) {
    	loadGraph01$1(); //Implementado mediante proxy
    	loadGraph04(); //Implementado mediante cors
    	loadGraph05(); //Implementado mediante proxy
    	loadGraph06(); //Implementado mediante proxy
    	loadGraph07(); //Implementado mediante cors
    	loadGraph08(); //Implementado mediante proxy
    	loadGraph12$1(); //Implementado mediante cors
    	loadGraph23$1(); //Implementado mediante cors
    	loadGraph24(); //Implementado mediante cors
    	loadGraph27$1(); //Implementado mediante cors
    	loadGraph28(); //Implementado mediante proxy
    	loadGraphExternal01(); //Implementado mediante proxy
    	loadGraphExternal02(); //Implementado mediante proxy
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$c.warn(`<Integrations> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Integrations", $$slots, []);

    	$$self.$capture_state = () => ({
    		Button,
    		pop,
    		BASE_API_URL: BASE_API_URL$6,
    		loadGraph01: loadGraph01$1,
    		loadGraph04,
    		loadGraph05,
    		loadGraph06,
    		loadGraph07,
    		loadGraph08,
    		loadGraph12: loadGraph12$1,
    		loadGraph23: loadGraph23$1,
    		loadGraph24,
    		loadGraph27: loadGraph27$1,
    		loadGraph28,
    		loadGraphExternal01,
    		loadGraphExternal02
    	});

    	return [];
    }

    class Integrations$2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Integrations",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    /* src\front\NotFound.svelte generated by Svelte v3.20.1 */

    const file$u = "src\\front\\NotFound.svelte";

    function create_fragment$v(ctx) {
    	let main;
    	let h1;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "¡Esta página no existe!";
    			add_location(h1, file$u, 1, 4, 12);
    			add_location(main, file$u, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("NotFound", $$slots, []);
    	return [];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    /* src\front\App.svelte generated by Svelte v3.20.1 */
    const file$v = "src\\front\\App.svelte";

    function create_fragment$w(ctx) {
    	let main;
    	let current;

    	const router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			add_location(main, file$v, 49, 0, 2452);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	const routes = {
    		"/": Home,
    		"/oilCoalNuclearEnergyConsumptionAPI": App,
    		"/plugInVehiclesAPI": App$1,
    		"/renewableSourcesAPI": App$2,
    		"/oil-coal-nuclear-energy-consumption-stats/:country/:year": EditOilCoal,
    		"/plugin-vehicles-stats/:country/:year": EditPlugInVehicle,
    		"/renewable-sources-stats/:country/:year": EditRenewableSource,
    		"/chartOilCoal": ChartOilCoal,
    		"/chartOilCoal2": ChartOilCoal2,
    		"/chartPlugInVehicles": ChartPlugInVehicles,
    		"/chartOutPlugInVehicles": ChartOutPlugInVehicles,
    		"/chartRenewableSources": ChartRenewableSources,
    		"/chartRenewableSourcesBillboard": ChartRenewableSourcesBillboard,
    		"/analytics": CommonChart,
    		"/efforts": Efforts,
    		"/integrationsRenewableSource": Integrations,
    		"/integrationsPrimaryEnergies": Integrations$1,
    		"/integrationsPluginCars": Integrations$2,
    		"*": NotFound
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		Router,
    		Home,
    		OilCoal: App,
    		PlugInVehicles: App$1,
    		RenewableSources: App$2,
    		EditOilCoal,
    		EditPlugInVehicle,
    		EditRenewableSource,
    		ChartOilCoal,
    		ChartOilCoal2,
    		ChartPlugInVehicles,
    		ChartOutPlugInVehicles,
    		ChartRenewableSources,
    		ChartRenewableSourcesBillboard,
    		CommonChart,
    		Efforts,
    		IntegrationsRenewableSource: Integrations,
    		IntegrationsPrimaryEnergies: Integrations$1,
    		IntegrationsPluginCars: Integrations$2,
    		NotFound,
    		routes
    	});

    	return [routes];
    }

    class App$3 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$w.name
    		});
    	}
    }

    const app = new App$3({
    	target: document.querySelector('#SvelteApp')
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
