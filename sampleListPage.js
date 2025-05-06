// wix imports ----
import wixData from 'wix-data';
import wixWindowFrontend from 'wix-window-frontend';

// public ----
import { populateWithWixData, populateWithDistinctValues } from "public/util";

const editorLightboxName = "Editor: Plan Configuration";

$w.onReady(function () {

    $w('#repeater').onItemReady(repeater_OnItemReady);

    init();

});

async function init() {
    $w('#createNewButton').onClick(openEditor_toCreateListItem);

    await $w('#PlanConfigurationDataset').onReadyAsync();

    await Promise.allSettled([
        filter_refresh(), sort_refresh()
    ]);

    $w('#refreshButton').onClick(listRefresh);

    filter_sort_init();

    listStateRefresh();
}

async function listRefresh(event) {
    try {
        event.target.disable();

        await $w('#PlanConfigurationDataset').refresh();

        $w('#repeater').forEachItem(repeater_refresh);

        event.target.enable();
    } catch (error) {
        console.error("error while trying to refresh list", error);

        event.target.enable();
    }
}

function listStateRefresh() {
    if ($w('#repeater').data.length) {
        $w('#statebox').changeState($w('#listState'));
    } else {
        $w('#statebox').changeState($w('#emptyState'));
    }
}

function filter_sort_init() {
    $w('#filterByTitleInput').onInput(filter_refresh);
    $w('#filterByWixPlanInput').onChange(filter_refresh);
    $w('#filterByReportType').onChange(filter_refresh);
    $w('#filterByCategory').onChange(filter_refresh);

    $w('#sortBy').onChange(sort_refresh);

    populateWithWixData("PaidPlans/Plans", $w('#filterByWixPlanInput'), "name", "_id", [{
        label: "",
        value: ""
    }], [], null, "displayIndex");

    populateWithWixData("QuestionnaireTypes", $w('#filterByReportType'), "title", "_id", [{
        label: "",
        value: ""
    }], [], null, "number");

    populateWithDistinctValues('PlanBenefits', $w('#filterByCategory'), 'category', [{
        label: "",
        value: ""
    }]);
}

async function filter_refresh() {
    let wixDataFilter = wixData.filter();

    if ($w('#filterByTitleInput').valid) {
        let value = $w('#filterByTitleInput').value;

        wixDataFilter = wixDataFilter.contains("title", value);
    }

    if ($w('#filterByWixPlanInput').valid) {
        let value = $w('#filterByWixPlanInput').value;

        wixDataFilter = wixDataFilter.hasSome("plans", value);
    }

    if ($w('#filterByReportType').valid) {
        let value = $w('#filterByReportType').value;

        wixDataFilter = wixDataFilter.hasSome("types", value);
    }

    if ($w('#filterByCategory').valid) {
        let value = $w('#filterByCategory').value;

        wixDataFilter = wixDataFilter.eq("category", value);
    }

    return $w('#PlanConfigurationDataset').setFilter(wixDataFilter)
        .then(() => {
            listStateRefresh();

            $w('#repeater').forEachItem(repeater_refresh);

            return true;
        });
}

function sort_refresh() {
    let wixDataSort = wixData.sort();

    if ($w('#sortBy').valid) {
        let sortByValues = $w('#sortBy').value.split(",");

        if (sortByValues.length >= 2) {
            let [order, ...propertyNames] = sortByValues;

            if (order == "desc") {
                wixDataSort = wixDataSort.descending(...propertyNames);
            } else {
                wixDataSort = wixDataSort.ascending(...propertyNames);
            }
        }
    }

    return $w('#PlanConfigurationDataset').setSort(wixDataSort);
}

function repeater_OnItemReady($item) {
    $item('#expandButton').onClick(repeater_accordianButtonClick);
    $item('#collapseButton').onClick(repeater_accordianButtonClick);

    $item('#editButton').onClick(openEditor_toEditListItem);

    $item('#deleteButton').onClick(openConfirmation_toDeleteListItem);
}

async function repeater_refresh($item, itemData) {
    try {
        let result = await wixData.query("PaidPlans/Plans")
            .hasSome("PlanBenefits_plans", itemData._id)
            .limit(100)
            .find();

        $item('#subListItemCount').text = `${result?.totalCount || "No"} Plans`;

        $item('#subListItemCount').show();

        customTableColumn($item, result.items);
    } catch (error) {
        console.log(error);

        $item('#table').hide();
    }
}

function customTableColumn($item, items) {
    const rows = items.map(item => {
        const duration = item.validUntilCanceled ? "Valid until canceled" : [item.periodAmount, item.periodUnit].filter(Boolean).join(" ");

        const formattedPrice = Intl.NumberFormat(
            wixWindowFrontend.browserLocale, {
            style: "currency",
            currency: item.currency
        }
        )
            .format(item.price);

        const recursionText = item.recurring ? `every ${item.periodUnit.toLowerCase()}` : "";

        const priceText = [formattedPrice, recursionText].filter(Boolean).join(" / ");

        return {
            name: item.name,
            price: priceText,
            duration
        }
    });

    $item('#table').rows = rows;

    // if ($item('#table').rows.length) {
    //     $item('#table').expand();
    // } else {
    //     $item('#table').collapse();
    // }
}

function repeater_accordianButtonClick(event) {
    const $item = $w.at(event.context);

    const isCollapsed = $item('#table').collapsed;

    if (isCollapsed) {
        $item('#expandButton').hide();
        $item('#collapseButton').show();

        $item('#table').expand();
    } else {
        $item('#expandButton').show();
        $item('#collapseButton').hide();

        $item('#table').collapse();
    }
}

async function openEditor_toCreateListItem() {
    try {
        let result = await wixWindowFrontend.openLightbox(editorLightboxName);

        if (!result?.savedItemId) {
            return false;
        }

        await $w('#PlanConfigurationDataset').refresh();

        listStateRefresh();
    } catch (error) {
        console.log("could not open editor to creater new item:", error);

        return false;
    }
}

async function openEditor_toEditListItem(event) {
    try {
        if (!event?.context?.itemId) {
            throw "no context itemId";
        }

        let result = await wixWindowFrontend.openLightbox(editorLightboxName, event.context.itemId);

        if (result == "cancel") {
            console.log("action canceled by user");

            return false;
        }

        await $w('#PlanConfigurationDataset').refresh();

        $w('#repeater').forItems([event.context.itemId], repeater_refresh);
    } catch (error) {
        console.log("could not open editor to edit item:", error);

        return false;
    }
}

async function openConfirmation_toDeleteListItem(event) {
    try {
        if (!event?.context?.itemId) {
            throw "no context itemId";
        }

        const itemData = $w('#repeater').data.find(itemData => itemData._id == event.context.itemId);

        if (!itemData) {
            throw `no itemData found for itemId ${event.context.itemId}`;
        }

        let confirmationResult = await wixWindowFrontend.openLightbox("Confirm", {
            title: `Delete Item: '${itemData.title}'`,
            message: `Are you sure, you want to delete the item '${itemData.title}'`
        });

        if (confirmationResult != "yes") {
            console.log("action canceled by user");

            return false;
        }

        await wixData.remove("PlanBenefits", event.context.itemId);

        await $w('#PlanConfigurationDataset').refresh();

        listStateRefresh();
    } catch (error) {
        console.log("error while deleting item:", error);

        return false;
    }
}