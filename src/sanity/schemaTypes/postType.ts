import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {POST_TOPICS} from '../../config/postTopics'

/** Today as YYYY-MM-DD, in the editor's own time zone. */
function today() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * A blog post at /blog/<slug>. Mirrors the `Post` type in
 * src/config/blog.ts so the existing pages can render it.
 */
export const postType = defineType({
  name: 'post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'details', title: 'Details'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (rule) => [
        rule.required(),
        rule.max(70).warning('Search engines cut titles at about 60-70 characters.'),
      ],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      description: 'The web address: /blog/<slug>. Do not change it after publishing.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) =>
        rule.required().custom((slug) => {
          if (!slug?.current) return true
          return (
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.current) ||
            'Use lowercase letters, numbers and single hyphens only.'
          )
        }),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description:
        'One or two sentences. Shown on the blog list and used as the search description.',
      validation: (rule) => [
        rule.required(),
        rule.min(50).warning('A little short to describe the post.'),
        rule.max(200).warning('Search engines show about 155-200 characters.'),
      ],
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      group: 'content',
      description:
        'Shown on the blog list, at the top of the post and when the post is shared. Landscape, at least 1600 px wide.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Describe the image for people who cannot see it.',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'caption',
          type: 'string',
          description: 'Optional, shown under the image on the post page.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'keyTakeaways',
      type: 'array',
      group: 'content',
      description: '3 to 5 short points a reader should remember. Shown at the top of the post.',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => [
        rule.max(5).warning('Keep it to 5 points or fewer.'),
        rule.min(3).warning('Aim for at least 3 points.'),
      ],
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
      group: 'content',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      group: 'content',
      description: 'Optional. 3 to 5 common questions, answered in a few plain sentences.',
      of: [
        defineArrayMember({
          name: 'faqItem',
          type: 'object',
          icon: HelpCircleIcon,
          fields: [
            defineField({
              name: 'question',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'question', subtitle: 'answer'}},
        }),
      ],
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      group: 'details',
      description: 'Show this post in the large card at the top of the blog. The newest featured post wins.',
      initialValue: false,
    }),
    defineField({
      name: 'topic',
      type: 'string',
      group: 'details',
      description: 'Drives the blog filter and the closing call to action.',
      options: {
        list: POST_TOPICS.map(({id, label}) => ({title: label, value: id})),
        layout: 'radio',
      },
      initialValue: 'general',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      group: 'details',
      to: [{type: 'author'}],
      description: 'Leave empty to credit the company.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish date',
      type: 'date',
      group: 'details',
      description: 'The post goes live on this date. Pick a future date to schedule it.',
      initialValue: today,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last updated',
      type: 'date',
      group: 'details',
      description: 'Set only after a real change to the content, not for typo fixes.',
      validation: (rule) =>
        rule.custom((updatedAt, context) => {
          const publishedAt = context.document?.publishedAt
          if (
            typeof updatedAt === 'string' &&
            typeof publishedAt === 'string' &&
            updatedAt < publishedAt
          ) {
            return 'Must be on or after the publish date.'
          }
          return true
        }),
    }),
  ],
  orderings: [
    {
      title: 'Publish date, newest first',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      author: 'author.name',
      media: 'coverImage',
      featured: 'featured',
    },
    prepare({title, publishedAt, author, media, featured}) {
      return {
        title,
        media,
        subtitle: [featured ? 'Featured' : null, publishedAt ?? 'No date', author]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
