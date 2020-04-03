function exportXsl() {
    var fileName = $("#tableNameCn").text();
    $("#queryTable").tableExport({
        type: 'excel', escape: 'false'
    },fileName);
}

function exportPDF() {
    $('#queryTable').tableExport({
        type: 'pdf',
        escape: 'false'
    });
}

function exportDetailXsl(){
    var fileName = $("#detailModelTitle").text();
    $("#detailModelTable").tableExport({
        type: 'excel', escape: 'false'
    },fileName);
}


function exportZHXsl() {
    var fileName = $(".panel-heading").text();
    $(".table").tableExport({
        type: 'excel', escape: 'false'
    },fileName);

}

function exportZHPDF() {
    $(".table").tableExport({
        type: 'pdf', escape: 'false'
    });

}


