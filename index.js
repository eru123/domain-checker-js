const { installVendors } = require('./src/domain-checker');
const freenom = require('./src/vendor/freenom');
const namesilo = require('./src/vendor/namesilo');
const google = require('./src/vendor/google');

const search = installVendors({
    // 'Freenom': freenom,
    'Namesilo': namesilo,
    'Google': google,
})

search('example.com').then(res => console.log(res));