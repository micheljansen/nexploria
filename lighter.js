
function spark(url, title) {
    $(".details").attr("title", title);
    $(".detailframe").attr("src", "");
    $(".detailframe").attr("src", url);
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
