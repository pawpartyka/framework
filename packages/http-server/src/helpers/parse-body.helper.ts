import * as coBody from 'co-body';
import * as formidable from 'formidable';
import * as http from 'http';
import * as typeis from 'type-is';
import { File } from '../interfaces/file.interface';

function mapFile(file: formidable.File): File {
  return {
    hash: file.hash,
    lastModifiedDate: file.lastModifiedDate,
    name: file.name,
    path: file.path,
    size: file.size,
    type: file.type,
  };
}

export async function parseBody(req: http.IncomingMessage): Promise<any> {
  if (typeis(req, ['multipart/form-data'])) {
    return new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();

      form.multiples = true;

      form.parse(req, (error, fields, files) => {
        if (error) {
          return reject(error);
        }

        return resolve({
          ...fields,
          ...Object
            .keys(files)
            .reduce((previous, it) => {
              const file = files[it];

              return { ...previous, [it]: Array.isArray(file) ? file.map(mapFile) : mapFile(file) };
            }, {}),
        });
      });
    });
  }

  return await coBody(req, {
    formTypes: [
      'application/x-www-form-urlencoded',
    ],
    textTypes: [
      'text/html',
      'text/plain',
      'text/xml',
      'application/xml',
    ],
    jsonTypes: [
      'application/json',
      'application/json-patch+json',
      'application/vnd.api+json',
      'application/csp-report',
    ],
  });
}
