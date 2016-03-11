let now = Date.now();
function timeFromNow(now, hours, mins) {
    return now - 60000*mins - 3600000*hours;
}
let fakeDiscussions = [
    {
        id: 0,
        author: {
            id: 7,
            username: 'Vuk M.',
            avatar: '/assets/images/mock-avatars/deadpool_256.png'
        },
        title: 'Congrats',
        text: 'Kudos, very good presentation, I\'ll spread the word!',
        date: timeFromNow(now, 11, 35),
        replies: [
            {
                id: 1,
                author: {
                    id: 8,
                    username: 'Dejan P.',
                    avatar: '/assets/images/mock-avatars/man_512.png'
                },
                title: 'Agreed',
                text: '^^',
                date: timeFromNow(now, 10, 0)
            },
            {
                id: 2,
                author: {
                    id: 9,
                    username: 'Nikola T.',
                    avatar: '/assets/images/mock-avatars/batman_512.jpg'
                },
                title: 'Yeah',
                text: '+1',
                date: timeFromNow(now, 9, 45)
            }
        ]
    },
    {
        id: 3,
        author: {
            id: 10,
            username: 'Marko B.',
            avatar: '/assets/images/mock-avatars/ninja-simple_512.png'
        },
        title: 'Simply the best',
        text: 'Best presentation I have seen so far on this subject',
        date: timeFromNow(now, 9, 0)
    },
    {
        id: 4,
        author: {
            id: 11,
            username: 'Voice in the crowd',
            avatar: '/assets/images/mock-avatars/anon_256.jpg'
        },
        title: 'Keep up the good work',
        text: 'Slide 54 could use some more details.\nGreat presentation though, keep on truckin!',
        date: timeFromNow(now, 9, 0),
        replies: [
            {
                id: 5,
                author: {
                    id: 12,
                    username: 'SlideWiki FTW',
                    avatar: '/assets/images/mock-avatars/spooky_256.png'
                },
                title: 'Nitpicker!',
                text: 'Damn nitpickers, everyone\'s a critic these days!',
                date: timeFromNow(now, 8, 45)
            }
        ]
    }
];

export default {
    name: 'discussion',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};
        if(resource === 'discussion.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let discussion = [
                {'id': 12, 'title': 'title for question 1', 'Date': 'Yesterday'},
                {'id': 35, 'title': 'title for question 2', 'Date': '2 hours ago'}
            ];
            callback(null, {discussion: fakeDiscussions, selector: selector});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
