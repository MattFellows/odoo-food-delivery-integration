var Odoo = require('node-odoo');
 
var odoo = new Odoo({
  host: 'localhost',
  port: 8069,
  database: 'yummy-thai',
  username: 'yummythai@matt-fellows.me.uk',
  password: 'i39ftsuAbC'
});
 
// Connect to Odoo
odoo.connect(function (err) {
    if (err) { return console.log(err); }
 
    // Get sale 2
    odoo.get('sale.order', 2, function (err, orders) {
        if (err) { return console.log(err); }
        for (let i = 0; i < orders.length; i++) {
            console.log("Order Name: ", orders[i].name, "\nOrder State: ", orders[i].state);
        }
    });
    
    odoo.update('sale.order', 1, {'state': 'sale'}, function() {
        if (err) { return console.log(err); }
        console.log('Updated');
        odoo.get('sale.order', 2, function (err, orders) {
            if (err) { return console.log(err); }
            for (let i = 0; i < orders.length; i++) {
                console.log("Order Name: ", orders[i].name, "\nOrder State: ", orders[i].state);
            }
        });
    });
  //findModelByName(/order/ig);
});

function findModelByName(name) {
  for (var i =0; i < 1000; i++) {
    let j = i;
    setTimeout(function() {
        odoo.get('ir.model', j, function (err, models) {
            if (err) { return console.log(err); }
            if (models && models.length > 0) {
                if (models[0].name.match(name)) {
                    odoo.get('ir.model', j, function(err, models) {
                        if (err) { return console.log(err); }
                        console.log('Model [', j, ']: ', models[0]);
                    });
                }
            }
        });
    }, j * 50);
}
}