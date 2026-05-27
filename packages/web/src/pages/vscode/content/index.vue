<template>
  <div class="relative h-full w-full flex flex-col overflow-hidden">
    <div v-if="loading" class="flex flex-1 items-center justify-center">
      <vscode-progress-ring></vscode-progress-ring>
    </div>
    <div
      id="text-container"
      ref="contentRef"
      v-focus
      tabindex="0"
      class="flex-1 overflow-y-auto whitespace-pre-wrap break-words p-10 indent-2em lh-1.5em outline-none"
      :style="{
        fontSize: settingStore.data.readStyle.fontSize + 'px',
        letterSpacing: settingStore.data.readStyle.letterSpacing + 'px'
      }"
      @mouseup="handleSelectionMouseUp"
    >
      <template v-if="contentType === ContentType.MANGA">
        <img v-for="(row, idx) in content" :key="idx" class="center-row" :data-idx="idx" :src="row" />
      </template>
      <template v-else>
        <div v-for="(row, idx) in content" :key="idx" class="center-row" :data-idx="idx" v-html="row"></div>
      </template>

      <div class="my-10 flex justify-center">
        <div v-if="lastChapter" class="cursor-pointer hover:op-70" :title="readStore.preTitle" @click="onPrevChapter">上一章</div>
        <div class="cursor-pointer hover:op-70" :title="readStore.title" @click="init(true)">重载</div>
        <div v-if="nextChapter" class="cursor-pointer hover:op-70" :title="readStore.nextTitle" @click="onNextChapter">下一章</div>
      </div>
    </div>

    <div
      v-if="annotationEnabled && annotationMenu.visible"
      class="annotation-menu"
      :style="{ left: annotationMenu.x + 'px', top: annotationMenu.y + 'px' }"
      @mousedown.stop
    >
      <div class="annotation-menu__colors">
        <button
          v-for="color in annotationColors"
          :key="color"
          class="annotation-menu__swatch"
          :class="[`annotation-menu__swatch--${color}`, { 'annotation-menu__swatch--active': annotationMenu.color === color }]"
          :title="color"
          @mousedown.prevent
          @click="annotationMenu.editingId ? (annotationMenu.color = color) : applySelectionAnnotation(color)"
        ></button>
      </div>

      <template v-if="annotationMenu.editingId || annotationMenu.noteMode">
        <textarea ref="annotationNoteRef" v-model="annotationMenu.note" class="annotation-menu__note" rows="3" placeholder="批注"></textarea>
      </template>

      <div class="annotation-menu__actions">
        <template v-if="annotationMenu.editingId">
          <button class="annotation-menu__button" @mousedown.prevent @click="saveAnnotationEdit">保存</button>
          <button class="annotation-menu__button" @mousedown.prevent @click="deleteAnnotation">删除</button>
        </template>
        <template v-else>
          <button v-if="!annotationMenu.noteMode" class="annotation-menu__button" @mousedown.prevent @click="openSelectionNote">批注</button>
          <button v-else class="annotation-menu__button" @mousedown.prevent @click="applySelectionAnnotation(annotationMenu.color)">保存</button>
        </template>
      </div>
    </div>

    <div
      v-if="annotationEnabled && annotationHover.visible && annotationHover.annotation && !annotationMenu.visible"
      class="annotation-hover"
      :style="{ left: annotationHover.x + 'px', top: annotationHover.y + 'px' }"
    >
      <div class="annotation-hover__header">
        <span class="annotation-hover__swatch" :class="`annotation-hover__swatch--${annotationHover.annotation.color}`"></span>
        <span class="annotation-hover__title">{{ annotationHover.annotation.target.chapterTitle || readStore.title || '批注' }}</span>
      </div>
      <div class="annotation-hover__quote">{{ annotationHover.annotation.llm.quote }}</div>
      <div v-if="annotationHover.annotation.note" class="annotation-hover__note">{{ annotationHover.annotation.note }}</div>
      <div v-else class="annotation-hover__empty">无批注文本</div>
    </div>

    <div class="topbar absolute left-0 top-0 h-30 w-full px-10">
      <div class="topbar__menu flex justify-end bg-[--vscode-sideBar-background]">
        <div
          v-if="lastChapter"
          class="codicon codicon-arrow-left vsc-toolbar-btn"
          :title="`上一章: ${readStore.preTitle}`"
          @click="onPrevChapter"
        ></div>
        <div
          v-if="nextChapter"
          class="codicon codicon-arrow-right vsc-toolbar-btn"
          :title="`下一章: ${readStore.nextTitle}`"
          @click="onNextChapter"
        ></div>
        <div class="codicon codicon-arrow-up vsc-toolbar-btn" title="上一屏" @click="onPageUp"></div>
        <div class="codicon codicon-arrow-down vsc-toolbar-btn" title="下一屏" @click="onPageDown"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { ContentType } from '@any-reader/rule-utils';
import type { ReaderAnnotation, ReaderAnnotationColor } from '../../../../../shared/src/utils/annotations/types';
import { listAnnotations, removeAnnotation, upsertAnnotation } from '@/api/modules/annotations';
import { useContent, useTheme } from '@/pages/common/content';
import { useChaptersStore } from '@/stores/chapters';
import { useReadStore } from '@/stores/read';
import { vscodeLog } from '@/api/modules/vsc';
import { createAnnotationFromSelection, isEpubAnnotationEnabled, rangeOverlapsAnnotation, renderAnnotations } from './annotations';

const contentRef = ref();
const annotationNoteRef = ref<HTMLTextAreaElement>();

const readStore = useReadStore();
const chaptersStore = useChaptersStore();
const route = useRoute();

const { content, contentType, settingStore, lastChapter, nextChapter, onPageUp, onPageDown, onPrevChapter, onNextChapter, loading, init } =
  useContent(contentRef);

useTheme(contentRef);

const annotationColors: ReaderAnnotationColor[] = ['yellow', 'green', 'blue', 'pink', 'purple'];
const annotations = ref<ReaderAnnotation[]>([]);
let selectedAnnotationRange: Range | null = null;
const annotationHover = reactive<{
  visible: boolean;
  x: number;
  y: number;
  annotation: ReaderAnnotation | null;
}>({
  visible: false,
  x: 0,
  y: 0,
  annotation: null
});
const annotationMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  color: 'yellow' as ReaderAnnotationColor,
  note: '',
  noteMode: false,
  editingId: ''
});

const annotationEnabled = computed(() => isEpubAnnotationEnabled(queryString(route.query.filePath), queryString(route.query.ruleId)));

function logAnnotation(level: 'Trace' | 'Debug' | 'Info' | 'Warn' | 'Error', message: string, data?: any) {
  vscodeLog({
    level,
    scope: 'epub-annotations',
    message,
    data
  }).catch(() => {});
}

function queryString(value: unknown) {
  return Array.isArray(value) ? String(value[0] || '') : String(value || '');
}

function getCurrentChapter() {
  const chapterPath = queryString(route.query.chapterPath);
  return chaptersStore.chapters.find((chapter: any) => chapter.chapterPath === chapterPath);
}

function hideAnnotationMenu() {
  annotationMenu.visible = false;
  annotationMenu.noteMode = false;
  annotationMenu.editingId = '';
  annotationMenu.note = '';
  annotationMenu.color = 'yellow';
  selectedAnnotationRange = null;
}

function hideAnnotationHover() {
  annotationHover.visible = false;
  annotationHover.annotation = null;
}

function setAnnotationMenuPosition(clientX: number, clientY: number) {
  const host = contentRef.value?.parentElement as HTMLElement | undefined;
  if (!host) return;
  const hostRect = host.getBoundingClientRect();
  annotationMenu.x = Math.max(8, clientX - hostRect.left);
  annotationMenu.y = Math.max(8, clientY - hostRect.top - 44);
}

function setAnnotationHoverPosition(clientX: number, clientY: number) {
  const host = contentRef.value?.parentElement as HTMLElement | undefined;
  if (!host) return;
  const hostRect = host.getBoundingClientRect();
  annotationHover.x = Math.max(8, Math.min(hostRect.width - 328, clientX - hostRect.left + 12));
  annotationHover.y = Math.max(8, Math.min(hostRect.height - 180, clientY - hostRect.top + 16));
}

async function markOrphanedAnnotations(orphanedIds: string[]) {
  const orphanedSet = new Set(orphanedIds);
  const filePath = queryString(route.query.filePath);
  const updates = annotations.value.filter((annotation) => !!annotation.target.orphaned !== orphanedSet.has(annotation.id));
  if (orphanedIds.length) logAnnotation('Warn', 'mark orphaned annotations', { filePath, orphanedIds });

  await Promise.all(
    updates.map((annotation) =>
      upsertAnnotation({
        filePath,
        annotation: {
          ...annotation,
          target: {
            ...annotation.target,
            orphaned: orphanedSet.has(annotation.id)
          }
        }
      }).catch(() => {})
    )
  );
  annotations.value = annotations.value.map((annotation) => ({
    ...annotation,
    target: {
      ...annotation.target,
      orphaned: orphanedSet.has(annotation.id)
    }
  }));
}

async function renderCurrentAnnotations() {
  if (!contentRef.value || !annotationEnabled.value) {
    logAnnotation('Trace', 'skip render annotations', { hasContentRef: !!contentRef.value, annotationEnabled: annotationEnabled.value });
    return;
  }
  logAnnotation('Debug', 'render annotations start', { count: annotations.value.length, chapterPath: queryString(route.query.chapterPath) });
  const orphanedIds = renderAnnotations({
    root: contentRef.value,
    annotations: annotations.value,
    onClick: showAnnotationEditor,
    onHoverStart: showAnnotationHover,
    onHoverMove: moveAnnotationHover,
    onHoverEnd: hideAnnotationHover
  });
  await markOrphanedAnnotations(orphanedIds);
  logAnnotation('Debug', 'render annotations done', { count: annotations.value.length, orphanedCount: orphanedIds.length });
}

async function loadCurrentAnnotations() {
  if (!annotationEnabled.value) {
    annotations.value = [];
    logAnnotation('Trace', 'annotations disabled for route', { filePath: route.query.filePath, ruleId: route.query.ruleId });
    return;
  }

  const filePath = queryString(route.query.filePath);
  const chapterPath = queryString(route.query.chapterPath);
  logAnnotation('Debug', 'load annotations start', { filePath, chapterPath });
  const res = await listAnnotations({ filePath, chapterPath }).catch(() => null);
  annotations.value = res?.code === 0 ? res.data : [];
  if (res?.code !== 0) logAnnotation('Warn', 'load annotations failed', { filePath, chapterPath, response: res });
  else logAnnotation('Debug', 'load annotations done', { count: annotations.value.length, filePath, chapterPath });
  await nextTick();
  await renderCurrentAnnotations();
}

function handleSelectionMouseUp() {
  if (!annotationEnabled.value || !contentRef.value) {
    logAnnotation('Trace', 'selection ignored because annotations are disabled', { annotationEnabled: annotationEnabled.value });
    return;
  }

  const selection = window.getSelection();
  const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
  if (!selection || !range || range.collapsed || !contentRef.value.contains(range.commonAncestorContainer)) {
    logAnnotation('Trace', 'selection ignored because range is invalid', {
      hasSelection: !!selection,
      hasRange: !!range,
      collapsed: !!range?.collapsed
    });
    hideAnnotationMenu();
    return;
  }

  if (rangeOverlapsAnnotation(contentRef.value, range)) {
    message.warning('暂不支持重叠高亮');
    logAnnotation('Warn', 'selection rejected because it overlaps existing annotation');
    selection.removeAllRanges();
    hideAnnotationMenu();
    return;
  }

  selectedAnnotationRange = range.cloneRange();
  hideAnnotationHover();
  const rect = range.getBoundingClientRect();
  setAnnotationMenuPosition(rect.left, rect.top);
  annotationMenu.visible = true;
  annotationMenu.noteMode = false;
  annotationMenu.editingId = '';
  annotationMenu.note = '';
  logAnnotation('Debug', 'selection menu shown', {
    textLength: selection.toString().length,
    chapterPath: queryString(route.query.chapterPath),
    filePath: queryString(route.query.filePath)
  });
}

async function openSelectionNote() {
  annotationMenu.noteMode = true;
  logAnnotation('Debug', 'selection note editor opened');
  await nextTick();
  annotationNoteRef.value?.focus();
}

async function applySelectionAnnotation(color: ReaderAnnotationColor) {
  if (!contentRef.value) return;
  if (selectedAnnotationRange) {
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(selectedAnnotationRange.cloneRange());
  }

  const selection = window.getSelection();
  const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
  if (!selection || !range || range.collapsed) {
    logAnnotation('Warn', 'save annotation skipped because selection range is missing');
    return;
  }

  if (rangeOverlapsAnnotation(contentRef.value, range)) {
    message.warning('暂不支持重叠高亮');
    logAnnotation('Warn', 'save annotation rejected because selection overlaps existing annotation');
    selection.removeAllRanges();
    hideAnnotationMenu();
    return;
  }

  const chapter = getCurrentChapter();
  const filePath = queryString(route.query.filePath);
  const chapterPath = queryString(route.query.chapterPath);
  const annotation = createAnnotationFromSelection({
    root: contentRef.value,
    selection,
    filePath,
    chapterPath,
    chapterHref: chapter?.chapterHref,
    chapterTitle: chapter?.name || readStore.title,
    color,
    note: annotationMenu.note
  });
  if (!annotation) {
    logAnnotation('Warn', 'create annotation from selection failed', { filePath, chapterPath });
    return;
  }

  logAnnotation('Debug', 'upsert annotation start', {
    id: annotation.id,
    color,
    hasNote: !!annotation.note,
    quoteLength: annotation.llm.quote.length,
    filePath,
    chapterPath
  });
  const res = await upsertAnnotation({ filePath, annotation }).catch(() => null);
  if (res?.code !== 0) {
    message.warning('批注保存失败');
    logAnnotation('Error', 'upsert annotation failed', { id: annotation.id, response: res });
    return;
  }

  selection.removeAllRanges();
  hideAnnotationMenu();
  logAnnotation('Info', 'annotation saved', { id: annotation.id, filePath, chapterPath });
  await loadCurrentAnnotations();
}

function showAnnotationEditor(annotation: ReaderAnnotation, event: MouseEvent) {
  selectedAnnotationRange = null;
  hideAnnotationHover();
  setAnnotationMenuPosition(event.clientX, event.clientY);
  annotationMenu.visible = true;
  annotationMenu.editingId = annotation.id;
  annotationMenu.noteMode = true;
  annotationMenu.note = annotation.note;
  annotationMenu.color = annotation.color;
  logAnnotation('Debug', 'existing annotation editor opened', { id: annotation.id, hasNote: !!annotation.note });
  nextTick(() => annotationNoteRef.value?.focus());
}

function showAnnotationHover(annotation: ReaderAnnotation, event: MouseEvent) {
  if (annotationMenu.visible) return;
  annotationHover.visible = true;
  annotationHover.annotation = annotation;
  setAnnotationHoverPosition(event.clientX, event.clientY);
  logAnnotation('Trace', 'annotation hover shown', { id: annotation.id, hasNote: !!annotation.note });
}

function moveAnnotationHover(annotation: ReaderAnnotation, event: MouseEvent) {
  if (!annotationHover.visible || annotationHover.annotation?.id !== annotation.id) return;
  setAnnotationHoverPosition(event.clientX, event.clientY);
}

async function saveAnnotationEdit() {
  const filePath = queryString(route.query.filePath);
  const annotation = annotations.value.find((item) => item.id === annotationMenu.editingId);
  if (!annotation) {
    logAnnotation('Warn', 'save annotation edit skipped because annotation was not found', { id: annotationMenu.editingId });
    return;
  }

  const nextAnnotation: ReaderAnnotation = {
    ...annotation,
    color: annotationMenu.color,
    note: annotationMenu.note,
    llm: {
      ...annotation.llm,
      note: annotationMenu.note
    }
  };
  logAnnotation('Debug', 'save annotation edit start', { id: nextAnnotation.id, color: nextAnnotation.color, hasNote: !!nextAnnotation.note });
  const res = await upsertAnnotation({ filePath, annotation: nextAnnotation }).catch(() => null);
  if (res?.code !== 0) {
    message.warning('批注保存失败');
    logAnnotation('Error', 'save annotation edit failed', { id: nextAnnotation.id, response: res });
    return;
  }

  hideAnnotationMenu();
  logAnnotation('Info', 'annotation edit saved', { id: nextAnnotation.id, filePath });
  await loadCurrentAnnotations();
}

async function deleteAnnotation() {
  const filePath = queryString(route.query.filePath);
  logAnnotation('Debug', 'delete annotation start', { id: annotationMenu.editingId, filePath });
  const res = await removeAnnotation({ filePath, id: annotationMenu.editingId }).catch(() => null);
  if (res?.code !== 0) {
    message.warning('批注删除失败');
    logAnnotation('Error', 'delete annotation failed', { id: annotationMenu.editingId, response: res });
    return;
  }

  logAnnotation('Info', 'annotation deleted', { id: annotationMenu.editingId, filePath });
  hideAnnotationMenu();
  await loadCurrentAnnotations();
}

watch([content, () => route.query.filePath, () => route.query.chapterPath], () => loadCurrentAnnotations(), {
  deep: true,
  flush: 'post'
});
</script>

<style scoped>
:deep(p) {
  margin: 0;
  padding: 0;
}
:deep(img) {
  max-width: 100%;
  margin: 0 auto;
  display: block;
}

.topbar {
  .topbar__menu {
    transform: translateY(-100%);
    transition: all ease 0.3s;
  }

  &:hover {
    .topbar__menu {
      transform: translateY(0);
    }
  }
}

#text-container {
  /* font-family: var(--font); */
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: var(--line-height);
}

.center-row {
  margin-bottom: calc(var(--section-spacing) * 1px);
  font-weight: var(--font-weight);
  opacity: var(--text-opacity);
}

.annotation-menu {
  position: absolute;
  z-index: 20;
  min-width: 190px;
  border: 1px solid var(--vscode-editorWidget-border);
  border-radius: 6px;
  background: var(--vscode-editorWidget-background);
  box-shadow: 0 4px 16px rgb(0 0 0 / 22%);
  padding: 8px;
  text-indent: 0;
}

.annotation-menu__colors {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.annotation-menu__swatch {
  width: 18px;
  height: 18px;
  border: 1px solid var(--vscode-editorWidget-border);
  border-radius: 50%;
  cursor: pointer;
}

.annotation-menu__swatch--active {
  outline: 2px solid var(--vscode-focusBorder);
  outline-offset: 1px;
}

.annotation-menu__swatch--yellow {
  background: #f2c94c;
}

.annotation-menu__swatch--green {
  background: #6fcf97;
}

.annotation-menu__swatch--blue {
  background: #56ccf2;
}

.annotation-menu__swatch--pink {
  background: #ff8fb3;
}

.annotation-menu__swatch--purple {
  background: #bb9af7;
}

.annotation-menu__note {
  width: 100%;
  resize: vertical;
  border: 1px solid var(--vscode-input-border);
  background: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  font-size: 12px;
  line-height: 1.4;
  outline: none;
  padding: 4px 6px;
}

.annotation-menu__actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 6px;
}

.annotation-menu__button {
  border: 1px solid var(--vscode-button-border, transparent);
  border-radius: 4px;
  background: var(--vscode-button-background);
  color: var(--vscode-button-foreground);
  cursor: pointer;
  font-size: 12px;
  line-height: 1.4;
  padding: 2px 8px;
}

.annotation-hover {
  position: absolute;
  z-index: 19;
  width: min(320px, calc(100% - 16px));
  border: 1px solid var(--vscode-editorWidget-border);
  border-radius: 6px;
  background: var(--vscode-editorWidget-background);
  box-shadow: 0 4px 16px rgb(0 0 0 / 22%);
  color: var(--vscode-editorWidget-foreground);
  font-size: 12px;
  line-height: 1.45;
  padding: 8px;
  pointer-events: none;
  text-indent: 0;
}

.annotation-hover__header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.annotation-hover__swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex: none;
}

.annotation-hover__swatch--yellow {
  background: #f2c94c;
}

.annotation-hover__swatch--green {
  background: #6fcf97;
}

.annotation-hover__swatch--blue {
  background: #56ccf2;
}

.annotation-hover__swatch--pink {
  background: #ff8fb3;
}

.annotation-hover__swatch--purple {
  background: #bb9af7;
}

.annotation-hover__title {
  overflow: hidden;
  color: var(--vscode-descriptionForeground);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.annotation-hover__quote {
  max-height: 72px;
  overflow: hidden;
  margin-bottom: 6px;
}

.annotation-hover__note {
  border-top: 1px solid var(--vscode-editorWidget-border);
  color: var(--vscode-foreground);
  padding-top: 6px;
  white-space: pre-wrap;
  word-break: break-word;
}

.annotation-hover__empty {
  border-top: 1px solid var(--vscode-editorWidget-border);
  color: var(--vscode-descriptionForeground);
  padding-top: 6px;
}

:deep(.ar-annotation) {
  border-radius: 2px;
  cursor: pointer;
}

:deep(.ar-annotation--yellow) {
  background: rgb(242 201 76 / 45%);
}

:deep(.ar-annotation--green) {
  background: rgb(111 207 151 / 38%);
}

:deep(.ar-annotation--blue) {
  background: rgb(86 204 242 / 38%);
}

:deep(.ar-annotation--pink) {
  background: rgb(255 143 179 / 40%);
}

:deep(.ar-annotation--purple) {
  background: rgb(187 154 247 / 38%);
}
</style>
