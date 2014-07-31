(function ($) {
    $(function () {
        var i = 0;
        $('.ymap_field').each(function () {
            var input = $(this);

            var ymap_div = $('<div style="float:left"></div>').attr('id', 'ymap_' + i);
            input.data('ymap_div', ymap_div);

            q = ymap_div.insertAfter(input);

            q.css({ 'width': input.data('size_width'), 'height': input.data('size_height') });
            init_map(input);
            i++
        })
    })
})(django.jQuery);

function init_map(input) {
    ymaps.ready(function () {

        var map = new ymaps.Map(input.data('ymap_div').attr('id'), {
            center: [41, 82],
            zoom: 7
        });
        input.data('ymap', map);

        var searchControl = new ymaps.control.SearchControl({
            noPlacemark: true,
            width: 500
        });
        searchControl.events.add('resultselect', function() {
            searchControl.getResult(searchControl.state.get('currentIndex')).then(function (result) {
                input.val(result.properties.get('text'));
                $('.ymaps-b-form-input__input').val(input.val());
                django_ymap_change(input);
            });
        });

        map.controls
            .add('zoomControl')
            .add('typeSelector')
            .add('mapTools')
            .add(searchControl);

        map.events.add('click', function (e) {
            searchControl.search(e.get('coordPosition').join(','));
        });
        searchControl.search(input.val());
    });
}

function django_ymap_change(input) {
    ymaps.geocode(input.val(), {results: 1}).then(function (res) {
        var map = input.data('ymap');
        var obj = res.geoObjects.get(0);
        var coords = obj.geometry.getCoordinates();

        map.setBounds(obj.properties.get('boundedBy'));
//        map.zoomRange.get(coords).then(function (range) {
//            map.setCenter(coords, range[1]);
//        });

        // move mark
        var mark = input.data('ymap_mark');
        if (mark) {
            map.geoObjects.remove(mark);
        }
        mark = new ymaps.Placemark(coords, {'hintContent': input.val()});
        map.geoObjects.add(mark);
        input.data('ymap_mark', mark);
    });
}
