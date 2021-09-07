<template>
    <div class="container-custom">
        <header>
            <b-navbar toggleable="md" type="dark" variant="dark" fixed="top">
                <b-navbar-brand href="#">SGQ</b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav>
                        <b-nav-item href="/usuario" >Usuários</b-nav-item>
                        <b-nav-item href="/setor">Setores</b-nav-item>
                        <b-nav-item href="/processo">Processos</b-nav-item>
                        <b-nav-item href="/logout">Sair</b-nav-item>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </header>


        <main role="main" class="container mb-5 pb-5">
            <router-view/>
        </main>


        <div class="footer">
            <div class="container">
                <span class="text-muted">Sistema de Controle de Qualidade.</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app'
    }
</script>
