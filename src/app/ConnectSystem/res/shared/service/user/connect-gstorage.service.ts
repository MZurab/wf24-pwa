import {Injectable} from '@angular/core';
// import {HttpClient} from '@angular/common/http';
// import {ConnectUserLibrary} from './connect-user.library';

//< - firestore
import {Observer, Observable} from 'rxjs';
import {AngularFireStorage} from 'angularfire2/storage';
import {ConnectLibrary} from '../freeform/_sub/connect.library';
import {DomSanitizer} from '@angular/platform-browser';
import {FirebaseApp} from 'angularfire2';
//> - firestore

@Injectable()
export class ConnectGstorageService {

  connect = new ConnectLibrary();

  constructor (
    // private http: HttpClient,
    private fstorage: AngularFireStorage,
    private sanitizer: DomSanitizer,
    private firebase: FirebaseApp
  ) {

  }
  arrWithMimeTypes = {
    //images
      'image/jpeg'    : 'jpg',
      'image/png'     : 'png',
      'image/gif'     : 'gif',
      'image/bmp'     : 'bmp',
      'image/webp'    : 'webp',
      'image/svg+xml' : 'svg',
      'image/svg'     : 'svg',
    //audio
      'audio/midi'    : 'midi',
      'audio/mpeg'    : 'mpeg',
      'audio/webm'    : 'webm',
      'audio/ogg'     : 'ogg',
      'audio/wav'     : 'wav',
      'audio/mp3'     : 'mp3',

    // video
      'video/webm'    : 'webm',
      'video/ogg'     : 'ogg',
      'video/mp4'     : 'mp4',

    // text
      'text/plain'    : 'txt',
      'text/html'     : 'html',
      'text/css'      : 'css',
      'text/javascript': 'js',

    // documents
      'application/pdf': 'pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx'
  };

  arrWithTypes = {
    'image'   : ['jpg', 'png', 'gif', 'bmp', 'webp', 'svg', 'jpeg'],
    'audio'   : ['mp3', 'wav', 'ogg', 'webm', 'mpeg', 'midi'],
    'video'   : ['webm', 'ogg', 'mp4'],
    'text'    : ['txt', 'html', 'css', 'js'],
    'document': ['docx', 'doc', 'xlsx', 'xls', 'csv'],
  };

  getFileType (iNfileUrl, iNfileExt = null) {
    //@disc - get file type
    const fileUrl     = iNfileUrl,
          fExt        = (iNfileExt) ? iNfileExt.toLocaleLowerCase() : this.getFileExtensionByFileName( fileUrl);

    for ( const groupKey of Object.keys(this.arrWithTypes) ) {
      const group   = this.arrWithTypes[groupKey];
      if ( group.indexOf(fExt) !== -1 ) {
        // we found this extension in this group -> return right icon
        switch (groupKey) {

          case 'image':
            return 'image';

          case 'video':
            return 'video';

          case 'audio':
            return 'audio';

          case 'text':
            return 'text';

          case 'document':
            return 'document';
        }
      }
    }
    //@
      return 'unknown';
  }

  // getUrlByByPath (iNpath, iNfield) {
  //   let path      = iNpath,
  //       field     = iNfield,
  //       settings  = this.getSettingsByPath(path, field);
  //   //get settings
  //   if (settings) {
  //
  //   }
  // }

  getSettingsByPath (iNpath, iNfield) {
    console.log('getSettingsByPath - iNpath, iNfield', iNpath, iNfield);
    const path      = iNpath,
          field     = iNfield,
          payload   = field['body']['payload'],
          settings  = payload['settings'] ,
          fileType  = this.getFileType(path);

    //get file type
      if ( settings && settings[fileType] ) {
        // we have settings for this type
        return settings[fileType];
      } else if (settings && settings['*']) {
        // we have not settings for file type -> get all
        return settings['*'];
      }

    return null;
  }


  getStorageTypeByFileSetting (iNfileSetting: object) {
    const fileSetting = iNfileSetting;

    return (fileSetting && fileSetting['private']) ? 'private' : 'public';

  }

  getNoneIconImagePath () {
    let fFolder     = '/assets/icons/freeform',
        fileIcon    = `${fFolder}/attach-file.svg`;

    return fileIcon;
  }
  async getFileIconByUrl (iNfileUrl: string, iNfield: object, iNfileExt: null | string = null, iNisFullAdress = false) {
    let fileUrl     = iNfileUrl,//(!iNfileExt) ? iNfileUrl : `${iNfileUrl}.${iNfileExt}`,
        field       = iNfield,
        fExt        = (iNfileExt) ? iNfileExt.toLocaleLowerCase() : this.getFileExtensionByFileName( fileUrl),
        fFolder     = '/assets/icons/freeform',
        fileIcon    = this.getNoneIconImagePath(), //@default icon
        fileType    = this.getFileType(fileUrl, fExt),
        settings    = this.getSettingsByPath(fileUrl, field);
        console.log('getFileIconByUrl 1 - fileType, fileUrl ', fileType, fileUrl, 'fExt, iNfileExt', fExt, iNfileExt);
    // we found this extension in this group -> return right icon
      switch (fileType) {

        case 'image':
          fileIcon =  fileUrl;
        break;

        case 'video':
          fileIcon =  `${fFolder}/video.svg`;
        break;

        case 'audio':
          fileIcon =  `${fFolder}/audio.svg`;
        break;

        case 'document':
          fileIcon =  `${fFolder}/doc.svg`;
        break;

      }
    // if we have icon -> return icon -> url to file
      if ( fileIcon === fileUrl ) {
        // we have image link -> get public or private -> return url
        const fileType = this.getStorageTypeByFileSetting(settings); //settings['file-type'];
        if ( fileType === 'private' ) {
          // we have private url -> get url via firebase
          return new Promise(
            (resolve) => {
              console.log('getFileIconByUrl 2.1 - privated');
            this.fstorage.storage.ref(fileUrl).getDownloadURL().then(
                (url) => {
                  console.log('getFileIconByUrl 3.1 - url', url );
                  resolve(url);
                }
              );
            }
          );
        } else {
          // we have public url -> add 'https://gstorage.ramman.net' to url
          return new Promise(
            (resolve) => {
              console.log('getFileIconByUrl 2.2- public', fileIcon);
              let url;
              if ( iNisFullAdress ) {
                // is full url do not change address
                url = fileIcon;
              } else {
                url = `https://gstorage.ramman.net/${fileIcon}`;
              }
              // for blob file url need use sanitizer in angular -> SOLVED user sanitizer for all url here
              resolve( this.sanitizer.bypassSecurityTrustUrl(url) );
            }
          );
        }
      } else {
        // we have icon link return url
        console.log('getFileIconByUrl 2.3- fileIcon', fileIcon);
        return new Promise((resolve) => {resolve(fileIcon); });
      }
  }

  getLocalUrlByFile (iNfile) {
    return URL.createObjectURL(iNfile);
  }
  // getSecurityTrustUrl (iNurl) {
  //   return this.sanitizer.bypassSecurityTrustUrl(iNurl);
  // }

  getFileIconByFile (iNfile: File, iNfield) {
    const file    = iNfile,
        field   = iNfield,
        fileUrl = URL.createObjectURL(iNfile),
        fileExt = this.getFileExtensionByFile(file);

    return this.getFileIconByUrl(fileUrl, field, fileExt, true);
  }

  getFileExtensionByFile (iNfile: File) {
    const file  = iNfile,
          fName = file.name,
          mType = file['type'];
    return this.getFileExtensionByFileName(fName) || this.getFileExtensionByMimeType(mType);
  }

  getFileExtensionByFileName (iNfileName: string) {
    const fileName = iNfileName.toLocaleLowerCase(),
          splitArr = fileName.split('.');

    return splitArr[ splitArr.length - 1 ];
  }

  getFileExtensionByMimeType (iNfileType: string) {
    return this.arrWithMimeTypes[iNfileType];
  }

  generateFileId () {
    return this.connect.getUuid();
  }

  getBucketForPrivateOrPublic (iNpath, iNfield) {
    const privateStorage = this.isPrivateStorage(iNpath, iNfield);
    if (privateStorage) {
      //**LATE change
      return 'gs://connect-private';
    } else {
      return 'gs://connect-public';
    }
  }

  getUrlForPrivateOrPublic (iNpath, iNfield) {
    const privateStorage = this.isPrivateStorage(iNpath, iNfield);
    if (privateStorage) {
      //**LATE change
      return 'NOT';
    } else {
      return `https://gstorage.ramman.net/${iNpath}`;
    }
  }
  isPrivateStorage (iNpath, iNfield) {
    const settings = this.getSettingsByPath(iNpath, iNfield) || {};
    if (settings.private) {
      return true;
    }
    return false;
  }

  uploadFile (iNfield: object, iNpath, iNfile, iNfileId, iNfileExt = null, iNmetadata = null): Observable<object> {
    let ext           = iNfileExt || this.getFileExtensionByFile(iNfile),
        file          = iNfile,
        fileId        = iNfileId,
        field         =  iNfield,
        path          = `${iNpath}${fileId}.${ext}`,
        metadata      = iNmetadata,
        result        = {'path': `${path}`, 'error': null, url: null},
        uploadTask,
        bucket        = this.getBucketForPrivateOrPublic(path, field);



    if ( !metadata ) {
      // uploadTask  =  this.fstorage.refFromURL(path).put(file);
      uploadTask  =  this.firebase.storage(bucket).ref(path).put(file);

    } else {
      // uploadTask  =  this.fstorage.refFromURL(path).put(file, metadata);
      uploadTask  =  this.firebase.storage(bucket).ref(path).put(file, metadata);


    }




    return Observable.create (
      (observer: Observer<object>) => {

        // Listen for state changes, errors, and completion of the upload.
        console.log('uploadTask.snapshot.state', uploadTask.snapshot.state);
        uploadTask.on('state_changed', // or 'state_changed'
          (snapshot) => {
            // Get task percent, including the number of bytes uploaded and the total number of bytes to be uploaded

            //add persent
              const percent           = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  result['percent'] = percent / 100;
            console.log('snapshot.state', snapshot.state);
            console.log('snapshot', snapshot);
            switch (snapshot.state) {
              case 'paused': // or 'paused'
                console.log('Upload is paused');

                result['state'] = 'paused';
                observer.next(result);
              break;

              case 'running': // or 'running'
                console.log('Upload is running');

                result['state'] = 'running';
                observer.next(result);
              break;
            }
          }, (err) => {
            console.log('uploadFile - ERROR - url', err);
            result['err'] = err;
            observer.next(result);
            observer.complete();

            // A full list of err codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            // switch (err.code) {
            //   case 'storage/unauthorized':
            //     // User doesn't have permission to access the object
            //     break;
            //
            //   case 'storage/canceled':
            //     // User canceled the upload
            //     break;
            //   case 'storage/unknown':
            //     // Unknown err occurred, inspect err.serverResponse
            //     break;
            // }
          }, () => {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
              console.log('uploadFile - downloadURL - url', url);
              result['url'] = url;
              observer.next(result);
              observer.complete();
            });
          });
      }
    );
  }






}
