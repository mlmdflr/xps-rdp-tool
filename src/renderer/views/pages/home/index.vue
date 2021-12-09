<template>
  <Head></Head>
  <div class="container">
    <div class="home-info">
      <ElForm label-position="left" size="mini">
        <ElFormItem label="计算机">
          <ElInput v-model="pc"></ElInput>
        </ElFormItem>
        <ElFormItem label="用户名">
          <ElInput v-model="uname"></ElInput>
        </ElFormItem>
        <ElFormItem label="密码">
          <ElInput v-model="upasw" type="password"></ElInput>
        </ElFormItem>
        <ElFormItem label="窗口名">
          <ElInput v-model="fname"></ElInput>
        </ElFormItem>
        <ElFormItem label="窗口透明度">
          <ElSlider :src="upasw" v-model="op" :step="0.1" :min="0.1" :max="1"></ElSlider>
        </ElFormItem>
        <ElFormItem>
          <ElButton @click="connect">连接</ElButton>
        </ElFormItem>
      </ElForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  windowShow,
  windowMessageOn
} from '@/renderer/common/window';

import { ElButton, ElInput, ElMessage, ElForm, ElFormItem, ElSlider } from 'element-plus';
import Head from "@/renderer/views/components/head/index.vue";

import type { coreClass } from "@/main/modular/core";

let pc = ref('')
let uname = ref('')
let upasw = ref('')
let fname = ref('')
let op = ref(0.8)

const connect = () => {

  if (!pc.value) {
    ElMessage.error('主机地址不能为空')
    return
  }
  if (!uname.value) {
    ElMessage.error('用户名不能为空')
    return
  }
  if (!upasw.value) {
    ElMessage.error('用户密码不能为空')
    return
  }
  windowMessageOn('core', (event, args) => {
    console.log(args.ok);
    console.log(args);
  })
  let core: coreClass = {
    host: pc.value,
    username: uname.value,
    password: upasw.value,
    opacity: op.value,
  }
  localStorage.setItem("pc", pc.value)
  localStorage.setItem("uname", uname.value)
  localStorage.setItem("upasw", upasw.value)
  localStorage.setItem("op", String(op.value))
  if (fname.value) {
    Object.assign(core, { fname: fname.value })
  }
  Object.assign(core, { is_u_icon: true })
  window.ipc.invoke('xrdp-open', core)
}


onMounted(() => {
  windowShow()
  pc.value = localStorage.getItem("pc")
  uname.value = localStorage.getItem("uname")
  upasw.value = localStorage.getItem("upasw")
  op.value = Number(localStorage.getItem("op")) 
})


</script>

<style lang='scss' scoped>
@import "./scss/index";
</style>
