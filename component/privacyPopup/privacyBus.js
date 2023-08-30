const list = new Set;

export default {
    on(fn, ta) {
        fn.ta = ta;
        list.add(fn);
    },
    off(fn) {
        list.delete(fn);
    },
    emit(data) {
        [...list].map(fn => fn.call(fn.ta, data));
    },
};