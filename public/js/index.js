//Referencia HTML

const btnReiniciar    = document.querySelector('button');

const socket = io();

btnReiniciar.addEventListener( 'click', () => {

    const iniciar = {
        ultimo: 0,
        hoy: new Date().getDate()+1,
        tickets: [],
        ultimos4: []
    }
    socket.emit( 'iniciar-control', iniciar, (hoy) => {
        console.log('Se reinicio la configuración para el dia' + hoy)
    });

    

});
