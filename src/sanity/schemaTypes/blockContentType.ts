import {LinkIcon} from '@sanity/icons/Link'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * The body of a blog post. Kept to what the post page will render:
 * paragraphs, one heading level (H2), bullet lists, bold, italic and links.
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
  ],
})
