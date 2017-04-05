import React from 'react';

class ContributorsUtil {
    //returns full path of an avatar
    static avatarPath(filename) {
        return '/assets/images/mock-avatars/' + filename;
    }

    static contains(slides, slide) {
        let found = false;
        for (let i = 0; i < slides.length; i++) {
            if (slides[i] === slide) {
                found = true;
                break;
            }
        }
        return found;
    }

}

export default ContributorsUtil;
