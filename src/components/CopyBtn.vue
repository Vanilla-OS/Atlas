<template>
    <button @click="copyToClipboard" class="button dark:text-white" :title="title">
        <span class="icon">
            <i class="material-icons" :class="extIconClasses" v-if="!isCopied">content_copy</i>
            <i class="material-icons" :class="extIconClasses" v-else>check</i>
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
        type: {
            type: String,
            default: "",
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
    computed: {
        extIconClasses() {
            let classes = "";

            if (this.type === "sm") {
                classes = "text-sm";
            } else if (this.type === "lg") {
                classes = "text-lg";
            }

            return classes;
        },
    },
});
</script>
