export default {
    removeUnsetProps(data) {
        return data
            ? Object.keys(data)
                .filter(dataKey => data[dataKey] !== null)
                .reduce((total, dataKey) => Object.assign({}, total, { [dataKey]: data[dataKey] }), {})
            : null;
    },
};
