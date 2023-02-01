console.log('HELLO FROM JAVASCRIPT WORLD!!')

const primaryNav = document.querySelector('.mtg-nav')
const navToggle = document.querySelector('.mtg-nav-toggle')

navToggle.addEventListener('click', () => {
    console.log('CLICK!!')
    const visibility = primaryNav.getAttribute('data-visible')
    if (visibility === 'false') {
        primaryNav.setAttribute('data-visible', 'true')
        navToggle.innerHTML = 'close'
        navToggle.setAttribute(
            'style',
            'color: var(--gray-90); font-size: 36px'
        )
    } else {
        primaryNav.setAttribute('data-visible', 'false')
        navToggle.innerHTML = 'menu'
        navToggle.setAttribute(
            'style',
            'color: var(--gray-10); font-size: 36px'
        )
    }
})
