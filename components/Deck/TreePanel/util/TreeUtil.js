class TreeUtil {
    static getParentId(selector) {
        //no parent, root deck selected
        if (!selector.sid || (selector.stype === 'deck' && selector.sid === selector.id)) {
            return null;
        }
        let arr = selector.spath.split(';');
        //root deck is parent
        if (arr.length <= 1) {
            return selector.id;
        } else {
            arr.splice(-1, 1);
            return arr[arr.length - 1].split(':')[0];
        }
    }
}
export default TreeUtil;
