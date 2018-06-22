import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FreeformCommonService} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform.common.service';
import {FreeformValueService} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform-value.service';
import {ConnectGstorageService} from '../../../../../../../../../../res/shared/service/user/connect-gstorage.service';

import * as ProgressBar from 'progressbar.js';
import {DomSanitizer} from '@angular/platform-browser';
import {P} from '@angular/core/src/render3';

window['UPLOADCARE_LOCALE'] = 'ru';

@Component({
  selector: 'wf24-freeform-field-upload',
  templateUrl: './freeform-field-upload.component.html',
  styleUrls: ['./freeform-field-upload.component.scss']
})
export class FreeformFieldUploadComponent implements OnInit {

  // reqired
  @Input('fieldid') fieldid;
  @Input('objid') objid;
  @Input('freeform') freeform;
  @Input('disabled')    disabled;

  //optional
  @Input('multi') multi: boolean;

  // this field from freeform object
  field;

  // later add multiple
  multiple;

  // create angular reactive form
  form = new FormGroup(
    {
      field: new FormControl('')
    }
  );

  //
  noneImageIcon;

  constructor(
    private common: FreeformCommonService,
    private valueService: FreeformValueService,
    private gstorage: ConnectGstorageService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.field = this.freeform.fields[this.fieldid].objects[this.objid];
    this.multi = this.multi || false;

    this.multiple = this.field.body.payload.multiple;

    // add angular form to freefrom object
    // this.field['angular'] = { 'form': this.form };

    this.noneImageIcon = this.gstorage.getNoneIconImagePath();

    console.log('ProgressBar', ProgressBar);

    // get images list
    this.fieldUploadedList = this.field.body.payload.options || [];

  }


  getImageIcon (iNuploadedEl: object, iNfile: File  = null) {
    console.log('getImageIcon - iNuploadedEl', iNuploadedEl);
    if ( this.fieldUploadingLocalListIcons[iNuploadedEl['id']] ) {
      return this.fieldUploadingLocalListIcons[iNuploadedEl['id']];
    }
    // we have not get image yet
    new Promise(
      async () => {
        let url;
        if ( !iNfile ) {
          // it is not blob file
          url = await this.gstorage.getFileIconByUrl( iNuploadedEl['path'], this.field );
        } else if (iNuploadedEl){
          url = await this.gstorage.getFileIconByFile( iNfile, this.field );
        }
        this.fieldUploadingLocalListIcons[ iNuploadedEl['id'] ] = url;
        console.log('getImageIcon - primis url', url );
      }
    );

    return this.noneImageIcon;

  }


  // onKeyPress (iNevent) {
  //   let event = iNevent,
  //     symbol = event.key,
  //     keyCode = event.keyCode;
  //   console.log('onKeyPress - iNevent' ,symbol, keyCode, iNevent );
  //   // dont block this symbols (enter or backspace or delete () and so on...)
  //   if (
  //     keyCode === 8 || // enter
  //     keyCode === 9 || // tab
  //     keyCode === 13 || //backspase
  //     keyCode === 110 || // delete
  //     keyCode === 39 || // >
  //     keyCode === 37 // <
  //   ) return true;
  //   //**LATER add key up work only for need fields
  //   if (
  //     this.field.body.rules.resolvedSymbols &&
  //     Array.isArray(this.field.body.rules.resolvedSymbols)
  //   ) {
  //     let result = this.common.checkSymbolForResolved(symbol, this.field.body.rules.resolvedSymbols);
  //     if (!result) {
  //       //dellete last symbol if this symbola not resolved
  //       // this.field.body['value'] = this.field.body.value.slice(0, -1);
  //       console.log('onKeyPress - false');
  //       return true;
  //     }
  //
  //   } else {
  //     return true;
  //
  //   }
  //   console.log('onKeyPress - true');
  //   return false;
  // }

  // multipleFiles = false;
//
//   onUpload(info) {
//     /*
//       {"uuid":"a058f2e0-3fc1-4f28-ae97-33592b17535e","name":"left2.png","size":10972,"isStored":true,"isImage":true,"originalImageInfo":{"orientation":null,"format":"PNG","height":300,"width":801,"geo_location":null,"datetime_original":null,"dpi":null},"mimeType":"image/png","originalUrl":"https://ucarecdn.com/a058f2e0-3fc1-4f28-ae97-33592b17535e/","cdnUrl":"https://ucarecdn.com/a058f2e0-3fc1-4f28-ae97-33592b17535e/","cdnUrlModifiers":null,"sourceInfo":{"source":"local","file":{}}}
//      */
//     console.log('fired Event "onUpload"', info, JSON.stringify(info) );
//
//     if ( info['cdnUrl'] ) {
//       //**LATER add multiple image save
//       // save new url in value
//       this.valueService.setFieldValue(this.field, info.cdnUrl, ['onChange', 'onUpload']);
//       this.common.for_dependentStartByObject(this.field);
//     }
//   }

  // onProgress(progress) {
  //   console.log('fired Event "onProgress with data:"', progress, JSON.stringify(progress));
  // }

  // onChange(file) {
  //   console.log('fired Event "onChange with data:"', file, JSON.stringify(file));
  //   if (!file) {
  //     return;
  //   }
  //   console.log('fired Event "onChange" start');
  //   // input file parameter depends on "multiple-files" widget attribute
  //   if(this.multipleFiles) {
  //     //  file contains 2 methods:
  //     //  .promise() - returns the general promise for all uploaded files which resolves into an uploaded file group info
  //     //  .files() - returns an array of promises: one per each uploaded file. Each promise resolves into an uploaded file info
  //     console.log(file);
  //     if(file.promise) {
  //       file.promise().then((groupInfo) => {
  //         console.log('resolved general promise from "onChange" with data:');
  //         console.log(groupInfo);
  //       });
  //     }
  //     if(file.files) {
  //       file.files().forEach((promise) => {
  //         promise.then((fileInfo) => {
  //           console.log('resolves file promise with file info:');
  //           console.log(fileInfo);
  //         });
  //       });
  //     } else {
  //       // file contains uploaded file info
  //       console.log(file);
  //     }
  //   }
  // }

  dropzoneStateStatus = false;

  fieldUploadedList = [
    // {
    //   'id': 'fileId',
    //   'url': '../../../../../../../../../../../../assets/loader.gif'
    // }
  ];
  fieldUploadingLocalList = [];
  // fieldUploadingLocalListUrlToBlob = {};
  fieldUploadingLocalListIcons = {};

  dropzoneState($event: boolean) {
    console.log('dropzoneState - $event', $event);
    this.dropzoneStateStatus = $event;
    // this.dropzoneActive = $event;
  }

  uploadByFileList (iNfileList: FileList) {
    if (iNfileList.length > 0) {
      for (let i = 0; i < iNfileList.length; i++) {
        let file = iNfileList.item(i);

        //generate file id
        let fileId = this.gstorage.generateFileId(), cssid = `f-pb-${fileId}`;

        //get file extension
        //   let fileExt = this.gstorage.getFileExtensionByFile (file);

        //get file icon && add blob url to local object (later need for except file download)
        let icon = this.getImageIcon ({ 'id':fileId }, file);
        // add address to blob (for save not downloaded file)
        this.fieldUploadingLocalListIcons[fileId] = icon;
        //create local block
        this.fieldUploadingLocalList.push(
          {
            fileId    : fileId,
            url       : this.gstorage.getLocalUrlByFile(file),
            icon      : icon,
            progress  : 0
          }
        );
        let indexInTempArray = this.fieldUploadingLocalList.length - 1;

        let bar;
        //**LATER delete timeout <- create html element from code not angular
        setTimeout(
          () => {
            console.log('cssid', cssid, document.getElementById(cssid));
            bar =  new ProgressBar.Circle(
              document.getElementById(cssid),
              {
                color: '#2d77ff',
                trailColor: '#eee',
                trailWidth: 1,
                duration: 1400,
                easing: 'bounce',
                strokeWidth: 18,
                text: {
                  autoStyleContainer: false
                },
                from: {color: '#2d77ff', a: 0},
                to: {color: '#ED6A5A', a: 1},
                // Set default step function for all animate calls
                step: function(state, circle) {
                  circle.path.setAttribute('stroke', state.color);

                  let value = Math.round(circle.value() * 100);
                  if (value === 0) {
                    circle.setText('');
                  } else {
                    circle.setText(value);
                  }
                }
              }
            );

            this.gstorage.uploadFile(this.field,'freeform/wideFormat24/createPage1/formId/fildId/myUid/', iNfileList[0], fileId).subscribe(
              (result) => {
                console.log('this.gstorage.uploadFile - result', result );


                if ( result['url'] ) {
                  // destroy uploader
                  bar.destroy();

                  // delete
                  this.fieldUploadingLocalList.splice(indexInTempArray, 1 );

                  // add to ready -> save to db
                  this.fieldUploadedList.push(
                    {
                      'id'  : fileId,
                      'url' : result['url'],
                      'path': result['path']
                    }
                  );

                  // get url -> del from local uploading array -> add to db
                  console.log('this.gstorage.uploadFile - FINISHED', result );

                  // add to db
                  this.valueService.setFieldPayloadOptions(this.field,  this.fieldUploadedList);

                  // set status true if not already true status
                  if ( this.fieldUploadedList.length > 0 ) { // && !this.field.body.value
                    // We uploaded files -> set value true if not true yet
                    let lastUploadedUrl = this.gstorage.getUrlForPrivateOrPublic(result['path'], this.field); //'success'
                    console.log('lastUploadedUrl', lastUploadedUrl);
                    this.valueService.setFieldValue(this.field, lastUploadedUrl,['onChange', 'onUpload']);
                  }

                } else if ( result['percent'] ) {
                  bar.animate( result['percent'] );
                }
              }
            );
          }, 100
        );



        console.log('$4', this.fieldUploadingLocalList);
      }
    }
  }

  handleDrop (iNfileList: FileList) {
    console.log('handleDrop - iNfileList', iNfileList);
    this.uploadByFileList(iNfileList);
  }
  getSecurityTrustUrl (iNurl) {
    console.log('getSecurityTrustUrl', iNurl, 'TRUSTED', this.sanitizer.bypassSecurityTrustUrl(iNurl) );
    return this.sanitizer.bypassSecurityTrustUrl(iNurl);
  }


  onChange (iNfileList: FileList) {
    console.log('onChange - iNimage', iNfileList);
    // upload this image
    this.uploadByFileList(iNfileList);
  }

  onClick (iNimage) {
    console.log('fieldUploadingLocalListIcons', this.fieldUploadingLocalListIcons );
    console.log('onChange - fieldUploadedList', this.fieldUploadedList);
    console.log('onClick - iNimage', iNimage['value'], iNimage['files']);
  }

  delImage (iNindex) {
    console.log('delImage - iNindex', iNindex);
    this.fieldUploadedList.splice(iNindex, 1);
    this.valueService.setFieldPayloadOptions(this.field,  this.fieldUploadedList);

    if ( this.fieldUploadedList.length < 1) {
      // if we deleted all uploaded files -> set value null
      this.valueService.setFieldValue(this.field, '');
    }
    // save
  }
  // this.valueService.setFieldValue(this.field, info.cdnUrl, ['onChange', 'onUpload']); // this.common.for_dependentStartByObject(this.field);
  // getFileIconByUrl (iNfileUrl) {
  //   console.log('getFileIconByUrl - iNfileUrl', iNfileUrl);
  //   // return this.gstorage.getFileIconByUrl( iNfileUrl, this.field );
  //   // return new Promise(
  //   //   (resolve) => {
  //   //     console.log('111');
  //   //     resolve ('#');
  //   //   }
  //   // )
  //   return '#';
  // }
}
