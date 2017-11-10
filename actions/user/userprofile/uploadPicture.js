import MediaStore from '../../../stores/MediaStore';
import uploadProfilePicture from '../../media/uploadProfilePicture';
import changeUserData from './changeUserData';
const log = require('../../log/clog');

//This action gets a whole user object and uploads the picture and then saves the user with the picture URL
export default function uploadPicture(context, payload, done) {
    log.info(context);

    //prepare file
    let file = {
        type: 'image/' + payload.filetype,
        title: 'profile picture of '+payload.uname,
        filesize: payload.filesize,
        filename: payload.fileurl,
        bytes: payload.picture
    };

    context.executeAction(uploadProfilePicture, file, () => {
        // console.log('uploadPicture: uploaded media file', context.getStore(MediaStore).file, context.getStore(MediaStore).file.url, context.getStore(MediaStore).file.thumbnailUrl);

        if (context.getStore(MediaStore).status !== 'success') {
            //show error
            context.dispatch('EDIT_USER_FAILED', {});

            return done();
        }

        delete payload.filesize;
        delete payload.fileurl;
        delete payload.filetype;
        payload.picture = context.getStore(MediaStore).file.url;
        // console.log('uploadPicture: Now saving user', payload, context.getStore(MediaStore).file.filename);

        context.executeAction(changeUserData, payload, () => {
            done();
        });
    });
}
