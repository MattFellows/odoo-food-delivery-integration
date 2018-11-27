const Promise = require('bluebird');
Promise.promisifyAll(require('node-odoo').prototype);
const Odoo = require('node-odoo');
const config = require('./config/config');
const express = require('express');
const odoo = new Odoo(config);

const port = process.env.port || 3000;

this.app = express();
this.router = express.Router();

this.router.get('/api/pending-orders', (req, res) => {
    return getPendingOrders(req, res);
});

this.router.get('/api/accepted-orders', (req, res) => {
    return getAcceptedOrders(req, res);
});

this.router.get('/api/out-for-delivery-orders', (req, res) => {
    return getOrdersOutForDelivery(req, res);
});

this.router.get('/api/complete-orders', (req, res) => {
    return getCompleteOrders(req, res);
});

this.router.put('/api/accept-order/:orderid', (req, res) => {
    return acceptOrder(req, res);
});

this.router.put('/api/deliver-order/:orderid', (req, res) => {
    return deliverOrder(req, res);
});

this.router.put('/api/complete-order/:orderid', (req, res) => {
    return completeOrder(req, res);
});

this.app.use(this.router);

this.app.listen(port, (err) => {
    if (err) {
        return console.log(err)
    }

    return console.log(`Server is listening on ${port}`)
});


function getPendingOrders(req, res) {
    let orderstate = 'sale';
    getOrdersInState(orderstate, res);
}

function getAcceptedOrders(req, res) {
    let orderstate = 'accepted';
    getOrdersInState(orderstate, res);
}

function getOrdersOutForDelivery(req, res) {
    let orderstate = 'out-for-delivery';
    getOrdersInState(orderstate, res);
}

function getCompleteOrders(req, res) {
    let orderstate = 'delivered';
    getOrdersInState(orderstate, res);
}


function getOrdersInState(orderstate, res) {
// Connect to Odoo
    odoo.connectAsync().then(() => {

        // Get sale 2
        return odoo.searchAsync('sale.order', [['state', '=', orderstate]]);
    }).then((orders) => {
        let orderRequests = [];
        for (let i = 0; i < orders.length; i++) {
            orderRequests.push(odoo.getAsync('sale.order', orders[i]));
        }
        return Promise.all(orderRequests);
    }).then((orders) => {
        console.log(orders.map((o) => {
            return o[0]
        }));
        return res.json({
            orders: orders.map((o) => {
                return o[0]
            })
        });
    }).catch((err) => {
        console.error(err);
        res.statusCode(500);
    });
}


function acceptOrder(req, res) {
    let newState = 'accepted';
    updateStateOfOrder(req, newState, res);
}

function deliverOrder(req, res) {
    let newState = 'out-for-delivery';
    updateStateOfOrder(req, newState, res);
}

function completeOrder(req, res) {
    let newState = 'delivered';
    updateStateOfOrder(req, newState, res);
}


function updateStateOfOrder(req, newState, res) {
    // Connect to Odoo
    odoo.connectAsync().then(() => {

        // Get sale 2
        return odoo.updateAsync('sale.order', parseInt(req.params.orderid, 10), {'state': newState});
    }).then((updated) => {
        res.json({updated: true});
    }).catch((err) => {
        console.error(err);
        res.statusCode(500);
    });
}

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