(function($) {
    $(function() {
        $('.ymap_field').each(function(i) {
            var $input = $(this);
            var $ymap_div = $('<div style="float:left"></div>').attr('id', 'ymap_' + i);
            $input.data('ymap_div', $ymap_div);

            $ymap_div.insertAfter($input)
                .css({
                    'width': $input.data('size_width'),
                    'height': $input.data('size_height')
                });
            $input.css({
                'width': $input.data('size_width')
            });
            init_map($input);
        })
    })
})(django.jQuery);

function init_map($input) {
    ymaps.ready(function() {
        var map = new ymaps.Map($input.data('ymap_div').attr('id'), {
            center: [41, 82],
            zoom: 7
        });
        $input.data('ymap', map);

        var searchControl = new ymaps.control.SearchControl({
            noPlacemark: true,
            width: 500
        });
        $input.data('search_control', searchControl);
        searchControl.events.add('resultselect', function() {
            searchControl.getResult(searchControl.state.get('currentIndex'))
                .then(function(result) {
                    django_ymap_search_addr($input, result.properties.get('text'));
                });
        });
        map.controls
            .add('zoomControl')
            .add('typeSelector')
            .add('mapTools')
            .add(searchControl);
        map.events.add('click', function(e) {
            django_ymap_search_coords($input, e.get('coordPosition'));
        });
        if ($input.data('keep_raw_coords')) {
            var addr_coords = $input.val().split(' (');
            if (addr_coords.length > 1) {
                var coords = addr_coords[1].substring(0, addr_coords[1].length - 1).split(',');
                django_move_mark($input, coords, addr_coords[0]);
            } else {
                searchControl.search(addr_coords[0]);
            }
        } else {
            searchControl.search($input.val());
        }

        // Don't submit whole form on Enter
        $('.ymaps-b-form-input__input').on('keypress', function(e) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode == 13) {
                e.preventDefault();
                e.stopPropagation();
                $('.ymaps-b-search__button .ymaps-b-form-button').trigger('click');
                return false
            }
        });
    });
}

function django_ymap_search_coords($input, coords) {
    $input.data('search_by_coords', coords);
    $input.data('search_control').search(coords.join(','));
}

function django_move_mark($input, coords, addr) {
    var map = $input.data('ymap');
    var mark = $input.data('ymap_mark');
    if (mark) {
        map.geoObjects.remove(mark);
    }
    mark = new ymaps.Placemark(coords, {
        hintContent: addr
    },{
        draggable: !!$input.data('keep_raw_coords')
    });

    map.geoObjects.add(mark);
    $input.data('ymap_mark', mark);
    map.setCenter(coords);

    if ($input.data('keep_raw_coords')) {
        $input.val(addr + ' (' + coords.join(',') +')');

        mark.events.add('dragend', function(e) {
            django_ymap_search_coords($input, e.get('target').geometry.getCoordinates());
        });
    } else {
        $input.val(addr);
    }
    $input.trigger('change');
}

function django_ymap_search_addr($input, addr) {
    $('.ymaps-b-form-input__input').val(addr);
    if ($input.data('keep_raw_coords') && $input.data('search_by_coords')) {
        django_move_mark($input, $input.data('search_by_coords'), addr);
        $input.data('search_by_coords', false);
    } else {
        ymaps.geocode(addr, {results: 1}).then(function(res) {
            django_move_mark($input, res.geoObjects.get(0).geometry.getCoordinates(), addr);
        });
    }
}
