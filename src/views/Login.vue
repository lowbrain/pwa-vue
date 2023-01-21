<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const authInfo = ref(null);

let popup = null;

let displayTime = Date.now();

const login = () => {
  if (navigator.onLine) {
    popup = window.open ("https://poc-saml2.azurewebsites.net/", "auth", "popup");
  } else if(localStorage.getItem("auth")) {
    alert("現在ネットワークがオフラインであるため、以前の認証情報を利用します。");
    authInfo.value = JSON.parse(localStorage.getItem("auth"));
  } else {
    alert("現在ネットワークがオフラインです。¥nオンラインになってからもう一度試してください。");
  }
}

const stateChange = (e) => {
  if (!authInfo.value) return;
  if (document.visibilityState === 'visible') {
    if ((Date.now() - displayTime) >= 60 * 1000) {
      alert("１分以上経過したためログイン情報をクリアしました。");
      authInfo.value = null;
    }
  } else {
    displayTime = Date.now();
  }
}

const updateAuthInfo = (e) => {
  if (popup !== e.source) return;
  authInfo.value = e.data;
  authInfo.value["date"] = Date.now();
  localStorage.setItem("auth", JSON.stringify(authInfo.value));
  popup.close();  
}

onMounted(() => {
  // initialize
  if (localStorage.getItem("auth")) {
    let authTmp = JSON.parse(localStorage.getItem("auth"));
    if ((Date.now() - authTmp.date) <= 60 * 5 * 1000) authInfo.value = authTmp;
  }
  // loginイベントをハンドリング
  window.addEventListener('message',  updateAuthInfo);
  // 画面表示イベントをハンドリング
  document.addEventListener('visibilitychange', stateChange);
})

onUnmounted(() => {
  // loginイベントをハンドリング
  window.removeEventListener('message',  updateAuthInfo);
  // 画面表示イベントをハンドリング
  document.removeEventListener('visibilitychange', stateChange);
})
</script>

<template>
  <div>
    <h1>This is an login page</h1>
    <div v-if="!authInfo">
      <a href="#" @click.prevent.stop="login">Continue...</a>
    </div>
    <div v-else>
      <h3>Authentication information</h3>
      <li v-for="(value, key) in authInfo">
        {{ key }}: {{ value }}
      </li>
    </div>
  </div>
</template>

<style scoped>
a {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  margin : 10px;
  border-bottom: solid 1px gray;
}
</style>
