import {defineField, defineType} from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
    }),
    defineField({
      name: 'eventType',
      type: 'string',
    }),    
    defineField({
      name: 'date',
      type: 'datetime',
    }),
    defineField({
      name: 'doorsOpen',
      type: 'number',
    }),
    
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'details',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'tickets',
      type: 'url',
    }),
  ],
})