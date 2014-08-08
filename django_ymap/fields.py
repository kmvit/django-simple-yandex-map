from django.db import models


class YmapCoord(models.CharField):
    def __init__(self, size_width=500, size_height=500, keep_raw_coords=False,
                 zoom_on_change=False, **kwargs):
        self.size_width = size_width
        self.size_height = size_height
        self.keep_raw_coords = keep_raw_coords
        self.zoom_on_change = zoom_on_change
        super(YmapCoord, self).__init__(**kwargs)

    def formfield(self, **kwargs):
        if 'widget' in kwargs:
            attrs = {
                'data-size_width': self.size_width,
                'data-size_height': self.size_height,
            }
            if self.keep_raw_coords:
                attrs['data-keep_raw_coords'] = self.keep_raw_coords
            if self.zoom_on_change:
                attrs['data-zoom_on_change'] = self.zoom_on_change
            kwargs['widget'] = kwargs['widget'](attrs=attrs)
        return super(YmapCoord, self).formfield(**kwargs)

try:
    from south.modelsinspector import add_introspection_rules
    rules = [
                (
                    (YmapCoord, ), [],
                    {
                        'size_width': ['size_width', {'default': 500}],
                        'size_height': ['size_height', {'default': 500}],
                        'null': ['null', {'default': False}],
                        'blank': ['blank', {'default': False}],
                    }
                ),
            ]

    add_introspection_rules(rules, ['^django_ymap\.fields'])
except ImportError:
    pass
