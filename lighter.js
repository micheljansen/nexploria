
function spark(url, title) {
    $(".detailframe").remove();
    $detailframe = $("<iframe class='detailframe'></iframe>");
    $(".details").attr("title", title);
    $detailframe.attr("src", url);
    $(".details").append($detailframe);
    $(".details").dialog({
        height: ($(window).height() * 0.85),
        width: ($(window).width() * 0.85),
        modal: true,
        buttons: {
            Ok: function() {
                $(this).dialog("close");
            }
        }
    });
}
