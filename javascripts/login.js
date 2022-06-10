const APIurl = 'https://todoo.5xcamp.us'
let userToken = '';

function login(email, password) {
    console.log('登入中請稍後 ...');
    setTimeout(() => {
        axios.post(`${APIurl}/users/sign_in`,
            {
                "user": {
                    "email": email,
                    "password": password
                }
            }
        )
            .then(res => {
                userToken = res.headers.authorization;
                console.log(`登入成功`);
                console.log(`歡迎 ${res.data.nickname} 回來`);
            })
            .catch(error => {
                console.log(error.response);
            })
    }, 1000);
}

function get_todo() {
    axios.get(`${APIurl}/todos`,
        {
            headers: {
                Authorization: userToken
            }
        }
    )
        .then(
            res => {
                console.log(res.data.todos);
                res.data.todos
                console.log(userToken);
            }
        ).catch(
            error => {
                console.log(error);
            }
        )
}

function add_todo() {
    console.log(userToken);
    axios.post(`${APIurl}/todos`, {
        "todo": {
            "content": "string12132132"
        }
    }, {
        headers: {
            Authorization: userToken
        }
    })
        .then(
            res => {
                console.log(res);
            }
        ).catch(
            error => {
                console.log(error);
            }
        )
}

function update_todo() { }

login('string@gmail.com', 'string123')

setTimeout(() => {
    get_todo()
}, 2500);

// const input = async (mail, pwd) => {
//     try {
//         const data = await login(mail, pwd);
//         console.log(data);
//     } catch (error) {

//     }
// }


// input('string@gmail.com', 'string13')
