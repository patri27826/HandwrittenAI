<template>
  <div v-if="!login" class="back">
    <div class="front">
        <div>
            <label>Username</label>
            <input type="text" v-model="username">
        </div>
        <div>
            <label>Password</label>
            <input type="text" v-model="password">
        </div>
        <div>
            <button @click.prevent="loginFunc">Login</button>
            <button @click.prevent="registerFunc">Register</button>
        </div>
    </div>
    
  </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            username : '',
            password : '',
            login : false,
            login_msg : ''
        }
    },
    methods: {
        loginFunc(){
            axios.get('http://localhost:5000/api/login', { params: { username : this.username, password : this.password } })
                .then(response => {
                    if(response.data == "success"){
                        alert('Login success!')
                        this.login = true
                    }else{
                        this.username = ''
                        this.password = ''
                        alert('Incorrect username or password')
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        registerFunc(){
            axios.get('http://localhost:5000/api/register', { params: { username : this.username, password : this.password } })
                .then(response => {
                    if(response.data == "success"){
                        this.username = ''
                        this.password = ''
                        alert('register success, please log in')
                    }else{
                        this.username = ''
                        this.password = ''
                        alert('username had been used')
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    },
    watch: {
        login : function() {
        // Emit this information to the parents component
            this.$emit("login_check", [this.username, this.password, this.login]);
        }
  }
}
</script>

<style scoped>
    .back{
        top: 0;
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgb(0, 0, 0,0.5);
    }
    .front{
        width: 400px;
        padding: 20px;
        margin: 100px auto;
        border-radius: 10px;
        background-color: white;
    }
</style>