sprite(param)
	'transparent url(%s) no-repeat %s %s; width: %s; height:%s;' % param

{{#sprites}}{{name}} = ('{{../baseUrl}}{{../fileName}}' -{{x}}px -{{y}}px {{width}}px {{height}}px)
{{/sprites}}
