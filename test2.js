/**
 * Created by sanshi on 3/22/20.
 */
const dao = require('./utils/dao')
const crub = require('./utils/someFuncs').CRUB

// dao.save('mayError', { id: '5e775eac850be1738430a319', errInfo: ['a1a', 'a2a']}, function (err, res) {
//     if(err) throw err;
//     console.log(res)
// })


// dao.findByIdAndUpdate('mayError', '5eaa7e12a0cd034464c587a1', { $push: {errInfo: 'abc123'}}, function (err, res) {
//     if(err) throw err
//     console.log(res)
// })

crub.getMayErrorData(function (err, res) {
    if(err) throw err;
    console.log(res)
})