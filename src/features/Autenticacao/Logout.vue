<script>
    import {mapActions} from 'vuex'
    import router from '../../router';

    export default {
        name: 'logout',
        methods: {
            ...mapActions('Autenticacao', ['getLogout']),
        },
        mounted() {
            this.getLogout().then(() => {
                router.go('/login')
            });
        },
    }
</script>
