export default {
    styles: {
        container: {
            position: 'relative',
            width: '100%',
            height: '100%',
        },
        frame: {
            position: 'absolute',
            transformOrigin: '0 0',
            border: 'none',
        },
        noninteractive: {
            pointerEvents: 'none',
            overflowY: 'hidden',
        },
        interactive: {
            pointerEvents: 'all',
        },
    },
    properties: {
        noninteractive: {
            scrolling: 'no',
        },
    },
};
