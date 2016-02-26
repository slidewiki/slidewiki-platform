class TreeUtil{
    //parses the nodePath and builds to selector path for navigation
    static makeSelectorPath(nodePath) {
        let out = [], slectorPath = '';
        nodePath.forEach((element, index) => {
            out.push(element.join(':'));
        });
        slectorPath = '/' + out.join(';');
        return slectorPath;
    }
}
export default TreeUtil;
