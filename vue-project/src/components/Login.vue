<template>
  <div class="mainLayout d-flex justify-content-center align-items-center vh-100">
    <div class="form">
      <div class="text-center">
        <!-- Logo -->
        <div class="logo">
          <img src="https://admin.posbel.be/favicon.svg" alt="Logo">
        </div>

        <!-- Title -->
        <p class="title">SIGN IN</p>
        <p class="sub-title">ENTER YOUR CREDENTIALS</p>
      </div>
      <br><br>

      <!-- Form -->
      <form >
        <!-- Email Field -->
        <div class="mb-4">
          <div class="input-group">
            <input v-model="form.username" type="text" id="username" class="form-control" placeholder="USERNAME">
            <span class="input-group-text">
              <i class="fas fa-user"></i>
            </span>
          </div>
        </div>

        <!-- Password Field -->
        <div class="mb-3">
          <div class="input-group">
            <input v-model="form.password" type="password" id="password" class="form-control" placeholder="PASSWORD">
            <span class="input-group-text">
              <i class="fas fa-eye-slash"></i>
            </span>
          </div>
        </div>

        <!-- Error Message -->
        <p v-if="store.errorMessage" class="text-danger text-center">{{ store.errorMessage }}</p>

        <!-- Keep Me Signed In -->
        <div class="mb-3 mt-5 form-check">
          <input type="checkbox" class="form-check-input" id="keepSigned">
          <label class="form-check-label" for="keepSigned">KEEP ME SIGNED</label>
        </div>

        <!-- Sign In Button -->
        <button :disabled="store.isSubmitting" type="submit" class="btn btn-dark w-100" @click="loginCall">
          <span v-if="store.isSubmitting">Connexion...</span>
          <span v-else>SIGN IN</span>
        </button>
      </form>

      <!-- Register Link -->
      <div class="text-center not" style="margin-top: 150px">
        <p>DON’T HAVE ANY ACCOUNT ? <a href="#">REGISTER</a></p>
      </div>
    </div>
  </div>
</template>
<script>

import {useLoginStore} from "@/store/LoginStore.js";

export default {
  name: 'Login',
  computed:{
    store(){
      return useLoginStore();
    }
  },
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      isSubmitting: false, // Empêche les doubles soumissions
      errorMessage: null,   // Stocke le message d'erreur
    };
  },
  methods: {
    async loginCall(){
      this.isSubmitting = true;
      this.errorMessage = null;

      const loginData = { ...this.form};
      console.log(loginData);
      try{
        await this.store.login(loginData);
      }catch(err){
        console.log(err);
      }finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>


<style scoped>

.form-check-label{
  font-size: 15px;
  padding-left: 5px;
  font-weight: 500;
}

.form-check-input{
  border: 1px solid black;
}
.input-group span {
  border: none;
  border-radius: 20px;
  background-color: #f5f5f5;
  padding-right: 25px;
  font-size: 15px;
  color: #1C2129;
}
.form-control{
  background-color: #f5f5f5;
  border: none;
  height: 60px;
  border-radius: 20px;
  padding-left: 25px;
  font-size: 13px !important;
  font-weight: 600;
}

input:focus,
textarea:focus,
select:focus {
  outline: none !important;
  box-shadow: none !important;
  border-color: inherit !important;
}

.not{
  font-size: 15px;
  font-weight: 600;
  text-decoration: none !important;
}
.not a {
  color: #878787;
  text-decoration: none !important;
}
.mainLayout {
  margin: 0;
  background: #fdfdfd;
  height: 100vh;
}
.title{
  font-size: 50px;
  font-weight: 600;
  margin-bottom: -2px !important;
  padding-bottom: 0 !important;
  letter-spacing: 2px;
}
.sub-title{
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;

  margin-bottom: -10px;
}
.form{
  width: 40%;
  margin: auto;
}

@media (max-width: 768px) {
  .form{
    width: 100%;
    padding: 40px
  }

}

@media (min-width: 1200px) {
  .form{
    width: 30%;
    padding: 40px
  }

}

button{
  border-radius: 20px;
  height: 60px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 2px;
  background-color: #1C2129;
}


.logo{
  width: 110px;
  height: auto;
  margin: auto;
  margin-bottom: 50px !important;
}

.logo img{
  border-radius: 10px;
}



</style>