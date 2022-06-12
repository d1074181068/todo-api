const user = document.querySelector('#user_account')
const list_bar = document.querySelector('#list_bar')
const all_bar_li = document.querySelectorAll('#list_bar>li')
const todo_item = document.querySelectorAll('#todo_item')
const checked = document.querySelector('#checked')
const checkbox = document.querySelector('.form-check-input')
user.textContent = localStorage.getItem('name')

list_bar.addEventListener('click', (e) => {
    bar_reset();
    e.target.classList.add('active')
})


for (i = 0; i < todo_item.length; i++) {
    todo_item[i].addEventListener('click', (e) => {
        if (e.target.classList.contains('bi-x-lg') == true) {

        } else if (e.target.classList.contains('todo_item')) {
            const target_element = e.target.children['0'].children;
            target_element['0'].classList.toggle('d-none');
            target_element['1'].classList.toggle('d-none');
            target_element['2'].classList.toggle('active');
        } else if (e.target.classList.contains('form-check-label')) {
            e.target.classList.toggle('active')
            e.target.previousElementSibling.classList.toggle('d-none')
            e.target.previousElementSibling.previousElementSibling.classList.toggle('d-none')
        }
    })
}


function bar_reset() {
    for (const item of all_bar_li) {
        item.classList.remove('active')
    }
}