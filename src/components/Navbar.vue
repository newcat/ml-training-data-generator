<template lang="pug">
nav.navbar.navbar-dark.bg-secondary.navbar-expand-lg
    .navbar-brand ML Training Data Generator
    button.navbar-toggler(type="button", data-toggle="collapse", data-target="#navbarCollapse")
        span.navbar-toggler-icon
    #navbarCollapse.collapse.navbar-collapse
        ul.navbar-nav.mr-auto.ml-2
            li.nav-item.dropdown
                a#actionDropdown.nav-link.dropdown-toggle(role="button", data-toggle="dropdown", href="#") Actions
                    .dropdown-menu
                        a.dropdown-item(@click="$emit('action', 'load')", href="#") Load
                        a.dropdown-item(@click="$emit('action', 'save')", href="#") Save
                        .dropdown-divider
                        a.dropdown-item(@click="$emit('action', 'calculate')", href="#") Calculate
                        a.dropdown-item(@click="$emit('action', 'export')", href="#") Export to CSV
            li.nav-item(:class="{ active: $route.name === 'editor' }")
                router-link.nav-link(:to="{ name: 'editor' }") Editor
            li.nav-item(:class="{ active: $route.name === 'settings' }")
                router-link.nav-link(:to="{ name: 'settings' }") Settings
            li.nav-item(:class="{ active: $route.name === 'preview' }")
                router-link.nav-link(:to="{ name: 'preview' }") Preview Data
            li.nav-item
                router-link.nav-link(:to="{ name: 'visualisation' }") Visualisation
        div.text-light {{ loadedRows }} rows loaded
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Navbar extends Vue {

    @Prop({ default: 0 })
    loadedRows!: number;

}
</script>
