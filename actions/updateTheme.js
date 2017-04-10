export default function updateTheme(context, payload, done) {
    //console.log('theme' + payload);
    context.dispatch('UPDATE_THEME', payload);
    done();
}
