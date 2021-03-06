const APIurl = 'https://todoo.5xcamp.us'
const allinput = document.querySelectorAll('input')
const email = document.querySelector('#usermail')
const password = document.querySelector('#password')
const login_btn = document.querySelector('#login_btn')
const alert_txt = document.querySelector('#alert_txt')
const status_txt = document.querySelector('#status_txt')
const modal = document.querySelector('#login_modal')
const loginModal = new bootstrap.Modal(modal, {})

login_btn.addEventListener('click', () => {
    const check_ok = check();
    if (check_ok === true) {
        input(email.value, password.value)
    } else {
        return;
    }
})

function login(email, password) {
    status_txt.textContent = '登入中請稍後 ...';
    return axios.post(`${APIurl}/users/sign_in`,
        {
            "user": {
                "email": email,
                "password": password
            }
        }
    )
}


const input = async (mail, pwd) => {
    try {
        const res = await login(mail, pwd);
        axios.defaults.headers.common['Authorization'] = res.headers.authorization
        sessionStorage.setItem('token', res.headers.authorization)
        sessionStorage.setItem('name', res.data.nickname)
        setTimeout(() => {
            status_txt.textContent = '';
            alert_txt.innerHTML = `登入成功 ! 歡迎 ${res.data.nickname} 回來 <br><br> 即將跳轉待辦清單 ...`;
            loginModal.show()
            reset();
            setTimeout(() => {
                document.location.href = './list.html';
            }, 2000);
        }, 1000);

    } catch (error) {
        setTimeout(() => {
            status_txt.textContent = '';
            alert_txt.textContent = '登入失敗，您的Email或密碼有誤 !  '
            loginModal.show()
            reset();
        }, 1000);

    }
}

function check() {
    let isnull = false;
    for (const item of allinput) {
        if (item.value === '') {
            isnull = true;
            break;
        }
    }
    if (isnull === true) {
        alert_txt.textContent = '您還有欄位尚未填寫 ! '
        loginModal.show()
        reset();
        return;
    }
    if (email.value.match('@') === null) {
        alert_txt.textContent = '您的Email格式不正確 ! '
        loginModal.show()
        reset();
        return;
    }
    return true
}

function reset() {
    email.value = '';
    password.value = '';
}




