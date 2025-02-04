let resultsItems = [];
const pageSize = 20;

$w.onReady(function () {
    $w('#pagination').onChange(pagination_Change);

    showResults([]);
});

function pagination_Change() {
    let startIndex = $w('#pagination').currentPage * pageSize - pageSize;
    let endIndex = startIndex + pageSize;

    let currentItems = resultsItems.slice(startIndex, endIndex);

    $w('#pagination').totalPages = Math.ceil(resultsItems.length / pageSize);

    $w('#resultsRepeater').data = currentItems;
    $w('#resultsRepeater').forEachItem(resultsRepeater_ItemRefresh);
}

async function showResults(items = []) {
    resultsItems = items;

    $w('#pagination').currentPage = 1;
    pagination_Change();

    if (resultsItems.length > 0) {
        $w('#pagination').show();
    } else {
        $w('#pagination').hide();
    }

    return true;
}