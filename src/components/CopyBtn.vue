<template>
    <button @click="copyToClipboard" class="button" :title="title">
        <span class="icon">
            <i class="material-icons" v-if="!isCopied">content_copy</i>
            <i class="material-icons" v-else>check</i>
        </span>
    </button>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "CopyBtn",
    props: {
        textToCopy: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            default: "Copy to clipboard",
        },
    },
    data() {
        return {
            isCopied: false,
        };
    },
    methods: {
        async copyToClipboard() {
            try {
                await navigator.clipboard.writeText(this.textToCopy);
                this.isCopied = true;
                setTimeout(() => {
                    this.isCopied = false;
                }, 2000);
            } catch (error) {
                console.error("Failed to copy:", error);
            }
        },
    },
});
</script>
