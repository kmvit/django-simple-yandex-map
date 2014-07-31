from django.db import models

class YmapCoord(models.CharField):
    def __init__(self, size_width=500, size_height=500, **kwargs):
        self.size_width, self.size_height = size_width, size_height
        super(YmapCoord, self).__init__(**kwargs)

    def formfield(self, **kwargs):
        if 'widget' in kwargs:
            kwargs['widget'] = kwargs['widget'](attrs={
                "data-size_width": self.size_width,
                "data-size_height": self.size_height,
            })
        return super(YmapCoord, self).formfield(**kwargs)

try:
    from south.modelsinspector import add_introspection_rules
    rules = [
                (
                    (YmapCoord, ), [],
                    {
                        "size_width": ["size_width", {"default": 500}],
                        "size_height": ["size_height", {"default": 500}],
                        "null": ["null", {"default": False}],
                        "blank": ["blank", {"default": False}],
                    }
                ),
            ]

    add_introspection_rules(rules, ["^django_ymap\.fields"])
except ImportError:
    pass
