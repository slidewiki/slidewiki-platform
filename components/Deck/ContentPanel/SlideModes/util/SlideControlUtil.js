class SlideControlUtil{
    //return the absolute position of the selector
    static calculateAbsPosition(flatTree, spath){
        let position = 0;
        for (let i=0; i < flatTree.size; i++) {
            if (flatTree.get(i).get('path') === spath) {
                position = i;
                return i;
            }
        }
        return position;
    }
    //get size based on slide number
    static getSlidesNumber(flatTree) {
        let c = 0;
        flatTree.forEach((item) => {
            if(item.get('type') === 'slide'){
                c++;
            }
        });
        return c;
    }
    //get size based on slide number
    static getSlidePosition(selector, flatTree) {
        let c = 0, out = 1;
        let item = flatTree.get(0);
        while (item && (item.get('path') !== selector.get('spath'))) {
            c++;
            if(item.get('type') === 'slide'){
                out++;
            }
            item = flatTree.get(c);
        }
        return out;
    }
    //create previous slide path
    static prevSlidePath(selector, flatTree, mode) {
        let position = this.calculateAbsPosition(flatTree, selector.get('spath'));
        let node, path;
        if(!position || position === 1){
            return 0;
        }else{
            node = flatTree.get(position - 1);
            while (node && node.get('type') === 'deck') {
                position--;
                node = flatTree.get(position);
            }
            path = '/deck/' + selector.get('id') + '/' + node.get('type') + '/' + node.get('id') + '/' + node.get('path') + '/' + mode;
            return path;
        }
    }
    //create next slide path
    static nextSlidePath(selector, flatTree, mode) {
        let position = this.calculateAbsPosition(flatTree, selector.get('spath'));
        let node, path;
        if(!flatTree.get(position + 1)){
            return 0;
        }else{
            node = flatTree.get(position + 1);
            while (node && node.get('type') === 'deck') {
                position++;
                node = flatTree.get(position);
            }
            path = '/deck/' + selector.get('id') + '/' + node.get('type') + '/' + node.get('id') + '/' + node.get('path') + '/' + mode;
            return path;
        }
    }
    //create last slide path
    static lastSlidePath(selector, flatTree, mode) {
        let node, path;
        node = flatTree.get(flatTree.size - 1);
        path = '/deck/' + selector.get('id') + '/' + node.get('type') + '/' + node.get('id') + '/' + node.get('path') + '/' + mode;
        return path;
    }
    //create first slide path
    static firstSlidePath(selector, flatTree, mode) {
        let node, path;
        node = flatTree.get(1);
        if(node.get('type') === 'deck'){
            node = flatTree.get(2);
        }
        path = '/deck/' + selector.get('id') + '/' + node.get('type') + '/' + node.get('id') + '/' + node.get('path') + '/' + mode;
        return path;
    }
}
export default SlideControlUtil;
