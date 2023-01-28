console.log('HELLO FROM JAVASCRIPT WORLD!!')

const primaryNav = document.querySelector('.mtg-nav')
const navToggle = document.querySelector('.mtg-nav-toggle')

navToggle.addEventListener('click', () => {
    console.log('CLICK!!')
    const visibility = primaryNav.getAttribute('data-visible')
    if (visibility === 'false') {
        primaryNav.setAttribute('data-visible', 'true')
    } else {
        primaryNav.setAttribute('data-visible', 'false')
    }
})
