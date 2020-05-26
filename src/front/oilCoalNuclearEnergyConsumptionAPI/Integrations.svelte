<script>
    import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";

</script>

<body>
   
    <div class="container my-5 text-center">
        <button class="btn btn-danger w-100" onclick="traer()">Obtener</button>
        <div class="mt-5" id="contenido">
        </div>
    </div>

    <script>
        /* #contenido capturamos el id. Dentro de contenido guardamos ese div.*/
        var contenido = document.querySelector('#contenido')
        function traer() {
            fetch('https://randomuser.me/api/')
            .then(res => res.json())
            .then(data => {
                console.log(data.results['0'])
                /* Estas comillas de abajo nos permiten manejar templates literarios, podemos mezclar html y css*/
                contenido.innerHTML = `   
                <table class="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Email</th>
                            <th scope="col">Genero</th>
                            <th scope="col">Procedencia</th>
                            <th scope="col">Numero de tlf</th>
                            <th scope="col">Codigo Postal</th>
                            <th scope="col">Edad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${data.results['0'].name.last}</td>
                            <td>${data.results['0'].email}</td>
                            <td>${data.results['0'].gender}</td>
                            <td>${data.results['0'].location.country}</td>
                            <td>${data.results['0'].cell}</td>
                            <td>${data.results['0'].location.postcode}</td>
                            <td>${data.results['0'].registered.age}</td>
                        </tr>
                    </tbody>          
                `
            })
        } 
    </script>


</body>

<main>
    <button type="button"  class="btn btn-outline-dark" onclick="window.location.href='#/'"><i class="fas fa-chart-area"></i> 1</button>
    
    <Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
</main>