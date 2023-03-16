const {createApp} = Vue

const app = createApp ({

    data(){
        return {
            valorBusqueda : '',
            eventos : [],
            categorias : [],
            checked : [],
            eventosFiltrados : [],
            detalleCard: [],
            eventosFuturos: [],
            eventosFiltradosFut : [],
            categoriasFuturas : [],
            eventosPasados: [],
            eventosFiltradosPas : [],
            categoriasPasadas : []

        }
    },
    created(){
        fetch('https://mindhub-xj03.onrender.com/api/amazing')
            .then( response => response.json() )
            .then( ( data ) => { 
                this.eventos = data.events
                console.log(data)
                this.categorias = data.events.filter(evento => evento.category).map(evento => evento.category).filter( (evento, indice, arrayOriginal) => indice == arrayOriginal.indexOf(evento));
                this.eventosFiltrados = this.eventos

                // para details:
                const params = new URLSearchParams (location.search)
                console.log(params)
                const id = params.get("id")
                console.log(id)
                const $detalle = document.getElementById("detalle")
                console.log($detalle)
                this.detalleCard = data.events.find(evento => evento._id == id)
                console.log(this.detalleCard)

                // para upcoming:
                this.eventosFuturos = this.eventos.filter(evento => evento.date > data.currentDate)
                console.log(this.eventosFuturos)
                this.categoriasFuturas = this.eventosFuturos.filter(evento => evento.category).map(evento => evento.category).filter( (evento, indice, arrayOriginal) => indice == arrayOriginal.indexOf(evento));
                this.eventosFiltradosFut =  this.eventosFuturos 
            
                // para past:
                this.eventosPasados = this.eventos.filter(evento => evento.date < data.currentDate)
                console.log(this.eventosPasados)
                this.categoriasPasadas = this.eventosPasados.filter(evento => evento.category).map(evento => evento.category).filter( (evento, indice, arrayOriginal) => indice == arrayOriginal.indexOf(evento));
                this.eventosFiltradosPas =  this.eventosPasados

            }
            )
            .catch( err => console.log( err ) )
    },

    // methods: {
    //     // aca van las funciones en caso de no usar computer
    //     },
    
    computed : {
        filtro(){
            let filtradoBusqueda = this.eventos.filter(evento => evento.name.toLowerCase().includes( this.valorBusqueda.toLowerCase() ) )
            let filtradoCheck = filtradoBusqueda.filter( evento => this.checked.includes( evento.category ) || this.checked.length == 0 )
            this.eventosFiltrados = filtradoCheck
            console.log(filtradoCheck)
        }, 

        filtroFuturo(){
            
            let filtradoBusquedaFut = this.eventosFuturos.filter(evento => evento.name.toLowerCase().includes( this.valorBusqueda.toLowerCase() ) )
            let filtradoCheckFut = filtradoBusquedaFut.filter( evento => this.checked.includes( evento.category ) || this.checked.length == 0 )
            this.eventosFiltradosFut = filtradoCheckFut
            console.log(filtradoCheckFut)
        }, 

        filtroPasado(){
            
            let filtradoBusquedaPas = this.eventosPasados.filter(evento => evento.name.toLowerCase().includes( this.valorBusqueda.toLowerCase() ) )
            let filtradoCheckPas = filtradoBusquedaPas.filter( evento => this.checked.includes( evento.category ) || this.checked.length == 0 )
            this.eventosFiltradosPas = filtradoCheckPas
            console.log(filtradoCheckPas)
        }, 


    } 
    
})

app.mount('#app')