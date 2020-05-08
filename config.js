/**
 * Created by sanshi on 3/22/20.
 */
module.exports = {
    HOST: '127.0.0.1',
    PORT: '3000',
    DB_HOST_PORT: 'mongodb://localhost:27017',
    DB_USE: 'searchTool',
    DB_COLLECTION_DATAS: 'datas',
    DB_COLLECTION_UNCONFIRMED: 'unconfirmedDatas',
    DB_COLLECTION_ADMIN: 'admin',
    DB_COLLECTION_FORTEST: 'forTest',
    apiKeys : ['foo', 'bar', 'baz'],

    table: {
      unconfirmedData: {
        // _id: 'ObjectId',
        urlOfMessage: 'String',
        srcOfMessage: 'String',
        date: 'String',
        trainNumber: 'String',
        type: 'Number',
        startPoint: 'String',
        endPoint: 'String',
        compartment: 'String',
        description: 'String',
        startTime: 'String',
        endTime: 'String',
        submitTime: 'String',
        //remark: 'String'
      },
        confirmedData: {
        // _id: 'ObjectId',
        urlOfMessage: 'String',
        srcOfMessage: 'String',
        date: 'String',
        trainNumber: 'String',
        type: 'Number',
        startPoint: 'String',
        endPoint: 'String',
        compartment: 'String',
        description: 'String',
        startTime: 'String',
        endTime: 'String',
        submitTime: 'String',
      },
      admin: {
        'username': 'String',
        'password': 'String'
      },
        feedback: {
          id: 'ObjectId',
          errInfo: [String] //不能是'Array'
        }
    }
}