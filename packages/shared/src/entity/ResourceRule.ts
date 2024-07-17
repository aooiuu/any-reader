import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { RuleExtra } from './RuleExtra'

@Entity({ name: 'resource_rule' })
export class ResourceRule {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({
    name: 'enable_upload',
    type: 'integer',
    default: 0,
    transformer: {
      to: v => (v ? 1 : 0),
      from: v => !!v,
    },
  })
  enableUpload!: boolean

  @Column({
    name: 'author',
    type: 'text',
    default: '',
  })
  author!: string

  @Column({
    name: 'name',
    type: 'text',
    default: '',
  })
  name!: string

  @Column({
    name: 'host',
    type: 'text',
    default: '',
  })
  host!: string

  @Column({
    name: 'icon',
    type: 'text',
    default: '',
  })
  icon!: string

  @Column({
    name: 'group',
    type: 'text',
    default: '',
  })
  group!: string

  @Column({ name: 'content_type', type: 'integer', default: 0 })
  contentType!: number

  @Column({ name: 'sort', type: 'integer', default: 0 })
  sort!: number

  @Column({
    name: 'use_crypto_js',
    type: 'integer',
    default: 0,
    transformer: {
      to: v => (v ? 1 : 0),
      from: v => !!v,
    },
  })
  useCryptoJS!: boolean

  @Column({
    name: 'user_agent',
    type: 'text',
    default: '',
  })
  userAgent!: string

  @Column({
    name: 'enable_discover',
    type: 'integer',
    default: 0,
    transformer: {
      to: v => (v ? 1 : 0),
      from: v => !!v,
    },
  })
  enableDiscover!: boolean

  @Column({
    name: 'discover_url',
    type: 'text',
    default: '',
  })
  discoverUrl!: string

  @Column({
    name: 'discover_list',
    type: 'text',
    default: '',
  })
  discoverList!: string

  @Column({
    name: 'discover_tags',
    type: 'text',
    default: '',
  })
  discoverTags!: string

  @Column({
    name: 'discover_name',
    type: 'text',
    default: '',
  })
  discoverName!: string

  @Column({
    name: 'discover_cover',
    type: 'text',
    default: '',
  })
  discoverCover!: string

  @Column({
    name: 'discover_chapter',
    type: 'text',
    default: '',
  })
  discoverChapter!: string

  @Column({
    name: 'discover_description',
    type: 'text',
    default: '',
  })
  discoverDescription!: string

  @Column({
    name: 'discover_result',
    type: 'text',
    default: '',
  })
  discoverResult!: string

  @Column({
    name: 'enable_search',
    type: 'integer',
    default: '',
    transformer: {
      to: v => (v ? 1 : 0),
      from: v => !!v,
    },
  })
  enableSearch!: boolean

  @Column({
    name: 'search_url',
    type: 'text',
    default: '',
  })
  searchUrl!: string

  @Column({
    name: 'search_author',
    type: 'text',
    default: '',
  })
  searchAuthor!: string

  @Column({
    name: 'chapter_cover',
    type: 'text',
    default: '',
  })
  chapterCover!: string

  @Column({
    name: 'chapter_time',
    type: 'text',
    default: '',
  })
  chapterTime!: string

  @Column({
    name: 'discover_author',
    type: 'text',
    default: '',
  })
  discoverAuthor!: string

  @Column({
    name: 'discover_items',
    type: 'text',
    default: '',
  })
  discoverItems!: string

  @Column({
    name: 'search_list',
    type: 'text',
    default: '',
  })
  searchList!: string

  @Column({
    name: 'search_tags',
    type: 'text',
    default: '',
  })
  searchTags!: string

  @Column({
    name: 'search_name',
    type: 'text',
    default: '',
  })
  searchName!: string

  @Column({
    name: 'search_cover',
    type: 'text',
    default: '',
  })
  searchCover!: string

  @Column({
    name: 'search_chapter',
    type: 'text',
    default: '',
  })
  searchChapter!: string

  @Column({
    name: 'search_description',
    type: 'text',
    default: '',
  })
  searchDescription!: string

  @Column({
    name: 'search_result',
    type: 'text',
    default: '',
  })
  searchResult!: string

  @Column({
    name: 'enable_multi_roads',
    type: 'integer',
    default: 0,
    transformer: {
      to: v => (v ? 1 : 0),
      from: v => !!v,
    },
  })
  enableMultiRoads!: boolean

  @Column({
    name: 'chapter_roads',
    type: 'text',
    default: '',
  })
  chapterRoads!: string

  @Column({
    name: 'chapter_road_name',
    type: 'text',
    default: '',
  })
  chapterRoadName!: string

  @Column({
    name: 'chapter_url',
    type: 'text',
    default: '',
  })
  chapterUrl!: string

  @Column({
    name: 'chapter_list',
    type: 'text',
    default: '',
  })
  chapterList!: string

  @Column({
    name: 'chapter_name',
    type: 'text',
    default: '',
  })
  chapterName!: string

  @Column({
    name: 'chapter_result',
    type: 'text',
    default: '',
  })
  chapterResult!: string

  @Column({
    name: 'content_url',
    type: 'text',
    default: '',
  })
  contentUrl!: string

  @Column({
    name: 'content_items',
    type: 'text',
    default: '',
  })
  contentItems!: string

  @Column({ name: 'view_style', type: 'integer', default: 0 })
  viewStyle!: number

  @Column({ name: 'create_time', type: 'integer', default: 0 })
  createTime!: number

  @Column({ name: 'modified_time', type: 'integer', default: 0 })
  modifiedTime!: number

  @OneToOne(() => RuleExtra, e => e.ruleId, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'id' })
  extra!: RuleExtra
}
