<script setup>
import { ref, onMounted } from 'vue'

const authInfo = ref(null);

let popup = null;

const login = () => {
  popup = window.open ("https://poc-saml2.azurewebsites.net/", "auth", "popup");
}

const updateAuthInfo = (e) => {
  if (popup !== e.source) return;
  authInfo.value = e.data;
  console.log(authInfo.value);
  console.log(authInfo.value.name[0]);
  popup.close();  
}

onMounted(() => {
  login();
  window.addEventListener('message',  updateAuthInfo);
})
</script>

<template>
  <div>
    <h1>This is an login page</h1>
    <div v-if="!authInfo">Login in progress</div>
    <div v-else>
      <li v-for="(value, key) in authInfo">
        {{ key }}: {{ value }}
      </li>
    </div>
  </div>
</template>