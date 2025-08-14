/**
 * fork: https://github.com/julien-c/epub
 */

import { EventEmitter } from 'events';
import { join, dirname } from 'path';
import { defaults as xml2js, processors, Parser } from 'xml2js';
import AdmZip from 'adm-zip';
import { fromByteArray } from 'base64-js';

const xml2jsOptions = xml2js['0.1'];
xml2jsOptions.tagNameProcessors = [processors.stripPrefix];
xml2jsOptions.attrNameProcessors = [processors.stripPrefix];

class Zip {
  admZip: AdmZip;
  names: any;

  constructor(filename: string) {
    this.admZip = new AdmZip(filename);
    this.names = this.admZip.getEntries().map((zipEntry) => {
      return zipEntry.entryName;
    });
  }

  readFile(name: string): Buffer | null {
    const buffer = this.admZip.readFile(this.admZip.getEntry(name) as AdmZip.IZipEntry);
    return buffer;
  }
}

// TODO: Cache parsed data

/**
 *  new EPub(fname[, imageroot][, linkroot])
 *  - fname (String): filename for the ebook
 *  - imageroot (String): URL prefix for images
 *  - linkroot (String): URL prefix for links
 *
 *  Creates an Event Emitter type object for parsing epub files
 *
 *      var epub = new EPub("book.epub");
 *      epub.on("end", function () {
 *           console.log(epub.spine);
 *      });
 *      epub.on("error", function (error) { ... });
 *      epub.parse();
 *
 *  Image and link URL format is:
 *
 *      imageroot + img_id + img_zip_path
 *
 *  So an image "logo.jpg" which resides in "OPT/" in the zip archive
 *  and is listed in the manifest with id "logo_img" will have the
 *  following url (providing that imageroot is "/images/"):
 *
 *      /images/logo_img/OPT/logo.jpg
 **/
class EPub extends EventEmitter {
  filename: string;
  imageroot: string;
  linkroot: string;
  containerFile!: string;
  mimeFile!: string;
  rootFile!: string;
  metadata!: {
    publisher: string;
    language: string;
    UUID: string;
    ISBN: string;
    date: string;
    creatorFileAs: string;
    creator: string;
    description: string;
    subject: string;
    title: string;
    [key: string]: string;
  };
  manifest!: any;
  guide!: any[];
  spine!: { toc: any; contents: any[] };
  flow!: any[];
  toc!: any[];
  zip!: Zip;
  version: any;

  constructor(fname: string, imageroot?: string, linkroot?: string) {
    super();

    this.filename = fname;

    this.imageroot = (imageroot || '/images/').trim();
    this.linkroot = (linkroot || '/links/').trim();

    if (this.imageroot.substr(-1) != '/') this.imageroot += '/';

    if (this.linkroot.substr(-1) != '/') this.linkroot += '/';
  }

  /**
   *  EPub#parse(options) -> undefined
   *  - options (object): An optional options object to override xml2jsOptions
   *  Starts the parser, needs to be called by the script
   **/
  parse(options: { xml2jsOptions: any } = { xml2jsOptions: xml2jsOptions }) {
    Object.assign(xml2jsOptions, options.xml2jsOptions);

    this.containerFile = '';
    this.mimeFile = '';
    this.rootFile = '';

    this.metadata = {
      publisher: '',
      language: '',
      UUID: '',
      ISBN: '',
      date: '',
      creatorFileAs: '',
      creator: '',
      description: '',
      subject: '',
      title: ''
    };
    this.manifest = {};
    this.guide = [];
    this.spine = { toc: null, contents: [] };
    this.flow = [];
    this.toc = [];

    this.open();
  }

  /**
   *  EPub#open() -> undefined
   *
   *  Opens the epub file with Zip unpacker, retrieves file listing
   *  and runs mime type check
   **/
  open() {
    try {
      this.zip = new Zip(this.filename);
    } catch (E) {
      this.emit('error', new Error('Invalid/missing file'));
      return;
    }

    if (!this.zip.names || !this.zip.names.length) {
      this.emit('error', new Error('No files in archive'));
      return;
    }

    this.checkMimeType();
  }

  /**
   *  EPub#checkMimeType() -> undefined
   *
   *  Checks if there's a file called "mimetype" and that it's contents
   *  are "application/epub+zip". On success runs root file check.
   **/
  checkMimeType() {
    let i, len;

    for (i = 0, len = this.zip.names.length; i < len; i++) {
      if (this.zip.names[i].toLowerCase() == 'mimetype') {
        this.mimeFile = this.zip.names[i];
        break;
      }
    }
    if (!this.mimeFile) {
      this.emit('error', new Error('No mimetype file in archive'));
      return;
    }
    const data = this.zip.readFile(this.mimeFile);
    if (!data) {
      this.emit('error', new Error('readFile'));
      return;
    }
    const txt = data.toString('utf-8').toLowerCase().trim();
    if (txt != 'application/epub+zip') {
      this.emit('error', new Error('Unsupported mime type'));
      return;
    }
    this.getRootFiles();
  }

  /**
   *  EPub#getRootFiles() -> undefined
   *
   *  Looks for a "meta-inf/container.xml" file and searches for a
   *  rootfile element with mime type "application/oebps-package+xml".
   *  On success calls the rootfile parser
   **/
  getRootFiles() {
    let i, len;
    for (i = 0, len = this.zip.names.length; i < len; i++) {
      if (this.zip.names[i].toLowerCase() == 'meta-inf/container.xml') {
        this.containerFile = this.zip.names[i];
        break;
      }
    }
    if (!this.containerFile) {
      this.emit('error', new Error('No container file in archive'));
      return;
    }

    const data = this.zip.readFile(this.containerFile);
    if (!data) {
      this.emit('error', new Error('Reading archive failed'));
      return;
    }
    const xml = data.toString('utf-8').toLowerCase().trim();
    const xmlparser = new Parser(xml2jsOptions);

    xmlparser.on('end', (result) => {
      if (!result.rootfiles || !result.rootfiles.rootfile) {
        this.emit('error', new Error('No rootfiles found'));
        console.dir(result);
        return;
      }

      const rootfile = result.rootfiles.rootfile;
      let filename = false;
      let i;
      let len;

      if (Array.isArray(rootfile)) {
        for (i = 0, len = rootfile.length; i < len; i++) {
          if (rootfile[i]['@']['media-type'] && rootfile[i]['@']['media-type'] == 'application/oebps-package+xml' && rootfile[i]['@']['full-path']) {
            filename = rootfile[i]['@']['full-path'].toLowerCase().trim();
            break;
          }
        }
      } else if (rootfile['@']) {
        if (rootfile['@']['media-type'] != 'application/oebps-package+xml' || !rootfile['@']['full-path']) {
          this.emit('error', new Error('Rootfile in unknown format'));
          return;
        }
        filename = rootfile['@']['full-path'].toLowerCase().trim();
      }

      if (!filename) {
        this.emit('error', new Error('Empty rootfile'));
        return;
      }

      for (i = 0, len = this.zip.names.length; i < len; i++) {
        if (this.zip.names[i].toLowerCase() == filename) {
          this.rootFile = this.zip.names[i];
          break;
        }
      }

      if (!this.rootFile) {
        this.emit('error', new Error('Rootfile not found from archive'));
        return;
      }

      this.handleRootFile();
    });

    xmlparser.on('error', (err) => {
      this.emit('error', new Error(`Parsing container XML failed in getRootFiles: ${err.message}`));
    });

    xmlparser.parseString(xml);
  }

  /**
   *  EPub#handleRootFile() -> undefined
   *
   *  Parses the rootfile XML and calls rootfile parser
   **/
  handleRootFile() {
    const data = this.zip.readFile(this.rootFile);
    if (!data) {
      this.emit('error', new Error('Reading archive failed'));
      return;
    }
    const xml = data.toString('utf-8');
    const xmlparser = new Parser(xml2jsOptions);

    xmlparser.on('end', this.parseRootFile.bind(this));

    xmlparser.on('error', (err) => {
      this.emit('error', new Error(`Parsing container XML failed in handleRootFile: ${err.message}`));
    });

    xmlparser.parseString(xml);
  }

  /**
   *  EPub#parseRootFile() -> undefined
   *
   *  Parses elements "metadata," "manifest," "spine" and TOC.
   *  Emits "end" if no TOC
   **/
  parseRootFile(rootfile: any) {
    this.version = rootfile['@'].version || '2.0';

    let i, len, keyparts, key;
    const keys = Object.keys(rootfile);
    for (i = 0, len = keys.length; i < len; i++) {
      keyparts = keys[i].split(':');
      key = (keyparts.pop() || '').toLowerCase().trim();
      switch (key) {
        case 'metadata':
          this.parseMetadata(rootfile[keys[i]]);
          break;
        case 'manifest':
          this.parseManifest(rootfile[keys[i]]);
          break;
        case 'spine':
          this.parseSpine(rootfile[keys[i]]);
          break;
        case 'guide':
          this.parseGuide(rootfile[keys[i]]);
          break;
      }
    }

    if (this.spine.toc) this.parseTOC();
    else this.emit('end');
  }

  /**
   *  EPub#parseMetadata() -> undefined
   *
   *  Parses "metadata" block (book metadata, title, author etc.)
   **/
  parseMetadata(metadata: any) {
    let i, j, len, keyparts, key;

    const keys = Object.keys(metadata);
    for (i = 0, len = keys.length; i < len; i++) {
      keyparts = keys[i].split(':');
      key = (keyparts.pop() || '').toLowerCase().trim();
      switch (key) {
        case 'publisher':
          if (Array.isArray(metadata[keys[i]]))
            this.metadata.publisher = String((metadata[keys[i]][0] && metadata[keys[i]][0]['#']) || metadata[keys[i]][0] || '').trim();
          else this.metadata.publisher = String(metadata[keys[i]]['#'] || metadata[keys[i]] || '').trim();

          break;
        case 'language':
          if (Array.isArray(metadata[keys[i]]))
            this.metadata.language = String((metadata[keys[i]][0] && metadata[keys[i]][0]['#']) || metadata[keys[i]][0] || '')
              .toLowerCase()
              .trim();
          else
            this.metadata.language = String(metadata[keys[i]]['#'] || metadata[keys[i]] || '')
              .toLowerCase()
              .trim();

          break;
        case 'title':
          if (Array.isArray(metadata[keys[i]]))
            this.metadata.title = String((metadata[keys[i]][0] && metadata[keys[i]][0]['#']) || metadata[keys[i]][0] || '').trim();
          else this.metadata.title = String(metadata[keys[i]]['#'] || metadata[keys[i]] || '').trim();

          break;
        case 'subject':
          if (Array.isArray(metadata[keys[i]]))
            this.metadata.subject = String((metadata[keys[i]][0] && metadata[keys[i]][0]['#']) || metadata[keys[i]][0] || '').trim();
          else this.metadata.subject = String(metadata[keys[i]]['#'] || metadata[keys[i]] || '').trim();

          break;
        case 'description':
          if (Array.isArray(metadata[keys[i]]))
            this.metadata.description = String((metadata[keys[i]][0] && metadata[keys[i]][0]['#']) || metadata[keys[i]][0] || '').trim();
          else this.metadata.description = String(metadata[keys[i]]['#'] || metadata[keys[i]] || '').trim();

          break;
        case 'creator':
          if (Array.isArray(metadata[keys[i]])) {
            this.metadata.creator = String((metadata[keys[i]][0] && metadata[keys[i]][0]['#']) || metadata[keys[i]][0] || '').trim();
            this.metadata.creatorFileAs = String(
              (metadata[keys[i]][0] && metadata[keys[i]][0]['@'] && metadata[keys[i]][0]['@']['file-as']) || this.metadata.creator
            ).trim();
          } else {
            this.metadata.creator = String(metadata[keys[i]]['#'] || metadata[keys[i]] || '').trim();
            this.metadata.creatorFileAs = String((metadata[keys[i]]['@'] && metadata[keys[i]]['@']['file-as']) || this.metadata.creator).trim();
          }
          break;
        case 'date':
          if (Array.isArray(metadata[keys[i]]))
            this.metadata.date = String((metadata[keys[i]][0] && metadata[keys[i]][0]['#']) || metadata[keys[i]][0] || '').trim();
          else this.metadata.date = String(metadata[keys[i]]['#'] || metadata[keys[i]] || '').trim();

          break;
        case 'identifier':
          if (metadata[keys[i]]['@'] && metadata[keys[i]]['@']['scheme'] == 'ISBN') {
            this.metadata.ISBN = String(metadata[keys[i]]['#'] || '').trim();
          } else if (metadata[keys[i]]['@'] && metadata[keys[i]]['@'].id && metadata[keys[i]]['@'].id.match(/uuid/i)) {
            this.metadata.UUID = String(metadata[keys[i]]['#'] || '')
              .replace('urn:uuid:', '')
              .toUpperCase()
              .trim();
          } else if (Array.isArray(metadata[keys[i]])) {
            for (j = 0; j < metadata[keys[i]].length; j++) {
              if (metadata[keys[i]][j]['@']) {
                if (metadata[keys[i]][j]['@']['scheme'] == 'ISBN') this.metadata.ISBN = String(metadata[keys[i]][j]['#'] || '').trim();
                else if (metadata[keys[i]][j]['@'].id && metadata[keys[i]][j]['@'].id.match(/uuid/i))
                  this.metadata.UUID = String(metadata[keys[i]][j]['#'] || '')
                    .replace('urn:uuid:', '')
                    .toUpperCase()
                    .trim();
              }
            }
          }
          break;
      }
    }

    const metas = metadata.meta || {};
    Object.keys(metas).forEach((key) => {
      const meta = metas[key];
      if (meta['@'] && meta['@'].name) {
        const name = meta['@'].name;
        this.metadata[name] = meta['@'].content;
      }
      if (meta['#'] && meta['@'].property) this.metadata[meta['@'].property] = meta['#'];

      if (meta.name && meta.name == 'cover') this.metadata[meta.name] = meta.content;
    }, this);
  }

  /**
   *  EPub#parseManifest() -> undefined
   *
   *  Parses "manifest" block (all items included, html files, images, styles)
   **/
  parseManifest(manifest: any) {
    let i;
    let len;
    const path = this.rootFile.split('/');
    let element;
    path.pop();
    const path_str = path.join('/');

    if (manifest.item) {
      for (i = 0, len = manifest.item.length; i < len; i++) {
        if (manifest.item[i]['@']) {
          element = manifest.item[i]['@'];

          if (element.href && element.href.substr(0, path_str.length) != path_str) element.href = path.concat([element.href]).join('/');

          this.manifest[manifest.item[i]['@'].id] = element;
        }
      }
    }
  }

  /**
   *  EPub#parseGuide() -> undefined
   *
   *  Parses "guide" block (locations of the fundamental structural components of the publication)
   **/
  parseGuide(guide: any) {
    let i;
    let len;
    const path = this.rootFile.split('/');
    let element;
    path.pop();
    const path_str = path.join('/');

    if (guide.reference) {
      if (!Array.isArray(guide.reference)) guide.reference = [guide.reference];

      for (i = 0, len = guide.reference.length; i < len; i++) {
        if (guide.reference[i]['@']) {
          element = guide.reference[i]['@'];

          if (element.href && element.href.substr(0, path_str.length) != path_str) element.href = path.concat([element.href]).join('/');

          this.guide.push(element);
        }
      }
    }
  }

  /**
   *  EPub#parseSpine() -> undefined
   *
   *  Parses "spine" block (all html elements that are shown to the reader)
   **/
  parseSpine(spine: any) {
    let i;
    let len;
    const path = this.rootFile.split('/');
    let element;
    path.pop();

    if (spine['@'] && spine['@'].toc) this.spine.toc = this.manifest[spine['@'].toc] || false;

    if (spine.itemref) {
      if (!Array.isArray(spine.itemref)) spine.itemref = [spine.itemref];

      for (i = 0, len = spine.itemref.length; i < len; i++) {
        if (spine.itemref[i]['@']) {
          if ((element = this.manifest[spine.itemref[i]['@'].idref])) this.spine.contents.push(element);
        }
      }
    }
    this.flow = this.spine.contents;
  }

  /**
   *  EPub#parseTOC() -> undefined
   *
   *  Parses ncx file for table of contents (title, html file)
   **/
  parseTOC() {
    let i;
    let len;
    const path = this.spine.toc.href.split('/');
    const id_list: any = {};
    path.pop();

    const keys = Object.keys(this.manifest);
    for (i = 0, len = keys.length; i < len; i++) id_list[this.manifest[keys[i]].href] = keys[i];

    const data = this.zip.readFile(this.spine.toc.href);
    if (!data) {
      this.emit('error', new Error('Reading archive failed'));
      return;
    }
    const xml = data.toString('utf-8');
    const xmlparser = new Parser(xml2jsOptions);

    xmlparser.on('end', (result) => {
      if (result.navMap && result.navMap.navPoint) this.toc = this.walkNavMap(result.navMap.navPoint, path, id_list);

      this.emit('end');
    });

    xmlparser.on('error', (err) => {
      this.emit('error', new Error(`Parsing container XML failed in TOC: ${err.message}`));
    });

    xmlparser.parseString(xml);
  }

  /**
   *  EPub#walkNavMap(branch, path, id_list,[, level]) -> Array
   *  - branch (Array | Object): NCX NavPoint object
   *  - path (Array): Base path
   *  - id_list (Object): map of file paths and id values
   *  - level (Number): deepness
   *
   *  Walks the NavMap object through all levels and finds elements
   *  for TOC
   **/
  walkNavMap(branch: any[], path: string[], id_list: any[], level = 0): any {
    level = level || 0;

    // don't go too far
    if (level > 7) return [];

    let output: any[] = [];

    if (!Array.isArray(branch)) branch = [branch];

    for (let i = 0; i < branch.length; i++) {
      if (branch[i].navLabel) {
        let title = '';
        if (branch[i].navLabel && typeof branch[i].navLabel.text == 'string') {
          title =
            (branch[i].navLabel && branch[i].navLabel.text) || (branch[i].navLabel === branch[i].navLabel && branch[i].navLabel.text.length > 0)
              ? ((branch[i].navLabel && branch[i].navLabel.text) || branch[i].navLabel || '').trim()
              : '';
        }
        let order = Number((branch[i]['@'] && branch[i]['@'].playOrder) || 0);
        if (isNaN(order)) order = 0;

        let href = '';
        if (branch[i].content && branch[i].content['@'] && typeof branch[i].content['@'].src == 'string') href = branch[i].content['@'].src.trim();

        let element: any = {
          level,
          order,
          title
        };

        if (href) {
          href = path.concat([href]).join('/');
          element.href = href;

          if (id_list[element.href]) {
            // link existing object
            element = this.manifest[id_list[element.href]];
            element.title = title;
            element.order = order;
            element.level = level;
          } else {
            // use new one
            element.href = href;
            element.id = ((branch[i]['@'] && branch[i]['@'].id) || '').trim();
          }

          output.push(element);
        }
      }
      if (branch[i].navPoint) output = output.concat(this.walkNavMap(branch[i].navPoint, path, id_list, level + 1));
    }
    return output;
  }

  /**
   *  EPub#getChapter(id, callback) -> undefined
   *  - id (String): Manifest id value for a chapter
   *  - callback (Function): callback function
   *
   *  Finds a chapter text for an id. Replaces image and link URL's, removes
   *  <head> etc. elements. Return only chapters with mime type application/xhtml+xml
   **/
  getChapter(id: string, callback: Function) {
    this.getChapterRaw(id, (err: any, str: any) => {
      if (err) {
        callback(err);
        return;
      }

      let i;
      let len;
      const path = this.rootFile.split('/');
      const keys = Object.keys(this.manifest);
      path.pop();
      const filePath = this.manifest[id].href; // html href

      // remove linebreaks (no multi line matches in JS regex!)
      str = str.replace(/\r?\n/g, '\u0000');

      // keep only <body> contents
      str.replace(/<body[^>]*?>(.*)<\/body[^>]*?>/i, (o: any, d: string) => {
        str = d.trim();
      });

      // remove <script> blocks if any
      str = str.replace(/<script[^>]*?>(.*?)<\/script[^>]*?>/gi, () => {
        return '';
      });

      // remove <style> blocks if any
      str = str.replace(/<style[^>]*?>(.*?)<\/style[^>]*?>/gi, () => {
        return '';
      });

      // remove onEvent handlers
      str = str.replace(/(\s)(on\w+)(\s*=\s*["']?[^"'\s>]*?["'\s>])/g, (o: any, a: any, b: any, c: any) => {
        return `${a}skip-${b}${c}`;
      });

      // replace images
      str = str.replace(/(\ssrc\s*=\s*["']?)([^"'\s>]*?)(["'\s>])/g, (o: any, a: string, b: string, c: any) => {
        const imgPath = join(dirname(filePath), b).replace(/\\/g, '/');
        try {
          const src = 'data:image/png;base64,' + fromByteArray(this.zip.readFile(imgPath) as unknown as Uint8Array);
          return `${a}${src}${c}`;
        } catch (error) {
          console.warn(error);
        }
        return '';
      });

      // replace links
      str = str.replace(/(\shref\s*=\s*["']?)([^"'\s>]*?)(["'\s>])/g, (o: any, a: string, b: string, c: any) => {
        const linkparts = (b || '').split('#');
        let link = linkparts.length
          ? path
              .concat([linkparts.shift() || ''])
              .join('/')
              .trim()
          : '';
        let element;

        for (i = 0, len = keys.length; i < len; i++) {
          if (this.manifest[keys[i]].href.split('#')[0] == link) {
            element = this.manifest[keys[i]];
            break;
          }
        }

        if (linkparts.length) link += `#${linkparts.join('#')}`;

        // include only images from manifest
        if (element) return `${a + this.linkroot + element.id}/${link}${c}`;
        else return a + b + c;
      });

      // bring back linebreaks
      // eslint-disable-next-line no-control-regex
      str = str.replace(/\u0000/g, '\n').trim();

      callback(null, str);
    });
  }

  /**
   *  EPub#getChapterRaw(id, callback) -> undefined
   *  - id (String): Manifest id value for a chapter
   *  - callback (Function): callback function
   *
   *  Returns the raw chapter text for an id.
   **/
  getChapterRaw(id: string, callback: Function) {
    if (this.manifest[id]) {
      if (!(this.manifest[id]['media-type'] == 'application/xhtml+xml' || this.manifest[id]['media-type'] == 'image/svg+xml'))
        return callback(new Error('Invalid mime type for chapter'));

      const data = this.zip.readFile(this.manifest[id].href);
      if (!data) {
        callback(new Error('Reading archive failed'));
        return;
      }

      let str = '';
      if (data) str = data.toString('utf-8');
      callback(null, str);
    } else {
      callback(new Error('File not found'));
    }
  }

  /**
   *  EPub#getImage(id, callback) -> undefined
   *  - id (String): Manifest id value for an image
   *  - callback (Function): callback function
   *
   *  Finds an image for an id. Returns the image as Buffer. Callback gets
   *  an error object, image buffer and image content-type.
   *  Return only images with mime type image
   **/
  getImage(id: string, callback: Function) {
    if (this.manifest[id]) {
      if ((this.manifest[id]['media-type'] || '').toLowerCase().trim().substr(0, 6) != 'image/')
        return callback(new Error('Invalid mime type for image'));

      this.getFile(id, callback);
    } else {
      callback(new Error('File not found'));
    }
  }

  /**
   *  EPub#getFile(id, callback) -> undefined
   *  - id (String): Manifest id value for a file
   *  - callback (Function): callback function
   *
   *  Finds a file for an id. Returns the file as Buffer. Callback gets
   *  an error object, file contents buffer and file content-type.
   **/
  getFile(id: string, callback: Function) {
    if (this.manifest[id]) {
      const data = this.zip.readFile(this.manifest[id].href);
      if (!data) {
        callback(new Error('Reading archive failed'));
        return;
      }
      callback(null, data, this.manifest[id]['media-type']);
    } else {
      callback(new Error('File not found'));
    }
  }

  /**
   *  EPub#hasDRM() -> boolean
   *
   *  Parses the tree to see if there's an ecnryption file, signifying the presence of DRM
   *  see: https://stackoverflow.com/questions/14442968/how-to-check-if-an-epub-file-is-drm-protected
   **/
  hasDRM() {
    const drmFile = 'META-INF/encryption.xml';
    return this.zip.names.includes(drmFile);
  }
}

export default EPub;
