const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {
    
    //Estos eventos se emiten cuando un cliente se conecta
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    socket.on('iniciar-control', (payload, callback) => {
        const iniciar = ticketControl.reiniciar(payload); 
        console.log(iniciar);
        //callback(iniciar);
    })

    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
        //TODO: Notificar que hay un nuevo ticket pendiente de asignar

    })

    socket.on('atender-ticket', ({escritorio}, callback ) => {
        if(!escritorio){
            return callback({
                ok: false, 
                msg: 'El escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket( escritorio );

        //TODO: Notificar cambio en los ultimos 4
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        socket.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

        if( !ticket ){
            callback({
                ok: false,
                msg: 'Ya no hay tickects pendientes'
            })
        }else{
            callback({
                ok: true,
                ticket
            })
        }
    })

}

module.exports = {
    socketController
}

