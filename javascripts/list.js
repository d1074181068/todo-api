const user = document.querySelector('#user_account')
const list_bar = document.querySelector('#list_bar')
const all_bar_li = document.querySelectorAll('#list_bar>li')
const todo_item = document.querySelector('#todo_item')
const checked = document.querySelector('#checked')
const checkbox = document.querySelector('.form-check-input')
user.textContent = localStorage.getItem('name')

list_bar.addEventListener('click', (e) => {
    bar_reset();
    e.target.classList.add('active')
})

todo_item.addEventListener('click', (e) => {
    if (e.target.classList.contains('bi-x-lg') == true) {

    } else {
        console.log(123);
    }
})


function bar_reset() {
    for (const item of all_bar_li) {
        item.classList.remove('active')
    }
}