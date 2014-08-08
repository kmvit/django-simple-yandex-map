from django import template

register = template.Library()

@register.filter
def ymapcoord__address(value):
    if value is not None:
        return value.split(' (')[0]
    else:
        return None


@register.filter
def ymapcoord__coordinates(value):
    if value is not None:
        bits = value.split(' (')[0]
        return bits[1] if len(bits) > 1 else None
    else:
        return None
