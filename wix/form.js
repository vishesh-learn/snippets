class FormField {
    constructor(objKey, elementId, valueType, options_promise) {
        this.objKey = objKey;
        this.elementId = elementId;
        this.valueType = valueType;

        this.options_promise = options_promise;

        this.init = this.init.bind(this);
        this.saveMultiRef = this.saveMultiRef.bind(this);
    }

    get element() {
        return this.elementId ? $w(`#${this.elementId}`) : null;
    }

    init(form_change) {
        if (this?.element?.onInput) {
            this.element.onInput(form_change);
        } else if (this?.element?.onChange) {
            this.element.onChange(form_change);
        }
    }

    saveMultiRef(referingItemId) {
        return wixData.replaceReferences(COLLECTION_NAME, this.objKey, referingItemId, this.element.value);
    }
}

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

export async function populateWithDistinctValues(
    collectionName,
    dropdown,
    fieldId,
    additionalOptionsAtStart = [],
    additionalOptionsAtLast = []
) {
    try {
        dropdown.disable();

        const values = await wixData.query(collectionName)
            .distinct(fieldId)
            .then(result => result.items);

        let options = values.map(value => ({
            label: value,
            value: value
        }));

        dropdown.options = [
            ...additionalOptionsAtStart,
            ...options
        ];

        dropdown.enable();
        dropdown.show();

        return true;
    } catch (error) {
        console.log("error while trying to populate dropdown with disting values using wixData", error, "with params", {
            collectionName,
            dropdown,
            additionalOptionsAtStart,
            additionalOptionsAtLast
        });

        dropdown.hide();
    }
}

// ----------------- Sample Usage ----------------- //

const sample_formFields = [
    new FormField("title", "title", "string"),
    new FormField("score", "scoreInput", "number"),
    new FormField('choices', 'choiceIdsInput', 'multi-ref', populateWithWixData(
        CHOICES_COLLECTION_NAME,
        $w('#choiceIdsInput')
    ))
];