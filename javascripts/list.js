const APIurl = 'https://todoo.5xcamp.us'
const all_todo = []
const del_todo_id = [];
const user = document.querySelector('#user_account')
const header_logout = document.querySelector('.header_logout');
const list_bar = document.querySelector('#list_bar')
const all_bar_li = document.querySelectorAll('#list_bar>li')
const checked = document.querySelector('#checked')
const checkbox = document.querySelector('.form-check-input')
const search_btn = document.querySelector('#search_btn')
const search_input = document.querySelector('#search')
const alert_txt = document.querySelector('#alert_txt')
const modal = document.querySelector('#list_modal')
const listModal = new bootstrap.Modal(modal, {})
const list_items = document.querySelector('#list_items')
const item_count = document.querySelector('#item_count');
const clear_all = document.querySelector('#clear_all');
let html_txt = '';
let todo_item;
let logout_btn;
let not_complete = 0;

// init start

//檢查有無token，若無token不顯示登入後的畫面
init_token_render();

//初始畫面渲染
if (sessionStorage.getItem('token')) {
    render();
}
//登出按鈕
if (logout_btn) {
    logout_btn.addEventListener('click', () => {
        //移除token 避免每個使用者重疊登入token
        sessionStorage.removeItem('token')

        //登出後渲染成為未登入畫面後移轉至登入html
        init_token_render()
        document.location.href = './login.html';
    })
}

// init end

list_bar.addEventListener('click', (e) => {

    //避免上方選單重複active效果
    bar_reset();
    const target = e.target;
    target.classList.add('active')
    //偵測是哪個點擊選單做個別的選染方式
    if (target.classList.contains('all')) {
        render('all')
    } else if (target.classList.contains('not_complete')) {
        render('not_complete')
    } else if (target.classList.contains('complete')) {
        render('complete')
    }

})

search_btn.addEventListener('click', () => {
    check_token();
})

search_input.addEventListener('keypress', (event) => {
    if (event.which == '13') {
        check_token();
    }
});

//清除全部已完成todo
clear_all.addEventListener('click', (e) => {
    e.preventDefault();
    if (sessionStorage.getItem('token')) {
        get_del_id();
    } else {
        //避免使用者未登入進行操作，而產生錯誤
        alert_txt.textContent = '你還未登入，尚無權限使用此待辦功能';
        listModal.show();
        return;
    }

})

// 將todo項目加入點擊監聽，做完成效果轉換 與 刪除單一 todo 功能
function item_listener() {
    for (i = 0; i < todo_item.length; i++) {
        todo_item[i].addEventListener('click', (e) => {
            const target = e.target
            if (target.classList.contains('bi-x-lg') == true) {
                // 刪除todo
                const del_todo_id = target.parentElement.dataset.index;
                const del_todo_key = find_key(del_todo_id)
                const current_tab = check_current_tab();
                del_todo(del_todo_key, current_tab);
                render(current_tab)

            } else if (target.classList.contains('todo_item')) {
                //針對點擊的元素做相對應的樣式處理 (以下都是點擊後變成完成狀態的todo)
                const target_element = target.children['0'].children;
                const target_data_index = target.dataset.index;

                //尋找該todo的id 透過函式做 api toggle
                const patch_key = find_key(target_data_index);
                todo_done(patch_key);

                target_element['0'].classList.toggle('d-none');
                target_element['1'].classList.toggle('d-none');
                target_element['2'].classList.toggle('active');
            } else if (target.classList.contains('form-check-label')) {
                const target_data_index = target.parentElement.parentElement.dataset.index;

                const patch_key = find_key(target_data_index);
                todo_done(patch_key);

                target.classList.toggle('active')
                target.previousElementSibling.classList.toggle('d-none')
                target.previousElementSibling.previousElementSibling.classList.toggle('d-none')
            } else if (target.classList.contains('form-check-input')) {
                const target_data_index = target.parentElement.parentElement.dataset.index;

                const patch_key = find_key(target_data_index);
                todo_done(patch_key);

                target.classList.toggle('d-none');
                target.nextElementSibling.classList.toggle('d-none');
                target.nextElementSibling.nextElementSibling.classList.toggle('active')
            } else if (target.classList.contains('bi-check-lg')) {
                const target_data_index = target.parentElement.parentElement.dataset.index;

                const patch_key = find_key(target_data_index);
                todo_done(patch_key);

                target.classList.toggle('d-none')
                target.previousElementSibling.classList.toggle('d-none');
                target.nextElementSibling.classList.toggle('active');
            }
        })
    }

}

//函式 - 新增前檢查有無token
function check_token() {
    if (sessionStorage.getItem('token')) {
        if (search_input.value !== '') {
            const add_item = search_input.value;
            //檢查有無重複
            check_same(add_item)
        } else {
            alert_txt.textContent = '你要新增的項目不可為空 ! ';
            listModal.show();
            return
        }
    } else {
        //避免使用者未登入進行操作，而產生錯誤
        alert_txt.textContent = '你還未登入，尚無權限使用此待辦功能';
        listModal.show();
        return;
    }
}

//函式 - 檢查重複
function check_same(add_item) {
    axios.get(`${APIurl}/todos`, {
        headers: {
            Authorization: sessionStorage.getItem('token')
        }
    })
        .then(
            res => {
                const check = res.data.todos.some(item => {
                    return item.content == add_item.trim();
                })
                if (check) {
                    search_input.value = '';
                    alert_txt.textContent = '此待辦您已輸入過，請重新輸入';
                    listModal.show();
                    return
                }
                else {
                    add_todo(add_item)
                }
            }
        )
}

//函式 - 增加todo
function add_todo(item) {
    const current_tab = check_current_tab();
    axios.post(`${APIurl}/todos`,
        {
            "todo": {
                "content": item
            }
        },
        {
            headers: {
                Authorization: sessionStorage.getItem('token')
            }
        }
    )
        .then(
            res => {
                render(current_tab);
            }
        )
        .catch(
            error => {
                if (error.response.data.message == '未授權') {
                    alert_txt.textContent = '你還未登入，尚無權限使用此待辦功能';
                    listModal.show()
                }
            }
        )
    search_input.value = ''

}

//函式 - 刪除todo
function del_todo(key) {
    axios.delete(`${APIurl}/todos/${key}`,
        {
            headers: {
                Authorization: sessionStorage.getItem('token')
            }
        })
        .then(res => {
            //刪除後 重新渲染頁面
            const current_tab = check_current_tab();
            render(current_tab)
        })
        .catch(
            error => {
                console.log(error);
            }
        )
}

//函式 - 取得預刪除 todo的 id
function get_del_id() {
    del_todo_id.splice(0, del_todo_id.length)
    axios.get(`${APIurl}/todos`, {
        headers: {
            Authorization: sessionStorage.getItem('token')
        }
    })
        .then(
            res => {
                //將取回來的 data 裡有完成狀態的todo做刪除
                res.data.todos.forEach(item => {
                    if (item.completed_at !== null) {
                        del_todo(item.id)
                    }
                })
            }
        )
        .catch(
            error => {
                console.log(error);
            }
        )
}

//函式 - todo 完成狀態的轉換
function todo_done(key) {
    axios.patch(`${APIurl}/todos/${key}/toggle`, {}, {
        headers: {
            Authorization: sessionStorage.getItem('token')
        }
    })
        .then(
            res => {

                //控制左下角的span做加減呈現未完成的todo數量
                if (res.data.completed_at === null) {
                    item_count.textContent = parseInt(item_count.textContent) + 1;
                } else {
                    item_count.textContent = parseInt(item_count.textContent) - 1;
                }
            }
        )
        .catch(
            error => {
                console.log(error);
            }
        )
}

//函式 - 將取得陣列推入變數中以便利用與處理
function render(type) {
    axios.get(`${APIurl}/todos`,
        {
            headers: {
                Authorization: sessionStorage.getItem('token')
            }
        })

        .then(res => {
            //推入陣列前做清空，避免重複寫入出現選染問題
            all_todo.splice(0, all_todo.length)

            res.data.todos.forEach(item => {
                all_todo.push(item)
            });
            //取得陣列後 控制左下角的span呈現待完成todo的數量
            not_complete = all_todo.length;

            //渲染html
            html_render(type)
        })
        .catch(
            error => {
                //避免使用者未登入進行操作，而產生錯誤
                if (error.response.data.message == '未授權') {
                    alert_txt.textContent = '你還未登入，尚無權限使用此待辦功能';
                    listModal.show();
                    return;
                }
            }
        )
}

//渲染網頁元素
function html_render(render_type) {

    //渲染前先將字串清空避免重複渲染
    html_txt = '';

    //   三種情況
    /**
     * 1. 點擊上方tab選單中的 " 全部 " 或是 未傳入特定選染方式 就全部選染
     * 
     * 2. 點擊上方tab選單中的 " 待完成 " 針對取回陣列中的未完成項目做渲染
     * 
     * 3. 點擊上方tab選單中的 " 已完成 " 針對取回陣列中的未完成項目做渲染
     */

    if (render_type === 'all' || !render_type) {
        all_todo.forEach((item, index) => {
            if (item.completed_at === null) {
                html_txt += `
                <div class="todo_item d-flex justify-content-between align-items-center mb-3" id="todo_item" data-index="${index}">
                    <div class="form-check ps-0 d-flex align-items-center">
                        <input class="form-check-input ms-2 me-3 " type="checkbox">
                        <i class="bi bi-check-lg me-3 d-none"></i>
                        <label class="form-check-label mt-1">${item.content}</label>
                    </div>
                    <i class="bi bi-x-lg"></i>
                </div>
            `;
            } else {
                not_complete--;
                html_txt += `
                <div class="todo_item d-flex justify-content-between align-items-center mb-3" id="todo_item" data-index="${index}">
                    <div class="form-check ps-0 d-flex align-items-center">
                        <input class="form-check-input ms-2 me-3 d-none" type="checkbox">
                        <i class="bi bi-check-lg me-3"></i>
                        <label class="form-check-label mt-1 active">${item.content}</label>
                    </div>
                    <i class="bi bi-x-lg"></i>
                </div>
            `;
            }
        })
    } else if (render_type === 'not_complete') {
        all_todo.forEach((item, index) => {
            if (item.completed_at === null) {
                html_txt += `
                <div class="todo_item d-flex justify-content-between align-items-center mb-3" id="todo_item" data-index="${index}">
                    <div class="form-check ps-0 d-flex align-items-center">
                        <input class="form-check-input ms-2 me-3 " type="checkbox">
                        <i class="bi bi-check-lg me-3 d-none"></i>
                        <label class="form-check-label mt-1">${item.content}</label>
                    </div>
                    <i class="bi bi-x-lg"></i>
                </div>
            `;
            } else {
                not_complete--;
            }
        })
    } else if (render_type === 'complete') {
        all_todo.forEach((item, index) => {
            if (item.completed_at !== null) {
                not_complete--;
                html_txt += `
                <div class="todo_item d-flex justify-content-between align-items-center mb-3" id="todo_item" data-index="${index}">
                    <div class="form-check ps-0 d-flex align-items-center">
                        <input class="form-check-input ms-2 me-3 d-none" type="checkbox">
                        <i class="bi bi-check-lg me-3"></i>
                        <label class="form-check-label mt-1 active">${item.content}</label>
                    </div>
                    <i class="bi bi-x-lg"></i>
                </div>
            `;
            }
        })
    }

    list_items.innerHTML = html_txt;
    item_count.textContent = not_complete;

    //渲染完後將所有todo項目加入監聽 (必須在渲染完後加入，不然會監聽不到) 
    todo_item = document.querySelectorAll('#todo_item')
    item_listener()
}

//確認當前在哪個tab選單，以便做相對應的選染資料
function check_current_tab() {
    let current;
    all_bar_li.forEach(item => {
        if (item.classList.contains('active')) {
            current = item.classList[0];
        }
    })
    return current;
}

function find_key(index) {
    const current_item = all_todo[index].id;
    return current_item;
}
function init_token_render() {
    if (sessionStorage.getItem('token')) {
        user_name = sessionStorage.getItem('name')
        header_logout.innerHTML = `
        <h1 class="fw-bolder d-lg-block h5 mb-0 me-3" id="user_account">
        ${user_name} 的待辦</h1>
        <a href="#" class="text-center text-lg-start" id="logout">登出</a>
        `
        logout_btn = document.querySelector('#logout')
    } else {
        header_logout.innerHTML = `
            <a href="./login.html" class="me-3">登入</a>
            <a href="./signup.html" class="text-center text-lg-start" id="logout">註冊</a>
        `
    }
}
function bar_reset() {
    for (const item of all_bar_li) {
        item.classList.remove('active')
    }
}

