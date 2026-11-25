import {CalendarIcon} from '@sanity/icons/Calendar'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {UserIcon} from '@sanity/icons/User'
import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Posts')
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList('post')
            .title('Posts')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
        ),
      // Posts with a future publish date: the queue for the coming weeks.
      S.listItem()
        .title('Scheduled')
        .icon(CalendarIcon)
        .child(
          S.documentList()
            .title('Scheduled posts')
            .schemaType('post')
            .filter('_type == "post" && publishedAt > now()')
            .apiVersion('2026-11-24')
            .defaultOrdering([{field: 'publishedAt', direction: 'asc'}]),
        ),
      S.divider(),
      S.listItem()
        .title('Authors')
        .icon(UserIcon)
        .child(S.documentTypeList('author').title('Authors')),
    ])
