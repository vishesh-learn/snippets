async function openEditor_toCreateListItem() {
    try {
        let result = await wixWindowFrontend.openLightbox(editorLightboxName);

        if (!result?.savedItemId) {
            return false;
        }

        await $w('#datasetId').refresh();

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

        await $w('#datasetId').refresh();

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

        await wixData.remove("CollectionName", event.context.itemId);

        await $w('#datasetId').refresh();

        listStateRefresh();
    } catch (error) {
        console.log("error while deleting item:", error);

        return false;
    }
}