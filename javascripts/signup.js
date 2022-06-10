const APIurl = 'https://todoo.5xcamp.us'

function signup(email, nickname, password) {
    console.log('註冊中請稍後 ... ');
    setTimeout(() => {
        axios.post(`${APIurl}/users`,
            {
                "user": {
                    "email": email,
                    "nickname": nickname,
                    "password": password
                }
            }
        )
            .then(data => {
                console.log('註冊成功');
            })
            .catch(error => {
                console.log(error.response.data.error[0]);
            })
    }, 1000);
}

signup('string132@gmail.com', 'string', 'string321')


