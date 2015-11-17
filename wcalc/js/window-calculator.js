$(function () {
    var calculator = new WindowCalculator();

    var imageSelector = '.wc-section-type-element-image';
    var selectedClass = 'wc-selected';
    var carriageSelector = '.wc-selected-carriage';
    var bigImagePattern = 'wcalc/img/big/b';
    var bigImageSelector = '.wc-preview img';

    var heightSlider = $('.wc-slider-vertical');
    var heightInput = $(".wc-vertical-input");

    var widthSlider = $('.wc-slider-horizontal');
    var widthInput = $(".wc-horizontal-input");

    /* SLIDER INIT */
    heightSlider.slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 3100,
        value: 500,
        slide: function (event, ui) {
            heightInput.val(ui.value);
        }
    });

    heightInput.val(heightSlider.slider("value"));

    widthSlider.slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 3100,
        value: 500,
        slide: function (event, ui) {
            widthInput.val(ui.value);
        }
    });

    widthInput.val(widthSlider.slider("value"));

    /* INPUT INIT*/

    widthInput.add(heightInput).on('keypress', function (e) {
        if (this.value.lenght >= 4) {
            return false;
        }
        e = e || window.event;
        var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
        var charStr = String.fromCharCode(charCode);
        debugger;
        if (!/\d/.test(charStr)) {
            return false;
        }
    });

    widthInput.on("input change", function () {
        var value = parseInt($(this).val());
        if (Number.isInteger(value) && value > 0) {
            $('.wc-slider-horizontal').slider({
                value: value
            });
        }
    });

    heightInput.on("input change", function () {
        var value = parseInt($(this).val());
        if (Number.isInteger(value) && value > 0) {
            $('.wc-slider-vertical').slider({
                value: value
            });
        }
    });

    /* CALCULATOR INIT */

    $('.wc-price-button').on('click', function () {
        var productType = $('.wc-selected').data("type");
        var glassType = $('.wc-glass-type select').val();
        var profileType = $('.wc-profile-system select').val();
        var height = $(".wc-vertical-input").val();
        var width = $(".wc-horizontal-input").val();

        var priceResult = calculator.getPrice(glassType, profileType, productType, height, width);

        setTimeout(function () {
            if (priceResult.errorMessage) {
                $('.wc-price-error').text(priceResult.errorMessage).show();
                $('.wc-price-static-label').hide();
                $('.wc-price-label').text('').hide();
            } else {
                $('.wc-price-error').text('').hide();
                $('.wc-price-static-label').show();
                $('.wc-price-label').text(priceResult.result).show();
            }
            $('.wc-price-spinner').css('opacity', 0);
        }, 500);

        $('.wc-price-spinner').css('opacity', 1);
    });

    /* PROFILE TYPE PICKER INIT */

    $(imageSelector).on('click', function (e) {
        var $this = $(this);

        if ($this.hasClass(selectedClass)) return;

        $(bigImageSelector).attr('src', bigImagePattern + $this.data('type') + '.jpg');

        $(imageSelector).removeClass(selectedClass);
        $this.addClass(selectedClass);

        var carriage = $(carriageSelector);
        carriage.css("left", $this.position().left - 5);
        carriage.css("top", $this.position().top);
        carriage.width($this.width() + 9);
        carriage.height($this.height() + 10);

        var minHeight = calculator.getMinHeight($this.data('type'));
        var minWidth = calculator.getMinWidth($this.data('type'));

        heightSlider.slider({
            value: minHeight
        });
        heightInput.val(minHeight);
        widthSlider.slider({
            value: minWidth
        });
        widthInput.val(minWidth);
    });
});


function WindowCalculator() {
    var self = this;

    var sizeTable = {


        "1ct1": {
            height: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500],
            width: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500],
            factors: [[40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
[40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
[40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
[40, 40, 40, 40, 40, 40, 40, 40, 41, 43, 46],
[40, 40, 40, 40, 40, 40, 40, 42, 44, 47, 50],
[40, 40, 40, 40, 40, 40, 42, 45, 48, 51, 54],
[40, 40, 40, 40, 40, 42, 46, 49, 52, 55, 58],
[40, 40, 40, 40, 42, 45, 49, 52, 56, 60, 63],
[40, 40, 40, 41, 45, 49, 52, 55, 60, 63, 67],
[40, 40, 41, 44, 48, 52, 56, 60, 64, 68, 71],
[40, 40, 42, 47, 51, 55, 59, 63, 67, 71, 75]]

        },

        "1ct2": {
            height: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000],
            width: [500, 600, 700, 800, 900, 1000],
            factors: [[40, 40, 40, 40, 42, 45, 48, 50, 53, 56, 60, 62, 65, 68, 71, 76],
[40, 40, 40, 40, 44, 50, 52, 55, 58, 61, 64, 68, 70, 73, 66, 82],
[40, 40, 40, 44, 48, 52, 56, 59, 62, 66, 69, 72, 76, 80, 84, 88],
[40, 40, 41, 48, 52, 57, 61, 64, 68, 72, 76, 80, 84, 88, 92, 95],
[40, 40, 48, 52, 55, 61, 65, 69, 73, 77, 81, 85, 89, 94, 97, 101],
[45, 49, 52, 57, 61, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 110]]

        },

        "1ct3": {
            height: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000],
            width: [500, 600, 700, 800, 900, 1000],
            factors: [[40, 40, 40, 41, 45, 49, 51, 54, 57, 60, 63, 66, 69, 72, 75, 80],
[40, 40, 40, 43, 47, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80, 86],
[40, 40, 43, 47, 51, 56, 60, 63, 66, 70, 73, 76, 80, 83, 87, 92],
[41, 43, 47, 51, 56, 61, 65, 68, 72, 76, 80, 84, 88, 92, 96, 99],
[45, 47, 51, 56, 59, 65, 69, 73, 77, 81, 85, 89, 93, 97, 101, 105],
[49, 53, 56, 61, 65, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 114]]

        },

        "2ct1": {
            height: [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000],
            width: [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900],
            factors: [[71, 75, 80, 84, 89, 93, 97, 101, 105, 110, 118],
[74, 79, 84, 89, 94, 99, 104, 109, 114, 119, 124],
[78, 83, 87, 92, 98, 103, 107, 111, 118, 125, 130],
[81, 86, 91, 96, 101, 106, 111, 116, 121, 126, 135],
[85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 141],
[89, 95, 101, 107, 113, 119, 125, 131, 137, 143, 147],
[93, 99, 105, 111, 117, 123, 129, 135, 141, 147, 152],
[97, 103, 109, 115, 121, 127, 133, 139, 145, 151, 160],
[102, 108, 114, 120, 126, 132, 138, 144, 150, 156, 167],
[106, 112, 118, 124, 130, 136, 142, 148, 154, 160, 173]]

        },

        "2ct2": {
            height: [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000],
            width: [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900],
            factors: [[89, 95.2, 101.4, 107.6, 113.8, 120, 126.2, 132.4, 138.6, 144.8, 152],
[95, 101.2, 107.4, 113.6, 119.8, 126, 132.2, 138.4, 144.6, 150.8, 159],
[101, 107.3, 113.6, 119.9, 126.2, 132.5, 138.8, 145.1, 151.4, 157.7, 166],
[107, 113.4, 119.8, 126.2, 132.6, 139, 145.4, 151.8, 158.2, 164.6, 173],
[113, 119.5, 126, 132.5, 139, 145.5, 152, 158.5, 165, 171.5, 180],
[119, 126, 132.6, 139.2, 145.8, 152.4, 159, 165.6, 172.2, 178.8, 187],
[125, 132, 139, 146, 153, 160, 167, 174, 181, 188, 194],
[131, 138, 145, 152, 159, 166, 173, 180, 187, 194, 201],
[137, 144, 151, 158, 165, 172, 179, 186, 193, 200, 208],
[141, 148, 155, 162, 169, 176, 183, 190, 197, 204, 214]]

        },

        "3ct1": {
            height: [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000],
            width: [1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900],
            factors: [[92, 98.4, 104.8, 111.2, 117.6, 124, 130.4, 136.8, 143.2, 149.6, 156],
[95.7, 102.3, 108.9, 115.5, 122.1, 128.7, 135.3, 141.9, 148.5, 155.1, 161.9],
[99.4, 106.24, 113.08, 119.92, 126.76, 133.6, 140.44, 147.28, 154.12, 160.96, 167.8],
[103.1, 110.16, 117.22, 124.28, 131.34, 138.4, 145.46, 152.52, 159.58, 166.64, 173.7],
[106.8, 114.08, 121.36, 128.64, 135.92, 143.2, 150.48, 157.76, 165.04, 172.32, 179.6],
[110.5, 118, 125.5, 133, 140.5, 148, 155.5, 163, 170.5, 178, 185.5],
[114.2, 121.94, 129.68, 137.42, 145.16, 152.9, 160.64, 168.38, 176.12, 183.86, 191.4],
[117.9, 125.84, 133.78, 141.72, 149.66, 157.6, 165.54, 173.48, 181.42, 189.36, 197.3],
[121.6, 129.76, 137.92, 146.08, 154.24, 162.4, 170.56, 178.72, 186.88, 195.04, 203.2],
[125.3, 133.68, 142.06, 150.44, 158.82, 167.2, 175.58, 183.96, 192.34, 200.72, 209.1],
[129, 137.6, 146.2, 154.8, 163.4, 172, 180.6, 189.2, 197.8, 206.4, 215],
[132.7, 141.52, 150.34, 159.16, 167.98, 176.8, 185.62, 194.44, 203.26, 212.08, 220.9],
[136.4, 145.44, 154.48, 163.52, 172.56, 181.6, 190.64, 199.68, 208.72, 217.76, 226.8],
[140.1, 149.36, 158.62, 167.88, 177.14, 186.4, 195.66, 204.92, 214.18, 223.44, 232.7],
[144, 153.5, 163, 172.5, 182, 191.5, 201, 210.5, 220, 229.5, 239]]

        },

        "3ct2": {
            height: [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000],
            width: [1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900],
            factors: [[110, 118, 126, 134, 142, 150, 158, 166, 174, 182, 190],
[114.5, 122.685, 130.87, 139.055, 147.24, 155.425, 163.61, 171.795, 179.98, 188.165, 196.35],
[119, 127.37, 135.74, 144.11, 152.48, 160.85, 169.22, 177.59, 185.96, 194.33, 202.7],
[123.5, 132.055, 140.61, 149.165, 157.72, 166.275, 174.83, 183.385, 191.94, 200.495, 209.05],
[128, 136.74, 145.48, 154.22, 162.96, 171.7, 180.44, 189.18, 197.92, 206.66, 215.4],
[132.5, 141.425, 150.35, 159.275, 168.2, 177.125, 186.05, 194.975, 203.9, 212.825, 221.75],
[137, 146.11, 155.22, 164.33, 173.44, 182.55, 191.66, 200.77, 209.88, 218.99, 228.1],
[141.5, 150.795, 160.09, 169.385, 178.68, 187.975, 197.27, 206.565, 215.86, 225.155, 234.45],
[146, 155.48, 164.96, 174.44, 183.92, 193.4, 202.88, 212.36, 221.84, 231.32, 240.8],
[150.5, 160.165, 169.83, 179.495, 189.16, 198.825, 208.49, 218.155, 227.82, 237.485, 247.15],
[155, 164.85, 174.7, 184.55, 194.4, 204.25, 214.1, 223.95, 233.8, 243.65, 253.5],
[159.5, 169.535, 179.57, 189.605, 199.64, 209.675, 219.71, 229.745, 239.78, 249.815, 259.85],
[164, 174.22, 184.44, 194.66, 204.88, 215.1, 225.32, 235.54, 245.76, 255.98, 266.2],
[168.5, 178.905, 189.31, 199.715, 210.12, 220.525, 230.93, 241.335, 251.74, 262.145, 272.55],
[173, 183.6, 194.2, 204.8, 215.4, 226, 236.6, 247.2, 257.8, 268.4, 279]]

        },

        "3ct3": {
            height: [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000],
            width: [1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900],
            factors: [[129, 138.5, 148, 157.5, 167, 176.5, 186, 195.5, 205, 214.5, 224],
[133, 142.7, 152.4, 162.1, 171.8, 181.5, 191.2, 200.9, 210.6, 220.3, 230],
[137, 146.9, 156.8, 166.7, 176.6, 186.5, 196.4, 206.3, 216.2, 226.1, 236],
[141, 151.1, 161.2, 171.3, 181.4, 191.5, 201.6, 211.7, 221.8, 231.9, 242],
[145, 155.3, 165.6, 175.9, 186.2, 196.5, 206.8, 217.1, 227.4, 237.7, 248],
[149, 159.5, 170, 180.5, 191, 201.5, 212, 222.5, 233, 243.5, 254],
[153, 163.7, 174.4, 185.1, 195.8, 206.5, 217.2, 227.9, 238.6, 249.3, 260],
[156, 167.1, 178.2, 189.3, 200.4, 211.5, 222.6, 233.7, 244.8, 255.9, 267],
[161, 172.3, 183.6, 194.9, 206.2, 217.5, 228.8, 240.1, 251.4, 262.7, 274],
[165, 176.5, 188, 199.5, 211, 222.5, 234, 245.5, 257, 268.5, 280],
[169, 181, 193, 205, 217, 229, 241, 253, 265, 277, 289],
[181, 192.5, 204, 215.5, 227, 238.5, 250, 261.5, 273, 284.5, 296],
[195, 206.3, 217.6, 228.9, 240.2, 251.5, 262.8, 274.1, 285.4, 296.7, 308],
[200, 211.5, 223, 234.5, 246, 257.5, 269, 280.5, 292, 303.5, 315],
[205, 216.7, 228.4, 240.1, 251.8, 263.5, 275.2, 286.9, 298.6, 310.3, 322]]

        },

        "4ct1": {
            height: [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000],
            width: [2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100],
            factors: [[133, 142.5, 152, 161.5, 171, 180.5, 190, 199.5, 209, 218.5, 228],
[136.54, 146.266, 155.992, 165.718, 175.444, 185.17, 194.896, 204.622, 214.348, 224.074, 233.8],
[140.08, 150.032, 159.984, 169.936, 179.888, 189.84, 199.792, 209.744, 219.696, 229.648, 239.6],
[143.62, 153.798, 163.976, 174.154, 184.332, 194.51, 204.688, 214.866, 225.044, 235.222, 245.4],
[147.16, 157.564, 167.968, 178.372, 188.776, 199.18, 209.584, 219.988, 230.392, 240.796, 251.2],
[150.7, 161.33, 171.96, 182.59, 193.22, 203.85, 214.48, 225.11, 235.74, 246.37, 257],
[154.24, 165.096, 175.952, 186.808, 197.664, 208.52, 219.376, 230.232, 241.088, 251.944, 262.8],
[157.78, 168.862, 179.944, 191.026, 202.108, 213.19, 224.272, 235.354, 246.436, 257.518, 268.6],
[161.32, 172.628, 183.936, 195.244, 206.552, 217.86, 229.168, 240.476, 251.784, 263.092, 274.4],
[164.86, 176.39, 187.92, 199.45, 210.98, 222.51, 234.04, 245.57, 257.1, 268.63, 280.2],
[168.4, 180.16, 191.92, 203.68, 215.44, 227.2, 238.96, 250.72, 262.48, 274.24, 286],
[172, 184, 196, 208, 220, 232, 244, 256, 268, 280, 292]]

        },

        "4ct2": {
            height: [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000],
            width: [2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100],
            factors: [[176, 188.4, 200.8, 213.2, 225.6, 238, 250.4, 262.8, 275.2, 287.6, 300],
[180.1, 192.71, 205.32, 217.93, 230.54, 243.15, 255.76, 268.37, 280.98, 293.59, 306.2],
[184.2, 197.02, 209.84, 222.66, 235.48, 248.3, 261.12, 273.94, 286.76, 299.58, 312.4],
[188.3, 201.33, 214.36, 227.39, 240.42, 253.45, 266.48, 279.51, 292.54, 305.57, 318.6],
[192.4, 205.64, 218.88, 232.12, 245.36, 258.6, 271.84, 285.08, 298.32, 311.56, 324.8],
[196.5, 209.95, 223.4, 236.85, 250.3, 263.75, 277.2, 290.65, 304.1, 317.55, 331],
[200.6, 214.26, 227.92, 241.58, 255.24, 268.9, 282.56, 296.22, 309.88, 323.54, 337.2],
[204.7, 218.57, 232.44, 246.31, 260.18, 274.05, 287.92, 301.79, 315.66, 329.53, 343.4],
[208.8, 222.88, 236.96, 251.04, 265.12, 279.2, 293.28, 307.36, 321.44, 335.52, 349.6],
[212.9, 227.19, 241.48, 255.77, 270.06, 284.35, 298.64, 312.93, 327.22, 341.51, 355.8],
[217, 231.5, 246, 260.5, 275, 289.5, 304, 318.5, 333, 347.5, 362],
[221, 235.7, 250.4, 265.1, 279.8, 294.5, 309.2, 323.9, 338.6, 353.3, 368]]

        },

        "db1": {
            height: [1900, 2000, 2100, 2200, 2300, 2400],
            width: [500, 600, 700, 800, 900, 1000],
            factors: [[78, 81, 84, 87, 90, 93],
[85.2, 88.4, 91.6, 94.8, 98, 101.2],
[92.4, 95.8, 99.2, 102.6, 106, 109.4],
[99.6, 103.2, 106.8, 110.4, 114, 117.6],
[106.8, 110.6, 114.4, 118.2, 122, 125.8],
[114, 118, 122, 126, 130, 134]]

        },

        "db2": {
            height: [1900, 2000, 2100, 2200, 2300, 2400],
            width: [500, 600, 700, 800, 900, 1000],
            factors: [[82, 85.2, 88.4, 91.6, 94.8, 98],
[89.2, 92.6, 96, 99.4, 102.8, 106.2],
[96.4, 98, 101, 106, 109.6, 114.4],
[103.6, 107.4, 111.2, 115, 118.8, 122.6],
[110.8, 114.8, 118.8, 122.8, 126.8, 130.8],
[118, 122.2, 126.4, 130.6, 134.8, 139]]

        },

    };

    this.getCurrency = function () {
        return 17500;
    };

    this.getAddedFactor = function () {
        return 1.3;
    }

    this.getProfileCost = function (profileType, factor, square) {
        switch (profileType) {
        case (WindowCalculator.PROFILE_TYPE.DEXEN):
            {
                return factor;
            }
        case (WindowCalculator.PROFILE_TYPE.KBE):
            {
                return factor + 10 * square;
            }
        case (WindowCalculator.PROFILE_TYPE.WDS):
            {
                return factor + 12 * square;
            }
        case (WindowCalculator.PROFILE_TYPE.SALAMANDER):
            {
                return factor + 30 * square;
            }
        }
    };

    this.getGlassCost = function (glassType, factor, square) {
        switch (glassType) {
        case (WindowCalculator.GLASS_TYPE.SINGLE):
            {
                return 0;
            }
        case (WindowCalculator.GLASS_TYPE.DOUBLE):
            {
                return square * 2.7;
            }
        }
    };

    this.formatPrice = function (price) {
        return price.toString().split(/(?=(?:...)*$)/).join(' ');
    };

    this.ceilPrice = function (price) {
        return Math.ceil(price / 1000) * 1000;
    }

    this.getPrice = function (glassType, profileType, productType, height, width) {

        if (!/^\d{1,4}$/.test(height) || !/^\d{1,4}$/.test(width)) {
            return {
                errorMessage: "Ошибка! Пожалуйста, проверьте размеры или уточните у менеджеров о возможности изготовления данной конструкции"
            };
        }

        height = parseInt(height);
        width = parseInt(width);

        if (isNaN(height) || isNaN(width)) {
            return {
                errorMessage: "Ошибка! Пожалуйста, проверьте размеры или уточните у менеджеров о возможности изготовления данной конструкции"
            };
        }

        var type = sizeTable[productType];

        if (!type) {
            return {
                errorMessage: "Ошибка! Пожалуйста, выберите верный тип продукта"
            };
        }

        if (type.height[0] > height || type.width[0] > width ||
            type.height[type.height.length - 1] < height || type.width[type.width.length - 1] < width) {
            return {
                errorMessage: "Ошибка! Пожалуйста, проверьте размеры или уточните у менеджеров о возможности изготовления данной конструкции"
            };
        }

        var heightI, widthI, i;

        for (i = 1; i < type.height.length; i++) {
            if (type.height[i] >= height) {
                if ((height - type.height[i - 1]) < (type.height[i] - height)) {
                    heightI = i - 1;
                } else {
                    heightI = i;
                }
                break;
            }
        }

        for (i = 1; i < type.width.length; i++) {
            if (type.width[i] >= width) {
                if ((width - type.width[i - 1]) < (type.width[i] - width)) {
                    widthI = i - 1;
                } else {
                    widthI = i;
                }
                break;
            }
        }

        debugger;

        var square = (height * width) / (1000 * 1000);
        var factor = type.factors[widthI][heightI];

        var price = (self.getProfileCost(profileType, factor, square) + self.getGlassCost(glassType, factor, square)) * self.getCurrency() * self.getAddedFactor();

        return {
            result: self.formatPrice(self.ceilPrice(price))
        };
    };

    this.getMinHeight = function (productType) {
        return sizeTable[productType].height[0];
    };


    this.getMinWidth = function (productType) {
        return sizeTable[productType].width[0];
    };
}

WindowCalculator.PROFILE_TYPE = {
    DEXEN: "DEXEN",
    WDS: "WDS",
    KBE: "KBE",
    SALAMANDER: "SALAMANDER"
};

WindowCalculator.GLASS_TYPE = {
    SINGLE: "SINGLE",
    DOUBLE: "DOUBLE"
};