const {createApp} = Vue

const app = createApp ({

    data(){
        return {
        
            eventos : [],

            eventosFuturos: [],
            catUpcoming: [],
            catUpcomingSet: [],
            categoryUpc: [],
            arrayCatUpcoming: [],
            categoryUpcomingData: [],
            

            eventosPasados: [],
            eventosPasadosSorted: [],
            capacity: [],
            catPast: [],
            catPastSet: [],
            categoryPast: [],
            arrayCatPast: [],
            categoryPastData: [],

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

                //para table1
                 //HAGO UN FILTRO CREANDO LA VARIABLE DE EVENTOS PASADOS, en relacion a asistencia (los eventos futuros solo tiene estimate, no assistance)
                this.eventosPasados = this.eventos.filter(evento => evento.assistance)
                    //MAPEO EL ARRAY TOMANDO LAS PROPIEDADES ASSISTANCE Y CAPACITY DE CADA OBJETO, 
                    //CALCULANDO EN LA VARIABLE PERCENTAGE EL PORCENTAJE DE AMBAS VARIABLES, 
                    //LAS FIXEO EN NUMEROS ENTEROS, 
                    //Y EN EL ULTIMO PASO AGREGO AL ARRAY de eventosPasados LA PROPIEDAD PERCENTAGE.
                this.eventosPasados.map(evento => {
                    let assistance = evento.assistance;
                    let capacity = evento.capacity;
                    let percentage = ((assistance / capacity) * 100).toFixed();
                    evento.percentage = percentage;
                });
                //AL FINAL HAGO UN SORT A eventosPasados TOMANDO COMO PARAMETRO LOS PERCENTAGE DE CADA ELEMENTO, PARA QUE ME LOS ORDENE DE MAYOR A MENOR.
                this.eventosPasadosSorted = this.eventosPasados.sort((a, b) => b.percentage - a.percentage);
                console.log(this.eventosPasadosSorted)
                //LUEGO HAGO UN FILTRO a data.events PARA EXTRAER LAS CAPACIDADES Y ORDENARLAS PARA SABER CUAL ES LA MAYOR
                this.capacity = this.eventos.filter(evento => evento.capacity).sort((a, b) => b.capacity - a.capacity);
                console.log(this.capacity)

                //para table2
                //CREO MI ARRAY PRINCIPAL DE eventosFuturos (como tienen la propiedad estimate es mas facil filtrarlos asi)
                this.eventosFuturos = this.eventos.filter(evento => evento.estimate);
                console.log(this.eventosFuturos)
                 //CREO UN ARRAY DE CATEGORIAS FUTURAS, LE APLICO SET PARA ELIMINAR REPETIDOS y ... PARA PASARLO A LISTA NUEVAMENTE ?
                this.catUpcoming = this.eventosFuturos.map(eventos => eventos.category);
                console.log(this.catUpcoming)
                this.catUpcomingSet = new Set(this.catUpcoming);
                console.log(this.catUpcomingSet)
                this.categoryUpc = [...this.catUpcomingSet];
                console.log(this.categoryUpc)
                //CREO ARRAY DE OBJETOS CON CATEGORIAS Y EL ARRAY DE EVENTOS
                this.categoryUpc.map(category =>
                this.arrayCatUpcoming.push({
                        category: category,
                        evento: this.eventosFuturos.filter(evento => evento.category === category),
                    }));
                console.log(this.categoryUpc)
                console.log(this.arrayCatUpcoming)
                
                //CREO UN ARRAY DE OBJETOS QUE CONTENGAN TODOS LOS ELEMENTOS NECESARIOS, CAPACITY, CATEGORY, ESTIMATE Y REVENUE
                this.arrayCatUpcoming.map(datos => {
                    this.categoryUpcomingData.push({
                        category: datos.category,
                        estimate: datos.evento.map(evento => evento.estimate),
                        capacity: datos.evento.map(evento => evento.capacity),
                        estimateRevenue: datos.evento.map(evento => evento.estimate * evento.price)
                    });
                });
                console.log(this.categoryUpcomingData)
                //SUMO EN CADA CATEGORIA LOS TOTALES DE ESTIMATE, CAPACITY Y ESTIMATE REVENUE
                this.categoryUpcomingData.forEach(category => {
                    let totalEstimate = 0;
                    category.estimate.forEach(estimate => totalEstimate += Number(estimate));
                    category.estimate = totalEstimate;
            
                    let totalCapacityUpc = 0;
                    category.capacity.forEach(capacity => totalCapacityUpc += Number(capacity));
                    category.capacity = totalCapacityUpc;
            
                    let totalEstimateRevenue = 0;
                    category.estimateRevenue.forEach(estimateRevenue => totalEstimateRevenue += Number(estimateRevenue))
                    category.estimateRevenue = totalEstimateRevenue;
            
                    category.porcentajeAttendace = ((totalEstimate * 100) / totalCapacityUpc).toFixed();
                })
                    console.log(this.categoryUpcomingData);

                 //para table3

                        //CREO UN ARRAY DE CATEGORIAS PASADAS, LE APLICO SET PARA ELIMINAR REPETIDOS

                    this.catPast = this.eventosPasados.map(eventos => eventos.category)
                    console.log(this.catPast)
                    this.catPastSet = new Set(this.catPast)
                    this.categoryPast = [...this.catPastSet]
                    console.log(this.categoryPast)

                    // //CREO ARRAY DE OBJETOS CON CATEGORIAS Y EL ARRAY DE EVENTOS PASADOS

                    this. categoryPast.map(category =>
                        this.arrayCatPast.push({
                            category: category,
                            evento: this.eventosPasados.filter(evento => evento.category === category),
                        }))
                    console.log(this.arrayCatPast)

                    // //CREO UN ARRAY DE OBJETOS QUE CONTENGAN TODOS LOS ELEMENTOS NECESARIOS, CAPACITY, CATEGORY, ASSISTANCE Y REVENUE

                    this.arrayCatPast.map(datos => {
                        this.categoryPastData.push({
                            category: datos.category,
                            assistance: datos.evento.map(evento => evento.assistance),
                            capacity: datos.evento.map(evento => evento.capacity),
                            revenue: datos.evento.map(evento => evento.assistance * evento.price)
                        })
                    })
                    console.log(this.categoryPastData)


                    //SUMO EN CADA CATEGORIA LOS TOTALES DE ESTIMATE, CAPACITY Y ESTIMATE REVENUE

                    this.categoryPastData.forEach(category => {
                        let totalAssistance = 0
                        category.assistance.forEach(assistance => totalAssistance += Number(assistance))
                        category.assistance = totalAssistance

                        let totalCapacityPast = 0
                        category.capacity.forEach(capacity => totalCapacityPast += Number(capacity))
                        category.capacity = totalCapacityPast

                        let totalRevenue = 0
                        category.revenue.forEach(revenue => totalRevenue += Number(revenue))
                        category.revenue = totalRevenue

                        category.attendancePerc = ((totalAssistance * 100) / totalCapacityPast).toFixed()
                    })
                    console.log(this.categoryPastData)
                                
            }
            )
            .catch( err => console.log( err ) )
    },

    // methods: {
       // aca van las funciones en caso de no usar computer

    
    computed : {


    } 
    
})

app.mount('#app')