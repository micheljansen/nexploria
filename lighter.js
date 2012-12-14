
function spark(url, title) {
    $(".detailframe").remove();
    $detailframe = $("<iframe class='detailframe'></iframe>");
    $(".details").attr("title", title);
    $detailframe.attr("src", url);
    $(".details").append($detailframe);
    $(".details").dialog({
        height: ($(window).height() * 0.9),
        width: ($(window).width() * 0.9),
        modal: true,
        buttons: {
            Ok: function() {
                $(".dimg").hide();
                $(this).dialog("close");
            }
        }
    });
    $(".dimg").show();
}
