$(function () {


    $('.wc-slider-vertical').slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 4000,
        value: 1500,
        slide: function (event, ui) {
            $(".wc-vertical-input").val(ui.value);
        }
    });

    $(".wc-vertical-input").val($('.wc-slider-vertical').slider("value"));

    $('.wc-slider-horizontal').slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 3000,
        value: 1700,
        slide: function (event, ui) {
            $(".wc-horizontal-input").val(ui.value);
        }
    });

    $(".wc-horizontal-input").val($('.wc-slider-horizontal').slider("value"));
});