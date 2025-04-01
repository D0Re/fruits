<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="signup" v-if="isSignUp">
          <form @submit.prevent="register">
            <label for="chk">Регистрация</label>
            <input type="text" v-model="user.name" placeholder="Имя пользователя" required>
            <input type="email" v-model="user.email" placeholder="Email" required>
            <input type="password" v-model="user.password" placeholder="Пароль" required>
            <button type="submit">Зарегистрироваться</button>
          </form>
          <input type="checkbox" id="chk" v-model="isSignUp">
          <label for="chk">Вход</label>
        </div>
        <div class="login" v-else>
          <form @submit.prevent="login">
            <label for="chk">Вход</label>
            <input type="email" v-model="user.email" placeholder="Email" required>
            <input type="password" v-model="user.password" placeholder="Пароль" required>
            <button type="submit">Войти</button>
          </form>
          <input type="checkbox" id="chk" v-model="isSignUp">
          <label for="chk">Регистрация</label>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  props: {
    isOpen: Boolean
  },
  data() {
    return {
      isSignUp: false,
      user: { email: '', password: '', name: ''}
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
      this.clearForm();
    },
    clearForm() {
      this.user = { email: '', password: '', name: '' };
    },
    async login() {
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.user.email,
            password: this.user.password,
          }),
        });

        const data = await response.json();
        console.log('Ответ сервера:', data); // Логируем ответ для отладки

        if (response.ok && data.user) {
          this.$store.dispatch('login', data.user); // Сохраняем пользователя в Vuex
          this.$emit('login-success', data.user);
          this.closeModal();
        } else {
          alert(data.message || 'Ошибка входа. Проверьте email и пароль.');
        }
      } catch (error) {
        console.error('Ошибка при входе:', error);
        alert('Произошла ошибка при входе. Попробуйте снова.');
      }
    },
    async register() {
      try {
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.user),
        });

        const data = await response.json();
        console.log('Ответ сервера:', data);

        if (response.ok) {
          alert(data.message);
          this.closeModal();
        } else {
          alert(data.message || 'Ошибка при регистрации.');
        }
      } catch (error) {
        console.error('Ошибка при регистрации:', error);
        alert('Произошла ошибка при регистрации. Попробуйте снова.');
      }
    }

  }
};
</script>
  <style scoped>
  /* Стили */
  #chk {
    display: none;
  }
  
  .signup {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  label {
    color: #000;
    font-size: 2.3em;
    justify-content: center;
    display: flex;
    margin: 50px;
    font-weight: bold;
    cursor: pointer;
    transition: .5s ease-in-out;
  }
  
  input {
    width: 60%;
    height: 10px;
    background: #e0dede;
    justify-content: center;
    display: flex;
    margin: 20px auto;
    padding: 12px;
    border: none;
    outline: none;
    border-radius: 5px;
  }
  
  input:active,
  input:focus {
    border: 2px solid #000;
  }
  
  button {
    width: 60%;
    height: 40px;
    margin: 10px auto;
    justify-content: center;
    display: block;
    color: #000;
    background: #00fffc;
    font-size: 1em;
    font-weight: bold;
    margin-top: 30px;
    outline: none;
    border: none;
    border-radius: 5px;
    transition: .1s ease-in;
    cursor: pointer;
  }
  
  button:hover {
    background-color: transparent;
    border: 3px solid #000;
    box-shadow: 0 0 10px #00fffc, 0 10px 15px #00fffc;
  }
  
  .login,
  .signup {
    position:relative;
    height: 400px;
    background: #eee;
    border-radius: 60% / 10%;
    transform: translateY(-300px);
    transition: 0.8s ease-in-out;
    top:300px;
  }
  
  .login label,
  .signup label {
    color: #000;
    transform: scale(.6);
    position:relative;
    
  }
  
  #chk:checked ~ .login {
    transform: translateY(100px);
    translate:0.5s;
  }
  
  #chk:checked ~ .login label {
    transform: scale(1);
   
  }
  
  #chk:checked ~ .signup label {
    transform: scale(.2);
    
  }
  
 
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    width: 450px;
    background-color: #01c7c4;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 5px 20px 50px #000;
    text-align: center;
  }
  </style>
  