import wixWindowFrontend from 'wix-window-frontend';
import wixData from 'wix-data';

// import _ from "lodash";

import { PlanConfiguration } from 'public/collectionClasses';
import { populateWithWixData } from 'public/util';

let itemId;

const COLLECTION_NAME = {
    PlanConfiguration: 'PlanBenefits',
    ReportTypes: 'QuestionnaireTypes',
    WixPlans: 'PaidPlans/Plans'
};

let itemData = new PlanConfiguration();

class FormField {
    static valueTypes = {
        string: "string",
        number: "number",
        multiRef: "multiRef"
    };

    constructor(objKey, elementId, valueType, options_promise) {
        this.objKey = objKey;
        this.elementId = elementId;
        this.valueType = valueType;

        this.options_promise = options_promise;

        this.init = this.init.bind(this);
    }

    get element() {
        return this.elementId ? $w(`#${this.elementId}`) : null;
    }

    init() {
        if (this?.element?.onInput) {
            this.element.onInput(form_change);
        } else if (this?.element?.onChange) {
            this.element.onChange(form_change);
        }
    }

    get value() {
        switch (this.valueType) {
        case FormField.valueTypes.string:
            return this.element.value.trim();

        case FormField.valueTypes.number:
            return Number(this.element.value);

        case FormField.valueTypes.multiRef:
            return this.element.value;
        }
    }

    saveMultiRef(savedItemId) {
        return wixData.replaceReferences(COLLECTION_NAME.PlanConfiguration, this.objKey, savedItemId, this.element.value);
    }
}

let formFields = [new FormField()];

$w.onReady(function () {
    console.clear();

    formFields = [
        new FormField("title", "title", FormField.valueTypes.string),
        new FormField('category', 'category', FormField.valueTypes.string),
        new FormField("limit", "limit", FormField.valueTypes.number),
        new FormField("balanceLimitRollover", "balanceLimitRollover", FormField.valueTypes.number),
        new FormField('types', 'reportTypes', FormField.valueTypes.multiRef, populateWithWixData(
            COLLECTION_NAME.ReportTypes,
            $w('#reportTypes'),
            'title',
            null,
            [],
            [],
            null,
            'number'
        )),
        new FormField('plans', 'wixPlans', FormField.valueTypes.multiRef, populateWithWixData(
            COLLECTION_NAME.WixPlans,
            $w('#wixPlans'),
            'name',
            null,
            [],
            [],
            null,
            'displayIndex'
        ))
    ];

    form_events();

    handleContext();
});

function close(event) {
    wixWindowFrontend.lightbox.close({
        type: event.target.id
    });
}

function handleContext() {
    itemId = wixWindowFrontend.lightbox.getContext();

    console.log("itemId", itemId);

    if (itemId && typeof itemId === "string") {
        existingItem();
    } else {
        newItem();
    }
}

async function newItem() {
    $w('#popupTitle').text = "Add Plan Configuration";
}

function existingItem() {
    $w('#popupTitle').text = "Edit Plan Configuration";

    populateFormByItemId(itemId);
}

async function populateFormByItemId(itemId) {
    try {
        const result = await wixData.query(COLLECTION_NAME.PlanConfiguration)
            .eq("_id", itemId)
            .include("types", "plans")
            .find();

        if (!result?.items?.length) {
            throw "can not find item";
        }

        itemData = result.items[0];

        console.log("itemData for itemId", itemId, itemData);

        populateFormByItemData(itemData);
    } catch (error) {
        console.log("error while getting item data for itemId", itemId);
    }
}

function populateFormByItemData(itemData) {
    console.log("populateFormByItemData", itemData);

    for (const formField of formFields) {
        if (formField.options_promise) {
            formField.options_promise.then(() => {
                formField.element.value = itemData[formField.objKey].map(item => item._id);
            });
        }

        formField.element.value = itemData[formField.objKey];
    }
}

function form_events() {
    $w('#save').onClick(save);
    $w('#cancel').onClick(close);
    $w('#close').onClick(close);

    formFields.forEach(formField => formField.init());

    new FieldToggle('limitToggle', 'limit');
    new FieldToggle('rolloverLimitToggle', 'balanceLimitRollover');
}

class FieldToggle {
    constructor(togglerId, toBeToggledId) {
        this.togglerId = togglerId;
        this.toBeToggledId = toBeToggledId;

        this.toggler_onChange = this.toggler_onChange.bind(this);
        this.init = this.init.bind(this);

        this.init();
    }

    get toggler() {
        return this.togglerId ? $w(`#${this.togglerId}`) : null;
    }

    get toBeToggled() {
        return this.toBeToggledId ? $w(`#${this.toBeToggledId}`) : null;
    }

    init() {
        console.log("FieldToggle -> init");

        this.toggler.onChange(this.toggler_onChange);
    }

    toggler_onChange() {
        this.toBeToggled.value = "";

        if (this.toggler.value == "yes") {
            this.toBeToggled.required = true;

            this.toBeToggled.expand();
        } else {
            this.toBeToggled.required = false;

            this.toBeToggled.collapse();
        }

        form_change();
    }
}

async function form_change() {
    try {
        const formValidity = await checkValidity();

        console.log("formValidity", formValidity);

        if (formValidity?.isValid) {
            $w('#save').enable();
        } else {
            $w('#save').disable();
        }
    } catch (error) {
        console.log("error while handling form change...", error);
    }
}

async function checkValidity() {
    console.log("checkValidity");

    const formValidiy = {
        isValid: true,
        validFields: [],
        inValidFields: []
    }

    for (const formField of formFields) {
        if (!formField.element.valid) {
            formValidiy.inValidFields.push(formField);
        } else {
            formValidiy.validFields.push(formField);
        }
    }

    formValidiy.isValid = formValidiy.inValidFields.length == 0;

    return formValidiy;
}

// // =========== [ submit ] =============== //

function form_getData() {
    formFields.forEach(formField => itemData[formField.objKey] = formField.value);
}

async function save() {
    console.log("save1");

    try {
        const formValidity = await checkValidity();

        if (!formValidity?.isValid) {
            throw "form invalid";
        }

        form_getData();

        let itemData_beforeSave = Object.assign(new PlanConfiguration(), itemData);

        console.log("itemData_beforeSave", itemData_beforeSave);

        let savedItem = await wixData.save(COLLECTION_NAME.PlanConfiguration, itemData);

        console.log("savedItem", savedItem);

        if (!savedItem) {
            throw "no savedItem";
        }

        const saveMultiRefs_results = await Promise.all(
            formFields
            .filter(formField => formField.valueType == FormField.valueTypes.multiRef)
            .map(formField => formField.saveMultiRef(savedItem._id))
        );

        console.log('saveMultiRefs_results', saveMultiRefs_results);

        wixWindowFrontend.lightbox.close({
            type: "savedItemId",
            savedItemId: savedItem._id
        });
    } catch (error) {
        console.log("error while saving form data", error);
    }
}