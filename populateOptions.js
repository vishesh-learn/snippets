async function populateWithWixData(collectionName, dropdown, optionLabelFieldId, optionValueFieldId = "_id", additionalOptionsAtStart = [], additionalOptionsAtLast = []) {
    try {
        dropdown.disable();

        let { items } = await wixData.query(collectionName)
            .limit(1000)
            .find();

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