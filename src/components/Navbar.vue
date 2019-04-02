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
                        a.dropdown-item(@click="$emit('load')", href="#") Load
                        a.dropdown-item(@click="$emit('save')", href="#") Save
                        .dropdown-divider
                        a.dropdown-item(@click="$emit('calculate')", href="#") Calculate
            li.nav-item(:class="{ active: $route.name === 'editor' }")
                router-link.nav-link(:to="{ name: 'editor' }") Editor
            li.nav-item(:class="{ active: $route.name === 'settings' }")
                router-link.nav-link(:to="{ name: 'settings' }") Settings
            li.nav-item(:class="{ active: $route.name === 'preview' }")
                router-link.nav-link(:to="{ name: 'preview' }") Preview Data
</template>