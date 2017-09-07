import MediaStore from '../../../stores/MediaStore';
import uploadMediaFiles from '../../media/uploadMediaFiles';
import changeUserData from './changeUserData';
const log = require('../../log/clog');

//This action gets a whole user object and uploads the picture and then saves the user with the picture URL
export default function uploadPicture(context, payload, done) {
    log.info(context);

    //prepare file
    let file = {
        type: 'image/' + payload.filetype.replace('jpg', 'jpeg'),
        license: 'Creative Commons 4.0',
        copyright: 'Creative Commons 4.0 SlideWiki user '+payload.uname,
        title: 'profile picture of '+payload.uname,
        // text: this.state.alt,
        filesize: payload.filesize,
        filename: payload.fileurl,
        bytes: payload.picture
    };

    context.executeAction(uploadMediaFiles, file, () => {
        console.log('uplaoded media file', context.getStore(MediaStore).file, context.getStore(MediaStore).file.url, context.getStore(MediaStore).file.thumbnailUrl);

        if (context.getStore(MediaStore).status !== 'success') {
            //show error
            context.dispatch('EDIT_USER_FAILED', {});

            return done();
        }

        delete payload.filesize;
        delete payload.fileurl;
        delete payload.filetype;
        payload.picture = context.getStore(MediaStore).file.url;
        console.log('Now saving user', payload, context.getStore(MediaStore).file.filename);

        context.executeAction(changeUserData, payload, () => {
            done();
        });
    });
}
