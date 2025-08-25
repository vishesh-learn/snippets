export function queryAllItems(wixDataQuery, batchSize = 50, skip = 0, resultItems = []) {
    return wixDataQuery
        .limit(batchSize)
        .skip(skip)
        .find()
        .then(result => {
            resultItems = resultItems.concat(result.items);

            if (result.items.length < batchSize) {
                return resultItems;
            } else {
                return queryAllItems(wixDataQuery, batchSize, skip + resultItems.length, resultItems);
            }
        });
}

export function queryAllItems_backend(wixDataQuery, batchSize = 50, skip = 0, resultItems = []) {
    return wixDataQuery
        .limit(batchSize)
        .skip(skip)
        .find({ suppressAuth: true })
        .then(result => {
            resultItems = resultItems.concat(result.items);

            if (result.items.length < batchSize) {
                return resultItems;
            } else {
                return queryAllItems_backend(wixDataQuery, batchSize, skip + resultItems.length, resultItems);
            }
        });
}