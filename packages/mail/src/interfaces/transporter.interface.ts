// tslint:disable:max-line-length
// tslint:disable:no-namespace
import { Readable } from 'stream';
import { Url } from 'url';

declare namespace DKIM {
  interface OptionalOptions {
    /** optional location for cached messages. If not set then caching is not used. */
    cacheDir?: string | false;
    /** optional size in bytes, if message is larger than this treshold it gets cached to disk (assuming cacheDir is set and writable). Defaults to 131072 (128 kB). */
    cacheTreshold?: number;
    /** optional algorithm for the body hash, defaults to ‘sha256’ */
    hashAlgo?: string;
    /** an optional colon separated list of header keys to sign (eg. message-id:date:from:to...') */
    headerFieldNames?: string;
    /** optional colon separated list of header keys not to sign. This is useful if you want to sign all the relevant keys but your provider changes some values, ie Message-ID and Date. In this case you should use 'message-id:date' to prevent signing these values. */
    skipFields?: string;
  }

  interface SingleKeyOptions extends OptionalOptions {
    /** is the domain name to use in the signature */
    domainName: string;
    /** is the DKIM key selector */
    keySelector: string;
    /** is the private key for the selector in PEM format */
    privateKey: string | { key: string; passphrase: string };
  }

  interface MultipleKeysOptions extends OptionalOptions {
    /** is an optional array of key objects (domainName, keySelector, privateKey) if you want to add more than one signature to the message. If this value is set then the default key values are ignored */
    keys: SingleKeyOptions[];
  }

  type Options = SingleKeyOptions | MultipleKeysOptions;
}

declare namespace MimeNode {
  interface Envelope {
    /** includes an address object or is set to false */
    from: string | false;
    /** includes an array of address objects */
    to: string[];
  }
}

export interface Address {
  name: string;
  address: string;
}

export interface AttachmentLike {
  /** String, Buffer or a Stream contents for the attachmentent */
  content?: string | Buffer | Readable;
  /** path to a file or an URL (data uris are allowed as well) if you want to stream the file instead of including it (better for larger attachments) */
  path?: string | Url;
}

export interface AmpAttachment extends AttachmentLike {
  /** is an alternative for content to load the AMP4EMAIL data from an URL */
  href?: string;
  /** defines optional content encoding, eg. ‘base64’ or ‘hex’. This only applies if the content is a string. By default an unicode string is assumed. */
  encoding?: string;
  /** optional content type for the attachment, if not set will be derived from the filename property */
  contentType?: string;
  /** an optional value that overrides entire node content in the mime message. If used then all other options set for this node are ignored. */
  raw?: string | Buffer | Readable | AttachmentLike;
}

export interface IcalAttachment extends AttachmentLike {
  /** optional method, case insensitive, defaults to ‘publish’. Other possible values would be ‘request’, ‘reply’, ‘cancel’ or any other valid calendar method listed in RFC5546. This should match the METHOD: value in calendar event file. */
  method?: string;
  /** optional filename, defaults to ‘invite.ics’ */
  filename?: string | false;
  /** is an alternative for content to load the calendar data from an URL */
  href?: string;
  /** defines optional content encoding, eg. ‘base64’ or ‘hex’. This only applies if the content is a string. By default an unicode string is assumed. */
  encoding?: string;
}

export interface Attachment extends AttachmentLike {
  /** filename to be reported as the name of the attached file, use of unicode is allowed. If you do not want to use a filename, set this value as false, otherwise a filename is generated automatically */
  filename?: string | false;
  /** optional content id for using inline images in HTML message source. Using cid sets the default contentDisposition to 'inline' and moves the attachment into a multipart/related mime node, so use it only if you actually want to use this attachment as an embedded image */
  cid?: string;
  /** If set and content is string, then encodes the content to a Buffer using the specified encoding. Example values: base64, hex, binary etc. Useful if you want to use binary attachments in a JSON formatted e-mail object */
  encoding?: string;
  /** optional content type for the attachment, if not set will be derived from the filename property */
  contentType?: string;
  /** optional transfer encoding for the attachment, if not set it will be derived from the contentType property. Example values: quoted-printable, base64. If it is unset then base64 encoding is used for the attachment. If it is set to false then previous default applies (base64 for most, 7bit for text). */
  contentTransferEncoding?: '7bit' | 'base64' | 'quoted-printable' | false;
  /** optional content disposition type for the attachment, defaults to ‘attachment’ */
  contentDisposition?: 'attachment' | 'inline';
  /** is an object of additional headers */
  headers?: Headers;
  /** an optional value that overrides entire node content in the mime message. If used then all other options set for this node are ignored. */
  raw?: string | Buffer | Readable | AttachmentLike;
}

export interface Envelope {
  /** the first address gets used as MAIL FROM address in SMTP */
  from?: string;
  /** addresses from this value get added to RCPT TO list */
  to?: string;
  /** addresses from this value get added to RCPT TO list */
  cc?: string;
  /** addresses from this value get added to RCPT TO list */
  bcc?: string;
}

export interface Transporter {
  sendMail(options: SendMailOptions): Promise<void>;
}

export interface SendMailOptions {
  /** The e-mail address of the sender. All e-mail addresses can be plain 'sender@server.com' or formatted 'Sender Name <sender@server.com>' */
  from?: string | Address;
  /** An e-mail address that will appear on the Sender: field */
  sender?: string | Address;
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the To: field */
  to?: string | Address | Array<string | Address>;
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the Cc: field */
  cc?: string | Address | Array<string | Address>;
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the Bcc: field */
  bcc?: string | Address | Array<string | Address>;
  /** An e-mail address that will appear on the Reply-To: field */
  replyTo?: string | Address;
  /** The message-id this message is replying */
  inReplyTo?: string | Address;
  /** Message-id list (an array or space separated string) */
  references?: string | string[];
  /** The subject of the e-mail */
  subject?: string;
  /** The plaintext version of the message */
  text?: string | Buffer | Readable | AttachmentLike;
  /** The HTML version of the message */
  html?: string | Buffer | Readable | AttachmentLike;
  /** Apple Watch specific HTML version of the message, same usage as with text and html */
  watchHtml?: string | Buffer | Readable | AttachmentLike;
  /** AMP4EMAIL specific HTML version of the message, same usage as with text and html. Make sure it is a full and valid AMP4EMAIL document, otherwise the displaying email client falls back to html and ignores the amp part */
  amp?: string | Buffer | Readable | AmpAttachment;
  /** iCalendar event, same usage as with text and html. Event method attribute defaults to ‘PUBLISH’ or define it yourself: {method: 'REQUEST', content: iCalString}. This value is added as an additional alternative to html or text. Only utf-8 content is allowed */
  icalEvent?: string | Buffer | Readable | IcalAttachment;
  /** An object or array of additional header fields */
  headers?: Headers;
  /** An object where key names are converted into list headers. List key help becomes List-Help header etc. */
  list?: ListHeaders;
  /** An array of attachment objects */
  attachments?: Attachment[];
  /** An array of alternative text contents (in addition to text and html parts) */
  alternatives?: Attachment[];
  /** optional SMTP envelope, if auto generated envelope is not suitable */
  envelope?: Envelope | MimeNode.Envelope;
  /** optional Message-Id value, random value will be generated if not set */
  messageId?: string;
  /** optional Date value, current UTC string will be used if not set */
  date?: Date | string;
  /** optional transfer encoding for the textual parts */
  encoding?: string;
  /** if set then overwrites entire message output with this value. The value is not parsed, so you should still set address headers or the envelope value for the message to work */
  raw?: string | Buffer | Readable | AttachmentLike;
  /** set explicitly which encoding to use for text parts (quoted-printable or base64). If not set then encoding is detected from text content (mostly ascii means quoted-printable, otherwise base64) */
  textEncoding?: TextEncoding;
  /** if set to true then fails with an error when a node tries to load content from URL */
  disableUrlAccess?: boolean;
  /** if set to true then fails with an error when a node tries to load content from a file */
  disableFileAccess?: boolean;
  /** is an object with DKIM options */
  dkim?: DKIM.Options;
  priority?: 'high'|'normal'|'low';
  /** method to normalize header keys for custom caseing */
  normalizeHeaderKey?(key: string): string;
}

export type Headers = { [key: string]: string | string[] | { prepared: boolean, value: string } } | Array<{ key: string, value: string }>;

export type ListHeader = string | { url: string, comment: string };

export type TextEncoding = 'quoted-printable' | 'base64';

export interface ListHeaders {
  [key: string]: ListHeader | ListHeader[] | ListHeader[][];
}
