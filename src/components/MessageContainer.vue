<template>
  <div class="message-container">
    <ul v-if="messages.length > 0">
        <message-item v-for="(msg, index) in messages" v-bind:message="msg" v-bind:key="index"></message-item>
    </ul>
  </div>
</template>

<script>
import MessageItem from '@/components/MessageItem';
require('vue2-animate/dist/vue2-animate.min.css');
export default {
  name: 'MessageContainer',
  props: {
    messages: Array
  },
  components: {
    'message-item': MessageItem
  }
}
</script>

<style scoped>
.message-container {
 border: 2px solid #000;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>