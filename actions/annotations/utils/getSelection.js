/**
 * Created by korovin on 3/11/2017.
 */
export default function getSelection() {
    let ranges = [];

    if (typeof window.getSelection != 'undefined') {
        let sel = window.getSelection();
        if (sel.rangeCount) {
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                let range = sel.getRangeAt(i);
                if (range.startOffset === range.endOffset) {
                    continue;
                }
                ranges.push(range);
            }
        }
    } else if (typeof document.selection != 'undefined') {
        if (document.selection.type == 'Text') {
            let ranges = document.selection.createRange();

        }
    }

    return ranges;
}
