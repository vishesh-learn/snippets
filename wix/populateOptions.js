async function populateWithWixData(
    collectionName,
    dropdown,
    optionLabelFieldId,
    optionValueFieldId,
    additionalOptionsAtStart = [],
    additionalOptionsAtLast = [],
    fieldToCheckIfTrue,
    sortBy
) {
    try {
        dropdown.disable();

        let query = wixData.query(collectionName)
            .limit(1000);

        if (fieldToCheckIfTrue) {
            query = query.isNotEmpty(fieldToCheckIfTrue);
        }

        if (typeof sortBy == "string") {
            query = query.ascending(sortBy);
        }

        let { items } = await query.find();

        let options = items.map(item => ({
            label: optionLabelFieldId ? item[optionLabelFieldId] : item["title"] || item["_id"],
            value: optionValueFieldId ? item[optionValueFieldId] : item["_id"]
        }));

        dropdown.options = [...additionalOptionsAtStart, ...options, ...additionalOptionsAtLast];

        dropdown.enable();
        dropdown.show();

        return true;
    } catch (error) {
        console.log(error);

        dropdown.hide();
    }
}