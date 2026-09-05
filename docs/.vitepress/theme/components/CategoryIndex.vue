<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import CategoryNode from './CategoryNode.vue'

const props = defineProps({
  groupKey: { type: String, required: true },
})

const { theme } = useData()
const group = computed(() => theme.value.homeData.groups.find(g => g.key === props.groupKey))
</script>

<template>
  <div class="category-index" v-if="group">
    <CategoryNode v-for="item in group.items" :key="item.link || item.title" :node="item" />
  </div>
</template>

<style scoped>
.category-index {
  margin-top: 24px;
}
</style>
