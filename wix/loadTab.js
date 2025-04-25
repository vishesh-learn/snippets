import wixLocationFrontend from 'wix-location-frontend';

$w.onReady(function () {
    loadCurrentTabFromURL();

    wixLocationFrontend.onChange(loadCurrentTabFromURL);

    if ($w('#tabs')) {
        $w('#tabs').onChange(() => {
            wixLocationFrontend.queryParams.add({
                tabLabel: $w('#tabs').currentTab.label
            });
        });
    }
});

function loadCurrentTabFromURL() {
    let tabLabel = wixLocationFrontend?.query?.tabLabel;

    if (tabLabel && $w('#tabs')) {
        let tab = $w('#tabs').tabs.find(tab => tab.label == tabLabel);

        if (tab) {
            $w('#tabs').changeTab(tab);
        } else {
            console.log("tab not found for tabLabel", tabLabel);
        }
    }
}