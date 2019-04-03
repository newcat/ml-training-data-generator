<template lang="pug">
nav.navbar.navbar-dark.bg-secondary.navbar-expand-lg
    .navbar-brand ML Training Data Generator
    button.navbar-toggler(type="button", data-toggle="collapse", data-target="#navbarCollapse")
        span.navbar-toggler-icon
    #navbarCollapse.collapse.navbar-collapse
        ul.navbar-nav.mr-auto.ml-2
            li.nav-item.dropdown
                a#fileDropdown.nav-link.dropdown-toggle(role="button", data-toggle="dropdown") File
                    .dropdown-menu
                        a.dropdown-item(@click="$emit('load')", href="#") Load
                        a.dropdown-item(@click="$emit('save')", href="#") Save
            li.nav-item
                a.nav-link(@click="$emit('calculate')", href="#") Calculate
            li.nav-item
                router-link.nav-link(:to="{ name: 'settings' }") Settings
            li.nav-item
                router-link.nav-link(:to="{ name: 'visualisation' }") Visualisation
</template>