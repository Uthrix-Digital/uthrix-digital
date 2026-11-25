import {ImageIcon} from '@sanity/icons/Image'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import {LinkIcon} from '@sanity/icons/Link'
import {defineArrayMember, defineField, defineType} from 'sanity'

/** Callout styles, shared with the website renderer. */
export const CALLOUT_TONES = [
  {title: 'Tip', value: 'tip'},
  {title: 'Note', value: 'note'},
  {title: 'Warning', value: 'warning'},
] as const

/**
 * The body of a blog post. Kept to what the post page renders: paragraphs,
 * one heading level (H2), bullet lists, bold, italic, links, images with
 * captions and callouts (tip, note, warning).
 */
export const blockContentType = defineType({
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading', value: 'h2'},
      ],
      lists: [{title: 'Bullet', value: 'bullet'}],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'object',
            icon: LinkIcon,
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                description:
                  'A page on this site ("/contact") or a full address ("https://...").',
                validation: (rule) =>
                  rule
                    .required()
                    .uri({allowRelative: true, scheme: ['https', 'http', 'mailto']}),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
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
          description: 'Optional, shown under the image.',
        }),
      ],
    }),
    defineArrayMember({
      name: 'callout',
      type: 'object',
      icon: InfoOutlineIcon,
      fields: [
        defineField({
          name: 'tone',
          type: 'string',
          options: {list: [...CALLOUT_TONES], layout: 'radio', direction: 'horizontal'},
          initialValue: 'tip',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'text',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required(),
        }),
      ],
      preview: {
        select: {tone: 'tone', text: 'text'},
        prepare({tone, text}) {
          const label = CALLOUT_TONES.find((t) => t.value === tone)?.title ?? 'Callout'
          return {title: label, subtitle: text}
        },
      },
    }),
  ],
})
