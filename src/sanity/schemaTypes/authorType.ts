import {UserIcon} from '@sanity/icons/User'
import {defineField, defineType} from 'sanity'

/**
 * A person who writes for the blog. Set up once, then pick from a list on
 * each post. Named authors are a trust signal for search and AI engines.
 */
export const authorType = defineType({
  name: 'author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      type: 'string',
      description: 'Job title, e.g. "Founder".',
    }),
    defineField({
      name: 'url',
      title: 'Profile URL',
      type: 'url',
      description: 'A public profile, e.g. LinkedIn.',
      validation: (rule) => rule.uri({scheme: ['https', 'http']}),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      description: 'A square head-and-shoulders photo works best.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'bio',
      type: 'text',
      rows: 3,
      description: 'One or two sentences, shown under each post they write.',
      validation: (rule) => rule.max(280).warning('Keep it short: under 280 characters.'),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'image'},
  },
})
